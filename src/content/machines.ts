/**
 * Stroje Hlubiny Strojů (Akt IV): rozložení run, součástek a lamp na desce Dílny.
 * Souřadnice jsou v jednotkách mřížky desky (40 px). Každý stroj má i svou desku zákona,
 * kterou spočítá z pravidla, takže obsah nemusí vypisovat tabulky ručně.
 */
import type { Rune } from '../core/logic';
import {
  LIGHT,
  SHADOW,
  bitsOf,
  numberOf,
  targetFrom,
  type Machine,
  type MachineInput,
  type MachineLamp,
  type MachineNode,
  type MachineTask,
  type Pin,
  type ScriptStep,
} from '../core/puzzles/machine';

/** Kámen s runou: pevná runa, nebo prázdný kámen s nabídkou. */
const stone = (rune: Rune | Rune[]): Pick<MachineNode, 'rune' | 'choices'> => (Array.isArray(rune) ? { choices: rune } : { rune });

/* ───────────── sčítačky ───────────── */

/** Poloviční sčítačka z run: nahoře přenos (lampa 2), dole spodní číslice (lampa 1). */
export function halfAdder(carry: Rune | Rune[] = 'and', sum: Rune | Rune[] = 'xor'): Machine {
  return {
    inputs: [
      { id: 'A', x: 0, y: 0.6 },
      { id: 'B', x: 0, y: 4.4 },
    ],
    nodes: [
      { id: 'c', ...stone(carry), in: ['A', 'B'], x: 5, y: 0.6 },
      { id: 's', ...stone(sum), in: ['A', 'B'], x: 5, y: 4.4 },
    ],
    lamps: [
      { id: 'l2', label: '2', in: 'c', x: 9, y: 6.8, from: 'top' },
      { id: 'l1', label: '1', in: 's', x: 10.8, y: 6.8, from: 'top' },
    ],
    numbers: [{ label: 'A + B', bits: ['l2', 'l1'] }],
  };
}

export const halfTarget = (m: Machine) => targetFrom(m, (v) => bitsOf(v('A') + v('B'), ['l2', 'l1']));

/** Úplná sčítačka z run: dvě Výluky, dvě Pouta a Rozcestí. Prázdné kameny podle slots. */
export function fullAdder(slots: Partial<Record<'x1' | 's' | 'c1' | 'c2' | 'c', Rune[]>> = {}): Machine {
  const r = (id: 'x1' | 's' | 'c1' | 'c2' | 'c', rune: Rune) => stone(slots[id] ?? rune);
  return {
    inputs: [
      { id: 'A', x: 0, y: 0.6 },
      { id: 'B', x: 0, y: 3.2 },
      { id: 'P', x: 0, y: 7.2 },
    ],
    nodes: [
      { id: 'c1', ...r('c1', 'and'), in: ['A', 'B'], x: 4.4, y: 0.6 },
      { id: 'x1', ...r('x1', 'xor'), in: ['A', 'B'], x: 4.4, y: 3.6 },
      { id: 'c2', ...r('c2', 'and'), in: ['x1', 'P'], x: 8.6, y: 4.8 },
      { id: 's', ...r('s', 'xor'), in: ['x1', 'P'], x: 8.6, y: 7.6 },
      { id: 'c', ...r('c', 'or'), in: ['c1', 'c2'], x: 12.4, y: 2.4 },
    ],
    lamps: [
      { id: 'l2', label: '2', in: 'c', x: 15, y: 9.8, from: 'top' },
      { id: 'l1', label: '1', in: 's', x: 16.8, y: 9.8, from: 'top' },
    ],
    numbers: [{ label: 'A + B + P', bits: ['l2', 'l1'] }],
  };
}

export const fullTarget = (m: Machine) => targetFrom(m, (v) => bitsOf(v('A') + v('B') + v('P'), ['l2', 'l1']));

/**
 * Řetěz úplných sčítaček jako sloupce Kaskády: nad každou sčítačkou krystaly A a B, přenos teče
 * zprava doleva, pod ní lampa součtu. carry: přenos do sloupce k (k = 0 je nejlehčí sloupec vpravo).
 */
