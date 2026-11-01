// Simulated play across sessions: do misses really come back, in new sessions, until they are truly learned?
import '../js/progress.js';
import '../js/track.js';

let failures = 0;
function check(name, ok, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`);
}

const SKILLS = ['commas', 'agreement', 'tense', 'proofreading', 'vocab'];
const bank = Array.from({ length: 2400 }, (_, i) => ({ id: 'q' + i, skill: SKILLS[i % 5] }));

// A pretend browser: localStorage and cookies that survive "closing the tab"
function browser() {
  const b = { ls: null, cookie: '' };
  b.io = {
    read: () => b.ls, write: s => { b.ls = s; }, clear: () => { b.ls = null; },
    readCookie: () => b.cookie, writeCookie: v => { b.cookie = v; }
  };
  return b;
}
function seeded(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function open(b, clock, seed = 7) { return new Progress({ io: b.io, now: () => clock.t, rand: seeded(seed) }); }
const clock0 = () => ({ t: Date.UTC(2026, 0, 1) });

// --- the actual bug in the old game: a miss sat behind 2399 unseen questions
{
  const b = browser(), clock = clock0();
  let p = open(b, clock);
  const q = p.next(bank, null);
  p.record(q, false);
  clock.t += 86400000;
  p = open(b, clock);                       // tomorrow, a new tab
  const first = p.next(bank, null);
  check('yesterday\'s miss is the FIRST question of the next session', first.id === q.id, `got ${first.id}, wanted ${q.id}`);
}

// --- within a session it comes back, but only after a real gap
{
  const b = browser(), clock = clock0();
  const p = open(b, clock);
  let last = p.next(bank, null);
  const missed = last;
  p.record(last, false);
  let gap = null;
  for (let i = 1; i <= 20; i++) {
    clock.t += 20000;
    last = p.next(bank, last);
    if (last.id === missed.id) { gap = i; break; }
    p.record(last, true);
  }
  check('same-session repeat comes back, after at least 4 other questions', gap >= 5 && gap <= 12, `came back as question #${gap} after the miss`);
}

// --- closing a cold case takes right answers in two different sessions
{
  const b = browser(), clock = clock0();
  let p = open(b, clock);
  const q = bank[42];
  p.record(q, false);
  check('a miss opens a cold case', p.isCold(q.id));
  clock.t += 3600000;
  p = open(b, clock);
  let r = p.record(q, true);
  check('first right answer does not close it', !r.closed && r.wins === 1 && p.isCold(q.id));
  r = p.record(q, true);
  check('a second right answer in the SAME session still does not close it', !r.closed && r.wins === 1 && p.isCold(q.id));
  const again = Array.from({ length: 30 }, () => { const n = p.next(bank, null); p.record(n, true); return n.id; });
  check('once solved this session it does not repeat again this session', !again.includes(q.id));
  clock.t += 3600000;
  p = open(b, clock);
  check('it comes back next session', p.next(bank, null).id === q.id);
  r = p.record(q, true);
  check('right again in a later session closes it', r.closed && !p.isCold(q.id) && p.store.closed === 1);
}

// --- missing it again starts over
{
  const b = browser(), clock = clock0();
  let p = open(b, clock);
  const q = bank[7];
  p.record(q, false);
  clock.t += 3600000; p = open(b, clock);
  p.record(q, true);
  clock.t += 3600000; p = open(b, clock);
  const r = p.record(q, false);
  check('a repeat miss resets progress on that case', r.repeatMiss && p.store.cold[q.id].wins === 0 && p.store.cold[q.id].n === 2);
}

// --- misses are mixed in, not a wall of them
{
  const b = browser(), clock = clock0();
  let p = open(b, clock);
  for (let i = 0; i < 12; i++) p.record(bank[i * 3], false);
  clock.t += 86400000; p = open(b, clock);
  let last = null, cold = 0; const seen = [];
  for (let i = 0; i < 12; i++) { last = p.next(bank, last); seen.push(p.isCold(last.id)); if (p.isCold(last.id)) cold++; p.record(last, true); clock.t += 15000; }
  check('old misses alternate with other questions at the start of a session', cold === 6 && seen[0] && !seen[1] && seen[2], seen.map(x => x ? 'C' : '-').join(''));
}

