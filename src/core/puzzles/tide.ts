/**
 * Archetyp „Příliv“: páky posouvají všechna světla v řadě najednou (vlevo = ×2, vpravo = ÷2)
 * nebo přidají či uberou jedničku. Cílem je dostat se k požadované váze co nejméně tahy.
 * Ve „Vahách Osudu“ (strict) dovolí každá zkouška jen ideální počet tahů, pak se vrátí na začátek.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { isBitSet, maxValue } from '../bits';

export type TideOp = 'shl' | 'shr' | 'inc' | 'dec';

export interface TideTask {
  /** Výchozí váha; bez ní zkouška navazuje na cíl té předchozí. */
  start?: number;
  target: number;
}

export interface TideConfig {
  bits: number;
  ops: TideOp[];
  tasks: TideTask[];
  /** Každá zkouška dovolí jen ideální počet tahů. Kdo ho přečerpá, začíná zkoušku znovu. */
  strict?: boolean;
}

export interface TideState {
  step: number;
  value: number;
  /** Tahy v aktuální zkoušce. */
  taskMoves: number;
  moves: number;
  /** Kolikrát se váhy vrátily na začátek (strict). */
  resets: number;
  /** Páky použité v aktuální zkoušce (zápisník). */
  trail: TideOp[];
  complete: boolean;
}

/** Kam světlo uteklo: přes levý okraj, přes pravý okraj, nebo přetočením (+1 na samých světlech). */
export type Spill = 'left' | 'right' | 'wrap' | null;

export type TideEvent =
  | { type: 'pull'; op: TideOp; from: number; to: number; spill: Spill }
  | { type: 'reset'; to: number }
  | { type: 'step'; index: number; target: number; trail: TideOp[] }
  | { type: 'complete' };

type Result = { state: TideState; events: TideEvent[] };

/** Jedna páka. Co přeteče přes okraj řady, je ztracené. */
export function applyOp(op: TideOp, value: number, bits: number): { value: number; spill: Spill } {
  const max = maxValue(bits);
  switch (op) {
    case 'shl':
      return { value: (value << 1) & max, spill: isBitSet(value, bits - 1) ? 'left' : null };
    case 'shr':
      return { value: value >>> 1, spill: isBitSet(value, 0) ? 'right' : null };
    case 'inc':
      return value === max ? { value: 0, spill: 'wrap' } : { value: value + 1, spill: null };
    case 'dec':
      return value === 0 ? { value: max, spill: 'wrap' } : { value: value - 1, spill: null };
  }
}

/** Výchozí váha zkoušky: zadaná, nebo cíl předchozí zkoušky. */
export function taskStart(cfg: TideConfig, index: number): number {
  const t = cfg.tasks[index];
  if (t?.start !== undefined) return t.start;
  return index > 0 ? cfg.tasks[index - 1].target : 0;
}

export function initTide(cfg: TideConfig): TideState {
  return { step: 0, value: taskStart(cfg, 0), taskMoves: 0, moves: 0, resets: 0, trail: [], complete: false };
}

export function currentTarget(cfg: TideConfig, st: TideState): number | null {
  return st.complete ? null : (cfg.tasks[st.step]?.target ?? null);
}

/** Vzdálenosti ze všech vah k cíli (prohledávání do šířky po obrácených tazích). */
function distancesTo(cfg: TideConfig, target: number): number[] {
  const size = maxValue(cfg.bits) + 1;
  // Předchůdci: z kterých vah se jedním tahem dostanu do v.
  const preds: number[][] = Array.from({ length: size }, () => []);
  for (let v = 0; v < size; v++) for (const op of cfg.ops) preds[applyOp(op, v, cfg.bits).value].push(v);
  const dist = new Array<number>(size).fill(Infinity);
  dist[target] = 0;
  const queue = [target];
  for (let q = 0; q < queue.length; q++) {
    const v = queue[q];
    for (const p of preds[v]) {
      if (dist[p] === Infinity) {
        dist[p] = dist[v] + 1;
        queue.push(p);
      }
    }
  }
  return dist;
}

/** Nejmenší počet tahů z from do to (Infinity, pokud to nejde). */
export function distance(cfg: TideConfig, from: number, to: number): number {
  return distancesTo(cfg, to)[from];
}

/** Ideál: součet nejkratších cest všech zkoušek. */
export function par(cfg: TideConfig): number {
  return cfg.tasks.reduce((sum, t, k) => sum + distance(cfg, taskStart(cfg, k), t.target), 0);
}

/** Kolik tahů dovolí aktuální zkouška (jen strict). */
export function taskLimit(cfg: TideConfig, st: TideState): number | null {
  if (!cfg.strict || st.complete) return null;
  return distance(cfg, taskStart(cfg, st.step), cfg.tasks[st.step].target);
}

/** Páka, kterou doporučí nápověda 3. stupně: první, která vede nejkratší cestou. */
export function bestOp(cfg: TideConfig, st: TideState): TideOp | null {
  const target = currentTarget(cfg, st);
  if (target === null) return null;
  const dist = distancesTo(cfg, target);
  const here = dist[st.value];
  if (here === Infinity) return null;
  for (const op of cfg.ops) if (dist[applyOp(op, st.value, cfg.bits).value] === here - 1) return op;
  return null;
}

export function pull(cfg: TideConfig, st: TideState, op: TideOp): Result {
  const target = currentTarget(cfg, st);
  if (target === null || !cfg.ops.includes(op)) return { state: st, events: [] };
  const { value, spill } = applyOp(op, st.value, cfg.bits);
  const events: TideEvent[] = [{ type: 'pull', op, from: st.value, to: value, spill }];
  const next: TideState = {
    ...st,
    value,
    taskMoves: st.taskMoves + 1,
    moves: st.moves + 1,
    trail: [...st.trail, op],
  };

  if (value === target) {
    events.push({ type: 'step', index: st.step, target, trail: next.trail });
    const step = st.step + 1;
    const complete = step >= cfg.tasks.length;
    if (complete) {
      events.push({ type: 'complete' });
      return { state: { ...next, step, complete }, events };
    }
    return { state: { ...next, step, value: taskStart(cfg, step), taskMoves: 0, trail: [] }, events };
  }

  const limit = taskLimit(cfg, st);
  if (limit !== null && next.taskMoves >= limit) {
    const to = taskStart(cfg, st.step);
    events.push({ type: 'reset', to });
    return { state: { ...next, value: to, taskMoves: 0, trail: [], resets: st.resets + 1 }, events };
  }
  return { state: next, events };
}
