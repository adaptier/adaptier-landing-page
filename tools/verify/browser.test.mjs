import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startServer } from './serve.mjs';

let server, browser;
before(async () => {
  server = await startServer();
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium-browser' });
});
after(async () => { await browser?.close(); server?.close(); });

async function open(opts = {}, { demoUrl } = {}) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  if (demoUrl !== undefined) {
    await page.route('**/main.js', async route => {
      const res = await route.fetch();
      const body = (await res.text()).replace('const DEMO_URL = "";', `const DEMO_URL = ${JSON.stringify(demoUrl)};`);
      if (!body.includes(JSON.stringify(demoUrl))) throw new Error('DEMO_URL rewrite did not apply — main.js line changed?');
      await route.fulfill({ response: res, body });
    });
  }
  await page.goto(server.url, { waitUntil: 'networkidle' });
  return { page, ctx, errors };
}

for (const width of [1440, 960, 390, 320]) {
  test(`renders at ${width}px without errors or horizontal overflow`, async () => {
    const { page, ctx, errors } = await open({ viewport: { width, height: 900 } });
    assert.deepEqual(errors, []);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(over <= 0, `overflows by ${over}px`);
    await ctx.close();
  });
}

test('demo buttons stay hidden while DEMO_URL is empty', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 } });
  const visible = await page.$$eval('[data-demo]', els => els.filter(e => e.checkVisibility()).length);
  assert.equal(visible, 0);
  await ctx.close();
});

for (const url of ['mailto:demo@example.com', 'https://example.com/book']) {
  test(`demo url set (${url.split(':')[0]}) shows every demo button with that href`, async () => {
    const { page, ctx } = await open({ viewport: { width: 1440, height: 900 } }, { demoUrl: url });
    const els = await page.$$eval('[data-demo]', es => es.map(e => ({
      shown: !e.hidden, href: e.tagName === 'A' ? e.getAttribute('href') : null })));
    assert.ok(els.length >= 3);
    for (const e of els) { assert.ok(e.shown); if (e.href !== null) assert.equal(e.href, url); }
    await ctx.close();
  });
}

test('no-JS: content and diagrams visible, demo hidden', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  for (const sel of ['#integration h2', '#plc h2', '#hmi h2', '#fleet h2', '#distributed h2',
    '#hero-diagram', '#distributed-diagram']) {
    assert.ok(await page.isVisible(sel), sel);
  }
  assert.equal(await page.$$eval('[data-demo]', es => es.filter(e => !e.hidden).length), 0);
  await ctx.close();
});

test('reduced motion: nothing animates', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  await ctx.close();
});

test('motion allowed: the diagrams animate', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 } });
  assert.ok(await page.evaluate(() => document.getAnimations().filter(a => a.effect?.target?.closest?.('#hero-diagram, #distributed-diagram')).length) > 0);
  await ctx.close();
});

test('WAN toggle cuts and restores the internet link', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 } });
  await page.click('#wan-toggle');
  assert.equal(await page.getAttribute('#distributed-diagram', 'data-wan'), 'down');
  assert.equal(await page.getAttribute('#wan-toggle', 'aria-pressed'), 'true');
  await page.click('#wan-toggle');
  assert.equal(await page.getAttribute('#distributed-diagram', 'data-wan'), 'up');
  await ctx.close();
});

test('anchor lands below the sticky nav', async () => {
  const { page, ctx } = await open({ viewport: { width: 1440, height: 900 } });
  await page.click('nav a[href="#fleet"]');
  await page.waitForTimeout(800);
  const top = await page.$eval('#fleet h2', h => h.getBoundingClientRect().top);
  assert.ok(top >= 58, `heading hidden under nav (top=${top})`);
  await ctx.close();
});
