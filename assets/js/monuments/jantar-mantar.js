/* Jantar Mantar — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'jantar-mantar',
  accent: '#d8c8a8',
  accent2: '#f0e4c8',
  seed: 103,
  time: 15.4,
  bounds: 55,
  minDist: 12,
  maxDist: 200,
  home: { pos: [30, 22, 52], target: [0, 14, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xc2b498, tile: 10 },
  views: [
    { name: 'Full', pos: [30, 22, 52], target: [0, 14, 0] },
    { name: 'Samrat Yantra', pos: [26, 20, 24], target: [10, 18, 0] },
    { name: 'Jai Prakash', pos: [-16, 9, 20], target: [-12, 4, 2] },
    { name: 'Rashivalaya', pos: [2, 7, 26], target: [0, 4, 12] },
    { name: 'Instruments', pos: [-30, 14, -14], target: [-6, 8, 0] }
  ],
  tour: [
    {
      title: 'The Observatory', deva: 'जंतर मंतर',
      text: 'Sawai Jai Singh II built the Jantar Mantar at Jaipur between 1728 and 1734, the largest of the five observatories he raised across northern India. The name comes from yantra, instrument, and mantrana, consultation.',
      pos: [30, 22, 52], target: [0, 14, 0], time: 15.4
    },
    {
      title: 'The Samrat Yantra', deva: 'सम्राट यंत्र',
      text: 'The great sundial is a gnomon 27 metres high whose shadow falls on two quadrant arcs, reading the time to about two seconds. It still keeps local time today.',
      pos: [26, 20, 24], target: [10, 18, 0], time: 12
    },
    {
      title: 'Architecture as Astronomy', deva: 'वास्तु',
      text: 'The nineteen instruments are buildings doing the work of lenses and brass: bowls that map the sky, dials cut for the zodiac, rings that fix the altitude of a star.',
      pos: [-30, 14, -14], target: [-6, 8, 0], time: 9.8
    },
    {
      title: 'The Jai Prakash', deva: 'जय प्रकाश',
      text: 'A hemispherical bowl sunk into the ground, with cross-wires above it, lets an observer read the position of any star against a marble grid.',
      pos: [-16, 9, 20], target: [-12, 4, 2], time: 10.6
    },
    {
      title: 'The Zodiac Dials', deva: 'राशिवलय',
      text: 'Twelve small dials, one for each sign, ring the compound. Each is inclined to match the latitude of Jaipur, 26.9 degrees north.',
      pos: [2, 7, 26], target: [0, 4, 12], time: 11.4
    },
    {
      title: 'A Working Monument', deva: 'रात्रि',
      text: 'Restored in the twentieth century and inscribed as a UNESCO World Heritage Site in 2010, the observatory is still used to teach astronomy.',
      pos: [26, 18, 46], target: [0, 14, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    const plaster = 'plasterWhite', trim = 'sandstoneRed', stone = 'plaster';

    /* ---- the walled compound ---------------------------------------------- */
    block(plaster, 62, 1.0, 46, 0, 0, 0);
    add(trim, box(62.6, 0.2, 46.6), 0, 1.0, 0);
    for (let i = 0; i < 16; i++) {
      const x = -30 + i * 4;
      [-23, 23].forEach((z) => add(trim, box(3.6, 2.4, 0.8), x, 2.2, z));
    }
    for (let i = 0; i < 12; i++) {
      const z = -21 + i * 4;
      [-31, 31].forEach((x) => add(trim, box(0.8, 2.4, 3.6), x, 2.2, z));
    }

    /* ---- the Samrat Yantra: a great gnomon and two arcs ------------------- */
    (function samrat(cx, cz) {
      const H = 27, L = 22;
      // the triangular gnomon, built as a stack of shrinking slabs
      for (let i = 0; i < 18; i++) {
        const t = i / 17;
        add(plaster, box(3.0, H / 18 + 0.1, L * (1 - t * 0.92)), cx, 1.0 + H * t + H / 36, cz + L * (1 - t) * 0.46);
        if (i % 3 === 0) add(trim, box(3.4, 0.22, L * (1 - t * 0.92) + 0.3), cx, 1.0 + H * t + H / 18, cz + L * (1 - t) * 0.46);
      }
      // the two quadrant arcs, as stepped walls
      [-1, 1].forEach((s) => {
        for (let k = 0; k < 16; k++) {
          const a = (k / 16) * Math.PI * 0.5;
          const r = 18;
          const x = cx + s * (3.0 + Math.sin(a) * 5.0);
          const y = 1.0 + Math.cos(a) * r;
          const z = cz + Math.sin(a) * r * 0.9;
          add(plaster, box(5.0, 1.9, 2.0), x, y, z, { rx: -a * 0.9 });
          add(trim, box(5.4, 0.2, 2.3), x, y + 1.0, z, { rx: -a * 0.9 });
        }
      });
      // the stair up the hypotenuse
      for (let i = 0; i < 14; i++) {
        add(trim, box(2.6, 0.4, 1.0), cx - 2.2, 1.4 + i * 1.9, cz - 1.0 - i * 0.9);
      }
    })(10, -4);

    /* ---- the Jai Prakash bowl --------------------------------------------- */
    (function jaiprakash(cx, cz) {
      add(plaster, cyl(8.6, 9.2, 1.4, 28), cx, 1.7, cz);
      // a shallow crater built from rings of shrinking height
      for (let i = 0; i < 7; i++) {
        const r = 7.6 - i * 0.95;
        add(plaster, cyl(r, r + 0.9, 0.55, 28), cx, 2.4 - i * 0.42, cz);
        add(trim, cyl(r + 0.05, r + 0.05, 0.1, 28), cx, 2.68 - i * 0.42, cz);
      }
      add('dark', cyl(1.2, 1.2, 0.2, 16), cx, 0.55, cz);
      // cross-wires above
      add('grey', box(13, 0.08, 0.08), cx, 9.2, cz);
      add('grey', box(0.08, 0.08, 13), cx, 9.2, cz);
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(plaster, cyl(0.28, 0.34, 7.6, 6), cx + dx * 6.4, 5.6, cz + dz * 6.4);
      }
    })(-14, 8);

    /* ---- the twelve zodiac dials ------------------------------------------ */
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x = Math.cos(a) * 16, z = Math.sin(a) * 12 + 8;
      add(plaster, cyl(1.7, 2.0, 1.1, 12), x, 1.55, z);
      add(trim, cyl(1.9, 1.9, 0.16, 12), x, 2.15, z);
      add(stone, box(2.6, 1.3, 0.4), x, 2.9, z, { ry: -a, rx: 0.5 });
      add('dark', cyl(0.9, 0.9, 0.12, 12), x, 2.26, z, { rx: Math.PI / 2 });
    }

    /* ---- smaller instruments ---------------------------------------------- */
    // Ram Yantra: two open cylinders with a central pillar
    (function ramYantra(cx, cz) {
      add(plaster, cyl(5.2, 5.6, 1.2, 20), cx, 1.6, cz);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        add(plaster, box(1.4, 4.0, 0.5), cx + Math.cos(a) * 4.6, 4.0, cz + Math.sin(a) * 4.6, { ry: -a });
      }
      add(plaster, cyl(0.7, 0.8, 4.4, 8), cx, 4.0, cz);
      add(trim, cyl(5.0, 5.0, 0.3, 20), cx, 6.0, cz);
    })(-16, -14);

    // Digamsha Yantra: a small domed pillar
    (function digamsha(cx, cz) {
      add(plaster, cyl(3.4, 3.8, 1.0, 16), cx, 1.5, cz);
      add(plaster, cyl(1.4, 1.7, 6.4, 10), cx, 5.2, cz);
      add(trim, cyl(2.0, 2.0, 0.3, 12), cx, 8.5, cz);
      add(plaster, dome(1.9, 1.6, 14), cx, 8.6, cz);
      add('gold', sph(0.2, 8), cx, 10.4, cz);
    })(18, 12);

    /* ---- people, trees ----------------------------------------------------- */
    const people = [[-6, 18], [6, 19], [-12, 14], [12, 15], [0, 22], [-20, 18], [20, 18], [-3, 16], [9, 14]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-24, 18], [24, 18], [-24, -4], [24, -4], [0, 24]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-28, 18], [28, 18], [-28, -16], [28, -16]].forEach(([x, z], i) => ctx.tree(x, z, 1.1, 'round'));

    ctx.light({ pos: [-22, 14, 26], target: [0, 14, 0], color: 0xffd0a0, intensity: 2400, distance: 150 });
    ctx.light({ pos: [22, 14, 22], target: [0, 14, 0], color: 0xffc890, intensity: 2000, distance: 150 });
  }
};
