/*
 * A break: one item from the chest, turned loose on the machine for a limited time. Anything goes, including tearing the
 * machine apart, because when the break ends the game rebuilds it from its recipe and the pieces fly home.
 * Works headlessly with no hooks at all (tests/playground-test.mjs); the renderer and sound come in through `hooks`.
 */
(function (root) {
  'use strict';
  var Phys = root.Phys, Track = root.Track;
  var NOOP = function () {};
  var NULL_RENDER = { boom: NOOP, sparks: NOOP, ring: NOOP, kick: NOOP, lamp: NOOP, float: NOOP, parts: { add: NOOP }, fx: { wave: NOOP, setGrid: NOOP } };
  var NULL_SOUND = new Proxy({}, { get: function () { return NOOP; } });
  // pieces of the machine that can be torn loose
  var BREAKABLE = { platform: 1, wall: 1, stop: 1, pivot: 1, pad: 1, padbase: 1, cannonbase: 1, hopper: 1, peg: 1, gate: 1 };

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function f(t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    return [f(h + 1 / 3) * 1.6, f(h) * 1.6, f(h - 1 / 3) * 1.6];
  }

  function Playground(track, id, hooks) {
    hooks = hooks || {};
    this.track = track; this.world = track.world; this.id = id;
    this.R = hooks.renderer || NULL_RENDER;
    this.S = hooks.sound || NULL_SOUND;
    this.view = hooks.view || function () { var b = track.bounds(); return { x0: b.minX - 4, y0: b.minY, x1: b.maxX + 4, y1: Math.min(b.maxY, b.minY + 40) }; };
    this.onScore = hooks.onScore || NOOP;
    var def = (root.REWARDS && root.REWARDS[id]) || (root.SECRETS && root.SECRETS[id]);
    this.secs = (def && def.secs) || 60;
    this.secret = !!(root.SECRETS && root.SECRETS[id]);
    if (this.secret) { var tb = track.bounds(); this.sx = tb.maxX + 26; }
    this.t = 0;
    this.down = false; this.px = 0; this.py = 0; this.heldT = 0; this.tapped = [];
    this.own = [];
    this.spawnT = 0; this.n = 0;
    track.playMode = true;
    var self = this, prev = this.world.onImpact;
    this.world.onImpact = function (a, b, x, y, imp) { if (prev) prev(a, b, x, y, imp); self._impact(a, b, x, y, imp); };
    var start = this['start_' + id];
    if (start) start.call(this);
  }

  /** The machine's bodies that can move: everything dynamic, awake or asleep. */
  Playground.prototype._movers = function () {
    return this.world.bodies.filter(function (b) { return !b.isStatic && !b.sensor; });
  };

  Playground.prototype.pointer = function (x, y, down) {
    if (down && !this.down) this.tapped.push({ x: x, y: y });
    if (!down && this.down) this.released = true;
    this.px = x; this.py = y; this.down = down;
  };

  Playground.prototype.step = function (dt) {
    this.t += dt;
    this.heldT = this.down ? this.heldT + dt : 0;
    var run = this['step_' + this.id];
    if (run) run.call(this, dt);
    this.tapped.length = 0;
    this.released = false;
  };

  Playground.prototype._add = function (o, kind, extra) {
    var b = this.world.add(new Phys.Body(o));
    b.userData = Object.assign({ kind: kind, section: -3 }, extra || {});
    this.own.push(b);
    return b;
  };
  Playground.prototype._removeOwn = function (b) {
    this.world.remove(b); b.userData.gone = true;
    var i = this.own.indexOf(b); if (i >= 0) this.own.splice(i, 1);
  };

  Playground.prototype._marble = function (x, y, vx, vy, life) {
    var m = this.track._marble(null, x, y, { asleep: false, role: 'toy', hue: Math.random() * 360, key: 'toy' + (this.n++) });
    m.vx = vx; m.vy = vy; m.userData.live = true; m.userData.expire = this.track.time + (life || 25);
    return m;
  };

  Playground.prototype._tearLoose = function (x, y, r, density) {
    var bodies = this.world.bodies, torn = 0;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.isStatic || !b.userData || !BREAKABLE[b.userData.kind]) continue;
      // long ramps count by the nearest point along their length, not just their centre
      var dx = b.x - x, dy = b.y - y, reach = r + (b.shape.hw || 0) * 0.6;
      if (dx * dx + dy * dy < reach * reach && this.world.unpin(b, density)) torn++;
    }
    return torn;
  };

  Playground.prototype._blast = function (x, y, radius, power, tear, fx) {
    this.world.explode(x, y, radius, power);
    if (tear) this._tearLoose(x, y, tear);
    this.R.boom(x, y, fx == null ? 0.8 : fx);
    this.S.boom(fx && fx > 1 ? 2 : 1);
    this.onScore(50, x, y - 1);
  };

  Playground.prototype._impact = function (a, b, x, y, imp) {
    var ua = a.userData || {}, ub = b.userData || {};
    var hit = this['hit_' + this.id];
    if (hit) hit.call(this, a, b, ua, ub, x, y, imp);
  };

  Playground.prototype._breakOn = function (b, u, imp, threshold) {
    if (b.isStatic && BREAKABLE[u.kind] && imp > threshold) return this.world.unpin(b);
    return false;
  };

  // ---------------------------------------------------------------- bonus
  Playground.prototype.start_flood = function () { this.poured = 0; this.max = 100; };
  Playground.prototype.status_flood = function () { return (this.max - this.poured) + ' marbles left'; };
  Playground.prototype.step_flood = function (dt) {
    this.spawnT -= dt;
    if (this.down && this.poured < this.max && this.spawnT <= 0) {
      this.spawnT = 0.05;
      this.poured++;
      this._marble(this.px + (Math.random() - 0.5) * 0.8, this.py, (Math.random() - 0.5) * 3, Math.random() * 2, 22);
      if (this.poured % 3 === 0) this.S.peg(this.poured);
    }
  };

  Playground.prototype.start_tnt = function () { this.left = 12; };
  Playground.prototype.status_tnt = function () { return this.left + ' crates left'; };
  Playground.prototype.step_tnt = function (dt) {
    for (var i = 0; i < this.tapped.length && this.left > 0; i++) {
      this.left--;
      this._add({ x: this.tapped[i].x, y: this.tapped[i].y, hw: 0.55, hh: 0.55, density: 1.4, friction: 0.5, neverSleep: true }, 'tntbox', { fuse: 2.2 });
    }
    for (i = this.own.length - 1; i >= 0; i--) {
      var c = this.own[i], u = c.userData;
      if (u.kind !== 'tntbox') continue;
      u.fuse -= dt;
      if (u.fuse <= 0) this._boomCrate(c);
    }
  };
  Playground.prototype._boomCrate = function (c) {
    var x = c.x, y = c.y;
    this._removeOwn(c);
    this._blast(x, y, 8, 15, 4, 1);
    for (var i = 0; i < this.own.length; i++) {
      var o = this.own[i];
      if (o.userData.kind === 'tntbox' && (o.x - x) * (o.x - x) + (o.y - y) * (o.y - y) < 36) o.userData.fuse = Math.min(o.userData.fuse, 0.09);
    }
  };
  Playground.prototype.hit_tnt = function (a, b, ua, ub, x, y, imp) {
    var crate = ua.kind === 'tntbox' ? a : ub.kind === 'tntbox' ? b : null;
    if (crate && imp > 5 && crate.userData.fuse > 0.08) crate.userData.fuse = 0.05;
  };

  Playground.prototype.start_wrecker = function () {
    var v = this.view();
    this.ball = this._add({ x: (v.x0 + v.x1) / 2, y: v.y0 + 3, circle: 1.6, density: 3, friction: 0.5, restitution: 0.2, neverSleep: true }, 'fist', {});
    this.px = this.ball.x; this.py = this.ball.y;
  };
  Playground.prototype.status_wrecker = function () { return ''; };
  Playground.prototype.step_wrecker = function (dt) {
    var b = this.ball;
    if (!this.down) return;
    b.vx += ((this.px - b.x) * 26 - b.vx * 5) * dt;
    b.vy += ((this.py - b.y) * 26 - b.vy * 5 - this.world.gy) * dt;
  };
  Playground.prototype.hit_wrecker = function (a, b, ua, ub, x, y, imp) {
    var o = a === this.ball ? b : b === this.ball ? a : null;
    if (!o || !o.userData) return;
    if (imp > 3) { this.R.sparks(x, y, 18, 40, 8); this.S.thud(imp * 0.3); }
    if (imp > 12) this.R.kick(Math.min(1.2, imp * 0.02));
    if (this._breakOn(o, o.userData, imp, 34)) { this.R.boom(x, y, 0.3); this.onScore(25, x, y - 1); }
  };

  // ---------------------------------------------------------------- rare
  Playground.prototype.start_sand = function () {
    var v = this.view(), width = v.x1 - v.x0, cell = Math.max(0.14, width / 360);
    var g = this.grid = new root.SandGrid(v.x0, v.y0, v.x1, v.y1 + 4, cell);
    var bodies = this.world.bodies;
    for (var i = 0; i < bodies.length; i++) { var b = bodies[i]; if (b.isStatic && !b.sensor) g.bake(b); }
    this.colour = 0; this.auto = 2.2; this.ax = (v.x0 + v.x1) / 2; this.ay = v.y0 + 2;
  };
  Playground.prototype.status_sand = function () { return this.grid.count.toLocaleString() + ' grains'; };
  Playground.prototype.step_sand = function (dt) {
    var g = this.grid;
    this.colour += dt * 22;
    if (this.down) g.pour(this.px, this.py, 0.65, 42, this.colour | 0);
    else if (this.auto > 0) { this.auto -= dt; g.pour(this.ax + Math.sin(this.t * 2.4) * 2.5, this.ay, 0.6, 30, this.colour | 0); }   // a first pour, to show what it does
    var movers = this._movers(), self = this;
    var awake = movers.filter(function (b) { return !b.asleep; });
    var sleepers = movers.filter(function (b) { return b.asleep; });
    g.stamp(movers, function (c, v, b) { if (Math.random() < 0.3 && b.vx * b.vx + b.vy * b.vy > 4) self.R.sparks(b.x, b.y, 1, (v * 2.2) % 360, 3); });
    g.step(Math.random); g.step(Math.random);
    g.press(awake, dt);
    g.press(sleepers, dt);
  };

  Playground.prototype.start_moon = function () {
    this.world.gy = 2.2;
    var v = this.view(), movers = this._movers();
    movers.forEach(function (b) {
      if (b.manualWake) return;
      if (b.asleep) b.wake();
      b.vy -= 0.6 + Math.random() * 1.2; b.vx += (Math.random() - 0.5) * 0.8; b.w += (Math.random() - 0.5) * 1.2;
    });
    for (var i = 0; i < 18; i++) this._marble(v.x0 + Math.random() * (v.x1 - v.x0), v.y0 + Math.random() * 6, (Math.random() - 0.5) * 3, Math.random(), 70);
  };
  Playground.prototype.status_moon = function () { return ''; };
  Playground.prototype.step_moon = function () {
    for (var i = 0; i < this.tapped.length; i++) {
      var p = this.tapped[i];
      this.world.explode(p.x, p.y + 2, 10, 9);
      this.R.ring(p.x, p.y, 5, 1, 1.8, 2.6, 0.5, 0.06);
      this.R.sparks(p.x, p.y, 26, 210, 6, { grav: 2 });
      this.S.bounce();
    }
  };

  Playground.prototype.start_magnet = function () {};
  Playground.prototype.status_magnet = function () { return ''; };
  Playground.prototype.step_magnet = function (dt) {
    if (this.down) {
      var movers = this._movers(), px = this.px, py = this.py;
      for (var i = 0; i < movers.length; i++) {
        var b = movers[i], dx = px - b.x, dy = py - b.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        if (d > 16) continue;
        if (b.asleep) { if (b.manualWake) b.manualWake = false; b.wake(); this.world._dropArbiters(b); }
        var a = 70 / (d + 2.5);
        b.vx += dx / d * a * dt - dy / d * a * 0.25 * dt; b.vy += dy / d * a * dt + dx / d * a * 0.25 * dt - this.world.gy * dt * 0.6;
        b.vx *= 0.992; b.vy *= 0.992;
      }
      if (this.heldT > 0.8) this._tearLoose(px, py, 5);
      if (Math.random() < 0.5) this.R.sparks(px + (Math.random() - 0.5) * 8, py + (Math.random() - 0.5) * 8, 1, 200, 2);
      if (this.heldT % 0.5 < dt) { this.R.ring(px, py, 0.6, 0.5, 1.4, 2.6, 0.45, 0.08); this.S.click(0.4); }
    }
    if (this.released) {
      this.world.explode(this.px, this.py, 16, 26);
      this.R.boom(this.px, this.py, 0.7);
      this.S.boom(1);
      this.onScore(50, this.px, this.py - 1);
    }
  };

  // ---------------------------------------------------------------- ultra
  Playground.prototype.start_blackhole = function () {
    var v = this.view();
    this.hx = this.px = (v.x0 + v.x1) / 2; this.hy = this.py = (v.y0 + v.y1) / 2;
    this.size = 0.5; this.eaten = 0; this.collapsed = false;
    this.world.gy = 1.5;       // its pull has to beat gravity, so the whole machine lifts off and streams in
  };
  Playground.prototype.status_blackhole = function () { return this.eaten ? this.eaten + ' pieces swallowed' : ''; };
  Playground.prototype.step_blackhole = function (dt) {
    if (this.collapsed) return;
    if (this.down) { this.hx += (this.px - this.hx) * Math.min(1, dt * 4); this.hy += (this.py - this.hy) * Math.min(1, dt * 4); }
    this.size = Math.min(3, 0.5 + this.t * 0.11);
    var bodies = this.world.bodies, hx = this.hx, hy = this.hy, size = this.size, track = this.track;
    this._tearLoose(hx, hy, size * 3 + this.t * 0.45);     // the reach keeps growing until the whole machine is coming apart
    for (var i = bodies.length - 1; i >= 0; i--) {
      var b = bodies[i];
      if (b.isStatic || b.sensor) continue;
      var dx = hx - b.x, dy = hy - b.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01;
      if (d > 70) continue;
      if (b.asleep) { if (b.manualWake) b.manualWake = false; b.wake(); this.world._dropArbiters(b); }
      if (d < size * 1.15) { this._swallow(b); continue; }
      if (d < size * 5) b.ghost = true;                       // the last stretch: nothing can stop it falling in
      // the swirl fades close in: with it at full strength everything settles into a stable ring and never falls in
      var a = 170 / (d + 2) + 5, spin = 0.42 * Math.min(1, Math.max(0, (d - size * 1.6) / (size * 4)));
      b.vx += (dx / d * a + (-dy / d) * a * spin) * dt; b.vy += (dy / d * a + (dx / d) * a * spin) * dt;
      b.vx *= 0.985; b.vy *= 0.985;
    }
    if (Math.random() < 0.9) {
      var ang = Math.random() * 6.283, r = size * (1.5 + Math.random() * 1.5);
      this.R.parts.add(0, hx + Math.cos(ang) * r, hy + Math.sin(ang) * r, -Math.sin(ang) * 8, Math.cos(ang) * 8, 0.5, 0.06, 2.6, 1.3, 2.8, 1, 0);
    }
    this.R.kick(0.05 + size * 0.03);
    if (this.t > this.secs - 4) this._bigBang();
  };
  Playground.prototype._swallow = function (b) {
    var u = b.userData || (b.userData = {});
    this.world.remove(b);
    u.eaten = true; u.gone = true;
    var ms = this.track.marbles, i = ms.indexOf(b); if (i >= 0) ms.splice(i, 1);
    i = this.own.indexOf(b); if (i >= 0) this.own.splice(i, 1);
    this.eaten++;
    this.R.sparks(b.x, b.y, 5, 280, 4, { grav: 0 });
    if (this.eaten % 3 === 0) { this.S.peg(this.eaten); this.onScore(10); }
  };
  Playground.prototype._bigBang = function () {
    this.collapsed = true;
    this.world.gy = Track.GRAVITY;       // the debris rains back down
    this.world.explode(this.hx, this.hy, 60, 34);
    this.R.boom(this.hx, this.hy, 2.6);
    this.S.boom(2);
    this.onScore(500, this.hx, this.hy - 2);
    for (var i = 0; i < this.eaten && i < 160; i++) {
      var a = Math.random() * 6.283, s = 6 + Math.random() * 18;
      this.R.parts.add(4, this.hx, this.hy, Math.cos(a) * s, Math.sin(a) * s, 1.4 + Math.random(), 0.22, 1.8, 1.2, 2.2, 0.8, 5, 6);
    }
  };

  Playground.prototype.start_meteors = function () { this.spawnT = 0.4; };
  Playground.prototype.status_meteors = function () { return ''; };
  Playground.prototype._meteor = function (tx, ty) {
    var v = this.view(), sx = tx + (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 6), sy = v.y0 - 8, T = 0.85;
    this._add({ x: sx, y: sy, vx: (tx - sx) / T, vy: (ty - sy) / T - 0.5 * this.world.gy * T, circle: 0.75 + Math.random() * 0.25, density: 7, friction: 0.3, neverSleep: true }, 'meteor', { hue: 20 + Math.random() * 25 });
  };
  Playground.prototype.step_meteors = function (dt) {
    var v = this.view(), i;
    this.spawnT -= dt;
    if (this.spawnT <= 0) { this.spawnT = 0.6 + Math.random() * 0.5; this._meteor(v.x0 + Math.random() * (v.x1 - v.x0), v.y0 + Math.random() * (v.y1 - v.y0)); }
    for (i = 0; i < this.tapped.length; i++) this._meteor(this.tapped[i].x, this.tapped[i].y);
    for (i = this.own.length - 1; i >= 0; i--) {
      var m = this.own[i];
      if (m.userData.boom) { var x = m.x, y = m.y; this._removeOwn(m); this._blast(x, y, 8, 15, 3.5, 1); continue; }
      if (m.y > this.track.bottomY() + 2) { this._removeOwn(m); continue; }
      this.R.parts.add(1, m.x + (Math.random() - 0.5) * 0.7, m.y + (Math.random() - 0.5) * 0.7, -m.vx * 0.1, -m.vy * 0.1, 0.5, 0.45, 2.6, 1.05, 0.25, 1.2, -1);
      if (Math.random() < 0.4) this.R.parts.add(2, m.x, m.y, 0, 0, 1, 0.4, 0.1, 0.08, 0.1, 1, -1);
    }
  };
  Playground.prototype.hit_meteors = function (a, b, ua, ub) {
    if (ua.kind === 'meteor') ua.boom = true;
    if (ub.kind === 'meteor') ub.boom = true;
  };

  Playground.prototype.start_colossus = function () { this.left = 5; var v = this.view(); this._drop((v.x0 + v.x1) / 2 - 3); this.left--; };
  Playground.prototype.status_colossus = function () { return this.left + ' giants left'; };
  Playground.prototype._drop = function (x) {
    var v = this.view();
    var c = this._add({ x: x, y: v.y0 - 8, vy: 3, hw: 1.15, hh: 9, density: 0.55, friction: 0.8, restitution: 0.02, neverSleep: true }, 'colossus', { hue: 45 });
    c.w = (Math.random() < 0.5 ? -1 : 1) * 0.08;
    this.S.swing();
  };
  Playground.prototype.step_colossus = function () {
    for (var i = 0; i < this.tapped.length && this.left > 0; i++) { this.left--; this._drop(this.tapped[i].x); }
  };
  Playground.prototype.hit_colossus = function (a, b, ua, ub, x, y, imp) {
    var isA = ua.kind === 'colossus', isB = ub.kind === 'colossus';
    if (!isA && !isB) return;
    var o = isA ? b : a, u = isA ? ub : ua;
    if (imp > 8) { this.R.kick(Math.min(2.2, imp * 0.04)); this.R.sparks(x, y, 26, 45, 9); this.S.thud(imp * 0.4); }
    if (imp > 30) { this.R.boom(x, y, 0.35); this.onScore(50, x, y - 1); if (u.kind === 'colossus') this.S.boom(1); }
    if (this._breakOn(o, u, imp, 18)) this.world.explode(x, y, 5, 7);
  };


  // ---------------------------------------------------------------- domino houses (rare) and the Architect (ultra)
  /*
   * A house is a stack of cells. A cell is two standing dominoes with a flat slab laid across them; the next cell up
   * stands on that slab. So a house has as many storeys as it has cells in a column, and it all comes down if you take
   * out the right one. The ground is the machine's floor.
   */
  var CELL_W = 1.7, PILLAR_HW = 0.13, PILLAR_HH = 0.62, SLAB_HH = 0.12, STORY = PILLAR_HH * 2 + SLAB_HH * 2, INSET = 0.22, MAX_STORIES = 6;
  Playground.prototype._groundY = function () { return this.track.floor ? this.track.floor.y - this.track.floor.shape.hh : this.track.bottomY(); };
  /** Builds one cell: columns are on a fixed grid (x = col * CELL_W), levels count up from the floor. Returns its bodies. */
  Playground.prototype._cell = function (col, level, hue) {
    var gy = this._groundY(), x0 = this.gridX + col * CELL_W, base = gy - level * STORY, parts = [];
    var h = (hue + level * 38) % 360;
    [x0 + INSET, x0 + CELL_W - INSET].forEach(function (px) {
      var d = this._add({ x: px, y: base - PILLAR_HH - 0.002, hw: PILLAR_HW, hh: PILLAR_HH, density: 0.55, friction: 0.7, restitution: 0.02, asleep: true }, 'brick', { hue: h, shape: 'pillar', col: col, level: level });
      d.userData.a0 = 0; d.userData.y0 = d.y; parts.push(d);
    }, this);
    var s = this._add({ x: x0 + CELL_W / 2, y: base - PILLAR_HH * 2 - SLAB_HH - 0.004, hw: CELL_W / 2 - 0.01, hh: SLAB_HH, density: 0.7, friction: 0.9, restitution: 0.0, asleep: true }, 'brick', { hue: (h + 20) % 360, shape: 'slab', col: col, level: level });
    s.userData.a0 = 0; s.userData.y0 = s.y; parts.push(s);
    return parts;
  };
  Playground.prototype._removeCell = function (col, level) {
    var self = this;
    this.own.filter(function (b) { return b.userData.kind === 'brick' && b.userData.col === col && b.userData.level === level; }).forEach(function (b) { self._removeOwn(b); });
    // whatever stood on it is woken, and falls
    this.own.forEach(function (b) { if (b.userData.kind === 'brick' && b.userData.col === col && b.userData.level > level) { b.manualWake = false; b.wake(); } });
  };
  Playground.prototype._cellAt = function (col, level) {
    return this.own.some(function (b) { return b.userData.kind === 'brick' && b.userData.col === col && b.userData.level === level; });
  };
  Playground.prototype._height = function (col) { var n = 0; while (this._cellAt(col, n)) n++; return n; };
  /**
   * The marble, rolled in from the side he taps on, at the height he tapped (kept to the height of the houses, so it is never
   * blocked by the machine above). Tap to the right of the houses and it comes from the right.
   */
  Playground.prototype._wball = function (x, y) {
    var bricks = this.own.filter(function (o) { return o.userData.kind === 'brick'; }), cx = x;
    if (bricks.length) cx = bricks.reduce(function (s, o) { return s + o.x; }, 0) / bricks.length;
    var side = x >= cx ? 1 : -1, gy = this._groundY(), hy = Math.max(gy - STORY * 3.2, Math.min(gy - 0.6, y));
    // the ordinary marble, the one that plays the machine: live, glowing, and quick enough to topple a house
    var m = this._marble(x + side * 9, hy, -side * 15, -0.5, 20);
    m.userData.hue = this.hue == null ? 190 : this.hue;
    m.w = -side * 10; this.S.swing(); return m;
  };
  /** Counts a piece as brought down once it has tipped over or dropped, and pays a little for each. */
  Playground.prototype._watchBricks = function () {
    var self = this;
    this.own.forEach(function (b) {
      var u = b.userData;
      if (u.kind !== 'brick' || u.fell) return;
      if (Math.abs(b.a - u.a0) > 0.9 || b.y - u.y0 > 0.6) {
        u.fell = true; self.felled = (self.felled || 0) + 1;
        self.R.sparks(b.x, b.y, 8, u.hue, 4); self.S.thud && self.S.thud(2);
        self.onScore(10, b.x, b.y - 0.8);
      }
    });
  };
  Playground.prototype._houseSpot = function (x) {
    var v = this.view(); this.gridX = this.gridX == null ? Math.round(((v.x0 + v.x1) / 2 - 4 * CELL_W) / CELL_W) * CELL_W : this.gridX;
    return Math.round((x - this.gridX) / CELL_W - 2);
  };

  // the rare house: a ready-made pyramid, set down wherever he taps; tapping after that rolls the ordinary marble in
  Playground.prototype.start_house = function () { this.houses = 2; this.balls = 10; var v = this.view(); this.gridX = Math.round(((v.x0 + v.x1) / 2 - 4 * CELL_W) / CELL_W) * CELL_W; };
  Playground.prototype.status_house = function () { return this.houses > 0 ? 'Tap to build a house (' + this.houses + ' left)' : this.balls > 0 ? 'Tap beside the house to roll a marble in (' + this.balls + ' left) · ' + (this.felled || 0) + ' down' : (this.felled || 0) + ' pieces down'; };
  Playground.prototype.step_house = function () {
    for (var i = 0; i < this.tapped.length; i++) {
      var t = this.tapped[i];
      if (this.houses > 0) {
        var col0 = Math.round((t.x - this.gridX) / CELL_W) - 2, hue = Math.random() * 360 | 0;
        // a pyramid: four wide, then two, then one
        var plan = [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1], [1, 2]];
        // dropped on an existing house, it builds on top: each column starts at the height that is already there
        var base = {};
        plan.forEach(function (c) { var col = col0 + c[0]; if (base[col] == null) base[col] = this._height(col); }, this);
        plan.forEach(function (c) { var col = col0 + c[0], lv = base[col] + c[1]; if (lv < MAX_STORIES + 2) this._cell(col, lv, hue); }, this);
        this.houses--; this.S.thud && this.S.thud(1); this.R.sparks(t.x, this._groundY() - 2, 24, hue, 5);
      } else if (this.balls > 0) { this.balls--; this._wball(t.x, t.y); }
    }
    this._watchBricks();
  };

  // the ultra Architect: tap to add or take away a cell, hold to roll a marble in
  Playground.prototype.start_architect = function () {
    var v = this.view(); this.gridX = Math.round(((v.x0 + v.x1) / 2 - 4 * CELL_W) / CELL_W) * CELL_W;
    this.balls = 14; this.press = null; this.hue = Math.random() * 360 | 0; this.cells = 0;
  };
  Playground.prototype.status_architect = function () { return 'Tap: add or remove a piece · Hold: roll a marble in · ' + this.cells + ' pieces · ' + (this.felled || 0) + ' down'; };
  Playground.prototype.step_architect = function (dt) {
    if (this.tapped.length) this.press = { x: this.tapped[this.tapped.length - 1].x, y: this.tapped[this.tapped.length - 1].y, t: 0, fired: false };
    var pr = this.press;
    if (pr && this.down) {
      pr.t += dt;
      if (!pr.fired && pr.t > 0.5 && this.balls > 0) { pr.fired = true; this.balls--; this._wball(this.px, this.py); }
    }
    if (pr && !this.down) {      // let go
      if (!pr.fired && pr.t < 0.5) this._architectTap(pr.x, pr.y);
      this.press = null;
    }
    this._watchBricks();
  };
  Playground.prototype._architectTap = function (x, y) {
    var col = Math.floor((x - this.gridX) / CELL_W), level = Math.floor((this._groundY() - y) / STORY);
    if (level >= 0 && this._cellAt(col, level)) { this._removeCell(col, level); this.cells--; this.S.pop && this.S.pop(); return; }
    var h = this._height(col);
    if (h >= MAX_STORIES || this.cells >= 36) return;
    this._cell(col, h, this.hue); this.cells++;
    this.R.sparks(this.gridX + (col + 0.5) * CELL_W, this._groundY() - h * STORY - 0.7, 10, this.hue + h * 38, 4);
    this.S.thud && this.S.thud(1);
  };


  // ---------------------------------------------------------------- secret levels (found through the basket)
  /** What a secret level has earned, read when it ends: { freezes, text }. */
  Playground.prototype.prize = function () {
    if (this.id === 'pachinko' && this.jackpots > 0) return { freezes: 1, text: 'Jackpot! +1 freeze' };
    if (this.id === 'pyramid' && (this.felled || 0) >= 30) return { freezes: 1, text: 'The pyramid is down. +1 freeze' };
    return null;
  };

  Playground.prototype.start_pachinko = function () {
    var gy = this._groundY(), cx = this.sx, W = 15, self = this;
    this.cx = cx; this.gy = gy; this.left = 12; this.jackpots = 0; this.bins = [20, 50, 200, 50, 20]; this.binW = W / 5; this.settled = 0;
    var wall = function (x) { self._add({ x: x, y: gy - 9, hw: 0.2, hh: 9.5, isStatic: true, friction: 0.1, restitution: 0.3 }, 'pwall'); };
    wall(cx - W / 2 - 0.2); wall(cx + W / 2 + 0.2);
    for (var d = 1; d < 5; d++) this._add({ x: cx - W / 2 + d * this.binW, y: gy - 1.6, hw: 0.08, hh: 1.6, isStatic: true, friction: 0.2, restitution: 0.15 }, 'pwall');
    for (var row = 0; row < 8; row++) {
      var y = gy - 14 + row * 1.35, off = row % 2 ? 0.95 : 0;
      for (var x = cx - W / 2 + 1.2 + off; x < cx + W / 2 - 1.2; x += 1.9) this._add({ x: x, y: y, circle: 0.2, isStatic: true, friction: 0.1, restitution: 0.55 }, 'ppeg', { lit: -9 });
    }
  };
  Playground.prototype.status_pachinko = function () { return this.left + ' marbles left · ' + this.jackpots + ' jackpot' + (this.jackpots === 1 ? '' : 's'); };
  Playground.prototype.step_pachinko = function () {
    var self = this, W = 15;
    for (var i = 0; i < this.tapped.length && this.left > 0; i++) {
      var x = Math.max(this.cx - W / 2 + 0.6, Math.min(this.cx + W / 2 - 0.6, this.tapped[i].x));
      this._marble(x, this.gy - 16.5, (Math.random() - 0.5) * 0.4, 0, 40); this.left--; this.S.pop && this.S.pop();
    }
    this.track.marbles.slice().forEach(function (m) {
      if (m.userData.role !== 'toy' || m.userData.payed || m.userData.gone) return;
      var sp2 = m.vx * m.vx + m.vy * m.vy;
      if (m.y < self.gy - 0.8) {      // balanced on a peg or a divider: shake it loose
        m.userData.still = sp2 < 0.09 ? (m.userData.still || 0) + 1 / 60 : 0;
        if (m.userData.still > 1.2) { m.userData.still = 0; m.manualWake = false; m.wake(); m.vx += (m.x < self.cx ? 1 : -1) * 2.2; m.vy -= 1.5; }
      }
      if (m.y > self.gy - 0.8 && sp2 < 2.5) {
        m.userData.payed = true;
        var bin = Math.max(0, Math.min(4, Math.floor((m.x - (self.cx - W / 2)) / self.binW)));
        var pts = self.bins[bin]; self.onScore(pts, m.x, m.y - 1); self.settled++;
        self.R.sparks(m.x, m.y, bin === 2 ? 60 : 14, bin === 2 ? 45 : 190, bin === 2 ? 8 : 4);
        if (bin === 2) { self.jackpots++; self.S.boom && self.S.boom(1); } else self.S.peg && self.S.peg(self.settled);
        m.userData.expire = self.track.time + 1.2;
      }
    });
  };
  Playground.prototype.hit_pachinko = function (a, b, ua, ub) {
    if (ua.kind === 'ppeg') ua.lit = this.t; else if (ub.kind === 'ppeg') ub.lit = this.t;
  };

  Playground.prototype.start_pyramid = function () {
    var cx = this.sx; this.cx = cx; this.left = 12; this.gy = this._groundY();
    this.gridX = cx - 3.5 * CELL_W;
    var plan = [[0, 7], [1, 5], [2, 3], [3, 1]];       // [level, cells], each row narrower and centred
    plan.forEach(function (r) { var start = (7 - r[1]) / 2; for (var c = 0; c < r[1]; c++) this._cell(start + c, r[0], 45); }, this);
  };
  Playground.prototype.status_pyramid = function () { return this.left + ' marbles left · ' + (this.felled || 0) + ' pieces down (30 earns a freeze)'; };
  Playground.prototype.step_pyramid = function () {
    for (var i = 0; i < this.tapped.length && this.left > 0; i++) { this.left--; this._wball(this.tapped[i].x, this.tapped[i].y); }
    this._watchBricks();
  };

  // ---------------------------------------------------------------- Upside Down
  Playground.prototype.start_flip = function () {
    var b = this.track.bounds(), cx = (b.minX + b.maxX) / 2;
    this.ceiling = this._add({ x: cx, y: b.minY - 7, hw: (b.maxX - b.minX) / 2 + 40, hh: 0.5, isStatic: true, friction: 0.7 }, 'ceiling', {});
    var v = this.view();
    for (var i = 0; i < 26; i++) this._marble(v.x0 + Math.random() * (v.x1 - v.x0), v.y0 + Math.random() * (v.y1 - v.y0), (Math.random() - 0.5) * 2, 0, this.secs + 5);
    this.up = false; this.flips = 0; this.autoT = 6;
    this._flip();
  };
  Playground.prototype.status_flip = function () { return (this.up ? 'Gravity: up' : 'Gravity: down') + ' · ' + this.flips + (this.flips === 1 ? ' flip' : ' flips'); };
  Playground.prototype._flip = function () {
    this.up = !this.up; this.flips++;
    this.world.gy = (this.up ? -1 : 1) * Track.GRAVITY;
    this.autoT = 6;
    var movers = this._movers();
    for (var i = 0; i < movers.length; i++) {
      var b = movers[i];
      if (b.asleep) { b.manualWake = false; b.wake(); this.world._dropArbiters(b); }
    }
    var v = this.view(), cx = (v.x0 + v.x1) / 2, cy = (v.y0 + v.y1) / 2;
    this.R.kick(0.9);
    this.R.fx.wave(cx, cy, 0.5, 0.6, 0.7);
    this.R.fx.ca = Math.max(this.R.fx.ca || 0, 2);
    this.R.float(this.up ? 'UP!' : 'DOWN!', cx, cy, 1.6, [2.6, 2.4, 1.2], 0.9);
    this.S.warp();
    this.onScore(25);
  };
  Playground.prototype.step_flip = function (dt) {
    if (this.tapped.length) this._flip();
    this.autoT -= dt;
    if (this.autoT <= 0) this._flip();         // it keeps flipping by itself, so the show never stops
  };
  Playground.prototype.hit_flip = function (a, b, ua, ub, x, y, imp) {
    if (imp > 10) this.R.sparks(x, y, 8, this.up ? 200 : 30, 5);
    if (this._breakOn(a, ua, imp, 20) || this._breakOn(b, ub, imp, 20)) { this.R.boom(x, y, 0.25); this.S.thud(imp * 0.4); this.onScore(25, x, y - 1); }
  };

  // ---------------------------------------------------------------- Rewind
  /*
   * The whole machine runs for real while every body's position is recorded. Holding the pointer plays the recording
   * backward; letting go plays it forward, and when it catches up with the present the physics simply carries on.
   * Left alone once the run is over, it rewinds and replays by itself until the time is up.
   */
  var REC_HZ_DIV = 2;       // record every 2nd physics step (30 frames a second)
  var REC_SECONDS = 70;
  Playground.prototype.start_rewind = function () {
    this.track.noSpend = true;
    this.list = this._movers();
    this.doms = this.list.filter(function (b) { return b.userData && b.userData.kind === 'domino'; });
    this.maxF = REC_SECONDS * 30;
    this.rec = new Float32Array(this.list.length * 3 * this.maxF);
    this.cam = new Float32Array(2 * this.maxF);
    this.len = 0; this.head = 0; this.mode = 'live'; this.holdWorld = false;
    this.falls = []; this.fi = 0; this.sub = 0;
    this.delay = 1.2; this.after = 0; this.autoBack = false;
    // a long machine runs for over a minute: start from the last 5 pieces, so there is time left to play with time
    this.from = Math.max(0, this.track.sections.length - 5);
    this.lastLead = this.track.marbleFor(this.from);
    this.home = this.list.map(function (b) { return { x: b.x, y: b.y, a: b.a }; });
    this.liveV = null;
    this._record();
  };
  Playground.prototype.status_rewind = function () {
    if (this.mode === 'back') return '◀◀ Rewinding';
    if (this.mode === 'fwd') return '▶ Replaying';
    return this.track.run && this.track.run.finished ? 'Done. Hold to rewind' : '● Live';
  };
  Playground.prototype._record = function () {
    if (this.len >= this.maxF) return false;
    var r = this.rec, o = this.len * this.list.length * 3, L = this.list;
    for (var i = 0; i < L.length; i++, o += 3) { r[o] = L[i].x; r[o + 1] = L[i].y; r[o + 2] = L[i].a; }
    var lead = this.track._liveMarble() || this.lastLead || this.track.head.marble;
    this.lastLead = lead;
    this.cam[this.len * 2] = lead.x; this.cam[this.len * 2 + 1] = lead.y;
    this.len++;
    return true;
  };
  Playground.prototype._apply = function (f) {
    var i0 = Math.floor(f), i1 = Math.min(this.len - 1, i0 + 1), k = f - i0, n = this.list.length * 3, r = this.rec, L = this.list;
    var a = i0 * n, b = i1 * n;
    for (var i = 0; i < L.length; i++, a += 3, b += 3) {
      var d = L[i];
      d.x = r[a] + (r[b] - r[a]) * k; d.y = r[a + 1] + (r[b + 1] - r[a + 1]) * k; d.a = r[a + 2] + (r[b + 2] - r[a + 2]) * k;
    }
  };
  /** Dominoes count as standing or fallen according to where the playhead is, with a note as each one is passed. */
  Playground.prototype._crossFalls = function (back) {
    var F = this.falls;
    if (back) {
      while (this.fi > 0 && F[this.fi - 1].f > this.head) {
        this.fi--;
        F[this.fi].d.userData.fell = 0;
        this.S.rewindNote(this.fi);
        this.R.sparks(F[this.fi].d.x, F[this.fi].d.y, 3, F[this.fi].d.userData.hue, 2.4, { hot: 2.4 });
      }
    } else {
      while (this.fi < F.length && F[this.fi].f <= this.head) {
        F[this.fi].d.userData.fell = this.track.time;
        this.S.domino();
        this.fi++;
      }
    }
  };
  Playground.prototype._freezeWorld = function () {
    if (this.holdWorld) return;
    this.holdWorld = true;
    this.liveV = this.list.map(function (b) { return { vx: b.vx, vy: b.vy, w: b.w, asleep: b.asleep }; });
    this.list.forEach(function (b) { b.vx = b.vy = b.w = 0; });
    this.fi = this.falls.length;
  };
  Playground.prototype._resumeWorld = function () {
    var self = this;
    this.holdWorld = false;
    this.list.forEach(function (b, i) { var v = self.liveV[i]; b.vx = v.vx; b.vy = v.vy; b.w = v.w; });
    this.liveV = null;
    this.mode = 'live';
  };
  Playground.prototype.step_rewind = function (dt) {
    var t = this.track, finished = t.run && t.run.finished;
    var wantBack = this.down || this.autoBack;

    if (this.mode === 'live') {
      if (wantBack && this.len > 1) {
        this.mode = 'back'; this.head = this.len - 1; this._freezeWorld(); this.S.tape();
      } else {
        if (this.delay > 0) { this.delay -= dt; if (this.delay <= 0) { var e = t.exitFor(this.from); t.startRun(this.from, e.dir * 4.5, -2); } }
        if (++this.sub % REC_HZ_DIV === 0) {
          this._record();
          for (var i = 0; i < this.doms.length; i++) {
            var d = this.doms[i], u = d.userData;
            if (u.fell && !u.logged) { u.logged = true; this.falls.push({ d: d, f: this.len - 1 }); }
          }
          this.head = this.len - 1;
        }
        var full = this.len >= this.maxF, idle = finished && (this.after += dt) > 1.6;
        if (full || idle) { this.autoBack = true; this.after = 0; }
        return;
      }
    }

    t.time += dt;                            // the physics is paused, but the glow and sparkle keep time
    if (this.mode === 'back') {
      this.head -= this.autoBack && !this.down ? 3 : 2;
      if (this.head <= 0) {
        this.head = 0;
        if (this.autoBack && !this.down) { this.after += dt; if (this.after > 0.7) { this.autoBack = false; this.after = 0; this.mode = 'fwd'; } }
      }
      if (!this.down && !this.autoBack) this.mode = 'fwd';
      this._apply(this.head);
      this._crossFalls(true);
      return;
    }

    // replaying forward at real speed
    if (this.down) { this.mode = 'back'; this.S.tape(); return; }
    this.head = Math.min(this.len - 1, this.head + 0.5);
    this._apply(this.head);
    this._crossFalls(false);
    if (this.head >= this.len - 1) {
      if (!finished && this.len < this.maxF) this._resumeWorld();
      else if ((this.after += dt) > 1.4) { this.after = 0; this.autoBack = true; this.mode = 'back'; this.S.tape(); }
    }
  };
  /** Rewind keeps the camera on the action, in either direction. */
  Playground.prototype.focus = function () {
    if (this.secret) return { x: this.sx, y: this._groundY() - 8, zoom: 0.8 };
    if (this.id !== 'rewind') return null;
    var i = Math.max(0, Math.min(this.len - 1, Math.floor(this.mode === 'live' ? this.len - 1 : this.head)));
    return { x: this.cam[i * 2], y: this.cam[i * 2 + 1] + 1, zoom: 0.92, fast: this.mode === 'back' };
  };

  Playground.prototype.status = function () { var f = this['status_' + this.id]; return f ? f.call(this) : ''; };

  /** Item-specific drawing, called between the dominoes and the marbles. */
  Playground.prototype.draw = function (fx, T, now) {
    var i, b;
    for (i = 0; i < this.own.length; i++) {
      b = this.own[i]; var k = b.userData.kind;
      if (k === 'tntbox') {
        var urgent = Math.max(0, 1 - b.userData.fuse / 2.2);
        fx.sprite(T.CRATE, b.x, b.y, b.shape.hw, b.shape.hh, b.a, 1, 1, 1, 1, 0, 0, 0, 0, 0.3 + urgent + 0.4 * Math.sin(now * (8 + urgent * 24)), 0);
        fx.text('TNT', b.x, b.y, 0.5, 2.4, 2.2, 1.6, 1);
      } else if (k === 'fist') {
        var line = Math.hypot(this.px - b.x, this.py - b.y);
        if (this.down && line > 0.3) fx.sprite(T.BOX, (this.px + b.x) / 2, (this.py + b.y) / 2, line / 2, 0.05, Math.atan2(this.py - b.y, this.px - b.x), 0.6, 1.6, 2.2, 0.8, 0.6, 1.6, 2.2, 1, 0.02, 0.02);
        fx.sprite(T.GLOW, b.x, b.y, 4, 4, 0, 0.9, 0.35, 0.1, 0.35, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.BALL, b.x, b.y, b.shape.r, b.shape.r, b.a, 0.75, 0.12, 0.08, 1, 1, 0.4, 0.2, 1, b.a, 0);
      } else if (k === 'meteor') {
        fx.sprite(T.GLOW, b.x, b.y, 3.4, 3.4, 0, 1.6, 0.7, 0.14, 0.7, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.BALL, b.x, b.y, b.shape.r, b.shape.r, b.a, 1, 0.42, 0.06, 1, 1, 0.8, 0.2, 1, b.a, 1);
      } else if (k === 'ceiling') {
        fx.sprite(T.BOX, b.x, b.y, b.shape.hw, b.shape.hh, 0, 0.1, 0.05, 0.2, 1, 0.8, 1.2, 2.4, 1, 0.1, 0.1);
      } else if (k === 'ppeg') {
        var fl = Math.exp(-(this.t - b.userData.lit) * 6), pc = hslToRgb(200, 0.9, 0.6), pd = hslToRgb(260, 0.9, 0.4);
        fx.sprite(T.PEG, b.x, b.y, b.shape.r, b.shape.r, 0, pc[0], pc[1], pc[2], 1, pd[0], pd[1], pd[2], 1, fl, 0);
        if (fl > 0.05) fx.sprite(T.GLOW, b.x, b.y, 1.1, 1.1, 0, pc[0] * 2, pc[1] * 2, pc[2] * 2, fl, 0, 0, 0, 0, 2, 0);
      } else if (k === 'pwall') {
        fx.sprite(T.BOX, b.x, b.y, b.shape.hw, b.shape.hh, 0, 0.5, 0.7, 1.4, 1, 0.2, 0.3, 0.7, 1, 0.03, 0.03);
      } else if (k === 'brick') {
        var hu = b.userData.hue, cc = hslToRgb(hu, b.userData.shape === 'slab' ? 0.55 : 0.8, 0.62);
        fx.sprite(T.DOMINO, b.x, b.y, b.shape.hw, b.shape.hh, b.a, cc[0], cc[1], cc[2], 1, cc[0] * 0.55, cc[1] * 0.55, cc[2] * 0.55, 1, 0, 0.8);
      } else if (k === 'wball') {
        fx.sprite(T.GLOW, b.x, b.y, 2.6, 2.6, 0, 1.2, 0.5, 0.15, 0.4, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.BALL, b.x, b.y, b.shape.r, b.shape.r, b.a, 0.9, 0.3, 0.1, 1, 1, 0.6, 0.2, 1, b.a, 0);
      } else if (k === 'colossus') {
        fx.sprite(T.GLOW, b.x, b.y, 4, 11, b.a, 1, 0.68, 0.14, 0.3, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.DOMINO, b.x, b.y, b.shape.hw, b.shape.hh, b.a, 1.05, 0.72, 0.18, 1, 0.62, 0.36, 0.06, 1, 0, 0.8);
      }
    }
    if (this.id === 'pachinko') {      // the five bins, with the jackpot glowing in the middle
      for (i = 0; i < 5; i++) {
        var bx = this.cx - 7.5 + (i + 0.5) * this.binW, jp = i === 2, pulse = 0.7 + 0.3 * Math.sin(now * 4);
        if (jp) fx.sprite(T.GLOW, bx, this.gy - 1, 2.4, 2.4, 0, 2.4, 1.8, 0.4, 0.5 * pulse, 0, 0, 0, 0, 2, 0);
        fx.text(String(this.bins[i]), bx, this.gy - 0.9, jp ? 0.75 : 0.55, jp ? 3 : 1.4, jp ? 2.4 : 1.8, jp ? 0.6 : 2.4, 1);
      }
    }
    if (this.grid) {
      fx.setGrid(this.grid.render(), this.grid.cols, this.grid.rows);
      var W = this.grid.cols * this.grid.cell, H = this.grid.rows * this.grid.cell;
      fx.sprite(T.GRID, this.grid.x0 + W / 2, this.grid.y0 + H / 2, W / 2, H / 2, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1.45, 0);
    }
    if (this.id === 'blackhole' && !this.collapsed) {
      var s = this.size, c1 = [1.6, 0.7, 2.6], c2 = [2.8, 1.2, 0.5];
      fx.sprite(T.GLOW, this.hx, this.hy, s * 5, s * 5, 0, 0.5, 0.2, 1, 0.6, 0, 0, 0, 0, 2, 0);
      fx.sprite(T.PORTAL, this.hx, this.hy, s * 2.5, s * 2.5, 0, c1[0], c1[1], c1[2], 1, c2[0], c2[1], c2[2], 1, 1.8, 0);
      fx.sprite(T.DISC, this.hx, this.hy, s, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
      fx.sprite(T.RING, this.hx, this.hy, s * 1.05, s * 1.05, 0, 3, 1.8, 2.4, 1, 0, 0, 0, 0, 0.04, 0);
      fx.hole = { x: this.hx, y: this.hy, r: s * 1.5, s: Math.min(1, this.t * 0.6) };
    } else if (this.id === 'blackhole') fx.hole = null;
    if (this.id === 'flip') {
      var dir = this.up ? -Math.PI / 2 : Math.PI / 2, phase = (now * 0.9) % 1;
      for (i = 0; i < 3; i++) fx.sprite(T.CHEVRON, fx.camX + (i - 1) * 9, fx.camY + (this.up ? -1 : 1) * phase * 2, 1.5, 1.1, dir, 0.7, 1.5, 2.4, 0.45, 0, 0, 0, 0, phase, 0);
    }
    if (this.id === 'rewind') {
      var back = this.mode === 'back';
      fx.vhs = back ? 1 : 0;
      fx.sat = back ? 0.55 : 1;
      if (back) fx.ca = Math.max(fx.ca, 1.1);
      if (back) {
        var ph2 = (now * 2.2) % 1, topY = fx.camY - fx.h / 2 * fx.px + 3.2;
        fx.sprite(T.CHEVRON, fx.camX - 1, topY, 1.2, 0.8, Math.PI, 2.4, 2.4, 2.8, 0.85, 0, 0, 0, 0, ph2, 0);
        fx.sprite(T.CHEVRON, fx.camX + 1, topY, 1.2, 0.8, Math.PI, 2.4, 2.4, 2.8, 0.85, 0, 0, 0, 0, ph2, 0);
      }
    }
    if (this.id === 'magnet' && this.down) {
      fx.sprite(T.GLOW, this.px, this.py, 2.4, 2.4, 0, 0.4, 1.2, 2.2, 0.7, 0, 0, 0, 0, 2, 0);
      var ph = (now * 2) % 1;
      fx.sprite(T.RING, this.px, this.py, 5 * (1 - ph) + 0.4, 5 * (1 - ph) + 0.4, 0, 0.6, 1.6, 2.6, ph, 0, 0, 0, 0, 0.04, 0);
    }
  };

  /** Called when the break ends. */
  Playground.prototype.end = function (fx) {
    if (fx) { fx.hole = null; fx.clearGrid(); fx.vhs = 0; fx.sat = 1; }
  };

  root.Playground = Playground;
})(typeof window !== 'undefined' ? window : globalThis);
