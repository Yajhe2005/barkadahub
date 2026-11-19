// ═══════════════════════════════════
// BarkadaHub — cards.js
// Random card picker
// ═══════════════════════════════════

const CARD_DATA = {
  food: [
    {e:'🍗', t:'Jollibee',         s:'Chickenjoy time!'},
    {e:'🍕', t:'Pizza',             s:'Order delivery!'},
    {e:'🍜', t:'Mami / Lomi',       s:'So sarap when it\'s cold'},
    {e:'🌮', t:'Tacos / Burritos',  s:'Mexican mood'},
    {e:'🍱', t:'Bento Box',         s:'Japanese vibes'},
    {e:'🍔', t:'Burger',            s:'Classic lang'},
    {e:'🥘', t:'Tapsilog',          s:'Anytime breakfast!'},
    {e:'🍦', t:'Milk Tea + Snacks', s:'Chill ka na'},
    {e:'🍝', t:'Pasta',             s:'Carbo loading'},
    {e:'🐔', t:'Lechon Manok',      s:'Budget meal!'},
  ],
  activity: [
    {e:'🎮', t:'Play Mobile Legends', s:'Mag-rank tayo!'},
    {e:'📺', t:'Netflix / Movie',     s:'Pick a film together'},
    {e:'🛍️', t:'Mall Pag-lipad',      s:'Window shopping lang'},
    {e:'🃏', t:'Card Games',          s:'Tong-its or pusoy?'},
    {e:'🎤', t:'Videoke!',            s:'Sing your heart out'},
    {e:'🏀', t:'Basketball',          s:'Courts tayo!'},
    {e:'📸', t:'Photowalk',           s:'Instagrammable spots!'},
    {e:'🧋', t:'Milk Tea Crawl',      s:'Visit 3 milk tea shops'},
    {e:'😴', t:'Rest Day',            s:'You deserve it naman'},
  ],
  study: [
    {e:'☕', t:'Cafe Study Session',  s:'Find a cozy cafe'},
    {e:'📚', t:'Library',             s:'Maximum focus mode'},
    {e:'🏠', t:'Someone\'s House',    s:'Potluck + study!'},
    {e:'🏫', t:'Classroom / School',  s:'Stay after class'},
    {e:'🌳', t:'Park / Outdoor',      s:'Fresh air study sesh'},
  ],
  custom: [],
};

let currentCat  = 'food';
let customCards = [];

function setCardCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('custom-section').style.display = cat === 'custom' ? 'block' : 'none';
  resetCard();
}

function pickCard() {
  const pool = currentCat === 'custom' ? customCards : CARD_DATA[currentCat];
  if (!pool || pool.length === 0) {
    document.getElementById('card-text').textContent = 'Add some options first!';
    return;
  }
  const item    = pool[Math.floor(Math.random() * pool.length)];
  const display = document.getElementById('card-display');
  display.classList.remove('card-flip');
  void display.offsetWidth;
  display.classList.add('card-flip');
  document.getElementById('card-emoji').textContent = item.e || '🎲';
  document.getElementById('card-text').textContent  = item.t || item;
  document.getElementById('card-sub').textContent   = item.s || '';
}

function resetCard() {
  document.getElementById('card-emoji').textContent = '🎲';
  document.getElementById('card-text').textContent  = 'Press the button to pick!';
  document.getElementById('card-sub').textContent   = 'tap below';
}

function addCustomCard() {
  const input = document.getElementById('custom-input');
  const val   = input.value.trim();
  if (!val) return;
  customCards.push({ e: '✨', t: val, s: 'Custom pick!' });
  input.value = '';
  renderCustomList();
}

function renderCustomList() {
  document.getElementById('custom-list').innerHTML = customCards
    .map((c, i) => `<div class="custom-tag">${c.t}<span class="custom-tag-remove" onclick="removeCustom(${i})">×</span></div>`)
    .join('');
}

function removeCustom(i) {
  customCards.splice(i, 1);
  renderCustomList();
}
