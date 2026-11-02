/*
 * The machine: a chain reaction built from a "recipe" (an ordered list of pieces).
 *
 *   marble -> toy -> dominoes -> last domino kicks the next resting marble -> next piece -> ... -> bell
 *
 * Every piece ends the same way: a row of dominoes whose last domino starts a resting "relay" marble rolling
 * off the end of the ramp into whatever comes next. Because the whole machine is rebuilt from its recipe, a new
 * piece can slot into ANY gap in the chain: everything below it simply moves down to make room.
 *
 * Pieces always step downward, so the contraption never overlaps itself however large it grows.
 * Works in the browser and headlessly in Node (see tests/machine-test.mjs).
 */
(function (root) {
  'use strict';
  var Phys = root.Phys;

  var GRAVITY = 14;
  var THICK = 0.3, CLEAR = 2.9, RAD = Math.PI / 180;
  var DOM_HW = 0.13, DOM_HH = 0.62, BALL_R = 0.34, SMALL_R = 0.24;
  var START_X = 0, START_Y = 4;

  /* label + the number of correct answers (ever) that unlocks it. Order is the unlock ladder. */
  var KINDS = {
    dominoes:   { label: 'Domino Row',     unlock: 0,  blurb: 'Dominoes knock dominoes, then kick a marble.' },
    steep:      { label: 'Speed Ramp',     unlock: 0,  blurb: 'A steep drop and a flying leap.' },
    pegs:       { label: 'Peg Field',      unlock: 0,  blurb: 'The marble rattles down through chiming pegs.' },
    zigzag:     { label: 'Switchback',     unlock: 2,  blurb: 'Back and forth, back and forth.' },
    seesaw:     { label: 'Catapult',       unlock: 4,  blurb: 'One marble lands, the other one flies.' },
    trampoline: { label: 'Trampoline',     unlock: 6,  blurb: 'Bounces the marble UP to a higher ledge.' },
    wrecking:   { label: 'Wrecking Ball',  unlock: 8,  blurb: 'Pull the latch and it swings.' },
    cannon:     { label: 'Cannon',         unlock: 10, blurb: 'Swallows the marble and fires it across the gap.' },
    nitro:      { label: 'Nitro Crate',    unlock: 13, blurb: 'Blows the marble across the gap.' },
    cascade:    { label: 'Marble Cascade', unlock: 16, blurb: 'A gate opens and a flood of marbles pours out.' },
    portal:     { label: 'Portal',         unlock: 20, blurb: 'In one side, out the other.' },
    cradle:     { label: "Newton's Cradle", unlock: 25, blurb: 'Click. Clack. Click. Clack.' },
    hourglass:  { label: 'Sand Timer',     unlock: 30, blurb: 'A trapdoor opens and sand runs down onto the dominoes.' },
    fork:       { label: 'The Fork',       unlock: 45, blurb: 'Two roads. A flat flick takes the short one; a high lob lands the long road for a bonus.' },
    fuse:       { label: 'Fire Fuse',      unlock: 100, blurb: 'A flame crawls along a rope, burns it through, and the ball drops.' }
  };

  function rng(seed) { // mulberry32
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * recipe: { seed, pieces: [{ id, kind, seed }] }
   * opts.emit(type, data) reports everything the renderer and scoring care about.
   */
  function Track(world, recipe, opts) {
    opts = opts || {};
    this.world = world;
    world.gy = GRAVITY;
    this.recipe = recipe;
    this.emit = opts.emit || function () {};
    this.now = opts.now || 0;
    this.sections = [];
    this.marbles = [];
    this.statics = [];
    this.debris = [];
    this.stars = [];
    this.run = null;
    this.toppled = 0;
    this.time = 0;
    this.baseHue = rng(recipe.seed)() * 360 | 0;
    var self = this;
    world.onSensor = function (s, o) { if (s.userData && s.userData.onHit) s.userData.onHit(o); };
    world.onImpact = function (a, b, x, y, imp) { self._impact(a, b, x, y, imp); };

    this._starter();
    for (var i = 0; i < recipe.pieces.length; i++) this._addSection(recipe.pieces[i], i === recipe.pieces.length - 1);
    this._floor();
  }
  Track.GRAVITY = GRAVITY; Track.BALL_R = BALL_R; Track.SMALL_R = SMALL_R; Track.KINDS = KINDS;
  Track.DOM = { hw: DOM_HW, hh: DOM_HH };
  Track.FLICK_MAX = 9.5;

  // ---------------------------------------------------------------- geometry helpers
  Track.prototype._static = function (sec, o, kind) {
    var b = this.world.add(new Phys.Body(o));
    b.userData = { kind: kind, section: sec ? sec.i : -1, pieceId: sec ? sec.id : 'start', key: kind + (sec ? sec.bodies.length : this.statics.length) };
    this.statics.push(b);
    if (sec) sec.bodies.push(b);
    return b;
  };

  Track.prototype._ramp = function (sec, x, y, dir, deg, L, kind) {
    var th = deg * RAD, a = dir * th, c = Math.cos(a), s = Math.sin(a);
    var lowX = x + dir * L * Math.cos(th), lowY = y + L * Math.sin(th);
    var body = this._static(sec, {
      x: (x + lowX) / 2 - s * (THICK / 2), y: (y + lowY) / 2 + c * (THICK / 2),
      a: a, hw: L / 2, hh: THICK / 2, isStatic: true, friction: 0.6, restitution: 0.1
    }, kind || 'platform');
    var ramp = {
      x: x, y: y, dir: dir, th: th, a: a, c: c, s: s, L: L, lowX: lowX, lowY: lowY, body: body,
      at: function (d, h) { h = h || 0; return { x: x + dir * d * Math.cos(th) + s * h, y: y + d * Math.sin(th) - c * h }; }
    };
    if (sec) sec.ramps.push(ramp);
    return ramp;
  };

  Track.prototype._wall = function (sec, x, yTop, yBottom, o) {
    return this._static(sec, {
      x: x, y: (yTop + yBottom) / 2, hw: (o && o.hw) || 0.2, hh: (yBottom - yTop) / 2,
      isStatic: true, friction: 0.2, restitution: (o && o.rest) == null ? 0.3 : o.rest
    }, (o && o.kind) || 'wall');
  };

  /** A ramp running back the other way beneath the marble's exit, with a backstop on the outside. */
  Track.prototype._turn = function (sec, px, py, pdir, o) {
    var x = px + pdir * o.gap, y = py + o.clear;
    var ramp = this._ramp(sec, x, y, -pdir, o.deg, o.L);
    this._wall(sec, x + pdir * 0.2, y - o.clear - (o.over == null ? 1.8 : o.over), y + 0.2);
    ramp.gap = o.gap;
    return ramp;
  };

  Track.prototype._entry = function (sec, r, p, L, deg) {
    return this._turn(sec, p.x, p.y, p.dir, { gap: 3.8 + r() * 1.2, clear: CLEAR, deg: deg, L: L, over: 0.9 });
  };

  /** A ramp carrying on in the same direction, starting below and ahead of a point. */
  Track.prototype._forward = function (sec, x, y, dir, deg, L) { return this._ramp(sec, x, y, dir, deg, L); };

  Track.prototype._domino = function (sec, ramp, d, hue) {
    var p = ramp.at(d, DOM_HH + 0.002);
    var b = this.world.add(new Phys.Body({
      x: p.x, y: p.y, a: ramp.a, hw: DOM_HW, hh: DOM_HH, density: 0.55, friction: 0.7, restitution: 0.02, asleep: true
    }));
    b.userData = { kind: 'domino', section: sec.i, pieceId: sec.id, key: 'dom' + sec.dominoes.length, a0: ramp.a, hue: hue, order: sec.dominoes.length, dir: ramp.dir };
    sec.dominoes.push(b);
    return b;
  };

  Track.prototype._marble = function (sec, x, y, o) {
    o = o || {};
    var b = this.world.add(new Phys.Body({
      x: x, y: y, circle: o.r || BALL_R, density: o.density || (o.small ? 11 : 4), friction: 0.45, restitution: 0.35, asleep: o.asleep !== false, manualWake: !!o.manualWake
    }));
    b.userData = {
      kind: 'marble', section: sec ? sec.i : -1, pieceId: sec ? sec.id : 'start', key: o.key || ('m' + this.marbles.length),
      hue: (o.hue == null ? this.baseHue : o.hue), role: o.role || 'relay', small: !!o.small, live: false
    };
    this.marbles.push(b);
    return b;
  };

  /** The end of every piece: rows of dominoes, each row kicking a resting marble. Sets sec.exit. */
  Track.prototype._run = function (sec, r, ramp, from, allowDouble) {
    var relayD = ramp.L - 1.05, lastD = relayD - 0.95, spacing = 0.66 + r() * 0.08, span = lastD - from;
    var wantDouble = r() < 0.75;
    var hue = sec.hue;
    var self = this;
    function row(a, b) {
      var n = Math.max(1, Math.floor((b - a) / spacing) + 1);
      for (var k = 0; k < n; k++) self._domino(sec, ramp, a + k * spacing, (hue + sec.dominoes.length * 7) % 360);
      return a + (n - 1) * spacing;
    }
    if (allowDouble && wantDouble && span > 9.5) {
      // domino -> domino -> marble -> domino -> domino -> marble
      var mid = from + span * (0.42 + r() * 0.14);
      var aEnd = row(from, mid);
      var mp = ramp.at(aEnd + 0.95, BALL_R + 0.001);
      var m = this._marble(sec, mp.x, mp.y, { role: 'kicker', hue: (hue + 180) % 360, key: 'kick' });
      sec.kickers.push(m);
      row(aEnd + 0.95 + 1.7, lastD);
    } else row(from, lastD);
    var rp = ramp.at(relayD, BALL_R + 0.001);
    var relay = this._marble(sec, rp.x, rp.y, { role: 'relay', hue: (hue + 180) % 360, key: 'relay' });
    sec.exit = { x: ramp.lowX, y: ramp.lowY, dir: ramp.dir, marble: relay, ramp: ramp };
    sec.relay = relay;
  };

  /** A sensor that catches the arriving marble and hands it to fn. Fires once. */
  Track.prototype._catch = function (sec, x, y, r, fn) {
    var self = this;
    var b = this._static(sec, { x: x, y: y, circle: r, isStatic: true, sensor: true }, 'sensor');
    b.userData.onHit = function (o) {
      if (!o.userData || o.userData.kind !== 'marble' || o.userData.small) return;
      if (o.userData.section === sec.i) return;      // only a marble arriving from upstream can trip it
      if (b.userData.used === o) return;                 // the marble it caught (a cannon fires that very marble back out)
      if (b.userData.used) { self._spend(o); return; }   // the toy already fired: any later marble is absorbed
      b.userData.used = o;
      fn.call(self, o);
    };
    return b;
  };

  Track.prototype._spend = function (m) {
    if (m.userData.spent || this.noSpend) return;
    m.userData.spent = this.time;
    if (this.keepMarbles && this.onKeep && !m.userData.small) this.onKeep(m);       // the "Marbles stay" unlock: remember where it was
    m.userData.live = false;
    m.ghost = true;                 // a retired marble fades out; it must not plough the dominoes it leaves behind
  };

  /** Launch a marble on a parabola that lands exactly on (tx, ty) T seconds from now. */
  Track.prototype.lob = function (m, tx, ty, T) {
    if (m.asleep) { m.manualWake = false; m.wake(); this.world._dropArbiters(m); }
    m.vx = (tx - m.x) / T;
    m.vy = (ty - m.y) / T - 0.5 * GRAVITY * T;
    m.w = (m.vx > 0 ? 1 : -1) * 6;
    m.userData.live = true;
  };

  // ---------------------------------------------------------------- the pieces
  var BUILD = {
    dominoes: function (sec, r, p) {
      var e = this._entry(sec, r, p, 15 + r() * 5, 7.5 + r() * 1.5);
      this._run(sec, r, e, e.gap + 1.9, true);
    },

    steep: function (sec, r, p) {
      var e = this._entry(sec, r, p, 9 + r() * 2.5, 15 + r() * 4);
      var gap = 6.2 + r() * 1.2;
      var t = this._turn(sec, e.lowX, e.lowY, e.dir, { gap: gap, clear: 3.4, deg: 8, L: 13 + r() * 3, over: 3 });
      sec.boost = e;
      this._run(sec, r, t, gap + 1.7, false);
    },

    /* The Fork: two roads into the same run. The low road is the ordinary entry. The high road is a second ramp beneath it and a
       little further on, behind a short wall that a flat flick bangs into: only a lob clears the wall and lands on it. */
    fork: function (sec, r, p) {
      var deg = 9 + r(), L = 11 + r() * 2.5, th = deg * RAD, F = p.dir;
      var e = this._turn(sec, p.x, p.y, F, { gap: 3.8 + r() * 0.8, clear: CLEAR, deg: deg, L: L, over: -1.4 });
      var dx = 2.3 + r() * 0.7, dy = 1.3 + r() * 0.5, x2 = e.x + F * dx, y2 = e.y + dy;       // how far on, and how far below, the high road starts
      var xl = e.lowX - e.dir * 1.0, L2 = Math.abs(x2 - xl) / Math.cos(th);
      var hi = this._ramp(sec, x2, y2, e.dir, deg, L2);
      hi.body.userData.lane = 'high'; hi.body.userData.hue = sec.hue;
      hi.bonus = r() < 0.5 ? 150 : 250;
      this._wall(sec, x2 - e.dir * 0.2, y2 - 1.3, y2 + 0.2);
      var gap = 6.4 + r() * 0.8;
      var t = this._turn(sec, e.lowX, e.lowY, e.dir, { gap: gap, clear: 3.6, deg: 8, L: 13 + r() * 3, over: 3 });
      sec.fork = hi;
      // Where marbles that arrive down the chain go, which is decided by this level's seed: all down the low road, all down the high
      // road, or taking turns (so that several live marbles use both). A flicked marble is never rerouted: that choice is his.
      var roll = r();
      sec.route = (this.recipe.pieces[sec.i] && this.recipe.pieces[sec.i].route) || (roll < 0.3 ? 'low' : roll < 0.65 ? 'high' : 'split');
      sec.routed = 0;
      var self = this, gx = p.x + F * 0.9, gy = p.y + 1.4;      // (just below the marble that hands over: every arrival falls through here)
      var gate = this._static(sec, { x: gx, y: gy, circle: 1.3, isStatic: true, sensor: true }, 'sensor');
      gate.userData.onHit = function (o) {
        var u = o.userData;
        if (!u || u.kind !== 'marble' || u.spent || u.routed === sec.i || u.section >= sec.i || u.role === 'toy') return;
        if (self.run && o === self.run.marble && self.run.from === sec.i) return;
        if (u.routeHigh == null) { u.routeHigh = sec.route === 'high' || (sec.route === 'split' && sec.routed % 2 === 0); sec.routed++; }      // (decided once per marble)
        if (!u.routeHigh) { u.routed = sec.i; return; }
        var shot = self._forkShot(o.x, o.y, hi);
        if (!shot) return;      // no clear lob from here: try again a moment later, further along its fall
        u.routed = sec.i;
        o.manualWake = false; if (o.asleep) o.wake();
        o.vx = shot.vx; o.vy = shot.vy; o.w = shot.vx > 0 ? 6 : -6;
        self.emit('routed', { x: o.x, y: o.y, lane: 'high' });
      };
      this._run(sec, r, t, gap + 1.7, false);
    },

    pegs: function (sec, r, p) {
      var e = this._entry(sec, r, p, 8 + r() * 2, 10);
      var gap = 6.4, clear = 6.8;
      var t = this._turn(sec, e.lowX, e.lowY, e.dir, { gap: gap, clear: clear, deg: 8, L: 13 + r() * 3 });
      var rows = 3;
      for (var k = 0; k < rows; k++) {
        var y = e.lowY + 1.7 + k * 1.55, n = k % 2 ? 3 : 2;
        for (var q = 0; q < n; q++) {
          var off = (k % 2 ? 0.75 : 1.6) + q * 1.7 + (r() - 0.5) * 0.25;
          this._peg(sec, e.lowX + e.dir * off, y + (r() - 0.5) * 0.2);
        }
      }
      this._run(sec, r, t, gap + 1.9, false);
    },

    zigzag: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7, 12);
      var turns = 2 + (r() < 0.5 ? 1 : 0), cur = e;
      for (var i = 0; i < turns; i++) cur = this._turn(sec, cur.lowX, cur.lowY, cur.dir, { gap: 1.5, clear: 1.9, deg: 12, L: 6 + r(), over: 0.9 });
      var t = this._turn(sec, cur.lowX, cur.lowY, cur.dir, { gap: 1.8, clear: 2.1, deg: 8, L: 12 + r() * 3, over: 1 });
      this._run(sec, r, t, 3.2, false);
    },

    /* Catapult: an arriving marble lands on the high end of a plank, and the far end flips a waiting marble into the air */
    seesaw: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir;
      var hl = 2.5, tilt = 0.3 * F;
      var cx = e.lowX + F * (hl + 1.25), cy = e.lowY + 3.1;
      var plank = this.world.add(new Phys.Body({ x: cx, y: cy, a: tilt, hw: hl, hh: 0.13, density: 1.2, friction: 0.7, restitution: 0.05, asleep: true }));
      plank.userData = { kind: 'plank', section: sec.i, pieceId: sec.id, key: 'plank', a0: tilt };
      this.world.hinge(plank, cx, cy);
      sec.moving.push(plank);
      var ch = Math.cos(0.3), sh = Math.sin(0.3);
      // stops: the plank can rock between +/- 0.3 rad
      this._static(sec, { x: cx + F * hl * ch, y: cy + hl * sh + 0.4, hw: 0.3, hh: 0.24, isStatic: true }, 'stop');
      this._static(sec, { x: cx - F * hl * ch, y: cy + hl * sh + 0.4, hw: 0.3, hh: 0.24, isStatic: true }, 'stop');
      this._static(sec, { x: cx, y: cy + 0.75, hw: 0.28, hh: 0.62, isStatic: true }, 'pivot');
      var pass = this._marble(sec, cx + F * (hl - 0.55) * ch + sh * (BALL_R + 0.13) * F, cy + (hl - 0.55) * sh - ch * (BALL_R + 0.13), { role: 'passenger', hue: sec.hue, key: 'pass', manualWake: true });
      var gap = 4.2, t = this._turn(sec, cx + F * hl, cy, F, { gap: gap, clear: 2.5, deg: 8, L: 15 + r() * 2, over: 2.5 });
      var lp = t.at(2, BALL_R);               // land clear of the plank, between its end and the backstop
      var self = this, input = null;
      sec.toy = {
        type: 'seesaw', triggered: false, plank: plank,
        update: function () {
          if (this.flying && self.time > this.flying) { pass.ghost = false; this.flying = 0; }
          if (!this.triggered && Math.abs(plank.w) > 0.5) this.fire();
        },
        fire: function () {
          if (this.triggered) return;
          this.triggered = true;
          if (plank.asleep) plank.wake();
          plank.w = -F * 3.2;
          self.lob(pass, lp.x, lp.y, 1.4);
          // clear of the plank while it swings: a second kick from it would send the marble into the ramp above
          pass.ghost = true; this.flying = self.time + 0.3;
          self.emit('toy', { what: 'launch', kind: 'seesaw', x: pass.x, y: pass.y, sec: sec });
        },
        force: function () { this.fire(); }
      };
      sec.passenger = pass;
      this._run(sec, r, t, gap + 2.6, false);
    },

    trampoline: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir;
      var padX = e.lowX + F * 3.4, padY = e.lowY + 5.4;
      var pad = this._static(sec, { x: padX, y: padY + 0.1, hw: 2.1, hh: 0.14, isStatic: true }, 'pad');
      this._static(sec, { x: padX, y: padY + 0.55, hw: 2.3, hh: 0.2, isStatic: true }, 'padbase');
      this._wall(sec, padX - F * 2.3, padY - 3.8, padY + 0.5, { hw: 0.14 });
      this._wall(sec, padX + F * 2.3, padY - 2.2, padY + 0.5, { hw: 0.14 });
      var t = this._forward(sec, padX + F * 3.6, padY - 2.4, F, 8, 13 + r() * 3);
      var lp = t.at(2.6, BALL_R), self = this;
      var toy = sec.toy = {
        type: 'trampoline', triggered: false, x: padX, y: padY, hit: -9,
        update: function () {},
        bounce: function (m) {
          this.triggered = true; this.hit = self.time;
          self.lob(m, lp.x, lp.y, 1.15);
          self.emit('toy', { what: 'bounce', kind: 'trampoline', x: m.x, y: padY, sec: sec });
        },
        force: function () { var m = self._liveMarble(); if (m) { m.x = padX; m.y = padY - 0.6; this.bounce(m); } else this.triggered = true; }
      };
      pad.userData.toy = toy;
      this._run(sec, r, t, 5.6, false);
    },

    wrecking: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var len = 3.3, ax = X + F * 3.5, ay = Y + 1.0, raise = 78 * RAD;
      var bx = ax - F * Math.sin(raise) * len, by = ay + Math.cos(raise) * len;
      var ball = this.world.add(new Phys.Body({ x: bx, y: by, circle: 0.66, density: 3.2, friction: 0.4, restitution: 0.3, asleep: true, manualWake: true }));
      ball.userData = { kind: 'wrecker', section: sec.i, pieceId: sec.id, key: 'wreck', ax: ax, ay: ay };
      this.world.hinge(ball, ax, ay);
      sec.moving.push(ball);
      var ledgeY = ay + len + BALL_R + 0.02;
      var ledge = this._ramp(sec, ax + F * 0.72, ledgeY, F, 0, 4.2);
      var mp = ledge.at(0.33, BALL_R + 0.001);
      var pass = this._marble(sec, mp.x, mp.y, { role: 'passenger', hue: sec.hue, key: 'pass' });
      var gap = 5.6, t = this._turn(sec, ledge.lowX, ledge.lowY, F, { gap: gap, clear: 3, deg: 8, L: 13 + r() * 3, over: 3 });
      var self = this;
      sec.toy = {
        type: 'wrecking', triggered: false, ball: ball,
        update: function () { if (this.triggered && !ball.asleep) { ball.vx *= 0.996; ball.vy *= 0.996; ball.w *= 0.996; } },
        fire: function (m) {
          if (this.triggered) return;
          this.triggered = true;
          if (m) self._spend(m);
          ball.manualWake = false; ball.wake(); ball.w = 0;
          self.emit('toy', { what: 'swing', kind: 'wrecking', x: X, y: Y, sec: sec });
        },
        force: function () {
          if (!this.triggered) this.fire();
          else { pass.wake(); pass.vx = F * 7; pass.userData.live = true; }
        }
      };
      var toy = sec.toy;
      this._catch(sec, X + F * 0.1, Y - 0.25, 0.6, function (m) { toy.fire(m); });
      sec.passenger = pass;
      this._run(sec, r, t, gap + 1.9, false);
    },

    cannon: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var mx = X + F * 0.9, my = Y - 0.2;
      this._static(sec, { x: X + F * 0.9, y: Y + 0.75, hw: 0.75, hh: 0.45, isStatic: true }, 'cannonbase');
      var t = this._forward(sec, X + F * (9.5 + r() * 1.5), Y + 2.4, F, 8, 13 + r() * 3);
      var lp = t.at(2.4, BALL_R), self = this;
      var toy = sec.toy = {
        type: 'cannon', triggered: false, x: mx, y: my, dir: F, angle: -F * 0.95, charge: 0, fired: -9, m: null,
        update: function (dt) {
          if (!this.m || this.fired > 0) return;
          this.charge += dt;
          if (this.charge > 0.6) this.fire();
        },
        take: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.m = m;
          m.sleep(); m.manualWake = true; m.x = mx; m.y = my; m.userData.held = true;
          self.emit('toy', { what: 'charge', kind: 'cannon', x: mx, y: my, sec: sec });
        },
        fire: function () {
          var m = this.m; this.fired = self.time; m.userData.held = false;
          self.lob(m, lp.x, lp.y, 1.25);
          self.emit('toy', { what: 'boom', kind: 'cannon', x: mx, y: my, sec: sec, dir: F, power: 1 });
        },
        force: function () { if (!this.triggered) { var m = self._liveMarble(); if (m) this.take(m); else this.triggered = true; } }
      };
      this._catch(sec, X + F * 0.2, Y - 0.3, 0.6, function (m) { toy.take(m); });
      this._run(sec, r, t, 5.2, false);
    },

    nitro: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var cp = e.at(e.L - 0.65, 0.56);
      var crate = this._static(sec, { x: cp.x, y: cp.y, a: e.a, hw: 0.55, hh: 0.55, isStatic: true, restitution: 0 }, 'nitro');
      // a stack of blocks for the blast to throw around
      var shelf = this._ramp(sec, X + F * 1.1, Y + 1.1, F, 0, 3.2);
      var blocks = [];
      for (var cx = 0; cx < 2; cx++) for (var cy = 0; cy < 3; cy++) {
        var bp = shelf.at(0.75 + cx * 1.05, 0.27 + cy * 0.54);
        var b = this.world.add(new Phys.Body({ x: bp.x, y: bp.y, hw: 0.48, hh: 0.26, density: 0.5, friction: 0.5, restitution: 0.1, asleep: true, manualWake: true }));
        b.userData = { kind: 'block', section: sec.i, pieceId: sec.id, key: 'block' + blocks.length, hue: (sec.hue + cx * 25 + cy * 15) % 360 };
        blocks.push(b); this.debris.push(b);
      }
      var gap = 8.2, t = this._turn(sec, shelf.lowX, shelf.lowY, F, { gap: gap - 3.2, clear: 3.2, deg: 8, L: 14 + r() * 3, over: 4 });
      var lp = t.at(1.8, BALL_R), self = this;
      var toy = sec.toy = {
        type: 'nitro', triggered: false, crate: crate, fuse: -1, m: null,
        update: function (dt) {
          if (this.fuse < 0) return;
          this.fuse -= dt;
          if (this.fuse <= 0) { this.fuse = -1; this.boom(); }
        },
        light: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.m = m; this.fuse = 0.09;
        },
        boom: function () {
          self.world.remove(crate); crate.userData.gone = true;
          blocks.forEach(function (b) { b.manualWake = false; b.ghost = true; b.userData.dissolve = self.time + 1.5; });
          self.world.explode(cp.x, cp.y, 7, 11);
          if (this.m) self.lob(this.m, lp.x, lp.y, 1.05);
          self.emit('toy', { what: 'boom', kind: 'nitro', x: cp.x, y: cp.y, sec: sec, dir: F, power: 2 });
        },
        force: function () { if (!this.triggered) this.light(self._liveMarble()); }
      };
      crate.userData.toy = toy;
      this._run(sec, r, t, gap - 3.2 + 2.2, false);
    },

    cascade: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var t = this._forward(sec, X + F * 1.0, Y + 3.4, F, 8, 18 + r() * 3);
      this._wall(sec, t.x - F * 0.15, t.y - 3.1, t.y + 0.2, { hw: 0.14, kind: 'hopper' });
      var gp = t.at(3.45, 1.3);
      var gate = this._static(sec, { x: gp.x, y: gp.y, a: t.a, hw: 0.12, hh: 1.3, isStatic: true, friction: 0.1 }, 'gate');
      var small = [], nx = 5, ny = 3;
      for (var iy = 0; iy < ny; iy++) for (var ix = 0; ix < nx; ix++) {
        var mp = t.at(0.5 + ix * 0.54 + (iy % 2 ? 0.24 : 0), SMALL_R + 0.01 + iy * 0.5);
        var m = this._marble(sec, mp.x, mp.y, { r: SMALL_R, small: true, role: 'small', hue: (sec.hue + ix * 30 + iy * 40) % 360, key: 'small' + small.length, manualWake: true });
        small.push(m);
      }
      var self = this;
      var toy = sec.toy = {
        type: 'cascade', triggered: false, gate: gate, small: small, opened: -9,
        update: function () {},
        open: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.opened = self.time;
          if (m) self._spend(m);
          self.world.remove(gate); gate.userData.gone = true;
          small.forEach(function (s) { s.manualWake = false; s.wake(); s.userData.live = true; s.userData.expire = self.time + 7; s.vx += F * 0.6; });
          self.emit('toy', { what: 'gate', kind: 'cascade', x: gp.x, y: gp.y, sec: sec });
        },
        force: function () { this.open(); }
      };
      this._catch(sec, X + F * 0.1, Y - 0.25, 0.6, function (m) { toy.open(m); });
      this._run(sec, r, t, 7.6, false);
    },

    /* Sand Timer: an arriving marble springs a trapdoor under a funnel of sand, which runs down onto the ramp and knocks the row
       over. The grains are tiny heavy marbles, so it costs no more to run than a Marble Cascade. */
    hourglass: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var t = this._forward(sec, X + F * 1.0, Y + 3.4, F, 8, 18 + r() * 3);
      var ground = t.at(1.75, 0), N = { x: ground.x, y: ground.y - 2.4 };         // the middle of the funnel's neck
      var nh = 0.26, wide = 1.6, H = 3.2, slope = (wide - nh) / H, GRAIN = 0.12, COUNT = 44;
      var self = this;
      // the funnel: two slanted planks, set so that their inner faces run through the lines given
      function plank(x0, y0, x1, y1, out) {
        var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), nx = -dy / L, ny = dx / L;
        if (nx * out < 0) { nx = -nx; ny = -ny; }
        self._static(sec, { x: (x0 + x1) / 2 + nx * 0.12, y: (y0 + y1) / 2 + ny * 0.12, a: Math.atan2(dy, dx), hw: L / 2, hh: 0.12, isStatic: true, friction: 0.25, restitution: 0.05 }, 'funnel');
      }
      plank(N.x - nh, N.y, N.x - wide, N.y - H, -1);
      plank(N.x + nh, N.y, N.x + wide, N.y - H, 1);
      var trap = this._static(sec, { x: N.x, y: N.y + 0.08, hw: nh + 0.3, hh: 0.07, isStatic: true, friction: 0.3 }, 'gate');
      var grains = [], y = N.y - 0.2, row = 0;
      while (grains.length < COUNT && row < 40) {
        var half = nh + (N.y - y) * slope - 0.3, n = half <= 0 ? 1 : Math.floor(2 * half / 0.27 + 1e-6) + 1;
        for (var i = 0; i < n && grains.length < COUNT; i++) {
          var g = this._marble(sec, N.x + (i - (n - 1) / 2) * 0.27 + (r() - 0.5) * 0.03, y, { r: GRAIN, small: true, role: 'small', hue: 38 + (r() * 14 | 0), key: 'grain' + grains.length, manualWake: true });
          g.userData.sand = true; g.restitution = 0.08; g.friction = 0.6;
          grains.push(g);
        }
        y -= 0.25; row++;
      }
      var toy = sec.toy = {
        type: 'hourglass', triggered: false, trap: trap, grains: grains, opened: -9, x: N.x, y: N.y, shaken: 0,
        update: function () {
          if (!this.triggered) return;
          // sand that reaches the first domino and only piles against its foot: once it has lingered, the heap tips it over
          var d0 = sec.dominoes[0], u0 = d0 && d0.userData;
          if (d0 && !u0.fell && !u0.dissolve) {
            var near = false;
            for (var q = 0; q < grains.length; q++) { var gq = grains[q]; if (!gq.userData.spent && Math.abs(gq.x - d0.x) < 0.9 && Math.abs(gq.y - d0.y) < 0.9) { near = true; break; } }
            if (!near) this.heap = 0;
            else {
              if (!this.heap) this.heap = self.time;
              if (self.time - this.heap > 0.7 && self.time - (this.tipped || -9) > 0.8 && (this.tips || 0) < 3) {
                this.tips = (this.tips || 0) + 1; this.tipped = self.time;
                if (d0.asleep) { d0.wake(); self.world._dropArbiters(d0); }
                d0.w += u0.dir * (3.6 + this.tips); d0.vx += u0.dir * 0.8;
              }
            }
          }
          // a funnel can arch and jam: every so often, shake whatever is still stuck above the neck
          if (self.time - this.opened < 1.2 || self.time - this.shaken < 0.45) return;
          this.shaken = self.time;
          for (var k = 0; k < grains.length; k++) {
            var gk = grains[k];
            if (gk.userData.spent || gk.y > N.y + 0.2 || gk.y < N.y - H || Math.abs(gk.x - N.x) > wide) continue;
            if (gk.vx * gk.vx + gk.vy * gk.vy < 0.2) { gk.wake(); gk.vx += (r() - 0.5) * 2.2; gk.vy += 0.6; }
          }
        },
        open: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.opened = self.time;
          if (m) self._spend(m);
          self.world.remove(trap); trap.userData.gone = true;
          grains.forEach(function (gk) { gk.manualWake = false; gk.wake(); gk.userData.live = true; gk.userData.expire = self.time + 9; gk.vy += 0.3; });
          self.emit('toy', { what: 'pour', kind: 'hourglass', x: N.x, y: N.y, sec: sec });
        },
        force: function () { this.open(); }
      };
      this._catch(sec, X + F * 0.1, Y - 0.25, 0.6, function (m) { toy.open(m); });
      this._run(sec, r, t, 7.6, false);
    },

    /* Fire Fuse: an arriving marble lights a rope. A flame crawls along it, and when it has burned through, the ball it was
       holding drops onto the ramp and rolls into the dominoes. */
    fuse: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var t = this._forward(sec, X + F * 1.0, Y + 3.4, F, 8, 18 + r() * 3);
      var gd = t.at(2.7, 0), B = { x: gd.x, y: gd.y - 1.3 };                       // where the ball hangs, a little above the ramp
      var top = { x: B.x, y: B.y - 1.7 }, lit = { x: X + F * 0.4, y: Y - 0.1 };     // the rope's upper end, and the end the marble lights
      var pts = [lit, top, { x: B.x, y: B.y - BALL_R }];
      function dist(a, b) { return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }
      var lens = [dist(pts[0], pts[1]), dist(pts[1], pts[2])], total = lens[0] + lens[1], SPEED = 1.7, burn = total / SPEED;
      var ball = this._marble(sec, B.x, B.y, { role: 'passenger', hue: 28, key: 'dropball', manualWake: true });
      var self = this;
      var toy = sec.toy = {
        type: 'fuse', triggered: false, released: false, lit: -9, fuse: -1, pts: pts, lens: lens, total: total, speed: SPEED, ball: ball,
        update: function () {
          if (!this.triggered || this.released) return;
          this.fuse = Math.max(0, burn - (self.time - this.lit));
          if (this.fuse <= 0) this.release();
        },
        light: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.lit = self.time; this.fuse = burn;
          if (m) self._spend(m);
          self.emit('toy', { what: 'ignite', kind: 'fuse', x: pts[0].x, y: pts[0].y, sec: sec });
        },
        release: function () {
          if (this.released) return;
          this.released = true; this.fuse = -1;
          ball.manualWake = false; ball.wake(); ball.userData.live = true; ball.vx += F * 0.4;
          self.emit('toy', { what: 'drop', kind: 'fuse', x: ball.x, y: ball.y, sec: sec });
        },
        force: function () { if (!this.triggered) this.light(); else this.release(); }
      };
      sec.passenger = ball;
      this._catch(sec, X + F * 0.1, Y - 0.25, 0.6, function (m) { toy.light(m); });
      this._run(sec, r, t, 7.6, false);
    },

    portal: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var ix = X + F * 1.4, iy = Y + 0.3;
      var ox = X + F * (11 + r() * 2), oy = Y + 0.8;
      var t = this._forward(sec, ox - F * 1.4, oy + 2.6, F, 8, 13 + r() * 3);
      var self = this;
      var toy = sec.toy = {
        type: 'portal', triggered: false, ax: ix, ay: iy, bx: ox, by: oy, flash: -9,
        update: function () {},
        warp: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.flash = self.time;
          var fx = m.x, fy = m.y;
          m.x = ox; m.y = oy; m.vx = F * 2.2; m.vy = 3; self.world._dropArbiters(m);
          self.emit('toy', { what: 'portal', kind: 'portal', x: fx, y: fy, x2: ox, y2: oy, sec: sec });
        },
        force: function () { if (!this.triggered) { var m = self._liveMarble(); if (m) this.warp(m); else this.triggered = true; } }
      };
      this._catch(sec, ix, iy, 0.85, function (m) { toy.warp(m); });
      this._run(sec, r, t, 4.4, false);
    },

    /* Newton's cradle: scripted swing (it is the one toy where exact rhythm matters more than free physics) */
    cradle: function (sec, r, p) {
      var e = this._entry(sec, r, p, 7 + r(), 10), F = e.dir, X = e.lowX, Y = e.lowY;
      var ledge = this._ramp(sec, X, Y + 0.02, F, 0, 8.6);
      var br = 0.34, n = 5, x0 = X + F * 1.75, by = Y - br, len = 2.6;
      var mp = { x: x0 + F * (n - 1) * 2 * br + F * (br + BALL_R + 0.03), y: Y - BALL_R };
      var pass = this._marble(sec, mp.x, mp.y, { role: 'passenger', hue: sec.hue, key: 'pass', manualWake: true });
      var gap = 5.2, t = this._turn(sec, ledge.lowX, ledge.lowY, F, { gap: gap, clear: 3, deg: 8, L: 13 + r() * 3, over: 3 });
      var self = this;
      var toy = sec.toy = {
        type: 'cradle', triggered: false, x0: x0, y: by - len, len: len, br: br, n: n, dir: F,
        t: -1, last: 0, kicked: false, a: 0,
        update: function (dt) {
          if (this.t < 0) return;
          this.t += dt;
          var w = 7.2, A = 0.72 * Math.exp(-this.t * 0.42);
          this.a = A * Math.sin(this.t * w);
          var beat = Math.floor(this.t * w / Math.PI);
          if (beat !== this.last) {
            this.last = beat;
            if (A > 0.12) self.emit('toy', { what: 'click', kind: 'cradle', x: x0 + F * 3 * br, y: by, sec: sec, amp: A });
          }
          if (!this.kicked && this.a > 0.2) {
            this.kicked = true; pass.manualWake = false; pass.wake(); pass.vx = F * 7.5; pass.userData.live = true;
          }
          if (A < 0.03) { this.t = -1; this.a = 0; }
        },
        strike: function (m) {
          if (this.triggered) return;
          this.triggered = true; this.t = 0; this.last = 0;
          if (m) self._spend(m);
          self.emit('toy', { what: 'click', kind: 'cradle', x: x0, y: by, sec: sec, amp: 0.8 });
        },
        force: function () {
          if (!this.triggered) this.strike();
          else if (!this.kicked) { this.kicked = true; pass.manualWake = false; pass.wake(); pass.vx = F * 7.5; pass.userData.live = true; }
        }
      };
      this._catch(sec, x0 - F * (br + 0.1), by, 0.5, function (m) { toy.strike(m); });
      sec.passenger = pass;
      this._run(sec, r, t, gap + 1.9, false);
    }
  };

  Track.prototype._peg = function (sec, x, y) {
    var g = this._static(sec, { x: x, y: y, circle: 0.24, isStatic: true, restitution: 0.6, friction: 0.1 }, 'peg');
    g.userData.lit = -9;
    return g;
  };

  // ---------------------------------------------------------------- assembling the chain
  Track.prototype._starter = function () {
    var ledge = this._ramp(null, START_X - 4.4, START_Y, 1, 7, 4.4, 'platform');
    this._wall(null, ledge.x - 0.2, START_Y - 0.7, START_Y + 0.2);
    var mp = ledge.at(ledge.L - 1.05, BALL_R + 0.001);
    var m = this._marble(null, mp.x, mp.y, { role: 'starter', key: 'starter' });
    this.head = { x: ledge.lowX, y: ledge.lowY, dir: 1, marble: m, ramp: ledge };
  };

  Track.prototype._addSection = function (piece, isLast) {
    var i = this.sections.length, r = rng(piece.seed);
    var sec = {
      i: i, id: piece.id, kind: piece.kind, hue: (this.baseHue + i * 41) % 360,
      ramps: [], bodies: [], dominoes: [], kickers: [], moving: [], toy: null, exit: null, relay: null, passenger: null,
      started: false, done: false, nextDomino: 0
    };
    var prev = i ? this.sections[i - 1].exit : this.head;
    (BUILD[piece.kind] || BUILD.dominoes).call(this, sec, r, prev);
    this.sections.push(sec);
    if (isLast) this._bell(sec);
  };

  Track.prototype._bell = function (sec) {
    var e = sec.exit, F = e.dir, self = this;
    var bx = e.x + F * 2.4, by = e.y + 2.9;
    var cup = this._static(sec, { x: bx, y: by, circle: 1.15, isStatic: true, sensor: true }, 'bell');
    cup.userData.onHit = function (o) { if (o.userData && o.userData.kind === 'marble') self._ring(o); };
    this._wall(sec, bx + F * 1.7, by - 3.5, by + 1.4, { hw: 0.14 });
    this.bell = { x: bx, y: by, rung: -9, dir: F };
  };

  Track.prototype._ring = function (m) {
    if (!this.bell || this.bell.rung > 0) return;
    this.bell.rung = this.time;
    if (m) this._spend(m);
    var run = this.run;
    if (run) { run.over = true; run.finished = true; }
    this.emit('bell', { x: this.bell.x, y: this.bell.y, run: run });
  };

  Track.prototype._floor = function () {
    var b = this.bounds(), bottom = this.bottomY();
    var cx = (b.minX + b.maxX) / 2, hw = (b.maxX - b.minX) / 2 + 40;
    this.floor = this.world.add(new Phys.Body({ x: cx, y: bottom + 0.5, hw: hw, hh: 0.5, isStatic: true, friction: 0.7 }));
    this.floor.userData = { kind: 'floor', section: -2 };
  };

  Track.prototype.bounds = function () {
    var b = { minX: START_X - 6, maxX: START_X + 6, minY: START_Y - 6, maxY: this.bottomY() };
    this.sections.forEach(function (s) {
      s.ramps.forEach(function (r) {
        b.minX = Math.min(b.minX, r.x, r.lowX); b.maxX = Math.max(b.maxX, r.x, r.lowX);
      });
    });
    return b;
  };

  Track.prototype.bottomY = function () {
    var y = START_Y;
    this.sections.forEach(function (s) { s.ramps.forEach(function (r) { y = Math.max(y, r.y, r.lowY); }); });
    return y + 7;
  };

  /** The marble that plays piece i: the one resting at the end of whatever comes before it. */
  Track.prototype.marbleFor = function (i) { return i <= 0 ? this.head.marble : this.sections[i - 1].exit.marble; };
  Track.prototype.exitFor = function (i) { return i <= 0 ? this.head : this.sections[i - 1].exit; };

  // ---------------------------------------------------------------- running the chain
  /** Flick the marble above piece `from`. The chain then runs on its own down to the bell. */
  Track.prototype.startRun = function (from, vx, vy) {
    var m = this.marbleFor(from);
    if (!m) return null;
    if (m.asleep) { m.manualWake = false; m.wake(); this.world._dropArbiters(m); }
    m.vx = vx; m.vy = vy; m.w = (vx >= 0 ? 1 : -1) * 4;
    m.userData.live = true;
    m.userData.flicked = this.time;
    m.userData.home = m.userData.home || { x: m.x, y: m.y };
    m.userData.home0 = m.userData.home0 || { x: m.userData.home.x, y: m.userData.home.y };
    this.run = {
      from: from, marble: m, t0: this.time, idle: 0, nudges: 0, over: false, finished: false, engaged: false,
      dominoes: 0, sections: {}, stuck: 0, multiplier: 1
    };
    this.frontier = from;
    if (this.sections[from]) this._startSection(this.sections[from]);
    return this.run;
  };

  Track.prototype._startSection = function (sec) {
    if (sec.started) return;
    sec.started = true;
    this.frontier = Math.max(this.frontier || 0, sec.i);
    this.emit('section', { sec: sec });
  };

  Track.prototype._liveMarble = function () {
    var best = null;
    for (var i = 0; i < this.marbles.length; i++) {
      var m = this.marbles[i];
      if (m.userData.live && !m.userData.spent && !m.userData.small && !m.userData.held) {
        if (!best || m.y > best.y) best = m;
      }
    }
    return best;
  };

  Track.prototype._impact = function (a, b, x, y, imp) {
    var ma = a.userData && a.userData.kind === 'marble' ? a : null, mb = b.userData && b.userData.kind === 'marble' ? b : null;
    var m = ma || mb, o = ma ? b : a;
    if (m && o.userData) {
      if (o.userData.kind === 'peg') o.userData.lit = this.time;
      if (o.userData.lane === 'high' && m.userData.role !== 'toy' && !m.userData.high && !(this.run && m === this.run.marble)) {
        m.userData.high = true;      // any other marble (a burst marble, or one sent along by the chain) that lands on the high road
        var hs = this.sections[o.userData.section], hb = hs && hs.fork ? hs.fork.bonus : 150;
        this.emit('branch', { x: x, y: y, run: this.run, lane: 'high', burst: true, bonus: Math.round(hb * 0.6) });
      }
      if (o.userData.lane === 'high' && this.run && m === this.run.marble && !this.run.high) {
        this.run.high = true; this.run.multiplier++;
        this.emit('branch', { x: x, y: y, run: this.run, lane: 'high', bonus: (this.sections[o.userData.section] && this.sections[o.userData.section].fork || {}).bonus || 150 });
      }
      if (o.userData.kind === 'domino') {
        // A marble strikes a domino below its balance point, which on its own would just shove it along upright.
        // Convert the hit into a forward tip so the row topples as a wave rather than bunching up like a train.
        var dd = o.userData.dir;
        if (!o.userData.fell && Math.abs(o.a - o.userData.a0) < 0.3) { o.vx *= 0.25; o.vy *= 0.25; o.w = dd * Math.max(2.8, Math.abs(o.w)); }
      }
      if (o.userData.kind === 'domino' && !m.userData.small && m.userData.section !== o.userData.section) m.userData.brake = true;
      if (o.userData.kind === 'domino' && !m.userData.small && m.userData.role === 'kicker') m.userData.brake = true;
      if (o.userData.kind === 'pad' && o.userData.toy && !m.userData.small) o.userData.toy.bounce(m);
      if (o.userData.kind === 'nitro' && o.userData.toy && !m.userData.small) o.userData.toy.light(m);
      var si = o.userData.section;
      if (this.run && !this.run.engaged && si != null && si >= this.run.from && si >= 0) {
        this.run.engaged = true;
        var mu = this.run.marble.userData; if (mu.home0) mu.home = mu.home0;       // (a marble that rested on the ledge is back to its usual home)
        this.emit('engaged', { x: x, y: y, run: this.run });
      }
      if (si != null && si >= 0 && this.sections[si] && this.run && m.userData.section !== si) this._startSection(this.sections[si]);
    }
    if (m && this.run && m === this.run.marble && o.userData && o.userData.kind !== 'marble' && imp > 0.3) this.run.touched = true;      // (no longer a clean shot)
    this.emit('impact', { a: a, b: b, x: x, y: y, imp: imp, marble: m });
  };

  Track.prototype.tick = function (dt, now) {
    this.time += dt;
    this.now = now == null ? this.now : now;
    var t = this.time, i, s, m;

    for (i = 0; i < this.sections.length; i++) {
      s = this.sections[i];
      if (s.toy && s.toy.update) s.toy.update(dt);
      // dominoes: count a fall the moment it has really tipped
      for (var k = 0; k < s.dominoes.length; k++) {
        var d = s.dominoes[k];
        if (d.asleep) continue;
        // a domino pushed off the end of its ramp fades away rather than blocking whatever is below
        if (!this.playMode && !d.userData.dissolve && (d.x - s.exit.x) * s.exit.dir > -0.1) {
          d.ghost = true; d.userData.dissolve = t + 0.7; this.debris.push(d);
        }
        if (d.userData.fell) continue;
        if (Math.abs(d.a - d.userData.a0) > 0.28) {
          d.userData.fell = t; this.toppled++;
          if (this.run) this.run.dominoes++;
          this._startSection(s);
          this.emit('domino', { d: d, sec: s, run: this.run });
        }
      }
      if (s.started || (this.run && i >= this.run.from && (this.frontier || 0) > i)) this._sweep(s, t);
    }

    for (i = this.marbles.length - 1; i >= 0; i--) {
      m = this.marbles[i];
      var u = m.userData;
      if (!u.live && !m.asleep && !u.spent && !u.held) {            // something just kicked this marble awake
        u.live = true;
        if (u.role === 'relay' || u.role === 'kicker' || u.role === 'passenger') {
          this.emit('kick', { m: m, role: u.role });
          if (u.role === 'relay' && this.sections[u.section]) this._retire(m);
        }
      }
      if (u.brake && !u.spent && !m.asleep) {                        // energy handed to the dominoes
        var damp = Math.pow(0.012, dt);
        m.vx *= damp; m.vy = m.vy > 0 ? m.vy : m.vy * damp; m.w *= damp;
      }
      if (u.spent && t - u.spent > 0.7) { this.world.remove(m); this.marbles.splice(i, 1); this.world.wakeNear(m.x, m.y, 1); continue; }
      if (u.expire && t > u.expire) { this._spend(m); }
      if (u.role === 'revived' && !u.spent) {      // a marble he woke up stays until it has lain still for a while, then goes back to rest on the shelf
        var sp2 = m.vx * m.vx + m.vy * m.vy;
        u.still = (m.asleep || sp2 < 0.04) ? (u.still || 0) + dt : 0;
        if (u.still > (u.held ? 99 : 2.2) || m.y > this.bottomY() + 1 || !isFinite(m.x) || !isFinite(m.y) || Math.abs(m.x) > 400) { this.emit('settle', { marble: m }); u.still = 0; }
      }
      if (u.small && u.live && !u.spent && u.role !== 'revived') {
        var sc = this.sections[u.section], ex = sc && sc.exit;
        if (ex && (m.x - ex.x) * ex.dir > -1.6 && m.y > ex.y - 2) this._spend(m);     // the flood drains away just before the exit
      }
      // a relay that has rolled off its ramp is done with its own section
      if (u.role === 'relay' && u.live && this.sections[u.section]) {
        var ss = this.sections[u.section], ee = ss.exit;
        if (!ss.done && (m.x - ee.x) * ee.dir > 0.1) { ss.done = true; this.emit('sectionDone', { sec: ss }); }
      }
      if (this.bottomY() - m.y < 0.8 && u.live && !u.spent && !u.small && (!this.playMode || this.run)) {
        // reached the floor: the end of the line if the bell is here, otherwise the marble is out of play
        if (this.run && this.run.engaged && this.frontier >= this.sections.length - 1) this._ring(m);
        else this._spend(m);
      }
    }

    for (i = this.debris.length - 1; i >= 0; i--) {
      var b = this.debris[i];
      if (b.userData.dissolve && t > b.userData.dissolve) { this.world.remove(b); this.debris.splice(i, 1); b.userData.gone = true; }
    }

    if (this.run && !this.run.over) this._watchRun(dt);
  };

  /** Dominoes the wave has left behind (a marble landed just past them) topple too: no stragglers in a finished row. */
  Track.prototype._sweep = function (s, t) {
    if (s.swept && t - s.swept < 0.07) return;
    var front = -1, k, doms = s.dominoes, frontT = 0;
    for (k = 0; k < doms.length; k++) if (doms[k].userData.fell) { front = k; frontT = doms[k].userData.fell; }
    var limit = front, passed = s.done || (this.run && (this.frontier || 0) > s.i);
    if (front < 0) { if (!passed) return; limit = 1; frontT = t - 1; }    // the chain went past the whole row: start it off
    else if (passed && t - frontT > 0.9) limit = doms.length;             // or the wave died out behind the action: restart it
    if (t - frontT < 0.35) return;
    for (k = 0; k < limit; k++) {
      var d = doms[k], u = d.userData;
      if (u.fell || u.dissolve) continue;
      // a domino that took a push and is still standing gets another, a little harder, a second later; after three, it fades out
      if (u.pushed && u.tries >= 3) {
        if (t - u.pushedAt >= 1.0) { d.ghost = true; u.dissolve = t + 0.7; this.debris.push(d); s.swept = t; return; }
        continue;
      }
      if (u.pushed && t - u.pushedAt < 1.0) continue;
      u.tries = (u.tries || 0) + 1; u.pushed = true; u.pushedAt = t; s.swept = t;
      if (d.asleep) { d.wake(); this.world._dropArbiters(d); }
      d.w += u.dir * (2.4 + 1.6 * (u.tries - 1)); d.vx += u.dir * (0.5 + 0.4 * (u.tries - 1));
      return;
    }
  };

  /** Retire the marbles that came before this one: they fade out once the next marble takes over. */
  Track.prototype._retire = function (keep) {
    for (var i = 0; i < this.marbles.length; i++) {
      var m = this.marbles[i], u = m.userData;
      if (m === keep || !u.live || u.spent || u.small || u.held) continue;
      if (u.section <= keep.userData.section || u.role === 'starter') this._spend(m);
    }
  };

  /** Keeps a run alive: a flick that missed gets another try, and a stalled chain gets a helping nudge. */
  Track.prototype._watchRun = function (dt) {
    var run = this.run, moving = false, i, b;
    for (i = 0; i < this.world.bodies.length; i++) {
      b = this.world.bodies[i];
      if (b.invMass === 0 || (b.userData && (b.userData.dissolve || b.userData.kind === 'wrecker' || b.userData.kind === 'plank'))) continue;
      if (b.vx * b.vx + b.vy * b.vy > 0.2 || b.w * b.w > 1.0) { moving = true; break; }
    }
    if (!moving) {
      for (i = 0; i < this.sections.length; i++) {
        var toy = this.sections[i].toy;
        if (toy && ((toy.m && toy.fired < 0) || toy.fuse > 0 || (toy.t >= 0 && !toy.kicked && toy.triggered))) { moving = true; break; }
      }
    }
    run.idle = moving ? 0 : run.idle + dt;

    if (!run.engaged) {
      var m = run.marble, lost = !this.world.bodies.includes(m) || m.userData.spent;
      var target = this.sections[run.from];
      if (!lost && target) {
        var low = target.ramps[target.ramps.length - 1].lowY + 3;
        if (m.y > low) lost = true;
      }
      if (!lost && this.rests && this.rests.length) {      // resting in one of the baskets: it stays there, and he may fling it again
        var on = null;
        for (var ri = 0; ri < this.rests.length; ri++) {
          var Rr = this.rests[ri];
          if (Math.abs(m.x - Rr.x) < Rr.hw + 0.05 && m.y < Rr.y + 0.3 && m.y > Rr.y - 0.8) { m.vx *= 0.88; m.vy *= 0.9; m.w *= 0.88; }      // (the basket is padded: a marble that drops in settles)
          if (Math.abs(m.x - Rr.x) < Rr.hw && Math.abs(m.y - Rr.y) < 0.3 && m.vx * m.vx + m.vy * m.vy < 0.5) on = Rr;
        }
        run.onLedge = on ? (run.onLedge || 0) + dt : 0; run.restAt = on || run.restAt;
        if (run.onLedge > 0.35) { this._rested(run, run.restAt); return; }
      }
      if (lost || run.idle > 1.2 || this.time - run.t0 > 12) { this._respawn(run); return; }
      return;
    }
    if (run.idle > 1.1) { run.idle = 0; this._nudge(run); }
  };

  /** The marble came to rest on the high ledge: it stays, asleep, and his next fling from there is free. */
  Track.prototype._rested = function (run, R) {
    var m = run.marble;
    m.userData.home = { x: R.x, y: R.y };
    m.userData.live = false; m.userData.flicked = 0; m.userData.brake = false;
    m.x = R.x; m.y = R.y; m.vx = m.vy = m.w = 0; m.sleep(); this.world._dropArbiters(m);
    this.run = null;
    this.emit('rested', { x: m.x, y: m.y, marble: m });
  };

  /** A flick that missed the machine: put the marble back. Nothing is lost, flick again. */
  Track.prototype._respawn = function (run, quiet) {
    var m = run.marble, h = m.userData.home;
    if (!this.world.bodies.includes(m)) { this.world.add(m); if (!this.marbles.includes(m)) this.marbles.push(m); }
    m.userData.spent = 0; m.userData.live = false; m.userData.flicked = 0; m.userData.brake = false; m.ghost = false;
    m.x = h.x; m.y = h.y; m.vx = m.vy = m.w = 0; m.a = 0; m.sleep(); this.world._dropArbiters(m);
    this.run = null;
    if (!quiet) this.emit('lost', { x: m.x, y: m.y, marble: m });
  };

  /** Find the next thing that should have moved and give it a push, so a chain always reaches the bell. */
  Track.prototype._nudge = function (run) {
    run.nudges++;
    var self = this;
    function push(b, vx, vy, w) {
      b.manualWake = false;
      if (b.asleep) { b.wake(); self.world._dropArbiters(b); }
      b.vx += vx; b.vy += vy; b.w += w || 0;
      self.emit('nudge', { x: b.x, y: b.y });
    }
    for (var i = run.from; i < this.sections.length; i++) {
      var s = this.sections[i];
      if (s.done) continue;
      var e = s.exit, F = e.dir;
      if (s.toy && !s.toy.triggered) { s.toy.force(); this.emit('nudge', { x: e.ramp.x, y: e.ramp.y }); return; }
      if (s.toy && s.passenger && !s.passenger.userData.live) { s.toy.force && s.toy.force(); this.emit('nudge', { x: s.passenger.x, y: s.passenger.y }); return; }
      var front = -1, k;
      for (k = 0; k < s.dominoes.length; k++) if (s.dominoes[k].userData.fell) front = k;
      for (k = front + 1; k < s.dominoes.length; k++) {
        var d = s.dominoes[k];
        if (!d.userData.fell && !d.userData.pushed) {
          d.userData.pushed = true;
          push(d, F * 0.7, 0, F * 2.6);
          return;
        }
      }
      for (k = 0; k < s.kickers.length; k++) {
        var kk = s.kickers[k];
        if (kk.asleep) { push(kk, F * 2.5, 0); return; }
      }
      var relay = s.relay;
      if (relay.userData.spent) continue;
      push(relay, F * 3.5, -1, F * 2);
      return;
    }
    // nothing left to push: the last marble is stuck short of the bell, or it was lost altogether
    if (this.bell && this.bell.rung < 0) {
      var lm = this._liveMarble();
      if (lm && run.nudges < 12) { push(lm, (this.bell.x - lm.x) > 0 ? 3 : -3, -3); return; }
      this._ring(lm);
    }
  };

  /** Tap near a rolling marble to give it a shove. */
  Track.prototype.poke = function (x, y) {
    var best = null, bd = 9;
    for (var i = 0; i < this.marbles.length; i++) {
      var m = this.marbles[i];
      if (!m.userData.live || m.userData.spent || m.userData.held || m.userData.small) continue;
      var d = (m.x - x) * (m.x - x) + (m.y - y) * (m.y - y);
      if (d < bd) { bd = d; best = m; }
    }
    if (!best) return null;
    var dx = best.x - x, dy = best.y - y, L = Math.sqrt(dx * dx + dy * dy);
    if (L < 0.5) { dx = best.vx >= 0 ? 1 : -1; dy = -0.4; L = Math.sqrt(dx * dx + dy * dy); }
    best.vx += dx / L * 5; best.vy += dy / L * 5 - 1;
    return best;
  };

  /** Stars hung along a good flick's arc: collect them for a bigger score multiplier. */
  Track.prototype.placeStars = function (from) {
    this.stars = [];
    if (this.rests && this.rests.length) {
      var gone = [];
      this.rests.forEach(function (R) { gone = gone.concat(R.bodies); });
      gone.forEach(function (g) { this.world.remove(g); }, this);
      this.statics = this.statics.filter(function (s) { return gone.indexOf(s) < 0; });
    }
    this.rests = [];
    this._statCache = null;
    this.cup = null; this._dropBasket();
    var e = this.exitFor(from), target = this.sections[from];
    if (!target) return;
    var m0 = e.marble, hm = m0.userData;
    if (hm.home0 && hm.home && (hm.home.x !== hm.home0.x || hm.home.y !== hm.home0.y)) {      // it was resting on the old ledge: bring it home
      hm.home = hm.home0; m0.x = hm.home0.x; m0.y = hm.home0.y; m0.vx = m0.vy = m0.w = 0; m0.sleep(); this.world._dropArbiters(m0);
    }
    var ramp = target.ramps[0], m = e.marble, lp = ramp.at(Math.min(ramp.L - 1, (ramp.gap || 2) * 0.6 + 1), BALL_R);
    var T = 1.05, vx = (lp.x - m.x) / T, vy = (lp.y - m.y) / T - 0.5 * GRAVITY * T;
    [0.28, 0.5, 0.74].forEach(function (f, i) {
      var tt = T * f;
      this.stars.push({ x: m.x + vx * tt, y: m.y + vy * tt + 0.5 * GRAVITY * tt * tt, got: 0, i: i });
    }, this);
    // a small cup at the end of the good arc: land in the middle of it and the marble bursts into three
    var tc = T * 0.55;
    this.cup = { x: m.x + vx * tc, y: m.y + vy * tc + 0.5 * GRAVITY * tc * tc, r: 0.7, got: 0 };
    this._placeRests(m, e.dir || 1, from);
    this._placeBasket(m, e.dir || 1);
  };
  /** True if a point is clear of every fixed piece of the machine by at least `pad`. */
  Track.prototype._clearAt = function (x, y, pad) {
    var list = this._statCache || (this._statCache = this.world.bodies.filter(function (q) { return !q.sensor && (q.isStatic || (q.asleep && q.userData && (q.userData.kind === 'domino' || q.userData.kind === 'marble' || q.userData.kind === 'plank'))); }));
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      var rr = (s.shape.r || Math.hypot(s.shape.hw, s.shape.hh)) + pad;
      if (Math.abs(x - s.x) > rr || Math.abs(y - s.y) > rr) continue;      // (far away: not worth the exact test)
      if (this._skip && this._skip.indexOf(s) >= 0) continue;
      if (s.shape.r) { if (Math.hypot(x - s.x, y - s.y) < s.shape.r + pad) return false; continue; }
      var hw = s.shape.hw, hh = s.shape.hh, c = Math.cos(s.a), sn = Math.sin(s.a);
      var dx = x - s.x, dy = y - s.y, lx = dx * c + dy * sn, ly = -dx * sn + dy * c;
      var ex = Math.max(0, Math.abs(lx) - hw), ey = Math.max(0, Math.abs(ly) - hh);
      if (Math.hypot(ex, ey) < pad) return false;
    }
    return true;
  };
  Track.prototype._dropBasket = function () {
    if (this.basketBodies) { this.basketBodies.forEach(function (g) { this.world.remove(g); }, this); this.statics = this.statics.filter(function (s) { return this.basketBodies.indexOf(s) < 0; }, this); }
    this.basketBodies = []; this.basket = null; this._statCache = null;
  };
  /**
   * The secret basket: a small cup off to one side of the marble, out of the way of the machine. Sling the marble into it and
   * the game opens a secret level. It only exists when the game has set `secretKind`; it picks the first spot that is clear.
   */
  Track.prototype._placeBasket = function (m, F) {
    if (!this.secretKind) return;
    var r = rng((this.recipe.seed >>> 0) + 977), spots = [], dx, dy, side;
    for (side = -1; side <= 1; side += 2) for (dx = 3.5; dx <= 9; dx += 0.5) for (dy = -2; dy <= 8; dy += 0.5) spots.push([side * dx, dy, r()]);
    spots.sort(function (a, b2) { return a[2] - b2[2]; });
    var tries = 0;
    for (var i = 0; i < spots.length && tries < 60; i++) {
      var x = m.x + spots[i][0], y = m.y + spots[i][1];
      if (Math.hypot(spots[i][0], spots[i][1]) < 4) continue;
      if (this.rests && this.rests.some(function (R) { return Math.hypot(R.x - x, R.y - y) < 2.8; })) continue;
      if (!this._clearAt(x, y, 1.5) || !this._clearAt(x, y + 1.0, 1.2)) continue;
      tries++;
      var bshot = this._lobTo(m.x, m.y, x, y + 0.45 - BALL_R, Track.FLICK_MAX - 0.1, 0.4, true, 0.38, 1.1, { x: x, y: y - 0.67 - BALL_R, half: 0.33 });
      if (!bshot) continue;      // (only where a good sling can actually land)
      var add = function (o) { var g = this._static(null, o, 'basket'); this.basketBodies.push(g); return g; }.bind(this);
      add({ x: x, y: y + 0.55, hw: 0.95, hh: 0.1, isStatic: true, friction: 1.0, restitution: 0.0 });
      add({ x: x - 1.0, y: y - 0.05, hw: 0.08, hh: 0.62, isStatic: true, friction: 0.3, restitution: 0.1 });
      add({ x: x + 1.0, y: y - 0.05, hw: 0.08, hh: 0.62, isStatic: true, friction: 0.3, restitution: 0.1 });
      this._statCache = null;
      if (!this._restsStillReachable()) { this._dropBasket(); continue; }      // (it must not spoil a resting basket's lob)
      this.basket = { x: x, y: y + 0.1, kind: this.secretKind, got: 0, shot: bshot };
      return;
    }
    // nowhere else to put it: the secret takes over one of the resting baskets' places
    if (!this.basket && this.rests && this.rests.length) {
      var R = this.rests[this.rests.length - 1], bx = R.x, by = R.y - 0.3;
      this._removeRest(R);
      var add2 = function (o) { var g = this._static(null, o, 'basket'); this.basketBodies.push(g); return g; }.bind(this);
      add2({ x: bx, y: by + 0.55 + 0.3, hw: 0.95, hh: 0.1, isStatic: true, friction: 1.0, restitution: 0.0 });
      add2({ x: bx - 1.0, y: by + 0.25 + 0.3, hw: 0.08, hh: 0.62, isStatic: true, friction: 0.3, restitution: 0.1 });
      add2({ x: bx + 1.0, y: by + 0.25 + 0.3, hw: 0.08, hh: 0.62, isStatic: true, friction: 0.3, restitution: 0.1 });
      this.basket = { x: bx, y: by + 0.4, kind: this.secretKind, got: 0 }; this._statCache = null;
    }
  };
  Track.prototype.collectBasket = function () {
    var k = this.basket, run = this.run;
    if (!k || k.got || !run) return;
    var m = run.marble;
    if (!m || m.userData.spent) return;
    if (Math.abs(m.x - k.x) < 0.75 && Math.abs(m.y - k.y) < 0.55 && m.vx * m.vx + m.vy * m.vy < 150) {
      k.got = this.time;
      this.emit('secret', { x: k.x, y: k.y, kind: k.kind });
      this._respawn(run, true);
    }
  };
  
  /** A lob from (x, y) that clears the machine and lands near the top of the fork's high road, or null. */
  Track.prototype._forkShot = function (x, y, hi) {
    var tp = hi.at(1.0, BALL_R + 0.05);
    return this._lobTo(x, y, tp.x, tp.y, 13, 0.45);
  };
  /** The gentlest lob from (x, y) that comes down on (tx, ty) from above, clear of the machine, or null. */
  Track.prototype._lobTo = function (x, y, tx0, ty, maxSpeed, tol, coarse, pad, minSlope, gate) {
    var dy = ty - y, best = null, step = coarse ? 0.3 : 0.125, samples = coarse ? 20 : 40;
    (coarse ? [0, 0.8, -0.8] : [0, 0.5, -0.5, 1, -1]).forEach(function (off) {      // (the landing spot may be anywhere within `tol` of the target)
      var tx = tx0 + off * tol;
      for (var vy = -maxSpeed; vy <= 1; vy += step) {
        var disc = vy * vy + 2 * GRAVITY * dy;
        if (disc < 0) continue;
        var t = (-vy + Math.sqrt(disc)) / GRAVITY, vx = (tx - x) / t;       // (the flight time fixes the sideways speed that lands on target)
        var sp = Math.hypot(vx, vy);
        if (sp > maxSpeed || Math.abs(vx) < 1.0 || (best && sp >= best.sp)) continue;
        if (minSlope && vy + GRAVITY * t < minSlope * Math.abs(vx)) continue;      // (it must come down into a basket, not skim across its edge)
        if (gate) {      // at the height of the basket's rim the marble must be over the opening, so it drops in and does not catch an edge
          var gd = vy * vy + 2 * GRAVITY * (gate.y - y);
          if (gd < 0) continue;
          var tg = (-vy + Math.sqrt(gd)) / GRAVITY;
          if (Math.abs(x + vx * tg - gate.x) > gate.half) continue;
        }
        var ok = true, ns = Math.min(200, Math.max(samples, Math.ceil(sp * t / 0.3)));      // (a sample every ~third of a unit: ramps are thin)
        for (var s = 1; ok && s < ns; s++) { var tt = t * s / ns * 0.97; if (tt < 0.18) continue; if (!this._clearAt(x + vx * tt, y + vy * tt + 0.5 * GRAVITY * tt * tt, pad || BALL_R + 0.16)) ok = false; }
        if (ok) best = { vx: vx, vy: vy, sp: sp };
      }
    }, this);
    return best;
  };
  /**
   * Resting baskets: a few small baskets well away from the start and off to the sides, each needing a strong, well-aimed lob. A
   * marble that comes to rest in one stays there and can be flung again for free. Which spots, and how many (up to three), depends on the
   * level's seed. Only spots that a flick at nearly full strength can reach are used.
   */
  Track.prototype._placeRests = function (m, F, from) {
    this.restFrom = m;
    var r = rng((this.recipe.seed >>> 0) + from * 31 + 7), cands = [], dx, dy, side;
    for (side = -1; side <= 1; side += 2) for (dx = 4.5; dx <= 10; dx += 0.5) for (dy = -2; dy <= 6; dy += 0.5) cands.push([side * dx, dy, r()]);
    cands.sort(function (a, b) { return a[2] - b[2]; });
    var want = 2 + (r() < 0.5 ? 1 : 0), tried = 0;
    for (var i = 0; i < cands.length && this.rests.length < want && tried < 30; i++) {
      var cx = m.x + cands[i][0], cy = m.y + cands[i][1], h = -cands[i][1];
      var need = Math.sqrt(GRAVITY * (h + Math.sqrt(cands[i][0] * cands[i][0] + h * h)));     // the least launch speed that can get there at all
      if (need > 9.4 || Math.hypot(cands[i][0], cands[i][1]) < 4.5) continue;                                                  // hard, but within a full flick
      if (this.rests.some(function (R) { return Math.hypot(R.x - cx, R.y - cy) < 2.6; })) continue;
      if (!this._clearAt(cx, cy + 0.2, 1.3)) continue;
      tried++;
      var top = cy + 0.3, shot = this._lobTo(m.x, m.y, cx, top - 0.1 - BALL_R - 0.05, Track.FLICK_MAX - 0.05, 0.42, true, 0.38, 1.1, { x: cx, y: top - 0.8 - BALL_R, half: 0.3 });
      if (!shot) continue;
      var bodies = [], add = function (o) { var g = this._static(null, o, 'ledge'); bodies.push(g); return g; }.bind(this);
      add({ x: cx, y: top, hw: 0.8, hh: 0.1, isStatic: true, friction: 1.2, restitution: 0.0 });
      add({ x: cx - 0.86, y: top - 0.4, hw: 0.07, hh: 0.4, isStatic: true, friction: 0.5, restitution: 0.0 });
      add({ x: cx + 0.86, y: top - 0.4, hw: 0.07, hh: 0.4, isStatic: true, friction: 0.5, restitution: 0.0 });
      var R = { x: cx, y: top - 0.1 - BALL_R - 0.01, hw: 0.8, bodies: bodies, shot: shot };
      this.rests.push(R); this._statCache = null;
      // a basket must not spoil another basket's lob, or the fork's high road (its lob from the cup)
      if (!this._restsStillReachable() || (this.sections[from] && this.sections[from].fork && this.cup && !this._forkShot(this.cup.x, this.cup.y, this.sections[from].fork))) this._removeRest(R);
    }
  };
  Track.prototype._removeRest = function (R) {
    R.bodies.forEach(function (g) { this.world.remove(g); }, this);
    this.statics = this.statics.filter(function (s) { return R.bodies.indexOf(s) < 0; });
    this.rests = this.rests.filter(function (q) { return q !== R; });
    this._statCache = null;
  };
  /** True if every basket's planned lob is still clear (checked with that basket's own pieces set aside). */
  Track.prototype._restsStillReachable = function () {
    var m = this.restFrom, ok = true;
    this.rests.forEach(function (R) {
      if (!ok) return;
      this._skip = R.bodies; this._statCache = null;
      var s = this._lobTo(m.x, m.y, R.x, R.y - 0.05, Track.FLICK_MAX - 0.05, 0.42, true, 0.38, 1.1, { x: R.x, y: R.y + 0.1 + BALL_R + 0.01 - 0.8 - BALL_R, half: 0.3 });
      if (!s) ok = false; else R.shot = s;
    }, this);
    this._skip = null; this._statCache = null;
    return ok;
  };
  Track.prototype.collectCup = function () {
    var c = this.cup, run = this.run;
    if (!c || c.got || !run) return;
    var m = run.marble;
    if (!m || m.userData.spent || this.time - run.t0 > 1.4 || run.touched) return;       // (only the first part of the flight counts: it is a shot, not a wander)
    var dx = m.x - c.x, dy = m.y - c.y;
    if (dx * dx + dy * dy > c.r * c.r || m.vx * m.vx + m.vy * m.vy < 9) return;       // (it has to be flying, not rolling along)
    c.got = this.time;
    var sec = this.sections[run.from] || null;
    var fork = sec && sec.fork ? this._forkShot(c.x, c.y, sec.fork) : null;      // at a fork, one of the extra marbles is sent down the other road
    [-1, 1].forEach(function (k) {
      var nb = this._marble(sec, c.x, c.y, { small: true, role: 'burst', hue: (this.baseHue + 120 * k + 360) % 360, asleep: false });
      nb.userData.live = true; nb.userData.expire = this.time + 14; nb.manualWake = false;
      if (fork && k === 1) { nb.vx = fork.vx; nb.vy = fork.vy; nb.w = fork.vx > 0 ? 6 : -6; }
      else { nb.vx = m.vx + k * 2.4; nb.vy = m.vy * 0.8 - 1.2; nb.w = k * 5; }
      var sp = Math.hypot(nb.vx, nb.vy) || 1; nb.x += nb.vx / sp * 0.85; nb.y += nb.vy / sp * 0.85;      // (apart from the marble that burst it, so they do not shove each other)
    }, this);
    this.emit('burst', { x: c.x, y: c.y, run: run });
  };
  Track.prototype.collectStars = function () {
    if (!this.stars.length || !this.run) return;
    var m = this.run.marble, t = this.time;
    if (!m || m.userData.spent) return;
    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      if (s.got) continue;
      var dx = m.x - s.x, dy = m.y - s.y;
      if (dx * dx + dy * dy < 1.25) { s.got = t; this.run.multiplier++; this.emit('star', { x: s.x, y: s.y, run: this.run, n: this.run.multiplier - 1 }); }
    }
  };

  Track.rng = rng;
  root.Track = Track;
})(typeof window !== 'undefined' ? window : globalThis);
