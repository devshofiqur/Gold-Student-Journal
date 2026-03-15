/**
 * Gold Student Journal — Main JavaScript
 * Project: Educational Blog · Mato Grosso do Sul, Brazil
 */

/* ============================================================
   TOP BAR — DATE
   ============================================================ */
(function setDate() {
  const el = document.getElementById('tb-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
})();

/* ============================================================
   SIMULATED LIVE GOLD PRICE
   Ticks every 4 seconds with small random drift.
   In production: replace with GoldAPI.io or similar.
   ============================================================ */
const GOLD = {
  baseUSD:   3240.50,
  usdBrl:    5.095,
  troyGram:  31.1035,

  _price:    3240.50,

  get perGram() { return this._price / this.troyGram; },

  update() {
    const delta = (Math.random() - 0.48) * 2.5;
    this._price = this.baseUSD + delta;
    const pct   = ((delta) / this.baseUSD * 100).toFixed(2);
    const up    = delta >= 0;

    /* Top bar */
    const tbPrice  = document.getElementById('tb-price');
    const tbChange = document.getElementById('tb-change');
    if (tbPrice)  tbPrice.textContent  = '$' + this._price.toFixed(2);
    if (tbChange) {
      tbChange.textContent = (up ? '▲ +' : '▼ ') + pct + '%';
      tbChange.style.color = up ? '#81C784' : '#EF9A9A';
    }

    /* Hero sidebar widget */
    const gpMain   = document.getElementById('gp-main');
    const gpChange = document.getElementById('gp-change');
    const gpGram   = document.getElementById('gp-gram');
    const gpBrl    = document.getElementById('gp-gram-brl');
    if (gpMain)   gpMain.textContent   = '$' + Math.round(this._price).toLocaleString();
    if (gpChange) {
      gpChange.textContent = (up ? '▲ +' : '▼ ') + pct + '%';
      gpChange.className   = 'gp-change' + (up ? '' : ' down');
    }
    if (gpGram)   gpGram.textContent   = '$' + this.perGram.toFixed(2);
    if (gpBrl)    gpBrl.textContent    = 'R$ ' + (this.perGram * this.usdBrl).toFixed(2);
  }
};

GOLD.update();
setInterval(() => GOLD.update(), 4000);

/* ============================================================
   GOLD VALUE CALCULATOR  (Hero sidebar)
   ============================================================ */
function calcGold() {
  const weight   = parseFloat(document.getElementById('calc-weight')?.value);
  const unit     = document.getElementById('calc-unit')?.value;
  const purity   = parseFloat(document.getElementById('calc-purity')?.value);
  const currency = document.getElementById('calc-currency')?.value;

  if (!weight || weight <= 0) {
    alert('Please enter a valid weight.');
    return;
  }

  let grams = weight;
  if (unit === 'oz') grams = weight * GOLD.troyGram;
  if (unit === 'kg') grams = weight * 1000;

  let value = grams * purity * GOLD.perGram;
  if (currency === 'brl') value *= GOLD.usdBrl;

  const sym    = currency === 'usd' ? '$' : 'R$ ';
  const result = document.getElementById('calc-result');
  const valEl  = document.getElementById('calc-result-val');
  if (result && valEl) {
    valEl.textContent = sym + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    result.classList.add('show');
  }
}

/* Article-page calculator (grams only) */
function calcGold2() {
  const weight = parseFloat(document.getElementById('calc-weight2')?.value);
  const purity = parseFloat(document.getElementById('calc-purity2')?.value);

  if (!weight || weight <= 0) {
    alert('Please enter a valid weight.');
    return;
  }

  const value  = weight * purity * GOLD.perGram;
  const result = document.getElementById('calc-result2');
  const valEl  = document.getElementById('calc-result-val2');
  if (result && valEl) {
    valEl.textContent = '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    result.classList.add('show');
  }
}

/* Enter key support */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-weight')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') calcGold(); });
  document.getElementById('calc-weight2')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') calcGold2(); });
});

/* ============================================================
   PAGE NAVIGATION  (Homepage ↔ Article page)
   ============================================================ */
function showArticle() {
  document.getElementById('homepage')?.classList.add('hidden');
  document.getElementById('article-page')?.classList.add('visible');
  document.getElementById('edu-section').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
}

function showHome() {
  document.getElementById('homepage')?.classList.remove('hidden');
  document.getElementById('article-page')?.classList.remove('visible');
  document.getElementById('edu-section').style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('nav a')?.classList.add('active');
}

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  /* Close nav when a link is clicked */
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
});
