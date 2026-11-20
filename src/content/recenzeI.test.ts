/**
 * Opravy patra I podle recenze (RECENZE.md, kap. 2): zpětná vazba zápisu, ukázka kroku
 * u skupin čísel a tichého kroku, hlášky dvojznaku, kvízy a texty. Generátory a hlášky se
 * zkoušejí přes mnoho semínek, ne na jednom losu.
 */
import { describe, expect, it } from 'vitest';
import { flipBit, hamming, isBitSet } from '../core/bits';
import { hintBit, initAltar, par as altarPar, strictDeadEnd, toggle as toggleAltar, type AltarConfig, type AltarState } from '../core/puzzles/altar';
import {
  initInscription,
  mirrored,
  mirroredNibbles,
  readSlip,
  swappedGlyphs,
  toggle as toggleCrystal,
  writeSlip,
  type InscriptionConfig,
  type InscriptionEvent,
} from '../core/puzzles/inscription';
import { allStep } from '../game/altarWords';
import { demandLabel, readSlipLine, writeSlipLine } from '../game/inscriptionWords';
import { ACT_I } from './act1';
import { genI12, genI13, genI14, genI15Glyphs, genI15Octave, genI7 } from './generators';
import { KODEX } from './kodex';
import { basicRooms, partsOf } from './levels';
import { qCombosOf, qGrayMoves, qRead, qTrailing, qWrite } from './quizzes';
import { int, seeded, shuffled } from './random';
import type { AltarLevel, InscriptionLevel, PuzzleLevel } from './types';

const SEEDS = 200;
const rooms: PuzzleLevel[] = ACT_I.levels.flatMap(partsOf);
const room = (id: string, title?: string): PuzzleLevel => rooms.find((l) => l.id === id && (!title || l.title === title))!;
const altar = (id: string, title?: string) => (room(id, title) as AltarLevel).config;

/** Rodově zatížené oslovení a „klikni“ na dotykovém displeji. */
const FORBIDDEN = /\b(prošel|zvládl|sám|udělal|Klikni|klikni|kliknout)\b/;

/** Generátory komnat se zápisem: každý los se zkouší zvlášť. */
const WRITE_GENERATORS: [string, (rng: ReturnType<typeof seeded>) => InscriptionConfig][] = [
  ['I-7', genI7],
  ['I-12', genI12],
  ['I-13', genI13],
  ['I-14', genI14],
  ['I-15 oktáva', genI15Octave],
  ['I-15 glyfy', genI15Glyphs],
];

/** Úlohy zápisu ze všech losů: [zadání, hodnota]. */
function writeTasks(): [InscriptionConfig, number][] {
  const out: [InscriptionConfig, number][] = [];
  for (const [, gen] of WRITE_GENERATORS) {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const cfg = gen(seeded(seed));
      cfg.tasks.forEach((t, k) => {
        if (t.dir === 'write') out.push([{ ...cfg, tasks: [cfg.tasks[k]] }, t.value]);
      });
    }
  }
  return out;
}

const slipsOf = (events: InscriptionEvent[]) => events.filter((e) => e.type === 'slip');

