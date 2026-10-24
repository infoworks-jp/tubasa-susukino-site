import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(process.env.STORY_QA_PLAYWRIGHT || path.resolve('package.json'));
const engines = require(process.env.STORY_QA_PACKAGE || 'playwright');
const engine = process.env.STORY_QA_ENGINE || 'chromium';
const browser = await engines[engine].launch({headless:true, timeout:20000,...(process.env.STORY_QA_CHROME==='1'?{channel:'chrome'}:{})});
const base = process.env.STEAM_QA_URL || 'http://127.0.0.1:4174/';
const output = process.env.STORY_QA_OUTPUT || 'output/stories-qa';
const data = JSON.parse(await fs.readFile('content/stories.json','utf8'));
await fs.mkdir(output,{recursive:true});
try {
  for (const width of [320,390,1440]) {
    const page = await browser.newPage({viewport:{width,height:900},javaScriptEnabled:false});
    page.setDefaultTimeout(15000);
    for (const route of ['/stories/',...data.episodes.map(item=>'/stories/'+item.slug+'/')]) {
      const response = await page.goto(new URL(route,base).href,{waitUntil:"domcontentloaded",timeout:20000});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('h1').count(),1);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if (route==='/stories/') {
        assert.equal(await page.locator('h1').textContent(),data.seriesTitle);
        assert((await page.locator('main').textContent()).includes(data.introduction));
        for (const item of data.episodes) assert.equal(await page.locator(`a[href="/stories/${item.slug}/"]`).count(),1);
      } else {
        const item = data.episodes.find(entry=>route===`/stories/${entry.slug}/`);
        assert.equal(await page.locator('h1').textContent(),item.title);
        assert.deepEqual(await page.locator('.story-copy > p').allTextContents(),item.paragraphs);
        assert((await page.locator('article').textContent()).endsWith(data.disclaimer));
      }
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'本文へ');
      await page.screenshot({path:path.join(output,`${engine}-${width}-${route.replaceAll('/','_')}.png`),fullPage:true});
      await page.evaluate(()=>{document.body.style.fontSize='34px';});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.close();
  }
  console.log(`STORY BROWSER PASS: ${engine}; 320, 390, 1440; exact approved body, keyboard skip link, no-JS navigation, no overflow and enlarged text.`);
} finally {await browser.close();}
