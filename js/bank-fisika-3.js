/* Bank soal Profesional Fisika bagian 3: Besaran, Listrik, Magnet, Induksi, AC, Gelombang EM, Fisika Modern. */
(function (root) {
  'use strict';
  const SKB = root.SKB;
  const U = SKB.util;
  const f = U.fmt;
  const add = (o) => SKB.bank.add(Object.assign({ sec: 'profesional' }, o));

  // ---------- BESARAN ----------
  const DIM = [
    ['gaya', 'MLT⁻²'], ['usaha', 'ML²T⁻²'], ['daya', 'ML²T⁻³'], ['momentum', 'MLT⁻¹'], ['tekanan', 'ML⁻¹T⁻²'],
    ['massa jenis', 'ML⁻³'], ['percepatan', 'LT⁻²'], ['kecepatan', 'LT⁻¹'], ['impuls', 'MLT⁻¹'], ['energi kinetik', 'ML²T⁻²'],
    ['konstanta pegas', 'MT⁻²'], ['debit', 'L³T⁻¹'], ['frekuensi', 'T⁻¹'], ['momen gaya', 'ML²T⁻²'], ['tegangan permukaan', 'MT⁻²'],
    ['muatan listrik', 'IT'], ['kalor', 'ML²T⁻²'], ['momen inersia', 'ML²'], ['kecepatan sudut', 'T⁻¹'], ['modulus Young', 'ML⁻¹T⁻²'],
  ];
  const DIM_EXPL = { gaya: 'F = m·a', usaha: 'W = F·s', daya: 'P = W/t', momentum: 'p = m·v', tekanan: 'p = F/A', 'massa jenis': 'ρ = m/V', percepatan: 'a = Δv/Δt', kecepatan: 'v = s/t', impuls: 'I = F·Δt', 'energi kinetik': 'Ek = ½mv²', 'konstanta pegas': 'k = F/Δx', debit: 'Q = V/t', frekuensi: 'f = 1/T', 'momen gaya': 'τ = F·d', 'tegangan permukaan': 'γ = F/L', 'muatan listrik': 'q = I·t', kalor: 'Q = mcΔT (setara energi)', 'momen inersia': 'I = mr²', 'kecepatan sudut': 'ω = θ/t', 'modulus Young': 'E = tegangan/regangan' };
  add({ id: 'bes-dimensi', topic: 'besaran', formulas: ['dimensi-turunan'], level: 'C2', count: 20, gen(r, k) {
    const [nm, d] = DIM[k % DIM.length];
    const others = Array.from(new Set(DIM.map((x) => x[1]).filter((x) => x !== d)));
    return { q: `Dimensi dari besaran ${nm} adalah ….`, key: nm, correct: `[${d}]`, wrong: others.map((x) => `[${x}]`),
      explain: `Gunakan rumus definisi: ${DIM_EXPL[nm]}.<br>Dimensi ${nm} = <b>[${d}]</b>.` };
  }});
  add({ id: 'bes-dimensi-sama', topic: 'besaran', formulas: ['dimensi-turunan'], level: 'C4', count: 20, gen(r) {
    const groups = {};
    DIM.forEach(([n, d]) => { (groups[d] = groups[d] || []).push(n); });
    const pairs = Object.values(groups).filter((g) => g.length >= 2);
    const g = r.pick(pairs);
    const [a, b] = r.sample(g, 2);
    const correct = `${a} dan ${b}`;
    const wrong = [];
    for (let i = 0; i < 30 && wrong.length < 6; i++) {
      const [x, y] = r.sample(DIM, 2);
      if (x[1] !== y[1]) wrong.push(`${x[0]} dan ${y[0]}`);
    }
    return { q: 'Pasangan besaran berikut yang memiliki dimensi sama adalah ….', key: correct, correct, wrong,
      explain: `${a} (${DIM_EXPL[a]}) dan ${b} (${DIM_EXPL[b]}) sama-sama berdimensi [${DIM.find((x) => x[0] === a)[1]}].<br>Pasangan lain berbeda dimensinya. Ingat: besaran berdimensi sama belum tentu besaran yang sama (contoh: usaha dan momen gaya).` };
  }});
  add({ id: 'bes-ap', topic: 'besaran', formulas: ['angka-penting'], level: 'C3', count: 30, gen(r) {
    const p = r.pick(['12,5', '8,24', '3,05', '15,0', '2,40', '6,3']), l = r.pick(['4,2', '2,1', '3,25', '1,5', '0,52']);
    const pv = parseFloat(p.replace(',', '.')), lv = parseFloat(l.replace(',', '.'));
    const ap = (s) => s.replace(',', '').replace(/^0+/, '').length;
    const n = Math.min(ap(p), ap(l));
    const A = pv * lv;
    const correct = Number(A.toPrecision(n)).toString().replace('.', ',');
    const raw = String(Math.round(A * 10000) / 10000).replace('.', ',');
    const wrong = [raw, Number(A.toPrecision(n + 1)).toString().replace('.', ','), Number(A.toPrecision(Math.max(1, n - 1))).toString().replace('.', ','), Number((A * 1.1).toPrecision(n)).toString().replace('.', ','), Number(A.toPrecision(n + 2)).toString().replace('.', ','), A.toFixed(1).replace('.', ','), A.toFixed(2).replace('.', ','), String(Math.round(A)), Number((A * 0.9).toPrecision(n)).toString().replace('.', ',')].map((x) => x + ' m²');
    return { q: `Hasil pengukuran panjang dan lebar sebuah pelat adalah ${p} m dan ${l} m. Luas pelat menurut aturan angka penting adalah ….`, correct: correct + ' m²', wrong,
      explain: `${p} memiliki ${ap(p)} angka penting, ${l} memiliki ${ap(l)} angka penting. Hasil perkalian mengikuti AP paling sedikit (${n} AP).<br>${p} × ${l} = ${raw} → dibulatkan menjadi <b>${correct} m²</b>.` };
  }});

  // ---------- LISTRIK STATIS ----------
  add({ id: 'ls-coulomb', topic: 'listrik-statis', formulas: ['coulomb'], level: 'C3', count: 40, gen(r) {
    const q1 = r.step(1, 9, 1), q2 = r.step(1, 9, 1), rr = r.pick([1, 2, 3, 5, 10, 20, 30]);
    const F = (9e9 * q1 * 1e-6 * q2 * 1e-6) / ((rr / 100) ** 2);
    return {
      q: `Dua muatan titik +${q1} μC dan ${r.chance(0.5) ? '+' : '−'}${q2} μC terpisah sejauh ${rr} cm di udara (k = 9 × 10⁹ N·m²/C²). Besar gaya Coulomb antara kedua muatan adalah ….`, key: `${q1}-${q2}-${rr}`,
      ans: F, unit: 'N', wrong: [F * 100, F / 100, (9e9 * q1 * 1e-6 * q2 * 1e-6) / (rr / 100), F * 1e4],
      explain: `$F = k\\frac{q_1q_2}{r^2}$ = 9 × 10⁹ × (${q1} × 10⁻⁶)(${q2} × 10⁻⁶)/(${f(rr / 100)})² = <b>${f(F)} N</b>.<br>Tanda muatan hanya menentukan arah (tarik/tolak), bukan besar gaya. Ubah cm → m dan μC → C.`,
    };
  }});
  add({ id: 'ls-titik-nol', topic: 'listrik-statis', formulas: ['coulomb', 'medan-listrik'], level: 'C5', count: 18, gen(r) {
    const pairs = [[1, 4], [1, 9], [4, 9], [1, 16], [4, 25], [9, 16], [1, 25], [9, 25]];
    const [a, b] = r.pick(pairs), d = r.step(10, 90, 6);
    const ra = Math.sqrt(a), rb = Math.sqrt(b);
    const x = (d * ra) / (ra + rb);
    if (!Number.isInteger(x * 2)) return null;
    return {
      q: `Muatan A = +${a}q dan muatan B = +${b}q terpisah sejauh ${d} cm. Titik C terletak di antara A dan B dengan kuat medan listrik nol. Jarak titik C dari muatan A adalah ….`,
      ans: x, unit: 'cm', wrong: [d - x, (d * a) / (a + b), d / 2, (d * b) / (a + b)],
      explain: `E_A = E_B → k·${a}q/x² = k·${b}q/(${d} − x)² → x/(${d} − x) = √${a}/√${b} = ${ra}/${rb}.<br>x = ${d} × ${ra}/${ra + rb} = <b>${f(x)} cm</b>. Titik nol selalu lebih dekat ke muatan yang lebih kecil.`,
    };
  }});
  add({ id: 'ls-kapasitor', topic: 'listrik-statis', formulas: ['kapasitor'], level: 'C4', count: 45, gen(r) {
    const C1 = r.step(2, 12, 1), C2 = r.step(2, 12, 1), C3 = r.step(2, 12, 1), V = r.step(6, 24, 6);
    const type = r.pick(['seri', 'paralel', 'campur']);
    let C, desc;
    if (type === 'seri') { C = 1 / (1 / C1 + 1 / C2); desc = `C₁ = ${C1} μF dan C₂ = ${C2} μF disusun seri`; }
    else if (type === 'paralel') { C = C1 + C2; desc = `C₁ = ${C1} μF dan C₂ = ${C2} μF disusun paralel`; }
    else { C = 1 / (1 / (C1 + C2) + 1 / C3); desc = `C₁ = ${C1} μF dan C₂ = ${C2} μF disusun paralel, kemudian diseri dengan C₃ = ${C3} μF`; }
    const ask = r.pick(['Q', 'W']);
    const Q = C * V, W = 0.5 * C * V * V;
    return {
      q: `Kapasitor ${desc}, lalu dihubungkan dengan sumber tegangan ${V} V. ${ask === 'Q' ? 'Muatan total yang tersimpan adalah …' : 'Energi total yang tersimpan adalah …'}`,
      ans: ask === 'Q' ? Q : W, unit: ask === 'Q' ? 'μC' : 'μJ', wrong: ask === 'Q' ? [(C1 + C2 + (type === 'campur' ? C3 : 0)) * V, (1 / (1 / C1 + 1 / C2)) * V * (type === 'seri' ? 2 : 1), C * V * V, C / V] : [C * V * V, 0.5 * C * V, 0.5 * (C1 + C2) * V * V * (type === 'paralel' ? 2 : 1), W * 2],
      explain: `${type === 'seri' ? `C_s = C₁C₂/(C₁ + C₂) = ${f(C)} μF` : type === 'paralel' ? `C_p = C₁ + C₂ = ${f(C)} μF` : `C_p = ${C1 + C2} μF; C_total = (${C1 + C2} × ${C3})/(${C1 + C2} + ${C3}) = ${f(C)} μF`}.<br>${ask === 'Q' ? `Q = C·V = ${f(C)} × ${V} = <b>${f(Q)} μC</b>.` : `W = ½CV² = ½ × ${f(C)} × ${V}² = <b>${f(W)} μJ</b>.`}`,
    };
  }});

  // ---------- LISTRIK DINAMIS ----------
  add({ id: 'ld-rangkaian', topic: 'listrik-dinamis', formulas: ['seri-paralel', 'ohm'], level: 'C4', count: 50, gen(r) {
    const R1 = r.step(2, 12, 1), R2 = r.step(2, 12, 2), R3 = r.step(2, 12, 2), V = r.step(6, 36, 6);
    const Rp = (R2 * R3) / (R2 + R3), Rt = R1 + Rp, I = V / Rt;
    const ask = r.pick(['I', 'I2', 'V1']);
    const Vp = I * Rp;
    const map = { I: [I, 'A', 'kuat arus total yang keluar dari sumber'], I2: [Vp / R2, 'A', `kuat arus yang melalui R₂`], V1: [I * R1, 'V', 'beda potensial pada R₁'] }[ask];
    return {
      q: `Hambatan R₂ = ${R2} Ω dan R₃ = ${R3} Ω disusun paralel, kemudian diseri dengan R₁ = ${R1} Ω. Rangkaian dihubungkan dengan baterai ${V} V (hambatan dalam diabaikan). Besar ${map[2]} adalah ….`,
      ans: map[0], unit: map[1], wrong: ask === 'I' ? [V / (R1 + R2 + R3), V / R1, V / Rp, (V * (R2 + R3)) / (R2 * R3)] : ask === 'I2' ? [I, (Vp / R3), V / R2, I / 2] : [V, Vp, (V * R1) / (R1 + R2 + R3), V - I * R1],
      explain: `R_p = R₂R₃/(R₂ + R₃) = ${f(Rp)} Ω; R_total = ${R1} + ${f(Rp)} = ${f(Rt)} Ω.<br>I = V/R = ${V}/${f(Rt)} = ${f(I)} A.${ask === 'I2' ? `<br>V_paralel = I·R_p = ${f(Vp)} V → I₂ = V_p/R₂ = ${f(Vp)}/${R2} = <b>${f(Vp / R2)} A</b>.` : ask === 'V1' ? `<br>V₁ = I·R₁ = ${f(I)} × ${R1} = <b>${f(I * R1)} V</b>.` : ' → <b>' + f(I) + ' A</b>.'}`,
    };
  }});
  add({ id: 'ld-ggl', topic: 'listrik-dinamis', formulas: ['ggl-internal'], level: 'C4', count: 40, gen(r) {
    const E = r.pick([1.5, 3, 6, 9, 12]), rin = r.pick([0.2, 0.5, 1, 1.5, 2]), R = r.step(1, 20, 1), n = r.pick([1, 2, 3, 4]);
    const I = (n * E) / (R + n * rin), Vj = I * R;
    const ask = r.pick(['I', 'V']);
    return {
      q: `${n === 1 ? 'Sebuah baterai' : n + ' baterai identik disusun seri, masing-masing'} dengan GGL ${f(E)} V dan hambatan dalam ${f(rin)} Ω dihubungkan dengan hambatan luar ${R} Ω. ${ask === 'I' ? 'Kuat arus dalam rangkaian adalah …' : 'Tegangan jepit pada hambatan luar adalah …'}`,
      ans: ask === 'I' ? I : Vj, unit: ask === 'I' ? 'A' : 'V', wrong: ask === 'I' ? [(n * E) / R, E / (R + rin), (n * E) / (R + rin), (n * E) / (n * R + rin)] : [n * E, n * E - I * R, E * R / (R + rin), I * (R + n * rin) / 2],
      explain: `${n > 1 ? `Seri: ε_total = ${n} × ${f(E)} = ${f(n * E)} V; r_total = ${n} × ${f(rin)} = ${f(n * rin)} Ω.<br>` : ''}$I = \\frac{\\varepsilon}{R + r}$ = ${f(n * E)}/(${R} + ${f(n * rin)}) = ${f(I)} A.${ask === 'V' ? `<br>V_jepit = I·R = ${f(I)} × ${R} = <b>${f(Vj)} V</b> (lebih kecil dari GGL karena ada tegangan hilang I·r).` : ' → <b>' + f(I) + ' A</b>.'}`,
    };
  }});
  add({ id: 'ld-daya', topic: 'listrik-dinamis', formulas: ['daya-listrik'], level: 'C4', count: 40, gen(r) {
    const P = r.pick([25, 40, 60, 100]), V = 220, V2 = r.pick([110, 55, 165]);
    const type = r.pick(['tegangan', 'biaya']);
    if (type === 'tegangan') {
      const P2 = P * (V2 / V) ** 2;
      return { q: `Lampu bertuliskan ${P} W/220 V dipasang pada tegangan ${V2} V. Daya yang dipakai lampu adalah ….`, ans: P2, unit: 'W', wrong: [P * (V2 / V), P, P * (V / V2) ** 2, P * (V2 / V) ** 3],
        explain: `Hambatan lampu tetap: R = V²/P = 220²/${P} = ${f((V * V) / P)} Ω.<br>P' = V'²/R = (${V2}/220)² × ${P} = <b>${f(P2)} W</b>.<br>Jebakan: menganggap daya sebanding tegangan (bukan kuadratnya).` };
    }
    const n = r.int(2, 8), h = r.int(2, 12), tarif = r.pick([1000, 1200, 1350, 1500]), hari = 30;
    const kwh = (n * P * h * hari) / 1000;
    return { q: `Sebuah rumah menyalakan ${n} lampu ${P} W selama ${h} jam setiap hari. Jika tarif listrik Rp${f(tarif)}/kWh, biaya pemakaian lampu selama ${hari} hari adalah ….`, ans: kwh * tarif, unit: 'rupiah', sig: 6, wrong: [((n * P * h) / 1000) * tarif, n * P * h * hari * tarif / 100, kwh * tarif / n, kwh * tarif * 2],
      explain: `Energi = ${n} × ${P} W × ${h} jam × ${hari} hari = ${f(n * P * h * hari, 6)} Wh = ${f(kwh, 4)} kWh.<br>Biaya = ${f(kwh, 4)} × ${f(tarif)} = <b>Rp${f(kwh * tarif, 6)}</b>.` };
  }});
  add({ id: 'ld-kirchhoff', topic: 'listrik-dinamis', formulas: ['kirchhoff'], level: 'C5', count: 40, gen(r) {
    const E1 = r.step(6, 18, 2), E2 = r.step(2, 12, 2), R1 = r.step(1, 6, 1), R2 = r.step(1, 6, 1), R3 = r.step(2, 8, 2);
    // dua sumber paralel melalui R1 dan R2, beban R3 di tengah (cabang tengah). Solusi node: V = (E1/R1 + E2/R2)/(1/R1+1/R2+1/R3)
    const Vn = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3);
    const I3 = Vn / R3;
    return {
      q: `Rangkaian dua loop: cabang kiri berisi baterai ε₁ = ${E1} V seri dengan R₁ = ${R1} Ω, cabang kanan berisi baterai ε₂ = ${E2} V seri dengan R₂ = ${R2} Ω, dan cabang tengah berisi hambatan R₃ = ${R3} Ω. Kutub positif kedua baterai terhubung ke titik cabang yang sama di bagian atas. Kuat arus yang melalui R₃ adalah … (hambatan dalam baterai diabaikan)`,
      ans: I3, unit: 'A', wrong: [(E1 + E2) / (R1 + R2 + R3), (E1 - E2) / (R1 + R2), E1 / (R1 + R3), (E1 + E2) / R3],
      explain: `Gunakan metode tegangan titik cabang (gabungan Hukum I dan II Kirchhoff). Misalkan potensial titik atas V (titik bawah 0 V):<br>(ε₁ − V)/R₁ + (ε₂ − V)/R₂ = V/R₃<br>V = (${E1}/${R1} + ${E2}/${R2}) / (1/${R1} + 1/${R2} + 1/${R3}) = ${f(Vn)} V.<br>I₃ = V/R₃ = <b>${f(I3)} A</b>.`,
    };
  }});
  add({ id: 'ld-kawat', topic: 'listrik-dinamis', formulas: ['ohm'], level: 'C5', count: 25, gen(r) {
    const R = r.step(2, 40, 2), k = r.pick([2, 3, 4]);
    const type = r.pick(['tarik', 'potong']);
    if (type === 'tarik') return { q: `Seutas kawat berhambatan ${R} Ω ditarik sehingga panjangnya menjadi ${k} kali semula (volume kawat tetap). Hambatan kawat sekarang adalah ….`, ans: R * k * k, unit: 'Ω', wrong: [R * k, R, R / k, R * k * k * k],
      explain: `Volume tetap: L naik ${k} kali → A turun menjadi 1/${k} kali.<br>R = ρL/A → R' = R × ${k} × ${k} = <b>${f(R * k * k)} Ω</b>.` };
    return { q: `Seutas kawat berhambatan ${R} Ω dipotong menjadi ${k} bagian sama panjang, lalu potongan-potongan itu dipasang paralel. Hambatan penggantinya adalah ….`, ans: R / (k * k), unit: 'Ω', wrong: [R / k, R, R * k, R / (k * k * k)],
      explain: `Tiap potongan berhambatan R/${k} = ${f(R / k)} Ω. ${k} hambatan identik paralel: R_p = (R/${k})/${k} = <b>${f(R / (k * k))} Ω</b>.` };
  }});

  // ---------- MAGNET ----------
  add({ id: 'mg-kawat', topic: 'magnet', formulas: ['medan-kawat-lurus', 'medan-lingkaran'], level: 'C3', count: 45, gen(r) {
    const type = r.pick(['lurus', 'lingkar', 'solenoida']);
    const I = r.step(1, 20, 1);
    if (type === 'lurus') { const a = r.pick([1, 2, 4, 5, 10, 20]); const B = (2e-7 * I) / (a / 100);
      return { q: `Kawat lurus panjang dialiri arus ${I} A. Besar induksi magnetik di titik yang berjarak ${a} cm dari kawat adalah … (μ₀ = 4π × 10⁻⁷ Wb/A·m)`, ans: B, unit: 'T', wrong: [(2e-7 * I) / a, (4e-7 * Math.PI * I) / (a / 100), B * 2, (2e-7 * I) / ((a / 100) ** 2)],
        explain: `$B = \\frac{\\mu_0 I}{2\\pi a}$ = (4π × 10⁻⁷ × ${I})/(2π × ${f(a / 100)}) = <b>${f(B)} T</b>.` }; }
    if (type === 'lingkar') { const a = r.pick([2, 4, 5, 10, 2 * Math.PI]); const N = r.pick([1, 10, 20, 50, 100]); const B = (4e-7 * Math.PI * I * N) / (2 * (a / 100));
      if (a > 7) return null;
      return { q: `Kawat melingkar ${N === 1 ? '' : 'sebanyak ' + N + ' lilitan '}berjari-jari ${a} cm dialiri arus ${I} A. Besar induksi magnetik di pusat lingkaran adalah … (μ₀ = 4π × 10⁻⁷ Wb/A·m)`, ans: B, unit: 'T', wrong: [B / Math.PI, (2e-7 * I * N) / (a / 100), B * 2, B / N],
        explain: `$B = \\frac{\\mu_0 I N}{2a}$ = (4π × 10⁻⁷ × ${I} × ${N})/(2 × ${f(a / 100)}) = <b>${f(B)} T</b>.` }; }
    const N = r.step(100, 2000, 100), L = r.pick([0.2, 0.25, 0.5, 1, 0.4 * Math.PI]); if (L > 1.2) return null;
    const B = (4e-7 * Math.PI * N * I) / L;
    const pos = r.pick(['pusat', 'ujung']);
    const Bp = pos === 'pusat' ? B : B / 2;
    return { q: `Solenoida sepanjang ${f(L * 100)} cm memiliki ${N} lilitan dan dialiri arus ${I} A. Besar induksi magnetik di ${pos} solenoida adalah … (μ₀ = 4π × 10⁻⁷ Wb/A·m)`, ans: Bp, unit: 'T', wrong: [pos === 'pusat' ? B / 2 : B, (4e-7 * N * I) / L, Bp * 4, (4e-7 * Math.PI * N * I) / (2 * Math.PI * L)],
      explain: `Pusat solenoida: $B = \\frac{\\mu_0 N I}{L}$ = ${f(B)} T.${pos === 'ujung' ? `<br>Di ujung solenoida, B = ½ B_pusat = <b>${f(Bp)} T</b>.` : ' → <b>' + f(B) + ' T</b>.'}` };
  }});
  add({ id: 'mg-lorentz', topic: 'magnet', formulas: ['lorentz'], level: 'C3', count: 40, gen(r) {
    const type = r.pick(['kawat', 'muatan', 'jari']);
    if (type === 'kawat') { const B = r.pick([0.02, 0.05, 0.1, 0.2, 0.5]), I = r.step(1, 20, 1), L = r.pick([0.1, 0.2, 0.5, 1, 2]), th = r.pick([90, 30, 53, 37]);
      const s = th === 90 ? 1 : th === 30 ? 0.5 : th === 53 ? 0.8 : 0.6;
      return { q: `Kawat sepanjang ${f(L * 100)} cm berarus ${I} A berada dalam medan magnet homogen ${f(B)} T. Sudut antara kawat dan arah medan ${th}°${th === 37 || th === 53 ? ' (sin 37° = 0,6)' : ''}. Gaya Lorentz pada kawat adalah ….`, ans: B * I * L * s, unit: 'N', wrong: [B * I * L, B * I * L * (th === 90 ? 0.5 : Math.sqrt(1 - s * s)), B * I * L * 100 * s, (B * I) / L],
        explain: `$F = BIL\\sin\\theta$ = ${f(B)} × ${I} × ${f(L)} × ${f(s)} = <b>${f(B * I * L * s)} N</b>.` }; }
    if (type === 'muatan') { const q = 1.6e-19, v = r.pick([1, 2, 3, 5]) * 1e6, B = r.pick([0.1, 0.2, 0.5, 1]);
      return { q: `Sebuah proton (q = 1,6 × 10⁻¹⁹ C) bergerak dengan kecepatan ${f(v)} m/s tegak lurus medan magnet ${f(B)} T. Besar gaya magnetik pada proton adalah ….`, ans: q * v * B, unit: 'N', wrong: [v * B, (q * v) / B, q * B, q * v * B * 2],
        explain: `$F = qvB\\sin 90°$ = 1,6 × 10⁻¹⁹ × ${f(v)} × ${f(B)} = <b>${f(q * v * B)} N</b>. Arah gaya tegak lurus v dan B sehingga proton bergerak melingkar.` }; }
    const I1 = r.step(2, 20, 2), I2 = r.step(2, 20, 2), a = r.pick([2, 4, 5, 10]);
    const F = (2e-7 * I1 * I2) / (a / 100);
    const same = r.chance(0.5);
    return { q: `Dua kawat sejajar panjang berjarak ${a} cm masing-masing dialiri arus ${I1} A dan ${I2} A dengan arah ${same ? 'sama' : 'berlawanan'}. Gaya per satuan panjang antara kedua kawat adalah …`, ans: F, unit: `N/m (${same ? 'tarik-menarik' : 'tolak-menolak'})`,
      wrong: [(2e-7 * I1 * I2) / a, F * 2, (2e-7 * (I1 + I2)) / (a / 100), F / 2],
      explain: `$\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi a}$ = 2 × 10⁻⁷ × ${I1} × ${I2}/${f(a / 100)} = <b>${f(F)} N/m</b>. Arus searah → tarik-menarik; berlawanan → tolak-menolak.` };
  }});

  // ---------- INDUKSI ----------
  add({ id: 'ind-faraday', topic: 'induksi', formulas: ['faraday'], level: 'C3', count: 40, gen(r) {
    const N = r.step(50, 1000, 50), d1 = r.pick([0.1, 0.2, 0.5, 0.8]), d2 = r.pick([0, 0.05, 0.1, 0.3]), t = r.pick([0.1, 0.2, 0.5, 1, 2]);
    if (d2 >= d1) return null;
    const A = r.pick([0.01, 0.02, 0.05]);
    const e = (N * A * (d1 - d2)) / t;
    return {
      q: `Kumparan ${N} lilitan dengan luas penampang ${f(A * 1e4)} cm² berada dalam medan magnet yang tegak lurus bidang kumparan. Medan magnet berkurang dari ${f(d1)} T menjadi ${f(d2)} T dalam ${f(t)} s. Besar GGL induksi rata-rata pada kumparan adalah ….`,
      ans: e, unit: 'V', wrong: [(N * A * d1) / t, (A * (d1 - d2)) / t, N * A * (d1 - d2) * t, (N * A * 1e4 * (d1 - d2)) / t],
      explain: `ΔΦ = A·ΔB = ${f(A)} × ${f(d1 - d2)} = ${f(A * (d1 - d2))} Wb.<br>$|\\varepsilon| = N\\frac{\\Delta\\Phi}{\\Delta t}$ = ${N} × ${f(A * (d1 - d2))}/${f(t)} = <b>${f(e)} V</b>. Ubah cm² → m².`,
    };
  }});
  add({ id: 'ind-batang', topic: 'induksi', formulas: ['ggl-batang'], level: 'C3', count: 30, gen(r) {
    const B = r.pick([0.1, 0.2, 0.4, 0.5, 1]), L = r.pick([0.2, 0.25, 0.5, 1]), v = r.step(2, 20, 2), R = r.pick([0, 1, 2, 4, 5]);
    const e = B * L * v;
    if (R) return { q: `Batang konduktor sepanjang ${f(L * 100)} cm digerakkan dengan kecepatan ${v} m/s memotong tegak lurus medan magnet ${f(B)} T pada rel yang ujungnya dihubungkan hambatan ${R} Ω. Kuat arus induksi yang mengalir adalah ….`, ans: e / R, unit: 'A', wrong: [e, e * R, (B * v) / R, (B * L) / (v * R)],
      explain: `ε = BLv = ${f(B)} × ${f(L)} × ${v} = ${f(e)} V; I = ε/R = <b>${f(e / R)} A</b>.` };
    return { q: `Batang konduktor sepanjang ${f(L * 100)} cm bergerak ${v} m/s tegak lurus medan magnet ${f(B)} T. GGL induksi antara ujung-ujung batang adalah ….`, ans: e, unit: 'V', wrong: [B * L * 100 * v, (B * v) / L, B * L, e / 2], explain: `ε = BLv = ${f(B)} × ${f(L)} × ${v} = <b>${f(e)} V</b>.` };
  }});
  add({ id: 'ind-trafo', topic: 'induksi', formulas: ['trafo'], level: 'C4', count: 45, gen(r) {
    const Np = r.step(100, 2000, 100), Ns = r.step(50, 2000, 50), Vp = r.pick([110, 220, 12, 24, 240]);
    if (Np === Ns) return null;
    const Vs = (Vp * Ns) / Np, ask = r.pick(['Vs', 'Ip']);
    if (ask === 'Vs') return { q: `Transformator ideal memiliki ${Np} lilitan primer dan ${Ns} lilitan sekunder. Jika tegangan primer ${Vp} V, tegangan sekundernya adalah ….`, ans: Vs, unit: 'V', wrong: [(Vp * Np) / Ns, Vp, Vp * (Ns - Np) / Np, Vs * 2],
      explain: `$\\frac{V_p}{V_s} = \\frac{N_p}{N_s}$ → V_s = ${Vp} × ${Ns}/${Np} = <b>${f(Vs)} V</b> (trafo ${Ns > Np ? 'step-up' : 'step-down'}).` };
    const eta = r.pick([100, 80, 90, 75]), Is = r.pick([0.5, 1, 2, 4]);
    const Ip = (Vs * Is) / (Vp * (eta / 100));
    return { q: `Trafo dengan ${Np} lilitan primer dan ${Ns} lilitan sekunder dihubungkan ke tegangan ${Vp} V. Arus sekunder ${f(Is)} A dan efisiensi trafo ${eta}%. Arus primer trafo adalah ….`, ans: Ip, unit: 'A', wrong: [(Vs * Is * (eta / 100)) / Vp, (Ns * Is) / Np * (eta === 100 ? 2 : 1), (Np * Is) / Ns, Is],
      explain: `V_s = ${Vp} × ${Ns}/${Np} = ${f(Vs)} V; P_s = V_sI_s = ${f(Vs * Is)} W.<br>P_p = P_s/η = ${f((Vs * Is) / (eta / 100))} W → I_p = P_p/V_p = <b>${f(Ip)} A</b>.` };
  }});
  add({ id: 'ind-generator', topic: 'induksi', formulas: ['generator'], level: 'C3', count: 25, gen(r) {
    const N = r.step(50, 500, 50), B = r.pick([0.1, 0.2, 0.5]), A = r.pick([0.01, 0.02, 0.04, 0.05]), w = r.step(50, 300, 50);
    const e = N * B * A * w;
    return { q: `Kumparan generator ${N} lilitan dengan luas ${f(A * 1e4)} cm² berputar dengan kecepatan sudut ${w} rad/s dalam medan magnet ${f(B)} T. GGL maksimum yang dihasilkan adalah ….`, ans: e, unit: 'V', wrong: [B * A * w, N * B * A, e / Math.SQRT2, N * B * A * 1e4 * w],
      explain: `$\\varepsilon_{maks} = NBA\\omega$ = ${N} × ${f(B)} × ${f(A)} × ${w} = <b>${f(e)} V</b>.` };
  }});

  // ---------- AC ----------
  add({ id: 'ac-rlc', topic: 'listrik-ac', formulas: ['rlc', 'reaktansi'], level: 'C4', count: 45, gen(r) {
    const triples = [[3, 4], [6, 8], [5, 12], [8, 6], [12, 16], [9, 12], [8, 15], [20, 15], [30, 40], [40, 30]];
    const [R, X] = r.pick(triples);
    const XC = r.step(10, 60, 5), XL = XC + X * r.pick([1, -1]);
    if (XL <= 0) return null;
    const Z = Math.sqrt(R * R + X * X), V = r.pick([50, 100, 130, 200, 260]);
    const ask = r.pick(['Z', 'I', 'cos']);
    const map = { Z: [Z, 'Ω', 'impedansi rangkaian'], I: [V / Z, 'A', 'kuat arus efektif'], cos: [R / Z, '', 'faktor daya rangkaian'] }[ask];
    return {
      q: `Rangkaian seri RLC dengan R = ${R} Ω, X_L = ${XL} Ω, dan X_C = ${XC} Ω dihubungkan dengan sumber AC bertegangan efektif ${V} V. Besar ${map[2]} adalah ….`,
      ans: map[0], unit: map[1], wrong: ask === 'Z' ? [R + XL + XC, R + Math.abs(XL - XC), Math.sqrt(R * R + (XL + XC) ** 2), Math.sqrt(R * R + XL * XL)] : ask === 'I' ? [V / (R + XL + XC), V / R, V / Math.abs(XL - XC), (V * Math.SQRT2) / Z] : [Math.abs(XL - XC) / Z, R / Math.abs(XL - XC), Z / R / 2, 1],
      explain: `$Z = \\sqrt{R^2 + (X_L - X_C)^2}$ = √(${R}² + ${XL - XC}²) = ${f(Z)} Ω.${ask === 'I' ? `<br>I = V/Z = ${V}/${f(Z)} = <b>${f(V / Z)} A</b>.` : ask === 'cos' ? `<br>cos φ = R/Z = ${R}/${f(Z)} = <b>${f(R / Z)}</b>. Rangkaian bersifat ${XL > XC ? 'induktif' : 'kapasitif'}.` : ' → <b>' + f(Z) + ' Ω</b>.'}`,
    };
  }});
  add({ id: 'ac-efektif', topic: 'listrik-ac', formulas: ['efektif'], level: 'C3', count: 14, gen(r) {
    const Vm = r.pick([100, 141, 200, 220, 311, 50, 300]) , type = r.pick(['ef', 'max']);
    if (type === 'ef') return { q: `Osiloskop menunjukkan tegangan bolak-balik dengan nilai maksimum ${Vm} V. Tegangan yang terbaca pada voltmeter AC adalah ….`, ans: Vm / Math.SQRT2, unit: 'V', wrong: [Vm, Vm * Math.SQRT2, Vm / 2, (2 * Vm) / Math.PI], explain: `Voltmeter AC membaca nilai efektif: V_ef = V_maks/√2 = ${Vm}/√2 = <b>${f(Vm / Math.SQRT2)} V</b>.` };
    return { q: `Tegangan listrik PLN di rumah adalah ${Vm} V (nilai efektif). Tegangan maksimumnya adalah ….`, ans: Vm * Math.SQRT2, unit: 'V', wrong: [Vm, Vm / Math.SQRT2, Vm * 2, Vm * 1.5], explain: `V_maks = V_ef × √2 = ${Vm} × 1,414 = <b>${f(Vm * Math.SQRT2)} V</b>.` };
  }});
  add({ id: 'ac-resonansi', topic: 'listrik-ac', formulas: ['rlc'], level: 'C4', count: 25, gen(r) {
    const L = r.pick([0.1, 0.2, 0.4, 0.5, 1]), C = r.pick([1, 2, 4, 5, 10, 25]) * 1e-6;
    const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
    return { q: `Rangkaian seri RLC memiliki induktor ${f(L)} H dan kapasitor ${f(C * 1e6)} μF. Frekuensi resonansi rangkaian adalah ….`, ans: f0, unit: 'Hz', wrong: [1 / Math.sqrt(L * C), 1 / (2 * Math.PI * L * C), 2 * Math.PI * Math.sqrt(L * C), f0 * 2],
      explain: `$f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$ = 1/(2π√(${f(L)} × ${f(C)})) = <b>${f(f0)} Hz</b>.` };
  }});

  // ---------- GELOMBANG EM & OPTIKA FISIS ----------
  add({ id: 'em-young', topic: 'gelombang-em', formulas: ['young'], level: 'C4', count: 40, gen(r) {
    const d = r.pick([0.1, 0.2, 0.25, 0.5, 1]) * 1e-3, L = r.pick([0.5, 1, 1.5, 2]), lam = r.step(400, 700, 20) * 1e-9, n = r.int(1, 4);
    const ask = r.pick(['y', 'dy']);
    const dy = (lam * L) / d, y = n * dy;
    return {
      q: `Celah ganda berjarak ${f(d * 1000)} mm disinari cahaya monokromatik ${f(lam * 1e9)} nm. Layar diletakkan ${f(L)} m dari celah. ${ask === 'y' ? `Jarak garis terang ke-${n} dari terang pusat adalah …` : 'Jarak antara dua garis terang yang berdekatan adalah …'}`,
      ans: (ask === 'y' ? y : dy) * 1000, unit: 'mm', wrong: ask === 'y' ? [(n - 0.5) * dy * 1000, (n + 1) * dy * 1000, ((lam * d) / L) * n * 1e9, y * 1e6] : [dy * 2000, dy * 500, ((lam * d) / L) * 1e9, dy * 1e6],
      explain: `Terang ke-n: $\\frac{dy}{L} = n\\lambda$ → y = nλL/d.<br>${ask === 'y' ? `y = ${n} × ${f(lam)} × ${f(L)}/${f(d)} = ${f(y)} m = <b>${f(y * 1000)} mm</b>.` : `Δy = λL/d = ${f(lam)} × ${f(L)}/${f(d)} = ${f(dy)} m = <b>${f(dy * 1000)} mm</b>.`}`,
    };
  }});
  add({ id: 'em-kisi', topic: 'gelombang-em', formulas: ['kisi'], level: 'C4', count: 30, gen(r) {
    const N = r.pick([2000, 4000, 5000, 2500, 3000]), n = r.int(1, 2), s = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]);
    const d = 0.01 / N, lam = (d * s) / n;
    return { q: `Kisi difraksi memiliki ${N} goresan per cm. Spektrum orde ke-${n} terlihat pada sudut θ dengan sin θ = ${f(s)}. Panjang gelombang cahaya yang digunakan adalah ….`, ans: lam * 1e9, unit: 'nm', wrong: [(N * s) / n, ((0.01 * N * s) / n) * 1e9 / 1e9, lam * 1e9 * n * n, lam * 1e9 / 10, lam * 1e10],
      explain: `d = 1/N = 1/${N} cm = ${f(d)} m.<br>d sin θ = nλ → λ = ${f(d)} × ${f(s)}/${n} = ${f(lam)} m = <b>${f(lam * 1e9)} nm</b>.` };
  }});
  add({ id: 'em-polarisasi', topic: 'gelombang-em', formulas: ['polarisasi'], level: 'C4', count: 20, gen(r) {
    const I0 = r.step(16, 160, 16), th = r.pick([30, 45, 60, 90, 0]);
    const c2 = { 0: 1, 30: 0.75, 45: 0.5, 60: 0.25, 90: 0 }[th];
    const I = 0.5 * I0 * c2;
    if (I === 0) return null;
    return { q: `Cahaya tak terpolarisasi berintensitas ${I0} W/m² melewati polarisator dan analisator yang sumbu transmisinya membentuk sudut ${th}°. Intensitas cahaya yang keluar dari analisator adalah ….`, ans: I, unit: 'W/m²', wrong: [I0 * c2, 0.5 * I0, 0.5 * I0 * Math.sqrt(c2), I0 * Math.sqrt(c2)],
      explain: `Polarisator meloloskan ½I₀ = ${I0 / 2} W/m². Analisator (Hukum Malus): I = ½I₀cos²θ = ${I0 / 2} × ${f(c2)} = <b>${f(I)} W/m²</b>.` };
  }});
  const EMS = ['gelombang radio', 'gelombang mikro', 'sinar inframerah', 'cahaya tampak', 'sinar ultraviolet', 'sinar-X', 'sinar gamma'];
  const EMUSE = { 'gelombang radio': 'komunikasi siaran radio dan televisi', 'gelombang mikro': 'radar dan pemanas makanan (microwave)', 'sinar inframerah': 'remote control dan kamera termal', 'cahaya tampak': 'penglihatan dan fotosintesis', 'sinar ultraviolet': 'sterilisasi alat dan pembentukan vitamin D', 'sinar-X': 'foto rontgen tulang', 'sinar gamma': 'terapi kanker dan sterilisasi makanan' };
  add({ id: 'em-spektrum', topic: 'gelombang-em', formulas: ['spektrum-em'], level: 'C2', count: 28, gen(r, k) {
    if (k < 7) {
      const e = EMS[k];
      return { q: `Gelombang elektromagnetik yang dimanfaatkan untuk ${EMUSE[e]} adalah ….`, key: e, correct: e, wrong: EMS, explain: `${e[0].toUpperCase() + e.slice(1)} digunakan untuk ${EMUSE[e]}.<br>Urutan spektrum dari frekuensi terendah: ${EMS.join(' → ')}.` };
    }
    const [a, b, c] = r.sample([0, 1, 2, 3, 4, 5, 6], 3).sort((x, y) => x - y);
    const order = r.pick(['naik', 'turun']);
    const seq = order === 'naik' ? [a, b, c] : [c, b, a];
    const correct = seq.map((i) => EMS[i]).join(' – ');
    const perms = [[a, c, b], [b, a, c], [c, a, b], [b, c, a], [order === 'naik' ? c : a, b, order === 'naik' ? a : c]].map((p) => p.map((i) => EMS[i]).join(' – '));
    return { q: `Urutan gelombang elektromagnetik berikut dari ${order === 'naik' ? 'frekuensi terendah ke tertinggi' : 'panjang gelombang terpendek ke terpanjang'} adalah ….`, key: correct + order, correct, wrong: perms,
      explain: `Urutan frekuensi naik (panjang gelombang turun): ${EMS.join(' → ')}.<br>Jawaban: <b>${correct}</b>.` };
  }});

  // ---------- FISIKA MODERN ----------
  add({ id: 'mod-foton', topic: 'atom-kuantum', formulas: ['foton', 'fotolistrik'], level: 'C4', count: 45, gen(r) {
    const type = r.pick(['energi', 'fotolistrik', 'bohr']);
    if (type === 'energi') { const lam = r.step(200, 700, 50) * 1e-9; const E = (6.63e-34 * 3e8) / lam;
      return { q: `Energi sebuah foton cahaya dengan panjang gelombang ${f(lam * 1e9)} nm adalah … (h = 6,63 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s)`, ans: E, unit: 'J', wrong: [(6.63e-34 * lam) / 3e8, 6.63e-34 * 3e8 * lam, E * 10, E / 1.6e-19], explain: `$E = \\frac{hc}{\\lambda}$ = (6,63 × 10⁻³⁴ × 3 × 10⁸)/${f(lam)} = <b>${f(E)} J</b>.` }; }
    if (type === 'fotolistrik') { const W0 = r.pick([1.8, 2, 2.2, 2.5, 3]), Ef = W0 + r.pick([0.5, 1, 1.5, 2, 2.5]);
      return { q: `Logam dengan fungsi kerja ${f(W0)} eV disinari foton berenergi ${f(Ef)} eV. Energi kinetik maksimum elektron yang terlepas adalah ….`, ans: Ef - W0, unit: 'eV', wrong: [Ef + W0, Ef, W0, Ef / W0], explain: `$E_{k,maks} = hf - W_0$ = ${f(Ef)} − ${f(W0)} = <b>${f(Ef - W0)} eV</b>.<br>Jika energi foton lebih kecil dari fungsi kerja, elektron tidak lepas berapa pun intensitas cahayanya.` }; }
    const n1 = r.int(1, 3), n2 = n1 + r.int(1, 3);
    const E = 13.6 * (1 / (n1 * n1) - 1 / (n2 * n2));
    return { q: `Elektron atom hidrogen bertransisi dari kulit n = ${n2} ke kulit n = ${n1}. Energi foton yang dipancarkan adalah …`, ans: E, unit: 'eV', wrong: [13.6 / (n1 * n1), 13.6 / (n2 * n2), 13.6 * (1 / n1 - 1 / n2), 13.6 * (1 / (n1 * n1) + 1 / (n2 * n2))],
      explain: `$E_n = -\\frac{13{,}6}{n^2}$ eV. ΔE = 13,6(1/${n1}² − 1/${n2}²) = <b>${f(E)} eV</b>. Transisi ke kulit lebih dalam memancarkan foton.` };
  }});
  add({ id: 'mod-wien', topic: 'atom-kuantum', formulas: ['wien'], level: 'C3', count: 17, gen(r) {
    const T = r.step(2000, 10000, 500);
    const lam = 2.9e-3 / T;
    return { q: `Sebuah bintang memiliki suhu permukaan ${f(T)} K. Panjang gelombang pada intensitas radiasi maksimum adalah … (konstanta Wien 2,9 × 10⁻³ m·K)`, ans: lam * 1e9, unit: 'nm', wrong: [2.9e-3 * T, lam * 1e6, lam * 1e9 * 2, (2.9e-3 / (T - 273)) * 1e9], explain: `λ_maks = 2,9 × 10⁻³/${T} = ${f(lam)} m = <b>${f(lam * 1e9)} nm</b>.` };
  }});
  add({ id: 'mod-paruh', topic: 'inti', formulas: ['peluruhan'], level: 'C4', count: 40, gen(r) {
    const T = r.pick([2, 3, 5, 8, 10, 12, 20]), n = r.int(1, 5), N0 = r.pick([16, 32, 64, 80, 120, 160, 200, 256]);
    const ask = r.pick(['N', 'T']);
    const N = N0 / 2 ** n;
    if (ask === 'N') return { q: `Unsur radioaktif bermassa ${N0} g memiliki waktu paruh ${T} hari. Massa unsur yang tersisa setelah ${n * T} hari adalah ….`, ans: N, unit: 'g', wrong: [N0 - N, N0 / n, N0 / (2 * n), N0 / 2 ** (n + 1)],
      explain: `${n * T} hari = ${n} × waktu paruh. N = N₀(½)^${n} = ${N0}/${2 ** n} = <b>${f(N)} g</b>.` };
    return { q: `Setelah ${n * T} hari, unsur radioaktif tersisa ${f((100 / 2 ** n))}% dari jumlah awalnya. Waktu paruh unsur tersebut adalah ….`, ans: T, unit: 'hari', wrong: [n * T, (n * T) / (n + 1), 2 * T, (n * T) / 2 ** n],
      explain: `Sisa ${f(100 / 2 ** n)}% = (½)^${n}, berarti telah lewat ${n} waktu paruh. T½ = ${n * T}/${n} = <b>${T} hari</b>.` };
  }});
  add({ id: 'mod-defek', topic: 'inti', formulas: ['defek-massa', 'reaksi-inti'], level: 'C4', count: 6, gen(r) {
    const dm = r.pick([0.0024, 0.0186, 0.0304, 0.0098, 0.0122, 0.0055]);
    return { q: `Pada suatu reaksi inti, massa total reaktan lebih besar ${f(dm, 4)} sma daripada massa total produk. Jika 1 sma setara 931 MeV, energi yang dibebaskan reaksi tersebut adalah ….`, ans: dm * 931, unit: 'MeV', wrong: [dm * 931 * 1000, dm / 931, dm * 931 / 2, dm * 9e16], explain: `Q = Δm × 931 MeV = ${f(dm, 4)} × 931 = <b>${f(dm * 931)} MeV</b>.` };
  }});
  add({ id: 'mod-relativitas', topic: 'relativitas', formulas: ['dilatasi', 'kontraksi', 'massa-energi'], level: 'C4', count: 45, gen(r) {
    const V = r.pick([[0.6, 1.25], [0.8, 5 / 3]]), [b, g] = V;
    const type = r.pick(['waktu', 'panjang', 'massa', 'ek']);
    const x = r.pick([10, 12, 20, 24, 30, 40, 60, 100]);
    const map = {
      waktu: [`Seorang astronaut di dalam pesawat yang bergerak ${f(b)}c mengukur selang waktu suatu peristiwa di dalam pesawat ${x} menit. Selang waktu peristiwa tersebut menurut pengamat di bumi adalah …`, x * g, 'menit', [x / g, x, x * b, x * g * g], `Δt = γΔt₀ dengan γ = 1/√(1 − ${f(b)}²) = ${f(g)}.<br>Δt = ${f(g)} × ${x} = <b>${f(x * g)} menit</b> (jam bergerak tampak lebih lambat).`],
      panjang: [`Sebuah pesawat panjangnya ${x} m saat diam. Panjang pesawat menurut pengamat di bumi saat pesawat bergerak ${f(b)}c sejajar panjangnya adalah …`, x / g, 'm', [x * g, x, x * b, x / (g * g)], `L = L₀/γ = L₀√(1 − v²/c²) = ${x} × ${f(1 / g)} = <b>${f(x / g)} m</b>.`],
      massa: [`Massa diam sebuah partikel ${x} g. Massa relativistik partikel saat bergerak ${f(b)}c adalah …`, x * g, 'g', [x / g, x, x * b, x * g * g], `m = γm₀ = ${f(g)} × ${x} = <b>${f(x * g)} g</b>.`],
      ek: [`Sebuah partikel bermassa diam m₀ bergerak dengan kecepatan ${f(b)}c. Energi kinetiknya sama dengan … kali energi diamnya.`, g - 1, '', [g, 1 / g, 0.5 * b * b, g * g - 1], `E_k = (γ − 1)m₀c² = (${f(g)} − 1)m₀c² = <b>${f(g - 1)}</b> m₀c². Jebakan: menggunakan ½mv² (hanya berlaku untuk v ≪ c, hasilnya ${f(0.5 * b * b)}).`],
    }[type];
    return { q: map[0], key: type + b + (type === 'ek' ? '' : x), ans: map[1], unit: map[2], wrong: map[3], explain: map[4] };
  }});
})(typeof window !== 'undefined' ? window : globalThis);
