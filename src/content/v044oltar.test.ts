/**
 * Verze 0.4.4 (PLAN-OPRAV.md), Oltář a Nápis: Tichý krok a deska kombinací (A1), glyfy po
 * čtveřicích a desítkový zápis (A2), ukázka kroku v Počítadle (A4, II-1), zbytečné doteky v I-10
 * (B4), součet mizí v I-8 a I-9 (B5) a generátory proti textům (B7). Generátory se zkoušejí přes
 * mnoho semínek, hlášky a ukázky kroku na konkrétních případech.
 */
import { describe, expect, it } from 'vitest';
import { gray, isBitSet } from '../core/bits';
import {
  currentTarget,
  hintBit,
  initAltar,
  par as altarPar,
  toggle as toggleAltar,
  toggleOutcome,
  type AltarConfig,
  type AltarEvent,
  type AltarState,
} from '../core/puzzles/altar';
import {
  hintBit as inscriptionHint,
  initInscription,
  mirrored,
  readSlip,
  toggle as toggleCrystal,
  writeSlip,
  type InscriptionConfig,
} from '../core/puzzles/inscription';
import { foundLine, resetLine, sumShown } from '../game/altarWords';
import { readSlipLine } from '../game/inscriptionWords';
import { counterStep, glyphStep } from '../game/stepWords';
import { ACT_I } from './act1';
import { ACT_II } from './act2';
import { genI13, genI14, genI15Glyphs, genI6, genI7 } from './generators';
import { partsOf } from './levels';
import { int, seeded } from './random';
import type { AltarLevel, InscriptionLevel, PuzzleLevel } from './types';

const SEEDS = 200;
const rooms: PuzzleLevel[] = [...ACT_I.levels, ...ACT_II.levels].flatMap(partsOf);
const room = (id: string, title?: string): PuzzleLevel => rooms.find((l) => l.id === id && (!title || l.title === title))!;
const altar = (id: string, title?: string) => (room(id, title) as AltarLevel).config;
const inscription = (id: string, title?: string) => (room(id, title) as InscriptionLevel).config;

/** Rodově zatížené oslovení, „klikni“ a zájmeno bez předmětu v pokynu. */
const FORBIDDEN = /\b(prošel|zvládl|sám|udělal|Klikni|klikni|kliknout)\b|rozsviť ho|zhasni ho/;

/** Odehraje oltář jen podle ukázky kroku; vrátí stavy po každém doteku. */
function followHints(cfg: AltarConfig, from: AltarState = initAltar(cfg)): { states: AltarState[]; events: AltarEvent[][] } {
  const states: AltarState[] = [];
  const events: AltarEvent[][] = [];
  let st = from;
  for (let n = 0; n < 300 && !st.complete; n++) {
    const r = toggleAltar(cfg, st, hintBit(cfg, st)!);
    st = r.state;
    states.push(st);
    events.push(r.events);
  }
  return { states, events };
}

const play = (cfg: AltarConfig, bits: number[]): AltarState => bits.reduce((st, b) => toggleAltar(cfg, st, b).state, initAltar(cfg));

