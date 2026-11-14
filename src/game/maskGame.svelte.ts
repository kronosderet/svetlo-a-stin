import {
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
    super(level, computePar(level.config), emit);
  }

  get moves(): number {
    return this.state.moves;
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

  get canUndo(): boolean {
    return false;
  }

  undo(): void {
    /* Krystal masky jde přepnout zpátky jedním dotekem. */
  }

  toggle(bit: number): void {
    if (!this.playing) return;
    const before = $state.snapshot(this.state) as MaskState;
    const r = toggleMask(this.level.config, before, bit);
    if (r.events.length === 0) return;
    if (r.events.some((e) => e.type === 'step')) {
      this.hintLevel = 0;
      this.held = { task: shownTask(this.level.config, before), mask: before.mask ^ (1 << bit), done: true };
      this.hold();
    }
    this.state = r.state;
    for (const event of r.events as MaskEvent[]) this.emit({ kind: 'mask', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
