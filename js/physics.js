/*
 * Tiny 2D rigid-body engine (a Box2D-Lite style sequential-impulse solver).
 * Zero dependencies. Works in the browser (window.Phys) and in Node (globalThis.Phys).
 * Coordinates are y-down (matches canvas). Shapes: oriented boxes and circles.
 */
(function (root) {
  'use strict';

  var EDGE1 = 1, EDGE2 = 2, EDGE3 = 3, EDGE4 = 4, NO_EDGE = 0;
  var nextId = 1;

  function Body(o) {
    this.id = nextId++;
    this.x = o.x || 0; this.y = o.y || 0; this.a = o.a || 0;
    this.vx = o.vx || 0; this.vy = o.vy || 0; this.w = o.w || 0;
    this.friction = o.friction == null ? 0.5 : o.friction;
    this.restitution = o.restitution || 0;
    this.shape = o.circle ? { type: 'circle', r: o.circle } : { type: 'box', hw: o.hw, hh: o.hh };
    this.radius = o.circle ? o.circle : Math.sqrt(o.hw * o.hw + o.hh * o.hh);
    this.isStatic = !!o.isStatic || !(o.density > 0);
    if (this.isStatic) { this.mass = Infinity; this.invMass = 0; this.invI = 0; }
    else {
      var area = o.circle ? Math.PI * o.circle * o.circle : 4 * o.hw * o.hh;
      this.mass = area * o.density;
      var I = o.circle ? 0.5 * this.mass * o.circle * o.circle
                       : this.mass * (4 * o.hw * o.hw + 4 * o.hh * o.hh) / 12;
      this.invMass = 1 / this.mass; this.invI = 1 / I;
    }
    this._im = this.invMass; this._ii = this.invI;
    this.asleep = !!o.asleep;
    if (this.asleep && !this.isStatic) { this.invMass = 0; this.invI = 0; }
    this.sleepT = 0;
    this.userData = o.userData || null;
    this.neverSleep = !!o.neverSleep;
    this.sensor = !!o.sensor;           // reports overlaps through world.onSensor, never pushes anything
    this.manualWake = !!o.manualWake;   // only wakes when the game says so (a raised wrecking ball, a latched toy)
    this.ghost = !!o.ghost;             // debris: collides with static geometry only
  }
  Body.prototype.sleep = function () {
    if (this.isStatic || this.asleep) return;
    this.asleep = true; this.invMass = 0; this.invI = 0;
    this.vx = this.vy = this.w = 0;
  };
  Body.prototype.wake = function () {
    if (this.isStatic || !this.asleep) return;
    this.asleep = false; this.invMass = this._im; this.invI = this._ii; this.sleepT = 0;
  };

  // ---- collision -----------------------------------------------------------
  function ClipVertex(x, y, fp) { this.x = x; this.y = y; this.fp = fp; }
  function fpCopy(f) { return { i1: f.i1, o1: f.o1, i2: f.i2, o2: f.o2 }; }
  function fpKey(f) { return f.i1 + f.o1 * 5 + f.i2 * 25 + f.o2 * 125; }

  function clipSegmentToLine(vIn, nx, ny, offset, clipEdge) {
    var out = [];
    var d0 = nx * vIn[0].x + ny * vIn[0].y - offset;
    var d1 = nx * vIn[1].x + ny * vIn[1].y - offset;
    if (d0 <= 0) out.push(vIn[0]);
    if (d1 <= 0) out.push(vIn[1]);
    if (d0 * d1 < 0) {
      var t = d0 / (d0 - d1);
      var v = new ClipVertex(vIn[0].x + t * (vIn[1].x - vIn[0].x), vIn[0].y + t * (vIn[1].y - vIn[0].y), null);
      if (d0 > 0) { v.fp = fpCopy(vIn[0].fp); v.fp.i1 = clipEdge; v.fp.i2 = NO_EDGE; }
      else { v.fp = fpCopy(vIn[1].fp); v.fp.o1 = clipEdge; v.fp.o2 = NO_EDGE; }
      out.push(v);
    }
    return out;
  }

  function incidentEdge(hx, hy, px, py, c, s, nx, ny) {
    // n = -(Rot^T * normal)
    var lx = -(c * nx + s * ny), ly = -(-s * nx + c * ny);
    var v0, v1, f0, f1;
    function mk(x, y, i2, o2) { return { x: x, y: y, fp: { i1: NO_EDGE, o1: NO_EDGE, i2: i2, o2: o2 } }; }
    if (Math.abs(lx) > Math.abs(ly)) {
      if (lx > 0) { v0 = mk(hx, -hy, EDGE3, EDGE4); v1 = mk(hx, hy, EDGE4, EDGE1); }
      else { v0 = mk(-hx, hy, EDGE1, EDGE2); v1 = mk(-hx, -hy, EDGE2, EDGE3); }
    } else {
      if (ly > 0) { v0 = mk(hx, hy, EDGE4, EDGE1); v1 = mk(-hx, hy, EDGE1, EDGE2); }
      else { v0 = mk(-hx, -hy, EDGE2, EDGE3); v1 = mk(hx, -hy, EDGE3, EDGE4); }
    }
    return [v0, v1].map(function (v) {
      return new ClipVertex(px + c * v.x - s * v.y, py + s * v.x + c * v.y, v.fp);
    });
  }

  // returns contacts with normal pointing from A to B
  function collideBoxBox(A, B) {
    var hAx = A.shape.hw, hAy = A.shape.hh, hBx = B.shape.hw, hBy = B.shape.hh;
    var cA = Math.cos(A.a), sA = Math.sin(A.a), cB = Math.cos(B.a), sB = Math.sin(B.a);
    var dpx = B.x - A.x, dpy = B.y - A.y;
    var dAx = cA * dpx + sA * dpy, dAy = -sA * dpx + cA * dpy;
    var dBx = cB * dpx + sB * dpy, dBy = -sB * dpx + cB * dpy;
    var d = B.a - A.a, ac = Math.abs(Math.cos(d)), as = Math.abs(Math.sin(d));
    var faceAx = Math.abs(dAx) - hAx - (ac * hBx + as * hBy);
    var faceAy = Math.abs(dAy) - hAy - (as * hBx + ac * hBy);
    if (faceAx > 0 || faceAy > 0) return [];
    var faceBx = Math.abs(dBx) - (ac * hAx + as * hAy) - hBx;
    var faceBy = Math.abs(dBy) - (as * hAx + ac * hAy) - hBy;
    if (faceBx > 0 || faceBy > 0) return [];

    var axis = 0, sep = faceAx, nx, ny;
    if (dAx > 0) { nx = cA; ny = sA; } else { nx = -cA; ny = -sA; }
    var relTol = 0.95, absTol = 0.01;
    if (faceAy > relTol * sep + absTol * hAy) {
      axis = 1; sep = faceAy;
      if (dAy > 0) { nx = -sA; ny = cA; } else { nx = sA; ny = -cA; }
    }
    if (faceBx > relTol * sep + absTol * hBx) {
      axis = 2; sep = faceBx;
      if (dBx > 0) { nx = cB; ny = sB; } else { nx = -cB; ny = -sB; }
    }
    if (faceBy > relTol * sep + absTol * hBy) {
      axis = 3; sep = faceBy;
      if (dBy > 0) { nx = -sB; ny = cB; } else { nx = sB; ny = -cB; }
    }

    var fnx, fny, front, snx, sny, negSide, posSide, negEdge, posEdge, inc, side;
    if (axis === 0) {
      fnx = nx; fny = ny; front = A.x * fnx + A.y * fny + hAx;
      snx = -sA; sny = cA; side = A.x * snx + A.y * sny;
      negSide = -side + hAy; posSide = side + hAy; negEdge = EDGE3; posEdge = EDGE1;
      inc = incidentEdge(hBx, hBy, B.x, B.y, cB, sB, fnx, fny);
    } else if (axis === 1) {
      fnx = nx; fny = ny; front = A.x * fnx + A.y * fny + hAy;
      snx = cA; sny = sA; side = A.x * snx + A.y * sny;
      negSide = -side + hAx; posSide = side + hAx; negEdge = EDGE2; posEdge = EDGE4;
      inc = incidentEdge(hBx, hBy, B.x, B.y, cB, sB, fnx, fny);
    } else if (axis === 2) {
      fnx = -nx; fny = -ny; front = B.x * fnx + B.y * fny + hBx;
      snx = -sB; sny = cB; side = B.x * snx + B.y * sny;
      negSide = -side + hBy; posSide = side + hBy; negEdge = EDGE3; posEdge = EDGE1;
      inc = incidentEdge(hAx, hAy, A.x, A.y, cA, sA, fnx, fny);
    } else {
      fnx = -nx; fny = -ny; front = B.x * fnx + B.y * fny + hBy;
      snx = cB; sny = sB; side = B.x * snx + B.y * sny;
      negSide = -side + hBx; posSide = side + hBx; negEdge = EDGE2; posEdge = EDGE4;
      inc = incidentEdge(hAx, hAy, A.x, A.y, cA, sA, fnx, fny);
    }
    var c1 = clipSegmentToLine(inc, -snx, -sny, negSide, negEdge);
    if (c1.length < 2) return [];
    var c2 = clipSegmentToLine(c1, snx, sny, posSide, posEdge);
    if (c2.length < 2) return [];

    var out = [];
    for (var i = 0; i < 2; i++) {
      var s = fnx * c2[i].x + fny * c2[i].y - front;
      if (s <= 0) {
        var fp = fpCopy(c2[i].fp);
        if (axis >= 2) { var t = fp.i1; fp.i1 = fp.i2; fp.i2 = t; t = fp.o1; fp.o1 = fp.o2; fp.o2 = t; }
        out.push({ px: c2[i].x - s * fnx, py: c2[i].y - s * fny, nx: nx, ny: ny, sep: s, feature: fpKey(fp) });
      }
    }
    return out;
  }

  // circle C vs box B. Returns normal from C to B.
  function collideCircleBox(C, B, flip) {
    var r = C.shape.r, hx = B.shape.hw, hy = B.shape.hh;
    var c = Math.cos(B.a), s = Math.sin(B.a);
    var dx = C.x - B.x, dy = C.y - B.y;
    var px = c * dx + s * dy, py = -s * dx + c * dy; // circle centre in box space
    var qx = Math.max(-hx, Math.min(hx, px)), qy = Math.max(-hy, Math.min(hy, py));
    var lnx, lny, sep;
    if (px === qx && py === qy) { // centre inside
      var ex = hx - Math.abs(px), ey = hy - Math.abs(py);
      if (ex < ey) { qx = px >= 0 ? hx : -hx; lnx = px >= 0 ? 1 : -1; lny = 0; sep = -ex - r; }
      else { qy = py >= 0 ? hy : -hy; lny = py >= 0 ? 1 : -1; lnx = 0; sep = -ey - r; }
    } else {
      var ddx = px - qx, ddy = py - qy, dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist > r) return [];
      lnx = ddx / dist; lny = ddy / dist; sep = dist - r;
    }
    // world normal pointing box -> circle
    var wnx = c * lnx - s * lny, wny = s * lnx + c * lny;
    var wx = B.x + c * qx - s * qy, wy = B.y + s * qx + c * qy;
    // normal must point from first body to second. circle is "first" unless flip
    if (flip) return [{ px: wx, py: wy, nx: wnx, ny: wny, sep: sep, feature: 0 }]; // box first -> circle second
    return [{ px: wx, py: wy, nx: -wnx, ny: -wny, sep: sep, feature: 0 }];
  }

  function collideCircleCircle(A, B) {
    var dx = B.x - A.x, dy = B.y - A.y, d = Math.sqrt(dx * dx + dy * dy);
    var rr = A.shape.r + B.shape.r;
    if (d > rr) return [];
    var nx = d > 1e-9 ? dx / d : 0, ny = d > 1e-9 ? dy / d : -1;
    var sep = d - rr;
    return [{ px: A.x + nx * (A.shape.r + sep * 0.5), py: A.y + ny * (A.shape.r + sep * 0.5), nx: nx, ny: ny, sep: sep, feature: 0 }];
  }

  function collide(A, B) {
    var ac = A.shape.type === 'circle', bc = B.shape.type === 'circle';
    if (ac && bc) return collideCircleCircle(A, B);
    if (ac) return collideCircleBox(A, B, false);
    if (bc) return collideCircleBox(B, A, true);
    return collideBoxBox(A, B);
  }

  // ---- arbiter -------------------------------------------------------------
  var BIAS = 0.2, SLOP = 0.01, MAX_BIAS = 12, MAX_SPEED = 42;

  function Arbiter(A, B) {
    this.A = A; this.B = B; this.contacts = [];
    this.friction = Math.sqrt(A.friction * B.friction);
    this.restitution = Math.max(A.restitution, B.restitution);
    this.impulse = 0;
  }
  Arbiter.prototype.update = function (fresh) {
    var old = this.contacts, merged = [];
    for (var i = 0; i < fresh.length; i++) {
      var c = fresh[i]; c.Pn = 0; c.Pt = 0; c.Pnb = 0;
      for (var j = 0; j < old.length; j++) {
        if (old[j].feature === c.feature) { c.Pn = old[j].Pn; c.Pt = old[j].Pt; break; }
      }
      merged.push(c);
    }
    this.contacts = merged;
  };
  Arbiter.prototype.preStep = function (invDt) {
    var A = this.A, B = this.B;
    for (var i = 0; i < this.contacts.length; i++) {
      var c = this.contacts[i];
      c.r1x = c.px - A.x; c.r1y = c.py - A.y; c.r2x = c.px - B.x; c.r2y = c.py - B.y;
      var rn1 = c.r1x * c.nx + c.r1y * c.ny, rn2 = c.r2x * c.nx + c.r2y * c.ny;
      var kN = A.invMass + B.invMass + A.invI * (c.r1x * c.r1x + c.r1y * c.r1y - rn1 * rn1)
             + B.invI * (c.r2x * c.r2x + c.r2y * c.r2y - rn2 * rn2);
      c.massN = kN > 0 ? 1 / kN : 0;
      var tx = c.ny, ty = -c.nx;
      var rt1 = c.r1x * tx + c.r1y * ty, rt2 = c.r2x * tx + c.r2y * ty;
      var kT = A.invMass + B.invMass + A.invI * (c.r1x * c.r1x + c.r1y * c.r1y - rt1 * rt1)
             + B.invI * (c.r2x * c.r2x + c.r2y * c.r2y - rt2 * rt2);
      c.massT = kT > 0 ? 1 / kT : 0;
      c.bias = Math.min(MAX_BIAS, -BIAS * invDt * Math.min(0, c.sep + SLOP));
      // restitution from approach speed
      var dvx = B.vx - B.w * c.r2y - A.vx + A.w * c.r1y, dvy = B.vy + B.w * c.r2x - A.vy - A.w * c.r1x;
      var vn = dvx * c.nx + dvy * c.ny;
      c.rest = vn < -1.5 ? -this.restitution * vn : 0;
      c.Pnb = 0;
      // warm start
      var Px = c.Pn * c.nx + c.Pt * tx, Py = c.Pn * c.ny + c.Pt * ty;
      A.vx -= A.invMass * Px; A.vy -= A.invMass * Py; A.w -= A.invI * (c.r1x * Py - c.r1y * Px);
      B.vx += B.invMass * Px; B.vy += B.invMass * Py; B.w += B.invI * (c.r2x * Py - c.r2y * Px);
    }
  };
  Arbiter.prototype.applyImpulse = function () {
    var A = this.A, B = this.B;
    for (var i = 0; i < this.contacts.length; i++) {
      var c = this.contacts[i];
      var dvx = B.vx - B.w * c.r2y - A.vx + A.w * c.r1y, dvy = B.vy + B.w * c.r2x - A.vy - A.w * c.r1x;
      var vn = dvx * c.nx + dvy * c.ny;
      var dPn = c.massN * (-vn + Math.max(c.bias, c.rest));
      var Pn0 = c.Pn; c.Pn = Math.max(Pn0 + dPn, 0); dPn = c.Pn - Pn0;
      var Px = dPn * c.nx, Py = dPn * c.ny;
      A.vx -= A.invMass * Px; A.vy -= A.invMass * Py; A.w -= A.invI * (c.r1x * Py - c.r1y * Px);
      B.vx += B.invMass * Px; B.vy += B.invMass * Py; B.w += B.invI * (c.r2x * Py - c.r2y * Px);

      dvx = B.vx - B.w * c.r2y - A.vx + A.w * c.r1y; dvy = B.vy + B.w * c.r2x - A.vy - A.w * c.r1x;
      var tx = c.ny, ty = -c.nx;
      var vt = dvx * tx + dvy * ty;
      var dPt = c.massT * (-vt);
      var maxPt = this.friction * c.Pn, Pt0 = c.Pt;
      c.Pt = Math.max(-maxPt, Math.min(maxPt, Pt0 + dPt)); dPt = c.Pt - Pt0;
      Px = dPt * tx; Py = dPt * ty;
      A.vx -= A.invMass * Px; A.vy -= A.invMass * Py; A.w -= A.invI * (c.r1x * Py - c.r1y * Px);
      B.vx += B.invMass * Px; B.vy += B.invMass * Py; B.w += B.invI * (c.r2x * Py - c.r2y * Px);
    }
  };

  // ---- hinge: pins a point on one body to a fixed point in the world ---------
  function Hinge(body, ax, ay) {
    this.b = body; this.ax = ax; this.ay = ay; this.Px = 0; this.Py = 0;
    var c = Math.cos(body.a), s = Math.sin(body.a), dx = ax - body.x, dy = ay - body.y;
    this.lx = c * dx + s * dy; this.ly = -s * dx + c * dy;
  }
  Hinge.prototype.preStep = function (invDt) {
    var b = this.b;
    if (b.invMass === 0) { this.Px = this.Py = 0; this.off = true; return; }
    this.off = false;
    var c = Math.cos(b.a), s = Math.sin(b.a), rx = c * this.lx - s * this.ly, ry = s * this.lx + c * this.ly;
    var im = b.invMass, ii = b.invI;
    var k11 = im + ii * ry * ry, k12 = -ii * rx * ry, k22 = im + ii * rx * rx, det = k11 * k22 - k12 * k12;
    this.m11 = k22 / det; this.m12 = -k12 / det; this.m22 = k11 / det;
    this.rx = rx; this.ry = ry;
    this.bx = BIAS * invDt * (this.ax - (b.x + rx)); this.by = BIAS * invDt * (this.ay - (b.y + ry));
    b.vx += im * this.Px; b.vy += im * this.Py; b.w += ii * (rx * this.Py - ry * this.Px);
  };
  Hinge.prototype.apply = function () {
    if (this.off) return;
    var b = this.b, rx = this.rx, ry = this.ry;
    var dvx = this.bx - (b.vx - b.w * ry), dvy = this.by - (b.vy + b.w * rx);
    var ix = this.m11 * dvx + this.m12 * dvy, iy = this.m12 * dvx + this.m22 * dvy;
    this.Px += ix; this.Py += iy;
    b.vx += b.invMass * ix; b.vy += b.invMass * iy; b.w += b.invI * (rx * iy - ry * ix);
  };

  // ---- world ---------------------------------------------------------------
  function World(o) {
    o = o || {};
    this.gx = 0; this.gy = o.gravity == null ? 9.8 : o.gravity;
    this.bodies = []; this.arbiters = {}; this.hinges = []; this._ev = [];
    this.iterations = o.iterations || 12;
    this.substeps = o.substeps || 2;
    this.onImpact = null; // (bodyA, bodyB, x, y, impulse)
    this.onSensor = null; // (sensorBody, otherBody)
  }
  World.prototype.add = function (b) { this.bodies.push(b); return b; };
  World.prototype.remove = function (b) {
    var i = this.bodies.indexOf(b); if (i >= 0) this.bodies.splice(i, 1);
    for (var k in this.arbiters) if (this.arbiters[k].A === b || this.arbiters[k].B === b) delete this.arbiters[k];
    this.hinges = this.hinges.filter(function (h) { return h.b !== b; });
  };
  World.prototype.clear = function () { this.bodies.length = 0; this.arbiters = {}; this.hinges = []; this._ev = []; };
  World.prototype.hinge = function (b, ax, ay) { var h = new Hinge(b, ax, ay); this.hinges.push(h); return h; };
  World.prototype._dropArbiters = function (b) {
    for (var k in this.arbiters) if (this.arbiters[k].A === b || this.arbiters[k].B === b) delete this.arbiters[k];
  };
  /** Wake everything near a point, e.g. after removing something that other bodies may have been resting on. */
  World.prototype.wakeNear = function (x, y, r) {
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.asleep || b.manualWake) continue;
      var dx = b.x - x, dy = b.y - y, rr = r + b.radius;
      if (dx * dx + dy * dy < rr * rr) { b.wake(); this._dropArbiters(b); }
    }
  };
  /** Tear a fixed piece loose so it can be flung around. The machine is rebuilt from its recipe afterwards. */
  World.prototype.unpin = function (b, density) {
    if (!b.isStatic || b.sensor) return false;
    density = density || 0.35;
    var c = b.shape.type === 'circle', hw = b.shape.hw, hh = b.shape.hh, r = b.shape.r;
    var m = (c ? Math.PI * r * r : 4 * hw * hh) * density;
    var I = c ? 0.5 * m * r * r : m * (4 * hw * hw + 4 * hh * hh) / 12;
    b.isStatic = false; b.mass = m; b.invMass = 1 / m; b.invI = 1 / I; b._im = b.invMass; b._ii = b.invI;
    b.asleep = false; b.sleepT = 0;
    return true;
  };
  /** Radial blast: a velocity change that falls off with distance, so light dominoes and heavy marbles both react. */
  World.prototype.explode = function (x, y, r, power) {
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (b.isStatic || b.sensor) continue;
      var dx = b.x - x, dy = b.y - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d > r) continue;
      if (b.asleep) { if (b.manualWake) b.manualWake = false; b.wake(); this._dropArbiters(b); }
      var f = power * (1 - d / r), nx = d > 1e-4 ? dx / d : 0, ny = d > 1e-4 ? dy / d : -1;
      b.vx += nx * f; b.vy += ny * f - f * 0.25;
      b.w += (dx >= 0 ? 1 : -1) * f * 0.8;
    }
  };

  World.prototype.step = function (dt) {
    var h = dt / this.substeps;
    for (var s = 0; s < this.substeps; s++) this._sub(h);
  };

  World.prototype._sub = function (dt) {
    var bodies = this.bodies, n = bodies.length, i, j, k;
    var seen = {};
    // Only awake dynamic bodies can start a collision, so cost scales with activity, not with contraption size.
    var awake = [];
    for (i = 0; i < n; i++) if (bodies[i].invMass !== 0) awake.push(bodies[i]);

    // wake pass: a sleeping body is woken (before any contact is built) when a moving body's bounds touch it.
    // Cached impulses are dropped, since they were computed while it acted like an immovable body.
    for (i = 0; i < awake.length; i++) {
      var M = awake[i];
      if (!M.neverSleep && M.vx * M.vx + M.vy * M.vy < 0.0036 && Math.abs(M.w) < 0.15) continue;
      for (j = 0; j < n; j++) {
        var S = bodies[j];
        if (!S.asleep || S.manualWake) continue;
        var wx = S.x - M.x, wy = S.y - M.y, wr = S.radius + M.radius + 0.05;
        if (wx * wx + wy * wy > wr * wr) continue;
        S.wake();
        for (k in this.arbiters) if (this.arbiters[k].A === S || this.arbiters[k].B === S) delete this.arbiters[k];
      }
    }
    awake = [];
    for (i = 0; i < n; i++) if (bodies[i].invMass !== 0) awake.push(bodies[i]);

    // broadphase + narrowphase
    for (i = 0; i < awake.length; i++) {
      var A = awake[i];
      for (j = 0; j < n; j++) {
        var B = bodies[j];
        if (B === A || (B.invMass !== 0 && B.id < A.id)) continue; // awake-awake pairs are visited once
        var dx = B.x - A.x, dy = B.y - A.y, rr = A.radius + B.radius + 0.02;
        if (dx * dx + dy * dy > rr * rr) continue;
        if (A.ghost && !B.isStatic) continue;
        if (B.ghost && !A.isStatic) continue;
        if (A.sensor || B.sensor) {
          if ((A.sensor && B.sensor) || !collide(A, B).length) continue;
          this._ev.push(A.sensor ? [0, A, B] : [0, B, A]);
          continue;
        }
        var P = A.id < B.id ? A : B, Q = A.id < B.id ? B : A;
        var contacts = collide(P, Q);
        var key = P.id * 100003 + Q.id;
        if (contacts.length) {
          var arb = this.arbiters[key];
          if (!arb) { arb = this.arbiters[key] = new Arbiter(P, Q); }
          arb.update(contacts);
          seen[key] = true;
        }
      }
    }
    for (k in this.arbiters) if (!seen[k]) delete this.arbiters[k];

    // forces
    for (i = 0; i < n; i++) {
      var b = bodies[i];
      if (b.invMass === 0) continue;
      b.vx += this.gx * dt; b.vy += this.gy * dt;
      b.w *= 0.9995;
    }
    var invDt = 1 / dt, arbs = [];
    for (k in this.arbiters) arbs.push(this.arbiters[k]);
    var hs = this.hinges;
    for (i = 0; i < arbs.length; i++) arbs[i].preStep(invDt);
    for (i = 0; i < hs.length; i++) hs[i].preStep(invDt);
    for (var it = 0; it < this.iterations; it++) {
      for (i = 0; i < arbs.length; i++) arbs[i].applyImpulse();
      for (i = 0; i < hs.length; i++) hs[i].apply();
    }

    // impact reporting
    if (this.onImpact) {
      for (i = 0; i < arbs.length; i++) {
        var ar = arbs[i], tot = 0, cx = 0, cy = 0;
        for (j = 0; j < ar.contacts.length; j++) { tot += ar.contacts[j].Pn; cx += ar.contacts[j].px; cy += ar.contacts[j].py; }
        var prev = ar.impulse; ar.impulse = tot;
        if (tot > 0.05 && prev < 0.02 && ar.contacts.length) this._ev.push([1, ar.A, ar.B, cx / ar.contacts.length, cy / ar.contacts.length, tot]);
      }
    }

    // integrate + sleep
    for (i = 0; i < n; i++) {
      var d = bodies[i];
      if (d.invMass === 0) continue;
      var sp = d.vx * d.vx + d.vy * d.vy;
      if (sp > MAX_SPEED * MAX_SPEED) { var cap = MAX_SPEED / Math.sqrt(sp); d.vx *= cap; d.vy *= cap; sp = MAX_SPEED * MAX_SPEED; }
      d.x += d.vx * dt; d.y += d.vy * dt; d.a += d.w * dt;
      if (!d.neverSleep && sp < 0.003 && d.w * d.w < 0.01) { d.sleepT += dt; if (d.sleepT > 0.6) d.sleep(); }
      else d.sleepT = 0;
    }

    // events fire last: handlers are free to add and remove bodies
    if (this._ev.length) {
      var ev = this._ev; this._ev = [];
      for (i = 0; i < ev.length; i++) {
        var e = ev[i];
        if (e[0] === 0) { if (this.onSensor) this.onSensor(e[1], e[2]); }
        else if (this.onImpact) this.onImpact(e[1], e[2], e[3], e[4], e[5]);
      }
    }
  };

  root.Phys = { Body: Body, World: World };
})(typeof window !== 'undefined' ? window : globalThis);
