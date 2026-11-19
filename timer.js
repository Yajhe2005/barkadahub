// ═══════════════════════════════════
// BarkadaHub — timer.js
// Pomodoro timer logic
// ═══════════════════════════════════

let pomoSeconds  = 25 * 60;
let pomoTotal    = 25 * 60;
let pomoRunning  = false;
let pomoInterval = null;
let pomoCompleted = 0;
let pomoMinutes   = 0;
let pomoStreak    = 0;

const CIRCUMFERENCE = 2 * Math.PI * 105; // r=105

// ── Timer type switcher ──────────────────
function switchTimerType(type) {
  document.querySelectorAll('.timer-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pomo-type-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + type).classList.add('active');
  document.getElementById('tab-' + type).classList.add('active');

  if (type === 'pomodoro') {
    resetFlow();
  } else {
    resetPomo();
  }
}

// ── Pomodoro ────────────────────────────
function setPomoMode(mins, label, btn) {
  resetPomo();
  pomoSeconds = pomoTotal = mins * 60;
  document.getElementById('pomo-mode-label').textContent = label;
  document.querySelectorAll('.pomo-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  updatePomoDisplay();
}

function togglePomo() {
  if (pomoRunning) {
    clearInterval(pomoInterval);
    pomoRunning = false;
    document.getElementById('pomo-start-btn').textContent = 'Resume';
  } else {
    pomoRunning = true;
    document.getElementById('pomo-start-btn').textContent = 'Pause';
    pomoInterval = setInterval(() => {
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoRunning = false;
        pomoCompleted++;
        pomoMinutes += Math.round(pomoTotal / 60);
        pomoStreak++;
        document.getElementById('pomo-completed').textContent = pomoCompleted;
        document.getElementById('pomo-minutes').textContent   = pomoMinutes;
        document.getElementById('pomo-streak').textContent    = '🔥 ' + pomoStreak;
        document.getElementById('pomo-start-btn').textContent = 'Start';
        resetPomo();
        return;
      }
      pomoSeconds--;
      updatePomoDisplay();
    }, 1000);
  }
}

function resetPomo() {
  clearInterval(pomoInterval);
  pomoRunning = false;
  pomoSeconds = pomoTotal;
  document.getElementById('pomo-start-btn').textContent = 'Start';
  updatePomoDisplay();
}

function updatePomoDisplay() {
  const m = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
  const s = String(pomoSeconds % 60).padStart(2, '0');
  document.getElementById('pomo-display').textContent = m + ':' + s;
  const progress = pomoSeconds / pomoTotal;
  const offset   = CIRCUMFERENCE * (1 - progress);
  const ring = document.getElementById('pomo-ring');
  ring.style.strokeDasharray  = CIRCUMFERENCE;
  ring.style.strokeDashoffset = offset;
}

// Init on load
updatePomoDisplay();
