/**
 * HIỆU ỨNG 3D (Three.js)
 * 1. #showcase: vòng ảnh bìa dự án + thẻ số liệu uốn cong, xoay quanh ảnh chân dung
 * 2. [data-store]: vật thể 3D bóng bẩy trôi lơ lửng, tràn ra ngoài khung "Bộ công cụ"
 *
 * - Chỉ render khi section đang hiện trên màn hình (tiết kiệm pin/CPU)
 * - prefers-reduced-motion: vẽ một khung hình tĩnh, không chuyển động
 * - Không có WebGL: ẩn canvas, trang vẫn hiển thị bình thường
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = () => window.innerWidth < 760;

function makeRenderer(canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    return renderer;
  } catch (e) {
    canvas.style.display = 'none';
    return null;
  }
}

/** Chạy vòng lặp render chỉ khi phần tử đang trong khung nhìn */
function loopWhenVisible(el, tick) {
  let running = false;
  let raf = 0;
  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    tick(dt, now / 1000);
    if (running) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !running && !reduceMotion) {
      running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    } else if (!visible && running) {
      running = false; cancelAnimationFrame(raf);
    }
  }, { rootMargin: '120px 0px' });
  io.observe(el);
  // Luôn vẽ ít nhất một khung (dùng cho reduced-motion)
  tick(0, performance.now() / 1000);
}

/* ------------------------------------------------------------------------
   Vẽ ảnh lên canvas bo góc để làm texture (SVG có width 100% cần kích thước rõ)
   ------------------------------------------------------------------------ */
const CARD_W = 800;
const CARD_H = 500;

function roundedCanvas(draw) {
  const c = document.createElement('canvas');
  c.width = CARD_W; c.height = CARD_H;
  const ctx = c.getContext('2d');
  const r = 36;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.arcTo(CARD_W, 0, CARD_W, CARD_H, r); ctx.arcTo(CARD_W, CARD_H, 0, CARD_H, r);
  ctx.arcTo(0, CARD_H, 0, 0, r); ctx.arcTo(0, 0, CARD_W, 0, r); ctx.closePath();
  ctx.clip();
  draw(ctx);
  return c;
}

function imageCard(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(roundedCanvas((ctx) => ctx.drawImage(img, 0, 0, CARD_W, CARD_H)));
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function statCard(value, label, tone) {
  return roundedCanvas((ctx) => {
    const g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    if (tone === 'light') { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#dfe7ff'); }
    else { g.addColorStop(0, '#10249e'); g.addColorStop(1, '#2b4eff'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_W, CARD_H);
    // sọc kính mờ như hero
    ctx.globalAlpha = tone === 'light' ? 0.05 : 0.12;
    for (let x = 0; x < CARD_W; x += 46) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x, 0, 2, CARD_H); }
    ctx.globalAlpha = 1;
    const ink = tone === 'light' ? '#070c22' : '#ffffff';
    const sub = tone === 'light' ? '#4b5878' : 'rgba(226,235,255,0.85)';
    ctx.fillStyle = tone === 'light' ? '#1631c9' : '#93b4ff';
    ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Kết quả thực tế', 56, 84);
    ctx.fillStyle = ink;
    ctx.font = '800 150px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(value, 50, 290);
    ctx.fillStyle = sub;
    ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(label, 56, 380);
  });
}

function brandLogoCard(brand) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = roundedCanvas((ctx) => {
        // Nền trắng tinh khôi chuẩn giao diện Light Mode
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CARD_W, CARD_H);

        // Ánh gradient nhẹ nhàng tạo chiều sâu nổi khối
        const bgG = ctx.createLinearGradient(0, 0, 0, CARD_H);
        bgG.addColorStop(0, '#ffffff');
        bgG.addColorStop(1, '#f8fafc');
        ctx.fillStyle = bgG;
        ctx.fillRect(0, 0, CARD_W, CARD_H);

        // Viền thẻ bo tròn sang trọng
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 5;
        ctx.strokeRect(3, 3, CARD_W - 6, CARD_H - 6);

        // Hiển thị logo to rõ tối đa ra sát khung thẻ (chỉ giữ lề nhỏ tinh tế)
        const maxW = 710;
        const maxH = 420;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (CARD_W - dw) / 2;
        const dy = (CARD_H - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
      });
      resolve(c);
    };
    img.onerror = () => resolve(null);
    img.src = brand.src;
  });
}

