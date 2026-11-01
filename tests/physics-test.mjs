// Headless physics test: dominoes stand still, a ball topples them, and a ball finishes mixed random contraptions.
import '../js/physics.js';
import '../js/track.js';
const KINDS = ['dominoes', 'pegs', 'steep'];
let failures = 0;

// 1) every piece combination: dominoes stand, nothing explodes
{
  const world = new Phys.World(), track = new Track(world, 7);
  const rnd = (() => { let s = 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 24; i++) track.addSection(0, { dir: rnd() < 0.5 ? 1 : -1, kind: KINDS[Math.floor(rnd() * 3)] });
  for (let t = 0; t < 240; t++) world.step(1 / 60);
  const doms = track.sections.flatMap(s => s.dominoes);
  const tilt = d => Math.abs(d.a - track.sections[d.userData.section].a);
  const standing = doms.filter(d => tilt(d) < 0.05).length;
  const ok = standing === doms.length;
  if (!ok) failures++;
  console.log(`stability: ${standing}/${doms.length} dominoes standing across 24 mixed pieces ${ok ? 'PASS' : 'FAIL'}`);
}

// 2) a ball finishes random mixed contraptions (the game nudges stalled balls; allow a few % stalls here)
let done = 0, N = 40, stalled = [];
for (let n = 0; n < N; n++) {
  let s = n * 977 + 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const world = new Phys.World(), track = new Track(world, n + 100);
  const count = 3 + Math.floor(rnd() * 8);
  for (let i = 0; i < count; i++) track.addSection(0, { dir: rnd() < 0.5 ? 1 : -1, kind: KINDS[Math.floor(rnd() * 3)] });
  for (let t = 0; t < 60; t++) world.step(1 / 60);
  const ball = track.spawnBall(0); let still = 0, ok = false;
  for (let t = 0; t < 60 * 120; t++) {
    world.step(1 / 60);
    still = Math.hypot(ball.vx, ball.vy) < 0.1 ? still + 1 : 0;
    if (ball.y > track.bottomY() - 0.7) { ok = true; break; }
    if (!isFinite(ball.x)) break;
    if (still > 240) break;
  }
  if (ok) done++; else stalled.push(`#${n}(${count} pieces)`);
}
const pass = done >= N * 0.85;
if (!pass) failures++;
console.log(`ball reached the floor on ${done}/${N} random contraptions ${pass ? 'PASS' : 'FAIL'}${stalled.length ? ' stalled: ' + stalled.join(' ') : ''}`);
process.exit(failures ? 1 : 0);
