(function () {
  // mobile drawer
  var burger = document.querySelector('.burger'), nav = document.getElementById('mnav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); burger.focus(); } });
  }

  // time-of-day greeting
  var g = document.querySelector('[data-greet]');
  if (g) {
    var h = new Date().getHours();
    g.textContent = h >= 5 && h < 12 ? 'good morning.' : h >= 12 && h < 17 ? 'good afternoon.' : 'good evening.';
  }

  // notify form (preview only, nothing is sent)
  document.querySelectorAll('form.notify').forEach(function (f) {
    var err = f.querySelector('.ferr'), thanks = f.parentNode.querySelector('.thanks'), inp = f.querySelector('input');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!inp.value || !inp.checkValidity()) { err.hidden = false; inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
      f.hidden = true; thanks.hidden = false; thanks.setAttribute('tabindex', '-1'); thanks.focus();
    });
    inp.addEventListener('input', function () { err.hidden = true; inp.removeAttribute('aria-invalid'); });
  });

  // menu chips: jump + scroll spy
  var bar = document.querySelector('.js-jump');
  if (!bar) return;
  var chips = [].slice.call(bar.querySelectorAll('.chip'));
  var secs = chips.map(function (c) { return document.getElementById(c.getAttribute('href').slice(1)); });
  var lock = 0;
  function mark(i) {
    chips.forEach(function (c, k) { c.classList.toggle('on', k === i); if (k === i) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
    var c = chips[i], t = bar.querySelector('.track');
    if (c) t.scrollTo({ left: c.offsetLeft - (t.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  }
  function spy() {
    if (Date.now() < lock) return;
    var line = bar.getBoundingClientRect().bottom + 40, cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) cur = i; });
    mark(cur);
  }
  chips.forEach(function (c, i) {
    c.addEventListener('click', function (e) {
      e.preventDefault();
      lock = Date.now() + 1200;
      mark(i);
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      secs[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + secs[i].id);
    });
  });
  var raf = 0;
  window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; spy(); }); }, { passive: true });
  spy();
})();