describe('A1: Tichý krok a deska kombinací jdou zrcadlovým Grayovým kódem', () => {
  const walks: [string, AltarConfig][] = [
    ['I-3', altar('I-3')],
    ['I-11', altar('I-11')],
    ['I-15', altar('I-15', 'Tichý krok')],
  ];

  for (const [name, cfg] of walks) {
    it(`${name}: ukázka kroku od začátku vydá 0…0, 0…01, 0…11, 0…10 … (zrcadlový Grayův kód)`, () => {
      const { states } = followHints(cfg);
      expect(states.map((s) => s.mask)).toEqual(Array.from({ length: 2 ** cfg.bits - 1 }, (_, k) => gray(k + 1)));
      expect(states[states.length - 1].complete).toBe(true);
      expect(states[states.length - 1].moves).toBe(altarPar(cfg));
    });
  }

  it('I-11: kdo začne zrcadlem (0000 → 0001 → 0011 → 0010), dostane od ukázky další krok zrcadla', () => {
    const cfg = altar('I-11');
    const st = play(cfg, [0, 1, 0]);
    expect(st.mask).toBe(0b0010);
    expect(hintBit(cfg, st)).toBe(2);
  });

  it('první polovina cesty z ukázky má levý krystal ve stínu, druhá ve světle', () => {
    const cfg = altar('I-11');
    const masks = followHints(cfg).states.map((s) => s.mask);
    expect(masks.slice(0, 7).every((m) => !isBitSet(m, 3))).toBe(true);
    expect(masks.slice(7).every((m) => isBitSet(m, 3))).toBe(true);
  });

  it('„Teď přijde zrcadlo.“ jen v přísném režimu a jen po polovině se stínem vlevo', () => {
    const cfg = altar('I-11');
    const line = room('I-11').echo.found?.[8];
    expect(line).toBe('Polovina cesty.');
    // Cesta z ukázky: osm kombinací se stínem vlevo.
    const half = followHints(cfg).states[6];
    expect(half.found).toHaveLength(8);
    expect(foundLine(cfg, half.found, line)).toBe('Polovina cesty. Teď přijde zrcadlo.');
    // Cesta, která levý krystal rozsvítila hned: zrcadlo nepřijde.
    const other = play(cfg, [3, 2, 3, 1, 3, 2, 3]);
    expect(other.found).toHaveLength(8);
    expect(other.found.some((p) => isBitSet(p, 3))).toBe(true);
    expect(foundLine(cfg, other.found, line)).toBe('Polovina cesty.');
    // Mimo polovinu replika zůstane, jak je, a bez repliky nic.
    expect(foundLine(cfg, followHints(cfg).states[13].found, room('I-11').echo.found?.[15])).toBe('Poslední krok.');
    expect(foundLine(cfg, play(cfg, [0]).found)).toBeNull();
    // Kolik kombinací? (bez přísného režimu) zrcadlo neohlašuje.
    const i3 = altar('I-3');
    expect(foundLine(i3, play(i3, [0, 1, 0]).found, 'Polovina desky.')).toBe('Polovina desky.');
    // Velká brána: replika k polovině není, zrcadlo se řekne samo.
    const i15 = altar('I-15', 'Tichý krok');
    expect(foundLine(i15, play(i15, [0, 1, 0]).found)).toBe('Teď přijde zrcadlo.');
  });

  it('zadání a nápovědy mluví o pravidle „žádná kombinace dvakrát“, ne o jediné změně', () => {
    const texts = (l: PuzzleLevel) => [l.presentation.task, l.hints[0], l.hints[1]];
    for (const l of [room('I-3'), room('I-11'), room('I-15', 'Tichý krok')]) {
      for (const t of texts(l)) {
        expect(t, `${l.id}: ${t}`).not.toMatch(/jedin[áý] změn|jediný krystal|jen jeden krystal|změnil jediný/);
        expect(t).not.toMatch(FORBIDDEN);
      }
    }
    expect(room('I-11').presentation.task).toMatch(/žádná neopakovala/);
    expect(room('I-15', 'Tichý krok').presentation.task).toMatch(/žádná neopakovala/);
    // I-3: nejdřív dva pravé krystaly, pak levý a pozpátku.
    expect(room('I-3').hints[0]).toMatch(/levý krystal ve stínu/);
    expect(room('I-3').hints[1]).toMatch(/rozsviť levý/);
    expect(room('I-3').hints[1]).toMatch(/pozpátku/);
  });

  it('po nalezené kombinaci dává ukázka další krok (path), po splněném cíli začne znovu (goal)', () => {
    const all = altar('I-3');
    expect(toggleOutcome(toggleAltar(all, initAltar(all), 0).events)).toBe('path');
    expect(toggleOutcome(toggleAltar(all, play(all, [0]), 0).events)).toBeNull();
    const strict = altar('I-11');
    expect(toggleOutcome(toggleAltar(strict, play(strict, [0]), 0).events)).toBe('broken');
    const value = altar('I-4');
    expect(toggleOutcome(toggleAltar(value, play(value, [2]), 0).events)).toBe('goal');
    expect(toggleOutcome(toggleAltar(value, initAltar(value), 1).events)).toBeNull();
  });

  it('přerušená cesta: replika řekne, že Zpět vrátí cestu před přerušením (ze slepé uličky ne)', () => {
    for (const l of [room('I-11'), room('I-15', 'Tichý krok')]) {
      expect(resetLine(l.echo.reset, false)).toMatch(/Zpět vrátí cestu před přerušením\.$/);
      expect(resetLine(l.echo.reset, true)).not.toMatch(/Zpět/);
    }
  });
});

