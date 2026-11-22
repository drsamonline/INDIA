/* Lotus Temple — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'lotus-temple',
  accent: '#d8d2c4',
  accent2: '#f0e8d8',
  seed: 53,
  time: 16.4,
  bounds: 70,
  minDist: 16,
  maxDist: 240,
  home: { pos: [46, 22, 62], target: [0, 13, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8d9a63 },
  views: [
    { name: 'Full', pos: [46, 22, 62], target: [0, 13, 0] },
    { name: 'Petals', pos: [20, 26, 34], target: [0, 17, 0] },
    { name: 'Approach', pos: [0, 10, 70], target: [0, 12, 0] },
    { name: 'Aerial', pos: [44, 52, 46], target: [0, 6, 0] },
    { name: 'Pools', pos: [-28, 6, 30], target: [-7, 6, 11] }
  ],
  tour: [
    {
      title: 'A House of Worship', deva: 'कमल मंदिर',
      text: 'The Lotus Temple is a Bahá’í House of Worship on the eastern edge of New Delhi, completed in 1986. Fariborz Sahba shaped it as a lotus of twenty-seven marble petals — nine in each of three rings.',
      pos: [54, 27, 76], target: [0, 12, 0], time: 17.1
    },
    {
      title: 'Twenty-Seven Petals', deva: 'कमल की पंखुड़ियाँ',
      text: 'The petals are clad in white marble and close over a hall that seats about 1,300 people. There is no altar and no pulpit: Bahá’í houses of worship are open to every faith, and the only sound inside is the reading of scriptures.',
      pos: [18, 24, 30], target: [0, 15, 0], time: 12
    },
    {
      title: 'Nine Ways In', deva: 'नौ द्वार',
      text: 'Nine paths and nine pools ring the plinth, set in twenty-six acres of gardens. The building is entered from any of them; there is no front door and no preferred direction.',
      pos: [0, 9, 62], target: [0, 11, 0], time: 9.4
    },
    {
      title: 'A Flower in Plan', deva: 'योजना',
      text: 'From above the geometry is exact: three concentric rings of nine petals, each ring leaning further inward than the one below, so the building closes like a bud at the top.',
      pos: [40, 46, 42], target: [0, 6, 0], time: 11
    },
    {
      title: 'Marble and Water', deva: 'संगमरमर',
      text: 'The petals are white marble, the paths red sandstone, and the pools hold the building’s reflection through the day. At dusk the flower is lit from below.',
      pos: [-24, 6, 26], target: [-6, 6, 10], time: 18.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit at night, the petals read as a single white flower above the gardens — the image most visitors carry away.',
      pos: [36, 18, 50], target: [0, 10, 0], time: 21.3
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus, plane } = ctx;

    /* white marble, shaded from both sides so the thin petal shells read as
       solid carved stone from any angle */
    const MARBLE = ctx.mat('marble').clone();
    MARBLE.side = T3.DoubleSide;
    MARBLE.needsUpdate = true;
    const MARBLE2 = ctx.mat('marbleWarm').clone();
    MARBLE2.side = T3.DoubleSide;
    MARBLE2.needsUpdate = true;

    /* ---- plinth, pools and paths ---------------------------------------- */
    col(MARBLE, 22.5, 23.5, 1.1, 0, 0, 0, 48);
    add('sandstoneRed', torus(22.7, 0.17, 6, 48), 0, 1.14, 0, { rx: Math.PI / 2 });
    add('sandstoneRed', torus(12.6, 0.14, 5, 40), 0, 1.16, 0, { rx: Math.PI / 2 });
    // nine radial paths and nine pools
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      add('sandstoneRed', box(3.2, 0.14, 24), Math.cos(a) * 35, 0.08, Math.sin(a) * 35, { ry: -a });
      add(MARBLE, cyl(4.3, 4.5, 0.5, 20), Math.cos(a + 0.35) * 30, 0.25, Math.sin(a + 0.35) * 30);
      add('water', cyl(3.8, 3.8, 0.16, 20), Math.cos(a + 0.35) * 30, 0.5, Math.sin(a + 0.35) * 30);
    }
    // garden beds between the paths
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
      add('grass', box(11, 0.12, 9), Math.cos(a) * 33, 0.07, Math.sin(a) * 33, { ry: -a });
    }

    /* ---- one petal -------------------------------------------------------
       A shell, not a scaled hemisphere: a spine that springs from the base
       ring, swells outward and turns in again at the tip; a half-width that
       starts at nothing, is widest at about 40% of the height and closes to
       a point; and a section that cups so the edges curl inward. Built as a
       closed double-skinned surface with a rim. */
    const WPROF = (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.9);

    function petalGeometry(o) {
      const { H, R0, Rmid, Rtip, W, cup, thick, bulgeY = 0.35 } = o;
      const NU = 15, NV = 10, U0 = 0.02, U1 = 0.988;
      const pt = (u, v) => {
        const b0 = (1 - u) * (1 - u), b1 = 2 * u * (1 - u), b2 = u * u;
        const y = b1 * bulgeY * H + b2 * H;
        const z = b0 * R0 + b1 * Rmid + b2 * Rtip;
        const w = W * WPROF(u);
        const k = cup * w * v * v;
        return new T3.Vector3(v * w, y + 0.3 * k, z - k);
      };
      const verts = [], idx = [];
      const go = [], gi = [];
      const du = 0.005, dv = 0.03;
      for (let i = 0; i <= NU; i++) {
        const u = U0 + (U1 - U0) * (i / NU);
        go.push([]); gi.push([]);
        for (let j = 0; j <= NV; j++) {
          const v = -1 + 2 * (j / NV);
          const p = pt(u, v);
          const pu = pt(Math.min(u + du, 1), v).sub(pt(Math.max(u - du, 0), v));
          const pv = pt(u, Math.min(v + dv, 1)).sub(pt(u, Math.max(v - dv, -1)));
          const n = new T3.Vector3().crossVectors(pu, pv).normalize();
          if (n.z < 0) n.negate();
          go[i].push(verts.push(p.clone()) - 1);
          gi[i].push(verts.push(p.clone().addScaledVector(n, -thick)) - 1);
        }
      }
      const quad = (a, b, c, d) => { idx.push(a, b, c, a, c, d); };
      for (let i = 0; i < NU; i++) {
        for (let j = 0; j < NV; j++) {
          quad(go[i][j], go[i + 1][j], go[i + 1][j + 1], go[i][j + 1]);
          quad(gi[i][j], gi[i][j + 1], gi[i + 1][j + 1], gi[i + 1][j]);
        }
      }
      // rims: both long edges and both ends, so the shell closes
      for (let i = 0; i < NU; i++) {
        quad(go[i][0], gi[i][0], gi[i + 1][0], go[i + 1][0]);
        quad(go[i][NV], go[i + 1][NV], gi[i + 1][NV], gi[i][NV]);
      }
      for (let j = 0; j < NV; j++) {
        quad(go[0][j], go[0][j + 1], gi[0][j + 1], gi[0][j]);
        quad(go[NU][j], gi[NU][j], gi[NU][j + 1], go[NU][j + 1]);
      }
      const g = new T3.BufferGeometry();
      const arr = new Float32Array(verts.length * 3);
      verts.forEach((p, k) => { arr[k * 3] = p.x; arr[k * 3 + 1] = p.y; arr[k * 3 + 2] = p.z; });
      g.setAttribute('position', new T3.BufferAttribute(arr, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    /* ---- the three rings of nine -----------------------------------------
       Outer ring leans out and stands almost upright at the tip; the middle
       ring draws in; the inner ring closes over the top. Read from the side
       the three together make a bud — widest a third of the way up, closing
       to a single point. */
    const BASE = 1.1;
    const RINGS = [
      { R0: 14.2, Rmid: 18.4, Rtip: 10.8, H: 27.2, W: 5.6, cup: 0.56, thick: 0.34, rot: 0, mat: MARBLE },
      { R0: 10.6, Rmid: 13.4, Rtip: 6.6, H: 29.4, W: 4.7, cup: 0.60, thick: 0.32, rot: Math.PI / 9, mat: MARBLE2 },
      { R0: 6.8, Rmid: 8.6, Rtip: 1.6, H: 31.4, W: 3.7, cup: 0.66, thick: 0.30, rot: 0, mat: MARBLE }
    ];
    RINGS.forEach((r) => {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + r.rot;
        const g = petalGeometry(r);
        add(r.mat, g, 0, BASE, 0, { ry: Math.PI / 2 - a });
      }
    });

    /* ---- the base drum, the nine doors and the hall ----------------------- */
    col(MARBLE, 12.6, 13.6, 1.0, 0, BASE, 0, 40);
    col(MARBLE, 12.9, 12.9, 3.4, 0, BASE + 1.0, 0, 40);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
      add('dark', box(3.0, 5.6, 0.6), Math.cos(a) * 12.6, BASE + 3.3, Math.sin(a) * 12.6, { ry: -a + Math.PI / 2 });
    }
    add('sandstoneRed', cyl(12.95, 12.95, 0.35, 40), 0, BASE + 4.4, 0);
    // hall within, seen through the doors
    add('glass', cyl(9.2, 9.2, 9.0, 32), 0, BASE + 3.0, 0);
    add(MARBLE, cyl(9.6, 9.2, 0.6, 32), 0, BASE + 7.6, 0);
    add(MARBLE, cyl(2.4, 3.2, 2.2, 24), 0, BASE + 7.9, 0);
    // the bud closes: a cap where the inner ring meets at the apex
    add(MARBLE, dome(1.9, 3.0, 22), 0, BASE + 29.2, 0);
    add('gold', sph(0.17, 10), 0, BASE + 32.2, 0);

    /* ---- the gardens ------------------------------------------------------- */
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + 0.15;
      const r = 46 + (i % 3) * 7;
      ctx.tree(Math.cos(a) * r, Math.sin(a) * r, 1.05 + (i % 4) * 0.12, i % 5 === 0 ? 'palm' : 'round');
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.35;
      ctx.lamp(Math.cos(a) * 32, Math.sin(a) * 32, 3.4, 'black');
    }
    const people = [[-6, 24], [7, 25], [-14, 18], [14, 19], [0, 27], [-20, 12], [20, 13], [-3, 18],
      [4, 17], [-11, 26], [12, 27], [17, 22]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    ctx.light({ pos: [-22, 12, 26], target: [0, 14, 0], color: 0xfff0d8, intensity: 2600, distance: 150 });
    ctx.light({ pos: [22, 12, 24], target: [0, 14, 0], color: 0xffe8c8, intensity: 2200, distance: 150 });
  }
};
