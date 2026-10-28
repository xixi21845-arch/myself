/* ═══════════════════════════════════════
   張瑈君 · Personal Site · Main Script
   ═══════════════════════════════════════ */

// ── Particle System ──────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '#00d4ff' : '#0066ff';
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 120; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animationId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


// ── Typed Text Effect ────────────────────
const phrases = [
  '商業 × 科技 × 創新',
  '電子商務的探索者',
  '智慧科技的熱愛者',
  '數位商管的未來人才',
  '從新北出發，邁向世界 ✦'
];

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; charIdx = 0; setTimeout(type, 400); return; }
    setTimeout(type, 50);
  } else {
    typedEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { isDeleting = true; setTimeout(type, 2000); return; }
    setTimeout(type, 80);
  }
}
setTimeout(type, 800);


// ── Scroll Reveal ────────────────────────
const revealEls = document.querySelectorAll('.about-card, .skill-card, .passion-card, .timeline-item, .vision-card, .contact-item, .contact-card');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


// ── Skill Bar Animations ─────────────────
const skillBars = document.querySelectorAll('.skill-bar');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const fill = bar.querySelector('.skill-fill');
      const w = bar.getAttribute('data-width');
      setTimeout(() => { fill.style.width = w + '%'; }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(b => barObserver.observe(b));


// ── Counter Animation ────────────────────
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, 40);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));


// ── Navbar Scroll Effect ─────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(5,10,20,0.95)';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(5,10,20,0.8)';
    navbar.style.boxShadow = 'none';
  }
});


// ── Active Nav Link ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent-cyan)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ── Mouse Parallax on Avatar ─────────────
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;
    heroVisual.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
  });
}


// ── Cursor Glow Effect ───────────────────
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9999;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});


// ── Timeline Hover ───────────────────────
document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const dot = item.querySelector('.tl-dot');
    dot.style.borderColor = 'var(--accent-cyan)';
    dot.style.boxShadow = '0 0 10px rgba(0,212,255,0.4)';
  });
  item.addEventListener('mouseleave', () => {
    const dot = item.querySelector('.tl-dot');
    if (!dot.classList.contains('active')) {
      dot.style.borderColor = '';
      dot.style.boxShadow = '';
    }
  });
});


// ── Smooth Scroll for CTA buttons ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Boot Sequence ────────────────────────
function bootSequence() {
  const elements = [
    document.querySelector('.hero-badge'),
    document.querySelector('.hero-name'),
    document.querySelector('.hero-subtitle-line'),
    document.querySelector('.hero-tags'),
    document.querySelector('.hero-cta'),
  ];
  elements.forEach((el, i) => {
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => { el.style.transition = 'opacity 0.6s ease'; el.style.opacity = '1'; }, 200 + i * 150);
    }
  });
}
bootSequence();
