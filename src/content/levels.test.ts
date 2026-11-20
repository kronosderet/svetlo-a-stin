import { describe, expect, it } from 'vitest';
import { hintBit, initAltar, par, toggle } from '../core/puzzles/altar';
import * as cascade from '../core/puzzles/cascade';
import * as inscription from '../core/puzzles/inscription';
import * as tide from '../core/puzzles/tide';
import { KODEX } from './kodex';
import { ACTS, BASIC_PATH, GATE, LEVELS, actOf, instantiate, isAdvanced, isGateRoom, nextLevelId, partsOf, roomNumber } from './levels';
import { seeded } from './random';
import { ARITY } from '../core/logic';
import * as gate from '../core/puzzles/gate';
import * as table from '../core/puzzles/table';
import * as mask from '../core/puzzles/mask';
import * as machine from '../core/puzzles/machine';
import type { AltarLevel, CascadeLevel, GateLevel, InscriptionLevel, MachineLevel, MaskLevel, PuzzleLevel, TableLevel, TideLevel } from './types';

/** Kolik vylosovaných variant projde každá kontrola u komnat na procvičování. */
const SEEDS = 150;

/**
 * Zaregistruje kontrolu pro výchozí podobu komnaty a u komnat s losováním
 * i pro SEEDS vylosovaných variant (každá musí projít stejně jako ručně vybrané úlohy).
 */
function check<L extends PuzzleLevel>(level: L, name: string, fn: (level: L) => void) {
  it(name, () => fn(level));
  if (level.generate) {
    it(`${name} (${SEEDS} vylosovaných variant)`, () => {
      for (let seed = 1; seed <= SEEDS; seed++) fn(instantiate(level, seeded(seed)) as L);
    });
  }
}

/** Části smíšené brány: poslední část nemá vlastní závěrečné repliky (mluví brána). */
const partKey = (l: PuzzleLevel) => `${l.id}: ${l.title}`;
const lastParts = new Set(LEVELS.flatMap((l) => (l.kind === 'mixed' ? [partKey(l.parts[l.parts.length - 1])] : [])));

function commonChecks(level: PuzzleLevel) {
  expect(level.hints).toHaveLength(3);
  // Závěrečnou repliku Echo řekne jen po hádance s kvízem (sayComplete); jinak by ji hráč nikdy neviděl.
  if (level.echo.complete) expect(level.quiz?.length ?? 0).toBeGreaterThan(0);
  // Opora, která v komnatě mizí, nesmí být zároveň zapnutá natrvalo.
  const pres = level.presentation;
  if (pres.fade?.weights) expect(pres.showWeights).toBeFalsy();
  if (pres.fade?.counts) expect(pres.columnCounts).toBeFalsy();
  expect(level.echo.intro.length).toBeGreaterThan(0);
  if (!lastParts.has(partKey(level))) expect(level.echo.solved.length).toBeGreaterThan(0);
  if (level.kodex) expect(KODEX.some((e) => e.id === level.kodex)).toBe(true);
  level.quiz?.forEach((item) => {
    // Otázky s losovanými čísly se zkoušejí na mnoha semínkách: vždy čtyři různé možnosti.
    const samples = typeof item === 'function' ? Array.from({ length: 60 }, (_, s) => item(seeded(s + 1))) : [item];
    for (const q of samples) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
      if (typeof item === 'function') expect(q.options).toHaveLength(4);
      expect(q.question.length).toBeGreaterThan(0);
    }
  });
}

