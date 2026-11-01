/* The fire storyline: the inquiry the player reads as questions are solved. The statements are found one at a time (see js/game.js). */
window.SAT_STORIES = window.SAT_STORIES || {};
window.SAT_STORIES.fire = {
 "title": "The Fire at Hallam Wharf",
 "cast": [
  {
   "name": "Inspector Mercer",
   "role": "Fire inspector leading the inquiry, who narrates his own notes"
  },
  {
   "name": "Edmund Hallam",
   "role": "Owner of Hallam Wharf; deeply in debt (suspect)"
  },
  {
   "name": "Silas Brandt",
   "role": "Foreman of Warehouse Four, dismissed on the day of the fire (suspect)"
  },
  {
   "name": "Captain Rufus Dunmore",
   "role": "Master of the coaster Marigold; a part-time smuggler (suspect)"
  },
  {
   "name": "Nora Tallis",
   "role": "Wharf clerk who keeps the ledgers and receipts (suspect)"
  },
  {
   "name": "Tobias Wren",
   "role": "Night watchman at the wharf gate"
  },
  {
   "name": "Gareth Lowe",
   "role": "Chief Officer of the Hallam Wharf Fire Brigade"
  },
  {
   "name": "Cyril Bax",
   "role": "Harbour master who keeps the daily log"
  },
  {
   "name": "Ferris Quill",
   "role": "Assessor for the Tidewater Mutual Insurance Company"
  },
  {
   "name": "Maud Pell",
   "role": "Landlady of the Anchor Inn"
  },
  {
   "name": "Joseph Larkin",
   "role": "Chandler on Anchor Street who sells candles and rope"
  }
 ],
 "chapters": [
  {
   "n": 1,
   "title": "The Glow over the Harbour",
   "summary": "A watchman raises the alarm, the brigade fights a fierce fire, and Inspector Mercer arrives at dawn.",
   "statements": [
    {
     "seq": 1,
     "text": "The night watchman at Hallam Wharf, Tobias Wren, smelled smoke at twenty-five minutes past eleven and ran to ring the alarm bell.",
     "voice": "witness"
    },
    {
     "seq": 2,
     "text": "The volunteer crew of the Hallam Wharf Fire Brigade, fourteen men in all, reached the quay at ten minutes to midnight with one pump.",
     "voice": "report"
    },
    {
     "seq": 3,
     "text": "Flames from the roof of Warehouse Four were already streaming towards the sea when the first buckets arrived.",
     "voice": "report"
    },
    {
     "seq": 4,
     "text": "The crates of lamp oil beside the door were already blistering, so Tobias Wren dragged four of them across the cobbles before the heat drove him back.",
     "voice": "witness"
    },
    {
     "seq": 5,
     "text": "Chief Officer Gareth Lowe reported that there was little wind that night, so the fire stayed inside Warehouse Four and spared the neighbouring sheds.",
     "voice": "report"
    },
    {
     "seq": 6,
     "text": "Neither Tobias Wren nor Mr. Bax, the harbour master, had ever seen a fire spread so quickly through a stone building.",
     "voice": "witness"
    },
    {
     "seq": 7,
     "text": "By half past one, the roof of the warehouse had fallen in, and the brigade turned its hoses on the glowing walls.",
     "voice": "report"
    },
    {
     "seq": 8,
     "text": "The owner of the wharf, Mr. Edmund Hallam, arrived at midnight in his evening clothes and stood silently at the edge of the quay.",
     "voice": "witness"
    },
    {
     "seq": 9,
     "text": "The wharf clerk, Nora Tallis, came running from the chapel hall with her coat half buttoned and begged the firemen to save the ledgers.",
     "voice": "witness"
    },
    {
     "seq": 10,
     "text": "Chief Officer Lowe wrote that no one was hurt, that the neighbouring sheds were saved, and that Warehouse Four was a total loss.",
     "voice": "report"
    },
    {
     "seq": 11,
     "text": "The ruin of Warehouse Four was still smoking when my apprentice and I arrived at dawn, and I wrote that the blaze looked too fierce to be an accident.",
     "voice": "inspector"
    },
    {
     "seq": 12,
     "text": "Before breakfast, I made a list of everyone with a key to the wharf, everyone with a grudge against its owner, and everyone who stood to gain.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 2,
   "title": "A Very Convenient Policy",
   "summary": "A doubled insurance policy, a bank letter and some missing minutes make the owner the first suspect.",
   "statements": [
    {
     "seq": 13,
     "text": "The assessor for the Tidewater Mutual Insurance Company, Mr. Ferris Quill, had come to town to audit the wharf’s books on Monday morning.",
     "voice": "report"
    },
    {
     "seq": 14,
     "text": "The insurance on Warehouse Four, Mr. Quill’s report added, had more than doubled in September, and the owner himself had asked for the increase.",
     "voice": "report"
    },
    {
     "seq": 15,
     "text": "According to the stock list that Mr. Quill carried, Warehouse Four had held tea chests, coils of rope, and ninety crates of lamp oil.",
     "voice": "report"
    },
    {
     "seq": 16,
     "text": "The dinner at the Harbour Hotel, Mr. Hallam told Inspector Mercer, had lasted from seven o’clock until the alarm bell rang, with Mr. Quill as his guest.",
     "voice": "witness"
    },
    {
     "seq": 17,
     "text": "Nora Tallis, the wharf clerk, said that she had locked the loft office at twenty to nine, left it dark, and walked straight to the chapel hall.",
     "voice": "witness"
    },
    {
     "seq": 18,
     "text": "Mr. Hallam, pale and unshaven, admitted to Inspector Mercer that the insurance money would save him from the bank.",
     "voice": "witness"
    },
    {
     "seq": 19,
     "text": "A letter from the bank, which I found folded in Mr. Hallam’s coat, demanded full repayment of the loan by the end of November.",
     "voice": "inspector"
    },
    {
     "seq": 20,
     "text": "The gold cigarette case found beside the warehouse door belonged to Mr. Hallam, who said he had dropped it at six that evening.",
     "voice": "witness"
    },
    {
     "seq": 21,
     "text": "The waiter at the Harbour Hotel remembered that Mr. Hallam had left the table for twenty minutes at ten o’clock to make a telephone call.",
     "voice": "witness"
    },
    {
     "seq": 22,
     "text": "I noted that Mr. Hallam, a man deep in debt, had spent the evening of the fire entertaining the very man who would judge his claim.",
     "voice": "inspector"
    },
    {
     "seq": 23,
     "text": "The timbers near the oil store door, I believed at first, had burnt deepest, so the fire must have begun there.",
     "voice": "inspector"
    },
    {
     "seq": 24,
     "text": "The strongest motive so far, I wrote, belonged to Mr. Hallam, yet motive alone was not proof, so I turned next to the dismissed foreman.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 3,
   "title": "The Foreman’s Temper",
   "summary": "The watchman describes how the dismissed foreman threatened the wharf, and the whole town decides he must be guilty.",
   "statements": [
    {
     "seq": 25,
     "text": "The foreman of Warehouse Four, Silas Brandt, was dismissed at five o’clock on Friday for stealing rope, according to Tobias Wren.",
     "voice": "witness"
    },
    {
     "seq": 26,
     "text": "Tobias Wren heard Silas Brandt shout across the yard that Mr. Hallam would regret it and that the whole wharf would burn like paper.",
     "voice": "witness"
    },
    {
     "seq": 27,
     "text": "Before leaving the yard, Silas Brandt handed his ring of keys to the clerk, Nora Tallis, who locked them in her desk drawer.",
     "voice": "witness"
    },
    {
     "seq": 28,
     "text": "Silas Brandt’s boots, which I examined at his lodgings, smelled strongly of lamp oil, but then so did the boots of every man on the wharf.",
     "voice": "inspector"
    },
    {
     "seq": 29,
     "text": "A box of matches from the Anchor Inn lay near the gate, firemen reported, and Mr. Brandt admitted that it was his.",
     "voice": "witness"
    },
    {
     "seq": 30,
     "text": "A man in a foreman’s cap, the harbour master noted in his log, was arguing with the watchman at the wharf gate at eight o’clock.",
     "voice": "report"
    },
    {
     "seq": 31,
     "text": "The argument at the gate, Tobias Wren admitted, had ended when he refused to let Brandt through, because the foreman smelled of beer and looked furious.",
     "voice": "witness"
    },
    {
     "seq": 32,
     "text": "Silas Brandt, a broad man with scarred hands and a short temper, told me he had only wanted to collect his tools and his coat.",
     "voice": "inspector"
    },
    {
     "seq": 33,
     "text": "The accusation of theft, Silas Brandt insisted to Inspector Mercer, was false, because he had never stolen so much as a rope end in twenty years.",
     "voice": "witness"
    },
    {
     "seq": 34,
     "text": "I learned that either Mr. Brandt or Mr. Hallam had ordered the crates of lamp oil to be stacked beside the door, and each man blamed the other.",
     "voice": "inspector"
    },
    {
     "seq": 35,
     "text": "The talk in every shop by Saturday evening, I noted, was that the foreman had burned the warehouse out of revenge, though nobody had proof.",
     "voice": "inspector"
    },
    {
     "seq": 36,
     "text": "Silas Brandt’s anger was real, I wrote, but anger and arson are different things, and I wanted to know where he had spent the evening.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 4,
   "title": "An Alibi at the Anchor",
   "summary": "The foreman’s alibi holds, but a harbour log and a handcart on the quay point towards a sea captain.",
   "statements": [
    {
     "seq": 37,
     "text": "The landlady of the Anchor Inn, Mrs. Maud Pell, swore that Silas Brandt was sitting beside her fire when the fire bell rang.",
     "voice": "witness"
    },
    {
     "seq": 38,
     "text": "Eight men from the darts team, including the baker and the ferryman, said that Silas Brandt never left the room except to fetch coal.",
     "voice": "witness"
    },
    {
     "seq": 39,
     "text": "Silas Brandt could not have reached the wharf and returned within the hour without being missed, so I crossed his name off my list for the moment.",
     "voice": "inspector"
    },
    {
     "seq": 40,
     "text": "The log of the harbour master showed that the coaster Marigold was due to sail at ten that night, but her captain asked to wait for the morning tide.",
     "voice": "report"
    },
    {
     "seq": 41,
     "text": "The master of the Marigold, Captain Rufus Dunmore, was a tall man with a grey beard who answered every question with another question.",
     "voice": "inspector"
    },
    {
     "seq": 42,
     "text": "The brigade sifted the ash for the lead linings of the tea chests, and it counted thirty-four where the stock list showed forty.",
     "voice": "report"
    },
    {
     "seq": 43,
     "text": "Six missing chests of tea, I wrote, meant either that a thief had emptied the shed before the fire or that the fire had burned them to nothing.",
     "voice": "inspector"
    },
    {
     "seq": 44,
     "text": "The crew of the Marigold, Captain Dunmore claimed, had been too tired to sail, and the hold was not yet full.",
     "voice": "witness"
    },
    {
     "seq": 45,
     "text": "One fisherman from the cottages by the quay said that Captain Dunmore and two deckhands had pushed a handcart along the wharf late on Friday night.",
     "voice": "witness"
    },
    {
     "seq": 46,
     "text": "Either Captain Dunmore or one of his deckhands had entered the warehouse before the fire, I suspected, and the missing chests seemed to prove it.",
     "voice": "inspector"
    },
    {
     "seq": 47,
     "text": "The Marigold, Mr. Bax’s log showed, had made the same voyage to the far side of the Channel every month for two years.",
     "voice": "report"
    },
    {
     "seq": 48,
     "text": "By Sunday morning, suspicion had moved from the foreman to a sea captain with six missing chests and no good reason to be on the quay.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 5,
   "title": "Six Chests on the Quay",
   "summary": "Captain Dunmore confesses to smuggling and explains the missing chests, but his story includes a strange light in the loft.",
   "statements": [
    {
     "seq": 49,
     "text": "My questions about the missing chests made Captain Dunmore laugh once and then sit down heavily on a coil of rope.",
     "voice": "inspector"
    },
    {
     "seq": 50,
     "text": "Six of the chests in the shed held foreign tobacco beneath a layer of tea, Captain Dunmore admitted, and he had landed it without paying duty.",
     "voice": "witness"
    },
    {
     "seq": 51,
     "text": "Captain Dunmore swore that he and two deckhands had wheeled the six chests through the unbolted quay door and down to the Marigold before eleven o’clock.",
     "voice": "witness"
    },
    {
     "seq": 52,
     "text": "The door on the quay side, the watchman confessed, was not bolted until midnight, and he had dozed in the gatehouse from ten o’clock until the smoke woke him.",
     "voice": "witness"
    },
    {
     "seq": 53,
     "text": "The tobacco in the six chests, which customs officers found in the Marigold’s hold on Sunday, was worth about two hundred pounds.",
     "voice": "report"
    },
    {
     "seq": 54,
     "text": "The harbour master, Mr. Bax, said that lantern light had been moving on the Marigold’s deck between ten and eleven o’clock.",
     "voice": "report"
    },
    {
     "seq": 55,
     "text": "The small yellow light in the loft window of Warehouse Four, Captain Dunmore said, had been burning steadily as his men loaded the handcart at about ten o’clock.",
     "voice": "witness"
    },
    {
     "seq": 56,
     "text": "The light, Captain Dunmore added, looked more like a candle than a lamp, but he thought nothing of it at the time.",
     "voice": "witness"
    },
    {
     "seq": 57,
     "text": "Both deckhands, questioned separately, gave the same account of the chests and the same account of the light in the loft window.",
     "voice": "inspector"
    },
    {
     "seq": 58,
     "text": "A smuggler with six chests safely aboard his ship, I reasoned, had nothing to gain from a fire and everything to lose from a search.",
     "voice": "inspector"
    },
    {
     "seq": 59,
     "text": "I learned that neither the captain nor his deckhands had ever held a key to the loft, whose ladder was chained at all times.",
     "voice": "inspector"
    },
    {
     "seq": 60,
     "text": "Mr. Hallam, I recalled, had left his hotel table at ten o’clock, just as the light was seen in the loft window.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 6,
   "title": "The Light in the Loft",
   "summary": "The brigade finds that the fire began in the loft, and the owner’s missing key and absent minutes put him under suspicion again.",
   "statements": [
    {
     "seq": 61,
     "text": "The joists beneath the loft floor had burned through first, Chief Officer Lowe reported, so the fire must have begun above the oil store.",
     "voice": "report"
    },
    {
     "seq": 62,
     "text": "My theory about the oil store was wrong, I admitted, because the falling loft floor had set the lamp oil alight and hidden the true starting point.",
     "voice": "inspector"
    },
    {
     "seq": 63,
     "text": "The account books, the receiving records, and her desk were all that the loft held, Nora Tallis said, and a single ladder led up to it.",
     "voice": "witness"
    },
    {
     "seq": 64,
     "text": "Nora Tallis explained that there were only three keys to the loft padlock, and they belonged to Mr. Hallam, to the foreman, and to herself.",
     "voice": "witness"
    },
    {
     "seq": 65,
     "text": "I reasoned that anyone wishing to start a fire in the loft would have needed one of those three keys, or else a hacksaw and plenty of noise.",
     "voice": "inspector"
    },
    {
     "seq": 66,
     "text": "The padlock on the ladder chain, which firemen found in the ashes, was still locked, so whoever climbed up had locked it again on the way down.",
     "voice": "report"
    },
    {
     "seq": 67,
     "text": "The only loft key owned by Mr. Hallam, he said, lay in a drawer at home, but his housekeeper found the drawer empty.",
     "voice": "witness"
    },
    {
     "seq": 68,
     "text": "A missing key, a heavy debt, and twenty minutes away from the dinner table made Mr. Hallam look guilty, though none of them proved a thing.",
     "voice": "inspector"
    },
    {
     "seq": 69,
     "text": "The night operator at the exchange recalled a call from the Harbour Hotel at ten past ten, but she could not say who had made it.",
     "voice": "witness"
    },
    {
     "seq": 70,
     "text": "A porter at the Harbour Hotel claimed that Mr. Hallam ran, not walked, back into the dining room at twenty past ten.",
     "voice": "witness"
    },
    {
     "seq": 71,
     "text": "The insurance payment on Warehouse Four, Mr. Quill calculated, would clear Mr. Hallam’s debts completely and leave him several thousand pounds richer.",
     "voice": "report"
    },
    {
     "seq": 72,
     "text": "My apprentice and I argued late that night over whether a man could burn his own warehouse and then dine calmly, and I said that a careful planner could.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 7,
   "title": "What the Ash Kept",
   "summary": "Chief Officer Lowe’s men find a tin lid and a ring of beeswax, which suggests the fire was timed and no alibi can be trusted.",
   "statements": [
    {
     "seq": 73,
     "text": "Chief Officer Lowe’s men, sifting the wreckage of the loft floor, found a flattened tin lid with a ring of hardened wax fused to its surface.",
     "voice": "report"
    },
    {
     "seq": 74,
     "text": "The analyst at the county laboratory reported that the wax was pure beeswax mixed with traces of lamp oil and burnt rag.",
     "voice": "report"
    },
    {
     "seq": 75,
     "text": "The fire in the loft, Chief Officer Lowe estimated, had started about ten minutes before Tobias Wren smelled smoke.",
     "voice": "report"
    },
    {
     "seq": 76,
     "text": "A candle standing in a nest of oily rags, I realised, would burn slowly down and set the whole nest alight hours after its owner had gone.",
     "voice": "inspector"
    },
    {
     "seq": 77,
     "text": "The idea of a slow candle changed everything, because Mr. Hallam’s dinner, Mr. Brandt’s darts match, and the Marigold’s lanterns could no longer prove anyone innocent.",
     "voice": "inspector"
    },
    {
     "seq": 78,
     "text": "The ticket for the call at ten past ten, which the exchange kept, showed that Mr. Hallam had telephoned his bank manager at home.",
     "voice": "report"
    },
    {
     "seq": 79,
     "text": "Mr. Hallam said, with a tired smile, that he had begged the bank manager for more time, and that the bank itself had demanded the higher insurance.",
     "voice": "witness"
    },
    {
     "seq": 80,
     "text": "An owner with a plan to burn his own warehouse, Mr. Quill declared, would hardly invite the assessor to dinner on the same night.",
     "voice": "witness"
    },
    {
     "seq": 81,
     "text": "The hours between half past five and eight, which Silas Brandt said he spent walking on the cliffs, had no witness at all.",
     "voice": "witness"
    },
    {
     "seq": 82,
     "text": "Silas Brandt’s shouted threat that the wharf would go up like paper now sounded less like temper and more like a plan.",
     "voice": "inspector"
    },
    {
     "seq": 83,
     "text": "On the shelf in Silas Brandt’s lodgings stood a box of six candles, which his landlady said he bought every winter.",
     "voice": "inspector"
    },
    {
     "seq": 84,
     "text": "The secret of the candle and the nest of rags, I decided, must stay inside the brigade, so I asked Chief Officer Lowe to say nothing to anyone.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 8,
   "title": "Forty Minutes to the Inch",
   "summary": "A test candle fixes the time of the fire and clears the foreman, while a captain’s receipts show that the wharf’s books were false.",
   "statements": [
    {
     "seq": 85,
     "text": "To test my idea, my apprentice and I burned a new candle of the same width in a tin on the quay.",
     "voice": "inspector"
    },
    {
     "seq": 86,
     "text": "In my test, a four-inch candle of that width burned down to the rags in two hours and forty minutes, or forty minutes to the inch.",
     "voice": "inspector"
    },
    {
     "seq": 87,
     "text": "If the fire began at about a quarter past eleven, the candle must have been lit around half past eight.",
     "voice": "inspector"
    },
    {
     "seq": 88,
     "text": "Both Tobias Wren and Mr. Bax swore that Silas Brandt had stood at the gate at eight and had then walked straight down the hill to the Anchor Inn.",
     "voice": "witness"
    },
    {
     "seq": 89,
     "text": "Mrs. Pell added that Brandt had reached her door at a quarter past eight with wet boots and no coat, and that she had served him herself.",
     "voice": "witness"
    },
    {
     "seq": 90,
     "text": "At half past eight, therefore, Silas Brandt was half a mile away in a crowded inn and could not have lit any candle.",
     "voice": "inspector"
    },
    {
     "seq": 91,
     "text": "The candles in Brandt’s lodgings, the county analyst reported, were ordinary white tallow, while the wax in the tin lid was pure beeswax.",
     "voice": "report"
    },
    {
     "seq": 92,
     "text": "Captain Dunmore, eager to prove his honesty in at least one matter, handed me a bundle of wharf receipts signed by Nora Tallis.",
     "voice": "inspector"
    },
    {
     "seq": 93,
     "text": "The receipts in Captain Dunmore’s bundle, Mr. Quill found, showed larger payments than those in the ledger copy that the wharf had filed with the insurers in September.",
     "voice": "report"
    },
    {
     "seq": 94,
     "text": "The difference between the ledger and the receipts, Mr. Quill calculated, came to nearly four hundred pounds over two years.",
     "voice": "report"
    },
    {
     "seq": 95,
     "text": "Either the clerk who wrote the receipts or the owner who signed the ledger every month had pocketed the missing money, and the audit was due on Monday.",
     "voice": "inspector"
    },
    {
     "seq": 96,
     "text": "Mr. Hallam swore that he had trusted Miss Tallis completely, had never read the figures he signed, and had not seen his loft key since October.",
     "voice": "witness"
    }
   ]
  },
  {
   "n": 9,
   "title": "The Chandler’s Receipt",
   "summary": "A chandler remembers two beeswax candles, the clerk’s explanations fall apart, and one careless sentence gives her away.",
   "statements": [
    {
     "seq": 97,
     "text": "Every shop in Hallam Wharf, I decided, would be asked whether anyone had bought beeswax candles lately, because the wax was my best clue.",
     "voice": "inspector"
    },
    {
     "seq": 98,
     "text": "Mr. Joseph Larkin, the chandler on Anchor Street, remembered selling two thick beeswax candles on Thursday evening, the only ones he had sold all year.",
     "voice": "witness"
    },
    {
     "seq": 99,
     "text": "The buyer, according to Mr. Larkin, was a young woman with ink-stained fingers who said the candles were for the chapel.",
     "voice": "witness"
    },
    {
     "seq": 100,
     "text": "The lamps in the chapel hall, I learned from its caretaker, had been electric since the spring, and no candles had been ordered all year.",
     "voice": "inspector"
    },
    {
     "seq": 101,
     "text": "A ball of string was my excuse for leading Miss Tallis into the chandler’s shop, where Mr. Larkin pointed straight at her and nodded.",
     "voice": "inspector"
    },
    {
     "seq": 102,
     "text": "Nora Tallis admitted that she had bought the candles for the chapel’s Christmas pageant and said she had left them in a cupboard in the loft.",
     "voice": "witness"
    },
    {
     "seq": 103,
     "text": "Mr. Hallam said that there had been no cupboard in the loft since he tore the old one out three years earlier.",
     "voice": "witness"
    },
    {
     "seq": 104,
     "text": "The key to the iron safe downstairs, Mr. Hallam added, was kept by Miss Tallis alone, and she locked the big ledger inside it every Friday night.",
     "voice": "witness"
    },
    {
     "seq": 105,
     "text": "The iron safe in the ground-floor office, when it was opened on Monday, held the cash box and some stamps but no ledger.",
     "voice": "report"
    },
    {
     "seq": 106,
     "text": "I let Miss Tallis believe that Mr. Hallam was about to be arrested, and I watched her face carefully.",
     "voice": "inspector"
    },
    {
     "seq": 107,
     "text": "Mr. Hallam would never have thought of a candle in a nest of rags, Nora Tallis protested, because he knew nothing about fires.",
     "voice": "witness"
    },
    {
     "seq": 108,
     "text": "I had never spoken of a candle or a nest of rags to anyone outside the fire brigade, and the clerk had just described both.",
     "voice": "inspector"
    }
   ]
  },
  {
   "n": 10,
   "title": "The Candle Burns Down",
   "summary": "Nora Tallis confesses, and Inspector Mercer explains the fraud, the fire and the fates of the suspects.",
   "statements": [
    {
     "seq": 109,
     "text": "Nora Tallis, with her hands shaking, confessed that she had planned the fire for months and signed her statement at dawn.",
     "voice": "witness"
    },
    {
     "seq": 110,
     "text": "The sums in the ledger, which Nora Tallis wrote herself, were smaller than the sums the captains paid at her window, and for two years she kept the difference.",
     "voice": "inspector"
    },
    {
     "seq": 111,
     "text": "Silas Brandt, the foreman, had noticed the missing money and asked questions, so Nora told Mr. Hallam that Brandt was stealing rope.",
     "voice": "inspector"
    },
    {
     "seq": 112,
     "text": "When Nora learned that Mr. Quill would audit the books on Monday, she knew that only a fire could hide the truth.",
     "voice": "inspector"
    },
    {
     "seq": 113,
     "text": "Weeks before the fire, Nora had taken Mr. Hallam’s loft key from his housekeeper’s drawer, hoping to blame him, and on Thursday she bought two beeswax candles.",
     "voice": "inspector"
    },
    {
     "seq": 114,
     "text": "On Friday evening Nora carried the ledger up to the loft, lit a candle in a tin lid at half past eight, and packed oily rags around it.",
     "voice": "inspector"
    },
    {
     "seq": 115,
     "text": "She then chained the ladder behind her and walked to the chapel hall, where thirty people watched her sew pageant costumes until the fire bell rang.",
     "voice": "inspector"
    },
    {
     "seq": 116,
     "text": "At about a quarter past eleven, the flame reached the rags, and the dry boards of the loft floor, which sat above the oil store, caught at once.",
     "voice": "inspector"
    },
    {
     "seq": 117,
     "text": "The tin lid, the wax, and the burn marks, Chief Officer Lowe confirmed in his final report, all matched the Inspector’s account.",
     "voice": "report"
    },
    {
     "seq": 118,
     "text": "The claim from Mr. Hallam, the insurers agreed, would be paid in full, and with the money he cleared his debts and rebuilt Warehouse Four.",
     "voice": "report"
    },
    {
     "seq": 119,
     "text": "Silas Brandt took back his old post as foreman, and Captain Dunmore, fined fifty pounds for his tobacco, sailed on the morning tide.",
     "voice": "report"
    },
    {
     "seq": 120,
     "text": "My apprentice asked how I could be certain, and I answered that a clever plan can survive everything except one careless sentence.",
     "voice": "inspector"
    }
   ]
  }
 ],
 "solution": "Nora Tallis, the wharf clerk, started the fire. For two years she had kept part of the dues that the ship captains paid, and when Mr. Quill announced an audit for Monday she decided that only a fire could destroy the books. At half past eight on the Friday she lit a beeswax candle in a tin lid in the loft, packed oily rags around it, chained the ladder behind her and went to the chapel hall, so that thirty witnesses could swear she was far away when the flame finally reached the rags at about a quarter past eleven. She had hoped to throw the blame on Mr. Hallam by taking his loft key and on Silas Brandt by having him dismissed, but the light that Captain Dunmore saw in the loft, the beeswax candles from Mr. Larkin’s shop, the ledger missing from the safe, and her own slip about the candle and the rags gave her away."
};
