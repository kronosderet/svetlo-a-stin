/**
 * Opravy nálezů recenze patra II (Síň Počtářů). Generátory se zkoušejí přes mnoho semínek,
 * ne jen na jednom losu: replika Echa i podmínka komnaty musí sedět na každé vylosované zadání.
 */
import { describe, expect, it } from 'vitest';
import { popcount } from '../core/bits';
import { answer, confirm, firstWrong, initCascade, toggle, type CascadeConfig, type CascadeState } from '../core/puzzles/cascade';
import { applyOp, bestOp, distance, initTide, pull, type TideConfig, type TideOp, type TideTask } from '../core/puzzles/tide';
import { cascadeStep, cascadeWhy, cellFacts } from '../game/cascadeWords';
import { ACT_II } from './act2';
import { genII11, genII13Add, genII13Negate, genII14, genII15Fate, genII8 } from './generators';
import { KODEX } from './kodex';
import { getLevel, instantiate, partsOf } from './levels';
import { qComplementSum, qCopies, qFlips, qSumBits } from './quizzes';
import { seeded } from './random';
import type { LevelDef, PuzzleLevel, QuizQuestion } from './types';

const SEEDS = 300;
const forSeeds = (fn: (seed: number) => void) => {
  for (let seed = 1; seed <= SEEDS; seed++) fn(seed);
};

/** Část komnaty podle názvu (u smíšené komnaty), jinak komnata sama. */
const part = (level: LevelDef, title?: string): PuzzleLevel => {
  const parts = partsOf(level);
  return title ? parts.find((p) => p.title === title)! : parts[0];
};
const room = (id: string): LevelDef => getLevel(id)!;

/** Všechny texty objektu (repliky, nápovědy, zadání, Kodex) jako jeden řetězec. */
const texts = (o: unknown): string[] => {
  if (typeof o === 'string') return [o];
  if (Array.isArray(o)) return o.flatMap(texts);
  if (o && typeof o === 'object') return Object.values(o).flatMap(texts);
  return [];
};
const quizSamples = (q: (rng: () => number) => QuizQuestion, n = 400): QuizQuestion[] => Array.from({ length: n }, (_, s) => q(seeded(s + 1)));
const quizText = (q: QuizQuestion): string => [q.question, q.hint, q.explain, ...q.options, ...(q.why ?? [])].join(' | ');

describe('II-13 Doplněk: replika „1101…“ sedí na první úlohu (D-II-26)', () => {
  it('první úloha druhé zkoušky je vždy −3, další dvě se losují', () => {
    const others = new Set<number>();
    forSeeds((s) => {
      const tasks = genII13Negate(seeded(s)).tasks;
      expect(tasks[0]).toEqual({ start: 3, target: 13, show: '−3' });
      tasks.slice(1).forEach((t) => {
        expect(t.start).not.toBe(3);
        expect(t.start).toBeGreaterThanOrEqual(1);
        expect(t.start).toBeLessThanOrEqual(7);
        others.add(t.start!);
      });
      expect(new Set(tasks.map((t) => t.start)).size).toBe(3);
    });
    // Losování zůstalo: další úlohy berou všechna čísla do 7 kromě trojky.
    expect([...others].sort()).toEqual([1, 2, 4, 5, 6, 7]);
  });

  it('replika po první úloze jmenuje právě její zápis (i ve vylosované komnatě)', () => {
    const level = room('II-13');
    for (let s = 1; s <= 50; s++) {
      const negate = part(instantiate(level, seeded(s)), 'Záporná čísla');
      if (negate.kind !== 'tide') throw new Error('čekám Příliv');
      const first = negate.config.tasks[0];
      expect(negate.echo.step?.[0]).toContain(first.target.toString(2));
    }
  });
});

/** Nejkratší cesta bez triku: bez přetočení a bez shození světla přes levý okraj. */
function cleanDistance(bits: number, ops: TideOp[], from: number, to: number): number {
  const dist = new Map([[from, 0]]);
  const queue = [from];
  for (let q = 0; q < queue.length; q++) {
    const v = queue[q];
    for (const op of ops) {
      const r = applyOp(op, v, bits);
      if (r.spill === 'left' || r.spill === 'wrap' || dist.has(r.value)) continue;
      dist.set(r.value, dist.get(v)! + 1);
      queue.push(r.value);
    }
  }
  return dist.get(to) ?? Infinity;
}