/* ========================================================================
   1. VÒNG ẢNH 3D QUANH CHÂN DUNG
   ======================================================================== */
async function initShowcase() {
  const section = document.getElementById('showcase');
  const canvas = section && section.querySelector('.showcase-3d');
  if (!canvas) return;
  const renderer = makeRenderer(canvas);
  if (!renderer) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050a24, 6, 15);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 0);

  const ring = new THREE.Group();
  scene.add(ring);

  // Danh sách 10 logo thương hiệu đồng hành (ảnh đã được cắt sát viền để phóng to rõ nét)
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { /* bỏ qua */ } }
  const brands = [
    { src: 'assets/images/brands/tnc.webp' },
    { src: 'assets/images/brands/datbike.webp' },
    { src: 'assets/images/brands/vm-style.webp' },
    { src: 'assets/images/brands/mella.webp' },
    { src: 'assets/images/brands/lalie.webp' },
    { src: 'assets/images/brands/myun.webp' },
    { src: 'assets/images/brands/bylen.webp' },
    { src: 'assets/images/brands/baotin-express.webp' },
    { src: 'assets/images/brands/local-tea.webp' },
    { src: 'assets/images/brands/apollo.webp' }
  ];
  const brandCanvases = await Promise.all(brands.map(brandLogoCard));
  const set = brandCanvases.filter(Boolean);
  // Lặp bộ thẻ để vòng quay 3D dày dặn và mượt mà
  const cards = isSmall() ? set : set.concat(set);

  const N = cards.length;
  const R = 7.0;
  const gap = 0.045; // Khoảng hở gọn hơn để thẻ to và liền mạch hơn
  const arc = (Math.PI * 2) / N - gap;
  const height = (arc * R) * (CARD_H / CARD_W);
  cards.forEach((c, i) => {
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.x = -1; // nhìn từ bên trong vòng nên lật ngang lại
    const geo = new THREE.CylinderGeometry(R, R, height, 28, 1, true, i * (arc + gap), arc);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, transparent: true });
    ring.add(new THREE.Mesh(geo, mat));
  });
  ring.position.set(0, 1.25, -4.2);
  ring.rotation.x = 0.06;

  // Tương tác: chuột nghiêng vòng, tốc độ cuộn trang làm vòng quay nhanh hơn
  const target = { x: 0, y: 0 };
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  section.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });
  let lastY = window.scrollY;
  let boost = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    boost = Math.min(boost + Math.abs(y - lastY) * 0.0009, 1.4);
    lastY = y;
  }, { passive: true });

  const resize = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = isSmall() ? 62 : 42;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(section);

  let angle = 0;
  loopWhenVisible(section, (dt) => {
    angle += dt * (0.09 + boost * 0.6);
    boost *= 0.94;
    ring.rotation.y = angle;
    ring.rotation.z += ((target.x * -0.05) - ring.rotation.z) * 0.06;
    ring.rotation.x += ((0.06 + target.y * 0.05) - ring.rotation.x) * 0.06;
    camera.position.x += ((target.x * 0.35) - camera.position.x) * 0.05;
    renderer.render(scene, camera);
  });
  section.classList.add('has-3d');
}

/* ========================================================================
   2. VẬT THỂ 3D TRÔI QUANH KHUNG "BỘ CÔNG CỤ"
   ======================================================================== */
