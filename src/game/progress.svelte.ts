import { LEVELS } from '../content/levels';

const KEY = 'svetlo-stin.progress.v1';
/** Klíč z doby, kdy se hra jmenovala Lumen & Umbra; postup se z něj převezme. */
const LEGACY_KEY = 'lumen-umbra.progress.v1';

export interface Seals {
  solved: boolean;
  skill: boolean;
  pure: boolean;
}

export interface LevelRecord {
  seals: Seals;
  bestMoves: number;
}

export interface ProgressData {
  version: 1;
  levels: Record<string, LevelRecord>;
  /** Přeložené (odemčené) záznamy Kodexu. */
  kodex: string[];
  /** Záznamy, které hráč už v Kodexu viděl. */
  seen: string[];
}

function empty(): ProgressData {
  return { version: 1, levels: {}, kodex: [], seen: [] };
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw);
    if (data?.version !== 1) return empty();
    return { ...empty(), ...data };
  } catch {
    return empty();
  }
}

export const progress: ProgressData = $state(load());

/** Kdo chce vědět o každém uložení (průběžné ukládání do souboru s postupem). */
const saveListeners = new Set<() => void>();

export function onProgressSaved(fn: () => void): () => void {
  saveListeners.add(fn);
  return () => saveListeners.delete(fn);
}

function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* úložiště nedostupné, postup vydrží do zavření stránky */
  }
  for (const fn of saveListeners) fn();
}

/** Obyčejná kopie postupu (pro zápis do souboru). */
export function progressSnapshot(): ProgressData {
  return $state.snapshot(progress) as ProgressData;
}

/** Nahradí postup v prohlížeči jiným (načteným ze souboru). */
export function replaceProgress(data: ProgressData): void {
  progress.levels = data.levels;
  progress.kodex = data.kodex;
  progress.seen = data.seen;
  save();
}

export function recordResult(levelId: string, result: { moves: number; seals: Seals }, kodexId?: string): void {
  const prev = progress.levels[levelId];
  progress.levels[levelId] = {
    seals: {
      solved: true,
      skill: result.seals.skill || !!prev?.seals.skill,
      pure: result.seals.pure || !!prev?.seals.pure,
    },
    bestMoves: Math.min(result.moves, prev?.bestMoves ?? Number.MAX_SAFE_INTEGER),
  };
  if (kodexId && !progress.kodex.includes(kodexId)) progress.kodex.push(kodexId);
  save();
}

export function isCompleted(id: string): boolean {
  return !!progress.levels[id];
}

export function isUnlocked(id: string): boolean {
  const i = LEVELS.findIndex((l) => l.id === id);
  if (i < 0) return false;
  return i === 0 || isCompleted(LEVELS[i - 1].id);
}

export function hasStarted(): boolean {
  return Object.keys(progress.levels).length > 0;
}

/** Počet získaných pečetí (ve vybraných komnatách, nebo ve všech). */
export function sealCount(ids?: string[]): number {
  return Object.entries(progress.levels)
    .filter(([id]) => !ids || ids.includes(id))
    .reduce((sum, [, r]) => sum + Number(r.seals.solved) + Number(r.seals.skill) + Number(r.seals.pure), 0);
}

export function unseenKodex(): string[] {
  return progress.kodex.filter((k) => !progress.seen.includes(k));
}

export function markKodexSeen(): void {
  const fresh = unseenKodex();
  if (fresh.length === 0) return;
  progress.seen.push(...fresh);
  save();
}

export function resetProgress(): void {
  const e = empty();
  progress.levels = e.levels;
  progress.kodex = e.kodex;
  progress.seen = e.seen;
  save();
}
