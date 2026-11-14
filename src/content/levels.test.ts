import { describe, expect, it } from 'vitest';
import { hintBit, initAltar, par, toggle } from '../core/puzzles/altar';
import * as cascade from '../core/puzzles/cascade';
import * as inscription from '../core/puzzles/inscription';
import * as tide from '../core/puzzles/tide';
import { KODEX } from './kodex';
import { ACTS, LEVELS, actOf, instantiate, nextLevelId } from './levels';
import { seeded } from './random';
import type { AltarLevel, CascadeLevel, InscriptionLevel, LevelDef, TideLevel } from './types';

/** Kolik vylosovaných variant projde každá kontrola u komnat na procvičování. */
const SEEDS = 150;

/**
 * Zaregistruje kontrolu pro výchozí podobu komnaty a u komnat s losováním
 * i pro SEEDS vylosovaných variant (každá musí projít stejně jako ručně vybrané úlohy).
 */
function check<L extends LevelDef>(level: L, name: string, fn: (level: L) => void) {
  it(name, () => fn(level));
  if (level.generate) {
    it(`${name} (${SEEDS} vylosovaných variant)`, () => {
      for (let seed = 1; seed <= SEEDS; seed++) fn(instantiate(level, seeded(seed)) as L);
    });
  }
}

function commonChecks(level: LevelDef) {
  expect(level.hints).toHaveLength(3);
  expect(level.echo.intro.length).toBeGreaterThan(0);
  expect(level.echo.solved.length).toBeGreaterThan(0);
  if (level.kodex) expect(KODEX.some((e) => e.id === level.kodex)).toBe(true);
  level.quiz?.forEach((q) => {
    expect(q.correct).toBeGreaterThanOrEqual(0);
    expect(q.correct).toBeLessThan(q.options.length);
    expect(new Set(q.options).size).toBe(q.options.length);
  });
}

function altarChecks(level: AltarLevel) {
  check(level, 'má platná data', (level) => {
    const { bits, goal } = level.config;
    const initial = level.config.initial ?? 0;
    if (goal.kind !== 'all') {
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
      if (task.op === 'add' && task.operands.length > 2) expect(cfg.carries).toBe('none');
      cascade.rows(task).forEach((r) => expect(r).toBeLessThan(2 ** cfg.width));
      const ans = cascade.answer(cfg, task);
      // Bez přepadu se výsledek musí vejít; krystal přenosu zapíše jen jedničku.
      if (!cfg.overflow) expect(ans.spilled).toBe(0);
      if (cfg.carries === 'manual') expect(ans.maxCarry).toBeLessThanOrEqual(1);
      // Úrovně bez krystalů přenosu nesmí přenos potřebovat (kromě Soutoku, kde přetéká rovnou do výsledku).
      if (cfg.carries === 'none' && cfg.width === bits) expect(ans.carries).toBe(0);
      // Dvě stejné úlohy za sebou by vypadaly jako zaseknutá hra.
      if (k > 0) expect(task).not.toEqual(cfg.tasks[k - 1]);
    });
    commonChecks(level);
  });

  check(level, 'jde vyřešit podle nápověd napoprvé', (level) => {
    const cfg = level.config;
    let st = cascade.initCascade();
    let guard = 0;
    while (!st.complete && guard++ < 300) {
      // Nápověda ukazuje buňky jednu po druhé; potvrzuje se až úplný výsledek.
      let cell = cascade.firstWrong(cfg, st);
      while (cell) {
        st = cascade.toggle(cfg, st, cell).state;
        cell = cascade.firstWrong(cfg, st);
      }
      st = cascade.confirm(cfg, st).state;
    }
    expect(st.complete).toBe(true);
    expect(st.mistakes).toBe(0);
    expect(st.moves).toBe(cascade.par(cfg));
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

for (const act of ACTS) {
  describe(`obsah Aktu ${act.numeral}`, () => {
    for (const level of act.levels) {
      describe(level.id, () => {
        if (level.kind === 'altar') altarChecks(level);
        else if (level.kind === 'inscription') inscriptionChecks(level);
        else if (level.kind === 'cascade') cascadeChecks(level);
        else tideChecks(level);
      });
    }

    for (const level of act.levels.filter((l) => l.generate)) {
      it(`${level.id}: losování dává pokaždé jiné úlohy`, () => {
        const variants = new Set(Array.from({ length: 40 }, (_, s) => JSON.stringify(instantiate(level, seeded(1000 + s)).config)));
        expect(variants.size).toBeGreaterThanOrEqual(25);
      });
    }

    it('má deset komnat s id podle čísla aktu', () => {
      expect(act.levels).toHaveLength(10);
      act.levels.forEach((l, k) => expect(l.id).toBe(`${act.numeral}-${k + 1}`));
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

  it('glyfy Kodexu jsou různé a Síň Počtářů má rozsvícený střed', () => {
    expect(new Set(KODEX.map((e) => e.glyph)).size).toBe(KODEX.length);
    for (const act of ACTS) {
      for (const l of act.levels) {
        const glyph = KODEX.find((e) => e.id === l.kodex)!.glyph;
        expect(glyph >= 16).toBe(act.glyphBase === 16);
      }
    }
  });

  it('levely na sebe navazují i přes hranici aktů', () => {
    expect(nextLevelId('I-1')).toBe('I-2');
    expect(nextLevelId('I-10')).toBe('II-1');
    expect(nextLevelId('II-10')).toBeNull();
    expect(actOf('II-3').numeral).toBe('II');
    expect(ACTS[ACTS.length - 1].nextAct).toBeDefined();
    ACTS.slice(0, -1).forEach((a) => expect(a.nextAct).toBeUndefined());
  });
});
