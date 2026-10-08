/* ==========================================================================
   El Baroudy In English — Support Page
   Small progressive enhancements. The page works fully without JavaScript.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL_PLACEHOLDER = 'SUPPORT_EMAIL_HERE';

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Placeholder safety checks ----------
     - Legal links that still point to a placeholder are hidden, so the live
       site never shows a broken link.
     - A setup banner appears while any placeholder remains, so you can't miss it.
     Once you replace every placeholder (see README), none of this is shown. */
  var missing = [];

  if (document.querySelector('a[href^="mailto:' + EMAIL_PLACEHOLDER + '"]')) {
    missing.push('<code>' + EMAIL_PLACEHOLDER + '</code> (support email)');
  }

  var legalLinks = document.querySelectorAll('a[data-legal]');
  Array.prototype.forEach.call(legalLinks, function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('_HERE') !== -1 || href === '' || href === '#') {
      var item = link.closest('li') || link;
      item.hidden = true;
      missing.push('<code>' + href + '</code> (' + link.getAttribute('data-legal') + ')');
    }
  });

  if (missing.length) {
    var banner = document.getElementById('setup-banner');
    var bannerText = document.getElementById('setup-banner-text');
    if (banner && bannerText) {
      bannerText.innerHTML = 'replace ' + missing.join(', ') + ' in index.html before publishing.';
      banner.hidden = false;
    }
    if (window.console && console.warn) {
      console.warn('[Support page] Placeholders still present. See README.md → "Values you must replace".');
    }
  }

  /* ---------- Copy email address ---------- */
  var copyBtn = document.getElementById('copy-email');
  var emailEl = document.getElementById('support-email');
  var statusEl = document.getElementById('copy-status');

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  function showStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(function () { statusEl.textContent = ''; }, 3000);
  }

  if (copyBtn && emailEl) {
    copyBtn.hidden = false; // only shown when JS is available
    copyBtn.addEventListener('click', function () {
      var address = emailEl.textContent.trim();
      var done = function () { showStatus('Email address copied to clipboard.'); };
      var fail = function () { showStatus('Couldn\u2019t copy automatically. Please copy: ' + address); };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(done, function () {
          fallbackCopy(address) ? done() : fail();
        });
      } else {
        fallbackCopy(address) ? done() : fail();
      }
    });
  }

  /* ---------- Subtle reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealEls, function (el) { observer.observe(el); });
  }
})();
