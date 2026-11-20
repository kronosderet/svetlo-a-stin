/**
 * Verze 0.4.4, Dílna (PLAN-OPRAV.md): jeden krok na stisk (A3), důvod u točitého kamene (A4),
 * nápovědy podle úlohy (A5), nápověda 2 jako princip (A7), zkouška paměti s tlačítkem Od tmy (B3)
 * a pořadí úloh ve Voliči operace (B6).
 */
import { describe, expect, it } from 'vitest';
import type { Rune } from '../core/logic';
import {
  examine,
  fromDark,
  hint,
  hintFollowed,
  initMachine,
  nextRune,
  nextSource,
  pulse,
  setRune,
  setWire,
  settle,
  slotNodes,
  sockets,
  test as runTest,
  toggleInput,
  type MachineConfig,
  type MachineEvent,
  type MachineState,
  type MachineTask,
} from '../core/puzzles/machine';
import { buildStepWords, failureWords, shownWords } from '../game/machineWords';
import { ACT_IV } from './act4';
import { ALU_WIRING, compareHints, compareTask, genIV7Compare, subtractHints, subtractTask } from './generators4';
import { instantiate, partsOf } from './levels';
import { seeded } from './random';
import type { MachineLevel, PuzzleLevel } from './types';

const SEEDS = Array.from({ length: 200 }, (_, k) => k + 1);
const level = (id: string) => ACT_IV.levels.find((l) => l.id === id)!;
const machineParts = (id: string) => partsOf(level(id)).filter((p): p is MachineLevel => p.kind === 'machine');
const part = (id: string, title?: string) => machineParts(id).find((p) => !title || p.title === title)!;

/** Rodově zatížené oslovení a „klikni“ na dotykovém displeji (jako v recenzeI.test.ts). */
const FORBIDDEN = /\b(prošel|zvládl|sám|udělal|Klikni|klikni|kliknout)\b/;

/** Stav na začátku úlohy k (předchozí úlohy přeskočené). */
const startOf = (cfg: MachineConfig, k = 0): MachineState => initMachine({ tasks: cfg.tasks.slice(k) });
const only = (task: MachineTask): MachineConfig => ({ tasks: [task] });

/**
 * Hra jen podle ukázky kroku, jak ji vede MachineGame: stisk nápovědy zvýrazní krok, hráč se
 * zvýrazněného prvku dotýká, dokud krok neudělá, a teprve pak se nápověda vrátí na 2. stupeň.
 * Vrátí počet stisků a jestli Zkouška prošla.
 */
function playByHints(task: MachineTask): { presses: number; passed: boolean; texts: string[] } {
  const cfg = only(task);
  let st = startOf(cfg);
  let presses = 0;
  const texts: string[] = [];
  for (let guard = 0; guard < 200; guard++) {
    if (!hint(cfg, st)) break;
    presses++;
    // Stupeň 3: dotyky zvýrazněného prvku, dokud ukázaný krok není hotový.
    for (let touch = 0; touch < 20; touch++) {
      const h = hint(cfg, st)!;
      texts.push(buildStepWords(task.machine, h, st.runes, st.wires)!);
      let r: { state: MachineState; events: MachineEvent[] };
      if ('node' in h) r = setRune(cfg, st, h.node, nextRune(task, st, h.node)!);
      else if ('socket' in h) r = setWire(cfg, st, h.socket, nextSource(task, st, h.socket)!);
      else throw new Error('stavba nemá vstupy ani tep');
      st = r.state;
      if (hintFollowed(h, r.events)) break;
    }
  }
  const done = runTest(cfg, st);
  return { presses, passed: done.state.complete, texts };
}

