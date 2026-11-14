import { describe, expect, it } from 'vitest';
import { applyRune, runeTable } from '../logic';
import { evaluate, hint, initGate, lampTable, par, setRune, solutions, test, toggleInput, type Circuit, type GateConfig } from './gate';
import { confirm, hint as tableHint, initTable, pick, tableOf, toggleCell, type TableConfig } from './table';

describe('runy', () => {
  it('pravdivostní tabulky (řádky 00, 01, 10, 11)', () => {
    expect(runeTable('and')).toEqual([0, 0, 0, 1]);
    expect(runeTable('or')).toEqual([0, 1, 1, 1]);
    expect(runeTable('xor')).toEqual([0, 1, 1, 0]);
    expect(runeTable('nand')).toEqual([1, 1, 1, 0]);
    expect(runeTable('nor')).toEqual([1, 0, 0, 0]);
    expect(runeTable('not')).toEqual([1, 0]);
    expect(applyRune('id', 1)).toBe(1);
  });
});

const andGate: Circuit = { inputs: ['A', 'B'], nodes: [{ id: 'g1', rune: 'and', from: ['A', 'B'], col: 1, row: 0 }], output: 'g1' };
const chain: Circuit = {
  inputs: ['A', 'B'],
  nodes: [
    { id: 'g1', choices: ['and', 'or', 'xor'], from: ['A', 'B'], col: 1, row: 0 },
    { id: 'g2', choices: ['id', 'not'], from: ['g1'], col: 2, row: 0 },
  ],
  output: 'g2',
};

describe('Brána: zkoumání', () => {
  const cfg: GateConfig = { tasks: [{ circuit: andGate, mode: 'explore' }] };

  it('lampa svítí podle runy a nové kombinace se zapisují', () => {
    let st = initGate();
    let r = toggleInput(cfg, st, 0);
    expect(r.events).toContainEqual({ type: 'tried', row: 0b10, count: 2, lamp: 0 });
    st = toggleInput(cfg, r.state, 1).state;
    expect(evaluate(andGate, {}, st.inputs).g1).toBe(1);
    r = toggleInput(cfg, st, 0);
    expect(r.state.complete).toBe(true);
    expect(r.state.moves).toBe(par(cfg));
  });

  it('nápověda vede k nevyzkoušené kombinaci', () => {
    let st = initGate();
    while (!st.complete) {
      const h = hint(cfg, st);
      expect(h && 'input' in h).toBe(true);
      st = toggleInput(cfg, st, (h as { input: number }).input).state;
    }
    expect(st.moves).toBe(3);
  });
});

describe('Brána: vkládání run', () => {
  const cfg: GateConfig = { tasks: [{ circuit: chain, mode: 'slots', target: runeTable('nand') }] };

  it('prázdný kámen nepustí světlo', () => {
    expect(lampTable(chain)).toEqual([null, null, null, null]);
  });

  it('Zkouška najde řádky, které nesedí, a správné runy otevřou bránu', () => {
    let st = setRune(cfg, initGate(), 'g1', 'or').state;
    st = setRune(cfg, st, 'g2', 'not').state;
    const r = test(cfg, st);
    expect(r.events[0]).toMatchObject({ type: 'wrong', failed: [1, 2] });
    st = setRune(cfg, r.state, 'g1', 'and').state;
    expect(test(cfg, st).state.complete).toBe(true);
  });

  it('řešení a nápověda', () => {
    expect(solutions(cfg.tasks[0])).toEqual([{ g1: 'and', g2: 'not' }]);
    let st = initGate();
    let guard = 0;
    for (let h = hint(cfg, st); h && guard++ < 10; h = hint(cfg, st)) st = setRune(cfg, st, (h as { node: string }).node, (h as { rune: 'and' }).rune).state;
    expect(test(cfg, st).state.complete).toBe(true);
  });
});

describe('Deska zákona', () => {
  const cfg: TableConfig = {
    tasks: [
      { mode: 'fill', circuit: andGate },
      { mode: 'identify', circuit: { ...andGate, nodes: [{ ...andGate.nodes[0], rune: 'xor' }] }, choices: ['and', 'or', 'xor'], answer: 'xor' },
    ],
  };

  it('vyplnění: chybný řádek, pak správně', () => {
    let st = toggleCell(cfg, initTable(), 0).state;
    let r = confirm(cfg, st);
    expect(r.events[0]).toEqual({ type: 'wrong', row: 0, expected: 0 });
    st = toggleCell(cfg, r.state, 0).state;
    st = toggleCell(cfg, st, 3).state;
    r = confirm(cfg, st);
    expect(r.state.step).toBe(1);
    expect(tableOf(cfg.tasks[1])).toEqual([0, 1, 1, 0]);
  });

  it('poznání runy', () => {
    let st = { ...initTable(), step: 1 };
    let r = pick(cfg, st, 'or');
    expect(r.state.wrongPicks).toEqual(['or']);
    expect(tableHint(cfg, r.state)).toEqual({ rune: 'xor' });
    r = pick(cfg, r.state, 'xor');
    expect(r.state.complete).toBe(true);
    st = r.state;
    expect(st.moves).toBe(2);
  });
});