/** Úlohy s glyfy ze všech losů i z pevných podob komnat: [zadání s jedinou úlohou, směr, hodnota]. */
function glyphTasks(): InscriptionConfig[] {
  const out: InscriptionConfig[] = [];
  const add = (cfg: InscriptionConfig) => cfg.tasks.forEach((t) => out.push({ ...cfg, tasks: [t] }));
  [inscription('I-13'), inscription('I-14'), inscription('I-15', 'Glyfy')].forEach(add);
  for (const gen of [genI13, genI14, genI15Glyphs]) for (let seed = 1; seed <= SEEDS; seed++) add(gen(seeded(seed)));
  return out;
}

/** Ukázky kroku u jedné úlohy s glyfy: čtení jedna věta, zápis věta ke každému doteku podle ukázky. */
function glyphSteps(cfg: InscriptionConfig): string[] {
  const task = cfg.tasks[0];
  if (task.dir === 'read') return [glyphStep(task.value, cfg.bits)];
  const out: string[] = [];
  let st = initInscription();
  while (!st.complete) {
    const bit = inscriptionHint(cfg, st)!;
    out.push(glyphStep(task.value, cfg.bits, { bit, needed: !isBitSet(st.mask, bit) }));
    st = toggleCrystal(cfg, st, bit).state;
  }
  return out;
}

