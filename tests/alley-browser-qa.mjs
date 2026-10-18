import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.LOCATION_QA_BASE || 'http://127.0.0.1:8080';
const output=process.env.ALLEY_QA_OUTPUT || 'location-qa/alley';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.LOCATION_QA_EXECUTABLE||undefined,args:process.env.LOCATION_QA_HARDWARE==='1'?['--use-angle=metal']:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const reports=[];
try {for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:900},locale:'ja-JP'});page.setDefaultTimeout(90000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/location/');await page.waitForFunction(()=>document.documentElement.dataset.cityReady==='true',{}, {timeout:180000});
  assert.equal(await page.locator('[data-view="entrance"]').count(),1,'unique outdoor preset remains compatible with existing navigation');
  const route=page.locator('[data-view="route"]');await route.click();
  const streetBefore=await page.locator('#city').screenshot({path:`${output}/${width}-street-before.png`});
  const dimensions=()=>page.evaluate(()=>({buffer:[document.querySelector('#city').width,document.querySelector('#city').height],rect:document.querySelector('#city').getBoundingClientRect().toJSON(),camera:JSON.parse(document.documentElement.dataset.cameraState)}));
  const beforeDimensions=await dimensions();
  const source=JSON.parse(await page.locator('html').getAttribute('data-alley-source'));assert.match(source.limitations,/approximate/);
  const stops=['alley','alley-stairs','alley-turn','alley-passage','alley-door'];
  for(const [index,view] of stops.entries()) {
    await page.locator(`[data-view="${view}"]`).click();
    const state=JSON.parse(await page.locator('html').getAttribute('data-alley-state'));
    assert.equal(state.view,view);assert.equal(state.streetVisible,false);assert.equal(state.interiorVisible,true);assert.ok(state.geometry>100);
    assert.equal(state.westWallVisible,index!==0);assert.ok(state.localCamera[1]>=-1.18,'indoor camera stays above floor');
    assert.equal(await page.locator('#alley-prev').isEnabled(),index>0);assert.equal(await page.locator('#alley-next').isEnabled(),index<4);
    if(view==='alley-door') {assert.ok(Math.abs(state.doorway[0])<.2 && Math.abs(state.doorway[1])<.65,'Tsubasa doorway is in frame');assert.ok(state.menuScreen[0]<state.doorway[0],'menu board is left of Tsubasa as photographed');}
    if(view==='alley-passage')assert.ok(state.shopRowScreen[0]>state.doorway[0],'storefront row is on visitor right, as photographed');
    for(const mode of ['color','line','tone','night']) {
      await page.locator(`[data-mode="${mode}"]`).click();
      const raw=await page.locator('.stage').screenshot({path:`${output}/${width}-${view}-${mode}.png`}),png=PNG.sync.read(raw);
      const levels=new Set();for(let y=90;y<png.height-100;y+=4)for(let x=10;x<png.width-60;x+=4){const i=(y*png.width+x)*4;levels.add(Math.floor(png.data[i]/16));}
      assert.ok(levels.size>=4,'interior geometry is rendered, not an empty canvas');
    }
    reports.push({width,view,state});
  }
  await page.locator('#alley-prev').click();assert.equal(await page.locator('html').getAttribute('data-alley-view'),'alley-passage');
  await page.locator('#alley-next').click();assert.equal(await page.locator('html').getAttribute('data-alley-view'),'alley-door');
  // Keyboard zoom and drag must actually change this interior camera.
  const before=await page.locator('html').getAttribute('data-camera-state');await page.locator('#city').press('ArrowLeft');await page.locator('#city').press('+');assert.notEqual(await page.locator('html').getAttribute('data-camera-state'),before);
  await page.locator('[data-view="alley"]').click();
  if(width===390){const cdp=await page.context().newCDPSession(page);const r=await page.locator('#city').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+r.width*.4,y:r.y+r.height*.4}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+r.width*.6,y:r.y+r.height*.43}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
  await page.locator('.alley-route').screenshot({path:`${output}/${width}-navigation.png`});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
  if(width===1440) {
    await page.locator('[data-view="alley-door"]').click();
    const pngDownload=page.waitForEvent('download');await page.locator('#png').click();const pngFile=await pngDownload;await pngFile.saveAs(`${output}/interior.png`);assert.equal(PNG.sync.read(await fs.readFile(`${output}/interior.png`)).width,2400);
    await page.locator('[data-view="alley"]').click();
    const glbDownload=page.waitForEvent('download');await page.locator('#glb').click();const glbFile=await glbDownload;await glbFile.saveAs(`${output}/interior.glb`);
    const glb=await fs.readFile(`${output}/interior.glb`);assert.equal(glb.toString('ascii',0,4),'glTF');const json=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));assert.ok(json.nodes.some(n=>n.name==='Tsubasa navy noren'));assert.ok(json.nodes.some(n=>n.name==='Entrance to Tsubasa route'));assert.ok(json.nodes.some(n=>n.extras?.limitations?.includes('Photograph-based')),'export includes approximate dimensions and provenance');assert.ok(!json.nodes.some(n=>n.name==='Susukino — Tsubasa'),'interior export contains the interior, not a hidden city');
  }
  await page.locator('#alley-exit').click();assert.equal(await page.locator('html').getAttribute('data-alley-view'),'outside');assert.equal(await page.locator('.alley-stepper').isVisible(),false);
  await page.locator('[data-mode="tone"]').click();await route.click();
  const after=PNG.sync.read(await page.locator('#city').screenshot({path:`${output}/${width}-street-after.png`})),beforePng=PNG.sync.read(streetBefore);let changed=0;
  for(let i=0;i<after.data.length;i+=4)if(Math.max(...[0,1,2].map(j=>Math.abs(after.data[i+j]-beforePng.data[i+j])))>6)changed++;
  console.log('Outdoor changed pixels',width,changed,after.width*after.height);
  await fs.writeFile(`${output}/${width}-outdoor-comparison.json`,JSON.stringify({before:beforeDimensions,after:await dimensions(),changed},null,2));
  assert.ok(changed/(after.width*after.height)<.01,'returning from interior preserves the outdoor scene');
  assert.deepEqual(errors,[]);await page.close();
}}finally {await browser.close();await fs.writeFile(`${output}/report.json`,JSON.stringify(reports,null,2));}
console.log('ALLEY PASS: desktop/mobile, 5 viewpoints × 4 modes, photo-correct sides, next/back, keyboard/touch, PNG/GLB, and outdoor restoration.');
