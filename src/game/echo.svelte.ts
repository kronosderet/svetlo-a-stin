export type EchoTone = 'speak' | 'hint';

/** Fronta replik průvodce Echo. */
export class Echo {
  lines: string[] = $state([]);
  index = $state(0);
  tone: EchoTone = $state('speak');
  open = $state(true);
  /** Mění se s každou novou replikou (i když je text stejný). */
  serial = $state(0);

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
  }

  /** Přidá repliky za ty, které právě běží: hráč na ně přejde tlačítkem dál (nebo je hra posune sama). */
  add(lines: string[]): void {
    if (lines.length === 0) return;
    this.lines = [...this.lines, ...lines];
    this.open = true;
  }

  next(): void {
    if (!this.hasMore) return;
    this.index++;
    this.serial++;
  }
}
