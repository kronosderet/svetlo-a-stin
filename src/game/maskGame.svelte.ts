import {
  applyMask,
  arrive,
  closestMask,
  type MaskConfig,
  currentTask,
  hintBit,
  initMask,
  par as computePar,
  shownTask,
  toggle as toggleMask,
  type MaskEvent,
  type MaskState,
  type MaskTask,
} from '../core/puzzles/mask';
import type { MaskLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';
import { maskStep } from './stepWords';

export interface MaskView {
  task: MaskTask;
  mask: number;
  /** Splněná úloha (během pauzy): výsledek i zpráva zůstanou vidět. */
  done: boolean;
}

/** Reaktivní obal kolem Masky: bitové operace s oktávou a šifra. */
export class MaskGame extends BaseGame<MaskLevel> {
  readonly kind = 'mask';

  state: MaskState = $state(initMask());
  held: MaskView | null = $state(null);

  constructor(level: MaskLevel, emit: (e: GameEvent) => void) {
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

  get view(): MaskView {
    if (this.holding && this.held) return this.held;
    return { task: shownTask(this.level.config, this.state), mask: this.state.mask, done: this.state.complete };
  }

  get hintTarget(): number | null {
    return this.playing && this.hintLevel >= 3 ? hintBit(this.level.config, this.state) : null;
  }

  /** Ukázka kroku s důvodem: co má runa na zvýrazněném krystalu udělat a jak k tomu musí svítit maska. */
  get stepHint(): string | null {
    const bit = this.hintTarget;
    if (bit === null) return null;
    const on = ((this.state.mask >> bit) & 1) === 1;
    return maskStep(this.view.task, bit, !on);
  }

  get canUndo(): boolean {
    return false;
  }

  protected taskCount(cfg: MaskConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: MaskConfig, k: number): MaskConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešená maska: runa z ní složí přesně to, co oltář žádal. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    this.state = { ...this.state, step: cfg.tasks.length, complete: true, mask: closestMask(task, cfg.bits, 0) ?? 0 };
  }

  undo(): void {
    /* Krystal masky jde přepnout zpátky jedním dotekem. */
  }

  toggle(bit: number): void {
    if (this.free) {
      // Volná hra: maska se dál přepíná a runa skládá výsledek, nic se nepočítá.
      const mask = this.state.mask ^ (1 << bit);
      const task = this.view.task;
      this.state = { ...this.state, mask };
      const result = applyMask(task.op, task.value, mask);
      this.emit({ kind: 'mask', event: { type: 'toggle', bit, on: ((mask >> bit) & 1) === 1, result }, state: this.state });
      return;
    }
    if (!this.playing) return;
    const before = $state.snapshot(this.state) as MaskState;
    this.#apply(before, before.mask ^ (1 << bit), toggleMask(this.level.config, before, bit));
  }

  /** Úloha s klíčem z minulé úlohy se vyřeší sama, až zmizí předchozí výsledek (písmeno po písmenu). */
  protected afterHold(): void {
    if (this.phase !== 'play') return;
    const before = $state.snapshot(this.state) as MaskState;
    this.#apply(before, before.mask, arrive(this.level.config, before));
  }

  #apply(before: MaskState, mask: number, r: { state: MaskState; events: MaskEvent[] }): void {
    if (r.events.length === 0) return;
    if (r.events.some((e) => e.type === 'step')) {
      this.hintLevel = 0;
      this.held = { task: shownTask(this.level.config, before), mask, done: true };
      this.hold();
    }
    this.state = r.state;
    for (const event of r.events) this.emit({ kind: 'mask', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
