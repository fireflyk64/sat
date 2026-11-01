// End-to-end test in real Chrome through the real UI: real clicks, real page reloads, real cookies and localStorage.
//   node tests/browser-test.mjs [--shots DIR]
// Needs Chrome/Chromium (set CHROME=/path/to/chrome if it is not at /usr/bin/google-chrome) and python3. No npm packages.
//
// Works without a graphics card (software WebGL), which is too slow for real-time play, so the test steps the physics
// forward with __sat.advance() between checks. Everything the player does goes through real mouse events.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const shotsArg = process.argv.indexOf('--shots');
const SHOTS = shotsArg > 0 ? process.argv[shotsArg + 1] : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

let failures = 0;
function check(name, ok, extra = '') { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra !== '' ? '  (' + extra + ')' : ''}`); }

const HTTP_PORT = 8800 + Math.floor(Math.random() * 300);
const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT)], { cwd: ROOT, stdio: 'ignore' });
const BASE = `http://localhost:${HTTP_PORT}/`;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sat-e2e-'));
const debugPort = 9500 + Math.floor(Math.random() * 300);
const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
  '--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--window-size=1100,720', 'about:blank'], { stdio: 'ignore' });

function cleanup() { try { chrome.kill('SIGKILL'); server.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
process.on('exit', cleanup);

let target = null;
for (let i = 0; i < 80 && !target; i++) { await sleep(150); try { target = (await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find(t => t.type === 'page'); } catch {} }
if (!target) { console.log('FAIL  Chrome did not start'); process.exit(1); }
for (let i = 0; i < 40; i++) { try { await fetch(BASE); break; } catch { await sleep(150); } }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let seq = 0; const waiting = new Map(), pageErrors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) { const p = waiting.get(m.id); waiting.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
  if (m.method === 'Runtime.exceptionThrown') pageErrors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++seq; waiting.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1100, height: 720, deviceScaleFactor: 1, mobile: false });

async function js(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function open(query = '') {
  await send('Page.navigate', { url: BASE + query });
  for (let i = 0; i < 200; i++) { await sleep(200); try { if (await js('!!window.__sat')) break; } catch {} }
  await sleep(300);
  await js('__sat.renderer.fx.quality=0');
}
async function shot(name) { if (!SHOTS) return; const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(SHOTS, name + '.png'), Buffer.from(r.data, 'base64')); }
const mouse = (type, x, y, buttons = 1) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mouseReleased' ? 0 : buttons, clickCount: 1 });
async function clickAt(x, y) { await mouse('mouseMoved', x, y, 0); await mouse('mousePressed', x, y); await mouse('mouseReleased', x, y); }
async function clickEl(expr) {
  // scroll to it and wait for it to stop moving: the panel may still be finishing a smooth scroll
  await js(`(${expr}).scrollIntoView({block:'center'})`);
  let b = null;
  for (let i = 0; i < 30; i++) {
    const r = await js(`(()=>{const r=(${expr}).getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
    if (b && Math.abs(b.x - r.x) < 0.5 && Math.abs(b.y - r.y) < 0.5) break;
    b = r; await sleep(120);
  }
  await clickAt(b.x, b.y);
}
// Real clicks on whichever multiple-choice answer we want
async function answer(right) {
  const opt = right ? `[...document.querySelectorAll('.opt')].find(b => (b.dataset.word||b.textContent) === __sat.state.current.answer)`
                    : `[...document.querySelectorAll('.opt')].find(b => (b.dataset.word||b.textContent) !== __sat.state.current.answer)`;
  await clickEl(opt);
  await sleep(120);
  await clickEl(`document.getElementById('check')`);
  await sleep(150);
}
// Keep moving to next questions until we land on a multiple-choice one
async function nextChoiceQuestion() {
  await clickEl(`document.getElementById('next')`);
  await sleep(60);
  for (let i = 0; i < 60; i++) {
    if (await js(`__sat.state.current.type === 'vocab' || __sat.state.current.type === 'mc'`)) return;
    await js(`__sat.showQuestion()`);
  }
  throw new Error('no multiple-choice question found');
}
// Pull back on the waiting marble with the real mouse and let go
async function mouseFlick(pullX, pullY, usePositionOf = null) {
  await js(`(()=>{ const c=__sat.renderer.cam; const f=__sat.flickable()||__sat.track.marbleFor(__sat.machine().playFrom||0); c.follow=false; c.zoomGoal=null; c.zoom=1; c.x=f.x; c.y=f.y+1; })()`);
  await sleep(200);
  const at = await js(`(()=>{const f=__sat.flickable()||__sat.track.marbleFor(__sat.machine().playFrom||0); const c=__sat.renderer.worldToScreen(f.x,f.y); const r=__sat.renderer.canvas.getBoundingClientRect(); return {x:c.x+r.left,y:c.y+r.top}})()`);
  await mouse('mouseMoved', at.x, at.y, 0);
  await mouse('mousePressed', at.x, at.y);
  for (let i = 1; i <= 5; i++) { await mouse('mouseMoved', at.x + pullX * i / 5, at.y + pullY * i / 5); await sleep(30); }
  await mouse('mouseReleased', at.x + pullX, at.y + pullY);
  await sleep(80);
}
const ready = () => js(`(()=>{ const r=__sat; r.state.readyAt=0; r.state.focusUntil=0; })()`);
async function runToBell(maxSecs = 200) {
  for (let t = 0; t < maxSecs; t += 4) {
    await js('__sat.advance(4)');
    if (!(await js('__sat.state.running'))) return true;
    await sleep(10);
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------- 1: the gate
await open('?q=vocab-78342-1164-0&noscale=1');
const fresh = await js(`JSON.stringify({ pieces: __sat.machine().pieces.length, flick: !!__sat.flickable(), total: __sat.progress.store.total })`);
check('new game: one row of dominoes and nothing to flick yet', fresh === JSON.stringify({ pieces: 1, flick: false, total: 0 }), fresh);
await shot('1-fresh');

await mouseFlick(-140, 90);
check('flicking before answering does nothing: no right answer, no play', !(await js('__sat.state.running')) && (await js(`__sat.track.marbles.every(m=>m.asleep)`)));
check('...and it points you at the question instead', await js(`document.getElementById('card').classList.contains('nudge')`));

// ---------------------------------------------------------------------------------------------------- 2: a right answer
await answer(true);
const afterRight = await js(`JSON.stringify({ pieces: __sat.machine().pieces.length, streak: __sat.progress.store.streak, win: document.getElementById('card').classList.contains('win') })`);
check('right answer: a new toy slots in, streak goes up, card celebrates', afterRight === JSON.stringify({ pieces: 2, streak: 1, win: true }), afterRight);
check('...the flick is now earned', await js('!!__sat.flickable()'));
await ready();
await shot('2-earned');

// flick it the WRONG way, off into space: that must cost nothing
const forward = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
await mouseFlick(forward * 150, 95);
check('a real mouse pull-and-release starts the run', await js('__sat.state.running'));
for (let i = 0; i < 12 && await js('__sat.state.running && !__sat.track.run.engaged'); i++) await js('__sat.advance(1)');
if (!(await js('__sat.state.running'))) {
  check('a flick that misses the machine gives the marble back for free', await js('!!__sat.flickable() && __sat.flickable().asleep'));
  await ready();
  await mouseFlick(-forward * 110, 70);
  check('...and flicking it the right way then starts the run', await js('__sat.state.running'));
}
const rang = await runToBell();
check('the chain runs all the way to the bell', rang && (await js('__sat.track.bell.rung > 0')));
check('dominoes actually fell', (await js('__sat.track.toppled')) >= 5, await js('__sat.track.toppled'));
check('score was banked', (await js('__sat.progress.store.score')) > 0, await js('__sat.progress.store.score'));
check('once played, the next run has to be earned again', await js('!__sat.flickable()'));
await shot('3-after-run');

// ---------------------------------------------------------------------------------------------- 3: misses and persistence
await nextChoiceQuestion();
const missedId = await js('__sat.state.current.id');
await answer(false);
check('wrong answer: nothing new slots in', (await js('__sat.machine().pieces.length')) === 2);
check('wrong answer: streak resets', (await js('__sat.progress.store.streak')) === 0);
check('wrong answer: it goes in the cold case file', await js(`__sat.progress.isCold(${JSON.stringify(missedId)})`));
check('the miss is saved in localStorage', await js(`JSON.parse(localStorage.getItem('sat-grey-cells-v1')).cold[${JSON.stringify(missedId)}] != null`));
const cookie = await js('document.cookie');
check('the miss is mirrored into a cookie', cookie.includes(encodeURIComponent(missedId)) || cookie.includes(missedId), cookie.slice(0, 60));
await shot('4-miss');

await open('?noscale=1');           // close and come back: a new session
const firstBack = await js('__sat.state.current.id');
check('REOPENED: the very first question is the one that was missed', firstBack === missedId, `${firstBack} vs ${missedId}`);
check('...stamped as a cold case', await js(`!document.getElementById('coldStamp').hidden`));
check('...the cold case count is on show', (await js(`document.getElementById('coldN').textContent`)) === '1');
check('the machine survived the reload', (await js('__sat.machine().pieces.length')) === 2);
await shot('5-cold-case');

// the cold-case question may not be multiple choice; solve it through the data layer the same way a right answer lands
const piecesBefore = await js('__sat.machine().pieces.length');
await js(`__sat.onCorrectForTest()`);
const coldSolve = await js(`JSON.stringify({ wins: __sat.progress.store.cold[${JSON.stringify(missedId)}]?.wins, gold: __sat.state.gold, gained: __sat.machine().pieces.length - ${piecesBefore} })`);
check('solving a cold case: one win logged, gold marble earned, bonus toy', coldSolve === JSON.stringify({ wins: 1, gold: true, gained: 2 }), coldSolve);
check('...but it stays open until it is solved again in another session', await js(`__sat.progress.isCold(${JSON.stringify(missedId)})`));

await open('?noscale=1');
check('REOPENED again: it comes back one more time', (await js('__sat.state.current.id')) === missedId);
await js(`__sat.onCorrectForTest()`);
check('second solve, in a different session: case closed', !(await js(`__sat.progress.isCold(${JSON.stringify(missedId)})`)) && (await js('__sat.progress.store.closed')) === 1);
check('the cookie no longer lists it', !(await js('document.cookie')).includes(encodeURIComponent(missedId)));

// ---------------------------------------------------------------------------------------------- 4: finishing the machine
await js(`(()=>{ const s=__sat.progress.store; s.total=30; })()`);
let guard = 0;
while (!(await js('__sat.machine().complete')) && guard++ < 12) { await js('__sat.onCorrectForTest()'); await sleep(40); }
const size = await js('__sat.machine().pieces.length'), target0 = await js('__sat.machine().target');
check('correct answers fill the machine to its target', size >= target0, `${size} pieces, target ${target0}`);
await ready();
await shot('6-complete');

const from = await js('__sat.machine().playFrom');
await js(`__sat.flick(__sat.track.exitFor(__sat.machine().playFrom).dir*4,-1)`);
await runToBell(400);
if (from !== 0) {
  await sleep(2300);       // "MACHINE COMPLETE": it resets itself for the grand run
  check('the last piece done: the whole machine resets for the grand run from the top', (await js('__sat.machine().playFrom')) === 0 && (await js(`__sat.track.marbleFor(0).asleep`)));
  await js('__sat.state.readyAt=0');
  await js(`__sat.flick(__sat.track.exitFor(0).dir*4,-1)`);
  await runToBell(500);
}
check('running the whole machine in one go triggers the finale', (await js(`__sat.state.phase`)) === 'finale');
await js('__sat.advance(4)');                // the last few dominoes finish falling as the finale begins
check('every domino in the machine went down', await js(`(()=>{let f=0,t=0;__sat.track.sections.forEach(s=>s.dominoes.forEach(d=>{t++;if(d.userData.fell||d.userData.dissolve)f++}));return f/t})()`) >= 0.93, await js(`(()=>{let f=0,t=0;__sat.track.sections.forEach(s=>s.dominoes.forEach(d=>{t++;if(d.userData.fell||d.userData.dissolve)f++}));return f+'/'+t})()`));
check('the case-closed card appears', await js(`document.getElementById('finale').classList.contains('show')`));
await sleep(1200);
await shot('7-finale');
await sleep(1800);
await shot('7b-finale');

const casesBefore = await js('__sat.progress.store.cases');
await clickEl(`document.getElementById('finaleNext')`);
await sleep(200);
const nextUp = await js(`JSON.stringify({ phase: __sat.state.phase, pieces: __sat.machine().pieces.length, flick: !!__sat.flickable(), cases: __sat.progress.store.cases })`);
check('next machine starts small and locked again', nextUp === JSON.stringify({ phase: 'play', pieces: 1, flick: false, cases: casesBefore }), nextUp);
check('the next machine is bigger than the last', (await js('__sat.machine().target')) > target0, `${target0} -> ${await js('__sat.machine().target')}`);

// ------------------------------------------------------------------------------------- 5: Focus, freezes and the chest
await js(`window.confirm=()=>true`);
await clickEl(`document.getElementById('reset')`);
await sleep(150);
await open('?q=vocab-78342-1164-0&noscale=1');
const focusBar = (t) => js(`(()=>{const r=document.getElementById('fb-${t}');return {count:r.querySelector('.fcount').textContent, width:parseFloat(r.querySelector('.ffill').style.width), visible:r.getBoundingClientRect().height>0}})()`);
check('the chest starts collapsed', await js(`document.getElementById('chestBody').hidden && document.getElementById('chestToggle').getAttribute('aria-expanded')==='false'`));
check('Focus progress bars are on show from the start', (await focusBar('bonus')).visible && (await focusBar('rare')).visible && (await focusBar('ultra')).visible);
await answer(true);
check('a right answer moves every Focus bar', (await focusBar('bonus')).count === '1 / 10' && (await focusBar('rare')).count === '1 / 20' && (await focusBar('ultra')).count === '1 / 100');
check('the bar actually fills', (await focusBar('bonus')).width === 10, (await focusBar('bonus')).width);

// the flick prompt must not pull his eye during a study run: read what is really being drawn, across two moments
const promptDrawn = async () => {
  await js(`(()=>{const r=__sat.renderer; r.floats.length=0; r.rings.length=0; __sat.state.readyAt=0;})()`);
  await sleep(1300);
  const sample = () => js(`(()=>{const f=__sat.renderer.fx,T=FX.T,m=__sat.flickable(),rings=[];let text=0;for(let i=0;i<f.n;i++){const o=i*16,t=f.data[o+5];if(t===T.RING&&Math.hypot(f.data[o]-m.x,f.data[o+1]-m.y)<0.05)rings.push(+f.data[o+2].toFixed(3));if(t===T.GLYPH)text++}return {rings,text}})()`);
  const a = await sample(); await sleep(900); const b = await sample();
  return { moving: JSON.stringify(a.rings) !== JSON.stringify(b.rings), text: a.text + b.text, rings: b.rings.length };
};
const stageBox = await js(`(()=>{const a=document.getElementById('stage').getBoundingClientRect(), b=document.getElementById('card').getBoundingClientRect();return {sx:a.left+a.width/2, sy:a.top+a.height/2, px:b.left+b.width/2, py:Math.min(b.top+40, innerHeight-20)}})()`);
await mouse('mouseMoved', stageBox.px, stageBox.py, 0); await sleep(100);
check('Focus under 5, mouse on the questions: the prompt still pulses', (await js('__sat.promptPulses()')) && (await promptDrawn()).moving);
await js(`(()=>{const s=__sat.progress.store; s.focus={count:5,bonus:5,rare:5,ultra:5,next:{}}; __sat.progress.save(); __sat.refresh();})()`);
const calmDrawn = await promptDrawn();
check('Focus at 5, mouse on the questions: the ball is calm', !(await js('__sat.promptPulses()')) && !calmDrawn.moving && calmDrawn.text === 0 && calmDrawn.rings === 1, JSON.stringify(calmDrawn));
await mouse('mouseMoved', stageBox.sx, stageBox.sy, 0); await sleep(150);
const hoverDrawn = await promptDrawn();
check('Focus at 5, mouse on the play window: it pulses again', (await js('__sat.promptPulses()')) && hoverDrawn.moving && hoverDrawn.text > 0, JSON.stringify(hoverDrawn));
await mouse('mouseMoved', stageBox.px, stageBox.py, 0); await sleep(150);
check('moving the mouse back to the questions calms it again', !(await js('__sat.promptPulses()')));
await js(`(()=>{const s=__sat.progress.store; s.focus={count:1,bonus:1,rare:1,ultra:1,next:{}}; __sat.progress.save(); __sat.refresh();})()`);

await nextChoiceQuestion();
await answer(false);
check('a miss takes ⅓ off Focus, and the bar and the verdict both show it', (await focusBar('bonus')).count === '⅔ / 10' && (await js(`document.getElementById('focusN').textContent`)) === '⅔' && (await js(`document.getElementById('verdict').textContent`)).includes('Focus −⅓'), await js(`document.getElementById('verdict').textContent`));

// no freeze yet: a flick costs him the Focus
await ready();
await js(`__sat.track.marbleFor(__sat.machine().playFrom) && 0`);
const dirF = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
check('the page warns what a flick will cost', (await js(`document.getElementById('hint').textContent`)).includes('resets your Focus'), await js(`document.getElementById('hint').textContent`));
await mouseFlick(-dirF * 110, 70);
check('flicking with no freeze resets Focus', (await js('__sat.state.running')) && (await js('__sat.progress.store.focus.count')) === 0 && (await focusBar('bonus')).count === '0 / 10');
await runToBell();

// five in a row: a freeze
for (let i = 0; i < 5; i++) { await nextChoiceQuestion(); await answer(true); }
check('5 correct in a row earns a freeze, and says so', (await js('__sat.progress.store.freezes.length')) === 1 && (await js(`document.getElementById('freezes').textContent`)).includes('Freeze ready'), await js(`document.getElementById('freezes').textContent`));
check('the page says a flick now is safe', (await js(`document.getElementById('hint').textContent`)).includes('freeze'), await js(`document.getElementById('hint').textContent`));
await ready();
await shot('8-freeze-ready');
const focusBefore = await js('__sat.progress.store.focus.count');
const dirG = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
await mouseFlick(-dirG * 110, 70);
check('flicking with a freeze keeps Focus and spends the freeze', (await js('__sat.state.running')) && (await js('__sat.progress.store.focus.count')) === focusBefore && (await js('__sat.progress.store.freezes.length')) === 0, focusBefore);
await runToBell();

// A flick that misses the machine must not charge twice
await js(`(()=>{ const s=__sat.progress.store; s.freezes=[5,5]; s.streak=0; __sat.progress.save(); })()`);
await nextChoiceQuestion(); await answer(true); await ready();
const dirH = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
await mouseFlick(dirH * 150, 95);
for (let i = 0; i < 12 && await js('__sat.state.running && !__sat.track.run.engaged'); i++) await js('__sat.advance(1)');
if (!(await js('__sat.state.running'))) {
  const held = await js('__sat.progress.store.freezes.length');
  await ready();
  await mouseFlick(-dirH * 110, 70);
  check('retrying a missed flick is free: no second freeze spent', (await js('__sat.progress.store.freezes.length')) === held, held);
}
await runToBell();

// A roll, won through the real UI: force the dice, watch the reveal
await nextChoiceQuestion();
await js(`(()=>{ const s=__sat.progress.store; s.focus={count:9,bonus:9,rare:9,ultra:9}; s.freezes=[]; __sat.progress.rand=()=>0; __sat.progress.save(); })()`);
await answer(true);
check('reaching 10 opens a roll on screen', await js(`!document.getElementById('rollBox').hidden`), await js(`document.getElementById('rollHead').textContent`));
await sleep(1500);
const prize = await js(`Object.keys(__sat.progress.store.chest).find(k=>__sat.progress.store.chest[k]>0)`);
check('the roll reveals the item', (await js(`document.getElementById('rollResult').textContent`)).includes(await js(`REWARDS[${JSON.stringify(prize)}].name`)), await js(`document.getElementById('rollResult').textContent`));
check('winning resets that bar, and only that bar', (await focusBar('bonus')).count === '0 / 10' && (await focusBar('rare')).count === '10 / 20', (await focusBar('rare')).count);
check('ultra rares are exactly Upside Down and Rewind', (await js(`Object.keys(REWARDS).filter(k=>REWARDS[k].tier==='ultra').join()`)) === 'flip,rewind', await js(`Object.keys(REWARDS).filter(k=>REWARDS[k].tier==='ultra').join()`));
check('a win does not pop the chest open', await js(`document.getElementById('chestBody').hidden`));
check('the closed chest still says how many are saved', (await js(`document.getElementById('chestCount').textContent`)).startsWith('1 saved'), await js(`document.getElementById('chestCount').textContent`));
await clickEl(`document.getElementById('chestToggle')`);
await sleep(60);
check('clicking the chest opens it, with the item inside', !(await js(`document.getElementById('chestBody').hidden`)) && await js(`!!document.querySelector('.tile.owned[data-id="${prize}"]')`));
await clickEl(`document.getElementById('chestToggle')`);
await sleep(60);
check('clicking again closes it', await js(`document.getElementById('chestBody').hidden`));
check('unlocks are saved in a cookie', (await js('document.cookie')).includes('lgc_chest') && decodeURIComponent(await js('document.cookie')).includes(prize + ':1'), decodeURIComponent(await js('document.cookie')).slice(0, 80));
await shot('9-prize');
await sleep(3400);
await js(`__sat.progress.rand=Math.random`);

// items save up across a reload, and survive localStorage being wiped
await open('?noscale=1');
check('the chest survives a reload', (await js(`__sat.progress.store.chest[${JSON.stringify(prize)}]`)) === 1);
await js(`localStorage.removeItem('sat-grey-cells-v1')`);
await open('?noscale=1');
check('REOPENED with localStorage wiped: the chest comes back from its cookie', (await js(`__sat.progress.store.chest[${JSON.stringify(prize)}]`)) === 1);

// deploying: every item through the real page
for (const id of await js('Object.keys(REWARDS)')) {
  await js(`(()=>{ const s=__sat.progress.store; s.chest[${JSON.stringify(id)}]=1; s.found[${JSON.stringify(id)}]=1; s.focus={count:4,bonus:4,rare:4,ultra:4}; s.freezes=[]; __sat.progress.save(); __sat.showQuestion(); __sat.refresh(); })()`);
  if (await js(`document.getElementById('chestBody').hidden`)) await clickEl(`document.getElementById('chestToggle')`);
  await clickEl(`document.querySelector('[data-id="${id}"]')`);       // a real click on the chest tile
  await sleep(60);
  await clickEl(`document.getElementById('ciGo')`);
  await sleep(120);
  const inBreak = await js(`!!__sat.state.brk && __sat.state.brk.id===${JSON.stringify(id)}`);
  const piecesB = await js('__sat.machine().pieces.length');
  await js(`(()=>{const r=__sat.renderer,c=r.canvas.getBoundingClientRect();window.__p={x:c.left+c.width/2,y:c.top+c.height*0.45}})()`);
  const pt = await js('window.__p');
  await mouse('mouseMoved', pt.x, pt.y, 0); await mouse('mousePressed', pt.x, pt.y);
  await js('__sat.advance(2.5)');
  await mouse('mouseMoved', pt.x + 40, pt.y + 30);
  await js('__sat.advance(2.5)');
  await sleep(250);
  if (id === 'flip' || id === 'rewind') await shot('10-' + id);
  await mouse('mouseReleased', pt.x + 40, pt.y + 30);
  await js('__sat.advance(.5)');
  const moved = await js(`__sat.track.toppled`);
  check(`${id}: plays through the real page, spends the item, resets Focus`, inBreak && (await js(`__sat.progress.store.chest[${JSON.stringify(id)}]`)) === 0 && (await js('__sat.progress.store.focus.count')) === 0, `${moved} dominoes down`);
  await clickEl(`document.getElementById('breakEnd')`);
  await sleep(120);
  check(`${id}: ending the break puts the machine back`, !(await js('__sat.state.brk')) && (await js(`__sat.track.statics.every(b=>b.isStatic)`)) && (await js(`__sat.track.toppled`)) === 0 && (await js('__sat.machine().pieces.length')) === piecesB);
}

// ---------------------------------------------------------------------------------------------------------- 6: resetting
await js(`window.confirm=()=>true`);
await clickEl(`document.getElementById('reset')`);
await sleep(150);
check('reset wipes progress and both cookies', (await js('__sat.progress.store.total')) === 0 && !(await js('document.cookie')).includes('lgc_cold') && !(await js('document.cookie')).includes('lgc_chest'));

const realErrors = pageErrors.filter(e => !/favicon/.test(e));
check('no JavaScript errors in the whole session', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

cleanup();
process.exit(failures ? 1 : 0);
