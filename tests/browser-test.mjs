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
// The panel's one animated scroll (to the feedback after an answer) can arrive seconds late on software rendering, and move
// a button out from under a click the test has already aimed. A real graphics card finishes it long before anyone gets there.
await send('Page.addScriptToEvaluateOnNewDocument', { source: `{ const o = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (a) { o.call(this, a && typeof a === 'object' ? { ...a, behavior: 'instant' } : a); }; }` });
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
  // scroll to it, then wait until it has stopped moving and is really under the pointer: the panel may still be finishing
  // a smooth scroll, and software rendering can stall a frame long enough for two readings to match while it is still moving
  await js(`(${expr}).scrollIntoView({block:'center'})`);
  let b = null, still = 0;
  for (let i = 0; i < 50 && still < 3; i++) {
    const r = await js(`(()=>{const e=(${expr}), r=e.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2, hit=document.elementFromPoint(x,y); return {x,y,on:!!hit&&(hit===e||e.contains(hit))}})()`);
    still = b && r.on && Math.abs(b.x - r.x) < 0.5 && Math.abs(b.y - r.y) < 0.5 ? still + 1 : 0;
    b = r; await sleep(120);
  }
  await clickAt(b.x, b.y);
}
// Real clicks on whichever multiple-choice answer we want
async function answer(right) {
  const opt = right ? `[...document.querySelectorAll('.opt')].find(b => (b.dataset.word??b.textContent) === __sat.state.current.answer)`
                    : `[...document.querySelectorAll('.opt')].find(b => (b.dataset.word??b.textContent) !== __sat.state.current.answer)`;
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
const Mystery0Order = (m) => m.suspects.map((x, i) => i).filter(i => i !== m.culprit).sort((a, b) => m.suspects[a].clue - m.suspects[b].clue);
// the machine's last run, watched a second at a time: who has been cleared, and when
async function runToBellWatching(maxSecs = 400) {
  const shown = await js(`__sat.state.grand && document.getElementById('suspects').classList.contains('show') && document.querySelectorAll('#suspects .sus').length === 4 && __sat.state.cleared.length === 0`);
  const seen = [''];
  for (let t = 0; t < maxSecs; t++) {
    await js('__sat.advance(1)');
    const c = await js('__sat.state.cleared.join()');
    if (c !== seen[seen.length - 1]) seen.push(c);
    if (!(await js('__sat.state.running'))) break;
    await sleep(10);
  }
  return { shown, seen };
}
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
const my0 = await js(`JSON.stringify(Mystery.forMachine(0))`).then(JSON.parse);
check('the case file starts collapsed, on the first mystery, with no clues yet', await js(`document.getElementById('mysteryBody').hidden`) && (await js(`document.getElementById('mysteryTitle').textContent`)) === my0.title
  && (await js(`document.getElementById('mysteryCount').textContent`)) === '0 of 5 clues', await js(`document.getElementById('mysteryCount').textContent`));
await sleep(1100);
check('a new game says what the mystery is', (await js(`document.getElementById('announce').classList.contains('show')`)) && (await js(`document.getElementById('announceTitle').textContent`)).includes(my0.title)
  && (await js(`document.getElementById('announceBlurb').textContent`)) === my0.brief, await js(`document.getElementById('announceTitle').textContent`));

await mouseFlick(-140, 90);
check('flicking before answering does nothing: no right answer, no play', !(await js('__sat.state.running')) && (await js(`__sat.track.marbles.every(m=>m.asleep)`)));
check('...and it points you at the question instead', await js(`document.getElementById('card').classList.contains('nudge')`));

// ---------------------------------------------------------------------------------------------------- 2: a right answer
await answer(true);
const afterRight = await js(`JSON.stringify({ pieces: __sat.machine().pieces.length, streak: __sat.progress.store.streak, win: document.getElementById('card').classList.contains('win') })`);
check('right answer: a new toy slots in, streak goes up, card celebrates', afterRight === JSON.stringify({ pieces: 2, streak: 1, win: true }), afterRight);
check('...the flick is now earned', await js('!!__sat.flickable()'));
check('a right answer finds the first clue, and the closed case file says so', (await js(`document.getElementById('mysteryCount').textContent`)) === '1 of 5 clues \u00b7 new', await js(`document.getElementById('mysteryCount').textContent`));
await sleep(2300);
check('...and the clue itself appears over the machine', (await js(`document.getElementById('announceTitle').textContent`)).includes('Clue 1 of 5') && (await js(`document.getElementById('announceBlurb').textContent`)) === my0.clues[0], await js(`document.getElementById('announceBlurb').textContent`));
await clickEl(`document.getElementById('mysteryToggle')`);
await sleep(80);
check('opening the case file shows the brief, four suspects and the one clue found', await js(`(()=>{ const b=document.getElementById('mysteryBody'); return !b.hidden && document.getElementById('mysteryBrief').textContent.length > 40
  && document.querySelectorAll('#mysterySuspects .msus').length === 4 && document.querySelectorAll('#mysteryClues li').length === 5 && document.querySelectorAll('#mysteryClues li.locked').length === 4
  && document.querySelector('#mysteryClues li').textContent === ${JSON.stringify(my0.clues[0])}; })()`));
check('...and reading them clears the "new" mark', (await js(`document.getElementById('mysteryCount').textContent`)) === '1 of 5 clues', await js(`document.getElementById('mysteryCount').textContent`));
await clickEl(`document.getElementById('mysteryToggle')`);
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
const mystery1 = await js(`JSON.stringify(__sat.mystery())`).then(JSON.parse);
const lastClue = await js(`__sat.cluesFound()`);
check('before the last run the suspects are not on show', !(await js(`document.getElementById('suspects').classList.contains('show')`)));
await js(`__sat.flick(__sat.track.exitFor(__sat.machine().playFrom).dir*4,-1)`);
if (from !== 0) {
  // the last piece found the last clue 2s ago: with a run under way it must wait, not sit on the chain counter
  await sleep(2300);
  check('a clue found just before a run waits for the run to end', (await js('__sat.state.running')) && !(await js(`document.getElementById('announceTitle').textContent`)).includes('Clue ' + lastClue), await js(`document.getElementById('announceTitle').textContent`));
}
let story = null;
if (from === 0) story = await runToBellWatching(400); else await runToBell(400);
if (from !== 0) {
  await sleep(1700);
  check('...and is shown once the run is over', (await js(`document.getElementById('announceTitle').textContent`)).includes('Clue ' + lastClue), await js(`document.getElementById('announceTitle').textContent`));
  await sleep(2300);       // "MACHINE COMPLETE": it resets itself for the grand run
  check('the last piece done: the whole machine resets for the grand run from the top', (await js('__sat.machine().playFrom')) === 0 && (await js(`__sat.track.marbleFor(0).asleep`)));
  await js('__sat.state.readyAt=0');
  await js(`__sat.flick(__sat.track.exitFor(0).dir*4,-1)`);
  story = await runToBellWatching(500);
}
check('running the whole machine in one go triggers the finale', (await js(`__sat.state.phase`)) === 'finale');
await js('__sat.advance(4)');                // the last few dominoes finish falling as the finale begins
check('every domino in the machine went down', await js(`(()=>{let f=0,t=0;__sat.track.sections.forEach(s=>s.dominoes.forEach(d=>{t++;if(d.userData.fell||d.userData.dissolve)f++}));return f/t})()`) >= 0.93, await js(`(()=>{let f=0,t=0;__sat.track.sections.forEach(s=>s.dominoes.forEach(d=>{t++;if(d.userData.fell||d.userData.dissolve)f++}));return f+'/'+t})()`));
check('the case-closed card appears', await js(`document.getElementById('finale').classList.contains('show')`));
const order = Mystery0Order(mystery1);
check('the last run brings out all four suspects, with nobody cleared yet', story.shown);
check('they are cleared one at a time while it runs, never taken back', story.seen.length >= 3 && story.seen.every((c, i) => i === 0 || c.startsWith(story.seen[i - 1])), JSON.stringify(story.seen));
check('...in the order their clues turn up, and the culprit is not among them', story.seen[story.seen.length - 1] === order.join(), story.seen[story.seen.length - 1] + ' vs ' + order.join());
check('the card names the culprit and says how it was done', (await js(`document.getElementById('finCulprit').textContent`)).includes(mystery1.title) && (await js(`document.getElementById('finCulprit').textContent`)).includes(mystery1.suspects[mystery1.culprit].name)
  && (await js(`document.getElementById('finSolution').textContent`)) === mystery1.solution, await js(`document.getElementById('finCulprit').textContent`));
await sleep(1800);
check('the suspects shown are the ones in the mystery just solved, not the next one', (await js(`[...document.querySelectorAll('#suspects .sus b')].map(e=>e.textContent).join()`)) === mystery1.suspects.map(x => x.name).join(), await js(`[...document.querySelectorAll('#suspects .sus b')].map(e=>e.textContent).join()`));
check('...and so is the case file, which now says it is solved', (await js(`document.getElementById('mysteryTitle').textContent`)) === mystery1.title && (await js(`document.getElementById('mysteryCount').textContent`)) === 'solved', await js(`document.getElementById('mysteryTitle').textContent + ' / ' + document.getElementById('mysteryCount').textContent`));
check('...with the whole solution, in the case file as well as on the card', (await js(`document.getElementById('mysterySolved').hidden`)) === false && (await js(`document.getElementById('mysterySolved').textContent`)).includes(mystery1.solution));
check('...and the tags are the small stamps, not the pink skill tag', await js(`!document.querySelector('#suspects .tag') && !!document.querySelector('#suspects .stag')`));
check('the culprit is the one left standing, marked guilty', await js(`(()=>{ const c=[...document.querySelectorAll('#suspects .sus')]; return c.length===4 && c.filter(x=>x.classList.contains('out')).length===3 && c.filter(x=>x.classList.contains('guilty')).length===1 && c[${mystery1.culprit}].classList.contains('guilty'); })()`));
await shot('7a-suspects');
await sleep(1200);
await shot('7-finale');
await sleep(1800);
await shot('7b-finale');

const casesBefore = await js('__sat.progress.store.cases');
await clickEl(`document.getElementById('finaleNext')`);
await sleep(200);
const nextUp = await js(`JSON.stringify({ phase: __sat.state.phase, pieces: __sat.machine().pieces.length, flick: !!__sat.flickable(), cases: __sat.progress.store.cases })`);
check('next machine starts small and locked again', nextUp === JSON.stringify({ phase: 'play', pieces: 1, flick: false, cases: casesBefore }), nextUp);
const my1 = await js(`JSON.stringify(Mystery.forMachine(${casesBefore}))`).then(JSON.parse);
check('...which goes away with the next machine', await js(`document.getElementById('mysterySolved').hidden`));
check('the suspects go away, and the next machine has the next mystery', !(await js(`document.getElementById('suspects').classList.contains('show')`)) && my1.id !== my0.id
  && (await js(`document.getElementById('mysteryTitle').textContent`)) === my1.title && (await js(`document.getElementById('mysteryCount').textContent`)) === '0 of 5 clues', await js(`document.getElementById('mysteryTitle').textContent`));
await sleep(1000);
check('...which is introduced', (await js(`document.getElementById('announceTitle').textContent`)).includes(my1.title), await js(`document.getElementById('announceTitle').textContent`));
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
  // what is on screen must already reflect the change: wait until at least one more frame has been drawn
  const seen = await js('__sat.renderer.fx.time');
  for (let i = 0; i < 40 && (await js('__sat.renderer.fx.time')) === seen; i++) await sleep(150);
  const sample = () => js(`(()=>{const f=__sat.renderer.fx,T=FX.T,m=__sat.flickable(),rings=[];let text=0;for(let i=0;i<f.n;i++){const o=i*16,t=f.data[o+5];if(t===T.RING&&Math.hypot(f.data[o]-m.x,f.data[o+1]-m.y)<0.05)rings.push(+f.data[o+2].toFixed(3));if(t===T.GLYPH)text++}return {rings,text}})()`);
  // half a ring cycle apart (it takes about 0.91 s), and only once a new frame has really been drawn
  const a = await sample(), frame = await js('__sat.renderer.fx.time');
  await sleep(450);
  for (let i = 0; i < 40 && (await js('__sat.renderer.fx.time')) === frame; i++) await sleep(150);
  const b = await sample();
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

// no freeze yet: a flick costs him a little Focus, not everything
await js(`(()=>{const s=__sat.progress.store; s.focus={count:6,bonus:6,rare:6,ultra:6,next:{}}; __sat.progress.save(); __sat.refresh();})()`);
await ready();
await js(`__sat.track.marbleFor(__sat.machine().playFrom) && 0`);
const dirF = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
check('the page warns what a flick will cost', (await js(`document.getElementById('hint').textContent`)).includes('costs 1½ Focus'), await js(`document.getElementById('hint').textContent`));
await mouseFlick(-dirF * 110, 70);
check('flicking with no freeze costs 1½ Focus, and no more', (await js('__sat.state.running')) && (await js('__sat.progress.store.focus.count')) === 4.5 && (await focusBar('bonus')).count === '4½ / 10', (await focusBar('bonus')).count);
await runToBell();

// five in a row: a freeze
for (let i = 0; i < 5; i++) { await nextChoiceQuestion(); await answer(true); }
check('5 correct in a row earns a freeze, and says so', (await js('__sat.progress.store.freezes')) === 1 && (await js(`document.getElementById('freezes').textContent`)).includes('Freeze ready'), await js(`document.getElementById('freezes').textContent`));
check('the page says a flick now is safe', (await js(`document.getElementById('hint').textContent`)).includes('freeze'), await js(`document.getElementById('hint').textContent`));
await ready();
await shot('8-freeze-ready');
const focusBefore = await js('__sat.progress.store.focus.count');
const dirG = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
await mouseFlick(-dirG * 110, 70);
check('flicking with a freeze keeps Focus and spends the freeze', (await js('__sat.state.running')) && (await js('__sat.progress.store.focus.count')) === focusBefore && (await js('__sat.progress.store.freezes')) === 0, focusBefore);
await runToBell();

// A flick that misses the machine must not charge twice
// (a machine with room for another toy, so this test does not depend on how full the earlier ones left it)
// A finished machine rebuilds 1.7s after its bell, and that locks the marble for a second. A flick landing then is
// ignored and costs nothing, which is right, but it would not be the flick this test means to make. So wait it out.
await sleep(2500);
await js(`(()=>{ const s=__sat.progress.store, m=__sat.machine(); s.freezes=2; s.streak=0; m.complete=false; m.target=50; m.playFrom=null; m.pieces.length=Math.min(m.pieces.length,2); __sat.progress.save(); __sat.rebuild({}); })()`);
await nextChoiceQuestion(); await answer(true); await ready();
const dirH = await js('__sat.track.exitFor(__sat.machine().playFrom).dir');
await js('__sat.state.readyAt = 1e9');
await mouseFlick(dirH * 150, 95);
check('a flick while the marble is still locked is ignored and costs nothing', !(await js('__sat.state.running')) && (await js('__sat.progress.store.freezes')) === 2, await js('__sat.progress.store.freezes'));
await ready();
await mouseFlick(dirH * 150, 95);
check('a flick spends exactly one freeze', (await js('__sat.state.running')) && (await js('__sat.progress.store.freezes')) === 1, await js('__sat.progress.store.freezes'));
// The backstops catch nearly every flick, so send this one clear of the whole machine, where no lower section can catch
// it: everything after that is the real miss path
await js(`(()=>{ const t=__sat.track, r=t.run, s=t.sections[r.from], b=t.bounds(); r.engaged=false; r.marble.x=b.maxX+200; r.marble.y=s.ramps[s.ramps.length-1].lowY+4; })()`);
await js('__sat.advance(1)');
check('a missed flick hands the marble back', !(await js('__sat.state.running')) && (await js('!!__sat.flickable()')), await js('__sat.state.running'));
await ready();
await mouseFlick(-dirH * 110, 70);
check('retrying a missed flick is free: no second freeze spent', (await js('__sat.state.running')) && (await js('__sat.progress.store.freezes')) === 1, await js('__sat.progress.store.freezes'));
await runToBell();

// A roll, won through the real UI: force the dice, watch the reveal
await nextChoiceQuestion();
await js(`(()=>{ const s=__sat.progress.store; s.focus={count:9,bonus:9,rare:9,ultra:9,next:{}}; s.freezes=0; s.chest={}; s.found={}; __sat.progress.rand=()=>0; __sat.progress.save(); __sat.refresh(); })()`);
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
  await js(`(()=>{ const s=__sat.progress.store; s.chest[${JSON.stringify(id)}]=1; s.found[${JSON.stringify(id)}]=1; s.focus={count:4,bonus:4,rare:4,ultra:4}; s.freezes=0; __sat.progress.save(); __sat.showQuestion(); __sat.refresh(); })()`);
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
  check(`${id}: plays through the real page, spends the item, costs 1½ Focus`, inBreak && (await js(`__sat.progress.store.chest[${JSON.stringify(id)}]`)) === 0 && (await js('__sat.progress.store.focus.count')) === 2.5, `${moved} dominoes down`);
  await clickEl(`document.getElementById('breakEnd')`);
  await sleep(120);
  check(`${id}: ending the break puts the machine back`, !(await js('__sat.state.brk')) && (await js(`__sat.track.statics.every(b=>b.isStatic)`)) && (await js(`__sat.track.toppled`)) === 0 && (await js('__sat.machine().pieces.length')) === piecesB);
}

