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
    () => sequence(rng, 3, () => int(rng, 1, 15), (v) => v !== 9),
    (vs) => vs.some((v) => v >= 8) && vs.some((v) => v < 8) && vs.some((v) => popcount(v) >= 3),
  );
  return { bits: 4, goal: { kind: 'value', targets: [9, ...rest] }, reveal: 'solo', initialRevealed: 0b0111 };
}

/**
 * I-8: pět cílů do 31 bez vah. Pátý krystal potřebuje až čtvrtý cíl (Echo to komentuje), tedy
 * až po zmizení součtu (fade.sum = 2): jeho váhu si hráč odvodí ze zákona, nepřečte ji ze součtu.
 */
export function genI8(rng: Rng): AltarConfig {
  const targets = until(
    () => sequence(rng, 5, () => int(rng, 3, 31)),
    (vs) =>
      vs.slice(0, 3).every((v) => v < 16) && vs[3] >= 16 && vs[4] >= 16 && vs.filter((v) => popcount(v) >= 3).length >= 2,
  );
  return { bits: 5, goal: { kind: 'value', targets }, reveal: 'never' };
}

/**
 * Souměrný nápis ze čtyř krystalů (0110, 1001, 1111) vyjde stejně i zrcadlově: zrcadlové čtení,
 * nejčastější omyl, by na něm nevyšlo najevo. Krajní krystaly a oba prostřední mají stejný stav.
 */
const symmetric4 = (v: number): boolean => ((v >> 3) & 1) === (v & 1) && ((v >> 2) & 1) === ((v >> 1) & 1);

/** I-6: pět nápisů ze čtyř krystalů, začíná se lehčím. Žádný není souměrný. */
export function genI6(rng: Rng): InscriptionConfig {
  const values = until(
    () => sequence(rng, 5, () => int(rng, 3, 15), (v) => !symmetric4(v)),
    (vs) => vs[0] < 8 && popcount(vs[0]) === 2 && vs.filter((v) => v >= 8).length >= 3 && vs.every((v) => popcount(v) >= 2),
  );
  return { bits: 4, tasks: values.map(read) };
}

/**
 * I-7, brána Předsíně: zápis, čtení, zápis, čtení ze čtyř krystalů, žádný losovaný souměrný;
 * poslední je vždy nejtěžší světlo 15.
 */
export function genI7(rng: Rng): InscriptionConfig {
  const [w1, r1, w2, r2] = sequence(rng, 4, () => int(rng, 5, 14), (v) => popcount(v) >= 2 && !symmetric4(v));
  return { bits: 4, tasks: [write(w1), read(r1), write(w2), read(r2), write(15)] };
}

/** Zápis a čtení střídavě na n krystalech; hodnoty jsou různé a mají aspoň tři světla. */
function mixedInscription(rng: Rng, bits: number, dirs: ('read' | 'write')[], lo: number, hi: number, radix?: 16): InscriptionConfig {
  const values = sequence(rng, dirs.length, () => int(rng, lo, hi), (v) => popcount(v) >= 3);
  return { bits, ...(radix ? { radix } : {}), tasks: values.map((v, k) => (dirs[k] === 'read' ? read(v) : write(v))) };
}

/** I-12, Velký nápis: oktáva, zápis a čtení střídavě. */
export function genI12(rng: Rng): InscriptionConfig {
  return mixedInscription(rng, 8, ['write', 'read', 'write', 'read'], 40, 250);
}

/** I-13, Řeč glyfů: šest čtveřic, aspoň tři glyfy s písmenem (A–F). */
export function genI13(rng: Rng): InscriptionConfig {
  const dirs = ['read', 'read', 'write', 'read', 'write', 'read'] as const;
  const values = until(
    () => sequence(rng, 6, () => int(rng, 1, 15), (v, k, prev) => k === 0 || v !== prev[k - 1]),
    (vs) => vs.filter((v) => v >= 10).length >= 3 && vs.some((v) => v < 10),
  );
  return { bits: 4, radix: 16, tasks: values.map((v, k) => (dirs[k] === 'read' ? read(v) : write(v))) };
}

