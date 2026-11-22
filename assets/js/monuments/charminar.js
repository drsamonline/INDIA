/* Charminar — Hyderabad · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'charminar',
  accent: '#c8a26a',
  accent2: '#e8c48a',
  seed: 31,
  bounds: 70,
  minDist: 16,
  maxDist: 260,
  home: { pos: [58, 26, 78], target: [0, 25, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xc3b298 },
  views: [
    { name: 'Full', pos: [58, 26, 78], target: [0, 25, 0] },
    { name: 'Arches', pos: [16, 12, 38], target: [0, 13, 0] },
    { name: 'Minarets', pos: [30, 46, 34], target: [0, 44, 0] },
    { name: 'Crossing', pos: [4, 4.5, 10], target: [0, 6, 0] },
    { name: 'Bazaar', pos: [-46, 9, 46], target: [0, 18, 0] }
  ],
  tour: [
    {
      title: 'Four Minarets', deva: 'चारमीनार',
      text: 'Muhammad Quli Qutb Shah raised the Charminar in 1591, the year Hyderabad was laid out around it. The name means simply four minarets, and the monument stands at the crossing of the city\'s two great bazaars.',
      pos: [58, 26, 78], target: [0, 25, 0], time: 17.2
    },
    {
      title: 'The Great Arches', deva: 'मेहराब',
      text: 'Four arches face the cardinal directions, each about 11 metres wide and 20 metres high, their openings lined in shadow. Two storeys of arcaded galleries sit above them, and a small mosque has occupied the top floor for more than four centuries.',
      pos: [16, 12, 38], target: [0, 13, 0], time: 12
    },
    {
      title: 'Granite and Stucco', deva: 'ग्रेनाइट',
      text: 'The structure is granite and lime mortar, dressed with plaster and stucco ornament, standing on a square plinth with a fountain at its centre. Spiral stairs climb inside each minaret to galleries above the streets.',
      pos: [10, 8, 26], target: [0, 10, 0], time: 9.4
    },
    {
      title: 'Fifty-Six Metres', deva: 'मीनारें',
      text: 'The four minarets rise to 56 metres, each with balconies ringed by pierced screens, a bulbous dome and a finial. The Charminar was the tallest building in Hyderabad for 396 years, until 1987.',
      pos: [30, 46, 34], target: [0, 44, 0], time: 16.6
    },
    {
      title: 'Laad Bazaar', deva: 'लाड बाज़ार',
      text: 'To the west runs the Laad Bazaar, the lane of lacquer bangles, and to the southwest the Makkah Masjid. On Eid the whole quarter fills with crowds, and the monument is lit from below.',
      pos: [-46, 9, 46], target: [0, 18, 0], time: 17.8
    },
    {
      title: 'The City at Night', deva: 'रात्रि',
      text: 'Under floodlight the stucco picks up a warm amber and the arches go black. Around it the bazaar keeps trading until late, and the Charminar stands at the centre of the old city it made.',
      pos: [52, 24, 70], target: [0, 28, 0], time: 21.3
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col } = ctx;

    /* ---- a wall pierced by one great arch ----------------------------- */
    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = ctx.archShape(aw, ah);
      const pts = a.getPoints(26).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 });
    }

    /* ---- plinth ------------------------------------------------------- */
    block('granite', 34, 1.4, 34, 0, 0, 0);
    add('stone', box(34.8, 0.3, 34.8), 0, 1.4, 0);
    // steps on all four sides
    [[0, 17.6, 0], [0, -17.6, 0], [17.6, 0, Math.PI / 2], [-17.6, 0, Math.PI / 2]].forEach(([x, z, ry]) => {
      for (let i = 0; i < 4; i++) {
        block('stone', 7.4, 0.35 * (i + 1), 1.0, x, 0, z + (i * 0.9) * (z > 0 ? 1 : -1), { ry });
      }
    });

    /* ---- the four pierced walls --------------------------------------- */
    const W = 20, H = 20, T = 3.0, AW = 11, AH = 19, SILL = 1.4;
    add('plaster', piercedWall(W + T * 2, H, T, AW, AH, SILL), 0, 1.4, W / 2 + T / 2 - T / 2);
    // north / south walls (facing +Z and -Z)
    add('plaster', piercedWall(W + T * 2, H, T, AW, AH, SILL), 0, 1.4, W / 2);
    add('plaster', piercedWall(W + T * 2, H, T, AW, AH, SILL), 0, 1.4, -W / 2 - T);
    // east / west walls
    add('plaster', piercedWall(W + T * 2, H, T, AW, AH, SILL), W / 2, 1.4, 0, { ry: Math.PI / 2 });
    add('plaster', piercedWall(W + T * 2, H, T, AW, AH, SILL), -W / 2 - T, 1.4, 0, { ry: Math.PI / 2 });

    // dark lining inside the crossing so the passage reads as deep shade
    add('plaster', box(W - 0.8, 0.6, W - 0.8), 0, 1.4 + H - 0.3, 0);   // dark ceiling of the crossing
    add('dark', box(W - 1.0, 0.4, W - 1.0), 0, 1.4 + H - 0.75, 0);
    // inner floor + fountain
    add('stone', box(W - 0.4, 0.3, W - 0.4), 0, 1.62, 0);
    // a lit apron under each arch so the openings read as passages
    [[0, W / 2 - 1.4, 0], [0, -W / 2 + 1.4, Math.PI], [W / 2 - 1.4, 0, Math.PI / 2], [-W / 2 + 1.4, 0, -Math.PI / 2]]
      .forEach(([x, z, ry]) => add('stone', box(AW + 1.2, 0.22, 3.2), x, 1.68, z, { ry }));
    add('granite', cyl(2.6, 2.8, 0.9, 16), 0, 1.9, 0);
    add('marble', cyl(2.2, 2.2, 0.3, 16), 0, 2.5, 0);
    add('marble', cyl(0.35, 0.45, 1.4, 10), 0, 3.0, 0);
    add('water', cyl(0.9, 1.0, 0.15, 14), 0, 2.7, 0);

    /* ---- stucco arch surrounds ---------------------------------------- */
    [[0, W / 2 + 0.02, 0], [0, -W / 2 - 0.02, Math.PI], [W / 2 + 0.02, 0, Math.PI / 2], [-W / 2 - 0.02, 0, -Math.PI / 2]]
      .forEach(([x, z, ry]) => {
        add('sandstoneBuff', archFrame(AW + 1.2, AH + 0.6, 0.55, 0.5), x, 1.4 + SILL, z, { ry });
        add('marble', box(AW + 4.4, 0.35, 0.55), x, 1.4 + SILL + AH + 0.5, z, { ry });
      });

    /* ---- upper storeys, parapet and mosque ----------------------------- */
    const topY = 1.4 + H;
    add('sandstoneBuff', box(W + 2.6, 0.55, W + 2.6), 0, topY + 0.28, 0);
    block('plaster', W + 1.6, 3.2, W + 1.6, 0, topY + 0.55, 0);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      // arcaded gallery on each face
      for (let k = -2; k <= 2; k++) {
        const off = k * 2.4;
        const x = Math.cos(a) * off, z = Math.sin(a) * off;
        add('dark', arch(1.2, 1.7, 0.15), x + Math.cos(a) * (W / 2 + 0.6), topY + 1.0, z + Math.sin(a) * (W / 2 + 0.6), { ry: -a });
      }
    }
    add('sandstoneBuff', box(W + 3.4, 0.4, W + 3.4), 0, topY + 3.9, 0);
    // small mosque storey
    block('plasterWhite', 9, 4.2, 9, 0, topY + 4.1, 0);
    add('marble', dome(3.4, 3.0, 24), 0, topY + 8.3, 0);
    add('gold', cyl(0.1, 0.1, 1.2, 8), 0, topY + 11.5, 0);
    add('gold', sph(0.22, 8), 0, topY + 12.2, 0);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      add('marble', cyl(0.7, 0.8, 1.4, 8), dx * 4.6, topY + 5.0, dz * 4.6);
      add('marble', dome(0.85, 0.8, 12), dx * 4.6, topY + 5.7, dz * 4.6);
    }

    /* ---- parapet of tiny minarets -------------------------------------- */
    const pn = 5;
    for (let side = 0; side < 4; side++) {
      const a = (side / 4) * Math.PI * 2;
      for (let i = 0; i < pn; i++) {
        const t = (i - (pn - 1) / 2) * 4.2;
        const x = Math.cos(a) * t + Math.cos(a + Math.PI / 2) * (W / 2 + 1.9);
        const z = Math.sin(a) * t + Math.sin(a + Math.PI / 2) * (W / 2 + 1.9);
        add('plasterWhite', cyl(0.34, 0.4, 2.2, 8), x, topY + 4.6, z);
        add('plasterWhite', dome(0.4, 0.5, 10), x, topY + 5.7, z);
        add('gold', cone(0.12, 0.35, 6), x, topY + 6.3, z);
      }
    }

    /* ---- the four minarets -------------------------------------------- */
    function minaret(cx, cz) {
      const base = 1.4;
      col('granite', 2.4, 2.9, 1.6, cx, base, cz, 16);
      let y = base + 1.6;
      const tiers = [[2.15, 1.95, 12], [1.85, 1.7, 10], [1.6, 1.5, 9]];
      tiers.forEach(([rb, rt, h], i) => {
        col('plasterWhite', rt, rb, h, cx, y, cz, 16);
        y += h;
        // balcony
        add('sandstoneBuff', cyl(rb + 1.05, rb + 1.15, 0.42, 20), cx, y + 0.2, cz);
        const n = 18;
        for (let k = 0; k < n; k++) {
          const a = (k / n) * Math.PI * 2;
          add('jaliWhite', box(0.62, 0.8, 0.05), cx + Math.cos(a) * (rb + 0.95), y + 0.85, cz + Math.sin(a) * (rb + 0.95), { ry: -a + Math.PI / 2 });
        }
        add('marble', cyl(rb + 1.0, rb + 1.0, 0.12, 20), cx, y + 1.3, cz);
        y += 1.35;
      });
      // dome and finial
      add('plasterWhite', cyl(1.9, 2.1, 0.5, 16), cx, y + 0.25, cz);
      add('marble', onion(1.9, 3.0, 22), cx, y + 0.5, cz);
      add('gold', cyl(0.09, 0.09, 1.5, 8), cx, y + 3.8, cz);
      add('gold', sph(0.2, 8), cx, y + 4.6, cz);
      add('gold', cone(0.14, 0.6, 6), cx, y + 5.1, cz);
    }
    const cx0 = W / 2 + 1.9;
    [[cx0, cx0], [-cx0, cx0], [cx0, -cx0], [-cx0, -cx0]].forEach(([x, z]) => minaret(x, z));

    /* ---- bazaar arcades ------------------------------------------------ */
    [[-30, 0, Math.PI / 2], [30, 0, -Math.PI / 2], [0, -30, 0]].forEach(([x, z, ry]) => {
      block('plaster', 24, 6.5, 4, x, 0, z, { ry });
      for (let i = -2; i <= 2; i++) {
        const px = x + Math.cos(ry) * i * 4.4, pz = z - Math.sin(ry) * i * 4.4;
        add('dark', arch(2.2, 3.4, 0.2), px, 0.3, pz + (ry === 0 ? 2.02 : 0), { ry });
        add('sandstoneBuff', archFrame(2.6, 3.8, 0.18, 0.2), px, 0.3, pz + (ry === 0 ? 2.06 : 0), { ry });
      }
      add('sandstoneBuff', box(24.6, 0.5, 4.6), x, 6.5, z, { ry });
    });

    /* ---- ground, crowds, lamps, trees ---------------------------------- */
    add('paving', ctx.plane(96, 96), 0, 0.05, 0, { rx: -Math.PI / 2 });
    const people = [[-6, 22], [6, 23], [-10, 18], [10, 17], [0, 26], [-16, 26], [16, 25], [-22, 14],
      [22, 13], [-3, 15], [8, 27], [-13, 8], [13, 8], [18, -18], [-18, -18], [0, -24]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed', 'fabricWhite'][i % 4], 0.95));
    [[-13, 20], [13, 20], [-20, 6], [20, 6], [0, 30], [-26, -6], [26, -6]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-34, 30], [34, 30], [-40, -20], [40, -20], [-28, -34], [28, -34]].forEach(([x, z], i) => ctx.tree(x, z, 1.1, 'round'));

    ctx.light({ pos: [-30, 14, 30], target: [0, 26, 0], color: 0xffd0a0, intensity: 2400, distance: 180 });
    ctx.light({ pos: [30, 16, 26], target: [0, 26, 0], color: 0xffc890, intensity: 2000, distance: 180 });
    ctx.light({ pos: [0, 10, 34], target: [0, 8, 0], color: 0xffd9b0, intensity: 1200, distance: 120 });
  }
};
