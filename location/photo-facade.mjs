import * as THREE from "three";
const photoShaders = new WeakMap();
export function setPhotoMode(material, mode, ratio) {
  material.userData.mode = mode;
  const shader = photoShaders.get(material);
  if (shader) {
    shader.uniforms.photoMono.value =
      mode === "line" || mode === "tone" ? 1 : 0;
    shader.uniforms.photoTone.value = mode === "tone" ? 1 : 0;
    shader.uniforms.photoPitch.value = 5 * ratio;
  }
}
// Source-photo UV quadrilaterals preserve the real lettering and proportions.
// These are shallow facade surfaces, not invented indoor geometry.
export async function addPhotoFacade(group) {
  const texture = await new THREE.TextureLoader().loadAsync(
    "./assets/yokocho-authorized.jpg",
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  const materials = [];
  function panel(name, w, h, x, y, z, corners) {
    const xs = corners.map((p) => p[0]),
      ys = corners.map((p) => p[1]);
    const scale = 3.2 / 198;
    const cx = xs.reduce((a, b) => a + b, 0) / 4,
      cy = ys.reduce((a, b) => a + b, 0) / 4;
    x = (888 - cx) * scale;
    y = (575 - cy) * scale;
    w = (Math.max(...xs) - Math.min(...xs)) * scale;
    h = (Math.max(...ys) - Math.min(...ys)) * scale;
    const g = new THREE.PlaneGeometry(w, h);
    // PlaneGeometry order: top left, top right, bottom left, bottom right.
    g.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(
        corners.flatMap(([u, v]) => [u / 1321, 1 - v / 979]),
        2,
      ),
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    material.userData.mode = "color";
    material.onBeforeCompile = (shader) => {
      shader.uniforms.photoMono = {
        value:
          material.userData.mode === "line" || material.userData.mode === "tone"
            ? 1
            : 0,
      };
      shader.uniforms.photoTone = {
        value: material.userData.mode === "tone" ? 1 : 0,
      };
      shader.uniforms.photoPitch = {
        value: 5 * Math.min(devicePixelRatio, 1.6),
      };
      photoShaders.set(material, shader);
      shader.fragmentShader =
        "uniform float photoMono,photoTone,photoPitch;\n" +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `#include <map_fragment>
      if(photoMono>.5){
        vec2 stepUV=vec2(1./1321.,1./979.);
        float c=dot(texture2D(map,vMapUv).rgb,vec3(.299,.587,.114));
        float gx=dot(texture2D(map,vMapUv+vec2(stepUV.x,0.)).rgb-texture2D(map,vMapUv-vec2(stepUV.x,0.)).rgb,vec3(.299,.587,.114));
        float gy=dot(texture2D(map,vMapUv+vec2(0.,stepUV.y)).rgb-texture2D(map,vMapUv-vec2(0.,stepUV.y)).rgb,vec3(.299,.587,.114));
        float mean=0.;
        for(int j=0;j<4;j++){
          vec2 shift=j==0?vec2(4.*stepUV.x,0.):j==1?vec2(-4.*stepUV.x,0.):j==2?vec2(0.,4.*stepUV.y):vec2(0.,-4.*stepUV.y);
          mean+=dot(texture2D(map,vMapUv+shift).rgb,vec3(.299,.587,.114))*.25;
        }
        float line=smoothstep(.055,.16,length(vec2(gx,gy)));
        float stroke=smoothstep(.025,.09,mean-c);
        float ink=max(line,stroke);
        if(photoTone>.5){
          float density=clamp((.78-pow(max(c,0.),1./2.2))*.20,0.,.12);
          vec2 q=fract(gl_FragCoord.xy/photoPitch)-.5;
          float r=sqrt(density/3.14159265),a=max(fwidth(length(q)),.025);
          ink=max(ink,1.-smoothstep(r-a,r+a,length(q)));
        }
        if(vMapUv.x>788./1321.&&vMapUv.x<987./1321.&&vMapUv.y<1.-314./979.&&vMapUv.y>1.-465./979.)ink=max(ink,1.-smoothstep(.10,.32,c));
        // Preserve the verified doorway opening, while photographic shadow
        // regions elsewhere are tone instead of large solid-black rectangles.
        if(vMapUv.x>790./1321.&&vMapUv.x<986./1321.&&vMapUv.y<1.-467./979.&&vMapUv.y>1.-575./979.)ink=max(ink,1.-smoothstep(.035,.13,c));
        diffuseColor.rgb=mix(vec3(1.),vec3(.003),ink);
      }`,
      );
    };
    const mesh = new THREE.Mesh(g, material);
    mesh.rotation.y = Math.PI;
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.userData.source =
      "User photograph; reuse permission confirmed 2026-10-14";
    group.add(mesh);
    materials.push(material);
  }
  panel("Photograph: north frontage", 16, 9.3, 5.5, 4.65, -0.7, [
    [105, 0],
    [1050, 0],
    [105, 575],
    [1050, 575],
  ]);
  panel("Photograph: Shin Ramen Yokocho sign", 3.2, 2.4, 0, 4, -0.72, [
    [790, 321],
    [986, 314],
    [788, 463],
    [987, 465],
  ]);
  panel("Photograph: Lake broad sign", 6, 1.7, 9, 6.1, -0.72, [
    [108, 139],
    [493, 126],
    [108, 218],
    [493, 207],
  ]);
  panel("Photograph: Uosen Suisan sign", 6, 2.2, 9, 8.2, -0.72, [
    [105, 0],
    [493, 0],
    [105, 132],
    [493, 118],
  ]);
  panel("Photograph: Torikizoku sign", 2.2, 1, 3.4, 6.6, -0.72, [
    [619, 139],
    [697, 116],
    [619, 195],
    [697, 182],
  ]);
  panel("Photograph: Lake corner sign", 2.2, 1.1, 3.4, 5.5, -0.73, [
    [619, 207],
    [696, 188],
    [618, 247],
    [697, 242],
  ]);
  panel("Photograph: blue upper sign", 4, 3, -0.5, 8.5, -0.74, [
    [779, 0],
    [1050, 0],
    [779, 188],
    [1050, 180],
  ]);
  panel(
    "Photograph: neighboring restaurant frontage",
    3.5,
    4.5,
    3.4,
    2.2,
    -0.74,
    [
      [583, 322],
      [783, 318],
      [586, 569],
      [782, 567],
    ],
  );
  return materials;
}
