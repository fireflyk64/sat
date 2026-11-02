/*
 * The items a long Focus streak can win. Each is a timed physics break (see js/playground.js).
 * Deploying one counts as playing: it spends a freeze if there is one, otherwise it costs a little Focus.
 */
(function (root) {
  'use strict';
  root.REWARDS = {
    flood:     { tier: 'bonus', name: 'Marble Flood',  icon: '🔮', secs: 45, how: 'Hold to pour marbles', blurb: 'Pour a hundred marbles anywhere you like and watch them rattle through everything.' },
    tnt:       { tier: 'bonus', name: 'TNT Crate',     icon: '🧨', secs: 45, how: 'Tap to drop TNT', blurb: 'A dozen crates to drop wherever you want. They set each other off.' },
    wrecker:   { tier: 'bonus', name: 'Wrecking Fist', icon: '🥊', secs: 45, how: 'Hold and drag the ball', blurb: 'A giant ball that follows your finger through the machine.' },
    sand:      { tier: 'rare',  name: 'Neon Sand',     icon: '⏳', secs: 75, how: 'Hold to pour sand', blurb: 'Pour glowing sand over the machine. It heaps on the ramps, and a big enough pile topples dominoes.' },
    moon:      { tier: 'rare',  name: 'Moon Gravity',  icon: '🌙', secs: 75, how: 'Tap to blast things upward', blurb: 'Gravity drops to almost nothing. Everything drifts, and every tap sends it floating.' },
    magnet:    { tier: 'rare',  name: 'Super Magnet',  icon: '🧲', secs: 75, how: 'Hold to pull, let go to blast', blurb: 'Drag the whole machine into a ball, rip the ramps loose, then let go.' },
    blackhole: { tier: 'rare',  name: 'Black Hole',    icon: '🕳️', secs: 75, wide: true, how: 'Hold and drag the black hole', blurb: 'It bends the light, swallows the machine piece by piece, and ends with a big bang.' },
    meteors:   { tier: 'rare',  name: 'Meteor Storm',  icon: '☄️', secs: 75, wide: true, how: 'Tap to call down a meteor', blurb: 'Burning rocks rain down on your machine, and you get to aim a few of them.' },
    colossus:  { tier: 'rare',  name: 'The Colossus',  icon: '🗿', secs: 75, wide: true, how: 'Tap to drop a giant domino', blurb: 'Golden dominoes twenty times normal size crash through the machine and knock each other over.' },
    house:     { tier: 'rare',  name: 'Domino House',  icon: '🏠', secs: 90, wide: true, how: 'Tap to build a house, then tap beside it to roll a ball in', blurb: 'Set down a three-storey house of dominoes and slabs, then roll wrecking balls into it and watch it come apart.' },
    flip:      { tier: 'ultra', name: 'Upside Down',   icon: '🙃', secs: 90, wide: true, how: 'Tap to flip gravity', blurb: 'Everything in the machine falls up. Then down. Then up. You decide when, and the ramps start to give way.' },
    architect: { tier: 'ultra', name: 'The Architect', icon: '📐', secs: 120, wide: true, how: 'Tap to add or remove a piece · hold to roll a ball in', blurb: 'Design your own house, storey by storey, out of dominoes and slabs. Then hold to roll a wrecking ball in and bring it down.' },
    rewind:    { tier: 'ultra', name: 'Rewind',        icon: '⏪', secs: 90, fresh: true, how: 'Hold to rewind time, let go to play it forward', blurb: 'The whole machine runs. Then you take hold of time itself: dominoes leap back up and marbles roll uphill.' }
  };
})(typeof window !== 'undefined' ? window : globalThis);
