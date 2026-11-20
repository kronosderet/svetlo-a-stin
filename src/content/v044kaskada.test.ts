/**
 * Verze 0.4.4, Kaskáda a Příliv (PLAN-OPRAV.md, B1, B2, A4, A6, B6, B7): odmítnutí, které pošle
 * k přenosu, chybná potvrzení nejdřív s otázkou, řetěz výpůjček, ukázka kroku ve Vahách Osudu
 * se zbylými tahy, nápovědy bez dvojkového zápisu, pravidlo bran a doplněk bez sedmičky.
 * Generátory se zkoušejí přes 200 semínek, hlášky a ukázky na konkrétních případech.
 */
import { describe, expect, it } from 'vitest';
import { isBitSet } from '../core/bits';
import {
  answer,
  confirm,
  initCascade,
  rows,
  toggle,
  type CascadeCell,
  type CascadeConfig,
  type CascadeEvent,
  type CascadeState,
} from '../core/puzzles/cascade';
import { applyOp, bestOp, distance, initTide, pathFits, pull, taskLimit, taskStart, type TideOp } from '../core/puzzles/tide';
import { cascadeRefusal, cascadeStep, cascadeWhy } from '../game/cascadeWords';
import { tideStep } from '../game/stepWords';
import { ACT_II } from './act2';
import { genII10, genII12, genII13Add, genII13Negate, genII14, genII15Fate, genII2, genII3, genII4, genII5, genII8, genII9 } from './generators';
import { KODEX } from './kodex';
import { getLevel, isGateRoom, partsOf } from './levels';
import { seeded, type Rng } from './random';
import type { CascadeLevel, PuzzleLevel, TideLevel } from './types';

const SEEDS = 200;
const forSeeds = (fn: (seed: number) => void) => {
  for (let seed = 1; seed <= SEEDS; seed++) fn(seed);
};

/** Rodově zatížené oslovení a „klikni“ na dotykovém displeji (jako v recenzeI.test.ts). */
const FORBIDDEN = /\b(prošel|zvládl|sám|udělal|Klikni|klikni|kliknout)\b/;

const part = (id: string, title?: string): PuzzleLevel => partsOf(getLevel(id)!).find((p) => !title || p.title === title)!;
const cascadeOf = (id: string, title?: string): CascadeLevel => part(id, title) as CascadeLevel;
const tideOf = (id: string, title?: string): TideLevel => part(id, title) as TideLevel;

const res = (column: number): CascadeCell => ({ row: 'result', column });
const car = (column: number): CascadeCell => ({ row: 'carry', column });
type Wrong = Extract<CascadeEvent, { type: 'wrong' }>;

/** Potvrdí výsledek a vrátí chybné potvrzení i stav po něm. */
function miss(cfg: CascadeConfig, st: CascadeState): { ev: Wrong; state: CascadeState } {
  const r = confirm(cfg, st);
  const ev = r.events[0];
  if (ev?.type !== 'wrong') throw new Error('výsledek prošel');
  return { ev, state: r.state };
}

/** Rozsvítí buňky lit a řekne, proč se buňka cell nerozsvítí (null = rozsvítila se). */
function refusal(cfg: CascadeConfig, lit: CascadeCell[], cell: CascadeCell): string | null {
  let st = initCascade(cfg);
  for (const c of lit) {
    const r = toggle(cfg, st, c);
    expect(r.events[0]?.type).toBe('toggle');
    st = r.state;
  }
  const r = toggle(cfg, st, cell);
  return r.events[0]?.type === 'refuse' ? cascadeRefusal(cfg, cfg.tasks[0], st, cell) : null;
}

/** Kaskády se zachováním světla a přenosy: generátor a pevné zadání komnaty. */
const CARRY_ROOMS: [string, string | undefined, (rng: Rng) => CascadeConfig][] = [
  ['II-3', undefined, genII3],
  ['II-4', undefined, genII4],
  ['II-5', undefined, genII5],
  ['II-10', undefined, genII10],
  ['II-12', undefined, genII12],
  ['II-13', 'Odčítání sčítáním', genII13Add],
];

/** Všechna zadání: pevné z komnaty a 200 losů. */
const configsOf = (id: string, title: string | undefined, gen: (rng: Rng) => CascadeConfig): CascadeConfig[] => [
  cascadeOf(id, title).config,
  ...Array.from({ length: SEEDS }, (_, s) => gen(seeded(s + 1))),
];