describe('A3: jeden krok na stisk', () => {
  it('ukázaný krok vrátí nápovědu na 2. stupeň, mezikrok ani jiný tah ne', () => {
    // IV-1: prázdný kámen spodní číslice s Poutem, Rozcestím a Výlukou.
    const cfg = part('IV-1').config;
    const st = startOf(cfg);
    const h = hint(cfg, st)!;
    expect(h).toEqual({ node: 's', rune: 'xor' });
    expect(hintFollowed(h, setRune(cfg, st, 's', 'and').events)).toBe(false);
    expect(hintFollowed(h, setRune(cfg, st, 's', 'xor').events)).toBe(true);
    // Přepnutý vstup při stavbě není krok stavby.
    expect(hintFollowed(h, toggleInput(cfg, st, 0).events)).toBe(false);
    expect(hintFollowed(null, setRune(cfg, st, 's', 'xor').events)).toBe(false);
  });

  it('točitý kámen: jen ukázaný zdroj', () => {
    const cfg = part('IV-6').config;
    const st = startOf(cfg);
    const h = hint(cfg, st)!;
    expect(h).toEqual({ socket: 'd0:0', source: 'n1' });
    expect(hintFollowed(h, setWire(cfg, st, 'd0:0', 'A1').events)).toBe(false);
    expect(hintFollowed(h, setWire(cfg, st, 'd0:0', 'n1').events)).toBe(true);
    expect(hintFollowed(h, setWire(cfg, st, 'd0:1', 'n0').events)).toBe(false);
  });

  it('v cílech a při zkoumání je krokem vstup nebo tep', () => {
    const volic = part('IV-5', 'Volič').config;
    const st = startOf(volic);
    const h = hint(volic, st)!;
    expect(h).toEqual({ input: 0 });
    expect(hintFollowed(h, toggleInput(volic, st, 0).events)).toBe(true);
    expect(hintFollowed(h, toggleInput(volic, st, 1).events)).toBe(false);
    const hvezdy = part('IV-11', 'Počítání').config;
    const beat = hint(hvezdy, startOf(hvezdy))!;
    expect(beat).toEqual({ pulse: true });
    expect(hintFollowed(beat, pulse(hvezdy, startOf(hvezdy)).events)).toBe(true);
    const zkoumani = part('IV-0').config;
    const z = hint(zkoumani, startOf(zkoumani))!;
    expect(hintFollowed(z, toggleInput(zkoumani, startOf(zkoumani), (z as { input: number }).input).events)).toBe(true);
  });

  it('IV-6: každý točitý kámen stojí jeden stisk a stavba podle ukázky projde', () => {
    const [first, second] = part('IV-6').config.tasks;
    const a = playByHints(first);
    expect(a.passed).toBe(true);
    expect(a.presses).toBe(sockets(first.machine).length);
    const b = playByHints(second);
    expect(b.passed).toBe(true);
    expect(b.presses).toBe(8);
  });

  it('každá stavba patra jde dohrát jen podle ukázky, stisk po stisku', () => {
    for (const l of ACT_IV.levels)
      for (const p of partsOf(l))
        if (p.kind === 'machine')
          for (const task of p.config.tasks.filter((t) => t.mode === 'build')) {
            const run = playByHints(task);
            expect(run.passed, p.id).toBe(true);
            // Nejvýš jeden stisk na kámen. Méně, když má stavba víc řešení a mezikrok trefí jiné.
            expect(run.presses, p.id).toBeGreaterThan(0);
            expect(run.presses, p.id).toBeLessThanOrEqual(slotNodes(task.machine).length + sockets(task.machine).length);
          }
  });
});