/** Ověří Váhy Osudu: limit jde splnit bez triku a nápověda žádný trik neukáže. */
function checkFate(cfg: TideConfig) {
  expect(cfg.strict).toBe(true);
  // Celá zkouška podle nápovědy: ani přetočení, ani ztráta přes levý okraj, misky se nevrátí.
  let st = initTide(cfg);
  let guard = 0;
  while (!st.complete && guard++ < 100) {
    const r = pull(cfg, st, bestOp(cfg, st)!);
    r.events.forEach((e) => {
      if (e.type === 'pull') expect(['left', 'wrap']).not.toContain(e.spill);
      expect(e.type).not.toBe('reset');
    });
    st = r.state;
  }
  expect(st.complete).toBe(true);
  cfg.tasks.forEach((t: TideTask) => {
    expect(cleanDistance(cfg.bits, cfg.ops, t.start!, t.target)).toBe(distance(cfg, t.start!, t.target));
  });
}

describe('Váhy Osudu bez shození světla přes levý okraj (D-II-30)', () => {
  it('II-14: každá vylosovaná zkouška jde v limitu bez triku', () => {
    forSeeds((s) => checkFate(genII14(seeded(s))));
  });

  it('II-15: Váhy Osudu ve velké bráně stejně', () => {
    forSeeds((s) => checkFate(genII15Fate(seeded(s))));
  });

  it('ručně vybrané zkoušky (výchozí podoba komnat) taky', () => {
    const fate = [part(room('II-14')), part(room('II-15'), 'Váhy Osudu')];
    fate.forEach((p) => {
      if (p.kind !== 'tide') throw new Error('čekám Příliv');
      checkFate(p.config);
    });
  });

  it('zkoušky dál chtějí půlení i ubírání a ×2 na samých světlech by tu bylo poznat', () => {
    // Ztráta přes okraj je skutečně možná (jinak by test nic nehlídal): 58 → ×2 → 52.
    expect(applyOp('shl', 58, 6)).toEqual({ value: 52, spill: 'left' });
    forSeeds((s) => {
      const cfg = genII14(seeded(s));
      const used = new Set<TideOp>();
      let st = initTide(cfg);
      while (!st.complete) {
        const op = bestOp(cfg, st)!;
        used.add(op);
        st = pull(cfg, st, op).state;
      }
      expect(used.has('shr')).toBe(true);
      expect(used.has('dec')).toBe(true);
    });
  });
});

/** Zahraje Kaskádu podle ukázky kroku a vrátí všechny ukázky s tím, co měly vysvětlit. */
function playByStepHints(cfg: CascadeConfig): { text: string; row: string; inflow: number }[] {
  const out: { text: string; row: string; inflow: number }[] = [];
  let st: CascadeState = initCascade(cfg);
  let guard = 0;
  while (!st.complete && guard++ < 400) {
    const text = cascadeStep(cfg, st);
    if (text === null) {
      st = confirm(cfg, st).state;
      continue;
    }
    const cell = firstWrong(cfg, st)!;
    const facts = cellFacts(cfg, st, cell)!;
    out.push({ text, row: cell.row, inflow: facts.inflow });
    const r = toggle(cfg, st, cell);
    expect(r.events[0]?.type).toBe('toggle');
    st = r.state;
  }
  expect(st.complete).toBe(true);
  return out;
}