// --- a long session never runs dry and never crashes, with every question eventually handled
{
  const b = browser(), clock = clock0();
  const small = bank.slice(0, 25);
  let p = open(b, clock), last = null, ok = true;
  for (let i = 0; i < 400; i++) {
    const q = p.next(small, last);
    if (!q || (small.length > 1 && q === last)) { ok = false; break; }
    p.record(q, (i * 7) % 5 !== 0);
    last = q; clock.t += 40000;
    if (i % 60 === 59) { clock.t += 7200000; p = open(b, clock); }
  }
  check('never runs dry or repeats back-to-back on a small bank', ok);
}

// --- survives what browsers actually do to site data
{
  const b = browser(), clock = clock0();
  let p = open(b, clock);
  p.record(bank[1], false); p.record(bank[2], false);
  check('misses are mirrored into the cookie', b.cookie.split('|').length === 2, b.cookie);
  b.ls = null;                                     // localStorage evicted
  clock.t += 86400000; p = open(b, clock);
  check('misses survive localStorage being wiped, via the cookie', p.isCold('q1') && p.isCold('q2') && p.restoredFromCookie);

  const c = browser(); c.ls = '{not json!!'; c.cookie = 'q9';
  p = open(c, clock);
  check('corrupt save does not crash, and recovers from the cookie', p.isCold('q9'));

  const d = browser();
  p = open(d, clock);
  for (let i = 0; i < 600; i++) p.record(bank[i], false);
  check('cookie stays small enough for a browser to accept, even with 600 misses', d.cookie.length <= 3600, `${d.cookie.length} chars`);
  check('...while every miss is still kept in localStorage', p.coldCount() === 600);

  p.reset();
  check('reset clears the misses and the cookie', p.coldCount() === 0 && d.cookie === '');
}

// --- saves from the old version of the game keep working
{
  const b = browser(), clock = clock0();
  b.ls = JSON.stringify({
    items: { old1: { box: 0, due: clock.t - 1000, seen: 2, right: 1 }, old2: { box: 2, due: clock.t + 1e9, seen: 3, right: 3 } },
    skills: { vocab: { r: 4, t: 5 } }, balls: 3, total: 4
  });
  const p = open(b, clock);
  check('old saves: past misses become cold cases', p.isCold('old1') && !p.isCold('old2'));
  check('old saves: history is kept', p.store.total === 4 && p.store.skills.vocab.t === 5 && p.store.v === 2 && p.store.balls === undefined);
}

// --- a new session starts after a long gap even without reloading
{
  const b = browser(), clock = clock0();
  const p = open(b, clock), s0 = p.session;
  p.record(bank[0], true); clock.t += 60000; p.record(bank[1], true);
  const sameSession = p.session === s0;
  clock.t += 45 * 60000; p.record(bank[2], true);
  check('leaving the tab open for 45 minutes counts as a new session', sameSession && p.session === s0 + 1);
}

// --- pieces slot in at random places
{
  const b = browser(), clock = clock0();
  const p = open(b, clock, 99);
  p.store.total = 100;
  const KINDS = Track.KINDS, slots = new Set(), kinds = new Set();
  for (let g = 0; g < 40; g++) {
    p.store.cases = 3; p.newMachine();
    const m = p.machine();
    while (!m.complete) { const s = p.slotPiece(KINDS); slots.add(s.slot); kinds.add(s.piece.kind); }
  }
  check('toys land in many different gaps, not just the end', slots.size >= 8, `gaps used: ${[...slots].sort((x, y) => x - y).join(',')}`);
  check('all kinds of toys turn up', kinds.size === Object.keys(KINDS).length, `${kinds.size} kinds`);

  const b2 = browser(), p2 = open(b2, clock, 5);
  const m = p2.newMachine();
  const r = p2.slotPiece(KINDS);
  check('the flick starts from the newly slotted toy', m.playFrom === r.slot);
  check('with no right answers yet, only the starter toys are available', p2.unlocked(KINDS).every(k => KINDS[k].unlock === 0));
  p2.store.total = 3;
  check('right answers unlock more toys', p2.unlocked(KINDS).includes('zigzag') && !p2.unlocked(KINDS).includes('cannon'));
  check('tells you what is next on the ladder', p2.nextUnlock(KINDS).kind === 'seesaw' && p2.nextUnlock(KINDS).left === 1);

  m.complete = true;
  const banked = p2.slotPiece(KINDS);
  check('a right answer during the finale is banked for the next machine, not lost', banked === null && m.pending === 1);
}

process.exit(failures ? 1 : 0);
