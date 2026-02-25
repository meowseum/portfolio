/* ============================================
   Portfolio — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Navbar: solid background on scroll ---
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (nav && hero) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    navObserver.observe(hero);
  }

  // --- Mobile nav toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-links--open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-links--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('nav-links--open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Scroll-triggered fade-in animations ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length > 0) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach(el => fadeObserver.observe(el));
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;

  if (lightbox && lightboxImg && lightboxClose) {
    let currentItems = [];
    let currentIndex = 0;

    function showImage(index) {
      const item = currentItems[index];
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = item.dataset.full || img.src;
      lightboxImg.alt = img.alt;
      currentIndex = index;
      const multiple = currentItems.length > 1;
      if (lightboxPrev) lightboxPrev.hidden = !multiple;
      if (lightboxNext) lightboxNext.hidden = !multiple;
    }

    function navigate(delta) {
      showImage((currentIndex + delta + currentItems.length) % currentItems.length);
    }

    // Open lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const gallery = item.closest('.project-gallery');
        currentItems = gallery
          ? Array.from(gallery.querySelectorAll('.gallery-item'))
          : [item];
        currentIndex = currentItems.indexOf(item);
        showImage(currentIndex);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }
})();
