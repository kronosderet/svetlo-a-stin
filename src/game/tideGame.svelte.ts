import {
  bestOp,
  currentTarget,
  initTide,
  par as computePar,
  pull as pullLever,
  taskLimit,
  type Spill,
  type TideOp,
  type TideState,
} from '../core/puzzles/tide';
import type { TideLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

/** Reaktivní obal kolem Přílivu: páky posunu a ±1. */
export class TideGame extends BaseGame<TideLevel> {
  readonly kind = 'tide';

  state: TideState = $state(null as unknown as TideState);
  history: TideState[] = $state([]);
  /** Poslední tah pro animaci (n roste s každým tahem). */
  lastPull: { op: TideOp; spill: Spill; n: number } | null = $state(null);
  /** Páky použité v každé splněné zkoušce (zápisník). */
  trails: TideOp[][] = $state([]);
  /** Dosažený cíl, který během pauzy zůstává na krystalech. */
  held: { value: number; target: number } | null = $state(null);

  constructor(level: TideLevel, emit: (e: GameEvent) => void) {
    super(level, computePar(level.config), emit);
    this.state = initTide(level.config);
  }

  get moves(): number {
    return this.state.moves;
  }

  get playing(): boolean {
    return this.phase === 'play' && !this.holding && !this.state.complete;
  }

  /** Co ukazují krystaly: během pauzy dosažený cíl. */
  get value(): number {
    return this.holding && this.held ? this.held.value : this.state.value;
  }

  /** Požadovaná váha na kole či misce; null = všechno splněno. */
  get demand(): number | null {
    return this.holding && this.held ? this.held.target : this.target;
  }

  get target(): number | null {
    return currentTarget(this.level.config, this.state);
  }

  /** Kolik tahů ještě Osud dovolí (jen Váhy Osudu). */
  get movesLeft(): number | null {
    const limit = taskLimit(this.level.config, this.state);
    return limit === null ? null : limit - this.state.taskMoves;
  }

  get limit(): number | null {
    return taskLimit(this.level.config, this.state);
  }

  /** Páka zvýrazněná nápovědou 3. stupně. */
  get hintOp(): TideOp | null {
    return this.playing && this.hintLevel >= 3 ? bestOp(this.level.config, this.state) : null;
  }

  /** Ve Vahách Osudu se tahy nevracejí. */
  get canUndo(): boolean {
    return this.playing && !this.level.config.strict && this.history.length > 0;
  }

  pull(op: TideOp): void {
    if (!this.playing) return;
    const before = $state.snapshot(this.state) as TideState;
    const { state, events } = pullLever(this.level.config, before, op);
    if (events.length === 0) return;
    const fresh = events.some((e) => e.type === 'step' || e.type === 'reset');
    this.history = fresh ? [] : [...this.history, before];
    const pulled = events[0].type === 'pull' ? events[0] : null;
    if (pulled) this.lastPull = { op, spill: pulled.spill, n: (this.lastPull?.n ?? 0) + 1 };
    for (const e of events) {
      if (e.type !== 'step') continue;
      this.hintLevel = 0;
      this.trails = [...this.trails, e.trail];
      this.held = { value: e.target, target: e.target };
      this.hold();
    }
    this.state = state;
    for (const event of events) this.emit({ kind: 'tide', event, state });
    if (state.complete) this.solve();
  }

  undo(): void {
    if (!this.canUndo) return;
    this.state = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
  }

  protected resetPuzzle(): void {
    this.state = initTide(this.level.config);
    this.history = [];
    this.lastPull = null;
    this.trails = [];
    this.held = null;
  }
}