describe('D-I-02: zápis v Nápisu hlásí chyby sám', () => {
  const tasks = writeTasks();

  it('zrcadlový zápis, prohozené glyfy i zrcadlo po čtveřicích dostanou jméno', () => {
    let named = 0;
    for (const [cfg, v] of tasks) {
      const pair = cfg.radix === 16 && cfg.bits === 8;
      const swap = swappedGlyphs(v);
      const nibbles = mirroredNibbles(v);
      const mirror = mirrored(v, cfg.bits);
      if (pair && swap !== v) expect(writeSlip(cfg, swap, v)).toEqual({ kind: 'swap' });
      if (pair && nibbles !== v && nibbles !== swap) expect(writeSlip(cfg, nibbles, v)).toEqual({ kind: 'nibbles' });
      if (mirror !== v && !(pair && (mirror === swap || mirror === nibbles))) {
        expect(writeSlip(cfg, mirror, v)).toEqual({ kind: 'mirror' });
        named++;
      }
    }
    expect(named).toBeGreaterThan(SEEDS);
  });

  it('jediný krystal vedle pozná u každé úlohy a každého krystalu', () => {
    for (const [cfg, v] of tasks) {
      for (let i = 0; i < cfg.bits; i++) {
        const mask = flipBit(v, i);
        if (mask === 0) continue;
        expect(writeSlip(cfg, mask, v)).toEqual({ kind: 'one', weight: 2 ** i });
      }
    }
  });

  it('tma, správný zápis a souměrný nápis chybu nehlásí', () => {
    const four: InscriptionConfig = { bits: 4, tasks: [] };
    expect(writeSlip(four, 0, 0b1011)).toBeNull();
    expect(writeSlip(four, 0b1011, 0b1011)).toBeNull();
    expect(writeSlip(four, mirrored(0b0110, 4), 0b0110)).toBeNull();
    expect(writeSlip(four, 0b0111, 0b1010)).toBeNull();
  });

  it('cesta k zadání v libovolném pořadí krystalů nevyvolá žádnou chybu', () => {
    let k = 0;
    for (const [cfg, v] of tasks) {
      const order = shuffled(
        seeded(++k),
        Array.from({ length: cfg.bits }, (_, i) => i).filter((i) => isBitSet(v, i)),
      );
      let st = initInscription();
      for (const bit of order) {
        const r = toggleCrystal(cfg, st, bit);
        expect(slipsOf(r.events)).toEqual([]);
        st = r.state;
      }
      expect(st.complete).toBe(true);
    }
  });

  it('první zbytečný dotek je překlep, každý další se hlásí (rozzáří Nápovědu)', () => {
    const cfg: InscriptionConfig = { bits: 4, tasks: [{ dir: 'write', value: 11 }] };
    let st = initInscription();
    const touch = (bit: number) => {
      const r = toggleCrystal(cfg, st, bit);
      st = r.state;
      return slipsOf(r.events);
    };
    expect(touch(2)).toEqual([]); // 0100: krystal navíc, překlep
    expect(touch(2)).toEqual([]); // zpátky ve tmě: dotek k zadání
    expect(touch(2)).toEqual([{ type: 'slip', mask: 0b0100, target: 11, slip: null }]);
    expect(touch(3)).toEqual([]); // 1100: osmička k zadání patří
  });

  it('naslepo klikající hráč dostane hlášení za každý zbytečný dotek kromě prvního', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const rng = seeded(seed);
      const cfg = genI7(rng);
      const task = cfg.tasks[0];
      const one: InscriptionConfig = { ...cfg, tasks: [task] };
      let st = initInscription();
      let away = 0;
      let reported = 0;
      for (let n = 0; n < 200 && !st.complete; n++) {
        const bit = int(rng, 0, 3);
        if (isBitSet(st.mask ^ task.value, bit) === false) away++;
        const r = toggleCrystal(one, st, bit);
        reported += slipsOf(r.events).length;
        st = r.state;
      }
      expect(reported).toBe(Math.max(0, away - 1));
    }
  });

  it('hlášky zápisu jsou krátké, bez oslovení v rodě a jediný krystal neprozradí', () => {
    for (const [cfg, v] of tasks) {
      const masks = [mirrored(v, cfg.bits), swappedGlyphs(v), mirroredNibbles(v), ...Array.from({ length: cfg.bits }, (_, i) => flipBit(v, i))];
      for (const mask of masks) {
        const slip = writeSlip(cfg, mask, v);
        if (!slip) continue;
        const line = writeSlipLine(cfg, slip, mask, v);
        expect(line).not.toMatch(FORBIDDEN);
        expect(line.length).toBeLessThan(130);
        if (slip.kind === 'one') expect(line).not.toMatch(/váhou/);
        if (slip.kind === 'mirror') expect(line).toMatch(/^Zapisuješ zrcadlově/);
        if (slip.kind === 'one' && cfg.radix !== 16) expect(line).toContain(`váží ${mask}, ne ${v}`);
        if (slip.kind === 'one' && cfg.radix === 16 && cfg.bits === 8) {
          expect(line).toContain(slip.weight >= 16 ? 'levém glyfu' : 'pravém glyfu');
        }
      }
    }
  });
});