export function adderChain(bits: number, carry: (k: number) => Pin = (k) => (k === 0 ? SHADOW : `fa${k - 1}.P`)): Machine {
  const col = (k: number) => 3.8 * (bits - k);
  const inputs: MachineInput[] = [];
  for (let k = bits - 1; k >= 0; k--)
    inputs.push({
      id: `A${k}`,
      label: 'A',
      x: col(k) - 0.7,
      y: 0,
      out: 'down',
    });
  for (let k = bits - 1; k >= 0; k--)
    inputs.push({
      id: `B${k}`,
      label: 'B',
      x: col(k) + 0.7,
      y: 0,
      out: 'down',
    });
  const nodes: MachineNode[] = Array.from({ length: bits }, (_, k) => ({
    id: `fa${k}`,
    part: 'full' as const,
    in: [`A${k}`, `B${k}`, carry(k)],
    x: col(k),
    y: 3.5,
    turn: 'column' as const,
  }));
  const lamps: MachineLamp[] = [
    {
      id: `S${bits}`,
      label: String(2 ** bits),
      in: `fa${bits - 1}.P`,
      x: col(bits) + 0.6,
      y: 7,
      from: 'top',
    },
    ...Array.from({ length: bits }, (_, j) => {
      const k = bits - 1 - j;
      return {
        id: `S${k}`,
        label: String(2 ** k),
        in: `fa${k}.S`,
        x: col(k),
        y: 7,
        from: 'top' as const,
      };
    }),
  ];
  const ids = (p: string, n: number) => Array.from({ length: n }, (_, j) => `${p}${n - 1 - j}`);
  return {
    inputs,
    nodes,
    lamps,
    numbers: [
      { label: 'A', bits: ids('A', bits) },
      { label: 'B', bits: ids('B', bits) },
      { label: 'součet', bits: ids('S', bits + 1) },
    ],
  };
}

const ids = (p: string, n: number) => Array.from({ length: n }, (_, j) => `${p}${n - 1 - j}`);

/** Deska řetězu: lampy ukazují A + B (+ extra). */
export function chainTarget(m: Machine, bits: number, extra = 0) {
  return targetFrom(m, (v) => bitsOf(numberOf(v, ids('A', bits)) + numberOf(v, ids('B', bits)) + extra, ids('S', bits + 1)));
}

/** Úloha: dosaď přenosy do řetězu sčítaček (točité kameny na vstupech přenosu). */
export function chainTask(bits: number, extra = 0): MachineTask {
  const carry = (k: number): Pin => (k === 0 ? [SHADOW, LIGHT] : [SHADOW, LIGHT, `fa${k - 1}.P`]);
  const machine = adderChain(bits, carry);
  return {
    mode: 'build',
    machine,
    target: chainTarget(machine, bits, extra),
    rule: extra ? `Lampy mají ukázat součet A + B + ${extra}.` : 'Lampy mají ukázat součet A + B.',
  };
}

/* ───────────── porovnávač ───────────── */

/** Porovnávač jednoho krystalu: jediný kámen mezi A, B a lampou. */
export function compare1(choices: Rune[]): Machine {
  return {
    inputs: [
      { id: 'A', x: 0, y: 0.6 },
      { id: 'B', x: 0, y: 3.4 },
    ],
    nodes: [{ id: 'e', choices, in: ['A', 'B'], x: 4.6, y: 2 }],
    lamps: [{ id: 'eq', label: 'stejné', in: 'e', x: 8.4, y: 2 }],
  };
}

