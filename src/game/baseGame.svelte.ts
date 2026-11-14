import type { AltarEvent, AltarState } from '../core/puzzles/altar';
import type { CascadeEvent, CascadeState } from '../core/puzzles/cascade';
import type { InscriptionEvent, InscriptionState } from '../core/puzzles/inscription';
import type { TideEvent, TideState } from '../core/puzzles/tide';
import type { LevelDef, QuizQuestion } from '../content/types';
import { settings } from './settings.svelte.ts';

export interface LevelResult {
  moves: number;
  par: number;
  hintsUsed: number;
  seals: { solved: boolean; skill: boolean; pure: boolean };
}

export type GameEvent =
  | { kind: 'altar'; event: AltarEvent; state: AltarState }
  | { kind: 'inscription'; event: InscriptionEvent; state: InscriptionState }
  | { kind: 'cascade'; event: CascadeEvent; state: CascadeState }
  | { kind: 'tide'; event: TideEvent; state: TideState }
  | { kind: 'hint'; level: number }
  | { kind: 'quiz'; correct: boolean; question: number }
  | { kind: 'solved'; result: LevelResult };

export type Phase = 'play' | 'quiz' | 'solved';

/**
 * Společný průběh komnaty bez ohledu na archetyp: nápovědy, závěrečný kvíz, pečetě.
 * Potomek drží stav hádanky a volá solve(), když je hádanka hotová.
 */
export abstract class BaseGame<L extends LevelDef = LevelDef> {
  readonly level: L;
  readonly par: number;

  /** Stupeň nápovědy pro aktuální cíl (po splnění cíle se nuluje). */
  hintLevel = $state(0);
  /** Celkový počet použitých nápověd v komnatě (pro pečeť odvahy). */
  hintsUsed = $state(0);
  phase: Phase = $state('play');
  quizIndex = $state(0);
  quizWrong: number[] = $state([]);
  quizAnswered = $state(false);
  result: LevelResult | null = $state(null);
  /** Krátká pauza po splněném kroku: výsledek zůstane chvíli vidět, než přijde další úloha. */
  holding = $state(false);
  #holdTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly emit: (e: GameEvent) => void;

  constructor(level: L, par: number, emit: (e: GameEvent) => void) {
    this.level = level;
    this.par = par;
    this.emit = emit;
  }

  abstract get moves(): number;
  abstract get canUndo(): boolean;
  abstract undo(): void;
  /** Vrátí hádanku do počátečního stavu. */
  protected abstract resetPuzzle(): void;

  get question(): QuizQuestion | null {
    return this.level.quiz?.[this.quizIndex] ?? null;
  }

  restart(): void {
    clearTimeout(this.#holdTimer);
    this.holding = false;
    this.resetPuzzle();
    this.hintLevel = 0;
    this.hintsUsed = 0;
    this.phase = 'play';
    this.quizIndex = 0;
    this.quizWrong = [];
    this.quizAnswered = false;
    this.result = null;
  }

  useHint(): void {
    if (this.phase !== 'play' || this.hintLevel >= 3) return;
    this.hintLevel += 1;
    this.hintsUsed += 1;
    this.emit({ kind: 'hint', level: this.hintLevel });
  }

  answer(option: number): void {
    const q = this.question;
    if (!q || this.quizAnswered || this.quizWrong.includes(option)) return;
    const correct = option === q.correct;
    if (correct) this.quizAnswered = true;
    else this.quizWrong = [...this.quizWrong, option];
    this.emit({ kind: 'quiz', correct, question: this.quizIndex });
  }

  continueQuiz(): void {
    if (!this.quizAnswered) return;
    if (this.quizIndex + 1 < (this.level.quiz?.length ?? 0)) {
      this.quizIndex++;
      this.quizWrong = [];
      this.quizAnswered = false;
    } else {
      this.#finish();
    }
  }

  /** Podrží splněný krok na očích; potomek mezitím nepřijímá tahy. */
  protected hold(): void {
    clearTimeout(this.#holdTimer);
    this.holding = true;
    this.#holdTimer = setTimeout(() => (this.holding = false), settings.reducedMotion ? 350 : 1100);
  }

  /** Hádanka je hotová: následuje kvíz, nebo rovnou výsledek. */
  protected solve(): void {
    if (this.level.quiz?.length) this.phase = 'quiz';
    else this.#finish();
  }

  #finish(): void {
    const moves = this.moves;
    const result: LevelResult = {
      moves,
      par: this.par,
      hintsUsed: this.hintsUsed,
      seals: { solved: true, skill: moves <= this.par, pure: this.hintsUsed === 0 },
    };
    this.result = result;
    this.phase = 'solved';
    this.emit({ kind: 'solved', result });
  }
}