describe('A2: ukázka kroku u glyfů jde po čtveřicích', () => {
  it('příklady z plánu: „Žádáno A5. Levý glyf A je 10 = 8 + 2 …“, u jedné čtveřice „Žádáno C (12) …“', () => {
    expect(glyphStep(0xa5, 8, { bit: 7, needed: true })).toBe('Žádáno A5. Levý glyf A je 10 = 8 + 2. Váha 8 do glyfu patří: zvýrazněný krystal rozsviť.');
    expect(glyphStep(0xa5, 8, { bit: 2, needed: true })).toBe('Žádáno A5. Pravý glyf 5 je 4 + 1. Váha 4 do glyfu patří: zvýrazněný krystal rozsviť.');
    expect(glyphStep(0xa5, 8, { bit: 6, needed: false })).toMatch(/Váha 4 do glyfu nepatří: zvýrazněný krystal zhasni\.$/);
    expect(glyphStep(0x0b, 8, { bit: 5, needed: false })).toMatch(/^Žádáno 0B\. Levý glyf 0 je prázdný\./);
    expect(glyphStep(0b1100, 4, { bit: 3, needed: true })).toBe('Žádáno C (12). Glyf C je 8 + 4. Váha 8 do glyfu patří: zvýrazněný krystal rozsviť.');
    expect(glyphStep(0b1000, 4, { bit: 3, needed: true })).toMatch(/^Žádáno 8\. Glyf 8 je jen váha 8\./);
  });

  it('čtení jmenuje svítící strany a glyf nechá najít na kotouči, součet neřekne', () => {
    expect(glyphStep(0b1010, 4)).toBe('Svítí krystaly s vahami 8 a 2, na glyfu tedy horní a dolní strana. Takový glyf nastav na kotouči.');
    expect(glyphStep(0b0100, 4)).toBe('Svítí krystal s váhou 4, na glyfu tedy pravá strana. Takový glyf nastav na kotouči.');
    expect(glyphStep(0b1111, 4)).toMatch(/všechny čtyři strany/);
    expect(glyphStep(0x3c, 8)).toBe(
      'Každá čtveřice je jeden glyf. Vlevo svítí dolní a levá strana (2 a 1), vpravo svítí horní a pravá strana (8 a 4). Takové glyfy nastav na kotoučích.',
    );
    expect(glyphStep(0xf0, 8)).toMatch(/vpravo nesvítí nic\./);
    for (const v of [0b1010, 0b0111, 0x3c, 0xb6]) {
      const text = glyphStep(v, v > 15 ? 8 : 4);
      expect(text).not.toMatch(/\b(10|7|60|182)\b/);
      // Glyf (A, 7, 3C…) najde hráč sám.
      expect(text).not.toMatch(/(^|\s)([A-F]|[0-9A-F]{2})[\s.,]/);
    }
  });

  it('ukázka u glyfů nikdy nezmíní váhu větší než 8 ani desítkovou hodnotu dvojznaku', () => {
    let writes = 0;
    const numbers = (text: string, re: RegExp) => [...text.matchAll(re)].flatMap((m) => m.slice(1).join(' ').match(/\d+/g) ?? []).map(Number);
    for (const cfg of glyphTasks()) {
      const task = cfg.tasks[0];
      for (const text of glyphSteps(cfg)) {
        if (task.dir === 'read') {
          // Čtení nemá šestnáctkové znaky: každé číslo je váha uvnitř čtveřice.
          for (const n of text.match(/\d+/g) ?? []) expect(Number(n), text).toBeLessThanOrEqual(8);
        } else {
          writes++;
          // Váhy a sčítanci uvnitř glyfu nejvýš 8, hodnota glyfu nejvýš 15 (F).
          for (const n of numbers(text, /(?:[Vv]áha|váhou|vahami) (\d+)/g)) expect(n, text).toBeLessThanOrEqual(8);
          for (const n of numbers(text, /((?:\d+ \+ )+\d+)/g)) expect(n, text).toBeLessThanOrEqual(8);
          for (const n of numbers(text, /(?:je (\d+) =|\((\d+)\))/g)) expect(n, text).toBeLessThanOrEqual(15);
          if (task.value > 15) expect(text, text).not.toMatch(new RegExp(`\\b${task.value}\\b`));
        }
        expect(text).not.toMatch(FORBIDDEN);
        expect(text.length).toBeLessThan(170);
      }
    }
    expect(writes).toBeGreaterThan(SEEDS);
  });

  it('zápis podle ukázky: každá věta mluví o glyfu, ve kterém leží zvýrazněný krystal', () => {
    for (const cfg of glyphTasks()) {
      const task = cfg.tasks[0];
      if (task.dir !== 'write' || cfg.bits !== 8) continue;
      let st = initInscription();
      while (!st.complete) {
        const bit = inscriptionHint(cfg, st)!;
        const glyph = bit >= 4 ? task.value >>> 4 : task.value & 15;
        const text = glyphStep(task.value, 8, { bit, needed: !isBitSet(st.mask, bit) });
        expect(text).toContain(`${bit >= 4 ? 'Levý' : 'Pravý'} glyf ${glyph.toString(16).toUpperCase()} je`);
        expect(text).toContain(`Váha ${2 ** (bit % 4)} do glyfu`);
        st = toggleCrystal(cfg, st, bit).state;
      }
    }
  });
});

