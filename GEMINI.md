# HƯỚNG DẪN DÀNH CHO AI AGENT (GEMINI.MD)
## Project: Content Marketing Portfolio & Case Studies Repository (Profile_DT)

Tài liệu này cung cấp toàn bộ bối cảnh dự án, kiến trúc kỹ thuật, quy tắc code và hướng dẫn thao tác để AI Agent hỗ trợ người dùng phát triển, bảo trì và mở rộng website portfolio này một cách chuẩn xác nhất.

---

### 1. Bối Cảnh & Mục Tiêu Dự Án
- **Mục tiêu:** Website portfolio cá nhân của **Dương Trang** để ứng tuyển các vị trí Content Marketing (Content Lead, Senior Content Strategist, Copywriter) tại các công ty, Agency hoặc làm việc trực tiếp với CEO/HR. Đồng thời đóng vai trò kho lưu trữ case study dự án cá nhân dài hạn.
- **Phong cách:** Tối giản (Minimalist), Hiện đại, Tinh tế, High-converting.
- **Bảng màu chủ đạo:**
  - Nền & Thẻ: Trắng tinh khôi (`#ffffff`) và Xám dịu (`#f8fafc`)
  - Màu nhận diện thương hiệu: **Xanh Biển** (`#0284c7`, `#0369a1`)
  - Màu điểm nhấn / Nút CTA: **Cam Năng Động** (`#f97316`, `#ea580c`)
- **Font chữ:** `Plus Jakarta Sans` (Google Fonts).
- **Giao diện:** Chỉ sử dụng **Light Mode** sáng sủa, trang nhã.
- **Hosting & Triển khai:** GitHub Pages (Static site, deploy trực tiếp từ root `/`).

---

### 2. Cấu Trúc Thư Mục Chuẩn
Toàn bộ mã nguồn giao diện web nằm trực tiếp tại thư mục gốc:

```text
Profile_DT/
├── index.html                           # Trang chủ (Hero + 3 CTA + 2 dự án nổi bật + Skills)
├── projects.html                        # Kho dự án & Bộ lọc Category
├── project.html                         # Chi tiết case study tự load Markdown
├── about.html                           # Giới thiệu bản thân, triết lý viết, timeline
├── blog.html                            # Góc chia sẻ chuyên môn
├── contact.html                         # Trang liên hệ & form gửi tin
│
├── content/
│   ├── projects-manifest.js             # Danh sách đăng ký đường dẫn file Markdown
│   └── projects/                        # Thư mục chứa các file dự án .md
│       ├── chien-dich-social-ecotea.md
│       ├── seo-organic-growth-tech.md
│       ├── rebranding-storytelling-fnb.md
│       └── email-nurture-automation.md
│
├── assets/
│   ├── css/style.css                    # Toàn bộ CSS hệ thống
│   ├── js/main.js                       # Logic render, filter, navigation
│   ├── js/markdown-loader.js             # Client-side Markdown & Frontmatter parser
│   ├── images/                          # SVG minh họa dự án và hero avatar
│   └── cv/                              # File CV và Portfolio PDF
│
├── GEMINI.md                            # File hướng dẫn agent này
├── AGENTS.md                            # Quy tắc agent chuẩn hóa
├── README.md                            # Hướng dẫn chi tiết cho người dùng
├── run_preview.bat                      # Khởi chạy preview cục bộ (port 5500)
└── .github/workflows/deploy.yml         # GitHub Actions tự động deploy
```

---

### 3. Quy Trình Thêm Dự Án Mới
1. **Tạo file Markdown:** `content/projects/<slug>.md`.
2. **Khai báo Frontmatter:** id, title, category, featured, metrics, tags...
3. **Đăng ký manifest:** Thêm `"content/projects/<slug>.md"` vào `content/projects-manifest.js`.
