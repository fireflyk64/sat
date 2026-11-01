/*
 * The story that runs under each machine: a mystery with four suspects. Right answers find clues, and the machine's last
 * run clears the innocent suspects one by one until only the culprit is left. Pure functions of the machine's progress,
 * so nothing extra is saved: the mystery is worked out from how many machines are finished, and the clues from how many
 * pieces are in. tests/mystery-test.mjs runs this without a browser.
 */
(function (root) {
  'use strict';
  var Mystery = {};

  Mystery.all = function () { return root.SAT_MYSTERIES || []; };

  /** The mystery for the machine being built, given how many machines are already finished. They repeat once they run out. */
  Mystery.forMachine = function (done) {
    var all = Mystery.all();
    return all.length ? all[((done % all.length) + all.length) % all.length] : null;
  };

  /**
   * How many clues have been found. They are spread evenly over the pieces still to come, so a small machine finds one
   * per piece and a big one finds a clue every couple of pieces. A finished machine has found them all.
   * `have` and `target` are the machine's piece counts, the first row of dominoes included.
   */
  Mystery.cluesFound = function (mystery, have, target) {
    var n = mystery.clues.length, total = Math.max(1, target - 1), adds = Math.max(0, Math.min(total, have - 1));
    return Math.min(n, Math.floor(adds * n / total));
  };

  /** The innocent suspects, in the order their clues turn up. */
  Mystery.innocents = function (mystery) {
    return mystery.suspects.map(function (s, i) { return i; })
      .filter(function (i) { return i !== mystery.culprit; })
      .sort(function (a, b) { return mystery.suspects[a].clue - mystery.suspects[b].clue; });
  };

  /**
   * The section of the machine the running front must reach to clear each innocent suspect: spread evenly down the machine,
   * and never the very first or the very last section, so the culprit is the last one standing when the bell rings.
   */
  Mystery.clearPoints = function (mystery, sections) {
    var k = Mystery.innocents(mystery).length, last = Math.max(1, sections - 1), pts = [];
    for (var j = 0; j < k; j++) {
      var p = Math.round((j + 1) * last / (k + 1));
      p = Math.max(p, (pts[j - 1] || 0) + 1);
      pts.push(Math.min(p, Math.max(1, last - (k - j))));
    }
    return pts;
  };

  /** Which suspects are cleared once the front has reached section `frontier`, in the order they were cleared. */
  Mystery.cleared = function (mystery, sections, frontier) {
    var pts = Mystery.clearPoints(mystery, sections), who = Mystery.innocents(mystery);
    return who.filter(function (s, j) { return frontier >= pts[j]; });
  };

  /** Everything wrong with a mystery's data: an empty list when it is well formed. */
  Mystery.validate = function (m) {
    var bad = [], id = (m && m.id) || '?';
    function no(msg) { bad.push(id + ': ' + msg); }
    if (!m || !m.id || !m.title || !m.brief || !m.solution) return [id + ': needs an id, title, brief and solution'];
    if (!Array.isArray(m.suspects) || m.suspects.length !== 4) return [id + ': needs exactly four suspects'];
    if (!Array.isArray(m.clues) || m.clues.length !== m.suspects.length + 1) return [id + ': needs one clue to set the scene and one for each suspect'];
    if (!(m.culprit >= 0 && m.culprit < m.suspects.length)) return [id + ': culprit is not one of the suspects'];
    var names = {}, used = {};
    m.suspects.forEach(function (s, i) {
      if (!s.name || !s.role || !s.icon) no('suspect ' + i + ' needs a name, a role and an icon');
      if (names[s.name]) no('two suspects are called ' + s.name);
      names[s.name] = 1;
      if (!(s.clue >= 1 && s.clue < m.clues.length) || s.clue % 1) no(s.name + ' has no clue of their own');
      else if (used[s.clue]) no('two suspects share clue ' + s.clue);
      else used[s.clue] = 1;
      if (i !== m.culprit && !s.cleared) no(s.name + ' is innocent, so needs a reason they are cleared');
      if (i === m.culprit && s.cleared) no(s.name + ' is the culprit, so must not be cleared');
    });
    if (m.suspects[m.culprit].clue !== m.clues.length - 1) no('the culprit’s clue must come last, or the mystery is solved early');
    m.clues.forEach(function (c, i) {
      if (!c || c.length > 130) no('clue ' + i + ' is missing or too long to read at a glance (' + (c ? c.length : 0) + ' characters)');
    });
    if (m.brief.length > 240) no('the brief is too long');
    if (m.solution.length > 260) no('the solution is too long');
    m.suspects.forEach(function (s) { if (s.cleared && s.cleared.length > 120) no(s.name + '’s reason is too long'); });
    return bad;
  };

  root.Mystery = Mystery;
})(typeof window !== 'undefined' ? window : globalThis);