describe('A2: desítkový zápis na glyfových kotoučích má vlastní hlášku', () => {
  const pair: InscriptionConfig = { bits: 8, radix: 16, tasks: [] };
  const one: InscriptionConfig = { bits: 4, radix: 16, tasks: [] };

  it('3C = 60: kotouče 6 a 0 jsou desítkový zápis', () => {
    expect(readSlip(pair, 0x60, 0x3c)).toEqual({ kind: 'decimal' });
    expect(readSlipLine(pair, { kind: 'decimal' }, 0x60, 0x3c)).toBe('Tohle je desítkový zápis. Každá čtveřice je jeden glyf.');
  });

  it('co se na kotouče nevejde, pozná podle posledních číslic (psaní na klávesnici)', () => {
    expect(readSlip(pair, 0x65, 0xa5)).toEqual({ kind: 'decimal' });
    // Řeč glyfů: „1“, „1“ na klávesnici nechá na jediném kotouči 1.
    expect(readSlip(one, 1, 0b1011)).toEqual({ kind: 'decimal' });
    // Kotouče na nule jsou jako nenastavené: 10, 100 ani 200 desítkovou chybu nehlásí.
    expect(readSlip(one, 0, 0b1010)?.kind).not.toBe('decimal');
    expect(readSlip(pair, 0, 100)?.kind).not.toBe('decimal');
    expect(readSlip(pair, 0, 200)?.kind).not.toBe('decimal');
  });

  it('u každého dvojznaku od 0A do FF pozná desítkový zápis, pokud ho nepřebije jiná typická chyba', () => {
    const other: string[] = [];
    for (let v = 10; v < 256; v++) {
      const guess = parseInt(String(v).slice(-2), 16);
      if (guess === 0) continue;
      const slip = readSlip(pair, guess, v);
      if (slip?.kind !== 'decimal') other.push(`${v.toString(16)}:${slip?.kind}`);
    }
    // 35 = 53 je zároveň prohození glyfů, CC a CD dají 04 a 05, tedy počet světel.
    expect(other).toEqual(['35:swap', 'cc:count', 'cd:count']);
    // U CC a CD věta pokryje obojí: počet světel i desítkový zápis.
    expect(readSlipLine(pair, { kind: 'count' }, 0x04, 0xcc)).toBe(
      'Tolik světel svítí a tak končí i desítkový zápis. Každé světlo ale váží jinak a každá čtveřice je jeden glyf.',
    );
  });

  it('Řeč glyfů: C a D zapsané desítkově dostanou větu o vahách i o glyfu, jeden kotouč nemluví o čtveřicích (kontrola 0.4.4)', () => {
    const one: InscriptionConfig = { bits: 4, radix: 16, tasks: [] };
    for (const [guess, value] of [
      [2, 0b1100],
      [3, 0b1101],
    ]) {
      // Kotouč ukazuje počet světel i poslední číslici desítkového zápisu: readSlip vrátí count.
      const slip = readSlip(one, guess, value)!;
      expect(slip).toEqual({ kind: 'count' });
      expect(readSlipLine(one, slip, guess, value)).toBe(
        'Tolik světel svítí a tak končí i desítkový zápis. Každé světlo ale váží jinak a kotouč chce jediný glyf.',
      );
    }
    // Obyčejný počet světel bez desítkové shody zůstává.
    expect(readSlipLine(one, { kind: 'count' }, 3, 0b1011)).toBe('Tolik světel svítí, to sedí. Každé ale váží jinak.');
    // Jeden kotouč: žádná druhá čtveřice není.
    for (const [guess, value] of [
      [1, 0b1011],
      [4, 0b1110],
      [5, 0b1111],
    ]) {
      const slip = readSlip(one, guess, value)!;
      expect(slip).toEqual({ kind: 'decimal' });
      const line = readSlipLine(one, slip, guess, value);
      expect(line).toBe('Vypadá to na desítkový zápis. Kotouč chce jediný glyf: čtyři strany jako čtyři krystaly.');
      expect(line).not.toMatch(/čtveřice/);
    }
  });

  it('desítkové kotouče a zápis krystaly desítkovou chybu nehlásí', () => {
    expect(readSlip({ bits: 8, tasks: [] }, 60, 0x3c)).toBeNull();
    for (let v = 10; v < 256; v++) expect(writeSlip(pair, parseInt(String(v).slice(-2), 16), v)?.kind).not.toBe('decimal');
    expect(readSlip(pair, 0x09, 0x09)).toBeNull();
  });
});

