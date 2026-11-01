/*
 * Sample question bank. Every sentence is quoted from a public-domain Agatha Christie text on
 * Project Gutenberg (the only departures are the deliberately forged errors in the "forge" item).
 * Regenerate / extend with:  node scripts/generate.mjs   (see README.md)
 *
 * Item types:
 *   mark    - tap gaps to add commas, tap words to capitalise.        {text, optionalCommas?}
 *   tapfix  - tap the word (subject / bad verb), then pick the fix.   {text, targetWords, options, answer}
 *   mc      - SAT-style multiple choice ("Standard English conventions").   {stem, options, answer}
 *   forge   - find N planted errors (words or gaps).                  {text, errors:[{word}|{gapAfter}]}
 *   vocab   - words-in-context fill in the blank.                     {stem, options, answer, definitions}
 */
window.SAT_QUESTIONS = [
 {
  "id": "mark-comma-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Miss Ganett stopped for breath, and the colonel, who was totally uninterested in the servant question, remarked that in the Shanghai Club brisk play was the invariable rule.",
  "rule": "Use a comma before and, but, or so when it joins two complete sentences. Put commas on both sides of an extra detail you could lift out (\"who was totally uninterested in the servant question\"). Capitalize names and titles: Miss Ganett, the Shanghai Club.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The countenances of Cynthia and Nibs ___ suddenly petrified into a stern and forbidding expression.",
  "targetWords": [
   "countenances"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The countenances of Cynthia and Nibs were suddenly petrified into a stern and forbidding expression.",
  "hint1": "\"Cynthia and Nibs\" sits inside the phrase \"of Cynthia and Nibs\", so it is not the subject. Cross out the \"of ...\" phrase and see what is left.",
  "rule": "Find the subject first, then match the verb to it. Words in an \"of ...\" phrase sit between the subject and the verb, but they do not control it. \"Countenances\" is plural, so the verb is \"were\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-intro-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "___ the lights quivered and went out.",
  "options": [
   "Suddenly, without any warning,",
   "Suddenly without any warning,",
   "Suddenly, without any warning",
   "Suddenly; without any warning,"
  ],
  "answer": "Suddenly, without any warning,",
  "fixed": "Suddenly, without any warning, the lights quivered and went out.",
  "rule": "A comma follows an introductory word (\"Suddenly,\"). An interrupter such as \"without any warning\" needs a comma on both sides, so you cannot have one comma without the other. A semicolon needs a complete sentence on each side.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I refrained from comments, accepting Mrs. Ackroyd’s story on its merits. I even forbear to ask her why it was necessary to abstract what she wanted in such a surreptitious manner.",
  "targetWords": [
   "forbear"
  ],
  "options": [
   "forbore",
   "forbears",
   "will forbear",
   "am forbearing"
  ],
  "answer": "forbore",
  "fixed": "I refrained from comments, accepting Mrs. Ackroyd’s story on its merits. I even forbore to ask her why it was necessary to abstract what she wanted in such a surreptitious manner.",
  "hint1": "The narrator is telling a story about the past. Which verb does not match \"refrained\" and \"wanted\"?",
  "rule": "Keep the tense steady unless the time really changes. The whole passage is in the past tense (\"refrained\", \"was\", \"wanted\"), so \"forbear\" has to become \"forbore\". (To forbear is to hold yourself back from doing something.)",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "There were blood on his lips, and he held his right hand out, pointing.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "fixed": "There was blood on his lips, and he held his right hand out, pointing.",
  "rule": "The subject \"blood\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I think we all flinched back a little, excepting Geoffrey Raymond, who remained good humored and ___ as usual.",
  "options": [
   "imperturbable",
   "affable",
   "urbane",
   "ebullient"
  ],
  "answer": "imperturbable",
  "definitions": {
   "imperturbable": "not easily upset or excited; calm",
   "affable": "friendly and easy to talk to",
   "urbane": "smooth and polished in manner",
   "ebullient": "bubbling over with cheerful energy"
  },
  "fixed": "I think we all flinched back a little, excepting Geoffrey Raymond, who remained good humored and imperturbable as usual.",
  "rule": "Use the clues in the sentence. Everyone else \"flinched\" but Raymond \"remained good humored\", so the missing word has to describe someone who stays calm. Imperturbable means impossible to ruffle.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-2151-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "A good deal of gossip ___ handed round at these evenings, sometimes seriously interfering with the game in progress.",
  "targetWords": [
   "deal"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "A good deal of gossip is handed round at these evenings, sometimes seriously interfering with the game in progress.",
  "hint1": "The phrase 'A good deal of' is a singular quantity, even though a noun follows it.",
  "rule": "The verb agrees with its true subject, not the noun nearby. The subject is the singular 'deal', so the sentence needs 'is'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-783-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ just a trace of hesitation in his manner, as though he would have liked to question her further, but Miss Russell clearly accepted the words as a dismissal, and glided from the room.",
  "targetWords": [
   "trace"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was just a trace of hesitation in his manner, as though he would have liked to question her further, but Miss Russell clearly accepted the words as a dismissal, and glided from the room.",
  "hint1": "In a 'There ___' sentence the subject comes after the verb, so look past the word 'There'.",
  "rule": "In inverted sentences the verb agrees with the noun that follows it, not with 'There'. The subject is the singular 'trace', so the verb is 'was'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-72824-1409-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "A man with the Comte's experience ___ not neglect to take precautions.",
  "targetWords": [
   "man"
  ],
  "options": [
   "does",
   "do"
  ],
  "answer": "does",
  "fixed": "A man with the Comte's experience does not neglect to take precautions.",
  "hint1": "A phrase beginning with 'with' sits between the subject and the verb.",
  "rule": "A prepositional phrase never changes the subject. The subject is the singular 'man', not 'experience', so the verb is 'does'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-61262-1650-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "All Mrs. Davenheim’s jewels ___ kept in the safe.",
  "targetWords": [
   "jewels"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "All Mrs. Davenheim’s jewels were kept in the safe.",
  "hint1": "A singular name comes right before the true subject, but it is only a possessive.",
  "rule": "The verb agrees with the noun that is actually kept, not with a possessive name. The subject is the plural 'jewels', so the verb is 'were'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-1018-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a certain impulsiveness in his manner which reminded me of his mother.",
  "targetWords": [
   "impulsiveness"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a certain impulsiveness in his manner which reminded me of his mother.",
  "hint1": "The subject comes after the verb in a 'There ___' sentence.",
  "rule": "In inverted sentences, find the noun after the verb. The subject is the singular 'impulsiveness', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-70114-232-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ people, not scaremongers, who know what they are talking about, and they say that there is a force behind the scenes which aims at nothing less than the disintegration of civilisation.",
  "targetWords": [
   "people"
  ],
  "options": [
   "are",
   "is"
  ],
  "answer": "are",
  "fixed": "There are people, not scaremongers, who know what they are talking about, and they say that there is a force behind the scenes which aims at nothing less than the disintegration of civilisation.",
  "hint1": "The subject follows the verb, and a word group set off by commas interrupts it.",
  "rule": "In a 'There ___' sentence the verb agrees with the noun after it, ignoring interrupters. The subject is the plural 'people', so the verb is 'are'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-61262-1902-7",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "One of the young secretaries of the Embassy ___ with me.",
  "targetWords": [
   "one"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "One of the young secretaries of the Embassy was with me.",
  "hint1": "Two plural-sounding nouns sit inside the 'of' phrases after the subject.",
  "rule": "The word 'One' is singular, and the 'of' phrases that follow do not change that. The subject is 'One', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-1828-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The dirty plates and dishes ___ sent up in the same manner.",
  "targetWords": [
   "plates"
  ],
  "options": [
   "are",
   "is"
  ],
  "answer": "are",
  "fixed": "The dirty plates and dishes are sent up in the same manner.",
  "hint1": "Two nouns are joined by 'and'.",
  "rule": "A subject joined by 'and' is plural. 'Plates and dishes' together need the plural verb 'are'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-58866-2625-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___, of course, various points in the case that remained puzzling to the police, but Poirot explained things in so plausible a fashion that all query about them was gradually stilled.",
  "targetWords": [
   "points"
  ],
  "options": [
   "were",
   "was"
  ],
  "answer": "were",
  "fixed": "There were, of course, various points in the case that remained puzzling to the police, but Poirot explained things in so plausible a fashion that all query about them was gradually stilled.",
  "hint1": "The words 'of course' interrupt the verb and its subject, which comes later.",
  "rule": "In a 'There ___' sentence the verb agrees with the noun after it, ignoring interrupters. The subject is the plural 'points', so the verb is 'were'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-69087-3071-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The calls on my purse ___ been so frequent of late that I fear it is impossible for me to accede to your request.",
  "targetWords": [
   "calls"
  ],
  "options": [
   "have",
   "has"
  ],
  "answer": "have",
  "fixed": "The calls on my purse have been so frequent of late that I fear it is impossible for me to accede to your request.",
  "hint1": "A singular noun sits in the phrase between the subject and the verb.",
  "rule": "The verb agrees with the true subject, not the noun in the phrase after it. The subject is the plural 'calls', not 'purse', so the verb is 'have'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-70114-1724-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "In his voice there ___ certainly a faint resemblance to the buttoned-up-stranger who had called upon us in Paris.",
  "targetWords": [
   "resemblance"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "In his voice there was certainly a faint resemblance to the buttoned-up-stranger who had called upon us in Paris.",
  "hint1": "The sentence is inverted, and a different noun appears first.",
  "rule": "Find the noun that the sentence is really about, even when it comes after the verb. The subject is the singular 'resemblance', so the verb is 'was'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-58866-2207-10",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The circumstances of the crime ___ quite different in her case.",
  "targetWords": [
   "circumstances"
  ],
  "options": [
   "were",
   "was"
  ],
  "answer": "were",
  "fixed": "The circumstances of the crime were quite different in her case.",
  "hint1": "A singular noun follows the subject in an 'of' phrase.",
  "rule": "The 'of' phrase does not decide agreement. The subject is the plural 'circumstances', not 'crime', so the verb is 'were'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-61262-743-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "On her dark head ___ a little hat of flame-coloured leather.",
  "targetWords": [
   "hat"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "On her dark head was a little hat of flame-coloured leather.",
  "hint1": "The sentence starts with a place phrase and the subject comes after the verb.",
  "rule": "When a sentence is inverted, flip it around to find the subject. A little hat was on her dark head, so the subject is the singular 'hat' and the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-1830-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "An angry woman of the type of the dancer ___ not likely to bother about the strict veracity of her statements.",
  "targetWords": [
   "woman"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "An angry woman of the type of the dancer was not likely to bother about the strict veracity of her statements.",
  "hint1": "Several nouns pile up in 'of' phrases after the subject.",
  "rule": "Prepositional phrases never change the subject. The subject is the singular 'woman', so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-863-1079-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There was a breathless hush, and every eye ___ fixed on the famous London specialist, who was known to be one of the greatest authorities of the day on the subject of toxicology.",
  "targetWords": [
   "eye"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a breathless hush, and every eye was fixed on the famous London specialist, who was known to be one of the greatest authorities of the day on the subject of toxicology.",
  "hint1": "Many people are looking, but look closely at the word 'every'.",
  "rule": "'Every' plus a singular noun takes a singular verb, even when it means many people. The subject is 'eye', so the verb is 'was'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-61262-1464-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The Prime Minister’s car ___ closely followed by another car containing detectives in plain clothes.",
  "targetWords": [
   "car"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The Prime Minister’s car was closely followed by another car containing detectives in plain clothes.",
  "hint1": "Plural nouns appear after the subject, in the later part of the sentence.",
  "rule": "The verb agrees with its subject, not with nouns that come later. The subject is the singular 'car', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-863-28-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The village of Styles St. Mary ___ situated about two miles from the little station, and Styles Court lay a mile the other side of it.",
  "targetWords": [
   "village"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The village of Styles St. Mary was situated about two miles from the little station, and Styles Court lay a mile the other side of it.",
  "hint1": "A name ends the 'of' phrase right before the verb.",
  "rule": "A prepositional phrase does not change the subject. The subject is the singular 'village', so the verb is 'was'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-72824-1789-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ very few things that the Comte did not know about women.",
  "targetWords": [
   "things"
  ],
  "options": [
   "were",
   "was"
  ],
  "answer": "were",
  "fixed": "There were very few things that the Comte did not know about women.",
  "hint1": "The subject comes after the verb, and 'very few' tells you its number.",
  "rule": "In a 'There ___' sentence the verb agrees with the noun after it. The subject is the plural 'things', so the verb is 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-70114-1799-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The commander's instructions ___ to land me at a certain spot on the Belgian coast.",
  "targetWords": [
   "instructions"
  ],
  "options": [
   "were",
   "was"
  ],
  "answer": "were",
  "fixed": "The commander's instructions were to land me at a certain spot on the Belgian coast.",
  "hint1": "A singular possessive noun comes right before the subject.",
  "rule": "The possessive 'commander's' only shows ownership and does not set the verb. The subject is the plural 'instructions', so the verb is 'were'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-70114-506-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ not many geniuses of her stamp in the world.",
  "targetWords": [
   "geniuses"
  ],
  "options": [
   "are",
   "is"
  ],
  "answer": "are",
  "fixed": "There are not many geniuses of her stamp in the world.",
  "hint1": "The subject follows the verb and is described by 'not many'.",
  "rule": "In a 'There ___' sentence the verb agrees with the noun after it. The subject is the plural 'geniuses', so the verb is 'are'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-863-699-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The reaction after a shock ___ always trying, and I think we were all suffering from it.",
  "targetWords": [
   "reaction"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The reaction after a shock is always trying, and I think we were all suffering from it.",
  "hint1": "The phrase after the subject starts with 'after' and contains another noun.",
  "rule": "The verb agrees with the true subject, not the noun in the phrase after it. The subject is the singular 'reaction', so the verb is 'is'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-69087-182-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The one thing we do know about him ___ that he is interested in the growing of vegetable marrows.",
  "targetWords": [
   "thing"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The one thing we do know about him is that he is interested in the growing of vegetable marrows.",
  "hint1": "A pronoun and a clause come between the subject and the verb.",
  "rule": "The clause 'we do know about him' only describes the subject. The subject is the singular 'thing', so the verb is 'is'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-58866-1670-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The firm in which Monsieur Beroldy was a partner ___ a small one, and although doing well, it did not yield a large income to the junior partner.",
  "targetWords": [
   "firm"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The firm in which Monsieur Beroldy was a partner was a small one, and although doing well, it did not yield a large income to the junior partner.",
  "hint1": "A long phrase starting with in which sits between the subject and its verb.",
  "rule": "Ignore the interrupting phrase to find the true subject. The subject is the singular firm, so the verb is was.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-136-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "A rich man and his money ___ not so easily parted.",
  "targetWords": [
   "man",
   "money"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "are",
  "fixed": "A rich man and his money are not so easily parted.",
  "hint1": "The subject is two things joined by and.",
  "rule": "Two subjects joined by and take a plural verb. A man and his money together make a plural subject, so use are.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-72824-157-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ something venerable and patriarchal about M. Papopolous.",
  "targetWords": [
   "something"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was something venerable and patriarchal about M. Papopolous.",
  "hint1": "The sentence begins with there, so the real subject comes after the verb.",
  "rule": "In a there sentence, the verb agrees with the noun that follows it. The subject is the singular something, so use was.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-70114-489-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ two occupants, both busy with some experiment.",
  "targetWords": [
   "occupants"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "There were two occupants, both busy with some experiment.",
  "hint1": "The sentence begins with there, so the real subject comes after the verb.",
  "rule": "In a there sentence, find the subject after the verb. The subject is the plural occupants, so use were.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-69087-370-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "On a round table ___ various magazines and sporting papers.",
  "targetWords": [
   "magazines",
   "papers"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "On a round table were various magazines and sporting papers.",
  "hint1": "The sentence is inverted: the subject comes after the verb, and the singular table comes first.",
  "rule": "Flip the sentence to find the subject: various magazines and sporting papers were on a round table. The subject is plural, so use were.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-1197-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The police ___ well known to be of a stupidity incredible!",
  "targetWords": [
   "police"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The police were well known to be of a stupidity incredible!",
  "hint1": "Police names a group of people, and it is treated as plural.",
  "rule": "The word police is always plural in standard English, like people. So it takes the plural verb were.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-69087-3177-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The attention of every one ___, of course, focused on the murdered man.",
  "targetWords": [
   "attention"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The attention of every one was, of course, focused on the murdered man.",
  "hint1": "A phrase about many people sits between the subject and the verb.",
  "rule": "The verb agrees with the subject, not the object of a phrase like of every one. The subject is the singular attention, so use was.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-1918-14",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The one thing he does not do ___ to draw the curtains.",
  "targetWords": [
   "thing"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The one thing he does not do is to draw the curtains.",
  "hint1": "The clause he does not do sits right before the verb, and curtains comes after it.",
  "rule": "The subject is the singular thing, and a describing clause does not change it. The verb is is, even though curtains is plural.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-70114-1738-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ nothing to show that both occurrences had not been a pure accident.",
  "targetWords": [
   "nothing"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was nothing to show that both occurrences had not been a pure accident.",
  "hint1": "The plural word occurrences appears later, but it is not the subject.",
  "rule": "In a there sentence, the verb agrees with the noun after it. The subject is the singular nothing, so use was.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-70114-232-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "In Russia, you know, there ___ many signs that Lenin and Trotsky were mere puppets whose every action was dictated by another's brain.",
  "targetWords": [
   "signs"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "In Russia, you know, there were many signs that Lenin and Trotsky were mere puppets whose every action was dictated by another's brain.",
  "hint1": "The sentence begins with there, so the real subject comes after the verb.",
  "rule": "In a there sentence, find the subject after the verb. The subject is the plural signs, so use were.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-863-178-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The countenances of Cynthia and Nibs ___ suddenly petrified into a stern and forbidding expression.",
  "targetWords": [
   "countenances"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The countenances of Cynthia and Nibs were suddenly petrified into a stern and forbidding expression.",
  "hint1": "Two names after of can pull you toward the wrong verb, but they are not the subject.",
  "rule": "The verb agrees with the head noun, not the words in the of phrase. The subject is the plural countenances, so use were.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-58866-2534-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The cries for help ___ getting noticeably fainter.",
  "targetWords": [
   "cries"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The cries for help were getting noticeably fainter.",
  "hint1": "A singular noun, help, sits right before the verb.",
  "rule": "Skip the for phrase to find the real subject. The subject is the plural cries, so use were.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-70114-1085-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The top of it ___ exquisite, inlaid with squares of silver and black to represent a chess-board.",
  "targetWords": [
   "top"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The top of it was exquisite, inlaid with squares of silver and black to represent a chess-board.",
  "hint1": "The subject is followed by an of phrase.",
  "rule": "The verb agrees with the head noun, not the pronoun in the of phrase. The subject is the singular top, so use was.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-70114-701-9",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The mechanism of this cigarette ___ most ingenious.",
  "targetWords": [
   "mechanism"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The mechanism of this cigarette is most ingenious.",
  "hint1": "The subject is followed by an of phrase.",
  "rule": "Find the head noun before the of phrase. The subject is the singular mechanism, so use is.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-863-2430-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "In the room below, John and Mary ___ together once more, while Alfred Inglethorp and Miss Howard were in custody.",
  "targetWords": [
   "john",
   "mary"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "In the room below, John and Mary were together once more, while Alfred Inglethorp and Miss Howard were in custody.",
  "hint1": "The subject is two names joined by and, and a singular noun, room, comes first.",
  "rule": "Two subjects joined by and take a plural verb. John and Mary make a plural subject, so use were.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-69087-2506-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ so much meaning in his voice as to surprise the two police officers.",
  "targetWords": [
   "meaning"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was so much meaning in his voice as to surprise the two police officers.",
  "hint1": "The sentence begins with there, and the plural word officers comes later.",
  "rule": "In a there sentence, the verb agrees with the noun after it. The subject is the singular meaning, so use was.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-863-265-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ therefore three witnesses who could swear that Mrs. Inglethorp was carrying her coffee, as yet untasted, in her hand.",
  "targetWords": [
   "witnesses"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "There were therefore three witnesses who could swear that Mrs. Inglethorp was carrying her coffee, as yet untasted, in her hand.",
  "hint1": "The sentence begins with \"There,\" so the real subject comes after the verb.",
  "rule": "When a sentence starts with \"There,\" the verb agrees with the noun that follows it. Here the subject is \"witnesses,\" which is plural, so the verb is \"were.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-58866-727-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a dimple in the round chin, and the half parted lips seemed always to hover on the verge of a mysterious smile.",
  "targetWords": [
   "dimple"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a dimple in the round chin, and the half parted lips seemed always to hover on the verge of a mysterious smile.",
  "hint1": "The subject follows the verb, and plural nouns (chin, lips) appear nearby.",
  "rule": "After \"There,\" the verb agrees with the noun that follows it. The subject of this clause is the singular \"dimple,\" so the verb is \"was.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-61262-2014-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The intention of the testator ___ clear, and the beneficiary is his only living relation.",
  "targetWords": [
   "intention"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The intention of the testator is clear, and the beneficiary is his only living relation.",
  "hint1": "Ignore the noun in the \"of\" phrase.",
  "rule": "A verb agrees with its true subject, not the noun in a prepositional phrase. The subject is \"intention,\" not \"testator\" or any plural, so it takes \"is.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-58866-1579-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The doctor’s words ___ so surprising that we were all momentarily taken aback.",
  "targetWords": [
   "words"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The doctor’s words were so surprising that we were all momentarily taken aback.",
  "hint1": "The singular \"doctor’s\" sits right before the subject but is only a possessive.",
  "rule": "A possessive noun modifies the subject and does not control the verb. The subject is the plural \"words,\" so the verb is \"were.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-70114-752-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ no trace of the activities of the Big Four.",
  "targetWords": [
   "trace"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was no trace of the activities of the Big Four.",
  "hint1": "Plural nouns in the \"of\" phrases tempt you toward the wrong verb.",
  "rule": "After \"There,\" find the real subject and ignore words in \"of\" phrases. The subject is the singular \"trace,\" not \"activities,\" so the verb is \"was.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-70114-1532-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "A list of the articles found in her hand-bag ___ finally obtained.",
  "targetWords": [
   "list"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "A list of the articles found in her hand-bag was finally obtained.",
  "hint1": "The plural \"articles\" is in a phrase that modifies the subject.",
  "rule": "The verb agrees with the head of the subject, not the noun in the \"of\" phrase. The subject is the singular \"list,\" so the verb is \"was.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-863-2406-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ some peculiar points about that stain.",
  "targetWords": [
   "points"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "There were some peculiar points about that stain.",
  "hint1": "The singular \"stain\" is nearest the verb's end, but it is not the subject.",
  "rule": "After \"There,\" the verb agrees with the noun that follows it. The subject is \"points,\" which is plural, so the verb is \"were.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-70114-826-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The masquerading on the part of the footman ___ to ensure a way of retreat in case of emergencies.",
  "targetWords": [
   "masquerading"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The masquerading on the part of the footman was to ensure a way of retreat in case of emergencies.",
  "hint1": "Several nouns appear after the real subject, including the singular \"footman\" and the plural \"emergencies.\"",
  "rule": "Ignore prepositional phrases when finding the subject. The subject is the singular \"masquerading,\" so the verb is \"was.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-61262-788-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ usually one of the Fords at the station on the chance of its being required.",
  "targetWords": [
   "one"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was usually one of the Fords at the station on the chance of its being required.",
  "hint1": "The plural \"Fords\" is in an \"of\" phrase.",
  "rule": "\"One of the Fords\" has the subject \"one,\" which is singular. The plural noun in the \"of\" phrase does not change the verb, so use \"was.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-863-1241-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ an expression of exultation on his face which I could not understand.",
  "targetWords": [
   "expression"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was an expression of exultation on his face which I could not understand.",
  "hint1": "Look for the noun that follows \"There\" and ignore the \"of\" phrase.",
  "rule": "After \"There,\" the verb agrees with the noun that follows it. The subject is the singular \"expression,\" so the verb is \"was.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-58866-421-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The piece of paper ___ roughly about two inches square.",
  "targetWords": [
   "piece"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The piece of paper was roughly about two inches square.",
  "hint1": "\"Paper\" and \"inches\" are not the subject.",
  "rule": "The verb agrees with the head noun, not the noun in the \"of\" phrase. The subject is the singular \"piece,\" so the verb is \"was.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-387-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The only thing at all out of the ordinary ___ his will.",
  "targetWords": [
   "thing"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The only thing at all out of the ordinary was his will.",
  "hint1": "The noun after the verb, \"will,\" does not decide the verb.",
  "rule": "The verb agrees with the subject, which comes before it, not with the noun that follows. The subject is the singular \"thing,\" so the verb is \"was.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-1638-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The blade of the dagger ___ slightly discoloured, that is all.",
  "targetWords": [
   "blade"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "The blade of the dagger is slightly discoloured, that is all.",
  "hint1": "Ignore the noun in the \"of\" phrase.",
  "rule": "The verb agrees with the true subject, not a nearby noun. The subject is the singular \"blade,\" so the verb is \"is.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-69087-644-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ no communication with the other part of the house.",
  "targetWords": [
   "communication"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "There is no communication with the other part of the house.",
  "hint1": "The subject follows the verb in a \"There\" sentence.",
  "rule": "After \"There,\" the verb agrees with the noun that follows it. The subject is the singular \"communication,\" so the verb is \"is.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-72824-3329-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The scent of it in the air ___ faintly unpleasant.",
  "targetWords": [
   "scent"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The scent of it in the air was faintly unpleasant.",
  "hint1": "Ignore the nouns inside the phrases that come after the subject.",
  "rule": "A verb agrees with its true subject, not with a noun in a prepositional phrase. The subject is the singular 'scent', so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-72824-2095-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The last two words ___ uttered with great significance.",
  "targetWords": [
   "words"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The last two words were uttered with great significance.",
  "hint1": "Find the plural noun being described by 'last two'.",
  "rule": "A plural subject takes a plural verb. The subject is 'words', so the verb is 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-72824-2484-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ something kind about Knighton, kind and trustworthy.",
  "targetWords": [
   "something"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was something kind about Knighton, kind and trustworthy.",
  "hint1": "The sentence is inverted: 'There' is not the subject, and the real subject comes after the verb.",
  "rule": "In a sentence that begins with 'There', the verb agrees with the noun or pronoun that follows it. 'Something' is singular, so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-58866-105-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The cases I have been employed upon lately ___ banal to the last degree.",
  "targetWords": [
   "cases"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The cases I have been employed upon lately were banal to the last degree.",
  "hint1": "A clause sits between the subject and the verb, ending in a singular-sounding word.",
  "rule": "Interrupting words do not change the true subject. The subject is the plural 'cases', so the verb is 'were'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-1817-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "One of the men ___ M. Renauld and the other was a tramp, a dreadful looking creature in filthy rags.",
  "targetWords": [
   "one"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "One of the men was M. Renauld and the other was a tramp, a dreadful looking creature in filthy rags.",
  "hint1": "A plural noun sits inside an 'of' phrase right before the verb.",
  "rule": "The subject of a verb is never inside an 'of' phrase. The subject is the singular 'one', so the verb is 'was'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-863-702-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The heaviness and languor of her manner ___ very marked.",
  "targetWords": [
   "heaviness",
   "languor"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "The heaviness and languor of her manner were very marked.",
  "hint1": "The subject is two nouns joined by 'and', and the nearest noun is singular.",
  "rule": "Two subjects joined by 'and' make a plural subject. 'Heaviness and languor' together take 'were', even though 'manner' is singular.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-58866-520-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The explanation of the mystery ___ greeted with a relieved smile.",
  "targetWords": [
   "explanation"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The explanation of the mystery was greeted with a relieved smile.",
  "hint1": "Look past the 'of' phrase to the noun that is actually being greeted.",
  "rule": "The verb agrees with the head noun, not the object of a preposition. The subject is the singular 'explanation', so the verb is 'was'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-1432-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ only six or seven English and American ladies altogether, and they are all much older than the lady you are seeking.",
  "targetWords": [
   "ladies"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "are",
  "fixed": "There are only six or seven English and American ladies altogether, and they are all much older than the lady you are seeking.",
  "hint1": "The sentence is inverted, so find the subject after the verb.",
  "rule": "With 'There' at the start, the verb agrees with the noun that follows. The subject is the plural 'ladies', so the verb is 'are'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-72824-251-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "In the centre of it ___ some twisted initials surmounted by a crown.",
  "targetWords": [
   "initials"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "In the centre of it were some twisted initials surmounted by a crown.",
  "hint1": "The sentence begins with a prepositional phrase, so the subject comes after the verb.",
  "rule": "In an inverted sentence, find the real subject after the verb. The subject is the plural 'initials', not 'centre' or 'it', so the verb is 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-61262-1118-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The figure of Anubis you saw to-night ___ Hassan, dressed up by my orders.",
  "targetWords": [
   "figure"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The figure of Anubis you saw to-night was Hassan, dressed up by my orders.",
  "hint1": "Notice the 'of' phrase and the clause that follow the subject.",
  "rule": "Phrases and clauses after the subject do not change the verb. The subject is the singular 'figure', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-808-6",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ nothing to connect her with the crime.",
  "targetWords": [
   "nothing"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "There is nothing to connect her with the crime.",
  "hint1": "'There' is not the subject; look at what comes after the verb.",
  "rule": "In a 'There ___' sentence, the verb agrees with the noun or pronoun after it. 'Nothing' is singular, so the verb is 'is'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-1820-6",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a dish of fruit, but the three dessert plates were untouched.",
  "targetWords": [
   "dish"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a dish of fruit, but the three dessert plates were untouched.",
  "hint1": "A plural noun appears right after the verb, but it is inside an 'of' phrase.",
  "rule": "After 'There', the verb agrees with the true subject, not a noun inside an 'of' phrase. The subject is the singular 'dish', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-2368-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The room ___ filled with carnations, orchids, and mimosa.",
  "targetWords": [
   "room"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The room was filled with carnations, orchids, and mimosa.",
  "hint1": "A list of plural nouns comes after the verb, but it is not the subject.",
  "rule": "The subject is the thing that is doing or receiving the action, and it comes before the verb here. The singular 'room' was filled, so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-72824-1901-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a low murmur of voices, and then Van Aldin came into the room and advanced towards Katherine with outstretched hand, giving her at the same time a shrewd and penetrating glance.",
  "targetWords": [
   "murmur"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a low murmur of voices, and then Van Aldin came into the room and advanced towards Katherine with outstretched hand, giving her at the same time a shrewd and penetrating glance.",
  "hint1": "A plural noun comes at the end of the phrase, but it is not the subject.",
  "rule": "After 'There', the verb agrees with the true subject. The subject is the singular 'murmur', not 'voices', so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-61262-1080-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The enthusiasm of the young baronet ___ obvious, but I fancied that I detected a shade of nervousness in his manner as though he could not quite escape from the feeling of menace in the air.",
  "targetWords": [
   "enthusiasm"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The enthusiasm of the young baronet was obvious, but I fancied that I detected a shade of nervousness in his manner as though he could not quite escape from the feeling of menace in the air.",
  "hint1": "The 'of' phrase right before the verb has its own noun.",
  "rule": "The subject is never the object of 'of'. 'Enthusiasm' is singular, so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-3203-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a hint of reproach in his tone which was not lost upon the other.",
  "targetWords": [
   "hint"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a hint of reproach in his tone which was not lost upon the other.",
  "hint1": "The sentence is inverted, and a phrase follows the real subject.",
  "rule": "After 'There', the verb agrees with the noun that follows. The subject is the singular 'hint', so the verb is 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-863-843-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a tremor in his voice, and he had gone very pale.",
  "targetWords": [
   "tremor"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a tremor in his voice, and he had gone very pale.",
  "hint1": "'There' is not the subject; look for the noun after the verb.",
  "rule": "In a 'There ___' sentence, the verb agrees with the noun that follows. 'Tremor' is singular, so the verb is 'was'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-70114-751-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "A person of whom I was far more suspicious ___ Deaves, Ryland's valet, whom he had brought over from New York with him.",
  "targetWords": [
   "person"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "A person of whom I was far more suspicious was Deaves, Ryland's valet, whom he had brought over from New York with him.",
  "hint1": "The subject is followed by a long 'of whom' phrase.",
  "rule": "A long phrase after the subject does not change the verb. The subject is the singular 'person', so the verb is 'was'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-61262-323-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Inquiries at the station yielded the information that Marsdon Manor were about a mile distant.",
  "fixed": "Inquiries at the station yielded the information that Marsdon Manor was about a mile distant.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"Marsdon Manor\" is one place, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-69087-106-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "To put it bluntly, Mrs. Ackroyd were a dipsomaniac. She succeeds in drinking herself into her grave four years after her marriage.",
  "fixed": "To put it bluntly, Mrs. Ackroyd was a dipsomaniac. She succeeded in drinking herself into her grave four years after her marriage.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "succeeds"
   }
  ],
  "rule": "The subject \"Mrs. Ackroyd\" is one person, so the verb is \"was\", not \"were\". The story is in the past, so \"succeeds\" should be \"succeeded\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-407-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Two large leather-covered armchairs faced the fireplace, and between them were a round table covered with the latest books and magazines. Bookshelves line two of the walls, and at the end of the room opposite the window there was a handsome oak sideboard with a tantalus on top.",
  "fixed": "Two large leather-covered armchairs faced the fireplace, and between them was a round table covered with the latest books and magazines. Bookshelves lined two of the walls, and at the end of the room opposite the window there was a handsome oak sideboard with a tantalus on top.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "line"
   }
  ],
  "rule": "In \"between them was a round table\", the subject is \"table\", which is singular, so the verb is \"was\", not \"were\". The story is in the past, so \"line\" should be \"lined\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  },
  "optionalGaps": [
   "window"
  ]
 },
 {
  "id": "forge-72824-406-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He and the visitor passed each other in the doorway, and Derek kettering stands aside to let the other go out.",
  "fixed": "He and the visitor passed each other in the doorway, and Derek Kettering stood aside to let the other go out.",
  "errors": [
   {
    "word": "kettering"
   },
   {
    "word": "stands"
   }
  ],
  "rule": "\"Kettering\" is a person's last name, so it needs a capital letter. The story is in the past, so \"stands\" should be \"stood\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-58866-1283-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Could she enlighten us if she chose, and were her silence part of a carefully thought out and preconceived plan?",
  "fixed": "Could she enlighten us if she chose, and was her silence part of a carefully thought out and preconceived plan?",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"silence\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-58866-1676-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Stifling her cries, they has bound and gagged her.",
  "fixed": "Stifling her cries, they had bound and gagged her.",
  "errors": [
   {
    "word": "has"
   }
  ],
  "rule": "The subject \"they\" is plural and the story is in the past, so \"has\" should be \"had\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-271-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He had a candle in his hand, and the agitation of his face tells me at once that something was seriously wrong.",
  "fixed": "He had a candle in his hand, and the agitation of his face told me at once that something was seriously wrong.",
  "errors": [
   {
    "word": "tells"
   }
  ],
  "rule": "The rest of the passage is in the past tense (\"had\", \"was\"), so \"tells\" should be \"told\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-58866-440-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He looked about fifty years of age, and his dark hair were plentifully streaked with grey.",
  "fixed": "He looked about fifty years of age, and his dark hair was plentifully streaked with grey.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"hair\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-2283-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "That drawer, was an unlocked one, as he had pointed out, and he submitted that there was no evidence to prove that it was the prisoner who had concealed the poison there. It were, in fact, a wicked and malicious attempt on the part of some third person to fix the crime on the prisoner.",
  "fixed": "That drawer was an unlocked one, as he had pointed out, and he submitted that there was no evidence to prove that it was the prisoner who had concealed the poison there. It was, in fact, a wicked and malicious attempt on the part of some third person to fix the crime on the prisoner.",
  "errors": [
   {
    "gapAfter": "drawer"
   },
   {
    "word": "were"
   }
  ],
  "rule": "Remove the comma after \"drawer\" because a comma should not separate a subject from its verb. The subject \"It\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-636-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She had been just twenty-three when she had come to old Mrs. harfield as companion.",
  "fixed": "She had been just twenty-three when she had come to old Mrs. Harfield as companion.",
  "errors": [
   {
    "word": "harfield"
   }
  ],
  "rule": "\"Harfield\" is a person's last name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-1883-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The whole thing, can be divided into two parts, each clear and distinct from the other.",
  "fixed": "The whole thing can be divided into two parts, each clear and distinct from the other.",
  "errors": [
   {
    "gapAfter": "thing"
   }
  ],
  "rule": "Remove the comma after \"thing\" because it separates the subject \"The whole thing\" from its verb \"can be divided\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-2823-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Katherine was dreamy and distracted, and Lenox make bursts of conversation, interspersed by silences.",
  "fixed": "Katherine was dreamy and distracted, and Lenox made bursts of conversation, interspersed by silences.",
  "errors": [
   {
    "word": "make"
   }
  ],
  "rule": "The story is in the past, so \"make\" should be \"made\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1717-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They came from high and low alike, and bore striking testimony to the place my friend had made for himself in the country of his adoption.",
  "fixed": "They came from high and low alike and bore striking testimony to the place my friend had made for himself in the country of his adoption.",
  "errors": [
   {
    "gapAfter": "alike"
   }
  ],
  "rule": "Remove the comma after \"alike\" because \"came\" and \"bore\" are two verbs that share the subject \"They\", and no comma goes between them.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-863-126-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "His wife follow him, murmuring something about persuading Mrs. Inglethorp to think better of it.",
  "fixed": "His wife followed him, murmuring something about persuading Mrs. Inglethorp to think better of it.",
  "errors": [
   {
    "word": "follow"
   }
  ],
  "rule": "The subject \"wife\" is singular and the story is in the past, so \"follow\" should be \"followed\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-61262-976-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "For my part, I had never before suspected that Poirot have so deep a vein of superstition in his nature. I tackled him on the subject as we go homewards.",
  "fixed": "For my part, I had never before suspected that Poirot had so deep a vein of superstition in his nature. I tackled him on the subject as we went homewards.",
  "errors": [
   {
    "word": "have"
   },
   {
    "word": "go"
   }
  ],
  "rule": "The subject \"Poirot\" is singular and the story is in the past, so \"have\" should be \"had\". \"Go\" should be \"went\" to match the past tense of \"tackled\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-69087-282-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Just on six feet, perfectly proportioned, with the easy grace of an athlete, he were dark, like his mother, with a handsome, sunburnt face always ready to break into a smile. Ralph paton was of those born to charm easily and without effort.",
  "fixed": "Just on six feet, perfectly proportioned, with the easy grace of an athlete, he was dark, like his mother, with a handsome, sunburnt face always ready to break into a smile. Ralph Paton was of those born to charm easily and without effort.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "paton"
   }
  ],
  "rule": "The subject \"he\" is singular, so the verb is \"was\", not \"were\". \"Paton\" is a person's last name, so it needs a capital letter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-1888-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "We entered the dining-room rather late, and were shown to a table by the window.",
  "fixed": "We entered the dining-room rather late and were shown to a table by the window.",
  "errors": [
   {
    "gapAfter": "late"
   }
  ],
  "rule": "Remove the comma after \"late\" because \"entered\" and \"were shown\" are two verbs that share the subject \"We\", and no comma goes between them.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-69087-560-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I half opened my mouth to speak, but at that moment the sound of a bell peals through the house. There were a confused murmur of voices in the hall, and then Parker appeared with our local inspector and a police constable.",
  "fixed": "I half opened my mouth to speak, but at that moment the sound of a bell pealed through the house. There was a confused murmur of voices in the hall, and then Parker appeared with our local inspector and a police constable.",
  "errors": [
   {
    "word": "peals"
   },
   {
    "word": "were"
   }
  ],
  "rule": "The story is in the past, so \"peals\" should be \"pealed\". In \"There was a confused murmur\", the subject is \"murmur\", which is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  },
  "optionalGaps": [
   "moment"
  ]
 },
 {
  "id": "forge-70114-856-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "One of the housemaids, on descending, were met by a sickening odour of burned flesh which seemed to come from her master's study.",
  "fixed": "One of the housemaids, on descending, was met by a sickening odour of burned flesh which seemed to come from her master's study.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject is \"One\", which is singular, so the verb is \"was\", not \"were\". The words \"of the housemaids\" do not change that.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-69087-2645-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He takes Poirot’s hand, and gave it a grip which caused the other to wince in anguish.",
  "fixed": "He took Poirot’s hand and gave it a grip which caused the other to wince in anguish.",
  "errors": [
   {
    "word": "takes"
   },
   {
    "gapAfter": "hand"
   }
  ],
  "rule": "The story is in the past, so \"takes\" should be \"took\". Remove the comma after \"hand\" because \"took\" and \"gave\" are two verbs that share the subject \"He\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-108-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "As I said before, we is ready enough to gossip in our village.",
  "fixed": "As I said before, we are ready enough to gossip in our village.",
  "errors": [
   {
    "word": "is"
   }
  ],
  "rule": "The subject \"we\" takes \"are\", not \"is\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-167-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He, had the reputation for the most exquisite discretion. That, together with the nobility of his aspect, have carried him through several very questionable transactions.",
  "fixed": "He had the reputation for the most exquisite discretion. That, together with the nobility of his aspect, had carried him through several very questionable transactions.",
  "errors": [
   {
    "gapAfter": "he"
   },
   {
    "word": "have"
   }
  ],
  "rule": "Remove the comma after \"He\" because it separates the subject from its verb \"had\". The subject \"That\" is singular and the story is in the past, so \"have\" should be \"had\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-863-965-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "As we walked briskly away from the house, I glance at him more than once.",
  "fixed": "As we walked briskly away from the house, I glanced at him more than once.",
  "errors": [
   {
    "word": "glance"
   }
  ],
  "rule": "The story is in the past, so \"glance\" should be \"glanced\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-69087-3058-6",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I discovered that Miss Russell, the housekeeper, had visited Dr. Sheppard that morning, and had displayed a good deal of interest in cures for victims of the drug habit.",
  "fixed": "I discovered that Miss Russell, the housekeeper, had visited Dr. Sheppard that morning and had displayed a good deal of interest in cures for victims of the drug habit.",
  "errors": [
   {
    "gapAfter": "morning"
   }
  ],
  "rule": "Remove the comma after \"morning\" because \"had visited\" and \"had displayed\" are two verbs that share the subject \"Miss Russell\", and no comma goes between them.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-298-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "We go into the living-room, and the sound of the Inspector's footsteps died away outside. Ingles was attracted immediately by some Chinese curios on a table in the corner, and went over to examine them.",
  "fixed": "We went into the living-room, and the sound of the Inspector's footsteps died away outside. Ingles was attracted immediately by some Chinese curios on a table in the corner and went over to examine them.",
  "errors": [
   {
    "word": "go"
   },
   {
    "gapAfter": "corner"
   }
  ],
  "rule": "The story is in the past, so \"go\" should be \"went\". Remove the comma after \"corner\" because \"was attracted\" and \"went\" are two verbs that share the subject \"Ingles\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-72824-1927-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "You is becoming a serious breaker of hearts, Katherine.",
  "fixed": "You are becoming a serious breaker of hearts, Katherine.",
  "errors": [
   {
    "word": "is"
   }
  ],
  "rule": "The subject \"You\" takes \"are\", not \"is\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-1755-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He were in no mood for appreciating the beauties of scenery.",
  "fixed": "He was in no mood for appreciating the beauties of scenery.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"He\" takes \"was\", not \"were\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-742-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I, was in a fever of impatience to get at all the facts. Japp had two or three hours’ start of me, and his anxiety to be gone make me keen to be close at his heels.",
  "fixed": "I was in a fever of impatience to get at all the facts. Japp had two or three hours’ start of me, and his anxiety to be gone made me keen to be close at his heels.",
  "errors": [
   {
    "gapAfter": "i"
   },
   {
    "word": "make"
   }
  ],
  "rule": "Remove the comma after \"I\" because it separates the subject from its verb \"was\". The subject \"anxiety\" is singular and the story is in the past, so \"make\" should be \"made\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-69087-3203-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Who could have had a better knowledge of what killed Mr. Ferrars than the doctor who were attending him?",
  "fixed": "Who could have had a better knowledge of what killed Mr. Ferrars than the doctor who was attending him?",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The word \"who\" refers to the single \"doctor\", so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-988-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She goes along to breakfast early but met none of her acquaintances of the day before.",
  "fixed": "She went along to breakfast early but met none of her acquaintances of the day before.",
  "errors": [
   {
    "word": "goes"
   }
  ],
  "rule": "The other verb, \"met\", is in the past, so \"goes\" should be \"went\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-147-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It had become rather a pose with him to consistently belittle my abilities and I think he were chagrined at finding no loophole for criticism.",
  "fixed": "It had become rather a pose with him to consistently belittle my abilities, and I think he was chagrined at finding no loophole for criticism.",
  "errors": [
   {
    "gapAfter": "abilities"
   },
   {
    "word": "were"
   }
  ],
  "rule": "Add a comma after \"abilities\" because \"and\" joins two complete sentences. The subject \"he\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-58866-1385-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Thinking it over in cold blood, I come definitely to the conclusion, that I disliked her intensely.",
  "fixed": "Thinking it over in cold blood, I came definitely to the conclusion that I disliked her intensely.",
  "errors": [
   {
    "word": "come"
   },
   {
    "gapAfter": "conclusion"
   }
  ],
  "rule": "The story is in the past, so \"come\" should be \"came\". Remove the comma after \"conclusion\" because \"that I disliked her intensely\" is needed to finish the thought \"the conclusion that I disliked her\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-1201-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Then, amidst a breathless silence, Alfred Inglethorp were called.",
  "fixed": "Then, amidst a breathless silence, Alfred Inglethorp was called.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"Alfred Inglethorp\" is one person, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-58866-2569-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I understand next to nothing of what had occurred. The events of the night, seemed fantastic and impossible.",
  "fixed": "I understood next to nothing of what had occurred. The events of the night seemed fantastic and impossible.",
  "errors": [
   {
    "word": "understand"
   },
   {
    "gapAfter": "night"
   }
  ],
  "rule": "The story is in the past, so \"understand\" should be \"understood\". Remove the comma after \"night\" because it separates the subject \"The events of the night\" from its verb.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-70114-395-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It was all a little discouraging and our experience on Dartmoor do not seem to have helped us at all.",
  "fixed": "It was all a little discouraging, and our experience on Dartmoor did not seem to have helped us at all.",
  "errors": [
   {
    "gapAfter": "discouraging"
   },
   {
    "word": "do"
   }
  ],
  "rule": "Add a comma after \"discouraging\" because \"and\" joins two complete sentences. The story is in the past, so \"do\" should be \"did\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-1198-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot and I was sitting in two chairs well drawn up to the fire.",
  "fixed": "Poirot and I were sitting in two chairs well drawn up to the fire.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "\"Poirot and I\" is a compound subject (two people), so the verb is \"were\", not \"was\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-61262-101-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I rise, went to the table at the other side of the room, and returned with the paper in question in my hand.",
  "fixed": "I rose, went to the table at the other side of the room, and returned with the paper in question in my hand.",
  "errors": [
   {
    "word": "rise"
   }
  ],
  "rule": "The story is in the past, so \"rise\" should be \"rose\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-61262-452-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "An examination of the body turn our suspicions into certainty.",
  "fixed": "An examination of the body turned our suspicions into certainty.",
  "errors": [
   {
    "word": "turn"
   }
  ],
  "rule": "The subject \"examination\" is singular and the story is in the past, so \"turn\" should be \"turned\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-61262-947-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Lady Willard were a tall, thin woman, dressed in deep mourning.",
  "fixed": "Lady Willard was a tall, thin woman, dressed in deep mourning.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"Lady Willard\" is one person, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-70114-1752-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Whilst I was reviewing all these facts and seeking for the best line of action, the telephone bell rings.",
  "fixed": "Whilst I was reviewing all these facts and seeking for the best line of action, the telephone bell rang.",
  "errors": [
   {
    "word": "rings"
   }
  ],
  "rule": "The story is in the past, so \"rings\" should be \"rang\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-944-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He have a soft brown beard and a peculiar flowing tie.",
  "fixed": "He had a soft brown beard and a peculiar flowing tie.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject \"He\" is singular and the story is in the past, so \"have\" should be \"had\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-1354-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "By his side run a typical London urchin, grimy of face and ragged of apparel.",
  "fixed": "By his side ran a typical London urchin, grimy of face and ragged of apparel.",
  "errors": [
   {
    "word": "run"
   }
  ],
  "rule": "The story is in the past, so \"run\" should be \"ran\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-69087-224-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I has made the acquaintance of a man who in some ways resembles my far-off friend.",
  "fixed": "I have made the acquaintance of a man who in some ways resembles my far-off friend.",
  "errors": [
   {
    "word": "has"
   }
  ],
  "rule": "The subject \"I\" takes \"have\", not \"has\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-1426-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Several people was sitting in the tiny lounge, but my quarry was not amongst them.",
  "fixed": "Several people were sitting in the tiny lounge, but my quarry was not amongst them.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "The subject \"people\" is plural, so the verb is \"were\", not \"was\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-70114-864-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "But his evidence were little short of sensational. Mr. Paynter, had been ailing in health ever since his arrival at Croftlands.",
  "fixed": "But his evidence was little short of sensational. Mr. Paynter had been ailing in health ever since his arrival at Croftlands.",
  "errors": [
   {
    "word": "were"
   },
   {
    "gapAfter": "paynter"
   }
  ],
  "rule": "The subject \"evidence\" is singular, so the verb is \"was\", not \"were\". Remove the comma after \"Paynter\" because it separates the subject from its verb \"had been\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-58866-2379-42",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I felt that the best thing to do, were to keep busy.",
  "fixed": "I felt that the best thing to do was to keep busy.",
  "errors": [
   {
    "gapAfter": "do"
   },
   {
    "word": "were"
   }
  ],
  "rule": "Remove the comma after \"do\" because it separates the subject \"the best thing to do\" from its verb. That subject is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-72824-983-7",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She found, however, that his little chair were vacant. She hesitates for a moment and then walked through into the next coach.",
  "fixed": "She found, however, that his little chair was vacant. She hesitated for a moment and then walked through into the next coach.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "hesitates"
   }
  ],
  "rule": "The subject \"chair\" is singular, so the verb is \"was\", not \"were\". The story is in the past, so \"hesitates\" should be \"hesitated\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1399-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The ground floors and the upper stories of each was unfurnished and deserted, the broken windows covered by decaying shutters.",
  "fixed": "The ground floors and the upper stories of each were unfurnished and deserted, the broken windows covered by decaying shutters.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "\"The ground floors and the upper stories\" is a plural subject, so the verb is \"were\", not \"was\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-1152-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The only mark were the electric burn upon his hand--his left hand, because he was left-handed.",
  "fixed": "The only mark was the electric burn upon his hand--his left hand, because he was left-handed.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"mark\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-61262-678-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The American’s trained fingers has felt what he was looking for.",
  "fixed": "The American’s trained fingers had felt what he was looking for.",
  "errors": [
   {
    "word": "has"
   }
  ],
  "rule": "The subject \"fingers\" is plural and the story is in the past, so \"has\" should be \"had\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-72824-2955-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Miss Viner's voice in the room seem to recede into the far distance.",
  "fixed": "Miss Viner's voice in the room seemed to recede into the far distance.",
  "errors": [
   {
    "word": "seem"
   }
  ],
  "rule": "The subject \"voice\" is singular and the story is in the past, so \"seem\" should be \"seemed\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-58866-2325-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The prisoner and his counsel, Maître Grosíer, was accommodated with chairs.",
  "fixed": "The prisoner and his counsel, Maître Grosíer, were accommodated with chairs.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "\"The prisoner and his counsel\" is a compound subject (two people), so the verb is \"were\", not \"was\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-58866-401-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He opened the door, and bowed ceremoniously to Poirot to precede him. Poirot, with equal politeness, draws back and bowed to the commissary.",
  "fixed": "He opened the door and bowed ceremoniously to Poirot to precede him. Poirot, with equal politeness, drew back and bowed to the commissary.",
  "errors": [
   {
    "gapAfter": "door"
   },
   {
    "word": "draws"
   }
  ],
  "rule": "Remove the comma after \"door\" because \"opened\" and \"bowed\" are two verbs that share the subject \"He\". The story is in the past, so \"draws\" should be \"drew\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-244-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I am anxious to get hold of John, but he was nowhere to be seen.",
  "fixed": "I was anxious to get hold of John, but he was nowhere to be seen.",
  "errors": [
   {
    "word": "am"
   }
  ],
  "rule": "The story is in the past, so \"am\" should be \"was\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-903-6",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It was with a little shock of surprise that she finds herself set down to a small table with, opposite her, the same woman who had been her vis-à-vis in the Pullman. A faint smile, came to the lips of both women.",
  "fixed": "It was with a little shock of surprise that she found herself set down to a small table with, opposite her, the same woman who had been her vis-à-vis in the Pullman. A faint smile came to the lips of both women.",
  "errors": [
   {
    "word": "finds"
   },
   {
    "gapAfter": "smile"
   }
  ],
  "rule": "The story is in the past, so \"finds\" should be \"found\". Remove the comma after \"smile\" because it separates the subject from its verb \"came\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-451-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He went off by himself in the afternoon, and it was not till seven o’clock that he announces that he could put it off no longer but must break the news to the young widow. My sympathy have already gone out to her unreservedly.",
  "fixed": "He went off by himself in the afternoon, and it was not till seven o’clock that he announced that he could put it off no longer but must break the news to the young widow. My sympathy had already gone out to her unreservedly.",
  "errors": [
   {
    "word": "announces"
   },
   {
    "word": "have"
   }
  ],
  "rule": "The story is in the past, so \"announces\" should be \"announced\". The subject \"sympathy\" is singular and the story is in the past, so \"have\" should be \"had\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-70114-935-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "With the same impassive face, Ah Ling describes how he had made the curry.",
  "fixed": "With the same impassive face, Ah Ling described how he had made the curry.",
  "errors": [
   {
    "word": "describes"
   }
  ],
  "rule": "The story is in the past, so \"describes\" should be \"described\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-1793-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I were awakened by feeling myself persistently shaken.",
  "fixed": "I was awakened by feeling myself persistently shaken.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"I\" takes \"was\", not \"were\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-69087-213-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "This ridiculous little man were so portentously solemn.",
  "fixed": "This ridiculous little man was so portentously solemn.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"man\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-2374-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "For, though as like her as two peas, this girl were not Cinderella!",
  "fixed": "For, though as like her as two peas, this girl was not Cinderella!",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"girl\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-72824-3299-8",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I mention the name of that surgeon in Knighton's hearing the day before yesterday.",
  "fixed": "I mentioned the name of that surgeon in Knighton's hearing the day before yesterday.",
  "errors": [
   {
    "word": "mention"
   }
  ],
  "rule": "The event happened \"the day before yesterday\", so \"mention\" should be \"mentioned\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-1753-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "In every paper were a huge headline telling of the sensational failure of the Davenheim bank. The disappearance of the famous financier, took on a totally different aspect in the light of the revelation of the financial affairs of the bank.",
  "fixed": "In every paper was a huge headline telling of the sensational failure of the Davenheim bank. The disappearance of the famous financier took on a totally different aspect in the light of the revelation of the financial affairs of the bank.",
  "errors": [
   {
    "word": "were"
   },
   {
    "gapAfter": "financier"
   }
  ],
  "rule": "In \"In every paper was a huge headline\", the subject is \"headline\", which is singular, so the verb is \"was\", not \"were\". Remove the comma after \"financier\" because it separates the subject \"The disappearance\" from its verb \"took\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-58866-198-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A peasant was trudging towards us, and we wait for him to come up to us in order to ask the way again.",
  "fixed": "A peasant was trudging towards us, and we waited for him to come up to us in order to ask the way again.",
  "errors": [
   {
    "word": "wait"
   }
  ],
  "rule": "The story is in the past, so \"wait\" should be \"waited\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-72824-1946-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It seemed at first to be a simple robbery, but it completely baffles the local police.",
  "fixed": "It seemed at first to be a simple robbery, but it completely baffled the local police.",
  "errors": [
   {
    "word": "baffles"
   }
  ],
  "rule": "The story is in the past, so \"baffles\" should be \"baffled\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-757-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It were about five minutes later that I heard the sound of raised voices.",
  "fixed": "It was about five minutes later that I heard the sound of raised voices.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"It\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-58866-2186-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He looks altogether too placid and supine to give me reassurance. I had learned, with poirot, that the less dangerous he looked, the more dangerous he was.",
  "fixed": "He looked altogether too placid and supine to give me reassurance. I had learned, with Poirot, that the less dangerous he looked, the more dangerous he was.",
  "errors": [
   {
    "word": "looks"
   },
   {
    "word": "poirot"
   }
  ],
  "rule": "The story is in the past, so \"looks\" should be \"looked\". \"Poirot\" is a person's name, so it needs a capital letter.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-108-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They was always seen about together, and it was freely conjectured that at the end of her period of mourning, Mrs. Ferrars would become Mrs. Roger Ackroyd.",
  "fixed": "They were always seen about together, and it was freely conjectured that at the end of her period of mourning, Mrs. Ferrars would become Mrs. Roger Ackroyd.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "The subject \"They\" is plural, so the verb is \"were\", not \"was\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-1128-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "From Mademoiselle's story, it seem clear that somewhere on her journey she was to meet this man of whom she spoke.",
  "fixed": "From Mademoiselle's story, it seems clear that somewhere on her journey she was to meet this man of whom she spoke.",
  "errors": [
   {
    "word": "seem"
   }
  ],
  "rule": "The subject \"it\" is singular, so the verb is \"seems\", not \"seem\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-524-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "For all his nonchalance, his interview with his father-in-law have shaken him more than he cared to show. He had a solitary lunch, and after it, frowning to himself a little, he went around to the sumptuous flat that housed the lady known as mirelle.",
  "fixed": "For all his nonchalance, his interview with his father-in-law had shaken him more than he cared to show. He had a solitary lunch, and after it, frowning to himself a little, he went around to the sumptuous flat that housed the lady known as Mirelle.",
  "errors": [
   {
    "word": "have"
   },
   {
    "word": "mirelle"
   }
  ],
  "rule": "The subject \"interview\" is singular and the story is in the past, so \"have\" should be \"had\". \"Mirelle\" is a name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-3175-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "As soon as I learn that a representative of a dictaphone company had called, the idea of a dictaphone take root in my mind.",
  "fixed": "As soon as I learned that a representative of a dictaphone company had called, the idea of a dictaphone took root in my mind.",
  "errors": [
   {
    "word": "learn"
   },
   {
    "word": "take"
   }
  ],
  "rule": "The story is in the past, so \"learn\" should be \"learned\". The subject \"idea\" is singular and the story is in the past, so \"take\" should be \"took\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-1198-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Our affection for each other must be tried and proved, and when my parents realize that it was no light infatuation on my part, they would doubtless relent towards us.",
  "fixed": "Our affection for each other must be tried and proved, and when my parents realized that it was no light infatuation on my part, they would doubtless relent towards us.",
  "errors": [
   {
    "word": "realize"
   }
  ],
  "rule": "The story is in the past, so \"realize\" should be \"realized\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-61262-1564-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "To all our expostulations, Poirot turns a deaf ear and reiterated again and again that to start at the beginning was not a waste of time but the only way.",
  "fixed": "To all our expostulations, Poirot turned a deaf ear and reiterated again and again that to start at the beginning was not a waste of time but the only way.",
  "errors": [
   {
    "word": "turns"
   }
  ],
  "rule": "\"Turns\" should be \"turned\" to match the past tense of \"reiterated\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-70114-2024-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "In the end, I succeeded in tracing the boy, and by paying out a big sum, I obtain possession of the child's person.",
  "fixed": "In the end, I succeeded in tracing the boy, and by paying out a big sum, I obtained possession of the child's person.",
  "errors": [
   {
    "word": "obtain"
   }
  ],
  "rule": "The story is in the past, so \"obtain\" should be \"obtained\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-1059-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot presented a card on which Japp had scribbled a few words of introduction, and we was shown into a low, long room furnished with rich hangings and curios. One or two wonderful ikons hung upon the walls, and exquisite persian rugs lay upon the floor.",
  "fixed": "Poirot presented a card on which Japp had scribbled a few words of introduction, and we were shown into a low, long room furnished with rich hangings and curios. One or two wonderful ikons hung upon the walls, and exquisite Persian rugs lay upon the floor.",
  "errors": [
   {
    "word": "was"
   },
   {
    "word": "persian"
   }
  ],
  "rule": "The subject \"we\" is plural, so the verb is \"were\", not \"was\". \"Persian\" refers to Persia, so it needs a capital letter.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-69087-111-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It were clearly to her advantage that Ackroyd should remain unmarried.",
  "fixed": "It was clearly to her advantage that Ackroyd should remain unmarried.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject \"It\" is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-863-296-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Her face was heavily flushed, and she yawns repeatedly.",
  "fixed": "Her face was heavily flushed, and she yawned repeatedly.",
  "errors": [
   {
    "word": "yawns"
   }
  ],
  "rule": "The story is in the past, so \"yawns\" should be \"yawned\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-117-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He turned to the left and marches along at a good pace without once turning his head.",
  "fixed": "He turned to the left and marched along at a good pace without once turning his head.",
  "errors": [
   {
    "word": "marches"
   }
  ],
  "rule": "The story is in the past, so \"marches\" should be \"marched\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1920-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They had me under each arm, supporting my weight, and there were a gag in my mouth.",
  "fixed": "They had me under each arm, supporting my weight, and there was a gag in my mouth.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "In \"there was a gag\", the subject is \"gag\", which is singular, so the verb is \"was\", not \"were\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-72824-983-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Glancing at her watch, she finds that it had stopped.",
  "fixed": "Glancing at her watch, she found that it had stopped.",
  "errors": [
   {
    "word": "finds"
   }
  ],
  "rule": "The story is in the past, so \"finds\" should be \"found\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-648-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The inspector, took in the position at a glance. We went through into the large hall, and he locks the door behind him, slipping the key into his pocket.",
  "fixed": "The inspector took in the position at a glance. We went through into the large hall, and he locked the door behind him, slipping the key into his pocket.",
  "errors": [
   {
    "gapAfter": "inspector"
   },
   {
    "word": "locks"
   }
  ],
  "rule": "Remove the comma after \"inspector\" because it separates the subject from its verb \"took\". The story is in the past, so \"locks\" should be \"locked\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-3173-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "For instance, it was something that the murderer have not been able to take away with him at the time that he committed the crime.",
  "fixed": "For instance, it was something that the murderer had not been able to take away with him at the time that he committed the crime.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject \"murderer\" is singular and the story is in the past, so \"have\" should be \"had\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-863-950-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Cynthia Murdoch was just coming in, and Poirot stands aside to let her pass.",
  "fixed": "Cynthia Murdoch was just coming in, and Poirot stood aside to let her pass.",
  "errors": [
   {
    "word": "stands"
   }
  ],
  "rule": "The story is in the past, so \"stands\" should be \"stood\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-3000-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The pale fitful sunshine, shone down on it and burnishes Katherine's head as she stood in the doorway to welcome him.",
  "fixed": "The pale fitful sunshine shone down on it and burnished Katherine's head as she stood in the doorway to welcome him.",
  "errors": [
   {
    "gapAfter": "sunshine"
   },
   {
    "word": "burnishes"
   }
  ],
  "rule": "Remove the comma after \"sunshine\" because it separates the subject from its verb \"shone\". The story is in the past, so \"burnishes\" should be \"burnished\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "pale"
  ]
 },
 {
  "id": "forge-72824-2854-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot saw him go with a satisfied nod of the head and then joined lenox and the American.",
  "fixed": "Poirot saw him go with a satisfied nod of the head and then joined Lenox and the American.",
  "errors": [
   {
    "word": "lenox"
   }
  ],
  "rule": "\"Lenox\" is a person's name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1572-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "desjardeaux looked at him in stupefaction for some moments. Then his face cleared, and he glances at the Home Secretary and tapped his forehead significantly.",
  "fixed": "Desjardeaux looked at him in stupefaction for some moments. Then his face cleared, and he glanced at the Home Secretary and tapped his forehead significantly.",
  "errors": [
   {
    "word": "desjardeaux"
   },
   {
    "word": "glances"
   }
  ],
  "rule": "\"Desjardeaux\" is a person's name, so it needs a capital letter. The story is in the past, so \"glances\" should be \"glanced\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "then"
  ]
 },
 {
  "id": "forge-61262-776-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It seemed to me that Poirot’s style were unnecessarily facetious. I also fancies he was a shade jealous of my position on the spot with full facilities for handling the case.",
  "fixed": "It seemed to me that Poirot’s style was unnecessarily facetious. I also fancied he was a shade jealous of my position on the spot with full facilities for handling the case.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "fancies"
   }
  ],
  "rule": "The subject \"style\" is singular, so the verb is \"was\", not \"were\". The story is in the past, so \"fancies\" should be \"fancied\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-58866-1939-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Georges Conneau, remember, are still wanted for murder.",
  "fixed": "Georges Conneau, remember, is still wanted for murder.",
  "errors": [
   {
    "word": "are"
   }
  ],
  "rule": "The subject \"Georges Conneau\" is one man, so the verb is \"is\", not \"are\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-59-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Mrs. Inglethorp, however, seem to notice nothing unusual.",
  "fixed": "Mrs. Inglethorp, however, seemed to notice nothing unusual.",
  "errors": [
   {
    "word": "seem"
   }
  ],
  "rule": "The subject \"Mrs. Inglethorp\" is singular and the story is in the past, so \"seem\" should be \"seemed\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-3167-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He does not seem to see any lack of cordiality in the millionaire's manner, and chatted pleasantly about various trifles.",
  "fixed": "He did not seem to see any lack of cordiality in the millionaire's manner and chatted pleasantly about various trifles.",
  "errors": [
   {
    "word": "does"
   },
   {
    "gapAfter": "manner"
   }
  ],
  "rule": "The story is in the past, so \"does\" should be \"did\". Remove the comma after \"manner\" because \"did not seem\" and \"chatted\" are two verbs that share the subject \"He\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-863-676-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The shock of the events of the last night have upset him temporarily, but his equable poise soon swung back to the normal. He was a man, of very little imagination, in sharp contrast with his brother, who had, perhaps, too much.",
  "fixed": "The shock of the events of the last night had upset him temporarily, but his equable poise soon swung back to the normal. He was a man of very little imagination, in sharp contrast with his brother, who had, perhaps, too much.",
  "errors": [
   {
    "word": "have"
   },
   {
    "gapAfter": "man"
   }
  ],
  "rule": "The subject \"shock\" is singular and the story is in the past, so \"have\" should be \"had\". Remove the comma after \"man\" because \"of very little imagination\" belongs with \"man\" and should not be set off.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-69087-194-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "such a habit could hardly endear him to us as a neighbor.",
  "fixed": "Such a habit could hardly endear him to us as a neighbor.",
  "errors": [
   {
    "word": "such"
   }
  ],
  "rule": "\"Such\" begins a sentence, so it needs a capital letter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-2184-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A thing that happened in India many years ago cannot compare for a moment with an event that takes place in King’s Abbot the day before yesterday.",
  "fixed": "A thing that happened in India many years ago cannot compare for a moment with an event that took place in King’s Abbot the day before yesterday.",
  "errors": [
   {
    "word": "takes"
   }
  ],
  "rule": "The event happened \"the day before yesterday\", so \"takes\" should be \"took\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-1763-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I came to see my fiancée, Mademoiselle daubreuil. I were on the eve of a long voyage, uncertain as to when I should return.",
  "fixed": "I came to see my fiancée, Mademoiselle Daubreuil. I was on the eve of a long voyage, uncertain as to when I should return.",
  "errors": [
   {
    "word": "daubreuil"
   },
   {
    "word": "were"
   }
  ],
  "rule": "\"Daubreuil\" is a person's last name, so it needs a capital letter. The subject \"I\" takes \"was\", not \"were\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-156-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I told her a good deal about curare, but she seems to have lost interest once more.",
  "fixed": "I told her a good deal about curare, but she seemed to have lost interest once more.",
  "errors": [
   {
    "word": "seems"
   }
  ],
  "rule": "The story is in the past, so \"seems\" should be \"seemed\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-2902-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "as far as I could make out, neither Flora nor Ralph made any pretence of love.",
  "fixed": "As far as I could make out, neither Flora nor Ralph made any pretence of love.",
  "errors": [
   {
    "word": "as"
   }
  ],
  "rule": "\"As\" begins the sentence, so it needs a capital letter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-1678-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Ralph’s description have been wired to every port and railway station in England.",
  "fixed": "Ralph’s description had been wired to every port and railway station in England.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject \"description\" is singular and the story is in the past, so \"have\" should be \"had\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-61262-845-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Mr. Philip Ridgeway were there before us and looked somewhat surprised to see his fiancée arriving with two complete strangers.",
  "fixed": "Mr. Philip Ridgeway was there before us and looked somewhat surprised to see his fiancée arriving with two complete strangers.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'Mr. Philip Ridgeway' is one person, so the verb is 'was', not 'were'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-61262-615-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Presently there were a rending sound, and a little circle of light appeared through the door.",
  "fixed": "Presently there was a rending sound, and a little circle of light appeared through the door.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "In 'there were a rending sound', the real subject is 'a rending sound', which is singular, so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  },
  "optionalGaps": [
   "presently"
  ]
 },
 {
  "id": "forge-70114-1931-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Leaning back in the third chair, with her burning eyes and her nun's face, were Madame Olivier.",
  "fixed": "Leaning back in the third chair, with her burning eyes and her nun's face, was Madame Olivier.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'Madame Olivier' is one person, so the verb is 'was', not 'were', even though the verb comes first.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-574-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Undoubtedly, his experience in the villa have broken his nerve, and in the morning we failed completely to extract any information from him.",
  "fixed": "Undoubtedly, his experience in the villa had broken his nerve, and in the morning we failed completely to extract any information from him.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject 'experience' is singular and the story is in the past, so the verb is 'had', not 'have'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "morning"
  ]
 },
 {
  "id": "forge-72824-1237-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He was fond of knighton and liked and trusted him, but he could hardly discuss his daughter's private affairs with his secretary.",
  "fixed": "He was fond of Knighton and liked and trusted him, but he could hardly discuss his daughter's private affairs with his secretary.",
  "errors": [
   {
    "word": "knighton"
   }
  ],
  "rule": "'Knighton' is a person's name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-727-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She was a woman of considerable experience, and had had four husbands.",
  "fixed": "She was a woman of considerable experience and had had four husbands.",
  "errors": [
   {
    "gapAfter": "experience"
   }
  ],
  "rule": "Do not put a comma between two verbs that share one subject, so 'experience, and had had' should be 'experience and had had'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1398-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A chinese gentleman had hired them for service in the house by the waterside, and they know nothing whatever of his private affairs.",
  "fixed": "A Chinese gentleman had hired them for service in the house by the waterside, and they knew nothing whatever of his private affairs.",
  "errors": [
   {
    "word": "chinese"
   },
   {
    "word": "know"
   }
  ],
  "rule": "A nationality is capitalized, so 'chinese' should be 'Chinese'. The story is in the past ('had hired'), so 'know' should be 'knew'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-72824-2865-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Hippolyte, the Comte de la Roche's wooden-faced man-servant, were busy at the Villa Marina polishing his master's beautiful cut table glass.",
  "fixed": "Hippolyte, the Comte de la Roche's wooden-faced man-servant, was busy at the Villa Marina polishing his master's beautiful cut table glass.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject is 'Hippolyte', one person, so the verb is 'was', not 'were'. The words set off by commas in between do not change that.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "marina"
  ]
 },
 {
  "id": "forge-863-1864-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It worries me just a little, for it suggested the possibility that there might be further arrests to come.",
  "fixed": "It worried me just a little, for it suggested the possibility that there might be further arrests to come.",
  "errors": [
   {
    "word": "worries"
   }
  ],
  "rule": "The story is in the past ('suggested'), so 'worries' should be 'worried'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-2308-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The hint of a threat were not lost upon him, but he interpreted it in his own way.",
  "fixed": "The hint of a threat was not lost upon him, but he interpreted it in his own way.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject is 'hint', which is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-1568-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I turned from the inspection of a Bartolozzi on the wall as Mrs. Folliott comes into the room.",
  "fixed": "I turned from the inspection of a Bartolozzi on the wall as Mrs. Folliott came into the room.",
  "errors": [
   {
    "word": "comes"
   }
  ],
  "rule": "The rest of the sentence is in the past ('turned'), so 'comes' should be 'came'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-737-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "When I looked at myself in the glass half an hour afterwards I was amazed. Special shoes causes me to stand at least two inches taller, and the coat I wore was arranged so as to give me a long, lank, weedy look.",
  "fixed": "When I looked at myself in the glass half an hour afterwards, I was amazed. Special shoes caused me to stand at least two inches taller, and the coat I wore was arranged so as to give me a long, lank, weedy look.",
  "errors": [
   {
    "gapAfter": "afterwards"
   },
   {
    "word": "causes"
   }
  ],
  "rule": "A long opening clause ends with a comma, so 'When I looked at myself in the glass half an hour afterwards' needs one after 'afterwards'. The sentence is in the past, so 'causes' should be 'caused'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-863-317-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I followed her, afraid that she were going to faint.",
  "fixed": "I followed her, afraid that she was going to faint.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'she' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-69087-1886-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "some of the incidents seems at the time irrelevant and unmeaning.",
  "fixed": "Some of the incidents seemed at the time irrelevant and unmeaning.",
  "errors": [
   {
    "word": "some"
   },
   {
    "word": "seems"
   }
  ],
  "rule": "The first word of a sentence is capitalized, so 'some' should be 'Some'. The subject 'incidents' is plural and the story is in the past, so 'seems' should be 'seemed'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-1715-7",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The rich American, for whom she probably did not care a button, were her objective.",
  "fixed": "The rich American, for whom she probably did not care a button, was her objective.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject is 'American', which is singular, so the verb is 'was', not 'were'. The nearby word 'button' is not the subject.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-2902-10",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Both Flora and he stipulates that it should be kept a secret for the present.",
  "fixed": "Both Flora and he stipulated that it should be kept a secret for the present.",
  "errors": [
   {
    "word": "stipulates"
   }
  ],
  "rule": "The subject 'Flora and he' is plural and the story is in the past, so the verb is 'stipulated'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-61262-710-9",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Yesterday evening I am forced to return to town, but my wife and my uncle remains on.",
  "fixed": "Yesterday evening I was forced to return to town, but my wife and my uncle remained on.",
  "errors": [
   {
    "word": "am"
   },
   {
    "word": "remains"
   }
  ],
  "rule": "'Yesterday evening' is in the past, so 'I am forced' should be 'I was forced'. The subject 'my wife and my uncle' is plural and the story is in the past, so the verb is 'remained'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  },
  "optionalGaps": [
   "evening"
  ]
 },
 {
  "id": "forge-58866-2190-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "my sense of superiority were gradually waning.",
  "fixed": "My sense of superiority was gradually waning.",
  "errors": [
   {
    "word": "my"
   },
   {
    "word": "were"
   }
  ],
  "rule": "A sentence starts with a capital letter, so 'my' should be 'My'. The subject 'sense' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-863-229-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "As I ran out to the tennis court a few moments later, I had to pass the open boudoir window and is unable to help overhearing the following scrap of dialogue.",
  "fixed": "As I ran out to the tennis court a few moments later, I had to pass the open boudoir window and was unable to help overhearing the following scrap of dialogue.",
  "errors": [
   {
    "word": "is"
   }
  ],
  "rule": "The other verbs are in the past ('ran', 'had to pass'), so 'is unable' should be 'was unable'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-69087-282-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He, had not inherited his mother’s fatal propensity for drink, but nevertheless he had in him a strain of weakness.",
  "fixed": "He had not inherited his mother’s fatal propensity for drink, but nevertheless he had in him a strain of weakness.",
  "errors": [
   {
    "gapAfter": "he"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'He, had' should be 'He had'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-796-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She made her demand to the clerk, but at the same time half of her mind were busy with something else.",
  "fixed": "She made her demand to the clerk, but at the same time half of her mind was busy with something else.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject is 'half of her mind', and 'mind' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "time"
  ]
 },
 {
  "id": "forge-72824-1848-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "On the following morning, Katherine and Lenox was sitting on the terrace of the Villa Marguerite.",
  "fixed": "On the following morning, Katherine and Lenox were sitting on the terrace of the Villa Marguerite.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "'Katherine and Lenox' is a compound subject, so it takes the plural verb 'were', not 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-1844-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He was inclined to resent our appearance, but Poirot calms him with the mention of our Scotland Yard friend, Inspector Japp, and we were accorded a grudging permission to remain.",
  "fixed": "He was inclined to resent our appearance, but Poirot calmed him with the mention of our Scotland Yard friend, Inspector Japp, and we were accorded a grudging permission to remain.",
  "errors": [
   {
    "word": "calms"
   }
  ],
  "rule": "The sentence is in the past ('was inclined'), so 'calms' should be 'calmed'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-61262-1952-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A big chintz-covered settee, ran along the opposite wall, and the deep low window seats were covered with the same faded chintz of an old-fashioned pattern.",
  "fixed": "A big chintz-covered settee ran along the opposite wall, and the deep low window seats were covered with the same faded chintz of an old-fashioned pattern.",
  "errors": [
   {
    "gapAfter": "settee"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'settee, ran' should be 'settee ran'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  },
  "optionalGaps": [
   "deep"
  ]
 },
 {
  "id": "forge-72824-1916-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Katherine declined the millionaire's invitation to lunch, and Knighton goes down with her and saw her into the waiting car.",
  "fixed": "Katherine declined the millionaire's invitation to lunch, and Knighton went down with her and saw her into the waiting car.",
  "errors": [
   {
    "word": "goes"
   }
  ],
  "rule": "The sentence is in the past ('declined', 'saw'), so 'goes' should be 'went'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-58866-551-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Then rising, he went across the room and returns with the glass jar we had seen in the outhouse in his hand.",
  "fixed": "Then rising, he went across the room and returned with the glass jar we had seen in the outhouse in his hand.",
  "errors": [
   {
    "word": "returns"
   }
  ],
  "rule": "The passage is in the past ('went', 'had seen'), so 'returns' should be 'returned'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  },
  "optionalGaps": [
   "then"
  ]
 },
 {
  "id": "forge-70114-1750-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I notes the number mechanically but without the hope that it would lead to anything.",
  "fixed": "I noted the number mechanically but without the hope that it would lead to anything.",
  "errors": [
   {
    "word": "notes"
   }
  ],
  "rule": "\"Notes\" does not go with \"I\", and \"would lead\" shows the story is in the past, so the verb is \"noted\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-72824-800-4",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He saw several roads, that he might take--one in particular.",
  "fixed": "He saw several roads that he might take--one in particular.",
  "errors": [
   {
    "gapAfter": "roads"
   }
  ],
  "rule": "The words 'that he might take' are needed to say which roads, so there should be no comma after 'roads'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-981-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Katherine goes back along the train amused and entertained by her little neighbour. She passed the open door of her friend's compartment, and saw the conductor making up the bed.",
  "fixed": "Katherine went back along the train amused and entertained by her little neighbour. She passed the open door of her friend's compartment and saw the conductor making up the bed.",
  "errors": [
   {
    "word": "goes"
   },
   {
    "gapAfter": "compartment"
   }
  ],
  "rule": "The story is in the past ('passed', 'saw'), so 'goes' should be 'went'. Do not put a comma between two verbs that share one subject, so 'compartment, and saw' should be 'compartment and saw'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "train"
  ]
 },
 {
  "id": "forge-61262-501-7",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Then it was our turn and a perfect babel of tongues were let loose.",
  "fixed": "Then it was our turn, and a perfect babel of tongues was let loose.",
  "errors": [
   {
    "gapAfter": "turn"
   },
   {
    "word": "were"
   }
  ],
  "rule": "A comma goes before 'and' when it joins two full sentences, so 'turn' needs a comma after it. The subject 'babel' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  },
  "optionalGaps": [
   "then"
  ]
 },
 {
  "id": "forge-863-1856-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "If only Poirot, had been accessible, I could have asked his advice.",
  "fixed": "If only Poirot had been accessible, I could have asked his advice.",
  "errors": [
   {
    "gapAfter": "poirot"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'Poirot, had' should be 'Poirot had'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-236-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "As he read it, his face darkens, his mouth set grimly in the line which Wall Street knew so well, and his brows knit themselves ominously.",
  "fixed": "As he read it, his face darkened, his mouth set grimly in the line which Wall Street knew so well, and his brows knit themselves ominously.",
  "errors": [
   {
    "word": "darkens"
   }
  ],
  "rule": "The sentence begins in the past ('As he read it'), so 'darkens' should be 'darkened'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1543-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He avoids all discussion of the Big Four as far as possible, and seemed to throw himself into his ordinary work with almost his old ardour.",
  "fixed": "He avoided all discussion of the Big Four as far as possible and seemed to throw himself into his ordinary work with almost his old ardour.",
  "errors": [
   {
    "word": "avoids"
   },
   {
    "gapAfter": "possible"
   }
  ],
  "rule": "The sentence is in the past ('seemed'), so 'avoids' should be 'avoided'. Do not put a comma between two verbs that share one subject, so 'possible, and seemed' should be 'possible and seemed'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-857-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "And then a rather curious discovery were made.",
  "fixed": "And then a rather curious discovery was made.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'discovery' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-863-1535-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "After a moment’s hesitation, he replaces it in the chest, heaped all the other things on top of it as before, and made his way briskly downstairs.",
  "fixed": "After a moment’s hesitation, he replaced it in the chest, heaped all the other things on top of it as before, and made his way briskly downstairs.",
  "errors": [
   {
    "word": "replaces"
   }
  ],
  "rule": "The other verbs in the series are in the past ('heaped', 'made'), so 'replaces' should be 'replaced'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-61262-187-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It was half-past five when we arrived at Yardly Chase, and followed the dignified butler to the old panelled hall with its fire of blazing logs.",
  "fixed": "It was half-past five when we arrived at Yardly Chase and followed the dignified butler to the old panelled hall with its fire of blazing logs.",
  "errors": [
   {
    "gapAfter": "chase"
   }
  ],
  "rule": "Do not put a comma between two verbs that share one subject, so 'Chase, and followed' should be 'Chase and followed'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-69087-1565-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I was slightly nervous when I rang the bell at marby Grange the following afternoon.",
  "fixed": "I was slightly nervous when I rang the bell at Marby Grange the following afternoon.",
  "errors": [
   {
    "word": "marby"
   }
  ],
  "rule": "'Marby Grange' is the name of a place, so 'Marby' needs a capital letter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-1086-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They stood against the door watching him as he goes quickly round the compartment.",
  "fixed": "They stood against the door watching him as he went quickly round the compartment.",
  "errors": [
   {
    "word": "goes"
   }
  ],
  "rule": "The sentence is in the past (\"stood\"), so \"goes\" should be \"went\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "door"
  ]
 },
 {
  "id": "mark-72824-2554-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She hesitated, but, as Poirot had foreseen, she had no loophole for escape.",
  "optionalCommas": [],
  "rule": "Use a comma before but when it joins two independent clauses, and put commas on both sides of the removable phrase \"as Poirot had foreseen.\" Here both rules apply.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-2278-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "After it was over, Poirot, who had also been present, took me by the arm and invited me to accompany him back to The Larches.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause (\"After it was over\") and commas on both sides of the nonessential \"who had also been present.\" Do not put a comma before \"and invited,\" because it joins two verbs that share one subject.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-431-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Still, Leconbury is a very fine old place, and, after all, we are one of the oldest families in England.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory word \"Still\" and a comma before \"and\" joining two independent clauses. \"After all\" is a removable interrupter, so it gets commas on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-642-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I could not help feeling that, so far, Poirot had not greatly distinguished himself, and it vexed me.",
  "optionalCommas": [],
  "rule": "\"So far\" is a removable interrupter, so it needs commas on both sides. A comma also goes before \"and\" because it joins two independent clauses.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-1510-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "However, my confidence in him, which at one time had rather waned, was fully restored since his belief in Alfred Inglethorp’s innocence had been so triumphantly vindicated.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory word \"However.\" The clause \"which at one time had rather waned\" is nonessential, so it gets commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-2442-6",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "By the way, M. Poirot, you were quite right about those fingerprints.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase \"By the way.\" Names used to address someone (\"M. Poirot\") are set off with commas on both sides.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-1655-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She sat back in her chair and looked at me meaningly, and when Caroline looks at you meaningly, it is impossible to miss it.",
  "optionalCommas": [],
  "rule": "Use a comma before \"and\" joining two independent clauses, and a comma after the introductory clause \"when Caroline looks at you meaningly.\" No comma goes between \"sat back\" and \"looked,\" which share a subject.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-836-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "True, he would sometimes investigate cases which intrigued him, but he usually dropped them the moment he was convinced that they had no connection with the activities of the Big Four.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory word \"True\" and a comma before \"but,\" which joins two independent clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-70114-1817-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We were plentifully supplied with newspapers, and every day Poirot received a bulky envelope, evidently containing some kind of report.",
  "optionalCommas": [],
  "rule": "Use a comma before \"and\" joining two independent clauses. The ending phrase \"evidently containing some kind of report\" is a nonessential add-on, so a comma sets it off.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-1371-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "There was no time for more, for at that minute, as Poirot had prophesied, Blunt left the others in his abrupt fashion and came over to us.",
  "optionalCommas": [],
  "rule": "Use a comma before \"for\" when it joins two independent clauses. Put a comma after the introductory phrase \"at that minute\" and set off the nonessential \"as Poirot had prophesied\" with a comma after it.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-58866-1107-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We waited some minutes, and then, to our surprise, the door opened, and Mrs. Renauld, deathly pale in her heavy mourning, entered the room.",
  "optionalCommas": [],
  "rule": "Use commas before each \"and\" that joins independent clauses. \"To our surprise\" and \"deathly pale in her heavy mourning\" are removable interrupters, so each is set off on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-251-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I could see from the earnestness with which he had been speaking that Mr. Ingles was a man mounted on his hobby horse, and evidently he, too, realised that he had been carried away, for he laughed apologetically.",
  "optionalCommas": [],
  "rule": "Use commas before \"and\" and \"for\" where each joins two independent clauses. \"Too\" is a removable interrupter, so it gets commas on both sides.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-61262-1848-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In the end, Count Foscatini raised his voice slightly, and the listener heard these words clearly:",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase \"In the end\" and a comma before \"and\" joining two independent clauses.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-3224-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "They had dinner on the train, and afterwards, somewhat to the surprise of the other two, Poirot suggested that they should all three set up in Van Aldin's compartment.",
  "optionalCommas": [],
  "rule": "Use a comma before \"and\" joining two independent clauses. The introductory phrase \"afterwards, somewhat to the surprise of the other two\" is set off with a comma before the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-199-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As usual, he did not commit himself, but he regarded Zia with benign approval.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase (As usual) and a comma before but when it joins two independent clauses. Both he did not commit himself and he regarded Zia with benign approval can stand alone.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-321-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As I did so, I almost collided with Miss Russell, who was just coming out.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause (As I did so) and before a nonessential who clause. The who clause only adds extra information about Miss Russell, whose name already identifies her.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-1503-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Without answering the first question, Miss Russell moved to an adjacent bureau, opened one of the drawers, and took out a handful of letters clipped together with a patent fastener.",
  "optionalCommas": [
   16
  ],
  "rule": "Use a comma after a long introductory phrase and commas between items in a series of actions. Here the phrase Without answering the first question introduces the sentence, and moved, opened, and took out form the series.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-1602-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As soon as the Prime Minister is unconscious, Daniels picks up the speaking-tube and directs O’Murphy to turn to the right, which the chauffeur, quite unsuspicious, does.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause, none inside a compound predicate (picks up ... and directs ...), and commas around nonessential elements. The which clause and the phrase quite unsuspicious are both removable.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-61262-611-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Under Poirot’s manipulation, the wooden door quickly swung inwards, and we climbed into the flat.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase and a comma before and joining two independent clauses. The door swung inwards and we climbed into the flat are both complete sentences.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-2068-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A few minutes later, Hercule Poirot, exquisitely attired and swinging a cane with a jaunty air, entered the room.",
  "optionalCommas": [
   3
  ],
  "rule": "Put a comma after an introductory phrase and commas on both sides of a removable descriptive phrase. Take out exquisitely attired and swinging a cane with a jaunty air, and the sentence still works.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-117-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The train, of course, did not stop anywhere until Southampton, but just here it happened to be held up by a signal.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of an interrupter like of course, and a comma before but joining two independent clauses. Each half of the sentence could stand alone as its own sentence.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-61262-773-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He handed the parcel over to the local police station, and before night it was proved to be the one we were in search of, the fellow to that given us by Mrs. Havering.",
  "optionalCommas": [],
  "rule": "Use a comma before and joining two independent clauses, and a comma before a nonessential appositive (the fellow to that given us by Mrs. Havering). The appositive just renames the one we were in search of.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-637-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Katherine Grey was born with the power of managing old ladies, dogs, and small boys, and she did it without any apparent sense of strain.",
  "optionalCommas": [
   11
  ],
  "rule": "Separate items in a series with commas, and put a comma before and when it joins two independent clauses. Old ladies, dogs, and small boys is the series, and the second and begins a new complete clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1345-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The next morning, hearing nothing from Poirot, I went out for a stroll, met some old friends, and lunched with them at their hotel.",
  "optionalCommas": [],
  "rule": "An introductory phrase and its modifier are followed by a comma, and items in a series of three or more are separated by commas. Here \"The next morning, hearing nothing from Poirot,\" opens the sentence, and the three actions (went, met, lunched) form a series.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-70114-651-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Your late secretary, Madame Veroneau, was really the Countess Rossakoff, an expert thief, and it was she who was responsible for the disappearance of M. Halliday.",
  "optionalCommas": [],
  "rule": "Set off a nonessential appositive with commas on both sides, and put a comma before and when it joins two independent clauses. \"Madame Veroneau\" and \"an expert thief\" can be removed, and \"it was she who...\" is a full clause joined by and.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-1789-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "True, his experience had not lain much in ladies of Mirelle's class, who were themselves predatory.",
  "optionalCommas": [
   0
  ],
  "rule": "A comma follows an introductory word, and a nonessential who clause is set off by a comma. \"True,\" opens the sentence, and \"who were themselves predatory\" adds extra information about the ladies.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-2605-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Caux sprang forward to open it for her, and as he did so, Poirot's voice rose gently once more.",
  "optionalCommas": [],
  "rule": "Use a comma before and joining two independent clauses, and a comma after an introductory clause. \"M. Caux sprang forward...\" and \"Poirot's voice rose...\" are both complete, and \"as he did so\" is an introductory clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-750-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I saw very little of Mr. Appleby, the American secretary, but he seemed a pleasant, normal young American, very efficient in his work.",
  "optionalCommas": [],
  "rule": "Surround a nonessential appositive with commas, put a comma before but joining two independent clauses, and separate coordinate adjectives with a comma. \"The American secretary\" can be removed, and \"pleasant, normal\" are two equal adjectives.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-70114-1618-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The wife, Mrs. Templeton, is much younger than her husband, and he has a son by his first marriage who lives there.",
  "optionalCommas": [],
  "rule": "Commas go on both sides of a nonessential appositive, and before and joining two independent clauses. \"Mrs. Templeton\" renames the wife and can be dropped, and the sentence then joins two full clauses with and.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-1253-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "This statement might, or might not, be true, but it did not seem to me to improve matters much for Inglethorp.",
  "optionalCommas": [],
  "rule": "A removable interrupting phrase gets commas on both sides, and a comma comes before but joining two independent clauses. \"or might not\" interrupts the verb phrase, and \"it did not seem...\" is a second full clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-2659-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We arrived back at my house at this minute, and I hurried in to my surgery patients, who had all been waiting a considerable time, leaving Poirot to walk to the police station with the inspector.",
  "optionalCommas": [],
  "rule": "Use a comma before and joining two independent clauses, set off a nonessential who clause, and set off a trailing participial phrase. Both \"We arrived...\" and \"I hurried...\" are full clauses, \"who had all been waiting\" is extra information, and \"leaving Poirot...\" modifies the main action.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-1846-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "They were Italians, and the elder of the two, a man of about forty, gave his name as Signor Ascanio.",
  "optionalCommas": [],
  "rule": "Put a comma before and joining two independent clauses, and commas around a nonessential appositive. \"They were Italians\" is complete on its own, and \"a man of about forty\" renames the elder and can be removed.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-3187-9",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "According to the police theory, Ralph was wearing another pair of the same kind, and I found out that it was true that he had two pairs.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and put a comma before 'and' when it joins two independent clauses. Here 'According to the police theory' opens the sentence, and 'Ralph was wearing...' and 'I found out...' could each stand alone.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-1369-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I told Ruth exactly what he was, and she had, perforce, to believe me.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' when it joins two independent clauses, and set off a removable interrupter with commas on both sides. 'Perforce' can be dropped without harming the sentence, so it gets a comma before and after.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1200-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Although this harangue was uttered in rapid and virulent French, Célestine had interlarded it with a wealth of gesture, and the chambermaid realized at least a part of her meaning.",
  "optionalCommas": [],
  "rule": "A comma follows an introductory clause that begins with 'Although', and a comma goes before 'and' when it joins two independent clauses. Both 'Célestine had interlarded it...' and 'the chambermaid realized...' are complete sentences.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-1134-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "If so, then the man of whom she spoke to Mademoiselle may be concerned in the case, and the affair is a crime of passion.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase 'If so', and put a comma before 'and' joining two independent clauses. The second clause, 'the affair is a crime of passion', has its own subject and verb.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-2444-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "When I went up to Styles with you that first day, I had no idea as to how the crime had been committed, but from what I knew of Mr. Inglethorp, I fancied that it would be very hard to find anything to connect him with it.",
  "optionalCommas": [
   30
  ],
  "rule": "Use a comma after an introductory clause ('When I went up...'), and a comma before 'but' when it joins two independent clauses. The long phrase 'from what I knew of Mr. Inglethorp' also introduces its clause, so a comma after it is best (though a reader might skip it).",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-2231-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I pointed out several objections to the theory, but when once Caroline has got something firmly into her head, nothing dislodges it.",
  "optionalCommas": [],
  "rule": "Put a comma before 'but' joining two independent clauses, and a comma after an introductory clause that begins with 'when'. The clause 'when once Caroline has got something firmly into her head' comes before the main clause 'nothing dislodges it'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-544-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He bent over the body, and I thought that, like Parker, he was going to lay hold of the dagger hilt.",
  "optionalCommas": [],
  "rule": "Use a comma before and when it joins two independent clauses. Also set off the nonessential phrase \"like Parker\" with commas on both sides.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-2983-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "With an eye on possible publication in the future, I had divided the work into chapters, and the night before I had brought it up to date with an account of Miss Russell’s visit.",
  "optionalCommas": [],
  "rule": "Put a comma after a long introductory phrase, and a comma before and when it joins two independent clauses. Here the phrase \"With an eye on ... future\" opens the sentence, and each side of \"and\" has its own subject and verb.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-1146-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He went on to narrate, with discreet pseudonyms, the story of the historic jewels of a reigning house, and Mrs. Opalsen listened with bated breath.",
  "optionalCommas": [],
  "rule": "Set off a removable interrupter like \"with discreet pseudonyms\" with commas on both sides. Use a comma before and when it joins two independent clauses.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-2270-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Strictly speaking, I had not heard Miss Ganett say anything of the kind, but I respected Caroline’s knowledge of innuendoes.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase such as \"Strictly speaking.\" Use a comma before but when it joins two independent clauses.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-2600-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Now, Miss Ackroyd, M. Poirot here has made a certain suggestion to me.",
  "optionalCommas": [
   0
  ],
  "rule": "A comma follows an introductory word like \"Now\" (optional when it is this short). A person addressed directly, \"Miss Ackroyd,\" is set off with commas.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-1587-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In the event of my death, M. Crowther, I authorise you to take charge of those papers and make what use you can of them.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase \"In the event of my death.\" Then set off the name of the person addressed, \"M. Crowther,\" with a comma.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-70114-1350-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Now, Captain Hastings, you have still one more part to play.",
  "optionalCommas": [
   0
  ],
  "rule": "A comma follows an introductory word like \"Now\" (optional when it is this short). Use commas to set off a name used in direct address, here \"Captain Hastings.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-3212-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "When, however, the train had completed its slow journey round the ceinture and reached the Gare de Lyon, Poirot became suddenly galvanized into activity.",
  "optionalCommas": [],
  "rule": "Set off an interrupter like \"however\" with commas on both sides. Put a comma after the whole introductory clause, which ends at \"Gare de Lyon.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-2406-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In exactly the same way, Mrs. Inglethorp had laid down her cup of coffee on reaching her room the night before, and the treacherous table had played her the same trick.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase \"In exactly the same way.\" Use a comma before and when it joins two independent clauses.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-1377-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Poirot had conferred with Japp in a low tone on the way up, and it was the latter functionary who requested that the household, with the exception of the servants, should be assembled together in the drawing-room.",
  "optionalCommas": [],
  "rule": "Use a comma before and joining two independent clauses. Set off the removable phrase \"with the exception of the servants\" with commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-61262-493-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Did Black’s story suggest an ingenious method of committing suicide to Mr. Maltravers, or did his other listener, the wife, see an equally ingenious method of committing murder?",
  "optionalCommas": [],
  "rule": "Use a comma before or when it joins two independent clauses. The appositive \"the wife\" renames the listener and is nonessential, so commas go on both sides.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-1853-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "To my extreme annoyance, Poirot was not in, and the old Belgian who answered my knock informed me that he believed he had gone to London.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase \"To my extreme annoyance.\" Use a comma before and joining the two independent clauses.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-3297-10",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She was convinced, she says, that the dead woman was urgently trying to tell her something, and it suddenly came to her that what the dead woman was trying to say was that Knighton was her murderer!",
  "optionalCommas": [],
  "rule": "Set off the nonessential interrupter 'she says' with commas on both sides. Also put a comma before 'and' when it joins two complete sentences: 'She was convinced...something' and 'it suddenly came to her...'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-1834-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Later, he drove back to Monte Carlo, dined there, and reached home once more at eleven o'clock.",
  "optionalCommas": [
   0
  ],
  "rule": "Separate the items in a series with commas: drove back, dined, and reached. Use a comma after an introductory word such as 'Later' (short ones are often optional).",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-444-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "On the following morning, he had an appointment with Professor Bourgoneau, which he kept.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase ('On the following morning'). Also set off a nonessential 'which' clause ('which he kept') with a comma, since it only adds extra information.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-61262-1604-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As for O’Murphy’s ‘double,’ no one was going to take much notice of him until after the departure of the Prime Minister, and by then he would have made himself scarce.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase 'As for O’Murphy’s double'. Also put a comma before 'and' because it joins two complete sentences: 'no one was going to take much notice...' and 'by then he would have made himself scarce'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-1748-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "His idea was, I think, to loosen the tension, but Mrs. Ackroyd threw him a glance of reproach and took out her handkerchief.",
  "optionalCommas": [],
  "rule": "Set off the nonessential interrupter 'I think' with commas on both sides. Put a comma before 'but' because it joins two complete sentences. No comma is needed in 'threw him a glance of reproach and took out her handkerchief', which has one subject and two verbs.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-1045-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The secretary reflected for a minute or two, knitting his brows, and during the pause Parker appeared in answer to the bell.",
  "optionalCommas": [],
  "rule": "Set off the nonessential participial phrase 'knitting his brows' with commas, and put a comma before 'and' because it joins two complete sentences: 'The secretary reflected...' and 'Parker appeared...'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-1832-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Poirot remained firm, however, and together we visited the kitchens and questioned the man who had taken the order from Flat II.",
  "optionalCommas": [],
  "rule": "Set off the interrupter 'however' with commas on both sides. The comma after 'however' also comes before 'and', which joins two complete sentences. No comma is needed in 'visited the kitchens and questioned the man', which is a compound predicate.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-70114-1162-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It took me some time to ferret it out, but I found it at last and brought it to Poirot, who sank down in a chair and started reading it with the greatest attention.",
  "optionalCommas": [],
  "rule": "Put a comma before 'but' because it joins two complete sentences. Use a comma before the nonessential 'who' clause, which only adds extra detail about Poirot. No comma is needed in 'found it at last and brought it to Poirot', which has one subject and two verbs.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-725-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "That the golden hair owed something to art, as did the pink-and-white complexion, was undeniable, but the blue of the eyes was Nature's gift, and at forty-four Lady Tamplin could still rank as a beauty.",
  "optionalCommas": [],
  "rule": "Use a comma before but and and when each joins two complete sentences. Also set off the nonessential phrase 'as did the pink-and-white complexion' with commas on both sides, since the sentence still works without it.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1098-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As though in answer to prayer, the flap of the tent was lifted, and Hassan appeared, bearing a steaming cup which he offered to Poirot.",
  "optionalCommas": [
   15
  ],
  "rule": "Put a comma after an introductory phrase, and put a comma before 'and' when it joins two complete sentences. Here 'As though in answer to prayer' opens the sentence, and 'the flap ... was lifted' and 'Hassan appeared' are both complete.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-58866-1223-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The boy made a shivering gesture of negation, and the magistrate, always disposed to cross Giraud whenever possible, replied.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two complete sentences. Use a pair of commas around a removable interrupter: 'always disposed to cross Giraud whenever possible' could be deleted without harming the sentence.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-574-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "On the night of his release, Halliday slept in the room next to ours at the hotel, and all night long I heard him moaning and protesting in his sleep.",
  "optionalCommas": [],
  "rule": "Put a comma after a long introductory phrase ('On the night of his release'). Put a comma before 'and' when it joins two complete sentences, as it does here.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-61262-1507-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Were the Prime Minister dead, it would be a terrible calamity, but the situation would have to be faced.",
  "optionalCommas": [],
  "rule": "An introductory clause ('Were the Prime Minister dead') is followed by a comma. A comma also goes before 'but' when it joins two complete sentences.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-58866-706-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "At that moment, the front door opened, and M. Hautet and the commissary came down the steps.",
  "optionalCommas": [
   2
  ],
  "rule": "Use a comma after an introductory phrase and a comma before 'and' when it joins two complete sentences. 'The front door opened' and 'M. Hautet and the commissary came down the steps' each stand alone.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-69087-471-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Preceding me to the hall, Parker helped me on with my overcoat, and I stepped out into the night.",
  "optionalCommas": [],
  "rule": "A participial phrase that opens a sentence ('Preceding me to the hall') takes a comma after it. Use another comma before 'and' because it joins two complete sentences.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-863-898-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Taking the keys from Poirot, John unlocked it, and we all passed in.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase 'Taking the keys from Poirot'. Put a comma before 'and' because 'John unlocked it' and 'we all passed in' are both complete sentences.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-1621-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The woman looked long and searchingly at the Count, who was, Poirot fancied, rather uneasy under this scrutiny.",
  "optionalCommas": [],
  "rule": "A nonessential clause (who was ... uneasy) is set off with commas, and the interrupting phrase 'Poirot fancied' needs commas on both sides. Here the Count is already identified, so the who-clause only adds information.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-102-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She jumped up promptly, and something in her manner reminded me that her position was a dependent one and that Mrs. Inglethorp, kind as she might be in the main, did not allow her to forget it.",
  "optionalCommas": [
   17
  ],
  "rule": "Use a comma before 'and' when it joins two independent clauses (She jumped up / something reminded me). The phrase 'kind as she might be in the main' interrupts the clause and can be removed, so it needs commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-726-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Charming as she looked, Lady Tamplin was, for once, not thinking of herself.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase or clause ('Charming as she looked'). 'For once' interrupts the sentence and can be removed, so it gets commas on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-487-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In her attitude towards Poirot, she was inclined to be suspicious, but he soon broke down her defences.",
  "optionalCommas": [],
  "rule": "Put a comma after the introductory phrase 'In her attitude towards Poirot'. Also use a comma before 'but' when it joins two independent clauses.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-1264-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In a few moments, they emerged, and Poirot at once stepped forward and accosted the shorter of the two.",
  "optionalCommas": [],
  "rule": "A comma follows the introductory phrase 'In a few moments', and a comma goes before 'and' joining the two independent clauses. 'Stepped forward and accosted' is one subject with two verbs, so it takes no comma.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-1279-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "From the evidence at the inquest, Mr. Inglethorp murdered his wife as sure as I stand here, and if anyone but you hinted the contrary, I’d laugh in his face.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase ('From the evidence at the inquest') and before 'and' joining independent clauses. The introductory clause 'if anyone but you hinted the contrary' also needs a comma before the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-864-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Dr. Bolitho had attended him for some time, but when Dr. Quentin first saw his patient, he was mystified by some of the symptoms.",
  "optionalCommas": [],
  "rule": "Use a comma before 'but' joining two independent clauses. The introductory clause beginning with 'when' needs a comma before the main clause 'he was mystified'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-109-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "All the time that Ralph Paton was growing up to manhood, a series of lady housekeepers presided over Ackroyd’s establishment, and each in turn was regarded with lively suspicion by Caroline and her cronies.",
  "optionalCommas": [],
  "rule": "A long introductory phrase needs a comma after it, and a comma goes before 'and' when it joins two independent clauses (a series ... presided / each ... was regarded).",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-2810-13",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I wish you were in St. Mary Mead, my dear, and that is a fact.",
  "optionalCommas": [],
  "rule": "A name or term of address ('my dear') is set off by commas. A comma also goes before 'and' joining the two independent clauses.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1326-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Once there, to my intense surprise, Poirot effected a rapid change of clothing.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase 'Once there'. 'To my intense surprise' interrupts the sentence and is removable, so it is also followed by a comma.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-281-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It was pitch dark, but Lawrence was following with the candle, and by its feeble light we saw that the bed had not been slept in and that there was no sign of the room having been occupied.",
  "optionalCommas": [],
  "rule": "Use a comma before 'but' and before 'and' when each joins independent clauses. The final 'and that' joins two that-clauses after 'saw', so it needs no comma.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-893-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I explained to Cinderella just how the discovery had been made, and she listened attentively, sometimes putting an intelligent question.",
  "optionalCommas": [],
  "rule": "A comma goes before 'and' joining two independent clauses. The participial phrase 'sometimes putting an intelligent question' adds extra information at the end, so a comma sets it off.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-908-6",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Dr. Quentin, on the other hand, has an impression that it was closed but not fastened, but he won't swear either way.",
  "optionalCommas": [],
  "rule": "'On the other hand' interrupts the sentence and needs commas on both sides. Use a comma before 'but' joining two independent clauses; 'closed but not fastened' is one idea and needs none.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-247-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Hautet, the Juge d’Instruction, was a tall, gaunt man with piercing dark eyes and a neatly cut grey beard, which he had a habit of caressing as he talked.",
  "optionalCommas": [],
  "rule": "The appositive 'the Juge d’Instruction' takes commas on both sides, 'tall, gaunt' are coordinate adjectives needing a comma, and the nonessential 'which' clause is set off by a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-351-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "By the way, Ruth, I shouldn't take those rubies abroad if I were you.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase 'By the way', and set off the name of the person addressed ('Ruth') with a comma.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-70114-1737-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "By the time I had disentangled myself, my quarry was just passing through the doorway___ the next delay was from a waiter carrying a huge pile of plates who crashed into me without the least warning.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "By the time I had disentangled myself, my quarry was just passing through the doorway, and the next delay was from a waiter carrying a huge pile of plates who crashed into me without the least warning.",
  "rule": "Use a comma before a coordinating conjunction (and) that joins two complete sentences. Here \"my quarry was just passing through the doorway\" and \"the next delay was from a waiter\" can each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-1394-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It would be easy for our man to leave the train unseen___ it would be easy to catch a train back to Paris or anywhere he pleases.",
  "options": [
   ";",
   ",",
   "",
   ":"
  ],
  "answer": ";",
  "fixed": "It would be easy for our man to leave the train unseen; it would be easy to catch a train back to Paris or anywhere he pleases.",
  "rule": "Two complete sentences with no conjunction must be joined by a semicolon. A comma alone would be a comma splice, and no punctuation would make a run-on.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-34-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "A lady in a stout tweed skirt, who was bending over a flower bed___ straightened herself at our approach.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "A lady in a stout tweed skirt, who was bending over a flower bed, straightened herself at our approach.",
  "rule": "The clause \"who was bending over a flower bed\" is a nonessential interrupter, so it needs commas on both sides. The opening comma is already there, so the closing one is missing.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-469-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I saw Mrs. Maltravers give a terrified start___ my mind flew to the old superstition that a suicide cannot rest.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "I saw Mrs. Maltravers give a terrified start, and my mind flew to the old superstition that a suicide cannot rest.",
  "rule": "Put a comma before and when it joins two independent clauses. \"I saw Mrs. Maltravers give a terrified start\" and \"my mind flew to the old superstition\" are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-86-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot gave a brief explanation___ the doctor started examining our strange visitor, who seemed quite unconscious of his presence or ours.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Poirot gave a brief explanation, and the doctor started examining our strange visitor, who seemed quite unconscious of his presence or ours.",
  "rule": "Use a comma before and when two independent clauses are joined. \"Poirot gave a brief explanation\" and \"the doctor started examining\" have different subjects, so each is its own sentence. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-727-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Though very well preserved, she was certainly no longer young___ her charm was of the quality which is independent of age.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Though very well preserved, she was certainly no longer young, but her charm was of the quality which is independent of age.",
  "rule": "A comma is needed before but when it links two independent clauses. \"She was certainly no longer young\" and \"her charm was of the quality...\" both stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1707-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He ordered a third cocktail___ again he stared out to sea, and then suddenly he started.",
  "options": [
   ";",
   ",",
   "",
   ":"
  ],
  "answer": ";",
  "fixed": "He ordered a third cocktail; again he stared out to sea, and then suddenly he started.",
  "rule": "Two independent clauses with no conjunction between them need a semicolon. A comma would create a comma splice.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-724-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He bent down, surveying the handle attentively___ I heard him give a grunt of satisfaction.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "He bent down, surveying the handle attentively, and I heard him give a grunt of satisfaction.",
  "rule": "Place a comma before and when it joins two independent clauses. \"He bent down...\" and \"I heard him give a grunt\" have different subjects and each is complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-1740-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "That changed the course of my ideas___ I asked Poirot if he knew that Jack Renauld had been in Merlinville on the night of the crime.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "That changed the course of my ideas, and I asked Poirot if he knew that Jack Renauld had been in Merlinville on the night of the crime.",
  "rule": "A comma comes before and when it connects two complete sentences. \"That changed the course of my ideas\" and \"I asked Poirot...\" can each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-483-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Indeed, I have a theory as to the actual nature of the force we call magnetism___ it is not yet time for my discoveries to be given to the world.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Indeed, I have a theory as to the actual nature of the force we call magnetism, but it is not yet time for my discoveries to be given to the world.",
  "rule": "Use a comma before but when it joins two independent clauses. Both \"I have a theory...\" and \"it is not yet time...\" are complete sentences. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-1257-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Nevertheless___ I should have drawn attention to our presence before now, had not my companion put a warning pressure on my arm.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Nevertheless, I should have drawn attention to our presence before now, had not my companion put a warning pressure on my arm.",
  "rule": "A transition word like Nevertheless that opens a sentence is followed by a comma. Without it the sentence runs straight into the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1874-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Exactly how far she has progressed, nobody knows___ it is certain that it is much farther than has ever been given out.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Exactly how far she has progressed, nobody knows, but it is certain that it is much farther than has ever been given out.",
  "rule": "Put a comma before but when it joins two independent clauses. \"Nobody knows\" is complete, and so is \"it is certain that it is much farther...\". Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1820-8",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "All three men had taken port___ the decanter, half-full, stood before the centre plate.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "All three men had taken port, and the decanter, half-full, stood before the centre plate.",
  "rule": "A comma goes before and when it joins two independent clauses. \"All three men had taken port\" and \"the decanter stood before the centre plate\" each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-1022-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We had reached Leastways Cottage___ Poirot ushered me upstairs to his own room.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "We had reached Leastways Cottage, and Poirot ushered me upstairs to his own room.",
  "rule": "Use a comma before and when two full sentences are joined. Here the second clause has a new subject, Poirot. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-314-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot had just accused me of being imaginative___ I now felt that he was far more wildly so than I had ever been.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Poirot had just accused me of being imaginative, but I now felt that he was far more wildly so than I had ever been.",
  "rule": "A comma is needed before but when it joins two independent clauses. Each side of but here has its own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-70114-750-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "At one period of my life I had been private secretary to a busy member of Parliament___ I was not called upon to assume a role unfamiliar to me.",
  "options": [
   ", so",
   " so",
   " so,",
   ": so"
  ],
  "answer": ", so",
  "fixed": "At one period of my life I had been private secretary to a busy member of Parliament, so I was not called upon to assume a role unfamiliar to me.",
  "rule": "Put a comma before so when it joins two independent clauses. Both \"I had been private secretary...\" and \"I was not called upon...\" are complete sentences. Test: cover \"so\" and read what follows. It could stand alone as a sentence, so the comma goes before \"so\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-1688-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Nevertheless___ I recalled the case fairly accurately.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Nevertheless, I recalled the case fairly accurately.",
  "rule": "A transitional word that starts a sentence takes a comma after it. Place the comma after Nevertheless before the main clause begins.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1175-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Presently a doctor arrived___ Poirot handed her over to his charge and drew aside with me.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Presently a doctor arrived, and Poirot handed her over to his charge and drew aside with me.",
  "rule": "A comma goes before and when it links two independent clauses. \"Presently a doctor arrived\" is complete, and so is the clause that begins with Poirot. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-1252-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I meant to do so___ I was told that a friend was at the hall door, so I laid down the coffee on the hall table.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "I meant to do so, but I was told that a friend was at the hall door, so I laid down the coffee on the hall table.",
  "rule": "Use a comma before but when it joins two independent clauses. \"I meant to do so\" and \"I was told that a friend was at the hall door\" each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-1801-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I realised that we were penetrating into the Ardennes___ I suddenly remembered Poirot's saying that he had a brother who lived at Spa.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "I realised that we were penetrating into the Ardennes, and I suddenly remembered Poirot's saying that he had a brother who lived at Spa.",
  "rule": "A comma comes before and when it joins two independent clauses. Each half here has its own subject (we, I) and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1819-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "On the manager’s suggestion we searched the flat___ the result was a foregone conclusion.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "On the manager’s suggestion we searched the flat, but the result was a foregone conclusion.",
  "rule": "A comma is required before but when it joins two independent clauses. The opening phrase belongs to the first clause, so the comma goes just before but. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-2908-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It was Poirot’s voice speaking___ I knew from the gravity of his tone that he, too, was fully alive to the implications of the position.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "It was Poirot’s voice speaking, and I knew from the gravity of his tone that he, too, was fully alive to the implications of the position.",
  "rule": "Use a comma before and when two independent clauses are joined. \"It was Poirot's voice speaking\" and \"I knew...\" each could be a sentence. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-1384-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "His last words were almost a question___ I was aware of the sharpness with which he darted a glance at me.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "His last words were almost a question, and I was aware of the sharpness with which he darted a glance at me.",
  "rule": "A comma goes before and when it joins two independent clauses. Both halves of this sentence are complete on their own. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1244-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It was a trap, yes, and it meant certain capture and possible death___ it was baited with the person dearest to me in the whole world, and I dared not hesitate.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "It was a trap, yes, and it meant certain capture and possible death, but it was baited with the person dearest to me in the whole world, and I dared not hesitate.",
  "rule": "Use a comma before but when it joins independent clauses. \"It meant certain capture and possible death\" and \"it was baited with the person dearest to me\" are both complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-2430-33",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He is fighting a losing battle___ he is prepared to take any means that come to his hand, for exposure means ruin to him.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "He is fighting a losing battle, and he is prepared to take any means that come to his hand, for exposure means ruin to him.",
  "rule": "A comma comes before and when it joins two complete sentences. Each half has its own subject (He, he) and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-59-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "From the very first I took a firm and rooted dislike to him___ I flatter myself that my first judgments are usually fairly shrewd.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "From the very first I took a firm and rooted dislike to him, and I flatter myself that my first judgments are usually fairly shrewd.",
  "rule": "Use a comma before and when it joins two independent clauses. Each half could stand as its own sentence. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-2454-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "This fellow has an American accent all right___ he doesn’t deny that he was near King’s Abbot that night.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "This fellow has an American accent all right, and he doesn’t deny that he was near King’s Abbot that night.",
  "rule": "A comma goes before and when two independent clauses are joined. \"This fellow has an American accent\" and \"he doesn't deny...\" each have their own subject. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-61262-1828-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "You order through this telephone___ the dishes are sent down in the lift, one course at a time.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "You order through this telephone, and the dishes are sent down in the lift, one course at a time.",
  "rule": "Put a comma before and when it joins two independent clauses. The subjects You and the dishes each have their own verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-2286-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He would call evidence to show who did destroy the will___ it was possible that that might open up quite a new view of the case.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "He would call evidence to show who did destroy the will, and it was possible that that might open up quite a new view of the case.",
  "rule": "A comma comes before and when it joins two complete sentences. Both \"He would call evidence...\" and \"it was possible...\" can stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-1989-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It had been quite a complicated piece of work___ the old gentleman had been very fussy about it.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "It had been quite a complicated piece of work, and the old gentleman had been very fussy about it.",
  "rule": "Use a comma before a coordinating conjunction that joins two complete sentences. Each half here has its own subject and verb, so the comma goes before \"and\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-1123-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "But Dorcas___ dispelled even that possibility.",
  "options": [
   ", who was the next witness called,",
   " who was the next witness called,",
   ", who was the next witness called",
   " who was the next witness called"
  ],
  "answer": ", who was the next witness called,",
  "fixed": "But Dorcas, who was the next witness called, dispelled even that possibility.",
  "rule": "A nonessential interrupter needs commas on both sides. \"Who was the next witness called\" can be removed, so it is set off before and after.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-838-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The Olympia sailed from Liverpool on the 23rd___ the bonds were handed over to Philip on the morning of that day by Mr. Vavasour and Mr. Shaw, the two joint general managers of the London and Scottish Bank.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The Olympia sailed from Liverpool on the 23rd, and the bonds were handed over to Philip on the morning of that day by Mr. Vavasour and Mr. Shaw, the two joint general managers of the London and Scottish Bank.",
  "rule": "Put a comma before and when it joins two independent clauses. \"The Olympia sailed\" and \"the bonds were handed over\" are both complete clauses. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-933-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The Gigantic leaves Southampton on the same day as the Olympia___ she holds the record for the Atlantic.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The Gigantic leaves Southampton on the same day as the Olympia, and she holds the record for the Atlantic.",
  "rule": "A comma comes before a coordinating conjunction that links two independent clauses. Here the second clause has its own subject, \"she\", and its own verb, \"holds\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-300-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Of course, as soon as Rolf read of the robbery___ he arranged his own little comedy.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Of course, as soon as Rolf read of the robbery, he arranged his own little comedy.",
  "rule": "Use a comma after an introductory clause. \"As soon as Rolf read of the robbery\" cannot stand alone, so a comma follows it before the main clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-2357-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The lawyer was in his office___ we were ushered in without any delay.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The lawyer was in his office, and we were ushered in without any delay.",
  "rule": "Join two independent clauses with a comma plus a conjunction. \"The lawyer was in his office\" and \"we were ushered in\" each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1548-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He is inclined to be foolishly enthusiastic over my capabilities in consequence___ I am about to trade on this attitude of his.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "He is inclined to be foolishly enthusiastic over my capabilities in consequence, and I am about to trade on this attitude of his.",
  "rule": "A comma goes before and when it joins two complete sentences. The second one begins with a new subject, \"I\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-2211-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We crossed from England by the evening boat___ the following morning saw us in Saint-Omer, whither Jack Renauld had been taken.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "We crossed from England by the evening boat, and the following morning saw us in Saint-Omer, whither Jack Renauld had been taken.",
  "rule": "Place a comma before a conjunction that joins two independent clauses. \"The following morning saw us in Saint-Omer\" is a full clause with its own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-572-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "An audible creaking proclaimed the approach of Annie___ I had no time to reply.",
  "options": [
   ", so",
   " so",
   " so,",
   "; so,"
  ],
  "answer": ", so",
  "fixed": "An audible creaking proclaimed the approach of Annie, so I had no time to reply.",
  "rule": "A comma comes before so when it joins two independent clauses. \"I had no time to reply\" is a complete clause that follows from the first. Test: cover \"so\" and read what follows. It could stand alone as a sentence, so the comma goes before \"so\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-72824-899-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She looked up___ her eyes met those of the woman sitting opposite.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "She looked up, and her eyes met those of the woman sitting opposite.",
  "rule": "A comma is needed before and when it joins two independent clauses. \"She looked up\" and \"her eyes met those of the woman\" each have a subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-2095-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I expressed my admiration to Poirot___ he nodded thoughtfully.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I expressed my admiration to Poirot, and he nodded thoughtfully.",
  "rule": "Use a comma before a coordinating conjunction that joins two independent clauses. The second clause has a new subject, \"he\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-72824-1874-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Katherine was waiting for him___ they drove off at once.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Katherine was waiting for him, and they drove off at once.",
  "rule": "A comma comes before and when it links two independent clauses. The second clause has a new subject, \"they\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-70114-1543-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "His manner was grave and brooding___ his nerves were on edge.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "His manner was grave and brooding, and his nerves were on edge.",
  "rule": "A comma goes before a conjunction that joins two independent clauses. Each half here has its own subject: \"manner\" and \"nerves\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-390-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Her death was a shock and a distress___ she would not be passionately regretted.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Her death was a shock and a distress, but she would not be passionately regretted.",
  "rule": "A comma comes before but when it joins two independent clauses. \"Her death was a shock\" and \"she would not be regretted\" each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-664-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Allow me to interest myself in my coffee-cups___ I will respect your cocoa.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Allow me to interest myself in my coffee-cups, and I will respect your cocoa.",
  "rule": "Use a comma before and when it joins two independent clauses. \"Allow me to interest myself\" is a complete command and \"I will respect your cocoa\" is a complete statement. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-276-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "They 'phoned to Moreton___ I came out at once.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "They 'phoned to Moreton, and I came out at once.",
  "rule": "A comma goes before and when two independent clauses are joined. \"They 'phoned\" and \"I came out\" have different subjects, so each is a full clause. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-2763-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Major Blunt was walking up and down the terrace smoking___ I made a detour to get round to the side door.",
  "options": [
   ", so",
   " so",
   " so,",
   "; so,"
  ],
  "answer": ", so",
  "fixed": "Major Blunt was walking up and down the terrace smoking, so I made a detour to get round to the side door.",
  "rule": "Put a comma before so when it joins two independent clauses. The second clause, \"I made a detour\", has its own subject and verb. Test: cover \"so\" and read what follows. It could stand alone as a sentence, so the comma goes before \"so\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-2756-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I had brought with me all the money I had___ I gave it to him.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "I had brought with me all the money I had, and I gave it to him.",
  "rule": "A comma comes before and when it joins two complete sentences. Both halves have the subject \"I\" and their own verbs. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1326-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Perhaps by careful wording of the letter, I could convey a warning___ Poirot would be enabled to avoid the trap.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Perhaps by careful wording of the letter, I could convey a warning, and Poirot would be enabled to avoid the trap.",
  "rule": "Use a comma before and when it joins two independent clauses. The second clause has a new subject, \"Poirot\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1313-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The chambermaid unlocked it with her pass-key___ we entered.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The chambermaid unlocked it with her pass-key, and we entered.",
  "rule": "A comma goes before and when it links two independent clauses. \"We entered\" is a complete clause with its own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-815-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I was not particularly pleased with Poirot___ I told him so.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I was not particularly pleased with Poirot, and I told him so.",
  "rule": "Put a comma before and when it joins two independent clauses. Each clause here has the subject \"I\" and its own verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-1309-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I wanted to___ I accepted the invitation without further ceremony.",
  "options": [
   ", so",
   " so",
   " so,",
   "; so,"
  ],
  "answer": ", so",
  "fixed": "I wanted to, so I accepted the invitation without further ceremony.",
  "rule": "A comma comes before so when it joins two independent clauses. \"I wanted to\" is a complete clause, and \"I accepted the invitation\" is another. Test: cover \"so\" and read what follows. It could stand alone as a sentence, so the comma goes before \"so\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-240-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Ackroyd extends a genial patronage to the lower orders___ he has a very great sense of his own dignity.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Ackroyd extends a genial patronage to the lower orders, but he has a very great sense of his own dignity.",
  "rule": "A comma goes before but when it joins two independent clauses. \"Ackroyd extends a patronage\" and \"he has a sense of dignity\" each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-389-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He looked at me keenly as he spoke___ I was aware that I reddened under his prolonged gaze.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "He looked at me keenly as he spoke, and I was aware that I reddened under his prolonged gaze.",
  "rule": "Put a comma before and when it joins two independent clauses. The second clause begins with a new subject, \"I\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-1036-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Colonel Melrose went in search of Raymond___ I rang the bell once more for Parker.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Colonel Melrose went in search of Raymond, and I rang the bell once more for Parker.",
  "rule": "A comma comes before and when two independent clauses are joined. The subjects \"Colonel Melrose\" and \"I\" show these are two separate clauses. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-861-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Kettering raised his eyebrows___ he retained his light, amused manner.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Kettering raised his eyebrows, but he retained his light, amused manner.",
  "rule": "Use a comma before but when it joins two independent clauses. Each half has the subject \"Kettering\" or \"he\" with its own verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-1991-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We come now to the evening___ the visit of the mysterious lady.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": " and",
  "fixed": "We come now to the evening and the visit of the mysterious lady.",
  "rule": "Do not put a comma before and when it joins only two nouns or phrases. \"The evening\" and \"the visit of the mysterious lady\" are both objects of \"to\", and no second clause follows.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-3018-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot ___ smiled sympathetically.",
  "options": [
   ", who had just complied with this request,",
   " who had just complied with this request,",
   ", who had just complied with this request",
   " who had just complied with this request"
  ],
  "answer": ", who had just complied with this request,",
  "fixed": "Poirot, who had just complied with this request, smiled sympathetically.",
  "rule": "A nonessential clause is set off by commas on both sides. Poirot is already named, so 'who had just complied with this request' is extra detail and needs a comma before and after it.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-3187-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "But the inmates of the house had shoes soled with crepe rubber___ I declined to believe in the coincidence of some one from outside having the same kind of shoes as Ralph Paton wore.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "But the inmates of the house had shoes soled with crepe rubber, and I declined to believe in the coincidence of some one from outside having the same kind of shoes as Ralph Paton wore.",
  "rule": "Put a comma before a conjunction that joins two independent clauses. Each side ('the inmates had shoes' and 'I declined to believe') is a full sentence, so the comma goes before 'and'. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-1361-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The Commissary gave a sigh of relief___ the Examining Magistrate leaned back in his chair and adjusted a pince-nez on his long thin nose.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The Commissary gave a sigh of relief, and the Examining Magistrate leaned back in his chair and adjusted a pince-nez on his long thin nose.",
  "rule": "Use a comma before 'and' when it joins two independent clauses. 'The Commissary gave a sigh' and 'the Examining Magistrate leaned back' could each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-810-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Caroline led the way into our small sitting-room___ I followed.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Caroline led the way into our small sitting-room, and I followed.",
  "rule": "A comma goes before 'and' when it links two complete sentences. 'Caroline led the way' and 'I followed' each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-1582-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Evidently ___ Poirot had had no difficulty in finding what he wanted in Paris.",
  "options": [
   ", I reflected,",
   " I reflected,",
   ", I reflected",
   " I reflected"
  ],
  "answer": ", I reflected,",
  "fixed": "Evidently, I reflected, Poirot had had no difficulty in finding what he wanted in Paris.",
  "rule": "An interrupting phrase like 'I reflected' is nonessential, so it needs a comma on each side. Using only one comma, or none, leaves the interrupter half-marked.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-269-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "On arrival, Dr. Durand immediately prescribed a sedative___ we have not yet been able to question her.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "On arrival, Dr. Durand immediately prescribed a sedative, and we have not yet been able to question her.",
  "rule": "Use a comma before 'and' when two independent clauses are joined. 'Dr. Durand prescribed a sedative' and 'we have not been able to question her' are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-316-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I bounded indignantly in my seat___ the examining magistrate was continuing his questions, undistracted by side issues.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "I bounded indignantly in my seat, but the examining magistrate was continuing his questions, undistracted by side issues.",
  "rule": "Put a comma before 'but' when it joins two independent clauses. 'I bounded in my seat' and 'the magistrate was continuing' each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-2041-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The night is chilly___ he slips on an overcoat over his underclothing, intending to cast it into the grave with the dead man.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The night is chilly, and he slips on an overcoat over his underclothing, intending to cast it into the grave with the dead man.",
  "rule": "A comma goes before 'and' when it joins two independent clauses. 'The night is chilly' and 'he slips on an overcoat' are both full sentences. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-2167-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He had been strangely calm so far___ I knew him to possess marvellous self-command.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "He had been strangely calm so far, but I knew him to possess marvellous self-command.",
  "rule": "Place a comma before 'but' when it links two independent clauses. 'He had been strangely calm' and 'I knew him to possess self-command' each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-2880-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She held out a crumpled piece of newspaper___ I recognized the paragraph that Poirot had had inserted.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "She held out a crumpled piece of newspaper, and I recognized the paragraph that Poirot had had inserted.",
  "rule": "A comma is needed before 'and' joining two independent clauses. The second clause has its own subject, 'I', so it is not just a continuing verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-467-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We took chairs___ the magistrate’s clerk established himself at a round table.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "We took chairs, and the magistrate’s clerk established himself at a round table.",
  "rule": "Use a comma before 'and' when it joins two independent clauses. 'We took chairs' and 'the clerk established himself' are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1715-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The papers referred to by Poirot had passed into his keeping___ he assured me that all possible steps were being taken to deal with the approaching menace.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The papers referred to by Poirot had passed into his keeping, and he assured me that all possible steps were being taken to deal with the approaching menace.",
  "rule": "A comma goes before 'and' between two independent clauses. Each half has its own subject ('papers' and 'he') and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-905-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She had not chosen to listen to my advice___ she was punished now for her disregard of it.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "She had not chosen to listen to my advice, and she was punished now for her disregard of it.",
  "rule": "Put a comma before 'and' when it joins two independent clauses. 'She had not chosen to listen' and 'she was punished now' are each complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-2627-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Blunt had shown several signs of restlessness whilst Poirot was speaking___ the closing words seemed to rivet his attention.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Blunt had shown several signs of restlessness whilst Poirot was speaking, but the closing words seemed to rivet his attention.",
  "rule": "A comma comes before 'but' joining two independent clauses. 'Blunt had shown signs of restlessness' and 'the closing words seemed to rivet his attention' are both complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-1060-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I endeavoured to interrupt___ Poirot swept on.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "I endeavoured to interrupt, but Poirot swept on.",
  "rule": "Use a comma before 'but' when it connects two independent clauses. 'I endeavoured to interrupt' and 'Poirot swept on' each have their own subject. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-687-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Flora soon revived___ I brought her mother to her, telling her what to do for the girl.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Flora soon revived, and I brought her mother to her, telling her what to do for the girl.",
  "rule": "Use a comma before 'and' when two independent clauses are joined. 'Flora soon revived' and 'I brought her mother to her' each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-239-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He held the gate open___ we commenced walking towards the house.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "He held the gate open, and we commenced walking towards the house.",
  "rule": "Put a comma before 'and' when it joins two independent clauses. 'He held the gate open' and 'we commenced walking' have different subjects and are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-1279-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "But you’ve been on the spot from the first___ you may have picked up some little hints.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "But you’ve been on the spot from the first, and you may have picked up some little hints.",
  "rule": "A comma goes before 'and' joining two independent clauses. 'You've been on the spot' and 'you may have picked up some hints' each have a subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-467-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He looked embarrassed___ it occurred to me that he might have been listening at the door.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "He looked embarrassed, and it occurred to me that he might have been listening at the door.",
  "rule": "Use a comma before 'and' when it links two independent clauses. 'He looked embarrassed' and 'it occurred to me' are separate complete sentences. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1018-10",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He refused several times point blank___ it was only when the newspapers took it up and began making a fuss about the 'unsportsmanlike refusal' that he gave in.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "He refused several times point blank, and it was only when the newspapers took it up and began making a fuss about the 'unsportsmanlike refusal' that he gave in.",
  "rule": "A comma is required before 'and' when it joins two independent clauses. 'He refused several times' and 'it was only when...that he gave in' are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-891-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Presently ___ he glanced at his watch.",
  "options": [
   ", as whistles blew,",
   " as whistles blew,",
   ", as whistles blew",
   " as whistles blew"
  ],
  "answer": ", as whistles blew,",
  "fixed": "Presently, as whistles blew, he glanced at his watch.",
  "rule": "A nonessential interrupting clause needs commas on both sides. 'As whistles blew' can be removed without breaking the sentence, so it is set off before and after.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-70114-1771-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He made no sign of recognition___ I was at once aware that he was trying to speak to me.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "He made no sign of recognition, but I was at once aware that he was trying to speak to me.",
  "rule": "A comma comes before 'but' when it joins two independent clauses. 'He made no sign' and 'I was at once aware' each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-263-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "At this juncture, Mrs. Inglethorp called to Cynthia from the hall___ the girl ran out.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "At this juncture, Mrs. Inglethorp called to Cynthia from the hall, and the girl ran out.",
  "rule": "Use a comma before 'and' between two independent clauses. 'Mrs. Inglethorp called to Cynthia' and 'the girl ran out' have different subjects and are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-3088-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Her color flared up___ she answered steadily enough.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Her color flared up, but she answered steadily enough.",
  "rule": "A comma goes before 'but' when it joins two independent clauses. 'Her color flared up' and 'she answered steadily' each have their own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-407-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The curtains and portière were of a soft dull green___ the carpet matched them in tone.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The curtains and portière were of a soft dull green, and the carpet matched them in tone.",
  "rule": "Put a comma before 'and' when two independent clauses are joined. 'The curtains and portière were green' and 'the carpet matched them' are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-1408-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Japp ___ was the first to speak.",
  "options": [
   ", who was the least surprised of any of us,",
   " who was the least surprised of any of us,",
   ", who was the least surprised of any of us",
   " who was the least surprised of any of us"
  ],
  "answer": ", who was the least surprised of any of us,",
  "fixed": "Japp, who was the least surprised of any of us, was the first to speak.",
  "rule": "A nonessential clause is set off with commas on both sides. Japp is a specific person, so 'who was the least surprised of any of us' is extra information.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-2371-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I once sounded her on the subject___ she said that she was obliged to support several of her husband’s poor relations.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I once sounded her on the subject, and she said that she was obliged to support several of her husband’s poor relations.",
  "rule": "A comma is needed before 'and' joining two independent clauses. 'I once sounded her' and 'she said that she was obliged' are each complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-3216-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot's explanations were rapid, fluent, and impassioned___ they produced no effect upon the stolid-faced official.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Poirot's explanations were rapid, fluent, and impassioned, but they produced no effect upon the stolid-faced official.",
  "rule": "Use a comma before 'but' when it joins two independent clauses. The second clause has a new subject, 'they', so the comma is required. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-61262-530-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The whole thing was rather amusing___ I propounded the thing as a mock problem to Poirot on the following morning.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The whole thing was rather amusing, and I propounded the thing as a mock problem to Poirot on the following morning.",
  "rule": "Put a comma before 'and' when it joins two independent clauses. 'The whole thing was amusing' and 'I propounded the thing' each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-1814-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The manager produced the key without more ado___ we all entered the flat.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The manager produced the key without more ado, and we all entered the flat.",
  "rule": "Two complete sentences joined by \"and\" need a comma before the \"and\". Both \"The manager produced the key\" and \"we all entered the flat\" have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-2178-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I retired to rest that night on a note of triumph___ I awoke to realize that I was by no means out of the wood.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "I retired to rest that night on a note of triumph, but I awoke to realize that I was by no means out of the wood.",
  "rule": "When \"but\" joins two independent clauses, put a comma before it. \"I retired...\" and \"I awoke...\" each have their own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-2263-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We stopped and greeted him___ he proposed strolling with us back to our hotel.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "We stopped and greeted him, and he proposed strolling with us back to our hotel.",
  "rule": "A comma comes before \"and\" when it links two independent clauses. The second clause has a new subject, \"he\", so \"We stopped and greeted him\" is complete and needs the comma. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1163-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He had sprung into a waiting taxi___ the chase had begun.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "He had sprung into a waiting taxi, and the chase had begun.",
  "rule": "Join two independent clauses with a comma plus a coordinating conjunction. \"He had sprung into a waiting taxi\" and \"the chase had begun\" are both complete, so use \", and\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-117-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I imparted to him my vague remembrances___ he nodded vigorously.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "I imparted to him my vague remembrances, and he nodded vigorously.",
  "rule": "Put a comma before \"and\" when it connects two full clauses. The new subject \"he\" in the second clause signals that you have two independent clauses. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-326-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I received a vague impression that my dining there displeased her in some way___ I couldn’t imagine why.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "I received a vague impression that my dining there displeased her in some way, but I couldn’t imagine why.",
  "rule": "A comma goes before \"but\" when it joins two independent clauses. Each side (\"I received...in some way\" and \"I couldn’t imagine why\") has its own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-236-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "A muttered oath escaped the millionaire___ his clenched fist hit the table sharply.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "A muttered oath escaped the millionaire, and his clenched fist hit the table sharply.",
  "rule": "Use a comma before \"and\" between two independent clauses. \"A muttered oath escaped the millionaire\" and \"his clenched fist hit the table\" both work as sentences. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-61262-710-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Our real home is near Newmarket___ we usually rent a flat in town for the season.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Our real home is near Newmarket, and we usually rent a flat in town for the season.",
  "rule": "A comma precedes a coordinating conjunction that joins independent clauses. Here \"Our real home is near Newmarket\" and \"we usually rent a flat\" are each complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-1743-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot looked inquiringly at me___ I said no more.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Poirot looked inquiringly at me, but I said no more.",
  "rule": "Place a comma before \"but\" when it links two independent clauses. \"Poirot looked inquiringly at me\" and \"I said no more\" each have their own subject. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-2949-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Very shortly I shall be in England___ I hope then to have the pleasure of meeting you once more.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Very shortly I shall be in England, and I hope then to have the pleasure of meeting you once more.",
  "rule": "Two independent clauses joined by \"and\" need a comma before it. \"I shall be in England\" and \"I hope then to have the pleasure\" both have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-2507-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She could not have committed the crime single-handed___ the reasons against that did not debar her from being an accomplice.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "She could not have committed the crime single-handed, but the reasons against that did not debar her from being an accomplice.",
  "rule": "Use a comma before \"but\" when it joins two independent clauses. The second clause has its own subject, \"the reasons\", so the comma is needed. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-1564-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We went into the little morning-room___ Poirot closed the door.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "We went into the little morning-room, and Poirot closed the door.",
  "rule": "Put a comma before \"and\" when it joins two complete clauses. \"We went into the little morning-room\" and \"Poirot closed the door\" have different subjects and each stands alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-1348-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "One of them brought food and drink and offered it to me___ I waved them aside.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "One of them brought food and drink and offered it to me, but I waved them aside.",
  "rule": "A comma comes before \"but\" when it joins two independent clauses. \"One of them...offered it to me\" and \"I waved them aside\" each have a subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-1193-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I answered that I was marrying Marthe, and not her antecedents___ he shouted me down with a peremptory refusal to discuss the matter in any way.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "I answered that I was marrying Marthe, and not her antecedents, but he shouted me down with a peremptory refusal to discuss the matter in any way.",
  "rule": "Use a comma before \"but\" between two independent clauses. \"I answered...antecedents\" and \"he shouted me down\" are both complete, with the new subject \"he\". Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-601-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then Poirot returned the tools to his pocket___ we reascended once more to our own domain.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Then Poirot returned the tools to his pocket, and we reascended once more to our own domain.",
  "rule": "Two independent clauses joined by \"and\" take a comma before it. The second clause has a new subject, \"we\", so the comma is required. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-2063-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "His tone was grave and earnest___ I was impressed in spite of myself.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "His tone was grave and earnest, and I was impressed in spite of myself.",
  "rule": "A comma goes before \"and\" when it joins two independent clauses. \"His tone was grave and earnest\" and \"I was impressed\" can each stand as a sentence. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-890-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The seat opposite to her was already taken___ the American gave a cursory glance at its occupant.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "The seat opposite to her was already taken, and the American gave a cursory glance at its occupant.",
  "rule": "Use a comma before \"and\" when it links two independent clauses. The subjects \"seat\" and \"American\" each have their own verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-1198-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I wrote to Marthe, telling her what had happened___ her reply soothed me still further.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I wrote to Marthe, telling her what had happened, and her reply soothed me still further.",
  "rule": "A comma precedes \"and\" when it joins two independent clauses. \"I wrote to Marthe...\" and \"her reply soothed me\" each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-1510-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The nails were broken and discoloured___ the skin was hard.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The nails were broken and discoloured, and the skin was hard.",
  "rule": "Put a comma before \"and\" joining two independent clauses. \"The nails were broken and discoloured\" and \"the skin was hard\" are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-48-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She greeted me with a few words of pleasant welcome in a low clear voice___ I sank into a basket chair feeling distinctly glad that I had accepted John’s invitation.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "She greeted me with a few words of pleasant welcome in a low clear voice, and I sank into a basket chair feeling distinctly glad that I had accepted John’s invitation.",
  "rule": "A comma comes before \"and\" when it joins two independent clauses. \"She greeted me...\" and \"I sank into a basket chair\" have different subjects and both stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-2180-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot’s good temper was imperturbable___ I thought I detected a film of reserve in his manner which was new.",
  "options": [
   ", yet",
   " yet",
   " yet,",
   "; yet,"
  ],
  "answer": ", yet",
  "fixed": "Poirot’s good temper was imperturbable, yet I thought I detected a film of reserve in his manner which was new.",
  "rule": "Use a comma before \"yet\" when it joins two independent clauses. \"Poirot’s good temper was imperturbable\" and \"I thought I detected a film of reserve\" each have a subject and verb. Test: cover \"yet\" and read what follows. It could stand alone as a sentence, so the comma goes before \"yet\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1815-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I was willing to risk my own life___ I had qualms about continually risking yours.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "I was willing to risk my own life, but I had qualms about continually risking yours.",
  "rule": "A comma goes before \"but\" when it joins two independent clauses. Both \"I was willing to risk my own life\" and \"I had qualms\" are complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-709-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I do not usually label myself as dense___ I must confess that nothing out of the ordinary had attracted my attention.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "I do not usually label myself as dense, but I must confess that nothing out of the ordinary had attracted my attention.",
  "rule": "Place a comma before \"but\" between two independent clauses. Each clause here has its own \"I\" and verb, so the comma is needed. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-72824-1676-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "His fingertips were joined together___ he was looking intently at the ceiling.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "His fingertips were joined together, and he was looking intently at the ceiling.",
  "rule": "Join two independent clauses with a comma plus \"and\". \"His fingertips were joined together\" and \"he was looking intently at the ceiling\" each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-2382-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The sheets fell from my hand___ I looked across at him.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "The sheets fell from my hand, and I looked across at him.",
  "rule": "A comma precedes \"and\" when it links two independent clauses. The new subject \"I\" begins a second complete clause. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-1952-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "But I had noted the momentary hesitation___ I knew that there was still something she was keeping back.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "But I had noted the momentary hesitation, and I knew that there was still something she was keeping back.",
  "rule": "Use a comma before \"and\" joining two independent clauses. \"I had noted the momentary hesitation\" and \"I knew that...\" each have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-2094-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Of the intervening weeks I will say little___ my admiration and sympathy went out unfeignedly to Mary Cavendish.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Of the intervening weeks I will say little, but my admiration and sympathy went out unfeignedly to Mary Cavendish.",
  "rule": "A comma goes before \"but\" when it joins two independent clauses. \"I will say little\" and \"my admiration and sympathy went out\" are both complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-648-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then he gave the constable some low-voiced instructions___ the latter prepared to depart.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Then he gave the constable some low-voiced instructions, and the latter prepared to depart.",
  "rule": "Put a comma before \"and\" when it joins two independent clauses. The second clause has its own subject, \"the latter\". Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1650-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "___ he soon elicited the information that a nurse of the name of Mabel Palmer was a member of the Lark Institute and had been sent to the case in question.",
  "options": [
   "However,",
   "However",
   "However;",
   "However:"
  ],
  "answer": "However,",
  "fixed": "However, he soon elicited the information that a nurse of the name of Mabel Palmer was a member of the Lark Institute and had been sent to the case in question.",
  "rule": "A transition word like \"However\" at the start of a sentence is followed by a comma. A semicolon or colon would wrongly suggest a complete sentence came before it.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-2382-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It is, of course, possible that he banked the money under another name___ I am disposed to believe he spoke the truth to us.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "It is, of course, possible that he banked the money under another name, but I am disposed to believe he spoke the truth to us.",
  "rule": "Use a comma before a coordinating conjunction such as but when it joins two independent clauses. Here 'It is ... possible that he banked the money' and 'I am disposed to believe' can each stand alone. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-1009-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The window may have been left open after his departure and so afforded entrance to the murderer___ the same person may have returned a second time.",
  "options": [
   ", or",
   " or",
   " or,",
   "; or,"
  ],
  "answer": ", or",
  "fixed": "The window may have been left open after his departure and so afforded entrance to the murderer, or the same person may have returned a second time.",
  "rule": "Put a comma before a coordinating conjunction that joins two independent clauses. Each side of 'or' here has its own subject and verb. Test: cover \"or\" and read what follows. It could stand alone as a sentence, so the comma goes before \"or\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-2202-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The tone was light___ I read a veiled menace into the words.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "The tone was light, but I read a veiled menace into the words.",
  "rule": "Two independent clauses joined by but need a comma before but. 'The tone was light' and 'I read a veiled menace' are both complete sentences. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-760-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I pointed this out to the police___ they took the other one away with them.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I pointed this out to the police, and they took the other one away with them.",
  "rule": "Use a comma before and when it links two independent clauses. Both 'I pointed this out' and 'they took the other one away' have their own subjects and verbs. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-1112-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He came from the North West, I know___ I fancy that he had an unhappy childhood, for he never cared to speak of that time.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "He came from the North West, I know, but I fancy that he had an unhappy childhood, for he never cared to speak of that time.",
  "rule": "A comma goes before but when it joins two independent clauses. 'He came from the North West, I know' is complete, and so is 'I fancy that he had an unhappy childhood'. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-285-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "For a moment, remembering what I had heard and seen___ I was doubtful of my reception, but I need have had no misgivings.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "For a moment, remembering what I had heard and seen, I was doubtful of my reception, but I need have had no misgivings.",
  "rule": "An introductory phrase is followed by a comma before the main clause begins. 'For a moment, remembering what I had heard and seen' sets the scene, and 'I was doubtful' is the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-61262-781-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Mrs. Middleton, that quiet middle-aged woman, who had appeared so normal and respectable___ had vanished into thin air.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Mrs. Middleton, that quiet middle-aged woman, who had appeared so normal and respectable, had vanished into thin air.",
  "rule": "A nonessential clause needs commas on both sides. 'Who had appeared so normal and respectable' can be removed, so a comma must close it before the verb 'had vanished'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-72824-1409-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Naturally, if he committed the crime___ he will have an alibi.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Naturally, if he committed the crime, he will have an alibi.",
  "rule": "Put a comma after an introductory clause that begins with if. 'If he committed the crime' is dependent, so a comma separates it from 'he will have an alibi'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-2576-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Her voice rose shrilly___ she flung out her arms in an extravagant gesture.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Her voice rose shrilly, and she flung out her arms in an extravagant gesture.",
  "rule": "Use a comma before and when it joins two independent clauses. 'Her voice rose shrilly' and 'she flung out her arms' both have their own subjects. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-70114-1507-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "It was a somewhat dirty card___ the original address had been scratched out and another substituted in pencil.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "It was a somewhat dirty card, and the original address had been scratched out and another substituted in pencil.",
  "rule": "Two independent clauses joined by and need a comma before the and. Each half of this sentence has its own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-3221-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Van Aldin said nothing___ he was clearly disgusted at Poirot's extraordinary conduct.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "Van Aldin said nothing, but he was clearly disgusted at Poirot's extraordinary conduct.",
  "rule": "A comma comes before but when it links two independent clauses. 'Van Aldin said nothing' and 'he was clearly disgusted' are both complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-1200-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She had divined only too well the ruthless egoism that was the keynote of her personality___ it repelled her.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "She had divined only too well the ruthless egoism that was the keynote of her personality, and it repelled her.",
  "rule": "Use a comma before and when it joins two independent clauses. 'She had divined ...' and 'it repelled her' can each stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-2110-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I, Hercule Poirot, know___ I lack the last link in my chain.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "I, Hercule Poirot, know, but I lack the last link in my chain.",
  "rule": "A comma goes before but when it joins two independent clauses. 'I, Hercule Poirot, know' is a complete clause, and so is 'I lack the last link'. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-369-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Presently, when we are calmer___ we will arrange the facts, neatly, each in his proper place.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Presently, when we are calmer, we will arrange the facts, neatly, each in his proper place.",
  "rule": "An introductory dependent clause is followed by a comma. 'When we are calmer' cannot stand alone, so a comma separates it from 'we will arrange the facts'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-2081-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then, summoning all my courage to appear unmoved___ I handed it back.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Then, summoning all my courage to appear unmoved, I handed it back.",
  "rule": "A comma follows an introductory participial phrase. 'Summoning all my courage to appear unmoved' modifies 'I', and the comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-606-9",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Nothing was known of the antecedents of Miss Elsa Hardt___ she disappeared suddenly about the time of Valdarno’s death.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Nothing was known of the antecedents of Miss Elsa Hardt, and she disappeared suddenly about the time of Valdarno’s death.",
  "rule": "Use a comma before and when it joins two independent clauses. 'Nothing was known ...' and 'she disappeared suddenly' each have a subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-1100-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I got no answer___ I turned, a little annoyed.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "I got no answer, and I turned, a little annoyed.",
  "rule": "A comma goes before and when it links two independent clauses. 'I got no answer' and 'I turned' are both complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-938-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot and the commissary, who were both present___ greeted me respectively with a smile and a polite bow.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Poirot and the commissary, who were both present, greeted me respectively with a smile and a polite bow.",
  "rule": "A nonessential clause is set off by commas on both sides. 'Who were both present' is removable, so a comma must close it before the verb 'greeted'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-1933-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Uncle Andrew warned me fairly___ I chose my own path.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Uncle Andrew warned me fairly, and I chose my own path.",
  "rule": "Two independent clauses joined by and need a comma before and. Both halves here have their own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-757-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I looked somewhat astonished___ she went on hurriedly.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "I looked somewhat astonished, and she went on hurriedly.",
  "rule": "Use a comma before and when it joins two independent clauses. 'I looked somewhat astonished' and 'she went on hurriedly' both stand alone. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-2902-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He leant forward and struck the table a blow with his fist___ his eyes flashed with anger.",
  "options": [
   ";",
   ",",
   "",
   "; and"
  ],
  "answer": ";",
  "fixed": "He leant forward and struck the table a blow with his fist; his eyes flashed with anger.",
  "rule": "Two independent clauses with no conjunction need a semicolon (a comma alone is a splice). A semicolon should not be combined with and.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-1300-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I had some warm moments in that court___ I did not figure to myself that the man would be so pig-headed as to refuse to say anything at all.",
  "options": [
   ";",
   ",",
   "",
   "; and"
  ],
  "answer": ";",
  "fixed": "I had some warm moments in that court; I did not figure to myself that the man would be so pig-headed as to refuse to say anything at all.",
  "rule": "Two independent clauses with no conjunction need a semicolon, not a comma alone. Adding and after a semicolon would also be wrong.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-617-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Our captive followed___ I brought up the rear with the revolver.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "Our captive followed, and I brought up the rear with the revolver.",
  "rule": "A comma goes before and when it joins two independent clauses. 'Our captive followed' and 'I brought up the rear' are each complete. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-1337-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot, who was watching me intently___ gave a sigh.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Poirot, who was watching me intently, gave a sigh.",
  "rule": "A nonessential clause needs commas on both sides. 'Who was watching me intently' is removable, so a comma must close it before the verb 'gave'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-199-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "We work to attain an object, and the object gained___ we find that what we miss is the daily toil.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "We work to attain an object, and the object gained, we find that what we miss is the daily toil.",
  "rule": "An introductory phrase is followed by a comma. 'The object gained' sets the time, and the comma separates it from the main clause 'we find'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-720-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When she saw us___ the colour left her cheeks, leaving her deathly white, and her eyes widened with apprehension.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When she saw us, the colour left her cheeks, leaving her deathly white, and her eyes widened with apprehension.",
  "rule": "Put a comma after an introductory dependent clause. 'When she saw us' cannot stand alone, so a comma separates it from 'the colour left her cheeks'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-2400-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Katherine had come over with her friends___ they had run into Knighton and Poirot almost immediately on arrival.",
  "options": [
   ", and",
   " and",
   " and,",
   ": and"
  ],
  "answer": ", and",
  "fixed": "Katherine had come over with her friends, and they had run into Knighton and Poirot almost immediately on arrival.",
  "rule": "Use a comma before and when it joins two independent clauses. Each half has its own subject and verb. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-3262-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then he made a movement___ Poirot flung up his hand in a warning gesture.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Then he made a movement, but Poirot flung up his hand in a warning gesture.",
  "rule": "Two independent clauses joined by but need a comma before but. Each side has its own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-3218-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "But Poirot's flood of language had suddenly stopped dead___ he had the appearance of a man turned to stone.",
  "options": [
   ", and",
   " and",
   " and,",
   "; and,"
  ],
  "answer": ", and",
  "fixed": "But Poirot's flood of language had suddenly stopped dead, and he had the appearance of a man turned to stone.",
  "rule": "A comma comes before and when it joins two independent clauses. Both halves here can stand alone as sentences. Test: cover \"and\" and read what follows. It could stand alone as a sentence, so the comma goes before \"and\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-911-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He was outwardly calm___ I noticed his hands, which from long force of habit were mechanically straightening the spill vases on the mantelpiece, were shaking violently.",
  "options": [
   ", but",
   " but",
   " but,",
   ": but"
  ],
  "answer": ", but",
  "fixed": "He was outwardly calm, but I noticed his hands, which from long force of habit were mechanically straightening the spill vases on the mantelpiece, were shaking violently.",
  "rule": "Put a comma before but when it joins two independent clauses. 'He was outwardly calm' and 'I noticed his hands' are both complete. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-750-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Mr. Ryland usually entertained a large party over the week-end___ the middle of the week was comparatively quiet.",
  "options": [
   ", but",
   " but",
   " but,",
   "; but,"
  ],
  "answer": ", but",
  "fixed": "Mr. Ryland usually entertained a large party over the week-end, but the middle of the week was comparatively quiet.",
  "rule": "A comma goes before but when it links two independent clauses. Each side of but has its own subject and verb. Test: cover \"but\" and read what follows. It could stand alone as a sentence, so the comma goes before \"but\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1582-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Suddenly, as the car slowed down___ I recognized that we were close to Hendon Aerodrome.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Suddenly, as the car slowed down, I recognized that we were close to Hendon Aerodrome.",
  "rule": "An introductory clause (\"as the car slowed down\") is followed by a comma before the main clause. The comma after \"Suddenly\" is already there, so this comma closes the interrupting clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-1002-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "His hand, which had stolen to his clothes-brush___ stayed its course.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "His hand, which had stolen to his clothes-brush, stayed its course.",
  "rule": "A nonessential phrase such as \"which had stolen to his clothes-brush\" needs commas on both sides. Without the second comma, the subject \"hand\" is cut off from its verb \"stayed.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-72824-340-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Ruth returned the stones to their case___ then, jumping up, she flung her arms round her father's neck.",
  "options": [
   ";",
   ",",
   "",
   ":"
  ],
  "answer": ";",
  "fixed": "Ruth returned the stones to their case; then, jumping up, she flung her arms round her father's neck.",
  "rule": "Two independent clauses can be joined by a semicolon. A comma alone would be a comma splice, and no punctuation would be a run-on.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-1513-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "You advise Madame to seek a divorce___ she agrees; you consult your solicitors.",
  "options": [
   ";",
   ",",
   "",
   ":"
  ],
  "answer": ";",
  "fixed": "You advise Madame to seek a divorce; she agrees; you consult your solicitors.",
  "rule": "Independent clauses with no conjunction between them are joined with a semicolon. A comma would create a comma splice.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-72824-1074-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "They went out into the corridor, and M. Caux unlocks the door of the dead woman's compartment. The blinds on the far side had been drawn half-way up to admit light.",
  "fixed": "They went out into the corridor, and M. Caux unlocked the door of the dead woman's compartment. The blinds on the far side had been drawn half-way up to admit light.",
  "targetWords": [
   "unlocks"
  ],
  "options": [
   "unlocked",
   "unlocks",
   "will unlock",
   "is unlocking"
  ],
  "answer": "unlocked",
  "hint1": "Look at the verbs in the first clause and compare their tense.",
  "rule": "Keep verb tense consistent when events happen in the same time frame. The first clause says they went, so the second action must also be past tense: unlocked.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-69087-1594-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I went to see a couple of patients and arrive home about six o’clock. Caroline was sitting beside the wreck of tea things.",
  "fixed": "I went to see a couple of patients and arrived home about six o’clock. Caroline was sitting beside the wreck of tea things.",
  "targetWords": [
   "arrive"
  ],
  "options": [
   "arrived",
   "arrive",
   "arrives",
   "will arrive"
  ],
  "answer": "arrived",
  "hint1": "The two actions joined by 'and' belong to the same moment in the past.",
  "rule": "Verbs joined by 'and' should match in tense. 'Went' is past, so the second verb must be past: arrived.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-61262-396-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Poirot stepped forward and, with many apologies, explained that he had left his stick in the hall. Rather reluctantly, it seemed to me, Mrs. Maltravers makes the necessary introduction.",
  "fixed": "Poirot stepped forward and, with many apologies, explained that he had left his stick in the hall. Rather reluctantly, it seemed to me, Mrs. Maltravers made the necessary introduction.",
  "targetWords": [
   "makes"
  ],
  "options": [
   "made",
   "makes",
   "is making",
   "will make"
  ],
  "answer": "made",
  "hint1": "Which verb does not fit the past-tense story?",
  "rule": "A narrative told in the past should keep its verbs in the past unless time changes. 'Stepped' and 'explained' are past, so 'made' is correct.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-58866-2111-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was only a few steps from the theatre to the hotel. I went up to the sitting-room, ordered a whisky and soda, and sit drinking it, staring meditatively into the empty grate.",
  "fixed": "It was only a few steps from the theatre to the hotel. I went up to the sitting-room, ordered a whisky and soda, and sat drinking it, staring meditatively into the empty grate.",
  "targetWords": [
   "sit"
  ],
  "options": [
   "sat",
   "sit",
   "sits",
   "will sit"
  ],
  "answer": "sat",
  "hint1": "Check each verb in the list of three actions.",
  "rule": "Items in a series must share the same tense. 'Went' and 'ordered' are past, so the third verb should be 'sat'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-2324-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Short as the time had been, I am shocked at the change that had taken place in the young prisoner. His cheeks had fallen in, there were deep black circles round his eyes, and he looked haggard and distraught, as one who had wooed sleep in vain for several nights.",
  "fixed": "Short as the time had been, I was shocked at the change that had taken place in the young prisoner. His cheeks had fallen in, there were deep black circles round his eyes, and he looked haggard and distraught, as one who had wooed sleep in vain for several nights.",
  "targetWords": [
   "am"
  ],
  "options": [
   "was",
   "am",
   "will be",
   "have been"
  ],
  "answer": "was",
  "hint1": "The rest of the passage describes a past scene.",
  "rule": "Do not shift tense without a reason. Everything around this verb is past, so the narrator's reaction must be 'was shocked'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-61262-1645-3",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He had not been to the post office; nor had he been seen passing through the village. At the station they are positive he had not departed by any train.",
  "fixed": "He had not been to the post office; nor had he been seen passing through the village. At the station they were positive he had not departed by any train.",
  "targetWords": [
   "are"
  ],
  "options": [
   "were",
   "are",
   "will be",
   "have been"
  ],
  "answer": "were",
  "hint1": "Look at the time frame of the surrounding verbs.",
  "rule": "Keep the tense consistent with the surrounding past events. The station staff gave their answer in the past, so use 'were positive'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-58866-918-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Secretly, I was not dissatisfied with her collapse. It proves that she was not quite so callous as I had thought her.",
  "fixed": "Secretly, I was not dissatisfied with her collapse. It proved that she was not quite so callous as I had thought her.",
  "targetWords": [
   "proves"
  ],
  "options": [
   "proved",
   "proves",
   "will prove",
   "is proving"
  ],
  "answer": "proved",
  "hint1": "Which verb is out of step with 'was' and 'had thought'?",
  "rule": "A single past event should be described with past-tense verbs throughout. The collapse happened earlier, so it 'proved' something.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-72824-2306-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Derek Kettering was already conscious of a distinct longing to kick the Count bodily out of the room. It was only the realization that scandal would be unfortunate just at present that restrains him.",
  "fixed": "Derek Kettering was already conscious of a distinct longing to kick the Count bodily out of the room. It was only the realization that scandal would be unfortunate just at present that restrained him.",
  "targetWords": [
   "restrains"
  ],
  "options": [
   "restrained",
   "restrains",
   "will restrain",
   "is restraining"
  ],
  "answer": "restrained",
  "hint1": "The sentence begins with 'It was'. Which verb does not match?",
  "rule": "Verbs in the same past-time story should agree in tense. 'Was' sets the scene in the past, so the ending must be 'restrained'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-58866-1661-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He takes from his pocket a small faded newspaper cutting. It was the reproduction of a woman’s photograph.",
  "fixed": "He took from his pocket a small faded newspaper cutting. It was the reproduction of a woman’s photograph.",
  "targetWords": [
   "takes"
  ],
  "options": [
   "took",
   "takes",
   "is taking",
   "will take"
  ],
  "answer": "took",
  "hint1": "Compare the first verb with 'was' in the next sentence.",
  "rule": "Consecutive sentences about the same moment should use the same tense. 'Was' is past, so the first verb must be 'took'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-266-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "John Ingles did not delay us more than a couple of minutes, and soon we are in the train moving out of Paddington bound for the West Country. Hoppaton was a small village clustering in a hollow right on the fringe of the moorland.",
  "fixed": "John Ingles did not delay us more than a couple of minutes, and soon we were in the train moving out of Paddington bound for the West Country. Hoppaton was a small village clustering in a hollow right on the fringe of the moorland.",
  "targetWords": [
   "are"
  ],
  "options": [
   "were",
   "are",
   "will be",
   "have been"
  ],
  "answer": "were",
  "hint1": "The first clause says 'did not delay'. What tense is that?",
  "rule": "A comma plus 'and' joins two independent clauses, and both should describe the same time. Because the first clause is past, the second needs 'were'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-2444-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Katherine looks at him with a troubled face. She was aware at once of something new in his manner, some hidden excitement that betrayed itself in a hundred different infinitesimal signs.",
  "fixed": "Katherine looked at him with a troubled face. She was aware at once of something new in his manner, some hidden excitement that betrayed itself in a hundred different infinitesimal signs.",
  "targetWords": [
   "looks"
  ],
  "options": [
   "looked",
   "looks",
   "is looking",
   "will look"
  ],
  "answer": "looked",
  "hint1": "Compare the first verb with 'was' and 'betrayed'.",
  "rule": "Do not shift from past to present without a reason. The next sentence is clearly past, so the first should be 'looked'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-58866-579-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She took her hand away and looked down at the dead man. Then the marvellous self-control which had upheld her so far deserts her.",
  "fixed": "She took her hand away and looked down at the dead man. Then the marvellous self-control which had upheld her so far deserted her.",
  "targetWords": [
   "deserts"
  ],
  "options": [
   "deserted",
   "deserts",
   "will desert",
   "is deserting"
  ],
  "answer": "deserted",
  "hint1": "Look at the main verbs of the first sentence.",
  "rule": "A sequence of events in a story keeps one tense. 'Took' and 'looked' are past, and 'Then' continues the sequence, so use 'deserted'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-1678-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And then, just as public interest was beginning to die down, a startling development occurs. Madame Beroldy was arrested and charged with the murder of her husband.",
  "fixed": "And then, just as public interest was beginning to die down, a startling development occurred. Madame Beroldy was arrested and charged with the murder of her husband.",
  "targetWords": [
   "occurs"
  ],
  "options": [
   "occurred",
   "occurs",
   "will occur",
   "is occurring"
  ],
  "answer": "occurred",
  "hint1": "The clause in the middle uses 'was beginning'.",
  "rule": "The interrupting clause 'was beginning' is past, and the next sentence is past, so the main verb must be past: 'occurred'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-863-2384-12",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She determined to get hold of that paper at all costs, and in this resolution chance came to her aid. She happens to pick up the key of Mrs. Inglethorp’s despatch-case, which had been lost that morning.",
  "fixed": "She determined to get hold of that paper at all costs, and in this resolution chance came to her aid. She happened to pick up the key of Mrs. Inglethorp’s despatch-case, which had been lost that morning.",
  "targetWords": [
   "happens"
  ],
  "options": [
   "happened",
   "happens",
   "will happen",
   "is happening"
  ],
  "answer": "happened",
  "hint1": "Which verb disagrees with 'determined' and 'came'?",
  "rule": "Keep one tense for a chain of past events. The key was found after she 'determined' and chance 'came', so use 'happened'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-58866-2473-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "After examining the patient, he gives it as his opinion that it was simply a case of nerve strain. With perfect rest and quiet, the lad might be almost restored by the next day, but, if excited, there was a chance of brain fever.",
  "fixed": "After examining the patient, he gave it as his opinion that it was simply a case of nerve strain. With perfect rest and quiet, the lad might be almost restored by the next day, but, if excited, there was a chance of brain fever.",
  "targetWords": [
   "gives"
  ],
  "options": [
   "gave",
   "gives",
   "will give",
   "is giving"
  ],
  "answer": "gave",
  "hint1": "What tense is 'was' later in the same sentence?",
  "rule": "Verbs in one sentence about the same event must match. The opinion 'was' a case of strain, so the doctor 'gave' it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-683-4",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Our first proceeding is to make a considerable change in our appearance. Poirot had brought the materials for this with him in a small case.",
  "fixed": "Our first proceeding was to make a considerable change in our appearance. Poirot had brought the materials for this with him in a small case.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The next sentence uses 'had brought'.",
  "rule": "Do not slip into the present when the story is told in the past. Poirot 'had brought' materials earlier, so the proceeding 'was' a change.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-863-165-3",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "We were all busy during the morning arranging and decorating the Hall in the village where it was to take place. We had a late luncheon and spend the afternoon resting in the garden.",
  "fixed": "We were all busy during the morning arranging and decorating the Hall in the village where it was to take place. We had a late luncheon and spent the afternoon resting in the garden.",
  "targetWords": [
   "spend"
  ],
  "options": [
   "spent",
   "spend",
   "will spend",
   "are spending"
  ],
  "answer": "spent",
  "hint1": "The verb after 'and' should match 'had'.",
  "rule": "Verbs in a compound predicate share one tense. 'Had' is past, so the second verb must be 'spent'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-72824-959-4",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "When they arrived at the Gare de Lyon, she was glad to get out and walk up and down the platform. The keen cold air is refreshing after the steam-heated train.",
  "fixed": "When they arrived at the Gare de Lyon, she was glad to get out and walk up and down the platform. The keen cold air was refreshing after the steam-heated train.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The air is being described at the moment she got out.",
  "rule": "Describe the same scene in the same tense. She 'arrived' and 'was glad' in the past, so the air 'was' refreshing. Also, put a comma after an introductory clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-69087-2649-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He was not deceived by Blunt’s valiant lie any more than we had been. Our way back to the village is punctuated by his complaints.",
  "fixed": "He was not deceived by Blunt’s valiant lie any more than we had been. Our way back to the village was punctuated by his complaints.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Check the tense of the first sentence.",
  "rule": "A past-tense story should not drift into the present. The walk back already happened, so use 'was punctuated'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-1718-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "By the beginning of May I had mapped out a plan of campaign. I feel that I could not do better than keep Poirot's scheme of advertising for any information respecting Claud Darrell.",
  "fixed": "By the beginning of May I had mapped out a plan of campaign. I felt that I could not do better than keep Poirot's scheme of advertising for any information respecting Claud Darrell.",
  "targetWords": [
   "feel"
  ],
  "options": [
   "felt",
   "feel",
   "will feel",
   "am feeling"
  ],
  "answer": "felt",
  "hint1": "Look at 'had mapped' and 'could not' in the same passage.",
  "rule": "Keep the narrator's verbs in one time frame. The planning happened in the past, so the thought is 'felt'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-61262-205-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Half an hour later, we three were assembled in the great drawing-room awaiting the lady. It is already a few minutes past the dinner hour.",
  "fixed": "Half an hour later, we three were assembled in the great drawing-room awaiting the lady. It was already a few minutes past the dinner hour.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "'Half an hour later' sets the time of the story.",
  "rule": "Describing the same moment requires the same tense. They 'were assembled' in the past, so it 'was' past the dinner hour.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-69087-2967-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I look at him, slightly puzzled by the remark. He was leaning back in the chair, his eyes half closed, the tips of his fingers just touching each other.",
  "fixed": "I looked at him, slightly puzzled by the remark. He was leaning back in the chair, his eyes half closed, the tips of his fingers just touching each other.",
  "targetWords": [
   "look"
  ],
  "options": [
   "looked",
   "look",
   "will look",
   "am looking"
  ],
  "answer": "looked",
  "hint1": "Compare the first verb to 'was leaning'.",
  "rule": "Do not switch tense for no reason. The next sentence is past, so the narrator 'looked' at him.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-863-967-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I privately think that Poirot was rather too much given to these fantastic ideas. In this case, surely, the truth was only too plain and apparent.",
  "fixed": "I privately thought that Poirot was rather too much given to these fantastic ideas. In this case, surely, the truth was only too plain and apparent.",
  "targetWords": [
   "think"
  ],
  "options": [
   "thought",
   "think",
   "will think",
   "have thought"
  ],
  "answer": "thought",
  "hint1": "Look at 'was' in the same sentence.",
  "rule": "A main verb and the verb in its 'that' clause should fit the same time. 'Was' is past, so the narrator 'thought'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-58866-2113-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She stands there, the cloak she had wrapped round her stage dress slipping from her shoulders. I saw the whiteness of her cheeks under the rouge and heard the terror in her voice.",
  "fixed": "She stood there, the cloak she had wrapped round her stage dress slipping from her shoulders. I saw the whiteness of her cheeks under the rouge and heard the terror in her voice.",
  "targetWords": [
   "stands"
  ],
  "options": [
   "stood",
   "stands",
   "will stand",
   "is standing"
  ],
  "answer": "stood",
  "hint1": "What tense are 'saw' and 'heard'?",
  "rule": "Keep tense steady when describing a single scene. The narrator 'saw' and 'heard' in the past, so she 'stood' there.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-863-28-3",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I feel I had suddenly strayed into another world. As we turned in at the lodge gates, John said:",
  "fixed": "I felt I had suddenly strayed into another world. As we turned in at the lodge gates, John said:",
  "targetWords": [
   "feel"
  ],
  "options": [
   "felt",
   "feel",
   "will feel",
   "am feeling"
  ],
  "answer": "felt",
  "hint1": "Look at 'had strayed' and 'turned'.",
  "rule": "Verbs in one memory should share a time frame. The straying and the turning happened in the past, so the feeling was 'felt'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-58866-905-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I walked over to the body and gently pulled down the sheet as M. Bex had done the preceding afternoon. A little gasping sound escapes from the girl’s lips, and I turned and looked at her.",
  "fixed": "I walked over to the body and gently pulled down the sheet as M. Bex had done the preceding afternoon. A little gasping sound escaped from the girl’s lips, and I turned and looked at her.",
  "targetWords": [
   "escapes"
  ],
  "options": [
   "escaped",
   "escapes",
   "will escape",
   "is escaping"
  ],
  "answer": "escaped",
  "hint1": "Compare it to 'turned' and 'looked' later in the sentence.",
  "rule": "Both clauses joined by ', and' tell consecutive past events, so use one tense. The sound 'escaped' before I turned.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-1126-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Just for a moment, I had the uncanny sensation that the dead man had come to life again. Then I realize that this dark head was untouched with grey, and that, in point of fact, it was a mere boy who now burst in among us with so little ceremony.",
  "fixed": "Just for a moment, I had the uncanny sensation that the dead man had come to life again. Then I realized that this dark head was untouched with grey, and that, in point of fact, it was a mere boy who now burst in among us with so little ceremony.",
  "targetWords": [
   "realize"
  ],
  "options": [
   "realized",
   "realize",
   "will realize",
   "am realizing"
  ],
  "answer": "realized",
  "hint1": "'Then' continues the story begun by 'had'.",
  "rule": "A sequence of past events keeps past-tense verbs. 'Had' starts the story in the past, so 'Then I realized' is correct. Use a comma after the introductory phrase.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-863-427-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Next, he examined the framework of the door we had broken in, assuring himself that the bolt had really been shot. Then he goes to the door opposite leading into Cynthia’s room.",
  "fixed": "Next, he examined the framework of the door we had broken in, assuring himself that the bolt had really been shot. Then he went to the door opposite leading into Cynthia’s room.",
  "targetWords": [
   "goes"
  ],
  "options": [
   "went",
   "goes",
   "will go",
   "is going"
  ],
  "answer": "went",
  "hint1": "Check the tense of 'examined'.",
  "rule": "Steps in a sequence ('Next', 'Then') keep one tense. 'Examined' is past, so he 'went' to the next door.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-69087-1023-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "There was something almost indescribable in the way he said those last words. I feel that he was looking at the case from some peculiar angle of his own, and what he saw I could not tell.",
  "fixed": "There was something almost indescribable in the way he said those last words. I felt that he was looking at the case from some peculiar angle of his own, and what he saw I could not tell.",
  "targetWords": [
   "feel"
  ],
  "options": [
   "felt",
   "feel",
   "will feel",
   "am feeling"
  ],
  "answer": "felt",
  "hint1": "Look at 'said' and 'could not tell'.",
  "rule": "Stay in one tense for a past moment. The words were said in the past, so the narrator 'felt' something then.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-462-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "That was all that could be elicited from Mrs. Halliday. We hurry back to London, and the following day saw us en route for the Continent.",
  "fixed": "That was all that could be elicited from Mrs. Halliday. We hurried back to London, and the following day saw us en route for the Continent.",
  "targetWords": [
   "hurry"
  ],
  "options": [
   "hurried",
   "hurry",
   "will hurry",
   "are hurrying"
  ],
  "answer": "hurried",
  "hint1": "The clause after ', and' uses 'saw'.",
  "rule": "Two independent clauses joined by ', and' about the same trip should share a tense. 'Saw' is past, so 'hurried' is correct.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-70114-39-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Against the wall stood a vast ark of a trunk of prehistoric design. Near to it are placed a number of suit-cases, ranged neatly in order of size from large to small.",
  "fixed": "Against the wall stood a vast ark of a trunk of prehistoric design. Near to it were placed a number of suit-cases, ranged neatly in order of size from large to small.",
  "targetWords": [
   "are"
  ],
  "options": [
   "were",
   "are",
   "will be",
   "have been"
  ],
  "answer": "were",
  "hint1": "The first sentence uses 'stood'.",
  "rule": "Describing one scene means one tense. 'Stood' is past, so the suit-cases 'were' placed, and 'were' also agrees with the plural 'suit-cases'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-61262-1924-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The problem presented to us by Miss Violet Marsh made rather a pleasant change from our usual routine work. Poirot had received a brisk and business-like note from the lady asking for an appointment, and he replies asking her to call upon him at eleven o’clock the following day.",
  "fixed": "The problem presented to us by Miss Violet Marsh made rather a pleasant change from our usual routine work. Poirot had received a brisk and business-like note from the lady asking for an appointment, and he had replied asking her to call upon him at eleven o’clock the following day.",
  "targetWords": [
   "replies"
  ],
  "options": [
   "had replied",
   "replies",
   "will reply",
   "is replying"
  ],
  "answer": "had replied",
  "hint1": "Look at the verbs that tell what Poirot did after the note arrived.",
  "rule": "Keep verb tense consistent when the events all happened in the past. Here the note had been received and Poirot had replied, so the present-tense \"replies\" does not fit.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-70114-1877-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Several big blue motor-cars were waiting in the central square of the town, and we three get into one of them. Poirot, notwithstanding the heat of the day, was muffled to the eyes in greatcoat and scarf.",
  "fixed": "Several big blue motor-cars were waiting in the central square of the town, and we three got into one of them. Poirot, notwithstanding the heat of the day, was muffled to the eyes in greatcoat and scarf.",
  "targetWords": [
   "get"
  ],
  "options": [
   "got",
   "get",
   "will get",
   "are getting"
  ],
  "answer": "got",
  "hint1": "The cars \"were waiting\" and Poirot \"was muffled\", so the story is told in the past.",
  "rule": "Keep verb tense consistent unless the time really changes. The surrounding verbs (were waiting, was muffled) are past tense, so \"get\" should be \"got\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-58866-1895-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Jack Renauld still stood in the hall, with a white dumb face, but as we came out of the salon, he looks up sharply. At the same moment there was the sound of a footfall on the staircase.",
  "fixed": "Jack Renauld still stood in the hall, with a white dumb face, but as we came out of the salon, he looked up sharply. At the same moment there was the sound of a footfall on the staircase.",
  "targetWords": [
   "looks"
  ],
  "options": [
   "looked",
   "looks",
   "will look",
   "has looked"
  ],
  "answer": "looked",
  "hint1": "Compare this verb with \"stood\" and \"came\" in the same sentence.",
  "rule": "Verbs describing events in the same past scene should stay in the past tense. \"Stood\" and \"came\" are past, so \"looks\" should be \"looked\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-72824-300-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He did not look at her as he says the last words. Had he done so, he might have seen the swift colour that came up in her face.",
  "fixed": "He did not look at her as he said the last words. Had he done so, he might have seen the swift colour that came up in her face.",
  "targetWords": [
   "says"
  ],
  "options": [
   "said",
   "says",
   "will say",
   "is saying"
  ],
  "answer": "said",
  "hint1": "The main verb of the sentence is \"did not look\".",
  "rule": "The two actions happened at the same past moment, so they need matching tenses. \"Did not look\" is past, so \"says\" should be \"said\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-72824-1159-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Lady Tamplin was rather disconcerted at this uncompromising refusal. She sighs and turned to the elucidation of further details.",
  "fixed": "Lady Tamplin was rather disconcerted at this uncompromising refusal. She sighed and turned to the elucidation of further details.",
  "targetWords": [
   "sighs"
  ],
  "options": [
   "sighed",
   "sighs",
   "will sigh",
   "is sighing"
  ],
  "answer": "sighed",
  "hint1": "Check the verb that \"and\" connects to \"sighs\".",
  "rule": "Verbs joined by \"and\" should share a tense. \"Turned\" is past, so \"sighs\" should be \"sighed\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-863-411-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "John looked puzzled, not quite understanding the portent of this cryptic saying. He hands the two keys which Dr. Bauerstein had given him to me.",
  "fixed": "John looked puzzled, not quite understanding the portent of this cryptic saying. He handed the two keys which Dr. Bauerstein had given him to me.",
  "targetWords": [
   "hands"
  ],
  "options": [
   "handed",
   "hands",
   "will hand",
   "is handing"
  ],
  "answer": "handed",
  "hint1": "The previous sentence says John \"looked\" puzzled.",
  "rule": "A narrative told in the past should not slip into the present for the next action. After \"looked\", the sentence needs \"handed\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-69087-92-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I tell her firmly that her whole idea was nonsense. I was all the more firm because I secretly agreed with some part, at least, of what she had said.",
  "fixed": "I told her firmly that her whole idea was nonsense. I was all the more firm because I secretly agreed with some part, at least, of what she had said.",
  "targetWords": [
   "tell"
  ],
  "options": [
   "told",
   "tell",
   "will tell",
   "have told"
  ],
  "answer": "told",
  "hint1": "Look at the verb in the clause that follows, \"was nonsense\".",
  "rule": "Keep verb tense consistent when the events happened at the same time in the past. \"Was nonsense\" and \"was all the more firm\" are past, so \"tell\" should be \"told\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-783-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I had gone some way down the garden when I chance to look over my shoulder. Mr. Ryland was just stepping out from his study window into the garden.",
  "fixed": "I had gone some way down the garden when I chanced to look over my shoulder. Mr. Ryland was just stepping out from his study window into the garden.",
  "targetWords": [
   "chance"
  ],
  "options": [
   "chanced",
   "chance",
   "will chance",
   "am chancing"
  ],
  "answer": "chanced",
  "hint1": "The sentence begins with \"had gone\" and the next one uses \"was\".",
  "rule": "A past-tense account needs consistent past verbs. Since the narrator \"had gone\" down the garden, the later action must be \"chanced\", not \"chance\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-58866-1683-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And then, towards the close of the trial, a letter, posted in Paris, was sent to the Public Prosecutor. It was from Georges Conneau and, without revealing his whereabouts, it contains a full confession of the crime.",
  "fixed": "And then, towards the close of the trial, a letter, posted in Paris, was sent to the Public Prosecutor. It was from Georges Conneau and, without revealing his whereabouts, it contained a full confession of the crime.",
  "targetWords": [
   "contains"
  ],
  "options": [
   "contained",
   "contains",
   "will contain",
   "has contained"
  ],
  "answer": "contained",
  "hint1": "The letter was \"sent\" during the trial, long ago in the story's time.",
  "rule": "Do not switch tense without a change in time. The letter \"was sent\" and \"was from\" Conneau, so \"contains\" should be \"contained\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-1675-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The woman who came daily to clean and cook for the Beroldys was surprised to find the door of the apartment standing wide open. Hearing faint moans issuing from the bedroom, she goes in.",
  "fixed": "The woman who came daily to clean and cook for the Beroldys was surprised to find the door of the apartment standing wide open. Hearing faint moans issuing from the bedroom, she went in.",
  "targetWords": [
   "goes"
  ],
  "options": [
   "went",
   "goes",
   "will go",
   "is going"
  ],
  "answer": "went",
  "hint1": "The first sentence says she \"was surprised\".",
  "rule": "Events in a past-tense narrative should stay in the past. Since the woman \"was surprised\", her next action is \"went in\", not \"goes in\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-1258-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "As I did so, I thought of confiding in Mrs. Pearson, at any rate as far as Cinderella's disappearance went. She was on the landing, but close behind her was the little maid-servant, and I hesitate.",
  "fixed": "As I did so, I thought of confiding in Mrs. Pearson, at any rate as far as Cinderella's disappearance went. She was on the landing, but close behind her was the little maid-servant, and I hesitated.",
  "targetWords": [
   "hesitate"
  ],
  "options": [
   "hesitated",
   "hesitate",
   "will hesitate",
   "have hesitated"
  ],
  "answer": "hesitated",
  "hint1": "Compare the last verb with \"did\", \"thought\", and \"was\".",
  "rule": "Keep the same tense for events that happen in sequence in the past. Everything else here is past, so \"hesitate\" should be \"hesitated\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-149-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Presently he crosses the Seine and came into the richer areas of the city. It was some twenty minutes later that he came to a stop before a certain house in a quiet but aristocratic thoroughfare.",
  "fixed": "Presently he crossed the Seine and came into the richer areas of the city. It was some twenty minutes later that he came to a stop before a certain house in a quiet but aristocratic thoroughfare.",
  "targetWords": [
   "crosses"
  ],
  "options": [
   "crossed",
   "crosses",
   "will cross",
   "is crossing"
  ],
  "answer": "crossed",
  "hint1": "Look at the verb joined to it by \"and\".",
  "rule": "Verbs in a compound predicate must match in tense. \"Came\" is past, so \"crosses\" should be \"crossed\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-70114-684-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was close on eleven o'clock when we found ourselves once more in the neighbourhood of Madame Olivier's villa. We look up and down the road before slipping into the alleyway.",
  "fixed": "It was close on eleven o'clock when we found ourselves once more in the neighbourhood of Madame Olivier's villa. We looked up and down the road before slipping into the alleyway.",
  "targetWords": [
   "look"
  ],
  "options": [
   "looked",
   "look",
   "will look",
   "have looked"
  ],
  "answer": "looked",
  "hint1": "The first sentence tells you when the story happens. Which verb does not match that time?",
  "rule": "Keep verb tense consistent when the events happen at the same time. The first sentence is in the past (was, found), so the action in the next sentence should be past too: looked.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-1204-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Most of Lady Tamplin's guests had arrived, and since noise was the essential of Lady Tamplin's parties, the din was already terrific. Chubby rushes up to Katherine, pressed a cocktail upon her, and took her under his wing.",
  "fixed": "Most of Lady Tamplin's guests had arrived, and since noise was the essential of Lady Tamplin's parties, the din was already terrific. Chubby rushed up to Katherine, pressed a cocktail upon her, and took her under his wing.",
  "targetWords": [
   "rushes"
  ],
  "options": [
   "rushed",
   "rushes",
   "will rush",
   "is rushing"
  ],
  "answer": "rushed",
  "hint1": "Look at the other verbs in the list of Chubby's actions.",
  "rule": "Items in a series should share a tense. Pressed and took are past, so the first action must be past as well: rushed.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-70114-1519-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "A taxi took us to the hospital in less than ten minutes. We ask for Miss Monro and were taken immediately to the accident ward.",
  "fixed": "A taxi took us to the hospital in less than ten minutes. We asked for Miss Monro and were taken immediately to the accident ward.",
  "targetWords": [
   "ask"
  ],
  "options": [
   "asked",
   "ask",
   "will ask",
   "are asking"
  ],
  "answer": "asked",
  "hint1": "Compare the first verb of this compound predicate with the second one.",
  "rule": "Verbs joined by and should match in tense. Were taken is past, and the previous sentence is past, so the first verb should be asked.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-61262-1584-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "As we drew up, Major Norman jumped out, and a plain-clothes man took his place. He confers with Poirot for a few minutes and then went off briskly.",
  "fixed": "As we drew up, Major Norman jumped out, and a plain-clothes man took his place. He conferred with Poirot for a few minutes and then went off briskly.",
  "targetWords": [
   "confers"
  ],
  "options": [
   "conferred",
   "confers",
   "will confer",
   "has conferred"
  ],
  "answer": "conferred",
  "hint1": "Which verb is joined by and to went off?",
  "rule": "Keep tense consistent in a sequence of actions. Went off and the surrounding sentence are past, so the action joined to went must also be past: conferred.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-61262-1689-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "We heard nothing of Japp until the following evening, when he walks in about nine o’clock. I saw at once by his expression that he was bursting with news of some kind.",
  "fixed": "We heard nothing of Japp until the following evening, when he walked in about nine o’clock. I saw at once by his expression that he was bursting with news of some kind.",
  "targetWords": [
   "walks"
  ],
  "options": [
   "walked",
   "walks",
   "will walk",
   "is walking"
  ],
  "answer": "walked",
  "hint1": "The evening being described is in the past, as shown by heard.",
  "rule": "Use the same tense for events that belong to the same past moment. We heard is past, so the clause about when Japp arrived must be walked.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-72824-61-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was close on midnight when a man crosses the Place de la Concorde. In spite of the handsome fur coat which garbed his meagre form, there was something essentially weak and paltry about him.",
  "fixed": "It was close on midnight when a man crossed the Place de la Concorde. In spite of the handsome fur coat which garbed his meagre form, there was something essentially weak and paltry about him.",
  "targetWords": [
   "crosses"
  ],
  "options": [
   "crossed",
   "crosses",
   "will cross",
   "is crossing"
  ],
  "answer": "crossed",
  "hint1": "Check the tense of was in the same sentence.",
  "rule": "Do not shift tense without a change in time. The sentence begins with was, and the next sentence uses there was, so the man crossed the square.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-61262-206-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Suddenly there was a low rustle, and Lady Yardly appears framed in the doorway, a radiant figure in a long white shimmering dress. Round the column of her neck was a rivulet of fire.",
  "fixed": "Suddenly there was a low rustle, and Lady Yardly appeared framed in the doorway, a radiant figure in a long white shimmering dress. Round the column of her neck was a rivulet of fire.",
  "targetWords": [
   "appears"
  ],
  "options": [
   "appeared",
   "appears",
   "will appear",
   "has appeared"
  ],
  "answer": "appeared",
  "hint1": "The two clauses joined by and happen in the same moment.",
  "rule": "Clauses joined by and that describe one moment need the same tense. There was is past, so Lady Yardly appeared.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-58866-227-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The man took it and, turning his head over his shoulder, whistled. In a few seconds a comrade joins him and was handed Poirot’s message.",
  "fixed": "The man took it and, turning his head over his shoulder, whistled. In a few seconds a comrade joined him and was handed Poirot’s message.",
  "targetWords": [
   "joins"
  ],
  "options": [
   "joined",
   "joins",
   "will join",
   "is joining"
  ],
  "answer": "joined",
  "hint1": "Look at the second verb in the pair joined by and.",
  "rule": "Paired verbs joined by and must agree in tense. Was handed is past, and the previous sentence is past, so the comrade joined him.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-72824-2487-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "When Knighton left Katherine, he goes in search of Hercule Poirot, whom he found in the Rooms, jauntily placing the minimum stake on the even numbers. As Knighton joined him, the number thirty-three turned up, and Poirot's stake was swept away.",
  "fixed": "When Knighton left Katherine, he went in search of Hercule Poirot, whom he found in the Rooms, jauntily placing the minimum stake on the even numbers. As Knighton joined him, the number thirty-three turned up, and Poirot's stake was swept away.",
  "targetWords": [
   "goes"
  ],
  "options": [
   "went",
   "goes",
   "will go",
   "has gone"
  ],
  "answer": "went",
  "hint1": "The clause before the comma sets the time frame.",
  "rule": "After an introductory clause in the past (left), the main verb should match unless the time changes. Nothing changes here, so he went, not he goes.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-69087-799-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She had hot cocoa waiting for me, and whilst I drank it, she extracts the whole history of the evening from me. I said nothing of the blackmailing business but contented myself with giving her the facts of the murder.",
  "fixed": "She had hot cocoa waiting for me, and whilst I drank it, she extracted the whole history of the evening from me. I said nothing of the blackmailing business but contented myself with giving her the facts of the murder.",
  "targetWords": [
   "extracts"
  ],
  "options": [
   "extracted",
   "extracts",
   "will extract",
   "has extracted"
  ],
  "answer": "extracted",
  "hint1": "Compare with drank earlier in the same sentence.",
  "rule": "Verbs describing the same past moment should share a tense. I drank it is past, so what she did while I drank must also be past: extracted.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-1806-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I blinked a little, for the room faced west and the afternoon sun was pouring in. Then my vision clears, and I saw a figure waiting to welcome me with outstretched hands.",
  "fixed": "I blinked a little, for the room faced west and the afternoon sun was pouring in. Then my vision cleared, and I saw a figure waiting to welcome me with outstretched hands.",
  "targetWords": [
   "clears"
  ],
  "options": [
   "cleared",
   "clears",
   "will clear",
   "has cleared"
  ],
  "answer": "cleared",
  "hint1": "The word Then shows a next step in a past sequence.",
  "rule": "A sequence of past events keeps one tense. Blinked and saw are past, so the event between them is cleared. Also, a comma goes before and when it joins two full clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-61262-695-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Roger Havering was a man of about forty, well set up and of smart appearance. His face, however, is haggard, and he was evidently labouring under great agitation.",
  "fixed": "Roger Havering was a man of about forty, well set up and of smart appearance. His face, however, was haggard, and he was evidently labouring under great agitation.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Check the verbs on either side of this one.",
  "rule": "Describing the same person at the same time requires the same tense. The sentence before and the clause after use was, so the face was haggard too.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-863-915-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He rushed like a madman from the room, and I follow him as soon as I had sufficiently recovered my wits. But by the time I had reached the top of the stairs, he was out of sight.",
  "fixed": "He rushed like a madman from the room, and I followed him as soon as I had sufficiently recovered my wits. But by the time I had reached the top of the stairs, he was out of sight.",
  "targetWords": [
   "follow"
  ],
  "options": [
   "followed",
   "follow",
   "will follow",
   "am following"
  ],
  "answer": "followed",
  "hint1": "Look at the verb that tells what the narrator did right after the other man rushed out.",
  "rule": "Keep verb tense consistent when events happen in the same past time frame. The sentence says he rushed out, so the narrator also followed him, not follow.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-61262-327-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was the doctor’s consulting hour, and for the moment there were no patients waiting for him. Dr. Bernard is an elderly man, high-shouldered and stooping, with a pleasant vagueness of manner.",
  "fixed": "It was the doctor’s consulting hour, and for the moment there were no patients waiting for him. Dr. Bernard was an elderly man, high-shouldered and stooping, with a pleasant vagueness of manner.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Compare the verb describing Dr. Bernard with the verbs in the first sentence.",
  "rule": "Stay in one tense when describing a scene set in the past. The first sentence uses was and were, so the description of Dr. Bernard should use was, not is.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-70114-989-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was Inspector Japp, and as there was room at our table, he comes and joined us. It was some time since either of us had seen him.",
  "fixed": "It was Inspector Japp, and as there was room at our table, he came and joined us. It was some time since either of us had seen him.",
  "targetWords": [
   "comes"
  ],
  "options": [
   "came",
   "comes",
   "will come",
   "is coming"
  ],
  "answer": "came",
  "hint1": "Two verbs share the subject he. One of them does not match the other.",
  "rule": "Verbs joined by and should share the same tense when the actions happen at the same time. Here he joined us, so the first verb must be came, not comes.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-70114-266-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was reached by a nine-mile drive from Moretonhamstead. It was about eight o'clock when we arrived, but as the month was July, the daylight is still abundant.",
  "fixed": "It was reached by a nine-mile drive from Moretonhamstead. It was about eight o'clock when we arrived, but as the month was July, the daylight was still abundant.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Check the verb about the daylight against the rest of the sentence.",
  "rule": "Do not shift into the present tense when the narration is set in the past. The sentence says we arrived and the month was July, so the daylight was still abundant.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-69087-546-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "His face was expressionless as ever, but I think I detected signs of emotion beneath the stolid mask. Geoffrey Raymond had joined us now and stood peering over Blunt’s shoulder at the body.",
  "fixed": "His face was expressionless as ever, but I thought I detected signs of emotion beneath the stolid mask. Geoffrey Raymond had joined us now and stood peering over Blunt’s shoulder at the body.",
  "targetWords": [
   "think"
  ],
  "options": [
   "thought",
   "think",
   "will think",
   "am thinking"
  ],
  "answer": "thought",
  "hint1": "The narrator is remembering a moment; what verb follows the one that is out of step?",
  "rule": "When the main action is in the past, a verb about the narrator's thinking must also be past. Here I thought I detected is consistent, while I think I detected mixes tenses.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-69087-114-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Revolving these and sundry other matters in my mind, I went mechanically on my round. I had no cases of special interest to attend, which was, perhaps, as well, for my thoughts return again and again to the mystery of Mrs. Ferrars’s death.",
  "fixed": "Revolving these and sundry other matters in my mind, I went mechanically on my round. I had no cases of special interest to attend, which was, perhaps, as well, for my thoughts returned again and again to the mystery of Mrs. Ferrars’s death.",
  "targetWords": [
   "return"
  ],
  "options": [
   "returned",
   "return",
   "will return",
   "are returning"
  ],
  "answer": "returned",
  "hint1": "Find the verb that explains why it was as well; its tense should match the narration.",
  "rule": "A story told in the past keeps its verbs in the past. Since I went and I had, the reason clause needs my thoughts returned, not return.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-863-106-5",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He looked up at my window as he passed, and I recognize him, though he had changed much in the fifteen years that had elapsed since we last met. It was John’s younger brother, Lawrence Cavendish.",
  "fixed": "He looked up at my window as he passed, and I recognized him, though he had changed much in the fifteen years that had elapsed since we last met. It was John’s younger brother, Lawrence Cavendish.",
  "targetWords": [
   "recognize"
  ],
  "options": [
   "recognized",
   "recognize",
   "will recognize",
   "am recognizing"
  ],
  "answer": "recognized",
  "hint1": "The man looked up and passed; what did the narrator do at that moment?",
  "rule": "Actions that happen at the same past moment need matching past tenses. He looked up and passed, so the narrator recognized him, not recognize.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-61262-147-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "When my friend returned, I enjoyed telling him the tale of what had occurred during his absence. He cross-questions me rather sharply over the details of our conversation, and I could read between the lines that he was not best pleased to have been absent.",
  "fixed": "When my friend returned, I enjoyed telling him the tale of what had occurred during his absence. He cross-questioned me rather sharply over the details of our conversation, and I could read between the lines that he was not best pleased to have been absent.",
  "targetWords": [
   "cross-questions"
  ],
  "options": [
   "cross-questioned",
   "cross-questions",
   "will cross-question",
   "is cross-questioning"
  ],
  "answer": "cross-questioned",
  "hint1": "The previous sentence is in the past, and so is the second half of this one.",
  "rule": "Do not slip into the present tense in the middle of a past-tense account. The friend returned and the narrator enjoyed the telling, so he cross-questioned me.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-58866-2518-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "We rejoined Cinderella and made our way rapidly in the direction of the Villa Geneviève. Poirot looks over his shoulder once at the lighted window and the profile of Marthe as she bent over her work.",
  "fixed": "We rejoined Cinderella and made our way rapidly in the direction of the Villa Geneviève. Poirot looked over his shoulder once at the lighted window and the profile of Marthe as she bent over her work.",
  "targetWords": [
   "looks"
  ],
  "options": [
   "looked",
   "looks",
   "will look",
   "has looked"
  ],
  "answer": "looked",
  "hint1": "Compare Poirot's verb with we rejoined and she bent.",
  "rule": "Keep the tense consistent unless the time really changes. The surrounding verbs are rejoined, made, and bent, so Poirot looked, not looks.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-905-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He leads the way through the house to the room where the tragedy had occurred--Mr. Paynter's study. It was a wide, low room, with book-lined walls and big leather arm-chairs.",
  "fixed": "He led the way through the house to the room where the tragedy had occurred--Mr. Paynter's study. It was a wide, low room, with book-lined walls and big leather arm-chairs.",
  "targetWords": [
   "leads"
  ],
  "options": [
   "led",
   "leads",
   "will lead",
   "is leading"
  ],
  "answer": "led",
  "hint1": "The tragedy had occurred and the next sentence says it was a room.",
  "rule": "Keep one time frame unless the action really changes time. The tragedy had already occurred and the room was described in the past, so he led the way.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-70114-1949-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "They came off in her hand, and then, indeed, the truth was plain. For this man's upper lip was disfigured by a small scar which completely alters the expression of the face.",
  "fixed": "They came off in her hand, and then, indeed, the truth was plain. For this man's upper lip was disfigured by a small scar which completely altered the expression of the face.",
  "targetWords": [
   "alters"
  ],
  "options": [
   "altered",
   "alters",
   "will alter",
   "has altered"
  ],
  "answer": "altered",
  "hint1": "Look at the verb that follows the word scar and compare it with was disfigured.",
  "rule": "Verbs describing the same past situation should be in the same tense. The lip was disfigured by a scar which altered the face, not alters.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-58866-622-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I saw at once that Giraud was prepared to be hostile. He resents the other being associated with him, and I felt that if he came across any clue of importance, he would be more than likely to keep it to himself.",
  "fixed": "I saw at once that Giraud was prepared to be hostile. He resented the other being associated with him, and I felt that if he came across any clue of importance, he would be more than likely to keep it to himself.",
  "targetWords": [
   "resents"
  ],
  "options": [
   "resented",
   "resents",
   "will resent",
   "has resented"
  ],
  "answer": "resented",
  "hint1": "The surrounding verbs are saw, was, and felt.",
  "rule": "Keep the tense consistent when the passage reports what the narrator saw and felt in the past. Giraud was hostile and he resented the other, not resents.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-1537-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The contents of drawers and cupboards are strewn all over the floor. Locks had been forced, and small tables had even been overthrown, so violent had been the searcher's haste.",
  "fixed": "The contents of drawers and cupboards were strewn all over the floor. Locks had been forced, and small tables had even been overthrown, so violent had been the searcher's haste.",
  "targetWords": [
   "are"
  ],
  "options": [
   "were",
   "are",
   "will be",
   "have been"
  ],
  "answer": "were",
  "hint1": "The following sentence describes earlier events with had been.",
  "rule": "The scene is described in the past, so the verb should be past. The contents were strewn over the floor, matching the later had been forced.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-58866-2108-3",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "When the curtain falls, there was a full meed of applause. Evidently, the Dulcibella Kids were a success.",
  "fixed": "When the curtain fell, there was a full meed of applause. Evidently, the Dulcibella Kids were a success.",
  "targetWords": [
   "falls"
  ],
  "options": [
   "fell",
   "falls",
   "will fall",
   "is falling"
  ],
  "answer": "fell",
  "hint1": "Compare the verb in the opening clause with there was.",
  "rule": "A clause and the main clause that tells what happened then must share a tense. There was applause, so the curtain fell, not falls.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-70114-687-4",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Like two helpless bundles, we were lifted up and carried along. To my intense astonishment, they take us towards the house and not away from it.",
  "fixed": "Like two helpless bundles, we were lifted up and carried along. To my intense astonishment, they took us towards the house and not away from it.",
  "targetWords": [
   "take"
  ],
  "options": [
   "took",
   "take",
   "will take",
   "are taking"
  ],
  "answer": "took",
  "hint1": "The previous sentence says we were lifted and carried.",
  "rule": "Narration of past events should not suddenly shift to the present. We were carried along, and they took us toward the house, not take.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-863-198-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Compared to John, he was an astoundingly difficult person to get to know. He is the opposite of his brother in almost every respect, being unusually shy and reserved.",
  "fixed": "Compared to John, he was an astoundingly difficult person to get to know. He was the opposite of his brother in almost every respect, being unusually shy and reserved.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Compare this verb with the one in the sentence before it, which describes the same man.",
  "rule": "Two sentences describing the same person at the same past time need the same tense. The first says he was, so the second should also say he was.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-70114-473-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She had a long pale face and wonderful dark eyes that burnt with a light almost fanatical. She looks more like a priestess of old than a modern Frenchwoman.",
  "fixed": "She had a long pale face and wonderful dark eyes that burnt with a light almost fanatical. She looked more like a priestess of old than a modern Frenchwoman.",
  "targetWords": [
   "looks"
  ],
  "options": [
   "looked",
   "looks",
   "will look",
   "has looked"
  ],
  "answer": "looked",
  "hint1": "The sentence right before it begins She had.",
  "rule": "A description of a past scene keeps its verbs in the past. She had a pale face and she looked like a priestess, not looks.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-3003-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Knighton, however, had a charm of manner which was not easily set aside, and after about ten minutes Miss Viner thaws perceptibly. Luncheon was a merry meal, and Ellen, or Helen, in a new pair of silk stockings devoid of ladders, performed prodigies of waiting.",
  "fixed": "Knighton, however, had a charm of manner which was not easily set aside, and after about ten minutes Miss Viner thawed perceptibly. Luncheon was a merry meal, and Ellen, or Helen, in a new pair of silk stockings devoid of ladders, performed prodigies of waiting.",
  "targetWords": [
   "thaws"
  ],
  "options": [
   "thawed",
   "thaws",
   "will thaw",
   "is thawing"
  ],
  "answer": "thawed",
  "hint1": "The phrase after about ten minutes describes a result in the past.",
  "rule": "Do not change tense inside a sentence that narrates past events. Knighton had a charm and, after ten minutes, Miss Viner thawed, not thaws.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-58866-660-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Giraud himself had been obviously delighted when Poirot declares that he had seen all he wanted. The last thing we observed, as we left the spot, was Giraud, crawling about on all fours, with a thoroughness in his search that I could not but admire.",
  "fixed": "Giraud himself had been obviously delighted when Poirot declared that he had seen all he wanted. The last thing we observed, as we left the spot, was Giraud, crawling about on all fours, with a thoroughness in his search that I could not but admire.",
  "targetWords": [
   "declares"
  ],
  "options": [
   "declared",
   "declares",
   "will declare",
   "is declaring"
  ],
  "answer": "declared",
  "hint1": "Giraud had been delighted at a past moment, and Poirot had seen all he wanted.",
  "rule": "A when-clause telling the cause of a past feeling needs a past tense. Giraud had been delighted when Poirot declared, not declares.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-72824-157-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He had a high domed forehead and a beautiful white beard. His manner has in it something ecclesiastical and benign.",
  "fixed": "He had a high domed forehead and a beautiful white beard. His manner had in it something ecclesiastical and benign.",
  "targetWords": [
   "has"
  ],
  "options": [
   "had",
   "has",
   "will have",
   "is having"
  ],
  "answer": "had",
  "hint1": "The first sentence also describes this man.",
  "rule": "Two descriptions of the same person in the same past scene should use the same tense. He had a forehead and a beard, so his manner had something ecclesiastical in it.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-58866-1490-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He was of medium height, swarthy of complexion, and possibly about fifty years of age. He is neatly dressed in a dark blue suit, well cut and probably made by an expensive tailor, but not new.",
  "fixed": "He was of medium height, swarthy of complexion, and possibly about fifty years of age. He was neatly dressed in a dark blue suit, well cut and probably made by an expensive tailor, but not new.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The first sentence describes the same dead man.",
  "rule": "A description of one person should stay in one tense. The first sentence says he was of medium height, so the second must say he was neatly dressed.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-1466-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And with that, he turned on his heel and left me without ceremony. Matters seem at a standstill at the Villa Geneviève.",
  "fixed": "And with that, he turned on his heel and left me without ceremony. Matters seemed at a standstill at the Villa Geneviève.",
  "targetWords": [
   "seem"
  ],
  "options": [
   "seemed",
   "seem",
   "will seem",
   "have seemed"
  ],
  "answer": "seemed",
  "hint1": "He turned and left, and then the narrator comments on how things stood.",
  "rule": "Keep the tense consistent when the narrator moves from one past event to a comment on that same time. He turned and left, and matters seemed at a standstill.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-69087-532-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Ackroyd is sitting as I had left him in the arm-chair before the fire. His head had fallen sideways, and clearly visible, just below the collar of his coat, was a shining piece of twisted metalwork.",
  "fixed": "Ackroyd was sitting as I had left him in the arm-chair before the fire. His head had fallen sideways, and clearly visible, just below the collar of his coat, was a shining piece of twisted metalwork.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The narrator says he had left him there, which is earlier in the past.",
  "rule": "A past-perfect verb like had left shows an earlier past, so the main verb must be past too. Ackroyd was sitting as I had left him, not is sitting.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-219-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And then one morning, about a week after the murder, he asked me if I would care to accompany him on a visit he wished to make. I was pleased, for I felt he was making a mistake in trying to work things out so entirely on his own, and I wish to discuss the case with him.",
  "fixed": "And then one morning, about a week after the murder, he asked me if I would care to accompany him on a visit he wished to make. I was pleased, for I felt he was making a mistake in trying to work things out so entirely on his own, and I wished to discuss the case with him.",
  "targetWords": [
   "wish"
  ],
  "options": [
   "wished",
   "wish",
   "will wish",
   "have wished"
  ],
  "answer": "wished",
  "hint1": "Look at the other verbs in this sentence: was, felt, was making.",
  "rule": "Verbs joined by and in a past-tense sentence should stay in the past. I was pleased, I felt, and I wished to discuss the case, not wish.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-2860-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot stared at her very hard, and under the directness of his ___ she blushed.",
  "options": [
   "scrutiny",
   "effrontery",
   "gallantry",
   "insistence"
  ],
  "answer": "scrutiny",
  "definitions": {
   "scrutiny": "close, careful examination",
   "effrontery": "shameless, insolent boldness",
   "gallantry": "courteous, chivalrous attentiveness",
   "insistence": "firm, repeated demand for something"
  },
  "fixed": "Poirot stared at her very hard, and under the directness of his scrutiny she blushed.",
  "rule": "Poirot 'stared at her very hard,' so 'the directness of his' close examination is what makes her blush.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-2571-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "When she did, it was with a ___ indifference of manner.",
  "options": [
   "haughty",
   "languid",
   "stoic",
   "nonchalant"
  ],
  "answer": "haughty",
  "definitions": {
   "haughty": "arrogantly proud",
   "languid": "slow and lacking energy",
   "stoic": "calmly enduring hardship without complaint",
   "nonchalant": "casually unbothered and at ease"
  },
  "fixed": "When she did, it was with a haughty indifference of manner.",
  "rule": "The phrase 'indifference of manner' shows she acts as if she is above the situation, which is arrogant pride.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-830-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It was all very well for Poirot to say that we were acquiring information all the time and gaining an insight into our adversaries' minds--I felt myself that I required some more ___ success than this.",
  "options": [
   "tangible",
   "decisive",
   "spectacular",
   "immediate"
  ],
  "answer": "tangible",
  "definitions": {
   "tangible": "real and concrete",
   "decisive": "settling a matter with a clear result",
   "spectacular": "dramatic and impressive to see",
   "immediate": "happening right away"
  },
  "fixed": "It was all very well for Poirot to say that we were acquiring information all the time and gaining an insight into our adversaries' minds--I felt myself that I required some more tangible success than this.",
  "rule": "The narrator is unhappy with 'information' and 'insight' and wants a more concrete, real success instead.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-223-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He stooped, and with a ___ produced an immense specimen of the tribe, which I duly accepted in the spirit in which it was offered.",
  "options": [
   "flourish",
   "swagger",
   "smirk",
   "shrug"
  ],
  "answer": "flourish",
  "definitions": {
   "flourish": "a showy, sweeping gesture",
   "swagger": "a bold, boastful way of walking",
   "smirk": "a smug, self-satisfied smile",
   "shrug": "a lifting of the shoulders to show doubt"
  },
  "fixed": "He stooped, and with a flourish produced an immense specimen of the tribe, which I duly accepted in the spirit in which it was offered.",
  "rule": "He 'produced an immense specimen' with a show-off gesture, so a dramatic display fits.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-550-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Sitting in a chair by the window was a ___ young fellow who looked in the last stages of exhaustion.",
  "options": [
   "haggard",
   "pallid",
   "disheveled",
   "lanky"
  ],
  "answer": "haggard",
  "definitions": {
   "haggard": "looking worn and exhausted",
   "pallid": "unhealthily pale and colorless",
   "disheveled": "untidy and messy in appearance",
   "lanky": "awkwardly tall and thin"
  },
  "fixed": "Sitting in a chair by the window was a haggard young fellow who looked in the last stages of exhaustion.",
  "rule": "He looks 'in the last stages of exhaustion,' so a worn, tired look fits.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-883-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot threw me a smile, swelled out his chest, and began in a ___ manner.",
  "options": [
   "pompous",
   "didactic",
   "theatrical",
   "jaunty"
  ],
  "answer": "pompous",
  "definitions": {
   "pompous": "self-importantly grand",
   "didactic": "meant to teach, often in a preachy way",
   "theatrical": "dramatic and exaggerated for effect",
   "jaunty": "cheerfully self-confident and carefree"
  },
  "fixed": "Poirot threw me a smile, swelled out his chest, and began in a pompous manner.",
  "rule": "He 'swelled out his chest,' a showy posture that signals self-importance.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-2776-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "If they can ___ a service to one who has rendered a service to them, they will do it.",
  "options": [
   "render",
   "perform",
   "repay",
   "recommend"
  ],
  "answer": "render",
  "definitions": {
   "render": "to give or provide",
   "perform": "to carry out a task or action",
   "repay": "to pay back what is owed",
   "recommend": "to suggest as good or suitable"
  },
  "fixed": "If they can render a service to one who has rendered a service to them, they will do it.",
  "rule": "The same word appears again in 'has rendered a service to them,' and the sentence is about returning favors by giving help.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-899-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She saw in those grey eyes understanding and--yes--___.",
  "options": [
   "compassion",
   "forbearance",
   "admiration",
   "amusement"
  ],
  "answer": "compassion",
  "definitions": {
   "compassion": "sympathy for another's suffering",
   "forbearance": "patient self-restraint toward others' faults",
   "admiration": "warm respect and approval",
   "amusement": "enjoyment of something funny"
  },
  "fixed": "She saw in those grey eyes understanding and--yes--compassion.",
  "rule": "It is paired with 'understanding,' and she feels the other woman has read her mind kindly, so sympathy fits.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-1958-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I even forbore to ask her why it was necessary to abstract what she wanted in such a ___ manner.",
  "options": [
   "surreptitious",
   "cavalier",
   "dexterous",
   "perfunctory"
  ],
  "answer": "surreptitious",
  "definitions": {
   "surreptitious": "secret and sneaky",
   "cavalier": "casually dismissive of serious matters",
   "dexterous": "skillful with the hands",
   "perfunctory": "done with little effort or interest"
  },
  "fixed": "I even forbore to ask her why it was necessary to abstract what she wanted in such a surreptitious manner.",
  "rule": "The speaker wonders why she needed to 'abstract' (take) something this way, which implies sneaky secrecy rather than openness.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-414-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "All that was sound and ___ and law-abiding in him must have turned from her utterly in that moment of revelation.",
  "options": [
   "wholesome",
   "conventional",
   "prudent",
   "sober"
  ],
  "answer": "wholesome",
  "definitions": {
   "wholesome": "healthy and morally good",
   "conventional": "following accepted customs",
   "prudent": "wise and careful about risks",
   "sober": "serious and free from excess"
  },
  "fixed": "All that was sound and wholesome and law-abiding in him must have turned from her utterly in that moment of revelation.",
  "rule": "It is listed with 'sound' and 'law-abiding,' and he is 'a good citizen,' so it means morally good.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-72824-2216-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He made up a romantic story of a book he was writing, so as to ___ your daughter to bring them with her.",
  "options": [
   "induce",
   "instruct",
   "remind",
   "oblige"
  ],
  "answer": "induce",
  "definitions": {
   "induce": "to persuade",
   "instruct": "to give directions or orders to",
   "remind": "to help someone remember",
   "oblige": "to bind by duty or obligation"
  },
  "fixed": "He made up a romantic story of a book he was writing, so as to induce your daughter to bring them with her.",
  "rule": "He made up a story 'so as to' get the daughter to bring the rubies, so the story persuades her.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-998-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Katherine stood for a moment or two on the platform rather at a loss, but a fair young man with an ___ face came up to her and said rather hesitatingly:",
  "options": [
   "ingenuous",
   "amiable",
   "unassuming",
   "anxious"
  ],
  "answer": "ingenuous",
  "definitions": {
   "ingenuous": "innocent and open",
   "amiable": "pleasantly friendly and good-natured",
   "unassuming": "modest and not showy",
   "anxious": "worried and uneasy"
  },
  "fixed": "Katherine stood for a moment or two on the platform rather at a loss, but a fair young man with an ingenuous face came up to her and said rather hesitatingly:",
  "rule": "The young man is friendly and 'fair,' and comes up to help, so an open, innocent face fits.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-149-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Instead she changed the subject, and asked me if it was true that there were certain poisons so rare as to ___ detection.",
  "options": [
   "baffle",
   "challenge",
   "delay",
   "complicate"
  ],
  "answer": "baffle",
  "definitions": {
   "baffle": "to confuse or defeat",
   "challenge": "to test the ability of",
   "delay": "to put off or slow down",
   "complicate": "to make more tangled or difficult"
  },
  "fixed": "Instead she changed the subject, and asked me if it was true that there were certain poisons so rare as to baffle detection.",
  "rule": "She asks about 'rare' poisons, so she means ones that leave detection puzzled and unable to find them.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-72824-3003-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She greeted Knighton with dignity and an ___ politeness which would have damped many men.",
  "options": [
   "austere",
   "impeccable",
   "ironic",
   "elaborate"
  ],
  "answer": "austere",
  "definitions": {
   "austere": "strict and severe",
   "impeccable": "faultless and flawlessly correct",
   "ironic": "expressing a meaning opposite to the words",
   "elaborate": "detailed and full of ceremony"
  },
  "fixed": "She greeted Knighton with dignity and an austere politeness which would have damped many men.",
  "rule": "Her politeness 'would have damped many men' and she later 'thawed,' so it was cold and stern at first.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-3223-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Van Aldin received his apologies gravely, but managed to ___ himself from making acid comments.",
  "options": [
   "restrain",
   "wean",
   "divert",
   "excuse"
  ],
  "answer": "restrain",
  "definitions": {
   "restrain": "to hold back",
   "wean": "to gradually free from a habit",
   "divert": "to turn aside from a course or aim",
   "excuse": "to release from a duty or obligation"
  },
  "fixed": "Van Aldin received his apologies gravely, but managed to restrain himself from making acid comments.",
  "rule": "He 'managed' to stop himself from saying harsh things, so he held himself back.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-1221-6",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Always ___, he plied the spur so unobtrusively that Van Aldin never suspected it.",
  "options": [
   "tactful",
   "persuasive",
   "astute",
   "deferential"
  ],
  "answer": "tactful",
  "definitions": {
   "tactful": "skilled at handling people without offense",
   "persuasive": "good at convincing others",
   "astute": "quick to see and judge things well",
   "deferential": "respectfully giving way to others"
  },
  "fixed": "Always tactful, he plied the spur so unobtrusively that Van Aldin never suspected it.",
  "rule": "He 'plied the spur so unobtrusively' that Van Aldin never noticed, which shows careful, delicate handling.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-1034-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "For my own part, I felt a deep pity as I looked down upon the motionless form and convulsed face of the ___ young American who had come by his death in such a strange way.",
  "options": [
   "hapless",
   "unsuspecting",
   "naive",
   "reckless"
  ],
  "answer": "hapless",
  "definitions": {
   "hapless": "unlucky",
   "unsuspecting": "unaware of any danger",
   "naive": "innocent and lacking experience",
   "reckless": "heedless of danger or consequences"
  },
  "fixed": "For my own part, I felt a deep pity as I looked down upon the motionless form and convulsed face of the hapless young American who had come by his death in such a strange way.",
  "rule": "The narrator feels 'deep pity' for a young man who died strangely, so he was unlucky.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-863-1193-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The wretched young man ___ visibly under the Coroner’s frown.",
  "options": [
   "wilted",
   "blanched",
   "squirmed",
   "bristled"
  ],
  "answer": "wilted",
  "definitions": {
   "wilted": "drooped from weakness or fear",
   "blanched": "turned pale from shock or fear",
   "squirmed": "twisted about in discomfort",
   "bristled": "reacted with anger or irritation"
  },
  "fixed": "The wretched young man wilted visibly under the Coroner’s frown.",
  "rule": "He is 'wretched' and under a coroner's frown, so he drooped rather than perked up.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-194-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Before such ___ apologies, my anger was forced to melt.",
  "options": [
   "profuse",
   "abject",
   "heartfelt",
   "obsequious"
  ],
  "answer": "profuse",
  "definitions": {
   "profuse": "given in great abundance",
   "abject": "utterly humble and groveling",
   "heartfelt": "sincere and deeply felt",
   "obsequious": "excessively eager to please"
  },
  "fixed": "Before such profuse apologies, my anger was forced to melt.",
  "rule": "His anger 'was forced to melt,' which happens when apologies are plentiful and heartfelt.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-863-1299-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The two detectives strode away, Summerhaye with an ___ grin on his face.",
  "options": [
   "incredulous",
   "enigmatic",
   "ironic",
   "indulgent"
  ],
  "answer": "incredulous",
  "definitions": {
   "incredulous": "unwilling to believe",
   "enigmatic": "mysterious and hard to interpret",
   "ironic": "saying one thing but meaning another",
   "indulgent": "kindly tolerant of others' wishes"
  },
  "fixed": "The two detectives strode away, Summerhaye with an incredulous grin on his face.",
  "rule": "The detectives 'strode away' with a grin, mocking a claim they did not accept.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-70114-1058-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It seemed impossible to believe that that ___ countenance could ever display emotion.",
  "options": [
   "impassive",
   "stern",
   "weathered",
   "forbidding"
  ],
  "answer": "impassive",
  "definitions": {
   "impassive": "showing no emotion",
   "stern": "serious and strict in manner",
   "weathered": "worn and toughened by long exposure",
   "forbidding": "unfriendly and threatening in appearance"
  },
  "fixed": "It seemed impossible to believe that that impassive countenance could ever display emotion.",
  "rule": "It was a 'wooden face' that seemed unable to 'display emotion,' so it showed nothing.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-1340-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Mason gave once more the ___ cough which was apparently part of her stock-in-trade as a lady's maid.",
  "options": [
   "discreet",
   "apologetic",
   "pointed",
   "deferential"
  ],
  "answer": "discreet",
  "definitions": {
   "discreet": "quietly tactful",
   "apologetic": "showing that one is sorry",
   "pointed": "sharply aimed and clearly meaningful",
   "deferential": "showing polite respect for another's wishes"
  },
  "fixed": "Mason gave once more the discreet cough which was apparently part of her stock-in-trade as a lady's maid.",
  "rule": "A lady's maid uses a cough as a hint, so it must be a quiet, subtle signal.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-1991-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Suddenly his face fell from complacent elation to ___.",
  "options": [
   "consternation",
   "resignation",
   "despondency",
   "disillusionment"
  ],
  "answer": "consternation",
  "definitions": {
   "consternation": "shock and dismay",
   "resignation": "quiet acceptance of something unpleasant",
   "despondency": "deep loss of hope and spirit",
   "disillusionment": "disappointment at discovering the truth"
  },
  "fixed": "Suddenly his face fell from complacent elation to consternation.",
  "rule": "His face 'fell' and what he held was only 'a charred fragment,' so his emotion is a shocked dismay.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-61262-1946-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Eh bien, mademoiselle, it is a problem charming and ___ that you have presented to me here.",
  "options": [
   "ingenious",
   "intricate",
   "perplexing",
   "delicate"
  ],
  "answer": "ingenious",
  "definitions": {
   "ingenious": "clever and inventive",
   "intricate": "having many complex, interlocking parts",
   "perplexing": "confusing and hard to understand",
   "delicate": "requiring careful, gentle handling"
  },
  "fixed": "Eh bien, mademoiselle, it is a problem charming and ingenious that you have presented to me here.",
  "rule": "Poirot says he will have 'all the pleasure' in solving it, so he finds the puzzle clever, not boring.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-72824-2193-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Ada Mason retired ___, closing the door noiselessly behind her.",
  "options": [
   "discreetly",
   "obediently",
   "gracefully",
   "reluctantly"
  ],
  "answer": "discreetly",
  "definitions": {
   "discreetly": "quietly and tactfully",
   "obediently": "in a way that follows orders",
   "gracefully": "in a smooth and elegant manner",
   "reluctantly": "in an unwilling, hesitant manner"
  },
  "fixed": "Ada Mason retired discreetly, closing the door noiselessly behind her.",
  "rule": "She also closed the door 'noiselessly,' so she left in a quiet, tactful manner.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-1889-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The head waiter came up and was ___ in apologies.",
  "options": [
   "vociferous",
   "profuse",
   "effusive",
   "lavish"
  ],
  "answer": "vociferous",
  "definitions": {
   "vociferous": "loud and forceful in speech",
   "profuse": "pouring forth in great quantity",
   "effusive": "gushing with warm enthusiasm",
   "lavish": "generous or extravagant to an extreme"
  },
  "fixed": "The head waiter came up and was vociferous in apologies.",
  "rule": "A head waiter who comes over to apologize is making a show of it, and the word 'in apologies' points to loud, effusive speech.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-1989-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot looked more ___ and childlike than ever.",
  "options": [
   "ingenuous",
   "whimsical",
   "serene",
   "bemused"
  ],
  "answer": "ingenuous",
  "definitions": {
   "ingenuous": "innocent and trusting",
   "whimsical": "playfully odd and fanciful",
   "serene": "calm and peaceful",
   "bemused": "puzzled and a little confused"
  },
  "fixed": "Poirot looked more ingenuous and childlike than ever.",
  "rule": "The word 'childlike' joined by 'and' signals a similar meaning, so the blank means innocent and naive.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-58866-2207-13",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "But in any case, however ___ the sentence of the Court, it must mean a long term of imprisonment.",
  "options": [
   "lenient",
   "equitable",
   "arbitrary",
   "prompt"
  ],
  "answer": "lenient",
  "definitions": {
   "lenient": "mild, not harsh",
   "equitable": "fair and impartial",
   "arbitrary": "based on whim rather than reason",
   "prompt": "done without any delay"
  },
  "fixed": "But in any case, however lenient the sentence of the Court, it must mean a long term of imprisonment.",
  "rule": "The phrase 'however ___ ... it must mean a long term' admits that even a gentle sentence is long. Only lenient (mild) fits that concession.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-61262-1083-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "And with an ___ gesture, not waiting for a reply, he strode away.",
  "options": [
   "abrupt",
   "imperious",
   "emphatic",
   "impatient"
  ],
  "answer": "abrupt",
  "definitions": {
   "abrupt": "sudden and curt",
   "imperious": "commanding and expecting obedience",
   "emphatic": "forceful and clear in expression",
   "impatient": "restless and unwilling to wait"
  },
  "fixed": "And with an abrupt gesture, not waiting for a reply, he strode away.",
  "rule": "He is 'not waiting for a reply' and 'strode away', so the gesture was sudden and curt. Leisurely and hesitant clash with that.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-72824-2447-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Calm and ___ as she believed herself to be, Katherine felt a faint answering thrill.",
  "options": [
   "stolid",
   "pragmatic",
   "methodical",
   "resourceful"
  ],
  "answer": "stolid",
  "definitions": {
   "stolid": "calm and not easily moved",
   "pragmatic": "dealing with things in a practical way",
   "methodical": "done in a careful, orderly way",
   "resourceful": "good at finding ways to solve problems"
  },
  "fixed": "Calm and stolid as she believed herself to be, Katherine felt a faint answering thrill.",
  "rule": "'Calm and ___' paired with a contrasting 'thrill' shows the word means emotionally unmoved.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-1290-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Japp’s face grew grave, though Summerhaye gave an ___ snort.",
  "options": [
   "incredulous",
   "indignant",
   "amused",
   "impatient"
  ],
  "answer": "incredulous",
  "definitions": {
   "incredulous": "unwilling to believe",
   "indignant": "angry at being treated unfairly",
   "amused": "finding something funny",
   "impatient": "restless and unwilling to wait"
  },
  "fixed": "Japp’s face grew grave, though Summerhaye gave an incredulous snort.",
  "rule": "'Though' signals contrast with Japp's grave face, and a snort shows disbelief. Solemn would not contrast with grave.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-2518-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "At last I ventured a ___ query to Poirot.",
  "options": [
   "tentative",
   "probing",
   "pertinent",
   "pointed"
  ],
  "answer": "tentative",
  "definitions": {
   "tentative": "cautious, not certain",
   "probing": "searching deeply for information",
   "pertinent": "relevant to the matter at hand",
   "pointed": "sharply aimed and clearly meaningful"
  },
  "fixed": "At last I ventured a tentative query to Poirot.",
  "rule": "'Ventured' suggests a careful, risky first try, so the query was cautious.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-105-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He is a man of nearly fifty years of age, rubicund of face and ___ of manner.",
  "options": [
   "genial",
   "courtly",
   "debonair",
   "sedate"
  ],
  "answer": "genial",
  "definitions": {
   "genial": "friendly and cheerful",
   "courtly": "polite and dignified in an old-fashioned way",
   "debonair": "charming, stylish and self-assured",
   "sedate": "calm, quiet and dignified"
  },
  "fixed": "He is a man of nearly fifty years of age, rubicund of face and genial of manner.",
  "rule": "The description is of a successful man who is 'hand and glove with the vicar' and generous with parish funds, so his manner is friendly.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-2308-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It is easy to wear widow’s weeds and play the ___.",
  "options": [
   "hypocrite",
   "martyr",
   "mourner",
   "penitent"
  ],
  "answer": "hypocrite",
  "definitions": {
   "hypocrite": "someone who pretends to feelings they lack",
   "martyr": "someone who suffers greatly for a belief",
   "mourner": "someone who grieves over a death",
   "penitent": "someone who shows sorrow for wrongdoing"
  },
  "fixed": "It is easy to wear widow’s weeds and play the hypocrite.",
  "rule": "Wearing mourning clothes while only 'playing' a part suggests pretending to grief. That is a hypocrite.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-1187-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Certainly he could not ___ the fiction of a match.",
  "options": [
   "sustain",
   "concoct",
   "substantiate",
   "justify"
  ],
  "answer": "sustain",
  "definitions": {
   "sustain": "keep going",
   "concoct": "to invent a story or scheme",
   "substantiate": "to back up with proof or evidence",
   "justify": "to show to be reasonable or right"
  },
  "fixed": "Certainly he could not sustain the fiction of a match.",
  "rule": "He did not even know the rudiments of the game, so he could not keep up the pretense. Sustain means keep going.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-3223-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot came to them in a moment or two, full of abject apologies and clearly so crestfallen that harsh words would have been ___.",
  "options": [
   "superfluous",
   "callous",
   "unjust",
   "inexcusable"
  ],
  "answer": "superfluous",
  "definitions": {
   "superfluous": "unnecessary",
   "callous": "feeling no sympathy for others",
   "unjust": "not fair or deserved",
   "inexcusable": "too wrong to be forgiven"
  },
  "fixed": "Poirot came to them in a moment or two, full of abject apologies and clearly so crestfallen that harsh words would have been superfluous.",
  "rule": "Poirot was already so crestfallen that scolding him added nothing. Superfluous means unnecessary.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-58866-2226-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He contents himself with a general denial, and beyond that takes refuge in a most ___ silence.",
  "options": [
   "obstinate",
   "dignified",
   "eloquent",
   "sullen"
  ],
  "answer": "obstinate",
  "definitions": {
   "obstinate": "stubborn",
   "dignified": "showing calm self-respect",
   "eloquent": "expressive and powerfully meaningful",
   "sullen": "sulky and silently resentful"
  },
  "fixed": "He contents himself with a general denial, and beyond that takes refuge in a most obstinate silence.",
  "rule": "The previous sentence says it is difficult to get him to answer questions, so his silence is stubborn.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-61262-1753-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I remained ___, but the morrow forced me to render tribute to my friend’s remarkable powers.",
  "options": [
   "sceptical",
   "complacent",
   "obstinate",
   "aloof"
  ],
  "answer": "sceptical",
  "definitions": {
   "sceptical": "doubtful",
   "complacent": "smugly satisfied with oneself",
   "obstinate": "refusing to change one's mind",
   "aloof": "distant and reserved"
  },
  "fixed": "I remained sceptical, but the morrow forced me to render tribute to my friend’s remarkable powers.",
  "rule": "'But' shows a change: the next day forced him to praise Poirot, so he had first doubted. Sceptical means doubtful.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-70114-1841-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "There were plenty of books in the villa, and delightful rambles all around, but I chafed sometimes at the forced inactivity of our life, and marvelled at Poirot's state of ___ content.",
  "options": [
   "placid",
   "blissful",
   "indolent",
   "smug"
  ],
  "answer": "placid",
  "definitions": {
   "placid": "calm and undisturbed",
   "blissful": "filled with great happiness",
   "indolent": "lazy and avoiding effort",
   "smug": "pleased with oneself in an irritating way"
  },
  "fixed": "There were plenty of books in the villa, and delightful rambles all around, but I chafed sometimes at the forced inactivity of our life, and marvelled at Poirot's state of placid content.",
  "rule": "The narrator chafes at inactivity and marvels that Poirot is not bothered, so Poirot's content is calm.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-61262-1930-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I have stayed with him for a week-end occasionally, and our relations were perfectly ___, though his views remained unaltered.",
  "options": [
   "amicable",
   "tolerable",
   "candid",
   "decorous"
  ],
  "answer": "amicable",
  "definitions": {
   "amicable": "friendly",
   "tolerable": "good enough to be accepted",
   "candid": "honest and frank in speech",
   "decorous": "polite and proper in behavior"
  },
  "fixed": "I have stayed with him for a week-end occasionally, and our relations were perfectly amicable, though his views remained unaltered.",
  "rule": "'Though' signals contrast with his unchanged (disapproving) views, so the relations were friendly despite that.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-863-1951-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She began slowly, walking up and down the room, her head a little bent, and that slim, ___ figure of hers swaying gently as she walked.",
  "options": [
   "supple",
   "diminutive",
   "ethereal",
   "sinewy"
  ],
  "answer": "supple",
  "definitions": {
   "supple": "bending easily, graceful",
   "diminutive": "very small in size",
   "ethereal": "light, delicate and almost unearthly",
   "sinewy": "lean and strong with tough muscle"
  },
  "fixed": "She began slowly, walking up and down the room, her head a little bent, and that slim, supple figure of hers swaying gently as she walked.",
  "rule": "A figure 'swaying gently' as she walks must bend easily.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-1498-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He became suddenly ___ and business-like.",
  "options": [
   "brusque",
   "resolute",
   "grave",
   "wary"
  ],
  "answer": "brusque",
  "definitions": {
   "brusque": "short and blunt in manner",
   "resolute": "firm and determined",
   "grave": "serious and solemn",
   "wary": "cautious about possible danger"
  },
  "fixed": "He became suddenly brusque and business-like.",
  "rule": "'Business-like' joined by 'and' signals a similar meaning: curt and no-nonsense.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-1536-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Another taxi took us to the address Flossie Monro had given us, a ___ block of Mansions in an unsavoury neighbourhood.",
  "options": [
   "squalid",
   "nondescript",
   "sprawling",
   "cramped"
  ],
  "answer": "squalid",
  "definitions": {
   "squalid": "filthy and run-down",
   "nondescript": "lacking any special features",
   "sprawling": "spreading out in an untidy way",
   "cramped": "too small and crowded"
  },
  "fixed": "Another taxi took us to the address Flossie Monro had given us, a squalid block of Mansions in an unsavoury neighbourhood.",
  "rule": "The building is in an 'unsavoury neighbourhood', so it is dirty and run-down.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-1727-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "In spite of his careless words, his face looked ___ and strained.",
  "options": [
   "haggard",
   "grim",
   "flushed",
   "ashen"
  ],
  "answer": "haggard",
  "definitions": {
   "haggard": "worn and drawn",
   "grim": "stern and without cheer",
   "flushed": "red in the face",
   "ashen": "very pale, like gray ash"
  },
  "fixed": "In spite of his careless words, his face looked haggard and strained.",
  "rule": "'In spite of' signals his face contradicted his careless words, and 'strained' goes with a worn, tired look.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-2139-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It was neither more nor less than the ___ poisoning of a fond and trusting woman by the stepson to whom she had been more than a mother.",
  "options": [
   "deliberate",
   "insidious",
   "gradual",
   "heinous"
  ],
  "answer": "deliberate",
  "definitions": {
   "deliberate": "intentional, planned",
   "insidious": "spreading harm gradually and secretly",
   "gradual": "happening slowly in stages",
   "heinous": "wicked in a shocking way"
  },
  "fixed": "It was neither more nor less than the deliberate poisoning of a fond and trusting woman by the stepson to whom she had been more than a mother.",
  "rule": "The previous sentence calls the murder 'premeditated and cold-blooded', so the poisoning was intentional.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-58866-2123-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "How gallantly she had played her part that day, inwardly racked with fear and ___ as she must have been.",
  "options": [
   "trepidation",
   "remorse",
   "humiliation",
   "exhaustion"
  ],
  "answer": "trepidation",
  "definitions": {
   "trepidation": "nervous fear, dread",
   "remorse": "deep regret over wrongdoing",
   "humiliation": "loss of dignity or pride",
   "exhaustion": "a state of extreme tiredness"
  },
  "fixed": "How gallantly she had played her part that day, inwardly racked with fear and trepidation as she must have been.",
  "rule": "It is paired with 'fear' and 'racked', so it names a similar anxious feeling.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-863-419-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I remained by the door, fearing to ___ any clues.",
  "options": [
   "obliterate",
   "disturb",
   "contaminate",
   "overlook"
  ],
  "answer": "obliterate",
  "definitions": {
   "obliterate": "wipe out completely",
   "disturb": "to upset the arrangement of",
   "contaminate": "to make impure by contact",
   "overlook": "to fail to notice"
  },
  "fixed": "I remained by the door, fearing to obliterate any clues.",
  "rule": "Staying by the door while Poirot darts about shows he feared destroying evidence.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-863-699-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "___ and good breeding naturally enjoined that our demeanour should be much as usual, yet I could not help wondering if this self-control were really a matter of great difficulty.",
  "options": [
   "Decorum",
   "Prudence",
   "Reticence",
   "Fortitude"
  ],
  "answer": "Decorum",
  "definitions": {
   "Decorum": "polite, proper behavior",
   "Prudence": "careful good judgment",
   "Reticence": "reluctance to speak openly",
   "Fortitude": "courage in the face of hardship"
  },
  "fixed": "Decorum and good breeding naturally enjoined that our demeanour should be much as usual, yet I could not help wondering if this self-control were really a matter of great difficulty.",
  "rule": "Paired with 'good breeding' and tied to 'self-control', it means proper behavior.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-58866-2123-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poor little soul, bearing the burden of a moment’s ___ action.",
  "options": [
   "impetuous",
   "desperate",
   "misguided",
   "ruthless"
  ],
  "answer": "impetuous",
  "definitions": {
   "impetuous": "rash, done on impulse",
   "desperate": "willing to risk anything out of hopelessness",
   "misguided": "based on mistaken ideas",
   "ruthless": "showing no pity"
  },
  "fixed": "Poor little soul, bearing the burden of a moment’s impetuous action.",
  "rule": "'A moment's' action suggests a sudden impulse, and the 'burden' implies regret.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-1279-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "That worthy gentleman departed from his usual practice of never looking at the person to whom he was talking, and stole a ___ glance at the millionaire.",
  "options": [
   "fleeting",
   "furtive",
   "penetrating",
   "sidelong"
  ],
  "answer": "fleeting",
  "definitions": {
   "fleeting": "brief, passing quickly",
   "furtive": "secretive and trying not to be seen",
   "penetrating": "sharply searching or piercing",
   "sidelong": "directed to one side"
  },
  "fixed": "That worthy gentleman departed from his usual practice of never looking at the person to whom he was talking, and stole a fleeting glance at the millionaire.",
  "rule": "A man who never looks at people who 'stole' a glance gave only a quick one.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-930-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "His ___ face showed no trace of any kind of emotion.",
  "options": [
   "impassive",
   "solemn",
   "gaunt",
   "sallow"
  ],
  "answer": "impassive",
  "definitions": {
   "impassive": "showing no feeling",
   "solemn": "serious and dignified",
   "gaunt": "thin and bony",
   "sallow": "sickly yellowish in color"
  },
  "fixed": "His impassive face showed no trace of any kind of emotion.",
  "rule": "The rest of the sentence defines the word: a face showing 'no trace of any kind of emotion'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-518-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She was interrupted by the snort of ___ her father gave.",
  "options": [
   "indignation",
   "contempt",
   "disbelief",
   "amusement"
  ],
  "answer": "indignation",
  "definitions": {
   "indignation": "anger at unfairness",
   "contempt": "feeling that someone is worthless",
   "disbelief": "refusal to accept as true",
   "amusement": "pleasure at something funny"
  },
  "fixed": "She was interrupted by the snort of indignation her father gave.",
  "rule": "A 'snort' that interrupts someone signals annoyance, so the noun is anger at something unfair.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-1199-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Monsieur would not stand by and see her falsely accused, while that ___ chambermaid was allowed to go scot-free.",
  "options": [
   "infamous",
   "devious",
   "brazen",
   "slovenly"
  ],
  "answer": "infamous",
  "definitions": {
   "infamous": "notorious for bad deeds",
   "devious": "sly and dishonest in methods",
   "brazen": "boldly shameless in behavior",
   "slovenly": "untidy and careless in habits"
  },
  "fixed": "Monsieur would not stand by and see her falsely accused, while that infamous chambermaid was allowed to go scot-free.",
  "rule": "The speaker calls the chambermaid a 'born thief' who is escaping punishment, so she has a bad reputation.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-2208-6",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He must find some ___ other than the real one.",
  "options": [
   "pretext",
   "motive",
   "alibi",
   "incentive"
  ],
  "answer": "pretext",
  "definitions": {
   "pretext": "a false reason given to hide the real one",
   "motive": "the inner reason behind an action",
   "alibi": "a claim of having been elsewhere",
   "incentive": "something that encourages action"
  },
  "fixed": "He must find some pretext other than the real one.",
  "rule": "The phrase 'other than the real one' shows the missing noun is a reason that is not the true reason, which is a pretext.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-62-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "For this man, negligible and ___ as he seemed, played a prominent part in the destiny of the world.",
  "options": [
   "inconspicuous",
   "mediocre",
   "innocuous",
   "diffident"
  ],
  "answer": "inconspicuous",
  "definitions": {
   "inconspicuous": "not easily noticed",
   "mediocre": "of only average quality",
   "innocuous": "not harmful or offensive",
   "diffident": "shy and lacking self-confidence"
  },
  "fixed": "For this man, negligible and inconspicuous as he seemed, played a prominent part in the destiny of the world.",
  "rule": "The word is paired with 'negligible' and contrasts with 'prominent part', so it must mean easy to overlook.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-93-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "A ___, hard look came into Miss Marvell’s eyes which belied their childlike appearance.",
  "options": [
   "shrewd",
   "cynical",
   "steely",
   "defiant"
  ],
  "answer": "shrewd",
  "definitions": {
   "shrewd": "sharp and clever, especially about practical matters",
   "cynical": "distrustful of people's motives",
   "steely": "cold and hard like metal",
   "defiant": "openly resisting authority"
  },
  "fixed": "A shrewd, hard look came into Miss Marvell’s eyes which belied their childlike appearance.",
  "rule": "The look 'belied' a childlike appearance and is paired with 'hard', so it is the opposite of innocent: shrewd.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-61262-383-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I tried to ___ these gloomy fears of his, but without avail.",
  "options": [
   "dispel",
   "confront",
   "indulge",
   "contain"
  ],
  "answer": "dispel",
  "definitions": {
   "dispel": "to drive away or make disappear",
   "confront": "to face boldly",
   "indulge": "to give in to a desire",
   "contain": "to keep within limits"
  },
  "fixed": "I tried to dispel these gloomy fears of his, but without avail.",
  "rule": "'Without avail' means the attempt failed, and someone trying to help with gloomy fears would try to drive them away: dispel.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-863-945-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He looked so crestfallen and abashed that I felt quite sorry, though I still thought my ___ a just and wise one.",
  "options": [
   "rebuke",
   "verdict",
   "counsel",
   "ultimatum"
  ],
  "answer": "rebuke",
  "definitions": {
   "rebuke": "a sharp scolding",
   "verdict": "a formal judgment or decision",
   "counsel": "advice given to guide a decision",
   "ultimatum": "a final demand or warning"
  },
  "fixed": "He looked so crestfallen and abashed that I felt quite sorry, though I still thought my rebuke a just and wise one.",
  "rule": "He is crestfallen and abashed and the speaker feels sorry, so the speaker must have scolded him: a rebuke.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-70114-1405-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Their notes had contained some absurd references to my supposed impulsiveness, and had suggested that I was ___ to the charms of young women with hair of a certain shade.",
  "options": [
   "susceptible",
   "partial",
   "attentive",
   "devoted"
  ],
  "answer": "susceptible",
  "definitions": {
   "susceptible": "easily influenced or affected",
   "partial": "having a special liking for",
   "attentive": "paying close attention",
   "devoted": "deeply loyal or committed"
  },
  "fixed": "Their notes had contained some absurd references to my supposed impulsiveness, and had suggested that I was susceptible to the charms of young women with hair of a certain shade.",
  "rule": "The notes mock his 'impulsiveness' and the 'charms' of young women, so he is said to be easily swayed by them: susceptible.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-58866-1175-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Young Renauld remained silent, his boyish face ___ and overcast.",
  "options": [
   "sullen",
   "pensive",
   "stricken",
   "wistful"
  ],
  "answer": "sullen",
  "definitions": {
   "sullen": "gloomy and bad-tempered",
   "pensive": "deep in serious thought",
   "stricken": "overcome by grief or trouble",
   "wistful": "sadly longing for something"
  },
  "fixed": "Young Renauld remained silent, his boyish face sullen and overcast.",
  "rule": "'Overcast' means clouded over, and he is silent, so his mood is also dark and moody: sullen.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1622-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot bestowed but a ___ glance on the surroundings.",
  "options": [
   "cursory",
   "disdainful",
   "appraising",
   "jaded"
  ],
  "answer": "cursory",
  "definitions": {
   "cursory": "quick and not detailed",
   "disdainful": "showing contempt for something",
   "appraising": "judging the value of something",
   "jaded": "worn out by too much experience"
  },
  "fixed": "Poirot bestowed but a cursory glance on the surroundings.",
  "rule": "The word 'but' (meaning only) and the following sentence, 'The only thing he examined was...', show he looked briefly: cursory.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-61262-943-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "An event soon occurred which took a ___ hold on the public mind.",
  "options": [
   "profound",
   "sinister",
   "morbid",
   "lasting"
  ],
  "answer": "profound",
  "definitions": {
   "profound": "deep and powerful",
   "sinister": "threatening or suggesting evil",
   "morbid": "unhealthily drawn to gloomy subjects",
   "lasting": "continuing for a long time"
  },
  "fixed": "An event soon occurred which took a profound hold on the public mind.",
  "rule": "The event is the sudden death of Sir John Willard and it 'took hold' of the public, so its effect was deep: profound.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-70114-1886-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot was in his most unapproachable mood, lost in a kind of ___.",
  "options": [
   "reverie",
   "melancholy",
   "rapture",
   "slumber"
  ],
  "answer": "reverie",
  "definitions": {
   "reverie": "a dreamy, thoughtful daze",
   "melancholy": "deep, lingering sadness",
   "rapture": "intense, overwhelming joy",
   "slumber": "deep, peaceful sleep"
  },
  "fixed": "Poirot was in his most unapproachable mood, lost in a kind of reverie.",
  "rule": "He is unapproachable and 'lost in' thought, shaking his head and sighing, which describes a daydream-like state: reverie.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-58866-882-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I had read of the mobs of women who ___ the law courts when some wretched man was being tried for his life on the capital charge.",
  "options": [
   "besieged",
   "frequented",
   "haunted",
   "disrupted"
  ],
  "answer": "besieged",
  "definitions": {
   "besieged": "surrounded and pressed in on",
   "frequented": "visited again and again",
   "haunted": "returned to over and over",
   "disrupted": "interrupted and thrown into disorder"
  },
  "fixed": "I had read of the mobs of women who besieged the law courts when some wretched man was being tried for his life on the capital charge.",
  "rule": "The women form 'mobs' with 'ghoulish excitement' to see a trial, so they crowd around the courts: besieged.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-140-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The man with the white hair continued on his course, unhurried, and seemingly ___ to his surroundings.",
  "options": [
   "indifferent",
   "inured",
   "attuned",
   "superior"
  ],
  "answer": "indifferent",
  "definitions": {
   "indifferent": "showing no interest or concern",
   "inured": "hardened by repeated exposure",
   "attuned": "in harmony with",
   "superior": "greater in rank or quality"
  },
  "fixed": "The man with the white hair continued on his course, unhurried, and seemingly indifferent to his surroundings.",
  "rule": "He is 'unhurried' and walks without reacting, so he seems not to care about what is around him: indifferent.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-500-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "In the events I am now about to chronicle, a remarkable chain of circumstances led from the apparently ___ incidents which first attracted Poirot’s attention to the sinister happenings which completed a most unusual case.",
  "options": [
   "trivial",
   "isolated",
   "unrelated",
   "innocuous"
  ],
  "answer": "trivial",
  "definitions": {
   "trivial": "of little importance",
   "isolated": "separate from others",
   "unrelated": "having no connection",
   "innocuous": "causing no harm or offense"
  },
  "fixed": "In the events I am now about to chronicle, a remarkable chain of circumstances led from the apparently trivial incidents which first attracted Poirot’s attention to the sinister happenings which completed a most unusual case.",
  "rule": "The chain moves from the 'apparently' small incidents to 'sinister happenings,' so the early incidents seemed unimportant: trivial.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-69087-2658-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He was so plainly delighted with himself that any words of ours would have been quite ___.",
  "options": [
   "superfluous",
   "presumptuous",
   "tactless",
   "insulting"
  ],
  "answer": "superfluous",
  "definitions": {
   "superfluous": "more than is needed; unnecessary",
   "presumptuous": "overstepping proper limits with boldness",
   "tactless": "careless about others' feelings",
   "insulting": "rude and offensive"
  },
  "fixed": "He was so plainly delighted with himself that any words of ours would have been quite superfluous.",
  "rule": "He was so pleased with himself that nothing anyone said would add anything, so extra words would be unnecessary: superfluous.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-450-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Mrs. Halliday seemed rather ___ to answer, but at last she said:---",
  "options": [
   "reluctant",
   "embarrassed",
   "unprepared",
   "unable"
  ],
  "answer": "reluctant",
  "definitions": {
   "reluctant": "unwilling; hesitant",
   "embarrassed": "feeling awkward and self-conscious",
   "unprepared": "not ready or equipped beforehand",
   "unable": "lacking the means to do something"
  },
  "fixed": "Mrs. Halliday seemed rather reluctant to answer, but at last she said:---",
  "rule": "The word 'but at last' signals she delayed before speaking, so she was hesitant: reluctant.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-139-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Miss Russell’s account of vague pains was so unconvincing that with a woman of less ___ of character I should have suspected a trumped-up tale.",
  "options": [
   "integrity",
   "firmness",
   "stability",
   "refinement"
  ],
  "answer": "integrity",
  "definitions": {
   "integrity": "honesty and strong moral principles",
   "firmness": "steady strength of will",
   "stability": "steadiness and resistance to change",
   "refinement": "elegance and good manners"
  },
  "fixed": "Miss Russell’s account of vague pains was so unconvincing that with a woman of less integrity of character I should have suspected a trumped-up tale.",
  "rule": "He would have suspected a made-up story from a less honest woman, so the missing word is about moral honesty: integrity.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-388-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "My friend threw me a glance of dignified ___.",
  "options": [
   "reproach",
   "condescension",
   "pity",
   "defiance"
  ],
  "answer": "reproach",
  "definitions": {
   "reproach": "disapproval or mild blame",
   "condescension": "a patronizing, superior attitude",
   "pity": "sympathy for another's misfortune",
   "defiance": "open resistance to authority"
  },
  "fixed": "My friend threw me a glance of dignified reproach.",
  "rule": "A 'dignified' glance thrown at a friend who has done something annoying expresses mild blame: reproach.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-58866-2179-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I had a very ___ opinion of my wits when it came to matching them against his.",
  "options": [
   "humble",
   "critical",
   "guarded",
   "poor"
  ],
  "answer": "humble",
  "definitions": {
   "humble": "modest; not proud",
   "critical": "tending to find fault",
   "guarded": "careful about revealing one's views",
   "poor": "of low quality or value"
  },
  "fixed": "I had a very humble opinion of my wits when it came to matching them against his.",
  "rule": "The previous sentence says he had 'far too much respect' for Poirot's abilities, so he thought little of his own wits: humble.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-863-1369-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot gave me a curious look, which I could not quite ___.",
  "options": [
   "fathom",
   "return",
   "describe",
   "dismiss"
  ],
  "answer": "fathom",
  "definitions": {
   "fathom": "to understand after thinking hard",
   "return": "to give back in response",
   "describe": "to tell in words what something is like",
   "dismiss": "to put out of one's mind"
  },
  "fixed": "Poirot gave me a curious look, which I could not quite fathom.",
  "rule": "The look was 'curious' and Poirot seemed about to speak, so the narrator could not work out its meaning: fathom.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-675-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Mrs. Harrison gave an ___ sigh, and the doctor rose preparatory to starting on his rounds.",
  "options": [
   "exasperated",
   "involuntary",
   "apprehensive",
   "indulgent"
  ],
  "answer": "exasperated",
  "definitions": {
   "exasperated": "extremely irritated",
   "involuntary": "done without conscious intent",
   "apprehensive": "anxious about what may happen",
   "indulgent": "willing to excuse faults out of kindness"
  },
  "fixed": "Mrs. Harrison gave an exasperated sigh, and the doctor rose preparatory to starting on his rounds.",
  "rule": "A sigh given just before the doctor leaves suggests she is fed up and annoyed with the conversation: exasperated.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-160-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The ___ face of Dr. Bauerstein recurred to me unpleasantly.",
  "options": [
   "sinister",
   "inscrutable",
   "gaunt",
   "impassive"
  ],
  "answer": "sinister",
  "definitions": {
   "sinister": "threatening or evil-looking",
   "inscrutable": "impossible to read or understand",
   "gaunt": "hollow-cheeked and very thin",
   "impassive": "unmoved and expressionless"
  },
  "fixed": "The sinister face of Dr. Bauerstein recurred to me unpleasantly.",
  "rule": "The memory comes with 'suspicion' and returns 'unpleasantly,' so the face seems threatening: sinister.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-3013-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "A man when he is making up to anybody can be ___ and gallant and full of little attentions and altogether charming.",
  "options": [
   "cordial",
   "witty",
   "solicitous",
   "ingratiating"
  ],
  "answer": "cordial",
  "definitions": {
   "cordial": "warm and friendly",
   "witty": "clever and amusing in speech",
   "solicitous": "showing eager concern for others",
   "ingratiating": "eager to win favor"
  },
  "fixed": "A man when he is making up to anybody can be cordial and gallant and full of little attentions and altogether charming.",
  "rule": "The word sits in a list with 'gallant' and 'altogether charming,' so it means warm and pleasant: cordial.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-104-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "And then I started, for our invalid, roused suddenly from his ___, sat up in his chair and said clearly and distinctly:",
  "options": [
   "stupor",
   "meditation",
   "despair",
   "melancholy"
  ],
  "answer": "stupor",
  "definitions": {
   "stupor": "a dazed, half-conscious state",
   "meditation": "deep, quiet thought",
   "despair": "complete loss of hope",
   "melancholy": "gloomy, lingering sadness"
  },
  "fixed": "And then I started, for our invalid, roused suddenly from his stupor, sat up in his chair and said clearly and distinctly:",
  "rule": "He is an 'invalid' who is suddenly 'roused' and sits up, so he had been in a dazed, nearly unconscious state: stupor.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-1150-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "A calculating look rather ___ the ingenuousness of the blue eyes.",
  "options": [
   "marred",
   "tempered",
   "contradicted",
   "overshadowed"
  ],
  "answer": "marred",
  "definitions": {
   "marred": "spoiled or damaged",
   "tempered": "softened or moderated",
   "contradicted": "stated the opposite of",
   "overshadowed": "made seem less important"
  },
  "fixed": "A calculating look rather marred the ingenuousness of the blue eyes.",
  "rule": "A 'calculating' look clashes with innocent, 'ingenuous' eyes, so it spoiled their innocence: marred.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-1826-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Upon that she was gone, an ___ whirlwind, her errand accomplished.",
  "options": [
   "impetuous",
   "efficient",
   "exuberant",
   "irresistible"
  ],
  "answer": "impetuous",
  "definitions": {
   "impetuous": "acting quickly on impulse, without thinking",
   "efficient": "working well without wasting effort",
   "exuberant": "full of high-spirited energy",
   "irresistible": "too strong or appealing to resist"
  },
  "fixed": "Upon that she was gone, an impetuous whirlwind, her errand accomplished.",
  "rule": "The comparison to a whirlwind and the sudden exit signal someone rushing and impulsive. Hesitant, serene, and ponderous all describe the opposite of a whirlwind.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-955-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It may be mere superstition, it may be some ___ curse from the past that operates in ways undreamed of by modern science.",
  "options": [
   "potent",
   "malevolent",
   "hereditary",
   "inexplicable"
  ],
  "answer": "potent",
  "definitions": {
   "potent": "powerful",
   "malevolent": "wishing harm on others",
   "hereditary": "passed down in a family",
   "inexplicable": "impossible to explain"
  },
  "fixed": "It may be mere superstition, it may be some potent curse from the past that operates in ways undreamed of by modern science.",
  "rule": "Three deaths are blamed on the curse, so it must be strong enough to kill.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-642-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He seemed to be directing his attention to all sorts of silly, ___ points that had nothing to do with the case.",
  "options": [
   "puerile",
   "peripheral",
   "tangential",
   "obscure"
  ],
  "answer": "puerile",
  "definitions": {
   "puerile": "childish and silly",
   "peripheral": "on the edge, not central",
   "tangential": "only slightly connected to the matter",
   "obscure": "not well known or clear"
  },
  "fixed": "He seemed to be directing his attention to all sorts of silly, puerile points that had nothing to do with the case.",
  "rule": "The word sits beside silly and is followed by points with nothing to do with the case. Puerile means childish; the other options describe important, relevant, or wise points.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-690-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Auguste was charmed with Poirot’s interest, and was quite inclined to be ___.",
  "options": [
   "garrulous",
   "forthcoming",
   "cooperative",
   "boastful"
  ],
  "answer": "garrulous",
  "definitions": {
   "garrulous": "talking a lot, especially about unimportant things",
   "forthcoming": "willing to share information",
   "cooperative": "willing to work with others",
   "boastful": "showing too much pride in oneself"
  },
  "fixed": "Auguste was charmed with Poirot’s interest, and was quite inclined to be garrulous.",
  "rule": "Being charmed by someone's interest would make a person eager to talk.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-879-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I was loath to ___ my position of importance.",
  "options": [
   "relinquish",
   "exploit",
   "jeopardize",
   "squander"
  ],
  "answer": "relinquish",
  "definitions": {
   "relinquish": "to give up",
   "exploit": "to use for one's own gain",
   "jeopardize": "to put at risk",
   "squander": "to waste foolishly"
  },
  "fixed": "I was loath to relinquish my position of importance.",
  "rule": "Loath means unwilling, so the speaker does not want to give something up.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1273-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I have been called original in my methods, but I ___ that there is much to be said for originality.",
  "options": [
   "maintain",
   "suspect",
   "concede",
   "assume"
  ],
  "answer": "maintain",
  "definitions": {
   "maintain": "to insist something is true",
   "suspect": "to think likely without proof",
   "concede": "to admit as true after resisting",
   "assume": "to take for granted"
  },
  "fixed": "I have been called original in my methods, but I maintain that there is much to be said for originality.",
  "rule": "The speaker is defending being original, and the word but sets up a firm statement of belief.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-882-6",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "They were of the likeness of Cinderella, young, yet obsessed with a yearning for ___ excitement, for sensation at any price, without regard to any decency or good feeling.",
  "options": [
   "morbid",
   "feverish",
   "vicarious",
   "illicit"
  ],
  "answer": "morbid",
  "definitions": {
   "morbid": "unhealthily interested in unpleasant things like death",
   "feverish": "restless with intense, excited energy",
   "vicarious": "felt through imagining another's experience",
   "illicit": "forbidden by law or custom"
  },
  "fixed": "They were of the likeness of Cinderella, young, yet obsessed with a yearning for morbid excitement, for sensation at any price, without regard to any decency or good feeling.",
  "rule": "The phrases sensation at any price and without regard to decency show an unhealthy craving.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1411-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Throw together a boy young Renauld and a beautiful girl like Mademoiselle Marthe, and the result is almost ___.",
  "options": [
   "inevitable",
   "irresistible",
   "explosive",
   "tragic"
  ],
  "answer": "inevitable",
  "definitions": {
   "inevitable": "certain to happen",
   "irresistible": "too strong or tempting to resist",
   "explosive": "likely to burst out violently",
   "tragic": "causing great sorrow"
  },
  "fixed": "Throw together a boy young Renauld and a beautiful girl like Mademoiselle Marthe, and the result is almost inevitable.",
  "rule": "Poirot says he knows human nature, and the sentence says what happens when a boy and girl are thrown together. Inevitable means bound to happen; the others suggest it might not.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-863-2238-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Evelyn Howard had been right in her facts, though her ___ against Alfred Inglethorp had caused her to jump to the conclusion that he was the person concerned.",
  "options": [
   "animosity",
   "suspicion",
   "crusade",
   "vigilance"
  ],
  "answer": "animosity",
  "definitions": {
   "animosity": "strong dislike or hostility",
   "suspicion": "a belief that someone has done wrong",
   "crusade": "a vigorous campaign for a cause",
   "vigilance": "careful watchfulness against danger"
  },
  "fixed": "Evelyn Howard had been right in her facts, though her animosity against Alfred Inglethorp had caused her to jump to the conclusion that he was the person concerned.",
  "rule": "She wrongly leapt to blaming him, which suggests she already disliked him.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-1890-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I spoke with that kind of ___ geniality which seems to be expected of general practitioners.",
  "options": [
   "spurious",
   "professional",
   "hearty",
   "boisterous"
  ],
  "answer": "spurious",
  "definitions": {
   "spurious": "fake, not what it claims to be",
   "professional": "typical of a trained practitioner",
   "hearty": "warm and enthusiastic",
   "boisterous": "noisy and cheerfully rowdy"
  },
  "fixed": "I spoke with that kind of spurious geniality which seems to be expected of general practitioners.",
  "rule": "Geniality that is merely expected of doctors is put on for the role.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-14-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I looked up now, frowning slightly, into a pretty, ___ face, surmounted by a rakish little red hat.",
  "options": [
   "impudent",
   "winsome",
   "vivacious",
   "coquettish"
  ],
  "answer": "impudent",
  "definitions": {
   "impudent": "cheekily disrespectful",
   "winsome": "charming in an innocent way",
   "vivacious": "lively and full of spirit",
   "coquettish": "playfully and teasingly flirtatious"
  },
  "fixed": "I looked up now, frowning slightly, into a pretty, impudent face, surmounted by a rakish little red hat.",
  "rule": "The narrator frowns, and the face wears a rakish (jaunty) hat.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-863-2450-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "If it had been Inglethorp who was carrying on an intrigue with Mrs. Raikes, his silence was perfectly ___.",
  "options": [
   "comprehensible",
   "legitimate",
   "honorable",
   "prudent"
  ],
  "answer": "comprehensible",
  "definitions": {
   "comprehensible": "able to be understood",
   "legitimate": "lawful and proper",
   "honorable": "worthy of respect and trust",
   "prudent": "wise and careful about risks"
  },
  "fixed": "If it had been Inglethorp who was carrying on an intrigue with Mrs. Raikes, his silence was perfectly comprehensible.",
  "rule": "The sentence says that if he had a secret affair, his silence would make sense. The next sentence says that a different fact gives silence a different meaning. Comprehensible means understandable.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-863-2378-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "What idiots we had been never to think of that fire as being ___!",
  "options": [
   "incongruous",
   "significant",
   "deliberate",
   "suspicious"
  ],
  "answer": "incongruous",
  "definitions": {
   "incongruous": "out of place, not fitting",
   "significant": "having important meaning",
   "deliberate": "done on purpose",
   "suspicious": "seeming dishonest or wrong"
  },
  "fixed": "What idiots we had been never to think of that fire as being incongruous!",
  "rule": "Calling themselves idiots means they overlooked something that should have stood out.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-1888-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "So much did she ___ to the etiquette of the situation.",
  "options": [
   "concede",
   "conform",
   "adhere",
   "adapt"
  ],
  "answer": "concede",
  "definitions": {
   "concede": "to grant or admit, often reluctantly",
   "conform": "to follow accepted rules",
   "adhere": "to stick firmly to",
   "adapt": "to adjust to new conditions"
  },
  "fixed": "So much did she concede to the etiquette of the situation.",
  "rule": "The sentence describes the lady staying in bed but still giving up a little to politeness, such as offering her hand. Concede means to grant; the others mean she gave nothing.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-1914-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I was ___ enough to see that a very real anxiety lay behind these outpourings.",
  "options": [
   "shrewd",
   "worldly",
   "sympathetic",
   "cynical"
  ],
  "answer": "shrewd",
  "definitions": {
   "shrewd": "sharp and clever at judging situations",
   "worldly": "experienced in the ways of society",
   "sympathetic": "feeling pity for another's trouble",
   "cynical": "distrustful of people's motives"
  },
  "fixed": "I was shrewd enough to see that a very real anxiety lay behind these outpourings.",
  "rule": "He saw the hidden anxiety behind what was said, which takes sharp insight.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-1894-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She always approaches her object by ___ means.",
  "options": [
   "tortuous",
   "unorthodox",
   "clandestine",
   "persistent"
  ],
  "answer": "tortuous",
  "definitions": {
   "tortuous": "twisting and indirect",
   "unorthodox": "not following usual methods",
   "clandestine": "carried out in secret",
   "persistent": "continuing despite difficulty"
  },
  "fixed": "She always approaches her object by tortuous means.",
  "rule": "The previous sentence says she is incapable of a straight-forward course.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-61262-1784-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It was the ___ doctor’s habit to drop in sometimes of an evening and have a chat with Poirot, of whose genius he was an ardent admirer.",
  "options": [
   "genial",
   "portly",
   "garrulous",
   "obliging"
  ],
  "answer": "genial",
  "definitions": {
   "genial": "friendly and cheerful",
   "portly": "stout in a dignified way",
   "garrulous": "talking too much",
   "obliging": "willing to help others"
  },
  "fixed": "It was the genial doctor’s habit to drop in sometimes of an evening and have a chat with Poirot, of whose genius he was an ardent admirer.",
  "rule": "A man who drops in for chats and admires Poirot is warm and sociable, and the next sentence calls him frank.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-120-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I am convinced that the danger is ___, and therefore I beg that you will lose no time in crossing to France.",
  "options": [
   "imminent",
   "grave",
   "lethal",
   "mounting"
  ],
  "answer": "imminent",
  "definitions": {
   "imminent": "about to happen very soon",
   "grave": "serious and weighty",
   "lethal": "capable of causing death",
   "mounting": "growing steadily in intensity"
  },
  "fixed": "I am convinced that the danger is imminent, and therefore I beg that you will lose no time in crossing to France.",
  "rule": "The writer begs for the reader to lose no time, so the danger must be close at hand.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-61262-147-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "In spite of his ___, I was deeply attached to my quaint little friend.",
  "options": [
   "idiosyncrasies",
   "vanities",
   "shortcomings",
   "pretensions"
  ],
  "answer": "idiosyncrasies",
  "definitions": {
   "idiosyncrasies": "odd habits or quirks unique to a person",
   "vanities": "excessive prides in oneself",
   "shortcomings": "faults or weaknesses",
   "pretensions": "claims to importance not justified"
  },
  "fixed": "In spite of his idiosyncrasies, I was deeply attached to my quaint little friend.",
  "rule": "In spite of signals a contrast: the narrator likes him even though of something.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-1441-6",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The more I thought about it, the more I felt convinced that this last ___ of mine was right.",
  "options": [
   "surmise",
   "assertion",
   "accusation",
   "calculation"
  ],
  "answer": "surmise",
  "definitions": {
   "surmise": "a guess based on limited evidence",
   "assertion": "a confident statement of belief",
   "accusation": "a claim that someone did wrong",
   "calculation": "a careful working-out of numbers"
  },
  "fixed": "The more I thought about it, the more I felt convinced that this last surmise of mine was right.",
  "rule": "The narrator only feels convinced his idea was right, so it was an unproven guess.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-69087-2041-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I wanted dreadfully to understand the ___ of the boots.",
  "options": [
   "enigma",
   "significance",
   "intricacy",
   "provenance"
  ],
  "answer": "enigma",
  "definitions": {
   "enigma": "a puzzling mystery",
   "significance": "the importance or meaning something carries",
   "intricacy": "a complicated, finely worked detail",
   "provenance": "the place or source something came from"
  },
  "fixed": "I wanted dreadfully to understand the enigma of the boots.",
  "rule": "He wants to understand it, and it was a subtle parting shot, so it is something puzzling.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-938-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "M. Hautet was painstaking and ___ in the extreme, but did not succeed in eliciting anything of importance.",
  "options": [
   "meticulous",
   "relentless",
   "tenacious",
   "courteous"
  ],
  "answer": "meticulous",
  "definitions": {
   "meticulous": "extremely careful about details",
   "relentless": "not willing to stop or ease up",
   "tenacious": "holding stubbornly to a goal or purpose",
   "courteous": "polite and respectful in manner"
  },
  "fixed": "M. Hautet was painstaking and meticulous in the extreme, but did not succeed in eliciting anything of importance.",
  "rule": "It is paired with painstaking, a word with a similar meaning, and the clause with but suggests great effort that still failed. Meticulous matches painstaking.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1890-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He shrugged his shoulders as though to ___ that it was of no importance.",
  "options": [
   "intimate",
   "concede",
   "maintain",
   "stipulate"
  ],
  "answer": "intimate",
  "definitions": {
   "intimate": "to hint or suggest indirectly",
   "concede": "to admit something reluctantly",
   "maintain": "to keep insisting that something is true",
   "stipulate": "to demand as a condition of an agreement"
  },
  "fixed": "He shrugged his shoulders as though to intimate that it was of no importance.",
  "rule": "A shrug is a silent gesture, so it can only hint at a message.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1862-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He was torn between a desire to refuse rudely and the pleasure of triumphing over his ___.",
  "options": [
   "adversary",
   "superior",
   "creditor",
   "inquisitor"
  ],
  "answer": "adversary",
  "definitions": {
   "adversary": "an opponent",
   "superior": "a person of higher rank or authority",
   "creditor": "a person to whom money is owed",
   "inquisitor": "a person who questions others harshly"
  },
  "fixed": "He was torn between a desire to refuse rudely and the pleasure of triumphing over his adversary.",
  "rule": "Triumphing over someone means beating them, and he is tempted to refuse rudely.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-800-9",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Derek damned money and the power of money ___ to himself.",
  "options": [
   "vehemently",
   "grimly",
   "cynically",
   "privately"
  ],
  "answer": "vehemently",
  "definitions": {
   "vehemently": "with strong, intense feeling",
   "grimly": "in a stern, joyless way",
   "cynically": "in a distrustful, scornful way",
   "privately": "in a way not shared with others"
  },
  "fixed": "Derek damned money and the power of money vehemently to himself.",
  "rule": "Damning something is an angry act, and he is in a bitter war with Van Aldin.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-2507-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "And, then, there was that rather over-___ hatred of hers!",
  "options": [
   "vehement",
   "theatrical",
   "calculating",
   "ostentatious"
  ],
  "answer": "vehement",
  "definitions": {
   "vehement": "intensely strong in feeling",
   "theatrical": "exaggerated and staged for show",
   "calculating": "coldly planning to gain an advantage",
   "ostentatious": "showy in order to impress others"
  },
  "fixed": "And, then, there was that rather over-vehement hatred of hers!",
  "rule": "The next sentence says the hatred concealed the opposite emotion, so it was exaggerated and overdone.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-846-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Knighton listened politely to the easy, mocking voice, but no sign of any kind showed itself on his rather ___ countenance.",
  "options": [
   "stolid",
   "dour",
   "weathered",
   "haggard"
  ],
  "answer": "stolid",
  "definitions": {
   "stolid": "calm and showing little emotion",
   "dour": "stern and gloomy in manner",
   "weathered": "worn and lined by years outdoors",
   "haggard": "looking worn out and exhausted"
  },
  "fixed": "Knighton listened politely to the easy, mocking voice, but no sign of any kind showed itself on his rather stolid countenance.",
  "rule": "No sign of any kind showed on his face, so it was unemotional.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-363-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I have heard Hector Blunt described as a woman hater, but I noticed that he joined Flora at the silver table with what might be described as ___.",
  "options": [
   "alacrity",
   "gallantry",
   "deference",
   "diffidence"
  ],
  "answer": "alacrity",
  "definitions": {
   "alacrity": "quick, cheerful eagerness",
   "gallantry": "polite, attentive behavior toward women",
   "deference": "respectful yielding to another's wishes",
   "diffidence": "shy lack of self-confidence"
  },
  "fixed": "I have heard Hector Blunt described as a woman hater, but I noticed that he joined Flora at the silver table with what might be described as alacrity.",
  "rule": "The word but contrasts the woman hater label with how he actually acted.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-1301-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I offered him my handkerchief, which he accepted with ___ protestations of thanks.",
  "options": [
   "fervent",
   "profuse",
   "gracious",
   "awkward"
  ],
  "answer": "fervent",
  "definitions": {
   "fervent": "showing intense, passionate feeling",
   "profuse": "given in great, flowing abundance",
   "gracious": "kind, polite, and considerate",
   "awkward": "clumsy or uncomfortable in manner"
  },
  "fixed": "I offered him my handkerchief, which he accepted with fervent protestations of thanks.",
  "rule": "He is ruefully covered in mud and gladly takes help, so his thanks are heartfelt.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-350-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She gave me a handful of assorted knuckles and rings to squeeze, and began talking ___.",
  "options": [
   "volubly",
   "breathlessly",
   "confidentially",
   "emphatically"
  ],
  "answer": "volubly",
  "definitions": {
   "volubly": "in a fluent, talkative way",
   "breathlessly": "in a way that is short of breath",
   "confidentially": "in a way meant to be kept private",
   "emphatically": "in a forceful, strongly stressed way"
  },
  "fixed": "She gave me a handful of assorted knuckles and rings to squeeze, and began talking volubly.",
  "rule": "The lady starts a flood of chat the moment the narrator arrives.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-87-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot waved his egg-spoon in vigorous ___ of my remark.",
  "options": [
   "refutation",
   "illustration",
   "derision",
   "dismissal"
  ],
  "answer": "refutation",
  "definitions": {
   "refutation": "proof or a statement that something is wrong",
   "illustration": "an example that makes a point clearer",
   "derision": "scornful mockery of someone or something",
   "dismissal": "a refusal to take something seriously"
  },
  "fixed": "Poirot waved his egg-spoon in vigorous refutation of my remark.",
  "rule": "Waving a spoon vigorously is a way of rejecting a remark. Refutation means showing it is wrong; agreement, endorsement, and confirmation would not need such energetic waving.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-1795-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He spoke more languidly than indignantly, knowing that he would thus ___ her further.",
  "options": [
   "provoke",
   "humiliate",
   "bewilder",
   "intrigue"
  ],
  "answer": "provoke",
  "definitions": {
   "provoke": "to make someone angry or stir them up",
   "humiliate": "to make someone feel ashamed or foolish",
   "bewilder": "to confuse someone completely",
   "intrigue": "to arouse someone's curiosity or interest"
  },
  "fixed": "He spoke more languidly than indignantly, knowing that he would thus provoke her further.",
  "rule": "He deliberately uses a lazy tone instead of an angry one, and the word further says she is already upset.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-1585-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "So very aristocratic-looking was the Count, that it would have seemed sheer heresy even to whisper that his father had been an ___ corn-chandler in Nantes--which, as a matter of fact, was the case.",
  "options": [
   "obscure",
   "industrious",
   "unscrupulous",
   "itinerant"
  ],
  "answer": "obscure",
  "definitions": {
   "obscure": "unknown, of low standing",
   "industrious": "hard-working and steady in one's efforts",
   "unscrupulous": "without moral principles or honesty",
   "itinerant": "traveling from place to place for work"
  },
  "fixed": "So very aristocratic-looking was the Count, that it would have seemed sheer heresy even to whisper that his father had been an obscure corn-chandler in Nantes--which, as a matter of fact, was the case.",
  "rule": "The point is the contrast between his aristocratic look and his humble origins, since whispering it would be heresy.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-245-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "One was poisoned; one died of cholera, an ___ case--not part of an epidemic; and one was found dead in his bed.",
  "options": [
   "isolated",
   "acute",
   "inexplicable",
   "incidental"
  ],
  "answer": "isolated",
  "definitions": {
   "isolated": "single and separate from others",
   "acute": "severe and sudden in its onset",
   "inexplicable": "impossible to explain or account for",
   "incidental": "happening as a minor side effect"
  },
  "fixed": "One was poisoned; one died of cholera, an isolated case--not part of an epidemic; and one was found dead in his bed.",
  "rule": "The phrase \"not part of an epidemic\" explains the missing word: a case that stands alone is isolated.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-333-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Then I lifted the lid to ___ the contents more closely.",
  "options": [
   "scrutinize",
   "identify",
   "catalogue",
   "sample"
  ],
  "answer": "scrutinize",
  "definitions": {
   "scrutinize": "to examine very carefully",
   "identify": "to recognize and name something",
   "catalogue": "to list items in an orderly way",
   "sample": "to try a small part of something"
  },
  "fixed": "Then I lifted the lid to scrutinize the contents more closely.",
  "rule": "The clue \"more closely\" shows the speaker wants to look carefully, which is what scrutinize means.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-236-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Up to modern times armed force was necessary for ___, but in this century of unrest a man like Li Chang Yen can use other means.",
  "options": [
   "conquest",
   "supremacy",
   "rebellion",
   "expansion"
  ],
  "answer": "conquest",
  "definitions": {
   "conquest": "taking control of a place or people by force",
   "supremacy": "the state of holding the highest power",
   "rebellion": "open resistance to a ruling authority",
   "expansion": "an increase in size or extent"
  },
  "fixed": "Up to modern times armed force was necessary for conquest, but in this century of unrest a man like Li Chang Yen can use other means.",
  "rule": "\"Armed force\" and the idea of a man gaining power by other means point to conquest, taking control by force.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-575-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I was all for energetic proceedings of some kind or other, and Poirot's ___ annoyed me.",
  "options": [
   "quiescence",
   "complacency",
   "secrecy",
   "pedantry"
  ],
  "answer": "quiescence",
  "definitions": {
   "quiescence": "a state of being quiet and inactive",
   "complacency": "smug satisfaction with things as they are",
   "secrecy": "the habit of keeping things hidden",
   "pedantry": "excessive concern with small rules and details"
  },
  "fixed": "I was all for energetic proceedings of some kind or other, and Poirot's quiescence annoyed me.",
  "rule": "The narrator wants \"energetic proceedings\" and is annoyed, so Poirot must be doing the opposite: staying inactive, or quiescence.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-563-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "If I remain silent, I shall be safe--if I say one word--not only I, but my nearest and dearest will suffer ___ things.",
  "options": [
   "unspeakable",
   "unforeseen",
   "ignominious",
   "unwarranted"
  ],
  "answer": "unspeakable",
  "definitions": {
   "unspeakable": "so terrible it is hard to put into words",
   "unforeseen": "not expected or predicted",
   "ignominious": "bringing public shame and disgrace",
   "unwarranted": "lacking good reason or justification"
  },
  "fixed": "If I remain silent, I shall be safe--if I say one word--not only I, but my nearest and dearest will suffer unspeakable things.",
  "rule": "The speaker is afraid of \"unlimited power\" and would stay silent to stay safe, so the suffering must be dreadful, not minor: unspeakable.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-548-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He had regained his ___, but as he took off the pince-nez he habitually wore and polished them I observed that his hand was shaking.",
  "options": [
   "composure",
   "confidence",
   "dignity",
   "bearing"
  ],
  "answer": "composure",
  "definitions": {
   "composure": "a calm, controlled state of mind",
   "confidence": "belief in one's own abilities",
   "dignity": "a manner showing self-respect and seriousness",
   "bearing": "the way a person stands and carries oneself"
  },
  "fixed": "He had regained his composure, but as he took off the pince-nez he habitually wore and polished them I observed that his hand was shaking.",
  "rule": "The word \"but\" signals contrast with the shaking hand, so he had recovered his calm outward manner: composure.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-893-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I hesitated, but her ___ glance drove me on.",
  "options": [
   "imperious",
   "piercing",
   "withering",
   "expectant"
  ],
  "answer": "imperious",
  "definitions": {
   "imperious": "bossy and commanding",
   "piercing": "sharp enough to seem to see through",
   "withering": "meant to make someone feel small",
   "expectant": "waiting eagerly for something to happen"
  },
  "fixed": "I hesitated, but her imperious glance drove me on.",
  "rule": "Her look \"drove me on\" despite his hesitation, so it was commanding: imperious.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-164-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "With a rather uncouth bow he ___ out of the room.",
  "options": [
   "shambled",
   "slunk",
   "swaggered",
   "scurried"
  ],
  "answer": "shambled",
  "definitions": {
   "shambled": "walked in a slow, awkward, dragging way",
   "slunk": "moved quietly, as if guilty or ashamed",
   "swaggered": "walked with a boldly arrogant air",
   "scurried": "ran with short, quick steps"
  },
  "fixed": "With a rather uncouth bow he shambled out of the room.",
  "rule": "The word \"uncouth\" means clumsy and unrefined, so his exit would also be awkward: shambled.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-209-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "As far as I could see, he had no reason to suspect that we had ___ his disguise.",
  "options": [
   "penetrated",
   "suspected",
   "examined",
   "fabricated"
  ],
  "answer": "penetrated",
  "definitions": {
   "penetrated": "got through or saw through",
   "suspected": "thought likely without having proof",
   "examined": "looked at closely and carefully",
   "fabricated": "made or put together, often falsely"
  },
  "fixed": "As far as I could see, he had no reason to suspect that we had penetrated his disguise.",
  "rule": "A disguise hides the truth, and the worry is that the detectives discovered it, so they had seen through it: penetrated.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-1233-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "However ___ you think me, I’d rather tell you.",
  "options": [
   "heartless",
   "disloyal",
   "shameless",
   "presumptuous"
  ],
  "answer": "heartless",
  "definitions": {
   "heartless": "cruel and without pity",
   "disloyal": "not faithful to someone who trusts you",
   "shameless": "feeling no shame about wrongdoing",
   "presumptuous": "too bold in assuming one is entitled"
  },
  "fixed": "However heartless you think me, I’d rather tell you.",
  "rule": "She is admitting she felt happy at news that is probably sad, and expects to be judged harshly, so she fears being seen as heartless.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-110-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Some overmastering terror seemed to be gaining the day; the features were ___ and twisted.",
  "options": [
   "distorted",
   "ghastly",
   "ashen",
   "flushed"
  ],
  "answer": "distorted",
  "definitions": {
   "distorted": "twisted out of its normal shape",
   "ghastly": "horrifying and deathly pale",
   "ashen": "pale gray, as from shock or fear",
   "flushed": "red in the face, as from emotion"
  },
  "fixed": "Some overmastering terror seemed to be gaining the day; the features were distorted and twisted.",
  "rule": "The face shows terror and is described as \"twisted\", so the missing word is a close match: distorted.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-854-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It meant Mirelle and a ___ of his pleasant, carefree life.",
  "options": [
   "continuance",
   "resumption",
   "preservation",
   "renewal"
  ],
  "answer": "continuance",
  "definitions": {
   "continuance": "the act of going on without stopping",
   "resumption": "the act of starting again after a pause",
   "preservation": "the act of keeping something safe and intact",
   "renewal": "the act of making something new again"
  },
  "fixed": "It meant Mirelle and a continuance of his pleasant, carefree life.",
  "rule": "The money means he keeps Mirelle and his \"pleasant\" life, so it will go on: continuance.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-58866-1679-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "But her ___ received several severe checks to their enthusiasm.",
  "options": [
   "partisans",
   "confidants",
   "benefactors",
   "spectators"
  ],
  "answer": "partisans",
  "definitions": {
   "partisans": "strong supporters of a person or cause",
   "confidants": "people trusted with one's private thoughts",
   "benefactors": "people who give money or help",
   "spectators": "people who watch an event"
  },
  "fixed": "But her partisans received several severe checks to their enthusiasm.",
  "rule": "Having \"enthusiasm\" for her and ranging themselves \"for\" the prisoner shows they are devoted supporters: partisans.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-180-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "On the boat, I knew better than to disturb my friend’s ___.",
  "options": [
   "solitude",
   "reverie",
   "slumber",
   "tranquility"
  ],
  "answer": "solitude",
  "definitions": {
   "solitude": "the state of being alone",
   "reverie": "a state of absent-minded daydreaming",
   "slumber": "a deep, restful sleep",
   "tranquility": "a state of calm and peace"
  },
  "fixed": "On the boat, I knew better than to disturb my friend’s solitude.",
  "rule": "Knowing \"better than to disturb\" him suggests he wanted to be left alone: solitude.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-1569-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "At the mention of the world-famous scientist, successor to the Curies, M. Desjardeaux positively ___ from his chair, his face purple with emotion.",
  "options": [
   "bounded",
   "lurched",
   "staggered",
   "recoiled"
  ],
  "answer": "bounded",
  "definitions": {
   "bounded": "jumped or leapt suddenly",
   "lurched": "moved suddenly in an unsteady way",
   "staggered": "walked unsteadily, almost falling over",
   "recoiled": "drew back in shock or disgust"
  },
  "fixed": "At the mention of the world-famous scientist, successor to the Curies, M. Desjardeaux positively bounded from his chair, his face purple with emotion.",
  "rule": "The strong emotion (a face purple with feeling) signals a sudden, energetic movement, so bounded fits.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-107-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I have ___ him, therefore, as Number One.",
  "options": [
   "designated",
   "regarded",
   "envisioned",
   "ranked"
  ],
  "answer": "designated",
  "definitions": {
   "designated": "officially named or labeled",
   "regarded": "considered or thought of in a certain way",
   "envisioned": "imagined as a future possibility",
   "ranked": "placed in order by position or quality"
  },
  "fixed": "I have designated him, therefore, as Number One.",
  "rule": "The previous sentence calls him the controlling force, and \"therefore\" shows that this leads to a label, Number One. Only designated means to give someone a name or title.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-799-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The corner he was in now was a tighter one than he had ever been in before, and ___ factors had arisen with which, for the moment, he did not know how to deal.",
  "options": [
   "unforeseen",
   "formidable",
   "intricate",
   "extraneous"
  ],
  "answer": "unforeseen",
  "definitions": {
   "unforeseen": "not expected or predicted",
   "formidable": "causing fear because hard to overcome",
   "intricate": "having many complicated interlocking parts",
   "extraneous": "not part of the main matter"
  },
  "fixed": "The corner he was in now was a tighter one than he had ever been in before, and unforeseen factors had arisen with which, for the moment, he did not know how to deal.",
  "rule": "He is in a tight corner and does not know how to deal with the factors, so they must have come as surprises.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-58866-43-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "My new acquaintance leaned forward, and discoursed ___, a great many of her terms being quite unintelligible to me.",
  "options": [
   "volubly",
   "technically",
   "earnestly",
   "didactically"
  ],
  "answer": "volubly",
  "definitions": {
   "volubly": "in a fluent, talkative way",
   "technically": "in a way relating to specialized details",
   "earnestly": "in a serious, sincere way",
   "didactically": "in a way meant to teach or lecture"
  },
  "fixed": "My new acquaintance leaned forward, and discoursed volubly, a great many of her terms being quite unintelligible to me.",
  "rule": "She used so many terms that the narrator could not follow them, which shows she was talking a lot. Volubly means talking fluently and at length.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-61262-903-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Our proceedings consisted in interviewing four ___ stewards and inquiring after a friend of Poirot’s who had crossed to New York on the 23rd.",
  "options": [
   "successive",
   "evasive",
   "obliging",
   "subordinate"
  ],
  "answer": "successive",
  "definitions": {
   "successive": "following one after another",
   "evasive": "avoiding giving direct answers",
   "obliging": "willing to do favors or help",
   "subordinate": "lower in rank or importance"
  },
  "fixed": "Our proceedings consisted in interviewing four successive stewards and inquiring after a friend of Poirot’s who had crossed to New York on the 23rd.",
  "rule": "They interviewed the stewards one at a time in order, so the stewards came one after another.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-1441-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Or had she deliberately ___ her name and given me the wrong address?",
  "options": [
   "withheld",
   "disguised",
   "falsified",
   "garbled"
  ],
  "answer": "withheld",
  "definitions": {
   "withheld": "refused to give or share",
   "disguised": "changed in appearance to hide the truth",
   "falsified": "changed in order to deceive",
   "garbled": "mixed up so as to be unclear"
  },
  "fixed": "Or had she deliberately withheld her name and given me the wrong address?",
  "rule": "She gave a wrong address, and the narrator wonders if she did not give her name on purpose. Withheld means kept back, which pairs with deliberately.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-69087-1410-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Mr. Hammond provided the necessary ___ by coming up to say good-by.",
  "options": [
   "diversion",
   "pretext",
   "opportunity",
   "respite"
  ],
  "answer": "diversion",
  "definitions": {
   "diversion": "something that draws attention away",
   "pretext": "a false reason given to hide the real one",
   "opportunity": "a favorable chance to do something",
   "respite": "a brief pause of relief"
  },
  "fixed": "Mr. Hammond provided the necessary diversion by coming up to say good-by.",
  "rule": "The next sentence says the narrator seized his chance and rose, so Hammond's good-bye distracted others. A diversion pulls attention elsewhere.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-370-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Said he hoped I was ___, and that he'd find me a good post.",
  "options": [
   "repentant",
   "dependable",
   "grateful",
   "obedient"
  ],
  "answer": "repentant",
  "definitions": {
   "repentant": "feeling sorry for wrongdoing",
   "dependable": "able to be trusted to follow through",
   "grateful": "feeling thankful for help received",
   "obedient": "willing to follow orders or rules"
  },
  "fixed": "Said he hoped I was repentant, and that he'd find me a good post.",
  "rule": "He promises to find the speaker a good job only if the speaker is sorry for past misdeeds.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-248-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "His nerve had completely broken, and he was in the most ___ state of terror.",
  "options": [
   "pitiable",
   "frantic",
   "feverish",
   "paralyzing"
  ],
  "answer": "pitiable",
  "definitions": {
   "pitiable": "deserving pity",
   "frantic": "wildly anxious and out of control",
   "feverish": "marked by restless, nervous excitement",
   "paralyzing": "so strong it prevents movement or action"
  },
  "fixed": "His nerve had completely broken, and he was in the most pitiable state of terror.",
  "rule": "His nerve is broken and he is terrified, so he is in a state that earns sympathy. Pitiable means arousing pity.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-61262-1484-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The police were anxious to interview O’Murphy, so a search was ___ at once.",
  "options": [
   "instituted",
   "authorized",
   "expedited",
   "widened"
  ],
  "answer": "instituted",
  "definitions": {
   "instituted": "started or set up",
   "authorized": "given official permission for",
   "expedited": "made to happen faster",
   "widened": "made broader in scope or extent"
  },
  "fixed": "The police were anxious to interview O’Murphy, so a search was instituted at once.",
  "rule": "The police were anxious, and \"at once\" shows urgency, and the next sentence says the car was discovered. So a search was begun. Instituted means started.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-61262-31-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Unknown to her, she is being ___ by three men and a middle-aged woman.",
  "options": [
   "shadowed",
   "guarded",
   "admired",
   "courted"
  ],
  "answer": "shadowed",
  "definitions": {
   "shadowed": "secretly followed",
   "guarded": "protected from harm or attack",
   "admired": "regarded with warm approval",
   "courted": "tried to win the affection of"
  },
  "fixed": "Unknown to her, she is being shadowed by three men and a middle-aged woman.",
  "rule": "\"Unknown to her\" means she does not notice the people, who are gathering behind her as she walks. Shadowed means secretly followed.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-863-208-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He pointed out to me the little house ___ by him and his fellow Belgians, and I promised to go and see him at an early date.",
  "options": [
   "inhabited",
   "rented",
   "owned",
   "restored"
  ],
  "answer": "inhabited",
  "definitions": {
   "inhabited": "lived in",
   "rented": "paid money to use for a time",
   "owned": "held as one's own property",
   "restored": "brought back to good condition"
  },
  "fixed": "He pointed out to me the little house inhabited by him and his fellow Belgians, and I promised to go and see him at an early date.",
  "rule": "The narrator promises to visit him there, so Belgians must live in the house. Inhabited means lived in.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-1756-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Presently Hippolyte, his man-servant, brought out coffee and a choice of ___.",
  "options": [
   "liqueurs",
   "aperitifs",
   "confections",
   "cigars"
  ],
  "answer": "liqueurs",
  "definitions": {
   "liqueurs": "sweet alcoholic drinks served after a meal",
   "aperitifs": "drinks served before a meal",
   "confections": "sweet foods such as candies",
   "cigars": "rolls of tobacco leaf for smoking"
  },
  "fixed": "Presently Hippolyte, his man-servant, brought out coffee and a choice of liqueurs.",
  "rule": "The sentence says a servant brought out coffee and a choice of something, so it must be something to drink alongside coffee. Only liqueurs fits.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-645-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "To make things clear and explain the position, I have ___ a rough sketch of the right-hand wing of the house.",
  "options": [
   "appended",
   "enclosed",
   "reproduced",
   "annotated"
  ],
  "answer": "appended",
  "definitions": {
   "appended": "added at the end",
   "enclosed": "placed inside, as in a letter",
   "reproduced": "made a copy of",
   "annotated": "added explanatory notes to"
  },
  "fixed": "To make things clear and explain the position, I have appended a rough sketch of the right-hand wing of the house.",
  "rule": "The sketch is meant to make things clear, so the writer must have added it to the account. Appended means attached or added on.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-393-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Possibly it marks his first ___ of danger.",
  "options": [
   "intimation",
   "experience",
   "acknowledgment",
   "contemplation"
  ],
  "answer": "intimation",
  "definitions": {
   "intimation": "a hint or sign that something is coming",
   "experience": "direct contact with an event or situation",
   "acknowledgment": "an admission that something is true",
   "contemplation": "long, deep thought about something"
  },
  "fixed": "Possibly it marks his first intimation of danger.",
  "rule": "The word 'first' and 'Possibly' suggest an early warning sign. An intimation of danger is a hint that danger is near.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-1720-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Ingles had been murdered, and his death was only too clearly the handiwork of that ___ Big Four.",
  "options": [
   "accursed",
   "notorious",
   "elusive",
   "clandestine"
  ],
  "answer": "accursed",
  "definitions": {
   "accursed": "hateful; under a curse",
   "notorious": "famous for something bad",
   "elusive": "hard to find, catch, or pin down",
   "clandestine": "kept secret, often for dishonest reasons"
  },
  "fixed": "Ingles had been murdered, and his death was only too clearly the handiwork of that accursed Big Four.",
  "rule": "The group is blamed for a murder, so the speaker views it with hatred. Accursed means damned or detestable, which matches that tone.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-332-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "There were one or two pieces of old silver, a baby shoe belonging to King Charles the First, some Chinese jade figures, and quite a number of African ___ and curios.",
  "options": [
   "implements",
   "relics",
   "ornaments",
   "textiles"
  ],
  "answer": "implements",
  "definitions": {
   "implements": "tools or instruments",
   "relics": "old objects kept because of their history",
   "ornaments": "small objects used for decoration",
   "textiles": "woven or knitted fabrics"
  },
  "fixed": "There were one or two pieces of old silver, a baby shoe belonging to King Charles the First, some Chinese jade figures, and quite a number of African implements and curios.",
  "rule": "The sentence lists physical objects in a cabinet, and 'curios' pairs with objects. Only implements, meaning tools, is a collectible object here.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-70114-1295-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "If you refuse again, you go headlong to ___, to meet your death in the dark waters below.",
  "options": [
   "eternity",
   "oblivion",
   "destruction",
   "disgrace"
  ],
  "answer": "eternity",
  "definitions": {
   "eternity": "endless time; the afterlife",
   "oblivion": "the state of being forgotten or unaware",
   "destruction": "the act of wrecking something completely",
   "disgrace": "loss of respect through shameful conduct"
  },
  "fixed": "If you refuse again, you go headlong to eternity, to meet your death in the dark waters below.",
  "rule": "The phrase 'to meet your death' explains where he is going. Eternity, the afterlife, is the only choice that matches death.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-61262-530-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He seemed interested, and questioned me rather narrowly as to the rents of flats in various ___.",
  "options": [
   "localities",
   "tenements",
   "configurations",
   "categories"
  ],
  "answer": "localities",
  "definitions": {
   "localities": "particular places or neighborhoods",
   "tenements": "run-down apartment buildings in crowded areas",
   "configurations": "particular arrangements of parts or rooms",
   "categories": "groups of things sharing common features"
  },
  "fixed": "He seemed interested, and questioned me rather narrowly as to the rents of flats in various localities.",
  "rule": "Rents of flats depend on where the flats are. Localities means neighborhoods, so it fits.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-72824-1348-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It will, indeed, be an extraordinary ___ to actually see and handle these historic rubies.",
  "options": [
   "privilege",
   "luxury",
   "responsibility",
   "thrill"
  ],
  "answer": "privilege",
  "definitions": {
   "privilege": "a special honor or advantage",
   "luxury": "something enjoyable but not truly necessary",
   "responsibility": "a duty one is expected to carry out",
   "thrill": "a sudden wave of excitement"
  },
  "fixed": "It will, indeed, be an extraordinary privilege to actually see and handle these historic rubies.",
  "rule": "The writer is delighted and flattering, calling the rubies historic. A special honor, a privilege, matches that happy tone.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-1083-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Did he hope that if the face were ___ she might not be identified?",
  "options": [
   "unrecognizable",
   "disfigured",
   "bandaged",
   "veiled"
  ],
  "answer": "unrecognizable",
  "definitions": {
   "unrecognizable": "impossible to identify",
   "disfigured": "spoiled in appearance, as by injury",
   "bandaged": "wrapped in strips of cloth",
   "veiled": "covered with a thin cloth"
  },
  "fixed": "Did he hope that if the face were unrecognizable she might not be identified?",
  "rule": "The clue is 'she might not be identified'. A face that cannot be identified is unrecognizable.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-198-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I had always fancied that his manner to Cynthia was rather ___, and that she on her side was inclined to be shy of him.",
  "options": [
   "constrained",
   "patronizing",
   "abrupt",
   "gallant"
  ],
  "answer": "constrained",
  "definitions": {
   "constrained": "stiff and awkward; held back",
   "patronizing": "treating others as less capable or important",
   "abrupt": "sudden and rough in manner",
   "gallant": "politely attentive, especially toward women"
  },
  "fixed": "I had always fancied that his manner to Cynthia was rather constrained, and that she on her side was inclined to be shy of him.",
  "rule": "Cynthia is described as shy of him, so their manner together is awkward on both sides. Constrained means stiff or restrained.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-2637-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He is one of those ___ men who find it hard to put things into words.",
  "options": [
   "inarticulate",
   "reserved",
   "stoic",
   "introspective"
  ],
  "answer": "inarticulate",
  "definitions": {
   "inarticulate": "unable to express oneself clearly",
   "reserved": "keeping one's feelings to oneself",
   "stoic": "enduring hardship without showing feeling",
   "introspective": "examining one's own thoughts and feelings"
  },
  "fixed": "He is one of those inarticulate men who find it hard to put things into words.",
  "rule": "The clause 'find it hard to put things into words' defines the word. Inarticulate means unable to express oneself in words.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-1457-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He looked me up and down with a sort of contemptuous ___.",
  "options": [
   "disfavour",
   "condescension",
   "scrutiny",
   "amusement"
  ],
  "answer": "disfavour",
  "definitions": {
   "disfavour": "dislike or disapproval",
   "condescension": "an attitude of superiority toward others",
   "scrutiny": "close and careful examination",
   "amusement": "the feeling of finding something funny"
  },
  "fixed": "He looked me up and down with a sort of contemptuous disfavour.",
  "rule": "The word 'contemptuous' shows the look was scornful, so the noun must be negative. Disfavour means disapproval.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1683-8",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She had used him as a cat’s-paw, and now, in his jealous rage, he turned and ___ her, declaring that throughout he had acted at her instigation.",
  "options": [
   "denounced",
   "betrayed",
   "blackmailed",
   "disowned"
  ],
  "answer": "denounced",
  "definitions": {
   "denounced": "publicly accused or condemned",
   "betrayed": "broke someone's trust through disloyalty",
   "blackmailed": "threatened to reveal secrets to gain something",
   "disowned": "refused to acknowledge as one's own"
  },
  "fixed": "She had used him as a cat’s-paw, and now, in his jealous rage, he turned and denounced her, declaring that throughout he had acted at her instigation.",
  "rule": "He is in a 'jealous rage' and blames her for his actions, so he accuses her. Denounced means publicly condemned.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-800-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "His brow was ___, and there was none of the easy, jaunty manner which sat so well upon him.",
  "options": [
   "furrowed",
   "beaded",
   "pallid",
   "flushed"
  ],
  "answer": "furrowed",
  "definitions": {
   "furrowed": "wrinkled, as when frowning",
   "beaded": "covered with small drops of moisture",
   "pallid": "pale, as from illness or fear",
   "flushed": "red in the face, as from emotion"
  },
  "fixed": "His brow was furrowed, and there was none of the easy, jaunty manner which sat so well upon him.",
  "rule": "He strolls 'deep in thought' and has lost his jaunty manner, so his forehead shows worry. Furrowed means wrinkled with a frown.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-1967-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I observed her more closely than I had done ___.",
  "options": [
   "heretofore",
   "elsewhere",
   "otherwise",
   "deliberately"
  ],
  "answer": "heretofore",
  "definitions": {
   "heretofore": "until now; before this",
   "elsewhere": "in or to some other place",
   "otherwise": "in a different way or manner",
   "deliberately": "on purpose, after careful thought"
  },
  "fixed": "I observed her more closely than I had done heretofore.",
  "rule": "The verb 'had done' is past perfect, so the comparison is with a time before now. Heretofore means until this point.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-72824-1831-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The valet was positive in his ___ that this was not the case.",
  "options": [
   "assurances",
   "convictions",
   "recollections",
   "suspicions"
  ],
  "answer": "assurances",
  "definitions": {
   "assurances": "confident statements meant to remove doubt",
   "convictions": "firmly held beliefs",
   "recollections": "things remembered from the past",
   "suspicions": "feelings that something is wrong"
  },
  "fixed": "The valet was positive in his assurances that this was not the case.",
  "rule": "Being 'positive' that something is not the case describes a confident promise. Assurances are statements that settle doubt.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-404-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The next few hours saw a vast quantity of business rapidly ___.",
  "options": [
   "transacted",
   "accumulated",
   "delegated",
   "negotiated"
  ],
  "answer": "transacted",
  "definitions": {
   "transacted": "carried out or conducted",
   "accumulated": "gathered up gradually over time",
   "delegated": "handed over to someone else",
   "negotiated": "discussed in order to reach agreement"
  },
  "fixed": "The next few hours saw a vast quantity of business rapidly transacted.",
  "rule": "The sentence is about real business done during working hours. Business is transacted, meaning carried out.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-419-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He darted from one object to the other with the ___ of a grasshopper.",
  "options": [
   "agility",
   "restlessness",
   "precision",
   "frenzy"
  ],
  "answer": "agility",
  "definitions": {
   "agility": "quickness and ease of movement",
   "restlessness": "a constant urge to keep moving about",
   "precision": "exactness and accuracy of detail",
   "frenzy": "a state of wild, uncontrolled excitement"
  },
  "fixed": "He darted from one object to the other with the agility of a grasshopper.",
  "rule": "He 'darted' like a grasshopper, which moves quickly and lightly. Agility is quick, graceful movement.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-69087-109-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The last of them, a redoubtable lady called Miss Russell, has reigned undisputed for five years, twice as long as any of her ___.",
  "options": [
   "predecessors",
   "contemporaries",
   "rivals",
   "subordinates"
  ],
  "answer": "predecessors",
  "definitions": {
   "predecessors": "people who held a job or position before",
   "contemporaries": "people living or working at the same time",
   "rivals": "people competing for the same goal",
   "subordinates": "people ranking below another in authority"
  },
  "fixed": "The last of them, a redoubtable lady called Miss Russell, has reigned undisputed for five years, twice as long as any of her predecessors.",
  "rule": "She is 'the last of them', so the others came before her. Predecessors are those who held the post earlier.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-1681-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Throughout, Madame Beroldy ___ her accusers with complete sang froid and self possession.",
  "options": [
   "confronted",
   "outwitted",
   "disarmed",
   "intimidated"
  ],
  "answer": "confronted",
  "definitions": {
   "confronted": "faced boldly",
   "outwitted": "defeated by being more clever",
   "disarmed": "removed anger or suspicion from",
   "intimidated": "frightened into giving way"
  },
  "fixed": "Throughout, Madame Beroldy confronted her accusers with complete sang froid and self possession.",
  "rule": "She faces people who accuse her, with cool nerve and self-control. Confronted means faced directly.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-1348-5",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Soon I will make up to you for all those sad years of ___ and emptiness.--Your ever-adoring,",
  "options": [
   "separation",
   "longing",
   "regret",
   "neglect"
  ],
  "answer": "separation",
  "definitions": {
   "separation": "being apart",
   "longing": "a strong, persistent wish for something",
   "regret": "sadness over something done or lost",
   "neglect": "failure to give proper care or attention"
  },
  "fixed": "Soon I will make up to you for all those sad years of separation and emptiness.--Your ever-adoring,",
  "rule": "The writer promises to make up for 'sad years' alongside 'emptiness', so the lovers were apart. Separation fits.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-72824-1187-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She and Lenox discussed several models with artistic ___.",
  "options": [
   "fervour",
   "discernment",
   "flair",
   "ambition"
  ],
  "answer": "fervour",
  "definitions": {
   "fervour": "intense passion",
   "discernment": "the ability to judge well",
   "flair": "a natural talent or stylish ability",
   "ambition": "a strong desire to achieve something"
  },
  "fixed": "She and Lenox discussed several models with artistic fervour.",
  "rule": "Two people discussing models with 'artistic' enthusiasm would show strong feeling. Fervour means passionate intensity.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-873-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It occurred to me very forcibly at that moment that to harbour Miss Howard and Alfred Inglethorp under the same roof, and keep the peace between them, was likely to prove a ___ task, and I did not envy John.",
  "options": [
   "herculean",
   "delicate",
   "thankless",
   "tedious"
  ],
  "answer": "herculean",
  "definitions": {
   "herculean": "requiring enormous strength or effort",
   "delicate": "requiring careful, tactful handling",
   "thankless": "unlikely to be appreciated or rewarded",
   "tedious": "tiresome because long and dull"
  },
  "fixed": "It occurred to me very forcibly at that moment that to harbour Miss Howard and Alfred Inglethorp under the same roof, and keep the peace between them, was likely to prove a herculean task, and I did not envy John.",
  "rule": "The clue is that the narrator 'did not envy John' for having to keep two enemies at peace, so the task must be extremely hard.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-159-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He spoke in French and his tones were rich and ___.",
  "options": [
   "unctuous",
   "resonant",
   "plaintive",
   "cultured"
  ],
  "answer": "unctuous",
  "definitions": {
   "unctuous": "smooth and oily in a flattering, overly polite way",
   "resonant": "deep, full, and echoing",
   "plaintive": "sounding sad and mournful",
   "cultured": "refined in manner and education"
  },
  "fixed": "He spoke in French and his tones were rich and unctuous.",
  "rule": "'Rich' beside the blank points to a smooth voice, and unctuous means smooth and oily in an overly polite, flattering way.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-69087-2983-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Still somewhat doubtful, I ___ in the drawers of my desk and produced an untidy pile of manuscript which I handed over to him.",
  "options": [
   "rummaged",
   "floundered",
   "puttered",
   "dithered"
  ],
  "answer": "rummaged",
  "definitions": {
   "rummaged": "searched through things in a messy, hurried way",
   "floundered": "struggled clumsily without making progress",
   "puttered": "busied oneself in an idle, aimless way",
   "dithered": "acted nervously and indecisively"
  },
  "fixed": "Still somewhat doubtful, I rummaged in the drawers of my desk and produced an untidy pile of manuscript which I handed over to him.",
  "rule": "The clue is that the narrator then 'produced an untidy pile' from the drawers, which shows he searched through them.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-1723-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I do not believe Madame Renauld to be in league with Madame Daubreuil for several reasons, some of which I have already ___ to you.",
  "options": [
   "enumerated",
   "disclosed",
   "explained",
   "hinted"
  ],
  "answer": "enumerated",
  "definitions": {
   "enumerated": "listed one by one",
   "disclosed": "made known something kept secret",
   "explained": "made clear and easy to understand",
   "hinted": "suggested without saying directly"
  },
  "fixed": "I do not believe Madame Renauld to be in league with Madame Daubreuil for several reasons, some of which I have already enumerated to you.",
  "rule": "The clue is 'several reasons, some of which I have already ___ to you': the speaker has already listed them, and the next line says the others are self-evident.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-1735-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Derek laughed suddenly--a harsh, ___ laugh.",
  "options": [
   "disagreeable",
   "mirthless",
   "sardonic",
   "hollow"
  ],
  "answer": "disagreeable",
  "definitions": {
   "disagreeable": "unpleasant",
   "mirthless": "without joy or amusement",
   "sardonic": "grimly mocking and scornful",
   "hollow": "sounding empty and insincere"
  },
  "fixed": "Derek laughed suddenly--a harsh, disagreeable laugh.",
  "rule": "The clue is 'harsh', which sets a negative tone, so the blank needs another unpleasant word.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-301-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "On one of the outgoing footmarks stained with blood there is ___ an ingoing one.",
  "options": [
   "superimposed",
   "interspersed",
   "embedded",
   "juxtaposed"
  ],
  "answer": "superimposed",
  "definitions": {
   "superimposed": "placed on top of something else",
   "interspersed": "scattered among other things",
   "embedded": "fixed firmly in a surrounding mass",
   "juxtaposed": "placed side by side"
  },
  "fixed": "On one of the outgoing footmarks stained with blood there is superimposed an ingoing one.",
  "rule": "The clue is that an ingoing footmark can be seen 'on' an outgoing one, so one print lies on top of the other.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-72824-1302-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The Examining Magistrate prided himself on his ___ of manner, and did his best to put her at her ease.",
  "options": [
   "geniality",
   "refinement",
   "delicacy",
   "formality"
  ],
  "answer": "geniality",
  "definitions": {
   "geniality": "friendly, cheerful warmth",
   "refinement": "elegant, polished politeness",
   "delicacy": "tactful sensitivity in handling matters",
   "formality": "strict observance of proper manners"
  },
  "fixed": "The Examining Magistrate prided himself on his geniality of manner, and did his best to put her at her ease.",
  "rule": "The clue is that he 'did his best to put her at her ease', which fits a warm, friendly manner.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-164-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "What she saw in the man I cannot imagine, but she was always asking him up to the house, and often went off for long ___ with him.",
  "options": [
   "expeditions",
   "conversations",
   "consultations",
   "retreats"
  ],
  "answer": "expeditions",
  "definitions": {
   "expeditions": "organized trips made for a purpose",
   "conversations": "informal talks between two or more people",
   "consultations": "meetings held to seek advice",
   "retreats": "quiet getaways for rest or reflection"
  },
  "fixed": "What she saw in the man I cannot imagine, but she was always asking him up to the house, and often went off for long expeditions with him.",
  "rule": "The clue is 'went off' with him: you go off on trips, and the sentence says she liked his company.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-69087-871-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "I wanted to tell Caroline that large numbers of murderers ___ had nice manners, but the presence of Flora restrained me.",
  "targetWords": [
   "numbers"
  ],
  "options": [
   "have",
   "has"
  ],
  "answer": "have",
  "fixed": "I wanted to tell Caroline that large numbers of murderers have had nice manners, but the presence of Flora restrained me.",
  "hint1": "Ignore the singular-looking 'of murderers' tail and find the noun that is actually plural at the front of the subject.",
  "rule": "The verb agrees with the head noun of the subject, not the noun inside the 'of' phrase. Here the subject is the plural 'numbers', so the sentence needs 'have'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-693-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Your description of that stranger ___ rather vague.",
  "targetWords": [
   "description"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "Your description of that stranger was rather vague.",
  "hint1": "A noun in the 'of that stranger' phrase sits right before the verb, but it is not the subject.",
  "rule": "A verb agrees with its true subject, not the noun closest to it. The subject is the singular 'description', so use 'was'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-2089-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "His tone in uttering that name ___ so peculiar that I looked up, puzzled.",
  "targetWords": [
   "tone"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "His tone in uttering that name was so peculiar that I looked up, puzzled.",
  "hint1": "Look past the phrase 'in uttering that name' to the noun it describes.",
  "rule": "Phrases that start with a preposition do not change the subject. The subject is the singular 'tone', so the verb is 'was'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-2150-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "This kind of simple entertainment ___ very popular in King’s Abbot.",
  "targetWords": [
   "kind"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "This kind of simple entertainment is very popular in King’s Abbot.",
  "hint1": "The phrase 'of simple entertainment' follows the real subject.",
  "rule": "The subject is the singular 'kind', and 'of simple entertainment' is just a modifier. So the verb must be singular: 'is'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-365-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "You see, your late husband insured his life for rather a large sum, and in such a case the Company always ___ to satisfy itself as to a few details.",
  "targetWords": [
   "company"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "has",
  "fixed": "You see, your late husband insured his life for rather a large sum, and in such a case the Company always has to satisfy itself as to a few details.",
  "hint1": "Think about whether the Company acts as one unit, and notice the pronoun 'itself'.",
  "rule": "A company acting as one body is a singular collective noun, and the later pronoun 'itself' confirms it. So the verb is 'has'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-58866-1993-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The terms of her letter ___ those of a woman genuinely in love, and she would probably deeply resent being offered money.",
  "targetWords": [
   "terms"
  ],
  "options": [
   "are",
   "is"
  ],
  "answer": "are",
  "fixed": "The terms of her letter are those of a woman genuinely in love, and she would probably deeply resent being offered money.",
  "hint1": "The singular noun 'letter' is closer to the verb than the real subject is.",
  "rule": "The verb agrees with the head noun, not the nearest noun. The subject is the plural 'terms', so use 'are'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-69087-2897-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "It was she whom I had seen that Sunday, and the cause of her embarrassment ___ clear enough now.",
  "targetWords": [
   "cause"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "It was she whom I had seen that Sunday, and the cause of her embarrassment was clear enough now.",
  "hint1": "The noun 'embarrassment' is right before the verb, but it belongs to an 'of' phrase.",
  "rule": "The subject is the singular 'cause', not the noun in 'of her embarrassment'. So the singular verb 'was' is correct.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-72824-2158-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Poirot greeted her with his usual politeness, which ___ never without effect on that particular class.",
  "targetWords": [
   "politeness"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "Poirot greeted her with his usual politeness, which was never without effect on that particular class.",
  "hint1": "Find the noun that 'which' points back to.",
  "rule": "A relative pronoun like 'which' takes the number of the noun it refers to. It refers to the singular 'politeness', so use 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-69087-1597-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Miss Ganett ___ one of the chief of our newsmongers.",
  "targetWords": [
   "ganett"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "Miss Ganett is one of the chief of our newsmongers.",
  "hint1": "Plural words later in the sentence should not pull the verb along.",
  "rule": "The subject is the single person 'Miss Ganett', so the verb is 'is'. The plural 'newsmongers' comes after the verb and does not change it.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-72824-2306-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The Comte's charm of manner ___ usually wasted on his own sex.",
  "targetWords": [
   "charm"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The Comte's charm of manner was usually wasted on his own sex.",
  "hint1": "Which noun is the thing being wasted: the charm, or something inside the 'of' phrase?",
  "rule": "The subject is the singular 'charm'; 'of manner' only describes it. Use the singular verb 'was'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-70114-1783-7",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "To say more is unnecessary, to any one who ___ the acute intelligence of my friend Hastings.",
  "targetWords": [
   "one"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "has",
  "fixed": "To say more is unnecessary, to any one who has the acute intelligence of my friend Hastings.",
  "hint1": "Find the noun that 'who' refers to.",
  "rule": "'Who' takes the number of its antecedent, here the singular 'one' in 'any one'. So the verb is 'has'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-61262-1525-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Our people ___ going through France with a toothcomb.",
  "targetWords": [
   "people"
  ],
  "options": [
   "are",
   "is"
  ],
  "answer": "are",
  "fixed": "Our people are going through France with a toothcomb.",
  "hint1": "Do not let the singular place name 'France' decide the verb.",
  "rule": "'People' is plural in meaning and takes a plural verb. The subject is 'people', so use 'are'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-69087-1675-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "By arrangement with the police, very little ___ allowed to come out.",
  "targetWords": [
   "little"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "By arrangement with the police, very little was allowed to come out.",
  "hint1": "The sentence opens with a phrase naming the police, a plural-sounding group, but it is not the subject.",
  "rule": "'Very little' means a small amount and is singular. The opening phrase is not the subject, so use 'was'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-1555-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "His eyes ___ flickering with excitement, his chest was swelled to the uttermost.",
  "targetWords": [
   "eyes"
  ],
  "options": [
   "were",
   "was"
  ],
  "answer": "were",
  "fixed": "His eyes were flickering with excitement, his chest was swelled to the uttermost.",
  "hint1": "Notice that the singular 'excitement' comes right after the verb and the next clause has a singular subject.",
  "rule": "The subject 'eyes' is plural, so the verb is 'were'. The singular 'chest' belongs to the next clause and does not affect this one.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-1789-6",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Nevertheless, there ___ one thing that the Comte could recognize infallibly when he saw it.",
  "targetWords": [
   "thing"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "Nevertheless, there was one thing that the Comte could recognize infallibly when he saw it.",
  "hint1": "The subject comes after the verb in a \"there\" sentence.",
  "rule": "In a \"there was/were\" sentence, the verb agrees with the noun that follows it. Here the subject is the singular \"thing,\" so the verb is \"was.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-61262-1645-9",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "We have, of course, received many letters from all over England, but each clue, so far, ___ ended in disappointment.",
  "targetWords": [
   "clue"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "has",
  "fixed": "We have, of course, received many letters from all over England, but each clue, so far, has ended in disappointment.",
  "hint1": "Ignore the interrupter and the plural \"letters\" in the first clause.",
  "rule": "\"Each\" is singular, so it takes a singular verb, and the interrupter \"so far\" does not change that. The subject \"clue\" needs \"has.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-69087-109-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The Ferrars only came to live here just over a year ago, but a halo of gossip ___ surrounded Ackroyd for many years past.",
  "targetWords": [
   "halo"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "has",
  "fixed": "The Ferrars only came to live here just over a year ago, but a halo of gossip has surrounded Ackroyd for many years past.",
  "hint1": "Look past the \"of gossip\" phrase to find the real subject.",
  "rule": "The verb agrees with the head noun, not the noun in the \"of\" phrase. The subject is the singular \"halo,\" so the verb is \"has.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-1833-3",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "No, I’m afraid the plates and dishes ___ been all washed up by now.",
  "targetWords": [
   "plates"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "have",
  "fixed": "No, I’m afraid the plates and dishes have been all washed up by now.",
  "hint1": "Two nouns are joined by \"and.\"",
  "rule": "Subjects joined by \"and\" form a compound subject and take a plural verb. \"Plates and dishes\" needs \"have.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-3061-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Didn't I tell you there ___ no end to the lies women will tell about their jewellery?",
  "targetWords": [
   "end"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "Didn't I tell you there is no end to the lies women will tell about their jewellery?",
  "hint1": "The plural \"lies\" is inside a phrase and is not the subject.",
  "rule": "In a \"there is/are\" sentence, find the noun after the verb that is the real subject. It is the singular \"end,\" not \"lies\" in the \"to\" phrase, so the verb is \"is.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-70114-1196-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Poirot has his virtues, but modesty ___ not one of them.",
  "targetWords": [
   "modesty"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "Poirot has his virtues, but modesty is not one of them.",
  "hint1": "Do not let \"virtues\" or \"them\" pull the verb toward the plural.",
  "rule": "The verb agrees with its subject, not with a noun that comes later or sits nearby. The subject is the singular \"modesty,\" so the verb is \"is.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-61262-258-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Gregory Rolf ___ there with two men from Scotland Yard.",
  "targetWords": [
   "rolf"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "Gregory Rolf was there with two men from Scotland Yard.",
  "hint1": "The phrase \"with two men\" is an add-on, not part of the subject.",
  "rule": "A phrase starting with \"with\" does not make the subject plural. The subject is the single person \"Gregory Rolf,\" so the verb is \"was.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-1494-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a special train leaving for Dover in an hour’s time, with a further contingent from Scotland Yard.",
  "targetWords": [
   "train"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "There is a special train leaving for Dover in an hour’s time, with a further contingent from Scotland Yard.",
  "hint1": "The subject follows the verb.",
  "rule": "In a \"there\" sentence, the verb agrees with the noun after it. The subject is the singular \"train,\" and the \"with\" phrase does not add to it, so use \"is.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-72824-2575-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ a look on his face--ah! at the moment I could not understand it--a look haunted and terrible.",
  "targetWords": [
   "look"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was a look on his face--ah! at the moment I could not understand it--a look haunted and terrible.",
  "hint1": "Ignore the interrupter and find the noun after the verb.",
  "rule": "In a \"there\" sentence, the verb agrees with the noun that follows. The subject is the single \"look,\" so the verb is \"was.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-72824-2249-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "As to what I mean--I mean, Monsieur, that there ___ a second car with a lady in it.",
  "targetWords": [
   "car"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "As to what I mean--I mean, Monsieur, that there is a second car with a lady in it.",
  "hint1": "The subject comes after the verb, and a \"with\" phrase follows it.",
  "rule": "The verb agrees with the noun after \"there.\" The subject is the singular \"car,\" and \"with a lady\" does not change that, so use \"is.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-863-1857-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "In spite of myself, my opinion of his sagacity ___ immeasurably heightened.",
  "targetWords": [
   "opinion"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "In spite of myself, my opinion of his sagacity was immeasurably heightened.",
  "hint1": "Find the head noun before the \"of\" phrase.",
  "rule": "The verb agrees with the head noun, not the noun inside an \"of\" phrase. The subject is the singular \"opinion,\" so the verb is \"was.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-70114-1175-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "On the floor ___ Sonia Daviloff, gagged and bound, with a great wad of saturated cotton wool over her nose and mouth.",
  "targetWords": [
   "daviloff"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "On the floor was Sonia Daviloff, gagged and bound, with a great wad of saturated cotton wool over her nose and mouth.",
  "hint1": "The sentence is inverted, so the subject comes after the verb.",
  "rule": "When a sentence begins with a place phrase, the subject often follows the verb. The subject is the single person \"Sonia Daviloff,\" so use \"was.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-58866-201-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "I am an admirer of beauty, and here ___ one whom nobody could have passed without remark.",
  "targetWords": [
   "one"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "I am an admirer of beauty, and here was one whom nobody could have passed without remark.",
  "hint1": "The sentence is inverted, and \"nobody\" is not the subject of this verb.",
  "rule": "After \"here,\" the subject follows the verb. The subject is the singular \"one\" (a single beautiful girl), so the verb is \"was.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-72824-830-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The errand on which the secretary had come ___ clearly distasteful to him.",
  "targetWords": [
   "errand"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The errand on which the secretary had come was clearly distasteful to him.",
  "hint1": "The subject is separated from the verb by a long clause.",
  "rule": "A clause between the subject and verb does not change the subject. The subject is the singular \"errand,\" so the verb is \"was.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "agree-61262-921-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "We will dismiss the thin air theory, which ___ not practicable at the present stage of science, and consider what is likely to have become of it.",
  "targetWords": [
   "theory"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "We will dismiss the thin air theory, which is not practicable at the present stage of science, and consider what is likely to have become of it.",
  "hint1": "\"Which\" refers back to a noun.",
  "rule": "A relative pronoun like \"which\" takes the number of the noun it refers to. It refers to the singular \"theory,\" so the verb is \"is.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-69087-3061-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Poirot leaned forward and shot the last words triumphantly at us, drawing back afterwards with the air of one who ___ made a decided hit.",
  "targetWords": [
   "one"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "has",
  "fixed": "Poirot leaned forward and shot the last words triumphantly at us, drawing back afterwards with the air of one who has made a decided hit.",
  "hint1": "Check what \"who\" refers to.",
  "rule": "\"Who\" takes the number of its antecedent. The antecedent is the singular \"one,\" so the verb is \"has.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-662-14",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "It was clear, from the first, that out of several hundred, probably, applicants for No. 4, Montagu Mansions only the Robinsons ___ considered suitable.",
  "targetWords": [
   "robinsons"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "It was clear, from the first, that out of several hundred, probably, applicants for No. 4, Montagu Mansions only the Robinsons were considered suitable.",
  "hint1": "The subject is far from the verb, after a long opening phrase.",
  "rule": "Find the real subject after the long phrase. \"The Robinsons\" is plural, so the verb is \"were.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-58866-1595-8",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Also, without doubt, there ___ dust on my coat.",
  "targetWords": [
   "dust"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "Also, without doubt, there is dust on my coat.",
  "hint1": "Ignore the interrupter and find the noun after the verb.",
  "rule": "In a \"there\" sentence, the verb agrees with the noun after it. \"Dust\" is a singular noncount noun, so the verb is \"is.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-69087-2240-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Caroline and Miss Ganett ___ both slightly ruffled as is often the case during one of these festive evenings.",
  "targetWords": [
   "caroline"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "Caroline and Miss Ganett were both slightly ruffled as is often the case during one of these festive evenings.",
  "hint1": "The subject is a compound joined by and.",
  "rule": "Two subjects joined by \"and\" take a plural verb. Caroline and Miss Ganett together are plural, so the verb is \"were\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-58866-665-8",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "And then there ___ several curious little points that do not seem to fit in.",
  "targetWords": [
   "points"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "are",
  "fixed": "And then there are several curious little points that do not seem to fit in.",
  "hint1": "The sentence is inverted: the subject comes after the verb, not before it.",
  "rule": "In a sentence beginning with \"there\", the verb agrees with the noun that follows it. The subject is \"points\", which is plural, so the verb is \"are\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-58866-1620-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Equally, there ___ often an excellent reason for not mentioning them.",
  "targetWords": [
   "reason"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "Equally, there is often an excellent reason for not mentioning them.",
  "hint1": "The sentence is inverted, and a plural pronoun (them) appears later in the sentence.",
  "rule": "With \"there\", find the real subject after the verb. The subject is the singular \"reason\", not \"them\", so the verb is \"is\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-61262-675-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "But the interior of this cat ___ perfectly delicate.",
  "targetWords": [
   "interior"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "But the interior of this cat is perfectly delicate.",
  "hint1": "Ignore the noun inside the \"of ...\" phrase.",
  "rule": "The subject is \"interior\", and the phrase \"of this cat\" only modifies it. A singular subject takes the singular verb \"is\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-70114-1364-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "I saw the latter spring back, his arm raised, then suddenly a dense volume of smoke ___ rising round me, choking me--killing me--",
  "targetWords": [
   "volume"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "I saw the latter spring back, his arm raised, then suddenly a dense volume of smoke was rising round me, choking me--killing me--",
  "hint1": "Look past the noun in the \"of ...\" phrase.",
  "rule": "The subject is \"volume\", not \"smoke\" or anything nearer the verb. \"Volume\" is singular, so the verb is \"was\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-69087-2430-21",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "How many husbands who have deceived their wives ___ comfortably to their graves, carrying their secret with them!",
  "targetWords": [
   "husbands"
  ],
  "options": [
   "go",
   "goes"
  ],
  "answer": "go",
  "fixed": "How many husbands who have deceived their wives go comfortably to their graves, carrying their secret with them!",
  "hint1": "The subject is separated from its verb by a long clause.",
  "rule": "The verb agrees with the head noun \"husbands\", even with a clause between them. \"Husbands\" is plural, so the verb is \"go\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-763-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The firm was an old-established one in Lincoln's Inn Fields, and after a few minutes' delay Katherine was shown into the presence of the senior partner, a kindly, elderly man with shrewd blue eyes and a fatherly manner.",
  "optionalCommas": [
   15
  ],
  "rule": "Put a comma before 'and' joining two independent clauses, and set off the appositive 'a kindly, elderly man...' after 'partner'. 'Kindly, elderly' are coordinate adjectives, so they take a comma.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-780-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A slim, elderly Frenchwoman, rather like a dreaming duchess, received her, and Katherine spoke with a certain naïveté.",
  "optionalCommas": [],
  "rule": "Use a comma between coordinate adjectives (slim, elderly), commas around the removable phrase 'rather like a dreaming duchess', and a comma before 'and' joining two independent clauses.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-689-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mr. Inglethorp’s reason for not returning last night was, I believe, that he had forgotten the latch-key.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of a nonessential interrupter that could be removed. Here 'I believe' interrupts the sentence, so it gets a comma on each side.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-190-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The little nurse withdrew, and Cynthia promptly took a jar from the shelf, refilled the bottle, and placed it on the table outside the door.",
  "optionalCommas": [
   15
  ],
  "rule": "Put a comma before 'and' joining two independent clauses, and separate the items in a series of actions with commas.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-1946-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Georges Conneau, therefore, planned the crime with Madame Renauld as his accomplice.",
  "optionalCommas": [],
  "rule": "A transitional word like 'therefore' in the middle of a clause is set off by commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-61262-2001-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "By driving to the station at once, we were just able to catch a train to London, though not the principal express.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase ('By driving to the station at once') and before the contrasting add-on 'though not the principal express'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-1579-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A quarter of an hour later, spick and span in his brown suit, Poirot entered the Examining Magistrate's room.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase and another after the descriptive phrase 'spick and span in his brown suit' that comes before the subject.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-576-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The doctor hastened forward, a cloak was thrown over Mrs. Renauld’s shoulders, and a slow procession went down the stairs.",
  "optionalCommas": [],
  "rule": "Separate items in a series of independent clauses with commas, including one before 'and'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-13-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Their country-place, Styles Court, had been purchased by Mr. Cavendish early in their married life.",
  "optionalCommas": [],
  "rule": "'Styles Court' renames the country-place and is nonessential, so it gets commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-852-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Paying no attention to Poirot, I went on, warming to the story.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory participial phrase and another before the trailing modifier 'warming to the story'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-2871-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The hall bell pealed, and Hippolyte, in a grave and decorous manner, went to open the door.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, and commas on both sides of the removable phrase 'in a grave and decorous manner'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-3104-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "When I was sufficiently master of myself to be able to realize what was going on, Ralph Paton was standing by his wife, her hand in his, and he was smiling across the room at me.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory clause, commas around 'her hand in his', and a comma before 'and' joining two independent clauses.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-776-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A few minutes later Miss Russell, summoned by Parker, entered the room.",
  "optionalCommas": [
   3
  ],
  "rule": "'Summoned by Parker' is nonessential, so it is set off by commas on both sides.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-414-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I saw the repulsion, the horror, in Ackroyd’s face.",
  "optionalCommas": [],
  "rule": "'The horror' renames and sharpens 'the repulsion' and is nonessential, so it takes commas on both sides.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-58866-120-7",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I shall probably need your services for a considerable period of time, as it may be necessary for you to go out to Santiago, where I spent several years of my life.",
  "optionalCommas": [],
  "rule": "Put a comma before the explanatory 'as' clause, and a comma before 'where I spent...', which adds nonessential information about Santiago.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-2085-21",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Had Jack Renauld, returning to see Marthe Daubreuil, come face to face instead with Bella Duveen, the girl he had heartlessly thrown over?",
  "optionalCommas": [],
  "rule": "Set off the interrupting phrase 'returning to see Marthe Daubreuil' with two commas, and the appositive 'the girl he had heartlessly thrown over' with a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-5-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Nevertheless, in view of the world-wide notoriety which attended it, I have been asked, both by my friend Poirot and the family themselves, to write an account of the whole story.",
  "optionalCommas": [
   0
  ],
  "rule": "Commas follow the introductory word and phrase, and the interrupting phrase 'both by my friend Poirot and the family themselves' is set off on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-61262-1954-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "While we were waiting for it to be answered, Poirot walked up and down, looking about him approvingly.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory clause and another before the trailing participial phrase.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-1643-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The Count rose, picked up his handsome stick from the corner, and, with rather a curt bow, left the room.",
  "optionalCommas": [],
  "rule": "Separate items in a series of actions with commas, and enclose the interrupting phrase 'with rather a curt bow' in commas.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1551-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The Scotland Yard man was obviously contemptuous, Major Norman was bored and impatient, and I myself found the time pass with wearisome slowness.",
  "optionalCommas": [],
  "rule": "Separate a series of independent clauses with commas, including one before 'and'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-2382-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "At four-thirty, Mrs. Inglethorp, in consequence of a conversation on the validity of wills, makes a will in favour of her husband, which the two gardeners witness.",
  "optionalCommas": [
   0
  ],
  "rule": "Use a comma after the introductory phrase, commas around the interrupter 'in consequence of a conversation...', and a comma before the nonessential 'which' clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-458-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We found M. Hautet awaiting us in the hall, and we all proceeded upstairs together, Françoise marching ahead to show us the way.",
  "optionalCommas": [],
  "rule": "Put a comma before 'and' joining two independent clauses, and a comma before the trailing phrase 'Françoise marching ahead...'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-898-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I felt a thrill of satisfaction as I realized that in Marchaud’s eyes, at least, I ranked equally in importance with Poirot.",
  "optionalCommas": [],
  "rule": "'At least' interrupts the clause and is nonessential, so it is set off with commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-1254-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "At that point, Poirot nudged me gently, indicating two men who were sitting together near the door.",
  "optionalCommas": [
   3
  ],
  "rule": "Use a comma after the introductory phrase and another before the trailing participial phrase 'indicating two men...'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-2570-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I awoke to find the sun pouring in through the open windows and Poirot, neat and smiling, sitting beside the bed.",
  "optionalCommas": [],
  "rule": "'Neat and smiling' is a nonessential description of Poirot, so it takes commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-1929-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Georges Conneau, the memory of old wrongs rising in him, quarrels with this Renauld.",
  "optionalCommas": [],
  "rule": "The phrase 'the memory of old wrongs rising in him' is nonessential and is enclosed in commas, with a comma after the name too.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-961-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "When I descended to the sitting-room reserved for us, I found Poirot already there, pacing up and down, his face contorted with agony.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory clause, and commas to set off the trailing modifying phrases.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-2625-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He made once more as though to pass on, but Poirot, not at all offended, laid a detaining hand on his arm.",
  "optionalCommas": [],
  "rule": "Put a comma before 'but' joining two independent clauses, and commas around the nonessential 'not at all offended'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-863-2369-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mrs. Cavendish, startled, drops her candle, scattering the grease on the carpet.",
  "optionalCommas": [],
  "rule": "'Startled' is a nonessential description, so it is set off on both sides, and a comma precedes the trailing participial phrase.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-2628-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He has worked in France, in England, in America.",
  "optionalCommas": [],
  "rule": "Separate the items in a series of places with commas.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-2285-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The prosecution averred that on Monday, July 16th, the prisoner had entered the chemist’s shop in the village, disguised as Mr. Inglethorp.",
  "optionalCommas": [],
  "rule": "Set off the date 'July 16th' with commas, and use a comma before the trailing participial phrase 'disguised as Mr. Inglethorp'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-61262-675-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "To speak of the interior of any animal or any person is not, I know, considered polite in England.",
  "optionalCommas": [],
  "rule": "An interrupter such as 'I know' is removable, so it needs commas on both sides. Remove 'I know' and the sentence still works.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-1086-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I showed Poirot the silver table, and after raising the lid once or twice and letting it fall, he pushed open the window and stepped out on the terrace.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' when it joins two independent clauses, and a comma after an introductory phrase. 'I showed...' and 'he pushed...' are complete clauses, and 'after raising... fall' introduces the second.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-2903-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Then came the crucial moment when Roger Ackroyd, always high-handed, decided to announce the engagement.",
  "optionalCommas": [],
  "rule": "A nonessential phrase between a subject and its verb gets commas on both sides. 'Always high-handed' can be removed without changing the meaning.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-1951-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mr. and Mrs. Baker, having received a telegram from Miss Marsh, were expecting us.",
  "optionalCommas": [],
  "rule": "A participial phrase that interrupts subject and verb is nonessential and needs commas on both sides. Remove 'having received... Marsh' and the sentence still stands.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-61262-921-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The sealed package is removed from the trunk and vanishes, as Miss Farquhar puts it, into thin air.",
  "optionalCommas": [],
  "rule": "A removable interrupter like 'as Miss Farquhar puts it' is set off by commas on both sides.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-354-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I fully believe that Roger intends to make settlements upon dear Flora, but, as you know, he is just a leetle peculiar about money.",
  "optionalCommas": [
   4
  ],
  "rule": "Put a comma before 'but' joining two independent clauses, and commas on both sides of the interrupter 'as you know'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-3069-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "When I first saw you, Mademoiselle, you were a looker-on at life.",
  "optionalCommas": [],
  "rule": "A comma ends an introductory clause, and a person addressed directly is set off by commas. Here 'Mademoiselle' is a direct address, so it gets commas on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-1130-9",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Major Blunt, Mr. Raymond, and Mrs. Ackroyd are in the billiard room.",
  "optionalCommas": [],
  "rule": "Separate three or more items in a series with commas, including one before 'and' on the SAT. Here the three names are the series.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-863-2239-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "In a low voice, in answer to Mr. Philips’ questions, he denied having ordered anything from Parkson’s in June.",
  "optionalCommas": [],
  "rule": "Put a comma after each introductory phrase before the subject. Here two phrases open the sentence, so both are followed by commas.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-701-12",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Therefore, I beg of you, release my friend Hastings from his bonds.",
  "optionalCommas": [],
  "rule": "A comma follows an introductory word like 'Therefore', and the interrupter 'I beg of you' is set off on both sides.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-1806-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He is innocent, of course, but that will not help him with a man like Giraud who has his reputation to think of.",
  "optionalCommas": [],
  "rule": "Interrupters like 'of course' get commas on both sides, and 'but' joining two independent clauses takes a comma before it. The comma after 'course' does both jobs.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-705-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I am still in the dark, but, as I hinted just now to M. Bex, these footmarks are the most important and interesting things in the case!",
  "optionalCommas": [],
  "rule": "Use a comma before 'but' joining two independent clauses, and set off the introductory clause 'as I hinted just now to M. Bex' with a comma after it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-69087-2120-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Flora stood with her hand on the door handle, and Parker came stepping through the door from the hall, bearing the tray.",
  "optionalCommas": [],
  "rule": "A comma goes before 'and' joining independent clauses, and a trailing participial phrase like 'bearing the tray' is set off with a comma.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-58866-939-14",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Hautet signifying that he had finished with him, the old man withdrew, grumbling to the last.",
  "optionalCommas": [],
  "rule": "An introductory phrase is followed by a comma, and a trailing participial phrase ('grumbling to the last') is also set off by a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-438-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mrs. Halliday received us at once, a tall, fair woman, nervous and eager in manner.",
  "optionalCommas": [],
  "rule": "An appositive renaming a person is set off by commas, and two adjectives that each describe the noun ('tall, fair') are separated by a comma.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-2419-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Had it been a little clearer in its terms, it is possible that Mrs. Inglethorp, warned in time, would have escaped.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause, and set off a nonessential participial phrase like 'warned in time' on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-1054-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He was a French Canadian by birth, I believe, but I’ve never heard him speak of his life in Canada.",
  "optionalCommas": [],
  "rule": "The interrupter 'I believe' takes commas on both sides, and the second comma also comes before 'but' joining independent clauses.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-2138-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mr. Philips, K.C., opened the case for the Crown.",
  "optionalCommas": [],
  "rule": "An appositive or title that follows a name is nonessential and is set off by commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-1755-8",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Stretching himself out in a basket chair, a cigarette held between his white fingers, the Comte pondered deeply.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and another after a second modifying phrase before the subject. Here both phrases come before 'the Comte'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-12-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mrs. Cavendish, who had married John’s father when he was a widower with two sons, had been a handsome woman of middle-age as I remembered her.",
  "optionalCommas": [],
  "rule": "A nonessential 'who' clause needs commas on both sides. It adds extra information about Mrs. Cavendish and can be removed.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-447-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "You have always been known as a hard man, so I have been told, but Ruth is harder than you are.",
  "optionalCommas": [],
  "rule": "The interrupter 'so I have been told' takes commas on both sides, and the second one also precedes 'but' joining two independent clauses.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-2421-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I came from Cherbourg, as I told you, in order to see Marthe before going to the other end of the world.",
  "optionalCommas": [],
  "rule": "A removable interrupter such as 'as I told you' is set off by commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-2051-6",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Did not Giraud find the traces of two persons, a man and a woman, in the shed?",
  "optionalCommas": [],
  "rule": "An appositive that explains a noun ('a man and a woman') is nonessential and needs commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-1905-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "If Jack Renauld is guilty, it is in spite of Giraud’s arguments, not because of them.",
  "optionalCommas": [],
  "rule": "A comma ends an introductory 'if' clause, and a contrasting 'not...' phrase at the end is set off with a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-69087-314-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Just then Ackroyd’s secretary, a pleasant young fellow by the name of Raymond, passed through the hall on his way to Ackroyd’s study, his hands full of papers.",
  "optionalCommas": [],
  "rule": "Set off a nonessential appositive with commas on both sides, and use a comma before an absolute phrase. Here 'a pleasant young fellow by the name of Raymond' renames the secretary, and 'his hands full of papers' is an extra detail after a comma.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-1654-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A moment or two later, Derek Kettering, debonair as ever, entered the room.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase and commas on both sides of a nonessential interrupter. 'A moment or two later' opens the sentence, and 'debonair as ever' can be removed.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1453-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As I was saying, they motored down to Windsor, where the Prime Minister was granted an Audience.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory clause, and a comma before a nonessential 'where' clause. 'As I was saying' is introductory, and 'where the Prime Minister was granted an Audience' adds extra information about Windsor.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-2023-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The Comte de la Roche, as your expressive idiom has it, was not born on the preceding day.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of an interrupter that can be removed. 'as your expressive idiom has it' is extra, so it is set off from the subject and verb.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-2441-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Half an hour later saw Poirot, myself, and Inspector Raglan in the train on the way to Liverpool.",
  "optionalCommas": [
   6
  ],
  "rule": "Separate items in a series of three or more with commas. Poirot, myself, and Inspector Raglan are three items.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-1666-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Luckily, before Poirot had time to reply, the doctor came back, and we had to carry on a forced conversation.",
  "optionalCommas": [],
  "rule": "Use a comma after introductory words and clauses, and a comma before 'and' joining two independent clauses. 'Luckily' and 'before Poirot had time to reply' introduce the first clause; 'the doctor came back' and 'we had to carry on a forced conversation' are separate clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-47-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The symptoms of gastritis and arsenical poisoning are not, I agree, unlike, but Caroline bases her accusation on quite different lines.",
  "optionalCommas": [],
  "rule": "Set off a removable interrupter such as 'I agree' with commas on both sides, and put a comma before 'but' joining two independent clauses.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-69087-1668-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I heard Caroline’s voice, rather acid in note, calling from the top of the stairs.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of a nonessential descriptive phrase. 'rather acid in note' adds extra detail about the voice.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-1616-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Our landlady, Mrs. Pearson, at once informed us that a hospital nurse had called and was waiting to see Poirot.",
  "optionalCommas": [],
  "rule": "An appositive that names the noun before it, and is not needed to identify it, takes commas on both sides. 'Mrs. Pearson' renames 'Our landlady'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-2393-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Coffee had been brought in for seven persons, not six, for Dr. Bauerstein had been there that evening.",
  "optionalCommas": [],
  "rule": "Set off a contrasting phrase like 'not six' with commas, and put a comma before 'for' when it joins two independent clauses.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-381-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "That is where the cleverness of Number Four, I am convinced, comes in.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of an interrupter such as 'I am convinced', which can be removed without damaging the sentence.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-1853-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mother, of course, is trying, but you can lose your temper with her until Kingdom come, and it won't make any impression.",
  "optionalCommas": [],
  "rule": "Set off 'of course' with commas on both sides. Use a comma before 'but' and before 'and' where each joins two independent clauses.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-2163-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Evelyn Howard was called and, after being examined on other points, was questioned as to the parcel.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupting phrase with commas on both sides. 'after being examined on other points' can be removed.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-1378-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Poirot might have excellent reasons for his belief in Inglethorp’s innocence, but a man of the type of Summerhaye would require tangible proofs, and these I doubted if Poirot could supply.",
  "optionalCommas": [],
  "rule": "Use a comma before 'but' and 'and' when each joins two independent clauses. This sentence has three clauses, so two commas are needed.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-61262-1693-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "One of the maids, whose business it is to fasten the bedroom windows, declares that she saw Lowen coming towards the study through the rose-garden about a quarter past six.",
  "optionalCommas": [],
  "rule": "A nonessential 'whose' clause needs commas on both sides. 'whose business it is to fasten the bedroom windows' is extra information about the maid.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-61262-1952-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Tired with our journey and the eight-mile drive from the station, we had retired at once to bed after a supper of roast chicken, apple pie, and Devonshire cream.",
  "optionalCommas": [
   25
  ],
  "rule": "Use a comma after an introductory phrase, and commas between items in a series. 'Tired with ... station' opens the sentence, and the supper has three items.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-58866-1670-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Some twenty years or so before the opening of the present story, Monsieur Arnold Beroldy, a native of Lyons, arrived in Paris accompanied by his pretty wife and their little daughter, a mere babe.",
  "optionalCommas": [],
  "rule": "Use a comma after a long introductory phrase, and commas around and after appositives. 'a native of Lyons' and 'a mere babe' rename the nouns before them.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-303-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I tell you, Hastings, it goes against reason.",
  "optionalCommas": [],
  "rule": "Set off a name used in direct address with commas. 'Hastings' is the person being spoken to.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-46-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mrs. Ferrars’ husband died just over a year ago, and Caroline has constantly asserted, without the least foundation for the assertion, that his wife poisoned him.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, and commas on both sides of the removable phrase 'without the least foundation for the assertion'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-58866-2468-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Jack Renauld, worn out with all he had already gone through, swayed and nearly fell.",
  "optionalCommas": [],
  "rule": "A descriptive phrase that is not essential to identify the subject takes commas on both sides. 'worn out with all he had already gone through' is extra detail.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-2137-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Sir Ernest Heavywether, the famous K.C., had been engaged to defend him.",
  "optionalCommas": [],
  "rule": "An appositive that renames a proper noun takes commas on both sides. 'the famous K.C.' can be removed.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-64-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He came to the Seine, crossed it, and entered one of the less reputable quarters of Paris.",
  "optionalCommas": [
   6
  ],
  "rule": "Separate three or more actions in a series with commas: came, crossed, and entered.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-1156-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Amy Hill, shop assistant, was next called and deposed to having sold a will form on the afternoon of the 17th to William Earl, under-gardener at Styles.",
  "optionalCommas": [],
  "rule": "Set off appositives with commas: 'shop assistant' renames Amy Hill and 'under-gardener at Styles' renames William Earl. No comma is needed between the two verbs 'called' and 'deposed' because they share one subject.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-61262-1116-8",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mr. Bleibner, whatever his intentions, had made no will.",
  "optionalCommas": [],
  "rule": "A removable interrupter between subject and verb takes commas on both sides. 'whatever his intentions' is extra.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-959-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "They had reached Paris, and the slow journey round the ceinture, with its interminable stops and waits, was very wearisome.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, and commas on both sides of the nonessential phrase 'with its interminable stops and waits'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-946-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It was then that Poirot received a brief note from Lady Willard, widow of the dead archaeologist, asking him to go and see her at her house in Kensington Square.",
  "optionalCommas": [],
  "rule": "An appositive such as 'widow of the dead archaeologist' is nonessential and takes commas on both sides, here before the participle phrase that follows.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-69087-573-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Well, you got up here, broke in the door, and found poor Mr. Ackroyd like this.",
  "optionalCommas": [
   0
  ],
  "rule": "Use a comma after an introductory word, and commas between the items in a series of actions: got up, broke in, and found.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-1926-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "At a sign from Number Four, who stood facing us with mocking triumph in his face, we were searched and every article was removed from our pockets, including Poirot's little automatic pistol.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase, commas around the nonessential 'who' clause, and a comma before the extra 'including' phrase.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-3324-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A polite exchange of farewells followed, and when Poirot was out of earshot, Monsieur Papopolous turned to his daughter.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, and a comma after the introductory 'when' clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-3276-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We have Mrs. Kettering's own evidence there, but, on the other hand, we have not really got her evidence, because, Monsieur Van Aldin, a dead woman cannot give evidence.",
  "optionalCommas": [],
  "rule": "Use a comma before 'but', set off 'on the other hand' with commas, and set off the direct address 'Monsieur Van Aldin' with commas.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-1319-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "On the other hand, the word Santiago, to my mind, is a red herring, dragged continually across the track to put us off the scent.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase, commas around the interrupter 'to my mind', and a comma before the descriptive phrase 'dragged continually...'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-1675-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Madame Beroldy lay on the floor, bound hand and foot, uttering feeble moans, having managed to free her mouth from a gag.",
  "optionalCommas": [],
  "rule": "Descriptive phrases that add extra detail after a complete clause are set off with commas. Here each phrase after 'floor' is separated by a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-782-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She had an artist's temperament, which had been soured earlier in the morning by a visit from an Argentine meat queen, who had insisted on having those models least suited to her flamboyant type of beauty.",
  "optionalCommas": [],
  "rule": "Clauses beginning with which or who that add extra information are nonessential and take a comma before them. Put one before 'which' and one before 'who'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-982-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "At that minute, Japp burst in, very red in the face.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase and before a descriptive phrase that trails the main clause. Both apply here.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-396-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Renauld figured to himself, without doubt, that his widow would never marry again.",
  "optionalCommas": [],
  "rule": "A removable interrupter such as 'without doubt' needs commas on both sides. The sentence still works without it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-660-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As we retraced our steps to the house, M. Bex excused himself for leaving us, explaining that he must immediately acquaint the examining magistrate with the fact of Giraud’s arrival.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause ('As we retraced... house'). Also set off the trailing 'explaining...' phrase with a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-69087-1887-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She sent for me early on Tuesday morning, and since the summons sounded an urgent one, I hastened there, expecting to find her in extremis.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, after the introductory 'since' clause, and before the trailing 'expecting' phrase.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-61262-51-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "After a short interval, the American film star was ushered in, and we rose to our feet.",
  "optionalCommas": [],
  "rule": "Use a comma after the introductory phrase and a comma before 'and' joining two independent clauses.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-478-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He had stepped outside the French window and was standing, apparently lost in admiration, before the various shaped flower beds.",
  "optionalCommas": [],
  "rule": "'Apparently lost in admiration' is a removable interrupter, so it takes commas on both sides. There is no comma before 'and' because the two verbs share one subject.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-1592-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He beamed and vociferated and, forgetting my English reluctance, embraced me warmly on the platform.",
  "optionalCommas": [],
  "rule": "The participial phrase 'forgetting my English reluctance' interrupts the sentence and needs a comma on each side.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-61262-1925-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I am not a great admirer of the so-called New Woman myself, and, in spite of her good looks, I was not particularly prepossessed in her favour.",
  "optionalCommas": [
   12
  ],
  "rule": "Use a comma before 'and' joining two independent clauses, and set off the interrupting phrase 'in spite of her good looks' with a comma after it.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-292-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Turning to Annie, one of the housemaids, he sent her downstairs to the dining-room for brandy.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase, and set off the nonessential appositive 'one of the housemaids' with commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-850-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Mrs. Kettering, as you know, is about to file a petition for divorce.",
  "optionalCommas": [],
  "rule": "'As you know' is a removable interrupter between subject and verb, so it needs commas on both sides, and no extra comma between subject and verb.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-296-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A shadow fell on the bed and, looking up, I saw Mary Cavendish standing near the door with her arm around Cynthia.",
  "optionalCommas": [],
  "rule": "The introductory participial phrase 'looking up' is set off by commas on both sides.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-1095-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We have, of course, cabled to Santiago and are expecting a reply from there any minute.",
  "optionalCommas": [],
  "rule": "'Of course' is a removable interrupter, so commas go on both sides. No comma is needed before 'and' because the two verbs share one subject.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-1662-6",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We've heard of you down here, M. Poirot, and we mean to make the most of you.",
  "optionalCommas": [],
  "rule": "A name in direct address takes commas on both sides, and a comma is needed before 'and' joining two independent clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-28-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "As one looked out over the flat Essex country, lying so green and peaceful under the afternoon sun, it seemed almost impossible to believe that, not so very far away, a great war was running its appointed course.",
  "optionalCommas": [],
  "rule": "Use commas after the introductory clause, around the interrupting phrase 'not so very far away', and after the descriptive 'lying' phrase.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-1009-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Everything goes to show that that was the individual admitted by the window, and though Mr. Ackroyd was seen alive later by Miss Flora, we cannot approach a solution of the mystery until we know who that visitor was.",
  "optionalCommas": [],
  "rule": "Use a comma before 'and' joining two independent clauses, and a comma after the introductory 'though' clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-1935-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Whilst you dally with a millionaire's secretary, you might give me a chance with the millionaire, Katherine.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause and set off a name in direct address with a comma.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-2052-12",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "For her son’s sake, no one must know that Paul Renauld was Georges Conneau, the criminal.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase, and set off the appositive 'the criminal' with a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-1352-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It was M. Carrège, mindful of his status and his duties, who tackled the unpleasant subject.",
  "optionalCommas": [],
  "rule": "'Mindful of his status and his duties' is a removable descriptive phrase, so commas go on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-1905-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He recognises the only man he fears, miraculously resurrected from the dead, at the very minute when the plans of the Big Four are in the balance.",
  "optionalCommas": [],
  "rule": "'Miraculously resurrected from the dead' adds extra detail and is set off by commas on both sides.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-1143-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I knew, of course, that my father, having lived so long out there, had necessarily many interests in South America.",
  "optionalCommas": [],
  "rule": "Removable interrupters ('of course' and 'having lived so long out there') are set off by commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-2442-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Derek Kettering, coming out of the Casino into the sunshine, saw her sitting alone on the bench and joined her.",
  "optionalCommas": [],
  "rule": "The phrase 'coming out of the Casino into the sunshine' is nonessential, so commas go on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-1217-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I say, Rosalie, I am afraid I will have to leave you.",
  "optionalCommas": [],
  "rule": "The interjection 'I say' and the name 'Rosalie' in direct address are set off by commas.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-61262-1853-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He had gone out about 8.30 and, meeting a friend, had accompanied him to the Metropolitan Music Hall in Edgware Road.",
  "optionalCommas": [],
  "rule": "The participial phrase 'meeting a friend' interrupts the verb and needs commas on both sides.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-70114-739-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It was with a beating heart that I presented myself at the Savoy, at an hour named by Mr. Ryland, and asked to see the great man.",
  "optionalCommas": [],
  "rule": "'At an hour named by Mr. Ryland' is a removable interrupter and takes commas on both sides.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-2384-8",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "She demanded it from Mrs. Inglethorp, who assured her, quite truly, that it had nothing to do with that matter.",
  "optionalCommas": [],
  "rule": "A nonessential clause needs commas to set it off, and so does a removable interrupter. The \"who\" clause adds extra information about Mrs. Inglethorp, and \"quite truly\" can be removed without harming the sentence, so each gets commas.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-144-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Finally, somewhat to my surprise, he rang up our old friend Inspector Japp and asked him if he could possibly come round.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory word and commas on both sides of a removable interrupter. \"Finally\" opens the sentence, and \"somewhat to my surprise\" can be removed. Do not put a comma before \"and\" here, because it joins two verbs (rang up, asked) with one subject.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-82-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "My friend Poirot, exact to the minute as usual, was just tapping the shell of his second egg.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of a nonessential phrase that interrupts the sentence. \"Exact to the minute as usual\" can be removed, so it is set off from the subject Poirot and the verb was. Never separate a subject from its verb with a single comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-349-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He dismissed Denise and, after a moment or two for consideration, recalled Françoise.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of an interrupting phrase placed inside a compound predicate. \"After a moment or two for consideration\" can be removed, so it is surrounded by commas, and there is no comma before \"and\" because both verbs share the subject He.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-3215-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Van Aldin and Knighton, bewildered but obedient, followed him.",
  "optionalCommas": [],
  "rule": "A descriptive phrase that can be removed gets commas on both sides. \"Bewildered but obedient\" adds extra detail about the subject, so it is set off, and there is no comma between the subject and the verb followed.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-1866-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "On arrival in Paris, we drove across to the Gare de l'Est, and Poirot at last announced our destination.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and a comma before \"and\" when it joins two independent clauses. \"On arrival in Paris\" opens the sentence, and \"we drove...\" and \"Poirot... announced...\" are each complete clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-639-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Meanwhile Poirot, as though struck by a sudden idea, stepped back over the boundary and tried the door of the little shed.",
  "optionalCommas": [
   0
  ],
  "rule": "Use commas on both sides of a removable interrupter. \"As though struck by a sudden idea\" could be taken out, so it is set off from the subject and verb. The comma after the short opener \"Meanwhile\" is optional, and no comma goes before \"and\" because it joins two verbs.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-1936-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Madame Olivier said nothing, but her eyes burned, and I disliked the slow way she smiled.",
  "optionalCommas": [],
  "rule": "Put a comma before a conjunction (but, and) that joins independent clauses. This sentence has three complete clauses, so a comma goes before \"but\" and before \"and.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-160-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "For the first time I felt that, with Evelyn Howard, something indefinable had gone from the atmosphere.",
  "optionalCommas": [
   3
  ],
  "rule": "Use commas on both sides of a removable interrupter. \"With Evelyn Howard\" interrupts the clause after \"that,\" so it is set off. The comma after the short opener \"For the first time\" is optional.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-863-2444-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "To begin with, whoever else might benefit by Mrs. Inglethorp’s death, her husband would benefit the most.",
  "optionalCommas": [],
  "rule": "Put a comma after each introductory phrase or clause. \"To begin with\" is an introductory phrase, and \"whoever else might benefit by Mrs. Inglethorp's death\" is an introductory clause, both coming before the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-470-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Poirot had a lengthy interview with Professor Bourgoneau, during which he sought to elicit whether Halliday had mentioned any plan of his own for the evening, but we drew a complete blank.",
  "optionalCommas": [],
  "rule": "Use a comma before \"but\" when it joins two independent clauses, and a comma before an added \"during which\" clause. \"Poirot had a lengthy interview...\" and \"we drew a complete blank\" are both complete clauses, and the \"during which\" part adds extra detail.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-2065-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I merely realized that it was possible, from your story, for Monsieur Lawrence to go to the poison cupboard.",
  "optionalCommas": [],
  "rule": "Set off a removable interrupter with commas on both sides. \"From your story\" can be taken out without changing the meaning, so it gets a comma before and after.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-1686-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Madame Beroldy, amidst a scene of unparalleled excitement, was acquitted.",
  "optionalCommas": [],
  "rule": "Use commas on both sides of a phrase that interrupts the subject and verb. \"Amidst a scene of unparalleled excitement\" can be removed, so it is set off.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-70114-276-15",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Then Betsy comes in, goes into the living-room, sees what's happened, and lets out a screech to wake the dead.",
  "optionalCommas": [],
  "rule": "Separate items in a series with commas, including before the final \"and.\" Here there are four actions by Betsy: comes in, goes into the living-room, sees what's happened, and lets out a screech.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-70114-57-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "But I will admit to you, Hastings, that had not the money offered been so big, I might have hesitated, for just lately I have begun a little investigation of my own.",
  "optionalCommas": [],
  "rule": "Set off a name used in direct address, an introductory clause, and a clause joined by \"for.\" \"Hastings\" is a removable interrupter, \"had not the money offered been so big\" is an introductory clause, and \"for\" joins a new independent clause, so it takes a comma before it.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-2356-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "It did, in very truth, seem as though Jack was rushing on his fate.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'In very truth' can be removed without changing the meaning, so it gets a comma before and after.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-863-2314-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "After this, as it was growing late, the case was adjourned till Monday.",
  "optionalCommas": [],
  "rule": "A introductory phrase takes a comma, and a nonessential clause in the middle needs commas on both sides. 'As it was growing late' could be removed, so it is set off.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-742-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Locking the outer door behind us again, we made our way to the billiard room, where we found Geoffrey Raymond.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and use a comma before a nonessential 'where' clause. The opening phrase and the added 'where' detail each get one.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-863-305-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Dr. Bauerstein, I noticed, was watching the local doctor narrowly.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'I noticed' can be removed, so it gets a comma before and after.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-2865-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Chancing to look out of the window, Hippolyte espied a visitor walking briskly up to the hall door, a visitor of so uncommon a type that Hippolyte, experienced as he was, had some difficulty in placing him.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory phrase, before an appositive, and around the nonessential 'experienced as he was'. Each comma marks where the main sentence pauses for extra information.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-1789-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I joined him at the moment that Marthe Daubreuil, looking slightly startled, came running up to the hedge at his call.",
  "optionalCommas": [],
  "rule": "Set off a nonessential phrase with commas on both sides. 'Looking slightly startled' adds detail about Marthe and can be removed.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-61262-1777-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "You found out for me that for the last six months, or ever since his supposed return from Buenos Ayres, he and Mrs. Davenheim occupied separate rooms.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides, and put a comma after the introductory phrase. 'Or ever since his supposed return from Buenos Ayres' is the removable interrupter.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-863-2013-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "But, to my great surprise, Poirot nodded gravely.",
  "optionalCommas": [
   0
  ],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'To my great surprise' can be removed without breaking the sentence.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-69087-106-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Now when Roger Ackroyd was a lad of twenty-one, he fell in love with, and married, a beautiful woman some five or six years his senior.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause. The phrase 'and married' interrupts 'fell in love with ... a woman', so it is set off by commas on both sides.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-72824-2245-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Then he leant towards the other and spoke in a different tone, a quiet, grave tone that was new to Derek Kettering.",
  "optionalCommas": [],
  "rule": "Use a comma before an appositive that renames a noun, and a comma between two adjectives that each describe the noun equally. 'Quiet, grave tone' uses the second rule.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-397-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Now, M. Poirot, you would without doubt like to visit the scene of the crime.",
  "optionalCommas": [
   0
  ],
  "rule": "Set off a name used in direct address with commas on both sides. 'M. Poirot' is the person spoken to, so it is bracketed by commas.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-3210-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Van Aldin, Knighton, and Poirot sat together in silence.",
  "optionalCommas": [
   2
  ],
  "rule": "Use commas to separate three or more items in a series. Here, the three men are listed, so commas follow the first two.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-1261-3",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We were down by the docks now, I knew, and I realised that I was being taken into the heart of Chinatown.",
  "optionalCommas": [],
  "rule": "Set off the nonessential interrupter 'I knew' with commas on both sides. Also put a comma before 'and' when it joins two full independent clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-619-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "But you will permit me to say, mon ami, that she was in love with him before she married you, and her father stepped in and sent the Comte about his business.",
  "optionalCommas": [],
  "rule": "Set off a direct address with commas on both sides, and put a comma before 'and' joining two independent clauses. 'Mon ami' is the direct address.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-1414-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The Examining Magistrate, however, did not seem disposed to agree with him.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'However' can be removed without changing the meaning.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-540-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Then I heard young Raymond’s voice, horror-stricken and incredulous, outside.",
  "optionalCommas": [],
  "rule": "Set off a nonessential descriptive phrase with commas on both sides. 'Horror-stricken and incredulous' is extra detail about the voice.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-1229-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I must admit, however, that I was half asleep when Mrs. Pearson's knock at the door aroused me.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'However' can be removed, so it gets a comma before and after.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-69087-1102-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Inspector Raglan, a little taken aback, bowed.",
  "optionalCommas": [],
  "rule": "Set off a nonessential phrase with commas on both sides. 'A little taken aback' is extra detail that the sentence can do without.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-58866-429-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Yesterday, possibly last night, M. Renauld drew a cheque to the order of some one named Duveen.",
  "optionalCommas": [],
  "rule": "Use a comma after an introductory word, and set off a nonessential interrupter with commas on both sides. 'Possibly last night' is the extra information.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-2006-6",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The first occurs immediately after arriving in Merlinville, the second after quarrelling with his son on a certain subject, the third on the morning of June 7th.",
  "optionalCommas": [],
  "rule": "Use commas to separate the items in a series. Each item (the first, the second, the third) is set off by a comma.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-69087-188-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "A man who is capable of shutting up Caroline and sending her, like the Queen of Sheba, empty away must be something of a personality.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'Like the Queen of Sheba' can be removed, so it gets a comma before and after.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-863-667-5",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "And the cup on the mantelpiece, half drunk, that would be Mr. Lawrence Cavendish’s.",
  "optionalCommas": [],
  "rule": "Set off a nonessential phrase with commas on both sides. 'Half drunk' is extra detail about the cup.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-72824-3020-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Finally, with a long sigh, Mr. Aarons laid down his spoon and fork preparatory to toying with some cheese before turning his mind to other matters.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory word, and after an introductory phrase. 'Finally' and 'with a long sigh' both come before the subject.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-423-11",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "I swear to you, Sheppard, that it never entered my head what she meant to do.",
  "optionalCommas": [],
  "rule": "Set off a name used in direct address with commas on both sides. 'Sheppard' is the person spoken to.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-729-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "If Poirot was trying to frighten me, he was going the wrong way to work, and so I told him.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause starting with 'if', and a comma before 'and' joining two independent clauses.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-225-7",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Van Aldin remembered, with a grim smile of amusement, the young man's complete astonishment when he had been offered the post of secretary to the great man himself.",
  "optionalCommas": [],
  "rule": "Set off a nonessential interrupter with commas on both sides. 'With a grim smile of amusement' can be removed, so it gets a comma before and after.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-99-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Come now, Hastings, you cannot say that I have left you with nothing to do.",
  "optionalCommas": [],
  "rule": "Set off a name used in direct address with commas, and put a comma after the introductory word. 'Hastings' is the person spoken to.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-863-1055-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "For one thing, a country jury is not anxious to take responsibility upon itself, and Mr. Inglethorp stands practically in the position of local squire.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and a comma before 'and' joining two independent clauses.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-70114-1549-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "The Right Honourable Sydney Crowther, His Majesty's Secretary of State for Home Affairs, was a well-known and popular figure.",
  "optionalCommas": [],
  "rule": "Set off an appositive with commas on both sides. 'His Majesty's Secretary of State for Home Affairs' renames Sydney Crowther.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-58866-518-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "But Poirot, deft as ever, took the broken trinket from the startled commissary and held it to his ear.",
  "optionalCommas": [],
  "rule": "Set off a nonessential phrase with commas on both sides. Do not put a comma before 'and' when it joins only two verbs that share a subject.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-61262-796-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "See here, Hastings, let us examine the facts methodically and in order.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase, and set off a name used in direct address. 'Hastings' is the person spoken to.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-1286-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Thus M. Carrège, the Juge d'Instruction, addressed Van Aldin.",
  "optionalCommas": [],
  "rule": "Set off an appositive with commas on both sides. 'The Juge d'Instruction' renames M. Carrège.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-70114-1648-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Whilst we waited to hear the result, Poirot amused himself by verifying the nurse's credentials, somewhat to my surprise.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause, and a comma before a trailing nonessential phrase. 'Somewhat to my surprise' is extra information.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-1351-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Carrège was looking with close attention at his desk, M. Caux's eyes were fixed upon the ceiling, and M. Hercule Poirot was tenderly brushing a speck of dust from his coat sleeve.",
  "optionalCommas": [],
  "rule": "Use commas to separate items in a series, here three independent clauses, with a comma before the final and. So put commas after desk and after ceiling.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-863-1367-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Miss Howard’s evidence, unimportant as it was, had been given in such a downright straightforward manner that it had never occurred to me to doubt her sincerity.",
  "optionalCommas": [],
  "rule": "A nonessential interrupter needs commas on both sides. Remove unimportant as it was and the sentence still works, so set it off after evidence and after was.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mark-58866-2038-12",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "There is a struggle, M. Renauld seeks to eject him, and suddenly the tramp, an epileptic, falls down in a fit.",
  "optionalCommas": [],
  "rule": "Separate the items in a series of clauses with commas, including one before the final and. Also set off the appositive an epileptic with commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-72824-2880-0",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Before Hippolyte could recover his breath, the other had selected the right door at the back of the hall and passed along the passage and into the kitchen, where Marie paused open-mouthed to stare at him.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory clause (Before Hippolyte could recover his breath). Also use a comma before the nonessential clause that begins with where.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-956-4",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "To Giraud, all examining magistrates were fools, and to M. Hautet, who took himself seriously, the casual manner of the Paris detective could not fail to give offence.",
  "optionalCommas": [
   1
  ],
  "rule": "Use a comma before and when it joins two independent clauses. The clause who took himself seriously is nonessential, so it needs commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-61262-879-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "We have, of course, placed ourselves in the hands of Scotland Yard.",
  "optionalCommas": [],
  "rule": "An interrupting phrase like of course is nonessential, so it takes commas on both sides.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mark-72824-2654-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "To make a success of humanity, Georges, we must profit by the lessons of those below us in the animal kingdom.",
  "optionalCommas": [],
  "rule": "Put a comma after an introductory phrase. A name used in direct address, Georges, is set off with commas on both sides.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-72824-3167-2",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "He was in London, he explained, to see his doctor.",
  "optionalCommas": [],
  "rule": "The interrupter he explained is nonessential and needs commas on both sides, after London and after explained.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-69087-700-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Inspector Davis unlocked the door of the lobby, we passed through, and he locked the door again behind him.",
  "optionalCommas": [],
  "rule": "In a series of three clauses, separate them with commas, including one before and. So put commas after lobby and after through.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mark-70114-864-9",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Making an excuse to get rid of Ah Ling for a few minutes, he had turned the contents of his plate into a bowl, and he now handed it over to the doctor with injunctions to find out if there were really anything wrong with it.",
  "optionalCommas": [],
  "rule": "Put a comma after a long introductory phrase (ending in minutes). Use a comma before and when it joins two independent clauses, so put one after bowl.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mark-72824-1286-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "M. Caux, the Commissary, made sympathetic noises in his throat.",
  "optionalCommas": [],
  "rule": "An appositive that renames a noun but is not essential needs commas on both sides. Set off the Commissary after Caux and after Commissary.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mark-58866-1872-10",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "Jack Renauld, arriving from Cherbourg, was the only person who could have taken it.",
  "optionalCommas": [],
  "rule": "The phrase arriving from Cherbourg is nonessential, so set it off with commas on both sides. Do not put a comma between the subject and verb that follow.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mark-58866-1297-1",
  "type": "mark",
  "skill": "commas",
  "title": "Restore the punctuation",
  "prompt": "Someone stripped this sentence of its commas and capital letters. Tap a word to capitalize it. Tap the space between two words to add a comma.",
  "text": "But I, Hercule Poirot, say that Madame Renauld lied.",
  "optionalCommas": [],
  "rule": "The appositive Hercule Poirot renames I and is nonessential, so it needs commas on both sides.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-2155-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After various questions on other matters___ Mr. Philips asked:",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "After various questions on other matters, Mr. Philips asked:",
  "rule": "An introductory phrase is followed by a comma. 'After various questions on other matters' is the opener, so a comma comes before the subject, Mr. Philips.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-2125-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Until I have found that last link in my chain___ I must remain behind the scenes.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Until I have found that last link in my chain, I must remain behind the scenes.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'Until I have found that last link in my chain' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-2239-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Caroline___ said nothing.",
  "options": [
   ", who was considerably down,",
   " who was considerably down,",
   ", who was considerably down",
   " who was considerably down"
  ],
  "answer": ", who was considerably down,",
  "fixed": "Caroline, who was considerably down, said nothing.",
  "rule": "'Who was considerably down' is removable extra information about Caroline, so it needs a comma on both sides. One comma or none breaks the interrupter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-595-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then he picked them up and returned them to his case___ he replaced in his pocket.",
  "options": [
   ", which",
   " which",
   "; which",
   ": which"
  ],
  "answer": ", which",
  "fixed": "Then he picked them up and returned them to his case, which he replaced in his pocket.",
  "rule": "The clause 'which he replaced in his pocket' only adds extra detail about the one case, so it is set off with a comma. A semicolon or colon must follow a complete sentence, and 'which he replaced' is not one.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1617-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "They laid particular stress on the magnificent ovation accorded to Mr. David MacAdam___ inspiring speech had produced a deep and lasting impression.",
  "options": [
   ", whose",
   " whose",
   "; whose",
   ": whose"
  ],
  "answer": ", whose",
  "fixed": "They laid particular stress on the magnificent ovation accorded to Mr. David MacAdam, whose inspiring speech had produced a deep and lasting impression.",
  "rule": "A name is already specific, so a clause about him ('whose inspiring speech...') is extra information and gets a comma before it. Semicolons and colons need a complete sentence before them.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-990-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot___ wilted by my side.",
  "options": [
   ", the picture of misery,",
   " the picture of misery,",
   ", the picture of misery",
   " the picture of misery"
  ],
  "answer": ", the picture of misery,",
  "fixed": "Poirot, the picture of misery, wilted by my side.",
  "rule": "'The picture of misery' renames Poirot and could be removed, so it is an appositive needing commas on both sides. Using only one comma, or none, is wrong.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-72824-2399-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "There was something in his voice___ which she had not heard before.",
  "options": [
   ", some undercurrent of seriousness,",
   " some undercurrent of seriousness,",
   ", some undercurrent of seriousness",
   " some undercurrent of seriousness"
  ],
  "answer": ", some undercurrent of seriousness,",
  "fixed": "There was something in his voice, some undercurrent of seriousness, which she had not heard before.",
  "rule": "'Some undercurrent of seriousness' is an appositive that renames 'something' and can be removed, so it needs a comma on both sides, not one or none.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-2819-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Having___ quietly enjoyed the little game, he rose to his feet and suggested a walk.",
  "options": [
   ", I suspect,",
   " I suspect,",
   ", I suspect",
   " I suspect"
  ],
  "answer": ", I suspect,",
  "fixed": "Having, I suspect, quietly enjoyed the little game, he rose to his feet and suggested a walk.",
  "rule": "'I suspect' interrupts the phrase and can be removed, so it needs commas on both sides. One comma or none leaves the interrupter half set off.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1660-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Suddenly___ she hurried from the room.",
  "options": [
   ", with an incoherent word of excuse,",
   " with an incoherent word of excuse,",
   ", with an incoherent word of excuse",
   " with an incoherent word of excuse"
  ],
  "answer": ", with an incoherent word of excuse,",
  "fixed": "Suddenly, with an incoherent word of excuse, she hurried from the room.",
  "rule": "'With an incoherent word of excuse' is a removable phrase between the opener and the main clause, so it needs commas on both sides, as does the introductory 'Suddenly'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-1318-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before showing my empty hand___ I dropped what it contained into my other hand.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Before showing my empty hand, I dropped what it contained into my other hand.",
  "rule": "'Before showing my empty hand' is an introductory phrase, so a comma goes before the main clause begins.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-1453-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As long as I might be thought to be pursuing him___ the criminal would be off his guard.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As long as I might be thought to be pursuing him, the criminal would be off his guard.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As long as I might be thought to be pursuing him' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-2112-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When you got up to go___ I was waiting outside and followed you.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "When you got up to go, I was waiting outside and followed you.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'When you got up to go' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-1446-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I rose to my feet___ I caught sight of them through a gap in the hedge.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As I rose to my feet, I caught sight of them through a gap in the hedge.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As I rose to my feet' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1679-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Although his eyes were still on the ceiling___ he managed to see the dark flush that rose to Derek Kettering's face.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Although his eyes were still on the ceiling, he managed to see the dark flush that rose to Derek Kettering's face.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'Although his eyes were still on the ceiling' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-2293-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As Derek Kettering passed the car___ Mirelle leant out.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As Derek Kettering passed the car, Mirelle leant out.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As Derek Kettering passed the car' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-2460-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After some further parley___ we were taken to interview the prisoner.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "After some further parley, we were taken to interview the prisoner.",
  "rule": "'After some further parley' is an introductory phrase, so it is followed by a comma before the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1906-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As he finished speaking___ the man at the next table got up and went out.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As he finished speaking, the man at the next table got up and went out.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As he finished speaking' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-2296-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When he got back to his hotel___ the concierge detached himself from his wooden pen and accosted him.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "When he got back to his hotel, the concierge detached himself from his wooden pen and accosted him.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'When he got back to his hotel' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-72824-2925-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When Poirot entered___ he found her walking up and down the room feverishly.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "When Poirot entered, he found her walking up and down the room feverishly.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'When Poirot entered' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-960-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When you broke the door down and found Mr. Ackroyd dead___ how was the fire?",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "When you broke the door down and found Mr. Ackroyd dead, how was the fire?",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'When you broke the door down and found Mr. Ackroyd dead' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-61262-617-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then enjoining silence with a movement of the hand___ Poirot led the way out of the flat and down the stairs.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Then enjoining silence with a movement of the hand, Poirot led the way out of the flat and down the stairs.",
  "rule": "'Then enjoining silence with a movement of the hand' is an introductory phrase, so a comma separates it from the main clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-121-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I alighted beside him___ the train moved on.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As I alighted beside him, the train moved on.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As I alighted beside him' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-2275-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If Mrs. Renauld wants to hush anything up___ I’ll take my cue from her.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "If Mrs. Renauld wants to hush anything up, I’ll take my cue from her.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'If Mrs. Renauld wants to hush anything up' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-34-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As he spoke the last words___ we drew up in front of the fine old house.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "As he spoke the last words, we drew up in front of the fine old house.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'As he spoke the last words' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-2003-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before I knew where I was___ we were standing on the platform, bareheaded and minus our valises, whilst the train disappeared into the night.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Before I knew where I was, we were standing on the platform, bareheaded and minus our valises, whilst the train disappeared into the night.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'Before I knew where I was' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-1686-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "However that may have been___ her eloquence and personality won the day.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "However that may have been, her eloquence and personality won the day.",
  "rule": "A dependent clause that opens a sentence is followed by a comma before the main clause. Here, 'However that may have been' is the opener, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-58866-340-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Surprised___ the magistrate insisted, but the girl held firm.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "Surprised, the magistrate insisted, but the girl held firm.",
  "rule": "'Surprised' is an introductory modifier, so a comma follows it before the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1376-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "However unpleasant___ we have got to face facts.",
  "options": [
   ",",
   ";",
   ":",
   "—"
  ],
  "answer": ",",
  "fixed": "However unpleasant, we have got to face facts.",
  "rule": "'However unpleasant' is an introductory phrase, so it takes a comma before the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-279-3",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The most alarming sounds ___ audible from the interior of the room.",
  "options": [
   "were",
   "was",
   "is",
   "has been"
  ],
  "answer": "were",
  "fixed": "The most alarming sounds were audible from the interior of the room.",
  "rule": "The subject is the plural 'sounds', not 'room', so the verb must be plural. The story is told in the past, so 'were' fits.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-72824-1413-7",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "A man of the type of the Comte ___ always a coward; he takes no risks.",
  "options": [
   "is",
   "are",
   "were",
   "being"
  ],
  "answer": "is",
  "fixed": "A man of the type of the Comte is always a coward; he takes no risks.",
  "rule": "The subject is 'man', not 'Comte' or 'type', so the verb is singular. The present tense 'takes' shows 'is' matches.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-351-0",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "A perplexed frown ___ beginning to gather between Poirot’s eyes.",
  "options": [
   "was",
   "were",
   "are",
   "been"
  ],
  "answer": "was",
  "fixed": "A perplexed frown was beginning to gather between Poirot’s eyes.",
  "rule": "The subject is the singular 'frown', not 'eyes', so the verb is singular. The story is in past tense, so 'was'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-213-3",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The side door in question ___ a small one in the angle of the wall, not more than a dozen yards from the scene of the tragedy.",
  "options": [
   "was",
   "were",
   "are",
   "have been"
  ],
  "answer": "was",
  "fixed": "The side door in question was a small one in the angle of the wall, not more than a dozen yards from the scene of the tragedy.",
  "rule": "The subject is the singular 'door', so the verb must be singular. Ignore 'wall' and 'yards'; the narration is past, so 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-3191-1",
  "type": "mc",
  "skill": "tense",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The murderer must have been a person who ___ the opportunity to purloin that dagger from the silver table.",
  "options": [
   "had",
   "has",
   "have",
   "having"
  ],
  "answer": "had",
  "fixed": "The murderer must have been a person who had the opportunity to purloin that dagger from the silver table.",
  "rule": "The relative clause is telling about the past (the murderer 'must have been'), so the verb stays in the past tense: 'had'. 'Having' leaves no complete verb.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-1351-2",
  "type": "mc",
  "skill": "tense",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If it ___ Monsieur John, I could have understood it.",
  "options": [
   "had been",
   "would have been",
   "was",
   "has been"
  ],
  "answer": "had been",
  "fixed": "If it had been Monsieur John, I could have understood it.",
  "rule": "A past unreal condition ('If...') pairs with 'had been'. 'Could have understood' is the result part, and 'would have been' cannot go in the if-clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-2442-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If there was the shadow of a motive___ nothing’s more likely than that he killed Mr. Ackroyd.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If there was the shadow of a motive, nothing’s more likely than that he killed Mr. Ackroyd.",
  "rule": "An introductory clause that begins with a word like if needs a comma after it before the main clause starts. Here, \"If there was the shadow of a motive\" is the intro clause, so a comma follows it.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-2529-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Looking over my shoulder___ I saw Dulcie reaching the branch behind me.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Looking over my shoulder, I saw Dulcie reaching the branch behind me.",
  "rule": "An introductory participial phrase is followed by a comma. \"Looking over my shoulder\" opens the sentence, so it is set off before the subject \"I.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-2201-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If you ask me___ the girl is very likely in league with a gang.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If you ask me, the girl is very likely in league with a gang.",
  "rule": "An introductory clause is followed by a comma. \"If you ask me\" is a dependent clause that cannot stand alone, so it is set off from \"the girl is very likely...\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-2315-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As though against his will___ Parker nodded reluctantly once.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As though against his will, Parker nodded reluctantly once.",
  "rule": "An introductory phrase that begins with \"As though\" is set off with a comma. The main clause starts at \"Parker.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-2170-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When I realized that this girl must have taken the dagger___ I warned you.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When I realized that this girl must have taken the dagger, I warned you.",
  "rule": "A dependent clause that starts with \"When\" and comes first needs a comma after it. The independent clause \"I warned you\" follows.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1478-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After strolling along for a minute or two in silence___ the millionaire spoke:",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "After strolling along for a minute or two in silence, the millionaire spoke:",
  "rule": "An introductory phrase gets a comma, and you never separate a subject from its verb. Here the phrase ends before \"the millionaire,\" so the comma goes there.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-1723-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If it is necessary for a criminal to be a consummate actress___ then by all means assume her to be one.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If it is necessary for a criminal to be a consummate actress, then by all means assume her to be one.",
  "rule": "An if-clause that opens the sentence is followed by a comma. The main clause begins with \"then by all means.\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-1419-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As they all went out of the room___ Poirot turned and made me a sign to follow him upstairs.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As they all went out of the room, Poirot turned and made me a sign to follow him upstairs.",
  "rule": "An introductory clause beginning with \"As\" needs a comma after it. \"Poirot\" begins the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-198-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As we waited___ the gate of it swung open and a girl came out.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As we waited, the gate of it swung open and a girl came out.",
  "rule": "\"As we waited\" is an introductory dependent clause, so it is followed by a comma. A semicolon or colon would need a complete sentence before it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-964-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If I wanted information about the papers on that desk___ Mr. Raymond would have noticed anything there was to see.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If I wanted information about the papers on that desk, Mr. Raymond would have noticed anything there was to see.",
  "rule": "A comma follows an introductory if-clause. The independent clause starts with \"Mr. Raymond.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-973-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As soon as I had read up the subject of yellow jasmine___ I saw the truth.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As soon as I had read up the subject of yellow jasmine, I saw the truth.",
  "rule": "\"As soon as...\" starts a dependent clause, so a comma separates it from the main clause \"I saw the truth.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-69087-721-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If it was put through from here___ I don’t see how any one else but Parker could have sent it.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If it was put through from here, I don’t see how any one else but Parker could have sent it.",
  "rule": "An introductory if-clause is followed by a comma. A semicolon would wrongly join a dependent clause to the main one.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-2319-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When he had finished___ she drew a long breath.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When he had finished, she drew a long breath.",
  "rule": "A dependent clause that opens a sentence is followed by a comma. Without it the two parts run together.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-1677-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If he’s innocent___ why doesn’t he come forward?",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If he’s innocent, why doesn’t he come forward?",
  "rule": "A comma follows the introductory if-clause. The question \"why doesn’t he come forward\" is the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-2429-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When at last he spoke___ it was in a gentle far-away voice that produced a curious impression.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When at last he spoke, it was in a gentle far-away voice that produced a curious impression.",
  "rule": "\"When at last he spoke\" is an introductory clause and takes a comma. The main clause begins with \"it was.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-110-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After a moment's hesitation___ Krassnine gestured towards the small parcel on the table.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "After a moment's hesitation, Krassnine gestured towards the small parcel on the table.",
  "rule": "An introductory prepositional phrase of this length is set off with a comma. The subject \"Krassnine\" comes after the comma.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-2537-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before I could move a hand to stop her___ she appeared to leap upward into space.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Before I could move a hand to stop her, she appeared to leap upward into space.",
  "rule": "A clause that starts with \"Before\" and opens the sentence is followed by a comma. The independent clause is \"she appeared to leap...\"",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-199-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As we drove through the village___ I remembered that I wanted some stamps, so accordingly we pulled up at the post office.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As we drove through the village, I remembered that I wanted some stamps, so accordingly we pulled up at the post office.",
  "rule": "A comma separates the introductory \"As\" clause from the main clause. Without it the reader may stumble over \"village I remembered.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-1958-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "However that may be___ my father was broken-hearted.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "However that may be, my father was broken-hearted.",
  "rule": "\"However that may be\" is an introductory clause and needs a comma after it. A colon or semicolon does not fit because the opening is not a complete sentence.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-2321-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Still frowning___ he went across to the desk and took out a small pack of patience cards.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Still frowning, he went across to the desk and took out a small pack of patience cards.",
  "rule": "An introductory participial phrase (\"Still frowning\") is followed by a comma before the subject \"he.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-44-7",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When she goes out___ it is not to gather in information, but to spread it.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When she goes out, it is not to gather in information, but to spread it.",
  "rule": "A comma follows the introductory \"When\" clause. The main clause begins with \"it is not.\"",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-45-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As a professional man___ I naturally aim at discretion.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As a professional man, I naturally aim at discretion.",
  "rule": "An introductory phrase that opens the sentence is followed by a comma. The subject \"I\" starts the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-1390-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Mason is got out of the way___ a dinner basket is ordered.",
  "options": [
   ";",
   ",",
   "",
   ":"
  ],
  "answer": ";",
  "fixed": "Mason is got out of the way; a dinner basket is ordered.",
  "rule": "Two complete sentences can be joined with a semicolon. A comma alone would be a comma splice, and no punctuation would be a run-on.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-61262-1530-5",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I talked to Norman___ whom I found quite an amusing fellow.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "I talked to Norman, whom I found quite an amusing fellow.",
  "rule": "\"Whom I found quite an amusing fellow\" adds extra information about Norman, so a comma sets it off. A semicolon needs a complete sentence after it.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-14-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Lawrence___ had been a delicate youth.",
  "options": [
   ", the younger,",
   ", the younger",
   " the younger,",
   " the younger"
  ],
  "answer": ", the younger,",
  "fixed": "Lawrence, the younger, had been a delicate youth.",
  "rule": "\"The younger\" is an appositive that can be removed, so it needs commas on both sides. One comma or none leaves the interrupter half set off.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-700-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I pass over Alfred Inglethorp___ acted the bereaved widower in a manner that I felt to be disgusting in its hypocrisy.",
  "options": [
   ", who",
   " who",
   ", that",
   " which"
  ],
  "answer": ", who",
  "fixed": "I pass over Alfred Inglethorp, who acted the bereaved widower in a manner that I felt to be disgusting in its hypocrisy.",
  "rule": "The clause about the widower only adds extra information about a named person, so it is nonessential and is set off with a comma and who. Names do not need a defining clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-642-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Although I disliked the detective heartily___ nevertheless was secretly impressed.",
  "options": [
   ", I",
   " I",
   "; I",
   ": I"
  ],
  "answer": ", I",
  "fixed": "Although I disliked the detective heartily, I nevertheless was secretly impressed.",
  "rule": "A clause that begins with a word like although is an introductory clause, and it needs a comma before the main clause begins. Here the comma goes after heartily.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-854-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When he had finished___ Poirot took up the thread with a question.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "When he had finished, Poirot took up the thread with a question.",
  "rule": "An introductory clause beginning with when is followed by a comma. Then the main clause, Poirot took up the thread, begins.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-1943-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I got to the bottom drawer___ Bourne came in.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "As I got to the bottom drawer, Bourne came in.",
  "rule": "As I got to the bottom drawer cannot stand alone, so it is an introductory clause. Put a comma after it before the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-376-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After a word or two to the Inspector___ the three of us went to the White Hart and discussed eggs and bacon and Devonshire cider.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "After a word or two to the Inspector, the three of us went to the White Hart and discussed eggs and bacon and Devonshire cider.",
  "rule": "An introductory phrase that begins with a preposition is followed by a comma. The main clause starts at the three of us.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-1801-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "John, who had gone into the house___ now reappeared.",
  "options": [
   ", ",
   "",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "John, who had gone into the house, now reappeared.",
  "rule": "A nonessential clause needs commas on both sides. The opening comma after John means a closing comma is needed after house, before the verb.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-2394-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "I had an additional reason for that belief in the fact that all the cups found contained sugar___which Mademoiselle Cynthia never took in her coffee.",
  "options": [
   ", ",
   "; ",
   ": ",
   " "
  ],
  "answer": ", ",
  "fixed": "I had an additional reason for that belief in the fact that all the cups found contained sugar, which Mademoiselle Cynthia never took in her coffee.",
  "rule": "The which clause adds extra information about sugar and could be removed, so it is nonessential and needs a comma. Which should never follow a semicolon here because the clause is not a sentence.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-295-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The day had been fine and dry, so our feet were not likely to leave any prints___ nevertheless, we wiped them carefully on the mat before entering.",
  "options": [
   "; ",
   ", ",
   ": ",
   " "
  ],
  "answer": "; ",
  "fixed": "The day had been fine and dry, so our feet were not likely to leave any prints; nevertheless, we wiped them carefully on the mat before entering.",
  "rule": "Two complete sentences linked by a transition like nevertheless need a semicolon before the transition. A comma there would be a comma splice.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-928-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The bonds were sold in New York___ therefore they were not thrown overboard.",
  "options": [
   "; ",
   ", ",
   ": ",
   " "
  ],
  "answer": "; ",
  "fixed": "The bonds were sold in New York; therefore they were not thrown overboard.",
  "rule": "Therefore is a transition, not a conjunction, so it cannot join two sentences with just a comma. Use a semicolon before it.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-72824-287-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Of course he sympathized with you___ of course he tried to soothe you down.",
  "options": [
   "; ",
   ", ",
   ": ",
   " "
  ],
  "answer": "; ",
  "fixed": "Of course he sympathized with you; of course he tried to soothe you down.",
  "rule": "Each half is a complete sentence and nothing joins them, so a semicolon is needed. A comma alone makes a comma splice.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-2144-0",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The first witnesses for the prosecution ___ mostly those who had been called at the inquest, the medical evidence being again taken first.",
  "options": [
   "were",
   "was",
   "is",
   "has been"
  ],
  "answer": "were",
  "fixed": "The first witnesses for the prosecution were mostly those who had been called at the inquest, the medical evidence being again taken first.",
  "rule": "The subject is the plural witnesses, so the verb must be plural. Also the passage is in the past, so were fits.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-298-2",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The convulsions ___ of a violence terrible to behold.",
  "options": [
   "were",
   "was",
   "is",
   "has been"
  ],
  "answer": "were",
  "fixed": "The convulsions were of a violence terrible to behold.",
  "rule": "Convulsions is plural, so it takes a plural verb. Violence is singular but it is not the subject.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-1817-3",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The round table in the centre bore the remains of a meal; three chairs ___ pushed back, as though their occupants had just risen.",
  "options": [
   "were",
   "was",
   "is",
   "has been"
  ],
  "answer": "were",
  "fixed": "The round table in the centre bore the remains of a meal; three chairs were pushed back, as though their occupants had just risen.",
  "rule": "Three chairs is plural, so use the plural verb. The rest of the sentence is in the past, so were also keeps the tense consistent.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-2844-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before I had time to speak___ Mrs. Ackroyd was off again.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "Before I had time to speak, Mrs. Ackroyd was off again.",
  "rule": "Before I had time to speak is an introductory clause and takes a comma after it. Mrs. Ackroyd starts the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-638-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If he was going to take the matter that way___ it was no good arguing with him.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "If he was going to take the matter that way, it was no good arguing with him.",
  "rule": "An if clause at the start of a sentence is an introductory clause and ends with a comma. The main clause follows.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-1911-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After bowing his guest out___ Poirot returned to his arm-chair and smiled at me.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "After bowing his guest out, Poirot returned to his arm-chair and smiled at me.",
  "rule": "After bowing his guest out is an introductory phrase, so put a comma after it. Do not put a comma between the subject Poirot and its verb.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-587-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I reflected on this___ there was a knock on the door.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "As I reflected on this, there was a knock on the door.",
  "rule": "An introductory clause that starts with as is followed by a comma. There was a knock is the main clause.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-2070-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before I could reply___ one of the other Belgians opened the door and stuck his head in.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "Before I could reply, one of the other Belgians opened the door and stuck his head in.",
  "rule": "Before I could reply is an introductory clause, so a comma follows it. The main clause is one of the other Belgians opened the door.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-2098-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I was saying___ her pride and jealousy have been laid aside.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "As I was saying, her pride and jealousy have been laid aside.",
  "rule": "As I was saying is an introductory clause and is set off with a comma before the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-429-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Since there is no dust___ the room must have been done this morning.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "Since there is no dust, the room must have been done this morning.",
  "rule": "Since there is no dust is an introductory clause and needs a comma. Without it the reader would run the two ideas together.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-3238-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When I have finished writing___ I shall enclose this whole manuscript in an envelope and address it to Poirot.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "When I have finished writing, I shall enclose this whole manuscript in an envelope and address it to Poirot.",
  "rule": "A when clause at the start of the sentence is introductory and is followed by a comma.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-629-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After a minute or two of hesitation___ Mrs. Harfield tore up the sheet of notepaper and started afresh.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "After a minute or two of hesitation, Mrs. Harfield tore up the sheet of notepaper and started afresh.",
  "rule": "A long introductory phrase takes a comma before the main clause. Here the phrase ends at hesitation.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-61262-211-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As we bent over her, uncertain for the moment whether she were dead or alive___ her eyelids opened.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "As we bent over her, uncertain for the moment whether she were dead or alive, her eyelids opened.",
  "rule": "The long introductory modifier ends at alive, and a comma separates it from the main clause her eyelids opened.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-646-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "To my horror I observed that he was brandishing my revolver___which Poirot must doubtless have put down through inadvertence in the cab.",
  "options": [
   ", ",
   "; ",
   ": ",
   " "
  ],
  "answer": ", ",
  "fixed": "To my horror I observed that he was brandishing my revolver, which Poirot must doubtless have put down through inadvertence in the cab.",
  "rule": "Which clauses that only add extra detail about a noun are nonessential and follow a comma. The revolver is already identified by my.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-72824-3272-13",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After my leaving your hotel___ she had had time to consult with somebody, and had received instructions which she acted upon.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "After my leaving your hotel, she had had time to consult with somebody, and had received instructions which she acted upon.",
  "rule": "After my leaving your hotel is an introductory phrase, so a comma follows it.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-2420-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As for the rest___ I will explain it to you one of these days.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "As for the rest, I will explain it to you one of these days.",
  "rule": "As for the rest is an introductory phrase and needs a comma after it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-908-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When the doctor left this room___ he merely closed the door behind him.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "When the doctor left this room, he merely closed the door behind him.",
  "rule": "A when clause that opens a sentence is followed by a comma before the main clause.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-1340-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "In the first place___ who gagged and bound Madame Renauld?",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "In the first place, who gagged and bound Madame Renauld?",
  "rule": "In the first place is an introductory phrase, so a comma follows it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1622-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Seeing as how I only saw his back___ it's hard to say.",
  "options": [
   ", ",
   " ",
   "; ",
   ": "
  ],
  "answer": ", ",
  "fixed": "Seeing as how I only saw his back, it's hard to say.",
  "rule": "Seeing as how I only saw his back is introductory, so it takes a comma before the main clause.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-58866-2592-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When she actually came forward and confessed to the murder___ it seemed that all was over.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When she actually came forward and confessed to the murder, it seemed that all was over.",
  "rule": "A comma follows an introductory subordinate clause. Here \"When she actually came forward and confessed to the murder\" cannot stand alone, so a comma separates it from the main clause.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-1844-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Once within his own room___ he bolted his door and looked sharply round.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Once within his own room, he bolted his door and looked sharply round.",
  "rule": "Use a comma after an introductory phrase. \"Once within his own room\" opens the sentence and is followed by the main clause, so it needs a comma.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-2135-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As the weeks went by___ the state of Poirot’s nerves grew worse and worse.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As the weeks went by, the state of Poirot’s nerves grew worse and worse.",
  "rule": "An introductory clause beginning with \"As\" is followed by a comma. A semicolon or colon would need a complete sentence before it.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-396-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As to the son___ it may have been a wise precaution to leave the money in his mother’s hands.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As to the son, it may have been a wise precaution to leave the money in his mother’s hands.",
  "rule": "A comma follows an introductory phrase. \"As to the son\" is not a complete sentence, so it takes a comma, not a semicolon or colon.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-2140-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Luckily for Mr. Inglethorp___ he had been able to produce an unimpeachable alibi.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Luckily for Mr. Inglethorp, he had been able to produce an unimpeachable alibi.",
  "rule": "Put a comma after an introductory phrase. \"Luckily for Mr. Inglethorp\" is an opener, so the comma separates it from the main clause.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-2837-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The only member of the family at home proved to be Mrs. Ackroyd___ who was sipping an early cup of tea.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "The only member of the family at home proved to be Mrs. Ackroyd, who was sipping an early cup of tea.",
  "rule": "A nonessential clause that adds extra information about a named person is set off with a comma. \"Mrs. Ackroyd\" is already identified, so the \"who\" clause is extra and needs a comma before it.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-1832-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Poirot, who had been watching my face___ nodded.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Poirot, who had been watching my face, nodded.",
  "rule": "A nonessential interrupter needs commas on both sides. The comma after \"Poirot\" opened it, so a matching comma must close it before the verb \"nodded\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-3057-15",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The man whom Dr. Sheppard met had an American accent___ which fitted in with that supposition.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "The man whom Dr. Sheppard met had an American accent, which fitted in with that supposition.",
  "rule": "A \"which\" clause that adds extra information is nonessential and takes a comma before it. Here \"which fitted in with that supposition\" comments on the whole idea.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-61262-1928-7",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When I was fourteen___ my mother followed him to the grave.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When I was fourteen, my mother followed him to the grave.",
  "rule": "An introductory clause starting with \"When\" is followed by a comma before the main clause. No semicolon is possible because the first part is not a complete sentence.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-863-1379-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before very long___ we had all trooped into the drawing-room, the door of which Japp closed.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Before very long, we had all trooped into the drawing-room, the door of which Japp closed.",
  "rule": "A comma follows an introductory phrase. \"Before very long\" is a time opener, and the comma separates it from the subject \"we\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-863-1701-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "After the walk across the open park___ it was pleasant to saunter lazily through the cool glades.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "After the walk across the open park, it was pleasant to saunter lazily through the cool glades.",
  "rule": "A long introductory phrase takes a comma after it. \"After the walk across the open park\" is not a full sentence, so only a comma works.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-1787-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "He inquired politely after my sister___ whom he declared to be a most interesting woman.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "He inquired politely after my sister, whom he declared to be a most interesting woman.",
  "rule": "A \"whom\" clause that adds extra detail about a specific person is nonessential and set off by a comma. The sentence still makes sense without it.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-1774-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When Hippolyte had withdrawn___ the Comte sipped his black coffee with a reflective air.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When Hippolyte had withdrawn, the Comte sipped his black coffee with a reflective air.",
  "rule": "Put a comma after an introductory clause. \"When Hippolyte had withdrawn\" depends on the main clause that follows.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-1883-9",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I came to know later___ this secrecy was characteristic of him.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As I came to know later, this secrecy was characteristic of him.",
  "rule": "An introductory clause is followed by a comma. \"As I came to know later\" opens the sentence, and \"this secrecy\" begins the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-72824-1757-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As the man-servant was preparing to depart___ the Comte arrested him with a slight gesture.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As the man-servant was preparing to depart, the Comte arrested him with a slight gesture.",
  "rule": "Use a comma after an introductory clause. \"As the man-servant was preparing to depart\" cannot stand alone, so a semicolon would be wrong.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-395-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When he did speak___ the question he asked came as a complete surprise.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When he did speak, the question he asked came as a complete surprise.",
  "rule": "A comma separates an introductory \"When\" clause from the main clause. Without it, \"speak the question\" reads as if \"question\" were the object.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-58866-567-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Though slightly surprised at the request___ Mrs. Renauld held them out to him.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Though slightly surprised at the request, Mrs. Renauld held them out to him.",
  "rule": "An introductory phrase or clause beginning with \"Though\" gets a comma. The main clause starts at \"Mrs. Renauld\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-614-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As he lifted the receiver___ the man made a sudden, cat-like jump at me.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As he lifted the receiver, the man made a sudden, cat-like jump at me.",
  "rule": "An introductory clause is followed by a comma. \"As he lifted the receiver\" is dependent, so only a comma fits.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-418-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As Poirot proceeded___ his answers came quicker.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As Poirot proceeded, his answers came quicker.",
  "rule": "Use a comma after an introductory clause. \"As Poirot proceeded\" is dependent and needs a comma before the main clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-3116-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If the good doctor is concealing the young man___ what place would he choose?",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If the good doctor is concealing the young man, what place would he choose?",
  "rule": "A comma follows an introductory \"If\" clause. The first part is incomplete on its own, so a semicolon or colon would be wrong.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-298-7",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Having explored the ground___ Poirot commented upon it in a low running monologue.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Having explored the ground, Poirot commented upon it in a low running monologue.",
  "rule": "An introductory participial phrase is followed by a comma. \"Having explored the ground\" describes Poirot, who comes right after the comma.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-3287-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The jewels are not, and never have been___ in her possession.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "The jewels are not, and never have been, in her possession.",
  "rule": "An interrupter set off by commas needs a closing comma too. \"and never have been\" began after a comma, so another comma must close it.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-863-1615-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then, to my intense surprise___ he shook his head decidedly.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Then, to my intense surprise, he shook his head decidedly.",
  "rule": "An interrupting phrase needs commas on both sides. \"to my intense surprise\" opens with a comma, so it must close with one before the subject \"he\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-69087-3226-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When I met him and he seemed so agitated___ I thought that perhaps he knew the truth, but that he couldn’t bring himself to believe it, and was going to give me the chance of refuting it.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When I met him and he seemed so agitated, I thought that perhaps he knew the truth, but that he couldn’t bring himself to believe it, and was going to give me the chance of refuting it.",
  "rule": "A comma follows a long introductory clause. \"When I met him and he seemed so agitated\" cannot stand alone, so the comma comes before \"I thought\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-3226-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As soon as I heard of Mrs. Ferrars’s death___ I felt convinced that she would have told him everything before she died.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As soon as I heard of Mrs. Ferrars’s death, I felt convinced that she would have told him everything before she died.",
  "rule": "An introductory clause starting with \"As soon as\" takes a comma. The main clause begins with \"I felt convinced\".",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-69087-3231-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When I looked round the room from the door___ I was quite satisfied.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When I looked round the room from the door, I was quite satisfied.",
  "rule": "Put a comma after an introductory clause that begins with a word like \"when\". Here \"When I looked round the room from the door\" is an introductory clause, so a comma must follow it before the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-70114-1217-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As Poirot put it___ things didn't sound so bad.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As Poirot put it, things didn't sound so bad.",
  "rule": "An introductory clause needs a comma before the main clause. \"As Poirot put it\" opens the sentence, so a comma follows it.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-61262-1805-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The doctor rang again and again___ we could hear the bell trilling within, but no sign of life rewarded us.",
  "options": [
   ";",
   ",",
   "",
   ": and"
  ],
  "answer": ";",
  "fixed": "The doctor rang again and again; we could hear the bell trilling within, but no sign of life rewarded us.",
  "rule": "Two complete sentences can be joined by a semicolon, but not by a comma alone (a comma splice). Both \"The doctor rang again and again\" and \"we could hear the bell trilling within\" are complete, so use a semicolon.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-1590-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "At that moment Major Norman returned___ accompanied by a young officer in the uniform of the Flying Corps.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "At that moment Major Norman returned, accompanied by a young officer in the uniform of the Flying Corps.",
  "rule": "A phrase that adds extra information after a complete sentence is set off with a comma. \"accompanied by a young officer...\" is not a complete sentence, so a semicolon or colon is wrong; use a comma.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-69087-2932-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As for that husband of yours___ I don’t think much of him, and I tell you so candidly.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As for that husband of yours, I don’t think much of him, and I tell you so candidly.",
  "rule": "An introductory phrase such as \"As for that husband of yours\" is followed by a comma before the main clause begins.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-200-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I came out again___ I cannoned into a little man who was just entering.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As I came out again, I cannoned into a little man who was just entering.",
  "rule": "Use a comma after an introductory clause. \"As I came out again\" cannot stand alone, so it needs a comma before \"I cannoned\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-70114-765-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As soon as I saw what I had done___ I took it to Mr. Ryland and explained.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As soon as I saw what I had done, I took it to Mr. Ryland and explained.",
  "rule": "\"As soon as I saw what I had done\" is an introductory clause, so a comma goes before the main clause. A semicolon would need a complete sentence before it.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-863-1473-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If Miss Howard were capable of poisoning the old lady___ she would be quite equally capable of simulating devotion.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If Miss Howard were capable of poisoning the old lady, she would be quite equally capable of simulating devotion.",
  "rule": "A clause beginning with \"if\" that comes first in the sentence is followed by a comma. The main clause starts at \"she would be\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-1901-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If Giraud wants a statement from her___ he will have to wait.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If Giraud wants a statement from her, he will have to wait.",
  "rule": "Put a comma after an introductory \"if\" clause. The main clause is \"he will have to wait\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-61262-1112-6",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As far as I could see___ nobody could derive any particular profit from Sir John’s death.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As far as I could see, nobody could derive any particular profit from Sir John’s death.",
  "rule": "\"As far as I could see\" is an introductory clause and takes a comma before the main clause.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-1751-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Though I had no intention of abandoning the struggle___ I saw that it behoved me to walk warily and adopt every possible precaution.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Though I had no intention of abandoning the struggle, I saw that it behoved me to walk warily and adopt every possible precaution.",
  "rule": "A clause that starts with \"though\" is subordinate, so when it opens the sentence it is followed by a comma. A semicolon would wrongly join a fragment to a sentence.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-1787-3",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Then he paced back again___ nodding his head as he did so.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Then he paced back again, nodding his head as he did so.",
  "rule": "A participial phrase that trails after a complete sentence is set off with a comma. \"nodding his head...\" is not a sentence, so a semicolon or colon is wrong.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-69087-379-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As I was about to speak___ Ackroyd threw up his hand.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As I was about to speak, Ackroyd threw up his hand.",
  "rule": "Use a comma after an introductory clause. \"As I was about to speak\" is the clause, and \"Ackroyd threw up his hand\" is the main clause.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-61262-1754-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before we were half-way through breakfast___ the door flew open and Japp rushed in.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Before we were half-way through breakfast, the door flew open and Japp rushed in.",
  "rule": "The introductory clause \"Before we were half-way through breakfast\" needs a comma after it. The rest is one main clause with a compound predicate, so no other comma is needed.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-61262-491-8",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When the lights went out___ I clasped her hand, you see.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "When the lights went out, I clasped her hand, you see.",
  "rule": "Place a comma after the introductory \"When\" clause, before the main clause \"I clasped her hand\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-211-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If he intended to return later for the body___ I can see some point in his visit.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If he intended to return later for the body, I can see some point in his visit.",
  "rule": "An opening \"if\" clause is followed by a comma. Here it separates the condition from the main clause \"I can see some point in his visit\".",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-2500-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As we went round to the side of the house___ I drew Poirot’s attention to a window on the first floor.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As we went round to the side of the house, I drew Poirot’s attention to a window on the first floor.",
  "rule": "A comma follows an introductory clause. \"As we went round to the side of the house\" is the clause, so the comma belongs before \"I drew\".",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-863-2459-15",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "If they had left it alone___ it is possible the crime might never have been brought home to them.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "If they had left it alone, it is possible the crime might never have been brought home to them.",
  "rule": "Put a comma after an introductory \"if\" clause. The main clause begins at \"it is possible\".",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-61262-1282-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The room, which was a large double one___ was unoccupied.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "The room, which was a large double one, was unoccupied.",
  "rule": "\"which was a large double one\" is removable extra information, so it needs commas on both sides. The first comma is already there, so a closing comma is needed before the verb \"was\".",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-58866-2585-16",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "One he gave to his mother, one to Bella Duveen___ was it not highly probable that he had given the third one to Marthe Daubreuil?",
  "options": [
   ";",
   ",",
   "",
   ": and"
  ],
  "answer": ";",
  "fixed": "One he gave to his mother, one to Bella Duveen; was it not highly probable that he had given the third one to Marthe Daubreuil?",
  "rule": "A semicolon joins two closely related independent clauses. A comma alone would create a comma splice between the statement and the question.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1058-0",
  "type": "mc",
  "skill": "agreement",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "The door of the flat ___ opened to us by a man-servant with a peculiarly wooden face.",
  "options": [
   "was",
   "were",
   "is",
   "have been"
  ],
  "answer": "was",
  "fixed": "The door of the flat was opened to us by a man-servant with a peculiarly wooden face.",
  "rule": "The verb agrees with its true subject, \"door\", not with \"flat\". \"Door\" is singular, and the story is told in the past, so \"was\" is correct.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-531-0",
  "type": "mc",
  "skill": "tense",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "She flung out a long, pale hand towards the piano, which ___ littered with untidy music scores.",
  "options": [
   "was",
   "were",
   "is",
   "are"
  ],
  "answer": "was",
  "fixed": "She flung out a long, pale hand towards the piano, which was littered with untidy music scores.",
  "rule": "\"Which\" refers to the singular \"piano\", so the verb is singular. The narration is in the past tense (\"flung\"), so \"was\" fits and \"is\" does not.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-863-674-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And, with a characteristic shrug, he dismissed whatever it was that was worrying him from his mind. I could have told him from the beginning that this obsession of his over the coffee was bound to end in a blind alley, but I restrain my tongue.",
  "fixed": "And, with a characteristic shrug, he dismissed whatever it was that was worrying him from his mind. I could have told him from the beginning that this obsession of his over the coffee was bound to end in a blind alley, but I restrained my tongue.",
  "targetWords": [
   "restrain"
  ],
  "options": [
   "restrained",
   "restrain",
   "will restrain",
   "am restraining"
  ],
  "answer": "restrained",
  "hint1": "The narrator is looking back on a past event.",
  "rule": "Keep verb tense consistent when events happen at the same time in the past. The passage tells a past scene (dismissed, could have told), so the last verb must be past tense: restrained.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-863-2141-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "On the afternoon of July 17th, continued Counsel, immediately after the quarrel with her son, Mrs. Inglethorp makes a new will. This will was found destroyed in the grate of her bedroom the following morning, but evidence had come to light which showed that it had been drawn up in favour of her husband.",
  "fixed": "On the afternoon of July 17th, continued Counsel, immediately after the quarrel with her son, Mrs. Inglethorp made a new will. This will was found destroyed in the grate of her bedroom the following morning, but evidence had come to light which showed that it had been drawn up in favour of her husband.",
  "targetWords": [
   "makes"
  ],
  "options": [
   "made",
   "makes",
   "has made",
   "will make"
  ],
  "answer": "made",
  "hint1": "The will was found destroyed the next morning, so the making came earlier.",
  "rule": "Verbs describing a sequence of past events should stay in the past tense. The will 'was found' the next morning, so its making must also be past: made.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-61262-1845-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "This was Graves, valet-butler to the late Count Foscatini. The story he has to tell was a sensational one.",
  "fixed": "This was Graves, valet-butler to the late Count Foscatini. The story he had to tell was a sensational one.",
  "targetWords": [
   "has"
  ],
  "options": [
   "had",
   "has",
   "will have",
   "is having"
  ],
  "answer": "had",
  "hint1": "The sentence is about a past moment, as 'was' shows.",
  "rule": "Verb tense should stay consistent when the time does not change. The sentence is set in the past ('was a sensational one'), so the story he 'had' to tell fits, not 'has'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-70114-1261-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Once we took a bus and once we went for some considerable way in a train, and always our route leads us steadily eastward. We went through strange districts, the existence of which I had never dreamed of.",
  "fixed": "Once we took a bus and once we went for some considerable way in a train, and always our route led us steadily eastward. We went through strange districts, the existence of which I had never dreamed of.",
  "targetWords": [
   "leads"
  ],
  "options": [
   "led",
   "leads",
   "will lead",
   "is leading"
  ],
  "answer": "led",
  "hint1": "Compare it to 'took' and 'went' in the same sentence.",
  "rule": "Keep verb tense consistent within a sentence when the actions happen at the same time. 'Took' and 'went' are past, so the route 'led' them, not 'leads'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-58866-1681-2",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "She continued to declare strenuously that she was of royal birth, and that she had been substituted for the daughter of the fruit seller at an early age. Absurd and completely unsubstantiated as these statements were, a great number of people believe implicitly in their truth.",
  "fixed": "She continued to declare strenuously that she was of royal birth, and that she had been substituted for the daughter of the fruit seller at an early age. Absurd and completely unsubstantiated as these statements were, a great number of people believed implicitly in their truth.",
  "targetWords": [
   "believe"
  ],
  "options": [
   "believed",
   "believe",
   "will believe",
   "have believed"
  ],
  "answer": "believed",
  "hint1": "Look at 'continued' and 'were' for the time frame.",
  "rule": "Do not shift tense without a change in time. The passage is all in the past (continued, were), so the people 'believed', not 'believe'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-61262-1594-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He moved a little aside as he spoke, and a figure comes forward out of the darkness. It was the second male prisoner who had gone in the other car, and as the light fell on his face, I gave a gasp of surprise.",
  "fixed": "He moved a little aside as he spoke, and a figure came forward out of the darkness. It was the second male prisoner who had gone in the other car, and as the light fell on his face, I gave a gasp of surprise.",
  "targetWords": [
   "comes"
  ],
  "options": [
   "came",
   "comes",
   "will come",
   "is coming"
  ],
  "answer": "came",
  "hint1": "It happens at the same time as 'moved' and 'spoke'.",
  "rule": "Verbs for a sequence of past events should all be past tense. He 'moved' and 'spoke', so the figure 'came' forward, not 'comes'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-69087-1785-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "That evening, at Poirot’s request, I went over to his house after dinner. Caroline sees me depart with visible reluctance.",
  "fixed": "That evening, at Poirot’s request, I went over to his house after dinner. Caroline saw me depart with visible reluctance.",
  "targetWords": [
   "sees"
  ],
  "options": [
   "saw",
   "sees",
   "will see",
   "has seen"
  ],
  "answer": "saw",
  "hint1": "Caroline reacts to the same past event the narrator describes.",
  "rule": "Keep verb tense consistent when the time does not change. The narrator 'went' that evening, so Caroline 'saw' him depart.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-72824-3329-5",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He had just finished telling her the same story he tells to Van Aldin two days before. Lenox had listened to him with absorbed attention, her brows knitted and her eyes sombre.",
  "fixed": "He had just finished telling her the same story he had told to Van Aldin two days before. Lenox had listened to him with absorbed attention, her brows knitted and her eyes sombre.",
  "targetWords": [
   "tells"
  ],
  "options": [
   "had told",
   "tells",
   "will tell",
   "is telling"
  ],
  "answer": "had told",
  "hint1": "The phrase 'two days before' places the telling earlier than the main past time.",
  "rule": "Use the past perfect for an action that happened before another past action. The earlier story-telling 'two days before' needs 'had told', not the present 'tells'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-70114-1740-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "No further sign came from the Big Four until about ten days later. I was crossing Hyde Park, lost in thought, when a voice, rich with a persuasive foreign inflection, hails me.",
  "fixed": "No further sign came from the Big Four until about ten days later. I was crossing Hyde Park, lost in thought, when a voice, rich with a persuasive foreign inflection, hailed me.",
  "targetWords": [
   "hails"
  ],
  "options": [
   "hailed",
   "hails",
   "will hail",
   "has hailed"
  ],
  "answer": "hailed",
  "hint1": "The voice interrupts the action described by 'was crossing'.",
  "rule": "A past action that interrupts another past action stays in the past tense. 'I was crossing' sets the past scene, so the voice 'hailed' me.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-69087-793-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I felt the pressure of his hand on my arm and followed the direction of his eyes. Inspector Davis seems to be inviting Parker’s opinion of a small pocket diary.",
  "fixed": "I felt the pressure of his hand on my arm and followed the direction of his eyes. Inspector Davis seemed to be inviting Parker’s opinion of a small pocket diary.",
  "targetWords": [
   "seems"
  ],
  "options": [
   "seemed",
   "seems",
   "will seem",
   "has seemed"
  ],
  "answer": "seemed",
  "hint1": "Compare it to 'felt' and 'followed'.",
  "rule": "Keep verb tense consistent across sentences about the same moment. 'Felt' and 'followed' are past, so Davis 'seemed' to be inviting an opinion.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-863-1656-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The boom of the gong sounded from the house, and we go in together. Poirot had been asked by John to remain to lunch and was already seated at the table.",
  "fixed": "The boom of the gong sounded from the house, and we went in together. Poirot had been asked by John to remain to lunch and was already seated at the table.",
  "targetWords": [
   "go"
  ],
  "options": [
   "went",
   "go",
   "will go",
   "are going"
  ],
  "answer": "went",
  "hint1": "The gong 'sounded' just before this.",
  "rule": "Verbs in a sequence of past events must all be past tense. The gong 'sounded', and then they 'went' in, not 'go'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-58866-1845-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Neatly and methodically, Poirot opened each drawer in turn, examined the contents, and returned them exactly to their places. It is a singularly dull and uninteresting proceeding.",
  "fixed": "Neatly and methodically, Poirot opened each drawer in turn, examined the contents, and returned them exactly to their places. It was a singularly dull and uninteresting proceeding.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The narrator describes the same past scene.",
  "rule": "Do not switch tense without a reason. Poirot 'opened', 'examined', and 'returned' in the past, so describing the scene must use 'was', not 'is'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-69087-478-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Caroline was full of curiosity to know why I had returned so early. I have to make up a slightly fictitious account of the evening in order to satisfy her, and I had an uneasy feeling that she saw through the transparent device.",
  "fixed": "Caroline was full of curiosity to know why I had returned so early. I had to make up a slightly fictitious account of the evening in order to satisfy her, and I had an uneasy feeling that she saw through the transparent device.",
  "targetWords": [
   "have"
  ],
  "options": [
   "had",
   "have",
   "will have",
   "am having"
  ],
  "answer": "had",
  "hint1": "The second half of the sentence uses 'had' and 'saw'.",
  "rule": "Keep verb tense consistent in a past-tense story. Caroline 'was' curious, so the narrator 'had' to invent an account, not 'have' to.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-69087-384-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was not a French window, but one of the ordinary sash type. The heavy blue velvet curtains were drawn in front of it, but the window itself is open at the top.",
  "fixed": "It was not a French window, but one of the ordinary sash type. The heavy blue velvet curtains were drawn in front of it, but the window itself was open at the top.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "Look at 'was' and 'were drawn' in the same passage.",
  "rule": "Keep the same tense when describing one scene. The curtains 'were drawn' and the window 'was not' French, so the window 'was' open, not 'is'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-72824-117-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "By common accord, they both turn to the window. They were just in time to see the American emerge into the street below.",
  "fixed": "By common accord, they both turned to the window. They were just in time to see the American emerge into the street below.",
  "targetWords": [
   "turn"
  ],
  "options": [
   "turned",
   "turn",
   "will turn",
   "are turning"
  ],
  "answer": "turned",
  "hint1": "The next sentence uses 'were'.",
  "rule": "Stay in one tense when the time does not change. 'They were just in time' is past, so they 'turned' to the window.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-72824-994-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "When they arrived at Cannes, Katherine got out and walks up and down the platform. She was curious about the lady in the mink coat and looked up at the windows of her compartment.",
  "fixed": "When they arrived at Cannes, Katherine got out and walked up and down the platform. She was curious about the lady in the mink coat and looked up at the windows of her compartment.",
  "targetWords": [
   "walks"
  ],
  "options": [
   "walked",
   "walks",
   "will walk",
   "has walked"
  ],
  "answer": "walked",
  "hint1": "It is joined by 'and' to 'got out'.",
  "rule": "Verbs joined by 'and' should share the same tense. Katherine 'got out' and 'walked', both past, not 'walks'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-61262-357-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I glanced at him uneasily, but he seems perfectly serious. A twinkle, however, came into his eye, and he added slyly:",
  "fixed": "I glanced at him uneasily, but he seemed perfectly serious. A twinkle, however, came into his eye, and he added slyly:",
  "targetWords": [
   "seems"
  ],
  "options": [
   "seemed",
   "seems",
   "will seem",
   "has seemed"
  ],
  "answer": "seemed",
  "hint1": "Compare it to 'glanced'.",
  "rule": "Verb tense should stay consistent for events in the same past moment. The narrator 'glanced' while Poirot 'seemed' serious.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-72824-111-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The American took it up and unrolls the wrapping paper. The contents he took over to a small electric lamp and submitted them to a very thorough examination.",
  "fixed": "The American took it up and unrolled the wrapping paper. The contents he took over to a small electric lamp and submitted them to a very thorough examination.",
  "targetWords": [
   "unrolls"
  ],
  "options": [
   "unrolled",
   "unrolls",
   "will unroll",
   "is unrolling"
  ],
  "answer": "unrolled",
  "hint1": "It is joined by 'and' to 'took'.",
  "rule": "Verbs joined by 'and' should match in tense. The American 'took' it up and 'unrolled' the paper, both past.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-61262-1986-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The woman explained that about two years and a half ago workmen had been in the house to do certain repairs. She is quite vague as to what the repairs were.",
  "fixed": "The woman explained that about two years and a half ago workmen had been in the house to do certain repairs. She was quite vague as to what the repairs were.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The woman 'explained' in the past.",
  "rule": "Keep tense consistent when describing one past conversation. She 'explained' and then 'was' vague, not 'is'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-72824-876-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He was surprised to see the quick colour flame in Ruth's cheeks. For a moment he almost thinks he saw dismay flash out of her eyes.",
  "fixed": "He was surprised to see the quick colour flame in Ruth's cheeks. For a moment he almost thought he saw dismay flash out of her eyes.",
  "targetWords": [
   "thinks"
  ],
  "options": [
   "thought",
   "thinks",
   "will think",
   "has thought"
  ],
  "answer": "thought",
  "hint1": "The first sentence uses 'was surprised'.",
  "rule": "Keep verb tense consistent within a past-tense scene. He 'was surprised' and 'thought' he saw dismay, not 'thinks'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-863-2108-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I asked Poirot whether he thought John would be condemned. To my intense surprise, he replies that, on the contrary, he was extremely likely to be acquitted.",
  "fixed": "I asked Poirot whether he thought John would be condemned. To my intense surprise, he replied that, on the contrary, he was extremely likely to be acquitted.",
  "targetWords": [
   "replies"
  ],
  "options": [
   "replied",
   "replies",
   "will reply",
   "has replied"
  ],
  "answer": "replied",
  "hint1": "It answers the question that was 'asked'.",
  "rule": "An answer to a past question stays in the past tense. The narrator 'asked', so Poirot 'replied'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-72824-2288-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He replaced the receiver and stood for a minute or two with a very curious smile on his face. George has to speak to him twice before obtaining an answer.",
  "fixed": "He replaced the receiver and stood for a minute or two with a very curious smile on his face. George had to speak to him twice before obtaining an answer.",
  "targetWords": [
   "has"
  ],
  "options": [
   "had",
   "has",
   "will have",
   "is having"
  ],
  "answer": "had",
  "hint1": "The previous sentence uses 'replaced' and 'stood'.",
  "rule": "Keep the same tense for events in one past scene. He 'replaced' and 'stood', so George 'had' to speak, not 'has'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-72824-151-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "The door opened, and a man stood in the aperture. He wears gold rings in his ears and was of a swarthy cast of countenance.",
  "fixed": "The door opened, and a man stood in the aperture. He wore gold rings in his ears and was of a swarthy cast of countenance.",
  "targetWords": [
   "wears"
  ],
  "options": [
   "wore",
   "wears",
   "will wear",
   "has worn"
  ],
  "answer": "wore",
  "hint1": "It shares a subject with 'was' later in the sentence.",
  "rule": "Verbs joined by 'and' should share a tense. He 'wore' rings and 'was' swarthy, both past.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-69087-2903-3",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Summoned by her, Ralph came hurriedly down from town. They meet in the wood, where part of their conversation was overheard by my sister.",
  "fixed": "Summoned by her, Ralph came hurriedly down from town. They met in the wood, where part of their conversation was overheard by my sister.",
  "targetWords": [
   "meet"
  ],
  "options": [
   "met",
   "meet",
   "will meet",
   "are meeting"
  ],
  "answer": "met",
  "hint1": "Ralph 'came' first; the meeting followed.",
  "rule": "A sequence of past events needs consistent past tense. Ralph 'came' and then they 'met', and the talk 'was overheard'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-1909-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was quite five minutes before Poirot joins me. With his usual precautions against cold, he was muffled up to the ears.",
  "fixed": "It was quite five minutes before Poirot joined me. With his usual precautions against cold, he was muffled up to the ears.",
  "targetWords": [
   "joins"
  ],
  "options": [
   "joined",
   "joins",
   "will join",
   "is joining"
  ],
  "answer": "joined",
  "hint1": "Look at the verbs in the first sentence and compare them with the second sentence.",
  "rule": "Keep verb tense consistent when events happen at the same point in the past. The sentence begins with 'was' and the next sentence uses 'was', so 'joins' should be the past tense 'joined'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-70114-173-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He stood looking down on the motionless figure with a dissatisfied frown. A puff of wind set the window-curtains flying out, and he looks up sharply.",
  "fixed": "He stood looking down on the motionless figure with a dissatisfied frown. A puff of wind set the window-curtains flying out, and he looked up sharply.",
  "targetWords": [
   "looks"
  ],
  "options": [
   "looked",
   "looks",
   "will look",
   "is looking"
  ],
  "answer": "looked",
  "hint1": "Find the verb that does not match the past-tense story around it.",
  "rule": "A narrative told in the past tense should stay in the past tense unless the time really changes. 'Stood' and 'set' are past, so 'looks' should be 'looked'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-70114-1399-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "By the next day I had, except for a slight headache, completely recovered from the effects of Poirot's gas bomb. We went down together to Chinatown and search the house from which I had been rescued.",
  "fixed": "By the next day I had, except for a slight headache, completely recovered from the effects of Poirot's gas bomb. We went down together to Chinatown and searched the house from which I had been rescued.",
  "targetWords": [
   "search"
  ],
  "options": [
   "searched",
   "search",
   "will search",
   "are searching"
  ],
  "answer": "searched",
  "hint1": "The two actions in the second sentence are joined by 'and'. Do their tenses match?",
  "rule": "Verbs joined by 'and' should share a tense when they describe past events. 'Went' is past, so 'search' should be the past tense 'searched'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-863-608-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I had the utmost difficulty in controlling my excitement. Unknown to herself, Annie provides us with an important piece of evidence.",
  "fixed": "I had the utmost difficulty in controlling my excitement. Unknown to herself, Annie had provided us with an important piece of evidence.",
  "targetWords": [
   "provides"
  ],
  "options": [
   "had provided",
   "provides",
   "will provide",
   "is providing"
  ],
  "answer": "had provided",
  "hint1": "Which verb jumps out of the past into the present?",
  "rule": "When the surrounding sentences are in the past, a completed earlier action uses the past perfect or simple past, not the present. 'Provides' clashes with 'had', so the sentence needs 'had provided'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-61262-388-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "A tall young man was striding up the drive towards us. He passes us without making any sign, but I noted that he was not ill-looking, with a lean, deeply bronzed face that spoke of life in a tropic clime.",
  "fixed": "A tall young man was striding up the drive towards us. He passed us without making any sign, but I noted that he was not ill-looking, with a lean, deeply bronzed face that spoke of life in a tropic clime.",
  "targetWords": [
   "passes"
  ],
  "options": [
   "passed",
   "passes",
   "will pass",
   "is passing"
  ],
  "answer": "passed",
  "hint1": "Compare the first verb of the second sentence with 'noted' and 'was'.",
  "rule": "A past-tense narrative needs consistent past-tense verbs. 'Noted' and 'was' are past, so 'passes' should be 'passed'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-58866-2088-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Poirot reappeared brisk and smiling at Dover, and our journey to London was uneventful. It was past nine o’clock when we arrive, and I supposed that we should return straight away to our rooms and do nothing till the morning.",
  "fixed": "Poirot reappeared brisk and smiling at Dover, and our journey to London was uneventful. It was past nine o’clock when we arrived, and I supposed that we should return straight away to our rooms and do nothing till the morning.",
  "targetWords": [
   "arrive"
  ],
  "options": [
   "arrived",
   "arrive",
   "will arrive",
   "are arriving"
  ],
  "answer": "arrived",
  "hint1": "Look at the verb in the 'when' clause.",
  "rule": "A clause beginning with 'when' must match the time of the main clause. The main clause says 'It was past nine o'clock', so 'arrive' should be 'arrived'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-72824-1845-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "He went over to the bureau and presses the hidden spring. The drawer flew open, but the hair was no longer where he had placed it.",
  "fixed": "He went over to the bureau and pressed the hidden spring. The drawer flew open, but the hair was no longer where he had placed it.",
  "targetWords": [
   "presses"
  ],
  "options": [
   "pressed",
   "presses",
   "will press",
   "is pressing"
  ],
  "answer": "pressed",
  "hint1": "Two actions are joined by 'and'. Do they match?",
  "rule": "Verbs in a sequence of past events must all be in the past tense. 'Went' is past, so 'presses' should be 'pressed'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-70114-1562-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "It was an enthralling narrative which Poirot unfolded. Familiar as I was with all the details, they thrill me anew as I heard the bald recital of our adventures and escapes.",
  "fixed": "It was an enthralling narrative which Poirot unfolded. Familiar as I was with all the details, they thrilled me anew as I heard the bald recital of our adventures and escapes.",
  "targetWords": [
   "thrill"
  ],
  "options": [
   "thrilled",
   "thrill",
   "will thrill",
   "are thrilling"
  ],
  "answer": "thrilled",
  "hint1": "Compare this verb with 'was' and 'heard' in the same sentence.",
  "rule": "Events that happen at the same time in the past use the same tense. 'Was' and 'heard' are past, so 'thrill' should be 'thrilled'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-1640-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Both M. Caux and the Examining Magistrate looked at him curiously. Mason stood uncertainly for a minute or two, and then the Magistrate gives her a brief nod of dismissal, and she went out.",
  "fixed": "Both M. Caux and the Examining Magistrate looked at him curiously. Mason stood uncertainly for a minute or two, and then the Magistrate gave her a brief nod of dismissal, and she went out.",
  "targetWords": [
   "gives"
  ],
  "options": [
   "gave",
   "gives",
   "will give",
   "is giving"
  ],
  "answer": "gave",
  "hint1": "Find the verb that is not in the past tense.",
  "rule": "Do not shift tense in the middle of a sequence of past events. 'Stood' and 'went' are past, so 'gives' should be 'gave'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-70114-1875-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Although Poirot was given at times to exaggeration of language, he was not really an alarmist. For the first time I realise what a desperate struggle it was upon which we were engaged.",
  "fixed": "Although Poirot was given at times to exaggeration of language, he was not really an alarmist. For the first time I realised what a desperate struggle it was upon which we were engaged.",
  "targetWords": [
   "realise"
  ],
  "options": [
   "realised",
   "realise",
   "will realise",
   "am realising"
  ],
  "answer": "realised",
  "hint1": "Look at the verb that opens the second sentence's main clause.",
  "rule": "Keep the same tense when the time has not changed. The surrounding verbs are past ('was', 'were engaged'), so 'realise' should be 'realised'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-863-428-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "On the chest of drawers there was a tray with a spirit lamp and a small saucepan on it. A small quantity of a dark fluid remains in the saucepan, and an empty cup and saucer that had been drunk out of stood near it.",
  "fixed": "On the chest of drawers there was a tray with a spirit lamp and a small saucepan on it. A small quantity of a dark fluid remained in the saucepan, and an empty cup and saucer that had been drunk out of stood near it.",
  "targetWords": [
   "remains"
  ],
  "options": [
   "remained",
   "remains",
   "will remain",
   "is remaining"
  ],
  "answer": "remained",
  "hint1": "Compare the verbs on either side of 'and' in the second sentence.",
  "rule": "Verbs describing one past scene must stay in the past tense. 'Stood' and 'was' are past, so 'remains' should be 'remained'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-69087-1878-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Do you realize that there ___ three separate motives staring us in the face.",
  "targetWords": [
   "motives"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "are",
  "fixed": "Do you realize that there are three separate motives staring us in the face.",
  "hint1": "In a there-sentence the subject comes after the verb, so look past the word there.",
  "rule": "The verb must agree with the real subject, which in a there-sentence follows the verb. Here the subject is the plural motives, so the verb is are.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-70114-281-7",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "It had rained the night before, and there ___ footprints clear enough going in and out of the kitchen.",
  "targetWords": [
   "footprints"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "It had rained the night before, and there were footprints clear enough going in and out of the kitchen.",
  "hint1": "The sentence begins with there, so the true subject is hidden after the verb.",
  "rule": "In a there-sentence, the verb agrees with the noun that follows it, not with there. The subject footprints is plural, so the verb is were.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-58866-786-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "I could have sworn there ___ a note of surprise and relief in her voice.",
  "targetWords": [
   "note"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "I could have sworn there was a note of surprise and relief in her voice.",
  "hint1": "The phrase of surprise and relief contains two nouns, but they are not the subject.",
  "rule": "The subject is the single noun note, and the of-phrase only describes it. A singular subject takes the singular verb was, even with surprise and relief nearby.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "agree-69087-3084-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Such scraps as came to him ___ fragments of dictation, and so his subconscious mind deduced that you were with him.",
  "targetWords": [
   "scraps"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "were",
  "fixed": "Such scraps as came to him were fragments of dictation, and so his subconscious mind deduced that you were with him.",
  "hint1": "The word him sits right before the blank, but it is not the subject.",
  "rule": "The verb agrees with its subject, not with the nearest noun or pronoun. The subject is the plural scraps, so the verb is were.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-69087-112-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Such ___ been our preoccupations in King’s Abbot for the last few years.",
  "targetWords": [
   "preoccupations"
  ],
  "options": [
   "has",
   "have"
  ],
  "answer": "have",
  "fixed": "Such have been our preoccupations in King’s Abbot for the last few years.",
  "hint1": "The sentence is inverted, so the subject comes at the end.",
  "rule": "When a sentence is inverted, find the subject by rearranging it: our preoccupations have been such. The plural subject preoccupations takes have.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "agree-61262-781-4",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "There ___ no clue in it to her identity, or as to her whereabouts.",
  "targetWords": [
   "clue"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "There was no clue in it to her identity, or as to her whereabouts.",
  "hint1": "The plural noun whereabouts comes late in the sentence, but it is not the subject.",
  "rule": "In a there-sentence, the verb agrees with the real subject after it. The subject is the singular clue, so the verb is was, no matter how many nouns follow.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-61262-768-2",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "When he was a boy at Oxford there ___ some funny business about the signature on one of his father’s cheques.",
  "targetWords": [
   "business"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "When he was a boy at Oxford there was some funny business about the signature on one of his father’s cheques.",
  "hint1": "The sentence is inverted with 'there', and plural nouns sit near the blank.",
  "rule": "With 'there is/was', the verb agrees with the noun that follows it. The subject is the singular 'business', not 'cheques' or 'signature', so the verb is 'was'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "agree-70114-237-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "Poirot ___ following Mr. Ingles's words with the closest attention.",
  "targetWords": [
   "poirot"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "Poirot was following Mr. Ingles's words with the closest attention.",
  "hint1": "A plural noun, 'words', appears right after the verb.",
  "rule": "The verb agrees with its subject, not with a noun that follows it. The subject is the single person 'Poirot', so the verb is 'was'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "agree-863-2139-0",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "The murder, he said, ___ a most premeditated and cold-blooded one.",
  "targetWords": [
   "murder"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "The murder, he said, was a most premeditated and cold-blooded one.",
  "hint1": "An interrupting phrase and a later noun may distract you from the subject.",
  "rule": "Ignore interrupters like 'he said' when matching a verb to its subject. The subject is the singular 'murder', so the verb is 'was'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-863-2422-5",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "That idea of yours about the bromides ___ a stroke of genius!",
  "targetWords": [
   "idea"
  ],
  "options": [
   "was",
   "were"
  ],
  "answer": "was",
  "fixed": "That idea of yours about the bromides was a stroke of genius!",
  "hint1": "Plural nouns inside the phrases after the subject sit close to the blank.",
  "rule": "Words inside 'of' and 'about' phrases are not the subject. The subject is the singular 'idea', so the verb is 'was'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "agree-69087-2161-1",
  "type": "tapfix",
  "skill": "agreement",
  "title": "Find the real subject",
  "prompt1": "Step 1: Tap the subject, the word that the missing verb has to agree with.",
  "prompt2": "Step 2: Which verb fits?",
  "text": "For some five minutes there was complete silence, owing to the fact that there ___ tremendous secret competition amongst us as to who can build their wall quickest.",
  "targetWords": [
   "competition"
  ],
  "options": [
   "is",
   "are"
  ],
  "answer": "is",
  "fixed": "For some five minutes there was complete silence, owing to the fact that there is tremendous secret competition amongst us as to who can build their wall quickest.",
  "hint1": "The sentence starts with 'there', so the subject comes after the verb.",
  "rule": "After 'there', find the noun that follows the verb. 'Competition' is singular, and 'us' is not the subject, so the verb is 'is'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-1592-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "But it were also clear that she had no intention of telling me anything further. Whatever the mystery centering around ursula Bourne might be, I was not going to learn it through Mrs. Folliott.",
  "fixed": "But it was also clear that she had no intention of telling me anything further. Whatever the mystery centering around Ursula Bourne might be, I was not going to learn it through Mrs. Folliott.",
  "errors": [
   {
    "word": "were"
   },
   {
    "word": "ursula"
   }
  ],
  "rule": "The subject 'it' is singular, so the verb is 'was', not 'were'. 'Ursula' is a name, so it needs a capital letter.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-284-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "On inquiry at the Three Boars I found that Captain Paton have just come in.",
  "fixed": "On inquiry at the Three Boars I found that Captain Paton had just come in.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject 'Captain Paton' is one person and the story is in the past, so the verb is 'had', not 'have'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  },
  "optionalGaps": [
   "boars"
  ]
 },
 {
  "id": "forge-70114-127-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A short walk brought us to a garage where we were able to obtain a car, and half an hour later we are spinning rapidly back to London.",
  "fixed": "A short walk brought us to a garage where we were able to obtain a car, and half an hour later we were spinning rapidly back to London.",
  "errors": [
   {
    "word": "are"
   }
  ],
  "rule": "The rest of the sentence is in the past ('were able'), so 'are' should be 'were'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "later"
  ]
 },
 {
  "id": "forge-69087-1039-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Now he moved aside suddenly, and I saw that while my back was turned he must have swiftly drawn out the arm-chair till it stands in the position Parker had indicated.",
  "fixed": "Now he moved aside suddenly, and I saw that while my back was turned he must have swiftly drawn out the arm-chair till it stood in the position Parker had indicated.",
  "errors": [
   {
    "word": "stands"
   }
  ],
  "rule": "The story is in the past ('moved', 'had indicated'), so 'stands' should be 'stood'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  },
  "optionalGaps": [
   "now",
   "turned"
  ]
 },
 {
  "id": "forge-72824-1200-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Left alone, katherine gave herself up to thought.",
  "fixed": "Left alone, Katherine gave herself up to thought.",
  "errors": [
   {
    "word": "katherine"
   }
  ],
  "rule": "'Katherine' is a name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-903-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She disliked the cold and is glad to reach the shelter of the private cabin she had telegraphed for.",
  "fixed": "She disliked the cold and was glad to reach the shelter of the private cabin she had telegraphed for.",
  "errors": [
   {
    "word": "is"
   }
  ],
  "rule": "The verbs 'disliked' and 'had telegraphed' are in the past, so 'is glad' should be 'was glad'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-654-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The doctor, read and uttered an exclamation of utter astonishment.",
  "fixed": "The doctor read and uttered an exclamation of utter astonishment.",
  "errors": [
   {
    "gapAfter": "doctor"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'doctor, read' should be 'doctor read'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-72824-3004-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "When the car had finally driven off, Katherine goes slowly upstairs.",
  "fixed": "When the car had finally driven off, Katherine went slowly upstairs.",
  "errors": [
   {
    "word": "goes"
   }
  ],
  "rule": "The other verb, \"had finally driven\", is in the past, so \"goes\" should be \"went\".",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-863-431-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A reading-lamp, some books, matches, a bunch of keys, and the crushed fragments of a coffee-cup lies scattered about.",
  "fixed": "A reading-lamp, some books, matches, a bunch of keys, and the crushed fragments of a coffee-cup lay scattered about.",
  "errors": [
   {
    "word": "lies"
   }
  ],
  "rule": "The subject is the whole list of objects, which is plural, and the story is in the past, so 'lies' should be 'lay'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-1272-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Few people, would have noticed anything amiss in his greeting to Mr. goby.",
  "fixed": "Few people would have noticed anything amiss in his greeting to Mr. Goby.",
  "errors": [
   {
    "gapAfter": "people"
   },
   {
    "word": "goby"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'people, would' should be 'people would'. 'Goby' is a name, so it needs a capital letter.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-1507-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She answered our questions readily enough and shows much distress and concern at the loss of the money.",
  "fixed": "She answered our questions readily enough and showed much distress and concern at the loss of the money.",
  "errors": [
   {
    "word": "shows"
   }
  ],
  "rule": "The other verb, 'answered', is in the past, so 'shows' should be 'showed'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-805-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They seize ryland and the valet and disarmed them.",
  "fixed": "They seized Ryland and the valet and disarmed them.",
  "errors": [
   {
    "word": "seize"
   },
   {
    "word": "ryland"
   }
  ],
  "rule": "The sentence is in the past ('disarmed'), so 'seize' should be 'seized'. 'Ryland' is a name, so it needs a capital letter.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-72824-1221-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Rufus Van Aldin was in his suite at the Savoy and were making the most of the atmospheric conditions by working double time.",
  "fixed": "Rufus Van Aldin was in his suite at the Savoy and was making the most of the atmospheric conditions by working double time.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'Rufus Van Aldin' is one person, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-863-387-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "We hurry up the village and turned in at the lodge gates. Poirot, stopped for a moment and gazed sorrowfully over the beautiful expanse of park, still glittering with morning dew.",
  "fixed": "We hurried up the village and turned in at the lodge gates. Poirot stopped for a moment and gazed sorrowfully over the beautiful expanse of park, still glittering with morning dew.",
  "errors": [
   {
    "word": "hurry"
   },
   {
    "gapAfter": "poirot"
   }
  ],
  "rule": "The story is in the past ('turned in'), so 'hurry' should be 'hurried'. Do not put a comma between a subject and its verb, so 'Poirot, stopped' should be 'Poirot stopped'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-333-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She unwrapped it eagerly and snap open the case.",
  "fixed": "She unwrapped it eagerly and snapped open the case.",
  "errors": [
   {
    "word": "snap"
   }
  ],
  "rule": "The other verb, 'unwrapped', is in the past, so 'snap' should be 'snapped'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-70114-1879-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Our rooms has been reserved for us, and under Harvey's guidance we went straight up to them. They look straight out over the rocky peaks and the long slopes of pine woods leading up to them.",
  "fixed": "Our rooms had been reserved for us, and under Harvey's guidance we went straight up to them. They looked straight out over the rocky peaks and the long slopes of pine woods leading up to them.",
  "errors": [
   {
    "word": "has"
   },
   {
    "word": "look"
   }
  ],
  "rule": "The subject 'rooms' is plural and the story is in the past, so 'has been reserved' should be 'had been reserved'. The story stays in the past, so 'look' should be 'looked'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "guidance"
  ]
 },
 {
  "id": "forge-58866-715-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She never refer to the past, nor to her husband.",
  "fixed": "She never refers to the past, nor to her husband.",
  "errors": [
   {
    "word": "refer"
   }
  ],
  "rule": "The subject 'She' is singular, so the verb is 'refers', not 'refer'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-2185-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It were Caroline who brought the colonel’s story to a close by fortunately going Mah Jong.",
  "fixed": "It was Caroline who brought the colonel’s story to a close by fortunately going Mah Jong.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'It' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-72824-727-6",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She have retained her title when she married for a fourth time.",
  "fixed": "She had retained her title when she married for a fourth time.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject 'She' is singular and the story is in the past, so 'have retained' should be 'had retained'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-533-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Parker and I advanced till we stand over the recumbent figure.",
  "fixed": "Parker and I advanced till we stood over the recumbent figure.",
  "errors": [
   {
    "word": "stand"
   }
  ],
  "rule": "The story is in the past ('advanced'), so 'stand' should be 'stood'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-69087-2289-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "On arrival at The Larches, we are informed that Parker was already there awaiting our return.",
  "fixed": "On arrival at The Larches, we were informed that Parker was already there awaiting our return.",
  "errors": [
   {
    "word": "are"
   }
  ],
  "rule": "The rest of the sentence is in the past ('was already there'), so 'are informed' should be 'were informed'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  },
  "optionalGaps": [
   "there"
  ]
 },
 {
  "id": "forge-69087-2906-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "A little over half an hour later came the discovery of roger Ackroyd’s body. Since that night Ursula, had neither seen nor heard from Ralph.",
  "fixed": "A little over half an hour later came the discovery of Roger Ackroyd’s body. Since that night Ursula had neither seen nor heard from Ralph.",
  "errors": [
   {
    "word": "roger"
   },
   {
    "gapAfter": "ursula"
   }
  ],
  "rule": "'Roger' is a name, so it needs a capital letter. Do not put a comma between a subject and its verb, so 'Ursula, had' should be 'Ursula had'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  },
  "optionalGaps": [
   "night"
  ]
 },
 {
  "id": "forge-72824-156-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The man who gives his name as M. le Marquis had shielded his face with his hand as he spoke.",
  "fixed": "The man who gave his name as M. le Marquis had shielded his face with his hand as he spoke.",
  "errors": [
   {
    "word": "gives"
   }
  ],
  "rule": "The story is in the past ('had shielded', 'spoke'), so 'gives' should be 'gave'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-58866-598-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot went close to the bed and studies it attentively.",
  "fixed": "Poirot went close to the bed and studied it attentively.",
  "errors": [
   {
    "word": "studies"
   }
  ],
  "rule": "The sentence is in the past ('went'), so 'studies' should be 'studied'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-58866-2262-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot have displayed his intentions only too plainly. I doubted more than ever my powers of saving bella from the consequences of her act.",
  "fixed": "Poirot had displayed his intentions only too plainly. I doubted more than ever my powers of saving Bella from the consequences of her act.",
  "errors": [
   {
    "word": "have"
   },
   {
    "word": "bella"
   }
  ],
  "rule": "The subject 'Poirot' is singular and the story is in the past, so 'have displayed' should be 'had displayed'. 'Bella' is a name, so it needs a capital letter.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-70114-328-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The Inspector come bustling in, apologising for having been so long away. He insists on taking us over most of the ground again, but finally we got away.",
  "fixed": "The Inspector came bustling in, apologising for having been so long away. He insisted on taking us over most of the ground again, but finally we got away.",
  "errors": [
   {
    "word": "come"
   },
   {
    "word": "insists"
   }
  ],
  "rule": "The subject 'Inspector' is singular and the story is in the past, so 'come' should be 'came'. The word 'got' shows the story is in the past, so 'insists' should be 'insisted'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "finally"
  ]
 },
 {
  "id": "forge-863-912-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Therefore, he takes the risk, the great risk, of coming in here. Finding the case locked, he were obliged to force it, thus betraying his presence.",
  "fixed": "Therefore, he took the risk, the great risk, of coming in here. Finding the case locked, he was obliged to force it, thus betraying his presence.",
  "errors": [
   {
    "word": "takes"
   },
   {
    "word": "were"
   }
  ],
  "rule": "The story is in the past, so 'takes' should be 'took'. The subject 'he' is one person, so 'were obliged' should be 'was obliged'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-58866-1284-3",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I felt convinced that she know, if not the assassins, at least the motive for the assassination.",
  "fixed": "I felt convinced that she knew, if not the assassins, at least the motive for the assassination.",
  "errors": [
   {
    "word": "know"
   }
  ],
  "rule": "The subject 'she' is singular and the story is in the past, so the verb is 'knew', not 'know'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-1043-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I don’t even remember that it were in that position, but it must have been if you say so.",
  "fixed": "I don’t even remember that it was in that position, but it must have been if you say so.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'it' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-1947-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "My reflections was cut short by the countess's voice.",
  "fixed": "My reflections were cut short by the countess's voice.",
  "errors": [
   {
    "word": "was"
   }
  ],
  "rule": "The subject 'reflections' is plural, so the verb is 'were', not 'was'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "tense-72824-1025-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "In somewhat British fashion, she felt annoyed. This foreign official seems to her impertinent.",
  "fixed": "In somewhat British fashion, she felt annoyed. This foreign official seemed to her impertinent.",
  "targetWords": [
   "seems"
  ],
  "options": [
   "seemed",
   "seems",
   "will seem",
   "has seemed"
  ],
  "answer": "seemed",
  "hint1": "Check the tense of the first sentence.",
  "rule": "Keep verb tense consistent when the events happen at the same time. The first sentence is past ('felt'), so 'seemed' is needed.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-58866-1483-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "Waiting for no more, I turned and ran up the path to the shed. The two men on guard there stand aside to let me pass and, filled with excitement, I entered.",
  "fixed": "Waiting for no more, I turned and ran up the path to the shed. The two men on guard there stood aside to let me pass and, filled with excitement, I entered.",
  "targetWords": [
   "stand"
  ],
  "options": [
   "stood",
   "stand",
   "will stand",
   "are standing"
  ],
  "answer": "stood",
  "hint1": "The surrounding verbs 'turned', 'ran' and 'entered' tell you the time.",
  "rule": "A narrative told in the past should stay in the past unless the time truly changes. Here 'turned', 'ran' and 'entered' are past, so 'stood' is correct.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-58866-1920-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I was so flattered by the little man’s approval that I could hardly continue. But at last I collect my thoughts and went on.",
  "fixed": "I was so flattered by the little man’s approval that I could hardly continue. But at last I collected my thoughts and went on.",
  "targetWords": [
   "collect"
  ],
  "options": [
   "collected",
   "collect",
   "will collect",
   "am collecting"
  ],
  "answer": "collected",
  "hint1": "Look at the verb joined to it by 'and'.",
  "rule": "Verbs joined by 'and' should share a tense when the actions are in the same time frame. 'Went on' is past, so 'collected' is correct.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "tense-61262-728-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "And on his rather ill-timed jest I went on to the house. I ring the bell, as Japp had closed the door behind him.",
  "fixed": "And on his rather ill-timed jest I went on to the house. I rang the bell, as Japp had closed the door behind him.",
  "targetWords": [
   "ring"
  ],
  "options": [
   "rang",
   "ring",
   "will ring",
   "am ringing"
  ],
  "answer": "rang",
  "hint1": "The previous sentence tells you when this happened.",
  "rule": "Stay in one tense when the narration stays in the same time. The previous sentence uses 'went', so the next action should be 'rang'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "tense-863-1790-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "We had walked, as we talked, and now we passed through the little gate into the garden. Voices rise near at hand, for tea was spread out under the sycamore-tree, as it had been on the day of my arrival.",
  "fixed": "We had walked, as we talked, and now we passed through the little gate into the garden. Voices rose near at hand, for tea was spread out under the sycamore-tree, as it had been on the day of my arrival.",
  "targetWords": [
   "rise"
  ],
  "options": [
   "rose",
   "rise",
   "will rise",
   "are rising"
  ],
  "answer": "rose",
  "hint1": "Compare the verb with 'passed' and 'was spread'.",
  "rule": "Tense should stay consistent within a past-time passage. 'Passed' and 'was spread' are past, so the voices 'rose'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "tense-72824-468-1",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "At two o'clock he was pacing the floor of his room waiting expectantly for Goby. The latter is ushered in at ten minutes past two.",
  "fixed": "At two o'clock he was pacing the floor of his room waiting expectantly for Goby. The latter was ushered in at ten minutes past two.",
  "targetWords": [
   "is"
  ],
  "options": [
   "was",
   "is",
   "will be",
   "has been"
  ],
  "answer": "was",
  "hint1": "The time given is a specific past moment, and the first sentence is past.",
  "rule": "Do not shift to the present for an event that happened at a stated past time. The first sentence uses 'was pacing', so the second needs 'was ushered'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "tense-69087-135-0",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "I had dismissed the last of them, as I thought, and was just contemplating a few minutes in the garden before lunch when I perceived one more patient waiting for me. She rises and came towards me as I stood somewhat surprised.",
  "fixed": "I had dismissed the last of them, as I thought, and was just contemplating a few minutes in the garden before lunch when I perceived one more patient waiting for me. She rose and came towards me as I stood somewhat surprised.",
  "targetWords": [
   "rises"
  ],
  "options": [
   "rose",
   "rises",
   "will rise",
   "has risen"
  ],
  "answer": "rose",
  "hint1": "Look at the other verb in the same compound predicate.",
  "rule": "Verbs in a compound predicate should match tense when the actions are connected. 'Came' is past, so the first verb should be 'rose'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "tense-70114-1739-4",
  "type": "tapfix",
  "skill": "tense",
  "title": "Spot the odd verb out",
  "prompt1": "Step 1: One verb is in the wrong tense. Tap it.",
  "prompt2": "Step 2: Pick the verb form that fixes the passage.",
  "text": "They were both from actors who had played with Claud Darrell at one time or another. Neither of them know him at all intimately, and no new light was thrown upon the problem of his identity and present whereabouts.",
  "fixed": "They were both from actors who had played with Claud Darrell at one time or another. Neither of them knew him at all intimately, and no new light was thrown upon the problem of his identity and present whereabouts.",
  "targetWords": [
   "know"
  ],
  "options": [
   "knew",
   "know",
   "will know",
   "has known"
  ],
  "answer": "knew",
  "hint1": "Check the tense of the second half of the sentence.",
  "rule": "Both halves of a sentence about past events should use past tense. 'Was thrown' is past, so 'knew' is correct.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-58866-2510-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I could not at all ___ the point of this question which I well knew to be meaningless as far as Poirot was concerned.",
  "options": [
   "fathom",
   "anticipate",
   "explain",
   "dispute"
  ],
  "answer": "fathom",
  "definitions": {
   "fathom": "to understand after thinking hard",
   "anticipate": "to expect and prepare for",
   "explain": "to make something clear to others",
   "dispute": "to argue against or question"
  },
  "fixed": "I could not at all fathom the point of this question which I well knew to be meaningless as far as Poirot was concerned.",
  "rule": "The speaker thinks the question is meaningless, so he cannot make sense of its point. Only 'fathom' (understand) fits that idea.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1773-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Keeping a ___ distance behind our quarry, we followed him through the streets of Merlinville.",
  "options": [
   "discreet",
   "respectful",
   "considerable",
   "measured"
  ],
  "answer": "discreet",
  "definitions": {
   "discreet": "careful not to attract attention",
   "respectful": "showing regard for others' feelings",
   "considerable": "fairly large in size or amount",
   "measured": "carefully limited in amount or pace"
  },
  "fixed": "Keeping a discreet distance behind our quarry, we followed him through the streets of Merlinville.",
  "rule": "People trailing a quarry (someone being hunted) keep back so they are not noticed. 'Discreet' means careful and unobtrusive.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-89-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The doctor immediately snorted with ___.",
  "options": [
   "contempt",
   "impatience",
   "disbelief",
   "indignation"
  ],
  "answer": "contempt",
  "definitions": {
   "contempt": "scorn; feeling that something is worthless",
   "impatience": "inability to wait calmly",
   "disbelief": "refusal to accept something as true",
   "indignation": "anger at unfair treatment"
  },
  "fixed": "The doctor immediately snorted with contempt.",
  "rule": "A snort is a scornful sound, so the feeling behind it is contempt: scorn for something thought worthless.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-70114-1584-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "There was a minute or two's pause, and then my little friend rose to his feet, with an air of dignity that sat rather oddly upon his ___ personality.",
  "options": [
   "quaint",
   "unassuming",
   "fastidious",
   "flamboyant"
  ],
  "answer": "quaint",
  "definitions": {
   "quaint": "charmingly odd or old-fashioned",
   "unassuming": "modest and not seeking attention",
   "fastidious": "hard to please and very exacting",
   "flamboyant": "showy and bold in manner"
  },
  "fixed": "There was a minute or two's pause, and then my little friend rose to his feet, with an air of dignity that sat rather oddly upon his quaint personality.",
  "rule": "Dignity 'sat oddly' on his personality, so the personality must be the opposite of grand: quaint, or charmingly odd.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-69087-811-4",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "But when she spoke her manner was as composed and ___ as possible.",
  "options": [
   "resolute",
   "dignified",
   "restrained",
   "detached"
  ],
  "answer": "resolute",
  "definitions": {
   "resolute": "firm and determined",
   "dignified": "showing calm, serious self-respect",
   "restrained": "held in check; not showing strong emotion",
   "detached": "emotionally distant and uninvolved"
  },
  "fixed": "But when she spoke her manner was as composed and resolute as possible.",
  "rule": "The word pairs with 'composed' and the 'But' signals a calm, firm manner.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-69087-2113-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He was quite ___ as he stood there politely waiting on Poirot’s orders.",
  "options": [
   "imperturbable",
   "deferential",
   "attentive",
   "obsequious"
  ],
  "answer": "imperturbable",
  "definitions": {
   "imperturbable": "calm and not easily upset",
   "deferential": "showing polite respect for another's wishes",
   "attentive": "paying close attention",
   "obsequious": "overly eager to please"
  },
  "fixed": "He was quite imperturbable as he stood there politely waiting on Poirot’s orders.",
  "rule": "Someone who stands politely waiting is calm and steady. 'Imperturbable' means not easily upset.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-72824-660-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She spoke in a detached, ___ tone, as though she were looking at the situation from outside.",
  "options": [
   "impersonal",
   "analytical",
   "brisk",
   "wistful"
  ],
  "answer": "impersonal",
  "definitions": {
   "impersonal": "not showing personal feeling",
   "analytical": "examining things closely and logically",
   "brisk": "quick and efficient",
   "wistful": "sadly longing for something"
  },
  "fixed": "She spoke in a detached, impersonal tone, as though she were looking at the situation from outside.",
  "rule": "'Detached' and 'looking at the situation from outside' show she is not emotionally involved. 'Impersonal' fits.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-324-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Dr. Wilkins was looking important and excited, and trying to conceal an inward ___ under a manner of decorous calm.",
  "options": [
   "exultation",
   "relief",
   "apprehension",
   "amusement"
  ],
  "answer": "exultation",
  "definitions": {
   "exultation": "great joy and triumph",
   "relief": "ease after worry or pain ends",
   "apprehension": "anxious fear of what may happen",
   "amusement": "the feeling of finding something funny"
  },
  "fixed": "Dr. Wilkins was looking important and excited, and trying to conceal an inward exultation under a manner of decorous calm.",
  "rule": "He looks 'important and excited' but hides it under calm. The hidden feeling is exultation, or triumphant joy.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-99-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "This in turn he unwrapped, ___ the contents, and quickly wrapped it up once more.",
  "options": [
   "verified",
   "glimpsed",
   "emptied",
   "sniffed"
  ],
  "answer": "verified",
  "definitions": {
   "verified": "checked to be sure it is correct",
   "glimpsed": "saw briefly or in passing",
   "emptied": "poured out what was inside",
   "sniffed": "breathed in to detect a smell"
  },
  "fixed": "This in turn he unwrapped, verified the contents, and quickly wrapped it up once more.",
  "rule": "He unwraps a parcel and wraps it up again, so in between he examines what is inside. 'Verified' means checked.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-61262-247-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Events proved my ___ to be justified.",
  "options": [
   "forebodings",
   "doubts",
   "theories",
   "criticisms"
  ],
  "answer": "forebodings",
  "definitions": {
   "forebodings": "feelings that something bad is going to happen",
   "doubts": "feelings of uncertainty about something",
   "theories": "ideas offered to explain something",
   "criticisms": "statements pointing out faults"
  },
  "fixed": "Events proved my forebodings to be justified.",
  "rule": "The speaker says events proved the ___ 'justified,' so they must be worries about the future that later came true. Only forebodings (fears of coming trouble) can be proved right by events.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-58866-1912-8",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "And suddenly I started as an idea of bewildering ___ shot into my brain.",
  "options": [
   "luminosity",
   "complexity",
   "audacity",
   "magnitude"
  ],
  "answer": "luminosity",
  "definitions": {
   "luminosity": "brilliant brightness",
   "complexity": "the state of having many parts",
   "audacity": "bold willingness to take risks",
   "magnitude": "great size or importance"
  },
  "fixed": "And suddenly I started as an idea of bewildering luminosity shot into my brain.",
  "rule": "An idea that 'shot into' the brain and made the speaker start is a sudden flash, so a word about brightness fits.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-1670-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "His request was instantly acceded to, and I accompanied him upstairs, where he ___ on the bed, groaning heavily.",
  "options": [
   "collapsed",
   "writhed",
   "huddled",
   "reclined"
  ],
  "answer": "collapsed",
  "definitions": {
   "collapsed": "fell down suddenly from weakness",
   "writhed": "twisted the body about in pain",
   "huddled": "curled up tightly, as from cold or fear",
   "reclined": "lay back in a relaxed way"
  },
  "fixed": "His request was instantly acceded to, and I accompanied him upstairs, where he collapsed on the bed, groaning heavily.",
  "rule": "The man 'groaning heavily' on a bed shows weakness, so he fell down onto it. Collapsed fits; hovering over a bed or marching on it makes no sense for someone groaning.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-61262-1051-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Poirot remained placidly ___, blinking a little out of his green cat’s eyes.",
  "options": [
   "immovable",
   "inscrutable",
   "amused",
   "attentive"
  ],
  "answer": "immovable",
  "definitions": {
   "immovable": "not moving or changing; unshaken",
   "inscrutable": "impossible to read or understand",
   "amused": "finding something funny",
   "attentive": "paying close attention"
  },
  "fixed": "Poirot remained placidly immovable, blinking a little out of his green cat’s eyes.",
  "rule": "The adverb 'placidly' means calmly, and the only action is a little blinking, so Poirot stays still.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "vocab-69087-2707-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "If she felt any inward agitation, it did not display itself in any outward ___.",
  "options": [
   "manifestation",
   "disturbance",
   "eruption",
   "exertion"
  ],
  "answer": "manifestation",
  "definitions": {
   "manifestation": "a visible sign of something",
   "disturbance": "an interruption of peace or order",
   "eruption": "a sudden violent outburst",
   "exertion": "the use of physical or mental effort"
  },
  "fixed": "If she felt any inward agitation, it did not display itself in any outward manifestation.",
  "rule": "The sentence contrasts 'inward' agitation with something 'outward' that would 'display' it. A manifestation is a visible sign of a hidden feeling.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "vocab-58866-1363-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I saw very little difference between the two words, but I ___ my theme with a good deal of earnestness.",
  "options": [
   "developed",
   "defended",
   "emphasized",
   "pursued"
  ],
  "answer": "developed",
  "definitions": {
   "developed": "explained and expanded in detail",
   "defended": "argued in support of",
   "emphasized": "gave special importance to",
   "pursued": "followed in order to achieve"
  },
  "fixed": "I saw very little difference between the two words, but I developed my theme with a good deal of earnestness.",
  "rule": "The speaker pursued the theme 'with a good deal of earnestness,' meaning seriously and with effort. Only developed, meaning built up the idea at length, fits that eager effort.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-2531-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "A small table impeded her free passage and she flung it from her into a corner, where it ___ against the wall.",
  "options": [
   "splintered",
   "rebounded",
   "clattered",
   "crumpled"
  ],
  "answer": "splintered",
  "definitions": {
   "splintered": "broke into sharp pieces",
   "rebounded": "bounced back after hitting something",
   "clattered": "made a noisy, rattling sound",
   "crumpled": "crushed into wrinkles or folds"
  },
  "fixed": "A small table impeded her free passage and she flung it from her into a corner, where it splintered against the wall.",
  "rule": "A table flung hard 'against the wall' would hit with force and break. Splintered means shattered into sharp pieces; a table cannot evaporate, blossom, or trickle.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-70114-1972-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "The countess came over to us and ___ my companion attentively for some time.",
  "options": [
   "surveyed",
   "questioned",
   "addressed",
   "flattered"
  ],
  "answer": "surveyed",
  "definitions": {
   "surveyed": "looked over carefully",
   "questioned": "asked questions of in order to learn",
   "addressed": "spoke directly to",
   "flattered": "praised excessively, often insincerely"
  },
  "fixed": "The countess came over to us and surveyed my companion attentively for some time.",
  "rule": "The adverb 'attentively' and the phrase 'for some time' show she was paying close attention to him.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-58866-2185-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "She would know the risk she ran of a message being ___ by Poirot, thus setting him on her track once more.",
  "options": [
   "intercepted",
   "deciphered",
   "monitored",
   "overheard"
  ],
  "answer": "intercepted",
  "definitions": {
   "intercepted": "stopped and seized on the way to its destination",
   "deciphered": "worked out the meaning of a code",
   "monitored": "watched and checked over a period",
   "overheard": "heard by chance without being noticed"
  },
  "fixed": "She would know the risk she ran of a message being intercepted by Poirot, thus setting him on her track once more.",
  "rule": "The message is a risk because Poirot could catch it before it reaches its target, and that would set him on her track. Only intercepted means caught in transit.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-1490-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "His face was terribly ___, and on his left side, just over the heart, the hilt of a dagger stood up, black and shining.",
  "options": [
   "convulsed",
   "swollen",
   "livid",
   "drawn"
  ],
  "answer": "convulsed",
  "definitions": {
   "convulsed": "twisted and contorted by violent spasms",
   "swollen": "puffed up, as from injury",
   "livid": "bluish-gray in color, as from bruising",
   "drawn": "looking tired and strained"
  },
  "fixed": "His face was terribly convulsed, and on his left side, just over the heart, the hilt of a dagger stood up, black and shining.",
  "rule": "A dagger sticking out over his heart signals violent agony, and the word terribly signals distress. Convulsed fits; calm or happy faces would not be called terribly so.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-58866-2535-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Cinderella’s voice, calm and ___, came from the window:",
  "options": [
   "dispassionate",
   "assured",
   "reassuring",
   "mellifluous"
  ],
  "answer": "dispassionate",
  "definitions": {
   "dispassionate": "free from strong emotion, objective",
   "assured": "confident and sure of oneself",
   "reassuring": "making someone feel less worried",
   "mellifluous": "sweet and smooth to the ear"
  },
  "fixed": "Cinderella’s voice, calm and dispassionate, came from the window:",
  "rule": "The word calm sets up a similar quality, so the blank must also mean emotionally even.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-72824-2949-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Me, I prosecute my inquiries with the utmost ___.",
  "options": [
   "diligence",
   "discretion",
   "urgency",
   "impartiality"
  ],
  "answer": "diligence",
  "definitions": {
   "diligence": "careful, steady effort",
   "discretion": "tact in keeping private matters private",
   "urgency": "the need for quick action",
   "impartiality": "fairness in not favoring either side"
  },
  "fixed": "Me, I prosecute my inquiries with the utmost diligence.",
  "rule": "Pursuing inquiries with the utmost of a quality praises the effort made. Only diligence is a positive, hard-working trait; the others describe poor effort.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "vocab-863-2282-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Cross-examined, they admitted that it might be the prisoner’s hand-writing cleverly ___.",
  "options": [
   "counterfeited",
   "altered",
   "disguised",
   "concealed"
  ],
  "answer": "counterfeited",
  "definitions": {
   "counterfeited": "copied in order to deceive; forged",
   "altered": "changed in some way",
   "disguised": "made to look different to hide identity",
   "concealed": "hidden from view"
  },
  "fixed": "Cross-examined, they admitted that it might be the prisoner’s hand-writing cleverly counterfeited.",
  "rule": "The witnesses doubt it is his handwriting, yet it might be his if cleverly faked. Counterfeited means forged to look genuine, which is the only meaning that fits.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-58866-1683-2",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He declared that he had indeed struck the fatal blow at Madame Beroldy’s ___.",
  "options": [
   "instigation",
   "residence",
   "convenience",
   "mercy"
  ],
  "answer": "instigation",
  "definitions": {
   "instigation": "urging or prompting someone to act",
   "residence": "the place where someone lives",
   "convenience": "a time or arrangement that suits one",
   "mercy": "kindness shown in sparing someone punishment"
  },
  "fixed": "He declared that he had indeed struck the fatal blow at Madame Beroldy’s instigation.",
  "rule": "He is explaining why he struck the fatal blow at her prompting, as a confession would.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "vocab-70114-106-3",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "He spoke in a clear, high voice, and something in his ___ made me feel that he was quoting from some written report or lecture.",
  "options": [
   "enunciation",
   "syntax",
   "vocabulary",
   "demeanor"
  ],
  "answer": "enunciation",
  "definitions": {
   "enunciation": "the way words are pronounced and spoken",
   "syntax": "the arrangement of words in sentences",
   "vocabulary": "the range of words someone knows or uses",
   "demeanor": "a person's outward manner and behavior"
  },
  "fixed": "He spoke in a clear, high voice, and something in his enunciation made me feel that he was quoting from some written report or lecture.",
  "rule": "The sentence is about how he spoke, with a clear voice, and the impression of quoting a report. Only enunciation, the manner of speaking, ties to that.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "vocab-863-429-0",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "I wondered how I could have been so ___ as to overlook this.",
  "options": [
   "unobservant",
   "forgetful",
   "gullible",
   "naive"
  ],
  "answer": "unobservant",
  "definitions": {
   "unobservant": "not noticing things",
   "forgetful": "likely to lose track of things",
   "gullible": "easily fooled or tricked",
   "naive": "too trusting and lacking experience"
  },
  "fixed": "I wondered how I could have been so unobservant as to overlook this.",
  "rule": "He overlooked something, so he must have failed to notice. The other options all describe careful attention, which would not lead to overlooking a clue.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-863-2142-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "It would be for the jury to decide whether or not these damning facts ___ an overwhelming proof of the prisoner’s guilt.",
  "options": [
   "constituted",
   "furnished",
   "yielded",
   "implied"
  ],
  "answer": "constituted",
  "definitions": {
   "constituted": "made up; amounted to",
   "furnished": "supplied or provided",
   "yielded": "produced as a result",
   "implied": "suggested without stating directly"
  },
  "fixed": "It would be for the jury to decide whether or not these damning facts constituted an overwhelming proof of the prisoner’s guilt.",
  "rule": "The facts are called damning and the question is whether they amount to proof of guilt, so the verb must mean 'amounted to.' Contradicting, postponing, or concealing proof would not fit.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "vocab-72824-3282-1",
  "type": "vocab",
  "skill": "vocab",
  "title": "Word in context",
  "prompt": "Which choice completes the text with the most logical and precise word?",
  "stem": "Les femmes, they look so much alike nowadays that one ___ them more by their clothing than by their faces.",
  "options": [
   "identifies",
   "judges",
   "remembers",
   "describes"
  ],
  "answer": "identifies",
  "definitions": {
   "identifies": "recognizes who someone is",
   "judges": "forms an opinion about",
   "remembers": "keeps in mind from the past",
   "describes": "tells what something is like"
  },
  "fixed": "Les femmes, they look so much alike nowadays that one identifies them more by their clothing than by their faces.",
  "rule": "The clue is 'more by their clothing than by their faces,' which describes how one tells the women apart, so the verb means 'recognizes.' The other verbs do not fit that comparison.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-1529-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Then, with a slow, unwilling jerk, the train, drew out of the station.",
  "fixed": "Then, with a slow, unwilling jerk, the train drew out of the station.",
  "errors": [
   {
    "gapAfter": "train"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'train, drew' should be 'train drew'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-58866-2092-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It takes us some time to run Mr. Aarons to earth, and it was after midnight when we finally managed it.",
  "fixed": "It took us some time to run Mr. Aarons to earth, and it was after midnight when we finally managed it.",
  "errors": [
   {
    "word": "takes"
   }
  ],
  "rule": "The sentence is in the past ('was after midnight'), so 'takes' should be 'took'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-2463-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I, saw his glance waver over the three of us and come back to rest on me.",
  "fixed": "I saw his glance waver over the three of us and come back to rest on me.",
  "errors": [
   {
    "gapAfter": "i"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'I, saw' should be 'I saw'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-403-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Poirot threw an extra log on the fire and brings forward more easy-chairs.",
  "fixed": "Poirot threw an extra log on the fire and brought forward more easy-chairs.",
  "errors": [
   {
    "word": "brings"
   }
  ],
  "rule": "The sentence is in the past ('threw'), so 'brings' should be 'brought'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-70114-706-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The gag prevented her from replying, but the murderous gleam in her eyes frighten me.",
  "fixed": "The gag prevented her from replying, but the murderous gleam in her eyes frightened me.",
  "errors": [
   {
    "word": "frighten"
   }
  ],
  "rule": "The subject 'gleam' is singular and the story is in the past, so 'frighten' should be 'frightened'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "forge-863-2082-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "The weather had broken, and the sharp wind were almost autumnal in its shrewishness.",
  "fixed": "The weather had broken, and the sharp wind was almost autumnal in its shrewishness.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'wind' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "forge-72824-2972-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She was smoothing out the cutting with her finger, and her face have a puzzled, worried look.",
  "fixed": "She was smoothing out the cutting with her finger, and her face had a puzzled, worried look.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject 'face' is singular and the story is in the past, so 'have' should be 'had'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-92-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "But it are all wrong that Caroline should arrive at the truth simply by a kind of inspired guesswork. I, wasn’t going to encourage that sort of thing.",
  "fixed": "But it is all wrong that Caroline should arrive at the truth simply by a kind of inspired guesswork. I wasn’t going to encourage that sort of thing.",
  "errors": [
   {
    "word": "are"
   },
   {
    "gapAfter": "i"
   }
  ],
  "rule": "The subject 'it' is singular, so the verb is 'is', not 'are'. Do not put a comma between a subject and its verb, so 'I, wasn't' should be 'I wasn't'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-70114-1999-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She went out of the room, and returned with it in her hand. Throughout all she retains her grip on the revolver.",
  "fixed": "She went out of the room and returned with it in her hand. Throughout all she retained her grip on the revolver.",
  "errors": [
   {
    "gapAfter": "room"
   },
   {
    "word": "retains"
   }
  ],
  "rule": "Do not put a comma between two verbs that share one subject, so 'room, and returned' should be 'room and returned'. The story is in the past ('went'), so 'retains' should be 'retained'.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  },
  "optionalGaps": [
   "all"
  ]
 },
 {
  "id": "forge-58866-808-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "madame Daubreuil, is very well able to look after herself without her daughter worrying about her.",
  "fixed": "Madame Daubreuil is very well able to look after herself without her daughter worrying about her.",
  "errors": [
   {
    "word": "madame"
   },
   {
    "gapAfter": "daubreuil"
   }
  ],
  "rule": "A title that is part of a name is capitalized, so 'madame' should be 'Madame'. Do not put a comma between a subject and its verb, so 'Daubreuil, is' should be 'Daubreuil is'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-72824-2423-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "She have a cretonne sunshade with her, and with its point she traced little designs in the gravel at her feet.",
  "fixed": "She had a cretonne sunshade with her, and with its point she traced little designs in the gravel at her feet.",
  "errors": [
   {
    "word": "have"
   }
  ],
  "rule": "The subject 'She' is singular and the story is in the past, so 'have' should be 'had'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  },
  "optionalGaps": [
   "point"
  ]
 },
 {
  "id": "forge-72824-2788-5",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They has been handed over here according to plan.",
  "fixed": "They have been handed over here according to plan.",
  "errors": [
   {
    "word": "has"
   }
  ],
  "rule": "The subject 'They' is plural, so the verb is 'have', not 'has'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-58866-2427-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "It didn’t occur to me that they would suspect me, but I is afraid of being called upon to give evidence against her.",
  "fixed": "It didn’t occur to me that they would suspect me, but I was afraid of being called upon to give evidence against her.",
  "errors": [
   {
    "word": "is"
   }
  ],
  "rule": "The story is in the past and the subject is 'I', so the verb is 'was', not 'is'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-69087-127-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Ackroyd stare blankly at me as though he hardly understood. I, began to realize that there must be something very wrong indeed somewhere.",
  "fixed": "Ackroyd stared blankly at me as though he hardly understood. I began to realize that there must be something very wrong indeed somewhere.",
  "errors": [
   {
    "word": "stare"
   },
   {
    "gapAfter": "i"
   }
  ],
  "rule": "The subject 'Ackroyd' is singular and the story is in the past, so 'stare' should be 'stared'. Do not put a comma between a subject and its verb, so the comma after 'I' should go.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "forge-58866-114-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "This were so typical of Japp that I could not forbear a chuckle.",
  "fixed": "This was so typical of Japp that I could not forbear a chuckle.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "The subject 'This' is singular, so the verb is 'was', not 'were'.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "forge-72824-2003-1",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "They was deep in conversation, absorbed in each other. Poirot, nodded his head in satisfaction and then leant towards the millionaire, lowering his voice as he did so.",
  "fixed": "They were deep in conversation, absorbed in each other. Poirot nodded his head in satisfaction and then leant towards the millionaire, lowering his voice as he did so.",
  "errors": [
   {
    "word": "was"
   },
   {
    "gapAfter": "poirot"
   }
  ],
  "rule": "The subject 'They' is plural, so the verb is 'were', not 'was'. Do not put a comma between a subject and its verb, so 'Poirot, nodded' should be 'Poirot nodded'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-61262-1230-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find both errors. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "Célestine, uttered a piercing shriek and clings to Poirot’s arm.",
  "fixed": "Célestine uttered a piercing shriek and clung to Poirot’s arm.",
  "errors": [
   {
    "gapAfter": "célestine"
   },
   {
    "word": "clings"
   }
  ],
  "rule": "Do not put a comma between a subject and its verb, so 'Célestine, uttered' should be 'Célestine uttered'. The sentence is in the past ('uttered'), so 'clings' should be 'clung'.",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "forge-69087-2818-0",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "I were amused to notice Caroline’s maneuvers that afternoon when Poirot duly arrived.",
  "fixed": "I was amused to notice Caroline’s maneuvers that afternoon when Poirot duly arrived.",
  "errors": [
   {
    "word": "were"
   }
  ],
  "rule": "With the subject 'I' in the past, the verb is 'was', not 'were'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-1030-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Motioning to me to follow him___ he ran swiftly down the stairs and opened the door.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Motioning to me to follow him, he ran swiftly down the stairs and opened the door.",
  "rule": "A long introductory phrase must be followed by a comma before the main clause. Here \"Motioning to me to follow him\" is introductory, so a comma comes before \"he ran.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-72824-268-4",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Slipping the parcel back in his coat pocket___ he nodded to Knighton and left the room.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Slipping the parcel back in his coat pocket, he nodded to Knighton and left the room.",
  "rule": "A participial phrase that opens a sentence is followed by a comma. A semicolon or colon would need a full clause before it, and \"Slipping the parcel back in his coat pocket\" is not one.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-69087-103-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Before I proceed further with what I said to Caroline and what Caroline said to me___ it might be as well to give some idea of what I should describe as our local geography.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Before I proceed further with what I said to Caroline and what Caroline said to me, it might be as well to give some idea of what I should describe as our local geography.",
  "rule": "An introductory subordinate clause is set off from the main clause with a comma. The clause starting with \"Before\" cannot stand alone, so a semicolon is wrong, and leaving out the comma runs the two parts together.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 },
 {
  "id": "mc-863-1263-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As we came out of the Stylites Arms___ Poirot drew me aside by a gentle pressure of the arm.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As we came out of the Stylites Arms, Poirot drew me aside by a gentle pressure of the arm.",
  "rule": "A subordinate clause beginning with \"As\" that opens the sentence needs a comma after it. Here the comma separates it from the main clause \"Poirot drew me aside.\"",
  "source": {
   "book": "The Mysterious Affair at Styles",
   "gutenberg": 863
  }
 },
 {
  "id": "mc-58866-665-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As to the piece of lead-piping having nothing to do with the crime___ you say that because Giraud told you so.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As to the piece of lead-piping having nothing to do with the crime, you say that because Giraud told you so.",
  "rule": "A long introductory phrase is followed by a comma. \"As to the piece of lead-piping having nothing to do with the crime\" is not a complete sentence, so it cannot be joined with a semicolon.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-70114-1301-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Obeying a sign from the man on the divan___ my two jailers brought me back to my old seat facing him.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Obeying a sign from the man on the divan, my two jailers brought me back to my old seat facing him.",
  "rule": "An introductory participial phrase takes a comma before the main clause. The phrase \"Obeying a sign from the man on the divan\" lacks a subject and verb pair, so a semicolon is wrong.",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-72824-1007-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Somewhat to her surprise___ he led her towards a siding where a coach of the departed train had been shunted.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Somewhat to her surprise, he led her towards a siding where a coach of the departed train had been shunted.",
  "rule": "An introductory phrase is set off with a comma before the main clause. \"Somewhat to her surprise\" is not a full sentence, so only a comma works before \"he led her.\"",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "mc-61262-208-1",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "As she stretched out her hand to them___ the incredible thing happened.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "As she stretched out her hand to them, the incredible thing happened.",
  "rule": "A comma follows an introductory dependent clause. \"As she stretched out her hand to them\" cannot stand alone, so a comma must separate it from the main clause \"the incredible thing happened.\"",
  "source": {
   "book": "Poirot Investigates",
   "gutenberg": 61262
  }
 },
 {
  "id": "mc-70114-1908-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "However, so long as we were on our guard___ nothing could happen to us.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "However, so long as we were on our guard, nothing could happen to us.",
  "rule": "A comma follows an introductory dependent clause. \"So long as we were on our guard\" is not a complete sentence, so a comma sets it off from the main clause \"nothing could happen to us.\"",
  "source": {
   "book": "The Big Four",
   "gutenberg": 70114
  }
 },
 {
  "id": "mc-58866-2506-2",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "Since I had learned of her past history___ I viewed this woman with increased interest.",
  "options": [
   ",",
   "",
   ";",
   ":"
  ],
  "answer": ",",
  "fixed": "Since I had learned of her past history, I viewed this woman with increased interest.",
  "rule": "A comma follows an introductory dependent clause. \"Since I had learned of her past history\" cannot stand alone, so it needs a comma before the main clause. A semicolon or colon needs a complete clause before it.",
  "source": {
   "book": "The Murder on the Links",
   "gutenberg": 58866
  }
 },
 {
  "id": "mc-72824-2525-0",
  "type": "mc",
  "skill": "commas",
  "title": "Which choice follows Standard English?",
  "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "stem": "When they were ushered into the dancer's apartments___ Poirot immediately took the lead.",
  "options": [
   ",",
   "; ",
   ":",
   ""
  ],
  "answer": ",",
  "fixed": "When they were ushered into the dancer's apartments, Poirot immediately took the lead.",
  "rule": "A long introductory clause (one that begins with a word like 'when') is followed by a comma before the main clause. Here 'When they were ushered into the dancer's apartments' is introductory, so a comma comes before 'Poirot'.",
  "source": {
   "book": "The Mystery of the Blue Train",
   "gutenberg": 72824
  }
 },
 {
  "id": "forge-69087-360-2",
  "type": "forge",
  "skill": "proofreading",
  "title": "The forged statement",
  "prompt": "A forger tampered with this witness statement, which is told in the past tense. Find the error. Tap a word that is wrong, or tap a space where a comma is missing or does not belong.",
  "text": "He has gray eyes that gives the impression of always watching something that is happening very far away.",
  "fixed": "He has gray eyes that give the impression of always watching something that is happening very far away.",
  "errors": [
   {
    "word": "gives"
   }
  ],
  "rule": "The word 'that' points back to the plural 'eyes', so the verb is 'give', not 'gives'.",
  "source": {
   "book": "The Murder of Roger Ackroyd",
   "gutenberg": 69087
  }
 }
];
