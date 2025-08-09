/* ===== Helper (always on single page) ===== */
function isHomePage(){ return true; }

/* ===== Mobile nav toggle ===== */
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close when clicking a link on mobile
  links.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ===== Scroll progress bar ===== */
const bar = document.querySelector('.scrollbar');
function setScrollProgress() {
  const h = document.body.scrollHeight - innerHeight;
  const pct = Math.min(100, Math.max(0, (scrollY / (h || 1)) * 100));
  if (bar) bar.style.width = pct + '%';
}
addEventListener('scroll', setScrollProgress);
setScrollProgress();

/* ===== Active nav link on scroll ===== */
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = document.querySelectorAll('.nav-link');
function setActiveLink() {
  const pos = scrollY + 140;
  let cur = 'home';
  sections.forEach(s => { if (pos >= s.offsetTop) cur = s.id; });
  navLinks.forEach(a => {
    const on = a.getAttribute('href') === `#${cur}`;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
addEventListener('scroll', setActiveLink);
setActiveLink();

/* ===== Reveal (slide & fade) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== Hero role rotator ===== */
const roles = ['a student','a learner','a UI/UX admirer','a data science enthusiast'];
const rotator = document.getElementById('rotator');
let idx = 0;
setInterval(() => {
  if (!rotator) return;
  idx = (idx + 1) % roles.length;
  rotator.style.opacity = 0; rotator.style.transform = 'translateY(8px)';
  setTimeout(() => {
    rotator.textContent = roles[idx];
    rotator.style.opacity = 1; rotator.style.transform = 'translateY(0)';
  }, 220);
}, 2600);

/* ===== Card tilt (subtle) ===== */
function addTilt(el) {
  const damp = 18;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -damp;
    const ry = ((x / r.width) - 0.5) * damp;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translateY(0)'; });
}
document.querySelectorAll('[data-tilt]').forEach(addTilt);

/* ===== Spotlight position (cards + buttons) ===== */
function attachSpotlight(selector){
  document.querySelectorAll(selector).forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--sx', x + '%');
      el.style.setProperty('--sy', y + '%');
      // for buttons ripple
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });
}
attachSpotlight('.skill-mini, .proj-card, .mini-card, .info-card, .resume-box, .btn, .btn-ghost');

/* ===== Stats count-up ===== */
const counters = document.querySelectorAll('.stat .num');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target || '0', 10);
    let cur = 0; const step = Math.ceil(Math.max(1, target / 60));
    const t = setInterval(() => {
      cur += step; if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 16);
    obs.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

/* ===== Contact form (frontend only) ===== */
const form = document.getElementById('contactForm');
const response = document.getElementById('formResponse');
if (form && response) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      response.textContent = 'Please fill out all fields.';
      response.style.color = '#ff8b8b';
      return;
    }
    response.textContent = 'Thanks! Your message has been sent.';
    response.style.color = 'var(--accent)';
    form.reset();
    setTimeout(()=> response.textContent='', 4000);
  });
}

/* ===== Back-to-top FAB ===== */
const toTop = document.querySelector('.to-top-fab');
function toggleToTop() {
  if (!toTop) return;
  if (scrollY > 300) toTop.classList.remove('hidden');
  else toTop.classList.add('hidden');
}
toggleToTop();
addEventListener('scroll', toggleToTop);

if (toTop) {
  toTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Footer year ===== */
document.getElementById('year').textContent = new Date().getFullYear();
