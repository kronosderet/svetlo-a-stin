import type { AltarConfig } from '../core/puzzles/altar';
import type { CascadeConfig } from '../core/puzzles/cascade';
import type { GateConfig } from '../core/puzzles/gate';
import type { TableConfig } from '../core/puzzles/table';
import type { MaskConfig } from '../core/puzzles/mask';
import type { InscriptionConfig } from '../core/puzzles/inscription';
import type { TideConfig } from '../core/puzzles/tide';
import type { Rng } from './random';

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index správné možnosti. */
  correct: number;
  /** Nápověda po špatné odpovědi. */
  hint: string;
  /** Vysvětlení po správné odpovědi. */
  explain: string;
}

/** Otázka kvízu, nebo generátor, který vylosuje čísla (src/content/quizzes.ts). */
export type QuizItem = QuizQuestion | ((rng: Rng) => QuizQuestion);

export interface Presentation {
  task: string;
  /** Zadání pro zápis (jen u Nápisu, který střídá čtení a zápis). */
  writeTask?: string;
  /** Číslice 0/1 pod krystaly (po „překladu“ v Kodexu). */
  showDigits: boolean;
  /** Živý součet vah. */
  showSum: boolean;
  /** Velikost krystalu naznačuje váhu. */
  sizes: 'equal' | 'weighted';
  /** Zápisník s moderním zápisem. */
  ledger: boolean;
  /** Počítadlo: cíle se zadávají čárkami poutníků místo čísla, zápisník ukazuje přenos. */
  counter?: boolean;
  /** Váhy pod krystaly výsledku (Kaskáda). */
  showWeights?: boolean;
  /** Kaskáda: pod sloupci živě ukazuje, kolik světla se v nich slévá. */
  columnCounts?: boolean;
  /** Kaskáda: desítkové hodnoty řádků vedle stěny. */
  showValues?: boolean;
  /** Příliv: popisky pák. shift = jen směr (posun se teprve objevuje), math = ×2, ÷2, +1, −1. */
  levers?: 'shift' | 'math';
  /** Příliv: místo kamenného kola dvě misky vah (Váhy Osudu). */
  scale?: boolean;
  /** Příliv: světla, která spadnou přes pravý okraj, se chytají do misky zbytku (dělení posunem). */
  remainder?: boolean;
}

interface LevelBase {
  /** Např. "I-3". */
  id: string;
  title: string;
  presentation: Presentation;
  /** Tři stupně: náznak, strategie, ukázka (3. stupeň ukáže konkrétní krok). */
  hints: [string, string, string];
  /** Repliky průvodce. {{slovo}} = zatím nečitelné slovo (zobrazí se glyfy). */
  echo: {
    intro: string[];
    step?: Record<number, string>;
    found?: Record<number, string>;
    repeat?: string;
    /** První chybné čtení nápisu. */
    wrong?: string;
    /** Příliv: první světlo, které spadlo přes okraj. */
    spill?: string;
    /** Váhy Osudu: misky se vrátily na začátek. */
    reset?: string;
    firstReveal?: string;
    allRevealed?: string;
    complete?: string;
    solved: string[];
    /** Přidá se po vyřešení v ideálním počtu tahů. */
    skill?: string;
  };
  /** Závěrečný kvíz; otázky s čísly jsou generátory, které čísla při každém vstupu vylosují. */
  quiz?: QuizItem[];
  /** Záznam Kodexu, který level odemyká („přeloží“). */
  kodex?: string;
}

export interface AltarLevel extends LevelBase {
  kind: 'altar';
  /** Výchozí (ukázková) podoba úloh. */
  config: AltarConfig;
  /** Komnata na procvičování: úlohy se při každém vstupu vylosují znovu. */
  generate?: (rng: Rng) => AltarConfig;
}

export interface InscriptionLevel extends LevelBase {
  kind: 'inscription';
  config: InscriptionConfig;
  generate?: (rng: Rng) => InscriptionConfig;
}

export interface CascadeLevel extends LevelBase {
  kind: 'cascade';
  config: CascadeConfig;
  generate?: (rng: Rng) => CascadeConfig;
}

export interface TideLevel extends LevelBase {
  kind: 'tide';
  config: TideConfig;
  generate?: (rng: Rng) => TideConfig;
}

export interface GateLevel extends LevelBase {
  kind: 'gate';
  config: GateConfig;
  generate?: (rng: Rng) => GateConfig;
}

export interface TableLevel extends LevelBase {
  kind: 'table';
  config: TableConfig;
  generate?: (rng: Rng) => TableConfig;
}

export interface MaskLevel extends LevelBase {
  kind: 'mask';
  config: MaskConfig;
  generate?: (rng: Rng) => MaskConfig;
}

/** Komnata s jedinou hádankou. */
export type PuzzleLevel = AltarLevel | InscriptionLevel | CascadeLevel | TideLevel | GateLevel | TableLevel | MaskLevel;

/**
 * Smíšená komnata (brány): několik hádanek různých archetypů za sebou.
 * Každá část má vlastní zadání, nápovědy a repliky; pečetě se počítají za celou komnatu.
 */
export interface MixedLevel {
  kind: 'mixed';
  id: string;
  title: string;
  parts: PuzzleLevel[];
  echo: {
    /** Úvod komnaty (před úvodem první části). */
    intro: string[];
    solved: string[];
    skill?: string;
  };
  kodex?: string;
}

export type LevelDef = PuzzleLevel | MixedLevel;

export interface ActDef {
  numeral: string;
  title: string;
  theme: string;
  /** Glyfy komnat na mapě: patro I má prázdný střed (0), Síň Počtářů rozsvícený (16). */
  glyphBase: number;
  /**
   * Komnaty patra. Číslo v id je zároveň glyf: 1–7 základní cesta (7 = brána patra),
   * 8–15 pokročilé Hlubší síně (15 = velká brána). Chybějící čísla jsou zatím zapečetěná.
   */
  levels: LevelDef[];
  /** Další patro observatoře, které v prototypu ještě není. */
  nextAct?: { numeral: string; title: string; theme: string };
}

export interface KodexEntry {
  id: string;
  /** Hodnota čtveřicového glyfu 0–15. */
  glyph: number;
  ancientName: string;
  modernName: string;
  ancient: string;
  modern: string;
  formula?: string;
  today: string;
}
