import {
  hintBit,
  initAltar,
  par as computePar,
  toggle as toggleAltar,
  type AltarState,
} from '../core/puzzles/altar';
import type { AltarLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

/** Reaktivní obal kolem čisté logiky oltáře (a počítadla, které na něm stojí). */
export class AltarGame extends BaseGame<AltarLevel> {
  readonly kind = 'altar';

  state: AltarState = $state(null as unknown as AltarState);
  history: AltarState[] = $state([]);

  constructor(level: AltarLevel, emit: (e: GameEvent) => void) {
    super(level, computePar(level.config), emit);
    this.state = initAltar(level.config);
  }

  get moves(): number {
    return this.state.moves;
  }

  /** Krystal zvýrazněný nápovědou 3. stupně. */
  get hintTarget(): number | null {
    return this.phase === 'play' && this.hintLevel >= 3 ? hintBit(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return this.phase === 'play' && this.history.length > 0;
  }

  toggle(bit: number): void {
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

  undo(): void {
    if (!this.canUndo) return;
    const prev = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
    // Odhalené váhy zůstávají: co hráč zjistil, už ví. Vrácený dotek se do tahů počítá dál.
    this.state = { ...prev, revealed: this.state.revealed, moves: this.state.moves };
  }
}
