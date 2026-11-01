#!/usr/bin/env node
// Conjunction questions used to be nearly all ", and" / ", but", so guessing the comma always worked.
// This script makes them a real decision between ", and" / "and" / "and," (same for but, so, yet, or):
//   1. rewrites the existing conjunction items in data/questions.js and data/questions-set2.js to those choices
//   2. writes data/questions-set3.js: hand-picked Christie sentences, including the half that was missing,
//      where no comma goes before the conjunction because what follows is not a full sentence
// Safe to run again: conversion only touches items that are not converted yet, and set 3 is rebuilt from the lists below.
// Keys follow modern SAT conventions. Words are Christie's; tests/verify-quotes.mjs checks them against the books.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOKS = {
  863: 'The Mysterious Affair at Styles', 58866: 'The Murder on the Links', 61262: 'Poirot Investigates',
  69087: 'The Murder of Roger Ackroyd', 70114: 'The Big Four', 72824: 'The Mystery of the Blue Train',
  1155: 'The Secret Adversary', 61168: 'The Man in the Brown Suit', 65238: 'The Secret of Chimneys',
  75288: 'The Seven Dials Mystery', 78220: 'The Murder at the Vicarage', 78342: 'Partners in Crime',
  78084: 'The Mysterious Mr. Quin'
};

// ------------------------------------------------------------------ the sentences, with the key's punctuation
// One subject, two verbs: what follows the conjunction has no subject of its own, so no comma.
const PREDICATE = {
  863: ['John Cavendish frowned and changed the subject.', 'Cynthia took the bottle and examined it with the severity of a judge.', 'We acquiesced and followed him out of the room.', 'Poirot approached and stood over him.', 'For a moment we sat and stared at her.', 'Miss Howard shook hands with Poirot but glanced suspiciously over her shoulder at John.', 'She came in but did not sit down.'],
  1155: ['Whittington snatched it up and read it.', 'Two men came down the stairs and passed out through the entrance.', 'Tuppence nodded and jerked a thumb up the stairs.', 'Sir James sat down and subjected Julius to a long scrutiny.', 'She stooped down and looked under the bed.', 'The driver jumped to the pavement and tried to bar Tommy’s way.', 'Julius stepped forward and took her hand again.', 'The gravity of his tone impressed Tommy but had little effect upon Julius.', 'Three more shots rang out but went happily wide.', 'I pretended to go away but doubled back again.'],
  58866: ['Suddenly he stiffened and pointed a dramatic finger at the toast rack.', 'The sergent de ville saluted and stood aside.', 'I pushed aside the bushes and looked through.', 'We both ran to her and lifted her up.', 'Suddenly he rose and strolled to the window.', 'He seemed about to speak but checked himself.', 'We said no more but fell into line.'],
  61168: ['He pulled himself to his feet and stood there swaying a little.', 'He turned sharply and saw a lion crouching to spring.', 'I got up frightfully early and went out on deck.', 'I withdrew to the shadow of a friendly bookstall and watched.', 'I mounted the two steps and opened the gate.', 'He brought a small stool over beside me and sat there.', 'I listened but could hear nothing.'],
  61262: ['Poirot rang the bell and motioned us to stand a little aside.', 'Ridgeway produced a card and scribbled a few words on it.', 'The youngest of the three men jumped up and came forward to greet us.', 'Poirot leaned back and lit one of his tiny Russian cigarettes.', 'He came over and greeted my friend cheerfully.', 'Mr. Lowen reiterated his regrets and took his departure.', 'I scrutinized it but was forced to shake my head.'],
  65238: ['Anthony sank into a chair and eyed him severely.', 'He got nimbly to his feet and fled down the passage.', 'He sat down on the bottom stair and drew off his boots.', 'He drew out a cigarette from his case and lighted it.', 'Lemoine stooped and picked up a small object from the floor.', 'Virginia went to the window and opened it.', 'Anthony did not pursue him but went back into his own room.', 'Anthony nodded but did not speak.', 'Superintendent Battle smiled a little but did not answer.', 'The detective acknowledged the suggestion with a smile but said nothing.'],
  69087: ['It slipped through my fingers and fell.', 'The inspector produced a pocket torch and flashed it along the sill outside.', 'Poirot stooped and removed a microscopic weed.', 'Miss Russell pursed her lips together and made no reply.', 'I put some coal on the fire and went upstairs obediently.', 'Mr. Hammond took the roll from him and counted it.', 'I did not answer but got up from table.', 'Blunt said nothing but stood looking at her for a minute or two in silence.', 'Poirot shrugged his shoulders but did not answer.', 'I raised my eyebrows but did not argue.'],
  70114: ['Poirot closed his eyes and shuddered.', 'The man opened his lips and spoke in a queer mechanical voice.', 'He rushed into the other room and seized the telephone.', 'I threw on a bathrobe and hurried in.', 'He dashed down the receiver and turned to me.', 'She drew out a little bottle of dark fluid and handed it to Poirot.', "The American burst out laughing but broke off at the sight of Poirot's serious face.", 'He turned to leave the room but paused with his hand on the door.', 'Poirot shook his head gently but made no answer.'],
  72824: ['Suddenly he stopped dead and listened intently.', 'The secretary gathered up his papers and departed.', 'She laid down the continental Daily Mail and stared out across the blue waters of the Mediterranean.', 'He leaned back in his chair and watched the suggestion slowly take effect.', 'Mr. Goby coughed again and spoke to the clock on the mantelpiece.', 'Mirelle laughed cruelly and drew her fur draperies closer about her.', 'Knighton smiled a little but made no reply.', 'It suited the man but suited the woman less well.', 'He looked at her sharply but did not answer.', "This time he did not pass Cook's but went in.", 'Van Aldin greeted Katherine very courteously but was clearly in a bad humour.'],
  75288: ['Lady Coote turned and plunged abruptly into the house again.', 'Every one held his breath and listened.', 'She took a thin paperknife and slipped it into the narrow crack.', 'He stepped over to a shelf and poured something into a glass.', 'Alfred produced a key and opened the door.', 'Presently he stooped and picked something up.', 'His sleep-ridden brain tried for a moment to cope with the situation but failed.'],
  78084: ["He hurried round to Cook's and inquired about boat sailings.", 'She went into the hotel and came out again with a portfolio.', 'Philip Eastney drew out his watch and looked at it.', 'He opened the door and adventured cautiously into the darkened room.', 'Mr. Satterthwaite went up to him and bent down.', 'He leaned forward and caught her wrist.', 'Mr. Satterthwaite raised his eyebrows but did not reply.'],
  78220: ['She started and looked over at the window.', 'We left the room and descended the stairs.', 'He frowned and put on his man-of-the-world air.', 'He went towards a two-seater and lifted the bonnet.', 'He shut his eyes and swallowed convulsively.'],
  78342: ['Tuppence sighed and closed her eyes dreamily.', 'Tommy took the envelope and opened it.', 'The short man jerked his head and muttered something.', 'He took a one pound note from his pocket and handed it to Tommy.', 'Suddenly the old woman rose and turned towards them menacingly.', 'The following morning they paid their bill and departed somewhat crestfallen.', 'Tommy let the note drop but picked it up quickly.']
};

