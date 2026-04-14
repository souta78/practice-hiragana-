// ── Audio Context ─────────────────────────────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playCorrectSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const freqs = [523.25, 659.25];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.22, t + i * 0.08 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.38);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.4);
    });
  } catch(e) {}
}

function playWrongSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.18);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.28);
  } catch(e) {}
}

// ── Dataset ───────────────────────────────────────────────────────────────────
const BASIC_ROWS = [
  { name:'Vowels', group:'basic', chars:[
    {char:'あ',romaji:['a']},{char:'い',romaji:['i']},{char:'う',romaji:['u']},
    {char:'え',romaji:['e']},{char:'お',romaji:['o']},
  ]},
  { name:'K-row', group:'basic', chars:[
    {char:'か',romaji:['ka']},{char:'き',romaji:['ki']},{char:'く',romaji:['ku']},
    {char:'け',romaji:['ke']},{char:'こ',romaji:['ko']},
  ]},
  { name:'S-row', group:'basic', chars:[
    {char:'さ',romaji:['sa']},{char:'し',romaji:['shi','si']},{char:'す',romaji:['su']},
    {char:'せ',romaji:['se']},{char:'そ',romaji:['so']},
  ]},
  { name:'T-row', group:'basic', chars:[
    {char:'た',romaji:['ta']},{char:'ち',romaji:['chi','ti']},{char:'つ',romaji:['tsu','tu']},
    {char:'て',romaji:['te']},{char:'と',romaji:['to']},
  ]},
  { name:'N-row', group:'basic', chars:[
    {char:'な',romaji:['na']},{char:'に',romaji:['ni']},{char:'ぬ',romaji:['nu']},
    {char:'ね',romaji:['ne']},{char:'の',romaji:['no']},
  ]},
  { name:'H-row', group:'basic', chars:[
    {char:'は',romaji:['ha']},{char:'ひ',romaji:['hi']},{char:'ふ',romaji:['fu','hu']},
    {char:'へ',romaji:['he']},{char:'ほ',romaji:['ho']},
  ]},
  { name:'M-row', group:'basic', chars:[
    {char:'ま',romaji:['ma']},{char:'み',romaji:['mi']},{char:'む',romaji:['mu']},
    {char:'め',romaji:['me']},{char:'も',romaji:['mo']},
  ]},
  { name:'Y-row', group:'basic', chars:[
    {char:'や',romaji:['ya']},{char:'ゆ',romaji:['yu']},{char:'よ',romaji:['yo']},
  ]},
  { name:'R-row', group:'basic', chars:[
    {char:'ら',romaji:['ra']},{char:'り',romaji:['ri']},{char:'る',romaji:['ru']},
    {char:'れ',romaji:['re']},{char:'ろ',romaji:['ro']},
  ]},
  { name:'W-row', group:'basic', chars:[
    {char:'わ',romaji:['wa']},{char:'を',romaji:['wo','o']},
  ]},
  { name:'N (solo)', group:'basic', chars:[
    {char:'ん',romaji:['n','nn']},
  ]},
];

const DAKUTEN_ROWS = [
  { name:'G-row', group:'dakuten', chars:[
    {char:'が',romaji:['ga']},{char:'ぎ',romaji:['gi']},{char:'ぐ',romaji:['gu']},
    {char:'げ',romaji:['ge']},{char:'ご',romaji:['go']},
  ]},
  { name:'Z-row', group:'dakuten', chars:[
    {char:'ざ',romaji:['za']},{char:'じ',romaji:['ji','zi']},{char:'ず',romaji:['zu']},
    {char:'ぜ',romaji:['ze']},{char:'ぞ',romaji:['zo']},
  ]},
  { name:'D-row', group:'dakuten', chars:[
    {char:'だ',romaji:['da']},{char:'ぢ',romaji:['di','ji']},{char:'づ',romaji:['du','zu']},
    {char:'で',romaji:['de']},{char:'ど',romaji:['do']},
  ]},
  { name:'B-row', group:'dakuten', chars:[
    {char:'ば',romaji:['ba']},{char:'び',romaji:['bi']},{char:'ぶ',romaji:['bu']},
    {char:'べ',romaji:['be']},{char:'ぼ',romaji:['bo']},
  ]},
];