describe('A4: ukázka kroku v Počítadle (II-1) řekne důvod', () => {
  const cfg = altar('II-1');

  it('nápověda 1 se ptá na plný krystal, nemluví o „nejmenší změně“', () => {
    expect(room('II-1').hints[0]).toBe('Začni vpravo. Co se stane s krystalem, který už svítí, když do něj přidáš další světlo?');
  });

  it('cestou podle ukázky: svítící krystaly předají světlo doleva, zhasnutý ho přijme', () => {
    let st = initAltar(cfg);
    const said: string[][] = [[]];
    while (!st.complete) {
      const bit = hintBit(cfg, st)!;
      const on = isBitSet(st.mask, bit);
      const text = counterStep(currentTarget(cfg, st)!, bit, st.mask);
      said[said.length - 1].push(text);
      expect(text).toMatch(on ? /zvýrazněný krystal zhasni|Zvýrazněný krystal zhasni/ : /zvýrazněný krystal rozsviť\.$/);
      expect(text).not.toMatch(FORBIDDEN);
      const r = toggleAltar(cfg, st, bit);
      if (r.events.some((e) => e.type === 'step')) said.push([]);
      st = r.state;
    }
    expect(st.moves).toBe(altarPar(cfg));
    // 3 → 4: dvě předání a pak zhasnutý krystal, který světlo přijme.
    expect(said[3]).toHaveLength(3);
    expect(said[3][0]).toMatch(/^Zvýrazněný krystal už svítí a další světlo se do něj nevejde\./);
    expect(said[3][1]).toBe(said[3][0]);
    expect(said[3][2]).toMatch(/^Krystaly vpravo světlo předaly dál\./);
    // 0 → 1: bez předání.
    expect(said[0]).toEqual(['Zvýrazněný krystal je zhasnutý, nové světlo se do něj vejde: zvýrazněný krystal rozsviť.']);
  });

  it('krystal, který k počtu nepatří, se řekne bez předání', () => {
    // Hráč u počtu 2 rozsvítil i osmičku: 1010.
    const st: AltarState = { ...initAltar(cfg), mask: 0b1010, step: 1 };
    const bit = hintBit(cfg, st)!;
    expect(bit).toBe(3);
    expect(counterStep(2, bit, st.mask)).toBe('Počet 2 tenhle krystal nepotřebuje: zvýrazněný krystal zhasni.');
    expect(counterStep(5, 2, 0b0001)).toBe('Počet 5 potřebuje i tenhle krystal: zvýrazněný krystal rozsviť.');
  });

  it('mimo průběh počtu ukázka nemluví o předání sousedovi (nález kontroly 0.4.4)', () => {
    // Cíl 4: hráč z 0011 rozsvítil čtyřku a zhasl dvojku (0101). Soused jedničky má zůstat zhasnutý.
    // Cíl 2 u desky 0111: soused jedničky už svítí.
    for (const [target, mask] of [
      [4, 0b0101],
      [2, 0b0111],
    ]) {
      const st: AltarState = { ...initAltar(cfg), mask, step: target - 1 };
      const bit = hintBit(cfg, st)!;
      expect(bit).toBe(0);
      expect(counterStep(target, bit, mask)).toBe(`Počet ${target} tenhle krystal nepotřebuje: zvýrazněný krystal zhasni.`);
    }
    // Z předchozího počtu (0011 → 4) předání platí.
    expect(counterStep(4, 0, 0b0011)).toMatch(/světlo jde k sousedovi vlevo\.$/);
    expect(counterStep(4, 1, 0b0010)).toMatch(/světlo jde k sousedovi vlevo\.$/);
    // Ze všech desek: kde ukázka mluví o předání, soused vlevo opravdu převezme (svítí a předá dál, nebo je zhasnutý a přijme).
    for (let target = 1; target <= 8; target++)
      for (let mask = 0; mask < 16; mask++) {
        const st: AltarState = { ...initAltar(cfg), mask, step: target - 1 };
        const bit = hintBit(cfg, st);
        if (bit === null || !/sousedovi vlevo/.test(counterStep(target, bit, mask))) continue;
        const lowest = target & -target;
        const left = 2 ** (bit + 1);
        expect((mask & left) !== 0, `cíl ${target}, deska ${mask.toString(2)}`).toBe(left < lowest);
      }
  });
});