describe('A4: ukázka u točitého kamene řekne, co ze zdroje teče', () => {
  it('IV-6: Obraceč na krystalu s váhou 2', () => {
    const cfg = part('IV-6').config;
    const st = startOf(cfg);
    expect(buildStepWords(cfg.tasks[0].machine, hint(cfg, st), st.runes, st.wires)).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo z kamene 1, kde Obraceč obrací světlo ze vstupu A s váhou 2.',
    );
  });

  it('IV-5: nejdřív runa, pak obrácený volič', () => {
    const cfg = part('IV-5', 'Stavba').config;
    const m = cfg.tasks[0].machine;
    let st = startOf(cfg);
    expect(buildStepWords(m, hint(cfg, st), st.runes, st.wires)).toBe('Do zvýrazněného kamene patří Rozcestí: svítí, když svítí aspoň jeden vstup.');
    st = setRune(cfg, st, 'j', 'or').state;
    expect(buildStepWords(m, hint(cfg, st), st.runes, st.wires)).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo z kamene 1, kde Obraceč obrací světlo ze vstupu V.',
    );
  });

  it('IV-8: druhá runa kruhu, IV-14: kopie s vahami, IV-11: součástka bez důvodu navíc', () => {
    const kruh = part('IV-8', 'Stavba').config;
    const k = startOf(kruh);
    expect(buildStepWords(kruh.tasks[0].machine, hint(kruh, k), k.runes, k.wires)).toBe(
      'Zvýrazněný točitý kámen natoč tak, aby světlo teklo z kamene 2, kde Zavřené rozcestí bere světlo ze vstupu R a z točitého kamene.',
    );
    const mul = part('IV-14').config;
    const s = startOf(mul);
    expect(buildStepWords(mul.tasks[0].machine, hint(mul, s), s.runes, s.wires)).toMatch(/z kamene \d, kde Pouto počítá A[₁₂] × B[₁₂]\.$/);
    const hvezdy = part('IV-11', 'Stavba').config;
    const h = startOf(hvezdy);
    expect(buildStepWords(hvezdy.tasks[0].machine, hint(hvezdy, h), h.runes, h.wires)).toMatch(/z výstupu S poloviční sčítačky \d\.$/);
  });

  it('kámen s runou jako zdroj má vždy důvod, nikdy „undefined“', () => {
    const tasks: MachineTask[] = [];
    for (const l of ACT_IV.levels)
      for (const p of [...partsOf(l), ...SEEDS.slice(0, 20).flatMap((s) => partsOf(instantiate(l, seeded(s))) as PuzzleLevel[])])
        if (p.kind === 'machine') tasks.push(...p.config.tasks.filter((t) => t.mode === 'build'));
    let withWhy = 0;
    for (const task of tasks)
      for (const text of playByHints(task).texts) {
        expect(text).not.toMatch(/undefined|null/);
        expect(text).not.toMatch(FORBIDDEN);
        const src = text.match(/z kamene (\d+)/);
        if (src && text.startsWith('Zvýrazněný točitý')) {
          expect(text, text).toContain(', kde ');
          withWhy++;
        }
      }
    expect(withWhy).toBeGreaterThan(0);
  });
});