/** Porovnávač dvou dvoubitových čísel: kámen pro každý sloupec a kámen, který je spojí. */
export function compare2(bitChoices: Rune[], joinChoices: Rune[], lamp: 'stejné' | 'různé' = 'stejné'): Machine {
  return {
    inputs: [
      { id: 'A1', label: 'A', x: 0, y: 0 },
      { id: 'A0', label: 'A', x: 0, y: 5 },
      { id: 'B1', label: 'B', x: 0, y: 2.3 },
      { id: 'B0', label: 'B', x: 0, y: 7.3 },
    ],
    nodes: [
      { id: 'e1', choices: bitChoices, in: ['A1', 'B1'], x: 4.6, y: 1.15 },
      { id: 'e0', choices: bitChoices, in: ['A0', 'B0'], x: 4.6, y: 6.15 },
      { id: 'j', choices: joinChoices, in: ['e1', 'e0'], x: 8.8, y: 3.65 },
    ],
    lamps: [{ id: 'eq', label: lamp, in: 'j', x: 12.4, y: 3.65 }],
    numbers: [
      { label: 'A', bits: ['A1', 'A0'] },
      { label: 'B', bits: ['B1', 'B0'] },
    ],
  };
}

export function compareTarget(m: Machine, bits: 1 | 2, same = true) {
  const a = bits === 1 ? ['A'] : ['A1', 'A0'];
  const b = bits === 1 ? ['B'] : ['B1', 'B0'];
  return targetFrom(m, (v) => ({
    eq: (numberOf(v, a) === numberOf(v, b)) === same ? 1 : 0,
  }));
}

/* ───────────── výhybka ───────────── */

/**
 * Výhybka z run: Obraceč na voliči, dvě Pouta a Rozcestí. pins: odkud bere volič horní a dolní
 * Pouto (pevně, nebo točitý kámen), join: runa, která obě cesty spojí.
 */
export function mux(top: Pin = 'nv', bottom: Pin = 'V', join: Rune | Rune[] = 'or'): Machine {
  return {
    inputs: [
      { id: 'A', x: 0, y: 0.6 },
      { id: 'B', x: 0, y: 3.4 },
      { id: 'V', x: 0, y: 6.6 },
    ],
    nodes: [
      { id: 'nv', rune: 'not', in: ['V'], x: 3.8, y: 8.8 },
      { id: 'g1', rune: 'and', in: ['A', top], x: 7.6, y: 1.2 },
      { id: 'g2', rune: 'and', in: ['B', bottom], x: 7.6, y: 4.4 },
      { id: 'j', ...stone(join), in: ['g1', 'g2'], x: 11.2, y: 2.8 },
    ],
    lamps: [{ id: 'q', label: 'lampa', in: 'j', x: 14.6, y: 2.8 }],
  };
}

/** Deska výhybky: ve stínu voliče lampa ukazuje A, ve světle B (swap = naopak). */
export const muxTarget = (m: Machine, swap = false) => targetFrom(m, (v) => ({ q: (v('V') ? !swap : swap) ? v('B') : v('A') }));

/* ───────────── rozdělovač ───────────── */

/**
 * Rozdělovač: dvoubitové číslo rozsvítí právě jednu ze čtyř lamp. order = čísla lamp shora dolů,
 * open = pořadí Pout (shora), která mají točité kameny místo pevných vodičů.
 */
export function decoder(order: number[] = [0, 1, 2, 3], open: number[] = [0, 1, 2, 3]): Machine {
  const ys = [0.4, 2.9, 5.4, 7.9];
  const nodes: MachineNode[] = [
    { id: 'n1', rune: 'not', in: ['A1'], x: 3.4, y: 2.4 },
    { id: 'n0', rune: 'not', in: ['A0'], x: 3.4, y: 7.6 },
  ];
  order.forEach((value, k) => {
    const hi = value & 2 ? 'A1' : 'n1';
    const lo = value & 1 ? 'A0' : 'n0';
    const pins: Pin[] = open.includes(k)
      ? [
          ['A1', 'n1'],
          ['A0', 'n0'],
        ]
      : [hi, lo];
    nodes.push({ id: `d${k}`, rune: 'and', in: pins, x: 8.4, y: ys[k] });
  });
  return {
    inputs: [
      { id: 'A1', label: 'A', x: 0, y: 0.4 },
      { id: 'A0', label: 'A', x: 0, y: 5.6 },
    ],
    nodes,
    lamps: order.map((value, k) => ({
      id: `L${k}`,
      label: String(value),
      in: `d${k}`,
      x: 12,
      y: ys[k],
    })),
    numbers: [{ label: 'číslo', bits: ['A1', 'A0'] }],
  };
}