describe('D-I-13: dvojznak pozná zrcadlo po čtveřicích', () => {
  const pair: InscriptionConfig = { bits: 8, radix: 16, tasks: [] };

  it('B6 čtené po čtveřicích zrcadlově je D6, ne chyba bez jména', () => {
    expect(readSlip(pair, 0xd6, 0xb6)).toEqual({ kind: 'nibbles' });
    expect(readSlipLine(pair, { kind: 'nibbles' }, 0xd6, 0xb6)).toMatch(/čtveřici čteš zrcadlově/);
  });

  it('u 3C a E7 hláška nezamlčí ani jednu možnou příčinu', () => {
    for (const v of [0x3c, 0xe7]) {
      const guess = swappedGlyphs(v);
      const slip = readSlip(pair, guess, v)!;
      const line = readSlipLine(pair, slip, guess, v);
      expect(line).toMatch(/levý kotouč/);
      expect(line).toMatch(/v každé čtveřici/);
    }
    // Čistě prohozené glyfy (B6 → 6B) zůstávají prohozenými glyfy.
    expect(readSlipLine(pair, { kind: 'swap' }, 0x6b, 0xb6)).toBe('Glyfy jsou prohozené. Levá čtveřice patří na levý kotouč.');
  });

  it('jediný krystal vedle se řekne glyfem a vahou uvnitř čtveřice', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const v = genI14(seeded(seed)).tasks[0].value;
      for (let i = 0; i < 8; i++) {
        const guess = flipBit(v, i);
        const slip = readSlip(pair, guess, v);
        if (slip?.kind !== 'one') continue;
        const line = readSlipLine(pair, slip, guess, v);
        expect(line).toContain(i >= 4 ? 'levém glyfu' : 'pravém glyfu');
        expect(line).toContain(`váhou ${2 ** (i % 4)}.`);
      }
    }
  });
});

describe('D-I-01: ukázka kroku v Sudém a lichém mluví o zvýrazněném krystalu', () => {
  const cfg = altar('I-9');
  const groups = cfg.goal.kind === 'class' ? cfg.goal.targets : [];
  const state = (mask: number, step: number): AltarState => ({ ...initAltar(cfg), mask, step });
  const near = (m: number, step: number) => Math.min(...groups[step].values.map((v) => hamming(v, m)));

  it('na začátku „Liché číslo“ zvýrazní pravý krystal, ne osmičku', () => {
    expect(hintBit(cfg, state(0b0000, 0))).toBe(0);
  });

  it('u „dělitelné čtyřmi“ s rozsvícenou jedničkou ji zhasne, osmičku nerozsvítí', () => {
    expect(hintBit(cfg, state(0b0001, 3))).toBe(0);
  });

  it('každý zvýrazněný krystal vede blíž k právě žádané skupině', () => {
    groups.forEach((g, step) => {
      for (let m = 0; m < 16; m++) {
        if (g.values.includes(m)) continue;
        const bit = hintBit(cfg, state(m, step))!;
        expect(near(flipBit(m, bit), step)).toBe(near(m, step) - 1);
      }
    });
  });

  it('kdo jde jen podle ukázky, projde oltář v ideálním počtu doteků', () => {
    let st = initAltar(cfg);
    let n = 0;
    while (!st.complete && n++ < 40) st = toggleAltar(cfg, st, hintBit(cfg, st)!).state;
    expect(st.complete).toBe(true);
    expect(st.moves).toBe(altarPar(cfg));
  });
});

