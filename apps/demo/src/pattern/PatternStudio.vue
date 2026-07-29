<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, watch, ref, nextTick } from 'vue';
import p5 from 'p5';

/* ---------- palettes (from @auxiliary/tokens — blue ramp, cadet oklch→hex, ink, field) ---------- */
const PALETTES: Record<string, { tones: string[]; accent: string; ground: string }> = {
  blue:  { tones: ['#06090F','#0C1A3E','#102454','#17398D','#113DB5','#1248DF','#205CFC'], accent: '#6A9CFF', ground: '#06090F' },
  cadet: { tones: ['#131717','#1C2222','#242A2A','#3C4444','#566060','#688788','#A4B1B2'], accent: '#205CFC', ground: '#131717' },
  ink:   { tones: ['#06090F','#0A1020','#0E1626','#141E33','#1C2840','#26344F','#33456A'], accent: '#417DFF', ground: '#06090F' },
  mixed: { tones: ['#06090F','#102454','#2C3540','#3C4444','#1248DF','#688788','#205CFC'], accent: '#6A9CFF', ground: '#09101D' },
  field: { tones: ['#0C1116','#16212A','#28373F','#3A4C54','#516269','#6E828A','#90A4AB'], accent: '#90A4AB', ground: '#0C1116' },
};
const LOGO_D = 'M327.102 266.371L369 379H285.204C278.221 379 272.087 374.57 269.823 367.973L250.195 310.197L327.102 266.371ZM347.862 213.214L142.336 278.718C133.182 281.64 124.784 272.498 128.37 263.638L175.175 149.972C179.138 140.265 193.01 140.736 196.407 150.632L222.735 228.483L303.511 202.752L232.926 13.0272C230.472 6.3355 224.15 2 216.978 2H166.304C159.416 2 153.188 6.147 150.545 12.556L11.263 355.626C6.7335 366.748 14.9432 379 27.0219 379H72.2227C78.7338 379 85.245 377.304 90.9069 374.005L352.958 224.713C355.695 223.205 356.827 219.906 355.789 216.984C354.657 213.874 351.165 212.178 347.862 213.214Z';

/**
 * Indexed read into a tone ramp, clamped to the ramp.
 *
 * Every ramp above is a non-empty literal and every caller derives its index from the
 * ramp's own length, so an out-of-range read is a programming error rather than a
 * runtime condition. Clamping keeps that honest without scattering `!` across the
 * ~40 tone reads, and an actually-empty ramp throws instead of painting `undefined`
 * (p5 is typed `any`, so an undefined fill would silently render nothing at all).
 */
function ramp(tones: string[], i: number): string {
  const tone = tones[Math.min(Math.max(Math.round(i), 0), tones.length - 1)];
  if (tone === undefined) throw new Error('PatternStudio: empty tone ramp');
  return tone;
}

const W = 760, H = 960;

const GEOMS = [
  { v: 'tri', label: 'Triangles' }, { v: 'square', label: 'Squares' }, { v: 'shard', label: 'Shards' },
  { v: 'logo', label: 'Logo' }, { v: 'mash', label: 'Mash' }, { v: 'insignia', label: 'Insignia' },
  { v: 'mil', label: 'Military' }, { v: 'tricamo', label: 'Tri Camo' }, { v: 'three', label: 'Three' }, { v: 'swarm', label: 'Swarm' },
];
const PAL_OPTS = [
  { v: 'blue', label: 'Blue' }, { v: 'cadet', label: 'Cadet' }, { v: 'ink', label: 'Ink' },
  { v: 'mixed', label: 'Mixed' }, { v: 'field', label: 'Field' },
];
const LOGO_OPTS = [
  { v: 'none', label: 'None' }, { v: 'emerge', label: 'Emerge' }, { v: 'mark', label: 'Mark' },
  { v: 'knockout', label: 'Knock' }, { v: 'scatter', label: 'Scatter' },
];

const cfg = reactive({ geom: 'three', palette: 'blue', logo: 'none' });
const params = reactive({ cell: 30, acc: 0.06, step: 7, rl: 0.34, rt: 0.24, rd: 0.14, fr: 0.55, logon: 18, tile: true, micro: true, lift: false, seed: 1024 });

const PRESETS = [
  { name: 'insignia-blue', label: 'Insignia·Blue', geom: 'insignia', palette: 'blue', logo: 'none', cell: 30, acc: 0.05, micro: false },
  { name: 'insignia-cadet', label: 'Insignia·Cadet', geom: 'insignia', palette: 'cadet', logo: 'none', cell: 30, acc: 0.05, micro: false },
  { name: 'camo-blue', label: 'Camo·Blue', geom: 'tri', palette: 'blue', logo: 'none', cell: 24, acc: 0.06, micro: false },
  { name: 'mark-blue', label: 'Mark·Blue', geom: 'tri', palette: 'blue', logo: 'mark', cell: 24, acc: 0.06, micro: false },
  { name: 'mash-mixed', label: 'Mash·Mixed', geom: 'mash', palette: 'mixed', logo: 'none', cell: 26, acc: 0.07, micro: false },
  { name: 'military-field', label: 'Military·Field', geom: 'mil', palette: 'field', logo: 'none', cell: 16, acc: 0.04, rl: 0.5, rt: 0.3, rd: 0.16, micro: true },
  { name: 'military-cadet', label: 'Military·Cadet', geom: 'mil', palette: 'cadet', logo: 'none', cell: 16, acc: 0.04, rl: 0.5, rt: 0.3, rd: 0.16, micro: true },
  { name: 'three-field', label: 'Three·Field', geom: 'three', palette: 'field', logo: 'none', cell: 30, acc: 0.06, micro: false },
  { name: 'three-blue', label: 'Three·Blue', geom: 'three', palette: 'blue', logo: 'none', cell: 30, acc: 0.06, micro: false },
  { name: 'three-cadet', label: 'Three·Cadet', geom: 'three', palette: 'cadet', logo: 'none', cell: 30, acc: 0.06, micro: false },
  { name: 'shards-ink', label: 'Shards·Ink', geom: 'shard', palette: 'ink', logo: 'none', cell: 30, acc: 0.06, micro: false },
  { name: 'logo-blue', label: 'Logo·Blue', geom: 'logo', palette: 'blue', logo: 'none', cell: 54, acc: 0.06, micro: false },
  { name: 'scatter-blue', label: 'Scatter·Blue', geom: 'three', palette: 'blue', logo: 'scatter', logon: 24, cell: 30, acc: 0.06, micro: false },
  { name: 'swarm-blue', label: 'Swarm·Blue', geom: 'swarm', palette: 'blue', logo: 'none', cell: 26, acc: 0.07, micro: false },
  { name: 'tricamo-field', label: 'TriCamo·Field', geom: 'tricamo', palette: 'field', logo: 'none', cell: 22, acc: 0.04, rl: 0.5, rt: 0.3, rd: 0.16, micro: true },
] as const;

const SLIDERS = [
  { id: 'cell', label: 'Cell size', min: 12, max: 90, step: 2, int: true },
  { id: 'acc', label: 'Accent rarity', min: 0, max: 0.35, step: 0.01, int: false },
  { id: 'step', label: 'Tone steps', min: 3, max: 7, step: 1, int: true },
  { id: 'logon', label: 'Logo count', min: 0, max: 90, step: 1, int: true },
  { id: 'rl', label: 'Repeat left', min: 0, max: 0.92, step: 0.01, int: false },
  { id: 'rt', label: 'Repeat up', min: 0, max: 0.92, step: 0.01, int: false },
  { id: 'rd', label: 'Repeat diagonal', min: 0, max: 0.92, step: 0.01, int: false },
] as const;

const holder = ref<HTMLElement | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let inst: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logoImg: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logoMask: any = null;

function makeSketch() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (p: any) => {
    p.setup = () => {
      const c = p.createCanvas(W, H); c.parent(holder.value); p.noLoop(); p.pixelDensity(1);
      // Rasterise the logo SVG ourselves (a native Image decodes the blob reliably across p5 1.x / 2.0,
      // where loadImage on an SVG data-URI is flaky). logoImg becomes a pre-drawn graphics buffer.
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380"><path d="' + LOGO_D + '" fill="#000000"/></svg>';
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const img = new Image();
      img.onload = () => {
        const g = p.createGraphics(380, 380); g.clear(); g.drawingContext.drawImage(img, 0, 0, 380, 380);
        logoImg = g; URL.revokeObjectURL(url);
        buildMask(); render();
      };
      img.src = url;
    };
    p.draw = render;

    function buildMask() {
      logoMask = p.createGraphics(W, H); logoMask.clear();
      const s = Math.min(W, H) * 0.74;
      logoMask.image(logoImg, (W - s) / 2, (H - s) / 2, s, s); logoMask.loadPixels();
    }
    function inside(x: number, y: number) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return false; return logoMask.pixels[4 * (y * W + x) + 3] > 40; }

    function clusterGrid(cols: number, rows: number, nT: number) {
      const rl = params.rl, rt = params.rt, rd = params.rd, fr = params.fr, acc = params.acc, tile = params.tile;
      const g = new Array(cols * rows);
      const wx = (x: number) => (x % cols + cols) % cols, wy = (y: number) => (y % rows + rows) % rows;
      const at = (x: number, y: number) => { if (tile) return g[wy(y) * cols + wx(x)]; if (x < 0 || y < 0 || x >= cols || y >= rows) return undefined; return g[y * cols + x]; };
      const rnd = () => p.random() < acc ? nT - 1 : p.floor(p.pow(p.random(), 1.7) * (nT - 1));
      let pL = rl, pU = rt, pD = rd; const csum = pL + pU + pD; if (csum > 0.82) { const k = 0.82 / csum; pL *= k; pU *= k; pD *= k; }
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        let t;
        if (y === 0 && !tile) { t = (x > 0 && p.random() < fr) ? g[x - 1] : rnd(); }
        else {
          const r = p.random();
          if (r < pL) t = at(x - 1, y);
          else if (r < pL + pU) t = at(x, y - 1);
          else if (r < pL + pU + pD) t = (p.random() < 0.5) ? at(x - 1, y - 1) : at(x + 1, y - 1);
          else t = rnd();
        }
        if (t == null || isNaN(t)) t = rnd();
        g[y * cols + x] = t;
      }
      return { g, at: (x: number, y: number) => g[y * cols + x] };
    }
    function toneAt(tones: string[], ti: number, cx: number, cy: number) {
      if (cfg.logo === 'emerge' && inside(cx, cy)) ti = Math.min(tones.length - 1, ti + 3);
      return ti;
    }
    function maskLogo(color: string, size: number) {
      const b = p.createGraphics(size, size); b.background(color);
      const l = p.createGraphics(size, size); l.image(logoImg, 0, 0, size, size);
      const bi = b.get(); bi.mask(l.get()); return bi;
    }
    function logoTiles(tones: string[], nT: number, size: number) {
      const arr = [];
      for (let i = 0; i < nT; i++) arr.push(maskLogo(ramp(tones, i), size));
      return arr;
    }

    function render() {
      if (!logoImg || !logoMask) return;
      const P = PALETTES[cfg.palette];
      // cfg.palette is only ever set from PAL_OPTS, so a miss means the two lists
      // drifted apart — surface it rather than rendering a blank canvas.
      if (!P) throw new Error(`PatternStudio: no palette named "${cfg.palette}"`);
      const nT = Math.min(P.tones.length, params.step);
      const tones = P.tones.slice(0, nT - 1).concat([ramp(P.tones, P.tones.length - 1)]);
      const cell = params.cell;
      p.randomSeed(params.seed | 0);
      p.noStroke(); p.background(P.ground);

      if (cfg.geom === 'square') drawSquares(P, tones, nT, cell);
      else if (cfg.geom === 'shard') drawShards(P, tones, nT, cell);
      else if (cfg.geom === 'logo') drawLogos(P, tones, nT, cell);
      else if (cfg.geom === 'mash') drawLogoMash(P, tones, nT, cell);
      else if (cfg.geom === 'insignia') drawInsignia(P, tones, nT, cell);
      else if (cfg.geom === 'mil') drawMilitary(P, tones, nT, cell);
      else if (cfg.geom === 'tricamo') drawTriCamo(P, tones, nT, cell);
      else if (cfg.geom === 'three') drawThree(P, tones, nT, cell);
      else if (cfg.geom === 'swarm') drawSwarm(P, tones, nT, cell);
      else drawTriangles(P, tones, nT, cell);

      if (cfg.logo === 'mark') {
        const s = Math.min(W, H) * 0.5, g = p.createGraphics(s, s); g.image(logoImg, 0, 0, s, s);
        const b = p.createGraphics(s, s); b.background(P.accent); const bi = b.get(); bi.mask(g.get());
        p.image(bi, (W - s) / 2, (H - s) / 2);
      }
      if (cfg.logo === 'scatter' && !['three', 'shard', 'mash'].includes(cfg.geom)) drawScatter(P);
    }

    function drawScatter(P: typeof PALETTES[string]) {
      const count = params.logon, tile = params.tile;
      const cols = [P.accent, '#FFFFFF', ramp(P.tones, P.tones.length - 1), P.ground, ramp(P.tones, 1)];
      const imgs = cols.map((c) => maskLogo(c, 256));
      const offs = tile ? [[0, 0], [-W, 0], [W, 0], [0, -H], [0, H], [-W, -H], [W, -H], [-W, H], [W, H]] : [[0, 0]];
      p.imageMode(p.CENTER);
      for (let i = 0; i < count; i++) {
        const x = p.random(W), y = p.random(H), a = p.random(p.TWO_PI), s = p.random(34, 120), ci = p.floor(p.random(imgs.length));
        for (const [dx, dy] of offs) { const cx = x + dx, cy = y + dy; if (cx < -s || cx > W + s || cy < -s || cy > H + s) continue; p.push(); p.translate(cx, cy); p.rotate(a); p.image(imgs[ci], 0, 0, s, s); p.pop(); }
      }
      p.imageMode(p.CORNER);
    }
    function drawTriangles(P: typeof PALETTES[string], tones: string[], nT: number, tw: number) {
      const th = tw * Math.sqrt(3) / 2, half = tw / 2;
      const cols = Math.ceil(W / half) + 2, rows = Math.ceil(H / th) + 1;
      const grid = clusterGrid(cols, rows, nT);
      for (let r = 0; r < rows; r++) { const y = r * th;
        for (let k = 0; k < cols; k++) { const x = k * half, up = ((k + r) & 1) === 0;
          let ax, ay, bx, by, cx2, cy2;
          if (up) { ax = x - half; ay = y + th; bx = x + half; by = y + th; cx2 = x; cy2 = y; } else { ax = x - half; ay = y; bx = x + half; by = y; cx2 = x; cy2 = y + th; }
          const cenx = (ax + bx + cx2) / 3, ceny = (ay + by + cy2) / 3;
          if (cfg.logo === 'knockout' && inside(cenx, ceny)) continue;
          const ti = toneAt(tones, grid.at(k, r), cenx, ceny);
          p.fill(tones[ti]); p.triangle(ax, ay, bx, by, cx2, cy2);
        }
      }
    }
    // "Rheinmetall, but triangles": the multi-scale digital-camo engine (4-tone macro blobs + fine
    // pixel clustering) rendered on the triangle lattice instead of square pixels.
    function drawTriCamo(P: typeof PALETTES[string], _t: string[], _n: number, tw: number) {
      const L = P.tones.length - 1;
      const tones = [ramp(P.tones, 0), ramp(P.tones, L * 0.36), ramp(P.tones, L * 0.66), ramp(P.tones, L)];
      const nT = 4;
      const th = tw * Math.sqrt(3) / 2, half = tw / 2;
      const cols = Math.ceil(W / half) + 2, rows = Math.ceil(H / th) + 1;
      const mc = tw * 5, mcols = Math.ceil(W / mc), mrows = Math.ceil(H / mc);
      const macro = clusterGrid(mcols, mrows, nT);
      const tile = params.tile;
      const wx = (k: number) => (k % cols + cols) % cols, wy = (r: number) => (r % rows + rows) % rows;
      const fine = new Array(cols * rows);
      const fAt = (k: number, r: number) => { if (tile) return fine[wy(r) * cols + wx(k)]; if (k < 0 || r < 0 || k >= cols || r >= rows) return undefined; return fine[r * cols + k]; };
      for (let r = 0; r < rows; r++) { const y = r * th;
        for (let k = 0; k < cols; k++) {
          const x = k * half, up = ((k + r) & 1) === 0;
          let ax, ay, bx, by, cx2, cy2;
          if (up) { ax = x - half; ay = y + th; bx = x + half; by = y + th; cx2 = x; cy2 = y; } else { ax = x - half; ay = y; bx = x + half; by = y; cx2 = x; cy2 = y + th; }
          const cenx = (ax + bx + cx2) / 3, ceny = (ay + by + cy2) / 3;
          const mt = macro.at(Math.min(mcols - 1, Math.floor(cenx / mc)), Math.min(mrows - 1, Math.floor(ceny / mc)));
          let t; const rr = p.random();
          if (rr < 0.6) t = mt;
          else if (rr < 0.82) { const v = fAt(k - 1, r); t = (v == null) ? mt : v; }
          else if (rr < 0.92) { const v = fAt(k, r - 1); t = (v == null) ? mt : v; }
          else t = p.constrain(mt + p.floor(p.random(-1, 2)), 0, nT - 1);
          if (t == null || isNaN(t)) t = mt;
          fine[r * cols + k] = t;
          if (cfg.logo === 'knockout' && inside(cenx, ceny)) continue;
          let ti = toneAt(tones, t, cenx, ceny); if (ti >= nT) ti = nT - 1;
          p.fill(tones[ti]); p.triangle(ax, ay, bx, by, cx2, cy2);
        }
      }
    }

    function drawSquares(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const grid = clusterGrid(cols, rows, nT);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const px = x * cell, py = y * cell, cx = px + cell / 2, cy = py + cell / 2;
        if (cfg.logo === 'knockout' && inside(cx, cy)) continue;
        const ti = toneAt(tones, grid.at(x, y), cx, cy);
        p.fill(tones[ti]); p.rect(px, py, cell + 0.6, cell + 0.6);
      }
    }
    function drawShards(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const grid = clusterGrid(cols, rows, nT);
      const sub = (cfg.logo === 'scatter');
      const subRatio = sub ? Math.min(0.6, params.logon / 100) : 0;
      const lift = sub && params.lift;
      const imgs = sub ? logoTiles(tones, nT, 200) : null;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const cx = x * cell + cell / 2, cy = y * cell + cell / 2;
        if (cfg.logo === 'knockout' && inside(cx, cy)) continue;
        const ti = toneAt(tones, grid.at(x, y), cx, cy);
        const s = cell * p.random(0.55, 1.25), a = p.random(p.TWO_PI);
        const isLogo = sub && p.random() < subRatio;
        p.push(); p.translate(cx + p.random(-cell * 0.3, cell * 0.3), cy + p.random(-cell * 0.3, cell * 0.3)); p.rotate(a);
        if (isLogo) { const lt = lift ? Math.min(nT - 1, ti + 1) : ti; p.imageMode(p.CENTER); p.image(imgs![lt], 0, 0, s * 1.7, s * 1.7); p.imageMode(p.CORNER); }
        else { p.fill(tones[ti]); p.triangle(-s / 2, s / 2, s / 2, s / 2, p.random(-s * 0.3, s * 0.3), -s / 2); }
        p.pop();
      }
    }
    function drawLogos(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const grid = clusterGrid(cols, rows, nT);
      const imgs = logoTiles(tones, nT, cell);
      p.imageMode(p.CENTER);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const cx = x * cell + cell / 2, cy = y * cell + cell / 2;
        if (cfg.logo === 'knockout' && inside(cx, cy)) continue;
        const ti = toneAt(tones, grid.at(x, y), cx, cy);
        const rot = ((x + y) & 1) === 1;
        p.push(); p.translate(cx, cy); if (rot) p.rotate(p.PI);
        p.image(imgs[ti], 0, 0, cell * 0.96, cell * 0.96); p.pop();
      }
      p.imageMode(p.CORNER);
    }
    function drawThree(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      const tile = params.tile;
      p.noStroke(); p.fill(tones[Math.floor(nT * 0.45)]); p.rect(0, 0, W, H);
      const n = Math.floor((W * H) / (cell * cell) * 1.5);
      const sub = (cfg.logo === 'scatter');
      const subRatio = sub ? Math.min(0.6, params.logon / 100) : 0;
      const lift = sub && params.lift;
      const imgs = sub ? logoTiles(tones, nT, 200) : null;
      const items = [];
      for (let i = 0; i < n; i++) items.push({ x: p.random(W), y: p.random(H), a: p.random(p.TWO_PI), s: cell * p.random(0.75, 2.1), ti: p.floor(p.random(nT)), sq: p.random(0.72, 1.28), logo: sub && p.random() < subRatio });
      const offs = tile ? [[0, 0], [-W, 0], [W, 0], [0, -H], [0, H], [-W, -H], [W, -H], [-W, H], [W, H]] : [[0, 0]];
      p.strokeJoin(p.ROUND);
      for (const it of items) {
        let ti = it.ti;
        if (cfg.logo === 'emerge' && inside(it.x, it.y)) ti = Math.min(nT - 1, ti + 3);
        const col = tones[ti], r = it.s / 2;
        for (const [dx, dy] of offs) {
          const cx = it.x + dx, cy = it.y + dy;
          if (cx < -it.s || cx > W + it.s || cy < -it.s || cy > H + it.s) continue;
          if (cfg.logo === 'knockout' && inside(it.x, it.y)) continue;
          p.push(); p.translate(cx, cy); p.rotate(it.a);
          if (it.logo) { const lt = lift ? Math.min(nT - 1, ti + 1) : ti; p.imageMode(p.CENTER); p.image(imgs![lt], 0, 0, it.s * 1.5, it.s * 1.5); p.imageMode(p.CORNER); }
          else { p.fill(col); p.stroke(col); p.strokeWeight(it.s * 0.17); p.triangle(0, -r * it.sq, r * 0.9, r * 0.62 * it.sq, -r * 0.9, r * 0.62 * it.sq); }
          p.pop();
        }
      }
      p.noStroke();
    }
    // Swarm: sharp SHARD triangles (like the Shards geometry) but oriented directionally — pointing
    // left and flowing right→left through noise-driven lanes with clumping.
    function drawSwarm(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      p.noStroke(); p.fill(tones[Math.floor(nT * 0.4)]); p.rect(0, 0, W, H); // mid-tone ground
      const n = Math.floor((W * H) / (cell * cell) * 2.4);
      for (let i = 0; i < n; i++) {
        const x = p.random(W), y0 = p.random(H);
        const ny = p.noise(x * 0.0035, y0 * 0.012) * 150 - 75;   // wavy horizontal lanes
        const y = y0 + ny;
        const dens = p.noise(x * 0.005 + 30, y0 * 0.005 + 30);   // clump into streaks, leave gaps
        if (dens < 0.40) continue;
        const ti = p.random() < params.acc ? nT - 1 : p.floor(p.random() * (nT - 1));
        const s = cell * p.random(0.5, 1.5);
        const a = -p.HALF_PI + p.random(-0.5, 0.5);              // shards point LEFT, jittered for variety
        p.push(); p.translate(x, y); p.rotate(a);
        p.fill(tones[ti]);
        p.triangle(-s / 2, s / 2, s / 2, s / 2, p.random(-s * 0.3, s * 0.3), -s / 2); // sharp shard
        p.pop();
      }
      p.noStroke();
    }

    function drawLogoMash(P: typeof PALETTES[string], tones: string[], nT: number, cell: number) {
      const base = 220, imgs = logoTiles(tones, nT, base);
      const acc = params.acc, tile = params.tile;
      const n = Math.floor((W * H) / (cell * cell) * 0.55);
      const items = [];
      for (let i = 0; i < n; i++) {
        const ti = p.random() < acc ? nT - 1 : p.floor(p.pow(p.random(), 1.5) * (nT - 1));
        items.push({ x: p.random(W), y: p.random(H), a: p.random(p.TWO_PI), s: cell * p.random(0.5, 1.8), ti });
      }
      items.sort((u, v) => u.ti - v.ti);
      p.imageMode(p.CENTER);
      const offs = tile ? [[0, 0], [-W, 0], [W, 0], [0, -H], [0, H], [-W, -H], [W, -H], [-W, H], [W, H]] : [[0, 0]];
      for (const it of items) {
        if (cfg.logo === 'knockout' && inside(it.x, it.y)) continue;
        let ti2 = it.ti; if (cfg.logo === 'emerge' && inside(it.x, it.y)) ti2 = Math.min(nT - 1, ti2 + 3);
        for (const [dx, dy] of offs) {
          const cx = it.x + dx, cy = it.y + dy;
          if (cx < -it.s || cx > W + it.s || cy < -it.s || cy > H + it.s) continue;
          p.push(); p.translate(cx, cy); p.rotate(it.a); p.image(imgs[ti2], 0, 0, it.s, it.s); p.pop();
        }
      }
      p.imageMode(p.CORNER);
    }
    function drawInsignia(P: typeof PALETTES[string], tones: string[], nT: number, tw: number) {
      const th = tw * Math.sqrt(3) / 2, half = tw / 2;
      const cols = Math.ceil(W / half) + 2, rows = Math.ceil(H / th) + 1;
      const grid = clusterGrid(cols, rows, nT);
      for (let r = 0; r < rows; r++) { const y = r * th;
        for (let k = 0; k < cols; k++) { const x = k * half, up = ((k + r) & 1) === 0;
          let ax, ay, bx, by, cx2, cy2;
          if (up) { ax = x - half; ay = y + th; bx = x + half; by = y + th; cx2 = x; cy2 = y; } else { ax = x - half; ay = y; bx = x + half; by = y; cx2 = x; cy2 = y + th; }
          const cenx = (ax + bx + cx2) / 3, ceny = (ay + by + cy2) / 3;
          if (cfg.logo === 'knockout' && inside(cenx, ceny)) continue;
          const ti = toneAt(tones, grid.at(k, r), cenx, ceny);
          p.fill(tones[ti]); p.triangle(ax, ay, bx, by, cx2, cy2);
        }
      }
      const size = tw * 1.25, imgs = logoTiles(tones, nT, Math.ceil(size));
      p.imageMode(p.CENTER);
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        if (p.random() > 0.13) continue;
        const x = k * half + p.random(-half * 0.45, half * 0.45);
        const y = r * th + th / 2 + p.random(-th * 0.45, th * 0.45);
        if (cfg.logo === 'knockout' && inside(x, y)) continue;
        let ti = grid.at(k, r); if (ti == null) ti = 0;
        if (p.random() < 0.45) ti = Math.min(nT - 1, ti + 1);
        const rot = p.floor(p.random(4)) * p.HALF_PI;
        p.push(); p.translate(x, y); p.rotate(rot); p.image(imgs[ti], 0, 0, size, size); p.pop();
      }
      p.imageMode(p.CORNER);
    }
    function drawMilitary(P: typeof PALETTES[string], _t: string[], _n: number, cell: number) {
      const L = P.tones.length - 1;
      const tones = [ramp(P.tones, 0), ramp(P.tones, L * 0.36), ramp(P.tones, L * 0.66), ramp(P.tones, L)];
      const nT = 4;
      const mc = cell * 4;
      const mcols = Math.ceil(W / mc), mrows = Math.ceil(H / mc);
      const macro = clusterGrid(mcols, mrows, nT);
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const tile = params.tile;
      const wx = (x: number) => (x % cols + cols) % cols, wy = (y: number) => (y % rows + rows) % rows;
      const fine = new Array(cols * rows);
      const fAt = (x: number, y: number) => { if (tile) return fine[wy(y) * cols + wx(x)]; if (x < 0 || y < 0 || x >= cols || y >= rows) return undefined; return fine[y * cols + x]; };
      const mAt = (px: number, py: number) => macro.at(Math.min(mcols - 1, Math.floor(px / mc)), Math.min(mrows - 1, Math.floor(py / mc)));
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const mt = mAt(x * cell, y * cell);
        let t; const r = p.random();
        if (r < 0.58) t = mt;
        else if (r < 0.80) t = (x > 0 || tile) ? fAt(x - 1, y) : mt;
        else if (r < 0.91) t = (y > 0 || tile) ? fAt(x, y - 1) : mt;
        else t = p.constrain(mt + p.floor(p.random(-1, 2)), 0, nT - 1);
        if (t == null || isNaN(t)) t = mt;
        fine[y * cols + x] = t;
        const cx = x * cell + cell / 2, cy = y * cell + cell / 2;
        if (cfg.logo === 'knockout' && inside(cx, cy)) continue;
        let ti = toneAt(tones, t, cx, cy); if (ti >= nT) ti = nT - 1;
        p.fill(tones[ti]); p.rect(x * cell, y * cell, cell + 0.6, cell + 0.6);
      }
      if (params.micro) {
        const h = cell / 2, n = Math.floor(cols * rows * 0.10);
        for (let i = 0; i < n; i++) {
          const gx = p.floor(p.random(cols)), gy = p.floor(p.random(rows));
          const base = fine[gy * cols + gx]; const ti = p.constrain(base + (p.random() < 0.5 ? -1 : 1), 0, nT - 1);
          const ox = p.random() < 0.5 ? 0 : h, oy = p.random() < 0.5 ? 0 : h;
          const cx = gx * cell + ox + h / 2, cy = gy * cell + oy + h / 2;
          if (cfg.logo === 'knockout' && inside(cx, cy)) continue;
          p.fill(tones[ti]); p.rect(gx * cell + ox, gy * cell + oy, h + 0.6, h + 0.6);
        }
      }
    }
  };
}

