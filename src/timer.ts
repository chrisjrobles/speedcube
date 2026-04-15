import type { TimerState } from "./types";

export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
  }
  return seconds.toFixed(3);
}

interface TimerCallbacks {
  onStateChange: (state: TimerState) => void;
  onTick: (elapsed: number) => void;
  onStop: (elapsed: number) => void;
}

export function createTimer(callbacks: TimerCallbacks) {
  let state: TimerState = "idle";
  let startTime = 0;
  let rafId = 0;

  function tick() {
    callbacks.onTick(performance.now() - startTime);
    rafId = requestAnimationFrame(tick);
  }

  function isInputFocused(): boolean {
    const tag = document.activeElement?.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code !== "Space" || e.repeat || isInputFocused()) return;
    e.preventDefault();

    if (state === "idle" || state === "stopped") {
      state = "ready";
      callbacks.onStateChange(state);
    } else if (state === "running") {
      cancelAnimationFrame(rafId);
      const elapsed = performance.now() - startTime;
      state = "stopped";
      callbacks.onStateChange(state);
      callbacks.onStop(elapsed);
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.code !== "Space" || isInputFocused()) return;
    e.preventDefault();

    if (state === "ready") {
      startTime = performance.now();
      state = "running";
      callbacks.onStateChange(state);
      rafId = requestAnimationFrame(tick);
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return {
    getState: () => state,
    reset() {
      state = "idle";
      cancelAnimationFrame(rafId);
      callbacks.onStateChange(state);
    },
    destroy() {
      cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    },
  };
}
