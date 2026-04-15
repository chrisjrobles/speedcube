import type { Solve, Stats } from "./types";

function effectiveTime(solve: Solve): number | null {
  if (solve.penalty === "DNF") return null;
  if (solve.penalty === "+2") return solve.time + 2000;
  return solve.time;
}

export function bestTime(solves: Solve[]): number | null {
  let best: number | null = null;
  for (const s of solves) {
    const t = effectiveTime(s);
    if (t !== null && (best === null || t < best)) {
      best = t;
    }
  }
  return best;
}

export function averageOfN(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null;

  const window = solves.slice(-n);
  const times = window.map(effectiveTime);
  const dnfCount = times.filter((t) => t === null).length;

  // More than 1 DNF means the average is DNF
  if (dnfCount > 1) return null;

  // Sort: DNF (null) goes to end as Infinity
  const sorted = times.map((t) => t ?? Infinity).sort((a, b) => a - b);

  // Drop best and worst
  const trimmed = sorted.slice(1, -1);
  const sum = trimmed.reduce((a, b) => a + b, 0);
  return sum / trimmed.length;
}

export function sessionAverage(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  const times = solves
    .map(effectiveTime)
    .filter((t): t is number => t !== null);
  if (times.length === 0) return null;
  return times.reduce((a, b) => a + b, 0) / times.length;
}

export function computeAllStats(solves: Solve[]): Stats {
  return {
    best: bestTime(solves),
    ao5: averageOfN(solves, 5),
    ao12: averageOfN(solves, 12),
    ao100: averageOfN(solves, 100),
    sessionAvg: sessionAverage(solves),
    count: solves.length,
  };
}
