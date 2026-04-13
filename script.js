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

    // Two-tone chime: pleasant major third
    const freqs = [523.25, 659.25]; // C5, E5
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
  } catch(e) { /* silently fail if audio unavailable */ }
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
  } catch(e) { /* silently fail */ }
}

// ── Dataset ───────────────────────────────────────────────────────────────────
const ROWS = [
  { name:'Vowels',   chars:[
    {char:'あ',romaji:['a']},
    {char:'い',romaji:['i']},
    {char:'う',romaji:['u']},
    {char:'え',romaji:['e']},
    {char:'お',romaji:['o']},
  ]},
  { name:'K-row', chars:[
    {char:'か',romaji:['ka']},
    {char:'き',romaji:['ki']},
    {char:'く',romaji:['ku']},
    {char:'け',romaji:['ke']},
    {char:'こ',romaji:['ko']},
  ]},
  { name:'S-row', chars:[
    {char:'さ',romaji:['sa']},
    {char:'し',romaji:['shi','si']},
    {char:'す',romaji:['su']},
    {char:'せ',romaji:['se']},
    {char:'そ',romaji:['so']},
  ]},
  { name:'T-row', chars:[
    {char:'た',romaji:['ta']},
    {char:'ち',romaji:['chi','ti']},
    {char:'つ',romaji:['tsu','tu']},
    {char:'て',romaji:['te']},
    {char:'と',romaji:['to']},
  ]},
  { name:'N-row', chars:[
    {char:'な',romaji:['na']},
    {char:'に',romaji:['ni']},
    {char:'ぬ',romaji:['nu']},
    {char:'ね',romaji:['ne']},
    {char:'の',romaji:['no']},
  ]},
  { name:'H-row', chars:[
    {char:'は',romaji:['ha']},
    {char:'ひ',romaji:['hi']},
    {char:'ふ',romaji:['fu','hu']},
    {char:'へ',romaji:['he']},
    {char:'ほ',romaji:['ho']},
  ]},
  { name:'M-row', chars:[
    {char:'ま',romaji:['ma']},
    {char:'み',romaji:['mi']},
    {char:'む',romaji:['mu']},
    {char:'め',romaji:['me']},
    {char:'も',romaji:['mo']},
  ]},
  { name:'Y-row', chars:[
    {char:'や',romaji:['ya']},
    {char:'ゆ',romaji:['yu']},
    {char:'よ',romaji:['yo']},
  ]},
  { name:'R-row', chars:[
    {char:'ら',romaji:['ra']},
    {char:'り',romaji:['ri']},
    {char:'る',romaji:['ru']},
    {char:'れ',romaji:['re']},
    {char:'ろ',romaji:['ro']},
  ]},
  { name:'W-row', chars:[
    {char:'わ',romaji:['wa']},
    {char:'を',romaji:['wo','o']},
  ]},
  { name:'N (solo)', chars:[
    {char:'ん',romaji:['n','nn']},
  ]},
];

// flat list for practice
const hiragana = ROWS.flatMap(r => r.chars.map(c => ({...c, row: r.name})));

// ── Build chart ───────────────────────────────────────────────────────────────
const chartContainer = document.getElementById('chart-rows');
ROWS.forEach((row, ri) => {
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
  chartContainer.appendChild(group);
});

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
  let pool = hiragana.filter(h => !history.includes(h.char));
  if (!pool.length) { history = []; pool = hiragana; }
  const pick = pool[Math.floor(Math.random() * pool.length)];
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
    // ✓ Correct — play sound immediately
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
    // ✗ Wrong — turn red immediately, no delay before showing
    playWrongSound();
    wrongCount++;
    stats.wrong++; statW.textContent = stats.wrong;
    feedbackEl.innerHTML = '<span>✗</span> Salah, coba lagi';
    feedbackEl.className = 'feedback incorrect';

    // Instant red on input + shake
    answerEl.classList.remove('correct-input');
    answerEl.classList.add('incorrect-input', 'shake');
    charWrapper.classList.add('incorrect');

    answerEl.addEventListener('animationend', () => answerEl.classList.remove('shake'), { once: true });

    // Show Skip after first wrong
    if (wrongCount >= 1) btnSkip.classList.remove('hidden');

    // Clear input & red after short delay, keep feedback message
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
    // Resume audio context on first interaction (browser policy)
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (answered) showNewChar();
    else checkAnswer();
  }
});

// Unlock audio context on first tap/click anywhere (mobile)
document.addEventListener('pointerdown', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });
