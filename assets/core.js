/* ===== core.js : helpers, canvas plotter, reliability maths shared by all modules ===== */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* number formatting */
function fx(x, d) { // fixed, trimmed trailing zeros handled by caller choice
  if (x === Infinity) return '∞';
  if (!isFinite(x)) return '—';
  return x.toFixed(d === undefined ? 4 : d);
}
function sci(x, d) {
  if (!isFinite(x)) return '—';
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -3 && e <= 5) return (+x.toPrecision(d || 3)).toString();
  const m = x / Math.pow(10, e);
  return m.toFixed((d || 3) - 1) + '×10' + String(e).replace('-', '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
}
function fR(x) { if (!isFinite(x)) return '—'; return (x > 0.9995 && x < 1) ? x.toFixed(6) : x.toFixed(4); }
const pct = (x, d) => (100 * x).toFixed(d === undefined ? 2 : d) + '%';

/* ---------- controls: slider + number box ---------- */
function ctl(id, label, min, max, step, val, unit) {
  return `<label class="ctl"><span>${label}</span>` +
    `<input type="range" data-r="${id}" min="${min}" max="${max}" step="${step}" value="${val}">` +
    `<input type="number" id="${id}" data-n="${id}" step="${step}" value="${val}">` +
    `<span class="un">${unit || ''}</span></label>`;
}
function V(id) { const e = document.getElementById(id); return e ? parseFloat(e.value) : NaN; }
function setV(id, v) {
  const n = document.getElementById(id); if (!n) return;
  n.value = v;
  const r = document.querySelector(`input[data-r="${id}"]`);
  if (r) { if (v > +r.max) r.max = v; if (v < +r.min) r.min = v; r.value = v; }
}
function wire(root, cb) {
  root.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset && t.dataset.r) { const n = document.getElementById(t.dataset.r); n.value = t.value; cb(e); }
    else if (t.dataset && t.dataset.n) { const r = root.querySelector(`input[data-r="${t.dataset.n}"]`); if (r) { if (+t.value > +r.max) r.max = t.value; r.value = t.value; } cb(e); }
    else if (t.matches('[data-live]')) cb(e);
  });
  root.addEventListener('change', e => { if (e.target.matches('[data-live]')) cb(e); });
}
function setOut(id, html, cls) {
  const e = document.getElementById(id); if (!e) return;
  e.innerHTML = html; if (cls !== undefined) e.className = 'out ' + cls;
}
function outBox(id, label) { return `<div class="out" id="${id}"><b>—</b><span>${label}</span></div>`; }
function setBox(id, value, label, cls) {
  const e = document.getElementById(id); if (!e) return;
  e.className = 'out' + (cls ? ' ' + cls : '');
  e.innerHTML = `<b>${value}</b><span>${label}</span>`;
}
function card(id, num, title, body, chips) {
  return `<article class="card" id="${id}"><h2><span class="num">${num}</span>${title} ${chips || ''}</h2>${body}</article>`;
}
const CH = {
  lec: '<span class="chip lec" title="numbers printed on the teacher\'s slides">LECTURE</span>',
  demo: '<span class="chip demo" title="numbers made up for practice">DEMO</span>',
  mse: '<span class="chip mse" title="from the SH 2026 mid-sem solution">MSE</span>',
  pred: '<span class="chip pred" title="syllabus topic, thin in the slides">SYLLABUS</span>'
};

/* ---------- seeded-free random helpers ---------- */
function rexp(rate) { return -Math.log(1 - Math.random()) / rate; }