export function decoderTarget(m: Machine, order: number[]) {
  return targetFrom(m, (v) => Object.fromEntries(order.map((value, k) => [`L${k}`, numberOf(v, ['A1', 'A0']) === value ? 1 : 0])));
}

/* ───────────── paměť ───────────── */

/**
 * Ozvěna ze dvou Zavřených rozcestí, která si navzájem vracejí světlo. Horní (R) rozsvěcí lampu Q,
 * dolní (S) drží její opak. feedback: odkud bere druhý vstup každé runy (pevně, nebo točitý kámen).
 */
export function srLatch(toQ: Pin = 'nq', toNq: Pin = 'q'): Machine {
  return {
    inputs: [
      { id: 'R', x: 0, y: 0.8 },
      { id: 'S', x: 0, y: 7.4 },
    ],
    // Dolní runa se počítá první, takže ozvěna začíná zhasnutá.
    nodes: [
      { id: 'nq', rune: 'nor', in: ['S', toNq], x: 5.6, y: 6.6 },
      { id: 'q', rune: 'nor', in: ['R', toQ], x: 5.6, y: 1.6 },
    ],
    lamps: [{ id: 'Q', label: 'Q', in: 'q', x: 10.2, y: 1.6 }],
  };
}

/** Zkouška ozvěny: rozsvítit, pustit, zhasnout, pustit, rozsvítit, pustit. */
export const latchScript: ScriptStep[] = [
  { set: { S: 1 }, expect: { Q: 1 } },
  { set: {}, expect: { Q: 1 } },
  { set: { R: 1 }, expect: { Q: 0 } },
  { set: {}, expect: { Q: 0 } },
  { set: { S: 1 }, expect: { Q: 1 } },
  { set: {}, expect: { Q: 1 } },
];

/** Ozvěna, která poslouchá jen při tepu: Pouta před ozvěnou pustí D jen se světlem T. */
export function gatedLatch(toS: Pin = 'D', toR: Pin = 'nd'): Machine {
  return {
    inputs: [
      { id: 'D', x: 0, y: 0.6 },
      { id: 'T', x: 0, y: 6 },
    ],
    nodes: [
      { id: 'nd', rune: 'not', in: ['D'], x: 3.6, y: 3 },
      { id: 'gs', rune: 'and', in: [toS, 'T'], x: 8, y: 1.2 },
      { id: 'gr', rune: 'and', in: [toR, 'T'], x: 8, y: 4.8 },
      { id: 'mem', part: 'latch', in: ['gs', 'gr'], x: 12, y: 3 },
    ],
    lamps: [{ id: 'Q', label: 'Q', in: 'mem', x: 15.4, y: 3 }],
  };
}

export const gatedScript: ScriptStep[] = [
  { set: { D: 1 }, expect: { Q: 0 } },
  { set: { D: 1, T: 1 }, expect: { Q: 1 } },
  { set: {}, expect: { Q: 1 } },
  { set: { T: 1 }, expect: { Q: 0 } },
  { set: { D: 1 }, expect: { Q: 0 } },
  { set: { D: 1, T: 1 }, expect: { Q: 1 } },
];

/** Jediná ozvěna s tepem: vstup D, lampa Q. */
export function singleFlip(): Machine {
  return {
    inputs: [{ id: 'D', x: 0, y: 1 }],
    nodes: [{ id: 'f', part: 'flip', in: ['D'], x: 4.6, y: 1 }],
    lamps: [{ id: 'Q', label: 'Q', in: 'f', x: 8.4, y: 1 }],
  };
}

