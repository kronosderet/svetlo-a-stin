import { describe, expect, it } from 'vitest';
import {
  answer,
  carryColumns,
  confirm,
  firstWrong,
  initCascade,
  liveInflow,
  par,
  rows,
  rowShifts,
  toggle,
  type CascadeConfig,
  type CascadeState,
} from './cascade';

/** Rozsvítí výsledek a přenosy podle masek (pomůcka pro testy). */
function fill(cfg: CascadeConfig, st: CascadeState, result: number, carries: number): CascadeState {
  let s = st;
  for (let i = 0; i < cfg.width; i++) if ((result >> i) & 1) s = toggle(cfg, s, { row: 'result', column: i }).state;
  for (const c of carryColumns(cfg)) if ((carries >> c) & 1) s = toggle(cfg, s, { row: 'carry', column: c }).state;
  return s;
}

describe('Kaskáda: sčítání', () => {
  const cfg: CascadeConfig = { width: 5, carries: 'manual', tasks: [{ op: 'add', operands: [0b0110, 0b0111] }] };

  it('spočítá výsledek, přenosy a světla ve sloupcích', () => {
    const a = answer(cfg, cfg.tasks[0]);
    expect(a.result).toBe(13);
    // 0 + 1 = 1; 1 + 1 = 10 → přenos do sloupce 2; 1 + 1 + 1 = 11 → přenos do 3; 0 + 0 + 1 = 1
    expect(a.inflow).toEqual([1, 2, 3, 1, 0]);
    expect(a.carries).toBe(0b01100);
    expect(a.maxCarry).toBe(1);
  });

  it('přenos jde jen nad sloupce 1 až width − 1, s přepadem i nad width', () => {
    expect(carryColumns(cfg)).toEqual([1, 2, 3, 4]);
    expect(carryColumns({ ...cfg, width: 4, overflow: true })).toEqual([1, 2, 3, 4]);
    expect(carryColumns({ ...cfg, carries: 'none' })).toEqual([]);
  });

  it('přijme správný výsledek i s přenosy a další úloha začne od nuly', () => {
    const two: CascadeConfig = { ...cfg, tasks: [...cfg.tasks, { op: 'add', operands: [1, 1] }] };
    const st = fill(two, initCascade(), 13, 0b01100);
    expect(firstWrong(two, st)).toBeNull();
    const r = confirm(two, st);
    expect(r.events.map((e) => e.type)).toEqual(['step']);
    expect(r.state).toMatchObject({ step: 1, result: 0, carries: 0, moves: 1, mistakes: 0 });
  });

  it('chyba ukáže první sloupec zprava, nejdřív chybějící přenos', () => {
    // Výsledek správně, ale bez přenosů: první chyba je přenos nad sloupcem 2.
    const st = fill(cfg, initCascade(), 13, 0);
    const r = confirm(cfg, st);
    expect(r.events[0]).toEqual({ type: 'wrong', cell: { row: 'carry', column: 2 }, expected: true, inflow: 2 });
    expect(r.state).toMatchObject({ moves: 1, mistakes: 1, wrong: { row: 'carry', column: 2 } });
  });

  it('špatný bit výsledku hlásí i počet světel ve sloupci', () => {
    const st = fill(cfg, initCascade(), 13 ^ 0b1000, 0b01100);
    const r = confirm(cfg, st);
    expect(r.events[0]).toEqual({ type: 'wrong', cell: { row: 'result', column: 3 }, expected: true, inflow: 1 });
  });

  it('dotek smaže označenou chybu', () => {
    const st = confirm(cfg, initCascade()).state;
    expect(st.wrong).not.toBeNull();
    expect(toggle(cfg, st, { row: 'result', column: 0 }).state.wrong).toBeNull();
  });

  it('bez přenosů se krystaly přenosu nedají přepnout ani se nekontrolují', () => {
    const none: CascadeConfig = { width: 2, carries: 'none', tasks: [{ op: 'add', operands: [1, 1, 1] }] };
    expect(toggle(none, initCascade(), { row: 'carry', column: 1 }).events).toHaveLength(0);
    const st = fill(none, initCascade(), 0b11, 0);
    expect(confirm(none, st).state.complete).toBe(true);
  });

  it('živé počty sčítají i hráčovy krystaly přenosu', () => {
    const task = cfg.tasks[0];
    expect(liveInflow(task, 0, 2)).toBe(2);
    expect(liveInflow(task, 0b100, 2)).toBe(3);
  });

  it('ideál je jedno potvrzení na úlohu', () => {
    expect(par({ ...cfg, tasks: [cfg.tasks[0], cfg.tasks[0], cfg.tasks[0]] })).toBe(3);
  });
});

describe('Kaskáda: přetečení', () => {
  const cfg: CascadeConfig = { width: 4, carries: 'manual', overflow: true, tasks: [{ op: 'add', operands: [0b1100, 0b0110] }] };

  it('co se nevejde, vyteče do přepadu', () => {
    const a = answer(cfg, cfg.tasks[0]);
    expect(a.result).toBe(0b0010);
    expect(a.carries).toBe(0b11000);
    expect(a.spilled).toBe(1);
  });

  it('přepad se musí rozsvítit', () => {
    const st = fill(cfg, initCascade(), 0b0010, 0b01000);
    expect(firstWrong(cfg, st)).toEqual({ row: 'carry', column: 4 });
    expect(confirm(cfg, fill(cfg, initCascade(), 0b0010, 0b11000)).state.complete).toBe(true);
  });
});

describe('Kaskáda: odčítání', () => {
  const cfg: CascadeConfig = { width: 4, carries: 'manual', tasks: [{ op: 'sub', operands: [0b1000, 0b0001] }] };

  it('půjčuje si ze sousedních sloupců', () => {
    const a = answer(cfg, cfg.tasks[0]);
    expect(a.result).toBe(7);
    expect(a.carries).toBe(0b1110);
    expect(a.inflow).toEqual([-1, -1, -1, 0]);
    expect(a.spilled).toBe(0);
  });

  it('bez výpůjčky stačí rozdíl po sloupcích', () => {
    const a = answer(cfg, { op: 'sub', operands: [0b0111, 0b0010] });
    expect(a.result).toBe(5);
    expect(a.carries).toBe(0);
  });

  it('živé počty u odčítání odečítají výpůjčku', () => {
    expect(liveInflow(cfg.tasks[0], 0b0010, 1)).toBe(-1);
    expect(liveInflow(cfg.tasks[0], 0b1000, 3)).toBe(0);
  });
});

describe('Kaskáda: násobení', () => {
  const cfg: CascadeConfig = { width: 6, carries: 'manual', tasks: [{ op: 'mul', operands: [0b111, 0b101] }] };

  it('řádky jsou posunuté kopie prvního činitele', () => {
    expect(rows(cfg.tasks[0])).toEqual([0b111, 0b11100]);
    expect(rowShifts(cfg.tasks[0])).toEqual([0, 2]);
  });

  it('výsledek je součet kopií', () => {
    const a = answer(cfg, cfg.tasks[0]);
    expect(a.result).toBe(35);
    expect(a.maxCarry).toBe(1);
  });
});
