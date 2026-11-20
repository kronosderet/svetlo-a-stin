import { LAYOUT, mergeCounts, mergeSeals, migrateKodexIds, migrateLevelIds } from './migrate';
import { settings } from './settings.svelte.ts';
import { emptyStats, type RoomStats } from './roomStats';
import { unlockedIn } from './unlock';

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

export { emptyStats, type RoomStats } from './roomStats';

export interface ProgressData {
  version: 1;
  /** Číslování komnat (viz migrate.ts). */
  layout: number;
  levels: Record<string, LevelRecord>;
  /** Statistiky komnat (i těch rozehraných). */
  stats: Record<string, RoomStats>;
  /** Jméno, pod kterým postup uvidí učitel v přehledu třídy (nepovinné). */
  name: string;
  /** Přeložené (odemčené) záznamy Kodexu. */
  kodex: string[];
  /** Záznamy, které hráč už v Kodexu viděl. */
  seen: string[];
}

function empty(): ProgressData {
  return { version: 1, layout: LAYOUT, levels: {}, stats: {}, name: '', kodex: [], seen: [] };
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw);
    if (data?.version !== 1) return empty();
    const loaded: ProgressData = { ...empty(), ...data };
    // Postup z novější verze hry (stejný prohlížeč, starší uložená verze): nepřevádět a nepřepsat starším číslem.
    if (typeof data.layout === 'number' && data.layout > LAYOUT) return loaded;
    if (data.layout !== LAYOUT) {
      // Postup ze staršího rozvržení komnat: komnaty dostanou nová čísla a hned se uloží.
      loaded.levels = migrateLevelIds(loaded.levels, data.layout, mergeSeals);
      loaded.stats = migrateLevelIds(loaded.stats, data.layout, mergeCounts);
      loaded.kodex = migrateKodexIds(loaded.kodex);
      loaded.seen = migrateKodexIds(loaded.seen);
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
  progress.stats = data.stats;
  progress.name = data.name;
  progress.kodex = data.kodex;
  progress.seen = data.seen;
  save();
}

/** Jméno pro přehled třídy. */
export function setName(name: string): void {
  progress.name = name.trim().slice(0, 40);
  save();
}

/** Hráč vstoupil do komnaty (přehled třídy pak ukáže, kde se zasekl). */
export function recordEntry(levelId: string): void {
  const st = progress.stats[levelId] ?? emptyStats();
  progress.stats[levelId] = { ...st, entered: st.entered + 1 };
  save();
}

/** Nápověda se zapíše hned: přehled třídy pak ukáže i nápovědy těch, kdo komnatu nedokončili. */
export function recordHint(levelId: string, step: boolean): void {
  const st = progress.stats[levelId] ?? emptyStats();
  progress.stats[levelId] = { ...st, hints: st.hints + 1, stepHints: st.stepHints + (step ? 1 : 0) };
  save();
}

export interface ResultForRecord {
  seals: Seals;
  moves?: number;
  par?: number;
  hintsUsed?: number;
  stepHints?: number;
  quizMistakes?: number;
}

export function recordResult(levelId: string, result: ResultForRecord, kodexId?: string): void {
  const st = progress.stats[levelId] ?? emptyStats();
  progress.stats[levelId] = {
    ...st,
    solved: st.solved + 1,
    extra: st.extra + Math.max(0, (result.moves ?? 0) - (result.par ?? 0)),
    quizMistakes: st.quizMistakes + (result.quizMistakes ?? 0),
  };
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
 * Základní cesta se otevírá po jedné komnatě, Hlubší síně po bráně patra (viz unlock.ts).
 * Hotová komnata je vždy otevřená, takže brána prošlá dřívější zkratkou zůstane otevřená i s tím, co otevřela.
 */
export function isUnlocked(id: string): boolean {
  // Učitelský režim (PIN v Nastavení) otevře všechno, ať jde ukázat kterákoli komnata.
  return settings.teacher || unlockedIn(id, isCompleted);
}

export function hasStarted(): boolean {
  return Object.keys(progress.levels).length > 0;
}

/** Počet získaných pečetí (ve vybraných komnatách, nebo ve všech). */
export function sealCount(ids?: string[]): number {
  return Object.entries(progress.levels)
    .filter(([id]) => !ids || ids.includes(id))
    .reduce((sum, [, r]) => sum + Number(!!r.seals?.solved) + Number(!!r.seals?.skill) + Number(!!r.seals?.pure), 0);
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
  progress.stats = e.stats;
  progress.name = e.name;
  progress.kodex = e.kodex;
  progress.seen = e.seen;
  save();
}
