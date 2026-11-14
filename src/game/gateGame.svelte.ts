import type { Rune } from '../core/logic';
import {
  currentTask,
  hint,
  initGate,
  nextRune,
  par as computePar,
  setRune,
  shownTask,
  test as runTest,
  toggleInput as flipInput,
  type GateEvent,
  type GateState,
  type GateTask,
} from '../core/puzzles/gate';
import type { GateLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

export interface GateView {
  task: GateTask;
  inputs: number;
  runes: Record<string, Rune>;
  tried: number[];
  failed: number[] | null;
}

/** Reaktivní obal kolem Brány: zkoumání run a vkládání run do kamenů. */
export class GateGame extends BaseGame<GateLevel> {
  readonly kind = 'gate';

  state: GateState = $state(initGate());
  /** Otevřený obvod, který během pauzy po splněné úloze zůstává vidět. */
  held: GateView | null = $state(null);

  constructor(level: GateLevel, emit: (e: GameEvent) => void) {
    super(level, computePar(level.config), emit);
  }

  get moves(): number {
    return this.state.moves;
  }

  get playing(): boolean {
    return this.phase === 'play' && !this.holding && currentTask(this.level.config, this.state) !== null;
  }

  get view(): GateView {
    if (this.holding && this.held) return this.held;
    const { inputs, runes, tried, failed } = this.state;
    return { task: shownTask(this.level.config, this.state), inputs, runes, tried, failed };
  }

  /** Nápověda 3. stupně: vstup k přepnutí, nebo kámen a runa, která do něj patří. */
  get hintTarget(): ReturnType<typeof hint> {
    return this.playing && this.hintLevel >= 3 ? hint(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return false;
  }

  undo(): void {
    /* Brána nemá co vracet: runy jde kdykoli vyměnit a vstupy přepnout zpátky. */
  }

  toggleInput(index: number): void {
    if (!this.playing) return;
    this.#apply(flipInput(this.level.config, $state.snapshot(this.state) as GateState, index));
  }

  /** Kliknutí na prázdný kámen: další runa z nabídky. */
  cycleRune(node: string): void {
    if (!this.playing) return;
    const rune = nextRune(this.level.config, this.state, node);
    if (rune) this.#apply(setRune(this.level.config, $state.snapshot(this.state) as GateState, node, rune));
  }

  test(): void {
    if (!this.playing) return;
    this.#apply(runTest(this.level.config, $state.snapshot(this.state) as GateState));
  }

  #apply(r: { state: GateState; events: GateEvent[] }): void {
    if (r.events.length === 0) return;
    if (r.events.some((e) => e.type === 'step')) {
      this.hintLevel = 0;
      // Splněný obvod chvíli zůstane rozsvícený, než přijde další (jádro už vstupy i runy vynulovalo).
      const before = this.state;
      const tried = r.events.find((e): e is Extract<GateEvent, { type: 'tried' }> => e.type === 'tried');
      this.held = {
        task: shownTask(this.level.config, before),
        inputs: tried ? tried.row : before.inputs,
        runes: before.runes,
        tried: tried ? [...before.tried, tried.row] : before.tried,
        failed: null,
      };
      this.hold();
    }
    this.state = r.state;
    for (const event of r.events) this.emit({ kind: 'gate', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
