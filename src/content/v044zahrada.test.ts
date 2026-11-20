import { describe, expect, it } from 'vitest';
import { runeTable, type Rune } from '../core/logic';
import {
  hint,
  hintDone,
  initGate,
  nearestSolution,
  par,
  setRune,
  setWire,
  solutions,
  sourcesOf,
  test as runTest,
  toggleInput,
  type Circuit,
  type GateConfig,
  type GateHint,
  type GateState,
  type GateTask,
} from '../core/puzzles/gate';
import { confirm, initTable, pick, tableOf, toggleCell, type TableConfig } from '../core/puzzles/table';
import { sourceWords, tableStep, wireStep } from '../game/stepWords';
import { ACT_III } from './act3';
import { EXPLORE_HINTS, chain, genIII15Identify, genIII15Nand, genIII5, genIII6, genIII7Fill, majority, nandOnly, single } from './generators3';
import { ACTS, partsOf } from './levels';
import { seeded } from './random';
import type { GateLevel, PuzzleLevel, TableLevel } from './types';

/** Etapa 0.4.4, oblast Zahrada: ukázka kroku v Bráně a Prapečeti, nápovědy a opory patra III. */
const SEEDS = 250;
const forSeeds = (fn: (seed: number) => void) => {
  for (let seed = 1; seed <= SEEDS; seed++) fn(seed);
};

const level = (id: string) => ACT_III.levels.find((l) => l.id === id)!;
const part = (id: string, title: string): PuzzleLevel => partsOf(level(id)).find((p) => p.title === title)!;
const gate = (id: string): GateLevel => {
  const l = level(id);
  if (l.kind !== 'gate') throw new Error(id);
  return l;
};
const gatePart = (id: string, title: string): GateLevel => {
  const p = part(id, title);
  if (p.kind !== 'gate') throw new Error(`${id} ${title}`);
  return p;
};
const tablePart = (id: string, title: string): TableLevel => {
  const p = part(id, title);
  if (p.kind !== 'table') throw new Error(`${id} ${title}`);
  return p;
};
const TWO: Rune[] = ['and', 'or', 'xor'];

/** Tah podle ukázky kroku (nápovědy 3. stupně) Brány; bez ukázky Zkouška. */
function follow(cfg: GateConfig, st: GateState, h: GateHint | null) {
  if (h && 'input' in h) return toggleInput(cfg, st, h.input);
  if (h && 'socket' in h) return setWire(cfg, st, h.socket, h.source);
  if (h) return setRune(cfg, st, h.node, h.rune);
  return runTest(cfg, st);
}

