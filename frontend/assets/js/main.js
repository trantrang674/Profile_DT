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
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
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

        <button type="button" class="btn btn-primary open-case-study" data-project-id="${project.id}">
          Đọc case study
        </button>
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
        <div class="project-meta">
          <span class="badge badge-blue">${p.category || 'Content'}</span>
          <span class="project-date">${p.date || ''}</span>
        </div>
        <h4 class="project-grid-title">
          <a href="javascript:void(0)" class="open-case-study" data-project-id="${p.id}">${p.title}</a>
        </h4>
        <p class="project-grid-excerpt">
          ${(p.summary || '').length > 140 ? (p.summary || '').substring(0, 140).trim() + '…' : (p.summary || '')}
        </p>
        <div class="project-grid-footer">
          <span class="project-client">${p.client || ''}</span>
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
          <div class="kpi-callout">
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
        <div class="case">
          <span class="badge badge-orange">${project.category || 'Content Marketing'}</span>
          <h2 class="case-title">${project.title}</h2>
          <p class="case-summary">${project.summary || ''}</p>

          <dl class="case-facts">
            <div><dt>Khách hàng</dt><dd>${project.client || ''}</dd></div>
            <div><dt>Vai trò</dt><dd>${project.role || ''}</dd></div>
            <div><dt>Thời gian</dt><dd>${project.date || ''}</dd></div>
          </dl>

          ${kpiHtml}

          <div class="markdown-container">
            ${project.htmlContent || ''}
          </div>

          <div class="case-cta">
            <a href="#contact" class="btn btn-primary" onclick="document.getElementById('project-modal-backdrop').classList.remove('active'); document.body.style.overflow='';">
              Trao đổi về một dự án tương tự
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
