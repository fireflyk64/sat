/*
 * Game glue: question selection (Leitner-style spaced repetition), grading, skill meters,
 * and the domino-run state machine.
 *
 *   correct answer -> build one more section of the run
 *   every 5th correct answer -> earn a marble
 *   release a marble -> it rolls down, toppling dominoes
 *   once a marble's run is over, the NEXT correct answer wipes the board and starts a fresh random run
 */
(function () {
  'use strict';

  var MAX_SECTIONS = 500, BALL_EVERY = 5, STORE_KEY = 'sat-grey-cells-v1';
  var DAY = 86400000, INTERVALS = [0, 1, 3, 7, 14, 30].map(function (d) { return d * DAY; });

  var $ = function (id) { return document.getElementById(id); };
  var world, track, renderer;
  var items = window.SAT_QUESTIONS || [];
  var store = load();
  var state = { choice: { dir: 1, kind: 'dominoes' }, spent: false, toppled: 0, current: null, ctrl: null, answered: false, last: null };

  // ---------- persistence ----------
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.items) return s;
    } catch (e) { /* private mode etc. */ }
    return { items: {}, skills: {}, balls: 0, total: 0 };
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ } }

  // ---------- run management ----------
  function newRun() {
    if (world) world.clear();
    world = new Phys.World();
    track = new Track(world);
    state.spent = false; state.toppled = 0;
    if (renderer) { renderer.trails = {}; renderer.cam.x = 0; renderer.cam.y = 6; renderer.cam.follow = true; }
    Sound.resetNotes();
    world.onImpact = onImpact;
    updateHud();
  }
  function onImpact(a, b, x, y, imp) {
    var da = a.userData && a.userData.kind === 'domino' ? a : null, db = b.userData && b.userData.kind === 'domino' ? b : null;
    var dom = da || db;
    if (dom && imp > 0.04) {
      if (!dom.fell && Math.abs(dom.a - track.sections[dom.userData.section].a) > 0.35) { dom.fell = true; state.toppled++; $('toppled').textContent = state.toppled; }
      Sound.domino(imp);
      renderer.burst(x, y, Math.min(8, 2 + imp | 0), dom.userData.hue, 3);
    }
    var ball = (a.userData && a.userData.kind === 'ball' && a) || (b.userData && b.userData.kind === 'ball' && b);
    if (ball && imp > 4) { renderer.cam.shake = Math.max(renderer.cam.shake, Math.min(3, imp * 0.15)); renderer.burst(x, y, 6, ball.userData.hue, 4); }
  }
  function activeBall() {
    for (var i = track.balls.length - 1; i >= 0; i--) if (!track.balls[i].userData.done) return track.balls[i];
    return null;
  }
  function addSection() {
    if (track.sections.length >= MAX_SECTIONS) return;
    var sec = track.addSection(performance.now(), state.choice);
    renderer.cam.follow = true;
    Sound.place();
    var cx = sec.body.x, cy = sec.body.y;
    renderer.burst(cx, cy, 24, sec.hue, 5);
    renderer.flash = 0.6;
  }
  function onCorrect() {
    if (state.spent) { renderer.confetti(renderer.cam.y, track.baseHue, renderer.cam.x); newRun(); }
    addSection();
    store.total++;
    if (store.total % BALL_EVERY === 0) {
      store.balls++; Sound.fanfare(); renderer.confetti(renderer.cam.y, 200, renderer.cam.x);
      toast('🎉 Marble earned! Release it!');
    }
    save(); updateHud();
  }
  function release() {
    Sound.init();
    if (store.balls < 1 || !track.sections.length) return;
    store.balls--; save(); renderer.cam.follow = true;
    var b = track.spawnBall(performance.now());
    b.userData.t0 = performance.now(); b.userData.still = 0;
    Sound.resetNotes(); Sound.ball();
    renderer.burst(b.x, b.y, 30, b.userData.hue, 6);
    updateHud();
  }
  function tickBalls(dt) {
    for (var i = track.balls.length - 1; i >= 0; i--) {
      var b = track.balls[i], u = b.userData;
      if (u.done) continue;
      var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy), onFloor = b.y > track.bottomY() - 0.7;
      u.still = sp < 0.25 ? u.still + dt : 0;
      u.floorT = onFloor ? (u.floorT || 0) + dt : 0;
      if (u.floorT > 0.5 || (performance.now() - u.t0) / 1000 > 120) { finishBall(b); continue; }
      if (!onFloor && u.still > 1.6) { // stuck in a domino pile: give it a kick downhill
        var sec = track.sections[0];
        for (var k = 0; k < track.sections.length; k++) if (track.sections[k].H.y - 0.6 <= b.y) sec = track.sections[k];
        b.vx += sec.dir * 3.2; b.vy -= 1.5; u.still = 0;
        renderer.burst(b.x, b.y, 14, u.hue, 5);
      }
    }
  }
  function finishBall(b) {
    b.userData.done = true;
    world.remove(b);
    var i = track.balls.indexOf(b); if (i >= 0) track.balls.splice(i, 1);
    state.spent = true;
    renderer.confetti(b.y, 120, b.x);
    toast('Run complete: ' + state.toppled + ' dominoes down. Answer correctly to build a new run!');
    updateHud();
  }

  // ---------- HUD ----------
  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
  function updateHud() {
    var inCycle = store.total % BALL_EVERY;
    var pips = $('pips'); pips.innerHTML = '';
    for (var i = 0; i < BALL_EVERY; i++) { var s = document.createElement('span'); if (i < inCycle) s.className = 'on'; pips.appendChild(s); }
    $('ballcount').textContent = store.balls;
    var rb = $('release'); rb.disabled = store.balls < 1;
    rb.classList.toggle('ready', store.balls > 0);
    $('toppled').textContent = state.toppled;
    $('hint').textContent = state.spent ? 'Run finished. Your next correct answer starts a fresh run.' :
      (inCycle === 0 && store.total === 0 ? 'Answer correctly to build the run.' : (BALL_EVERY - inCycle) + ' more correct for the next marble');
    renderMeters();
  }
  function renderMeters() {
    var host = $('meters'); host.innerHTML = '';
    Object.keys(Quiz.SKILLS).forEach(function (k) {
      var sk = store.skills[k] || { r: 0, t: 0 };
      var row = document.createElement('div'); row.className = 'meter';
      var lab = document.createElement('span'); lab.className = 'ml'; lab.textContent = Quiz.SKILLS[k];
      var cells = document.createElement('span'); cells.className = 'cells';
      var lit = sk.t ? Math.round(5 * sk.r / sk.t) : 0;
      for (var i = 0; i < 5; i++) { var c = document.createElement('i'); if (i < lit) c.className = 'on'; cells.appendChild(c); }
      var sc = document.createElement('span'); sc.className = 'ms'; sc.textContent = sk.t ? sk.r + '/' + sk.t : '–';
      row.appendChild(lab); row.appendChild(cells); row.appendChild(sc); host.appendChild(row);
    });
  }

  // ---------- questions ----------
  function pick() {
    var now = Date.now();
    var pool = items.filter(function (q) { return q !== state.last && !(state.last && q.skill === state.last.skill); });
    if (!pool.length) pool = items.filter(function (q) { return q !== state.last; });   // mix skills, but never run dry
    if (!pool.length) pool = items;
    function rec(q) { return store.items[q.id] || { box: 0, due: 0 }; }
    var due = pool.filter(function (q) { return rec(q).due <= now; });
    if (due.length) { due.sort(function (a, b) { return rec(a).due - rec(b).due || Math.random() - 0.5; }); return due[0]; }
    var minBox = Math.min.apply(null, pool.map(function (q) { return rec(q).box; }));
    var low = pool.filter(function (q) { return rec(q).box === minBox; });
    return low[Math.floor(Math.random() * low.length)];
  }
  function showQuestion(forceId) {
    var q = forceId && items.filter(function (x) { return x.id === forceId; })[0] || pick(); state.current = q; state.last = q; state.answered = false;
    $('feedback').hidden = true; $('feedback').className = '';
    $('qtitle').textContent = q.title; $('qprompt').textContent = q.prompt || '';
    $('qtag').textContent = Quiz.SKILLS[q.skill] || q.skill;
    var body = $('qbody');
    state.ctrl = Quiz.build(q, body, function () { $('check').disabled = !state.ctrl.ready(); });
    if (state.ctrl.prompt) { $('qprompt').textContent = state.ctrl.prompt; $('qtitle').textContent = 'Match the SAT word'; }
    var check = $('check'); check.hidden = false; check.disabled = true;
    $('next').hidden = true;
  }
  function check() {
    var q = state.current, ctrl = state.ctrl;
    if (!ctrl.ready() || state.answered) return;
    state.answered = true;
    var res = ctrl.check(); ctrl.reveal(res);
    var rec = store.items[q.id] || { box: 0, due: 0, seen: 0, right: 0 };
    rec.seen++; if (res.correct) { rec.right++; rec.box = Math.min(rec.box + 1, INTERVALS.length - 1); } else rec.box = 0;
    rec.due = Date.now() + INTERVALS[rec.box] + (res.correct ? 0 : 60000);
    store.items[q.id] = rec;
    var sk = store.skills[q.skill] || (store.skills[q.skill] = { r: 0, t: 0 });
    sk.t++; if (res.correct) sk.r++;
    save();

    var fb = $('feedback'); fb.hidden = false; fb.className = res.correct ? 'good' : 'badfb';
    $('verdict').textContent = res.correct ? 'Elementary! Correct.' : 'Not quite. Study the clue below.';
    $('rule').textContent = q.rule;
    var fx = $('fixedline'); fx.innerHTML = '';
    var tag = document.createElement('b'); tag.textContent = 'Correct version: '; fx.appendChild(tag);
    var fixed = q.fixed || q.text;
    if (q.answer && q.type === 'vocab') {
      var i = fixed.indexOf(q.answer);
      fx.appendChild(document.createTextNode(fixed.slice(0, i)));
      var m = document.createElement('mark'); m.textContent = q.answer; fx.appendChild(m);
      fx.appendChild(document.createTextNode(fixed.slice(i + q.answer.length)));
    } else fx.appendChild(document.createTextNode(fixed));
    $('src').textContent = '— Agatha Christie, ' + q.source.book + ' (Project Gutenberg #' + q.source.gutenberg + ')';
    $('check').hidden = true; $('next').hidden = false; $('next').focus({ preventScroll: true });
    try { fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* old browsers */ }
    if (res.correct) { Sound.correct(); onCorrect(); } else { Sound.wrong(); renderer.cam.shake = 1.5; updateHud(); }
  }

  // ---------- main loop ----------
  var acc = 0, lastT = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now;
    acc += dt;
    var steps = 0;
    while (acc >= 1 / 60 && steps < 4) { world.step(1 / 60); acc -= 1 / 60; steps++; }
    if (steps === 4) acc = 0;
    tickBalls(dt);
    renderer.update(dt);
    renderer.updateCamera({ track: track, activeBall: activeBall }, dt);
    renderer.draw({ track: track, choice: state.choice }, now);
    requestAnimationFrame(frame);
  }

  // ---------- builder: choose how the run grows ----------
  function setupBuilder() {
    var btns = document.querySelectorAll('#builder [data-dir], #builder [data-kind]');
    function sync() {
      btns.forEach(function (b) {
        var on = b.dataset.dir ? +b.dataset.dir === state.choice.dir : b.dataset.kind === state.choice.kind;
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      });
      
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.dir) state.choice.dir = +b.dataset.dir; else state.choice.kind = b.dataset.kind;
        sync();
      });
    });
    sync();
  }

  // ---------- camera: drag / wheel / pinch / buttons ----------
  function setupCamera() {
    var cv = $('world'), pts = {}, lastDist = 0;
    function rel(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); pts[e.pointerId] = rel(e); lastDist = 0; cv.classList.add('drag'); });
    cv.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var p = rel(e), old = pts[e.pointerId], ids = Object.keys(pts);
      if (ids.length === 1) renderer.panPx(p.x - old.x, p.y - old.y);
      else if (ids.length === 2) {
        pts[e.pointerId] = p;
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastDist) renderer.zoomAt(d / lastDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
        lastDist = d;
      }
      pts[e.pointerId] = p;
    });
    function up(e) { delete pts[e.pointerId]; lastDist = 0; if (!Object.keys(pts).length) cv.classList.remove('drag'); }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
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
    $('zin').addEventListener('click', function () { renderer.zoomAt(1.4); });
    $('zout').addEventListener('click', function () { renderer.zoomAt(1 / 1.4); });
    $('fit').addEventListener('click', function () { renderer.fit(track); });
    $('follow').addEventListener('click', function () { renderer.cam.follow = true; renderer.cam.zoom = 1; });
  }

  function init() {
    renderer = new Renderer($('world'));
    newRun();
    $('check').addEventListener('click', function () { Sound.init(); check(); });
    $('next').addEventListener('click', function () { Sound.init(); showQuestion(); });
    var qp = /[?&]q=([\w-]+)/.exec(location.search);
    $('release').addEventListener('click', release);
    setupBuilder(); setupCamera();
    $('mute').addEventListener('click', function () { Sound.muted = !Sound.muted; this.textContent = Sound.muted ? '🔇' : '🔊'; Sound.init(); });
    $('reset').addEventListener('click', function () {
      if (confirm('Erase all saved progress on this device?')) { try { localStorage.removeItem(STORE_KEY); } catch (e) {} store = load(); newRun(); showQuestion(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.target.tagName === 'BUTTON') return;
      if (!$('check').hidden && !$('check').disabled) check(); else if (!$('next').hidden) showQuestion();
    });
    updateHud(); showQuestion(qp && qp[1]);
    requestAnimationFrame(frame);
    window.__sat = { renderer: renderer, get track() { return track; }, get world() { return world; }, state: state, store: store, onCorrect: onCorrect, release: release, show: showQuestion };
  }
  window.addEventListener('load', init);
})();
