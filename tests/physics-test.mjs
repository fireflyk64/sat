// Engine-level checks: what the machine relies on. (tests/machine-test.mjs covers whole chain reactions.)
import '../js/physics.js';
let failures = 0;
const check = (name, ok, extra = '') => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`); };
const run = (w, secs) => { for (let i = 0; i < secs * 60; i++) w.step(1 / 60); };
const ground = (w) => w.add(new Phys.Body({ x: 0, y: 10, hw: 50, hh: 0.5, isStatic: true, friction: 0.7 }));

{ // a row of real dominoes topples as a wave when the first is tipped
  // same set-up as a real piece: a ramp at 8 degrees with dominoes standing square to it
  const th = 8 * Math.PI / 180, c = Math.cos(th), s = Math.sin(th), w = new Phys.World({ gravity: 14 });
  w.add(new Phys.Body({ x: 10 * c - s * 0.15, y: 10 * s + c * 0.15, a: th, hw: 12, hh: 0.15, isStatic: true, friction: 0.6 }));
  const doms = Array.from({ length: 12 }, (_, i) => { const d = 2 + i * 0.7; return w.add(new Phys.Body({ x: d * c + s * 0.622, y: d * s - c * 0.622, a: th, hw: 0.13, hh: 0.62, density: 0.55, friction: 0.7, asleep: true })); });
  doms[0].wake(); doms[0].w = 2.8;
  run(w, 6);
  const fell = doms.filter(d => Math.abs(d.a - th) > 0.28).length;
  check('dominoes knock dominoes: the whole row goes down', fell === 12, `${fell}/12`);
}
{ // asleep bodies stay put until something moving touches them
  const w = new Phys.World(); ground(w);
  const d = w.add(new Phys.Body({ x: 0, y: 8.8, hw: 0.13, hh: 0.62, density: 0.55, asleep: true }));
  run(w, 3);
  check('a sleeping domino does not move by itself', d.asleep && d.a === 0);
  const m = w.add(new Phys.Body({ x: -3, y: 9.16, circle: 0.34, density: 4, vx: 5 }));
  run(w, 2);
  check('a moving marble wakes it', !d.asleep || d.a !== 0);
}
{ // hinge: a pendulum swings about its pin at constant length
  const w = new Phys.World({ gravity: 14 });
  const b = w.add(new Phys.Body({ x: 3, y: 0, circle: 0.5, density: 3 }));
  w.hinge(b, 0, 0);
  let maxErr = 0, lowest = 0;
  for (let i = 0; i < 240; i++) { w.step(1 / 60); maxErr = Math.max(maxErr, Math.abs(Math.hypot(b.x, b.y) - 3)); lowest = Math.max(lowest, b.y); }
  check('hinge holds its length while swinging', maxErr < 0.03, `max error ${maxErr.toFixed(4)}`);
  check('hinge swings through the bottom', lowest > 2.9, `lowest ${lowest.toFixed(2)}`);
}
{ // sensors report but do not push
  const w = new Phys.World(); let hits = 0;
  w.add(new Phys.Body({ x: 0, y: 5, circle: 1, isStatic: true, sensor: true }));
  w.onSensor = () => { hits++; };
  const m = w.add(new Phys.Body({ x: 0, y: 0, circle: 0.3, density: 4 }));
  let vy = 0; for (let i = 0; i < 80; i++) { w.step(1 / 60); vy = m.vy; }
  check('a sensor reports the overlap', hits > 0);
  check('a sensor does not slow anything down', vy > 10, `vy ${vy.toFixed(1)}`);
}
{ // explosions throw things, handlers can remove bodies mid-step
  const w = new Phys.World(); ground(w);
  const a = w.add(new Phys.Body({ x: 2, y: 9.2, hw: 0.3, hh: 0.3, density: 1, asleep: true }));
  const far = w.add(new Phys.Body({ x: 30, y: 9.2, hw: 0.3, hh: 0.3, density: 1, asleep: true }));
  w.explode(0, 9, 8, 10); w.step(1 / 60);
  check('explosion throws what is near, ignores what is far', a.vx > 4 && far.asleep);
  const w2 = new Phys.World(); ground(w2);
  const b = w2.add(new Phys.Body({ x: 0, y: 8, circle: 0.3, density: 4 }));
  w2.onImpact = (A, B) => { if (A === b || B === b) w2.remove(b); };
  let threw = false; try { run(w2, 2); } catch (e) { threw = true; }
  check('a body can be removed from inside an impact handler', !threw && !w2.bodies.includes(b));
}
{ // ghosts pass through dynamic bodies but still land on static ones
  const w = new Phys.World(); ground(w);
  const g = w.add(new Phys.Body({ x: 0, y: 7, circle: 0.3, density: 4 })); g.ghost = true;
  const d = w.add(new Phys.Body({ x: 0, y: 8.8, hw: 0.5, hh: 0.62, density: 1 }));
  run(w, 3);
  check('a retired marble falls through dominoes but not through ramps', g.y > 9 && g.y < 10 && Math.abs(d.x) < 0.01);
}
process.exit(failures ? 1 : 0);
