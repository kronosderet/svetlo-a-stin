import type { Rune } from '../core/logic';
import {
  confirm as confirmTable,
  currentTask,
  hint,
  initTable,
  par as computePar,
  pick as pickRune,
  shownTask,
  tableOf,
  type TableConfig,
  toggleCell as flipCell,
  type TableEvent,
  type TableState,
  type TableTask,
} from '../core/puzzles/table';
import type { TableLevel } from '../content/types';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

export interface TableView {
  task: TableTask;
  cells: number;
  wrongRow: number | null;
  wrongPicks: Rune[];
  /** Pozná-li hráč runu, závoj spadne. */
  revealed: boolean;
}

/** Reaktivní obal kolem Desky zákona: vyplnění tabulky a poznání runy. */
export class TableGame extends BaseGame<TableLevel> {
  readonly kind = 'table';

  state: TableState = $state(initTable());
  held: TableView | null = $state(null);

  constructor(level: TableLevel, emit: (e: GameEvent) => void) {
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

  get view(): TableView {
    if (this.holding && this.held) return this.held;
    const { cells, wrongRow, wrongPicks } = this.state;
    return { task: shownTask(this.level.config, this.state), cells, wrongRow, wrongPicks, revealed: this.state.complete };
  }

  get hintTarget(): ReturnType<typeof hint> {
    return this.playing && this.hintLevel >= 3 ? hint(this.level.config, this.state) : null;
  }

  get canUndo(): boolean {
    return false;
  }

  protected taskCount(cfg: TableConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: TableConfig, k: number): TableConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešená deska: vyplněná podle zákona, runa pod závojem odhalená. */
  protected showSolved(): void {
    const cfg = this.level.config;
    const task = cfg.tasks[cfg.tasks.length - 1];
    const cells = task.mode === 'fill' ? tableOf(task).reduce((m, v, r) => m | (v << r), 0) : 0;
    this.state = { ...this.state, step: cfg.tasks.length, complete: true, cells, wrongRow: null, wrongPicks: [] };
  }

  undo(): void {
    /* Buňky desky jde přepnout zpátky jedním kliknutím. */
  }

  toggleCell(row: number): void {
    if (this.free) {
      // Volná hra: na hotové desce jdou řádky dál přepínat, nic se nepočítá.
      if (this.view.task.mode !== 'fill') return;
      const cells = this.state.cells ^ (1 << row);
      this.state = { ...this.state, cells };
      this.emit({ kind: 'table', event: { type: 'cell', row, on: ((cells >> row) & 1) === 1 }, state: this.state });
      return;
    }
    if (!this.playing) return;
    this.#apply(flipCell(this.level.config, $state.snapshot(this.state) as TableState, row));
  }

  confirm(): void {
    if (!this.playing) return;
    this.#apply(confirmTable(this.level.config, $state.snapshot(this.state) as TableState));
  }

  pick(rune: Rune): void {
    if (!this.playing) return;
    this.#apply(pickRune(this.level.config, $state.snapshot(this.state) as TableState, rune));
  }

  #apply(r: { state: TableState; events: TableEvent[] }): void {
    if (r.events.length === 0) return;
    if (r.events.some((e) => e.type === 'step')) {
      this.hintLevel = 0;
      const before = this.state;
      this.held = { task: shownTask(this.level.config, before), cells: before.cells, wrongRow: null, wrongPicks: before.wrongPicks, revealed: true };
      this.hold();
    }
    this.state = r.state;
    for (const event of r.events) this.emit({ kind: 'table', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
