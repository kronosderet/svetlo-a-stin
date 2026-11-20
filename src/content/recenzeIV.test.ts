/**
 * Opravy z recenze patra IV (RECENZE.md, kapitola 2): generátory, hlášky Dílny a texty Hlubiny.
 * Losované věci se zkoušejí přes mnoho semínek, ne jen na jednom losu.
 */
import { describe, expect, it } from 'vitest';
import { rowCount, type Rune } from '../core/logic';
import { examine, settle, slotNodes, sockets, solutions, type MachineTask } from '../core/puzzles/machine';
import { extraTaskFor } from '../game/extraTask';
import { failureWords, lampsWords, rowWords, triedWords } from '../game/machineWords';
import { ACT_IV } from './act4';
import { genIV7Route, qCounter, routeTasks, subtractTask } from './generators4';
import { KODEX } from './kodex';
import { instantiate, partsOf } from './levels';
import { countScript, counter, gatedLatch, gatedScript } from './machines';
import { seeded } from './random';
import type { MachineLevel, PuzzleLevel } from './types';

const SEEDS = Array.from({ length: 300 }, (_, k) => k + 1);
const level = (id: string) => ACT_IV.levels.find((l) => l.id === id)!;
const machineParts = (id: string) => partsOf(level(id)).filter((p): p is MachineLevel => p.kind === 'machine');
const part = (id: string, title: string) => machineParts(id).find((p) => p.title === title)!;

type Config = { runes: Record<string, Rune>; wires: Record<string, string> };

/** Všechna úplná osazení stroje (každý kámen s runou, každý točitý kámen nastavený). */
function configs(task: MachineTask): Config[] {
  const slots = slotNodes(task.machine);
  const socks = sockets(task.machine);
  const out: Config[] = [];
  const wiresFrom = (k: number, runes: Record<string, Rune>, wires: Record<string, string>): void => {
    if (k === socks.length) out.push({ runes, wires });
    else for (const src of socks[k].choices) wiresFrom(k + 1, runes, { ...wires, [socks[k].key]: src });
  };
  const runesFrom = (k: number, runes: Record<string, Rune>): void => {
    if (k === slots.length) wiresFrom(0, runes, {});
    else for (const r of slots[k].choices ?? []) runesFrom(k + 1, { ...runes, [slots[k].id]: r });
  };
  runesFrom(0, {});
  return out;
}

/** Úlohy Dílny celého patra, u bran i s vylosovanými podobami. */
function allTasks(): { id: string; task: MachineTask }[] {
  const out: { id: string; task: MachineTask }[] = [];
  for (const l of ACT_IV.levels) {
    for (const p of partsOf(l)) if (p.kind === 'machine') for (const task of p.config.tasks) out.push({ id: p.id, task });
    for (const seed of SEEDS.slice(0, 20))
      for (const p of partsOf(instantiate(l, seeded(seed))) as PuzzleLevel[])
        if (p.kind === 'machine' && p.generate) for (const task of p.config.tasks) out.push({ id: p.id, task });
  }
  return out;
}

/** Všechny texty patra (zadání, nápovědy, repliky, kvízy) jako jeden řetězec. */
const actText = JSON.stringify(ACT_IV);

describe('D-IV-02: kvíz Počítadla hvězd', () => {
  it('vždy přeteče a vysvětlení sedí na čísla', () => {
    for (const seed of SEEDS) {
      const q = qCounter(seeded(seed));
      const [, start, beats] = q.question.match(/ukazuje (\d)\. Co ukáže po (\d) tepech/)!.map(Number);
      const end = (start + beats) % 8;
      expect(start + beats, q.question).toBeGreaterThanOrEqual(8);
      expect(q.options[q.correct]).toBe(String(end));
      expect(new Set(q.options).size).toBe(4);
      expect(q.explain).toContain(`${start} + ${beats} = ${start + beats}`);
      expect(q.explain).toContain(`zbude ${end}.`);
    }
  });

  it('typická chyba bez přetečení má vlastní vysvětlení', () => {
    for (const seed of SEEDS) {
      const q = qCounter(seeded(seed));
      const [, start, beats] = q.question.match(/ukazuje (\d)\. Co ukáže po (\d) tepech/)!.map(Number);
      const k = q.options.indexOf(String(start + beats));
      expect(k, q.question).toBeGreaterThan(0);
      expect(q.why?.[k]).toContain('přeteče');
    }
  });
});