function redrawNow() { if (inst) inst.redraw(); }

function applyPreset(pr: typeof PRESETS[number]) {
  cfg.geom = pr.geom; cfg.palette = pr.palette; cfg.logo = pr.logo;
  params.cell = pr.cell; params.acc = pr.acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const any = pr as any;
  params.rl = any.rl ?? 0.34; params.rt = any.rt ?? 0.24; params.rd = any.rd ?? 0.14;
  params.micro = !!any.micro; params.logon = any.logon ?? 18;
}
function regenerate() { params.seed = Math.floor(Math.random() * 99999); }
function savePng() { if (inst) inst.saveCanvas('auxiliary-' + cfg.geom + '-' + cfg.palette + '-' + params.seed, 'png'); }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const sheeting = ref(false);
async function exportSheet() {
  if (!inst || sheeting.value) return;
  sheeting.value = true;
  for (const pr of PRESETS) { applyPreset(pr); await nextTick(); redrawNow(); await sleep(220); inst.saveCanvas('auxiliary-' + pr.name, 'png'); await sleep(450); }
  sheeting.value = false;
}

watch([cfg, params], redrawNow, { deep: true });
onMounted(() => { inst = new p5(makeSketch()); });
onBeforeUnmount(() => { inst?.remove?.(); inst = null; });
</script>

