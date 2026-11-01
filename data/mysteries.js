/*
 * The mysteries: one per machine. The clues are found as pieces slot in, and the machine's last run clears the innocent
 * suspects one by one until only the culprit is left. Every one is solvable from its own clues by elimination.
 *
 * { id, title, brief,
 *   suspects: [{ name, role, icon, clue, cleared }],   clue = which clue deals with this suspect (1..4); cleared = why they are innocent
 *   culprit: index into suspects (its clue is always the last one),
 *   clues: [5 strings, found in order; clue 0 sets the scene],
 *   solution: how it was done and why }
 *
 * tests/mystery-test.mjs checks that every entry is well formed and that the clues really do clear each innocent suspect.
 */
(function (root) {
  root.SAT_MYSTERIES = [
    {
      "id": "emerald",
      "title": "The Vanished Emerald",
      "brief": "Lady Ashcombe’s emerald vanished from her locked study during dinner. Four people were in the house, and one of them took it.",
      "suspects": [
        {
          "name": "Mr. Pryce",
          "role": "the butler",
          "icon": "🎩",
          "clue": 2,
          "cleared": "He never left the dining room, and every guest watched him pour."
        },
        {
          "name": "Tobias Wren",
          "role": "the gardener",
          "icon": "🌱",
          "clue": 1,
          "cleared": "The window was latched inside and the flowerbed was untouched. Nobody came in from the garden."
        },
        {
          "name": "Miss Cecily Marsh",
          "role": "the niece",
          "icon": "👒",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Colonel Hale",
          "role": "a dinner guest",
          "icon": "🎖️",
          "clue": 3,
          "cleared": "Lady Ashcombe talked to him from the soup to the pudding. He never left his chair."
        }
      ],
      "culprit": 2,
      "clues": [
        "The study door was locked, and its only key hangs on a hook in the hall.",
        "The study window was latched from the inside, and the flowerbed under it was raked smooth. The gardener never came in that way.",
        "Mr. Pryce never left the dining room. He poured every glass in front of the guests.",
        "Lady Ashcombe talked to Colonel Hale from the soup to the pudding, and he never left his chair.",
        "Miss Marsh left the table to fetch a shawl, and came back without one."
      ],
      "solution": "Miss Marsh slipped out for a shawl, took the key from the hall, and locked the study again behind her. She owed a London jeweller a fortune and meant to sell the stone."
    },
    {
      "id": "will",
      "title": "The Forged Will",
      "brief": "Sir Edmund Vane has died, and a new will has turned up in his desk. His doctor swears he could not hold a pen at the date on it. Someone forged it.",
      "suspects": [
        {
          "name": "Mr. Lyle",
          "role": "the secretary",
          "icon": "📝",
          "clue": 3,
          "cleared": "The real will left him a fortune and the forgery cuts him out. Why would he forge that?"
        },
        {
          "name": "Mr. Thorne",
          "role": "the lawyer",
          "icon": "⚖️",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Mrs. Dobbs",
          "role": "the housekeeper",
          "icon": "🗝️",
          "clue": 1,
          "cleared": "She cannot read or write, so she could not have forged a signature."
        },
        {
          "name": "Giles Vane",
          "role": "the nephew",
          "icon": "🧳",
          "clue": 2,
          "cleared": "His ship docked the morning after the death. He was at sea the whole time."
        }
      ],
      "culprit": 1,
      "clues": [
        "The new will is dated 3 March, but Sir Edmund’s doctor says he could not hold a pen after 1 March.",
        "Mrs. Dobbs signs her name with a cross. She has never learned to write.",
        "Giles Vane’s ship docked the morning after Sir Edmund died. He had been at sea for a month.",
        "The real will, signed in January, left Mr. Lyle a fortune. The forged one leaves him nothing at all.",
        "The forged will spells “color” and “honor” the American way. Sir Edmund never did, but Mr. Thorne lived in Boston for ten years."
      ],
      "solution": "Mr. Thorne had been taking money from Sir Edmund’s accounts. The real will would have sent an auditor through them, so he wrote a new one, and an old habit of spelling gave him away."
    },
    {
      "id": "meteor",
      "title": "The Silent Stable Dog",
      "brief": "Meteor, the favourite for Saturday’s race, was led out of a locked stable in the night. The stable dog never made a sound.",
      "suspects": [
        {
          "name": "Mr. Aldous Crane",
          "role": "the trainer",
          "icon": "📋",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Sir Roland Pike",
          "role": "a rival owner",
          "icon": "🏇",
          "clue": 1,
          "cleared": "The dog barks at every stranger, and it stayed silent. The thief was someone it knew."
        },
        {
          "name": "Silas Marrow",
          "role": "the head groom",
          "icon": "🐴",
          "clue": 3,
          "cleared": "Forty people saw him at the inn until closing time."
        },
        {
          "name": "Ned Cobb",
          "role": "the stable boy",
          "icon": "🧢",
          "clue": 2,
          "cleared": "Only two keys open the gate, and Ned has neither one."
        }
      ],
      "culprit": 0,
      "clues": [
        "The gate was not forced, and the stable dog did not bark. It barks at every stranger who comes near.",
        "A stranger would have set the dog barking, and a rival owner like Sir Roland is a stranger to it. It stayed silent.",
        "Only two keys open the stable gate. The head groom has one and the trainer the other, so the stable boy has none.",
        "Silas Marrow was at the village inn until closing time. Forty people saw him there.",
        "Mr. Crane had bet his savings that Meteor would not win on Saturday."
      ],
      "solution": "Mr. Crane walked the horse out with his own key, and the dog knew him too well to bark. He hid Meteor in an old quarry until the race was over, so that his bet would win."
    },
    {
      "id": "closedwhile",
      "title": "Closed While Friday",
      "brief": "The Duke was due at the Milford Museum on Wednesday morning, but a notice on the door sent visitors away. The Curator never wrote it. One of four staff did.",
      "suspects": [
        {
          "name": "Miss Pell",
          "role": "the typist",
          "icon": "🖋️",
          "clue": 2,
          "cleared": "Her right arm was in plaster and she cannot write with her left, so she could not have inked the notice."
        },
        {
          "name": "Professor Ainsley",
          "role": "the coin expert",
          "icon": "🏺",
          "clue": 3,
          "cleared": "The Duke came to see his coins, so a closed door would have ruined his own big day."
        },
        {
          "name": "Mr. Dunn",
          "role": "the caretaker",
          "icon": "🔧",
          "clue": 1,
          "cleared": "He was trapped in the jammed boiler room until nine, so he could not have hung the notice."
        },
        {
          "name": "Mr. Hesketh",
          "role": "the fossil keeper",
          "icon": "🦴",
          "clue": 4,
          "cleared": ""
        }
      ],
      "culprit": 3,
      "clues": [
        "A notice on the museum door read: “Closed while Friday. By order of the Curator.” The Curator never wrote it.",
        "The notice went up between eight and nine. Dunn, the caretaker, was stuck in the jammed boiler room from half past seven to nine.",
        "The notice is inked in a bold, quick hand. Miss Pell’s right arm is in plaster, and she cannot write with her left.",
        "The Duke came to see Professor Ainsley’s Roman coins, the work of ten years. Closing the door would have ruined his big day.",
        "Mr. Hesketh grew up near Leeds, where people say “while” to mean “until”, as in “wait while Friday”."
      ],
      "solution": "Mr. Hesketh was sore that the Duke would admire the coins and ignore his fossils. He hung the notice himself, and wrote “while” for “until” as he did back home."
    },
    {
      "id": "gullrock",
      "title": "The Pearls in the Cave",
      "brief": "Mrs. Verity’s pearls vanished from her room at the Cliff Hotel in Pellmouth. They were found in a sea cave. One of four people at the hotel put them there.",
      "suspects": [
        {
          "name": "Miss Dace",
          "role": "the schoolmistress",
          "icon": "📚",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Captain Hoyle",
          "role": "the retired sea captain",
          "icon": "⚓",
          "clue": 1,
          "cleared": "Only a swimmer can reach the cave, and he never learned to swim."
        },
        {
          "name": "Mr. Ormerod",
          "role": "the elderly guest",
          "icon": "🧓",
          "clue": 3,
          "cleared": "He walks with two sticks and could not have gone down ninety cliff steps to the beach."
        },
        {
          "name": "Mr. Lane",
          "role": "the commercial traveller",
          "icon": "🚂",
          "clue": 2,
          "cleared": "He arrived on the 5.30 train, after the pearls had vanished and the sea had covered the cave."
        }
      ],
      "culprit": 0,
      "clues": [
        "Mrs. Verity’s pearls vanished from her room between two and five on Saturday. On Sunday they were found in Gull Rock cave.",
        "Only a swimmer can reach Gull Rock cave, and only from three to five. Captain Hoyle, forty years at sea, never learned to swim.",
        "Mr. Lane stepped off the 5.30 train on Saturday and booked in at six, when the pearls had gone and the sea had covered the cave.",
        "Gull Rock lies below ninety cliff steps. Mr. Ormerod walks with two sticks and sat on the terrace all Saturday afternoon.",
        "At dinner on Saturday, a day before the search, Miss Dace sighed that the pearls were surely safe and dry in Gull Rock cave."
      ],
      "solution": "Miss Dace took the pearls while Mrs. Verity napped, swam to Gull Rock at low tide and hid them there. At dinner her tongue ran ahead of her, and she named the cave."
    },
    {
      "id": "mayorpig",
      "title": "The Mayor and the Pig",
      "brief": "In the Thornby Courier the Mayor’s photograph appeared under “Prize Pig”, and the pig’s under “Our Mayor”. Someone swapped the captions in the metal page.",
      "suspects": [
        {
          "name": "Mr. Tipping",
          "role": "the compositor",
          "icon": "✒️",
          "clue": 2,
          "cleared": "He was at the hospital from midnight, and the ward sister logged the times."
        },
        {
          "name": "Mr. Ware",
          "role": "the photographer",
          "icon": "📷",
          "clue": 1,
          "cleared": "Swapping the captions meant reading back-to-front metal type, which he cannot do."
        },
        {
          "name": "Mr. Fitch",
          "role": "the sports reporter",
          "icon": "🏏",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Sam Nye",
          "role": "the office boy",
          "icon": "🚲",
          "clue": 3,
          "cleared": "He went home at ten, before the pig’s photograph was added, so he did not know it existed."
        }
      ],
      "culprit": 2,
      "clues": [
        "The Courier’s page was checked at half past twelve and the presses ran at one. Yet the Mayor’s picture said “Prize Pig”.",
        "Swapping the captions meant reading type, which is cast back to front. Mr. Ware, the photographer, cannot read it at all.",
        "Mr. Tipping, the compositor, sat at the hospital from midnight to dawn as his son was born. The sister logged the times.",
        "The pig’s photograph was added to the page only at eleven. Young Nye, the office boy, went home at ten and never heard of it.",
        "Mr. Fitch spent six years as a compositor before turning writer, and he was still in the building working on his cricket report."
      ],
      "solution": "Mr. Fitch, once a compositor, still reads type back to front. He swapped the two captions to get even with the Mayor, who had banned reporters from the cricket ground."
    },
    {
      "id": "scarab",
      "title": "The Scarab in the Sand",
      "brief": "A gold scarab vanished from the finds tent at a desert dig. The tent was locked and sealed with red wax, and one of four people in camp broke in.",
      "suspects": [
        {
          "name": "Sir Hector Stainton",
          "role": "the patron",
          "icon": "💰",
          "clue": 3,
          "cleared": "He staked his fortune on the museum grant, which ends if the scarab is lost."
        },
        {
          "name": "Miss Clara Dunmore",
          "role": "the photographer",
          "icon": "📷",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Idris Karam",
          "role": "the foreman",
          "icon": "⛏️",
          "clue": 1,
          "cleared": "His hobnailed boots leave dotted tracks, but the thief wore smooth soles."
        },
        {
          "name": "Basil Orme",
          "role": "the cook",
          "icon": "🍳",
          "clue": 2,
          "cleared": "The drift across his only door was unbroken at dawn, so he never went out."
        }
      ],
      "culprit": 1,
      "clues": [
        "The storm ended at midnight, and the thief’s tracks lay on top of the fresh, smooth sand. Every print was made after it.",
        "The tracks show smooth soles. Karam, the foreman, wears hobnailed boots that leave a dotted track, and owns no other pair.",
        "The cook’s tent has one door and is pegged tight all round. A storm drift lay unbroken across it at dawn, so Orme never left.",
        "The museum will end its grant unless the scarab is on show. Stainton, the patron, has staked his fortune on that grant.",
        "Miss Dunmore’s smooth-soled shoes stood by her cot at dawn, with a crumb of red wax from the tent’s seal on one heel."
      ],
      "solution": "Miss Dunmore crept out after the storm, broke the wax seal and took the scarab. She had promised a private collector a photograph of it, then offered him the real thing."
    },
    {
      "id": "ledgers",
      "title": "The Flooded Ledgers",
      "brief": "Someone turned on a hidden tap in the cellar of the Linden Building Society and soaked the old ledgers the night before an audit. The cellar was dry at midnight.",
      "suspects": [
        {
          "name": "Albert Wells",
          "role": "the porter",
          "icon": "🔑",
          "clue": 2,
          "cleared": "Only long-serving staff knew the tap existed, and he joined on Monday."
        },
        {
          "name": "Miss Edith Lorimer",
          "role": "the typist",
          "icon": "🖋️",
          "clue": 3,
          "cleared": "The rusted wheel needs two strong hands, and her right arm is in plaster."
        },
        {
          "name": "Percy Fenn",
          "role": "the junior clerk",
          "icon": "🎺",
          "clue": 1,
          "cleared": "The tap was turned on at ten past one, when he was playing in front of two hundred dancers."
        },
        {
          "name": "Ambrose Garside",
          "role": "the cashier",
          "icon": "💼",
          "clue": 4,
          "cleared": ""
        }
      ],
      "culprit": 3,
      "clues": [
        "The cellar clock stopped at ten past three as water reached it. The tap floods a foot an hour, and the clock hangs two feet up.",
        "Fenn, the junior clerk, played trumpet in the Corn Exchange dance band from nine until two, in front of two hundred dancers.",
        "Only staff of ten years or more know the tap exists. Wells, the porter, joined the Society on Monday.",
        "The rusted tap wheel takes two strong hands. Miss Lorimer, the typist, has had her right arm in plaster since Whitsun.",
        "Garside, the cashier, came in at six with soaked shoes and socks, though the morning was dry. Nobody found the flood until seven."
      ],
      "solution": "Garside had been taking members’ savings, and the old ledgers would have shown it at the audit. He opened the hidden tap at ten past one, then slipped down at six to check, and soaked his shoes."
    },
    {
      "id": "opals",
      "title": "The Opals That Never Came",
      "brief": "The tray of rings vanished from Ferris the jeweller’s shop while he was out. The door and shutters were locked, and a note had sent him away.",
      "suspects": [
        {
          "name": "Mr. Percy Hobb",
          "role": "the greengrocer",
          "icon": "🥕",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Dennis Lamb",
          "role": "the apprentice",
          "icon": "🔧",
          "clue": 1,
          "cleared": "He stood beside the jeweller at the station from two until four."
        },
        {
          "name": "Mr. Alaric Grice",
          "role": "the watchmaker",
          "icon": "⌚",
          "clue": 2,
          "cleared": "The coal-hole is only fourteen inches across, and he weighs eighteen stone."
        },
        {
          "name": "Miss Winifred Lacey",
          "role": "the schoolmistress",
          "icon": "📚",
          "clue": 3,
          "cleared": "She was teaching her class under an inspector’s eye from one until four."
        }
      ],
      "culprit": 0,
      "clues": [
        "The note read: “Your new opal’s wait at the station.” He went at two, found nothing, and came home at four to an empty window.",
        "Lamb, the apprentice, carried the jeweller’s bag. He stood at his side at the station from two until they walked home at four.",
        "The only other way in was the coal-hole, a gap fourteen inches across. Grice, the watchmaker, weighs eighteen stone.",
        "Miss Lacey, the schoolmistress, taught thirty pupils from one until four, with a school inspector at the back all afternoon.",
        "Hobb, the greengrocer, writes his own price tickets with stray apostrophes: “Plum’s 4d”, “Bean’s 3d”."
      ],
      "solution": "Hobb, the greengrocer across the street, wrote the note and sent Ferris to the station. He is slim enough for the coal-hole, and his stray apostrophe gave him away."
    },
    {
      "id": "candle",
      "title": "The Four-Hour Candle",
      "brief": "Beckwith Mill burned to the ground at midnight. The fire was no accident, and it was set hours before anyone saw a flame.",
      "suspects": [
        {
          "name": "Amos Teale",
          "role": "the miller",
          "icon": "🌾",
          "clue": 3,
          "cleared": "His insurance had lapsed and his flour was unsold, so the fire could only ruin him."
        },
        {
          "name": "Dan Pooley",
          "role": "the carter",
          "icon": "🐴",
          "clue": 1,
          "cleared": "The loft hatch is eighteen inches wide, and the twenty-stone carter could never squeeze through."
        },
        {
          "name": "Walter Brack",
          "role": "the foreman",
          "icon": "🕯️",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Hugh Sedley",
          "role": "a rival miller",
          "icon": "🥂",
          "clue": 2,
          "cleared": "He was giving a speech to sixty guests at the Guild dinner when the candle was lit."
        }
      ],
      "culprit": 2,
      "clues": [
        "Beckwith Mill burned down at midnight. The fire began in the loft with a four-hour candle in oily rags, lit about eight.",
        "The loft is entered only by a hatch eighteen inches wide. Pooley, the sacked carter, weighs twenty stone and would stick fast.",
        "From seven until ten, Hugh Sedley, a rival miller, chaired the Millers’ Guild dinner in front of sixty guests.",
        "Teale let the mill’s insurance run out in May, and every sack inside was unsold. The fire could only ruin the miller.",
        "The village shop sold only one four-hour candle this month. Brack, the foreman, bought it on Friday."
      ],
      "solution": "Brack had been selling flour on the quiet, and the stock check was due. A four-hour candle let him light the fire at eight and be at the inn when the mill burned."
    },
    {
      "id": "chain",
      "title": "The Mayor’s Gold Chain",
      "brief": "Someone smashed into the Hallowfield Town Hall strongroom on Saturday night and took the Mayor’s gold chain of office.",
      "suspects": [
        {
          "name": "Dunstan Hale",
          "role": "the blacksmith",
          "icon": "🔨",
          "clue": 3,
          "cleared": "He rang the tenor bell through the whole peal, and a ringer who leaves breaks it up."
        },
        {
          "name": "Percival Gadd",
          "role": "the town clerk",
          "icon": "📜",
          "clue": 4,
          "cleared": ""
        },
        {
          "name": "Captain Brine",
          "role": "the caretaker",
          "icon": "🔑",
          "clue": 1,
          "cleared": "He lost an arm in the war and could not swing a heavy two-handed sledgehammer."
        },
        {
          "name": "Alderman Fosdyke",
          "role": "the Mayor",
          "icon": "🎩",
          "clue": 2,
          "cleared": "The thief rode off on a bicycle, and the Mayor has never learned to ride one."
        }
      ],
      "culprit": 1,
      "clues": [
        "A hole was smashed in the Town Hall strongroom wall during Saturday’s bell peal, and the Mayor’s gold chain was taken.",
        "The hole took dozens of blows from a heavy two-handed sledgehammer. Brine, the caretaker, lost an arm in the war.",
        "The muddy yard showed one set of tracks, from a bicycle. Alderman Fosdyke, the Mayor, has never learned to ride one.",
        "Hale, the blacksmith, rang the heavy tenor bell for the whole three-hour peal. If one ringer leaves, the peal falls apart.",
        "Gadd, the town clerk, sighed that the stolen chain ‘was’ a lovely piece. Everyone else said it ‘is’, and must be found."
      ],
      "solution": "Gadd, deep in debt, smashed the wall under cover of the peal and rode off by bicycle. He melted the chain for its gold, so he spoke of it as already gone."
    },
    {
      "id": "redcable",
      "title": "The Red Cable",
      "brief": "On opening night at the Saltmouth Pier Theatre, the stage lights died the moment the curtain rose. Someone did it on purpose.",
      "suspects": [
        {
          "name": "Gerald Bellamy",
          "role": "the leading man",
          "icon": "🎭",
          "clue": 2,
          "cleared": "The cable was cut between six and seven, and he did not arrive until 7:20."
        },
        {
          "name": "Hector Gaunt",
          "role": "the theatre owner",
          "icon": "🎫",
          "clue": 3,
          "cleared": "A sold-out opening night made him money, and the blackout meant refunding every ticket."
        },
        {
          "name": "Alfie Dunn",
          "role": "the stagehand",
          "icon": "🔧",
          "clue": 1,
          "cleared": "He is red-green colour-blind, so he could not have picked the red cable from the green."
        },
        {
          "name": "Hester Vole",
          "role": "the prompter",
          "icon": "📖",
          "clue": 4,
          "cleared": ""
        }
      ],
      "culprit": 3,
      "clues": [
        "In the theatre cellar, one red cable among a dozen green ones was cut clean through. Only the red one fed the stage lights.",
        "Alfie Dunn, the stagehand, is red-green colour-blind. He could never have told the red cable from the green ones.",
        "The lights passed their test at six, and the cellar was locked at seven. Bellamy, the leading man, arrived at 7:20.",
        "Hector Gaunt, the theatre owner, had sold every seat for the first time in years. A blackout meant refunding them all.",
        "At half past six the doorkeeper saw Miss Vole, the prompter, coming up the cellar steps. She had no reason to go down."
      ],
      "solution": "Vole, the prompter, would lose her job if the new play was a hit. She slipped into the cellar at half past six and cut the one red cable that fed the stage lights."
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