describe('II-12 Tři řady: ukázka kroku u čtyř a pěti světel (K-II-02, K-II-10)', () => {
  const ev = (inflow: number) => ({ type: 'wrong' as const, cell: { row: 'result' as const, column: 1 }, expected: inflow % 2 === 1, inflow });
  const three: CascadeConfig = { width: 6, bits: 4, carries: 'manual', conserve: true, farCarries: true, tasks: [{ op: 'add', operands: [15, 15, 15] }] };

  it('čtyři a pět světel pošlou jedno světlo o dvě místa, ne do sousedního sloupce', () => {
    const st = initCascade(three);
    expect(cascadeWhy(three, st, ev(4), true)).toBe(
      'Ve druhém sloupci zprava se slévají čtyři světla, to je 100. Dole zůstane stín, do sousedního sloupce nic a jedno světlo putuje o dvě místa.',
    );
    expect(cascadeWhy(three, st, ev(5), true)).toBe(
      'Ve druhém sloupci zprava se slévá pět světel, to je 101. Dole zůstane světlo, do sousedního sloupce nic a jedno světlo putuje o dvě místa.',
    );
    expect(cascadeWhy(three, st, ev(3), true)).toBe(
      'Ve druhém sloupci zprava se slévají tři světla, to je 11. Dole zůstane světlo a jedno světlo přeteče do sloupce vlevo.',
    );
  });

  it('kdo hraje podle ukázky kroku, dostane u každého sloupce správný směr přenosu', () => {
    const level = room('II-12');
    const variants = [part(level), ...Array.from({ length: 120 }, (_, s) => part(instantiate(level, seeded(s + 1))))];
    let far = 0;
    variants.forEach((p) => {
      if (p.kind !== 'cascade') throw new Error('čekám Kaskádu');
      playByStepHints(p.config).forEach(({ text, row, inflow }) => {
        expect(text).not.toMatch(/slila pět|slévají pět/);
        if (row !== 'result' || inflow < 2) return;
        if (inflow >= 4) {
          far++;
          expect(text).toContain('putuje o dvě místa');
          expect(text).not.toContain('do sloupce vlevo');
        } else expect(text).toContain('přeteče do sloupce vlevo');
      });
    });
    expect(far).toBeGreaterThan(0);
  });

  it('hlášky o pěti světlech mají shodu se slovesem', () => {
    const st = initCascade(three);
    const carry = { type: 'wrong' as const, cell: { row: 'carry' as const, column: 2 }, expected: false, inflow: 5 };
    expect(cascadeWhy(three, st, carry)).toBe('Ve sloupci vpravo se slilo pět světel, to je 101. Do sousedního sloupce nepřetéká nic, světlo jde o dvě místa dál.');
    const farCell = { type: 'wrong' as const, cell: { row: 'far' as const, column: 3 }, expected: true, inflow: 5 };
    expect(cascadeWhy(three, st, farCell)).toContain('O dvě místa vpravo se slilo pět světel, to je 101.');
  });
});

describe('II-10: kopie bez „posunuté o 0 míst“ (D-II-21, K-II-22, H-II-21)', () => {
  const mul: CascadeConfig = { width: 6, bits: 3, carries: 'manual', pickCopies: true, tasks: [{ op: 'mul', operands: [5, 2] }] };
  const copy = (column: number, expected: boolean) => ({ type: 'wrong' as const, cell: { row: 'copy' as const, column }, expected, inflow: 0 });

  it('kopie ×1 je neposunutá, ostatní mají počet míst i násobek', () => {
    const st = initCascade(mul);
    expect(cascadeWhy(mul, st, copy(0, false))).toBe('Druhý činitel má na místě s váhou 1 nulu. Neposunutá kopie (×1) se nesčítá.');
    expect(cascadeWhy(mul, st, copy(1, true))).toBe('Druhý činitel má na místě s váhou 2 jedničku. Kopie posunutá o 1 místo (×2) do součtu patří.');
    expect(cascadeWhy(mul, st, copy(2, false))).toBe('Druhý činitel má na místě s váhou 4 nulu. Kopie posunutá o 2 místa (×4) se nesčítá.');
  });

  it('kvíz o kopiích mluví o činitelích a výčet spojuje „a“ se správným tvarem', () => {
    quizSamples(qCopies).forEach((q) => {
      expect(q.question).toContain('činitel');
      expect(quizText(q)).not.toContain('čísl');
      expect(q.explain).not.toMatch(/\d, \d+ míst/);
      expect(q.explain).toMatch(/posunuté o (\d+, )*\d+ a \d+ (místa|míst) \(×\d+(, ×\d+)* a ×\d+\)/);
    });
    expect(quizSamples(qCopies).some((q) => q.explain.includes('o 0 a 3 místa (×1 a ×8)'))).toBe(true);
  });

  it('zadání a nápovědy Násobení po lumenitsku říkají činitel, ne číslo', () => {
    const level = part(room('II-10'));
    expect(texts([level.presentation.task, level.hints, level.echo]).join(' ')).not.toMatch(/(prvního|druhého|druhé) čísl/);
  });
});

