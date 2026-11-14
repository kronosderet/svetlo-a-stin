/**
 * Soubor s postupem: hráč si postup uloží třeba do školního OneDrive a na jiném počítači
 * ho zase načte. Čistá logika bez prohlížeče: zápis, kontrola a porovnání.
 */
import { LAYOUT, migrateLevelIds } from './migrate';
import type { LevelRecord, ProgressData, RoomStats } from './progress.svelte.ts';

export const FILE_NAME = 'Svetlo-a-Stin-postup.json';

/** Název souboru i se jménem hráče, ať se soubory od celé třídy nepletou. */
export function fileNameFor(name: string): string {
  const clean = name.replace(/[\\/:*?"<>|]+/g, '').trim().replace(/\s+/g, '-');
  return clean ? `Svetlo-a-Stin-postup-${clean}.json` : FILE_NAME;
}
const FORMAT = 'svetlo-a-stin-postup';

export function serializeProgress(p: ProgressData, now = new Date()): string {
  const file = {
    format: FORMAT,
    verze: 2,
    ulozeno: now.toISOString(),
    postup: { version: 1, layout: LAYOUT, name: p.name, levels: p.levels, stats: p.stats, kodex: p.kodex, seen: p.seen },
  };
  return JSON.stringify(file, null, 2);
}

export type ParseResult = { ok: true; data: ProgressData } | { ok: false; reason: string };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Přečte soubor a ponechá jen komnaty a záznamy Kodexu, které hra zná. */
export function parseProgress(text: string, levelIds: string[], kodexIds: string[]): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'Soubor se nedá přečíst.' };
  }
  if (!isRecord(raw) || raw.format !== FORMAT || !isRecord(raw.postup)) {
    return { ok: false, reason: 'Tohle není soubor s postupem Světla & Stínu.' };
  }
  const src = raw.postup;
  const levels: Record<string, LevelRecord> = {};
  if (isRecord(src.levels)) {
    // Soubor uložený před rozdělením pater má původní čísla komnat.
    const saved = src.layout === LAYOUT ? src.levels : migrateLevelIds(src.levels);
    for (const [id, rec] of Object.entries(saved)) {
      if (!levelIds.includes(id) || !isRecord(rec) || !isRecord(rec.seals)) continue;
      levels[id] = { seals: { solved: true, skill: rec.seals.skill === true, pure: rec.seals.pure === true } };
    }
  }
  const stats: Record<string, RoomStats> = {};
  if (isRecord(src.stats)) {
    const saved = src.layout === LAYOUT ? src.stats : migrateLevelIds(src.stats);
    const count = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
    for (const [id, st] of Object.entries(saved)) {
      if (!levelIds.includes(id) || !isRecord(st)) continue;
      stats[id] = {
        entered: count(st.entered),
        solved: count(st.solved),
        extra: count(st.extra),
        hints: count(st.hints),
        stepHints: count(st.stepHints),
        quizMistakes: count(st.quizMistakes),
      };
    }
  }
  const name = typeof src.name === 'string' ? src.name.trim().slice(0, 40) : '';
  const known = (list: unknown, ids: string[]) =>
    Array.isArray(list) ? [...new Set(list.filter((k): k is string => typeof k === 'string' && ids.includes(k)))] : [];
  return {
    ok: true,
    data: { version: 1, layout: LAYOUT, levels, stats, name, kodex: known(src.kodex, kodexIds), seen: known(src.seen, kodexIds) },
  };
}

/** Obsahuje postup `a` všechno, co je v `b` (každou komnatu a pečeť)? */
export function covers(a: ProgressData, b: ProgressData): boolean {
  return Object.entries(b.levels).every(([id, rec]) => {
    const mine = a.levels[id];
    return !!mine && (mine.seals.skill || !rec.seals.skill) && (mine.seals.pure || !rec.seals.pure);
  });
}

export const roomCount = (p: ProgressData): number => Object.keys(p.levels).length;
