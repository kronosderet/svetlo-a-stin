import type { AltarEvent, AltarState } from '../core/puzzles/altar';
import type { CascadeEvent, CascadeState } from '../core/puzzles/cascade';
import type { GateEvent, GateState } from '../core/puzzles/gate';
import type { TableEvent, TableState } from '../core/puzzles/table';
import type { MaskEvent, MaskState } from '../core/puzzles/mask';
import type { InscriptionEvent, InscriptionState } from '../core/puzzles/inscription';
import type { TideEvent, TideState } from '../core/puzzles/tide';
import type { MachineEvent, MachineState } from '../core/puzzles/machine';
import type { PuzzleLevel, QuizQuestion } from '../content/types';
import { shuffleOptions } from '../content/random';
import { isGateRoom } from '../content/levels';
import { extraTaskFor } from './extraTask';
import { settings } from './settings.svelte.ts';
import { settledHint as settledFor } from './settledHint';

export interface LevelResult {
  moves: number;
  par: number;
  /** Všechny nápovědy (i obecné náznaky 1. a 2. stupně). */
  hintsUsed: number;
  /** Nápovědy 3. stupně, které ukázaly konkrétní krok. Jen ty berou pečeť odvahy. */
  stepHints: number;
  /** Špatné odpovědi v kvízu. Pečeť přesnosti chce kvíz napoprvé. */
  quizMistakes: number;
  seals: { solved: boolean; skill: boolean; pure: boolean };
}

/** Pečetě: přesnost = ideální počet tahů a kvíz napoprvé, odvaha = žádná ukázka kroku. */
export function sealsOf(r: Omit<LevelResult, 'seals'>): LevelResult['seals'] {
  return { solved: true, skill: r.moves <= r.par && r.quizMistakes === 0, pure: r.stepHints === 0 };
}

/** Výsledek celé komnaty: u smíšené brány součet všech částí. */
export function combineResults(results: LevelResult[]): LevelResult {
  const sum = (key: 'moves' | 'par' | 'hintsUsed' | 'stepHints' | 'quizMistakes') => results.reduce((s, r) => s + r[key], 0);
  const base = { moves: sum('moves'), par: sum('par'), hintsUsed: sum('hintsUsed'), stepHints: sum('stepHints'), quizMistakes: sum('quizMistakes') };
  return { ...base, seals: sealsOf(base) };
}

export type GameEvent =
  | { kind: 'altar'; event: AltarEvent; state: AltarState }
  | { kind: 'inscription'; event: InscriptionEvent; state: InscriptionState }
  | { kind: 'cascade'; event: CascadeEvent; state: CascadeState }
  | { kind: 'tide'; event: TideEvent; state: TideState }
  | { kind: 'gate'; event: GateEvent; state: GateState }
  | { kind: 'table'; event: TableEvent; state: TableState }
  | { kind: 'mask'; event: MaskEvent; state: MaskState }
  | { kind: 'machine'; event: MachineEvent; state: MachineState }
  /** extra: brána za ukázku kroku přidala na konec zkoušku navíc. */
  | { kind: 'hint'; level: number; extra: boolean }
  /** Ukázka kroku na desce, která už sedí: nic neukáže ani nestojí, text řekne, co zbývá. */
  | { kind: 'settled'; text: string }
  | { kind: 'quiz'; correct: boolean; question: number }
  | { kind: 'solved'; result: LevelResult };

export type Phase = 'play' | 'quiz' | 'solved';

/** Ideální počet tahů podle zadání (zápis metodou, ať jde hra předat jako BaseGame<PuzzleLevel>). */
type ParOf<L extends PuzzleLevel> = { parOf(config: L['config']): number }['parOf'];

/**
 * Společný průběh komnaty bez ohledu na archetyp: nápovědy, závěrečný kvíz, pečetě.
 * Potomek drží stav hádanky a volá solve(), když je hádanka hotová.
 */
export abstract class BaseGame<L extends PuzzleLevel = PuzzleLevel> {
  /** Komnata (část brány). V bráně se může prodloužit o zkoušku navíc, proto je reaktivní. */
  level: L = $state.raw() as unknown as L;
  /** Ideální počet tahů; se zkouškou navíc se přepočítá. */
  par = $state(0);
  /** Brána už přidala zkoušku navíc (nejvýš jednu za část). */
  extraAdded = $state(false);
  readonly #parOf: ParOf<L>;