describe('B1: výsledek rozsvícený před přenosem pošle k přenosu (H-II-04, D-II-07)', () => {
  const WAIT =
    'Do třetího sloupce zprava zatím nic nepřiteklo. Světlo sem přinese přenos ze sloupce vpravo: nejdřív rozsviť krystal přenosu nad tímto sloupcem.';

  it('II-3, 3 + 1: kdo zná výsledek 0100 a rozsvítí ho napřed, dostane radu, ne „nemá z čeho svítit“', () => {
    const cfg = cascadeOf('II-3').config;
    expect(cfg.tasks[0].operands).toEqual([0b0011, 0b0001]);
    expect(refusal(cfg, [], res(2))).toBe(WAIT);
    // Krystal přenosu nad třetím sloupcem ještě nemá dvojici: řetěz vede dál doprava.
    expect(refusal(cfg, [], car(2))).toBe('Do krystalu přenosu přetéká dvojice světel ze sloupce vpravo. Ve druhém sloupci zprava je jen jedno světlo.');
    expect(refusal(cfg, [car(1)], res(2))).toBe(WAIT);
    expect(refusal(cfg, [car(1), car(2)], res(2))).toBeNull();
  });

  it('Tři řady: sloupec, do kterého teče jen přenos o dvě místa, pošle k hornímu krystalu', () => {
    const three: CascadeConfig = { width: 6, bits: 4, carries: 'manual', farCarries: true, conserve: true, tasks: [{ op: 'add', operands: [15, 15, 15] }] };
    expect(refusal(three, [], res(5))).toBe(
      'Do šestého sloupce zprava zatím nic nepřiteklo. Světlo sem přinese přenos o dvě místa: nejdřív rozsviť horní krystal přenosu nad tímto sloupcem.',
    );
  });

  it('kde přenos nepatří, zůstává stávající věta', () => {
    const cfg: CascadeConfig = { width: 3, carries: 'manual', conserve: true, tasks: [{ op: 'add', operands: [1, 0] }] };
    expect(refusal(cfg, [], res(2))).toBe('Ve třetím sloupci zprava žádné světlo není. Krystal výsledku nemá z čeho svítit.');
  });

  it('ve všech losech: výsledek napřed v prázdném sloupci s přenosem vždy dostane radu k přenosu', () => {
    let advised = 0;
    for (const [id, title, gen] of CARRY_ROOMS) {
      for (const cfg of configsOf(id, title, gen)) {
        cfg.tasks.forEach((task, k) => {
          const one = { ...cfg, tasks: [task], demo: cfg.demo === k ? 0 : undefined };
          const ans = answer(one, task);
          for (let c = cfg.width - 1; c >= 0; c--) {
            if (!isBitSet(ans.result, c)) continue;
            const text = refusal(one, [], res(c));
            if (text === null) continue;
            expect(text).not.toMatch(FORBIDDEN);
            const own = rows(task).some((r) => isBitSet(r, c));
            if (!own && (isBitSet(ans.carries, c) || isBitSet(ans.far, c))) {
              advised++;
              expect(text).toContain('nejdřív rozsviť');
              expect(text).not.toContain('nemá z čeho svítit');
            }
          }
        });
      }
    }
    expect(advised).toBeGreaterThan(0);
  });
});

