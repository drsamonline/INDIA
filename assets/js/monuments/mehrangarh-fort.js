/* Mehrangarh — Jodhpur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Rebuilt to measured proportions (1 unit = 1 metre):
     · hill crest 122 m above the plain, scarp sheer, not a mound
     · enceinte 432 × 242 m (sources: 460 × 230 m), curtain 16–36 m
       tall, up to 21 m thick at the base, wall walk level at y = 96
     · seven gates in sequence up the east approach: Fateh, Gopal,
       Dedh Kangra, Amruti, Jai, Loha, Suraj
     · palace parapet at y = 122, i.e. 26 m above the wall walk      */

export default {
  id: 'mehrangarh-fort',
  accent: '#c08a5a',
  accent2: '#e0b088',
  seed: 101,
  floodScale: 0.35,
  time: 15.6,
  bounds: 300,
  minDist: 60,
  maxDist: 1200,
  home: { pos: [38, 79, 558], target: [116, 76, 46], fov: 40 },
  ground: { texture: 'sandGround', size: 3400, color: 0xc0a982, tile: 30 },
  views: [
    { name: 'Full', pos: [58, 78, 428], target: [116, 76, 46] },
    { name: 'The walls', pos: [-96, 96, 268], target: [-70, 76, 40] },
    { name: 'Palaces', pos: [246, 126, 168], target: [150, 104, 44] },
    { name: 'Seven gates', pos: [236, 78, 226], target: [120, 54, 122] },
    { name: 'Blue city', pos: [300, 40, 330], target: [40, 10, 120] }
  ],
  tour: [
    {
      title: 'Fort of the Sun', deva: 'मेहरानगढ़',
      text: 'Rao Jodha founded Mehrangarh in 1459 on a rocky hill above the new city of Jodhpur. The name means fort of the sun, and the Rathore rulers held it, with interruptions, until independence.',
      pos: [86, 54, 132], target: [0, 40, 0], time: 16.2
    },
    {
      title: 'Thirty-Six Metres', deva: 'प्राचीर',
      text: 'The walls rise up to 36 metres above the rock and are up to 21 metres thick in places, with seven gates, each named for a battle or a victory.',
      pos: [-30, 46, 96], target: [-10, 42, 0], time: 11
    },
    {
      title: 'The Palaces', deva: 'महल',
      text: 'Inside are the Moti Mahal, the Phool Mahal with its gold ceiling, the Sheesh Mahal and the Takhat Vilas, set around courtyards with pierced screens and coloured glass.',
      pos: [26, 48, 56], target: [0, 44, 0], time: 9.6
    },
    {
      title: 'Scars on the Gate', deva: 'द्वार',
      text: 'The second gate still carries cannonball scars from a siege, and the sati gate the handprints of the widows who immolated themselves there.',
      pos: [4, 30, 60], target: [0, 34, 18], time: 17.2
    },
    {
      title: 'The Blue City', deva: 'नीला शहर',
      text: 'Below the walls the blue-washed houses of Jodhpur spread out to the desert. The fort is now a museum run by a trust, and one of the most visited in Rajasthan.',
      pos: [70, 26, 90], target: [0, 16, 40], time: 17.8
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit from below, the sandstone turns to amber and the city becomes a field of small lights.',
      pos: [80, 48, 120], target: [0, 40, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, chhatri, lathe, arcade } = ctx;
    const rng = ctx.rng;

    const ROCK = 'terracotta', ROCKD = 'basalt', ROCKR = 'basaltDark';
    const WALL = 'sandstoneBuff', TRIM = 'sandstonePink', PAL = 'sandstoneBuff';
    const WHITE = 'plasterWhite', MARB = 'marble';

    /* ================================================================ *
     *  helpers                                                         *
     * ================================================================ */
    // a profile drawn in the (z, y) plane, extruded `thick` along local x
    function prof(pts, thick) {
      const s = new T3.Shape();
      pts.forEach(([z, y], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)));
      s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 1 });
      g.rotateY(-Math.PI / 2);
      g.translate(thick / 2, 0, 0);
      return g;
    }
    // a run a -> b in plan: length, midpoint, yaw (local +X along the run),
    // local +Z forced to point away from the origin
    function seg(a, b) {
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      let ry = Math.atan2(-dz, dx);
      let ox = Math.sin(ry), oz = Math.cos(ry);
      if (ox * mx + oz * mz < 0) { ry += Math.PI; ox = -ox; oz = -oz; }
      return { len, mx, mz, ry, ox, oz, ux: Math.cos(ry), uz: -Math.sin(ry) };
    }

    /* ================================================================ *
     *  1. THE ROCK — a sheer, faceted scarp, 122 m to the summit       *
     * ================================================================ */
    const WALK = 94;                    // rampart walk level, one line along the ridge
    const COURT = 90;                   // courtyard level inside

    // the enceinte, clockwise in plan, 432 m along the ridge (x) by 242 m
    const ring = [
      [218, -18], [206, 62], [168, 108], [96, 122], [20, 118],
      [-62, 112], [-128, 96], [-186, 58], [-212, 10], [-214, -48],
      [-176, -92], [-108, -116], [-28, -120], [58, -114], [136, -96], [196, -62]
    ];
    // height of the natural rock crest under the foot of the curtain.
    // the curtain walk is level, so wall height = WALK - crest + 2
    const crest = [68, 62, 60, 60, 64, 68, 72, 76, 78, 80, 78, 76, 72, 68, 64, 66];

    // solid core of the hill: the ring polygon, inset, up to the courtyard
    (function core() {
      const s = new T3.Shape();
      ring.forEach(([x, z], i) => {
        const k = 1 - 9 / Math.hypot(x, z);
        const px = x * k, pz = z * k;
        i ? s.lineTo(px, -pz) : s.moveTo(px, -pz);
      });
      s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth: COURT, bevelEnabled: false, curveSegments: 1 });
      g.rotateX(-Math.PI / 2);            // shape plane -> ground plane, extrude up
      add(ROCK, g, 0, 0, 0);
    })();

    /* The cliff is a single continuous surface, sampled around the ring and
       stacked in height. Its radius is pushed out by a talus term (widest at
       the foot, zero at the crest) plus layered noise, so the face is fluted
       and craggy rather than a smooth mound, and it meets the wall flush. */
    (function cliff() {
      const N = 210, NL = 12;
      const segs = [];
      let per = 0;
      for (let i = 0; i < ring.length; i++) {
        const g = seg(ring[i], ring[(i + 1) % ring.length]);
        g.ci = crest[i]; g.cj = crest[(i + 1) % ring.length];
        segs.push(g); per += g.len;
      }
      const ph = [rng() * 6.3, rng() * 6.3, rng() * 6.3, rng() * 6.3, rng() * 6.3];
      const samp = [];
      for (let k = 0; k < N; k++) {
        let d = (k / N) * per, acc = 0, si = 0;
        while (si < segs.length - 1 && acc + segs[si].len < d) { acc += segs[si].len; si++; }
        const g = segs[si];
        const t = Math.min(1, (d - acc) / g.len);
        const u = k / N;
        const x = g.mx + g.ux * (t - 0.5) * g.len;
        const z = g.mz + g.uz * (t - 0.5) * g.len;
        const c = g.ci + (g.cj - g.ci) * t;
        // talus and fluting, both fading to nothing at the crest
        const talus = 13.5 + 2.4 * Math.sin(2.0 * Math.PI * u * 3 + ph[0]);
        const flute = 5.0 * Math.sin(2 * Math.PI * u * 17 + ph[1])
                    + 3.4 * Math.sin(2 * Math.PI * u * 61 + ph[2])
                    + 2.2 * Math.sin(2 * Math.PI * u * 143 + ph[3])
                    + 1.2 * Math.sin(2 * Math.PI * u * 241 + ph[4]);
        samp.push({ x, z, c, nx: g.ox, nz: g.oz, talus, flute, u });
      }
      const pos = [], idx = [];
      for (let k = 0; k < N; k++) {
        const S = samp[k];
        for (let j = 0; j <= NL; j++) {
          const t = j / NL;
          const f = Math.pow(1 - t, 2.2);
          const ledge = 1.2 * Math.sin(t * 7.0 * Math.PI + S.u * 46.0)
                    + 0.7 * Math.sin(t * 15.0 * Math.PI + S.u * 23.0);
          const d = S.talus * f + (S.flute * 0.62 + ledge) * (1 - t) + 0.5;
          pos.push(S.x + S.nx * d, S.c * t, S.z + S.nz * d);
        }
      }
      for (let k = 0; k < N; k++) {
        const k2 = (k + 1) % N;
        for (let j = 0; j < NL; j++) {
          const a0 = k * (NL + 1) + j, b0 = k2 * (NL + 1) + j;
          idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1);
        }
      }
      // make sure the faces look outward, whichever way the ring runs
      (function orient() {
        const P = (i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
        const a0 = P(idx[0]), b0 = P(idx[1]), a1 = P(idx[2]);
        const e1 = [b0[0] - a0[0], b0[1] - a0[1], b0[2] - a0[2]];
        const e2 = [a1[0] - a0[0], a1[1] - a0[1], a1[2] - a0[2]];
        const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
        if (n[0] * samp[0].nx + n[2] * samp[0].nz < 0) {
          for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
        }
      })();
      const geo = new T3.BufferGeometry();
      geo.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      geo.setIndex(idx);
      // flat-shaded: a faceted rock face catches raking light, a smooth one does not
      const flat = geo.toNonIndexed();
      flat.computeVertexNormals();
      add(ROCK, flat, 0, 0, 0);

      // a scatter of fallen blocks clinging to the face
      for (let k = 0; k < 26; k++) {
        const S = samp[Math.floor(rng() * N)];
        const t = 0.10 + rng() * 0.6;
        const f = Math.pow(1 - t, 2.2);
        const d = S.talus * f + S.flute * 0.5 * (1 - t) + 0.8;
        const sc = 1.4 + rng() * 2.6;
        add(rng() < 0.22 ? ROCKR : ROCKD, box(sc, sc * 0.7, sc * 0.8),
          S.x + S.nx * d, S.c * t, S.z + S.nz * d,
          { ry: Math.atan2(-S.nx, -S.nz), rx: (rng() - 0.5) * 0.6, rz: (rng() - 0.5) * 0.6 });
      }
      // the ragged lip the curtain stands on
      for (let k = 0; k < N; k += 2) {
        const S = samp[k];
        add(ROCKD, box(4.4, 2.2, 3.6), S.x - S.nx * 1.6, S.c - 1.1, S.z - S.nz * 1.6,
          { ry: Math.atan2(-S.nx, -S.nz) });
      }
    })();

    // rubble and fallen blocks around the foot
    for (let i = 0; i < 70; i++) {
      const v = ring[Math.floor(rng() * ring.length)];
      const a = Math.atan2(v[1], v[0]) + (rng() - 0.5) * 0.42;
      const R = Math.hypot(v[0], v[1]);
      const r = 1.10 + rng() * 0.34;
      const s = 2.4 + rng() * 6.5;
      add(i % 3 === 0 ? ROCKD : ROCKR, box(s, s * (0.5 + rng() * 0.7), s * (0.7 + rng() * 0.6)),
        Math.cos(a) * R * r, s * 0.28, Math.sin(a) * R * r,
        { ry: rng() * 3.1, rx: (rng() - 0.5) * 0.6, rz: (rng() - 0.5) * 0.6 });
    }

    // courtyard floor inside the walls, so the enceinte is not a hollow shell
    block('paving', 300, 0.4, 176, 0, COURT, 0);
    block('paving', 180, 0.4, 150, -120, COURT, 10);
    // service courts, stables and the zenana ranges along the inside
    for (let i = 0; i < 6; i++) {
      const x = -176 + i * 30, z = -74 + (i % 2) * 8;
      block(PAL, 22, 9 + (i % 3) * 3, 26, x, COURT, z);
      add(TRIM, box(23, 0.8, 27), x, COURT + 10 + (i % 3) * 3, z);
      if (i % 4 === 0) add(WHITE, dome(4.4, 3.2, 12), x, COURT + 10.6, z);
    }
    for (let i = 0; i < 7; i++) {
      block(PAL, 26, 11, 20, -150 + i * 34, COURT, 86);
      add(TRIM, box(27, 0.8, 21), -150 + i * 34, COURT + 12, 86);
    }

    /* ================================================================ *
     *  2. THE CURTAINS — 16 to 36 m of masonry on the crest            *
     * ================================================================ */
    // profile: outer face at local z = 0, battering in as it rises
    const TB = 21, TT = 11, BAT = 4.2;
    function curtain(a, b, cA, cB) {
      const g = seg(a, b);
      const { len, mx, mz, ry, ox, oz, ux, uz } = g;
      const foot = Math.min(cA, cB) - 2;
      const H = WALK - foot;
      const L = len + 4;
      const at = (d) => [mx + ox * d, mz + oz * d];
      let p;

      p = at(0);
      add(WALL, prof([[0, 0], [BAT, H], [BAT - TT, H], [-(TB - BAT), 0]], L), p[0], foot, p[1], { ry });
      // plinth course where it meets the rock
      p = at(1.1);
      add(TRIM, prof([[0, 0], [0.5, 2.4], [-2.4, 2.4], [-2.4, 0]], L), p[0], foot, p[1], { ry });
      // string course at two thirds height
      p = at(BAT * 0.66 + 0.9);
      add(TRIM, box(L, 1.2, 3.4), p[0], foot + H * 0.66, p[1], { ry });
      // wall head and the corbelled brattice band
      p = at(BAT - 0.4);
      add(TRIM, box(L, 1.0, 3.0), p[0], WALK - 0.2, p[1], { ry });
      const nb = Math.max(3, Math.round(len / 7.0));
      for (let i = 0; i < nb; i++) {
        const t = ((i + 0.5) / nb - 0.5) * len;
        add(WALL, box(1.5, 0.9, 2.1), mx + ux * t + ox * (BAT - 0.6), WALK - 1.4,
          mz + uz * t + oz * (BAT - 0.6), { ry });
      }
      // parapet, set back to leave a walk
      p = at(BAT - 3.2);
      add(WALL, box(L, 1.9, 1.5), p[0], WALK + 0.95, p[1], { ry });
      // merlons along the outer parapet
      const n = Math.max(3, Math.round(len / 5.5));
      for (let i = 0; i < n; i++) {
        const t = ((i + 0.5) / n - 0.5) * len;
        add(WALL, box(1.5, 1.7, 1.7), mx + ux * t + ox * (BAT - 3.2), WALK + 2.75,
          mz + uz * t + oz * (BAT - 3.2), { ry });
      }
      // loopholes on the outer face
      const nl = Math.max(2, Math.round(len / 9));
      for (let i = 0; i < nl; i++) {
        const t = ((i + 0.5) / nl - 0.5) * len * 0.86;
        add('dark', box(0.7, 1.9, 0.9), mx + ux * t + ox * (BAT * 0.5 + 0.3), foot + H * 0.42,
          mz + uz * t + oz * (BAT * 0.5 + 0.3), { ry });
      }
      // buttress ribs
      const nr = Math.max(1, Math.round(len / 16));
      for (let i = 0; i < nr; i++) {
        const t = ((i + 0.5) / nr - 0.5) * len * 0.9;
        add(WALL, box(3.2, H * 0.92, 4.4), mx + ux * t + ox * 1.4, foot + H * 0.46,
          mz + uz * t + oz * 1.4, { ry });
      }
    }
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      curtain(ring[i], ring[j], crest[i], crest[j]);
    }

    // round bastions on every vertex
    function bastion(x, z, r, foot, cap) {
      const H = WALK + 5 - foot;
      add(WALL, cyl(r + 1.4, r + 3.2, H * 0.34, 13), x, foot + H * 0.17, z);
      add(WALL, cyl(r, r + 1.4, H * 0.66, 13), x, foot + H * 0.34 + H * 0.33, z);
      add(TRIM, cyl(r + 1.0, r + 1.0, 1.1, 13), x, WALK + 4.4, z);
      add(WALL, cyl(r - 0.4, r + 0.9, 2.2, 13), x, WALK + 5.6, z);
      const n = Math.max(7, Math.round((2 * Math.PI * r) / 5.2));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        add(WALL, box(1.5, 1.7, 1.6), x + Math.cos(a) * (r - 0.4), WALK + 7.4,
          z + Math.sin(a) * (r - 0.4), { ry: Math.PI / 2 - a });
      }
      for (let i = 0; i < 4; i++) {
        const a = 0.4 + i * 1.55;
        add('dark', box(0.8, 2.1, 1.0), x + Math.cos(a) * (r + 0.4), foot + H * 0.62,
          z + Math.sin(a) * (r + 0.4), { ry: Math.PI / 2 - a });
      }
      if (cap === 'chhatri') chhatri(x, WALK + 8.6, z, 1.9, WALL, MARB);
      if (cap === 'dome') {
        add(TRIM, cyl(r * 0.55, r * 0.66, 2.0, 14), x, WALK + 9.4, z);
        add(WHITE, onion(r * 0.62, 6.2, 18), x, WALK + 10.4, z);
        add('gold', sph(0.35, 8), x, WALK + 16.8, z);
      }
    }
    const caps = ['chhatri', 'dome', null, 'chhatri', null, null, 'chhatri', null,
      'dome', null, 'chhatri', null, null, 'dome', null, 'chhatri'];
    ring.forEach((v, i) => bastion(v[0], v[1], 9.5 + (i % 3) * 1.4, crest[i] - 2, caps[i]));

    /* ================================================================ *
     *  3. THE SEVEN GATES — up the east approach, one after another    *
     * ================================================================ */
    // the road: a chain of landings climbing the east flank
    const road = [
      [300, 176, 0], [258, 150, 4], [226, 138, 9], [198, 134, 18],
      [168, 138, 28], [140, 136, 38], [118, 128, 48], [104, 114, 58],
      [96, 98, 68], [88, 82, 76], [76, 66, 82], [64, 54, 88], [58, 36, 90]
    ];
    for (let i = 0; i < road.length - 1; i++) {
      const [x1, z1, y1] = road[i], [x2, z2, y2] = road[i + 1];
      const dx = x2 - x1, dz = z2 - z1, dy = y2 - y1;
      const hz = Math.hypot(dx, dz);
      const pitch = Math.atan2(dy, hz);
      const len = Math.hypot(hz, dy);
      const ry = Math.atan2(-dz, dx);
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, my = (y1 + y2) / 2;
      // roadway slab, top surface at the road level
      add(TRIM, box(len + 1.5, 1.2, 8), mx, my - 0.6, mz, { ry, rz: pitch });
      // kerbs
      [-1, 1].forEach((s) => {
        add(TRIM, box(len + 1.5, 0.9, 1.0), mx + Math.sin(ry) * s * 4.1, my + 0.2,
          mz + Math.cos(ry) * s * 4.1, { ry, rz: pitch });
      });
      // retaining wall on the downhill side
      add(WALL, box(len + 1.5, Math.max(2, my), 3.2), mx + Math.sin(ry) * 5.8, my / 2 - 0.6,
        mz + Math.cos(ry) * 5.8, { ry });
      add(TRIM, box(len + 1.5, 0.6, 3.6), mx + Math.sin(ry) * 5.8, Math.max(2, my) - 0.3,
        mz + Math.cos(ry) * 5.8, { ry });
    }

    // a gate: two pylons, a pointed arch, a jharokha and a crest of merlons
    function pol(gx, gz, gy, ry, w, h, big) {
      const nx = Math.sin(ry), nz = Math.cos(ry);      // across the road
      const fx = Math.cos(ry), fz = -Math.sin(ry);     // along the road
      const P = (s, d) => [gx + nx * s + fx * d, gz + nz * s + fz * d];
      let p;
      [-1, 1].forEach((sg) => {
        p = P(sg * (w / 2 + 2.2), 0);
        block(WALL, 5.0, h, 9.0, p[0], gy, p[1], { ry });
        block(TRIM, 5.6, 0.9, 9.6, p[0], gy + h, p[1], { ry });
      });
      // the mass over the passage
      block(WALL, w + 9, h * 0.42, 9.0, gx, gy + h * 0.58, gz, { ry });
      add('dark', arch(w - 1.2, h * 0.62, 1.2), gx, gy + 0.1, gz, { ry });
      add(TRIM, archFrame(w - 0.6, h * 0.68, 0.7, 1.4), gx, gy + 0.1, gz, { ry });
      // crest and merlons
      block(TRIM, w + 10, 1.0, 10.0, gx, gy + h, gz, { ry });
      for (let i = -3; i <= 3; i++) {
        p = P(i * 2.1, 0);
        block(WALL, 1.5, 1.7, 1.6, p[0], gy + h + 1.0, p[1], { ry });
      }
      // a jharokha over the arch, on the downhill face
      p = P(0, 4.8);
      block(TRIM, 4.6, 3.6, 2.2, p[0], gy + h * 0.60, p[1], { ry });
      add('dark', arch(2.2, 2.4, 0.3), p[0], gy + h * 0.60 + 0.4, p[1], { ry });
      add(TRIM, box(5.2, 0.4, 3.0), p[0], gy + h * 0.60 + 3.8, p[1], { ry });
      if (big) {
        [-1, 1].forEach((sg) => {
          const r = P(sg * (w / 2 + 2.2), 0);
          chhatri(r[0], gy + h + 1.0, r[1], 1.5, WALL, MARB);
        });
        add(WHITE, dome(2.2, 2.0, 14), gx, gy + h + 1.0, gz, { ry });
      }
      ctx.flag(gx, gy + h + 2.2, gz, 7, 'fabricSaffron');
    }

    // the seven gates, each standing across the road where it turns
    const R2 = (x1, z1, x2, z2) => Math.atan2(-(z2 - z1), x2 - x1);
    pol(270, 156, 4, R2(300, 176, 258, 150), 12, 17, false);   // 1 Fateh Pol
    pol(214, 137, 15, R2(226, 138, 198, 134), 11, 15, false);  // 2 Gopal Pol
    pol(168, 138, 28, R2(168, 138, 140, 136), 12, 17, false);  // 3 Dedh Kangra Pol
    pol(126, 131, 44, R2(118, 128, 104, 114), 11, 14, false);  // 4 Amruti Pol
    pol(104, 114, 58, R2(104, 114, 96, 98), 16, 30, true);     // 5 Jai Pol, in the curtain
    pol(88, 82, 76, R2(88, 82, 76, 66), 11, 15, false);        // 6 Loha Pol
    pol(64, 54, 88, R2(64, 54, 58, 36), 11, 14, true);         // 7 Suraj Pol

    // cannonball scars on Dedh Kangra Pol
    for (let i = 0; i < 9; i++) {
      const px = 168 + (rng() - 0.5) * 14, pz = 133.6;
      add(ROCKD, sph(0.45 + rng() * 0.5, 7), px, 30 + rng() * 9, pz, { sy: 0.35 });
    }
    // the gilded sati handprints at Loha Pol
    for (let i = 0; i < 15; i++) {
      add('gold', box(0.32, 0.42, 0.1), 85 + (i % 5) * 1.5, 78 + Math.floor(i / 5) * 1.1, 86.0);
    }

    /* ================================================================ *
     *  4. THE PALACE — its parapet 26 m above the wall walk            *
     * ================================================================ */
    (function palace() {
      const F = COURT;                     // floor 90; parapet 114; finials 122
      const CX = 150, CZ = 44;

      // great terrace over the ridge, and the wall of the inner court
      block(ROCK, 116, 3, 62, CX, F - 3, CZ);
      add(TRIM, box(118, 1.0, 64), CX, F - 0.5, CZ);

      // lower storey: 90 -> 106
      block(PAL, 96, 16, 44, CX, F, CZ);
      add(WHITE, box(97, 0.9, 45), CX, F + 8.6, CZ);
      add(TRIM, box(98, 1.1, 46), CX, F + 16, CZ);
      arcade(TRIM, { count: 13, w: 3.0, h: 6.0, depth: 0.7, spacing: 6.8, x: CX, y: F + 1.2, z: CZ + 22.4 });
      arcade(TRIM, { count: 5, w: 2.6, h: 5.2, depth: 0.7, spacing: 7.4, x: CX + 48.2, y: F + 1.2, z: CZ, ry: Math.PI / 2 });

      // upper storey: 106 -> 114
      block(PAL, 84, 8, 34, CX - 2, F + 16, CZ + 1);
      add(WHITE, box(85, 0.8, 35), CX - 2, F + 17.0, CZ + 1);
      add(TRIM, box(86, 1.1, 36), CX - 2, F + 24, CZ + 1);
      arcade(TRIM, { count: 11, w: 2.5, h: 3.6, depth: 0.6, spacing: 7.2, x: CX - 2, y: F + 17.2, z: CZ + 18.4 });

      // the tall zenana block on the seaward corner
      block(PAL, 28, 26, 32, CX + 40, F, CZ - 6);
      add(WHITE, box(29, 0.9, 33), CX + 40, F + 13.0, CZ - 6);
      add(TRIM, box(30, 1.1, 34), CX + 40, F + 26.0, CZ - 6);
      for (let i = 0; i < 3; i++) {
        add('dark', arch(2.0, 3.2, 0.3), CX + 40, F + 3.5 + i * 8, CZ + 10.4);
        add(WHITE, archFrame(2.5, 3.7, 0.25, 0.4), CX + 40, F + 3.5 + i * 8, CZ + 10.6);
      }
      chhatri(CX + 40, F + 27.1, CZ - 6, 1.7, PAL, MARB);

      // projecting jharokhas along the front
      for (let i = -3; i <= 3; i++) {
        const x = CX + i * 12.5;
        block(PAL, 4.4, 5.4, 3.2, x, F + 17.4, CZ + 18.6);
        add('dark', arch(2.1, 3.1, 0.25), x, F + 18.4, CZ + 20.2);
        add(WHITE, archFrame(2.6, 3.5, 0.22, 0.35), x, F + 18.4, CZ + 20.3);
        add(WHITE, box(5.1, 0.4, 3.8), x, F + 22.9, CZ + 18.8);
        add(TRIM, box(5.4, 0.35, 4.1), x, F + 23.3, CZ + 18.8);
        add(MARB, dome(2.1, 1.9, 12), x, F + 23.6, CZ + 18.8);
        add('gold', sph(0.22, 8), x, F + 25.7, CZ + 18.8);
      }

      // roof terrace, parapet and pavilions: finials reach 122
      const RY = F + 24;                   // 114
      add(TRIM, box(86, 1.2, 36), CX - 2, RY - 0.4, CZ + 1);
      add(PAL, box(86, 1.8, 1.3), CX - 2, RY + 0.9, CZ + 18.4);
      add(PAL, box(86, 1.8, 1.3), CX - 2, RY + 0.9, CZ - 16.4);
      [-1, 1].forEach((s) => add(PAL, box(1.3, 1.8, 36), CX - 2 + s * 42, RY + 0.9, CZ + 1));
      for (let i = -8; i <= 8; i++) {
        add(PAL, box(1.5, 1.5, 1.5), CX - 2 + i * 3.4, RY + 2.6, CZ + 18.4);
        add(PAL, box(1.5, 1.4, 1.5), CX - 2 + i * 3.4, RY + 2.5, CZ - 16.4);
      }
      [[CX - 22, CZ - 8], [CX + 18, CZ - 8]].forEach(([px, pz]) => {
        add(TRIM, box(10.0, 0.5, 10.0), px, RY + 0.6, pz);
        [[-3.8, -3.8], [3.8, -3.8], [-3.8, 3.8], [3.8, 3.8]].forEach(([ax, az]) => {
          add(PAL, cyl(0.5, 0.54, 3.4, 8), px + ax, RY + 2.5, pz + az);
        });
        add(PAL, box(9.4, 0.7, 9.4), px, RY + 4.3, pz);
        add(WHITE, dome(3.5, 2.6, 14), px, RY + 4.7, pz);
        add('gold', sph(0.26, 8), px, RY + 7.6, pz);
      });
      [-32, -12, 8, 28].forEach((dx) => chhatri(CX + dx, RY + 0.9, CZ + 12.0, 1.35, PAL, MARB));

      // domed corner towers, clear of the roof
      [-1, 1].forEach((s) => {
        const tx = CX + s * 46, tz = CZ + 12;
        block(PAL, 12, 30, 12, tx, F, tz);
        add(WHITE, box(12.8, 0.9, 12.8), tx, F + 15, tz);
        add(TRIM, box(13.6, 1.0, 13.6), tx, F + 30, tz);
        add(PAL, cyl(4.0, 4.4, 2.0, 14), tx, F + 33, tz);
        add(WHITE, onion(4.5, 5.4, 18), tx, F + 34.2, tz);
        add('gold', cyl(0.1, 0.1, 1.4, 6), tx, F + 40.0, tz);
        add('gold', sph(0.28, 8), tx, F + 41.0, tz);
      });

      // the court the gates open into, with pierced screens
      block(TRIM, 50, 0.6, 30, 78, COURT - 0.6, 24);
      for (let i = 0; i < 9; i++) add('jali', box(4.4, 5.0, 0.4), 60 + i * 5.4, COURT + 2.5, 39.5);
      add(TRIM, box(50, 0.7, 1.2), 78, COURT + 5.2, 39.5);
      block(PAL, 22, 8, 12, 78, COURT, 12);
      add(TRIM, box(23, 0.9, 13), 78, COURT + 8, 12);
      add(MARB, dome(5.0, 3.2, 14), 78, COURT + 8.5, 12);
      // the coronation seat
      add(MARB, cyl(2.6, 3.0, 1.1, 8), 78, COURT + 0.55, 26);
      add(MARB, cyl(1.5, 1.9, 0.9, 8), 78, COURT + 1.5, 26);

      // the Chamunda temple on the western wall
      block(PAL, 14, 8, 12, -46, COURT, 58);
      add(WHITE, dome(5.2, 3.6, 14), -46, COURT + 8, 58);
      add('gold', sph(0.3, 8), -46, COURT + 11.6, 58);
    })();

    /* ================================================================ *
     *  5. THE BLUE CITY                                               *
     * ================================================================ */
    for (let i = 0; i < 48; i++) {
      const a = rng() * Math.PI * 2;
      const r = 268 + 380 * Math.pow(rng(), 0.62);
      const x = Math.cos(a) * r, z = Math.sin(a) * r * 1.05;
      const w = 6 + rng() * 5, d = 6 + rng() * 4.5, h = 5 + rng() * 8;
      const isBlue = rng() < 0.7;
      const key = isBlue ? 'blue' : 'plasterWhite';
      const ry = rng() * 3.14;
      block(key, w, h, d, x, 0, z, { ry });
      add(isBlue ? 'blue' : 'cream', box(w + 0.6, 0.5, d + 0.6), x, h + 0.25, z, { ry });
      if (isBlue) add('cream', box(w + 0.7, 0.28, d + 0.7), x, h + 0.6, z, { ry });
      if (!isBlue && rng() < 0.12) add('plasterWhite', dome(2.4, 2.2, 10), x, h + 0.5, z);
    }
    // denser belts on the city side
    for (let i = 0; i < 100; i++) {
      const a = -1.1 + rng() * 2.2;
      const r = 262 + rng() * 300;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const w = 6.4 + rng() * 5, d = 6.4 + rng() * 4.5, h = 5.5 + rng() * 8;
      const isB = rng() < 0.72;
      const key = isB ? 'blue' : 'plasterWhite';
      block(key, w, h, d, x, 0, z, { ry: rng() * 3.14 });
      add(isB ? 'blue' : 'cream', box(w + 0.6, 0.5, d + 0.6), x, h + 0.25, z);
    }

    /* ================================================================ *
     *  6. LIFE                                                        *
     * ================================================================ */
    // a figure that can stand on a rampart or a landing
    function figure(x, y, z, ry, key) {
      add(key, cyl(0.18, 0.26, 0.66, 7), x, y + 1.04, z, { ry });
      add(key, sph(0.2, 7), x, y + 1.34, z, { ry, sy: 0.6 });
      add('bark', sph(0.12, 8), x, y + 1.56, z, { sy: 1.1 });
      add('grey', cyl(0.08, 0.09, 0.76, 5), x, y + 0.38, z);
    }
    const crowds = [
      [276, 3, 160], [268, 3, 152], [284, 3, 156], [210, 14, 136], [204, 14, 142],
      [152, 33, 137], [146, 33, 143], [110, 53, 121], [92, 71, 90], [86, 71, 96],
      [70, 86, 60], [64, 86, 66], [96, 90, 44], [88, 90, 50], [104, 90, 50]
    ];
    crowds.forEach(([x, y, z], i) => figure(x, y, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3]));

    // sentries on the wall walk
    [[-70, 40], [-20, 118], [96, 120], [168, 106]].forEach(([x, z], i) =>
      figure(x, WALK, z, i * 1.4, 'fabricRed'));

    [[292, 210], [340, 176], [252, 232], [376, 138], [210, 250], [-300, 180],
      [-340, 60], [-260, 240], [160, 264], [-120, 272]].forEach(([x, z], i) =>
      ctx.tree(x, z, 1.5 + (i % 3) * 0.35, i % 4 === 0 ? 'palm' : 'round'));

    [[286, 186], [246, 214], [330, 200], [206, 176]].forEach(([x, z]) => ctx.lamp(x, z, 4.2, 'black'));

    ctx.light({ pos: [-140, 150, 240], target: [-40, 96, 20], color: 0xffd0a0, intensity: 9000, distance: 620 });
    ctx.light({ pos: [230, 160, 210], target: [150, 100, 0], color: 0xffc890, intensity: 8000, distance: 620 });
    ctx.light({ pos: [40, 60, 420], target: [0, 30, 140], color: 0xffbe86, intensity: 5000, distance: 520 });
  }
};