describe('H-IV-13, D-IV-25, H-IV-16: druhá zkouška brány Hlubiny', () => {
  it('lampy rozdělovače nikdy nejsou popořadě', () => {
    const orders = new Set<string>();
    for (const seed of SEEDS) {
      const [dec] = genIV7Route(seeded(seed)).tasks;
      const order = dec.machine.lamps.map((l) => l.label).join('');
      expect(order).not.toBe('0123');
      orders.add(order);
    }
    // Ostatních 23 pořadí se losuje dál.
    expect(orders.size).toBe(23);
  });

  it('každá úloha má vlastní zadání a runu chce jen výhybka', () => {
    for (const seed of SEEDS.slice(0, 50)) {
      const [dec, sw] = genIV7Route(seeded(seed)).tasks;
      expect(dec.say).toContain('rozdělovač');
      expect(dec.say).not.toMatch(/runu/);
      expect(slotNodes(dec.machine)).toHaveLength(0);
      expect(sw.say).toContain('vlož runu');
      expect(slotNodes(sw.machine).length).toBeGreaterThan(0);
    }
    expect(routeTasks([2, 0, 3, 1], false).map((t) => t.kind)).toEqual(['decoder', 'mux']);
  });

  it('IV-1 a IV-13 mají zadání podle úlohy', () => {
    const [first, second] = machineParts('IV-1')[0].config.tasks;
    expect(first.say).toBeUndefined();
    expect(slotNodes(first.machine)).toHaveLength(1);
    expect(slotNodes(second.machine)).toHaveLength(2);
    expect(second.say).toContain('oba kameny');
    // D-IV-13 (0.4.4): nejdřív snazší úloha s voliči, pak runy s přehozenými voliči.
    const [selectors, runes] = machineParts('IV-13')[0].config.tasks;
    expect(slotNodes(runes.machine).length).toBeGreaterThan(0);
    expect(sockets(runes.machine)).toHaveLength(0);
    expect(runes.say).toContain('Osaď kameny');
    expect(runes.say).not.toContain('voliče výhybek');
    expect(slotNodes(selectors.machine)).toHaveLength(0);
    expect(selectors.say).toContain('voliče výhybek');
  });
});

describe('H-IV-04: zkouška navíc v Cestách je stejný stroj', () => {
  const cesty = part('IV-7', 'Cesty');

  it('po ukázce u výhybky přibude výhybka, u rozdělovače rozdělovač', () => {
    for (const seed of SEEDS.slice(0, 100)) {
      const rng = seeded(seed);
      const tasks = (instantiate(cesty, rng) as MachineLevel).config.tasks;
      tasks.forEach((task, step) => {
        const extra = extraTaskFor(tasks, () => cesty.generate!(rng).tasks, step) as MachineTask;
        expect(extra.kind, `seed ${seed}, úloha ${step}`).toBe(task.kind);
        expect(JSON.stringify(extra)).not.toBe(JSON.stringify(task));
      });
    }
  });

  it('všechny losované úlohy bran znají svůj druh', () => {
    for (const { id, task } of allTasks()) if (id === 'IV-7' || id === 'IV-15') expect(task.kind, id).toBeTruthy();
  });
});

describe('H-IV-11: kámen přenosu úplné sčítačky', () => {
  it('má jediné řešení, Rozcestí', () => {
    const [task] = part('IV-2', 'Stavba').config.tasks;
    const all = solutions(task);
    expect(all).toHaveLength(1);
    expect(all[0].runes.c).toBe('or');
  });
});

describe('D-IV-15, D-III-18: hláška po chybě u malé desky', () => {
  it('tvar odpovídá počtu řádků a jmenuje řádek, podle kterého nastavit vstupy', () => {
    let single = 0;
    let more = 0;
    for (const { task } of allTasks()) {
      if (!task.target || rowCount(task.machine.inputs.length) > 8) continue;
      for (const c of configs(task)) {
        const f = examine(task, c.runes, c.wires);
        if (!f) continue;
        const text = failureWords(task, f);
        expect(text).not.toMatch(/podle nich|podle něj/);
        expect(text).toContain(rowWords(task.machine, f.at));
        if (f.count === 1) {
          single++;
          expect(text).toContain('v 1 řádku desky:');
        } else {
          more++;
          expect(text).toMatch(/ve? \d+ řádcích desky\. První je označený:/);
        }
      }
    }
    expect(single).toBeGreaterThan(0);
    expect(more).toBeGreaterThan(0);
  });

  it('past s Rozcestím v IV-1 jmenuje řádek 1 + 1', () => {
    const [, task] = machineParts('IV-1')[0].config.tasks;
    const f = examine(task, { c: 'and', s: 'or' }, {})!;
    expect(f.count).toBe(1);
    expect(failureWords(task, f)).toBe('Lampy nesvítí správně v 1 řádku desky: A světlo, B světlo. Nastav ty vstupy a sleduj, kudy světlo teče.');
  });
});