const HANDAKUTEN_ROWS = [
  { name:'P-row', group:'handakuten', chars:[
    {char:'ぱ',romaji:['pa']},{char:'ぴ',romaji:['pi']},{char:'ぷ',romaji:['pu']},
    {char:'ぺ',romaji:['pe']},{char:'ぽ',romaji:['po']},
  ]},
];

const COMBINATION_ROWS = [
  { name:'KY-row', group:'combination', chars:[
    {char:'きゃ',romaji:['kya']},{char:'きゅ',romaji:['kyu']},{char:'きょ',romaji:['kyo']},
  ]},
  { name:'SH-row', group:'combination', chars:[
    {char:'しゃ',romaji:['sha','sya']},{char:'しゅ',romaji:['shu','syu']},{char:'しょ',romaji:['sho','syo']},
  ]},
  { name:'CH-row', group:'combination', chars:[
    {char:'ちゃ',romaji:['cha','tya']},{char:'ちゅ',romaji:['chu','tyu']},{char:'ちょ',romaji:['cho','tyo']},
  ]},
  { name:'NY-row', group:'combination', chars:[
    {char:'にゃ',romaji:['nya']},{char:'にゅ',romaji:['nyu']},{char:'にょ',romaji:['nyo']},
  ]},
  { name:'HY-row', group:'combination', chars:[
    {char:'ひゃ',romaji:['hya']},{char:'ひゅ',romaji:['hyu']},{char:'ひょ',romaji:['hyo']},
  ]},
  { name:'MY-row', group:'combination', chars:[
    {char:'みゃ',romaji:['mya']},{char:'みゅ',romaji:['myu']},{char:'みょ',romaji:['myo']},
  ]},
  { name:'RY-row', group:'combination', chars:[
    {char:'りゃ',romaji:['rya']},{char:'りゅ',romaji:['ryu']},{char:'りょ',romaji:['ryo']},
  ]},
  { name:'GY-row', group:'combination', chars:[
    {char:'ぎゃ',romaji:['gya']},{char:'ぎゅ',romaji:['gyu']},{char:'ぎょ',romaji:['gyo']},
  ]},
  { name:'JY-row', group:'combination', chars:[
    {char:'じゃ',romaji:['ja','jya']},{char:'じゅ',romaji:['ju','jyu']},{char:'じょ',romaji:['jo','jyo']},
  ]},
  { name:'BY-row', group:'combination', chars:[
    {char:'びゃ',romaji:['bya']},{char:'びゅ',romaji:['byu']},{char:'びょ',romaji:['byo']},
  ]},
  { name:'PY-row', group:'combination', chars:[
    {char:'ぴゃ',romaji:['pya']},{char:'ぴゅ',romaji:['pyu']},{char:'ぴょ',romaji:['pyo']},
  ]},
];

const ALL_ROW_GROUPS = {
  basic:       BASIC_ROWS,
  dakuten:     DAKUTEN_ROWS,
  handakuten:  HANDAKUTEN_ROWS,
  combination: COMBINATION_ROWS,
};

// ── Mode state ────────────────────────────────────────────────────────────────
let mode = 'typing';
try {
  const savedMode = localStorage.getItem('hiragana-mode');
  if (savedMode === 'typing' || savedMode === 'multiple') mode = savedMode;
} catch(e) {}

// ── Settings state ────────────────────────────────────────────────────────────
const settings = {
  basic:       true,
  dakuten:     false,
  handakuten:  false,
  combination: false,
};

try {
  const saved = JSON.parse(localStorage.getItem('hiragana-settings'));
  if (saved) Object.assign(settings, saved);
} catch(e) {}

function getActiveKanaPool() {
  const rows = [
    ...(settings.basic       ? BASIC_ROWS       : []),
    ...(settings.dakuten     ? DAKUTEN_ROWS      : []),
    ...(settings.handakuten  ? HANDAKUTEN_ROWS   : []),
    ...(settings.combination ? COMBINATION_ROWS  : []),
  ];
  return rows.flatMap(r => r.chars.map(c => ({...c, row: r.name})));
}

function applySettings() {
  settings.basic       = document.getElementById('cfg-basic').checked;
  settings.dakuten     = document.getElementById('cfg-dakuten').checked;
  settings.handakuten  = document.getElementById('cfg-handakuten').checked;
  settings.combination = document.getElementById('cfg-combination').checked;

  const anyOn = Object.values(settings).some(Boolean);
  if (!anyOn) {
    settings.basic = true;
    document.getElementById('cfg-basic').checked = true;
  }

  try { localStorage.setItem('hiragana-settings', JSON.stringify(settings)); } catch(e) {}
  history = [];
  updatePoolInfo();
}