// One subject again, but with an interruption right after the conjunction: the comma comes after it. ("and," can be right.)
const INTERRUPTER = {
  61168: ['He rose to meet me as I entered the room and, taking both my hands in his, patted them affectionately.'],
  65238: ['He went up to his room and, led by a sudden impulse, crossed to the looking-glass and stood studying his face in it.'],
  78220: ['Griselda met me in the hall and, with tears in her eyes, dragged me into the drawing room.'],
  78084: ['He held the door open for her and, crossing the hall, opened the door of the smoking room.']
};

// A full sentence on each side of "so": comma before it.
const SO_FULL = {
  1155: ['I hadn’t got any folk of my own, so it made it easy to arrange things.'],
  58866: ['I had to know the worst, so I followed you.'],
  61168: ['I didn’t want to be left alone with him, so I got up too and went to my room.', 'He did not answer immediately, so I went on.'],
  65238: ['I hate a one-sided show, so I promptly butted in and proceeded to beat up the toughs.'],
  69087: ['On Raymond’s appearance Parker had withdrawn, so I was alone in the hall.', 'I was afraid Mrs. Ackroyd would begin talking about settlements again, so I made a few hurried remarks about the new sweet pea.', 'But she also wanted to waste no time, so she made the best of it.', 'The servants were not present, so we were six in all.', 'I didn’t want the servants to see me, so I slipped out through the drawing-room window.', 'Major Blunt was walking up and down the terrace, so I had to go round through the bushes to avoid him.'],
  75288: ['She possessed the useful art of being able to wake herself up at the required time, so she had been able to enjoy some hours of refreshing sleep.'],
  78342: ['I thought the paper might be important, so I locked it up in the safe before coming out.']
};

