/* Utilitas bersama: RNG berbibit, format angka Indonesia, render rumus mini-TeX. */
(function (root) {
  'use strict';
  const SKB = (root.SKB = root.SKB || {});

  // ---------- RNG deterministik ----------
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    const r = mulberry32(typeof seed === 'number' ? seed : hashStr(String(seed)));
    const rng = () => r();
    rng.int = (a, b) => a + Math.floor(r() * (b - a + 1));
    rng.pick = (arr) => arr[Math.floor(r() * arr.length)];
    rng.step = (a, b, s) => a + s * Math.floor(r() * (Math.round((b - a) / s) + 1));
    rng.shuffle = (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    rng.sample = (arr, n) => rng.shuffle(arr).slice(0, n);
    rng.chance = (p) => r() < p;
    return rng;
  }

  // ---------- Format angka (desimal koma) ----------
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function supNum(n) { return String(n).split('').map((c) => SUP[c] || c).join(''); }
  function round(x, d) { const p = Math.pow(10, d); return Math.round(x * p) / p; }
  function trimZeros(s) { return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
  function groupThousands(intPart) { return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  /** fmt(x, sig): angka dengan maksimal `sig` angka penting, koma desimal, notasi ilmiah bila perlu. */
  function fmt(x, sig) {
    sig = sig || 3;
    if (!isFinite(x)) return String(x);
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e6 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = x / Math.pow(10, e);
      m = Number(m.toPrecision(sig));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      const ms = trimZeros(String(m)).replace('.', ',');
      return (ms === '1' ? '' : ms === '-1' ? '-' : ms + ' × ') + '10' + supNum(e);
    }
    let s;
    if (Number.isInteger(x) && ax < 1e6) s = String(x);
    else s = trimZeros(Number(x.toPrecision(sig)).toFixed(Math.max(0, sig - 1 - Math.floor(Math.log10(ax)))));
    const neg = s[0] === '-';
    if (neg) s = s.slice(1);
    const [ip, dp] = s.split('.');
    const out = (ip.length > 4 ? groupThousands(ip) : ip) + (dp ? ',' + dp : '');
    return (neg ? '−' : '') + out;
  }
  function pct(x, d) { return fmt(round(x, d == null ? 1 : d), 4) + '%'; }

  // ---------- Mini-TeX → HTML ----------
  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', Gamma: 'Γ', delta: 'δ', Delta: 'Δ', epsilon: 'ε', varepsilon: 'ε',
    eta: 'η', theta: 'θ', Theta: 'Θ', lambda: 'λ', Lambda: 'Λ', mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ',
    sigma: 'σ', Sigma: 'Σ', tau: 'τ', phi: 'φ', Phi: 'Φ', omega: 'ω', Omega: 'Ω', chi: 'χ', psi: 'ψ',
    cdot: '·', times: '×', div: '÷', approx: '≈', to: '→', rightarrow: '→', Rightarrow: '⇒', iff: '⇔',
    infty: '∞', pm: '±', propto: '∝', ge: '≥', le: '≤', geq: '≥', leq: '≤', neq: '≠', ne: '≠',
    degree: '°', circ: '°', sum: 'Σ', int: '∫', partial: '∂', ell: 'ℓ', hbar: 'ħ', quad: ' ',
    ',': ' ', ';': ' ', '%': '%', minus: '−', parallel: '∥', perp: '⊥', angle: '∠', sim: '∼',
    lt: '&lt;', gt: '&gt;', dots: '…', ldots: '…', cos: 'cos', sin: 'sin', tan: 'tan', log: 'log', ln: 'ln',
  };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function texToHtml(src) {
    let i = 0;
    function group() {
      // membaca {…} atau satu token
      while (src[i] === ' ') i++;
      if (src[i] === '{') {
        i++;
        const out = seq('}');
        i++; // '}'
        return out;
      }
      return atom();
    }
    function atom() {
      const c = src[i];
      if (c === '\\') {
        i++;
        let m = /^[A-Za-z]+/.exec(src.slice(i));
        let name;
        if (m) { name = m[0]; i += name.length; } else { name = src[i]; i++; }
        switch (name) {
          case 'frac': case 'tfrac': case 'dfrac': {
            const a = group(), b = group();
            return '<span class="tx-frac"><span class="tx-num">' + a + '</span><span class="tx-den">' + b + '</span></span>';
          }
          case 'sqrt': {
            let idx = '';
            if (src[i] === '[') { const j = src.indexOf(']', i); idx = '<sup class="tx-root">' + esc(src.slice(i + 1, j)) + '</sup>'; i = j + 1; }
            return idx + '<span class="tx-sqrt"><span class="tx-rad">√</span><span class="tx-under">' + group() + '</span></span>';
          }
          case 'vec': return '<span class="tx-vec">' + group() + '</span>';
          case 'bar': case 'overline': return '<span class="tx-bar">' + group() + '</span>';
          case 'text': case 'mathrm': case 'rm': return '<span class="tx-text">' + group() + '</span>';
          case 'left': case 'right': case 'big': case 'Big': return '';
          default:
            if (GREEK[name] != null) {
              const fn = /^(cos|sin|tan|log|ln)$/.test(name);
              return fn ? '<span class="tx-fn">' + GREEK[name] + '</span>' : GREEK[name];
            }
            return esc('\\' + name);
        }
      }
      i++;
      if (/[A-Za-z]/.test(c)) return '<i>' + c + '</i>';
      if (c === '*') return '·';
      if (c === '-') return '−';
      if (c === '=' || c === '+' || c === '−') return '<span class="tx-op">' + c + '</span>';
      return esc(c);
    }
    function seq(end) {
      let out = '';
      while (i < src.length && src[i] !== end) {
        const c = src[i];
        if (c === '^' || c === '_') {
          i++;
          const g = group();
          out += c === '^' ? '<sup>' + g + '</sup>' : '<sub>' + g + '</sub>';
        } else if (c === '=' ) { i++; out += '<span class="tx-op">=</span>'; }
        else if (c === '+') { i++; out += '<span class="tx-op">+</span>'; }
        else if (c === ' ') { i++; out += ' '; }
        else out += atom();
      }
      return out;
    }
    try { return seq(undefined); } catch (e) { return esc(src); }
  }
  /** Mengganti $…$ dalam teks menjadi rumus ter-render. Teks di luar $ dibiarkan (boleh HTML). */
  function rich(s) {
    if (s == null) return '';
    return String(s).replace(/\$([^$]+)\$/g, (_, t) => '<span class="tx">' + texToHtml(t) + '</span>');
  }

  SKB.util = { hashStr, makeRng, fmt, pct, round, supNum, texToHtml, rich, esc };
})(typeof window !== 'undefined' ? window : globalThis);
