import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(process.env.STEAM_QA_PLAYWRIGHT||import.meta.url);
const {chromium,webkit}=require('playwright');
const base=process.env.STEAM_QA_URL||'http://127.0.0.1:4174/';
const output=process.env.CROSSING_QA_OUTPUT||'output/steam-qa/crossing';
const cases=(process.env.CROSSING_QA_CASES||'chromium-desktop,chromium-430,webkit-430').split(',');
await fs.mkdir(output,{recursive:true});
const report={base,cases:[],note:'Browser emulation, not a physical iPhone. The stipple canvas is an entrance mask, not a replacement steam renderer.'};
for(const name of cases){
 const mobile=!name.endsWith('desktop'), width=mobile?(Number(name.split('-')[1])||390):1440,height=mobile?(width===320?568:932):900;
 const browser=await (name.startsWith('webkit')?webkit:chromium).launch({headless:true,
  ...(!name.startsWith('webkit')&&process.env.STEAM_QA_CHROME==='1'?{channel:'chrome'}:{})});
 const result={name,width,height,errors:[],passed:false};
 try{
  const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
  const page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(e.message));
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>window.__tsubasaCrossing?.phase==='ink',{},{polling:50});
  const initial=await page.evaluate(()=>{
   const c=document.querySelector('.crossing-dots'),d=c.getContext('2d').getImageData(0,0,1,1).data;
   return {state:{...__tsubasaCrossing},paper:[...d],order:[...document.querySelector('main').children].filter(e=>e.matches('section')).slice(0,3).map(e=>e.id),
    src:document.querySelector('#top .hero-bg').currentSrc,videoLoaded:!!document.querySelector('#videoTop video').dataset.loaded};
  });
  assert.deepEqual(initial.order,['top','videoTop','signature']);
  assert.deepEqual(initial.paper,[250,249,246,255]);
  assert(initial.src.endsWith('/assets/susukino-top.webp'));
  assert.equal(initial.videoLoaded,false,'Do not fetch the below-fold video during the entrance');
  await page.screenshot({path:`${output}/${name}-white.png`});
  await page.clock.runFor(1000);
  const ink=await page.evaluate(()=>({...__tsubasaCrossing}));
  assert(ink.dots>1000 && ink.dots<ink.total*.8,JSON.stringify(ink));
  assert(ink.total<=60600);
  await page.screenshot({path:`${output}/${name}-dots.png`});
  await page.clock.runFor(1100);
  await page.screenshot({path:`${output}/${name}-dissolve.png`});
  await page.clock.runFor(850);
  assert.equal(await page.locator('.crossing-dots').count(),0);
  assert.equal(await page.evaluate(()=>__tsubasaCrossing.reason),'revealed');
  const done=await page.evaluate(()=>({...__tsubasaCrossing}));
  await page.clock.runFor(500);
  assert.equal(await page.evaluate(()=>__tsubasaCrossing.frames),done.frames,'Entrance must stop rendering');
  assert.equal(await page.evaluate(()=>__tsubasaCrossing.raf),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`${output}/${name}-photo.png`});
  await page.clock.resume();
  await page.locator('.crossing-next').click();
  await page.waitForFunction(()=>!document.querySelector('#videoTop video').paused);
  assert.equal(await page.locator('#videoTop video').evaluate(v=>v.muted),true);
  await page.locator('#signature').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('#videoTop video').paused);
  result.entrance={initial,ink,done,videoStartsWhenVisible:true,videoPausesOffscreen:true};
  await page.goto(new URL('#signature',base).href,{waitUntil:'load'});
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>window.__tsubasaCrossing?.phase==='complete');
  assert.equal(await page.locator('.crossing-dots').count(),0,'Deep links are not covered');
  // A fresh load with reduced motion is an immediate real photograph.
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>window.__tsubasaCrossing?.phase==='complete');
  assert.equal(await page.locator('.crossing-dots').count(),0);
  assert.equal(await page.locator('#top .hero-bg').evaluate(e=>getComputedStyle(e).objectPosition),'50% 72%');
  result.reducedMotion=true;
  await context.close();
  // Progressive enhancement: no JavaScript still shows the same street photo.
  const plain=await browser.newContext({viewport:{width,height},javaScriptEnabled:false});
  const fallback=await plain.newPage(); await fallback.goto(base,{waitUntil:'load'});
  assert.equal(await fallback.locator('#top .hero-bg').isVisible(),true);
  assert.equal(await fallback.locator('.crossing-dots').count(),0);
  assert.equal(await fallback.locator('html').getAttribute('class'),null);
  result.noJs=true; await plain.close();
  if(name==='chromium-desktop'){
   const resilience=await browser.newContext({viewport:{width,height}});
   const blocked=await resilience.newPage();
   await blocked.route('**/crossing-intro.js*',route=>route.abort());
   await blocked.goto(base,{waitUntil:'load'});
   await blocked.waitForFunction(()=>!document.documentElement.classList.contains('crossing-pending'));
   assert.equal(await blocked.locator('#top').evaluate(e=>getComputedStyle(e,'::after').content),'none');
   await blocked.waitForFunction(()=>window.__tsubasaFluid?.fluidTextStage);
   result.blockedIntroFallsBack=true; await blocked.close();
   const early=await resilience.newPage();
   await early.clock.install(); await early.clock.pauseAt(new Date());
   await early.goto(base,{waitUntil:'load'});
   await early.keyboard.press('Escape');
   assert.equal(await early.evaluate(()=>__tsubasaCrossing.reason),'escape');
   assert.equal(await early.locator('.crossing-dots').count(),0);
   await early.clock.resume(); await early.close();
   const imageError=await resilience.newPage();
   await imageError.route('**/assets/susukino-top.webp',route=>route.abort());
   await imageError.goto(base,{waitUntil:'load'});
   await imageError.waitForFunction(()=>window.__tsubasaCrossing?.phase==='complete');
   assert.equal(await imageError.locator('.crossing-dots').count(),0);
   assert.equal(await imageError.locator('html').evaluate(e=>e.classList.contains('crossing-pending')),false);
   result.imageErrorNotWhiteScreen=true; await resilience.close();
  }
  assert.deepEqual(result.errors,[]); result.passed=true;
 }catch(error){result.errors.push(error.stack);process.exitCode=1;}
 finally{await browser.close();report.cases.push(result);console.log(`${name}: ${result.passed?'PASS':'FAIL'} ${result.errors.join('\n')}`);}
}
report.passed=report.cases.every(c=>c.passed);
await fs.writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