describe('B4: I-10 bez součtu hlásí zbytečné doteky', () => {
  const cfg = altar('I-10');
  const slipsOf = (events: AltarEvent[]) => events.filter((e) => e.type === 'slip');

  it('jen I-10 má příznak; I-4 a I-5 se nemění', () => {
    expect(cfg.slips).toBe(true);
    expect(altar('I-4').slips).toBeFalsy();
    expect(altar('I-5').slips).toBeFalsy();
    const i4 = altar('I-4');
    let st = initAltar(i4);
    for (const bit of [0, 0, 0, 1, 1, 1]) {
      const r = toggleAltar(i4, st, bit);
      expect(slipsOf(r.events)).toEqual([]);
      st = r.state;
    }
  });

  it('první zbytečný dotek je překlep, každý další se hlásí; s přijatou váhou se počítá znovu', () => {
    let st = initAltar(cfg);
    const touch = (bit: number) => {
      const r = toggleAltar(cfg, st, bit);
      st = r.state;
      return slipsOf(r.events);
    };
    expect(touch(7)).toEqual([]); // 128 k 31 nepatří: překlep
    expect(touch(7)).toEqual([]); // zpátky: dotek k cíli
    expect(touch(6)).toEqual([{ type: 'slip', mask: 0b01000000, target: 31 }]);
    expect(touch(6)).toEqual([]);
    for (const bit of [0, 1, 2, 3]) expect(touch(bit)).toEqual([]);
    expect(st.strays).toBe(2);
    touch(4); // 31 přijato
    expect(st.step).toBe(1);
    expect(st.strays).toBe(0);
    expect(touch(7)).toEqual([]); // nový cíl 32: první zbytečný dotek je zase překlep
  });

  it('kdo jde podle ukázky, žádné hlášení nedostane', () => {
    for (const events of followHints(cfg).events) expect(slipsOf(events)).toEqual([]);
  });

  it('naslepo klikající hráč dostane hlášení za každý zbytečný dotek kromě prvního u každého cíle', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const rng = seeded(seed);
      // Jen první cíl (31), ať náhodné klikání skončí.
      const one: AltarConfig = { ...cfg, goal: { kind: 'value', targets: [31] } };
      let st = initAltar(one);
      let away = 0;
      let reported = 0;
      for (let n = 0; n < 400 && !st.complete; n++) {
        const bit = int(rng, 0, 7);
        if (isBitSet(st.mask ^ 31, bit) === false) away++;
        const r = toggleAltar(one, st, bit);
        reported += slipsOf(r.events).length;
        st = r.state;
      }
      expect(reported).toBe(Math.max(0, away - 1));
    }
  });
});

describe('B5: součet mizí v Skrytých vahách a v Sudém a lichém chybí', () => {
  it('I-8: součet svítí v prvních dvou cílech, ve třetím už není na obrazovce ani v hlášení', () => {
    const pres = room('I-8').presentation;
    expect(pres.showSum).toBe(false);
    expect(pres.fade?.sum).toBe(2);
    expect([0, 1, 2, 3, 4, 5].map((step) => sumShown(pres, step))).toEqual([true, true, false, false, false, false]);
    expect(room('I-8').echo.step?.[1]).toBe('Teď i součet zmizí. Zákon zůstal.');
  });

  it('I-9: druh čísla bez součtu', () => {
    const pres = room('I-9').presentation;
    expect(pres.showSum).toBe(false);
    expect([0, 1, 2, 3, 4].some((step) => sumShown(pres, step))).toBe(false);
  });

  it('opora, která mizí, není zároveň zapnutá natrvalo; oltáře s živým součtem ho mají dál', () => {
    for (const l of rooms) if (l.presentation.fade?.sum) expect(l.presentation.showSum, l.id).toBe(false);
    expect(sumShown(room('I-4').presentation, 3)).toBe(true);
    expect(sumShown(room('I-10').presentation, 0)).toBe(false);
  });
});

