import * as THREE from "three";

export function updateFollowCamera(
  camera: THREE.PerspectiveCamera,
  target: THREE.Object3D,
  delta: number,
) {
  const desiredPosition = target.position.clone().add(new THREE.Vector3(0, 4.1, 6.3));
  camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 5));
  camera.lookAt(target.position.x, target.position.y + 1.1, target.position.z);
}