describe('A3: Brána dá jeden krok na jeden stisk', () => {
  it('krok podle ukázky se počítá jako provedený, jiný tah ne', () => {
    const explore: GateConfig = { tasks: [{ mode: 'explore', circuit: single('and') }] };
    const h = hint(explore, initGate());
    expect(h).toEqual({ input: 0 });
    const right = toggleInput(explore, initGate(), 0);
    expect(hintDone(h, right.state, right.events)).toBe(true);
    const other = toggleInput(explore, initGate(), 1);
    expect(hintDone(h, other.state, other.events)).toBe(false);

    const slots: GateConfig = { tasks: [{ mode: 'slots', circuit: chain(), target: runeTable('nand') }] };
    const hs = hint(slots, initGate());
    expect(hs).toEqual({ node: 'g1', rune: 'and' });
    expect(hintDone(hs, setRune(slots, initGate(), 'g1', 'or').state, [])).toBe(false);
    expect(hintDone(hs, setRune(slots, initGate(), 'g1', 'and').state, [])).toBe(true);

    const nand: GateConfig = { tasks: [nandOnly('not')] };
    const hw = hint(nand, initGate());
    expect(hw).toEqual({ socket: 'n1:0', source: 'A' });
    expect(hintDone(hw, setWire(nand, initGate(), 'n1:0', 'B').state, [])).toBe(false);
    expect(hintDone(hw, setWire(nand, initGate(), 'n1:0', 'A').state, [])).toBe(true);
    // Hotový obvod: ukázka ukazuje na Zkoušku, ta úlohu posune sama (stupeň se pak nuluje).
    expect(hintDone(null, initGate(), [])).toBe(false);
  });

  it('každý tah podle ukázky se počítá jako provedený krok (všechny Brány patra III)', () => {
    for (const l of ACT_III.levels) {
      for (const p of partsOf(l)) {
        if (p.kind !== 'gate') continue;
        const cfg = p.config;
        let st = initGate();
        let guard = 0;
        while (!st.complete && guard++ < 300) {
          const h = hint(cfg, st);
          const r = follow(cfg, st, h);
          if (h) expect(hintDone(h, r.state, r.events), `${p.id} ${p.title}`).toBe(true);
          st = r.state;
        }
        expect(st.complete).toBe(true);
      }
    }
  });

  /**
   * Model stupňů nápovědy v GateGame (useHint, settledHint, #apply): kolik ukázek kroku hráč
   * vyžádá, když jde jen podle nich. Každý stisk dá jeden krok, Zkoušku hotového obvodu hra řekne zdarma.
   */
  function stepHints(cfg: GateConfig): number {
    let st = initGate();
    let lvl = 0;
    let count = 0;
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const h = hint(cfg, st);
      const settled = !h && cfg.tasks[st.step].mode === 'slots';
      if (lvl < 3 && !(settled && lvl === 2)) {
        lvl = 3;
        count++;
      }
      const r = follow(cfg, st, h);
      if (hintDone(lvl >= 3 ? h : null, r.state, r.events)) lvl = 2;
      if (r.events.some((e) => e.type === 'step')) lvl = 0;
      st = r.state;
    }
    return count;
  }

  it('ukázek kroku je tolik, kolik je kroků', () => {
    // Prapečeť: 2 + 2 + 6 točitých kamenů; zkoumání v III-2: tři doteky; Řetězy: 2 + 2 + 2 kameny a 3 doteky a 3 kameny.
    expect(stepHints(gate('III-11').config)).toBe(10);
    expect(stepHints(gatePart('III-2', 'Zkoumání').config)).toBe(3);
    expect(stepHints(gate('III-6').config)).toBe(2 + 2 + 2 + 3 + 3);
  });
});

