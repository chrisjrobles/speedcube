import type { Solve, Stats, TimerState } from "./types";
import { formatTime } from "./timer";

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

export function renderStats(stats: Stats): void {
  $("stat-best").textContent = stats.best !== null ? formatTime(stats.best) : "-";
  $("stat-ao5").textContent = stats.ao5 !== null ? formatTime(stats.ao5) : "-";
  $("stat-ao12").textContent = stats.ao12 !== null ? formatTime(stats.ao12) : "-";
  $("stat-ao100").textContent = stats.ao100 !== null ? formatTime(stats.ao100) : "-";
  $("stat-avg").textContent = stats.sessionAvg !== null ? formatTime(stats.sessionAvg) : "-";
  $("stat-count").textContent = String(stats.count);
}

export function renderSolvesList(
  solves: Solve[],
  onDelete: (id: string) => void
): void {
  const container = $("solves-list");
  container.innerHTML = "";

  // Show most recent first
  const reversed = [...solves].reverse();
  for (let i = 0; i < reversed.length; i++) {
    const solve = reversed[i];
    const row = document.createElement("div");
    row.className = "solve-row";

    const index = document.createElement("span");
    index.className = "solve-index";
    index.textContent = `${solves.length - i}.`;

    const time = document.createElement("span");
    time.className = "solve-time";
    if (solve.penalty === "DNF") {
      time.textContent = "DNF";
    } else if (solve.penalty === "+2") {
      time.textContent = formatTime(solve.time + 2000) + "+";
    } else {
      time.textContent = formatTime(solve.time);
    }

    const scramble = document.createElement("span");
    scramble.className = "solve-scramble";
    scramble.textContent = solve.scramble;
    scramble.title = solve.scramble;

    const del = document.createElement("button");
    del.className = "solve-delete";
    del.textContent = "\u00d7";
    del.title = "Delete solve";
    del.addEventListener("click", () => onDelete(solve.id));

    row.append(index, time, scramble, del);
    container.appendChild(row);
  }
}

export function renderTimerDisplay(ms: number): void {
  $("timer-display").textContent = formatTime(ms);
}

export function setTimerState(state: TimerState): void {
  const el = $("timer-display");
  el.classList.remove("ready", "running", "stopped");
  if (state !== "idle") {
    el.classList.add(state);
  }
}

export function renderScrambleText(scramble: string): void {
  $("scramble-text").textContent = scramble;
}
