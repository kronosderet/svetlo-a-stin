/**
 * Losování úloh pro komnaty na procvičování a zkoušky. Každý generátor drží stejné podmínky,
 * jaké měly ručně vybrané úlohy: aby komnata učila totéž, jen s jinými čísly.
 * Kde Echo komentuje konkrétní úlohu (ukázka na začátku, závěrečná zkouška), ta zůstává pevná.
 */
import { popcount } from '../core/bits';
import type { AltarConfig } from '../core/puzzles/altar';
import { answer, type CascadeConfig, type CascadeTask } from '../core/puzzles/cascade';
import type { InscriptionConfig, InscriptionTask } from '../core/puzzles/inscription';
import { applyOp, bestOp, distance, initTide, pull, type TideConfig, type TideOp, type TideTask } from '../core/puzzles/tide';
import { int, pick, sequence, until, type Rng } from './random';

const add = (a: number, b: number): CascadeTask => ({ op: 'add', operands: [a, b] });
const sub = (a: number, b: number): CascadeTask => ({ op: 'sub', operands: [a, b] });
const mul = (a: number, b: number): CascadeTask => ({ op: 'mul', operands: [a, b] });
/** Dvojice sčítanců bez ohledu na pořadí (3 + 5 je totéž jako 5 + 3). */
const pairKey = (t: CascadeTask): string => [...t.operands].sort((x, y) => x - y).join(t.op);
const sumOf = (t: CascadeTask): number => t.operands[0] + t.operands[1];
const carryCount = (cfg: CascadeConfig, t: CascadeTask): number => popcount(answer(cfg, t).carries);
const read = (value: number): InscriptionTask => ({ dir: 'read', value });
const write = (value: number): InscriptionTask => ({ dir: 'write', value });

// --- Akt I ---

/** I-5: první cíl 9 odhalí váhu osmičky, další čtyři se losují do 15. */
export function genI5(rng: Rng): AltarConfig {
  const rest = until(
    () => sequence(rng, 4, () => int(rng, 1, 15), (v) => v !== 9),
    (vs) => vs.some((v) => v >= 8) && vs.some((v) => v < 8) && vs.some((v) => popcount(v) >= 3),
  );
  return { bits: 4, goal: { kind: 'value', targets: [9, ...rest] }, reveal: 'solo', initialRevealed: 0b0111 };
}

/** I-6: pět cílů do 31 bez vah; čtvrtý potřebuje pátý krystal (Echo to komentuje). */
export function genI6(rng: Rng): AltarConfig {
  const targets = until(
    () => sequence(rng, 5, () => int(rng, 3, 31)),
    (vs) =>
      vs[0] < 16 && vs[3] >= 16 && vs.filter((v) => v >= 16).length >= 2 && vs.filter((v) => popcount(v) >= 3).length >= 2,
  );
  return { bits: 5, goal: { kind: 'value', targets }, reveal: 'never' };
}

/** I-7: pět nápisů ze čtyř krystalů, začíná se lehčím. */
export function genI7(rng: Rng): InscriptionConfig {
  const values = until(
    () => sequence(rng, 5, () => int(rng, 3, 15)),
    (vs) => vs[0] < 8 && popcount(vs[0]) === 2 && vs.filter((v) => v >= 8).length >= 3 && vs.every((v) => popcount(v) >= 2),
  );
  return { bits: 4, tasks: values.map(read) };
}

/** I-10: zápis, čtení, zápis, čtení ze šesti krystalů; poslední je vždy nejtěžší světlo 63. */
export function genI10(rng: Rng): InscriptionConfig {
  const [w1, r1, w2, r2] = sequence(rng, 4, () => int(rng, 17, 62), (v) => popcount(v) >= 3);
  return { bits: 6, tasks: [write(w1), read(r1), write(w2), read(r2), write(63)] };
}

// --- Akt II ---

/** II-2: čtyři součty bez přenosu. */
export function genII2(rng: Rng): CascadeConfig {
  const tasks = sequence(
    rng,
    4,
    () => add(int(rng, 1, 15), int(rng, 1, 15)),
    (t) => (t.operands[0] & t.operands[1]) === 0 && popcount(t.operands[0] | t.operands[1]) >= 3,
    pairKey,
  );
  return { width: 4, carries: 'none', tasks };
}

/** II-3: po ukázce 3 + 1 tři součty s přenosy; třetí má sloupec se třemi světly, poslední přeteče do pátého krystalu. */
export function genII3(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 5, bits: 4, carries: 'manual', tasks: [] };
  const first = add(0b0011, 0b0001);
  const rest = sequence(
    rng,
    3,
    () => add(int(rng, 1, 15), int(rng, 1, 15)),
    (t, k) => {
      if (carryCount(base, t) === 0 || pairKey(t) === pairKey(first)) return false;
      if (k === 1 && !answer(base, t).inflow.includes(3)) return false;
      return k === 2 ? sumOf(t) >= 16 : sumOf(t) < 16;
    },
    pairKey,
  );
  return { ...base, tasks: [first, ...rest] };
}

