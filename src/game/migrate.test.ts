import { describe, expect, it } from 'vitest';
import { LAYOUT, mergeCounts, mergeSeals, migrateKodexIds, migrateLevelIds } from './migrate';

const seal = (skill: boolean, pure: boolean) => ({ seals: { solved: true, skill, pure } });

describe('převod postupu na rozvržení 4', () => {
  it('Počítadlo poutníků přejde z I-9 do II-1', () => {
    const out = migrateLevelIds({ 'I-9': seal(true, true) }, 3, mergeSeals);
    expect(out).toEqual({ 'II-1': seal(true, true) });
  });

  it('Soutok a Dvě řady se sloučí do II-2: pečetě jen za obě části', () => {
    const out = migrateLevelIds({ 'II-1': seal(true, true), 'II-2': seal(true, false) }, 3, mergeSeals);
    expect(out).toEqual({ 'II-2': seal(true, false) });
  });

  it('sám Soutok otevře sloučenou komnatu', () => {
    expect(migrateLevelIds({ 'II-1': seal(false, true) }, 3, mergeSeals)).toEqual({ 'II-2': seal(false, true) });
  });

  it('statistiky sloučených komnat se sečtou', () => {
    const st = (n: number) => ({ entered: n, solved: n, extra: 0, hints: n, stepHints: 0, quizMistakes: 1 });
    const out = migrateLevelIds({ 'II-1': st(2), 'II-2': st(3), 'I-9': st(1) }, 3, mergeCounts);
    expect(out).toEqual({ 'II-2': { entered: 5, solved: 5, extra: 0, hints: 5, stepHints: 0, quizMistakes: 2 }, 'II-1': st(1) });
  });

  it('postup z nejstaršího rozvržení projde všemi kroky', () => {
    // Rozvržení 1: I-9 bylo Nejvyšší světlo (dnes I-10), I-8 Počítadlo (pak I-9, dnes II-1).
    const out = migrateLevelIds({ 'I-8': seal(true, true), 'I-9': seal(false, false) }, 1, mergeSeals);
    expect(out).toEqual({ 'II-1': seal(true, true), 'I-10': seal(false, false) });
  });

  it('současné rozvržení nechá beze změny', () => {
    const levels = { 'I-9': seal(true, true) };
    expect(migrateLevelIds(levels, LAYOUT)).toEqual(levels);
  });

  it('přeložený záznam Dvou řad přejde na Soutok bez duplicit', () => {
    expect(migrateKodexIds(['jiskra', 'proudy', 'soutok'])).toEqual(['jiskra', 'soutok']);
  });
});
