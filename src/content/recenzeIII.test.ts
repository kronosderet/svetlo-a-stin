import { describe, expect, it } from 'vitest';
import { ARITY, runeTable, type Rune } from '../core/logic';
import { initGate, lampTable, setRune, setWire, sockets, solutions, test as runTest, type Circuit, type GateConfig, type GateTask } from '../core/puzzles/gate';
import { gateWrongWords, inputWords, maskStep, sourceWords, tableStep, wrongRuneWords } from '../game/stepWords';
import { ACT_III } from './act3';
import { BRANCH_HINTS, EXPLORE_HINTS, branch, chain, genIII6, genIII7Fill, genIII7Gate, nandOnly, secretSpeech } from './generators3';
import { KODEX } from './kodex';
import { partsOf } from './levels';
import { qTableLit, qTableRows } from './quizzes';
import { seeded } from './random';
import { RUNE_NAME, RUNE_RULE } from './runes';
import type { PuzzleLevel } from './types';

/** Nálezy recenze patra III: generátory, hlášky a nápovědy přes mnoho semínek. */
const SEEDS = 300;
const forSeeds = (fn: (seed: number) => void) => {
  for (let seed = 1; seed <= SEEDS; seed++) fn(seed);
};

const level = (id: string) => ACT_III.levels.find((l) => l.id === id)!;
/** Komnata s jedinou hádankou (ne smíšená brána). */
const puzzle = (id: string): PuzzleLevel => {
  const l = level(id);
  if (l.kind === 'mixed') throw new Error(id);
  return l;
};
const allText = JSON.stringify(ACT_III);

/** Obraceče na vstupech větvení (spojovací runa g se nepočítá). */
const notsOf = (c: Circuit, runes: Record<string, Rune> = {}) =>
  c.nodes.filter((g) => g.id !== 'g' && (g.rune ?? runes[g.id]) === 'not').length;

/**
 * Postup z nápovědy 2 pro větvení: řádek, ve kterém je lampa jiná než ve zbylých třech.
 * Svítí jen tam: Pouto a obrátit vstup, který tam mlčí. Mlčí jen tam: Rozcestí a obrátit vstup, který tam svítí.
 */
function byBranchHint(target: number[]): Record<string, Rune> {
  const lit = target.filter((v) => v === 1).length;
  const odd = target.findIndex((v) => v === (lit === 1 ? 1 : 0));
  const a = (odd >> 1) & 1;
  const b = odd & 1;
  const flipA = lit === 1 ? a === 0 : a === 1;
  const flipB = lit === 1 ? b === 0 : b === 1;
  return { na: flipA ? 'not' : 'id', nb: flipB ? 'not' : 'id', g: lit === 1 ? 'and' : 'or' };
}

describe('D-III-02: větvení na základní cestě má jen jeden Obraceč', () => {
  const checkBuild = (task: GateTask) => {
    expect(task.mode).toBe('slots');
    expect(task.hints).toEqual(BRANCH_HINTS);
    // Cíl nikdy není Zlomené pouto ani Zavřené rozcestí (to je až De Morgan v III-8).
    expect(task.target).not.toEqual(runeTable('nand'));
    expect(task.target).not.toEqual(runeTable('nor'));
    const sols = solutions(task);
    expect(sols).toHaveLength(1);
    expect(notsOf(task.circuit, sols[0].runes)).toBe(1);
    // Kdo se drží nápovědy 2, dojde přesně k řešení.
    expect(byBranchHint(task.target!)).toEqual(sols[0].runes);
  };

  it('III-6 stavba větvení', () => forSeeds((s) => checkBuild(genIII6(seeded(s)).tasks[4])));
  it('III-7 kameny', () => forSeeds((s) => checkBuild(genIII7Gate(seeded(s)).tasks[1])));
  it('III-7 deska', () =>
    forSeeds((s) => {
      const circuit = genIII7Fill(seeded(s)).tasks[1].circuit;
      expect(notsOf(circuit)).toBe(1);
    }));
  it('pevné podoby III-6 a III-7 taky', () => {
    const iii6 = level('III-6');
    if (iii6.kind !== 'gate') throw new Error('III-6');
    checkBuild(iii6.config.tasks[4]);
    const iii7 = partsOf(level('III-7')).find((p) => p.title === 'Kameny')!;
    if (iii7.kind !== 'gate') throw new Error('III-7');
    checkBuild(iii7.config.tasks[1]);
  });
  it('všechna čtyři větvení se losují', () => {
    const seen = new Set<string>();
    forSeeds((s) => seen.add(JSON.stringify(genIII7Gate(seeded(s)).tasks[1].target)));
    expect(seen.size).toBe(4);
  });
});

