/**
 * Losování obvodů a desek pro Zahradu Bran (Akt III). Stejně jako jinde: úlohy na procvičování
 * a zkoušky se při každém vstupu vylosují znovu, aby se nedaly opsat od souseda.
 */
import { popcount } from '../core/bits';
import type { Rune } from '../core/logic';
import { lampTable, type Circuit, type GateConfig, type GateTask } from '../core/puzzles/gate';
import type { MaskConfig } from '../core/puzzles/mask';
import type { TableConfig, TableTask } from '../core/puzzles/table';
import { int, pick, shuffled, type Rng } from './random';

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

// --- Hlubší síně Zahrady ---

/** Hlas většiny: tři Pouta (dvojice vstupů) a dvě Rozcestí; s prázdnými kameny, nebo hotový. */
export function majority(empty = false): Circuit {
  const two = (rune: Rune): { rune: Rune } | { choices: Rune[] } => (empty ? { choices: ['and', 'or'] } : { rune });
  return {
    inputs: ['A', 'B', 'C'],
    nodes: [
      { id: 'ab', ...two('and'), from: ['A', 'B'], col: 1, row: 0 },
      { id: 'ac', ...two('and'), from: ['A', 'C'], col: 1, row: 1 },
      { id: 'bc', ...two('and'), from: ['B', 'C'], col: 1, row: 2 },
      { id: 'o1', ...two('or'), from: ['ab', 'ac'], col: 2, row: 0.5 },
      { id: 'o2', ...two('or'), from: ['o1', 'bc'], col: 3, row: 1 },
    ],
    output: 'o2',
  };
}

/** Prapečeť: obvody jen z run NAND, vstupy run se nastavují točitými kameny. */
export function nandOnly(kind: 'not' | 'and' | 'or'): GateTask {
  const nand = (id: string, free: string[], col: number, row: number) => ({ id, rune: 'nand' as Rune, from: [], free, col, row });
  if (kind === 'not') {
    return { mode: 'slots', circuit: { inputs: ['A', 'B'], nodes: [nand('n1', ['A', 'B'], 1, 0.5)], output: 'n1' }, target: [1, 1, 0, 0] };
  }
  if (kind === 'and') {
    return {
      mode: 'slots',
      circuit: {
        inputs: ['A', 'B'],
        nodes: [
          { id: 'n1', rune: 'nand', from: ['A', 'B'], col: 1, row: 0.5 },
          nand('n2', ['A', 'B', 'n1'], 2, 0.5),
        ],
        output: 'n2',
      },
      target: [0, 0, 0, 1],
    };
  }
  return {
    mode: 'slots',
    circuit: {
      inputs: ['A', 'B'],
      nodes: [nand('n1', ['A', 'B'], 1, 0), nand('n2', ['A', 'B'], 1, 1), nand('n3', ['n1', 'n2'], 2, 0.5)],
      output: 'n3',
    },
    target: [0, 1, 1, 1],
  };
}

/** Méně je víc: starý obvod Lumenitů a runa, kterou ho jde nahradit. */
const LONG_FORMS: { rune: Rune; circuit: Circuit }[] = [
  {
    rune: 'or',
    circuit: {
      inputs: ['A', 'B'],
      nodes: [
        { id: 'na', rune: 'not', from: ['A'], col: 1, row: 0 },
        { id: 'nb', rune: 'not', from: ['B'], col: 1, row: 1 },
        { id: 'g', rune: 'and', from: ['na', 'nb'], col: 2, row: 0.5 },
        { id: 'o', rune: 'not', from: ['g'], col: 3, row: 0.5 },
      ],
      output: 'o',
    },
  },
  {
    rune: 'and',
    circuit: {
      inputs: ['A', 'B'],
      nodes: [
        { id: 'na', rune: 'not', from: ['A'], col: 1, row: 0 },
        { id: 'nb', rune: 'not', from: ['B'], col: 1, row: 1 },
        { id: 'g', rune: 'or', from: ['na', 'nb'], col: 2, row: 0.5 },
        { id: 'o', rune: 'not', from: ['g'], col: 3, row: 0.5 },
      ],
      output: 'o',
    },
  },
  { rune: 'nand', circuit: branch({ a: 'not', b: 'not', join: 'or' }) },
  { rune: 'nor', circuit: branch({ a: 'not', b: 'not', join: 'and' }) },
  { rune: 'xnor', circuit: chain('xor', 'not') },
  {
    rune: 'xor',
    circuit: {
      inputs: ['A', 'B'],
      nodes: [
        { id: 'o', rune: 'or', from: ['A', 'B'], col: 1, row: 0 },
        { id: 'a', rune: 'and', from: ['A', 'B'], col: 1, row: 1 },
        { id: 'n', rune: 'not', from: ['a'], col: 2, row: 1 },
        { id: 'g', rune: 'and', from: ['o', 'n'], col: 3, row: 0.5 },
      ],
      output: 'g',
    },
  },
];

const ONE_RUNE: Rune[] = ['and', 'or', 'xor', 'nand', 'nor', 'xnor'];