describe('A5: nápovědy podle úlohy', () => {
  it('úlohy porovnávače a odčítačky mají vlastní nápovědy, komnata ty první', () => {
    expect(part('IV-4', 'Stavba').config.tasks.map((t) => t.hints)).toEqual([compareHints(true), compareHints(false)]);
    expect(part('IV-4', 'Stavba').hints).toEqual(compareHints(true));
    expect(part('IV-12').config.tasks.map((t) => t.hints)).toEqual([subtractHints('invert'), subtractHints('switch')]);
    expect(part('IV-12').hints).toEqual(subtractHints('invert'));
    for (const t of [...part('IV-12').config.tasks, subtractTask('switch')]) for (const h of t.hints!) expect(h).not.toMatch(/Doplň/);
  });

  it('IV-7: vylosovaný porovnávač má nápovědy podle jména své lampy', () => {
    const names = new Set<string>();
    for (const seed of SEEDS) {
      const [task] = genIV7Compare(seeded(seed)).tasks;
      const name = task.machine.lamps[0].label;
      names.add(name);
      expect(task.hints).toEqual(compareHints(name === 'stejné'));
      expect(task.hints![0]).toContain(`„${name}“`);
    }
    expect(names).toEqual(new Set(['stejné', 'různé']));
  });

  it('stavba přesně podle nápovědy 2 projde, ve druhé úloze i v první', () => {
    const [same, diff] = part('IV-4', 'Stavba').config.tasks;
    expect(same.hints![1]).toMatch(/Rovnost.*Pouto/);
    expect(examine(same, { e1: 'xnor', e0: 'xnor', j: 'and' }, {})).toBeNull();
    expect(diff.hints![1]).toMatch(/Výluka.*Rozcestí/);
    expect(examine(diff, { e1: 'xor', e0: 'xor', j: 'or' }, {})).toBeNull();
    // D-IV-03: rada k první úloze by ve druhé neprošla.
    expect(examine(diff, { e1: 'xnor', e0: 'xnor', j: 'and' }, {})).not.toBeNull();

    const [invert, sw] = part('IV-12').config.tasks;
    expect(invert.hints![1]).toContain('převrácené B');
    expect(examine(invert, {}, { 'fa0:1': 't0', 'fa1:1': 't1', 'fa2:1': 't2', 'fa0:2': '1' })).toBeNull();
    expect(sw.hints![1]).toContain('Výluka s M');
    expect(sw.hints![1]).toContain('jen při odčítání');
    const xor: Record<string, Rune> = { t0: 'xor', t1: 'xor', t2: 'xor' };
    expect(examine(sw, xor, { 'fa0:2': 'M' })).toBeNull();
    // D-IV-03: stálé světlo v přenosu (rada k první úloze) padne při sčítání.
    expect(examine(sw, xor, { 'fa0:2': '1' })).not.toBeNull();
  });

  it('nápovědy porovnávače sedí na obě jména', () => {
    for (const same of [true, false]) {
      const t = compareTask(same);
      expect(t.hints![0]).toContain(`„${t.machine.lamps[0].label}“`);
    }
  });
});

describe('A7: nápověda 2 v patře IV dá princip a otázku', () => {
  const rooms: [string, string | undefined][] = [
    ['IV-5', 'Stavba'],
    ['IV-8', 'Stavba'],
    ['IV-9', 'Brána tepu'],
    ['IV-10', 'Posun'],
    ['IV-11', 'Stavba'],
    ['IV-12', undefined],
    ['IV-15', 'Počítadlo s chodem'],
  ];
  const hintsOf = (p: MachineLevel) => [p.hints, ...p.config.tasks.map((t) => t.hints).filter((h) => !!h)] as string[][];

  it('nápověda 2 se ptá a neříká staré celé zapojení', () => {
    for (const [id, title] of rooms) for (const hints of hintsOf(part(id, title))) expect(hints[1], id).toContain('?');
    const text = JSON.stringify(ACT_IV) + JSON.stringify([subtractHints('invert'), subtractHints('switch')]);
    for (const old of [
      'Horní Pouto potřebuje obrácený volič',
      'má brát druhé světlo z výstupu té druhé runy',
      'Do S má téct D, do R obrácené D',
      'Nejlehčí ozvěna bere ze vstupu X',
      'Do nejlehčí sčítačky má přitékat stálé světlo',
      'Do každé sčítačky má téct převrácené B',
      'Pouto pustí světlo z paměti jen tehdy',
    ])
      expect(text).not.toContain(old);
  });

  it('nápovědy 1 a 2 neopakují repliky Echa', () => {
    const sentences = (t: string) =>
      t
        .split(/(?<=[.?!:])\s+/)
        .map((s) => s.replace(/[.?!:]$/, '').trim().toLowerCase())
        .filter((s) => s.length > 12);
    for (const [id, title] of rooms) {
      const room = level(id);
      const p = part(id, title);
      const echo = [p.echo, room.echo as Partial<MachineLevel['echo']>].flatMap((e) => [
        ...(e.intro ?? []),
        ...(e.solved ?? []),
        ...Object.values(e.step ?? {}),
        ...Object.values(e.found ?? {}),
        e.wrong ?? '',
        e.complete ?? '',
      ]);
      const said = new Set(echo.flatMap(sentences));
      for (const hints of hintsOf(p))
        for (const h of hints.slice(0, 2)) {
          expect(h).not.toMatch(FORBIDDEN);
          for (const s of sentences(h)) expect(said.has(s), `${id}: ${s}`).toBe(false);
        }
    }
  });
});

