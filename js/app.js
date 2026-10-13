/* Aplikasi SKB Fisika 2027: navigasi, latihan harian, simulasi CAT, latihan topik, rumus, riwayat, pengaturan. */
(function () {
  'use strict';
  const U = SKB.util;
  const F = U.fmt;
  const rich = U.rich;
  const esc = U.esc;
  const BANK = SKB.bank.build();
  const SECS = SKB.bank.SECTIONS;
  const SJT = { manajerial: 1, sosiokultural: 1, wawancara: 1 };
  const LETTERS = 'ABCDE';

  // ---------- Nama topik ----------
  const TOPIC_NAME = {};
  SKB.FORMULA_CHAPTERS.forEach((c) => { TOPIC_NAME['profesional:' + c.id] = c.bab; TOPIC_NAME['rumus:' + c.id] = c.bab; });
  Object.entries(SKB.bank.PED_TOPICS).forEach(([k, v]) => { TOPIC_NAME['pedagogik:' + k] = v; });
  const topicName = (sec, t) => TOPIC_NAME[sec + ':' + t] || (t.charAt(0).toUpperCase() + t.slice(1));
  const BY_SEC = {};
  BANK.list.forEach((q) => { (BY_SEC[q.sec] = BY_SEC[q.sec] || []).push(q); });
  const TOPICS_OF = (sec) => {
    const m = {};
    (BY_SEC[sec] || []).forEach((q) => { m[q.topic] = (m[q.topic] || 0) + 1; });
    return Object.keys(m).map((t) => ({ id: t, n: m[t], name: topicName(sec, t) }));
  };

  // ---------- Preset ujian ----------
  const PRESETS = {
    teknis: { name: 'Simulasi SKB Kompetensi Teknis', short: 'Teknis', desc: 'Pedagogik dan profesional fisika dalam satu sesi CAT. Benar bernilai 5, salah atau kosong bernilai 0.', parts: [['pedagogik', 40], ['profesional', 60]], minutes: 100 },
    lengkap: { name: 'Simulasi Lengkap Seleksi Kompetensi Guru', short: 'Lengkap', desc: 'Format seleksi kompetensi guru: teknis, manajerial, sosiokultural, dan wawancara. Bagian nonteknis dinilai 1–4 per opsi.', parts: [['pedagogik', 40], ['profesional', 60], ['manajerial', 25], ['sosiokultural', 20], ['wawancara', 10]], minutes: 150 },
    mini: { name: 'Mini Simulasi', short: 'Mini', desc: 'Pemanasan cepat dengan irama waktu yang sama (1 menit per soal).', parts: [['pedagogik', 10], ['profesional', 15]], minutes: 25 },
    pedagogik: { name: 'Fokus Pedagogik', short: 'Pedagogik', desc: 'Skenario pembelajaran fisika: model, asesmen, diferensiasi, miskonsepsi, kurikulum.', parts: [['pedagogik', 50]], minutes: 50 },
    profesional: { name: 'Fokus Profesional Fisika', short: 'Profesional', desc: 'Soal fisika HOTS: hitungan, grafik, perbandingan, dan analisis konsep.', parts: [['profesional', 50]], minutes: 60 },
  };
  const DEF_SETTINGS = {
    theme: 'auto', targetDate: '', targetTeknisPct: 65, targetMS: 130, targetW: 24, dailySize: 20,
    presets: Object.fromEntries(Object.entries(PRESETS).map(([k, p]) => [k, { parts: p.parts.map((x) => x[1]), minutes: p.minutes }])),
  };

  // ---------- Penyimpanan ----------
  const KEY = 'skbfis.v1';
  function fresh() { return { v: 1, q: {}, history: [], daily: {}, dailyItems: {}, wrong: [], flash: {}, settings: JSON.parse(JSON.stringify(DEF_SETTINGS)), session: null }; }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const base = fresh();
        const out = Object.assign(base, s);
        out.settings = Object.assign(base.settings, s.settings || {});
        out.settings.presets = Object.assign(JSON.parse(JSON.stringify(DEF_SETTINGS.presets)), (s.settings || {}).presets || {});
        return out;
      }
    } catch (e) { /* penyimpanan tidak tersedia */ }
    return fresh();
  }
  let S = load();
  let storageOk = true;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); storageOk = true; } catch (e) { storageOk = false; }
  }

  // ---------- Utilitas ----------
  const $ = (sel, el) => (el || document).querySelector(sel);
  const view = $('#view');
  const todayKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fmtTime = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(s).padStart(2, '0'); };
  const fmtDate = (ts) => new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDateTime = (ts) => new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function modal(title, html, onMount) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    $('#modal').hidden = false;
    if (onMount) onMount($('#modalBody'));
    setTimeout(() => $('#modalClose').focus(), 0);
  }
  function closeModal() { $('#modal').hidden = true; }
  $('#modalClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  function confirmBox(title, msg, okLabel, onOk, danger) {
    modal(title, `<p>${msg}</p><div class="row"><button class="btn ${danger ? 'danger' : 'primary'}" id="cOk">${okLabel}</button><button class="btn ghost" id="cNo">Batal</button></div>`, (b) => {
      $('#cOk', b).addEventListener('click', () => { closeModal(); onOk(); });
      $('#cNo', b).addEventListener('click', closeModal);
    });
  }

  // ---------- Statistik ----------
  function stat(id) { return S.q[id] || [0, 0, -1]; }
  function record(id, ok) {
    const s = S.q[id] || [0, 0, -1];
    s[0]++; if (ok) s[1]++; s[2] = ok ? 1 : 0;
    S.q[id] = s;
    const wi = S.wrong.indexOf(id);
    if (ok && wi >= 0) S.wrong.splice(wi, 1);
    if (!ok && wi < 0) { S.wrong.push(id); if (S.wrong.length > 400) S.wrong.shift(); }
  }
  function topicStats(sec) {
    const m = {};
    (BY_SEC[sec] || []).forEach((q) => {
      const s = S.q[q.id];
      if (!s) return;
      const t = (m[q.topic] = m[q.topic] || { a: 0, c: 0, seen: 0 });
      t.a += s[0]; t.c += s[1]; t.seen++;
    });
    return m;
  }
  function totals() {
    let a = 0, c = 0, seen = 0;
    Object.entries(S.q).forEach(([id, s]) => { const q = BANK.byId[id]; if (!q || SJT[q.sec]) return; a += s[0]; c += s[1]; seen++; });
    return { a, c, seen };
  }
  function streakInfo() {
    let streak = 0;
    const d = new Date();
    if (!S.daily[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (S.daily[todayKey(d)]) { streak++; d.setDate(d.getDate() - 1); }
    return streak;
  }

  // ---------- Pemilihan soal ----------
  function interleave(arr, keyFn, r) {
    const groups = {};
    arr.forEach((x) => { const k = keyFn(x); (groups[k] = groups[k] || []).push(x); });
    const keys = r.shuffle(Object.keys(groups));
    const out = [];
    let left = true;
    while (left) {
      left = false;
      for (const k of keys) { const g = groups[k]; if (g.length) { out.push(g.shift()); left = true; } }
    }
    return out;
  }
  function pick(sec, n, topics, r, exclude) {
    let pool = (BY_SEC[sec] || []).filter((q) => (!topics || topics.indexOf(q.topic) >= 0) && !(exclude && exclude.has(q.id)));
    pool = r.shuffle(pool).sort((a, b) => stat(a.id)[0] - stat(b.id)[0]);
    if (SJT[sec]) return pool.slice(0, n).map((q) => q.id);
    const byTopic = {};
    pool.forEach((q) => { (byTopic[q.topic] = byTopic[q.topic] || []).push(q); });
    Object.keys(byTopic).forEach((t) => { byTopic[t] = interleave(byTopic[t], (q) => q.tpl, r); });
    const tkeys = r.shuffle(Object.keys(byTopic));
    const out = [];
    while (out.length < n) {
      let added = false;
      for (const t of tkeys) {
        if (out.length >= n) break;
        const q = byTopic[t].shift();
        if (q) { out.push(q.id); added = true; }
      }
      if (!added) break;
    }
    return r.shuffle(out);
  }

  // ---------- Sesi ----------
  function newSession(o) {
    const r = U.makeRng(o.seed || Date.now());
    let items = o.items;
    if (!items) {
      items = [];
      const ex = new Set();
      o.parts.forEach(([sec, n, topics]) => { const ids = pick(sec, n, topics, r, ex); ids.forEach((id) => ex.add(id)); items = items.concat(ids); });
    }
    if (!items.length) { toast('Tidak ada soal yang cocok dengan pilihan ini.'); return; }
    S.session = {
      id: 's' + Date.now(), kind: o.kind, title: o.title, preset: o.preset || null, items, answers: {}, flags: {}, revealed: {},
      idx: 0, start: Date.now(), deadline: o.minutes ? Date.now() + o.minutes * 60000 : null, minutes: o.minutes || null, instant: !!o.instant, date: o.date || null,
    };
    save();
    go('ujian');
  }
  function startGuarded(o) {
    if (S.session && Object.keys(S.session.answers).length) {
      confirmBox('Sesi sebelumnya belum selesai', `Anda masih memiliki sesi "${esc(S.session.title)}". Memulai sesi baru akan menghapus sesi tersebut tanpa menyimpan nilainya.`, 'Mulai sesi baru', () => newSession(o), true);
    } else newSession(o);
  }
  function startPreset(key) {
    const p = PRESETS[key], cfg = S.settings.presets[key];
    startGuarded({ kind: 'sim', preset: key, title: p.name, parts: p.parts.map((x, i) => [x[0], cfg.parts[i]]), minutes: cfg.minutes });
  }
  function dailyItems() {
    const dk = todayKey();
    if (S.dailyItems[dk]) return S.dailyItems[dk];
    const r = U.makeRng('harian:' + dk);
    const n = S.settings.dailySize || 20;
    const ped = Math.round(n * 0.4), rum = Math.max(1, Math.round(n * 0.1)), pro = n - ped - rum;
    const ex = new Set();
    let items = [];
    [['pedagogik', ped], ['profesional', pro], ['rumus', rum]].forEach(([s, k]) => { const ids = pick(s, k, null, r, ex); ids.forEach((id) => ex.add(id)); items = items.concat(ids); });
    S.dailyItems = {}; S.dailyItems[dk] = items; save();
    return items;
  }
  function startDaily() {
    if (S.session && S.session.kind === 'daily' && S.session.date === todayKey()) { go('ujian'); return; }
    startGuarded({ kind: 'daily', title: 'Latihan Harian ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }), items: dailyItems(), instant: true, date: todayKey() });
  }

  // ---------- Penilaian ----------
  function scoreSession(sess) {
    const groups = {};
    const g = (k, label) => (groups[k] = groups[k] || { label, n: 0, correct: 0, answered: 0, score: 0, max: 0 });
    const topics = {};
    sess.items.forEach((id, i) => {
      const q = BANK.byId[id];
      if (!q) return;
      const a = sess.answers[i];
      const answered = a != null;
      if (SJT[q.sec]) {
        const G = g(q.sec, SECS[q.sec].name);
        G.n++; G.max += 4; if (answered) { G.answered++; G.score += q.scores[a]; if (q.scores[a] === 4) G.correct++; }
      } else {
        const key = q.sec === 'rumus' ? 'rumus' : 'teknis';
        const G = g(key, key === 'rumus' ? 'Latihan Rumus' : 'Kompetensi Teknis');
        const ok = answered && a === q.answer;
        G.n++; G.max += 5; if (answered) G.answered++; if (ok) { G.correct++; G.score += 5; }
        const tk = q.sec + ':' + q.topic;
        const T = (topics[tk] = topics[tk] || { sec: q.sec, topic: q.topic, n: 0, c: 0 });
        T.n++; if (ok) T.c++;
        const sk = 'sub:' + q.sec;
        const SG = g(sk, SECS[q.sec].name); SG.n++; SG.max += 5; if (answered) SG.answered++; if (ok) { SG.correct++; SG.score += 5; }
      }
    });
    const st = S.settings;
    const pass = {};
    if (groups.teknis) pass.teknis = groups.teknis.score >= Math.ceil((st.targetTeknisPct / 100) * groups.teknis.max);
    if (groups.manajerial && groups.sosiokultural) {
      const max = groups.manajerial.max + groups.sosiokultural.max;
      pass.ms = groups.manajerial.score + groups.sosiokultural.score >= Math.ceil((st.targetMS / 180) * max);
    }
    if (groups.wawancara) pass.w = groups.wawancara.score >= Math.ceil((st.targetW / 40) * groups.wawancara.max);
    return { groups, topics, pass };
  }
  function finishSession(auto) {
    const sess = S.session;
    if (!sess) return;
    clearInterval(timerId);
    if (!sess.instant) sess.items.forEach((id, i) => { const q = BANK.byId[id]; const a = sess.answers[i]; if (q && !SJT[q.sec] && a != null) record(id, a === q.answer); });
    const res = scoreSession(sess);
    const used = Math.round(((sess.deadline ? Math.min(Date.now(), sess.deadline) : Date.now()) - sess.start) / 1000);
    const entry = { id: sess.id, ts: Date.now(), kind: sess.kind, title: sess.title, preset: sess.preset, items: sess.items, answers: sess.answers, used, minutes: sess.minutes, res: { groups: res.groups, pass: res.pass }, auto: !!auto };
    S.history.unshift(entry);
    S.history.forEach((h, i) => { if (i >= 40) { delete h.items; delete h.answers; } });
    if (S.history.length > 300) S.history.length = 300;
    if (sess.kind === 'daily') {
      let c = 0, tot = 0;
      Object.entries(res.groups).forEach(([k, x]) => { if (!k.startsWith('sub:')) { c += x.correct; tot += x.n; } });
      S.daily[sess.date || todayKey()] = { c, n: tot };
    }
    S.session = null;
    S.viewResult = entry.id;
    save();
    if (auto) toast('Waktu habis. Jawaban dikumpulkan otomatis.');
    go('hasil');
  }

  // ---------- Navigasi ----------
  const ROUTES = [
    ['beranda', 'Beranda', '⌂'], ['harian', 'Harian', '☀'], ['simulasi', 'Simulasi', '⏱'], ['topik', 'Topik', '☰'], ['rumus', 'Rumus', 'ƒ'],
    ['pedagogik', 'Ringkasan', '✎'], ['riwayat', 'Riwayat', '↗'], ['pengaturan', 'Pengaturan', '⚙'],
  ];
  const BOTTOM = ['beranda', 'harian', 'simulasi', 'rumus', 'riwayat'];
  function renderNav(cur) {
    $('#nav').innerHTML = ROUTES.map(([k, l]) => `<a href="#${k}"${k === cur ? ' aria-current="page"' : ''}>${l}</a>`).join('');
    $('#bottomnav').innerHTML = BOTTOM.map((k) => { const r = ROUTES.find((x) => x[0] === k); return `<a href="#${k}"${k === cur ? ' aria-current="page"' : ''}><span aria-hidden="true">${r[2]}</span>${r[1]}</a>`; }).join('');
  }
  function go(route) { if (location.hash === '#' + route) render(); else location.hash = route; }
  let timerId = null;
  function render() {
    clearInterval(timerId);
    const route = (location.hash || '#beranda').slice(1) || 'beranda';
    document.body.classList.toggle('exam-mode', route === 'ujian');
    renderNav(route === 'ujian' || route === 'hasil' ? '' : route);
    const fn = { beranda: vBeranda, harian: vHarian, simulasi: vSimulasi, topik: vTopik, rumus: vRumus, pedagogik: vPedagogik, riwayat: vRiwayat, pengaturan: vPengaturan, ujian: vUjian, hasil: vHasil }[route] || vBeranda;
    fn();
    if (route !== 'ujian') window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);

  // ---------- Tema ----------
  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }
  $('#themeBtn').addEventListener('click', () => {
    const dark = S.settings.theme === 'dark' || (S.settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    S.settings.theme = dark ? 'light' : 'dark';
    save(); applyTheme();
  });

  // ---------- Komponen ----------
  function formulaCard(it, opts) {
    opts = opts || {};
    return `<article class="fcard">
      <div class="card-head"><h3>${esc(it.n)}</h3>${opts.chapter ? `<span class="chip">${esc(SKB.FORMULA_CHAPTERS.find((c) => c.id === it.ch).bab)}</span>` : ''}</div>
      <div class="formula"><span class="tx">${U.texToHtml(it.f)}</span></div>
      <dl>
        ${it.k ? `<div><dt>Keterangan</dt><dd>${rich(it.k)}</dd></div>` : ''}
        ${it.c ? `<div><dt>Konsep</dt><dd>${rich(it.c)}</dd></div>` : ''}
        ${it.t ? `<div><dt>Tips & jebakan soal</dt><dd>${rich(it.t)}</dd></div>` : ''}
      </dl>
      ${opts.practice ? `<div class="row"><button class="btn sm" data-act="practice-ch" data-ch="${it.ch}">Latihan soal bab ini</button></div>` : ''}
    </article>`;
  }
  function openFormula(id) {
    const it = SKB.FORMULA_INDEX[id];
    if (!it) return;
    modal('Rumus terkait', formulaCard(it, { chapter: true }));
  }
  function formulaChips(q) {
    if (!q.formulas || !q.formulas.length) return '';
    return `<div class="formula-chips"><span class="label">Rumus terkait</span>${q.formulas.map((f) => SKB.FORMULA_INDEX[f] ? `<button class="chip accent" data-act="formula" data-id="${f}">ƒ ${esc(SKB.FORMULA_INDEX[f].n)}</button>` : '').join('')}</div>`;
  }
  function sectionLabel(q) { return q.sec === 'pedagogik' || q.sec === 'profesional' ? 'Teknis · ' + SECS[q.sec].name : SECS[q.sec].name; }
  function optionsHtml(q, chosen, reveal) {
    return q.options.map((o, j) => {
      let cls = '';
      if (reveal) {
        if (q.scores) cls = q.scores[j] === 4 ? 'correct' : j === chosen ? 'wrong' : '';
        else cls = j === q.answer ? 'correct' : j === chosen ? 'wrong' : '';
      }
      const sc = reveal && q.scores ? `<span class="chip ${q.scores[j] === 4 ? 'ok' : ''} score">skor ${q.scores[j]}</span>` : '';
      return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${j === chosen}" data-act="choose" data-j="${j}"${reveal ? ' disabled' : ''}><span class="key">${LETTERS[j]}</span><span class="txt">${rich(o)}${sc}</span></button>`;
    }).join('');
  }
  function explainHtml(q, chosen) {
    let cls = '', head = 'Pembahasan';
    if (q.scores) { const s = chosen != null ? q.scores[chosen] : 0; head = chosen == null ? 'Tidak dijawab (skor 0)' : `Skor jawaban Anda: ${s} dari 4`; cls = s === 4 ? 'ok' : s >= 3 ? '' : 'bad'; }
    else if (chosen != null) { const ok = chosen === q.answer; cls = ok ? 'ok' : 'bad'; head = ok ? 'Benar' : `Kurang tepat. Jawaban benar: ${LETTERS[q.answer]}`; }
    else { cls = 'bad'; head = `Tidak dijawab. Jawaban benar: ${LETTERS[q.answer]}`; }
    return `<div class="explain ${cls}"><h3>${head}</h3><div>${rich(q.explain)}</div>${formulaChips(q)}</div>`;
  }

  // ---------- Beranda ----------
  function vBeranda() {
    const tot = totals();
    const dk = todayKey();
    const doneToday = S.daily[dk];
    const streak = streakInfo();
    const sims = S.history.filter((h) => h.kind === 'sim' && h.res.groups.teknis);
    const last = sims[0];
    const best = sims.reduce((b, h) => Math.max(b, pct(h.res.groups.teknis.score, h.res.groups.teknis.max)), 0);
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = todayKey(d); days.push(`<i class="${S.daily[k] ? 'on' : ''} ${i === 0 ? 'today' : ''}" title="${k}${S.daily[k] ? ': ' + S.daily[k].c + '/' + S.daily[k].n + ' benar' : ''}"></i>`); }
    const allF = []; SKB.FORMULA_CHAPTERS.forEach((c) => c.items.forEach((it) => allF.push(it)));
    const fToday = allF[U.hashStr('rumus:' + dk) % allF.length];
    const weak = [];
    ['pedagogik', 'profesional'].forEach((sec) => { const ts = topicStats(sec); Object.entries(ts).forEach(([t, v]) => { if (v.a >= 3) weak.push({ sec, t, p: v.c / v.a, a: v.a }); }); });
    weak.sort((a, b) => a.p - b.p);
    let countdown = '';
    if (S.settings.targetDate) {
      const diff = Math.ceil((new Date(S.settings.targetDate + 'T00:00:00') - new Date()) / 86400000);
      countdown = diff >= 0 ? `<span class="chip accent">${diff} hari menuju SKB</span>` : '';
    }
    const counts = { pedagogik: (BY_SEC.pedagogik || []).length, profesional: (BY_SEC.profesional || []).length, rumus: (BY_SEC.rumus || []).length, sjt: (BY_SEC.manajerial || []).length + (BY_SEC.sosiokultural || []).length + (BY_SEC.wawancara || []).length };
    view.innerHTML = `
      <section class="hero">
        <div class="hero-main">
          <div class="row">${countdown}<span class="chip">${streak ? '🔥 ' + streak + ' hari beruntun' : 'Mulai rantai belajar hari ini'}</span></div>
          <h1>${doneToday ? 'Latihan hari ini selesai.' : 'Siap berlatih hari ini?'}</h1>
          <p>${doneToday ? `Skor latihan harian: ${doneToday.c} dari ${doneToday.n} benar. Lanjutkan dengan simulasi atau ulangi soal yang salah.` : `${S.settings.dailySize} soal campuran pedagogik, profesional, dan rumus. Pembahasan muncul setelah setiap jawaban.`}</p>
          <div class="row">
            <button class="btn primary" data-act="daily">${doneToday ? 'Lihat lagi latihan harian' : S.session && S.session.kind === 'daily' ? 'Lanjutkan latihan harian' : 'Mulai latihan harian'}</button>
            <a class="btn ghost" href="#simulasi">Simulasi SKB</a>
          </div>
          <div class="streak" aria-label="Aktivitas 14 hari terakhir">${days.join('')}</div>
        </div>
        <div class="card raised">
          <span class="label">Rumus hari ini</span>
          <h3>${esc(fToday.n)}</h3>
          <div class="fcard" style="padding:0;border:0"><div class="formula"><span class="tx">${U.texToHtml(fToday.f)}</span></div></div>
          <p class="small muted">${rich(fToday.c || fToday.k)}</p>
          <div class="row"><button class="btn sm" data-act="formula" data-id="${fToday.id}">Buka kartu rumus</button><a class="btn sm ghost" href="#rumus">Semua rumus</a></div>
        </div>
      </section>
      ${S.session ? `<div class="card raised"><div class="card-head"><div><span class="label">Sesi berjalan</span><h3>${esc(S.session.title)}</h3></div><button class="btn primary" data-act="resume">Lanjutkan</button></div><p class="small muted">${Object.keys(S.session.answers).length} dari ${S.session.items.length} soal terjawab${S.session.deadline ? ' · sisa waktu ' + fmtTime((S.session.deadline - Date.now()) / 1000) : ''}</p></div>` : ''}
      <section class="grid cols-4">
        <div class="card"><div class="stat"><span class="v">${tot.seen}</span><span class="k">soal berbeda dikerjakan</span></div></div>
        <div class="card"><div class="stat"><span class="v">${tot.a ? pct(tot.c, tot.a) + '%' : '–'}</span><span class="k">akurasi keseluruhan</span></div></div>
        <div class="card"><div class="stat"><span class="v">${last ? last.res.groups.teknis.score : '–'}</span><span class="k">skor teknis simulasi terakhir${last ? ' (maks ' + last.res.groups.teknis.max + ')' : ''}</span></div></div>
        <div class="card"><div class="stat"><span class="v">${sims.length ? best + '%' : '–'}</span><span class="k">capaian simulasi terbaik</span></div></div>
      </section>
      <section class="grid cols-2">
        <div class="card">
          <div class="card-head"><h2>Topik yang perlu dikuatkan</h2><a class="small" href="#riwayat">Lihat semua</a></div>
          ${weak.length ? `<div class="topic-list">${weak.slice(0, 5).map((w) => `<button class="topic" data-act="practice-topic" data-sec="${w.sec}" data-topic="${w.t}"><span class="name">${esc(topicName(w.sec, w.t))}</span><span class="num small">${Math.round(w.p * 100)}%</span><span class="bar ${w.p < 0.5 ? 'bad' : w.p < 0.7 ? 'flag' : 'ok'}"><i style="width:${Math.round(w.p * 100)}%"></i></span></button>`).join('')}</div>` : '<p class="empty">Kerjakan beberapa latihan dulu. Topik dengan akurasi terendah akan muncul di sini.</p>'}
          ${S.wrong.length ? `<button class="btn" data-act="retry">Ulangi ${S.wrong.length} soal yang pernah salah</button>` : ''}
        </div>
        <div class="card">
          <h2>Isi bank soal</h2>
          <table><tbody>
            <tr><td>Pedagogik (skenario pembelajaran fisika)</td><td class="n">${F(counts.pedagogik)}</td></tr>
            <tr><td>Profesional fisika (hitungan, grafik, HOTS)</td><td class="n">${F(counts.profesional)}</td></tr>
            <tr><td>Latihan rumus</td><td class="n">${F(counts.rumus)}</td></tr>
            <tr><td>Manajerial, sosiokultural, wawancara</td><td class="n">${F(counts.sjt)}</td></tr>
            <tr><th>Total</th><th class="n">${F(BANK.list.length)}</th></tr>
          </tbody></table>
          <p class="small muted">Soal hitungan dibangkitkan dari templat berparameter, sehingga angka dan konteks bervariasi. Setiap soal memiliki pembahasan langkah demi langkah.</p>
        </div>
      </section>
      ${storageOk ? '' : '<p class="note">Penyimpanan peramban tidak tersedia. Progres tidak akan tersimpan setelah halaman ditutup.</p>'}`;
  }

  // ---------- Harian ----------
  function vHarian() {
    const dk = todayKey();
    const done = S.daily[dk];
    const items = dailyItems();
    const comp = {};
    items.forEach((id) => { const q = BANK.byId[id]; if (q) comp[q.sec] = (comp[q.sec] || 0) + 1; });
    const past = Object.entries(S.daily).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 10);
    view.innerHTML = `
      <div class="page-head"><span class="label">${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span><h1>Latihan Harian</h1>
      <p>Set soal yang sama sepanjang hari ini, dipilih dari soal yang paling jarang Anda kerjakan. Setiap jawaban langsung diberi pembahasan dan rumus terkait.</p></div>
      <div class="card raised">
        <div class="row">${Object.entries(comp).map(([s, n]) => `<span class="chip">${SECS[s].name}: ${n}</span>`).join('')}<span class="chip">Tanpa batas waktu</span></div>
        ${done ? `<p><b>Sudah selesai hari ini:</b> ${done.c} dari ${done.n} benar (${pct(done.c, done.n)}%).</p>` : ''}
        <div class="row"><button class="btn primary" data-act="daily">${done ? 'Kerjakan ulang' : S.session && S.session.kind === 'daily' ? 'Lanjutkan' : 'Mulai'}</button>${S.wrong.length ? `<button class="btn" data-act="retry">Ulangi soal salah (${S.wrong.length})</button>` : ''}</div>
      </div>
      <div class="card"><h2>Catatan harian</h2>${past.length ? `<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th class="n">Benar</th><th class="n">Akurasi</th></tr></thead><tbody>${past.map(([d, v]) => `<tr><td>${new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</td><td class="n">${v.c}/${v.n}</td><td class="n">${pct(v.c, v.n)}%</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Belum ada catatan. Latihan pertama Anda akan tercatat di sini.</p>'}</div>`;
  }

  // ---------- Simulasi ----------
  function vSimulasi() {
    const st = S.settings;
    view.innerHTML = `
      <div class="page-head"><h1>Simulasi SKB</h1>
      <p>Ruang ujian bergaya CAT: hitung mundur, panel nomor soal, tanda ragu-ragu, dan pengumpulan otomatis saat waktu habis. Pembahasan baru terbuka setelah ujian selesai.</p></div>
      <div class="grid cols-2">${Object.entries(PRESETS).map(([k, p]) => {
        const cfg = st.presets[k];
        const n = cfg.parts.reduce((a, b) => a + b, 0);
        const max = p.parts.reduce((s, [sec], i) => s + cfg.parts[i] * (SJT[sec] ? 4 : 5), 0);
        return `<button class="preset" data-act="preset" data-key="${k}">
          <span class="meta">${k === 'teknis' ? '<span class="chip accent">Disarankan</span>' : ''}${p.parts.map(([sec], i) => `<span class="chip">${SECS[sec].name} ${cfg.parts[i]}</span>`).join('')}</span>
          <h3>${p.name}</h3><span class="small muted">${p.desc}</span>
          <span class="facts"><span><b>${n}</b><span>soal</span></span><span><b>${cfg.minutes}</b><span>menit</span></span><span><b>${max}</b><span>skor maks</span></span></span>
        </button>`;
      }).join('')}</div>
      <div class="card">
        <h2>Aturan penilaian</h2>
        <ul>
          <li><b>Kompetensi teknis</b> (pedagogik dan profesional): benar = 5, salah atau kosong = 0. Target pribadi Anda saat ini ${st.targetTeknisPct}% dari skor maksimum.</li>
          <li><b>Manajerial dan sosiokultural</b>: setiap opsi bernilai 1–4. Acuan ambang batas gabungan ${st.targetMS} (dari maks 180).</li>
          <li><b>Wawancara</b>: setiap opsi bernilai 1–4. Acuan ambang batas ${st.targetW} (dari maks 40).</li>
        </ul>
        <p class="note">Jumlah soal, durasi, dan ambang batas mengikuti format seleksi kompetensi guru tahun-tahun sebelumnya. Ketentuan resmi 2027 dapat berbeda; sesuaikan di <a href="#pengaturan">Pengaturan</a> begitu pengumuman resmi terbit.</p>
      </div>`;
  }

  // ---------- Latihan topik ----------
  let topicUI = { sec: 'profesional', topics: [], n: 20, mode: 'instant' };
  function vTopik() {
    const T = topicUI;
    const list = TOPICS_OF(T.sec);
    const ts = topicStats(T.sec);
    view.innerHTML = `
      <div class="page-head"><h1>Latihan per Topik</h1><p>Pilih bagian dan satu atau beberapa topik. Tanpa pilihan topik, soal diambil merata dari semua topik.</p></div>
      <div class="card raised">
        <div class="row"><span class="label">Bagian</span><div class="seg" role="group" aria-label="Bagian">${['pedagogik', 'profesional', 'rumus'].map((s) => `<button data-act="t-sec" data-sec="${s}" aria-pressed="${T.sec === s}">${SECS[s].name}</button>`).join('')}</div></div>
        <div class="row"><span class="label">Jumlah</span><div class="seg" role="group" aria-label="Jumlah soal">${[10, 20, 30, 50].map((n) => `<button data-act="t-n" data-n="${n}" aria-pressed="${T.n === n}">${n}</button>`).join('')}</div>
        <span class="label">Mode</span><div class="seg" role="group" aria-label="Mode">${[['instant', 'Belajar (pembahasan langsung)'], ['exam', 'Ujian (berwaktu)']].map(([m, l]) => `<button data-act="t-mode" data-mode="${m}" aria-pressed="${T.mode === m}">${l}</button>`).join('')}</div></div>
        <div class="row"><button class="btn primary" data-act="t-start">Mulai ${T.n} soal${T.topics.length ? ' dari ' + T.topics.length + ' topik' : ''}</button>${T.topics.length ? '<button class="btn ghost" data-act="t-clear">Hapus pilihan topik</button>' : ''}</div>
      </div>
      <div class="grid cols-2">${list.map((t) => {
        const s = ts[t.id]; const p = s && s.a ? s.c / s.a : null;
        return `<button class="topic" data-act="t-toggle" data-topic="${t.id}" aria-pressed="${T.topics.indexOf(t.id) >= 0}">
          <span class="name">${esc(t.name)}</span><span class="num small">${p == null ? '–' : Math.round(p * 100) + '%'}</span>
          <span class="small muted" style="grid-column:1/-1">${F(t.n)} soal · ${s ? s.seen : 0} pernah dikerjakan</span>
          <span class="bar ${p == null ? '' : p < 0.5 ? 'bad' : p < 0.7 ? 'flag' : 'ok'}"><i style="width:${s ? Math.round((s.seen / t.n) * 100) : 0}%"></i></span>
        </button>`;
      }).join('')}</div>`;
  }

  // ---------- Rumus ----------
  let rumusUI = { q: '', mode: 'list', flashId: null, flip: false };
  function vRumus() {
    const R = rumusUI;
    const all = []; SKB.FORMULA_CHAPTERS.forEach((c) => c.items.forEach((it) => all.push(it)));
    let body;
    if (R.mode === 'flash') {
      if (!R.flashId) R.flashId = nextFlash(all);
      const it = SKB.FORMULA_INDEX[R.flashId];
      const known = Object.values(S.flash).filter((v) => v >= 2).length;
      body = `<div class="card raised">
        <div class="card-head"><span class="label">Kartu hafalan · ${known} dari ${all.length} dikuasai</span><span class="chip">${esc(SKB.FORMULA_CHAPTERS.find((c) => c.id === it.ch).bab)}</span></div>
        <button class="flash" data-act="flip" aria-label="Balik kartu">${R.flip ? `<div class="stack"><div class="formula"><span class="tx">${U.texToHtml(it.f)}</span></div><p class="small">${rich(it.k)}</p>${it.t ? `<p class="small muted"><b>Tips:</b> ${rich(it.t)}</p>` : ''}</div>` : `<div class="stack"><span class="front">${esc(it.n)}</span><span class="muted small">Ingat rumusnya, lalu ketuk kartu untuk membalik.</span></div>`}</button>
        <div class="row">${R.flip ? '<button class="btn ok" data-act="flash-yes">Sudah hafal</button><button class="btn" data-act="flash-no">Belum, ulangi nanti</button>' : '<button class="btn primary" data-act="flip">Balik kartu</button>'}<button class="btn ghost" data-act="flash-skip">Lewati</button></div>
      </div>`;
    } else {
      const q = R.q.trim().toLowerCase();
      const match = (it) => !q || (it.n + ' ' + it.k + ' ' + it.c + ' ' + it.f).toLowerCase().indexOf(q) >= 0;
      body = SKB.FORMULA_CHAPTERS.map((c) => {
        const items = c.items.filter(match);
        if (!items.length) return '';
        return `<details class="chapter"${q ? ' open' : ''}><summary><span>${esc(c.bab)}</span><span class="chip">${items.length} rumus</span></summary><div class="inner"><div class="grid cols-2">${items.map((it) => formulaCard(it, {})).join('')}</div><div class="row"><button class="btn sm" data-act="practice-ch" data-ch="${c.id}">Latihan soal ${esc(c.bab)}</button><button class="btn sm ghost" data-act="quiz-ch" data-ch="${c.id}">Kuis rumus bab ini</button></div></div></details>`;
      }).join('') || '<p class="empty">Tidak ada rumus yang cocok dengan pencarian.</p>';
    }
    view.innerHTML = `
      <div class="page-head"><h1>Rumus & Konsep Fisika</h1><p>${all.length} rumus inti SMA disusun per bab, lengkap dengan keterangan simbol, konsep, dan jebakan yang sering muncul di soal.</p></div>
      <div class="row spread">
        <div class="seg" role="group" aria-label="Mode belajar rumus"><button data-act="r-mode" data-mode="list" aria-pressed="${R.mode === 'list'}">Daftar rumus</button><button data-act="r-mode" data-mode="flash" aria-pressed="${R.mode === 'flash'}">Kartu hafalan</button></div>
        <button class="btn" data-act="quiz-all">Kuis rumus acak (20 soal)</button>
      </div>
      ${R.mode === 'list' ? `<input type="search" id="rSearch" placeholder="Cari rumus, misalnya: Bernoulli, momentum, lensa" value="${esc(R.q)}" aria-label="Cari rumus">` : ''}
      <div class="stack" id="rBody">${body}</div>`;
    const inp = $('#rSearch');
    if (inp) inp.addEventListener('input', () => { R.q = inp.value; const pos = inp.selectionStart; vRumus(); const n = $('#rSearch'); n.focus(); n.setSelectionRange(pos, pos); });
  }
  function nextFlash(all) {
    const r = U.makeRng(Date.now());
    const weak = all.filter((it) => (S.flash[it.id] || 0) < 2);
    return r.pick(weak.length ? weak : all).id;
  }

  // ---------- Ringkasan pedagogik ----------
  function vPedagogik() {
    view.innerHTML = `
      <div class="page-head"><h1>Ringkasan Pedagogik</h1><p>Catatan padat untuk dibaca ulang sebelum dan sesudah latihan: teori belajar, model dan sintaks, Kurikulum Merdeka, asesmen, diferensiasi, miskonsepsi, TPACK, dan strategi mengerjakan SKB.</p></div>
      <div class="row">${SKB.PED_NOTES.map((n) => `<a class="chip" href="#pedagogik" data-act="jump" data-id="${n.id}">${esc(n.title)}</a>`).join('')}</div>
      <div class="notes">${SKB.PED_NOTES.map((n) => `<section class="note-card" id="note-${n.id}"><h2>${esc(n.title)}</h2>${n.html}</section>`).join('')}</div>
      <div class="card"><div class="row"><button class="btn primary" data-act="practice-sec" data-sec="pedagogik">Latihan 20 soal pedagogik</button></div></div>`;
    view.querySelectorAll('.note-card table').forEach((t) => { const w = document.createElement('div'); w.className = 'table-wrap'; t.parentNode.insertBefore(w, t); w.appendChild(t); });
  }

  // ---------- Riwayat ----------
  function chartSvg(points, target) {
    const W = 640, H = 200, L = 34, R = 12, T = 12, B = 26;
    const n = points.length;
    const x = (i) => L + (n === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (n - 1));
    const y = (v) => T + ((100 - v) * (H - T - B)) / 100;
    const grid = [0, 25, 50, 75, 100].map((v) => `<line class="gridline" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('');
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
    const area = n > 1 ? `<path class="area" d="${path} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z"/>` : '';
    const tl = `<line class="target" x1="${L}" x2="${W - R}" y1="${y(target)}" y2="${y(target)}"/><text x="${W - R}" y="${y(target) - 5}" text-anchor="end">target ${target}%</text>`;
    const dots = points.map((p, i) => `<circle class="pt ${i === n - 1 ? 'last' : ''}" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4"><title>${p.label}: ${p.v}%</title></circle>`).join('');
    const lbl = n ? `<text x="${x(0)}" y="${H - 6}" text-anchor="start">${points[0].label}</text>${n > 1 ? `<text x="${x(n - 1)}" y="${H - 6}" text-anchor="end">${points[n - 1].label}</text>` : ''}` : '';
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik persentase skor teknis simulasi">${grid}${area}${n > 1 ? `<path class="line" d="${path}"/>` : ''}${tl}${dots}${lbl}</svg>`;
  }
  function vRiwayat() {
    const sims = S.history.filter((h) => h.res.groups.teknis && h.kind === 'sim').slice(0, 20).reverse();
    const pts = sims.map((h) => ({ v: pct(h.res.groups.teknis.score, h.res.groups.teknis.max), label: fmtDate(h.ts) }));
    const secBlock = (sec) => {
      const ts = topicStats(sec);
      const rows = TOPICS_OF(sec).map((t) => ({ t, s: ts[t.id] })).filter((x) => x.s).sort((a, b) => a.s.c / a.s.a - b.s.c / b.s.a);
      if (!rows.length) return `<p class="empty">Belum ada data ${SECS[sec].name.toLowerCase()}.</p>`;
      return `<div class="topic-list">${rows.map(({ t, s }) => { const p = s.c / s.a; return `<button class="topic" data-act="practice-topic" data-sec="${sec}" data-topic="${t.id}"><span class="name">${esc(t.name)}</span><span class="num small">${Math.round(p * 100)}% · ${s.a} jawaban</span><span class="bar ${p < 0.5 ? 'bad' : p < 0.7 ? 'flag' : 'ok'}"><i style="width:${Math.round(p * 100)}%"></i></span></button>`; }).join('')}</div>`;
    };
    view.innerHTML = `
      <div class="page-head"><h1>Riwayat & Statistik</h1><p>Pantau perkembangan skor simulasi dan akurasi per topik. Ketuk sebuah topik untuk langsung berlatih.</p></div>
      <div class="card raised"><div class="card-head"><h2>Skor teknis simulasi</h2><span class="small muted">persentase dari skor maksimum</span></div>
        ${pts.length ? chartSvg(pts, S.settings.targetTeknisPct) : '<p class="empty">Selesaikan satu simulasi untuk melihat grafik perkembangan.</p>'}</div>
      <div class="card"><h2>Semua sesi</h2>${S.history.length ? `<div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Sesi</th><th class="n">Skor</th><th class="n">Benar</th><th></th></tr></thead><tbody>${S.history.slice(0, 40).map((h) => {
        const g = h.res.groups; const main = g.teknis || g.rumus;
        return `<tr><td class="small">${fmtDateTime(h.ts)}</td><td>${esc(h.title)}</td><td class="n">${main ? main.score + '/' + main.max : '–'}</td><td class="n">${main ? main.correct + '/' + main.n : '–'}</td><td>${h.items ? `<button class="btn sm ghost" data-act="view-result" data-id="${h.id}">Pembahasan</button>` : ''}</td></tr>`;
      }).join('')}</tbody></table></div>` : '<p class="empty">Belum ada sesi yang diselesaikan.</p>'}</div>
      <div class="grid cols-2">
        <div class="card"><h2>Akurasi pedagogik per topik</h2>${secBlock('pedagogik')}</div>
        <div class="card"><h2>Akurasi profesional per bab</h2>${secBlock('profesional')}</div>
      </div>`;
  }

  // ---------- Pengaturan ----------
  function vPengaturan() {
    const st = S.settings;
    view.innerHTML = `
      <div class="page-head"><h1>Pengaturan</h1><p>Sesuaikan format simulasi dengan pengumuman resmi, atur target, dan cadangkan progres belajar Anda.</p></div>
      <form class="card raised" id="setForm">
        <h2>Target dan jadwal</h2>
        <div class="grid cols-3">
          <div class="field"><label for="sDate">Perkiraan tanggal SKB</label><input type="date" id="sDate" value="${esc(st.targetDate)}"></div>
          <div class="field"><label for="sPct">Target skor teknis (%)</label><input type="number" id="sPct" min="30" max="100" value="${st.targetTeknisPct}"></div>
          <div class="field"><label for="sDaily">Jumlah soal latihan harian</label><input type="number" id="sDaily" min="5" max="60" value="${st.dailySize}"></div>
          <div class="field"><label for="sMS">Ambang manajerial + sosiokultural (maks 180)</label><input type="number" id="sMS" min="45" max="180" value="${st.targetMS}"></div>
          <div class="field"><label for="sW">Ambang wawancara (maks 40)</label><input type="number" id="sW" min="10" max="40" value="${st.targetW}"></div>
          <div class="field"><label for="sTheme">Tema</label><select id="sTheme">${[['auto', 'Ikuti perangkat'], ['light', 'Terang'], ['dark', 'Gelap']].map(([v, l]) => `<option value="${v}"${st.theme === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        </div>
        <h2>Format simulasi</h2>
        <div class="table-wrap"><table><thead><tr><th>Simulasi</th><th>Jumlah soal per bagian</th><th class="n">Menit</th></tr></thead><tbody>
        ${Object.entries(PRESETS).map(([k, p]) => `<tr><td>${p.name}</td><td><div class="row">${p.parts.map(([sec], i) => `<label class="small">${SECS[sec].name} <input type="number" min="0" max="${Math.min(200, (BY_SEC[sec] || []).length)}" data-preset="${k}" data-i="${i}" value="${st.presets[k].parts[i]}" style="width:72px" class="num"></label>`).join('')}</div></td><td class="n"><input type="number" min="5" max="300" data-preset-min="${k}" value="${st.presets[k].minutes}" style="width:72px" class="num" aria-label="Menit ${p.name}"></td></tr>`).join('')}
        </tbody></table></div>
        <div class="row"><button class="btn primary" type="submit">Simpan pengaturan</button><button class="btn ghost" type="button" data-act="reset-format">Kembalikan format bawaan</button></div>
      </form>
      <div class="card">
        <h2>Cadangkan progres</h2>
        <p class="small muted">Progres tersimpan di peramban ini saja. Salin kode di bawah untuk dipindahkan ke perangkat lain, lalu tempel dan pulihkan di sana.</p>
        <div class="field"><label for="bk">Kode cadangan</label><textarea id="bk" spellcheck="false"></textarea></div>
        <div class="row"><button class="btn" data-act="export">Buat kode cadangan</button><button class="btn" data-act="copy">Salin</button><button class="btn" data-act="import">Pulihkan dari kode</button></div>
      </div>
      <div class="card"><h2>Hapus data</h2><p class="small muted">Menghapus seluruh riwayat, statistik, dan pengaturan di perangkat ini.</p><div class="row"><button class="btn danger" data-act="wipe">Hapus semua data</button></div></div>`;
    $('#setForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const num = (id, d) => { const v = parseInt($(id).value, 10); return isFinite(v) ? v : d; };
      st.targetDate = $('#sDate').value; st.targetTeknisPct = num('#sPct', 65); st.dailySize = Math.max(5, Math.min(60, num('#sDaily', 20)));
      st.targetMS = num('#sMS', 130); st.targetW = num('#sW', 24); st.theme = $('#sTheme').value;
      view.querySelectorAll('[data-preset]').forEach((inp) => { st.presets[inp.dataset.preset].parts[+inp.dataset.i] = Math.max(0, parseInt(inp.value, 10) || 0); });
      view.querySelectorAll('[data-preset-min]').forEach((inp) => { st.presets[inp.dataset.presetMin].minutes = Math.max(5, parseInt(inp.value, 10) || 5); });
      S.dailyItems = {};
      save(); applyTheme(); toast('Pengaturan tersimpan.');
    });
  }

  // ---------- Ruang ujian ----------
  function vUjian() {
    const sess = S.session;
    if (!sess) { view.innerHTML = `<div class="empty"><p>Tidak ada sesi yang sedang berjalan.</p><p><a class="btn primary" href="#simulasi">Pilih simulasi</a></p></div>`; return; }
    const i = sess.idx, id = sess.items[i], q = BANK.byId[id];
    const chosen = sess.answers[i];
    const reveal = sess.instant && sess.revealed[i];
    const answered = Object.keys(sess.answers).length;
    const flagged = Object.keys(sess.flags).filter((k) => sess.flags[k]).length;
    let lastSec = null;
    const grid = sess.items.map((qid, k) => {
      const qq = BANK.byId[qid];
      let tag = '';
      const lbl = qq ? sectionLabel(qq) : '';
      if (lbl !== lastSec) { tag = `<span class="sec-tag">${esc(lbl)}</span>`; lastSec = lbl; }
      let cls = sess.answers[k] != null ? 'ans' : '';
      if (sess.instant && sess.revealed[k] && qq) cls = qq.scores ? (qq.scores[sess.answers[k]] === 4 ? 'ok' : 'bad') : sess.answers[k] === qq.answer ? 'ok' : 'bad';
      if (sess.flags[k]) cls = 'flag';
      return `${tag}<button type="button" class="${cls} ${k === i ? 'cur' : ''}" data-act="goto" data-k="${k}" aria-label="Soal ${k + 1}">${k + 1}</button>`;
    }).join('');
    view.innerHTML = `
      <div class="exam-bar"><span class="title">${esc(sess.title)}</span><span class="row" style="gap:10px"><span class="small">${answered}/${sess.items.length} terjawab</span>${sess.deadline ? `<span class="timer" id="timer" aria-live="off">${fmtTime((sess.deadline - Date.now()) / 1000)}</span>` : `<span class="timer" id="timer">${fmtTime((Date.now() - sess.start) / 1000)}</span>`}</span></div>
      <div class="exam">
        <section class="qcard" aria-labelledby="qlabel">
          <div class="qhead"><span class="qnum" id="qlabel">Soal ${i + 1}</span><span class="chip">${esc(sectionLabel(q))}</span><span class="chip">${esc(topicName(q.sec, q.topic))}</span>${q.level && q.level !== 'SJT' ? `<span class="chip">${q.level}</span>` : ''}</div>
          <div class="qtext">${rich(q.q)}</div>
          ${q.svg || ''}
          <div class="opts" role="radiogroup" aria-labelledby="qlabel">${optionsHtml(q, chosen, reveal)}</div>
          ${reveal ? explainHtml(q, chosen) : ''}
          <div class="qnav">
            <button class="btn" data-act="prev"${i === 0 ? ' disabled' : ''}>← Sebelumnya</button>
            <div class="row">
              ${sess.instant ? '' : `<button class="btn flag" data-act="flag" aria-pressed="${!!sess.flags[i]}">Ragu-ragu</button>`}
              ${i < sess.items.length - 1 ? `<button class="btn primary" data-act="next">Selanjutnya →</button>` : `<button class="btn ok" data-act="finish">Selesai</button>`}
            </div>
          </div>
        </section>
        <aside class="panel" aria-label="Navigasi nomor soal">
          <div class="card-head"><b>Nomor soal</b><span class="small muted">${flagged ? flagged + ' ragu' : ''}</span></div>
          <div class="numgrid">${grid}</div>
          <div class="legend"><span><i style="background:var(--ink)"></i>dijawab</span><span><i style="background:var(--flag)"></i>ragu-ragu</span><span><i></i>belum</span>${sess.instant ? '<span><i style="background:var(--ok)"></i>benar</span><span><i style="background:var(--bad)"></i>salah</span>' : ''}</div>
          <button class="btn ok" data-act="finish">Selesai & kumpulkan</button>
          <p class="small muted">Pintasan: tombol A–E untuk memilih, ← → untuk berpindah${sess.instant ? '' : ', R untuk ragu-ragu'}.</p>
          <button class="btn sm ghost" data-act="leave">Keluar (sesi tetap tersimpan)</button>
        </aside>
      </div>`;
    timerId = setInterval(tick, 1000);
  }
  function tick() {
    const sess = S.session, el = $('#timer');
    if (!sess || !el) { clearInterval(timerId); return; }
    if (sess.deadline) {
      const left = (sess.deadline - Date.now()) / 1000;
      el.textContent = fmtTime(left);
      el.classList.toggle('warn', left <= 600 && left > 120);
      el.classList.toggle('crit', left <= 120);
      if (left <= 0) finishSession(true);
    } else el.textContent = fmtTime((Date.now() - sess.start) / 1000);
  }
  function choose(j) {
    const sess = S.session; if (!sess) return;
    const i = sess.idx;
    if (sess.instant && sess.revealed[i]) return;
    sess.answers[i] = j;
    if (sess.instant) {
      sess.revealed[i] = true;
      const q = BANK.byId[sess.items[i]];
      if (!SJT[q.sec]) record(q.id, j === q.answer);
    }
    save(); vUjian();
    if (sess.instant) { const ex = view.querySelector('.explain'); if (ex) ex.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }
  function moveTo(k) {
    const sess = S.session; if (!sess) return;
    sess.idx = Math.max(0, Math.min(sess.items.length - 1, k)); save(); vUjian();
    const qc = view.querySelector('.qcard'); if (qc && qc.getBoundingClientRect().top < 0) qc.scrollIntoView({ block: 'start' });
  }
  function askFinish() {
    const sess = S.session; if (!sess) return;
    const blank = sess.items.length - Object.keys(sess.answers).length;
    const flagged = Object.keys(sess.flags).filter((k) => sess.flags[k]).length;
    confirmBox('Kumpulkan jawaban?', `${blank ? `<b>${blank} soal belum dijawab.</b> ` : 'Semua soal sudah dijawab. '}${flagged ? `${flagged} soal masih ditandai ragu-ragu. ` : ''}Setelah dikumpulkan, jawaban tidak dapat diubah dan pembahasan akan terbuka.`, 'Kumpulkan', () => finishSession(false));
  }
  document.addEventListener('keydown', (e) => {
    if ((location.hash || '').slice(1) !== 'ujian' || !S.session || !$('#modal').hidden) return;
    if (e.target.matches('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toUpperCase();
    const q = BANK.byId[S.session.items[S.session.idx]];
    const li = LETTERS.indexOf(k);
    if (li >= 0 && li < q.options.length) { choose(li); e.preventDefault(); }
    else if (k >= '1' && k <= '5' && +k <= q.options.length) { choose(+k - 1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { moveTo(S.session.idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { moveTo(S.session.idx - 1); e.preventDefault(); }
    else if (k === 'R' && !S.session.instant) { S.session.flags[S.session.idx] = !S.session.flags[S.session.idx]; save(); vUjian(); }
  });

  // ---------- Hasil ----------
  let reviewFilter = 'salah';
  function vHasil() {
    const h = S.history.find((x) => x.id === S.viewResult) || S.history[0];
    if (!h) { view.innerHTML = '<p class="empty">Belum ada hasil.</p>'; return; }
    const g = h.res.groups, P = h.res.pass;
    const main = g.teknis || g.rumus;
    const st = S.settings;
    const subRows = Object.entries(g).filter(([k]) => k.startsWith('sub:') || SJT[k]).map(([k, x]) => `<tr><td>${esc(x.label)}</td><td class="n">${x.correct}/${x.n}</td><td class="n">${x.score}/${x.max}</td><td class="n">${pct(x.score, x.max)}%</td></tr>`).join('');
    let verdicts = '';
    if (P.teknis != null) verdicts += `<span class="verdict ${P.teknis ? 'pass' : 'fail'}">${P.teknis ? '✓' : '✕'} Teknis ${P.teknis ? 'mencapai' : 'belum mencapai'} target ${st.targetTeknisPct}%</span>`;
    if (P.ms != null) verdicts += `<span class="verdict ${P.ms ? 'pass' : 'fail'}">${P.ms ? '✓' : '✕'} Manajerial + sosiokultural: ${g.manajerial.score + g.sosiokultural.score}</span>`;
    if (P.w != null) verdicts += `<span class="verdict ${P.w ? 'pass' : 'fail'}">${P.w ? '✓' : '✕'} Wawancara: ${g.wawancara.score}</span>`;
    // topik
    const topicAgg = {};
    if (h.items) h.items.forEach((id, i) => { const q = BANK.byId[id]; if (!q || SJT[q.sec]) return; const k = q.sec + ':' + q.topic; const t = (topicAgg[k] = topicAgg[k] || { sec: q.sec, topic: q.topic, n: 0, c: 0 }); t.n++; if (h.answers[i] === q.answer) t.c++; });
    const topicRows = Object.values(topicAgg).sort((a, b) => a.c / a.n - b.c / b.n);
    view.innerHTML = `
      <div class="page-head"><span class="label">${fmtDateTime(h.ts)} · waktu terpakai ${fmtTime(h.used)}${h.minutes ? ' dari ' + h.minutes + ' menit' : ''}</span><h1>${esc(h.title)}</h1></div>
      <div class="grid cols-2">
        <div class="card raised">
          <span class="label">${main === g.teknis ? 'Skor kompetensi teknis' : 'Skor'}</span>
          <div class="row" style="align-items:baseline"><span class="score-big">${main ? main.score : 0}</span><span class="num muted">/ ${main ? main.max : 0}</span></div>
          <p>${main ? `${main.correct} benar · ${main.answered - main.correct} salah · ${main.n - main.answered} kosong` : ''}</p>
          <div class="row">${verdicts}</div>
        </div>
        <div class="card"><h2>Rincian per bagian</h2><div class="table-wrap"><table><thead><tr><th>Bagian</th><th class="n">Skor 4/benar</th><th class="n">Skor</th><th class="n">%</th></tr></thead><tbody>${subRows}</tbody></table></div></div>
      </div>
      ${topicRows.length ? `<div class="card"><h2>Penguasaan per topik</h2><div class="grid cols-2">${topicRows.map((t) => { const p = t.c / t.n; return `<button class="topic" data-act="practice-topic" data-sec="${t.sec}" data-topic="${t.topic}"><span class="name">${esc(topicName(t.sec, t.topic))}</span><span class="num small">${t.c}/${t.n}</span><span class="bar ${p < 0.5 ? 'bad' : p < 0.7 ? 'flag' : 'ok'}"><i style="width:${Math.round(p * 100)}%"></i></span></button>`; }).join('')}</div></div>` : ''}
      <div class="row"><a class="btn primary" href="#simulasi">Simulasi lagi</a>${S.wrong.length ? `<button class="btn" data-act="retry">Ulangi soal salah (${S.wrong.length})</button>` : ''}<a class="btn ghost" href="#beranda">Beranda</a></div>
      ${h.items ? `<div class="card"><div class="card-head"><h2>Pembahasan</h2><div class="seg" role="group" aria-label="Saring pembahasan">${[['salah', 'Salah & kosong'], ['benar', 'Benar'], ['semua', 'Semua']].map(([k, l]) => `<button data-act="rf" data-f="${k}" aria-pressed="${reviewFilter === k}">${l}</button>`).join('')}</div></div><div class="stack" id="reviewList">${reviewList(h)}</div></div>` : ''}`;
  }
  function reviewList(h) {
    const out = [];
    h.items.forEach((id, i) => {
      const q = BANK.byId[id]; if (!q) return;
      const a = h.answers[i];
      const ok = q.scores ? a != null && q.scores[a] === 4 : a === q.answer;
      if (reviewFilter === 'salah' && ok) return;
      if (reviewFilter === 'benar' && !ok) return;
      const dot = a == null ? 'empty' : ok ? 'ok' : 'bad';
      out.push(`<details class="review-item"><summary><span class="dot ${dot}">${i + 1}</span><span class="qtext">${rich(q.q)}</span></summary>
        <div class="row"><span class="chip">${esc(sectionLabel(q))}</span><span class="chip">${esc(topicName(q.sec, q.topic))}</span></div>
        ${q.svg || ''}<div class="opts">${optionsHtml(q, a, true)}</div>${explainHtml(q, a)}</details>`);
    });
    return out.join('') || '<p class="empty">Tidak ada soal pada saringan ini.</p>';
  }

  // ---------- Aksi ----------
  view.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const d = el.dataset, act = d.act;
    const sess = S.session;
    switch (act) {
      case 'daily': startDaily(); break;
      case 'resume': go('ujian'); break;
      case 'preset': startPreset(d.key); break;
      case 'retry': startGuarded({ kind: 'retry', title: 'Ulangi Soal yang Salah', items: U.makeRng(Date.now()).shuffle(S.wrong.slice()).slice(0, 20), instant: true }); break;
      case 'formula': openFormula(d.id); break;
      case 'practice-topic': startGuarded({ kind: 'topic', title: 'Latihan: ' + topicName(d.sec, d.topic), parts: [[d.sec, 15, [d.topic]]], instant: true }); break;
      case 'practice-ch': closeModal(); startGuarded({ kind: 'topic', title: 'Latihan: ' + SKB.FORMULA_CHAPTERS.find((c) => c.id === d.ch).bab, parts: [['profesional', 12, [d.ch]], ['rumus', 3, [d.ch]]], instant: true }); break;
      case 'quiz-ch': startGuarded({ kind: 'topic', title: 'Kuis Rumus: ' + SKB.FORMULA_CHAPTERS.find((c) => c.id === d.ch).bab, parts: [['rumus', 20, [d.ch]]], instant: true }); break;
      case 'quiz-all': startGuarded({ kind: 'topic', title: 'Kuis Rumus Acak', parts: [['rumus', 20]], instant: true }); break;
      case 'practice-sec': startGuarded({ kind: 'topic', title: 'Latihan ' + SECS[d.sec].name, parts: [[d.sec, 20]], instant: true }); break;
      case 't-sec': topicUI.sec = d.sec; topicUI.topics = []; vTopik(); break;
      case 't-n': topicUI.n = +d.n; vTopik(); break;
      case 't-mode': topicUI.mode = d.mode; vTopik(); break;
      case 't-clear': topicUI.topics = []; vTopik(); break;
      case 't-toggle': { const ix = topicUI.topics.indexOf(d.topic); if (ix >= 0) topicUI.topics.splice(ix, 1); else topicUI.topics.push(d.topic); vTopik(); break; }
      case 't-start': {
        const T = topicUI;
        const names = T.topics.map((t) => topicName(T.sec, t));
        startGuarded({ kind: 'topic', title: `${SECS[T.sec].name}${names.length === 1 ? ': ' + names[0] : names.length ? ` (${names.length} topik)` : ' (semua topik)'}`, parts: [[T.sec, T.n, T.topics.length ? T.topics.slice() : null]], instant: T.mode === 'instant', minutes: T.mode === 'exam' ? Math.round(T.n * (T.sec === 'profesional' ? 1.2 : 1)) : null });
        break;
      }
      case 'r-mode': rumusUI.mode = d.mode; rumusUI.flip = false; vRumus(); break;
      case 'flip': rumusUI.flip = !rumusUI.flip; vRumus(); break;
      case 'flash-yes': case 'flash-no': case 'flash-skip': {
        const all = []; SKB.FORMULA_CHAPTERS.forEach((c) => c.items.forEach((it) => all.push(it)));
        if (act === 'flash-yes') S.flash[rumusUI.flashId] = (S.flash[rumusUI.flashId] || 0) + 1;
        if (act === 'flash-no') S.flash[rumusUI.flashId] = 0;
        save(); rumusUI.flashId = nextFlash(all); rumusUI.flip = false; vRumus(); break;
      }
      case 'jump': { e.preventDefault(); const t = $('#note-' + d.id); if (t) t.scrollIntoView({ behavior: 'smooth' }); break; }
      case 'view-result': S.viewResult = d.id; reviewFilter = 'salah'; go('hasil'); break;
      case 'rf': reviewFilter = d.f; { const h = S.history.find((x) => x.id === S.viewResult) || S.history[0]; view.querySelectorAll('[data-act="rf"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === reviewFilter)); $('#reviewList').innerHTML = reviewList(h); } break;
      case 'choose': choose(+d.j); break;
      case 'prev': moveTo(sess.idx - 1); break;
      case 'next': moveTo(sess.idx + 1); break;
      case 'goto': moveTo(+d.k); break;
      case 'flag': sess.flags[sess.idx] = !sess.flags[sess.idx]; save(); vUjian(); break;
      case 'finish':
        if (sess.instant && sess.kind !== 'sim') {
          const left = sess.items.length - Object.keys(sess.answers).length;
          if (left) confirmBox('Akhiri latihan?', `${left} soal belum dijawab dan akan dihitung kosong.`, 'Akhiri', () => finishSession(false));
          else finishSession(false);
        } else askFinish();
        break;
      case 'leave': go('beranda'); break;
      case 'reset-format': S.settings.presets = JSON.parse(JSON.stringify(DEF_SETTINGS.presets)); save(); vPengaturan(); toast('Format simulasi dikembalikan ke bawaan.'); break;
      case 'export': { const data = JSON.stringify({ app: 'skbfis', v: 1, data: S }); $('#bk').value = btoa(unescape(encodeURIComponent(data))); toast('Kode cadangan dibuat.'); break; }
      case 'copy': {
        const ta = $('#bk'); if (!ta.value) { toast('Buat kode cadangan terlebih dahulu.'); break; }
        const fallback = () => { ta.focus(); ta.select(); toast('Kode terpilih. Tekan Ctrl+C / salin.'); };
        try { navigator.clipboard.writeText(ta.value).then(() => toast('Kode cadangan disalin.'), fallback); } catch (err) { fallback(); }
        break;
      }
      case 'import': {
        try {
          const obj = JSON.parse(decodeURIComponent(escape(atob($('#bk').value.trim()))));
          if (obj.app !== 'skbfis' || !obj.data) throw new Error('format');
          confirmBox('Pulihkan progres?', 'Data di perangkat ini akan diganti dengan data dari kode cadangan.', 'Pulihkan', () => { localStorage.setItem(KEY, JSON.stringify(obj.data)); S = load(); applyTheme(); toast('Progres berhasil dipulihkan.'); go('beranda'); });
        } catch (err) { toast('Kode cadangan tidak valid. Pastikan seluruh kode ikut tersalin.'); }
        break;
      }
      case 'wipe': confirmBox('Hapus semua data?', 'Riwayat, statistik, dan pengaturan akan dihapus permanen dari perangkat ini.', 'Hapus', () => { S = fresh(); save(); applyTheme(); toast('Semua data dihapus.'); go('beranda'); }, true); break;
      default: break;
    }
  });
  $('#modalBody').addEventListener('click', (e) => {
    const el = e.target.closest('[data-act="practice-ch"]');
    if (el) { closeModal(); startGuarded({ kind: 'topic', title: 'Latihan: ' + SKB.FORMULA_CHAPTERS.find((c) => c.id === el.dataset.ch).bab, parts: [['profesional', 12, [el.dataset.ch]], ['rumus', 3, [el.dataset.ch]]], instant: true }); }
  });

  applyTheme();
  render();
})();
