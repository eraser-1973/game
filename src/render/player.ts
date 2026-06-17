import * as THREE from "three";

export function createPlayer(): THREE.Group {
  const player = new THREE.Group();
  player.name = "Field Coordinator";

  const coatMaterial = new THREE.MeshStandardMaterial({ color: "#f2c94c", roughness: 0.72 });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: "#1d6f9f", roughness: 0.8 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: "#f0c6a6", roughness: 0.65 });
  const bootMaterial = new THREE.MeshStandardMaterial({ color: "#24313f", roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.72, 4, 8), coatMaterial);
  body.position.y = 0.98;
  body.scale.set(0.85, 1, 0.78);
  player.add(body);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), coatMaterial);
  hood.position.y = 1.58;
  hood.scale.set(1, 0.9, 0.9);
  player.add(hood);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), skinMaterial);
  face.position.set(0, 1.55, 0.16);
  face.scale.set(0.9, 0.96, 0.7);
  player.add(face);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.31, 16, 10), hairMaterial);
  hair.position.set(0, 1.64, 0.03);
  hair.scale.set(1.02, 0.82, 0.72);
  player.add(hair);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.2), bootMaterial);
  leftBoot.position.set(-0.13, 0.24, 0.02);
  player.add(leftBoot);

  const rightBoot = leftBoot.clone();
  rightBoot.position.x = 0.13;
  player.add(rightBoot);

  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.48, 4, 8), coatMaterial);
  leftArm.position.set(-0.4, 1.03, 0.02);
  leftArm.rotation.z = -0.18;
  player.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.4;
  rightArm.rotation.z = 0.18;
  player.add(rightArm);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 8, 18), hairMaterial);
  collar.position.set(0, 1.32, 0.08);
  collar.rotation.x = Math.PI / 2;
  player.add(collar);

  player.position.set(-5, 0, 2.7);
  return player;
}
