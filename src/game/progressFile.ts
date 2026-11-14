/**
 * Soubor s postupem: hráč si postup uloží třeba do školního OneDrive a na jiném počítači
 * ho zase načte. Čistá logika bez prohlížeče: zápis, kontrola a porovnání.
 */
import type { LevelRecord, ProgressData } from './progress.svelte.ts';

export const FILE_NAME = 'Svetlo-a-Stin-postup.json';
const FORMAT = 'svetlo-a-stin-postup';

export function serializeProgress(p: ProgressData, now = new Date()): string {
  const file = {
    format: FORMAT,
    verze: 1,
    ulozeno: now.toISOString(),
    postup: { version: 1, levels: p.levels, kodex: p.kodex, seen: p.seen },
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
    for (const [id, rec] of Object.entries(src.levels)) {
      if (!levelIds.includes(id) || !isRecord(rec) || !isRecord(rec.seals)) continue;
      const moves = Number(rec.bestMoves);
      levels[id] = {
        seals: { solved: true, skill: rec.seals.skill === true, pure: rec.seals.pure === true },
        bestMoves: Number.isFinite(moves) && moves >= 0 ? moves : Number.MAX_SAFE_INTEGER,
      };
    }
  }
  const known = (list: unknown, ids: string[]) =>
    Array.isArray(list) ? [...new Set(list.filter((k): k is string => typeof k === 'string' && ids.includes(k)))] : [];
  return { ok: true, data: { version: 1, levels, kodex: known(src.kodex, kodexIds), seen: known(src.seen, kodexIds) } };
}

/** Obsahuje postup `a` všechno, co je v `b` (každou komnatu a pečeť)? */
export function covers(a: ProgressData, b: ProgressData): boolean {
  return Object.entries(b.levels).every(([id, rec]) => {
    const mine = a.levels[id];
    return !!mine && (mine.seals.skill || !rec.seals.skill) && (mine.seals.pure || !rec.seals.pure);
  });
}

export const roomCount = (p: ProgressData): number => Object.keys(p.levels).length;
