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
      id: 'emerald',
      title: 'The Vanished Emerald',
      brief: 'Lady Ashcombe’s emerald vanished from her locked study during dinner. Four people were in the house, and one of them took it.',
      suspects: [
        { name: 'Mr. Pryce', role: 'the butler', icon: '\uD83C\uDFA9', clue: 2,
          cleared: 'He never left the dining room, and every guest watched him pour.' },
        { name: 'Tobias Wren', role: 'the gardener', icon: '\uD83C\uDF31', clue: 1,
          cleared: 'The window was latched inside and the flowerbed was untouched. Nobody came in from the garden.' },
        { name: 'Miss Cecily Marsh', role: 'the niece', icon: '\uD83D\uDC52', clue: 4,
          cleared: '' },
        { name: 'Colonel Hale', role: 'a dinner guest', icon: '\uD83C\uDF96\uFE0F', clue: 3,
          cleared: 'Lady Ashcombe talked to him from the soup to the pudding. He never left his chair.' }
      ],
      culprit: 2,
      clues: [
        'The study door was locked, and its only key hangs on a hook in the hall.',
        'The study window was latched from the inside, and the flowerbed under it was raked smooth. The gardener never came in that way.',
        'Mr. Pryce never left the dining room. He poured every glass in front of the guests.',
        'Lady Ashcombe talked to Colonel Hale from the soup to the pudding, and he never left his chair.',
        'Miss Marsh left the table to fetch a shawl, and came back without one.'
      ],
      solution: 'Miss Marsh slipped out for a shawl, took the key from the hall, and locked the study again behind her. She owed a London jeweller a fortune and meant to sell the stone.'
    },
    {
      id: 'will',
      title: 'The Forged Will',
      brief: 'Sir Edmund Vane has died, and a new will has turned up in his desk. His doctor swears he could not hold a pen at the date on it. Someone forged it.',
      suspects: [
        { name: 'Mr. Lyle', role: 'the secretary', icon: '\uD83D\uDCDD', clue: 3,
          cleared: 'The real will left him a fortune and the forgery cuts him out. Why would he forge that?' },
        { name: 'Mr. Thorne', role: 'the lawyer', icon: '\u2696\uFE0F', clue: 4,
          cleared: '' },
        { name: 'Mrs. Dobbs', role: 'the housekeeper', icon: '\uD83D\uDDDD\uFE0F', clue: 1,
          cleared: 'She cannot read or write, so she could not have forged a signature.' },
        { name: 'Giles Vane', role: 'the nephew', icon: '\uD83E\uDDF3', clue: 2,
          cleared: 'His ship docked the morning after the death. He was at sea the whole time.' }
      ],
      culprit: 1,
      clues: [
        'The new will is dated 3 March, but Sir Edmund’s doctor says he could not hold a pen after 1 March.',
        'Mrs. Dobbs signs her name with a cross. She has never learned to write.',
        'Giles Vane’s ship docked the morning after Sir Edmund died. He had been at sea for a month.',
        'The real will, signed in January, left Mr. Lyle a fortune. The forged one leaves him nothing at all.',
        'The forged will spells “color” and “honor” the American way. Sir Edmund never did, but Mr. Thorne lived in Boston for ten years.'
      ],
      solution: 'Mr. Thorne had been taking money from Sir Edmund’s accounts. The real will would have sent an auditor through them, so he wrote a new one, and an old habit of spelling gave him away.'
    },
    {
      id: 'meteor',
      title: 'The Silent Stable Dog',
      brief: 'Meteor, the favourite for Saturday’s race, was led out of a locked stable in the night. The stable dog never made a sound.',
      suspects: [
        { name: 'Mr. Aldous Crane', role: 'the trainer', icon: '\uD83D\uDCCB', clue: 4,
          cleared: '' },
        { name: 'Sir Roland Pike', role: 'a rival owner', icon: '\uD83C\uDFC7', clue: 1,
          cleared: 'The dog barks at every stranger, and it stayed silent. The thief was someone it knew.' },
        { name: 'Silas Marrow', role: 'the head groom', icon: '\uD83D\uDC34', clue: 3,
          cleared: 'Forty people saw him at the inn until closing time.' },
        { name: 'Ned Cobb', role: 'the stable boy', icon: '\uD83E\uDDE2', clue: 2,
          cleared: 'Only two keys open the gate, and Ned has neither one.' }
      ],
      culprit: 0,
      clues: [
        'The gate was not forced, and the stable dog did not bark. It barks at every stranger who comes near.',
        'A stranger would have set the dog barking, and a rival owner like Sir Roland is a stranger to it. It stayed silent.',
        'Only two keys open the stable gate. The head groom has one and the trainer the other, so the stable boy has none.',
        'Silas Marrow was at the village inn until closing time. Forty people saw him there.',
        'Mr. Crane had bet his savings that Meteor would not win on Saturday.'
      ],
      solution: 'Mr. Crane walked the horse out with his own key, and the dog knew him too well to bark. He hid Meteor in an old quarry until the race was over, so that his bet would win.'
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
