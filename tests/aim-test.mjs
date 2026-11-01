// The two skill shots: a small cup on the good arc (land in it: three marbles) and a high ledge (land on it: rest there, fling again).
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

// a flat flick straight along the ramp does not burst the cup, and the ledge is clear of the usual arc
{
  check("a flick that drops straight down does not burst the cup", shot(5, 0, 0).ev.burst === 0);
}

// some lob lands on the ledge and rests there
{
  for (const seed of [5, 1, 2, 3, 4, 6, 7, 8]) {
  let found = null, count = 0;
  for (let vx = -4; vx <= 6 && !found; vx += 0.5) for (let vy = -9.5; vy <= -5; vy += 0.2) {
    if (Math.hypot(vx, vy) > Track.FLICK_MAX) continue;
    const r = shot(seed, vx, vy, 4);
    if (r.ev.rested) { count++; found = found || { vx, vy }; }
  }
  check(`seed ${seed}: a lob exists that comes to rest on the ledge`, !!found, found && JSON.stringify(found));
  }
}
process.exit(bad ? 1 : 0);
