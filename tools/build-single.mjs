// Membuat versi satu-berkas (offline) di dist/skb-fisika-2027.html: `node tools/build-single.mjs`.
// Opsi --fragment menghasilkan versi tanpa <html>/<head>/<body> (untuk dihosting sebagai artifact).
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fragment = process.argv.includes('--fragment');
const out = process.argv.find((a) => a.startsWith('--out='));
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, f) => `<style>\n${fs.readFileSync(path.join(root, f), 'utf8')}\n</style>`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, f) => `<script>\n${fs.readFileSync(path.join(root, f), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`);
if (fragment) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  html = head + body;
}
const dest = out ? out.slice(6) : path.join(root, 'dist', 'skb-fisika-2027.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, html);
console.log('Ditulis:', dest, (fs.statSync(dest).size / 1024).toFixed(0) + ' KB');
