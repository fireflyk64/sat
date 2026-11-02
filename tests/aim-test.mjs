// The two skill shots: a small cup on the good arc (land in it: three marbles) and distant resting baskets (land in one: rest there, fling again).
//   node tests/aim-test.mjs [-v]
import '../js/physics.js';
import '../js/track.js';
let bad = 0;
const check = (name, ok, extra) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + name + (extra ? '  (' + extra + ')' : '')); if (!ok) bad++; };
const recipe = (seed) => ({ seed, pieces: [0, 1, 2].map(i => ({ id: 'p' + i, kind: 'dominoes', seed: seed * 31 + i * 101 + 7 })) });

function shot(seed, vx, vy, secs = 6) {
  const world = new Phys.World(), ev = { burst: 0, rested: 0, lost: 0, engaged: 0 };
  const track = new Track(world, recipe(seed), { emit(t) { if (ev[t] != null) ev[t]++; } });
  for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
  track.placeStars(0);
  const F = track.exitFor(0).dir;
  track.startRun(0, F * vx, vy);
  for (let i = 0; i < secs * 60; i++) { world.step(1 / 60); track.tick(1 / 60); track.collectStars(); track.collectCup(); }
  return { ev, track, marbles: track.marbles.length };
}

// the ideal arc (what the stars follow) bursts at the cup
for (const seed of [5, 1, 2, 3, 4, 6, 7, 8]) {
  const world = new Phys.World(), track = new Track(world, recipe(seed), { emit() {} });
  for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
  track.placeStars(0);
  const m = track.exitFor(0).marble, T = 1.05, ramp = track.sections[0].ramps[0];
  const lp = ramp.at(Math.min(ramp.L - 1, (ramp.gap || 2) * 0.6 + 1), Track.BALL_R);
  const vx = (lp.x - m.x) / T, vy = (lp.y - m.y) / T - 0.5 * Track.GRAVITY * T, F = track.exitFor(0).dir;
  let burst = 0, w2 = new Phys.World(), t2 = new Track(w2, recipe(seed), { emit(t) { if (t === 'burst') burst++; } });
  for (let i = 0; i < 60; i++) { w2.step(1 / 60); t2.tick(1 / 60); }
  t2.placeStars(0); t2.startRun(0, vx, vy);
  const before = t2.marbles.length;
  for (let i = 0; i < 300; i++) { w2.step(1 / 60); t2.tick(1 / 60); t2.collectStars(); t2.collectCup(); }
  check(`seed ${seed}: the good arc passes through the cup and bursts it into three marbles`, burst === 1, `burst ${burst}`);
  
  if (burst) check(`seed ${seed}: ...with two new small, live marbles`, t2.marbles.filter(x => x.userData.role === 'burst').length === 2);
}

// a flat flick does not burst the cup
{
  check("a flick that drops straight down does not burst the cup", shot(5, 0, 0).ev.burst === 0);
}

// resting baskets: a few, far from the start and off to the sides, each reachable only by a near-full-strength lob
for (const seed of [5, 1, 2, 3, 4, 6, 7, 8]) {
  const world = new Phys.World(), ev = { rested: 0, lost: 0 };
  const track = new Track(world, recipe(seed), { emit(t) { if (ev[t] != null) ev[t]++; } });
  for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
  const t0 = performance.now(); track.placeStars(0); const ms = performance.now() - t0;
  const m = track.exitFor(0).marble, n = track.rests.length;
  check(`seed ${seed}: one to three resting baskets, all well away from the start`, n >= 1 && n <= 3 && track.rests.every(R => Math.hypot(R.x - m.x, R.y - m.y) >= 4.5), `${n} baskets, placed in ${ms.toFixed(0)} ms`);
  let landed = 0;
  for (const R of track.rests) {
    const w2 = new Phys.World(); let got = 0;
    const t2 = new Track(w2, recipe(seed), { emit(t) { if (t === 'rested') got++; } });
    for (let i = 0; i < 60; i++) { w2.step(1 / 60); t2.tick(1 / 60); }
    t2.placeStars(0);
    const R2 = t2.rests.find(q => Math.abs(q.x - R.x) < 0.01 && Math.abs(q.y - R.y) < 0.01);
    if (!R2) continue;
    t2.startRun(0, R2.shot.vx, R2.shot.vy);
    for (let i = 0; i < 300 && !got; i++) { w2.step(1 / 60); t2.tick(1 / 60); }
    if (got) landed++;
  }
  check(`seed ${seed}: the planned lob comes to rest in each basket`, landed === n && n > 0, `${landed} of ${n}`);
}

// the secret basket: it appears clear of the machine, and a sling can drop the marble into it
{
  for (const seed of [5, 1, 2, 3, 4, 6]) {
    const mk = () => { const world = new Phys.World(), ev = { secret: 0, lost: 0 }; const track = new Track(world, recipe(seed), { emit(t) { if (ev[t] != null) ev[t]++; } }); track.secretKind = 'pachinko'; for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); } track.placeStars(0); return { world, ev, track }; };
    const { track } = mk();
    if (!track.basket) { check(`seed ${seed}: a basket is placed`, false); continue; }
    const m = track.exitFor(0).marble, F = track.exitFor(0).dir;
    let found = null;
    { const s = mk(); const sh = s.track.basket.shot; s.track.startRun(0, sh.vx, sh.vy);
      for (let i = 0; i < 300; i++) { s.world.step(1 / 60); s.track.tick(1 / 60); s.track.collectBasket(); if (s.ev.secret) break; }
      if (s.ev.secret) found = { vx: +sh.vx.toFixed(2), vy: +sh.vy.toFixed(2) }; }
    check(`seed ${seed}: a basket is placed (${(track.basket.x - m.x).toFixed(1)}, ${(track.basket.y - m.y).toFixed(1)} from the marble) and a sling can land in it`, !!found, found && JSON.stringify(found));
  }
}
process.exit(bad ? 1 : 0);