describe('A4: ukázka kroku u točitého kamene jmenuje zdroj a důvod', () => {
  const text = (task: GateTask, st: GateState) => {
    const h = hint({ tasks: [task] }, st);
    if (!h || !('socket' in h)) throw new Error('není točitý kámen');
    return wireStep(task.circuit, nearestSolution(task, st)!.wires, h.socket);
  };
  const after = (wires: Record<string, string>): GateState => ({ ...initGate(), wires });

  it('Obraceč ze Zlomeného pouta', () => {
    expect(text(nandOnly('not'), initGate())).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo ze vstupu A. Zlomené pouto se stejným světlem na obou vstupech je Obraceč.',
    );
  });

  it('Pouto: Obraceč za Zlomeným poutem', () => {
    expect(text(nandOnly('and'), initGate())).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo z runy 1. Zlomené pouto se stejným světlem na obou vstupech je Obraceč. Obraceč za Zlomeným poutem dá Pouto.',
    );
  });

  it('Rozcestí: obrácené vstupy a Zlomené pouto za nimi', () => {
    const or = nandOnly('or');
    expect(text(or, initGate())).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo ze vstupu A. Runa 1 se stejným světlem na obou vstupech obrátí A. Rozcestí je Zlomené pouto obrácených vstupů.',
    );
    expect(text(or, after({ 'n1:0': 'A', 'n1:1': 'A', 'n2:0': 'B', 'n2:1': 'B' }))).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo z runy 1. Runa 1 obrací A a runa 2 obrací B. Zlomené pouto obrácených vstupů je Rozcestí.',
    );
    // Hráč začal druhým řešením (runa 1 obrací B): ukázka jde s ním, ne proti němu.
    expect(text(or, after({ 'n1:0': 'B' }))).toContain('ze vstupu B. Runa 1 se stejným světlem na obou vstupech obrátí B.');
  });

  it('ukázka v Prapečeti nikdy nevrátí obecnou větu (III-11, III-15, i z chybných stavů)', () => {
    // Obecná věta, kterou dřív říkala třetí nápověda (A8 ji smazal, ukázka kroku má vždy vlastní).
    const generic = 'Zvýrazněný točitý kámen je potřeba pootočit.';
    expect(gate('III-11').hints).toHaveLength(2);
    // Úlohy III-11 a všechny losované podoby III-15 (každá jen jednou).
    const unique = new Map<string, GateTask>();
    for (const t of gate('III-11').config.tasks) unique.set(JSON.stringify(t), t);
    forSeeds((s) => genIII15Nand(seeded(s)).tasks.forEach((t) => unique.set(JSON.stringify(t), t)));
    [...unique.values()].forEach((task, k) => {
      const rng = seeded(1000 + k);
      const socks = Object.keys(solutions(task)[0].wires);
      // Od začátku a z náhodně natočených kamenů (část natočená špatně, část vůbec).
      const starts: GateState[] = [initGate()];
      for (let j = 0; j < 40; j++) {
        const wires: Record<string, string> = {};
        for (const key of socks) {
          const choices = task.circuit.nodes.find((g) => g.id === key.split(':')[0])!.free!;
          if (rng() < 0.7) wires[key] = choices[Math.floor(rng() * choices.length)];
        }
        starts.push({ ...initGate(), wires });
      }
      for (const start of starts) {
        const cfg: GateConfig = { tasks: [task] };
        let st = start;
        let guard = 0;
        while (!st.complete && guard++ < 20) {
          const h = hint(cfg, st);
          if (h && 'socket' in h) {
            const words = text(task, st);
            expect(words).not.toBe(generic);
            expect(words).toContain(`aby světlo teklo ${sourceWords(task.circuit, h.source)}.`);
            // Vždy důvod podle role runy, ne obecný zákon Zlomeného pouta.
            expect(words).toMatch(/je Obraceč\.|dá Pouto\.|je Rozcestí\.|obrácených vstupů\.$/);
          }
          st = follow(cfg, st, h).state;
        }
        expect(st.complete).toBe(true);
        expect(st.mistakes).toBe(0);
      }
    });
  });

  it('nápověda 2 v III-11 dostala Rozcestí a úvod točité kameny', () => {
    const iii11 = gate('III-11');
    expect(iii11.hints[1]).toContain('Rozcestí je Zlomené pouto obrácených vstupů.');
    expect(iii11.echo.intro.join(' ')).toMatch(/točité kameny/);
    // Nápověda 1 už jen neopakuje ovládání: ptá se na Obraceč, na kterém stojí všechny tři úlohy.
    expect(iii11.hints[0]).toMatch(/\?$/);
  });
});

