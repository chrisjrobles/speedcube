import type { Solve } from "./types";

const STORAGE_KEY = "speedcube-solves";

export function loadSolves(): Solve[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Solve[];
  } catch {
    return [];
  }
}

function saveSolves(solves: Solve[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solves));
}

export function addSolve(solve: Solve): Solve[] {
  const solves = loadSolves();
  solves.push(solve);
  saveSolves(solves);
  return solves;
}

export function deleteSolve(id: string): Solve[] {
  const solves = loadSolves().filter((s) => s.id !== id);
  saveSolves(solves);
  return solves;
}

export function clearAllSolves(): void {
  localStorage.removeItem(STORAGE_KEY);
}
