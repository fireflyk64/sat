#!/usr/bin/env node
/*
 * Build the question bank from public-domain Agatha Christie texts (Project Gutenberg).
 * Zero dependencies (Node 18+). The finished game never calls an API; it loads data/questions.js.
 *
 * Two ways to have Claude draft the items; both share ONE set of mechanical validators:
 *
 *  A) Direct API (needs a key):
 *       export ANTHROPIC_API_KEY=sk-ant-...
 *       node scripts/generate.mjs --api --types mark,vocab --per-type 20      # model: claude-sonnet-5-5
 *       (each draft is validated, then audited by a second model call against modern SAT rules)
 *
 *  B) Batch files (no key; drafts are written by any Claude session / agent):
 *       node scripts/generate.mjs --export work/            # writes work/batch-<type>-<n>.json
 *       ... drafter reads a batch, writes work/out/batch-<type>-<n>.json (array of items) ...
 *       node scripts/generate.mjs --check work/batch-mark-1.json work/out/batch-mark-1.json   # lint one file
 *       node scripts/generate.mjs --import work/            # validate everything + merge into data/questions.js
 *
 *  node scripts/generate.mjs --dry-run     # show candidate sentences only
 *
 * Item keys: mark | agree | tense | mc | forge | vocab   (agree + tense are both game type "tapfix").
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SET_ARG = process.argv.includes('--set') ? +process.argv[process.argv.indexOf('--set') + 1] : 1;
const OUT = path.join(ROOT, 'data', SET_ARG > 1 ? `questions-set${SET_ARG}.js` : 'questions.js');
const DATA_DIR = path.join(ROOT, 'data');
const CACHE = path.join(ROOT, '.cache');

// Poirot novels/collections that are public domain in the US (published before 1931).
// NB: Murder on the Orient Express (1934) is still in copyright in the US, so it is not usable.
const BOOKS = {
  863: 'The Mysterious Affair at Styles', 58866: 'The Murder on the Links', 61262: 'Poirot Investigates',
  69087: 'The Murder of Roger Ackroyd', 70114: 'The Big Four', 72824: 'The Mystery of the Blue Train',
  // more Christie, all published before 1931 (public domain in the US); used from set 2 onwards
  1155: 'The Secret Adversary', 61168: 'The Man in the Brown Suit', 65238: 'The Secret of Chimneys',
  75288: 'The Seven Dials Mystery', 78220: 'The Murder at the Vicarage', 78342: 'Partners in Crime',
  78084: 'The Mysterious Mr. Quin'
};
const args = parseArgs(process.argv.slice(2));
// How many NEW items of each kind to build. With the 6 hand-checked seeds this totals exactly 1200.
const TARGETS = { mark: 299, agree: 119, tense: 119, mc: 259, forge: 139, vocab: 259 };
for (const kv of String(args.targets || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); TARGETS[k] = +v; }
const KEYS = Object.keys(TARGETS);
// Top-up mode: --need mark=120,agree=30 overrides how many items to aim for; --exclude DIR skips sentences already in DIR's batches
const NEED = Object.fromEntries(String(args.need || '').split(',').filter(Boolean).map(kv => kv.split('=')).map(([k, v]) => [k, +v]));
const LOOSE = !!args.loose;
const CUSHION = +(args.cushion ?? 40);
const DROP = new Set(args.drop ? JSON.parse(fs.readFileSync(String(args.drop), 'utf8')).map(x => x.id || x) : []);
const GAME_TYPE = { mark: 'mark', agree: 'tapfix', tense: 'tapfix', mc: 'mc', forge: 'forge', vocab: 'vocab' };
const SKILL = { mark: 'commas', agree: 'agreement', tense: 'tense', forge: 'proofreading', vocab: 'vocab' };
const DEFAULTS = {
  mark: { title: 'Restore the punctuation', prompt: 'Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.' },
  agree: { title: 'Find the real subject', prompt1: 'Step 1: Tap the subject, the word that the missing verb has to agree with.', prompt2: 'Step 2: Which verb fits?' },
  tense: { title: 'Spot the odd verb out', prompt1: 'Step 1: One verb is in the wrong tense. Tap it.', prompt2: 'Step 2: Pick the verb form that fixes the passage.' },
  mc: { title: 'Which choice follows Standard English?', prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?' },
  forge: { title: 'The forged statement', prompt: 'A forger tampered with this witness statement. Find all 3 errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.' },
  vocab: { title: 'Word in context', prompt: 'Which choice completes the text with the most logical and precise word?' }
};

const MODEL = args.model || 'claude-sonnet-5-5';
const SEED = +(args.seed || 20261031);
function parseArgs(a) {
  const o = { _: [] };
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) { const k = a[i].slice(2); o[k] = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true; }
    else o._.push(a[i]);
  }
  return o;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = rng(SEED);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------------------------------------------------------------- books
async function loadBook(id) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, `pg${id}.txt`);
  if (!fs.existsSync(f)) {
    const r = await fetch(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
    if (!r.ok) throw new Error(`Gutenberg ${id}: HTTP ${r.status}`);
    fs.writeFileSync(f, await r.text());
  }
  let t = fs.readFileSync(f, 'utf8').replace(/\r/g, '');
  const a = t.search(/\*\*\* ?START OF/), b = t.search(/\*\*\* ?END OF/);
  if (a >= 0) t = t.slice(t.indexOf('\n', a) + 1, b > a ? b : undefined);
  return t.replace(/_/g, '').split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
}
const ABBR = /\b(Mr|Mrs|Messrs|Dr|St|Mme|M|Mlle|Capt|Col|Sir|Hon|Rev|No|vs)\.$/;
function sentences(paragraphs) {
  const out = [];
  paragraphs.forEach((p, pi) => {
    const parts = p.split(/(?<=[.!?])\s+(?=[A-Z])/);
    const merged = [];
    for (const s of parts) { if (merged.length && ABBR.test(merged[merged.length - 1])) merged[merged.length - 1] += ' ' + s; else merged.push(s); }
    merged.forEach((s, i) => out.push({ s, pi, i, prev: merged[i - 1], next: merged[i + 1] }));
  });
  return out;
}
// words we do not want in a teen game even though the 1920s source uses them (dated ethnic terms, slurs, and look-alikes)
const BLOCKED = /\b(chinaman|chinamen|chink|chinks|nigger|niggers|negro|negroes|negress|coolie|coolies|darky|darkie|jap|japs|half-caste|heathen|heathens|gipsy|gipsies|jewess|kike|dago|wop|hindoo|mongolian|squaw|redskin|savages?)\b/i;
const clean = s => !BLOCKED.test(s) && s.length >= 45 && s.length <= 230 && !/[“”"\[\]*()—]/.test(s) && !/^(CHAPTER|Chapter|\d)/.test(s);

// ---------------------------------------------------------------- candidate heuristics
const SAT_WORDS = `ostensibly reticent imperturbable querulous sardonic surreptitious meticulous scrupulous perfunctory nonchalant incredulous obstinate eloquent vindicate ingenious plausible pretext conjecture ephemeral ubiquitous candid tenacious ambiguous benevolent enigmatic fastidious indignant laconic lucid mundane ominous pragmatic prudent reluctant skeptical tentative zealous subtle resilient concede discreet diligent elusive gregarious inevitable notorious obscure reproach scrutiny sinister spurious tedious tranquil vigilant whimsical ardent apprehensive audacious deference discern disparage dubious equivocal exasperated furtive inscrutable insidious intrepid irresolute languid magnanimous malevolent mollify obsequious ostentatious pallid peremptory placid poignant prodigious profuse recalcitrant remonstrate repudiate sagacious tacit taciturn tenuous timorous trepidation vehement venerable volatile wary wistful irascible garrulous brusque complacent contrite deprecating dogged effusive exuberant flippant gaunt haggard impassive indolent inexorable laborious lethargic morose pensive reverie stolid vacillate abate abhor abrupt absolve abstain abstruse acquiesce acrid adamant adept admonish adroit adversary affable affluent aghast agile alacrity aloof altruistic amiable amicable anecdote animosity annihilate anomaly antagonize apathy appease arbitrary arduous articulate assiduous astute atrocious austere authentic avarice aversion baffle banal belligerent berate bewilder blatant bleak bolster bombastic boorish bureaucratic burgeon cajole callous camaraderie capricious castigate caustic cautious censure chagrin chaotic cherish chide circumspect clandestine clemency coax cogent coherent collaborate commend compassion complacency comply compunction concise condescend condone confound conspicuous consternation contempt contend contentious copious corroborate covert credulous culpable cursory cynical daunting dearth debilitate decorum defiant deft degrade deliberate delusion denounce deplore deride desolate despondent destitute deter detrimental devious diffident digress dilemma discord discreetly disdain disinterested dismal disparity dispel dissent divulge docile dogmatic dormant dread dupe eccentric eclectic efface elaborate elated eminent emulate endeavor enervate engender enigma enmity ensue entreat equitable erratic erroneous erudite eschew esoteric evasive exacerbate exemplary exhaustive exonerate exorbitant expedient explicit extol extraneous exult facetious fallacy fanatical fathom feasible feign ferocious fervent fickle flagrant flaunt fleeting flourish foment forlorn formidable forthright fortuitous fractious frantic frugal futile gallant garish genial glib gloat gratuitous grievous gullible hamper haughty hapless hearten heinous hesitant hinder hostile hubris humane humble hypocrite idle ignoble illicit imminent impartial impeccable impede impel impetuous implacable implicit implore impudent impunity inadvertent incessant incisive inclement incongruous indifferent indigent indignation induce ineffable inept inert infallible infamous ingenuous inhibit innate innocuous insolent instigate insular integrity intimate intimidate intractable intricate intrigue inundate invariably invective irate irksome jaded jeopardize jovial judicious keen lament lavish lenient liberal listless loathe lofty lucrative ludicrous lurid maintain malice malign mandate manifest marred maudlin meager meander mediocre melancholy menial mercenary meticulously mirth misanthrope mitigate mobile modest morbid mortify mundane munificent myriad naive nebulous nefarious negligent nostalgia nuance oblique obliterate oblivious obnoxious obscure obstreperous obtuse odious officious opaque opulent oracle ordeal ornate oust paradox paramount parsimonious partisan pathos paucity pedantic penchant penitent perceptive perfidious peril perilous perplex pertinent perturb pervasive petulant philanthropic phlegmatic piety pious pitiful pithy placate plausibly plight ponder pompous portent potent precarious precocious predilection preposterous presume pretentious prevalent pristine probity proclivity prodigal profound prolific prolong prominent propensity prosaic provincial provoke prowess puerile pugnacious punctilious pungent quaint qualm quandary quell quixotic rancor rash rebuke recant reclusive reconcile redundant refute relentless relinquish remorse remote render renounce repent replete reprehensible reprimand reprove repulse resolute resolve restrain reticence retort retract revere rigorous rudimentary ruthless sanguine sarcastic saturate savor scant scathing scoff scorn scrupulously scurrilous serene servile shrewd sincere skeptic slander sluggish sober solace solemn solicitous somber sophisticated sporadic squalid staid stagnant steadfast stealthy stifle stoic strenuous strife stupor suave subdue subjugate sublime submissive subordinate substantiate succinct succumb sullen sumptuous superfluous supple supplicate surmise surly susceptible sustain swagger sycophant tactful tangible tantalize tawdry temerity temperate tenacity tepid terse thwart timid tirade torpid tortuous tractable transient trepid trivial truculent tumult turbulent tyrant unanimous unassuming uncanny undermine unflinching uniform unkempt unscrupulous unwieldy urbane usurp utter vacant vagrant vain valiant vapid vehemently venture verbose verdant vex vicarious vigorous vile vindictive virulent vivid vociferous voracious waive wanton warrant wayward wholesome wily winsome wither wrath wretched zeal`.split(/\s+/);
const SAT_SET = new Set(SAT_WORDS);

const hasPastNarration = s => /\b(was|were|had|stood|saw|said|looked|came|went|took|made|felt|knew|thought|seemed|turned|opened|asked|replied|walked)\b/.test(s);
const commas = s => (s.match(/,/g) || []).length;
const FINDERS_STRICT = {
  mark: x => commas(x.s) >= 2 && (/, (and|but|so|yet|or) [a-z]+/.test(x.s) || /, (who|which|whom|whose)\b/.test(x.s) || /^[A-Z][a-z]+(?: [a-z]+){0,5},/.test(x.s)) && /\b[A-Z][a-z]+/.test(x.s.slice(1)),
  agree: x => /^(The|A|An|Each|Every|None|Neither|Either|All|Some|Most|One) [^,]{3,45}\b(was|were|is|are|has|have|does|do)\b/.test(x.s) || /^(There|Here) (was|were|is|are)\b/.test(x.s) || /\b[A-Za-z]+ and [A-Za-z]+ (was|were|is|are)\b/.test(x.s) || /^(Across|Beside|Behind|Beyond|Between|Under|On|In|Through) [^,]{3,50} (lay|stood|was|were|came|sat)\b/.test(x.s),
  tense: x => x.next && clean(x.next) && hasPastNarration(x.s) && hasPastNarration(x.next) && x.s.length < 190 && x.next.length < 190,
  mc: x => /^(Suddenly|Instead|However|Nevertheless|Meanwhile|Naturally|Presently|Of course|In fact|At that moment|Then|Perhaps|Obviously|Evidently|Finally|Luckily|Unfortunately|Certainly|Indeed|Still),/.test(x.s) || /, (and|but|so|yet|or) (he|she|I|it|they|we|the|there|his|her|my|you|Poirot) /.test(x.s) || /; /.test(x.s) || /, (who|which)\b[^,]{4,60},/.test(x.s),
  forge: x => x.next && clean(x.next) && hasPastNarration(x.s) && x.s.length < 200 && x.next.length < 200,
  vocab: () => false // handled specially (word hints)
};
// --loose widens the pools (used for top-up passes once the strict pool has been drafted)
const FINDERS_LOOSE = {
  ...FINDERS_STRICT,
  mark: x => commas(x.s) >= 2 && /[A-Z][a-z]+/.test(x.s.slice(1)) && !/^(Yes|No|Oh|Ah|Eh)\b/.test(x.s),
  agree: x => /\b(was|were|is|are|has|have|does|do)\b/.test(x.s) && /\b(of|and|or|nor|with|in|on|between|there|here|each|every|neither|either|none)\b/.test(x.s) && x.s.length < 170,
  mc: x => /^(Suddenly|Instead|However|Nevertheless|Meanwhile|Naturally|Presently|Of course|In fact|At that moment|Then|Perhaps|Obviously|Evidently|Finally|Luckily|Unfortunately|Certainly|Indeed|Still|When|While|After|Before|Although|Though|As|If|Since|Because|Once|Until|Having|Seeing|Being|Turning|Looking)\b[^,]{0,60},/.test(x.s) || /; /.test(x.s) || /, (who|which|whom|whose)\b/.test(x.s) || /\b[A-Z][a-z]+, (the|a|an|my|his|her) [a-z ]{3,30},/.test(x.s) || /^(The|A|An|Each|Every|None|Neither|Either) [^,]{3,45}\b(was|were|is|are|has|have)\b/.test(x.s)
};
// --looser: wider pools for mc and forge (any comma-bearing narration sentence / any adjacent pair) once the targeted pools are used up
const FINDERS_LOOSER = {
  ...FINDERS_LOOSE,
  mc: x => commas(x.s) >= 1 && x.s.length < 200,
  forge: x => x.next && clean(x.next) && x.s.length < 200 && x.next.length < 200 && /[a-z]/.test(x.s)
};
const FINDERS = args.looser ? FINDERS_LOOSER : LOOSE ? FINDERS_LOOSE : FINDERS_STRICT;

// ---------------------------------------------------------------- instructions for the drafter (agent or API)
const SYSTEM = `You write auto-gradable grammar and vocabulary practice items for a bright teenager preparing for the digital SAT.
Items are built from real sentences in Agatha Christie's Poirot novels (public domain).

RULES
- Grade against MODERN SAT "Standard English Conventions", not Christie's 1920s British style. The SAT wants: a comma before
  and/but/so/yet/or joining two independent clauses (NOT a compound predicate); a comma after an introductory word/phrase/clause;
  commas on BOTH sides of a nonessential (removable) interrupter, none for essential ones; no comma between subject and verb;
  the verb agrees with its true subject, not the nearest noun; consistent verb tense unless the time really changes.
- Every item must have exactly one defensible answer. If the sentence is punctuated in a dated or arguable way, or the answer could be
  disputed, OMIT that candidate (do not output an item for it). Quality over quantity: omit freely.
- Keep Christie's words exactly. You may only change punctuation/capitalization (and, in "forge"/"tense" items, plant errors as described).
- "rule" is a 1-3 sentence explanation for a teenager: name the rule, then apply it to this sentence. No em dashes.
- A later independent reviewer REJECTS: optional/arguable commas (short introductory phrases, compound predicates, serial commas, "so that"/"as" clauses, not-clearly-nonessential phrases), any item with a second defensible answer, stems that end in a colon or depend on dialogue, fragments, and "rule" text that mentions people or context not in the item's own sentence. Fewer, cleaner items beat many arguable ones.
- Output ONLY a JSON array of item objects; every item carries the "cid" of the candidate it came from.`;

const SPEC = {
  mark: `KIND "mark" (restore commas + capital letters).
Fields: {"cid", "text", "optionalCommas", "rule"}
- text: the candidate sentence with MODERN-correct punctuation, every word identical to the original (this is the answer key).
- optionalCommas: array of 0-based word indexes (whitespace-split) after which a comma is optional (e.g. after a very short introductory word, before the last item of a series); [] if none.
- Keep sentences that have at least two required commas (any kinds: conjunction, introductory, interrupter, series, appositive). If an original comma is dated or missing, just supply the modern-correct one in your key.
Example: {"cid":"X","text":"Miss Ganett stopped for breath, and the colonel, who was totally uninterested in the servant question, remarked that in the Shanghai Club brisk play was the invariable rule.","optionalCommas":[],"rule":"Use a comma before and ... "}`,
  agree: `KIND "agree" (subject-verb agreement; student taps the real subject, then picks the verb).
Fields: {"cid", "text", "targetWords", "options", "answer", "hint1", "rule"}
- text: the candidate sentence with ONE verb (a single word like was/were/is/are/has/have/lay/stood/does) replaced by ___ .
- targetWords: [the lowercase head noun of the true subject, exactly as it appears in the text]
- options: 2 or 3 verb forms (e.g. ["was","were"]); answer: the correct one (must be in options and restore the original sentence).
- hint1: one sentence telling the student where the trap is (e.g. a plural noun inside an "of ..." phrase, an inverted sentence, a compound subject).
- Choose sentences where the nearest noun or inversion makes the choice tricky. Omit sentences where the subject is ambiguous or where more than one form could be defended.
Example: {"cid":"X","text":"The countenances of Cynthia and Nibs ___ suddenly petrified into a stern and forbidding expression.","targetWords":["countenances"],"options":["was","were"],"answer":"were","hint1":"...","rule":"..."}`,
  tense: `KIND "tense" (verb tense consistency; student taps the odd verb, then picks the fix).
The candidate has "s" and "next" (two consecutive sentences). Use s + " " + next as the passage.
Fields: {"cid", "text", "fixed", "targetWords", "options", "answer", "hint1", "rule"}
- fixed: the passage (s + " " + next) with MODERN-correct punctuation, words unchanged.
- text: the same passage with exactly ONE verb (or verb group) changed to a wrong tense; everything else identical to fixed (including punctuation).
- targetWords: [the lowercase wrong verb as it appears in text] (the first word of it if it is a group).
- options: 3-4 forms (the correct original verb text + plausible wrong tenses); answer = the original verb text exactly as it appears in fixed.
- Choose passages in the past tense with no legitimate reason to shift. Omit passages where a tense shift would be acceptable.
Example: {"cid":"X","fixed":"I refrained from comments, accepting Mrs. Ackroyd’s story on its merits. I even forbore to ask her why ...","text":"I refrained from comments, accepting Mrs. Ackroyd’s story on its merits. I even forbear to ask her why ...","targetWords":["forbear"],"options":["forbore","forbears","will forbear","am forbearing"],"answer":"forbore","hint1":"...","rule":"..."}`,
  mc: `KIND "mc" (SAT-style "conforms to the conventions of Standard English").
Fields: {"cid", "stem", "options", "answer", "skill", "rule"}
- stem: the candidate sentence with ___ where the tested part goes (a comma/conjunction/introductory phrase/verb, 1-6 words). Exactly one ___ .
- options: exactly 4 strings that differ only in punctuation or verb form; answer: the one that restores the sentence correctly under SAT rules (must equal one option exactly).
- Wrong options must be realistic student mistakes: missing comma before a conjunction, comma splice, comma between subject and verb, one comma around an interrupter, wrong semicolon, wrong verb number/tense.
- skill: "commas", "agreement" or "tense". VARIETY IS REQUIRED: do NOT write items about the comma before and/but/so/yet/or (the bank already has plenty; the candidates below were chosen for other patterns). Look for introductory phrases/clauses, interrupters (two commas), appositives, semicolons, subject-verb agreement, pronoun/verb number, tense, and 'no comma' traps (comma between subject and verb, comma before a that-clause).
- Omit candidates where punctuation is optional/arguable (a short compound sentence, a lone introductory adverb the SAT would not require).`,
  forge: `KIND "forge" ("forged witness statement": find 3 planted errors).
The candidate has "s" and "next". Use s + " " + next as the passage.
Fields: {"cid", "fixed", "text", "errors", "rule"}
- fixed: the passage with MODERN-correct punctuation, words unchanged. If Christie's punctuation is dated or arguable, simply modernize it here (do NOT omit the candidate for that reason); omit only if the passage is a fragment, mostly dialogue, or has no good place for three distinct errors.
- text: fixed with EXACTLY 3 planted errors, using substitutions only (same number of words): a missing required comma (delete one comma), an extra wrong comma (insert one, e.g. between subject and verb), a subject-verb disagreement, a tense shift, or a lowercase proper noun / sentence start. Mix kinds. Never change any other character.
- errors: array of 3, each {"word":"<the wrong word as it appears in text, lowercase, no punctuation>"} or {"gapAfter":"<the lowercase word immediately BEFORE the missing/extra comma>"}.
  The referenced word must be the FIRST occurrence of that word in text.
Example: {"cid":"X","fixed":"... There was blood on his lips, and he held his right hand out, pointing.","text":"... There were blood on his lips and he holds his right hand out, pointing.","errors":[{"word":"were"},{"gapAfter":"lips"},{"word":"holds"}],"rule":"..."}`,
  vocab: `KIND "vocab" (SAT words in context).
Fields: {"cid", "stem", "options", "answer", "definitions", "rule"}
- Pick ONE target word in the candidate sentence that is a genuine SAT-level word (candidate "hints" lists likely words; you may pick another if better). Skip the sentence if it has none or if the word is a proper noun or archaic slang.
- stem: the sentence with that word (exactly as written, same inflection) replaced by ___ . Exactly one ___ .
- options: 4 words of the same part of speech and inflection: the answer + 3 plausible distractors that FAIL on meaning given the context clues (e.g. an opposite, or a word that fits the surface but not the clue). Make sure no distractor also fits.
- answer: the original word (lowercase unless it begins the sentence... use lowercase). definitions: an object giving a short teen-friendly definition for ALL FOUR options (keys = the options).
- The game shows the definition of the answer ABOVE the sentence, so exactly one option may have that meaning: no distractor may be a synonym or near-synonym of the answer, and every distractor's own definition must clearly differ. Use only clues INSIDE the sentence; never rely on the previous or next sentence.
- You do not need to worry about a/an before the blank (the game moves the article into each choice).
- rule: point out the context clue in the sentence that signals the meaning, mentioning only things that appear in the sentence.`
};

// ---------------------------------------------------------------- validation + finalisation (shared by every path)
const words = s => s.toLowerCase().replace(/[^a-z0-9’'\s-]/g, ' ').split(/\s+/).filter(Boolean);
const same = (a, b) => JSON.stringify(words(a)) === JSON.stringify(words(b));
const core = w => w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase();
const strip = t => t.replace(/,$/, '');
const win = c => [c.s, c.next].filter(Boolean).join(' ');

function finalize(raw, key, cand) {
  const err = m => { throw new Error(m); };
  const need = (...fs) => fs.forEach(f => raw[f] == null && err('missing ' + f));
  const arr = (f, n) => (Array.isArray(raw[f]) && (!n || n.includes(raw[f].length))) || err(`bad ${f}`);
  if (!raw.rule || raw.rule.length < 20) err('missing rule');
  const item = { id: `${key}-${cand.cid}`, type: GAME_TYPE[key], skill: SKILL[key], ...DEFAULTS[key] };
  switch (key) {
    case 'mark': {
      need('text'); if (!same(raw.text, cand.s)) err('words differ from the book sentence');
      if (commas(raw.text) < 2) err('fewer than 2 commas');
      item.text = raw.text; item.optionalCommas = raw.optionalCommas || [];
      if (!Array.isArray(item.optionalCommas)) err('optionalCommas');
      break;
    }
    case 'agree': {
      need('text', 'targetWords', 'options', 'answer'); arr('options', [2, 3]); arr('targetWords', [1, 2]);
      if (raw.text.split('___').length !== 2) err('need exactly one ___');
      if (!raw.options.includes(raw.answer) || new Set(raw.options).size !== raw.options.length) err('answer/options');
      if (!same(raw.text.replace('___', raw.answer), cand.s)) err('text+answer does not reproduce the sentence');
      const toks = raw.text.split(/\s+/), blank = toks.findIndex(w => w.includes('___'));
      const ti = toks.findIndex(w => raw.targetWords.includes(core(w)));
      if (ti < 0) err('targetWords not in text');
      if (ti > blank && !/^(There|Here)\b/.test(raw.text)) { /* subject after verb: allowed for inversions */ }
      item.text = raw.text; item.targetWords = raw.targetWords; item.options = raw.options; item.answer = raw.answer;
      item.fixed = raw.text.replace('___', raw.answer); item.hint1 = raw.hint1 || '';
      break;
    }
    case 'tense': {
      need('text', 'fixed', 'targetWords', 'options', 'answer'); arr('options', [3, 4]);
      if (!same(raw.fixed, win(cand))) err('fixed words differ from the book passage');
      if (!raw.options.includes(raw.answer) || new Set(raw.options).size !== raw.options.length) err('answer/options');
      const a = raw.text.split(/\s+/), b = raw.fixed.split(/\s+/);
      let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++;
      let q = 0; while (q < a.length - p && q < b.length - p && a[a.length - 1 - q] === b[b.length - 1 - q]) q++;
      const ma = a.slice(p, a.length - q), mb = b.slice(p, b.length - q);
      if (!ma.length || !mb.length) err('text must differ from fixed');
      if (ma.length > 3 || mb.length > 3) err('more than one verb changed');
      if (words(mb.join(' ')).join(' ') !== words(raw.answer).join(' ')) err('answer is not the original verb text');
      if (!raw.targetWords.includes(core(ma[0]))) err('targetWords must be the changed verb');
      item.text = raw.text; item.fixed = raw.fixed; item.targetWords = raw.targetWords; item.options = raw.options; item.answer = raw.answer; item.hint1 = raw.hint1 || '';
      break;
    }
    case 'mc': {
      need('stem', 'options', 'answer'); arr('options', [4]);
      if (new Set(raw.options).size !== 4 || !raw.options.includes(raw.answer)) err('answer/options');
      if (raw.stem.split('___').length !== 2) err('need exactly one ___');
      if (!same(raw.stem.replace('___', raw.answer), cand.s)) err('stem+answer does not reproduce the sentence');
      if (raw.options.some(o => o !== raw.answer && same(raw.stem.replace('___', o), cand.s) && o.replace(/\s+/g, ' ') === raw.answer.replace(/\s+/g, ' '))) err('duplicate option');
      item.stem = raw.stem; item.options = raw.options; item.answer = raw.answer;
      item.fixed = raw.stem.replace('___', raw.answer).replace(/\s+([,;.])/g, '$1').replace(/\s{2,}/g, ' ').trim();
      item.skill = ['commas', 'agreement', 'tense'].includes(raw.skill) ? raw.skill : 'commas';
      break;
    }
    case 'forge': {
      need('text', 'fixed', 'errors'); arr('errors', [3]);
      if (!same(raw.fixed, win(cand))) err('fixed words differ from the book passage');
      const a = raw.text.split(/\s+/), b = raw.fixed.split(/\s+/);
      if (a.length !== b.length) err('forge must use substitutions only (same word count)');
      const diffs = new Set();
      a.forEach((tok, i) => { if (strip(tok) !== strip(b[i])) diffs.add('w' + i); if (/,$/.test(tok) !== /,$/.test(b[i])) diffs.add('g' + i); });
      const resolved = new Set();
      for (const e of raw.errors) {
        const w = e.word || e.gapAfter; if (!w) err('error needs word or gapAfter');
        const idx = a.findIndex(t => core(t) === w); if (idx < 0) err('error word not in text: ' + w);
        resolved.add((e.word ? 'w' : 'g') + idx);
      }
      if (diffs.size !== 3 || resolved.size !== 3 || [...diffs].some(d => !resolved.has(d))) err(`errors do not match the 3 real differences (${[...diffs].join(',')} vs ${[...resolved].join(',')})`);
      item.text = raw.text; item.fixed = raw.fixed; item.errors = raw.errors;
      break;
    }
    case 'vocab': {
      need('stem', 'options', 'answer', 'definitions'); arr('options', [4]);
      if (new Set(raw.options).size !== 4 || !raw.options.includes(raw.answer)) err('answer/options');
      if (!raw.options.every(o => typeof raw.definitions[o] === 'string' && raw.definitions[o].length > 3)) err('definitions for all options');
      if (raw.stem.split('___').length !== 2) err('need exactly one ___');
      if (!same(raw.stem.replace('___', raw.answer), cand.s)) err('stem+answer does not reproduce the sentence');
      if (/\s/.test(raw.answer)) err('answer should be a single word');
      item.stem = raw.stem; item.options = raw.options; item.answer = raw.answer; item.definitions = raw.definitions;
      item.fixed = raw.stem.replace('___', raw.answer);
      break;
    }
  }
  item.rule = raw.rule;
  item.source = { book: BOOKS[cand.book], gutenberg: cand.book };
  return item;
}

