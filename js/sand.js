/*
 * Falling sand: a cellular automaton on a grid laid over part of the world. Grains fall, slide off slopes and heap up.
 * Ramps and walls are baked in as solid. Moving bodies are stamped in every step and push grains out of the way, and a
 * pile leaning on a body pushes it back, so sand can bury a domino and topple it. No DOM: tests/playground-test.mjs runs it.
 */
(function (root) {
  'use strict';

  function SandGrid(x0, y0, x1, y1, cell) {
    this.cell = cell;
    this.x0 = x0; this.y0 = y0;
    this.cols = Math.max(8, Math.ceil((x1 - x0) / cell));
    this.rows = Math.max(8, Math.ceil((y1 - y0) / cell));
    var n = this.cols * this.rows;
    this.g = new Uint8Array(n);       // 0 empty, otherwise a colour index
    this.solid = new Uint8Array(n);   // 1 baked static, 2 stamped this step
    this.px = new Uint8Array(n * 4);
    this.stamped = [];
    this.count = 0;
    this.flip = 0;
    this.lut = null;
  }

  SandGrid.prototype.index = function (x, y) {
    var cx = Math.floor((x - this.x0) / this.cell), cy = Math.floor((y - this.y0) / this.cell);
    return cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows ? -1 : cy * this.cols + cx;
  };

  /** Visit every cell a body covers. */
  SandGrid.prototype._cover = function (b, fn) {
    var cols = this.cols, rows = this.rows, c = this.cell, x0 = this.x0, y0 = this.y0, R = b.radius + c;
    var ax = Math.max(0, Math.floor((b.x - R - x0) / c)), bx = Math.min(cols - 1, Math.ceil((b.x + R - x0) / c));
    var ay = Math.max(0, Math.floor((b.y - R - y0) / c)), by = Math.min(rows - 1, Math.ceil((b.y + R - y0) / c));
    var circle = b.shape.type === 'circle', ca = Math.cos(b.a), sa = Math.sin(b.a);
    var hw = (b.shape.hw || 0) + c * 0.5, hh = (b.shape.hh || 0) + c * 0.5, r2 = circle ? (b.shape.r + c * 0.5) * (b.shape.r + c * 0.5) : 0;
    for (var y = ay; y <= by; y++) {
      var wy = y0 + (y + 0.5) * c - b.y;
      for (var x = ax; x <= bx; x++) {
        var wx = x0 + (x + 0.5) * c - b.x, inside;
        if (circle) inside = wx * wx + wy * wy <= r2;
        else { var lx = ca * wx + sa * wy, ly = -sa * wx + ca * wy; inside = Math.abs(lx) <= hw && Math.abs(ly) <= hh; }
        if (inside) fn(y * cols + x, x, y);
      }
    }
  };

  SandGrid.prototype.bake = function (body) {
    var solid = this.solid, g = this.g, self = this;
    this._cover(body, function (i) { solid[i] = 1; if (g[i]) { g[i] = 0; self.count--; } });
  };

  /** Stamp the moving bodies and shove any grain they land on upward, out of the way. Returns the grains knocked into the air. */
  SandGrid.prototype.stamp = function (bodies, onSpray) {
    var solid = this.solid, g = this.g, cols = this.cols, self = this, i;
    for (i = 0; i < this.stamped.length; i++) if (solid[this.stamped[i]] === 2) solid[this.stamped[i]] = 0;
    this.stamped.length = 0;
    var stamped = this.stamped;
    for (var k = 0; k < bodies.length; k++) {
      var b = bodies[k];
      this._cover(b, function (c) {
        if (solid[c] === 1) return;
        var v = g[c];
        if (v) {
          g[c] = 0;
          var up = c, moved = false;
          for (var n = 0; n < 8; n++) {
            up -= cols;
            if (up < 0) break;
            if (!g[up] && !solid[up]) { g[up] = v; moved = true; break; }
          }
          if (!moved) { self.count--; if (onSpray) onSpray(c, v, b); }
        }
        solid[c] = 2;
        stamped.push(c);
      });
    }
  };

  /** Pour n grains in a soft disc around (x, y). */
  SandGrid.prototype.pour = function (x, y, radius, n, colour, rand) {
    var added = 0;
    rand = rand || Math.random;
    for (var i = 0; i < n; i++) {
      var a = rand() * 6.283, r = Math.sqrt(rand()) * radius;
      var c = this.index(x + Math.cos(a) * r, y + Math.sin(a) * r);
      if (c >= 0 && !this.g[c] && !this.solid[c]) { this.g[c] = 1 + (colour % 250); this.count++; added++; }
    }
    return added;
  };

  /** One pass, bottom row first so a falling column moves together. Grains falling off the grid are gone. */
  SandGrid.prototype.step = function (rand) {
    var g = this.g, s = this.solid, cols = this.cols, rows = this.rows, flip = (this.flip = (this.flip + 1) & 1);
    var y, x, i, v;
    for (i = (rows - 1) * cols; i < rows * cols; i++) if (g[i]) { g[i] = 0; this.count--; }
    for (y = rows - 2; y >= 0; y--) {
      var left = (y + flip) & 1;
      for (var q = 0; q < cols; q++) {
        x = left ? q : cols - 1 - q;
        i = y * cols + x;
        v = g[i];
        if (!v) continue;
        var d = i + cols;
        if (!g[d] && !s[d]) { g[d] = v; g[i] = 0; continue; }
        var first = rand() < 0.5 ? -1 : 1;
        var nx = x + first, nd;
        if (nx >= 0 && nx < cols) { nd = d + first; if (!g[nd] && !s[nd]) { g[nd] = v; g[i] = 0; continue; } }
        nx = x - first;
        if (nx >= 0 && nx < cols) { nd = d - first; if (!g[nd] && !s[nd]) { g[nd] = v; g[i] = 0; } }
      }
    }
  };

  /**
   * Sand pushes back. A body with grains leaning on one side gets pushed the other way, a sleeping one wakes under
   * enough sand, and a body moving through a pile is slowed down.
   */
  SandGrid.prototype.press = function (bodies, dt) {
    var g = this.g, cols = this.cols, rows = this.rows, c = this.cell;
    for (var k = 0; k < bodies.length; k++) {
      var b = bodies[k], R = b.radius + 0.25;
      var ax = Math.max(0, Math.floor((b.x - R - this.x0) / c)), bx = Math.min(cols - 1, Math.ceil((b.x + R - this.x0) / c));
      var ay = Math.max(0, Math.floor((b.y - R - this.y0) / c)), by = Math.min(rows - 1, Math.ceil((b.y + R - this.y0) / c));
      if (ax > bx || ay > by) continue;
      var cx = (b.x - this.x0) / c, L = 0, Rr = 0;
      for (var y = ay; y <= by; y++) for (var x = ax; x <= bx; x++) if (g[y * cols + x]) { if (x < cx) L++; else Rr++; }
      var total = L + Rr;
      if (!total) continue;
      if (b.asleep) { if (total < 26 || b.manualWake) continue; b.wake(); }
      var diff = L - Rr, area = (bx - ax + 1) * (by - ay + 1);
      var push = diff * 0.05 * (0.05 / (c * c * 2)) * dt * 60 * 0.02;
      b.vx += push * 1.2;
      b.w += push * 1.6;
      var slow = Math.max(0.9, 1 - (total / area) * 0.05 * dt * 60);
      b.vx *= slow; b.vy = b.vy > 0 ? b.vy * slow : b.vy; b.w *= slow;
    }
  };

  /** Fill the RGBA image: colour bands by pour order, with a grainy sparkle so it reads as sand. */
  SandGrid.prototype.render = function () {
    if (!this.lut) {
      this.lut = new Uint8Array(256 * 3);
      for (var n = 0; n < 256; n++) {
        var h = (n * 2.2) % 360, k = function (m) { var a = (m + h / 30) % 12; return 0.62 - 0.38 * Math.max(-1, Math.min(a - 3, Math.min(9 - a, 1))); };
        this.lut[n * 3] = 255 * k(0); this.lut[n * 3 + 1] = 255 * k(8); this.lut[n * 3 + 2] = 255 * k(4);
      }
    }
    var g = this.g, px = this.px, lut = this.lut, N = g.length, cols = this.cols;
    for (var i = 0; i < N; i++) {
      var v = g[i], o = i * 4;
      if (!v) { px[o + 3] = 0; continue; }
      var x = i % cols, y = (i / cols) | 0, noise = 0.72 + 0.28 * (((x * 37 + y * 91) ^ (x * y)) & 7) / 7;
      px[o] = lut[v * 3] * noise; px[o + 1] = lut[v * 3 + 1] * noise; px[o + 2] = lut[v * 3 + 2] * noise; px[o + 3] = 255;
    }
    return px;
  };

  root.SandGrid = SandGrid;
})(typeof window !== 'undefined' ? window : globalThis);