/** I-14, Dvojznak: oktáva dvěma glyfy, čtení a zápis střídavě. */
export function genI14(rng: Rng): InscriptionConfig {
  return until(
    () => mixedInscription(rng, 8, ['read', 'write', 'read', 'write', 'read'], 17, 254, 16),
    (cfg) => cfg.tasks.filter((t) => t.value >> 4 >= 10 || (t.value & 15) >= 10).length >= 3,
  );
}

/** I-15, velká brána Předsíně (oktáva): zápis, čtení, zápis. */
export function genI15Octave(rng: Rng): InscriptionConfig {
  return mixedInscription(rng, 8, ['write', 'read', 'write'], 60, 250);
}

/** I-15, velká brána Předsíně (glyfy): čtení, zápis, čtení dvěma glyfy. */
export function genI15Glyphs(rng: Rng): InscriptionConfig {
  return mixedInscription(rng, 8, ['read', 'write', 'read'], 17, 254, 16);
}

// --- Akt II ---

/** II-2: jediná dvojice ve sloupci s váhou 2 nebo 4, vlevo od ní volno, a aspoň jedno samotné světlo (součet do 15). */
const PAIR_ONE: readonly (readonly [number, number])[] = [
  [0b0011, 0b0010],
  [0b1010, 0b0010],
  [0b1010, 0b0011],
  [0b1011, 0b0010],
  [0b0101, 0b0100],
  [0b0110, 0b0100],
  [0b0110, 0b0101],
  [0b0111, 0b0100],
];
/** II-2: dvě dvojice naráz; dvojice osmiček přeteče do pátého krystalu. */
const PAIR_TWO: readonly (readonly [number, number])[] = [
  [0b1101, 0b1001],
  [0b1011, 0b1010],
];
/** Sčítanci v náhodném pořadí. */
const either = (rng: Rng, [a, b]: readonly [number, number]): CascadeTask => (rng() < 0.5 ? add(a, b) : add(b, a));

/**
 * II-2 (Dvě dvojky): pevné 5 + 1, 2 + 2 a 8 + 8 (Echo je komentuje), pak losovaný součet s jednou dvojicí
 * a nakonec dvě dvojice naráz. Vlevo od každé dvojice je volno: bez krystalů přenosu by srážka nebyla vidět.
 */
export function genII2(rng: Rng): CascadeConfig {
  return {
    width: 5,
    bits: 4,
    carries: 'none',
    conserve: true,
    tasks: [add(0b0101, 0b0001), add(0b0010, 0b0010), add(0b1000, 0b1000), either(rng, pick(rng, PAIR_ONE)), either(rng, pick(rng, PAIR_TWO))],
  };
}

/** II-3: po ukázce 3 + 1 tři součty s přenosy; třetí má sloupec se třemi světly, poslední přeteče do pátého krystalu. */
export function genII3(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 5, bits: 4, carries: 'manual', conserve: true, tasks: [] };
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

/** II-4: mezi pevnou ukázkou 31 + 1 a závěrečným 63 + 63 jeden šestimístný součet s řetězem přenosů. */
export function genII4(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 7, bits: 6, carries: 'manual', conserve: true, tasks: [] };
  const fixed = [add(0b011111, 0b000001), add(0b111111, 0b111111)];
  const middle = sequence(
    rng,
    1,
    () => add(int(rng, 5, 62), int(rng, 5, 62)),
    (t) => sumOf(t) >= 32 && carryCount(base, t) >= 3 && !fixed.some((f) => pairKey(f) === pairKey(t)),
    pairKey,
  );
  return { ...base, tasks: [fixed[0], ...middle, fixed[1]] };
}

/** II-5: nejdřív součet, který se vejde, pak jeden, který přeteče, pak libovolný; na konci vždy 15 + 1. */
export function genII5(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 4, carries: 'manual', conserve: true, overflow: true, tasks: [] };
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

