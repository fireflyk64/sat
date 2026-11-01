#!/usr/bin/env node
// Applies an independent review of the forged-statement questions: corrected explanations, commas that are fine either way,
// and questions dropped as arguable. Also states the tense in every prompt, since a single sentence may not show it.
//   node scripts/apply-forge-audit.mjs data/forge-audit-fixes.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixes = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const core = w => w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase();
const stats = { dropped: 0, rules: 0, optional: 0, ambiguous: 0, prompts: 0 };
const notes = [];
for (const file of ['questions.js', 'questions-set2.js']) {
  const p = path.join(ROOT, 'data', file), src = fs.readFileSync(p, 'utf8');
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '', items = [];
  for (const q of ctx.window.SAT_QUESTIONS) {
    if (q.type !== 'forge') { items.push(q); continue; }
    const f = fixes[q.id];
    if (f && f.drop) { stats.dropped++; continue; }
    if (f && f.rule && q.rule !== f.rule) { q.rule = f.rule; stats.rules++; }
    let keep = true;
    for (const w of (f && f.optional) || []) {
      const key = core(w), T = q.fixed.trim().split(/\s+/), at = T.map((t, i) => (core(t) === key ? i : -1)).filter(i => i >= 0);
      if (!at.length) { notes.push(`${q.id}: "${w}" is not in the passage`); continue; }
      // the game attaches an optional comma to a word's first occurrence, so a repeated word can't be marked reliably
      if (at.length > 1) { keep = false; stats.ambiguous++; break; }
      if (!/,$/.test(T[at[0]]) && !(q.optionalGaps || []).includes(key)) { (q.optionalGaps = q.optionalGaps || []).push(key); stats.optional++; }
    }
    if (!keep) { stats.dropped++; continue; }
    const told = 'A forger tampered with this witness statement, which is told in the past tense.';
    if (!q.prompt.startsWith(told)) { q.prompt = q.prompt.replace('A forger tampered with this witness statement.', told); stats.prompts++; }
    items.push(q);
  }
  fs.writeFileSync(p, /set\d+\.js$/.test(file)
    ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(items, null, 1)});\n`
    : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(items, null, 1)};\n`);
}
console.log(JSON.stringify(stats));
notes.forEach(n => console.log('  ' + n));