// ----------------------------------------------------------------------- 6: fair questions
// A wrong-verb question must not show its verb forms before he has chosen the verb
const tenseId = await js(`SAT_QUESTIONS.find(q=>q.type==='tapfix'&&q.skill==='tense').id`);
await js(`__sat.showQuestion(${JSON.stringify(tenseId)}); ''`); await sleep(120);
check('wrong-verb question: the verb forms stay hidden at first', await js(`document.querySelector('#qbody .options').hidden && !!document.querySelector('.lockword')`));
check('...and there is nothing to lock until a word is tapped', await js(`document.querySelector('.lockword').disabled`));
const tw = await js(`(()=>{const q=__sat.state.current,bs=[...document.querySelectorAll('.sentence .w')];const i=bs.findIndex(b=>q.targetWords.includes(b.textContent.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g,'').toLowerCase()));return i})()`);
await clickEl(`document.querySelectorAll('.sentence .w')[${tw}]`);
await sleep(60);
check('...tapping a word still does not reveal them', await js(`document.querySelector('#qbody .options').hidden && !document.querySelector('.lockword').disabled`));
await clickEl(`document.querySelector('.lockword')`);
await sleep(60);
check('...locking it in shows them', !(await js(`document.querySelector('#qbody .options').hidden`)));
await clickEl(`[...document.querySelectorAll('#qbody .opt')].find(b=>b.textContent===__sat.state.current.answer)`);
await sleep(60); await clickEl(`document.getElementById('check')`); await sleep(120);
check('...and the right verb and right fix grade correct', await js(`document.getElementById('card').classList.contains('win')`));
const agreeId = await js(`SAT_QUESTIONS.find(q=>q.type==='tapfix'&&q.skill==='agreement').id`);
await js(`__sat.showQuestion(${JSON.stringify(agreeId)}); ''`); await sleep(120);
check('an agreement question still shows its is/are choices, which give nothing away', !(await js(`document.querySelector('#qbody .options').hidden`)));

