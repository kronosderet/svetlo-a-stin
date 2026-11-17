import { describe, expect, it } from 'vitest';
import { LEVELS, instantiate, partsOf } from '../../content/levels';
import { seeded } from '../../content/random';
import type { Machine } from '../../core/puzzles/machine';
import { boxes, labelBoxes, type Box } from './layout';

/** Všechny stroje ve hře, i z losovaných variant bran. */
function machines(): [string, Machine][] {
  const out: [string, Machine][] = [];
  for (const level of LEVELS) {
    const runs = partsOf(level).some((p) => p.generate) ? 30 : 1;
    for (let s = 0; s < runs; s++) {
      for (const part of partsOf(instantiate(level, seeded(500 + s)))) {
        if (part.kind !== 'machine') continue;
        part.config.tasks.forEach((t, k) => out.push([`${level.id} ${part.title} úloha ${k + 1}`, t.machine]));
      }
    }
  }
  return out;
}

const clash = (a: Box, b: Box, gap = 0) =>
  Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > -gap && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > -gap;

describe('rozložení desky Dílny', () => {
  it('prvky žádného stroje se nepřekrývají', () => {
    const GAP = 0;
    const clashes: string[] = [];
    for (const [name, m] of machines()) {
      const bs = boxes(m);
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i];
          const b = bs[j];
          const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
          const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
          if (w > -GAP && h > -GAP) clashes.push(`${name}: ${a.id} × ${b.id}`);
        }
      }
    }
    expect([...new Set(clashes)]).toEqual([]);
  });

  it('popisky vstupů a lamp nezasahují do jiných prvků ani do sebe', () => {
    const clashes: string[] = [];
    for (const [name, m] of machines()) {
      const things = boxes(m);
      const labels = labelBoxes(m);
      for (let i = 0; i < labels.length; i++) {
        for (const t of things) {
          // Popisek patří ke svému prvku (vstup A má písmeno nad sebou): s ním se srovnávat nemá.
          const own = t.id.endsWith(` ${labels[i].id.split(' ').pop()}`);
          if (!own && clash(labels[i], t)) clashes.push(`${name}: ${labels[i].id} × ${t.id}`);
        }
        for (let j = i + 1; j < labels.length; j++) if (clash(labels[i], labels[j])) clashes.push(`${name}: ${labels[i].id} × ${labels[j].id}`);
      }
    }
    expect([...new Set(clashes)]).toEqual([]);
  });
});
