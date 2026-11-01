#!/usr/bin/env node
// Builds data/questions-set5.js: vocabulary in the format of the digital SAT's "Words in Context" questions. A short passage,
// one blank, four choices, and no meaning shown, so the passage alone has to decide the answer. Half are from Sherlock Holmes
// and half from Christie. Target words come from a college-level word list; the definitions are written for this game.
//   node scripts/apply-sat-vocab.mjs data/sat-vocab-drafts.json
// Drafts: [{ word, g, book, form, passage, options, definitions, rule } | { word, drop: true }]. Everything is checked before writing.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const drafts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const HOLMES = new Set([1661, 834, 108, 2350, 69700, 244, 2097, 2852, 3289]);
const TITLE = 'Words in context', PROMPT = 'Which choice completes the text with the most logical and precise word or phrase?';
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
const problems = [], out = [], words = new Set(), passages = new Set();
let dropped = 0;
for (const d of drafts) {
  if (d.drop) { dropped++; continue; }
  const bad = why => problems.push(`${d.word}: ${why}`), start = problems.length;
  const re = new RegExp(`\\b${d.form}\\b`, 'g');
  const hits = (d.passage && d.passage.match(re) || []).length;
  if (hits !== 1) { bad(`the word appears ${hits} times in the passage`); continue; }
  if (!Array.isArray(d.options) || d.options.length !== 4 || new Set(d.options.map(o => o.toLowerCase())).size !== 4 || !d.options.includes(d.form)) bad('needs 4 distinct options including the answer');
  else for (const o of d.options) {
    if (!/^[A-Za-z’'-]+$/.test(o)) bad(`"${o}" is not a single word`);
    const def = d.definitions && d.definitions[o];
    if (typeof def !== 'string' || def.split(/\s+/).length < 2 || def.split(/\s+/).length > 14 || /[—–]/.test(def)) bad(`definition of "${o}"`);
  }
  if (typeof d.rule !== 'string' || d.rule.length < 20 || /[—–]/.test(d.rule)) bad('bad rule');
  if (words.has(d.word) || passages.has(d.passage)) bad('used twice');
  if (problems.length > start) continue;
  words.add(d.word); passages.add(d.passage);
  out.push({
    id: `vocab-sat-${d.g}-${hash(d.passage)}`, type: 'vocab', skill: 'vocab', level: 'sat', title: TITLE, prompt: PROMPT,
    stem: d.passage.replace(new RegExp(`\\b${d.form}\\b`), '___'), options: d.options, answer: d.form,
    definitions: Object.fromEntries(d.options.map(o => [o, d.definitions[o]])), fixed: d.passage, rule: d.rule,
    source: { book: d.book, gutenberg: d.g, author: HOLMES.has(d.g) ? 'Arthur Conan Doyle' : 'Agatha Christie' }
  });
}
const holmes = out.filter(q => HOLMES.has(q.source.gutenberg)), christie = out.filter(q => !HOLMES.has(q.source.gutenberg));
console.log(`${holmes.length} Holmes, ${christie.length} Christie, ${dropped} dropped, ${problems.length} problems`);
if (problems.length) { problems.slice(0, 40).forEach(p => console.log('  ' + p)); process.exit(1); }
// an even split: take the same number from each author
const n = Math.min(holmes.length, christie.length), even = [...holmes.slice(0, n), ...christie.slice(0, n)];
fs.writeFileSync(path.join(ROOT, 'data', 'questions-set5.js'),
  `/* Question set 5: SAT-style vocabulary in context, half Holmes and half Christie (see scripts/apply-sat-vocab.mjs). */\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(even, null, 1)});\n`);
console.log(`written: ${even.length} questions, ${n} from each author`);
