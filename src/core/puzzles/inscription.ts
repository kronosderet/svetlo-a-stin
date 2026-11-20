/**
 * Archetyp „Nápis“: chrám rozsvítí kombinaci a hráč na kamenných kotoučích nastaví její
 * hodnotu (čtení: dvojková → desítková).
 * Pro závěrečnou zkoušku aktu umí i opačný směr (zápis): kotouč ukáže číslo a hráč ho
 * rozsvítí krystaly. Každá úloha začíná ve tmě a s kotouči na nule.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { flipBit, isBitSet, maxValue, popcount } from '../bits';

export type InscriptionTask = { dir: 'read'; value: number } | { dir: 'write'; value: number };

export interface InscriptionConfig {
  bits: number;
  tasks: InscriptionTask[];
  /** Soustava kotoučů: 10 = desítková čísla, 16 = glyfy (každý kotouč je jedna čtveřice krystalů). */
  radix?: 10 | 16;
}

export interface InscriptionState {
  step: number;
  /** Krystaly, které hráč rozsvěcí při zápisu. */
  mask: number;
  /** Číslo na kotoučích při čtení. */
  dial: number;
  moves: number;
  mistakes: number;
  /** Zbytečné doteky v aktuální úloze zápisu: ty, které světlo od zadání vzdálily. */
  strays: number;
  /** Poslední chybný odhad při čtení (UI ho porovná s nápisem). */
  lastGuess: number | null;
  complete: boolean;
}

export type InscriptionEvent =
  | { type: 'toggle'; bit: number; on: boolean }
  | { type: 'wrong'; guess: number; target: number }
  /**
   * Zápis nemá Potvrdit, chybu hlásí sám: slip = typická chyba, na které hráč chvíli zůstal
   * (hra ji pojmenuje), null = další zbytečný dotek. Obojí rozzáří Nápovědu jako chybné čtení.
   */
  | { type: 'slip'; mask: number; target: number; slip: ReadSlip | null }
  | { type: 'step'; index: number; task: InscriptionTask }
  | { type: 'complete' };

type Result = { state: InscriptionState; events: InscriptionEvent[] };

/** Počet kotoučů: kolik číslic má největší hodnota (desítkově 15 → 2, 255 → 3; glyfů na čtveřici jeden). */
export const dialWheels = (bits: number, radix: 10 | 16 = 10): number =>
  radix === 16 ? Math.ceil(bits / 4) : String(maxValue(bits)).length;

export function initInscription(): InscriptionState {
  return { step: 0, mask: 0, dial: 0, moves: 0, mistakes: 0, strays: 0, lastGuess: null, complete: false };
}

export function currentTask(cfg: InscriptionConfig, st: InscriptionState): InscriptionTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Kombinace, kterou krystaly právě ukazují: nápis při čtení, hráčovo světlo při zápisu. */
export function shownMask(cfg: InscriptionConfig, st: InscriptionState): number {
  const task = st.complete ? cfg.tasks[cfg.tasks.length - 1] : cfg.tasks[st.step];
  if (!task) return 0;
  return task.dir === 'read' || st.complete ? task.value : st.mask;
}

function advance(cfg: InscriptionConfig, st: InscriptionState, moves: number, events: InscriptionEvent[]): Result {
  const task = cfg.tasks[st.step];
  events.push({ type: 'step', index: st.step, task });
  const step = st.step + 1;
  const complete = step >= cfg.tasks.length;
  if (complete) events.push({ type: 'complete' });
  return {
    state: { ...st, step, mask: complete ? st.mask : 0, dial: 0, moves, strays: 0, lastGuess: null, complete },
    events,
  };
}

/**
 * Zápis: přepne krystal. Jakmile světlo váží požadovanou hodnotu, úloha je splněná.
 * Dotek, po kterém krystal nesedí se zadáním, je zbytečný. První bývá překlep, každý další
 * se hlásí (slip bez jména), ať se slepému naklikávání rozzáří Nápověda.
 */
export function toggle(cfg: InscriptionConfig, st: InscriptionState, bit: number): Result {
  const task = currentTask(cfg, st);
  if (!task || task.dir !== 'write' || bit < 0 || bit >= cfg.bits) return { state: st, events: [] };
  const mask = flipBit(st.mask, bit);
  const events: InscriptionEvent[] = [{ type: 'toggle', bit, on: isBitSet(mask, bit) }];
  const away = isBitSet(mask ^ task.value, bit);
  const strays = st.strays + (away ? 1 : 0);
  if (away && strays > 1) events.push({ type: 'slip', mask, target: task.value, slip: null });
  const next = { ...st, mask, strays };
  if (mask === task.value) return advance(cfg, next, st.moves + 1, events);
  return { state: { ...next, moves: st.moves + 1 }, events };
}

/** Čtení: nastaví kotouče (není to tah). */
export function setDial(cfg: InscriptionConfig, st: InscriptionState, value: number): InscriptionState {
  const task = currentTask(cfg, st);
  if (!task || task.dir !== 'read') return st;
  const radix = cfg.radix ?? 10;
  const limit = radix ** dialWheels(cfg.bits, radix) - 1;
  return { ...st, dial: Math.max(0, Math.min(limit, Math.trunc(value))) };
}

