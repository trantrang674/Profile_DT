/**
 * MAIN INTERACTIVITY SCRIPT
 * Quản lý Navigation, Render Dự án từ Markdown, Bộ lọc & Tải CV/Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNav();

  if (document.getElementById('featured-projects-container')) {
    loadFeaturedProjects();
  }

  if (document.getElementById('all-projects-container')) {
    loadAllProjectsPage();
  }

  if (document.getElementById('project-detail-content')) {
    loadProjectDetailPage();
  }
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

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/**
 * 2. Đánh dấu active cho link menu
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 3. Render 2 Dự án nổi bật trên Trang Chủ (index.html)
 */
async function loadFeaturedProjects() {
  const container = document.getElementById('featured-projects-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
      <p>Đang tải các dự án nổi bật từ Markdown...</p>
    </div>
  `;

  try {
    const projects = await window.MarkdownLoader.loadAllProjects();
    
    let featured = projects.filter(p => p.featured === true);
    if (featured.length === 0) {
      featured = projects.slice(0, 2);
    } else {
      featured.sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));
      featured = featured.slice(0, 2);
    }

    if (featured.length === 0) {
      container.innerHTML = `<p style="text-align: center;">Chưa có dự án nào được gắn nhãn nổi bật.</p>`;
      return;
    }

    container.innerHTML = featured.map(p => createFeaturedCardHTML(p)).join('');
  } catch (error) {
    console.error('Lỗi khi tải dự án nổi bật:', error);
    container.innerHTML = `<p style="color: red; text-align: center;">Không thể tải dữ liệu dự án. Vui lòng thử lại sau.</p>`;
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
        <a href="project.html?id=${encodeURIComponent(project.id)}">
          <img src="${project.cover || 'assets/images/project-ecotea.svg'}" alt="${project.title}" loading="lazy">
        </a>
      </div>
      <div class="featured-content-col">
        <div class="project-meta">
          <span class="badge badge-orange">${project.category || 'Content Marketing'}</span>
          <span class="badge badge-gray">${project.client || ''}</span>
        </div>
        <h3 class="project-title">
          <a href="project.html?id=${encodeURIComponent(project.id)}">${project.title}</a>
        </h3>
        <p class="project-excerpt">${project.summary || ''}</p>
        
        ${metricsHTML}

        <div style="margin-top: 1rem;">
          <a href="project.html?id=${encodeURIComponent(project.id)}" class="btn btn-secondary btn-sm">
            Xem Case Study Chi Tiết
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * 4. Render Trang Danh Sách Dự Án (projects.html) + Bộ Lọc
 */
async function loadAllProjectsPage() {
  const container = document.getElementById('all-projects-container');
  const filterContainer = document.getElementById('project-filters');
  if (!container) return;

  try {
    const projects = await window.MarkdownLoader.loadAllProjects();

    if (projects.length === 0) {
      container.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">Chưa có dự án nào.</p>`;
      return;
    }

    const categories = ['Tất Cả', ...new Set(projects.map(p => p.category).filter(Boolean))];

    if (filterContainer) {
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
    }

    renderProjectGrid(projects, 'Tất Cả');
  } catch (error) {
    console.error('Lỗi khi tải danh sách dự án:', error);
    container.innerHTML = `<p style="color: red; text-align: center;">Không thể tải dữ liệu dự án.</p>`;
  }
}

function renderProjectGrid(projects, category) {
  const container = document.getElementById('all-projects-container');
  if (!container) return;

  const filtered = category === 'Tất Cả' 
    ? projects 
    : projects.filter(p => p.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; padding: 3rem 0; color: var(--text-muted);">Không tìm thấy dự án nào trong mục này.</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <article class="project-grid-card">
      <div class="project-grid-thumb">
        <a href="project.html?id=${encodeURIComponent(p.id)}">
          <img src="${p.cover || 'assets/images/project-ecotea.svg'}" alt="${p.title}" loading="lazy">
        </a>
      </div>
      <div class="project-grid-body">
        <div class="project-meta" style="margin-bottom: 0.6rem;">
          <span class="badge badge-blue">${p.category || 'Content'}</span>
          <span style="font-size: 0.8rem; color: var(--text-light);">${p.date || ''}</span>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.35;">
          <a href="project.html?id=${encodeURIComponent(p.id)}">${p.title}</a>
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.2rem;">
          ${(p.summary || '').length > 130 ? (p.summary || '').substring(0, 130) + '...' : p.summary}
        </p>
        <div class="project-grid-footer">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--orange-600);">${p.client || ''}</span>
          <a href="project.html?id=${encodeURIComponent(p.id)}" style="font-size: 0.88rem; font-weight: 700; color: var(--blue-600); display: inline-flex; align-items: center; gap: 0.3rem;">
            Đọc tiếp →
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * 5. Render Chi Tiết Dự Án (project.html?id=...)
 */
async function loadProjectDetailPage() {
  const container = document.getElementById('project-detail-content');
  const headerContainer = document.getElementById('project-detail-header');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    window.location.href = 'projects.html';
    return;
  }

  container.innerHTML = `
    <div style="text-align: center; padding: 4rem 0; color: var(--text-muted);">
      <p>Đang tải nội dung dự án từ file Markdown...</p>
    </div>
  `;

  try {
    const project = await window.MarkdownLoader.getProjectById(projectId);

    if (!project) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 0;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Không tìm thấy dự án</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">File Markdown tương ứng với mã dự án "${projectId}" không tồn tại hoặc chưa được thêm vào manifest.</p>
          <a href="projects.html" class="btn btn-secondary">Quay lại danh sách dự án</a>
        </div>
      `;
      return;
    }

    document.title = `${project.title} | Portfolio Content Marketing`;

    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="container">
          <a href="projects.html" class="back-link">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Quay lại kho dự án
          </a>
          <div style="margin-bottom: 1rem;">
            <span class="badge badge-orange" style="font-size: 0.85rem; padding: 0.35rem 0.9rem;">${project.category || 'Content Marketing'}</span>
          </div>
          <h1 class="project-detail-title">${project.title}</h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 780px; line-height: 1.6;">
            ${project.summary || ''}
          </p>

          <div class="project-overview-grid">
            <div class="overview-item">
              <span>Khách hàng / Thương hiệu</span>
              <strong>${project.client || 'Dự án Doanh nghiệp'}</strong>
            </div>
            <div class="overview-item">
              <span>Vai trò phụ trách</span>
              <strong>${project.role || 'Content Marketer'}</strong>
            </div>
            <div class="overview-item">
              <span>Thời gian triển khai</span>
              <strong>${project.date || '2024'}</strong>
            </div>
            <div class="overview-item">
              <span>File Markdown nguồn</span>
              <strong style="font-family: monospace; font-size: 0.85rem; color: var(--blue-600); word-break: break-all;">${project.filePath || ''}</strong>
            </div>
          </div>
        </div>
      `;
    }

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

    container.innerHTML = `
      <div class="container">
        <div class="markdown-container">
          ${kpiHtml}
          ${project.htmlContent}
          
          <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <a href="projects.html" class="btn btn-outline">
              ← Tất cả dự án
            </a>
            <a href="contact.html" class="btn btn-primary">
              Thảo luận về cơ hội hợp tác
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Lỗi khi tải chi tiết dự án:', error);
    container.innerHTML = `<p style="color: red; text-align: center;">Đã xảy ra lỗi khi tải bài viết Markdown.</p>`;
  }
}