function shorter(form: { rune: Rune; circuit: Circuit }): GateTask {
  return {
    mode: 'slots',
    circuit: { inputs: ['A', 'B'], nodes: [{ id: 'r', choices: ONE_RUNE, from: ['A', 'B'], col: 1, row: 0.5 }], output: 'r' },
    target: tableFrom(form.circuit),
    reference: form.circuit,
  };
}

/** Méně je víc: čtyři různé staré obvody. */
export function genIII14(rng: Rng): GateConfig {
  return { tasks: shuffled(rng, LONG_FORMS).slice(0, 4).map(shorter) };
}

export const lessIsMore = (runes: Rune[]): GateConfig => ({ tasks: runes.map((r) => shorter(LONG_FORMS.find((f) => f.rune === r)!)) });

/** Náhodná oktáva s aspoň daným počtem světel. */
const octave = (rng: Rng, min = 3, max = 6): number => {
  let v = 0;
  do v = int(rng, 1, 254);
  while (popcount(v) < min || popcount(v) > max);
  return v;
};

/** Náhodná podmnožina krystalů masky (aspoň k světel). */
const subsetOf = (rng: Rng, v: number, k: number): number => {
  let s = 0;
  do s = v & int(rng, 1, 255);
  while (popcount(s) < k || s === v);
  return s;
};

/** III-12 Masky: dvakrát vybrat (AND), dvakrát rozsvítit (OR), dvakrát přepnout (XOR). */
export function genIII12(rng: Rng): MaskConfig {
  const a1 = octave(rng, 5, 7);
  const a2 = octave(rng, 4, 6);
  const o1 = octave(rng, 2, 4) & 0x0f;
  const o2 = octave(rng, 2, 3);
  const x1 = octave(rng, 3, 5);
  const x2 = octave(rng, 3, 5);
  const flip = (rng2: Rng) => {
    let f = 0;
    do f = int(rng2, 1, 255);
    while (popcount(f) < 2 || popcount(f) > 4);
    return f;
  };
  const extra = (v: number) => {
    let e = 0;
    do e = int(rng, 1, 255) & ~v & 0xff;
    while (popcount(e) < 2);
    return v | e;
  };
  return {
    bits: 8,
    tasks: [
      { value: a1, op: 'and', target: a1 & 0x0f, say: 'Nech svítit jen pravou čtveřici.' },
      { value: a2, op: 'and', target: subsetOf(rng, a2, 2), say: 'Nech svítit jen ta světla, která žádá oltář.' },
      { value: o1 || 0x05, op: 'or', target: (o1 || 0x05) | 0xf0, say: 'Rozsviť celou levou čtveřici.' },
      { value: o2, op: 'or', target: extra(o2), say: 'Přidej světla, která žádá oltář. Svítící zůstanou.' },
      { value: x1, op: 'xor', target: x1 ^ 0xff, say: 'Převrať všechny krystaly.' },
      { value: x2, op: 'xor', target: x2 ^ flip(rng), say: 'Přepni jen ty krystaly, které se mají změnit.' },
    ],
  };
}

/** Zpráva Lumenitů: ECHO v ASCII. */
const ECHO = [0x45, 0x43, 0x48, 0x4f];

/** III-13 Tajná řeč: zašifrovat E klíčem a pak rozšifrovat E, C, H, O stejným klíčem. */
export function genIII13(rng: Rng): MaskConfig {
  let key = 0;
  do key = int(rng, 1, 255);
  while (popcount(key) < 3 || popcount(key) > 5);
  return secretSpeech(key);
}

export function secretSpeech(key: number): MaskConfig {
  return {
    bits: 8,
    tasks: [
      { value: ECHO[0], op: 'xor', key, encrypt: true, say: 'Zašifruj první písmeno: nastav masku na klíč.' },
      ...ECHO.map((c) => ({ value: c ^ key, op: 'xor' as const, key, say: 'Rozšifruj: stejný klíč vrátí původní písmeno.' })),
    ],
  };
}

/** III-15 (závoj): dvě runy z celé Zahrady, aspoň jedna z nových. */
export function genIII15Identify(rng: Rng): TableConfig {
  const all: Rune[] = ['and', 'or', 'xor', 'nand', 'nor', 'xnor', 'imp'];
  const first = pick(rng, ['xnor', 'imp'] as Rune[]);
  const second = pick(
    rng,
    all.filter((r) => r !== first && r !== 'and' && r !== 'or'),
  );
  const task = (answer: Rune): TableTask => ({ mode: 'identify', circuit: single(answer), choices: all, answer });
  return { tasks: [task(first), task(second)] };
}

/** III-15 (Prapečeť): Pouto, nebo Rozcestí jen z NAND. */
export function genIII15Nand(rng: Rng): GateConfig {
  return { tasks: [nandOnly(pick(rng, ['and', 'or'] as const))] };
}

/** III-15 (maska): jedno vybrání nebo rozsvícení a jedno přepnutí. */
export function genIII15Mask(rng: Rng): MaskConfig {
  const full = genIII12(rng);
  return { bits: 8, tasks: [full.tasks[pick(rng, [1, 3])], full.tasks[5]] };
}
