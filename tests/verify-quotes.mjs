// Verifies every item's sentence(s) really occur in its Project Gutenberg source, word for word
// (punctuation and capitalisation are compared separately, since answer keys use modern punctuation).
// Also lints each item's structure. Usage: node tests/verify-quotes.mjs [--strict-punct]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache'); fs.mkdirSync(CACHE, { recursive: true });
const ctx = { window: {} }; vm.createContext(ctx);
// every bank file, in load order: questions.js, then questions-set2.js, set3 ... (each later set appends to window.SAT_QUESTIONS)
const bankFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^questions(-set\d+)?\.js$/.test(f))
  .sort((a, b) => (+(a.match(/set(\d+)/)?.[1] || 1)) - (+(b.match(/set(\d+)/)?.[1] || 1)));
for (const f of bankFiles) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'), ctx);
console.log('bank files:', bankFiles.join(', '));
const items = ctx.window.SAT_QUESTIONS;

const wordsOf = s => s.replace(/_/g, '').toLowerCase().replace(/[^a-z0-9’'\s-]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
const books = {};
async function book(id) {
  if (books[id]) return books[id];
  const f = path.join(CACHE, `pg${id}.txt`);
  if (!fs.existsSync(f)) fs.writeFileSync(f, await (await fetch(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`)).text());
  return (books[id] = { words: ' ' + wordsOf(fs.readFileSync(f, 'utf8')) + ' ', raw: fs.readFileSync(f, 'utf8').replace(/\r/g, '').replace(/_/g, '').replace(/\s+/g, ' ') });
}

let bad = 0; const ids = new Set(); const kinds = {};
for (const q of items) {
  const problems = [];
  if (ids.has(q.id)) problems.push('duplicate id'); ids.add(q.id);
  const b = await book(q.source.gutenberg);
  const sentence = (q.fixed || q.text || q.stem.replace('___', q.answer)).replace(/_/g, '');
  if (!b.words.includes(' ' + wordsOf(sentence) + ' ')) problems.push('sentence not found in the book');
  if (q.type === 'mc' || q.type === 'vocab') {
    if (!q.options.includes(q.answer)) problems.push('answer not in options');
    if (new Set(q.options).size !== q.options.length) problems.push('duplicate options');
  }
  if (q.type === 'tapfix') {
    if (!q.options.includes(q.answer)) problems.push('answer not in options');
    if (!q.text.split(/\s+/).some(w => q.targetWords.includes(w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase()))) problems.push('targetWords not in text');
  }
  if (!q.rule) problems.push('no rule');
  if (q.type === 'vocab') {
    // (an "a"/"an" before the blank is folded into each choice at runtime, so it cannot hint at the answer)
    if (!q.definitions || q.options.some(o => !q.definitions[o])) problems.push('missing definition');
  }
  kinds[q.type + '/' + q.skill] = (kinds[q.type + '/' + q.skill] || 0) + 1;
  if (problems.length) { bad++; console.log('PROBLEM', q.id, problems.join('; ')); }
}
// Conjunction questions must be a real decision: the same choices every time, and the comma right only some of the time.
const conj = {};
for (const q of items) {
  if (q.type !== 'mc') continue;
  const m = q.options.map(o => /^[,;:\s]*(and|but|so|yet|or)[,;:\s]*$/i.exec(o));
  if (!m.every(Boolean)) {
    if (/___\s+(and|but|so|yet|or)\b/i.test(q.stem)) { bad++; console.log('PROBLEM', q.id, 'blank right before a conjunction, but the conjunction is not in the choices'); }
    continue;
  }
  const w = m[0][1].toLowerCase(), want = [`, ${w}`, ` ${w}`, ` ${w},`];
  const problems = [];
  if (!want.every(o => q.options.includes(o))) problems.push(`choices must include ${want.map(o => JSON.stringify(o)).join(' ')}`);
  if (q.stem.replace('___', q.answer).replace(/\s+/g, ' ').trim() !== q.fixed.replace(/\s+/g, ' ').trim()) problems.push('stem + answer does not reproduce the sentence');
  if (problems.length) { bad++; console.log('PROBLEM', q.id, problems.join('; ')); }
  const c = conj[w] || (conj[w] = { comma: 0, none: 0, after: 0 });
  c[q.answer === `, ${w}` ? 'comma' : q.answer === ` ${w}` ? 'none' : 'after']++;
}
// Forged statements stay manageable: 1 or 2 errors, each a real difference from the correct passage
for (const q of items) {
  if (q.type !== 'forge') continue;
  const problems = [], T = q.text.trim().split(/\s+/), F = q.fixed.trim().split(/\s+/);
  if (q.errors.length < 1 || q.errors.length > 2) problems.push(`${q.errors.length} errors`);
  if (T.length !== F.length) problems.push('forged and correct passages differ in length');
  else {
    let diffs = 0;
    T.forEach((t, i) => { if (t === F[i]) return; if (t.replace(/,$/, '') !== F[i].replace(/,$/, '')) diffs++; if (/,$/.test(t) !== /,$/.test(F[i])) diffs++; });
    if (diffs !== q.errors.length) problems.push(`${q.errors.length} errors listed but ${diffs} differences in the text`);
  }
  if (!/Find (the error|both errors)/.test(q.prompt)) problems.push('prompt does not match the error count');
  if ((q.errors.length === 1) !== /Find the error/.test(q.prompt)) problems.push('prompt says the wrong number of errors');
  if (problems.length) { bad++; console.log('PROBLEM', q.id, problems.join('; ')); }
}
// SAT-style vocabulary: half Holmes, half Christie, each with exactly one blank in a real passage
{
  const sat = items.filter(q => q.level === 'sat'), holmes = sat.filter(q => q.source.author === 'Arthur Conan Doyle');
  for (const q of sat) if (q.stem.split('___').length !== 2) { bad++; console.log('PROBLEM', q.id, 'needs exactly one blank'); }
  console.log(`  SAT-style vocabulary: ${sat.length} questions, ${holmes.length} from Holmes, ${sat.length - holmes.length} from Christie`);
  if (sat.length && Math.abs(holmes.length / sat.length - 0.5) > 0.1) { bad++; console.log('PROBLEM', 'SAT-style set is not an even split'); }
}
for (const w of ['and', 'but', 'so']) {
  const c = conj[w] || { comma: 0, none: 0, after: 0 }, total = c.comma + c.none + c.after, share = c.comma / (total || 1);
  console.log(`  "${w}": ${total} questions: comma first ${c.comma}, no comma ${c.none}, comma after ${c.after} (the comma is right ${Math.round(share * 100)}% of the time)`);
  if (!total || share > 0.65 || share < 0.35) { bad++; console.log('PROBLEM', `"${w}" is unbalanced: always guessing the comma should not work`); }
}
console.log(`${items.length} items checked, ${bad} with problems`);
console.log(JSON.stringify(kinds));
process.exit(bad ? 1 : 0);
