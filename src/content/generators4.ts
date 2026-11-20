/**
 * Losování strojů pro Hlubinu Strojů (Akt IV). Brány patra vylosují při každém vstupu jinou
 * podobu zkoušek, ať se nedají opsat od souseda: jiné pořadí lamp rozdělovače, obrácenou výhybku,
 * „stejné“ nebo „různé“ u porovnávače, posun nahoru nebo dolů, jiné kódy operací.
 */
import type { Rune } from '../core/logic';
import { LIGHT, SHADOW, type MachineConfig, type MachineTask } from '../core/puzzles/machine';
import type { QuizQuestion } from './types';
import {
  alu,
  aluTarget,
  chainTask,
  compare2,
  compareTarget,
  decoder,
  decoderTarget,
  mux,
  muxTarget,
  runCounter,
  runScript,
  shiftLeftScript,
  shiftRegister,
  shiftRightScript,
  subtractTarget,
  subtractor,
} from './machines';
import { RUNE_NAME } from './runes';
import { int, pick, shuffled, until, type Rng } from './random';

export function decoderTask(order: number[], open: number[] = [0, 1, 2, 3]): MachineTask {
  const machine = decoder(order, open);
  return {
    mode: 'build',
    kind: 'decoder',
    machine,
    target: decoderTarget(machine, order),
    rule: 'Číslo A rozsvítí lampu se svým číslem.',
  };
}

export function muxTask(swap = false): MachineTask {
  const machine = mux(['V', 'nv'], ['V', 'nv'], ['and', 'or']);
  return {
    mode: 'build',
    kind: 'mux',
    machine,
    target: muxTarget(machine, swap),
    rule: swap ? 'Volič ve stínu pustí k lampě B, ve světle A.' : 'Volič ve stínu pustí k lampě A, ve světle B.',
  };
}

/** Druhá zkouška brány Hlubiny: rozdělovač a výhybka, každá úloha s vlastním zadáním. */
export function routeTasks(order: number[], swap: boolean): MachineTask[] {
  return [
    {
      ...decoderTask(order),
      say: 'Druhá zkouška, rozdělovač: natoč točité kameny tak, aby číslo A rozsvítilo lampu se svým číslem.',
    },
    {
      ...muxTask(swap),
      say: 'Druhá zkouška, výhybka: natoč točité kameny a vlož runu, aby volič pouštěl k lampě A, nebo B, jak žádá brána.',
    },
  ];
}

/**
 * Nápovědy porovnávače podle jména lampy. Platí v IV-4 i v bráně IV-7, kde se „stejné“ a „různé“
 * losuje. Kdo postaví přesně to, co říká nápověda 2, projde Zkouškou. Třetí text nemají: krok
 * s větou dá ukázka kroku.
 */
export function compareHints(same: boolean): [string, string] {
  return same
    ? [
        'Lampa se jmenuje „stejné“. Porovnávej po sloupcích: jsou krystaly A a B v jednom sloupci stejné?',
        'Rovnost svítí, když jsou oba krystaly stejné. Čísla jsou stejná, když se shodne každý sloupec, a to pohlídá Pouto.',
      ]
    : [
        'Lampa se jmenuje „různé“. Kdy se liší dvě čísla? Musí se lišit každý sloupec, nebo stačí jeden?',
        'Výluka svítí ve sloupci, kde se krystaly liší. Lampa má svítit, když se liší aspoň jeden sloupec, a to pohlídá Rozcestí.',
      ];
}

export function compareTask(same: boolean): MachineTask {
  const machine = compare2(['xor', 'xnor'], ['and', 'or'], same ? 'stejné' : 'různé');
  return {
    mode: 'build',
    kind: 'compare',
    machine,
    target: compareTarget(machine, 2, same),
    rule: same ? 'Lampa svítí, když A = B.' : 'Lampa svítí, když se A a B liší.',
    hints: compareHints(same),
  };
}

export function shiftTask(dir: 'left' | 'right'): MachineTask {
  const machine =
    dir === 'left'
      ? shiftRegister(
          [
            ['X', 'f1', 'f0'],
            ['X', 'f2', 'f0'],
            ['X', 'f2', 'f1'],
          ],
          'bottom',
        )
      : shiftRegister(
          [
            ['X', 'f1', 'f0'],
            ['X', 'f2', 'f0'],
            ['X', 'f2', 'f1'],
          ],
          'top',
        );
  return {
    mode: 'build',
    kind: 'shift',
    machine,
    script: dir === 'left' ? shiftLeftScript : shiftRightScript,
    rule: dir === 'left' ? 'Každý tep posune světlo o patro výš.' : 'Každý tep posune světlo o patro níž.',
  };
}

