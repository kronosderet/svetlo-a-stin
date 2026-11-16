import {
  hintBit,
  initAltar,
  par as computePar,
  toggle as toggleAltar,
  type AltarConfig,
  type AltarState,
} from '../core/puzzles/altar';
import type { AltarLevel } from '../content/types';
import { flipBit, isBitSet } from '../core/bits';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

/** Reaktivní obal kolem čisté logiky oltáře (a počítadla, které na něm stojí). */
export class AltarGame extends BaseGame<AltarLevel> {
  readonly kind = 'altar';

  state: AltarState = $state(null as unknown as AltarState);
  history: AltarState[] = $state([]);

  constructor(level: AltarLevel, emit: (e: GameEvent) => void) {
    super(level, computePar, emit);
    this.state = initAltar(level.config);
  }

  get moves(): number {
    return this.state.moves;
  }

  get step(): number {
    return this.state.step;
  }

  /** Krystal zvýrazněný nápovědou 3. stupně. */
  get hintTarget(): number | null {
    return this.phase === 'play' && this.hintLevel >= 3 ? hintBit(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return this.phase === 'play' && this.history.length > 0;
  }

  toggle(bit: number): void {
    if (this.free) {
      // Volná hra: krystal se přepne, nic se nepočítá.
      const mask = flipBit(this.state.mask, bit);
      this.state = { ...this.state, mask };
      this.emit({ kind: 'altar', event: { type: 'toggle', bit, on: isBitSet(mask, bit) }, state: this.state });
      return;
    }
    if (this.phase !== 'play') return;
    const before = $state.snapshot(this.state) as AltarState;
    const { state, events } = toggleAltar(this.level.config, before, bit);
    if (events.length === 0) return;

    // Undo funguje jen v rámci aktuálního cíle; splněný cíl se nevrací.
    const advanced = events.some((e) => e.type === 'step' || e.type === 'found' || e.type === 'reset');
    this.history = advanced ? [] : [...this.history, before];
    if (advanced) this.hintLevel = 0;
    this.state = state;

    for (const event of events) this.emit({ kind: 'altar', event, state });
    if (state.complete) this.solve();
  }

  protected taskCount(cfg: AltarConfig): number {
    return cfg.goal.kind === 'all' ? 1 : cfg.goal.targets.length;
  }

  protected sliceTasks(cfg: AltarConfig, k: number): AltarConfig {
    return cfg.goal.kind === 'all' ? cfg : { ...cfg, goal: { ...cfg.goal, targets: cfg.goal.targets.slice(0, k + 1) } };
  }

  /** Vyřešený cíl: krystaly svítí přesně podle něj. */
  protected showSolved(): void {
    const goal = this.level.config.goal;
    if (goal.kind === 'all') return;
    this.state = { ...this.state, mask: goal.targets[goal.targets.length - 1], step: goal.targets.length, complete: true };
  }

  undo(): void {
    if (!this.canUndo) return;
    const prev = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
    // Odhalené váhy zůstávají: co hráč zjistil, už ví. Vrácený dotek se do tahů počítá dál.
    this.state = { ...prev, revealed: this.state.revealed, moves: this.state.moves };
  }
}
