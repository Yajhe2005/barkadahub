// ═══════════════════════════════════
// BarkadaHub — grades.js
// Weighted grade calculator
// ═══════════════════════════════════

let gradeRows = [];

function addGradeRow(name = '', score = '', weight = '') {
  const id  = Date.now();
  gradeRows.push(id);
  const table = document.getElementById('grade-table');
  const row   = document.createElement('div');
  row.className = 'grade-row';
  row.id = 'grow-' + id;
  row.innerHTML = `
    <div class="grade-cell"><input class="grade-input" placeholder="e.g. Midterm" value="${name}" oninput="calcGrade()"></div>
    <div class="grade-cell"><input class="grade-input" type="number" placeholder="85" min="0" max="100" value="${score}" oninput="calcGrade()"></div>
    <div class="grade-cell"><input class="grade-input" type="number" placeholder="30" min="0" max="100" value="${weight}" oninput="calcGrade()"></div>
    <div class="grade-cell"><button class="grade-del" onclick="delGradeRow(${id})">✕</button></div>
  `;
  table.appendChild(row);
  calcGrade();
}

function delGradeRow(id) {
  document.getElementById('grow-' + id)?.remove();
  gradeRows = gradeRows.filter(r => r !== id);
  calcGrade();
}

function calcGrade() {
  const rows = document.querySelectorAll('#grade-table .grade-row:not(.grade-row-header)');
  let totalWeight = 0, weightedSum = 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const score  = parseFloat(inputs[1].value);
    const weight = parseFloat(inputs[2].value);
    if (!isNaN(score) && !isNaN(weight)) {
      weightedSum += score * (weight / 100);
      totalWeight += weight;
    }
  });

  const bigEl    = document.getElementById('grade-big');
  const remarkEl = document.getElementById('grade-remark');
  const subEl    = document.getElementById('grade-remark-sub');

  if (rows.length === 0) {
    bigEl.textContent    = '—';
    remarkEl.textContent = 'Add components above';
    subEl.textContent    = 'Your weighted average will appear here';
    return;
  }

  // If total weight = 100, weightedSum is the direct average
  const avg = weightedSum;
  bigEl.textContent = avg.toFixed(1) + '%';

  if (avg >= 90)      { bigEl.style.color='var(--accent3)'; remarkEl.textContent="Excellent! 🎉"; subEl.textContent="Dean's lister siya!"; }
  else if (avg >= 80) { bigEl.style.color='var(--accent)';  remarkEl.textContent="Very Good! 👏"; subEl.textContent="You're doing great!"; }
  else if (avg >= 75) { bigEl.style.color='var(--accent)';  remarkEl.textContent="Passing ✅";    subEl.textContent="You made it!"; }
  else if (avg >= 60) { bigEl.style.color='var(--accent2)'; remarkEl.textContent="Needs Improvement ⚠️"; subEl.textContent="Study more, kaya mo pa!"; }
  else                { bigEl.style.color='var(--accent2)'; remarkEl.textContent="Failing ❌";     subEl.textContent="Hindi pa huli para mag-aral!"; }
}

// Seed with default rows
addGradeRow('Quiz',       '', '20');
addGradeRow('Midterm',    '', '30');
addGradeRow('Final Exam', '', '50');
