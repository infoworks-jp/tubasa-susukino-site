import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
export function reveal(code,width,height){
 let frame;const arcs=[],root={classList:{contains:()=>true,add(){},remove(){}}};
 const ctx={fillRect(){},beginPath(){},moveTo(){},arc(...values){arcs.push(...values)},fill(){}};
 const canvas={style:{},setAttribute(){},getContext:()=>ctx,remove(){}};
 const photo={complete:true,naturalWidth:1137};
 const hero={clientWidth:width,clientHeight:height,querySelector:()=>photo,append(){},addEventListener(){},removeEventListener(){}};
 const motion={matches:false,addEventListener(){},removeEventListener(){}};
 const noop=()=>{};
 const doc={documentElement:root,hidden:false,querySelector:()=>hero,createElement:()=>canvas,addEventListener:noop,removeEventListener:noop,dispatchEvent:noop};
 const scope={document:doc,matchMedia:()=>motion,scrollY:0,location:{hash:''},performance:{now:()=>0},setTimeout:()=>1,clearTimeout:noop,addEventListener:noop,removeEventListener:noop,Event:class{},requestAnimationFrame:f=>{frame=f;return 1},cancelAnimationFrame:noop};scope.window=scope;
 vm.runInNewContext(code,scope);
 const samples=[];
 for(const time of [1000,2100,2850]){
  frame(time);const state=scope.__tsubasaCrossing;
  samples.push({time,total:state.total,dots:state.dots,phase:state.phase,hash:createHash('sha256').update(Buffer.from(new Float64Array(arcs).buffer)).digest('hex')});
 }
 return samples;
}
if(!process.env.CROSSING_RECORD){
 const code=fs.readFileSync(new URL('../crossing-intro.js',import.meta.url),'utf8');
 const golden=JSON.parse(fs.readFileSync(new URL('./fixtures/crossing-geometry.json',import.meta.url),'utf8'));
 for(const {width,height,samples} of golden)test(`exact original reveal coordinates and timing at ${width}x${height}`,()=>assert.deepEqual(reveal(code,width,height),samples));
}