function updatePoolInfo() {
  const pool = getActiveKanaPool();
  const el = document.getElementById('settings-pool-info');
  if (el) el.textContent = pool.length + ' characters in practice pool';
}

// ── Mode switching ────────────────────────────────────────────────────────────
function setMode(m) {
  mode = m;
  try { localStorage.setItem('hiragana-mode', mode); } catch(e) {}
  document.getElementById('mode-btn-typing').classList.toggle('active', mode === 'typing');
  document.getElementById('mode-btn-multiple').classList.toggle('active', mode === 'multiple');
}

function renderModeUI() {
  const inputRow = document.querySelector('.input-row');
  const hintRow  = document.querySelector('.hint-row');

  if (mode === 'typing') {
    if (inputRow) inputRow.style.display = '';
    if (hintRow)  hintRow.style.display  = '';
    btnCheckRow.style.display = '';
    choicesEl.classList.add('hidden');
    choicesEl.innerHTML = '';
  } else {
    if (inputRow) inputRow.style.display = 'none';
    if (hintRow)  hintRow.style.display  = 'none';
    btnCheckRow.style.display = 'none';
    choicesEl.classList.remove('hidden');
  }
}

// ── Settings modal ────────────────────────────────────────────────────────────
function openSettings() {
  document.getElementById('mode-btn-typing').classList.toggle('active', mode === 'typing');
  document.getElementById('mode-btn-multiple').classList.toggle('active', mode === 'multiple');
  document.getElementById('cfg-basic').checked       = settings.basic;
  document.getElementById('cfg-dakuten').checked     = settings.dakuten;
  document.getElementById('cfg-handakuten').checked  = settings.handakuten;
  document.getElementById('cfg-combination').checked = settings.combination;
  updatePoolInfo();
  document.getElementById('settings-overlay').classList.remove('hidden');
  requestAnimationFrame(() => {
    document.getElementById('settings-overlay').classList.add('visible');
  });
}

function closeSettings() {
  const overlay = document.getElementById('settings-overlay');
  overlay.classList.remove('visible');
  setTimeout(() => overlay.classList.add('hidden'), 250);
}

function closeSettingsOnBackdrop(e) {
  if (e.target === document.getElementById('settings-overlay')) closeSettings();
}

// ── Build chart ───────────────────────────────────────────────────────────────
let currentChartGroup = 'basic';

function buildChart(groupKey) {
  const rows = ALL_ROW_GROUPS[groupKey];
  const container = document.getElementById('chart-rows');
  container.innerHTML = '';

  rows.forEach((row, ri) => {
    const group = document.createElement('div');
    group.className = 'row-group' + (ri === 0 ? ' open' : '');
    const preview = row.chars.slice(0,4).map(c=>c.char).join('') + (row.chars.length > 4 ? '…' : '');
    group.innerHTML = `
      <div class="row-header" onclick="this.parentElement.classList.toggle('open')">
        <div class="row-header-left">
          <span class="row-preview">${preview}</span>
          <span class="row-name">${row.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="row-count">${row.chars.length} chars</span>
          <span class="chevron">&#9660;</span>
        </div>
      </div>
      <div class="row-body">
        ${row.chars.map((c,i) => `
          <div class="kana-card" style="animation-delay:${i*25}ms">
            <span class="kana">${c.char}</span>
            <span class="roma">${c.romaji[0]}</span>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(group);
  });
}

function switchChartTab(btn, groupKey) {
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentChartGroup = groupKey;
  buildChart(groupKey);
}

buildChart('basic');

// ── Screen switching ──────────────────────────────────────────────────────────
function startPractice() {
  document.getElementById('screen-menu').classList.add('hidden');
  document.getElementById('screen-practice').classList.remove('hidden');
  renderModeUI();
  showNewChar();
}

function goToMenu() {
  document.getElementById('screen-practice').classList.add('hidden');
  document.getElementById('screen-menu').classList.remove('hidden');
}