describe('H-IV-17: Počítadlo hvězd nemá krystaly', () => {
  it('hláška po chybě mluví jen o tepu', () => {
    const task: MachineTask = { mode: 'build', machine: counter([['h2.S', 'h1.S', 'h0.S'], ['h2.S', 'h1.S', 'h0.S'], ['h2.S', 'h1.S', 'h0.S']], ['0', '1']), script: countScript };
    expect(task.machine.inputs).toHaveLength(0);
    const wrong = configs(task).map((c) => examine(task, {}, c.wires)).filter((f) => f !== null);
    expect(wrong.length).toBeGreaterThan(0);
    for (const f of wrong) {
      const text = failureWords(task, f!);
      // D-IV-06 (0.4.4): hláška posílá projít kroky od zhasnuté paměti, ne jen jeden krok.
      expect(text).toMatch(/projdi (kroky 1 až \d|1\. krok) tepem/);
      expect(text).not.toContain('vstupy');
    }
  });

  it('nápověda 3 v cílech mluví o tepu, ne o krystalu', () => {
    const goals = part('IV-11', 'Počítání');
    expect(goals.config.tasks[0].machine.inputs).toHaveLength(0);
    expect(goals.hints[2]).toContain('Tep');
    expect(goals.hints[2]).not.toContain('krystal');
  });
});

describe('K-IV-02: hláška po chybě v bráně tepu', () => {
  it('každé chybné natočení padne ve 2. kroku tak, že ozvěna D nepřevezme', () => {
    const task: MachineTask = { mode: 'build', machine: gatedLatch(['D', 'nd'], ['D', 'nd']), script: gatedScript };
    const wrong = configs(task)
      .map((c) => examine(task, {}, c.wires))
      .filter((f) => f !== null);
    expect(wrong).toHaveLength(3);
    for (const f of wrong) {
      expect(f!.at).toBe(1);
      expect(gatedScript[1].set).toEqual({ D: 1, T: 1 });
      expect(f!.shown.Q).toBe(0);
    }
    const text = part('IV-9', 'Brána tepu').echo.wrong!;
    expect(text).toContain('nepřevzala D');
    // Z živé paměti může 2. krok vyjít dobře: replika pošle od tmy přes kroky 1 a 2 (kontrola 0.4.4).
    expect(text).toContain('Od tmy');
    expect(text).toContain('kroky 1 a 2');
  });
});

describe('H-IV-01: čtečka u nové kombinace slyší lampy', () => {
  it('hlášení zkoumání v IV-0, IV-2 a IV-4 říká, co lampy ukazují', () => {
    const explore = ACT_IV.levels
      .flatMap((l) => partsOf(l))
      .filter((p): p is MachineLevel => p.kind === 'machine')
      .flatMap((p) => p.config.tasks.filter((t) => t.mode === 'explore').map((t) => ({ id: p.id, m: t.machine })));
    expect(explore.map((e) => e.id)).toEqual(['IV-0', 'IV-2', 'IV-4']);
    for (const { m } of explore) {
      const n = rowCount(m.inputs.length);
      for (let r = 0; r < n; r++) {
        const lamps = settle(m, {}, {}, r, {}).lamps;
        const text = triedWords(m, r, lamps, 2);
        expect(text).toContain(lampsWords(m, lamps));
        expect(text).toContain(`Vyzkoušeno 2 z ${n}.`);
      }
    }
    const [half] = machineParts('IV-0')[0].config.tasks;
    expect(triedWords(half.machine, 3, settle(half.machine, {}, {}, 3, {}).lamps, 4)).toBe(
      'Nová kombinace: A světlo, B světlo, lampy 2. Vyzkoušeno 4 z 4.',
    );
  });
});

