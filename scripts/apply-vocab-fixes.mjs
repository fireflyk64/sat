#!/usr/bin/env node
// Apply reviewer fixes/drops for vocab items to a bank file (default data/questions.js).
//   node scripts/apply-vocab-fixes.mjs [--file data/questions-set2.js] fixes1.json [fixes2.json ...]
// A fix replaces an item's options + definitions (the answer must be kept, each option needs a definition).
// Every fix is validated before it is applied; drops are reported (the item is removed).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--file');
const OUT = path.resolve(fi >= 0 ? argv.splice(fi, 2)[1] : path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'questions.js'));
const src = fs.readFileSync(OUT, 'utf8');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
const SET2PLUS = /questions-set\d+\.js$/.test(OUT);
const items = ctx.window.SAT_QUESTIONS, byId = new Map(items.map(q => [q.id, q]));
const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
let fixed = 0, dropped = 0, refused = [];
const drop = new Set();
for (const f of argv.flatMap(p => JSON.parse(fs.readFileSync(p, 'utf8')))) {
  const q = byId.get(f.id);
  if (!q) continue;                        // not in this bank (e.g. already dropped at import)
  if (q.type !== 'vocab' && f.action === 'drop') { drop.add(q.id); dropped++; continue; }
  if (q.type !== 'vocab') { refused.push(f.id + ': fix only applies to vocab'); continue; }
  if (f.action === 'drop') { drop.add(q.id); dropped++; continue; }
  const ok = Array.isArray(f.options) && f.options.length === 4 && new Set(f.options).size === 4 && f.options.includes(q.answer)
    && f.options.every(o => typeof f.definitions?.[o] === 'string' && f.definitions[o].length >= 4);
  if (!ok) { refused.push(f.id + ': invalid fix'); continue; }
  q.options = f.options; q.definitions = Object.fromEntries(f.options.map(o => [o, f.definitions[o]])); fixed++;
}
const kept = items.filter(q => !drop.has(q.id));
fs.writeFileSync(OUT, SET2PLUS
  ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(kept, null, 1)});\n`
  : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(kept, null, 1)};\n`);
console.log(`fixed ${fixed}, dropped ${dropped}, refused ${refused.length}; bank now ${kept.length} items`);
refused.forEach(r => console.log('  REFUSED', r));
