/* ===== stats.js : special functions and distribution objects shared by Modules 1-3 ===== */
'use strict';
function lgamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1; const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  let a = c[0]; const t = x + g + 0.5; for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function gammaFn(x) { if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFn(1 - x)); return Math.exp(lgamma(x)); }
function erfc(x) { const z = Math.abs(x), t = 1 / (1 + 0.5 * z); const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
const Phi = z => 0.5 * erfc(-z / Math.SQRT2);
const phiPdf = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
function phiInv(p) { // Acklam
  if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00], b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01], c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00], d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const pl = 0.02425; let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
const rnorm = () => { let u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const rweib = (b, e, g) => (g || 0) + e * Math.pow(-Math.log(1 - Math.random()), 1 / b);
function simpson(f, a, b, n) { n = n || 2000; if (n % 2) n++; const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
function modes(a) { const m = new Map(); a.forEach(x => m.set(x, (m.get(x) || 0) + 1)); let mx = 0; m.forEach(v => { if (v > mx) mx = v; }); return mx < 2 ? [] : [...m].filter(e => e[1] === mx).map(e => e[0]).sort((x, y) => x - y); }
const variancePop = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) * (x - m), 0) / a.length; };
const varianceSamp = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1); };
function parseNums(t) { return String(t).split(/[\s,;]+/).map(Number).filter(x => isFinite(x) && x !== null).filter((x, i, arr) => true); }
function lbinom(n, k) { return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1); }
const binomPmf = (n, p, k) => (k < 0 || k > n) ? 0 : p <= 0 ? (k === 0 ? 1 : 0) : p >= 1 ? (k === n ? 1 : 0) : Math.exp(lbinom(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
const poisPmf = (m, k) => k < 0 ? 0 : Math.exp(-m + k * Math.log(m) - lgamma(k + 1));
/* exact median rank: p such that P(Bin(n,p) >= j) = 0.5 */
function medianRankExact(j, n) { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const p = (lo + hi) / 2; let s = 0; for (let k = j; k <= n; k++) s += binomPmf(n, p, k); if (s < 0.5) lo = p; else hi = p; } return (lo + hi) / 2; }
const bernardRank = (j, n) => (j - 0.3) / (n + 0.4);

/* ---------- life distributions: pdf f, cdf F, reliability R, hazard h, moments ---------- */
const DIST = {
  exponential: p => ({ name: 'Exponential', f: t => t < (p.g || 0) ? 0 : p.l * Math.exp(-p.l * (t - (p.g || 0))), F: t => t < (p.g || 0) ? 0 : 1 - Math.exp(-p.l * (t - (p.g || 0))), R: t => t < (p.g || 0) ? 1 : Math.exp(-p.l * (t - (p.g || 0))), h: t => t < (p.g || 0) ? 0 : p.l, mean: (p.g || 0) + 1 / p.l, var: 1 / (p.l * p.l), q: u => (p.g || 0) - Math.log(1 - u) / p.l, rnd: () => (p.g || 0) + rexp(p.l) }),
  weibull: p => { const b = p.b, e = p.e, g = p.g || 0; return { name: 'Weibull', f: t => t <= g ? (b < 1 && t === g ? Infinity : (b === 1 ? 1 / e : 0)) : (b / e) * Math.pow((t - g) / e, b - 1) * Math.exp(-Math.pow((t - g) / e, b)), F: t => t <= g ? 0 : 1 - Math.exp(-Math.pow((t - g) / e, b)), R: t => t <= g ? 1 : Math.exp(-Math.pow((t - g) / e, b)), h: t => t <= g ? (b === 1 ? 1 / e : (b < 1 ? Infinity : 0)) : (b / e) * Math.pow((t - g) / e, b - 1), mean: g + e * gammaFn(1 / b + 1), var: e * e * (gammaFn(1 + 2 / b) - Math.pow(gammaFn(1 + 1 / b), 2)), median: g + e * Math.pow(Math.LN2, 1 / b), q: u => g + e * Math.pow(-Math.log(1 - u), 1 / b), rnd: () => rweib(b, e, g) }; },
  normal: p => ({ name: 'Normal', f: t => phiPdf((t - p.m) / p.s) / p.s, F: t => Phi((t - p.m) / p.s), R: t => 0.5 * erfc((t - p.m) / (p.s * Math.SQRT2)), h: t => { const R = 0.5 * erfc((t - p.m) / (p.s * Math.SQRT2)); return R < 1e-300 ? Infinity : phiPdf((t - p.m) / p.s) / p.s / R; }, mean: p.m, var: p.s * p.s, median: p.m, q: u => p.m + p.s * phiInv(u), rnd: () => p.m + p.s * rnorm() }),
  lognormal: p => ({ name: 'Log-normal', f: t => t <= 0 ? 0 : Math.exp(-Math.pow(Math.log(t) - p.m, 2) / (2 * p.s * p.s)) / (t * p.s * Math.sqrt(2 * Math.PI)), F: t => t <= 0 ? 0 : Phi((Math.log(t) - p.m) / p.s), R: t => t <= 0 ? 1 : 0.5 * erfc((Math.log(t) - p.m) / (p.s * Math.SQRT2)), h: t => { if (t <= 0) return 0; const R = 0.5 * erfc((Math.log(t) - p.m) / (p.s * Math.SQRT2)); return R < 1e-300 ? Infinity : Math.exp(-Math.pow(Math.log(t) - p.m, 2) / (2 * p.s * p.s)) / (t * p.s * Math.sqrt(2 * Math.PI)) / R; }, mean: Math.exp(p.m + p.s * p.s / 2), var: (Math.exp(p.s * p.s) - 1) * Math.exp(2 * p.m + p.s * p.s), median: Math.exp(p.m), q: u => Math.exp(p.m + p.s * phiInv(u)), rnd: () => Math.exp(p.m + p.s * rnorm()) }),
  uniform: p => ({ name: 'Uniform', f: t => (t >= p.a && t <= p.b) ? 1 / (p.b - p.a) : 0, F: t => clamp((t - p.a) / (p.b - p.a), 0, 1), R: t => 1 - clamp((t - p.a) / (p.b - p.a), 0, 1), h: t => (t >= p.a && t < p.b) ? 1 / (p.b - t) : 0, mean: (p.a + p.b) / 2, var: Math.pow(p.b - p.a, 2) / 12, median: (p.a + p.b) / 2, q: u => p.a + u * (p.b - p.a), rnd: () => p.a + Math.random() * (p.b - p.a) })
};
/* hazard-model helpers: R(t) = exp(-∫h) */
const cumHaz = (h, t) => t <= 0 ? 0 : simpson(h, 0, t, 400);

/* ---------- small DOM / formatting helpers used by M1-M3 ---------- */
const el = id => document.getElementById(id);
const on = (id, ev, fn) => { const e = el(id); if (e) e.addEventListener(ev, fn); };
function parseFrac(s) { s = String(s).trim(); if (!s) return NaN; if (s.includes('/')) { const [a, b] = s.split('/'); return parseFloat(a) / parseFloat(b); } return parseFloat(s); }
function parseList(t) { return String(t).split(/[\s,;]+/).filter(Boolean).map(parseFrac).filter(x => isFinite(x)); }
function fracStr(x, maxDen) { // nearest simple fraction, '' if none close enough
  maxDen = maxDen || 600; let best = ''; for (let d = 1; d <= maxDen; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) { best = n + '/' + d; break; } } return best;
}
function mkPlot(id, o) { return new Plot(el(id), o); }
const f4 = x => (isFinite(x) ? (Math.abs(x) < 1e-3 && x !== 0 ? sci(x, 3) : x.toFixed(4)) : '—');
const f3 = x => isFinite(x) ? x.toFixed(3) : '—';
const f2 = x => isFinite(x) ? x.toFixed(2) : '—';
const nice = x => isFinite(x) ? (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? sci(x, 4) : String(+x.toPrecision(6))) : '—';
