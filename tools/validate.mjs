// Validasi bank soal: jalankan `node tools/validate.mjs` dari akar repo.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map((m) => m[1]).filter((s) => !s.endsWith('app.js'));
const ctx = { console };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const s of scripts) vm.runInContext(fs.readFileSync(path.join(root, s), 'utf8'), ctx, { filename: s });

const SKB = ctx.SKB;
const t0 = Date.now();
const bank = SKB.bank.build();
const ms = Date.now() - t0;
const errors = [];
const bad = /NaN|undefined|Infinity|\[object|null\b/;
const texts = new Map();
const count = {};
for (const q of bank.list) {
  count[q.sec] = (count[q.sec] || 0) + 1;
  const sjt = ['manajerial', 'sosiokultural', 'wawancara'].includes(q.sec);
  const n = sjt ? 4 : 5;
  if (q.options.length !== n) errors.push(`${q.id}: jumlah opsi ${q.options.length}`);
  if (new Set(q.options).size !== q.options.length) errors.push(`${q.id}: opsi kembar ${JSON.stringify(q.options)}`);
  if (!(q.answer >= 0 && q.answer < q.options.length)) errors.push(`${q.id}: kunci di luar rentang`);
  if (sjt && (!q.scores || q.scores[q.answer] !== 4)) errors.push(`${q.id}: skor SJT salah`);
  for (const s of [q.q, q.explain, ...q.options]) if (bad.test(String(s))) errors.push(`${q.id}: teks janggal → ${String(s).slice(0, 120)}`);
  if (!q.explain || q.explain.length < 20) errors.push(`${q.id}: pembahasan kosong`);
  for (const f of q.formulas || []) if (!SKB.FORMULA_INDEX[f]) errors.push(`${q.id}: rumus tidak dikenal ${f}`);
  const key = q.q + '|' + q.options.slice().sort().join('|');
  if (texts.has(key)) errors.push(`${q.id}: duplikat dengan ${texts.get(key)}`);
  texts.set(key, q.id);
}
const teknis = (count.pedagogik || 0) + (count.profesional || 0);
console.log(`Bank dibangun dalam ${ms} ms`);
console.log('Jumlah per bagian:', count);
console.log(`Total soal: ${bank.list.length} (teknis: ${teknis})`);
if (teknis < 5000) errors.push(`soal teknis kurang dari 5000 (${teknis})`);
const minNeed = { manajerial: 25, sosiokultural: 20, wawancara: 10 };
for (const [k, v] of Object.entries(minNeed)) if ((count[k] || 0) < v) errors.push(`${k} kurang dari ${v}`);
if (errors.length) {
  console.error(`\n${errors.length} masalah ditemukan:`);
  errors.slice(0, 60).forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('OK: semua soal lolos validasi.');
