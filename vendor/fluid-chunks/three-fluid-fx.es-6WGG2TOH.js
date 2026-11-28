import"./chunk-3U2LHOMF.js";import{B as D,Ba as se,Ed as w,Hd as A,Ia as le,Kg as i,Qa as q,Qd as ne,Ud as x,Wd as T,bc as ue,de as U,ig as z,jd as v,ld as ae,pa as b,ra as re,sf as M,t as te,td as E,v as ie,wa as I}from"./chunk-JPLSRTB5.js";var Le=`
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Be=`
precision mediump float;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main() {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`,Ge=`
varying vec2 vLocalUv;
uniform vec2 uCenter;
uniform vec2 uScale;

void main() {
  vLocalUv = position.xy;
  gl_Position = vec4(position.xy * uScale + uCenter, 0.0, 1.0);
}
`,We=`
precision highp float;
varying vec2 vLocalUv;
uniform vec3 color;

void main() {
  float r = length(vLocalUv);
  if (r > 1.0) discard;
  float a = 1.0 - r;
  a *= a;
  gl_FragColor = vec4(color * a, a);
}
`,Ne=`
precision mediump float;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`,He=`
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

void main() {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}
`,Ke=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
uniform float uReflectWalls;

void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  // No-flow-through-walls (reflection): mirror the velocity at boundaries.
  // Disable to let flow leave the screen \u2014 mofu / FluidCursor behaviour.
  if (uReflectWalls > 0.5) {
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
  }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`,qe=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`,ke=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`,k=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
uniform float uBFECC;

void main() {
  if (uBFECC < 0.5) {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  } else {
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vec2 spotOld = vUv - vel * dt * texelSize;
    vec2 velBack = texture2D(uVelocity, spotOld).xy;
    vec2 spotForward = spotOld + velBack * dt * texelSize;
    vec2 error = spotForward - vUv;
    vec2 spotMid = vUv - error * 0.5;
    vec2 velMid = texture2D(uVelocity, spotMid).xy;
    vec2 coord = spotMid - velMid * dt * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
  gl_FragColor.a = 1.0;
}
`,$e={performance:{simResolution:128,dyeResolution:256,pressureIterations:6},balanced:{simResolution:256,dyeResolution:512,pressureIterations:12},quality:{simResolution:384,dyeResolution:1024,pressureIterations:20}};function B(s,t,e){let r=e?I:re;return new E(s,t,{depthBuffer:!1,stencilBuffer:!1,format:q,type:le,minFilter:r,magFilter:r,wrapS:b,wrapT:b,generateMipmaps:!1})}function _(s,t,e){return{read:B(s,t,e),write:B(s,t,e)}}function p(s){let t=s.read;s.read=s.write,s.write=t}function L(s){s.read.dispose(),s.write.dispose()}var oe=class{simResolution;dyeResolution;pressureIterations;densityDissipation;velocityDissipation;pressureDissipation;curlStrength;splatRadius;splatForce;baseDelta;enableVorticity;bfecc;reflectWalls;renderer;scene=new A;camera=new z(-1,1,1,-1,0,1);geometry=new T;mesh;splatScene=new A;splatGeometry=new T;splatMesh;velocity;density;dye;pressure;divergence;curl;enableDye=!1;dyeDissipation;clearMaterial;splatMaterial;curlMaterial;vorticityMaterial;divergenceMaterial;pressureMaterial;gradientSubtractMaterial;advectVelocityMaterial;advectDensityMaterial;advectDyeMaterial;splats=[];viewportWidth=1;viewportHeight=1;simWidth;simHeight;dyeWidth;dyeHeight;constructor(t,e={}){this.renderer=t;let r=$e[e.profile??"balanced"];this.simResolution=e.simResolution??r.simResolution,this.dyeResolution=e.dyeResolution??r.dyeResolution,this.pressureIterations=e.pressureIterations??r.pressureIterations,this.densityDissipation=e.densityDissipation??.91,this.velocityDissipation=e.velocityDissipation??.985,this.pressureDissipation=e.pressureDissipation??.8,this.curlStrength=e.curlStrength??.55,this.splatRadius=e.splatRadius??42e-5,this.splatForce=e.splatForce??6,this.baseDelta=e.baseDelta??1/60,this.enableVorticity=e.enableVorticity??!1,this.bfecc=e.bfecc??!0,this.reflectWalls=e.reflectWalls??!0,this.geometry.setAttribute("position",new x(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.mesh=new U(this.geometry,void 0),this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.splatGeometry.setAttribute("position",new x(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),this.splatGeometry.setIndex(new ne(new Uint16Array([0,1,2,1,3,2]),1)),this.splatMesh=new U(this.splatGeometry,void 0),this.splatMesh.frustumCulled=!1,this.splatScene.add(this.splatMesh),this.simWidth=this.simResolution,this.simHeight=this.simResolution,this.dyeWidth=this.dyeResolution,this.dyeHeight=this.dyeResolution,this.velocity=_(this.simWidth,this.simHeight,!0),this.density=_(this.dyeWidth,this.dyeHeight,!0),this.dye=_(this.dyeWidth,this.dyeHeight,!0),this.pressure=_(this.simWidth,this.simHeight,!1),this.dyeDissipation=e.dyeDissipation??this.densityDissipation,this.divergence=B(this.simWidth,this.simHeight,!1),this.curl=B(this.simWidth,this.simHeight,!1);let u=new v(1/this.simWidth,1/this.simHeight),l=new v(1/this.dyeWidth,1/this.dyeHeight);this.clearMaterial=this.createMaterial(Be,{texelSize:{value:u.clone()},uTexture:{value:null},value:{value:this.pressureDissipation}}),this.splatMaterial=new M({vertexShader:Ge,fragmentShader:We,uniforms:{uCenter:{value:new v},uScale:{value:new v},color:{value:new ae}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:te,blendEquation:ie,blendSrc:D,blendDst:D,blendSrcAlpha:D,blendDstAlpha:D}),this.splatMesh.material=this.splatMaterial,this.curlMaterial=this.createMaterial(Ne,{texelSize:{value:u.clone()},uVelocity:{value:null}}),this.vorticityMaterial=this.createMaterial(He,{texelSize:{value:u.clone()},uVelocity:{value:null},uCurl:{value:null},curl:{value:this.curlStrength},dt:{value:.016}}),this.divergenceMaterial=this.createMaterial(Ke,{texelSize:{value:u.clone()},uVelocity:{value:null},uReflectWalls:{value:1}}),this.pressureMaterial=this.createMaterial(qe,{texelSize:{value:u.clone()},uPressure:{value:null},uDivergence:{value:null}}),this.gradientSubtractMaterial=this.createMaterial(ke,{texelSize:{value:u.clone()},uPressure:{value:null},uVelocity:{value:null}}),this.advectVelocityMaterial=this.createMaterial(k,{texelSize:{value:u.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}}),this.advectDensityMaterial=this.createMaterial(k,{texelSize:{value:l.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}}),this.advectDyeMaterial=this.createMaterial(k,{texelSize:{value:l.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}})}get velocityTexture(){return this.velocity.read.texture}get velocityProjectedTexture(){return this.velocity.write.texture}get densityTexture(){return this.density.read.texture}get dyeTexture(){return this.dye.read.texture}resize(t,e){this.viewportWidth=Math.max(1,t),this.viewportHeight=Math.max(1,e);let r=this.viewportWidth/this.viewportHeight,u,l,o,a;if(r>=1?(u=this.simResolution,l=Math.max(1,Math.round(this.simResolution/r)),o=this.dyeResolution,a=Math.max(1,Math.round(this.dyeResolution/r))):(u=Math.max(1,Math.round(this.simResolution*r)),l=this.simResolution,o=Math.max(1,Math.round(this.dyeResolution*r)),a=this.dyeResolution),u!==this.simWidth||l!==this.simHeight){this.simWidth=u,this.simHeight=l,this.velocity.read.setSize(u,l),this.velocity.write.setSize(u,l),this.pressure.read.setSize(u,l),this.pressure.write.setSize(u,l),this.divergence.setSize(u,l),this.curl.setSize(u,l);let h=1/u,f=1/l;this.clearMaterial.uniforms.texelSize.value.set(h,f),this.curlMaterial.uniforms.texelSize.value.set(h,f),this.vorticityMaterial.uniforms.texelSize.value.set(h,f),this.divergenceMaterial.uniforms.texelSize.value.set(h,f),this.pressureMaterial.uniforms.texelSize.value.set(h,f),this.gradientSubtractMaterial.uniforms.texelSize.value.set(h,f),this.advectVelocityMaterial.uniforms.texelSize.value.set(h,f)}if(o!==this.dyeWidth||a!==this.dyeHeight){this.dyeWidth=o,this.dyeHeight=a,this.density.read.setSize(o,a),this.density.write.setSize(o,a),this.dye.read.setSize(o,a),this.dye.write.setSize(o,a);let h=1/o,f=1/a;this.advectDensityMaterial.uniforms.texelSize.value.set(h,f),this.advectDyeMaterial.uniforms.texelSize.value.set(h,f)}}addSplat(t,e,r,u,l={}){this.splats.push({x:Math.min(1,Math.max(0,t)),y:Math.min(1,Math.max(0,e)),dx:r,dy:u,radius:l.radius??this.splatRadius,color:l.color,dyeColor:l.dyeColor})}step(t){let e=Math.min(Math.max(t,1e-6),.016666666666666666),r=this.baseDelta>0?e/this.baseDelta:1,u=this.renderer.getRenderTarget(),l=this.renderer.autoClear;this.renderer.autoClear=!1,this.vorticityMaterial.uniforms.curl.value=this.curlStrength;let o=this.bfecc?1:0;this.advectVelocityMaterial.uniforms.uBFECC.value=o,this.advectDensityMaterial.uniforms.uBFECC.value=o;for(let a=0;a<this.splats.length;a+=1)this.applySplat(this.splats[a]);this.splats.length=0,this.enableVorticity&&(this.curlMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.blit(this.curl,this.curlMaterial),this.vorticityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.vorticityMaterial.uniforms.uCurl.value=this.curl.texture,this.vorticityMaterial.uniforms.dt.value=e,this.blit(this.velocity.write,this.vorticityMaterial),p(this.velocity)),this.divergenceMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.divergenceMaterial.uniforms.uReflectWalls.value=this.reflectWalls?1:0,this.blit(this.divergence,this.divergenceMaterial),this.clearMaterial.uniforms.uTexture.value=this.pressure.read.texture,this.clearMaterial.uniforms.value.value=Math.pow(this.pressureDissipation,r),this.blit(this.pressure.write,this.clearMaterial),p(this.pressure),this.pressureMaterial.uniforms.uDivergence.value=this.divergence.texture;for(let a=0;a<this.pressureIterations;a+=1)this.pressureMaterial.uniforms.uPressure.value=this.pressure.read.texture,this.blit(this.pressure.write,this.pressureMaterial),p(this.pressure);this.gradientSubtractMaterial.uniforms.uPressure.value=this.pressure.read.texture,this.gradientSubtractMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.blit(this.velocity.write,this.gradientSubtractMaterial),p(this.velocity),this.advectVelocityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectVelocityMaterial.uniforms.uSource.value=this.velocity.read.texture,this.advectVelocityMaterial.uniforms.dissipation.value=Math.pow(this.velocityDissipation,r),this.advectVelocityMaterial.uniforms.dt.value=e,this.blit(this.velocity.write,this.advectVelocityMaterial),p(this.velocity),this.advectDensityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectDensityMaterial.uniforms.uSource.value=this.density.read.texture,this.advectDensityMaterial.uniforms.dissipation.value=Math.pow(this.densityDissipation,r),this.advectDensityMaterial.uniforms.dt.value=e,this.blit(this.density.write,this.advectDensityMaterial),p(this.density),this.enableDye&&(this.advectDyeMaterial.uniforms.uBFECC.value=o,this.advectDyeMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectDyeMaterial.uniforms.uSource.value=this.dye.read.texture,this.advectDyeMaterial.uniforms.dissipation.value=Math.pow(this.dyeDissipation,r),this.advectDyeMaterial.uniforms.dt.value=e,this.blit(this.dye.write,this.advectDyeMaterial),p(this.dye)),this.renderer.setRenderTarget(u),this.renderer.autoClear=l}dispose(){this.scene.remove(this.mesh),this.splatScene.remove(this.splatMesh),this.geometry.dispose(),this.splatGeometry.dispose(),this.clearMaterial.dispose(),this.splatMaterial.dispose(),this.curlMaterial.dispose(),this.vorticityMaterial.dispose(),this.divergenceMaterial.dispose(),this.pressureMaterial.dispose(),this.gradientSubtractMaterial.dispose(),this.advectVelocityMaterial.dispose(),this.advectDensityMaterial.dispose(),this.advectDyeMaterial.dispose(),L(this.velocity),L(this.density),L(this.dye),L(this.pressure),this.divergence.dispose(),this.curl.dispose()}createMaterial(t,e){return new M({vertexShader:Le,fragmentShader:t,uniforms:e,depthTest:!1,depthWrite:!1,toneMapped:!1})}blit(t,e){this.mesh.material=e,this.renderer.setRenderTarget(t),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}applySplat(t){let e=this.viewportWidth/this.viewportHeight,r=t.color??[t.dx,t.dy,1],u=3*Math.sqrt(t.radius),l=this.splatMaterial.uniforms;l.uCenter.value.set(t.x*2-1,t.y*2-1),l.uScale.value.set(u/e,u),l.color.value.set(r[0],r[1],r[2]),this.renderer.setRenderTarget(this.velocity.read),this.renderer.render(this.splatScene,this.camera),this.renderer.setRenderTarget(this.density.read),this.renderer.render(this.splatScene,this.camera),this.enableDye&&t.dyeColor&&(l.color.value.set(t.dyeColor[0],t.dyeColor[1],t.dyeColor[2]),this.renderer.setRenderTarget(this.dye.read),this.renderer.render(this.splatScene,this.camera))}};function ce(s,t,e){let r=Math.floor(s*6),u=s*6-r,l=e*(1-t),o=e*(1-u*t),a=e*(1-(1-u)*t);switch(r%6){case 0:return[e,a,l];case 1:return[o,e,l];case 2:return[l,e,a];case 3:return[l,o,e];case 4:return[a,l,e];default:return[e,l,o]}}function yt(s,t,e={}){let r=e.coloredStrokes??!1,u=e.colorUpdateSpeed??10,l=e.colorize,o=ce(Math.random(),1,1),a=0,h=n=>[n[0]*.3,n[1]*.3,n[2]*.3],f=0,Y=0,P=0,m=!1,F=0,C=0,W=-1,Q=0,j=0,R=1,V=1,d=()=>{let n=s.getBoundingClientRect();Q=n.left,j=n.top,R=Math.max(1,n.width),V=Math.max(1,n.height)};d(),requestAnimationFrame(()=>{d(),requestAnimationFrame(d)});let O=new ResizeObserver(d);O.observe(s);let J=n=>{if((R<4||V<4)&&(d(),R<4||V<4))return;let N=n.timeStamp||performance.now(),S=N-P;S>200&&(m=!1),W!==-1&&n.pointerId!==W&&(m=!1),W=n.pointerId,P=N;let Ae=!m;r&&(a+=Math.min(Math.max(S,0),100)/1e3*u,(Ae||a>=1)&&(a>=1&&(a%=1),o=ce(Math.random(),1,1)));let ze=(n.clientX-Q)/R,_e=1-(n.clientY-j)/V,H=m?n.movementX||n.clientX-f:0,K=m?-(n.movementY||n.clientY-Y):0;if(f=n.clientX,Y=n.clientY,m=!0,Math.abs(H)+Math.abs(K)<.25)return;let Z=F||C?Math.hypot(n.clientX-F,n.clientY-C):0;if(S>0&&Z/S>6.5&&Z>200){m=!1,F=n.clientX,C=n.clientY;return}F=n.clientX,C=n.clientY;let ee=t.splatForce,g;l&&(g=l(H,K,N)),g===void 0&&r&&(g=h(o)),t.addSplat(ze,_e,H*ee,K*ee,g?{dyeColor:g}:void 0)},y=()=>{m=!1};return s.addEventListener("pointermove",J),s.addEventListener("pointerout",y),s.addEventListener("pointercancel",y),window.addEventListener("blur",y),document.addEventListener("visibilitychange",y),window.addEventListener("resize",d),window.addEventListener("scroll",d,{passive:!0}),()=>{O.disconnect(),s.removeEventListener("pointermove",J),s.removeEventListener("pointerout",y),s.removeEventListener("pointercancel",y),window.removeEventListener("blur",y),document.removeEventListener("visibilitychange",y),window.removeEventListener("resize",d),window.removeEventListener("scroll",d)}}var pt=`
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ve=class{constructor(t){this.material=t,this.geometry.setAttribute("position",new x(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.mesh=new U(this.geometry,t),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}material;scene=new A;camera=new z(-1,1,1,-1,0,1);geometry=new T;mesh;render(t,e=null){t.setRenderTarget(e),t.render(this.scene,this.camera)}dispose(){this.scene.remove(this.mesh),this.geometry.dispose(),this.material.dispose()}};function xt(s,t){let e=new E(s,t,{depthBuffer:!0,stencilBuffer:!1,minFilter:I,magFilter:I,wrapS:b,wrapT:b,type:se,format:q,generateMipmaps:!1,samples:4});return e.texture.colorSpace=ue,e}var $=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Xe=new z(-1,1,1,-1,0,1),X=class extends T{constructor(){super(),this.setAttribute("position",new x([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new x([0,2,0,0,2,0],2))}},Ye=new X,G=class{constructor(t){this._mesh=new U(Ye,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Xe)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}},fe=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Pe=`
varying vec2 vUv;
uniform sampler2D tBase;
uniform sampler2D tOverlay;
uniform float uOpacity;

void main() {
  vec4 base = texture2D(tBase, vUv);
  vec4 overlay = texture2D(tOverlay, vUv);
  gl_FragColor = mix(base, overlay, clamp(uOpacity, 0.0, 1.0));
}
`,c=class extends ${opacity=1;material;fsQuad;opacityMaterial;opacityQuad;opacityTarget;constructor(t,e,r={}){super(),this.needsSwap=!0,this.material=new M({vertexShader:fe,fragmentShader:t,uniforms:e,depthTest:!1,depthWrite:!1,toneMapped:r.toneMapped??!1}),this.fsQuad=new G(this.material),this.opacityMaterial=new M({vertexShader:fe,fragmentShader:Pe,uniforms:{tBase:new i(null),tOverlay:new i(null),uOpacity:new i(1)},depthTest:!1,depthWrite:!1,toneMapped:r.toneMapped??!1}),this.opacityQuad=new G(this.opacityMaterial),this.opacityTarget=new E(1,1,{depthBuffer:!1,stencilBuffer:!1})}setSize(t,e){}render(t,e,r,u,l){this.updateUniforms(r);let o=this.renderToScreen?null:e;if(this.opacity>=.999){t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t);return}(this.opacityTarget.width!==r.width||this.opacityTarget.height!==r.height)&&this.opacityTarget.setSize(r.width,r.height),t.setRenderTarget(this.opacityTarget),t.clear(),this.fsQuad.render(t);let a=this.opacityMaterial.uniforms;a.tBase.value=r.texture,a.tOverlay.value=this.opacityTarget.texture,a.uOpacity.value=Math.max(0,Math.min(this.opacity,1)),t.setRenderTarget(o),this.clear&&t.clear(),this.opacityQuad.render(t)}dispose(){this.material.dispose(),this.fsQuad.dispose(),this.opacityMaterial.dispose(),this.opacityQuad.dispose(),this.opacityTarget.dispose()}},Qe=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 vel = fluid.rg;
  vec2 uv = vUv - vel * uIntensity * 0.0003;
  uv = clamp(uv, 0.0, 1.0);
  gl_FragColor = texture2D(tDiffuse, uv);
}
`,he=class extends c{constructor(t){super(Qe,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1)}),this.fluid=t}fluid;intensity=1;updateUniforms(t){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity}},je=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float density = clamp(fluid.b, 0.0, 1.0);
  vec2 vel = fluid.rg;

  float speed = max(length(vel), 1e-4);
  vec2 dir = vel / speed;
  float strength = pow(density, 1.4) * uIntensity * 0.012;
  vec2 shift = dir * strength;

  float r = texture2D(tDiffuse, vUv + shift).r;
  float g = texture2D(tDiffuse, vUv).g;
  float b = texture2D(tDiffuse, vUv - shift).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`,de=class extends c{constructor(t){super(je,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1)}),this.fluid=t}fluid;intensity=1;updateUniforms(t){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity}},Oe=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec2 uTexel;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb * 0.36;
  fluid += texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).rgb * 0.16;

  vec2 vel = fluid.rg;
  float density = clamp(fluid.b, 0.0, 1.0);
  float falloff = pow(density, 1.2);

  vec2 chroma = vel * 0.003 * uIntensity * falloff;
  vec2 distUv = vUv - vel * 0.0002 * uIntensity * falloff;

  vec4 color;
  color.r = texture2D(tDiffuse, distUv + vec2( chroma.x,  chroma.y)).r;
  color.g = texture2D(tDiffuse, distUv + vec2(-chroma.x,  chroma.y)).g;
  color.b = texture2D(tDiffuse, distUv + vec2(-chroma.x, -chroma.y)).b;
  color.a = 1.0;
  gl_FragColor = color;
}
`,me=class extends c{constructor(t){super(Oe,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512))}),this.fluid=t}fluid;intensity=1;updateUniforms(t){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity;let e=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/e.width,1/e.height)}},Je=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec2 uTexel;

void main() {
  float hL = texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).b;
  float hR = texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).b;
  float hD = texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).b;
  float hU = texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).b;
  vec2 normal = vec2(hR - hL, hU - hD);

  vec2 offset = normal * uIntensity * 0.6;
  float r = texture2D(tDiffuse, vUv + offset * 0.95).r;
  float g = texture2D(tDiffuse, vUv + offset).g;
  float b = texture2D(tDiffuse, vUv + offset * 1.05).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`,ye=class extends c{constructor(t){super(Je,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512))}),this.fluid=t}fluid;intensity=1;updateUniforms(t){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity;let e=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/e.width,1/e.height)}},Ze=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uTime;
