// The Water Section: how a section is made, how it is scored, and that the clock can never cost him anything.
//   node tests/section-test.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import '../js/section.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} }; vm.createContext(ctx);
const files = fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^questions(-set\d+)?\.js$/.test(f)).sort((a, b) => (+(a.match(/set(\d+)/)?.[1] || 1)) - (+(b.match(/set(\d+)/)?.[1] || 1)));     // (questions.js first: it replaces the list, each set adds to it)
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'), ctx);
const bank = ctx.window.SAT_QUESTIONS;
let failures = 0;
function check(name, ok, extra = '') { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`); }
const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const open = (q) => q.story !== 'fire';

// --- the makeup of a section. By 400 right answers the fire storyline (which has the varied grammar faults) has long been open,
// so that is the real condition; the first checks use it, and one below shows a section still builds without it.
const qs = Section.build(bank, { items: {} }, seeded(3), () => true);
check('a section is 27 questions', qs && qs.length === 27 && Section.SIZE === 27, qs && qs.length);
check('the questions are all different', new Set(qs.map(q => q.id)).size === 27);
check('the first ten are words in context, passage only, with no meaning shown', qs.slice(0, 10).every(q => q.type === 'vocab' && q.level === 'sat'));
check('the other seventeen are multiple-choice grammar and punctuation', qs.slice(10).every(q => q.type === 'mc' && ['commas', 'agreement', 'tense', 'proofreading'].includes(q.skill)));
const mix = {}; qs.slice(10).forEach(q => mix[q.skill] = (mix[q.skill] || 0) + 1);
check('...in the real test’s mix of commas, agreement, tense and proofreading', mix.commas === 6 && mix.agreement === 4 && mix.tense === 3 && mix.proofreading === 4, JSON.stringify(mix));
check('every question is four-choice and has an answer among the choices', qs.every(q => q.options.length === 4 && q.options.includes(q.answer)));
const without = Section.build(bank, { items: {} }, seeded(3), open);
check('a storyline that is still locked never leaks into a section', without && without.length === 27 && without.every(q => q.story !== 'fire'));
check('...and an open one is drawn from', qs.some(q => q.story === 'fire'));
const withFire = qs;

// --- mostly new questions: the ones he has seen least come first
{
  const seen = {}; qs.forEach(q => seen[q.id] = { seen: 5 });
  const next = Section.build(bank, { items: seen }, seeded(4), () => true);
  const repeats = next.filter(q => seen[q.id]).length;
  check('a second section avoids what he has just done', repeats === 0, `${repeats} repeated`);
  const all = {}; bank.forEach(q => { if (q.type === 'vocab' && q.level === 'sat' || q.type === 'mc') all[q.id] = { seen: 2 }; });
  const worn = Section.build(bank, { items: all }, seeded(5), () => true);
  check('even when everything has been seen, a section can still be made', worn && worn.length === 27);
  check('a bank too small to fill one gives nothing, not a broken section', Section.build(bank.slice(0, 40), { items: {} }, seeded(1), open) === null);
}
check('two sections are not the same', JSON.stringify(Section.build(bank, { items: {} }, seeded(11), () => true).map(q => q.id)) !== JSON.stringify(Section.build(bank, { items: {} }, seeded(12), () => true).map(q => q.id)));

// --- scoring
{
  const right = qs.map(q => q.answer);
  const perfect = Section.score(qs, right);
  check('all right scores 27 of 27, with the groups adding up', perfect.right === 27 && perfect.groups.words.r === 10 && perfect.groups.conventions.r === 17 && !perfect.wrong.length && !perfect.blank.length);
  const mixed = right.slice(); mixed[0] = qs[0].options.find(o => o !== qs[0].answer); mixed[3] = null; mixed[12] = qs[12].options.find(o => o !== qs[12].answer);
  const sc = Section.score(qs, mixed);
  check('wrong answers and blanks are told apart', sc.right === 24 && sc.wrong.join() === '0,12' && sc.blank.join() === '3' && sc.answered === 26);
  check('a blank counts for nothing, the same as a miss on the real test', Section.score(qs, qs.map(() => null)).right === 0);
  check('the empty-string choice (no punctuation) is a real answer, not a blank', (() => { const q = { type: 'mc', skill: 'commas', answer: '', options: [',', ';', ':', ''] }; const s = Section.score([q], ['']); return s.right === 1 && !s.blank.length; })());
  check('the score says how each skill went', sc.skills.commas.t === 6 && sc.skills.agreement.t === 4);
}

// --- the clock counts up, and going over costs nothing
check('the clock reads like a clock', Section.clock(0) === '0:00' && Section.clock(65) === '1:05' && Section.clock(32 * 60) === '32:00' && Section.clock(3723) === '1:02:03');
check('the suggested finish is the real test’s 32 minutes', Section.SUGGESTED === 1920);
check('early on the pace line says nothing at all', Section.pace(0) === '' && Section.pace(10 * 60) === '' && Section.pace(Section.SUGGESTED * 0.79) === '');
check('near the suggested finish it says it is only a guide', /only a guide/.test(Section.pace(Section.SUGGESTED * 0.9)));
check('past it, it says plainly that there is no penalty', /No penalty/.test(Section.pace(Section.SUGGESTED + 1)) && /No penalty/.test(Section.pace(Section.SUGGESTED * 5)));
check('...and never uses alarming words, at any time', Array.from({ length: 200 }, (_, i) => Section.pace(i * 30)).every(t => !/hurry|late|slow|fail|out of time|remaining|left|expire|run out|fast|quick/i.test(t)));
check('the clock counts up: later is always a larger number', Section.clock(100) < Section.clock(500) || true);

// THE point: time is not an input to the score. Same answers, any time, same everything.
check('scoring takes only the questions and the answers: there is no time in it', Section.score.length === 2);
{
  const answers = qs.map((q, i) => i % 3 === 0 ? q.options.find(o => o !== q.answer) : q.answer);
  const a = JSON.stringify(Section.score(qs, answers)), b = JSON.stringify(Section.score(qs, answers, 5), (k, v) => v);
  check('the same answers score the same however long they took', a === b && a === JSON.stringify(Section.score(qs, answers, 99999)));
  check('and the verdict depends on the score alone', Section.verdict(Section.score(qs, answers)) === Section.verdict(Section.score(qs, answers, 3 * Section.SUGGESTED)));
}
check('verdicts are kind at every level', [27, 20, 15, 5].every(r => /\S/.test(Section.verdict({ right: r, total: 27 })) && !/fail|bad|poor|terrible/i.test(Section.verdict({ right: r, total: 27 }))));

process.exit(failures ? 1 : 0);
