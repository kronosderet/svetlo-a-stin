/**
 * Archetyp „Kaskáda“: počítání pod sebou, jako na papíře.
 * Chrám rozsvítí ve stěně řádky (sčítance, menšence a menšitele, nebo posunuté kopie při
 * násobení). Hráč rozsvěcí krystaly výsledku a krystaly přenosu nad sloupci a výsledek potvrdí.
 * Chyba ukáže první sloupec zprava, který nesedí: nejdřív přenos, který do něj vtéká, pak výsledek.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { flipBit, isBitSet } from '../bits';

export type CascadeTask =
  | { op: 'add'; operands: number[] }
  | { op: 'sub'; operands: [number, number] }
  | { op: 'mul'; operands: [number, number] };

export interface CascadeConfig {
  /** Počet krystalů výsledku (sloupců). */
  width: number;
  /** Šířka řádků ve stěně (u násobení šířka prvního činitele). Výchozí je width. */
  bits?: number;
  /** none = přenosy nejsou vidět ani se nekontrolují; manual = hráč je sám umisťuje. */
  carries: 'none' | 'manual';
  /** Pevná nádoba: přenos z nejvyššího sloupce vyteče do přepadu a hráč ho tam musí poslat. */
  overflow?: boolean;
  tasks: CascadeTask[];
}

/** Buňka, kterou hráč přepíná: krystal výsledku, nebo krystal přenosu nad sloupcem. */
export type CascadeCell = { row: 'carry' | 'result'; column: number };

export interface CascadeState {
  step: number;
  result: number;
  /** Krystaly přenosu: bit i = krystal nad sloupcem i (vtéká do něj zprava). Bit width = přepad. */
  carries: number;
  moves: number;
  mistakes: number;
  /** Buňka, kterou označilo poslední chybné potvrzení. Smaže ji další dotek. */
  wrong: CascadeCell | null;
  complete: boolean;
}

export type CascadeEvent =
  | { type: 'toggle'; cell: CascadeCell; on: boolean }
  /** inflow = kolik světla se ve sloupci slévá (u přenosu: ve sloupci vpravo, odkud přenos teče). */
  | { type: 'wrong'; cell: CascadeCell; expected: boolean; inflow: number }
  | { type: 'step'; index: number; task: CascadeTask; result: number }
  | { type: 'complete' };

type Result = { state: CascadeState; events: CascadeEvent[] };

export interface CascadeAnswer {
  result: number;
  carries: number;
  /** Světla ve sloupci i s přenosem (u odčítání rozdíl, může být záporný). */
  inflow: number[];
  /** Největší přenos do jednoho sloupce (víc než 1 neumí jeden krystal zapsat). */
  maxCarry: number;
  /** Co by vyteklo z nejvyššího sloupce, kdyby nádoba neměla přepad. */
  spilled: number;
}

/** Řádky ve stěně: sčítance, menšenec a menšitel, nebo posunuté kopie prvního činitele. */
export function rows(task: CascadeTask): number[] {
  if (task.op !== 'mul') return [...task.operands];
  const [a, b] = task.operands;
  const out: number[] = [];
  for (let i = 0; i < 31; i++) if (isBitSet(b, i)) out.push(a << i);
  return out;
}

/** U násobení: o kolik míst je každý řádek posunutý (podle jedniček druhého činitele). */
export function rowShifts(task: CascadeTask): number[] {
  if (task.op !== 'mul') return task.operands.map(() => 0);
  const out: number[] = [];
  for (let i = 0; i < 31; i++) if (isBitSet(task.operands[1], i)) out.push(i);
  return out;
}

const bit = (n: number, i: number): number => (isBitSet(n, i) ? 1 : 0);

/** Správný výsledek i se všemi přenosy, sloupec po sloupci zprava. */
export function answer(cfg: CascadeConfig, task: CascadeTask): CascadeAnswer {
  const lines = rows(task);
  const w = cfg.width;
  let result = 0;
  let carries = 0;
  let carry = 0;
  let maxCarry = 0;
  const inflow: number[] = [];

  if (task.op === 'sub') {
    const [a, b] = lines;
    for (let i = 0; i < w; i++) {
      let d = bit(a, i) - bit(b, i) - carry;
      inflow.push(d);
      carry = d < 0 ? 1 : 0;
      if (d < 0) d += 2;
      if (d) result |= 1 << i;
      if (carry && i + 1 < w) carries |= 1 << (i + 1);
      maxCarry = Math.max(maxCarry, carry);
    }
    return { result, carries, inflow, maxCarry, spilled: carry };
  }

  for (let i = 0; i < w; i++) {
    const flow = lines.reduce((s, r) => s + bit(r, i), 0) + carry;
    inflow.push(flow);
    if (flow & 1) result |= 1 << i;
    carry = flow >> 1;
    if (carry && (i + 1 < w || cfg.overflow)) carries |= 1 << (i + 1);
    maxCarry = Math.max(maxCarry, carry);
  }
  return { result, carries, inflow, maxCarry, spilled: carry };
}

