/* Chhatrapati Shivaji Maharaj Terminus — Mumbai · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'csmt-mumbai',
  accent: '#c07a52',
  accent2: '#e0a878',
  seed: 71,
  time: 16.2,
  bounds: 70,
  minDist: 16,
  maxDist: 260,
  home: { pos: [40, 20, 74], target: [0, 18, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xa89c86 },
  views: [
    { name: 'Full', pos: [40, 20, 74], target: [0, 18, 0] },
    { name: 'Facade', pos: [4, 14, 52], target: [0, 16, 0] },
    { name: 'Dome', pos: [14, 34, 40], target: [0, 30, 0] },
    { name: 'Clock tower', pos: [-24, 28, 44], target: [-18, 32, 0] },
    { name: 'Forecourt', pos: [-26, 5, 40], target: [0, 10, 10] }
  ],
  tour: [
    {
      title: 'Victoria Terminus', deva: 'छत्रपति शिवाजी महाराज टर्मिनस',
      text: 'The terminus was built in Bombay between 1878 and 1888 to a design by Frederick William Stevens, as the headquarters of the Great Indian Peninsula Railway. It was named for Queen Victoria in her jubilee year.',
      pos: [40, 20, 74], target: [0, 18, 0], time: 16.2
    },
    {
      title: 'Gothic and Indian', deva: 'गॉथिक',
      text: 'Stevens fused Victorian Gothic with Indian palace architecture: pointed arches, flying buttresses, carved animals and gargoyles, and a plan laid out as a symmetrical cross with the platforms running east.',
      pos: [4, 14, 52], target: [0, 16, 0], time: 11
    },
    {
      title: 'The Stone Dome', deva: 'गुंबद',
      text: 'The ribbed stone dome sits over the crossing, crowned by a figure of Progress holding a torch. Around it the gables and turrets are carved with peacocks, monkeys, lions and snakes.',
      pos: [14, 34, 40], target: [0, 30, 0], time: 15.4
    },
    {
      title: 'The Clock Tower', deva: 'घड़ी मीनार',
      text: 'The clock tower rises about 49 metres at the south-west corner of the building, and the station clock still keeps time over the forecourt.',
      pos: [-24, 28, 44], target: [-18, 32, 0], time: 9.2
    },
    {
      title: 'Three Million a Day', deva: 'भीड़',
      text: 'It is one of the busiest railway stations in the world, handling more than three million passengers a day, and it remains the headquarters of the Central Railway.',
      pos: [-26, 5, 40], target: [0, 10, 10], time: 17.4
    },
    {
      title: 'A Working Monument', deva: 'रात्रि',
      text: 'In 2004 it became a UNESCO World Heritage Site — the first working railway station to be inscribed — and it is floodlit every evening.',
      pos: [34, 16, 66], target: [0, 18, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus } = ctx;

    const stone = 'brick', trim = 'cream';

    /* ---- plinth and forecourt -------------------------------------------- */
    block('stone', 76, 1.2, 34, 0, 0, -6);
    add('paving', box(76, 0.2, 26), 0, 1.2, 12);

    /* ---- the main range --------------------------------------------------- */
    const W = 62, H = 17, D = 16;
    block(stone, W, H, D, 0, 1.2, -2);
    add(trim, box(W + 1.2, 0.6, D + 1.2), 0, 1.2 + H, -2);
    // gabled bays along the front
    for (let i = -3; i <= 3; i++) {
      const x = i * 8.4;
      // pointed arch at ground level
      add('dark', arch(3.4, 6.0, 0.3), x, 1.6, 6.1);
      add(trim, archFrame(4.0, 6.6, 0.28, 0.34), x, 1.6, 6.2);
      // a gable above with a small rose window
      add(stone, box(6.6, 3.2, 0.9), x, 12.4, 6.0);
      add(trim, box(7.0, 0.35, 1.1), x, 14.1, 6.0);
      add('dark', cyl(1.05, 1.05, 0.24, 14), x, 13.6, 6.5, { rx: Math.PI / 2 });
      // pinnacles between bays
      if (i < 3) {
        add(stone, cyl(0.5, 0.62, 4.4, 8), x + 4.2, 15.8, 6.2);
        add(trim, cone(0.62, 1.6, 8), x + 4.2, 18.8, 6.2);
      }
    }
    // horizontal string courses
    [5.4, 9.2].forEach((y) => add(trim, box(W + 0.8, 0.3, D + 0.8), 0, y, -2));

    /* ---- the central tower and dome ---------------------------------------- */
    block(stone, 13, 12, 13, 0, 18.2, -2);
    add(trim, box(14, 0.5, 14), 0, 30.2, -2);
    // octagonal drum with lancet windows
    add(stone, cyl(5.4, 5.8, 3.4, 8), 0, 32.1, -2);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      add('dark', box(1.2, 1.8, 0.2), Math.cos(a) * 5.6, 32.1, -2 + Math.sin(a) * 5.6, { ry: -a });
    }
    add(trim, cyl(6.1, 6.1, 0.4, 8), 0, 34.0, -2);
    add('marble', onion(5.6, 7.6, 26), 0, 34.2, -2);
    // ribs on the dome
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      add(trim, box(0.22, 5.2, 0.22), Math.cos(a) * 4.6, 37.4, -2 + Math.sin(a) * 4.6, { ry: -a, rz: 0.34 });
    }
    add(trim, cyl(0.7, 0.9, 1.4, 10), 0, 41.6, -2);
    add('gold', sph(0.34, 10), 0, 42.6, -2);
    add('bronze', box(0.5, 1.8, 0.5), 0, 43.9, -2);
    add('bronze', sph(0.36, 8), 0, 45.0, -2);

    /* ---- the clock tower ---------------------------------------------------- */
    (function clockTower(cx, cz) {
      block(stone, 9, 24, 9, cx, 1.2, cz);
      [6, 12, 18].forEach((y) => add(trim, box(9.6, 0.4, 9.6), cx, y, cz));
      // the clock stage
      add(trim, box(10.2, 6.4, 10.2), cx, 25.2, cz);
      [[0, 5.2, 0], [0, -5.2, Math.PI], [5.2, 0, Math.PI / 2], [-5.2, 0, -Math.PI / 2]].forEach(([dx, dz, ry]) => {
        add('plasterWhite', cyl(2.2, 2.2, 0.18, 22), cx + dx, 28.4, cz + dz, { rx: Math.PI / 2, ry });
        add('grey', cyl(2.35, 2.35, 0.1, 22), cx + dx * 0.995, 28.4, cz + dz * 0.995, { rx: Math.PI / 2, ry });
        // hands, standing proud of the face
        add('black', box(0.14, 1.35, 0.12), cx + dx * 1.03, 28.95, cz + dz * 1.03, { ry });
        add('black', box(1.0, 0.14, 0.12), cx + dx * 1.03 + (ry === 0 ? 0.5 : 0), 28.45, cz + dz * 1.03, { ry });
      });
      add(trim, box(11, 0.5, 11), cx, 31.6, cz);
      // a stepped stone roof, then a small lantern and finial
      add(stone, box(8.4, 1.6, 8.4), cx, 32.7, cz);
      add(trim, box(8.8, 0.3, 8.8), cx, 33.6, cz);
      add(stone, box(6.6, 1.5, 6.6), cx, 34.4, cz);
      add(trim, box(7.0, 0.28, 7.0), cx, 35.3, cz);
      add(stone, box(4.8, 1.4, 4.8), cx, 36.1, cz);
      add(trim, box(5.2, 0.26, 5.2), cx, 36.9, cz);
      add(stone, box(3.2, 1.3, 3.2), cx, 37.7, cz);
      add(trim, cyl(2.4, 2.4, 0.3, 8), cx, 38.5, cz);
      add('marble', onion(2.2, 3.0, 18), cx, 38.6, cz);
      add('gold', sph(0.26, 8), cx, 41.7, cz);
      add('bronze', cone(0.18, 1.1, 6), cx, 42.4, cz);
    })(-22, 4);

    /* ---- platform sheds behind -------------------------------------------- */
    for (let i = 0; i < 5; i++) {
      add('grey', box(56, 0.4, 10), 0, 12.2, -14 - i * 0.4);
      add('grey', box(56, 0.3, 0.6), 0, 12.6, -14 - i * 0.4);
    }
    add('dark', box(58, 7, 16), 0, 8.6, -14);

    /* ---- forecourt: palms, people, lamps ---------------------------------- */
    const people = [[-14, 16], [10, 17], [-6, 14], [18, 15], [0, 20], [-20, 12], [22, 12], [-9, 22],
      [7, 23], [-16, 24], [14, 24], [2, 12], [-2, 16]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-28, 18], [28, 18], [-16, 26], [16, 26], [0, 26]].forEach(([x, z]) => ctx.lamp(x, z, 4.0, 'black'));
    [[-32, 10], [32, 10], [-34, 22], [34, 22]].forEach(([x, z], i) => ctx.tree(x, z, 1.3, 'palm'));
    // the neighbouring offices
    for (let i = 0; i < 4; i++) {
      block('plaster', 14, 12 + (i % 2) * 4, 12, -44 - i * 2, 0, -6);
      block('plaster', 14, 12 + (i % 2) * 4, 12, 44 + i * 2, 0, -6);
    }

    ctx.light({ pos: [-30, 18, 30], target: [0, 20, 0], color: 0xffd0a0, intensity: 3000, distance: 200 });
    ctx.light({ pos: [30, 18, 26], target: [0, 20, 0], color: 0xffc890, intensity: 2400, distance: 200 });
  }
};
