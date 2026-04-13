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

// All grouped rows for chart rendering
const ALL_ROW_GROUPS = {
  basic:       BASIC_ROWS,
  dakuten:     DAKUTEN_ROWS,
  handakuten:  HANDAKUTEN_ROWS,
  combination: COMBINATION_ROWS,
};

// ── Settings state ────────────────────────────────────────────────────────────
const settings = {
  basic:       true,
  dakuten:     false,
  handakuten:  false,
  combination: false,
};

// Load from localStorage
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

  // Ensure at least one is checked
  const anyOn = Object.values(settings).some(Boolean);
  if (!anyOn) {
    settings.basic = true;
    document.getElementById('cfg-basic').checked = true;
  }

  try { localStorage.setItem('hiragana-settings', JSON.stringify(settings)); } catch(e) {}

  // Reset history when pool changes
  history = [];

  updatePoolInfo();
}

function updatePoolInfo() {
  const pool = getActiveKanaPool();
  const el = document.getElementById('settings-pool-info');
  if (el) el.textContent = pool.length + ' characters in practice pool';
}

// ── Settings modal ────────────────────────────────────────────────────────────
function openSettings() {
  // Sync checkboxes with current state
  document.getElementById('cfg-basic').checked       = settings.basic;
  document.getElementById('cfg-dakuten').checked     = settings.dakuten;
  document.getElementById('cfg-handakuten').checked  = settings.handakuten;
  document.getElementById('cfg-combination').checked = settings.combination;
  updatePoolInfo();
  document.getElementById('settings-overlay').classList.remove('hidden');
  // trigger animation
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
          <span class="chevron">▼</span>
        </div>
      </div>
      <div class="row-body">
        ${row.chars.map((c,i)=>`
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

// Initial chart build
buildChart('basic');

// ── Screen switching ──────────────────────────────────────────────────────────
function startPractice() {
  document.getElementById('screen-menu').classList.add('hidden');
  document.getElementById('screen-practice').classList.remove('hidden');
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
const charEl       = document.getElementById('character');
const charWrapper  = document.getElementById('char-wrapper');
const answerEl     = document.getElementById('answer');
const feedbackEl   = document.getElementById('feedback');
const btnCheck     = document.getElementById('btn-check');
const btnSkip      = document.getElementById('btn-skip');
const btnNext      = document.getElementById('btn-next');
const btnCheckRow  = document.getElementById('btn-check-row');
const statC        = document.getElementById('stat-correct');
const statW        = document.getElementById('stat-wrong');
const rowBadge     = document.getElementById('row-badge');
const romajiHint   = document.getElementById('romaji-hint');
const progressBar  = document.getElementById('progress-bar');

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
  btnCheckRow.style.display = '';
  btnNext.classList.remove('visible');
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
    answerEl.focus();
  }, 180);
}

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
    stats.correct++; statC.textContent = stats.correct;
    feedbackEl.innerHTML = '<span>✓</span> Correct!';
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
    stats.wrong++; statW.textContent = stats.wrong;
    feedbackEl.innerHTML = '<span>✗</span> Salah, coba lagi';
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
  romajiHint.textContent = '→ ' + current.romaji[0];
  romajiHint.classList.add('visible');
  feedbackEl.innerHTML = '↷ Skipped — answer: <strong>' + current.romaji[0] + '</strong>';
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
