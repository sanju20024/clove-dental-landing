/* =========================================================================
   Polished site script (nav + hero carousel + booking + scrollers + services)
   - Single-file, defensive, and faithful to your original behaviors
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------- Header & Nav ---------------------------- */
  function initHeaderNav() {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!header || !mainNav) {
      console.warn('Header/nav init skipped: required DOM nodes missing');
      return;
    }

    // reveal logo
    requestAnimationFrame(() => header.classList.add('header-loaded'));

    /* update mainNav top to header height */
    function updateNavTop() {
      const h = header.offsetHeight || header.getBoundingClientRect().height || 72;
      mainNav.style.top = h + 'px';
    }
    updateNavTop();
    requestAnimationFrame(updateNavTop);
    window.addEventListener('resize', updateNavTop);

    /* theme toggling (persisted) */
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
          themeToggle.setAttribute('aria-pressed', 'true');
          const ico = themeToggle.querySelector('.theme-ico'); if (ico) ico.textContent = '☀️';
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) {
          themeToggle.setAttribute('aria-pressed', 'false');
          const ico = themeToggle.querySelector('.theme-ico'); if (ico) ico.textContent = '🌙';
        }
      }
    }
    try {
      const saved = localStorage.getItem('clove-theme');
      applyTheme(saved === 'dark' ? 'dark' : 'light');
    } catch (e) {
      applyTheme('light');
    }
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('clove-theme', next); } catch (e) {}
      });
    }

    /* body lock helpers */
    function lockBody(lock) {
      if (lock) { body.style.overflow = 'hidden'; body.style.touchAction = 'none'; }
      else { body.style.overflow = ''; body.style.touchAction = ''; }
    }

    /* open/close main nav (mobile) */
    function openNav() {
      mainNav.classList.add('show');
      requestAnimationFrame(() => { mainNav.style.maxHeight = mainNav.scrollHeight + 'px'; });
      if (navToggle) { navToggle.setAttribute('aria-expanded', 'true'); navToggle.setAttribute('aria-label', 'Close menu'); }
      lockBody(true);
    }
    function closeNav() {
      mainNav.style.maxHeight = '0px';
      if (navToggle) { navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Open menu'); }
      const onEnd = (e) => {
        if (e.propertyName === 'max-height' && mainNav.style.maxHeight === '0px') {
          mainNav.classList.remove('show');
          mainNav.removeEventListener('transitionend', onEnd);
        }
      };
      mainNav.addEventListener('transitionend', onEnd);
      lockBody(false);

      // close submenus and reset
      document.querySelectorAll('.has-sub.open, .has-sub.pinned').forEach(n => {
        n.classList.remove('open', 'pinned');
        const sub = n.querySelector('.sub-menu');
        if (sub) { sub.style.maxHeight = '0px'; sub.style.opacity = '0'; }
        const btn = n.querySelector('.sub-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        if (expanded) closeNav(); else openNav();
      });
    }

    // close main nav when clicking a nav link (mobile)
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') closeNav();
    }));

    /* clicking outside closes open panels */
    document.addEventListener('click', (e) => {
      // close main panel if open and click outside it and navToggle
      if (mainNav.classList.contains('show')) {
        if (!mainNav.contains(e.target) && !(navToggle && navToggle.contains(e.target))) {
          closeNav();
        }
      }
      // close any open/pinned submenu if click outside the has-sub
      document.querySelectorAll('.has-sub.open, .has-sub.pinned').forEach(has => {
        if (!has.contains(e.target)) {
          has.classList.remove('open', 'pinned');
          const sub = has.querySelector('.sub-menu');
          if (sub) { sub.style.maxHeight = '0px'; sub.style.opacity = '0'; }
          const b = has.querySelector('.sub-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
    });

    /* submenu toggles (desktop + mobile + keyboard) */
    document.querySelectorAll('.has-sub').forEach(has => {
      const btn = has.querySelector('.sub-toggle');
      const submenu = has.querySelector('.sub-menu');
      if (!btn || !submenu) return;

      // initialize
      submenu.style.maxHeight = '0px';
      submenu.style.opacity = '0';
      btn.setAttribute('aria-expanded', 'false');

      // click handler
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isDesktop = window.innerWidth > 920;

        // close others
        document.querySelectorAll('.has-sub').forEach(other => {
          if (other !== has) {
            other.classList.remove('open', 'pinned');
            const otherSub = other.querySelector('.sub-menu');
            if (otherSub) { otherSub.style.maxHeight = '0px'; otherSub.style.opacity = '0'; }
            const otherBtn = other.querySelector('.sub-toggle');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isDesktop) {
          const wasPinned = has.classList.contains('pinned');
          if (wasPinned) {
            has.classList.remove('pinned', 'open');
            btn.setAttribute('aria-expanded', 'false');
            submenu.style.maxHeight = '0px';
            setTimeout(() => submenu.style.opacity = '0', 180);
          } else {
            has.classList.add('pinned', 'open');
            btn.setAttribute('aria-expanded', 'true');
            submenu.style.opacity = '1';
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
          }
        } else {
          const opened = has.classList.toggle('open');
          btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
          if (opened) {
            submenu.style.opacity = '1';
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
          } else {
            submenu.style.maxHeight = '0px';
            setTimeout(() => submenu.style.opacity = '0', 180);
          }
        }

        // if panel open, resize it to fit submenu
        if (mainNav.classList.contains('show')) {
          requestAnimationFrame(() => mainNav.style.maxHeight = mainNav.scrollHeight + 'px');
        }
      });

      // keyboard support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });

      // hover behavior (desktop)
      has.addEventListener('mouseenter', () => {
        if (window.innerWidth > 920) {
          has.classList.add('hover-open', 'open');
          const b = has.querySelector('.sub-toggle'); if (b) b.setAttribute('aria-expanded', 'true');
          submenu.style.opacity = '1';
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
        }
      });
      has.addEventListener('mouseleave', () => {
        if (window.innerWidth > 920) {
          if (has.classList.contains('pinned')) return;
          has.classList.remove('hover-open', 'open');
          const b = has.querySelector('.sub-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
          submenu.style.maxHeight = '0px';
          setTimeout(() => submenu.style.opacity = '0', 180);
        }
      });
    });

    /* ESC to close everything */
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') closeNav();
        document.querySelectorAll('.has-sub.open, .has-sub.pinned').forEach(n => {
          n.classList.remove('open', 'pinned');
          const sub = n.querySelector('.sub-menu'); if (sub) { sub.style.maxHeight = '0px'; sub.style.opacity = '0'; }
          const b = n.querySelector('.sub-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* reset on resize */
    window.addEventListener('resize', () => {
      updateNavTop();
      if (window.innerWidth > 920) {
        mainNav.classList.remove('show'); mainNav.style.maxHeight = null;
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        lockBody(false);
        document.querySelectorAll('.has-sub.open, .has-sub.pinned').forEach(n => {
          n.classList.remove('open', 'pinned');
          const sub = n.querySelector('.sub-menu'); if (sub) { sub.style.maxHeight = '0px'; sub.style.opacity = '0'; }
          const b = n.querySelector('.sub-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
        });
      } else {
        if (mainNav.classList.contains('show')) mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
      }
    });
  } // end initHeaderNav

  /* ---------------------------- Hero Carousel ---------------------------- */
  function initHeroCarousel() {
    const hero = document.getElementById('hero');
    if (!hero) { console.warn('Hero carousel skipped: #hero missing'); return; }

    const track = hero.querySelector('.hc-track');
    const viewport = hero.querySelector('.hc-viewport');
    if (!track || !viewport) { console.warn('Hero carousel skipped: .hc-track or .hc-viewport missing'); return; }

    // CONFIG (tweak these if needed)
    const imageCount = 5;         // images are hero-1 .. hero-5
    const folder = 'images/';     // path - ensure folder exists and is correct
    const delay = 3200;           // autoplay ms
    const swipeThreshold = 60;    // px
    const tryExts = ['.webp', '.jpg'];

    // build base names (without extension)
    const baseNames = [];
    for (let i = 1; i <= imageCount; i++) baseNames.push(`${folder}hero-${i}`);

    // helper that creates a slide using <picture> (webp source + jpg fallback)
    function makeSlideWithFallback(base) {
      const slide = document.createElement('div');
      slide.className = 'hc-slide';

      const card = document.createElement('div');
      card.className = 'hc-card';

      const picture = document.createElement('picture');

      // add <source> for webp (if supported)
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = base + '.webp';
      picture.appendChild(source);

      // final <img> (fallback)
      const img = document.createElement('img');
      img.decoding = 'async';
      img.loading = 'lazy';
      img.src = base + '.jpg'; // fallback jpg
      img.alt = '';
      img.addEventListener('error', () => {
        console.warn('Hero image failed to load (attempted webp+jpg):', base + '.webp', base + '.jpg');
        card.style.opacity = '0.75'; // mild placeholder effect
      });

      picture.appendChild(img);
      card.appendChild(picture);
      slide.appendChild(card);
      return slide;
    }

    // Populate track: leading clone (last), real slides, trailing clone (first)
    track.innerHTML = '';
    if (baseNames.length === 0) return;

    const firstSlide = makeSlideWithFallback(baseNames[0]);
    const lastSlide = makeSlideWithFallback(baseNames[baseNames.length - 1]);

    // leading clone
    track.appendChild(lastSlide.cloneNode(true));
    // real slides
    baseNames.forEach(b => track.appendChild(makeSlideWithFallback(b)));
    // trailing clone
    track.appendChild(firstSlide.cloneNode(true));

    // state
    let slides = Array.from(track.children);
    let idx = 1; // start at first real slide
    let animating = false;
    let timer = null;
    let touch = { startX: 0, deltaX: 0, touching: false };

    if (!viewport.hasAttribute('tabindex')) viewport.setAttribute('tabindex', '0');

    // compute offset & apply transform
    function update(noAnimation = false) {
      slides = Array.from(track.children);
      const target = slides[idx];
      if (!target) return;
      const offset = -target.offsetLeft;
      if (noAnimation) {
        track.style.transition = 'none';
        track.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(() => { track.style.transition = ''; });
      } else {
        track.style.transform = `translateX(${offset}px)`;
      }
    }

    function go(n) {
      if (animating) return;
      animating = true;
      idx = n;
      update(false);

      const onEnd = () => {
        track.removeEventListener('transitionend', onEnd);
        // handle clones
        slides = Array.from(track.children);
        if (idx >= slides.length - 1) { idx = 1; update(true); }
        if (idx <= 0) { idx = slides.length - 2; update(true); }
        animating = false;
      };
      track.addEventListener('transitionend', onEnd);
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }

    // autoplay controls
    function startAuto() { stopAuto(); timer = setInterval(next, delay); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    // pause/resume
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
    viewport.addEventListener('focusin', stopAuto);
    viewport.addEventListener('focusout', startAuto);

    // keyboard nav
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); startAuto(); }
      if (e.key === 'ArrowLeft') { prev(); startAuto(); }
    });

    // touch handlers
    viewport.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      stopAuto();
      touch.touching = true;
      touch.startX = e.touches[0].clientX;
      touch.deltaX = 0;
      track.style.transition = 'none';
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!touch.touching || !e.touches || !e.touches.length) return;
      touch.deltaX = e.touches[0].clientX - touch.startX;
      const baseOffset = -slides[idx].offsetLeft;
      track.style.transform = `translateX(${baseOffset + touch.deltaX}px)`;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (!touch.touching) return;
      touch.touching = false;
      track.style.transition = '';
      if (Math.abs(touch.deltaX) > swipeThreshold) {
        if (touch.deltaX < 0) next(); else prev();
      } else {
        update(false);
      }
      startAuto();
      touch.deltaX = 0;
    });

    // resize recalculation
    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => update(true), 120);
    });

    // wait for images to settle (non-blocking) then show carousel
    (function waitForImagesAndStart() {
      const imageEls = Array.from(track.querySelectorAll('img'));
      if (imageEls.length === 0) {
        update(true);
        track.classList.add('ready');
        startAuto();
        return;
      }

      const promises = imageEls.map(img => new Promise(resolve => {
        if (img.complete) return resolve(true);
        const done = () => { img.removeEventListener('load', done); img.removeEventListener('error', done); resolve(true); };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }));

      const TIMEOUT = 900; // ms
      Promise.race([Promise.all(promises), new Promise(r => setTimeout(r, TIMEOUT))]).then(() => {
        requestAnimationFrame(() => {
          slides = Array.from(track.children);
          idx = 1;
          update(true);
          track.classList.add('ready');
          startAuto();
          console.info('Hero carousel ready. Slides (incl clones):', slides.length);
        });
      }).catch((err) => {
        console.warn('Hero carousel image wait error:', err);
        requestAnimationFrame(() => {
          slides = Array.from(track.children);
          idx = 1;
          update(true);
          track.classList.add('ready');
          startAuto();
        });
      });
    })();
  } // end initHeroCarousel

  /* ---------------------------- Boot ---------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderNav();
    initHeroCarousel();
  });

  /* ===== booking form behaviour (robust selectors + fallbacks) ===== */
  (function bookingModule() {
    // prefer id 'booking-form' if present; otherwise pick .booking-form
    const form = document.getElementById('booking-form') || document.querySelector('.booking-form');
    if (!form) {
      // no form found; skip silently
      return;
    }

    // feedback element: id 'bf-feedback' or create one below the form
    let feedback = document.getElementById('bf-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'bf-feedback';
      feedback.setAttribute('aria-live', 'polite');
      feedback.style.marginTop = '8px';
      form.appendChild(feedback);
    }

    // clear button: id 'bf-clear' or .btn-ghost inside the form (reset)
    const clearBtn = document.getElementById('bf-clear') || form.querySelector('button[type="reset"], .btn-ghost');

    // map names: try to find controls robustly
    function findControl(nameVariants=[]) {
      for (const n of nameVariants) {
        const el = form.elements[n] || form.querySelector(`#${n}`) || form.querySelector(`[name="${n}"]`);
        if (el) return el;
      }
      return null;
    }

    const nameCtrl = findControl(['name', 'fullName', 'fullname']);
    const phoneCtrl = findControl(['phone', 'tel', 'telephone']);
    const serviceCtrl = findControl(['service']); // radios group found by name via form.elements
    const dateCtrl = findControl(['date', 'preferredDate']);
    const notesCtrl = findControl(['notes', 'note', 'notesField', 'message']);

    function markInvalid(control, message) {
      if (!control) return;
      const field = control.closest('.bf-field') || control.parentElement;
      if (field) field.classList.add('invalid');
      const err = field && field.querySelector('.bf-err');
      if (err) err.textContent = message;
    }

    function clearValidation() {
      form.querySelectorAll('.bf-field').forEach(f => f.classList.remove('invalid'));
      form.querySelectorAll('.bf-err').forEach(e => { if (e) e.textContent = ''; });
      feedback.textContent = '';
    }

    function validate() {
      let ok = true;
      clearValidation();

      // name
      const nameVal = nameCtrl && (nameCtrl.value || '').trim();
      if (!nameVal || nameVal.length < 2) {
        markInvalid(nameCtrl || form, 'Please enter your name.');
        ok = false;
      }

      // phone
      const phoneVal = phoneCtrl && (phoneCtrl.value || '').trim();
      if (!phoneVal || phoneVal.length < 6) {
        markInvalid(phoneCtrl || form, 'Please enter a valid phone.');
        ok = false;
      }

      // service: for radio group `service` use form.elements; otherwise check select
      let serviceVal = '';
      if (form.elements && form.elements['service']) {
        const el = form.elements['service'];
        if (el.length) {
          // radio NodeList
          for (let r of el) if (r.checked) { serviceVal = r.value; break; }
        } else serviceVal = el.value;
      } else if (serviceCtrl && serviceCtrl.value) {
        serviceVal = serviceCtrl.value;
      }
      if (!serviceVal) {
        markInvalid(serviceCtrl || form, 'Select a service.');
        ok = false;
      }

      // date
      const dateVal = dateCtrl && (dateCtrl.value || '').trim();
      if (!dateVal) {
        markInvalid(dateCtrl || form, 'Choose a preferred date.');
        ok = false;
      }

      return ok;
    }

    function clearForm() {
      try { form.reset(); } catch (e) {}
      clearValidation();
    }

    clearBtn && clearBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      clearForm();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      // gather data
      const data = {};
      if (nameCtrl) data.name = nameCtrl.value.trim();
      if (phoneCtrl) data.phone = phoneCtrl.value.trim();

      // service
      let serviceVal = '';
      if (form.elements && form.elements['service']) {
        const el = form.elements['service'];
        if (el.length) {
          for (let r of el) if (r.checked) { serviceVal = r.value; break; }
        } else serviceVal = el.value;
      } else if (serviceCtrl && serviceCtrl.value) serviceVal = serviceCtrl.value;
      data.service = serviceVal;

      if (dateCtrl) data.date = dateCtrl.value;
      if (notesCtrl) data.note = notesCtrl.value.trim();

      data.createdAt = new Date().toISOString();

      // disable submit for UX
      const submitBtn = form.querySelector('button[type="submit"], .btn-primary') || null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-disabled', 'true'); }

      feedback.textContent = 'Sending request...';

      // simulate network - replace this with fetch() to your API
      setTimeout(() => {
        try { localStorage.setItem('lastBooking', JSON.stringify(data)); } catch (err) {}
        feedback.textContent = `Thanks ${data.name ? data.name.split(' ')[0] : ''}! We received your request for ${data.service || 'a service'} on ${data.date || ''}. We'll contact you soon.`;
        // restore and reset after brief moment
        setTimeout(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-disabled'); }
          clearForm();
        }, 1100);
      }, 900);
    });
  })();

  /* ---------- Stats counters + trust logos scroller ---------- */
  (function statsAndTrust() {
    const statSection = document.getElementById('stats');
    if (!statSection) return;

    const counters = Array.from(statSection.querySelectorAll('.stat-value'));
    const logosTrack = statSection.querySelector('.logos-track');

    function animateCounter(el, duration = 1100) {
      const target = Number(el.getAttribute('data-target')) || 0;
      const start = 0;
      const startTime = performance.now();
      const step = (t) => {
        const elapsed = Math.min((t - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - elapsed, 3);
        const current = Math.floor(start + (target - start) * ease);
        el.textContent = Intl.NumberFormat().format(current);
        if (elapsed < 1) requestAnimationFrame(step);
        else el.textContent = Intl.NumberFormat().format(target);
      };
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && counters.length) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          counters.forEach(c => animateCounter(c, 1300));
          obs.disconnect();
        });
      }, { threshold: 0.35 });
      io.observe(statSection);
    } else {
      counters.forEach(c => animateCounter(c, 1300));
    }

    // Logos auto-scroll
    if (!logosTrack) return;

    let raf = null;
    let pos = 0;
    let speed = 0.5; // px per frame

    // duplicate items if not enough width to scroll smoothly
    const seedItems = Array.from(logosTrack.children);
    if (seedItems.length === 0) return;
    // Clone until content >= 2x container width
    function ensureLogoFill() {
      const containerWidth = logosTrack.parentElement ? logosTrack.parentElement.clientWidth : window.innerWidth;
      let attempts = 0;
      while (logosTrack.scrollWidth < containerWidth * 2 && attempts < 12) {
        seedItems.forEach(n => logosTrack.appendChild(n.cloneNode(true)));
        attempts++;
      }
    }
    ensureLogoFill();

    function loop() {
      pos -= speed;
      const resetAt = logosTrack.scrollWidth / 2 || logosTrack.scrollWidth;
      if (Math.abs(pos) >= resetAt) pos = 0;
      logosTrack.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    logosTrack.addEventListener('mouseenter', () => speed = 0.12);
    logosTrack.addEventListener('mouseleave', () => speed = 0.5);
    logosTrack.addEventListener('focusin', () => speed = 0.12);
    logosTrack.addEventListener('focusout', () => speed = 0.5);

    window.addEventListener('pagehide', () => { if (raf) cancelAnimationFrame(raf); });
    window.addEventListener('resize', () => { setTimeout(ensureLogoFill, 120); });
  })();

  /* ---------- Features strip scroller (continuous, slows on hover) ---------- */
  (function featuresStrip() {
    const strip = document.getElementById('features-strip');
    if (!strip) return;
    const track = strip.querySelector('.features-track');
    if (!track) return;
    if (track.__featuresScroller) return;
    track.__featuresScroller = true;

    const items = Array.from(track.children);
    if (items.length === 0) return;

    // clone until track is wide enough
    function ensureFilled() {
      const containerWidth = strip.clientWidth || window.innerWidth;
      let safety = 0;
      while (track.scrollWidth < containerWidth * 2 && safety < 24) {
        items.forEach(i => track.appendChild(i.cloneNode(true)));
        safety++;
      }
    }
    ensureFilled();

    let pos = 0;
    let raf = null;
    let speed = 0.6;
    const SPEED_NORMAL = 0.6, SPEED_SLOW = 0.12;

    strip.addEventListener('mouseenter', () => speed = SPEED_SLOW);
    strip.addEventListener('mouseleave', () => speed = SPEED_NORMAL);
    strip.addEventListener('focusin', () => speed = SPEED_SLOW);
    strip.addEventListener('focusout', () => speed = SPEED_NORMAL);

    function loop() {
      pos -= speed;
      const resetWidth = track.scrollWidth / 2 || track.scrollWidth;
      if (Math.abs(pos) >= resetWidth) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener('resize', () => { setTimeout(ensureFilled, 120); });
    window.addEventListener('pagehide', () => { if (raf) cancelAnimationFrame(raf); });
  })();

  /* ---------- Services interaction (modal details + popups) ---------- */
  (function servicesModule(){
    const section = document.getElementById('services');
    if (!section) return;

    const modal = document.getElementById('svc-modal');
    const modalTitle = modal && modal.querySelector('#svc-modal-title');
    const modalSub = modal && modal.querySelector('#svc-modal-sub');
    const modalBody = modal && modal.querySelector('#svc-modal-body');
    const modalCloseBtns = modal ? Array.from(modal.querySelectorAll('[data-close], .svc-modal-close, .svc-modal-close-btn')) : [];

    const DETAILS = {
      'root-canal': {
        title: 'Root Canal Treatment',
        sub: 'Precise & pain-minimised therapy',
        body: `<p>Root canal treatment removes infection from inside the tooth and restores comfort. We use modern rotary endodontics, local anaesthesia and CBCT when needed for precise outcomes.</p>`
      },
      'implant': {
        title: 'Dental Implants',
        sub: 'Long-lasting tooth replacement',
        body: `<p>We place implants with guided surgery and prosthetic restorations for natural-looking results. Options for single-tooth, full-arch and implant overdentures.</p>`
      },
      'cosmetic': {
        title: 'Cosmetic Dentistry',
        sub: 'Smile confident care',
        body: `<p>Veneers, bleaching and cosmetic bonding to enhance aesthetics with conservative techniques and predictable outcomes.</p>`
      },
      'orthodontics': {
        title: 'Orthodontics & Aligners',
        sub: 'Straighten teeth comfortably',
        body: `<p>Clear aligners and braces for adults and children with careful treatment planning and follow-ups.</p>`
      }
      // add other keys if your markup includes them
    };

    function openModal(id) {
      const info = DETAILS[id];
      if (!info || !modal || !modalTitle || !modalSub || !modalBody) return;
      modalTitle.textContent = info.title;
      modalSub.textContent = info.sub;
      modalBody.innerHTML = info.body;
      modal.setAttribute('aria-hidden','false');
      document.documentElement.style.overflow = 'hidden';
      const closeBtn = modal.querySelector('.svc-modal-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute('aria-hidden','true');
      document.documentElement.style.overflow = '';
      const firstCard = section.querySelector('.service-item');
      if (firstCard) firstCard.focus();
    }

    // wire up service items
    section.querySelectorAll('.service-item').forEach(card => {
      const id = card.dataset.service;
      const btn = card.querySelector('.svc-more');

      // click anywhere on card opens modal
      card.addEventListener('click', (e) => {
        // ignore if clicking a link or button that should behave differently
        const targetIsInteractive = e.target.closest('a, button, input, select, textarea');
        if (targetIsInteractive && !e.target.classList.contains('svc-more')) return;
        openModal(id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(id);
        }
      });

      if (btn) {
        btn.addEventListener('click', (e) => { e.stopPropagation(); openModal(id); });
      }
    });

    // close modal via close buttons
    modalCloseBtns.forEach(node => node.addEventListener('click', closeModal));
    // backdrop click closes
    const backdrop = modal && modal.querySelector('.svc-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // ESC to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  })();

  /* ---------- Service popup helpers (generic popup open/close) ---------- */
  (function popupHelper() {
    function qs(sel, root = document) { return root.querySelector(sel); }
    function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }

    const hideWhileModal = ['header', '#main-nav', '.hero-section', '.services', '.stats-section', 'footer'];

    function setInertForModal(open, modalEl) {
      hideWhileModal.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (!el || (modalEl && modalEl.contains(el))) return;
          if (open) {
            el.setAttribute('aria-hidden', 'true');
            el.style.pointerEvents = 'none';
          } else {
            el.removeAttribute('aria-hidden');
            el.style.pointerEvents = '';
          }
        });
      });
      document.body.classList.toggle('modal-open', open);
    }

    function openServicePopup(popup) {
      if (!popup || popup.classList.contains('open')) return;
      popup.classList.add('open');
      popup.setAttribute('aria-hidden', 'false');
      popup.setAttribute('role', 'dialog');
      setInertForModal(true, popup);
      const closeBtn = qs('.popup-close', popup) || qs('.close-x', popup);
      (closeBtn || popup).focus && (closeBtn || popup).focus();
    }

    function closeServicePopup(popup) {
      if (!popup || !popup.classList.contains('open')) return;
      popup.classList.remove('open');
      popup.setAttribute('aria-hidden', 'true');
      setInertForModal(false, popup);
    }

    // attach to .learn-more buttons automatically
    qsa('.learn-more, button.learn-more, a.learn-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target') || btn.getAttribute('data-popup');
        let popup = null;
        if (target) popup = document.querySelector(target);
        if (!popup) popup = btn.closest('.service-card') && btn.closest('.service-card').querySelector('.service-popup');
        if (!popup) popup = document.querySelector('.service-popup');
        if (popup) openServicePopup(popup);
      });
    });

    // close on .popup-close etc
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.popup-close, .close-x, .service-popup .close-btn');
      if (closeBtn) {
        const popup = closeBtn.closest('.service-popup, .service-modal');
        closeServicePopup(popup);
        return;
      }
      // close when clicking outside a visible popup content
      const openPopup = e.target.closest('.service-popup.open, .service-modal.open');
      if (!openPopup) return;
      // if click outside the inner body element, close
      if (!e.target.closest('.service-popup .popup-body') && !e.target.closest('.service-modal .popup-body')) {
        closeServicePopup(openPopup);
      }
    });

    // ESC closes any open popup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openPop = document.querySelector('.service-popup.open, .service-modal.open');
        if (openPop) closeServicePopup(openPop);
      }
    });
  })();

  // lazy-assign data-img -> src (safe fallback)
  document.querySelectorAll('.svc-img').forEach(img => {
    try {
      if ((!img.getAttribute('src') || img.getAttribute('src') === '') && img.dataset.img) {
        img.src = img.dataset.img;
        img.loading = img.loading || 'lazy';
        img.decoding = img.decoding || 'async';
      }
    } catch (e) {}
  });

})(); // eof
/* ---------- Video testimonials (YouTube) ---------- */
(function videoTestimonials() {
  // helpers
  function extractYouTubeID(url) {
    if (!url) return null;
    // common ID extraction (handles many YouTube URL shapes)
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{6,11})/,
      /v=([a-zA-Z0-9_-]{6,11})/,
      /embed\/([a-zA-Z0-9_-]{6,11})/,
      /\/v\/([a-zA-Z0-9_-]{6,11})/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) return m[1];
    }
    // fallback: try last path segment
    try {
      const u = new URL(url);
      const seg = u.pathname.split('/').pop();
      if (seg && seg.length >= 6 && seg.length <= 11) return seg;
    } catch(e) {}
    return null;
  }

  function ytThumbUrl(id, size = 'hqdefault') {
    return id ? `https://i.ytimg.com/vi/${id}/${size}.jpg` : '';
  }

  // attach thumbnails & click handling
  const grid = document.querySelector('.tc-video-grid');
  const modal = document.getElementById('video-modal');
  const frameWrap = modal && modal.querySelector('.video-frame');
  const backdrop = modal && modal.querySelector('.video-backdrop');
  const closeBtn = modal && modal.querySelector('.video-close');

  if (!grid || !modal || !frameWrap) return;

  // set thumbnail backgrounds
  grid.querySelectorAll('.video-card').forEach(card => {
    const url = card.dataset.youtube || card.getAttribute('href') || '';
    const id = extractYouTubeID(url);
    const thumb = ytThumbUrl(id, 'hqdefault');
    const thumbEl = card.querySelector('.video-thumb');
    if (thumbEl) thumbEl.style.backgroundImage = `url("${thumb}")`;
    // store id for quick open
    card.dataset.vid = id || '';
  });

  // open modal with embed
  function openVideo(id, origUrl) {
    if (!id) return;
    modal.setAttribute('aria-hidden','false');
    // create iframe lazily
    const iframe = document.createElement('iframe');
    const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    iframe.setAttribute('src', src);
    iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', 'Testimonial video');
    // empty container, append
    frameWrap.innerHTML = '';
    frameWrap.appendChild(iframe);
    // lock scroll
    document.documentElement.style.overflow = 'hidden';
    // focus close button for accessibility
    closeBtn && closeBtn.focus();
  }

  function closeVideo() {
    modal.setAttribute('aria-hidden','true');
    // remove iframe (stops playback)
    frameWrap.innerHTML = '';
    document.documentElement.style.overflow = '';
  }

  // click handlers on cards
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.video-card');
    if (!card) return;
    e.preventDefault();
    const id = card.dataset.vid;
    if (!id) {
      console.warn('Video testimonial: could not extract YouTube id for', card);
      return;
    }
    openVideo(id);
  });

  // close handlers
  closeBtn && closeBtn.addEventListener('click', closeVideo);
  backdrop && backdrop.addEventListener('click', closeVideo);
  // ESC to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeVideo();
  });

  // ensure closing when user navigates away / pagehide
  window.addEventListener('pagehide', () => { if (modal.getAttribute('aria-hidden') === 'false') closeVideo(); });
})();
/* ---------- Video Testimonials (YouTube lazy thumbnails + lightbox) ---------- */
(function videoTestimonials(){
  const section = document.getElementById('video-testimonials');
  if (!section) return;

  // helpers
  function extractYouTubeId(input) {
    // accepts plain id OR full youtube url
    if (!input) return null;
    const idMatch = input.match(/(?:v=|\/v\/|\/embed\/|youtu\.be\/|\/watch\?v=)?([A-Za-z0-9_-]{6,})/);
    return idMatch ? idMatch[1] : input;
  }
  function thumbUrl(id) {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; // high quality thumbnail
  }

  const items = Array.from(section.querySelectorAll('.vt-thumb'));
  items.forEach(btn => {
    // normalize id
    const raw = btn.getAttribute('data-video-id') || '';
    const id = extractYouTubeId(raw);
    btn.dataset.ytid = id || '';

    // set thumbnail img (lazy)
    const img = btn.querySelector('.vt-img');
    if (img && id) {
      img.src = thumbUrl(id);
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });

  // lightbox + play
  const lightbox = document.getElementById('vt-lightbox');
  const playerWrap = lightbox && lightbox.querySelector('#vt-player');
  const closeBtn = lightbox && lightbox.querySelector('.vt-close');
  const backdrop = lightbox && lightbox.querySelector('.vt-backdrop');

  function openLightbox(ytid) {
    if (!lightbox || !playerWrap) return;
    // construct embed src with modest branding, no related videos, allow autoplay
    const src = `https://www.youtube.com/embed/${encodeURIComponent(ytid)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    playerWrap.innerHTML = `<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video testimonial"></iframe>`;
    lightbox.setAttribute('aria-hidden','false');
    // lock page scroll
    document.documentElement.style.overflow = 'hidden';
    // focus close button
    (closeBtn || playerWrap).focus && (closeBtn || playerWrap).focus();
  }

  function closeLightbox() {
    if (!lightbox || !playerWrap) return;
    lightbox.setAttribute('aria-hidden','true');
    // remove iframe to stop playback
    playerWrap.innerHTML = '';
    document.documentElement.style.overflow = '';
  }

  // click handlers on thumbs
  items.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.ytid;
      if (!id) return console.warn('Missing YouTube id for video testimonial');
      openLightbox(id);
    });

    // keyboard
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // close actions
  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  backdrop && backdrop.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox(); });

  // cleanup on pagehide
  window.addEventListener('pagehide', () => { if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox(); });
})();
document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".short-card");
  const modal = document.getElementById("short-modal");
  const modalFrame = modal.querySelector(".short-frame");
  const closeBtn = modal.querySelector(".short-close");

  /* -------- Thumbnail Hover Auto-Play (muted preview) -------- */
  cards.forEach(card => {
    const thumb = card.querySelector(".short-thumb");
    const img = thumb.querySelector("img");
    const videoUrl = card.dataset.video + "&autoplay=1&mute=1&controls=0";

    let previewFrame = null;

    // On hover: replace thumbnail with muted autoplay
    card.addEventListener("mouseenter", () => {
      previewFrame = document.createElement("iframe");
      previewFrame.src = videoUrl;
      previewFrame.allow = "autoplay; encrypted-media";
      previewFrame.style.position = "absolute";
      previewFrame.style.width = "100%";
      previewFrame.style.height = "100%";

      img.style.opacity = 0;
      thumb.appendChild(previewFrame);
    });

    // On mouse leave: remove video, show image
    card.addEventListener("mouseleave", () => {
      img.style.opacity = 1;
      if (previewFrame) previewFrame.remove();
      previewFrame = null;
    });

    /* -------- Click → OPEN MODAL (with sound OFF by default) -------- */
    card.addEventListener("click", () => {
      modal.classList.add("show");

      modalFrame.innerHTML = `
        <iframe src="${card.dataset.video}?autoplay=1&mute=0&controls=1"
          allow="autoplay; picture-in-picture; encrypted-media"
          allowfullscreen>
        </iframe>`;
    });
  });

  /* -------- Modal Close -------- */
  closeBtn.addEventListener("click", closeModal);
  modal.querySelector(".short-backdrop").addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.remove("show");
    modalFrame.innerHTML = ""; // stop video
  }

});
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.shorts-track');
  const prevBtn = document.querySelector('.shorts-prev');
  const nextBtn = document.querySelector('.shorts-next');
  const cards = Array.from(document.querySelectorAll('.short-card'));
  const modal = document.getElementById('video-modal');
  const modalFrame = modal.querySelector('.video-frame');
  const modalClose = modal.querySelector('.video-close');
  const modalBackdrop = modal.querySelector('.video-backdrop');
  const soundBtn = modal.querySelector('.video-sound');

  if (!track) return;

  /* Utility: normalize video input into an embed src */
  function toEmbedSrc(dataVideo, params = {}) {
    // if looks like full URL with /embed/ or watch?v=, convert to embed form
    let id = dataVideo.trim();
    // if url contains 'watch?v='
    const m = id.match(/v=([^&?/]+)/);
    if (m) id = m[1];
    // if url contains youtu.be/
    const m2 = id.match(/youtu\.be\/([^&?/]+)/);
    if (m2) id = m2[1];

    // if already embed path e.g. /embed/ID
    const m3 = id.match(/embed\/([^&?/]+)/);
    if (m3) id = m3[1];

    // construct embed url
    const p = new URLSearchParams(params).toString();
    return `https://www.youtube.com/embed/${id}${p ? '?' + p : ''}`;
  }

  /* ---------- Hover preview (muted) ---------- */
  cards.forEach(card => {
    let preview = null;
    const thumb = card.querySelector('.short-thumb');
    const img = card.querySelector('.short-thumb-img');
    const vid = card.dataset.video;
    // hover in: inject iframe muted autoplay, small preview
    card.addEventListener('pointerenter', () => {
      // do not create preview if running on low-power or data-saver (basic heuristic)
      if (navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType))) return;
      if (preview) return;
      const src = toEmbedSrc(vid, { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1 });
      preview = document.createElement('iframe');
      preview.setAttribute('src', src);
      preview.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      preview.setAttribute('aria-hidden', 'true');
      preview.style.position = 'absolute';
      preview.style.inset = 0;
      preview.style.width = '100%';
      preview.style.height = '100%';
      preview.style.border = '0';
      img.style.opacity = '0';
      thumb.appendChild(preview);
    });

    // pointerleave: remove preview
    card.addEventListener('pointerleave', () => {
      if (preview) {
        preview.remove();
        preview = null;
      }
      img.style.opacity = '1';
    });

    // focus/blur should mirror pointer events for keyboard users
    card.addEventListener('focus', () => card.dispatchEvent(new Event('pointerenter')));
    card.addEventListener('blur', () => card.dispatchEvent(new Event('pointerleave')));

    // click => open modal (unmuted by default but keep sound toggle)
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModalWithVideo(vid);
    });

    // keyboard enter / space opens modal
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModalWithVideo(vid);
      }
      // left/right arrow navigates track
      if (e.key === 'ArrowRight') { track.scrollBy({ left: card.offsetWidth + 16, behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { track.scrollBy({ left: -(card.offsetWidth + 16), behavior: 'smooth' }); }
    });
  });

  /* ---------- Scroll controls (prev/next) ---------- */
  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -Math.round(track.clientWidth * 0.7), behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: Math.round(track.clientWidth * 0.7), behavior: 'smooth' });
  });

  /* allow dragging to scroll (nice mobile/desktop experience) */
  (function enableDragScroll(el) {
    let isDown = false, startX, scrollLeft;
    el.addEventListener('pointerdown', (e) => {
      isDown = true; el.setPointerCapture(e.pointerId);
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add('dragging');
    });
    el.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; // multiplier
      el.scrollLeft = scrollLeft - walk;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(ev => {
      el.addEventListener(ev, () => { isDown = false; el.classList.remove('dragging'); });
    });
  })(track);

  /* ---------- Modal open/close & sound toggle ---------- */
  function openModalWithVideo(vid) {
    const src = toEmbedSrc(vid, { autoplay: 1, mute: 0, controls: 1, rel: 0, modestbranding: 1 });
    modalFrame.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.setAttribute('aria-hidden', 'false');
    // default sound: on (but button shows state); set pressed true
    soundBtn.setAttribute('aria-pressed', 'true');
    soundBtn.textContent = '🔊';
    document.documentElement.style.overflow = 'hidden';
    // focus close
    modalClose.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalFrame.innerHTML = '';
    document.documentElement.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // ESC closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // sound toggle inside modal: we rebuild iframe src to include mute param
  soundBtn.addEventListener('click', () => {
    const pressed = soundBtn.getAttribute('aria-pressed') === 'true';
    // toggle
    const iframe = modalFrame.querySelector('iframe');
    if (!iframe) return;
    // parse existing src to toggle mute param
    try {
      const srcUrl = new URL(iframe.src);
      const params = srcUrl.searchParams;
      // if currently muted? check mute param
      const isMuted = params.get('mute') === '1' || params.get('mute') === 'true';
      params.set('mute', isMuted ? '0' : '1');
      srcUrl.search = params.toString();
      iframe.src = srcUrl.toString(); // reload with new mute
      // update button UI
      soundBtn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
      soundBtn.textContent = isMuted ? '🔊' : '🔈';
    } catch (err) {
      // fallback: simply toggle text
      soundBtn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      soundBtn.textContent = pressed ? '🔈' : '🔊';
    }
  });

  /* Pause all previews when window/tab hidden to save CPU */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // remove any hover preview if present
      document.querySelectorAll('.short-thumb iframe').forEach(i => i.remove());
      document.querySelectorAll('.short-thumb img').forEach(img => img.style.opacity = '1');
    }
  });

});

