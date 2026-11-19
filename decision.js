// ═══════════════════════════════════
// BarkadaHub — decision.js
// Coin flip, Yes/No, Random number
// ═══════════════════════════════════

function switchDecision(panel, btn) {
  document.querySelectorAll('.decision-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.decision-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + panel).classList.add('active');
  btn.classList.add('active');
}

// ── Coin flip ───────────────────────────
let coinFlipping = false;

function flipCoin() {
  if (coinFlipping) return;
  coinFlipping = true;
  const coin   = document.getElementById('coin');
  const result = Math.random() < 0.5;
  coin.classList.remove('flip-heads', 'flip-tails');
  void coin.offsetWidth; // force reflow
  coin.classList.add(result ? 'flip-heads' : 'flip-tails');
  document.getElementById('coin-result').textContent = '';
  setTimeout(() => {
    document.getElementById('coin-result').textContent = result ? '⭐ HEADS!' : '💫 TAILS!';
    coinFlipping = false;
  }, 1300);
}

// ── Yes / No ────────────────────────────
function doYesNo() {
  const answers = [
    'YES! ✅', 'NO ❌', 'DEFINITELY! 🎉', 'Nope 🙅',
    'For sure!', 'No way!', 'Oo naman!', 'Hindi pwede',
    'Go for it! 🚀', 'Better not…',
  ];
  const display = document.getElementById('yesno-display');
  let i = 0;
  const spin = setInterval(() => {
    display.textContent = Math.random() > 0.5 ? 'YES' : 'NO';
    i++;
    if (i > 15) {
      clearInterval(spin);
      const ans = answers[Math.floor(Math.random() * answers.length)];
      display.textContent = ans;
      const isNo = ['NO', 'No', 'Hindi', 'not', 'Nope'].some(w => ans.includes(w));
      display.style.color = isNo ? 'var(--accent2)' : 'var(--accent3)';
    }
  }, 80);
}

// ── Random number ───────────────────────
function doNumber() {
  const min     = parseInt(document.getElementById('num-min').value) || 1;
  const max     = parseInt(document.getElementById('num-max').value) || 100;
  const display = document.getElementById('num-display');
  let i = 0;
  const spin = setInterval(() => {
    display.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
    i++;
    if (i > 20) {
      clearInterval(spin);
      display.style.color = 'var(--accent)';
    }
  }, 60);
}
