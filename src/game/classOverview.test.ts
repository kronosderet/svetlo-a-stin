import { describe, expect, it } from 'vitest';
import { ACTS, BASIC_PATH, getLevel } from '../content/levels';
import { floorProgress, isTroublesome, nextBasicRoom, roomSummaries, sealTotal, type Student } from './classOverview';
import type { ProgressData } from './progress.svelte.ts';
import type { RoomStats } from './roomStats';

const seal = (all = true) => ({ seals: { solved: true, skill: all, pure: all } });
const stats = (p: Partial<RoomStats>): RoomStats => ({ entered: 1, solved: 0, extra: 0, hints: 0, stepHints: 0, quizMistakes: 0, ...p });

function student(name: string, levels: string[], st: Record<string, RoomStats> = {}): Student {
  const data: ProgressData = {
    version: 1,
    layout: 3,
    name,
    levels: Object.fromEntries(levels.map((id) => [id, seal()])),
    stats: st,
    kodex: [],
    seen: [],
  };
  return { name, file: `${name}.json`, data };
}

describe('přehled třídy', () => {
  const jana = student('Jana', ['I-0', 'I-1', 'I-2', 'I-3', 'I-4', 'I-5', 'I-6', 'I-7', 'I-8'], { 'II-0': stats({ entered: 2 }) });
  const petr = student('Petr', ['I-0', 'I-1', 'I-2'], {
    'I-1': stats({ solved: 1 }),
    'I-2': stats({ solved: 1, stepHints: 3, extra: 3 }),
    'I-3': stats({ entered: 3 }),
  });

  it('počítá hotové komnaty základu a Hlubších síní v patře', () => {
    expect(floorProgress(jana, ACTS[0])).toEqual({ basic: 8, basicTotal: 8, deep: 1, deepTotal: 8 });
    expect(sealTotal(petr)).toBe(9);
  });

  it('ukáže další komnatu na základní cestě', () => {
    expect(nextBasicRoom(jana, BASIC_PATH)?.id).toBe('II-0');
    expect(nextBasicRoom(petr, BASIC_PATH)?.id).toBe('I-3');
  });

  it('najde komnatu, ve které se třída zasekla nebo potřebovala ukázku kroku', () => {
    const rooms = roomSummaries([jana, petr, student('Ema', ['I-1'], { 'I-2': stats({}) })], [getLevel('I-2')!, getLevel('I-3')!]);
    expect(rooms[0]).toMatchObject({ reached: 3, solved: 2, stuck: 1, stepHints: 1, extra: 3 });
    expect(isTroublesome(rooms[0])).toBe(true);
    expect(rooms[1]).toMatchObject({ reached: 2, solved: 1, stuck: 1 });
  });
});
