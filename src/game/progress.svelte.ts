import { BASIC_PATH, actOf, advancedRooms, gateOf, isAdvanced } from '../content/levels';
import { LAYOUT, migrateLevelIds } from './migrate';

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
}

export interface ProgressData {
  version: 1;
  /** Číslování komnat (viz migrate.ts). */
  layout: number;
  levels: Record<string, LevelRecord>;
  /** Přeložené (odemčené) záznamy Kodexu. */
  kodex: string[];
  /** Záznamy, které hráč už v Kodexu viděl. */
  seen: string[];
}

function empty(): ProgressData {
  return { version: 1, layout: LAYOUT, levels: {}, kodex: [], seen: [] };
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw);
    if (data?.version !== 1) return empty();
    const loaded: ProgressData = { ...empty(), ...data };
    if (data.layout !== LAYOUT) {
      // Postup z doby před rozdělením pater: komnaty dostanou nová čísla a hned se uloží.
      loaded.levels = migrateLevelIds(loaded.levels);
      loaded.layout = LAYOUT;
      localStorage.setItem(KEY, JSON.stringify(loaded));
    }
    return loaded;
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

export function recordResult(levelId: string, result: { seals: Seals }, kodexId?: string): void {
  const prev = progress.levels[levelId];
  progress.levels[levelId] = {
    seals: {
      solved: true,
      skill: result.seals.skill || !!prev?.seals.skill,
      pure: result.seals.pure || !!prev?.seals.pure,
    },
  };
  if (kodexId && !progress.kodex.includes(kodexId)) progress.kodex.push(kodexId);
  save();
}

export function isCompleted(id: string): boolean {
  return !!progress.levels[id];
}

/**
 * Základní cesta se otevírá po jedné komnatě napříč patry (brána otevře další patro).
 * Hlubší síně patra se otevřou po jeho bráně a pak zase po jedné. Hotová komnata je vždy otevřená.
 */
export function isUnlocked(id: string): boolean {
  if (isCompleted(id)) return true;
  if (isAdvanced(id)) {
    const act = actOf(id);
    if (!isCompleted(gateOf(act))) return false;
    const rooms = advancedRooms(act);
    const i = rooms.findIndex((l) => l.id === id);
    return i === 0 || (i > 0 && isCompleted(rooms[i - 1].id));
  }
  const i = BASIC_PATH.findIndex((l) => l.id === id);
  return i === 0 || (i > 0 && isCompleted(BASIC_PATH[i - 1].id));
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
