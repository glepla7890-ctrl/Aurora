// script.js — Vanilla JS, no dependencies
(() => {
  // Elements
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const form = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');
  const clearBtn = document.getElementById('clearBtn');

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    // simple class show for mobile
    document.querySelector('.nav-list').style.display = expanded ? '' : 'flex';
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav after click
        if (window.innerWidth < 720) {
          document.querySelector('.nav-list').style.display = '';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Theme toggle with persistence
  const THEME_KEY = 'aurora_theme';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light') body.classList.add('light');

  const updateThemeButton = () => {
    const isLight = body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };
  updateThemeButton();

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem(THEME_KEY, body.classList.contains('light') ? 'light' : 'dark');
    updateThemeButton();
  });

  // Year update
  yearEl.textContent = new Date().getFullYear();

  // Simple carousel auto-advance
  (() => {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    let idx = 0;
    const show = (n) => {
      slides.forEach((s, i) => s.classList.toggle('visible', i === n));
    };
    show(idx);
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 4500);
  })();

  // Contact form validation (client-side)
  const setError = (id, msg) => document.getElementById(id).textContent = msg || '';
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let ok = true;
    setError('err-name', '');
    setError('err-email', '');
    setError('err-message', '');
    document.getElementById('formStatus').textContent = '';

    if (name.length < 2) { setError('err-name', 'Please enter your name.'); ok = false; }
    if (!isEmail(email)) { setError('err-email', 'Please enter a valid email.'); ok = false; }
    if (message.length < 10) { setError('err-message', 'Message must be at least 10 characters.'); ok = false; }

    if (!ok) return;

    // Simulate submission — in production, replace with fetch POST to your endpoint
    document.getElementById('formStatus').textContent = 'Sending message...';
    const payload = { name, email, message, submittedAt: new Date().toISOString() };

    // Fake delay to mimic network request (non-blocking)
    setTimeout(() => {
      console.log('Form payload (send to server):', payload);
      document.getElementById('formStatus').textContent = 'Thanks! We received your message.';
      form.reset();
    }, 800);
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    setError('err-name',''); setError('err-email',''); setError('err-message','');
    document.getElementById('formStatus').textContent = '';
  });

  // Accessibility: close menus with escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('.nav-list').style.display = '';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
