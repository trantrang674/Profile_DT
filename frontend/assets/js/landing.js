/**
 * LANDING ANIMATIONS: reveal khi cuộn, progress bar, fill text, count-up,
 * parallax, slider, FAQ accordion, header shrink, back-to-top.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Reveal on scroll (hỗ trợ cả card nạp động từ Markdown) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        if (en.target.hasAttribute('data-count-wrap')) runCounters(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  function watch(el) { if (!el.dataset.watched) { el.dataset.watched = '1'; io.observe(el); } }
  $$('[data-reveal]').forEach(watch);

  ['featured-projects-container', 'all-projects-container'].forEach((id) => {
    const box = document.getElementById(id);
    if (!box) return;
    const tag = (node) => {
      if (node.nodeType !== 1) return;
      node.setAttribute('data-reveal', '');
      node.style.setProperty('--d', (Array.from(box.children).indexOf(node) % 3) * 0.12 + 's');
      requestAnimationFrame(() => watch(node));
    };
    $$(':scope > *', box).forEach(tag);
    new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach(tag))).observe(box, { childList: true });
  });

  /* ---------- Count-up ---------- */
  function runCounters(scope) {
    $$('.count', scope).forEach((el) => {
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const suf = el.dataset.suffix || '';
      if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
      const dur = 1600, t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
  $$('[data-count-wrap]').forEach(watch);

  /* ---------- Fill text theo tiến độ cuộn ---------- */
  const fill = $('.lp-fill');
  let words = [];
  if (fill) {
    fill.innerHTML = fill.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    words = $$('.w', fill);
  }

  /* ---------- Scroll handler (rAF) ---------- */
  const bar = $('.lp-progress'), header = $('.lp-header'), topBtn = $('.lp-top');
  const parallax = $$('[data-parallax]');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (topBtn) topBtn.classList.toggle('show', y > 700);
    if (words.length) {
      const r = fill.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3), 0), 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
    if (!reduce) parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-c * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
    });
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  if (topBtn) topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Slider kỹ năng ---------- */
  const track = $('.lp-track');
  if (track) {
    const slides = $$('.lp-slide', track), cnt = $('#slider-count');
    const step = () => slides[0].getBoundingClientRect().width;
    const update = () => {
      const i = Math.min(slides.length, Math.round(track.scrollLeft / step()) + 1);
      if (cnt) cnt.textContent = `${i} / ${slides.length}`;
    };
    $('#slide-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#slide-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- FAQ accordion ---------- */
  $$('.lp-faq-item').forEach((item) => {
    $('.lp-faq-q', item).addEventListener('click', () => {
      const open = item.classList.contains('open');
      $$('.lp-faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
})();