/** Registr: tři ozvěny s tepem nad sebou, každá se svým vstupem a lampou. */
export function register(): Machine {
  const ys = [0.6, 3.4, 6.2];
  return {
    inputs: ys.map((y, j) => ({ id: `D${2 - j}`, label: 'D', x: 0, y })),
    nodes: ys.map((y, j) => ({
      id: `f${2 - j}`,
      part: 'flip' as const,
      in: [`D${2 - j}`],
      x: 4.6,
      y,
    })),
    lamps: ys.map((y, j) => ({
      id: `Q${2 - j}`,
      label: String(2 ** (2 - j)),
      in: `f${2 - j}`,
      x: 8.6,
      y,
    })),
    numbers: [
      { label: 'vstup', bits: ['D2', 'D1', 'D0'] },
      { label: 'paměť', bits: ['Q2', 'Q1', 'Q0'] },
    ],
  };
}

/**
 * Posuvný registr: ozvěny nad sebou (nahoře nejtěžší), vstup X vlevo dole. pins: odkud bere každá
 * ozvěna světlo (od nejtěžší). Posun doleva: každá ozvěna převezme světlo od lehčí sousedky.
 */
export function shiftRegister(pins: [Pin, Pin, Pin] = ['f1', 'f0', 'X'], input: 'bottom' | 'top' = 'bottom'): Machine {
  const ys = [0.6, 3.6, 6.6];
  return {
    inputs: [{ id: 'X', x: 0, y: input === 'bottom' ? 7.6 : -0.4 }],
    nodes: ys.map((y, j) => ({
      id: `f${2 - j}`,
      part: 'flip' as const,
      in: [pins[j]],
      x: 5,
      y,
    })),
    lamps: ys.map((y, j) => ({
      id: `Q${2 - j}`,
      label: String(2 ** (2 - j)),
      in: `f${2 - j}`,
      x: 9.4,
      y,
    })),
    numbers: [{ label: 'paměť', bits: ['Q2', 'Q1', 'Q0'] }],
  };
}