describe('B1: první chyba v buňce dá otázku, druhá jmenuje krystal (D-II-06)', () => {
  const ASK = 'Ve sloupci vpravo se slila dvě světla. Do jednoho krystalu se nevejdou: kam přeteče dvojice?';
  const TELL = 'Ve sloupci vpravo se slila dvě světla a jedno přeteklo. Nad druhým sloupcem zprava chybí krystal přenosu.';

  it('II-3: chybějící přenos nejdřív otázkou, podruhé konkrétně, ukázka kroku hned konkrétně', () => {
    const cfg = cascadeOf('II-3').config;
    const st0 = initCascade(cfg);
    const first = miss(cfg, st0);
    expect(first.ev).toEqual({ type: 'wrong', cell: car(1), expected: true, inflow: 2 });
    expect(cascadeWhy(cfg, st0, first.ev)).toBe(ASK);
    expect(cascadeStep(cfg, st0)).toBe(TELL);
    // Doteky mezi potvrzeními počítadlo nesmažou: druhá chyba v téže buňce řekne krystal.
    let st = toggle(cfg, first.state, car(1)).state;
    st = toggle(cfg, st, car(1)).state;
    const second = miss(cfg, st);
    expect(second.ev).toMatchObject({ cell: car(1), again: true });
    expect(cascadeWhy(cfg, st, second.ev)).toBe(TELL);
    expect(second.state.mistakes).toBe(2);
  });

  it('po splněné úloze se počítá znovu', () => {
    const cfg = cascadeOf('II-3').config;
    let st = miss(cfg, initCascade(cfg)).state;
    const ans = answer(cfg, cfg.tasks[0]);
    st = { ...st, result: ans.result, carries: ans.carries };
    const r = confirm(cfg, st);
    expect(r.events[0].type).toBe('step');
    expect(r.state.missed).toEqual([]);
    const next = miss(cfg, r.state);
    expect(next.ev.again).toBeUndefined();
    expect(cascadeWhy(cfg, r.state, next.ev)).toMatch(/\?$/);
  });

  it('bez krystalů přenosu (Jedna a jedna): nejdřív otázka na váhu, potom krystal', () => {
    const one: CascadeConfig = { width: 2, bits: 1, carries: 'none', conserve: true, tasks: [{ op: 'add', operands: [1, 1] }] };
    const st = initCascade(one);
    const first = miss(one, st);
    expect(cascadeWhy(one, st, first.ev)).toBe('Ve sloupci vpravo se slila dvě světla. Kolik dohromady váží a který krystal váží stejně?');
    const second = miss(one, first.state);
    expect(cascadeWhy(one, first.state, second.ev)).toBe(
      'Ve sloupci vpravo se slila dvě světla. Dohromady váží 2, tolik jako krystal ve druhém sloupci zprava. Rozsviť tento krystal.',
    );
  });

  it('odčítání: chybějící výpůjčka nejdřív otázkou', () => {
    const cfg: CascadeConfig = { width: 4, carries: 'manual', conserve: true, tasks: [{ op: 'sub', operands: [0b0110, 0b0011] }] };
    const st = initCascade(cfg);
    const first = miss(cfg, st);
    expect(first.ev).toMatchObject({ cell: car(2), expected: true });
    expect(cascadeWhy(cfg, st, first.ev)).toBe('Sloupec vpravo neměl z čeho brát. Od koho si může půjčit?');
    const second = miss(cfg, first.state);
    expect(cascadeWhy(cfg, first.state, second.ev)).toBe(
      'Ve sloupci vpravo nebylo z čeho brát. Výpůjčku zapiš krystalem pod spodní řadu ve třetím sloupci zprava.',
    );
  });

  it('Tři řady: chybějící přenos o dvě místa nejdřív otázkou, podruhé krystal (kontrola 0.4.4)', () => {
    const cfg = cascadeOf('II-12').config;
    let checked = 0;
    for (const cf of configsOf('II-12', undefined, genII12)) {
      cf.tasks.forEach((task, k) => {
        const one = { ...cf, tasks: [task], demo: cf.demo === k ? 0 : undefined };
        const ans = answer(one, task);
        if (!ans.far) return;
        // Výsledek i obyčejné přenosy jsou správně, chybí jen přenosy o dvě místa.
        const st: CascadeState = { ...initCascade(one), result: ans.result, carries: ans.carries };
        const first = miss(one, st);
        if (first.ev.cell.row !== 'far') return;
        checked++;
        const ask = cascadeWhy(one, st, first.ev);
        expect(ask).toMatch(/^O dvě místa vpravo se slil[ao] (čtyři světla|pět světel), to je 10[01]\. Do jednoho krystalu se nevejdou: kam putuje čtveřice\?$/);
        expect(ask).not.toMatch(/rozsviť horní krystal/);
        const second = miss(one, first.state);
        expect(second.ev).toMatchObject({ cell: first.ev.cell, again: true });
        expect(cascadeWhy(one, first.state, second.ev)).toMatch(/rozsviť horní krystal nad/);
        // Ukázka kroku zůstala konkrétní.
        expect(cascadeStep(one, st)).toMatch(/rozsviť horní krystal nad/);
      });
    }
    expect(cfg.farCarries).toBe(true);
    expect(checked).toBeGreaterThan(0);
  });

  it('ve všech losech: kde druhá chyba jmenuje krystal, první se jen ptá', () => {
    const rooms: [string, string | undefined, (rng: Rng) => CascadeConfig][] = [...CARRY_ROOMS, ['II-2', undefined, genII2], ['II-8', undefined, genII8]];
    const CONCRETE = /chybí krystal|Výpůjčku zapiš|Rozsviť tento krystal|rozsviť horní krystal/;
    let asked = 0;
    for (const [id, title, gen] of rooms) {
      for (const cfg of configsOf(id, title, gen)) {
        cfg.tasks.forEach((task, k) => {
          const one = { ...cfg, tasks: [task], demo: cfg.demo === k ? 0 : undefined };
          const st = initCascade(one);
          const r = confirm(one, st);
          if (r.events[0].type !== 'wrong') return;
          const first = cascadeWhy(one, st, r.events[0]);
          const again = miss(one, r.state);
          const second = cascadeWhy(one, r.state, again.ev);
          expect(again.ev.again).toBe(true);
          [first, second].forEach((t) => expect(t).not.toMatch(FORBIDDEN));
          if (!CONCRETE.test(second)) return;
          asked++;
          expect(first).not.toMatch(CONCRETE);
          expect(first).toMatch(/\?$/);
          // Ukázka kroku zůstala konkrétní.
          expect(cascadeStep(one, st)).toMatch(CONCRETE);
        });
      }
    }
    expect(asked).toBeGreaterThan(0);
  });
});

