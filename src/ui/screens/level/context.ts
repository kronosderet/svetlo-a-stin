import type { Point } from '../../FxLayer.svelte';
import type { PuzzleLevel } from '../../../content/types';
import type { Echo } from '../../../game/echo.svelte.ts';

/**
 * Co obsluha událostí jednotlivých archetypů potřebuje od obrazovky komnaty:
 * aktuální hádanku (u smíšené brány se mění), Echo, hlášení pro čtečku a efekty.
 */
export interface LevelCtx {
  /** Aktuální hádanka (část smíšené brány, nebo celá komnata). */
  level(): PuzzleLevel;
  /** Počet krystalů aktuální hádanky (u Kaskády sloupců). */
  bits(): number;
  echo: Echo;
  /** Echo samo přejde na repliky, které na něj čekají, až jde ta současná přečíst. */
  readOn(): void;
  announce(text: string): void;
  /** Kombinace slovy nebo číslicemi podle toho, jestli je už „přeložená“. */
  words(mask: number): string;
  /** Chyba: zvuk, otřes, prach z místa prvního nalezeného prvku. */
  failFx(...selectors: string[]): void;
  /** Splněný krok: vlna světla z místa prvního nalezeného prvku. */
  stepFx(...selectors: string[]): void;
  puff(at: Point, amount: number): void;
  centerOf(...selectors: string[]): Point;
  stage(): HTMLElement | undefined;
  /** Puls scény po splněném kroku. */
  pulse(): void;
  /** Otřes sloupcem Kaskády po chybném potvrzení. */
  wobble(): void;
  /** Co už Echo v této části řeklo (aby se neopakovalo). */
  said: SaidFlags;
}

export interface SaidFlags {
  firstReveal: boolean;
  repeat: boolean;
  spill: boolean;
  wrongCount: number;
}

export const freshFlags = (): SaidFlags => ({ firstReveal: false, repeat: false, spill: false, wrongCount: 0 });

/**
 * Po splnění hádanky s kvízem ohlásí Echo závěrečnou repliku (bez kvízu ji řekne výsledek komnaty).
 * Replika posledního kroku přichází v téže chvíli a často nese vysvětlení: nezmizí, závěr se za ni
 * přidá a Echo na něj přejde samo. Bez ní závěr nahradí, co Echo říkalo předtím.
 */
export function sayComplete(ctx: LevelCtx): void {
  const level = ctx.level();
  if (!level.quiz?.length || !level.echo.complete) return;
  const kept = ctx.echo.fresh;
  ctx.echo.follow([level.echo.complete]);
  if (kept) ctx.readOn();
}

/**
 * Hlášení čtečce z jedné chvíle (tah, replika Echa, nápověda) v jednom textu. Co zazní celé
 * v jiném hlášení („Výsledek nepřijat. …“ a táž replika Echa), se neopakuje.
 */
export function mergeSpeech(parts: string[]): string {
  const uniq = [...new Set(parts.map((t) => t.trim()).filter(Boolean))];
  return uniq.filter((t) => !uniq.some((o) => o !== t && o.includes(t))).join(' ');
}
