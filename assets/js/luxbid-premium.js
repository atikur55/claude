/* ============================================
   COUNTDOWN BAR TIMER
   ============================================ */
let countTotal = 8 * 3600 + 24 * 60 + 17;
function updateCountdown() {
  if (countTotal <= 0) countTotal = 86400;
  countTotal--;
  const h = Math.floor(countTotal / 3600);
  const m = Math.floor((countTotal % 3600) / 60);
  const s = countTotal % 60;
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}
setInterval(updateCountdown, 1000);

/* ============================================
   BENTO CARD GLOW ON MOUSE MOVE
   ============================================ */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    const glowEl = card.querySelector('.glow-border');
    const [r, g, b] = card.dataset.color.split(',');
    glowEl.style.background = `radial-gradient(circle 130px at ${x}% ${y}%, rgba(${r},${g},${b},0.4) 0%, transparent 70%)`;
  });
});

/* ============================================
   STAT NUMBER SCROLL-UP ANIMATION
   ============================================ */
function animateStatNumbers() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 2200;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      const display = target >= 1000000
        ? (current / 1000000).toFixed(1)
        : target >= 1000
          ? Math.round(current / 1000)
          : Math.round(current);
      el.textContent = prefix + display + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  });
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStatNumbers();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const statsSection = document.querySelector('.bento-grid');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================
   HERO PARALLAX (mouse move)
   ============================================ */