/** II-7, brána Síně (kaskáda): tři pětimístné součty s přenosy; poslední přeteče do šestého krystalu. */
export function genII7Cascade(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 6, bits: 5, carries: 'manual', tasks: [] };
  const tasks = until(
    () =>
      sequence(
        rng,
        3,
        () => add(int(rng, 3, 31), int(rng, 3, 31)),
        (t, k) => carryCount(base, t) >= 2 && (k === 2 ? sumOf(t) >= 32 : sumOf(t) < 32),
        pairKey,
      ),
    (ts) => ts.some((t) => answer(base, t).inflow.includes(3)),
  );
  return { ...base, tasks };
}

/** II-7, brána Síně (páky): zdvojit několikrát, rozpůlit několikrát, rozpůlit se ztrátou přes okraj. */
export function genII7Tide(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 6, ops: ['shl', 'shr'], tasks: [] };
  const exact = (t: TideTask, k: number) => distance(base, t.start!, t.target) === k;
  const up = until(
    () => {
      const k = int(rng, 2, 3);
      const v = pick(rng, [3, 5, 7]);
      return { k, t: { start: v, target: v << k } };
    },
    ({ k, t }) => t.target <= 63 && exact(t, k),
  ).t;
  const down = until(
    () => {
      const k = int(rng, 2, 3);
      const v = pick(rng, [3, 5, 7]);
      return { k, t: { start: v << k, target: v } };
    },
    ({ k, t }) => t.start <= 63 && t.start !== up.target && exact(t, k),
  ).t;
  const lossy = until(
    () => {
      const k = int(rng, 1, 2);
      const v = int(rng, 13, 31);
      return { k, t: { start: v, target: v >> k } };
    },
    ({ k, t }) => (t.start & ((1 << k) - 1)) !== 0 && t.target >= 3 && exact(t, k),
  ).t;
  return { ...base, tasks: [up, down, lossy] };
}

/**
 * II-8: po ukázce 7 − 2 bez výpůjčky tři rozdíly s výpůjčkami. Prostřední má řetěz výpůjček
 * (sloupec si půjčí, aby mohl půjčit dál): Echo po něm říká „Výpůjčka prošla několika sloupci“.
 */
export function genII8(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 4, carries: 'manual', conserve: true, tasks: [] };
  // Řetěz: výpůjčky ve dvou sousedních sloupcích.
  const chained = (t: CascadeTask) => {
    const c = answer(base, t).carries;
    return (c & (c << 1)) !== 0;
  };
  const rest = sequence(
    rng,
    3,
    () => {
      const a = int(rng, 3, 15);
      return sub(a, int(rng, 1, a - 1));
    },
    (t, k) => (k === 1 ? chained(t) : carryCount(base, t) >= 1),
  );
  return { ...base, tasks: [sub(0b0111, 0b0010), ...rest], demo: 1 };
}

/** II-9: po ukázce 6 tři cíle do 31 seřazené od nejkratší cesty po nejdelší. */
export function genII9(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 5, ops: ['shl', 'inc'], tasks: [] };
  const steps = (target: number) => distance(base, 1, target);
  const targets = until(
    () => sequence(rng, 3, () => int(rng, 9, 31), (v) => popcount(v) >= 2),
    (vs) => steps(vs[0]) <= steps(vs[1]) && steps(vs[1]) <= steps(vs[2]) && steps(vs[2]) >= 6,
  );
  return { ...base, tasks: [{ start: 1, target: 6 }, ...targets.map((target) => ({ start: 1, target }))] };
}

/** II-10: po ukázce 5 × 3 dva součiny trojmístného čísla a čísla se dvěma jedničkami, aspoň s jedním přenosem. */
export function genII10(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 6, bits: 3, carries: 'manual', conserve: true, pickCopies: true, tasks: [] };
  const rest = sequence(
    rng,
    2,
    () => mul(pick(rng, [3, 5, 6, 7]), pick(rng, [3, 5, 6])),
    (t) => !(t.operands[0] === 5 && t.operands[1] === 3) && carryCount(base, t) >= 1,
  );
  return { ...base, tasks: [mul(0b101, 0b11), ...rest] };
}