/** Čtení: potvrdí číslo na kotoučích. Každé potvrzení je jeden tah. */
export function confirm(cfg: InscriptionConfig, st: InscriptionState): Result {
  const task = currentTask(cfg, st);
  if (!task || task.dir !== 'read') return { state: st, events: [] };
  if (st.dial === task.value) return advance(cfg, st, st.moves + 1, []);
  return {
    state: { ...st, moves: st.moves + 1, mistakes: st.mistakes + 1, lastGuess: st.dial },
    events: [{ type: 'wrong', guess: st.dial, target: task.value }],
  };
}

/** Pootočí jedním kotoučem (wheel 0 = nejlevější) o delta s přetočením 9 → 0 (u glyfů F → 0). */
export function nudgeDial(value: number, wheel: number, delta: number, wheels: number, radix = 10): number {
  const place = radix ** (wheels - 1 - wheel);
  const digit = Math.floor(value / place) % radix;
  const next = (((digit + delta) % radix) + radix) % radix;
  return value + (next - digit) * place;
}

/** Napsaná číslice se přidá zprava, nejlevější kotouč se uvolní (jako na kalkulačce). */
export function pushDigit(value: number, digit: number, wheels: number, radix = 10): number {
  return (value * radix + digit) % radix ** wheels;
}

/** Nejmenší možný počet tahů: jedno potvrzení na nápis, jeden dotek na každý krystal zápisu. */
export function par(cfg: InscriptionConfig): number {
  return cfg.tasks.reduce((sum, t) => sum + (t.dir === 'read' ? 1 : popcount(t.value)), 0);
}

/**
 * Typická chyba čtení nebo zápisu, kterou jde poznat z čísla na kotoučích (z krystalů):
 *  - swap:    dvojznak s prohozenými glyfy (levá čtveřice na pravém kotouči),
 *  - nibbles: dvojznak, v němž je zrcadlově každá čtveřice zvlášť (glyfy na svém místě),
 *  - mirror:  nápis čtený zrcadlově (nejlehčí krystal vlevo),
 *  - count:   hráč spočítal svítící krystaly místo jejich vah (jen čtení),
 *  - one:     liší se jediný krystal (weight = jeho váha).
 */
export type ReadSlip = { kind: 'swap' | 'nibbles' | 'mirror' | 'count' } | { kind: 'one'; weight: number };

/** Zrcadlový obraz nápisu: krystal i se přesune na místo bits − 1 − i. */
export function mirrored(value: number, bits: number): number {
  let out = 0;
  for (let i = 0; i < bits; i++) if (isBitSet(value, i)) out |= 1 << (bits - 1 - i);
  return out >>> 0;
}

/** Dvojznak s prohozenými glyfy: B6 → 6B. */
export const swappedGlyphs = (value: number): number => ((value & 0x0f) << 4) | ((value >>> 4) & 0x0f);

/** Dvojznak se zrcadlem v každé čtveřici zvlášť: B6 (1011 0110) → D6 (1101 0110). */
export const mirroredNibbles = (value: number): number => (mirrored(value >>> 4, 4) << 4) | mirrored(value & 0x0f, 4);

/** Chyby ve směru: prohozené glyfy, zrcadlo po čtveřicích (jen dvojznak), zrcadlo celého nápisu. */
function directionSlip(cfg: InscriptionConfig, guess: number, value: number): ReadSlip | null {
  const pair = cfg.radix === 16 && cfg.bits === 8;
  if (pair && guess === swappedGlyphs(value)) return { kind: 'swap' };
  if (pair && guess === mirroredNibbles(value)) return { kind: 'nibbles' };
  if (guess === mirrored(value, cfg.bits)) return { kind: 'mirror' };
  return null;
}

/** Pozná typickou chybu čtení, nebo vrátí null (chyba bez jména, nebo žádná). */
export function readSlip(cfg: InscriptionConfig, guess: number, value: number): ReadSlip | null {
  if (guess === value || guess < 0 || guess > maxValue(cfg.bits)) return null;
  const dir = directionSlip(cfg, guess, value);
  if (dir) return dir;
  if (guess === popcount(value)) return { kind: 'count' };
  const diff = guess ^ value;
  if (popcount(diff) === 1) return { kind: 'one', weight: diff };
  return null;
}

/**
 * Pozná typickou chybu zápisu z rozsvícených krystalů (stejně jako readSlip u čtení, jen bez
 * počtu světel, který při zápisu nic neznamená). Tma není pokus, proto nic nehlásí.
 */
export function writeSlip(cfg: InscriptionConfig, mask: number, value: number): ReadSlip | null {
  if (mask === value || mask <= 0 || mask > maxValue(cfg.bits)) return null;
  const dir = directionSlip(cfg, mask, value);
  if (dir) return dir;
  const diff = mask ^ value;
  return popcount(diff) === 1 ? { kind: 'one', weight: diff } : null;
}

/** Krystal, který nápověda 3. stupně doporučí přepnout (jen při zápisu). */
export function hintBit(cfg: InscriptionConfig, st: InscriptionState): number | null {
  const task = currentTask(cfg, st);
  if (!task || task.dir !== 'write') return null;
  const diff = st.mask ^ task.value;
  for (let i = cfg.bits - 1; i >= 0; i--) if (isBitSet(diff, i)) return i;
  return null;
}