<template>
  <div data-theme="dark" class="flex min-h-dvh bg-background text-foreground">
    <!-- control panel -->
    <aside class="w-[300px] shrink-0 overflow-y-auto border-r border-border bg-card px-5 py-6 [scrollbar-width:thin]">
      <div class="border-b-2 border-primary pb-4">
        <div class="font-display text-[15px] leading-tight text-foreground">Auxiliary</div>
        <div class="mt-1 text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">Brand Pattern Generator</div>
      </div>

      <div class="mt-5 space-y-1.5">
        <div class="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">Geometry</div>
        <div class="flex flex-wrap gap-1">
          <button
v-for="g in GEOMS" :key="g.v" type="button"
            class="min-w-[54px] flex-auto border px-1.5 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors"
            :class="cfg.geom === g.v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
            @click="cfg.geom = g.v">{{ g.label }}</button>
        </div>
      </div>

      <div class="mt-5 space-y-1.5">
        <div class="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">Palette</div>
        <div class="flex flex-wrap gap-1">
          <button
v-for="pp in PAL_OPTS" :key="pp.v" type="button"
            class="min-w-[54px] flex-auto border px-1.5 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors"
            :class="cfg.palette === pp.v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
            @click="cfg.palette = pp.v">{{ pp.label }}</button>
        </div>
      </div>

      <div class="mt-5 space-y-1.5">
        <div class="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">Logo</div>
        <div class="flex flex-wrap gap-1">
          <button
