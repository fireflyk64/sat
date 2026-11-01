#!/usr/bin/env node
// Apply reviewer fixes/drops for vocab items to data/questions.js.
//   node scripts/apply-vocab-fixes.mjs fixes1.json [fixes2.json ...]
// A fix replaces an item's options + definitions (the answer must be kept, each option needs a definition).
// Every fix is validated before it is applied; drops are reported (the item is removed).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'questions.js');
const src = fs.readFileSync(OUT, 'utf8');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
const items = ctx.window.SAT_QUESTIONS, byId = new Map(items.map(q => [q.id, q]));
const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
let fixed = 0, dropped = 0, refused = [];
const drop = new Set();
for (const f of process.argv.slice(2).flatMap(p => JSON.parse(fs.readFileSync(p, 'utf8')))) {
  const q = byId.get(f.id);
  if (!q || q.type !== 'vocab') { refused.push(f.id + ': unknown vocab id'); continue; }
  if (f.action === 'drop') { drop.add(q.id); dropped++; continue; }
  const ok = Array.isArray(f.options) && f.options.length === 4 && new Set(f.options).size === 4 && f.options.includes(q.answer)
    && f.options.every(o => typeof f.definitions?.[o] === 'string' && f.definitions[o].length >= 4);
  if (!ok) { refused.push(f.id + ': invalid fix'); continue; }
  q.options = f.options; q.definitions = Object.fromEntries(f.options.map(o => [o, f.definitions[o]])); fixed++;
}
const kept = items.filter(q => !drop.has(q.id));
fs.writeFileSync(OUT, `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(kept, null, 1)};\n`);
console.log(`fixed ${fixed}, dropped ${dropped}, refused ${refused.length}; bank now ${kept.length} items`);
refused.forEach(r => console.log('  REFUSED', r));
