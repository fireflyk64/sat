# Little Grey Cells: a grammar + SAT-vocab game with a domino run

A zero-dependency, browser-only game. Answer Agatha Christie–based grammar and vocabulary
questions; every correct answer adds a randomized platform and row of dominoes to a marble run,
every 5th correct answer earns a marble, and releasing it topples the dominoes. After a run
finishes, the next correct answer wipes the board and starts a fresh random run.

Plain HTML/CSS/JS. No build step, no npm packages, no CDN. Works from `file://` too.

## How the run grows
After each correct answer you choose where the next piece goes with the toolbar under the run: **Left / Right** (the same
direction as the last piece carries straight on; the opposite direction makes a U-turn with a backstop) and the piece type
(**Dominoes**, **Pegs**, **Steep** drop, or a 🎲 surprise). A pulsing yellow arrow previews where it will attach.
There is no size limit. Drag to pan, scroll the wheel to pan (Ctrl/Cmd+wheel or pinch to zoom), `+`/`−` to zoom,
`⤢` to see the whole contraption, `◎` to follow the action again.

## Run it
    python3 -m http.server 8000     # then open http://localhost:8000
(or just open `index.html`). Append `?q=forge-1` to jump straight to one question id.

## Publish (GitHub Pages)
Push to the `sat` repo of `fireflyk64`, then Settings → Pages → "Deploy from a branch" → `main` / `(root)`.
It will be served at https://fireflyk64.github.io/sat/.

## Question types (all auto-graded exactly)
| type | skill | what the student does |
|---|---|---|
| `mark` | commas, capitals | taps the gaps where commas go and the words that need capitals |
| `tapfix` | agreement, tense | taps the real subject (or the wrong-tense verb), then picks the fix |
| `mc` | commas / conventions | SAT-style "conforms to Standard English" multiple choice |
| `forge` | proofreading | finds N planted errors (words or missing/extra commas) |
| `vocab` | vocabulary | SAT "words in context" with Christie sentences; definitions shown after answering |

Progress is stored in `localStorage` (Leitner boxes: a missed item returns right away, then after 1, 3, 7, 14, 30 days).

## Grammar standard
Answer keys follow **modern SAT Standard English Conventions**, not Christie's 1920s punctuation.
`scripts/generate.mjs` tells the model to skip any sentence whose punctuation is dated or arguable, and a second
model call audits each key before it is written.

## The question bank (2400 items in two sets of 1200)
* **Set 1** (`data/questions.js`): 6 seed items + 1194 drafted items from six Poirot books.
* **Set 2** (`data/questions-set2.js`): 1200 more, built from *different sentences* (none are reused) in seven more Christie
  novels that are public domain in the US (*The Secret Adversary*, *The Man in the Brown Suit*, *The Secret of Chimneys*,
  *The Seven Dials Mystery*, *The Murder at the Vicarage*, *Partners in Crime*, *The Mysterious Mr. Quin*) plus unused
  sentences from the Poirot books. The page loads every set; more sets can be added the same way (`--set 3`).

| kind | what it trains | set 1 | set 2 |
|---|---|---|---|
| `mark` | tap commas + capitals | 255 | 194 |
| `mc` | SAT-style conventions choice | 301 | 173 |
| `forge` | find 3 planted errors | 203 | 338 |
| `vocab` | SAT words: the missing word's meaning is shown above the sentence (so only one option fits both the definition and the blank), or pick the word that matches a meaning | 196 | 175 |
| `tapfix` agreement | find the real subject, pick the verb | 120 | 244 |
| `tapfix` tense | spot the odd verb, pick the fix | 123 | 76 |

How quality was controlled (both sets):

1. **Mechanical validators** (`scripts/generate.mjs`, run on every draft): the sentence is word-for-word from the book;
   `forge` errors are exactly the three real differences between forged and correct text; `tense` changes exactly one verb;
   `agree`/`mc`/`vocab` answers reproduce the original sentence and sit among distinct options. A blocklist keeps dated
   ethnic terms from the 1920s texts out. `node tests/verify-quotes.mjs` re-checks every item in every set against Project
   Gutenberg and fails on duplicate ids.
2. **Independent audit**: every item was reviewed by a separate adversarial reviewer under modern SAT rules; items with
   optional/arguable commas, a second defensible option, or context outside the sentence were dropped
   (`data/audit-dropped.json`, `data/audit-dropped-set2.json`). Set 1 lost 224 items, set 2 lost 119 (set 2's drafters were
   given the audit's lessons up front).
3. **Vocab uniqueness review**: reviewers checked that exactly one option can have the shown meaning (no synonym
   distractors, accurate definitions). When the sentence has "a"/"an" before the blank, the game moves the article into every
   choice ("an ingenuous" / "a tender"), chosen by sound (an hour, a unique), so it can never hint at the answer.
4. **Gameplay check**: all 2400 items were solved through the real UI with the right answer (all graded correct), and
   option order is shuffled every time an item is shown so the key is never in a predictable slot.

This is a review by AI, not by a teacher: grammar keys are judgement calls, so spot-check the "Correct version" line and
tell me about any item you disagree with.

### Making or extending the bank
Direct API (needs a key; model `claude-sonnet-5-5`; each draft is also audited by a second model call):

    export ANTHROPIC_API_KEY=sk-ant-...
    node scripts/generate.mjs --api --types vocab,mark --per-type 20

Batch-file workflow (what produced the 1200; no key needed, any Claude session can draft):

    node scripts/generate.mjs --export work/        # candidate sentences + instructions -> work/batch-<kind>-<n>.json
    #   drafter reads a batch and writes work/out/batch-<kind>-<n>.json (array of items)
    node scripts/generate.mjs --check work/batch-mark-1.json work/out/batch-mark-1.json   # lint one file
    node scripts/generate.mjs --import work/        # validate everything and merge into data/questions.js
    # a new set: add --set 2 (or 3...) to export/import; it writes data/questions-set2.js and skips every sentence used in other sets
    node scripts/generate.mjs --dry-run             # just preview candidates
    # top-ups: --exclude work/ --loose|--looser --need mark=50,vocab=40   (new sentences only, wider pools)
    # final merge: --import work/,work2/ --drop dropped.json --total 1200   (apply audit drops, trim to an exact total)

## Sources / copyright
Only texts that are public domain in the US are used (published before 1931). Set 1: *Styles*, *Murder on the Links*,
*Poirot Investigates*, *Roger Ackroyd*, *The Big Four*, *The Mystery of the Blue Train*. Set 2 adds the seven novels/collections
listed above.
*Murder on the Orient Express* (1934) is still under copyright in the US, so it is not included.

## Physics
`js/physics.js` is a small Box2D-Lite-style engine written for this project (oriented boxes + circles, sequential
impulses, friction, restitution, sleeping), because the game must have no dependencies. `tests/physics-test.mjs`
runs it headlessly.