// "No punctuation" is a real choice: it must say so, grade correctly, and light up as the right answer
await js(`__sat.showQuestion('mc-1155-2837-0')`);
await sleep(100);
const noneLabel = `[...document.querySelectorAll('.opt')].find(b => b.dataset.word === '')`;
check('the choice to add no punctuation says so', (await js(`${noneLabel}.querySelector('.otext').textContent`)) === 'no punctuation', await js(`${noneLabel}.querySelector('.otext').textContent`));
await answer(true);
check('...grades correct when it is the answer', (await js(`__sat.state.answered`)) && (await js(`document.getElementById('feedback').className`)).includes('good'), await js(`document.getElementById('feedback').className`));
check('...and lights up as the right answer', await js(`${noneLabel}.classList.contains('ok')`));

// SAT-style vocabulary: a passage, no meaning shown, the real test's wording, the right author
const satId = await js(`SAT_QUESTIONS.find(q=>q.level==='sat'&&q.source.author==='Arthur Conan Doyle').id`);
await js(`__sat.showQuestion(${JSON.stringify(satId)}); ''`); await sleep(120);
check('SAT-style question: no meaning is shown, however many times it comes up', await js(`!document.querySelector('.clue') && !document.querySelector('.stem.meaning')`));
check('...and it asks exactly what the test asks', (await js(`document.getElementById('qprompt').textContent`)) === 'Which choice completes the text with the most logical and precise word or phrase?');
await js(`(()=>{const q=__sat.state.current;[...document.querySelectorAll('#qbody .opt')].find(b=>b.dataset.word===q.answer).click();})()`);
await sleep(60); await clickEl(`document.getElementById('check')`); await sleep(120);
check('...the right word grades correct', await js(`document.getElementById('card').classList.contains('win')`));
check('...and a Holmes passage credits Conan Doyle', (await js(`document.getElementById('src').textContent`)).includes('Arthur Conan Doyle'), (await js(`document.getElementById('src').textContent`)).slice(0, 60));
check('...and the meanings appear once answered', await js(`document.querySelectorAll('#qbody .opt .def').length === 4`));

