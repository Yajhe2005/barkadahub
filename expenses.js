// ═══════════════════════════════════
// BarkadaHub — expenses.js
// Expense splitter
// ═══════════════════════════════════

let expenses = [];

function addExpense() {
  const name   = document.getElementById('exp-name').value.trim();
  const amount = parseFloat(document.getElementById('exp-amount').value);
  if (!name || isNaN(amount) || amount <= 0) return;

  expenses.push({ id: Date.now(), name, amount });
  document.getElementById('exp-name').value   = '';
  document.getElementById('exp-amount').value = '';
  renderExpenses();
}

function removeExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  renderExpenses();
}

function renderExpenses() {
  const list = document.getElementById('expense-list');

  if (expenses.length === 0) {
    list.innerHTML = '<div class="empty-state">No expenses yet. Add one above!</div>';
  } else {
    list.innerHTML = expenses.map(e => `
      <div class="expense-item">
        <span class="expense-item-name">${e.name}</span>
        <div class="expense-item-right">
          <span class="expense-item-amount">₱${e.amount.toFixed(2)}</span>
          <button class="expense-item-del" onclick="removeExpense(${e.id})">✕</button>
        </div>
      </div>
    `).join('');
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  document.getElementById('expense-total').textContent = '₱' + total.toFixed(2);
  updateSplit();
}

function updateSplit() {
  const count = parseInt(document.getElementById('split-count').value) || 1;
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  document.getElementById('per-person').textContent = '₱' + (total / count).toFixed(2) + ' each';
}