// ---------------------------------------------------------------- candidates
async function buildCandidates() {
  const books = {};
  for (const id of Object.keys(BOOKS).map(Number)) { process.stderr.write(`loading ${BOOKS[id]}...\n`); books[id] = sentences(await loadBook(id)); }
  // corpus word frequency (for vocab hints)
  const freq = {};
  for (const id in books) for (const c of books[id]) for (const w of c.s.toLowerCase().match(/[a-z]{4,}/g) || []) freq[w] = (freq[w] || 0) + 1;
  const used = new Set(); // a sentence is used by at most one kind
  if (args.exclude) for (const d of String(args.exclude).split(',')) for (const f of fs.readdirSync(d).filter(f => /^batch-.*\.json$/.test(f))) {
    for (const c of JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')).candidates) {
      const [b, pi, i] = c.cid.split('-'); used.add(c.cid); used.add(`${b}-${pi}-${+i + 1}`);
    }
  }
  // never reuse a sentence that already appears in another bank file (earlier sets)
  for (const f of fs.readdirSync(DATA_DIR).filter(f => /^questions(-set\d+)?\.js$/.test(f))) {
    if (path.join(DATA_DIR, f) === OUT) continue;
    const c2 = { window: {} }; vm.createContext(c2); vm.runInContext(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'), c2);
    for (const q of c2.window.SAT_QUESTIONS || []) {
      const m = q.id.match(/-(\d+-\d+-\d+)$/);
      if (m) { const [b, pi, i] = m[1].split('-'); used.add(m[1]); used.add(`${b}-${pi}-${+i + 1}`); }
    }
  }
  const out = {};
  const mk = (c, id) => ({ cid: `${id}-${c.pi}-${c.i}`, s: c.s, prev: c.prev, next: c.next, book: +id });
  const pool = key => {
    const all = [];
    for (const id in books) for (const c of books[id]) if (clean(c.s) && FINDERS[key](c)) all.push(mk(c, id));
    return shuffle(all);
  };
  const take = (key, n, filter) => {
    const picks = [];
    for (const c of pool(key)) {
      if (picks.length >= n) break;
      const ks = [c.cid, ...(key === 'tense' || key === 'forge' ? [`${c.book}-${c.cid.split('-')[1]}-${+c.cid.split('-')[2] + 1}`] : [])];
      if (ks.some(k => used.has(k))) continue;
      if (filter && !filter(c)) continue;
      ks.forEach(k => used.add(k)); picks.push(c);
    }
    return picks;
  };
  // oversample: some drafts will be omitted by the drafter or rejected by validation
  const OVER = { mark: 1.6, agree: 2.6, tense: 1.8, mc: 1.7, forge: 3.2, vocab: 1.7 };
  for (const key of ['agree', 'forge', 'tense', 'mark', 'mc']) out[key] = take(key, Math.ceil((NEED[key] ?? TARGETS[key]) * OVER[key]));
  // vocab: SAT-list words first, then rare corpus words; at most 2 candidates per hint word
  const vcount = {};
  const hintsOf = c => {
    const ws = [...new Set(c.s.toLowerCase().match(/[a-z]{6,}/g) || [])];
    const sat = ws.filter(w => SAT_SET.has(w));
    const rare = ws.filter(w => !SAT_SET.has(w) && (freq[w] || 0) <= 3 && w.length >= 8 && !/(ing|ly|ness|ment)$/.test(w));
    return { sat, rare };
  };
  const vall = [];
  for (const id in books) for (const c of books[id]) {
    if (!clean(c.s) || used.has(`${id}-${c.pi}-${c.i}`)) continue;
    const h = hintsOf(c); if (!h.sat.length && !h.rare.length) continue;
    vall.push({ ...mk(c, id), hints: [...h.sat, ...h.rare].slice(0, 4), score: h.sat.length ? 1 : 0 });
  }
  vall.sort((a, b) => b.score - a.score || rand() - 0.5);
  out.vocab = [];
  for (const c of vall) {
    if (out.vocab.length >= Math.ceil((NEED.vocab ?? TARGETS.vocab) * OVER.vocab)) break;
    if (!c.hints.some(h => (vcount[h] || 0) < 2)) continue;
    c.hints.forEach(h => { vcount[h] = (vcount[h] || 0) + 1; });
    delete c.score; out.vocab.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- existing bank
function loadExisting() {
  if (!fs.existsSync(OUT)) return [];
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(OUT, 'utf8'), ctx);
  return ctx.window.SAT_QUESTIONS || [];
}
const writeBank = (file, header, items) => fs.writeFileSync(file,
  SET_ARG > 1 ? `${header}\nwindow.SAT_QUESTIONS = (window.SAT_QUESTIONS || []).concat(${JSON.stringify(items, null, 1)});\n`
              : `${header}\nwindow.SAT_QUESTIONS = ${JSON.stringify(items, null, 1)};\n`);
const headerOf = () => (fs.existsSync(OUT) && fs.readFileSync(OUT, 'utf8').match(/^\/\*[\s\S]*?\*\//)?.[0]) ||
  `/* Question set ${SET_ARG}: generated by scripts/generate.mjs (see README). */`;
const isSeed = q => !/-\d+-\d+-\d+$/.test(q.id);

// ---------------------------------------------------------------- modes
async function modeDry() {
  const c = await buildCandidates();
  for (const k of KEYS) { console.log(`\n== ${k}: ${c[k].length} candidates (target ${TARGETS[k]})`); c[k].slice(0, 4).forEach(x => console.log(` [${x.book}] ${x.s}${x.hints ? '   hints: ' + x.hints.join(',') : ''}`)); }
}

async function modeExport(dir) {
  const per = +(args['batch-size'] || 60);
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const c = await buildCandidates(); let n = 0;
  for (const k of KEYS) {
    for (let b = 0; b * per < c[k].length; b++) {
      const cands = c[k].slice(b * per, (b + 1) * per).map(x => ({ ...x, bookTitle: BOOKS[x.book] }));
      const name = `batch-${k}-${b + 1}`;
      fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify({ key: k, name, instructions: SYSTEM + '\n\n' + SPEC[k], candidates: cands }, null, 1));
      n++;
    }
    console.log(`${k}: ${c[k].length} candidates`);
  }
  console.log(`wrote ${n} batch files to ${dir}`);
}

function checkFile(batchPath, outPath) {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const byCid = new Map(batch.candidates.map(c => [c.cid, c]));
  let items; try { items = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch (e) { return { ok: [], bad: [{ cid: '?', reason: 'invalid JSON: ' + e.message }] }; }
  const ok = [], bad = [];
  for (const raw of items) {
    const cand = byCid.get(raw.cid);
    if (!cand) { bad.push({ cid: raw.cid, reason: 'unknown cid' }); continue; }
    try { ok.push(finalize(raw, batch.key, cand)); } catch (e) { bad.push({ cid: raw.cid, reason: e.message }); }
  }
  return { ok, bad, key: batch.key, total: batch.candidates.length };
}

function modeCheck(batchPath, outPath) {
  const r = checkFile(batchPath, outPath);
  console.log(`${path.basename(outPath)}: ${r.ok.length} valid, ${r.bad.length} rejected (of ${r.total} candidates)`);
  r.bad.forEach(b => console.log(`  REJECT ${b.cid}: ${b.reason}`));
}

function modeImport(dirs) {
  const existing = loadExisting().filter(isSeed);
  const have = new Set(existing.map(q => q.id));
  const per = {}, vocabUse = {}, seenSentence = new Set(), added = [];
  for (const f of fs.readdirSync(DATA_DIR).filter(f => /^questions(-set\d+)?\.js$/.test(f))) {   // a word already used in another set counts toward the 2-per-word cap
    if (path.join(DATA_DIR, f) === OUT) continue;
    const c2 = { window: {} }; vm.createContext(c2); vm.runInContext(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'), c2);
    for (const q of c2.window.SAT_QUESTIONS || []) if (q.type === 'vocab') vocabUse[q.answer] = (vocabUse[q.answer] || 0) + 1;
  }
  const files = dirs.split(',').flatMap(dir => fs.readdirSync(dir).filter(f => /^batch-.*\.json$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(f => [dir, f]));
  let rejected = 0;
  for (const [dir, f] of files) {
    const out = path.join(dir, 'out', f);
    if (!fs.existsSync(out)) { console.log(`(no drafts yet for ${dir}/${f})`); continue; }
    const r = checkFile(path.join(dir, f), out);
    rejected += r.bad.length;
    for (const item of r.ok) {
      if (have.has(item.id) || DROP.has(item.id)) continue;
      if (BLOCKED.test(JSON.stringify(item))) continue;
      const key = r.key;
      if ((per[key] || 0) >= TARGETS[key] + CUSHION) continue; // cushion; trimmed to the exact total afterwards
      if (key === 'mc' && item.options.every(o => /(^|[ ,;:])(and|but|so|yet|or)\b/i.test(o))) { if ((per.mcFan || 0) >= +(args.fancap ?? 100)) continue; per.mcFan = (per.mcFan || 0) + 1; }
      if (key === 'vocab') { if ((vocabUse[item.answer] || 0) >= 2) continue; vocabUse[item.answer] = (vocabUse[item.answer] || 0) + 1; }
      const sk = words(item.fixed || item.text).join(' '); if (seenSentence.has(sk)) continue; seenSentence.add(sk);
      per[key] = (per[key] || 0) + 1; have.add(item.id); added.push(item);
    }
  }
  // trim to the exact total, dropping from whichever kind is furthest over its target
  const TOTAL = +(args.total || 1200);
  const kindOf = it => it.id.split('-')[0];
  while (existing.length + added.length > TOTAL) {
    const cnt = {}; added.forEach(it => { cnt[kindOf(it)] = (cnt[kindOf(it)] || 0) + 1; });
    const worst = Object.keys(cnt).sort((a, b) => (cnt[b] - TARGETS[b]) - (cnt[a] - TARGETS[a]))[0];
    for (let i = added.length - 1; i >= 0; i--) if (kindOf(added[i]) === worst) { added.splice(i, 1); break; }
  }
  Object.keys(per).forEach(k => delete per[k]); added.forEach(it => { const k = kindOf(it); per[k] = (per[k] || 0) + 1; });
  const merged = existing.concat(added);
  writeBank(args.out ? String(args.out) : OUT, headerOf(), merged);
  console.log('imported per kind:', JSON.stringify(per), ' targets:', JSON.stringify(TARGETS));
  console.log(`rejected by validators: ${rejected}. Bank now has ${merged.length} items (${existing.length} seeds).`);
  console.log('Next: node tests/verify-quotes.mjs');
}

// ---------------------------------------------------------------- direct API mode
const KEY = process.env.ANTHROPIC_API_KEY;
async function claude(system, user, maxTokens = 3000) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch((process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] })
    });
    if (r.ok) { const d = await r.json(); return d.content.filter(b => b.type === 'text').map(b => b.text).join(''); }
    if ([429, 500, 502, 503, 529].includes(r.status)) { await new Promise(res => setTimeout(res, 1500 * 2 ** attempt)); continue; }
    throw new Error(`Anthropic API ${r.status}: ${await r.text()}`);
  }
  throw new Error('Anthropic API: too many retries');
}
const parseArr = t => { const m = t.match(/\[[\s\S]*\]/); if (!m) throw new Error('no JSON array in reply'); return JSON.parse(m[0]); };

async function modeApi() {
  if (!KEY) { console.error('Set ANTHROPIC_API_KEY.'); process.exit(1); }
  const keys = (args.types ? String(args.types).split(',') : KEYS);
  const perType = +(args['per-type'] || 10);
  const cands = await buildCandidates();
  const existing = loadExisting(), have = new Set(existing.map(q => q.id)), created = [];
  for (const key of keys) {
    let got = 0;
    for (let i = 0; i < cands[key].length && got < perType; i += 10) {
      const chunk = cands[key].slice(i, i + 10);
      let drafts; try { drafts = parseArr(await claude(SYSTEM, SPEC[key] + '\n\nCandidates:\n' + JSON.stringify(chunk, null, 1))); } catch (e) { console.log(' - batch failed:', e.message); continue; }
      for (const raw of drafts) {
        const cand = chunk.find(c => c.cid === raw.cid); if (!cand || got >= perType) continue;
        try {
          const item = finalize(raw, key, cand);
          const a = parseArr('[' + (await claude('You review exam items for correctness.', `You are an adversarial SAT grammar reviewer. Is this item's key unambiguously correct under MODERN SAT Standard English conventions (and for vocab, does exactly one option fit)? Reply JSON only: {"ok":true|false,"reason":"..."}\n` + JSON.stringify(item), 400)).replace(/^[^{]*|[^}]*$/g, '') + ']')[0];
          if (!a.ok) throw new Error('audit: ' + a.reason);
          if (!have.has(item.id)) { have.add(item.id); created.push(item); got++; console.log(` + ${item.id}`); }
        } catch (e) { console.log(` - rejected ${raw.cid}: ${e.message.slice(0, 100)}`); }
      }
    }
  }
  writeBank(OUT, headerOf(), existing.concat(created));
  console.log(`Wrote ${existing.length + created.length} items (${created.length} new).`);
}

(async () => {
  if (args['dry-run']) return modeDry();
  if (args.export) return modeExport(String(args.export));
  if (args.check) return modeCheck(String(args.check), args._[0]);
  if (args.import) return modeImport(String(args.import));
  if (args.api) return modeApi();
  console.log('Usage: see the header of scripts/generate.mjs (--dry-run | --export DIR | --check BATCH OUT | --import DIR | --api)');
})().catch(e => { console.error(e); process.exit(1); });
