import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';

const require = createRequire(process.env.STEAM_QA_PLAYWRIGHT || import.meta.url);
const { chromium, webkit } = require('playwright');
const engine = process.env.UX_QA_ENGINE || 'chromium';
const baseline = process.env.UX_QA_BASELINE === '1';
const base = process.env.STEAM_QA_URL || 'http://127.0.0.1:4174/';
const output = process.env.UX_QA_OUTPUT || 'output/site-ux';
const browser = await (engine === 'webkit' ? webkit : chromium).launch({
  headless: true,
  ...(engine === 'chromium' && process.env.STEAM_QA_CHROME === '1' ? {channel: 'chrome'} : {}),
});
const report = {base, engine, baseline, cases: [], errors: []};
await fs.mkdir(output, {recursive: true});
try {
  for (const [width, height] of [[1440,900], [390,844], [430,932], [320,568]]) {
    const context = await browser.newContext({viewport: {width, height},
      isMobile: width < 701, hasTouch: width < 701, reducedMotion: 'reduce'});
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    await page.goto(base, {waitUntil: 'load'});
    const menu = page.locator('#menu');
    await menu.locator('.section-head').scrollIntoViewIfNeeded();
    await page.locator('.menu-panel.active .menu-sheet-card img').scrollIntoViewIfNeeded();
    await page.locator('.menu-panel.active .menu-sheet-card img').evaluate(image => image.decode());
    await menu.locator('.section-head').scrollIntoViewIfNeeded();
    await page.screenshot({path: `${output}/${engine}-${width}-menu.png`, scale: 'css'});
    const before = await page.evaluate(() => ({
      navMenu: document.querySelector('.site-header nav a:nth-child(2)').getAttribute('href'),
      tabs: [...document.querySelectorAll('.menu-tab')].map(t => ({lang:t.dataset.lang, selected:t.getAttribute('aria-selected'), tabIndex:t.tabIndex})),
      menuBox: document.querySelector('#menu').getBoundingClientRect().toJSON(),
      accessBox: document.querySelector('#access').getBoundingClientRect().toJSON(),
      overflow: document.documentElement.scrollWidth > innerWidth,
      lazyImages: document.querySelectorAll('#favorites img[loading="lazy"]').length,
    }));
    if (!baseline) {
      assert.equal(before.navMenu, '#menu');
      assert.equal(before.tabs.filter(t => t.selected === 'true').length, 1);
      assert.equal(before.tabs[0].selected, 'true');
      assert.equal(before.tabs.filter(t => t.tabIndex === 0).length, 1);
      assert.equal(before.lazyImages, 8);
      const tab = language => page.locator(`.menu-tab[data-lang="${language}"]`);
      await tab('ja').focus();
      for (const [key, expected] of [['ArrowRight','en'],['ArrowRight','zh'],['End','ko'],['ArrowRight','ja'],['ArrowLeft','ko'],['Home','ja']]) {
        await page.keyboard.press(key);
        assert.equal(await tab(expected).getAttribute('aria-selected'), 'true');
        assert.equal(await tab(expected).evaluate(el => el === document.activeElement), true);
        assert.equal(await page.locator(`.menu-panel[data-panel="${expected}"]`).isVisible(), true);
      }
      for (const language of ['en','zh','ko','ja']) {
        await tab(language).click();
        assert.equal(await tab(language).getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('.menu-panel:visible .menu-row').count(), 40);
      }
      const enlarge = page.locator('.menu-panel.active [data-menu]');
      await enlarge.focus();
      await enlarge.press('Enter');
      const dialog = page.getByRole('dialog', {name:'日本語メニュー', exact:true});
      assert.equal(await dialog.isVisible(), true);
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'});
      assert.equal(await enlarge.evaluate(el => el === document.activeElement), true);
      // Test both labels without changing the actual sound implementation.
      const sound = page.locator('#sound-toggle');
      for (let i=0; i<2; i++) {
        assert((await sound.getAttribute('aria-label')).includes(await sound.innerText()));
        await sound.click();
        await page.waitForFunction(previous => document.querySelector('#sound-toggle').getAttribute('aria-pressed') !== previous, i===0 ? 'false' : 'true');
      }
      assert.equal(await sound.getAttribute('aria-pressed'), 'false');
      // Navigate from the real header; no call or external directions are started by QA.
      await page.locator('.site-header nav a[href="#menu"]').click();
      assert.equal(new URL(page.url()).hash, '#menu');
      const route = page.locator('.access-actions .walking-route');
      const url = new URL(await route.getAttribute('href'));
      assert.equal(url.origin, 'https://www.google.com');
      assert.equal(url.pathname, '/maps/dir/');
      assert.equal(url.searchParams.get('travelmode'), 'walking');
      assert.equal(url.searchParams.get('api'), '1');
      assert(url.searchParams.get('destination').includes('味一番つばさ'));
      assert.equal(url.searchParams.has('origin'), false);
      assert.equal(await page.locator('.access-actions .tel').getAttribute('href'), 'tel:0115215963');
      for (const image of await page.locator('.menu-sheet-card img, .qr-restore img').all()) {
        assert(Number(await image.getAttribute('width')) > 0);
        assert(Number(await image.getAttribute('height')) > 0);
      }
    }
    await page.locator('.site-header nav a[href="#access"]').click();
    await page.waitForFunction(() => {
      const section = document.querySelector('#access');
      const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      return Math.abs(section.getBoundingClientRect().top - margin) < 3 ||
        Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) < 3;
    });
    await page.locator('.qr-restore img').evaluate(image => image.decode());
    await page.screenshot({path: `${output}/${engine}-${width}-access.png`, scale:'css'});
    const access = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      links: [...document.querySelectorAll('.access-actions a')].map(el => ({text:el.textContent, rect:el.getBoundingClientRect().toJSON()})),
    }));
    assert.equal(access.overflow, false);
    if (!baseline) for (const link of access.links) {
      assert(link.rect.height >= 44, link.text);
      assert(link.rect.x >= 0 && link.rect.right <= width, link.text);
    }
    report.cases.push({width, height, before, access});
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.errors.push(error.stack);
  process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(`${output}/${engine}-report.json`, JSON.stringify(report,null,2));
  console.log(JSON.stringify({base, engine, baseline, passed:report.passed, cases:report.cases.length, errors:report.errors},null,2));
}
