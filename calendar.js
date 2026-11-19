// ═══════════════════════════════════
// BarkadaHub — calendar.js
// Shared calendar view
// ═══════════════════════════════════

const CAL_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

let calYear   = new Date().getFullYear();
let calMonth  = new Date().getMonth();
let calEvents = [];
let calColor  = '#f5c842';

// ── Navigation ──────────────────────────
function calMove(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCal();
}

// ── Render calendar grid ────────────────
function renderCal() {
  document.getElementById('cal-month-label').textContent =
    CAL_MONTHS[calMonth] + ' ' + calYear;

  const cells         = document.getElementById('cal-cells');
  const firstWeekday  = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth   = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev    = new Date(calYear, calMonth, 0).getDate();
  const today         = new Date();
  const totalCells    = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  cells.innerHTML = '';

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    let day, mo = calMonth, yr = calYear, isOther = false;

    if (i < firstWeekday) {
      day = daysInPrev - firstWeekday + i + 1;
      mo  = calMonth - 1;
      isOther = true;
      if (mo < 0) { mo = 11; yr--; }
    } else if (i >= firstWeekday + daysInMonth) {
      day = i - firstWeekday - daysInMonth + 1;
      mo  = calMonth + 1;
      isOther = true;
      if (mo > 11) { mo = 0; yr++; }
    } else {
      day = i - firstWeekday + 1;
    }

    if (isOther) cell.classList.add('other-month');

    const isToday =
      day === today.getDate() &&
      mo  === today.getMonth() &&
      yr  === today.getFullYear();
    if (isToday) cell.classList.add('today');

    const numDiv = document.createElement('div');
    numDiv.className = 'cal-cell-num';
    numDiv.textContent = day;
    cell.appendChild(numDiv);

    // Events on this day
    const dateStr = `${yr}-${String(mo + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    calEvents
      .filter(e => e.date === dateStr)
      .forEach(ev => {
        const dot = document.createElement('div');
        dot.className = 'cal-event-dot';
        dot.textContent = ev.name;
        dot.style.background = ev.color + '22';
        dot.style.color      = ev.color;
        dot.style.border     = `1px solid ${ev.color}44`;
        cell.appendChild(dot);
      });

    cells.appendChild(cell);
  }

  renderCalEventList();
}

// ── Add event ───────────────────────────
function selectCalColor(el) {
  document.querySelectorAll('.cal-color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  calColor = el.dataset.color;
}

function addCalEvent() {
  const name = document.getElementById('cal-event-name').value.trim();
  const date = document.getElementById('cal-event-date').value;
  const note = document.getElementById('cal-event-note').value.trim();

  if (!name || !date) { alert('Please fill in event name and date!'); return; }

  calEvents.push({ id: Date.now(), name, date, note, color: calColor });
  calEvents.sort((a, b) => a.date.localeCompare(b.date));

  document.getElementById('cal-event-name').value = '';
  document.getElementById('cal-event-date').value = '';
  document.getElementById('cal-event-note').value = '';

  renderCal();
}

function removeCalEvent(id) {
  calEvents = calEvents.filter(e => e.id !== id);
  renderCal();
}

function renderCalEventList() {
  const list     = document.getElementById('cal-event-list');
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = calEvents.filter(e => e.date >= todayStr);

  if (!upcoming.length) {
    list.innerHTML = '<div class="empty-state">No upcoming events. Add one above!</div>';
    return;
  }

  list.innerHTML = upcoming.map(e => {
    const d     = new Date(e.date + 'T00:00:00');
    const label = d.toLocaleDateString('en-PH', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
    return `<div class="cal-event-item">
      <div class="cal-event-color" style="background:${e.color}"></div>
      <div class="cal-event-info">
        <div class="cal-event-name">${e.name}</div>
        <div class="cal-event-date">${label}${e.note ? ' · ' + e.note : ''}</div>
      </div>
      <button class="cal-event-del" onclick="removeCalEvent(${e.id})">✕</button>
    </div>`;
  }).join('');
}

// Init calendar on load
renderCal();