describe('B2: II-8 řetěz výpůjček v hláškách, nápovědě a Kodexu (D-II-15, H-II-11, D-II-17, K-II-16)', () => {
  const minus = (a: number, b: number): CascadeConfig => ({ width: 4, carries: 'manual', conserve: true, tasks: [{ op: 'sub', operands: [a, b] }] });
  const CHAIN = 'Sloupec si nejdřív musí půjčit od souseda vlevo.';

  it('sloupec, který musí nejdřív půjčit, to odmítnutí řekne', () => {
    expect(refusal(minus(0b0110, 0b0011), [], car(1))).toBe(`Ve druhém sloupci zprava spodní řada odečte jediné světlo. Půjčit už není co. ${CHAIN}`);
    expect(refusal(minus(0b1000, 0b0001), [], car(1))).toBe(`Ve druhém sloupci zprava není co půjčit. ${CHAIN}`);
    expect(refusal(minus(0b1000, 0b0001), [car(3)], car(1))).toBe(`Ve druhém sloupci zprava není co půjčit. ${CHAIN}`);
  });

  it('bez řetězu jen důvod', () => {
    expect(refusal(minus(0b0011, 0b0010), [], car(1))).toBe('Ve druhém sloupci zprava spodní řada odečte jediné světlo. Půjčit už není co.');
  });

  it('postup z nápovědy 2 (výpůjčky zleva, od prvního volného světla doprava) projde každou úlohou', () => {
    const configs = [cascadeOf('II-8').config, ...Array.from({ length: SEEDS }, (_, s) => genII8(seeded(s + 1)))];
    let chains = 0;
    for (const cfg of configs) {
      cfg.tasks.forEach((task, k) => {
        if (cfg.demo === k) return;
        const one = { ...cfg, tasks: [task], demo: undefined };
        const ans = answer(one, task);
        if (isBitSet(ans.carries, 1) && isBitSet(ans.carries, 2)) chains++;
        let st = initCascade(one);
        const cells: CascadeCell[] = [];
        for (let c = one.width - 1; c >= 1; c--) if (isBitSet(ans.carries, c)) cells.push(car(c));
        for (let c = one.width - 1; c >= 0; c--) if (isBitSet(ans.result, c)) cells.push(res(c));
        for (const cell of cells) {
          const r = toggle(one, st, cell);
          expect(r.events[0]?.type).toBe('toggle');
          st = r.state;
        }
        expect(confirm(one, st).events[0].type).toBe('step');
        // Kdo jde podle papíru zprava, dostane u řetězu větu o sousedovi vlevo.
        for (let c = 1; c < one.width; c++) {
          if (!isBitSet(ans.carries, c) || !isBitSet(ans.carries, c + 1)) continue;
          const text = refusal(one, [], car(c));
          if (text !== null) expect(text).toContain(CHAIN);
        }
      });
    }
    expect(chains).toBeGreaterThan(0);
  });

  it('nápověda 2 je kratší a zmíní řetěz, replika po první úloze má dvě věty', () => {
    const level = cascadeOf('II-8');
    const hint = level.hints[1];
    expect(hint.length).toBeLessThan(170);
    expect(hint).toContain('volnému světlu');
    expect(hint).not.toMatch(FORBIDDEN);
    const line = level.echo.step![0];
    expect(line.split(/(?<=[.?!])\s+/)).toHaveLength(2);
    expect(line).not.toMatch(FORBIDDEN);
  });

  it('Kodex popíše výpůjčku přes nuly', () => {
    const entry = KODEX.find((e) => e.id === 'odliv')!;
    expect(entry.modern).toContain('1000 − 0001 = 0111');
    expect(entry.modern).toContain('půjčí si nejdřív od svého souseda');
    expect(entry.modern).not.toMatch(/odliv/i);
  });
});

