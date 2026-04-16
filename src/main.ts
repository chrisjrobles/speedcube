import "cubing/twisty"; // registers <twisty-player> custom element
import { generateScramble } from "./scramble";
import { createTimer } from "./timer";
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
let scrambleTimeout: ReturnType<typeof setTimeout> | null = null;

const cubeDisplay = document.querySelector<HTMLElement>("#cube-display")!;
const scrambleText = document.getElementById("scramble-text")!;
scrambleText.style.cursor = "pointer";
scrambleText.title = "Click to copy";
scrambleText.addEventListener("click", () => {
  if (!currentScramble) return;
  navigator.clipboard.writeText(currentScramble).then(() => {
    const original = scrambleText.textContent;
    scrambleText.textContent = "Copied!";
    setTimeout(() => {
      scrambleText.textContent = original;
    }, 1000);
  });
});

function updateScrambleDisplay(scramble: string) {
  currentScramble = scramble;
  renderScrambleText(scramble);
  cubeDisplay.setAttribute("alg", scramble);
}

async function newScramble() {
  const scramble = await generateScramble();
  updateScrambleDisplay(scramble);
}

function refreshUI() {
  renderStats(computeAllStats(solves));
  renderSolvesList(solves, handleDelete, updateScrambleDisplay);
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
    if (scrambleTimeout) clearTimeout(scrambleTimeout);
    scrambleTimeout = setTimeout(() => {
      scrambleTimeout = null;
      timer.reset();
      newScramble();
    }, 300);
  },
});

// Bind touch events for mobile
timer.bindTouch(document.querySelector(".timer-section")!);

// New Scramble button
document.getElementById("new-scramble")!.addEventListener("click", () => {
  newScramble();
});

// Custom scramble input
document.getElementById("apply-scramble")!.addEventListener("click", () => {
  const input = document.getElementById(
    "custom-scramble-input",
  ) as HTMLInputElement;
  const value = input.value.trim();
  if (value) {
    updateScrambleDisplay(value);
    input.value = "";
  }
});

document
  .getElementById("custom-scramble-input")!
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("apply-scramble")!.click();
    }
  });

// Clear session
document.getElementById("clear-session")!.addEventListener("click", () => {
  if (solves.length === 0) return;
  if (!confirm(`Clear all ${solves.length} solves?`)) return;
  clearAllSolves();
  solves = [];
  refreshUI();
});

// Initialize
refreshUI();
updateScrambleDisplay("U2 D2 F2 B2 L2 R2");
