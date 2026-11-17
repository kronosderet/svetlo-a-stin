import {
  answer,
  confirm as confirmCascade,
  currentTask,
  firstWrong,
  initCascade,
  par as computePar,
  shownTask,
  toggle as toggleCell,
  type CascadeCell,
  type CascadeConfig,
  type CascadeEvent,
  type CascadeState,
  type CascadeTask,
} from '../core/puzzles/cascade';
import type { CascadeLevel } from '../content/types';
import { flipBit, isBitSet } from '../core/bits';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';
import { cascadeStep } from './cascadeWords';

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

  // Ukázková úloha začíná s přenosy na místě, proto se stav zakládá podle zadání.
  state: CascadeState = $state(initCascade(this.level.config));
  /** Historie doteků v aktuální úloze (pro undo). */
  history: CascadeState[] = $state([]);
  /** Přijatý výsledek, který během pauzy zůstává na stěně. */
  held: CascadeView | null = $state(null);

  constructor(level: CascadeLevel, emit: (e: GameEvent) => void) {
    super(level, computePar, emit);
  }

  get moves(): number {
    return this.state.moves;
  }

  get step(): number {
    return this.state.step;
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

  /** Ukázka kroku s důvodem: kolik světla se ve sloupci slévá a co z toho zůstane a přeteče. */
  get stepHint(): string | null {
    return this.hintCell ? cascadeStep(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return this.playing && this.history.length > 0;
  }

  toggle(cell: CascadeCell): void {
    if (this.free) {
      // Volná hra: krystaly výsledku i přenosů jdou přepínat a světla se přesouvají, nic se nepočítá.
      const key = ({ result: 'result', carry: 'carries', far: 'far', copy: 'copies' } as const)[cell.row];
      const value = flipBit(this.state[key], cell.column);
      this.state = { ...this.state, [key]: value };
      this.emit({ kind: 'cascade', event: { type: 'toggle', cell, on: isBitSet(value, cell.column) }, state: this.state });
      return;
    }
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

  protected taskCount(cfg: CascadeConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: CascadeConfig, k: number): CascadeConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešený součet: výsledek i přenosy rozsvícené, světla odtečou na svá místa. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    const a = answer(cfg, task);
    const manual = cfg.carries === 'manual';
    this.state = {
      ...this.state,
      step: cfg.tasks.length,
      complete: true,
      result: a.result,
      carries: manual ? a.carries : 0,
      far: manual ? a.far : 0,
      copies: task.op === 'mul' && cfg.pickCopies ? task.operands[1] : 0,
      wrong: null,
    };
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
