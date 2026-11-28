import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium}=createRequire(process.env.STEAM_QA_PLAYWRIGHT||import.meta.url)('playwright');
const base=process.env.EFFECTS_QA_URL||'http://127.0.0.1:4181/';
const baseline=process.env.EFFECTS_QA_BASELINE==='1';
const output=process.env.EFFECTS_QA_OUTPUT||'output/effects-runtime';
await fs.mkdir(output,{recursive:true});
const results=[];
for(const mobile of (process.env.EFFECTS_QA_MOBILE_ONLY==='1'?[true]:[true,false])){
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:mobile?430:1440,height:932},isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__qaCallbacks=0;window.__qaFluidCallbacks=0;const raf=requestAnimationFrame;window.requestAnimationFrame=fn=>{const stack=new Error().stack,fluid=stack.includes('/vendor/');return raf(t=>{window.__qaCallbacks++;if(fluid){window.__qaFluidCallbacks++;if(window.__qaTrack)(window.__qaStacks||=[]).push(stack)}fn(t)})};});
 const row={mobile,baseline};results.push(row);
 try{
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>window.__tsubasaCrossing?.phase==='complete'&&window.__tsubasaFluid?.fluidTextStage,{},{timeout:60000});
  await page.waitForTimeout(1000);
  row.initial=await page.evaluate(()=>({fluid:structuredClone(window.__tsubasaFluid),resources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/vendor/')).map(r=>({url:r.name,bytes:r.decodedBodySize})),steam:window.__tsubasaEffects?.inspect()}));
  row.fluidBytes=row.initial.resources.reduce((sum,r)=>sum+r.bytes,0);
  if(!baseline)assert.equal(row.initial.fluid.shop,undefined,'Offscreen shop must not initialize');
  assert.equal(row.initial.steam.surfaces.length,11,'Keep every smoke surface');
  if(mobile){
   assert.equal(row.initial.fluid.fluidTextStage.renderer,'WebGL2');
   if(!baseline){assert(row.fluidBytes<1000000);assert(!row.initial.resources.some(r=>r.url.includes('three.webgpu')||r.url.includes('three.tsl')));}
   const presses=row.initial.fluid.fluidTextStage.pointerPresses;
   await page.locator('#fluidTextCanvas').dispatchEvent('pointerdown',{clientX:215,clientY:260,button:0});
   await page.waitForFunction(n=>__tsubasaFluid.fluidTextStage.pointerPresses>n,presses);
  }
  await page.screenshot({path:`${output}/${mobile?'phone':'desktop'}-hero.png`});
  await page.locator('#access').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForTimeout(1200);
  row.offscreen=await page.evaluate(()=>({y:scrollY,top:document.getElementById('fluidTextStage').getBoundingClientRect().toJSON(),shop:document.querySelector('.shop-photo').getBoundingClientRect().toJSON(),states:structuredClone(__tsubasaFluid)}));
  const count=await page.evaluate(()=>{window.__qaTrack=true;return __qaFluidCallbacks});
  await page.waitForTimeout(600);
  row.offscreenCallbacks=await page.evaluate(n=>__qaFluidCallbacks-n,count);
  row.stacks=await page.evaluate(()=>window.__qaStacks?.slice(0,3));
  if(!baseline)assert(row.offscreenCallbacks<=3,'Offscreen callbacks: '+row.offscreenCallbacks);
  await page.locator('.shop-photo').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForFunction(()=>window.__tsubasaFluid?.shop?.frame>=2||window.__tsubasaFluid?.shop?.renderer==='static-fallback',{},{timeout:60000});
  row.shop=await page.evaluate(()=>structuredClone(__tsubasaFluid.shop));
  if(mobile){assert.equal(row.shop.renderer,'WebGL2');assert(row.shop.frame>=2);}
  await page.screenshot({path:`${output}/${mobile?'phone':'desktop'}-shop.png`});
  await page.locator('#signature').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForFunction(()=>__tsubasaEffects.surfaces[0].ready&&__tsubasaEffects.surfaces[0].draws>3);
  const draws=await page.evaluate(()=>__tsubasaEffects.surfaces[0].draws);
  await page.waitForTimeout(400);
  assert(await page.evaluate(n=>__tsubasaEffects.surfaces[0].draws>n,draws),'Smoke must continue moving');
  await page.screenshot({path:`${output}/${mobile?'phone':'desktop'}-smoke.png`});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  if(mobile){const frame=await page.evaluate(()=>__tsubasaFluid.fluidTextStage.frame);await page.waitForFunction(n=>__tsubasaFluid.fluidTextStage.frame>n,frame);}
  assert.deepEqual(errors,[]);row.passed=true;
 }catch(e){row.error=e.stack;process.exitCode=1;}
 finally{await browser.close();console.log(JSON.stringify(row));await fs.writeFile(`${output}/report.json`,JSON.stringify(results,null,2));}
}
