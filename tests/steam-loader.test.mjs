import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code=fs.readFileSync(new URL('../steam-loader.js',import.meta.url),'utf8');
function visit(pending){
 const scripts=[],listeners={},timers=[];
 const root={dataset:{},classList:{toggle(){},contains:()=>pending}};
 const doc={documentElement:root,body:{appendChild:s=>scripts.push(s)},createElement:()=>({}),addEventListener:(n,f)=>listeners[n]=f,removeEventListener:n=>delete listeners[n]};
 const ctx={document:doc,window:{},matchMedia:()=>({matches:false}),innerWidth:1440,innerHeight:900,setTimeout:f=>{timers.push(f);return timers.length},clearTimeout(){}};
 vm.runInNewContext(code,ctx);return {scripts,listeners,timers};
}
test('keep initial reveal free of smoke compilation and load once on reveal completion',()=>{
 const v=visit(true);assert.equal(v.scripts.length,0);v.listeners['tsubasa:crossing-ready']();assert.equal(v.scripts.length,1);v.timers[0]();assert.equal(v.scripts.length,1);assert.match(v.scripts[0].src,/^effects\.js/);
});
test('deep links start smoke immediately; a blocked intro has a deadline fallback',()=>{
 assert.equal(visit(false).scripts.length,1);const v=visit(true);v.timers[0]();assert.equal(v.scripts.length,1);
});