v-for="lo in LOGO_OPTS" :key="lo.v" type="button"
            class="min-w-[52px] flex-auto border px-1.5 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors"
            :class="cfg.logo === lo.v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
            @click="cfg.logo = lo.v">{{ lo.label }}</button>
        </div>
      </div>

      <div class="mt-5 space-y-1.5">
        <div class="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">Presets</div>
        <div class="flex flex-wrap gap-1">
          <button
v-for="pr in PRESETS" :key="pr.name" type="button"
            class="flex-[1_1_46%] border border-border bg-background px-1.5 py-2 text-[10px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
            @click="applyPreset(pr)">{{ pr.label }}</button>
        </div>
      </div>

      <div class="mt-5 space-y-3">
        <div class="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">Controls</div>
        <div v-for="s in SLIDERS" :key="s.id" class="space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase tracking-[0.06em] text-foreground">{{ s.label }}</span>
            <span class="font-mono text-[10px] tabular-nums text-primary">{{ s.int ? (params as any)[s.id] : (params as any)[s.id].toFixed(2) }}</span>
          </div>
          <input
type="range" class="ax-range w-full" :min="s.min" :max="s.max" :step="s.step"
            :value="(params as any)[s.id]" @input="(params as any)[s.id] = parseFloat(($event.target as HTMLInputElement).value)" />
        </div>
      </div>

      <div class="mt-5 space-y-2 text-[10px] uppercase tracking-[0.08em]">
        <label class="flex cursor-pointer items-center gap-2"><input v-model="params.tile" type="checkbox" class="accent-[var(--color-primary)]" /> Seamless tile</label>
        <label class="flex cursor-pointer items-center gap-2"><input v-model="params.micro" type="checkbox" class="accent-[var(--color-primary)]" /> Micro-noise <span class="text-muted-foreground">(military)</span></label>
        <label class="flex cursor-pointer items-center gap-2"><input v-model="params.lift" type="checkbox" class="accent-[var(--color-primary)]" /> Logo lift <span class="text-muted-foreground">(peek)</span></label>
        <div class="flex items-center gap-2 pt-1">
          <span class="text-foreground">Seed</span>
          <input v-model.number="params.seed" type="number" class="w-full border border-border bg-background px-2 py-1.5 font-mono text-[11px] normal-case text-foreground" />
        </div>
      </div>

      <div class="mt-5 flex gap-2">
        <button type="button" class="flex-1 bg-primary px-2 py-2.5 text-[10px] uppercase tracking-[0.14em] text-primary-foreground hover:brightness-110" @click="regenerate">Regenerate</button>
        <button type="button" class="flex-1 border border-border px-2 py-2.5 text-[10px] uppercase tracking-[0.14em] text-foreground hover:bg-accent" @click="savePng">PNG</button>
        <button type="button" class="flex-1 border border-border px-2 py-2.5 text-[10px] uppercase tracking-[0.14em] text-foreground hover:bg-accent disabled:opacity-50" :disabled="sheeting" @click="exportSheet">{{ sheeting ? '…' : 'Sheet' }}</button>
      </div>
    </aside>

    <!-- canvas stage -->
    <main class="flex min-w-0 flex-1 items-center justify-center p-9 pb-20">
      <div ref="holder" class="ax-stage" />
    </main>
  </div>
</template>

<style scoped>
.ax-stage :deep(canvas) {
  display: block;
  max-height: 84vh;
  width: auto !important;
  height: auto;
  outline: 1px solid var(--color-border);
  box-shadow: 0 24px 80px rgb(0 0 0 / 0.6);
}
.ax-range { -webkit-appearance: none; appearance: none; height: 2px; background: var(--color-border); outline: none; }
.ax-range::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--color-primary); cursor: pointer; }
.ax-range::-moz-range-thumb { width: 12px; height: 12px; background: var(--color-primary); cursor: pointer; border: 0; }
</style>