describe('A6: nápovědy patra III radí, neopakují ovládání a neprozradí pointu', () => {
  /** Kombinace slovy z nápovědy 2 zkoumání → řádek desky (A je vyšší bit). */
  const ROW: Record<string, number> = { 'oba stín': 0, 'jen B': 1, 'jen A': 2, 'oba světlo': 3 };

  it('pořadí kombinací v nápovědě 2 zkoumání stojí tři doteky a jde jako ukázka kroku (H-III-16)', () => {
    const order = EXPLORE_HINTS[1]
      .split(':')[1]
      .split('.')[0]
      .split(',')
      .map((w) => ROW[w.trim()]);
    expect(order).toEqual([0, 2, 3, 1]);
    for (let k = 1; k < order.length; k++) expect([1, 2]).toContain(order[k] ^ order[k - 1]);
    expect(EXPLORE_HINTS[1]).toContain('tři doteky');
    for (const rune of ['and', 'or', 'xor', 'xnor', 'imp'] as Rune[]) {
      const cfg: GateConfig = { tasks: [{ mode: 'explore', circuit: single(rune) }] };
      let st = initGate();
      const seen = [st.inputs];
      while (!st.complete) {
        st = toggleInput(cfg, st, (hint(cfg, st) as { input: number }).input).state;
        seen.push(st.inputs);
      }
      expect(seen).toEqual(order);
      expect(st.moves).toBe(par(cfg));
    }
  });

  it('III-10: rada z nápovědy 2 vede k ideálu sedmi doteků (D-III-22)', () => {
    const p = gatePart('III-10', 'Zkoumání');
    expect(p.hints[1]).toContain('Nevracej se ke kombinaci, kterou už máš.');
    expect(p.hints.slice(0, 2).join(' ')).not.toMatch(/Každým dotekem|Měň pokaždé/);
    // Projdi čtyři kombinace A a B, přepni C a projdi je pozpátku.
    const cfg = p.config;
    let st = initGate();
    for (const input of [0, 1, 0, 2, 0, 1, 0]) st = toggleInput(cfg, st, input).state;
    expect(st.complete).toBe(true);
    expect(st.moves).toBe(par(cfg));
    expect(par(cfg)).toBe(7);
  });

  it('III-6: nápověda 1 rozliší Zlomené pouto od Zavřeného rozcestí (D-III-22)', () => {
    expect(gate('III-6').hints[0]).not.toContain('když svítí oba vstupy');
    // Runa, která mlčí přesně ve zbylých řádcích (svítí tam, kde lampa mlčí), je jediná a je v řešení.
    const check = (task: GateTask) => {
      const fits = TWO.filter((r) => runeTable(r).every((v, k) => v === (task.target![k] === 0 ? 1 : 0)));
      expect(fits).toHaveLength(1);
      expect(solutions(task).map((s) => s.runes)).toContainEqual({ g1: fits[0], g2: 'not' });
    };
    gate('III-6').config.tasks.slice(0, 3).forEach(check);
    forSeeds((s) => genIII6(seeded(s)).tasks.slice(0, 3).forEach(check));
  });

  it('III-9: náznak před zákony (D-III-13)', () => {
    const [first, second] = tablePart('III-9', 'Desky').hints;
    expect(first).toMatch(/\?/);
    expect(first).not.toContain('1 0');
    expect(second).toContain('Rovnost svítí, když se vstupy shodují.');
    expect(second).toContain('Důsledek mlčí jen v řádku 1 0');
  });

  it('III-15: nápověda 2 Závoje pokryje každou losovanou runu (D-III-08)', () => {
    const text = tablePart('III-15', 'Závoj').hints[1];
    const named: Partial<Record<Rune, string>> = {
      imp: 'Důsledek',
      xnor: 'Rovnost',
      nand: 'Zlomené pouto',
      nor: 'Zavřené rozcestí',
      xor: 'Výluky',
    };
    forSeeds((s) =>
      genIII15Identify(seeded(s)).tasks.forEach((t) => {
        if (t.mode !== 'identify') throw new Error('III-15');
        expect(named[t.answer], t.answer).toBeDefined();
        expect(text).toContain(named[t.answer]);
      }),
    );
    // Obrácené páry v nápovědě opravdu mají obrácené desky.
    const flip = (r: Rune) => runeTable(r).map((v) => 1 - v);
    expect(runeTable('nand')).toEqual(flip('and'));
    expect(runeTable('nor')).toEqual(flip('or'));
    expect(runeTable('xnor')).toEqual(flip('xor'));
  });

  it('III-10: závěr popíše obě zapojení a obě jsou řešením (H-III-08)', () => {
    const line = level('III-10').echo.solved.join(' ');
    expect(line).toContain('Pout u dvojic vstupů a Rozcestí za nimi');
    expect(line).toContain('Rozcestí u dvojic a za nimi Pouta');
    const task = gatePart('III-10', 'Stavba').config.tasks[0];
    const sols = solutions(task).map((s) => s.runes);
    expect(sols).toContainEqual({ ab: 'and', ac: 'and', bc: 'and', o1: 'or', o2: 'or' });
    expect(sols).toContainEqual({ ab: 'or', ac: 'or', bc: 'or', o1: 'and', o2: 'and' });
    expect(majority(true).nodes).toHaveLength(5);
  });
});

/**
 * Deska jen ze zákonů viditelných run, bez lampy: v každém řádku runa po runě zleva doprava
 * (postup z nápovědy 2 v III-7). Zákon runy je řádek její vlastní desky podle světel na vstupech.
 */
function byRunes(circuit: Circuit): number[] {
  const n = circuit.inputs.length;
  return Array.from({ length: 2 ** n }, (_, row) => {
    const light: Record<string, number> = {};
    circuit.inputs.forEach((name, i) => (light[name] = (row >> (n - 1 - i)) & 1));
    for (const g of circuit.nodes) {
      expect(g.rune, 'v desce k vyplnění je každá runa vidět').toBeDefined();
      light[g.id] = runeTable(g.rune!)[g.from.reduce((k, f) => k * 2 + light[f], 0)];
    }
    return light[circuit.output];
  });
}

