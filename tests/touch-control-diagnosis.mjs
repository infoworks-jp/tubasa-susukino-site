import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const source=await fs.readFile('tests/fixtures/steam-approved-dynamic-20260909.js','utf8');
const b=await chromium.launch({args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
for(const mode of ['plain','plain-listener','no-gate','approved']) {
 const c=await b.newContext({viewport:{width:430,height:932},isMobile:true,hasTouch:true});
 const p=await c.newPage(),cd=await c.newCDPSession(p);
 await p.addInitScript(()=>{
   window.probe={events:[],prevent:[]};
   const prev=Event.prototype.preventDefault;
   Event.prototype.preventDefault=function(){probe.prevent.push({type:this.type,t:this.timeStamp,now:performance.now(),cancelable:this.cancelable,stack:new Error().stack});return prev.call(this);};
   for(const type of ['touchstart','touchmove','touchend','touchcancel','pointerdown','pointermove','pointerup','pointercancel'])
    document.addEventListener(type,e=>probe.events.push({type,t:e.timeStamp,now:performance.now(),cancelable:e.cancelable,prevented:e.defaultPrevented,kind:e.pointerType,target:e.target.tagName,phase:window.__tsubasaEffects?.surfaces[0]?.phoneGesture?.phase}),{passive:true});
 });
 if(mode.startsWith('plain')) {
  await p.route('**/*',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;height:15000px;background:linear-gradient(red,blue)}#target{height:15000px;touch-action:pan-y pinch-zoom}</style><div id="target">SCROLL CONTROL</div>'}));
 } else await p.route('**/effects.js*',r=>r.fulfill({contentType:'text/javascript',body:mode==='no-gate'?source.replace('if (signature && phoneRefinement) {','if (false) {'):source}));
 await p.goto('http://127.0.0.1:4174/',{waitUntil:'load'});
 if(mode==='plain-listener')await p.evaluate(()=>document.querySelector('#target').addEventListener('touchmove',()=>{},{passive:false}));
 if(!mode.startsWith('plain'))await p.waitForFunction(()=>window.__tsubasaEffects?.surfaces[0]?.ready);
 const point=await p.evaluate(simple=>{
  if(simple){scrollTo(0,3000);return{x:215,y:466};}
  const s=__tsubasaEffects.surfaces[0],r=s.image.getBoundingClientRect();scrollTo({top:scrollY+r.y+r.height*.5-innerHeight*.5,behavior:'instant'});return{x:innerWidth*.5,y:innerHeight*.5};
 },mode.startsWith('plain'));
 await p.waitForTimeout(400);
 const before=await p.evaluate(({x,y})=>{let n=document.elementFromPoint(x,y),a=[];while(n){const s=getComputedStyle(n);a.push({tag:n.tagName,id:n.id,cls:n.className,touch:s.touchAction,overflow:s.overflow,oy:s.overflowY});n=n.parentElement;}probe.events=[];probe.prevent=[];return{y:scrollY,h:innerHeight,doc:document.scrollingElement.scrollHeight,ancestors:a};},point);
 await cd.send('Input.synthesizeScrollGesture',{...point,yDistance:-128,speed:800,preventFling:true,gestureSourceType:'touch'});
 await p.waitForTimeout(500);
 const result=await p.evaluate(()=>({y:scrollY,...probe}));
 report.push({mode,before,delta:result.y-before.y,...result});
 console.log(JSON.stringify(report.at(-1)));
 await c.close();
}
await b.close();await fs.mkdir('output/steam-qa',{recursive:true});await fs.writeFile('output/steam-qa/control-report.json',JSON.stringify(report,null,2));