describe('A4: ukázka kroku ve Vahách Osudu počítá se zbylými tahy (D-II-31)', () => {
  const cfg = tideOf('II-14').config;

  it('dokud se cesta vejde, ukázka vede z aktuální váhy', () => {
    const st = initTide(cfg);
    expect(cfg.tasks[0]).toEqual({ start: 7, target: 30 });
    expect(pathFits(cfg, st)).toBe(true);
    expect(tideStep(cfg, st)).toBe('Nejkratší cesta k 30: 7 → 14 → 15 → 30. První krok je páka posun vlevo.');
  });

  it('po dvou zbytečných tazích se cesta nevejde: misky se vrátí a ukázka vede od začátku zkoušky', () => {
    let st = initTide(cfg);
    st = pull(cfg, st, 'dec').state;
    st = pull(cfg, st, 'dec').state;
    expect(st.value).toBe(5);
    expect(pathFits(cfg, st)).toBe(false);
    expect(tideStep(cfg, st)).toBe(
      `Nejkratší cesta odsud má ${distance(cfg, 5, 30)} tahů, Osud dovolí už jen 1. Až tahy dojdou, misky se vrátí na 7. Odtud vede cesta 7 → 14 → 15 → 30.`,
    );
  });

  it('mimo Váhy Osudu se cesta vejde vždy', () => {
    const free = tideOf('II-6').config;
    let st = initTide(free);
    for (let k = 0; k < 6; k++) st = pull(free, st, 'shr').state;
    expect(pathFits(free, st)).toBe(true);
  });

  it('kdo po zbytečném tahu hraje jen podle ukázky, projde každou losovanou zkouškou nejvýš s jedním návratem', () => {
    let returned = 0;
    for (const gen of [genII14, genII15Fate]) {
      forSeeds((s) => {
        const fate = gen(seeded(s));
        let st = initTide(fate);
        for (let k = 0; k < fate.tasks.length; k++) {
          const target = fate.tasks[k].target;
          const resets = st.resets;
          // Zbytečný tah: páka, která od cíle vzdálí.
          const away = fate.ops.find((op) => distance(fate, applyOp(op, st.value, fate.bits).value, target) > distance(fate, st.value, target));
          if (away) st = pull(fate, st, away).state;
          for (let guard = 0; st.step === k && guard < 40; guard++) {
            const text = tideStep(fate, st)!;
            expect(text).not.toMatch(FORBIDDEN);
            if (pathFits(fate, st)) {
              expect(text).toMatch(/^Nejkratší cesta k /);
              st = pull(fate, st, bestOp(fate, st)!).state;
              continue;
            }
            returned++;
            const start = taskStart(fate, k);
            expect(text).toContain(`misky se vrátí na ${start}.`);
            const route = text.split('Odtud vede cesta ')[1].replace(/\.$/, '').split(' → ').map(Number);
            expect(route[0]).toBe(start);
            expect(route[route.length - 1]).toBe(target);
            expect(route.length - 1).toBe(taskLimit(fate, st));
            // Jakýkoli tah: k cíli vedou aspoň dva, takže jím hráč cíl nepřeskočí, jen spotřebuje tah.
            st = pull(fate, st, fate.ops[0]).state;
          }
          expect(st.step).toBe(k + 1);
          expect(st.resets - resets).toBeLessThanOrEqual(1);
        }
      });
    }
    expect(returned).toBeGreaterThan(0);
  });
});

