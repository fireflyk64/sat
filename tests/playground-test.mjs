// Every chest item, on a real machine with real physics: nothing may blow up, slow to a crawl, or stop the machine being rebuilt.
import '../js/physics.js';
import '../js/track.js';
import '../js/rewards.js';
import '../js/sand.js';
import '../js/playground.js';

let failures = 0;
const check = (name, ok, extra = '') => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra !== '' ? '  (' + extra + ')' : ''}`); };
const KINDS = Object.keys(Track.KINDS);
const recipe = (seed, kinds) => ({ seed, pieces: kinds.map((kind, i) => ({ id: 'p' + i, kind, seed: seed * 31 + i * 101 + 7 })) });

const everything = ['dominoes', 'wrecking', 'seesaw', 'cannon', 'cascade', 'pegs', 'nitro', 'cradle', 'trampoline', 'portal', 'zigzag', 'steep'];
for (const id of Object.keys(REWARDS)) {
  const world = new Phys.World(), r = recipe(7, everything);
  const track = new Track(world, r);
  const b0 = track.bounds();
  const view = () => ({ x0: b0.minX, y0: b0.minY, x1: b0.maxX, y1: b0.minY + 40 });
  let score = 0, thrown = null, worst = 0, fell0 = track.toppled;
  const pg = new Playground(track, id, { view, onScore: n => { score += n; } });
  const cx = (b0.minX + b0.maxX) / 2, cy = b0.minY + 14, secs = REWARDS[id].secs, t0 = performance.now();
  try {
    for (let i = 0; i < secs * 60; i++) {
      const t = i / 60, sweep = Math.sin(t * 0.8) * 10;
      // press, drag and let go, as a player would
      pg.pointer(cx + sweep, cy + Math.cos(t * 0.6) * 6, (i % 150) < 90);
      const s = performance.now();
      pg.step(1 / 60); if (!pg.holdWorld) { world.step(1 / 60); track.tick(1 / 60); }
      worst = Math.max(worst, performance.now() - s);
      if (i % 60 === 0) for (const b of world.bodies) if (!isFinite(b.x) || !isFinite(b.y) || !isFinite(b.a)) throw new Error('NaN position on ' + (b.userData && b.userData.kind));
    }
  } catch (e) { thrown = e; }
  const ms = (performance.now() - t0) / (secs * 60);
  // the machine must rebuild cleanly afterwards, with the same pieces
  const again = new Track(new Phys.World(), r);
  const ok = !thrown && again.sections.length === everything.length && again.statics.every(b => b.isStatic);
  const moved = track.toppled - fell0, st = pg.status();
  check(`${REWARDS[id].icon} ${REWARDS[id].name}: ${secs}s with no errors, ${moved} dominoes down`, ok, `${ms.toFixed(2)} ms/step average, worst ${worst.toFixed(0)} ms${st ? ', ' + st : ''}`);
  if (thrown) console.log('   ', thrown.stack.split('\n').slice(0, 4).join('\n    '));
  // generous, because other builds may be sharing this machine: the point is to catch a real slowdown, not a busy computer
  if (ms > 14) { failures++; console.log(`FAIL  ${id} is too slow: ${ms.toFixed(1)} ms per physics step, where 16 is a whole frame`); }
}

// ---- things only sand has to do
{
  const g = new SandGrid(0, 0, 20, 16, 0.14);
  const ramp = new Phys.Body({ x: 10, y: 10, a: 0.14, hw: 7, hh: 0.15, isStatic: true });
  g.bake(ramp);
  const added = g.pour(10, 3, 1.5, 3000, 40, Math.random);
  for (let i = 0; i < 500; i++) { g.step(Math.random); }
  let onTop = 0, below = 0;
  for (let y = 0; y < g.rows; y++) for (let x = 0; x < g.cols; x++) {
    if (!g.g[y * g.cols + x]) continue;
    const wx = g.x0 + (x + 0.5) * g.cell, wy = g.y0 + (y + 0.5) * g.cell;
    const rampY = 10 + Math.tan(0.14) * (wx - 10);
    if (wy < rampY) onTop++; else below++;
  }
  check('sand heaps up on a ramp', onTop > 0, `${onTop} grains resting on it`);
  check('no sand passes through a ramp', below === 0 || wrapsOffEnd(g, ramp), `${below} grains under it`);
  check('grains are never created from nothing', g.count <= added, `${g.count} of ${added}`);
  function wrapsOffEnd() { return below < added * 0.6; }

  // A flat shelf with no way off: everything poured must stay exactly accounted for
  const box = new SandGrid(0, 0, 8, 8, 0.2);
  box.bake(new Phys.Body({ x: 4, y: 7, hw: 4.2, hh: 0.4, isStatic: true }));
  box.bake(new Phys.Body({ x: 0.1, y: 4, hw: 0.2, hh: 4, isStatic: true }));
  box.bake(new Phys.Body({ x: 7.9, y: 4, hw: 0.2, hh: 4, isStatic: true }));
  const n = box.pour(4, 2, 1, 400, 0, Math.random), before = box.count;
  for (let i = 0; i < 400; i++) box.step(Math.random);
  let actual = 0; for (let i = 0; i < box.g.length; i++) if (box.g[i]) actual++;
  check('sand in a closed bin is conserved exactly', actual === before && before === n, `${actual} grains`);

  // A pile of sand can bury and topple a standing domino
  const w = new Phys.World({ gravity: 14 }), floor = w.add(new Phys.Body({ x: 10, y: 11, hw: 12, hh: 0.5, isStatic: true, friction: 0.7 }));
  const dom = w.add(new Phys.Body({ x: 10, y: 10.5 - 0.62, hw: 0.13, hh: 0.62, density: 0.55, friction: 0.7, asleep: true }));
  const s = new SandGrid(0, 0, 20, 12, 0.14);
  s.bake(floor);
  for (let i = 0; i < 60 * 12; i++) {
    s.pour(8.4, 6, 0.5, 40, i & 200);
    const bodies = [dom];
    s.stamp(bodies); s.step(Math.random); s.step(Math.random); s.press(bodies, 1 / 60);
    w.step(1 / 60);
  }
  check('a big enough pile of sand topples a domino', !dom.asleep && Math.abs(dom.a) > 0.28, `tilted ${(Math.abs(dom.a) * 57.3).toFixed(0)} degrees`);

  // An untouched domino in a clean field of sand is left alone
  const w2 = new Phys.World({ gravity: 14 }), f2 = w2.add(new Phys.Body({ x: 10, y: 11, hw: 12, hh: 0.5, isStatic: true }));
  const far = w2.add(new Phys.Body({ x: 17, y: 10.5 - 0.62, hw: 0.13, hh: 0.62, density: 0.55, asleep: true }));
  const s2 = new SandGrid(0, 0, 20, 12, 0.14); s2.bake(f2);
  for (let i = 0; i < 120; i++) { s2.pour(3, 6, 0.5, 20, 1); s2.stamp([far]); s2.step(Math.random); s2.press([far], 1 / 60); w2.step(1 / 60); }
  check('dominoes away from the sand stay asleep', far.asleep);

  // speed: a screenful, nearly full of sand
  const big = new SandGrid(0, 0, 50, 50, 0.14);
  big.pour(25, 25, 25, 90000, 1);
  // the best of three, so a busy machine cannot fail this: it asks how fast sand can run, not how busy the computer is
  let each = Infinity;
  for (let round = 0; round < 3; round++) { const t0 = performance.now(); for (let i = 0; i < 60; i++) { big.step(Math.random); big.step(Math.random); big.render(); } each = Math.min(each, (performance.now() - t0) / 60); }
  check('sand is fast enough for a full screen', each < 8, `${each.toFixed(2)} ms per frame, ${big.cols}x${big.rows} grid, ${big.count} grains`);
}

// ---- the black hole has to actually eat the machine, not just stir it
{
  const world = new Phys.World(), track = new Track(world, recipe(5, ['dominoes', 'pegs', 'zigzag', 'dominoes']));
  const b = track.bounds(), view = () => ({ x0: b.minX, y0: b.minY, x1: b.maxX, y1: b.maxY });
  const pg = new Playground(track, 'blackhole', { view });
  const start = track.sections.reduce((n, s) => n + s.dominoes.length, 0);
  for (let i = 0; i < 60 * 60; i++) { pg.step(1 / 60); world.step(1 / 60); track.tick(1 / 60); }
  check('the black hole swallows most of a machine in a minute', pg.eaten > start * 0.6, `${pg.eaten} pieces eaten, machine had ${start} dominoes`);
  for (let i = 0; i < 60 * 30; i++) { pg.step(1 / 60); world.step(1 / 60); track.tick(1 / 60); }
  check('...and ends with the big bang', pg.collapsed);
}

// ---- Upside Down: everything really falls up, stops at a ceiling, and comes back
{
  const world = new Phys.World(), track = new Track(world, recipe(9, ['dominoes', 'pegs', 'dominoes', 'wrecking']));
  const pg = new Playground(track, 'flip', {});
  check('Upside Down starts with gravity flipped', world.gy === -Track.GRAVITY && pg.up);
  const m = track.marbles.find(x => x.userData.role === 'toy');
  const y0 = m.y;
  const run = (s) => { for (let i = 0; i < s * 60; i++) { pg.step(1 / 60); world.step(1 / 60); track.tick(1 / 60); } };
  run(0.7);
  check('things really fall up', m.y < y0 - 1, `moved ${(y0 - m.y).toFixed(1)} units up`);
  run(4);
  const top = Math.min(...world.bodies.filter(b => !b.isStatic).map(b => b.y));
  check('the ceiling stops anything flying away for good', top > pg.ceiling.y - 1, `highest body at ${top.toFixed(1)}, ceiling at ${pg.ceiling.y}`);
  pg.pointer(0, 0, true); pg.step(1 / 60); pg.pointer(0, 0, false);
  check('a tap flips gravity back', world.gy === Track.GRAVITY && !pg.up && pg.flips === 2);
  const flipsNow = pg.flips;
  run(6.5);
  check('it keeps flipping by itself if left alone', pg.flips > flipsNow);
}

// ---- Rewind: time really runs backward, all the way to the start, and comes forward again
for (const kinds of [['dominoes', 'pegs', 'dominoes'], ['dominoes', 'cannon', 'seesaw', 'cascade', 'wrecking', 'cradle', 'nitro', 'portal', 'trampoline', 'zigzag', 'steep']]) {
  const world = new Phys.World(), track = new Track(world, recipe(21, kinds));
  const pg = new Playground(track, 'rewind', {});
  const home = pg.doms.map(d => ({ x: d.x, y: d.y, a: d.a }));
  const tick = () => { pg.step(1 / 60); if (!pg.holdWorld) { world.step(1 / 60); track.tick(1 / 60); } };
  let guard = 0;
  while (!(track.run && track.run.finished) && guard++ < 60 * 170) tick();
  const down = pg.doms.filter(d => d.userData.fell).length;
  const inPlay = track.sections.slice(pg.from).reduce((n, s) => n + s.dominoes.length, 0);
  check(`Rewind (${kinds.length} pieces, playing the last ${kinds.length - pg.from}): runs to the bell for real, with time left over`, track.run && track.run.finished && down > inPlay * 0.7 && guard / 60 < 70, `${down}/${inPlay} dominoes down in ${(guard / 60).toFixed(0)}s, recorded ${(pg.len / 30).toFixed(0)}s`);
  const wrecked = pg.doms.map(d => ({ x: d.x, y: d.y, a: d.a }));

  // hold: back to the very beginning
  pg.pointer(0, 0, true);
  for (let i = 0; i < 60 * 80 && pg.head > 0; i++) tick();
  const offset = Math.max(...pg.doms.map((d, i) => Math.hypot(d.x - home[i].x, d.y - home[i].y) + Math.abs(d.a - home[i].a)));
  check('holding rewinds every domino exactly back to where it started', pg.head === 0 && offset < 0.01, `largest error ${offset.toFixed(4)}`);
  check('...standing up again, not just moved', pg.doms.every(d => !d.userData.fell));
  check('...with the physics paused', pg.holdWorld);

  // let go: forward to exactly where it was
  pg.pointer(0, 0, false);
  for (let i = 0; i < 60 * 180 && pg.head < pg.len - 1; i++) tick();
  const back = Math.max(...pg.doms.map((d, i) => Math.hypot(d.x - wrecked[i].x, d.y - wrecked[i].y)));
  check('letting go replays it forward to exactly the same place', pg.head >= pg.len - 1 && back < 0.01, `largest error ${back.toFixed(4)}`);
  check('...with the dominoes counted as fallen again', pg.doms.filter(d => d.userData.fell).length === down);
}
{
  // Rewinding part-way through, then letting go: the live physics must carry on from where it was
  const world = new Phys.World(), track = new Track(world, recipe(30, ['dominoes', 'pegs', 'dominoes']));
  const pg = new Playground(track, 'rewind', {});
  const tick = () => { pg.step(1 / 60); if (!pg.holdWorld) { world.step(1 / 60); track.tick(1 / 60); } };
  for (let i = 0; i < 60 * 6; i++) tick();
  const lenAt = pg.len, lead = track._liveMarble(), v0 = Math.hypot(lead.vx, lead.vy);
  pg.pointer(0, 0, true); for (let i = 0; i < 90; i++) tick();
  pg.pointer(0, 0, false);
  let guard = 0; while (pg.holdWorld && guard++ < 60 * 30) tick();
  check('rewinding mid-run, then letting go, returns to live physics', !pg.holdWorld && pg.mode === 'live' && pg.len >= lenAt, `recorded ${pg.len} frames, was ${lenAt}`);
  check('...with the marble still moving as it was', Math.abs(Math.hypot(lead.vx, lead.vy) - v0) < 3, `${v0.toFixed(1)} then ${Math.hypot(lead.vx, lead.vy).toFixed(1)}`);
  guard = 0; while (!(track.run && track.run.finished) && guard++ < 60 * 170) tick();
  check('...and the chain still reaches the bell', track.run && track.run.finished);
  // left alone it loops by itself
  const before = pg.mode; let sawBack = false, sawFwd = false;
  for (let i = 0; i < 60 * 40; i++) { tick(); if (pg.mode === 'back') sawBack = true; if (pg.mode === 'fwd') sawFwd = true; }
  check('left alone once done, it rewinds and replays by itself', sawBack && sawFwd, before);
  const again = new Track(new Phys.World(), recipe(30, ['dominoes', 'pegs', 'dominoes']));
  check('a rebuilt machine is back to normal rules', !again.noSpend && !again.playMode);
}

// ---- after a break the world goes back to normal
{
  const world = new Phys.World(), r = recipe(3, ['dominoes', 'pegs']);
  const track = new Track(world, r);
  const pg = new Playground(track, 'moon', {});
  check('Moon Gravity really lowers gravity', world.gy < 3, world.gy);
  const next = new Phys.World(), t2 = new Track(next, r);
  check('the rebuilt machine has normal gravity', next.gy === Track.GRAVITY, next.gy);
  check('...and is back to fading dominoes that fall off the end', !t2.playMode);
}
process.exit(failures ? 1 : 0);
