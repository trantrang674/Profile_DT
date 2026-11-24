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
      // Form gốc: 1 ô "Tên - Công ty - Email", ô hình thức hợp tác và ô nội dung
      var info = form.elements.contact_info.value.trim();
      var typeSel = form.elements.work_type;
      var type = typeSel.options[typeSel.selectedIndex].text.replace(/^Hình thức:\s*/, '');
      var message = form.elements.message.value.trim();

      var missing = [];
      if (!info) missing.push('tên, công ty, email');
      if (!message) missing.push('nội dung');

      if (missing.length) {
        if (errorEl) {
          errorEl.textContent = 'Vui lòng điền ' + missing.join(' và ') + ' trước khi gửi.';
          errorEl.hidden = false;
        }
        (!info ? form.elements.contact_info : form.elements.message).focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;

      var subject = type + ' - ' + info;
      var body = message + '\n\n---\n' + info;
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // ---------- Dải logo công cụ trượt ngang ----------
  // Tạo từ danh sách .tool-group để chỉ phải sửa công cụ ở một chỗ trong HTML
  var marquee = document.querySelector('.tools-marquee');
  if (marquee) {
    var tools = Array.prototype.map.call(document.querySelectorAll('.store-row'), function (li) {
      var img = li.querySelector('img');
      var name = li.querySelector('.store-name');
      return { src: img ? img.getAttribute('src') : '', name: (name || li).textContent.trim() };
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

  // ---------- Khung Bộ công cụ: chuyển nhóm bằng thanh dock ----------
  var store = document.querySelector('[data-store]');
  if (store) {
    var tabsEls = store.querySelectorAll('.store-tab');
    var rowsEls = store.querySelectorAll('.store-row');
    var big = store.querySelector('.store-big');
    var count = store.querySelector('.store-count strong');
    var selectGroup = function (tab) {
      var group = tab.dataset.group;
      tabsEls.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var i = 0;
      rowsEls.forEach(function (r) {
        var show = r.dataset.group === group;
        r.hidden = !show;
        if (show) { r.style.setProperty('--i', i++); r.classList.remove('is-in'); void r.offsetWidth; r.classList.add('is-in'); }
      });
      if (big) { big.textContent = tab.dataset.label; big.classList.remove('is-in'); void big.offsetWidth; big.classList.add('is-in'); }
      if (count) count.textContent = tab.dataset.count;
      // Báo cho cảnh 3D để các vật thể xoay/nảy theo nhóm mới
      store.dispatchEvent(new CustomEvent('store:change', { detail: { group: group, index: Array.prototype.indexOf.call(tabsEls, tab) } }));
    };
    tabsEls.forEach(function (t) { t.addEventListener('click', function () { selectGroup(t); }); });
    // Phím mũi tên trái/phải để chuyển nhóm
    store.querySelector('.store-dock').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = Array.prototype.slice.call(tabsEls);
      var idx = list.indexOf(document.activeElement);
      if (idx < 0) return;
      var next = list[(idx + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      next.focus(); selectGroup(next);
    });
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

    var q = function (sel) { return hero.querySelector(sel); };
    var qa = function (sel) { return hero.querySelectorAll(sel); };

    var copy = q('.hero-copy');
    var title = q('.hero-title');
    var deck = q('.hero-deck');
    var resultsList = q('.hero-results');
    var del = q('.edit-mark del');
    var strike = q('.edit-mark .strike');
    var ins = q('.edit-mark ins');
    var results = qa('.hero-results li');
    var numbers = qa('.hero-results strong[data-to]');
    var scenes = qa('.hero-scenes li');
    var pNote = q('[data-panel="note"]');
    var pInsight = q('[data-panel="insight"]');
    var pChannels = q('[data-panel="channels"]');
    var pFacts = q('[data-panel="facts"]');
    var resolved = q('.deck-resolved');
    var channelRows = qa('[data-panel="channels"] li');
    var factRows = qa('[data-panel="facts"] dl > div');
    var orbA = q('.hero-orb--a');
    var orbB = q('.hero-orb--b');
    var fluted = q('.hero-fluted');
    var bigNum = q('.hero-scene-num');
    var bigName = q('.hero-scene-name');
    var bar = q('.hero-progress span');
    var SCENES = scenes.length || 6;
    var names = ['Phạm vi', 'Biên tập', 'Chiến lược', 'Kênh', 'Kết quả', 'Thông tin nhanh'];

    function format(el, p) {
      var to = parseFloat(el.dataset.to);
      var dec = parseInt(el.dataset.dec || '0', 10);
      el.textContent = (el.dataset.prefix || '') + (to * p).toFixed(dec) + (el.dataset.suffix || '');
    }

    // Đổi số cảnh lớn ở nền + chỉ báo bên dưới mỗi khi sang cảnh mới
    var current = -1;
    function setScene(i) {
      if (i === current) return;
      var down = i > current;
      current = i;
      scenes.forEach(function (li, idx) {
        li.classList.toggle('is-active', idx === i);
        li.classList.toggle('is-done', idx < i);
      });
      if (bigNum) {
        bigNum.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
        bigName.textContent = names[i] || '';
        gsap.fromTo([bigNum, bigName], { y: down ? 60 : -60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.06, overwrite: true });
      }
    }

    var FOCUS_DIM = 0.32;

    // Trạng thái đầu: tiêu đề nổi bật, bảng Insight hiển thị ban đầu
    gsap.set(del, { color: '#ffffff' });
    gsap.set(strike, { scaleX: 0, rotate: -4, transformOrigin: 'left center' });
    gsap.set(ins, { autoAlpha: 0, scale: 1.8, filter: 'blur(10px)', transformOrigin: 'left 70%' });
    gsap.set(deck, { opacity: 0.9, scale: 1, transformOrigin: 'right center' });
    if (pInsight) gsap.set(pInsight, { autoAlpha: 1, x: 0, rotateY: 0, filter: 'blur(0px)' });
    gsap.set([pChannels, pFacts], { autoAlpha: 0, x: 90, rotateY: -14, filter: 'blur(8px)' });
    gsap.set(channelRows, { autoAlpha: 0, x: 40 });
    gsap.set(factRows, { autoAlpha: 0, x: 40 });
    gsap.set(results, { opacity: 0.25 });
    gsap.set(resultsList, { transformOrigin: 'left bottom' });
    numbers.forEach(function (el) { format(el, 0); });

    // Điểm dừng của 6 cảnh trên dòng thời gian 120 đơn vị (khớp với các nhãn s1–s6 bên dưới)
    var STOPS = [0, 36, 55, 76, 96, 118].map(function (t) { return t / 120; });

    var counter = { p: 0 };
    var tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: hero,
        // Header trong suốt nằm đè lên hero (như bản gốc) nên ghim từ đỉnh màn hình
        start: 'top top',
        end: '+=360%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        // Mỗi lần lướt sẽ dừng đúng ở một cảnh để người xem thấy rõ sự thay đổi
        snap: {
          snapTo: function (value, self) {
            // Luôn dừng ở cảnh kế tiếp theo hướng cuộn (không nhảy cóc qua cảnh)
            var p = self.progress;
            if (self.direction > 0) {
              for (var i = 0; i < STOPS.length; i++) if (STOPS[i] > p + 0.003) return STOPS[i];
              return 1;
            }
            for (var j = STOPS.length - 1; j >= 0; j--) if (STOPS[j] < p - 0.003) return STOPS[j];
            return 0;
          },
          duration: { min: 0.4, max: 0.9 }, delay: 0.15, ease: 'power2.inOut'
        },
        onUpdate: function (self) {
          setScene(Math.min(SCENES - 1, Math.floor(self.progress * SCENES)));
          if (bar) bar.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
        }
      }
    });

    // Mỗi cảnh chiếm 20 đơn vị (6 cảnh = 120). Nhãn là điểm dừng khi snap.
    tl.addLabel('s1', 0)
    // 2. Biên tập: tiêu đề phóng lên, gạch "đọc", "mua" bật ra
      .to(title, { scale: 1.06, transformOrigin: 'left center', duration: 6 }, 20)
      .to(del, { color: 'rgba(255,255,255,0.45)', duration: 5 }, 21)
      .to(strike, { scaleX: 1, duration: 7, ease: 'power2.inOut' }, 22)
      .to(ins, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 7, ease: 'back.out(2)' }, 28)
      .to(deck, { opacity: 0.95, duration: 5 }, 30)
      .to(orbA, { x: 260, y: 60, scale: 1.25, duration: 14, ease: 'sine.inOut' }, 20)
      .addLabel('s2', 36)
    // 3. Insight: tiêu đề lùi lại, bảng Insight sáng lên
      .to(title, { scale: 1, duration: 6 }, 40)
      .to(copy, { opacity: FOCUS_DIM, x: -24, duration: 6 }, 40)
      .to(deck, { opacity: 1, scale: 1.06, duration: 7 }, 40)
      .to(deck, { '--deck-glow': 1, duration: 6 }, 41)
      .to(orbB, { x: -320, y: -140, scale: 1.3, duration: 16, ease: 'sine.inOut' }, 40)
      .to(fluted, { backgroundPositionX: '-120px', duration: 40, ease: 'none' }, 40)
      .addLabel('s3', 55)
    // 4. Kênh: bảng kênh lật vào, từng dòng trượt vào
      .to(pInsight, { autoAlpha: 0, x: -90, rotateY: 14, filter: 'blur(8px)', duration: 6 }, 61)
      .to(pChannels, { autoAlpha: 1, x: 0, rotateY: 0, filter: 'blur(0px)', duration: 8 }, 63)
      .to(channelRows, { autoAlpha: 1, x: 0, stagger: 1.6, duration: 5 }, 66)
      .to(orbA, { x: 520, y: -80, scale: 1.1, duration: 16, ease: 'sine.inOut' }, 60)
      .addLabel('s4', 76)
    // 5. Kết quả: mọi thứ khác tối đi, hàng số liệu phóng to và chạy số
      .to(deck, { opacity: FOCUS_DIM, scale: 0.96, '--deck-glow': 0, duration: 6 }, 80)
      .to(resultsList, { scale: 1.05, duration: 7 }, 80)
      .to(results, { opacity: 1, stagger: 2, duration: 5 }, 81)
      .to(resultsList, { '--num-glow': 1, duration: 6 }, 82)
      .to(counter, {
        p: 1, duration: 12, ease: 'power1.out',
        onUpdate: function () { numbers.forEach(function (el) { format(el, counter.p); }); }
      }, 81)
      .to(orbB, { x: -80, y: -260, scale: 1.5, duration: 16, ease: 'sine.inOut' }, 80)
      .addLabel('s5', 96)
    // 6. Hồ sơ: mọi thứ sáng lại, bảng thông tin nhanh hiện lần lượt
      .to(resultsList, { scale: 1, '--num-glow': 0, duration: 6 }, 100)
      .to(copy, { opacity: 1, x: 0, duration: 7 }, 100)
      .to(deck, { opacity: 1, scale: 1, duration: 6 }, 100)
      .to(pChannels, { autoAlpha: 0, x: -90, rotateY: 14, filter: 'blur(8px)', duration: 6 }, 101)
      .to(pFacts, { autoAlpha: 1, x: 0, rotateY: 0, filter: 'blur(0px)', duration: 8 }, 103)
      .to(factRows, { autoAlpha: 1, x: 0, stagger: 1.6, duration: 5 }, 106)
      .to([orbA, orbB], { x: 0, y: 0, scale: 1, duration: 16, ease: 'sine.inOut' }, 100)
      .addLabel('s6', 118)
      .to({}, { duration: 2 }, 118);

    setScene(0);
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
