// ═══════════════════════════════════
// BarkadaHub — auth.js
// Login / logout
// ═══════════════════════════════════

const USERS = { barkada: '1234', admin: 'admin' };
let currentUser = '';

function doLogin() {
  const u   = document.getElementById('login-user').value.trim();
  const p   = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');

  if (USERS[u] && USERS[u] === p) {
    err.style.display = 'none';
    currentUser = u;
    document.getElementById('nav-username').textContent  = u;
    document.getElementById('nav-avatar').textContent   = u[0].toUpperCase();
    document.getElementById('nav-avatar2').textContent  = u[0].toUpperCase();
    showPage('home');
  } else {
    err.style.display = 'block';
  }
}

function doLogout() {
  showPage('login');
}

document.getElementById('login-pass')
  .addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
