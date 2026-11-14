/**
 * Archetyp „Maska“: bitové operace s celou oktávou. Ve stěně svítí nápis, hráč pod ním rozsvěcí
 * masku a runa (AND, OR, XOR) z nich krystal po krystalu skládá výsledek.
 *  - cíl: výsledek musí vypadat tak, jak žádá oltář,
 *  - klíč (šifra): maska musí být nastavená na daný klíč; výsledek je pak rozšifrovaná zpráva.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { flipBit, isBitSet, popcount } from '../bits';

export type MaskOp = 'and' | 'or' | 'xor';

export interface MaskTask {
  /** Nápis ve stěně. */
  value: number;
  op: MaskOp;
  /** Jak má vypadat výsledek. */
  target?: number;
  /** Šifra: maska musí být tenhle klíč (místo cíle). */
  key?: number;
  /** Krátké zadání úlohy („Nech svítit jen pravou čtveřici.“). */
  say?: string;
  /** Šifra: ve stěně je čitelná zpráva a výsledkem je šifra (jinak naopak). */
  encrypt?: boolean;
}

export interface MaskConfig {
  bits: number;
  tasks: MaskTask[];
}

export interface MaskState {
  step: number;
  mask: number;
  moves: number;
  complete: boolean;
}

export type MaskEvent =
  | { type: 'toggle'; bit: number; on: boolean; result: number }
  | { type: 'step'; index: number; result: number }
  | { type: 'complete' };

type Result = { state: MaskState; events: MaskEvent[] };

export function applyMask(op: MaskOp, value: number, mask: number): number {
  return op === 'and' ? value & mask : op === 'or' ? value | mask : value ^ mask;
}

export function currentTask(cfg: MaskConfig, st: MaskState): MaskTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

export function shownTask(cfg: MaskConfig, st: MaskState): MaskTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

export function initMask(): MaskState {
  return { step: 0, mask: 0, moves: 0, complete: false };
}

/** Je úloha splněná touhle maskou? */
export function solved(task: MaskTask, mask: number): boolean {
  if (task.key !== undefined) return mask === task.key;
  return applyMask(task.op, task.value, mask) === task.target;
}

/**
 * Maska, která úlohu splní a od dané masky se liší co nejméně (krystaly, na kterých nezáleží,
 * nechá, jak jsou). Null, když úloha řešení nemá.
 */
export function closestMask(task: MaskTask, bits: number, current: number): number | null {
  const full = 2 ** bits - 1;
  if (task.key !== undefined) return task.key;
  const t = task.target ?? 0;
  const v = task.value;
  if (task.op === 'xor') return v ^ t;
  if (task.op === 'and') {
    // Kde nápis mlčí, výsledek mlčí vždy: cíl tam musí mlčet a na masce nezáleží.
    if (t & ~v & full) return null;
    return (current & ~v & full) | t;
  }
  // OR: kde nápis svítí, výsledek svítí vždy: cíl tam musí svítit a na masce nezáleží.
  if (v & ~t & full) return null;
  return (current & v) | (t & ~v & full);
}

export function toggle(cfg: MaskConfig, st: MaskState, bit: number): Result {
  const task = currentTask(cfg, st);
  if (!task || bit < 0 || bit >= cfg.bits) return { state: st, events: [] };
  const mask = flipBit(st.mask, bit);
  const result = applyMask(task.op, task.value, mask);
  const events: MaskEvent[] = [{ type: 'toggle', bit, on: isBitSet(mask, bit), result }];
  const next = { ...st, mask, moves: st.moves + 1 };
  if (!solved(task, mask)) return { state: next, events };
  events.push({ type: 'step', index: st.step, result });
  const step = st.step + 1;
  if (step >= cfg.tasks.length) {
    events.push({ type: 'complete' });
    return { state: { ...next, step, complete: true }, events };
  }
  return { state: { ...next, step, mask: 0 }, events };
}

/** Ideál: u každé úlohy jen krystaly masky, které opravdu musí svítit. */
export function par(cfg: MaskConfig): number {
  return cfg.tasks.reduce((sum, t) => sum + popcount(closestMask(t, cfg.bits, 0) ?? 0), 0);
}

/** Nápověda 3. stupně: krystal masky, který se liší od nejbližšího řešení (od nejtěžšího). */
export function hintBit(cfg: MaskConfig, st: MaskState): number | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  const goal = closestMask(task, cfg.bits, st.mask);
  if (goal === null) return null;
  const diff = goal ^ st.mask;
  for (let i = cfg.bits - 1; i >= 0; i--) if (isBitSet(diff, i)) return i;
  return null;
}
