#!/usr/bin/env node
// Builds the fire storyline from its parts:
//   data/fire-story.json   the inquiry itself: 10 chapters of numbered statements, and the solution
//   data/fire-items.json   the grammar items drafted from those statements, after a blind solve
// and writes data/fire-story.js (the case file the player reads) and data/questions-set6.js (the questions).
//   node scripts/apply-fire.mjs
// Every item is derived from one numbered statement, and is checked against it: a strip question's sentence is the statement
// word for word, its answer positions are in range, and "what is left" really is what is left; an agreement, forgery or
// choice question's correct version is the statement. Anything that fails a check is listed and left out.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'fire-story.json'), 'utf8'));
const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'fire-items.json'), 'utf8'));
const statements = {};
for (const c of story.chapters) for (const s of c.statements) statements[s.seq] = s.text;
const words = s => s.replace(/_/g, '').toLowerCase().replace(/[^a-z0-9’'\s-]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
const core = w => w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase();
const SOURCE = seq => ({ original: true, book: story.title, note: `statement ${seq} of 120` });

const TITLES = { pp: 'Strip the sentence', subject: 'Find the complete subject', verb: 'Find the verb phrase', appositive: 'Cut the extra phrase', object: 'Find the direct object' };
const problems = [], out = [], counts = {}, used = {};
const fail = (it, why) => problems.push(`${it.kind}${it.task ? '/' + it.task : ''} #${it.seq}: ${why}`);
const idFor = (base) => { used[base] = (used[base] || 0) + 1; return used[base] === 1 ? base : `${base}-${used[base]}`; };

for (const it of items) {
  const st = statements[it.seq];
  if (!st) { fail(it, 'no such statement'); continue; }
  const tokens = st.split(/\s+/);
  let q = null;
  if (it.kind === 'strip') {
    if (!TITLES[it.task]) { fail(it, 'unknown task'); continue; }
    if (it.text !== st) { fail(it, 'the sentence is not the statement word for word'); continue; }
    const a = it.answer;
    if (!Array.isArray(a) || !a.length || a.some((i, k) => !Number.isInteger(i) || i < 0 || i >= tokens.length || (k && i <= a[k - 1]))) { fail(it, 'answer positions are empty, out of range or not increasing'); continue; }
    const picked = a.map(i => tokens[i]).join(' '), left = tokens.filter((_, i) => !a.includes(i)).join(' ');
    if (it.mode === 'strike' ? words(it.fixed) !== words(left) : words(it.fixed) !== words(picked)) { fail(it, `"${it.fixedLabel}" does not match the answer (${it.mode === 'strike' ? left : picked})`); continue; }
    if (it.mode === 'strike' && a.length === tokens.length) { fail(it, 'strikes everything'); continue; }
    if (!it.rule || !it.prompt || !it.fixedLabel) { fail(it, 'needs a prompt, a label and a rule'); continue; }
    q = { id: idFor(`fire-strip-${it.task}-${it.seq}`), type: 'strip', skill: 'phrases', story: 'fire', seq: it.seq, title: TITLES[it.task], prompt: it.prompt, mode: it.mode, text: st, answer: a, fixedLabel: it.fixedLabel, fixed: it.fixed, rule: it.rule, source: SOURCE(it.seq) };
  } else if (it.kind === 'agree') {
    if (it.text.split('___').length !== 2) { fail(it, 'needs exactly one blank'); continue; }
    if (it.fixed !== st) { fail(it, 'the correct version is not the statement'); continue; }
    if (words(it.text.replace('___', it.answer)) !== words(st)) { fail(it, 'text with the answer in it is not the statement'); continue; }
    if (!it.options.includes(it.answer) || new Set(it.options).size !== it.options.length || it.options.length < 2) { fail(it, 'options are wrong'); continue; }
    if (!it.text.split(/\s+/).some(w => it.targetWords.includes(core(w)))) { fail(it, 'target word is not in the sentence'); continue; }
    q = { id: idFor(`fire-agree-${it.seq}`), type: 'tapfix', skill: 'agreement', story: 'fire', seq: it.seq, title: 'Find the real subject', prompt1: 'Step 1: Tap the subject, the word that the missing verb has to agree with.', prompt2: 'Step 2: Which verb fits?', text: it.text, targetWords: it.targetWords, options: it.options, answer: it.answer, fixed: st, hint1: it.hint1, rule: it.rule, source: SOURCE(it.seq) };
  } else if (it.kind === 'mc') {
    if (!['agreement', 'commas', 'tense', 'proofreading'].includes(it.skill)) { fail(it, 'unknown skill'); continue; }
    if (it.stem.split('___').length !== 2) { fail(it, 'needs exactly one blank'); continue; }
    if (it.options.length !== 4 || new Set(it.options).size !== 4 || !it.options.includes(it.answer)) { fail(it, 'needs four different options including the answer'); continue; }
    if (it.fixed !== st) { fail(it, 'the correct version is not the statement'); continue; }
    if (!words(st).includes(words(it.stem.replace('___', it.answer)))) { fail(it, 'stem with the answer in it is not part of the statement'); continue; }
    q = { id: idFor(`fire-mc-${it.seq}`), type: 'mc', skill: it.skill, story: 'fire', seq: it.seq, title: 'Which choice follows Standard English?', prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?', stem: it.stem, options: it.options, answer: it.answer, fixed: st, rule: it.rule, source: SOURCE(it.seq) };
  } else if (it.kind === 'forge') {
    if (it.fixed !== st) { fail(it, 'the correct version is not the statement'); continue; }
    if (!it.errors.length || it.errors.length > 2) { fail(it, 'needs one or two errors'); continue; }
    const T = it.text.split(/\s+/).map(core);
    let ok = true;
    for (const e of it.errors) { const key = e.word || e.gapAfter; if (!key || T.filter(w => w === key).length !== 1) { ok = false; fail(it, `"${key}" must appear exactly once in the forged text`); } }
    if (!ok) continue;
    const when = /\b(was|were|had|did|said|saw|found|told|asked|reached|arrived|started|began)\b/.test(st) ? ', which is told in the past tense' : '';
    q = { id: idFor(`fire-forge-${it.seq}`), type: 'forge', skill: 'proofreading', story: 'fire', seq: it.seq, title: 'The forged statement', prompt: `A forger tampered with this witness statement${when}. Find ${it.errors.length === 1 ? 'the error' : 'both errors'}. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.`, text: it.text, errors: it.errors, fixed: st, rule: it.rule, source: SOURCE(it.seq) };
    if (it.optionalGaps) q.optionalGaps = it.optionalGaps;
  } else { fail(it, 'unknown kind'); continue; }
  out.push(q); counts[q.type + '/' + q.skill] = (counts[q.type + '/' + q.skill] || 0) + 1;
}

const reached = new Set(out.map(q => q.seq));
const header = '/* Question set 6: the fire storyline, "The Fire at Hallam Wharf". Original sentences from an invented inquiry, so each is credited to the story and not to a book (see scripts/apply-fire.mjs). Locked until 100 right answers. */';
fs.writeFileSync(path.join(ROOT, 'data', 'questions-set6.js'), `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(out, null, 1)});\n`);
fs.writeFileSync(path.join(ROOT, 'data', 'fire-story.js'), `/* The fire storyline: the inquiry the player reads as questions are solved. The statements are found one at a time (see js/game.js). */\nwindow.SAT_STORIES = window.SAT_STORIES || {};\nwindow.SAT_STORIES.fire = ${JSON.stringify({ title: story.title, cast: story.cast, chapters: story.chapters, solution: story.solution }, null, 1)};\n`);
console.log(`${out.length} questions from ${reached.size} of ${Object.keys(statements).length} statements; ${problems.length} items left out`);
console.log(JSON.stringify(counts));
problems.forEach(p => console.log('  LEFT OUT ' + p));
