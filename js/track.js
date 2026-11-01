/*
 * Free-form marble/domino run. The track is a chain of "sections". Each correct answer lets the player
 * add one more, choosing:
 *   dir  : -1 (left) or +1 (right). Same as the previous piece = carry straight on; opposite = U-turn
 *          (the ball bounces off a backstop and comes back underneath).
 *   kind : 'dominoes' | 'pegs' | 'steep'  (or 'surprise' for a random one)
 * Pieces always step downward, so the contraption can grow arbitrarily large without overlapping itself.
 */
(function (root) {
  'use strict';
  var Phys = root.Phys;

  var TOP = 7;            // y of the first platform's high end
  var CLEAR = 2.9;        // gap between a platform's low end and the next platform's high end
  var THICK = 0.3;
  var DOM_HW = 0.09, DOM_HH = 0.46;
  var BALL_R = 0.36;
  var KINDS = ['dominoes', 'pegs', 'steep'];

  function rng(seed) { // mulberry32
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function Track(world, seed) {
    this.world = world;
    this.seed = seed || (Math.random() * 1e9) | 0;
    this.rand = rng(this.seed);
    this.sections = [];
    this.floor = null;
    this.balls = [];
    this.baseHue = Math.floor(this.rand() * 360);
    this._rebuildFloor();
  }
  Track.TOP = TOP; Track.BALL_R = BALL_R; Track.KINDS = KINDS;
  Track.DOM = { hw: DOM_HW, hh: DOM_HH };

  Track.prototype.last = function () { return this.sections[this.sections.length - 1]; };

  /** Where the next piece's high end would start if built in direction `dir` (used for the preview marker). */
  Track.prototype.preview = function (dir, gap) {
    var prev = this.last();
    if (!prev) return { x: 0, y: TOP, turn: true, dir: dir };
    var turn = dir !== prev.dir;
    var x = turn ? prev.lowX - dir * (gap == null ? 4.4 : gap) : prev.lowX - dir * 0.6;
    return { x: x, y: prev.lowY + CLEAR, turn: turn, dir: dir };
  };

  Track.prototype.bounds = function () {
    var b = { minX: 0, maxX: 0, minY: TOP - 8, maxY: this.bottomY() };
    this.sections.forEach(function (s) {
      b.minX = Math.min(b.minX, s.H.x, s.lowX); b.maxX = Math.max(b.maxX, s.H.x, s.lowX);
    });
    return b;
  };

  Track.prototype.bottomY = function () {
    var l = this.last();
    return (l ? l.lowY : TOP) + 5.5;
  };

  Track.prototype._rebuildFloor = function () {
    var w = this.world;
    if (this.floor) w.remove(this.floor);
    var b = this.bounds(), bottom = this.bottomY();
    var cx = (b.minX + b.maxX) / 2, hw = (b.maxX - b.minX) / 2 + 40;
    this.floor = w.add(new Phys.Body({ x: cx, y: bottom + 0.5, hw: hw, hh: 0.5, isStatic: true, friction: 0.7 }));
    this.floor.userData = { kind: 'floor' };
    this.floorWalls = (this.floorWalls || []);
    this.floorWalls.forEach(function (b) { w.remove(b); });
    this.floorWalls = [-1, 1].map(function (sd) {
      return w.add(new Phys.Body({ x: cx + sd * hw, y: bottom - 3, hw: 0.5, hh: 3.5, isStatic: true, friction: 0.2 }));
    });
  };

  Track.prototype.addSection = function (now, opts) {
    opts = opts || {};
    var r = this.rand, w = this.world;
    var i = this.sections.length, prev = this.last();
    var dir = opts.dir || (prev ? -prev.dir : 1);
    var kind = opts.kind;
    if (!kind || kind === 'surprise') kind = KINDS[Math.floor(r() * KINDS.length)];

    var turn = !prev || dir !== prev.dir;
    var gap = 3.8 + r() * 1.4;                         // overshoot distance for a U-turn
    var start = this.preview(dir, gap);
    var highX = start.x, y0 = start.y;

    var theta, Ls;
    if (kind === 'steep') { theta = (15 + r() * 4) * Math.PI / 180; Ls = 8 + r() * 3; }
    else if (kind === 'pegs') { theta = (8 + r() * 3) * Math.PI / 180; Ls = 9 + r() * 4; }
    else { theta = (8 + r() * 3.5) * Math.PI / 180; Ls = 13 + r() * 4; }
    var a = dir * theta, c = Math.cos(a), s = Math.sin(a);
    var dx = Ls * Math.cos(theta), lowX = highX + dir * dx, lowY = y0 + Ls * Math.sin(theta);
    var mx = (highX + lowX) / 2, my = (y0 + lowY) / 2;

    // centre = surface midpoint pushed down by half the thickness along the platform normal (-sin a, cos a)
    var body = w.add(new Phys.Body({
      x: mx - s * (THICK / 2), y: my + c * (THICK / 2),
      a: a, hw: Ls / 2, hh: THICK / 2, isStatic: true, friction: 0.6, restitution: 0.1
    }));
    body.userData = { kind: 'platform' };

    var sec = {
      i: i, dir: dir, kind: kind, turn: turn, a: a, L: Ls, body: body, born: now || 0,
      H: { x: highX, y: y0 }, lowX: lowX, lowY: lowY,
      hue: (this.baseHue + i * 37) % 360, dominoes: [], pegs: [], wall: null, gap: gap
    };

    // backstop at the outer end of the first piece and of every U-turn, so the ball bounces back
    if (turn) {
      sec.wall = w.add(new Phys.Body({ x: highX - dir * 0.2, y: y0 - 1.3, hw: 0.2, hh: 1.5, isStatic: true, friction: 0.2, restitution: 0.4 }));
      sec.wall.userData = { kind: 'wall' };
    }

    // dominoes (keep the ball's landing zone clear)
    if (kind === 'dominoes') {
      var clear = !prev ? 3.5 : (turn ? gap + 1.2 : 4.5);
      var clusters = 1 + (r() < 0.45 ? 1 : 0);
      var cursor = clear + r() * 1.3;
      for (var k = 0; k < clusters; k++) {
        var spacing = 0.68 + r() * 0.14;
        var maxN = Math.floor((Ls - 1.6 - cursor) / spacing);
        var n = Math.min(maxN, 3 + Math.floor(r() * 4));
        if (clusters === 2) n = Math.min(n, Math.floor(maxN / 2));
        for (var d = 0; d < n; d++) {
          var sd = cursor + d * spacing;
          var px = highX + Math.cos(theta) * dir * sd, py = y0 + Math.sin(theta) * sd;
          var dom = w.add(new Phys.Body({
            x: px + s * (DOM_HH + 0.002), y: py - c * (DOM_HH + 0.002), a: a,
            hw: DOM_HW, hh: DOM_HH, density: 0.4, friction: 0.12, restitution: 0.05, asleep: true
          }));
          dom.userData = { kind: 'domino', section: i, idx: d, hue: (sec.hue + d * 9) % 360, order: sec.dominoes.length };
          sec.dominoes.push(dom);
        }
        cursor += (n + 1) * spacing + 1.5;
        if (cursor > Ls - 2) break;
      }
    }

    // pegs hang beneath the low end (staggered so the ball can't sit in a cradle between two of them)
    var np = kind === 'pegs' ? 3 + Math.floor(r() * 3) : (kind === 'dominoes' && r() < 0.4 ? 1 : 0);
    for (var p = 0; p < np; p++) {
      var gx = lowX + dir * (1.4 + p * (1.6 + r() * 0.5));      // never right at the lip: the ball could cradle there
      var gy = lowY + (p % 2 ? 1.1 : 0.6) + r() * 0.15;
      var peg = w.add(new Phys.Body({ x: gx, y: gy, circle: 0.22, isStatic: true, restitution: 0.55, friction: 0.1 }));
      peg.userData = { kind: 'peg' };
      sec.pegs.push(peg);
    }

    this.sections.push(sec);
    this._rebuildFloor();
    return sec;
  };

  Track.prototype.spawnBall = function (now) {
    var sec = this.sections[0];
    if (!sec) return null;
    var ball = this.world.add(new Phys.Body({
      x: sec.H.x + sec.dir * 1.3, y: sec.H.y - 3.2, vx: sec.dir * 0.4, circle: BALL_R, density: 4,
      friction: 0.45, restitution: 0.35, neverSleep: true
    }));
    ball.userData = { kind: 'ball', born: now || 0, hue: (this.baseHue + this.balls.length * 70) % 360 };
    this.balls.push(ball);
    return ball;
  };

  Track.prototype.dispose = function () { this.world.clear(); };

  root.Track = Track;
})(typeof window !== 'undefined' ? window : globalThis);