uniform vec2 uTexel;

float causticWeb(vec2 uv, float t) {
  // The formula degenerates near p = 0 (1/length blows up); the canonical
  // Shadertoy version offsets by a large constant to keep p far from origin.
  const float TAU = 6.28318530718;
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y),
                 sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(
      p.x / (sin(i.x + tt) / inten),
      p.y / (cos(i.y + tt) / inten)
    ));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float hC = fluid.b;
  vec2 vel = fluid.rg;

  float hL = texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).b;
  float hR = texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).b;
  float hD = texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).b;
  float hU = texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).b;
  vec2 normal = vec2(hR - hL, hU - hD);

  vec2 offset = normal * uIntensity * 0.6;
  float r = texture2D(tDiffuse, vUv + offset * 0.95).r;
  float g = texture2D(tDiffuse, vUv + offset).g;
  float b = texture2D(tDiffuse, vUv + offset * 1.05).b;

  // Evaluate the Hoskins/joltz0r field as a small tileable light texture.
  // The fluid only gates/disturbs the light; it should not draw the caustic.
  float surface = smoothstep(0.015, 0.16, hC);
  float slope = smoothstep(0.0015, 0.04, length(normal));
  vec2 cuv = vUv * 4.0 + vel * 0.0012;
  float web = causticWeb(cuv, uTime * 0.5 + 23.0);
  vec3 caustic = clamp(vec3(web) + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
  float energy = pow(web, 1.25) * surface * mix(0.4, 1.0, slope);

  vec3 color = vec3(r, g, b) + caustic * energy * uIntensity * 0.38;
  gl_FragColor = vec4(color, 1.0);
}
`,pe=class extends c{constructor(t){super(Ze,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTime:new i(0),uTexel:new i(new v(1/512,1/512))}),this.fluid=t}fluid;intensity=1;time=0;updateUniforms(t){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity,this.material.uniforms.uTime.value=this.time;let e=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/e.width,1/e.height)}},et=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform vec3 uCursorColor;
uniform float uVibrance;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 vibrant(vec3 col, float v) {
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), col, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float far = 0.0;
  far += length(texture2D(tDye, vUv + uTexel * vec2( 8.0,  0.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2(-8.0,  0.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2( 0.0,  8.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2( 0.0, -8.0)).rgb);
  far *= 0.25;
  float core = smoothstep(0.02, 0.55, far * uIntensity * 4.0);

  vec2 vel = texture2D(tFluid, vUv).rg;
  float kinetic = clamp(length(vel) * 0.02, 0.0, 1.0);

  vec3 hsv = rgb2hsv(uCursorColor);
  float sat = clamp(hsv.y * mix(0.20, 1.0, core) + kinetic * hsv.y * 0.35, 0.0, 1.0);
  float val = hsv.z * mix(0.78, 1.0, core);
  vec3 tint = vibrant(hsv2rgb(vec3(hsv.x, sat, val)), uVibrance);

  float density = clamp(length(dye) * uIntensity * 3.0, 0.0, 0.95);
  gl_FragColor = vec4(mix(scene, tint, density), 1.0);
}
`,xe=class extends c{constructor(t){let e=new w(.85,.95,1);super(et,{tDiffuse:new i(null),tFluid:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uCursorColor:new i(e.clone()),uVibrance:new i(0)}),this.fluid=t,this.cursorColor=e}fluid;intensity=1;vibrance=0;cursorColor;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uCursorColor.value.copy(this.cursorColor),e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},tt=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform vec3 uCursorColor;
uniform float uVibrance;

