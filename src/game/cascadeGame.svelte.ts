import {
  confirm as confirmCascade,
  currentTask,
  firstWrong,
  initCascade,
  par as computePar,
  shownTask,
  toggle as toggleCell,
  type CascadeCell,
  type CascadeEvent,
  type CascadeState,
  type CascadeTask,
} from '../core/puzzles/cascade';
import type { CascadeLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

export interface CascadeView {
  task: CascadeTask;
  result: number;
  carries: number;
  far: number;
  copies: number;
}

/** Reaktivní obal kolem Kaskády: počítání pod sebou s krystaly přenosu. */
export class CascadeGame extends BaseGame<CascadeLevel> {
  readonly kind = 'cascade';

  state: CascadeState = $state(initCascade());
  /** Historie doteků v aktuální úloze (pro undo). */
  history: CascadeState[] = $state([]);
  /** Přijatý výsledek, který během pauzy zůstává na stěně. */
  held: CascadeView | null = $state(null);

  constructor(level: CascadeLevel, emit: (e: GameEvent) => void) {
    super(level, computePar(level.config), emit);
  }

  get moves(): number {
    return this.state.moves;
  }

  get playing(): boolean {
    return this.phase === 'play' && !this.holding && currentTask(this.level.config, this.state) !== null;
  }

  /** Co je právě na stěně: během pauzy přijatý výsledek, jinak rozpracovaná úloha. */
  get view(): CascadeView {
    if (this.holding && this.held) return this.held;
    const { result, carries, far, copies } = this.state;
    return { task: this.task, result, carries, far, copies };
  }

  /** Úloha na stěně (po dokončení zůstane vidět ta poslední). */
  get task(): CascadeTask {
    return shownTask(this.level.config, this.state);
  }

  /** Buňka zvýrazněná nápovědou 3. stupně. */
  get hintCell(): CascadeCell | null {
    return this.playing && this.hintLevel >= 3 ? firstWrong(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return this.playing && this.history.length > 0;
  }

  toggle(cell: CascadeCell): void {
    if (!this.playing) return;
    const before = $state.snapshot(this.state) as CascadeState;
    const r = toggleCell(this.level.config, before, cell);
    if (r.events.length === 0) return;
    this.history = [...this.history, before];
    this.#apply(r.state, r.events);
  }

  confirm(): void {
    if (!this.playing) return;
    const before = $state.snapshot(this.state) as CascadeState;
    const r = confirmCascade(this.level.config, before);
    if (r.events.some((e) => e.type === 'step')) {
      this.history = [];
      this.hintLevel = 0;
      this.held = { task: this.task, result: before.result, carries: before.carries, far: before.far, copies: before.copies };
      this.hold();
    }
    this.#apply(r.state, r.events);
  }

  undo(): void {
    if (!this.canUndo) return;
    // Počet potvrzení a chyb zůstává: vrací se jen rozsvícení.
    const prev = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
    this.state = { ...this.state, result: prev.result, carries: prev.carries, far: prev.far, copies: prev.copies, wrong: null };
  }

  #apply(state: CascadeState, events: CascadeEvent[]): void {
    this.state = state;
    for (const event of events) this.emit({ kind: 'cascade', event, state });
    if (state.complete) this.solve();
  }
}
