import type { Rune } from '../core/logic';
import {
  currentTask,
  fromDark,
  hasPulse,
  hint,
  hintFollowed,
  initMachine,
  nearestSolution,
  nextRune,
  nextSource,
  par as computePar,
  pulse as beatOnce,
  setRune,
  setWire,
  settle,
  shownTask,
  solutions,
  test as runTest,
  toggleInput as flipInput,
  beat,
  type Failure,
  type MachineConfig,
  type MachineEvent,
  type MachineState,
  type MachineTask,
} from '../core/puzzles/machine';
import type { MachineLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';
import { buildStepWords } from './machineWords';

export interface MachineView {
  task: MachineTask;
  inputs: number;
  runes: Record<string, Rune>;
  wires: Record<string, string>;
  memory: Record<string, number>;
  tried: number[];
  goal: number;
  failed: Failure | null;
  restless: boolean;
}

/** Reaktivní obal kolem Dílny: zkoumání strojů, cíle s tepem a stavba z run a součástek. */
export class MachineGame extends BaseGame<MachineLevel> {
  readonly kind = 'machine';

  state: MachineState = $state(initMachine());
  /** Splněný stroj, který během pauzy po splněné úloze zůstává vidět. */
  held: MachineView | null = $state(null);
  /** Roste s každým tepem (animace srdce). */
  beats = $state(0);

  constructor(level: MachineLevel, emit: (e: GameEvent) => void) {
    super(level, computePar, emit);
    this.state = initMachine(level.config);
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

  get view(): MachineView {
    if (this.holding && this.held) return this.held;
    const { inputs, runes, wires, memory, tried, goal, failed, restless } = this.state;
    return {
      task: shownTask(this.level.config, this.state),
      inputs,
      runes,
      wires,
      memory,
      tried,
      goal,
      failed,
      restless,
    };
  }

  /** Stroj má ozvěny s tepem: ukáže se tlačítko Tep. */
  get canBeat(): boolean {
    return hasPulse(this.view.task.machine);
  }

  /** Nápovědy aktuální úlohy, když má vlastní (druhá úloha chce jinou stavbu); jinak null. Třetí jen u zkoumání a cílů. */
  get taskHints(): readonly (string | undefined)[] | null {
    return currentTask(this.level.config, this.state)?.hints ?? null;
  }

  get hintTarget(): ReturnType<typeof hint> {
    return this.playing && this.hintLevel >= 3 ? hint(this.level.config, this.state) : null;
  }

  /**
   * Ukázka kroku slovy při stavbě: jaká runa patří do zvýrazněného kamene a proč, kam natočit
   * točitý kámen a co z toho místa teče, nebo že je stroj hotový a zbývá Zkouška. Jinde platí
   * nápověda komnaty. Co teče do kamene, odkud má světlo téct, se popisuje podle řešení, ke kterému
   * ukázka míří: jiný točitý kámen může být na desce ještě natočený špatně.
   */
  get stepHint(): string | null {
    if (!this.playing || this.hintLevel < 3) return null;
    const task = currentTask(this.level.config, this.state);
    if (task?.mode !== 'build') return null;
    const sol = nearestSolution(task, this.state);
    return buildStepWords(task.machine, hint(this.level.config, this.state), sol?.runes ?? this.state.runes, sol?.wires ?? this.state.wires);
  }

  /** Stavba je hotová a ukázka kroku ukazuje na Zkoušku. */
  get hintTest(): boolean {
    return this.hintLevel >= 3 && this.playing && currentTask(this.level.config, this.state)?.mode === 'build' && !this.hintTarget;
  }

  get canUndo(): boolean {
    return false;
  }

  undo(): void {
    /* Dílna nemá co vracet: kameny jde kdykoli otočit a vstupy přepnout zpátky. */
  }

  protected taskCount(cfg: MachineConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: MachineConfig, k: number): MachineConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešený stroj: kameny osazené podle řešení, u zkoumání všechny kombinace vyzkoušené. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    const sol = task.mode === 'build' ? solutions(task, 1)[0] : undefined;
    const runes = sol?.runes ?? {};
    const wires = sol?.wires ?? {};
    const settled = settle(task.machine, runes, wires, 0, {});
    const memory: Record<string, number> = {};
    for (const [k, v] of Object.entries(settled.values)) if (v !== null) memory[k] = v;
    this.state = {
      ...this.state,
      step: cfg.tasks.length,
      complete: true,
      inputs: 0,
      runes,
      wires,
      memory,
      tried: task.mode === 'explore' ? Array.from({ length: 2 ** task.machine.inputs.length }, (_, r) => r) : [0],
      goal: task.goals?.length ?? 0,
      failed: null,
      restless: !settled.stable,
    };
  }

  /** Volná hra: stav, jako by poslední úloha běžela. */
  get #liveTask(): MachineTask {
    return this.level.config.tasks[this.level.config.tasks.length - 1];
  }

  /** Volná hra: po každé změně se stroj ustálí, nic se nepočítá. */
  #freeSettle(next: Pick<MachineState, 'inputs' | 'runes' | 'wires'>): void {
    const task = this.#liveTask;
    const s = settle(task.machine, next.runes, next.wires, next.inputs, this.state.memory);
    const memory: Record<string, number> = {};
    for (const g of task.machine.nodes)
      for (const [k, v] of Object.entries(s.values)) if (k === g.id || k.startsWith(g.id + '.')) memory[k] = v ?? 0;
    this.state = { ...this.state, ...next, memory, restless: !s.stable };
  }

  toggleInput(index: number): void {
    if (this.free) {
      const n = this.#liveTask.machine.inputs.length;
      if (index < 0 || index >= n) return;
      const inputs = this.state.inputs ^ (1 << (n - 1 - index));
      this.#freeSettle({
        inputs,
        runes: this.state.runes,
        wires: this.state.wires,
      });
      this.emit({
        kind: 'machine',
        event: {
          type: 'input',
          index,
          on: ((inputs >> (n - 1 - index)) & 1) === 1,
        },
        state: this.state,
      });
      return;
    }
    if (!this.playing) return;
    this.#apply(flipInput(this.level.config, $state.snapshot(this.state) as MachineState, index));
  }

  /** Tep Srdce. */
  pulse(): void {
    if (this.free) {
      const task = this.#liveTask;
      if (!hasPulse(task.machine)) return;
      const b = beat(task.machine, this.state.runes, this.state.wires, this.state.inputs, this.state.memory);
      this.state = {
        ...this.state,
        memory: b.memory,
        restless: !b.settled.stable,
      };
      this.beats += 1;
      this.emit({
        kind: 'machine',
        event: { type: 'pulse' },
        state: this.state,
      });
      return;
    }
    if (!this.playing) return;
    this.beats += 1;
    this.#apply(beatOnce(this.level.config, $state.snapshot(this.state) as MachineState));
  }

  /** Od tmy: vstupy zhasnou a paměť začne jako při Zkoušce. Není to tah, kameny ani chyba se nesmažou. */
  resetMemory(): void {
    if (this.free) {
      const r = fromDark({ tasks: [this.#liveTask] }, { ...($state.snapshot(this.state) as MachineState), step: 0, complete: false });
      if (!r.events.length) return;
      const { inputs, memory, restless } = r.state;
      this.state = { ...this.state, inputs, memory, restless };
      for (const event of r.events) this.emit({ kind: 'machine', event, state: this.state });
      return;
    }
    if (!this.playing) return;
    this.#apply(fromDark(this.level.config, $state.snapshot(this.state) as MachineState));
  }

  cycleRune(node: string): void {
    if (this.free) {
      const rune = nextRune(this.#liveTask, this.state, node);
      if (!rune) return;
      this.#freeSettle({
        inputs: this.state.inputs,
        runes: { ...this.state.runes, [node]: rune },
        wires: this.state.wires,
      });
      this.emit({
        kind: 'machine',
        event: { type: 'rune', node, rune },
        state: this.state,
      });
      return;
    }
    const task = currentTask(this.level.config, this.state);
    if (!this.playing || !task) return;
    const rune = nextRune(task, this.state, node);
    if (rune) this.#apply(setRune(this.level.config, $state.snapshot(this.state) as MachineState, node, rune));
  }

  cycleWire(key: string): void {
    if (this.free) {
      const source = nextSource(this.#liveTask, this.state, key);
      if (!source) return;
      this.#freeSettle({
        inputs: this.state.inputs,
        runes: this.state.runes,
        wires: { ...this.state.wires, [key]: source },
      });
      this.emit({
        kind: 'machine',
        event: { type: 'wire', key, source },
        state: this.state,
      });
      return;
    }
    const task = currentTask(this.level.config, this.state);
    if (!this.playing || !task) return;
    const source = nextSource(task, this.state, key);
    if (source) this.#apply(setWire(this.level.config, $state.snapshot(this.state) as MachineState, key, source));
  }

  test(): void {
    if (!this.playing) return;
    this.#apply(runTest(this.level.config, $state.snapshot(this.state) as MachineState));
  }

  #apply(r: { state: MachineState; events: MachineEvent[] }): void {
    if (r.events.length === 0) return;
    // Jeden krok na stisk: po kroku, který ukázka ukázala, další krok ukáže až další stisk nápovědy.
    if (this.hintLevel >= 3 && hintFollowed(this.hintTarget, r.events)) this.hintLevel = 2;
    if (r.events.some((e) => e.type === 'goal')) this.hintLevel = 0;
    if (r.events.some((e) => e.type === 'step')) {
      this.hintLevel = 0;
      // Splněný stroj chvíli zůstane rozsvícený, než přijde další (jádro už ho vynulovalo).
      const before = this.state;
      const tried = r.events.find((e): e is Extract<MachineEvent, { type: 'tried' }> => e.type === 'tried');
      const task = shownTask(this.level.config, before);
      // Poslední tah (vstup nebo tep) se do zadrženého stroje promítne podle jádra.
      const last = r.events.find((e) => e.type === 'input' || e.type === 'pulse');
      let inputs = before.inputs;
      let memory = before.memory;
      if (last?.type === 'input') {
        const n = task.machine.inputs.length;
        inputs = before.inputs ^ (1 << (n - 1 - last.index));
        const s = settle(task.machine, before.runes, before.wires, inputs, before.memory);
        memory = Object.fromEntries(Object.entries(s.values).filter(([, v]) => v !== null)) as Record<string, number>;
      } else if (last?.type === 'pulse') {
        memory = beat(task.machine, before.runes, before.wires, before.inputs, before.memory).memory;
      }
      this.held = {
        task,
        inputs,
        runes: before.runes,
        wires: before.wires,
        memory,
        tried: tried ? [...before.tried, tried.row] : before.tried,
        goal: task.goals?.length ?? 0,
        failed: null,
        restless: false,
      };
      this.hold();
    }
    this.state = r.state;
    for (const event of r.events) this.emit({ kind: 'machine', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
