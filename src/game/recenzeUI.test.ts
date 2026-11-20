import { describe, expect, it } from 'vitest';
import { ACTS, BASIC_PATH, GATE, LEVELS, advancedRooms, basicRooms, gateOf, instantiate, partsOf } from '../content/levels';
import { seeded } from '../content/random';
import type { LevelDef, PuzzleLevel } from '../content/types';
import { flipBit } from '../core/bits';
import { firstWrong, initCascade, type CascadeCell, type CascadeState } from '../core/puzzles/cascade';
import { firstWrongRow, initTable } from '../core/puzzles/table';
import { initInscription } from '../core/puzzles/inscription';
import { hint as gateHint, initGate, type GateState } from '../core/puzzles/gate';
import { hint as machineHint, initMachine, type MachineState } from '../core/puzzles/machine';
import { mergeSpeech, sayComplete, type LevelCtx } from '../ui/screens/level/context';
import { nextBasicRoom, type Student } from './classOverview';
import type { ProgressData } from './progress.svelte.ts';
import { settledHint } from './settledHint';
import { unlockedIn } from './unlock';

const doneOf = (ids: string[]) => {
  const set = new Set(ids);
  return (id: string) => set.has(id);
};
const range = (act: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, k) => `${act}-${from + k}`);
const basicBefore = (k: number) => ACTS.slice(0, k).flatMap((a) => basicRooms(a).map((l) => l.id));

describe('otevírání komnat bez zkratky do brány (H-I-01, D-III-01)', () => {
  it('brána každého patra se otevře až po komnatě 6, ne po prvních třech', () => {
    ACTS.forEach((act, k) => {
      const n = act.numeral;
      const early = doneOf([...basicBefore(k), ...range(n, 0, 3)]);
      expect(unlockedIn(gateOf(act), early)).toBe(false);
      expect(unlockedIn(`${n}-4`, early)).toBe(true);
      expect(unlockedIn(`${n}-5`, early)).toBe(false);
      expect(unlockedIn(gateOf(act), doneOf([...basicBefore(k), ...range(n, 0, 5)]))).toBe(false);
      expect(unlockedIn(gateOf(act), doneOf([...basicBefore(k), ...range(n, 0, 6)]))).toBe(true);
    });
  });

  it('kdo bránu prošel dřív zkratkou, o nic nepřijde', () => {
    ACTS.forEach((act, k) => {
      const n = act.numeral;
      const old = doneOf([...basicBefore(k), ...range(n, 0, 3), gateOf(act)]);
      expect(unlockedIn(gateOf(act), old)).toBe(true);
      expect(unlockedIn(`${n}-4`, old)).toBe(true);
      const deep = advancedRooms(act);
      if (deep.length) expect(unlockedIn(deep[0].id, old)).toBe(true);
      const below = ACTS[k + 1];
      if (below) expect(unlockedIn(below.levels[0].id, old)).toBe(true);
    });
  });

  it('komnata, kterou převod rozvržení přidal neodehranou, nezamkne ty za sebou', () => {
    const done = doneOf([...basicBefore(1), 'II-0', 'II-1', ...range('II', 3, GATE)]);
    expect(unlockedIn('II-2', done)).toBe(true);
    for (const id of range('II', 3, GATE)) expect(unlockedIn(id, done)).toBe(true);
    expect(unlockedIn('III-0', done)).toBe(true);
    expect(unlockedIn('II-8', done)).toBe(true);
  });

  it('hotová komnata je vždy otevřená a základní cesta jde po jedné (náhodné postupy)', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const rng = seeded(seed);
      const share = rng();
      const done = doneOf(LEVELS.filter(() => rng() < share).map((l) => l.id));
      LEVELS.forEach((l) => {
        if (done(l.id)) expect(unlockedIn(l.id, done)).toBe(true);
      });
      BASIC_PATH.forEach((l, i) => {
        if (!done(l.id)) expect(unlockedIn(l.id, done)).toBe(i === 0 || done(BASIC_PATH[i - 1].id));
      });
    }
  });
});

describe('přehled třídy: další komnata na základní cestě (K-I-06)', () => {
  const student = (levels: string[]): Student => {
    const data: ProgressData = {
      version: 1,
      layout: 5,
      name: 'Eva',
      levels: Object.fromEntries(levels.map((id) => [id, { seals: { solved: true, skill: true, pure: true } }])),
      stats: {},
      kodex: [],
      seen: [],
    };
    return { name: 'Eva', file: 'eva.json', data };
  };

  it('ukáže první nehotovou komnatu základu, nikdy Hlubší síň', () => {
    expect(nextBasicRoom(student([...range('I', 0, 8)]), BASIC_PATH)?.id).toBe('II-0');
    expect(nextBasicRoom(student([...range('I', 0, 3), 'I-7', 'II-0', 'II-1']), BASIC_PATH)?.id).toBe('I-4');
    expect(nextBasicRoom(student([...BASIC_PATH.map((l) => l.id), 'I-8']), BASIC_PATH)).toBeNull();
  });
});

