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

/** Po splnění hádanky s kvízem ohlásí Echo závěrečnou repliku (bez kvízu ji řekne výsledek komnaty). */
export function sayComplete(ctx: LevelCtx): void {
  const level = ctx.level();
  if (level.quiz?.length && level.echo.complete) ctx.echo.say([level.echo.complete]);
}
