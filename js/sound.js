/*
 * All sound is synthesised live with WebAudio: no audio files to load. A compressor and a little generated
 * reverb make it feel like one space. Dominoes are a xylophone climbing a pentatonic scale, so a long chain
 * sounds like a rising run, and it resolves onto a full chord when the bell rings.
 */
(function (root) {
  'use strict';
  var SCALE = [0, 2, 4, 7, 9];

  var Sound = {
    ctx: null, muted: false, last: 0, note: 0, master: null, wet: null,

    init: function () {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { this.ctx = null; return; }
      var c = this.ctx;
      var comp = c.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.2;
      this.master = c.createGain(); this.master.gain.value = 0.85;
      this.master.connect(comp); comp.connect(c.destination);
      // generated room reverb
      var len = Math.floor(c.sampleRate * 1.7), buf = c.createBuffer(2, len, c.sampleRate);
      for (var ch = 0; ch < 2; ch++) {
        var d = buf.getChannelData(ch);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      var conv = c.createConvolver(); conv.buffer = buf;
      this.wet = c.createGain(); this.wet.gain.value = 0.32;
      conv.connect(this.wet); this.wet.connect(this.master);
      this.send = conv;
      this.noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      var nd = this.noiseBuf.getChannelData(0);
      for (i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    },

    tone: function (freq, dur, type, vol, delay, sweepTo, wet) {
      if (!this.ctx || this.muted) return;
      var c = this.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      if (sweepTo) o.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      if (wet !== 0) g.connect(this.send);
      o.start(t); o.stop(t + dur + 0.05);
    },

    noise: function (dur, vol, freq, delay, sweepTo, q) {
      if (!this.ctx || this.muted) return;
      var c = this.ctx, t = c.currentTime + (delay || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = this.noiseBuf; s.loop = true;
      f.type = 'lowpass'; f.Q.value = q || 0.7; f.frequency.setValueAtTime(freq, t);
      if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(this.master); g.connect(this.send);
      s.start(t, Math.random()); s.stop(t + dur + 0.05);
    },

    _scale: function (deg, base) {
      var oct = Math.floor(deg / SCALE.length), semi = SCALE[deg % SCALE.length] + oct * 12;
      return (base || 262) * Math.pow(2, semi / 12);
    },
    resetNotes: function () { this.note = 0; },

    /* Rising xylophone. It climbs two octaves and then falls back an octave, so a long run keeps rising in feel. */
    domino: function () {
      var now = root.performance.now();
      if (now - this.last < 26) return;
      this.last = now;
      var deg = this.note++;
      if (deg > 14) deg = 10 + ((deg - 10) % 5);
      var f = this._scale(deg, 330);
      this.tone(f, 0.3, 'sine', 0.11);
      this.tone(f * 3.98, 0.09, 'sine', 0.035, 0, null, 0);
      this.noise(0.022, 0.05, 3400);
    },

    click: function (amp) { this.tone(1900, 0.05, 'triangle', 0.09 * (amp || 1) + 0.02, 0, 1400, 0); this.tone(3400, 0.03, 'sine', 0.04 * (amp || 1), 0, null, 0); },
    peg: function (i) { var f = this._scale(10 + (i % 8), 262); this.tone(f, 0.22, 'triangle', 0.07); this.tone(f * 2, 0.1, 'sine', 0.025); },
    thud: function (v) { this.tone(96, 0.14, 'sine', Math.min(0.2, 0.05 + v * 0.012), 0, 54); this.noise(0.05, Math.min(0.09, v * 0.006), 900); },
    kick: function () { var s = this; [523, 784].forEach(function (f, i) { s.tone(f, 0.16, 'triangle', 0.08, i * 0.05); }); },
    star: function (n) { var f = 660 * Math.pow(2, (n || 0) * 4 / 12); this.tone(f, 0.28, 'sine', 0.1); this.tone(f * 1.5, 0.34, 'sine', 0.07, 0.07); this.tone(f * 2, 0.42, 'sine', 0.05, 0.14); },

    correct: function () { var s = this; [523, 659, 784].forEach(function (f, i) { s.tone(f, 0.28, 'sine', 0.09, i * 0.075); }); },
    wrong: function () { this.tone(170, 0.32, 'sine', 0.13, 0, 110); this.tone(128, 0.4, 'triangle', 0.06, 0.1, 82); },
    /* A ratchet of clicks and a heavy clunk as a piece locks into the machine. */
    slot: function () {
      for (var i = 0; i < 6; i++) { this.tone(420 + i * 90, 0.04, 'square', 0.03, i * 0.055, null, 0); }
      this.tone(140, 0.26, 'sine', 0.2, 0.36, 62); this.noise(0.12, 0.13, 1600, 0.36); this.tone(880, 0.28, 'triangle', 0.05, 0.42);
    },
    flick: function (power) { this.noise(0.18, 0.14, 1400 + power * 2600, 0, 400); this.tone(320 + power * 240, 0.16, 'triangle', 0.09, 0, 720 + power * 340); },
    stretch: function (power) {
      var now = root.performance.now(); if (now - (this._st || 0) < 55) return; this._st = now;
      this.tone(170 + power * 480, 0.05, 'sawtooth', 0.016, 0, null, 0);
    },
    charge: function () { this.tone(150, 0.6, 'sawtooth', 0.05, 0, 980); this.noise(0.6, 0.03, 500, 0, 3500); },
    boom: function (power) {
      power = power || 1;
      this.tone(118, 0.65 * power, 'sine', 0.42, 0, 30);
      this.tone(62, 0.8 * power, 'sine', 0.3, 0.01, 26);
      this.noise(0.8 * power, 0.42, 3000, 0, 180);
      this.noise(0.1, 0.32, 9000, 0, 2000);
    },
    bounce: function () { this.tone(170, 0.32, 'sine', 0.18, 0, 720); this.tone(340, 0.2, 'triangle', 0.05, 0.02, 1100); },
    warp: function () { this.tone(1500, 0.34, 'sine', 0.07, 0, 170); this.tone(170, 0.32, 'sine', 0.07, 0.3, 1400); this.noise(0.4, 0.05, 2500, 0.05, 700, 6); },
    swing: function () { this.noise(0.55, 0.11, 280, 0, 1800, 2); this.tone(70, 0.5, 'sine', 0.09, 0.25, 100); },
    gate: function () {
      this.noise(0.08, 0.12, 2400); this.tone(200, 0.12, 'square', 0.04);
      for (var i = 0; i < 14; i++) this.tone(1200 + Math.random() * 1400, 0.05, 'triangle', 0.025, 0.08 + i * 0.05, null, 0);
    },
    launch: function () { this.tone(110, 0.14, 'sine', 0.22, 0, 60); this.tone(240, 0.5, 'triangle', 0.09, 0.03, 880); this.noise(0.14, 0.08, 1200); },

    /* The pay-off: a struck bell with inharmonic partials, ringing into the reverb. */
    bell: function (bright) {
      var base = 392, parts = [[0.5, 0.26, 3.4], [1, 0.3, 3.2], [1.19, 0.12, 2.4], [1.5, 0.15, 2.1], [2, 0.14, 1.8], [2.51, 0.06, 1.3], [3.01, 0.05, 1], [4.07, 0.035, 0.7]], s = this;
      parts.forEach(function (p) { s.tone(base * p[0], p[2] * (bright ? 1.3 : 1), 'sine', p[1] * (bright ? 1.1 : 0.85)); });
      this.tone(1960, 0.05, 'triangle', 0.12, 0, null, 0);
    },
    /* The chain's rising run resolves here: a big arpeggiated major chord under the bell. */
    finale: function () {
      this.bell(true);
      var s = this, chord = [130.8, 196, 261.6, 329.6, 392, 523.3, 659.3, 784, 1046.5, 1318.5], i;
      chord.forEach(function (f, n) {
        s.tone(f, 3.6, 'triangle', 0.1 - n * 0.005, 0.22 + n * 0.09);
        s.tone(f * 1.002, 3.6, 'sine', 0.06, 0.22 + n * 0.09);
      });
      this.tone(65.4, 4.2, 'sine', 0.28, 0.2);
      this.tone(98, 4.2, 'sine', 0.13, 0.2);
      for (i = 0; i < 26; i++) s.tone(1046.5 * Math.pow(2, SCALE[i % 5] / 12 + Math.floor(i / 5)), 0.32, 'sine', 0.035, 1.4 + i * 0.07);
    },
    pop: function () { this.noise(0.18, 0.14, 2200, 0, 600); this.tone(180 + Math.random() * 100, 0.14, 'sine', 0.08, 0, 60); },
    unlock: function () { var s = this; [523, 659, 784, 1046, 1318].forEach(function (f, i) { s.tone(f, 0.42, 'triangle', 0.09, i * 0.085); }); },
    tierUp: function () { var s = this; [392, 523, 659, 784].forEach(function (f, i) { s.tone(f, 0.34, 'sawtooth', 0.035, i * 0.06); s.tone(f, 0.34, 'sine', 0.07, i * 0.06); }); },
    caseClosed: function () { var s = this; [659, 880, 1109, 1319].forEach(function (f, i) { s.tone(f, 0.6, 'sine', 0.09, i * 0.09); }); }
  };

  root.Sound = Sound;
})(window);