describe('II-13: odčítání sčítáním v rozsahu čtyřbitového doplňku (K-II-03)', () => {
  /** Horní řada kladná (nejvyšší bit 0), spodní záporná (nejvyšší bit 1), rozdíl kladný. */
  const checkTask = (cfg: CascadeConfig, operands: number[]) => {
    const [a, c] = operands;
    expect(a & 8).toBe(0);
    expect(c & 8).toBe(8);
    const b = 16 - c;
    expect(a - b).toBeGreaterThan(0);
    const ans = answer(cfg, { op: 'add', operands });
    expect(ans.result).toBe(a - b);
    expect(ans.spilled).toBe(1);
    // Aspoň dva přenosy: jeden do přepadu a aspoň jeden uvnitř nádoby.
    expect(popcount(ans.carries)).toBeGreaterThanOrEqual(2);
  };

  it('vylosované úlohy drží znaménkový bit', () => {
    const pairs = new Set<string>();
    forSeeds((s) => {
      const cfg = genII13Add(seeded(s));
      cfg.tasks.forEach((t) => {
        checkTask(cfg, t.operands);
        pairs.add(t.operands.join('+'));
      });
    });
    // Losuje se dál z celé nabídky (21 dvojic 1 ≤ b < a ≤ 7), ne z hrstky.
    expect(pairs.size).toBeGreaterThanOrEqual(18);
  });

  it('ručně vybrané úlohy taky', () => {
    const p = part(room('II-13'), 'Odčítání sčítáním');
    if (p.kind !== 'cascade') throw new Error('čekám Kaskádu');
    p.config.tasks.forEach((t) => checkTask(p.config, t.operands));
  });

  it('kvíz qComplementSum čte menšenec kladně a doplněk záporně', () => {
    quizSamples(qComplementSum).forEach((q) => {
      const m = q.question.match(/Kolik je ([01]{4}) \+ ([01]{4})/)!;
      expect(m[1][0]).toBe('0');
      expect(m[2][0]).toBe('1');
      const [a, b] = q.explain.match(/což je (\d+) − (\d+)/)!.slice(1).map(Number);
      expect(a).toBeLessThanOrEqual(7);
      expect(a - b).toBeGreaterThan(0);
    });
  });
});

describe('repliky Echa sedí na každý los (D-II-16, D-II-23, K-II-20)', () => {
  it('II-8: třetí úloha má řetěz výpůjček, o kterém replika mluví', () => {
    const chained = (cfg: CascadeConfig, k: number) => {
      const c = answer(cfg, cfg.tasks[k]).carries;
      return (c & (c << 1)) !== 0;
    };
    const p = part(room('II-8'));
    if (p.kind !== 'cascade') throw new Error('čekám Kaskádu');
    expect(p.echo.step?.[2]).toContain('několika sloupci');
    expect(chained(p.config, 2)).toBe(true);
    forSeeds((s) => {
      const cfg = genII8(seeded(s));
      expect(chained(cfg, 2)).toBe(true);
      // Ostatní úlohy zůstaly: ukázka bez výpůjčky, další s výpůjčkou.
      expect(answer(cfg, cfg.tasks[0]).carries).toBe(0);
      expect(answer(cfg, cfg.tasks[1]).carries).not.toBe(0);
      expect(answer(cfg, cfg.tasks[3]).carries).not.toBe(0);
    });
  });

  it('II-11: poslední dělení má vždy zbytek v misce', () => {
    const p = part(room('II-11'));
    if (p.kind !== 'tide') throw new Error('čekám Příliv');
    expect(p.echo.complete).toContain('Zbytek zůstal v misce');
    const last = (cfg: TideConfig) => cfg.tasks[3].start! % 16;
    expect(last(p.config)).not.toBe(0);
    forSeeds((s) => {
      const cfg = genII11(seeded(s));
      expect(last(cfg)).not.toBe(0);
      expect(cfg.tasks.filter((t, k) => t.start! % [4, 8, 2, 16][k] === 0)).toHaveLength(1);
    });
  });

  it('II-7: repliky brány nepočítají úlohy, protože po ukázce kroku přibude zkouška navíc', () => {
    partsOf(room('II-7')).forEach((p) => {
      expect(texts([p.echo.intro, p.echo.step]).join(' ')).not.toMatch(/Poslední|Ještě jed|tři součty|Tři součty/);
    });
  });
});