describe('B7: generátory a pevné úlohy bez souměrných nápisů', () => {
  const symmetric = (v: number) => mirrored(v, 4) === v;

  it('I-6: žádný nápis není souměrný, první zůstává lehký se dvěma světly', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const tasks = genI6(seeded(seed)).tasks;
      expect(tasks).toHaveLength(5);
      tasks.forEach((t) => expect(symmetric(t.value), `seed ${seed}: ${t.value}`).toBe(false));
      expect(tasks[0].value).toBeLessThan(8);
      expect(tasks.filter((t) => t.value >= 8).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('I-7: žádné losované čtení ani zápis není souměrné, brána končí patnáctkou', () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const tasks = genI7(seeded(seed)).tasks;
      tasks.slice(0, 4).forEach((t) => expect(symmetric(t.value), `seed ${seed}: ${t.value}`).toBe(false));
      expect(tasks[4]).toEqual({ dir: 'write', value: 15 });
    }
  });

  it('pevné podoby I-6 a I-7 nemají souměrný nápis', () => {
    inscription('I-6').tasks.forEach((t) => expect(symmetric(t.value)).toBe(false));
    inscription('I-7').tasks.slice(0, 4).forEach((t) => expect(symmetric(t.value)).toBe(false));
  });

  it('I-9: čtvrtá skupina je dělitelná čtyřmi, ale ne osmi; osmička jen v poslední', () => {
    const cfg = altar('I-9');
    const groups = cfg.goal.kind === 'class' ? cfg.goal.targets : [];
    expect(groups).toHaveLength(5);
    expect(groups[3].values).toEqual([4, 12]);
    expect(groups[4].values).toEqual([8]);
    expect(groups[3].hint).toMatch(/krystal s váhou 4/);
    expect(groups[3].values.some((v) => groups[4].values.includes(v))).toBe(false);
  });

  it('I-9: ideál podle ukázky nepřeskočí skupinu „dělitelné osmi“ a sedí s pravidly skupin', () => {
    const cfg = altar('I-9');
    const groups = cfg.goal.kind === 'class' ? cfg.goal.targets : [];
    const { states, events } = followHints(cfg);
    const last = states[states.length - 1];
    expect(last.complete).toBe(true);
    expect(last.moves).toBe(altarPar(cfg));
    // Každá skupina přijme číslo jiným dotekem: žádný dotek nesplní dvě skupiny naráz.
    for (const ev of events) expect(ev.filter((e) => e.type === 'step').length).toBeLessThanOrEqual(1);
    last.found.forEach((v, k) => expect(groups[k].values).toContain(v));
    expect(last.found[4]).toBe(8);
  });

  it('I-9: replika po čtvrté skupině vysvětlí, proč to není dělitelné osmi', () => {
    expect(room('I-9').echo.step?.[3]).toMatch(/osmi dělitelné není/);
  });
});

describe('Nové texty Oltáře a Nápisu', () => {
  it('bez oslovení v rodě, bez „klikni“ a bez zájmen bez předmětu', () => {
    const texts = [
      ...['I-3', 'I-8', 'I-9', 'I-11', 'II-1'].flatMap((id) => {
        const l = room(id);
        return [l.presentation.task, ...l.hints, ...Object.values(l.echo.step ?? {}), l.echo.reset ?? ''];
      }),
      ...[room('I-15', 'Tichý krok')].flatMap((l) => [l.presentation.task, ...l.hints, l.echo.reset ?? '']),
      readSlipLine({ bits: 8, radix: 16, tasks: [] }, { kind: 'decimal' }, 0x60, 0x3c),
      counterStep(4, 0, 0b0011),
      counterStep(4, 2, 0b0000),
      counterStep(1, 0, 0b0000),
      counterStep(4, 0, 0b0101),
    ];
    for (const t of texts) expect(t, t).not.toMatch(FORBIDDEN);
  });
});
