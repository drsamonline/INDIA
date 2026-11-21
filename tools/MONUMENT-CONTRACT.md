# Monument module contract

Every monument page is a thin HTML shell plus one ES module in
`assets/js/monuments/<id>.js`. The module exports a plain object; the shared
engine (`assets/js/monument-engine.js`) does the rendering, sky, weather, UI,
tour and history drawer.

```js
export default {
  id: 'qutub-minar',
  accent: '#d9a441',        // page accent colour
  accent2: '#f0a868',       // secondary accent
  seed: 11,                 // deterministic RNG seed
  bounds: 95,               // shadow-camera half-extent in world units
  minDist: 18, maxDist: 340,// orbit limits
  home: { pos: [76, 30, 98], target: [0, 32, 0], fov: 40 },
  ground: { texture: 'paving', size: 1600, color: 0xc9bda6 },
  water: { y: -0.15, size: 900, color: 0x2f5a6b, distortion: 2.2 },  // optional
  views: [ { name: 'Full', pos: [...], target: [...] }, ... ],      // 3–5 entries
  tour:  [ { title, deva, text, pos, target, time, weather }, ... ], // 5–8 stops
  floods: [ { pos, target, color, intensity, distance } ],          // optional
  build(ctx) { /* geometry */ }
};
```

Scale: **1 unit = 1 metre**. The monument sits on the ground plane at `y = 0`,
centred on the origin, and faces **+Z** (the default camera is south of it).

## What `ctx` gives you

| helper | returns / does |
| --- | --- |
| `add(key, geo, x, y, z, o)` | queue a geometry with a material key; `o = {rx,ry,rz,s,sx,sy,sz}` |
| `box(w,h,d)` `plane(w,h)` `cyl(rTop,rBot,h,seg)` `cone(r,h,seg)` `sph(r,seg)` `torus(r,tube,rs,ts)` | three.js geometries (centred) |
| `dome(r,h,seg)` | half-ellipsoid dome sitting on y=0 |
| `onion(r,h,seg)` | bulbous Mughal/Sikh onion dome on y=0 |
| `lathe(points,seg)` | profile `[[r,y],...]` revolved |
| `arch(w,h,depth,spring)` | extruded pointed arch (base at y=0) |
| `archFrame(w,h,thick,depth)` | arch ring — use for carved door surrounds |
| `archShape(w,h,spring)` | 2D Shape, for custom extrusions |
| `block(key,w,h,d,x,y,z,o)` | box sitting on `y` (bottom-aligned) |
| `col(key,rt,rb,h,x,y,z,seg,o)` | cylinder sitting on `y` (bottom-aligned) |
| `chhatri(x,y,z,s,key,domeKey)` | domed pavilion on columns |
| `arcade(key,{count,w,h,depth,spacing,x,y,z,ry,fill})` | row of arches with dark openings |
| `stairs(x,y,z,w,totalH,steps,depth,key,ry)` | flight of steps |
| `railing(x,y,z,len,key,h,ry,posts)` | posts + top rail |
| `tree(x,z,s,kind)` | `'round'`, `'palm'`, `'cypress'` |
| `person(x,z,ry,key,s)` | tiny figure for scale |
| `lamp(x,z,h,key)` | lamp post |
| `flag(x,y,z,h,key)` | flag pole with cloth |
| `boat(x,z,s,ry,key)` | small boat (water sites) |
| `light({pos,target,color,intensity,distance})` | floodlight, fades in at night |
| `animate(fn)` | per-frame callback `fn(t, dt)` |
| `rng()` | deterministic 0–1 random |
| `mat(key)` / `tex(key)` | raw material / texture |
| `THREE` | the three.js namespace |

All geometry is merged per material when `build()` returns, so a scene of a few
thousand primitives costs a handful of draw calls. **Create a new geometry for
every `add()` call** — never reuse one object twice.

## Material keys

`marble` `marbleWarm` `white` `ivory` `cream` `sandstoneRed` `sandstoneBuff`
`sandstonePink` `granite` `plaster` `plasterWhite` `gold` `goldLeaf` `bronze`
`copper` `black` `dark` `teal` `green` `terracotta` `brick` `wood` `stone`
`paving` `grey` `red` `blue` `yellow` `pinkPaint` `water` `jali` `jaliWhite`
`glass` `foliage` `bark` `sand` `fabricRed` `fabricSaffron` `fabricWhite`

`dark` is for arch openings and shadowed interiors. `jali` / `jaliWhite` are
pierced lattice screens (alpha-cut, double sided) — use thin boxes.

## Ground textures

`ground.texture` is one of `paving`, `stone`, `grass`, `sandGround`, `marble`.

## Rules

1. **Silhouette first.** At the home view the monument must be instantly
   recognisable: correct proportions, tier count, dome shape, colour.
2. Keep the total under ~120k triangles and ~40 merged meshes.
3. Detail is built from primitives — no textures of photographs, no external
   assets, no `fetch`.
4. Fill the frame: the monument should occupy roughly 55–75% of the viewport
   height at `home`. Check on a 1280×800 screenshot.
5. Add life: 8–20 people, 6–16 trees, lamps, a boundary wall, paving — but keep
   them small relative to the building.
6. Never invent historical text inside the module — copy comes from
   `data/monuments.json`. The module only holds geometry, camera, tour text and
   colours. Tour text must be factual and can reuse the history already in the
   data file.
7. Accent colours should match the material of the monument (sandstone, marble,
   gold, granite).

## Building and checking a page

```bash
python3 tools/build_site.py --only <id>       # writes monuments/<id>.html
python3 tools/qa.py monuments/<id>.html out.png 1280 800
```

`tools/qa.py` loads the page in headless Chromium, waits for
`document.documentElement.dataset.boot === 'ok'`, prints console errors and the
scene statistics, and saves a screenshot. A page is finished when:

- `BOOT ok` with no `pageerror` lines,
- the screenshot shows the monument properly framed at 1280×800,
- the same at 390×844 (mobile),
- `?shot=21` (night) shows floodlights and a dark sky without blowing out.
