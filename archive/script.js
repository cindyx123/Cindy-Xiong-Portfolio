// Update document title + announce page change to screen readers
const PAGE_TITLES = {
  home:     'Cindy Xiong — UX Designer',
  aetna:    'Aetna Medicare Redesign — Cindy Xiong',
  cvs:      'CVS Healthspire Website — Cindy Xiong',
  wellness: 'Wellness Champion Toolkit — Cindy Xiong',
};
const announcer = document.getElementById('page-announce');
function announcePageChange(key) {
  document.title = PAGE_TITLES[key];
  if (announcer) {
    announcer.textContent = '';
    requestAnimationFrame(() => {
      announcer.textContent = 'Navigated to ' + PAGE_TITLES[key];
    });
  }
}
// ══════════════════════════════════════════════════════
// SPA ENGINE
// ═══════════════════════════════════════════════
const PAGES = {
  home:     { accent:'#120e0a', label:null },
  wellness: { accent:'#1e3a5f', label:'01 · Wellness Toolkit' },
  cvs:      { accent:'#1a7a6e', label:'02 · CVS Healthspire' },
  aetna:    { accent:'#5a2d9c', label:'03 · Aetna Medicare' },
};

let cur = 'home', busy = false;

const wipe  = document.getElementById('wipe');
const bar   = document.getElementById('bar');
const nav   = document.getElementById('nav');
const label = document.getElementById('nav-label');
const labelTxt = document.getElementById('nav-label-txt');

function go(key, scrollId) {
  if (busy || key === cur) {
    if (key === cur && scrollId) scrollToEl(scrollId);
    return;
  }
  busy = true;

  const to = PAGES[key];

  // Color bar + wipe
  bar.style.background = to.accent;
  bar.style.opacity = '1';
  bar.style.width = '30%';

  wipe.style.background = to.accent;
  wipe.classList.remove('out');
  wipe.classList.add('in');

  setTimeout(() => {
    // Swap
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + key);
    pg.classList.add('active');
    resetScroll();
    bar.style.width = '80%';
    cur = key;
    setNav(key);
    initObs(pg);

    wipe.classList.remove('in');
    wipe.classList.add('out');

    setTimeout(() => {
      wipe.classList.remove('out');
      bar.style.width = '100%';
      setTimeout(() => { bar.style.opacity='0'; bar.style.width='0%'; }, 200);
      busy = false;
      if (scrollId) scrollToEl(scrollId);
    }, 300);
  }, 340);
}

function resetScroll() {
  // Belt-and-suspenders scroll reset for mobile Safari + Android
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  // Also force it after the next paint in case the browser deferred it
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

function scrollToEl(id) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => el.scrollIntoView({behavior:'smooth'}), 80);
}

function setNav(key) {
  const p = PAGES[key];
  announcePageChange(key);
  // nav bg stays fixed
  document.querySelectorAll('.nav-logo, .nav-links a').forEach(el => el.style.color = '#120e0a');
  if (p.label) {
    labelTxt.textContent = p.label;
    label.style.color = '#6e6558';
    label.classList.add('show');
  } else {
    label.classList.remove('show');
  }
}

function initObs(container) {
  const sel = '.stat,.split-section,.design-section,.research-section,.challenge-section,.quote-block,.final-grid,.results,.takeaway,.case-reflection,.next-project,.about-strip,.contact,.cs-card';
  container.querySelectorAll(sel).forEach(el => el.classList.remove('visible'));
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.06 });
  container.querySelectorAll(sel).forEach(el => ob.observe(el));
}

// Clicks
document.addEventListener('click', e => {
  const a = e.target.closest('[data-page]');
  if (!a) return;
  e.preventDefault();
  go(a.dataset.page, a.dataset.scroll || null);
});
// Cursor
let mx=0, my=0, rx=0, ry=0;
// Init
setNav('home');
initObs(document.getElementById('page-home'));

// ── BACK TO TOP + SCROLL PROGRESS ──────────────────────────
const backTop = document.getElementById('back-top');
const readProg = document.getElementById('read-progress');
const ACCENT_COLORS = { home:'#120e0a', aetna:'#5a2d9c', cvs:'#1a7a6e', wellness:'#1e3a5f' };

function updateScrollUI() {
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
  readProg.style.width = pct + '%';
  readProg.style.background = ACCENT_COLORS[cur] || '#120e0a';
  if (scrollY > 300) backTop.classList.add('show');
  else backTop.classList.remove('show');
}
window.addEventListener('scroll', updateScrollUI, { passive: true });

backTop.addEventListener('click', () => {
  smoothScrollTo(0, 600);
});

function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const dist  = target - start;
  if (dist === 0) return;
  let startTime = null;
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + dist * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


// ── SECTION COUNTERS ──────────────────────────────────────
document.querySelectorAll('.cs-page main').forEach(page => {
  let count = 0;
  page.querySelectorAll('.eyebrow').forEach(el => {
    if (el.classList.contains('np-eyebrow') || el.classList.contains('hero-eyebrow')) return;
    count++;
    if (el.querySelector('.sec-num')) return;
    const num = String(count).padStart(2, '0');
    const span = document.createElement('span');
    span.className = 'sec-num';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = num;
    el.insertBefore(span, el.firstChild);
  });
});


// ── FOOTER YEAR ──
(function() {
  const yr = new Date().getFullYear();
  const txt = '\u00a9 ' + yr + ' Cindy Xiong \u2022 UX Portfolio';
  const home = document.getElementById('footer-year-home');
  if (home) home.textContent = txt;
  document.querySelectorAll('.footer-year-cs').forEach(el => el.textContent = txt);
})();

function lbOpen(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  el.focus();
}

function lbClose(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

function lbBgClose(e, id) {
  if (e.target === document.getElementById(id)) lbClose(id);
}

function lbToggle(lbId, panel, e) {
  e.stopPropagation();
  // find all panels in this lightbox
  const lb = document.getElementById(lbId);
  lb.querySelectorAll('.lb-panel').forEach(p => p.classList.remove('active'));
  // activate selected panel
  const target = document.getElementById(lbId + '-' + panel);
  if (target) target.classList.add('active');
  // update toggle buttons
  lb.querySelectorAll('.lb-toggle-btn').forEach(btn => {
    btn.classList.remove('on');
    btn.classList.add('off');
  });
  const activeBtn = document.getElementById(lbId + '-btn-' + panel);
  if (activeBtn) { activeBtn.classList.add('on'); activeBtn.classList.remove('off'); }
}

// ESC to close any open lightbox
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.lb-overlay.open').forEach(el => {
      el.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});