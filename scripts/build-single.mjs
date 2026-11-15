/**
 * Z hotového buildu (dist/) sestaví jeden soběstačný HTML soubor, který jde otevřít
 * dvojklikem přímo z disku nebo flashky, bez serveru a bez internetu.
 *
 * Prohlížeč z disku (file://) nenačte moduly ani písma uložená v samostatných souborech,
 * proto se skript, styly, písma i ikona vloží přímo do stránky.
 * Písma: jen woff2 (umí ho každý dnešní prohlížeč) a jen latinka s diakritikou.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const outDir = join(root, 'release');
const outFile = join(outDir, 'Svetlo-a-Stin.html');

/** Cesta v buildu (/assets/x.css, ./favicon.svg) → soubor v dist/. */
const fileOf = (url) => join(dist, url.replace(/^\.?\//, ''));
const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString('base64')}`;
/** Nahrazuje funkcí, aby se znaky $ v kódu nebraly jako vzory náhrady. */
const replaceOnce = (text, pattern, fn, what) => {
  if (!pattern.test(text)) throw new Error(`V dist/index.html chybí ${what}.`);
  return text.replace(pattern, fn);
};

const SKIP_SUBSETS = /-(cyrillic|cyrillic-ext|greek|greek-ext|vietnamese)-/;

function inlineCss(cssFile) {
  let css = readFileSync(cssFile, 'utf8');
  // Celé deklarace písem pro abecedy, které hra nepotřebuje.
  css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) => (SKIP_SUBSETS.test(block) ? '' : block));
  // Záložní formát woff vynechat, woff2 vložit přímo.
  css = css.replace(/,\s*url\([^)]*?\.woff\)\s*format\(["']?woff["']?\)/g, () => '');
  css = css.replace(/url\((["']?)([^)"']+?\.woff2)\1\)/g, (_, _q, url) => {
    const file = join(dirname(cssFile), basename(url));
    return `url(${dataUri(file, 'font/woff2')})`;
  });
  return css;
}

let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = replaceOnce(
  html,
  /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/,
  (_, href) => `<style>\n${inlineCss(fileOf(href))}\n</style>`,
  'odkaz na styly',
);

html = replaceOnce(
  html,
  /<script type="module"[^>]*src="([^"]+\.js)"[^>]*><\/script>/,
  (_, src) => {
    const js = readFileSync(fileOf(src), 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script type="module">\n${js}\n</script>`;
  },
  'skript hry',
);

html = html.replace(/<link rel="icon" href="([^"]+\.svg)"([^>]*)>/, (_, href, rest) => {
  return `<link rel="icon" href="${dataUri(fileOf(href), 'image/svg+xml')}"${rest}>`;
});

// Ikona na plochu iPhonu a manifest aplikace patří k verzi na webu, ze souboru je nikdo nevyužije.
html = html.replace(/\s*<link rel="(?:apple-touch-icon|manifest)"[^>]*>/g, '');

// Kontrola: stránka nesmí odkazovat na žádný další soubor.
const leftovers = html.match(/(?:src|href)="(?!data:|https?:)[^"]+"|url\((?!data:)["']?\/?assets\//g);
if (leftovers) throw new Error(`Zbyly odkazy na soubory: ${leftovers.slice(0, 3).join(', ')}`);

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, html);
const kb = Math.round(statSync(outFile).size / 1024);
console.log(`Samostatná hra: ${outFile.replace(root, '.')} (${kb} kB)`);