describe('B3: zkouška paměti', () => {
  it('hláška řekne, co lampa ukázala, a pošle projít kroky od zhasnuté paměti', () => {
    const [task] = part('IV-8', 'Stavba').config.tasks;
    const f = examine(task, {}, { 'nq:1': 'S', 'q:1': 'R' })!;
    expect(f.at).toBe(3);
    expect(failureWords(task, f)).toBe(
      'Zkouška se zastavila ve 4. kroku: lampa Q svítí, má mlčet. Od zhasnuté paměti projdi kroky 1 až 4 vstupy a sleduj, kudy světlo teče. Paměť zhasne tlačítko Od tmy.',
    );
  });

  it('u čísla řekne hodnotu, u stroje s tepem i tep', () => {
    const [task] = part('IV-11', 'Stavba').config.tasks;
    // Ozvěny berou součet o sloupec vedle: počítadlo nepočítá po jedné.
    const wires = { 'f2:0': 'h2.S', 'f1:0': 'h0.S', 'f0:0': 'h1.S', 'h0:1': '1' };
    const f = examine(task, {}, wires)!;
    const text = failureWords(task, f);
    expect(text).toMatch(/^Zkouška se zastavila ve? \d\. kroku: lampy ukazují \d, mají ukázat \d\. Od zhasnuté paměti projdi (kroky 1 až \d|1\. krok) tepem/);
    expect(shownWords(task.machine, task.script![f.at].expect, f.shown)).toMatch(/^lampy ukazují \d, mají ukázat \d$/);
    const [shift] = part('IV-10', 'Posun').config.tasks;
    const g = examine(shift, {}, { 'f2:0': 'X', 'f1:0': 'X', 'f0:0': 'X' })!;
    expect(failureWords(shift, g)).toContain('vstupy i tepem');
  });

  it('jeden chybný krok na začátku: „1. krok“', () => {
    const [task] = part('IV-15', 'Počítadlo s chodem').config.tasks;
    const f = examine(task, { z0: 'or', z1: 'or', z2: 'or' }, { 'h0:1': '0' })!;
    expect(f.at).toBe(0);
    expect(failureWords(task, f)).toContain('Od zhasnuté paměti projdi 1. krok vstupy i tepem');
  });

  it('Od tmy: po projití kroků 1 až k ukážou lampy totéž co Zkouška', () => {
    const cfg = part('IV-11', 'Stavba').config;
    let st = startOf(cfg);
    for (const [key, src] of Object.entries({ 'f2:0': 'h2.S', 'f1:0': 'h0.S', 'f0:0': 'h1.S', 'h0:1': '1' })) st = setWire(cfg, st, key, src).state;
    st = runTest(cfg, st).state;
    const f = st.failed!;
    // Hráč mezitím tepe naslepo, pak dá Od tmy.
    st = pulse(cfg, pulse(cfg, st).state).state;
    const dark = fromDark(cfg, st);
    expect(dark.events).toEqual([{ type: 'dark' }]);
    expect(dark.state.moves).toBe(st.moves);
    expect(dark.state.wires).toEqual(st.wires);
    expect(dark.state.failed).toEqual(f);
    st = dark.state;
    for (let k = 0; k <= f.at; k++) st = pulse(cfg, st).state;
    const q = ['Q2', 'Q1', 'Q0'].map((id) => st.memory[id.replace('Q', 'f')]);
    expect(q).toEqual(['Q2', 'Q1', 'Q0'].map((id) => f.shown[id]));
  });

  it('Od tmy jen u úloh se zkouškou paměti', () => {
    const cfg = part('IV-6').config;
    expect(fromDark(cfg, startOf(cfg)).events).toHaveLength(0);
    const kruh = part('IV-8', 'Kruh').config;
    expect(fromDark(kruh, startOf(kruh)).events).toHaveLength(0);
  });
});

