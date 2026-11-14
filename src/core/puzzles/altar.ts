/**
 * Archetyp „Oltář“: hráč přepíná krystaly (bity) a plní cíle.
 *  - pattern: napodobit kombinaci vyrytou ve stěně,
 *  - value:   dosáhnout požadované váhy (hodnoty),
 *  - all:     najít všech 2ⁿ kombinací.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { combinations, flipBit, hamming, isBitSet, popcount } from '../bits';

export type AltarGoal =
  | { kind: 'pattern'; targets: number[] }
  | { kind: 'value'; targets: number[] }
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
  /** Nalezené kombinace (all). */
  found: number[];
  /** Pozice, jejichž váha je odhalená. */
  revealed: number;
  moves: number;
  complete: boolean;
}

export type AltarEvent =
  | { type: 'toggle'; bit: number; on: boolean }
  /** source: solo = krystal svítil sám; altar = oltář přijal váhu a vyryl váhy zúčastněných krystalů. */
  | { type: 'reveal'; bit: number; allRevealed: boolean; source: 'solo' | 'altar' }
  | { type: 'found'; pattern: number; count: number }
  | { type: 'repeat'; pattern: number }
  /** Tichý krok se přerušil: deska se vymaže a krystaly se vrátí na začátek. */
  | { type: 'reset'; to: number }
  | { type: 'step'; index: number; target: number }
  | { type: 'complete' };

const fullMask = (bits: number): number => combinations(bits) - 1;

export function targetsOf(cfg: AltarConfig): number[] {
  return cfg.goal.kind === 'all' ? [] : cfg.goal.targets;
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
  if (cfg.goal.kind === 'all' || st.complete) return null;
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

  if (cfg.goal.kind === 'all' && cfg.strict) return hamiltonStep(cfg.bits, st.mask, st.found);

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

  const target = currentTarget(cfg, st);
  if (target === null) return null;
  return cfg.hintOrder === 'low' ? lowestDiff(target, st.mask, cfg.bits) : highestDiff(target, st.mask, cfg.bits);
}

/**
 * Tichý krok: krystal, kterým cesta pokračuje tak, aby prošla všechny zbylé kombinace
 * bez opakování (hledání do hloubky po krychli). Ze slepé uličky žádná cesta nevede:
 * pak nápověda ukáže krystal, který cestu přeruší, a hráč začne znovu.
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
  return bits - 1;
}
