#!/usr/bin/env node
// Builds data/questions-set4.js: harder vocabulary, chosen so the right answer does not stick out. Real SAT-level target words,
// real Christie sentences, and wrong choices that are just as hard. The definitions are written for this game.
//   node scripts/apply-hard-vocab.mjs data/vocab-hard-drafts.json data/vocab-hard-fixes.json
// Drafts: [{ word, g, book, form, s, options, definitions, rule } | { word, drop: true, why }]. Everything is checked before writing.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const drafts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const fixes = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};   // an independent review's corrections, by id
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['questions.js', 'questions-set2.js', 'questions-set3.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'), ctx);
const bank = ctx.window.SAT_QUESTIONS, sample = bank.find(q => q.type === 'vocab');
const norm = s => s.replace(/_/g, '').toLowerCase().replace(/[^a-z0-9’'\s-]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
const taken = bank.map(q => norm(q.fixed || q.text || '')).join(' | ');
const answered = new Set(bank.filter(q => q.type === 'vocab').map(q => q.answer.toLowerCase()));
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };

const problems = [], out = [], seen = new Set(), seenSentence = new Set();
let dropped = 0;
for (const d of drafts) {
  if (d.drop) { dropped++; continue; }
  const bad = why => problems.push(`${d.word}: ${why}`);
  const start = problems.length;
  if (!d.s || !d.form || !d.s.includes(d.form)) { bad('the form is not in the sentence'); continue; }
  const re = new RegExp(`\\b${d.form}\\b`);
  const hits = d.s.split(re).length - 1;
  if (hits !== 1) bad(`the word appears ${hits} times in its sentence`);
  const stem = d.s.replace(re, '___');
  if (!Array.isArray(d.options) || d.options.length !== 4 || new Set(d.options.map(o => o.toLowerCase())).size !== 4) bad('needs 4 distinct options');
  else {
    if (!d.options.includes(d.form)) bad('the answer is not among the options');
    if (d.options.some(o => !/^[A-Za-z’'-]+$/.test(o))) bad('an option is not a single word');
    for (const o of d.options) {
      const def = d.definitions && d.definitions[o];
      if (typeof def !== 'string' || def.split(/\s+/).length < 2 || def.split(/\s+/).length > 14) bad(`definition of "${o}"`);
      else if (/[—–]/.test(def)) bad(`dash in the definition of "${o}"`);
    }
    // the answer's definition is shown as a clue, so it must not give the word away
    const clue = (d.definitions && d.definitions[d.form] || '').toLowerCase(), root = d.form.toLowerCase().replace(/(ing|ed|es|s|ly)$/, '').slice(0, 5);
    if (root.length >= 4 && clue.split(/\W+/).some(w => w.startsWith(root))) bad(`the clue gives the word away: "${clue}"`);
  }
  if (typeof d.rule !== 'string' || d.rule.length < 20 || /[—–]/.test(d.rule)) bad('bad rule');
  if (problems.length > start) continue;
  // no repeats: the first use of a sentence or an answer word wins, and later ones are left out
  if (taken.includes(norm(d.s)) || seenSentence.has(d.s) || seen.has(d.form.toLowerCase()) || answered.has(d.form.toLowerCase())) { dropped++; continue; }
  seen.add(d.form.toLowerCase()); seenSentence.add(d.s);
  out.push({
    id: `vocab-hard-${d.g}-${hash(d.s)}`, type: 'vocab', skill: 'vocab', level: 'hard', title: sample.title, prompt: sample.prompt,
    stem, options: d.options, answer: d.form, definitions: Object.fromEntries(d.options.map(o => [o, d.definitions[o]])),
    fixed: d.s, rule: d.rule, source: { book: d.book, gutenberg: d.g }
  });
}
// apply the review: corrected wording, swapped wrong choices, and questions dropped
const used = new Set(), reviewed = [];
for (const q of out) {
  const f = fixes[q.id];
  if (!f) { reviewed.push(q); continue; }
  used.add(q.id);
  if (f.drop) { dropped++; continue; }
  for (const [was, now, meaning] of f.replace || []) {
    const i = q.options.indexOf(was);
    if (i < 0 || was === q.answer) { problems.push(`${q.id}: can't replace "${was}"`); continue; }
    if (q.options.includes(now)) { problems.push(`${q.id}: "${now}" is already a choice`); continue; }
    q.options[i] = now; delete q.definitions[was]; q.definitions[now] = meaning;
  }
  Object.assign(q.definitions, f.defs || {});
  if (f.rule) q.rule = f.rule;
  reviewed.push(q);
}
for (const id of Object.keys(fixes)) if (!used.has(id)) problems.push(`review refers to an unknown question: ${id}`);
out.length = 0; out.push(...reviewed);
for (const q of out) for (const o of q.options) if (!q.definitions[o]) problems.push(`${q.id}: no definition for "${o}"`);
console.log(`${out.length} questions, ${dropped} dropped, ${problems.length} problems`);
if (problems.length) { problems.slice(0, 40).forEach(p => console.log('  ' + p)); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'data', 'questions-set4.js'),
  `/* Question set 4: harder vocabulary, with wrong choices as hard as the answer (see scripts/apply-hard-vocab.mjs). */\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(out, null, 1)});\n`);
console.log('written');