/** Zkouška posunu doleva: světlo ze vstupu X stoupá každým tepem o patro výš a nahoře odpadne. */
export const shiftLeftScript: ScriptStep[] = [
  { set: { X: 1 }, pulse: true, expect: bitsOf(1, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(2, ['Q2', 'Q1', 'Q0']) },
  { set: { X: 1 }, pulse: true, expect: bitsOf(5, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(2, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(4, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(0, ['Q2', 'Q1', 'Q0']) },
];

/** Zkouška posunu doprava: světlo ze vstupu X klesá každým tepem o patro níž a dole odpadne. */
export const shiftRightScript: ScriptStep[] = [
  { set: { X: 1 }, pulse: true, expect: bitsOf(4, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(2, ['Q2', 'Q1', 'Q0']) },
  { set: { X: 1 }, pulse: true, expect: bitsOf(5, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(2, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(1, ['Q2', 'Q1', 'Q0']) },
  { set: {}, pulse: true, expect: bitsOf(0, ['Q2', 'Q1', 'Q0']) },
];

/**
 * Počítadlo hvězd: tři ozvěny s tepem (paměť) a pod nimi tři poloviční sčítačky, které k paměti
 * přičtou jedničku. Součet teče zpátky do ozvěn, takže každý tep přidá jednu hvězdu.
 * d: odkud bere každá ozvěna světlo (od nejtěžší), one: co přitéká do nejlehčí sčítačky.
 */
export function counter(d: [Pin, Pin, Pin] = ['h2.S', 'h1.S', 'h0.S'], one: Pin = LIGHT): Machine {
  const xs = [1.8, 6.6, 11.4];
  return {
    inputs: [],
    nodes: [
      ...xs.map((x, j) => ({
        id: `f${2 - j}`,
        part: 'flip' as const,
        in: [d[j]],
        x,
        y: 1.6,
      })),
      {
        id: 'h0',
        part: 'half',
        in: ['f0', one],
        x: xs[2] + 0.4,
        y: 6,
        turn: 'column',
      },
      {
        id: 'h1',
        part: 'half',
        in: ['f1', 'h0.P'],
        x: xs[1] + 0.4,
        y: 6,
        turn: 'column',
      },
      {
        id: 'h2',
        part: 'half',
        in: ['f2', 'h1.P'],
        x: xs[0] + 0.4,
        y: 6,
        turn: 'column',
      },
    ],
    lamps: xs.map((x, j) => ({
      id: `Q${2 - j}`,
      label: String(2 ** (2 - j)),
      in: `f${2 - j}`,
      x: x + 2.4,
      y: -1.4,
      from: 'bottom' as const,
    })),
    numbers: [{ label: 'hvězdy', bits: ['Q2', 'Q1', 'Q0'] }],
  };
}

/** Zkouška počítadla: osm tepů a počítadlo se vrátí na nulu. */
export const countScript: ScriptStep[] = Array.from({ length: 8 }, (_, k) => ({
  set: {},
  pulse: true,
  expect: bitsOf((k + 1) % 8, ['Q2', 'Q1', 'Q0']),
}));

/* ───────────── odčítačka ───────────── */

/**
 * Odčítačka ze tří sčítaček: krystal B každého sloupce projde kamenem, než vteče do sčítačky.
 * flip: kámen na B (Obraceč s točitým kamenem, nebo prázdný kámen se vstupem M), carry: přenos zprava.
 */
export function subtractor(mode: 'invert' | 'switch', carry: Pin, choices: Rune[] = ['and', 'or', 'xor']): Machine {
  const bits = 3;
  const col = (k: number) => 4.2 * (bits - 1 - k) + 1;
  const inputs: MachineInput[] = [];
  for (let k = bits - 1; k >= 0; k--)
    inputs.push({
      id: `A${k}`,
      label: 'A',
      x: col(k) - 0.75,
      y: 0,
      out: 'down',
    });
  for (let k = bits - 1; k >= 0; k--)
    inputs.push({
      id: `B${k}`,
      label: 'B',
      x: col(k) + 1.2,
      y: -0.2,
      out: 'down',
    });
  if (mode === 'switch') inputs.push({ id: 'M', label: 'M', x: col(0) + 4.2, y: 0.6, out: 'down' });
  const nodes: MachineNode[] = [];
  for (let k = 0; k < bits; k++) {
    if (mode === 'invert')
      nodes.push({
        id: `t${k}`,
        rune: 'not',
        in: [`B${k}`],
        x: col(k) + 1.2,
        y: 2.4,
        turn: 'down',
      });
    else
      nodes.push({
        id: `t${k}`,
        choices,
        in: [`B${k}`, 'M'],
        x: col(k) + 1.2,
        y: 2.4,
        turn: 'down',
      });
  }
  for (let k = 0; k < bits; k++) {
    const b: Pin = mode === 'invert' ? [`B${k}`, `t${k}`] : `t${k}`;
    nodes.push({
      id: `fa${k}`,
      part: 'full',
      in: [`A${k}`, b, k === 0 ? carry : `fa${k - 1}.P`],
      x: col(k),
      y: 5.6,
      turn: 'column',
    });
  }
  return {
    inputs,
    nodes,
    lamps: Array.from({ length: bits }, (_, j) => {
      const k = bits - 1 - j;
      return {
        id: `S${k}`,
        label: String(2 ** k),
        in: `fa${k}.S`,
        x: col(k),
        y: 8.8,
        from: 'top' as const,
      };
    }),
    numbers: [
      { label: 'A', bits: ['A2', 'A1', 'A0'] },
      { label: 'B', bits: ['B2', 'B1', 'B0'] },
      { label: 'výsledek', bits: ['S2', 'S1', 'S0'] },
    ],
  };
}

export function subtractTarget(m: Machine, mode: 'invert' | 'switch') {
  return targetFrom(m, (v) => {
    const a = numberOf(v, ['A2', 'A1', 'A0']);
    const b = numberOf(v, ['B2', 'B1', 'B0']);
    const minus = mode === 'invert' || v('M') === 1;
    return bitsOf((((minus ? a - b : a + b) % 8) + 8) % 8, ['S2', 'S1', 'S0']);
  });
}

/* ───────────── volič operace ───────────── */

/**
 * Volič operace: čtyři runy počítají z A a B, tři výhybky vyberou podle kódu operace O jednu z nich.
 * runes: runy (nebo nabídky) pro kódy 0–3, sel: odkud berou voliče výhybek (horní, dolní, poslední).
 */
export function alu(runes: (Rune | Rune[])[], sel: [Pin, Pin, Pin] = ['O0', 'O0', 'O1']): Machine {
  const ys = [0, 2.3, 4.6, 6.9];
  return {
    inputs: [
      { id: 'A', x: 0, y: 1.2 },
      { id: 'B', x: 0, y: 5.6 },
      { id: 'O1', label: 'O', x: 4.4, y: 9.8 },
      { id: 'O0', label: 'O', x: 6.6, y: 9.8 },
    ],
    nodes: [
      ...runes.map((r, k) => ({
        id: `r${k}`,
        ...stone(r),
        in: ['A', 'B'],
        x: 4.4,
        y: ys[k],
      })),
      { id: 'm1', part: 'mux', in: ['r0', 'r1', sel[0]], x: 9.2, y: 1.15 },
      { id: 'm2', part: 'mux', in: ['r2', 'r3', sel[1]], x: 9.2, y: 5.75 },
      { id: 'm3', part: 'mux', in: ['m1', 'm2', sel[2]], x: 13.4, y: 3.45 },
    ],
    lamps: [{ id: 'q', label: 'výsledek', in: 'm3', x: 16.8, y: 3.45 }],
    numbers: [{ label: 'operace', bits: ['O1', 'O0'] }],
  };
}

export function aluTarget(m: Machine, ops: Rune[]) {
  return targetFrom(m, (v) => {
    const rune = ops[numberOf(v, ['O1', 'O0'])];
    const a = v('A');
    const b = v('B');
    const out = {
      and: a & b,
      or: a | b,
      xor: a ^ b,
      nand: a & b ? 0 : 1,
      nor: a | b ? 0 : 1,
      xnor: a === b ? 1 : 0,
      imp: a && !b ? 0 : 1,
      id: a,
      not: a ? 0 : 1,
    }[rune];
    return { q: out };
  });
}

/* ───────────── násobička ───────────── */

/** Násobička dvou dvoubitových čísel: čtyři Pouta (kopie) a dvě poloviční sčítačky. */
export function multiplier(h1: [Pin, Pin], h2: [Pin, Pin]): Machine {
  return {
    inputs: [
      { id: 'A1', label: 'A', x: 0, y: 0.4 },
      { id: 'A0', label: 'A', x: 0, y: 2.8 },
      { id: 'B1', label: 'B', x: 0, y: 5.6 },
      { id: 'B0', label: 'B', x: 0, y: 8 },
    ],
    nodes: [
      { id: 'p11', rune: 'and', in: ['A1', 'B1'], x: 4.6, y: 0.4 },
      { id: 'p10', rune: 'and', in: ['A1', 'B0'], x: 4.6, y: 2.9 },
      { id: 'p01', rune: 'and', in: ['A0', 'B1'], x: 4.6, y: 5.4 },
      { id: 'p00', rune: 'and', in: ['A0', 'B0'], x: 4.6, y: 7.9 },
      { id: 'h1', part: 'half', in: h1, x: 9.6, y: 4.4 },
      { id: 'h2', part: 'half', in: h2, x: 13.8, y: 1.6 },
    ],
    lamps: [
      { id: 'L8', label: '8', in: 'h2.P', x: 17.4, y: 0.6 },
      { id: 'L4', label: '4', in: 'h2.S', x: 17.4, y: 2.9 },
      { id: 'L2', label: '2', in: 'h1.S', x: 17.4, y: 5.2 },
      { id: 'L1', label: '1', in: 'p00', x: 17.4, y: 7.5 },
    ],
    numbers: [
      { label: 'A', bits: ['A1', 'A0'] },
      { label: 'B', bits: ['B1', 'B0'] },
      { label: 'A × B', bits: ['L8', 'L4', 'L2', 'L1'] },
    ],
  };
}

export const multiplyTarget = (m: Machine) =>
  targetFrom(m, (v) => bitsOf(numberOf(v, ['A1', 'A0']) * numberOf(v, ['B1', 'B0']), ['L8', 'L4', 'L2', 'L1']));
