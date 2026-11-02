// The Fork: a flat flick takes the low road, a lob that clears the little wall lands the high road, and both reach the bell.
import '../js/physics.js';
import '../js/track.js';
let bad = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + n + (x != null ? '  (' + x + ')' : '')); if (!ok) bad++; };
function shot(seed, vx, vy, secs) {
  const world = new Phys.World(), ev = { bell: 0, branch: 0 };
  const track = new Track(world, { seed, pieces: [{ id: 'a', kind: 'fork', seed: seed * 7 + 1 }, { id: 'b', kind: 'dominoes', seed: seed * 7 + 2 }] }, { emit(t) { if (ev[t] != null) ev[t]++; } });
  for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
  const F = track.exitFor(0).dir;
  track.startRun(0, F * vx, vy);
  let retries = 0;
  for (let i = 0; i < secs * 60; i++) {
    world.step(1 / 60); track.tick(1 / 60);
    if (!track.run && ev.bell === 0) { retries++; break; }      // a miss: respawned, we only want clean first flicks
  }
  return { ...ev, high: !!(track.run && track.run.high) || ev.branch > 0, missed: retries > 0 };
}
for (const seed of [1, 2, 3, 4, 5, 6]) {
  const low = shot(seed, 4, 0, 45);
  check(`seed ${seed}: a flat flick takes the low road to the bell`, low.bell === 1 && !low.high && low.branch === 0, JSON.stringify(low));
  let found = null;
  for (let vx = 2; vx <= 8 && !found; vx += 0.5) for (let vy = -9.5; vy <= -3; vy += 0.5) {
    if (Math.hypot(vx, vy) > Track.FLICK_MAX) continue;
    const r = shot(seed, vx, vy, 45);
    if (r.branch && r.bell === 1) { found = { vx, vy }; break; }
  }
  check(`seed ${seed}: some lob takes the high road and still reaches the bell`, !!found, found && JSON.stringify(found));
}

// a cup burst at the fork sends the extra marbles down both roads: one takes the high road while the main marble takes the low
for (const seed of [1, 2, 3, 4, 5, 6]) {
  const world = new Phys.World(), ev = { branch: [], burst: 0, bell: 0 };
  const track = new Track(world, { seed, pieces: [{ id: 'a', kind: 'fork', seed: seed * 7 + 1 }, { id: 'b', kind: 'dominoes', seed: seed * 7 + 2 }] }, { emit(t, d) { if (t === 'branch') ev.branch.push(d); if (t === 'burst') ev.burst++; if (t === 'bell') ev.bell++; } });
  for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
  track.placeStars(0);
  const m = track.exitFor(0).marble, T = 1.05, ramp = track.sections[0].ramps[0];
  const lp = ramp.at(Math.min(ramp.L - 1, (ramp.gap || 2) * 0.6 + 1), Track.BALL_R);
  track.startRun(0, (lp.x - m.x) / T, (lp.y - m.y) / T - 0.5 * Track.GRAVITY * T);
  for (let i = 0; i < 40 * 60; i++) { world.step(1 / 60); track.tick(1 / 60); track.collectStars(); track.collectCup(); }
  const high = ev.branch.filter(b => b.burst).length;
  check(`seed ${seed}: the cup bursts at the fork, an extra marble takes the high road, and the main marble still rings the bell`, ev.burst === 1 && high >= 1 && ev.bell === 1, `burst ${ev.burst}, high-road burst marbles ${high}, bell ${ev.bell}`);
}

// marbles that arrive down the chain are routed by the level's seed: low, high, or taking turns
for (const route of ['low', 'high', 'split']) {
  for (const seed of [1, 2, 3, 4]) {
    const world = new Phys.World(), ev = { routed: 0, branch: 0, bell: 0 };
    const track = new Track(world, { seed, pieces: [{ id: 'a', kind: 'dominoes', seed: seed * 7 }, { id: 'b', kind: 'fork', seed: seed * 7 + 1, route }, { id: 'c', kind: 'dominoes', seed: seed * 7 + 2 }] }, { emit(t) { if (ev[t] != null) ev[t]++; } });
    for (let i = 0; i < 60; i++) { world.step(1 / 60); track.tick(1 / 60); }
    track.startRun(0, track.exitFor(0).dir * 4, 0);
    for (let i = 0; i < 70 * 60; i++) { world.step(1 / 60); track.tick(1 / 60); if (!track.run && !ev.bell) track.startRun(0, track.exitFor(0).dir * 4, 0); if (ev.bell) break; }
    const want = route === 'low' ? ev.routed === 0 && ev.branch === 0 : ev.routed === 1 && ev.branch === 1;
    check(`seed ${seed}, route ${route}: the arriving marble ${route === 'low' ? 'stays on the low road' : 'is sent up to the high road and lands there'}, and the chain reaches the bell`, want && ev.bell === 1, JSON.stringify(ev));
  }
}
process.exit(bad ? 1 : 0);
