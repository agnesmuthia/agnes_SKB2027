/* Bank soal Profesional Fisika bagian 1: Mekanika (vektor s.d. getaran). */
(function (root) {
  'use strict';
  const SKB = root.SKB;
  const U = SKB.util;
  const f = U.fmt;
  const add = (o) => SKB.bank.add(Object.assign({ sec: 'profesional' }, o));
  const ANG = { 30: [0.5, Math.sqrt(3) / 2], 37: [0.6, 0.8], 45: [Math.SQRT1_2, Math.SQRT1_2], 53: [0.8, 0.6], 60: [Math.sqrt(3) / 2, 0.5] };
  const sin = (a) => ANG[a][0], cos = (a) => ANG[a][1];
  const angNote = (a) => (a === 37 || a === 53 ? ' (gunakan sin 37° = 0,6 dan cos 37° = 0,8)' : '');
  const NAMES = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hana', 'Indra', 'Joko', 'Kirana', 'Lestari', 'Made', 'Nanda', 'Putu', 'Rizky', 'Sari', 'Tono', 'Wulan', 'Yusuf'];
  const OBJ = ['balok', 'peti', 'kotak kayu', 'troli', 'kardus'];

  // ---------- VEKTOR ----------
  add({ id: 'vek-res', topic: 'vektor', formulas: ['vektor-resultan'], level: 'C3', count: 40, gen(r) {
    const F1 = r.step(3, 20, 1), F2 = r.step(3, 20, 1);
    const a = r.pick([0, 60, 90, 120, 180]);
    const c = Math.cos((a * Math.PI) / 180);
    const R = Math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * c);
    if (R < 0.5) return null;
    return {
      q: `Dua gaya F₁ = ${F1} N dan F₂ = ${F2} N bekerja pada satu titik dan membentuk sudut ${a}°. Besar resultan kedua gaya adalah ….`,
      ans: R, unit: 'N', wrong: [F1 + F2, Math.abs(F1 - F2), Math.sqrt(F1 * F1 + F2 * F2), Math.sqrt(Math.abs(F1 * F1 + F2 * F2 - 2 * F1 * F2 * c))],
      explain: `Gunakan rumus kosinus: $R = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\alpha}$.<br>cos ${a}° = ${f(c)}<br>R = √(${F1}² + ${F2}² + 2·${F1}·${F2}·${f(c)}) = √${f(F1 * F1 + F2 * F2 + 2 * F1 * F2 * c)} = <b>${f(R)} N</b>.<br>Cek nalar: resultan selalu berada di antara |F₁ − F₂| = ${Math.abs(F1 - F2)} N dan F₁ + F₂ = ${F1 + F2} N.`,
    };
  }});
  add({ id: 'vek-komp', topic: 'vektor', formulas: ['vektor-komponen'], level: 'C3', count: 30, gen(r) {
    const v = r.step(10, 100, 5), a = r.pick([30, 37, 53, 60]);
    const which = r.pick(['x', 'y']);
    const ans = which === 'x' ? v * cos(a) : v * sin(a);
    const other = which === 'x' ? v * sin(a) : v * cos(a);
    return {
      q: `Sebuah vektor kecepatan besarnya ${v} m/s membentuk sudut ${a}° terhadap sumbu x positif${angNote(a)}. Besar komponen vektor pada sumbu ${which} adalah ….`,
      ans, unit: 'm/s', wrong: [other, v, v / 2, v * 0.75],
      explain: `$v_x = v\\cos\\alpha$ dan $v_y = v\\sin\\alpha$.<br>v${which === 'x' ? 'ₓ' : 'ᵧ'} = ${v} × ${which === 'x' ? 'cos' : 'sin'} ${a}° = <b>${f(ans)} m/s</b>.<br>Jebakan: menukar sin dan cos (hasilnya ${f(other)} m/s).`,
    };
  }});

  // ---------- GERAK LURUS ----------
  add({ id: 'gl-ratarata', topic: 'gerak-lurus', formulas: ['kecepatan-rata'], level: 'C4', count: 40, gen(r) {
    const a = r.step(40, 200, 10), b = r.step(10, 150, 10), t = r.step(10, 60, 5);
    if (a === b) return null;
    const ask = r.pick(['kecepatan', 'kelajuan']);
    const n = r.pick(NAMES);
    const disp = Math.abs(a - b), dist = a + b;
    const ans = ask === 'kecepatan' ? disp / t : dist / t;
    return {
      q: `${n} berjalan ${a} m ke timur, kemudian berbalik ${b} m ke barat. Seluruh perjalanan memakan waktu ${t} s. Besar ${ask} rata-rata ${n} adalah ….`,
      ans, unit: 'm/s', wrong: [ask === 'kecepatan' ? dist / t : disp / t, (a + b) / (2 * t), a / t, b / t],
      explain: `Kelajuan rata-rata = jarak total / waktu; kecepatan rata-rata = perpindahan / waktu.<br>Jarak = ${a} + ${b} = ${dist} m; perpindahan = |${a} − ${b}| = ${disp} m.<br>${ask[0].toUpperCase() + ask.slice(1)} rata-rata = ${ask === 'kecepatan' ? disp : dist} / ${t} = <b>${f(ans)} m/s</b>.`,
    };
  }});
  add({ id: 'gl-bertemu', topic: 'gerak-lurus', formulas: ['glb'], level: 'C4', count: 40, gen(r) {
    const v1 = r.step(10, 30, 2), v2 = r.step(8, 30, 2), d = r.step(200, 2000, 100);
    const opp = r.chance(0.6);
    if (!opp && v1 <= v2) return null;
    const t = opp ? d / (v1 + v2) : d / (v1 - v2);
    const ask = r.pick(['waktu', 'jarak']);
    const ans = ask === 'waktu' ? t : v1 * t;
    const q = opp
      ? `Mobil A dan mobil B mula-mula terpisah ${d} m dan bergerak saling mendekat pada lintasan lurus dengan kelajuan tetap ${v1} m/s (A) dan ${v2} m/s (B). ${ask === 'waktu' ? 'Kedua mobil bertemu setelah …' : 'Kedua mobil bertemu ketika A telah menempuh jarak …'}`
      : `Mobil A mengejar mobil B yang berada ${d} m di depannya. Keduanya bergerak searah dengan kelajuan tetap ${v1} m/s (A) dan ${v2} m/s (B). ${ask === 'waktu' ? 'Mobil A menyusul B setelah …' : 'Mobil A menyusul B setelah A menempuh jarak …'}`;
    const tw = opp ? d / Math.abs(v1 - v2 || 1) : d / (v1 + v2);
    return {
      q, ans, unit: ask === 'waktu' ? 's' : 'm', wrong: ask === 'waktu' ? [tw, d / v1, d / v2, 2 * t] : [v1 * tw, v2 * t, d / 2, d],
      explain: `${opp ? 'Bergerak berlawanan: s_A + s_B = d → (v_A + v_B)t = d' : 'Bergerak searah: s_A − s_B = d → (v_A − v_B)t = d'}.<br>t = ${d} / ${opp ? v1 + v2 : v1 - v2} = ${f(t)} s${ask === 'jarak' ? `<br>s_A = v_A·t = ${v1} × ${f(t)} = <b>${f(ans)} m</b>` : ` → <b>${f(t)} s</b>`}.`,
    };
  }});
  add({ id: 'glbb-vt', topic: 'gerak-lurus', formulas: ['glbb'], level: 'C3', count: 40, gen(r) {
    const v0 = r.step(0, 20, 2), a = r.step(1, 6, 0.5), t = r.int(2, 12);
    const ask = r.pick(['v', 's']);
    const vt = v0 + a * t, s = v0 * t + 0.5 * a * t * t;
    return {
      q: `Sebuah ${r.pick(['sepeda motor', 'mobil', 'kereta mainan', 'truk'])} bergerak lurus dengan kecepatan awal ${v0} m/s lalu dipercepat beraturan ${f(a)} m/s² selama ${t} s. ${ask === 'v' ? 'Kecepatan akhirnya adalah …' : 'Jarak yang ditempuh selama selang waktu itu adalah …'}`,
      ans: ask === 'v' ? vt : s, unit: ask === 'v' ? 'm/s' : 'm',
      wrong: ask === 'v' ? [a * t, v0 + 0.5 * a * t, v0 * a * t, vt * 2] : [v0 * t + a * t * t, vt * t, 0.5 * a * t * t, (v0 + vt) * t],
      explain: ask === 'v' ? `$v_t = v_0 + at$ = ${v0} + ${f(a)}×${t} = <b>${f(vt)} m/s</b>.` : `$s = v_0t + \\tfrac12 at^2$ = ${v0}×${t} + ½×${f(a)}×${t}² = <b>${f(s)} m</b>.<br>Cara lain: s = ½(v₀ + v_t)t = ½(${v0} + ${f(vt)})×${t}.`,
    };
  }});
  add({ id: 'glbb-rem', topic: 'gerak-lurus', formulas: ['glbb'], level: 'C4', count: 30, gen(r) {
    const kmh = r.step(36, 108, 18), a = r.pick([2, 2.5, 4, 5, 6, 8]);
    const v = kmh / 3.6;
    const s = (v * v) / (2 * a);
    return {
      q: `Pengemudi mobil yang melaju ${kmh} km/jam menginjak rem sehingga mobil diperlambat beraturan ${f(a)} m/s² sampai berhenti. Jarak pengereman mobil adalah ….`,
      ans: s, unit: 'm', wrong: [(kmh * kmh) / (2 * a), (v * v) / a, v / a, v * v / (2 * a) / 2],
      explain: `Ubah satuan: ${kmh} km/jam = ${kmh}/3,6 = ${f(v)} m/s.<br>Saat berhenti v_t = 0: $v_t^2 = v_0^2 - 2as$ → s = v₀²/(2a) = ${f(v)}²/(2×${f(a)}) = <b>${f(s)} m</b>.<br>HOTS: jarak pengereman sebanding v₀², sehingga kelajuan 2 kali membutuhkan jarak 4 kali.`,
    };
  }});
  add({ id: 'gl-grafik', topic: 'gerak-lurus', formulas: ['glbb'], level: 'C4', count: 40, gen(r) {
    const v = r.step(4, 20, 2), t1 = r.int(2, 6), t2 = t1 + r.int(2, 6), t3 = t2 + r.int(2, 5);
    const s = 0.5 * t1 * v + (t2 - t1) * v + 0.5 * (t3 - t2) * v;
    const ask = r.pick(['s', 'a']);
    const W = 300, H = 170, ox = 40, oy = 140, sx = (W - 60) / t3, sy = 110 / v;
    const P = (t, vv) => `${(ox + t * sx).toFixed(1)},${(oy - vv * sy).toFixed(1)}`;
    const svg = `<svg viewBox="0 0 ${W} ${H}" class="qfig" role="img" aria-label="grafik v terhadap t"><line x1="${ox}" y1="${oy}" x2="${W - 10}" y2="${oy}" class="ax"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="15" class="ax"/><polyline points="${P(0, 0)} ${P(t1, v)} ${P(t2, v)} ${P(t3, 0)}" class="ln"/><line x1="${ox}" y1="${oy - v * sy}" x2="${ox + t2 * sx}" y2="${oy - v * sy}" class="gd"/><line x1="${ox + t1 * sx}" y1="${oy}" x2="${ox + t1 * sx}" y2="${oy - v * sy}" class="gd"/><line x1="${ox + t2 * sx}" y1="${oy}" x2="${ox + t2 * sx}" y2="${oy - v * sy}" class="gd"/><text x="${ox - 6}" y="${oy - v * sy + 4}" text-anchor="end">${v}</text><text x="${ox + t1 * sx}" y="${oy + 14}" text-anchor="middle">${t1}</text><text x="${ox + t2 * sx}" y="${oy + 14}" text-anchor="middle">${t2}</text><text x="${ox + t3 * sx}" y="${oy + 14}" text-anchor="middle">${t3}</text><text x="${ox - 6}" y="${oy + 14}" text-anchor="end">0</text><text x="${ox + 4}" y="14">v (m/s)</text><text x="${W - 10}" y="${oy - 6}" text-anchor="end">t (s)</text></svg>`;
    if (ask === 's') return {
      q: `Grafik kecepatan terhadap waktu sebuah benda yang bergerak lurus ditunjukkan pada gambar. Jarak total yang ditempuh benda selama ${t3} s adalah ….`, svg,
      ans: s, unit: 'm', wrong: [v * t3, 0.5 * v * t3, v * (t2 - t1), s + 0.5 * v * t1],
      explain: `Jarak = luas di bawah grafik v–t (trapesium).<br>Luas = ½ × (sisi sejajar ${t2 - t1} + alas ${t3}) × tinggi ${v} = ½ × ${t2 - t1 + t3} × ${v} = <b>${f(s)} m</b>.<br>Atau dijumlah per bagian: ${f(0.5 * t1 * v)} + ${f((t2 - t1) * v)} + ${f(0.5 * (t3 - t2) * v)} m.`,
    };
    const a3 = v / (t3 - t2);
    return {
      q: `Grafik kecepatan terhadap waktu sebuah benda yang bergerak lurus ditunjukkan pada gambar. Besar perlambatan benda pada selang t = ${t2} s sampai t = ${t3} s adalah ….`, svg,
      ans: a3, unit: 'm/s²', wrong: [v / t1, v / t3, v / (t2 - t1), v * (t3 - t2)],
      explain: `Percepatan = kemiringan grafik v–t.<br>a = Δv/Δt = (0 − ${v}) / (${t3} − ${t2}) = −${f(a3)} m/s², jadi besar perlambatannya <b>${f(a3)} m/s²</b>.`,
    };
  }});
  add({ id: 'gl-jatuh', topic: 'gerak-lurus', formulas: ['jatuh-bebas'], level: 'C3', count: 35, gen(r) {
    const h = r.pick([5, 20, 45, 80, 125, 180, 245, 320, 405, 500]);
    const ask = r.pick(['t', 'v']);
    const t = Math.sqrt((2 * h) / 10), v = Math.sqrt(20 * h);
    return {
      q: `Sebuah ${r.pick(['batu', 'kelapa', 'bola besi', 'pot bunga'])} dijatuhkan tanpa kecepatan awal dari ketinggian ${h} m. Jika g = 10 m/s² dan hambatan udara diabaikan, ${ask === 't' ? 'waktu yang diperlukan untuk sampai di tanah adalah …' : 'kecepatan benda saat menyentuh tanah adalah …'}`,
      ans: ask === 't' ? t : v, unit: ask === 't' ? 's' : 'm/s', wrong: ask === 't' ? [h / 10, Math.sqrt(h / 10), 2 * t, h / 20] : [10 * h, Math.sqrt(10 * h), 2 * h, v / 2],
      explain: ask === 't' ? `$h = \\tfrac12 g t^2$ → t = √(2h/g) = √(2×${h}/10) = <b>${f(t)} s</b>.` : `$v = \\sqrt{2gh}$ = √(2×10×${h}) = <b>${f(v)} m/s</b>.`,
    };
  }});
  add({ id: 'gl-vertikal', topic: 'gerak-lurus', formulas: ['vertikal-atas'], level: 'C3', count: 40, gen(r) {
    const v0 = r.step(10, 50, 5), ask = r.pick(['h', 't', 'h2']);
    const hm = (v0 * v0) / 20, tp = v0 / 10;
    if (ask === 'h2') {
      const t = r.int(1, Math.max(1, Math.floor(tp)));
      const h = v0 * t - 5 * t * t;
      return { q: `Bola dilempar vertikal ke atas dengan kecepatan awal ${v0} m/s (g = 10 m/s²). Ketinggian bola setelah ${t} s adalah ….`, ans: h, unit: 'm', wrong: [v0 * t, v0 * t + 5 * t * t, hm, v0 * t - 10 * t * t],
        explain: `$h = v_0t - \\tfrac12 gt^2$ = ${v0}×${t} − 5×${t}² = <b>${f(h)} m</b>.` };
    }
    return {
      q: `Bola dilempar vertikal ke atas dengan kecepatan awal ${v0} m/s (g = 10 m/s²). ${ask === 'h' ? 'Tinggi maksimum yang dicapai bola adalah …' : 'Waktu yang diperlukan bola untuk kembali ke titik pelemparan adalah …'}`,
      ans: ask === 'h' ? hm : 2 * tp, unit: ask === 'h' ? 'm' : 's', wrong: ask === 'h' ? [(v0 * v0) / 10, v0 / 2, v0 * tp, hm / 2] : [tp, v0 / 5 * 2, 4 * tp, v0 / 20],
      explain: ask === 'h' ? `$h_{maks} = \\frac{v_0^2}{2g}$ = ${v0}²/20 = <b>${f(hm)} m</b>.` : `Waktu naik $t_p = v_0/g$ = ${f(tp)} s. Waktu naik = waktu turun, jadi total = 2t_p = <b>${f(2 * tp)} s</b>.`,
    };
  }});

  // ---------- DINAMIKA ----------
  add({ id: 'din-gesek', topic: 'dinamika', formulas: ['newton-2', 'gaya-gesek'], level: 'C3', count: 45, gen(r) {
    const m = r.step(2, 20, 1), mu = r.pick([0.1, 0.2, 0.25, 0.3, 0.4]), F = r.step(10, 120, 5);
    const fk = mu * m * 10;
    if (F <= fk + 1) return null;
    const a = (F - fk) / m;
    return {
      q: `Sebuah ${r.pick(OBJ)} bermassa ${m} kg ditarik dengan gaya mendatar ${F} N pada lantai kasar dengan koefisien gesek kinetis ${f(mu)} (g = 10 m/s²). Percepatan benda adalah ….`,
      ans: a, unit: 'm/s²', wrong: [F / m, (F + fk) / m, (F - mu) / m, fk / m],
      explain: `Gaya gesek kinetis: f_k = μ_k·N = ${f(mu)} × ${m} × 10 = ${f(fk)} N.<br>$\\Sigma F = ma$ → a = (F − f_k)/m = (${F} − ${f(fk)})/${m} = <b>${f(a)} m/s²</b>.`,
    };
  }});
  add({ id: 'din-gesek-statis', topic: 'dinamika', formulas: ['gaya-gesek'], level: 'C5', count: 40, gen(r) {
    const m = r.step(5, 40, 5), mus = r.pick([0.4, 0.5, 0.6]), muk = mus - r.pick([0.1, 0.2]);
    const fsMax = mus * m * 10, fkv = muk * m * 10;
    const below = r.chance(0.55);
    const F = below ? r.step(5, Math.floor(fsMax - 5), 5) : r.step(Math.ceil(fsMax / 5) * 5 + 5, Math.ceil(fsMax / 5) * 5 + 60, 5);
    if (F <= 0) return null;
    const ans = below ? F : fkv;
    return {
      q: `Sebuah lemari bermassa ${m} kg berada di lantai dengan μ_s = ${f(mus)} dan μ_k = ${f(muk)}. Lemari didorong mendatar dengan gaya ${F} N (g = 10 m/s²). Besar gaya gesek yang bekerja pada lemari adalah ….`,
      ans, unit: 'N', wrong: [fsMax, fkv, F, F - fkv, 0].filter((x) => x !== ans),
      explain: `Langkah pertama selalu cek apakah benda bergerak. f_s,maks = μ_s·N = ${f(mus)} × ${m * 10} = ${f(fsMax)} N.<br>${below ? `Karena F = ${F} N &lt; f_s,maks, lemari tetap diam. Gaya gesek statis menyesuaikan gaya dorong: f = F = <b>${F} N</b>. Jebakan: menjawab μ_sN, padahal itu hanya nilai maksimum.` : `Karena F = ${F} N &gt; f_s,maks, lemari bergerak sehingga gesekan yang bekerja adalah gesekan kinetis: f_k = μ_k·N = ${f(muk)} × ${m * 10} = <b>${f(fkv)} N</b>.`}`,
    };
  }});
  add({ id: 'din-miring', topic: 'dinamika', formulas: ['bidang-miring'], level: 'C4', count: 40, gen(r) {
    const th = r.pick([30, 37, 53]), mu = r.pick([0, 0, 0.1, 0.2, 0.25]), m = r.step(2, 10, 1);
    const a = 10 * (sin(th) - mu * cos(th));
    if (a <= 0) return null;
    return {
      q: `Balok bermassa ${m} kg dilepas dari puncak bidang miring ${mu === 0 ? 'licin' : `kasar (μ_k = ${f(mu)})`} dengan sudut kemiringan ${th}° terhadap horizontal${angNote(th)}. Jika g = 10 m/s², percepatan balok adalah ….`,
      ans: a, unit: 'm/s²', wrong: [10 * cos(th) - mu * 10 * sin(th), 10 * sin(th), 10 * (sin(th) + mu * cos(th)), m * a],
      explain: `Sepanjang bidang: $ma = mg\\sin\\theta - \\mu_k mg\\cos\\theta$ → a = g(sin θ − μ cos θ).<br>a = 10 × (${f(sin(th))} − ${f(mu)} × ${f(cos(th))}) = <b>${f(a)} m/s²</b>.<br>Massa tidak memengaruhi percepatan karena saling coret.`,
    };
  }});
  add({ id: 'din-atwood', topic: 'dinamika', formulas: ['katrol'], level: 'C4', count: 40, gen(r) {
    const m1 = r.step(2, 12, 1), m2 = r.step(1, m1 - 1 || 1, 1);
    if (m1 <= m2) return null;
    const a = ((m1 - m2) * 10) / (m1 + m2), T = (2 * m1 * m2 * 10) / (m1 + m2);
    const ask = r.pick(['a', 'T']);
    return {
      q: `Dua beban ${m1} kg dan ${m2} kg digantung pada ujung-ujung tali yang melewati katrol licin bermassa diabaikan (g = 10 m/s²). ${ask === 'a' ? 'Percepatan sistem adalah …' : 'Tegangan tali adalah …'}`,
      ans: ask === 'a' ? a : T, unit: ask === 'a' ? 'm/s²' : 'N',
      wrong: ask === 'a' ? [((m1 - m2) * 10) / m1, ((m1 + m2) * 10) / (m1 - m2), (m1 - m2) * 10, 10] : [m1 * 10, m2 * 10, (m1 + m2) * 5, m1 * a],
      explain: `a = (m₁ − m₂)g/(m₁ + m₂) = (${m1} − ${m2})×10/${m1 + m2} = ${f(a)} m/s².${ask === 'T' ? `<br>Tinjau beban ringan: T − m₂g = m₂a → T = ${m2}(10 + ${f(a)}) = <b>${f(T)} N</b>.` : ` → <b>${f(a)} m/s²</b>`}`,
    };
  }});
  add({ id: 'din-meja', topic: 'dinamika', formulas: ['katrol', 'newton-2'], level: 'C4', count: 40, gen(r) {
    const m1 = r.step(2, 10, 1), m2 = r.step(1, 8, 1), mu = r.pick([0, 0, 0.1, 0.2]);
    const a = (m2 * 10 - mu * m1 * 10) / (m1 + m2);
    if (a <= 0) return null;
    const T = m1 * a + mu * m1 * 10;
    const ask = r.pick(['a', 'T']);
    return {
      q: `Balok A (${m1} kg) terletak di atas meja ${mu ? `kasar (μ_k = ${f(mu)})` : 'licin'} dan dihubungkan tali melalui katrol licin di tepi meja dengan balok B (${m2} kg) yang tergantung (g = 10 m/s²). ${ask === 'a' ? 'Percepatan sistem adalah …' : 'Tegangan tali adalah …'}`,
      ans: ask === 'a' ? a : T, unit: ask === 'a' ? 'm/s²' : 'N',
      wrong: ask === 'a' ? [(m2 * 10) / m1, 10, (m2 * 10) / (m1 + m2) + 1, (m1 * 10) / (m1 + m2)] : [m2 * 10, m1 * 10, m2 * a, (m1 + m2) * a],
      explain: `Gaya penggerak = berat B${mu ? ' − gesekan A' : ''} = ${m2 * 10}${mu ? ` − ${f(mu * m1 * 10)}` : ''} N; massa total ${m1 + m2} kg.<br>a = ${f(m2 * 10 - mu * m1 * 10)}/${m1 + m2} = ${f(a)} m/s².${ask === 'T' ? `<br>Tinjau A: T ${mu ? '− f ' : ''}= m_A·a → T = ${m1}×${f(a)}${mu ? ` + ${f(mu * m1 * 10)}` : ''} = <b>${f(T)} N</b>. (Tegangan tali lebih kecil dari berat B karena B dipercepat ke bawah.)` : ` → <b>${f(a)} m/s²</b>`}`,
    };
  }});
  add({ id: 'din-lift', topic: 'dinamika', formulas: ['lift'], level: 'C4', count: 40, gen(r) {
    const m = r.step(40, 80, 5), a = r.pick([1, 2, 2.5, 3, 4]);
    const kind = r.pick(['naik-cepat', 'naik-lambat', 'turun-cepat', 'turun-lambat']);
    const up = kind === 'naik-cepat' || kind === 'turun-lambat';
    const N = m * (10 + (up ? a : -a));
    const desc = { 'naik-cepat': `bergerak ke atas dengan percepatan ${a} m/s²`, 'naik-lambat': `bergerak ke atas sambil diperlambat ${a} m/s²`, 'turun-cepat': `bergerak ke bawah dengan percepatan ${a} m/s²`, 'turun-lambat': `bergerak ke bawah sambil diperlambat ${a} m/s²` }[kind];
    return {
      q: `Seorang siswa bermassa ${m} kg berdiri di atas timbangan di dalam lift yang ${desc}. Jika g = 10 m/s², gaya yang ditunjukkan timbangan adalah ….`,
      ans: N, unit: 'N', wrong: [m * (10 + (up ? -a : a)), m * 10, m * a, m * (10 + 2 * a)],
      explain: `Yang menentukan adalah arah percepatan. Lift ${desc} berarti percepatan mengarah ke ${up ? 'atas' : 'bawah'}.<br>${up ? 'N − mg = ma → N = m(g + a)' : 'mg − N = ma → N = m(g − a)'} = ${m}(10 ${up ? '+' : '−'} ${a}) = <b>${f(N)} N</b>.`,
    };
  }});

  // ---------- PARABOLA ----------
  add({ id: 'par-hx', topic: 'parabola', formulas: ['parabola-hmax', 'parabola-jangkauan'], level: 'C3', count: 45, gen(r) {
    const v0 = r.step(10, 60, 5), a = r.pick([30, 37, 45, 53, 60]);
    const ask = r.pick(['h', 'x', 't']);
    const s = sin(a), c = cos(a);
    const h = (v0 * v0 * s * s) / 20, x = (v0 * v0 * 2 * s * c) / 10, t = (2 * v0 * s) / 10;
    const map = { h: [h, 'm', 'tinggi maksimum yang dicapai peluru', [(v0 * v0 * s) / 20, (v0 * v0 * c * c) / 20, (v0 * v0) / 20, 2 * h]],
      x: [x, 'm', 'jarak mendatar terjauh yang dicapai peluru (jatuh di bidang datar yang sama)', [(v0 * v0 * s * c) / 10, (v0 * v0) / 10, x / 2, (v0 * v0 * s) / 10]],
      t: [t, 's', 'lama peluru berada di udara', [(v0 * s) / 10, (2 * v0 * c) / 10, v0 / 10, (v0 * c) / 10]] }[ask];
    return {
      q: `Sebuah peluru ditembakkan dengan kecepatan awal ${v0} m/s dan sudut elevasi ${a}°${angNote(a)}. Jika g = 10 m/s², ${map[2]} adalah ….`,
      ans: map[0], unit: map[1], wrong: map[3],
      explain: { h: `$h_{maks} = \\frac{v_0^2\\sin^2\\alpha}{2g}$ = ${v0}² × ${f(s)}² / 20 = <b>${f(h)} m</b>.`,
        x: `$X = \\frac{v_0^2\\sin2\\alpha}{g} = \\frac{2v_0^2\\sin\\alpha\\cos\\alpha}{g}$ = 2 × ${v0}² × ${f(s)} × ${f(c)} / 10 = <b>${f(x)} m</b>.`,
        t: `Waktu ke puncak $t_p = \\frac{v_0\\sin\\alpha}{g}$ = ${f((v0 * s) / 10)} s; waktu di udara = 2t_p = <b>${f(t)} s</b>.` }[ask],
    };
  }});
  add({ id: 'par-horizontal', topic: 'parabola', formulas: ['parabola-horizontal'], level: 'C4', count: 40, gen(r) {
    const h = r.pick([5, 20, 45, 80, 125]), v0 = r.step(4, 30, 2);
    const t = Math.sqrt(h / 5), x = v0 * t;
    return {
      q: `Sebuah bola menggelinding dari tepi meja/atap setinggi ${h} m dengan kecepatan mendatar ${v0} m/s (g = 10 m/s²). Bola menyentuh tanah pada jarak mendatar … dari kaki bangunan.`,
      ans: x, unit: 'm', wrong: [v0 * h / 10, v0 * Math.sqrt(h / 10), v0 * 2 * t, x / 2],
      explain: `Gerak vertikal = jatuh bebas: t = √(2h/g) = √(${2 * h}/10) = ${f(t)} s.<br>Gerak horizontal = GLB: x = v₀·t = ${v0} × ${f(t)} = <b>${f(x)} m</b>.`,
    };
  }});

  // ---------- GERAK MELINGKAR ----------
  add({ id: 'gm-rpm', topic: 'melingkar', formulas: ['gmb-dasar', 'sentripetal'], level: 'C3', count: 40, gen(r) {
    const rpm = r.pick([30, 60, 120, 180, 240, 300]), R = r.pick([0.2, 0.25, 0.4, 0.5, 1, 2]);
    const w = (rpm * 2 * Math.PI) / 60;
    const ask = r.pick(['v', 'as']);
    const v = w * R, as = w * w * R;
    return {
      q: `Sebuah titik pada tepi roda berjari-jari ${f(R)} m berputar ${rpm} putaran per menit. ${ask === 'v' ? 'Kelajuan linear titik tersebut adalah …' : 'Percepatan sentripetal titik tersebut adalah …'}`,
      key: `${rpm}-${R}-${ask}`,
      ans: ask === 'v' ? v : as, unit: ask === 'v' ? 'm/s' : 'm/s²', wrong: ask === 'v' ? [rpm * R, (rpm / 60) * R, v * 2, v / 2] : [v * v, w * R * R, as / 2, as * 2],
      explain: `ω = ${rpm} × 2π/60 = ${f(rpm / 30)}π rad/s.<br>${ask === 'v' ? `v = ωR = ${f(rpm / 30)}π × ${f(R)} = ${f((rpm / 30) * R)}π ≈ <b>${f(v)} m/s</b>.` : `a_s = ω²R = (${f(rpm / 30)}π)² × ${f(R)} = ${f((rpm / 30) ** 2 * R)}π² ≈ <b>${f(as)} m/s²</b>.`}`,
    };
  }});
  add({ id: 'gm-tikungan', topic: 'melingkar', formulas: ['sentripetal'], level: 'C4', count: 35, gen(r) {
    const mu = r.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8]), R = r.step(10, 200, 10);
    const v = Math.sqrt(mu * 10 * R);
    return {
      q: `Sebuah mobil melewati tikungan datar berjari-jari ${R} m. Koefisien gesek statis antara ban dan jalan ${f(mu)} (g = 10 m/s²). Kelajuan maksimum mobil agar tidak tergelincir adalah ….`,
      ans: v, unit: 'm/s', wrong: [mu * 10 * R, Math.sqrt(10 * R), Math.sqrt((mu * 10) / R), Math.sqrt(2 * mu * 10 * R)],
      explain: `Gaya gesek statis berperan sebagai gaya sentripetal: $\\mu_s mg = m\\frac{v^2}{R}$ → v = √(μgR) = √(${f(mu)}×10×${R}) = <b>${f(v)} m/s</b>.<br>Massa mobil tidak berpengaruh.`,
    };
  }});
  add({ id: 'gm-roda', topic: 'melingkar', formulas: ['roda-hubungan'], level: 'C4', count: 40, gen(r) {
    const R1 = r.step(5, 30, 5), R2 = r.step(5, 40, 5), w1 = r.step(10, 60, 5);
    if (R1 === R2) return null;
    const type = r.pick(['singgung', 'rantai', 'sepusat']);
    const ans = type === 'sepusat' ? w1 * R2 : (w1 * R1) / R2;
    const desc = { singgung: 'bersinggungan', rantai: 'dihubungkan dengan rantai', sepusat: 'sepusat (satu poros)' }[type];
    return {
      q: `Roda A berjari-jari ${R1} cm dan roda B berjari-jari ${R2} cm ${desc}. Roda A berputar dengan kecepatan sudut ${w1} rad/s. ${type === 'sepusat' ? 'Kelajuan linear titik di tepi roda B adalah …' : 'Kecepatan sudut roda B adalah …'}`,
      ans, unit: type === 'sepusat' ? 'cm/s' : 'rad/s', wrong: type === 'sepusat' ? [w1 * R1, (w1 * R1) / R2, w1, w1 * (R1 + R2)] : [(w1 * R2) / R1, w1, w1 * R1 * R2, w1 / 2],
      explain: type === 'sepusat' ? `Roda sepusat memiliki ω sama: ω_B = ${w1} rad/s. v_B = ω_B·R_B = ${w1} × ${R2} = <b>${f(ans)} cm/s</b>.` : `Roda ${desc} memiliki kelajuan linear tepi sama: ω_A R_A = ω_B R_B → ω_B = ${w1}×${R1}/${R2} = <b>${f(ans)} rad/s</b>.`,
    };
  }});

  // ---------- GRAVITASI ----------
  add({ id: 'grav-ketinggian', topic: 'gravitasi', formulas: ['kuat-medan-gravitasi'], level: 'C4', count: 10, gen(r) {
    const k = r.pick([0.5, 1, 2, 3, 4]), g0 = r.pick([9.8, 10]);
    const g = g0 / ((1 + k) ** 2);
    return {
      q: `Percepatan gravitasi di permukaan bumi ${f(g0)} m/s². Percepatan gravitasi pada ketinggian ${k === 1 ? 'R' : f(k) + 'R'} di atas permukaan bumi (R = jari-jari bumi) adalah ….`,
      ans: g, unit: 'm/s²', wrong: [g0 / (k * k), g0 / (1 + k), g0 / k, g0 / ((1 + k) ** 3)],
      explain: `g sebanding 1/r² dengan r diukur dari pusat bumi: r = R + ${k === 1 ? '' : f(k)}R = ${f(1 + k)}R.<br>g' = g₀ × (R/r)² = ${f(g0)} / ${f((1 + k) ** 2)} = <b>${f(g)} m/s²</b>.`,
    };
  }});
  add({ id: 'grav-kepler', topic: 'gravitasi', formulas: ['kepler-3'], level: 'C4', count: 25, gen(r) {
    const ratio = r.pick([4, 9, 16, 0.25, 1 / 9]), T1 = r.pick([1, 2, 3, 8, 27]);
    const T2 = T1 * Math.pow(ratio, 1.5);
    return {
      q: `Planet A mengorbit bintang dengan periode ${T1} tahun. Planet B mengorbit bintang yang sama dengan jari-jari orbit ${ratio >= 1 ? f(ratio) + ' kali' : (ratio === 0.25 ? '¼ kali' : '1/9 kali')} jari-jari orbit planet A. Periode planet B adalah ….`,
      ans: T2, unit: 'tahun', wrong: [T1 * ratio, T1 * ratio * ratio, T1 * Math.sqrt(ratio), T1 * Math.pow(ratio, 2 / 3)],
      explain: `Hukum III Kepler: T² ∝ R³ → T_B = T_A × (R_B/R_A)^{3/2} = ${T1} × (${f(ratio)})^{1,5} = <b>${f(T2)} tahun</b>.`,
    };
  }});

  // ---------- USAHA & ENERGI ----------
  add({ id: 'ue-usaha', topic: 'usaha-energi', formulas: ['usaha'], level: 'C3', count: 35, gen(r) {
    const F = r.step(10, 100, 5), s = r.step(2, 20, 1), a = r.pick([0, 37, 53, 60, 30]);
    const c = a === 0 ? 1 : cos(a);
    const W = F * s * c;
    return {
      q: `Sebuah koper ditarik dengan gaya ${F} N yang membentuk sudut ${a}° terhadap arah perpindahan${angNote(a)}. Koper berpindah sejauh ${s} m. Usaha yang dilakukan gaya tersebut adalah ….`,
      ans: W, unit: 'J', wrong: [F * s, F * s * (a === 0 ? 0.5 : sin(a)), F / s, (F * s) / 2],
      explain: `$W = Fs\\cos\\theta$ = ${F} × ${s} × ${f(c)} = <b>${f(W)} J</b>.`,
    };
  }});
  add({ id: 'ue-teorema', topic: 'usaha-energi', formulas: ['teorema-usaha-energi'], level: 'C4', count: 40, gen(r) {
    const m = r.step(1, 20, 1), v1 = r.step(0, 10, 2), v2 = r.step(4, 30, 2);
    if (v2 <= v1) return null;
    const W = 0.5 * m * (v2 * v2 - v1 * v1);
    return {
      q: `Kecepatan benda bermassa ${m} kg bertambah dari ${v1} m/s menjadi ${v2} m/s akibat gaya total yang bekerja padanya. Usaha total yang dilakukan pada benda adalah ….`,
      ans: W, unit: 'J', wrong: [0.5 * m * (v2 - v1) ** 2, m * (v2 * v2 - v1 * v1), 0.5 * m * v2 * v2 + 0.5 * m * v1 * v1, m * (v2 - v1)],
      explain: `Teorema usaha–energi: $W = \\Delta E_k = \\tfrac12 m(v_2^2 - v_1^2)$ = ½ × ${m} × (${v2 * v2} − ${v1 * v1}) = <b>${f(W)} J</b>.<br>Jebakan: mengkuadratkan selisih kecepatan (v₂ − v₁)².`,
    };
  }});
  add({ id: 'ue-kekal', topic: 'usaha-energi', formulas: ['kekekalan-energi'], level: 'C4', count: 45, gen(r) {
    const h1 = r.step(5, 80, 5), h2 = r.step(0, h1 - 5, 5), v0 = r.pick([0, 0, 2, 4, 6]);
    const v = Math.sqrt(v0 * v0 + 20 * (h1 - h2));
    return {
      q: `Sebuah kereta luncur bergerak pada lintasan licin. Di titik A setinggi ${h1} m kelajuannya ${v0} m/s. Kelajuan kereta saat berada di titik B setinggi ${h2} m adalah … (g = 10 m/s²)`,
      ans: v, unit: 'm/s', wrong: [Math.sqrt(20 * h1), Math.sqrt(20 * (h1 - h2)) + v0, Math.sqrt(10 * (h1 - h2) + v0 * v0), 20 * (h1 - h2)],
      explain: `Kekekalan energi mekanik: ½mv_A² + mgh_A = ½mv_B² + mgh_B → v_B = √(v_A² + 2g(h_A − h_B)) = √(${v0 * v0} + 20×${h1 - h2}) = <b>${f(v)} m/s</b>.<br>Bentuk lintasan tidak berpengaruh selama licin; massa juga saling coret.`,
    };
  }});
  add({ id: 'ue-gesek', topic: 'usaha-energi', formulas: ['kekekalan-energi', 'teorema-usaha-energi'], level: 'C5', count: 35, gen(r) {
    const m = r.step(1, 10, 1), h = r.step(5, 40, 5), vb = r.step(2, Math.floor(Math.sqrt(20 * h)) - 1, 1);
    if (vb * vb >= 20 * h) return null;
    const Wf = m * 10 * h - 0.5 * m * vb * vb;
    return {
      q: `Benda bermassa ${m} kg meluncur dari puncak lintasan setinggi ${h} m tanpa kecepatan awal. Di dasar lintasan kelajuannya hanya ${vb} m/s (g = 10 m/s²). Energi yang hilang akibat gesekan sepanjang lintasan adalah ….`,
      ans: Wf, unit: 'J', wrong: [m * 10 * h, 0.5 * m * vb * vb, m * 10 * h + 0.5 * m * vb * vb, m * 10 * h - m * vb * vb],
      explain: `Energi mekanik awal = mgh = ${m}×10×${h} = ${m * 10 * h} J. Energi mekanik akhir = ½mv² = ${f(0.5 * m * vb * vb)} J.<br>Energi hilang (menjadi kalor) = ${m * 10 * h} − ${f(0.5 * m * vb * vb)} = <b>${f(Wf)} J</b>.`,
    };
  }});
  add({ id: 'ue-daya', topic: 'usaha-energi', formulas: ['daya'], level: 'C3', count: 35, gen(r) {
    const m = r.step(20, 500, 10), h = r.step(2, 30, 1), t = r.step(2, 60, 2), eff = r.pick([100, 100, 80, 75, 50]);
    const P = (m * 10 * h) / t / (eff / 100);
    return {
      q: `Sebuah mesin derek mengangkat beban ${m} kg setinggi ${h} m dalam waktu ${t} s dengan kecepatan tetap${eff < 100 ? `. Efisiensi mesin ${eff}%` : ''}. Daya ${eff < 100 ? 'masukan' : ''} mesin adalah … (g = 10 m/s²)`,
      ans: P, unit: 'W', wrong: [(m * h) / t, m * 10 * h * t, (m * 10 * h) / t * (eff / 100), (m * 10 * h) / (2 * t)],
      explain: `Usaha = mgh = ${m}×10×${h} = ${m * 10 * h} J. Daya keluaran = W/t = ${f((m * 10 * h) / t)} W.${eff < 100 ? `<br>Daya masukan = daya keluaran / η = ${f((m * 10 * h) / t)} / ${eff / 100} = <b>${f(P)} W</b>.` : ` → <b>${f(P)} W</b>.`}`,
    };
  }});

  // ---------- MOMENTUM ----------
  add({ id: 'mom-tl', topic: 'momentum', formulas: ['tidak-lenting', 'kekekalan-momentum'], level: 'C3', count: 40, gen(r) {
    const m1 = r.step(1, 10, 1), m2 = r.step(1, 10, 1), v1 = r.step(2, 20, 2), v2 = r.pick([0, 0, 2, 4, -2, -4]);
    const v = (m1 * v1 + m2 * v2) / (m1 + m2);
    if (Math.abs(v) < 0.01) return null;
    return {
      q: `Benda A (${m1} kg) bergerak ke kanan dengan kecepatan ${v1} m/s menumbuk benda B (${m2} kg) yang ${v2 === 0 ? 'diam' : `bergerak ${v2 > 0 ? 'ke kanan' : 'ke kiri'} dengan kelajuan ${Math.abs(v2)} m/s`}. Setelah tumbukan keduanya menyatu. Kecepatan keduanya sesaat setelah tumbukan adalah …`,
      ans: Math.abs(v), unit: `m/s ${v > 0 ? 'ke kanan' : 'ke kiri'}`, wrong: [(m1 * v1 + m2 * Math.abs(v2)) / (m1 + m2), (m1 * v1) / m2, (v1 + v2) / 2, (m1 * v1 - m2 * v2) / (m1 + m2)].map(Math.abs),
      explain: `Kekekalan momentum (kanan positif): m_A v_A + m_B v_B = (m_A + m_B)v'.<br>${m1}(${v1}) + ${m2}(${v2}) = ${m1 + m2}v' → v' = ${f(m1 * v1 + m2 * v2)}/${m1 + m2} = <b>${f(v)} m/s</b> (${v > 0 ? 'ke kanan' : 'ke kiri'}).`,
    };
  }});
  add({ id: 'mom-impuls', topic: 'momentum', formulas: ['momentum-def'], level: 'C4', count: 40, gen(r) {
    const m = r.pick([0.1, 0.15, 0.2, 0.25, 0.4, 0.5]), v1 = r.step(10, 40, 2), v2 = r.step(5, 30, 1), dt = r.pick([0.01, 0.02, 0.05, 0.1]);
    const ask = r.pick(['I', 'F']);
    const I = m * (v1 + v2);
    return {
      q: `Bola bermassa ${f(m)} kg datang dengan kelajuan ${v1} m/s, dipukul sehingga berbalik arah dengan kelajuan ${v2} m/s. ${ask === 'I' ? 'Besar impuls yang diberikan pemukul adalah …' : `Jika kontak berlangsung ${f(dt)} s, gaya rata-rata pemukul adalah …`}`,
      ans: ask === 'I' ? I : I / dt, unit: ask === 'I' ? 'N·s' : 'N', wrong: ask === 'I' ? [m * Math.abs(v1 - v2), m * v1, m * v2, 2 * m * v1] : [(m * Math.abs(v1 - v2)) / dt, I * dt, (m * v1) / dt, I / dt / 2],
      explain: `Ambil arah datang negatif: v₁ = −${v1} m/s, v₂ = +${v2} m/s.<br>I = Δp = m(v₂ − v₁) = ${f(m)}(${v2} + ${v1}) = ${f(I)} N·s.${ask === 'F' ? `<br>F = I/Δt = ${f(I)} / ${f(dt)} = <b>${f(I / dt)} N</b>.` : ` → <b>${f(I)} N·s</b>.`}<br>Jebakan: lupa bahwa arah berbalik sehingga kecepatan dijumlahkan.`,
    };
  }});
  add({ id: 'mom-recoil', topic: 'momentum', formulas: ['kekekalan-momentum'], level: 'C3', count: 30, gen(r) {
    const mp = r.pick([0.01, 0.02, 0.05]), vp = r.step(200, 800, 50), ms = r.pick([2, 2.5, 4, 5]);
    const vs = (mp * vp) / ms;
    return {
      q: `Senapan bermassa ${f(ms)} kg menembakkan peluru bermassa ${f(mp * 1000)} g dengan kecepatan ${vp} m/s. Kecepatan dorong (mundur) senapan adalah ….`,
      ans: vs, unit: 'm/s', wrong: [(mp * 1000 * vp) / ms, (ms * vp) / mp / 1e4, vp / ms, (mp * vp) / (ms + mp) * 2],
      explain: `Momentum awal nol: 0 = m_p v_p + m_s v_s → v_s = −m_p v_p/m_s = −(${f(mp)} × ${vp})/${f(ms)} = −${f(vs)} m/s. Besarnya <b>${f(vs)} m/s</b> berlawanan arah peluru.<br>Ubah gram ke kilogram terlebih dahulu.`,
    };
  }});
  add({ id: 'mom-restitusi', topic: 'momentum', formulas: ['koef-restitusi'], level: 'C4', count: 35, gen(r) {
    const h1 = r.pick([1, 1.6, 2, 2.5, 3.2, 4, 5, 8, 10]), e = r.pick([0.5, 0.6, 0.8, 0.4]);
    const ask = r.pick(['h2', 'h3']);
    const h = ask === 'h2' ? h1 * e * e : h1 * Math.pow(e, 4);
    return {
      q: `Bola dijatuhkan dari ketinggian ${f(h1)} m ke lantai dengan koefisien restitusi ${f(e)}. Tinggi pantulan ${ask === 'h2' ? 'pertama' : 'kedua'} bola adalah ….`,
      ans: h, unit: 'm', wrong: ask === 'h2' ? [h1 * e, h1 * Math.sqrt(e), h1 * (1 - e), h1 * e * e * e] : [h1 * e * e, h1 * e * e * e, h1 * e, h1 * Math.pow(e, 6)],
      explain: `$e = \\sqrt{h_{n+1}/h_n}$ → h_{n+1} = e²hₙ. Tinggi pantulan ke-n: hₙ = e²ⁿ h₀.<br>h = ${f(h1)} × ${f(e)}^${ask === 'h2' ? 2 : 4} = <b>${f(h)} m</b>.`,
    };
  }});

  // ---------- ELASTISITAS ----------
  add({ id: 'el-young', topic: 'elastisitas', formulas: ['tegangan-regangan'], level: 'C4', count: 35, gen(r) {
    const L = r.pick([1, 2, 2.5, 4, 5]), A = r.pick([1, 2, 4, 5]) * 1e-6, F = r.step(100, 1000, 50), E = r.pick([1, 2]) * 1e11;
    const dL = (F * L) / (A * E);
    return {
      q: `Kawat baja sepanjang ${f(L)} m dengan luas penampang ${f(A * 1e6)} mm² ditarik gaya ${F} N. Jika modulus Young baja ${f(E)} N/m², pertambahan panjang kawat adalah ….`,
      ans: dL * 1000, unit: 'mm', wrong: [dL * 1e6, dL, (F * L) / (A * 1e6 * E) * 1000, (F) / (A * E) * 1000],
      explain: `$\\Delta L = \\frac{FL_0}{AE}$; ubah A ke m²: ${f(A * 1e6)} mm² = ${f(A)} m².<br>ΔL = ${F} × ${f(L)} / (${f(A)} × ${f(E)}) = ${f(dL)} m = <b>${f(dL * 1000)} mm</b>.`,
    };
  }});
  add({ id: 'el-pegas', topic: 'elastisitas', formulas: ['pegas-susunan', 'hooke'], level: 'C4', count: 40, gen(r) {
    const k1 = r.step(100, 600, 50), k2 = r.step(100, 600, 50), m = r.pick([0.5, 1, 1.5, 2, 3]);
    const type = r.pick(['seri', 'paralel']);
    const k = type === 'seri' ? (k1 * k2) / (k1 + k2) : k1 + k2;
    const x = (m * 10) / k;
    return {
      q: `Dua pegas dengan konstanta ${k1} N/m dan ${k2} N/m disusun ${type}, lalu diberi beban ${f(m)} kg (g = 10 m/s²). Pertambahan panjang susunan pegas adalah ….`,
      ans: x * 100, unit: 'cm', wrong: [((m * 10) / (type === 'seri' ? k1 + k2 : (k1 * k2) / (k1 + k2))) * 100, ((m * 10) / k1) * 100, (m / k) * 100, x * 50],
      explain: `${type === 'seri' ? `Seri: 1/k = 1/${k1} + 1/${k2} → k = ${f(k)} N/m.` : `Paralel: k = ${k1} + ${k2} = ${k} N/m.`}<br>Δx = mg/k = ${f(m * 10)}/${f(k)} = ${f(x)} m = <b>${f(x * 100)} cm</b>.`,
    };
  }});

  // ---------- ROTASI & KESETIMBANGAN ----------
  add({ id: 'rot-torsi', topic: 'rotasi', formulas: ['torsi'], level: 'C3', count: 30, gen(r) {
    const F = r.step(10, 80, 5), d = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]), a = r.pick([90, 30, 37, 53, 60]);
    const s = a === 90 ? 1 : sin(a);
    const t = F * d * s;
    return {
      q: `Kunci pas sepanjang ${f(d * 100)} cm digunakan untuk memutar mur. Gaya ${F} N diberikan di ujung kunci dengan sudut ${a}° terhadap batang kunci${angNote(a)}. Momen gaya terhadap mur adalah ….`,
      ans: t, unit: 'N·m', wrong: [F * d * (a === 90 ? 0.5 : cos(a)), F * d * 100 * s, F / d, F * d],
      explain: `$\\tau = Fd\\sin\\theta$ dengan θ sudut antara gaya dan lengan.<br>τ = ${F} × ${f(d)} × ${f(s)} = <b>${f(t)} N·m</b>.`,
    };
  }});
  add({ id: 'rot-gelinding', topic: 'rotasi', formulas: ['menggelinding'], level: 'C5', count: 35, gen(r) {
    const bodies = [['silinder pejal', 0.5, '½'], ['bola pejal', 0.4, '⅖'], ['bola berongga', 2 / 3, '⅔'], ['cincin tipis', 1, '1']];
    const [nm, k, ks] = r.pick(bodies), h = r.pick([0.7, 1.4, 1.8, 2.1, 2.8, 3.5, 4.2, 5.6]);
    const v = Math.sqrt((20 * h) / (1 + k));
    return {
      q: `Sebuah ${nm} menggelinding tanpa slip dari keadaan diam menuruni bidang miring setinggi ${f(h)} m. Kelajuan pusat massanya di dasar bidang adalah … (g = 10 m/s²)`,
      ans: v, unit: 'm/s', wrong: [Math.sqrt(20 * h), Math.sqrt(10 * h), Math.sqrt((20 * h) / (1 + (k === 0.5 ? 0.4 : 0.5))), Math.sqrt((20 * h) / k)],
      explain: `mgh = ½mv² + ½Iω² dengan I = ${ks}·mR² dan ω = v/R → mgh = ½mv²(1 + ${ks}).<br>v = √(2gh/(1 + k)) = √(${f(20 * h)}/${f(1 + k)}) = <b>${f(v)} m/s</b>.<br>Lebih kecil dari √(2gh) karena sebagian energi menjadi energi rotasi.`,
    };
  }});
  add({ id: 'rot-momsudut', topic: 'rotasi', formulas: ['momentum-sudut'], level: 'C4', count: 30, gen(r) {
    const I1 = r.step(2, 8, 0.5), ratio = r.pick([2, 3, 4, 1.5, 2.5]), w1 = r.step(1, 6, 0.5);
    const I2 = I1 / ratio, w2 = w1 * ratio;
    return {
      q: `Seorang penari es berputar dengan kecepatan sudut ${f(w1)} putaran/s dan momen inersia ${f(I1)} kg·m² saat lengannya terentang. Ketika lengan dirapatkan, momen inersianya menjadi ${f(I2)} kg·m². Kecepatan sudutnya sekarang adalah ….`,
      ans: w2, unit: 'putaran/s', wrong: [w1 / ratio, w1, w1 * ratio * ratio, w1 * Math.sqrt(ratio)],
      explain: `Torsi luar nol → momentum sudut kekal: I₁ω₁ = I₂ω₂ → ω₂ = ${f(I1)} × ${f(w1)} / ${f(I2)} = <b>${f(w2)} putaran/s</b>.`,
    };
  }});
  add({ id: 'kes-jungkat', topic: 'kesetimbangan', formulas: ['syarat-setimbang'], level: 'C4', count: 40, gen(r) {
    const m1 = r.step(20, 60, 5), m2 = r.step(20, 60, 5), d1 = r.step(1, 2.5, 0.5);
    if (m1 === m2) return null;
    const d2 = (m1 * d1) / m2;
    if (d2 > 4) return null;
    const n1 = r.pick(NAMES), n2 = r.pick(NAMES.filter((x) => x !== n1));
    return {
      q: `${n1} (${m1} kg) duduk ${f(d1)} m dari titik tumpu jungkat-jungkit. Agar jungkat-jungkit setimbang mendatar, ${n2} (${m2} kg) harus duduk di sisi lain pada jarak … dari titik tumpu (massa papan diabaikan).`,
      ans: d2, unit: 'm', wrong: [(m2 * d1) / m1, d1, d1 * (m1 + m2) / m2 / 2, (m1 - m2) / 10 + d1],
      explain: `Στ = 0 terhadap titik tumpu: m₁g·d₁ = m₂g·d₂ → d₂ = ${m1}×${f(d1)}/${m2} = <b>${f(d2)} m</b>.`,
    };
  }});
  add({ id: 'kes-tumpuan', topic: 'kesetimbangan', formulas: ['syarat-setimbang'], level: 'C5', count: 35, gen(r) {
    const L = r.step(2, 8, 1), W = r.step(100, 600, 50), wb = r.step(100, 800, 50), x = r.step(0.5, L - 0.5, 0.5);
    const NB = (W * L / 2 + wb * x) / L, NA = W + wb - NB;
    const ask = r.pick(['A', 'B']);
    return {
      q: `Papan homogen sepanjang ${L} m dengan berat ${W} N ditopang di kedua ujungnya (A dan B). Sebuah beban ${wb} N diletakkan ${f(x)} m dari ujung A. Gaya tumpu di ujung ${ask} adalah ….`,
      ans: ask === 'A' ? NA : NB, unit: 'N', wrong: ask === 'A' ? [NB, (W + wb) / 2, W / 2 + (wb * x) / L, W + wb] : [NA, (W + wb) / 2, W / 2 + (wb * (L - x)) / L, wb],
      explain: `Ambil poros di A: N_B·${L} = ${W}×${f(L / 2)} + ${wb}×${f(x)} → N_B = ${f(NB)} N.<br>ΣF = 0: N_A = ${W} + ${wb} − ${f(NB)} = ${f(NA)} N.<br>Jadi gaya tumpu di ${ask} = <b>${f(ask === 'A' ? NA : NB)} N</b>. Gaya tumpu lebih besar di ujung yang lebih dekat dengan beban.`,
    };
  }});

  // ---------- GETARAN ----------
  add({ id: 'get-bandul', topic: 'getaran', formulas: ['bandul'], level: 'C3', count: 30, gen(r) {
    const L = r.pick([0.1, 0.4, 0.9, 1.6, 2.5, 3.6, 0.225, 0.625]), g = r.pick([10, 9.8]);
    const T = 2 * Math.PI * Math.sqrt(L / g);
    const m = r.step(50, 500, 50);
    return {
      q: `Bandul sederhana dengan panjang tali ${f(L * 100)} cm dan massa beban ${m} g diayunkan dengan simpangan kecil di tempat dengan g = ${f(g)} m/s². Periode ayunan bandul adalah ….`,
      ans: T, unit: 's', wrong: [2 * Math.PI * Math.sqrt(g / L), 2 * Math.PI * Math.sqrt((L * 100) / g) / 10 * 3, Math.PI * Math.sqrt(L / g), 2 * Math.PI * Math.sqrt((m / 1000) / L)],
      explain: `$T = 2\\pi\\sqrt{L/g}$ = 2π√(${f(L)}/${f(g)}) = <b>${f(T)} s</b>. Massa beban (${m} g) tidak memengaruhi periode, jadi informasi itu pengecoh.`,
    };
  }});
  add({ id: 'get-ghs', topic: 'getaran', formulas: ['ghs', 'energi-ghs'], level: 'C4', count: 40, gen(r) {
    const A = r.step(2, 20, 1), w = r.step(2, 20, 1), frac = r.pick([0.5, 0.6, 0.8, 0]);
    const ask = r.pick(['v', 'a', 'Ek']);
    const y = A * frac;
    if (ask === 'Ek') {
      const ek = 1 - frac * frac;
      return { q: `Sebuah benda bergetar harmonis dengan amplitudo ${A} cm. Saat simpangannya ${f(y)} cm, perbandingan energi kinetik terhadap energi total getaran adalah ….`, key: `ek-${frac}-${A}`,
        ans: ek, unit: '', sig: 3, wrong: [frac, 1 - frac, frac * frac, Math.sqrt(1 - frac * frac)],
        explain: `E_p/E = (y/A)² = ${f(frac * frac)}, sehingga E_k/E = 1 − (y/A)² = <b>${f(ek)}</b>.` };
    }
    const v = (w * Math.sqrt(A * A - y * y)) / 100, a = (w * w * y) / 100;
    if (ask === 'a' && y === 0) return null;
    return {
      q: `Sebuah benda bergetar harmonis dengan amplitudo ${A} cm dan frekuensi sudut ${w} rad/s. ${ask === 'v' ? `Kelajuan benda saat simpangannya ${f(y)} cm adalah …` : `Besar percepatan benda saat simpangannya ${f(y)} cm adalah …`}`,
      ans: ask === 'v' ? v : a, unit: ask === 'v' ? 'm/s' : 'm/s²', wrong: ask === 'v' ? [(w * A) / 100, (w * y) / 100, (w * (A - y)) / 100, w * Math.sqrt(A * A - y * y)] : [(w * w * A) / 100, (w * y) / 100, w * w * y, (w * w * (A - y)) / 100],
      explain: ask === 'v' ? `$v = \\omega\\sqrt{A^2 - y^2}$ = ${w}√(${A}² − ${f(y)}²) cm/s = ${f(v * 100)} cm/s = <b>${f(v)} m/s</b>.` : `$a = -\\omega^2 y$ → |a| = ${w}² × ${f(y)} cm = ${f(a * 100)} cm/s² = <b>${f(a)} m/s²</b>.`,
    };
  }});
})(typeof window !== 'undefined' ? window : globalThis);
