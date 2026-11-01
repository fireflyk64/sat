/*
 * Canvas renderer for the run: neon platforms, glowing dominoes, a comet-trail marble,
 * sparks/confetti, a smooth camera, and little WebAudio blips (a pentatonic "xylophone"
 * that climbs as dominoes fall).
 */
(function (root) {
  'use strict';

  // ---------------- audio ----------------
  var Sound = {
    ctx: null, muted: false, last: 0, note: 0,
    init: function () {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) { try { this.ctx = new AC(); } catch (e) { this.ctx = null; } }
    },
    tone: function (freq, dur, type, vol, delay) {
      if (!this.ctx || this.muted) return;
      var t = this.ctx.currentTime + (delay || 0);
      var o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type || 'triangle'; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.05);
    },
    domino: function (strength) {
      var now = performance.now(); if (now - this.last < 35) return; this.last = now;
      var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
      var deg = scale[this.note++ % scale.length];
      this.tone(330 * Math.pow(2, deg / 12), 0.35, 'triangle', Math.min(0.12, 0.03 + strength * 0.01));
    },
    resetNotes: function () { this.note = 0; },
    correct: function () { var s = this; [523, 659, 784].forEach(function (f, i) { s.tone(f, 0.25, 'sine', 0.07, i * 0.07); }); },
    wrong: function () { this.tone(180, 0.25, 'sawtooth', 0.04); this.tone(150, 0.3, 'sawtooth', 0.04, 0.12); },
    ball: function () { var s = this; [392, 523, 659, 784, 1046].forEach(function (f, i) { s.tone(f, 0.3, 'square', 0.04, i * 0.06); }); },
    place: function () { this.tone(220 + Math.random() * 120, 0.12, 'square', 0.03); },
    fanfare: function () { var s = this; [523, 659, 784, 1046, 1318].forEach(function (f, i) { s.tone(f, 0.4, 'triangle', 0.07, i * 0.09); }); }
  };

  // ---------------- renderer ----------------
  function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cam = { x: 0, y: 6, zoom: 1, follow: true, shake: 0 };
    this.particles = [];
    this.trails = {};
    this.stars = [];
    for (var i = 0; i < 90; i++) this.stars.push({ x: Math.random(), y: Math.random() * 3, r: Math.random() * 1.4 + 0.3, p: Math.random() * 6.28 });
    this.flash = 0;
    this.resize();
    var self = this;
    root.addEventListener('resize', function () { self.resize(); });
  }

  Renderer.prototype.resize = function () {
    var c = this.canvas, dpr = Math.min(root.devicePixelRatio || 1, 2);
    var r = c.getBoundingClientRect();
    c.width = Math.max(200, Math.floor(r.width * dpr)); c.height = Math.max(200, Math.floor(r.height * dpr));
    this.dpr = dpr; this.w = c.width; this.h = c.height;
  };
  Renderer.prototype.scale = function () { return Math.min(this.w / 26, this.h / 17) * this.cam.zoom; };

  // --- user camera controls (CSS-pixel inputs) ---
  Renderer.prototype.panPx = function (dx, dy) {
    var s = this.scale(); this.cam.x -= dx * this.dpr / s; this.cam.y -= dy * this.dpr / s; this.cam.follow = false;
  };
  Renderer.prototype.zoomAt = function (factor, px, py) {
    var c = this.cam, s0 = this.scale();
    var nz = Math.max(0.035, Math.min(3, c.zoom * factor)); if (nz === c.zoom) return;
    var cx = px == null ? this.w / 2 : px * this.dpr, cy = py == null ? this.h / 2 : py * this.dpr;
    var wx = c.x + (cx - this.w / 2) / s0, wy = c.y + (cy - this.h / 2) / s0;   // world point under the cursor
    c.zoom = nz; var s1 = this.scale();
    c.x = wx - (cx - this.w / 2) / s1; c.y = wy - (cy - this.h / 2) / s1;
    c.follow = false;
  };
  Renderer.prototype.fit = function (track) {
    var b = track.bounds(), c = this.cam;
    var bw = b.maxX - b.minX + 14, bh = b.maxY - b.minY + 8;
    var base = Math.min(this.w / 26, this.h / 17);
    c.zoom = Math.max(0.035, Math.min(1.2, Math.min(this.w / bw, this.h / bh) / base));
    c.x = (b.minX + b.maxX) / 2; c.y = (b.minY + b.maxY) / 2; c.follow = false;
  };

  Renderer.prototype.burst = function (x, y, n, hue, speed) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = (0.3 + Math.random()) * (speed || 4);
      this.particles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, life: 0.5 + Math.random() * 0.7, max: 1.2, hue: (hue + Math.random() * 40) % 360, size: 0.04 + Math.random() * 0.07 });
    }
    if (this.particles.length > 600) this.particles.splice(0, this.particles.length - 600);
  };
  Renderer.prototype.confetti = function (y, hueBase, x0) {
    x0 = x0 || 0;
    for (var i = 0; i < 90; i++) {
      this.particles.push({ x: x0 + (Math.random() - 0.5) * 24, y: y - 6 - Math.random() * 4, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 3 + 1, life: 2 + Math.random() * 2, max: 4, hue: (hueBase + Math.random() * 200) % 360, size: 0.08 + Math.random() * 0.1, grav: 3, confetti: true });
    }
  };

  Renderer.prototype.updateCamera = function (game, dt) {
    var c = this.cam, track = game.track, ball = game.activeBall(), s = this.scale();
    if (c.follow) {
      var tx, ty;
      if (ball) { tx = ball.x; ty = ball.y + (this.h / s) * 0.08; }
      else if (track.sections.length) {
        var l = track.last(); tx = (l.H.x + l.lowX) / 2; ty = (l.H.y + l.lowY) / 2;
      } else { tx = 10; ty = Track.TOP + 2; }
      var k = ball ? 0.12 : 0.06, f = 1 - Math.pow(1 - k, dt * 60);
      c.x += (tx - c.x) * f; c.y += (ty - c.y) * f;
    }
    var b = track.bounds(), m = 14;
    c.x = Math.max(b.minX - m, Math.min(b.maxX + m, c.x));
    c.y = Math.max(b.minY - m, Math.min(b.maxY + m, c.y));
    c.shake *= Math.pow(0.001, dt);
    this.flash *= Math.pow(0.02, dt);
  };

  Renderer.prototype.update = function (dt) {
    var ps = this.particles;
    for (var i = ps.length - 1; i >= 0; i--) {
      var p = ps[i];
      p.life -= dt; if (p.life <= 0) { ps.splice(i, 1); continue; }
      p.vy += (p.grav || 9) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  };

  function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function hsl(h, s, l, a) { return 'hsla(' + (h % 360) + ',' + s + '%,' + l + '%,' + (a == null ? 1 : a) + ')'; }

  Renderer.prototype.draw = function (game, now) {
    var ctx = this.ctx, w = this.w, h = this.h, s = this.scale(), track = game.track, cam = this.cam;
    var sx = (Math.random() - 0.5) * cam.shake * s * 0.1, sy = (Math.random() - 0.5) * cam.shake * s * 0.1;
    var offX = w / 2 - cam.x * s + sx, offY = h / 2 - cam.y * s + sy;
    function X(x) { return offX + x * s; }
    function Y(y) { return offY + y * s; }
    var t = now / 1000;
    this.glow = s > 7;           // skip expensive blur when zoomed far out
    var vx0 = cam.x - w / 2 / s - 4, vx1 = cam.x + w / 2 / s + 4, vy0 = cam.y - h / 2 / s - 4, vy1 = cam.y + h / 2 / s + 4;

    // backdrop
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0b0620'); g.addColorStop(0.55, '#150a3a'); g.addColorStop(1, '#2a0d4a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // parallax stars + faint grid
    for (var i = 0; i < this.stars.length; i++) {
      var st = this.stars[i];
      var px = ((st.x * w * 1.5 - cam.x * s * 0.1) % w + w) % w;
      var py = ((st.y * h - cam.y * s * 0.15) % (h * 3) + h * 3) % (h * 3) - h * 0.5;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + 0.35 * Math.sin(t * 1.5 + st.p)) + ')';
      ctx.beginPath(); ctx.arc(px, py, st.r * this.dpr, 0, 6.283); ctx.fill();
    }
    var gridStep = 2 * s;
    if (gridStep > 14) {
      ctx.strokeStyle = 'rgba(120,90,255,0.07)'; ctx.lineWidth = 1; ctx.beginPath();
      for (var gy = ((offY % gridStep) + gridStep) % gridStep; gy < h; gy += gridStep) { ctx.moveTo(0, gy); ctx.lineTo(w, gy); }
      for (var gx = ((offX % gridStep) + gridStep) % gridStep; gx < w; gx += gridStep) { ctx.moveTo(gx, 0); ctx.lineTo(gx, h); }
      ctx.stroke();
    }

    var secs = track.sections;
    // launcher tube above the first piece
    if (secs.length) {
      var s0 = secs[0], tubeX = X(s0.H.x + s0.dir * 1.3);
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,0.7)'; ctx.lineWidth = Math.max(1.5, 0.09 * s);
      if (this.glow) { ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 16 * this.dpr; }
      ctx.beginPath();
      ctx.moveTo(tubeX - 0.6 * s, Y(s0.H.y - 7)); ctx.lineTo(tubeX - 0.6 * s, Y(s0.H.y - 4.2));
      ctx.moveTo(tubeX + 0.6 * s, Y(s0.H.y - 7)); ctx.lineTo(tubeX + 0.6 * s, Y(s0.H.y - 4.2));
      ctx.stroke(); ctx.restore();
    }

    // sections (culled to the viewport so huge contraptions stay fast)
    for (var si = 0; si < secs.length; si++) {
      var sc = secs[si];
      var bx0 = Math.min(sc.H.x, sc.lowX) - 4, bx1 = Math.max(sc.H.x, sc.lowX) + 4;
      if (bx1 < vx0 || bx0 > vx1 || sc.lowY + 4 < vy0 || sc.H.y - 4 > vy1) continue;
      this.drawSection(ctx, sc, now, X, Y, s);
    }

    // floor + bell
    var fy = Y(track.bottomY());
    if (fy < h + 80) {
      ctx.save();
      var fg = ctx.createLinearGradient(0, fy, 0, fy + 40 * this.dpr);
      fg.addColorStop(0, 'rgba(255,64,129,0.9)'); fg.addColorStop(1, 'rgba(255,64,129,0)');
      if (this.glow) { ctx.shadowColor = '#ff4081'; ctx.shadowBlur = 20 * this.dpr; }
      ctx.fillStyle = fg; ctx.fillRect(0, fy, w, 60 * this.dpr);
      ctx.restore();
      if (secs.length) {
        var ls = track.last();
        ctx.font = Math.max(10, 1.1 * s) + 'px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🔔', X(ls.lowX + ls.dir * 2.5), fy - 0.4 * s);
      }
    }

    // preview marker: where the next piece will attach
    if (game.choice) {
      var pv = track.preview(game.choice.dir), pulse = 0.5 + 0.5 * Math.sin(t * 4);
      var mxp = X(pv.x), myp = Y(pv.y);
      ctx.save();
      ctx.strokeStyle = 'rgba(255,234,0,' + (0.5 + 0.5 * pulse) + ')'; ctx.fillStyle = 'rgba(255,234,0,' + (0.5 + 0.5 * pulse) + ')';
      ctx.lineWidth = Math.max(2, 0.12 * s); ctx.setLineDash([0.5 * s, 0.4 * s]);
      if (this.glow) { ctx.shadowColor = '#ffea00'; ctx.shadowBlur = 14 * this.dpr; }
      var run = 4 * s, d = pv.dir, slope = Math.tan(0.16);
      ctx.beginPath(); ctx.moveTo(mxp, myp); ctx.lineTo(mxp + d * run, myp + run * slope); ctx.stroke();
      ctx.setLineDash([]);
      var ax = mxp + d * (run + 0.3 * s), ay = myp + (run + 0.3 * s) * slope;
      ctx.beginPath(); ctx.moveTo(ax + d * 0.9 * s, ay + 0.15 * s); ctx.lineTo(ax - d * 0.2 * s, ay - 0.6 * s); ctx.lineTo(ax - d * 0.2 * s, ay + 0.9 * s); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // trails + balls
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var b = 0; b < track.balls.length; b++) {
      var ball = track.balls[b], id = ball.id, tr = this.trails[id] || (this.trails[id] = []);
      tr.push({ x: ball.x, y: ball.y }); if (tr.length > 34) tr.shift();
      var hue = ball.userData.hue + t * 60;
      for (var k = 0; k < tr.length; k++) {
        var f = k / tr.length;
        ctx.fillStyle = hsl(hue + k * 4, 100, 60, f * 0.35);
        ctx.beginPath(); ctx.arc(X(tr[k].x), Y(tr[k].y), Track.BALL_R * s * (0.3 + f * 0.8), 0, 6.283); ctx.fill();
      }
    }
    ctx.restore();
    for (b = 0; b < track.balls.length; b++) this.drawBall(ctx, track.balls[b], X, Y, s, t);

    // particles
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < this.particles.length; i++) {
      var p = this.particles[i], a = Math.max(0, Math.min(1, p.life / (p.confetti ? 1 : p.max)));
      ctx.fillStyle = hsl(p.hue, 100, 62, a);
      if (p.confetti) { ctx.save(); ctx.translate(X(p.x), Y(p.y)); ctx.rotate(p.x * 3 + p.life * 5); ctx.fillRect(-p.size * s, -p.size * s * 0.5, p.size * 2 * s, p.size * s); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.size * s * (0.5 + a), 0, 6.283); ctx.fill(); }
    }
    ctx.restore();

    // screen flash + vignette
    if (this.flash > 0.01) { ctx.fillStyle = 'rgba(255,255,255,' + this.flash * 0.35 + ')'; ctx.fillRect(0, 0, w, h); }
    var vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  };

  Renderer.prototype.drawSection = function (ctx, sec, now, X, Y, s) {
    var age = (now - sec.born) / 1000, p = Math.max(0, Math.min(1, age / 0.7));
    if (age < 0) p = 0;
    var body = sec.body, hw = body.shape.hw, hh = body.shape.hh;
    var hue = sec.hue + (now / 40) % 360 * 0; // static hue per section; shimmer comes from glow

    // platform, revealed from the high end
    ctx.save();
    ctx.translate(X(body.x), Y(body.y)); ctx.rotate(body.a);
    var len = 2 * hw * easeOutBack(Math.min(1, p));
    if (len < 0) len = 0;
    var x0 = sec.dir === 1 ? -hw : hw - len;
    ctx.shadowColor = hsl(hue, 100, 60, 1); ctx.shadowBlur = 18 * (this.glow ? this.dpr : 0);
    var gr = ctx.createLinearGradient(0, -hh * s, 0, hh * s);
    gr.addColorStop(0, hsl(hue, 100, 70)); gr.addColorStop(1, hsl(hue + 40, 90, 35));
    ctx.fillStyle = gr;
    roundRect(ctx, x0 * s, -hh * s, len * s, 2 * hh * s, 0.1 * s); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.fillRect(x0 * s, -hh * s, len * s, Math.max(1.5, 0.04 * s));
    ctx.restore();

    // backstop wall
    if (sec.wall && p > 0.3) {
      var wl = sec.wall;
      ctx.save(); ctx.fillStyle = hsl(hue, 90, 55, 0.75);
      if (this.glow) { ctx.shadowColor = hsl(hue, 100, 60, 1); ctx.shadowBlur = 14 * this.dpr; }
      ctx.fillRect(X(wl.x - wl.shape.hw), Y(wl.y - wl.shape.hh), 2 * wl.shape.hw * s, 2 * wl.shape.hh * s);
      ctx.restore();
    }

    // pegs
    for (var i = 0; i < sec.pegs.length; i++) {
      var pg = sec.pegs[i]; if (p < 1) continue;
      ctx.save(); ctx.shadowColor = '#ffea00'; ctx.shadowBlur = 14 * (this.glow ? this.dpr : 0);
      var rg = ctx.createRadialGradient(X(pg.x) - 2, Y(pg.y) - 2, 1, X(pg.x), Y(pg.y), pg.shape.r * s);
      rg.addColorStop(0, '#fffde7'); rg.addColorStop(1, '#ffab00');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(X(pg.x), Y(pg.y), pg.shape.r * s, 0, 6.283); ctx.fill(); ctx.restore();
    }

    // dominoes
    for (i = 0; i < sec.dominoes.length; i++) {
      var d = sec.dominoes[i], dp = Math.max(0, Math.min(1, (age - 0.25 - i * 0.06) / 0.45));
      if (dp <= 0) continue;
      var drop = d.asleep ? (1 - easeOutBack(dp)) * -3.5 : 0;
      var moving = !d.asleep, dh = d.userData.hue;
      ctx.save();
      ctx.translate(X(d.x), Y(d.y + drop)); ctx.rotate(d.a);
      ctx.globalAlpha = Math.min(1, dp * 1.6);
      var w2 = d.shape.hw * s, h2 = d.shape.hh * s;
      ctx.shadowColor = hsl(dh, 100, 60, 1); ctx.shadowBlur = (moving ? 22 : 8) * (this.glow ? this.dpr : 0);
      var dg = ctx.createLinearGradient(-w2, 0, w2, 0);
      dg.addColorStop(0, hsl(dh, 95, 62)); dg.addColorStop(1, hsl(dh + 30, 90, 42));
      ctx.fillStyle = dg; roundRect(ctx, -w2, -h2, 2 * w2, 2 * h2, Math.min(w2, 4)); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(-w2 * 0.8, -1, w2 * 1.6, Math.max(1, 0.025 * s));
      var pr = Math.max(1, w2 * 0.28);
      [-h2 * 0.55, -h2 * 0.2, h2 * 0.3, h2 * 0.6].forEach(function (yy) { ctx.beginPath(); ctx.arc(0, yy, pr, 0, 6.283); ctx.fill(); });
      ctx.restore();
    }
  };

  Renderer.prototype.drawBall = function (ctx, ball, X, Y, s, t) {
    var r = Track.BALL_R * s, hue = ball.userData.hue + t * 60;
    var x = X(ball.x), y = Y(ball.y);
    ctx.save();
    ctx.shadowColor = hsl(hue, 100, 60, 1); ctx.shadowBlur = 26 * (this.glow ? this.dpr : 0);
    var rg = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    rg.addColorStop(0, '#ffffff'); rg.addColorStop(0.35, hsl(hue, 100, 65)); rg.addColorStop(1, hsl(hue + 60, 100, 35));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.shadowBlur = 0; ctx.translate(x, y); ctx.rotate(ball.a);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = Math.max(1.5, r * 0.14);
    ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0.3, 1.9); ctx.stroke();
    ctx.restore();
  };

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  root.Renderer = Renderer;
  root.Sound = Sound;
})(window);