const FATE_OPS: TideOp[] = ['shl', 'shr', 'inc', 'dec'];

/**
 * Trik, který Váhy Osudu nesmí vyžadovat: přetočení (+1 na samých světlech, −1 na nule)
 * a ×2, které shodí světlo přes levý okraj (z 58 udělá 52). Půlení přes pravý okraj trik není,
 * to je dělení se zbytkem z Přílivu.
 */
const isTrick = (op: TideOp, value: number, bits: number): boolean => {
  const spill = applyOp(op, value, bits).spill;
  return spill === 'wrap' || spill === 'left';
};

/** Nejkratší cesta bez triku (bez přetočení a bez shození světla přes levý okraj). */
function distanceNoTrick(bits: number, from: number, to: number): number {
  const dist = new Map([[from, 0]]);
  const queue = [from];
  for (let q = 0; q < queue.length; q++) {
    const v = queue[q];
    for (const op of FATE_OPS) {
      const r = applyOp(op, v, bits);
      if (isTrick(op, v, bits) || dist.has(r.value)) continue;
      dist.set(r.value, dist.get(v)! + 1);
      queue.push(r.value);
    }
  }
  return dist.get(to) ?? Infinity;
}

/** Páky, které zvolí nápověda (nejkratší cesta), a jestli některá z nich je trik. */
function hintPath(cfg: TideConfig, task: TideTask): { ops: TideOp[]; tricky: boolean } {
  const one: TideConfig = { ...cfg, strict: false, tasks: [task] };
  let st = initTide(one);
  const ops: TideOp[] = [];
  let tricky = false;
  while (!st.complete && ops.length < 12) {
    const op = bestOp(one, st)!;
    if (isTrick(op, st.value, cfg.bits)) tricky = true;
    ops.push(op);
    st = pull(one, st, op).state;
  }
  return { ops, tricky };
}

/**
 * II-14: pět vyvážení na tři tahy (poslední na čtyři), s půlením i ubíráním. Ideál jde bez triku
 * (přetočení, ztráta světla přes levý okraj) a nápověda žádný trik neukáže.
 */
export function genII14(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 6, ops: FATE_OPS, strict: true, tasks: [] };
  const fits = (t: TideTask, k: number) => {
    const start = t.start ?? 0;
    if (start === t.target) return false;
    const d = distance(base, start, t.target);
    return d === (k === 4 ? 4 : 3) && d === distanceNoTrick(6, start, t.target) && !hintPath(base, t).tricky;
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

/**
 * II-11, Dělení posunem: dělí se 4, 8, 2 a 16; jednou beze zbytku, jinak zbytek padá do misky.
 * První a poslední dělení mají zbytek vždy: Echo po nich mluví o misce („Zbytek zůstal v misce.“).
 */
export function genII11(rng: Rng): TideConfig {
  const shifts = [2, 3, 1, 4];
  const tasks = until(
    () =>
      shifts.map((k) => {
        const start = int(rng, Math.max(13, 3 << k), 63);
        return { start, target: start >> k, show: `÷ ${2 ** k}` };
      }),
    (ts) => {
      const rems = ts.map((t, k) => t.start & ((1 << shifts[k]) - 1));
      return rems[0] !== 0 && rems[3] !== 0 && rems.filter((r) => r === 0).length === 1 && new Set(ts.map((t) => t.start)).size === ts.length;
    },
  );
  return { bits: 6, ops: ['shr'], tasks };
}

/** II-12, Tři řady: dvě losované trojice se sloupcem čtyř a víc světel; na konci vždy 15 + 15 + 15. */
export function genII12(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 6, bits: 4, carries: 'manual', conserve: true, farCarries: true, tasks: [] };
  const last = add3(15, 15, 15);
  const first = sequence(
    rng,
    2,
    () => add3(int(rng, 3, 15), int(rng, 3, 15), int(rng, 3, 15)),
    (t, k) => {
      const ans = answer(base, t);
      if (k === 0) return ans.far === 0 && popcount(ans.carries) >= 2;
      return ans.far !== 0 && t.operands.some((o) => o !== 15);
    },
    (t) => [...t.operands].sort((x, y) => x - y).join('+'),
  );
  return { ...base, tasks: [...first, last] };
}

