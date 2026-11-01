#!/usr/bin/env node
// Forged-statement questions used to plant 3 errors in every passage and grade them all-or-nothing, which overwhelmed the student.
// This cuts each one down to the 1 or 2 clearest errors, repairs the rest, trims to a single sentence when the errors allow it,
// and records commas that are fine either way so they are never marked wrong.
//   node scripts/apply-forge-simplify.mjs data/forge-decisions.json
// Decisions: [{ id, keep: [error numbers], rule, optional: [words] } | { id, drop: true }]. Everything is checked before writing.
// Safe to run again: questions already cut down are left alone.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const decisions = new Map(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).map(d => [d.id, d]));
const core = w => w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase();
const ABBR = /^(Mr|Mrs|Messrs|Dr|St|Mme|M|Mlle|Capt|Col|Sir|Hon|Rev|No|vs)\.$/;
const TAP = 'Tap a word that is wrong, or tap a space where a comma is missing or does not belong.';
const problems = [];

/** The list of differences between the forged and correct passages, each located by token. */
function differences(T, F) {
  const out = [];
  T.forEach((t, i) => {
    if (t === F[i]) return;
    const tc = t.replace(/,$/, ''), fc = F[i].replace(/,$/, '');
    if (tc !== fc) out.push({ i, word: true, forged: tc, fix: fc });
    if (/,$/.test(t) !== /,$/.test(F[i])) out.push({ i, word: false, comma: /,$/.test(F[i]) });
  });
  return out;
}

function simplify(q, d) {
  const bad = why => { problems.push(`${q.id}: ${why}`); return false; };
  const T = q.text.trim().split(/\s+/), F = q.fixed.trim().split(/\s+/);
  if (T.length !== F.length) return bad('passages differ in length');
  const diffs = differences(T, F);
  const located = q.errors.map(e => {
    const w = e.word || e.gapAfter, i = T.findIndex(t => core(t) === w);
    return diffs.find(x => x.i === i && x.word === !!e.word) && { e, i, diff: diffs.find(x => x.i === i && x.word === !!e.word) };
  });
  if (located.some(x => !x) || diffs.length !== q.errors.length) return bad('errors do not match the differences');
  if (!Array.isArray(d.keep) || !d.keep.length || d.keep.length > 2 || new Set(d.keep).size !== d.keep.length || d.keep.some(n => !located[n])) return bad(`bad keep ${JSON.stringify(d.keep)}`);
  if (typeof d.rule !== 'string' || d.rule.length < 15 || /[—–]/.test(d.rule)) return bad('bad rule');

  const kept = d.keep.map(n => located[n]), gone = located.filter((_, n) => !d.keep.includes(n));
  // the explanation must be about what stayed, and must not talk about what was repaired
  const text = d.rule.toLowerCase();
  kept.forEach(k => { if (k.diff.word && !text.includes(k.diff.fix.replace(/[^A-Za-z’'-]/g, '').toLowerCase())) problems.push(`${q.id}: rule does not name the fix "${k.diff.fix}"`); });
  // quoting a repaired MISTAKE would be confusing. Quoting the corrected word is fine: it is simply part of the sentence now.
  const fixes = kept.filter(k => k.diff.word).map(k => k.diff.fix.toLowerCase());
  gone.forEach(g => {
    if (!g.diff.word || fixes.includes(g.diff.forged.toLowerCase())) return;
    if (new RegExp(`["“']${g.diff.forged.replace(/[^A-Za-z’'-]/g, '')}["”']`).test(d.rule)) problems.push(`${q.id}: rule mentions the repaired mistake "${g.diff.forged}"`);
  });

  // repair everything that is not being kept
  const out = T.slice();
  gone.forEach(g => { out[g.i] = F[g.i]; });

  // sentences, by token
  const starts = [0];
  for (let i = 0; i < F.length - 1; i++) if (/[.!?]$/.test(F[i]) && !ABBR.test(F[i]) && /^[A-Z]/.test(F[i + 1])) starts.push(i + 1);
  const sentenceOf = i => { let s = 0; starts.forEach((b, n) => { if (i >= b) s = n; }); return s; };
  let from = 0, to = F.length;
  const which = new Set(kept.map(k => sentenceOf(k.i)));
  if (which.size === 1) {
    const s = [...which][0], a = starts[s], b = s + 1 < starts.length ? starts[s + 1] : F.length;
    if (b - a >= 6) { from = a; to = b; }           // a very short sentence on its own would make the error too obvious
  }
  const finalT = out.slice(from, to), finalF = F.slice(from, to);

  // the game finds a tapped word by its first occurrence, so that must still be the right one
  const errors = kept.map(k => (k.e.word ? { word: k.e.word } : { gapAfter: k.e.gapAfter }));
  for (const k of kept) {
    const w = k.e.word || k.e.gapAfter;
    if (finalT.findIndex(t => core(t) === w) !== k.i - from) return bad(`"${w}" is no longer the first occurrence`);
  }
  const optionalGaps = [];
  for (const w of d.optional || []) {
    const i = finalF.findIndex(t => core(t) === String(w).toLowerCase());
    if (i < 0) continue;                                                 // it was in the sentence that got trimmed away
    if (/,$/.test(finalF[i])) { problems.push(`${q.id}: "${w}" already has a comma`); continue; }
    if (kept.some(k => !k.diff.word && k.i - from === i)) continue;      // a kept comma error can't also be optional
    optionalGaps.push(core(finalF[i]));
  }

  const check = differences(finalT, finalF);
  if (check.length !== errors.length) return bad(`expected ${errors.length} differences, found ${check.length}`);

  q.text = finalT.join(' '); q.fixed = finalF.join(' '); q.errors = errors; q.rule = d.rule;
  q.prompt = `A forger tampered with this witness statement. ${errors.length === 1 ? 'Find the error.' : 'Find both errors.'} ${TAP}`;
  if (optionalGaps.length) q.optionalGaps = optionalGaps; else delete q.optionalGaps;
  return true;
}

const pending = [];
const stats = { one: 0, two: 0, dropped: 0, optional: 0, trimmed: 0 };
for (const file of ['questions.js', 'questions-set2.js']) {
  const p = path.join(ROOT, 'data', file), src = fs.readFileSync(p, 'utf8');
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
  const items = [];
  for (const q of ctx.window.SAT_QUESTIONS) {
    if (q.type !== 'forge' || q.errors.length !== 3) { items.push(q); continue; }
    const d = decisions.get(q.id);
    if (!d) { problems.push(`${q.id}: no decision`); items.push(q); continue; }
    if (d.drop) { stats.dropped++; continue; }
    const before = q.fixed;
    if (simplify(q, d)) {
      stats[q.errors.length === 1 ? 'one' : 'two']++;
      if (q.optionalGaps) stats.optional++;
      if (q.fixed !== before) stats.trimmed++;
    }
    items.push(q);
  }
  pending.push([p, /set\d+\.js$/.test(file)
    ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(items, null, 1)});\n`
    : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(items, null, 1)};\n`]);
}
console.log(JSON.stringify(stats));
if (problems.length) {
  console.log(`${problems.length} problems, nothing written:`);
  problems.slice(0, 40).forEach(x => console.log('  ' + x));
  process.exit(1);
}
pending.forEach(([p, text]) => fs.writeFileSync(p, text));
console.log('written');
