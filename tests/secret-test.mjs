// The secret levels: each must build clear of the machine, work with taps, and hand out its prize.
import '../js/physics.js';
import '../js/track.js';
import '../js/rewards.js';
import '../js/sand.js';
import '../js/playground.js';
let bad = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + n + (x != null ? '  (' + x + ')' : '')); if (!ok) bad++; };
const recipe = { seed: 7, pieces: ['dominoes', 'steep', 'pegs', 'seesaw'].map((kind, i) => ({ id: 'p' + i, kind, seed: 7 * 31 + i * 101 + 7 })) };
function setup(id) {
  const world = new Phys.World(), track = new Track(world, recipe); let score = 0;
  const pg = new Playground(track, id, { onScore: n => { score += n; } });
  const run = (secs) => { for (let i = 0; i < secs * 60; i++) { pg.step(1 / 60); world.step(1 / 60); track.tick(1 / 60); } };
  return { world, track, pg, run, get score() { return score; } };
}
{
  const s = setup('pachinko');
  check('the board is far enough right of the machine', s.pg.sx - 7.7 > s.track.bounds().maxX + 4, s.pg.sx.toFixed(1));
  s.run(1);
  let drops = 0;
  for (let i = 0; i < 12; i++) { s.pg.pointer(s.pg.cx + (i - 6) * 1.2, s.pg.gy - 16, true); s.run(0.05); s.pg.pointer(0, 0, false); s.run(2); drops++; }
  s.run(8);
  check('twelve marbles all settle into bins', s.pg.settled === 12 && s.pg.left === 0, `${s.pg.settled} settled`);
  check('...and the bins pay', s.score >= 12 * 20, s.score);
  // a marble straight down the middle gets through; check jackpots are possible by dropping many on the centre line
  const t = setup('pachinko'); t.run(0.5);
  for (let i = 0; i < 12; i++) { t.pg.pointer(t.pg.cx, t.pg.gy - 16, true); t.run(0.05); t.pg.pointer(0, 0, false); t.run(1.5); }
  t.run(8);
  check('dropping on the centre line can hit the jackpot', t.pg.jackpots >= 1 && !!t.pg.prize(), `${t.pg.jackpots} jackpots`);
}
{
  const s = setup('pyramid');
  const bricks = () => s.pg.own.filter(o => o.userData.kind === 'brick');
  check('the pyramid is sixteen cells, forty-eight pieces', bricks().length === 48, bricks().length);
  const st = bricks().map(b => [b.x, b.y, b.a]); s.run(4);
  const dr = Math.max(...bricks().map((b, i) => Math.hypot(b.x - st[i][0], b.y - st[i][1]) + Math.abs(b.a - st[i][2])));
  check('it stands by itself', dr < 0.05, dr.toFixed(3));
  for (let i = 0; i < 12; i++) { const side = i % 2 ? 1 : -1; s.pg.pointer(s.pg.cx + side * 9, s.pg.gy - 1.5 - (i % 3) * 1.5, true); s.run(0.05); s.pg.pointer(0, 0, false); s.run(2.5); }
  s.run(6);
  check('marbles rolled in from either side bring it down', (s.pg.felled || 0) >= 30 && !!s.pg.prize(), `${s.pg.felled} down`);
}
{
  const s = setup('cannon');
  const bricks = () => s.pg.own.filter(o => o.userData.kind === 'brick');
  check('the gallery is seven towers (18 cells, 54 pieces)', bricks().length === 3 * 18, bricks().length);
  const st = bricks().map(b => [b.x, b.y, b.a]); s.run(4);
  const dr = Math.max(...bricks().map((b, i) => Math.hypot(b.x - st[i][0], b.y - st[i][1]) + Math.abs(b.a - st[i][2])));
  check('it stands by itself', dr < 0.05, dr.toFixed(3));
  // aim at the first domino, a little above the floor
  s.pg.pointer(s.pg.cx - 3.5, s.pg.gy - 2.2, true); s.run(0.3); s.pg.pointer(s.pg.cx - 3.5, s.pg.gy - 2.2, false); s.run(14);
  check('one shot brings the towers down', (s.pg.felled || 0) >= 30 && !!s.pg.prize(), `${s.pg.felled} down`);
  s.pg.pointer(0, 0, true); s.run(0.1); s.pg.pointer(0, 0, false); s.run(1);
  check('a second shot is not allowed', s.track.marbles.filter(m => m.userData.role === 'toy').length === 1);
}
process.exit(bad ? 1 : 0);
