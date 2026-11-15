import { describe, expect, it } from 'vitest';
import { answer, lightFlow, wallRows, type CascadeConfig, type CascadeTask, type FlowMarks, type FlowMove } from './cascade';
import { LEVELS, instantiate, partsOf } from '../../content/levels';
import { seeded } from '../../content/random';
import type { CascadeLevel } from '../../content/types';

const marks = (p: Partial<FlowMarks>): FlowMarks => ({ result: 0, carries: 0, far: 0, copies: 0, ...p });
const src = (m: FlowMove): string => {
  const f = m.from;
  return f.kind === 'line' ? `r${f.row}c${f.column}` : f.kind === 'loan' ? `loan${f.column}.${f.k}` : `${f.kind}${f.column}`;
};
const to = (m: FlowMove): string => `${m.to.kind}${m.to.column}`;
const flow = (moves: FlowMove[]) => moves.map((m) => `${src(m)}>${to(m)}`);

describe('Kaskáda: světla se přesouvají', () => {
  const one: CascadeConfig = { width: 2, bits: 1, carries: 'none', tasks: [{ op: 'add', operands: [1, 1] }] };

  it('jedna a jedna: obě světla se slijí do krystalu s váhou 2', () => {
    expect(flow(lightFlow(one, one.tasks[0], marks({ result: 0b10 })))).toEqual(['r1c0>result1', 'r0c0>result1']);
  });

  it('do krystalu s váhou 1 sjede jen nejspodnější světlo, druhé zůstane', () => {
    expect(flow(lightFlow(one, one.tasks[0], marks({ result: 0b01 })))).toEqual(['r1c0>result0']);
  });

  it('nic nerozsvíceno, nic se nepohne', () => {
    expect(lightFlow(one, one.tasks[0], marks({}))).toEqual([]);
  });

  const carry: CascadeConfig = { width: 5, bits: 4, carries: 'manual', tasks: [{ op: 'add', operands: [0b0011, 0b0001] }] };

  it('přenos odnese dvě světla shora, výsledek bere zdola', () => {
    expect(flow(lightFlow(carry, carry.tasks[0], marks({ result: 0b100, carries: 0b110 })))).toEqual([
      'r1c0>carry1',
      'r0c0>carry1',
      'r0c1>carry2',
      'carry1>carry2',
      'carry2>result2',
    ]);
  });

  it('pořadí doteků nic nepřehází: výsledek si drží nejspodnější světlo', () => {
    // Tři řady po jednom světle: ve sloupci se slijí tři (výsledek 1, přenos 1).
    const three: CascadeConfig = { width: 2, bits: 1, carries: 'manual', tasks: [{ op: 'add', operands: [1, 1, 1] }] };
    const t = three.tasks[0];
    const alone = lightFlow(three, t, marks({ result: 0b01 }));
    const both = lightFlow(three, t, marks({ result: 0b01, carries: 0b10 }));
    expect(flow(alone)).toEqual(['r2c0>result0']);
    expect(flow(both)).toEqual(['r1c0>carry1', 'r0c0>carry1', 'r2c0>result0']);
  });

  it('přenos bez dost světel se nepohne', () => {
    const t: CascadeTask = { op: 'add', operands: [0b01, 0b00] };
    expect(lightFlow({ width: 3, carries: 'manual', tasks: [t] }, t, marks({ carries: 0b10 }))).toEqual([]);
  });

  const sub: CascadeConfig = { width: 2, carries: 'manual', tasks: [{ op: 'sub', operands: [0b10, 0b01] }] };

  it('odčítání: menšitel se vyruší s půjčeným světlem, druhé sjede do výsledku a soused půjčuje shora', () => {
    expect(flow(lightFlow(sub, sub.tasks[0], marks({ result: 0b01, carries: 0b10 })))).toEqual([
      'loan0.1>cancel0',
      'r1c0>cancel0',
      'loan0.0>result0',
      'r0c1>lend1',
    ]);
  });

  it('odčítání: sloupec, kde se jen vyruší, zůstane, dokud v něm hráč nic nerozsvítí', () => {
    const t: CascadeTask = { op: 'sub', operands: [0b1, 0b1] };
    expect(lightFlow({ width: 1, carries: 'manual', tasks: [t] }, t, marks({}))).toEqual([]);
  });

  // Se správným výsledkem odteče každé světlo sčítání a násobení: do výsledku, nebo do přenosu.
  const cascades = LEVELS.flatMap((l) => partsOf(l)).filter((p): p is CascadeLevel => p.kind === 'cascade');
  for (const level of cascades) {
    it(`${level.id} ${level.title}: se správným výsledkem odteče každé světlo a každý krystal dostane svoje`, () => {
      for (let seed = 1; seed <= 20; seed++) {
        const cfg = (instantiate(level, seeded(seed)) as CascadeLevel).config;
        for (const task of cfg.tasks) {
          const a = answer(cfg, task);
          const copies = task.op === 'mul' && cfg.pickCopies ? task.operands[1] : 0;
          const moves = lightFlow(cfg, task, { result: a.result, carries: a.carries, far: a.far, copies });
          const into = (kind: string, column: number) => moves.filter((m) => m.to.kind === kind && m.to.column === column).length;
          if (task.op === 'sub') {
            for (let i = 0; i < cfg.width; i++) if ((a.result >> i) & 1) expect(into('result', i)).toBe(1);
            continue;
          }
          const lines = wallRows(cfg, task);
          const used = (j: number) => !(task.op === 'mul' && cfg.pickCopies) || ((copies >> j) & 1) === 1;
          const lights = lines.reduce((s, r, j) => s + (used(j) ? r.toString(2).split('1').length - 1 : 0), 0);
          const carried = moves.filter((m) => m.from.kind !== 'line').length;
          expect(moves.length - carried).toBe(lights);
          for (let i = 0; i <= cfg.width; i++) {
            // Bez krystalů přenosu si výsledek bere světla rovnou ze sloupců vpravo (1, 2 nebo 4).
            if ((a.result >> i) & 1) expect(into('result', i)).toBeGreaterThanOrEqual(1);
            if (cfg.carries === 'none') continue;
            if ((a.result >> i) & 1) expect(into('result', i)).toBe(1);
            if ((a.carries >> i) & 1) expect(into('carry', i)).toBe(2);
            if ((a.far >> i) & 1) expect(into('far', i)).toBe(4);
          }
        }
      }
    });
  }
});
