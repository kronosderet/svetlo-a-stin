import { describe, expect, it } from 'vitest';
import { confirm, initCascade, toggle, type CascadeCell, type CascadeConfig, type CascadeState } from '../core/puzzles/cascade';
import { cascadeRefusal, cascadeStep, cascadeWhy } from './cascadeWords';

/** Hláška po `times`. potvrzení výsledku `result` v úloze `step` (konkrétní krystal řekne až druhé). */
const why = (cfg: CascadeConfig, step: number, result: number, times = 1): string => {
  let st: CascadeState = { ...initCascade(cfg), step, result };
  for (let k = 1; k < times; k++) st = confirm(cfg, st).state;
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

  it('Jedna a jedna: u 1 + 1 chybí krystal s váhou 2 (druhé potvrzení)', () => {
    expect(why(one, 1, 0b00, 2)).toBe(
      'Ve sloupci vpravo se slila dvě světla. Dohromady váží 2, tolik jako krystal ve druhém sloupci zprava. Rozsviť tento krystal.',
    );
  });

  it('Dvě dvojky: dvojice přeteče do prázdného sloupce uvnitř řad (druhé potvrzení)', () => {
    expect(why(pairs, 0, 0, 2)).toBe(POUR4);
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

describe('Zachování světla slovy: proč se krystal nerozsvítil', () => {
  /** Rozsvítí buňky lit a řekne, proč se buňka cell nerozsvítí. */
  const refusal = (cfg: CascadeConfig, lit: CascadeCell[], cell: CascadeCell): string => {
    let st: CascadeState = initCascade(cfg);
    for (const c of lit) st = toggle(cfg, st, c).state;
    expect(toggle(cfg, st, cell).events).toEqual([{ type: 'refuse', cell }]);
    return cascadeRefusal(cfg, cfg.tasks[0], st, cell);
  };
  const res = (column: number): CascadeCell => ({ row: 'result', column });
  const car = (column: number): CascadeCell => ({ row: 'carry', column });
  const one = (a: number, b: number): CascadeConfig => ({ width: 2, bits: 1, carries: 'none', conserve: true, tasks: [{ op: 'add', operands: [a, b] }] });
  const manual = (a: number, b: number): CascadeConfig => ({ width: 3, carries: 'manual', conserve: true, tasks: [{ op: 'add', operands: [a, b] }] });
  const minus = (a: number, b: number): CascadeConfig => ({ width: 3, carries: 'manual', conserve: true, tasks: [{ op: 'sub', operands: [a, b] }] });

  it('Jedna a jedna: do prázdného sloupce přiteče jen dvojice', () => {
    expect(refusal(one(1, 0), [], res(1))).toBe(
      'Ve druhém sloupci zprava žádné světlo není. Přitéct sem může jen dvojice světel ze sloupce vpravo, a ta tam není.',
    );
    expect(refusal(one(1, 1), [res(0)], res(1))).toBe(
      'Ve druhém sloupci zprava žádné světlo není. Přitéct sem může jen celá dvojice ze sloupce vpravo, a tam už jedno světlo sjelo dolů do krystalu výsledku.',
    );
    expect(refusal(one(1, 1), [res(1)], res(0))).toBe('Obě světla prvního sloupce zprava už přetekla do sloupce vlevo. Dolů nezbylo nic.');
  });

  it('přenos dostane dvojici ze sloupce vpravo, výsledek jedno světlo ze svého sloupce', () => {
    expect(refusal(manual(1, 0), [], car(1))).toBe(
      'Do krystalu přenosu přetéká dvojice světel ze sloupce vpravo. V prvním sloupci zprava je jen jedno světlo.',
    );
    expect(refusal(manual(1, 1), [res(0)], car(1))).toBe(
      'Do krystalu přenosu přetéká dvojice světel ze sloupce vpravo. V prvním sloupci zprava už ale jedno světlo sjelo dolů do krystalu výsledku a na dvojici nezbývá.',
    );
    expect(refusal(manual(1, 1), [car(1)], res(0))).toBe('V prvním sloupci zprava už všechna světla odtekla nahoru do přenosu. Dolů nezbylo nic.');
    expect(refusal(manual(1, 0), [], res(2))).toBe('Ve třetím sloupci zprava žádné světlo není. Krystal výsledku nemá z čeho svítit.');
  });

  it('Tři řady: pět světel ve sloupci, čtyři odtekla o dvě místa a jedno dolů', () => {
    const three: CascadeConfig = { width: 6, bits: 4, carries: 'manual', farCarries: true, conserve: true, tasks: [{ op: 'add', operands: [15, 15, 15] }] };
    const far = (column: number): CascadeCell => ({ row: 'far', column });
    expect(refusal(three, [res(0), car(1), far(3), res(2), car(3), far(5), res(3)], car(4))).toBe(
      'Do krystalu přenosu přetéká dvojice světel ze sloupce vpravo. Ve čtvrtém sloupci zprava už ale čtyři světla odtekla o dvě místa dál a na dvojici nezbývá.',
    );
  });

  it('odčítání: bez výpůjčky není od čeho odečítat a půjčit jde jen volné světlo', () => {
    expect(refusal(minus(0b10, 0b01), [], res(0))).toBe(
      'V prvním sloupci zprava není od čeho odečítat. Bez výpůjčky ze sloupce vlevo tu žádné světlo nebude.',
    );
    expect(refusal(minus(0b11, 0b01), [], res(0))).toBe('V prvním sloupci zprava spodní řada odečte jediné světlo. Na výsledek nezbylo nic.');
    expect(refusal(minus(0b10, 0b01), [car(1)], res(1))).toBe('Jediné volné světlo druhého sloupce zprava už je půjčené sousedovi vpravo.');
    expect(refusal(minus(0b100, 0b001), [], car(1))).toBe(
      'Ve druhém sloupci zprava není co půjčit. Sloupec si nejdřív musí půjčit od souseda vlevo.',
    );
    expect(refusal(minus(0b10, 0b00), [res(1)], car(1))).toBe(
      'Jediné volné světlo druhého sloupce zprava už sjelo do krystalu výsledku. Půjčit už není co.',
    );
  });
});
