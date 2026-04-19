
const miniContainer = document.getElementById('mini-bars');
const BAR_COUNT = 28;
let miniArray = [];
let miniSorting = false;

function initMini() {
  miniArray = Array.from({ length: BAR_COUNT }, () => Math.floor(Math.random() * 80) + 15);
  renderMini();
}

function renderMini(highlights = {}) {
  miniContainer.innerHTML = '';
  miniArray.forEach((v, i) => {
    const b = document.createElement('div');
    b.className = 'mini-bar' + (highlights[i] ? ` ${highlights[i]}` : '');
    b.style.height = `${v}%`;
    miniContainer.appendChild(b);
  });
}

function getMiniBar(i) {
  return miniContainer.children[i];
}

function miniDelay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runMiniBubble() {
  miniSorting = true;
  const n = miniArray.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // highlight comparing
      if (getMiniBar(j)) getMiniBar(j).className = 'mini-bar cmp';
      if (getMiniBar(j+1)) getMiniBar(j+1).className = 'mini-bar cmp';
      await miniDelay(40);
      if (miniArray[j] > miniArray[j+1]) {
        [miniArray[j], miniArray[j+1]] = [miniArray[j+1], miniArray[j]];
        if (getMiniBar(j)) { getMiniBar(j).className = 'mini-bar swp'; getMiniBar(j).style.height = miniArray[j] + '%'; }
        if (getMiniBar(j+1)) { getMiniBar(j+1).className = 'mini-bar swp'; getMiniBar(j+1).style.height = miniArray[j+1] + '%'; }
        await miniDelay(40);
      }
      if (getMiniBar(j)) getMiniBar(j).className = 'mini-bar';
      if (getMiniBar(j+1)) getMiniBar(j+1).className = 'mini-bar';
    }
    if (getMiniBar(n - i - 1)) getMiniBar(n - i - 1).className = 'mini-bar done';
  }
  if (getMiniBar(0)) getMiniBar(0).className = 'mini-bar done';
  miniSorting = false;
  // restart after a pause
  await miniDelay(1800);
  initMini();
  await miniDelay(600);
  runMiniBubble();
}

initMini();
setTimeout(() => runMiniBubble(), 800);

// ─── Algorithm card static bar art ────────────────────────────────────────
const cardArtConfigs = {
  'art-bubble':    { heights: [85,30,65,20,90,45,70,15,55,80,35,60], color: null },
  'art-selection': { heights: [72,18,88,42,58,33,76,62,25,50,81,40], color: null },
  'art-insertion': { heights: [20,35,50,65,80,90,45,60,30,70,55,85], color: null },
  'art-merge':     { heights: [88,72,60,50,40,30,20,35,55,70,82,90], color: null },
  'art-quick':     { heights: [25,40,60,75,90,85,70,55,38,50,65,80], color: null },
  'art-heap':      { heights: [90,70,88,45,60,80,30,55,75,20,40,65], color: null },
};

Object.entries(cardArtConfigs).forEach(([id, cfg]) => {
  const container = document.getElementById(id);
  if (!container) return;
  cfg.heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'art-bar';
    bar.style.height = h + '%';
    // slight opacity variation for depth
    bar.style.opacity = (0.6 + (i % 3) * 0.13).toFixed(2);
    container.appendChild(bar);
  });
});

const revealEls = document.querySelectorAll('.algo-card, .section-header, .about-text, .about-comparison, .compare-card, .stat');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Stagger algo cards
document.querySelectorAll('.algo-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

// ─── Hero canvas (subtle dot grid background) ──────────────────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawDots();
  }
  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#141210';
    const spacing = 32;
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}