/** II-4: mezi pevnou ukázkou 31 + 1 a závěrečným 63 + 63 dva šestimístné součty s řetězem přenosů. */
export function genII4(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 7, bits: 6, carries: 'manual', tasks: [] };
  const fixed = [add(0b011111, 0b000001), add(0b111111, 0b111111)];
  const middle = sequence(
    rng,
    2,
    () => add(int(rng, 5, 62), int(rng, 5, 62)),
    (t) => sumOf(t) >= 32 && carryCount(base, t) >= 3 && !fixed.some((f) => pairKey(f) === pairKey(t)),
    pairKey,
  );
  return { ...base, tasks: [fixed[0], ...middle, fixed[1]] };
}

/** II-5: nejdřív součet, který se vejde, pak jeden, který přeteče, pak libovolný; na konci vždy 15 + 1. */
export function genII5(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 4, carries: 'manual', overflow: true, tasks: [] };
  const tasks = sequence(
    rng,
    3,
    () => add(int(rng, 1, 14), int(rng, 1, 14)),
    (t, k) => {
      const s = sumOf(t);
      if (k === 0) return s <= 15 && carryCount(base, t) >= 1;
      if (k === 1) return s >= 17;
      return s !== 16;
    },
    pairKey,
  );
  return { ...base, tasks: [...tasks, add(0b1111, 0b0001)] };
}

/** II-6: po ukázce 7 − 2 bez výpůjčky tři rozdíly s výpůjčkami; prostřední má výpůjček víc. */
export function genII6(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 4, carries: 'manual', tasks: [] };
  const rest = sequence(
    rng,
    3,
    () => {
      const a = int(rng, 3, 15);
      return sub(a, int(rng, 1, a - 1));
    },
    (t, k) => carryCount(base, t) >= (k === 1 ? 2 : 1),
  );
  return { ...base, tasks: [sub(0b0111, 0b0010), ...rest] };
}

/** II-8: po ukázce 6 tři cíle do 31 seřazené od nejkratší cesty po nejdelší. */
export function genII8(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 5, ops: ['shl', 'inc'], tasks: [] };
  const steps = (target: number) => distance(base, 1, target);
  const targets = until(
    () => sequence(rng, 3, () => int(rng, 9, 31), (v) => popcount(v) >= 2),
    (vs) => steps(vs[0]) <= steps(vs[1]) && steps(vs[1]) <= steps(vs[2]) && steps(vs[2]) >= 6,
  );
  return { ...base, tasks: [{ start: 1, target: 6 }, ...targets.map((target) => ({ start: 1, target }))] };
}

/** II-9: po ukázce 5 × 3 dva součiny trojmístného čísla a čísla se dvěma jedničkami, aspoň s jedním přenosem. */
export function genII9(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 6, bits: 3, carries: 'manual', tasks: [] };
  const rest = sequence(
    rng,
    2,
    () => mul(pick(rng, [3, 5, 6, 7]), pick(rng, [3, 5, 6])),
    (t) => !(t.operands[0] === 5 && t.operands[1] === 3) && carryCount(base, t) >= 1,
  );
  return { ...base, tasks: [mul(0b101, 0b11), ...rest] };
}

const FATE_OPS: TideOp[] = ['shl', 'shr', 'inc', 'dec'];

/** Nejkratší cesta bez přetočení (+1 na samých světlech, −1 na nule). */
function distanceNoWrap(bits: number, from: number, to: number): number {
  const dist = new Map([[from, 0]]);
  const queue = [from];
  for (let q = 0; q < queue.length; q++) {
    const v = queue[q];
    for (const op of FATE_OPS) {
      const r = applyOp(op, v, bits);
      if (r.spill === 'wrap' || dist.has(r.value)) continue;
      dist.set(r.value, dist.get(v)! + 1);
      queue.push(r.value);
    }
  }
  return dist.get(to) ?? Infinity;
}

/** Páky, které zvolí nápověda (nejkratší cesta), a jestli některá přetáčí. */
function hintPath(cfg: TideConfig, task: TideTask): { ops: TideOp[]; wraps: boolean } {
  const one: TideConfig = { ...cfg, strict: false, tasks: [task] };
  let st = initTide(one);
  const ops: TideOp[] = [];
  let wraps = false;
  while (!st.complete && ops.length < 12) {
    const op = bestOp(one, st)!;
    if (applyOp(op, st.value, cfg.bits).spill === 'wrap') wraps = true;
    ops.push(op);
    st = pull(one, st, op).state;
  }
  return { ops, wraps };
}

/** II-10: pět vyvážení na tři tahy (poslední na čtyři), bez triku s přetočením, s půlením i ubíráním. */
export function genII10(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 6, ops: FATE_OPS, strict: true, tasks: [] };
  const fits = (t: TideTask, k: number) => {
    const start = t.start ?? 0;
    if (start === t.target) return false;
    const d = distance(base, start, t.target);
    return d === (k === 4 ? 4 : 3) && d === distanceNoWrap(6, start, t.target) && !hintPath(base, t).wraps;
  };
  const tasks = until(
    () =>
      sequence(
        rng,
        5,
        () => ({ start: int(rng, 2, 62), target: int(rng, 2, 62) }),
        fits,
        (t) => `${t.start}>${t.target}`,
      ),
    (ts) => ts.some((t) => hintPath(base, t).ops.includes('dec')) && ts.some((t) => hintPath(base, t).ops.includes('shr')),
  );
  return { ...base, tasks };
}
