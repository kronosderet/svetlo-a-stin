/**
 * Archetyp „Oltář“: hráč přepíná krystaly (bity) a plní cíle.
 *  - pattern: napodobit kombinaci vyrytou ve stěně,
 *  - value:   dosáhnout požadované váhy (hodnoty),
 *  - all:     najít všech 2ⁿ kombinací,
 *  - class:   rozsvítit kterékoli číslo ze skupiny (liché, dělitelné čtyřmi…): hráč hledá,
 *             co mají čísla skupiny společného (Sudé a liché).
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { combinations, flipBit, hamming, isBitSet, popcount } from '../bits';

/** Skupina čísel, ze které oltář přijme kterékoli (say = jak ji oltář žádá, hint = proč). */
export interface AltarClass {
  say: string;
  values: number[];
  hint?: string;
}

export type AltarGoal =
  | { kind: 'pattern'; targets: number[] }
  | { kind: 'value'; targets: number[] }
  | { kind: 'class'; targets: AltarClass[] }
  | { kind: 'all' };

/** never = váhy se neukazují; solo = váha se odhalí, když svítí krystal sám; always = známé od začátku. */
export type RevealMode = 'never' | 'solo' | 'always';

export interface AltarConfig {
  bits: number;
  goal: AltarGoal;
  initial?: number;
  reveal: RevealMode;
  /** Váhy známé od začátku (bitová maska pozic). */
  initialRevealed?: number;
  /** Pořadí, ve kterém nápověda vede krystaly: high = od nejtěžšího, low = zprava (přenos). */
  hintOrder?: 'high' | 'low';
  /**
   * Tichý krok (jen goal all): návrat na kombinaci, kterou deska už zná, přeruší cestu
   * a všechno začíná znovu. Hráč tak hledá cestu přes všechny kombinace bez opakování (Grayův kód).
   */
  strict?: boolean;
}

export interface AltarState {
  mask: number;
  /** Index aktuálního cíle (pattern/value). */
  step: number;
  /** Nalezené kombinace (all), u skupin čísla, která oltář přijal (class). */
  found: number[];
  /** Pozice, jejichž váha je odhalená. */
  revealed: number;
  moves: number;
  complete: boolean;
}

export type AltarEvent =
  | { type: 'toggle'; bit: number; on: boolean }
  /**
   * source: solo = krystal svítil sám; altar = oltář přijal váhu a vyryl váhy zúčastněných krystalů;
   * deduce = ostatní svítící váhy jsou známé a součet ukáže i tu poslední (6 − 2 = 4).
   */
  | { type: 'reveal'; bit: number; allRevealed: boolean; source: 'solo' | 'altar' | 'deduce'; known?: number }
  | { type: 'found'; pattern: number; count: number }
  | { type: 'repeat'; pattern: number }
  /** Tichý krok se přerušil: deska se vymaže a krystaly se vrátí na začátek. */
  | { type: 'reset'; to: number }
  | { type: 'step'; index: number; target: number }
  | { type: 'complete' };

const fullMask = (bits: number): number => combinations(bits) - 1;

export function targetsOf(cfg: AltarConfig): number[] {
  return cfg.goal.kind === 'all' || cfg.goal.kind === 'class' ? [] : cfg.goal.targets;
}

/** Kolik cílů oltář má (u skupin čísel počet skupin). */
export function goalCount(cfg: AltarConfig): number {
  return cfg.goal.kind === 'all' ? 0 : cfg.goal.targets.length;
}

/** Skupina, kterou oltář právě žádá (jen class). */
export function currentClass(cfg: AltarConfig, st: AltarState): AltarClass | null {
  if (cfg.goal.kind !== 'class' || st.complete) return null;
  return cfg.goal.targets[st.step] ?? null;
}

export function initAltar(cfg: AltarConfig): AltarState {
  const mask = cfg.initial ?? 0;
  return {
    mask,
    step: 0,
    found: cfg.goal.kind === 'all' ? [mask] : [],
    revealed: cfg.reveal === 'always' ? fullMask(cfg.bits) : (cfg.initialRevealed ?? 0),
    moves: 0,
    complete: false,
  };
}

export function currentTarget(cfg: AltarConfig, st: AltarState): number | null {
  if (cfg.goal.kind === 'all' || cfg.goal.kind === 'class' || st.complete) return null;
  return cfg.goal.targets[st.step] ?? null;
}