// Why Choose Us: reveal animation + mini counters
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const why = document.getElementById('why');
    if (!why) return;

    // reveal cards when section enters viewport
    const revealNodes = Array.from(why.querySelectorAll('[data-reveal]'));
    if ('IntersectionObserver' in window && revealNodes.length) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.18 });
      revealNodes.forEach(n => {
        // set initial style for transition (if not present)
        n.style.opacity = 0;
        n.style.transform = 'translateY(10px)';
        n.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.2,.9,.2,1)';
        io.observe(n);
      });
    } else {
      // fallback: show immediately
      revealNodes.forEach(n => n.classList.add('revealed'));
    }

    // mini counters (only those inside this section)
    const miniVals = Array.from(why.querySelectorAll('.mini-value'));
    function animateMini(el, duration = 900) {
      const target = Number(el.getAttribute('data-target')) || 0;
      let start = 0;
      const startTime = performance.now();
      const tick = (t) => {
        const progress = Math.min((t - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * ease).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
    }

    if (miniVals.length) {
      if ('IntersectionObserver' in window) {
        const io2 = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            miniVals.forEach(v => animateMini(v, 1200));
            obs.disconnect();
          });
        }, { threshold: 0.35 });
        io2.observe(why);
      } else {
        miniVals.forEach(v => animateMini(v, 1200));
      }
    }

    // micro-interaction: bounce icon on hover
    why.querySelectorAll('.why-card').forEach(card => {
      const ico = card.querySelector('.why-ico');
      if (!ico) return;
      card.addEventListener('mouseenter', () => {
        ico.animate([
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-6px) scale(1.06)' },
          { transform: 'translateY(0) scale(1)' }
        ], { duration: 420, easing: 'cubic-bezier(.2,.9,.2,1)' });
      });
    });
  });
})();

