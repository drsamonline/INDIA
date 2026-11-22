/* INDIA · landing page interactions — no dependencies
   Author: Dr Sohil Momin · CC BY-NC 4.0 */
(function () {
  'use strict';

  /* region filter */
  var filters = document.querySelectorAll('.filters button');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('on', b === btn); });
      cards.forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-region') === f;
        card.hidden = !show;
        if (show) {
          card.classList.remove('rv');
        }
      });
      var visible = cards.filter(function (c) { return !c.hidden; }).length;
      if (f !== 'all' && visible === 0) {
        cards.forEach(function (c) { c.hidden = false; });
      }
    });
  });

  /* reveal on scroll */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* keyboard: jump to gallery with "g" */
  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
      var g = document.getElementById('monuments');
      if (g) g.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
