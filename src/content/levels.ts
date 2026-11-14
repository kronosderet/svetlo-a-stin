import { ACT_I } from './act1';
import { ACT_II } from './act2';
import type { ActDef, LevelDef } from './types';

/** Patra observatoře, která prototyp obsahuje. */
export const ACTS: ActDef[] = [ACT_I, ACT_II];

/** Všechny komnaty v pořadí, ve kterém se otevírají. */
export const LEVELS: LevelDef[] = ACTS.flatMap((a) => a.levels);

export function getLevel(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function nextLevelId(id: string): string | null {
  const i = LEVELS.findIndex((l) => l.id === id);
  return i >= 0 && i + 1 < LEVELS.length ? LEVELS[i + 1].id : null;
}

export function actOf(id: string): ActDef {
  return ACTS.find((a) => a.levels.some((l) => l.id === id)) ?? ACTS[0];
}
