/* Bank soal Profesional Fisika bagian 2: Fluida, Kalor, Gas, Termodinamika, Gelombang, Bunyi, Optika. */
(function (root) {
  'use strict';
  const SKB = root.SKB;
  const U = SKB.util;
  const f = U.fmt;
  const add = (o) => SKB.bank.add(Object.assign({ sec: 'profesional' }, o));
  const LIQ = [['air', 1000], ['minyak', 800], ['air laut', 1030], ['alkohol', 790], ['gliserin', 1260]];

  // ---------- FLUIDA STATIS ----------
  add({ id: 'fl-hidro', topic: 'fluida-statis', formulas: ['tekanan-hidrostatis'], level: 'C3', count: 40, gen(r) {
    const [nm, rho] = r.pick(LIQ), h = r.step(0.5, 30, 0.5), tot = r.chance(0.4);
    const ph = rho * 10 * h, p = ph + 1e5;
    return {
      q: `Seorang penyelam berada pada kedalaman ${f(h)} m di bawah permukaan ${nm} (ρ = ${rho} kg/m³, g = 10 m/s²${tot ? ', tekanan udara luar 10⁵ Pa' : ''}). ${tot ? 'Tekanan total (mutlak) yang dialami penyelam adalah …' : 'Tekanan hidrostatis yang dialami penyelam adalah …'}`,
      ans: tot ? p : ph, unit: 'Pa', sig: 4, wrong: tot ? [ph, 1e5 - ph, p * 2, rho * h + 1e5] : [ph + 1e5, rho * h, ph / 10, ph * 2],
      explain: `$p_h = \\rho g h$ = ${rho} × 10 × ${f(h)} = ${f(ph, 4)} Pa.${tot ? `<br>Tekanan mutlak p = p₀ + p_h = 10⁵ + ${f(ph, 4)} = <b>${f(p, 4)} Pa</b>.` : ` → <b>${f(ph, 4)} Pa</b>.`}`,
    };
  }});
  add({ id: 'fl-pipaU', topic: 'fluida-statis', formulas: ['tekanan-hidrostatis'], level: 'C4', count: 35, gen(r) {
    const rho2 = r.pick([800, 750, 600, 900, 1200]), h2 = r.step(5, 30, 1);
    const h1 = (rho2 * h2) / 1000;
    return {
      q: `Pipa U berisi air (ρ = 1000 kg/m³). Pada kaki kiri dituangkan minyak setinggi ${h2} cm. Jika massa jenis minyak ${rho2} kg/m³, tinggi permukaan air di kaki kanan diukur dari bidang batas minyak–air adalah ….`,
      ans: h1, unit: 'cm', wrong: [(1000 * h2) / rho2, h2, h2 - h1, (h1 + h2) / 2],
      explain: `Titik-titik pada bidang batas yang sama di zat cair yang sama bertekanan sama: ρ_m h_m = ρ_a h_a.<br>h_a = ${rho2} × ${h2} / 1000 = <b>${f(h1)} cm</b>.`,
    };
  }});
  add({ id: 'fl-pascal', topic: 'fluida-statis', formulas: ['pascal'], level: 'C3', count: 40, gen(r) {
    const d1 = r.step(2, 10, 1), k = r.pick([2, 3, 4, 5, 10]), d2 = d1 * k, m = r.step(500, 3000, 100);
    const F1 = (m * 10) / (k * k);
    const byD = r.chance(0.6);
    return {
      q: byD
        ? `Dongkrak hidrolik memiliki pengisap kecil berdiameter ${d1} cm dan pengisap besar berdiameter ${d2} cm. Gaya minimum pada pengisap kecil untuk mengangkat mobil ${m} kg adalah … (g = 10 m/s²)`
        : `Dongkrak hidrolik memiliki luas pengisap kecil ${d1} cm² dan luas pengisap besar ${d1 * k * k} cm². Gaya minimum pada pengisap kecil untuk mengangkat mobil ${m} kg adalah … (g = 10 m/s²)`,
      ans: F1, unit: 'N', wrong: [(m * 10) / k, m * 10 * k * k, (m * 10) / (k * k * k), m / (k * k)],
      explain: `$\\frac{F_1}{A_1} = \\frac{F_2}{A_2}$ → F₁ = F₂ × A₁/A₂.${byD ? ` Luas sebanding kuadrat diameter: A₁/A₂ = (${d1}/${d2})² = 1/${k * k}.` : ` A₁/A₂ = 1/${k * k}.`}<br>F₁ = ${m * 10} / ${k * k} = <b>${f(F1)} N</b>.${byD ? '<br>Jebakan: memakai perbandingan diameter langsung (bukan kuadratnya).' : ''}`,
    };
  }});
  add({ id: 'fl-archimedes', topic: 'fluida-statis', formulas: ['archimedes'], level: 'C4', count: 45, gen(r) {
    const type = r.pick(['apung', 'semu', 'rho']);
    if (type === 'apung') {
      const rb = r.pick([500, 600, 700, 750, 800, 900]), [nm, rf] = r.pick(LIQ.filter((x) => x[1] > rb));
      const frac = rb / rf;
      return { q: `Sebuah balok kayu (ρ = ${rb} kg/m³) terapung di ${nm} (ρ = ${rf} kg/m³). Bagian volume balok yang muncul di atas permukaan ${nm} adalah …`,
        ans: (1 - frac) * 100, unit: '%', wrong: [frac * 100, (rb / 1000) * 100, (1 - rb / 1000) * 100 + 5, 50],
        explain: `Terapung: berat = gaya apung → ρ_b V g = ρ_f V_c g → V_c/V = ρ_b/ρ_f = ${f(frac)}.<br>Bagian yang muncul = 1 − ${f(frac)} = <b>${f((1 - frac) * 100)}%</b>.` };
    }
    if (type === 'semu') {
      const V = r.pick([100, 200, 250, 400, 500]) * 1e-6, rb = r.pick([2500, 2700, 7800, 8900, 3000]), [nm, rf] = r.pick(LIQ);
      const W = rb * V * 10, FA = rf * V * 10;
      return { q: `Sebuah benda bervolume ${f(V * 1e6)} cm³ dan massa jenis ${rb} kg/m³ dicelupkan seluruhnya ke dalam ${nm} (ρ = ${rf} kg/m³, g = 10 m/s²). Berat semu benda di dalam ${nm} adalah …`,
        ans: W - FA, unit: 'N', wrong: [W, FA, W + FA, (rb - rf) * V],
        explain: `Berat di udara W = ρ_b V g = ${f(W)} N. Gaya apung F_A = ρ_f V g = ${f(FA)} N.<br>Berat semu = W − F_A = <b>${f(W - FA)} N</b>.` };
    }
    const Wu = r.step(10, 60, 2), Wa = r.step(4, Wu - 2, 2);
    const rho = (Wu / (Wu - Wa)) * 1000;
    return { q: `Sebuah batu ditimbang dengan neraca pegas: di udara ${Wu} N dan ketika tercelup seluruhnya di dalam air ${Wa} N. Massa jenis batu adalah … (ρ air = 1000 kg/m³)`,
      ans: rho, unit: 'kg/m³', sig: 4, wrong: [(Wa / (Wu - Wa)) * 1000, (Wu / Wa) * 1000, ((Wu - Wa) / Wu) * 1000, (Wu / (Wu + Wa)) * 1000],
      explain: `Gaya apung = ${Wu} − ${Wa} = ${Wu - Wa} N = ρ_air V g.<br>ρ_batu/ρ_air = W_udara/F_A = ${Wu}/${Wu - Wa} → ρ_batu = <b>${f(rho, 4)} kg/m³</b>.` };
  }});

  // ---------- FLUIDA DINAMIS ----------
  add({ id: 'fd-kontinuitas', topic: 'fluida-dinamis', formulas: ['kontinuitas'], level: 'C3', count: 40, gen(r) {
    const d1 = r.step(4, 20, 2), k = r.pick([2, 3, 4, 0.5]), v1 = r.step(1, 10, 1);
    const d2 = d1 / k;
    if (!Number.isInteger(d2 * 2)) return null;
    const v2 = v1 * k * k;
    return {
      q: `Air mengalir dalam pipa mendatar dari penampang berdiameter ${d1} cm ke penampang berdiameter ${f(d2)} cm. Jika kelajuan air di penampang pertama ${v1} m/s, kelajuan air di penampang kedua adalah ….`,
      ans: v2, unit: 'm/s', wrong: [v1 * k, v1 / (k * k), v1 / k, v1 * k * k * k],
      explain: `Kontinuitas: A₁v₁ = A₂v₂, dengan A ∝ d².<br>v₂ = v₁ × (d₁/d₂)² = ${v1} × (${d1}/${f(d2)})² = <b>${f(v2)} m/s</b>.`,
    };
  }});
  add({ id: 'fd-debit', topic: 'fluida-dinamis', formulas: ['kontinuitas'], level: 'C3', count: 30, gen(r) {
    const V = r.step(20, 500, 20), Q = r.pick([0.5, 1, 2, 2.5, 4, 5]);
    return {
      q: `Sebuah bak mandi berkapasitas ${V} liter diisi air dari keran dengan debit ${f(Q)} liter/s. Waktu yang diperlukan untuk memenuhi bak adalah ….`,
      ans: V / Q / 60, unit: 'menit', wrong: [V / Q, (V * Q) / 60, V / Q / 3600 * 60 * 2, V / (Q * 30)],
      explain: `Q = V/t → t = V/Q = ${V}/${f(Q)} = ${f(V / Q)} s = <b>${f(V / Q / 60)} menit</b>.`,
    };
  }});
  add({ id: 'fd-torricelli', topic: 'fluida-dinamis', formulas: ['torricelli'], level: 'C4', count: 40, gen(r) {
    const H = r.step(1, 10, 0.5), h = r.step(0.2, 5, 0.2);
    const ask = r.pick(['v', 'x']);
    const v = Math.sqrt(20 * h), x = 2 * Math.sqrt(h * H);
    return {
      q: `Sebuah tangki terbuka berisi air. Pada dinding tangki terdapat lubang kecil yang berada ${f(h)} m di bawah permukaan air dan ${f(H)} m di atas tanah (g = 10 m/s²). ${ask === 'v' ? 'Kelajuan air yang memancar dari lubang adalah …' : 'Jarak mendatar air mengenai tanah diukur dari dinding tangki adalah …'}`,
      ans: ask === 'v' ? v : x, unit: ask === 'v' ? 'm/s' : 'm', wrong: ask === 'v' ? [Math.sqrt(20 * H), Math.sqrt(10 * h), 20 * h, Math.sqrt(20 * (h + H))] : [Math.sqrt(h * H), 2 * h * H, 2 * Math.sqrt(h + H), h + H],
      explain: ask === 'v' ? `Torricelli: $v = \\sqrt{2gh}$ dengan h kedalaman lubang dari permukaan: v = √(20 × ${f(h)}) = <b>${f(v)} m/s</b>.` : `v = √(2gh), waktu jatuh t = √(2H/g), sehingga x = v·t = 2√(hH) = 2√(${f(h)} × ${f(H)}) = <b>${f(x)} m</b>.`,
    };
  }});
  add({ id: 'fd-bernoulli', topic: 'fluida-dinamis', formulas: ['bernoulli'], level: 'C5', count: 35, gen(r) {
    const v1 = r.step(1, 6, 1), k = r.pick([2, 3, 4]), p1 = r.pick([1.2, 1.5, 2, 2.5, 3]) * 1e5;
    const v2 = v1 * k;
    const p2 = p1 - 0.5 * 1000 * (v2 * v2 - v1 * v1);
    if (p2 <= 0) return null;
    return {
      q: `Air (ρ = 1000 kg/m³) mengalir pada pipa mendatar. Di penampang A kelajuannya ${v1} m/s dan tekanannya ${f(p1)} Pa. Di penampang B kelajuannya ${v2} m/s. Tekanan air di penampang B adalah ….`,
      ans: p2, unit: 'Pa', sig: 4, wrong: [p1 + 0.5 * 1000 * (v2 * v2 - v1 * v1), p1 - 1000 * (v2 * v2 - v1 * v1), p1 - 0.5 * 1000 * (v2 - v1) ** 2, p1 / k],
      explain: `Pipa mendatar: $p_1 + \\tfrac12\\rho v_1^2 = p_2 + \\tfrac12\\rho v_2^2$.<br>p₂ = ${f(p1)} − ½×1000×(${v2 * v2} − ${v1 * v1}) = <b>${f(p2, 4)} Pa</b>.<br>Aliran lebih cepat → tekanan lebih kecil.`,
    };
  }});
  add({ id: 'fd-sayap', topic: 'fluida-dinamis', formulas: ['bernoulli'], level: 'C4', count: 30, gen(r) {
    const vb = r.step(40, 100, 10), va = vb + r.step(10, 40, 5), A = r.step(10, 80, 5), rho = r.pick([1.2, 1.3, 1]);
    const F = 0.5 * rho * (va * va - vb * vb) * A;
    return {
      q: `Udara (ρ = ${f(rho)} kg/m³) mengalir melewati sayap pesawat dengan kelajuan ${va} m/s di permukaan atas dan ${vb} m/s di permukaan bawah. Jika luas total sayap ${A} m², gaya angkat pada sayap adalah ….`,
      ans: F, unit: 'N', wrong: [0.5 * rho * (va - vb) ** 2 * A, rho * (va * va - vb * vb) * A, 0.5 * rho * va * va * A, 0.5 * (va * va - vb * vb) * A],
      explain: `$F = \\tfrac12\\rho(v_a^2 - v_b^2)A$ = ½ × ${f(rho)} × (${va * va} − ${vb * vb}) × ${A} = <b>${f(F)} N</b>.`,
    };
  }});

  // ---------- SUHU & KALOR ----------
  add({ id: 'sk-konversi', topic: 'suhu-kalor', formulas: ['skala-suhu'], level: 'C3', count: 35, gen(r) {
    const C = r.step(-40, 200, 5);
    const to = r.pick(['F', 'R', 'K']);
    const ans = to === 'F' ? (9 / 5) * C + 32 : to === 'R' ? (4 / 5) * C : C + 273;
    return {
      q: `Suhu suatu benda ${C} °C. Jika dinyatakan dalam skala ${{ F: 'Fahrenheit', R: 'Reamur', K: 'Kelvin' }[to]}, suhunya adalah ….`, key: `${C}-${to}`,
      ans, unit: to === 'K' ? 'K' : '°' + to, sig: 4, wrong: to === 'F' ? [(9 / 5) * C, (5 / 9) * C + 32, (9 / 5) * (C + 32), (9 / 5) * C - 32] : to === 'R' ? [(5 / 4) * C, (4 / 9) * C, C + 32, (4 / 5) * C + 32] : [C - 273, C + 100, C + 373, C * 273],
      explain: `C : R : (F − 32) : (K − 273) = 5 : 4 : 9 : 5.<br>${to === 'F' ? `F = (9/5)C + 32 = (9/5)(${C}) + 32` : to === 'R' ? `R = (4/5)C = (4/5)(${C})` : `K = C + 273 = ${C} + 273`} = <b>${f(ans, 4)}</b>.`,
    };
  }});
  add({ id: 'sk-skala-x', topic: 'suhu-kalor', formulas: ['skala-suhu'], level: 'C4', count: 30, gen(r) {
    const xb = r.step(-20, 30, 10), xa = xb + r.step(100, 200, 20), C = r.step(10, 90, 10);
    const X = xb + ((xa - xb) * C) / 100;
    return {
      q: `Termometer X menunjukkan angka ${xb} °X pada titik beku air dan ${xa} °X pada titik didih air (tekanan 1 atm). Suhu ${C} °C sama dengan … pada termometer X.`,
      ans: X, unit: '°X', sig: 4, wrong: [((xa - xb) * C) / 100, xb + C, (xa * C) / 100, xa - ((xa - xb) * C) / 100],
      explain: `$\\frac{X - X_b}{X_a - X_b} = \\frac{C - 0}{100 - 0}$ → X = ${xb} + (${xa - xb})(${C}/100) = <b>${f(X, 4)} °X</b>.`,
    };
  }});
  add({ id: 'sk-black', topic: 'suhu-kalor', formulas: ['azas-black', 'kalor'], level: 'C4', count: 45, gen(r) {
    const m1 = r.step(100, 500, 50), T1 = r.step(60, 100, 5), m2 = r.step(100, 500, 50), T2 = r.step(10, 40, 5);
    const T = (m1 * T1 + m2 * T2) / (m1 + m2);
    return {
      q: `${m1} g air bersuhu ${T1} °C dicampur dengan ${m2} g air bersuhu ${T2} °C dalam wadah yang tidak menyerap kalor. Suhu akhir campuran adalah ….`,
      ans: T, unit: '°C', wrong: [(T1 + T2) / 2, (m1 * T2 + m2 * T1) / (m1 + m2), T1 - T2, (m1 * T1 - m2 * T2) / (m1 - m2 || 1)],
      explain: `Asas Black: m₁c(T₁ − T) = m₂c(T − T₂) → T = (m₁T₁ + m₂T₂)/(m₁ + m₂).<br>T = (${m1}×${T1} + ${m2}×${T2})/${m1 + m2} = <b>${f(T)} °C</b>. Kalor jenis sama sehingga saling coret.`,
    };
  }});
  add({ id: 'sk-es', topic: 'suhu-kalor', formulas: ['kalor'], level: 'C5', count: 40, gen(r) {
    const m = r.pick([0.1, 0.2, 0.25, 0.5, 1]), Ti = r.step(-20, -2, 2), Tf = r.step(10, 80, 10);
    const ces = 2100, cair = 4200, L = 336000;
    const Q1 = m * ces * -Ti, Q2 = m * L, Q3 = m * cair * Tf, Q = Q1 + Q2 + Q3;
    return {
      q: `Es bermassa ${f(m * 1000)} g bersuhu ${Ti} °C dipanaskan hingga menjadi air bersuhu ${Tf} °C. Jika c_es = 2100 J/kg°C, c_air = 4200 J/kg°C, dan kalor lebur es 336.000 J/kg, kalor total yang diperlukan adalah ….`,
      ans: Q / 1000, unit: 'kJ', sig: 4, wrong: [(Q1 + Q3) / 1000, (Q2 + Q3) / 1000, (m * cair * (Tf - Ti)) / 1000, (Q1 + Q2) / 1000],
      explain: `Q₁ (es naik ke 0 °C) = mcΔT = ${f(m)}×2100×${-Ti} = ${f(Q1, 4)} J<br>Q₂ (melebur) = mL = ${f(m)}×336.000 = ${f(Q2, 4)} J<br>Q₃ (air 0 → ${Tf} °C) = ${f(m)}×4200×${Tf} = ${f(Q3, 4)} J<br>Total = <b>${f(Q / 1000, 4)} kJ</b>. Jebakan paling umum: melupakan kalor lebur saat perubahan wujud.`,
    };
  }});
  add({ id: 'sk-muai', topic: 'suhu-kalor', formulas: ['muai'], level: 'C3', count: 35, gen(r) {
    const mats = [['besi', 12e-6], ['tembaga', 17e-6], ['aluminium', 24e-6], ['kuningan', 19e-6]];
    const [nm, a] = r.pick(mats), L0 = r.step(1, 20, 1), dT = r.step(20, 200, 10);
    const dL = L0 * a * dT;
    const type = r.pick(['panjang', 'luas']);
    if (type === 'luas') {
      const A0 = L0;
      const dA = A0 * 2 * a * dT;
      return { q: `Pelat ${nm} (α = ${f(a)} /°C) memiliki luas ${A0} m². Jika suhunya dinaikkan ${dT} °C, pertambahan luas pelat adalah ….`,
        ans: dA * 1e4, unit: 'cm²', wrong: [A0 * a * dT * 1e4, A0 * 3 * a * dT * 1e4, dA, dA * 1e2],
        explain: `β = 2α = ${f(2 * a)} /°C.<br>ΔA = A₀βΔT = ${A0} × ${f(2 * a)} × ${dT} = ${f(dA)} m² = <b>${f(dA * 1e4)} cm²</b>.` };
    }
    return { q: `Batang ${nm} (α = ${f(a)} /°C) panjangnya ${L0} m pada suhu 20 °C. Pertambahan panjang batang jika dipanaskan hingga ${20 + dT} °C adalah ….`,
      ans: dL * 1000, unit: 'mm', wrong: [L0 * a * (20 + dT) * 1000, dL * 100, 2 * dL * 1000, dL * 1e6],
      explain: `ΔL = L₀αΔT = ${L0} × ${f(a)} × ${dT} = ${f(dL)} m = <b>${f(dL * 1000)} mm</b>. Gunakan perubahan suhu ΔT = ${dT} °C, bukan suhu akhir.` };
  }});
  add({ id: 'sk-konduksi', topic: 'suhu-kalor', formulas: ['konduksi'], level: 'C5', count: 35, gen(r) {
    const k1 = r.pick([1, 2, 3, 4]), k2 = r.pick([1, 2, 3, 4]), Th = r.step(60, 200, 10), Tc = r.step(0, 40, 10);
    if (k1 === k2) return null;
    const T = (k1 * Th + k2 * Tc) / (k1 + k2);
    return {
      q: `Dua batang P dan Q dengan panjang dan luas penampang sama disambung ujung ke ujung. Perbandingan konduktivitas termal k_P : k_Q = ${k1} : ${k2}. Ujung bebas P bersuhu ${Th} °C dan ujung bebas Q bersuhu ${Tc} °C. Suhu pada sambungan adalah ….`,
      ans: T, unit: '°C', wrong: [(Th + Tc) / 2, (k2 * Th + k1 * Tc) / (k1 + k2), (k1 * Th - k2 * Tc) / (k1 + k2), Th - (Th - Tc) * k1 / (k1 + k2) + 5],
      explain: `Laju kalor sama di kedua batang: k_P(T_P − T) = k_Q(T − T_Q).<br>${k1}(${Th} − T) = ${k2}(T − ${Tc}) → T = (${k1}×${Th} + ${k2}×${Tc})/${k1 + k2} = <b>${f(T)} °C</b>.<br>Suhu sambungan lebih dekat ke suhu ujung batang yang konduktivitasnya lebih besar.`,
    };
  }});
  add({ id: 'sk-radiasi', topic: 'suhu-kalor', formulas: ['konduksi'], level: 'C4', count: 20, gen(r) {
    const k = r.pick([2, 3, 1.5, 4]), P = r.step(20, 200, 10);
    return {
      q: `Sebuah benda hitam memancarkan energi radiasi dengan daya ${P} W pada suhu T kelvin. Jika suhu mutlaknya dinaikkan menjadi ${f(k)}T, daya radiasinya menjadi ….`,
      ans: P * k ** 4, unit: 'W', sig: 4, wrong: [P * k, P * k * k, P * k ** 3, P * k * 4],
      explain: `Stefan–Boltzmann: P = eσAT⁴ → P ∝ T⁴. P' = ${P} × ${f(k)}⁴ = <b>${f(P * k ** 4, 4)} W</b>.`,
    };
  }});

  // ---------- TEORI KINETIK GAS ----------
  add({ id: 'tk-gabungan', topic: 'teori-kinetik', formulas: ['gas-ideal'], level: 'C4', count: 45, gen(r) {
    const p1 = r.pick([1, 2, 3, 4]), V1 = r.step(2, 20, 2), T1 = r.step(250, 400, 25);
    const p2 = r.pick([1, 2, 3, 4, 6]), T2 = r.step(250, 600, 25);
    const V2 = (p1 * V1 * T2) / (T1 * p2);
    return {
      q: `Gas ideal dalam ruang tertutup mula-mula bertekanan ${p1} atm, bervolume ${V1} L, dan bersuhu ${T1} K. Gas kemudian dimampatkan/diekspansi sehingga tekanannya ${p2} atm dan suhunya ${T2} K. Volume akhir gas adalah ….`,
      ans: V2, unit: 'L', wrong: [(p2 * V1 * T2) / (T1 * p1), (p1 * V1 * T1) / (T2 * p2), (p1 * V1) / p2, (V1 * T2) / T1],
      explain: `$\\frac{p_1V_1}{T_1} = \\frac{p_2V_2}{T_2}$ → V₂ = p₁V₁T₂/(p₂T₁) = ${p1}×${V1}×${T2}/(${p2}×${T1}) = <b>${f(V2)} L</b>.`,
    };
  }});
  add({ id: 'tk-celcius', topic: 'teori-kinetik', formulas: ['gas-ideal', 'ek-gas'], level: 'C5', count: 30, gen(r) {
    const C1 = r.pick([27, 127, 77, 0, 227, 57]), C2 = r.pick([127, 327, 527, 227, 27, 77]);
    if (C1 === C2) return null;
    const ratio = (C2 + 273) / (C1 + 273);
    return {
      q: `Gas ideal dalam wadah tertutup (volume tetap) dipanaskan dari ${C1} °C menjadi ${C2} °C. Perbandingan energi kinetik rata-rata partikel gas sesudah terhadap sebelum dipanaskan adalah …`,
      ans: ratio, unit: '', sig: 3, wrong: [C1 === 0 ? 2 : C2 / C1, Math.sqrt(ratio), ratio * ratio, (C2 + 273) / (C1 + 273) + 0.5],
      explain: `$\\bar E_k = \\tfrac32 kT$ dengan T suhu mutlak. T₁ = ${C1 + 273} K, T₂ = ${C2 + 273} K.<br>Ek₂/Ek₁ = T₂/T₁ = <b>${f(ratio)}</b>. Jebakan: membandingkan suhu Celsius secara langsung.`,
    };
  }});
  add({ id: 'tk-vrms', topic: 'teori-kinetik', formulas: ['vrms'], level: 'C4', count: 25, gen(r) {
    const k = r.pick([4, 9, 0.25, 16, 2]), v = r.step(200, 800, 50);
    return {
      q: `Kecepatan efektif (v_rms) partikel suatu gas ideal pada suhu T adalah ${v} m/s. Jika suhu mutlak gas diubah menjadi ${k === 0.25 ? '¼' : f(k)} kali semula, kecepatan efektifnya menjadi ….`,
      ans: v * Math.sqrt(k), unit: 'm/s', wrong: [v * k, v / Math.sqrt(k), v * k * k, v * Math.sqrt(k) * 2],
      explain: `$v_{rms} = \\sqrt{3kT/m}$ → v ∝ √T. v' = ${v} × √${f(k)} = <b>${f(v * Math.sqrt(k))} m/s</b>.`,
    };
  }});
  add({ id: 'tk-mol', topic: 'teori-kinetik', formulas: ['gas-ideal'], level: 'C3', count: 30, gen(r) {
    const n = r.pick([0.5, 1, 2, 3, 4]), T = r.step(270, 400, 10), V = r.pick([5, 10, 20, 25, 50]) * 1e-3;
    const p = (n * 8.31 * T) / V;
    return {
      q: `Sebanyak ${f(n)} mol gas ideal berada dalam tabung bervolume ${f(V * 1000)} liter pada suhu ${T} K (R = 8,31 J/mol·K). Tekanan gas adalah ….`,
      ans: p, unit: 'Pa', wrong: [(n * 8.31 * T) / (V * 1000), (n * 8.31 * (T - 273)) / V, (n * T) / V, (8.31 * T) / (n * V)],
      explain: `pV = nRT → p = nRT/V; ubah volume: ${f(V * 1000)} L = ${f(V)} m³.<br>p = ${f(n)} × 8,31 × ${T} / ${f(V)} = <b>${f(p)} Pa</b>.`,
    };
  }});

  // ---------- TERMODINAMIKA ----------
  add({ id: 'td-carnot', topic: 'termodinamika', formulas: ['carnot'], level: 'C3', count: 40, gen(r) {
    const T1 = r.step(400, 1000, 50), T2 = r.step(250, T1 - 100, 50), ask = r.pick(['eta', 'W']);
    const eta = 1 - T2 / T1, Q1 = r.step(500, 5000, 500);
    return {
      q: ask === 'eta' ? `Mesin Carnot bekerja di antara reservoir bersuhu ${T1} K dan ${T2} K. Efisiensi mesin tersebut adalah …` : `Mesin Carnot bekerja di antara reservoir ${T1} K dan ${T2} K serta menyerap kalor ${Q1} J dari reservoir suhu tinggi setiap siklus. Usaha yang dihasilkan setiap siklus adalah …`,
      ans: ask === 'eta' ? eta * 100 : eta * Q1, unit: ask === 'eta' ? '%' : 'J', wrong: ask === 'eta' ? [(T2 / T1) * 100, (1 - T1 / (T1 + T2)) * 100, ((T1 - T2) / T2) * 100, 100 - (T2 / T1) * 50] : [(T2 / T1) * Q1, Q1, ((T1 - T2) / T2) * Q1, Q1 / 2],
      explain: `$\\eta = 1 - \\frac{T_2}{T_1}$ = 1 − ${T2}/${T1} = ${f(eta)} = ${f(eta * 100)}%.${ask === 'W' ? `<br>W = ηQ₁ = ${f(eta)} × ${Q1} = <b>${f(eta * Q1)} J</b>.` : ' → <b>' + f(eta * 100) + '%</b>.'}`,
    };
  }});
  add({ id: 'td-carnot-naik', topic: 'termodinamika', formulas: ['carnot'], level: 'C5', count: 35, gen(r) {
    const e1 = r.pick([20, 25, 30, 40]), e2 = e1 + r.pick([10, 15, 20, 25]), T2 = r.step(250, 400, 25);
    if (e2 >= 80) return null;
    const T1 = T2 / (1 - e1 / 100), T1b = T2 / (1 - e2 / 100);
    return {
      q: `Mesin Carnot dengan suhu reservoir rendah ${T2} K memiliki efisiensi ${e1}%. Agar efisiensinya naik menjadi ${e2}% dengan suhu reservoir rendah tetap, suhu reservoir tinggi harus dinaikkan sebesar ….`,
      ans: T1b - T1, unit: 'K', sig: 4, wrong: [T1b, T1, (T2 * (e2 - e1)) / 100, T1 * (e2 / e1) - T1],
      explain: `T₁ = T₂/(1 − η). Awal: T₁ = ${T2}/${f(1 - e1 / 100)} = ${f(T1, 4)} K. Akhir: T₁' = ${T2}/${f(1 - e2 / 100)} = ${f(T1b, 4)} K.<br>Kenaikan = <b>${f(T1b - T1, 4)} K</b>.`,
    };
  }});
  add({ id: 'td-hk1', topic: 'termodinamika', formulas: ['hukum-1-termo'], level: 'C4', count: 40, gen(r) {
    const Q = r.step(200, 2000, 100) * r.pick([1, 1, -1]), W = r.step(100, 1500, 100) * r.pick([1, 1, -1]);
    const dU = Q - W;
    const qs = Q > 0 ? `menyerap kalor ${Q} J` : `melepas kalor ${-Q} J`, ws = W > 0 ? `melakukan usaha ${W} J` : `menerima usaha (dikenai kerja) ${-W} J`;
    return {
      q: `Suatu gas ${qs} dan ${ws}. Perubahan energi dalam gas adalah ….`,
      ans: dU, unit: 'J', wrong: [Q + W, -dU, W - Q, Math.abs(Q) + Math.abs(W)],
      explain: `Hukum I: $Q = \\Delta U + W$ → ΔU = Q − W. Konvensi: Q (+) bila menyerap, W (+) bila gas melakukan usaha.<br>ΔU = (${Q}) − (${W}) = <b>${dU} J</b> (${dU > 0 ? 'energi dalam bertambah, suhu naik' : dU < 0 ? 'energi dalam berkurang, suhu turun' : 'suhu tetap'}).`,
    };
  }});
  add({ id: 'td-isobarik', topic: 'termodinamika', formulas: ['usaha-gas'], level: 'C3', count: 35, gen(r) {
    const p = r.pick([1, 1.5, 2, 3, 4]) * 1e5, V1 = r.step(1, 10, 1), V2 = V1 + r.step(1, 10, 1);
    const W = p * (V2 - V1) * 1e-3;
    return {
      q: `Gas dalam silinder berpengisap memuai secara isobarik pada tekanan ${f(p)} Pa dari volume ${V1} L menjadi ${V2} L. Usaha yang dilakukan gas adalah ….`,
      ans: W, unit: 'J', wrong: [p * (V2 - V1), p * V2 * 1e-3, p * (V2 + V1) * 1e-3, (p * (V2 - V1) * 1e-3) / 2],
      explain: `W = pΔV = ${f(p)} × (${V2} − ${V1}) × 10⁻³ m³ = <b>${f(W)} J</b>. Ingat 1 L = 10⁻³ m³.`,
    };
  }});
  add({ id: 'td-kulkas', topic: 'termodinamika', formulas: ['kulkas'], level: 'C4', count: 25, gen(r) {
    const T1 = r.step(290, 320, 5), T2 = r.step(250, 280, 5), W = r.step(100, 1000, 100);
    const K = T2 / (T1 - T2);
    return {
      q: `Sebuah mesin pendingin Carnot bekerja antara suhu ${T2} K (ruang dingin) dan ${T1} K (lingkungan). Jika usaha listrik yang diberikan ${W} J, kalor yang dipindahkan dari ruang dingin adalah ….`,
      ans: K * W, unit: 'J', wrong: [(T1 / (T1 - T2)) * W, ((T1 - T2) / T2) * W, W, (T2 / T1) * W],
      explain: `K = T₂/(T₁ − T₂) = ${T2}/${T1 - T2} = ${f(K)}. Q₂ = K × W = <b>${f(K * W)} J</b>.`,
    };
  }});

  // ---------- GELOMBANG ----------
  add({ id: 'gel-dasar', topic: 'gelombang', formulas: ['cepat-rambat'], level: 'C3', count: 35, gen(r) {
    const n = r.pick([1.5, 2, 2.5, 3, 4]), d = r.step(1, 12, 1), t = r.pick([0.5, 1, 2, 4]);
    const lam = d / n, fr = n / t, v = lam * fr;
    return {
      q: `Pada seutas tali terbentuk ${f(n)} gelombang sepanjang ${d} m dalam waktu ${f(t)} s. Cepat rambat gelombang pada tali adalah ….`,
      ans: v, unit: 'm/s', wrong: [d * n / t, d / t / n, lam / fr, n / (d * t)],
      explain: `λ = ${d}/${f(n)} = ${f(lam)} m; f = ${f(n)}/${f(t)} = ${f(fr)} Hz.<br>v = λf = <b>${f(v)} m/s</b> (atau langsung v = jarak/waktu = ${d}/${f(t)}).`,
    };
  }});
  add({ id: 'gel-persamaan', topic: 'gelombang', formulas: ['persamaan-gelombang'], level: 'C4', count: 45, gen(r) {
    const A = r.pick([0.02, 0.05, 0.1, 0.2, 4, 5]), w = r.pick([2, 4, 6, 8, 10, 20]) , k = r.pick([0.5, 1, 2, 4, 5]);
    const sign = r.pick(['−', '+']);
    const ask = r.pick(['v', 'lam', 'f']);
    const v = w / k, lam = 2 / k, fr = w / 2;
    const ans = ask === 'v' ? v : ask === 'lam' ? lam : fr;
    return {
      q: `Persamaan gelombang berjalan pada tali dinyatakan y = ${f(A)} sin π(${w}t ${sign} ${f(k)}x), dengan x dan y dalam meter dan t dalam sekon. ${ask === 'v' ? 'Cepat rambat gelombang tersebut adalah …' : ask === 'lam' ? 'Panjang gelombangnya adalah …' : 'Frekuensi gelombangnya adalah …'}`,
      ans, unit: ask === 'v' ? 'm/s' : ask === 'lam' ? 'm' : 'Hz', wrong: ask === 'v' ? [k / w, w * k, (w * Math.PI) / k / 2, v * 2] : ask === 'lam' ? [1 / k, k / 2, 2 * k, (2 * Math.PI) / k] : [w, w / (2 * Math.PI), 1 / w, w * 2],
      explain: `Bentuk umum y = A sin(ωt ${sign} kx). Di sini ω = ${w}π rad/s dan k = ${f(k)}π rad/m.<br>${ask === 'v' ? `v = ω/k = ${w}π/${f(k)}π = <b>${f(v)} m/s</b>` : ask === 'lam' ? `λ = 2π/k = 2π/${f(k)}π = <b>${f(lam)} m</b>` : `f = ω/2π = ${w}π/2π = <b>${f(fr)} Hz</b>`}. Tanda "${sign}" menunjukkan gelombang merambat ke arah sumbu x ${sign === '−' ? 'positif' : 'negatif'}.`,
    };
  }});
  add({ id: 'gel-melde', topic: 'gelombang', formulas: ['melde'], level: 'C4', count: 30, gen(r) {
    const F = r.step(10, 200, 10), m = r.pick([5, 10, 20, 25, 50]) * 1e-3, L = r.pick([0.5, 1, 2, 2.5, 5]);
    const mu = m / L, v = Math.sqrt(F / mu);
    return {
      q: `Seutas dawai sepanjang ${f(L)} m bermassa ${f(m * 1000)} g ditegangkan dengan gaya ${F} N. Cepat rambat gelombang transversal pada dawai adalah ….`,
      ans: v, unit: 'm/s', wrong: [Math.sqrt(F / m), Math.sqrt((F * m) / L), F / mu, Math.sqrt(F * L / (m * 1000))],
      explain: `μ = m/L = ${f(m)}/${f(L)} = ${f(mu)} kg/m.<br>$v = \\sqrt{F/\\mu}$ = √(${F}/${f(mu)}) = <b>${f(v)} m/s</b>.`,
    };
  }});

  // ---------- BUNYI ----------
  add({ id: 'bun-pipa', topic: 'bunyi', formulas: ['dawai', 'pipa-tertutup'], level: 'C4', count: 45, gen(r) {
    const type = r.pick(['terbuka', 'tertutup', 'dawai']), L = r.pick([0.25, 0.4, 0.5, 0.8, 1, 1.25]), v = r.pick([320, 340, 330]);
    const n = r.int(0, 2);
    const ord = ['nada dasar', 'nada atas pertama', 'nada atas kedua'][n];
    let fr;
    if (type === 'tertutup') fr = ((2 * n + 1) * v) / (4 * L);
    else fr = ((n + 1) * v) / (2 * L);
    const nm = type === 'dawai' ? `Dawai sepanjang ${f(L * 100)} cm dengan cepat rambat gelombang ${v} m/s` : `Pipa organa ${type} sepanjang ${f(L * 100)} cm (cepat rambat bunyi di udara ${v} m/s)`;
    return {
      q: `${nm}. Frekuensi ${ord} yang dihasilkan adalah ….`,
      ans: fr, unit: 'Hz', sig: 4, wrong: type === 'tertutup' ? [((n + 1) * v) / (2 * L), ((n + 1) * v) / (4 * L), ((2 * n + 1) * v) / (2 * L), (2 * n + 1) * v * L] : [((2 * n + 1) * v) / (4 * L), (n * v) / (2 * L) || v / (4 * L), ((n + 2) * v) / (2 * L), ((n + 1) * v) / L],
      explain: type === 'tertutup' ? `Pipa organa tertutup hanya menghasilkan harmonik ganjil: $f_n = \\frac{(2n+1)v}{4L}$ (n = 0, 1, 2, …).<br>${ord}: f = ${2 * n + 1} × ${v}/(4 × ${f(L)}) = <b>${f(fr, 4)} Hz</b>.` : `${type === 'dawai' ? 'Dawai' : 'Pipa organa terbuka'}: $f_n = \\frac{(n+1)v}{2L}$ (n = 0 untuk nada dasar).<br>${ord}: f = ${n + 1} × ${v}/(2 × ${f(L)}) = <b>${f(fr, 4)} Hz</b>.`,
    };
  }});
  add({ id: 'bun-ti', topic: 'bunyi', formulas: ['intensitas'], level: 'C4', count: 45, gen(r) {
    const TI = r.step(40, 90, 5), type = r.pick(['n', 'r']);
    if (type === 'n') {
      const n = r.pick([10, 100, 1000, 2, 5, 20]);
      const ans = TI + 10 * Math.log10(n);
      return { q: `Taraf intensitas bunyi sebuah mesin ${TI} dB. Taraf intensitas ${n} mesin identik yang berbunyi bersamaan adalah … (log 2 = 0,3)`, ans, unit: 'dB', sig: 4,
        wrong: [TI * n, TI + n, TI + 20 * Math.log10(n), TI * Math.log10(n * 10)],
        explain: `TI_n = TI₁ + 10 log n = ${TI} + 10 log ${n} = <b>${f(ans, 4)} dB</b>.<br>Jebakan: mengalikan TI dengan n. Taraf intensitas bertambah secara logaritmis.` };
    }
    const k = r.pick([10, 100, 2, 5, 20]);
    const ans = TI - 20 * Math.log10(k);
    if (ans <= 0) return null;
    return { q: `Taraf intensitas bunyi pada jarak 1 m dari sebuah sumber adalah ${TI} dB. Taraf intensitas pada jarak ${k} m dari sumber yang sama adalah … (log 2 = 0,3)`, ans, unit: 'dB', sig: 4,
      wrong: [TI / k, TI - 10 * Math.log10(k), TI / (k * k), TI - k],
      explain: `I ∝ 1/r² → TI₂ = TI₁ − 20 log(r₂/r₁) = ${TI} − 20 log ${k} = <b>${f(ans, 4)} dB</b>.` };
  }});
  add({ id: 'bun-doppler', topic: 'bunyi', formulas: ['doppler'], level: 'C4', count: 45, gen(r) {
    const v = 340, fs = r.step(400, 1000, 50), vs = r.pick([0, 10, 20, 30, 40]), vp = r.pick([0, 10, 20]);
    if (vs === 0 && vp === 0) return null;
    const sd = r.pick(['mendekat', 'menjauh']);
    const fp = sd === 'mendekat' ? ((v + vp) / (v - vs)) * fs : ((v - vp) / (v + vs)) * fs;
    const actor = vs && vp ? `Ambulans bergerak ${vs} m/s dan pengendara motor bergerak ${vp} m/s, keduanya saling ${sd}` : vs ? `Ambulans bergerak ${vs} m/s ${sd === 'mendekat' ? 'mendekati' : 'menjauhi'} seorang pejalan kaki yang diam` : `Pengendara motor bergerak ${vp} m/s ${sd === 'mendekat' ? 'mendekati' : 'menjauhi'} ambulans yang diam`;
    return {
      q: `${actor}. Sirine ambulans berfrekuensi ${fs} Hz dan cepat rambat bunyi di udara 340 m/s. Frekuensi sirine yang didengar adalah ….`,
      ans: fp, unit: 'Hz', sig: 4, wrong: [sd === 'mendekat' ? ((v - vp) / (v + vs)) * fs : ((v + vp) / (v - vs)) * fs, ((v + vs) / (v - vp)) * fs, fs, ((v + vp + vs) / v) * fs],
      explain: `$f_p = \\frac{v \\pm v_p}{v \\mp v_s} f_s$. Saling ${sd}: ${sd === 'mendekat' ? 'pembilang (v + v_p), penyebut (v − v_s)' : 'pembilang (v − v_p), penyebut (v + v_s)'}.<br>f_p = (${sd === 'mendekat' ? `340 + ${vp}` : `340 − ${vp}`})/(${sd === 'mendekat' ? `340 − ${vs}` : `340 + ${vs}`}) × ${fs} = <b>${f(fp, 4)} Hz</b>.<br>Cek nalar: saling ${sd} → frekuensi terdengar ${sd === 'mendekat' ? 'lebih tinggi' : 'lebih rendah'} dari ${fs} Hz.`,
    };
  }});

  // ---------- OPTIKA ----------
  add({ id: 'opt-cermin', topic: 'optika', formulas: ['cermin-lensa'], level: 'C4', count: 50, gen(r) {
    const type = r.pick(['cermin cekung', 'cermin cembung', 'lensa cembung', 'lensa cekung']);
    const fa = r.step(5, 30, 5), s = r.step(5, 60, 5);
    const fs = type === 'cermin cekung' || type === 'lensa cembung' ? fa : -fa;
    if (s === fs) return null;
    const si = (s * fs) / (s - fs);
    const M = Math.abs(si / s);
    const ask = r.pick(['s', 'M']);
    const sifat = `${si > 0 ? 'nyata' : 'maya'}, ${si > 0 ? 'terbalik' : 'tegak'}, ${M > 1 ? 'diperbesar' : M < 1 ? 'diperkecil' : 'sama besar'}`;
    if (ask === 'M') {
      const all = ['nyata, terbalik, diperbesar', 'nyata, terbalik, diperkecil', 'maya, tegak, diperbesar', 'maya, tegak, diperkecil', 'nyata, tegak, diperbesar', 'maya, terbalik, diperkecil', 'nyata, terbalik, sama besar'];
      return { q: `Sebuah benda diletakkan ${s} cm di depan ${type} yang ${type.startsWith('cermin') ? 'jari-jari kelengkungannya ' + 2 * fa + ' cm' : 'jarak fokusnya ' + fa + ' cm'}. Sifat bayangan yang terbentuk adalah ….`,
        correct: sifat, wrong: all.filter((x) => x !== sifat),
        explain: `${type.startsWith('cermin') ? `f = R/2 = ${fa} cm. ` : ''}Untuk ${type}, f = ${fs} cm.<br>$\\frac1{s'} = \\frac1f - \\frac1s$ → s' = ${f(si)} cm (${si > 0 ? 'positif → nyata' : 'negatif → maya'}). M = |s'/s| = ${f(M)}.<br>Sifat bayangan: <b>${sifat}</b>.` };
    }
    return {
      q: `Sebuah benda diletakkan ${s} cm di depan ${type} dengan ${type.startsWith('cermin') ? 'jari-jari kelengkungan ' + 2 * fa + ' cm' : 'jarak fokus ' + fa + ' cm'}. Jarak bayangan yang terbentuk adalah … (tanda negatif menunjukkan bayangan maya)`,
      ans: si, unit: 'cm', wrong: [(s * -fs) / (s + fs), s + fs, (s * fs) / (s + fs), -si, s * 2 * fs / (s - 2 * fs)].filter((x) => isFinite(x)), sig: 3,
      explain: `${type.startsWith('cermin') ? `f = R/2 = ${fa} cm; ` : ''}${type} → f = ${fs} cm.<br>1/s' = 1/f − 1/s = 1/${fs} − 1/${s} → s' = <b>${f(si)} cm</b> (${si > 0 ? 'nyata' : 'maya'}).`,
    };
  }});
  add({ id: 'opt-snellius', topic: 'optika', formulas: ['snellius'], level: 'C4', count: 35, gen(r) {
    const n2 = r.pick([1.33, 1.5, 1.6, 2, 2.4]), type = r.pick(['v', 'kritis', 'lambda']);
    if (type === 'v') return { q: `Cepat rambat cahaya di udara 3 × 10⁸ m/s. Cepat rambat cahaya di dalam medium berindeks bias ${f(n2)} adalah ….`, ans: 3e8 / n2, unit: 'm/s', wrong: [3e8 * n2, 3e8, 3e8 / (n2 * n2), 3e8 / (n2 - 1)], explain: `n = c/v → v = c/n = 3 × 10⁸ / ${f(n2)} = <b>${f(3e8 / n2)} m/s</b>.` };
    if (type === 'lambda') { const l = r.step(400, 700, 20); return { q: `Cahaya dengan panjang gelombang ${l} nm di udara masuk ke kaca berindeks bias ${f(n2)}. Panjang gelombang cahaya di dalam kaca adalah ….`, ans: l / n2, unit: 'nm', wrong: [l * n2, l, l / (n2 * n2), l - n2 * 100], explain: `Frekuensi tetap saat cahaya berpindah medium, sedangkan v dan λ berkurang: λ_kaca = λ_udara/n = ${l}/${f(n2)} = <b>${f(l / n2)} nm</b>.` }; }
    const s = 1 / n2;
    return { q: `Sinar datang dari medium berindeks bias ${f(n2)} menuju udara. Sinus sudut kritis bidang batas kedua medium adalah ….`, ans: s, unit: '', wrong: [n2, 1 - s, s * s, Math.sqrt(s)], explain: `sin θ_k = n₂/n₁ = 1/${f(n2)} = <b>${f(s)}</b>. Pemantulan sempurna terjadi jika sudut datang lebih besar dari θ_k dan cahaya bergerak dari medium lebih rapat ke kurang rapat.` };
  }});
  add({ id: 'opt-kacamata', topic: 'alat-optik', formulas: ['mata', 'kekuatan-lensa'], level: 'C4', count: 40, gen(r) {
    const type = r.pick(['miopi', 'hipermetropi']);
    if (type === 'miopi') {
      const PR = r.step(50, 400, 25);
      const P = -100 / PR;
      return { q: `Seorang siswa penderita miopi memiliki titik jauh ${PR} cm. Kekuatan lensa kacamata yang diperlukan agar dapat melihat benda jauh dengan normal adalah ….`, ans: P, unit: 'dioptri', wrong: [100 / PR, -PR / 100, 100 / 25 - 100 / PR, -100 / (PR - 25)],
        explain: `Miopi dikoreksi lensa cekung yang membentuk bayangan benda di tak hingga pada titik jauh: P = −100/PR = −100/${PR} = <b>${f(P)} dioptri</b>.` };
    }
    const PP = r.step(40, 200, 10);
    const P = 4 - 100 / PP;
    return { q: `Titik dekat mata seorang guru adalah ${PP} cm. Agar dapat membaca pada jarak normal 25 cm, ia memerlukan kacamata berkekuatan ….`, ans: P, unit: 'dioptri', wrong: [-P, 100 / PP, 4 + 100 / PP, 100 / 25 - PP / 100],
      explain: `Hipermetropi/presbiopi dikoreksi lensa cembung: P = 100/s_n − 100/PP = 100/25 − 100/${PP} = <b>${f(P)} dioptri</b>.` };
  }});
  add({ id: 'opt-alat', topic: 'alat-optik', formulas: ['lup', 'mikroskop', 'teropong'], level: 'C4', count: 45, gen(r) {
    const type = r.pick(['lup', 'lup-akom', 'teropong', 'mikroskop']);
    if (type === 'lup' || type === 'lup-akom') {
      const fl = r.pick([2.5, 5, 6.25, 10, 12.5]);
      const M = 25 / fl + (type === 'lup-akom' ? 1 : 0);
      return { q: `Sebuah lup memiliki jarak fokus ${f(fl)} cm. Perbesaran anguler lup untuk mata normal (titik dekat 25 cm) yang ${type === 'lup' ? 'tidak berakomodasi' : 'berakomodasi maksimum'} adalah ….`, ans: M, unit: 'kali', wrong: [25 / fl + (type === 'lup' ? 1 : 0), fl / 25, 25 * fl / 10, 25 / fl - 1],
        explain: `${type === 'lup' ? 'Tidak berakomodasi: M = s_n/f' : 'Berakomodasi maksimum: M = s_n/f + 1'} = 25/${f(fl)}${type === 'lup' ? '' : ' + 1'} = <b>${f(M)} kali</b>.` };
    }
    if (type === 'teropong') {
      const fob = r.step(50, 200, 10), fok = r.step(2, 10, 1);
      const ask = r.pick(['M', 'd']);
      return { q: `Teropong bintang memiliki lensa objektif berfokus ${fob} cm dan lensa okuler berfokus ${fok} cm. ${ask === 'M' ? 'Perbesaran teropong untuk mata tidak berakomodasi adalah …' : 'Panjang teropong untuk mata tidak berakomodasi adalah …'}`,
        ans: ask === 'M' ? fob / fok : fob + fok, unit: ask === 'M' ? 'kali' : 'cm', wrong: ask === 'M' ? [fok / fob, fob * fok, fob + fok, fob - fok] : [fob - fok, fob / fok, fob * fok / 10, fob + 2 * fok],
        explain: ask === 'M' ? `M = f_ob/f_ok = ${fob}/${fok} = <b>${f(fob / fok)} kali</b>.` : `d = f_ob + f_ok = ${fob} + ${fok} = <b>${fob + fok} cm</b>.` };
    }
    const fob = r.pick([0.5, 0.8, 1, 1.5, 2]), sob = fob + r.pick([0.1, 0.2, 0.25, 0.5]), fok = r.pick([2.5, 5, 6.25]);
    const sobi = (sob * fob) / (sob - fob), M = (sobi / sob) * (25 / fok);
    return { q: `Mikroskop memiliki objektif berfokus ${f(fob)} cm dan okuler berfokus ${f(fok)} cm. Preparat diletakkan ${f(sob)} cm di depan objektif. Perbesaran total untuk mata normal tidak berakomodasi adalah ….`, ans: M, unit: 'kali', wrong: [(sobi / sob) * (25 / fok + 1), (sobi / sob) + 25 / fok, (sob / sobi) * (25 / fok), 25 / fok],
      explain: `Objektif: 1/s'_ob = 1/${f(fob)} − 1/${f(sob)} → s'_ob = ${f(sobi)} cm; M_ob = ${f(sobi / sob)}.<br>Okuler (tak berakomodasi): M_ok = 25/f_ok = ${f(25 / fok)}.<br>M = M_ob × M_ok = <b>${f(M)} kali</b>.` };
  }});
})(typeof window !== 'undefined' ? window : globalThis);
