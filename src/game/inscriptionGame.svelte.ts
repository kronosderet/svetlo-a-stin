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
  type InscriptionEvent,
  type InscriptionState,
  type InscriptionTask,
} from '../core/puzzles/inscription';
import type { InscriptionLevel } from '../content/types';
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

  constructor(level: InscriptionLevel, emit: (e: GameEvent) => void) {
    super(level, computePar(level.config), emit);
    this.radix = level.config.radix ?? 10;
    this.wheels = dialWheels(level.config.bits, this.radix);
  }

  get moves(): number {
    return this.state.moves;
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
    this.#setDial(nudgeDial(this.state.dial, wheel, delta, this.wheels, this.radix));
  }

  typeDigit(digit: number): void {
    if (digit >= this.radix) return;
    this.#setDial(pushDigit(this.state.dial, digit, this.wheels, this.radix));
  }

  /** Smaže poslední napsanou číslici (Backspace). */
  eraseDigit(): void {
    this.#setDial(Math.floor(this.state.dial / this.radix));
  }

  undo(): void {
    if (!this.canUndo) return;
    // Vrací se jen rozsvícení; vrácený dotek se do tahů počítá dál.
    this.state = { ...this.history[this.history.length - 1], moves: this.state.moves };
    this.history = this.history.slice(0, -1);
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