/** Deska vyplněná podle zákona run (bez lampy) a potvrzená; runa pod závojem poznaná napoprvé. */
const fromRunes = (cfg: TableConfig) => {
  let st = initTable();
  let guard = 0;
  while (!st.complete && guard++ < 40) {
    const task = cfg.tasks[st.step];
    if (task.mode === 'identify') {
      st = pick(cfg, st, task.answer).state;
      continue;
    }
    byRunes(task.circuit).forEach((v, r) => {
      if (v) st = toggleCell(cfg, st, r).state;
    });
    st = confirm(cfg, st).state;
  }
  return st;
};

describe('B5: deska se v III-5 a III-9 píše podle runy, ne opisem z lampy', () => {
  it('III-5: lampa pod závojem a zadání jako pokyn (D-III-06, D-III-21)', () => {
    const iii5 = level('III-5');
    if (iii5.kind !== 'table') throw new Error('III-5');
    expect(iii5.presentation.veilLamp).toBe(true);
    expect(iii5.presentation.task).toMatch(/^Poznej /);
    expect(iii5.presentation.task).toMatch(/vyplň/);
    expect(iii5.presentation.task).toContain('Lampa je tam pod závojem.');
    // Nápověda 2 dá desku každé runy i bez lampy.
    const LIT: Record<string, number[]> = { and: [3], or: [1, 2, 3], xor: [1, 2] };
    expect(iii5.hints[1]).toBe('Pouto svítí jen v řádku 1 1, Rozcestí ve všech kromě 0 0, Výluka v řádcích 0 1 a 1 0.');
    for (const r of TWO) expect(runeTable(r).flatMap((v, k) => (v ? [k] : []))).toEqual(LIT[r]);
  });

  it('genIII5: dvě různé vyplňované runy, poznávané nezávisle a aspoň dvě různé, dohromady všechny tři', () => {
    const iii5 = level('III-5');
    if (iii5.kind !== 'table') throw new Error('III-5');
    expect(iii5.echo.complete).toBe('Pět desek, tři runy.');
    const thirds = new Map<string, Set<Rune>>();
    let repeated = 0;
    const configs = [iii5.config];
    forSeeds((s) => configs.push(genIII5(seeded(s))));
    configs.forEach((cfg, k) => {
      expect(cfg.tasks.map((t) => t.mode)).toEqual(['identify', 'fill', 'identify', 'fill', 'identify']);
      const rune = (t: TableConfig['tasks'][number]) => t.circuit.nodes[0].rune as Rune;
      const veiled = cfg.tasks.filter((t) => t.mode === 'identify').map(rune);
      const fills = cfg.tasks.filter((t) => t.mode === 'fill').map(rune);
      expect(new Set(fills).size).toBe(2);
      expect(new Set(veiled).size).toBeGreaterThanOrEqual(2);
      expect(new Set([...veiled, ...fills]).size).toBe(3);
      cfg.tasks.forEach((t) => {
        if (t.mode === 'identify') expect(t.choices).toEqual(TWO);
      });
      if (k === 0) return;
      if (new Set(veiled).size < 3) repeated++;
      const key = veiled.slice(0, 2).join();
      thirds.set(key, (thirds.get(key) ?? new Set()).add(veiled[2]));
      // Deska podle zákona runy projde napoprvé (lampa nic neprozradí).
      expect(fromRunes(cfg).mistakes).toBe(0);
    });
    // Třetí runa pod závojem nejde uhodnout z prvních dvou.
    for (const [key, seen] of thirds) expect(seen.size, key).toBeGreaterThanOrEqual(2);
    expect(repeated).toBeGreaterThan(0);
  });

  it('III-9: desky pod závojem, runa se pozná až po desce té druhé (D-III-06)', () => {
    const desky = tablePart('III-9', 'Desky');
    expect(desky.presentation.veilLamp).toBe(true);
    const tasks = desky.config.tasks;
    expect(tasks.map((t) => t.mode)).toEqual(['fill', 'fill', 'identify', 'identify']);
    const rune = (k: number) => tasks[k].circuit.nodes[0].rune;
    expect(new Set([rune(0), rune(1)])).toEqual(new Set(['xnor', 'imp']));
    for (let k = 1; k < tasks.length; k++) {
      if (tasks[k].mode === 'identify' && tasks[k - 1].mode === 'fill') expect(rune(k)).not.toBe(rune(k - 1));
    }
    expect(desky.presentation.task).toContain('pod závojem');
    expect(fromRunes(desky.config).mistakes).toBe(0);
  });

  it('III-7 jde dál: deska pod závojem se skládá runou po runě a nápovědy tomu odpovídají', () => {
    const deska = tablePart('III-7', 'Deska');
    expect(deska.presentation.veilLamp).toBe(true);
    // Nápovědy skládají výsledek z run, žádná neradí dívat se na lampu.
    deska.hints.slice(0, 2).forEach((h) => expect(h).not.toMatch(/lamp/i));
    expect(deska.hints[1]).toContain('první runy');
    const configs = [deska.config];
    forSeeds((s) => configs.push(genIII7Fill(seeded(s))));
    for (const cfg of configs) {
      expect(fromRunes(cfg).mistakes).toBe(0);
      for (const task of cfg.tasks) {
        const want = tableOf(task);
        // Ukázka kroku vysvětlí každý řádek runou po runě a skončí stavem lampy.
        want.forEach((v, r) => expect(tableStep(task.circuit, r)).toMatch(v ? /Lampa svítí\.$/ : /Lampa mlčí\.$/));
      }
    }
    // Po III-5 už hráč lampu pod závojem zná: úvod brány o ní mluví jako o samozřejmosti, ne o novince.
    expect(deska.echo.intro.join(' ')).not.toMatch(/poprvé|nově/);
  });
});

