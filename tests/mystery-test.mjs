// The story under each machine: every mystery is well formed, its clues really clear each innocent suspect, and the
// clue and suspect pacing works for machines of any size. No browser needed.
//   node tests/mystery-test.mjs
import '../js/mystery.js';
import '../data/mysteries.js';

let failures = 0;
function check(name, ok, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`);
}

const all = Mystery.all();
check('there are mysteries to play', all.length >= 3, `${all.length}`);
check('ids are unique', new Set(all.map(m => m.id)).size === all.length);
check('titles are unique', new Set(all.map(m => m.title)).size === all.length);

// every entry is well formed
const bad = all.flatMap(m => Mystery.validate(m));
check('every mystery is well formed', bad.length === 0, bad.slice(0, 4).join('; '));

// the validator itself catches the mistakes it exists to catch
{
  const good = all[0], copy = () => JSON.parse(JSON.stringify(good));
  const cases = {
    'a culprit who is cleared': m => { m.suspects[m.culprit].cleared = 'x'; },
    'an innocent with no reason': m => { m.suspects[0].cleared = ''; },
    'two suspects sharing a clue': m => { m.suspects[0].clue = m.suspects[1].clue; },
    'the culprit found before the last clue': m => { const c = m.suspects[m.culprit], o = m.suspects.find((s, i) => i !== m.culprit && s.clue === 2); o.clue = c.clue; c.clue = 2; },
    'a missing clue': m => { m.clues.pop(); },
    'a clue too long to read': m => { m.clues[1] = 'x'.repeat(200); },
    'three suspects': m => { m.suspects.pop(); },
    'a culprit that is not a suspect': m => { m.culprit = 9; }
  };
  for (const [what, spoil] of Object.entries(cases)) {
    const m = copy(); spoil(m);
    check(`the validator rejects ${what}`, Mystery.validate(m).length > 0);
  }
  check('...and accepts the untouched original', Mystery.validate(copy()).length === 0);
}

// the culprit must not sit in the same place every time, or "always the last one" would solve every mystery
{
  const at = all.map(m => m.culprit);
  check('the culprit is listed in a different place in each mystery', new Set(at).size === all.length, at.join());
  check('...and is not always the first or the last', at.some(i => i > 0 && i < 3));
}

// elimination: each innocent has a clue of their own, and they come out in the order the clues turn up
for (const m of all) {
  const inn = Mystery.innocents(m);
  check(`${m.id}: three innocents, cleared in clue order, culprit left`, inn.length === 3 && !inn.includes(m.culprit)
    && inn.every((s, j) => j === 0 || m.suspects[inn[j - 1]].clue < m.suspects[s].clue), inn.map(i => m.suspects[i].name).join(' > '));
}

// the culprit's name must not give itself away in any earlier clue, or the last clue is a formality
for (const m of all) {
  const culprit = m.suspects[m.culprit], surname = culprit.name.split(' ').pop();
  const early = m.clues.slice(0, -1).filter(c => c.includes(surname));
  check(`${m.id}: the culprit is not named before the last clue`, early.length === 0, early[0] || '');
}
// ...while every innocent is named or described by a clue that comes before the culprit's
for (const m of all) {
  const lacking = Mystery.innocents(m).filter(i => {
    const s = m.suspects[i], surname = s.name.split(' ').pop(), c = m.clues[s.clue];
    return !c.includes(surname) && !c.toLowerCase().includes(s.role.replace(/^(the|a) /, '').toLowerCase());
  }).map(i => m.suspects[i].name);
  check(`${m.id}: each innocent's own clue is about them`, lacking.length === 0, lacking.join(', '));
}

// clues are found evenly, whatever the machine's size, and the last piece finds the last clue
{
  const m = all[0], n = m.clues.length;
  let ok = true, why = '';
  for (let target = 6; target <= 12; target++) {
    let prev = 0;
    for (let have = 1; have <= target; have++) {
      const k = Mystery.cluesFound(m, have, target);
      if (k < prev || k > n) { ok = false; why = `target ${target} have ${have} -> ${k}`; }
      if (have === 1 && k !== 0) { ok = false; why = `a bare machine has found ${k}`; }
      if (k - prev > 1 && target >= 6) { ok = false; why = `target ${target} jumped ${prev}->${k} on one piece`; }
      prev = k;
    }
    if (prev !== n) { ok = false; why = `target ${target} ends with ${prev}/${n}`; }
  }
  check('clues are found in order, at most one per piece, all by the last piece', ok, why);
  check('a small machine finds one clue per piece', [2, 3, 4, 5, 6].map(h => Mystery.cluesFound(m, h, 6)).join() === '1,2,3,4,5');
  check('a piece count past the target still finds them all', Mystery.cluesFound(m, 20, 6) === n);
}

// suspects clear down the machine: increasing, never at the very first or last section, whatever the length
{
  let ok = true, why = '';
  for (const m of all) for (let secs = 6; secs <= 14; secs++) {
    const pts = Mystery.clearPoints(m, secs);
    if (pts.length !== 3 || pts.some((p, j) => p < 1 || p > secs - 2 || (j && p <= pts[j - 1]))) { ok = false; why = `${m.id} with ${secs} sections: ${pts}`; }
    if (Mystery.cleared(m, secs, secs - 1).length !== 3) { ok = false; why = `${m.id}/${secs}: not all cleared at the bell`; }
    if (Mystery.cleared(m, secs, 0).length !== 0) { ok = false; why = `${m.id}/${secs}: someone cleared at the start`; }
  }
  check('suspects are cleared at increasing points, none at the start, all by the bell', ok, why);
  const m = all[0];
  let last = -1, grew = true;
  for (let f = 0; f < 8; f++) { const c = Mystery.cleared(m, 8, f).length; if (c < last) grew = false; last = c; }
  check('once cleared, a suspect stays cleared as the front moves on', grew);
  check('they come out in the order the clues turn up', Mystery.cleared(m, 8, 7).join() === Mystery.innocents(m).join());
}

// the mystery follows the machine count, and wraps round
{
  const n = all.length;
  check('the first machine gets the first mystery', Mystery.forMachine(0) === all[0]);
  check('the mysteries come round again when they run out', Mystery.forMachine(n) === all[0] && Mystery.forMachine(n + 1) === all[1]);
  check('a nonsense count still gives a mystery', !!Mystery.forMachine(-1) && !!Mystery.forMachine(1e9));
}

process.exit(failures ? 1 : 0);
