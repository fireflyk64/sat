/*
 * Everything the browser remembers between sessions, and the logic that decides what comes next.
 *
 * Saved in localStorage (site data). The list of missed questions is also mirrored into a cookie, so a
 * cleared or evicted localStorage does not lose them. Nothing ever leaves the device.
 *
 * "Cold cases": a missed question stays open until it has been answered correctly in TWO DIFFERENT SESSIONS.
 *   - it comes back a few questions later in the same session (once)
 *   - it comes back early in every later session until it is closed
 *   - missing it again starts the count over
 *
 * No DOM here, so tests/progress-test.mjs can run whole simulated weeks of play in Node.
 */
(function (root) {
  'use strict';

  var KEY = 'sat-grey-cells-v1', COOKIE = 'lgc_cold', COOKIE_MAX = 3600, COOKIE_DAYS = 400;
  var DAY = 86400000, INTERVALS = [0, 1, 3, 7, 14, 30].map(function (d) { return d * DAY; });
  var SESSION_GAP = 30 * 60000;      // this long without an answer counts as a new session
  var RESPACE_MIN = 4, RESPACE_RANGE = 3;
  var WINS_TO_CLOSE = 2;

  function browserIO() {
    return {
      read: function () { try { return root.localStorage.getItem(KEY); } catch (e) { return null; } },
      write: function (s) { try { root.localStorage.setItem(KEY, s); } catch (e) { /* private mode, quota */ } },
      clear: function () { try { root.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } },
      readCookie: function () {
        try {
          var m = new RegExp('(?:^|; )' + COOKIE + '=([^;]*)').exec(root.document.cookie);
          return m ? decodeURIComponent(m[1]) : '';
        } catch (e) { return ''; }
      },
      writeCookie: function (v) {
        try {
          var path = root.location.pathname.replace(/[^/]*$/, '') || '/';
          root.document.cookie = COOKIE + '=' + encodeURIComponent(v) + '; max-age=' + (v ? COOKIE_DAYS * 86400 : 0) + '; path=' + path + '; SameSite=Lax';
        } catch (e) { /* file:// and friends */ }
      }
    };
  }

  function blank() {
    return {
      v: 2, items: {}, skills: {}, total: 0, qn: 0, cold: {}, closed: 0,
      streak: 0, bestStreak: 0, score: 0, bestRun: 0, cases: 0, sessions: 0, sinceCold: 99,
      machine: null
    };
  }

  /** opts: { io, now(), rand() } are injectable for tests. */
  function Progress(opts) {
    opts = opts || {};
    this.io = opts.io || browserIO();
    this.now = opts.now || function () { return Date.now(); };
    this.rand = opts.rand || Math.random;
    this.store = this._load();
    this.restoredFromCookie = this._restored || false;
    this.beginSession();
  }

  Progress.prototype._load = function () {
    var raw = this.io.read(), s = null;
    if (raw) { try { s = JSON.parse(raw); } catch (e) { s = null; } }
    if (!s || typeof s !== 'object' || !s.items) s = this._fromCookie();
    var needsMigration = s.v !== 2;         // must be read before the defaults below fill in v
    var b = blank(), k;
    for (k in b) if (s[k] === undefined) s[k] = b[k];
    if (needsMigration) this._migrate(s);
    return s;
  };

  /** localStorage came back empty: recover the list of misses from the cookie, if there is one. */
  Progress.prototype._fromCookie = function () {
    var s = blank(), ids = (this.io.readCookie() || '').split('|').filter(Boolean), t = this.now();
    ids.forEach(function (id) { s.cold[id] = { n: 1, at: t - DAY, wins: 0, winS: -1, missS: -1, afterQ: 0 }; });
    this._restored = ids.length > 0;
    return s;
  };

  /** Saves from the first version: a question sitting in box 0 after being seen was a miss. Marbles are gone now. */
  Progress.prototype._migrate = function (s) {
    var t = this.now();
    Object.keys(s.items).forEach(function (id) {
      var r = s.items[id];
      if (r.box === 0 && r.seen > 0 && !s.cold[id]) s.cold[id] = { n: 1, at: r.due - 60000 || t, wins: 0, winS: -1, missS: -1, afterQ: 0 };
    });
    delete s.balls;
    s.v = 2;
  };

  Progress.prototype.save = function () {
    this.io.write(JSON.stringify(this.store));
    this._mirror();
  };

  /** Oldest misses first, trimmed to what a cookie can hold. */
  Progress.prototype._mirror = function () {
    var cold = this.store.cold, ids = Object.keys(cold).sort(function (a, b) { return cold[a].at - cold[b].at; });
    var out = '', i;
    for (i = 0; i < ids.length; i++) {
      if (out.length + ids[i].length + 1 > COOKIE_MAX) break;
      out += (out ? '|' : '') + ids[i];
    }
    if (out !== this._lastCookie) { this.io.writeCookie(out); this._lastCookie = out; }
  };

  Progress.prototype.reset = function () {
    this.io.clear(); this.io.writeCookie(''); this._lastCookie = '';
    this.store = blank();
    this.beginSession();
  };

  // ---------------------------------------------------------------- sessions
  Progress.prototype.beginSession = function () {
    var s = this.store;
    s.sessions++; this.session = s.sessions; this.lastAnswer = this.now();
    s.sinceCold = 99;           // the first thing in a new session is an old miss, if there is one
    this.save();
  };
  Progress.prototype._touch = function () {
    var t = this.now();
    if (t - this.lastAnswer > SESSION_GAP) this.beginSession();
    this.lastAnswer = t;
  };

  // ---------------------------------------------------------------- what comes next
  Progress.prototype.coldCount = function (bank) {
    var cold = this.store.cold, ids = Object.keys(cold);
    if (!bank) return ids.length;
    var known = this._byId(bank);
    return ids.filter(function (id) { return known[id]; }).length;
  };
  Progress.prototype.isCold = function (id) { return !!this.store.cold[id]; };
  Progress.prototype._byId = function (bank) {
    if (this._idx && this._idxOf === bank) return this._idx;
    var m = {}; bank.forEach(function (q) { m[q.id] = q; });
    this._idx = m; this._idxOf = bank;
    return m;
  };

  /** A cold case is ready if it was missed in an earlier session, or missed a few questions ago in this one. */
  Progress.prototype._coldReady = function (bank, last) {
    var s = this.store, byId = this._byId(bank), me = this.session, out = [];
    Object.keys(s.cold).forEach(function (id) {
      var c = s.cold[id], q = byId[id];
      if (!q || q === last) return;
      if (c.winS === me) return;                                 // already solved once this session: next time
      if (c.missS === me && s.qn < c.afterQ) return;             // just seen the answer: leave a gap so it is real recall
      out.push(q);
    });
    return out;
  };

  /** Mix skills, but never run dry. */
  function varied(list, last) {
    var other = last ? list.filter(function (q) { return q.skill !== last.skill; }) : list;
    return other.length ? other : list;
  }

  Progress.prototype.next = function (bank, last) {
    var s = this.store, now = this.now(), rand = this.rand, cold = s.cold;
    var ready = this._coldReady(bank, last);
    if (ready.length && s.sinceCold >= 1) {
      // oldest first, keeping skills mixed where possible
      var pool = varied(ready, last).slice().sort(function (a, b) { return cold[a.id].at - cold[b.id].at; });
      s.sinceCold = 0;
      return pool[0];
    }
    s.sinceCold++;

    var items = s.items, seen = [], fresh = [];
    bank.forEach(function (q) {
      if (q === last || cold[q.id]) return;
      if (items[q.id]) seen.push(q); else fresh.push(q);
    });

    var due = seen.filter(function (q) { return items[q.id].due <= now; });
    if (due.length && (rand() < 0.34 || !fresh.length)) {
      var d = varied(due, last).slice().sort(function (a, b) { return items[a.id].due - items[b.id].due; });
      return d[0];
    }
    if (fresh.length) { var f = varied(fresh, last); return f[Math.floor(rand() * f.length)]; }
    if (ready.length) return ready[0];

    // every question has been seen and nothing is due: lowest box, then whatever is due soonest
    var rest = seen.length ? seen : bank.filter(function (q) { return q !== last; });
    if (!rest.length) rest = bank;
    rest = varied(rest, last).slice().sort(function (a, b) {
      return ((items[a.id] || {}).box || 0) - ((items[b.id] || {}).box || 0) || ((items[a.id] || {}).due || 0) - ((items[b.id] || {}).due || 0);
    });
    return rest[0];
  };

  // ---------------------------------------------------------------- recording an answer
  /** Returns what happened: { correct, wasCold, closed, wins, needed, streak, tierUp } */
  Progress.prototype.record = function (q, correct) {
    this._touch();
    var s = this.store, now = this.now(), wasCold = !!s.cold[q.id], res = { correct: correct, wasCold: wasCold, closed: false };
    s.qn++;

    var rec = s.items[q.id] || (s.items[q.id] = { box: 0, due: 0, seen: 0, right: 0 });
    rec.seen++;
    if (correct) { rec.right++; rec.box = Math.min(rec.box + 1, INTERVALS.length - 1); rec.due = now + INTERVALS[rec.box]; }
    else { rec.box = 0; rec.due = now; }

    var sk = s.skills[q.skill] || (s.skills[q.skill] = { r: 0, t: 0 });
    sk.t++; if (correct) sk.r++;

    if (correct) {
      s.total++; s.streak++;
      if (s.streak > s.bestStreak) s.bestStreak = s.streak;
      if (wasCold) {
        var c = s.cold[q.id];
        if (c.winS !== this.session) { c.wins++; c.winS = this.session; }
        res.wins = c.wins; res.needed = WINS_TO_CLOSE;
        if (c.wins >= WINS_TO_CLOSE) { delete s.cold[q.id]; s.closed++; res.closed = true; }
      }
    } else {
      s.streak = 0;
      var old = s.cold[q.id];
      s.cold[q.id] = {
        n: (old ? old.n : 0) + 1, at: now, wins: 0, winS: -1, missS: this.session,
        afterQ: s.qn + RESPACE_MIN + Math.floor(this.rand() * RESPACE_RANGE)
      };
      res.repeatMiss = !!old;
    }
    res.streak = s.streak;
    this.save();
    return res;
  };

  // ---------------------------------------------------------------- the machine's recipe
  var MAX_PIECES = 12;
  Progress.prototype.targetSize = function () { return Math.min(6 + this.store.cases * 2, MAX_PIECES); };

  /** A fresh machine: just a row of dominoes, waiting for a right answer to bring it to life. */
  Progress.prototype.newMachine = function (carry) {
    var seed = Math.floor(this.rand() * 1e9);
    this.store.machine = {
      seed: seed, target: this.targetSize(), nextId: 2, playFrom: null, complete: false, pending: carry || 0,
      pieces: [{ id: 'p1', kind: 'dominoes', seed: seed ^ 0x51ed }]
    };
    this.save();
    return this.store.machine;
  };

  Progress.prototype.machine = function () { return this.store.machine || this.newMachine(); };

  /** Toys available so far, given every correct answer ever. */
  Progress.prototype.unlocked = function (KINDS) {
    var total = this.store.total;
    return Object.keys(KINDS).filter(function (k) { return KINDS[k].unlock <= total; });
  };

  /** The toy that this many right answers have just unlocked, if any. */
  Progress.prototype.justUnlocked = function (KINDS) {
    var total = this.store.total;
    return Object.keys(KINDS).filter(function (k) { return KINDS[k].unlock === total && total > 0; });
  };

  /** Next toy on the ladder, for the "3 more for the Cannon" tease. */
  Progress.prototype.nextUnlock = function (KINDS) {
    var total = this.store.total, keys = Object.keys(KINDS).filter(function (k) { return KINDS[k].unlock > total; });
    keys.sort(function (a, b) { return KINDS[a].unlock - KINDS[b].unlock; });
    return keys.length ? { kind: keys[0], label: KINDS[keys[0]].label, left: KINDS[keys[0]].unlock - total } : null;
  };

  /**
   * A right answer: a random toy slots into a random gap in the chain.
   * Prefers a toy just unlocked, avoids repeating its neighbours, and favours toys the machine does not have yet.
   */
  Progress.prototype.slotPiece = function (KINDS, force) {
    var m = this.machine(), rand = this.rand;
    if (m.complete) { m.pending++; this.save(); return null; }
    var pool = this.unlocked(KINDS);
    var slot = Math.floor(rand() * (m.pieces.length + 1));
    var before = m.pieces[slot - 1], after = m.pieces[slot], have = {};
    m.pieces.forEach(function (p) { have[p.kind] = (have[p.kind] || 0) + 1; });
    var kind = force;
    if (!kind) {
      var weights = pool.map(function (k) {
        var w = 1 / (1 + (have[k] || 0) * 1.6);
        if (k === 'dominoes') w *= 0.7;                // every piece already ends in dominoes
        if ((before && before.kind === k) || (after && after.kind === k)) w *= 0.15;
        return w;
      });
      var tot = weights.reduce(function (a, b) { return a + b; }, 0), roll = rand() * tot, i = 0;
      while (i < pool.length - 1 && roll > weights[i]) { roll -= weights[i]; i++; }
      kind = pool[i];
    }
    var piece = { id: 'p' + m.nextId++, kind: kind, seed: Math.floor(rand() * 1e9) };
    m.pieces.splice(slot, 0, piece);
    if (m.playFrom === null || slot <= m.playFrom) m.playFrom = slot;
    if (m.pieces.length >= m.target) m.complete = true;
    this.save();
    return { piece: piece, slot: slot, complete: m.complete };
  };

  Progress.prototype.bankScore = function (n) {
    var s = this.store;
    s.score += n;
    if (n > s.bestRun) s.bestRun = n;
    this.save();
  };

  Progress.WINS_TO_CLOSE = WINS_TO_CLOSE;
  root.Progress = Progress;
})(typeof window !== 'undefined' ? window : globalThis);