/** Všechny hádanky komnat (i části smíšených) pro dané semínko. */
function puzzles(seed: number): PuzzleLevel[] {
  const rng = seeded(seed);
  return LEVELS.flatMap((l: LevelDef) => partsOf(instantiate(l, rng)));
}

const CASCADE_KEY = { result: 'result', carry: 'carries', far: 'far', copy: 'copies' } as const;
const flipCell = (st: CascadeState, c: CascadeCell): CascadeState => {
  const key = CASCADE_KEY[c.row];
  return { ...st, [key]: flipBit(st[key], c.column) };
};

describe('ukázka kroku na desce, která už sedí (D-II-05)', () => {
  it('Kaskáda: hotová deska řekne „stačí potvrdit“, jediná chyba ne', () => {
    for (let seed = 1; seed <= 25; seed++) {
      for (const level of puzzles(seed)) {
        if (level.kind !== 'cascade') continue;
        const cfg = level.config;
        let st = initCascade(cfg);
        for (let guard = 0; guard < 200; guard++) {
          const cell = firstWrong(cfg, st);
          if (!cell) break;
          st = flipCell(st, cell);
        }
        expect(settledHint(level, st), level.id).toBe('Všechno sedí. Stačí potvrdit.');
        expect(settledHint(level, flipCell(st, { row: 'result', column: 0 })), level.id).toBeNull();
      }
    }
  });

  it('Deska zákona: vyplněná deska řekne „stačí potvrdit“, poznávání runy nikdy', () => {
    for (let seed = 1; seed <= 25; seed++) {
      for (const level of puzzles(seed)) {
        if (level.kind !== 'table') continue;
        const cfg = level.config;
        cfg.tasks.forEach((task, step) => {
          let st = { ...initTable(), step };
          if (task.mode === 'identify') return expect(settledHint(level, st), level.id).toBeNull();
          for (let row = firstWrongRow(cfg, st); row !== null; row = firstWrongRow(cfg, st)) st = { ...st, cells: flipBit(st.cells, row) };
          expect(settledHint(level, st), level.id).toBe('Deska zákona sedí. Stačí ji potvrdit.');
          expect(settledHint(level, { ...st, cells: flipBit(st.cells, 0) }), level.id).toBeNull();
        });
      }
    }
  });

  it('Nápis: správné číslo na kotoučích řekne „stačí potvrdit“, zápis se posune sám', () => {
    for (let seed = 1; seed <= 25; seed++) {
      for (const level of puzzles(seed)) {
        if (level.kind !== 'inscription') continue;
        level.config.tasks.forEach((task, step) => {
          const st = { ...initInscription(), step, dial: task.value };
          if (task.dir === 'write') return expect(settledHint(level, st), level.id).toBeNull();
          expect(settledHint(level, st), level.id).toBe('Kotouče ukazují správné číslo. Stačí potvrdit.');
          expect(settledHint(level, { ...st, dial: task.value ^ 1 }), level.id).toBeNull();
        });
      }
    }
  });

  it('Brána: hotový obvod řekne „spusť Zkoušku“, chybějící runa ne, zkoumání nikdy', () => {
    for (let seed = 1; seed <= 10; seed++) {
      for (const level of puzzles(seed)) {
        if (level.kind !== 'gate') continue;
        const cfg = level.config;
        cfg.tasks.forEach((task, step) => {
          let st: GateState = { ...initGate(), step };
          if (task.mode === 'explore') return expect(settledHint(level, st), level.id).toBeNull();
          const missing = gateHint(cfg, st);
          if (missing) expect(settledHint(level, st), level.id).toBeNull();
          for (let h = gateHint(cfg, st), guard = 0; h && guard < 50; h = gateHint(cfg, st), guard++) {
            if ('node' in h) st = { ...st, runes: { ...st.runes, [h.node]: h.rune } };
            else if ('socket' in h) st = { ...st, wires: { ...st.wires, [h.socket]: h.source } };
          }
          expect(settledHint(level, st), level.id).toBe('Obvod je hotový. Spusť Zkoušku.');
        });
      }
    }
  });

  it('Dílna: postavený stroj řekne „spusť Zkoušku“, cíle a zkoumání nikdy', () => {
    for (let seed = 1; seed <= 3; seed++) {
      for (const level of puzzles(seed)) {
        if (level.kind !== 'machine') continue;
        const cfg = level.config;
        cfg.tasks.forEach((task, step) => {
          let st: MachineState = { ...initMachine(cfg), step };
          if (task.mode !== 'build') return expect(settledHint(level, st), level.id).toBeNull();
          for (let h = machineHint(cfg, st), guard = 0; h && guard < 80; h = machineHint(cfg, st), guard++) {
            if ('node' in h) st = { ...st, runes: { ...st.runes, [h.node]: h.rune } };
            else if ('socket' in h) st = { ...st, wires: { ...st.wires, [h.socket]: h.source } };
            else break;
          }
          expect(settledHint(level, st), level.id).toBe('Stroj je hotový. Spusť Zkoušku.');
        });
      }
    }
  });

  it('Oltář, Příliv a Maska ukázku kroku vždy mají (posunou se samy, jakmile výsledek sedí)', () => {
    for (const level of puzzles(1)) {
      if (level.kind === 'altar' || level.kind === 'tide' || level.kind === 'mask') expect(settledHint(level, {}), level.id).toBeNull();
    }
  });
});

