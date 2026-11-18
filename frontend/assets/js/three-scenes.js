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

  // Ảnh bìa dự án (lấy từ các file .md) xen kẽ thẻ số liệu thật trên trang
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { /* bỏ qua */ } }
  const covers = ['assets/images/project-ecotea.svg', 'assets/images/project-seo.svg', 'assets/images/project-coffee.svg', 'assets/images/project-email.svg'];
  const stats = [['4.1M+', 'lượt tiếp cận tự nhiên', 'dark'], ['+65%', 'tương tác tại VM Style', 'light'], ['360+', 'bài viết và Reels', 'dark'], ['41,5%', 'tỷ lệ mở email', 'light']];
  const coverCanvases = await Promise.all(covers.map(imageCard));
  const set = [];
  coverCanvases.forEach((c, i) => {
    if (c) set.push(c);
    set.push(statCard(...stats[i]));
  });
  // Lặp bộ thẻ 2 lần để vòng dày, thẻ nhỏ gọn như mẫu (ít hơn trên điện thoại)
  const cards = isSmall() ? set : set.concat(set);

  const N = cards.length;
  const R = 7.2;
  const gap = 0.07; // khoảng hở giữa các thẻ (radian)
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
  ring.position.set(0, 1.15, -4.6);
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
  if (!canvas) return;
  const renderer = makeRenderer(canvas);
  if (!renderer) return;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 8);
  scene.add(key);

  // Bảng màu cobalt của trang
  const palette = [0x1631c9, 0x5574f7, 0x93b4ff, 0xffffff, 0x2b4eff, 0xc7d2fe];
  const glossy = (color, opts = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.18, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, ...opts,
  });

  // Mỗi vật thể: hình, vị trí (theo tỉ lệ khung: -1..1), kích thước, độ sâu
  const specs = [
    { geo: new THREE.SphereGeometry(1, 48, 48), at: [-0.98, 0.78], s: 0.85, z: 1.5, c: 1 },
    { geo: new THREE.TorusGeometry(0.85, 0.32, 32, 72), at: [-0.55, -0.62], s: 0.9, z: 2.2, c: 0 },
    { geo: new RoundedBoxGeometry(1.4, 1.4, 1.4, 6, 0.32), at: [-1.02, -0.2], s: 0.75, z: 0.6, c: 2 },
    { geo: new THREE.CapsuleGeometry(0.45, 1.1, 12, 32), at: [0.98, 0.72], s: 0.8, z: 1.2, c: 4 },
    { geo: new THREE.SphereGeometry(1, 48, 48), at: [1.03, -0.55], s: 0.55, z: 2.6, c: 3 },
    { geo: new THREE.TorusKnotGeometry(0.55, 0.2, 128, 24), at: [-0.22, 0.95], s: 0.75, z: 1.8, c: 5 },
    { geo: new THREE.ConeGeometry(0.7, 1.3, 48), at: [0.55, -1.02], s: 0.6, z: 1.4, c: 1 },
  ];
  const objects = specs.map((sp, i) => {
    const mesh = new THREE.Mesh(sp.geo, glossy(palette[sp.c]));
    mesh.userData = { ...sp, phase: i * 1.37, spin: new THREE.Vector3(0.25 + (i % 3) * 0.12, 0.35 + (i % 2) * 0.2, 0.1), kick: 0 };
    mesh.rotation.set(i, i * 0.7, 0);
    scene.add(mesh);
    return mesh;
  });

  // Kích thước "khung" trong không gian 3D để đặt vật thể quanh viền khung thật
  let halfW = 6; let halfH = 3.6; let unit = 1;
  const resize = () => {
    const w = store.clientWidth; const h = store.clientHeight;
    const cw = canvas.clientWidth; const ch = canvas.clientHeight;
    renderer.setSize(cw, ch, false);
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const visW = visH * camera.aspect;
    halfW = (w / cw) * visW / 2;
    halfH = (h / ch) * visH / 2;
    // Kích thước vật thể tỉ lệ với chiều cao khung để không bị quá to
    unit = halfW * 0.17 * (isSmall() ? 0.8 : 1);
    objects.forEach((m) => {
      m.scale.setScalar(m.userData.s * unit);
      // đặt thẳng vào vị trí (khung tĩnh cho reduced-motion và khung đầu tiên)
      m.position.set(m.userData.at[0] * halfW, m.userData.at[1] * halfH, m.userData.z);
    });
  };
  resize();
  new ResizeObserver(resize).observe(store);

  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    const r = store.getBoundingClientRect();
    mouse.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1.5, 1.5);
    mouse.y = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1.5, 1.5);
  }, { passive: true });

  // Đổi nhóm công cụ: vật thể nảy + đổi màu xoay vòng
  let shift = 0;
  store.addEventListener('store:change', (e) => {
    shift = e.detail.index;
    objects.forEach((m, i) => {
      m.userData.kick = 1;
      m.material.color.setHex(palette[(m.userData.c + shift) % palette.length]);
    });
  });

  loopWhenVisible(store, (dt, t) => {
    objects.forEach((m) => {
      const u = m.userData;
      const bob = Math.sin(t * 0.9 + u.phase) * 0.18;
      const tx = u.at[0] * halfW + mouse.x * 0.25 * u.z;
      const ty = u.at[1] * halfH + bob - mouse.y * 0.18 * u.z;
      m.position.x += (tx - m.position.x) * 0.08;
      m.position.y += (ty - m.position.y) * 0.08;
      m.position.z = u.z;
      u.kick *= 0.92;
      m.rotation.x += dt * u.spin.x * (1 + u.kick * 10);
      m.rotation.y += dt * u.spin.y * (1 + u.kick * 10);
      const s = u.s * unit * (1 + Math.sin(u.kick * Math.PI) * 0.25);
      m.scale.setScalar(s);
    });
    renderer.render(scene, camera);
  });
  store.classList.add('has-3d');
}

initShowcase();
initStore();
