import { randomScrambleForEvent } from "cubing/scramble";

export async function generateScramble(): Promise<string> {
  const alg = await randomScrambleForEvent("333");
  return alg.toString();
}
