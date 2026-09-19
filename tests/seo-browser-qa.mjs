// Browser evidence for the site's crawlable guides. No @playwright/test dependency.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { locales, editorial } from '../scripts/seo-content.mjs';
const require = createRequire(process.env.STEAM_QA_PLAYWRIGHT || path.resolve('package.json'));
const { chromium, webkit } = require('playwright');
const base = process.env.STEAM_QA_URL || 'http://127.0.0.1:4175/';
const output = process.env.SEO_QA_OUTPUT || 'output/playwright/seo-guides';
await fs.mkdir(output,{recursive:true});
const profiles={desktop:{type:chromium,viewport:{width:1440,height:900}},phone:{type:webkit,viewport:{width:430,height:932},isMobile:true,hasTouch:true},small:{type:chromium,viewport:{width:320,height:780},isMobile:true,hasTouch:true},nojs:{type:chromium,viewport:{width:390,height:844},javaScriptEnabled:false}};
const report=[];
for(const name of (process.env.SEO_QA_CASES||'desktop,phone,small,nojs').split(',')){
  const {type,...opts}=profiles[name];
  const browser=await type.launch({headless:true,...(type===chromium&&process.env.STEAM_QA_CHROME==='1'?{channel:'chrome'}:{})});
  const context=await browser.newContext({...opts,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const requests=[];page.on('request',r=>requests.push(r.url()));
  try {
    for(const p of [...Object.values(locales),...editorial]){
      const response=await page.goto(new URL(p.path,base).href,{waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      assert.equal(await page.title(),p.title);
      assert.equal(await page.locator('h1').count(),1);
      assert(await page.locator('.guide-hero h1').isVisible());
      if(name==='desktop')assert(await page.locator('h1').evaluate(h=>h.getBoundingClientRect().height<=parseFloat(getComputedStyle(h).lineHeight)*3+1),'Desktop headline must not fragment into four lines');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Horizontal overflow: '+name+' '+p.path);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://www.tubasa-susukino.com/'+p.path);
      const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.loading!=='lazy'&&(!i.complete||!i.naturalWidth)).map(i=>i.src));
      assert.deepEqual(broken,[]);
      const locale=Object.values(locales).find(l=>l.path===p.path);
      if(locale){
        assert.equal(await page.locator('.guide-menu-row').count(),40);
        await page.locator('.guide-hero .guide-button').click();
        assert(new URL(page.url()).hash==='#full-menu');
        await page.locator('.guide-faq summary').first().click();
        assert.equal(await page.locator('.guide-faq details').first().getAttribute('open'),'');
        await page.locator('.guide-menu').screenshot({path:path.join(output,`${name}-${p.path.replace('/','')}-menu.png`)});
      }
      await page.goto(new URL(p.path,base).href,{waitUntil:'networkidle'});
      await page.screenshot({path:path.join(output,`${name}-${p.path.replace('/','')}.png`)});
      const row={profile:name,path:p.path,title:await page.title(),rows:await page.locator('.guide-menu-row').count(),overflow:false};report.push(row);console.log(JSON.stringify(row));
    }
    // Follow a real localized link (without JS navigation); language and menu persist.
    await page.goto(new URL('menu/',base).href);
    await page.locator('.guide-languages a[hreflang=en]').click();
    assert.equal(new URL(page.url()).pathname,'/en/');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.equal(await page.locator('.guide-menu-row').count(),40);
    assert(requests.every(r=>!r.includes('video/')&&!r.includes('effects.js')&&!r.includes('maplibre')),'Heavy homepage runtime must not load on guides');
    assert.deepEqual(errors,[]);
    if(name==='desktop'||name==='phone'){
      // Homepage geometry stays identical to the captured pre-change baseline.
      await page.goto(base,{waitUntil:'networkidle'});
      const rects=await page.locator('#top,#videoTop,#signature,.signature-butter-corn,.signature-tsubasa,#favorites,#access').evaluateAll(es=>es.map(e=>({id:e.id||e.className,x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y+scrollY,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
      const baseline=process.env.SEO_QA_BASELINE;
      if(baseline)assert.deepEqual(rects,JSON.parse(await fs.readFile(path.join(baseline,`before-${name}.json`),'utf8')),'Approved scene geometry');
      await fs.writeFile(path.join(output,`home-${name}-rects.json`),JSON.stringify(rects,null,2));
      await page.screenshot({path:path.join(output,`home-${name}.png`)});
      await page.locator('.home-guides').screenshot({path:path.join(output,`directory-${name}.png`)});
      assert.equal(await page.locator('.home-guides a').count(),6);
    }
    if(opts.javaScriptEnabled!==false){
      // Same expiration script as the main site, tested across all six guides.
      await page.addInitScript(()=>{const NativeDate=Date;window.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:['2026-09-25T00:00:00+09:00']))}static now(){return new NativeDate('2026-09-25T00:00:00+09:00').getTime()}}});
      for(const p of [...Object.values(locales),...editorial]){
        await page.goto(new URL(p.path,base).href);
        assert.equal(await page.locator('#holiday-notice').count(),0,'Expired holiday notice: '+p.path);
      }
    }
  } finally {await browser.close()}
}
await fs.writeFile(path.join(output,'report.json'),JSON.stringify({base,report},null,2));
console.log('GUIDE BROWSER PASS: '+report.length+' rendered profiles; menu/FAQ/language links; no-JS; expiry; homepage geometry.');