function initStore() {
  const store = document.querySelector('[data-store]');
  const canvas = store && store.querySelector('.store-3d');
  const card = store && store.querySelector('.store-card');
  if (!canvas || !card) return;
  const renderer = makeRenderer(canvas);
  if (!renderer) return;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 18);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 6, 8);
  scene.add(key);

  /* ---------- Vật liệu ---------- */
  const glossy = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.15, ...o });
  const M = {
    cobalt: glossy(0x2b4eff), royal: glossy(0x1631c9), peri: glossy(0x5574f7), ice: glossy(0xc7d2fe),
    white: glossy(0xf7f9ff), red: glossy(0xff4d6d), yellow: glossy(0xffc83d, { roughness: 0.4 }),
    wood: glossy(0xe8c39e, { roughness: 0.7, clearcoat: 0 }), graphite: glossy(0x2a2f3a, { roughness: 0.5 }),
    pink: glossy(0xff9bb3, { roughness: 0.6, clearcoat: 0.2 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xd9dee8, metalness: 1, roughness: 0.25 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.4, roughness: 0.05, ior: 1.4, transparent: true, opacity: 0.6 }),
    green: glossy(0x22c55e),
  };
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };

  /* ---------- Đồ vật gắn với nghề content (mỗi món cao khoảng 2 đơn vị) ---------- */
  function pencil() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.2, 6), M.yellow));
    g.add(mesh(new THREE.ConeGeometry(0.28, 0.6, 6), M.wood, 0, -1.4));
    g.add(mesh(new THREE.ConeGeometry(0.09, 0.2, 12), M.graphite, 0, -1.62));
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 24), M.metal, 0, 1.25));
    g.add(mesh(new THREE.CapsuleGeometry(0.27, 0.15, 8, 24), M.pink, 0, 1.55));
    g.rotation.z = -0.7;
    return g;
  }
  function megaphone() {
    const g = new THREE.Group();
    const horn = mesh(new THREE.CylinderGeometry(0.95, 0.32, 1.7, 40, 1, true), M.cobalt);
    horn.material = M.cobalt.clone(); horn.material.side = THREE.DoubleSide;
    horn.rotation.z = Math.PI / 2; g.add(horn);
    const rim = mesh(new THREE.TorusGeometry(0.95, 0.08, 16, 48), M.white, -0.85, 0); rim.rotation.y = Math.PI / 2; g.add(rim);
    g.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.5, 32), M.white, 1.05, 0).rotateZ(Math.PI / 2));
    g.add(mesh(new RoundedBoxGeometry(0.32, 0.9, 0.32, 4, 0.12), M.royal, 0.55, -0.7));
    g.rotation.set(0.2, 0.5, 0.25);
    return g;
  }
  function magnifier() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.TorusGeometry(0.75, 0.13, 20, 64), M.royal));
    g.add(mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 48), M.glass).rotateX(Math.PI / 2));
    const handle = mesh(new THREE.CapsuleGeometry(0.17, 1.0, 8, 24), M.graphite, 0.9, -0.9); handle.rotation.z = Math.PI / 4; g.add(handle);
    g.rotation.set(0.25, -0.4, 0);
    return g;
  }
  function chatBubble() {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(2.1, 1.35, 0.5, 6, 0.4), M.white));
    const tail = mesh(new THREE.ConeGeometry(0.28, 0.6, 24), M.white, -0.55, -0.8); tail.rotation.z = -0.5; g.add(tail);
    [-0.55, 0, 0.55].forEach((x) => g.add(mesh(new THREE.SphereGeometry(0.16, 24, 24), M.cobalt, x, 0, 0.27)));
    g.rotation.set(0.15, 0.35, 0.05);
    return g;
  }
  function heart() {
    const s = new THREE.Shape();
    s.moveTo(0, -0.9);
    s.bezierCurveTo(-0.1, -0.75, -1.1, -0.15, -1.0, 0.35);
    s.bezierCurveTo(-0.92, 0.8, -0.35, 1.0, 0, 0.55);
    s.bezierCurveTo(0.35, 1.0, 0.92, 0.8, 1.0, 0.35);
    s.bezierCurveTo(1.1, -0.15, 0.1, -0.75, 0, -0.9);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.14, bevelSegments: 8, curveSegments: 32 });
    geo.center();
    const g = new THREE.Group(); g.add(new THREE.Mesh(geo, M.red));
    g.rotation.set(0.1, -0.35, -0.15);
    return g;
  }
  function envelope() {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(2.0, 1.3, 0.22, 4, 0.08), M.ice));
    const flap = new THREE.Shape(); flap.moveTo(-0.98, 0.63); flap.lineTo(0.98, 0.63); flap.lineTo(0, -0.1); flap.closePath();
    const fg = new THREE.ExtrudeGeometry(flap, { depth: 0.05, bevelEnabled: false });
    g.add(mesh(fg, M.peri, 0, 0, 0.11));
    g.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32), M.red, 0, 0.0, 0.17).rotateX(Math.PI / 2));
    g.rotation.set(-0.2, -0.45, 0.15);
    return g;
  }
  function barChart() {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(2.0, 0.18, 0.9, 4, 0.06), M.white, 0, -0.9));
    [[-0.6, 0.7, M.ice], [0, 1.2, M.peri], [0.6, 1.75, M.cobalt]].forEach(([x, h, m]) => g.add(mesh(new RoundedBoxGeometry(0.42, h, 0.42, 4, 0.08), m, x, -0.8 + h / 2)));
    const arrow = mesh(new THREE.ConeGeometry(0.2, 0.4, 24), M.green, 0.95, 1.15); arrow.rotation.z = -0.6; g.add(arrow);
    g.rotation.set(0.2, -0.5, 0);
    return g;
  }
  function videoCard() {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(2.1, 1.35, 0.25, 6, 0.18), M.royal));
    const tri = new THREE.Shape(); tri.moveTo(-0.25, 0.32); tri.lineTo(0.35, 0); tri.lineTo(-0.25, -0.32); tri.closePath();
    const tg = new THREE.ExtrudeGeometry(tri, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 4 });
    g.add(mesh(tg, M.white, 0, 0, 0.12));
    g.rotation.set(0.1, 0.45, -0.1);
    return g;
  }

  /* ---------- Vị trí quanh khung thẻ (tọa độ -1..1 theo cạnh thẻ), tránh vùng chữ ---------- */
  // at: khi hai bên khung còn rộng | tight: khi khung gần chạm mép màn hình (chỉ dùng viền trên/dưới)
  const specs = [
    { make: pencil, at: [-1.04, 0.92], tight: [-0.78, 1.12], s: 0.95, z: 1.2 },
    { make: chatBubble, at: [-0.15, 1.12], tight: [-0.35, 1.13], s: 0.75, z: 0.8 },
    { make: magnifier, at: [0.98, 0.98], tight: [0.8, 1.1], s: 0.9, z: 1.6 },
    { make: barChart, at: [1.1, 0.02], tight: [0.56, -1.15], s: 0.85, z: 1.0 },
    { make: envelope, at: [0.86, -1.12], tight: [0.82, -1.12], s: 0.75, z: 1.4 },
    { make: videoCard, at: [0.55, 1.12], tight: [0.3, 1.13], s: 0.65, z: 0.4 },
    { make: heart, at: [-1.1, -0.38], tight: [-0.84, -1.12], s: 0.75, z: 1.8 },
    { make: megaphone, at: [-0.72, -1.12], tight: [-0.58, -1.14], s: 0.85, z: 1.0 },
  ];
  const objects = specs.map((sp, i) => {
    const obj = sp.make();
    obj.userData = { ...sp, phase: i * 1.37, base: obj.rotation.clone(), kick: 0, spin: 0 };
    scene.add(obj);
    return obj;
  });

  // Quy đổi vị trí thẻ thật (px) sang tọa độ 3D trên canvas
  let cx = 0; let cy = 0; let halfW = 6; let halfH = 3.6; let unit = 1;
  // Tọa độ -1..1 nằm trên khung; phần vượt quá viền (|v| > 1) đo theo cỡ món đồ, không theo cỡ khung
  const edge = (v, half) => (Math.abs(v) <= 1 ? v * half : Math.sign(v) * (half + (Math.abs(v) - 1) * 3.5 * unit));
  const resize = () => {
    const cr = canvas.getBoundingClientRect();
    const kr = card.getBoundingClientRect();
    renderer.setSize(cr.width, cr.height, false);
    camera.aspect = cr.width / cr.height;
    camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const k = visH / cr.height; // đơn vị 3D trên mỗi pixel
    cx = ((kr.left + kr.width / 2) - (cr.left + cr.width / 2)) * k;
    cy = -((kr.top + kr.height / 2) - (cr.top + cr.height / 2)) * k;
    halfW = (kr.width / 2) * k;
    halfH = (kr.height / 2) * k;
    // Món đồ cao khoảng 150px trên desktop, nhỏ hơn trên điện thoại
    unit = (isSmall() ? 70 : Math.min(150, kr.width * 0.1)) * k / 2;
    // Hai bên khung không đủ chỗ cho một món đồ thì chuyển sang cách xếp "tight"
    const sideRoom = Math.min(kr.left, window.innerWidth - kr.right);
    const tight = sideRoom < 150;
    objects.forEach((o) => {
      const t = o.userData.tight;
      // điện thoại: khung hẹp nên kéo các món vào giữa thêm
      o.userData.pos = tight ? [t[0] * (isSmall() ? 0.82 : 1), t[1]] : o.userData.at;
      o.scale.setScalar(o.userData.s * unit);
      o.position.set(cx + edge(o.userData.pos[0], halfW), cy + edge(o.userData.pos[1], halfH), o.userData.z);
    });
  };
  resize();
  new ResizeObserver(resize).observe(store);
  window.addEventListener('resize', resize);

  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    mouse.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1.5, 1.5);
    mouse.y = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1.5, 1.5);
  }, { passive: true });

  // Đổi nhóm công cụ: các món đồ xoay một vòng và nảy nhẹ
  store.addEventListener('store:change', () => {
    objects.forEach((o, i) => { o.userData.kick = 1; o.userData.spinFrom = o.userData.spin; o.userData.delay = i * 0.04; });
  });

  loopWhenVisible(store, (dt, t) => {
    objects.forEach((o) => {
      const u = o.userData;
      const bob = Math.sin(t * 0.9 + u.phase) * 0.12 * unit * 2;
      const tx = cx + edge(u.pos[0], halfW) + mouse.x * 0.12 * u.z * unit * 2;
      const ty = cy + edge(u.pos[1], halfH) + bob - mouse.y * 0.1 * u.z * unit * 2;
      o.position.x += (tx - o.position.x) * 0.08;
      o.position.y += (ty - o.position.y) * 0.08;
      // lắc lư nhẹ quanh góc nghiêng gốc + quay một vòng khi đổi nhóm
      if (u.kick > 0.001) { u.spin += dt * 9 * u.kick; u.kick *= 0.93; }
      o.rotation.x = u.base.x + Math.sin(t * 0.7 + u.phase) * 0.12 + mouse.y * 0.15;
      o.rotation.y = u.base.y + Math.sin(t * 0.5 + u.phase) * 0.2 + mouse.x * 0.2 + u.spin;
      o.rotation.z = u.base.z + Math.cos(t * 0.6 + u.phase) * 0.06;
      o.scale.setScalar(u.s * unit * (1 + Math.sin(Math.min(u.kick, 1) * Math.PI) * 0.18));
    });
    renderer.render(scene, camera);
  });
  store.classList.add('has-3d');
}

initShowcase();
initStore();
