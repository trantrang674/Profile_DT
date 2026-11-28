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
 *   src: 'assets/images/posts/bai-viet-1.webp', // << INPUT ẢNH PHẦN TRÁI VÀO ĐÂY
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
      <text x="350" y="332" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#64748b">BẠN INPUT ẢNH TẠI ĐÂY (thay giá trị src)</text>
      <text x="350" y="356" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">Hỗ trợ JPG, PNG, WebP — Tự động căn chỉnh vừa khung</text>

      <!-- Pill xem chi tiết -->
      <rect x="250" y="400" width="200" height="38" rx="19" fill="${softBg}" stroke="${borderCol}"/>
      <text x="350" y="424" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="${primary}">Bấm để phóng to xem ảnh</text>
      <svg x="262" y="410" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${primary}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
      logoUrl: 'assets/images/logo-vmstyle.webp',
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
      // Cột 1: Phạm vi công việc (4 nhiệm vụ -> 4 thẻ dọc bên phải khung 1)
      responsibilities: {
        title: 'Phạm vi công việc',
        items: [
          {
            icon: 'share-2',
            title: 'Social Media',
            text: 'Quản trị & sáng tạo nội dung trên hệ thống Social Media chính (Facebook & Instagram).'
          },
          {
            icon: 'calendar-days',
            title: 'Content Plan',
            text: 'Xây dựng Content Plan định kỳ hằng tháng và kế hoạch truyền thông tổng thể cho các đợt ra mắt BST mới.'
          },
          {
            icon: 'camera',
            title: 'Media & Lookbook',
            text: 'Phối hợp cùng đội ngũ Media/Design thực hiện chụp Lookbook, quay Reels phối đồ (Mix & Match).'
          },
          {
            icon: 'bar-chart-3',
            title: 'Đo lường & Báo cáo',
            text: 'Theo dõi chỉ số và lập báo cáo đo lường định kỳ.'
          }
        ]
      },
      // Cột 2: Cách triển khai (Khung ngang 2 — ảnh bên trái, nội dung bên phải)
      execution: {
        title: 'Cách triển khai',
        // Thay đường dẫn ảnh thật của bạn tại đây (ví dụ: 'assets/images/vmstyle-execution.webp')
        imageUrl: '',
        imageAlt: 'Hình ảnh triển khai nội dung tại VM Style',
        items: [
          {
            icon: 'calendar-check',
            title: 'Tần suất đều đặn',
            text: 'Duy trì bài đăng hàng ngày để giữ chân người theo dõi, củng cố hình ảnh thương hiệu.'
          },
          {
            icon: 'layout-grid',
            title: 'Đa dạng định dạng',
            text: 'Xây dựng nội dung đa dạng phù hợp ngành như: chia sẻ tips, feedback, mix & match, collection,...'
          },
          {
            icon: 'trending-up',
            title: 'Bám sát hành vi khách hàng',
            text: 'Nghiên cứu xu hướng thời trang & tâm lý mua sắm của tệp khách hàng nữ trẻ theo thời điểm.'
          }
        ]
      },
      // Cột 3: Số liệu (Counter nổi bật)
      deliverables: {
        title: 'Số liệu',
        stats: [
          {
            value: 80,
            suffix: '+',
            label: 'Số lượng trung bình bài đăng/ tháng',
            isAccent: false
          },
          {
            value: 5,
            suffix: '+',
            label: 'Kế hoạch truyền thông ra mắt BST',
            isAccent: false
          },
          {
            value: 75,
            prefix: '+',
            suffix: '%',
            label: 'Tăng trưởng lượt xem sau 4 tháng làm việc',
            isAccent: true
          }
        ]
      }
    },

    // --- PHẦN 3: HẠNG MỤC CÔNG VIỆC (MỖI BÀI CHIA 2 PHẦN: TRÁI LÀ ẢNH, PHẢI LÀ CAPTION) ---
    categories: [
      {
        id: 'social-media',
        tabTitle: 'Social Media',
        description: 'Sáng tạo nội dung thu hút tương tác, xây dựng hình ảnh thương hiệu thời trang trẻ trung và thúc đẩy inbox mua hàng.',
        subcategories: [
          {
            id: 'sm-facebook',
            name: 'Facebook',
            badge: 'FB',
            topics: [
              {
                id: 'fb-mixmatch',
                title: 'Tuyến bài quảng bá sản phẩm',
                posts: [
                  {
                    title: '[HÔM NAY MẶC GÌ?] — Gợi Ý Mix & Match Diện Lễ',
                    tag: 'Mix & Match',
                    date: 'Bài đăng Facebook',
                    src: 'assets/images/posts/Screenshot_1.webp',
                    alt: 'Hôm Nay Mặc Gì - Tuyến bài gợi ý Mix & Match thời trang VM Style',
                    caption: `[HÔM NAY MẶC GÌ?] 🧐🧐
💫Gợi ý Mix & match cho các bestie thân yêu của VMStyle! Đa dạng từ kiểu dáng đến phong cách cho nàng lựa chọn diện mùa lễ sắp tới 
💖Ghé store hoặc kênh shopping online của VM để được tư vấn mua sắm nha✨
__________
VM STYLE | CONTACT US VIA:
Shopee: https://vn.shp.ee/GaQjsxg
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  },
                  {
                    title: '𝐆𝐥𝐚𝐦𝐨𝐮𝐫 𝐠𝐫𝐚𝐲 — Bộ Sưu Tập Tinh Tế & Thanh Lịch',
                    tag: 'Lookbook BST',
                    date: 'Bộ sưu tập',
                    src: 'assets/images/posts/Screenshot_2.webp',
                    alt: 'Glamour Gray - BST thời trang nữ màu xám tinh tế VM Style',
                    caption: `𝐆𝐥𝐚𝐦𝐨𝐮𝐫 𝐠𝐫𝐚𝐲 💕👠
Khám phá bộ sưu tập thời trang nữ đầy ấn tượng với những thiết kế màu xám tinh tế từ VM Style. 
✨Mỗi trang phục không chỉ tôn vinh vẻ đẹp tự tin, mạnh mẽ của phái nữ, mà còn là sự kết hợp hoàn hảo giữa sự thanh lịch và hiện đại. Những bộ cánh này luôn sẵn sàng là lựa chọn lý tưởng, giúp phái đẹp tỏa sáng trong mọi hoàn cảnh.
__________
VM STYLE | CONTACT US VIA:
Shopee: https://s.shopee.vn/5AZSmV4JtM
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  },
                  {
                    title: '𝐏𝐨𝐥𝐨 𝐃𝐫𝐞𝐬𝐬 | 𝐓𝐡𝐢𝐬 𝐨𝐫 𝐭𝐡𝐚𝐭? — Chiếc Đầm Đa Năng Cho Nàng',
                    tag: 'Sản Phẩm Mới',
                    date: 'Bài tương tác & chốt đơn',
                    src: 'assets/images/posts/Screenshot_3.webp',
                    alt: 'Polo Dress This or that - Đầm polo cao cấp VM Style',
                    caption: `𝐏𝐨𝐥𝐨 𝐃𝐫𝐞𝐬𝐬 | 𝐓𝐡𝐢𝐬 𝐨𝐫 𝐭𝐡𝐚𝐭?✨💓
Nàng thích xám thanh lịch hay đen tối giản? Chiếc đầm polo thiết kế cao cấp nhà VMStyle là lựa chọn nên có trong tủ đồ của mọi cô nàng. Từ dạo phố thoải mái, đến công sở thanh lịch đều "cân tất". Item "must-have" là đây chứ đâu!💋
📍Khó suy nghĩ quá thì pick luôn hai màu vì màu nào cũng xinh, màu nào cũng dễ mix&match!
__________
VM STYLE | CONTACT US VIA:
Shopee: https://vn.shp.ee/GaQjsxg
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  },
                  {
                    title: 'Jeans Item — Thời Trang Mix & Match Sành Điệu Đón Lễ Tết',
                    tag: 'Mix & Match',
                    date: 'Mùa Lễ Tết',
                    src: 'assets/images/posts/Screenshot_4.webp',
                    alt: 'Jeans Item - Thời trang phối đồ jeans dạo phố VM Style',
                    caption: `✨Lễ Tết đến khó suy nghĩ được mua gì đúng không? Item quần jeans chưa bao giờ là out-trend dù là bất kỳ thời điểm nào. Thời trang jeans vừa basic nhưng là item mix & match đa dạng và sành điệu. 
💖Nhanh tay tranh thủ Tết Dương Lịch đến gần rồi, ra VMStyle mua sắm ngay đi, đồ mới về chờ bạn đến thôi đó!💫
__________
VM STYLE | CONTACT US VIA:
Shopee: https://vn.shp.ee/GaQjsxg
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  },
                  {
                    title: '𝐃𝐞𝐧𝐢𝐦 𝐭𝐫𝐨𝐮𝐬𝐞𝐫𝐬 — Item Năng Động Không Thể Thiếu',
                    tag: 'Tư Vấn Phối Đồ',
                    date: 'Dòng sản phẩm Denim',
                    src: 'assets/images/posts/Screenshot_5.webp',
                    alt: 'Denim Trousers - Item creates personality VM Style',
                    caption: `𝐃𝐞𝐧𝐢𝐦 𝐭𝐫𝐨𝐮𝐬𝐞𝐫𝐬🎀👠
Item quần jeans luôn không thể thiếu trong tủ đồ của mỗi bạn nữ. Với sự đa dạng về kiểu dáng và phong cách, không chỉ mang lại sự thoải mái mà còn giúp bạn dễ dàng kết hợp với nhiều trang phục khác nhau. Lựa chọn quần dáng dài ống rộng hay quần dáng lửng đều phù hợp cho đời thường đến những buổi dạo phố.💓
__________
VM STYLE | CONTACT US VIA:
Shopee: https://s.shopee.vn/5AZSmV4JtM
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  },
                  {
                    title: '𝐆𝐢𝐫𝐥𝐲 𝐆𝐥𝐚𝐦 — Áo Trễ Vai Quốc Dân Năng Động & Ngọt Ngào',
                    tag: 'Lookbook Hot Trend',
                    date: 'Hot Item',
                    src: 'assets/images/posts/Screenshot_6.webp',
                    alt: 'Girly Glam - Áo trễ vai điệu đà tôn dáng VM Style',
                    caption: `𝐆𝐢𝐫𝐥𝐲 𝐆𝐥𝐚𝐦💕
Mê mẩn ngay từ cái nhìn đầu tiên với chiếc áo trễ vai này! ✨  
---------------
Áo trễ vai - item quốc dân cho nàng nào muốn vừa năng động lại vừa ngọt ngào. Thiết kế trễ vai khoe trọn xương quai xanh quyến rũ, kết hợp cùng chiếc nơ điệu đà, đảm bảo bạn sẽ trở thành tâm điểm mọi ánh nhìn. 
Mix & match với quần jeans, chân váy hay thậm chí là quần short đều cực kỳ ăn ý, giúp bạn tự tin thể hiện phong cách thời trang đa dạng.
__________
VM STYLE | CONTACT US VIA:
Shopee: https://s.shopee.vn/5AZSmV4JtM
TikTok: https://www.tiktok.com/@vmstyle.vn`
                  }
                ]
              },
              {
                id: 'fb-topic-2',
                title: 'Tuyến bài bắt trend và tương tác',
                posts: []
              },
              {
                id: 'fb-topic-3',
                title: 'Tuyến bài Minigame & Chiến dịch',
                posts: []
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
        tabTitle: 'Content Plan',
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
        tabTitle: 'Báo cáo đo lường',
        description: 'Theo dõi sát sao số liệu thực tế trên từng nền tảng để đánh giá hiệu quả nội dung và đề xuất phương án tối ưu.',
        subcategories: [
          {
            id: 'rp-facebook',
            name: 'Facebook',
            badge: 'FB',
            summary: 'Báo cáo tăng trưởng chỉ số Fanpage từ Meta Business Suite giai đoạn 10/2024 – 01/2025.',
            analyticsReport: {
              period: '10/2024 – 01/2025',
              source: 'Meta Business Suite',
              proofSrc: 'assets/images/posts/fb-report-proof.jpg',
              proofTitle: 'Minh chứng số liệu Facebook — Meta Business Suite (10/2024 – 01/2025)',
              proofCaption: 'Ảnh chụp trực tiếp từ Meta Business Suite thể hiện Lượt xem, Số người tiếp cận và Lượt xem trong tối thiểu 3 giây qua 4 tháng liên tiếp (10/2024 – 01/2025).',
              months: ['Tháng 10/2024', 'Tháng 11/2024', 'Tháng 12/2024', 'Tháng 01/2025'],
              shortMonths: ['T10/2024', 'T11/2024', 'T12/2024', 'T01/2025'],
              metrics: [
                {
                  id: 'views',
                  label: 'Lượt xem',
                  latest: '2,1 triệu',
                  latestDelta: '+34%',
                  latestDir: 'up',
                  note: '+75% sau 4 tháng',
                  unit: 'triệu',
                  max: 2.4,
                  values: [1.2, 1.2, 1.5, 2.1],
                  displays: ['1,2 triệu', '1,2 triệu', '1,5 triệu', '2,1 triệu'],
                  deltas: [null, { text: '+8,7%', dir: 'up' }, { text: '+27,6%', dir: 'up' }, { text: '+34%', dir: 'up' }]
                },
                {
                  id: 'reach',
                  label: 'Số người tiếp cận',
                  latest: '191,3K',
                  latestDelta: '+44,4%',
                  latestDir: 'up',
                  note: 'Phục hồi & vượt đỉnh T01',
                  unit: 'K',
                  max: 220,
                  values: [182.2, 123.7, 132.5, 191.3],
                  displays: ['182,2K', '123,7K', '132,5K', '191,3K'],
                  deltas: [{ text: '-5%', dir: 'down' }, { text: '-27,6%', dir: 'down' }, { text: '+5,4%', dir: 'up' }, { text: '+44,4%', dir: 'up' }]
                },
                {
                  id: 'views3s',
                  label: 'Lượt xem tối thiểu 3 giây',
                  latest: '24K',
                  latestDelta: '+6,7%',
                  latestDir: 'up',
                  note: '+36,4% sau 4 tháng',
                  unit: 'K',
                  max: 28,
                  values: [17.6, 17.9, 22.5, 24.0],
                  displays: ['17,6K', '17,9K', '22,5K', '24K'],
                  deltas: [{ text: '-46,3%', dir: 'down' }, { text: '+8,5%', dir: 'up' }, { text: '+22,9%', dir: 'up' }, { text: '+6,7%', dir: 'up' }]
                }
              ]
            },
            posts: []
          },
          {
            id: 'rp-instagram',
            name: 'Instagram',
            badge: 'IG',
            summary: 'Báo cáo hiệu suất kênh Instagram từ Instagram Insights giai đoạn 12/2024 – 01/2025.',
            analyticsReport: {
              period: '12/2024 – 01/2025',
              source: 'Instagram Insights',
              proofSrc: 'assets/images/posts/ig-report-proof.jpg',
              proofTitle: 'Minh chứng số liệu Instagram — Instagram Insights (12/2024 – 01/2025)',
              proofCaption: 'Ảnh chụp trực tiếp từ Instagram Insights so sánh Tháng 12/2024 và Tháng 01/2025: Reach tự nhiên tăng 32% (từ 10.308 lên 13.543) và Lượt hiển thị tăng 3,8% (lên 68.864) dù giảm tỉ lệ chạy ads từ 56,5% xuống còn 8,6%.',
              months: ['Tháng 12/2024', 'Tháng 01/2025'],
              shortMonths: ['T12/2024', 'T01/2025'],
              metrics: [
                {
                  id: 'ig-organic-reach',
                  label: 'Reach tự nhiên',
                  unit: 'K',
                  max: 16,
                  values: [10.308, 13.543],
                  displays: ['10.308', '13.543'],
                  deltas: [null, { text: '+32%', dir: 'up' }]
                },
                {
                  id: 'ig-impressions',
                  label: 'Lượt hiển thị',
                  unit: 'K',
                  max: 80,
                  values: [66.336, 68.864],
                  displays: ['66.336', '68.864'],
                  deltas: [{ text: '+101%', dir: 'up' }, { text: '+3,8%', dir: 'up' }]
                },
                {
                  id: 'ig-reels',
                  label: 'Reels',
                  unit: 'K',
                  max: 14,
                  values: [8.128, 11.1],
                  displays: ['8.128', '11,1K'],
                  deltas: [null, { text: '+36,6%', dir: 'up' }]
                }
              ],
              extraColumns: [
                {
                  label: 'Bài viết',
                  displays: ['3.287', '4.433']
                },
                {
                  label: 'Tin (Story)',
                  displays: ['798', '1.354']
                },
                {
                  label: 'Tỉ lệ từ quảng cáo',
                  displays: ['56,5%', '8,6%']
                }
              ],
              insights: [
                {
                  badge: '+32%',
                  title: 'Reach tự nhiên',
                  desc: 'Tháng 12 lượng tiếp cận tự nhiên đạt 10.308; sang Tháng 1 tăng lên 13.543.'
                },
                {
                  badge: '+3,8%',
                  title: 'Lượt hiển thị',
                  desc: 'Lượt hiển thị tăng 3,8% (lên 68.864) mặc dù giảm tỉ lệ chạy ads từ 56,5% (Tháng 12) xuống còn 8,6% (Tháng 1).'
                }
              ]
            },
            posts: []
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
          </button>
        `;
      })
      .join('');

    // Hàm render 1 card bài viết (Trái: Ảnh - Phải: Caption)
    function renderSinglePostCard(post, groupTitle) {
      const lbIndex = lightboxItems.length;
      lightboxItems.push({
        src: post.src,
        alt: post.alt || post.title || 'Ảnh bài post',
        title: post.title || '',
        caption: post.caption || '',
        groupTitle: groupTitle
      });

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
            <div class="vm-post-caption-box">
              <div class="vm-post-caption-label">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Nội dung / Caption bài viết:
              </div>
              <div class="vm-post-caption-text">${formatCaptionHTML(post.caption)}</div>
            </div>
          </div>
        </article>
      `;
    }

    // Hàm tạo thanh điều hướng Prev/Next & bộ đếm cho 1 danh sách bài viết
    function renderSliderControlsHTML(totalPostsCount, extraClass = '', extraAttrs = '') {
      if (totalPostsCount <= 1) return '';
      const cls = extraClass ? `vm-slider-controls ${extraClass}` : 'vm-slider-controls';
      return `
        <div class="${cls}" ${extraAttrs}>
          <span class="vm-slider-counter"><strong class="vm-slider-current">1</strong> / ${totalPostsCount}</span>
          <button type="button" class="vm-slider-btn vm-slider-prev" aria-label="Bài trước" disabled>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button type="button" class="vm-slider-btn vm-slider-next" aria-label="Bài tiếp theo">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      `;
    }

    // Hàm tạo khối carousel lướt ngang cho 1 danh sách bài viết
    function renderPostsCarousel(postsList, groupTitle, showTopBar = true) {
      if (!postsList || postsList.length === 0) {
        return `
          <div class="vm-empty-topic">
            <div class="vm-empty-icon"><i data-lucide="file-pen-line" aria-hidden="true"></i></div>
            <h4>Chủ đề đang được cập nhật</h4>
            <p>Nội dung và hình ảnh bài viết cho tuyến bài này sẽ sớm được bổ sung.</p>
          </div>
        `;
      }

      const totalPostsCount = postsList.length;
      const carouselControlsHTML = showTopBar ? renderSliderControlsHTML(totalPostsCount) : '';
      const postsHTML = postsList.map(p => renderSinglePostCard(p, groupTitle)).join('');

      return `
        <div class="vm-carousel-wrapper">
          ${carouselControlsHTML ? `<div class="vm-carousel-top-bar">${carouselControlsHTML}</div>` : ''}
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
    }

    // Hàm render biểu đồ báo cáo số liệu trực quan (SVG Bar + Trendline + bảng tóm tắt)
    function renderAnalyticsReportBlock(sub, catTitle) {
      const rp = sub.analyticsReport;
      const proofLbIndex = lightboxItems.length;
      lightboxItems.push({
        src: rp.proofSrc,
        alt: rp.proofTitle,
        title: rp.proofTitle,
        caption: rp.proofCaption,
        groupTitle: `${catTitle} — ${sub.name}`
      });

      function buildChartSVG(metric) {
        const W = 680;
        const H = 250;
        const padL = 54;
        const padR = 26;
        const padT = 44;
        const padB = 38;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        const count = metric.values.length;
        const slotW = plotW / count;
        const barW = Math.min(72, slotW * 0.48);

        const ticks = [0, 0.25, 0.5, 0.75, 1];
        const gridHTML = ticks.map((ratio) => {
          const y = padT + plotH * (1 - ratio);
          const val = metric.max * ratio;
          const label = metric.unit === 'triệu'
            ? (val === 0 ? '0' : `${val.toFixed(1).replace('.', ',')}M`)
            : (val === 0 ? '0' : `${Math.round(val)}K`);
          return `
            <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#e6ecf8" stroke-width="1" stroke-dasharray="${ratio === 0 ? '0' : '4 4'}" />
            <text x="${padL - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#64748b" font-size="11" font-weight="600">${label}</text>
          `;
        }).join('');

        const gradPeakId = `vmBarPeak-${sub.id}-${metric.id}`;
        const gradSoftId = `vmBarSoft-${sub.id}-${metric.id}`;

        const points = [];
        const barsHTML = metric.values.map((v, i) => {
          const cx = padL + slotW * i + slotW / 2;
          const barH = Math.max(8, (v / metric.max) * plotH);
          const x = cx - barW / 2;
          const y = padT + plotH - barH;
          const isPeak = i === count - 1;
          points.push(`${cx.toFixed(1)},${y.toFixed(1)}`);

          const d = metric.deltas[i];
          const deltaColor = d ? (d.dir === 'up' ? '#15803d' : '#be123c') : '';
          const deltaBg = d ? (d.dir === 'up' ? '#dcfce7' : '#ffe4e6') : '';

          return `
            <g class="vm-chart-col">
              <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="10" fill="${isPeak ? `url(#${gradPeakId})` : `url(#${gradSoftId})`}" />
              <text x="${cx.toFixed(1)}" y="${(y - (d ? 24 : 10)).toFixed(1)}" text-anchor="middle" fill="#070c22" font-size="12.5" font-weight="800">${metric.displays[i]}</text>
              ${d ? `
                <rect x="${(cx - 26).toFixed(1)}" y="${(y - 19).toFixed(1)}" width="52" height="16" rx="8" fill="${deltaBg}" />
                <text x="${cx.toFixed(1)}" y="${(y - 7.5).toFixed(1)}" text-anchor="middle" fill="${deltaColor}" font-size="10.5" font-weight="700">${d.text}</text>
              ` : ''}
              <text x="${cx.toFixed(1)}" y="${(H - 12).toFixed(1)}" text-anchor="middle" fill="${isPeak ? '#10249e' : '#475569'}" font-size="12" font-weight="${isPeak ? '800' : '600'}">${rp.shortMonths[i]}</text>
            </g>
          `;
        }).join('');

        const dotsHTML = points.map((pt, i) => {
          const [px, py] = pt.split(',');
          const isPeak = i === count - 1;
          return `<circle cx="${px}" cy="${py}" r="${isPeak ? '5.5' : '4.5'}" fill="#ffffff" stroke="${isPeak ? '#10249e' : '#3b5bfd'}" stroke-width="2.5" />`;
        }).join('');

        return `
          <svg class="vm-report-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ ${escapeHTML(metric.label)} giai đoạn ${escapeHTML(rp.period)}">
            <defs>
              <linearGradient id="${gradPeakId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2b4eff" />
                <stop offset="100%" stop-color="#10249e" />
              </linearGradient>
              <linearGradient id="${gradSoftId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#93b4ff" />
                <stop offset="100%" stop-color="#dbe7ff" />
              </linearGradient>
            </defs>
            ${gridHTML}
            ${barsHTML}
            <polyline fill="none" stroke="#1631c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${points.join(' ')}" />
            ${dotsHTML}
          </svg>
        `;
      }

      const metricTabsHTML = rp.metrics.map((m, mIdx) => `
        <button
          type="button"
          class="vm-topic-pill-btn vm-report-tab ${mIdx === 0 ? 'is-active' : ''}"
          data-report-metric="${m.id}"
          aria-pressed="${mIdx === 0 ? 'true' : 'false'}"
        >
          ${escapeHTML(m.label)}
        </button>
      `).join('');

      const chartPanelsHTML = rp.metrics.map((m, mIdx) => `
        <div class="vm-report-chart-panel ${mIdx === 0 ? 'is-active' : ''}" data-report-panel="${m.id}">
          ${buildChartSVG(m)}
        </div>
      `).join('');

      const extraCols = rp.extraColumns || [];
      const tableHeadersHTML = [
        ...rp.metrics.map((m) => `<th>${escapeHTML(m.label)}</th>`),
        ...extraCols.map((c) => `<th>${escapeHTML(c.label)}</th>`)
      ].join('');

      const tableRowsHTML = rp.months.map((month, idx) => `
        <tr class="${idx === rp.months.length - 1 ? 'is-latest' : ''}">
          <td><strong>${escapeHTML(month)}</strong></td>
          ${rp.metrics.map((m) => {
            const d = m.deltas[idx];
            return `
              <td>
                <span class="vm-tbl-val">${escapeHTML(m.displays[idx])}</span>
                ${d ? `<span class="vm-delta-pill is-${d.dir}">${escapeHTML(d.text)}</span>` : ''}
              </td>
            `;
          }).join('')}
          ${extraCols.map((c) => `<td><span class="vm-tbl-val">${escapeHTML(c.displays[idx])}</span></td>`).join('')}
        </tr>
      `).join('');

      const insightsHTML = (rp.insights && rp.insights.length)
        ? `
          <div class="vm-report-insights">
            ${rp.insights.map((ins) => `
              <div class="vm-report-insight-item">
                <div class="vm-report-insight-head">
                  <span class="vm-delta-pill is-up">${escapeHTML(ins.badge)}</span>
                  <strong>${escapeHTML(ins.title)}</strong>
                </div>
                <p>${escapeHTML(ins.desc)}</p>
              </div>
            `).join('')}
          </div>
        `
        : '';

      return `
        <div class="vm-subcat-block vm-report-block">
          <div class="vm-subcat-header">
            <div class="vm-subcat-title-wrap">
              <h4 class="vm-subcat-title">${sub.name}</h4>
              <span class="vm-report-source">${escapeHTML(rp.source)} · ${escapeHTML(rp.period)}</span>
            </div>
            <div class="vm-report-tabs" role="tablist" aria-label="Chọn chỉ số hiển thị biểu đồ">
              ${metricTabsHTML}
            </div>
          </div>

          <div class="vm-report-chart-stage">
            ${chartPanelsHTML}
          </div>

          <div class="vm-report-table-wrap">
            <table class="vm-report-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  ${tableHeadersHTML}
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>
          </div>

          ${insightsHTML}

          <div class="vm-report-footer">
            <button
              type="button"
              class="vm-proof-btn"
              data-lb-index="${proofLbIndex}"
              aria-label="Xem ảnh chụp báo cáo số liệu thực tế ${escapeHTML(sub.name)}"
            >
              <i data-lucide="image" aria-hidden="true"></i>
              <span>Xem minh chứng thực tế</span>
            </button>
          </div>
        </div>
      `;
    }

    // Tạo HTML cho từng Tab Panel và các mục con bên trong
    const tabsPanelsHTML = categories
      .map((cat, idx) => {
        const subcatsHTML = cat.subcategories
          .map((sub) => {
            if (sub.analyticsReport) {
              return renderAnalyticsReportBlock(sub, cat.tabTitle.replace(/^\d+\.\s*/, ''));
            }

            const hasTopics = sub.topics && Array.isArray(sub.topics) && sub.topics.length > 0;

            if (hasTopics) {
              const topicTabsHTML = sub.topics.map((topic, tIdx) => {
                return `
                  <button
                    type="button"
                    class="vm-topic-pill-btn ${tIdx === 0 ? 'is-active' : ''}"
                    role="tab"
                    aria-selected="${tIdx === 0 ? 'true' : 'false'}"
                    data-topic-id="${topic.id}"
                  >
                    <span>${escapeHTML(topic.title)}</span>
                  </button>
                `;
              }).join('');

              const topicControlsHTML = sub.topics.map((topic, tIdx) => {
                const count = (topic.posts || []).length;
                if (count <= 1) return '';
                return renderSliderControlsHTML(
                  count,
                  `vm-topic-controls ${tIdx === 0 ? 'is-active' : ''}`,
                  `data-topic-controls="${topic.id}"`
                );
              }).join('');

              const topicPanelsHTML = sub.topics.map((topic, tIdx) => {
                const carouselHTML = renderPostsCarousel(
                  topic.posts || [],
                  `${cat.tabTitle.replace(/^\d+\.\s*/, '')} — ${sub.name} (${topic.title})`,
                  false
                );
                return `
                  <div
                    class="vm-topic-panel ${tIdx === 0 ? 'is-active' : ''}"
                    id="panel-${topic.id}"
                    data-topic-panel="${topic.id}"
                  >
                    ${carouselHTML}
                  </div>
                `;
              }).join('');

              return `
                <div class="vm-subcat-block">
                  <div class="vm-subcat-header">
                    <div class="vm-subcat-title-wrap">
                      <h4 class="vm-subcat-title">${sub.name}</h4>
                    </div>
                  </div>

                  <!-- TAB CHỌN PHỤ (TOPICS) + NÚT LƯỚT CÙNG HÀNG -->
                  <div class="vm-topics-row">
                    <div class="vm-topics-nav" role="tablist" aria-label="Chủ đề bài đăng ${sub.name}">
                      ${topicTabsHTML}
                    </div>
                    ${topicControlsHTML ? `<div class="vm-topics-controls-wrap">${topicControlsHTML}</div>` : ''}
                  </div>

                  <div class="vm-topics-container">
                    ${topicPanelsHTML}
                  </div>
                </div>
              `;
            }

            // Trường hợp subcategory thông thường (không có topics)
            const postsList = sub.posts || sub.images || [];
            const headerControlsHTML = renderSliderControlsHTML(postsList.length);
            const carouselHTML = renderPostsCarousel(
              postsList,
              `${cat.tabTitle.replace(/^\d+\.\s*/, '')} — ${sub.name}`,
              false
            );

            return `
              <div class="vm-subcat-block">
                <div class="vm-subcat-header">
                  <div class="vm-subcat-title-wrap">
                    <h4 class="vm-subcat-title">${sub.name}</h4>
                  </div>
                  ${headerControlsHTML}
                </div>
                ${carouselHTML}
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

    // Render toàn bộ cấu trúc 3 phần theo bố cục Bento gọn gàng
    root.innerHTML = `
      <!-- ==================== 1. KHUNG NGANG 1: GIỚI THIỆU CÔNG TY (TRÁI) + 4 NHIỆM VỤ PHẠM VI CÔNG VIỆC (PHẢI) ==================== -->
      <section class="vm-bento-band vm-bento-top vm-reveal" aria-label="Giới thiệu công ty VM Style và Phạm vi công việc">
        <div class="vm-bento-intro">
          <div class="vm-bento-brand-row">
            <div class="vm-bento-logo">
              <img src="${company.logoUrl}" alt="${company.logoAlt}" loading="lazy">
            </div>
            <div class="vm-bento-brand-meta">
              <span class="vm-bento-kicker">${escapeHTML(company.industry)} · ${escapeHTML(company.period)}</span>
              <h3 class="vm-bento-title">${escapeHTML(company.brandName)}</h3>
            </div>
          </div>

          <p class="vm-bento-role">${escapeHTML(company.role)}</p>
          <p class="vm-bento-summary">${escapeHTML(company.summary)}</p>

          <a href="#vm-stats-counter-card" class="vm-bento-cta">
            <span>Xem minh chứng thực tế</span>
            <span class="vm-bento-cta-ico" aria-hidden="true"><i data-lucide="arrow-down" aria-hidden="true"></i></span>
          </a>
        </div>

        <div class="vm-bento-scope-grid" aria-label="${escapeHTML(overview.responsibilities.title)}">
          ${overview.responsibilities.items
            .map(
              (item, idx) => `
            <article class="vm-bento-scope-card vm-scope-v${(idx % 4) + 1}">
              <span class="vm-bento-scope-ico" aria-hidden="true">
                <i data-lucide="${item.icon}" aria-hidden="true"></i>
              </span>
              <h4 class="vm-bento-scope-title">${escapeHTML(item.title)}</h4>
              <p class="vm-bento-scope-text">${escapeHTML(item.text)}</p>
              <div class="vm-bento-scope-accent" aria-hidden="true"></div>
            </article>
          `
            )
            .join('')}
        </div>
      </section>

      <!-- ==================== 2. KHUNG NGANG 2: ẢNH MINH HỌA (TRÁI) + CÁCH TRIỂN KHAI (PHẢI) ==================== -->
      <section class="vm-bento-band vm-bento-exec vm-reveal" aria-label="Cách triển khai tại VM Style">
        <div class="vm-bento-media ${overview.execution.imageUrl ? 'has-image' : ''}">
          ${
            overview.execution.imageUrl
              ? `<img src="${overview.execution.imageUrl}" alt="${escapeHTML(overview.execution.imageAlt || overview.execution.title)}" loading="lazy">`
              : `
                <div class="vm-bento-media-placeholder">
                  <span class="vm-bento-media-ico" aria-hidden="true"><i data-lucide="image-plus" aria-hidden="true"></i></span>
                  <strong>Khung ảnh minh họa</strong>
                  <span>Chừa sẵn vị trí để cập nhật ảnh hoạt động / sản phẩm</span>
                </div>
              `
          }
        </div>

        <div class="vm-bento-exec-content">
          <div class="vm-bento-exec-head">
            <span class="vm-bento-kicker">${escapeHTML(overview.execution.title)}</span>
            <h3 class="vm-bento-exec-title">Vận hành nội dung <span>đa kênh</span></h3>
          </div>

          <div class="vm-bento-exec-list">
            ${overview.execution.items
              .map(
                (item) => `
              <div class="vm-bento-exec-item">
                <span class="vm-bento-exec-ico" aria-hidden="true">
                  <i data-lucide="${item.icon}" aria-hidden="true"></i>
                </span>
                <div class="vm-bento-exec-text">
                  <h4>${escapeHTML(item.title)}</h4>
                  <p>${escapeHTML(item.text)}</p>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>

      <!-- ==================== 3. HẠNG MỤC CÔNG VIỆC (3 Thẻ tổng quan kèm Số liệu -> Mở Modal chi tiết) ==================== -->
      <div class="vm-work-wrapper vm-reveal" id="vm-stats-counter-card">
        <div class="vm-work-top vm-showcase-top">
          <div class="vm-work-heading">
            <h3>Hạng mục công việc &amp; Minh chứng thực tế</h3>
          </div>
          <p class="vm-showcase-sub">Tổng hợp các hạng mục thực chiến tại VM Style</p>
        </div>

        <div class="vm-showcase-grid">
          ${categories
            .map((cat, idx) => {
              const isFeatured = idx === 1;
              const stat = (overview.deliverables && overview.deliverables.stats && overview.deliverables.stats[idx]) || null;
              let visualHTML = '';
              if (cat.id === 'social-media') {
                visualHTML = `
                  <div class="vm-vis-social">
                    <div class="vm-vis-shot vm-vis-shot-back">
                      <img src="assets/images/posts/Screenshot_2.webp" alt="" loading="lazy">
                    </div>
                    <div class="vm-vis-shot vm-vis-shot-front">
                      <img src="assets/images/posts/Screenshot_1.webp" alt="" loading="lazy">
                    </div>
                  </div>
                `;
              } else if (cat.id === 'content-plan') {
                visualHTML = `
                  <div class="vm-vis-plan" aria-hidden="true">
                    <div class="vm-vis-plan-bar">
                      <span class="vm-vis-dot"></span><span class="vm-vis-dot"></span><span class="vm-vis-dot"></span>
                      <span class="vm-vis-plan-title">Content Calendar</span>
                    </div>
                    <div class="vm-vis-plan-grid">
                      <div class="vm-vis-cell is-hi"><span>T2</span><em>Lookbook</em></div>
                      <div class="vm-vis-cell"><span>T4</span><em>Mix &amp; Match</em></div>
                      <div class="vm-vis-cell is-hi"><span>T6</span><em>Reels BST</em></div>
                      <div class="vm-vis-cell"><span>T7</span><em>Feedback</em></div>
                      <div class="vm-vis-cell is-hi"><span>CN</span><em>Minigame</em></div>
                      <div class="vm-vis-cell"><span>+80</span><em>Bài/tháng</em></div>
                    </div>
                  </div>
                `;
              } else {
                visualHTML = `
                  <div class="vm-vis-report" aria-hidden="true">
                    <div class="vm-vis-report-head">
                      <span>Performance</span>
                      <strong>+75% Reach</strong>
                    </div>
                    <div class="vm-vis-bars">
                      <span style="height:36%"></span>
                      <span style="height:52%"></span>
                      <span style="height:46%"></span>
                      <span style="height:68%"></span>
                      <span style="height:82%"></span>
                      <span class="is-peak" style="height:100%"></span>
                    </div>
                  </div>
                `;
              }

              return `
                <button
                  type="button"
                  class="vm-showcase-card ${isFeatured ? 'is-featured' : ''}"
                  data-open-category="${cat.id}"
                  aria-label="Xem chi tiết ${escapeHTML(cat.tabTitle)}"
                >
                  <div class="vm-showcase-head">
                    <span class="vm-showcase-title">${escapeHTML(cat.tabTitle)}</span>
                    <span class="vm-showcase-arrow" aria-hidden="true">
                      <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div class="vm-showcase-divider" aria-hidden="true"></div>
                  ${stat ? `
                    <div class="vm-showcase-stat">
                      <strong
                        class="vm-stat-number vm-showcase-stat-num"
                        data-target="${stat.value}"
                        data-prefix="${stat.prefix || ''}"
                        data-suffix="${stat.suffix || ''}"
                      >${stat.prefix || ''}${stat.value}${stat.suffix || ''}</strong>
                      <span class="vm-showcase-stat-label">${escapeHTML(stat.label)}</span>
                    </div>
                  ` : `<p class="vm-showcase-desc">${escapeHTML(cat.description)}</p>`}
                  <div class="vm-showcase-visual">${visualHTML}</div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    // Tạo Modal Popup chi tiết cho 3 hạng mục lớn
    let workModalEl = document.getElementById('vm-work-modal');
    if (workModalEl) workModalEl.remove();
    workModalEl = document.createElement('div');
    workModalEl.id = 'vm-work-modal';
    workModalEl.className = 'vm-work-modal';
    workModalEl.setAttribute('role', 'dialog');
    workModalEl.setAttribute('aria-modal', 'true');
    workModalEl.setAttribute('aria-hidden', 'true');
    workModalEl.setAttribute('aria-label', 'Chi tiết hạng mục công việc VM Style');
    workModalEl.innerHTML = `
      <div class="vm-work-modal-dialog">
        <div class="vm-work-modal-header">
          <div class="vm-tabs-nav" role="tablist" aria-label="Các nhóm hạng mục công việc tại VM Style">
            ${tabsNavHTML}
          </div>
          <button type="button" class="vm-work-modal-close" id="vm-work-modal-close" aria-label="Đóng chi tiết">
            <i data-lucide="x" aria-hidden="true"></i>
          </button>
        </div>
        <div class="vm-work-modal-body" id="vm-work-modal-body">
          <div class="vm-tabs-content">
            ${tabsPanelsHTML}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(workModalEl);

    // Khởi tạo tương tác Modal chi tiết, Tabs, Slider lướt ngang, Hiệu ứng cuộn, Counter và Lightbox
    initTabs(workModalEl);
    initCarousels(workModalEl);
    initWorkModal(root, workModalEl);
    initScrollRevealAndCounters(root);
    initLightbox(workModalEl, lightboxItems);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* ==========================================================================
     2B. LOGIC MỞ / ĐÓNG MODAL CHI TIẾT HẠNG MỤC CÔNG VIỆC
     ========================================================================== */
  function initWorkModal(root, modalEl) {
    const closeBtn = modalEl.querySelector('#vm-work-modal-close');
    const bodyEl = modalEl.querySelector('#vm-work-modal-body');
    const cards = Array.from(root.querySelectorAll('.vm-showcase-card[data-open-category]'));
    const tabBtns = Array.from(modalEl.querySelectorAll('.vm-tab-btn'));

    function openWorkModal(categoryId) {
      const targetBtn = tabBtns.find((b) => b.getAttribute('data-tab-target') === categoryId);
      if (targetBtn) targetBtn.click();
      if (bodyEl) bodyEl.scrollTop = 0;

      modalEl.classList.add('is-open');
      modalEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    function closeWorkModal() {
      modalEl.classList.remove('is-open');
      modalEl.setAttribute('aria-hidden', 'true');
      const lb = document.getElementById('vm-lightbox-modal');
      if (!lb || !lb.classList.contains('is-open')) {
        document.body.style.overflow = '';
      }
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        openWorkModal(card.getAttribute('data-open-category'));
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeWorkModal);

    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeWorkModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const lb = document.getElementById('vm-lightbox-modal');
      if (lb && lb.classList.contains('is-open')) return;
      if (modalEl.classList.contains('is-open')) closeWorkModal();
    });
  }

  /* ==========================================================================
     3. LOGIC SLIDER LƯỚT NGANG BÀI VIẾT (CAROUSEL / HORIZONTAL SCROLL)
     ========================================================================== */
  function initCarousels(root) {
    const carouselContainers = Array.from(root.querySelectorAll('.vm-carousel-wrapper'));

    carouselContainers.forEach((container) => {
      const slider = container.querySelector('.vm-posts-slider');
      const topicPanel = container.closest('.vm-topic-panel');
      const subcatBlock = container.closest('.vm-subcat-block');
      let controlsScope = container;
      if (topicPanel && subcatBlock) {
        const topicId = topicPanel.getAttribute('data-topic-panel');
        controlsScope = subcatBlock.querySelector(`[data-topic-controls="${topicId}"]`) || container;
      } else if (subcatBlock) {
        controlsScope = subcatBlock.querySelector('.vm-subcat-header .vm-slider-controls') || container;
      }
      const prevBtn = controlsScope.querySelector('.vm-slider-prev');
      const nextBtn = controlsScope.querySelector('.vm-slider-next');
      const counterEl = controlsScope.querySelector('.vm-slider-current');
      const dots = Array.from(container.querySelectorAll('.vm-carousel-dot'));
      const cards = Array.from(container.querySelectorAll('.vm-post-card'));

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
     4. LOGIC CHUYỂN TAB HẠNG MỤC CÔNG VIỆC & TAB TOPIC PHỤ
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

    // Xử lý chuyển đổi các Tab Topic phụ (ví dụ trong Facebook)
    const topicNavs = Array.from(root.querySelectorAll('.vm-topics-nav'));
    topicNavs.forEach((nav) => {
      const topicBtns = Array.from(nav.querySelectorAll('.vm-topic-pill-btn'));
      const block = nav.closest('.vm-subcat-block');
      if (!block) return;
      const topicPanels = Array.from(block.querySelectorAll('.vm-topic-panel'));
      const topicControls = Array.from(block.querySelectorAll('[data-topic-controls]'));

      topicBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const topicId = btn.getAttribute('data-topic-id');

          topicBtns.forEach((b) => {
            const isCur = b === btn;
            b.classList.toggle('is-active', isCur);
            b.setAttribute('aria-selected', isCur ? 'true' : 'false');
          });

          topicPanels.forEach((panel) => {
            const isMatch = panel.getAttribute('data-topic-panel') === topicId;
            panel.classList.toggle('is-active', isMatch);
          });

          topicControls.forEach((ctrl) => {
            const isMatch = ctrl.getAttribute('data-topic-controls') === topicId;
            ctrl.classList.toggle('is-active', isMatch);
          });
        });
      });
    });
    // Xử lý chuyển đổi các chỉ số trên Biểu đồ Báo cáo đo lường
    const reportBlocks = Array.from(root.querySelectorAll('.vm-report-block'));
    reportBlocks.forEach((block) => {
      const metricBtns = Array.from(block.querySelectorAll('[data-report-metric]'));
      const chartPanels = Array.from(block.querySelectorAll('[data-report-panel]'));
      metricBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetMetric = btn.getAttribute('data-report-metric');
          metricBtns.forEach((b) => {
            const isCur = b === btn;
            b.classList.toggle('is-active', isCur);
            b.setAttribute('aria-pressed', isCur ? 'true' : 'false');
          });
          chartPanels.forEach((p) => {
            p.classList.toggle('is-active', p.getAttribute('data-report-panel') === targetMetric);
          });
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
            <span class="vm-lightbox-group" id="vm-lb-group">Hạng mục</span>
          </div>
          <div class="vm-lightbox-actions">
            <button type="button" class="vm-lb-btn" id="vm-lb-zoom" aria-label="Phóng to hoặc thu nhỏ ảnh">
              <i data-lucide="zoom-in" aria-hidden="true"></i> <span>Phóng to <span class="vm-lb-btn-hint">(1.5x)</span></span>
            </button>
            <button type="button" class="vm-lb-btn vm-lb-close" id="vm-lb-close" aria-label="Đóng khung xem ảnh">
              <i data-lucide="x" aria-hidden="true"></i> <span>Đóng <span class="vm-lb-btn-hint">(Esc)</span></span>
            </button>
          </div>
        </div>

        <div class="vm-lightbox-stage" id="vm-lb-stage">
          <button type="button" class="vm-lb-nav vm-lb-prev" id="vm-lb-prev" aria-label="Ảnh trước">
            <i data-lucide="chevron-left" aria-hidden="true"></i>
          </button>
          <div class="vm-lightbox-img-wrap" id="vm-lb-img-wrap">
            <img src="" alt="" class="vm-lightbox-img" id="vm-lb-img">
          </div>
          <button type="button" class="vm-lb-nav vm-lb-next" id="vm-lb-next" aria-label="Ảnh tiếp theo">
            <i data-lucide="chevron-right" aria-hidden="true"></i>
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
      zoomBtn.innerHTML = isZoomed
        ? '<i data-lucide="zoom-out" aria-hidden="true"></i> <span>Thu nhỏ <span class="vm-lb-btn-hint">(1x)</span></span>'
        : '<i data-lucide="zoom-in" aria-hidden="true"></i> <span>Phóng to <span class="vm-lb-btn-hint">(1.5x)</span></span>';
    }

    function showImage(index) {
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];

      setZoom(false);
      imgEl.src = item.src;
      imgEl.alt = item.alt || item.title || 'Ảnh bài post';
      captionEl.innerHTML = `
        <div class="vm-lb-caption-title">${escapeHTML(item.title || item.groupTitle)}</div>
        <div class="vm-lb-caption-body">${formatCaptionHTML(item.caption)}</div>
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
      const workModal = document.getElementById('vm-work-modal');
      if (!workModal || !workModal.classList.contains('is-open')) {
        document.body.style.overflow = '';
      }
      setZoom(false);
    }

    // Gắn sự kiện mở Lightbox cho tất cả ảnh trong Section
    root.addEventListener('click', (e) => {
      const trigger = e.target.closest('.vm-img-trigger, .vm-post-img-trigger, .vm-proof-btn');
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