function add3(a: number, b: number, c: number): CascadeTask {
  return { op: 'add', operands: [a, b, c] };
}

/**
 * II-13, Doplněk (záporná čísla): tři různá čísla do 6 převrátit a přidat jednu. První je vždy −3:
 * navazuje na třináct jedniček z první zkoušky a Echo ho komentuje („1101, stejně jako…“).
 * Sedmička ne: k −7 = 1001 vedou i dva tahy +1 (7 → 8 → 9), takže by šla zkratka obejít.
 */
export function genII13Negate(rng: Rng): TideConfig {
  const values = [3, ...sequence(rng, 2, () => int(rng, 1, 6), (v) => v !== 3)];
  return { bits: 4, ops: ['not', 'inc'], tasks: values.map((b) => ({ start: b, target: (16 - b) & 15, show: `−${b}` })) };
}

/**
 * II-13, Doplněk (odčítání sčítáním): a + doplněk b v nádobě se čtyřmi krystaly, přetečení do přepadu.
 * Čísla zůstávají v rozsahu čtyřbitového doplňku: horní řada je kladná (do 7, nejvyšší bit 0),
 * spodní řada je záporné −b (nejvyšší bit 1) a rozdíl vyjde kladný. Platí tak, co říká Kodex:
 * nejvyšší bit nese znaménko. Každý takový součet má aspoň dva přenosy (jeden vždy do přepadu).
 */
export function genII13Add(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 4, carries: 'manual', conserve: true, overflow: true, tasks: [] };
  const tasks = sequence(
    rng,
    3,
    () => {
      const a = int(rng, 2, 7);
      const b = int(rng, 1, a - 1);
      return add(a, (16 - b) & 15);
    },
    (t) => carryCount(base, t) >= 2,
    pairKey,
  );
  return { ...base, tasks };
}

/** II-15, velká brána Síně (odčítání): dva pětimístné rozdíly s několika výpůjčkami. */
export function genII15Sub(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 5, carries: 'manual', tasks: [] };
  const tasks = sequence(
    rng,
    2,
    () => {
      const a = int(rng, 9, 31);
      return sub(a, int(rng, 1, a - 1));
    },
    (t) => carryCount(base, t) >= 2,
  );
  return { ...base, tasks };
}

/** II-15, velká brána Síně (násobení): dva součiny s výběrem kopií. */
export function genII15Mul(rng: Rng): CascadeConfig {
  const base: CascadeConfig = { width: 6, bits: 3, carries: 'manual', pickCopies: true, tasks: [] };
  const tasks = sequence(
    rng,
    2,
    () => mul(pick(rng, [3, 5, 6, 7]), pick(rng, [3, 5, 6])),
    (t) => carryCount(base, t) >= 1,
  );
  return { ...base, tasks };
}

/** II-15, velká brána Síně (Váhy Osudu): vyvážení na tři a na čtyři tahy, bez triku jako v II-14. */
export function genII15Fate(rng: Rng): TideConfig {
  const base: TideConfig = { bits: 6, ops: FATE_OPS, strict: true, tasks: [] };
  const tasks = sequence(
    rng,
    2,
    () => ({ start: int(rng, 2, 62), target: int(rng, 2, 62) }),
    (t, k) => {
      if (t.start === t.target) return false;
      const d = distance(base, t.start, t.target);
      return d === 3 + k && d === distanceNoTrick(6, t.start, t.target) && !hintPath(base, t).tricky;
    },
    (t) => `${t.start}>${t.target}`,
  );
  return { ...base, tasks };
}