// "so that ..." / "so as to ...": gives the purpose and cannot stand alone, so no comma.
const SO_PURPOSE = {
  65238: ['The whole of Anthony’s faculties were centred on keeping a close grip of Giuseppe’s right arm so that he would be unable to use the knife.', 'I was trying to put two and one and five and three together so as to make four.', 'He stole up to the window, stooping a little so that he should not be seen.'],
  69087: ['The butler drew the chair in question out a good two feet from the wall, turning it so that the seat faced the door.', 'He smiled, unclosing his hand so that I should see what lay in the palm of it.', 'I imagined that the chair was drawn out so that something connected with the window should not be seen by any one entering through the door.'],
  70114: ["I drew Poirot back a little so as to be able to speak to him out of the Inspector's hearing."],
  72824: ['She presently decided that she would go along to the end and ask the conductor for the right time so that she could set her watch.', 'He stores them up in the autumn so that they may be of advantage to him later.'],
  78084: ['She had married him so as to keep body and soul together.'],
  78342: ['They approached the peephole which had been artistically contrived so as to command a view of the outer office.', 'They left the doors purposely a little ajar so that they could see what was going on outside.']
};

// Existing questions removed after an independent review of the conjunction questions.
const DROP = new Set([
  'mc-65238-1072-1',   // "As he is greater..., so..." is a correlative pair, not "so" joining two sentences
  'mc-863-86-1',       // has its own comma between two objects ("auburn hair, and the smallness"), the comma the game teaches as wrong
  'mc-61262-653-0',    // "It was more than I was" means nothing out of context
  'mc-72824-1201-10',  // reads as if the dead woman had kept quiet to the police
  'mc-69087-141-0',    // "I didn't think it would either" means nothing out of context
  'mc-58866-871-1',    // "Her breast heaved": not for a teen study game
  'mc-70114-713-2'     // "we gag and bind her": not for a teen study game
]);

// ------------------------------------------------------------------ building items
const CONJ = /^(and|but|so|yet|or)$/i;
/** ", and" / " and" / " and," plus one always-wrong semicolon or colon choice, picked by a stable hash of the stem. */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function choices(w, seedText) {
  return [`, ${w}`, ` ${w}`, ` ${w},`, hash(seedText) % 2 ? `; ${w},` : `: ${w}`];
}
const clip = (s, n = 6) => { const a = s.replace(/\.$/, '').split(/\s+/); return a.length > n ? a.slice(0, n).join(' ') + '...' : a.join(' '); };

const TITLE = 'Which choice follows Standard English?';
const PROMPT = 'Which choice completes the text so that it conforms to the conventions of Standard English?';

function make(id, sentence, split, answerOf, ruleOf) {
  const m = split.exec(sentence);
  if (!m) throw new Error(`cannot split: ${sentence}`);
  const left = sentence.slice(0, m.index), w = m[2], right = sentence.slice(m.index + m[0].length);
  const answer = answerOf(w), stem = `${left}___ ${right}`;
  if (stem.replace('___', answer) !== sentence) throw new Error(`does not reproduce: ${sentence}`);
  return {
    id: `conj-${id}-${hash(sentence).toString(36)}`, type: 'mc', skill: 'commas', title: TITLE, prompt: PROMPT,
    stem, options: choices(w, sentence), answer, fixed: sentence,
    rule: ruleOf(w, left, right), source: { book: BOOKS[id], gutenberg: id }
  };
}

const set3 = [];
const each = (table, fn) => { for (const id of Object.keys(table)) for (const s of table[id]) set3.push(fn(+id, s)); };
each(PREDICATE, (id, s) => make(id, s, /( )(and|but) /, w => ` ${w}`, (w, l, r) =>
  `Cover "${w}" and read what follows: "${clip(r)}" has no subject of its own, so it is not a full sentence. One subject does both actions, so no comma goes before "${w}".`));