describe('čtečka slyší Echo (H-I-02, H-II-03)', () => {
  it('replika, kterou hlášení už obsahuje, nezazní dvakrát', () => {
    const why = 'Ve sloupci se slila dvě světla.';
    expect(mergeSpeech([why, `Výsledek nepřijat. ${why}`])).toBe(`Výsledek nepřijat. ${why}`);
    expect(mergeSpeech(['Nápověda: Všechno sedí.', 'Všechno sedí.'])).toBe('Nápověda: Všechno sedí.');
  });

  it('různá hlášení z jedné chvíle zazní všechna, po pořadě a jednou', () => {
    expect(mergeSpeech(['Dvě a dvě jsou pořád čtyři.', 'Správně.', 'Správně.'])).toBe('Dvě a dvě jsou pořád čtyři. Správně.');
    expect(mergeSpeech(['', '  ', 'Část 1 z 3 splněna.'])).toBe('Část 1 z 3 splněna.');
    expect(mergeSpeech([])).toBe('');
  });
});

/** Echo bez Svelte: stejná fronta replik jako echo.svelte.ts (say nahradí, add přidá, follow podle fresh). */
function fakeEcho(lines: string[], fresh: boolean) {
  const echo = {
    lines,
    index: 0,
    fresh,
    say(next: string[]) {
      echo.lines = next;
      echo.index = 0;
    },
    add(next: string[]) {
      echo.lines = [...echo.lines, ...next];
    },
    follow(next: string[]) {
      if (echo.fresh) echo.add(next);
      else echo.say(next);
    },
  };
  return echo;
}

describe('replika posledního kroku nezmizí (H-IV-05)', () => {
  const withQuiz = puzzles(1).filter((l) => l.quiz?.length && l.echo.complete);
  const ctxOf = (level: PuzzleLevel, echo: ReturnType<typeof fakeEcho>) => {
    let read = 0;
    const ctx = { level: () => level, echo, readOn: () => (read += 1) } as unknown as LevelCtx;
    return { ctx, reads: () => read };
  };

  it('závěr se přidá za repliku kroku z téže chvíle a Echo na něj přejde samo', () => {
    expect(withQuiz.length).toBeGreaterThan(20);
    for (const level of withQuiz) {
      const echo = fakeEcho(['Světlo v prvním přenosu přidá jedničku navíc.'], true);
      const { ctx, reads } = ctxOf(level, echo);
      sayComplete(ctx);
      expect(echo.lines).toEqual(['Světlo v prvním přenosu přidá jedničku navíc.', level.echo.complete]);
      expect(echo.index).toBe(0);
      expect(reads()).toBe(1);
    }
  });

  it('bez repliky kroku závěr nahradí starou repliku jako dřív', () => {
    for (const level of withQuiz) {
      const echo = fakeEcho(['Stará nápověda.'], false);
      const { ctx, reads } = ctxOf(level, echo);
      sayComplete(ctx);
      expect(echo.lines).toEqual([level.echo.complete]);
      expect(reads()).toBe(0);
    }
  });

  it('komnata bez kvízu nechá Echo být (závěr řekne výsledek komnaty)', () => {
    const level = puzzles(1).find((l) => !l.quiz?.length)!;
    const echo = fakeEcho(['Replika kroku.'], true);
    sayComplete(ctxOf(level, echo).ctx);
    expect(echo.lines).toEqual(['Replika kroku.']);
  });
});
