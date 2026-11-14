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
  /**
   * Násobení: posunuté kopie prvního činitele nejsou ve stěně hotové. Stěna nabídne kopii pro
   * každé místo druhého činitele (×1, ×2, ×4…) a hráč rozsvítí ty, které patří k jeho jedničkám.
   */
  pickCopies?: boolean;
  /** Tři řady: kromě přenosu o jedno místo i přenos o dvě místa (čtyři světla ve sloupci = 100). */
  farCarries?: boolean;
  tasks: CascadeTask[];
}

/**
 * Buňka, kterou hráč přepíná: krystal výsledku, krystal přenosu nad sloupcem, krystal přenosu
 * o dvě místa (far), nebo vypínač kopie při násobení (copy, column = o kolik míst je posunutá).
 */
export type CascadeCell = { row: 'carry' | 'result' | 'far' | 'copy'; column: number };

export interface CascadeState {
  step: number;
  result: number;
  /** Krystaly přenosu: bit i = krystal nad sloupcem i (vtéká do něj zprava). Bit width = přepad. */
  carries: number;
  /** Přenosy o dvě místa: bit i = krystal, který do sloupce i přitekl ze sloupce i − 2. */
  far: number;
  /** Násobení: rozsvícené kopie (bit j = kopie posunutá o j míst). */
  copies: number;
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
  /** Přenosy o dvě místa (jen farCarries). */
  far: number;
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

/** Kolik kopií nabídne stěna při výběru kopií: jednu pro každé místo druhého činitele. */
export const copySlots = (cfg: CascadeConfig): number => cfg.bits ?? cfg.width;

/** Řádky, které stěna ukazuje: při výběru kopií všechny nabízené kopie, jinak řádky úlohy. */
export function wallRows(cfg: CascadeConfig, task: CascadeTask): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rows(task);
  return Array.from({ length: copySlots(cfg) }, (_, j) => task.operands[0] << j);
}

/** O kolik míst jsou řádky na stěně posunuté. */
export function wallShifts(cfg: CascadeConfig, task: CascadeTask): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rowShifts(task);
  return Array.from({ length: copySlots(cfg) }, (_, j) => j);
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

  if (cfg.farCarries) {
    // Ve sloupci se může slít až pět světel: 2 a 3 dají přenos o jedno místo, 4 a 5 o dvě.
    const near = new Array<number>(w + 2).fill(0);
    const farIn = new Array<number>(w + 2).fill(0);
    let far = 0;
    for (let i = 0; i < w; i++) {
      const flow = lines.reduce((s, r) => s + bit(r, i), 0) + near[i] + farIn[i];
      inflow.push(flow);
      if (flow & 1) result |= 1 << i;
      if ((flow >> 1) & 1) {
        near[i + 1] = 1;
        if (i + 1 < w) carries |= 1 << (i + 1);
      }
      if ((flow >> 2) & 1) {
        farIn[i + 2] = 1;
        if (i + 2 < w) far |= 1 << (i + 2);
      }
      maxCarry = Math.max(maxCarry, flow >> 2 ? 1 : flow >> 1);
    }
    return { result, carries, far, inflow, maxCarry, spilled: near[w] + farIn[w] + farIn[w + 1] };
  }

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
    return { result, carries, far: 0, inflow, maxCarry, spilled: carry };
  }

  for (let i = 0; i < w; i++) {
    const flow = lines.reduce((s, r) => s + bit(r, i), 0) + carry;
    inflow.push(flow);
    if (flow & 1) result |= 1 << i;
    carry = flow >> 1;
    if (carry && (i + 1 < w || cfg.overflow)) carries |= 1 << (i + 1);
    maxCarry = Math.max(maxCarry, carry);
  }
  return { result, carries, far: 0, inflow, maxCarry, spilled: carry };
}

/** Sloupce, nad kterými může svítit krystal přenosu (nejpravější žádný přenos nedostává). */
export function carryColumns(cfg: CascadeConfig): number[] {
  if (cfg.carries === 'none') return [];
  const last = cfg.overflow ? cfg.width : cfg.width - 1;
  return Array.from({ length: last }, (_, k) => k + 1);
}

/** Sloupce, do kterých může přitéct přenos o dvě místa. */
export function farColumns(cfg: CascadeConfig): number[] {
  if (!cfg.farCarries || cfg.carries === 'none') return [];
  return Array.from({ length: Math.max(0, cfg.width - 2) }, (_, k) => k + 2);
}

