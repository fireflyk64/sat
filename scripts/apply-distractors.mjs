#!/usr/bin/env node
// Gives the older and hard-word vocabulary questions better wrong choices.
//
// Every one of these questions shows the meaning of the missing word (as a clue above the sentence, or as the question
// itself), so a wrong choice that plainly does not fit gives the answer away. These wrong choices are meant to be words that
// also read plausibly in the sentence and share its tone, but whose meaning is not the one shown. Drafted by reviewers
// into data/vocab-distractors.json as { id: { wrong: [{ word, def, fit }, x3], rule?: "a new explanation", rootOk?: true, audited?: true } }, or { drop: true } for a
// question whose meaning is too generic for rivals that are really different; this checks every draft and applies them.
// (Whether a rival has the right form for the blank is not checked here: the blind audit rates how each one reads in the sentence.)
//   node scripts/apply-distractors.mjs data/vocab-distractors.json            apply, and list anything that failed a check
//   node scripts/apply-distractors.mjs data/vocab-distractors.json --check    only list what would fail
// An explanation that talks about a word that was swapped out loses that sentence; one that is only about it is listed to be reworded.
// Rebuilding set 4 with scripts/apply-hard-vocab.mjs puts the old wrong choices back, so run this again after it.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const drafts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const checkOnly = process.argv.includes('--check');
const FILES = ['questions.js', 'questions-set2.js', 'questions-set4.js', 'questions-set5.js'];

const stats = { applied: 0, dropped: 0, rejected: 0, trimmed: 0, stale: 0, kept: 0, missing: 0 };
const problems = [], stale = [], useCount = {}, fits = { two: 0, one: 0, none: 0 };
const seen = new Set();

for (const file of FILES) {
  const p = path.join(ROOT, 'data', file), src = fs.readFileSync(p, 'utf8');
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '', out = [];
  for (const q of ctx.window.SAT_QUESTIONS) {
    const d = drafts[q.id];
    if (!d || q.type !== 'vocab') { out.push(q); continue; }
    seen.add(q.id);
    if (d.drop) { stats.dropped++; continue; }       // a meaning too generic to support rivals that are really different
    const bad = [], words = (d.wrong || []).map(w => (w.word || '').trim().toLowerCase());
    if (words.length !== 3) bad.push(`needs exactly three wrong choices, has ${words.length}`);
    if (new Set(words).size !== words.length) bad.push('repeats a wrong choice');
    const stem = q.stem.toLowerCase();
    (d.wrong || []).forEach((w, i) => {
      const word = words[i], def = (w.def || '').trim();
      if (!/^[a-z][a-z'-]+$/.test(word)) bad.push(`"${word}" is not a single lowercase word`);
      if (word === q.answer) bad.push(`"${word}" is the answer`);
      if (new RegExp('\\b' + word + '\\b').test(stem)) bad.push(`"${word}" is in the sentence`);
      if (!d.rootOk && word.length >= 5 && q.answer.length >= 5 && word.slice(0, 5) === q.answer.slice(0, 5)) bad.push(`"${word}" shares its root with the answer`);
      if (!def) bad.push(`"${word}" has no definition`);
      else {
        if (def.length > 70) bad.push(`the definition of "${word}" is too long`);
        if (/\.$/.test(def)) bad.push(`the definition of "${word}" ends with a full stop`);
        if (new RegExp('\\b' + word + '\\b', 'i').test(def)) bad.push(`the definition of "${word}" uses the word`);
        if (def !== def.toLowerCase() && !/[A-Z]{2}/.test(def)) bad.push(`the definition of "${word}" is not lowercase`);
      }
      if (w.fit !== 1 && w.fit !== 2) bad.push(`"${word}" has no fit rating`);
    });
    const twos = (d.wrong || []).filter(w => w.fit === 2).length;
    if (twos < 2 && !d.audited) bad.push(`only ${twos} wrong choice(s) rated as tempting`);     // (an entry a blind review has passed is judged by that review instead)
    if (bad.length) { stats.rejected++; problems.push(`${q.id} (${q.answer}): ${bad.join('; ')}`); out.push(q); continue; }

    // a sentence that opens with the blank has a capitalised answer, and the rivals must match or the answer stands out
    const fmt = w => (/^[A-Z]/.test(q.answer) ? w[0].toUpperCase() + w.slice(1) : w), shown = words.map(fmt);
    const old = q.options.filter(o => o !== q.answer);
    const sameSet = old.length === 3 && shown.every(w => old.includes(w));
    if (sameSet) { stats.kept++; out.push(q); continue; }
    // an explanation that talks about a wrong choice that has gone ("Taciturn means the opposite.") loses that sentence;
    // if nothing would be left, it is listed to be rewritten by hand
    const gone = old.filter(o => !words.includes(o) && new RegExp('\\b' + o + '\\b', 'i').test(q.rule || ''));
    let rule = d.rule || q.rule;      // a draft may bring its own explanation
    if (gone.length && !d.rule) {
      const left = q.rule.split(/(?<=[.!?])\s+/).filter(sn => !gone.some(o => new RegExp('\\b' + o + '\\b', 'i').test(sn)));
      if (left.length) { rule = left.join(' '); stats.trimmed++; }
      else { stats.stale++; stale.push(`${q.id}: the whole explanation is about "${gone[0]}", which is no longer a choice`); }
    }
    words.forEach(w => { useCount[w] = (useCount[w] || 0) + 1; });
    d.wrong.forEach(w => { if (w.fit === 2) fits.two++; else fits.one++; });
    if (!checkOnly) {
      const defs = { [q.answer]: q.definitions[q.answer] };
      d.wrong.forEach(w => { defs[fmt(w.word.trim().toLowerCase())] = w.def.trim(); });
      q.options = [q.answer, ...shown];
      q.definitions = defs;
      q.rule = rule;
    }
    stats.applied++;
    out.push(q);
  }
  if (!checkOnly) {
    fs.writeFileSync(p, /set\d+\.js$/.test(file)
      ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(out, null, 1)});\n`
      : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(out, null, 1)};\n`);
  }
}
for (const id of Object.keys(drafts)) if (!seen.has(id) && !drafts[id].drop) { stats.missing++; problems.push(`${id}: no such vocabulary question`); }     // (a dropped one is gone already on a rerun)
const over = Object.entries(useCount).filter(([, n]) => n > 6).sort((a, b) => b[1] - a[1]);
console.log(JSON.stringify(stats), checkOnly ? '(check only: nothing written)' : '');
console.log(`wrong choices rated tempting: ${fits.two}, looser neighbours: ${fits.one}`);
if (over.length) console.log('wrong choices used more than 6 times: ' + over.map(([w, n]) => w + ' x' + n).join(', '));
problems.forEach(x => console.log('PROBLEM ' + x));
stale.forEach(x => console.log('STALE   ' + x));
