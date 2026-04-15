export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  timestamp: number;
  penalty?: "+2" | "DNF";
}

export type TimerState = "idle" | "ready" | "running" | "stopped";

export interface Stats {
  best: number | null;
  ao5: number | null;
  ao12: number | null;
  ao100: number | null;
  sessionAvg: number | null;
  count: number;
}