describe('D-III-03: zkoumání větvení má nápovědy zkoumání', () => {
  it('losovaná i pevná podoba III-6', () => {
    forSeeds((s) => {
      const task = genIII6(seeded(s)).tasks[3];
      expect(task.mode).toBe('explore');
      expect(task.hints).toEqual(EXPLORE_HINTS);
    });
    const iii6 = level('III-6');
    if (iii6.kind !== 'gate') throw new Error('III-6');
    expect(iii6.config.tasks[3].hints).toEqual(EXPLORE_HINTS);
    EXPLORE_HINTS.forEach((h) => expect(h).not.toMatch(/kám/));
  });
});

describe('K-III-02: nenatočený točitý kámen má vlastní hlášku', () => {
  it('Prapečeť s nenatočeným kamenem nehlásí prázdný kámen', () => {
    for (const kind of ['not', 'and', 'or'] as const) {
      const cfg: GateConfig = { tasks: [nandOnly(kind)] };
      const r = runTest(cfg, initGate());
      expect(r.events[0]).toMatchObject({ type: 'wrong', empty: false, unwired: true });
      // Jeden kámen natočený, ostatní ne: pořád nenatočený.
      const first = sockets(cfg.tasks[0].circuit)[0];
      const one = setWire(cfg, initGate(), first.key, 'A').state;
      expect(one.wires[first.key]).toBe('A');
      expect(runTest(cfg, one).events[0]).toMatchObject({ empty: false, unwired: true });
    }
    const text = gateWrongWords(4, false, true);
    expect(text).toContain('točitý kámen');
    expect(text).not.toContain('prázdný');
  });

  it('prázdný kámen s runou zůstane prázdným kamenem', () => {
    const cfg: GateConfig = { tasks: [{ mode: 'slots', circuit: chain(), target: runeTable('nand') }] };
    const st = setRune(cfg, initGate(), 'g1', 'and').state;
    expect(runTest(cfg, st).events[0]).toMatchObject({ empty: true, unwired: false });
    expect(gateWrongWords(4, true, false)).toContain('prázdný');
  });
});

describe('H-III-03: čtečka v Prapečeti hlásí lampu se světlem z točitých kamenů', () => {
  it('hlášení lampy sedí s deskou pro každé řešení a řádek', () => {
    for (const kind of ['not', 'and', 'or'] as const) {
      const task = nandOnly(kind);
      for (const sol of solutions(task)) {
        const lamps = lampTable(task.circuit, sol.runes, sol.wires);
        lamps.forEach((v, row) => {
          const text = inputWords(task.circuit, sol.runes, sol.wires, row, 0);
          expect(text).toContain(v === 1 ? 'Lampa svítí' : 'Lampa mlčí');
        });
      }
    }
  });

  it('zdroj točitého kamene: vstup, nebo runa', () => {
    const c = nandOnly('and').circuit;
    expect(sourceWords(c, 'A')).toBe('ze vstupu A');
    expect(sourceWords(c, 'n1')).toBe('z runy 1');
  });
});

describe('D-III-04: hláška po špatné runě má podmět lampu', () => {
  const two: Rune[] = ['and', 'or', 'xor', 'nand', 'nor', 'xnor', 'imp'];
  it('každá dvojice run', () => {
    for (const answer of two) {
      for (const rune of two.filter((r) => r !== answer)) {
        const want = runeTable(answer);
        const text = wrongRuneWords(rune, ['A', 'B'], want);
        expect(text.startsWith(`S runou ${RUNE_NAME[rune]} by lampa v řádku `)).toBe(true);
        const own = runeTable(rune);
        const r = own.findIndex((v, k) => v !== want[k]);
        expect(text).toContain(own[r] ? 'svítila' : 'mlčela');
      }
    }
  });
  it('runa s jiným počtem vstupů', () => {
    expect(ARITY.not).toBe(1);
    expect(wrongRuneWords('not', ['A', 'B'], runeTable('and'))).toBe('Obraceč bere jediné světlo, deska má ale 2 vstupy.');
  });
});

describe('D-III-18: hláška po neúspěšné Zkoušce podle počtu řádků', () => {
  it('jeden řádek bez množného zájmena', () => {
    const one = gateWrongWords(1, false, false);
    expect(one).toContain('v jednom řádku');
    expect(one).not.toMatch(/nich|ty řádky/);
  });
  it('víc řádků', () => {
    for (let k = 2; k <= 8; k++) {
      const text = gateWrongWords(k, false, false);
      expect(text).toContain(`${k <= 4 ? 've' : 'v'} ${k} řádcích`);
      expect(text).not.toContain('podle nich');
    }
  });
});