vec3 vibrant(vec3 col, float v) {
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), col, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float dL = length(texture2D(tDye, vUv - vec2(uTexel.x * 2.0, 0.0)).rgb);
  float dR = length(texture2D(tDye, vUv + vec2(uTexel.x * 2.0, 0.0)).rgb);
  float dD = length(texture2D(tDye, vUv - vec2(0.0, uTexel.y * 2.0)).rgb);
  float dU = length(texture2D(tDye, vUv + vec2(0.0, uTexel.y * 2.0)).rgb);
  vec2 grad = vec2(dR - dL, dU - dD);
  float gmag = length(grad);
  vec2 ndir = grad / max(gmag, 1e-5);

  float lit = dot(ndir, normalize(vec2(-0.6, 0.8)));
  float strength = smoothstep(0.0, 0.04, gmag);
  float shade = mix(1.0, mix(0.78, 1.0, lit * 0.5 + 0.5), strength);

  float density = clamp(length(dye) * uIntensity * 3.0, 0.0, 0.95);
  vec3 tint = vibrant(uCursorColor, uVibrance) * shade;
  gl_FragColor = vec4(mix(scene, tint, density), 1.0);
}
`,ge=class extends c{constructor(t){let e=new w(.85,.95,1);super(tt,{tDiffuse:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uCursorColor:new i(e.clone()),uVibrance:new i(0)}),this.fluid=t,this.cursorColor=e}fluid;intensity=1;vibrance=0;cursorColor;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uCursorColor.value.copy(this.cursorColor),e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},it=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec3 uCursorColor;
uniform float uVibrance;

vec3 vibrant(vec3 col, float v) {
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), col, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 vel = fluid.rg;
  float here = clamp(fluid.b, 0.0, 1.0);

  float tail = 0.0;
  float wsum = 0.0;
  for (float i = 1.0; i < 8.0; i += 1.0) {
    vec2 offset = vel * i * 0.04;
    float w = 1.0 - i / 8.0;
    tail += texture2D(tFluid, vUv - offset).b * w;
    wsum += w;
  }
  tail /= wsum;

  float head = pow(here, 4.0);
  float glow = (tail * 0.7 + head * 1.4) * uIntensity;

  vec3 result = scene + vibrant(uCursorColor, uVibrance) * glow;
  gl_FragColor = vec4(result, 1.0);
}
`,De=class extends c{constructor(t){let e=new w(.85,.95,1);super(it,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uCursorColor:new i(e.clone()),uVibrance:new i(0)}),this.fluid=t,this.cursorColor=e}fluid;intensity=1;vibrance=0;cursorColor;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uCursorColor.value.copy(this.cursorColor),e.uVibrance.value=this.vibrance}},rt=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uTime;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 palette(float t) {
  vec3 ember = vec3(1.0, 0.33, 0.20);
  vec3 mint = vec3(0.08, 0.78, 0.68);
  vec3 cream = vec3(1.0, 0.84, 0.55);
  return mix(mix(ember, cream, smoothstep(0.15, 0.85, t)), mint, smoothstep(0.55, 1.0, t) * 0.42);
}

