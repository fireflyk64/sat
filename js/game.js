/*
 * Game glue. The loop:
 *
 *   right answer -> a random physics toy slots into a random gap in the machine (and the dominoes stand back up)
 *   flick the marble just above it -> the chain runs through the toy and everything below it, down to the bell
 *   enough toys -> the machine is complete: it resets and you run the whole thing in one go, for the finale
 *
 * No right answer, no flick: everything you can do in the machine has to be earned.
 * Missed questions become cold cases (see js/progress.js) and pay out double when solved.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var bank = window.SAT_QUESTIONS || [];
  var params = new URLSearchParams(location.search);
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var progress = new Progress();
  var world, track, renderer;
  var MAX_PULL = 5, BASE_SPEED = 1.3, CALM_AT_FOCUS = 5;
  var TIERS = [
    { at: 0,  skin: 'plain',  name: 'Marble',        mult: 1 },
    { at: 3,  skin: 'fire',   name: 'Fire Marble',   mult: 2 },
    { at: 5,  skin: 'plasma', name: 'Plasma Marble', mult: 3 },
    { at: 8,  skin: 'prism',  name: 'Prism Marble',  mult: 4 },
    { at: 12, skin: 'nova',   name: 'Nova Marble',   mult: 5 }
  ];
  // storylines that open with total right answers (the numbers live in Progress.STORY_UNLOCK)
  var STORIES = {
    fire:      { icon: '\ud83d\udd25', title: 'The Fire at Hallam Wharf', blurb: 'New grammar cases: strip a sentence to its core, agreement, and the faults that trip up young writers' },
    water:     { icon: '\ud83c\udf0a', title: 'The Water Section', blurb: 'A real test section: 27 questions, no feedback until the end, and a clock that only counts up' },
    breakable: { icon: '\ud83e\uddf1', title: 'The Grab Bag', blurb: 'Hard grammar and vocabulary in one bag' }
  };
  var RANKS = [[0, 'Constable'], [10, 'Sergeant'], [30, 'Inspector'], [70, 'Chief Inspector'], [150, 'Superintendent'], [300, 'Little Grey Cells']];

  var state = {
    current: null, ctrl: null, answered: false, last: null,
    running: false, runScore: 0, chain: 0, pegs: 0,
    queued: 0, focus: null, focusUntil: 0, readyAt: 0,
    aim: null, pointer: null, gold: false, fast: false,
    phase: 'play', finaleUntil: 0,
    view: 'study',     // on a phone the questions and the machine take turns on screen
    brk: null, unrevealed: {}, picked: null, hover: false,
    sinceBreak: 0, grand: false, cleared: [], newClues: 0, newStatements: 0, lastStatement: 0, sect: null, solved: null, clueDue: null,     // the story: the machine's last run is under way / who it has cleared / clues not yet read
  };

  function tierFor(streak) { var t = TIERS[0]; TIERS.forEach(function (x) { if (streak >= x.at) t = x; }); return t; }
  function nextTier(streak) { return TIERS.filter(function (x) { return x.at > streak; })[0] || null; }
  function rankFor(total) { var r = RANKS[0][1]; RANKS.forEach(function (x) { if (total >= x[0]) r = x[1]; }); return r; }
  function nowS() { return performance.now() / 1000; }
  /** The flick prompt only animates when it will not break his concentration: Focus is low, or the mouse is on the play window. */
  function promptPulses() { return state.hover || progress.store.focus.count < CALM_AT_FOCUS; }

  // ---------------------------------------------------------------- building
  // An early unlock: after this many right answers, a marble that has been handed on stays where it was instead of fading away.
  var KEEP_MARBLES_AT = 12;
  function keepOn() { return progress.store.total >= KEEP_MARBLES_AT; }
  /** Hook the machine up to the unlocks that need it: where retired marbles are remembered, so they survive the machine growing. */
  function wireTrack() {
    track.keepMarbles = keepOn();
    track.onKeep = function (m) {
      var sec = track.sections[m.userData.section];
      if (!sec || !sec.exit) return;
      var mm = machine(), list = mm.kept || (mm.kept = []);
      list.push({ pid: sec.id, dx: +(m.x - sec.exit.x).toFixed(2), dy: +(m.y - sec.exit.y).toFixed(2), hue: m.userData.hue | 0 });
      if (list.length > 24) list.shift();
      progress.save();
    };
  }
  function machine() { return progress.machine(); }

  function rebuild(opts) {
    opts = opts || {};
    var snap = renderer.snapshot(track);
    world = new Phys.World();
    track = new Track(world, machine(), { emit: onEvent, now: nowS() }); wireTrack();
    renderer.setTheme(progress.store.cases);
    renderer.tweenFrom(track, snap, nowS(), { fresh: opts.fresh });
    renderer.trails = {};
    state.readyAt = nowS() + (opts.fresh ? 1.4 : 1.0);
    state.running = false; state.aim = null; state.pointer = null;
    Sound.resetNotes();
    var m = machine();
    if (m.playFrom !== null && track.sections[m.playFrom]) track.placeStars(m.playFrom);
    updateHud();
  }

  /** The marble that is waiting to be flicked, if a right answer has earned one. */
  function flickable() {
    var m = machine();
    return m.playFrom === null || m.spent || state.running || state.brk ? null : track.marbleFor(m.playFrom);
  }
  function restingMarble() { return flickable() || (track ? track.marbleFor(machine().playFrom || 0) : null); }
  function canFlick() { return !!flickable() && nowS() >= state.readyAt && state.phase !== 'finale'; }

  /** A right answer: bolt on one random toy. */
  function slotOne(forceKind) {
    var res = progress.slotPiece(Track.KINDS, forceKind);
    if (!res) return null;
    var label = Track.KINDS[res.piece.kind];
    announce('🧩 ' + label.label + ' slots in', label.blurb);
    return res;
  }

  function award(q, res) {
    if (q.story === 'fire' && fireStory()) {
      var nowFound = fireFoundSet(), had = fireFound || {};
      if (!had[q.seq] && nowFound[q.seq]) {
        var line = null; fireStory().chapters.forEach(function (c) { c.statements.forEach(function (s) { if (s.seq === q.seq) line = s.text; }); });
        if ($('dossierBody').hidden) state.newStatements++;
        state.lastStatement = q.seq; dossierKey = '';
        if (line) setTimeout(function () { toast('\ud83d\udd25 Statement ' + q.seq + ' added to the case file: \u201c' + line + '\u201d', 7000); }, 1800);     // (a toast, so it does not fight the clue's announcement over the machine)
      }
      fireFound = nowFound;
    }
    if (progress.store.total === KEEP_MARBLES_AT) { track.keepMarbles = true; setTimeout(function () { Sound.unlock(); banner('MARBLES STAY', 'Marbles you hand on now rest on the machine', 'cool'); }, 1200); }
    var opened = progress.storyJustOpened(bank);
    if (opened.length) {
      var st = STORIES[opened[0]];
      setTimeout(function () { Sound.unlock(); banner(st.icon + ' NEW STORYLINE', st.title, 'hot'); announce(st.icon + ' ' + st.title, st.blurb, 8000); }, 1600);
    }
    var unlocked = progress.justUnlocked(Track.KINDS);
    if (unlocked.length) { Sound.unlock(); setTimeout(function () { banner('NEW TOY UNLOCKED', Track.KINDS[unlocked[0]].label, 'gold'); }, 300); }

    var extra = 0;
    if (res.wasCold) { state.gold = true; extra++; }
    if (res.streak && res.streak % 5 === 0) extra++;
    var toSlot = 1 + extra;

    var tNow = tierFor(res.streak), tPrev = tierFor(res.streak - 1);
    if (tNow !== tPrev) { Sound.tierUp(); setTimeout(function () { banner(res.streak + ' IN A ROW!', tNow.name + ' · score ×' + tNow.mult, 'hot'); }, 150); }
    renderer.heatTarget = Math.min(1, res.streak / 12);

    if (state.running || state.brk || state.phase === 'finale') { state.queued += toSlot; toast('🧩 New toy queued: it slots in when this run ends'); updateHud(); return; }
    placeQueued(toSlot, unlocked[0]);
  }

  function placeQueued(n, forceFirst) {
    var last = null, had = cluesFound();
    for (var i = 0; i < n; i++) {
      var r = slotOne(i === 0 ? forceFirst : null);
      if (r) last = r;
    }
    if (!last) { updateHud(); return; }
    Sound.slot();
    rebuild({});
    var sec = track.sections[last.slot];
    if (sec) {
      var ramp = sec.ramps[0];
      state.focus = { x: (ramp.x + ramp.lowX) / 2, y: (ramp.y + ramp.lowY) / 2 + 2, fast: false, zoom: 0.88 };
      state.focusUntil = nowS() + 1.7;
      renderer.cam.follow = true;
    }
    if (last.complete) toast('🏁 Last piece in! Run it to the bell to finish the machine.');
    foundClues(had, cluesFound());
    orbToMachine();
  }

  /** A glowing orb flies from the answer panel into the machine: the right answer visibly powers the game. */
  function orbToMachine() {
    if (reduced || stageHidden()) return;
    try {
      var from = $('verdict').getBoundingClientRect(), cv = renderer.canvas.getBoundingClientRect();
      var orb = document.createElement('div'); orb.className = 'orb'; document.body.appendChild(orb);
      var x1 = cv.left + cv.width / 2, y1 = cv.top + cv.height * 0.55;
      orb.animate([
        { transform: 'translate(' + (from.left + 60) + 'px,' + (from.top + 10) + 'px) scale(.5)', opacity: 0.4 },
        { transform: 'translate(' + ((from.left + x1) / 2) + 'px,' + (Math.min(from.top, y1) - 90) + 'px) scale(1.4)', opacity: 1, offset: 0.55 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.3)', opacity: 0.9 }
      ], { duration: 620, easing: 'cubic-bezier(.3,.7,.3,1)' }).onfinish = function () {
        orb.remove();
        var w = renderer.screenToWorld(cv.width / 2, cv.height * 0.55);
        renderer.sparks(w.x, w.y, 40, renderer.theme.hue, 8);
        renderer.ring(w.x, w.y, 3.2, 1.5, 2.4, 3, 0.4, 0.1);
        renderer.fx.flash = Math.max(renderer.fx.flash, 0.05);
      };
    } catch (e) { /* older browsers just skip the flourish */ }
  }

  // ---------------------------------------------------------------- flicking
  function beginRun(vx, vy) {
    var m = machine(), from = m.playFrom;
    Sound.init();
    // flicking is playing. A retry after a flick that missed the machine is free.
    // The flick is spent and saved BEFORE the game plays, so reloading mid-run cannot win a second free play. A flick that missed the
    // machine is the one exception: it was never played, so the retry is free, and that too is saved.
    if (m.retry) m.retry = false; else showPlayResult(progress.notePlay());
    m.spent = true; progress.save();
    renderer.skin = state.gold ? 'gold' : tierFor(progress.store.streak).skin;
    var run = track.startRun(from, vx, vy);
    if (!run) return;
    state.running = true; state.runScore = 0; state.chain = 0; state.pegs = 0;
    if (m.complete && from === 0) startSuspects();
    Sound.resetNotes();
    Sound.flick(Math.min(1, Math.hypot(vx, vy) / Track.FLICK_MAX));
    renderer.cam.follow = true; renderer.cam.zoomGoal = null;
    state.focus = null;
    renderer.sparks(run.marble.x, run.marble.y, 26, renderer.theme.hue, 7);
    renderer.ring(run.marble.x, run.marble.y, 2.8, 0.8, 2, 2.6, 0.4, 0.1);
    updateHud();
    showChain();
  }

  function multiplier(run) {
    return tierFor(progress.store.streak).mult * (renderer.skin === 'gold' ? 3 : 1) * ((run && run.multiplier) || 1);
  }
  function score(points, x, y, opts) {
    opts = opts || {};
    var run = track.run, n = points * multiplier(run);
    state.runScore += n;
    if (x != null) renderer.float((opts.prefix || '') + '+' + n, x, y, opts.size || 0.62, opts.color);
    $('score').textContent = (progress.store.score + state.runScore).toLocaleString();
  }

  // ---------------------------------------------------------------- what the machine reports
  function onEvent(type, d) {
    if (type === 'impact') {
      var imp = d.imp, m = d.marble, other = m ? (d.a === m ? d.b : d.a) : null, oKind = other && other.userData ? other.userData.kind : '';
      if (m && !m.userData.small) {
        if (oKind === 'peg') {
          Sound.peg(state.pegs++);
          score(5, d.x, d.y - 0.5, { size: 0.42 });
          renderer.sparks(d.x, d.y, 14, track.sections[other.userData.section].hue + 40, 5);
        } else if (imp > 2.2) {
          Sound.thud(imp);
          renderer.sparks(d.x, d.y, Math.min(26, 4 + imp | 0), m.userData.hue, 2.5 + Math.min(4, imp * 0.2));
          if (imp > 12) renderer.kick(Math.min(0.9, imp * 0.03));
        }
      } else if (m && imp > 0.8 && Math.random() < 0.3) { Sound.click(0.25); }
      if (!m && imp > 0.12) {
        var dm = d.a.userData && d.a.userData.kind === 'domino' ? d.a : d.b.userData && d.b.userData.kind === 'domino' ? d.b : null;
        if (dm && imp > 0.2) renderer.sparks(d.x, d.y, 3, dm.userData.hue, 2.2, { up: 0.5, hot: 2 });
      }
    } else if (type === 'domino') {
      state.chain++;
      Sound.domino();
      var u = d.d.userData;
      renderer.sparks(d.d.x, d.d.y + 0.2, 7, u.hue, 3.4, { hot: 2.5 });
      score(10);
      if (state.chain % 10 === 0) { renderer.float('CHAIN ' + state.chain, d.d.x, d.d.y - 1.4, 0.8, [2.4, 2.2, 1]); }
      showChain();
    } else if (type === 'kick') {
      if (d.role === 'relay' || d.role === 'kicker' || d.role === 'passenger') {
        Sound.kick();
        renderer.ring(d.m.x, d.m.y, 2, 2.4, 2, 0.9, 0.35, 0.1);
        score(25, d.m.x, d.m.y - 1.1, { color: [1.2, 2.3, 2.6], size: 0.6 });
      }
    } else if (type === 'section') {
      d.sec.litT = track.time;
      if (state.grand) checkClears();
    } else if (type === 'toy') {
      onToy(d);
    } else if (type === 'star') {
      Sound.star(d.n);
      renderer.sparks(d.x, d.y, 34, 45, 8, { rgb: [1, 0.8, 0.3], hot: 2.6 });
      renderer.ring(d.x, d.y, 2.8, 3, 2.4, 0.9, 0.4, 0.1);
      renderer.float('STAR! ×' + d.run.multiplier, d.x, d.y - 0.9, 0.8, [3, 2.5, 0.8]);
    } else if (type === 'nudge') {
      renderer.sparks(d.x, d.y, 12, 190, 4);
    } else if (type === 'lost') {
      state.running = false;
      if (state.brk) return;
      if (state.grand) hideSuspects();
      machine().retry = true; machine().spent = false; progress.save();
      renderer.trails = {};
      renderer.sparks(d.x, d.y, 30, 190, 5);
      toast('Missed the machine! The marble is back. Flick again.');
      Sound.pop();
      track.placeStars(machine().playFrom);
      updateHud();
    } else if (type === 'bell') {
      onBell(d);
    }
  }

  function onToy(d) {
    var s = d.sec;
    if (d.what === 'launch') {
      Sound.launch(); renderer.kick(0.8); renderer.sparks(d.x, d.y, 26, s.hue, 8);
      renderer.ring(d.x, d.y, 3, 2.6, 2, 1, 0.35, 0.1);
      score(50, d.x, d.y - 1.1, { color: [2.5, 2.3, 1] });
    } else if (d.what === 'ignite') {
      Sound.ignite(); renderer.kick(0.4); renderer.sparks(d.x, d.y, 22, 28, 4);
      renderer.ring(d.x, d.y, 2.2, 2.6, 1.4, 0.6, 0.3, 0.1);
      score(50, d.x, d.y - 1.1, { color: [2.8, 1.6, 0.6] });
    } else if (d.what === 'drop') {
      Sound.snap(); renderer.kick(0.6); renderer.sparks(d.x, d.y - 1.2, 18, 28, 5);
    } else if (d.what === 'pour') {
      Sound.pour(); renderer.kick(0.5); renderer.sparks(d.x, d.y + 0.4, 26, 42, 4);
      renderer.ring(d.x, d.y + 0.2, 2.6, 2.2, 1.8, 0.9, 0.35, 0.1);
      score(50, d.x, d.y - 1.1, { color: [2.5, 2.1, 0.9] });
    } else if (d.what === 'bounce') {
      Sound.bounce(); renderer.kick(0.5);
      renderer.ring(d.x, d.y, 3.6, 0.5, 3, 1.5, 0.4, 0.1);
      renderer.sparks(d.x, d.y, 30, 150, 8, { up: 4 });
      score(50, d.x, d.y - 1.3, { color: [1, 3, 1.6] });
    } else if (d.what === 'swing') {
      Sound.swing();
      score(50, d.x, d.y - 1, { color: [2.2, 2, 2.4] });
    } else if (d.what === 'charge') {
      Sound.charge();
    } else if (d.what === 'boom') {
      Sound.boom(d.power);
      renderer.boom(d.x, d.y, d.power === 2 ? 1.25 : 0.65);
      if (d.power === 2) { state.hitStop = 0.09; state.slowUntil = nowS() + 0.5; }
      score(d.power === 2 ? 200 : 100, d.x, d.y - 1.6, { size: 0.9, color: [3, 1.8, 0.6] });
    } else if (d.what === 'portal') {
      Sound.warp();
      renderer.ring(d.x, d.y, 3, 1.6, 0.8, 3, 0.4, 0.1);
      renderer.ring(d.x2, d.y2, 3, 1.6, 0.8, 3, 0.45, 0.1);
      renderer.sparks(d.x, d.y, 26, s.hue, 6); renderer.sparks(d.x2, d.y2, 26, s.hue + 130, 6);
      if (!reduced) { renderer.fx.wave(d.x2, d.y2, 0.4, 0.5, 0.6); renderer.fx.ca = Math.max(renderer.fx.ca, 1.6); }
      score(75, d.x2, d.y2 - 1.4, { color: [2, 1.2, 3] });
    } else if (d.what === 'gate') {
      Sound.gate();
      renderer.sparks(d.x, d.y, 24, 50, 6);
      score(75, d.x, d.y - 2, { color: [3, 2.5, 0.8] });
    } else if (d.what === 'click') {
      Sound.click(d.amp);
      renderer.sparks(d.x, d.y, 3, 200, 2, { rgb: [0.8, 0.9, 1], up: 0.3 });
    }
  }

  function onBell(d) {
    if (state.brk) {            // during a break the bell is just one more thing to hit
      Sound.bell(false); renderer.ring(d.x, d.y, 5, 3, 2.2, 0.9, 0.7, 0.07);
      track.bell.rung = -9;
      return;
    }
    var run = d.run, m = machine();
    state.running = false;
    var complete = m.complete, wasGrand = complete && run && run.from === 0;
    score(wasGrand ? 500 : 100, d.x, d.y - 2.2, { size: 1, color: [3, 2.4, 0.8] });
    Sound[wasGrand ? 'finale' : 'bell'](false);
    renderer.ring(d.x, d.y, 5, 3, 2.2, 0.9, 0.7, 0.07);
    renderer.ring(d.x, d.y, 8, 1.5, 1.2, 0.6, 1.0, 0.04);
    renderer.sparks(d.x, d.y, 60, 45, 8, { rgb: [1, 0.8, 0.3], hot: 2.6 });
    renderer.lamp(d.x, d.y, 1.3, 0.9, 0.3, 1.6, 1.6, 0.05);
    if (!reduced) renderer.fx.wave(d.x, d.y, 0.35, 0.5, 0.9);

    var earned = state.runScore;
    progress.bankScore(earned);
    state.gold = false;
    state.runScore = 0;
    hideChainSoon();

    if (wasGrand) { finale(d, earned, run); return; }

    banner('+' + earned.toLocaleString(), state.chain + ' dominoes down', 'cool');
    if (complete) {
      // that was the last piece: reset the whole machine and hand over the big flick
      m.playFrom = 0; m.spent = false; progress.save();
      setTimeout(function () {
        banner('MACHINE COMPLETE', 'Now run the whole thing!', 'gold');
        Sound.unlock();
        rebuild({});
        state.focus = null; renderer.cam.follow = true;
        renderer.fit(track);
        setTimeout(function () { renderer.cam.zoomGoal = null; renderer.cam.follow = true; }, 1900);
      }, 1700);
    } else {
      m.playFrom = null; m.spent = false; m.retry = false; progress.save();
      if (state.queued) {
        var n = state.queued; state.queued = 0;
        setTimeout(function () { placeQueued(n); }, 1200);
      }
    }
    if (state.clueDue) setTimeout(showDueClue, 1500);
    // played: after a moment the machine goes away again and he is back with the questions (a Back button is there sooner)
    if (!phoneNow() && !params.has('stay')) setTimeout(function () { if (state.view === 'machine' && !state.running && state.phase !== 'finale' && !state.brk) setView('study'); }, 3400);
    updateHud();
  }

  /** The whole machine has run, top to bottom, in one go. Everything goes off. */
  function finale(d, earned, run) {
    state.phase = 'finale';
    state.finaleUntil = nowS() + 9;
    state.slowUntil = nowS() + 1.6;
    renderer.heatTarget = 1;
    var my = state.solved = mystery();
    checkClears();                                   // the front has reached the bell, so every innocent suspect is cleared
    var cases = ++progress.store.cases;
    var doms = 0; track.sections.forEach(function (s) { doms += s.dominoes.length; });
    var secs = Math.round(track.time - run.t0);
    progress.save();

    // pull right back to admire it, and run a wave of light from the top of the machine to the bottom
    renderer.fit(track);
    renderer.wash = { t: track.time + 1.1, gap: 0.26 };
    track.sections.forEach(function (s, i) { setTimeout(function () { s.litT = track.time; }, 1100 + i * 260); });

    var b = track.bounds(), cx = (b.minX + b.maxX) / 2, spanX = Math.max(16, b.maxX - b.minX), topY = b.minY + (b.maxY - b.minY) * 0.3;
    var hues = [renderer.theme.hue, renderer.theme.hue + 60, 45, 190, 330, 120];
    for (var i = 0; i < 16; i++) {
      renderer.rocket(cx + (Math.random() - 0.5) * spanX, topY + Math.random() * (b.maxY - b.minY) * 0.5, hues[i % hues.length] + Math.random() * 30, 0.5 + i * 0.28, i % 5 === 0);
    }
    renderer.onBurst = function (big) { if (Sound.ctx && !Sound.muted) Sound.noise(big ? 0.5 : 0.25, big ? 0.16 : 0.08, 3500, 0, 500); };
    renderer.confetti(cx, b.minY + 2, reduced ? 80 : 320, spanX);
    setTimeout(function () { renderer.confetti(cx, b.minY + 2, reduced ? 0 : 260, spanX); }, 1300);
    if (!reduced) { renderer.fx.flash = 0.06; renderer.fx.ca = 2; }

    showFinale({ score: earned, doms: doms, toys: track.sections.length, secs: secs, cases: cases, mystery: my });
    if (my) {
      setTimeout(function () { if (state.phase !== 'finale') return; Sound.guilty(); paintSuspects(true); mysteryKey = ''; renderMystery(); }, 1500);
    }
    updateHud();
  }

  function endFinale() {
    if (state.phase !== 'finale') return;
    state.phase = 'play';
    if (narrowNow()) setView('study');
    renderer.wash = null;
    $('finale').classList.remove('show');
    state.solved = null; state.newClues = 0; state.clueDue = null;
    hideSuspects();
    var carry = machine().pending;
    renderer.heatTarget = Math.min(1, progress.store.streak / 12);
    progress.newMachine(0);
    renderer.cam.zoomGoal = null; renderer.cam.follow = true;
    renderer.floats = []; renderer.rings = []; renderer.rockets = [];
    rebuild({ fresh: true });
    introMystery();
    var n = carry + state.queued; state.queued = 0;
    if (n > 0) setTimeout(function () { placeQueued(n); }, 900);
    updateHud();
  }

  // ---------------------------------------------------------------- HUD
  var toastTimer = 0, bannerTimer = 0, announceTimer = 0, chainTimer = 0;
  function toast(msg, ms) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 3200);
    studyNote(msg, '', ms || 3200);
  }
  function banner(big, small, style) {
    var b = $('banner');
    b.className = 'banner';
    void b.offsetWidth;                 // restart the pop animation
    $('bannerBig').textContent = big; $('bannerSmall').textContent = small || '';
    b.classList.add('show', style || 'cool');
    clearTimeout(bannerTimer); bannerTimer = setTimeout(function () { b.classList.remove('show'); }, 2200);
    studyNote(big, small, 2800);
  }
  function announce(title, blurb, ms) {
    var a = $('announce');
    $('announceTitle').textContent = title; $('announceBlurb').textContent = blurb || '';
    a.classList.add('show');
    clearTimeout(announceTimer); announceTimer = setTimeout(function () { a.classList.remove('show'); }, ms || 3400);
    studyNote(title, blurb, Math.min(ms || 3400, 6500));
  }

  // ---------------------------------------------------------------- phone: the questions and the machine take turns
  // The two-view layout (the questions fill the screen, the machine is out of sight) is used at every width. On a phone a tab bar swaps
  // between them freely; on a bigger screen there is no tab bar: the machine stays away for a run of questions, then a Play button
  // appears, and when he has played the machine goes away again, so he is not turning to look at it while he studies.
  var narrowQuery = window.matchMedia ? window.matchMedia('(max-width: 860px)') : null;
  // Questions to answer before the machine opens: 5 at first, rising with his Focus to a solid 12 at 100, since the more Focus he holds the more a careless play can cost.
  function studyBefore() { var f = Math.min(100, Math.max(0, progress.store.focus.count || 0)); return Math.round(5 + 7 * f / 100); }
  function phoneNow() { return !!(narrowQuery && narrowQuery.matches); }
  function narrowNow() { return true; }
  /** Has he studied enough for a turn at the machine? (On a phone the tab is always there.) */
  function playReady() { return phoneNow() || state.sinceBreak >= studyBefore(); }
  /** True when the machine's screen is not the one on show: a phone, on the questions tab. */
  function stageHidden() { return narrowNow() && state.view === 'study'; }
  function setView(v) {
    if (v === state.view) return;
    state.view = v;
    if (v === 'machine') state.sinceBreak = 0;
    $('app').classList.toggle('view-study', v === 'study');
    $('app').classList.toggle('view-machine', v === 'machine');
    $('tabStudy').setAttribute('aria-pressed', v === 'study');
    $('tabMachine').setAttribute('aria-pressed', v === 'machine');
    if (v === 'machine') {
      // arrive looking at the marble that is ready to flick, or at the whole machine if there is none
      if (!state.running && !state.brk && state.phase !== 'finale') { try { (flickable() ? $('follow') : $('fit')).click(); } catch (e) { /* cosmetic */ } }
    } else {
      document.querySelector('.panel').scrollTop = 0;
    }
    updateHud();
  }
  var noteTimer = 0;
  /** With the machine out of sight, what it would have announced is said over the questions instead. */
  function studyNote(title, text, ms) {
    var n = $('studynote');
    if (!n || !stageHidden() || !title) return;
    n.textContent = '';
    var b = document.createElement('b'); b.textContent = title; n.appendChild(b);
    if (text) n.appendChild(document.createTextNode(text));
    n.classList.add('show');
    clearTimeout(noteTimer); noteTimer = setTimeout(function () { n.classList.remove('show'); }, ms || 3600);
  }

  // ---------------------------------------------------------------- the Water Section: a traditional test section
  // 27 multiple-choice questions with no feedback until the end. The clock only counts up and the suggested finish is a guide: time
  // is never passed to the scoring or the recording below, so it cannot cost him anything, and the clock can be hidden.
  var bankIndex = null, sectTimer = 0, CLOCK_KEY = 'sat-section-clock-hidden';
  function qById(id) { if (!bankIndex) { bankIndex = {}; bank.forEach(function (q) { bankIndex[q.id] = q; }); } return bankIndex[id]; }
  function sectionOpen() { return function (q) { return !q.story || progress.storyOpen(q.story); }; }
  function clockHidden() { try { return localStorage.getItem(CLOCK_KEY) === '1'; } catch (e) { return false; } }
  function setClockHidden(v) { try { localStorage.setItem(CLOCK_KEY, v ? '1' : '0'); } catch (e) { /* optional */ } }

  function renderSectionStrip() {
    var box = $('sectionStrip');
    if (!window.Section || !progress.storyOpen('water')) { box.hidden = true; return; }
    box.hidden = false;
    var saved = progress.store.section, log = progress.store.sections || [];
    var answered = saved ? saved.answers.filter(function (a) { return a != null; }).length : 0;
    $('sectionCount').textContent = state.sect ? 'in progress' : saved ? 'in progress: ' + answered + ' of ' + saved.ids.length + ' answered' : log.length ? 'last: ' + log[0].right + ' / ' + log[0].total : '27 questions';
    $('sectionCount').classList.toggle('fresh', !!saved);
    $('sectionGo').textContent = saved ? 'Resume your section' : 'Start a section';
    $('sectionGo').disabled = !!state.sect || state.running || !!state.brk || state.phase === 'finale';
    $('sectionLast').textContent = log.length ? 'Last time: ' + log[0].right + ' of ' + log[0].total + (log[0].secs && !clockHidden() ? ' in ' + Section.clock(log[0].secs) : '') + '.' + (log.length > 1 ? ' Before that: ' + log.slice(1, 4).map(function (e) { return e.right + '/' + e.total; }).join(', ') + '.' : '') : '';
  }

  function saveSection() {
    var S = state.sect;
    if (S && S.view !== 'results') progress.sectionSave({ ids: S.qs.map(function (q) { return q.id; }), answers: S.answers, elapsed: S.elapsed, i: S.i });
  }
  function updateSectionClock() {
    var S = state.sect; if (!S) return;
    var hid = clockHidden();
    $('sClock').parentNode.hidden = hid; $('sFill').parentNode.hidden = hid;
    $('sHide').textContent = hid ? 'Show clock' : 'Hide clock';
    $('sClock').textContent = Section.clock(S.elapsed);
    $('sSuggest').textContent = 'suggested finish ' + Section.clock(Section.SUGGESTED);
    $('sFill').style.width = Math.min(100, S.elapsed / Section.SUGGESTED * 100) + '%';
    $('sPace').textContent = hid ? '' : Section.pace(S.elapsed);
  }
  function sectionTick() {
    var S = state.sect;
    if (!S || S.view === 'results') { clearInterval(sectTimer); return; }
    if (!document.hidden) S.elapsed += 1;
    updateSectionClock();
    if (S.elapsed % 10 === 0) saveSection();
  }

  function startSection() {
    if (state.sect || state.running || state.brk || state.phase === 'finale') return;
    var saved = progress.store.section, qs = null;
    if (saved) {
      qs = saved.ids.map(qById);
      if (qs.some(function (q) { return !q; })) { saved = null; progress.sectionClear(); }
    }
    if (!saved) {
      qs = Section.build(bank, progress.store, null, sectionOpen());
      if (!qs) { toast('There are not enough questions for a section yet.'); return; }
      saved = { ids: qs.map(function (q) { return q.id; }), answers: qs.map(function () { return null; }), elapsed: 0, i: 0 };
      progress.sectionSave(saved);
    }
    state.sect = { qs: qs, answers: saved.answers.slice(), i: Math.min(saved.i || 0, qs.length - 1), elapsed: saved.elapsed || 0, view: 'q', ctrl: null };
    $('card').hidden = true; $('sect').hidden = false; $('sLeave').hidden = false; $('sResults').innerHTML = '';
    clearInterval(sectTimer); sectTimer = setInterval(sectionTick, 1000);
    showSectionQuestion();
    renderSectionStrip();
  }

  function renderSectionDots() {
    var S = state.sect, d = $('sDots'); d.innerHTML = '';
    S.qs.forEach(function (q, i) {
      var b = document.createElement('button'); b.type = 'button';
      b.className = 'sd' + (S.answers[i] != null ? ' done' : '') + (i === S.i && S.view === 'q' ? ' cur' : '');
      b.textContent = i + 1;
      b.setAttribute('aria-label', 'Question ' + (i + 1) + (S.answers[i] != null ? ', answered' : ', not answered yet'));
      b.addEventListener('click', function () { if (S.view === 'results') return; S.i = i; showSectionQuestion(); });
      d.appendChild(b);
    });
    var cur = d.querySelector('.cur'); if (cur) d.scrollLeft = Math.max(0, cur.offsetLeft - d.clientWidth / 2 + 13);
  }

  function showSectionQuestion() {
    var S = state.sect, q = S.qs[S.i], host = $('sBody');
    S.view = 'q';
    $('sBody').hidden = false; $('sPrompt').hidden = false; $('sReview').hidden = true; $('sResults').hidden = true; $('sActions').hidden = false;
    $('sPos').innerHTML = '<span class="wl">Question </span>' + (S.i + 1) + ' of ' + S.qs.length;      // ("1 of 27" on a phone, where the room is short)
    $('sPrompt').textContent = q.prompt || '';
    S.ctrl = Quiz.build(q, host, function () {
      var sel = host.querySelector('.opt.sel');
      S.answers[S.i] = sel ? sel.dataset.word : null;      // (no feedback: the choice is only remembered)
      saveSection(); renderSectionDots();
    }, { traditional: true });
    var want = S.answers[S.i];
    if (want != null) { var hit = [].slice.call(host.querySelectorAll('.opt')).filter(function (x) { return x.dataset.word === want; })[0]; if (hit) hit.click(); }
    $('sBack').disabled = S.i === 0;
    $('sNext').textContent = S.i === S.qs.length - 1 ? 'Review →' : 'Next →';
    renderSectionDots(); updateSectionClock();
    if (narrowNow()) document.querySelector('.panel').scrollTop = 0;
  }

  function sectionButton(text, cls, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = text; b.addEventListener('click', fn); return b; }
  function sectionLine(text, cls) { var p = document.createElement('p'); p.className = cls || 'sres-line'; p.textContent = text; return p; }

  function showSectionReview() {
    var S = state.sect, box = $('sReview'); S.view = 'review';
    $('sBody').hidden = true; $('sPrompt').hidden = true; $('sActions').hidden = true; $('sResults').hidden = true; box.hidden = false; box.innerHTML = '';
    var blanks = []; S.answers.forEach(function (a, i) { if (a == null) blanks.push(i); });
    box.appendChild(sectionLine(blanks.length ? 'You have answered ' + (S.qs.length - blanks.length) + ' of ' + S.qs.length + '. These are still blank:' : 'You have answered all ' + S.qs.length + '. Check anything you are unsure of, or finish when you are ready.'));
    if (blanks.length) {
      var row = document.createElement('div');
      blanks.forEach(function (i) { row.appendChild(sectionButton('Q' + (i + 1), 'sjump', function () { S.i = i; showSectionQuestion(); })); });
      box.appendChild(row);
      box.appendChild(sectionLine('On the real test a blank scores the same as a miss, so it is worth answering every question. Here, a blank costs you nothing.', 'sres-line mute'));
    }
    var row2 = document.createElement('div'); row2.className = 'actions';
    row2.appendChild(sectionButton('Keep checking', 'secondary', function () { S.i = S.qs.length - 1; showSectionQuestion(); }));
    row2.appendChild(sectionButton('Finish and see my results', 'primary', finishSection));
    box.appendChild(row2);
    renderSectionDots();
  }

  function finishSection() {
    var S = state.sect; if (!S || S.view === 'results') return;
    var sc = Section.score(S.qs, S.answers);                 // no time in the score
    var before = progress.store.total, toys = 0, closed = 0, gold = false;
    S.qs.forEach(function (q, i) {
      var a = S.answers[i]; if (a == null) return;           // a blank is not recorded at all: it costs no Focus
      var rec = progress.record(q, a === q.answer);          // and no time in the recording either
      afterRecord(rec);
      if (rec.correct) {
        toys += 1 + (rec.wasCold ? 1 : 0) + (rec.streak && rec.streak % 5 === 0 ? 1 : 0);
        if (rec.wasCold) gold = true;
        if (rec.closed) closed++;
      }
    });
    var after = progress.store.total;
    if (gold) state.gold = true;
    state.queued += toys;
    state.sinceBreak += sc.answered;
    progress.sectionLog({ at: Date.now(), right: sc.right, total: sc.total, secs: S.elapsed });
    progress.sectionClear();
    clearInterval(sectTimer);
    S.view = 'results';
    Sound.unlock();
    showSectionResults(S, sc, { toys: toys, closed: closed, kinds: progress.kindsBetween(Track.KINDS, before, after), stories: progress.storiesBetween(before, after, bank) });
    updateHud();
  }

  function showSectionResults(S, sc, fx) {
    var box = $('sResults'); box.innerHTML = ''; box.hidden = false;
    $('sBody').hidden = true; $('sPrompt').hidden = true; $('sReview').hidden = true; $('sActions').hidden = true; $('sLeave').hidden = true;
    $('sPos').textContent = 'Results';
    var big = document.createElement('div'); big.className = 'sbig'; big.textContent = sc.right + ' '; var sm = document.createElement('small'); sm.textContent = '/ ' + sc.total; big.appendChild(sm); box.appendChild(big);
    box.appendChild(sectionLine(Section.verdict(sc)));
    if (!clockHidden()) {
      var over = S.elapsed > Section.SUGGESTED;
      box.appendChild(sectionLine('Time: ' + Section.clock(S.elapsed) + (over ? '. A little past the suggested ' + Section.clock(Section.SUGGESTED) + ', and that costs nothing: your score, Focus and rewards are the same.' : ' (suggested finish ' + Section.clock(Section.SUGGESTED) + ').'), 'sres-line mute'));
    }
    box.appendChild(sectionLine('Words in context: ' + sc.groups.words.r + ' of ' + sc.groups.words.t + '. Grammar and punctuation: ' + sc.groups.conventions.r + ' of ' + sc.groups.conventions.t + '.'));
    if (sc.blank.length) box.appendChild(sectionLine(sc.blank.length + ' left blank. On the real test a blank scores the same as a miss, so it is worth answering every question.', 'sres-line mute'));
    var lines = [];
    lines.push('🎯 Focus is now ' + Progress.fmt(progress.store.focus.count) + '.');
    if (fx.toys) lines.push('🧩 ' + fx.toys + ' toy' + (fx.toys > 1 ? 's' : '') + ' on the way to your machine.');
    if (fx.closed) lines.push('🗂 ' + fx.closed + ' cold case' + (fx.closed > 1 ? 's' : '') + ' closed.');
    fx.kinds.forEach(function (k) { lines.push('🔓 New toy unlocked: ' + Track.KINDS[k].label + '.'); });
    fx.stories.forEach(function (k) { lines.push(STORIES[k].icon + ' New storyline: ' + STORIES[k].title + '.'); });
    if (sc.wrong.length) lines.push('🗂 The ' + sc.wrong.length + ' you missed are in your cold case file, and will come back.');
    box.appendChild(sectionLine(lines.join(' '), 'sres-line mute'));
    if (sc.wrong.length) {
      box.appendChild(sectionLine('What you missed', 'sres-line'));
      sc.wrong.forEach(function (i) {
        var q = S.qs[i], mine = S.answers[i], d = document.createElement('details'); d.className = 'sres-miss';
        var sum = document.createElement('summary'); sum.textContent = 'Q' + (i + 1) + '. You chose “' + (mine === '' ? 'no punctuation' : mine) + '”. The answer is “' + (q.answer === '' ? 'no punctuation' : q.answer) + '”.'; d.appendChild(sum);
        var fixed = document.createElement('p'); fixed.className = 'fixed'; fixed.textContent = q.fixed || q.text || ''; d.appendChild(fixed);
        if (q.definitions && q.definitions[q.answer]) d.appendChild(sectionLine(q.answer + ': ' + q.definitions[q.answer] + (q.definitions[mine] ? '. ' + mine + ': ' + q.definitions[mine] + '.' : '.'), 'sres-line mute'));
        d.appendChild(sectionLine(q.rule, 'sres-line'));
        box.appendChild(d);
      });
    }
    var row = document.createElement('div'); row.className = 'actions';
    row.appendChild(sectionButton('Back to the machine', 'primary', function () { hideSection(true); }));
    box.appendChild(row);
    renderSectionDots(); updateSectionClock();
    if (narrowNow()) document.querySelector('.panel').scrollTop = 0;
  }

  /** Put the ordinary question card back. `fresh`: the section is over, so give him a new question. */
  function hideSection(fresh) {
    clearInterval(sectTimer);
    state.sect = null;
    $('sect').hidden = true; $('card').hidden = false; $('sLeave').hidden = false; $('sActions').hidden = false; $('sResults').innerHTML = '';
    if (fresh) showQuestion();
    var n = state.queued;
    if (fresh && n && !state.running && !state.brk && state.phase !== 'finale') { state.queued = 0; setTimeout(function () { placeQueued(n); }, 500); }
    renderSectionStrip(); updateHud();
  }
  function leaveSection() { if (state.sect && state.sect.view !== 'results') { saveSection(); hideSection(false); } }

  // ---------------------------------------------------------------- the fire inquiry: statements found as questions are solved
  var dossierKey = '', fireFound = null;
  function fireStory() { return window.SAT_STORIES && window.SAT_STORIES.fire; }
  /** The numbers of the statements he has found: one is found by solving any question built on it. */
  function fireFoundSet() {
    var set = {};
    bank.forEach(function (q) {
      if (q.story !== 'fire') return;
      var rec = progress.store.items[q.id];
      if (rec && rec.right > 0) set[q.seq] = true;
    });
    return set;
  }
  function renderDossier() {
    var box = $('dossier'), story = fireStory();
    if (!story || !progress.storyOpen('fire')) { box.hidden = true; return; }
    var found = fireFoundSet(), n = Object.keys(found).length, total = 0;
    story.chapters.forEach(function (c) { total += c.statements.length; });
    var key = n + '|' + Object.keys(found).join(',') + '|' + state.newStatements;
    if (key === dossierKey && !box.hidden) return;
    dossierKey = key; box.hidden = false;
    $('dossierTitle').textContent = story.title;
    $('dossierCount').textContent = n + ' of ' + total + ' statements' + (state.newStatements ? ' \u00b7 ' + state.newStatements + ' new' : '');
    $('dossierCount').classList.toggle('fresh', state.newStatements > 0);
    $('dossierIntro').textContent = n ? 'Inspector Mercer\u2019s case file. Each question you solve adds the statement it was built from.' : 'Inspector Mercer\u2019s case file is empty. Solve a fire question to add the first statement.';
    var host = $('dossierChapters'); host.innerHTML = '';
    var all = true;
    story.chapters.forEach(function (c) {
      var got = c.statements.filter(function (s) { return found[s.seq]; });
      if (got.length < c.statements.length) all = false;
      var div = document.createElement('div'); div.className = 'dchap' + (got.length ? '' : ' locked');
      var h4 = document.createElement('h4');
      h4.textContent = got.length ? 'Chapter ' + c.n + ': ' + c.title : 'Chapter ' + c.n + ': not opened yet';
      div.appendChild(h4);
      got.forEach(function (s) {
        var p = document.createElement('p'); p.className = 'voice-' + s.voice + (state.lastStatement === s.seq ? ' fresh' : '');
        p.textContent = s.text; div.appendChild(p);
      });
      if (got.length && got.length < c.statements.length) {
        var m = document.createElement('p'); m.className = 'more'; m.textContent = (c.statements.length - got.length) + ' more in this chapter'; div.appendChild(m);
      }
      host.appendChild(div);
    });
    $('dossierSolution').hidden = !all;
    $('dossierSolution').textContent = all ? 'The truth: ' + story.solution : '';
  }

  // ---------------------------------------------------------------- the mystery
  // Each machine is a mystery. Right answers find clues; the last run clears the innocent suspects one by one.
  // (during the case-closed card the finished machine is already counted, so keep showing the one just solved)
  function mystery() { return state.phase === 'finale' && state.solved ? state.solved : Mystery.forMachine(progress.store.cases); }
  function cluesFound() {
    var my = mystery(), m = machine();
    return my ? Mystery.cluesFound(my, m.pieces.length, m.target) : 0;
  }
  var mysteryKey = '';
  function renderMystery() {
    var my = mystery();
    if (!my) { $('mysteryToggle').parentNode.hidden = true; return; }
    var found = cluesFound(), key = [my.id, found, state.cleared.join(), state.newClues, state.phase === 'finale', progress.store.total].join('|');
    if (key === mysteryKey) return;
    mysteryKey = key;
    $('mysteryTitle').textContent = my.title;
    var left = my.clues.length - found;
    var count = $('mysteryCount');
    count.textContent = state.phase === 'finale' ? 'solved' : found + ' of ' + my.clues.length + ' clues' + (state.newClues ? ' · ' + (state.newClues > 1 ? state.newClues + ' new' : 'new') : left === 0 ? ' · run the machine to name the culprit' : '');
    count.classList.toggle('fresh', state.newClues > 0);
    $('mysteryBrief').textContent = my.brief;
    var nxt = progress.nextStory(bank);
    $('storyNext').textContent = nxt ? STORIES[nxt.id].icon + ' A new storyline opens at ' + Progress.STORY_UNLOCK[nxt.id] + ' right answers: ' + nxt.left + ' to go.' : '';
    $('mysterySolved').hidden = state.phase !== 'finale';
    $('mysterySolved').textContent = 'How it was done: ' + my.solution;
    var sus = $('mysterySuspects'); sus.innerHTML = '';
    my.suspects.forEach(function (x, i) {
      var d = document.createElement('div');
      d.className = 'msus' + (state.cleared.indexOf(i) >= 0 ? ' out' : '') + (state.phase === 'finale' && i === my.culprit ? ' guilty' : '');
      var ic = document.createElement('span'); ic.className = 'mi'; ic.textContent = x.icon;
      var tx = document.createElement('span'), nm = document.createElement('b'), rl = document.createElement('i');
      nm.textContent = x.name; rl.textContent = x.role; tx.appendChild(nm); tx.appendChild(rl);
      d.appendChild(ic); d.appendChild(tx); sus.appendChild(d);
    });
    var ol = $('mysteryClues'); ol.innerHTML = '';
    my.clues.forEach(function (c, i) {
      var li = document.createElement('li');
      if (i < found) { li.textContent = c; if (i >= found - state.newClues) li.className = 'fresh'; }
      else { li.textContent = 'Not found yet. Keep answering.'; li.className = 'locked'; }
      ol.appendChild(li);
    });
  }

  /** The suspects over the machine, shown for its last run. `cleared` and `guilty` are drawn on them as it goes. */
  function paintSuspects(guiltyOut) {
    var my = mystery(), box = $('suspects');
    if (!my) return;
    box.innerHTML = '';
    my.suspects.forEach(function (x, i) {
      var out = state.cleared.indexOf(i) >= 0, guilty = guiltyOut && i === my.culprit, d = document.createElement('div');
      d.className = 'sus' + (out ? ' out' : '') + (guilty ? ' guilty' : '');
      d.dataset.i = i;
      var ic = document.createElement('span'); ic.className = 'si'; ic.textContent = x.icon;
      var nm = document.createElement('b'); nm.textContent = x.name;
      d.appendChild(ic); d.appendChild(nm);
      if (out || guilty) { var t = document.createElement('span'); t.className = 'stag'; t.textContent = guilty ? 'guilty' : 'cleared'; d.appendChild(t); }
      box.appendChild(d);
    });
  }
  function startSuspects() {
    state.grand = true; state.cleared = [];
    paintSuspects(false);
    $('suspects').classList.add('show');
    mysteryKey = ''; renderMystery();
  }
  function hideSuspects() {
    state.grand = false; state.cleared = [];
    $('suspects').classList.remove('show');
    mysteryKey = ''; renderMystery();
  }
  /** Clear every innocent suspect the running front has reached, in order. */
  function checkClears() {
    var my = mystery();
    if (!my || !state.grand || !track) return;
    var now = Mystery.cleared(my, track.sections.length, track.frontier || 0);
    for (var i = state.cleared.length; i < now.length; i++) {
      var s = my.suspects[now[i]];
      state.cleared.push(now[i]);
      Sound.stamp();
      banner('CLEARED', s.name + ' \u00b7 ' + s.cleared, 'cool');
      paintSuspects(false);
      var chip = $('suspects').children[now[i]]; if (chip) chip.classList.add('stamp');
      mysteryKey = ''; renderMystery();
    }
  }
  /** A new clue has turned up: say so once the toy that found it has been announced. */
  function foundClues(had, now) {
    var my = mystery();
    if (!my || now <= had) return;
    if ($('mysteryBody').hidden) state.newClues += now - had;     // with the case file open he is watching them arrive
    mysteryKey = '';
    renderMystery();
    setTimeout(function () { state.clueDue = { my: my, n: now }; showDueClue(); }, 2000);
  }
  /** Say the clue that is due, unless a run is under way (it would sit on the chain counter): the bell tries again. */
  function showDueClue() {
    var c = state.clueDue;
    if (!c) return;
    if (state.phase === 'finale' || mystery() !== c.my) { state.clueDue = null; return; }
    if (state.running || state.brk) return;
    state.clueDue = null;
    Sound.clue();
    announce('\ud83d\udd0e Clue ' + c.n + ' of ' + c.my.clues.length, c.my.clues[c.n - 1], 6500);
  }
  /** The first time a machine is built, say what the mystery is. */
  function introMystery() {
    var my = mystery(), m = machine();
    if (!my || m.briefed) return;
    m.briefed = true; progress.save();
    setTimeout(function () {
      if (state.brk || state.phase === 'finale') return;
      announce('\ud83d\udd0e New mystery: ' + my.title, my.brief, 8000);
    }, 900);
  }
  function showChain() {
    var c = $('chain');
    clearTimeout(chainTimer);
    if (state.chain < 1) { c.classList.remove('show'); return; }
    $('chainN').textContent = state.chain;
    c.classList.add('show');
    c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
  }
  function hideChainSoon() { clearTimeout(chainTimer); chainTimer = setTimeout(function () { $('chain').classList.remove('show'); }, 1800); }

  function showFinale(x) {
    $('finTitle').textContent = 'CASE CLOSED';
    $('finScore').textContent = '+' + x.score.toLocaleString();
    $('finStats').textContent = x.doms + ' dominoes · ' + x.toys + ' toys · ' + x.secs + ' seconds · machine #' + x.cases;
    var my = x.mystery, who = my && my.suspects[my.culprit];
    $('finCulprit').hidden = $('finSolution').hidden = !my;
    if (my) {
      $('finCulprit').textContent = '\ud83d\udd0e ' + my.title + ': it was ' + who.name + ', ' + who.role + '.';
      $('finSolution').textContent = my.solution;
    }
    $('finale').classList.add('show');
  }

  function updateHud() {
    var s = progress.store, m = machine();
    $('score').textContent = s.score.toLocaleString();
    $('caseNo').textContent = s.cases + 1;

    var pips = $('pieces'); pips.innerHTML = '';
    for (var i = 0; i < m.target; i++) {
      var dot = document.createElement('span');
      if (i < m.pieces.length) dot.className = 'on';
      pips.appendChild(dot);
    }
    pips.setAttribute('aria-label', m.pieces.length + ' of ' + m.target + ' pieces in this machine');
    renderMystery();
    renderDossier();
    renderSectionStrip();
    // a one-line summary, and a way across to the machine, for the phone's questions tab
    var stat = $('statusText');
    if (stat) {
      var bits = ['\ud83c\udfaf <b>' + Progress.fmt(s.focus.count) + '</b>', '\ud83d\udd25 <b>' + s.streak + '</b>', '\ud83e\udde9 <b>' + m.pieces.length + '/' + m.target + '</b>'];
      var my2 = mystery(); if (my2) bits.push('\ud83d\udd0e <b>' + cluesFound() + '/' + my2.clues.length + '</b>');
      if (freePlays() > 0) bits.push('\ud83e\uddca <b>' + freePlays() + '</b>');
      if (flickable() && !playReady()) bits.push('\ud83c\udfb2 <b>' + (studyBefore() - state.sinceBreak) + '</b> more to play');
      stat.innerHTML = bits.map(function (b) { return '<span>' + b + '</span>'; }).join('');
      stat.setAttribute('aria-label', 'Focus ' + Progress.fmt(s.focus.count) + ', ' + s.streak + ' in a row, ' + m.pieces.length + ' of ' + m.target + ' pieces');
    }
    var canPlay = !!flickable() && !state.running && state.phase !== 'finale' && playReady();
    $('backStudy').hidden = phoneNow() || state.view !== 'machine' || state.running || state.phase === 'finale';
    $('playNow').hidden = !canPlay;
    $('tabBadge').hidden = !canPlay || state.view === 'machine';

    // streak meter
    var cur = tierFor(s.streak), nx = nextTier(s.streak);
    var pct = nx ? (s.streak - cur.at) / (nx.at - cur.at) : 1;
    $('streakFill').style.width = (pct * 100) + '%';
    $('streakN').textContent = s.streak;
    $('streakName').textContent = cur.name + (cur.mult > 1 ? ' ×' + cur.mult : '');
    $('streak').className = 'streak s-' + cur.skin;
    $('streakNext').textContent = nx ? (nx.at - s.streak) + ' more for ' + nx.name : 'Maximum power';

    // what to do right now
    var hint;
    if (state.phase === 'finale') hint = '';
    else if (state.brk) hint = '';
    else if (state.running) hint = 'Tap a rolling marble to shove it';
    else if (flickable()) {
      var cost = freePlays() > 0 ? '🧊 a freeze covers this one' : s.focus.count ? 'this costs ' + Progress.fmt(Math.min(Progress.PLAY_COST, s.focus.count)) + ' Focus' : '';
      hint = (m.complete && m.playFrom === 0 ? 'Flick the top marble and run the whole machine!' : 'Pull back on the glowing marble and let go') + (cost ? ' · ' + cost : '');
    }
    else {
      var un = progress.nextUnlock(Track.KINDS);
      hint = 'Answer correctly to add a toy' + (un ? ' · ' + un.left + ' more unlocks ' + un.label : '');
    }
    $('hint').textContent = hint;
    var locked = !flickable() && !state.running && !state.brk && state.phase !== 'finale';
    $('stage').classList.toggle('locked', locked);

    // cold cases
    var cc = progress.coldCount(bank);
    $('coldN').textContent = cc;
    $('coldWord').textContent = cc === 1 ? 'cold case' : 'cold cases';
    $('closedN').textContent = s.closed;
    $('coldbar').classList.toggle('some', cc > 0);
    $('coldMsg').textContent = cc ? 'Solve one for a gold marble and a bonus toy' : 'No open cold cases. Missed questions come back here.';
    $('rank').textContent = rankFor(s.total);
    renderMeters();
    renderFocus();
    renderChest();
  }
  function renderMeters() {
    var host = $('meters'), s = progress.store; host.innerHTML = '';
    Object.keys(Quiz.SKILLS).forEach(function (k) {
      if (k === 'phrases' && !progress.storyOpen('fire')) return;      // the fire storyline's skill stays out of sight until it opens
      var sk = s.skills[k] || { r: 0, t: 0 };
      var row = document.createElement('div'); row.className = 'meter';
      var lab = document.createElement('span'); lab.className = 'ml'; lab.textContent = Quiz.SKILLS[k];
      var cells = document.createElement('span'); cells.className = 'cells';
      var lit = sk.t ? Math.round(5 * sk.r / sk.t) : 0;
      for (var i = 0; i < 5; i++) { var c = document.createElement('i'); if (i < lit) c.className = 'on'; cells.appendChild(c); }
      var sc = document.createElement('span'); sc.className = 'ms'; sc.textContent = sk.t ? sk.r + '/' + sk.t : '–';
      row.appendChild(lab); row.appendChild(cells); row.appendChild(sc); host.appendChild(row);
    });
  }

  // ---------------------------------------------------------------- Focus, freezes, the chest
  function afterRecord(rec) {
    if (rec.freezeEarned) { Sound.freeze(); toast('🧊 Freeze earned! It covers three plays for free, any time this session.', 4200); pulse('freezes'); }
    (rec.rolls || []).forEach(function (r) {
      if (r.won && r.item) state.unrevealed[r.item] = (state.unrevealed[r.item] || 0) + 1;
      rollQueue.push(r);
    });
    pumpRolls();
  }

  function pulse(id) { var e = $(id); e.classList.remove('pulse'); void e.offsetWidth; e.classList.add('pulse'); }

  /** He just played: say what it cost him. */
  /** Plays still covered by freezes: the one under way plus three for each whole freeze in hand. */
  function freePlays() { var s = progress.store; return (s.freezePlays || 0) + s.freezes * Progress.FREEZE_PLAYS; }
  function showPlayResult(r) {
    if (r.frozen) { Sound.freeze(); toast('🧊 Free play' + (r.playsLeft ? ' (' + r.playsLeft + ' more after this)' : ' (the last of this freeze)') + '. Focus stays at ' + Progress.fmt(r.kept) + '.', 2800); pulse('focus'); }
    else if (r.lost > 0) { Sound.focusLost(); toast('Playing cost ' + Progress.fmt(r.lost) + ' Focus. You still have ' + Progress.fmt(r.now) + '.', 3200); pulse('focus'); }
    updateHud();
  }

  var rollQueue = [], rolling = false;
  function pumpRolls() {
    if (rolling || !rollQueue.length) return;
    rolling = true;
    var r = rollQueue.shift(), box = $('rollBox'), head = $('rollHead'), result = $('rollResult');
    box.hidden = false;
    box.className = 'rollbox rolling t-' + r.tier;
    head.textContent = r.label + ' roll: ' + Math.round(r.chance * 100) + '% chance';
    result.textContent = '🎲 🎲 🎲';
    Sound.roll();
    setTimeout(function () {
      box.classList.remove('rolling');
      if (r.won && r.item) {
        var it = REWARDS[r.item];
        box.classList.add('won');
        result.textContent = it.icon + ' ' + it.name + ' goes in your chest!';
        state.unrevealed[r.item] = Math.max(0, (state.unrevealed[r.item] || 0) - 1);
        Sound.win(r.tier);
        banner(r.label.toUpperCase() + '!', it.icon + ' ' + it.name, r.tier === 'bonus' ? 'cool' : r.tier === 'rare' ? 'hot' : 'gold');
        if (!reduced) renderer.confetti(renderer.cam.x, renderer.cam.y - 8, r.tier === 'ultra' ? 260 : r.tier === 'rare' ? 140 : 70, 18);
      } else {
        box.classList.add('lost');
        result.textContent = 'Not this time. Next try at ' + r.next + ' Focus. Keep going!';
        Sound.noLuck();
      }
      updateHud();
      setTimeout(function () {
        rolling = false;
        if (rollQueue.length) pumpRolls(); else box.hidden = true;
      }, r.won ? 3200 : 2000);
    }, reduced ? 300 : 1050);
  }

  function renderFocus() {
    var s = progress.store, f = s.focus;
    $('focusN').textContent = Progress.fmt(f.count);
    Progress.TIERS.forEach(function (t) {
      var into = progress.tierProgress(t), row = $('fb-' + t.id);
      row.querySelector('.ffill').style.width = (into / t.every * 100) + '%';
      row.querySelector('.fcount').textContent = Progress.fmt(into) + ' / ' + t.every;
    });
    var nextBonus = Progress.TIERS[0], into = progress.tierProgress(nextBonus);
    $('miniFill').style.width = (into / nextBonus.every * 100) + '%';
    $('miniText').textContent = Progress.fmt(into) + ' / ' + nextBonus.every + ' to the next bonus roll';
    $('miniFocus').querySelector('b').textContent = Progress.fmt(f.count);

    var fz = freePlays(), line = $('freezes'), miniF = $('miniFreeze');
    var more = Progress.FREEZE_EVERY - (s.streak % Progress.FREEZE_EVERY);
    if (fz > 0) {
      line.className = 'freezes ready';
      line.textContent = '🧊 ' + fz + ' free play' + (fz > 1 ? 's' : '') + ' ready, any time this session. ' + more + ' more in a row earns a freeze of three more.';
      miniF.textContent = '🧊 ×' + fz;
      miniF.hidden = false;
    } else {
      line.className = 'freezes';
      line.textContent = '🧊 ' + more + ' more in a row earns a freeze, which covers three plays for free.';
      miniF.hidden = true;
    }
  }

  function renderChest() {
    var s = progress.store, host = $('chestTiles'), total = 0;
    host.innerHTML = '';
    Object.keys(REWARDS).forEach(function (id) {
      var it = REWARDS[id], have = Math.max(0, (s.chest[id] || 0) - (state.unrevealed[id] || 0)), known = s.found[id] && (have > 0 || !state.unrevealed[id]);
      total += have;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile t-' + it.tier + (have ? ' owned' : '') + (state.picked === id ? ' picked' : '');
      b.dataset.id = id;
      b.title = known ? it.name : 'Not found yet';
      b.setAttribute('aria-label', known ? it.name + ', ' + have + ' in the chest' : 'Item not found yet');
      var ic = document.createElement('span'); ic.className = 'ticon'; ic.textContent = known ? it.icon : '?'; b.appendChild(ic);
      if (have) { var n = document.createElement('b'); n.textContent = have; b.appendChild(n); }
      b.disabled = !known;
      b.addEventListener('click', function () { state.picked = state.picked === id ? null : id; renderChest(); });
      host.appendChild(b);
    });
    $('chestCount').textContent = total ? total + ' saved for a longer break' : 'empty';
    $('chestToggle').classList.toggle('some', total > 0);

    var info = $('chestInfo'), id = state.picked;
    if (!id || !REWARDS[id] || !s.found[id]) { info.hidden = true; return; }
    var item = REWARDS[id], owned = s.chest[id] || 0;
    info.hidden = false;
    info.className = 'chestinfo t-' + item.tier;
    $('ciName').textContent = item.icon + ' ' + item.name + ' · ' + item.secs + ' seconds';
    $('ciBlurb').textContent = item.blurb;
    var go = $('ciGo'), busy = state.running || state.brk || state.phase === 'finale';
    go.disabled = !owned || busy;
    go.textContent = owned ? 'Play it now' : 'None left';
    $('ciCost').textContent = busy ? 'Wait for what is happening on the machine to finish.'
      : !owned ? 'Win another by keeping your Focus up.'
      : freePlays() > 0 ? '🧊 A free play, so your Focus stays at ' + Progress.fmt(s.focus.count) + '.'
      : s.focus.count ? 'This costs ' + Progress.fmt(Math.min(Progress.PLAY_COST, s.focus.count)) + ' Focus.' : '';
  }

  /** Take an item out of the chest and turn it loose on the machine. */
  function deploy(id) {
    var item = REWARDS[id];
    if (!item || state.running || state.brk || state.phase === 'finale') return;
    if (!progress.useItem(id)) return;
    Sound.init();
    if (narrowNow()) setView('machine');
    showPlayResult(progress.notePlay());
    state.picked = null; state.chain = 0; state.runScore = 0; state.aim = null;
    var c = renderer.cam;
    c.follow = false; c.zoomGoal = null; state.focus = null;
    if (item.fresh) rebuild({});             // Rewind needs a standing machine to knock over
    if (item.wide) { var z = renderer.fitZoom(track); c.zoom = Math.max(0.42, Math.min(0.9, z.zoom)); c.x = z.x; c.y = z.y; if (z.zoom < 0.42) c.y = track.bounds().minY + 16; }
    else c.zoom = Math.max(0.7, Math.min(1, c.zoom));
    var pg = new Playground(track, id, {
      renderer: renderer, sound: Sound,
      view: function () {
        var f = renderer.fx, a = renderer.screenToWorld(0, 0), b = renderer.screenToWorld(f.w / f.dpr, f.h / f.dpr);
        return { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
      },
      onScore: function (n, x, y) { score(n, x, y, { size: 0.8, color: [3, 2.2, 0.8] }); }
    });
    state.brk = { id: id, pg: pg, left: item.secs, secs: item.secs };
    if (pg.focus()) { c.follow = true; c.zoom = 0.92; }
    $('breakIcon').textContent = item.icon;
    $('breakName').textContent = item.name;
    $('breakHow').textContent = item.how;
    $('breakBar').classList.add('show');
    $('stage').classList.add('breaking');
    banner(item.name.toUpperCase(), item.how, item.tier === 'bonus' ? 'cool' : item.tier === 'rare' ? 'hot' : 'gold');
    Sound.unlock();
    updateHud();
  }

  function endBreak() {
    var b = state.brk;
    if (!b) return;
    state.brk = null;
    b.pg.end(renderer.fx);
    $('breakBar').classList.remove('show');
    $('stage').classList.remove('breaking');
    if (state.runScore) { progress.bankScore(state.runScore); banner('+' + state.runScore.toLocaleString(), 'Break over. Back to the case!', 'cool'); }
    else toast('Break over. Back to the case!');
    state.runScore = 0; state.chain = 0;
    hideChainSoon();
    renderer.cam.follow = true;
    Sound.slot();
    rebuild({});
    if (state.queued) { var n = state.queued; state.queued = 0; setTimeout(function () { placeQueued(n); }, 1000); }
    if (!phoneNow() && !params.has('stay')) setTimeout(function () { if (state.view === 'machine' && !state.running && state.phase !== 'finale' && !state.brk) setView('study'); }, 2600);
    updateHud();
  }

  // ---------------------------------------------------------------- questions
  function showQuestion(forceId) {
    var q = (forceId && bank.filter(function (x) { return x.id === forceId; })[0]) || progress.next(bank, state.last);
    state.current = q; state.last = q; state.answered = false;
    if (narrowNow()) document.querySelector('.panel').scrollTop = 0;     // the next question is always in view, whatever the last one scrolled to
    var card = $('card');
    card.classList.remove('win', 'lose', 'enter'); void card.offsetWidth; card.classList.add('enter');
    $('feedback').hidden = true; $('feedback').className = '';
    $('qtitle').textContent = q.title; $('qprompt').textContent = q.prompt || '';
    $('qtag').textContent = Quiz.SKILLS[q.skill] || q.skill;
    var cold = progress.store.cold[q.id];
    var stamp = $('coldStamp');
    stamp.hidden = !cold;
    if (cold) stamp.textContent = cold.wins ? '🗂 Cold case · last solve closes it' : '🗂 Cold case · missed ' + (cold.n > 1 ? cold.n + ' times' : 'before');
    card.classList.toggle('coldcard', !!cold);
    state.ctrl = Quiz.build(q, $('qbody'), function () { $('check').disabled = !state.ctrl.ready(); });
    if (state.ctrl.prompt) { $('qprompt').textContent = state.ctrl.prompt; $('qtitle').textContent = 'Match the SAT word'; }
    var check = $('check'); check.hidden = false; check.disabled = !state.ctrl.ready();
    $('next').hidden = true;
  }

  function checkAnswer() {
    var q = state.current, ctrl = state.ctrl;
    if (!ctrl.ready() || state.answered) return;
    state.answered = true;
    var res = ctrl.check(); ctrl.reveal(res);
    var rec = progress.record(q, res.correct, res.partial);
    afterRecord(rec);
    state.sinceBreak++;

    var fb = $('feedback'), card = $('card'); fb.hidden = false; fb.className = res.correct ? 'good' : 'badfb';
    card.classList.remove('enter'); card.classList.add(res.correct ? 'win' : 'lose');
    var verdict;
    if (res.correct) verdict = rec.closed ? 'Case closed! Solved twice, so it stays solved.' : rec.wasCold ? 'Cracked it! One more solve next session closes this case.' : 'Elementary! Correct.';
    else if (rec.partialGain) verdict = 'Close: ' + res.partial.found + ' of ' + res.partial.total + ' found. Focus +' + Progress.fmt(rec.partialGain) + '.';
    else verdict = 'Not quite. Study the clue below.' + (rec.focusLost ? ' Focus −' + Progress.fmt(rec.focusLost) + '.' : '');
    $('verdict').textContent = verdict;
    $('coldNote').hidden = res.correct;
    if (!res.correct) $('coldNote').textContent = rec.repeatMiss ? '🗂 Back in the cold case file. It will return until you have it.' : '🗂 Filed as a cold case. It comes back soon, and again next session.';
    $('rule').textContent = q.rule;
    var fx = $('fixedline'); fx.innerHTML = '';
    var tag = document.createElement('b'); tag.textContent = (q.fixedLabel || 'Correct version') + ': '; fx.appendChild(tag);
    var fixed = q.fixed || q.text;
    if (q.answer && q.type === 'vocab') {
      var hit = new RegExp('\\b' + q.answer + '\\b').exec(fixed), i = hit ? hit.index : fixed.indexOf(q.answer);
      fx.appendChild(document.createTextNode(fixed.slice(0, i)));
      var m = document.createElement('mark'); m.textContent = q.answer; fx.appendChild(m);
      fx.appendChild(document.createTextNode(fixed.slice(i + q.answer.length)));
    } else fx.appendChild(document.createTextNode(fixed));
    $('src').textContent = q.source.original ? '— ' + q.source.book + (q.source.note ? ', ' + q.source.note : '')
      : '— ' + (q.source.author || 'Agatha Christie') + ', ' + q.source.book + ' (Project Gutenberg #' + q.source.gutenberg + ')';
    $('check').hidden = true; $('next').hidden = false; $('next').focus({ preventScroll: true });
    try { fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* old browsers */ }

    if (res.correct) {
      Sound.correct();
      if (rec.closed) { Sound.caseClosed(); setTimeout(function () { banner('COLD CASE CLOSED', 'Gold marble + bonus toy', 'gold'); }, 200); }
      else if (rec.wasCold) setTimeout(function () { banner('COLD CASE CRACKED', 'Gold marble + bonus toy', 'gold'); }, 200);
      award(q, rec);
    } else {
      Sound.wrong();
      renderer.kick(reduced ? 0 : 0.5);
      renderer.heatTarget = 0;
      if (!reduced) { renderer.fx.sat = 0.25; state.satBack = true; }
    }
    updateHud();
  }

  // ---------------------------------------------------------------- pointer: flick, poke, pan, pinch
  function setupPointer() {
    var cv = renderer.canvas, pts = {}, lastDist = 0;
    function rel(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    cv.addEventListener('pointerdown', function (e) {
      Sound.init();
      var p = rel(e);
      cv.setPointerCapture(e.pointerId);
      pts[e.pointerId] = p; lastDist = 0;
      var wp = renderer.screenToWorld(p.x, p.y), fm = flickable();
      if (state.brk) {
        if (Object.keys(pts).length === 1) state.brk.pg.pointer(wp.x, wp.y, true);
        return;
      }
      var reach = Math.max(2.4, 40 * renderer.fx.dpr / renderer.scale());

      if (Object.keys(pts).length === 1 && fm && Math.hypot(wp.x - fm.x, wp.y - fm.y) < reach) {
        if (canFlick()) {
          state.aim = { dx: 0, dy: 0, sx: wp.x, sy: wp.y, power: 0, id: e.pointerId };
          cv.classList.add('aiming');
          return;
        }
        return;
      }
      if (state.running) {
        var shoved = track.poke(wp.x, wp.y);
        if (shoved) { Sound.kick(); renderer.sparks(shoved.x, shoved.y, 22, 190, 6); renderer.ring(shoved.x, shoved.y, 1.8, 0.8, 2, 2.6, 0.3, 0.1); }
      }
      if (!flickable() && !state.running) {
        var rest = restingMarble();
        if (rest && Math.hypot(wp.x - rest.x, wp.y - rest.y) < reach) nudgePanel();
      }
      cv.classList.add('drag');
    });

    cv.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var p = rel(e), old = pts[e.pointerId], ids = Object.keys(pts);
      if (state.brk && ids.length === 1) {
        var bw = renderer.screenToWorld(p.x, p.y);
        state.brk.pg.pointer(bw.x, bw.y, true);
        pts[e.pointerId] = p;
        return;
      }

      if (state.aim && state.aim.id === e.pointerId) {
        var wp = renderer.screenToWorld(p.x, p.y), dx = wp.x - state.aim.sx, dy = wp.y - state.aim.sy, L = Math.hypot(dx, dy);
        if (L > MAX_PULL) { dx *= MAX_PULL / L; dy *= MAX_PULL / L; L = MAX_PULL; }
        state.aim.dx = dx * 0.45; state.aim.dy = dy * 0.45;   // the marble moves less than the finger, like a stiff band
        state.aim.rx = dx; state.aim.ry = dy;
        state.aim.power = L / MAX_PULL;
        if (L > 0.3) Sound.stretch(state.aim.power);
        pts[e.pointerId] = p;
        return;
      }
      if (ids.length === 1) renderer.panPx(p.x - old.x, p.y - old.y);
      else if (ids.length === 2) {
        pts[e.pointerId] = p;
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastDist) renderer.zoomAt(d / lastDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
        lastDist = d;
      }
      pts[e.pointerId] = p;
    });

    function up(e) {
      var aim = state.aim;
      delete pts[e.pointerId]; lastDist = 0;
      if (state.brk) {
        var r0 = rel(e), w0 = renderer.screenToWorld(r0.x, r0.y);
        state.brk.pg.pointer(w0.x, w0.y, false);
        if (!Object.keys(pts).length) cv.classList.remove('drag');
        return;
      }
      if (aim && aim.id === e.pointerId) {
        state.aim = null;
        cv.classList.remove('aiming');
        if (e.type === 'pointercancel') return;
        var rx = aim.rx || 0, ry = aim.ry || 0, L = Math.hypot(rx, ry);
        if (L < 0.5) {
          var ex = track.exitFor(machine().playFrom);
          beginRun(ex.dir * 3.5, 0);         // a plain tap is a gentle push
        } else {
          var v = aim.power * Track.FLICK_MAX;
          beginRun(-rx / L * v, -ry / L * v);
        }
        return;
      }
      if (!Object.keys(pts).length) cv.classList.remove('drag');
    }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

    // Double-click a marble that has been handed on (and rests dim where it was) to wake it up again. It is a free toy, not a play:
    // it rolls on its own for a few seconds and then fades.
    cv.addEventListener('dblclick', function (e) {
      if (state.brk || state.phase === 'finale') return;
      var p = rel(e), wp = renderer.screenToWorld(p.x, p.y), list = machine().kept || [], best = -1, bd = 1.1;
      list.forEach(function (k, i) {
        var s0 = track.sections.filter(function (s) { return s.id === k.pid; })[0];
        if (!s0 || !s0.exit) return;
        var d = Math.hypot(wp.x - (s0.exit.x + k.dx), wp.y - (s0.exit.y + k.dy));
        if (d < bd) { bd = d; best = i; }
      });
      if (best < 0) return;
      var k = list.splice(best, 1)[0], sec = track.sections.filter(function (s) { return s.id === k.pid; })[0];
      var m = track._marble(sec, sec.exit.x + k.dx, sec.exit.y + k.dy, { role: 'revived', hue: k.hue, asleep: false });
      m.userData.small = true; m.userData.live = true; m.userData.expire = track.time + 9;     // (small: it never rings the bell or counts as the run)
      m.wake(); m.vx += (sec.exit.dir || 1) * 1.2;
      Sound.kick(); renderer.sparks(m.x, m.y, 18, k.hue, 5); renderer.ring(m.x, m.y, 1.6, 0.8, 2, 2.6, 0.3, 0.1);
      progress.save();
    });

    cv.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = cv.getBoundingClientRect(), k = e.deltaMode === 1 ? 16 : 1;
      if (e.ctrlKey || e.metaKey) renderer.zoomAt(Math.exp(-e.deltaY * k * 0.01), e.clientX - r.left, e.clientY - r.top);
      else {
        var dx = e.deltaX * k, dy = e.deltaY * k;
        if (e.shiftKey && !dx) { dx = dy; dy = 0; }
        renderer.panPx(-dx, -dy);
      }
    }, { passive: false });

    $('zin').addEventListener('click', function () { renderer.zoomSmooth(1.2); });
    $('zout').addEventListener('click', function () { renderer.zoomSmooth(1 / 1.2); });
    $('fit').addEventListener('click', function () { renderer.fit(track); });
    $('follow').addEventListener('click', function () { renderer.cam.follow = true; renderer.cam.zoomGoal = 1; setTimeout(function () { renderer.cam.zoomGoal = null; renderer.cam.zoom = 1; }, 900); });
  }

  function nudgePanel() {
    var c = $('card');
    c.classList.remove('nudge'); void c.offsetWidth; c.classList.add('nudge');
    toast('Answer this one correctly to add a toy and earn a flick');
  }

  // ---------------------------------------------------------------- main loop
  var acc = 0, lastT = 0, frames = 0, frameSum = 0;
  function aimPreview() {
    if (!state.aim) return null;
    var fm = flickable(); if (!fm) return null;
    var rx = state.aim.rx || 0, ry = state.aim.ry || 0, L = Math.hypot(rx, ry);
    if (L < 0.01) return [];
    var v = state.aim.power * Track.FLICK_MAX, vx = -rx / L * v, vy = -ry / L * v, x = fm.x, y = fm.y, g = Track.GRAVITY, out = [];
    for (var i = 1; i <= 16; i++) { var t = i * 0.075; out.push({ x: x + vx * t, y: y + vy * t + 0.5 * g * t * t }); }
    return out;
  }

  function leadMarble() { return track._liveMarble(); }

  function focusPoint(now) {
    if (state.brk) return state.brk.pg.focus();
    if (state.phase === 'finale') return null;
    if (state.focus && now < state.focusUntil) return state.focus;
    var lead = state.running ? leadMarble() : null;
    if (lead) return { x: lead.x, y: lead.y + 1, fast: Math.hypot(lead.vx, lead.vy) > 5, zoom: 0.92 };
    var fm = flickable();
    if (fm) return { x: fm.x + track.exitFor(machine().playFrom).dir * 3, y: fm.y + 2.5, zoom: 1 };
    if (track.bell && track.bell.rung > 0) return { x: track.bell.x, y: track.bell.y - 1, zoom: 1 };
    var z = renderer.fitZoom(track);
    return { x: z.x, y: z.y, zoom: Math.max(0.42, Math.min(1, z.zoom)) };
  }

  function frame(ts) {
    var now = ts / 1000, dt = Math.min(0.05, (now - lastT) || 0.016);
    lastT = now;

    // watch the frame rate and turn down the expensive stuff on a slow machine
    var real = now - (state.lastReal || now); state.lastReal = now;
    frameSum += real; frames++;
    if (frameSum >= 1.5 && frames >= 3) {
      var avg = frameSum / frames;
      if (avg > 0.029 && renderer.fx.quality > 0 && !params.has('noscale')) renderer.fx.setQuality(renderer.fx.quality - 1);
      frames = 0; frameSum = 0;
    }

    var speed = state.brk ? 1 : (state.fast ? 2.6 : BASE_SPEED);
    if (state.slowUntil && now < state.slowUntil) speed *= reduced ? 1 : 0.32;
    if (state.hitStop > 0) { state.hitStop -= dt; speed = 0; }
    acc += dt * speed;
    var steps = 0, maxSteps = state.fast ? 6 : 4;
    while (acc >= 1 / 60 && steps < maxSteps) {
      var held = false;
      if (state.brk) { state.brk.pg.step(1 / 60); held = state.brk.pg.holdWorld; }
      if (!held) { world.step(1 / 60); track.tick(1 / 60, now); }
      acc -= 1 / 60; steps++;
    }
    if (steps === maxSteps) acc = 0;
    if (state.running) {
      track.collectStars();
      // a last line of defence: no run can hang forever
      if (track.run && !track.run.over && track.time - track.run.t0 > 420) track._ring(null);
    }
    if (state.satBack) {
      renderer.fx.sat += (1 - renderer.fx.sat) * (1 - Math.pow(0.1, dt));
      if (renderer.fx.sat > 0.99) { renderer.fx.sat = 1; state.satBack = false; }
    }
    if (state.phase === 'finale' && now > state.finaleUntil) endFinale();
    if (state.brk) {
      state.brk.left -= dt;
      var bl = Math.max(0, state.brk.left);
      $('breakFill').style.width = (bl / state.brk.secs * 100) + '%';
      $('breakTime').textContent = Math.ceil(bl) + 's';
      var st = state.brk.pg.status();
      if (st !== state.brk.lastStatus) { $('breakStatus').textContent = st; state.brk.lastStatus = st; }
      if (state.brk.left <= 0) endBreak();
    }

    renderer.update(dt);
    renderer.updateCamera(dt, focusPoint(now));
    var fm = flickable();
    if (!stageHidden()) renderer.draw({
      track: track, pg: state.brk && state.brk.pg, flick: state.brk ? null : (fm || restingMarble()), locked: !fm || now < state.readyAt,
      kept: keepOn() ? machine().kept : null, aim: state.aim, preview: aimPreview(), lead: state.running ? leadMarble() : null, pulse: promptPulses(),
      grand: machine().complete && machine().playFrom === 0
    }, now);
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- startup
  function init() {
    renderer = new Renderer($('world'), { lofi: params.get('lofi') === '1', reduced: reduced, quality: params.has('q0') ? 0 : null });
    machine();
    // loaded in the middle of a run: that flick was spent (and paid for) before it played, so it does not come back
    (function () { var m0 = machine(); if (m0.spent) { m0.spent = false; m0.playFrom = m0.complete ? 0 : null; progress.save(); } })();
    world = new Phys.World();
    track = new Track(world, machine(), { emit: onEvent, now: nowS() }); wireTrack();
    renderer.setTheme(progress.store.cases);
    renderer.tweenFrom(track, {}, nowS(), { fresh: true });
    state.readyAt = nowS() + 1.4;
    renderer.cam.x = 2; renderer.cam.y = 8;
    renderer.heat = renderer.heatTarget = Math.min(1, progress.store.streak / 12);
    var m = machine();
    if (m.playFrom !== null && track.sections[m.playFrom]) track.placeStars(m.playFrom);

    $('check').addEventListener('click', function () { Sound.init(); checkAnswer(); });
    $('next').addEventListener('click', function () { Sound.init(); showQuestion(); });
    setupPointer();
    $('stage').addEventListener('pointerenter', function () { state.hover = true; });
    $('stage').addEventListener('pointerleave', function () { state.hover = false; });
    $('mute').addEventListener('click', function () { Sound.init(); Sound.muted = !Sound.muted; this.textContent = Sound.muted ? '🔇' : '🔊'; });
    $('fast').addEventListener('click', function () { state.fast = !state.fast; this.classList.toggle('on', state.fast); this.setAttribute('aria-pressed', state.fast); });
    $('finaleNext').addEventListener('click', endFinale);
    $('ciGo').addEventListener('click', function () { if (state.picked) deploy(state.picked); });
    $('chestToggle').addEventListener('click', function () {
      var body = $('chestBody'), open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', open);
      if (!open) { state.picked = null; renderChest(); }
    });
    $('sectionToggle').addEventListener('click', function () {
      var body = $('sectionBody'), open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', open);
    });
    $('sectionGo').addEventListener('click', startSection);
    $('sBack').addEventListener('click', function () { var S = state.sect; if (S && S.i > 0) { S.i--; showSectionQuestion(); } });
    $('sNext').addEventListener('click', function () { var S = state.sect; if (!S) return; if (S.i < S.qs.length - 1) { S.i++; showSectionQuestion(); } else showSectionReview(); });
    $('sLeave').addEventListener('click', leaveSection);
    $('sHide').addEventListener('click', function () { setClockHidden(!clockHidden()); updateSectionClock(); });
    $('dossierToggle').addEventListener('click', function () {
      var body = $('dossierBody'), open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', open);
      if (open) { state.newStatements = 0; dossierKey = ''; renderDossier(); }
    });
    $('backStudy').addEventListener('click', function () { setView('study'); });
    $('tabStudy').addEventListener('click', function () { setView('study'); });
    $('tabMachine').addEventListener('click', function () { setView('machine'); });
    $('playNow').addEventListener('click', function () { setView('machine'); });
    $('mysteryToggle').addEventListener('click', function () {
      var body = $('mysteryBody'), open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', open);
      if (open) { state.newClues = 0; mysteryKey = ''; renderMystery(); }
    });
    $('breakEnd').addEventListener('click', endBreak);
    $('reset').addEventListener('click', function () {
      if (confirm('Erase all saved progress on this device, including the cold case file?')) {
        if (state.brk) endBreak();
        if (state.sect) hideSection(false);
        progress.reset(); progress.newMachine(); state.gold = false; state.queued = 0; state.phase = 'play'; state.picked = null; state.unrevealed = {}; rollQueue.length = 0;
        $('finale').classList.remove('show');
        state.newClues = 0; hideSuspects();
        renderer.heatTarget = 0; rebuild({ fresh: true }); showQuestion(); introMystery();
      }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'f' || e.key === 'F') && state.view === 'machine' && canFlick()) { var ex = track.exitFor(machine().playFrom); beginRun(ex.dir * 4.5, -2.5); return; }
      if (e.key !== 'Enter' || e.target.tagName === 'BUTTON' || state.sect) return;
      if (!$('check').hidden && !$('check').disabled) checkAnswer(); else if (!$('next').hidden) showQuestion();
    });

    // ask the browser to keep this site's data rather than clearing it under storage pressure
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* optional */ }

    if (fireStory()) fireFound = fireFoundSet();
    updateHud();
    showQuestion(params.get('q'));
    introMystery();

    if (progress.restoredChest) setTimeout(function () { toast('🧰 Your chest of items was recovered.', 4000); }, 500);
    var cc = progress.coldCount(bank);
    if (cc && progress.store.total > 0) {
      setTimeout(function () { toast('🗂 Welcome back. ' + cc + ' cold case' + (cc > 1 ? 's' : '') + ' on file: each one solved earns a gold marble and a bonus toy.', 6000); }, 900);
    } else if (progress.restoredFromCookie) {
      setTimeout(function () { toast('🗂 Your cold case file was recovered.', 4000); }, 900);
    }

    requestAnimationFrame(frame);

    // test + debugging hook
    window.__sat = {
      get renderer() { return renderer; }, get view() { return state.view; }, get track() { return track; }, get world() { return world; },
      state: state, progress: progress, onCorrectForTest: function () { var r = progress.record(state.current, true); afterRecord(r); award(state.current, r); updateHud(); },
      deploy: deploy, endBreak: endBreak, refresh: updateHud, promptPulses: promptPulses, section: { start: startSection, finish: finishSection, leave: leaveSection, review: function () { if (state.sect) showSectionReview(); }, tick: function (secs) { if (state.sect) { state.sect.elapsed += secs; updateSectionClock(); } }, get state() { return state.sect; } },
      rebuild: rebuild, mystery: mystery, cluesFound: cluesFound, setView: setView, stageHidden: stageHidden, showDueClue: showDueClue,
      advance: function (secs) {
        for (var i = 0; i < secs * 60; i++) { var hold = false; if (state.brk) { state.brk.pg.step(1 / 60); hold = state.brk.pg.holdWorld; } if (!hold) { world.step(1 / 60); track.tick(1 / 60, nowS()); } if (state.running) track.collectStars(); renderer.update(1 / 60); renderer.updateCamera(1 / 60, focusPoint(nowS())); if (state.phase === 'finale' && nowS() > state.finaleUntil) endFinale(); }
      },
      focusPoint: function () { return focusPoint(nowS()); },
      flick: beginRun, canFlick: canFlick, flickable: flickable, machine: machine, endFinale: endFinale, showQuestion: showQuestion
    };
  }
  window.addEventListener('load', init);
})();
