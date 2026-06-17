export type KeyboardState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
};

export type KeyboardController = {
  state: KeyboardState;
  dispose: () => void;
};

export function createKeyboardController(onInteract: () => void): KeyboardController {
  const state: KeyboardState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
  };

  const setKey = (code: string, active: boolean) => {
    if (code === "KeyW" || code === "ArrowUp") state.forward = active;
    if (code === "KeyS" || code === "ArrowDown") state.backward = active;
    if (code === "KeyA" || code === "ArrowLeft") state.left = active;
    if (code === "KeyD" || code === "ArrowRight") state.right = active;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    setKey(event.code, true);
    if (event.code === "KeyE" || event.code === "Space") {
      event.preventDefault();
      state.interact = true;
      onInteract();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setKey(event.code, false);
    if (event.code === "KeyE" || event.code === "Space") {
      state.interact = false;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    state,
    dispose: () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    },
  };
}
