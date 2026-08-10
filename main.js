/* =========================================================
   GOCYBEX — shared interactivity layer (all pages)
   Handles: mobile nav, search toggle, scroll-reveal,
   active nav highlighting, sticky-header shadow, resize safety.
   ========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Mobile nav toggle ---------- */
    var toggle = document.querySelector('.mobile-toggle');
    var nav = document.querySelector('nav');
    var body = document.body;

    function openNav() {
      nav.classList.add('nav-open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.add('nav-locked');
    }
    function closeNav() {
      nav.classList.remove('nav-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-locked');
    }
    function toggleNav() {
      if (nav.classList.contains('nav-open')) closeNav(); else openNav();
    }

    if (toggle && nav) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNav();
      });

      // Close menu when a nav link is tapped (mobile UX expectation)
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('nav-open') && !nav.contains(e.target) && e.target !== toggle) {
          closeNav();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });

      // If the viewport is resized past the mobile breakpoint, reset state
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1000) closeNav();
      });
    }

    /* ---------- Search toggle ---------- */
    var searchWrap = document.querySelector('.search-wrap');
    var searchBtn = document.querySelector('.search-btn');
    var searchForm = document.querySelector('.search-form');

    if (searchWrap && searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = searchWrap.classList.toggle('open');
        if (isOpen) {
          var input = searchWrap.querySelector('input');
          if (input) input.focus();
        }
      });

      document.addEventListener('click', function (e) {
        if (searchWrap.classList.contains('open') && !searchWrap.contains(e.target)) {
          searchWrap.classList.remove('open');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') searchWrap.classList.remove('open');
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = searchForm.querySelector('input');
        var q = input ? input.value.trim() : '';
        if (q) {
          window.open('https://www.google.com/search?q=site:gocybex.com+' + encodeURIComponent(q), '_blank');
        }
      });
    }

    /* ---------- Scroll-reveal ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // No IntersectionObserver support (very old browsers) — just show content
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* ---------- Active nav link highlighting ---------- */
    var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
    if (currentPage === '') currentPage = 'index.html';
    document.querySelectorAll('nav ul li a').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop();
      if (href === currentPage) link.classList.add('current');
    });

    /* ---------- Sticky header shadow on scroll ---------- */
    var header = document.querySelector('header');
    if (header) {
      var lastState = false;
      window.addEventListener('scroll', function () {
        var shouldShow = window.scrollY > 8;
        if (shouldShow !== lastState) {
          header.classList.toggle('is-scrolled', shouldShow);
          lastState = shouldShow;
        }
      }, { passive: true });
    }

  });
})();