describe('K-III-19: ukázka kroku rozliší dva Obraceče', () => {
  it('větvení se dvěma Obraceči', () => {
    const text = tableStep(branch({ a: 'not', b: 'not', join: 'or' }), 1);
    expect(text).toBe('Řádek A stín, B světlo: Obraceč u A dá světlo, Obraceč u B dá stín, Rozcestí dá světlo. Lampa svítí.');
  });
  it('Obraceč za runou vstup nejmenuje', () => {
    expect(tableStep(chain('or', 'not'), 0)).toBe('Řádek A stín, B stín: Rozcestí dá stín, Obraceč dá světlo. Lampa svítí.');
  });
});

describe('K-III-20: ukázka kroku v Tajné řeči mluví o šifře a zprávě', () => {
  it('poslední úloha (klíč neznámý)', () => {
    const cfg = secretSpeech(0b10110001, 0b01011010);
    const task = cfg.tasks[cfg.tasks.length - 1];
    for (let bit = 0; bit < 8; bit++) {
      for (const goal of [true, false]) {
        const text = maskStep(task, bit, goal, true);
        expect(text).not.toMatch(/nápis|výsled/i);
        expect(text).toMatch(/zpráv|šifr/);
      }
    }
  });
});

describe('D-III-17: nápovědy kvízů o desce', () => {
  it('počet řádků: nápověda s číslem a se shodou', () => {
    forSeeds((s) => {
      const q = qTableRows(seeded(s));
      const n = Math.log2(Number(q.options[q.correct]));
      expect(q.hint).not.toMatch(/\bn\b/);
      expect(q.hint).toContain(n === 5 ? 'má 5 krystalů' : `mají ${n} krystaly`);
    });
  });
  it('Pouto: každý vstup svítí v polovině řádků', () => {
    forSeeds((s) => {
      const q = qTableLit(seeded(s));
      expect(JSON.stringify(q)).not.toContain('V polovině řádků svítí jeden vstup');
    });
  });
});

describe('K-III-07: zákony run mluví o vstupech', () => {
  it('runy se dvěma vstupy', () => {
    for (const r of ['and', 'or', 'xor', 'nand', 'nor', 'xnor'] as Rune[]) {
      expect(RUNE_RULE[r]).toMatch(/vstup/);
      expect(RUNE_RULE[r]).not.toMatch(/světl/);
    }
  });
  it('kvíz III-1 se ptá na vstup A', () => {
    const quiz = puzzle('III-1').quiz![0];
    if (typeof quiz === 'function') throw new Error('III-1');
    expect(quiz.question).toContain('Vstup A');
    expect(quiz.options).not.toContain('totéž, co vyšlo');
  });
});

describe('texty patra III', () => {
  it('dotek místo kliknutí (H-I-23)', () => expect(allText).not.toMatch(/[Kk]likn/));
  it('bez zakázaných obratů a mužského rodu (D-III-05, D-III-12)', () => {
    expect(allText).not.toMatch(/[Pp]ostavíš ho|postav sám/);
  });
  it('shoda a velká písmena (D-III-20, H-III-09, H-III-24)', () => {
    expect(allText).not.toContain('Rozcestí jsou');
    expect(level('III-9').title).toBe('Rovnost a Důsledek');
    expect(allText).not.toContain('důsledek.');
    const iii1 = level('III-1');
    expect(iii1.kind === 'gate' && iii1.presentation.task).toContain('prázdných kamenů');
  });
  it('III-0 mluví o runě, ne o kameni (K-III-20)', () => {
    expect(level('III-0').echo.intro.join(' ')).not.toMatch(/kám/);
  });
  it('úvod desky brány bez zájmena bez předmětu (H-III-18)', () => {
    const deska = partsOf(level('III-7')).find((p) => p.title === 'Deska')!;
    expect(deska.echo.intro.join(' ')).not.toContain('z ní');
  });
  it('Výluka dostane svůj znak (K-III-15)', () => expect(level('III-4').echo.solved.join(' ')).toContain('⊻'));
  it('Méně je víc nepočítá losované runy (D-III-11)', () => {
    const line = puzzle('III-14').echo.step?.[0] ?? '';
    expect(line).not.toMatch(/Dvě|Tři|Čtyři|\d/);
  });
  it('Kodex III-9: implikace platí (D-III-19)', () => {
    const today = KODEX.find((e) => e.id === 'spojky')!.today;
    expect(today).not.toContain('nic neporušila');
  });
  it('replika po poslední úloze by zapadla (H-III-17)', () => {
    // Po poslední úloze přijde step i complete naráz: replika kroku by nikdy nezazněla.
    for (const l of ACT_III.levels) {
      for (const part of partsOf(l)) {
        const tasks = (part.config as { tasks?: unknown[] }).tasks;
        if (!tasks) continue;
        expect(part.echo.step?.[tasks.length - 1], `${part.id} ${part.title}`).toBeUndefined();
      }
    }
    expect(puzzle('III-12').echo.complete).toContain('Výluka přepíná');
  });
});
