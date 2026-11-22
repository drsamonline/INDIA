#!/usr/bin/env python3
"""Adapt the original single-file Taj Mahal scene into the site.

The source (tools/source/taj-mahal.original.html) is a complete, self-contained
three.js scene. This script keeps it intact and only:
  * points three.js at the vendored copy instead of a CDN,
  * swaps the CDN fonts for the site's self-hosted faces,
  * adds a link back to the landing page,
  * adds a history drawer built from data/monuments.json,
  * adds the same previous/next monument arrows the other 23 pages get from
    assets/js/monument-engine.js (order taken from data/monuments.json),
  * adds the shared "licensed CC BY-NC 4.0" line plus a credits link to the
    history drawer.
The 3D scene itself is never touched: every change below is a string
replacement on the source markup, CSS or <head>.
"""
import json, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'tools', 'source', 'taj-mahal.original.html')).read()
MONUMENTS = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
data = {m['id']: m for m in MONUMENTS}['taj-mahal']

# --- previous / next monument, in the order the rest of the site uses ----
idx = [m['id'] for m in MONUMENTS].index('taj-mahal')
prev_mon = MONUMENTS[(idx - 1) % len(MONUMENTS)]   # wraps to the last monument
next_mon = MONUMENTS[(idx + 1) % len(MONUMENTS)]

def esc(s):
    return html.escape(str(s), quote=True)

# --- three.js from the vendored copy -------------------------------------
# licence: the scene was published CC0; the atlas as a whole is CC BY-NC 4.0
src = src.replace('https://creativecommons.org/publicdomain/zero/1.0/',
                  'https://creativecommons.org/licenses/by-nc/4.0/')
src = src.replace('CC0 1.0 Universal', 'CC BY-NC 4.0')
src = src.replace('Dr Sohil Momin, CC0.', 'Dr Sohil Momin, CC BY-NC 4.0.')
src = src.replace('CC0 1.0', 'CC BY-NC 4.0')
# the fog was a warm tan at 0.0016 density, which washed the whole scene brown
src = src.replace('haze: 0.0016', 'haze: 0.0009')
src = src.replace('FogExp2(0xe8c39a', 'FogExp2(0xdcd3c2')
src = src.replace('value="0.0016"', 'value="0.0009"')

# the Taj was the only page loading three.js from a CDN, so it died if the CDN
# was blocked and could drift from the version the other 23 pages run
src = src.replace('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js',
                  '../assets/vendor/three/build/three.module.js')
src = src.replace('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/',
                  '../assets/vendor/three/addons/')

src = src.replace('id="haze-val">27%', 'id="haze-val">15%')
# the page had no query-parameter support at all, which is why ?shot= did
# nothing and the night floodlights could not be inspected

# the sliders carry their own value attributes, which win over DEFAULTS — this
# is why the grade changes never reached the panel
src = src.replace('id="exposure" min="0.3" max="1.4" step="0.02" value="0.72"',
                  'id="exposure" min="0.3" max="1.4" step="0.02" value="0.62"')
src = src.replace('id="glow" min="0" max="1.2" step="0.02" value="0.32"',
                  'id="glow" min="0" max="1.2" step="0.02" value="0.24"')
src = src.replace("time: 17.35, cycle: false",
                  "time: (parseFloat(new URLSearchParams(location.search).get('shot')) || 17.35), cycle: false")
