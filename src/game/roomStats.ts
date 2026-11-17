/** Statistiky komnat v postupu: čistý modul bez Svelte, aby šel použít i v testech. */
/** Jak se v komnatě dařilo (pro přehled třídy). Součty přes všechny pokusy. */
export interface RoomStats {
  /** Kolikrát hráč komnatu otevřel. */
  entered: number;
  /** Kolikrát ji dokončil. */
  solved: number;
  /** Kroky (tahy, potvrzení a Zkoušky) nad ideál. */
  extra: number;
  /** Všechny nápovědy. */
  hints: number;
  /** Nápovědy, které ukázaly konkrétní krok. */
  stepHints: number;
  /** Špatné odpovědi v kvízu. */
  quizMistakes: number;
}

export const emptyStats = (): RoomStats => ({ entered: 0, solved: 0, extra: 0, hints: 0, stepHints: 0, quizMistakes: 0 });
