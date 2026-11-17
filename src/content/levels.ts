import { ACT_I } from './act1';
import { ACT_II } from './act2';
import { ACT_III } from './act3';
import { ACT_IV } from './act4';
import type { Rng } from './random';
import type { ActDef, LevelDef, PuzzleLevel } from './types';

/** Patra observatoře, která prototyp obsahuje. */
export const ACTS: ActDef[] = [ACT_I, ACT_II, ACT_III, ACT_IV];

/** Všechny komnaty: po patrech, v každém patře podle čísla. */
export const LEVELS: LevelDef[] = ACTS.flatMap((a) => a.levels);

/** Brána základní cesty má v každém patře číslo 7, velká brána Hlubších síní 15. */
export const GATE = 7;
export const GREAT_GATE = 15;
/** Kolik míst pro komnaty má patro: tolik, kolik rozliší čtyři strany glyfu (0000 až 1111). */
export const ROOMS_PER_FLOOR = 16;

/** Číslo komnaty v patře (zároveň hodnota glyfu na mapě): "II-7" → 7. */
export function roomNumber(id: string): number {
  return Number(id.slice(id.indexOf('-') + 1));
}

/** Brána patra (7) nebo velká brána Hlubších síní (15). */
export function isGateRoom(id: string): boolean {
  const n = roomNumber(id);
  return n === GATE || n === GREAT_GATE;
}

/** Hlubší síně (8–15) jsou nepovinné a otevírají se po bráně patra. */
export function isAdvanced(id: string): boolean {
  return roomNumber(id) > GATE;
}

/** Základní cesta celou observatoří: 0–7 v každém patře (0 = nultá komnata, 7 = brána). */
export const BASIC_PATH: LevelDef[] = LEVELS.filter((l) => !isAdvanced(l.id));

export function getLevel(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function actOf(id: string): ActDef {
  return ACTS.find((a) => a.levels.some((l) => l.id === id)) ?? ACTS[0];
}

export function basicRooms(act: ActDef): LevelDef[] {
  return act.levels.filter((l) => !isAdvanced(l.id));
}

export function advancedRooms(act: ActDef): LevelDef[] {
  return act.levels.filter((l) => isAdvanced(l.id));
}

/** Id brány patra (komnata 7). */
export function gateOf(act: ActDef): string {
  return `${act.numeral}-${GATE}`;
}

/**
 * Kam vede tlačítko „Další komnata“: po základní cestě dál (brána otevře další patro),
 * v Hlubších síních na další pokročilou komnatu téhož patra. Na konci vrací null.
 */
export function nextLevelId(id: string): string | null {
  if (isAdvanced(id)) {
    const rooms = advancedRooms(actOf(id));
    const i = rooms.findIndex((l) => l.id === id);
    return rooms[i + 1]?.id ?? null;
  }
  const i = BASIC_PATH.findIndex((l) => l.id === id);
  return i >= 0 ? (BASIC_PATH[i + 1]?.id ?? null) : null;
}

function instantiatePuzzle(level: PuzzleLevel, rng: Rng): PuzzleLevel {
  switch (level.kind) {
    case 'altar':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'inscription':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'cascade':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'tide':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'gate':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'table':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'mask':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
    case 'machine':
      return level.generate ? { ...level, config: level.generate(rng) } : level;
  }
}

/** Komnata připravená ke hraní: u komnat na procvičování s nově vylosovanými úlohami. */
export function instantiate(level: LevelDef, rng: Rng = Math.random): LevelDef {
  if (level.kind === 'mixed') return { ...level, parts: level.parts.map((p) => instantiatePuzzle(p, rng)) };
  return instantiatePuzzle(level, rng);
}

/** Hádanky komnaty: u smíšené její části, jinak komnata sama. */
export function partsOf(level: LevelDef): PuzzleLevel[] {
  return level.kind === 'mixed' ? level.parts : [level];
}