# The Taj already uses the same Sky addon as the engine, but at turbidity 6 and
# mie 0.004 — a much hazier atmosphere, which is what made it read brown. These
# are the engine's values, so the two now share one sky.
src = src.replace('skyU.turbidity.value = 6;', 'skyU.turbidity.value = 2.8;')
src = src.replace('skyU.rayleigh.value = 2;', 'skyU.rayleigh.value = 2.6;')
src = src.replace('skyU.mieCoefficient.value = 0.004;', 'skyU.mieCoefficient.value = 0.0022;')
src = src.replace('skyU.mieDirectionalG.value = 0.85;', 'skyU.mieDirectionalG.value = 0.86;')
# night floodlighting: the other twenty-three pages light their stone amber
# after dusk, and the Taj had only moon and lanterns
src = src.replace("""  scene.add(keyLight);
  scene.add(keyLight.target);""",
"""  scene.add(keyLight);
  scene.add(keyLight.target);
  const tajFloods = [];
  [[-40, 14, 52], [40, 14, 52], [0, 12, 74], [-38, 11, -34], [38, 11, -34]].forEach((p) => {
    const fl = new THREE.SpotLight(0xffc98a, 0, 240, 0.62, 0.55, 1.3);
    fl.position.set(p[0], p[1], p[2]);
    fl.target.position.set(0, 17, 0);
    fl.userData.base = 2600;
    scene.add(fl, fl.target);
    tajFloods.push(fl);
  });""")
src = src.replace("    starMat.opacity = nightFactor * 0.9 * (1 - weather.cover);",
"""    starMat.opacity = nightFactor * 0.9 * (1 - weather.cover);
    tajFloods.forEach((fl) => { fl.intensity = fl.userData.base * nightFactor * (1 - 0.45 * weather.rain); });""")
# match the site's grade: the engine runs 0.52-0.62 exposure, a 0.9 bloom
# threshold and a lighter glow, so the Taj sat brighter and hazier than the
# other twenty-three pages
src = src.replace('exposure: 0.72', 'exposure: 0.62')
src = src.replace('glow: 0.32', 'glow: 0.24')
src = src.replace('state.glow, 0.5, 0.85', 'state.glow, 0.5, 0.90')
src = src.replace('id="exposure-val">0.72', 'id="exposure-val">0.62')
src = src.replace('id="glow-val">0.32', 'id="glow-val">0.24')
src = src.replace('>CC0<', '>CC BY-NC 4.0<')
# the source called the licence a public-domain dedication; it is not one
src = src.replace('public domain dedication', 'attribution, non-commercial use')
# and its badge class still carried the old CC0 name
src = src.replace('cc0-badge', 'lic-badge')

src = src.replace('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js',
                  '../assets/vendor/three/build/three.module.js')
src = src.replace('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/',
                  '../assets/vendor/three/addons/')

# --- fonts: drop the CDN stylesheets, use the local faces ----------------
for line in [
    '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>\n',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/400.css">\n',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/500.css">\n',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/700.css">\n',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@5/400.css">\n',
]:
    src = src.replace(line, '')
src = src.replace('<script type="importmap">',
                  '<link rel="stylesheet" href="../assets/css/fonts.css">\n<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">\n<script type="importmap">', 1)

# --- history drawer markup ----------------------------------------------
paras = ''.join('<p>%s</p>' % esc(p) for p in data['history'])
facts = ''.join('<div class="tj-fact"><dt>%s</dt><dd>%s</dd></div>' % (esc(f['k']), esc(f['v'])) for f in data['facts'])
links = ''.join('<a href="%s" target="_blank" rel="noopener">%s<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></a>' % (esc(l['href']), esc(l['label'])) for l in data['links'])
im = data['image']
# the shared licence line every other page renders in its history drawer
licence_line = ('Model and code by <b>Dr Sohil Momin</b>, licensed '
                '<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">CC BY-NC 4.0</a>'
                ' · <a href="../credits.html">Credits &amp; licences</a>.')

credit = ('Photograph: <a href="%s" target="_blank" rel="noopener">%s</a> by %s · %s. '
          'Text adapted from the <a href="%s" target="_blank" rel="noopener">Wikipedia article</a>, '
          'CC BY-SA 4.0. The 3D model is procedural.') % (
    esc(im['page']), esc(im['file']), esc(im['artist']), esc(im['license']), esc(data['wikipedia']))