  /** Stupeň nápovědy pro aktuální cíl (po splnění cíle se nuluje). */
  hintLevel = $state(0);
  /** Celkový počet použitých nápověd v komnatě. */
  hintsUsed = $state(0);
  /** Kolikrát nápověda ukázala konkrétní krok (3. stupeň); jen to bere pečeť odvahy. */
  stepHints = $state(0);
  /** Špatné odpovědi v kvízu (berou pečeť přesnosti). */
  quizMistakes = $state(0);
  phase: Phase = $state('play');
  quizIndex = $state(0);
  quizWrong: number[] = $state([]);
  quizAnswered = $state(false);
  result: LevelResult | null = $state(null);
  /** Krátká pauza po splněném kroku: výsledek zůstane chvíli vidět, než přijde další úloha. */
  holding = $state(false);
  #holdTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly emit: (e: GameEvent) => void;

  /** Kvíz s možnostmi v náhodném pořadí: každý hráč je má jinak, takže se nedají napovědět „první“. */
  readonly quiz: QuizQuestion[];

  constructor(level: L, parOf: ParOf<L>, emit: (e: GameEvent) => void) {
    this.level = level;
    this.#parOf = parOf;
    this.par = parOf(level.config);
    this.emit = emit;
    this.quiz = (level.quiz ?? []).map((q) => shuffleOptions(typeof q === 'function' ? q(Math.random) : q));
  }

  /** Stav hádanky (drží potomek, každý archetyp má vlastní). */
  abstract state: unknown;
  abstract get moves(): number;
  /** Pořadí rozpracované úlohy. */
  abstract get step(): number;
  abstract get canUndo(): boolean;
  abstract undo(): void;

  get question(): QuizQuestion | null {
    return this.quiz[this.quizIndex] ?? null;
  }

  /**
   * Volná hra po vyřešení: komnata je otevřená a výsledek zapsaný, prvky se ale dají dál přepínat
   * a nic se nepočítá. Vítězná deska se po vyřešení ukáže sama; kdo se z ní do komnaty vrátí,
   * dostane se k ní zpátky tlačítkem Pokračovat.
   */
  get free(): boolean {
    return this.phase === 'solved' && !this.holding;
  }

  /** Volná hra: komnata (část) se všemi úlohami, mezi kterými jde listovat. */
  #full: L | null = null;
  /** Volná hra: kterou úlohu hráč prohlíží (−1 = poslední, ta po vyřešení zůstane na desce). */
  freeIndex = $state(-1);

  /** Kolik úloh komnata má (u oltáře cílů). */
  protected abstract taskCount(config: L['config']): number;
  /** Zadání zkrácené na prvních k + 1 úloh: poslední je ta, kterou hráč prohlíží. */
  protected abstract sliceTasks(config: L['config'], k: number): L['config'];
  /** Na desku dá vyřešený stav poslední úlohy (zkráceného) zadání. */
  protected abstract showSolved(): void;