// A comma that is fine either way never counts against him
const optId = await js(`(SAT_QUESTIONS.find(q=>q.type==='forge'&&(q.optionalGaps||[]).length)||{}).id`);
await js(`__sat.showQuestion(${JSON.stringify(optId)}); ''`); await sleep(120);
check('forgery question: the page says how many errors there are', /Find (the error|both errors)/.test(await js(`document.getElementById('qprompt').textContent`)), await js(`document.getElementById('qprompt').textContent`).then(t => t.slice(0, 70)));
const coreJs = `(w)=>w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g,'').toLowerCase()`;
const tapError = async (e) => {
  const key = e.word || e.gapAfter;
  const idx = await js(`(()=>{const core=${coreJs};return [...document.querySelectorAll('.sentence .w')].findIndex(b=>core(b.textContent)===${JSON.stringify(key)})})()`);
  await clickEl(e.word ? `document.querySelectorAll('.sentence .w')[${idx}]` : `document.querySelectorAll('.sentence .g')[${idx}]`);
  await sleep(40);
};
for (const e of await js(`__sat.state.current.errors`)) await tapError(e);
const optWord = await js(`__sat.state.current.optionalGaps[0]`);
await tapError({ gapAfter: optWord });
await clickEl(`document.getElementById('check')`); await sleep(150);
check('finding the errors and also adding an optional comma still grades correct', await js(`document.getElementById('card').classList.contains('win')`));
check('...and says the comma was fine either way', (await js(`document.getElementById('qbody').textContent`)).includes('fine either way'), optWord);