/* ---------- maths ---------- */
function nCr(n, k) { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
function binomTerm(n, i, R) { return nCr(n, i) * Math.pow(R, i) * Math.pow(1 - R, n - i); }
function kOutOfN(n, k, R) { let s = 0; for (let i = k; i <= n; i++) s += binomTerm(n, i, R); return s; }
/* P(at least k successes) for independent, non-identical p[] (Poisson-binomial DP) */
function atLeastK(p, k) {
  const n = p.length; let dp = new Array(n + 1).fill(0); dp[0] = 1;
  for (const pi of p) { for (let j = n; j >= 0; j--) dp[j] = dp[j] * (1 - pi) + (j > 0 ? dp[j - 1] * pi : 0); }
  let s = 0; for (let j = k; j <= n; j++) s += dp[j]; return clamp(s, 0, 1);
}
function exactlyK(p, k) {
  const n = p.length; let dp = new Array(n + 1).fill(0); dp[0] = 1;
  for (const pi of p) { for (let j = n; j >= 0; j--) dp[j] = dp[j] * (1 - pi) + (j > 0 ? dp[j - 1] * pi : 0); }
  return dp[k] || 0;
}

/* ---------- Plot : tiny canvas chart (no libraries) ---------- */
const PLOTS = [];
class Plot {
  constructor(canvas, o) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.o = Object.assign({ xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: '', ylabel: '', xfmt: null, yfmt: null }, o || {});
    this.series = []; this.marks = []; this.vlines = []; this.hx = null;
    const mv = e => {
      const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e;
      this.hx = t.clientX - r.left; this.draw();
    };
    canvas.addEventListener('mousemove', mv);
    canvas.addEventListener('touchstart', mv, { passive: true });
    canvas.addEventListener('touchmove', mv, { passive: true });
    canvas.addEventListener('mouseleave', () => { this.hx = null; this.draw(); });
    PLOTS.push(this);
  }
  set(series, opts) {
    this.series = series || [];
    if (opts) { this.marks = opts.marks || []; this.vlines = opts.vlines || []; Object.assign(this.o, opts.axes || {}); }
    this.draw();
  }
  draw() {
    const c = this.c, W = c.clientWidth, H = c.clientHeight; if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const g = this.ctx; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const o = this.o;
    g.font = '12px system-ui,sans-serif';
    // legend layout
    const names = this.series.filter(s => s.name);
    let lx = 8, ly = 14, rows = 1; const items = [];
    for (const s of names) { const w = g.measureText(s.name).width + 30; if (lx + w > W - 8) { lx = 8; ly += 16; rows++; } items.push([s, lx, ly]); lx += w + 6; }
    const L = 46, R = 12, T = 8 + rows * 16, B = 34;
    const pw = W - L - R, ph = H - T - B;
    const X = x => L + (x - o.xmin) / (o.xmax - o.xmin) * pw;
    const Y = y => T + ph - (y - o.ymin) / (o.ymax - o.ymin) * ph;
    // grid + axes
    g.strokeStyle = '#e6eaf3'; g.fillStyle = '#5b6783'; g.lineWidth = 1;
    const tx = niceTicks(o.xmin, o.xmax, Math.max(3, Math.floor(pw / 90))), ty = niceTicks(o.ymin, o.ymax, 5);
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (const v of tx.ticks) { const x = X(v); g.beginPath(); g.moveTo(x, T); g.lineTo(x, T + ph); g.stroke(); g.fillText(o.xfmt ? o.xfmt(v) : tickFmt(v, tx.step), x, T + ph + 4); }
    g.textAlign = 'right'; g.textBaseline = 'middle';
    for (const v of ty.ticks) { const y = Y(v); g.beginPath(); g.moveTo(L, y); g.lineTo(L + pw, y); g.stroke(); g.fillText(o.yfmt ? o.yfmt(v) : tickFmt(v, ty.step), L - 5, y); }
    g.strokeStyle = '#9aa6bf'; g.beginPath(); g.moveTo(L, T); g.lineTo(L, T + ph); g.lineTo(L + pw, T + ph); g.stroke();
    g.fillStyle = '#334155'; g.textAlign = 'center'; g.textBaseline = 'bottom';
    if (o.xlabel) g.fillText(o.xlabel, L + pw / 2, H - 2);
    if (o.ylabel) { g.save(); g.translate(11, T + ph / 2); g.rotate(-Math.PI / 2); g.textBaseline = 'top'; g.fillText(o.ylabel, 0, -4); g.restore(); }
    // clip & series
    g.save(); g.beginPath(); g.rect(L, T - 2, pw, ph + 4); g.clip();
    for (const vl of this.vlines) {
      const x = X(vl.x); g.strokeStyle = vl.color || '#888'; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(x, T); g.lineTo(x, T + ph); g.stroke(); g.setLineDash([]);
      if (vl.label) { g.fillStyle = vl.color || '#555'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(vl.label, x + 4, T + 2); }
    }
    for (const s of this.series) {
      const pts = this.pointsOf(s); if (!pts.length) continue;
      if (s.bars) { const hw = (s.bw || 0.8) / 2; g.fillStyle = s.color || '#2457d6'; g.globalAlpha = 0.78; for (const p of pts) { const x0 = X(p[0] - hw), x1 = X(p[0] + hw), y = Y(p[1]); g.fillRect(x0, y, Math.max(1, x1 - x0 - 1), Y(Math.max(0, o.ymin)) - y); } g.globalAlpha = 1; continue; }
      g.strokeStyle = s.color || '#2457d6'; g.lineWidth = s.width || 2; g.setLineDash(s.dash || []);
      if (s.fill) { g.fillStyle = s.fill; g.beginPath(); g.moveTo(X(pts[0][0]), Y(0)); for (const p of pts) g.lineTo(X(p[0]), Y(p[1])); g.lineTo(X(pts[pts.length - 1][0]), Y(0)); g.closePath(); g.fill(); }
      if (!s.nolines) { g.beginPath(); pts.forEach((p, i) => { const x = X(p[0]), y = Y(p[1]); if (i) { if (s.step) g.lineTo(x, Y(pts[i - 1][1])); g.lineTo(x, y); } else g.moveTo(x, y); }); g.stroke(); } g.setLineDash([]);
      if (s.dots) { g.fillStyle = s.color; for (const p of pts) { g.beginPath(); g.arc(X(p[0]), Y(p[1]), 3.5, 0, 7); g.fill(); } }
    }
    g.restore();
    for (const m of this.marks) {
      const x = X(m.x), y = Y(m.y); g.fillStyle = m.color || '#d23b3b'; g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill();
      if (m.label) { g.fillStyle = '#1b2437'; g.textAlign = x > W - 120 ? 'right' : 'left'; g.textBaseline = 'bottom'; g.fillText(m.label, x + (x > W - 120 ? -7 : 7), y - 4); }
    }
    // legend
    g.lineWidth = 2; g.textAlign = 'left'; g.textBaseline = 'middle';
    for (const [s, x, y] of items) { g.strokeStyle = s.color || '#2457d6'; g.setLineDash(s.dash || []); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20, y); g.stroke(); g.setLineDash([]); g.fillStyle = '#1b2437'; g.fillText(s.name, x + 24, y); }
    // hover
    if (this.hx !== null && this.hx >= L && this.hx <= L + pw) {
      const xv = o.xmin + (this.hx - L) / pw * (o.xmax - o.xmin);
      g.strokeStyle = '#64748b'; g.lineWidth = 1; g.beginPath(); g.moveTo(this.hx, T); g.lineTo(this.hx, T + ph); g.stroke();
      const lines = [(o.xlabel ? o.xlabel.split(' ')[0] : 'x') + ' = ' + tickFmt(xv, (o.xmax - o.xmin) / 400)];
      for (const s of names) { const yv = this.valueAt(s, xv); if (yv !== null) lines.push(s.name + ': ' + (Math.abs(yv) < 0.001 && yv !== 0 ? yv.toExponential(2) : yv.toFixed(4))); }
      const bw = Math.max(...lines.map(t => g.measureText(t).width)) + 12, bh = lines.length * 15 + 6;
      let bx = this.hx + 10; if (bx + bw > W - 4) bx = this.hx - bw - 10; const by = T + 4;
      g.fillStyle = 'rgba(255,255,255,.95)'; g.strokeStyle = '#94a3b8'; g.beginPath(); g.rect(bx, by, bw, bh); g.fill(); g.stroke();
      g.fillStyle = '#0f172a'; g.textAlign = 'left'; g.textBaseline = 'top'; lines.forEach((t, i) => g.fillText(t, bx + 6, by + 4 + i * 15));
    }
  }
  pointsOf(s) {
    if (s.pts) return s.pts;
    const o = this.o, n = 240, out = [];
    for (let i = 0; i <= n; i++) { const x = o.xmin + (o.xmax - o.xmin) * i / n; const y = s.f(x); if (isFinite(y)) out.push([x, y]); }
    return out;
  }
  valueAt(s, x) {
    if (s.f) return s.f(x);
    const p = s.pts; if (!p || !p.length) return null;
    if (x <= p[0][0]) return p[0][1]; if (x >= p[p.length - 1][0]) return p[p.length - 1][1];
    let lo = 0, hi = p.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p[m][0] <= x) lo = m; else hi = m; }
    if (s.step) return p[lo][1];
    const t = (x - p[lo][0]) / (p[hi][0] - p[lo][0] || 1); return p[lo][1] + t * (p[hi][1] - p[lo][1]);
  }
  static redrawAll() { PLOTS.forEach(p => p.draw()); }
}
function niceTicks(min, max, n) {
  const span = max - min; if (!(span > 0)) return { ticks: [min], step: 1 };
  const raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), nm = raw / mag;
  const step = (nm < 1.5 ? 1 : nm < 3 ? 2 : nm < 7 ? 5 : 10) * mag, ticks = [];
  for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + step * 1e-6; v += step) ticks.push(+v.toPrecision(12));
  return { ticks, step };
}
function tickFmt(v, step) {
  if (v === 0) return '0';
  const a = Math.abs(v); if (a >= 1e6 || a < 1e-4) return v.toExponential(1);
  const d = Math.min(6, Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
  return v.toFixed(d);
}
window.addEventListener('resize', () => Plot.redrawAll());

/* ---------- RBD tree: evaluation, lifetimes, drawing ---------- */
/* node: {t:'blk',name,R}  |  {t:'grp',type:'series'|'parallel'|'kofn',k,ch:[...]} */
function rbdEval(n, tau) {   // tau = mission-time multiplier (R_i^tau  ⇒ exponential with R_i at tau=1)
  if (n.t === 'blk') { const R = clamp(n.R, 0, 1); return tau === 1 ? R : Math.pow(R, tau); }
  const rs = n.ch.map(c => rbdEval(c, tau));
  if (!rs.length) return 1;
  if (n.type === 'series') return rs.reduce((a, b) => a * b, 1);
  if (n.type === 'parallel') return 1 - rs.reduce((a, b) => a * (1 - b), 1);
  return atLeastK(rs, clamp(Math.round(n.k), 1, rs.length));
}
function rbdLife(n) { // one random lifetime (in units of mission time), blocks exponential with R at tau=1
  if (n.t === 'blk') { const R = n.R; if (R >= 1) return Infinity; if (R <= 0) return 0; return Math.log(1 - Math.random()) / Math.log(R); }
  const ls = n.ch.map(rbdLife); if (!ls.length) return Infinity;
  if (n.type === 'series') return Math.min(...ls);
  if (n.type === 'parallel') return Math.max(...ls);
  ls.sort((a, b) => b - a); return ls[clamp(Math.round(n.k), 1, ls.length) - 1];
}
function rbdCount(n) { return n.t === 'blk' ? 1 : n.ch.reduce((a, c) => a + rbdCount(c), 0); }
function rbdClone(n) { return JSON.parse(JSON.stringify(n)); }

const BW = 78, BH = 38, GX = 22, GY = 12;
function rbdLayout(n) {
  if (n.t === 'blk') return { w: BW, h: BH, n, kids: [] };
  const kids = n.ch.map(rbdLayout);
  if (!kids.length) return { w: BW, h: BH, n, kids, empty: true };
  if (n.type === 'series') {
    const w = kids.reduce((a, k) => a + k.w, 0) + GX * (kids.length - 1), h = Math.max(...kids.map(k => k.h));
    return { w, h, n, kids };
  }
  const top = n.type === 'kofn' ? 16 : 0;
  const w = Math.max(...kids.map(k => k.w)) + 2 * GX, h = kids.reduce((a, k) => a + k.h, 0) + GY * (kids.length - 1) + top;
  return { w, h, n, kids, top };
}
function rbdDraw(l, x, y) { // returns svg fragment; entry/exit at (x, y+h/2) and (x+w, y+h/2)
  const n = l.n, cy = y + l.h / 2;
  if (n.t === 'blk') {
    const lab = esc((n.name || '').slice(0, 11));
    return `<g><rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="7" fill="#eaf0ff" stroke="#2457d6" stroke-width="1.5"/>` +
      `<text x="${x + BW / 2}" y="${y + 15}" text-anchor="middle" font-size="11" font-weight="700" fill="#14224a">${lab}</text>` +
      `<text x="${x + BW / 2}" y="${y + 29}" text-anchor="middle" font-size="11" fill="#334155">R=${(+n.R).toFixed(+n.R < 0.99 ? 3 : 4).replace(/0+$/, '').replace(/\.$/, '')}</text></g>`;
  }
  if (l.empty) return `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="7" fill="none" stroke="#aaa" stroke-dasharray="4"/><text x="${x + BW / 2}" y="${cy + 4}" text-anchor="middle" font-size="11" fill="#888">empty</text>`;
  let s = '';
  if (n.type === 'series') {
    let cx = x;
    l.kids.forEach((k, i) => {
      const ky = y + (l.h - k.h) / 2; s += rbdDraw(k, cx, ky);
      if (i < l.kids.length - 1) s += `<line x1="${cx + k.w}" y1="${cy}" x2="${cx + k.w + GX}" y2="${cy}" stroke="#334155" stroke-width="1.6"/>`;
      cx += k.w + GX;
    });
    return s;
  }
  const top = l.top || 0; let ky = y + top;
  const lx = x + GX / 2 + 2, rx = x + l.w - GX / 2 - 2; const mids = [];
  const innerW = l.w - 2 * GX;
  l.kids.forEach(k => {
    const kx = x + GX + (innerW - k.w) / 2; s += rbdDraw(k, kx, ky); const my = ky + k.h / 2; mids.push(my);
    s += `<line x1="${lx}" y1="${my}" x2="${kx}" y2="${my}" stroke="#334155" stroke-width="1.6"/><line x1="${kx + k.w}" y1="${my}" x2="${rx}" y2="${my}" stroke="#334155" stroke-width="1.6"/>`;
    ky += k.h + GY;
  });
  s += `<line x1="${lx}" y1="${mids[0]}" x2="${lx}" y2="${mids[mids.length - 1]}" stroke="#334155" stroke-width="1.6"/><line x1="${rx}" y1="${mids[0]}" x2="${rx}" y2="${mids[mids.length - 1]}" stroke="#334155" stroke-width="1.6"/>`;
  s += `<line x1="${x}" y1="${cy}" x2="${lx}" y2="${cy}" stroke="#334155" stroke-width="1.6"/><line x1="${rx}" y1="${cy}" x2="${x + l.w}" y2="${cy}" stroke="#334155" stroke-width="1.6"/>`;
  if (n.type === 'kofn') s += `<rect x="${x + 2}" y="${y}" width="${l.w - 4}" height="${l.h}" rx="9" fill="none" stroke="#7a3fd1" stroke-dasharray="5 3"/><text x="${x + l.w / 2}" y="${y + 12}" text-anchor="middle" font-size="11" font-weight="700" fill="#7a3fd1">${n.k}-out-of-${n.ch.length}</text>`;
  return s;
}
function rbdSVG(root) {
  const l = rbdLayout(root), pad = 26, W = l.w + 2 * pad + 36, H = l.h + 28;
  const y0 = 14, cy = y0 + l.h / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui,sans-serif">` +
    `<text x="4" y="${cy + 4}" font-size="10" fill="#475569">IN</text><line x1="20" y1="${cy}" x2="${pad}" y2="${cy}" stroke="#334155" stroke-width="1.6"/>` +
    rbdDraw(l, pad, y0) +
    `<line x1="${pad + l.w}" y1="${cy}" x2="${pad + l.w + 14}" y2="${cy}" stroke="#334155" stroke-width="1.6"/><text x="${pad + l.w + 16}" y="${cy + 4}" font-size="10" fill="#475569">OUT</text></svg>`;
}

/* ---------- generic path helpers for tree editors ---------- */
function nodeAt(root, path) { let n = root; for (const i of path) n = n.ch[i]; return n; }
function parsePath(s) { return s === '' ? [] : s.split('.').map(Number); }
