// Resolves the Tokens Studio JSON in themes/ to final colours per theme (Node 18+, no dependencies).
// Supports {a.b} and $a.b references, rgba({ref}, {ref}) expressions and Tokens Studio colour modifiers
// (lighten / darken / alpha / mix in hsl, lch or srgb), following the Tokens Studio formulas.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const THEMES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'themes');
const J = (p) => JSON.parse(readFileSync(join(THEMES_DIR, p), 'utf8'));

// ---------- colour maths ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export function parseColor(s) {
  s = String(s).trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (m) { let h = m[1]; if (h.length <= 4) h = [...h].map((c) => c + c).join(''); const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255; return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }; }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+%?))?\s*\)$/i.exec(s);
  if (m) { const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]); return { r: m[1] / 255, g: m[2] / 255, b: m[3] / 255, a }; }
  m = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+%?))?\s*\)$/i.exec(s);
  if (m) { const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]); return { ...hslToRgb({ h: +m[1], s: +m[2], l: +m[3] }), a }; }
  return null;
}
export const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(clamp(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
function rgbToHsl({ r, g, b }) { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return { h, s: s * 100, l: l * 100 }; }
function hslToRgb({ h, s, l }) { s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return { r: f(0), g: f(8), b: f(4) }; }
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4), gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const mul = (m, v) => m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
const RGB2XYZ = [[0.41239079926595934, 0.357584339383878, 0.1804807884018343], [0.21263900587151027, 0.715168678767756, 0.07219231536073371], [0.01933081871559182, 0.11919477979462598, 0.9505321522496607]];
const XYZ2RGB = [[3.2409699419045226, -1.537383177570094, -0.4986107602930034], [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559], [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]];
const D65toD50 = [[1.0479298208405488, 0.022946793341019088, -0.05019222954313557], [0.029627815688159344, 0.990434484573249, -0.01707382502938514], [-0.009243058152591178, 0.015055144896577895, 0.7518742899580008]];
const D50toD65 = [[0.9554734527042182, -0.023098536874261423, 0.0632593086610217], [-0.028369706963208136, 1.0099954580058226, 0.021041398966943008], [0.012314001688319899, -0.020507696433477912, 1.3303659366080753]];
const D50 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585], eps = 216 / 24389, kap = 24389 / 27;
function rgbToLch(c) { const xyz = mul(D65toD50, mul(RGB2XYZ, [lin(c.r), lin(c.g), lin(c.b)])); const f = xyz.map((v, i) => { const x = v / D50[i]; return x > eps ? Math.cbrt(x) : (kap * x + 16) / 116; }); const L = 116 * f[1] - 16, A = 500 * (f[0] - f[1]), B = 200 * (f[1] - f[2]); let H = Math.atan2(B, A) * 180 / Math.PI; if (H < 0) H += 360; return { l: L, c: Math.hypot(A, B), h: H }; }
function lchToRgb({ l, c, h }) { const A = c * Math.cos(h * Math.PI / 180), B = c * Math.sin(h * Math.PI / 180); const fy = (l + 16) / 116, fx = A / 500 + fy, fz = fy - B / 200; const xyz = [fx ** 3 > eps ? fx ** 3 : (116 * fx - 16) / kap, l > kap * eps ? ((l + 16) / 116) ** 3 : l / kap, fz ** 3 > eps ? fz ** 3 : (116 * fz - 16) / kap].map((v, i) => v * D50[i]); const rgb = mul(XYZ2RGB, mul(D50toD65, xyz)).map(gam); return { r: rgb[0], g: rgb[1], b: rgb[2] }; }
export function modify(col, mod, num) {
  const amount = num(mod.value), space = mod.space || 'srgb', out = { ...col };
  if (mod.type === 'alpha') return { ...col, a: amount };
  if (mod.type === 'mix') { const other = mod.color; const t = amount; return { r: col.r + (other.r - col.r) * t, g: col.g + (other.g - col.g) * t, b: col.b + (other.b - col.b) * t, a: col.a }; }
  const up = mod.type === 'lighten';
  if (space === 'hsl') { const h = rgbToHsl(col); h.l = up ? Math.min(100, h.l + (100 - h.l) * amount) : Math.max(0, h.l - h.l * amount); return { ...hslToRgb(h), a: col.a }; }
  if (space === 'lch') { const l = rgbToLch(col); l.c = Math.max(0, l.c - amount * l.c); l.l = up ? Math.min(100, l.l + (100 - l.l) * amount) : Math.max(0, l.l - l.l * amount); return { ...lchToRgb(l), a: col.a }; }
  for (const k of ['r', 'g', 'b']) out[k] = up ? col[k] + (1 - col[k]) * amount : col[k] - col[k] * amount; return out;
}

// ---------- token sets and themes ----------
function flatten(obj, prefix = '', out = {}) { for (const [k, v] of Object.entries(obj)) { if (v && typeof v === 'object' && 'value' in v) out[prefix + k] = v; else if (v && typeof v === 'object') flatten(v, prefix + k + '.', out); } return out; }
export function loadSets() { const meta = J('$metadata.json'); return Object.fromEntries(meta.tokenSetOrder.map((s) => [s, flatten(J(s + '.json'))])); }
export function loadThemes() { return J('$themes.json'); }
export function resolver(sets, enabledSets) {
  // later sets override earlier ones, in $metadata order
  const order = JSON.parse(readFileSync(join(THEMES_DIR, '$metadata.json'), 'utf8')).tokenSetOrder.filter((s) => enabledSets.includes(s));
  const all = {}; for (const s of order) Object.assign(all, sets[s]);
  const memo = new Map();
  const refName = (s) => { s = String(s).trim(); let m = /^\{([^}]+)\}$/.exec(s); if (m) return m[1]; m = /^\$([\w.-]+)$/.exec(s); return m ? m[1] : null; };
  const num = (v) => { if (typeof v === 'number') return v; const r = refName(v); if (r) return num(resolve(r).raw); return parseFloat(v); };
  function resolve(name, stack = []) {
    if (memo.has(name)) return memo.get(name);
    const t = all[name]; if (!t) return { error: 'missing ' + name };
    if (stack.includes(name)) return { error: 'cycle ' + name };
    let out;
    const v = t.value, ref = refName(v);
    if (ref) { const r = resolve(ref, [...stack, name]); out = r.error ? r : { ...r, raw: r.raw, chain: [name, ...(r.chain || [])] }; }
    else if (typeof v === 'string' && /^rgba\(/i.test(v.trim()) && /[{$]/.test(v)) {
      const parts = v.trim().replace(/^rgba\(/i, '').replace(/\)$/, '').split(',').map((x) => x.trim());
      const base = resolve(refName(parts[0]) || parts[0], [...stack, name]);
      out = base.error ? base : { color: { ...base.color, a: num(parts[1]) }, raw: v, chain: [name, ...(base.chain || [])] };
    } else { const c = parseColor(v); out = c ? { color: c, raw: v, chain: [name] } : { raw: v, chain: [name], nonColour: true }; }
    const mod = t.$extensions && t.$extensions['studio.tokens'] && t.$extensions['studio.tokens'].modify;
    if (mod && out.color) { const m = { ...mod }; if (m.type === 'mix') { const mc = refName(m.color) ? resolve(refName(m.color)).color : parseColor(m.color); m.color = mc; } out = { ...out, color: modify(out.color, m, num), modified: mod }; }
    memo.set(name, out); return out;
  }
  return { resolve, tokens: all };
}
