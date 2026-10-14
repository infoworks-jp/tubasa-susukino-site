import * as THREE from "three";

// Stored artwork, not runtime generation. The mask protects drawn ink in the
// normal/depth post-process and remains an ordinary textured mesh in GLB.
export async function loadArtwork(url) {
  const texture = await new THREE.TextureLoader().loadAsync(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
export function inkMaterial(texture) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  material.userData.illustrated = true;
  return material;
}
export function markArtwork(geometry) {
  geometry.setAttribute(
    "inkArtwork",
    new THREE.Float32BufferAttribute(
      new Float32Array(geometry.attributes.position.count).fill(1),
      1,
    ),
  );
  return geometry;
}
export function artworkPlane(texture, width, height, rect) {
  const g = markArtwork(new THREE.PlaneGeometry(width, height));
  const [x0, y0, x1, y1] = rect,
    w = texture.image.width,
    h = texture.image.height;
  g.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(
      [
        x0 / w,
        1 - y0 / h,
        x1 / w,
        1 - y0 / h,
        x0 / w,
        1 - y1 / h,
        x1 / w,
        1 - y1 / h,
      ],
      2,
    ),
  );
  return new THREE.Mesh(g, inkMaterial(texture));
}
export function outlinedBox(group, size, position, color = 0xe5e3dc) {
  const geometry = new THREE.BoxGeometry(...size),
    material = new THREE.MeshStandardMaterial({ color, roughness: 1 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x222222 }),
  );
  mesh.add(edges);
  return mesh;
}