describe('A6: nápovědy bez dvojkového zápisu a replika o +1 z jedničky (D-II-19, H-II-12, H-II-14)', () => {
  it('II-9 nápověda 2 a Váhy Osudu nápověda 1 nemluví o zápisu, který kolo ani miska neukazují', () => {
    const texts = [tideOf('II-9').hints[1], tideOf('II-14').hints[0], tideOf('II-15', 'Váhy Osudu').hints[0]];
    for (const t of texts) {
      expect(t).not.toMatch(/dvojkov/);
      expect(t).not.toMatch(FORBIDDEN);
    }
  });

  it('postup z nápovědy 2 v II-9 (od cíle zpátky, páky v opačném pořadí) dá nejkratší cestu', () => {
    const configs = [tideOf('II-9').config, ...Array.from({ length: SEEDS }, (_, s) => genII9(seeded(s + 1)))];
    for (const cfg of configs) {
      for (const t of cfg.tasks) {
        const back: TideOp[] = [];
        for (let v = t.target; v > 1; ) {
          back.push(v % 2 ? 'inc' : 'shl');
          v = v % 2 ? v - 1 : v / 2;
        }
        let v = t.start!;
        for (const op of back.reverse()) v = applyOp(op, v, cfg.bits).value;
        expect(v).toBe(t.target);
        expect(back.length).toBe(distance(cfg, t.start!, t.target));
        // Postup začne zdvojením, jak to dělali Lumenité.
        expect(back[0]).toBe('shl');
      }
    }
  });

  it('replika po +1 z jedničky je jen v II-9 a říká pravdu: z jedničky dá +1 totéž co ×2', () => {
    const level = tideOf('II-9');
    const line = level.echo.incFromOne!;
    expect(line).toContain('+1');
    expect(line).toContain('×2');
    expect(line).not.toMatch(FORBIDDEN);
    expect(level.config.tasks.every((t) => t.start === 1)).toBe(true);
    expect(applyOp('inc', 1, level.config.bits).value).toBe(applyOp('shl', 1, level.config.bits).value);
    const others = ACT_II.levels.flatMap(partsOf).filter((p) => p.echo.incFromOne);
    expect(others.map((p) => p.id)).toEqual(['II-9']);
  });
});

describe('B6: brány Kaskády ohlásí pravidlo v zadání (H-II-10)', () => {
  const RULE = 'Brána krystaly nehlídá: co kam teče, spočítej v hlavě.';

  it.each([
    ['II-7', 'Kaskáda'],
    ['II-15', 'Odčítání'],
  ])('%s: zadání nese pravidlo jednou, Echo ho neopakuje', (id, title) => {
    const p = cascadeOf(id, title);
    expect(p.config.conserve).toBeFalsy();
    expect(p.presentation.task.split(RULE)).toHaveLength(2);
    expect(p.echo.intro.join(' ')).not.toMatch(/nehlídá/);
  });

  it('zachování světla (a s ním let světel hned při doteku) mají všechny Kaskády mimo brány', () => {
    const cascades = ACT_II.levels.flatMap(partsOf).filter((p): p is CascadeLevel => p.kind === 'cascade');
    for (const p of cascades) expect(!!p.config.conserve).toBe(!isGateRoom(p.id));
  });
});

describe('B7: II-13 doplněk losuje jen 1 až 6 (D-II-28)', () => {
  it('zkratku „převrať a přidej jednu“ nejde obejít samými +1', () => {
    const fixed = tideOf('II-13', 'Záporná čísla').config;
    const configs = [fixed, ...Array.from({ length: SEEDS }, (_, s) => genII13Negate(seeded(s + 1)))];
    for (const cfg of configs) {
      expect(cfg.tasks[0].start).toBe(3);
      cfg.tasks.forEach((t, k) => {
        const b = t.start!;
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(6);
        expect(t.show).toBe(`−${b}`);
        expect(distance(cfg, b, t.target)).toBe(2);
        expect(bestOp(cfg, { ...initTide(cfg), step: k, value: b })).toBe('not');
        // Samými +1 je cesta delší než ideál.
        expect(distance({ ...cfg, ops: ['inc'] }, b, t.target)).toBeGreaterThan(2);
      });
    }
  });
});
