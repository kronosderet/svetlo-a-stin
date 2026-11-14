/**
 * Archetyp „Deska zákona“: pravdivostní tabulka.
 *  - fill:     u obvodu (nebo jediné runy) hráč rozsvítí, kdy lampa svítí, a potvrdí desku,
 *  - identify: deska je hotová a hráč pozná, která runa se skrývá pod závojem.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { flipBit, isBitSet } from '../bits';
import { rowCount, type Rune } from '../logic';
import { lampTable, type Circuit } from './gate';

export type TableTask =
  | { mode: 'fill'; circuit: Circuit }
  | { mode: 'identify'; circuit: Circuit; choices: Rune[]; answer: Rune };

export interface TableConfig {
  tasks: TableTask[];
}

export interface TableState {
  step: number;
  /** fill: rozsvícené buňky lampy (bit r = řádek r). */
  cells: number;
  moves: number;
  mistakes: number;
  /** fill: řádek, který označilo poslední chybné potvrzení. */
  wrongRow: number | null;
  /** identify: runy, které hráč u aktuální desky zkusil marně. */
  wrongPicks: Rune[];
  complete: boolean;
}

export type TableEvent =
  | { type: 'cell'; row: number; on: boolean }
  | { type: 'wrong'; row: number; expected: number }
  | { type: 'pick'; rune: Rune; correct: boolean }
  | { type: 'step'; index: number }
  | { type: 'complete' };

type Result = { state: TableState; events: TableEvent[] };

/** Výstupy desky (jak lampa opravdu svítí). */
export function tableOf(task: TableTask): number[] {
  return lampTable(task.circuit).map((v) => v ?? 0);
}

export const rowsOf = (task: TableTask): number => rowCount(task.circuit.inputs.length);

export function currentTask(cfg: TableConfig, st: TableState): TableTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

export function shownTask(cfg: TableConfig, st: TableState): TableTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

export function initTable(): TableState {
  return { step: 0, cells: 0, moves: 0, mistakes: 0, wrongRow: null, wrongPicks: [], complete: false };
}

function advance(cfg: TableConfig, st: TableState, events: TableEvent[]): Result {
  events.push({ type: 'step', index: st.step });
  const step = st.step + 1;
  if (step >= cfg.tasks.length) {
    events.push({ type: 'complete' });
    return { state: { ...st, step, wrongRow: null, complete: true }, events };
  }
  return { state: { ...st, step, cells: 0, wrongRow: null, wrongPicks: [] }, events };
}

export function toggleCell(cfg: TableConfig, st: TableState, row: number): Result {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'fill' || row < 0 || row >= rowsOf(task)) return { state: st, events: [] };
  const cells = flipBit(st.cells, row);
  return { state: { ...st, cells, wrongRow: null }, events: [{ type: 'cell', row, on: isBitSet(cells, row) }] };
}

/** První řádek shora, který nesedí. */
export function firstWrongRow(cfg: TableConfig, st: TableState): number | null {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'fill') return null;
  const want = tableOf(task);
  const r = want.findIndex((v, k) => v !== (isBitSet(st.cells, k) ? 1 : 0));
  return r < 0 ? null : r;
}

/** Potvrdí vyplněnou desku. Každé potvrzení je jeden tah. */
export function confirm(cfg: TableConfig, st: TableState): Result {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'fill') return { state: st, events: [] };
  const moves = st.moves + 1;
  const row = firstWrongRow(cfg, st);
  if (row !== null) {
    return {
      state: { ...st, moves, mistakes: st.mistakes + 1, wrongRow: row },
      events: [{ type: 'wrong', row, expected: tableOf(task)[row] }],
    };
  }
  return advance(cfg, { ...st, moves }, []);
}

/** Pozná runu pod závojem. Každý pokus je jeden tah. */
export function pick(cfg: TableConfig, st: TableState, rune: Rune): Result {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'identify' || st.wrongPicks.includes(rune) || !task.choices.includes(rune)) return { state: st, events: [] };
  const moves = st.moves + 1;
  if (rune !== task.answer) {
    return {
      state: { ...st, moves, mistakes: st.mistakes + 1, wrongPicks: [...st.wrongPicks, rune] },
      events: [{ type: 'pick', rune, correct: false }],
    };
  }
  return advance(cfg, { ...st, moves }, [{ type: 'pick', rune, correct: true }]);
}

/** Ideál: každá deska napoprvé. */
export const par = (cfg: TableConfig): number => cfg.tasks.length;

/** Nápověda 3. stupně: první nesedící řádek, nebo správná runa. */
export function hint(cfg: TableConfig, st: TableState): { row: number } | { rune: Rune } | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  if (task.mode === 'identify') return { rune: task.answer };
  const row = firstWrongRow(cfg, st);
  return row === null ? null : { row };
}
