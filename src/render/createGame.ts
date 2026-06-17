import * as THREE from "three";
import type { AssessmentStage } from "../game/content/assessment";
import { createKeyboardController } from "../game/input/keyboard";
import { updateFollowCamera } from "./camera";
import { createPlayer } from "./player";
import { createWorld, updateStationFocus, type Station } from "./world";

export type GameView = {
  setCurrentStage: (stageIndex: number, completed: boolean) => void;
  dispose: () => void;
};

export function createGame(
  container: HTMLElement,
  stages: AssessmentStage[],
  onNearestStationChange: (stationIndex: number | null) => void,
  onInteract: (stationIndex: number | null) => void,
): GameView {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight("#c8e7ff", 0.68);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight("#fff2cc", 1.6);
  moon.position.set(-4, 8, 5);
  moon.castShadow = true;
  scene.add(moon);

  const stations = createWorld(scene, stages);
  const player = createPlayer();
  scene.add(player);

  let currentStageIndex = 0;
  let completed = false;
  let nearestStation: number | null = null;
  const clock = new THREE.Clock();

  const keyboard = createKeyboardController(() => {
    onInteract(nearestStation);
  });

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
  };

  window.addEventListener("resize", handleResize);
  renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.05);
    movePlayer(player, keyboard.state, delta);
    nearestStation = findNearestStation(player.position, stations, currentStageIndex, completed);
    onNearestStationChange(nearestStation);
    pulseStations(stations, clock.elapsedTime);
    updateFollowCamera(camera, player, delta);
    renderer.render(scene, camera);
  });

  updateStationFocus(stations, currentStageIndex, completed);

  return {
    setCurrentStage: (stageIndex: number, isCompleted: boolean) => {
      currentStageIndex = stageIndex;
      completed = isCompleted;
      updateStationFocus(stations, currentStageIndex, completed);
    },
    dispose: () => {
      renderer.setAnimationLoop(null);
      keyboard.dispose();
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function movePlayer(
  player: THREE.Group,
  keys: { forward: boolean; backward: boolean; left: boolean; right: boolean },
  delta: number,
) {
  const direction = new THREE.Vector3(
    Number(keys.right) - Number(keys.left),
    0,
    Number(keys.backward) - Number(keys.forward),
  );

  if (direction.lengthSq() === 0) {
    return;
  }

  direction.normalize();
  player.position.addScaledVector(direction, delta * 3.2);
  player.position.x = THREE.MathUtils.clamp(player.position.x, -7.2, 7.2);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -5.9, 5.2);
  player.rotation.y = Math.atan2(direction.x, direction.z);
}

function findNearestStation(
  playerPosition: THREE.Vector3,
  stations: Station[],
  currentStageIndex: number,
  completed: boolean,
): number | null {
  if (completed) {
    return null;
  }

  const station = stations[currentStageIndex];
  if (!station) {
    return null;
  }

  return playerPosition.distanceTo(station.position) < 1.75 ? station.index : null;
}

function pulseStations(stations: Station[], elapsed: number) {
  for (const station of stations) {
    station.ring.scale.setScalar(1 + Math.sin(elapsed * 2.4 + station.index) * 0.025);
  }
}
