import * as THREE from "three";
import type { AssessmentStage } from "../game/content/assessment";

export type Station = {
  index: number;
  stageId: string;
  group: THREE.Group;
  position: THREE.Vector3;
  ring: THREE.Mesh;
  beacon: THREE.PointLight;
};

const stationPositions = [
  new THREE.Vector3(-5, 0, -3.6),
  new THREE.Vector3(-2.4, 0, -5.2),
  new THREE.Vector3(1.1, 0, -5.1),
  new THREE.Vector3(4.2, 0, -3.2),
  new THREE.Vector3(5.2, 0, 0.6),
];

export function createWorld(scene: THREE.Scene, stages: AssessmentStage[]): Station[] {
  scene.background = new THREE.Color("#111820");
  scene.fog = new THREE.Fog("#111820", 10, 32);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14, 1, 1),
    new THREE.MeshStandardMaterial({ color: "#26313a", roughness: 0.88, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(18, 18, "#66808f", "#34444f");
  grid.position.y = 0.01;
  scene.add(grid);

  addCityBackdrop(scene);

  return stages.map((stage, index) => createStation(stage, index, scene));
}

export function updateStationFocus(stations: Station[], currentStageIndex: number, completed: boolean) {
  for (const station of stations) {
    const material = station.ring.material as THREE.MeshStandardMaterial;
    const available = station.index === currentStageIndex && !completed;
    const finished = station.index < currentStageIndex || completed;
    material.color.set(available ? "#f2c94c" : finished ? "#5bd8a6" : "#5f7182");
    material.emissive.set(available ? "#8a5c00" : finished ? "#103d2d" : "#111820");
    station.beacon.intensity = available ? 2.2 : finished ? 0.8 : 0.35;
  }
}

function createStation(stage: AssessmentStage, index: number, scene: THREE.Scene): Station {
  const group = new THREE.Group();
  const position = stationPositions[index] ?? new THREE.Vector3(index * 1.6, 0, -3);
  group.position.copy(position);

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: "#1c2733",
    metalness: 0.25,
    roughness: 0.62,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: "#5f7182",
    emissive: "#111820",
    emissiveIntensity: 0.7,
  });

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.42, 6), baseMaterial);
  pedestal.position.y = 0.21;
  group.add(pedestal);

  const terminal = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.14), accentMaterial);
  terminal.position.set(0, 0.72, 0);
  terminal.rotation.x = -0.25;
  group.add(terminal);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.035, 8, 36), accentMaterial.clone());
  ring.position.y = 0.04;
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const beacon = new THREE.PointLight("#f2c94c", 0.35, 4);
  beacon.position.set(0, 1.2, 0);
  group.add(beacon);

  group.name = stage.stationLabel;
  scene.add(group);

  return {
    index,
    stageId: stage.id,
    group,
    position,
    ring,
    beacon,
  };
}

function addCityBackdrop(scene: THREE.Scene) {
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: "#1a2430",
    roughness: 0.9,
    metalness: 0.12,
  });
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: "#63cdda",
    emissive: "#1b6f7a",
    emissiveIntensity: 0.8,
  });

  for (let index = 0; index < 24; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const depth = -6.8 + (index % 6) * 2.2;
    const height = 1.8 + (index % 5) * 0.55;
    const building = new THREE.Mesh(new THREE.BoxGeometry(0.9, height, 0.8), buildingMaterial);
    building.position.set(side * (7.2 + (index % 3) * 0.4), height / 2, depth);
    scene.add(building);

    const window = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.04), windowMaterial);
    window.position.set(building.position.x - side * 0.46, Math.min(height - 0.45, 1.1), depth);
    window.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    scene.add(window);
  }
}