export function toggle(
  cfg: AltarConfig,
  st: AltarState,
  bit: number,
): { state: AltarState; events: AltarEvent[] } {
  if (st.complete || bit < 0 || bit >= cfg.bits) return { state: st, events: [] };

  const mask = flipBit(st.mask, bit);
  const events: AltarEvent[] = [{ type: 'toggle', bit, on: isBitSet(mask, bit) }];
  let { step, found, revealed } = st;
  let complete = false;

  if (cfg.reveal === 'solo' && popcount(mask) === 1 && (revealed & mask) === 0) {
    revealed |= mask;
    events.push({ type: 'reveal', bit: Math.log2(mask), allRevealed: revealed === fullMask(cfg.bits), source: 'solo' });
  } else if (cfg.reveal === 'solo' && popcount(mask & ~revealed) === 1 && popcount(mask) > 1) {
    // Svítí víc krystalů a neznámý je jen jeden: součet minus známé váhy dá jeho váhu.
    const unknown = mask & ~revealed;
    revealed |= unknown;
    events.push({
      type: 'reveal',
      bit: Math.log2(unknown),
      allRevealed: revealed === fullMask(cfg.bits),
      source: 'deduce',
      known: mask & ~unknown,
    });
  }

  if (cfg.goal.kind === 'all') {
    if (found.includes(mask) && cfg.strict) {
      const to = cfg.initial ?? 0;
      events.push({ type: 'repeat', pattern: mask }, { type: 'reset', to });
      return { state: { ...st, mask: to, found: [to], moves: st.moves + 1 }, events };
    }
    if (found.includes(mask)) {
      events.push({ type: 'repeat', pattern: mask });
    } else {
      found = [...found, mask];
      events.push({ type: 'found', pattern: mask, count: found.length });
      if (found.length === combinations(cfg.bits)) complete = true;
    }
  } else if (cfg.goal.kind === 'class') {
    // Oltář přijme kterékoli číslo skupiny. Patří-li i do další skupiny, přijme ho rovnou znovu.
    const targets = cfg.goal.targets;
    while (step < targets.length && targets[step].values.includes(mask)) {
      events.push({ type: 'step', index: step, target: mask });
      found = [...found, mask];
      step++;
    }
    if (step >= targets.length) complete = true;
  } else {
    const targets = cfg.goal.targets;
    while (step < targets.length && targets[step] === mask) {
      events.push({ type: 'step', index: step, target: mask });
      step++;
      // Přijatá váha prozradí váhy všech krystalů, které ji tvoří.
      if (cfg.reveal === 'solo') {
        for (let i = cfg.bits - 1; i >= 0; i--) {
          const bit = 1 << i;
          if ((mask & bit) && !(revealed & bit)) {
            revealed |= bit;
            events.push({ type: 'reveal', bit: i, allRevealed: revealed === fullMask(cfg.bits), source: 'altar' });
          }
        }
      }
    }
    if (step >= targets.length) complete = true;
  }

  if (complete) events.push({ type: 'complete' });
  return { state: { mask, step, found, revealed, moves: st.moves + 1, complete }, events };
}

/** Nejmenší možný počet doteků k vyřešení (pro pečeť přesnosti). */
export function par(cfg: AltarConfig): number {
  if (cfg.goal.kind === 'all') return combinations(cfg.bits) - 1; // Grayův kód
  if (cfg.goal.kind === 'class') return classCosts(cfg)[0][cfg.initial ?? 0];
  let prev = cfg.initial ?? 0;
  let sum = 0;
  for (const t of cfg.goal.targets) {
    sum += hamming(prev, t);
    prev = t;
  }
  return sum;
}

function highestDiff(a: number, b: number, bits: number): number | null {
  const diff = a ^ b;
  for (let i = bits - 1; i >= 0; i--) if (isBitSet(diff, i)) return i;
  return null;
}

function lowestDiff(a: number, b: number, bits: number): number | null {
  const diff = a ^ b;
  for (let i = 0; i < bits; i++) if (isBitSet(diff, i)) return i;
  return null;
}