extra_css = """
/* ---- site integration (added by tools/build_taj.py) ---- */
#taj-home{position:fixed;top:56px;left:12px;z-index:95;display:inline-flex;align-items:center;gap:7px;
  text-decoration:none;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#fff;
  background:rgba(20,16,12,.55);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:8px 12px;
  backdrop-filter:blur(10px);text-shadow:0 1px 2px rgba(0,0,0,.5);transition:.2s}
#taj-home:hover{border-color:var(--gold);background:rgba(20,16,12,.82)}
#taj-home svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.8}
#taj-about{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:18px;
  background:rgba(8,6,10,.62);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .28s}
#taj-about.open{opacity:1;pointer-events:auto}
.tj-card{width:min(660px,100%);max-height:min(84vh,760px);max-height:min(84dvh,760px);overflow-y:auto;
  padding:26px 28px 22px;border-radius:16px;background:linear-gradient(180deg,#15161f,#101119);
  border:1px solid var(--line);box-shadow:0 40px 100px rgba(0,0,0,.6);color:var(--text)}
.tj-card h2{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:26px;
  letter-spacing:.06em;text-transform:uppercase}
.tj-kicker{margin:0 0 6px;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
.tj-deva{font-family:'Noto Sans Devanagari',sans-serif;color:var(--gold-2);font-size:14px;margin:2px 0 14px}
.tj-card p{font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;line-height:1.62;color:#e6dfd0;margin:0 0 12px}
.tj-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin:18px 0;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden}
.tj-fact{background:#14161e;padding:10px 12px}
.tj-fact dt{font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin:0 0 3px}
.tj-fact dd{margin:0;font-size:11.5px}
.tj-links{display:flex;flex-wrap:wrap;gap:7px;margin:16px 0 4px}
.tj-links a{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:999px;text-decoration:none;
  border:1px solid var(--line);background:rgba(217,164,65,.08);font-size:9.5px;letter-spacing:.1em;
  text-transform:uppercase;color:#ffe9bd}
.tj-links a:hover{background:rgba(217,164,65,.2)}
.tj-links svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.8}
.tj-credit{font-size:9.5px;line-height:1.7;color:var(--muted);border-top:1px solid rgba(255,255,255,.08);
  margin-top:18px;padding-top:12px}
.tj-licence{margin:2px 0 0;font-size:9.5px;letter-spacing:.02em;color:#cfc6b2}
.tj-licence b{color:#e6dfd0;font-weight:600}
.tj-licence a{color:#ffe9bd;text-decoration:none;border-bottom:1px solid rgba(217,164,65,.35)}
.tj-licence a:hover{border-color:var(--gold)}
.tj-credit a{color:#cfc6b2}
.tj-close{float:right;margin:-6px -8px 0 12px;width:34px;height:34px;border-radius:9px;cursor:pointer;
  border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:var(--text);display:grid;place-items:center}
.tj-close svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}
/* prev / next arrows: same .cluster-btn look, as links rather than buttons */
a.cluster-btn{text-decoration:none;color:#e9e0cd;box-sizing:border-box}
/* keep the centred title clear of the wider six-button cluster */
@media (min-width:721px){
  /* the cluster is now seven buttons (328px) wide */
  #info{padding-left:24px;padding-right:352px}
}
@media (max-width:720px){
  #taj-home{top:auto;bottom:54px;left:10px;font-size:8px;padding:6px 9px}
  .tj-card{padding:20px 18px}
  .tj-card p{font-size:15px}
  .tj-card .tj-licence{font-size:9.5px;line-height:1.6}
  #cluster{gap:6px}
  .cluster-btn{width:34px;height:34px}
}
@media (max-width:720px) and (orientation:landscape){
  #info{padding-right:300px}
}
"""

