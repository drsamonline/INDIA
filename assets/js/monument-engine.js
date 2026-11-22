/* ==========================================================================
   INDIA · Monument Engine
   A shared WebGL engine for procedural monument miniatures.

   Usage (from a monument page):
     import { boot } from '../assets/js/monument-engine.js';
     import monument from '../assets/js/monuments/<id>.js';
     boot(monument);

   Author: Dr Sohil Momin · License: CC BY-NC 4.0
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ------------------------------------------------------------------ utils */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
const $ = (id) => document.getElementById(id);
const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
const fmtClock = (t) => {
  t = ((t % 24) + 24) % 24;
  const h = Math.floor(t), m = Math.floor((t - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------------------------- palettes */
const PALETTE = {
  marble:        { color: 0xf6f1e6, rough: 0.52, tex: 'marble' },
  marbleWarm:    { color: 0xf0e5d1, rough: 0.58, tex: 'marble' },
  white:         { color: 0xfbf7ef, rough: 0.7 },
  ivory:         { color: 0xefe3ca, rough: 0.78 },
  cream:         { color: 0xe6d6b8, rough: 0.78 },
  sandstoneRed:  { color: 0xb5533c, rough: 0.86, tex: 'sandRed' },
  sandstoneBuff: { color: 0xd6ad7e, rough: 0.86, tex: 'sandstone' },
  sandstonePink: { color: 0xd98f7c, rough: 0.86, tex: 'sandstone' },
  granite:       { color: 0x9c968c, rough: 0.9, tex: 'granite' },
  plaster:       { color: 0xe2d5ba, rough: 0.84, tex: 'plaster' },
  plasterWhite:  { color: 0xf1ebde, rough: 0.84, tex: 'plaster' },
  gold:          { color: 0xd9a441, rough: 0.26, metal: 1.0 },
  goldLeaf:      { color: 0xf2c35e, rough: 0.19, metal: 1.0 },
  bronze:        { color: 0x8a6a3a, rough: 0.44, metal: 0.9 },
  copper:        { color: 0x8c5a3c, rough: 0.5, metal: 0.85 },
  black:         { color: 0x1a1712, rough: 0.8 },
  dark:          { color: 0x0f0c09, rough: 1.0 },
  teal:          { color: 0x2e8f86, rough: 0.7 },
  green:         { color: 0x4d7a3a, rough: 0.9 },
  terracotta:    { color: 0xb2603c, rough: 0.9 },
  brick:         { color: 0x9c4a34, rough: 0.9, tex: 'brick' },
  wood:          { color: 0x6b4a2f, rough: 0.8, tex: 'wood' },
  stone:         { color: 0x8f8a80, rough: 0.95, tex: 'stone' },
  grey:          { color: 0x6f6b64, rough: 0.9 },
  red:           { color: 0xa8322a, rough: 0.8 },
  blue:          { color: 0x2b4a8a, rough: 0.75 },
  yellow:        { color: 0xd8b23a, rough: 0.8 },
  pinkPaint:     { color: 0xc8607a, rough: 0.8 },
  water:         { color: 0x2f5a6b, rough: 0.14, metal: 0.15 },
  paving:        { color: 0xb6a992, rough: 0.95, tex: 'paving' },
  basalt:        { color: 0xc3b699, rough: 0.9, tex: 'stone' },
  haze:          { color: 0x6d7a6a, rough: 1.0 },
  hazeDark:      { color: 0x5b6659, rough: 1.0 },
  basaltDark:    { color: 0xa1937a, rough: 0.92, tex: 'stone' },
  jali:          { color: 0xd8b184, rough: 0.9, jali: true },
  jaliWhite:     { color: 0xf0e6d2, rough: 0.9, jali: true },
  glass:         { color: 0x9fc7d4, rough: 0.1, metal: 0.2, transparent: true, opacity: 0.45 },
  foliage:       { color: 0x3f6a35, rough: 0.92 },
  grass:         { color: 0x7d8a52, rough: 0.95, tex: 'grass' },
  bark:          { color: 0x5a4231, rough: 0.95 },
  sand:          { color: 0xd9c39a, rough: 1.0 },
  fabricRed:     { color: 0xc2452f, rough: 0.9 },
  fabricSaffron: { color: 0xe08a2e, rough: 0.9 },
  fabricWhite:   { color: 0xf2ecdf, rough: 0.9 }
};

/* --------------------------------------------------------------- textures */
function texFromCanvas(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function noiseOverlay(c, w, h, amount, size = 1, seed = 1) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < amount; i++) {
    const x = rnd() * w, y = rnd() * h, r = size * (0.4 + rnd() * 1.6);
    const a = 0.02 + rnd() * 0.09;
    c.fillStyle = rnd() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
}
function buildTextures(renderer) {
  const T = {};
  const size = 512;
  T.marble = texFromCanvas(size, size, (c, w, h) => {
    c.fillStyle = '#f8f3e8'; c.fillRect(0, 0, w, h);
    const rnd = mulberry32(7);
    for (let i = 0; i < 26; i++) {
      c.beginPath();
      let x = rnd() * w, y = rnd() * h;
      c.moveTo(x, y);
      for (let k = 0; k < 5; k++) {
        x += (rnd() - 0.5) * 190; y += (rnd() - 0.5) * 190;
        c.quadraticCurveTo(x + (rnd() - 0.5) * 90, y + (rnd() - 0.5) * 90, x, y);
      }
      c.strokeStyle = `rgba(${140 + rnd() * 40},${140 + rnd() * 40},${150 + rnd() * 40},${0.03 + rnd() * 0.07})`;
      c.lineWidth = 0.5 + rnd() * 2.4;
      c.stroke();
    }
    for (let i = 0; i < 14; i++) {
      const g = c.createRadialGradient(rnd() * w, rnd() * h, 0, rnd() * w, rnd() * h, 40 + rnd() * 130);
      g.addColorStop(0, 'rgba(226,222,206,.35)'); g.addColorStop(1, 'rgba(226,222,206,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    }
    noiseOverlay(c, w, h, 2600, 0.8, 3);
  });
  const stoneTex = (base, dark, light, seed) => texFromCanvas(size, size, (c, w, h) => {
    c.fillStyle = base; c.fillRect(0, 0, w, h);
    const rnd = mulberry32(seed);
    for (let i = 0; i < 420; i++) {
      c.fillStyle = rnd() > 0.5 ? dark : light;
      c.globalAlpha = 0.04 + rnd() * 0.12;
      c.beginPath(); c.ellipse(rnd() * w, rnd() * h, 3 + rnd() * 26, 2 + rnd() * 16, rnd() * 3, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    noiseOverlay(c, w, h, 4200, 0.7, seed + 1);
  });
  T.sandRed = stoneTex('#b5533c', '#8d3a2a', '#d07a5e', 11);
  T.sandstone = stoneTex('#d6ad7e', '#b8905f', '#e8cba0', 13);
  T.granite = stoneTex('#9c968c', '#6f6a61', '#c0bab0', 17);
  T.plaster = stoneTex('#e2d5ba', '#cbbda0', '#f4ecda', 19);
  T.stone = stoneTex('#8f8a80', '#6a655d', '#b0aaa0', 23);
  T.brick = texFromCanvas(size, size, (c, w, h) => {
    c.fillStyle = '#6d3524'; c.fillRect(0, 0, w, h);
    const bw = w / 8, bh = h / 16, rnd = mulberry32(29);
    for (let r = 0; r < 16; r++) {
      for (let k = 0; k < 8; k++) {
        const x = k * bw + (r % 2 ? bw / 2 : 0), y = r * bh;
        const v = 0.85 + rnd() * 0.3;
        c.fillStyle = `rgb(${Math.round(150 * v)},${Math.round(74 * v)},${Math.round(52 * v)})`;
        c.fillRect(x + 1.2, y + 1.2, bw - 2.4, bh - 2.4);
      }
    }
    noiseOverlay(c, w, h, 1800, 0.8, 31);
  });
  T.wood = texFromCanvas(256, 256, (c, w, h) => {
    c.fillStyle = '#6b4a2f'; c.fillRect(0, 0, w, h);
    const rnd = mulberry32(37);
    for (let i = 0; i < 70; i++) {
      c.strokeStyle = `rgba(${rnd() > 0.5 ? '40,26,16' : '140,105,72'},${0.06 + rnd() * 0.16})`;
      c.lineWidth = 0.6 + rnd() * 2;
      c.beginPath(); c.moveTo(0, rnd() * h);
      c.bezierCurveTo(w * 0.3, rnd() * h, w * 0.6, rnd() * h, w, rnd() * h); c.stroke();
    }
  });
  T.grass = texFromCanvas(256, 256, (c, w, h) => {
    c.fillStyle = '#6f7d4a'; c.fillRect(0, 0, w, h);
    const rnd = mulberry32(41);
    for (let i = 0; i < 3000; i++) {
      c.strokeStyle = `rgba(${90 + rnd() * 60},${105 + rnd() * 55},${55 + rnd() * 40},${0.2 + rnd() * 0.5})`;
      c.lineWidth = 0.8;
      const x = rnd() * w, y = rnd() * h;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - 0.5) * 3, y - 2 - rnd() * 4); c.stroke();
    }
  });
  T.sandGround = texFromCanvas(256, 256, (c, w, h) => {
    c.fillStyle = '#cdb88f'; c.fillRect(0, 0, w, h);
    noiseOverlay(c, w, h, 3600, 1.1, 43);
    const rnd = mulberry32(47);
    for (let i = 0; i < 90; i++) {
      c.strokeStyle = `rgba(150,128,92,${0.05 + rnd() * 0.1})`;
      c.lineWidth = 1 + rnd() * 3;
      c.beginPath(); c.moveTo(rnd() * w, rnd() * h);
      c.quadraticCurveTo(rnd() * w, rnd() * h, rnd() * w, rnd() * h); c.stroke();
    }
  });
  T.paving = texFromCanvas(256, 256, (c, w, h) => {
    c.fillStyle = '#a89c86'; c.fillRect(0, 0, w, h);
    const n = 4, s = w / n, rnd = mulberry32(53);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const v = 0.9 + rnd() * 0.22;
      c.fillStyle = `rgb(${Math.round(172 * v)},${Math.round(160 * v)},${Math.round(138 * v)})`;
      c.fillRect(x * s + 2, y * s + 2, s - 4, s - 4);
    }
    noiseOverlay(c, w, h, 2200, 0.9, 59);
  });
  T.jali = texFromCanvas(256, 256, (c, w, h) => {
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff';
    const n = 6, s = w / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const cx = x * s + s / 2, cy = y * s + s / 2;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const px = cx + Math.cos(a) * s * 0.33, py = cy + Math.sin(a) * s * 0.33;
        i ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.closePath(); c.fill();
    }
  }, false);
  T.waterNormal = (() => {
    const s = 256, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(s, s);
    const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
    const smooth = (t) => t * t * (3 - 2 * t);
    const pnoise = (x, y, period) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const hh = (a, b) => hash(((a % period) + period) % period, ((b % period) + period) % period);
      const u = smooth(xf), v = smooth(yf);
      return lerp(lerp(hh(xi, yi), hh(xi + 1, yi), u), lerp(hh(xi, yi + 1), hh(xi + 1, yi + 1), u), v);
    };
    const height = (x, y) => {
      let n = 0, amp = 1, freq = 1 / 32;
      for (let o = 0; o < 4; o++) {
        n += pnoise((x * freq) % 32, (y * freq) % 32, 32) * amp;
        amp *= 0.5; freq *= 2;
      }
      return n;
    };
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const hl = height((x - 1 + s) % s, y), hr = height((x + 1) % s, y);
        const hu = height(x, (y - 1 + s) % s), hd = height(x, (y + 1) % s);
        const dx = (hr - hl) * 1.6, dy = (hd - hu) * 1.6;
        const len = Math.hypot(dx, dy, 1);
        const i = (y * s + x) * 4;
        img.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
        img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
        img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  })();
  T.soft = texFromCanvas(64, 64, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  T.rain = texFromCanvas(16, 64, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(230,245,255,.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(w * 0.35, 0, w * 0.3, h);
  });
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  Object.values(T).forEach((t) => { if (t && t.isTexture) { t.anisotropy = maxAniso; t.needsUpdate = true; } });
  return T;
}

function buildMaterials(T) {
  const M = {};
  for (const [key, p] of Object.entries(PALETTE)) {
    const params = {
      color: p.color,
      roughness: p.rough !== undefined ? p.rough : 0.8,
      metalness: p.metal || 0
    };
    if (p.tex && T[p.tex]) {
      const t = T[p.tex].clone();
      t.needsUpdate = true;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
      params.map = t;
    }
    if (p.jali) {
      params.alphaMap = T.jali;
      params.transparent = true;
      params.alphaTest = 0.42;
      params.side = THREE.DoubleSide;
    }
    if (p.transparent) { params.transparent = true; params.opacity = p.opacity; }
    M[key] = new THREE.MeshStandardMaterial(params);
  }
  M.gold.envMapIntensity = 2.1;
  M.goldLeaf.envMapIntensity = 2.4;
  M.bronze.envMapIntensity = 1.6;
  M.marble.envMapIntensity = 1.15;
  M.marbleWarm.envMapIntensity = 1.15;
  M.glass.envMapIntensity = 1.8;
  return M;
}

/* ---------------------------------------------------------------- builder */
class Builder {
  constructor(scene, materials, textures, seed) {
    this.THREE = THREE;
    this.scene = scene;
    this.M = materials;
    this.T = textures;
    this.buckets = {};
    this.rng = mulberry32(seed || 1);
    this.animators = [];
    this.lights = [];
    this.root = new THREE.Group();
    scene.add(this.root);
  }
  /* ---- primitives ---- */
  box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  plane(w, h) { return new THREE.PlaneGeometry(w, h); }
  cyl(rt, rb, h, seg = 16, open = false) { return new THREE.CylinderGeometry(rt, rb, h, seg, 1, open); }
  cone(r, h, seg = 16) { return new THREE.ConeGeometry(r, h, seg); }
  sph(r, seg = 16) { return new THREE.SphereGeometry(r, seg, Math.max(8, Math.round(seg * 0.62))); }
  torus(r, tube, rs = 8, ts = 26) { return new THREE.TorusGeometry(r, tube, rs, ts); }
  ring(r, tube, rs = 6, ts = 20) { return new THREE.TorusGeometry(r, tube, rs, ts); }
  dome(r, h = r, seg = 26) {
    const g = new THREE.SphereGeometry(1, seg, Math.max(8, Math.round(seg * 0.5)), 0, Math.PI * 2, 0, Math.PI / 2);
    g.scale(r, h, r);
    return g;
  }
  onion(r, h = r * 1.5, seg = 30, pinch = 1) {
    const prof = [[0, 1], [0.08, 1.05], [0.2, 1.1], [0.34, 1.09], [0.48, 1.0], [0.62, 0.85],
      [0.74, 0.66], [0.85, 0.45], [0.93, 0.24], [0.985, 0.09], [1, 0.012]];
    const pts = [];
    const N = 34;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let j = 0;
      while (j < prof.length - 2 && t > prof[j + 1][0]) j++;
      const a = prof[j], b = prof[j + 1];
      const k = (t - a[0]) / (b[0] - a[0] || 1);
      const rad = lerp(a[1], b[1], k) * r * (pinch > 1 ? 1 : 1);
      pts.push(new THREE.Vector2(Math.max(rad, 0.0001), t * h));
    }
    return new THREE.LatheGeometry(pts, seg);
  }
  lathe(points, seg = 30) {
    return new THREE.LatheGeometry(points.map((p) => new THREE.Vector2(p[0], p[1])), seg);
  }
  archShape(w, h, spring = 0.55) {
    const s = new THREE.Shape();
    const hw = w / 2, sp = h * spring;
    s.moveTo(-hw, 0);
    s.lineTo(-hw, sp);
    s.quadraticCurveTo(-hw, h * 0.94, 0, h);
    s.quadraticCurveTo(hw, h * 0.94, hw, sp);
    s.lineTo(hw, 0);
    s.closePath();
    return s;
  }
  arch(w, h, depth = 0.4, spring = 0.55) {
    return new THREE.ExtrudeGeometry(this.archShape(w, h, spring), { depth, bevelEnabled: false, curveSegments: 7 });
  }
  archFrame(w, h, thick = 0.18, depth = 0.3) {
    const outer = this.archShape(w, h);
    const innerShape = this.archShape(w - thick * 2, h - thick * 1.1);
    const pts = innerShape.getPoints(28).map((p) => new THREE.Vector2(p.x, p.y + thick * 0.6));
    outer.holes.push(new THREE.Path(pts));
    return new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 7 });
  }
  /* ---- a garden bed ------------------------------------------------------
     A parterre: a bordered bed with a clipped hedge round it and a path
     between, instead of the scattered flower dots that stood in for planting.
     The hedge is the point — it gives the garden its geometry from above. */
  parterre(x, z, w, d, o = {}) {
    // y matters: without it every bed sits at ground level, which on a
    // terraced site means buried inside the building above
    const y0 = o.y ?? 0;
    const h = o.h ?? 0.55;
    const t = o.t ?? 0.4;
    const hedge = o.hedge ?? 'foliage';
    const bed = o.bed ?? 'grass';
    const ry = o.ry ?? 0;
    const c = Math.cos(ry), s2 = Math.sin(ry);
    const put = (key, bw, bh, bd, lx, ly, lz) =>
      this.add(key, this.box(bw, bh, bd), x + lx * c - lz * s2, y0 + ly, z + lx * s2 + lz * c, { ry });
    put(bed, w, 0.1, d, 0, 0.05, 0);
    put(hedge, w, h, t, 0, h / 2, -d / 2 + t / 2);
    put(hedge, w, h, t, 0, h / 2, d / 2 - t / 2);
    put(hedge, t, h, d - t * 2, -w / 2 + t / 2, h / 2, 0);
    put(hedge, t, h, d - t * 2, w / 2 - t / 2, h / 2, 0);
    if (o.cross) {
      // the charbagh cross-path, in the lighter paving
      put(o.path ?? 'paving', w - t * 2, 0.12, 1.1, 0, 0.1, 0);
      put(o.path ?? 'paving', 1.1, 0.12, d - t * 2, 0, 0.1, 0);
    }
    if (o.shrubs) {
      const n = o.shrubs;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        put(hedge, 0.5, 0.5, 0.5, Math.cos(a) * w * 0.3, 0.35, Math.sin(a) * d * 0.3);
      }
    }
  }
  /* ---- inlaid banding ----------------------------------------------------
     Pietra-dura: a field of one stone with a repeating motif set into it in
     another. The motif stands a few centimetres proud so it catches light at a
     grazing angle, which is how the real inlay reads from a distance. */
  inlay(fieldKey, motifKey, w, h, x, y, z, o = {}) {
    const ry = o.ry ?? 0;
    const depth = o.depth ?? 0.07;
    const n = o.n ?? Math.max(3, Math.round(w / (o.pitch ?? 1.4)));
    const step = w / n;
    const c = Math.cos(ry), s2 = Math.sin(ry);
    this.add(fieldKey, this.box(w, h, depth), x, y, z, { ry });
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * step;
      const px = x + off * c, pz = z - off * s2;
      const m = o.motif ?? 'diamond';
      if (m === 'diamond') {
        this.add(motifKey, this.box(step * 0.30, step * 0.30, depth * 1.3), px, y, pz + depth * 0.45, { ry, rz: Math.PI / 4 });
      } else if (m === 'lozenge') {
        this.add(motifKey, this.box(step * 0.22, h * 0.62, depth * 1.3), px, y, pz + depth * 0.45, { ry });
      } else {
        // a roundel
        this.add(motifKey, this.cyl(step * 0.19, step * 0.19, depth * 1.4, 12), px, y, pz + depth * 0.45, { ry, rx: Math.PI / 2 });
      }
    }
  }
  /* ---- a carved band -----------------------------------------------------
     A recessed course carrying repeated relief — the Kufic bands of the Qutb
     Minar, the friezes of Konark, the sculpture registers of Khajuraho. The
     relief is instanced blocks standing proud of a sunk backing, so it catches
     raking light and reads as carving rather than as a painted stripe. */
  carvedBand(key, w, h, x, y, z, o = {}) {
    const n = o.n ?? Math.max(4, Math.round(w / (o.pitch ?? 0.9)));
    const depth = o.depth ?? 0.14;
    const ry = o.ry ?? 0;
    const back = o.back ?? key;
    // the sunk field the relief stands on
    this.add(back, this.box(w, h, depth * 0.5), x, y, z, { ry });
    const c = Math.cos(ry), s2 = Math.sin(ry);
    const step = w / n;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * step;
      const px = x + off * c, pz = z - off * s2;
      if (o.motif === 'arch') {
        // a row of small blind arches, the commonest frieze in Indian stone
        this.add(key, this.arch(step * 0.56, h * 0.74, depth), px, y - h * 0.36, pz + depth * 0.35, { ry });
      } else {
        // a vertical relief block, standing for a line of inscription
        this.add(key, this.box(step * 0.42, h * 0.62, depth), px, y, pz + depth * 0.35, { ry });
        this.add(key, this.box(step * 0.30, h * 0.16, depth * 0.8), px, y + h * 0.38, pz + depth * 0.3, { ry });
      }
    }
  }
  /* ---- a pierced screen -------------------------------------------------
     A real lattice, cut as geometry: a rectangular panel with a grid of holes
     extruded through it, so light and sky pass between the bars. Every jali on
     the site was a flat dark plane before this; this is the same idea with the
     material actually removed. */
  jali(w, h, o = {}) {
    // a screen with many bays would rebuild the same extrusion hundreds of
    // times; cache by shape and hand out clones, since add() transforms in place
    const key = [w, h, o.cols, o.rows, o.bar, o.depth, o.cell, o.shape].join('|');
    this._jali = this._jali || {};
    if (this._jali[key]) return this._jali[key].clone();
    const bar = o.bar ?? 0.08;
    const depth = o.depth ?? 0.10;
    const cell = o.cell ?? 0.5;
    const cols = o.cols ?? Math.max(3, Math.round(w / cell));
    const rows = o.rows ?? Math.max(3, Math.round(h / cell));
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, h);
    shape.lineTo(-w / 2, h);
    shape.closePath();
    const cw = w / cols, ch = h / rows;
    const arch = o.shape === 'arch';
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = -w / 2 + (i + 0.5) * cw;
        const cy = (j + 0.5) * ch;
        const hw = Math.max(0.015, cw / 2 - bar);
        const hh = Math.max(0.015, ch / 2 - bar);
        if (arch && j === rows - 1) {
          // the top row of an arched screen is a small round-headed opening
          const path = new THREE.Path();
          path.moveTo(cx - hw, cy - hh);
          path.lineTo(cx + hw, cy - hh);
          path.lineTo(cx + hw, cy + hh * 0.15);
          path.absarc(cx, cy + hh * 0.15, hw, 0, Math.PI, false);
          path.lineTo(cx - hw, cy - hh);
          shape.holes.push(path);
        } else {
          const path = new THREE.Path();
          path.moveTo(cx - hw, cy - hh);
          path.lineTo(cx + hw, cy - hh);
          path.lineTo(cx + hw, cy + hh);
          path.lineTo(cx - hw, cy + hh);
          path.closePath();
          shape.holes.push(path);
        }
      }
    }
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 });
    this._jali[key] = g;
    return g.clone();
  }
  /* ---- placement ---- */
  add(key, geo, x = 0, y = 0, z = 0, o = {}) {
    if (!geo) return;
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (g !== geo) geo.dispose();
    // merging needs identical attributes on every geometry; a module that
    // builds a custom surface may omit uv or normal, which breaks the merge
    if (!g.getAttribute('uv')) {
      const n = g.getAttribute('position').count;
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    }
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(o.rx || 0, o.ry || 0, o.rz || 0, 'YXZ'));
    const s = new THREE.Vector3(o.sx ?? o.s ?? 1, o.sy ?? o.s ?? 1, o.sz ?? o.s ?? 1);
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, s);
    g.applyMatrix4(m);
    const k = typeof key === 'string' ? key : key.uuid;
    (this.buckets[k] = this.buckets[k] || []).push({ geo: g, mat: typeof key === 'string' ? null : key });
  }
  /* convenience: a block from base up */
  block(key, w, h, d, x, y, z, o) { return this.add(key, this.box(w, h, d), x, y + h / 2, z, o); }
  col(key, rt, rb, h, x, y, z, seg = 16, o) { return this.add(key, this.cyl(rt, rb, h, seg), x, y + h / 2, z, o); }
  /* ---- composite helpers ---- */
  chhatri(x, y, z, s = 1, key = 'sandstoneBuff', domeKey = 'white', o = {}) {
    const R = 1.5 * s;
    this.add(key, this.cyl(R * 0.95, R * 1.05, 0.22 * s, 8), x, y + 0.11 * s, z);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      this.add(key, this.cyl(0.13 * s, 0.15 * s, 1.5 * s, 6),
        x + Math.cos(a) * R * 0.72, y + 0.95 * s, z + Math.sin(a) * R * 0.72);
    }
    this.add(key, this.cyl(R * 1.02, R * 1.02, 0.16 * s, 8), x, y + 1.78 * s, z);
    this.add(domeKey, this.onion(R * 0.86, 1.5 * s, 20), x, y + 1.84 * s, z);
    this.add('gold', this.cyl(0.045 * s, 0.045 * s, 0.5 * s, 6), x, y + 3.4 * s, z);
    this.add('gold', this.sph(0.1 * s, 8), x, y + 3.72 * s, z);
  }
  arcade(key, opts) {
    const { count = 5, w = 2, h = 4, depth = 0.5, spacing = 2.6, x = 0, y = 0, z = 0, ry = 0, spring = 0.55, fill = 'dark' } = opts || {};
    for (let i = 0; i < count; i++) {
      const off = (i - (count - 1) / 2) * spacing;
      const px = x + Math.cos(ry) * off, pz = z - Math.sin(ry) * off;
      if (fill) this.add(fill, this.arch(w, h, 0.1, spring), px, y, pz, { ry });
      this.add(key, this.archFrame(w + 0.34, h + 0.2, 0.17, depth), px, y, pz, { ry });
    }
  }
  stairs(x, y, z, w, totalH, steps = 6, depth = 0.5, key = 'stone', ry = 0) {
    for (let i = 0; i < steps; i++) {
      const h = totalH * ((i + 1) / steps);
      const d = depth * (1 - i / (steps + 2));
      this.add(key, this.box(w, h, d), x, y + h / 2, z + (i - steps / 2) * depth, { ry });
    }
  }
  railing(x, y, z, len, key = 'stone', h = 0.9, ry = 0, posts = 6) {
    this.add(key, this.box(len, 0.12, 0.16), x, y + h, z, { ry });
    for (let i = 0; i < posts; i++) {
      const t = (i / (posts - 1) - 0.5) * len;
      this.add(key, this.box(0.16, h, 0.16), x + Math.cos(ry) * t, y + h / 2, z - Math.sin(ry) * t, { ry });
    }
  }
  tree(x, z, s = 1, kind = 'round') {
    const y = 0;
    if (kind === 'palm') {
      // a slightly curved trunk built from stacked segments
      for (let i = 0; i < 6; i++) {
        const k = i / 5;
        this.add('bark', this.cyl((0.19 - 0.055 * k) * s, (0.215 - 0.05 * k) * s, 0.95 * s, 7),
          x + k * k * 0.85 * s, y + (0.45 + i * 0.92) * s, z, { rz: -0.04 - k * 0.05 });
      }
      const top = 5.5 * s;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        this.add('foliage', this.box(0.55 * s, 0.06 * s, 2.7 * s),
          x + 0.85 * s + Math.cos(a) * 1.25 * s, y + top - 0.15 * s, z + Math.sin(a) * 1.25 * s,
          { ry: -a, rz: 0.52, rx: 0.08 });
      }
      this.add('foliage', this.sph(0.5 * s, 8), x + 0.85 * s, y + top, z, { sy: 0.7 });
      return;
    }
    if (kind === 'cypress') {
      this.add('bark', this.cyl(0.11 * s, 0.19 * s, 1.1 * s, 6), x, y + 0.55 * s, z);
      this.add('foliage', this.cone(0.85 * s, 3.2 * s, 10), x, y + 2.1 * s, z);
      this.add('foliage', this.cone(0.68 * s, 2.6 * s, 10), x, y + 3.5 * s, z);
      this.add('foliage', this.cone(0.46 * s, 2.0 * s, 9), x, y + 4.7 * s, z);
      return;
    }
    // broadleaf tree: tapered trunk, two branches, a canopy of six blobs
    this.add('bark', this.cyl(0.13 * s, 0.27 * s, 2.6 * s, 7), x, y + 1.3 * s, z);
    [[0.5, 2.35, 0.32, -0.5, 0.35], [-0.45, 2.5, -0.3, 0.5, -0.3]].forEach(([dx, yy, dz, rz, rx]) => {
      this.add('bark', this.cyl(0.06 * s, 0.1 * s, 1.25 * s, 5), x + dx * s, y + yy * s, z + dz * s, { rz, rx });
    });
    [[0, 3.7, 0, 1.5], [0.95, 3.25, 0.45, 1.05], [-0.9, 3.45, -0.5, 1.0],
     [0.3, 4.45, -0.65, 0.88], [-0.42, 4.2, 0.72, 0.82], [0.1, 2.95, 1.05, 0.78]]
      .forEach(([dx, yy, dz, r]) => {
        this.add('foliage', this.sph(r * s, 9), x + dx * s, y + yy * s, z + dz * s, { sy: 0.8 });
      });
  }
  person(x, z, ry = 0, key = 'fabricWhite', s = 1) {
    const y = 0, cs = Math.cos(ry), sn = Math.sin(ry);
    // legs
    [-1, 1].forEach((d) => {
      this.add('grey', this.cyl(0.075 * s, 0.09 * s, 0.78 * s, 6), x + cs * d * 0.11 * s, y + 0.39 * s, z - sn * d * 0.11 * s, { ry });
    });
    // torso and shoulders
    this.add(key, this.cyl(0.17 * s, 0.245 * s, 0.62 * s, 8), x, y + 1.06 * s, z, { ry });
    this.add(key, this.sph(0.19 * s, 8), x, y + 1.35 * s, z, { ry, sy: 0.62 });
    // arms
    [-1, 1].forEach((d) => {
      this.add(key, this.cyl(0.048 * s, 0.058 * s, 0.56 * s, 5),
        x + cs * d * 0.205 * s, y + 1.06 * s, z - sn * d * 0.205 * s, { ry, rz: d * 0.09 });
    });
    // neck and head
    this.add('bark', this.cyl(0.048 * s, 0.055 * s, 0.09 * s, 5), x, y + 1.45 * s, z);
    this.add('bark', this.sph(0.115 * s, 9), x, y + 1.56 * s, z, { sy: 1.1 });
    // a shawl across the shoulders
    this.add(key, this.cyl(0.2 * s, 0.25 * s, 0.1 * s, 8), x, y + 1.37 * s, z, { ry });
  }
  lamp(x, z, h = 3.2, key = 'black') {
    this.add(key, this.cyl(0.09, 0.13, h, 6), x, h / 2, z);
    this.add('gold', this.cyl(0.3, 0.22, 0.5, 6), x, h + 0.2, z);
    this.add('gold', this.cone(0.36, 0.3, 6), x, h + 0.6, z);
  }
  flag(x, y, z, h = 6, key = 'fabricSaffron') {
    this.add('grey', this.cyl(0.05, 0.06, h, 6), x, y + h / 2, z);
    this.add(key, this.plane(1.2, 0.75), x + 0.62, y + h - 0.5, z, { ry: Math.PI / 2 });
  }
  boat(x, z, s = 1, ry = 0, key = 'wood') {
    this.add(key, this.box(1.1 * s, 0.32 * s, 2.8 * s), x, 0.16 * s, z, { ry });
    this.add(key, this.cone(0.55 * s, 0.7 * s, 4), x, 0.5 * s, z + 1.1 * s, { ry, rx: Math.PI / 2, s: 1 });
    this.add('fabricWhite', this.plane(0.8 * s, 0.9 * s), x, 1.1 * s, z, { ry });
  }
  /* ---- lights ---- */
  light(spec) { this.lights.push(spec); }
  animate(fn) { this.animators.push(fn); }
  finalize() {
    const meshes = [];
    for (const [k, parts] of Object.entries(this.buckets)) {
      const geos = parts.map((p) => p.geo);
      if (!geos.length) continue;
      let merged;
      try { merged = mergeGeometries(geos, false); } catch (e) { merged = null; }
      if (!merged) {
        parts.forEach((p) => {
          const m = new THREE.Mesh(p.geo, p.mat || this.M[k]);
          m.castShadow = true; m.receiveShadow = true;
          this.root.add(m);
        });
        continue;
      }
      const mat = parts[0].mat || this.M[k];
      if (!mat) { console.warn('no material for', k); continue; }
      const mesh = new THREE.Mesh(merged, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = k;
      this.root.add(mesh);
      meshes.push(mesh);
      geos.forEach((g) => g.dispose());
    }
    this.buckets = {};
    return meshes;
  }
}

