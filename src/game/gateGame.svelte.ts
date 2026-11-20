import type { Rune } from '../core/logic';
import {
  currentTask,
  hint,
  initGate,
  nextRune,
  nextSource,
  par as computePar,
  setRune,
  setWire,
  shownTask,
  solutions,
  type GateConfig,
  test as runTest,
  toggleInput as flipInput,
  type GateEvent,
  type GateState,
  type GateTask,
} from '../core/puzzles/gate';
import type { GateLevel } from '../content/types';
import { RUNE_NAME, RUNE_RULE } from '../content/runes';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

export interface GateView {
  task: GateTask;
  inputs: number;
  runes: Record<string, Rune>;
  wires: Record<string, string>;
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

  get view(): GateView {
    if (this.holding && this.held) return this.held;
    const { inputs, runes, wires, tried, failed } = this.state;
    return { task: shownTask(this.level.config, this.state), inputs, runes, wires, tried, failed };
  }

  /** Nápovědy aktuální úlohy, když má vlastní (zkoumání nebo větvení mezi řetězy); jinak null. */
  get taskHints(): readonly string[] | null {
    return currentTask(this.level.config, this.state)?.hints ?? null;
  }

  /** Nápověda 3. stupně: vstup k přepnutí, nebo kámen a runa, která do něj patří. */
  get hintTarget(): ReturnType<typeof hint> {
    return this.playing && this.hintLevel >= 3 ? hint(this.level.config, this.state) : null;
  }

  /** Ukázka kroku slovy: jaká runa patří do zvýrazněného kamene a proč, nebo že zbývá Zkouška. */
  get stepHint(): string | null {
    if (!this.playing || this.hintLevel < 3) return null;
    const task = currentTask(this.level.config, this.state);
    if (task?.mode !== 'slots') return null;
    const h = hint(this.level.config, this.state);
    if (!h) return 'Obvod je hotový. Spusť Zkoušku.';
    if ('node' in h) return `Do zvýrazněného kamene patří ${RUNE_NAME[h.rune]}: ${RUNE_RULE[h.rune]}.`;
    return null;
  }

  /** Obvod je hotový a ukázka kroku ukazuje na Zkoušku. */
  get hintTest(): boolean {
    return this.hintLevel >= 3 && this.playing && currentTask(this.level.config, this.state)?.mode === 'slots' && !this.hintTarget;
  }

  get canUndo(): boolean {
    return false;
  }

  protected taskCount(cfg: GateConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: GateConfig, k: number): GateConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešený obvod: kameny osazené podle řešení, u zkoumání všechny kombinace vyzkoušené. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    const sol = task.mode === 'slots' ? solutions(task)[0] : undefined;
    const rows = Array.from({ length: 2 ** task.circuit.inputs.length }, (_, r) => r);
    this.state = {
      ...this.state,
      step: cfg.tasks.length,
      complete: true,
      inputs: 0,
      runes: sol?.runes ?? {},
      wires: sol?.wires ?? {},
      tried: task.mode === 'explore' ? rows : [0],
      failed: null,
    };
  }

  undo(): void {
    /* Brána nemá co vracet: runy jde kdykoli vyměnit a vstupy přepnout zpátky. */
  }

  /** Volná hra: stav, jako by poslední úloha běžela (najde kameny a vstupy obvodu na desce). */
  get #live(): GateState {
    return { ...this.state, step: this.level.config.tasks.length - 1, complete: false };
  }

  toggleInput(index: number): void {
    if (this.free) {
      // Volná hra: vstupy se přepínají a lampa ukazuje, co k ní doteče. Nic se nepočítá.
      const n = this.view.task.circuit.inputs.length;
      if (index < 0 || index >= n) return;
      const inputs = this.state.inputs ^ (1 << (n - 1 - index));
      this.state = { ...this.state, inputs };
      this.emit({ kind: 'gate', event: { type: 'input', index, on: ((inputs >> (n - 1 - index)) & 1) === 1 }, state: this.state });
      return;
    }
    if (!this.playing) return;
    this.#apply(flipInput(this.level.config, $state.snapshot(this.state) as GateState, index));
  }

  /** Kliknutí na prázdný kámen: další runa z nabídky. */
  cycleRune(node: string): void {
    if (this.free) {
      const rune = nextRune(this.level.config, this.#live, node);
      if (!rune) return;
      this.state = { ...this.state, runes: { ...this.state.runes, [node]: rune } };
      this.emit({ kind: 'gate', event: { type: 'rune', node, rune }, state: this.state });
      return;
    }
    if (!this.playing) return;
    const rune = nextRune(this.level.config, this.state, node);
    if (rune) this.#apply(setRune(this.level.config, $state.snapshot(this.state) as GateState, node, rune));
  }

  /** Kliknutí na točitý kámen: pootočí ho k dalšímu zdroji světla. */
  cycleWire(key: string): void {
    if (this.free) {
      const source = nextSource(this.level.config, this.#live, key);
      if (!source) return;
      this.state = { ...this.state, wires: { ...this.state.wires, [key]: source } };
      this.emit({ kind: 'gate', event: { type: 'wire', key, source }, state: this.state });
      return;
    }
    if (!this.playing) return;
    const source = nextSource(this.level.config, this.state, key);
    if (source) this.#apply(setWire(this.level.config, $state.snapshot(this.state) as GateState, key, source));
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
        wires: before.wires,
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