describe('B6: Volič operace začíná snazší úlohou', () => {
  it('nejdřív voliče u pevných run, pak runy s přehozenými voliči', () => {
    const l = part('IV-13');
    const [selectors, runes] = l.config.tasks;
    expect(slotNodes(selectors.machine)).toHaveLength(0);
    expect(sockets(selectors.machine)).toHaveLength(3);
    expect(slotNodes(runes.machine)).toHaveLength(4);
    expect(runes.machine.nodes.filter((g) => g.part === 'mux').map((g) => g.in[2])).toEqual([...ALU_WIRING.crossed]);
    expect(selectors.say).toContain('Runy stojí pevně');
    expect(runes.say).toContain('nejdou shora dolů po pořádku');
    expect(l.echo.step).toEqual({ 0: 'Výhybky ve dvou patrech vyberou jednu ze čtyř cest.', 1: 'Každý kód má svou runu.' });
    expect(l.echo.intro.join(' ')).toContain('Výhybka je tu zabalená do jednoho kamene');
    for (const t of [selectors.say!, runes.say!, ...l.echo.intro]) expect(t).not.toMatch(FORBIDDEN);
  });

  it('úloha s voliči má vlastní nápovědy: bez nastavených voličů světlo k lampě neteče (kontrola 0.4.4)', () => {
    const l = part('IV-13');
    const [selectors, runes] = l.config.tasks;
    // Výhybka s nenastaveným voličem nic nepustí: „sleduj, kterou cestou světlo teče“ tu nejde.
    for (let row = 0; row < 16; row++) expect(settle(selectors.machine, {}, {}, row, {}).lamps.q).toBeNull();
    expect(selectors.hints).toHaveLength(2);
    for (const t of selectors.hints!) {
      expect(t).not.toMatch(/runa na jejím konci|sleduj, kterou cestou/);
      expect(t).toMatch(/\?$/);
      expect(t).not.toMatch(FORBIDDEN);
    }
    // Nápovědy komnaty (cesta od lampy k runě) zůstaly úloze s runami.
    expect(runes.hints).toBeUndefined();
    expect(l.hints[1]).toContain('runa na jejím konci');
  });
});

describe('B3, A7: nové repliky a hlášky bez zakázaných obratů', () => {
  it('úvod stavby IV-8 vysvětlí kroky v čase', () => {
    const intro = part('IV-8', 'Stavba').echo.intro.join(' ');
    expect(intro).toContain('krok za krokem');
    expect(intro).not.toMatch(FORBIDDEN);
  });

  it('první replika po chybě ve zkoušce paměti pošle od tmy, jako hláška pro čtečku (kontrola 0.4.4)', () => {
    // První chyba ukáže vidícímu hráči echo.wrong, failureWords slyší jen čtečka (machineEvents).
    const withScript = ACT_IV.levels
      .flatMap((l) => partsOf(l))
      .filter((p): p is MachineLevel => p.kind === 'machine' && p.config.tasks.some((t) => !!t.script));
    expect(withScript.map((p) => `${p.id} ${p.title}`)).toEqual(['IV-8 Stavba', 'IV-9 Brána tepu', 'IV-10 Posun', 'IV-11 Stavba', 'IV-15 Počítadlo s chodem']);
    for (const p of withScript) {
      expect(p.echo.wrong, p.id).toContain('Tlačítkem Od tmy zhasni paměť');
      expect(p.echo.wrong).not.toMatch(FORBIDDEN);
    }
    // IV-9: z živé paměti může 2. krok vyjít dobře, replika proto chce kroky 1 a 2.
    expect(part('IV-9', 'Brána tepu').echo.wrong).not.toMatch(/Projdi 2\. krok/);
  });
});
