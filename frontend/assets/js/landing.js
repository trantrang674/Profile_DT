/**
 * LANDING ANIMATIONS:
 * - Choreographed scroll-reveal cho mọi section & card (hỗ trợ hướng up/left/right/scale và card nạp động từ Markdown)
 * - Count-up chỉ số KPI
 * - Thanh tiến độ cuộn (Scroll Progress)
 * - Header Glassmorphism tự động co giãn & Back-to-top
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. Reveal on Scroll (IntersectionObserver) ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          if (en.target.hasAttribute('data-count-wrap')) {
            runCounters(en.target);
          }
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  function watch(el) {
    if (!el || el.dataset.watched) return;
    el.dataset.watched = '1';
    io.observe(el);
  }

  $$('[data-reveal]').forEach(watch);

  /* Tự động gắn hiệu ứng xuất hiện cho các Card Dự Án nạp động từ Markdown */
  ['featured-projects-container', 'all-projects-container'].forEach((id) => {
    const box = document.getElementById(id);
    if (!box) return;
    const tag = (node) => {
      if (node.nodeType !== 1) return;
      if (!node.hasAttribute('data-reveal')) {
        node.setAttribute('data-reveal', 'up');
      }
      const idx = Array.from(box.children).indexOf(node);
      node.style.setProperty('--d', (idx % 3) * 0.1 + 's');
      requestAnimationFrame(() => watch(node));
    };
    $$(':scope > *', box).forEach(tag);
    new MutationObserver((muts) =>
      muts.forEach((m) => m.addedNodes.forEach(tag))
    ).observe(box, { childList: true });
  });

  /* ---------- 2. Count-up KPI Numbers ---------- */
  function runCounters(scope) {
    $$('.count', scope).forEach((el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const suf = el.dataset.suffix || '';
      if (reduce || isNaN(to)) {
        el.textContent = to.toFixed(dec) + suf;
        return;
      }
      const dur = 1500;
      const t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
  $$('[data-count-wrap]').forEach(watch);

  /* ---------- 3. Scroll Handler (Progress Bar + Header + Back to Top) ---------- */
  const bar = $('.lp-progress');
  const header = $('.lp-header');
  const topBtn = $('.lp-top');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (header) header.classList.toggle('scrolled', y > 36);
    if (topBtn) topBtn.classList.toggle('show', y > 600);
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', onScroll);
  onScroll();

  if (topBtn) {
    topBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
})();