  /** Volná hra: kolik úloh jde prolistovat. */
  get freeCount(): number {
    return this.taskCount((this.#full ?? this.level).config);
  }

  /** Volná hra: která úloha je na desce. */
  get freeAt(): number {
    return this.freeIndex < 0 ? this.freeCount - 1 : this.freeIndex;
  }

  /**
   * Volná hra: ukáže k-tou úlohu komnaty ve vyřešeném stavu, ať si s ní hráč může dál zkoušet.
   * Zadání se zkrátí tak, aby byla poslední, takže ji desky ukážou jako hotovou bez dalších úprav.
   */
  freeShow(k: number): void {
    if (!this.free) return;
    const full = (this.#full ??= this.level);
    if (k < 0 || k >= this.taskCount(full.config) || k === this.freeAt) return;
    this.freeIndex = k;
    this.level = { ...full, config: this.sliceTasks(full.config, k) } as L;
    this.showSolved();
  }

  /** Deska sedí a chybí jen potvrzení: co hra řekne místo ukázky kroku (settledHint.ts), jinak null. */
  get settledHint(): string | null {
    return this.phase === 'play' && !this.holding ? settledFor(this.level, this.state) : null;
  }

  useHint(): void {
    if (this.phase !== 'play' || this.hintLevel >= 3) return;
    // Ukázka kroku by na hotové desce nic neukázala: hra jen řekne, co zbývá, a nic nezapočítá
    // (pečeť odvahy zůstane, brána nepřidá zkoušku navíc). Stupeň nápovědy se nezvýší, takže
    // kdyby hráč desku potom pokazil, ukázka kroku zase něco ukáže a započítá se.
    const settled = this.hintLevel === 2 ? this.settledHint : null;
    if (settled) return this.emit({ kind: 'settled', text: settled });
    this.hintLevel += 1;
    this.hintsUsed += 1;
    if (this.hintLevel >= 3) this.stepHints += 1;
    const extra = this.hintLevel >= 3 && this.#addExtraTask();
    this.emit({ kind: 'hint', level: this.hintLevel, extra });
  }

  /**
   * Brána patra: po ukázce kroku přidá na konec části jednu podobnou losovanou úlohu, ať si hráč
   * hned zkusí totéž bez ukázky. Nápovědy na ní zůstávají (nápověda je vždy dostupná), další
   * zkouška navíc ale už nepřibude. Komnaty bez generátoru nebo bez seznamu úloh se nemění.
   */
  #addExtraTask(): boolean {
    const level = this.level as PuzzleLevel;
    if (this.extraAdded || !level.generate || !isGateRoom(level.id)) return false;
    const config = level.config as { tasks?: object[] };
    if (!Array.isArray(config.tasks)) return false;
    const generate = level.generate;
    const extra = extraTaskFor(config.tasks, () => (generate(Math.random) as { tasks?: object[] }).tasks ?? [], this.step);
    if (!extra) return false;
    const longer = { ...config, tasks: [...config.tasks, extra] } as L['config'];
    this.level = { ...this.level, config: longer };
    this.par = this.#parOf(longer);
    this.extraAdded = true;
    return true;
  }

  answer(option: number): void {
    const q = this.question;
    if (!q || this.quizAnswered || this.quizWrong.includes(option)) return;
    const correct = option === q.correct;
    if (correct) this.quizAnswered = true;
    else {
      this.quizWrong = [...this.quizWrong, option];
      this.quizMistakes += 1;
    }
    this.emit({ kind: 'quiz', correct, question: this.quizIndex });
  }

  continueQuiz(): void {
    if (!this.quizAnswered) return;
    if (this.quizIndex + 1 < this.quiz.length) {
      this.quizIndex++;
      this.quizWrong = [];
      this.quizAnswered = false;
    } else {
      this.#finish();
    }
  }

  /**
   * Přeskočená část smíšené komnaty („Desku znám“): hotová bez tahů i ideálu, takže pečeť přesnosti
   * neubere ani nepřidá. Nápovědy, které hráč v části vzal, se počítají dál.
   */
  skip(): void {
    if (this.phase !== 'play') return;
    clearTimeout(this.#holdTimer);
    this.holding = false;
    this.showSolved();
    const base = { moves: 0, par: 0, hintsUsed: this.hintsUsed, stepHints: this.stepHints, quizMistakes: 0 };
    const result: LevelResult = { ...base, seals: sealsOf(base) };
    this.result = result;
    this.phase = 'solved';
    this.emit({ kind: 'solved', result });
  }

  /** Podrží splněný krok na očích; potomek mezitím nepřijímá tahy. */
  protected hold(): void {
    clearTimeout(this.#holdTimer);
    this.holding = true;
    this.#holdTimer = setTimeout(
      () => {
        this.holding = false;
        this.afterHold();
      },
      settings.reducedMotion ? 350 : 1100,
    );
  }

  /** Po pauze se splněným krokem (Maska tu vyřeší úlohu, kterou maska z minulé úlohy už splňuje). */
  protected afterHold(): void {}

  /** Hádanka je hotová: následuje kvíz, nebo rovnou výsledek. */
  protected solve(): void {
    if (this.quiz.length) this.phase = 'quiz';
    else this.#finish();
  }

  #finish(): void {
    const base = {
      moves: this.moves,
      par: this.par,
      hintsUsed: this.hintsUsed,
      stepHints: this.stepHints,
      quizMistakes: this.quizMistakes,
    };
    const result: LevelResult = { ...base, seals: sealsOf(base) };
    this.result = result;
    this.phase = 'solved';
    this.emit({ kind: 'solved', result });
  }
}
