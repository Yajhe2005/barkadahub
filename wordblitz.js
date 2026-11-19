// ═══════════════════════════════════
// BarkadaHub — wordblitz.js
// Falling-word typing game (ZType-style)
// ═══════════════════════════════════

const WB_WORDS = [
  'cat','dog','sun','run','fun','map','cup','hat','big','ant','arm','art','ask',
  'bag','bat','bed','bug','bus','can','car','cut','dam','dig','dim','dip','dot',
  'drop','drum','duck','dust','ear','egg','elk','elm','end','eye','fan','far',
  'fat','fig','fin','fit','fix','fog','fox','fry','gap','gas','gel','gem','get',
  'gig','gin','god','got','gum','gut','gym','ham','has','hit','hog','hop','hot',
  'hub','hug','hum','icy','ink','ion','ivy','jab','jam','jar','jaw','jet','job',
  'jog','joy','jug','junk','keep','kick','king','kite','knot','lake','lamp',
  'lark','last','late','lazy','leaf','lean','leap','left','lemon','limp','link',
  'lion','list','load','lock','loop','lost','loud','love','luck','lump','lunch',
  'magic','major','maker','march','match','medal','mercy','metal','might','milk',
  'minor','minus','money','month','moral','motor','mount','mouse','movie','music',
  'nerve','night','noble','noise','north','novel','nurse','oasis','ocean','offer',
  'often','olive','order','otter','outer','owned','oxide','ozone','paint','panel',
  'paper','party','patch','peace','pearl','pedal','phase','phone','photo','piece',
  'pilot','pixel','place','plain','plane','plant','plate','plaza','pluck','plume',
  'point','polar','power','press','price','pride','prime','print','prize','proof',
  'prose','proud','pulse','punch','queen','quest','queue','quick','quiet','quota',
  'quote','radar','radio','raise','rally','range','rapid','ratio','reach','ready',
  'realm','rebel','relay','remix','renew','repay','repel','reset','resin','retro',
  'risky','robot','rocky','rouge','rough','round','route','royal','rugby','ruler',
  'score','scout','setup','share','shelf','shell','shift','shine','shock','shoot',
  'shore','short','shout','shrug','sight','sigma','skill','skull','slate','sleek',
  'sleep','slice','slide','slope','smart','smash','smile','smoke','solar','solid',
  'solve','sorry','south','space','spark','spawn','speed','spend','spice','spike',
  'spine','split','spoke','sport','spray','squad','stack','staff','stage','stake',
  'stale','stall','stand','stark','start','state','steel','steep','steer','stern',
  'stock','stomp','stone','store','storm','story','stove','straw','strip','strut',
  'study','style','sugar','suite','sunny','super','surge','sweep','sweet','swept',
  'swift','swing','sword','table','taken','tally','taste','teach','tempo','tense',
  'thank','theme','think','those','tiger','tight','timer','title','today','token',
  'total','touch','tough','tower','toxic','track','trade','trail','train','tramp',
  'trend','trick','troop','truck','truly','trust','truth','tulip','tuner','urban',
  'valid','valor','value','valve','video','vigor','viral','virus','visit','vista',
  'vital','voice','voter','vague','vault','waste','watch','water','weary','weird',
  'whale','wheat','wheel','where','while','white','whole','whose','widen','witty',
  'world','worth','would','write','yacht','yield','young','yours','zebra','zesty',
];

let wbRunning    = false;
let wbWords      = [];
let wbScore      = 0;
let wbLevel      = 1;
let wbLives      = 3;
let wbCombo      = 1;
let wbBest       = parseInt(localStorage.getItem('wbBest') || '0');
let wbSpawnRate  = 2200;
let wbFallDur    = 12;
let wbTarget     = null;
let wbSpawnTimer = null;
let wbFallTimer  = null;
let wbTick       = 0;

// ── Game lifecycle ──────────────────────
function wbStart() {
  document.getElementById('wb-overlay').style.display = 'none';
  document.getElementById('wb-input').disabled = false;
  document.getElementById('wb-input').value    = '';
  document.getElementById('wb-input').focus();

  wbScore = 0; wbLevel = 1; wbLives = 3; wbCombo = 1;
  wbWords = []; wbTarget = null;
  wbSpawnRate = 2200; wbFallDur = 12; wbTick = 0;
  wbRunning = true;

  // Clear any leftover word elements
  const arena = document.getElementById('wb-arena');
  arena.querySelectorAll('.wb-word').forEach(el => el.remove());

  wbUpdate();
  wbMakeStars();
  wbScheduleSpawn();
  wbFallTimer = setInterval(wbFallTick, 500);
}

function wbStop() {
  clearTimeout(wbSpawnTimer);
  clearInterval(wbFallTimer);
  wbRunning = false;
}

