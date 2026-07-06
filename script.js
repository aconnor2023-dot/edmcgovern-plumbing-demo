// =========================================================
// BUSINESS HOURS — edit these to match real hours
// =========================================================
const HOURS = {
  0: null,          // Sunday - closed (emergency only)
  1: [8, 18],
  2: [8, 18],
  3: [8, 18],
  4: [8, 18],
  5: [8, 18],
  6: [9, 13],
};

function isOpenNow(date) {
  const day = date.getDay();
  const range = HOURS[day];
  if (!range) return false;
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= range[0] && hour < range[1];
}

function updateStatus() {
  const now = new Date();
  const open = isOpenNow(now);

  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const clockStatus = document.getElementById('liveClockStatus');

  if (open) {
    dot.classList.add('is-open');
    dot.classList.remove('is-closed');
    text.textContent = 'Open now — call away';
    if (clockStatus) clockStatus.textContent = 'Open now — call away';
  } else {
    dot.classList.add('is-closed');
    dot.classList.remove('is-open');
    text.textContent = 'Closed — emergencies still answered';
    if (clockStatus) clockStatus.textContent = 'Closed — emergencies still answered';
  }

  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
updateStatus();
setInterval(updateStatus, 1000);

// =========================================================
// MOBILE NAV TOGGLE
// =========================================================
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

// =========================================================
// ANIMATED STAT COUNTERS (trigger on scroll into view)
// =========================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach(el => statObserver.observe(el));

// =========================================================
// SCROLL REVEAL
// =========================================================
document.querySelectorAll('.service-card, .review-card, .why__copy, .why__badge-panel, .contact__info, .contact__form')
  .forEach(el => el.setAttribute('data-reveal', ''));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// =========================================================
// REVIEWS CAROUSEL
// =========================================================
const track = document.getElementById('reviewsTrack');
const dotsWrap = document.getElementById('reviewsDots');
const slides = track ? Array.from(track.children) : [];
let activeSlide = 0;
let carouselTimer;

function goToSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${activeSlide * 100}%)`;
  dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('is-active', i === activeSlide));
}

function startCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => goToSlide(activeSlide + 1), 5000);
}

if (slides.length) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show review ${i + 1}`);
    dot.addEventListener('click', () => { goToSlide(i); startCarousel(); });
    dotsWrap.appendChild(dot);
  });
  goToSlide(0);
  startCarousel();
}

// =========================================================
// CONTACT FORM VALIDATION (client-side demo — no backend wired up)
// =========================================================
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

function setError(fieldId, message) {
  const field = document.getElementById(fieldId).closest('.field');
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (message) {
    field.classList.add('is-invalid');
    errorEl.textContent = message;
  } else {
    field.classList.remove('is-invalid');
    errorEl.textContent = '';
  }
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('name').value.trim();
  if (name.length < 2) { setError('name', 'Please enter your name.'); valid = false; }
  else setError('name', '');

  const phone = document.getElementById('phone').value.trim();
  const phonePattern = /^[0-9+\s()-]{7,}$/;
  if (!phonePattern.test(phone)) { setError('phone', 'Please enter a valid phone number.'); valid = false; }
  else setError('phone', '');

  const message = document.getElementById('message').value.trim();
  if (message.length < 5) { setError('message', 'Let us know what you need done.'); valid = false; }
  else setError('message', '');

  return valid;
}

['name', 'phone', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('blur', validateForm);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) {
    formNote.textContent = 'Please fix the highlighted fields.';
    formNote.classList.remove('is-success');
    return;
  }
  // Demo only: no backend is connected yet. Wire this up to an email
  // service (e.g. Formspree, Netlify Forms) before going live.
  formNote.textContent = "Thanks — Ed will get back to you shortly.";
  formNote.classList.add('is-success');
  form.reset();
});

// =========================================================
// FOOTER YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();
