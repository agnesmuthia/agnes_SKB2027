/* Inti bank soal: pendaftaran template generator dan pembangunan bank deterministik. */
(function (root) {
  'use strict';
  const SKB = (root.SKB = root.SKB || {});
  const U = SKB.util;

  const SECTIONS = {
    pedagogik: { name: 'Pedagogik', group: 'teknis' },
    profesional: { name: 'Profesional Fisika', group: 'teknis' },
    rumus: { name: 'Latihan Rumus', group: 'rumus' },
    manajerial: { name: 'Manajerial', group: 'manajerial' },
    sosiokultural: { name: 'Sosiokultural', group: 'sosiokultural' },
    wawancara: { name: 'Wawancara', group: 'wawancara' },
  };

  const PED_TOPICS = {
    'teori-belajar': 'Teori Belajar & Perkembangan',
    'karakteristik': 'Karakteristik Peserta Didik',
    'model': 'Model & Strategi Pembelajaran',
    'kurikulum': 'Kurikulum Merdeka & Perencanaan',
    'asesmen': 'Asesmen & Evaluasi',
    'diferensiasi': 'Pembelajaran Berdiferensiasi',
    'miskonsepsi': 'Miskonsepsi & Perubahan Konseptual',
    'tpack': 'TPACK, Media & Laboratorium Virtual',
    'praktikum': 'Keterampilan Proses Sains & Praktikum',
    'kelas': 'Pengelolaan Kelas & Komunikasi',
    'refleksi': 'Refleksi, PTK & Pengembangan Profesi',
  };

  const templates = [];
  function add(t) {
    if (!t.id || !t.gen) throw new Error('template tidak lengkap');
    templates.push(Object.assign({ level: 'C3', count: 30, formulas: [] }, t));
  }

  const FILL = [2, 0.5, 1.5, 0.75, 4, 0.25, 3, 1.25, 0.8, 1.2, 10, 0.1, 0.6, 1.6, 5, 0.2];
  function numericOptions(r, ans, wrong, unit, sig) {
    sig = sig || 3;
    const u = unit ? ' ' + unit : '';
    const f = (v) => U.fmt(v, sig) + u;
    const correct = f(ans);
    const seen = new Set([correct]);
    const opts = [];
    const tryAdd = (v) => {
      if (opts.length >= 4 || typeof v !== 'number' || !isFinite(v)) return;
      if (ans > 0 && v <= 0) return;
      const s = f(v);
      if (seen.has(s)) return;
      seen.add(s); opts.push(s);
    };
    (wrong || []).forEach(tryAdd);
    for (let i = 0; opts.length < 4 && i < FILL.length; i++) tryAdd(ans * FILL[(i + r.int(0, FILL.length - 1)) % FILL.length]);
    for (let i = 2; opts.length < 4 && i < 50; i++) tryAdd(ans * (1 + i * 0.13));
    const base = Math.abs(ans) || Math.max(1, ...(wrong || []).map((w) => Math.abs(w) || 0));
    for (let i = 1; opts.length < 4 && i < 20; i++) { tryAdd(ans + base * i * 0.5); tryAdd(ans - base * i * 0.5); }
    const all = r.shuffle([correct].concat(opts));
    return { options: all, answer: all.indexOf(correct) };
  }
  function textOptions(r, correct, wrong) {
    const uniq = [];
    wrong.forEach((w) => { if (w !== correct && uniq.indexOf(w) < 0) uniq.push(w); });
    const picked = r.sample(uniq, 4);
    if (picked.length < 4) throw new Error('opsi pengecoh kurang: ' + correct);
    const all = r.shuffle([correct].concat(picked));
    return { options: all, answer: all.indexOf(correct) };
  }
  /** Untuk opsi yang urutannya bermakna (mis. A–E urut angka) gunakan fixed: true. */
  function finalize(t, k, r, out) {
    let o;
    if (out.options) o = { options: out.options, answer: out.answer, scores: out.scores };
    else if (typeof out.ans === 'number') o = numericOptions(r, out.ans, out.wrong, out.unit, out.sig);
    else o = textOptions(r, out.correct, out.wrong);
    return {
      id: t.id + '-' + k,
      tpl: t.id,
      sec: t.sec,
      topic: out.topic || t.topic,
      level: out.level || t.level,
      formulas: out.formulas || t.formulas,
      q: out.q,
      options: o.options,
      answer: o.answer,
      scores: o.scores || null,
      explain: out.explain || '',
      svg: out.svg || '',
    };
  }

  let BANK = null;
  function build() {
    if (BANK) return BANK;
    const list = [];
    const byId = {};
    templates.forEach((t) => {
      const seenQ = new Set();
      let made = 0;
      for (let k = 0; made < t.count && k < t.count * 4; k++) {
        const r = U.makeRng(t.id + ':' + k);
        let out;
        try { out = t.gen(r, k); } catch (e) { if (root.SKB_DEBUG) throw e; continue; }
        if (!out) continue;
        const key = out.key || out.q;
        if (seenQ.has(key)) continue;
        seenQ.add(key);
        let item;
        try { item = finalize(t, made, r, out); } catch (e) { if (root.SKB_DEBUG) console.warn(t.id, e.message); continue; }
        list.push(item);
        byId[item.id] = item;
        made++;
      }
      t.made = made;
    });
    BANK = { list, byId, templates };
    return BANK;
  }

  SKB.bank = { SECTIONS, PED_TOPICS, add, build, templates, numericOptions, textOptions };
})(typeof window !== 'undefined' ? window : globalThis);