// ── State ─────────────────────────────────────────────────────────────────────
let current    = null;
let answered   = false;
let wrongCount = 0;
let stats      = { correct: 0, wrong: 0 };
let history    = [];
const HISTORY_LEN = 5;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const charEl      = document.getElementById('character');
const charWrapper = document.getElementById('char-wrapper');
const answerEl    = document.getElementById('answer');
const feedbackEl  = document.getElementById('feedback');
const btnCheck    = document.getElementById('btn-check');
const btnSkip     = document.getElementById('btn-skip');
const btnNext     = document.getElementById('btn-next');
const btnCheckRow = document.getElementById('btn-check-row');
const rowBadge    = document.getElementById('row-badge');
const romajiHint  = document.getElementById('romaji-hint');
const progressBar = document.getElementById('progress-bar');
const choicesEl   = document.getElementById('choices');

// ── Helpers ───────────────────────────────────────────────────────────────────
function pickRandom() {
  const pool = getActiveKanaPool();
  let candidates = pool.filter(h => !history.includes(h.char));
  if (!candidates.length) { history = []; candidates = pool; }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  history.push(pick.char);
  if (history.length > HISTORY_LEN) history.shift();
  return pick;
}

function updateProgress() {
  const total = stats.correct + stats.wrong;
  progressBar.style.width = (total === 0 ? 0 : Math.round((stats.correct / total) * 100)) + '%';
}

function resetCard() {
  answerEl.value         = '';
  answerEl.className     = '';
  answerEl.disabled      = false;
  feedbackEl.textContent = '';
  feedbackEl.className   = 'feedback';
  charWrapper.className  = 'char-wrapper';
  romajiHint.textContent = '';
  romajiHint.classList.remove('visible');
  btnSkip.classList.add('hidden');
  btnNext.classList.remove('visible');

  if (mode === 'typing') {
    btnCheckRow.style.display = '';
    choicesEl.innerHTML = '';
    choicesEl.classList.add('hidden');
  } else {
    btnCheckRow.style.display = 'none';
    choicesEl.innerHTML = '';
    choicesEl.classList.remove('hidden');
  }
}

function showNewChar() {
  charEl.classList.add('hide');
  setTimeout(() => {
    current    = pickRandom();
    answered   = false;
    wrongCount = 0;

    charEl.textContent = current.char;
    charEl.classList.remove('hide', 'appear');
    void charEl.offsetWidth;
    charEl.classList.add('appear');

    rowBadge.textContent = current.row;
    resetCard();

    if (mode === 'multiple') {
      renderChoices();
    } else {
      answerEl.focus();
    }
  }, 180);
}

// ── Multiple Choice ───────────────────────────────────────────────────────────
function generateChoices() {
  const correct = current.romaji[0];
  const pool = getActiveKanaPool().filter(k => k.char !== current.char);

  const shuffled = pool.sort(() => Math.random() - 0.5);
  const seen = new Set([correct]);
  const wrongs = [];

  for (const k of shuffled) {
    const r = k.romaji[0];
    if (!seen.has(r)) {
      seen.add(r);
      wrongs.push(r);
      if (wrongs.length === 3) break;
    }
  }

  // Fallback if pool too small
  if (wrongs.length < 3) {
    const fallback = BASIC_ROWS
      .flatMap(r => r.chars.map(c => c.romaji[0]))
      .filter(r => !seen.has(r));
    while (wrongs.length < 3 && fallback.length) {
      const idx = Math.floor(Math.random() * fallback.length);
      const r = fallback.splice(idx, 1)[0];
      seen.add(r);
      wrongs.push(r);
    }
  }

  return [...wrongs, correct].sort(() => Math.random() - 0.5);
}

function renderChoices() {
  choicesEl.innerHTML = '';
  const options = generateChoices();

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleChoice(opt, btn));
    choicesEl.appendChild(btn);
  });
}

function handleChoice(chosen, clickedBtn) {
  if (answered) return;
  answered = true;

  const isCorrect = current.romaji.includes(chosen);
  const correctRomaji = current.romaji[0];

  choicesEl.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (current.romaji.includes(b.textContent)) {
      b.classList.add('choice-correct');
    }
  });

  if (isCorrect) {
    playCorrectSound();
    stats.correct++;
    feedbackEl.innerHTML = '<span>&#10003;</span> Correct!';
    feedbackEl.className = 'feedback correct';
    charWrapper.classList.add('correct');
  } else {
    playWrongSound();
    stats.wrong++;
    clickedBtn.classList.add('choice-wrong');
    feedbackEl.innerHTML = '<span>&#10007;</span> Wrong &mdash; it\'s <strong>' + correctRomaji + '</strong>';
    feedbackEl.className = 'feedback incorrect';
    charWrapper.classList.add('incorrect');
  }

  romajiHint.textContent = correctRomaji;
  romajiHint.classList.add('visible');
  btnNext.classList.add('visible');
  updateProgress();
}

