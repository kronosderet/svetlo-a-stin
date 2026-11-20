import {
  applyOp,
  bestOp,
  currentTarget,
  initTide,
  par as computePar,
  pathFits,
  pull as pullLever,
  taskLimit,
  taskStart,
  type Spill,
  type TideConfig,
  type TideOp,
  type TideState,
} from '../core/puzzles/tide';
import type { TideLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';
import { tideStep } from './stepWords';

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
  held: { value: number; target: number; show?: string; start: number; trail: TideOp[] } | null = $state(null);

  constructor(level: TideLevel, emit: (e: GameEvent) => void) {
    super(level, computePar, emit);
    this.state = initTide(level.config);
  }

  get moves(): number {
    return this.state.moves;
  }

  get step(): number {
    return this.state.step;
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

  /** Co ukazuje kolo: vlastní nápis úlohy (÷ 8, −3), jinak cílová váha; null = hotovo. */
  get demandShown(): number | string | null {
    if (this.holding && this.held) return this.held.show ?? this.held.target;
    const t = this.state.complete ? null : this.level.config.tasks[this.state.step];
    return t ? (t.show ?? t.target) : null;
  }

  /** Miska zbytku: světla, která v aktuální zkoušce spadla přes pravý okraj (při samých posunech vpravo). */
  get remainder(): { bits: number; value: number } {
    const start = this.holding && this.held ? this.held.start : taskStart(this.level.config, this.state.step);
    const trail = this.holding && this.held ? this.held.trail : this.state.trail;
    const bits = trail.filter((o) => o === 'shr').length;
    return { bits, value: start & ((1 << bits) - 1) };
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

  /**
   * Páka zvýrazněná nápovědou 3. stupně. Ve Vahách Osudu žádná, když se nejkratší cesta do zbylých
   * tahů nevejde: misky se stejně vrátí a ukázka kroku řekne cestu od začátku zkoušky.
   */
  get hintOp(): TideOp | null {
    if (!this.playing || this.hintLevel < 3 || !pathFits(this.level.config, this.state)) return null;
    return bestOp(this.level.config, this.state);
  }

  /** Ukázka kroku s důvodem: nejkratší cesta k cíli a její první páka. */
  get stepHint(): string | null {
    return this.playing && this.hintLevel >= 3 ? tideStep(this.level.config, this.state) : null;
  }

  /** Ve Vahách Osudu se tahy nevracejí. */
  get canUndo(): boolean {
    return this.playing && !this.level.config.strict && this.history.length > 0;
  }

  pull(op: TideOp): void {
    if (this.free) {
      // Volná hra: páky dál posouvají světlo, nic se nepočítá.
      if (!this.level.config.ops.includes(op)) return;
      const from = this.state.value;
      const { value, spill } = applyOp(op, from, this.level.config.bits);
      this.state = { ...this.state, value };
      this.lastPull = { op, spill, n: (this.lastPull?.n ?? 0) + 1 };
      this.emit({ kind: 'tide', event: { type: 'pull', op, from, to: value, spill }, state: this.state });
      return;
    }
    if (!this.playing) return;
    const shown = this.hintOp;
    const before = $state.snapshot(this.state) as TideState;
    const { state, events } = pullLever(this.level.config, before, op);
    if (events.length === 0) return;
    const fresh = events.some((e) => e.type === 'step' || e.type === 'reset');
    this.history = fresh ? [] : [...this.history, before];
    // Jeden krok na stisk (R2): po zvýrazněné páce ukáže další páku až další stisk (splněná zkouška nuluje níž).
    if (shown === op) this.hintLevel = 2;
    const pulled = events[0].type === 'pull' ? events[0] : null;
    if (pulled) this.lastPull = { op, spill: pulled.spill, n: (this.lastPull?.n ?? 0) + 1 };
    for (const e of events) {
      if (e.type !== 'step') continue;
      this.hintLevel = 0;
      this.trails = [...this.trails, e.trail];
      this.held = {
        value: e.target,
        target: e.target,
        show: this.level.config.tasks[e.index].show,
        start: taskStart(this.level.config, e.index),
        trail: e.trail,
      };
      this.hold();
    }
    this.state = state;
    for (const event of events) this.emit({ kind: 'tide', event, state });
    if (state.complete) this.solve();
  }

  protected taskCount(cfg: TideConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: TideConfig, k: number): TideConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešená zkouška: světlo váží přesně tolik, kolik žádala. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    this.state = { ...this.state, step: cfg.tasks.length, complete: true, value: task.target, trail: [], taskMoves: 0 };
  }

  undo(): void {
    if (!this.canUndo) return;
    // Ukázka kroku bez páky poslala ke Zpět (k cíli cesta nevedla): jeden krok na stisk i tady (R2).
    if (this.hintLevel >= 3 && !this.hintOp) this.hintLevel = 2;
    // Světlo se vrátí, ale tah pákou se do počtu tahů počítá dál.
    this.state = { ...this.history[this.history.length - 1], moves: this.state.moves };
    this.history = this.history.slice(0, -1);
  }
}
