/* Bank soal Pedagogik: skenario pembelajaran fisika (HOTS) yang dibangkitkan dari data materi. */
(function (root) {
  'use strict';
  const SKB = root.SKB;
  const U = SKB.util;
  const M = SKB.PED_MATERI;
  const NM = M.length;
  const add = (o) => SKB.bank.add(Object.assign({ sec: 'pedagogik', level: 'C4' }, o));
  const GURU = ['Pak Hendra', 'Bu Rina', 'Pak Arif', 'Bu Sinta', 'Pak Dimas', 'Bu Nur', 'Pak Yoga', 'Bu Maya', 'Pak Rudi', 'Bu Lina', 'Pak Bayu', 'Bu Ratih'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const kelas = (r, T) => (T.fase === 'E' ? 'X' : r.pick(['XI', 'XII']));
  const ctx = (r, T) => ({ g: r.pick(GURU), k: kelas(r, T) });

  // 1. Konflik kognitif
  add({ id: 'ped-konflik', topic: 'miskonsepsi', count: NM, gen(r, k) {
    const T = M[k % NM], c = ctx(r, T);
    return {
      q: `Saat pembelajaran ${T.m} di kelas ${c.k}, ${c.g} menemukan banyak peserta didik berpendapat bahwa "${T.mis[0]}". Tindakan guru yang paling tepat untuk mengubah konsepsi tersebut adalah ….`,
      correct: `meminta peserta didik menuliskan prediksinya, kemudian ${T.demo}, lalu membimbing diskusi untuk membandingkan prediksi dengan hasil pengamatan`,
      wrong: ['menjelaskan ulang definisi konsep yang benar secara lebih rinci melalui ceramah', 'memberikan latihan soal hitungan yang lebih banyak agar peserta didik terbiasa', 'meminta peserta didik menghafal konsep yang benar dari buku teks', 'menegur peserta didik yang berpendapat keliru agar lebih teliti membaca buku', 'melanjutkan ke materi berikutnya karena miskonsepsi akan hilang dengan sendirinya', 'menayangkan video ringkasan materi tanpa sesi diskusi'],
      explain: `Miskonsepsi bersifat resisten dan tidak hilang hanya dengan ceramah. Strategi perubahan konseptual (Posner dkk.) menuntut peserta didik merasa tidak puas dengan konsepsi lamanya, lalu menemukan konsep baru yang masuk akal dan berguna. Pola Predict–Observe–Explain dengan demonstrasi yang hasilnya bertentangan dengan prediksi menimbulkan konflik kognitif.<br>Konsep ilmiah yang perlu dibangun: <i>${T.mis[1]}</i>.`,
    };
  }});

  // 2. Instrumen diagnostik miskonsepsi
  add({ id: 'ped-diagnostik', topic: 'asesmen', count: NM, gen(r, k) {
    const T = M[k % NM], c = ctx(r, T);
    return {
      q: `${c.g} ingin membedakan peserta didik yang mengalami miskonsepsi, yang tidak tahu konsep, dan yang menebak pada materi ${T.m}. Instrumen yang paling tepat digunakan adalah ….`,
      correct: 'tes diagnostik bertingkat (three-tier/four-tier) yang memuat jawaban, alasan, dan tingkat keyakinan',
      wrong: ['tes pilihan ganda biasa dengan lima opsi jawaban', 'angket minat belajar fisika', 'tes uraian hitungan tanpa pertanyaan alasan', 'lembar observasi keaktifan diskusi', 'portofolio laporan praktikum semester sebelumnya', 'wawancara singkat tentang cita-cita peserta didik'],
      explain: 'Tes diagnostik bertingkat memadukan jawaban (tier 1), alasan (tier 2), dan keyakinan (tier 3/4). Jawaban dan alasan salah dengan keyakinan tinggi menandakan miskonsepsi; keyakinan rendah menandakan tidak tahu konsep. Tes pilihan ganda biasa tidak dapat membedakan keduanya.',
    };
  }});

  // 3. Level kognitif tujuan pembelajaran
  const LV = [['C1', 'mengingat'], ['C2', 'memahami'], ['C3', 'menerapkan'], ['C4', 'menganalisis'], ['C5', 'mengevaluasi'], ['C6', 'mencipta']];
  const tpStmt = (T) => [
    `Peserta didik dapat menyebutkan ${T.hukum} dengan tepat.`,
    `Peserta didik dapat menjelaskan pengertian ${T.konsep} dengan bahasanya sendiri.`,
    `Peserta didik dapat menghitung ${T.hitung} dengan benar.`,
    `Peserta didik dapat menganalisis ${T.tp} berdasarkan data hasil percobaan.`,
    `Peserta didik dapat menilai ketepatan dua usulan solusi atas masalah ${T.konteks} berdasarkan konsep ${T.konsep}.`,
    `Peserta didik dapat merancang ${T.proyek} dengan menerapkan konsep ${T.m}.`,
  ];
  add({ id: 'ped-tp-level', topic: 'kurikulum', count: NM * 6, gen(r, k) {
    const T = M[k % NM], li = Math.floor(k / NM) % 6, S = tpStmt(T);
    const wrong = S.filter((_, i) => i !== li);
    if (li !== 1) wrong.push(`Peserta didik dapat memahami konsep ${T.m}.`);
    return {
      q: `Rumusan tujuan pembelajaran materi ${T.m} berikut yang berada pada level kognitif ${LV[li][1]} (${LV[li][0]}) menurut taksonomi Bloom revisi adalah ….`,
      correct: S[li], wrong,
      explain: `Kata kerja operasional menentukan level: menyebutkan (C1), menjelaskan (C2), menghitung/menerapkan (C3), menganalisis (C4), menilai/mengevaluasi (C5), merancang/mencipta (C6). Jawaban: <i>${S[li]}</i>.<br>Kata "memahami" tidak operasional karena tidak dapat diamati dan diukur secara langsung. Level C4–C6 termasuk HOTS.`,
    };
  }});

  // 4. Sintaks model pembelajaran
  const MODELS = [
    { n: 'Problem Based Learning (PBL)', s: [
      ['orientasi peserta didik pada masalah', (T) => `menyajikan masalah "${T.konteks}" dan memotivasi peserta didik untuk terlibat memecahkannya`],
      ['mengorganisasikan peserta didik untuk belajar', (T) => `membentuk kelompok dan membantu peserta didik mendefinisikan serta membagi tugas belajar terkait masalah ${T.konteks}`],
      ['membimbing penyelidikan individu maupun kelompok', (T) => `mendorong peserta didik mengumpulkan informasi dan melakukan percobaan ${T.prak[0]} untuk mencari penjelasan dan solusi`],
      ['mengembangkan dan menyajikan hasil karya', () => 'membantu peserta didik menyiapkan laporan dan mempresentasikan solusi yang mereka temukan'],
      ['menganalisis dan mengevaluasi proses pemecahan masalah', () => 'membimbing peserta didik merefleksikan penyelidikan dan proses berpikir yang telah mereka gunakan'],
    ] },
    { n: 'Project Based Learning (PjBL)', s: [
      ['penentuan pertanyaan mendasar', (T) => `mengajukan pertanyaan esensial "Bagaimana kita dapat membuat ${T.proyek}?"`],
      ['mendesain perencanaan proyek', (T) => `bersama peserta didik menyusun rancangan, daftar alat-bahan, dan pembagian tugas pembuatan ${T.proyek}`],
      ['menyusun jadwal', (T) => `menyepakati tenggat waktu setiap tahap pembuatan ${T.proyek} bersama peserta didik`],
      ['memonitor peserta didik dan kemajuan proyek', (T) => `memantau kerja setiap kelompok dan memberi umpan balik selama pembuatan ${T.proyek}`],
      ['menguji hasil', (T) => `menilai kinerja ${T.proyek} yang dihasilkan melalui uji coba dan presentasi`],
      ['mengevaluasi pengalaman', () => 'memfasilitasi peserta didik merefleksikan kendala dan pelajaran yang diperoleh selama proyek'],
    ] },
    { n: 'Discovery Learning', s: [
      ['stimulasi (stimulation)', (T) => `${T.demo} untuk membangkitkan rasa ingin tahu peserta didik`],
      ['identifikasi masalah (problem statement)', (T) => `meminta peserta didik merumuskan pertanyaan dan hipotesis tentang pengaruh ${T.prak[1]} terhadap ${T.prak[2]}`],
      ['pengumpulan data (data collection)', (T) => `membimbing peserta didik melakukan percobaan ${T.prak[0]} dan mencatat hasil pengamatan`],
      ['pengolahan data (data processing)', (T) => `meminta peserta didik menyajikan data dalam tabel dan grafik ${T.prak[2]} terhadap ${T.prak[1]}`],
      ['pembuktian (verification)', () => 'meminta peserta didik membandingkan hasil olahan data dengan hipotesis dan teori di buku'],
      ['menarik kesimpulan (generalization)', (T) => `membimbing peserta didik merumuskan kesimpulan umum tentang ${T.tp}`],
    ] },
    { n: 'Learning Cycle 5E', s: [
      ['engagement', (T) => `${T.demo} lalu menanyakan prediksi peserta didik untuk menggali pengetahuan awal`],
      ['exploration', (T) => `meminta peserta didik bereksplorasi secara berkelompok menggunakan ${T.sim} dan mencatat temuannya`],
      ['explanation', (T) => `meminta peserta didik menjelaskan temuannya, kemudian guru meluruskan dengan konsep ${T.konsep}`],
      ['elaboration', (T) => `meminta peserta didik menerapkan konsep pada situasi baru, yaitu ${T.konteks}`],
      ['evaluation', () => 'menilai pemahaman peserta didik melalui kuis dan lembar refleksi di akhir siklus'],
    ] },
    { n: 'kooperatif tipe STAD', s: [
      ['penyajian materi oleh guru', (T) => `menyampaikan garis besar materi ${T.m} dan tujuan pembelajaran secara klasikal`],
      ['belajar dalam tim', (T) => `meminta peserta didik dalam kelompok heterogen saling membantu menyelesaikan LKPD ${T.m}`],
      ['kuis individual', () => 'memberikan kuis yang dikerjakan masing-masing peserta didik tanpa bantuan teman'],
      ['penghitungan skor peningkatan individu', () => 'membandingkan skor kuis setiap peserta didik dengan skor dasarnya untuk menentukan poin peningkatan'],
      ['penghargaan kelompok', () => 'memberikan penghargaan kepada tim berdasarkan rata-rata poin peningkatan anggotanya'],
    ] },
  ];
  const COMBOS = [];
  MODELS.forEach((mo, mi) => mo.s.forEach((_, si) => COMBOS.push([mi, si])));
  add({ id: 'ped-sintaks', topic: 'model', count: 320, gen(r, k) {
    const T = M[k % NM], [mi, si] = COMBOS[(k * 7 + Math.floor(k / NM)) % COMBOS.length], mo = MODELS[mi], c = ctx(r, T);
    return {
      q: `${c.g} menerapkan model ${mo.n} pada materi ${T.m} di kelas ${c.k}. Pada salah satu tahap, guru ${mo.s[si][1](T)}. Kegiatan tersebut merupakan tahap ….`,
      key: `${k % NM}-${mi}-${si}`, correct: mo.s[si][0], wrong: mo.s.filter((_, i) => i !== si).map((x) => x[0]).concat(mi === 0 ? ['penentuan pertanyaan mendasar'] : []),
      explain: `Urutan sintaks ${mo.n}: ${mo.s.map((x, i) => `(${i + 1}) ${x[0]}`).join('; ')}.<br>Kegiatan yang dideskripsikan sesuai dengan tahap ke-${si + 1}: <b>${mo.s[si][0]}</b>.`,
    };
  }});
  add({ id: 'ped-sintaks-kegiatan', topic: 'model', count: 160, gen(r, k) {
    const T = M[k % NM], [mi, si] = COMBOS[(k * 11 + 3) % COMBOS.length], mo = MODELS[mi];
    const others = mo.s.filter((_, i) => i !== si).map((x) => cap(x[1](T)));
    return {
      q: `Dalam pembelajaran ${T.m} dengan model ${mo.n}, kegiatan guru yang sesuai dengan tahap "${mo.s[si][0]}" adalah ….`,
      key: `${k % NM}-${mi}-${si}`, correct: cap(mo.s[si][1](T)), wrong: others,
      explain: `Tahap "${mo.s[si][0]}" merupakan tahap ke-${si + 1} dari ${mo.s.length} tahap ${mo.n}. Kegiatan lain dalam pilihan merupakan tahap yang berbeda pada model yang sama, sehingga kunci terletak pada ketepatan urutan dan fungsi setiap tahap.`,
    };
  }});

  // 5. Memilih model sesuai tujuan
  const GOALS = [
    [(T) => `menghasilkan produk berupa ${T.proyek} melalui kerja kelompok selama beberapa pertemuan`, 'Project Based Learning (PjBL)', 'PjBL berorientasi pada produk nyata yang dikerjakan dalam rentang waktu tertentu melalui perencanaan, pemantauan, dan pengujian hasil.'],
    [(T) => `memecahkan masalah autentik yang belum terstruktur, yaitu ${T.konteks}`, 'Problem Based Learning (PBL)', 'PBL dimulai dari masalah autentik yang belum terstruktur; peserta didik menyelidiki dan menawarkan solusi.'],
    [(T) => `menemukan sendiri hubungan antara ${T.prak[1]} dan ${T.prak[2]} melalui percobaan yang dibimbing guru`, 'Discovery Learning', 'Discovery Learning menekankan penemuan konsep atau prinsip oleh peserta didik melalui pengolahan data percobaan.'],
    [(T) => `mengubah prakonsepsi keliru bahwa ${T.mis[0]}`, 'Predict–Observe–Explain (POE)', 'POE memancing prediksi, menguji dengan pengamatan, lalu menjelaskan perbedaan prediksi dan pengamatan, sehingga efektif untuk perubahan konseptual.'],
    [(T) => `menguasai prosedur penggunaan alat pada percobaan ${T.prak[0]} secara bertahap melalui demonstrasi dan latihan terbimbing`, 'pembelajaran langsung (direct instruction)', 'Pembelajaran langsung cocok untuk pengetahuan prosedural yang diajarkan selangkah demi selangkah melalui pemodelan, latihan terbimbing, dan latihan mandiri.'],
  ];
  const MODEL_NAMES = ['Project Based Learning (PjBL)', 'Problem Based Learning (PBL)', 'Discovery Learning', 'Predict–Observe–Explain (POE)', 'pembelajaran langsung (direct instruction)', 'kooperatif tipe Jigsaw'];
  add({ id: 'ped-pilih-model', topic: 'model', count: NM * GOALS.length, gen(r, k) {
    const T = M[k % NM], gi = Math.floor(k / NM) % GOALS.length, G = GOALS[gi], c = ctx(r, T);
    return {
      q: `${c.g} ingin peserta didik kelas ${c.k} dapat ${G[0](T)}. Model pembelajaran yang paling sesuai dengan tujuan tersebut adalah ….`,
      correct: G[1], wrong: MODEL_NAMES.filter((x) => x !== G[1]),
      explain: `${G[2]}<br>Pemilihan model harus diselaraskan dengan tujuan pembelajaran, karakteristik materi, dan kebutuhan peserta didik.`,
    };
  }});

  // 6. Variabel percobaan
  add({ id: 'ped-variabel', topic: 'praktikum', count: NM * 3, gen(r, k) {
    const T = M[k % NM], vi = Math.floor(k / NM) % 3, nm = ['bebas (manipulasi)', 'terikat (respons)', 'kontrol'][vi];
    const correct = T.prak[1 + vi];
    const wrong = T.prak.slice(1).filter((x) => x !== correct);
    r.sample(M.filter((x) => x !== T), 4).forEach((o) => wrong.push(o.prak[1 + r.int(0, 2)]));
    return {
      q: `Peserta didik merancang percobaan "${T.prak[0]}" untuk menyelidiki pengaruh ${T.prak[1]} terhadap ${T.prak[2]}. Variabel ${nm} dalam percobaan tersebut adalah ….`,
      correct, wrong: wrong.slice(0, 6),
      explain: `Variabel bebas: ${T.prak[1]} (sengaja diubah). Variabel terikat: ${T.prak[2]} (diamati sebagai akibat). Variabel kontrol: ${T.prak[3]} (dijaga tetap agar hasil valid).`,
    };
  }});
  add({ id: 'ped-rumusan', topic: 'praktikum', count: NM, gen(r, k) {
    const T = M[k % NM];
    return {
      q: `Pada kegiatan inkuiri materi ${T.m}, peserta didik akan melakukan percobaan "${T.prak[0]}". Rumusan masalah yang paling tepat adalah ….`,
      correct: `Bagaimana pengaruh ${T.prak[1]} terhadap ${T.prak[2]}?`,
      wrong: [`Bagaimana pengaruh ${T.prak[2]} terhadap ${T.prak[1]}?`, `Apa saja alat dan bahan yang digunakan pada percobaan ${T.prak[0]}?`, `Apakah percobaan ${T.prak[0]} menyenangkan bagi peserta didik?`, `Mengapa ${T.konsep} penting dipelajari?`, `Bagaimana pengaruh ${T.prak[3]} terhadap ${T.prak[1]}?`],
      explain: 'Rumusan masalah percobaan yang baik menghubungkan variabel bebas dengan variabel terikat, dapat diuji melalui pengumpulan data, dan berbentuk kalimat tanya. Membalik variabel bebas dan terikat adalah kekeliruan yang sering muncul.',
    };
  }});

  // 7. Diferensiasi
  const DIFS = [
    ['diferensiasi konten', (T) => `menyediakan materi ${T.m} dalam bentuk teks bacaan, video animasi, dan ${T.sim} yang dapat dipilih sesuai profil belajar peserta didik`],
    ['diferensiasi proses', (T) => `mengelompokkan peserta didik berdasarkan hasil asesmen awal: kelompok yang belum menguasai ${T.pra} didampingi dengan LKPD berjenjang, sedangkan kelompok yang sudah menguasai langsung menganalisis ${T.tp}`],
    ['diferensiasi produk', (T) => `memberi kebebasan peserta didik menunjukkan pemahaman tentang ${T.konsep} melalui poster infografis, video penjelasan, atau model fisik dengan kriteria penilaian yang sama`],
    ['diferensiasi lingkungan belajar', (T) => `menata kelas menjadi sudut belajar mandiri yang tenang dan meja kolaborasi untuk diskusi selama pembelajaran ${T.m}`],
  ];
  add({ id: 'ped-diferensiasi', topic: 'diferensiasi', count: NM * DIFS.length, gen(r, k) {
    const T = M[k % NM], di = Math.floor(k / NM) % DIFS.length, D = DIFS[di], c = ctx(r, T);
    return {
      q: `Dalam pembelajaran ${T.m}, ${c.g} ${D[1](T)}. Strategi yang diterapkan guru tersebut adalah ….`,
      correct: D[0], wrong: DIFS.filter((x) => x !== D).map((x) => x[0]).concat(['asesmen sumatif berbasis proyek', 'pembelajaran klasikal seragam']),
      explain: 'Diferensiasi konten mengatur <i>apa</i> yang dipelajari dan bentuk sumbernya; diferensiasi proses mengatur <i>bagaimana</i> peserta didik belajar (pengelompokan, scaffolding, tingkat kesulitan); diferensiasi produk mengatur <i>cara peserta didik menunjukkan</i> hasil belajar; lingkungan belajar mengatur suasana dan tata ruang.',
    };
  }});
  const NEEDS = [
    ['kesiapan belajar', (T) => `hasil asesmen awal tentang ${T.pra} menunjukkan tiga kelompok kemampuan yang berbeda`],
    ['minat', (T) => `sebagian peserta didik menyukai otomotif, sebagian olahraga, dan sebagian musik, sehingga guru menyiapkan contoh penerapan ${T.konsep} dari ketiga bidang tersebut`],
    ['profil belajar', () => 'sebagian peserta didik lebih mudah belajar melalui gambar, sebagian melalui mendengarkan penjelasan, dan sebagian melalui kegiatan langsung'],
  ];
  add({ id: 'ped-kebutuhan', topic: 'diferensiasi', count: NM * NEEDS.length, gen(r, k) {
    const T = M[k % NM], ni = Math.floor(k / NM) % NEEDS.length, N = NEEDS[ni], c = ctx(r, T);
    return {
      q: `Sebelum mengajarkan ${T.m}, ${c.g} memetakan kebutuhan peserta didik dan menemukan bahwa ${N[1](T)}. Aspek kebutuhan belajar yang menjadi dasar diferensiasi tersebut adalah ….`,
      correct: N[0], wrong: NEEDS.filter((x) => x !== N).map((x) => x[0]).concat(['latar belakang ekonomi keluarga', 'nilai rapor semester lalu secara umum', 'jenis kelamin peserta didik']),
      explain: 'Tiga aspek kebutuhan belajar dalam pembelajaran berdiferensiasi (Tomlinson): kesiapan belajar (readiness, terkait kemampuan awal), minat (hal yang disukai dan memotivasi), dan profil belajar (cara belajar yang disukai, misalnya visual, auditori, kinestetik).',
    };
  }});

  // 8. Jenis asesmen
  const ASM = [
    ['asesmen diagnostik', (T) => `memberikan beberapa pertanyaan tentang ${T.pra} sebelum memulai materi ${T.m} untuk merancang pembelajaran sesuai kesiapan peserta didik`],
    ['asesmen formatif', (T) => `memberikan kuis singkat disertai umpan balik di tengah pembelajaran ${T.m} untuk memperbaiki proses belajar`],
    ['asesmen sumatif', (T) => `memberikan tes di akhir lingkup materi ${T.m} untuk memastikan ketercapaian tujuan pembelajaran dan bahan pelaporan hasil belajar`],
    ['penilaian antarteman (assessment as learning)', (T) => `meminta peserta didik menilai laporan percobaan ${T.prak[0]} milik temannya menggunakan rubrik, lalu memberi saran perbaikan`],
    ['asesmen kinerja (unjuk kerja)', (T) => `mengamati keterampilan peserta didik saat merangkai alat percobaan ${T.prak[0]} menggunakan lembar observasi berrubrik`],
  ];
  add({ id: 'ped-asesmen', topic: 'asesmen', count: NM * ASM.length, gen(r, k) {
    const T = M[k % NM], ai = Math.floor(k / NM) % ASM.length, A = ASM[ai], c = ctx(r, T);
    return {
      q: `${c.g} ${A[1](T)}. Jenis asesmen yang dilakukan guru tersebut adalah ….`,
      correct: A[0], wrong: ASM.filter((x) => x !== A).map((x) => x[0]).concat(['asesmen portofolio akhir tahun']),
      explain: 'Diagnostik dilakukan di awal untuk memetakan kemampuan; formatif selama proses untuk memberi umpan balik (assessment for learning); sumatif di akhir untuk mengukur ketercapaian (assessment of learning); penilaian diri/antarteman melatih metakognisi (assessment as learning); asesmen kinerja menilai keterampilan saat peserta didik melakukan tugas.',
    };
  }});

  // 9. Butir soal HOTS
  add({ id: 'ped-hots', topic: 'asesmen', count: NM * 2, gen(r, k) {
    const T = M[k % NM], v = Math.floor(k / NM) % 2;
    const correct = v === 0
      ? `Disajikan tabel data percobaan ${T.prak[0]} untuk beberapa nilai ${T.prak[1]}. Peserta didik diminta menyimpulkan pola hubungan ${T.prak[1]} dengan ${T.prak[2]} dan memprediksi hasil untuk nilai yang belum diuji.`
      : `Disajikan kasus ${T.konteks}. Peserta didik diminta mengevaluasi dua usulan solusi menggunakan konsep ${T.konsep}, lalu memilih solusi terbaik beserta alasannya.`;
    return {
      q: `${r.pick(GURU)} menyusun soal asesmen materi ${T.m}. Butir soal yang termasuk kategori HOTS (higher order thinking skills) adalah ….`,
      correct, wrong: [`Sebutkan bunyi ${T.hukum}!`, `Jelaskan pengertian ${T.konsep}!`, `Hitunglah ${T.hitung} jika semua besaran yang diperlukan telah diketahui!`, `Tuliskan rumus ${T.hukum} beserta satuan setiap besarannya!`, `Sebutkan dua contoh penerapan ${T.konsep} dalam kehidupan sehari-hari!`],
      explain: 'Soal HOTS menuntut proses menganalisis, mengevaluasi, atau mencipta (C4–C6), biasanya menggunakan stimulus kontekstual (data, kasus, grafik) dan tidak dapat dijawab dengan mengingat atau memasukkan angka ke rumus. Soal menyebutkan/menjelaskan/menghitung langsung termasuk LOTS (C1–C3).',
    };
  }});

  // 10. Teori belajar
  const THEORY = [
    ['Vygotsky: scaffolding dalam zona perkembangan proksimal', (T) => `memberikan bantuan bertahap berupa petunjuk dan contoh sebagian ketika peserta didik kesulitan menyelesaikan soal ${T.hitung}, lalu mengurangi bantuan seiring meningkatnya kemampuan mereka`],
    ['Ausubel: advance organizer untuk belajar bermakna', (T) => `mengawali materi ${T.m} dengan peta konsep yang mengaitkannya dengan ${T.pra} yang telah dipelajari sebelumnya`],
    ['Bruner: tahap enaktif, ikonik, dan simbolik', (T) => `memulai dengan kegiatan memanipulasi benda nyata, dilanjutkan dengan gambar/diagram, lalu persamaan matematis ${T.hukum}`],
    ['Piaget: disekuilibrium yang mendorong akomodasi', (T) => `menghadirkan fenomena ketika guru ${T.demo}, yang bertentangan dengan skema awal peserta didik sehingga mereka terdorong merekonstruksi pemahamannya`],
    ['Skinner: penguatan (operant conditioning)', (T) => `memberikan pujian dan poin setiap kali peserta didik menjawab benar pertanyaan tentang ${T.konsep} agar perilaku belajar tersebut terulang`],
    ['Bandura: belajar melalui pemodelan (observational learning)', (T) => `memperagakan langkah-langkah percobaan ${T.prak[0]} dengan jelas, kemudian peserta didik menirukannya`],
  ];
  add({ id: 'ped-teori', topic: 'teori-belajar', count: NM * THEORY.length, gen(r, k) {
    const T = M[k % NM], ti = Math.floor(k / NM) % THEORY.length, H = THEORY[ti], c = ctx(r, T);
    return {
      q: `Dalam pembelajaran ${T.m}, ${c.g} ${H[1](T)}. Tindakan guru tersebut paling sesuai dengan teori belajar ….`,
      correct: H[0], wrong: THEORY.filter((x) => x !== H).map((x) => x[0]),
      explain: 'Vygotsky: bantuan (scaffolding) di zona perkembangan proksimal. Ausubel: belajar bermakna dengan mengaitkan pengetahuan baru pada struktur kognitif melalui advance organizer. Bruner: representasi enaktif → ikonik → simbolik. Piaget: asimilasi, akomodasi, dan ekuilibrasi. Skinner: penguatan perilaku. Bandura: belajar melalui pengamatan model.',
    };
  }});

  // 11. TPACK & media
  add({ id: 'ped-media', topic: 'tpack', count: NM, gen(r, k) {
    const T = M[k % NM];
    return {
      q: `Peserta didik kesulitan memahami ${T.abstrak} pada materi ${T.m}, sementara alat laboratorium sekolah terbatas. Pemanfaatan teknologi yang paling tepat adalah ….`,
      correct: `menggunakan ${T.sim} secara berkelompok dengan LKPD yang menuntun peserta didik mengubah variabel dan mengamati dampaknya`,
      wrong: [`menayangkan slide berisi rangkuman rumus ${T.m} secara lengkap`, `meminta peserta didik mencari definisi ${T.konsep} di internet`, 'memutar video ceramah guru lain tanpa jeda diskusi', 'memberikan kuis daring berisi soal hafalan istilah', 'meminta peserta didik memotret halaman buku teks sebagai catatan'],
      explain: 'Integrasi teknologi yang bermakna (TPACK) memilih teknologi yang memperkuat pedagogi untuk konten tertentu. Laboratorium virtual memungkinkan peserta didik memanipulasi variabel dan memvisualisasikan hal abstrak; LKPD menjaga aktivitas tetap terarah pada tujuan pembelajaran.',
    };
  }});
  const TPK = [
    ['Technological Pedagogical Content Knowledge (TPACK)', (T) => `memilih ${T.sim} karena dapat menampilkan ${T.abstrak} dan memfasilitasi peserta didik menemukan konsep secara inkuiri`],
    ['Pedagogical Content Knowledge (PCK)', (T) => `mengetahui miskonsepsi yang umum terjadi pada materi ${T.m} dan menyiapkan analogi yang tepat untuk mengatasinya`],
    ['Technological Content Knowledge (TCK)', (T) => `mengetahui bahwa aplikasi spreadsheet dapat digunakan untuk mengolah data dan membuat grafik ${T.prak[2]} terhadap ${T.prak[1]}`],
    ['Content Knowledge (CK)', (T) => `menguasai konsep ${T.konsep} dan penurunan ${T.hukum} secara mendalam`],
    ['Pedagogical Knowledge (PK)', (T) => `menguasai teknik umum mengelola diskusi kelompok dan memberi umpan balik yang efektif, yang dapat ia terapkan pada materi apa pun termasuk ${T.m}`],
  ];
  add({ id: 'ped-tpack', topic: 'tpack', count: NM * 3, gen(r, k) {
    const T = M[k % NM], ti = (k + Math.floor(k / NM)) % TPK.length, P = TPK[ti], c = ctx(r, T);
    return {
      q: `${c.g} ${P[1](T)}. Kemampuan tersebut menunjukkan komponen pengetahuan guru ….`, key: `${k % NM}-${ti}`,
      correct: P[0], wrong: TPK.filter((x) => x !== P).map((x) => x[0]).concat(['Technological Knowledge (TK)']),
      explain: 'TPACK (Mishra & Koehler) terdiri atas TK, PK, CK dan irisannya: PCK (cara mengajarkan konten tertentu), TCK (teknologi untuk merepresentasikan konten), TPK (teknologi untuk mendukung strategi pedagogi), dan TPACK (perpaduan ketiganya secara utuh).',
    };
  }});

  // 12. Pertanyaan divergen
  add({ id: 'ped-bertanya', topic: 'kelas', count: NM, gen(r, k) {
    const T = M[k % NM];
    return {
      q: `Untuk mendorong peserta didik berpikir kritis pada awal pembelajaran ${T.m}, pertanyaan guru yang paling tepat adalah ….`,
      correct: `"${T.tanya}"`,
      wrong: [`"Apa rumus ${T.hukum}?"`, `"Apa satuan dari ${T.konsep}?"`, `"Apakah kalian sudah paham materi ${T.m}?"`, `"Siapa yang sudah membaca bab ${T.m} di buku?"`, `"Benarkah ${T.konsep} termasuk materi fisika?"`],
      explain: 'Pertanyaan divergen/terbuka (mengapa, bagaimana jika) menuntut penalaran dan penjelasan, bukan sekadar mengingat fakta. Pertanyaan tertutup "apakah sudah paham?" jarang memberi informasi akurat tentang pemahaman peserta didik.',
    };
  }});

  // 13. Dimensi profil lulusan
  const PROF = [
    ['penalaran kritis', (T) => `mengevaluasi kebenaran informasi viral di media sosial tentang ${T.konteks} menggunakan data dan konsep fisika`],
    ['kreativitas', (T) => `merancang ${T.proyek} dengan ide orisinal dari bahan yang tersedia di sekitar`],
    ['kolaborasi', (T) => `membagi peran dalam kelompok dan saling membantu menyelesaikan percobaan ${T.prak[0]} untuk tujuan bersama`],
    ['kemandirian', (T) => `menyusun target belajar sendiri dan memantau kemajuannya dalam menguasai ${T.konsep}`],
    ['komunikasi', (T) => `menyampaikan hasil percobaan ${T.prak[0]} secara lisan dan tertulis dengan runtut kepada audiens`],
  ];
  add({ id: 'ped-profil', topic: 'kurikulum', count: NM * PROF.length, gen(r, k) {
    const T = M[k % NM], pi = Math.floor(k / NM) % PROF.length, P = PROF[pi];
    return {
      q: `Dalam pembelajaran ${T.m}, peserta didik ${P[1](T)}. Kegiatan tersebut paling kuat mengembangkan dimensi profil lulusan ….`,
      correct: P[0], wrong: PROF.filter((x) => x !== P).map((x) => x[0]).concat(['kesehatan', 'kewargaan']),
      explain: 'Delapan dimensi profil lulusan dalam pendekatan Pembelajaran Mendalam: keimanan dan ketakwaan kepada Tuhan YME, kewargaan, penalaran kritis, kreativitas, kolaborasi, kemandirian, kesehatan, dan komunikasi. Identifikasi dimensi dari kata kunci kegiatan: mengevaluasi informasi (penalaran kritis), merancang ide orisinal (kreativitas), bekerja sama (kolaborasi), mengatur belajar sendiri (kemandirian), menyampaikan gagasan (komunikasi).',
    };
  }});

  // 14. Tindak lanjut hasil asesmen
  add({ id: 'ped-remedial', topic: 'refleksi', count: NM * 2, gen(r, k) {
    const T = M[k % NM], many = Math.floor(k / NM) % 2 === 0;
    const p = many ? r.pick([60, 65, 70, 75]) : r.pick([10, 15, 20]);
    const A = `mengulang pembelajaran secara klasikal dengan strategi berbeda (misalnya ${T.sim} atau percobaan langsung), lalu melakukan asesmen ulang`;
    const B = 'memberikan pembelajaran remedial pada kelompok kecil sesuai kesulitan masing-masing, sementara peserta didik yang sudah tuntas mendapat pengayaan';
    return {
      q: `Hasil asesmen sumatif materi ${T.m} menunjukkan ${p}% peserta didik belum mencapai kriteria ketercapaian tujuan pembelajaran (KKTP), terutama pada indikator ${T.tp}. Tindak lanjut yang paling tepat adalah ….`,
      correct: many ? A : B, wrong: [many ? B : A, 'memberikan tes ulang dengan soal yang sama persis', 'melanjutkan ke materi berikutnya karena waktu pembelajaran terbatas', 'memberi tugas merangkum buku bagi peserta didik yang belum tuntas', 'menaikkan nilai peserta didik agar mencapai kriteria'],
      explain: `Jika sebagian besar peserta didik (${p}%) belum tuntas, masalah kemungkinan terletak pada proses pembelajaran sehingga perlu pembelajaran ulang klasikal dengan strategi berbeda. Jika hanya sebagian kecil yang belum tuntas, remedial diberikan secara individual/kelompok kecil dengan menyasar kesulitan spesifik, sedangkan yang tuntas mendapat pengayaan. Remedial bukan sekadar tes ulang.`,
    };
  }});

  // 15. Analisis butir soal (kuantitatif)
  add({ id: 'ped-butir', topic: 'asesmen', level: 'C3', count: 70, gen(r, k) {
    const type = k % 2 === 0 ? 'p' : 'd';
    if (type === 'p') {
      const n = r.pick([30, 32, 36, 40]), B = r.int(3, n - 2), p = B / n;
      const cat = p < 0.3 ? 'sukar' : p <= 0.7 ? 'sedang' : 'mudah';
      return { q: `Sebuah butir soal ${r.pick(M).m} dijawab benar oleh ${B} dari ${n} peserta didik. Indeks kesukaran dan kategori butir soal tersebut adalah ….`, key: `p${B}-${n}`,
        correct: `${U.fmt(U.round(p, 2))} (${cat})`, wrong: ['sukar', 'sedang', 'mudah'].filter((c) => c !== cat).map((c) => `${U.fmt(U.round(p, 2))} (${c})`).concat(['sukar', 'sedang', 'mudah'].map((c) => `${U.fmt(U.round(1 - p, 2))} (${c})`), [`${U.fmt(U.round(B / (n - B), 2))} (${cat})`]),
        explain: `Indeks kesukaran P = B/JS = ${B}/${n} = ${U.fmt(U.round(p, 2))}. Kriteria: P < 0,30 sukar; 0,30 ≤ P ≤ 0,70 sedang; P > 0,70 mudah. Jadi butir tergolong <b>${cat}</b>. Semakin besar P, semakin mudah soal.` };
    }
    const n = r.pick([20, 30, 40]), half = n / 2, BA = r.int(Math.floor(half / 3), half), BB = r.int(0, half);
    const D = (BA - BB) / half;
    const cat = D < 0 ? 'negatif, sebaiknya dibuang' : D <= 0.2 ? 'jelek' : D <= 0.4 ? 'cukup' : D <= 0.7 ? 'baik' : 'baik sekali';
    const cats = ['negatif, sebaiknya dibuang', 'jelek', 'cukup', 'baik', 'baik sekali'];
    return { q: `Pada analisis butir soal, ${n} peserta didik dibagi menjadi kelompok atas dan kelompok bawah masing-masing ${half} orang. Sebanyak ${BA} peserta kelompok atas dan ${BB} peserta kelompok bawah menjawab benar. Daya pembeda butir soal tersebut adalah ….`, key: `d${BA}-${BB}-${n}`,
      correct: `${U.fmt(U.round(D, 2))} (${cat})`, wrong: cats.filter((x) => x !== cat).map((x) => `${U.fmt(U.round(D, 2))} (${x})`).concat([`${U.fmt(U.round((BA + BB) / n, 2))} (${cat})`, `${U.fmt(U.round((BA - BB) / n, 2))} (${cat})`]),
      explain: `D = (B_A − B_B)/(½ JS) = (${BA} − ${BB})/${half} = ${U.fmt(U.round(D, 2))}. Kriteria umum: D negatif dibuang; 0,00–0,20 jelek; 0,21–0,40 cukup; 0,41–0,70 baik; 0,71–1,00 baik sekali. Jadi daya pembeda <b>${cat}</b>.` };
  }});

  // 16. Pengelolaan kelompok praktikum
  add({ id: 'ped-kelompok', topic: 'kelas', count: NM, gen(r, k) {
    const T = M[k % NM], c = ctx(r, T);
    return {
      q: `Saat percobaan ${T.prak[0]}, ${c.g} mengamati bahwa di beberapa kelompok hanya satu peserta didik yang bekerja, sementara anggota lain pasif. Tindakan yang paling tepat adalah ….`,
      correct: 'menetapkan peran bergilir bagi setiap anggota (pengukur, pencatat data, pengatur alat, pelapor) dan menilai kontribusi individu di samping hasil kelompok',
      wrong: ['membiarkan saja karena yang penting laporan kelompok selesai tepat waktu', 'mengambil alih percobaan dan meminta semua peserta didik mencatat hasilnya', 'memberi nilai nol kepada anggota kelompok yang pasif tanpa penjelasan', 'membubarkan kelompok dan meminta setiap peserta didik bekerja sendiri dengan alat yang terbatas', 'meminta peserta didik yang aktif mengerjakan laporan untuk seluruh anggota'],
      explain: 'Pembelajaran kooperatif yang efektif memerlukan saling ketergantungan positif dan tanggung jawab individu (Johnson & Johnson). Peran bergilir memastikan setiap anggota terlibat, dan penilaian kontribusi individu mencegah fenomena "penumpang gratis".',
    };
  }});

  // 17. Umpan balik efektif
  add({ id: 'ped-umpanbalik', topic: 'asesmen', count: NM, gen(r, k) {
    const T = M[k % NM], c = ctx(r, T);
    return {
      q: `Seorang peserta didik menjawab salah soal ${T.hitung} karena keliru pada langkah substitusi satuan. Umpan balik ${c.g} yang paling efektif adalah ….`,
      correct: '"Langkah konsepmu sudah benar. Coba periksa lagi satuan setiap besaran sebelum disubstitusi. Apakah semuanya sudah dalam SI?"',
      wrong: ['"Jawabanmu salah. Pelajari lagi materinya."', '"Nilaimu 60, lebih baik dari ulangan lalu."', '"Lihat jawaban temanmu yang benar, lalu salin."', '"Kamu kurang teliti, lain kali jangan diulangi."', '"Jawaban yang benar adalah pilihan C."'],
      explain: 'Umpan balik efektif (Hattie & Timperley) bersifat spesifik, segera, berfokus pada tugas/proses, dan mengarahkan langkah perbaikan. Umpan balik yang hanya memberi label salah, nilai, atau kunci jawaban tidak membantu peserta didik memperbaiki strategi berpikirnya.',
    };
  }});

  // 18. Urutan alur tujuan pembelajaran
  add({ id: 'ped-atp', topic: 'kurikulum', count: NM, gen(r, k) {
    const T = M[k % NM];
    const s = [`menjelaskan ${T.pra} yang terkait`, `menjelaskan konsep ${T.konsep}`, `menghitung ${T.hitung}`, `menganalisis ${T.tp}`];
    const perm = (p) => p.map((i) => s[i]).join(' → ');
    return {
      q: `${r.pick(GURU)} menyusun alur tujuan pembelajaran (ATP) untuk materi ${T.m}. Urutan tujuan pembelajaran yang paling logis adalah ….`,
      correct: perm([0, 1, 2, 3]), wrong: [perm([3, 2, 1, 0]), perm([2, 0, 3, 1]), perm([1, 3, 0, 2]), perm([3, 0, 1, 2]), perm([2, 3, 1, 0])],
      explain: 'ATP disusun secara logis dan berkesinambungan: dari prasyarat ke konsep inti, dari sederhana ke kompleks, dan dari level kognitif rendah ke tinggi, sehingga setiap tujuan menjadi fondasi bagi tujuan berikutnya.',
    };
  }});

  // 19. Pembelajaran Mendalam
  const PM = [
    ['bermakna (meaningful)', 'prinsip', (T) => `mengaitkan materi ${T.m} dengan masalah nyata, yaitu ${T.konteks}, sehingga peserta didik merasakan manfaat pengetahuannya`],
    ['berkesadaran (mindful)', 'prinsip', (T) => `mengajak peserta didik memahami tujuan belajar ${T.m}, menetapkan target pribadi, dan memantau proses berpikirnya sendiri`],
    ['menggembirakan (joyful)', 'prinsip', (T) => `merancang tantangan lomba membuat ${T.proyek} dalam suasana positif yang membuat peserta didik antusias dan merasa dihargai`],
    ['memahami', 'pengalaman', (T) => `membangun pengetahuan tentang ${T.konsep} dari berbagai sumber dan dari pengamatan ketika guru ${T.demo}`],
    ['mengaplikasi', 'pengalaman', (T) => `menggunakan konsep ${T.konsep} untuk memecahkan masalah ${T.konteks}`],
    ['merefleksi', 'pengalaman', (T) => `mengevaluasi proses dan hasil belajarnya tentang ${T.m}, lalu merencanakan perbaikan cara belajar`],
  ];
  add({ id: 'ped-mendalam', topic: 'kurikulum', count: NM * PM.length, gen(r, k) {
    const T = M[k % NM], pi = Math.floor(k / NM) % PM.length, P = PM[pi];
    const isPr = P[1] === 'prinsip';
    return {
      q: isPr ? `Dalam pendekatan Pembelajaran Mendalam, guru ${P[2](T)}. Kegiatan tersebut paling menonjolkan prinsip ….` : `Dalam pendekatan Pembelajaran Mendalam, peserta didik ${P[2](T)}. Kegiatan tersebut termasuk pengalaman belajar ….`,
      correct: P[0], wrong: isPr ? ['bermakna (meaningful)', 'berkesadaran (mindful)', 'menggembirakan (joyful)', 'berpusat pada guru', 'berbasis hafalan', 'terstandar seragam'].filter((x) => x !== P[0]) : ['memahami', 'mengaplikasi', 'merefleksi', 'menghafal', 'meniru', 'mengulang'].filter((x) => x !== P[0]),
      explain: 'Pembelajaran Mendalam bertumpu pada tiga prinsip: berkesadaran (mindful), bermakna (meaningful), dan menggembirakan (joyful). Pengalaman belajarnya meliputi memahami (membangun pengetahuan), mengaplikasi (menerapkan pada konteks nyata), dan merefleksi (mengevaluasi dan memaknai proses belajar).',
    };
  }});

  // ---------- Soal pedagogik umum (ditulis manual) ----------
  const P = (topic, q, correct, wrong, explain, level) => ({ topic, q, correct, wrong, explain, level: level || 'C4' });
  const FIXED = [
    P('karakteristik', 'Peserta didik SMA berada pada tahap operasional formal menurut Piaget. Implikasi yang paling tepat dalam pembelajaran fisika adalah ….', 'peserta didik dapat diajak berpikir hipotetis-deduktif, misalnya merumuskan dan menguji hipotesis', ['peserta didik hanya dapat belajar melalui benda konkret', 'peserta didik belum mampu memahami konsep abstrak sama sekali', 'pembelajaran harus didominasi hafalan rumus', 'peserta didik belum dapat bekerja dalam kelompok'], 'Tahap operasional formal (±11 tahun ke atas) ditandai kemampuan berpikir abstrak, hipotetis-deduktif, dan proporsional. Namun guru tetap perlu memperhatikan bahwa tidak semua remaja sudah sepenuhnya mencapai tahap ini.'),
    P('karakteristik', 'Seorang peserta didik sangat cepat menangkap materi dan sering bosan ketika pembelajaran berjalan lambat. Perlakuan yang paling tepat adalah ….', 'memberikan tugas pengayaan berupa masalah terbuka yang menantang dan relevan dengan minatnya', ['memintanya menunggu sampai teman-temannya selesai', 'memberinya soal yang sama dalam jumlah lebih banyak', 'memintanya mengajari seluruh kelas setiap pertemuan', 'mengabaikannya karena sudah pasti tuntas'], 'Pengayaan bagi peserta didik cepat sebaiknya memperdalam atau memperluas (horizontal/vertikal), bukan menambah kuantitas soal sejenis.'),
    P('karakteristik', 'Seorang peserta didik berkebutuhan khusus tunarungu mengikuti pembelajaran fisika di kelas inklusif. Strategi yang paling tepat adalah ….', 'memperbanyak representasi visual, teks tertulis, dan demonstrasi, serta memastikan wajah guru terlihat saat berbicara', ['menempatkannya di bangku paling belakang agar tidak mengganggu', 'memberikan materi yang lebih sedikit tanpa penyesuaian cara', 'hanya mengandalkan penjelasan lisan dengan suara keras', 'membebaskannya dari semua kegiatan praktikum'], 'Pembelajaran inklusif menyesuaikan akses: peserta didik tunarungu terbantu oleh visual, teks, isyarat, dan membaca gerak bibir, tanpa menurunkan harapan belajar.'),
    P('kelas', 'Ketika guru menjelaskan, dua peserta didik terus mengobrol dan mengganggu teman. Tindakan awal yang paling tepat adalah ….', 'mendekati keduanya sambil tetap mengajar dan memberi isyarat nonverbal atau pertanyaan yang melibatkan mereka', ['memarahi keduanya di depan kelas', 'mengeluarkan keduanya dari kelas', 'menghentikan pembelajaran sampai mereka diam', 'mengabaikan karena akan berhenti sendiri'], 'Intervensi minimal (proximity control, isyarat nonverbal, melibatkan dalam aktivitas) menjaga alur pembelajaran dan martabat peserta didik. Hukuman berat menjadi langkah terakhir.'),
    P('kelas', 'Pada awal tahun ajaran, langkah yang paling efektif untuk membangun lingkungan belajar yang positif adalah ….', 'menyusun kesepakatan kelas bersama peserta didik beserta alasan dan konsekuensinya', ['menempelkan daftar larangan buatan guru tanpa diskusi', 'memberikan hukuman tegas pada pelanggaran pertama', 'menunda pembahasan aturan sampai ada masalah', 'menyerahkan sepenuhnya kepada wali kelas'], 'Kesepakatan kelas yang disusun bersama meningkatkan rasa memiliki dan tanggung jawab peserta didik, sejalan dengan disiplin positif.'),
    P('kelas', 'Saat praktikum listrik, seorang peserta didik hendak menyambungkan rangkaian langsung ke stopkontak PLN. Tindakan guru yang paling tepat adalah ….', 'menghentikan segera kegiatan tersebut, menjelaskan bahaya tegangan PLN, dan meninjau kembali prosedur keselamatan kerja laboratorium', ['membiarkannya agar belajar dari pengalaman', 'memberi nilai praktikum nol tanpa penjelasan', 'menegurnya setelah praktikum selesai', 'meminta teman sekelompok mengawasinya'], 'Keselamatan kerja di laboratorium adalah prioritas utama. Guru wajib mencegah bahaya segera dan menjadikannya momen edukatif tentang prosedur keselamatan.'),
    P('kurikulum', 'Dalam Kurikulum Merdeka, capaian pembelajaran (CP) fisika fase F dirumuskan oleh ….', 'pemerintah sebagai acuan, kemudian dijabarkan guru menjadi tujuan pembelajaran dan alur tujuan pembelajaran', ['guru secara bebas tanpa acuan', 'kepala sekolah untuk setiap kelas', 'peserta didik sesuai minatnya', 'komite sekolah dan orang tua'], 'CP ditetapkan pemerintah; satuan pendidikan dan guru merumuskan TP, ATP, dan modul ajar sesuai konteks dan karakteristik peserta didik.'),
    P('kurikulum', 'Kriteria ketercapaian tujuan pembelajaran (KKTP) digunakan untuk ….', 'menentukan apakah peserta didik telah mencapai tujuan pembelajaran dan perlu tindak lanjut', ['membandingkan peringkat peserta didik dalam kelas', 'menentukan nilai minimal yang sama untuk semua mata pelajaran', 'menggantikan rapor peserta didik', 'menghitung jam mengajar guru'], 'KKTP menggantikan KKM. Bentuknya dapat berupa deskripsi kriteria, rubrik, atau interval nilai, dan digunakan untuk menentukan tindak lanjut pembelajaran.'),
    P('kurikulum', 'Komponen modul ajar yang berfungsi memastikan pembelajaran dimulai dari kondisi peserta didik adalah ….', 'asesmen awal (diagnostik) dan pemahaman bermakna', ['daftar pustaka', 'glosarium', 'identitas penulis', 'lampiran lembar kerja'], 'Asesmen awal membantu guru memetakan kesiapan peserta didik sehingga pembelajaran dapat dirancang sesuai kebutuhan (teaching at the right level).'),
    P('kurikulum', 'Guru menulis tujuan pembelajaran "Melalui percobaan bandul sederhana, peserta didik dapat menganalisis hubungan panjang tali dan periode dengan tepat." Unsur kondisi (condition) dalam rumusan tersebut adalah ….', 'melalui percobaan bandul sederhana', ['peserta didik', 'menganalisis hubungan panjang tali dan periode', 'dengan tepat', 'bandul'], 'Format ABCD: Audience (peserta didik), Behavior (menganalisis hubungan…), Condition (melalui percobaan bandul sederhana), Degree (dengan tepat).'),
    P('asesmen', 'Sebuah tes dikatakan memiliki validitas isi yang baik apabila ….', 'butir-butir soal mewakili tujuan pembelajaran dan materi yang diukur sesuai kisi-kisi', ['hasil tes konsisten jika diujikan berulang', 'semua peserta didik memperoleh nilai tinggi', 'soal dibuat sesulit mungkin', 'jumlah soal minimal 50 butir'], 'Validitas isi berkaitan dengan keterwakilan materi dan tujuan; konsistensi hasil adalah reliabilitas.'),
    P('asesmen', 'Hasil tes fisika dua kali pada peserta didik yang sama dalam kondisi serupa menunjukkan skor yang hampir sama. Hal ini menunjukkan tes tersebut memiliki ….', 'reliabilitas tinggi', ['validitas isi tinggi', 'daya pembeda tinggi', 'tingkat kesukaran tinggi', 'objektivitas rendah'], 'Reliabilitas adalah keajekan (konsistensi) hasil pengukuran.'),
    P('asesmen', 'Rubrik analitik lebih tepat digunakan daripada rubrik holistik ketika guru ingin ….', 'memberikan umpan balik rinci pada setiap aspek laporan praktikum', ['menilai dengan cepat secara keseluruhan', 'menghemat waktu penilaian ujian akhir', 'menghindari penggunaan kriteria', 'membandingkan peserta didik dengan kelas lain'], 'Rubrik analitik menilai setiap kriteria secara terpisah sehingga informatif untuk umpan balik; rubrik holistik memberi satu skor menyeluruh.'),
    P('asesmen', 'Seorang guru menilai sikap ilmiah peserta didik (jujur dalam melaporkan data) selama praktikum. Teknik asesmen yang paling tepat adalah ….', 'observasi dengan lembar pengamatan dan catatan anekdot', ['tes pilihan ganda', 'tes uraian tertulis', 'kuis daring', 'tes lisan tentang rumus'], 'Sikap diamati dalam perilaku nyata; observasi dan jurnal/anekdot lebih sesuai dibanding tes tertulis.'),
    P('asesmen', 'Pengecoh (distraktor) pada soal pilihan ganda dikatakan berfungsi baik apabila ….', 'dipilih oleh sebagian peserta didik, terutama dari kelompok bawah', ['tidak dipilih oleh peserta didik mana pun', 'lebih banyak dipilih kelompok atas daripada kelompok bawah', 'jelas-jelas salah sehingga mudah dihindari', 'isinya tidak berhubungan dengan materi'], 'Distraktor efektif bersifat homogen dan masuk akal; umumnya dianggap berfungsi bila dipilih minimal sekitar 5% peserta, lebih banyak oleh kelompok bawah.'),
    P('refleksi', 'Seorang guru fisika ingin memperbaiki rendahnya keterampilan peserta didik membaca grafik melalui penelitian tindakan kelas (PTK). Urutan siklus PTK yang benar adalah ….', 'perencanaan → pelaksanaan tindakan → observasi → refleksi', ['observasi → perencanaan → refleksi → tindakan', 'refleksi → observasi → tindakan → perencanaan', 'tindakan → perencanaan → refleksi → observasi', 'perencanaan → refleksi → tindakan → observasi'], 'Model Kemmis & McTaggart: plan, act, observe, reflect; hasil refleksi menjadi dasar perencanaan siklus berikutnya.'),
    P('refleksi', 'Setelah mengajar, guru menuliskan jurnal tentang bagian pembelajaran yang berhasil dan yang perlu diperbaiki. Kegiatan ini paling tepat disebut ….', 'refleksi diri untuk pengembangan keprofesian berkelanjutan', ['asesmen sumatif peserta didik', 'supervisi akademik oleh kepala sekolah', 'analisis butir soal', 'evaluasi program sekolah'], 'Refleksi diri adalah dasar pengembangan profesional; guru belajar dari praktiknya sendiri.'),
    P('refleksi', 'Komunitas belajar (kombel) guru fisika di sekolah paling efektif apabila ….', 'guru secara rutin berbagi praktik baik, mengkaji data hasil belajar peserta didik, dan merancang perbaikan bersama', ['hanya diisi ceramah narasumber dari luar', 'dilaksanakan sekali setahun saat ada perintah', 'berfokus pada pembagian jadwal mengajar', 'diikuti untuk memenuhi absensi'], 'Komunitas belajar profesional berfokus pada pembelajaran peserta didik melalui kolaborasi berkelanjutan dan berbasis data.'),
    P('praktikum', 'Pada percobaan menentukan percepatan gravitasi dengan bandul, peserta didik mengukur waktu 20 ayunan lalu membaginya dengan 20, bukan mengukur satu ayunan. Alasan yang paling tepat adalah ….', 'mengurangi pengaruh kesalahan waktu reaksi saat menekan stopwatch', ['agar periode bandul menjadi lebih besar', 'agar amplitudo ayunan tetap', 'karena stopwatch tidak dapat mengukur waktu singkat', 'agar massa beban tidak berpengaruh'], 'Kesalahan reaksi (±0,2 s) tersebar pada 20 ayunan sehingga ketidakpastian periode menjadi jauh lebih kecil.'),
    P('praktikum', 'Data percobaan peserta didik menunjukkan satu titik data yang menyimpang jauh dari pola. Sikap ilmiah yang paling tepat adalah ….', 'mengulang pengukuran untuk titik tersebut dan melaporkan secara jujur jika penyimpangan tetap terjadi beserta dugaan penyebabnya', ['menghapus data tersebut agar grafik terlihat rapi', 'mengganti data dengan nilai teoretis', 'menyalin data kelompok lain', 'mengabaikan seluruh data percobaan'], 'Kejujuran ilmiah dan pengulangan pengukuran adalah bagian dari keterampilan proses sains. Manipulasi data tidak dibenarkan.'),
    P('praktikum', 'Keterampilan proses sains yang dilatih ketika peserta didik membuat grafik hubungan beban dan pertambahan panjang pegas lalu menentukan kemiringannya adalah ….', 'menginterpretasi data', ['mengamati', 'mengklasifikasi', 'berkomunikasi lisan', 'merumuskan masalah'], 'Mengolah data menjadi grafik dan menarik makna dari pola (kemiringan = konstanta pegas) adalah keterampilan menginterpretasi data.'),
    P('tpack', 'Guru meminta peserta didik merekam video gerak bola dengan ponsel lalu menganalisisnya dengan aplikasi Tracker untuk memperoleh grafik posisi–waktu. Kelebihan utama kegiatan ini adalah ….', 'peserta didik memperoleh data nyata dari fenomena di sekitarnya dan melatih analisis data dengan teknologi', ['peserta didik tidak perlu memahami konsep gerak', 'pembelajaran menjadi lebih singkat tanpa diskusi', 'guru tidak perlu menyiapkan LKPD', 'nilai peserta didik pasti meningkat'], 'Video analysis memadukan teknologi, pedagogi inkuiri, dan konten kinematika sehingga data autentik dapat dianalisis secara kuantitatif.'),
    P('tpack', 'Penggunaan kecerdasan artifisial (AI) generatif oleh peserta didik saat mengerjakan laporan praktikum sebaiknya disikapi guru dengan ….', 'menyepakati aturan penggunaan yang etis, meminta peserta didik mencantumkan penggunaannya, dan menilai proses berpikir melalui presentasi atau tanya jawab', ['melarang seluruh penggunaan teknologi di sekolah', 'membiarkan tanpa batasan karena AI selalu benar', 'menganggap semua laporan sebagai plagiarisme', 'mengganti seluruh tugas dengan hafalan'], 'Literasi AI menuntut penggunaan yang etis, transparan, dan kritis. Asesmen sebaiknya juga menggali proses dan pemahaman, bukan hanya produk akhir.'),
    P('teori-belajar', 'Menurut konstruktivisme, peran guru yang paling tepat dalam pembelajaran fisika adalah ….', 'fasilitator yang menciptakan situasi agar peserta didik membangun sendiri pengetahuannya', ['sumber utama pengetahuan yang harus dihafal', 'pengawas yang memastikan peserta didik diam', 'penilai tunggal yang hanya memberi angka', 'penyampai materi tanpa interaksi'], 'Konstruktivisme memandang pengetahuan dibangun aktif oleh peserta didik melalui pengalaman dan interaksi sosial.'),
    P('teori-belajar', 'Menurut teori beban kognitif (cognitive load), guru sebaiknya menyajikan contoh soal fisika yang kompleks dengan cara ….', 'memberikan contoh soal terselesaikan (worked example) bertahap sebelum peserta didik memecahkan soal sejenis secara mandiri', ['langsung memberikan soal tersulit tanpa contoh', 'menampilkan seluruh informasi sekaligus dalam satu slide padat', 'menambahkan animasi dekoratif sebanyak mungkin', 'meminta peserta didik menghafal semua langkah'], 'Worked example mengurangi beban kognitif ekstrinsik pada pemula, sehingga kapasitas memori kerja dapat digunakan untuk memahami struktur masalah.'),
    P('model', 'Pada model kooperatif tipe Jigsaw, ciri khas yang membedakannya dari model kooperatif lain adalah ….', 'adanya kelompok ahli yang mendalami submateri lalu kembali mengajarkannya ke kelompok asal', ['kuis individual dan skor peningkatan', 'turnamen akademik antarkelompok', 'pemanggilan nomor kepala secara acak', 'presentasi guru di awal saja'], 'Jigsaw: kelompok asal → kelompok ahli → kembali ke kelompok asal untuk saling mengajarkan; setiap anggota bertanggung jawab atas satu bagian.'),
    P('model', 'Pendekatan STEM dalam pembelajaran fisika paling tepat dicirikan oleh ….', 'peserta didik memecahkan masalah nyata dengan merancang solusi yang memadukan sains, teknologi, rekayasa, dan matematika', ['guru mengajarkan empat mata pelajaran secara terpisah', 'peserta didik hanya menggunakan komputer', 'pembelajaran berfokus pada hafalan rumus matematika', 'praktikum mengikuti resep tanpa perancangan'], 'STEM terintegrasi biasanya menggunakan engineering design process (definisi masalah, rancang, buat, uji, perbaiki).'),
    P('kelas', 'Teknik "wait time" saat bertanya kepada peserta didik bertujuan untuk ….', 'memberi waktu berpikir sehingga jawaban lebih berkualitas dan lebih banyak peserta didik berpartisipasi', ['menghabiskan waktu pelajaran', 'menunggu peserta didik yang terlambat', 'membuat peserta didik merasa tertekan', 'mengurangi jumlah pertanyaan guru'], 'Penelitian Rowe menunjukkan jeda 3–5 detik setelah bertanya meningkatkan panjang dan kualitas jawaban serta partisipasi.'),
    P('kelas', 'Orang tua seorang peserta didik mengeluhkan nilai fisika anaknya yang rendah. Sikap guru yang paling tepat adalah ….', 'menjelaskan perkembangan belajar anak berdasarkan data asesmen dan menyepakati langkah dukungan bersama', ['menyalahkan anak karena malas belajar', 'menaikkan nilai agar orang tua puas', 'menghindari pertemuan dengan orang tua', 'menyarankan pindah sekolah'], 'Komunikasi efektif dengan orang tua berbasis data dan berorientasi solusi memperkuat kemitraan dalam mendukung belajar peserta didik.'),
    P('miskonsepsi', 'Sumber miskonsepsi fisika yang berasal dari penggunaan bahasa sehari-hari, misalnya "berat badan 50 kg", paling tepat diatasi dengan ….', 'membedakan secara eksplisit istilah ilmiah (massa dan berat) dengan istilah sehari-hari melalui contoh dan pengukuran', ['melarang peserta didik menggunakan istilah sehari-hari', 'mengabaikannya karena tidak penting', 'menggunakan istilah sehari-hari dalam soal ujian', 'menghafal definisi massa dan berat saja'], 'Konflik makna bahasa sehari-hari dan bahasa ilmiah perlu dijembatani secara eksplisit agar peserta didik memahami perbedaan konsepnya.'),
    P('miskonsepsi', 'Guru menemukan buku teks yang menyatakan "gaya sentrifugal menyebabkan benda terlempar keluar dari lintasan melingkar". Tindakan guru yang paling tepat adalah ….', 'menjadikannya bahan diskusi kritis dan meluruskan konsep dengan menganalisis gaya pada kerangka acuan inersial', ['mengajarkannya apa adanya karena tercantum di buku', 'melarang peserta didik membaca buku tersebut tanpa penjelasan', 'mengabaikan bagian tersebut', 'meminta peserta didik menghafal pernyataan tersebut'], 'Buku teks dapat menjadi sumber miskonsepsi. Guru profesional bersikap kritis dan menjadikan kekeliruan sebagai kesempatan belajar.'),
    P('diferensiasi', 'Tujuan utama asesmen awal sebelum pembelajaran berdiferensiasi adalah ….', 'memetakan kesiapan, minat, dan profil belajar peserta didik untuk merancang pembelajaran yang sesuai', ['menentukan nilai rapor awal semester', 'memberi label pintar dan kurang pintar secara permanen', 'mengelompokkan peserta didik secara tetap selama setahun', 'memenuhi administrasi kurikulum'], 'Hasil asesmen awal bersifat diagnostik dan pengelompokannya fleksibel, tidak untuk memberi label permanen.'),
    P('kurikulum', 'Kegiatan kokurikuler dalam kerangka kurikulum saat ini bertujuan untuk ….', 'memperkuat pencapaian dimensi profil lulusan melalui pembelajaran lintas disiplin, gerakan kebiasaan, atau kegiatan bermakna lainnya', ['menambah jam pelajaran fisika untuk persiapan ujian', 'menggantikan kegiatan intrakurikuler', 'menilai kinerja guru oleh pengawas', 'mengisi waktu luang tanpa tujuan pembelajaran'], 'Kokurikuler melengkapi intrakurikuler untuk memperkuat profil lulusan, misalnya melalui proyek lintas mata pelajaran, gerakan 7 kebiasaan anak Indonesia hebat, atau bentuk kegiatan lain.'),
  ];
  FIXED.forEach((p, i) => add({ id: 'ped-umum-' + (i + 1), topic: p.topic, level: p.level, count: 1, gen() {
    return { q: p.q, correct: p.correct, wrong: p.wrong, explain: p.explain };
  }}));
})(typeof window !== 'undefined' ? window : globalThis);
