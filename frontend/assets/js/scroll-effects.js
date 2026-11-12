/**
 * ============================================================================
 * SCROLL EFFECTS CONTROLLER (assets/js/scroll-effects.js)
 * 1. Khối hiện dần khi cuộn tới (.reveal + --up, --left, --right, --scale, data-stagger)
 *    bằng IntersectionObserver thuần (threshold 0.15, chạy 1 lần rồi unobserve).
 * 2. Hero kể chuyện theo cuộn (#home pin + scrub 4 cảnh + 4 chấm chỉ báo)
 *    bằng GSAP 3 + ScrollTrigger (250vh desktop / 180vh mobile).
 * ============================================================================
 */
(function () {
  'use strict';

  // Progressive enhancement: đánh dấu HTML đã bật JS để CSS .reveal có hiệu lực
  document.documentElement.classList.add('js-enabled');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Khoá sớm bộ đếm tự động của landing.js trong #home để tránh xung đột với Cảnh 3
  const heroSection = document.getElementById('home');
  if (heroSection && !prefersReducedMotion) {
    $$('.count', heroSection).forEach((el) => {
      el.dataset.counted = '1';
    });
  }

  /* ==========================================================================
     BƯỚC 1: KHỐI HIỆN DẦN KHI CUỘN TỚI (.reveal + IntersectionObserver)
     ========================================================================== */

  /**
   * Gắn class .reveal, biến thể hướng và data-stagger cho các khối mục tiêu
   */
  function tagElementReveal(el, variant = 'up', delayMs = null) {
    if (!el || el.closest('#home')) return;
    el.classList.add('reveal', `reveal--${variant}`, `--${variant}`);
    if (delayMs !== null) {
      el.style.setProperty('--stagger-delay', `${delayMs}ms`);
    }
  }

  /**
   * Áp dụng stagger tự động (80–120ms/phần tử) cho các container có data-stagger
   */
  function applyStaggerGroup(container, childSelector, variant = 'up', defaultStep = 95) {
    if (!container) return;
    if (!container.hasAttribute('data-stagger')) {
      container.setAttribute('data-stagger', String(defaultStep));
    }
    const rawStep = parseInt(container.getAttribute('data-stagger') || String(defaultStep), 10);
    const step = Math.min(120, Math.max(80, isNaN(rawStep) ? defaultStep : rawStep));
    const items = childSelector ? $$(childSelector, container) : Array.from(container.children);

    items.forEach((item, index) => {
      tagElementReveal(item, variant, index * step);
    });
  }

  /**
   * Khởi tạo danh sách phần tử .reveal trên toàn trang:
   * tiêu đề, mô tả, thẻ kỹ năng, bảng Hard/Soft skills, lưới công cụ,
   * 3 bước quy trình, kinh nghiệm, dự án, form liên hệ.
   */
  function setupRevealTargets() {
    // 1. Section #about: Tiêu đề, mô tả, 3 thẻ Bento (Triết lý, Hard Skills, Soft Skills) & lưới Bộ công cụ 4 cột
    const aboutHead = $('#about .section-center-head');
    if (aboutHead) {
      tagElementReveal(aboutHead, 'up');
      applyStaggerGroup(aboutHead, ':scope > *', 'up', 90);
    }
    const bentoGrid = $('#about .airlume-bento-grid');
    if (bentoGrid) {
      applyStaggerGroup(bentoGrid, '.airlume-card', 'up', 110);
      $$('.skills-tags-wrap', bentoGrid).forEach((wrap) =>
        applyStaggerGroup(wrap, '.skill-tag', 'scale', 80)
      );
    }
    tagElementReveal($('#skills.tools-ecosystem-box'), 'up');
    tagElementReveal($('#skills .tools-ecosystem-head'), 'up');
    const toolsGrid = $('#skills .tools-ecosystem-grid');
    if (toolsGrid) {
      applyStaggerGroup(toolsGrid, '.tool-category-card', 'up', 100);
      $$('.tool-items-list', toolsGrid).forEach((list) =>
        applyStaggerGroup(list, '.tool-pill-item', 'up', 80)
      );
    }

    // 2. Section #process: Tiêu đề, mô tả & 3 bước quy trình
    tagElementReveal($('#process .scalix-split-left'), 'left');
    tagElementReveal($('#process .scalix-split-right'), 'right');
    const processGrid = $('#process .scalix-cards-grid');
    if (processGrid) {
      applyStaggerGroup(processGrid, '.scalix-card', 'up', 110);
    }

    // 3. Section #experience: Tiêu đề, mô tả & các khối kinh nghiệm tại VM Style
    const expHead = $('#experience .vm-exp-header');
    if (expHead) {
      tagElementReveal(expHead, 'up');
      applyStaggerGroup(expHead, ':scope > *', 'up', 90);
    }
    decorateDynamicExperience();

    // 4. Section #projects: Tiêu đề, mô tả, bộ lọc & lưới dự án
    tagElementReveal($('#projects .scalix-kicker-col'), 'left');
    tagElementReveal($('#projects .scalix-title-col'), 'right');
    tagElementReveal($('#projects .lp-filter-wrap'), 'up');
    decorateDynamicProjects();

    // 5. Section #contact: Tiêu đề, thông tin liên hệ & form liên hệ
    tagElementReveal($('#contact .scalix-contact-left'), 'left');
    tagElementReveal($('#contact .scalix-contact-right'), 'right');
    const contactForm = $('#portfolio-contact-form');
    if (contactForm) {
      applyStaggerGroup(
        contactForm,
        '.scalix-input-group, .scalix-dark-submit-btn',
        'up',
        95
      );
    }

    // Xử lý mọi container có sẵn [data-stagger] trong HTML
    $$('[data-stagger]').forEach((group) => {
      const raw = parseInt(group.getAttribute('data-stagger') || '100', 10);
      const step = Math.min(120, Math.max(80, isNaN(raw) ? 100 : raw));
      const directReveals = $$(':scope > .reveal', group);
      directReveals.forEach((child, idx) => {
        if (!child.style.getPropertyValue('--stagger-delay')) {
          child.style.setProperty('--stagger-delay', `${idx * step}ms`);
        }
      });
    });
  }

  function decorateDynamicExperience() {
    const mount = document.getElementById('vm-experience-mount');
    if (!mount) return;
    tagElementReveal($('.vm-brand-card', mount), 'scale');
    applyStaggerGroup($('.vm-overview-grid', mount), '.vm-overview-card', 'up', 100);
    tagElementReveal($('.vm-work-wrapper', mount), 'up');
    $$('.vm-subcat-block', mount).forEach((block) => tagElementReveal(block, 'up'));
    $$('.vm-gallery-grid', mount).forEach((grid) =>
      applyStaggerGroup(grid, '.vm-gallery-item', 'scale', 90)
    );
  }

  function decorateDynamicProjects() {
    const featuredBox = document.getElementById('featured-projects-container');
    if (featuredBox) {
      applyStaggerGroup(featuredBox, '.featured-card', 'up', 115);
    }
    const allBox = document.getElementById('all-projects-container');
    if (allBox) {
      applyStaggerGroup(allBox, '.project-grid-card', 'scale', 95);
    }
  }

  // IntersectionObserver thuần: threshold ~0.15, chạy 1 lần rồi unobserve
  const revealObserver =
    !prefersReducedMotion && 'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible', 'reveal--visible');
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: '0px 0px -4% 0px' }
        )
      : null;

  function observeReveals(root = document) {
    const elements = $$('.reveal', root);
    elements.forEach((el) => {
      if (prefersReducedMotion || !revealObserver) {
        el.classList.add('is-visible', 'reveal--visible');
        return;
      }
      if (el.dataset.revealObserved === '1') return;
      el.dataset.revealObserved = '1';
      revealObserver.observe(el);
    });
  }

  function bindTabRevealSync() {
    const ksStage = document.getElementById('ks-stage');
    if (ksStage) {
      ksStage.addEventListener('click', (e) => {
        if (
          e.target.closest(
            '.ks-cluster-tab, .ks-step-node, .ks-dock-ico, .ks-dock-next, .ks-view-toggle, .ks-subtab'
          )
        ) {
          requestAnimationFrame(() => {
            $$('.ks-row.reveal', ksStage).forEach((row) => {
              row.classList.add('is-visible', 'reveal--visible');
            });
          });
        }
      });
    }

    const expMount = document.getElementById('vm-experience-mount');
    if (expMount) {
      expMount.addEventListener('click', (e) => {
        if (e.target.closest('.vm-tab-btn')) {
          requestAnimationFrame(() => {
            $$('.vm-tab-panel.active .reveal', expMount).forEach((item) => {
              item.classList.add('is-visible', 'reveal--visible');
            });
          });
        }
      });
    }
  }

  function watchDynamicContainers() {
    const ids = ['vm-experience-mount', 'featured-projects-container', 'all-projects-container'];
    ids.forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;
      new MutationObserver(() => {
        if (id === 'vm-experience-mount') {
          decorateDynamicExperience();
        } else {
          decorateDynamicProjects();
        }
        observeReveals(container);
      }).observe(container, { childList: true });
    });
  }

  /* ==========================================================================
     BƯỚC 2: HERO KỂ CHUYỆN THEO CUỘN (#home PIN + SCRUB 4 CẢNH VỚI GSAP 3)
     ========================================================================== */

  /**
   * Bọc nội dung #home trong .hero-pin-viewport (sticky 100vh) và thêm
   * 4 tag nổi quanh avatar + 4 chấm chỉ báo cảnh hiện tại
   */
  function injectHeroStoryElements(hero) {
    let pinViewport = $('.hero-pin-viewport', hero);
    if (!pinViewport) {
      pinViewport = document.createElement('div');
      pinViewport.className = 'hero-pin-viewport';
      while (hero.firstChild) {
        pinViewport.appendChild(hero.firstChild);
      }
      hero.appendChild(pinViewport);
    }

    const avatarStage = $('.bento-avatar-stage', pinViewport);
    let orbitContainer = $('.hero-orbit-tags', pinViewport);
    if (avatarStage && !orbitContainer) {
      orbitContainer = document.createElement('div');
      orbitContainer.className = 'hero-orbit-tags';
      orbitContainer.setAttribute('aria-hidden', 'true');
      orbitContainer.innerHTML = `
        <span class="hero-orbit-tag hero-orbit-tag--tl">💡 Customer Insight</span>
        <span class="hero-orbit-tag hero-orbit-tag--tr">📐 Content Pillar</span>
        <span class="hero-orbit-tag hero-orbit-tag--bl">✍️ Copywriting</span>
        <span class="hero-orbit-tag hero-orbit-tag--br">📈 Multi-channel</span>
      `;
      avatarStage.appendChild(orbitContainer);
    }

    let dotsNav = $('.hero-scene-dots', pinViewport);
    if (!dotsNav) {
      dotsNav = document.createElement('div');
      dotsNav.className = 'hero-scene-dots';
      dotsNav.setAttribute('role', 'navigation');
      dotsNav.setAttribute('aria-label', 'Chỉ báo 4 cảnh câu chuyện mở đầu');

      const scenes = [
        { index: 0, label: '01 • Insight' },
        { index: 1, label: '02 • Chiến lược' },
        { index: 2, label: '03 • Chuyển đổi' },
        { index: 3, label: '04 • Kết nối' }
      ];

      dotsNav.innerHTML = scenes
        .map(
          (s, i) => `
          <button
            type="button"
            class="hero-scene-dot ${i === 0 ? 'is-active' : ''}"
            data-scene="${s.index}"
            aria-label="Cảnh ${s.index + 1}: ${s.label}"
            aria-current="${i === 0 ? 'step' : 'false'}"
          >
            <span class="hero-scene-dot-label">${s.label}</span>
          </button>
        `
        )
        .join('');

      pinViewport.appendChild(dotsNav);
    }

    return {
      pinViewport,
      orbitTags: $$('.hero-orbit-tag', pinViewport),
      sceneDots: $$('.hero-scene-dot', pinViewport)
    };
  }

  /**
   * Khởi tạo GSAP 3 + ScrollTrigger cho #home
   */
  function initHeroPinStory() {
    const hero = document.getElementById('home');
    if (!hero) return;

    const badge = $('.lp-hero-tags', hero);
    const title = $('.lp-hero-title', hero);
    const desc = $('.lp-hero-desc', hero);
    const actions = $('.lp-hero-actions', hero);

    const leftCol = $('.hero-bento-left', hero);
    const whiteCard = $('.bento-white-card', hero);
    const pillStrip = $('.bento-pill-strip', hero);
    const reachCountEl = $('.bento-big-metric .count', hero);
    const engageBadgeEl = $('.bento-mini-badge', hero);

    const centerCol = $('.hero-bento-center', hero);
    const centerCard = $('.bento-center-card', hero);
    const centerPill = $('.bento-center-pill', hero);
    const centerHead = $('.bento-center-head', hero);
    const statRingRow = $('.bento-stat-ring-row', hero);
    const avatarStage = $('.bento-avatar-stage', hero);
    const floatingChip = $('.bento-floating-chip', hero);

    const rightCol = $('.hero-bento-right', hero);
    const glassCard = $('.bento-glass-card', hero);
    const glassTags = $$('.glass-tags-row span', hero);

    // Nếu người dùng bật prefers-reduced-motion hoặc thiếu GSAP: tắt pin/scrub, hiện trạng thái cuối
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
      hero.classList.remove('is-hero-pinned');
      if (reachCountEl) reachCountEl.textContent = '4.1M+';
      if (engageBadgeEl) engageBadgeEl.textContent = '📈 +65% Engagement';
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Đảm bảo các phần tử trong #home hiển thị rõ ràng dưới quyền điều khiển của GSAP
    $$('[data-reveal]', hero).forEach((el) => el.classList.add('is-visible'));
    hero.classList.add('is-hero-pinned');

    const { orbitTags, sceneDots } = injectHeroStoryElements(hero);
    const leftOrbitTags = orbitTags.filter((_, idx) => idx % 2 === 0);
    const rightOrbitTags = orbitTags.filter((_, idx) => idx % 2 === 1);

    // Hàm cập nhật chấm chỉ báo cảnh hiện tại (0..3)
    let activeSceneIdx = -1;
    function setActiveSceneDot(idx) {
      if (idx === activeSceneIdx) return;
      activeSceneIdx = idx;
      sceneDots.forEach((dot, i) => {
        const isCurrent = i === idx;
        dot.classList.toggle('is-active', isCurrent);
        dot.setAttribute('aria-current', isCurrent ? 'step' : 'false');
      });
    }

    // Hàm cập nhật số đếm "4.1M+" và "+65%" theo tiến độ cuộn (0..1) của Cảnh 3
    function updateConversionCounters(progress) {
      const clamped = Math.max(0, Math.min(1, progress));
      const reachVal = (4.1 * clamped).toFixed(1);
      const engageVal = Math.round(65 * clamped);
      if (reachCountEl) {
        reachCountEl.textContent = `${reachVal}M+`;
      }
      if (engageBadgeEl) {
        engageBadgeEl.textContent = `📈 +${engageVal}% Engagement`;
      }
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)'
      },
      (context) => {
        const { isMobile } = context.conditions;
        // Quãng bay ngắn hơn trên mobile để tránh tràn ngang
        const flyX = isMobile ? 36 : 90;
        const cardFlyX = isMobile ? 28 : 64;
        const slideY = isMobile ? 20 : 32;

        // Đặt trạng thái khởi đầu trước Cảnh 1
        updateConversionCounters(0);
        setActiveSceneDot(0);

        gsap.set([badge, title, desc], { opacity: 1, x: 0, y: 0, scale: 1 });
        gsap.set(actions, { opacity: 0, y: slideY, scale: 0.94 });

        // Avatar ở giữa hiện ngay từ Cảnh 1
        gsap.set(centerCol, { opacity: 1, x: 0, y: 0, scale: isMobile ? 1 : 1.04 });
        gsap.set(centerCard, { opacity: 1, x: 0, y: 0, scale: 1 });
        gsap.set([centerPill, avatarStage, floatingChip], { opacity: 1, x: 0, y: 0, scale: 1 });

        // Thẻ "360° Content" và hàng dữ liệu chờ Cảnh 2 bay vào
        gsap.set(centerHead, { opacity: 0, x: -flyX, y: 0, scale: 0.95 });
        gsap.set(statRingRow, { opacity: 0, x: flyX, y: 0, scale: 0.95 });

        // Các tag vệ tinh nổi nhẹ quanh avatar ở Cảnh 1
        gsap.set(leftOrbitTags, { opacity: 0.88, x: -6, y: 4, scale: 0.96 });
        gsap.set(rightOrbitTags, { opacity: 0.88, x: 6, y: -4, scale: 0.96 });

        // Cột Trái (KPI "4.1M+" & "+65%") chờ Cảnh 3 trượt vào với stagger
        gsap.set(leftCol, { opacity: 1, x: 0, y: 0 });
        gsap.set(whiteCard, { opacity: 0, x: -cardFlyX, y: slideY, scale: 0.95 });
        gsap.set(pillStrip, { opacity: 0, x: -cardFlyX, y: slideY + 8, scale: 0.95 });

        // Cột Phải ("Storytelling → Conversion") chờ Cảnh 4 kết nối
        gsap.set(rightCol, { opacity: 1, x: 0, y: 0 });
        gsap.set(glassCard, { opacity: 0, x: cardFlyX, y: slideY, scale: 0.94 });
        gsap.set(glassTags, { opacity: 0, y: 14, scale: 0.92 });

        const counterProxy = { p: 0 };

        // Timeline tổng 100 đơn vị (4 cảnh x 25 đơn vị = 25% mỗi cảnh)
        // #home có chiều cao 350vh (desktop: 100vh + 250vh pin) / 280vh (mobile: 100vh + 180vh pin)
        // kết hợp .hero-pin-viewport sticky top: 0 nên cuộn ngược luôn giữ #home ở sát đỉnh trang
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            id: 'heroPinTrigger',
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
              const sceneIdx = Math.min(3, Math.floor(self.progress * 4));
              setActiveSceneDot(sceneIdx);
            }
          }
        });

        /* ------------------------------------------------------------------
           CẢNH 1 (0 → 25): INSIGHT
           H1 + badge hiện rõ, avatar ở giữa, các tag nổi nhẹ quanh avatar
           ------------------------------------------------------------------ */
        tl.fromTo(
          badge,
          { opacity: 0.85, y: -10, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 10 },
          0
        )
          .fromTo(
            title,
            { opacity: 0.9, y: 12, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 12 },
            0
          )
          .to(
            leftOrbitTags,
            { x: 0, y: -6, opacity: 1, scale: 1, duration: 25, ease: 'sine.inOut' },
            0
          )
          .to(
            rightOrbitTags,
            { x: 0, y: 6, opacity: 1, scale: 1, duration: 25, ease: 'sine.inOut' },
            0
          )
          .to(
            [centerPill, floatingChip],
            { y: -4, duration: 25, ease: 'sine.inOut' },
            0
          );

        /* ------------------------------------------------------------------
           CẢNH 2 (25 → 50): CHIẾN LƯỢC
           H1 mờ và thu nhỏ nhẹ; thẻ "360° Content" và các tag bay vào từ 2 bên,
           xếp gọn quanh avatar
           ------------------------------------------------------------------ */
        tl.to(
          title,
          { opacity: 0.65, scale: 0.93, y: -8, duration: 22, ease: 'power2.inOut' },
          25
        )
          .to(
            desc,
            { opacity: 0.6, scale: 0.95, y: -6, duration: 22, ease: 'power2.inOut' },
            25
          )
          .to(
            centerHead,
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 20 },
            26
          )
          .to(
            statRingRow,
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 20 },
            30
          )
          .fromTo(
            leftOrbitTags,
            { x: -flyX * 0.6, opacity: 0.35 },
            { x: 0, y: 0, opacity: 1, scale: 1.03, duration: 20 },
            27
          )
          .fromTo(
            rightOrbitTags,
            { x: flyX * 0.6, opacity: 0.35 },
            { x: 0, y: 0, opacity: 1, scale: 1.03, duration: 20 },
            29
          );

        /* ------------------------------------------------------------------
           CẢNH 3 (50 → 75): CHUYỂN ĐỔI
           "4.1M+" và "+65%" chạy đếm từ 0 theo tiến độ cuộn,
           thẻ KPI & pill strip trượt vào với stagger
           ------------------------------------------------------------------ */
        tl.to(
          whiteCard,
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 16 },
          50
        )
          .to(
            pillStrip,
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 16 },
            56
          )
          .fromTo(
            counterProxy,
            { p: 0 },
            {
              p: 1,
              duration: 24,
              ease: 'none',
              onUpdate: () => updateConversionCounters(counterProxy.p)
            },
            50
          );

        /* ------------------------------------------------------------------
           CẢNH 4 (75 → 100): KẾT NỐI
           Cụm thu lại cân đối, hiện "Storytelling → Conversion" và 2 nút CTA,
           nhả pin để cuộn tiếp sang #about
           ------------------------------------------------------------------ */
        tl.to(
          [title, desc],
          { opacity: 1, scale: 1, y: 0, duration: 18 },
          75
        )
          .to(
            centerCol,
            { scale: 1, y: 0, duration: 18 },
            75
          )
          .to(
            orbitTags,
            { scale: 0.96, opacity: 0.9, duration: 16 },
            75
          )
          .to(
            glassCard,
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 18 },
            75
          )
          .to(
            glassTags,
            { opacity: 1, y: 0, scale: 1, stagger: 3, duration: 12 },
            80
          )
          .to(
            actions,
            { opacity: 1, y: 0, scale: 1, duration: 18 },
            79
          );

        // Sự kiện click vào 4 chấm chỉ báo để nhảy đến từng cảnh
        sceneDots.forEach((dot) => {
          dot.onclick = () => {
            const st = tl.scrollTrigger;
            if (!st) return;
            const targetScene = parseInt(dot.getAttribute('data-scene') || '0', 10);
            const ratio = targetScene === 3 ? 0.96 : (targetScene + 0.35) / 4;
            const targetScroll = st.start + (st.end - st.start) * ratio;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          };
        });

        return () => {
          tl.kill();
        };
      }
    );
  }

  /**
   * Đồng bộ các link anchor (#about, #experience, #projects, #process, #contact)
   * và gọi ScrollTrigger.refresh() sau khi ảnh/font tải xong để không lệch vị trí.
   */
  function setupAnchorAndRefreshSync() {
    document.addEventListener(
      'click',
      (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) navMenu.classList.remove('open');

        if (href === '#home') {
          window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          return;
        }

        const headerEl = document.querySelector('.lp-header');
        const headerOffset = headerEl ? headerEl.offsetHeight : 72;
        const y = target.getBoundingClientRect().top + window.scrollY - (headerOffset - 4);
        window.scrollTo({
          top: Math.max(0, y),
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      },
      true
    );

    const safeRefreshTrigger = () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(safeRefreshTrigger).catch(() => {});
    }

    window.addEventListener('load', safeRefreshTrigger);

    const heroEl = document.getElementById('home');
    if (heroEl) {
      $$('img', heroEl).forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', safeRefreshTrigger, { once: true });
        }
      });
    }
  }

  /* ==========================================================================
     KHỞI CHẠY KHI DOM SẴN SÀNG
     ========================================================================== */
  function initAllScrollEffects() {
    setupRevealTargets();
    observeReveals(document);
    bindTabRevealSync();
    watchDynamicContainers();
    initHeroPinStory();
    setupAnchorAndRefreshSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllScrollEffects);
  } else {
    initAllScrollEffects();
  }
})();
