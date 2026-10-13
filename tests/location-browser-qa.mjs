import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
await fs.mkdir('location-qa',{recursive:true});
const base=process.env.LOCATION_QA_BASE||'http://127.0.0.1:8080';
const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'ja-JP'});
const reference='https://tools.oyasumi-gamedev.com/rokehan/#ll=35.659500%2C139.700500&s=300&far=2&n=%E6%B8%8B%E8%B0%B7%E3%82%B9%E3%82%AF%E3%83%A9%E3%83%B3%E3%83%96%E3%83%AB%E4%BA%A4%E5%B7%AE%E7%82%B9';
let referenceError;
try{
 await page.goto(reference,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('組み立てました'),{},{timeout:180000});
 await page.locator('#v3wrap').screenshot({path:'location-qa/reference-desktop.png'});await page.waitForTimeout(1000);await page.locator('#v3wrap').screenshot({path:'location-qa/reference-desktop-1s.png'});await page.waitForTimeout(2000);await page.locator('#v3wrap').screenshot({path:'location-qa/reference-desktop-3s.png'});
 await page.locator('#far').selectOption('0');await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('組み立てました'),{},{timeout:60000});
 await page.mouse.move(400,400);await page.mouse.down();await page.mouse.move(480,440,{steps:10});await page.mouse.up();await page.screenshot({path:'location-qa/reference-desktop-moved.png',timeout:90000});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'location-qa/reference-mobile.png',fullPage:true,timeout:90000});
 await fs.writeFile('location-qa/reference.json',JSON.stringify({reference,status:await page.locator('#status').textContent(),pass:true},null,2));
}catch(e){await page.screenshot({path:'location-qa/reference-failure.png',fullPage:true}).catch(()=>{});await fs.writeFile('location-qa/reference.json',JSON.stringify({reference,pass:false,error:String(e)},null,2));referenceError=e;}
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
 await page.setViewportSize(viewport);const errors=[];const listener=e=>errors.push(String(e));page.on('pageerror',listener);const consoleListener=msg=>{if(msg.type()==='error'&&/THREE|shader|WebGL|Tsubasa Location/.test(msg.text()))errors.push(msg.text());};page.on('console',consoleListener);
 await page.goto(base+'/location/',{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.dataset.cityReady==='true',{},{timeout:45000});
 const geometry=await page.evaluate(()=>({buildings:Number(document.documentElement.dataset.buildings),vertices:Number(document.documentElement.dataset.geometryVertices)}));assert.ok(geometry.buildings>10);assert.ok(geometry.vertices>1000);
 for(const mode of ['color','line','tone','night']){await page.locator(`[data-mode="${mode}"]`).click();await page.waitForTimeout(250);const shot=await page.locator('.stage').screenshot({path:`location-qa/${viewport.width}-${mode}.png`});const png=PNG.sync.read(shot);const colors=new Set();for(let y=70;y<png.height-120;y+=7)for(let x=20;x<png.width-20;x+=7){const i=(y*png.width+x)*4;colors.add(`${png.data[i]},${png.data[i+1]},${png.data[i+2]}`);}assert.ok(colors.size>20,mode+' must render real geometry');}
 await page.locator('[data-view="crossing"]').click();await page.locator('[data-view="shop"]').click();await page.locator('[data-view="overview"]').click();await page.locator('#city').focus();await page.keyboard.press('ArrowRight');
 for(const [id,extension] of [['png','.png'],['glb','.glb']]){const downloaded=page.waitForEvent('download');await page.locator('#'+id).click();const d=await downloaded;assert.ok(d.suggestedFilename().endsWith(extension));await d.saveAs(`location-qa/${viewport.width}${extension}`);}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow');assert.deepEqual(errors,[]);page.off('pageerror',listener);page.off('console',consoleListener);
 await fs.writeFile(`location-qa/${viewport.width}-receipt.json`,JSON.stringify({viewport,geometry,pass:true}));
}
await browser.close();if(referenceError)throw referenceError;console.log('LOCATION QA PASS: reference + desktop/mobile + 4 modes + PNG/GLB + camera/keyboard.');
