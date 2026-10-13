# SKB Fisika 2027

Aplikasi web untuk latihan harian dan simulasi SKB (seleksi kompetensi) guru fisika: soal pedagogik dan profesional berlevel HOTS, pembahasan langkah demi langkah, rumus terkait, dan latihan rumus.

## Cara memakai

- **Paling mudah:** unduh `dist/skb-fisika-2027.html` lalu buka di peramban (bisa offline, juga di HP).
- **Dari kode sumber:** buka `index.html` langsung di peramban, atau sajikan folder ini lewat GitHub Pages.

Progres (riwayat, statistik, soal salah) tersimpan di peramban perangkat itu. Gunakan **Pengaturan → Cadangkan progres** untuk memindahkannya ke perangkat lain.

## Fitur

| Menu | Isi |
|---|---|
| Beranda | Rantai belajar harian, rumus hari ini, statistik, topik terlemah |
| Harian | 20 soal per hari (pedagogik, profesional, rumus), pembahasan langsung setelah menjawab |
| Simulasi | Ruang ujian bergaya CAT: hitung mundur, panel nomor, ragu-ragu, kumpul otomatis |
| Topik | Latihan per topik/bab, mode belajar atau mode ujian berwaktu |
| Rumus | 128 rumus dalam 31 bab (mengikuti urutan buku *Rumus Lengkap Fisika SMA*), kartu hafalan, kuis rumus |
| Ringkasan | Catatan pedagogik: teori belajar, model & sintaks, Kurikulum Merdeka, Pembelajaran Mendalam, asesmen, diferensiasi, miskonsepsi, TPACK |
| Riwayat | Grafik skor simulasi, akurasi per topik, pembahasan sesi lama |

## Format simulasi bawaan

| Simulasi | Soal | Waktu |
|---|---|---|
| Kompetensi Teknis | 40 pedagogik + 60 profesional | 100 menit |
| Lengkap | 100 teknis + 25 manajerial + 20 sosiokultural + 10 wawancara | 150 menit |
| Mini / Fokus Pedagogik / Fokus Profesional | 25 / 50 / 50 | 25 / 50 / 60 menit |

Penilaian: teknis benar = 5, salah/kosong = 0; manajerial, sosiokultural, wawancara 1–4 per opsi. Format ini mengikuti seleksi kompetensi guru tahun-tahun sebelumnya. Ketentuan resmi 2027 bisa berbeda; jumlah soal, waktu, dan ambang batas dapat diubah di **Pengaturan**.

## Bank soal

7.286 soal (6.984 soal teknis): 4.603 profesional fisika, 2.381 pedagogik, 245 latihan rumus, 57 manajerial/sosiokultural/wawancara. Soal hitungan dan skenario dibangkitkan secara deterministik dari templat berparameter (angka, konteks, dan materi bervariasi), ditambah soal konseptual yang ditulis manual.

Validasi seluruh bank soal (jumlah opsi, kunci, duplikat, pembahasan, referensi rumus):

```
node tools/validate.mjs
```

Membuat ulang versi satu berkas setelah mengubah kode:

```
node tools/build-single.mjs
```

## Struktur

```
index.html            kerangka aplikasi
css/style.css         tampilan
js/util.js            RNG berbibit, format angka Indonesia, render rumus
js/formulas.js        perpustakaan rumus per bab
js/bank-core.js       mesin bank soal
js/bank-fisika-*.js   generator soal profesional fisika
js/ped-topik.js       data materi untuk skenario pedagogik
js/bank-pedagogik.js  generator soal pedagogik
js/bank-nonteknis.js  manajerial, sosiokultural, wawancara, kuis rumus
js/ped-notes.js       ringkasan pedagogik
js/app.js             antarmuka
```
