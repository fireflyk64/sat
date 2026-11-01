# Little Grey Cells: a grammar + SAT-vocab game powered by a chain-reaction machine

A zero-dependency, browser-only game. Answer Agatha Christie–based grammar and vocabulary questions, and every right
answer adds a physics toy to a Rube Goldberg machine that you set off yourself.

Plain HTML/CSS/JS. No build step, no npm packages, no CDN. Works from `file://` too.

## How it plays
**Dominoes knock dominoes, the last domino kicks a resting marble, and that marble rolls down to knock the next row.**

* **Right answer:** a random toy slots into a random gap in the chain. Everything below it slides down to make room and
  the dominoes stand back up.
* **Flick:** pull back on the glowing marble just above the new toy and let go (or press `F` for a plain push). The chain
  runs from there down to the bell. Hit the stars on the way for a score multiplier. While it runs, tap a marble to shove it.
  A flick that misses the machine costs nothing: the marble comes back.
* **No right answer, no flick.** The machine sits locked until the next question is solved. Once a run has played, the next
  one has to be earned.
* **Finish the machine** (6 toys, then 8, 10, up to 12): it resets itself and you run the whole thing in one take. It ends
  with a bell, a resolved chord, a wave of light down the machine, and fireworks. Then a new machine in a new colour scheme.
* **Streaks** change the marble (Fire at 3 in a row, Plasma at 5, Prism at 8, Nova at 12), multiply the score, warm up the
  whole scene, and every 5th in a row adds a bonus toy. A miss resets the streak but never takes anything away.

**Toys** unlock as correct answers add up: Domino Row, Speed Ramp and Peg Field from the start, then Switchback (2),
Catapult (4), Trampoline (6), Wrecking Ball (8), Cannon (10), Nitro Crate (13), Marble Cascade (16), Portal (20),
Newton's Cradle (25).

## Focus: rewards for studying rather than playing
**Focus** builds up since he last played: a right answer adds 1 and a miss takes off ⅓, never going below 0. With four
choices a blind guess is right 1 time in 4, so guessing nets exactly zero (the old SAT used ¼ because it had five choices).
Focus carries across sessions, and only playing resets it: a flick, or using an item from the chest. Clear progress bars show
all three rewards:

| at | chance | wins |
|---|---|---|
| every 10 | 33% | a big bonus: Marble Flood, TNT Crate, Wrecking Fist |
| every 20 | 25% | a rare: Neon Sand, Moon Gravity, Super Magnet, Black Hole, Meteor Storm, The Colossus |
| every 100 | 10% | an ultra rare: Upside Down (tap to flip gravity), Rewind (hold to run time backward) |

Each bar has its own counter. A win pays out and resets that bar only, and a losing roll lets it try again at the next
multiple. Each goal rolls once, so dropping below it and climbing back up does not roll again.

The flick prompt stays out of the way during a study run: the marble's rings, its "pull back" text and the stars beside it only
animate when Focus is under 5 or the mouse is over the play window. Otherwise there is just a still ring around the marble.

**🧊 Freezes** let him take a short break without losing Focus. Every 5 correct **in a row** (a miss breaks this count, though
not Focus) earns one. The next time he plays, a freeze is spent instead of Focus resetting. A freeze melts after 5 questions,
right or wrong, and he can hold up to 3. Retrying a flick that missed the machine is free.

**The chest** stays collapsed to one quiet line until it is clicked. Won items save up until he chooses to use them, each one a timed break of 45, 75 or 90 seconds. Anything goes,
including tearing the machine apart, because it is rebuilt from its recipe afterwards and the pieces fly home. Items not found
yet show as `?`. The chest and the list of everything ever found are saved in `localStorage` and in a cookie of their own
(`lgc_chest`), so they survive a wiped `localStorage`.

**Controls:** drag on empty space or scroll the wheel to pan, Ctrl/Cmd+wheel or pinch to zoom. The HUD buttons toggle sound,
fast-forward, zoom, see the whole machine, and follow the action.

