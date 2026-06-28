/* =============================================================
   Lakes Linked — Feature Components JavaScript
   ll-features.js  |  v1.0  |  2026-06-28

   Add ONE <script> tag before </body> on every page:
     <script src="ll-features.js"></script>
   ============================================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     FEATURE 1 · SHARE THIS INSIGHT
     ────────────────────────────────────────────────────────── */

  /**
   * buildShareText(countyName, metric, value, unit, url)
   * Returns a ready-to-post social snippet.
   *
   * EDIT: Customize the template strings for your counties.
   */
  function buildShareText(countyName, metric, value, unit, pageUrl) {
    // UTM-tagged URL for tracking
    var utmUrl = pageUrl + '?utm_source=linkedin&utm_medium=social&utm_campaign=county_insight';

    return (
      'In ' + countyName + ', ' + metric + ' is estimated to contribute approximately ' +
      value + ' ' + unit + ' of disease burden annually — ' +
      'a planning-grade estimate based on CDC PLACES, CDC WONDER, and IHME GBD 2021 disability weights. ' +
      'Lakes Linked translates public health data into county burden dashboards for CHNA, grant writing, and rural health planning. ' +
      'Explore the dashboard: ' + utmUrl
    );
  }

  /**
   * showToast(message, duration)
   * Displays a brief non-blocking notification.
   */
  function showToast(message, duration) {
    duration = duration || 2800;
    var toast = document.getElementById('ll-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'll-toast';
      toast.className = 'll-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('ll-toast--visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('ll-toast--visible');
    }, duration);
  }

  /**
   * initShareButtons()
   * Wires up all .ll-share-btn elements on the page.
   * Data attributes on the button or its parent .ll-share-card:
   *   data-county    — county name, e.g. "Isabella County"
   *   data-metric    — metric name, e.g. "cancer"
   *   data-value     — numeric value, e.g. "3,996"
   *   data-unit      — unit string, e.g. "DALYs/yr"
   *   data-url       — canonical page URL (defaults to window.location.href)
   */
  function initShareButtons() {
    document.querySelectorAll('.ll-share-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        // Read data from button or nearest parent with data-county
        var ctx    = btn.closest('[data-county]') || btn;
        var county = ctx.dataset.county || document.title || 'this county';
        var metric = ctx.dataset.metric || 'disease burden';
        var value  = ctx.dataset.value  || '';
        var unit   = ctx.dataset.unit   || 'DALYs/yr';
        var pageUrl= ctx.dataset.url    || window.location.href.split('?')[0];

        var text  = buildShareText(county, metric, value, unit, pageUrl);
        var utmUrl= pageUrl + '?utm_source=social&utm_medium=share&utm_campaign=county_insight';

        /* ── LinkedIn ── */
        if (btn.classList.contains('ll-share-btn--linkedin')) {
          // LinkedIn URL sharer (opens dialog)
          var liUrl = 'https://www.linkedin.com/feed/?shareActive=true&text=' +
                      encodeURIComponent(text);
          window.open(liUrl, '_blank', 'noopener,width=700,height=560');
        }

        /* ── X / Twitter ── */
        else if (btn.classList.contains('ll-share-btn--x')) {
          var tweetUrl = 'https://x.com/intent/tweet?text=' +
                         encodeURIComponent(text.slice(0, 280));
          window.open(tweetUrl, '_blank', 'noopener,width=600,height=400');
        }

        /* ── Facebook ── */
        else if (btn.classList.contains('ll-share-btn--facebook')) {
          var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' +
                      encodeURIComponent(utmUrl) +
                      '&quote=' + encodeURIComponent(text.slice(0, 200));
          window.open(fbUrl, '_blank', 'noopener,width=600,height=400');
        }

        /* ── Copy to clipboard ── */
        else if (btn.classList.contains('ll-share-btn--copy')) {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
              btn.classList.add('ll-copied');
              btn.textContent = '✓ Copied!';
              showToast('Insight copied — ready to paste on LinkedIn, email, or your report.');
              setTimeout(function () {
                btn.classList.remove('ll-copied');
                btn.innerHTML = '<span class="ll-share-icon">📋</span> Copy insight';
              }, 2600);
            });
          } else {
            // Fallback for older browsers
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity  = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Copied to clipboard.');
          }
        }
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     FEATURE 2 · REQUEST YOUR COUNTY FORM (Formspree / mailto)
     ────────────────────────────────────────────────────────── */

  /**
   * initRequestForms()
   * Handles all forms with class .ll-request-form.
   *
   * EDIT: Set your Formspree endpoint on the <form> element:
   *   action="https://formspree.io/f/YOUR_FORM_ID"
   * Or leave action blank for mailto fallback.
   */
  function initRequestForms() {
    document.querySelectorAll('.ll-request-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var endpoint = form.getAttribute('action') || '';

        // ── Formspree (AJAX) path ──
        if (endpoint && endpoint.includes('formspree')) {
          e.preventDefault();
          var btn     = form.querySelector('.ll-btn-submit');
          var success = form.querySelector('.ll-form-success');
          if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

          fetch(endpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              if (success) success.classList.add('ll-visible');
              showToast('Request sent — we\'ll be in touch within 2–3 business days.');
            } else {
              if (btn) { btn.disabled = false; btn.textContent = 'Send request'; }
              showToast('Something went wrong. Please try emailing directly.');
            }
          })
          .catch(function () {
            if (btn) { btn.disabled = false; btn.textContent = 'Send request'; }
            showToast('Network error. Please email lakeslinked@gmail.com directly.');
          });

        }
        // ── mailto fallback (no endpoint set) ──
        else if (!endpoint) {
          e.preventDefault();
          var data    = new FormData(form);
          var name    = data.get('name')    || '';
          var org     = data.get('org')     || '';
          var email   = data.get('email')   || '';
          var county  = data.get('county')  || '';
          var usecase = data.get('usecase') || '';
          var message = data.get('message') || '';

          var body =
            'Name: ' + name + '\n' +
            'Organization: ' + org + '\n' +
            'Email: ' + email + '\n' +
            'County/State: ' + county + '\n' +
            'Use case: ' + usecase + '\n\n' +
            'Message:\n' + message;

          window.location.href =
            'mailto:lakeslinked@gmail.com' +                       // EDIT: your email
            '?subject=' + encodeURIComponent('County burden snapshot request — ' + county) +
            '&body='    + encodeURIComponent(body);
        }
        // If action is set and NOT Formspree — let native form submit happen
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     FEATURE 3 · DOWNLOAD COUNTY BRIEF (PDF placeholder)
     ────────────────────────────────────────────────────────── */

  /**
   * initBriefButtons()
   * .ll-btn-brief — triggers download if href set, otherwise shows
   * a polite "coming soon" message.
   *
   * EDIT: Set href="/briefs/isabella-brief.pdf" when PDFs are ready.
   */
  function initBriefButtons() {
    document.querySelectorAll('.ll-btn-brief').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var href = btn.getAttribute('href') || btn.dataset.href || '';
        if (!href || href === '#') {
          e.preventDefault();
          showToast('PDF brief for this county is being prepared — check back soon, or request via the form below.');
        }
        // If href is set, let browser handle the download normally
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     FEATURE 4 · SPONSOR — mailto triggers
     ────────────────────────────────────────────────────────── */

  /**
   * initSponsorButtons()
   * .ll-btn-sponsor[data-tier] — opens a pre-filled email.
   *
   * EDIT: Replace the email address and add Stripe/PayPal links
   * when payment is set up.
   */
  function initSponsorButtons() {
    document.querySelectorAll('[data-sponsor-tier]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var tier    = btn.dataset.sponsorTier || 'Open Data Partner';
        var amount  = btn.dataset.sponsorAmount || '';
        var subject = encodeURIComponent(
          'Sponsorship inquiry — Open County Dashboard' +
          (tier ? ' (' + tier + (amount ? ' · ' + amount : '') + ')' : '')
        );
        var body = encodeURIComponent(
          'Hello,\n\nI am interested in sponsoring an open county dashboard under the ' +
          tier + ' tier' + (amount ? ' (' + amount + ')' : '') + '.\n\n' +
          'Organization: \nCounty of interest: \nAdditional context: \n\n' +
          'Please send an invoice or next steps.\n\nThank you.'
        );
        window.location.href =
          'mailto:lakeslinked@gmail.com?subject=' + subject + '&body=' + body; // EDIT: your email
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     COOKIE CONSENT BANNER  (Priority 4 — trust & legal)
     ────────────────────────────────────────────────────────── */

  /**
   * initCookieBanner()
   * Shows a lightweight GDPR-friendly consent bar.
   * Stores preference in localStorage.
   * No third-party script. Fully self-contained.
   *
   * EDIT: If you add Google Analytics or Facebook Pixel,
   * load them only inside the ll_consent_accepted branch below.
   */
  function initCookieBanner() {
    var STORAGE_KEY = 'll_consent_v1';
    if (localStorage.getItem(STORAGE_KEY)) return; // already decided

    var banner = document.createElement('div');
    banner.id  = 'll-cookie-banner';
    banner.className = 'll-cookie-banner';
    banner.innerHTML =
      '<div class="ll-cookie-inner">' +
        '<p class="ll-cookie-text">' +
          '🍪 This site uses essential cookies and, if accepted, anonymous usage analytics ' +
          'to improve county dashboards. No ads. No tracking across other sites. ' +
          '<a href="/privacy.html" class="ll-cookie-link">Privacy policy</a>' +  // EDIT: your privacy page
        '</p>' +
        '<div class="ll-cookie-actions">' +
          '<button id="ll-cookie-accept" class="ll-cookie-btn ll-cookie-btn--accept">Accept analytics</button>' +
          '<button id="ll-cookie-decline" class="ll-cookie-btn ll-cookie-btn--decline">Essential only</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    // Inject inline styles (so banner works without ll-features.css loaded)
    var style = document.createElement('style');
    style.textContent = [
      '.ll-cookie-banner{position:fixed;bottom:0;left:0;right:0;background:#1e293b;color:#f8fafc;',
      'z-index:9000;padding:14px 20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.ll-cookie-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;',
      'gap:16px;flex-wrap:wrap;}',
      '.ll-cookie-text{font-size:.82rem;line-height:1.5;margin:0;flex:1;min-width:220px;}',
      '.ll-cookie-link{color:#93c5fd;text-underline-offset:2px;}',
      '.ll-cookie-actions{display:flex;gap:8px;flex-shrink:0;}',
      '.ll-cookie-btn{padding:8px 16px;border-radius:5px;font-size:.8rem;font-weight:600;',
      'cursor:pointer;border:none;font-family:inherit;}',
      '.ll-cookie-btn--accept{background:#2563a8;color:#fff;}',
      '.ll-cookie-btn--decline{background:transparent;color:#94a3b8;border:1px solid #475569;}'
    ].join('');
    document.head.appendChild(style);

    function dismiss(accepted) {
      localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
      banner.style.transition = 'opacity .3s';
      banner.style.opacity = '0';
      setTimeout(function () { banner.remove(); }, 320);

      // ── EDIT: Load analytics only when accepted ──────────────
      if (accepted) {
        // Example: load GA4
        // var s = document.createElement('script');
        // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // EDIT: your GA4 ID
        // s.async = true;
        // document.head.appendChild(s);
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'G-XXXXXXXXXX');
      }
    }

    document.getElementById('ll-cookie-accept' ).addEventListener('click', function(){ dismiss(true);  });
    document.getElementById('ll-cookie-decline').addEventListener('click', function(){ dismiss(false); });
  }


  /* ──────────────────────────────────────────────────────────
     ACTIVE NAV HIGHLIGHT
     ────────────────────────────────────────────────────────── */

  function initActiveNav() {
    var path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, .ll-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('?')[0].split('/').pop();
      if (href && href === path) a.classList.add('ll-nav-active');
    });
  }


  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
     ────────────────────────────────────────────────────────── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     BOOTSTRAP — run all inits when DOM is ready
     ────────────────────────────────────────────────────────── */

  function init() {
    initShareButtons();
    initRequestForms();
    initBriefButtons();
    initSponsorButtons();
    initCookieBanner();
    initActiveNav();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