/* ------------------------------------------------------------------- boot */
export function boot(mon) {
  const DATA = window.MONUMENT_DATA || {};
  const body = document.body;
  const meta = Object.assign({}, mon.meta, DATA);
  body.dataset.monument = mon.id || '';
  if (mon.accent) document.documentElement.style.setProperty('--accent', mon.accent);
  if (mon.accent2) document.documentElement.style.setProperty('--accent-2', mon.accent2);
  document.documentElement.style.setProperty('--accent-soft', hexA(mon.accent || '#d9a441', 0.16));

  /* ---------------- interface ---------------- */
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#panel';
  skip.textContent = 'Skip to the controls';
  body.prepend(skip);   // first in tab order

  const app = $('app');
  if (app) {
    app.setAttribute('role', 'img');
    app.setAttribute('aria-label', 'Three-dimensional model of ' + (meta.name || 'the monument') +
      (meta.place ? ', ' + meta.place : ''));
    const desc = document.createElement('p');
    desc.className = 'sr-only';
    desc.id = 'scene-desc';
    desc.textContent = (meta.blurb ? meta.blurb + ' ' : '') +
      'This is a live 3D model. Drag to orbit, scroll or pinch to zoom, or use the Viewpoints buttons. ' +
      'The full history, sources and photograph credits are in the About panel.';
    body.appendChild(desc);
    app.setAttribute('aria-describedby', 'scene-desc');
  }

  const home = document.createElement('a');
  home.className = 'home-link';
  home.href = '../index.html';
  home.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg><span class="hl-label">All monuments</span>';

  const topbar = document.createElement('header');
  topbar.id = 'topbar';
  topbar.innerHTML = `
    <div class="titles">
      <h1>${esc(meta.name || '')}</h1>
      <p>${esc(meta.place || '')}${meta.period ? ' · ' + esc(meta.period) : ''}</p>
      <span class="deva" lang="hi">${esc(meta.deva || '')}</span>
    </div>
    <div class="top-actions">
      <button class="icon-btn nav-arrow" id="btn-prev" aria-label="Previous monument" title="Previous monument">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button class="icon-btn nav-arrow" id="btn-next" aria-label="Next monument" title="Next monument">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="icon-btn" id="btn-about" aria-label="About this monument" title="History & sources (A)">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.6"/></svg></button>
      <button class="icon-btn" id="btn-tour" aria-label="Start guided tour" title="Guided tour (T)">
        <svg viewBox="0 0 24 24"><circle cx="5" cy="18" r="1.8"/><circle cx="19" cy="6" r="1.8"/><path d="M7 18h6a4 4 0 0 0 0-8H9a3 3 0 0 1 0-6h8"/></svg></button>
      <button class="icon-btn on" id="btn-panel" aria-label="Toggle controls" aria-pressed="true" aria-expanded="true" title="Controls (H)">
        <svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h13"/><circle cx="16" cy="7" r="1.9"/><circle cx="10" cy="12" r="1.9"/><circle cx="18.5" cy="17" r="1.9"/></svg></button>
      <button class="icon-btn" id="btn-cine" aria-label="Cinematic mode" title="Cinema mode (C)">
        <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
    </div>`;
  topbar.insertBefore(home, topbar.firstChild);

  const panel = document.createElement('aside');
  panel.id = 'panel';
  panel.className = 'glass';
  panel.setAttribute('aria-label', 'Scene controls');
  panel.innerHTML = `
    <div class="panel-head">
      <div class="panel-title">
        <span class="status-dot"></span>
        <div>
          <div class="panel-name">${esc(meta.name || '')}</div>
          <div class="panel-sub" id="status-text">LIVE</div>
        </div>
      </div>
      <span class="deva panel-deva" lang="hi">${esc(meta.deva || '')}</span>
    </div>
    <div class="panel-scroll">
      <section>
        <h3 class="sec-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>Sky &amp; light</h3>
        <div class="ctl">
          <div class="ctl-top"><label for="time">Time of day</label><span class="val" id="time-val">17:00</span></div>
          <input type="range" id="time" min="0" max="24" step="0.05" value="17">
        </div>
        <div class="seg" id="tod-group">
          <button class="chip" data-tod="6.2">Dawn</button>
          <button class="chip" data-tod="12">Noon</button>
          <button class="chip" data-tod="17.6">Dusk</button>
          <button class="chip" data-tod="21.5">Night</button>
        </div>
        <div class="row" style="margin-top:9px"><label for="cycle">Day–night cycle</label>
          <span class="switch"><input type="checkbox" id="cycle"><span class="knob"></span></span></div>
      </section>
      <section>
        <h3 class="sec-title"><svg viewBox="0 0 24 24"><path d="M6 15a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.4 1.2A3.6 3.6 0 0 1 17 15z"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"/></svg>Weather</h3>
        <div class="seg" id="wx-group">
          <button class="chip on" data-wx="clear">Clear</button>
          <button class="chip" data-wx="mist">Mist</button>
          <button class="chip" data-wx="cloudy">Cloudy</button>
          <button class="chip" data-wx="monsoon">Rain</button>
        </div>
        <div class="ctl" style="margin-top:9px">
          <div class="ctl-top"><label for="cover">Cloud cover</label><span class="val" id="cover-val">18%</span></div>
          <input type="range" id="cover" min="0" max="1" step="0.02" value="0.18">
        </div>
        <div class="ctl">
          <div class="ctl-top"><label for="rain">Rainfall</label><span class="val" id="rain-val">0%</span></div>
          <input type="range" id="rain" min="0" max="1" step="0.02" value="0">
        </div>
      </section>
      <section>
        <h3 class="sec-title"><svg viewBox="0 0 24 24"><path d="M3 8l4-3 4 3 4-3 4 3"/><path d="M4 12h16M6 12v8M18 12v8"/></svg>Viewpoints</h3>
        <div class="seg" id="view-group"></div>
        <div class="row" style="margin-top:9px"><label for="orbit">Auto orbit</label>
          <span class="switch"><input type="checkbox" id="orbit"><span class="knob"></span></span></div>
      </section>
      <section>
        <h3 class="sec-title"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="17" cy="18" r="2"/></svg>Look</h3>
        <div class="ctl">
          <div class="ctl-top"><label for="exposure">Exposure</label><span class="val" id="exposure-val">0.52</span></div>
          <input type="range" id="exposure" min="0.2" max="1.2" step="0.02" value="0.52">
        </div>
        <div class="ctl">
          <div class="ctl-top"><label for="glow">Bloom</label><span class="val" id="glow-val">0.22</span></div>
          <input type="range" id="glow" min="0" max="1.1" step="0.02" value="0.22">
        </div>
        <div class="ctl">
          <div class="ctl-top"><label for="tilt">Miniature blur</label><span class="val" id="tilt-val">0.35</span></div>
          <input type="range" id="tilt" min="0" max="1" step="0.02" value="0.35">
        </div>
        <div class="row"><label for="wire">Wireframe</label>
          <span class="switch"><input type="checkbox" id="wire"><span class="knob"></span></span></div>
        <div class="row"><label for="grid">Grid</label>
          <span class="switch"><input type="checkbox" id="grid"><span class="knob"></span></span></div>
        <div class="row"><label for="quality">Quality</label>
          <select id="quality" class="chip" style="flex:0 0 108px;text-align:left">
            <option value="sharp">Sharp</option><option value="balanced" selected>Balanced</option><option value="fast">Fast</option>
          </select></div>
      </section>
      <section>
        <div class="btn-grid">
          <button class="btn ghost" id="btn-reset"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/></svg>Reset</button>
          <button class="btn" id="btn-shot"><svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>Save image</button>
        </div>
        <a class="btn ghost" id="btn-read" href="#" style="margin-top:6px;text-decoration:none">
          <svg viewBox="0 0 24 24"><path d="M4 5h7v14H4zM13 5h7v14h-7z"/></svg>Read the history</a>
      </section>
    </div>`;

  const about = document.createElement('div');
  about.id = 'about';
  about.innerHTML = `<div class="about-card glass" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <button class="icon-btn about-close" id="about-close" aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <p class="about-kicker">${esc(meta.place || 'India')} · ${esc(meta.era || '')}</p>
      <h2 id="about-title">${esc(meta.name || '')}</h2>
      <p class="about-deva" lang="hi">${esc(meta.deva || '')}</p>
      <div id="about-body"></div>
    </div>`;

  const tourcard = document.createElement('div');
  tourcard.id = 'tourcard';
  tourcard.className = 'glass';
  tourcard.innerHTML = `
    <div class="tour-kicker"><span id="tour-step">Guided tour · 1/1</span><span class="deva" id="tour-deva" lang="hi"></span></div>
    <h2 class="tour-title" id="tour-title"></h2>
    <p class="tour-text" id="tour-text"></p>
    <div class="tour-foot">
      <div class="tour-dots" id="tour-dots"></div>
      <div class="tour-nav">
        <button id="tour-prev" aria-label="Previous stop"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
        <button id="tour-next" aria-label="Next stop"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
        <button id="tour-end" class="end">End</button>
      </div>
    </div>`;

  const toastEl = document.createElement('div');
  toastEl.id = 'toast';
  const hint = document.createElement('div');
  hint.id = 'hint';
  hint.innerHTML = 'Drag to orbit · scroll to zoom · <b>H</b> panel · <b>T</b> tour';

  const grain = document.createElement('div'); grain.id = 'grain'; grain.setAttribute('aria-hidden', 'true');
  const vig = document.createElement('div'); vig.id = 'vignette'; vig.setAttribute('aria-hidden', 'true');

  body.append(grain, vig, topbar, panel, about, tourcard, toastEl, hint);

  /* loader */
  const bootEl = document.createElement('div');
  bootEl.id = 'boot';
  bootEl.innerHTML = `<div class="boot-inner">
      <div class="boot-mark">${lotusSvg()}</div>
      <h1 class="boot-title">${esc(meta.name || '')}</h1>
      <p class="boot-sub">${esc(meta.place || '')}${meta.period ? ' · ' + esc(meta.period) : ''}</p>
      <div class="boot-bar"><i id="boot-fill"></i></div>
      <p class="boot-status" id="boot-status">Preparing the site…</p>
      <div class="boot-error" id="boot-error"><span id="boot-error-msg"></span><br><button id="boot-retry">Reload</button></div>
    </div>`;
  body.appendChild(bootEl);
  const bootFill = $('boot-fill'), bootStatus = $('boot-status');
  const setProgress = (pct, msg) => {
    bootFill.style.width = Math.min(100, pct) + '%';
    if (msg) bootStatus.textContent = msg;
  };

  /* ---------------- state ---------------- */
  const DEFAULTS = {
    time: 17.2, cycle: false, exposure: 0.52, glow: 0.22, tilt: reduced ? 0 : 0.35,
    cover: 0.18, rain: 0, mist: 0, wind: 0.4, quality: isMobile() ? 'balanced' : 'balanced',
    orbit: !reduced, wire: false, grid: false
  };
  const state = Object.assign({}, DEFAULTS);
  if (mon.time !== undefined) state.time = mon.time;
  if (mon.exposure !== undefined) state.exposure = mon.exposure;
  const wxTarget = { cover: 0.18, rain: 0, mist: 0, wind: 0.4 };
  const wx = { cover: 0.18, rain: 0, mist: 0, wind: 0.4 };
  const WX = {
    clear: { cover: 0.16, rain: 0, mist: 0, wind: 0.4 },
    mist: { cover: 0.42, rain: 0, mist: 0.85, wind: 0.2 },
    cloudy: { cover: 0.84, rain: 0, mist: 0.15, wind: 0.9 },
    monsoon: { cover: 1, rain: 0.85, mist: 0.3, wind: 1.5 }
  };

  /* ---------------- toast ---------------- */
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------------- three.js ---------------- */
  let renderer, scene, camera, controls, composer, bloomPass, tiltPass, sky, sunSprite, moonSprite;
  let keyLight, hemi, rimLight, waterMesh, groundMesh, rainPoints, cloudGroup, starField, birds;
  const clock = new THREE.Clock();
  let lampFactor = 0, dayFactor = 1, nightFactor = 0;
  const sunDir = new THREE.Vector3(), moonDir = new THREE.Vector3(), tmpA = new THREE.Color(), tmpB = new THREE.Color();
  let skyU, pmrem, envScene, envRT = null, roomEnvTexture = null, lastEnvT = -99, lastEnvMs = 0, lastEnvCover = -1;
  const T = {}, M = {};
  let builder = null, meshCount = 0, tris = 0;
  let camTween = null;
  let ready = false;

  function fail(err) {
    console.error(err);
    document.documentElement.dataset.error = (err && err.message) || String(err);
    $('boot-error').classList.add('show');
    $('boot-error-msg').textContent = 'The 3D scene could not start: ' + ((err && err.message) || 'unknown error') +
      '. Try a modern browser with WebGL enabled, then reload.';
    $('boot-retry').onclick = () => location.reload();
    bootStatus.textContent = 'Startup failed';
  }
  window.addEventListener('error', (e) => { if (!ready) fail(e.error || e.message); });
  window.addEventListener('unhandledrejection', (e) => { if (!ready) fail(e.reason); });

  try {
    /* renderer */
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, state.quality === 'fast' ? 1 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = state.exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    $('app').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe8c39a, 0.0022);

    const fov = mon.home && mon.home.fov ? mon.home.fov : 38;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.4, 8000);
    const H = mon.home || { pos: [40, 26, 55], target: [0, 8, 0] };
    camera.position.set(H.pos[0], H.pos[1], H.pos[2]);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(H.target[0], H.target[1], H.target[2]);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = mon.minDist || 12;
    controls.maxDistance = mon.maxDist || 320;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.minPolarAngle = 0.06;
    controls.autoRotateSpeed = 0.32;
    controls.autoRotate = state.orbit;
    controls.update();

    setProgress(12, 'Mixing pigments…');
    T._all = buildTextures(renderer);
    Object.assign(T, T._all);
    M._all = buildMaterials(T);
    Object.assign(M, M._all);

    /* sky + environment */
    sky = new Sky();
    sky.scale.setScalar(6000);
    scene.add(sky);
    skyU = sky.material.uniforms;
    skyU.turbidity.value = 2.8;
    skyU.rayleigh.value = 2.6;
    skyU.mieCoefficient.value = 0.0022;
    skyU.mieDirectionalG.value = 0.86;
    pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    envScene = new THREE.Scene();
    // a neutral studio environment gives marble, gold and stone believable
    // specular response, the way the Littlest Tokyo diorama is lit
    try {
      const roomRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = roomRT.texture;
      roomEnvTexture = roomRT.texture;
    } catch (e) { console.warn('studio environment unavailable', e); }

    /* lights */
    keyLight = new THREE.DirectionalLight(0xfff3e0, 2.6);
    keyLight.castShadow = true;
    const b = mon.bounds || 55;
    keyLight.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    const sb = b * 0.78;
    keyLight.shadow.camera.left = -sb; keyLight.shadow.camera.right = sb;
    keyLight.shadow.camera.top = sb; keyLight.shadow.camera.bottom = -sb;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = b * 7;
    keyLight.shadow.bias = -0.00035;
    keyLight.shadow.normalBias = 0.13;   // wide frustum needs a generous normal bias
    keyLight.target.position.set((H.target[0]), 0, H.target[2]);
    scene.add(keyLight, keyLight.target);

    // the ground half of the hemisphere light is what every downward-facing
    // surface sees. It is earth-brown by default, which is right over soil and
    // wrong over a white marble plinth — hence hemiGround.
    hemi = new THREE.HemisphereLight(0xcfe0e6, mon.hemiGround !== undefined ? mon.hemiGround : 0x6b5a44, 0.5 * (mon.hemiScale !== undefined ? mon.hemiScale : 1));
    scene.add(hemi);
    rimLight = new THREE.DirectionalLight(0xffd9b0, 0.4);
    rimLight.position.set(-60, 40, -70);
    scene.add(rimLight);

    /* sun / moon / stars */
    const softTex = T.soft;
    sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xfff0c0, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    sunSprite.scale.setScalar(150);
    scene.add(sunSprite);
    moonSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xdfe8ff, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
    moonSprite.scale.setScalar(90);
    scene.add(moonSprite);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(1400 * 3);
    const sr = mulberry32(99);
    for (let i = 0; i < 1400; i++) {
      const u = sr() * Math.PI * 2, v = Math.acos(1 - sr() * 0.95);
      const r = 3200;
      starPos[i * 3] = Math.sin(v) * Math.cos(u) * r;
      starPos[i * 3 + 1] = Math.cos(v) * r * 0.9 + 60;
      starPos[i * 3 + 2] = Math.sin(v) * Math.sin(u) * r;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 7, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false, map: softTex });
    starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    /* ground */
    setProgress(26, 'Laying the ground…');
    const groundCfg = Object.assign({ texture: 'sand', size: 2400, color: 0xcdb88f }, mon.ground || {});
    groundCfg.size = Math.max(groundCfg.size, 2400);
    const gTex = T[groundCfg.texture] || T.sandGround;
    const perTile = groundCfg.tile || { paving: 8, grass: 22, sandGround: 26, stone: 14 }[groundCfg.texture] || 24;
    const gRepeat = groundCfg.size / perTile;
    const gc = gTex.clone();
    gc.needsUpdate = true;
    gc.wrapS = gc.wrapT = THREE.RepeatWrapping;
    gc.repeat.set(gRepeat, gRepeat);
    const groundMat = new THREE.MeshStandardMaterial({
      map: gc, color: groundCfg.color !== undefined ? groundCfg.color : 0xffffff, roughness: 1, metalness: 0
    });
    groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(groundCfg.size, groundCfg.size), groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = mon.groundY !== undefined ? mon.groundY : -0.02;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    /* ---- distant horizon: a low ridge and a treeline, so the ground
       meets the sky in haze rather than at a hard edge ---- */
    if (mon.horizon !== false) {
      const hb = new Builder(scene, M, T, 91);
      M.haze.color.copy(new THREE.Color(groundCfg.color)).lerp(new THREE.Color(0x7d8474), 0.72).multiplyScalar(0.96);
      const hr = mulberry32(17);
      // soft hills
      const R1 = groundCfg.size * 0.30;
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * Math.PI * 2 + hr() * 0.08;
        const r = 55 + hr() * 75, h = 14 + hr() * 26;
        hb.add('haze', hb.sph(r, 9), Math.cos(a) * R1, -h * 0.25, Math.sin(a) * R1, { sy: h / r });
      }
      hb.finalize().forEach((m) => { m.castShadow = false; m.receiveShadow = false; });
    }

    /* water */
    if (mon.water) {
      const w = mon.water;
      const wsize = w.size || 1200;
      const geo = new THREE.PlaneGeometry(wsize, wsize);
      waterMesh = new Water(geo, {
        textureWidth: 512, textureHeight: 512,
        waterNormals: T.waterNormal,
        sunDirection: new THREE.Vector3(0, 1, 0),
        sunColor: 0xffffff, waterColor: w.color !== undefined ? w.color : 0x2f5a6b,
        distortionScale: w.distortion !== undefined ? w.distortion : 2.2,
        fog: true, alpha: 1
      });
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(w.x || 0, w.y !== undefined ? w.y : -0.15, w.z || 0);
      scene.add(waterMesh);
    }

    /* soft contact shadow so the model sits on the ground */
    const contactR = (mon.bounds || 55) * 2.9;
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(contactR, contactR),
      new THREE.MeshBasicMaterial({
        map: T.soft, color: 0x1b1409, transparent: true, opacity: 0.34,
        depthWrite: false, side: THREE.DoubleSide
      })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = (mon.groundY !== undefined ? mon.groundY : 0) + 0.05;
    contact.renderOrder = -1;
    scene.add(contact);

    /* grid */
    const grid = new THREE.GridHelper(400, 40, 0xd9a441, 0x8a7a5a);
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    grid.position.y = 0.02;
    grid.visible = state.grid;
    scene.add(grid);
    window.__grid = grid;

    /* post */
    const msaaTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      type: THREE.HalfFloatType,
      samples: isMobile() ? 2 : 4
    });
    composer = new EffectComposer(renderer, msaaTarget);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), state.glow, 0.5, 0.88);
    composer.addPass(bloomPass);
    tiltPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null }, uAmount: { value: state.tilt }, uFocus: { value: 0.52 },
        uWarm: { value: 0.22 }, uRes: { value: new THREE.Vector2(1, 1) }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float uAmount; uniform float uFocus; uniform float uWarm; uniform vec2 uRes;
        varying vec2 vUv;
        void main(){
          float d = abs(vUv.y - uFocus);
          float blur = smoothstep(0.18, 0.55, d) * uAmount;
          vec2 px = 1.0 / uRes;
          vec3 col = texture2D(tDiffuse, vUv).rgb;
          if (blur > 0.004) {
            float r = blur * 7.0;
            vec3 acc = col;
            acc += texture2D(tDiffuse, vUv + px * vec2(0.0,  r)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2(0.0, -r)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2( r, 0.0)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2(-r, 0.0)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2( r*0.7,  r*0.7)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2(-r*0.7,  r*0.7)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2( r*0.7, -r*0.7)).rgb;
            acc += texture2D(tDiffuse, vUv + px * vec2(-r*0.7, -r*0.7)).rgb;
            col = acc / 9.0;
          }
          float l = dot(col, vec3(0.299,0.587,0.114));
          col = mix(vec3(l), col, 1.08);              /* a touch more colour */
          col = (col - 0.5) * 1.055 + 0.5;            /* gentle S-curve */
          col = mix(vec3(l), col, 1.0 + 0.16 * uWarm);
          col *= mix(vec3(1.0), vec3(1.05,1.0,0.94), uWarm * 0.8);
          gl_FragColor = vec4(col, 1.0);
        }`
    });
    composer.addPass(tiltPass);
    composer.addPass(new OutputPass());
    const drawSize = new THREE.Vector2();
    renderer.getDrawingBufferSize(drawSize);
    tiltPass.uniforms.uRes.value.copy(drawSize);

    /* weather particles */
    setProgress(38, 'Carving stone…');
    const rainCount = isMobile() ? 900 : 1600;
    const rainGeo = new THREE.BufferGeometry();
    const rp = new Float32Array(rainCount * 3);
    const rr = mulberry32(7);
    for (let i = 0; i < rainCount; i++) {
      rp[i * 3] = (rr() - 0.5) * 220;
      rp[i * 3 + 1] = rr() * 120;
      rp[i * 3 + 2] = (rr() - 0.5) * 220;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
    rainPoints = new THREE.Points(rainGeo, new THREE.PointsMaterial({
      map: T.rain, size: 3.4, transparent: true, opacity: 0, depthWrite: false,
      color: 0xdfe9f2, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
    scene.add(rainPoints);

    cloudGroup = new THREE.Group();
    const cr = mulberry32(23);
    for (let i = 0; i < 16; i++) {
      const s = 90 + cr() * 160;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: T.soft, color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false
      }));
      sp.scale.set(s, s * 0.52, 1);
      sp.position.set((cr() - 0.5) * 900, 120 + cr() * 90, (cr() - 0.5) * 900);
      sp.userData.spd = 0.6 + cr() * 1.4;
      cloudGroup.add(sp);
    }
    scene.add(cloudGroup);

    birds = new THREE.Group();
    const br = mulberry32(31);
    for (let i = 0; i < 10; i++) {
      const bm = new THREE.SpriteMaterial({ map: T.soft, color: 0x2a241c, transparent: true, opacity: 0.75, depthWrite: false });
      const sp = new THREE.Sprite(bm);
      sp.scale.set(1.5, 0.5, 1);
      sp.userData = { a: br() * Math.PI * 2, r: 30 + br() * 55, y: 26 + br() * 26, sp: 0.06 + br() * 0.08 };
      birds.add(sp);
    }
    scene.add(birds);

    /* ---------------- build monument ---------------- */
    setProgress(52, 'Raising the monument…');
    builder = new Builder(scene, M, T, mon.seed || 5);
    const ctx = makeCtx(builder, mon, scene, T, M);
    if (typeof mon.build !== 'function') throw new Error('monument module has no build()');
    mon.build(ctx);
    setProgress(78, 'Polishing the detail…');
    const meshes = builder.finalize();
    meshCount = meshes.length;
    tris = meshes.reduce((n, m) => n + (m.geometry.attributes.position ? m.geometry.attributes.position.count / 3 : 0), 0);

    /* monument floodlights */
    const lightSpecs = [].concat(mon.floods || [], builder.lights || []);
    const floods = (lightSpecs.length ? lightSpecs : defaultFloods(mon)).map((f) => {
      const light = new THREE.SpotLight(f.color !== undefined ? f.color : 0xffc98a, 0, f.distance || 160, f.angle || 0.7, 0.55, 1.4);
      light.position.set(f.pos[0], f.pos[1], f.pos[2]);
      light.target.position.set(f.target[0], f.target[1], f.target[2]);
      light.userData.base = (f.intensity !== undefined ? f.intensity : 1600) * (mon.floodScale !== undefined ? mon.floodScale : 1);
      light.intensity = 0;
      scene.add(light, light.target);
      return light;
    });

    /* ---------------- sky / time ---------------- */
    const fogStops = (mon.fogStops || [
      [0, 0x0b1220], [5, 0x1a2438], [6.3, 0xe8a87c], [8, 0xcfe0e6], [12, 0xcfe4ec],
      [16.5, 0xe8d2ac], [17.8, 0xf0b078], [18.7, 0xd08060], [19.6, 0x3a3a58], [21, 0x141c30], [24, 0x0b1220]
    ]).map((s) => [s[0], new THREE.Color(s[1])]);
    const fogCol = new THREE.Color();
    const overcast = new THREE.Color(0x9aa4a8), mistCol = new THREE.Color(0xcfd8da);
    const sunLow = new THREE.Color(0xff9a4d), sunHigh = new THREE.Color(0xfff3e0), moonCol = new THREE.Color(0x93a7d8);

    function fogColorAt(t) {
      for (let i = 0; i < fogStops.length - 1; i++) {
        if (t >= fogStops[i][0] && t <= fogStops[i + 1][0]) {
          const k = (t - fogStops[i][0]) / (fogStops[i + 1][0] - fogStops[i][0] || 1);
          return fogCol.copy(fogStops[i][1]).lerp(fogStops[i + 1][1], k);
        }
      }
      return fogCol.copy(fogStops[0][1]);
    }
    function dirFrom(elevDeg, azDeg, out) {
      const e = THREE.MathUtils.degToRad(elevDeg), a = THREE.MathUtils.degToRad(azDeg);
      return out.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));
    }
    function refreshEnv() { /* environment is a fixed studio map now */ }
    let lastShadowT = -99;
    function applySky(t, force) {
      const elev = Math.sin(((t - 6) / 12) * Math.PI) * 62;
      const az = ((t - 6) / 12) * 150 - 75;
      dayFactor = clamp(Math.sin(THREE.MathUtils.degToRad(elev)) * 1.4, 0, 1);
      nightFactor = 1 - clamp(elev / 8 + 0.5, 0, 1);
      lampFactor = clamp((6 - elev) / 8, 0, 1);
      const dim = (1 - 0.7 * wx.cover) * (1 - 0.42 * wx.rain);
      dirFrom(elev, az, sunDir);
      dirFrom(Math.max(-elev, 14), az + 180, moonDir);
      skyU.sunPosition.value.copy(sunDir);
      skyU.rayleigh.value = (2.5 + 1.5 * (1 - clamp(elev / 25, 0, 1))) * (1 - 0.5 * wx.cover);
      skyU.turbidity.value = 2.6 + 2.4 * (1 - clamp(elev / 30, 0, 1)) + 16 * wx.cover + 6 * wx.rain;
      skyU.mieCoefficient.value = 0.0022 + 0.02 * wx.mist + 0.009 * wx.cover;
      fogColorAt(t);
      fogCol.lerp(overcast, clamp(wx.cover * 0.5 + wx.rain * 0.3, 0, 1));
      fogCol.lerp(mistCol, wx.mist * 0.6);
      scene.fog.color.copy(fogCol);
      scene.fog.density = (0.00085 + 0.0040 * wx.mist + 0.0020 * wx.rain + 0.0010 * wx.cover) * (mon.fogScale || 1);
      hemi.color.copy(fogCol);
      // the per-frame sky update overwrites the intensity, so the per-monument
      // scale has to be applied here or it is lost on the first frame
      hemi.intensity = ((0.02 + 0.15 * dayFactor) * (1 - 0.35 * wx.cover) + 0.07 * wx.cover)
        * (mon.hemiScale !== undefined ? mon.hemiScale : 1);
      scene.environmentIntensity = (0.05 + 0.24 * dayFactor) * (1 - 0.30 * wx.cover) * (1 - 0.2 * wx.rain);
      rimLight.intensity = (0.18 + 0.34 * dayFactor) * dim;
      if (elev > 0) {
        keyLight.position.copy(sunDir).multiplyScalar(190).add(keyLight.target.position);
        keyLight.color.copy(tmpA.copy(sunLow).lerp(sunHigh, clamp(elev / 30, 0, 1)));
        keyLight.intensity = (0.6 + 3.7 * clamp(Math.sin(THREE.MathUtils.degToRad(elev)) * 1.6, 0, 1)) * dim;
      } else {
        keyLight.position.copy(moonDir).multiplyScalar(190).add(keyLight.target.position);
        keyLight.color.copy(moonCol);
        keyLight.intensity = 0.34 * clamp(-elev / 20, 0.25, 1) * (1 - 0.6 * wx.cover);
      }
      if (waterMesh) {
        waterMesh.material.uniforms.sunDirection.value.copy(elev > 0 ? sunDir : moonDir).normalize();
        waterMesh.material.uniforms.sunColor.value.copy(elev > 0 ? keyLight.color : moonCol);
      }
      sunSprite.position.copy(sunDir).multiplyScalar(3600);
      sunSprite.material.opacity = clamp(elev / 6 + 0.1, 0, 0.38) * dim;
      sunSprite.material.color.copy(tmpB.copy(sunLow).lerp(sunHigh, clamp(elev / 25, 0, 1)));
      moonSprite.position.copy(moonDir).multiplyScalar(3600);
      moonSprite.material.opacity = nightFactor * 0.85 * (1 - 0.8 * wx.cover);
      starField.material.opacity = nightFactor * 0.9 * (1 - wx.cover);
      birds.children.forEach((b) => { b.material.opacity = 0.12 + 0.6 * dayFactor; });
      floods.forEach((l) => { l.intensity = l.userData.base * lampFactor * (1 - 0.35 * wx.rain); });
      const now = performance.now();
      if (force || ((Math.abs(t - lastEnvT) > 0.14 || Math.abs(wx.cover - lastEnvCover) > 0.12) && now - lastEnvMs > 320)) {
        lastEnvT = t; lastEnvMs = now; lastEnvCover = wx.cover;
        refreshEnv();
      }
      if (force || Math.abs(t - lastShadowT) > 0.08) {
        lastShadowT = t;
        renderer.shadowMap.needsUpdate = true;
      }
    }

    /* ---------------- camera ---------------- */
    function tweenTo(pos, target, dur, done) {
      camTween = {
        fp: camera.position.clone(), ft: controls.target.clone(),
        tp: new THREE.Vector3(pos[0], pos[1], pos[2]),
        tt: new THREE.Vector3(target[0], target[1], target[2]),
        t0: performance.now(), dur: dur || 1500, ease: easeInOutCubic, done
      };
    }
    function stepTween(now) {
      if (!camTween) return;
      const k = clamp((now - camTween.t0) / camTween.dur, 0, 1);
      const e = camTween.ease(k);
      camera.position.lerpVectors(camTween.fp, camTween.tp, e);
      controls.target.lerpVectors(camTween.ft, camTween.tt, e);
      if (k >= 1) { const d = camTween.done; camTween = null; if (d) d(); }
    }
    const dolly = () => {
      const a = camera.aspect;
      // A portrait viewport loses horizontal field, so a wide subject needs
      // the camera back by roughly 1/aspect to keep the same width in frame.
      // The old 0.55 exponent capped at 1.5, which left 100 m buildings
      // cropped at 390 px.
      return a >= 1 ? 1 : clamp(Math.pow(1 / a, 0.85), 1, 2.4);
    };
    const fit = (pos, target) => {
      const k = dolly();
      return [target[0] + (pos[0] - target[0]) * k, target[1] + (pos[1] - target[1]) * k, target[2] + (pos[2] - target[2]) * k];
    };
    camera.position.set(...fit(H.pos, H.target));
    const views = mon.views || [{ name: 'Home', pos: H.pos, target: H.target }];
    function goView(i, announce = true) {
      const v = views[i];
      if (!v) return;
      tweenTo(fit(v.pos, v.target), v.target, 1500);
      document.querySelectorAll('#view-group .chip').forEach((c, k) => c.classList.toggle('on', k === i));
      if (announce) toast(v.name);
    }
    const viewGroup = $('view-group');
    views.forEach((v, i) => {
      const b2 = document.createElement('button');
      b2.className = 'chip' + (i === 0 ? ' on' : '');
      b2.textContent = v.name;
      b2.onclick = () => goView(i);
      viewGroup.appendChild(b2);
    });

    /* ---------------- tour ---------------- */
    const tour = mon.tour || [];
    let tourIdx = -1;
    const tourDots = $('tour-dots');
    tour.forEach(() => tourDots.appendChild(document.createElement('i')));
    function tourGo(i) {
      if (!tour.length) return;
      tourIdx = (i + tour.length) % tour.length;
      const s = tour[tourIdx];
      body.classList.add('touring');
      $('tour-step').textContent = `Guided tour · ${tourIdx + 1}/${tour.length}`;
      $('tour-deva').textContent = s.deva || '';
      $('tour-title').textContent = s.title || '';
      $('tour-text').textContent = s.text || '';
      [...tourDots.children].forEach((d, k) => d.classList.toggle('on', k === tourIdx));
      if (s.time !== undefined) { state.time = s.time; $('time').value = s.time; $('time-val').textContent = fmtClock(s.time); }
      if (s.weather) setWeather(s.weather, true);
      if (s.pos) tweenTo(fit(s.pos, s.target || H.target), s.target || H.target, s.dur || 2200);
    }
    function tourStop() {
      body.classList.remove('touring');
      tourIdx = -1;
    }
    $('tour-prev').onclick = () => tourGo(tourIdx - 1);
    $('tour-next').onclick = () => (tourIdx >= tour.length - 1 ? tourStop() : tourGo(tourIdx + 1));
    $('tour-end').onclick = tourStop;

    /* ---------------- UI wiring ---------------- */
    function setWeather(name, instant) {
      const w = WX[name] || WX.clear;
      Object.assign(wxTarget, w);
      document.querySelectorAll('#wx-group .chip').forEach((c) => c.classList.toggle('on', c.dataset.wx === name));
      $('cover').value = w.cover; $('cover-val').textContent = Math.round(w.cover * 100) + '%';
      $('rain').value = w.rain; $('rain-val').textContent = Math.round(w.rain * 100) + '%';
      if (instant) Object.assign(wx, w);
      applySky(state.time, true);
    }
    document.querySelectorAll('#wx-group .chip').forEach((c) => { c.onclick = () => setWeather(c.dataset.wx); });
    document.querySelectorAll('#tod-group .chip').forEach((c) => {
      c.onclick = () => {
        state.time = parseFloat(c.dataset.tod);
        $('time').value = state.time;
        $('time-val').textContent = fmtClock(state.time);
        applySky(state.time, true);
      };
    });
    const timeEl = $('time');
    timeEl.value = state.time;
    $('time-val').textContent = fmtClock(state.time);
    timeEl.oninput = () => {
      state.time = parseFloat(timeEl.value);
      $('time-val').textContent = fmtClock(state.time);
      applySky(state.time);
    };
    $('cycle').onchange = (e) => { state.cycle = e.target.checked; };
    const coverEl = $('cover'), rainEl = $('rain');
    coverEl.oninput = () => { wxTarget.cover = parseFloat(coverEl.value); $('cover-val').textContent = Math.round(wxTarget.cover * 100) + '%'; };
    rainEl.oninput = () => { wxTarget.rain = parseFloat(rainEl.value); $('rain-val').textContent = Math.round(wxTarget.rain * 100) + '%'; };
    $('orbit').onchange = (e) => { state.orbit = e.target.checked; controls.autoRotate = state.orbit; };
    $('orbit').checked = state.orbit;
    const expEl = $('exposure'), glowEl = $('glow'), tiltEl = $('tilt');
    expEl.value = state.exposure;
    $('exposure-val').textContent = state.exposure.toFixed(2);
    expEl.oninput = () => { state.exposure = parseFloat(expEl.value); renderer.toneMappingExposure = state.exposure; $('exposure-val').textContent = state.exposure.toFixed(2); };
    glowEl.oninput = () => { state.glow = parseFloat(glowEl.value); bloomPass.strength = state.glow; $('glow-val').textContent = state.glow.toFixed(2); };
    tiltEl.oninput = () => { state.tilt = parseFloat(tiltEl.value); tiltPass.uniforms.uAmount.value = state.tilt; $('tilt-val').textContent = state.tilt.toFixed(2); };
    $('wire').onchange = (e) => {
      state.wire = e.target.checked;
      Object.values(M).forEach((m) => { if (m && m.isMaterial) m.wireframe = state.wire; });
    };
    $('grid').onchange = (e) => { state.grid = e.target.checked; window.__grid.visible = state.grid; };
    $('quality').onchange = (e) => setQuality(e.target.value);
    $('btn-reset').onclick = () => { goView(0, false); toast('View reset'); };
    $('btn-shot').onclick = () => saveImage();
    let aboutOpener = null;
    const focusables = () => Array.from(about.querySelectorAll('a[href], button:not([disabled])'))
      .filter((el) => el.offsetParent !== null);
    const openAbout = (opener) => {
      aboutOpener = opener || document.activeElement;
      body.classList.add('about-open');
      setTimeout(() => { const f = focusables(); (f[0] || about).focus(); }, 40);
    };
    const closeAbout = () => {
      body.classList.remove('about-open');
      if (aboutOpener && aboutOpener.focus) aboutOpener.focus();
    };
    $('btn-about').onclick = (e) => openAbout(e.currentTarget);
    $('btn-read').onclick = (e) => { e.preventDefault(); openAbout(e.currentTarget); };
    $('about-close').onclick = closeAbout;
    about.addEventListener('click', (e) => { if (e.target === about) closeAbout(); });
    about.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    const card = about.querySelector('.about-card');
    if (card) card.setAttribute('tabindex', '-1');
    const INDEX = window.INDIA_INDEX || [];
    const here = INDEX.findIndex((m) => m.id === mon.id);
    if (here >= 0 && INDEX.length > 1) {
      const prev = INDEX[(here - 1 + INDEX.length) % INDEX.length];
      const next = INDEX[(here + 1) % INDEX.length];
      $('btn-prev').onclick = () => { location.href = prev.id + '.html'; };
      $('btn-next').onclick = () => { location.href = next.id + '.html'; };
      $('btn-prev').title = 'Previous · ' + prev.name;
      $('btn-next').title = 'Next · ' + next.name;
    } else {
      $('btn-prev').hidden = true; $('btn-next').hidden = true;
    }
    $('btn-tour').onclick = () => (body.classList.contains('touring') ? tourStop() : tourGo(0));
    $('btn-cine').onclick = () => {
      body.classList.toggle('cinema');
      const on = body.classList.contains('cinema');
      topbar.style.opacity = on ? '0' : '';
      topbar.style.pointerEvents = on ? 'none' : '';
      panel.style.opacity = on ? '0' : '';
      panel.style.pointerEvents = on ? 'none' : '';
      hint.style.opacity = on ? '0' : '';
      toast(on ? 'Cinema mode · C to exit' : 'Interface back');
    };
    $('btn-panel').onclick = () => {
      if (isMobile()) body.classList.toggle('panel-open');
      else body.classList.toggle('panel-hidden');
      const hidden = isMobile() ? !body.classList.contains('panel-open') : body.classList.contains('panel-hidden');
      $('btn-panel').setAttribute('aria-pressed', String(!hidden));
      $('btn-panel').setAttribute('aria-expanded', String(!hidden));
      $('btn-panel').classList.toggle('on', !hidden);
    };
    if (isMobile()) { body.classList.remove('panel-open'); $('btn-panel').classList.remove('on'); }

    window.addEventListener('keydown', (e) => {
      if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'h') $('btn-panel').click();
      else if (k === 't') $('btn-tour').click();
      else if (k === 'c') $('btn-cine').click();
      else if (k === 'a') openAbout();
      else if (k === 'r') $('btn-reset').click();
      else if (k === 'escape') { if (body.classList.contains('about-open')) closeAbout(); else { body.classList.remove('about-open'); tourStop(); } }
      else if (/^[1-9]$/.test(k)) goView(parseInt(k, 10) - 1);
    });

    /* ---------------- about content ---------------- */
    renderAbout();

    /* ---------------- quality / resize ---------------- */
    function setQuality(q) {
      state.quality = q;
      const pr = Math.min(window.devicePixelRatio || 1, q === 'fast' ? 1 : q === 'balanced' ? 1.5 : 2);
      renderer.setPixelRatio(pr);
      composer.setPixelRatio(pr);
      onResize();
      toast('Quality · ' + q);
    }
    function onResize() {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      const ds = new THREE.Vector2();
      renderer.getDrawingBufferSize(ds);
      tiltPass.uniforms.uRes.value.copy(ds);
      bloomPass.setSize(w, h);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => setTimeout(() => {
      onResize();
      if (!camTween) { const v = views[0]; tweenTo(fit(v.pos, v.target), v.target, 600); }
    }, 220));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) clock.getDelta(); });

    /* ---------------- image save ---------------- */
    function saveImage() {
      composer.render();
      const url = renderer.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mon.id || 'monument'}-${meta.name ? meta.name.toLowerCase().replace(/\s+/g, '-') : 'india'}.png`;
      a.click();
      toast('Image saved');
    }

    /* ---------------- animate ---------------- */
    applySky(state.time, true);
    setProgress(88, 'Warming the light…');

    const clockStart = performance.now();
    let frame = 0;
    const loopFn = () => {
      const dt = Math.min(clock.getDelta(), 0.06);
      const now = performance.now();
      const t = (now - clockStart) / 1000;

      if (state.cycle) {
        state.time = (state.time + dt * 0.16) % 24;
        timeEl.value = state.time;
        $('time-val').textContent = fmtClock(state.time);
        applySky(state.time);
      }
      /* weather easing */
      let dirty = false;
      for (const k of Object.keys(wx)) {
        const d = wxTarget[k] - wx[k];
        if (Math.abs(d) > 0.0015) { wx[k] += d * Math.min(1, dt * 1.6); dirty = true; }
      }
      if (dirty) applySky(state.time);

      rainPoints.material.opacity = wx.rain * 0.85;
      if (wx.rain > 0.02) {
        const p = rainPoints.geometry.attributes.position;
        const arr = p.array;
        const fall = (26 + 22 * wx.rain) * dt;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= fall * (0.8 + ((i * 7919) % 100) / 220);
          if (arr[i + 1] < -2) {
            arr[i + 1] = 110 + (i % 17);
            arr[i] = camera.position.x + ((i * 104729) % 200) - 100;
            arr[i + 2] = camera.position.z + ((i * 15485863) % 200) - 100;
          }
        }
        p.needsUpdate = true;
      }
      cloudGroup.children.forEach((c) => {
        c.material.opacity = 0.06 + wx.cover * 0.55;
        c.position.x += c.userData.spd * dt * (1 + wx.wind);
        if (c.position.x > 520) c.position.x = -520;
      });
      birds.children.forEach((b) => {
        const u = b.userData;
        u.a += dt * u.sp * (1 + wx.wind * 0.3);
        b.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(u.a * 2.3) * 2.5, Math.sin(u.a) * u.r);
      });
      if (waterMesh) {
        waterMesh.material.uniforms.time.value += dt * (0.35 + 0.5 * wx.wind) * (state.tilt > 0.6 ? 0.6 : 1);
      }
      if (typeof mon.update === 'function') mon.update(ctx, t, dt);
      builder.animators.forEach((fn) => fn(t, dt));

      stepTween(now);
      controls.update();
      composer.render();
      frame++;

      if (!ready && frame > 2) {
        ready = true;
        body.classList.add('ready');
        setProgress(100, 'Ready');
        setTimeout(() => { bootEl.style.display = 'none'; }, 700);
        document.documentElement.dataset.boot = 'ok';
      }
      if (frame === 1) applySky(state.time, true);
    };
    renderer.setAnimationLoop(loopFn);

    /* ---------------- QA hooks ---------------- */
    window.__dbg = { sky, skyU, bloomPass, composer, keyLight, hemi, scene, renderer, camera, sunSprite, moonSprite };
    window.__india = {
      state, scene, camera, renderer, controls, mon, views,
      stats: () => ({
        meshes: meshCount, triangles: Math.round(tris),
        calls: renderer.info.render.calls, geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures, boot: document.documentElement.dataset.boot || ''
      }),
      goView, tourGo, setWeather, setTime: (v) => { state.time = v; applySky(v, true); },
      pause: () => { renderer.setAnimationLoop(null); composer.render(); },
      resume: () => { clock.getDelta(); renderer.setAnimationLoop(loopFn); }
    };
    if (new URLSearchParams(location.search).has('shot')) {
      const vt = parseFloat(new URLSearchParams(location.search).get('shot')) || 17;
      state.time = vt;
      timeEl.value = vt;
      $('time-val').textContent = fmtClock(vt);
      applySky(vt, true);
      controls.autoRotate = false;
      const vw = new URLSearchParams(location.search).get('view');
      if (vw !== null) {
        const v = views[parseInt(vw, 10)] || views[0];
        camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
        controls.target.set(v.target[0], v.target[1], v.target[2]);
      }
      // ?look=x,y,z&dist=&az=&el= points the camera at any coordinate, so a
      // feature can be inspected without first inventing a named viewpoint —
      // which is how I ended up three times inside a wall at Amber.
      const look = new URLSearchParams(location.search).get('look');
      if (look) {
        const t = look.split(',').map(Number);
        if (t.length === 3 && t.every((n) => Number.isFinite(n))) {
          const dist = parseFloat(new URLSearchParams(location.search).get('dist')) || 40;
          const az = (parseFloat(new URLSearchParams(location.search).get('az')) || 35) * Math.PI / 180;
          const el = (parseFloat(new URLSearchParams(location.search).get('el')) || 22) * Math.PI / 180;
          camera.position.set(
            t[0] + dist * Math.cos(el) * Math.sin(az),
            t[1] + dist * Math.sin(el),
            t[2] + dist * Math.cos(el) * Math.cos(az)
          );
          controls.target.set(t[0], t[1], t[2]);
        }
      }
      document.documentElement.dataset.qa = 'shot';
    }
  } catch (err) {
    fail(err);
  }

  function renderAbout() {
    const el = $('about-body');
    if (!el) return;
    const paras = (meta.history || []).map((p) => `<p>${esc(p)}</p>`).join('');
    const facts = (meta.facts || []).map((f) => `<div class="fact"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('');
    const links = (meta.links || []).map((l) =>
      `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></a>`).join('');
    const img = meta.image || {};
    const credit = img.file ? `<div class="credit">
        Photograph: <a href="${esc(img.page || '#')}" target="_blank" rel="noopener">${esc(img.file)}</a>
        by ${esc(img.artist || 'unknown')} · ${esc(img.license || 'see source')}
        ${img.licenseUrl ? `· <a href="${esc(img.licenseUrl)}" target="_blank" rel="noopener">licence</a>` : ''}.
        Sourced from Wikimedia Commons.<br>
        Text adapted from the <a href="${esc(meta.wikipedia || '#')}" target="_blank" rel="noopener">Wikipedia article</a>,
        available under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.
        The 3D miniature is procedural — no photographs were used in the model.
        <br>Model and code by <b>Dr Sohil Momin</b>, licensed
        <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">CC BY-NC 4.0</a>.
      </div>` : '';
    const INDEX = window.INDIA_INDEX || [];
    const i = INDEX.findIndex((x) => x.id === mon.id);
    const nextUp = i >= 0 && INDEX.length > 1
      ? `<div class="nextup"><span>Next in the atlas</span><a href="${esc(INDEX[(i + 1) % INDEX.length].id)}.html">${esc(INDEX[(i + 1) % INDEX.length].name)} <span class="deva">${esc(INDEX[(i + 1) % INDEX.length].deva || '')}</span> →</a></div>`
      : '';
    el.innerHTML = `${paras}${facts ? `<dl class="facts">${facts}</dl>` : ''}<div class="links">${links}</div>${nextUp}${credit}`;
  }

  function makeCtx(b, mon, scene, T, M) {
    const ctx = {
      THREE, scene, builder: b, T, M,
      add: b.add.bind(b), box: b.box.bind(b), plane: b.plane.bind(b), cyl: b.cyl.bind(b),
      cone: b.cone.bind(b), sph: b.sph.bind(b), torus: b.torus.bind(b), dome: b.dome.bind(b),
      onion: b.onion.bind(b), lathe: b.lathe.bind(b), arch: b.arch.bind(b), archShape: b.archShape.bind(b),
      archFrame: b.archFrame.bind(b), jali: b.jali.bind(b), carvedBand: b.carvedBand.bind(b), inlay: b.inlay.bind(b), parterre: b.parterre.bind(b), block: b.block.bind(b), col: b.col.bind(b),
      chhatri: b.chhatri.bind(b), arcade: b.arcade.bind(b), stairs: b.stairs.bind(b), railing: b.railing.bind(b),
      tree: b.tree.bind(b), person: b.person.bind(b), lamp: b.lamp.bind(b), flag: b.flag.bind(b), boat: b.boat.bind(b),
      /* a water surface anywhere on the site, with the engine's shader */
      waterBody: (x, z, w, d, o = {}) => {
        const geo = new THREE.PlaneGeometry(w, d, 1, 1);
        const mesh = new Water(geo, {
          textureWidth: 512, textureHeight: 512,
          waterNormals: T.waterNormal,
          sunDirection: new THREE.Vector3(0.5, 0.7, 0.4).normalize(),
          sunColor: 0xffffff,
          waterColor: o.color !== undefined ? o.color : 0x2f5a6b,
          distortionScale: o.distortion !== undefined ? o.distortion : 1.1,
          fog: true
        });
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x, o.y !== undefined ? o.y : 0.06, z);
        scene.add(mesh);
        // the kerb: a stone lip round the basin
        if (o.kerb) {
          b.add(o.kerb, b.box(w + 1.2, 0.34, 0.6), x, mesh.position.y + 0.1, z - d / 2 - 0.3);
          b.add(o.kerb, b.box(w + 1.2, 0.34, 0.6), x, mesh.position.y + 0.1, z + d / 2 + 0.3);
          b.add(o.kerb, b.box(0.6, 0.34, d + 1.2), x - w / 2 - 0.3, mesh.position.y + 0.1, z);
          b.add(o.kerb, b.box(0.6, 0.34, d + 1.2), x + w / 2 + 0.3, mesh.position.y + 0.1, z);
        }
        return mesh;
      },
      light: b.light.bind(b), animate: b.animate.bind(b),
      rng: b.rng, mat: (k) => M[k], tex: (k) => T[k],
      color: (hex) => new THREE.Color(hex),
      root: b.root
    };
    return ctx;
  }
}

/* --------------------------------------------------------------- helpers */
function defaultFloods(mon) {
  const H = mon.home || { target: [0, 8, 0] };
  const tx = H.target[0], tz = H.target[2];
  const b = (mon.bounds || 55) * 0.9;
  return [
    { pos: [tx - b, 26, tz + b], target: [tx, (H.target[1] || 8) * 0.8, tz], color: 0xffcf9a, intensity: 2600, distance: b * 6 },
    { pos: [tx + b, 22, tz + b * 0.7], target: [tx, (H.target[1] || 8) * 0.7, tz], color: 0xffd9b0, intensity: 1900, distance: b * 6 }
  ];
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function lotusSvg() {
  return `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 52c-8 0-15-5-18-12 5-1 10 1 13 4"/>
    <path d="M32 52c8 0 15-5 18-12-5-1-10 1-13 4"/>
    <path d="M32 52c-6-4-9-11-8-18 6 1 10 6 11 12"/>
    <path d="M32 52c6-4 9-11 8-18-6 1-10 6-11 12"/>
    <path d="M32 50c-2-6-2-13 0-19 2 6 2 13 0 19z"/>
    <circle cx="32" cy="20" r="3"/>
  </svg>`;
}
