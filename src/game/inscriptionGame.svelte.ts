import {
  confirm as confirmDial,
  currentTask,
  dialWheels,
  hintBit,
  initInscription,
  nudgeDial,
  par as computePar,
  pushDigit,
  setDial,
  shownMask,
  toggle as toggleCrystal,
  type InscriptionConfig,
  type InscriptionEvent,
  type InscriptionState,
  type InscriptionTask,
} from '../core/puzzles/inscription';
import type { InscriptionLevel } from '../content/types';
import { flipBit, isBitSet, maxValue } from '../core/bits';
import { BaseGame, type GameEvent } from './baseGame.svelte.ts';

/** Reaktivní obal kolem Nápisu: čtení na kotoučích a zápis krystaly. */
export class InscriptionGame extends BaseGame<InscriptionLevel> {
  readonly kind = 'inscription';
  readonly wheels: number;
  /** Soustava kotoučů: 10 = čísla, 16 = glyfy. */
  readonly radix: 10 | 16;

  state: InscriptionState = $state(initInscription());
  /** Historie doteků v aktuální úloze zápisu (pro undo). */
  history: InscriptionState[] = $state([]);
  /** Volná hra po vyřešení: krystaly a kotouče jsou propojené (null = ukazuje se poslední nápis). */
  freeMask: number | null = $state(null);

  constructor(level: InscriptionLevel, emit: (e: GameEvent) => void) {
    super(level, computePar, emit);
    this.radix = level.config.radix ?? 10;
    this.wheels = dialWheels(level.config.bits, this.radix);
  }

  get moves(): number {
    return this.state.moves;
  }

  get step(): number {
    return this.state.step;
  }

  get task(): InscriptionTask | null {
    return currentTask(this.level.config, this.state);
  }

  get reading(): boolean {
    return this.phase === 'play' && this.task?.dir === 'read';
  }

  get writing(): boolean {
    return this.phase === 'play' && this.task?.dir === 'write';
  }

  /** Co právě svítí: nápis při čtení, hráčovo světlo při zápisu. */
  get mask(): number {
    if (this.free && this.freeMask !== null) return this.freeMask;
    return shownMask(this.level.config, this.state);
  }

  /** Krystal zvýrazněný nápovědou 3. stupně (zápis). */
  get hintTarget(): number | null {
    return this.writing && this.hintLevel >= 3 ? hintBit(this.level.config, this.state) : null;
  }

  /** Nápověda 3. stupně při čtení odhalí váhy svítících krystalů. */
  get hintWeights(): boolean {
    return this.reading && this.hintLevel >= 3;
  }

  get canUndo(): boolean {
    return this.writing && this.history.length > 0;
  }

  toggle(bit: number): void {
    if (this.free) return this.#freeSet(flipBit(this.mask, bit));
    if (!this.writing) return;
    const before = $state.snapshot(this.state) as InscriptionState;
    this.#apply(toggleCrystal(this.level.config, before, bit), before);
  }

  confirm(): void {
    if (!this.reading) return;
    const before = $state.snapshot(this.state) as InscriptionState;
    this.#apply(confirmDial(this.level.config, before), before);
  }

  nudge(wheel: number, delta: number): void {
    if (this.free) return this.#freeSet(nudgeDial(this.mask, wheel, delta, this.wheels, this.radix));
    this.#setDial(nudgeDial(this.state.dial, wheel, delta, this.wheels, this.radix));
  }

  typeDigit(digit: number): void {
    if (digit >= this.radix) return;
    if (this.free) {
      // Volná hra: číslice se přidá zprava; co by se do krystalů nevešlo, začne nové číslo.
      const next = pushDigit(this.mask, digit, this.wheels, this.radix);
      return this.#freeSet(next > maxValue(this.level.config.bits) ? digit : next);
    }
    this.#setDial(pushDigit(this.state.dial, digit, this.wheels, this.radix));
  }

  /** Smaže poslední napsanou číslici (Backspace). */
  eraseDigit(): void {
    if (this.free) return this.#freeSet(Math.floor(this.mask / this.radix));
    this.#setDial(Math.floor(this.state.dial / this.radix));
  }

  undo(): void {
    if (!this.canUndo) return;
    // Vrací se jen rozsvícení; vrácený dotek se do tahů počítá dál.
    this.state = { ...this.history[this.history.length - 1], moves: this.state.moves };
    this.history = this.history.slice(0, -1);
  }

  protected taskCount(cfg: InscriptionConfig): number {
    return cfg.tasks.length;
  }

  protected sliceTasks(cfg: InscriptionConfig, k: number): InscriptionConfig {
    return { ...cfg, tasks: cfg.tasks.slice(0, k + 1) };
  }

  /** Vyřešený nápis: krystaly ukazují jeho kombinaci a kotouče jeho hodnotu. */
  protected showSolved(): void {
    this.freeMask = null;
    this.state = { ...this.state, step: this.level.config.tasks.length, complete: true, lastGuess: null };
  }

  /** Volná hra: nastaví krystaly (z dotyku i z kotoučů), nic se nepočítá. */
  #freeSet(value: number): void {
    const before = this.mask;
    const mask = Math.max(0, Math.min(maxValue(this.level.config.bits), value));
    this.freeMask = mask;
    for (let bit = 0; bit < this.level.config.bits; bit++) {
      if (isBitSet(before ^ mask, bit)) this.emit({ kind: 'inscription', event: { type: 'toggle', bit, on: isBitSet(mask, bit) }, state: this.state });
    }
  }

  #setDial(value: number): void {
    if (!this.reading) return;
    this.state = setDial(this.level.config, this.state, value);
  }

  #apply(r: { state: InscriptionState; events: InscriptionEvent[] }, before: InscriptionState): void {
    if (r.events.length === 0) return;
    const advanced = r.events.some((e) => e.type === 'step');
    this.history = advanced || this.task?.dir !== 'write' ? [] : [...this.history, before];
    if (advanced) this.hintLevel = 0;
    this.state = r.state;
    for (const event of r.events) this.emit({ kind: 'inscription', event, state: r.state });
    if (r.state.complete) this.solve();
  }
}
