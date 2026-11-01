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

  var KEY = 'sat-grey-cells-v1', COOKIE = 'lgc_cold', COOKIE_CHEST = 'lgc_chest', COOKIE_MAX = 3600, COOKIE_DAYS = 400;
  var DAY = 86400000, INTERVALS = [0, 1, 3, 7, 14, 30].map(function (d) { return d * DAY; });
  var SESSION_GAP = 30 * 60000;      // this long without an answer counts as a new session
  var RESPACE_MIN = 4, RESPACE_RANGE = 3;
  var WINS_TO_CLOSE = 2;

  /*
   * Focus: a right answer adds 1 and a miss takes away a third. With four choices a blind guess is right 1 time in 4, so
   * guessing nets exactly zero: 1/4 - 3/4 x 1/3 = 0. Playing without a freeze costs 1.5, a fair price rather than a
   * disaster, so he never has to be afraid of running the machine.
   * Each tier has its own counter and its own next goal. Reaching the goal rolls: a win pays out and resets that counter
   * only, and a loss moves the goal up by `every`. A goal rolls once, so dropping below it and climbing back gains nothing.
   */
  var TIERS = [
    { id: 'bonus', label: 'Big bonus', every: 10, chance: 0.33 },
    { id: 'rare', label: 'Rare', every: 20, chance: 0.25 },
    { id: 'ultra', label: 'Ultra rare', every: 100, chance: 0.10 }
  ];
  /* Freezes: every 5 correct IN A ROW earns one, and they stack. Playing while holding one costs nothing. They last until
     the session ends, meaning 30 minutes away: a quick page reload does not lose them. */
  var FREEZE_EVERY = 5;
  var MISS_PENALTY = 1 / 3, PLAY_COST = 1.5;
  function snap(x) { return Math.round(x * 6) / 6; }       // whole sixths: no rounding drift, however long the streak
  /* Vocabulary is the skill that pays off most directly on the real test, so it gets extra turns among new questions.
     It can't come up twice running, so a 1 in 2 pick works out to about a third of all new questions. */
  // Storylines open by total right answers. Questions tagged with a `story` stay out of the pool until it opens; after that a share
  // of the new questions he is given come from the open storylines until they are used up.
  var STORY_UNLOCK = { fire: 100, water: 400, breakable: 800 }, STORY_PICK = 0.4;
  var VOCAB_PICK = 0.5;
  /* Among those: mostly SAT-style passages, then the hard-word drill, and sometimes the earlier, easier questions. */
  var SAT_VOCAB_PICK = 0.6, DRILL_VOCAB_PICK = 0.25;

  function browserIO() {
    return {
      read: function () { try { return root.localStorage.getItem(KEY); } catch (e) { return null; } },
      write: function (s) { try { root.localStorage.setItem(KEY, s); } catch (e) { /* private mode, quota */ } },
      clear: function () { try { root.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } },
      readCookie: function (name) {
        try {
          var m = new RegExp('(?:^|; )' + (name || COOKIE) + '=([^;]*)').exec(root.document.cookie);
          return m ? decodeURIComponent(m[1]) : '';
        } catch (e) { return ''; }
      },
      writeCookie: function (v, name) {
        try {
          var path = root.location.pathname.replace(/[^/]*$/, '') || '/';
          root.document.cookie = (name || COOKIE) + '=' + encodeURIComponent(v) + '; max-age=' + (v ? COOKIE_DAYS * 86400 : 0) + '; path=' + path + '; SameSite=Lax';
        } catch (e) { /* file:// and friends */ }
      }
    };
  }

  function blank() {
    return {
      v: 2, items: {}, skills: {}, total: 0, qn: 0, cold: {}, closed: 0,
      streak: 0, bestStreak: 0, score: 0, bestRun: 0, cases: 0, sessions: 0, sinceCold: 99,
      machine: null,
      focus: { count: 0, bonus: 0, rare: 0, ultra: 0, next: {} }, freezes: 0, lastActive: 0, chest: {}, found: {},
      section: null, sections: []      // a test section in progress (so a closed tab does not lose it), and the last few finished
    };
  }

  /* "flood:2,sand:1|flood,sand,moon" = what is in the chest | everything ever found */
  function packChest(s) {
    var have = Object.keys(s.chest).filter(function (k) { return s.chest[k] > 0; }).map(function (k) { return k + ':' + s.chest[k]; });
    return have.join(',') + '|' + Object.keys(s.found).join(',');
  }
  function unpackChest(text) {
    var out = { chest: {}, found: {} }, parts = String(text || '').split('|');
    (parts[0] || '').split(',').filter(Boolean).forEach(function (kv) {
      var m = /^([a-z]+):(\d+)$/.exec(kv);
      if (m) { out.chest[m[1]] = +m[2]; out.found[m[1]] = 1; }
    });
    (parts[1] || '').split(',').filter(Boolean).forEach(function (k) { if (/^[a-z]+$/.test(k)) out.found[k] = 1; });
    return out;
  }

  /** opts: { io, now(), rand() } are injectable for tests. */
  function Progress(opts) {
    opts = opts || {};
    this.io = opts.io || browserIO();
    this.now = opts.now || function () { return Date.now(); };
    this.rand = opts.rand || Math.random;
    this.store = this._load();
    this.restoredFromCookie = this._restored || false;
    this.restoredChest = this._restoredChest || false;
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
    if (Array.isArray(s.freezes)) s.freezes = s.freezes.length;     // saved when each freeze had its own countdown
    // the chest also survives a wiped localStorage, through its own cookie
    if (!Object.keys(s.found).length) {
      var saved = unpackChest(this.io.readCookie(COOKIE_CHEST));
      if (Object.keys(saved.found).length) { s.chest = saved.chest; s.found = saved.found; this._restoredChest = true; }
    }
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
    var pack = packChest(this.store);
    if (pack !== this._lastChest) { this.io.writeCookie(pack === '|' ? '' : pack, COOKIE_CHEST); this._lastChest = pack; }
  };

  Progress.prototype.reset = function () {
    this.io.clear(); this.io.writeCookie(''); this._lastCookie = '';
    this.io.writeCookie('', COOKIE_CHEST); this._lastChest = '|';
    this.store = blank();
    this.beginSession();
  };

  // ---------------------------------------------------------------- sessions
  Progress.prototype.beginSession = function () {
    var s = this.store;
    s.sessions++; this.session = s.sessions; this.lastAnswer = this.now();
    if (s.lastActive && this.lastAnswer - s.lastActive > SESSION_GAP) s.freezes = 0;     // freezes last until the session ends
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

  /** Has this storyline opened yet? */
  Progress.prototype.storyOpen = function (id) { return this.store.total >= (STORY_UNLOCK[id] == null ? 0 : STORY_UNLOCK[id]); };
  // (with a bank given, only storylines that have questions in it count: nothing is announced before its content exists)
  function hasStory(bank, k) {
    if (!bank) return true;
    if (k === 'water') return !!root.Section;          // the water storyline is a test section made from the rest of the bank
    return bank.some(function (q) { return q.story === k; });
  }
  /** Storylines that opened with the answer just recorded. */
  Progress.prototype.storyJustOpened = function (bank) {
    var total = this.store.total;
    return Object.keys(STORY_UNLOCK).filter(function (k) { return STORY_UNLOCK[k] === total && total > 0 && hasStory(bank, k); });
  };
  /** The storyline that opens next: { id, left } */
  Progress.prototype.nextStory = function (bank) {
    var total = this.store.total, ids = Object.keys(STORY_UNLOCK).filter(function (k) { return STORY_UNLOCK[k] > total && hasStory(bank, k); });
    ids.sort(function (a, b) { return STORY_UNLOCK[a] - STORY_UNLOCK[b]; });
    return ids.length ? { id: ids[0], left: STORY_UNLOCK[ids[0]] - total } : null;
  };

  /** Storylines that opened somewhere between two totals (a whole test section can cross a threshold). */
  Progress.prototype.storiesBetween = function (a, b, bank) {
    return Object.keys(STORY_UNLOCK).filter(function (k) { return STORY_UNLOCK[k] > a && STORY_UNLOCK[k] <= b && hasStory(bank, k); });
  };
  /** Toys that unlocked somewhere between two totals. */
  Progress.prototype.kindsBetween = function (KINDS, a, b) {
    return Object.keys(KINDS).filter(function (k) { return KINDS[k].unlock > a && KINDS[k].unlock <= b; });
  };

  // ---------------------------------------------------------------- a test section in progress, and how the last ones went
  Progress.prototype.sectionSave = function (st) { this.store.section = st; this.save(); };
  Progress.prototype.sectionClear = function () { this.store.section = null; this.save(); };
  Progress.prototype.sectionLog = function (entry) { this.store.sections = [entry].concat(this.store.sections || []).slice(0, 12); this.save(); };

  Progress.prototype.next = function (bank, last) {
    var s = this.store, now = this.now(), rand = this.rand, cold = s.cold, self = this;
    bank = bank.filter(function (q) { return !q.story || self.storyOpen(q.story); });
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
    if (fresh.length) {
      var f = varied(fresh, last), story = f.filter(function (q) { return q.story; });
      if (story.length && rand() < STORY_PICK) return story[Math.floor(rand() * story.length)];
      f = f.filter(function (q) { return !q.story; });
      if (!f.length) f = story;
      var vocab = f.filter(function (q) { return q.skill === 'vocab'; }), rest = f.filter(function (q) { return q.skill !== 'vocab'; });
      var from = vocab.length && (!rest.length || rand() < VOCAB_PICK) ? vocab : rest;
      if (from === vocab) {
        var roll = rand(), want = roll < SAT_VOCAB_PICK ? 'sat' : roll < SAT_VOCAB_PICK + DRILL_VOCAB_PICK ? 'hard' : null;
        var level = vocab.filter(function (q) { return (q.level || null) === want; });
        if (level.length) from = level;
      }
      return from[Math.floor(rand() * from.length)];
    }
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
    this.store.lastActive = this.now();
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
    this._focus(res, correct);
    this.save();
    return res;
  };

  // ---------------------------------------------------------------- Focus, freezes, the chest
  Progress.prototype._rewards = function () { return this.rewards || root.REWARDS || {}; };

  Progress.prototype._focus = function (res, correct) {
    var s = this.store, f = s.focus, self = this;
    res.rolls = [];
    if (!correct) {
      res.focusLost = this._takeFocus(MISS_PENALTY);
      return;
    }
    f.count = snap(f.count + 1);
    var goals = f.next || (f.next = {});
    TIERS.forEach(function (t) {
      f[t.id] = snap(f[t.id] + 1);
      var goal = goals[t.id] || t.every;
      if (f[t.id] < goal - 1e-6) return;
      var won = self.rand() < t.chance, roll = { tier: t.id, label: t.label, chance: t.chance, at: f[t.id], won: won, next: goal + t.every };
      if (won) { roll.item = self._grant(t.id); f[t.id] = 0; roll.next = t.every; goals[t.id] = t.every; }
      else goals[t.id] = goal + t.every;
      res.rolls.push(roll);
    });
    if (s.streak % FREEZE_EVERY === 0) { s.freezes++; res.freezeEarned = true; }
  };

  /** Take points off Focus and every bar, never below zero. A goal already rolled stays rolled. Returns what was really lost. */
  Progress.prototype._takeFocus = function (n) {
    var f = this.store.focus, before = f.count;
    f.count = Math.max(0, snap(f.count - n));
    TIERS.forEach(function (t) { f[t.id] = Math.max(0, snap(f[t.id] - n)); });
    return snap(before - f.count);
  };

  /** Pick an item from a tier: anything goes, but one not found yet is twice as likely. */
  Progress.prototype._grant = function (tier) {
    var all = this._rewards(), s = this.store;
    var ids = Object.keys(all).filter(function (k) { return all[k].tier === tier; });
    if (!ids.length) return null;
    var weights = ids.map(function (k) { return s.found[k] ? 1 : 2; }), total = weights.reduce(function (a, b) { return a + b; }, 0);
    var roll = this.rand() * total, i = 0;
    while (i < ids.length - 1 && roll >= weights[i]) { roll -= weights[i]; i++; }
    s.chest[ids[i]] = (s.chest[ids[i]] || 0) + 1;
    s.found[ids[i]] = 1;
    return ids[i];
  };

  /** He played: a freeze is spent if he has one, otherwise it costs a little Focus. */
  Progress.prototype.notePlay = function () {
    var s = this.store;
    s.lastActive = this.now();
    if (s.freezes > 0) {
      s.freezes--;
      this.save();
      return { frozen: true, kept: s.focus.count, left: s.freezes };
    }
    var lost = this._takeFocus(PLAY_COST);
    this.save();
    return { lost: lost, now: s.focus.count };
  };

  /** How far a tier's bar is toward its next goal: 0 to `every`. */
  Progress.prototype.tierProgress = function (t) {
    var f = this.store.focus, goal = (f.next && f.next[t.id]) || t.every;
    return Math.max(0, snap(f[t.id] - (goal - t.every)));
  };

  /** Take one item out of the chest to play with. */
  Progress.prototype.useItem = function (id) {
    var c = this.store.chest;
    if (!(c[id] > 0)) return false;
    c[id]--;
    this.save();
    return true;
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
  Progress.STORY_UNLOCK = STORY_UNLOCK;
  Progress.TIERS = TIERS;
  Progress.FREEZE_EVERY = FREEZE_EVERY;
  Progress.MISS_PENALTY = MISS_PENALTY;
  Progress.PLAY_COST = PLAY_COST;
  /** 13.6667 -> "13⅔" */
  Progress.fmt = function (n) {
    var w = Math.floor(n + 1e-6), sixths = Math.round((n - w) * 6), f = ['', '⅙', '⅓', '½', '⅔', '⅚'][sixths] || '';
    return (w || !f ? String(w) : '') + f;
  };
  root.Progress = Progress;
})(typeof window !== 'undefined' ? window : globalThis);
