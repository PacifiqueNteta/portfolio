/* ==========================================================================
   Pacifique Nteta — Portfolio — script.js
   Modules: Preloader, Header scroll, Mobile menu, Smooth scroll + Scrollspy,
   Tabs, Skill bars, Counters, Certifications carousel, Scroll reveal,
   Typewriter, Contact form validation, Back to top, Project filter (Projects page).
   All modules are self-contained and initialised on DOMContentLoaded.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScrollAndSpy();
    initTabs();
    initTypewriter();
    initScrollReveal(); // sets up IntersectionObserver used by skills/counters too
    initSkillBars();
    initCounters();
    initTestimonialCarousel();
    initContactForm();
    initBackToTop();
    initProjectFilter();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    window.addEventListener('load', () => {
      setTimeout(() => pre.classList.add('done'), 250);
    });
    // Fallback in case 'load' already fired or takes too long
    setTimeout(() => pre.classList.add('done'), 2500);
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const toggle = () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ---------------- Mobile menu ---------------- */
  function initMobileMenu() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile)
    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Smooth scroll + scrollspy ---------------- */
  function initSmoothScrollAndSpy() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const header = document.getElementById('siteHeader');
    const sections = navLinks
      .map((l) => document.getElementById(l.dataset.nav))
      .filter(Boolean);

    // Smooth scroll with header offset (native scroll-behavior handles the
    // smoothness; we just correct for the fixed header height). Only runs
    // for links that point to an in-page anchor on this page.
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return; // let normal navigation happen (e.g. index.html#home)
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (!target || !header) return;
        e.preventDefault();
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', `#${targetId}`);
      });
    });

    if (!sections.length) return;

    // Scrollspy via IntersectionObserver
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((l) => l.classList.toggle('active', l.dataset.nav === id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------- Tabs (About section) ---------------- */
  function initTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', String(active));
        });

        document.querySelectorAll('.tab-panel').forEach((panel) => {
          const show = panel.id === `tab-${target}`;
          panel.classList.toggle('active', show);
          panel.hidden = !show;
          if (show && target === 'skills') animateSkillBars(panel);
        });
      });
    });
  }

  /* ---------------- Typewriter effect (hero) ---------------- */
  function initTypewriter() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const words = ['A Data Engineer', 'A Data Analyst', 'An Analytics Engineer', 'An Industrial Engineer'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 90);
    }
    tick();
  }

  /* ---------------- Scroll reveal (generic fade-up) ---------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((item, i) => {
      item.style.transitionDelay = `${Math.min(i % 3, 2) * 0.1}s`;
      observer.observe(item);
    });
  }

  /* ---------------- Skill bars (animate width on view) ---------------- */
  function initSkillBars() {
    const panel = document.getElementById('tab-skills');
    if (!panel) return;
    // Also observe in case the Skills tab section scrolls into view directly
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars(panel);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(panel);
  }

  function animateSkillBars(scope) {
    scope.querySelectorAll('.skill-fill').forEach((fill) => {
      if (fill.dataset.done) return;
      const pct = fill.dataset.percent;
      fill.style.width = pct + '%';
      fill.dataset.done = 'true';
      const em = fill.closest('.skill-item').querySelector('em');
      if (em) animateNumber(em, 0, parseInt(pct, 10), 1200, '%');
    });
  }

  /* ---------------- Counters (stats section) ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateNumber(el, 0, target, 1600, '', true);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  function animateNumber(el, from, to, duration, suffix = '', useComma = false) {
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(from + (to - from) * eased);
      el.textContent = (useComma ? value.toLocaleString() : value) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Certifications carousel ---------------- */
  function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('testimonialDots');
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.children);
    let perView = getPerView();
    let index = 0;
    let autoplayId = null;

    function getPerView() {
      const w = window.innerWidth;
      if (w <= 900) return 1;
      if (w <= 1080) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(cards.length - perView, 0);
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === index) dot.classList.add('active');
        dot.addEventListener('click', () => {
          index = i;
          update();
          restartAutoplay();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 26;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }

    function restartAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = setInterval(next, 4500);
    }

    window.addEventListener('resize', () => {
      const newPerView = getPerView();
      if (newPerView !== perView) {
        perView = newPerView;
        index = 0;
        buildDots();
      }
      update();
    });

    buildDots();
    update();
    restartAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => autoplayId && clearInterval(autoplayId));
    track.addEventListener('mouseleave', restartAutoplay);
  }

  /* ---------------- Contact form validation ---------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const success = document.getElementById('formSuccess');

    const fields = {
      name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name'), validate: (v) => v.trim().length >= 2 || 'Please enter your name.' },
      email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.' },
      subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject'), validate: (v) => v.trim().length >= 3 || 'Please enter a subject.' },
      message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message'), validate: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.' },
    };

    Object.values(fields).forEach(({ el }) => {
      el.addEventListener('input', () => validateField(el));
      el.addEventListener('blur', () => validateField(el));
    });

    function keyFor(el) {
      return Object.keys(fields).find((k) => fields[k].el === el);
    }

    function validateField(el) {
      const key = keyFor(el);
      const field = fields[key];
      const result = field.validate(el.value);
      if (result === true) {
        el.classList.remove('invalid');
        field.err.textContent = '';
        return true;
      }
      el.classList.add('invalid');
      field.err.textContent = result;
      return false;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.values(fields).forEach(({ el }) => {
        if (!validateField(el)) allValid = false;
      });

      if (!allValid) {
        success.hidden = true;
        return;
      }

      // Simulate a successful send (no backend wired up).
      success.hidden = false;
      form.reset();
      Object.values(fields).forEach(({ el }) => el.classList.remove('invalid'));
      setTimeout(() => { success.hidden = true; }, 5000);
    });
  }

  /* ---------------- Back to top (with scroll-progress ring) ---------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const circle = document.getElementById('scrollProgressCircle');
    const radius = circle ? circle.r.baseVal.value : 21;
    const circumference = 2 * Math.PI * radius;

    if (circle) {
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      btn.classList.toggle('show', scrollTop > 500);
      if (circle) {
        circle.style.strokeDashoffset = `${circumference - progress * circumference}`;
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- Project filter (Projects page only) ---------------- */
  function initProjectFilter() {
    const filterBar = document.getElementById('projectFilters');
    const grid = document.getElementById('allProjectsGrid');
    if (!filterBar || !grid) return;

    const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));
    const cards = Array.from(grid.querySelectorAll('.portfolio-item'));

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.toggle('active', b === btn));
        const filter = btn.dataset.filter;
        cards.forEach((card) => {
          const cats = (card.dataset.category || '').split(' ');
          const show = filter === 'all' || cats.includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- Hero picture on scroll ---------------- */
  /* Reference video showed the hero photo scrolling normally with the page —
     no parallax, pin, or shrink/fade. So the photo just uses the existing
     one-time fade-up reveal (via [data-reveal], set up in initScrollReveal)
     like every other section, and otherwise scrolls like plain content. */
})();