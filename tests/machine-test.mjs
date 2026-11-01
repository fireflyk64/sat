// Headless chain-reaction test: random machines must run from the flick to the bell, on real physics.
//   node tests/machine-test.mjs            full suite
//   node tests/machine-test.mjs cannon     just that toy, verbose
import '../js/physics.js';
import '../js/track.js';

const KINDS = Object.keys(Track.KINDS);
const only = process.argv[2];
const rngOf = (seed) => { let s = seed * 977 + 3; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
let failures = 0;

function makeRecipe(seed, kinds) {
  return { seed, pieces: kinds.map((kind, i) => ({ id: 'p' + i, kind, seed: seed * 31 + i * 101 + 7 })) };
}

function simulate(recipe, from = 0, limit = 240) {
  const world = new Phys.World();
  const ev = { bell: 0, nudge: 0, lost: 0, kick: 0, domino: 0, toys: 0, peakSpeed: 0, moved: false };
  const track = new Track(world, recipe, {
    emit(type) {
      if (type === 'bell') ev.bell++;
      if (type === 'nudge') ev.nudge++;
      if (type === 'lost') ev.lost++;
      if (type === 'kick') ev.kick++;
      if (type === 'domino') ev.domino++;
      if (type === 'toy') ev.toys++;
    }
  });
  // settle: nothing may move before the flick (a machine must never start itself)
  for (let i = 0; i < 90; i++) { world.step(1 / 60); track.tick(1 / 60); }
  const before = ev.domino + ev.kick + ev.toys;
  const e = track.exitFor(from);
  track.startRun(from, e.dir * 4, 0);
  let steps = 0;
  while (steps < limit * 60 && (!track.run || !track.run.finished)) {
    world.step(1 / 60); track.tick(1 / 60); steps++;
    for (const b of world.bodies) if (!isFinite(b.x) || !isFinite(b.y)) return { ...ev, nan: true, steps };
    if (!track.run) track.startRun(from, track.exitFor(from).dir * 4, 0);   // a missed flick just gets another try
  }
  const total = track.sections.slice(from).reduce((n, s) => n + s.dominoes.length, 0);
  const fell = track.sections.slice(from).reduce((n, s) => n + s.dominoes.filter(d => d.userData.fell).length, 0);
  return { ...ev, selfStart: before, steps, secs: steps / 60, total, fell, finished: !!(track.run && track.run.finished) };
}

// --- 1) a brand-new machine stands perfectly still until flicked
{
  let moved = 0;
  for (let n = 0; n < 8; n++) {
    const rnd = rngOf(n + 1);
    const kinds = Array.from({ length: 10 }, () => KINDS[Math.floor(rnd() * KINDS.length)]);
    const world = new Phys.World(), track = new Track(world, makeRecipe(n + 1, kinds), { emit(t) { if (t === 'domino' || t === 'kick' || t === 'toy') moved++; } });
    for (let i = 0; i < 300; i++) { world.step(1 / 60); track.tick(1 / 60); }
  }
  const ok = moved === 0;
  if (!ok) failures++;
  if (!only) console.log(`stands still until flicked: ${moved} things moved on their own ${ok ? 'PASS' : 'FAIL'}`);
}

// --- 2) each toy on its own: flick -> toy -> dominoes -> marble -> bell
const report = {};
for (const kind of KINDS) {
  if (only && kind !== only) continue;
  const rows = [];
  for (let n = 0; n < 12; n++) {
    const r = simulate(makeRecipe(n + 11, ['dominoes', kind, 'dominoes']));
    rows.push(r);
    if (only) console.log(`  #${n} finished=${r.finished} secs=${r.secs.toFixed(1)} nudges=${r.nudge} lost=${r.lost} fell=${r.fell}/${r.total} toys=${r.toys} kicks=${r.kick}`);
  }
  const fin = rows.filter(r => r.finished).length, nudges = rows.reduce((a, r) => a + r.nudge, 0);
  const fell = rows.reduce((a, r) => a + r.fell, 0), total = rows.reduce((a, r) => a + r.total, 0);
  const secs = rows.reduce((a, r) => a + r.secs, 0) / rows.length;
  report[kind] = { fin, nudges, fell, total };
  const ok = fin === rows.length && !rows.some(r => r.nan) && fell / total > 0.8 && nudges <= rows.length;
  if (!ok) failures++;
  console.log(`${kind.padEnd(11)} bell ${fin}/${rows.length}  nudges ${String(nudges).padStart(3)}  dominoes ${fell}/${total}  ~${secs.toFixed(0)}s ${ok ? 'PASS' : 'FAIL'}`);
}

// --- 3) random full machines, in random order, played from a random slot
if (!only) {
  let fin = 0, nudges = 0, fell = 0, total = 0, secs = 0, N = 30, kicks = 0;
  for (let n = 0; n < N; n++) {
    const rnd = rngOf(n + 500);
    const count = 4 + Math.floor(rnd() * 9);
    const kinds = ['dominoes', ...Array.from({ length: count }, () => KINDS[Math.floor(rnd() * KINDS.length)])];
    const from = n % 3 === 0 ? 0 : Math.floor(rnd() * kinds.length);
    const r = simulate(makeRecipe(n + 500, kinds), from);
    if (r.finished) fin++; else console.log(`  did not finish: seed ${n + 500} from ${from}: ${kinds.join(',')}`);
    nudges += r.nudge; fell += r.fell; total += r.total; secs = Math.max(secs, r.secs); kicks += r.kick;
  }
  const ok = fin === N && fell / total > 0.85;
  if (!ok) failures++;
  console.log(`random machines: bell ${fin}/${N}, ${nudges} nudges in total, dominoes down ${fell}/${total} (${(100 * fell / total).toFixed(0)}%), ${kicks} marbles kicked, longest ${secs.toFixed(0)}s ${ok ? 'PASS' : 'FAIL'}`);
}

// --- 3b) nothing is left standing: a finished machine should look finished
if (!only) {
  let clean = 0, N = 30; const left = [];
  for (let n = 0; n < N; n++) {
    const rnd = rngOf(n + 900), count = 5 + Math.floor(rnd() * 8);
    const kinds = ['dominoes', ...Array.from({ length: count }, () => KINDS[Math.floor(rnd() * KINDS.length)])];
    const world = new Phys.World(), track = new Track(world, makeRecipe(n + 900, kinds));
    const e = track.exitFor(0);
    track.startRun(0, e.dir * 4, -1);
    let steps = 0;
    while (steps++ < 60 * 300 && !(track.run && track.run.finished)) { world.step(1 / 60); track.tick(1 / 60); if (!track.run) track.startRun(0, track.exitFor(0).dir * 4, -1); }
    for (let i = 0; i < 60 * 5; i++) { world.step(1 / 60); track.tick(1 / 60); }
    const standing = track.sections.flatMap(s => s.dominoes.filter(d => !d.userData.fell && !d.userData.dissolve).map(() => s.kind));
    if (!standing.length) clean++; else left.push(`seed ${n + 900}: ${standing.length} on ${[...new Set(standing)].join('/')}`);
  }
  const ok = clean === N;
  if (!ok) failures++;
  console.log(`every domino down within 5 seconds of the bell: ${clean}/${N} machines ${ok ? 'PASS' : 'FAIL ' + left.slice(0, 6).join('; ')}`);
}

// --- 4) any forward flick lands in the machine, however hard you pull: pulling hard must never be punished
if (!only) {
  let total = 0, missed = 0; const misses = [];
  for (const seed of [3, 8, 21, 34]) {
    for (const [from, kinds] of [[0, ['dominoes', 'pegs']], [1, ['dominoes', 'seesaw', 'cannon']], [1, ['steep', 'zigzag', 'nitro']]]) {
      for (const deg of [-20, 0, 15, 30, 45, 60, 75, 88]) {
        for (const power of [0.15, 0.4, 0.7, 1]) {
          const world = new Phys.World();
          let lost = false;
          const track = new Track(world, makeRecipe(seed, kinds), { emit(t) { if (t === 'lost') lost = true; } });
          const e = track.exitFor(from), v = power * Track.FLICK_MAX, a = deg * Math.PI / 180;
          const run = track.startRun(from, e.dir * Math.cos(a) * v, -Math.sin(a) * v);
          for (let i = 0; i < 60 * 16 && !lost && !run.engaged; i++) { world.step(1 / 60); track.tick(1 / 60); }
          total++;
          if (lost || !run.engaged) { missed++; if (misses.length < 6) misses.push(`seed ${seed} from ${from} ${deg}deg x${power}`); }
        }
      }
    }
  }
  const ok = missed === 0;
  if (!ok) failures++;
  console.log(`forward flicks that land in the machine: ${total - missed}/${total} ${ok ? 'PASS' : 'FAIL ' + misses.join(', ')}`);
}

// --- 5) rebuilding is deterministic: a recipe always gives the same machine, wherever a piece slots in
if (!only) {
  const rec = makeRecipe(77, ['dominoes', 'pegs', 'zigzag', 'cannon']);
  const shape = (r) => { const t = new Track(new Phys.World(), r); return t.sections.map(s => [s.id, s.dominoes.length, s.ramps.length].join(':')).join('|'); };
  const a = shape(rec), b = shape(rec);
  const slotted = { ...rec, pieces: [rec.pieces[0], { id: 'new', kind: 'seesaw', seed: 5 }, ...rec.pieces.slice(1)] };
  const c = shape(slotted).split('|').filter(x => !x.startsWith('new')).join('|');
  const ok = a === b && a === c;
  if (!ok) failures++;
  console.log(`same recipe, same machine (even after a new piece slots in): ${ok ? 'PASS' : 'FAIL ' + a + ' vs ' + c}`);
}

process.exit(failures ? 1 : 0);
