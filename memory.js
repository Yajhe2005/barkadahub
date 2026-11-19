// ═══════════════════════════════════
// BarkadaHub — memory.js
// Memory card matching game
// ═══════════════════════════════════

const MEM_EMOJIS = [
  '🍕','🎮','📚','☕','🎵','🌙',
  '⚡','🎯','🏆','🌸','🦊','🎲',
];

let memCols    = 4;
let memPairs   = 8;
let memFlipped = [];
let memMatched = 0;
let memMoves   = 0;
let memTimer   = null;
let memSecs    = 0;
let memLocked  = false;

// ── Difficulty ──────────────────────────
function setMemDiff(cols, btn) {
  document.querySelectorAll('.mem-diff-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  memCols  = cols;
  memPairs = cols === 4 ? 8 : 10;
  initMemory();
}

// ── Stop timer ──────────────────────────
function memStop() {
  clearInterval(memTimer);
}

// ── Init / Shuffle ──────────────────────
function initMemory() {
  clearInterval(memTimer);
  memSecs = 0; memMoves = 0; memMatched = 0;
  memFlipped = []; memLocked = false;

  document.getElementById('mem-moves').textContent = '0';
  document.getElementById('mem-pairs').textContent = '0';
  document.getElementById('mem-time').textContent  = '0:00';
  document.getElementById('mem-win').style.display = 'none';

  const emojis = MEM_EMOJIS.slice(0, memPairs);
  const deck   = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  const board = document.getElementById('mem-board');
  board.style.gridTemplateColumns = `repeat(${memCols}, 1fr)`;
  board.innerHTML = '';

  deck.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className    = 'mem-card';
    card.dataset.idx   = i;
    card.dataset.emoji = emoji;
    card.innerHTML = `
      <div class="mem-card-inner">
        <div class="mem-card-front"></div>
        <div class="mem-card-back">${emoji}</div>
      </div>
    `;
    card.addEventListener('click', () => memFlip(card));
    board.appendChild(card);
  });

  // Start timer
  memTimer = setInterval(() => {
    memSecs++;
    const m = Math.floor(memSecs / 60);
    const s = String(memSecs % 60).padStart(2, '0');
    document.getElementById('mem-time').textContent = m + ':' + s;
  }, 1000);
}

// ── Flip logic ──────────────────────────
function memFlip(card) {
  if (memLocked) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memMoves++;
    document.getElementById('mem-moves').textContent = memMoves;
    memLocked = true;

    const [a, b] = memFlipped;

    if (a.dataset.emoji === b.dataset.emoji) {
      // Match!
      a.classList.add('matched');
      b.classList.add('matched');
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      memMatched++;
      document.getElementById('mem-pairs').textContent = memMatched;
      memFlipped = [];
      memLocked  = false;

      if (memMatched === memPairs) memWin();
    } else {
      // No match — flip back after delay
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked  = false;
      }, 900);
    }
  }
}

// ── Win ─────────────────────────────────
function memWin() {
  clearInterval(memTimer);
  const win = document.getElementById('mem-win');
  win.style.display = 'block';
  const m = Math.floor(memSecs / 60);
  const s = String(memSecs % 60).padStart(2, '0');
  document.getElementById('mem-win-text').textContent =
    `${memMoves} moves · ${m}:${s} · ${memPairs} pairs matched!`;
}
