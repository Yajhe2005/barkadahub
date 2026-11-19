// ═══════════════════════════════════
// BarkadaHub — router.js
// Page navigation
// ═══════════════════════════════════

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function goTo(id) {
  showPage(id);
}
