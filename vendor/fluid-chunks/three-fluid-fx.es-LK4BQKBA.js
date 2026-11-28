import{$f as $,$j as T,Bb as H,Jj as he,Me as De,Re as D,Uj as F,_j as g,ak as te,ca as He,fc as Te,gj as se,m as ee,oi as le,tc as B}from"./chunk-FUT7L3O7.js";import{e as ue,o as Z,uc as Me}from"./chunk-FQRF2IZT.js";import{Ia as Be,Qa as ze,jd as ce,ra as be}from"./chunk-JPLSRTB5.js";var Ee={performance:{simResolution:128,dyeResolution:256,pressureIterations:6},balanced:{simResolution:256,dyeResolution:512,pressureIterations:12},quality:{simResolution:384,dyeResolution:1024,pressureIterations:20}},I=8,V=8,Le=16,Ge=Le*4,j="rgba16float",K=`
struct Params {
  a: vec4<f32>,
  b: vec4<f32>,
  c: vec4<f32>,
  d: vec4<f32>,
};

@group(0) @binding(0) var<uniform> params: Params;

fn simWidth() -> u32 {
  return u32(params.a.x);
}

fn simHeight() -> u32 {
  return u32(params.a.y);
}

fn texelSize() -> vec2<f32> {
  return params.a.zw;
}

fn inBounds(coord: vec2<u32>) -> bool {
  return coord.x < simWidth() && coord.y < simHeight();
}

fn loadClamped(tex: texture_2d<f32>, x: i32, y: i32) -> vec4<f32> {
  let w = i32(simWidth());
  let h = i32(simHeight());
  let cx = clamp(x, 0, w - 1);
  let cy = clamp(y, 0, h - 1);
  return textureLoad(tex, vec2<i32>(cx, cy), 0);
}

fn normalizedUvYUp(coord: vec2<u32>) -> vec2<f32> {
  let size = vec2<f32>(f32(simWidth()), f32(simHeight()));
  let topDown = (vec2<f32>(coord) + vec2<f32>(0.5)) / size;
  return vec2<f32>(topDown.x, 1.0 - topDown.y);
}

fn sampleYUp(tex: texture_2d<f32>, texSampler: sampler, uvYUp: vec2<f32>) -> vec4<f32> {
  return textureSampleLevel(tex, texSampler, vec2<f32>(uvYUp.x, 1.0 - uvYUp.y), 0.0);
}
`,Ye={fill:`
${K}
@group(0) @binding(1) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  textureStore(targetTex, coord, params.b);
}
`,decay:`
${K}
@group(0) @binding(1) var sourceTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let value = loadClamped(sourceTex, i32(coord.x), i32(coord.y)) * params.b.x;
  textureStore(targetTex, coord, value);
}
`,splat:`
${K}
@group(0) @binding(1) var sourceTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let vUv = normalizedUvYUp(coord);
  let center = params.c.xy;
  let halfSize = max(params.c.z, 0.000001);
  let aspect = params.c.w;
  let local = vec2<f32>(
    (vUv.x - center.x) * 2.0 * aspect / halfSize,
    (vUv.y - center.y) * 2.0 / halfSize
  );
  let amount = pow(clamp(1.0 - length(local), 0.0, 1.0), 2.0);
  let previous = loadClamped(sourceTex, i32(coord.x), i32(coord.y));
  let splatValue = vec4<f32>(params.b.xyz * amount, amount);

  textureStore(targetTex, coord, previous + splatValue);
}
`,curl:`
${K}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(velocityTex, x - 1, y).y;
  let R = loadClamped(velocityTex, x + 1, y).y;
  let T = loadClamped(velocityTex, x, y - 1).x;
  let B = loadClamped(velocityTex, x, y + 1).x;
  let vorticity = (R - L - T + B) * 0.5;

  textureStore(targetTex, coord, vec4<f32>(vorticity, 0.0, 0.0, 1.0));
}
`,vorticity:`
${K}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var curlTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(curlTex, x - 1, y).x;
  let R = loadClamped(curlTex, x + 1, y).x;
  let T = loadClamped(curlTex, x, y - 1).x;
  let B = loadClamped(curlTex, x, y + 1).x;
  let C = loadClamped(curlTex, x, y).x;
  let forceRaw = vec2<f32>(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;
  let forceN = forceRaw / (length(forceRaw) + 0.0001);
  let force = forceN * params.c.x * C;
  let velocity = loadClamped(velocityTex, x, y).xy;
  let outVelocity = velocity + vec2<f32>(force.x, -force.y) * params.c.y;

  textureStore(targetTex, coord, vec4<f32>(outVelocity, 0.0, 1.0));
}
`,divergence:`
${K}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let C = loadClamped(velocityTex, x, y).xy;
  var L = loadClamped(velocityTex, x - 1, y).x;
  var R = loadClamped(velocityTex, x + 1, y).x;
  var T = loadClamped(velocityTex, x, y - 1).y;
  var B = loadClamped(velocityTex, x, y + 1).y;

  if (params.c.x > 0.5) {
    if (coord.x == 0u) {
      L = -C.x;
    }
    if (coord.x == simWidth() - 1u) {
      R = -C.x;
    }
    if (coord.y == 0u) {
      T = -C.y;
    }
    if (coord.y == simHeight() - 1u) {
      B = -C.y;
    }
  }

  let div = (R - L + T - B) * 0.5;
  textureStore(targetTex, coord, vec4<f32>(div, 0.0, 0.0, 1.0));
}
`,pressure:`
${K}
@group(0) @binding(1) var pressureTex: texture_2d<f32>;
@group(0) @binding(2) var divergenceTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(pressureTex, x - 1, y).x;
  let R = loadClamped(pressureTex, x + 1, y).x;
  let T = loadClamped(pressureTex, x, y - 1).x;
  let B = loadClamped(pressureTex, x, y + 1).x;
  let div = loadClamped(divergenceTex, x, y).x;
  let value = (L + R + B + T - div) * 0.25;

  textureStore(targetTex, coord, vec4<f32>(value, 0.0, 0.0, 1.0));
}
`,gradientSubtract:`
${K}
@group(0) @binding(1) var pressureTex: texture_2d<f32>;
@group(0) @binding(2) var velocityTex: texture_2d<f32>;
@group(0) @binding(3) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let x = i32(coord.x);
  let y = i32(coord.y);
  let L = loadClamped(pressureTex, x - 1, y).x;
  let R = loadClamped(pressureTex, x + 1, y).x;
  let T = loadClamped(pressureTex, x, y - 1).x;
  let B = loadClamped(pressureTex, x, y + 1).x;
  let velocity = loadClamped(velocityTex, x, y).xy;
  let projected = velocity - vec2<f32>(R - L, T - B);

  textureStore(targetTex, coord, vec4<f32>(projected, 0.0, 1.0));
}
`,advect:`
${K}
@group(0) @binding(1) var velocityTex: texture_2d<f32>;
@group(0) @binding(2) var sourceTex: texture_2d<f32>;
@group(0) @binding(3) var linearSampler: sampler;
@group(0) @binding(4) var targetTex: texture_storage_2d<${j}, write>;

@compute @workgroup_size(${I}, ${V}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let coord = gid.xy;
  if (!inBounds(coord)) {
    return;
  }

  let vUv = normalizedUvYUp(coord);
  let dt = params.c.x;
  let dissipation = params.c.y;
  let useBFECC = select(0.0, 1.0, params.c.z >= 0.5);
  let velocity = sampleYUp(velocityTex, linearSampler, vUv).xy;
  let coordPlain = vUv - velocity * dt * texelSize();
  let samplePlain = sampleYUp(sourceTex, linearSampler, coordPlain);

  let spotOld = vUv - velocity * dt * texelSize();
  let velBack = sampleYUp(velocityTex, linearSampler, spotOld).xy;
  let spotForward = spotOld + velBack * dt * texelSize();
  let error = spotForward - vUv;
  let spotMid = vUv - error * 0.5;
  let velMid = sampleYUp(velocityTex, linearSampler, spotMid).xy;
  let coordBFECC = spotMid - velMid * dt * texelSize();
  let sampleBFECC = sampleYUp(sourceTex, linearSampler, coordBFECC);
  let result = (samplePlain * (1.0 - useBFECC) + sampleBFECC * useBFECC) * dissipation;

  textureStore(targetTex, coord, vec4<f32>(result.rgb, 1.0));
}
`};function ve(n,t,e,i){let s=new Me(n,t);return s.name=i,s.format=ze,s.type=Be,s.generateMipmaps=!1,s.mipmapsAutoUpdate=!1,e||(s.minFilter=be,s.magFilter=be),s}function me(n,t,e,i){return{read:ve(n,t,e,`${i}.read`),write:ve(n,t,e,`${i}.write`)}}function ge(n,t,e){n.setSize(t,e,1)}function pe(n,t,e){ge(n.read,t,e),ge(n.write,t,e)}function ne(n){let t=n.read;n.read=n.write,n.write=t}function ye(n){n.read.dispose(),n.write.dispose()}function de(n,t){let e=new Float32Array(Le);return e[0]=n,e[1]=t,e[2]=1/n,e[3]=1/t,e}var $e=class{simResolution;dyeResolution;pressureIterations;densityDissipation;velocityDissipation;pressureDissipation;curlStrength;splatRadius;splatForce;baseDelta;enableVorticity;bfecc;reflectWalls;enableDye=!1;dyeDissipation;densityNode;dyeNode;velocityNode;pressureNode;divergenceNode;curlNode;renderer;backend;device;velocity;density;dye;pressure;divergence;curl;pipelines;linearSampler;uniformBuffers=[];textureViews=new Map;bindGroups=new Map;splats=[];frameUniformIndex=0;targetsNeedClear=!0;viewportWidth=1;viewportHeight=1;simWidth;simHeight;dyeWidth;dyeHeight;constructor(t,e={}){this.renderer=t,this.backend=this.getWebGPUBackend(t),this.device=this.backend.device;let i=Ee[e.profile??"balanced"];this.simResolution=e.simResolution??i.simResolution,this.dyeResolution=e.dyeResolution??i.dyeResolution,this.pressureIterations=e.pressureIterations??i.pressureIterations,this.densityDissipation=e.densityDissipation??.91,this.velocityDissipation=e.velocityDissipation??.985,this.pressureDissipation=e.pressureDissipation??.8,this.curlStrength=e.curlStrength??.55,this.splatRadius=e.splatRadius??42e-5,this.splatForce=e.splatForce??6,this.baseDelta=e.baseDelta??1/60,this.enableVorticity=e.enableVorticity??!1,this.bfecc=e.bfecc??!0,this.reflectWalls=e.reflectWalls??!0,this.dyeDissipation=e.dyeDissipation??this.densityDissipation,this.simWidth=this.simResolution,this.simHeight=this.simResolution,this.dyeWidth=this.dyeResolution,this.dyeHeight=this.dyeResolution,this.velocity=me(this.simWidth,this.simHeight,!0,"fluid.wgsl.velocity"),this.density=me(this.dyeWidth,this.dyeHeight,!0,"fluid.wgsl.density"),this.dye=me(this.dyeWidth,this.dyeHeight,!0,"fluid.wgsl.dye"),this.pressure=me(this.simWidth,this.simHeight,!1,"fluid.wgsl.pressure"),this.divergence=ve(this.simWidth,this.simHeight,!1,"fluid.wgsl.divergence"),this.curl=ve(this.simWidth,this.simHeight,!1,"fluid.wgsl.curl"),this.initGpuTextures(),this.densityNode=se(this.density.read),this.dyeNode=se(this.dye.read),this.velocityNode=se(this.velocity.read),this.pressureNode=se(this.pressure.read),this.divergenceNode=se(this.divergence),this.curlNode=se(this.curl),this.linearSampler=this.device.createSampler({label:"fluid.wgsl.linearSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.pipelines=this.createPipelines()}get velocityTexture(){return this.velocity.read}get velocityProjectedTexture(){return this.velocity.write}get densityTexture(){return this.density.read}get dyeTexture(){return this.dye.read}resize(t,e){this.viewportWidth=Math.max(1,t),this.viewportHeight=Math.max(1,e);let i=this.viewportWidth/this.viewportHeight,s,r,d,o;i>=1?(s=this.simResolution,r=Math.max(1,Math.round(this.simResolution/i)),d=this.dyeResolution,o=Math.max(1,Math.round(this.dyeResolution/i))):(s=Math.max(1,Math.round(this.simResolution*i)),r=this.simResolution,d=Math.max(1,Math.round(this.dyeResolution*i)),o=this.dyeResolution);let a=!1;(s!==this.simWidth||r!==this.simHeight)&&(this.simWidth=s,this.simHeight=r,pe(this.velocity,s,r),pe(this.pressure,s,r),ge(this.divergence,s,r),ge(this.curl,s,r),this.targetsNeedClear=!0,a=!0),(d!==this.dyeWidth||o!==this.dyeHeight)&&(this.dyeWidth=d,this.dyeHeight=o,pe(this.density,d,o),pe(this.dye,d,o),this.targetsNeedClear=!0,a=!0),a&&(this.initGpuTextures(),this.textureViews.clear(),this.bindGroups.clear())}addSplat(t,e,i,s,r={}){this.splats.push({x:Math.min(1,Math.max(0,t)),y:Math.min(1,Math.max(0,e)),dx:i,dy:s,radius:r.radius??this.splatRadius,color:r.color,dyeColor:r.dyeColor})}step(t){let e=Math.min(Math.max(t,1e-6),.016666666666666666),i=this.baseDelta>0?e/this.baseDelta:1,s=this.device.createCommandEncoder({label:"fluid.wgsl.step"});this.frameUniformIndex=0,this.targetsNeedClear&&(this.clearTargets(s),this.targetsNeedClear=!1);for(let a=0;a<this.splats.length;a+=1)this.applySplat(s,this.splats[a]);if(this.splats.length=0,this.enableVorticity&&this.dispatch(s,"curl",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.curl}]),this.enableVorticity){let a=de(this.simWidth,this.simHeight);a[8]=this.curlStrength,a[9]=e,this.dispatch(s,"vorticity",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.curl},{binding:3,texture:this.velocity.write}],a),ne(this.velocity)}let r=de(this.simWidth,this.simHeight);r[8]=this.reflectWalls?1:0,this.dispatch(s,"divergence",this.simWidth,this.simHeight,[{binding:1,texture:this.velocity.read},{binding:2,texture:this.divergence}],r);let d=de(this.simWidth,this.simHeight);d[4]=Math.pow(this.pressureDissipation,i),this.dispatch(s,"decay",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.pressure.write}],d),ne(this.pressure);for(let a=0;a<this.pressureIterations;a+=1)this.dispatch(s,"pressure",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.divergence},{binding:3,texture:this.pressure.write}]),ne(this.pressure);this.dispatch(s,"gradientSubtract",this.simWidth,this.simHeight,[{binding:1,texture:this.pressure.read},{binding:2,texture:this.velocity.read},{binding:3,texture:this.velocity.write}]),ne(this.velocity);let o=this.bfecc?1:0;this.advectTexture(s,this.velocity,this.simWidth,this.simHeight,Math.pow(this.velocityDissipation,i),e,o),this.advectTexture(s,this.density,this.dyeWidth,this.dyeHeight,Math.pow(this.densityDissipation,i),e,o),this.enableDye&&this.advectTexture(s,this.dye,this.dyeWidth,this.dyeHeight,Math.pow(this.dyeDissipation,i),e,o),this.device.queue.submit([s.finish()]),this.refreshPublicNodes()}dispose(){ye(this.velocity),ye(this.density),ye(this.dye),ye(this.pressure),this.divergence.dispose(),this.curl.dispose();for(let t of this.uniformBuffers)t.destroy();this.uniformBuffers.length=0,this.textureViews.clear(),this.bindGroups.clear()}getWebGPUBackend(t){let e=t.backend;if(!e?.isWebGPUBackend||!e.device)throw new Error("WGSLFluidSimulation requires WebGPURenderer with the WebGPU backend.");return e}createPipelines(){return Object.entries(Ye).reduce((e,[i,s])=>{let r=this.device.createShaderModule({label:`fluid.wgsl.${i}.module`,code:s});return e[i]=this.device.createComputePipeline({label:`fluid.wgsl.${i}.pipeline`,layout:"auto",compute:{module:r,entryPoint:"main"}}),e},{})}initGpuTextures(){for(let t of this.allTextures())this.renderer.initTexture(t)}allTextures(){return[this.velocity.read,this.velocity.write,this.density.read,this.density.write,this.dye.read,this.dye.write,this.pressure.read,this.pressure.write,this.divergence,this.curl]}getGpuTexture(t){let e=this.backend.get(t).texture;if(!e)throw new Error(`Missing GPUTexture for ${t.name||"StorageTexture"}.`);return e}getTextureView(t){let e=this.textureViews.get(t.id);return e||(e=this.getGpuTexture(t).createView(),this.textureViews.set(t.id,e)),e}writeUniform(t){let e=this.frameUniformIndex;this.frameUniformIndex+=1;let i=this.uniformBuffers[e];return i||(i=this.device.createBuffer({label:`fluid.wgsl.uniform.${e}`,size:Ge,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.uniformBuffers[e]=i),this.device.queue.writeBuffer(i,0,t.buffer,t.byteOffset,t.byteLength),{index:e,buffer:i}}getBindGroup(t,e,i,s){let r=[t,e,...s.map(o=>"texture"in o?`${o.binding}:texture:${o.texture.id}`:`${o.binding}:sampler:${o.sampler}`)].join("|"),d=this.bindGroups.get(r);if(!d){let o=[{binding:0,resource:{buffer:i}}];for(let a of s)o.push("texture"in a?{binding:a.binding,resource:this.getTextureView(a.texture)}:{binding:a.binding,resource:this.linearSampler});d=this.device.createBindGroup({label:`fluid.wgsl.${t}.bindGroup`,layout:this.pipelines[t].getBindGroupLayout(0),entries:o}),this.bindGroups.set(r,d)}return d}dispatch(t,e,i,s,r,d=de(i,s)){let o=this.writeUniform(d),a=t.beginComputePass({label:`fluid.wgsl.${e}`});a.setPipeline(this.pipelines[e]),a.setBindGroup(0,this.getBindGroup(e,o.index,o.buffer,r)),a.dispatchWorkgroups(Math.ceil(i/I),Math.ceil(s/V),1),a.end()}clearTargets(t){this.clearTexture(t,this.velocity.read,this.simWidth,this.simHeight),this.clearTexture(t,this.velocity.write,this.simWidth,this.simHeight),this.clearTexture(t,this.pressure.read,this.simWidth,this.simHeight),this.clearTexture(t,this.pressure.write,this.simWidth,this.simHeight),this.clearTexture(t,this.divergence,this.simWidth,this.simHeight),this.clearTexture(t,this.curl,this.simWidth,this.simHeight),this.clearTexture(t,this.density.read,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.density.write,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.dye.read,this.dyeWidth,this.dyeHeight),this.clearTexture(t,this.dye.write,this.dyeWidth,this.dyeHeight)}clearTexture(t,e,i,s){this.dispatch(t,"fill",i,s,[{binding:1,texture:e}])}applySplat(t,e){let i=e.color??[e.dx,e.dy,1];this.applySplatToDouble(t,this.velocity,this.simWidth,this.simHeight,e,i),this.applySplatToDouble(t,this.density,this.dyeWidth,this.dyeHeight,e,i),this.enableDye&&e.dyeColor&&this.applySplatToDouble(t,this.dye,this.dyeWidth,this.dyeHeight,e,e.dyeColor)}applySplatToDouble(t,e,i,s,r,d){let o=de(i,s);o[4]=d[0],o[5]=d[1],o[6]=d[2],o[7]=1,o[8]=r.x,o[9]=r.y,o[10]=Math.max(1e-6,3*Math.sqrt(r.radius)),o[11]=this.viewportWidth/this.viewportHeight,this.dispatch(t,"splat",i,s,[{binding:1,texture:e.read},{binding:2,texture:e.write}],o),ne(e)}advectTexture(t,e,i,s,r,d,o){let a=de(i,s);a[8]=d,a[9]=r,a[10]=o,this.dispatch(t,"advect",i,s,[{binding:1,texture:this.velocity.read},{binding:2,texture:e.read},{binding:3,sampler:"linear"},{binding:4,texture:e.write}],a),ne(e)}refreshPublicNodes(){this.densityNode.value=this.density.read,this.dyeNode.value=this.dye.read,this.velocityNode.value=this.velocity.read,this.pressureNode.value=this.pressure.read,this.divergenceNode.value=this.divergence,this.curlNode.value=this.curl}};function ke(n,t,e){let i=Math.floor(n*6),s=n*6-i,r=e*(1-t),d=e*(1-s*t),o=e*(1-(1-s)*t);switch(i%6){case 0:return[e,o,r];case 1:return[d,e,r];case 2:return[r,e,o];case 3:return[r,d,e];case 4:return[o,r,e];default:return[e,r,d]}}function Xe(n,t,e={}){let i=e.coloredStrokes??!1,s=e.colorUpdateSpeed??10,r=e.colorize,d=ke(Math.random(),1,1),o=0,a=l=>[l[0]*.3,l[1]*.3,l[2]*.3],v=0,f=0,P=0,m=!1,W=0,z=0,_=-1,x=0,N=0,C=1,h=1,M=()=>{let l=n.getBoundingClientRect();x=l.left,N=l.top,C=Math.max(1,l.width),h=Math.max(1,l.height)};M(),requestAnimationFrame(()=>{M(),requestAnimationFrame(M)});let J=new ResizeObserver(M);J.observe(n);let Q=l=>{if((C<4||h<4)&&(M(),C<4||h<4))return;let p=l.timeStamp||performance.now(),S=p-P;S>200&&(m=!1),_!==-1&&l.pointerId!==_&&(m=!1),_=l.pointerId,P=p;let A=!m;i&&(o+=Math.min(Math.max(S,0),100)/1e3*s,(A||o>=1)&&(o>=1&&(o%=1),d=ke(Math.random(),1,1)));let k=(l.clientX-x)/C,X=1-(l.clientY-N)/h,b=m?l.movementX||l.clientX-v:0,q=m?-(l.movementY||l.clientY-f):0;if(v=l.clientX,f=l.clientY,m=!0,Math.abs(b)+Math.abs(q)<.25)return;let U=W||z?Math.hypot(l.clientX-W,l.clientY-z):0;if(S>0&&U/S>6.5&&U>200){m=!1,W=l.clientX,z=l.clientY;return}W=l.clientX,z=l.clientY;let oe=t.splatForce,ie;r&&(ie=r(b,q,p)),ie===void 0&&i&&(ie=a(d)),t.addSplat(k,X,b*oe,q*oe,ie?{dyeColor:ie}:void 0)},u=()=>{m=!1};return n.addEventListener("pointermove",Q),n.addEventListener("pointerout",u),n.addEventListener("pointercancel",u),window.addEventListener("blur",u),document.addEventListener("visibilitychange",u),window.addEventListener("resize",M),window.addEventListener("scroll",M,{passive:!0}),()=>{J.disconnect(),n.removeEventListener("pointermove",Q),n.removeEventListener("pointerout",u),n.removeEventListener("pointercancel",u),window.removeEventListener("blur",u),document.removeEventListener("visibilitychange",u),window.removeEventListener("resize",M),window.removeEventListener("scroll",M)}}var we=class extends Z{static get type(){return"ChromaticDistortionNode"}sceneTexture;fluidTexture;intensityNode;_invSize=he(new ce);constructor(t,e,i){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i,this.updateBeforeType=ue.FRAME}updateBefore(t){let e=this.fluidTexture.value,i=e?.image?.width??1,s=e?.image?.height??1;this._invSize.value.set(1/i,1/s)}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this._invSize,o=this.intensityNode;return ee(()=>{let v=g(d.x.mul(2),0),f=g(0,d.y.mul(2)),m=i.sample(r).rgb.mul(.36).add(i.sample(r.add(v)).rgb.mul(.16)).add(i.sample(r.sub(v)).rgb.mul(.16)).add(i.sample(r.add(f)).rgb.mul(.16)).add(i.sample(r.sub(f)).rgb.mul(.16)),W=m.xy,_=m.z.clamp(0,1).pow(1.2),x=W.mul(.003).mul(o).mul(_),N=s.sub(W.mul(2e-4).mul(o).mul(_)),C=e.sample(N.add(g(x.x,x.y))).r,h=e.sample(N.add(g(x.x.negate(),x.y))).g,M=e.sample(N.add(g(x.x.negate(),x.y.negate()))).b;return te(C,h,M,1)})()}},qe=(n,t,e=1)=>$(new we(H(n),H(t),$(e))),Ne=class extends Z{static get type(){return"SimpleDistortionNode"}sceneTexture;fluidTexture;intensityNode;constructor(t,e,i){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this.intensityNode;return ee(()=>{let a=i.sample(r).rg,v=s.sub(a.mul(d).mul(3e-4)).clamp(0,1);return e.sample(v)})()}},je=(n,t,e=1)=>$(new Ne(H(n),H(t),$(e))),Se=class extends Z{static get type(){return"RGBShiftDistortionNode"}sceneTexture;fluidTexture;intensityNode;constructor(t,e,i){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this.intensityNode;return ee(()=>{let a=i.sample(r).rgb,v=a.xy,f=a.z.clamp(0,1),P=De(v.length(),1e-4),m=v.div(P),W=f.pow(1.4).mul(d).mul(.012),z=m.mul(W),_=e.sample(s.add(z)).r,x=e.sample(s).g,N=e.sample(s.sub(z)).b;return te(_,x,N,1)})()}},Ke=(n,t,e=1)=>$(new Se(H(n),H(t),$(e))),_e=class extends Z{static get type(){return"WaterDistortionNode"}sceneTexture;fluidTexture;intensityNode;_invSize=he(new ce);constructor(t,e,i){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i,this.updateBeforeType=ue.FRAME}updateBefore(t){let e=this.fluidTexture.value,i=e?.image?.width??1,s=e?.image?.height??1;this._invSize.value.set(1/i,1/s)}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this._invSize,o=this.intensityNode;return ee(()=>{let v=g(d.x.mul(2),0),f=g(0,d.y.mul(2)),P=i.sample(r.sub(v)).b,m=i.sample(r.add(v)).b,W=i.sample(r.sub(f)).b,z=i.sample(r.add(f)).b,x=g(m.sub(P),z.sub(W)).mul(o).mul(.6),N=e.sample(s.add(x.mul(.95))).r,C=e.sample(s.add(x)).g,h=e.sample(s.add(x.mul(1.05))).b;return te(N,C,h,1)})()}},Je=(n,t,e=1)=>$(new _e(H(n),H(t),$(e))),Ce=class extends Z{static get type(){return"WaterCausticsDistortionNode"}sceneTexture;fluidTexture;intensityNode;timeNode;_invSize=he(new ce);constructor(t,e,i,s){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i,this.timeNode=s,this.updateBeforeType=ue.FRAME}updateBefore(t){let e=this.fluidTexture.value,i=e?.image?.width??1,s=e?.image?.height??1;this._invSize.value.set(1/i,1/s)}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this._invSize,o=this.intensityNode,a=this.timeNode,v=6.28318530718,f=.005,P=(W,z)=>{let _=W.mul(v).mod(v).sub(250),x=_,N=B(1);for(let C=0;C<5;C++){let h=z.mul(1-3.5/(C+1));x=_.add(g(h.sub(x.x).cos().add(h.add(x.y).sin()),h.sub(x.y).sin().add(h.add(x.x).cos())));let M=x.x.add(h).sin().div(f),J=x.y.add(h).cos().div(f),Q=g(_.x.div(M),_.y.div(J));N=N.add(B(1).div(Q.length()))}return N=N.div(5),N=B(1.17).sub(N.pow(1.4)),N.abs().pow(8).clamp(0,1)};return ee(()=>{let W=g(d.x.mul(2),0),z=g(0,d.y.mul(2)),_=i.sample(r).rgb,x=_.z,N=_.xy,C=i.sample(r.sub(W)).b,h=i.sample(r.add(W)).b,M=i.sample(r.sub(z)).b,J=i.sample(r.add(z)).b,Q=g(h.sub(C),J.sub(M)),u=Q.mul(o).mul(.6),l=e.sample(s.add(u.mul(.95))).r,p=e.sample(s.add(u)).g,S=e.sample(s.add(u.mul(1.05))).b,A=le(.015,.16,x),k=le(.0015,.04,Q.length()),X=s.mul(4).add(N.mul(.0012)),b=P(X,a.mul(.5).add(23)),q=T(b,b,b).add(T(0,.35,.5)).clamp(0,1),U=b.pow(1.25).mul(A).mul(k.mul(.6).add(.4)),oe=T(l,p,S).add(q.mul(U).mul(o).mul(.38));return te(oe,1)})()}},Qe=(n,t,e=1,i=0)=>$(new Ce(H(n),H(t),$(e),$(i))),Fe=(n,t)=>$(n??t),Ue=class extends Z{static get type(){return"DensityTintOverlayNode"}sceneTexture;fluidTexture;intensityNode;tintNode;constructor(t,e,i,s){super("vec4"),this.sceneTexture=t,this.fluidTexture=e,this.intensityNode=i,this.tintNode=s}setup(t){let e=this.sceneTexture,i=this.fluidTexture,s=e.uvNode||F(),r=i.uvNode||F(),d=this.intensityNode,o=this.tintNode;return ee(()=>{let v=e.sample(s).rgb,f=i.sample(r).b.clamp(0,1);return te(v.add(o.mul(f).mul(d)),1)})()}},Ze=(n,t,e={})=>$(new Ue(H(n),H(t),Fe(e.intensity,B(.14)),Fe(e.tint,T(.1,.42,.36)))),xe=6.28318530718,re=(n,t)=>$(n??t),We=class extends Z{static get type(){return"FluidOverlayNode"}style;sceneTexture;densityTexture;dyeTexture;velocityTexture;intensityNode;timeNode;texelNode;cursorColorNode;vibranceNode;velocityScaleNode;opacityNode;constructor(t,e,i,s,r,d){super("vec4"),this.style=t,this.sceneTexture=e,this.densityTexture=i,this.dyeTexture=s,this.velocityTexture=r,this.intensityNode=d.intensity,this.timeNode=d.time,this.texelNode=d.texel,this.cursorColorNode=d.cursorColor,this.vibranceNode=d.vibrance,this.velocityScaleNode=d.velocityScale,this.opacityNode=d.opacity}setup(t){let e=this.sceneTexture,i=this.densityTexture,s=this.dyeTexture,r=this.velocityTexture,d=e.uvNode||F(),o=i.uvNode||F(),a=this.intensityNode,v=this.timeNode,f=this.texelNode,P=this.cursorColorNode,m=this.vibranceNode,W=this.velocityScaleNode,z=this.opacityNode,_=u=>{let l=s.sample(u).rgb.mul(.5);return l=l.add(s.sample(u.add(f.mul(g(1,1)))).rgb.mul(.125)),l=l.add(s.sample(u.add(f.mul(g(-1,1)))).rgb.mul(.125)),l=l.add(s.sample(u.add(f.mul(g(1,-1)))).rgb.mul(.125)),l=l.add(s.sample(u.add(f.mul(g(-1,-1)))).rgb.mul(.125)),l},x=u=>{let l=u.fract();return T(l.mul(xe).sin().mul(.5).add(.5),l.add(.333).mul(xe).sin().mul(.5).add(.5),l.add(.666).mul(xe).sin().mul(.5).add(.5))},N=u=>{let l=T(1,.33,.2),p=T(.08,.78,.68),S=T(1,.84,.55);return D(D(l,S,le(.15,.85,u)),p,le(.55,1,u).mul(.42))},C=u=>{let l=te(1,.6666666666666666,.3333333333333333,3),p=u.xxx.add(l.xyz).fract().mul(6).sub(l.www).abs();return u.z.mul(D(l.xxx,p.sub(l.xxx).clamp(0,1),u.y))},h=(u,l)=>{let p=Te(u,T(.299,.587,.114));return D(T(p,p,p),u,B(1).add(l)).clamp(0,1)},M=()=>{let u=g(f.x.mul(8),0),l=g(0,f.y.mul(8)),p=s.sample(o.add(u)).rgb.length();return p=p.add(s.sample(o.sub(u)).rgb.length()),p=p.add(s.sample(o.add(l)).rgb.length()),p=p.add(s.sample(o.sub(l)).rgb.length()),p.mul(.25)},J=u=>{let l=B(0),p=B(0);for(let S=1;S<8;S+=1){let A=1-S/8;l=l.add(i.sample(o.sub(u.mul(S*.04))).b.mul(A)),p=p.add(A)}return l.div(p)};return ee(()=>{let u=i.sample(o).rgb,l=r.sample(o).rg.mul(W),p=u.b.clamp(0,1),S=u.rg,A=_(o),k=A.length(),X=A.div(k.add(1e-5)).clamp(0,1),b=e.sample(d).rgb,q=S.length(),U=c=>te(D(b,c,z.clamp(0,1)),1);if(this.style==="default"){let c=le(.02,.55,M().mul(a).mul(4)),y=q.mul(.02).clamp(0,1),R=h(P.mul(B(.48).add(c.mul(.52))).add(T(y.mul(.12))),m),w=k.mul(a).mul(3).clamp(0,.95);return U(D(b,R,w))}if(this.style==="volumeCursor"){let c=g(f.x.mul(1.5),0),y=g(0,f.y.mul(1.5)),R=g(s.sample(o.add(c)).rgb.length().sub(s.sample(o.sub(c)).rgb.length()),s.sample(o.add(y)).rgb.length().sub(s.sample(o.sub(y)).rgb.length())),w=R.div(R.length().add(1e-4)),L=Te(w,g(-.6,.8)).mul(.5).add(.5).clamp(.2,1),E=k.pow(.42).mul(L),G=h(P.mul(B(.3).add(E.mul(1.1))).clamp(0,1),m),Y=k.mul(a).mul(2.2).clamp(0,.88);return U(D(b,G,Y))}if(this.style==="trail"){let c=J(S),y=p.pow(4),R=c.mul(.7).add(y.mul(1.4)).mul(a);return U(b.add(h(P,m).mul(R)))}if(this.style==="oil"){let c=p;for(let E=1;E<6;E+=1){let G=S.mul(E*.035);c=c.add(i.sample(o.sub(G)).b.mul(1-E/7))}let y=c.mul(a).clamp(0,1),R=h(N(y.mul(.62).add(q.mul(.015)).add(v.mul(.025)).fract()),m),w=y.mul(.58).add(q.mul(.012)).clamp(0,.86),L=b.add(R.mul(w).mul(.86));return U(D(L,R,w.mul(.14)))}if(this.style==="velocity"){let y=l.mul(.04).mul(a),R=y.length().clamp(0,1),w=T(y.mul(1.5).add(.1),1);return U(b.add(w.mul(R)))}if(this.style==="colorful"){let c=B(0),y=T(0);for(let w=0;w<6;w+=1){let L=o.sub(S.mul(w*.035)),G=i.sample(L).b.mul(1-w/7);c=c.add(G);let Y=L.x.mul(1.6).add(L.y.mul(.9)).add(v.mul(.05)),ae=L.y.mul(1.2).sub(L.x.mul(.4)).sub(v.mul(.03)),fe=C(T(Y.fract(),.9,1)),Pe=C(T(ae.fract(),.85,.95));y=y.add(D(fe,Pe,.5).mul(G))}y=y.div(c.max(1e-4));let R=c.mul(a).mul(.55).clamp(0,1.4);return U(b.add(h(y,m).mul(R)))}if(this.style==="rainbowFish"){let c=l.mul(.04),y=c.length(),w=He(c.y,c.x).div(xe).add(.5).add(v.mul(.05)),L=o.x.mul(1.2).add(o.y.mul(.8)).add(v.mul(.04)),E=C(T(w.fract(),.92,1)),G=C(T(L.fract(),.7,.95)),Y=h(D(E,G,.35),m),fe=y.mul(8).clamp(0,1).pow(2.5).mul(1.6).mul(a);return U(b.add(Y.mul(fe)))}if(this.style==="glaze")return U(b.add(h(T(1,.45,.22),m).mul(p).mul(a)));if(this.style==="burn"){let c=B(0);for(let Y=0;Y<5;Y+=1){let ae=S.mul((Y+1)*.05);c=c.add(i.sample(o.sub(ae)).b.mul(1-Y/5))}c=c.mul(a);let y=T(1,.3,0),R=T(.8,.15,0),w=D(R,y,c.clamp(0,1));w=w.add(y.mul(c.clamp(0,1).pow(2)).mul(2));let L=c.mul(.3);w=w.add(T(.1,.1,.15).mul(L));let E=v.mul(15).add(c.mul(20)).sin().mul(.2).add(.8);w=w.mul(E);let G=c.mul(.5).mul(E).add(L.mul(.2)).clamp(0,.85);return U(D(b,h(w,m),G))}if(this.style==="smoke"){let c=k.mul(a).mul(2.6).clamp(0,.78),y=T(.9,.92,.94).mul(B(.22).add(c.mul(.9)));return U(D(b,y,c))}if(this.style==="artInk"){let c=k.mul(a).mul(2.2).clamp(0,1);return U(b.add(h(X,m).mul(c).mul(1.55)))}if(this.style==="rainbowInk"){let c=d.x.mul(.45).add(d.y.mul(.35)).add(k.mul(.2)).add(v.mul(.03)),y=h(D(X,x(c),.45),m),R=k.mul(a).mul(2.35).clamp(0,1);return U(b.add(y.mul(R).mul(1.35)))}if(this.style==="colorWater"){let c=k.mul(a).mul(2.1).clamp(0,.72),y=D(b,h(X,m),c);return U(y.add(b.mul(X).mul(c).mul(.35)))}let oe=k.mul(4).clamp(0,1),ie=d.add(S.mul(oe).mul(.012)),Re=e.sample(ie).rgb,Oe=h(X,m).mul(k).mul(a).mul(1.4).clamp(0,1.6);return U(Re.add(Re.mul(Oe)))})()}},Ie=(n,t,e,i,s,r={})=>$(new We(n,H(t),H(e),H(i),H(s),{intensity:re(r.intensity,B(1)),time:re(r.time,B(0)),texel:re(r.texel,g(1/512,1/512)),cursorColor:re(r.cursorColor,T(.85,.95,1)),vibrance:re(r.vibrance,B(0)),velocityScale:re(r.velocityScale,B(1)),opacity:re(r.opacity,B(1))})),O=n=>(t,e,i,s,r={})=>Ie(n,t,e,i,s,r),et=O("default"),tt=O("volumeCursor"),it=O("trail"),st=O("oil"),rt=O("velocity"),ot=O("colorful"),lt=O("rainbowFish"),nt=O("glaze"),dt=O("burn"),at=O("smoke"),ct=O("artInk"),ut=O("rainbowInk"),ht=O("colorWater"),mt=O("liquidLens");export{we as ChromaticDistortionNode,Ue as DensityTintOverlayNode,Ee as FLUID_PROFILES,We as FluidOverlayNode,$e as FluidSimulation,Se as RGBShiftDistortionNode,Ne as SimpleDistortionNode,$e as WGSLFluidSimulation,Ce as WaterCausticsDistortionNode,_e as WaterDistortionNode,ct as artInkOverlay,Xe as attachPointerSplats,dt as burnOverlay,qe as chromaticDistortion,ht as colorWaterOverlay,ot as colorfulOverlay,et as defaultOverlay,Ze as densityTintOverlay,Ie as fluidOverlay,nt as glazeOverlay,mt as liquidLensOverlay,st as oilOverlay,lt as rainbowFishOverlay,ut as rainbowInkOverlay,Ke as rgbShiftDistortion,je as simpleDistortion,at as smokeOverlay,it as trailOverlay,rt as velocityOverlay,tt as volumeCursorOverlay,Qe as waterCausticsDistortion,Je as waterDistortion};
