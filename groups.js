// ═══════════════════════════════════
// BarkadaHub — groups.js
// Random group maker
// ═══════════════════════════════════

function makeGroups() {
  const raw = document.getElementById('groups-names').value;
  const n   = parseInt(document.getElementById('groups-count').value) || 2;
  let names = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

  if (names.length < 2) { alert('Add at least 2 names!'); return; }

  // Fisher-Yates shuffle
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  const groups = Array.from({ length: n }, () => []);
  names.forEach((name, i) => groups[i % n].push(name));

  const colors = [
    'var(--accent)', 'var(--accent2)', 'var(--accent3)',
    'var(--accent4)', '#c084fc', '#fb923c',
  ];

  document.getElementById('groups-result').innerHTML = groups.map((g, i) => `
    <div class="group-box" style="border-color:${colors[i % colors.length]}22">
      <h4 style="color:${colors[i % colors.length]}">Group ${i + 1}</h4>
      <div class="group-members">
        ${g.map(m => `<div class="group-member">${m}</div>`).join('')}
      </div>
    </div>
  `).join('');
}