// ---------------------------------------------------------------------------------------------------------- 7: resetting
await js(`window.confirm=()=>true`);
await clickEl(`document.getElementById('reset')`);
await sleep(150);
check('reset wipes progress and both cookies', (await js('__sat.progress.store.total')) === 0 && !(await js('document.cookie')).includes('lgc_cold') && !(await js('document.cookie')).includes('lgc_chest'));

// ---------------------------------------------------------------------------------------------------------- 8: a phone
// On a phone the questions fill the screen and the machine has its own tab, so he can answer question after question
// without scrolling, and only goes to the machine when he wants to play. Every tap here lands where the button already is.
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
await open('?q=vocab-78342-1164-0&noscale=1');
const onScreen = (expr) => js(`(()=>{ const e=(${expr}); if (!e) return 'missing'; const r=e.getBoundingClientRect(), t=document.getElementById('tabs').getBoundingClientRect();
  if (!(r.height > 0)) return 'no size'; if (r.top < 0) return 'above the screen'; if (r.bottom > t.top + 1) return 'below the screen (' + Math.round(r.bottom) + ' vs ' + Math.round(t.top) + ')';
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return hit && (hit === e || e.contains(hit)) ? 'ok' : 'covered by ' + (hit && (hit.id || hit.className || hit.tagName)); })()`);
const tapHere = async (expr) => { const r = await js(`(()=>{ const r = (${expr}).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`); await clickAt(r.x, r.y); };
const seenStage = `getComputedStyle(document.getElementById('stage')).visibility`, seenPanel = `getComputedStyle(document.querySelector('.panel')).visibility`;
const rightChoice = `[...document.querySelectorAll('.opt')].find(b => (b.dataset.word ?? b.textContent) === __sat.state.current.answer)`;

