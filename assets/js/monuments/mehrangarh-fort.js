/* Mehrangarh — Jodhpur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'mehrangarh-fort',
  accent: '#c08a5a',
  accent2: '#e0b088',
  seed: 101,
  time: 16.2,
  bounds: 110,
  minDist: 30,
  maxDist: 420,
  home: { pos: [86, 54, 132], target: [0, 40, 0], fov: 40 },
  ground: { texture: 'sandGround', size: 2400, color: 0xc0a982, tile: 26 },
  views: [
    { name: 'Full', pos: [86, 54, 132], target: [0, 40, 0] },
    { name: 'Walls', pos: [-30, 46, 96], target: [-10, 42, 0] },
    { name: 'Palaces', pos: [26, 48, 56], target: [0, 44, 0] },
    { name: 'The gate', pos: [4, 30, 60], target: [0, 34, 18] },
    { name: 'Blue city', pos: [70, 26, 90], target: [0, 16, 40] }
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
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, chhatri } = ctx;

    const stone = 'sandstoneBuff', wall = 'sandstoneRed', trim = 'marble';

    /* ---- the rock --------------------------------------------------------- */
    block('stone', 130, 16, 96, 0, 0, -4);
    block('stone', 112, 14, 82, 0, 16, -6);
    block('stone', 96, 12, 70, 0, 30, -8);
    block(wall, 86, 6, 60, 0, 42, -10);
    [[-56, 8, 6, 20], [56, 7, -2, 17], [-40, 24, 26, 13], [44, 22, 20, 14], [-30, 38, 20, 9]]
      .forEach(([x, y, z, r]) => add('stone', sph(r, 9), x, y, z, { sy: 0.7 }));

    /* ---- ramparts with bastions ------------------------------------------ */
    function rampart(x0, z0, x1, z1, y, h) {
      const dx = x1 - x0, dz = z1 - z0;
      const len = Math.hypot(dx, dz), ry = Math.atan2(dz, dx);
      const n = Math.max(2, Math.round(len / 4.4));
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        add(wall, box(len / n + 0.5, h, 3.0), x0 + dx * t, y + h / 2, z0 + dz * t, { ry });
        if (i % 2 === 0) add(wall, box(1.4, 1.4, 3.2), x0 + dx * t, y + h + 0.7, z0 + dz * t, { ry });
      }
      for (let i = 1; i < n; i += 4) {
        const t = i / (n - 1);
        add(wall, cyl(3.4, 4.0, h + 3.0, 10), x0 + dx * t, y + (h + 3) / 2, z0 + dz * t);
        add(trim, box(7.2, 0.6, 7.2), x0 + dx * t, y + h + 3.2, z0 + dz * t, { ry });
      }
    }
    rampart(-43, 20, 43, 20, 42, 12);
    rampart(-43, 20, -43, -34, 42, 12);
    rampart(43, 20, 43, -34, 42, 12);
    rampart(-43, -34, 43, -34, 42, 10);

    /* ---- the palaces inside ---------------------------------------------- */
    block(wall, 56, 14, 40, 0, 48, -14);
    add(trim, box(57, 0.6, 41), 0, 62, -14);
    // arcaded facade facing the city
    for (let i = -5; i <= 5; i++) {
      add('dark', arch(2.2, 3.4, 0.2), i * 4.4, 50, 6.1);
      add(trim, archFrame(2.6, 3.8, 0.18, 0.22), i * 4.4, 50, 6.15);
    }
    for (let i = -5; i <= 5; i++) {
      add('dark', box(1.4, 1.6, 0.2), i * 4.4, 56.4, 6.1);
      add(trim, box(1.9, 0.2, 0.4), i * 4.4, 57.3, 6.2);
    }
    // projecting jharokhas
    for (let i = -2; i <= 2; i++) {
      const x = i * 9.0;
      add(wall, box(3.0, 3.2, 1.4), x, 57.6, 7.0);
      add(trim, box(3.4, 0.3, 1.8), x, 59.3, 7.0);
      add(trim, dome(1.5, 1.2, 12), x, 59.5, 7.0);
      add('gold', sph(0.16, 8), x, 60.9, 7.0);
    }
    // the two main towers
    [-1, 1].forEach((s) => {
      block(wall, 9, 22, 9, s * 26, 48, 2);
      add(trim, box(9.8, 0.5, 9.8), s * 26, 70, 2);
      add(trim, cyl(2.6, 2.9, 1.6, 8), s * 26, 71, 2);
      add(trim, dome(2.7, 2.2, 14), s * 26, 71.6, 2);
      add('gold', sph(0.22, 8), s * 26, 74, 2);
    });
    // chhatris along the roof
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      chhatri(i * 11, 62, -20, 1.1, wall, trim);
    }
    chhatri(0, 62, -26, 1.2, wall, trim);

    /* ---- the gate and the ramp ------------------------------------------- */
    block(wall, 14, 16, 6, 0, 42, 21);
    add('dark', arch(5.0, 8.0, 0.6), 0, 42.2, 24.2);
    add(trim, archFrame(5.8, 8.6, 0.4, 0.45), 0, 42.2, 24.3);
    add(wall, box(15, 0.6, 7), 0, 58, 21);
    [-1, 1].forEach((s) => chhatri(s * 5.2, 58.4, 21, 0.9, wall, trim));
    // the zig-zag ramp down the hill
    for (let i = 0; i < 7; i++) {
      add('stone', box(9, 1.2, 8), 8 + i * 0.5, 38 - i * 4.4, 26 + i * 3.6, { rx: -0.12 });
    }

    /* ---- the blue city below --------------------------------------------- */
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 1.5 + Math.PI * 0.25;
      const r = 92 + (i % 4) * 12;
      const x = Math.cos(a) * r, z = Math.sin(a) * r + 30;
      const h = 6 + (i % 5) * 3;
      block(i % 3 === 0 ? 'plasterWhite' : 'blue', 9 + (i % 3) * 3, h, 9, x, 0, z, { ry: a });
      add('cream', box(10 + (i % 3) * 3, 0.6, 10), x, h, z, { ry: a });
    }

    /* ---- people, lamps, trees --------------------------------------------- */
    const people = [[-8, 34], [8, 35], [-14, 30], [14, 31], [0, 38], [-20, 26], [20, 27], [-4, 30], [10, 29]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 30], [16, 30], [-24, 40], [24, 40], [0, 44]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-52, 40], [52, 40], [-60, 16], [60, 16], [-48, 64], [48, 64]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.3 + (i % 3) * 0.2, 'round'));

    ctx.light({ pos: [-50, 46, 60], target: [0, 50, 0], color: 0xffd0a0, intensity: 4200, distance: 260 });
    ctx.light({ pos: [50, 46, 54], target: [0, 50, 0], color: 0xffc890, intensity: 3400, distance: 260 });
  }
};
