import { describe, expect, it } from 'vitest';
import { confirm, initCascade, type CascadeConfig } from '../core/puzzles/cascade';
import { cascadeStep, cascadeWhy } from './cascadeWords';

/** Hláška po potvrzení výsledku `result` v úloze `step`. */
const why = (cfg: CascadeConfig, step: number, result: number): string => {
  const st = { ...initCascade(cfg), step, result };
  const ev = confirm(cfg, st).events[0];
  if (ev.type !== 'wrong') throw new Error('výsledek prošel');
  return cascadeWhy(cfg, st, ev);
};

describe('Kaskáda slovy bez krystalů přenosu', () => {
  const one: CascadeConfig = {
    width: 2,
    bits: 1,
    carries: 'none',
    tasks: [
      { op: 'add', operands: [1, 0] },
      { op: 'add', operands: [1, 1] },
    ],
  };
  const pairs: CascadeConfig = { width: 5, bits: 4, carries: 'none', tasks: [{ op: 'add', operands: [0b0010, 0b0010] }] };
  const POUR4 = 'Ve sloupci vpravo se slila dvě světla. Dohromady váží 4, tolik jako krystal ve třetím sloupci zprava. Rozsviť tento krystal.';

  it('Jedna a jedna: zbytečně rozsvícený krystal s váhou 2 u 1 + 0 není přetečení', () => {
    expect(why(one, 0, 0b11)).toBe('Ve druhém sloupci zprava není žádné světlo. Krystal dole má zůstat zhasnutý.');
  });

  it('Jedna a jedna: u 1 + 1 chybí krystal s váhou 2', () => {
    expect(why(one, 1, 0b00)).toBe(
      'Ve sloupci vpravo se slila dvě světla. Dohromady váží 2, tolik jako krystal ve druhém sloupci zprava. Rozsviť tento krystal.',
    );
  });

  it('Dvě dvojky: dvojice přeteče do prázdného sloupce uvnitř řad', () => {
    expect(why(pairs, 0, 0)).toBe(POUR4);
  });

  it('Dvě dvojky: světlo pod dvojicí (počet světel místo váhy)', () => {
    expect(why(pairs, 0, 0b00010)).toBe(
      'Ve druhém sloupci zprava se slévají dvě světla. Do jednoho krystalu se nevejdou: co zůstane dole a co přeteče?',
    );
  });

  it('ukázka kroku u cílového sloupce řekne totéž', () => {
    expect(cascadeStep(pairs, initCascade(pairs))).toBe(POUR4);
  });
});