export function initCascade(): CascadeState {
  return { step: 0, result: 0, carries: 0, far: 0, copies: 0, moves: 0, mistakes: 0, wrong: null, complete: false };
}

export function currentTask(cfg: CascadeConfig, st: CascadeState): CascadeTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Úloha, kterou je vidět: aktuální, po dokončení ta poslední. */
export function shownTask(cfg: CascadeConfig, st: CascadeState): CascadeTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

/** Řádky, které se podle hráče právě sčítají (při výběru kopií jen rozsvícené kopie). */
function chosenRows(cfg: CascadeConfig, task: CascadeTask, copies: number): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rows(task);
  return wallRows(cfg, task).filter((_, j) => isBitSet(copies, j));
}

/** Kolik světla se ve sloupci slévá podle toho, co hráč právě rozsvítil (pro živé počty). */
export function liveInflow(
  task: CascadeTask,
  carries: number,
  column: number,
  extra: { cfg?: CascadeConfig; far?: number; copies?: number } = {},
): number {
  const lines = extra.cfg ? chosenRows(extra.cfg, task, extra.copies ?? 0) : rows(task);
  if (task.op === 'sub') return bit(lines[0], column) - bit(lines[1], column) - bit(carries, column);
  return lines.reduce((s, r) => s + bit(r, column), 0) + bit(carries, column) + bit(extra.far ?? 0, column);
}

/** Bitová maska, ve které buňka daného řádku leží. */
const rowMask = (st: Pick<CascadeState, 'result' | 'carries' | 'far' | 'copies'>, row: CascadeCell['row']): number =>
  row === 'result' ? st.result : row === 'carry' ? st.carries : row === 'far' ? st.far : st.copies;

const rowKey = { result: 'result', carry: 'carries', far: 'far', copy: 'copies' } as const;

function validCell(cfg: CascadeConfig, task: CascadeTask, cell: CascadeCell): boolean {
  switch (cell.row) {
    case 'result':
      return cell.column >= 0 && cell.column < cfg.width;
    case 'carry':
      return carryColumns(cfg).includes(cell.column);
    case 'far':
      return farColumns(cfg).includes(cell.column);
    case 'copy':
      return !!cfg.pickCopies && task.op === 'mul' && cell.column >= 0 && cell.column < copySlots(cfg);
  }
}

export function toggle(cfg: CascadeConfig, st: CascadeState, cell: CascadeCell): Result {
  const task = currentTask(cfg, st);
  if (!task || !validCell(cfg, task, cell)) return { state: st, events: [] };
  const key = rowKey[cell.row];
  const next = { ...st, [key]: flipBit(st[key], cell.column) };
  const on = isBitSet(rowMask(next, cell.row), cell.column);
  return { state: { ...next, wrong: null }, events: [{ type: 'toggle', cell, on }] };
}

/**
 * První buňka zprava, která nesedí (ve sloupci nejdřív přenosy, které do něj vtékají).
 * Při výběru kopií se nejdřív kontroluje, jestli svítí správné kopie.
 */
export function firstWrong(cfg: CascadeConfig, st: CascadeState): CascadeCell | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  if (cfg.pickCopies && task.op === 'mul') {
    for (let j = 0; j < copySlots(cfg); j++) {
      if (bit(st.copies, j) !== bit(task.operands[1], j)) return { row: 'copy', column: j };
    }
  }
  const ans = answer(cfg, task);
  const carryCols = carryColumns(cfg);
  const farCols = farColumns(cfg);
  const last = cfg.overflow && cfg.carries === 'manual' ? cfg.width : cfg.width - 1;
  for (let i = 0; i <= last; i++) {
    if (farCols.includes(i) && bit(st.far, i) !== bit(ans.far, i)) return { row: 'far', column: i };
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
    const mask = { result: ans.result, carry: ans.carries, far: ans.far, copy: task.operands[1] }[wrong.row];
    const expected = isBitSet(mask, wrong.column);
    // U přenosu se počítá světlo ve sloupci, odkud přenos teče.
    const source = { result: 0, carry: 1, far: 2, copy: 0 }[wrong.row];
    const inflow = wrong.row === 'copy' ? 0 : ans.inflow[wrong.column - source];
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
  return { state: { ...st, step, moves, result: 0, carries: 0, far: 0, copies: 0, wrong: null, complete }, events };
}

/** Ideál: každý výsledek napoprvé. */
export const par = (cfg: CascadeConfig): number => cfg.tasks.length;