describe('B6: Desku znám jen u zkoumání v III-2 až III-4', () => {
  it('příznak mají přesně tři části a za každou následuje deska zákona', () => {
    const flagged: string[] = [];
    for (const act of ACTS) {
      for (const l of act.levels) {
        const parts = partsOf(l);
        parts.forEach((p, k) => {
          if (!p.presentation.knownBoard) return;
          flagged.push(p.id);
          expect(p.kind).toBe('gate');
          if (p.kind === 'gate') expect(p.config.tasks.every((t) => t.mode === 'explore')).toBe(true);
          expect(parts[k + 1]?.kind).toBe('table');
        });
      }
    }
    expect(flagged).toEqual(['III-2', 'III-3', 'III-4']);
    // Důsledek v III-9 je nová runa: zkoumání nejde přeskočit (D-III-16, H-III-25).
    partsOf(level('III-9')).forEach((p) => expect(p.presentation.knownBoard).toBeUndefined());
  });
});

describe('B7: velká brána III-15 losuje vždy Rozcestí z Prapečeti', () => {
  it('Rozcestí ze tří Zlomených pout a šesti točitých kamenů, za dvěma Obraceči', () => {
    const variants = new Set<string>();
    forSeeds((s) => {
      const [task, ...rest] = genIII15Nand(seeded(s)).tasks;
      expect(rest).toHaveLength(0);
      variants.add(JSON.stringify(task));
      expect(task.target).toEqual(runeTable('or'));
      expect(task.circuit.nodes.every((g) => g.rune === 'nand' && !!g.free)).toBe(true);
      expect(Object.keys(solutions(task)[0].wires)).toHaveLength(6);
      // Každé řešení je zrcadlo: poslední runa bere dvě runy se stejným světlem na obou vstupech.
      for (const sol of solutions(task)) {
        const out = task.circuit.nodes.find((g) => g.id === task.circuit.output)!;
        const ins = sourcesOf(out, sol.wires);
        expect(new Set(ins).size).toBe(2);
        for (const id of ins) {
          const [a, b] = sourcesOf(task.circuit.nodes.find((g) => g.id === id)!, sol.wires);
          expect(a).toBe(b);
        }
      }
    });
    // Losuje se jen pořadí zdrojů na kamenech: zkouška navíc pak není stejné klikání.
    expect(variants.size).toBe(2);
    expect(level('III-15').echo.solved.join(' ')).toContain('umíš je zrcadlit');
    expect(gatePart('III-15', 'Prapečeť').config.tasks[0]).toEqual(nandOnly('or'));
  });
});