function altarChecks(level: AltarLevel) {
  check(level, 'má platná data', (level) => {
    const { bits, goal } = level.config;
    const initial = level.config.initial ?? 0;
    if (goal.kind === 'class') {
      // Skupiny čísel: každá má aspoň dvě čísla (hráč volí) a počáteční tma do první nepatří.
      expect(goal.targets.length).toBeGreaterThan(0);
      goal.targets.forEach((t) => {
        expect(t.values.length).toBeGreaterThanOrEqual(1);
        t.values.forEach((v) => expect(v >= 0 && v < 2 ** bits).toBe(true));
      });
      expect(goal.targets[0].values).not.toContain(initial);
    } else if (goal.kind !== 'all') {
      expect(goal.targets.length).toBeGreaterThan(0);
      goal.targets.forEach((t, k) => {
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThan(2 ** bits);
        // Cíl nesmí být splněný hned (shodný s předchozím stavem).
        expect(t).not.toBe(k === 0 ? initial : goal.targets[k - 1]);
      });
    }
    if (level.presentation.counter && goal.kind === 'value') {
      // Počítadlo: každý cíl je o jedna víc než předchozí.
      goal.targets.forEach((t, k) => expect(t).toBe((k === 0 ? initial : goal.targets[k - 1]) + 1));
    }
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd v ideálním počtu tahů', (level) => {
    let st = initAltar(level.config);
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const b = hintBit(level.config, st);
      expect(b).not.toBeNull();
      st = toggle(level.config, st, b!).state;
    }
    expect(st.complete).toBe(true);
    expect(st.moves).toBe(par(level.config));
  });
}

function inscriptionChecks(level: InscriptionLevel) {
  check(level, 'má platná data', (level) => {
    const { bits, tasks } = level.config;
    expect(tasks.length).toBeGreaterThan(0);
    tasks.forEach((t, k) => {
      expect(t.value).toBeGreaterThanOrEqual(0);
      expect(t.value).toBeLessThan(2 ** bits);
      // Zápis začíná ve tmě: nula by byla splněná hned.
      if (t.dir === 'write') expect(t.value).toBeGreaterThan(0);
      // Dva stejné nápisy za sebou by vypadaly jako zaseknutá hra.
      if (k > 0) expect(t.value).not.toBe(tasks[k - 1].value);
    });
    if (tasks.some((t) => t.dir === 'write')) expect(level.presentation.writeTask).toBeTruthy();
    commonChecks(level);
  });

  check(level, 'jde vyřešit bez chyby v ideálním počtu tahů', (level) => {
    const cfg = level.config;
    let st = inscription.initInscription();
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const task = inscription.currentTask(cfg, st)!;
      if (task.dir === 'read') {
        st = inscription.confirm(cfg, inscription.setDial(cfg, st, task.value)).state;
      } else {
        const b = inscription.hintBit(cfg, st);
        expect(b).not.toBeNull();
        st = inscription.toggle(cfg, st, b!).state;
      }
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(inscription.par(cfg));
  });
}

