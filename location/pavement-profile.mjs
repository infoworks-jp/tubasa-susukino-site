import * as THREE from "three";
import { routeBuildings } from "./route-facades.mjs";

export function samplePavementProfile(imported) {
  imported.updateMatrixWorld(true);
  let walk;
  imported.traverse((o) => {
    if (o.name === "walk") walk = o;
  });
  if (!walk) throw new Error("Mapped walk mesh missing");
  const a = [-50.3, -9.7],
    b = [33.93, -25.42],
    dx = b[0] - a[0],
    dz = b[1] - a[1],
    length = Math.hypot(dx, dz),
    n = [dz / length, -dx / length],
    ray = new THREE.Raycaster();
  const count = Math.ceil(length / 0.9),
    samples = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count,
      x = a[0] + dx * t;
    const frontage = [
      a,
      ...routeBuildings.flatMap((b) => b.ring.slice(0, 2)),
      b,
    ].sort((a, b) => a[0] - b[0]);
    let z = a[1] + dz * t;
    for (let k = 0; k < frontage.length - 1; k++)
      if (
        x >= frontage[k][0] &&
        x <= frontage[k + 1][0] &&
        frontage[k + 1][0] > frontage[k][0]
      ) {
        const f = (x - frontage[k][0]) / (frontage[k + 1][0] - frontage[k][0]);
        z = frontage[k][1] + f * (frontage[k + 1][1] - frontage[k][1]);
        break;
      }
    let width = null,
      seen = false;
    for (let d = 0.25; d <= 18; d += 0.125) {
      ray.set(
        new THREE.Vector3(x + n[0] * d, 1, z + n[1] * d),
        new THREE.Vector3(0, -1, 0),
      );
      const hit = ray.intersectObject(walk, false).length > 0;
      if (hit) {
        seen = true;
        width = d;
      } else if (seen) break;
    }
    if (width === null || width === 18)
      throw new Error("No complete mapped sidewalk edge at route station " + i);
    samples.push({ x, z, width });
  }
  return { samples, n, length };
}
