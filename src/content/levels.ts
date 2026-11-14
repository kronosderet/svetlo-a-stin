import { ACT_I } from './act1';
import { ACT_II } from './act2';
import type { Rng } from './random';
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

/** Komnata připravená ke hraní: u komnat na procvičování s nově vylosovanými úlohami. */
export function instantiate(level: LevelDef, rng: Rng = Math.random): LevelDef {
  switch (level.kind) {
    case 'altar':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'inscription':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'cascade':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'tide':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
  }
}