// ── Stars background ────────────────────
function wbMakeStars() {
  const s = document.getElementById('wb-stars');
  s.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const sz = Math.random() * 2 + 1;
    star.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*4}s;--del:${-Math.random()*4}s`;
    s.appendChild(star);
  }
}

// ── Spawning ────────────────────────────
function wbScheduleSpawn() {
  wbSpawnTimer = setTimeout(() => {
    wbSpawnWord();
    wbScheduleSpawn();
  }, wbSpawnRate);
}

function wbSpawnWord() {
  if (!wbRunning) return;
  const arena = document.getElementById('wb-arena');
  const pool  = WB_WORDS.filter(w => !wbWords.find(e => e.word === w));
  if (!pool.length) return;

  const word = pool[Math.floor(Math.random() * pool.length)];
  const el   = document.createElement('div');
  el.className = 'wb-word';
  el.dataset.word = word;
  el.innerHTML = word;

  const maxX = Math.max(8, arena.offsetWidth - word.length * 11 - 20);
  el.style.left = Math.max(8, Math.random() * maxX) + 'px';
  el.style.top  = '8px';
  arena.appendChild(el);

  wbWords.push({ word, el, y: 8, dying: false });
}

// ── Falling tick ────────────────────────
function wbFallTick() {
  if (!wbRunning) return;
  const arena = document.getElementById('wb-arena');
  const h     = arena.offsetHeight;
  const speed = Math.max(4, wbFallDur);

  wbWords.forEach(w => {
    w.y += h / (speed * 2);
    w.el.style.top = w.y + 'px';

    if (w.y > h - 30 && !w.dying) {
      w.dying = true;
      w.el.classList.add('dying');
      setTimeout(() => {
        w.el.remove();
        wbWords = wbWords.filter(x => x !== w);
      }, 300);

      wbLives--;
      wbCombo = 1;
      if (wbTarget === w) wbTarget = null;
      if (wbLives <= 0) { wbGameOver(); return; }
      wbUpdate();
    }
  });

  wbTick++;
  if (wbTick % 30 === 0) {
    wbLevel      = Math.min(10, Math.floor(wbScore / 200) + 1);
    wbSpawnRate  = Math.max(800, 2200 - wbLevel * 150);
    wbFallDur    = Math.max(4, 12 - wbLevel * 0.8);
    wbUpdate();
  }
}

// ── Typing ──────────────────────────────
function wbCheckInput() {
  if (!wbRunning) return;
  const val = document.getElementById('wb-input').value.toLowerCase().trim();
  if (!val) return;

  // Keep targeting current word if still matches
  let match = null;
  if (wbTarget && wbTarget.word.startsWith(val) && !wbTarget.dying) {
    match = wbTarget;
  }

  // Otherwise find a new match
  if (!match) {
    wbWords.forEach(w => {
      if (w.word.startsWith(val) && !w.dying) match = w;
    });
  }

  // Untarget old word if switched
  if (wbTarget && wbTarget !== match) {
    wbTarget.el.classList.remove('targeted');
    wbTarget.el.innerHTML = wbTarget.word;
  }

  wbTarget = match || null;

  if (wbTarget) {
    wbTarget.el.classList.add('targeted');
    wbTarget.el.innerHTML =
      `<span class="typed">${val}</span>${wbTarget.word.slice(val.length)}`;
  }

  // Word completed!
  if (wbTarget && val === wbTarget.word) {
    const pts = wbTarget.word.length * 10 * wbCombo;
    wbScore  += pts;
    wbCombo   = Math.min(8, wbCombo + 1);

    const done = wbTarget;
    done.dying = true;
    done.el.classList.add('dying');
    setTimeout(() => {
      done.el.remove();
      wbWords = wbWords.filter(x => x !== done);
    }, 300);

    wbTarget = null;
    document.getElementById('wb-input').value = '';
    wbUpdate();
    wbScorePop(pts);
  }
}

// ── Score pop animation ─────────────────
function wbScorePop(pts) {
  const arena = document.getElementById('wb-arena');
  const pop   = document.createElement('div');
  pop.textContent = '+' + pts;
  pop.style.cssText = `
    position:absolute; left:50%; top:40%;
    transform:translateX(-50%);
    font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800;
    color:var(--accent); pointer-events:none;
    animation:wbPop 0.7s ease forwards;
  `;
  arena.appendChild(pop);
  setTimeout(() => pop.remove(), 700);
}

// ── HUD update ──────────────────────────
function wbUpdate() {
  document.getElementById('wb-score').textContent = wbScore;
  document.getElementById('wb-level').textContent = wbLevel;
  document.getElementById('wb-combo').textContent = 'x' + wbCombo;
  document.getElementById('wb-lives').textContent =
    '❤️'.repeat(wbLives) + '🖤'.repeat(Math.max(0, 3 - wbLives));

  if (wbScore > wbBest) {
    wbBest = wbScore;
    localStorage.setItem('wbBest', wbBest);
  }
  document.getElementById('wb-best').textContent = wbBest;
}

// ── Game over ───────────────────────────
function wbGameOver() {
  wbStop();
  document.getElementById('wb-input').disabled = true;

  const ov = document.getElementById('wb-overlay');
  ov.style.display = 'flex';
  ov.innerHTML = `
    <h2 style="color:var(--accent2)">Game Over!</h2>
    <p>Final Score: <strong style="color:var(--accent)">${wbScore}</strong></p>
    <p style="font-size:0.82rem;color:var(--muted)">Best: ${wbBest}</p>
    <button class="wb-btn" style="background:var(--accent2)" onclick="wbStart()">Try Again</button>
    <button class="wb-btn" style="background:var(--surface2);color:var(--text);border:1px solid var(--border)" onclick="goTo('home')">Home</button>
  `;
}

// Show best score on load
document.addEventListener('DOMContentLoaded', () => {
  const bestEl = document.getElementById('wb-best');
  if (bestEl) bestEl.textContent = wbBest;
});