// ── Typing mode ───────────────────────────────────────────────────────────────
function checkAnswer() {
  if (answered) return;
  const val = answerEl.value.trim().toLowerCase();
  if (!val) {
    answerEl.classList.add('shake');
    answerEl.addEventListener('animationend', () => answerEl.classList.remove('shake'), { once: true });
    return;
  }

  if (current.romaji.includes(val)) {
    playCorrectSound();
    answered = true;
    stats.correct++;
    feedbackEl.innerHTML = '<span>&#10003;</span> Correct!';
    feedbackEl.className = 'feedback correct';
    answerEl.classList.add('correct-input');
    charWrapper.classList.add('correct');
    romajiHint.textContent = current.romaji[0];
    romajiHint.classList.add('visible');
    btnCheckRow.style.display = 'none';
    btnNext.classList.add('visible');
  } else {
    playWrongSound();
    wrongCount++;
    stats.wrong++;
    feedbackEl.innerHTML = '<span>&#10007;</span> Salah, coba lagi';
    feedbackEl.className = 'feedback incorrect';
    answerEl.classList.remove('correct-input');
    answerEl.classList.add('incorrect-input', 'shake');
    charWrapper.classList.add('incorrect');
    answerEl.addEventListener('animationend', () => answerEl.classList.remove('shake'), { once: true });
    if (wrongCount >= 1) btnSkip.classList.remove('hidden');
    setTimeout(() => {
      answerEl.classList.remove('incorrect-input');
      charWrapper.classList.remove('incorrect');
      answerEl.value = '';
      answerEl.focus();
    }, 700);
  }
  updateProgress();
}

function skipChar() {
  romajiHint.textContent = '-> ' + current.romaji[0];
  romajiHint.classList.add('visible');
  feedbackEl.innerHTML = 'Skipped &mdash; answer: <strong>' + current.romaji[0] + '</strong>';
  feedbackEl.className = 'feedback incorrect';
  answerEl.disabled = true;
  btnSkip.classList.add('hidden');
  setTimeout(() => showNewChar(), 1400);
}

// ── Events ────────────────────────────────────────────────────────────────────
btnCheck.addEventListener('click', checkAnswer);
btnSkip.addEventListener('click', skipChar);
btnNext.addEventListener('click', showNewChar);

answerEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (answered) showNewChar();
    else checkAnswer();
  }
});