## Misses come back: the cold case file
A missed question becomes a **cold case** and stays open until it has been answered correctly in **two different sessions**:

1. It comes back 4 to 6 questions later in the same session, so there is a gap and it is real recall.
2. It comes back early in every later session, alternating with other questions (the very first question of a session is
   the oldest open miss).
3. Solved in one session: one down. Solved again in a later session: case closed. Missing it again starts the count over.

Solving a cold case earns a **gold marble** (score ×3) and a **bonus toy**, so old misses are worth seeking out.
A "session" is a page load, or coming back after 30 minutes away.

Everything is saved **in the browser only**. Progress goes in `localStorage`, and the list of misses is also mirrored into a
cookie, so clearing or evicting `localStorage` does not lose them. The game also asks the browser to keep its data
(`navigator.storage.persist()`). Saves from the earlier version of the game carry over, with past misses filed as cold cases.
Saves are per browser and per device, and clearing all site data removes them. Other questions follow Leitner spacing
(1, 3, 7, 14, 30 days).

## Run it
    python3 -m http.server 8000     # then open http://localhost:8000
(or just open `index.html`). Append `?q=forge-1` to jump straight to one question id, or `?lofi=1` to force the plain
2D renderer. The game uses WebGL2 and turns its own quality down if frames run long; without WebGL2 it falls back to the 2D renderer.

## Publish (GitHub Pages)
Served at https://fireflyk64.github.io/sat/ as the `sat/` folder of the shared `fireflyk64.github.io` repo, which has one
folder per project. Publish from a commit, copy only what the page needs, and stage only that folder:

    H=$(git rev-parse --short HEAD); PAGES=../fireflyk64.github.io
    (cd $PAGES && git pull -q --ff-only && rm -rf sat && mkdir sat)
    git archive HEAD index.html css js data/questions.js data/questions-set2.js data/questions-set3.js | tar -x -C $PAGES/sat
    (cd $PAGES && git add -A sat && git commit -m "sat: what changed (from sat $H)" && git push origin main)

Leave Pages off on the `sat` repo itself: a project site at the same path could compete with this folder.

## Question types (all auto-graded exactly)
| type | skill | what the student does |
|---|---|---|
| `mark` | commas, capitals | taps the gaps where commas go and the words that need capitals |
| `tapfix` | agreement, tense | taps the real subject (or the wrong-tense verb), then picks the fix |
| `mc` | commas / conventions | SAT-style "conforms to Standard English" multiple choice |
| `forge` | proofreading | finds N planted errors (words or missing/extra commas) |
| `vocab` | vocabulary | SAT "words in context" with Christie sentences; definitions shown after answering |

## Grammar standard
Answer keys follow **modern SAT Standard English Conventions**, not Christie's 1920s punctuation.
`scripts/generate.mjs` tells the model to skip any sentence whose punctuation is dated or arguable, and a second
model call audits each key before it is written.

## The question bank (2526 items in three sets)
* **Set 1** (`data/questions.js`): 6 seed items + 1194 drafted items from six Poirot books.
* **Set 2** (`data/questions-set2.js`): 1200 more, built from *different sentences* (none are reused) in seven more Christie
  novels that are public domain in the US (*The Secret Adversary*, *The Man in the Brown Suit*, *The Secret of Chimneys*,
  *The Seven Dials Mystery*, *The Murder at the Vicarage*, *Partners in Crime*, *The Mysterious Mr. Quin*) plus unused
  sentences from the Poirot books. The page loads every set; more sets can be added the same way (`--set 4`).
* **Set 3** (`data/questions-set3.js`): 133 conjunction questions, hand-picked from all 13 books (see below).

Sets 1 and 2 by kind (set 3 is all `mc`):

