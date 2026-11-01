/*
 * The Water Section (opens at 400 right answers): a traditional test section in the style of the real SAT. 27 multiple-choice
 * questions, ten on words in context and seventeen on grammar and punctuation, with no feedback until the end.
 *
 * The clock only counts up, and the suggested finish is a guide and nothing more. Time is never an input to the score, to
 * Focus, to rewards or to anything else (see `score`, which has no time in it), so going over costs nothing. Pure functions:
 * tests/section-test.mjs runs this without a browser.
 */
(function (root) {
  'use strict';
  var Section = {};

  Section.WORDS = 10;
  Section.CONVENTIONS = { commas: 6, agreement: 4, tense: 3, proofreading: 4 };      // 17, like the real test's mix
  Section.SUGGESTED = 32 * 60;                                                          // the real module's 32 minutes, as a guide
  Section.SIZE = Section.WORDS + 17;

  /** "7:05", or "1:02:09" for the very long. */
  Section.clock = function (secs) {
    secs = Math.max(0, Math.floor(secs));
    var h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') + m : m) + ':' + (s < 10 ? '0' : '') + s;
  };

  /**
   * One gentle line about the pace. It never alarms and never mentions a penalty that does not exist: before the suggested finish it
   * says nothing, near it says it is only a guide, and past it says plainly that going over costs nothing.
   */
  Section.pace = function (secs) {
    var f = Section.SUGGESTED;
    if (secs < f * 0.8) return '';
    if (secs <= f) return 'Close to the suggested finish. It is only a guide.';
    return 'Past the suggested finish. No penalty: take the time you need.';
  };

  function byLeastSeen(list, items, rand) {
    return list.map(function (q) { var r = items[q.id]; return { q: q, seen: r ? r.seen : 0, k: rand() }; })
      .sort(function (a, b) { return a.seen - b.seen || a.k - b.k; })
      .map(function (x) { return x.q; });
  }

  /** The questions a section can be made from, given which storylines are open. */
  Section.pool = function (bank, open) {
    var words = [], conv = {};
    bank.forEach(function (q) {
      if (q.story && open && !open(q)) return;
      if (q.type === 'vocab' && q.level === 'sat') words.push(q);
      else if (q.type === 'mc' && Section.CONVENTIONS[q.skill]) (conv[q.skill] = conv[q.skill] || []).push(q);
    });
    return { words: words, conv: conv };
  };

  /**
   * A fresh section: words in context first, then conventions, like the real test. Questions he has seen least come first, so a section
   * is mostly new; within that, the order is random. Returns null if the bank cannot fill one.
   */
  Section.build = function (bank, store, rand, open) {
    rand = rand || Math.random;
    var items = (store && store.items) || {}, p = Section.pool(bank, open), out = [];
    var words = byLeastSeen(p.words, items, rand).slice(0, Section.WORDS);
    if (words.length < Section.WORDS) return null;
    var used = {}, conv = [];
    Object.keys(Section.CONVENTIONS).forEach(function (sk) {
      var take = byLeastSeen(p.conv[sk] || [], items, rand).slice(0, Section.CONVENTIONS[sk]);
      take.forEach(function (q) { used[q.id] = 1; conv.push(q); });
    });
    var need = Section.SIZE - Section.WORDS - conv.length;
    if (need > 0) {      // a thin skill: fill from the rest of the conventions
      var rest = [];
      Object.keys(p.conv).forEach(function (sk) { p.conv[sk].forEach(function (q) { if (!used[q.id]) rest.push(q); }); });
      conv = conv.concat(byLeastSeen(rest, items, rand).slice(0, need));
    }
    if (conv.length < Section.SIZE - Section.WORDS) return null;
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    return shuffle(words).concat(shuffle(conv));
  };

  /**
   * How a section went. `answers[i]` is the choice picked for question i, or null/undefined if left blank. There is no time in here
   * on purpose: how long it took cannot change the score.
   */
  Section.score = function (qs, answers) {
    var r = { right: 0, answered: 0, total: qs.length, wrong: [], blank: [], groups: { words: { r: 0, t: 0 }, conventions: { r: 0, t: 0 } }, skills: {} };
    qs.forEach(function (q, i) {
      var a = answers[i], g = q.type === 'vocab' ? r.groups.words : r.groups.conventions, sk = r.skills[q.skill] || (r.skills[q.skill] = { r: 0, t: 0 });
      g.t++; sk.t++;
      if (a == null) { r.blank.push(i); return; }
      r.answered++;
      if (a === q.answer) { r.right++; g.r++; sk.r++; } else r.wrong.push(i);
    });
    return r;
  };

  /** A sentence about the score. */
  Section.verdict = function (sc) {
    var f = sc.total ? sc.right / sc.total : 0;
    return f >= 0.9 ? 'Test-day sharp.' : f >= 0.7 ? 'A solid section.' : f >= 0.5 ? 'Getting there. The misses are the useful part.' : 'A hard one. Every miss is now in your cold case file, and they will come back.';
  };

  root.Section = Section;
})(typeof window !== 'undefined' ? window : globalThis);