document.addEventListener('pointerdown', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSettings();
});
// ── Quiz Dataset ──────────────────────────────────────────────────────────────
const QUIZ_DATA = [
  { kana: 'ねこ', romaji: 'neko', meaning: 'cat' },
  { kana: 'いぬ', romaji: 'inu', meaning: 'dog' },
  { kana: 'みず', romaji: 'mizu', meaning: 'water' },
  { kana: 'たべる', romaji: 'taberu', meaning: 'eat' },
  { kana: 'のむ', romaji: 'nomu', meaning: 'drink' },
  { kana: 'あさ', romaji: 'asa', meaning: 'morning' },
  { kana: 'よる', romaji: 'yoru', meaning: 'night' },
  { kana: 'はな', romaji: 'hana', meaning: 'flower' },
  { kana: 'やま', romaji: 'yama', meaning: 'mountain' },
  { kana: 'かわ', romaji: 'kawa', meaning: 'river' },
  { kana: 'そら', romaji: 'sora', meaning: 'sky' },
  { kana: 'ほん', romaji: 'hon', meaning: 'book' },
  { kana: 'てがみ', romaji: 'tegami', meaning: 'letter' },
  { kana: 'くるま', romaji: 'kuruma', meaning: 'car' },
  { kana: 'とり', romaji: 'tori', meaning: 'bird' },
  { kana: 'さかな', romaji: 'sakana', meaning: 'fish' },
  { kana: 'きもの', romaji: 'kimono', meaning: 'kimono' },
  { kana: 'むすめ', romaji: 'musume', meaning: 'daughter' },
  { kana: 'ちち', romaji: 'chichi', meaning: 'father' },
  { kana: 'はは', romaji: 'haha', meaning: 'mother' },
  { kana: 'ともだち', romaji: 'tomodachi', meaning: 'friend' },
  { kana: 'がっこう', romaji: 'gakkou', meaning: 'school' },
  { kana: 'でんしゃ', romaji: 'densha', meaning: 'train' },
  { kana: 'たかい', romaji: 'takai', meaning: 'tall / expensive' },
  { kana: 'あおい', romaji: 'aoi', meaning: 'blue' },

  // 🔥 tambahan
  { kana: 'あか', romaji: 'aka', meaning: 'red' },
  { kana: 'しろ', romaji: 'shiro', meaning: 'white' },
  { kana: 'くろ', romaji: 'kuro', meaning: 'black' },
  { kana: 'みどり', romaji: 'midori', meaning: 'green' },

  { kana: 'ひと', romaji: 'hito', meaning: 'person' },
  { kana: 'こども', romaji: 'kodomo', meaning: 'child' },
  { kana: 'おとこ', romaji: 'otoko', meaning: 'man' },
  { kana: 'おんな', romaji: 'onna', meaning: 'woman' },

  { kana: 'いえ', romaji: 'ie', meaning: 'house' },
  { kana: 'へや', romaji: 'heya', meaning: 'room' },
  { kana: 'つくえ', romaji: 'tsukue', meaning: 'desk' },
  { kana: 'いす', romaji: 'isu', meaning: 'chair' },

  { kana: 'パン', romaji: 'pan', meaning: 'bread' },
  { kana: 'ごはん', romaji: 'gohan', meaning: 'rice / meal' },
  { kana: 'りんご', romaji: 'ringo', meaning: 'apple' },
  { kana: 'たまご', romaji: 'tamago', meaning: 'egg' },

  { kana: 'いく', romaji: 'iku', meaning: 'go' },
  { kana: 'くる', romaji: 'kuru', meaning: 'come' },
  { kana: 'みる', romaji: 'miru', meaning: 'see' },
  { kana: 'きく', romaji: 'kiku', meaning: 'listen / ask' },
  { kana: 'いう', romaji: 'iu', meaning: 'say' },

  { kana: 'はやい', romaji: 'hayai', meaning: 'fast / early' },
  { kana: 'おそい', romaji: 'osoi', meaning: 'slow / late' },
  { kana: 'おおきい', romaji: 'ookii', meaning: 'big' },
  { kana: 'ちいさい', romaji: 'chiisai', meaning: 'small' },

  { kana: 'ここ', romaji: 'koko', meaning: 'here' },
  { kana: 'そこ', romaji: 'soko', meaning: 'there' },
  { kana: 'あそこ', romaji: 'asoko', meaning: 'over there' },

  { kana: 'なに', romaji: 'nani', meaning: 'what' },
  { kana: 'だれ', romaji: 'dare', meaning: 'who' },
  { kana: 'いつ', romaji: 'itsu', meaning: 'when' },

  { kana: 'はい', romaji: 'hai', meaning: 'yes' },
  { kana: 'いいえ', romaji: 'iie', meaning: 'no' },

  { kana: 'ありがとう', romaji: 'arigatou', meaning: 'thank you' },
  { kana: 'ごめん', romaji: 'gomen', meaning: 'sorry' },
  // 🔥 tambahan (lanjutan, TANPA duplikat)

{ kana: 'ゆき', romaji: 'yuki', meaning: 'snow' },
{ kana: 'あめ', romaji: 'ame', meaning: 'rain' },
{ kana: 'かぜ', romaji: 'kaze', meaning: 'wind' },
{ kana: 'たいよう', romaji: 'taiyou', meaning: 'sun' },
{ kana: 'つき', romaji: 'tsuki', meaning: 'moon' },

{ kana: 'うみ', romaji: 'umi', meaning: 'sea' },
{ kana: 'みち', romaji: 'michi', meaning: 'road' },
{ kana: 'まち', romaji: 'machi', meaning: 'town' },
{ kana: 'くに', romaji: 'kuni', meaning: 'country' },

{ kana: 'かばん', romaji: 'kaban', meaning: 'bag' },
{ kana: 'くつ', romaji: 'kutsu', meaning: 'shoes' },
{ kana: 'ぼうし', romaji: 'boushi', meaning: 'hat' },
{ kana: 'とけい', romaji: 'tokei', meaning: 'clock / watch' },

{ kana: 'えき', romaji: 'eki', meaning: 'station' },
{ kana: 'みせ', romaji: 'mise', meaning: 'shop' },
{ kana: 'ホテル', romaji: 'hoteru', meaning: 'hotel' },

{ kana: 'せんせい', romaji: 'sensei', meaning: 'teacher' },
{ kana: 'がくせい', romaji: 'gakusei', meaning: 'student' },
{ kana: 'いしゃ', romaji: 'isha', meaning: 'doctor' },

{ kana: 'べんきょう', romaji: 'benkyou', meaning: 'study' },
{ kana: 'しごと', romaji: 'shigoto', meaning: 'work' },
{ kana: 'やすみ', romaji: 'yasumi', meaning: 'rest / holiday' },

{ kana: 'あう', romaji: 'au', meaning: 'meet' },
{ kana: 'かう', romaji: 'kau', meaning: 'buy' },
{ kana: 'うる', romaji: 'uru', meaning: 'sell' },
{ kana: 'まつ', romaji: 'matsu', meaning: 'wait' },
{ kana: 'はなす', romaji: 'hanasu', meaning: 'speak' },

{ kana: 'あたらしい', romaji: 'atarashii', meaning: 'new' },
{ kana: 'ふるい', romaji: 'furui', meaning: 'old' },
{ kana: 'あつい', romaji: 'atsui', meaning: 'hot' },
{ kana: 'さむい', romaji: 'samui', meaning: 'cold (weather)' },
{ kana: 'つめたい', romaji: 'tsumetai', meaning: 'cold (touch)' },

{ kana: 'おいしい', romaji: 'oishii', meaning: 'delicious' },
{ kana: 'まずい', romaji: 'mazui', meaning: 'bad taste' },

{ kana: 'たくさん', romaji: 'takusan', meaning: 'many / a lot' },
{ kana: 'すこし', romaji: 'sukoshi', meaning: 'a little' },
{ kana: 'ぜんぶ', romaji: 'zenbu', meaning: 'all' },

{ kana: 'そして', romaji: 'soshite', meaning: 'and then' },
{ kana: 'でも', romaji: 'demo', meaning: 'but' },

{ kana: 'なか', romaji: 'naka', meaning: 'inside' },
{ kana: 'そと', romaji: 'soto', meaning: 'outside' },
{ kana: 'うえ', romaji: 'ue', meaning: 'above' },
{ kana: 'した', romaji: 'shita', meaning: 'below' },
{ kana: 'まえ', romaji: 'mae', meaning: 'front / before' },
{ kana: 'うしろ', romaji: 'ushiro', meaning: 'behind' },

{ kana: 'ひだり', romaji: 'hidari', meaning: 'left' },
{ kana: 'みぎ', romaji: 'migi', meaning: 'right' },

{ kana: 'きょう', romaji: 'kyou', meaning: 'today' },
{ kana: 'あした', romaji: 'ashita', meaning: 'tomorrow' },
{ kana: 'きのう', romaji: 'kinou', meaning: 'yesterday' },

{ kana: 'じかん', romaji: 'jikan', meaning: 'time' },
{ kana: 'いま', romaji: 'ima', meaning: 'now' },

{ kana: 'おなじ', romaji: 'onaji', meaning: 'same' },
{ kana: 'ちがう', romaji: 'chigau', meaning: 'different' },

{ kana: 'すき', romaji: 'suki', meaning: 'like' },
{ kana: 'きらい', romaji: 'kirai', meaning: 'dislike' },

{ kana: 'できる', romaji: 'dekiru', meaning: 'can / able to' },
{ kana: 'わかる', romaji: 'wakaru', meaning: 'understand' },
{ kana: 'おぼえる', romaji: 'oboeru', meaning: 'remember / learn' },
{ kana: 'わすれる', romaji: 'wasureru', meaning: 'forget' },
];

