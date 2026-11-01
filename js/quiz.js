/*
 * Question renderers + exact auto-grading. Each builder returns a controller:
 *   { ready(): bool, check(): {correct, ...}, reveal(result) }
 * and calls onChange() whenever the user's answer changes.
 */
(function (root) {
  'use strict';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function core(w) { return w.replace(/^[^A-Za-z0-9’']+|[^A-Za-z0-9’']+$/g, '').toLowerCase(); }
  function lowerFirst(w) { return w.replace(/[A-Za-z]/, function (c) { return c.toLowerCase(); }); }
  function upperFirst(w) { return w.replace(/[A-Za-z]/, function (c) { return c.toUpperCase(); }); }
  function isCap(w) { var m = w.match(/[A-Za-z]/); return !!m && m[0] === m[0].toUpperCase(); }
  function setEq(a, b) {
    if (a.length !== b.length) return false;
    var s = {}; a.forEach(function (x) { s[x] = 1; });
    return b.every(function (x) { return s[x]; });
  }

  // Fisher-Yates copy: option order is randomised every time an item is shown, so the key is never predictable
  function shuffled(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // "Hello, world." -> [{text:'Hello', comma:true}, {text:'world.', comma:false}]
  function tokenize(text) {
    return text.split(/\s+/).filter(Boolean).map(function (raw) {
      var comma = /,$/.test(raw);
      return { text: comma ? raw.slice(0, -1) : raw, comma: comma };
    });
  }

  /* Shared sentence widget. mode: mark | forge | strip | pick | static */
  function Sentence(host, text, mode, onChange) {
    var self = this;
    this.tokens = tokenize(text);
    this.mode = mode;
    this.words = []; this.gaps = [];
    this.capState = []; this.commaState = []; this.selWords = {}; this.selGaps = {};
    this.picked = -1;
    var wrap = el('div', 'sentence mode-' + mode);
    this.tokens.forEach(function (t, i) {
      var wb = el('button', 'w');
      wb.type = 'button';
      var shown = t.text;
      if (mode === 'mark') { shown = lowerFirst(shown); self.capState[i] = false; }
      wb.textContent = shown;
      if (shown === '___') wb.classList.add('blank');
      self.words.push(wb);
      wrap.appendChild(wb);
      wb.addEventListener('click', function () {
        if (wrap.classList.contains('locked') || shown === '___') return;
        if (mode === 'mark') {
          self.capState[i] = !self.capState[i];
          wb.textContent = self.capState[i] ? upperFirst(shown) : lowerFirst(shown);
          wb.classList.toggle('on', self.capState[i]);
        } else if (mode === 'forge' || mode === 'strip') {
          self.selWords[i] = !self.selWords[i]; wb.classList.toggle('sel', !!self.selWords[i]);
        } else if (mode === 'pick') {
          self.words.forEach(function (b) { b.classList.remove('sel'); });
          self.picked = i; wb.classList.add('sel');
        }
        onChange();
      });
      if (i < self.tokens.length - 1) {
        var gb = el('button', 'g');
        gb.type = 'button';
        gb.setAttribute('aria-label', 'space after ' + t.text);
        self.commaState[i] = false;
        if (mode !== 'mark' && t.comma) { gb.textContent = ','; gb.classList.add('fixed'); }
        else gb.textContent = '';
        self.gaps.push(gb); wrap.appendChild(gb);
        gb.addEventListener('click', function () {
          if (wrap.classList.contains('locked')) return;
          if (mode === 'mark') {
            self.commaState[i] = !self.commaState[i];
            gb.textContent = self.commaState[i] ? ',' : '';
            gb.classList.toggle('on', self.commaState[i]);
          } else if (mode === 'forge') {
            self.selGaps[i] = !self.selGaps[i]; gb.classList.toggle('sel', !!self.selGaps[i]);
          } else return;
          onChange();
        });
      }
    });
    this.wrap = wrap;
    host.appendChild(wrap);
  }
  Sentence.prototype.lock = function () { this.wrap.classList.add('locked'); };

  /* ---------------- mark: commas + capitals ---------------- */
  function buildMark(item, host, onChange) {
    var sent = new Sentence(host, item.text, 'mark', onChange);
    var optional = {}; (item.optionalCommas || []).forEach(function (i) { optional[i] = 1; });
    var n = sent.tokens.length;
    return {
      ready: function () { return true; },
      check: function () {
        var wantC = [], gotC = [], wantK = [], gotK = [];
        sent.tokens.forEach(function (t, i) {
          if (t.comma && i < n - 1) wantC.push(i);
          if (isCap(t.text)) wantK.push(i);
          if (sent.capState[i]) gotK.push(i);
          if (i < n - 1 && sent.commaState[i]) gotC.push(i);
        });
        var gotCReq = gotC.filter(function (i) { return !optional[i] || wantC.indexOf(i) >= 0; });
        var wantCReq = wantC;
        return {
          correct: setEq(gotCReq, wantCReq) && setEq(gotK, wantK),
          wantC: wantC, gotC: gotC, wantK: wantK, gotK: gotK, optional: optional
        };
      },
      reveal: function (r) {
        sent.lock();
        sent.tokens.forEach(function (t, i) {
          if (i < n - 1) {
            var g = sent.gaps[i], want = r.wantC.indexOf(i) >= 0, got = r.gotC.indexOf(i) >= 0;
            if (want && got) g.classList.add('ok');
            else if (want && !got) { g.textContent = ','; g.classList.add('miss'); }
            else if (!want && got && !r.optional[i]) g.classList.add('bad');
          }
          var wk = r.wantK.indexOf(i) >= 0, gk = r.gotK.indexOf(i) >= 0;
          if (wk && gk) sent.words[i].classList.add('ok');
          else if (wk && !gk) { sent.words[i].classList.add('miss'); sent.words[i].textContent = upperFirst(sent.words[i].textContent); }
          else if (!wk && gk) sent.words[i].classList.add('bad');
        });
      }
    };
  }

  /* ---------------- tapfix: tap the word, then pick the fix ---------------- */
  function buildTapFix(item, host, onChange) {
    var hint = el('p', 'step', item.prompt1); host.appendChild(hint);
    // In a wrong-verb question the fix choices are all forms of the verb being asked about, so seeing them first gives step 1
    // away. They stay hidden until he commits to a word. (An agreement question's is/are gives nothing away, so it shows both.)
    var hideChoices = item.skill === 'tense', committed = !hideChoices;
    var commit = null;
    var sent = new Sentence(host, item.text, 'pick', function () {
      if (commit) commit.disabled = sent.picked < 0;
      onChange();
    });
    var targets = [];
    sent.tokens.forEach(function (t, i) { if (item.targetWords.indexOf(core(t.text)) >= 0) targets.push(i); });
    var step2 = el('p', 'step', item.prompt2);
    var chosen = null;
    var opts = el('div', 'options inline');
    if (hideChoices) {
      step2.hidden = true; opts.hidden = true;
      commit = el('button', 'lockword', 'Lock in this verb'); commit.type = 'button'; commit.disabled = true;
      commit.addEventListener('click', function () {
        if (sent.picked < 0) return;
        committed = true; sent.lock(); commit.remove();
        step2.hidden = false; opts.hidden = false;
        onChange();
      });
      host.appendChild(commit);
    }
    host.appendChild(step2);
    var btns = shuffled(item.options).map(function (o) {
      var b = el('button', 'opt', o); b.type = 'button';
      b.addEventListener('click', function () {
        if (opts.classList.contains('locked')) return;
        chosen = o; btns.forEach(function (x) { x.classList.toggle('sel', x === b); }); onChange();
      });
      opts.appendChild(b); return b;
    });
    host.appendChild(opts);
    return {
      ready: function () { return committed && sent.picked >= 0 && chosen != null; },
      check: function () {
        var wordOk = targets.indexOf(sent.picked) >= 0, fixOk = chosen === item.answer;
        return { correct: wordOk && fixOk, wordOk: wordOk, fixOk: fixOk };
      },
      reveal: function (r) {
        sent.lock(); opts.classList.add('locked');
        targets.forEach(function (i) { sent.words[i].classList.add(r.wordOk ? 'ok' : 'miss'); });
        if (!r.wordOk && sent.picked >= 0) sent.words[sent.picked].classList.add('bad');
        btns.forEach(function (b) {
          if (b.textContent === item.answer) b.classList.add('ok');
          else if (b.classList.contains('sel')) b.classList.add('bad');
        });
        if (!r.wordOk && item.hint1) host.appendChild(el('p', 'hintline', item.hint1));
      }
    };
  }

  // "a" or "an" by SOUND: an aardvark / an hour / an unhurried, but a cat / a unique / a Herculean
  var AN_CONSONANT = /^(hour|honest|honor|honour|heir)/i, A_VOWEL = /^(uni|use|usu|uti|eu|one|once|ubiq)/i;
  function article(word) {
    if (AN_CONSONANT.test(word)) return 'an';
    if (A_VOWEL.test(word)) return 'a';
    return /^[aeiou]/i.test(word) ? 'an' : 'a';
  }

  /* ---------------- mc + vocab: multiple choice ---------------- */
  function buildChoice(item, host, onChange) {
    var stem = el('p', 'stem');
    // Vocab items can be asked two ways (same data, same 4 words): fill the blank, or match a meaning to its word
    var fillClue = false, artM = null;
    // SAT-style questions (level 'sat') show no meaning at all: like the real test, the passage has to decide the answer.
    var satStyle = item.level === 'sat';
    var meaning = !satStyle && item.type === 'vocab' && item.definitions && item.definitions[item.answer] && Math.random() < 0.5;
    if (meaning) {
      var d = item.definitions[item.answer].replace(/\.$/, '');
      stem.className = 'stem meaning';
      stem.appendChild(document.createTextNode('\u201C' + d.charAt(0).toUpperCase() + d.slice(1) + '.\u201D'));
    } else {
      if (!satStyle && item.type === 'vocab' && item.definitions && item.definitions[item.answer]) {
        // pin the target: the missing word must fit the sentence AND have this meaning, so only one option can qualify
        var dd = item.definitions[item.answer].replace(/\.$/, '');
        var clue = el('p', 'clue');
        clue.appendChild(el('b', null, 'The missing word means: '));
        clue.appendChild(document.createTextNode('\u201C' + dd + '\u201D'));
        host.appendChild(clue);
        fillClue = true;
      }
      // "a ___" / "an ___": the article moves INTO the choices ("an aardvark" vs "a cat"), so it can't hint at the answer
      artM = item.type === 'vocab' ? item.stem.match(/\b(a|an)\s+___/i) : null;
      var parts = (artM ? item.stem.replace(/\b(a|an)\s+___/i, '___') : item.stem).split('___');
      stem.appendChild(document.createTextNode(parts[0]));
      stem.appendChild(el('span', 'blankline', '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'));
      stem.appendChild(document.createTextNode(parts[1] || ''));
    }
    host.appendChild(stem);
    var chosen = null;
    var opts = el('div', 'options');
    var letters = 'ABCD';
    var btns = shuffled(item.options).map(function (o, i) {
      var b = el('button', 'opt'); b.type = 'button';
      b.appendChild(el('span', 'letter', letters[i]));
      var label = o;
      if (artM) { var ar = article(o); label = (artM[1].charAt(0) === 'A' ? ar.charAt(0).toUpperCase() + ar.slice(1) : ar) + ' ' + o; }
      b.dataset.word = o;
      if (o === '') label = 'no punctuation';   // the choice to add nothing: a blank button would look broken
      b.appendChild(el('span', 'otext', label));
      b.addEventListener('click', function () {
        if (opts.classList.contains('locked')) return;
        chosen = o; btns.forEach(function (x) { x.classList.toggle('sel', x === b); }); onChange();
      });
      opts.appendChild(b); return b;
    });
    host.appendChild(opts);
    return {
      prompt: meaning ? 'Which SAT word matches this meaning?' : (fillClue ? 'Choose the word that has this meaning and fits the blank.' : null),
      ready: function () { return chosen != null; },
      check: function () { return { correct: chosen === item.answer }; },
      reveal: function () {
        opts.classList.add('locked');
        btns.forEach(function (b) {
          var text = b.dataset.word;
          if (text === item.answer) b.classList.add('ok');
          else if (b.classList.contains('sel')) b.classList.add('bad');
          if (item.definitions && item.definitions[text]) {
            b.appendChild(el('span', 'def', item.definitions[text]));
          }
        });
      }
    };
  }

  /* ---------------- forge: find the planted errors ---------------- */
  function buildForge(item, host, onChange) {
    var howMany = item.errors.length === 1 ? 'this statement has 1 error' : 'this statement has ' + item.errors.length + ' errors';
    var count = el('p', 'step', 'Marked: 0 (' + howMany + ')');
    var sent = new Sentence(host, item.text, 'forge', function () {
      var n = Object.keys(sent.selWords).filter(function (k) { return sent.selWords[k]; }).length +
              Object.keys(sent.selGaps).filter(function (k) { return sent.selGaps[k]; }).length;
      count.textContent = 'Marked: ' + n + ' (' + howMany + ')';
      onChange();
    });
    host.insertBefore(count, sent.wrap);
    var wantW = [], wantG = [];
    item.errors.forEach(function (e) {
      for (var i = 0; i < sent.tokens.length; i++) {
        var c = core(sent.tokens[i].text);
        if (e.word && c === e.word) { wantW.push(i); break; }
        if (e.gapAfter && c === e.gapAfter) { wantG.push(i); break; }
      }
    });
    // a comma that good writers use either way, such as after a short opening phrase, is never held against him
    var optional = {};
    (item.optionalGaps || []).forEach(function (w) {
      for (var i = 0; i < sent.tokens.length; i++) if (core(sent.tokens[i].text) === w) { optional[i] = w; break; }
    });
    function sel(map) { return Object.keys(map).filter(function (k) { return map[k]; }).map(Number); }
    return {
      ready: function () { return sel(sent.selWords).length + sel(sent.selGaps).length > 0; },
      check: function () {
        var gw = sel(sent.selWords), gg = sel(sent.selGaps).filter(function (i) { return optional[i] === undefined; });
        var fine = sel(sent.selGaps).filter(function (i) { return optional[i] !== undefined; });
        return { correct: setEq(gw, wantW) && setEq(gg, wantG), gw: gw, gg: gg, fine: fine };
      },
      reveal: function (r) {
        sent.lock();
        wantW.forEach(function (i) { sent.words[i].classList.add(r.gw.indexOf(i) >= 0 ? 'ok' : 'miss'); });
        wantG.forEach(function (i) { sent.gaps[i].classList.add(r.gg.indexOf(i) >= 0 ? 'ok' : 'miss'); });
        r.gw.forEach(function (i) { if (wantW.indexOf(i) < 0) sent.words[i].classList.add('bad'); });
        r.gg.forEach(function (i) { if (wantG.indexOf(i) < 0) sent.gaps[i].classList.add('bad'); });
        r.fine.forEach(function (i) {
          sent.gaps[i].classList.add('fine');
          host.appendChild(el('p', 'hintline', 'A comma after "' + sent.tokens[i].text + '" is fine either way, so it did not count against you.'));
        });
      }
    };
  }

  /* ---------------- strip: cross out (or highlight) one kind of phrase by tapping its words ---------------- */
  // item.mode 'strike' crosses words out, 'highlight' marks them; item.answer lists the word positions (the sentence split on
  // spaces). Striking every prepositional phrase leaves the sentence's core, which is how to find the real subject.
  function buildStrip(item, host, onChange) {
    var strike = item.mode !== 'highlight';
    var count = el('p', 'step', '');
    var sent = new Sentence(host, item.text, 'strip', function () { update(); onChange(); });
    sent.wrap.classList.add(strike ? 'strike' : 'hilite');
    host.insertBefore(count, sent.wrap);
    function sel() { return Object.keys(sent.selWords).filter(function (k) { return sent.selWords[k]; }).map(Number); }
    function update() {
      var n = sel().length;
      count.textContent = (strike ? 'Crossed out: ' : 'Highlighted: ') + n + (n === 1 ? ' word' : ' words');
    }
    update();
    var want = item.answer.slice();
    return {
      ready: function () { return sel().length > 0; },
      check: function () { var got = sel(); return { correct: setEq(got, want), got: got }; },
      reveal: function (r) {
        sent.lock();
        want.forEach(function (i) { sent.words[i].classList.add(r.got.indexOf(i) >= 0 ? 'ok' : 'miss'); });
        r.got.forEach(function (i) { if (want.indexOf(i) < 0) sent.words[i].classList.add('bad'); });
      }
    };
  }

  var BUILDERS = { mark: buildMark, tapfix: buildTapFix, mc: buildChoice, vocab: buildChoice, forge: buildForge, strip: buildStrip };

  root.Quiz = {
    SKILLS: {
      commas: 'Commas', agreement: 'Agreement', tense: 'Tense',
      proofreading: 'Proofreading', vocab: 'Vocabulary', phrases: 'Phrases'
    },
    build: function (item, host, onChange) {
      host.innerHTML = '';
      return BUILDERS[item.type](item, host, onChange);
    },
    article: article,
    el: el
  };
})(window);
