// Simulated play across sessions: do misses really come back, in new sessions, until they are truly learned?
import '../js/progress.js';
import '../js/track.js';
import '../js/rewards.js';

let failures = 0;
function check(name, ok, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`);
}

const SKILLS = ['commas', 'agreement', 'tense', 'proofreading', 'vocab'];
const bank = Array.from({ length: 2400 }, (_, i) => ({ id: 'q' + i, skill: SKILLS[i % 5] }));

// A pretend browser: localStorage and cookies that survive "closing the tab"
function browser() {
  const b = { ls: null, cookie: '', jar: {} };
  b.io = {
    read: () => b.ls, write: s => { b.ls = s; }, clear: () => { b.ls = null; },
    readCookie: n => n ? (b.jar[n] || '') : b.cookie, writeCookie: (v, n) => { if (n) b.jar[n] = v; else b.cookie = v; }
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

// --- Focus: the reward for studying rather than playing
{
  const fresh = (rolls = [0.99]) => {
    const b = browser(), clock = clock0(); let i = 0;
    const p = new Progress({ io: b.io, now: () => clock.t, rand: () => rolls[Math.min(i++, rolls.length - 1)] });
    return { b, clock, p };
  };
  const answer = (p, n, right = true) => { const out = []; for (let k = 0; k < n; k++) out.push(p.record(bank[(k * 7) % 2400], right)); return out; };

  let { p } = fresh();
  answer(p, 9);
  check('Focus counts correct answers', p.store.focus.count === 9 && p.store.focus.bonus === 9);
  const miss = p.record(bank[50], false);
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  check('a miss takes off a third of a point, and does not break Focus', near(p.store.focus.count, 9 - 1 / 3) && near(p.store.focus.bonus, 9 - 1 / 3) && miss.rolls.length === 0, Progress.fmt(p.store.focus.count));
  p.record(bank[51], true);
  check('thirds never drift, and show as fractions', near(p.store.focus.count, 9 + 2 / 3) && Progress.fmt(p.store.focus.count) === '9⅔' && Progress.fmt(1 / 3) === '⅓' && Progress.fmt(0) === '0' && Progress.fmt(12) === '12');
  ({ p } = fresh());
  p.record(bank[1], false);
  check('Focus never goes below zero', p.store.focus.count === 0 && p.store.focus.bonus === 0);

  // a blind guess on four choices must get nowhere
  check('the penalty makes a blind guess on four choices worth exactly nothing', near(0.25 * 1 - 0.75 * Progress.MISS_PENALTY, 0), `1/4 - 3/4 x ${Progress.MISS_PENALTY.toFixed(3)}`);
  const play = (hitRate, n, seed) => {
    const b = browser(), clock = clock0(), g = seeded(seed), dice = seeded(seed + 1);
    const q = new Progress({ io: b.io, now: () => clock.t, rand: dice });
    let rolls = 0, items = 0;
    for (let k = 0; k < n; k++) { const r = q.record(bank[k % 2400], g() < hitRate); rolls += r.rolls.length; items += r.rolls.filter(x => x.won).length; }
    return { rolls, items, count: q.store.focus.count };
  };
  let guessRolls = 0, honestRolls = 0;
  for (let k = 0; k < 10; k++) { guessRolls += play(0.25, 600, 100 + k * 7).rolls; honestRolls += play(0.8, 600, 300 + k * 7).rolls; }
  check('600 questions of pure guessing earn almost nothing next to knowing 80% of the answers', guessRolls * 8 < honestRolls, `${guessRolls / 10} rolls guessing, ${honestRolls / 10} rolls studying`);

  // no re-rolling a goal by dipping under it
  ({ p } = fresh([0.99]));
  answer(p, 10);
  const once = p.record(bank[70], false);
  const again = p.record(bank[71], true);
  check('dropping below a goal and climbing back does not roll again', near(p.store.focus.bonus, 10 + 2 / 3) && once.rolls.length === 0 && again.rolls.length === 0, Progress.fmt(p.store.focus.bonus));
  ({ p } = fresh([0.99]));
  answer(p, 9); p.record(bank[72], false);
  const cross = p.record(bank[73], true);
  check('climbing past a goal with a fraction still rolls', near(p.store.focus.bonus, 9 + 2 / 3) && cross.rolls.length === 0);
  const pass = p.record(bank[74], true);
  check('...the moment it gets there', pass.rolls.length === 1 && pass.rolls[0].tier === 'bonus', Progress.fmt(p.store.focus.bonus));

  ({ p } = fresh([0.99]));
  let r = answer(p, 10).at(-1);
  check('10 correct: a big bonus roll', r.rolls.length === 1 && r.rolls[0].tier === 'bonus' && r.rolls[0].chance === 0.33);
  check('a losing roll keeps the counter climbing', !r.rolls[0].won && p.store.focus.bonus === 10 && r.rolls[0].next === 20);
  r = answer(p, 10).at(-1);
  check('20 correct: rolls for big bonus and rare together', r.rolls.map(x => x.tier).join() === 'bonus,rare' && r.rolls[1].chance === 0.25);

  ({ p } = fresh([0.5, 0.2, 0.32, 0.0]));           // first roll loses (.5), then .2 wins the tier at 20
  answer(p, 10);
  check('0.5 loses a 33% roll', Object.keys(p.store.chest).length === 0);

  ({ p } = fresh([0.32, 0.0, 0.99]));
  r = answer(p, 10).at(-1);
  check('a win at just under the chance pays out', r.rolls[0].won && REWARDS[r.rolls[0].item].tier === 'bonus' && p.store.chest[r.rolls[0].item] === 1);
  check('winning resets that counter only', p.store.focus.bonus === 0 && p.store.focus.rare === 10 && p.store.focus.ultra === 10);
  check('...and Focus itself carries on', p.store.focus.count === 10);

  ({ p } = fresh([0.99]));
  p.store.focus = { count: 99, bonus: 9, rare: 19, ultra: 99 }; p.rand = () => 0.09;
  r = p.record(bank[1], true);
  check('100 correct: an ultra rare roll at 10%', r.rolls.some(x => x.tier === 'ultra' && x.chance === 0.1 && x.won));
  const ultraId = r.rolls.find(x => x.tier === 'ultra').item;
  check('...which pays out an ultra rare item', REWARDS[ultraId].tier === 'ultra');
  p.store.focus = { count: 99, bonus: 1, rare: 1, ultra: 99 }; p.rand = () => 0.11;
  r = p.record(bank[2], true);
  check('0.11 misses the 10% ultra roll', r.rolls.length === 1 && !r.rolls[0].won && p.store.focus.ultra === 100);

  // the odds over many rolls
  let wins = 0, N = 20000; const rnd = seeded(12345);
  for (let i = 0; i < N; i++) if (rnd() < Progress.TIERS[0].chance) wins++;
  check('chance values are what you asked for', Progress.TIERS.map(t => t.every + ':' + t.chance).join() === '10:0.33,20:0.25,100:0.1' && Math.abs(wins / N - 0.33) < 0.02, Progress.TIERS.map(t => t.every + ':' + t.chance).join(' '));

  // playing
  ({ p } = fresh([0.99]));
  answer(p, 4);
  const played = p.notePlay();
  check('playing with no freeze costs 1½ Focus, not everything', played.lost === 1.5 && p.store.focus.count === 2.5 && p.store.focus.bonus === 2.5 && p.store.focus.ultra === 2.5, Progress.fmt(p.store.focus.count));
  check('...and it can show that as a fraction', Progress.fmt(2.5) === '2½' && Progress.fmt(1.5) === '1½');
  ({ p } = fresh());
  p.record(bank[3], true);
  const small = p.notePlay();
  check('...never going below zero, and only charging what he had', p.store.focus.count === 0 && small.lost === 1);
  ({ p } = fresh([0.99]));
  answer(p, 10);
  p.store.freezes = 0;                     // those 10 in a row earned freezes, which would cover this play
  p.notePlay();
  answer(p, 1);
  check('a rolled goal stays rolled after playing, so a break cannot be used to re-roll', p.store.focus.bonus === 9.5 && p.store.focus.next.bonus === 20);
  ({ p } = fresh());
  answer(p, 3); p.record(bank[9], false); p.notePlay();
  check('misses and play costs add up without rounding drift', p.store.focus.count === Math.round((3 - 1 / 3 - 1.5) * 6) / 6, Progress.fmt(p.store.focus.count));

  // vocabulary gets extra turns
  {
    const b = browser(), clock = clock0(), z = new Progress({ io: b.io, now: () => clock.t, rand: seeded(55) });
    let last = null, vocab = 0, twice = 0, N = 600;
    for (let k = 0; k < N; k++) {
      const q = z.next(bank, last);
      if (q.skill === 'vocab') { vocab++; if (last && last.skill === 'vocab') twice++; }
      z.record(q, true); last = q; clock.t += 20000;
    }
    const share = vocab / N;
    check('vocabulary is about a third of new questions, up from a fifth of this test bank', share > 0.29 && share < 0.38, `${(share * 100).toFixed(0)}%`);
    check('...and still never comes up twice running', twice === 0);

    // which vocabulary comes up: mostly SAT-style passages, then the drill, then the earlier questions
    const levels = bank.map((q, k) => q.skill === 'vocab' ? { ...q, level: k % 3 === 0 ? 'sat' : k % 3 === 1 ? 'hard' : undefined } : q);
    const b2 = browser(), z2 = new Progress({ io: b2.io, now: () => clock.t, rand: seeded(77) }), seen = { sat: 0, hard: 0, none: 0 };
    last = null;
    for (let k = 0; k < 900; k++) { const q = z2.next(levels, last); if (q.skill === 'vocab') seen[q.level || 'none']++; z2.record(q, true); last = q; clock.t += 20000; }
    const all = seen.sat + seen.hard + seen.none;
    check('among vocabulary, SAT-style passages come up most', seen.sat / all > 0.5 && seen.sat / all < 0.7 && seen.hard > seen.none, JSON.stringify(seen));
  }

  // freezes
  ({ p } = fresh([0.99]));
  r = answer(p, 5).at(-1);
  check('5 correct in a row earns a freeze', r.freezeEarned && p.store.freezes === 1);
  const kept = p.notePlay();
  check('playing with a freeze costs no Focus and spends the freeze', kept.frozen && kept.kept === 5 && p.store.focus.count === 5 && p.store.freezes === 0);
  check('...and the counters are untouched', p.store.focus.bonus === 5 && p.store.focus.rare === 5);

  ({ p } = fresh([0.99]));
  answer(p, 15);
  check('freezes stack, with no limit', p.store.freezes === 3);
  for (let k = 0; k < 12; k++) p.record(bank[200 + k], false);
  check('they do not melt, however many questions go by', p.store.freezes === 3);
  p.notePlay(); p.notePlay();
  check('each play spends just one', p.store.freezes === 1);

  ({ p } = fresh([0.99]));
  answer(p, 4); p.record(bank[60], false); answer(p, 4);
  check('a miss breaks the "5 in a row" for a freeze', p.store.freezes === 0 && Math.abs(p.store.focus.count - (8 - 1 / 3)) < 1e-6);
  answer(p, 1);
  check('...and the next 5 in a row earns it', p.store.freezes === 1);

  // lasting until the session ends
  {
    const b = browser(), clock = clock0();
    let z = open(b, clock);
    for (let k = 0; k < 10; k++) z.record(bank[k], true);
    check('earned two freezes', z.store.freezes === 2);
    clock.t += 60000; z = open(b, clock);
    check('a quick page reload keeps them', z.store.freezes === 2);
    clock.t += 29 * 60000; z.record(bank[20], false);
    check('29 minutes away keeps them', z.store.freezes === 2);
    clock.t += 31 * 60000; z = open(b, clock);
    check('coming back after over 30 minutes: the session ended, so they are gone', z.store.freezes === 0);
    for (let k = 0; k < 5; k++) z.record(bank[30 + k], true);
    clock.t += 45 * 60000; z.record(bank[40], true);
    check('the same goes for a tab left open that long', z.store.freezes === 0 || z.store.freezes === 1 && z.store.streak % 5 === 0, z.store.freezes);
    const oldSave = browser(); oldSave.ls = JSON.stringify({ v: 2, items: {}, skills: {}, total: 9, qn: 9, cold: {}, closed: 0, streak: 6, bestStreak: 6, score: 5, bestRun: 2, cases: 0, sessions: 1, sinceCold: 1, machine: null, focus: { count: 6, bonus: 6, rare: 6, ultra: 6 }, freezes: [3, 5] });
    const up = open(oldSave, clock);
    check('saves from when freezes had a countdown carry over as a count', up.store.freezes === 2);
  }

  // the chest and its cookie
  const box = fresh([0.0, 0.0, 0.99]);
  answer(box.p, 10);
  const got = Object.keys(box.p.store.chest)[0];
  check('won items land in the chest and are remembered as found', box.p.store.chest[got] === 1 && box.p.store.found[got] === 1);
  check('the chest is saved in its own cookie', box.b.jar.lgc_chest === `${got}:1|${got}`, box.b.jar.lgc_chest);
  check('using an item takes one out', box.p.useItem(got) && box.p.store.chest[got] === 0 && !box.p.useItem(got));
  check('...and it stays found in the cookie', box.b.jar.lgc_chest === `|${got}`, box.b.jar.lgc_chest);

  const wiped = fresh([0.0, 0.0, 0.99]);
  answer(wiped.p, 10);
  const lost = Object.keys(wiped.p.store.chest)[0];
  wiped.b.ls = null;
  const back = open(wiped.b, wiped.clock);
  check('unlocks survive a wiped localStorage, via the cookie', back.store.chest[lost] === 1 && back.store.found[lost] === 1 && back.restoredChest);
  back.reset();
  check('reset clears the chest cookie too', !wiped.b.jar.lgc_chest && back.coldCount() === 0);

  const survive = browser(), clock = clock0();
  let q = open(survive, clock);
  answer(q, 7);
  clock.t += 86400000; q = open(survive, clock);
  check('Focus carries across sessions', q.store.focus.count === 7);
  const oldSave = browser(); oldSave.ls = JSON.stringify({ v: 2, items: {}, skills: {}, total: 3, qn: 3, cold: {}, closed: 0, streak: 1, bestStreak: 2, score: 5, bestRun: 2, cases: 0, sessions: 1, sinceCold: 1, machine: null });
  const up = open(oldSave, clock);
  check('saves from before this feature pick it up cleanly', up.store.focus.count === 0 && up.store.freezes === 0 && up.store.total === 3);
}

// --- storylines: tagged questions stay hidden until their unlock, then take a share of the new questions
{
  const story = Array.from({ length: 60 }, (_, i) => ({ id: 'fire' + i, skill: ['phrases', 'agreement', 'proofreading', 'commas'][i % 4], story: 'fire' }));     // (the real set mixes skills, and the game never repeats a skill twice running)
  const pool = [...bank.slice(0, 400), ...story], b = browser(), clock = clock0();
  const z = new Progress({ io: b.io, now: () => clock.t, rand: seeded(5) });
  check('the fire storyline opens at 100 right answers, the next at 400, then 800', Progress.STORY_UNLOCK.fire === 100 && Progress.STORY_UNLOCK.water === 400 && Progress.STORY_UNLOCK.breakable === 800);
  check('before then, the next storyline and how far off it is are known', z.nextStory(pool).id === 'fire' && z.nextStory(pool).left === 100 && !z.storyOpen('fire'));
  check('...but nothing is announced for a storyline whose questions are not written yet', z.nextStory(bank) === null && z.storyJustOpened(bank).length === 0);
  let last = null, leaked = 0, opened = [];
  while (z.store.total < 100) {
    const q = z.next(pool, last);
    if (q.story) leaked++;
    z.record(q, true); last = q; clock.t += 20000;
    z.storyJustOpened(pool).forEach(id => opened.push(id + '@' + z.store.total));
  }
  check('no story question comes up before the unlock', leaked === 0, `${leaked} came up`);
  check('the 100th right answer is the one that opens it, exactly once', opened.join() === 'fire@100', opened.join());
  check('after that the next storyline is the water section', z.nextStory().id === 'water' && z.nextStory().left === 300 && z.storyOpen('fire') && z.nextStory(pool) === null);
  let fromStory = 0, fresh = 0;
  for (let k = 0; k < 100; k++) {
    const q = z.next(pool, last), isNew = !z.store.items[q.id];
    if (isNew) { fresh++; if (q.story) fromStory++; }
    z.record(q, true); last = q; clock.t += 20000;
  }
  check('once open, about 40% of the new questions he is given are story questions', fromStory / fresh > 0.3 && fromStory / fresh < 0.5, `${fromStory} of ${fresh} new`);
  let more = 0; for (let k = 0; k < 600; k++) { const q = z.next(pool, last); if (q.story) more++; z.record(q, true); last = q; clock.t += 20000; }
  const met = pool.filter(q => q.story && z.store.items[q.id]).length;
  check('every story question gets its turn eventually', met === 60, `${met} of 60`);
  const lock = open(browser(), clock0(), 3);
  check('and a fresh player never sees one', Array.from({ length: 80 }, () => { const q = lock.next(pool, null); lock.record(q, true); return q; }).every(q => !q.story));
}

process.exit(failures ? 1 : 0);
