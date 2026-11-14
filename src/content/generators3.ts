/**
 * Losování obvodů a desek pro Zahradu Bran (Akt III). Stejně jako jinde: úlohy na procvičování
 * a zkoušky se při každém vstupu vylosují znovu, aby se nedaly opsat od souseda.
 */
import type { Rune } from '../core/logic';
import { lampTable, type Circuit, type GateConfig, type GateTask } from '../core/puzzles/gate';
import type { TableConfig, TableTask } from '../core/puzzles/table';
import { pick, shuffled, type Rng } from './random';

const TWO: Rune[] = ['and', 'or', 'xor'];
const ONE: Rune[] = ['id', 'not'];

/** Jediná runa mezi dvěma vstupy a lampou. */
export function single(rune: Rune): Circuit {
  return { inputs: ['A', 'B'], nodes: [{ id: 'r', rune, from: ['A', 'B'], col: 1, row: 0.5 }], output: 'r' };
}

/** Řetěz: runa se dvěma vstupy a za ní runa s jedním (pevné runy, nebo prázdné kameny). */
export function chain(first?: Rune, second?: Rune): Circuit {
  return {
    inputs: ['A', 'B'],
    nodes: [
      { id: 'g1', ...(first ? { rune: first } : { choices: TWO }), from: ['A', 'B'], col: 1, row: 0.5 },
      { id: 'g2', ...(second ? { rune: second } : { choices: ONE }), from: ['g1'], col: 2, row: 0.5 },
    ],
    output: 'g2',
  };
}

/** Větve: každý vstup projde svou runou (Průchod / Obraceč) a obě se slijí ve třetí. */
export function branch(fixed?: { a: Rune; b: Rune; join: Rune }): Circuit {
  return {
    inputs: ['A', 'B'],
    nodes: [
      { id: 'na', ...(fixed ? { rune: fixed.a } : { choices: ONE }), from: ['A'], col: 1, row: 0 },
      { id: 'nb', ...(fixed ? { rune: fixed.b } : { choices: ONE }), from: ['B'], col: 1, row: 1 },
      { id: 'g', ...(fixed ? { rune: fixed.join } : { choices: TWO }), from: ['na', 'nb'], col: 2, row: 0.5 },
    ],
    output: 'g',
  };
}

const tableFrom = (c: Circuit): number[] => lampTable(c).map((v) => v ?? 0);

/** Úloha s prázdnými kameny, jejíž cíl je deska daného pevného obvodu. */
function slotsLike(empty: Circuit, solved: Circuit): GateTask {
  return { circuit: empty, mode: 'slots', target: tableFrom(solved) };
}

/** Náhodné větvení s aspoň jedním Obracečem, spojené Poutem nebo Rozcestím. */
function randomBranch(rng: Rng): { a: Rune; b: Rune; join: Rune } {
  const [a, b] = pick(rng, [
    ['not', 'id'],
    ['id', 'not'],
    ['not', 'not'],
  ] as [Rune, Rune][]);
  return { a, b, join: pick(rng, ['and', 'or'] as Rune[]) };
}

/** III-5: tři desky k poznání (každá runa jednou) a dvě k vyplnění. */
export function genIII5(rng: Rng): TableConfig {
  const veiled = shuffled(rng, TWO);
  const fills = [pick(rng, TWO), pick(rng, TWO)];
  const identify = (rune: Rune): TableTask => ({ mode: 'identify', circuit: single(rune), choices: TWO, answer: rune });
  const fill = (rune: Rune): TableTask => ({ mode: 'fill', circuit: single(rune) });
  return { tasks: [identify(veiled[0]), fill(fills[0]), identify(veiled[1]), fill(fills[1]), identify(veiled[2])] };
}

/** III-6: Zlomené pouto, Zavřené rozcestí, jeden další řetěz a jedno větvení. */
export function genIII6(rng: Rng): GateConfig {
  const third = pick(rng, [
    ['xor', 'not'],
    ['and', 'id'],
    ['or', 'id'],
  ] as [Rune, Rune][]);
  return {
    tasks: [
      slotsLike(chain(), chain('and', 'not')),
      slotsLike(chain(), chain('or', 'not')),
      slotsLike(chain(), chain(...third)),
      slotsLike(branch(), branch(randomBranch(rng))),
    ],
  };
}

/** III-7 (deska): vyplnit desku pro řetěz s Obracečem a pro větvení. */
export function genIII7Fill(rng: Rng): TableConfig {
  const first = pick(rng, TWO);
  return { tasks: [{ mode: 'fill', circuit: chain(first, 'not') }, { mode: 'fill', circuit: branch(randomBranch(rng)) }] };
}

/** III-7 (kameny): dva řetězy a jedno větvení. */
export function genIII7Gate(rng: Rng): GateConfig {
  const firsts = shuffled(rng, TWO).slice(0, 2);
  return {
    tasks: [
      slotsLike(chain(), chain(firsts[0], pick(rng, ONE))),
      slotsLike(branch(), branch(randomBranch(rng))),
      slotsLike(chain(), chain(firsts[1], 'not')),
    ],
  };
}

/** III-7 (závoj): dvě různé runy z pěti. */
export function genIII7Identify(rng: Rng): TableConfig {
  const all: Rune[] = ['and', 'or', 'xor', 'nand', 'nor'];
  const [x, y] = shuffled(rng, all);
  const task = (answer: Rune): TableTask => ({ mode: 'identify', circuit: single(answer), choices: all, answer });
  return { tasks: [task(x), task(y)] };
}