// ── Quiz state ────────────────────────────────────────────────────────────────
let quizCurrent  = null;
let quizAnswered = false;
let quizHistory  = [];

// DOM refs initialised lazily so they are available after HTML has parsed
let _quizCharEl, _quizCharWrapper, _quizAnswerEl, _quizFeedbackEl,
    _quizBtnCheck, _quizBtnNext, _quizBtnCheckRow, _quizRomajiHint;

function initQuizRefs() {
  if (_quizCharEl) return;
  _quizCharEl      = document.getElementById('quiz-character');
  _quizCharWrapper = document.getElementById('quiz-char-wrapper');
  _quizAnswerEl    = document.getElementById('quiz-answer');
  _quizFeedbackEl  = document.getElementById('quiz-feedback');
  _quizBtnCheck    = document.getElementById('quiz-btn-check');
  _quizBtnNext     = document.getElementById('quiz-btn-next');
  _quizBtnCheckRow = document.getElementById('quiz-btn-check-row');
  _quizRomajiHint  = document.getElementById('quiz-romaji-hint');

  _quizBtnCheck.addEventListener('click', checkQuizAnswer);
  _quizBtnNext.addEventListener('click', showNewQuizWord);
  _quizAnswerEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      if (quizAnswered) showNewQuizWord();
      else checkQuizAnswer();
    }
  });
}

