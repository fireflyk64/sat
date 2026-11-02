/*
 * Draws the machine with FX: glowing slabs, pip-faced dominoes, glassy marbles with comet tails, every toy,
 * thousands of particles, floating score text, a smooth camera, and the tween that makes the machine rearrange
 * itself when a new piece slots in.
 */
(function (root) {
  'use strict';
  var T = root.FX.T;

  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360 / 60; s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (h < 1) { r = c; g = x; } else if (h < 2) { r = x; g = c; } else if (h < 3) { g = c; b = x; }
    else if (h < 4) { g = x; b = c; } else if (h < 5) { r = x; b = c; } else { r = c; b = x; }
    return [r + m, g + m, b + m];
  }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function easeOutBack(t) { var c = 1.7, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* One palette per machine: deep sky, haze, and the sun + grid colour. Dominoes run through `hues`. */
  var THEMES = [
    { name: 'Neon Noir',  c1: [0.03, 0.02, 0.14], c2: [0.36, 0.05, 0.42], c3: [1.0, 0.22, 0.58], hue: 300, accent: [0.0, 0.9, 1.0] },
    { name: 'Riviera',    c1: [0.01, 0.06, 0.16], c2: [0.02, 0.32, 0.42], c3: [1.0, 0.55, 0.18], hue: 180, accent: [1.0, 0.6, 0.2] },
    { name: 'Emerald',    c1: [0.01, 0.07, 0.07], c2: [0.02, 0.32, 0.22], c3: [0.5, 1.0, 0.35], hue: 130, accent: [0.8, 1.0, 0.3] },
    { name: 'Orient Express', c1: [0.09, 0.02, 0.03], c2: [0.42, 0.08, 0.05], c3: [1.0, 0.62, 0.12], hue: 20, accent: [1.0, 0.8, 0.3] },
    { name: 'Nile',       c1: [0.02, 0.03, 0.16], c2: [0.08, 0.14, 0.46], c3: [0.45, 0.75, 1.0], hue: 215, accent: [0.5, 0.9, 1.0] },
    { name: 'Art Deco',   c1: [0.06, 0.02, 0.1], c2: [0.25, 0.08, 0.3], c3: [1.0, 0.8, 0.3], hue: 45, accent: [1.0, 0.85, 0.4] }
  ];

  /* What the marble looks like, by streak. */
  var SKINS = {
    plain:  { a: [0.05, 0.7, 1.0],  b: [0.85, 0.2, 1.0],  trail: [0.2, 0.75, 1.6], mat: 0, spark: 0 },
    fire:   { a: [1.0, 0.32, 0.03], b: [1.0, 0.75, 0.1],  trail: [2.0, 0.6, 0.1],  mat: 1, spark: 1 },
    plasma: { a: [0.55, 0.15, 1.0], b: [0.1, 0.9, 1.0],   trail: [0.9, 0.3, 2.2],  mat: 1, spark: 2 },
    prism:  { a: [1.0, 0.2, 0.6],   b: [0.2, 1.0, 0.8],   trail: null,             mat: 1, spark: 3 },
    nova:   { a: [1.0, 1.0, 1.0],   b: [0.4, 0.8, 1.0],   trail: [1.6, 1.8, 2.4],  mat: 1, spark: 4 },
    gold:   { a: [1.0, 0.72, 0.16], b: [1.0, 0.9, 0.5],   trail: [2.2, 1.5, 0.35], mat: 2, spark: 5 }
  };

  // ---------------------------------------------------------------- particles
  var PS = 14, PMAX = 7000;
  function Particles() { this.d = new Float32Array(PMAX * PS); this.n = 0; this.limit = PMAX; this.floorY = Infinity; }
  // kinds: 0 spark, 1 ember, 2 smoke, 3 confetti, 4 shard, 5 flare
  Particles.prototype.add = function (kind, x, y, vx, vy, life, size, r, g, b, drag, grav, spin) {
    if (this.n >= this.limit) return;
    var o = this.n++ * PS, d = this.d;
    d[o] = x; d[o + 1] = y; d[o + 2] = vx; d[o + 3] = vy; d[o + 4] = life; d[o + 5] = life; d[o + 6] = size;
    d[o + 7] = r; d[o + 8] = g; d[o + 9] = b; d[o + 10] = kind; d[o + 11] = drag || 0; d[o + 12] = grav == null ? 9 : grav; d[o + 13] = spin || 0;
  };
  Particles.prototype.update = function (dt) {
    var d = this.d, n = this.n, i = 0, fl = this.floorY;
    while (i < n) {
      var o = i * PS;
      d[o + 4] -= dt;
      if (d[o + 4] <= 0) { n--; if (i !== n) d.copyWithin(o, n * PS, n * PS + PS); continue; }
      var dr = Math.max(0, 1 - d[o + 11] * dt);
      d[o + 2] *= dr; d[o + 3] = d[o + 3] * dr + d[o + 12] * dt;
      d[o] += d[o + 2] * dt; d[o + 1] += d[o + 3] * dt;
      if (d[o + 1] > fl && d[o + 3] > 0) { d[o + 1] = fl; d[o + 3] *= -0.45; d[o + 2] *= 0.8; }
      i++;
    }
    this.n = n;
  };
  Particles.prototype.draw = function (fx, x0, x1, y0, y1) {
    var d = this.d, n = this.n;
    for (var i = 0; i < n; i++) {
      var o = i * PS, x = d[o], y = d[o + 1];
      if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      var f = d[o + 4] / d[o + 5], kind = d[o + 10], s = d[o + 6], r = d[o + 7], g = d[o + 8], b = d[o + 9], vx = d[o + 2], vy = d[o + 3];
      if (kind === 0) {
        var sp = Math.sqrt(vx * vx + vy * vy), len = s * (1.2 + sp * 0.28);
        fx.sprite(T.GLOW, x, y, len, s * 1.1, Math.atan2(vy, vx), r, g, b, f, 0, 0, 0, 0, 1.2, 0);
      } else if (kind === 1) {
        fx.sprite(T.GLOW, x, y, s * (0.5 + f), s * (0.5 + f), 0, r, g, b, f, 0, 0, 0, 0, 1.6, 0);
      } else if (kind === 2) {
        var grow = s * (1 + (1 - f) * 2.4);
        fx.sprite(T.SMOKE, x, y, grow, grow, 0, r, g, b, f * 0.5, 0, 0, 0, 0, 0, 0);
      } else if (kind === 3) {
        var rot = d[o + 13] * d[o + 4], flip = Math.abs(Math.cos(d[o + 4] * 6 + i));
        fx.sprite(T.BOX, x, y, s, s * 0.55 * flip + 0.02, rot, r, g, b, clamp01(f * 3), r, g, b, 1, 0.01, 0.01);
      } else if (kind === 4) {
        fx.sprite(T.SHARD, x, y, s, s, d[o + 13] * d[o + 4], r, g, b, clamp01(f * 2), 0, 0, 0, 0, 0, 0);
      } else {
        fx.sprite(T.FLARE, x, y, s, s, d[o + 13] * d[o + 4], r, g, b, f, 0, 0, 0, 0, 0, 0);
      }
    }
  };

  // ---------------------------------------------------------------- renderer
  function Renderer(canvas, opts) {
    opts = opts || {};
    this.fx = new root.FX(canvas, { lofi: opts.lofi, quality: opts.quality });
    this.canvas = this.fx.canvas;
    this.parts = new Particles();
    this.cam = { x: 0, y: 8, zoom: 1, follow: true, shake: 0, pull: 0 };
    this.reduced = !!opts.reduced;
    this.trails = {};
    this.floats = [];
    this.rings = [];
    this.rockets = [];
    this.lamps = [];
    this.theme = THEMES[0];
    this.heat = 0; this.heatTarget = 0;
    this.time = 0;
    this.skin = 'plain';
    var self = this;
    root.addEventListener('resize', function () { self.fx.resize(); });
  }
  Renderer.THEMES = THEMES; Renderer.SKINS = SKINS;

  Renderer.prototype.setTheme = function (i) {
    var t = THEMES[((i % THEMES.length) + THEMES.length) % THEMES.length];
    this.theme = t;
    this.fx.colors = { c1: t.c1, c2: t.c2, c3: t.c3 };
  };
  Renderer.prototype.scale = function () { return Math.min(this.fx.w / 26, this.fx.h / 17) * this.cam.zoom; };

  // --- user camera (CSS-pixel inputs)
  Renderer.prototype.panPx = function (dx, dy) {
    var s = this.scale(), d = this.fx.dpr; this.cam.x -= dx * d / s; this.cam.y -= dy * d / s; this.cam.follow = false;
  };
  Renderer.prototype.zoomAt = function (factor, px, py) {
    var c = this.cam, s0 = this.scale(), f = this.fx, nz = Math.max(0.035, Math.min(3, c.zoom * factor));
    if (nz === c.zoom) return;
    var cx = px == null ? f.w / 2 : px * f.dpr, cy = py == null ? f.h / 2 : py * f.dpr;
    var wx = c.x + (cx - f.w / 2) / s0, wy = c.y + (cy - f.h / 2) / s0;
    c.zoom = nz; var s1 = this.scale();
    c.x = wx - (cx - f.w / 2) / s1; c.y = wy - (cy - f.h / 2) / s1;
    c.follow = false; c.zoomGoal = null;
  };
  /** Glide to a zoom: the buttons use this so the view eases between many levels instead of jumping. */
  Renderer.prototype.zoomSmooth = function (factor, px, py) {
    var c = this.cam, base = c.zt != null ? c.zt : c.zoom;
    c.zt = Math.max(0.035, Math.min(3, base * factor)); c.zpx = px; c.zpy = py; c.follow = false; c.zoomGoal = null;
  };
  Renderer.prototype.fitZoom = function (track) {
    var b = track.bounds(), f = this.fx;
    var bw = b.maxX - b.minX + 10, bh = b.maxY - b.minY + 6, base = Math.min(f.w / 26, f.h / 17);
    return { zoom: Math.max(0.035, Math.min(1.1, Math.min(f.w / bw, f.h / bh) / base)), x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  };
  Renderer.prototype.fit = function (track) {
    var z = this.fitZoom(track), c = this.cam;
    c.zoomGoal = z.zoom; c.goalX = z.x; c.goalY = z.y; c.follow = false;
  };
  /** screen position (CSS px relative to the canvas) -> world */
  Renderer.prototype.screenToWorld = function (px, py) {
    var f = this.fx, s = this.scale(), d = f.dpr;
    return { x: this.cam.x + (px * d - f.w / 2) / s, y: this.cam.y + (py * d - f.h / 2) / s };
  };
  Renderer.prototype.worldToScreen = function (x, y) {
    var f = this.fx, s = this.scale(), d = f.dpr;
    return { x: (f.w / 2 + (x - this.cam.x) * s) / d, y: (f.h / 2 + (y - this.cam.y) * s) / d };
  };

  Renderer.prototype.updateCamera = function (dt, focus) {
    var c = this.cam;
    if (c.zt != null) {
      if (c.follow || c.zoomGoal != null) c.zt = null;
      else {
        var r = Math.pow(c.zt / c.zoom, 1 - Math.pow(0.002, dt));
        if (Math.abs(r - 1) < 0.002) { r = c.zt / c.zoom; c.zt = null; }
        this.zoomAt(r, c.zpx, c.zpy);
      }
    }
    if (c.zoomGoal != null) {
      var kz = 1 - Math.pow(0.02, dt);
      c.zoom += (c.zoomGoal - c.zoom) * kz;
      if (c.goalX != null) { c.x += (c.goalX - c.x) * kz; c.y += (c.goalY - c.y) * kz; }
    }
    if (c.follow && focus) {
      var k = 1 - Math.pow(focus.fast ? 0.004 : 0.03, dt);
      c.x += (focus.x - c.x) * k; c.y += (focus.y - c.y) * k;
      if (focus.zoom != null) c.zoom += (focus.zoom - c.zoom) * (1 - Math.pow(0.05, dt));
    }
    c.shake *= Math.pow(0.002, dt);
    if (this.reduced) c.shake = 0;
  };

  // ---------------------------------------------------------------- pose tweening (the machine rearranging)
  function eachBody(track, fn) {
    track.statics.forEach(fn); track.marbles.forEach(fn); track.debris.forEach(fn);
    track.sections.forEach(function (s) { s.dominoes.forEach(fn); s.moving.forEach(fn); });
  }
  Renderer.prototype.snapshot = function (track) {
    var m = {};
    if (!track) return m;
    eachBody(track, function (b) {
      var u = b.userData; if (!u || !u.key) return;
      var p = u.tween && u.tween.cur ? u.tween.cur : b;
      m[u.pieceId + ':' + u.key] = { x: p.x, y: p.y, a: p.a };
    });
    return m;
  };
  /** Every body glides from where it was to its new home; anything brand new drops in from above. */
  Renderer.prototype.tweenFrom = function (track, snap, now, opts) {
    opts = opts || {};
    var fresh = !!opts.fresh;
    eachBody(track, function (b) {
      var u = b.userData; if (!u || !u.key || u.kind === 'sensor') return;
      var key = u.pieceId + ':' + u.key, old = snap[key];
      var sec = u.section < 0 ? 0 : u.section, order = u.order || 0;
      if (old && !fresh) {
        var moved = Math.abs(old.x - b.x) + Math.abs(old.y - b.y) + Math.abs(old.a - b.a);
        if (moved < 0.002) return;
        u.tween = { x: old.x, y: old.y, a: old.a, t0: now + sec * 0.03 + order * 0.018, dur: 0.75 };
      } else {
        u.tween = { x: b.x, y: b.y - 7, a: b.a, t0: now + 0.25 + sec * 0.05 + order * 0.022 + (u.kind === 'domino' ? 0.25 : 0), dur: 0.6, fade: true, back: true };
      }
    });
    this.tweenUntil = now + 1.5 + (track.sections.length * 0.05);
  };
  var POSE = { x: 0, y: 0, a: 0, alpha: 1 };
  Renderer.prototype.pose = function (b, now) {
    var tw = b.userData && b.userData.tween;
    POSE.alpha = 1;
    if (!tw) { POSE.x = b.x; POSE.y = b.y; POSE.a = b.a; return POSE; }
    var k = (now - tw.t0) / tw.dur;
    if (k >= 1) { b.userData.tween = null; POSE.x = b.x; POSE.y = b.y; POSE.a = b.a; return POSE; }
    if (k <= 0) { POSE.x = tw.x; POSE.y = tw.y; POSE.a = tw.a; POSE.alpha = tw.fade ? 0 : 1; }
    else {
      var e = tw.back ? easeOutBack(k) : easeInOut(k);
      POSE.x = tw.x + (b.x - tw.x) * e; POSE.y = tw.y + (b.y - tw.y) * e; POSE.a = tw.a + (b.a - tw.a) * e;
      POSE.alpha = tw.fade ? clamp01(k * 2.5) : 1;
    }
    tw.cur = { x: POSE.x, y: POSE.y, a: POSE.a };
    return POSE;
  };

  // ---------------------------------------------------------------- effects
  Renderer.prototype.sparks = function (x, y, n, hue, speed, opts) {
    opts = opts || {};
    var c = opts.rgb || hsl(hue, 100, 62), hot = opts.hot == null ? 2.2 : opts.hot;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, s = (0.25 + Math.random()) * (speed || 5);
      this.parts.add(0, x, y, Math.cos(a) * s, Math.sin(a) * s - (opts.up || 1.5), 0.35 + Math.random() * 0.5, 0.05 + Math.random() * 0.05,
        c[0] * hot, c[1] * hot, c[2] * hot, 0.8, opts.grav == null ? 10 : opts.grav);
    }
  };
  Renderer.prototype.ring = function (x, y, rad, r, g, b, life, th) {
    this.rings.push({ x: x, y: y, rad: rad, r: r, g: g, b: b, t: 0, life: life || 0.5, th: th || 0.12 });
  };
  Renderer.prototype.float = function (s, x, y, size, rgb, life) {
    this.floats.push({ s: s, x: x, y: y, size: size || 0.7, c: rgb || [2.2, 1.9, 0.8], t: 0, life: life || 1.1 });
    if (this.floats.length > 40) this.floats.shift();
  };
  Renderer.prototype.lamp = function (x, y, r, g, b, power, life, falloff) {
    this.lamps.push({ x: x, y: y, r: r, g: g, b: b, power: power, t: 0, life: life, falloff: falloff || 0.12 });
    if (this.lamps.length > 8) this.lamps.shift();
  };
  Renderer.prototype.kick = function (shake) { this.cam.shake = Math.max(this.cam.shake, shake); };

  Renderer.prototype.boom = function (x, y, power) {
    power = power || 1;
    var i, fx = this.fx, q = this.fx.quality === 0 ? 0.5 : 1;
    for (i = 0; i < 180 * power * q; i++) {
      var a = Math.random() * 6.283, s = Math.pow(Math.random(), 0.6) * 15 * power;
      var heat = Math.random();
      this.parts.add(0, x, y, Math.cos(a) * s, Math.sin(a) * s - 1, 0.35 + Math.random() * 0.75, 0.05 + Math.random() * 0.07,
        3.2, 1.3 + heat * 1.5, 0.25 + heat * 0.5, 1.5, 7);
    }
    for (i = 0; i < 16 * power * q; i++) {
      var a2 = Math.random() * 6.283, s2 = Math.random() * 5 * power;
      this.parts.add(1, x, y, Math.cos(a2) * s2, Math.sin(a2) * s2 - 1, 0.18 + Math.random() * 0.3, 0.35 + Math.random() * 0.55, 1.5, 0.62, 0.14, 2.5, -2);
    }
    for (i = 0; i < 30 * power * q; i++) {
      var a3 = Math.random() * 6.283, s3 = Math.random() * 4;
      this.parts.add(2, x + Math.cos(a3), y + Math.sin(a3), Math.cos(a3) * s3, Math.sin(a3) * s3 - 1.5, 1 + Math.random() * 1.3, 0.5 + Math.random() * 0.5, 0.09, 0.07, 0.1, 1.2, -1.5);
    }
    this.ring(x, y, 5.5 * power, 1.6, 0.8, 0.3, 0.42, 0.1);
    this.ring(x, y, 9 * power, 0.8, 0.42, 0.3, 0.7, 0.035);
    this.lamp(x, y, 1.2, 0.5, 0.12, 0.9 * power, 0.5, 0.05);
    if (!this.reduced) {
      fx.wave(x, y, 0.9 * power, 0.75, 0.9);
      fx.ca = Math.max(fx.ca, 2.4 * power);
      fx.flash = Math.max(fx.flash, 0.035 * power);
    }
    this.kick(1.8 * power);
  };

  Renderer.prototype.confetti = function (x, y, n, spread) {
    for (var i = 0; i < n; i++) {
      var c = hsl(Math.random() * 360, 95, 62);
      this.parts.add(3, x + (Math.random() - 0.5) * (spread || 16), y + (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 7, -Math.random() * 7 - 1, 2 + Math.random() * 2.2, 0.09 + Math.random() * 0.09,
        c[0] * 1.5, c[1] * 1.5, c[2] * 1.5, 1.1, 4.5, (Math.random() - 0.5) * 12);
    }
  };
  /** Launch a rocket that bursts at (x, y) after `delay` seconds. */
  Renderer.prototype.rocket = function (x, y, hue, delay, big) {
    this.rockets.push({ x: x, y: y + 11, tx: x, ty: y, t: -(delay || 0), life: 0.55, hue: hue, big: !!big });
  };
  Renderer.prototype._burst = function (x, y, hue, big) {
    var c = hsl(hue, 100, 62), c2 = hsl(hue + 40, 100, 70), n = (big ? 240 : 130) * (this.fx.quality === 0 ? 0.5 : 1), speed = big ? 13 : 9;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 6.283 + Math.random() * 0.05, s = speed * (0.75 + Math.random() * 0.3), cc = i % 2 ? c : c2;
      this.parts.add(0, x, y, Math.cos(a) * s, Math.sin(a) * s, 0.9 + Math.random() * 0.8, 0.055, cc[0] * 2.6, cc[1] * 2.6, cc[2] * 2.6, 1.3, 5);
    }
    for (i = 0; i < n * 0.3; i++) {
      var a2 = Math.random() * 6.283, s2 = Math.random() * speed * 0.55;
      this.parts.add(1, x, y, Math.cos(a2) * s2, Math.sin(a2) * s2, 0.8 + Math.random() * 1.2, 0.09, 2.6, 2.3, 1.6, 1.2, 4);
    }
    this.ring(x, y, big ? 6 : 3.5, c[0] * 2, c[1] * 2, c[2] * 2, 0.5, 0.08);
    this.lamp(x, y, c[0], c[1], c[2], big ? 1.6 : 1, 0.6, 0.07);
    if (big && !this.reduced) this.fx.wave(x, y, 0.5, 0.6, 0.7);
  };

  Renderer.prototype.update = function (dt) {
    this.time += dt;
    this.parts.update(dt);
    var i;
    for (i = this.floats.length - 1; i >= 0; i--) { var f = this.floats[i]; f.t += dt; if (f.t > f.life) this.floats.splice(i, 1); }
    for (i = this.rings.length - 1; i >= 0; i--) { var r = this.rings[i]; r.t += dt; if (r.t > r.life) this.rings.splice(i, 1); }
    for (i = this.lamps.length - 1; i >= 0; i--) { var l = this.lamps[i]; l.t += dt; if (l.t > l.life) this.lamps.splice(i, 1); }
    for (i = this.rockets.length - 1; i >= 0; i--) {
      var k = this.rockets[i]; k.t += dt;
      if (k.t < 0) continue;
      var e = k.t / k.life, px = k.tx, py = k.y + (k.ty - k.y) * Math.sqrt(Math.min(1, e));
      this.parts.add(1, px, py, (Math.random() - 0.5), 1.5, 0.3, 0.09, 2.6, 1.9, 1, 0, 2);
      if (e >= 1) { this._burst(k.tx, k.ty, k.hue, k.big); this.rockets.splice(i, 1); if (this.onBurst) this.onBurst(k.big); }
    }
    this.heat += (this.heatTarget - this.heat) * (1 - Math.pow(0.05, dt));
    this.fx.heat = this.heat;
    this.fx.update(dt);
  };

  // ---------------------------------------------------------------- drawing
  Renderer.prototype._slab = function (fx, p, hw, hh, hue, lum, rim, alpha, radius) {
    var a = hsl(hue, 70, lum), b = hsl(hue, 100, 60), R = rim * alpha;
    fx.sprite(T.BOX, p.x, p.y, hw, hh, p.a, a[0], a[1], a[2], alpha, b[0] * R, b[1] * R, b[2] * R, 1, radius == null ? 0.07 : radius, 0.06);
  };

  Renderer.prototype._drawStatic = function (fx, b, sec, now, st) {
    var u = b.userData, kind = u.kind;
    if (kind === 'sensor' || kind === 'bell' || u.eaten) return;
    var P = this.pose(b, now), hue = sec ? sec.hue : this.theme.hue, alpha = P.alpha;
    if (alpha <= 0) return;
    var lit = sec && sec.litT ? Math.exp(-(st - sec.litT) * 1.8) : 0, sw = b.shape.hw || 0, sh = b.shape.hh || 0;
    if (kind === 'platform') {
      this._slab(fx, P, sw, sh, hue, 16 + lit * 14, (sec && sec.started ? 3.2 : 2.3) + lit * 3.2, alpha);
    } else if (kind === 'wall' || kind === 'ledge' || kind === 'basket' || kind === 'hopper' || kind === 'stop' || kind === 'pivot' || kind === 'padbase' || kind === 'cannonbase') {
      this._slab(fx, P, sw, sh, hue + 25, 16, 2 + lit, alpha);
    } else if (kind === 'funnel') {
      this._slab(fx, P, sw, sh, 40, 24, 2.6 + lit, alpha);
    } else if (kind === 'peg') {
      var fl = Math.exp(-(st - (u.lit == null ? -9 : u.lit)) * 6), c = hsl(hue + 40, 100, 70), d = hsl(hue, 100, 55);
      fx.sprite(T.PEG, P.x, P.y, b.shape.r, b.shape.r, 0, c[0], c[1], c[2], alpha, d[0], d[1], d[2], 1, fl, 0);
      if (fl > 0.05) fx.sprite(T.GLOW, P.x, P.y, 1.3, 1.3, 0, c[0] * 2, c[1] * 2, c[2] * 2, fl, 0, 0, 0, 0, 2, 0);
    } else if (kind === 'pad') {
      var hit = sec && sec.toy && sec.toy.hit > 0 ? Math.exp(-(st - sec.toy.hit) * 7) : 0;
      this._slab(fx, { x: P.x, y: P.y + hit * 0.28, a: P.a }, sw, sh * (1 - hit * 0.5), 150, 40, 3 + hit * 6, alpha, 0.1);
    } else if (kind === 'nitro') {
      if (u.gone) return;
      var pulse = 0.5 + 0.5 * Math.sin(now * 5);
      fx.sprite(T.CRATE, P.x, P.y, sw, sh, P.a, 1, 1, 1, alpha, 0, 0, 0, 0, pulse, 0);
      fx.text('TNT', P.x, P.y, 0.52, 2.4, 2.2, 1.6, alpha);
      fx.sprite(T.GLOW, P.x, P.y, 2, 2, 0, 1.2, 0.3, 0.05, 0.5 * pulse * alpha, 0, 0, 0, 0, 2, 0);
    } else if (kind === 'gate') {
      if (u.gone) {
        var g = sec && sec.toy ? st - sec.toy.opened : 9;
        if (g > 0.5) return;
        var up = Math.pow(g / 0.5, 0.6) * 3.2;
        this._slab(fx, { x: P.x, y: P.y - up, a: P.a }, sw, sh, 50, 40, 3, 1 - g / 0.5);
      } else this._slab(fx, P, sw, sh, 50, 34, 2.6, alpha);
    }
  };

  Renderer.prototype._drawToy = function (fx, sec, now, st) {
    var toy = sec.toy; if (!toy) return;
    var hue = sec.hue, i, c, a;
    if (toy.type === 'cannon') {
      var rec = toy.fired > 0 ? Math.exp(-(st - toy.fired) * 7) : 0, charge = toy.m && toy.fired < 0 ? clamp01(toy.charge / 0.6) : 0;
      var ca = Math.cos(toy.angle), sa = Math.sin(toy.angle), L = 1.15 - rec * 0.45;
      var bx = toy.x + toy.dir * ca * L * 0.5 * Math.abs(1), by = toy.y + Math.abs(sa) * -1 * L * 0.5;
      c = hsl(hue + 200, 50, 26);
      fx.sprite(T.BOX, bx, by, 0.72, 0.36, toy.angle, c[0], c[1], c[2], 1, 1.4 + charge * 3, 1.0 + charge, 0.5, 1, 0.1, 0.08, 0, 0);
      if (charge > 0) {
        fx.sprite(T.GLOW, toy.x, toy.y, 1.5 + charge * 1.4, 1.5 + charge * 1.4, 0, 3 * charge, 1.5 * charge, 0.4 * charge, 1, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.RING, toy.x, toy.y, 1.8 * (1 - charge) + 0.4, 1.8 * (1 - charge) + 0.4, 0, 3, 1.8, 0.6, charge, 0, 0, 0, 0, 0.1, 0);
      }
      fx.sprite(T.DISC, toy.x, toy.y + 0.35, 0.34, 0.34, 0, 0.1, 0.1, 0.13, 1, 0, 0, 0, 0, 0, 0);
    } else if (toy.type === 'fuse') {
      // the rope, burnt away behind the flame; the flame is a flickering glow with embers
      var burnt = toy.triggered ? Math.min(toy.total, Math.max(0, st - toy.lit) * toy.speed) : 0, cum = 0, tip = null, rc = hsl(30, 55, 44);
      for (i = 0; i < toy.lens.length; i++) {
        var p0 = toy.pts[i], p1 = toy.pts[i + 1], seg = toy.lens[i], from = toy.released ? 1 : Math.min(1, Math.max(0, burnt - cum) / seg);
        if (from < 1) {
          var ax0 = p0.x + (p1.x - p0.x) * from, ay0 = p0.y + (p1.y - p0.y) * from;
          fx.sprite(T.BOX, (ax0 + p1.x) / 2, (ay0 + p1.y) / 2, seg * (1 - from) / 2, 0.035, Math.atan2(p1.y - p0.y, p1.x - p0.x), rc[0], rc[1], rc[2], 1, rc[0] * 1.5, rc[1] * 1.1, rc[2] * 0.6, 1, 0.02, 0.02, 0, 0);
        }
        if (toy.triggered && !toy.released && burnt >= cum && burnt <= cum + seg) { var k = (burnt - cum) / seg; tip = { x: p0.x + (p1.x - p0.x) * k, y: p0.y + (p1.y - p0.y) * k }; }
        cum += seg;
      }
      if (!toy.triggered) tip = { x: toy.pts[0].x, y: toy.pts[0].y, dim: true };
      if (tip) {
        var fl = (tip.dim ? 0.35 + 0.15 * Math.sin(now * 6) : 1) * (0.85 + 0.15 * Math.sin(now * 41));
        fx.sprite(T.GLOW, tip.x, tip.y, 0.95, 0.95, 0, 3, 1.5, 0.35, fl, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.GLOW, tip.x, tip.y, 0.36, 0.36, 0, 4, 3.2, 1.2, fl, 0, 0, 0, 0, 2, 0);
        if (!tip.dim && Math.random() < 0.55) this.sparks(tip.x, tip.y, 1, 28, 1.8);
      }
    } else if (toy.type === 'portal') {
      var f = toy.flash > 0 ? Math.exp(-(st - toy.flash) * 4) : 0, c1 = hsl(hue, 100, 60), c2 = hsl(hue + 130, 100, 65);
      [[toy.ax, toy.ay, 1], [toy.bx, toy.by, -1]].forEach(function (q) {
        var R = 1.1 + 0.05 * Math.sin(now * 3 + q[0]) + f * 0.6;
        fx.sprite(T.GLOW, q[0], q[1], R * 2.1, R * 2.1, 0, c1[0], c1[1], c1[2], 0.22 + f * 0.5, 0, 0, 0, 0, 2.4, 0);
        fx.sprite(T.PORTAL, q[0], q[1], R, R, 0, c1[0] * 0.6, c1[1] * 0.6, c1[2] * 0.6, 1, c2[0] * 0.6, c2[1] * 0.6, c2[2] * 0.6, 1, q[2], 0);
        fx.sprite(T.RING, q[0], q[1], R, R, 0, c2[0] * 1.6, c2[1] * 1.6, c2[2] * 1.6, 1, 0, 0, 0, 0, 0.05, 0);
      });
    } else if (toy.type === 'cradle') {
      var fx0 = toy.x0 - toy.dir * (toy.br + 0.5), fx1 = toy.x0 + toy.dir * ((toy.n - 1) * 2 * toy.br + toy.br + 0.5);
      var mx = (fx0 + fx1) / 2, hw = Math.abs(fx1 - fx0) / 2, fh = toy.len + 0.4;
      c = hsl(hue, 80, 45);
      fx.sprite(T.BOX, mx, toy.y, hw, 0.07, 0, c[0], c[1], c[2], 1, c[0] * 2, c[1] * 2, c[2] * 2, 1, 0.03, 0.03, 0, 0);
      fx.sprite(T.BOX, fx0, toy.y + fh / 2, 0.06, fh / 2, 0, c[0], c[1], c[2], 1, c[0] * 2, c[1] * 2, c[2] * 2, 1, 0.03, 0.03);
      fx.sprite(T.BOX, fx1, toy.y + fh / 2, 0.06, fh / 2, 0, c[0], c[1], c[2], 1, c[0] * 2, c[1] * 2, c[2] * 2, 1, 0.03, 0.03);
      for (i = 0; i < toy.n; i++) {
        a = 0;
        if (i === toy.n - 1 && toy.a > 0) a = toy.a * toy.dir;
        if (i === 0 && toy.a < 0) a = toy.a * toy.dir;
        var hx = toy.x0 + toy.dir * i * 2 * toy.br;
        var ballX = hx + Math.sin(a) * toy.len, ballY = toy.y + Math.cos(a) * toy.len;
        var mid = { x: (hx + ballX) / 2, y: (toy.y + ballY) / 2 };
        fx.sprite(T.BOX, mid.x, mid.y, 0.016, toy.len / 2, -a, 1.2, 1.2, 1.3, 0.8, 1, 1, 1, 0.5, 0.005, 0.01);
        var moving = (a !== 0) ? 1 : 0;
        fx.sprite(T.BALL, ballX, ballY, toy.br, toy.br, a * 2, 0.7, 0.72, 0.8, 1, 0.9, 0.93, 1, 1, 0, moving);
      }
    } else if (toy.type === 'wrecking') {
      if (toy.ball.userData.eaten) return;
      var ball = toy.ball, wP = this.pose(ball, now), ax = ball.userData.ax, ay = ball.userData.ay;
      var dx = wP.x - ax, dy = wP.y - ay, len = Math.sqrt(dx * dx + dy * dy), links = Math.max(3, Math.floor(len / 0.34));
      for (i = 0; i <= links; i++) {
        var k = i / links;
        fx.sprite(T.DISC, ax + dx * k, ay + dy * k, 0.075, 0.075, 0, 0.55, 0.55, 0.65, wP.alpha, 0, 0, 0, 0, 0, 0);
      }
      fx.sprite(T.DISC, ax, ay, 0.2, 0.2, 0, 1.4, 1.1, 0.5, wP.alpha, 0, 0, 0, 0, 0, 0);
      var sw = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (sw > 1 && !ball.asleep) { c = hsl(hue, 100, 60); fx.sprite(T.GLOW, wP.x, wP.y, 1.5, 1.5, 0, c[0] * 1.6, c[1] * 1.6, c[2] * 1.6, Math.min(1, sw * 0.12), 0, 0, 0, 0, 2, 0); }
      fx.sprite(T.BALL, wP.x, wP.y, ball.shape.r, ball.shape.r, ball.a, 0.2, 0.2, 0.26, wP.alpha, 0.55, 0.6, 0.72, 1, 0, 0);
    } else if (toy.type === 'seesaw') {
      if (toy.plank.userData.eaten) return;
      var pl = toy.plank, pp = this.pose(pl, now);
      this._slab(fx, pp, pl.shape.hw, pl.shape.hh, hue + 60, 38, 2.4, pp.alpha, 0.1);
    } else if (toy.type === 'trampoline') {
      var hit = toy.hit > 0 ? Math.exp(-(st - toy.hit) * 5) : 0;
      if (hit > 0.02) fx.sprite(T.GLOW, toy.x, toy.y, 3.2, 3.2, 0, 0.3, 2, 1, hit, 0, 0, 0, 0, 2, 0);
    }
    if (sec.boost) {
      var e = sec.boost, ph = (now * 1.1) % 1;
      c = hsl(hue + 40, 100, 62);
      for (i = 0; i < 3; i++) {
        var pt = e.at(e.L * (0.3 + i * 0.22), 0.45);
        fx.sprite(T.CHEVRON, pt.x, pt.y, 0.75, 0.34, e.a + (e.dir < 0 ? Math.PI : 0), c[0] * 1.6, c[1] * 1.6, c[2] * 1.6, 0.8, 0, 0, 0, 0, ph, 0);
      }
    }
  };

  Renderer.prototype._drawDomino = function (fx, d, now, st) {
    var u = d.userData, P = this.pose(d, now);
    var alpha = P.alpha;
    if (u.dissolve) alpha *= clamp01((u.dissolve - st) / 0.7);
    if (alpha <= 0) return;
    if (!u.rgbA) { u.rgbA = hsl(u.hue, 95, 54); u.rgbB = hsl(u.hue + 22, 90, 36); }
    var wash = this.wash ? Math.exp(-Math.abs(st - this.wash.t - (u.section * this.wash.gap + (u.order || 0) * 0.018)) * 7) : 0;
    var heat = u.fell ? Math.exp(-(st - u.fell) * 6) : 0;
    var moving = d.asleep ? 0 : Math.min(1, Math.abs(d.w) * 0.35);
    var dim = u.fell ? 0.72 : 1;
    var A = u.rgbA, B = u.rgbB, s = dim * alpha;
    fx.sprite(T.DOMINO, P.x, P.y, d.shape.hw, d.shape.hh, P.a, A[0] * s, A[1] * s, A[2] * s, alpha, B[0] * s, B[1] * s, B[2] * s, 1, heat * 0.9 + wash * 0.9, moving * 1.6 + wash);
    if (heat > 0.15 || wash > 0.1) {
      var g = Math.max(heat, wash);
      fx.sprite(T.GLOW, P.x, P.y, 1.05, 1.05, 0, A[0] * 1.6, A[1] * 1.6, A[2] * 1.6, g * 0.8, 0, 0, 0, 0, 2.2, 0);
    }
  };

  Renderer.prototype._skinColors = function (skin, t, hue) {
    var S = SKINS[skin] || SKINS.plain;
    if (skin === 'prism') { var a = hsl(t * 240, 100, 60), b = hsl(t * 240 + 140, 100, 65); return { a: a, b: b, trail: [a[0] * 2.2, a[1] * 2.2, a[2] * 2.2], mat: 1, spark: 3 }; }
    return S;
  };

  Renderer.prototype._drawMarble = function (fx, m, now, st, game) {
    var u = m.userData;
    if (u.held) return;
    var P = this.pose(m, now), x = P.x, y = P.y, a0 = P.alpha;
    if (a0 <= 0) return;
    var r = m.shape.r, fade = 1;
    if (u.spent) { fade = clamp01(1 - (st - u.spent) / 0.7); r *= 0.4 + 0.6 * fade; }
    var isFlick = game.flick === m;
    if (isFlick && game.aim) { x += game.aim.dx; y += game.aim.dy; }
    var lead = u.live && !u.spent;
    var S;
    if (u.sand) { var sc = hsl(u.hue, 92, 58), sd = hsl(u.hue + 12, 96, 76); S = { a: sc, b: sd, trail: null, mat: 0 }; }     // sand: warm gold, not the colour-cycling of other small marbles
    else if (u.small) { var hc = hsl(u.hue + st * 30, 100, 62), hd = hsl(u.hue + 80, 100, 70); S = { a: hc, b: hd, trail: [hc[0] * 2, hc[1] * 2, hc[2] * 2], mat: 0 }; }
    else if (lead || isFlick) S = this._skinColors(this.skin, this.time, u.hue);
    else { var c0 = hsl(u.hue, 88, 58), c1 = hsl(u.hue + 50, 90, 68); S = { a: c0, b: c1, trail: null, mat: 0 }; }

    if (lead && S.trail) {
      var tr = this.trails[m.id] || (this.trails[m.id] = []);
      tr.push(x, y); if (tr.length > 72) tr.splice(0, 2);
      var n = tr.length / 2;
      for (var i = 0; i < n; i++) {
        var f = i / n, R = r * (0.25 + f * 1.15);
        fx.sprite(T.GLOW, tr[i * 2], tr[i * 2 + 1], R * 1.9, R * 1.9, 0, S.trail[0], S.trail[1], S.trail[2], f * f * 0.6 * fade, 0, 0, 0, 0, 1.6, 0);
      }
    }
    if (lead && !u.small && S.spark) {
      var sp = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      if (Math.random() < 0.15 + sp * 0.07) {
        var tc = S.trail || [2, 2, 2];
        this.parts.add(S.spark === 1 ? 1 : 0, x + (Math.random() - 0.5) * r, y + (Math.random() - 0.5) * r, -m.vx * 0.15 + (Math.random() - 0.5) * 1.2, -m.vy * 0.15 - Math.random() * 1.2, 0.3 + Math.random() * 0.4, 0.06 + Math.random() * 0.1, tc[0], tc[1], tc[2], 1, S.spark === 1 ? -3 : 3);
      }
    }
    var glow = lead ? 1 : 0.45;
    fx.sprite(T.GLOW, x, y, r * 3, r * 3, 0, S.a[0], S.a[1], S.a[2], 0.55 * glow * fade * a0, 0, 0, 0, 0, 2, 0);
    fx.sprite(T.BALL, x, y, r, r, m.a + st * (lead ? 0 : 0.6), S.a[0], S.a[1], S.a[2], fade * a0, S.b[0], S.b[1], S.b[2], 1, m.a * 0.6 + st, S.mat);
  };

  Renderer.prototype._drawBell = function (fx, bell, now, st) {
    if (!bell) return;
    var since = bell.rung > 0 ? st - bell.rung : 99, ring = Math.exp(-since * 0.9);
    var swing = since < 40 ? Math.sin(since * 9) * 0.4 * Math.exp(-since * 0.75) : 0.03 * Math.sin(now * 1.5);
    var idle = 0.22 + 0.1 * Math.sin(now * 2.2);
    fx.sprite(T.GLOW, bell.x, bell.y, 5 + ring * 5, 5 + ring * 5, 0, 1.3, 0.85, 0.25, idle + ring * 1.4, 0, 0, 0, 0, 2.2, 0);
    fx.sprite(T.BELL, bell.x, bell.y, 1.15, 1.3, 0, 1, 1, 1, 1, 0, 0, 0, 0, ring * 0.9 + idle * 0.3, swing);
  };

  /** game: { track, flick, aim, locked, grand, lead, preview:[{x,y}] } */
  Renderer.prototype.draw = function (game, now) {
    var fx = this.fx, track = game.track, c = this.cam, st = track.time, s = this.scale();
    var shake = c.shake, sx = shake > 0.001 ? (Math.random() - 0.5) * shake * 0.45 : 0, sy = shake > 0.001 ? (Math.random() - 0.5) * shake * 0.45 : 0;
    fx.setCamera(c.x, c.y, s, sx, sy);
    fx.camX = c.x; fx.camY = c.y;
    fx.begin();
    var hw = fx.w / 2 / s + 5, hh = fx.h / 2 / s + 5;
    var x0 = c.x - hw, x1 = c.x + hw, y0 = c.y - hh, y1 = c.y + hh;
    function vis(b) { var R = b.radius + 8; return b.x + R > x0 && b.x - R < x1 && b.y + R > y0 && b.y - R < y1; }
    var i, j, sec, secs = track.sections;

    // statics, starter included
    for (i = 0; i < track.statics.length; i++) {
      var b = track.statics[i];
      if (!vis(b)) continue;
      this._drawStatic(fx, b, b.userData.section >= 0 ? secs[b.userData.section] : null, now, st);
    }
    // a slow pulse of energy along every ramp in the part of the machine that is running
    for (i = 0; i < secs.length; i++) {
      sec = secs[i];
      if (sec.started && !sec.done) {
        for (j = 0; j < sec.ramps.length; j++) {
          var rp = sec.ramps[j], d = ((now * 3.5 + j) % rp.L), p = rp.at(d, 0), pc = hsl(sec.hue, 100, 65);
          fx.sprite(T.GLOW, p.x, p.y, 1.2, 0.5, rp.a, pc[0] * 2.2, pc[1] * 2.2, pc[2] * 2.2, 0.9, 0, 0, 0, 0, 1.4, 0);
        }
      }
      this._drawToy(fx, sec, now, st);
    }
    this._drawBell(fx, track.bell, now, st);

    // blocks
    for (i = 0; i < track.debris.length; i++) {
      var bk = track.debris[i];
      if (bk.userData.kind !== 'block' || bk.userData.gone || !vis(bk)) continue;
      var bp = this.pose(bk, now), al = bp.alpha * (bk.userData.dissolve ? clamp01((bk.userData.dissolve - st) / 0.8) : 1);
      this._slab(fx, bp, bk.shape.hw, bk.shape.hh, bk.userData.hue, 34, 2, al, 0.05);
    }
    // dominoes
    for (i = 0; i < secs.length; i++) {
      for (j = 0; j < secs[i].dominoes.length; j++) {
        var dm = secs[i].dominoes[j];
        if (vis(dm) && !dm.userData.gone) this._drawDomino(fx, dm, now, st);
      }
    }

    // whatever the current break has brought along
    if (game.pg) game.pg.draw(fx, T, now);

    // stars to collect with a flick
    if (track.stars) {
      for (i = 0; i < track.stars.length; i++) {
        var star = track.stars[i];
        if (star.got) continue;
        // stars hold still along with the prompt, so nothing beside the marble moves during a study run
        var tw = game.pulse ? 0.85 + 0.2 * Math.sin(now * 5 + i * 2) : 1, bob = game.pulse ? Math.sin(now * 2.4 + i) * 0.1 : 0;
        fx.sprite(T.GLOW, star.x, star.y + bob, 1.3, 1.3, 0, 2, 1.5, 0.3, game.pulse ? 0.5 : 0.25, 0, 0, 0, 0, 2, 0);
        fx.sprite(T.FLARE, star.x, star.y + bob, 1.1 * tw, 1.1 * tw, game.pulse ? now * 0.7 + i : i, game.pulse ? 3 : 1.6, game.pulse ? 2.4 : 1.3, game.pulse ? 0.8 : 0.45, 1, 0, 0, 0, 0, 0, 0);
      }
    }

    // the secret basket: a shimmer, so he knows it is there and a little odd
    if (track.basket && !track.basket.got) {
      var sb = track.basket, sp = 0.6 + 0.4 * Math.sin(now * 2.2), sc = hsl((now * 40) % 360, 100, 65);
      fx.sprite(T.GLOW, sb.x, sb.y, 2.4, 2.4, 0, sc[0], sc[1], sc[2], 0.35 * sp, 0, 0, 0, 0, 2, 0);
      fx.sprite(T.FLARE, sb.x, sb.y - 0.2, 0.9, 0.9, now * 0.6, sc[0] * 1.5, sc[1] * 1.5, sc[2] * 1.5, 0.5 * sp, 0, 0, 0, 0, 0, 0);
    }

    // resting baskets: a soft green glow so they read as somewhere to stop
    if (track.rests) {
      for (i = 0; i < track.rests.length; i++) {
        var rb = track.rests[i], rp = 0.6 + 0.4 * Math.sin(now * 2 + i), rc = hsl(140, 90, 62);
        fx.sprite(T.GLOW, rb.x, rb.y - 0.2, 2.2, 2.2, 0, rc[0], rc[1], rc[2], 0.3 * rp, 0, 0, 0, 0, 2, 0);
      }
    }

    // the small cup at the end of the good arc: land in the middle for three marbles
    if (track.cup && !track.cup.got) {
      var cu = track.cup, pl = 0.8 + 0.2 * Math.sin(now * 3), ch = hsl(45, 100, 62);
      fx.sprite(T.GLOW, cu.x, cu.y, 1.5, 1.5, 0, ch[0], ch[1], ch[2], 0.25 * pl, 0, 0, 0, 0, 2, 0);
      fx.sprite(T.BOX, cu.x, cu.y + 0.5, 0.5, 0.05, 0, ch[0] * 1.6, ch[1] * 1.6, ch[2] * 1.6, 1, ch[0], ch[1], ch[2], 1, 0.02, 0.02);
      fx.sprite(T.BOX, cu.x - 0.55, cu.y + 0.2, 0.34, 0.05, 1.2, ch[0] * 1.6, ch[1] * 1.6, ch[2] * 1.6, 1, ch[0], ch[1], ch[2], 1, 0.02, 0.02);
      fx.sprite(T.BOX, cu.x + 0.55, cu.y + 0.2, 0.34, 0.05, -1.2, ch[0] * 1.6, ch[1] * 1.6, ch[2] * 1.6, 1, ch[0], ch[1], ch[2], 1, 0.02, 0.02);
    }

    // the aim: dotted arc + stretchy band
    if (game.aim) {
      var ar = game.aim, m0 = game.flick, bandC = ar.power > 0.8 ? [2.6, 1.0, 0.3] : [0.6, 1.8, 2.4];
      var mx = m0.x + ar.dx, my = m0.y + ar.dy, bl = Math.sqrt(ar.dx * ar.dx + ar.dy * ar.dy);
      if (bl > 0.05) fx.sprite(T.BOX, m0.x + ar.dx / 2, m0.y + ar.dy / 2, bl / 2, 0.035 + 0.04 * (1 - ar.power), Math.atan2(ar.dy, ar.dx), bandC[0], bandC[1], bandC[2], 1, bandC[0], bandC[1], bandC[2], 1, 0.02, 0.02);
      fx.sprite(T.DISC, m0.x, m0.y, 0.1, 0.1, 0, bandC[0], bandC[1], bandC[2], 1, 0, 0, 0, 0, 0, 0);
      var pv = game.preview || [];
      for (i = 0; i < pv.length; i++) {
        var pf = 1 - i / pv.length;
        fx.sprite(T.GLOW, pv[i].x, pv[i].y, 0.26, 0.26, 0, bandC[0], bandC[1], bandC[2], pf * 0.9, 0, 0, 0, 0, 1.2, 0);
        fx.sprite(T.DISC, pv[i].x, pv[i].y, 0.05 + 0.03 * pf, 0.05 + 0.03 * pf, 0, 2 * pf + 0.3, 2 * pf + 0.3, 2 * pf + 0.3, pf, 0, 0, 0, 0, 0, 0);
      }
    }

    // marbles that have been handed on stay where they were (the "Marbles stay" unlock): dim, still, with no glow
    if (game.kept && game.kept.length) {
      for (i = 0; i < game.kept.length; i++) {
        var kp = game.kept[i], ks = kp.awake ? null : track.sections.filter(function (s0) { return s0.id === kp.pid; })[0];
        if (!ks || !ks.exit) continue;
        var kx = ks.exit.x + kp.dx, ky = ks.exit.y + kp.dy, kc = hsl(kp.hue, 55, 46), kd = hsl(kp.hue + 40, 60, 60);
        fx.sprite(T.BALL, kx, ky, 0.3, 0.3, i * 1.7, kc[0], kc[1], kc[2], 0.62, kd[0], kd[1], kd[2], 1, i, 0);
      }
    }

    // marbles
    for (i = 0; i < track.marbles.length; i++) {
      var mb = track.marbles[i];
      if (vis(mb)) this._drawMarble(fx, mb, now, st, game);
    }

    // "flick me" prompt, or a lock if there's nothing earned to play
    if (game.flick && !game.aim) {
      var fm = game.flick, ph = (now * 1.1) % 1;
      if (game.locked) {
        fx.sprite(T.RING, fm.x, fm.y, 0.75, 0.75, 0, 0.5, 0.45, 0.65, 0.8, 0, 0, 0, 0, 0.06, 0);
      } else if (!game.pulse) {
        // during a study run: a still ring, so the marble can be found without pulling the eye away from the question
        var calm = game.grand ? [1.3, 1, 0.35] : [0.35, 1, 1.25];
        fx.sprite(T.RING, fm.x, fm.y, 0.75, 0.75, 0, calm[0], calm[1], calm[2], 0.8, 0, 0, 0, 0, 0.05, 0);
      } else {
        var goldRing = game.grand;
        var rc = goldRing ? [3, 2.2, 0.6] : [0.6, 2.2, 2.8];
        fx.sprite(T.RING, fm.x, fm.y, 0.55 + ph * 1.6, 0.55 + ph * 1.6, 0, rc[0], rc[1], rc[2], (1 - ph) * 0.9, 0, 0, 0, 0, 0.06, 0);
        fx.sprite(T.RING, fm.x, fm.y, 0.55 + ((ph + 0.5) % 1) * 1.6, 0.55 + ((ph + 0.5) % 1) * 1.6, 0, rc[0], rc[1], rc[2], (1 - ((ph + 0.5) % 1)) * 0.9, 0, 0, 0, 0, 0.06, 0);
        var promptSize = Math.max(0.56, 15 / s);
        fx.text(game.grand ? 'PULL BACK. RUN IT ALL!' : 'PULL BACK AND LET GO', fm.x, fm.y - 1.1 - promptSize, promptSize, rc[0] * 0.9, rc[1] * 0.9, rc[2] * 0.9, 0.75 + 0.25 * Math.sin(now * 4));
      }
    }

    // spark rings + particles + floating text
    for (i = 0; i < this.rings.length; i++) {
      var rg = this.rings[i], rf = rg.t / rg.life, rr = rg.rad * (1 - Math.pow(1 - rf, 3)) + 0.1;
      fx.sprite(T.RING, rg.x, rg.y, rr, rr, 0, rg.r, rg.g, rg.b, 1 - rf, 0, 0, 0, 0, rg.th, 0);
    }
    this.parts.draw(fx, x0, x1, y0, y1);
    var minText = 11 / s;     // keep score text readable however far the camera has pulled back
    for (i = 0; i < this.floats.length; i++) {
      var fl = this.floats[i], ff = fl.t / fl.life, pop = ff < 0.18 ? easeOutBack(ff / 0.18) : 1, sz = Math.max(fl.size, minText) * pop;
      fx.text(fl.s, fl.x, fl.y - ff * 1.5, sz, fl.c[0], fl.c[1], fl.c[2], clamp01((1 - ff) * 2.4));
    }

    // light sources for the fog
    var ls = [];
    for (i = 0; i < this.lamps.length && ls.length < 6; i++) {
      var lm = this.lamps[i], lk = 1 - lm.t / lm.life;
      ls.push({ x: lm.x, y: lm.y, r: lm.r, g: lm.g, b: lm.b, power: lm.power * lk, falloff: lm.falloff });
    }
    if (game.lead && ls.length < 8) {
      var sk = this._skinColors(this.skin, this.time, 0).a;
      ls.push({ x: game.lead.x, y: game.lead.y, r: sk[0], g: sk[1], b: sk[2], power: 0.26, falloff: 0.09 });
    }
    fx.lights = ls;
    fx.render();
  };

  root.Renderer = Renderer;
  root.hslRGB = hsl;
})(window);
