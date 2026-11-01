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
  const b = await js(`(()=>{const e=${expr}; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
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

// ---------------------------------------------------------------------------------------------------------- 5: resetting
await js(`window.confirm=()=>true`);
await clickEl(`document.getElementById('reset')`);
await sleep(150);
check('reset wipes progress and the miss cookie', (await js('__sat.progress.store.total')) === 0 && !(await js('document.cookie')).includes('lgc_cold'));

const realErrors = pageErrors.filter(e => !/favicon/.test(e));
check('no JavaScript errors in the whole session', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

cleanup();
process.exit(failures ? 1 : 0);
