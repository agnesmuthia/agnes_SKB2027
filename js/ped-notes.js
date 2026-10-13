/* Ringkasan materi pedagogik untuk dibaca sebelum/ sesudah latihan. */
(function (root) {
  'use strict';
  const SKB = (root.SKB = root.SKB || {});
  SKB.PED_NOTES = [
    { id: 'strategi', title: 'Strategi mengerjakan soal SKB', html: `
      <ul>
        <li><b>Atur irama.</b> Format seleksi sebelumnya memberi waktu sekitar 1 menit per soal. Lewati soal hitungan panjang, tandai <i>ragu-ragu</i>, dan kembali di akhir.</li>
        <li><b>Jawab semua soal.</b> Pada kompetensi teknis, jawaban salah atau kosong bernilai 0 (tidak ada pengurangan), jadi jangan biarkan soal kosong.</li>
        <li><b>Soal pedagogik berbentuk "paling tepat".</b> Biasanya lebih dari satu opsi terdengar baik. Pilih yang paling berpusat pada peserta didik, berbasis data/asesmen, sesuai tahap model, dan menyelesaikan akar masalah.</li>
        <li><b>Hindari opsi ekstrem</b>: menghukum, membiarkan, menaikkan nilai, ceramah ulang saja, atau menyerahkan ke pihak lain tanpa tindakan.</li>
        <li><b>Soal manajerial/sosiokultural/wawancara</b> menilai setiap opsi 1–4. Pilih respons yang proaktif, berintegritas, kolaboratif, dan memberi solusi.</li>
        <li><b>Soal fisika HOTS</b> sering berupa perbandingan. Tulis besaran sebagai perbandingan pangkat (misalnya F ∝ 1/r²) tanpa menghitung nilai mutlak.</li>
      </ul>` },
    { id: 'teori', title: 'Teori belajar dan perkembangan', html: `
      <table><tr><th>Tokoh</th><th>Gagasan kunci</th><th>Ciri di kelas fisika</th></tr>
      <tr><td>Piaget</td><td>Asimilasi, akomodasi, ekuilibrasi; tahap operasional formal (≥11 th)</td><td>Konflik kognitif lewat demonstrasi yang bertentangan dengan dugaan siswa</td></tr>
      <tr><td>Vygotsky</td><td>Zona perkembangan proksimal (ZPD), scaffolding, interaksi sosial</td><td>Bantuan bertahap lalu dikurangi; diskusi kelompok heterogen</td></tr>
      <tr><td>Bruner</td><td>Belajar penemuan; enaktif → ikonik → simbolik</td><td>Benda nyata → grafik/diagram → persamaan</td></tr>
      <tr><td>Ausubel</td><td>Belajar bermakna, advance organizer</td><td>Peta konsep yang mengaitkan materi baru dengan prasyarat</td></tr>
      <tr><td>Gagne</td><td>Sembilan peristiwa pembelajaran, hierarki belajar</td><td>Urutan: menarik perhatian, menyampaikan tujuan, mengingat prasyarat, …</td></tr>
      <tr><td>Skinner</td><td>Penguatan (reinforcement)</td><td>Pujian/poin untuk perilaku yang diharapkan</td></tr>
      <tr><td>Bandura</td><td>Belajar sosial, pemodelan</td><td>Guru memperagakan prosedur praktikum lalu siswa menirukan</td></tr>
      <tr><td>Sweller</td><td>Beban kognitif</td><td>Worked example, kurangi informasi yang tidak relevan</td></tr></table>` },
    { id: 'model', title: 'Model pembelajaran dan sintaksnya', html: `
      <dl>
        <dt>Problem Based Learning (PBL)</dt><dd>1) Orientasi pada masalah → 2) Mengorganisasi peserta didik → 3) Membimbing penyelidikan → 4) Mengembangkan dan menyajikan hasil → 5) Menganalisis dan mengevaluasi proses.</dd>
        <dt>Project Based Learning (PjBL)</dt><dd>1) Pertanyaan mendasar → 2) Desain perencanaan proyek → 3) Menyusun jadwal → 4) Memonitor kemajuan → 5) Menguji hasil → 6) Evaluasi pengalaman.</dd>
        <dt>Discovery Learning</dt><dd>Stimulasi → identifikasi masalah → pengumpulan data → pengolahan data → pembuktian → generalisasi.</dd>
        <dt>Inkuiri terbimbing</dt><dd>Orientasi → merumuskan masalah → merumuskan hipotesis → mengumpulkan data → menguji hipotesis → menyimpulkan.</dd>
        <dt>Learning Cycle 5E</dt><dd>Engage → Explore → Explain → Elaborate → Evaluate.</dd>
        <dt>POE</dt><dd>Predict → Observe → Explain. Efektif untuk perubahan konseptual.</dd>
        <dt>Kooperatif</dt><dd>STAD (penyajian, tim, kuis individual, skor peningkatan, penghargaan); Jigsaw (kelompok asal → kelompok ahli → kembali); NHT (penomoran, pengajuan pertanyaan, berpikir bersama, menjawab); TGT (turnamen).</dd>
        <dt>Pembelajaran langsung</dt><dd>Untuk keterampilan prosedural: orientasi, demonstrasi, latihan terbimbing, umpan balik, latihan mandiri.</dd>
      </dl>
      <p><b>Memilih model:</b> produk → PjBL; masalah autentik tak terstruktur → PBL; menemukan hubungan variabel → Discovery/Inkuiri; mengubah miskonsepsi → POE/konflik kognitif; prosedur alat → pembelajaran langsung.</p>` },
    { id: 'kurikulum', title: 'Kurikulum Merdeka dan Pembelajaran Mendalam', html: `
      <ul>
        <li><b>CP → TP → ATP → modul ajar.</b> Capaian pembelajaran ditetapkan pemerintah per fase (Fase E kelas X, Fase F kelas XI–XII). Guru merumuskan tujuan pembelajaran (TP), menyusunnya menjadi alur (ATP), lalu merancang modul ajar.</li>
        <li><b>Rumusan TP</b> memuat kompetensi (kata kerja operasional yang dapat diamati) dan lingkup materi; dapat memakai format ABCD (Audience, Behavior, Condition, Degree).</li>
        <li><b>KKTP</b> (kriteria ketercapaian tujuan pembelajaran) menggantikan KKM: berupa deskripsi, rubrik, atau interval nilai.</li>
        <li><b>Asesmen</b>: diagnostik (awal), formatif (selama proses, untuk umpan balik), sumatif (akhir lingkup materi).</li>
        <li><b>Pembelajaran Mendalam</b>: prinsip <i>berkesadaran</i> (mindful), <i>bermakna</i> (meaningful), <i>menggembirakan</i> (joyful); pengalaman belajar <i>memahami, mengaplikasi, merefleksi</i>.</li>
        <li><b>Delapan dimensi profil lulusan</b>: keimanan dan ketakwaan kepada Tuhan YME, kewargaan, penalaran kritis, kreativitas, kolaborasi, kemandirian, kesehatan, komunikasi.</li>
        <li><b>Kokurikuler</b> memperkuat profil lulusan melalui pembelajaran lintas disiplin, gerakan kebiasaan, atau kegiatan bermakna lain.</li>
      </ul>
      <p class="note">Kebijakan kurikulum dapat berubah menjelang 2027. Selalu cocokkan dengan regulasi terbaru dari kementerian.</p>` },
    { id: 'bloom', title: 'Taksonomi Bloom revisi dan HOTS', html: `
      <table><tr><th>Level</th><th>Kata kerja operasional (contoh)</th></tr>
      <tr><td>C1 Mengingat</td><td>menyebutkan, mendefinisikan, mengidentifikasi</td></tr>
      <tr><td>C2 Memahami</td><td>menjelaskan, mencontohkan, mengklasifikasi, merangkum</td></tr>
      <tr><td>C3 Menerapkan</td><td>menghitung, menggunakan, melaksanakan</td></tr>
      <tr><td>C4 Menganalisis</td><td>menganalisis, membedakan, mengorganisasi, menghubungkan</td></tr>
      <tr><td>C5 Mengevaluasi</td><td>menilai, mengkritik, membuktikan, memutuskan</td></tr>
      <tr><td>C6 Mencipta</td><td>merancang, merumuskan, membangun, menghasilkan</td></tr></table>
      <p>Soal HOTS (C4–C6) memakai stimulus kontekstual (data, grafik, kasus), menuntut penalaran, dan tidak dapat dijawab dengan hafalan atau substitusi rumus langsung. Kata "memahami" tidak operasional untuk TP.</p>` },
    { id: 'asesmen', title: 'Asesmen dan analisis butir soal', html: `
      <ul>
        <li><b>Validitas</b>: mengukur apa yang seharusnya diukur (validitas isi = keterwakilan materi/kisi-kisi). <b>Reliabilitas</b>: keajekan hasil.</li>
        <li><b>Indeks kesukaran</b> P = B/JS. P &lt; 0,30 sukar; 0,30–0,70 sedang; &gt; 0,70 mudah.</li>
        <li><b>Daya pembeda</b> D = (B<sub>A</sub> − B<sub>B</sub>)/(½JS). Negatif dibuang; 0,00–0,20 jelek; 0,21–0,40 cukup; 0,41–0,70 baik; 0,71–1,00 baik sekali.</li>
        <li><b>Distraktor</b> berfungsi bila dipilih sebagian peserta (umumnya ≥5%), lebih banyak oleh kelompok bawah.</li>
        <li><b>Rubrik analitik</b> (per kriteria, umpan balik rinci) vs <b>holistik</b> (satu skor keseluruhan).</li>
        <li><b>Tes diagnostik bertingkat</b> (jawaban–alasan–keyakinan) membedakan miskonsepsi dan tidak tahu konsep.</li>
        <li><b>Tindak lanjut</b>: sebagian besar belum tuntas → pembelajaran ulang klasikal dengan strategi berbeda; sebagian kecil → remedial terarah + pengayaan bagi yang tuntas.</li>
        <li><b>Umpan balik efektif</b>: spesifik, segera, fokus pada proses, menunjukkan langkah perbaikan.</li>
      </ul>` },
    { id: 'diferensiasi', title: 'Pembelajaran berdiferensiasi', html: `
      <p>Berdasarkan kebutuhan belajar: <b>kesiapan</b> (kemampuan awal), <b>minat</b>, dan <b>profil belajar</b>.</p>
      <ul>
        <li><b>Konten</b>: apa yang dipelajari dan bentuk sumbernya (teks, video, simulasi).</li>
        <li><b>Proses</b>: bagaimana belajar (pengelompokan fleksibel, LKPD berjenjang, scaffolding, waktu).</li>
        <li><b>Produk</b>: cara menunjukkan hasil belajar (poster, video, model) dengan kriteria yang sama.</li>
        <li><b>Lingkungan belajar</b>: suasana, tata ruang, aturan kelas.</li>
      </ul>
      <p>Hasil asesmen awal dipakai untuk merancang, bukan untuk memberi label permanen.</p>` },
    { id: 'miskonsepsi', title: 'Miskonsepsi dan perubahan konseptual', html: `
      <ul>
        <li><b>Sumber</b>: pengalaman sehari-hari, bahasa sehari-hari, buku teks, cara mengajar guru, intuisi.</li>
        <li><b>Syarat perubahan konseptual (Posner dkk.)</b>: ketidakpuasan terhadap konsep lama, konsep baru <i>intelligible</i> (dapat dipahami), <i>plausible</i> (masuk akal), <i>fruitful</i> (bermanfaat).</li>
        <li><b>Strategi</b>: POE, demonstrasi pembangkit konflik kognitif (discrepant event), analogi jembatan, simulasi interaktif, diskusi kelas.</li>
        <li><b>Contoh klasik</b>: gerak perlu gaya; benda berat jatuh lebih cepat; di puncak lemparan percepatan nol; arus habis di lampu; panas dan suhu sama; mata memancarkan cahaya.</li>
      </ul>` },
    { id: 'tpack', title: 'TPACK, media, dan laboratorium virtual', html: `
      <ul>
        <li><b>TK, PK, CK</b> beserta irisannya: PCK (cara mengajarkan konten tertentu), TCK (teknologi untuk merepresentasikan konten), TPK (teknologi untuk strategi), TPACK (perpaduan utuh).</li>
        <li><b>Laboratorium virtual</b> (PhET, simulasi interaktif) untuk visualisasi hal abstrak dan manipulasi variabel; tetap pakai LKPD agar terarah.</li>
        <li><b>Analisis video</b> (Tracker) dan sensor ponsel (phyphox) memberi data nyata gerak, bunyi, dan percepatan.</li>
        <li><b>Model SAMR</b>: Substitution, Augmentation, Modification, Redefinition.</li>
        <li><b>AI generatif</b>: sepakati aturan etis, minta pencantuman penggunaan, nilai proses berpikir.</li>
      </ul>` },
    { id: 'kps', title: 'Keterampilan proses sains dan praktikum', html: `
      <ul>
        <li><b>Dasar</b>: mengamati, mengklasifikasi, mengukur, memprediksi, menyimpulkan, mengomunikasikan.</li>
        <li><b>Terintegrasi</b>: merumuskan masalah, mengidentifikasi variabel, merumuskan hipotesis, merancang percobaan, menginterpretasi data.</li>
        <li><b>Variabel</b>: bebas (sengaja diubah), terikat (diukur sebagai akibat), kontrol (dijaga tetap).</li>
        <li><b>Rumusan masalah</b>: "Bagaimana pengaruh [variabel bebas] terhadap [variabel terikat]?"</li>
        <li><b>Mengurangi ketidakpastian</b>: pengukuran berulang, mengukur banyak getaran sekaligus, membaca skala tegak lurus (hindari paralaks).</li>
        <li><b>Sikap ilmiah</b>: jujur melaporkan data, mengulang pengukuran yang menyimpang, tidak memanipulasi data.</li>
      </ul>` },
    { id: 'kelas', title: 'Pengelolaan kelas, komunikasi, dan etika', html: `
      <ul>
        <li><b>Disiplin positif</b>: kesepakatan kelas disusun bersama; intervensi minimal (kedekatan, isyarat nonverbal) sebelum sanksi.</li>
        <li><b>Bertanya</b>: pertanyaan divergen (mengapa, bagaimana jika), wait time 3–5 detik, sebaran pertanyaan merata.</li>
        <li><b>Kerja kelompok</b>: saling ketergantungan positif, tanggung jawab individu, peran bergilir.</li>
        <li><b>Keselamatan laboratorium</b> adalah prioritas utama; hentikan segera tindakan berbahaya.</li>
        <li><b>Inklusi</b>: sesuaikan akses (visual untuk tunarungu, audio/taktil untuk tunanetra), bukan menurunkan harapan.</li>
        <li><b>Komunikasi dengan orang tua</b>: berbasis data, empatik, dan berorientasi solusi.</li>
        <li><b>Refleksi dan PTK</b>: perencanaan → tindakan → observasi → refleksi (berulang per siklus).</li>
      </ul>` },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