/**
 * Nápovědy odčítačky podle úlohy. Doplněk zavádí nepovinná II-13, nápověda 1 ho proto odvodí
 * sama. Nápověda 2 dá princip a otázku, ve druhé úloze ale tak, aby stavba podle ní prošla.
 */
export function subtractHints(mode: 'invert' | 'switch'): [string, string] {
  return mode === 'invert'
    ? [
        'Odečíst B je totéž jako přičíst převrácené B a jedničku. Třeba 3 − 2: převrácené 010 je 101, tedy 5. 3 + 5 + 1 = 9, osmička přeteče a lampy ukážou 1.',
        'Kde na desce teče převrácené B? A jednička navíc má váhu 1: kterým vstupem nejlehčí sčítačky může přitéct?',
      ]
    : [
        'Teď rozhoduje M: když mlčí, stroj sčítá, když svítí, odčítá. Prázdný kámen nad každou sčítačkou bere B i M.',
        'Co dá Výluka s M, když M mlčí, a co, když svítí? A jednička navíc má do nejlehčího sloupce přitéct jen při odčítání.',
      ];
}

export function subtractTask(mode: 'invert' | 'switch'): MachineTask {
  const machine = mode === 'invert' ? subtractor('invert', [SHADOW, LIGHT]) : subtractor('switch', [SHADOW, LIGHT, 'M']);
  return {
    mode: 'build',
    kind: 'subtract',
    machine,
    target: subtractTarget(machine, mode),
    say:
      mode === 'invert'
        ? 'Natoč točité kameny tak, aby stroj odčítal podle brány. Pak spusť Zkoušku.'
        : 'Natoč točité kameny a do prázdných kamenů vlož runy, ať stroj sčítá i odčítá podle brány. Pak spusť Zkoušku.',
    // Pravidlo nestaví na nepovinném Doplňku (II-13): přetočení dokola řekne samo, i u sčítání.
    rule:
      mode === 'invert'
        ? 'Lampy mají ukázat A − B. Záporný výsledek se přetočí dokola: −1 je 7, −2 je 6.'
        : 'Když M mlčí, lampy ukazují A + B. Když svítí, A − B. Přes 7 a pod 0 se výsledek přetočí: 7 + 1 je 0, 0 − 1 je 7.',
    hints: subtractHints(mode),
  };
}

/** Pravidlo voliče operace slovy: „Kód 0 = Pouto, 1 = Rozcestí…“. */
export const aluRule = (ops: Rune[]): string => 'Kód ' + ops.map((r, k) => `${k} = ${RUNE_NAME[r]}`).join(', ') + '.';

/** Voliče výhybek: kódy 0 až 3 shora dolů, nebo přehozené (0, 2, 1, 3). */
export const ALU_WIRING = { straight: ['O0', 'O0', 'O1'], crossed: ['O1', 'O1', 'O0'] } as const;

export function aluTask(ops: Rune[], open: 'runes' | 'selectors', wiring: keyof typeof ALU_WIRING = 'straight'): MachineTask {
  const machine =
    open === 'runes'
      ? alu(
          ops.map(() => ['and', 'or', 'xor', 'nand'] as Rune[]),
          [...ALU_WIRING[wiring]],
        )
      : alu(ops, [
          ['O1', 'O0'],
          ['O1', 'O0'],
          ['O1', 'O0'],
        ]);
  return {
    mode: 'build',
    kind: 'alu',
    machine,
    target: aluTarget(machine, ops),
    rule: aluRule(ops),
  };
}

/* ───────────── brána Hlubiny (IV-7) ───────────── */

export const genIV7Adder = (rng: Rng): MachineConfig => ({
  tasks: [chainTask(3, pick(rng, [0, 1]))],
});

/** Lampy rozdělovače nikdy popořadě: to by byla IV-6 znovu a nápověda „nejsou popořadě“ by lhala. */
export const genIV7Route = (rng: Rng): MachineConfig => ({
  tasks: routeTasks(
    until(
      () => shuffled(rng, [0, 1, 2, 3]),
      (order) => order.some((v, k) => v !== k),
    ),
    rng() < 0.5,
  ),
});

export const genIV7Compare = (rng: Rng): MachineConfig => ({
  tasks: [compareTask(rng() < 0.5)],
});

/* ───────────── velká brána Hlubiny (IV-15) ───────────── */

