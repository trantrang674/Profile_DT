/**
 * ONE-PAGE PORTFOLIO INTERACTIVITY SCRIPT
 * Quản lý One-Page Smooth Scroll, ScrollSpy Navigation, Modal Popup Case Studies & Bộ Lọc Dự Án
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initOnePageSmoothScroll();
  initScrollSpy();
  initCaseStudyModal();

  // Nạp dữ liệu các dự án từ Markdown
  loadAllPortfolioProjects();
});

/**
 * 1. Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Đóng khi click ra ngoài hoặc click vào link
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/**
 * 2. Cuộn mượt mà (Smooth Scroll) khi bấm vào tab Menu
 */
function initOnePageSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 3. ScrollSpy: Tự động đổi tab Active khi cuộn chuột đến Section tương ứng
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180; // bù khoảng cách header

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/**
 * 4. Nạp Dự án từ Markdown & Hiển thị trên Trang Chủ
 */
async function loadAllPortfolioProjects() {
  const featuredContainer = document.getElementById('featured-projects-container');
  const allContainer = document.getElementById('all-projects-container');
  const filterContainer = document.getElementById('project-filters');

  if (!window.MarkdownLoader) return;

  try {
    const projects = await window.MarkdownLoader.loadAllProjects();

    if (!projects || projects.length === 0) {
      if (featuredContainer) featuredContainer.innerHTML = '<p style="text-align:center;">Chưa có dự án nào.</p>';
      if (allContainer) allContainer.innerHTML = '<p style="text-align:center;">Chưa có dự án nào.</p>';
      return;
    }

    // A. Render 2 Dự Án Nổi Bật
    if (featuredContainer) {
      let featured = projects.filter(p => p.featured === true);
      if (featured.length === 0) {
        featured = projects.slice(0, 2);
      } else {
        featured.sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));
        featured = featured.slice(0, 2);
      }
      featuredContainer.innerHTML = featured.map(p => createFeaturedCardHTML(p)).join('');
    }

    // B. Render Bộ lọc danh mục & Toàn bộ dự án
    if (filterContainer && allContainer) {
      const categories = ['Tất Cả', ...new Set(projects.map(p => p.category).filter(Boolean))];

      filterContainer.innerHTML = categories.map((cat, idx) => `
        <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('');

      const filterBtns = filterContainer.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const selectedCat = btn.getAttribute('data-category');
          renderProjectGrid(projects, selectedCat);
        });
      });

      renderProjectGrid(projects, 'Tất Cả');
    }

    // Gắn sự kiện mở Popup Modal cho tất cả các nút xem case study
    bindModalTriggers(projects);

  } catch (err) {
    console.error('Lỗi khi tải dự án:', err);
  }
}

function createFeaturedCardHTML(project) {
  const metricsHTML = (project.metrics && Array.isArray(project.metrics))
    ? `
      <div class="project-metrics">
        ${project.metrics.map(m => `
          <div class="metric-box">
            <h4>${m.value || ''}</h4>
            <p>${m.label || ''}</p>
          </div>
        `).join('')}
      </div>
    `
    : '';

  return `
    <article class="featured-card">
      <div class="featured-img-col">
        <a href="javascript:void(0)" class="open-case-study" data-project-id="${project.id}">
          <img src="${project.cover || 'assets/images/project-ecotea.svg'}" alt="${project.title}" loading="lazy">
        </a>
      </div>
      <div class="featured-content-col">
        <div class="project-meta">
          <span class="badge badge-orange">${project.category || 'Content Marketing'}</span>
          <span class="badge badge-gray">${project.client || ''}</span>
        </div>
        <h3 class="project-title">
          <a href="javascript:void(0)" class="open-case-study" data-project-id="${project.id}">${project.title}</a>
        </h3>
        <p class="project-excerpt">${project.summary || ''}</p>
        
        ${metricsHTML}

        <div class="scalix-card-foot" style="margin-top: 1.25rem;">
          <button type="button" class="scalix-pill-cta dark open-case-study" data-project-id="${project.id}" style="border:none; cursor:pointer;">
            Xem Case Study Chi Tiết
          </button>
          <button type="button" class="scalix-circle-cta dark open-case-study" data-project-id="${project.id}" style="border:none; cursor:pointer;" aria-label="Mở Case Study">
            ↗
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProjectGrid(projects, category) {
  const container = document.getElementById('all-projects-container');
  if (!container) return;

  const filtered = category === 'Tất Cả' 
    ? projects 
    : projects.filter(p => p.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: var(--text-muted);">Không tìm thấy dự án trong danh mục này.</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <article class="project-grid-card">
      <div class="project-grid-thumb">
        <a href="javascript:void(0)" class="open-case-study" data-project-id="${p.id}">
          <img src="${p.cover || 'assets/images/project-ecotea.svg'}" alt="${p.title}" loading="lazy">
        </a>
      </div>
      <div class="project-grid-body">
        <div class="project-meta" style="margin-bottom: 0.6rem;">
          <span class="badge badge-blue">${p.category || 'Content'}</span>
          <span style="font-size: 0.8rem; color: var(--text-light);">${p.date || ''}</span>
        </div>
        <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.35;">
          <a href="javascript:void(0)" class="open-case-study" data-project-id="${p.id}">${p.title}</a>
        </h4>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.2rem;">
          ${(p.summary || '').length > 130 ? (p.summary || '').substring(0, 130) + '...' : p.summary}
        </p>
        <div class="project-grid-footer">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--orange-600);">${p.client || ''}</span>
          <button type="button" class="open-case-study" data-project-id="${p.id}" style="background: none; border: none; font-size: 0.88rem; font-weight: 700; color: var(--blue-600); cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem;">
            Đọc tiếp →
          </button>
        </div>
      </div>
    </article>
  `).join('');

  bindModalTriggers(projects);
}

/**
 * 5. Case Study Modal Popup Trực Tiếp Trên Trang (Không Chuyển Trang)
 */
function initCaseStudyModal() {
  const backdrop = document.getElementById('project-modal-backdrop');
  const closeBtn = document.getElementById('project-modal-close');

  if (!backdrop) return;

  function closeModal() {
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

function bindModalTriggers(projects) {
  const triggers = document.querySelectorAll('.open-case-study');
  const backdrop = document.getElementById('project-modal-backdrop');
  const modalBody = document.getElementById('project-modal-body');

  if (!backdrop || !modalBody) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project-id');
      const project = projects.find(p => p.id === projectId);

      if (!project) return;

      let kpiHtml = '';
      if (project.metrics && Array.isArray(project.metrics)) {
        kpiHtml = `
          <div class="kpi-callout" style="margin-top: 1.5rem; margin-bottom: 2rem;">
            ${project.metrics.map(m => `
              <div>
                <div class="kpi-num">${m.value || ''}</div>
                <div class="kpi-label">${m.label || ''}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      modalBody.innerHTML = `
        <div>
          <span class="badge badge-orange" style="margin-bottom: 0.75rem;">${project.category || 'Content Marketing'}</span>
          <h2 style="font-size: 2rem; font-weight: 800; line-height: 1.25; margin-bottom: 1rem; color: var(--text-main);">
            ${project.title}
          </h2>
          <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            ${project.summary || ''}
          </p>

          <div class="project-overview-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 2rem; background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 600;">Khách hàng / Brand</span>
              <strong style="display: block; font-size: 0.95rem; color: var(--text-main); margin-top: 0.2rem;">${project.client || ''}</strong>
            </div>
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 600;">Vai trò</span>
              <strong style="display: block; font-size: 0.95rem; color: var(--text-main); margin-top: 0.2rem;">${project.role || ''}</strong>
            </div>
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 600;">Thời gian</span>
              <strong style="display: block; font-size: 0.95rem; color: var(--text-main); margin-top: 0.2rem;">${project.date || ''}</strong>
            </div>
          </div>

          ${kpiHtml}

          <div class="markdown-container" style="margin: 0; max-width: 100%;">
            ${project.htmlContent || ''}
          </div>

          <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: center;">
            <a href="#contact" class="btn btn-primary" onclick="document.getElementById('project-modal-backdrop').classList.remove('active'); document.body.style.overflow='';">
              Liên Hệ Thảo Luận Về Dự Án Tương Tự
            </a>
          </div>
        </div>
      `;

      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
}
