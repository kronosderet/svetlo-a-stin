export type EchoTone = 'speak' | 'hint';

/** Fronta replik průvodce Echo. */
export class Echo {
  lines: string[] = $state([]);
  index = $state(0);
  tone: EchoTone = $state('speak');
  open = $state(true);
  /** Mění se s každou novou replikou (i když je text stejný). */
  serial = $state(0);
  /** Roste s každým say(): podle něj jde poznat, že Echo mezitím začalo mluvit o něčem jiném (add a next ho nemění). */
  topic = 0;
  /**
   * Echo promluvilo právě teď, v téže dávce událostí hry (třeba replika kroku a hned závěr úlohy).
   * Co přijde v téže chvíli, se za repliku jen přidá (follow), ať nezmizí dřív, než jde přečíst.
   */
  fresh = false;
  /** Replika se objevila v bublině (nová nebo další v pořadí): komnata ji pošle čtečce obrazovky. */
  onLine: ((line: string) => void) | null = null;

  get current(): string | null {
    return this.lines[this.index] ?? null;
  }

  get hasMore(): boolean {
    return this.index < this.lines.length - 1;
  }

  say(lines: string[], tone: EchoTone = 'speak'): void {
    if (lines.length === 0) return;
    this.lines = lines;
    this.index = 0;
    this.tone = tone;
    this.open = true;
    this.serial++;
    this.topic++;
    this.#spoke();
    this.onLine?.(lines[0]);
  }

  /** Přidá repliky za ty, které právě běží: hráč na ně přejde tlačítkem dál (nebo je hra posune sama). */
  add(lines: string[]): void {
    if (lines.length === 0) return;
    this.lines = [...this.lines, ...lines];
    this.open = true;
    this.#spoke();
  }

  /** Naváže na repliku z téže chvíle (ta zůstane a nové přijdou za ní), jinak repliky nahradí. */
  follow(lines: string[]): void {
    if (this.fresh) this.add(lines);
    else this.say(lines);
  }

  next(): void {
    if (!this.hasMore) return;
    this.index++;
    this.serial++;
    this.onLine?.(this.lines[this.index]);
  }

  /** Události hry jednoho tahu přicházejí najednou: „právě teď“ skončí s nejbližší mikroúlohou. */
  #spoke(): void {
    this.fresh = true;
    queueMicrotask(() => (this.fresh = false));
  }
}
