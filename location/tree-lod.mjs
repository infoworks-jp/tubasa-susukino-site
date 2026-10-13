import * as THREE from "three";
// Exported trees are all LOD0. Restore a camera-distance budget for display.
export function makeTreeLOD(highRoot, lowRoot) {
  const entries = [],
    pairs = [];
  highRoot.updateMatrixWorld(true);
  lowRoot.updateMatrixWorld(true);
  highRoot.traverse((high) => {
    if (!high.isInstancedMesh || !high.name.startsWith("tree_")) return;
    const low = lowRoot.getObjectByName(high.name);
    if (!low?.isInstancedMesh || low.count !== high.count) return;
    high.geometry.computeBoundingBox();
    high.geometry.computeBoundingSphere();
    const center = high.geometry.boundingBox.getCenter(new THREE.Vector3());
    const pair = { high, low, highMatrices: [], lowMatrices: [] };
    pairs.push(pair);
    for (let i = 0; i < high.count; i++) {
      const hm = new THREE.Matrix4(),
        lm = new THREE.Matrix4();
      high.getMatrixAt(i, hm);
      low.getMatrixAt(i, lm);
      if (Math.abs(hm.determinant()) < 1e-20)
        lm.scale(new THREE.Vector3(1e-8, 1e-8, 1e-8));
      pair.highMatrices.push(hm);
      pair.lowMatrices.push(lm);
      if (Math.abs(hm.determinant()) < 1e-20) continue;
      const point = center
        .clone()
        .applyMatrix4(hm)
        .applyMatrix4(high.matrixWorld);
      entries.push({
        pair,
        index: i,
        point,
        vertices: high.geometry.attributes.position.count,
        radius:
          high.geometry.boundingSphere.radius *
          hm.getMaxScaleOnAxis() *
          high.matrixWorld.getMaxScaleOnAxis(),
      });
    }
  });
  let key = "";
  const update = (camera) => {
    const next = [
      Math.round(camera.position.x / 8),
      Math.round(camera.position.y / 8),
      Math.round(camera.position.z / 8),
    ].join(",");
    if (next === key) return false;
    key = next;
    camera.updateMatrixWorld();
    const frustum = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      ),
    );
    const visible = new Set(
      entries.filter((e) =>
        frustum.intersectsSphere(new THREE.Sphere(e.point, e.radius)),
      ),
    );
    const selected = new Set();
    let budget = 0;
    const candidates = [...visible]
      .map((e) => ({ e, d: e.point.distanceTo(camera.position) }))
      .sort((a, b) => a.d - b.d);
    for (const { e, d } of candidates) {
      if (d > 100) break;
      if (budget + e.vertices > 2500000) continue;
      selected.add(e);
      budget += e.vertices;
    }
    for (const pair of pairs) {
      pair.high.count = 0;
      pair.low.count = 0;
    }
    for (const e of visible) {
      const near = selected.has(e),
        { pair, index } = e;
      if (near)
        pair.high.setMatrixAt(pair.high.count++, pair.highMatrices[index]);
      else pair.low.setMatrixAt(pair.low.count++, pair.lowMatrices[index]);
    }
    for (const { high, low } of pairs) {
      high.instanceMatrix.needsUpdate = true;
      low.instanceMatrix.needsUpdate = true;
    }
    document.documentElement.dataset.treeDetailVertices = String(budget);
    document.documentElement.dataset.treeDrawVertices = String(
      pairs.reduce(
        (sum, p) =>
          sum + p.high.count * p.high.geometry.attributes.position.count,
        0,
      ),
    );
    return true;
  };
  update.fullDetail = () => {
    for (const pair of pairs) {
      pair.low.visible = false;
      pair.high.count = 0;
    }
    for (const { pair, index } of entries)
      pair.high.setMatrixAt(pair.high.count++, pair.highMatrices[index]);
    for (const pair of pairs) pair.high.instanceMatrix.needsUpdate = true;
  };
  update.reset = () => {
    key = "";
    for (const pair of pairs) pair.low.visible = true;
  };
  return update;
}