function pickQuizWord() {
  let candidates = QUIZ_DATA.filter(w => !quizHistory.includes(w.kana));
  if (!candidates.length) { quizHistory = []; candidates = QUIZ_DATA; }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  quizHistory.push(pick.kana);
  if (quizHistory.length > 8) quizHistory.shift();
  return pick;
}

function resetQuizCard() {
  _quizAnswerEl.value         = '';
  _quizAnswerEl.className     = '';
  _quizAnswerEl.disabled      = false;
  _quizFeedbackEl.textContent = '';
  _quizFeedbackEl.className   = 'feedback';
  _quizCharWrapper.className  = 'char-wrapper';
  _quizRomajiHint.textContent = '';
  _quizRomajiHint.classList.remove('visible');
  _quizBtnNext.classList.remove('visible');
  _quizBtnCheckRow.style.display = '';
}

function showNewQuizWord() {
  _quizCharEl.classList.add('hide');
  setTimeout(() => {
    quizCurrent  = pickQuizWord();
    quizAnswered = false;

    _quizCharEl.textContent = quizCurrent.kana;
    _quizCharEl.classList.remove('hide', 'appear');
    void _quizCharEl.offsetWidth;
    _quizCharEl.classList.add('appear');

    resetQuizCard();
    _quizAnswerEl.focus();
  }, 180);
}

function checkQuizAnswer() {
  if (quizAnswered) return;
  const val = _quizAnswerEl.value.trim().toLowerCase();
  if (!val) {
    _quizAnswerEl.classList.add('shake');
    _quizAnswerEl.addEventListener('animationend', () => _quizAnswerEl.classList.remove('shake'), { once: true });
    return;
  }

  if (val === quizCurrent.romaji) {
    playCorrectSound();
    quizAnswered = true;
    _quizFeedbackEl.innerHTML = '<span>&#10003;</span> Correct! &mdash; <strong>' + quizCurrent.meaning + '</strong>';
    _quizFeedbackEl.className = 'feedback correct';
    _quizAnswerEl.classList.add('correct-input');
    _quizCharWrapper.classList.add('correct');
    _quizRomajiHint.textContent = quizCurrent.romaji;
    _quizRomajiHint.classList.add('visible');
    _quizBtnCheckRow.style.display = 'none';
    _quizBtnNext.classList.add('visible');
  } else {
    playWrongSound();
    _quizFeedbackEl.innerHTML = '<span>&#10007;</span> Wrong &mdash; answer: <strong>' + quizCurrent.romaji + '</strong> (' + quizCurrent.meaning + ')';
    _quizFeedbackEl.className = 'feedback incorrect';
    _quizAnswerEl.classList.remove('correct-input');
    _quizAnswerEl.classList.add('incorrect-input', 'shake');
    _quizCharWrapper.classList.add('incorrect');
    _quizAnswerEl.addEventListener('animationend', () => _quizAnswerEl.classList.remove('shake'), { once: true });
    quizAnswered = true;
    _quizRomajiHint.textContent = quizCurrent.romaji;
    _quizRomajiHint.classList.add('visible');
    _quizBtnCheckRow.style.display = 'none';
    _quizBtnNext.classList.add('visible');
    setTimeout(() => {
      _quizAnswerEl.classList.remove('incorrect-input');
      _quizCharWrapper.classList.remove('incorrect');
    }, 700);
  }
}

// ── Quiz screen switching ─────────────────────────────────────────────────────
function openQuiz() {
  document.getElementById('screen-menu').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');
  initQuizRefs();
  showNewQuizWord();
}

function backToMenuFromQuiz() {
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-menu').classList.remove('hidden');
}
