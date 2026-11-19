import { describe, expect, it } from 'vitest';
import { LAYOUT, mergeCounts, mergeSeals, migrateKodexIds, migrateLevelIds } from './migrate';

const seal = (skill: boolean, pure: boolean) => ({ seals: { solved: true, skill, pure } });

describe('převod postupu na rozvržení 4 a 5', () => {
  it('Počítadlo poutníků přejde z I-9 do II-1', () => {
    const out = migrateLevelIds({ 'I-9': seal(true, true) }, 3, mergeSeals);
    expect(out).toEqual({ 'II-1': seal(true, true) });
  });

  it('Soutok a Dvě řady skončí v hračce II-0: pečetě jen za obě části', () => {
    const out = migrateLevelIds({ 'II-1': seal(true, true), 'II-2': seal(true, false) }, 3, mergeSeals);
    expect(out).toEqual({ 'II-0': seal(true, false) });
  });

  it('sám Soutok otevře hračku II-0', () => {
    expect(migrateLevelIds({ 'II-1': seal(false, true) }, 3, mergeSeals)).toEqual({ 'II-0': seal(false, true) });
  });

  it('statistiky sloučených komnat se sečtou', () => {
    const st = (n: number) => ({ entered: n, solved: n, extra: 0, hints: n, stepHints: 0, quizMistakes: 1 });
    const out = migrateLevelIds({ 'II-1': st(2), 'II-2': st(3), 'I-9': st(1) }, 3, mergeCounts);
    expect(out).toEqual({ 'II-0': { entered: 5, solved: 5, extra: 0, hints: 5, stepHints: 0, quizMistakes: 2 }, 'II-1': st(1) });
  });

  it('z rozvržení 4: hračka II-0 si nechá vlastní pečetě a nová II-2 je neodehraná', () => {
    const out = migrateLevelIds({ 'II-0': seal(true, true), 'II-2': seal(true, false), 'II-3': seal(true, true) }, 4, mergeSeals);
    expect(out).toEqual({ 'II-0': seal(true, true), 'II-3': seal(true, true) });
  });

  it('vlastní záznam II-0 vyhraje i v obráceném pořadí klíčů', () => {
    const out = migrateLevelIds({ 'II-2': seal(false, false), 'II-0': seal(true, true) }, 4, mergeSeals);
    expect(out).toEqual({ 'II-0': seal(true, true) });
  });

  it('bez vlastního záznamu II-0 ji otevře Soutok', () => {
    expect(migrateLevelIds({ 'II-2': seal(true, false) }, 4, mergeSeals)).toEqual({ 'II-0': seal(true, false) });
  });

  it('statistiky Soutoku (i kvíz Dvou řad) se k hračce II-0 nepřičtou', () => {
    const st = (n: number, quiz = 0) => ({ entered: n, solved: n, extra: 0, hints: 0, stepHints: quiz, quizMistakes: quiz });
    expect(migrateLevelIds({ 'II-0': st(1), 'II-2': st(2, 2) }, 4, mergeCounts)).toEqual({ 'II-0': st(1) });
  });

  it('postup z novějšího rozvržení zůstane beze změny', () => {
    const levels = { 'II-0': seal(true, true), 'II-2': seal(true, true) };
    expect(migrateLevelIds(levels, LAYOUT + 1, mergeSeals)).toEqual(levels);
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

  it('zaniklý záznam Soutok (i dřívější Dvě řady) z přeložených zmizí', () => {
    expect(migrateKodexIds(['jiskra', 'proudy', 'soutok', 'sloupec'])).toEqual(['jiskra', 'sloupec']);
  });
});
