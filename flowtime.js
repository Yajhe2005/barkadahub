// ═══════════════════════════════════════════════════════
// BarkadaHub — flowtime.js
// Flowtime Method timer
//
// How Flowtime works:
//  1. Start working — timer counts UP.
//  2. When you decide to stop, click Stop.
//  3. App suggests a break = ~20% of work time (min 5m).
//  4. Start break — timer counts DOWN the suggested break.
//  5. Repeat.
// ═══════════════════════════════════════════════════════

const FLOW_BREAK_RATIO = 0.2; // 20% of work time
const FLOW_MIN_BREAK   = 5 * 60; // minimum 5 minutes

let flowPhase       = 'idle';   // 'idle' | 'working' | 'break'
let flowSeconds     = 0;        // elapsed seconds in current phase
let flowBreakTarget = 0;        // seconds for current break
let flowInterval    = null;
let flowTotalWork   = 0;        // lifetime work seconds this session
let flowTotalBreak  = 0;        // lifetime break seconds this session
let flowSessions    = 0;        // completed work sessions
let flowLog         = [];       // [{type, duration}]

const FLOW_CIRC = 2 * Math.PI * 105;

// ── Controls ────────────────────────────────────────────
function toggleFlow() {
  if (flowPhase === 'idle') {
    startFlowWork();
  } else if (flowPhase === 'working') {
    stopFlowWork();
  } else if (flowPhase === 'break') {
    endFlowBreak();
  }
}

function startFlowWork() {
  flowPhase   = 'working';
  flowSeconds = 0;
  clearInterval(flowInterval);
  flowInterval = setInterval(flowTick, 1000);
  _setFlowBtn('⏸ Stop Working', 'var(--accent2)');
  _setFlowPhase('Work', false);
  _hideSuggestion();
  updateFlowDisplay();
}

function stopFlowWork() {
  clearInterval(flowInterval);
  flowSessions++;
  flowTotalWork += flowSeconds;

  const workedSecs = flowSeconds;
  flowLog.push({ type: 'work', duration: workedSecs });
  renderFlowLog();

  flowBreakTarget = Math.max(FLOW_MIN_BREAK, Math.round(workedSecs * FLOW_BREAK_RATIO));
  const breakMins = Math.ceil(flowBreakTarget / 60);

  _showSuggestion(`You worked ${_fmt(workedSecs)} — take a ${breakMins}m break! 🌿`);
  _setFlowBtn('☕ Start Break', 'var(--accent3)');
  _setFlowPhase('Break Time!', true);

  flowPhase   = 'break';
  flowSeconds = flowBreakTarget;
  updateFlowDisplay();
  updateFlowStats();
}

function startFlowBreak() {
  clearInterval(flowInterval);
  flowInterval = setInterval(flowTick, 1000);
  _setFlowBtn('⏭ Skip Break', 'var(--surface2)', 'var(--text)');
}

function endFlowBreak() {
  clearInterval(flowInterval);
  const breakTaken = flowBreakTarget - flowSeconds;
  flowTotalBreak += Math.max(0, breakTaken);
  flowLog.push({ type: 'break', duration: Math.max(0, breakTaken) });
  renderFlowLog();
  _hideSuggestion();
  flowPhase = 'idle';
  flowSeconds = 0;
  updateFlowDisplay();
  updateFlowStats();
  _setFlowBtn('Start Working', 'var(--accent4)', '#0d0d0f');
  _setFlowPhase('Ready', false);
}

function resetFlow() {
  clearInterval(flowInterval);
  flowPhase       = 'idle';
  flowSeconds     = 0;
  flowBreakTarget = 0;
  flowTotalWork   = 0;
  flowTotalBreak  = 0;
  flowSessions    = 0;
  flowLog         = [];
  _hideSuggestion();
  updateFlowDisplay();
  updateFlowStats();
  renderFlowLog();
  _setFlowBtn('Start Working', 'var(--accent4)', '#0d0d0f');
  _setFlowPhase('Ready', false);
}

