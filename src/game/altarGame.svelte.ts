import {
  currentClass,
  currentTarget,
  goalCount,
  hintBit,
  initAltar,
  par as computePar,
  toggle as toggleAltar,
  toggleOutcome,
  type AltarConfig,
  type AltarState,
} from '../core/puzzles/altar';
import type { AltarLevel } from '../content/types';
import { flipBit, isBitSet } from '../core/bits';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';
import { counterStep, valueStep } from './stepWords';
import { allStep } from './altarWords';

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

  /**
   * Ukázka kroku s důvodem. U vah: kolik zbývá a jestli se váha vejde, u Počítadla předání
   * zprava. Dokud hráč váhy teprve objevuje (I-4), zůstane u holého zvýraznění, ať ukázka váhu neprozradí.
   */
  get stepHint(): string | null {
    const bit = this.hintTarget;
    if (bit === null) return null;
    const cfg = this.level.config;
    const on = isBitSet(this.state.mask, bit);
    if (cfg.goal.kind === 'all') return allStep(cfg, this.state, bit);
    if (cfg.goal.kind === 'pattern') return on ? 'Ve stěně je tenhle krystal zhasnutý: zvýrazněný krystal zhasni.' : 'Ve stěně tenhle krystal svítí: zvýrazněný krystal rozsviť.';
    if (cfg.goal.kind === 'class') {
      const group = currentClass(cfg, this.state);
      return `${group?.hint ? `${group.hint} ` : ''}Zvýrazněný krystal ${on ? 'zhasni' : 'rozsviť'}.`;
    }
    const known = cfg.reveal !== 'solo' || isBitSet(this.state.revealed, bit);
    const target = currentTarget(cfg, this.state);
    if (!known || target === null) return null;
    // Počítadlo jde zprava: svítící krystal předá světlo doleva, zhasnutý ho přijme.
    if (cfg.hintOrder === 'low') return counterStep(target, bit, this.state.mask);
    return valueStep(target, bit, !on);
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
    const shown = this.hintTarget;
    const before = $state.snapshot(this.state) as AltarState;
    const { state, events } = toggleAltar(this.level.config, before, bit);
    if (events.length === 0) return;

    // Undo funguje jen v rámci aktuálního cíle; splněný cíl ani nalezená kombinace se nevrací.
    // Přerušený tichý krok Zpět vrátí: v historii zůstane cesta před přerušením. Ze slepé uličky
    // ne: ukázka kroku tam sama radí cestu přerušit a Zpět by do uličky jen vrátilo.
    const outcome = toggleOutcome(events);
    const deadEnd = events.some((e) => e.type === 'reset' && e.deadEnd);
    this.history = outcome === 'broken' ? (deadEnd ? [] : [before]) : outcome ? [] : [...this.history, before];
    // Nový cíl začne od náznaku. Jinak dává ukázka kroku jeden krok na stisk (R2): po nalezené
    // kombinaci a po doteku zvýrazněného krystalu se stupeň vrátí na 2.
    if (outcome === 'goal') this.hintLevel = 0;
    else if (outcome || shown === bit) this.hintLevel = Math.min(this.hintLevel, 2);
    this.state = state;

    for (const event of events) this.emit({ kind: 'altar', event, state });
    if (state.complete) this.solve();
  }

  protected taskCount(cfg: AltarConfig): number {
    return cfg.goal.kind === 'all' ? 1 : goalCount(cfg);
  }

  protected sliceTasks(cfg: AltarConfig, k: number): AltarConfig {
    if (cfg.goal.kind === 'all') return cfg;
    if (cfg.goal.kind === 'class') return { ...cfg, goal: { ...cfg.goal, targets: cfg.goal.targets.slice(0, k + 1) } };
    return { ...cfg, goal: { ...cfg.goal, targets: cfg.goal.targets.slice(0, k + 1) } };
  }

  /** Vyřešený cíl: krystaly svítí přesně podle něj (u skupin číslo, které hráč zvolil, jinak první ze skupiny). */
  protected showSolved(): void {
    const goal = this.level.config.goal;
    if (goal.kind === 'all') return;
    const n = goal.targets.length;
    if (goal.kind === 'class') {
      const found = goal.targets.map((t, k) => (t.values.includes(this.state.found[k]) ? this.state.found[k] : t.values[0]));
      this.state = { ...this.state, mask: found[n - 1], found, step: n, complete: true };
      return;
    }
    this.state = { ...this.state, mask: goal.targets[n - 1], step: n, complete: true };
  }

  undo(): void {
    if (!this.canUndo) return;
    const prev = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
    // Odhalené váhy zůstávají: co hráč zjistil, už ví. Vrácený dotek se do tahů (i zbytečných) počítá dál.
    this.state = { ...prev, revealed: this.state.revealed, moves: this.state.moves, strays: this.state.strays };
  }
}
