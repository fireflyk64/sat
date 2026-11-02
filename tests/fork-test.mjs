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
process.exit(bad ? 1 : 0);