/* ===== Free consultation form behavior (simple math captcha) ===== */
(function freeConsult() {
  const form = document.getElementById('free-consult-form');
  if (!form) return;

  const captchaEl = document.getElementById('fc-captcha');
  const captchaInput = document.getElementById('fc-captcha-input');
  const feedback = document.getElementById('fc-feedback');
  const resetBtn = document.getElementById('fc-reset');
  const submitBtn = form.querySelector('.fc-submit');

  // create a simple math captcha (two numbers)
  function genCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1; // 1..9
    const b = Math.floor(Math.random() * 9) + 1;
    // occasionally use multiplication for slightly harder one
    const useMul = Math.random() < 0.18;
    const op = useMul ? '×' : '+';
    const question = `${a} ${op} ${b} = ?`;
    const answer = useMul ? (a * b) : (a + b);
    return { question, answer };
  }

  let current = genCaptcha();
  function renderCaptcha() {
    if (!captchaEl) return;
    captchaEl.textContent = current.question;
    // reset input
    if (captchaInput) { captchaInput.value = ''; captchaInput.placeholder = 'result'; }
  }
  renderCaptcha();

  // simple validators
  function markInvalid(el, msg) {
    const field = el.closest('.fc-field') || el.closest('label') || el;
    if (field) field.classList.add('invalid');
    const err = field && field.querySelector('.fc-err');
    if (err) err.textContent = msg;
  }
  function clearInvalids() {
    form.querySelectorAll('.fc-field').forEach(f => {
      f.classList.remove('invalid');
      const e = f.querySelector('.fc-err'); if (e) e.textContent = '';
    });
    feedback.textContent = '';
  }

  // reset behavior
  resetBtn && resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    form.reset();
    clearInvalids();
    current = genCaptcha(); renderCaptcha();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInvalids();

    const name = form.elements['name'];
    const phone = form.elements['phone'];
    const captchaValue = form.elements['captcha'];

    let ok = true;
    if (!name || !name.value || name.value.trim().length < 2) {
      markInvalid(name, 'Please enter a valid name.');
      ok = false;
    }
    if (!phone || !phone.value || phone.value.trim().length < 6) {
      markInvalid(phone, 'Please enter a valid phone.');
      ok = false;
    }

    const entered = Number((captchaValue && captchaValue.value) || '');
    if (!captchaValue || Number.isNaN(entered) || entered !== current.answer) {
      markInvalid(captchaInput, 'Captcha incorrect.');
      ok = false;
      // regenerate a new one on failure to avoid brute force
      current = genCaptcha(); renderCaptcha();
    }

    if (!ok) return;

    // simulate send
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = 0.8; }
    feedback.textContent = 'Requesting a call…';

    const payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      createdAt: new Date().toISOString()
    };

    // Mock network send — replace with fetch() to your backend endpoint
    setTimeout(() => {
      feedback.textContent = `Thanks ${payload.name.split(' ')[0] || ''}! We will call you soon at ${payload.phone}.`;
      try { localStorage.setItem('freeConsultLast', JSON.stringify(payload)); } catch (e) {}
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
      form.reset();
      current = genCaptcha(); renderCaptcha();
    }, 900);
  });

  // accessibility: pressing Enter in captcha input submits form
  captchaInput && captchaInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') form.requestSubmit && form.requestSubmit();
  });
})();
/* ===== FAQ accordion behavior (search, keyboard, deep-link) ===== */
(function faqModule() {
  const list = document.getElementById('faq-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.faq-item'));
  const search = document.getElementById('faq-search');

  // Config: allowOnlyOneOpen -> true will close others when one opens
  const allowOnlyOneOpen = true;

  // Helper: open/close item
  function openItem(item, focus = false, updateHash = true) {
    if (!item) return;
    // close others if configured
    if (allowOnlyOneOpen) {
      items.forEach(it => {
        if (it !== item) closeItem(it, false);
      });
    }

    item.classList.add('open');
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.removeAttribute('hidden');
    if (focus && btn) btn.focus();

    // deep-link update
    if (updateHash && item.id) {
      try { history.replaceState(null, '', '#' + item.id); } catch(e) {}
    }
  }
  function closeItem(item, updateHash = false) {
    if (!item) return;
    item.classList.remove('open');
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('hidden', '');
    // remove hash only if present and updateHash true
    if (updateHash && location.hash === ('#' + item.id)) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch(e) {}
    }
  }

  // toggle handler
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');

    // ensure accessibility attributes exist
    if (btn && panel) {
      btn.setAttribute('aria-controls', panel.id || '');
    }

    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const isOpen = item.classList.contains('open');
      if (isOpen) closeItem(item, true); else openItem(item, true, true);
    });

    // keyboard navigation for question button:
    btn.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          btn.click();
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusNext(item);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPrev(item);
          break;
        case 'Home':
          e.preventDefault();
          focusFirst();
          break;
        case 'End':
          e.preventDefault();
          focusLast();
          break;
      }
    });
  });

  // focus helpers
  function focusNext(current) {
    const idx = items.indexOf(current);
    if (idx >= 0 && idx < items.length - 1) items[idx + 1].querySelector('.faq-q').focus();
  }
  function focusPrev(current) {
    const idx = items.indexOf(current);
    if (idx > 0) items[idx - 1].querySelector('.faq-q').focus();
  }
  function focusFirst() { if (items.length) items[0].querySelector('.faq-q').focus(); }
  function focusLast() { if (items.length) items[items.length - 1].querySelector('.faq-q').focus(); }

  // search/filter FAQs live
  if (search) {
    search.addEventListener('input', (e) => {
      const q = (e.target.value || '').trim().toLowerCase();
      items.forEach(it => {
        const text = (it.textContent || '').toLowerCase();
        const matched = q === '' || text.indexOf(q) !== -1;
        it.style.display = matched ? '' : 'none';
      });
    });
  }

  // open if a hash matches an item on load
  function tryOpenFromHash() {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    if (!id) return;
    const item = document.getElementById(id);
    if (item && item.classList.contains('faq-item')) {
      openItem(item, true, false);
      // scroll into view with smooth behavior
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // initialize: ensure all panels are hidden, aria-expanded false
  items.forEach(it => {
    const btn = it.querySelector('.faq-q');
    const panel = it.querySelector('.faq-a');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('hidden', '');
  });

  // try open from hash after a small delay (allow layout)
  requestAnimationFrame(() => setTimeout(tryOpenFromHash, 80));
})();
/* FOOTER: year, newsletter mock, logos auto-scroll, back-to-top */
(function footerModule(){
  // year
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  // newsletter form behavior (simple client-side validation & mock submit)
  const nf = document.getElementById('footer-newsletter');
  if (nf) {
    const name = nf.querySelector('#fn-name');
    const phone = nf.querySelector('#fn-phone');
    const feedback = document.getElementById('fn-feedback');

    nf.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.textContent = '';
      if (!name.value.trim() || name.value.trim().length < 2) {
        feedback.textContent = 'Please enter your name.';
        name.focus();
        return;
      }
      if (!phone.value.trim() || phone.value.trim().length < 6) {
        feedback.textContent = 'Please enter a valid phone number.';
        phone.focus();
        return;
      }

      // simulate network
      const btn = nf.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        feedback.textContent = `Thanks ${name.value.split(' ')[0] || ''}! We'll call you soon.`;
        btn.disabled = false;
        btn.textContent = 'Request callback';
        nf.reset();
      }, 900);
    });
  }

  // partner logos auto-scroll (gentle)
  (function logosAutoScroll(){
    const track = document.querySelector('.fl-track');
    if (!track) return;
    // duplicate children to allow seamless scroll if short
    const children = Array.from(track.children);
    if (children.length && track.scrollWidth < window.innerWidth * 2) {
      children.forEach(n => track.appendChild(n.cloneNode(true)));
    }
    let pos = 0;
    let raf = null;
    let speed = 0.35;
    function loop() {
      pos -= speed;
      const resetW = track.scrollWidth / 2 || track.scrollWidth;
      if (Math.abs(pos) >= resetW) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    // pause on hover
    track.addEventListener('mouseenter', () => speed = 0.06);
    track.addEventListener('mouseleave', () => speed = 0.35);
    window.addEventListener('pagehide', () => { if (raf) cancelAnimationFrame(raf); });
  })();

  // back-to-top visibility & behavior
  (function backToTop(){
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    const showAt = 220;
    function check() {
      if (window.scrollY > showAt) btn.classList.add('visible'); else btn.classList.remove('visible');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

})();