extra_html = """
<a id="taj-home" href="../index.html"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg> All monuments</a>
<div id="taj-about" role="dialog" aria-modal="true" aria-label="About the Taj Mahal">
  <div class="tj-card">
    <button class="tj-close" id="tj-close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <p class="tj-kicker">__KICKER__</p>
    <h2>Taj Mahal</h2>
    <p class="tj-deva">ताज महल</p>
    __PARAS__
    <dl class="tj-facts">__FACTS__</dl>
    <div class="tj-links">__LINKS__</div>
    <p class="tj-licence">__LICENCE__</p>
    <p class="tj-credit">__CREDIT__</p>
  </div>
</div>
<script>
(function(){
  var d=document.getElementById('taj-about');
  function open(){d.classList.add('open');}
  function close(){d.classList.remove('open');}
  document.getElementById('tj-close').onclick=close;
  d.addEventListener('click',function(e){if(e.target===d)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  var b=document.getElementById('btn-about-taj');
  if(b)b.onclick=open;
  window.__tajAbout=open;
  /* QA hook: mark the document ready once the scene has faded in */
  var t=setInterval(function(){
    if(document.body.classList.contains('is-ready')){
      document.documentElement.dataset.boot='ok'; clearInterval(t);
    }
  },400);
})();
</script>
"""
extra_html = (extra_html.replace('__KICKER__', esc('%s · %s' % (data['place'], data['era'])))
              .replace('__PARAS__', paras).replace('__FACTS__', facts)
              .replace('__LINKS__', links).replace('__LICENCE__', licence_line)
              .replace('__CREDIT__', credit))

# --- previous / next arrows, first in the existing top-right cluster -----
# same markup, icons and .cluster-btn styling the engine uses on the other
# 23 pages; the Taj is first in the atlas, so prev wraps to the last monument.
nav_arrows = (
    '<a class="cluster-btn nav-btn" href="%s.html" aria-label="Previous monument" '
    'title="Previous · %s"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>'
    '<span class="tag">PREV · %s</span></a>\n  '
    '<a class="cluster-btn nav-btn" href="%s.html" aria-label="Next monument" '
    'title="Next · %s"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>'
    '<span class="tag">NEXT · %s</span></a>\n  ') % (
    esc(prev_mon['id']), esc(prev_mon['name']), esc(prev_mon['name'].upper()),
    esc(next_mon['id']), esc(next_mon['name']), esc(next_mon['name'].upper()))

src = src.replace('<div id="cluster">\n  <button id="btn-tour"',
                  '<div id="cluster">\n  ' + nav_arrows + '<button id="btn-tour"', 1)

# an About button in the existing control cluster
src = src.replace('<button id="btn-cine"', '''<button id="btn-about-taj" class="cluster-btn" aria-label="History and sources" title="History &amp; sources">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.6"/></svg>
    <span class="tag">ABOUT</span>
  </button>
  <button id="btn-cine"''', 1)

src = src.replace('</style>', extra_css + '\n</style>', 1)
src = src.replace('</body>', extra_html + '\n</body>', 1)

# title + description for the site
src = src.replace('<title>three.js webgl — procedural — taj mahal · Dr Sohil Momin</title>',
                  '<title>Taj Mahal — 3D miniature · INDIA</title>')
# (the licence in this string was already rewritten to CC BY-NC 4.0 above)
src = src.replace('content="three.js webgl — procedural — taj mahal by Dr Sohil Momin, CC BY-NC 4.0.',
                  'content="Taj Mahal, Agra — a procedural three.js miniature by Dr Sohil Momin, CC BY-NC 4.0.')

# --- licence guard: the page must not still claim CC0 / public domain -----
for bad in ('CC0', 'publicdomain/zero', 'public domain'):
    assert bad not in src, 'licence string survived the rewrite: %r' % bad
assert 'CC BY-NC 4.0' in src, 'CC BY-NC 4.0 missing from the output'
for href in ('%s.html' % prev_mon['id'], '%s.html' % next_mon['id'], '../credits.html'):
    assert 'href="%s"' % href in src, 'missing link: %s' % href

out = os.path.join(ROOT, 'monuments', 'taj-mahal.html')
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w').write(src)
print('wrote', os.path.relpath(out, ROOT), len(src) // 1024, 'KB',
      '· CC BY-NC 4.0 x%d' % src.count('CC BY-NC 4.0'),
      '· prev=%s next=%s' % (prev_mon['id'], next_mon['id']))