check('on a phone the questions come first, with the machine put away', (await js(seenStage)) === 'hidden' && (await js(seenPanel)) === 'visible' && (await js(`document.getElementById('tabStudy').getAttribute('aria-pressed')`)) === 'true');
const seen0 = [await onScreen(`document.querySelector('.opt')`), await onScreen(`[...document.querySelectorAll('.opt')].pop()`), await onScreen(`document.getElementById('check')`)];
check('the question, every choice and the Check button are on screen with no scrolling', seen0.every(s => s === 'ok'), seen0.join(' / '));
check('...and nothing sticks out sideways', await js(`document.documentElement.scrollWidth <= innerWidth && document.querySelector('.panel').scrollWidth <= document.querySelector('.panel').clientWidth`));
check('a status line keeps score, with the machine out of sight', (await js(`document.getElementById('statusText').textContent`)).includes('1/6'), await js(`document.getElementById('statusText').textContent`));
await js(`(()=>{ __sat.machine().target = 12; __sat.progress.save(); __sat.refresh(); })()`);   // room for a long run of answers before the machine fills up
await shot('11-phone-question');

const trouble = []; let toyNote = null;
for (let i = 0; i < 8; i++) {
  while (!(await js(`['vocab', 'mc'].includes(__sat.state.current.type)`))) await js('__sat.showQuestion(); 0');
  await sleep(150);
  for (const [what, expr] of [['the right choice', rightChoice], ['Check', `document.getElementById('check')`]]) { const s = await onScreen(expr); if (s !== 'ok') trouble.push(`#${i} ${what}: ${s}`); }
  await tapHere(rightChoice); await sleep(100);
  await tapHere(`document.getElementById('check')`); await sleep(250);
  for (let k = 0; k < 40 && (await js(`document.getElementById('next').hidden`)); k++) await sleep(100);      // (a busy machine can take a moment to grade)
  { const s = await onScreen(`document.getElementById('next')`); if (s !== 'ok') trouble.push(`#${i} Next: ${s}`); }
  if (i === 0) { await sleep(300); toyNote = await js(`({ shown: document.getElementById('studynote').classList.contains('show'), text: document.getElementById('studynote').textContent })`); await shot('11b-phone-answered'); }
  await tapHere(`document.getElementById('next')`); await sleep(200);
  const down = await js(`document.querySelector('.panel').scrollTop`);
  if (down !== 0) trouble.push(`#${i}: the next question opened ${down}px down`);
}
check('eight questions in a row are answered with nothing to scroll to', trouble.length === 0, trouble.slice(0, 4).join('; '));
check('a new toy is announced over the questions, because the machine is out of sight', !!toyNote && toyNote.shown && toyNote.text.includes('slots in'), toyNote && toyNote.text);
check('...and the machine kept growing while it was out of sight, a toy per answer plus the streak bonus', (await js('__sat.machine().pieces.length')) >= 9, await js('__sat.machine().pieces.length'));

// the machine, on its own tab
check('with a flick earned, a Play button and a badge on the Machine tab say so', (await onScreen(`document.getElementById('playNow')`)) === 'ok' && (await js(`!document.getElementById('tabBadge').hidden`)));
await tapHere(`document.getElementById('playNow')`); await sleep(500);
check('Play brings the machine up full screen and puts the questions away', (await js(seenStage)) === 'visible' && (await js(seenPanel)) === 'hidden' && (await js('__sat.stageHidden()')) === false);
await shot('12-phone-machine');
await ready();
await mouseFlick(-(await js('__sat.track.exitFor(__sat.machine().playFrom).dir')) * 110, 70);
check('a real pull-and-release on the phone-sized machine starts the run', await js('__sat.state.running'));
// a clue that turns up during a run must wait for the bell, not sit on the chain counter (this is what the clue timer does)
await js(`(()=>{ __sat.state.clueDue = { my: __sat.mystery(), n: 2 }; __sat.showDueClue(); })()`);
check('a clue due mid-run is held back', (await js('__sat.state.clueDue !== null')) && !(await js(`document.getElementById('announceTitle').textContent`)).includes('Clue 2 of 5'), await js(`document.getElementById('announceTitle').textContent`));
check('...and it rings the bell', await runToBell());
await sleep(1900);
check('...and the held clue is said once the run is over', (await js(`document.getElementById('announceTitle').textContent`)).includes('Clue 2 of 5') && (await js('__sat.state.clueDue === null')), await js(`document.getElementById('announceTitle').textContent`));
await tapHere(`document.getElementById('tabStudy')`); await sleep(400);
check('the Questions tab brings the question back, still with nothing to scroll to', (await js(seenStage)) === 'hidden' && (await onScreen(`document.getElementById('check')`)) === 'ok' && (await js(`document.querySelector('.panel').scrollTop`)) === 0);
check('...and the badge is gone, since that flick has been played', await js(`document.getElementById('tabBadge').hidden`));

