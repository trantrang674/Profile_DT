/**
 * Tương tác nhỏ cho trang chủ:
 * - Header đổ bóng khi cuộn
 * - Form liên hệ soạn sẵn email (mailto) thay vì giả lập gửi
 * - Năm hiện tại ở footer
 */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'trantrang674@gmail.com';

  // Header
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Contact form -> mailto
  var form = document.getElementById('portfolio-contact-form');
  var errorEl = document.getElementById('form-error');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var type = form.elements.work_type.value;
      var message = form.elements.message.value.trim();

      var missing = [];
      if (!name) missing.push('họ tên');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push('email hợp lệ');
      if (!message) missing.push('nội dung');

      if (missing.length) {
        errorEl.textContent = 'Vui lòng điền ' + missing.join(', ') + ' trước khi gửi.';
        errorEl.hidden = false;
        var first = !name ? form.elements.name : (missing.indexOf('email hợp lệ') > -1 ? form.elements.email : form.elements.message);
        first.focus();
        return;
      }
      errorEl.hidden = true;

      var subject = type + ' - ' + name;
      var body = message + '\n\n---\n' + name + '\n' + email;
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // ---------- Dải logo công cụ trượt ngang ----------
  // Tạo từ danh sách .tool-group để chỉ phải sửa công cụ ở một chỗ trong HTML
  var marquee = document.querySelector('.tools-marquee');
  if (marquee) {
    var tools = Array.prototype.map.call(document.querySelectorAll('.tool-group li'), function (li) {
      var img = li.querySelector('img');
      return { src: img ? img.getAttribute('src') : '', name: li.textContent.trim() };
    });
    if (tools.length) {
      var half = Math.ceil(tools.length / 2);
      var rows = [tools.slice(0, half), tools.slice(half)];
      marquee.innerHTML = rows.map(function (list, i) {
        var chips = list.map(function (t) {
          return '<span class="marquee-chip"><img src="' + t.src + '" alt="" width="22" height="22" loading="lazy">' + t.name + '</span>';
        }).join('');
        // Lặp nội dung 2 lần để dịch -50% tạo vòng lặp liền mạch
        return '<div class="marquee-row' + (i % 2 ? ' is-reverse' : '') + '">' + chips + chips + chips + chips + '</div>';
      }).join('');
    }
  }

  // ---------- Câu chuyện cuộn ở hero (GSAP + ScrollTrigger) ----------
  initHeroScrub();

  function initHeroScrub() {
    var root = document.documentElement;
    var hero = document.getElementById('home');
    if (!hero || !root.classList.contains('hero-scrub')) return;

    // Thiếu GSAP (mất mạng/CDN lỗi): quay về hiệu ứng tải trang bình thường
    if (!window.gsap || !window.ScrollTrigger) {
      root.classList.remove('hero-scrub');
      return;
    }

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    var del = hero.querySelector('.edit-mark del');
    var strike = hero.querySelector('.edit-mark .strike');
    var ins = hero.querySelector('.edit-mark ins');
    var results = hero.querySelectorAll('.hero-results li');
    var numbers = hero.querySelectorAll('.hero-results strong[data-to]');
    var facts = hero.querySelectorAll('.hero-facts dl > div');
    var scenes = hero.querySelectorAll('.hero-scenes li');

    function format(el, p) {
      var to = parseFloat(el.dataset.to);
      var dec = parseInt(el.dataset.dec || '0', 10);
      el.textContent = (el.dataset.prefix || '') + (to * p).toFixed(dec) + (el.dataset.suffix || '');
    }

    var current = -1;
    function setScene(i) {
      if (i === current) return;
      current = i;
      scenes.forEach(function (li, idx) { li.classList.toggle('is-active', idx === i); });
    }

    // Trạng thái "bản nháp"
    gsap.set(del, { color: '#0c2233' });
    gsap.set(strike, { scaleX: 0, rotate: -4, transformOrigin: 'left center' });
    gsap.set(ins, { opacity: 0, y: '0.2em' });
    gsap.set(results, { opacity: 0.3 });
    gsap.set(facts, { opacity: 0.3, x: 16 });
    numbers.forEach(function (el) { format(el, 0); });

    var counter = { p: 0 };
    var tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: hero,
        // Ghim ngay dưới header để không bị header che mất phần đầu hero
        start: function () { return 'top ' + (header ? header.offsetHeight : 0) + 'px'; },
        end: '+=170%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: function (self) { setScene(Math.min(3, Math.floor(self.progress * 4))); }
      }
    });

    // 1. Bản nháp (0–20): giữ nguyên để người xem đọc câu gốc
    // 2. Biên tập (20–45): gạch "đọc", chèn "mua"
    tl.to(del, { color: '#64748b', duration: 10 }, 20)
      .to(strike, { scaleX: 1, duration: 14, ease: 'power2.inOut' }, 22)
      .to(ins, { opacity: 1, y: 0, duration: 10 }, 34)
    // 3. Kết quả (50–75): số liệu chạy theo tiến độ cuộn
      .to(results, { opacity: 1, stagger: 4, duration: 8 }, 50)
      .to(counter, {
        p: 1, duration: 22, ease: 'none',
        onUpdate: function () { numbers.forEach(function (el) { format(el, counter.p); }); }
      }, 50)
    // 4. Hồ sơ (75–100): bảng thông tin nhanh hiện lần lượt
      .to(facts, { opacity: 1, x: 0, stagger: 3, duration: 10 }, 76)
      .to({}, { duration: 4 }, 96);

    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }

  // Mobile menu: đóng bằng phím Escape
  var toggle = document.querySelector('.mobile-toggle');
  var menu = document.getElementById('nav-menu');
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    }
  });
})();