const heroCar = document.getElementById('heroCar');
const floatCards = document.querySelectorAll('.float-card');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  if (heroCar) {
    heroCar.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 3}deg) translateY(-8px)`;
  }
  floatCards.forEach((card, i) => {
    const depth = 0.4 + i * 0.15;
    card.style.transform += ` translate(${dx * depth * 8}px, ${dy * depth * 6}px)`;
  });
});

/* ============================================
   LIVE AUCTION BID SIMULATION
   ============================================ */
const bids = [
  { amountEl: document.getElementById('amount-1'), sectionEl: document.getElementById('bid-1'), base: 187400, step: [800, 1200] },
  { amountEl: document.getElementById('amount-2'), sectionEl: document.getElementById('bid-2'), base: 94200, step: [200, 500] },
  { amountEl: document.getElementById('amount-3'), sectionEl: document.getElementById('bid-3'), base: 1240000, step: [5000, 15000] },
];

function randomBetween(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function formatBid(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(3).replace(/\.?0+$/, '') + 'M';
  return '$' + n.toLocaleString();
}

function updateBid(bid) {
  bid.base += randomBetween(...bid.step);
  bid.amountEl.textContent = formatBid(bid.base);
  bid.sectionEl.classList.remove('flash-anim');
  void bid.sectionEl.offsetWidth; // reflow
  bid.sectionEl.classList.add('flash-anim');
}

bids.forEach((bid, i) => {
  setInterval(() => updateBid(bid), 3000 + i * 1700 + randomBetween(0, 2000));
});

/* ============================================
   AUCTION TIMER COUNTDOWNS
   ============================================ */
const timerData = [
  { el: document.getElementById('timer-1'), seconds: 2 * 3600 + 14 * 60 + 38, urgent: false },
  { el: document.getElementById('timer-2'), seconds: 4 * 60 + 12, urgent: true },
  { el: document.getElementById('timer-3'), seconds: 11 * 3600 + 58 * 60 + 2, urgent: false },
];

function updateTimers() {
  timerData.forEach(t => {
    if (t.seconds <= 0) return;
    t.seconds--;
    const h = Math.floor(t.seconds / 3600);
    const m = Math.floor((t.seconds % 3600) / 60);
    const s = t.seconds % 60;
    if (h > 0) {
      t.el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    } else {
      t.el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
    if (t.seconds <= 300) {
      t.el.classList.add('urgent');
    } else {
      t.el.classList.remove('urgent');
    }
  });
}
setInterval(updateTimers, 1000);

/* ============================================
   HERO BID TICKER
   ============================================ */
let heroBidVal = 187400;
const heroBidEl = document.getElementById('hero-bid');
setInterval(() => {
  heroBidVal += randomBetween(400, 2200);
  heroBidEl.textContent = '$' + heroBidVal.toLocaleString();
}, 4200);

/* ============================================
   COMPETITION TICKET CONTROLS
   ============================================ */
document.querySelectorAll('[data-ticket-stepper]').forEach(stepper => {
  const countEl = stepper.querySelector('.ticket-count');
  const minus = stepper.querySelector('[data-ticket-minus]');
  const plus = stepper.querySelector('[data-ticket-plus]');
  let count = parseInt(countEl.textContent, 10) || 1;

  function updateCount(next, button) {
    count = Math.max(1, Math.min(20, next));
    countEl.textContent = count + 'x';
    button.classList.remove('bump');
    void button.offsetWidth;
    button.classList.add('bump');
  }

  minus.addEventListener('click', () => updateCount(count - 1, minus));
  plus.addEventListener('click', () => updateCount(count + 1, plus));
});

document.querySelectorAll('.btn-ticket').forEach(button => {
  button.addEventListener('mousemove', e => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

/* ============================================
   SCROLL-LINKED TIMELINE GLOW
   ============================================ */
const howTimeline = document.getElementById('howTimeline');
function updateTimelineProgress() {
  if (!howTimeline) return;
  const rect = howTimeline.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const start = viewport * 0.72;
  const end = viewport * 0.18;
  const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end + rect.height * 0.18)));
  howTimeline.style.setProperty('--timeline-progress', (progress * 100).toFixed(1) + '%');
}
window.addEventListener('scroll', updateTimelineProgress, { passive: true });
window.addEventListener('resize', updateTimelineProgress);
updateTimelineProgress();

/* ============================================
   RECENT WINNERS LIVE FEED
   ============================================ */
const winnerFeed = document.getElementById('winnerFeed');
const winnerItems = [
  { user: '@luxe***52', avatar: 'L', icon: 'ðŸŽ¨', item: 'Blue Chip Art Print', meta: 'Ticket #91342', value: 'Spent $7 to win $6,400' },
  { user: '@zero***19', avatar: 'Z', icon: 'âŒš', item: 'Omega Speedmaster', meta: 'Ticket #32618', value: 'Spent $5 to win $8,900' },
  { user: '@onyx***70', avatar: 'O', icon: 'ðŸ’Ž', item: 'Sapphire Vault Box', meta: 'Ticket #55802', value: 'Spent $15 to win $12,200' }
];
let winnerIndex = 0;

function pushWinnerRow() {
  if (!winnerFeed) return;
  const item = winnerItems[winnerIndex % winnerItems.length];
  winnerIndex++;
  const row = document.createElement('div');
  row.className = 'winner-row is-new';
  row.innerHTML = `
    <div class="winner-user"><div class="winner-avatar">${item.avatar}</div><div><div class="masked-name">${item.user}</div><div class="winner-time">Just now</div></div></div>
    <div class="winner-item"><div class="winner-thumb">${item.icon}</div><div><div class="item-name">${item.item}</div><div class="item-meta">${item.meta}</div></div></div>
    <div class="win-value-badge">${item.value}</div>
    <div class="escrow-badge">Dispatched via Escrow</div>
  `;
  winnerFeed.prepend(row);
  setTimeout(() => row.classList.remove('is-new'), 900);
  while (winnerFeed.children.length > 5) winnerFeed.lastElementChild.remove();
}
setInterval(pushWinnerRow, 5200);

/* ============================================
   REFERRAL COPY BUTTON
   ============================================ */
const copyReferral = document.getElementById('copyReferral');
const referralLink = document.getElementById('referralLink');
if (copyReferral && referralLink) {
  copyReferral.addEventListener('click', async () => {
    referralLink.select();
    try {
      await navigator.clipboard.writeText(referralLink.value);
    } catch (err) {
      document.execCommand('copy');
    }
    copyReferral.classList.add('copied');
    copyReferral.textContent = 'âœ“ Copied!';
    setTimeout(() => {
      copyReferral.classList.remove('copied');
      copyReferral.textContent = 'Copy Link';
    }, 1800);
  });

  copyReferral.addEventListener('mousemove', e => {
    const rect = copyReferral.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    copyReferral.style.transform = `translate(${x * 0.1}px, ${y * 0.16}px)`;
  });

  copyReferral.addEventListener('mouseleave', () => {
    copyReferral.style.transform = 'translate(0, 0)';
  });
}

/* ============================================
   FAQ & NEWSLETTER INTERACTIONS
   ============================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  function syncFaqHeight() {
    answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 'px' : '0px';
  }

  button.addEventListener('click', () => {
    item.classList.toggle('active');
    syncFaqHeight();
  });

  syncFaqHeight();
});

document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const button = form.querySelector('button');
    button.textContent = 'Joined';
    setTimeout(() => { button.textContent = 'Join the Alpha List'; }, 1800);
  });
});

/* ============================================
   HEADER SCROLL STATE
   ============================================ */
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 20) {
    header.style.background = 'rgba(8,8,15,0.92)';
  } else {
    header.style.background = 'rgba(8,8,15,0.6)';
  }
});