// a chest item plays on the machine's screen, so using one takes him there
await js(`(()=>{ __sat.progress.store.chest.flood = 1; __sat.progress.store.found.flood = true; __sat.progress.save(); __sat.refresh(); })()`);
await js(`__sat.deploy('flood')`); await sleep(300);
check('using a chest item switches to the machine, where it plays', (await js('__sat.view')) === 'machine' && (await js(seenStage)) === 'visible');
await js('__sat.endBreak()'); await tapHere(`document.getElementById('tabStudy')`); await sleep(300);
check('...and the Questions tab is one tap away', (await js('__sat.view')) === 'study' && (await js(seenStage)) === 'hidden');
await send('Emulation.setDeviceMetricsOverride', { width: 1100, height: 720, deviceScaleFactor: 1, mobile: false });

// ---------------------------------------------------------------------------------------------------------- 10: strip questions
// Tap the words of one kind of phrase to cross them out (or highlight them). Synthetic items, so this tests the widget, not the content.
await open('?noscale=1');
await js(`SAT_QUESTIONS.push(
  { id: 't-strip-1', type: 'strip', skill: 'phrases', title: 'Strip the sentence', prompt: 'Cross out every prepositional phrase. What is left is the core of the sentence.', mode: 'strike',
    text: 'The foreman of the mill locked the door behind him.', answer: [2, 3, 4, 8, 9], fixedLabel: 'What is left', fixed: 'The foreman locked the door.',
    rule: 'Both prepositional phrases go: "of the mill" and "behind him".', source: { original: true, book: 'The Fire at Hallam Wharf', note: 'statement 1' } },
  { id: 't-strip-2', type: 'strip', skill: 'phrases', title: 'Find the verb phrase', prompt: 'Highlight the whole verb phrase.', mode: 'highlight',
    text: 'The crew had been working since dawn.', answer: [2, 3, 4], fixedLabel: 'The verb phrase', fixed: 'had been working',
    rule: 'The verb phrase is the main verb with its helpers: "had been working".', source: { original: true, book: 'The Fire at Hallam Wharf', note: 'statement 2' } }); 0`);
const word = (i) => `document.querySelectorAll('.sentence .w')[${i}]`;
await js(`__sat.showQuestion('t-strip-1'); 0`); await sleep(150);
check('a strip question says what it wants and starts with nothing crossed out', (await js(`document.querySelector('.sentence').classList.contains('strike')`)) && (await js(`document.querySelector('.step').textContent`)) === 'Crossed out: 0 words' && await js(`document.getElementById('check').disabled`));
await clickEl(word(1)); await sleep(40);
check('tapping a word crosses it out and counts it', (await js(`document.querySelector('.step').textContent`)) === 'Crossed out: 1 word' && await js(`${word(1)}.classList.contains('sel')`));
for (const i of [2, 3, 4, 8, 9]) { await clickEl(word(i)); await sleep(30); }
await clickEl(word(1)); await sleep(30);       // tap again: uncrossed
check('tapping it again takes it back', !(await js(`${word(1)}.classList.contains('sel')`)) && (await js(`document.querySelector('.step').textContent`)) === 'Crossed out: 5 words');
await clickEl(word(1)); await sleep(30);       // ...and cross out one too many, on purpose
await clickEl(`document.getElementById('check')`); await sleep(200);
check('crossing out a word that belongs to no prepositional phrase is wrong', await js(`document.getElementById('card').classList.contains('lose')`));
check('...the reveal marks it wrong, and the five right words right', (await js(`document.querySelectorAll('.sentence .w.bad').length`)) === 1 && (await js(`document.querySelectorAll('.sentence .w.ok').length`)) === 5);
check('...and shows what is left, credited to the story and not to a book', (await js(`document.getElementById('fixedline').textContent`)).startsWith('What is left: The foreman locked the door.') && (await js(`document.getElementById('src').textContent`)) === '— The Fire at Hallam Wharf, statement 1');
await js(`__sat.showQuestion('t-strip-1'); 0`); await sleep(150);
for (const i of [2, 3, 4, 8, 9]) { await clickEl(word(i)); await sleep(30); }
await clickEl(`document.getElementById('check')`); await sleep(200);
check('crossing out exactly the prepositional phrases is right', await js(`document.getElementById('card').classList.contains('win')`));
check('...and a missed word is shown as missed', await (async () => { await js(`__sat.showQuestion('t-strip-1'); 0`); await sleep(150); for (const i of [2, 3, 4, 8]) { await clickEl(word(i)); await sleep(30); } await clickEl(`document.getElementById('check')`); await sleep(200); return (await js(`document.querySelectorAll('.sentence .w.miss').length`)) === 1 && await js(`document.getElementById('card').classList.contains('lose')`); })());
await js(`__sat.showQuestion('t-strip-2'); 0`); await sleep(150);
for (const i of [2, 3, 4]) { await clickEl(word(i)); await sleep(30); }
check('a highlight question highlights instead of striking, and counts that way', (await js(`document.querySelector('.sentence').classList.contains('hilite')`)) && (await js(`document.querySelector('.step').textContent`)) === 'Highlighted: 3 words');
await clickEl(`document.getElementById('check')`); await sleep(200);
check('highlighting exactly the verb phrase is right', await js(`document.getElementById('card').classList.contains('win')`));
check('the Phrases meter stays out of sight until the fire storyline opens', !(await js(`[...document.querySelectorAll('#meters .ml')].map(e => e.textContent).join()`)).includes('Phrases'));
await js(`__sat.progress.store.total = 100; __sat.progress.save(); __sat.showQuestion('t-strip-2'); 0`); await sleep(150);
await js(`__sat.onCorrectForTest()`); await sleep(100);
check('...and then it has its own meter', (await js(`[...document.querySelectorAll('#meters .ml')].map(e => e.textContent).join()`)).includes('Phrases'));

