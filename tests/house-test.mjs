// The domino house (rare) and the Architect (ultra): a house must stand on its own, and come down when it is hit.
import '../js/physics.js';
import '../js/track.js';
import '../js/rewards.js';
import '../js/sand.js';
import '../js/playground.js';
let bad = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + n + (x != null ? '  (' + x + ')' : '')); if (!ok) bad++; };
const recipe = { seed: 7, pieces: ['dominoes', 'steep', 'pegs'].map((kind, i) => ({ id: 'p' + i, kind, seed: 7 * 31 + i * 101 + 7 })) };
function setup(id) {
  const world = new Phys.World(), track = new Track(world, recipe);
  const b = track.bounds(); let score = 0;
  const pg = new Playground(track, id, { view: () => ({ x0: b.minX, y0: b.minY, x1: b.maxX, y1: b.minY + 40 }), onScore: n => { score += n; } });
  const run = (secs) => { for (let i = 0; i < secs * 60; i++) { pg.step(1 / 60); world.step(1 / 60); track.tick(1 / 60); } };
  return { world, track, pg, run, b, get score() { return score; } };
}
const bricks = pg => pg.own.filter(o => o.userData.kind === 'brick');

// rare house
{
  const s = setup('house'), cx = (s.b.minX + s.b.maxX) / 2;
  s.pg.pointer(cx, s.track.floor.y - 3, true); s.run(0.05); s.pg.pointer(cx, s.track.floor.y - 3, false); s.run(0.05);
  const n = bricks(s.pg).length;
  check('one tap sets down a house of 7 cells (21 pieces)', n === 21, n);
  const start = bricks(s.pg).map(b => [b.x, b.y, b.a]);
  s.run(4);
  const drift = Math.max(...bricks(s.pg).map((b, i) => Math.hypot(b.x - start[i][0], b.y - start[i][1]) + Math.abs(b.a - start[i][2])));
  check('the house stands by itself for four seconds', drift < 0.05, drift.toFixed(3));
  // a second house dropped on the first builds higher, not through it
  {
    const t = setup('house'); const x = (t.b.minX + t.b.maxX) / 2, y = t.track.floor.y - 3;
    const tapAt = () => { t.pg.pointer(x, y, true); t.run(0.05); t.pg.pointer(x, y, false); t.run(0.05); };
    tapAt(); const top1 = Math.min(...bricks(t.pg).map(b => b.y)); tapAt();
    const top2 = Math.min(...bricks(t.pg).map(b => b.y));
    check('a house dropped on another builds higher (42 pieces, taller)', bricks(t.pg).length === 42 && top2 < top1 - 3, `${top1.toFixed(1)} -> ${top2.toFixed(1)}`);
    const st = bricks(t.pg).map(b => [b.x, b.y, b.a]); t.run(4);
    const dr = Math.max(...bricks(t.pg).map((b, i) => Math.hypot(b.x - st[i][0], b.y - st[i][1]) + Math.abs(b.a - st[i][2])));
    check('...and the double house stands', dr < 0.05, dr.toFixed(3));
  }
  s.pg.pointer(0, 0, false);
  s.pg.pointer(cx - 12, s.track.floor.y - 7, true); s.run(0.05); s.pg.pointer(cx - 12, s.track.floor.y - 7, false); s.run(0.05);   // second house
  s.pg.pointer(cx + 6, s.track.floor.y - 2, true); s.run(0.05); s.pg.pointer(cx + 6, s.track.floor.y - 2, false); s.run(0.05);   // now a ball, rolled in from the right
  s.run(6);
  check('...and a marble brings pieces down, which pays', (s.pg.felled || 0) > 4 && s.score > 0, `${s.pg.felled} down, score ${s.score}`);
}

// the Architect
{
  const s = setup('architect'), cx = (s.b.minX + s.b.maxX) / 2, gy = s.track.floor.y - 0.5;
  const tap = (x, y) => { s.pg.pointer(x, y, true); s.run(0.1); s.pg.pointer(x, y, false); s.run(0.05); };
  const x0 = s.pg.gridX + 3.5 * 1.7;
  tap(x0, gy - 0.5); tap(x0, gy - 2.5); tap(x0, gy - 4);
  check('three taps on one column build three storeys', bricks(s.pg).length === 9, bricks(s.pg).length);
  tap(x0 + 1.7, gy - 0.5); tap(x0 + 1.7, gy - 2.5);
  check('a neighbouring column grows beside it', bricks(s.pg).length === 15);
  const st = bricks(s.pg).map(b => [b.x, b.y, b.a]);
  s.run(4);
  const drift = Math.max(...bricks(s.pg).map((b, i) => Math.hypot(b.x - st[i][0], b.y - st[i][1]) + Math.abs(b.a - st[i][2])));
  check('the design stands by itself', drift < 0.05, drift.toFixed(3));
  tap(x0, gy - 2.3);      // tap a piece that is there: take it away
  check('tapping a cell that is there removes it', bricks(s.pg).length === 12, bricks(s.pg).length);
  s.run(3);
  check('...and what stood on it falls', (s.pg.felled || 0) >= 2, s.pg.felled);
  // hold to drop a ball
  s.pg.pointer(x0 + 9, gy - 2, true); s.run(0.8); s.pg.pointer(x0 + 9, gy - 2, false);
  check('holding rolls a marble in (and does not add a piece)', s.track.marbles.some(o => o.userData.role === 'toy' && o.userData.live) && bricks(s.pg).length <= 12);
  s.run(5);
  check('no piece blew up', s.world.bodies.every(b => isFinite(b.x) && isFinite(b.y) && isFinite(b.a)));
}
process.exit(bad ? 1 : 0);