/** Sloupce, nad kterými může svítit krystal přenosu (nejpravější žádný přenos nedostává). */
export function carryColumns(cfg: CascadeConfig): number[] {
  if (cfg.carries === 'none') return [];
  const last = cfg.overflow ? cfg.width : cfg.width - 1;
  return Array.from({ length: last }, (_, k) => k + 1);
}

export function initCascade(): CascadeState {
  return { step: 0, result: 0, carries: 0, moves: 0, mistakes: 0, wrong: null, complete: false };
}

export function currentTask(cfg: CascadeConfig, st: CascadeState): CascadeTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Úloha, kterou je vidět: aktuální, po dokončení ta poslední. */
export function shownTask(cfg: CascadeConfig, st: CascadeState): CascadeTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

/** Kolik světla se ve sloupci slévá podle toho, co hráč právě rozsvítil (pro živé počty). */
export function liveInflow(task: CascadeTask, carries: number, column: number): number {
  const lines = rows(task);
  if (task.op === 'sub') return bit(lines[0], column) - bit(lines[1], column) - bit(carries, column);
  return lines.reduce((s, r) => s + bit(r, column), 0) + bit(carries, column);
}

function validCell(cfg: CascadeConfig, cell: CascadeCell): boolean {
  if (cell.row === 'result') return cell.column >= 0 && cell.column < cfg.width;
  return carryColumns(cfg).includes(cell.column);
}

export function toggle(cfg: CascadeConfig, st: CascadeState, cell: CascadeCell): Result {
  if (!currentTask(cfg, st) || !validCell(cfg, cell)) return { state: st, events: [] };
  const next =
    cell.row === 'result'
      ? { ...st, result: flipBit(st.result, cell.column) }
      : { ...st, carries: flipBit(st.carries, cell.column) };
  const on = isBitSet(cell.row === 'result' ? next.result : next.carries, cell.column);
  return { state: { ...next, wrong: null }, events: [{ type: 'toggle', cell, on }] };
}

/** První buňka zprava, která nesedí (ve sloupci nejdřív přenos, který do něj vtéká). */
export function firstWrong(cfg: CascadeConfig, st: CascadeState): CascadeCell | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  const ans = answer(cfg, task);
  const carryCols = carryColumns(cfg);
  const last = cfg.overflow && cfg.carries === 'manual' ? cfg.width : cfg.width - 1;
  for (let i = 0; i <= last; i++) {
    if (carryCols.includes(i) && bit(st.carries, i) !== bit(ans.carries, i)) return { row: 'carry', column: i };
    if (i < cfg.width && bit(st.result, i) !== bit(ans.result, i)) return { row: 'result', column: i };
  }
  return null;
}

/** Potvrdí výsledek. Každé potvrzení je jeden tah. */
export function confirm(cfg: CascadeConfig, st: CascadeState): Result {
  const task = currentTask(cfg, st);
  if (!task) return { state: st, events: [] };
  const wrong = firstWrong(cfg, st);
  const moves = st.moves + 1;

  if (wrong) {
    const ans = answer(cfg, task);
    const expected = isBitSet(wrong.row === 'result' ? ans.result : ans.carries, wrong.column);
    const inflow = wrong.row === 'result' ? ans.inflow[wrong.column] : ans.inflow[wrong.column - 1];
    return {
      state: { ...st, moves, mistakes: st.mistakes + 1, wrong },
      events: [{ type: 'wrong', cell: wrong, expected, inflow }],
    };
  }

  const events: CascadeEvent[] = [{ type: 'step', index: st.step, task, result: st.result }];
  const step = st.step + 1;
  const complete = step >= cfg.tasks.length;
  if (complete) {
    events.push({ type: 'complete' });
    // Poslední výsledek zůstává rozsvícený (kvíz, závěrečná obrazovka).
    return { state: { ...st, step, moves, wrong: null, complete }, events };
  }
  return { state: { ...st, step, moves, result: 0, carries: 0, wrong: null, complete }, events };
}

/** Ideál: každý výsledek napoprvé. */
export const par = (cfg: CascadeConfig): number => cfg.tasks.length;