describe('losované kvízy patra II mají tvary podle počtu (D-II-04)', () => {
  it('qFlips: „2 jedničky zhasnou“, „5 jedniček zhasne“', () => {
    const seen = new Set<string>();
    quizSamples(qFlips).forEach((q) => {
      const t = quizText(q);
      expect(t).not.toMatch(/\b[234] jedniček|\b[5-9] jedničky|jedničky zhasne\b|jedniček zhasnou/);
      (t.match(/(Zhasnou|Zhasne) \d [^\s,]+/g) ?? []).forEach((m) => seen.add(m));
    });
    expect(seen).toContain('Zhasnou 2 jedničky');
    expect(seen).toContain('Zhasne 5 jedniček');
  });

  it('qSumBits: „do 4 krystalů“', () => {
    quizSamples(qSumBits).forEach((q) => expect(quizText(q)).not.toMatch(/do \d krystaly/));
  });
});

describe('slovník a texty patra II (H-II-07, H-II-22 a drobné texty)', () => {
  const kodexII = KODEX.filter((e) => ACT_II.levels.some((l) => l.kodex === e.id));
  /** Texty záznamu Kodexu bez jeho id (id „odliv“ zůstává kvůli uloženému postupu). */
  const kodexText = (e: (typeof KODEX)[number]) => texts({ ...e, id: undefined }).join(' ');

  it('„odliv“ znamená jen posun vpravo: odčítání se jmenuje jinak', () => {
    for (const id of ['II-8', 'II-15']) {
      const level = room(id);
      expect(texts([level.title, level.echo, partsOf(level).map((p) => [p.title, p.presentation, p.hints, p.echo])]).join(' ')).not.toMatch(/odliv/i);
    }
    expect(room('II-8').title).toBe('Výpůjčka');
    expect(KODEX.find((e) => e.id === 'odliv')!.ancientName).toBe('Výpůjčka');
    // Příliv a odliv (posun) slovo drží.
    expect(room('II-6').title).toBe('Příliv a odliv');
    expect(kodexII.filter((e) => /odliv/i.test(kodexText(e))).map((e) => e.id)).toEqual(['priliv']);
  });

  it('Váhy Osudu neopakují shrnutí velké brány a nejsou „nejtěžší“ před bránou', () => {
    const fate = room('II-14');
    const gate = room('II-15');
    expect(fate.echo.intro.join(' ')).not.toContain('Nejtěžší');
    fate.echo.solved.forEach((line) => expect(gate.echo.solved).not.toContain(line));
    expect(fate.echo.solved.join(' ')).not.toMatch(/sčítat, odčítat, násobit/);
  });

  it('bez nalezených chyb v textu', () => {
    const bad = [
      /(?<!sloupec teče )\bsám\b/, // k hráči rodově neutrálně (D-II-14); sloupec „teče sám za sebe“ smí
      /přeskočil/, // přenos sloupci prošel (D-II-08)
      /Brána chce vidět/, // II-3 není brána (D-II-08)
      /jiskr/, // staré slovo pro krystal (D-II-10)
      /zbyde/, // spisovně „zbude“ (K-II-21)
      /z Čtení/, // „ze Čtení nápisu“ (D-II-20)
      /ještě jedna\b/, // „přidej ještě jedničku“ (D-II-20)
      /= 18 − 16 = 2/, // nepravdivý řetěz rovností (D-II-12)
      /odečte se spolu s ní/, // zájmeno bez předmětu (K-II-24)
      /Poslední číslice zůstane dole/, // pořadí číslic zprava (D-II-24)
      /Proto má součet o krystal víc/, // jen „může mít“ (K-II-07)
      /÷/, // dělení v Kodexu a textech dvojtečkou nebo slovy (H-II-21); kolo a páky mají vlastní znak
    ];
    const levels = texts(ACT_II.levels.map((l) => [l.title, l.echo, partsOf(l).map((p) => [p.title, p.presentation, p.hints, p.echo, p.quiz])]));
    const prose = [...levels, ...kodexII.map(kodexText)].join(' | ');
    bad.forEach((re) => expect(prose).not.toMatch(re));
  });

  it('kvíz o bajtu říká, že je nádoba plná (D-II-11), a nemíchá soustavy (D-II-10)', () => {
    const quiz = part(room('II-5')).quiz!.filter((q) => typeof q !== 'function') as QuizQuestion[];
    expect(quiz[0].question).toContain('1100₂ + 0110₂ = 18');
    expect(quiz[1].question).toContain('svítí všechna světla: 255');
  });

  it('nápověda Tří řad čte číslice zprava (D-II-24)', () => {
    expect(part(room('II-12')).hints[1]).toContain('Číslice čti zprava: první zůstane dole, druhá jde do sousedního sloupce, třetí o dvě místa');
  });
});