// ── Tick ────────────────────────────────────────────────
function flowTick() {
  if (flowPhase === 'working') {
    flowSeconds++;
  } else if (flowPhase === 'break') {
    flowSeconds--;
    if (flowSeconds <= 0) {
      // Break over!
      endFlowBreak();
      return;
    }
  }
  updateFlowDisplay();
}

// ── Display ─────────────────────────────────────────────
function updateFlowDisplay() {
  const el = document.getElementById('flow-display');
  const ring = document.getElementById('flow-ring');
  const label = document.getElementById('flow-status-label');

  if (flowPhase === 'working') {
    el.textContent = _fmt(flowSeconds);
    label.textContent = 'Working…';
    // Ring counts up (no fixed max, pulse instead)
    ring.style.strokeDasharray  = FLOW_CIRC;
    ring.style.strokeDashoffset = 0;
  } else if (flowPhase === 'break') {
    el.textContent = _fmt(flowSeconds);
    label.textContent = 'On Break';
    const progress = flowSeconds / flowBreakTarget;
    ring.style.strokeDasharray  = FLOW_CIRC;
    ring.style.strokeDashoffset = FLOW_CIRC * (1 - progress);
  } else {
    el.textContent = '00:00';
    label.textContent = 'Ready';
    ring.style.strokeDasharray  = FLOW_CIRC;
    ring.style.strokeDashoffset = FLOW_CIRC;
  }
}

function updateFlowStats() {
  document.getElementById('flow-sessions').textContent   = flowSessions;
  document.getElementById('flow-total-work').textContent = Math.round(flowTotalWork / 60) + 'm';
  document.getElementById('flow-total-break').textContent = Math.round(flowTotalBreak / 60) + 'm';
}

function renderFlowLog() {
  const log = document.getElementById('flow-log');
  if (!flowLog.length) {
    log.innerHTML = '<div class="flow-log-empty">No sessions yet. Start working!</div>';
    return;
  }
  log.innerHTML = [...flowLog].reverse().map((entry, i) => {
    const typeLabel = entry.type === 'work' ? 'Work' : 'Break';
    const cls = entry.type === 'work' ? 'work' : 'brk';
    const n = flowLog.length - i;
    return `<div class="flow-log-item">
      <span class="flow-log-item-type ${cls}">${typeLabel} #${entry.type === 'work' ? flowSessions - i : ''}</span>
      <span class="flow-log-item-dur">${_fmt(entry.duration)}</span>
    </div>`;
  }).join('');
}

// ── Helpers ─────────────────────────────────────────────
function _fmt(secs) {
  const m = String(Math.floor(Math.abs(secs) / 60)).padStart(2, '0');
  const s = String(Math.abs(secs) % 60).padStart(2, '0');
  return m + ':' + s;
}

function _setFlowBtn(text, bg, color = '#0d0d0f') {
  const btn = document.getElementById('flow-btn');
  btn.textContent = text;
  btn.style.background = bg;
  btn.style.color = color;
  btn.style.border = bg === 'var(--surface2)' ? '1px solid var(--border)' : 'none';
}

function _setFlowPhase(label, isBreak) {
  const badge = document.getElementById('flow-phase-badge');
  badge.textContent = label;
  badge.className = 'flow-phase-badge' + (isBreak ? ' break' : '');
}

function _showSuggestion(text) {
  const el = document.getElementById('flow-suggestion');
  document.getElementById('flow-suggestion-text').textContent = text;
  el.style.display = 'flex';

  // Auto-start break countdown after showing suggestion
  setTimeout(() => {
    if (flowPhase === 'break') startFlowBreak();
  }, 1200);
}

function _hideSuggestion() {
  document.getElementById('flow-suggestion').style.display = 'none';
}

// Init
updateFlowDisplay();