| kind | what it trains | set 1 | set 2 |
|---|---|---|---|
| `mark` | tap commas + capitals | 255 | 194 |
| `mc` | SAT-style conventions choice | 301 | 173 |
| `forge` | find 3 planted errors | 203 | 338 |
| `vocab` | SAT words: the missing word's meaning is shown above the sentence (so only one option fits both the definition and the blank), or pick the word that matches a meaning | 196 | 175 |
| `tapfix` agreement | find the real subject, pick the verb | 120 | 244 |
| `tapfix` tense | spot the odd verb, pick the fix | 123 | 76 |

### Conjunction questions: the comma cannot just be guessed
Every question with a blank at and, but, so, yet or or offers the same real choices (`, and` / `and` / `and,`, plus an
always-wrong one), so the student has to decide. Cover the conjunction and read what follows:

| what follows | choice | example |
|---|---|---|
| a full sentence | `, and` | The lawyer was in his office**, and** we were ushered in. |
| no subject of its own | `and` | Tommy took the envelope **and** opened it. |
| no subject, then an interruption | `and,` | Griselda met me in the hall **and,** with tears in her eyes, dragged me in. |
| `so` + a full sentence | `, so` | He did not answer immediately**, so** I went on. |
| `so that` / `so as to` (a purpose) | `so` | They left the doors ajar **so** that they could see. |

The comma before the conjunction is right about half the time (and 50%, but 55%, so 59%), and `node tests/verify-quotes.mjs`
fails if that drifts outside 35 to 65%. Keys follow modern SAT rules, so many "but" sentences drop the comma Christie herself
wrote ("Anthony nodded, but did not speak"): no comma goes between two verbs with one subject. `scripts/apply-conjunctions.mjs`
holds the chosen sentences and rebuilds these questions. A separate reviewer audited all of them against SAT rules: no key was
wrong, and 13 questions were dropped as unclear out of context, open to two readings, or unsuitable for a teen.

### How quality was controlled

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
4. **Gameplay check**: the original 2400 items were solved through the real UI with the right answer (all graded correct), and every conjunction question was then checked by clicking all four choices through the real widget. Option order is shuffled every time an item is shown so the key is never in a predictable slot.
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

## How it is built
| file | what it does |
|---|---|
| `js/physics.js` | a small Box2D-Lite-style engine written for this project: oriented boxes and circles, sequential impulses, friction, sleeping, hinges, sensors, explosions |
| `js/track.js` | the machine: builds every toy from a recipe, runs the chain, and helps a stalled chain along. A recipe always builds the same machine, which is what lets a new piece slot into any gap |
| `js/progress.js` | everything saved between sessions: cold cases, question scheduling, the machine's recipe, Focus, freezes, the chest |
| `js/rewards.js` | the items that can be won |
| `js/playground.js` | what each item does during a break |
| `js/sand.js` | falling sand: a cellular automaton that heaps on ramps and pushes on dominoes |
| `js/fx.js` | a WebGL2 engine: instanced shader-drawn shapes, HDR bloom, shockwave distortion, chromatic aberration, tone mapping, plus the 2D fallback |
| `js/render.js` | draws the machine, particles, camera, and the tween that rearranges it |
| `js/sound.js` | all audio synthesised live with WebAudio: no sound files |
| `js/game.js` | glue: the flick, scoring, streaks, the HUD, the finale |
| `js/quiz.js` | question widgets and exact grading |

## Tests
No install needed for any of these:

    node tests/physics-test.mjs     # engine: toppling, hinges, sensors, explosions
    node tests/machine-test.mjs     # every toy and 30 random machines must run from flick to bell on real physics
    node tests/playground-test.mjs  # every chest item on a real machine, and sand: no errors, no slowdowns, clean rebuild
    node tests/progress-test.mjs    # simulated sessions: do misses come back, survive a wiped localStorage, close correctly?
    node tests/browser-test.mjs     # real Chrome, real clicks and reloads, start to finale (needs Chrome and python3; set CHROME=/path if needed)
    node tests/verify-quotes.mjs    # every question re-checked against the Project Gutenberg text, and conjunction answers balanced
