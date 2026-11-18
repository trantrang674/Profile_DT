/**
 * ============================================================================
 * DỮ LIỆU & LOGIC HIỂN THỊ SECTION KINH NGHIỆM LÀM VIỆC: VM STYLE
 * ----------------------------------------------------------------------------
 * HƯỚNG DẪN BẠN INPUT DỮ LIỆU BÀI VIẾT:
 * Mỗi bài viết được chia làm 2 phần rõ rệt:
 * - Phần TRÁI: Bạn input đường dẫn ảnh vào `src` (Hỗ trợ JPG, PNG, WebP)
 * - Phần PHẢI: Bạn input nội dung caption bài post vào `caption` và tiêu đề vào `title`
 *
 * Cấu trúc 1 bài chi tiết:
 * {
 *   title: 'Tiêu đề bài viết',
 *   tag: 'Facebook Post', // hoặc 'Instagram', 'Lookbook', 'Reels', 'BST'...
 *   date: 'Tháng 10/2024',
 *   src: 'assets/images/posts/bai-viet-1.jpg', // << INPUT ẢNH PHẦN TRÁI VÀO ĐÂY
 *   alt: 'Mô tả ảnh bài post',
 *   caption: `Nội dung caption bài post của bạn... (Hỗ trợ xuống dòng tự nhiên, emoji, hashtag)`, // << INPUT CAPTION PHẦN PHẢI VÀO ĐÂY
 *   metrics: [ // Tùy chọn số liệu đo lường
 *     { label: 'Tương tác', value: '+180%' }
 *   ]
 * }
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * Escape an toàn ký tự HTML
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Format caption bài post: giữ nguyên xuống dòng và khoảng cách
   */
  function formatCaptionHTML(caption) {
    if (!caption) return '';
    if (/<[a-z][\s\S]*>/i.test(caption)) {
      return caption;
    }
    return escapeHTML(caption).replace(/\n/g, '<br>');
  }

  /**
   * Hàm tạo ảnh Placeholder cho khung ảnh bài post (phần TRÁI)
   * Khi bạn có ảnh thật, chỉ cần thay đường dẫn file ảnh vào `src`.
   */
  function createPostImagePlaceholder(label, tag, themeColor) {
    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    label = esc(label);
    tag = esc(tag);
    const primary = themeColor === 'orange' ? '#ea580c' : '#0284c7';
    const softBg = themeColor === 'orange' ? '#fff7ed' : '#f0f9ff';
    const borderCol = themeColor === 'orange' ? '#fed7aa' : '#bae6fd';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 520" width="700" height="520">
      <defs>
        <linearGradient id="bg-${Math.abs(label.length + (themeColor || '').length)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="${softBg}"/>
        </linearGradient>
      </defs>
      <rect width="700" height="520" rx="16" fill="url(#bg-${Math.abs(label.length + (themeColor || '').length)})"/>
      <rect x="24" y="24" width="652" height="472" rx="12" fill="#ffffff" stroke="${borderCol}" stroke-width="2" stroke-dasharray="8 6"/>
      
      <!-- Tag kênh phía trên -->
      <rect x="44" y="44" width="170" height="32" rx="16" fill="${softBg}"/>
      <text x="129" y="65" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="${primary}">${tag || 'ẢNH BÀI POST'}</text>

      <!-- Biểu tượng máy ảnh / Lookbook -->
      <g transform="translate(350, 205)">
        <circle cx="0" cy="0" r="52" fill="${softBg}" stroke="${borderCol}" stroke-width="2"/>
        <path d="M-22 -10 L-12 -22 L12 -22 L22 -10 L26 -10 C30 -10 32 -7 32 -4 L32 22 C32 25 30 28 26 28 L-26 28 C-30 28 -32 25 -32 22 L-32 -4 C-32 -7 -30 -10 -26 -10 Z" fill="none" stroke="${primary}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="0" cy="9" r="11" fill="none" stroke="${primary}" stroke-width="3"/>
      </g>

      <!-- Tiêu đề & Hướng dẫn input ảnh -->
      <text x="350" y="300" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="800" fill="#0f172a">${label || 'Ảnh Bài Post Thực Tế'}</text>
      <text x="350" y="332" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#64748b">📌 BẠN INPUT ẢNH TẠI ĐÂY (thay giá trị src)</text>
      <text x="350" y="356" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">Hỗ trợ JPG, PNG, WebP — Tự động căn chỉnh vừa khung</text>

      <!-- Pill xem chi tiết -->
      <rect x="250" y="400" width="200" height="38" rx="19" fill="${softBg}" stroke="${borderCol}"/>
      <text x="350" y="424" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="${primary}">🔍 Bấm để phóng to xem ảnh</text>
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Giữ alias cho tương thích ngược
  const createPlaceholderSVG = createPostImagePlaceholder;

  /**
   * Tạo Logo Placeholder cho thương hiệu thời trang VM Style
   */
  function createLogoPlaceholderSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
      <rect width="320" height="220" rx="16" fill="#ffffff"/>
      <rect x="16" y="16" width="288" height="188" rx="12" fill="#f4f7fe" stroke="#c7d7fe" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="160" y="98" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="800" letter-spacing="4" fill="#070c22">VM STYLE</text>
      <line x1="95" y1="114" x2="225" y2="114" stroke="#1631c9" stroke-width="2.5"/>
      <text x="160" y="138" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#1631c9">FASHION &amp; LIFESTYLE</text>
      <text x="160" y="176" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#7281a3">[ Thay Logo tại đây ]</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /* ==========================================================================
     1. OBJECT DỮ LIỆU TRUNG TÂM (CHỈ CẦN SỬA NỘI DUNG & LINK ẢNH Ở ĐÂY)
     ========================================================================== */
  const VM_STYLE_DATA = {
    // --- PHẦN 1: THÔNG TIN CHUNG ---
    company: {
      logoUrl: 'assets/images/logo-vmstyle.jpg',
      logoAlt: 'Logo thương hiệu thời trang VM Style',
      brandName: 'VM Style',
      industry: 'Thời trang nữ',
      period: '2024 – 2025',
      role: 'Content Marketing Executive',
      summary:
        'Phụ trách chiến lược và sản xuất nội dung đa kênh cho thương hiệu thời trang nữ. Phối hợp team sản xuất hình ảnh lookbook, shooting, video. Tư duy tối ưu theo dữ liệu để gia tăng nhận diện thương hiệu lẫn tỷ lệ chuyển đổi.'
    },

    // --- PHẦN 2: NỘI DUNG TỔNG QUAN (3 CỘT) ---
    overview: {
      // Cột 1: Phụ trách
      responsibilities: {
        title: 'Phụ trách',
        subtitle: 'Vai trò & phạm vi công việc',
        items: [
          'Quản trị & sáng tạo nội dung trên hệ thống Social Media chính (Facebook & Instagram).',
          'Xây dựng Content Plan định kỳ hằng tháng và kế hoạch truyền thông tổng thể cho các đợt ra mắt BST mới.',
          'Phối hợp cùng đội ngũ Media/Design thực hiện chụp Lookbook, quay Reels phối đồ (Mix & Match).',
          'Theo dõi chỉ số và lập báo cáo đo lường định kỳ.'
        ]
      },
      // Cột 2: Đã làm như thế nào
      execution: {
        title: 'Đã làm như thế nào',
        subtitle: 'Cách triển khai & quy trình',
        items: [
          'Duy trì bài đăng hàng ngày để giữ chân người theo dõi, củng cố hình ảnh thương hiệu.',
          'Xây dựng nội dung đa dạng phù hợp ngành như: chia sẻ tips, feedback, mix & match, collection,...',
          'Nghiên cứu xu hướng thời trang & tâm lý mua sắm của tệp khách hàng nữ trẻ theo thời điểm.'
        ]
      },
      // Cột 3: Số lượng đã làm (Counter nổi bật)
      deliverables: {
        title: 'Số lượng đã làm',
        subtitle: 'Kết quả & đầu việc cụ thể',
        stats: [
          {
            value: 80,
            suffix: '+',
            label: 'Bài đăng / tháng',
            isAccent: false
          },
          {
            value: 5,
            suffix: '+',
            label: 'Kế hoạch ra mắt bộ sưu tập',
            isAccent: false
          },
          {
            value: 75,
            prefix: '↑ ',
            suffix: '%',
            label: 'Tăng lượt xem sau 4 tháng',
            isAccent: true
          }
        ]
      }
    },

    // --- PHẦN 3: HẠNG MỤC CÔNG VIỆC (MỖI BÀI CHIA 2 PHẦN: TRÁI LÀ ẢNH, PHẢI LÀ CAPTION) ---
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
            posts: [
              {
                title: 'Bài viết Lookbook Sản Phẩm Mới: "Nàng Thơ Dạo Phố"',
                tag: 'Facebook Post',
                date: 'BST Thu – Đông 2024',
                src: createPostImagePlaceholder('Lookbook BST Thu – Đông', 'FACEBOOK POST', 'blue'),
                alt: 'Minh họa bài viết Facebook Lookbook thời trang VM Style',
                caption: `🌸 GỢI Ý PHỐI ĐỒ DẠO PHỐ CUỐI TUẦN CÙNG VM STYLE
Cuối tuần này nàng đã có hẹn dạo phố cùng hội bạn thân chưa? Đừng bỏ lỡ công thức Mix & Match siêu xinh này nhé!

✨ Điểm nhấn của set đồ:
- Chất liệu linen cao cấp, thoáng mát tuyệt đối dưới nắng hè.
- Form váy chữ A tôn dáng, che khuyết điểm tinh tế.
- Tone màu pastel nhã nhặn, chụp hình góc nào cũng xinh lung linh.

👉 Nhanh tay INBOX cho VM Style để nhận ngay ưu đãi 10% và được tư vấn size chuẩn xác nhất nàng nhé!
#VMStyle #FashionLookbook #OOTD #MixAndMatch #ThoiTrangNu`,
                metrics: [
                  { label: 'Tương tác', value: '+180%' },
                  { label: 'Hỏi giá / Inbox', value: '45+ tin nhắn' }
                ]
              },
              {
                title: 'Bài viết Bắt Trend & Tương Tác: "Nỗi Niềm Chọn Đồ Mỗi Sáng"',
                tag: 'Facebook Engagement',
                date: 'Tháng 11/2024',
                src: createPostImagePlaceholder('Bài Viết Bắt Trend & Tương Tác', 'FACEBOOK POST', 'blue'),
                alt: 'Minh họa bài đăng Facebook bắt trend thời trang VM Style',
                caption: `"Tủ đồ thì chật ních nhưng mỗi sáng thức dậy vẫn thấy mình không có gì để mặc?" 🥲
Nếu nàng cũng từng đứng trước gương thở dài thì bình luận số 1 cho VM Style biết nàng không cô đơn nhé!

💡 Tip nhỏ cho nàng: Chỉ với 3 món đồ basic từ BST mới của VM Style, nàng có thể biến hóa linh hoạt thành 5 outfit thanh lịch suốt tuần mà không mất quá 3 phút chuẩn bị. Nàng thích phong cách năng động hay nữ tính? Chia sẻ cùng VM Style nha!
#VMStyle #FashionTips #OOTDCongSo #DongCamPhaiDep`,
                metrics: [
                  { label: 'Bình luận', value: '250+ comments' },
                  { label: 'Lượt chia sẻ', value: '85 shares' }
                ]
              },
              {
                title: 'Bài viết Flash Sale Cuối Tuần: "Ưu Đãi Độc Quyền Giờ Vàng"',
                tag: 'Chiến Dịch Chuyển Đổi',
                date: 'Tháng 12/2024',
                src: createPostImagePlaceholder('Chiến Dịch Flash Sale Cuối Tuần', 'FLASH SALE', 'orange'),
                alt: 'Minh họa bài viết Facebook khuyến mãi chốt đơn VM Style',
                caption: `⚡ FLASH SALE 3 NGÀY DUY NHẤT: GIẢM ĐẾN 40% TOÀN BỘ ĐẦM THIẾT KẾ!
Cơ hội săn ngay những thiết kế best-seller của VM Style với mức giá chưa từng có:

✔ Đầm xòe hoa nhí: Chỉ từ 249K (Giá gốc 420K)
✔ Áo blazer phong cách Hàn Quốc: Giảm trực tiếp 35%
✔ Tặng kèm scrunchies xinh xắn cho đơn hàng từ 499K
✔ FREESHIP toàn quốc khi mua từ 2 sản phẩm!

⏳ Số lượng có hạn theo từng size. Chương trình kết thúc lúc 23h59 Chủ Nhật. Comment dấu "." hoặc Inbox để giữ ưu đãi ngay!
#VMStyleSale #FlashSale #SaleCuoiTuan #UuDaiDocQuyen`,
                metrics: [
                  { label: 'Tỷ lệ CTR', value: '4.2%' },
                  { label: 'Đơn hàng phát sinh', value: '135+ đơn' }
                ]
              }
            ]
          },
          {
            id: 'sm-instagram',
            name: 'Instagram',
            badge: 'IG',
            summary: 'Chăm sóc bố cục lưới ảnh (Feed Aesthetic), kịch bản Reels ngắn biến hình OOTD và chuỗi Story tương tác mỗi ngày.',
            posts: [
              {
                title: 'Quy Hoạch Lưới Feed Instagram: Tone Màu Sang Trọng & Nhất Quán',
                tag: 'Instagram Feed',
                date: '2024',
                src: createPostImagePlaceholder('Bố Cục Lưới Feed Instagram', 'INSTAGRAM FEED', 'orange'),
                alt: 'Minh họa giao diện lưới ảnh Feed Instagram VM Style',
                caption: `📸 FEED AESTHETIC — NÂNG TẦM HÌNH ẢNH THƯƠNG HIỆU
Quy hoạch màu sắc và nhịp điệu bài đăng trên Instagram Feed theo tỷ lệ vàng xen kẽ: Ảnh Lookbook người mẫu - Ảnh cận chất liệu sản phẩm - Quote truyền cảm hứng thời trang.

Mục tiêu:
- Tạo ấn tượng thị giác chuyên nghiệp ngay trong 3 giây đầu tiên khi khách ghé thăm trang cá nhân.
- Tăng tỷ lệ chuyển đổi từ người lướt xem thành Follower trung thành.
#VMStyleAesthetic #InstagramFeed #FashionPalette #OOTD`,
                metrics: [
                  { label: 'Follower tăng trưởng', value: '+35%' },
                  { label: 'Lượt ghé trang', value: '12K visits/tháng' }
                ]
              },
              {
                title: 'Series Reels "1 Item – 3 Cách Phối": Kịch Bản Video Biến Hình OOTD',
                tag: 'Instagram Reels',
                date: '2024',
                src: createPostImagePlaceholder('Series Video Reels Phối Đồ', 'REELS VIDEO', 'blue'),
                alt: 'Minh họa video Instagram Reels phối đồ thời trang VM Style',
                caption: `🎬 KỊCH BẢN REELS 20S: 1 CHIẾC CHÂN VÁY — 3 PHONG CÁCH BIẾN HÓA
Chuỗi nội dung video ngắn tận dụng âm nhạc thịnh hành (Trending Audio) kết hợp hiệu ứng chuyển cảnh mượt mà:

- Look 1: Thanh lịch công sở (Mix cùng Sơ mi lụa)
- Look 2: Năng động dạo phố (Mix cùng Croptop & Sneaker)
- Look 3: Duyên dáng tiệc tối (Mix cùng Áo kiểu trễ vai)

Hiệu quả: Tối ưu thời lượng giữ chân người xem trung bình > 85%, kích thích hành vi Lưu bài viết (Saves) để tham khảo khi phối đồ.
#VMStyleReels #MixAndMatch #ReelsFashion #BienHinhOOTD`,
                metrics: [
                  { label: 'Lượt xem Reels', value: '45K+ views' },
                  { label: 'Lượt lưu (Saves)', value: '1.2K saves' }
                ]
              },
              {
                title: 'Chuỗi Story Tương Tác Hằng Ngày: Poll & Q&A Điều Hướng Mua Hàng',
                tag: 'Instagram Story',
                date: 'Hằng ngày',
                src: createPostImagePlaceholder('Chuỗi Story Tương Tác Khách Hàng', 'DAILY STORY', 'orange'),
                alt: 'Minh họa chuỗi Story Instagram tương tác khách hàng VM Style',
                caption: `📱 CHIẾN LƯỢC STORYTELLING & GIỮ CHÂN KHÁCH HÀNG MỖI NGÀY
Ứng dụng các tính năng tương tác trực tiếp của Instagram Story:

- Khung giờ 8h sáng: Cuộc bình chọn (Poll) "Nàng thích tone Be hay tone Pastel?"
- Khung giờ 12h trưa: Sticker "Hỏi đáp (Q&A)" giải đáp tư vấn size số cho khách
- Khung giờ 20h tối: Gắn Link Sticker / Direct điều hướng mua hàng kèm mã giảm giá bí mật trong Story

Kết quả: Giữ nhịp tương tác hai chiều liên tục, biến kênh Story thành nguồn kéo tin nhắn chốt đơn tự nhiên mỗi ngày.
#VMStyleStory #DailyInteraction #StorySelling`,
                metrics: [
                  { label: 'Tỷ lệ phản hồi', value: '8.4%' },
                  { label: 'Tin nhắn trực tiếp', value: '30+ DM/ngày' }
                ]
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
            posts: [
              {
                title: 'Ma Trận Content Pillar Định Kỳ: Quy Hoạch Tỷ Lệ Tuyến Bài',
                tag: 'Content Pillar',
                date: 'Kế hoạch tháng',
                src: createPostImagePlaceholder('Ma Trận Content Pillar Tháng', 'CONTENT PILLAR', 'blue'),
                alt: 'Bảng phân bổ Content Pillar định kỳ hằng tháng tại VM Style',
                caption: `📊 MA TRẬN PHÂN BỔ TUYẾN NỘI DUNG THEO MỤC TIÊU MARKETING
Xây dựng tỷ lệ cân đối giữa các nhóm bài đăng nhằm vừa giữ chân tương tác vừa đạt KPI doanh số:

- 40% Tuyến bài Sản phẩm & Lookbook: Giới thiệu mẫu mới, chất liệu, giá bán.
- 30% Tuyến bài Giá trị & Tips phối đồ: Hướng dẫn mix đồ, bảo quản trang phục, bắt trend.
- 20% Tuyến bài Tương tác & Thương hiệu: Minigame, feedback khách hàng, câu chuyện thời trang.
- 10% Tuyến bài Chuyển đổi & Khuyến mãi: Flash Sale, voucher độc quyền, ưu đãi tháng.

Giúp fanpage duy trì chất lượng bài viết ổn định, không bị cảm giác "quá thương mại" làm giảm tương tác.
#ContentPillar #ContentStrategy #MarketingMatrix`,
                metrics: [
                  { label: 'Tỷ lệ duy trì', value: '4 tuần/tháng' },
                  { label: 'Mục tiêu phủ sóng', value: '100% KPI' }
                ]
              },
              {
                title: 'Content Calendar Chi Tiết: Quản Trị Tiến Độ & Khung Giờ Đăng',
                tag: 'Content Calendar',
                date: 'Lịch đăng tuần',
                src: createPostImagePlaceholder('Lịch Đăng Bài Content Calendar', 'CONTENT CALENDAR', 'blue'),
                alt: 'Bảng lịch đăng bài Content Calendar hằng tháng của VM Style',
                caption: `📅 QUẢN TRỊ NỘI DUNG TOÀN DIỆN VỚI CONTENT CALENDAR
Bảng biểu quản lý chi tiết từ ý tưởng đến khi xuất bản:

- Cột mốc thời gian: Khung giờ vàng (11h30 trưa & 19h30 tối) tối ưu theo tệp khách hàng văn phòng và sinh viên.
- Phân loại kênh đăng tải: Fanpage Facebook, Instagram Feed, Reels, TikTok.
- Quản lý trạng thái: Draft → Đã duyệt kịch bản → Chờ ảnh chụp → Lên lịch hẹn giờ.
- Tiêu đề & Thông điệp chính: Đính kèm link bài viết và thông số theo dõi sau đăng.
#ContentCalendar #Workflow #KeHoachDangBai`,
                metrics: [
                  { label: 'Tần suất xuất bản', value: '1-2 bài/ngày' },
                  { label: 'Đúng hạn tiến độ', value: '98%' }
                ]
              },
              {
                title: 'Tài Liệu Brief Quay Chụp: Chuẩn Hóa Kịch Bản Cho Đội Ngũ Media',
                tag: 'Media Brief',
                date: 'Sản xuất hình ảnh',
                src: createPostImagePlaceholder('Brief Quay Chụp & Kịch Bản', 'MEDIA BRIEF', 'orange'),
                alt: 'Tài liệu Brief chụp ảnh và quay dựng nội dung tháng VM Style',
                caption: `📋 BẢNG BRIEF HÌNH ẢNH & KỊCH BẢN SHOOTING CHI TIẾT
Tài liệu định hướng phối hợp giữa Content Specialist và Team Media/Design:

- Moodboard & Tone màu: Phong cách ánh sáng tự nhiên, background tối giản tôn đồ.
- Danh sách trang phục (Outfit List): Thứ tự phối đồ, phụ kiện đi kèm theo từng set.
- Shot list & Góc máy: Phân cảnh toàn - trung - cận chi tiết đường kim mũi chỉ.
- Kịch bản Reels/TikTok: Lời thoại, hành động của người mẫu, nhạc nền gợi ý.

Giúp buổi quay chụp thực tế tiết kiệm 30% thời gian, đảm bảo ấn phẩm đầu ra đúng tinh thần chiến dịch.
#MediaBrief #ShootingPlan #ProductionWorkflow`,
                metrics: [
                  { label: 'Tiết kiệm thời gian', value: '30%' },
                  { label: 'Sản phẩm hoàn thành', value: '100% đúng brief' }
                ]
              }
            ]
          },
          {
            id: 'cp-collection',
            name: 'Chiến dịch ra mắt BST (Bộ sưu tập)',
            badge: 'BST',
            summary: 'Xây dựng Big Idea, câu chuyện chủ đạo (Concept Storytelling) và lộ trình truyền thông 3 giai đoạn: Teasing – Launching – Sustaining.',
            posts: [
              {
                title: 'Master Plan Ra Mắt Bộ Sưu Tập Mới: Lộ Trình Truyền Thông 3 Giai Đoạn',
                tag: 'Campaign Plan',
                date: 'Chiến dịch mùa',
                src: createPostImagePlaceholder('Master Plan Ra Mắt BST Mới', 'CAMPAIGN MASTER PLAN', 'orange'),
                alt: 'Kế hoạch tổng thể Master Plan ra mắt Bộ sưu tập thời trang VM Style',
                caption: `🚀 CHIẾN DỊCH TRUYỀN THÔNG TỔNG THỂ CHO BỘ SƯU TẬP THEO MÙA
Kế hoạch triển khai bài bản qua 3 giai đoạn chính:

1. Giai đoạn 1 - Teasing (7 ngày trước mở bán): Gợi mở sự tò mò qua hình ảnh hậu trường (Behind The Scenes), bật mí chất liệu vải và mở cổng đăng ký VIP Early Bird.
2. Giai đoạn 2 - Launching (Ngày D-Day & tuần đầu): Ra mắt chính thức Lookbook, phát hành video Fashion Film, kích hoạt Flash Offer độc quyền 48h đầu.
3. Giai đoạn 3 - Sustaining (Duy trì sau mở bán): Tuyến bài Mix & Match từ khách hàng thật, feedback người nổi tiếng (KOL/KOC), tổng hợp các mẫu bán chạy nhất.
#MasterPlan #FashionCampaign #ProductLaunch`,
                metrics: [
                  { label: 'Thời gian chiến dịch', value: '21 ngày' },
                  { label: 'KOLs hợp tác', value: '8 bạn' }
                ]
              },
              {
                title: 'Concept & Storytelling Cho BST: Kết Nối Cảm Xúc Khách Hàng',
                tag: 'Storytelling',
                date: 'Concept BST',
                src: createPostImagePlaceholder('Concept & Storytelling BST', 'STORYTELLING', 'blue'),
                alt: 'Moodboard và Concept câu chuyện bộ sưu tập thời trang VM Style',
                caption: `📖 THỔI HỒN CÂU CHUYỆN VÀO TỪNG THIẾT KẾ THỜI TRANG
Xây dựng Big Idea và thông điệp chạm đến cảm xúc của phái nữ:

- Big Idea: "Dịu Dàng Trong Từng Bước Chuyển" — Tôn vinh vẻ đẹp tự tin, mềm mại của người phụ nữ hiện đại giữa nhịp sống đô thị bận rộn.
- Giọng văn (Tone of Voice): Tinh tế, ấm áp, đồng điệu, truyền cảm hứng sống tích cực.
- Thiết kế hình ảnh: Tone màu beige - kem ấm áp, kết hợp ánh nắng ban mai nhẹ nhàng tạo cảm giác thư thái, dễ chịu.
#Storytelling #BrandVoice #ThoiTrangCamXuc`,
                metrics: [
                  { label: 'Độ lan tỏa', value: '+60%' },
                  { label: 'Cảm nhận tích cực', value: '95%' }
                ]
              },
              {
                title: 'Checklist Phối Hợp Đa Kênh: Đồng Bộ Trải Nghiệm Mua Sắm',
                tag: 'Omnichannel',
                date: 'Checklist đa kênh',
                src: createPostImagePlaceholder('Checklist Phối Hợp Đa Kênh', 'OMNICHANNEL CHECKLIST', 'orange'),
                alt: 'Bảng phân bổ điểm chạm đa kênh trong chiến dịch ra mắt BST VM Style',
                caption: `🔗 ĐỒNG BỘ THÔNG ĐIỆP XUYÊN SUỐT CÁC ĐIỂM CHẠM KHÁCH HÀNG
Đảm bảo khách hàng nhận được thông điệp nhất quán trên mọi phương tiện:

- Kênh Social: Đổi Avatar/Cover đồng bộ, phát hành tuyến bài theo lịch đã duyệt.
- Kênh Website/Landing Page: Banner trang chủ, danh mục riêng cho BST, gắn nhãn NEW ARRIVAL.
- Kênh Chatbot/Inbox: Kịch bản trả lời tự động gửi ảnh Lookbook và bảng size chỉ trong 3 giây.
- Kênh Offline (Tại hệ thống cửa hàng): Standee, bảng giá và ấn phẩm truyền thông đồng nhất hình ảnh.
#Omnichannel #CustomerJourney #MarketingChecklist`,
                metrics: [
                  { label: 'Điểm chạm đồng bộ', value: '100%' },
                  { label: 'Tốc độ phản hồi bot', value: '< 3s' }
                ]
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
            posts: [
              {
                title: 'Báo Cáo Tăng Trưởng Reach & Engagement: Phân Tích Hiệu Suất Fanpage',
                tag: 'Báo Cáo Facebook',
                date: 'Báo cáo tháng',
                src: createPostImagePlaceholder('Báo Cáo Tăng Trưởng Reach & ER', 'FACEBOOK REPORT', 'blue'),
                alt: 'Báo cáo đo lường chỉ số Reach và Engagement kênh Facebook VM Style',
                caption: `📈 ĐO LƯỜNG TĂNG TRƯỞNG LƯỢNG TIẾP CẬN TỰ NHIÊN (ORGANIC REACH)
Theo dõi và đánh giá hiệu quả của các tuyến nội dung trên Fanpage:

- Lượng tài khoản tiếp cận (Reach): Đạt hơn 180.000 lượt/tháng, trong đó tỷ lệ tiếp cận tự nhiên không trả phí chiếm 65%.
- Tỷ lệ tương tác trung bình (ER): Đạt 5.8%, vượt mức trung bình ngành thời trang nữ (3.5% - 4.2%).
- Nhóm nội dung dẫn đầu tương tác: Tuyến bài Tips phối đồ và Reels biến hình mang lại lượng tương tác thảo luận cao nhất.
#AnalyticsReport #OrganicReach #EngagementRate #DataDriven`,
                metrics: [
                  { label: 'Lượt tiếp cận/tháng', value: '180K+ Reach' },
                  { label: 'Tỷ lệ tương tác (ER)', value: '5.8%' }
                ]
              },
              {
                title: 'Phân Tích Top Bài Viết Hiệu Quả Nhất: Đúc Kết Công Thức Thành Công',
                tag: 'Báo Cáo Nội Dung',
                date: 'Báo cáo định kỳ',
                src: createPostImagePlaceholder('Phân Tích Top Bài Viết Hiệu Quả', 'TOP POST ANALYSIS', 'orange'),
                alt: 'Bảng phân tích các bài viết Facebook hiệu quả cao nhất tại VM Style',
                caption: `🔍 BÓC TÁCH CÔNG THỨC VIRAL CỦA CÁC BÀI VIẾT NỔI BẬT
Phân tích lý do giúp Top 5 bài viết đạt lượng tương tác và hỏi giá vượt trội:

- Tiêu đề mở đầu (Hook): Sử dụng câu hỏi đồng cảm hoặc lời khen chân thành đánh trúng tâm lý tự ti về dáng người.
- Bố cục hình ảnh: Ảnh Lookbook thật người mẫu chụp góc rộng tôn dáng, ảnh zoom cận chi tiết cúc áo và đường chỉ.
- Kêu gọi hành động (CTA): Rõ ràng, dễ thực hiện (Ví dụ: "Chấm (.) nhận giá", "Inbox nhận bảng size").

Đề xuất nhân rộng công thức này vào các kế hoạch nội dung của tháng tiếp theo.
#ContentOptimization #ViralFormula #ActionableInsights`,
                metrics: [
                  { label: 'Tăng trưởng Inbox', value: '+45%' },
                  { label: 'Tỷ lệ giữ chân', value: '82%' }
                ]
              },
              {
                title: 'Đánh Giá Chuyển Đổi Tin Nhắn: Tối Ưu Nội Dung Thúc Đẩy Mua Hàng',
                tag: 'Báo Cáo Chuyển Đổi',
                date: 'Báo cáo tháng',
                src: createPostImagePlaceholder('Đánh Giá Chuyển Đổi Tin Nhắn', 'CONVERSION REPORT', 'blue'),
                alt: 'Báo cáo tỷ lệ tin nhắn và đề xuất tối ưu nội dung Facebook VM Style',
                caption: `💬 THEO DÕI HÀNH VI TỪ ĐỌC BÀI VIẾT ĐẾN NHẮN TIN TƯ VẤN
Đo lường mức độ hiệu quả của nội dung trong việc hỗ trợ đội ngũ Sales chốt đơn:

- Nguồn gốc tin nhắn: 68% khách hàng nhắn tin hỏi mua xuất phát từ các bài viết Lookbook sản phẩm có gắn giá công khai.
- Khung giờ phát sinh nhiều tin nhắn nhất: 12h00 – 13h30 trưa và 20h00 – 22h00 tối.
- Đề xuất cải thiện: Cung cấp trước các thông tin kích thước và số đo cơ thể chuẩn trong phần bình luận ghim để đẩy nhanh quyết định mua hàng của khách.
#ConversionRate #MessageAds #InboundMarketing`,
                metrics: [
                  { label: 'Tin nhắn hỏi giá', value: '450+ mess/tháng' },
                  { label: 'Tỷ lệ chốt đơn', value: '28.5%' }
                ]
              }
            ]
          },
          {
            id: 'rp-instagram',
            name: 'Instagram',
            badge: 'IG',
            summary: 'Phân tích lượt xem Reels, lượt lưu bài viết (Saves), lượt chia sẻ (Shares), lượng truy cập hồ sơ (Profile Visits) và tăng trưởng Follower.',
            posts: [
              {
                title: 'Báo Cáo Instagram Insights Tổng Quan: Tăng Trưởng Tài Khoản Thật',
                tag: 'Instagram Insights',
                date: 'Báo cáo quý',
                src: createPostImagePlaceholder('Báo Cáo Instagram Insights', 'INSTAGRAM INSIGHTS', 'orange'),
                alt: 'Báo cáo tổng quan Instagram Insights của thương hiệu VM Style',
                caption: `📊 ĐÁNH GIÁ CHỈ SỐ TĂNG TRƯỞNG TRÊN KÊNH HÌNH ẢNH INSTAGRAM
Đo lường mức độ mở rộng thương hiệu trên tệp khách hàng trẻ:

- Lượng tài khoản tiếp cận (Accounts Reached): Tăng 42% sau khi triển khai đều đặn 3 Reels/tuần.
- Lượt ghé thăm hồ sơ (Profile Visits): Đạt hơn 15.000 lượt, tăng tỷ lệ bấm vào Link Bio đặt hàng lên 3.8%.
- Tỷ lệ người theo dõi mới: Tăng trưởng đều đặn 800 - 1.200 Follower thật/tháng nhờ vào nội dung hữu ích.
#InstagramGrowth #ProfileVisits #AudienceInsights`,
                metrics: [
                  { label: 'Tiếp cận Reels', value: '+42%' },
                  { label: 'Follower mới/tháng', value: '1.000+' }
                ]
              },
              {
                title: 'Đo Lường Hiệu Suất Video Reels: Phân Tích Lượt Xem & Lưu Bài Viết',
                tag: 'Reels Analytics',
                date: 'Báo cáo tuần',
                src: createPostImagePlaceholder('Đo Lường Hiệu Suất Reels', 'REELS METRICS', 'blue'),
                alt: 'Báo cáo hiệu quả video Instagram Reels và lượt lưu bài viết VM Style',
                caption: `🎥 CHỈ SỐ TIẾP CẬN VÀ LƯỢT LƯU (SAVES) CỦA SHORT-FORM VIDEO
So sánh hiệu quả giữa các định dạng video ngắn:

- Video phối đồ (Mix & Match): Đạt lượng Lưu (Saves) cao nhất (trung bình 350 saves/video), minh chứng cho giá trị tham khảo lâu dài của nội dung.
- Video biến hình (Transitions): Đạt lượng Xem (Views) và Chia sẻ (Shares) cao nhất, giúp kênh được thuật toán Instagram đề xuất trên tab Khám Phá.
#ReelsAnalytics #SavesRate #VideoPerformance`,
                metrics: [
                  { label: 'Lượt xem trung bình', value: '25K views' },
                  { label: 'Tỷ lệ chia sẻ', value: '4.8%' }
                ]
              },
              {
                title: 'Phân Tích Nhân Khẩu Học & Khung Giờ: Định Hình Lịch Đăng Chuẩn Xác',
                tag: 'Audience Demographics',
                date: 'Phân tích tệp khách',
                src: createPostImagePlaceholder('Nhân Khẩu Học & Khung Giờ', 'AUDIENCE DEMOGRAPHICS', 'orange'),
                alt: 'Báo cáo phân tích tệp người theo dõi và khung giờ đăng bài Instagram VM Style',
                caption: `🎯 HIỂU SÂU VỀ KHÁCH HÀNG MỤC TIÊU ĐỂ TỐI ƯU CHIẾN LƯỢC NỘI DUNG
Số liệu từ hệ thống Meta Business Suite & Instagram Insights:

- Độ tuổi chủ đạo: 18 - 24 tuổi (48%) và 25 - 34 tuổi (36%), phần lớn là sinh viên năm cuối và nhân viên văn phòng trẻ.
- Khu vực địa lý tập trung: TP. Hồ Chí Minh (55%), Hà Nội (22%), Đà Nẵng (10%).
- Khung giờ hoạt động tích cực nhất: 11h30 – 13h00 và 20h30 – 22h30. Điều chỉnh lịch đăng bài rơi trúng các khung giờ này đã giúp tương tác 1 giờ đầu tăng 35%.
#TargetAudience #Demographics #OptimalTiming`,
                metrics: [
                  { label: 'Khách hàng nữ', value: '92%' },
                  { label: 'Tương tác giờ vàng', value: '+35%' }
                ]
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

    // Danh sách phẳng tất cả bài viết để phục vụ điều hướng Lightbox (Trước / Sau)
    const lightboxItems = [];

    // Tạo HTML cho 3 Tab nút bấm
    const tabsNavHTML = categories
      .map((cat, idx) => {
        const totalPosts = cat.subcategories.reduce(
          (acc, sub) => acc + (sub.posts || sub.images || []).length,
          0
        );
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
            <span class="vm-tab-count">${totalPosts} bài viết</span>
          </button>
        `;
      })
      .join('');

    // Tạo HTML cho từng Tab Panel và các mục con bên trong
    const tabsPanelsHTML = categories
      .map((cat, idx) => {
        const subcatsHTML = cat.subcategories
          .map((sub) => {
            const postsList = sub.posts || sub.images || [];
            const postsHTML = postsList
              .map((post) => {
                const lbIndex = lightboxItems.length;
                lightboxItems.push({
                  src: post.src,
                  alt: post.alt || post.title || 'Ảnh bài post',
                  title: post.title || '',
                  caption: post.caption || '',
                  groupTitle: `${cat.tabTitle.replace(/^\d+\.\s*/, '')} — ${sub.name}`
                });

                const metricsHTML =
                  post.metrics && post.metrics.length
                    ? `
                      <div class="vm-post-metrics">
                        ${post.metrics
                          .map(
                            (m) => `
                          <span class="vm-post-metric-pill">
                            <span>${escapeHTML(m.label)}:</span>
                            <strong>${escapeHTML(m.value)}</strong>
                          </span>
                        `
                          )
                          .join('')}
                      </div>
                    `
                    : '';

                return `
                  <article class="vm-post-card">
                    <!-- PHẦN TRÁI: ẢNH BÀI POST (User input vào) -->
                    <div class="vm-post-media">
                      <button
                        type="button"
                        class="vm-post-img-trigger vm-img-trigger"
                        data-lb-index="${lbIndex}"
                        aria-label="Phóng to ảnh: ${escapeHTML(post.title || post.caption)}"
                      >
                        <img src="${post.src}" alt="${escapeHTML(post.alt || post.title || 'Ảnh bài post')}" loading="lazy" decoding="async">
                        <span class="vm-post-overlay vm-img-overlay" aria-hidden="true">
                          <span class="vm-post-zoom-pill vm-zoom-pill">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                            </svg>
                            Phóng to ảnh
                          </span>
                        </span>
                      </button>
                    </div>

                    <!-- PHẦN PHẢI: CAPTION TƯƠNG ỨNG BÀI POST (User input vào) -->
                    <div class="vm-post-content">
                      <div>
                        <div class="vm-post-meta">
                          <span class="vm-post-tag">${escapeHTML(post.tag || sub.name)}</span>
                          ${post.date ? `<span class="vm-post-date">${escapeHTML(post.date)}</span>` : ''}
                        </div>

                        ${post.title ? `<h4 class="vm-post-title">${escapeHTML(post.title)}</h4>` : ''}
                      </div>

                      <div class="vm-post-caption-box">
                        <div class="vm-post-caption-label">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                          </svg>
                          Nội dung / Caption bài viết:
                        </div>
                        <div class="vm-post-caption-text">${formatCaptionHTML(post.caption)}</div>
                      </div>

                      ${metricsHTML}
                    </div>
                  </article>
                `;
              })
              .join('');

            const totalPostsCount = postsList.length;
            const carouselControlsHTML = totalPostsCount > 1 ? `
              <div class="vm-slider-controls">
                <span class="vm-slider-counter"><strong class="vm-slider-current">1</strong> / ${totalPostsCount}</span>
                <button type="button" class="vm-slider-btn vm-slider-prev" aria-label="Bài trước" disabled>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" class="vm-slider-btn vm-slider-next" aria-label="Bài tiếp theo">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            ` : '';

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
                  <div class="vm-subcat-actions">
                    <span class="vm-subcat-hint">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Click vào ảnh để phóng to
                    </span>
                    ${carouselControlsHTML}
                  </div>
                </div>

                <!-- CAROUSEL LƯỚT NGANG: Hiển thị 1 bài mỗi lần trượt -->
                <div class="vm-carousel-container" data-posts-count="${totalPostsCount}">
                  <div class="vm-posts-list vm-posts-slider">
                    ${postsHTML}
                  </div>
                  ${totalPostsCount > 1 ? `
                    <div class="vm-carousel-dots" role="tablist" aria-label="Chọn bài viết">
                      ${postsList.map((_, pIdx) => `
                        <button type="button" class="vm-carousel-dot ${pIdx === 0 ? 'is-active' : ''}" data-index="${pIdx}" aria-label="Xem bài viết ${pIdx + 1}"></button>
                      `).join('')}
                    </div>
                  ` : ''}
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
          ${company.logoUrl && company.logoUrl.startsWith('data:') ? '<span class="vm-logo-note">Logo thương hiệu</span>' : ''}
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

    // Khởi tạo tương tác Tabs, Slider lướt ngang, Hiệu ứng cuộn, Counter và Lightbox
    initTabs(root);
    initCarousels(root);
    initScrollRevealAndCounters(root);
    initLightbox(root, lightboxItems);
  }

  /* ==========================================================================
     3. LOGIC SLIDER LƯỚT NGANG BÀI VIẾT (CAROUSEL / HORIZONTAL SCROLL)
     ========================================================================== */
  function initCarousels(root) {
    const subcatBlocks = Array.from(root.querySelectorAll('.vm-subcat-block'));

    subcatBlocks.forEach((block) => {
      const slider = block.querySelector('.vm-posts-slider');
      const prevBtn = block.querySelector('.vm-slider-prev');
      const nextBtn = block.querySelector('.vm-slider-next');
      const counterEl = block.querySelector('.vm-slider-current');
      const dots = Array.from(block.querySelectorAll('.vm-carousel-dot'));
      const cards = Array.from(block.querySelectorAll('.vm-post-card'));

      if (!slider || cards.length <= 1) return;

      const total = cards.length;

      // Cập nhật trạng thái nút và số trang theo vị trí cuộn
      function updateSliderState() {
        const scrollLeft = slider.scrollLeft;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 24;
        const itemFullWidth = cardWidth + gap;

        // Tính chỉ số card hiện tại
        const currentIndex = Math.min(
          total - 1,
          Math.max(0, Math.round(scrollLeft / itemFullWidth))
        );

        if (counterEl) {
          counterEl.textContent = currentIndex + 1;
        }

        if (prevBtn) {
          prevBtn.disabled = currentIndex <= 0;
        }
        if (nextBtn) {
          nextBtn.disabled = currentIndex >= total - 1;
        }

        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === currentIndex);
        });
      }

      function scrollToIndex(idx) {
        const targetIndex = Math.max(0, Math.min(total - 1, idx));
        const card = cards[targetIndex];
        if (!card) return;
        
        slider.scrollTo({
          left: card.offsetLeft - slider.offsetLeft,
          behavior: 'smooth'
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth;
          const gap = parseFloat(window.getComputedStyle(slider).gap) || 24;
          const currentIndex = Math.round(slider.scrollLeft / (cardWidth + gap));
          scrollToIndex(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth;
          const gap = parseFloat(window.getComputedStyle(slider).gap) || 24;
          const currentIndex = Math.round(slider.scrollLeft / (cardWidth + gap));
          scrollToIndex(currentIndex + 1);
        });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
          scrollToIndex(idx);
        });
      });

      // Lắng nghe scroll với debounce nhẹ
      let scrollTimeout;
      slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateSliderState, 60);
      }, { passive: true });

      // Hỗ trợ kéo chuột trên máy tính (Drag to scroll)
      let isDown = false;
      let startX;
      let scrollLeftPos;
      let hasDragged = false;

      slider.addEventListener('mousedown', (e) => {
        // Không bắt drag nếu click vào nút zoom ảnh hoặc link
        if (e.target.closest('button, a')) return;
        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeftPos = slider.scrollLeft;
        hasDragged = false;
      });

      slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) hasDragged = true;
        slider.scrollLeft = scrollLeftPos - walk;
      });

      // Ngăn click nhầm khi đang drag
      slider.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      }, true);

      // Cập nhật lại khi resize
      window.addEventListener('resize', updateSliderState, { passive: true });
      updateSliderState();
    });
  }

  /* ==========================================================================
     4. LOGIC CHUYỂN TAB HẠNG MỤC CÔNG VIỆC
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
      imgEl.alt = item.alt || item.title || 'Ảnh bài post';
      captionEl.innerHTML = `
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: #ffffff;">${escapeHTML(item.title || item.groupTitle)}</div>
        <div style="font-size: 0.85rem; opacity: 0.92; line-height: 1.5; color: #f1f5f9; max-height: 100px; overflow-y: auto;">${formatCaptionHTML(item.caption)}</div>
      `;
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
      const trigger = e.target.closest('.vm-img-trigger, .vm-post-img-trigger');
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
