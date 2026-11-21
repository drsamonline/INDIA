/* Victoria Memorial — Kolkata · procedural miniature
   Indo-Saracenic marble memorial on the Maidan, 1906–1921.
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'victoria-memorial',
  accent: '#d8d2c4',
  accent2: '#f0e8d8',
  seed: 23,
  bounds: 130,
  minDist: 26,
  maxDist: 480,
  home: { pos: [70, 33, 166], target: [4, 23, 8], fov: 33 },
  ground: { texture: 'grass', size: 1800, color: 0x8b9468 },
  floods: [
    { pos: [-96, 34, 104], target: [0, 26, 0], color: 0xffd9ae, intensity: 3200, distance: 420 },
    { pos: [98, 30, 88], target: [0, 28, 0], color: 0xffe2bc, intensity: 2600, distance: 420 },
    { pos: [0, 16, 150], target: [0, 30, 20], color: 0xffd2a0, intensity: 1800, distance: 320 }
  ],
  views: [
    { name: 'Full', pos: [70, 33, 166], target: [4, 23, 8] },
    { name: 'Dome', pos: [34, 52, 86], target: [0, 44, 0] },
    { name: 'Facade', pos: [6, 13, 82], target: [0, 14, 12] },
    { name: 'Angel', pos: [11, 54, 24], target: [0, 51, 0] },
    { name: 'Pool', pos: [20, 5, 116], target: [0, 20, 30] }
  ],
  tour: [
    {
      title: 'A Memorial to an Empress', deva: 'विक्टोरिया मेमोरियल',
      text: 'The Victoria Memorial was proposed by Lord Curzon after Queen Victoria died in 1901, and built between 1906 and 1921 as a memorial to the Empress of India. Martin & Co. of Calcutta were the contractors for the superstructure, which went up from 1910.',
      pos: [72, 34, 128], target: [0, 25, 2], time: 16.8
    },
    {
      title: 'The Dome and the Angel', deva: 'गुंबद',
      text: 'The central dome is cut from Makrana marble, the same stone as the Taj Mahal. On its summit stands the bronze Angel of Victory, 4.9 metres tall, mounted on bearings so that it turns with the wind.',
      pos: [40, 48, 76], target: [0, 44, 0], time: 15.2
    },
    {
      title: 'Two Architects', deva: 'स्थापत्य',
      text: 'William Emerson designed the memorial with Vincent Esch, blending Indo-Saracenic forms with Mughal detail — high arcades, corner domes, domed chhatris and a long reflecting pool aligned on the Maidan.',
      pos: [-30, 16, 92], target: [0, 16, 8], time: 11.5
    },
    {
      title: 'The Arcaded Verandah', deva: 'बरामदा',
      text: 'Deep verandahs of pointed arches and slim columns run the whole length of the building, wrapping the hall in shade. Above them a band of small windows sits under the cornice and its parapet.',
      pos: [34, 11, 62], target: [8, 11, 30], time: 9.4
    },
    {
      title: 'The Reflecting Pool', deva: 'जलाशय',
      text: 'A long rectangular tank lies on the axis in front of the memorial, mirroring the dome. It is set in 26 hectares of gardens on the Maidan, the great open ground of central Kolkata.',
      pos: [22, 7, 120], target: [0, 22, 30], time: 17.6
    },
    {
      title: 'A Museum Since 1947', deva: 'संग्रहालय',
      text: 'Since independence the memorial has been a museum under the Ministry of Culture, holding paintings, sculpture, manuscripts and memorabilia of the colonial period. It is the largest monument to a monarch anywhere in the world.',
      pos: [-46, 20, 74], target: [-4, 18, 16], time: 13.6
    },
    {
      title: 'Marble at Night', deva: 'रात्रि',
      text: 'Floodlights pick out the ribs of the dome and the arcade after dark, and the pool carries the whole lit facade a second time. The gardens close late; the Maidan around them stays open.',
      pos: [64, 30, 120], target: [0, 28, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, cone, sph, plane, arch, archFrame, dome, onion, block, col, lathe, torus, THREE } = ctx;
    const PI = Math.PI;

    /* ---- ribbed dome: hemisphere with radial ribs ---- */
    function ribbedDome(r, h, ribs, amp, rings = 10) {
      const seg = ribs * 4;
      const pos = [], uv = [], idx = [];
      for (let j = 0; j <= rings; j++) {
        const v = j / rings, a = v * PI / 2;
        const y = Math.sin(a) * h, rad = Math.cos(a) * r;
        for (let i = 0; i <= seg; i++) {
          const t = (i / seg) * PI * 2;
          const rr = rad * (1 + amp * Math.cos(ribs * t));
          pos.push(Math.cos(t) * rr, y, Math.sin(t) * rr);
          uv.push(i / seg, v);
        }
      }
      for (let j = 0; j < rings; j++) {
        for (let i = 0; i < seg; i++) {
          const a0 = j * (seg + 1) + i, b0 = a0 + seg + 1;
          idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    /* ================= grounds ================= */
    // terrace paving in front of the building and around it
    add('paving', plane(132, 96), 0, 0.1, 4, { rx: -PI / 2 });
    // gravel path down the axis to the pool
    add('paving', plane(30, 12), 0, 0.12, 42, { rx: -PI / 2 });

    /* ================= plinth ================= */
    block('stone', 114, 0.55, 80, 0, 0, 0);
    block('marble', 110, 1.25, 76, 0, 0.55, 0);
    block('marbleWarm', 106, 0.2, 72, 0, 1.6, 0);

    /* front steps */
    for (let i = 0; i < 5; i++) {
      const h = 1.8 * (5 - i) / 5;
      block('marble', 34 - i * 0.5, h, 1.5, 0, 0, 39.4 + i * 1.45);
    }

    /* ================= main body ================= */
    const BW = 96, BD = 64, PL = 1.8, BTOP = 19.0;
    block('marble', BW, BTOP - PL, BD, 0, PL, 0);

    /* arcaded verandah — front (+Z) and back (-Z) */
    function arcadeFace(zPos, dir) {
      const n = 11, sp = 8.2, w = 5.6, h = 9.0;
      for (let i = 0; i < n; i++) {
        const x = (i - (n - 1) / 2) * sp;
        add('dark', arch(w, h, 0.14), x, PL + 0.1, zPos + dir * 0.06);
        add('marble', archFrame(w + 0.7, h + 0.3, 0.3, 0.36), x, PL + 0.1, zPos + dir * 0.1, { ry: dir > 0 ? 0 : PI });
      }
      // colonnade standing proud of the wall
      for (let i = 0; i <= n; i++) {
        const x = (i - n / 2) * sp;
        col('marble', 0.62, 0.78, 10.4, x, PL, zPos + dir * 2.6, 8);
        block('marbleWarm', 1.9, 0.5, 1.9, x, PL + 10.4, zPos + dir * 2.6);
        block('marbleWarm', 2.1, 0.4, 2.1, x, PL, zPos + dir * 2.6);
      }
    }
    arcadeFace(BD / 2, 1);
    arcadeFace(-BD / 2, -1);

    /* arcaded verandah — east and west */
    function arcadeSide(xPos, dir) {
      const n = 7, sp = 8.2, w = 5.6, h = 9.0;
      for (let i = 0; i < n; i++) {
        const z = (i - (n - 1) / 2) * sp;
        add('dark', arch(w, h, 0.14), xPos + dir * 0.06, PL + 0.1, z, { ry: dir > 0 ? PI / 2 : -PI / 2 });
        add('marble', archFrame(w + 0.7, h + 0.3, 0.3, 0.36), xPos + dir * 0.1, PL + 0.1, z, { ry: dir > 0 ? PI / 2 : -PI / 2 });
      }
      for (let i = 0; i <= n; i++) {
        const z = (i - n / 2) * sp;
        col('marble', 0.62, 0.78, 10.4, xPos + dir * 2.6, PL, z, 8);
        block('marbleWarm', 1.9, 0.5, 1.9, xPos + dir * 2.6, PL + 10.4, z);
      }
    }
    arcadeSide(BW / 2, 1);
    arcadeSide(-BW / 2, -1);

    /* entablature over the colonnade, upper wall, cornice, parapet */
    block('marbleWarm', BW + 8.4, 1.7, BD + 8.4, 0, PL + 10.9, 0);
    block('marble', BW - 2, 4.2, BD - 2, 0, 14.4, 0);
    block('marbleWarm', BW + 2.4, 1.2, BD + 2.4, 0, 18.6, 0);
    block('marble', BW - 0.4, 1.0, BD - 0.4, 0, 19.8, 0);
    // pierced parapet balustrade
    for (let i = 0; i < 22; i++) {
      const x = (i - 10.5) * 4.3;
      add('jaliWhite', box(3.4, 0.85, 0.14), x, 21.2, BD / 2 - 0.6);
      add('jaliWhite', box(3.4, 0.85, 0.14), x, 21.2, -BD / 2 + 0.6);
    }
    for (let i = 0; i < 15; i++) {
      const z = (i - 7) * 4.3;
      add('jaliWhite', box(0.14, 0.85, 3.4), BW / 2 - 0.6, 21.2, z);
      add('jaliWhite', box(0.14, 0.85, 3.4), -BW / 2 + 0.6, 21.2, z);
    }
    // small windows under the cornice
    for (let i = 0; i < 11; i++) {
      const x = (i - 5) * 8.2;
      add('dark', box(2.0, 2.9, 0.2), x, 16.5, BD / 2 - 1.05);
      add('dark', box(2.0, 2.9, 0.2), x, 16.5, -BD / 2 + 1.05);
    }
    for (let i = 0; i < 7; i++) {
      const z = (i - 3) * 8.2;
      add('dark', box(0.2, 2.9, 2.0), BW / 2 - 1.05, 16.5, z);
      add('dark', box(0.2, 2.9, 2.0), -BW / 2 + 1.05, 16.5, z);
    }

    /* ================= four corner pavilions ================= */
    function pavilion(x, z) {
      block('marble', 17, 20.2, 17, x, PL, z);
      // corner pilasters
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        col('marbleWarm', 0.7, 0.8, 18.0, x + dx * 7.4, PL, z + dz * 7.4, 8);
      }
      // arch on the outward faces
      const ox = Math.sign(x), oz = Math.sign(z);
      add('dark', arch(4.2, 8.0, 0.14), x, PL + 0.1, z + oz * 8.55, { ry: oz > 0 ? 0 : PI });
      add('marble', archFrame(5.0, 8.5, 0.3, 0.34), x, PL + 0.1, z + oz * 8.6, { ry: oz > 0 ? 0 : PI });
      add('dark', arch(2.6, 3.6, 0.14), x, 14.4, z + oz * 8.55, { ry: oz > 0 ? 0 : PI });
      add('marble', archFrame(3.1, 3.9, 0.22, 0.3), x, 14.4, z + oz * 8.6, { ry: oz > 0 ? 0 : PI });
      add('dark', arch(2.6, 3.6, 0.14), x + ox * 8.55, 14.4, z, { ry: ox > 0 ? PI / 2 : -PI / 2 });
      add('marble', archFrame(3.1, 3.9, 0.22, 0.3), x + ox * 8.6, 14.4, z, { ry: ox > 0 ? PI / 2 : -PI / 2 });
      add('dark', arch(4.2, 8.0, 0.14), x + ox * 8.55, PL + 0.1, z, { ry: ox > 0 ? PI / 2 : -PI / 2 });
      add('marble', archFrame(5.0, 8.5, 0.3, 0.34), x + ox * 8.6, PL + 0.1, z, { ry: ox > 0 ? PI / 2 : -PI / 2 });
      // cornice + octagonal drum + dome
      block('marbleWarm', 19.4, 1.4, 19.4, x, 22.0, z);
      add('marble', cyl(5.6, 6.6, 2.6, 8), x, 24.7, z);
      add('marbleWarm', cyl(6.2, 6.2, 0.6, 8), x, 25.4, z);
      add('marble', ribbedDome(5.2, 6.0, 16, 0.06, 8), x, 26.0, z);
      add('gold', cyl(0.16, 0.16, 1.2, 6), x, 32.6, z);
      add('gold', sph(0.40, 8), x, 33.5, z);
      // little corner chhatris on the pavilion roof
      ctx.chhatri(x + ox * 8.6, 23.4, z + oz * 8.6, 0.75, 'marble', 'marble');
    }
    pavilion(41, 25);
    pavilion(-41, 25);
    pavilion(41, -25);
    pavilion(-41, -25);

    /* ================= central hall ================= */
    const CH = 34, CTOP = 31.0;
    block('marble', CH, CTOP - PL, CH, 0, PL, 0);

    // tall arched niches on each face
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const ry = dz > 0 ? 0 : dz < 0 ? PI : dx > 0 ? PI / 2 : -PI / 2;
      const nx = dx * (CH / 2 + 0.06), nz = dz * (CH / 2 + 0.06);
      for (const t of [-9.5, 9.5]) {
        const ox = dz !== 0 ? t : 0, oz = dx !== 0 ? t : 0;
        add('dark', arch(5.0, 11.5, 0.16), nx + ox, PL + 0.1, nz + oz, { ry });
        add('marble', archFrame(5.8, 12.1, 0.3, 0.34), nx + ox * 1.002, PL + 0.1, nz + oz * 1.002, { ry });
      }
      // clerestory: three arched windows on the upper stage
      for (const t of [-9.5, 0, 9.5]) {
        const ox = dz !== 0 ? t : 0, oz = dx !== 0 ? t : 0;
        add('dark', arch(3.4, 6.2, 0.14), nx + ox, 20.6, nz + oz, { ry });
        add('marble', archFrame(4.0, 6.7, 0.26, 0.3), nx + ox * 1.002, 20.6, nz + oz * 1.002, { ry });
      }
      // corner pilasters
      for (const t of [-15.4, 15.4]) {
        const ox = dz !== 0 ? t : 0, oz = dx !== 0 ? t : 0;
        add('marbleWarm', box(dz !== 0 ? 1.4 : 0.4, 12.4, dz !== 0 ? 0.4 : 1.4),
          nx + ox * 1.001 + (dz !== 0 ? 0 : dx * 0.12), 20.4, nz + oz * 1.001 + (dx !== 0 ? 0 : dz * 0.12));
      }
    }

    // entrance portico on the +Z face
    block('marble', 28, 21.0, 20, 0, PL, 27);
    add('dark', arch(9.6, 15.2, 0.2), 0, PL + 0.1, 37.1);
    add('marble', archFrame(10.7, 16.0, 0.44, 0.46), 0, PL + 0.1, 37.2);
    for (const s of [-1, 1]) {
      add('dark', arch(3.8, 8.0, 0.16), s * 10.0, PL + 0.1, 37.1);
      add('marble', archFrame(4.5, 8.5, 0.3, 0.34), s * 10.0, PL + 0.1, 37.2);
    }
    // side arches of the porch
    for (const s of [-1, 1]) {
      add('dark', arch(6.0, 11.0, 0.16), s * 14.05, PL + 0.1, 27, { ry: s > 0 ? PI / 2 : -PI / 2 });
      add('marble', archFrame(6.8, 11.6, 0.34, 0.36), s * 14.1, PL + 0.1, 27, { ry: s > 0 ? PI / 2 : -PI / 2 });
    }
    block('marbleWarm', 31.0, 1.7, 23.0, 0, 22.8, 27);
    block('marble', 29.0, 1.0, 21.0, 0, 24.5, 27);
    // stepped parapet over the porch
    for (let i = 0; i < 5; i++) add('jaliWhite', box(3.6, 0.85, 0.14), (i - 2) * 5.2, 26.0, 37.4);
    // steps up to the portico
    for (let i = 0; i < 4; i++) {
      block('marble', 17 - i * 0.7, 1.8 * (4 - i) / 4, 1.4, 0, 0, 38.0 + i * 1.4);
    }

    // cornice of the central hall
    block('marbleWarm', 38.4, 1.6, 38.4, 0, CTOP, 0);
    block('marble', 36.0, 0.9, 36.0, 0, CTOP + 1.6, 0);

    /* four octagonal chhatris on the hall roof */
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.chhatri(dx * 15.2, CTOP + 2.5, dz * 15.2, 1.45, 'marble', 'marble');
    }

    /* ================= drum + dome ================= */
    const DRUM = CTOP + 2.5;           // 33.5
    add('marble', cyl(14.4, 15.8, 7.4, 16), 0, DRUM + 3.7, 0);
    // windows around the drum
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2 + PI / 8;
      const r = 15.2;
      add('dark', box(2.4, 4.2, 0.3), Math.cos(a) * r, DRUM + 3.7, Math.sin(a) * r, { ry: -a + PI / 2 });
      add('marble', box(0.9, 7.0, 0.7), Math.cos(a + PI / 8) * r, DRUM + 3.7, Math.sin(a + PI / 8) * r, { ry: -a - PI / 8 + PI / 2 });
    }
    add('marbleWarm', cyl(15.7, 15.7, 0.9, 16), 0, DRUM + 7.4, 0);
    add('marble', cyl(15.1, 15.1, 0.5, 16), 0, DRUM + 8.1, 0);

    const DOME_Y = DRUM + 8.35;
    add('marble', ribbedDome(14.9, 10.4, 20, 0.05), 0, DOME_Y, 0);
    // ring of small pinnacles at the dome base
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * PI * 2;
      add('marble', cyl(0.42, 0.5, 1.5, 6), Math.cos(a) * 14.2, DOME_Y + 0.75, Math.sin(a) * 14.2);
    }
    const APEX = DOME_Y + 10.4;         // 50.65

    /* lantern and the Angel of Victory */
    add('marbleWarm', cyl(2.4, 2.9, 0.7, 12), 0, APEX + 0.35, 0);
    add('bronze', cyl(1.55, 1.9, 1.1, 12), 0, APEX + 1.25, 0);
    (function angel(y0) {
      // body
      add('bronze', cyl(0.42, 0.72, 2.5, 10), 0, y0 + 1.6, 0);
      add('bronze', cyl(0.30, 0.42, 0.5, 8), 0, y0 + 3.1, 0);
      add('bronze', sph(0.36, 10), 0, y0 + 3.72, 0);
      // raised arms
      for (const s of [-1, 1]) {
        add('bronze', box(0.16, 1.3, 0.16), s * 0.42, y0 + 3.15, 0.12, { rz: s * 0.55 });
      }
      // wings, swept up and back
      for (const s of [-1, 1]) {
        add('bronze', box(1.85, 1.15, 0.12), s * 1.05, y0 + 2.85, -0.28, { rz: s * 0.34, ry: s * 0.42 });
        add('bronze', box(1.35, 0.62, 0.1), s * 1.75, y0 + 2.05, -0.42, { rz: s * 0.62, ry: s * 0.42 });
      }
      // trailing robe
      add('bronze', cone(0.55, 1.0, 8), 0, y0 + 0.5, 0, { rx: PI });
    })(APEX + 1.8);

    /* ================= reflecting pool ================= */
    const PZ0 = 50, PZ1 = 152, PLEN = PZ1 - PZ0, PC = (PZ0 + PZ1) / 2;
    add('water', plane(19.6, PLEN - 2), 0, 0.42, PC, { rx: -PI / 2 });
    block('marble', 2.4, 0.95, PLEN, 10.8, 0, PC);
    block('marble', 2.4, 0.95, PLEN, -10.8, 0, PC);
    block('marble', 24, 0.95, 2.4, 0, 0, PZ0);
    block('marble', 24, 0.95, 2.4, 0, 0, PZ1);
    // low coping
    block('marbleWarm', 2.9, 0.18, PLEN + 1, 10.8, 0.95, PC);
    block('marbleWarm', 2.9, 0.18, PLEN + 1, -10.8, 0.95, PC);

    /* clipped hedges flanking the pool */
    for (let i = 0; i < 13; i++) {
      const z = PZ0 + 4 + i * 8.2;
      for (const s of [-1, 1]) {
        block('green', 2.0, 1.15, 6.6, s * 14.2, 0, z);
      }
    }

    /* ================= gardens ================= */
    // lawns
    add('foliage', plane(46, 112), 38, 0.14, 100, { rx: -PI / 2 });
    add('foliage', plane(46, 112), -38, 0.14, 100, { rx: -PI / 2 });
    add('foliage', plane(120, 34), 0, 0.14, -70, { rx: -PI / 2 });

    const trees = [
      [26, 56], [-26, 56], [26, 78], [-26, 78], [26, 104], [-26, 104],
      [26, 132], [-26, 132], [54, 62], [-54, 62], [54, 100], [-54, 100],
      [58, 30], [-58, 30], [40, -56], [-40, -56]
    ];
    trees.forEach(([x, z], i) => {
      const s = 0.95 + ((i * 37) % 7) / 14;
      ctx.tree(x, z, s, i % 7 === 3 ? 'palm' : 'round');
    });

    [[-15, 44], [15, 44], [-13.6, 68], [13.6, 68], [-13.6, 104], [13.6, 104], [-13.6, 138], [13.6, 138],
      [-30, 34], [30, 34]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));

    const people = [
      [3, 44, 'fabricWhite'], [-5, 43, 'fabricSaffron'], [8, 46, 'fabricRed'], [-9, 47, 'fabricWhite'],
      [2, 60, 'fabricRed'], [-3, 66, 'fabricWhite'], [6, 74, 'fabricSaffron'], [-6, 82, 'fabricWhite'],
      [4, 96, 'fabricRed'], [-4, 106, 'fabricSaffron'], [7, 118, 'fabricWhite'], [-7, 130, 'fabricRed'],
      [16, 52, 'fabricWhite'], [-16, 54, 'fabricSaffron']
    ];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 1.1, k, 0.94 + (i % 3) * 0.06));

    /* a couple of benches and urns on the terrace */
    for (const s of [-1, 1]) {
      block('stone', 3.0, 0.5, 0.8, s * 22, 0.18, 34);
      add('stone', cyl(0.9, 0.6, 0.9, 10), s * 22, 1.3, 34);
    }

  }
};