describe('D-I-06: ze slepé uličky tichého kroku ukázka neslibuje cestu', () => {
  const strict: [string, AltarConfig][] = [
    ['I-11', altar('I-11')],
    ['I-15', altar('I-15', 'Tichý krok')],
  ];

  for (const [name, cfg] of strict) {
    it(`${name}: ukázka buď vede k dokončení, nebo cestu vědomě přeruší`, () => {
      const total = 2 ** cfg.bits;
      let deadEnds = 0;
      for (let seed = 1; seed <= SEEDS; seed++) {
        const rng = seeded(seed);
        let st = initAltar(cfg);
        // Náhodná cesta bez opakování, dokud nejde dál.
        for (let n = 0; n < total; n++) {
          const dead = strictDeadEnd(cfg, st);
          const bit = hintBit(cfg, st)!;
          const text = allStep(cfg, st, bit);
          const r = toggleAltar(cfg, st, bit);
          if (dead) {
            deadEnds++;
            expect(text).toMatch(/nevede/);
            expect(r.events.some((e) => e.type === 'reset')).toBe(true);
          } else {
            expect(text).toMatch(/bez opakování/);
            expect(r.events.some((e) => e.type === 'reset')).toBe(false);
            expect(r.state.complete || !strictDeadEnd(cfg, r.state)).toBe(true);
          }
          const free = Array.from({ length: cfg.bits }, (_, i) => i).filter((i) => !st.found.includes(flipBit(st.mask, i)));
          if (!free.length) break;
          st = toggleAltar(cfg, st, free[int(rng, 0, free.length - 1)]).state;
          if (st.complete) break;
        }
      }
      expect(deadEnds).toBeGreaterThan(0);
    });
  }

  it('I-3: když jsou všichni sousedé na desce, text to přizná', () => {
    const cfg = altar('I-3');
    const st: AltarState = { ...initAltar(cfg), mask: 0b000, found: [0b000, 0b001, 0b011, 0b010, 0b110, 0b100, 0b101], moves: 6 };
    const bit = hintBit(cfg, st)!;
    expect(st.found).toContain(flipBit(st.mask, bit));
    expect(allStep(cfg, st, bit)).toMatch(/^Všichni sousedé už na desce jsou/);
    const fresh = initAltar(cfg);
    expect(allStep(cfg, fresh, hintBit(cfg, fresh)!)).toMatch(/ještě nezná\.$/);
  });
});

describe('D-I-03, D-I-17, K-I-14: kvízy patra I', () => {
  it('vysvětlení u 2ⁿ⁻¹ a 2ⁿ⁺¹ vede ke správnému počtu', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const q = qCombosOf(seeded(seed));
      const n = Number(/řada (\d+) krystalů/.exec(q.question)![1]);
      const reason = (value: number) => q.why![q.options.indexOf(String(value))];
      const less = reason(2 ** (n - 1));
      // „Jeden krystal má 2 kombinace a každý z dalších k krystalů je zdvojí“: 2 · 2^k = 2^n.
      const k = Number(/dalších (\d+) krystalů/.exec(less)![1]);
      expect(2 * 2 ** k).toBe(2 ** n);
      expect(reason(2 ** (n + 1))).toMatch(/První krystal dá rovnou 2 kombinace/);
      expect(q.why!.join(' ')).not.toMatch(/Zdvojuj \d+×/);
    }
  });

  it('otázka o tichém kroku neoslovuje v rodě', () => {
    for (let seed = 1; seed <= 40; seed++) expect(qGrayMoves(seeded(seed)).question).not.toMatch(FORBIDDEN);
  });

  it('„Vpravo je jen jeden stín“, ne „jsou jen 1 stín“', () => {
    let single = 0;
    for (let seed = 1; seed <= SEEDS; seed++) {
      const q = qTrailing(seeded(seed));
      const text = q.why!.join(' ');
      expect(text).not.toMatch(/jsou jen 1 /);
      // Možnost „2“ může zabrat počet světel; vysvětlení o stínech vpravo pak v otázce není.
      if (q.options[q.correct] === '1' && text.includes('Vpravo')) {
        single++;
        expect(text).toContain('Vpravo je jen jeden stín.');
      }
    }
    expect(single).toBeGreaterThan(0);
  });
});

describe('K-I-01: patro I zkouší i čtení a zápis', () => {
  const items = basicRooms(ACT_I).flatMap((l) => partsOf(l).flatMap((p) => p.quiz ?? []));

  it('základní cesta má kvíz se zápisem (I-5) i se čtením (I-6), pracovní list z nich bere', () => {
    expect(room('I-5').quiz).toContain(qWrite);
    expect(room('I-6').quiz).toContain(qRead);
    expect(items).toContain(qRead);
    expect(items).toContain(qWrite);
    expect(items.length).toBeGreaterThanOrEqual(4);
  });
});

