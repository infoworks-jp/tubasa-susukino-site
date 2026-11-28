import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createRequire} from 'node:module';
const {chromium}=createRequire(process.env.STEAM_QA_PLAYWRIGHT||import.meta.url)('playwright');
const base=process.env.STEAM_QA_URL||'http://127.0.0.1:4182/';const out=process.env.HOME_QA_OUTPUT||'output/home-simple';await fs.mkdir(out,{recursive:true});const rows=[];
for(const mobile of [true,false]){const b=await chromium.launch({...(process.env.STEAM_QA_CHROME==='1'?{channel:'chrome'}:{}),...(process.env.STEAM_QA_SOFTWARE==='1'?{args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{})});const p=await b.newPage({viewport:{width:mobile?430:1440,height:932},isMobile:mobile,hasTouch:mobile});const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));const row={mobile};rows.push(row);
try{await p.goto(base);await p.waitForFunction(()=>window.__tsubasaCrossing?.phase==='complete');
assert.equal(await p.locator('#videoTop,video,#nightWalkMap,#miso-anatomy').count(),0);
await p.locator('.crossing-next').click();await p.waitForFunction(()=>location.hash==='#signature');await p.waitForFunction(()=>window.__tsubasaEffects?.surfaces[0].draws>3);await p.screenshot({path:`${out}/${mobile?'phone':'desktop'}-smoke.png`});
await p.locator('#experiences').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await p.waitForTimeout(700);
assert.equal(await p.locator('.experience-link').count(),2);assert.equal(await p.locator('.experience-link').first().getAttribute('href'),'/anatomy/');assert.equal(await p.locator('.experience-link').last().getAttribute('href'),'/location/');
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);row.height=await p.evaluate(()=>document.documentElement.scrollHeight);row.experienceSize=await p.locator('#experiences').evaluate(e=>({width:e.clientWidth,height:e.clientHeight}));
await p.screenshot({path:`${out}/${mobile?'phone':'desktop'}-links.png`});
row.unwantedRequests=requests.filter(u=>/night-walk\.(js|mjs)|maplibre|miso-anatomy|miso-anatomy-layers|\/video\/|tsubasa-top-poster|location\/city/.test(u));assert.deepEqual(row.unwantedRequests,[]);
await p.getByRole('link',{name:/重なりが、究極になる/}).click();await p.waitForURL('**/anatomy/');assert.equal(await p.locator('#miso-anatomy').count(),1);
await p.getByRole('button',{name:'一杯をほどく'}).click();await p.waitForFunction(()=>document.querySelector('#anatomy-screen').dataset.scene!=='0');await p.locator('.food-piece img').first().evaluate(img=>img.decode());await p.waitForTimeout(1700);row.anatomyOpened=true;
await p.screenshot({path:`${out}/${mobile?'phone':'desktop'}-anatomy.png`});await p.getByRole('link',{name:'← 公式サイトに戻る'}).click();await p.waitForURL('**/#experiences');
await p.getByRole('link',{name:/すすきの3D/}).click();await p.waitForURL('**/location/');assert.equal(await p.locator('canvas').count()>0,true);row.locationOpened=true;
assert.deepEqual(errors,[]);row.passed=true;}catch(e){row.error=e.stack;process.exitCode=1;}finally{await b.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(rows,null,2));console.log(JSON.stringify(row));}}
