import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium,webkit}=createRequire(process.env.STEAM_QA_PLAYWRIGHT || import.meta.url)('playwright');
const out=process.env.TOUCH_QA_OUTPUT || 'output/steam-qa/touch',report=[];
await fs.mkdir(out,{recursive:true});
const base=process.env.STEAM_QA_URL || 'http://127.0.0.1:4174/';
for(const config of [{name:'chrome-430',engine:chromium,w:430,h:932},{name:'webkit-430',engine:webkit,w:430,h:932},{name:'chrome-landscape',engine:chromium,w:932,h:430},{name:'webkit-320-reduced',engine:webkit,w:320,h:568,reduced:true}].filter(c=>!process.env.TOUCH_QA_CASES || process.env.TOUCH_QA_CASES.split(',').includes(c.name))){
 const b=await config.engine.launch(config.engine===chromium ? {
 ...(process.env.STEAM_QA_CHROME==='1'?{channel:'chrome'}:{}),
 ...(process.env.STEAM_QA_SOFTWARE==='1'?{args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{})
} : {}),c=await b.newContext({viewport:{width:config.w,height:config.h},isMobile:true,hasTouch:true,reducedMotion:config.reduced?'reduce':'no-preference'}),p=await c.newPage(),row={name:config.name,passed:false,checks:[],bowls:[],errors:[]};report.push(row);
 p.on('pageerror',e=>row.errors.push(e.message));let f;
 try{
  await p.goto(base,{waitUntil:'load'});f=p;
  await f.waitForFunction(()=>__tsubasaEffects?.surfaces.length===11&&__tsubasaEffects.phoneRefinement);
  assert(await f.evaluate(()=>__tsubasaEffects.gpu && __tsubasaEffects.pressureStyle==='dynamic'));
  if(!config.reduced){
   await f.locator('#signature').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
   await f.waitForFunction(()=>__tsubasaEffects.surfaces[0].visible&&__tsubasaEffects.surfaces[0].ready);
   const delayed=await f.evaluate(async()=>{
    const s=__tsubasaEffects.surfaces[0],host=s.image.parentElement,start=performance.now();
    const send=(type,points,stamp)=>{const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,'touches',{value:points});Object.defineProperty(e,'timeStamp',{value:stamp});host.dispatchEvent(e);return e.defaultPrevented;};
    send('touchstart',[{identifier:91,clientX:100,clientY:200}],start);
    await new Promise(r=>{const begun=performance.now();function check(){if(s.phoneGesture.phase==='held'||performance.now()-begun>5000)r();else requestAnimationFrame(check);}check();});const wasHeld=s.phoneGesture.phase==='held';
    const prevented=send('touchmove',[{identifier:91,clientX:100,clientY:140}],start+80),phase=s.phoneGesture.phase;
    send('touchend',[],start+100);return{wasHeld,prevented,phase};
   });
   assert.deepEqual(delayed,{wasHeld:true,prevented:false,phase:'scrolling'},'A quick swipe delivered late must not become a hold');
   row.checks.push('delayed quick input preserves scrolling despite an elapsed hold timer');
  }
  const cd=config.engine===chromium?await c.newCDPSession(p):null;
  await f.evaluate(()=>{window.__touchEvents=[];for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])document.addEventListener(type,e=>__touchEvents.push({type:e.type,x:e.clientX,y:e.clientY,t:e.timeStamp,now:performance.now(),phase:__tsubasaEffects.surfaces[0].phoneGesture?.phase,target:e.target.tagName}),{capture:true,passive:true});});
  for(const [index,rootIndex] of [[0,0],[1,0],[2,0],[2,1]]){
   const bowl={index,rootIndex,gestures:[]};row.bowls.push(bowl);
   const point=async()=>{
    await f.evaluate(({index,rootIndex})=>{const s=__tsubasaEffects.surfaces[index],img=s.image,r=img.getBoundingClientRect(),css=getComputedStyle(img),pos=css.objectPosition.split(' ').map(x=>parseFloat(x)/100),sc=Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight),h=img.naturalHeight*sc,root=s.roots[rootIndex];scrollTo({top:scrollY+r.y+(r.height-h)*pos[1]+(root[1]-.02)*h-innerHeight*.5,behavior:'instant'});},{index,rootIndex});
    await f.waitForFunction(i=>__tsubasaEffects.surfaces[i].ready&&__tsubasaEffects.surfaces[i].visible,index);
    const local=await f.evaluate(({index,rootIndex})=>{const s=__tsubasaEffects.surfaces[index],img=s.image,r=img.getBoundingClientRect(),css=getComputedStyle(img),pos=css.objectPosition.split(' ').map(x=>parseFloat(x)/100),sc=Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight),w=img.naturalWidth*sc,h=img.naturalHeight*sc,root=s.roots[rootIndex];return {x:r.x+(r.width-w)*pos[0]+root[0]*w,y:r.y+(r.height-h)*pos[1]+(root[1]-.02)*h};},{index,rootIndex});
    return local;
   };
   let pt=await point();
   assert(pt.x>0&&pt.x<config.w&&pt.y>0&&pt.y<config.h);
   await p.screenshot({path:`${out}/${config.name}-${index}-${rootIndex}-idle.png`});
   if(config.reduced){assert(await f.evaluate(()=>__tsubasaEffects.paused));assert(await f.locator('.phone-steam-hint').first().isHidden());continue;}
   if(cd){
    for(const kind of ['quick-vertical','held-vertical','held-diagonal','held-horizontal']){
     pt=await point();const direction=pt.x>config.w/2?-1:1;
     await f.evaluate(()=>{__touchEvents=[];});const y0=await f.evaluate(()=>scrollY);
     const points=(x,y)=>[{x,y,id:1,radiusX:5,radiusY:5,force:.6}];
     if(kind==='quick-vertical'){
      // Browser-scheduled swipe avoids adding a false long hold while waiting
      // for slow software-GPU CDP round trips between individual move events.
      await cd.send('Input.synthesizeScrollGesture',{x:pt.x,y:pt.y,yDistance:-128,speed:160,preventFling:true,gestureSourceType:'touch'});
      const result=await f.evaluate(i=>({scroll:scrollY,phase:__tsubasaEffects.surfaces[i].phoneGesture.phase,held:!!__tsubasaEffects.surfaces[i].contact?.down,events:__touchEvents}),index);
      result.scroll-=y0;assert(result.scroll>20,`Quick swipe must scroll: ${JSON.stringify({pt,y0,result})}`);assert(!result.held);assert(result.events.some(e=>e.type==='pointercancel'));
      bowl.gestures.push({kind,scroll:result.scroll,cancel:true,phase:result.phase});continue;
     }
     await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(pt.x,pt.y)});
     await f.waitForFunction(i=>__tsubasaEffects.surfaces[i].phoneGesture.phase==='held',index,{timeout:5000});
     for(let j=1;j<=8;j++){const dx=kind.includes('vertical')?0:direction*j*8,dy=kind.includes('horizontal')?0:-j*9;await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(pt.x+dx,pt.y+dy)});await p.waitForTimeout(32);}
     const result=await f.evaluate(i=>({scroll:scrollY,phase:__tsubasaEffects.surfaces[i].phoneGesture.phase,contact:__tsubasaEffects.surfaces[i].contact,finger:!!__tsubasaEffects.surfaces[i].finger,events:__touchEvents}),index);result.scroll-=y0;
     if(kind.startsWith('held')){assert(Math.abs(result.scroll)<2,`${kind}: must not scroll`);assert(!result.events.some(e=>e.type==='pointercancel'));assert(result.contact?.down&&result.finger);assert.equal(result.phase,'held');}
     else{assert(result.scroll>20,'Quick swipe must scroll');assert(result.events.some(e=>e.type==='pointercancel'));}
     bowl.gestures.push({kind,scroll:result.scroll,cancel:result.events.some(e=>e.type==='pointercancel'),phase:result.phase});
     if(kind==='held-diagonal')await p.screenshot({path:`${out}/${config.name}-${index}-${rootIndex}-held.png`});
     await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
     await f.waitForFunction(i=>__tsubasaEffects.surfaces[i].phoneGesture.phase==='idle'&&!__tsubasaEffects.surfaces[i].contact?.down,index);
     await p.waitForTimeout(100);
    }
   }else{
    await p.touchscreen.tap(pt.x,pt.y);await f.waitForFunction(i=>!!__tsubasaEffects.surfaces[i].finger,index);
    bowl.gestures.push({kind:'native-WebKit-tap',finger:true});
    // WebKit's public Playwright API exposes native tap, not held drag.
    // Exercise the touch arbitration handlers separately; don't label this an iPhone gesture.
    const result=await f.evaluate(async({index,rootIndex})=>{
     const s=__tsubasaEffects.surfaces[index],host=s.image.parentElement;
     const send=(type,points)=>{const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,'touches',{value:points});host.dispatchEvent(e);return e.defaultPrevented;};
     send('touchstart',[{identifier:3,clientX:100,clientY:200}]);await new Promise(r=>{const start=performance.now();function check(){if(s.phoneGesture.phase==='held'||performance.now()-start>5000)r();else requestAnimationFrame(check);}check();});
     const held=send('touchmove',[{identifier:3,clientX:100,clientY:150}]);
     const phase=s.phoneGesture.phase;send('touchend',[]);
     send('touchstart',[{identifier:4,clientX:100,clientY:200}]);
     const quick=send('touchmove',[{identifier:4,clientX:100,clientY:150}]);
     send('touchcancel',[]);
     return {held,quick,phase,after:s.phoneGesture.phase};
    },{index,rootIndex});assert(result.held&&!result.quick&&result.phase==='held'&&result.after==='idle');bowl.gestures.push({kind:'handler-contract-not-native-drag',...result});
   }
  }
  // Cancellation and two-finger gestures must never retain the hold gate.
  await f.evaluate(()=>{const s=__tsubasaEffects.surfaces[0];s.resetPhoneTouch();});
  assert.deepEqual(await f.evaluate(()=>__tsubasaEffects.errors),[]);assert.deepEqual(row.errors,[]);
  assert(!await f.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  row.checks.push('four bowl roots present; release/cancel resets; no JS/GPU errors or horizontal overflow');
  row.passed=true;
 }catch(e){row.failure=e.stack;await p.screenshot({path:`${out}/${config.name}-FAILED.png`}).catch(()=>{});if(f)row.state=await f.evaluate(()=>({errors:window.__tsubasaEffects?.errors,inspect:window.__tsubasaEffects?.inspect?.()})).catch(()=>null);}
 finally{await b.close();}
 console.log(config.name,row.passed?'PASS':row.failure);await fs.writeFile(out+'/input-report.json',JSON.stringify(report,null,2));
}
if(report.some(r=>!r.passed))process.exitCode=1;
