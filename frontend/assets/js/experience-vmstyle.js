/**
 * ============================================================================
 * DỮ LIỆU & LOGIC HIỂN THỊ SECTION KINH NGHIỆM LÀM VIỆC: VM STYLE
 * ----------------------------------------------------------------------------
 * HƯỚNG DẪN CHỈNH SỬA NHANH CHO BẠN:
 * 1. Thay Logo: Đổi đường dẫn tại `VM_STYLE_DATA.company.logoUrl`
 * 2. Sửa số liệu / nội dung tổng quan: Chỉnh trong `VM_STYLE_DATA.overview`
 * 3. Thay ảnh từng hạng mục: Đổi `src` và `caption` trong `VM_STYLE_DATA.categories`
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * Hàm tạo ảnh Placeholder SVG sắc nét (có ghi chú "Thay ảnh tại đây")
   * Khi bạn có ảnh thật, chỉ cần thay đường dẫn file ảnh (VD: 'assets/images/fb-post-1.jpg')
   * vào thuộc tính `src` bên dưới là hệ thống tự nhận.
   */
  function createPlaceholderSVG(title, subtitle, tag, themeColor) {
    const primary = themeColor === 'orange' ? '#f97316' : '#0284c7';
    const softBg = themeColor === 'orange' ? '#fff7ed' : '#f0f9ff';
    const borderCol = themeColor === 'orange' ? '#fed7aa' : '#bae6fd';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="960" height="600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="${softBg}"/>
        </linearGradient>
      </defs>
      <rect width="960" height="600" fill="url(#bg)"/>
      <rect x="28" y="28" width="904" height="544" rx="20" fill="#ffffff" stroke="${borderCol}" stroke-width="2.5" stroke-dasharray="10 6"/>
      
      <!-- Header giả lập giao diện tài liệu / bài post -->
      <rect x="64" y="64" width="832" height="56" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
      <circle cx="96" cy="92" r="8" fill="#f97316"/>
      <circle cx="122" cy="92" r="8" fill="#0284c7"/>
      <circle cx="148" cy="92" r="8" fill="#cbd5e1"/>
      <text x="180" y="98" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#334155">${tag}</text>
      <rect x="720" y="76" width="156" height="32" rx="16" fill="${softBg}"/>
      <text x="798" y="97" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="${primary}">VM STYLE • 2024–2025</text>

      <!-- Khung minh họa nội dung -->
      <rect x="64" y="144" width="380" height="270" rx="14" fill="${softBg}" stroke="${borderCol}"/>
      <path d="M214 250 L254 210 L294 250 M254 210 L254 300" stroke="${primary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="190" y="315" width="128" height="8" rx="4" fill="${primary}" opacity="0.4"/>

      <!-- Các dòng mô phỏng dữ liệu / kế hoạch / báo cáo -->
      <rect x="476" y="152" width="180" height="24" rx="6" fill="${softBg}"/>
      <text x="488" y="169" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="${primary}">THAY ẢNH TẠI ĐÂY</text>
      
      <text x="476" y="216" font-family="Plus Jakarta Sans, sans-serif" font-size="26" font-weight="800" fill="#0f172a">${title}</text>
      <text x="476" y="252" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="500" fill="#475569">${subtitle}</text>

      <rect x="476" y="284" width="390" height="12" rx="6" fill="#e2e8f0"/>
      <rect x="476" y="310" width="320" height="12" rx="6" fill="#e2e8f0"/>
      <rect x="476" y="336" width="350" height="12" rx="6" fill="#f1f5f9"/>

      <!-- Chỉ số minh họa bên dưới -->
      <rect x="476" y="368" width="120" height="46" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="536" y="396" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="#0f172a">100% Real Data</text>

      <rect x="610" y="368" width="140" height="46" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="680" y="396" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${primary}">Click phóng to</text>

      <!-- Thanh chú thích chân ảnh -->
      <rect x="64" y="446" width="832" height="88" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="480" y="484" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="${primary}">📌 PLACEHOLDER HÌNH ẢNH — THAY ẢNH THẬT CỦA BẠN TẠI ĐÂY</text>
      <text x="480" y="512" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" fill="#64748b">Đổi đường dẫn ảnh trong file: assets/js/experience-vmstyle.js (Hỗ trợ JPG, PNG, WebP)</text>
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /**
   * Tạo Logo Placeholder cho thương hiệu thời trang VM Style
   */
  function createLogoPlaceholderSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
      <rect width="320" height="220" rx="16" fill="#ffffff"/>
      <rect x="16" y="16" width="288" height="188" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="160" y="98" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="800" letter-spacing="4" fill="#0f172a">VM STYLE</text>
      <line x1="95" y1="114" x2="225" y2="114" stroke="#0284c7" stroke-width="2.5"/>
      <text x="160" y="138" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#0284c7">FASHION &amp; LIFESTYLE</text>
      <text x="160" y="176" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#94a3b8">[ Thay Logo tại đây ]</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /* ==========================================================================
     1. OBJECT DỮ LIỆU TRUNG TÂM (CHỈ CẦN SỬA NỘI DUNG & LINK ẢNH Ở ĐÂY)
     ========================================================================== */
  const VM_STYLE_DATA = {
    // --- PHẦN 1: THÔNG TIN CHUNG ---
    company: {
      logoUrl: createLogoPlaceholderSVG(), // Đổi thành: 'assets/images/logo-vmstyle.png'
      logoAlt: 'Logo thương hiệu thời trang VM Style',
      brandName: 'VM Style',
      industry: 'Thời trang',
      period: '2024 – 2025',
      role: 'Content Marketing Executive',
      summary:
        'Phụ trách chiến lược và sản xuất nội dung đa kênh cho thương hiệu thời trang trẻ VM Style. Kết hợp ngôn từ bắt nhịp xu hướng (trend-catching), hình ảnh Lookbook thẩm mỹ và tư duy tối ưu theo dữ liệu để gia tăng nhận diện thương hiệu lẫn tỷ lệ chuyển đổi đơn hàng.'
    },

    // --- PHẦN 2: NỘI DUNG TỔNG QUAN (3 CỘT) ---
    overview: {
      // Cột 1: Phụ trách
      responsibilities: {
        title: 'Phụ trách',
        subtitle: 'Vai trò & phạm vi công việc',
        items: [
          'Quản trị & sáng tạo nội dung trên hệ thống Social Media chính (Facebook Fanpage & Instagram).',
          'Xây dựng Content Plan định kỳ hằng tháng và kế hoạch truyền thông tổng thể cho các đợt ra mắt BST mới.',
          'Phối hợp cùng đội ngũ Media/Design thực hiện chụp Lookbook, quay Reels phối đồ (Mix & Match) và kiểm duyệt ấn phẩm.',
          'Theo dõi chỉ số (Reach, Engagement, Inbox, Conversion) và lập báo cáo đo lường định kỳ.'
        ]
      },
      // Cột 2: Đã làm như thế nào
      execution: {
        title: 'Đã làm như thế nào',
        subtitle: 'Cách triển khai & quy trình',
        items: [
          'Nghiên cứu xu hướng thời trang & tâm lý mua sắm của tệp khách hàng nữ trẻ (18–28 tuổi) theo từng mùa vụ.',
          'Chuẩn hóa tuyến bài theo phễu: Bắt trend thu hút tương tác → Gợi ý OOTD/Lookbook → Thúc đẩy ưu đãi chốt đơn.',
          'Ứng dụng công thức Hook 3s đầu cho Reels và cấu trúc caption kích thích bình luận/nhắn tin tư vấn size.',
          'Đọc dữ liệu Meta Business Suite hàng tuần để nhân rộng định dạng bài viết có hiệu suất cao nhất.'
        ]
      },
      // Cột 3: Số lượng đã làm (Counter nổi bật)
      deliverables: {
        title: 'Số lượng đã làm',
        subtitle: 'Kết quả & đầu việc cụ thể',
        stats: [
          {
            value: 360,
            suffix: '+',
            label: 'Bài viết & Reels trên Facebook, Instagram',
            isAccent: false
          },
          {
            value: 12,
            suffix: '+',
            label: 'Kế hoạch Content tháng & Chiến dịch BST',
            isAccent: true
          },
          {
            value: 24,
            suffix: '+',
            label: 'Báo cáo đo lường & tối ưu hiệu suất kênh',
            isAccent: false
          },
          {
            value: 65,
            suffix: '%',
            prefix: '+',
            label: 'Tăng trưởng lượng tương tác & tin nhắn tự nhiên',
            isAccent: true
          }
        ]
      }
    },

    // --- PHẦN 3: HẠNG MỤC CÔNG VIỆC (3 NHÓM & CÁC MỤC CON KÈM ẢNH) ---
    categories: [
      {
        id: 'social-media',
        tabTitle: '1. Social Media',
        description: 'Sáng tạo nội dung thu hút tương tác, xây dựng hình ảnh thương hiệu thời trang trẻ trung và thúc đẩy inbox mua hàng.',
        subcategories: [
          {
            id: 'sm-facebook',
            name: 'Facebook',
            badge: 'FB',
            summary: 'Tuyến bài giới thiệu sản phẩm mới, gợi ý phối đồ ứng dụng hằng ngày, minigame và bài viết chuyển đổi đơn hàng.',
            images: [
              {
                src: createPlaceholderSVG('Bài viết Lookbook Sản Phẩm Mới', 'Caption kể chuyện & gợi ý phối đồ dạo phố thu hút bình luận hỏi giá', 'SOCIAL MEDIA • FACEBOOK', 'blue'),
                alt: 'Minh họa bài viết Facebook Lookbook thời trang VM Style',
                caption: 'Tuyến bài ra mắt sản phẩm mới kèm gợi ý Mix & Match tăng tỷ lệ khách nhắn tin hỏi mua.'
              },
              {
                src: createPlaceholderSVG('Bài viết Bắt Trend & Tương Tác', 'Nội dung đồng cảm tâm lý chọn đồ của phái nữ, kéo tương tác tự nhiên', 'SOCIAL MEDIA • FACEBOOK', 'blue'),
                alt: 'Minh họa bài đăng Facebook bắt trend thời trang VM Style',
                caption: 'Bài đăng bắt trend thời trang kết hợp câu hỏi mở giúp tăng lượt chia sẻ và bình luận tự nhiên.'
              },
              {
                src: createPlaceholderSVG('Bài viết Chương Trình Ưu Đãi / Sale', 'Cấu trúc copywriting nhấn mạnh ưu đãi giới hạn và kêu gọi hành động rõ ràng', 'SOCIAL MEDIA • FACEBOOK', 'orange'),
                alt: 'Minh họa bài viết Facebook khuyến mãi chốt đơn VM Style',
                caption: 'Bài viết truyền thông chiến dịch Flash Sale cuối tuần tối ưu tỷ lệ click vào album ảnh.'
              }
            ]
          },
          {
            id: 'sm-instagram',
            name: 'Instagram',
            badge: 'IG',
            summary: 'Chăm sóc bố cục lưới ảnh (Feed Aesthetic), kịch bản корот Reels biến hình OOTD và chuỗi Story tương tác mỗi ngày.',
            images: [
              {
                src: createPlaceholderSVG('Bố cục Feed Instagram Đồng Bộ', 'Quy hoạch tone màu trang nhã, tôn dáng trang phục và thẩm mỹ thương hiệu', 'SOCIAL MEDIA • INSTAGRAM', 'orange'),
                alt: 'Minh họa giao diện lưới ảnh Feed Instagram VM Style',
                caption: 'Quy hoạch lưới ảnh Instagram Feed đồng nhất tone màu theo từng Concept bộ sưu tập.'
              },
              {
                src: createPlaceholderSVG('Reels Phối Đồ (OOTD / Mix & Match)', 'Kịch bản video ngắn 15–30s: 1 chân váy phối 3 phong cách đi làm, đi chơi', 'SOCIAL MEDIA • INSTAGRAM', 'blue'),
                alt: 'Minh họa video Instagram Reels phối đồ thời trang VM Style',
                caption: 'Series Reels "1 Item – 3 Cách Phối" giữ chân người xem và thu hút lượt lưu bài viết (Saves).'
              },
              {
                src: createPlaceholderSVG('Chuỗi Instagram Story Tương Tác', 'Sử dụng Poll, Q&A và gắn Sticker sản phẩm điều hướng khách về tin nhắn', 'SOCIAL MEDIA • INSTAGRAM', 'orange'),
                alt: 'Minh họa chuỗi Story Instagram tương tác khách hàng VM Style',
                caption: 'Chuỗi Story tương tác bình chọn mẫu đồ yêu thích kết hợp điều hướng tư vấn trực tiếp.'
              }
            ]
          }
        ]
      },
      {
        id: 'content-plan',
        tabTitle: '2. Content Plan',
        description: 'Hoạch định kế hoạch nội dung bài bản theo tháng và theo chiến dịch, đảm bảo đúng tiến độ sản xuất và mục tiêu doanh số.',
        subcategories: [
          {
            id: 'cp-monthly',
            name: 'Định kỳ hằng tháng',
            badge: 'PLAN',
            summary: 'Phân bổ tỷ lệ tuyến bài (Pillar), lịch đăng bài chi tiết theo ngày/tuần và định hướng hình ảnh cho đội ngũ sản xuất.',
            images: [
              {
                src: createPlaceholderSVG('Ma Trận Content Pillar Hằng Tháng', 'Phân bổ tỷ lệ: 40% Sản phẩm/Lookbook - 30% Phối đồ/Tips - 20% Trend - 10% Sale', 'CONTENT PLAN • ĐỊNH KỲ THÁNG', 'blue'),
                alt: 'Bảng phân bổ Content Pillar định kỳ hằng tháng tại VM Style',
                caption: 'Bảng quy hoạch tỷ lệ các nhóm nội dung (Content Pillar) bám sát mục tiêu kinh doanh từng tháng.'
              },
              {
                src: createPlaceholderSVG('Lịch Đăng Bài Chi Tiết (Content Calendar)', 'Quản lý trạng thái bài viết, deadline hình ảnh, khung giờ vàng và kênh đăng tải', 'CONTENT PLAN • ĐỊNH KỲ THÁNG', 'blue'),
                alt: 'Bảng lịch đăng bài Content Calendar hằng tháng của VM Style',
                caption: 'Content Calendar chi tiết theo từng tuần: chủ đề, định dạng (Ảnh/Reels), thông điệp chính và tiến độ.'
              },
              {
                src: createPlaceholderSVG('Brief Hình Ảnh & Kịch Bản Quay Chụp', 'Tài liệu định hướng góc máy, moodboard trang phục và kịch bản chi tiết cho Media', 'CONTENT PLAN • ĐỊNH KỲ THÁNG', 'orange'),
                alt: 'Tài liệu Brief chụp ảnh và quay dựng nội dung tháng VM Style',
                caption: 'Bảng Brief ý tưởng hình ảnh và kịch bản chi tiết giúp buổi chụp thực tế diễn ra nhanh gọn.'
              }
            ]
          },
          {
            id: 'cp-collection',
            name: 'Chiến dịch ra mắt BST (Bộ sưu tập)',
            badge: 'BST',
            summary: 'Xây dựng Big Idea, câu chuyện chủ đạo (Concept Storytelling) và lộ trình truyền thông 3 giai đoạn: Teasing – Launching – Sustaining.',
            images: [
              {
                src: createPlaceholderSVG('Master Plan Ra Mắt Bộ Sưu Tập Mới', 'Lộ trình 3 giai đoạn: Gợi mở tò mò (Teasing) → Bùng nổ (Launch) → Duy trì nhiệt (Sustain)', 'CONTENT PLAN • CHIẾN DỊCH BST', 'orange'),
                alt: 'Kế hoạch tổng thể Master Plan ra mắt Bộ sưu tập thời trang VM Style',
                caption: 'Kế hoạch truyền thông tổng thể 3 giai đoạn cho chiến dịch ra mắt Bộ sưu tập theo mùa.'
              },
              {
                src: createPlaceholderSVG('Moodboard & Concept Storytelling BST', 'Định hình thông điệp chủ đạo, bảng màu cảm hứng và giọng văn xuyên suốt chiến dịch', 'CONTENT PLAN • CHIẾN DỊCH BST', 'blue'),
                alt: 'Moodboard và Concept câu chuyện bộ sưu tập thời trang VM Style',
                caption: 'Xây dựng Concept & câu chuyện truyền cảm hứng cho BST, kết nối cảm xúc với khách hàng mục tiêu.'
              },
              {
                src: createPlaceholderSVG('Checklist Đa Kênh Phối Hợp Ra Mắt BST', 'Đồng bộ nội dung từ Fanpage, Instagram, Website đến ấn phẩm trưng bày tại cửa hàng', 'CONTENT PLAN • CHIẾN DỊCH BST', 'orange'),
                alt: 'Bảng phân bổ điểm chạm đa kênh trong chiến dịch ra mắt BST VM Style',
                caption: 'Kế hoạch đồng bộ thông điệp và hình ảnh BST trên toàn bộ các điểm chạm trực tuyến.'
              }
            ]
          }
        ]
      },
      {
        id: 'analytics-report',
        tabTitle: '3. Báo cáo đo lường',
        description: 'Theo dõi sát sao số liệu thực tế trên từng nền tảng để đánh giá hiệu quả nội dung và đề xuất phương án tối ưu.',
        subcategories: [
          {
            id: 'rp-facebook',
            name: 'Facebook',
            badge: 'FB',
            summary: 'Đo lường lượt tiếp cận (Reach), tương tác (Engagement), tin nhắn mới (Messaging) và phân tích nhóm bài viết mang lại chuyển đổi cao.',
            images: [
              {
                src: createPlaceholderSVG('Báo Cáo Tăng Trưởng Reach & Engagement FB', 'Tổng hợp chỉ số tiếp cận tự nhiên, lượt tương tác và tốc độ tăng trưởng Fanpage', 'BÁO CÁO ĐO LƯỜNG • FACEBOOK', 'blue'),
                alt: 'Báo cáo đo lường chỉ số Reach và Engagement kênh Facebook VM Style',
                caption: 'Báo cáo tổng hợp lượng tiếp cận (Reach) và tỷ lệ tương tác (ER) kênh Facebook theo tháng.'
              },
              {
                src: createPlaceholderSVG('Phân Tích Top Bài Viết Hiệu Quả Nhất', 'Đánh giá lý do thành công của các bài post đạt tương tác và lượng inbox vượt trội', 'BÁO CÁO ĐO LƯỜNG • FACEBOOK', 'orange'),
                alt: 'Bảng phân tích các bài viết Facebook hiệu quả cao nhất tại VM Style',
                caption: 'Thống kê Top bài viết có lượng bình luận và tin nhắn hỏi mua cao nhất để nhân rộng công thức.'
              },
              {
                src: createPlaceholderSVG('Đánh Giá Chuyển Đổi Tin Nhắn & Đề Xuất', 'Theo dõi tỷ lệ khách nhắn tin từ bài viết tự nhiên và đề xuất tối ưu nội dung tháng tới', 'BÁO CÁO ĐO LƯỜNG • FACEBOOK', 'blue'),
                alt: 'Báo cáo tỷ lệ tin nhắn và đề xuất tối ưu nội dung Facebook VM Style',
                caption: 'Báo cáo hiệu quả thu hút khách hàng tiềm năng qua tin nhắn và kế hoạch cải thiện nội dung.'
              }
            ]
          },
          {
            id: 'rp-instagram',
            name: 'Instagram',
            badge: 'IG',
            summary: 'Phân tích lượt xem Reels, lượt lưu bài viết (Saves), lượt chia sẻ (Shares), lượng truy cập hồ sơ (Profile Visits) và tăng trưởng Follower.',
            images: [
              {
                src: createPlaceholderSVG('Báo Cáo Hiệu Suất Instagram Insights', 'Theo dõi Accounts Reached, Profile Visits và tốc độ tăng trưởng người theo dõi thật', 'BÁO CÁO ĐO LƯỜNG • INSTAGRAM', 'orange'),
                alt: 'Báo cáo tổng quan Instagram Insights của thương hiệu VM Style',
                caption: 'Báo cáo tăng trưởng lượng tài khoản tiếp cận và lượt ghé thăm trang cá nhân (Profile Visits).'
              },
              {
                src: createPlaceholderSVG('Phân Tích Chỉ Số Reels & Lượt Lưu (Saves)', 'Đo lường thời lượng xem trung bình, lượt Save và Share của các video phối đồ', 'BÁO CÁO ĐO LƯỜNG • INSTAGRAM', 'blue'),
                alt: 'Báo cáo hiệu quả video Instagram Reels và lượt lưu bài viết VM Style',
                caption: 'Đánh giá hiệu suất chuỗi video Reels qua chỉ số lượt xem, lượt lưu (Saves) và chia sẻ.'
              },
              {
                src: createPlaceholderSVG('Nhân Khẩu Học & Khung Giờ Hoạt Động', 'Phân tích độ tuổi, khu vực và khung giờ online của Follower để tối ưu lịch đăng', 'BÁO CÁO ĐO LƯỜNG • INSTAGRAM', 'orange'),
                alt: 'Báo cáo phân tích tệp người theo dõi và khung giờ đăng bài Instagram VM Style',
                caption: 'Phân tích hành vi và khung giờ hoạt động của tệp khách hàng trên Instagram để tối ưu giờ đăng.'
              }
            ]
          }
        ]
      }
    ]
  };

  /* ==========================================================================
     2. HÀM RENDER GIAO DIỆN TỪ DỮ LIỆU JS
     ========================================================================== */
  function renderVMStyleExperience() {
    const root = document.getElementById('vm-experience-mount');
    if (!root) return;

    const { company, overview, categories } = VM_STYLE_DATA;

    // Danh sách phẳng tất cả ảnh để phục vụ điều hướng Lightbox (Trước / Sau)
    const lightboxItems = [];

    // Tạo HTML cho 3 Tab nút bấm
    const tabsNavHTML = categories
      .map((cat, idx) => {
        const totalImgs = cat.subcategories.reduce((acc, sub) => acc + sub.images.length, 0);
        return `
          <button
            type="button"
            class="vm-tab-btn ${idx === 0 ? 'active' : ''}"
            role="tab"
            aria-selected="${idx === 0 ? 'true' : 'false'}"
            aria-controls="vm-panel-${cat.id}"
            id="vm-tab-${cat.id}"
            data-tab-target="${cat.id}"
          >
            <span>${cat.tabTitle}</span>
            <span class="vm-tab-count">${totalImgs} ảnh</span>
          </button>
        `;
      })
      .join('');

    // Tạo HTML cho từng Tab Panel và các mục con bên trong
    const tabsPanelsHTML = categories
      .map((cat, idx) => {
        const subcatsHTML = cat.subcategories
          .map((sub) => {
            const galleryHTML = sub.images
              .map((img) => {
                const lbIndex = lightboxItems.length;
                lightboxItems.push({
                  src: img.src,
                  alt: img.alt,
                  caption: img.caption,
                  groupTitle: `${cat.tabTitle.replace(/^\d+\.\s*/, '')} — ${sub.name}`
                });

                return `
                  <figure class="vm-gallery-item">
                    <button
                      type="button"
                      class="vm-img-trigger"
                      data-lb-index="${lbIndex}"
                      aria-label="Phóng to ảnh: ${img.caption}"
                    >
                      <img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async">
                      <span class="vm-img-overlay" aria-hidden="true">
                        <span class="vm-zoom-pill">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                          </svg>
                          Phóng to xem chi tiết
                        </span>
                      </span>
                    </button>
                    <figcaption class="vm-img-caption">
                      <span>${img.caption}</span>
                    </figcaption>
                  </figure>
                `;
              })
              .join('');

            return `
              <div class="vm-subcat-block">
                <div class="vm-subcat-header">
                  <div class="vm-subcat-title-wrap">
                    <span class="vm-subcat-badge">${sub.badge}</span>
                    <div>
                      <h4 class="vm-subcat-title">${sub.name}</h4>
                      <p class="vm-subcat-desc">${sub.summary}</p>
                    </div>
                  </div>
                  <span class="vm-subcat-hint">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Click vào ảnh để phóng to
                  </span>
                </div>

                <div class="vm-gallery-grid">
                  ${galleryHTML}
                </div>
              </div>
            `;
          })
          .join('');

        return `
          <div
            class="vm-tab-panel ${idx === 0 ? 'active' : ''}"
            id="vm-panel-${cat.id}"
            role="tabpanel"
            aria-labelledby="vm-tab-${cat.id}"
            data-tab-panel="${cat.id}"
          >
            ${subcatsHTML}
          </div>
        `;
      })
      .join('');

    // Render toàn bộ cấu trúc 3 phần theo đúng thứ tự yêu cầu
    root.innerHTML = `
      <!-- ==================== 1. THÔNG TIN CHUNG (Brand Header Card) ==================== -->
      <article class="vm-brand-card vm-reveal" aria-label="Thông tin chung công ty VM Style">
        <div class="vm-logo-box">
          <img
            src="${company.logoUrl}"
            alt="${company.logoAlt}"
            class="vm-logo-img"
            loading="lazy"
          >
          <span class="vm-logo-note">Logo thương hiệu</span>
        </div>

        <div class="vm-brand-info">
          <div class="vm-brand-top">
            <h3 class="vm-brand-name">${company.brandName}</h3>
            <div class="vm-brand-badges">
              <span class="vm-pill vm-pill-blue">Lĩnh vực: ${company.industry}</span>
              <span class="vm-pill vm-pill-orange">${company.period}</span>
            </div>
          </div>

          <p class="vm-brand-summary">${company.summary}</p>

          <div class="vm-meta-grid">
            <div class="vm-meta-item">
              <span class="vm-meta-label">Tên thương hiệu</span>
              <span class="vm-meta-value">${company.brandName}</span>
            </div>
            <div class="vm-meta-item">
              <span class="vm-meta-label">Lĩnh vực kinh doanh</span>
              <span class="vm-meta-value">${company.industry}</span>
            </div>
            <div class="vm-meta-item">
              <span class="vm-meta-label">Thời gian làm việc</span>
              <span class="vm-meta-value">${company.period}</span>
            </div>
            <div class="vm-meta-item">
              <span class="vm-meta-label">Vị trí đảm nhiệm</span>
              <span class="vm-meta-value highlight">${company.role}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ==================== 2. NỘI DUNG TỔNG QUAN (3 Mini-Cards) ==================== -->
      <div class="vm-overview-grid" aria-label="Nội dung tổng quan công việc tại VM Style">
        <!-- Cột 1: Phụ trách -->
        <article class="vm-overview-card vm-reveal">
          <div class="vm-overview-head">
            <div class="vm-overview-icon" aria-hidden="true">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h3 class="vm-overview-title">${overview.responsibilities.title}</h3>
              <span class="vm-overview-sub">${overview.responsibilities.subtitle}</span>
            </div>
          </div>
          <ul class="vm-overview-list">
            ${overview.responsibilities.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </article>

        <!-- Cột 2: Đã làm như thế nào -->
        <article class="vm-overview-card vm-reveal">
          <div class="vm-overview-head">
            <div class="vm-overview-icon" aria-hidden="true">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="vm-overview-title">${overview.execution.title}</h3>
              <span class="vm-overview-sub">${overview.execution.subtitle}</span>
            </div>
          </div>
          <ul class="vm-overview-list">
            ${overview.execution.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </article>

        <!-- Cột 3: Số lượng đã làm (Counter nổi bật) -->
        <article class="vm-overview-card vm-reveal" id="vm-stats-counter-card">
          <div class="vm-overview-head">
            <div class="vm-overview-icon" aria-hidden="true">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <h3 class="vm-overview-title">${overview.deliverables.title}</h3>
              <span class="vm-overview-sub">${overview.deliverables.subtitle}</span>
            </div>
          </div>

          <div class="vm-stats-grid">
            ${overview.deliverables.stats
              .map(
                (st) => `
              <div class="vm-stat-box ${st.isAccent ? 'accent' : ''}">
                <strong
                  class="vm-stat-number"
                  data-target="${st.value}"
                  data-prefix="${st.prefix || ''}"
                  data-suffix="${st.suffix || ''}"
                >${st.prefix || ''}${st.value}${st.suffix || ''}</strong>
                <span class="vm-stat-label">${st.label}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </article>
      </div>

      <!-- ==================== 3. HẠNG MỤC CÔNG VIỆC (Tabs & Gallery) ==================== -->
      <div class="vm-work-wrapper vm-reveal">
        <div class="vm-work-top">
          <div class="vm-work-heading">
            <h3>Hạng mục công việc &amp; Minh chứng thực tế</h3>
            <p>Chuyển đổi giữa các tab bên dưới và nhấp vào từng hình ảnh để phóng to xem chi tiết kế hoạch, bài đăng hoặc báo cáo.</p>
          </div>

          <div class="vm-tabs-nav" role="tablist" aria-label="Các nhóm hạng mục công việc tại VM Style">
            ${tabsNavHTML}
          </div>
        </div>

        <div class="vm-tabs-content">
          ${tabsPanelsHTML}
        </div>
      </div>
    `;

    // Khởi tạo tương tác Tabs, Hiệu ứng cuộn, Counter và Lightbox
    initTabs(root);
    initScrollRevealAndCounters(root);
    initLightbox(root, lightboxItems);
  }

  /* ==========================================================================
     3. LOGIC CHUYỂN TAB HẠNG MỤC CÔNG VIỆC
     ========================================================================== */
  function initTabs(root) {
    const tabBtns = Array.from(root.querySelectorAll('.vm-tab-btn'));
    const tabPanels = Array.from(root.querySelectorAll('.vm-tab-panel'));

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');

        tabBtns.forEach((b) => {
          const isCurrent = b === btn;
          b.classList.toggle('active', isCurrent);
          b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        });

        tabPanels.forEach((panel) => {
          const isMatch = panel.getAttribute('data-tab-panel') === targetId;
          panel.classList.toggle('active', isMatch);
        });
      });
    });
  }

  /* ==========================================================================
     4. LOGIC FADE-IN KHI CUỘN & CHẠY SỐ COUNTER
     ========================================================================== */
  function initScrollRevealAndCounters(root) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(root.querySelectorAll('.vm-reveal'));
    let countersRan = false;

    function animateCounters() {
      if (countersRan) return;
      countersRan = true;

      const numEls = Array.from(root.querySelectorAll('.vm-stat-number'));
      numEls.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (prefersReducedMotion) {
          el.textContent = `${prefix}${target}${suffix}`;
          return;
        }

        const duration = 1400;
        const startTime = performance.now();

        function updateTick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(target * eased);
          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateTick);
          }
        }

        requestAnimationFrame(updateTick);
      });
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      animateCounters();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.id === 'vm-stats-counter-card') {
              animateCounters();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ==========================================================================
     5. LOGIC LIGHTBOX PHÓNG TO ẢNH (HỖ TRỢ ZOOM ĐỌC BÁO CÁO & CONTENT PLAN)
     ========================================================================== */
  function initLightbox(root, items) {
    let lightboxEl = document.getElementById('vm-lightbox-modal');
    if (!lightboxEl) {
      lightboxEl = document.createElement('div');
      lightboxEl.id = 'vm-lightbox-modal';
      lightboxEl.className = 'vm-lightbox';
      lightboxEl.setAttribute('role', 'dialog');
      lightboxEl.setAttribute('aria-modal', 'true');
      lightboxEl.setAttribute('aria-hidden', 'true');
      lightboxEl.setAttribute('aria-label', 'Trình xem ảnh chi tiết');

      lightboxEl.innerHTML = `
        <div class="vm-lightbox-top">
          <div class="vm-lightbox-meta">
            <span class="vm-lightbox-counter" id="vm-lb-counter">1 / 1</span>
            <span id="vm-lb-group">Hạng mục</span>
          </div>
          <div class="vm-lightbox-actions">
            <button type="button" class="vm-lb-btn" id="vm-lb-zoom" aria-label="Phóng to hoặc thu nhỏ ảnh">
              🔍 Phóng to (1.5x)
            </button>
            <button type="button" class="vm-lb-btn vm-lb-close" id="vm-lb-close" aria-label="Đóng khung xem ảnh">
              ✕ Đóng (Esc)
            </button>
          </div>
        </div>

        <div class="vm-lightbox-stage" id="vm-lb-stage">
          <button type="button" class="vm-lb-nav vm-lb-prev" id="vm-lb-prev" aria-label="Ảnh trước">
            ←
          </button>
          <div class="vm-lightbox-img-wrap" id="vm-lb-img-wrap">
            <img src="" alt="" class="vm-lightbox-img" id="vm-lb-img">
          </div>
          <button type="button" class="vm-lb-nav vm-lb-next" id="vm-lb-next" aria-label="Ảnh tiếp theo">
            →
          </button>
        </div>

        <div class="vm-lightbox-bottom" id="vm-lb-caption"></div>
      `;
      document.body.appendChild(lightboxEl);
    }

    const imgEl = document.getElementById('vm-lb-img');
    const imgWrap = document.getElementById('vm-lb-img-wrap');
    const captionEl = document.getElementById('vm-lb-caption');
    const counterEl = document.getElementById('vm-lb-counter');
    const groupEl = document.getElementById('vm-lb-group');
    const zoomBtn = document.getElementById('vm-lb-zoom');
    const closeBtn = document.getElementById('vm-lb-close');
    const prevBtn = document.getElementById('vm-lb-prev');
    const nextBtn = document.getElementById('vm-lb-next');
    const stageEl = document.getElementById('vm-lb-stage');

    let currentIndex = 0;
    let isZoomed = false;

    function setZoom(state) {
      isZoomed = state;
      imgWrap.classList.toggle('is-zoomed', isZoomed);
      zoomBtn.textContent = isZoomed ? '🔍 Thu nhỏ (1x)' : '🔍 Phóng to (1.5x)';
    }

    function showImage(index) {
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];

      setZoom(false);
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      captionEl.textContent = item.caption;
      counterEl.textContent = `${currentIndex + 1} / ${items.length}`;
      groupEl.textContent = item.groupTitle;
    }

    function openLightbox(index) {
      showImage(index);
      lightboxEl.classList.add('is-open');
      lightboxEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxEl.classList.remove('is-open');
      lightboxEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setZoom(false);
    }

    // Gắn sự kiện mở Lightbox cho tất cả ảnh trong Section
    root.addEventListener('click', (e) => {
      const trigger = e.target.closest('.vm-img-trigger');
      if (!trigger) return;
      const idx = parseInt(trigger.getAttribute('data-lb-index') || '0', 10);
      openLightbox(idx);
    });

    closeBtn.addEventListener('click', closeLightbox);
    zoomBtn.addEventListener('click', () => setZoom(!isZoomed));
    imgEl.addEventListener('click', () => setZoom(!isZoomed));
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    // Click ra vùng nền tối để đóng
    stageEl.addEventListener('click', (e) => {
      if (e.target === stageEl || e.target === imgWrap) {
        closeLightbox();
      }
    });

    // Hỗ trợ bàn phím: Esc đóng, mũi tên Trái/Phải chuyển ảnh
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  // Khởi chạy khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderVMStyleExperience);
  } else {
    renderVMStyleExperience();
  }
})();