describe('D-IV-26, D-IV-01: pravidla odčítačky', () => {
  it('pravidla řeknou přetočení dokola a neodkazují na Doplněk', () => {
    const invert = subtractTask('invert');
    const sw = subtractTask('switch');
    expect(invert.rule).toContain('−1 je 7');
    expect(sw.rule).toContain('7 + 1 je 0');
    for (const t of [invert, sw]) expect(t.rule).not.toContain('Doplň');
    // 7 + 7 přeteče: lampy ukážou 6, jak pravidlo říká.
    const row = 0b111_111_0;
    expect(['S2', 'S1', 'S0'].map((id) => sw.target![id][row]).join('')).toBe('110');
  });

  it('IV-12 vysvětlí doplněk sama, bez nepovinné II-13', () => {
    const l = machineParts('IV-12')[0];
    const texts = [...l.hints, ...l.echo.intro, ...Object.values(l.echo.step ?? {}), ...(l.quiz ?? []).map((q) => (typeof q === 'function' ? '' : q.hint))];
    for (const t of texts) expect(t).not.toMatch(/Doplň/);
    expect(l.hints[0]).toContain('převrácené B a jedničku');
    // Příklad z nápovědy 1: 3 − 2 přes převrácené B a jedničku.
    expect((3 + (~2 & 7) + 1) % 8).toBe(1);
  });
});

describe('texty patra IV', () => {
  it('H-I-23: na dotykovém displeji se nekliká', () => {
    expect(actText).not.toMatch(/[Kk]likn/);
  });

  it('k hráči rodově neutrálně', () => {
    expect(actText).not.toMatch(/zvládl|prošel|postavil jsi|našel jsi|(^|[^\p{L}])sám([^\p{L}]|$)/u);
  });

  it('K-IV-19: titulky nesou lumenitské jméno z Kodexu', () => {
    for (const id of ['IV-1', 'IV-2', 'IV-4', 'IV-14']) {
      const l = level(id);
      const entry = KODEX.find((e) => e.id === l.kodex)!;
      expect(l.title, id).toBe(entry.ancientName);
    }
  });

  it('D-IV-16, D-IV-17, H-IV-18, K-IV-14: věty bez dvojznačností', () => {
    expect(actText).not.toContain('má ho tep');
    expect(actText).not.toContain('tep ho vrátí');
    expect(actText).not.toContain('Tep a ozvěna');
    expect(actText).not.toContain('Tep a paměť');
    expect(actText).not.toContain('"A teď na lampu');
    expect(actText).not.toContain('Každý bit paměti v počítači');
  });

  it('H-IV-24: formule Echa se neopakují', () => {
    expect(actText.match(/Moderní jméno je/g) ?? []).toHaveLength(1);
    expect(actText.match(/Bez jediného zbytečného kroku/g) ?? []).toHaveLength(1);
    expect(actText).not.toContain('Žádná kopie komnat');
  });

  it('K-IV-25: nápovědy výhybky mluví o cestách, ne o vstupu A', () => {
    expect(actText).not.toMatch(/horní vstup A|dolní B/);
  });
});

describe('D-IV-09, D-IV-22, K-IV-20, K-IV-01, K-IV-21: Kodex Hlubiny', () => {
  const ids = ['polovicni', 'uplna', 'soucastka', 'porovnavac', 'vyhybka', 'rozdelovac', 'hlubina', 'ozvena', 'tep', 'registr', 'citac', 'odcitacka', 'alu', 'nasobicka', 'hlubina-hloub'];
  const entries = KODEX.filter((e) => ids.includes(e.id));

  it('index je váha krystalu jako na desce', () => {
    expect(entries).toHaveLength(ids.length);
    for (const e of entries) expect(`${e.modern} ${e.formula ?? ''}`, e.id).not.toMatch(/[₀ⁱ]/);
    expect(KODEX.find((e) => e.id === 'porovnavac')!.formula).toContain('(A₂ ⇔ B₂) ∧ (A₁ ⇔ B₁)');
  });

  it('přenos je všude P, součin se píše ∧ a tečka jen násobí', () => {
    for (const id of ['polovicni', 'uplna']) {
      const e = KODEX.find((x) => x.id === id)!;
      expect(`${e.modern} ${e.formula}`, id).not.toMatch(/přenos C|\bCS\b|\bC =|AB/);
      expect(e.formula).toContain('P');
    }
    for (const e of entries) {
      expect(e.formula ?? '', e.id).not.toContain(' · ');
      expect(e.formula ?? '', e.id).not.toMatch(/;(?! \S)/);
    }
    expect(KODEX.find((e) => e.id === 'polovicni')!.formula).toBe('S = A ⊻ B; P = A ∧ B');
  });

  it('úroveň proti hraně, hodinový signál a český název sčítačky', () => {
    const tep = KODEX.find((e) => e.id === 'tep')!.modern;
    expect(tep).toContain('řízený úrovní');
    expect(tep).toContain('řízený hranou');
    expect(tep).toContain('Hodinový signál (hodiny, takt)');
    expect(KODEX.find((e) => e.id === 'soucastka')!.modern).toContain('sčítačka s postupným přenosem');
    expect(actText).toContain('nulují i stopky');
  });
});