each(INTERRUPTER, (id, s) => make(id, s, /( )(and), /, w => ` ${w},`, (w, l, r) =>
  `What follows "${w}" has no subject of its own, so no comma goes before "${w}". The two commas after it are a pair around "${r.split(',')[0]}", an interruption you could lift out of the sentence.`));
each(SO_FULL, (id, s) => make(id, s, /(, )(so) /, w => `, ${w}`, (w, l, r) =>
  `Cover "so" and read what follows: "${clip(r)}" is a full sentence, and so is "${clip(l)}". When "so" joins two full sentences, a comma goes before it.`));
each(SO_PURPOSE, (id, s) => make(id, s, /( )(so) (?=that |as to )/, w => ` ${w}`, (w, l, r) =>
  `Cover "so" and read what follows: "${clip(r)}" cannot stand alone as a sentence. It only gives the purpose of the action, so no comma goes before "so".`));

if (new Set(set3.map(q => q.id)).size !== set3.length) throw new Error('duplicate ids in set 3');

// ------------------------------------------------------------------ converting the existing items
const ONLY_CONJ = /^[,;:\s]*(and|but|so|yet|or)[,;:\s]*$/i;
const tip = w => ` Test: cover "${w}" and read what follows. It could stand alone as a sentence, so the comma goes before "${w}".`;

function convert(q) {
  if (q.type !== 'mc') return false;
  let w = null, answer = null, stem = q.stem;
  if (q.options.every(o => ONLY_CONJ.test(o))) {
    w = ONLY_CONJ.exec(q.options[0])[1].toLowerCase();
    const a = q.answer.trim();
    answer = a === `, ${w}` ? `, ${w}` : a === `${w},` ? ` ${w},` : a === w ? ` ${w}` : null;
    stem = stem.replace(/\s*___\s*/, '___ ');
  } else {
    const m = /___\s+(and|but|so|yet|or)\b\s*/i.exec(stem);
    if (!m || q.options.some(o => !['', ',', ';', ':'].includes(o.trim()))) return false;
    w = m[1].toLowerCase();
    answer = q.answer.trim() === ',' ? `, ${w}` : q.answer.trim() === '' ? ` ${w}` : null;
    stem = stem.replace(m[0], '___ ');
  }
  if (!answer) throw new Error(`${q.id}: unexpected answer ${JSON.stringify(q.answer)}`);
  const norm = s => s.replace(/\s+/g, ' ').trim();
  if (norm(stem.replace('___', answer)) !== norm(q.fixed)) throw new Error(`${q.id}: conversion changes the sentence:\n  ${stem.replace('___', answer)}\n  ${q.fixed}`);
  const next = choices(w, q.id);
  const already = q.stem === stem && JSON.stringify(q.options) === JSON.stringify(next) && q.answer === answer;
  if (already) return false;
  q.stem = stem; q.options = next; q.answer = answer;
  if (answer.startsWith(',') && !q.rule.includes('Test: cover')) q.rule += tip(w);
  return true;
}

function rewrite(file) {
  const p = path.join(ROOT, 'data', file), src = fs.readFileSync(p, 'utf8');
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const items = ctx.window.SAT_QUESTIONS.filter(q => !DROP.has(q.id)), header = src.match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
  console.log(`${file}: dropped ${ctx.window.SAT_QUESTIONS.length - items.length} items`);
  let n = 0;
  items.forEach(q => { if (convert(q)) n++; });
  fs.writeFileSync(p, /set\d+\.js$/.test(file)
    ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(items, null, 1)});\n`
    : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(items, null, 1)};\n`);
  console.log(`${file}: converted ${n} items`);
  return items;
}

const old = [...rewrite('questions.js'), ...rewrite('questions-set2.js')];

// A sentence appears only once in the whole bank
const wordsOf = s => s.replace(/_/g, '').toLowerCase().replace(/[^a-z0-9’'\s-]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
const seen = old.map(q => wordsOf(q.fixed || q.text || '')).join(' | ');
const repeats = set3.filter(q => seen.includes(wordsOf(q.fixed)));
if (repeats.length) throw new Error('already in the bank: ' + repeats.map(q => q.fixed).join(' / '));

fs.writeFileSync(path.join(ROOT, 'data', 'questions-set3.js'),
  `/* Question set 3: conjunction choices (see scripts/apply-conjunctions.mjs and the README). */\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(set3, null, 1)});\n`);
console.log(`questions-set3.js: wrote ${set3.length} items`);