/** Krystal, který nápověda 3. stupně doporučí přepnout. */
export function hintBit(cfg: AltarConfig, st: AltarState): number | null {
  if (st.complete) return null;

  if (cfg.goal.kind === 'all' && cfg.strict) return hamiltonStep(cfg.bits, st.mask, st.found) ?? breakStep(cfg.bits, st.mask, st.found);

  if (cfg.goal.kind === 'all') {
    // Nejdřív soused, který ještě není nalezený (vede k Grayovu kódu).
    for (let i = cfg.bits - 1; i >= 0; i--) {
      if (!st.found.includes(flipBit(st.mask, i))) return i;
    }
    // Jinak krok k nejbližší nenalezené kombinaci.
    let best: number | null = null;
    let bestDist = Infinity;
    for (let p = 0; p < combinations(cfg.bits); p++) {
      if (st.found.includes(p)) continue;
      const d = hamming(p, st.mask);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    return best === null ? null : highestDiff(best, st.mask, cfg.bits);
  }

  if (cfg.goal.kind === 'class') {
    // Nejkratší cestou k číslu právě žádané skupiny, ať zvýrazněný krystal sedí s jejím pravidlem
    // v ukázce kroku (lichost nese pravý krystal, ne osmička). Při shodě rozhodne kratší cesta
    // přes další skupiny (ideál) a pak krystal zprava, o kterém pravidla mluví.
    const group = cfg.goal.targets[st.step];
    const near = (m: number) => Math.min(...group.values.map((v) => hamming(v, m)));
    const costs = classCosts(cfg)[st.step];
    const better = (i: number, j: number) => {
      const a = flipBit(st.mask, i);
      const b = flipBit(st.mask, j);
      return near(a) !== near(b) ? near(a) < near(b) : costs[a] < costs[b];
    };
    let best = 0;
    for (let i = 1; i < cfg.bits; i++) if (better(i, best)) best = i;
    return best;
  }

  const target = currentTarget(cfg, st);
  if (target === null) return null;
  return cfg.hintOrder === 'low' ? lowestDiff(target, st.mask, cfg.bits) : highestDiff(target, st.mask, cfg.bits);
}

const classMemo = new WeakMap<AltarConfig, number[][]>();

/**
 * Skupiny čísel: costs[s][m] = kolik doteků nejméně zbývá, když krystaly ukazují m a oltář žádá
 * skupinu s. Číslo skupiny posune oltář dál (i když na něj hráč narazí cestou), proto se počítá
 * po celé desce kombinací, ne jen vzdálenost k nejbližšímu číslu.
 */
function classCosts(cfg: AltarConfig): number[][] {
  const known = classMemo.get(cfg);
  if (known) return known;
  const targets = cfg.goal.kind === 'class' ? cfg.goal.targets : [];
  const size = combinations(cfg.bits);
  const costs: number[][] = new Array(targets.length + 1);
  costs[targets.length] = new Array<number>(size).fill(0);
  for (let s = targets.length - 1; s >= 0; s--) {
    const accept = new Set(targets[s].values);
    const d = Array.from({ length: size }, (_, m) => (accept.has(m) ? costs[s + 1][m] : Infinity));
    for (let changed = true; changed; ) {
      changed = false;
      for (let m = 0; m < size; m++) {
        if (accept.has(m)) continue;
        for (let i = 0; i < cfg.bits; i++) {
          const c = 1 + d[flipBit(m, i)];
          if (c < d[m]) {
            d[m] = c;
            changed = true;
          }
        }
      }
    }
    costs[s] = d;
  }
  classMemo.set(cfg, costs);
  return costs;
}

/**
 * Tichý krok: rozehraná cesta už nejde dokončit bez opakování (slepá ulička). Ukázka kroku to
 * pak řekne a zvýrazní krystal, který cestu vědomě přeruší, místo aby slibovala pokračování.
 */
export function strictDeadEnd(cfg: AltarConfig, st: AltarState): boolean {
  return cfg.goal.kind === 'all' && !!cfg.strict && !st.complete && hamiltonStep(cfg.bits, st.mask, st.found) === null;
}

/** Ze slepé uličky: krystal, který vede na kombinaci z desky, takže tichý krok přeruší hned. */
function breakStep(bits: number, mask: number, found: number[]): number {
  for (let i = 0; i < bits; i++) if (found.includes(flipBit(mask, i))) return i;
  return bits - 1;
}

/**
 * Tichý krok: krystal, kterým cesta pokračuje tak, aby prošla všechny zbylé kombinace
 * bez opakování (hledání do hloubky po krychli). Ze slepé uličky žádná cesta nevede (null).
 */
function hamiltonStep(bits: number, mask: number, found: number[]): number | null {
  const total = combinations(bits);
  const seen = new Set(found);
  const extend = (at: number): boolean => {
    if (seen.size === total) return true;
    for (let i = bits - 1; i >= 0; i--) {
      const next = flipBit(at, i);
      if (seen.has(next)) continue;
      seen.add(next);
      if (extend(next)) return true;
      seen.delete(next);
    }
    return false;
  };
  for (let i = bits - 1; i >= 0; i--) {
    const next = flipBit(mask, i);
    if (seen.has(next)) continue;
    seen.add(next);
    if (extend(next)) return i;
    seen.delete(next);
  }
  return null;
}
