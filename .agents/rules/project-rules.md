---
trigger: always_on
---

# Quy Tắc Cho Agent Làm Việc Với Dự Án Profile_DT

1. **Vị Trí File:**
   - Mã nguồn website nằm trong `frontend/`.
   - File bài viết dự án nằm trong `frontend/content/projects/`.
   - File đăng ký dự án là `frontend/content/projects-manifest.js`.

2. **Nút CTA Chính:**
   - Nút "Xem dự án": dẫn đến `projects.html`.
   - Nút "Tải portfolio": tải file `assets/cv/Portfolio-Content-Marketing.pdf`.
   - Nút "Tải CV": tải file `assets/cv/CV-Content-Marketing.pdf`.

3. **Chế Độ Giao Diện:**
   - Luôn sử dụng giao diện sáng (Light mode).
   - Màu sắc: Trắng - Xanh Biển (`#0284c7`) - Cam (`#f97316`).
   - Font chữ: `Plus Jakarta Sans`.

4. **Icon:**
   - Không dùng emoji hay ký tự (🎯 ✍️ 📍 ★ ↗ → ↓ ✕ …) làm icon giao diện.
   - Chỉ dùng icon trong thư viện Lucide: `<i data-lucide="tên-icon"></i>` (thư viện nạp từ CDN trong `index.html`, `assets/js/site.js` tự vẽ, kể cả phần tử JS thêm sau).
   - Icon nằm trong hình SVG: nhúng path của icon Lucide (gói `lucide-static`).
   - Emoji trong caption bài đăng mạng xã hội thật là nội dung, được giữ nguyên.