describe('D-I-15: Kodex Hlubších síní I popisuje patro I', () => {
  const entry = KODEX.find((e) => e.id === 'predsin-hloub')!;

  it('mluví o mocninách dvojky a lichosti, ne o přičítání jedničky z Počítadla', () => {
    expect(entry.modern).not.toMatch(/Přičtení jedničky/);
    expect(entry.ancient).not.toMatch(/počítat/);
    expect(entry.modern).toMatch(/mocniny dvojky/);
    expect(entry.modern).toMatch(/Lichost/);
    expect(`${entry.ancient} ${entry.modern}`).not.toMatch(FORBIDDEN);
  });
});

describe('Repliky a texty patra I', () => {
  /** Všechny texty komnat patra (zadání, nápovědy, repliky). */
  const texts = (l: PuzzleLevel): string[] => {
    const echo = l.echo;
    return [
      l.presentation.task,
      ...('writeTask' in l.presentation && l.presentation.writeTask ? [l.presentation.writeTask] : []),
      ...l.hints,
      ...echo.intro,
      ...echo.solved,
      ...Object.values(echo).flatMap((v) => (typeof v === 'string' ? [v] : !Array.isArray(v) && v ? Object.values(v) : [])),
    ].filter((t): t is string => typeof t === 'string');
  };

  it('žádné „klikni“ ani oslovení v rodě (H-I-23, D-I-17)', () => {
    for (const l of rooms) for (const t of texts(l)) expect(t, `${l.id}: ${t}`).not.toMatch(FORBIDDEN);
  });

  it('D-I-14: brána I-7 neslibuje poslední zkoušku, když může přibýt zkouška navíc', () => {
    expect(Object.values(room('I-7').echo.step ?? {}).join(' ')).not.toMatch(/[Pp]oslední/);
  });

  it('H-I-07: Tichý krok nechválí „ani jeden navíc“ po přerušené cestě', () => {
    expect(room('I-11').echo.complete).not.toMatch(/navíc/);
  });

  it('D-I-18, D-I-19: zájmeno míří na hráčův krystal a rod sedí', () => {
    expect(room('I-1').hints[1]).toContain('rozsviť i svůj');
    expect(room('I-1').hints[1]).not.toMatch(/rozsviť ho/);
    expect(room('I-2').echo.step?.[0]).toBe('Ano. Pravý svítí, levý mlčí.');
  });

  it('K-I-16, K-I-17, K-I-19, D-I-26: číslovky a přesné formulace', () => {
    expect(room('I-5').echo.step?.[2]).toMatch(/^Osm, čtyři, dvě, jedna\./);
    expect(room('I-12').echo.solved[0]).toContain('do dvou set padesáti pěti');
    expect(room('I-14').echo.solved.join(' ')).not.toMatch(/bez chyb/);
    const groups = altar('I-9').goal;
    const hints = groups.kind === 'class' ? groups.targets.map((g) => g.hint ?? '') : [];
    expect(hints.join(' ')).toContain('Lichou váhu má jen pravý krystal.');
    expect(hints.join(' ')).toContain('jednička, dvojka nebo trojka');
  });

  it('D-I-27: „brána“ žádá jen v branách, jinde nápis', () => {
    expect(demandLabel('I-7')).toBe('Brána žádá');
    expect(demandLabel('I-15')).toBe('Brána žádá');
    for (const id of ['I-12', 'I-13', 'I-14']) {
      expect(demandLabel(id)).toBe('Nápis žádá');
      const l = room(id) as InscriptionLevel;
      expect(l.presentation.writeTask).not.toMatch(/brán/);
      expect(texts(l).join(' ')).not.toMatch(/[Bb]rána/);
    }
  });

  it('K-I-01: kvízy I-5 a I-6 mají zrcadlo jako typickou chybu s vysvětlením', () => {
    for (let seed = 1; seed <= 60; seed++) {
      expect(qWrite(seeded(seed)).why!.some((why) => /[Zz]rcadlově/.test(why))).toBe(true);
      expect(qRead(seeded(seed)).why!.some((why) => /[Zz]rcadlově/.test(why))).toBe(true);
    }
  });
});