void main() {
  vec4 scene = texture2D(tDiffuse, vUv);
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float density = clamp(fluid.b, 0.0, 1.0);
  float speed = length(fluid.rg);

  float trail = density;
  for (float i = 1.0; i < 6.0; i += 1.0) {
    vec2 offset = fluid.rg * i * 0.035;
    trail += texture2D(tFluid, vUv - offset).b * (1.0 - i / 7.0);
  }

  float glow = clamp(trail * uIntensity, 0.0, 1.0);
  vec3 color = vibrant(palette(fract(glow * 0.62 + speed * 0.015 + uTime * 0.025)), uVibrance);
  float alpha = clamp(glow * 0.58 + speed * 0.012, 0.0, 0.86);
  vec3 result = scene.rgb + color * alpha * 0.86;
  result = mix(result, color, alpha * 0.14);

  gl_FragColor = vec4(result, 1.0);
}
`,be=class extends c{constructor(t){super(rt,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTime:new i(0),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;time=0;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uTime.value=this.time,e.uVibrance.value=this.vibrance}},st=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tVelocity;
uniform float uIntensity;

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  vec2 raw = texture2D(tVelocity, vUv).xy;
  vec2 vel = raw * 0.04 * uIntensity;
  float len = clamp(length(vel), 0.0, 1.0);
  vel = vel * 1.5 + 0.1;
  vec3 col = vec3(vel.x, vel.y, 1.0);
  gl_FragColor = vec4(scene + col * len, 1.0);
}
`,we=class extends c{constructor(t){super(st,{tDiffuse:new i(null),tVelocity:new i(null),uIntensity:new i(1)}),this.fluid=t}fluid;intensity=1;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tVelocity.value=this.fluid.velocityProjectedTexture,e.uIntensity.value=this.intensity}},lt=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uTime;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 vel = fluid.rg;

  float glow = 0.0;
  vec3 color = vec3(0.0);
  for (float i = 0.0; i < 6.0; i += 1.0) {
    vec2 offset = vel * i * 0.035;
    vec2 origin = vUv - offset;
    float d = texture2D(tFluid, origin).b;
    float w = (1.0 - i / 7.0) * d;
    glow += w;
    float hueA = origin.x * 1.6 + origin.y * 0.9 + uTime * 0.05;
    float hueB = origin.y * 1.2 - origin.x * 0.4 - uTime * 0.03;
    vec3 a = hsv2rgb(vec3(fract(hueA), 0.9, 1.0));
    vec3 b = hsv2rgb(vec3(fract(hueB), 0.85, 0.95));
    color += mix(a, b, 0.5) * w;
  }
  if (glow > 0.0) color /= glow;

  color = vibrant(color, uVibrance);
  float intensity = clamp(glow * uIntensity * 0.55, 0.0, 1.4);
  vec3 result = scene + color * intensity;
  gl_FragColor = vec4(result, 1.0);
}
`,Te=class extends c{constructor(t){super(lt,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTime:new i(0),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;time=0;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uTime.value=this.time,e.uVibrance.value=this.vibrance}},ut=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tVelocity;
uniform float uIntensity;
uniform float uTime;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  vec2 vel = texture2D(tVelocity, vUv).xy * 0.04;
  float speed = length(vel);

  float angle = atan(vel.y, vel.x);
  float hueA = angle / 6.28318 + 0.5 + uTime * 0.05;
  float hueB = vUv.x * 1.2 + vUv.y * 0.8 + uTime * 0.04;

  vec3 a = hsv2rgb(vec3(fract(hueA), 0.92, 1.0));
  vec3 b = hsv2rgb(vec3(fract(hueB), 0.7, 0.95));
  vec3 color = vibrant(mix(a, b, 0.35), uVibrance);

  // pow(s, 2.5) kills the low-speed haze that otherwise tints the whole
  // scene whenever fluid is alive, while preserving bright vortex cores.
  float s = clamp(speed * 8.0, 0.0, 1.0);
  float strength = pow(s, 2.5) * 1.6 * uIntensity;
  vec3 result = scene + color * strength;
  gl_FragColor = vec4(result, 1.0);
}
`,Ue=class extends c{constructor(t){super(ut,{tDiffuse:new i(null),tVelocity:new i(null),uIntensity:new i(1),uTime:new i(0),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;time=0;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tVelocity.value=this.fluid.velocityProjectedTexture,e.uIntensity.value=this.intensity,e.uTime.value=this.time,e.uVibrance.value=this.vibrance}},at=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  float density = clamp(texture2D(tFluid, vUv).b, 0.0, 1.0);
  vec3 tint = vibrant(vec3(1.0, 0.45, 0.22), uVibrance);
  gl_FragColor = vec4(scene + tint * density * uIntensity, 1.0);
}
`,Me=class extends c{constructor(t){super(at,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uVibrance.value=this.vibrance}},nt=`
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uIntensity;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 vel = fluid.rg;

  float fingers = 0.0;
  for (float i = 0.0; i < 5.0; i++) {
    vec2 offset = vel * (i + 1.0) * 0.05;
    float trail = texture2D(tFluid, vUv - offset).b;
    fingers += trail * (1.0 - i / 5.0);
  }
  fingers *= uIntensity;

  vec3 burnColor = vec3(1.0, 0.3, 0.0);
  vec3 emberColor = vec3(0.8, 0.15, 0.0);
  vec3 ghostColor = mix(emberColor, burnColor, clamp(fingers, 0.0, 1.0));

  float tips = pow(clamp(fingers, 0.0, 1.0), 2.0);
  ghostColor += burnColor * tips * 2.0;

  float smoke = fingers * 0.3;
  vec3 smokeColor = vec3(0.1, 0.1, 0.15) * smoke;

  vec3 fireColor = ghostColor + smokeColor;

  float flicker = 0.8 + 0.2 * sin(uTime * 15.0 + fingers * 20.0);
  fireColor *= flicker;

  float alpha = fingers * 0.5 * flicker + smoke * 0.2;
  alpha = clamp(alpha, 0.0, 0.85);

  vec3 result = mix(scene, vibrant(fireColor, uVibrance), alpha);
  gl_FragColor = vec4(result, 1.0);
}
`,Fe=class extends c{constructor(t){super(nt,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(1),uTime:new i(0),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;time=0;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uTime.value=this.time,e.uVibrance.value=this.vibrance}},ot=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float density = clamp(length(dye) * uIntensity * 3.0, 0.0, 0.95);
  vec3 smokeColor = vec3(0.95, 0.97, 1.0);
  gl_FragColor = vec4(mix(scene, smokeColor, density), 1.0);
}
`,Ce=class extends c{constructor(t){super(ot,{tDiffuse:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512))}),this.fluid=t}fluid;intensity=1;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},ct=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  // Stroke colours are stored at ~0.3 amplitude (see attachPointerSplats).
  // The 3.0 gain restores them to a vibrant, saturated look.
  // Vibrance is applied in unit-amplitude space: pull out direction, boost,
  // then re-scale, so the magnitude (= alpha contribution) is preserved.
  float dyeAmp = length(dye);
  vec3 dyeBoosted = dyeAmp > 1e-5
    ? vibrant(dye / dyeAmp, uVibrance) * dyeAmp
    : dye;
  vec3 result = scene + dyeBoosted * uIntensity * 3.0;
  gl_FragColor = vec4(result, 1.0);
}
`,Re=class extends c{constructor(t){super(ct,{tDiffuse:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},vt=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float amp = length(dye);
  if (amp < 1e-4) {
    gl_FragColor = vec4(scene, 1.0);
    return;
  }

  float baseHue = rgb2hsv(dye / amp).x;
  float depth = pow(clamp(amp * 2.5, 0.0, 1.0), 0.7);

  float shiftMag = 0.32 + sin(baseHue * 6.28318 * 3.0) * 0.13;
  float hue = fract(baseHue + (1.0 - depth) * shiftMag);
  float sat = mix(0.75, 1.0, depth);

  vec3 col = vibrant(hsv2rgb(vec3(hue, sat, 1.0)), uVibrance);
  vec3 result = scene + col * depth * uIntensity * 1.2;
  gl_FragColor = vec4(result, 1.0);
}
`,Ve=class extends c{constructor(t){super(vt,{tDiffuse:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},ft=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float density = length(dye);
  vec3 hue = density > 1e-4 ? vibrant(dye / density, uVibrance) : vec3(1.0);
  float alpha = (1.0 - exp(-density * uIntensity * 3.0)) * 0.72;

  vec3 wash = mix(scene, hue * 1.1, alpha);
  vec3 result = wash + scene * hue * alpha * 0.35;
  gl_FragColor = vec4(result, 1.0);
}
`,Se=class extends c{constructor(t){super(ft,{tDiffuse:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},ht=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tVelocity;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  vec2 vel = texture2D(tVelocity, vUv).xy * 0.04;
  float density = length(dye);
  float refractGate = clamp(density * 4.0, 0.0, 1.0);
  vec2 distortedUv = vUv + vel * refractGate * 0.012;
  vec3 scene = texture2D(tDiffuse, distortedUv).rgb;

  float dyeAmp = length(dye);
  vec3 dyeBoosted = dyeAmp > 1e-5
    ? vibrant(dye / dyeAmp, uVibrance) * dyeAmp
    : dye;
  vec3 tint = min(dyeBoosted * uIntensity * 1.4, vec3(1.6));
  vec3 result = scene + scene * tint;

  gl_FragColor = vec4(result, 1.0);
}
`,Ie=class extends c{constructor(t){super(ht,{tDiffuse:new i(null),tVelocity:new i(null),tDye:new i(null),uIntensity:new i(1),uTexel:new i(new v(1/512,1/512)),uVibrance:new i(0)}),this.fluid=t}fluid;intensity=1;vibrance=0;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tVelocity.value=this.fluid.velocityTexture,e.tDye.value=this.fluid.dyeTexture,e.uIntensity.value=this.intensity,e.uVibrance.value=this.vibrance;let r=this.fluid.dyeTexture.image;e.uTexel.value.set(1/r.width,1/r.height)}},dt=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec3 uTint;

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;
  float density = clamp(texture2D(tFluid, vUv).b, 0.0, 1.0);
  gl_FragColor = vec4(scene + uTint * density * uIntensity, 1.0);
}
`,Ee=class extends c{constructor(t){let e=new w(.1,.42,.36);super(dt,{tDiffuse:new i(null),tFluid:new i(null),uIntensity:new i(.14),uTint:new i(e.clone())}),this.fluid=t,this.color=e}fluid;intensity=.14;color;updateUniforms(t){let e=this.material.uniforms;e.tDiffuse.value=t.texture,e.tFluid.value=this.fluid.densityTexture,e.uIntensity.value=this.intensity,e.uTint.value.copy(this.color)}};export{Re as ArtInkOverlayPass,Fe as BurnOverlayPass,me as ChromaticDistortionPass,Se as ColorWaterOverlayPass,Te as ColorfulOverlayPass,xe as DefaultOverlayPass,Ee as DensityTintOverlayPass,$e as FLUID_PROFILES,pt as FULLSCREEN_VERTEX,c as FluidEffectPass,oe as FluidSimulation,ve as FullscreenPass,Me as GlazeOverlayPass,Ie as LiquidLensOverlayPass,be as OilOverlayPass,de as RGBShiftDistortionPass,Ue as RainbowFishOverlayPass,Ve as RainbowInkOverlayPass,he as SimpleDistortionPass,Ce as SmokeOverlayPass,De as TrailOverlayPass,we as VelocityOverlayPass,ge as VolumeCursorOverlayPass,pe as WaterCausticsDistortionPass,ye as WaterDistortionPass,yt as attachPointerSplats,xt as createSceneTarget};
