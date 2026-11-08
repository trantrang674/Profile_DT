# HƯỚNG DẪN SỬ DỤNG WEBSITE PORTFOLIO CONTENT MARKETING

Website portfolio cá nhân dành riêng cho **Content Marketer** để ứng tuyển việc làm và lưu trữ các dự án cá nhân/doanh nghiệp. Website được thiết kế theo phong cách tối giản, hiện đại, chuẩn UI/UX, hỗ trợ hosting miễn phí trên **GitHub Pages** và gắn **Tên miền riêng**.

---

## 🎨 Thông Tin Thiết Kế & Kỹ Thuật

- **Màu sắc chủ đạo:** 
  - Nền & Thẻ: Trắng tinh khôi (`#FFFFFF`) & Xám nhạt dịu mắt (`#F8FAFC`)
  - Màu nhận diện / Chuyên nghiệp: **Xanh Biển** (`#0284C7`, `#0369A1`)
  - Màu điểm nhấn / Nút CTA: **Cam Năng Động** (`#F97316`, `#EA580C`)
- **Font chữ:** **Plus Jakarta Sans** (Google Fonts) — hiển thị tiếng Việt hoàn hảo, nét chữ hiện đại chuẩn các website Creative & Tech Agency.
- **Giao diện:** Light Mode tối giản, thanh lịch, tạo cảm giác chuyên nghiệp cao đối với Nhà tuyển dụng, Trưởng phòng Marketing và CEO.
- **Nền tảng:** HTML5, CSS3 hiện đại, Vanilla JavaScript (Không cần cài đặt Node.js hay build rườm rà, tải cực nhanh và chạy ngay lập tức).
- **Cơ chế lưu trữ:** Mỗi dự án là một file **Markdown (.md)** riêng biệt.

---

## 📂 Cấu Trúc Thư Mục

```text
Profile_DT/
├── GEMINI.md                    # Hướng dẫn chi tiết cho Agent làm việc với dự án
├── AGENTS.md                    # Quy tắc và hướng dẫn Agent chuẩn hoá
├── run_preview.bat              # Nhấp đúp chuột để xem website ngay trên máy tính
├── README.md                    # Tài liệu hướng dẫn sử dụng
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # Tự động deploy thư mục frontend/ lên GitHub Pages
│
└── frontend/                    # Toàn bộ mã nguồn giao diện website
    ├── index.html               # Trang chủ (Hero + 3 CTA + 2 dự án nổi bật + Kỹ năng)
    ├── projects.html            # Kho dự án tổng hợp + Bộ lọc theo Category
    ├── project.html             # Trang chi tiết dự án (Tự động nạp nội dung từ Markdown)
    ├── about.html               # Trang giới thiệu (Câu chuyện nghề, timeline kinh nghiệm)
    ├── blog.html                # Góc chia sẻ chuyên môn
    ├── contact.html             # Trang liên hệ
    │
    ├── content/
    │   ├── projects-manifest.js # Danh sách đăng ký các file Markdown dự án
    │   └── projects/            # Thư mục chứa các file bài viết Markdown (.md)
    │       ├── chien-dich-social-ecotea.md
    │       ├── seo-organic-growth-tech.md
    │       ├── rebranding-storytelling-fnb.md
    │       └── email-nurture-automation.md
    │
    └── assets/
        ├── css/
        │   └── style.css        # Toàn bộ mã CSS thiết kế
        ├── js/
        │   ├── markdown-loader.js # Bộ nạp và chuyển đổi Markdown sang HTML
        │   └── main.js          # Kịch bản điều khiển giao diện & dữ liệu
        ├── images/              # Hình ảnh & SVG minh hoạ
        └── cv/                  # Chứa file CV & Portfolio PDF
            ├── CV-Content-Marketing.pdf
            └── Portfolio-Content-Marketing.pdf
```

---

## 🚀 Cách Đăng Dự Án Mới Bằng Markdown (Chỉ 2 Bước)

Mỗi khi bạn hoàn thành một chiến dịch hoặc bài viết mới:

### Bước 1: Tạo file Markdown mới trong `frontend/content/projects/`
Tạo file có đuôi `.md`, ví dụ: `frontend/content/projects/chien-dich-moi.md`:

```markdown
---
id: "chien-dich-moi"
title: "Tên Chiến Dịch Hoặc Bài Viết Của Bạn"
category: "Social Media"           # Social Media, Content SEO, Brand Storytelling, Copywriting...
featured: true                     # Đặt true nếu muốn hiển thị là 1 trong 2 dự án ở Trang Chủ
featured_order: 1                  # Thứ tự hiển thị nổi bật (1 hoặc 2)
date: "Tháng 05/2024"
client: "Tên Thương Hiệu Hoặc Công Ty"
role: "Content Marketer / Copywriter"
cover: "assets/images/project-ecotea.svg"
summary: "Mô tả ngắn gọn 2 - 3 câu về bối cảnh và kết quả ấn tượng nhất của dự án."
metrics:
  - label: "Lượt Tiếp Cận (Reach)"
    value: "500K+"
  - label: "Tỷ Lệ Tương Tác"
    value: "7.2%"
  - label: "Tăng Trưởng Doanh Số"
    value: "+40%"
tags:
  - "TikTok"
  - "Copywriting"
---

## 1. Bối cảnh & Thách thức
...

## 2. Customer Insight & Ý tưởng lớn
...

## 3. Chiến lược & Kế hoạch Thực thi
...

## 4. Kết quả & Số liệu Đo lường
...

## 5. Bài học Rút ra (Key Takeaways)
...
```

### Bước 2: Khai báo file vào `frontend/content/projects-manifest.js`
Mở file `frontend/content/projects-manifest.js` và thêm đường dẫn file bạn vừa tạo vào mảng:

```javascript
window.PROJECTS_MANIFEST = [
  "content/projects/chien-dich-moi.md",    // <-- Thêm dòng này
  "content/projects/chien-dich-social-ecotea.md",
  "content/projects/seo-organic-growth-tech.md",
  "content/projects/rebranding-storytelling-fnb.md",
  "content/projects/email-nurture-automation.md"
];
```

Website sẽ tự động phân tích và hiển thị lên toàn bộ hệ thống!

---

## 🌐 Hướng Dẫn Đưa Lên GitHub Pages & Gắn Tên Miền Đã Có

1. **Khởi tạo và đẩy mã nguồn lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Content Marketing Portfolio"
   git branch -M main
   git remote add origin https://github.com/trantrang674/PROFILE.git
   git push -u origin main
   ```
2. **Kích hoạt GitHub Pages:**
   - Vào repository trên GitHub -> **Settings** -> **Pages**.
   - Tại mục **Build and deployment** -> **Source**: Chọn **GitHub Actions** (File `.github/workflows/deploy.yml` đã được cài sẵn sẽ tự động deploy).
3. **Gắn Tên Miền Riêng (Custom Domain):**
   - Tại ô **Custom domain** trong GitHub Pages, nhập tên miền của bạn (ví dụ: `duongtrang.vn`).
   - Tích chọn **Enforce HTTPS**.
   - Cấu hình DNS tại nhà cung cấp tên miền: Thêm 4 bản ghi A trỏ về IP của GitHub (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
