/* ============================================================
   PORTFOLIO BUT INFORMATIQUE — JS global
   Gère : highlight du lien actif, menu mobile, fade-in
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Highlight du lien actif dans la navbar ── */
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar__links a');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ── 2. Menu hamburger mobile ── */
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const links  = document.querySelector('.navbar__links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Fermer le menu quand on clique un lien */
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 3. Micro-animation d'entrée sur .page-content ── */
  function initPageFadeIn() {
    const content = document.querySelector('.page-content');
    if (!content) return;

    /* La classe page-content déclenche l'animation via CSS.
       On s'assure juste qu'elle est visible si JS est désactivé. */
    content.style.opacity = ''; /* reset inline pour laisser CSS faire */
  }

  /* ── 4. Smooth scroll pour les ancres internes ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── 5. Scroll doux vers la section nav-grid sur la home ── */
  function initHomeScroll() {
    const scrollHint = document.querySelector('.hero__scroll');
    const navSection = document.querySelector('.nav-grid-section');
    if (!scrollHint || !navSection) return;

    scrollHint.style.cursor = 'pointer';
    scrollHint.addEventListener('click', function () {
      navSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── 6. Parallaxe sur le filigrane du hero ── */
  window.addEventListener('load', function () {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  window.addEventListener('scroll', function () {
    const watermark = document.querySelector('.hero-watermark');
    if (watermark) {
      watermark.style.transform = 'translateX(-50%) translateY(' + (window.scrollY * 0.3) + 'px)';
    }
  });

  /* ── 7. Modals SAÉ ── */
  function initSaeModals() {
    var overlay = document.getElementById('sae-modal-overlay');
    if (!overlay) return;

    var modal       = overlay.querySelector('.modal');
    var closeBtn    = overlay.querySelector('.modal__close');
    var titleEl     = overlay.querySelector('.modal__title');
    var semesterEl  = overlay.querySelector('.modal__semester');
    var descEl      = overlay.querySelector('.modal__desc');
    var detailEl    = overlay.querySelector('.modal__detail');
    var tracesEl    = overlay.querySelector('.modal__traces');

    function openModal(card) {
      titleEl.textContent    = card.dataset.title    || '';
      semesterEl.innerHTML   = card.dataset.semester
        ? '<span class="tag">' + card.dataset.semester + '</span>'
        : '';
      descEl.innerHTML       = card.dataset.desc     || '';
      detailEl.innerHTML     = card.dataset.detail   || '';

      /* Traces : JSON encodé en data-traces */
      tracesEl.innerHTML = '';
      var rawTraces = card.dataset.traces;
      if (rawTraces) {
        var traces = JSON.parse(rawTraces);
        traces.forEach(function (t) {
          var item = document.createElement('div');
          item.className = 'modal__trace-item' + (t.file ? ' modal__trace-item--link' : '');
          item.innerHTML =
            '<span class="modal__trace-icon" aria-hidden="true">' + (t.icon || '📎') + '</span>' +
            '<div class="modal__trace-body">' +
              '<p class="modal__trace-title">' + t.title + (t.file ? ' <span class="modal__trace-open">↗</span>' : '') + '</p>' +
              '<p class="modal__trace-desc">'  + t.desc  + '</p>' +
            '</div>';
          if (t.file) {
            item.addEventListener('click', (function (file) {
              return function () {
                if (file.toLowerCase().endsWith('.pdf')) {
                  window.open(file, '_blank');
                } else {
                  var ov = document.createElement('div');
                  ov.id = 'trace-overlay';
                  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out;';

                  var img = document.createElement('img');
                  img.src = file;
                  img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';

                  var btn = document.createElement('button');
                  btn.textContent = '✕';
                  btn.style.cssText = 'position:absolute;top:1.5rem;right:1.5rem;background:white;border:none;border-radius:50%;width:2rem;height:2rem;cursor:pointer;font-size:1rem;';

                  function closeOverlay() {
                    if (ov.parentNode) ov.parentNode.removeChild(ov);
                    document.removeEventListener('keydown', onKey);
                  }
                  function onKey(e) { if (e.key === 'Escape') closeOverlay(); }

                  ov.addEventListener('click', function (e) { if (e.target === ov) closeOverlay(); });
                  btn.addEventListener('click', function (e) { e.stopPropagation(); closeOverlay(); });
                  document.addEventListener('keydown', onKey);

                  ov.appendChild(img);
                  ov.appendChild(btn);
                  document.body.appendChild(ov);
                }
              };
            })(t.file));
          }
          tracesEl.appendChild(item);
        });
      }

      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    /* Ouvrir au clic sur une carte SAÉ */
    document.querySelectorAll('.sae-card[data-title]').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
      });
    });

    /* Fermeture */
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNavLink();
    initMobileMenu();
    initPageFadeIn();
    initSmoothScroll();
    initHomeScroll();
    initSaeModals();
  });
})();