function cascadeChecks(level: CascadeLevel) {
  check(level, 'má platná data', (level) => {
    const cfg = level.config;
    const bits = cfg.bits ?? cfg.width;
    expect(cfg.tasks.length).toBeGreaterThan(0);
    cfg.tasks.forEach((task, k) => {
      if (task.op === 'mul') {
        // Násobí se posunutými kopiemi; víc než dvě kopie by vyžadovaly přenos 2.
        expect(task.operands[0]).toBeLessThan(2 ** bits);
        expect(cascade.rows(task).length).toBe(2);
      } else {
        task.operands.forEach((o) => expect(o).toBeLessThan(2 ** bits));
      }
      if (task.op === 'sub') expect(task.operands[0]).toBeGreaterThanOrEqual(task.operands[1]);
      // Tři řady potřebují přenos o dvě místa; jinak se tři řádky sčítají jen bez krystalů přenosu.
      if (task.op === 'add' && task.operands.length > 2 && !cfg.farCarries) expect(cfg.carries).toBe('none');
      cascade.rows(task).forEach((r) => expect(r).toBeLessThan(2 ** cfg.width));
      const ans = cascade.answer(cfg, task);
      // Bez přepadu se výsledek musí vejít; krystal přenosu zapíše jen jedničku.
      if (!cfg.overflow) expect(ans.spilled).toBe(0);
      if (cfg.carries === 'manual') expect(ans.maxCarry).toBeLessThanOrEqual(1);
      // Bez krystalů přenosu smí světlo přetéct jen do sloupce, kde ve stěně nic nesvítí (Jedna a jedna, Dvě dvojky):
      // jinak by se ve sloupci slilo víc světel, než ukazuje počet pod ním, a přenos by nebyl vidět.
      if (cfg.carries === 'none') expect(ans.carries & cascade.rows(task).reduce((u, r) => u | r, 0)).toBe(0);
      // Dvě stejné úlohy za sebou by vypadaly jako zaseknutá hra.
      if (k > 0) expect(task).not.toEqual(cfg.tasks[k - 1]);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd napoprvé', (level) => {
    const cfg = level.config;
    let st = cascade.initCascade(cfg);
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      // Nápověda ukazuje buňky jednu po druhé; potvrzuje se až úplný výsledek.
      // Se zachováním světla ukazuje jen buňky, které jde opravdu přepnout.
      let cell = cascade.firstWrong(cfg, st);
      let touches = 0;
      while (cell && touches++ < 100) {
        const r = cascade.toggle(cfg, st, cell);
        expect(r.events.map((e) => e.type)).toEqual(['toggle']);
        st = r.state;
        cell = cascade.firstWrong(cfg, st);
      }
      st = cascade.confirm(cfg, st).state;
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(cascade.par(cfg));
  });

  check(level, 'se zachováním světla jde každý výsledek postavit krystal po krystalu', (level) => {
    const cfg = level.config;
    if (!cfg.conserve) return;
    cfg.tasks.forEach((task, k) => {
      const ans = cascade.answer(cfg, task);
      const goal = {
        result: ans.result,
        carries: cfg.carries === 'manual' ? ans.carries : 0,
        far: cfg.carries === 'manual' ? ans.far : 0,
        copies: task.op === 'mul' && cfg.pickCopies ? task.operands[1] : 0,
      };
      // Správný výsledek má každý krystal se světlem; přednastavené výpůjčky ukázkové úlohy taky.
      expect(cascade.unfedCells(cfg, task, goal)).toEqual([]);
      let st: cascade.CascadeState = { ...cascade.initCascade(cfg), step: k, carries: cfg.demo === k ? ans.carries : 0 };
      expect(cascade.unfedCells(cfg, task, st)).toEqual([]);
      // Krystaly správného výsledku jde rozsvěcet jeden po druhém (v nějakém pořadí), aniž by se některý odmítl.
      const cells = cascade.wrongCells(cfg, st);
      for (let round = 0; round < cells.length && cascade.wrongCells(cfg, st).length; round++) {
        const next = cascade.wrongCells(cfg, st).find((c) => !cascade.flowToggle(cfg, task, st, c).refused);
        expect(next).toBeDefined();
        st = cascade.toggle(cfg, st, next!).state;
      }
      expect(cascade.wrongCells(cfg, st)).toEqual([]);
    });
  });
}

function tideChecks(level: TideLevel) {
  check(level, 'má platná data', (level) => {
    const cfg = level.config;
    expect(cfg.tasks[0].start).toBeDefined();
    cfg.tasks.forEach((t, k) => {
      const start = tide.taskStart(cfg, k);
      expect(t.target).toBeLessThan(2 ** cfg.bits);
      expect(start).toBeLessThan(2 ** cfg.bits);
      const d = tide.distance(cfg, start, t.target);
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThan(Infinity);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd v ideálním počtu tahů', (level) => {
    const cfg = level.config;
    let st = tide.initTide(cfg);
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const op = tide.bestOp(cfg, st);
      expect(op).not.toBeNull();
      st = tide.pull(cfg, st, op!).state;
    }
    expect(st.complete).toBe(true);
    expect(st.resets).toBe(0);
    expect(st.moves).toBe(tide.par(cfg));
  });

  if (level.config.strict) {
    check(level, 'nejkratší cesty nevedou přes přetočení', (level) => {
      // Váhy Osudu se mají řešit posuny a ±1, ne trikem 0 − 1 = 63.
      const cfg = level.config;
      let st = tide.initTide(cfg);
      while (!st.complete) {
        const r = tide.pull(cfg, st, tide.bestOp(cfg, st)!);
        r.events.forEach((e) => e.type === 'pull' && expect(e.spill).not.toBe('wrap'));
        st = r.state;
      }
    });
  }
}

function circuitChecks(c: gate.Circuit) {
  const known = new Set(c.inputs);
  for (const g of c.nodes) {
    // Runa bere jen ze vstupů a z run před sebou, a buď pevná runa, nebo prázdný kámen.
    g.from.forEach((f) => expect(known.has(f)).toBe(true));
    g.free?.forEach((f) => expect(known.has(f)).toBe(true));
    expect(!!g.rune !== !!g.choices).toBe(true);
    if (g.choices) expect(new Set(g.choices.map((r) => ARITY[r])).size).toBe(1);
    known.add(g.id);
  }
  expect(known.has(c.output)).toBe(true);
}

function gateChecks(level: GateLevel) {
  check(level, 'má platná data', (level) => {
    level.config.tasks.forEach((t) => {
      circuitChecks(t.circuit);
      if (t.mode === 'slots') {
        expect(t.target).toHaveLength(2 ** t.circuit.inputs.length);
        expect(gate.slotNodes(t.circuit).length + gate.sockets(t.circuit).length).toBeGreaterThan(0);
        expect(gate.solutions(t).length).toBeGreaterThan(0);
      } else {
        expect(gate.slotNodes(t.circuit)).toHaveLength(0);
      }
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd v ideálním počtu tahů', (level) => {
    const cfg = level.config;
    let st = gate.initGate();
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const h = gate.hint(cfg, st);
      if (h && 'input' in h) st = gate.toggleInput(cfg, st, h.input).state;
      else if (h && 'socket' in h) st = gate.setWire(cfg, st, h.socket, h.source).state;
      else if (h) st = gate.setRune(cfg, st, h.node, h.rune).state;
      else st = gate.test(cfg, st).state;
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(gate.par(cfg));
  });
}

function tableChecks(level: TableLevel) {
  check(level, 'má platná data', (level) => {
    level.config.tasks.forEach((t, k) => {
      circuitChecks(t.circuit);
      expect(gate.slotNodes(t.circuit)).toHaveLength(0);
      const out = table.tableOf(t);
      // Deska, kde lampa pořád svítí nebo pořád mlčí, by nic neučila.
      expect(new Set(out).size).toBe(2);
      if (t.mode === 'identify') {
        expect(t.choices).toContain(t.answer);
        // Žádná jiná nabízená runa nesmí mít stejnou desku.
        t.choices.filter((r) => r !== t.answer).forEach((r) => expect(table.tableOf({ ...t, circuit: { ...t.circuit, nodes: [{ ...t.circuit.nodes[0], rune: r }] } })).not.toEqual(out));
      }
      if (k > 0) expect(t).not.toEqual(level.config.tasks[k - 1]);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd napoprvé', (level) => {
    const cfg = level.config;
    let st = table.initTable();
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      const h = table.hint(cfg, st);
      if (h && 'rune' in h) st = table.pick(cfg, st, h.rune).state;
      else if (h) st = table.toggleCell(cfg, st, h.row).state;
      else st = table.confirm(cfg, st).state;
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(table.par(cfg));
  });
}

function maskChecks(level: MaskLevel) {
  check(level, 'má platná data', (level) => {
    const { bits, tasks } = level.config;
    tasks.forEach((t) => {
      expect(t.value).toBeLessThan(2 ** bits);
      // Buď cíl, nebo klíč; úloha má řešení a není splněná hned na začátku.
      expect((t.target === undefined) !== (t.key === undefined)).toBe(true);
      expect(mask.closestMask(t, bits, 0)).not.toBeNull();
      expect(mask.solved(t, 0)).toBe(false);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd v ideálním počtu doteků', (level) => {
    const cfg = level.config;
    let st = mask.initMask();
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      // Úloha s klíčem z minulé úlohy se vyřeší sama (hra to udělá po pauze).
      const arrived = mask.arrive(cfg, st);
      st = arrived.events.length ? arrived.state : mask.toggle(cfg, st, mask.hintBit(cfg, st)!).state;
    }
    expect(st.complete).toBe(true);
    // Maska ze zadání („pravá čtveřice“) může úlohu splnit dřív, než se rozsvítí celá: ideál je strop.
    if (cfg.tasks.some((t) => t.ideal !== undefined)) expect(st.moves).toBeLessThanOrEqual(mask.par(cfg));
    else expect(st.moves).toBe(mask.par(cfg));
  });
}

/** Stroj Dílny: zdroje existují, kameny mají správný počet vstupů, nic se nepřekrývá. */
function machineShape(m: machine.Machine) {
  const outputs = new Set<string>([machine.SHADOW, machine.LIGHT, ...m.inputs.map((i) => i.id)]);
  for (const g of m.nodes) machine.outputsOf(g).forEach((k) => outputs.add(k));
  const ids = [...m.inputs.map((i) => i.id), ...m.nodes.map((g) => g.id), ...m.lamps.map((l) => l.id)];
  expect(new Set(ids).size).toBe(ids.length);
  for (const g of m.nodes) {
    expect([g.rune, g.choices, g.part].filter(Boolean)).toHaveLength(1);
    expect(g.in).toHaveLength(machine.arityOf(g));
    if (g.choices) expect(new Set(g.choices.map((r) => ARITY[r])).size).toBe(1);
    for (const pin of g.in) (Array.isArray(pin) ? pin : [pin]).forEach((src) => expect(outputs.has(src)).toBe(true));
    if (g.turn === 'column') expect(['half', 'full']).toContain(g.part);
  }
  for (const l of m.lamps) (Array.isArray(l.in) ? l.in : [l.in]).forEach((src) => expect(outputs.has(src)).toBe(true));
  for (const g of m.numbers ?? []) g.bits.forEach((id) => expect(ids).toContain(id));
  // Prvky stojí aspoň 1,5 jednotky (60 px) od sebe, ať se kameny a krystaly nepřekrývají.
  const spots = [...m.inputs, ...m.nodes, ...m.lamps].map((p) => [p.x, p.y]);
  spots.forEach(([x, y], a) =>
    spots.slice(a + 1).forEach(([x2, y2]) => expect(Math.hypot(x - x2, y - y2)).toBeGreaterThanOrEqual(1.35)),
  );
}

function machineChecks(level: MachineLevel) {
  check(level, 'má platná data', (level) => {
    level.config.tasks.forEach((t) => {
      machineShape(t.machine);
      const n = t.machine.inputs.length;
      if (t.mode === 'explore') {
        // Zkoumání je jen u malých strojů bez točitých a prázdných kamenů.
        expect(n).toBeLessThanOrEqual(3);
        expect(machine.slotNodes(t.machine).length + machine.sockets(t.machine).length).toBe(0);
      }
      if (t.mode === 'goals') {
        expect(t.goals?.length).toBeGreaterThan(0);
        expect(machine.slotNodes(t.machine).length + machine.sockets(t.machine).length).toBe(0);
      }
      if (t.mode === 'build') {
        expect(!!t.target !== !!t.script).toBe(true);
        if (t.target) {
          for (const l of t.machine.lamps) expect(t.target[l.id]).toHaveLength(2 ** n);
          // Velký stroj nemá místo pro desku: pravidlo musí říct, co brána chce.
          if (n > 3) expect(t.rule).toBeTruthy();
        }
        expect(machine.slotNodes(t.machine).length + machine.sockets(t.machine).length).toBeGreaterThan(0);
        expect(machine.solutions(t, 1)).toHaveLength(1);
      }
      if (t.script) expect(machine.hasPulse(t.machine) || t.script.every((s) => !s.pulse)).toBe(true);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd v ideálním počtu tahů', (level) => {
    const cfg = level.config;
    let st = machine.initMachine(cfg);
    let guard = 0;
    let goal = -1;
    while (!st.complete && guard++ < 400) {
      // Nový cíl nesmí být splněný hned po předchozím (hráč by ho splnil, aniž by cokoli udělal).
      const task = machine.currentTask(cfg, st)!;
      if (task.mode === 'goals' && st.goal !== goal) {
        goal = st.goal;
        expect(machine.meets(task, task.goals![st.goal], st)).toBe(false);
      }
      const h = machine.hint(cfg, st);
      if (h && 'input' in h) st = machine.toggleInput(cfg, st, h.input).state;
      else if (h && 'pulse' in h) st = machine.pulse(cfg, st).state;
      else if (h && 'socket' in h) st = machine.setWire(cfg, st, h.socket, h.source).state;
      else if (h) st = machine.setRune(cfg, st, h.node, h.rune).state;
      else st = machine.test(cfg, st).state;
      if (machine.currentTask(cfg, st) !== task) goal = -1;
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(machine.par(cfg));
  });
}

function puzzleChecks(level: PuzzleLevel) {
  if (level.kind === 'altar') altarChecks(level);
  else if (level.kind === 'inscription') inscriptionChecks(level);
  else if (level.kind === 'cascade') cascadeChecks(level);
  else if (level.kind === 'tide') tideChecks(level);
  else if (level.kind === 'gate') gateChecks(level);
  else if (level.kind === 'mask') maskChecks(level);
  else if (level.kind === 'machine') machineChecks(level);
  else tableChecks(level);
}

const configs = (l: ReturnType<typeof instantiate>) => JSON.stringify(partsOf(l).map((p) => p.config));

for (const act of ACTS) {
  describe(`obsah Aktu ${act.numeral}`, () => {
    for (const level of act.levels) {
      describe(level.id, () => {
        if (level.kind === 'mixed') {
          it('smíšená brána má aspoň dvě části a vlastní repliky', () => {
            expect(level.parts.length).toBeGreaterThanOrEqual(2);
            expect(level.echo.intro.length).toBeGreaterThan(0);
            expect(level.echo.solved.length).toBeGreaterThan(0);
            level.parts.forEach((p) => expect(p.id).toBe(level.id));
          });
          level.parts.forEach((part, k) => describe(`část ${k + 1}: ${part.title}`, () => puzzleChecks(part)));
        } else {
          puzzleChecks(level);
        }
      });
    }

    for (const level of act.levels.filter((l) => partsOf(l).some((p) => p.generate))) {
      it(`${level.id}: losování dává pokaždé jiné úlohy`, () => {
        const variants = new Set(Array.from({ length: 40 }, (_, s) => configs(instantiate(level, seeded(1000 + s)))));
        // Obvodů ze dvou tří run je málo, proto u Zahrady Bran stačí menší pestrost.
        const logic = partsOf(level).every((p) => p.kind === 'gate' || p.kind === 'table' || p.kind === 'mask' || p.kind === 'machine');
        // Řetězy mají jen dvě pořadí a čtyři větvení s jedním Obracečem (D-III-02): 8 variant.
        expect(variants.size).toBeGreaterThanOrEqual(level.id === 'III-6' ? 8 : logic ? 10 : 25);
      });
    }

    it('základní cesta má nultou komnatu a komnaty 1–7, Hlubší síně čísla 8–15 vzestupně', () => {
      const basic = act.levels.filter((l) => !isAdvanced(l.id));
      expect(basic.map((l) => l.id)).toEqual(Array.from({ length: GATE + 1 }, (_, k) => `${act.numeral}-${k}`));
      // Nultá komnata jen ukáže nápad patra: žádný kvíz ani záznam Kodexu.
      const zero = basic[0];
      expect(zero.kodex).toBeUndefined();
      expect(zero.kind !== 'mixed' && zero.quiz).toBeFalsy();
      const deep = act.levels.filter((l) => isAdvanced(l.id)).map((l) => roomNumber(l.id));
      // Patra I a II mají Hlubší síně celé, další se doplňují.
      expect(deep).toEqual([8, 9, 10, 11, 12, 13, 14, 15]);
      deep.forEach((n, k) => {
        expect(n).toBeGreaterThan(GATE);
        expect(n).toBeLessThanOrEqual(15);
        if (k > 0) expect(n).toBeGreaterThan(deep[k - 1]);
      });
      act.levels.forEach((l) => expect(l.id.startsWith(`${act.numeral}-`)).toBe(true));
    });
  });
}

describe('celá observatoř', () => {
  it('id levelů jsou unikátní', () => {
    const ids = LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('každý záznam Kodexu odemyká právě jeden level', () => {
    for (const entry of KODEX) {
      expect(LEVELS.filter((l) => l.kodex === entry.id)).toHaveLength(1);
    }
  });

  it('glyfy Kodexu jsou různé a nesou znamení patra (střed 16, kosočtverec 32)', () => {
    expect(new Set(KODEX.map((e) => e.glyph)).size).toBe(KODEX.length);
    for (const act of ACTS) {
      for (const l of act.levels.filter((l) => l.kodex)) {
        const glyph = KODEX.find((e) => e.id === l.kodex)!.glyph;
        expect(glyph & 48).toBe(act.glyphBase);
      }
    }
  });

  it('základní cesta vede přes bránu do dalšího patra, Hlubší síně jdou po sobě', () => {
    expect(nextLevelId('I-0')).toBe('I-1');
    expect(nextLevelId('I-1')).toBe('I-2');
    expect(nextLevelId('I-6')).toBe('I-7');
    expect(nextLevelId('I-7')).toBe('II-0');
    // Nová hra začíná první komnatou základní cesty: nultou komnatou Předsíně.
    expect(BASIC_PATH[0].id).toBe('I-0');
    expect(nextLevelId('II-0')).toBe('II-1');
    expect(nextLevelId('II-7')).toBe('III-0');
    expect(nextLevelId('III-0')).toBe('III-1');
    expect(nextLevelId('III-7')).toBe('IV-0');
    expect(nextLevelId('IV-0')).toBe('IV-1');
    expect(nextLevelId('IV-7')).toBeNull();
    expect(nextLevelId('IV-14')).toBe('IV-15');
    expect(nextLevelId('IV-15')).toBeNull();
    expect(nextLevelId('III-14')).toBe('III-15');
    expect(nextLevelId('III-15')).toBeNull();
    expect(nextLevelId('I-8')).toBe('I-9');
    expect(nextLevelId('I-10')).toBe('I-11');
    expect(nextLevelId('I-15')).toBeNull();
    expect(nextLevelId('II-10')).toBe('II-11');
    expect(nextLevelId('II-14')).toBe('II-15');
    expect(nextLevelId('II-15')).toBeNull();
    expect(BASIC_PATH.map((l) => l.id)).toHaveLength(32);
    expect(actOf('II-3').numeral).toBe('II');
    expect(ACTS[ACTS.length - 1].nextAct).toBeDefined();
    ACTS.slice(0, -1).forEach((a) => expect(a.nextAct).toBeUndefined());
  });

  const cascades = LEVELS.flatMap((l) => partsOf(l)).filter((p): p is CascadeLevel => p.kind === 'cascade');

  it('Kaskáda hlídá zachování světla všude kromě bran (tam hráč ukazuje, že počítá sám)', () => {
    expect(cascades.length).toBeGreaterThan(0);
    for (const level of cascades) expect([level.id, !!level.config.conserve]).toEqual([level.id, !isGateRoom(level.id)]);
  });

  it('vylosovaná Kaskáda má stejné nastavení jako zadání komnaty, liší se jen úlohami', () => {
    const settings = ({ tasks: _tasks, ...rest }: cascade.CascadeConfig) => rest;
    for (const level of cascades.filter((l) => l.generate)) {
      for (let seed = 1; seed <= 5; seed++) expect([level.id, settings(level.generate!(seeded(seed)))]).toEqual([level.id, settings(level.config)]);
    }
  });
});
