/**
 * LANDING ANIMATIONS & KINETIC STOREHOUSE CONTROLLER:
 * - Choreographed scroll-reveal cho mọi section & card (hỗ trợ hướng up/left/right/scale và card nạp động từ Markdown)
 * - Kinetic Morphing Storehouse Showcase cho 3 cụm: Năng Lực Chuyên Môn, Kỹ Năng Mềm & Phối Hợp, Bộ Công Cụ Chuyên Môn
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

  /* ---------- 3. Kinetic Morphing Storehouse Showcase (3 Cụm Thông Tin) ---------- */
  const ksStage = document.getElementById('ks-stage');
  if (ksStage) {
    const totalSlides = 3;
    let currentSlide = 0;

    const badges = $$('.ks-slide-badge', ksStage);
    const bigTitles = $$('.ks-big-title', ksStage);
    const models = $$('.ks-3d-model', ksStage);
    const panes = $$('.ks-slide-pane', ksStage);
    const clusterTabs = $$('.ks-cluster-tab', ksStage);
    const stepNodes = $$('.ks-step-node', ksStage);
    const dockIcons = $$('.ks-dock-ico', ksStage);
    const dockStatus = $('#ks-dock-status span', ksStage);
    const nextBtn = $('#ks-dock-next', ksStage);
    const viewToggleBtn = $('#ks-view-toggle', ksStage);

    function replayRowAnimations(pane) {
      if (!pane || reduce) return;
      const rows = $$('.ks-row:not(.is-hidden)', pane);
      rows.forEach((row, idx) => {
        row.style.setProperty('--i', idx);
        row.style.animation = 'none';
        const ico = $('.ks-row-3d-ico', row);
        if (ico) ico.style.animation = 'none';
      });
      // Force reflow để kích hoạt lại hiệu ứng trượt ngang & nảy icon 3D giống video
      void pane.offsetWidth;
      rows.forEach((row) => {
        row.style.animation = '';
        const ico = $('.ks-row-3d-ico', row);
        if (ico) ico.style.animation = '';
      });
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      ksStage.classList.remove('is-expanded-all');
      ksStage.setAttribute('data-active-slide', String(currentSlide));

      badges.forEach((el, i) => el.classList.toggle('is-active', i === currentSlide));
      bigTitles.forEach((el, i) => el.classList.toggle('is-active', i === currentSlide));
      models.forEach((el, i) => el.classList.toggle('is-active', i === currentSlide));

      panes.forEach((pane, i) => {
        const active = i === currentSlide;
        pane.classList.toggle('is-active', active);
        if (active) replayRowAnimations(pane);
      });

      clusterTabs.forEach((btn, i) => {
        const active = i === currentSlide;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      stepNodes.forEach((btn, i) => btn.classList.toggle('is-active', i === currentSlide));
      dockIcons.forEach((btn, i) => btn.classList.toggle('is-active', i === currentSlide));

      if (dockStatus) {
        dockStatus.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
      }
    }

    // Gắn sự kiện click cho các nút chọn Slide
    [...clusterTabs, ...stepNodes, ...dockIcons].forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target-slide') || '0', 10);
        goToSlide(target);
      });
    });

    // Nút mũi tên đen (→) ở thanh Dock giữa
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    }

    // Nút chuyển chế độ xem mở rộng cả 3 cụm (⊞)
    if (viewToggleBtn) {
      viewToggleBtn.addEventListener('click', () => {
        ksStage.classList.toggle('is-expanded-all');
      });
    }

    // Bộ lọc 4 nhóm công cụ trong Slide 3 (Bộ Công Cụ Chuyên Môn)
    const subtabs = $$('.ks-subtab', ksStage);
    const toolRows = $$('#ks-tools-rows .ks-row', ksStage);
    const slide2Pane = $('.ks-slide-pane[data-slide-pane="2"]', ksStage);

    subtabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const group = tab.getAttribute('data-tool-group') || 'all';
        subtabs.forEach((t) => t.classList.toggle('is-active', t === tab));

        let visibleIndex = 0;
        toolRows.forEach((row) => {
          const match = group === 'all' || row.getAttribute('data-group') === group;
          row.classList.toggle('is-hidden', !match);
          if (match) {
            row.style.setProperty('--i', visibleIndex++);
          }
        });

        replayRowAnimations(slide2Pane);
      });
    });
  }

  /* ---------- 4. Scroll Handler (Progress Bar + Header + Back to Top) ---------- */
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
