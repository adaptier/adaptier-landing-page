import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './serve.mjs';

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const js = existsSync(join(ROOT, 'main.js')) ? readFileSync(join(ROOT, 'main.js'), 'utf8') : '';
const attrText = [...html.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g)].map(m => m[1]).join(' ');
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ') + ' ' + attrText;

test('no dead links', () => {
  assert.doesNotMatch(html, /href="#"/);
});

test('every in-page anchor resolves', () => {
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.match(html, new RegExp(`id="${id}"`), `missing target #${id}`);
  }
});

test('the five pillar sections exist', () => {
  for (const id of ['integration', 'plc', 'hmi', 'fleet', 'distributed']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`), id);
  }
});

test('forbidden claims and customer strings are absent', () => {
  const banned = ['certified', 'sparkplug', 'mqtt', 'http rest', 'ladder', 'sfc', 'free trial',
    'pricing', 'kepware', 'only platform', 'jetstream', 'vxt', 'vaxthuset', 'huddinge',
    'styrfabriken', '10.100.', '10.241.', '0.42'];
  const hay = (html + js).toLowerCase();
  for (const b of banned) assert.ok(!hay.includes(b), `found "${b}"`);
});

test('NATS is named exactly once (the footnote)', () => {
  assert.equal((text.match(/\bNATS\b/g) ?? []).length, 1);
});

test('every number on the page is a verified claim', () => {
  // Each entry: number → claim id in spec §5. Add a number here only with its claim.
  const allowed = new Map([
    ['61131', 'C7'], ['3', 'C7'], ['206', 'C11'],
    ['30', 'C27, C32'], ['365', 'C27'], ['44', 'C29'], ['200', 'C29'], ['2026', 'footer'],
    ['01', 'label'], ['02', 'label'], ['03', 'label'], ['04', 'label'], ['05', 'label'],
  ]);
  for (const [n] of text.matchAll(/\b\d+\b/g)) assert.ok(allowed.has(n), `unmapped number ${n}`);
});

test('images have dimensions and alt; only the first is eager', () => {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  assert.ok(imgs.length >= 4, 'expected product screenshots');
  imgs.forEach((tag, i) => {
    assert.match(tag, /\bwidth="\d+"/, tag);
    assert.match(tag, /\bheight="\d+"/, tag);
    assert.match(tag, /\balt="[^"]+"/, tag);
    if (i > 0) assert.match(tag, /loading="lazy"/, tag);
  });
});

test('meta description and social tags', () => {
  for (const re of [/<meta name="description" content="[^"]{50,}"/, /<meta property="og:title"/,
    /<meta property="og:image" content="https:\/\/adaptier\.io\/images\/og\.png"/, /<meta name="twitter:card"/]) {
    assert.match(html, re);
  }
});

test('no external scripts', () => {
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('demo buttons ship hidden and point at /demo', () => {
  const demos = [...html.matchAll(/<[^>]*\bdata-demo\b[^>]*>/g)].map(m => m[0]);
  assert.ok(demos.length >= 3, 'nav, hero and closing need a demo button');
  for (const d of demos) assert.match(d, /\bhidden\b/, d);
  assert.match(js, /^const DEMO_URL = "\/demo";$/m);
});

const demoPage = readFileSync(join(ROOT, 'demo/index.html'), 'utf8');

test('/demo forwards to a Microsoft Bookings page', () => {
  const m = demoPage.match(/const DEMO_BOOKING_URL = atob\("([A-Za-z0-9+/=]+)"\);/);
  assert.ok(m, 'DEMO_BOOKING_URL constant missing');
  assert.match(Buffer.from(m[1], 'base64').toString('utf8'), /^https:\/\/outlook\.office\.com\/book\/[^\s"]+$/);
  assert.match(demoPage, /location\.replace\(DEMO_BOOKING_URL\)/);
  assert.match(demoPage, /<meta name="robots" content="noindex, nofollow"/);
});

test('no email address in any served text file', () => {
  const css = readFileSync(join(ROOT, 'styles.css'), 'utf8');
  for (const [name, body] of [['index.html', html], ['main.js', js], ['styles.css', css], ['demo/index.html', demoPage]]) {
    // "x@2x.webp" (srcset) and "wght@400" (font URL) are not addresses.
    const hits = [...body.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)].map(m => m[0]).filter(h => !/@\d+x\./.test(h));
    assert.deepEqual(hits, [], name);
    assert.ok(!body.toLowerCase().includes('styrfabriken'), name);
  }
});

test('deploy workflow ships exactly the served files', () => {
  const wf = readFileSync(join(ROOT, '.github/workflows/deploy.yml'), 'utf8');
  assert.match(wf, /cp index\.html styles\.css main\.js favicon\.svg CNAME \.nojekyll _site\//);
  assert.match(wf, /cp demo\/index\.html _site\/demo\//);
  assert.doesNotMatch(wf, /\.jsx/);
});