/** Počítadlo s chodem: paměť, sčítačka a Pouta v jednom stroji. Zkouška zhasne chod pokaždé jinde. */
export function runTask(a = 3, b = 2): MachineTask {
  return {
    mode: 'build',
    kind: 'run',
    machine: runCounter(['and', 'or', 'xor'], [SHADOW, LIGHT, 'C']),
    script: runScript(a, b),
    rule: 'Dokud svítí chod C, každý tep přičte jedničku. Tep při zhasnutém C počítadlo vynuluje.',
  };
}

export const genIV15Run = (rng: Rng): MachineConfig => ({
  tasks: [runTask(int(rng, 2, 5), int(rng, 1, 4))],
});

/** Volič s jinými kódy i jinak zapojenými voliči výhybek: pořadí run se musí vyčíst z cest. */
export const genIV15Alu = (rng: Rng): MachineConfig => ({
  tasks: [aluTask(shuffled(rng, ['and', 'or', 'xor', 'nand'] as Rune[]), 'runes', pick(rng, ['straight', 'crossed'] as const))],
});

/* ───────────── kvízy s losovanými čísly ───────────── */

const bin = (v: number, width: number) => v.toString(2).padStart(width, '0');

/** Tři různé špatné možnosti: nejdřív typické chyby, pak sousední čísla. */
function wrongs(correct: number, typical: number[], max: number): number[] {
  const out: number[] = [];
  for (const v of [...typical, correct + 1, correct - 1, correct + 2, correct - 2, correct + 3]) {
    if (v !== correct && v >= 0 && v <= max && !out.includes(v)) out.push(v);
    if (out.length === 3) break;
  }
  return out;
}

/** Řetěz tří sčítaček: co ukážou čtyři lampy součtu. */
export function qChainSum(rng: Rng): QuizQuestion {
  const a = int(rng, 3, 7);
  const b = int(rng, 8 - a, 7);
  const sum = a + b;
  const ws = wrongs(sum, [sum % 8, a | b, a ^ b], 15);
  const reason = (v: number) =>
    v === sum % 8
      ? 'Chybí nejtěžší lampa. Přenos z poslední sčítačky ji rozsvítí.'
      : v === (a ^ b)
        ? 'Sečteno sloupec po sloupci bez přenosů.'
        : v === (a | b)
          ? 'Tohle by ukázalo Rozcestí po sloupcích. Sčítačka posílá přenos doleva.'
          : '';
  const options = [sum, ...ws].map((v) => bin(v, 4));
  return {
    question: `Řetěz tří sčítaček sčítá A = ${bin(a, 3)} a B = ${bin(b, 3)}. Co ukážou čtyři lampy součtu?`,
    options,
    why: ['', ...ws.map(reason)],
    correct: 0,
    hint: `Sečti ${a} + ${b} a zapiš výsledek čtyřmi krystaly s vahami 8, 4, 2, 1.`,
    explain: `${a} + ${b} = ${sum} = ${bin(sum, 4)}. Přenos z poslední sčítačky rozsvítí čtvrtou lampu.`,
  };
}

/** Počítadlo: kde bude po několika tepech. Otázka je o přetečení, takže tepy vždy přejdou přes 7. */
export function qCounter(rng: Rng): QuizQuestion {
  const start = int(rng, 4, 7);
  const beats = int(rng, Math.max(2, 8 - start), 4);
  const end = (start + beats) % 8;
  const ws = wrongs(end, [start + beats, start - beats, (end + 1) % 8], 15);
  const reason = (v: number) =>
    v === start + beats
      ? 'Tři krystaly unesou nejvýš 7. Po sedmičce počítadlo přeteče na 0.'
      : v === start - beats
        ? 'Tep přičítá, neodčítá.'
        : v === (end + 1) % 8
          ? 'O jeden tep víc. Počítej tepy od čísla, které počítadlo ukazuje teď.'
          : '';
  const options = [end, ...ws].map(String);
  return {
    question: `Tříbitové počítadlo hvězd ukazuje ${start}. Co ukáže po ${beats} tepech?`,
    options,
    why: ['', ...ws.map(reason)],
    correct: 0,
    hint: 'Každý tep přičte jedna. Tři krystaly unesou nejvýš 7, pak počítadlo přeteče na 0.',
    explain: `${start} + ${beats} = ${start + beats}, ale tři krystaly unesou nejvýš 7. Po sedmičce přijde 0, takže po přetečení zbude ${end}.`,
  };
}