// ---------------------------------------------------------------------------------------------------------- 9: the Sand Timer
// A funnel of sand over a trapdoor: a marble arrives, the trapdoor opens, the sand runs down and knocks the row over.
await open('?noscale=1');
await js(`(()=>{ const m = __sat.machine(); m.pieces = [{ id: 'p1', kind: 'dominoes', seed: 11 }, { id: 'p2', kind: 'hourglass', seed: 23 }, { id: 'p3', kind: 'dominoes', seed: 35 }]; m.target = 3; m.playFrom = 0; __sat.progress.save(); __sat.rebuild({}); })()`);
await sleep(600);
const sandInfo = () => js(`(()=>{ const t = __sat.track.sections[1], toy = t.toy; const inFunnel = toy.grains.filter(g => !g.userData.spent && g.y < toy.y + 0.2).length; return { grains: toy.grains.length, inFunnel, open: toy.triggered, fallen: t.dominoes.filter(d => d.userData.fell).length, total: t.dominoes.length }; })()`);
const sand0 = await sandInfo();
check('the Sand Timer is a toy on the unlock ladder, and its funnel starts full of sand', (await js(`Track.KINDS.hourglass.unlock`)) === 30 && sand0.grains >= 40 && sand0.inFunnel === sand0.grains && !sand0.open, JSON.stringify(sand0));
await js(`__sat.track.sections[1].toy.force()`);
await js('__sat.advance(8)');
const sand1 = await sandInfo();
check('the trapdoor opens and the sand runs right out of the funnel', sand1.open && sand1.inFunnel <= 2, JSON.stringify(sand1));
check('...and the sand knocks the row of dominoes down', sand1.fallen >= sand1.total * 0.8, `${sand1.fallen} of ${sand1.total}`);
check('the grains are drawn as sand, not as marbles', await js(`__sat.track.sections[1].toy.grains.every(g => g.userData.sand && g.userData.small)`));

// ---------------------------------------------------------------------------------------------------------- 11: the Fire Fuse
// A marble lights a rope, a flame crawls along it, and when it has burned through the ball it held drops and rolls into the row.
// Run the way the game runs it: a real flick from the top, all the way to the bell.
await open('?noscale=1');
await js(`(()=>{ const m = __sat.machine(); m.pieces = [{ id: 'p1', kind: 'dominoes', seed: 11 }, { id: 'p2', kind: 'fuse', seed: 23 }, { id: 'p3', kind: 'dominoes', seed: 35 }]; m.target = 3; m.playFrom = 0; __sat.progress.save(); __sat.rebuild({}); })()`);
await sleep(600);
await ready();
const fuseInfo = () => js(`(()=>{ const t = __sat.track.sections[1], toy = t.toy; return { type: toy.type, lit: toy.triggered, dropped: toy.released, ballAsleep: toy.ball.asleep, fallen: t.dominoes.filter(d => d.userData.fell).length, total: t.dominoes.length }; })()`);
const fuse0 = await fuseInfo();
check('the Fire Fuse is a toy that unlocks at 100 right answers, and starts unlit with its ball hanging', (await js(`Track.KINDS.fuse.unlock`)) === 100 && fuse0.type === 'fuse' && !fuse0.lit && fuse0.ballAsleep, JSON.stringify(fuse0));
await js(`__sat.flick(__sat.track.exitFor(0).dir * 4, -1)`);
let sawBurning = false;
for (let t = 0; t < 300 && (await js('__sat.state.running')); t++) {
  await js('__sat.advance(0.5)');
  const f = await fuseInfo();
  if (f.lit && !f.dropped && f.ballAsleep) sawBurning = true;
}
const fuse1 = await fuseInfo();
check('a marble lights it, and for a while it burns with the ball still hanging', sawBurning);
check('when the rope has burned through the ball drops and knocks the row down', fuse1.dropped && fuse1.fallen >= fuse1.total * 0.8, JSON.stringify(fuse1));
check('...and the whole machine runs on to the bell', !(await js('__sat.state.running')));

const realErrors = pageErrors.filter(e => !/favicon/.test(e));
check('no JavaScript errors in the whole session', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

cleanup();
process.exit(failures ? 1 : 0);
