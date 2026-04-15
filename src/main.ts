import "cubing/twisty"; // registers <twisty-player> custom element
import { generateScramble } from "./scramble";
import { createTimer, formatTime } from "./timer";
import { loadSolves, addSolve, deleteSolve, clearAllSolves } from "./store";
import { computeAllStats } from "./stats";
import {
  renderStats,
  renderSolvesList,
  renderTimerDisplay,
  setTimerState,
  renderScrambleText,
} from "./ui";
import type { Solve } from "./types";
import "./style.css";

let currentScramble = "";
let solves = loadSolves();

const cubeDisplay = document.querySelector<HTMLElement>("#cube-display")!;

function updateScrambleDisplay(scramble: string) {
  currentScramble = scramble;
  renderScrambleText(scramble);
  cubeDisplay.setAttribute("alg", scramble);
}

async function newScramble() {
  renderScrambleText("Generating...");
  const scramble = await generateScramble();
  updateScrambleDisplay(scramble);
}

function refreshUI() {
  renderStats(computeAllStats(solves));
  renderSolvesList(solves, handleDelete);
}

function handleDelete(id: string) {
  solves = deleteSolve(id);
  refreshUI();
}

// Timer
const timer = createTimer({
  onStateChange(state) {
    setTimerState(state);
    if (state === "ready") {
      renderTimerDisplay(0);
    }
  },
  onTick(elapsed) {
    renderTimerDisplay(elapsed);
  },
  onStop(elapsed) {
    renderTimerDisplay(elapsed);
    const solve: Solve = {
      id: crypto.randomUUID(),
      time: elapsed,
      scramble: currentScramble,
      timestamp: Date.now(),
    };
    solves = addSolve(solve);
    refreshUI();
    // Auto-generate next scramble after a short delay
    setTimeout(() => {
      timer.reset();
      newScramble();
    }, 300);
  },
});

// New Scramble button
document.getElementById("new-scramble")!.addEventListener("click", () => {
  newScramble();
});

// Custom scramble input
document.getElementById("apply-scramble")!.addEventListener("click", () => {
  const input = document.getElementById("custom-scramble-input") as HTMLInputElement;
  const value = input.value.trim();
  if (value) {
    updateScrambleDisplay(value);
    input.value = "";
  }
});

document.getElementById("custom-scramble-input")!.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("apply-scramble")!.click();
  }
});

// Clear session
document.getElementById("clear-session")!.addEventListener("click", () => {
  if (solves.length === 0) return;
  clearAllSolves();
  solves = [];
  refreshUI();
});

// Initialize
refreshUI();
newScramble();
