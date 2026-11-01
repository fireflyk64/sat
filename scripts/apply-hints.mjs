#!/usr/bin/env node
// Adds a short, deliberately vague hint ("can mean to clarify") to each passage-only vocabulary question (set 5), from data/sat-hints.json.
// Without any hint there are often several defensible words; the hint rules out the near misses without handing over the answer.
// The normal question card shows it; the Water Section does not, because the real test gives none.
//   node scripts/apply-hints.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'sat-hints.json'), 'utf8'));
const p = path.join(ROOT, 'data', 'questions-set5.js'), src = fs.readFileSync(p, 'utf8');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
let n = 0; const bad = [];
for (const q of ctx.window.SAT_QUESTIONS) {
  const h = hints[q.id];
  if (!h) continue;
  if (!/^can mean [^.]+$/.test(h) || new RegExp('\\b' + q.answer + '\\b', 'i').test(h)) { bad.push(q.id + ': ' + h); continue; }
  q.hint = h; n++;
}
fs.writeFileSync(p, `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(ctx.window.SAT_QUESTIONS, null, 1)});\n`);
console.log(`${n} hints added`); bad.forEach(b => console.log('  SKIPPED ' + b));
