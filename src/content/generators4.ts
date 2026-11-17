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
  shiftLeftScript,
  shiftRegister,
  shiftRightScript,
  subtractTarget,
  subtractor,
} from './machines';
import { RUNE_NAME } from './runes';
import { int, pick, shuffled, type Rng } from './random';

export function decoderTask(order: number[], open: number[] = [0, 1, 2, 3]): MachineTask {
  const machine = decoder(order, open);
  return {
    mode: 'build',
    machine,
    target: decoderTarget(machine, order),
    rule: 'Číslo A rozsvítí lampu se svým číslem.',
  };
}

export function muxTask(swap = false): MachineTask {
  const machine = mux(['V', 'nv'], ['V', 'nv'], ['and', 'or']);
  return {
    mode: 'build',
    machine,
    target: muxTarget(machine, swap),
    rule: swap ? 'Volič ve stínu pustí k lampě B, ve světle A.' : 'Volič ve stínu pustí k lampě A, ve světle B.',
  };
}

export function compareTask(same: boolean): MachineTask {
  const machine = compare2(['xor', 'xnor'], ['and', 'or'], same ? 'stejné' : 'různé');
  return {
    mode: 'build',
    machine,
    target: compareTarget(machine, 2, same),
    rule: same ? 'Lampa svítí, když A = B.' : 'Lampa svítí, když se A a B liší.',
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
    machine,
    script: dir === 'left' ? shiftLeftScript : shiftRightScript,
    rule: dir === 'left' ? 'Každý tep posune světlo o patro výš.' : 'Každý tep posune světlo o patro níž.',
  };
}

export function subtractTask(mode: 'invert' | 'switch'): MachineTask {
  const machine = mode === 'invert' ? subtractor('invert', [SHADOW, LIGHT]) : subtractor('switch', [SHADOW, LIGHT, 'M']);
  return {
    mode: 'build',
    machine,
    target: subtractTarget(machine, mode),
    rule:
      mode === 'invert'
        ? 'Lampy mají ukázat A − B. Záporný výsledek se přetočí jako v Doplňku (−1 je 7).'
        : 'Když M mlčí, lampy ukazují A + B. Když svítí, ukazují A − B.',
  };
}

/** Pravidlo voliče operace slovy: „Kód 0 = Pouto, 1 = Rozcestí…“. */
export const aluRule = (ops: Rune[]): string => 'Kód ' + ops.map((r, k) => `${k} = ${RUNE_NAME[r]}`).join(', ') + '.';

export function aluTask(ops: Rune[], open: 'runes' | 'selectors'): MachineTask {
  const machine =
    open === 'runes'
      ? alu(ops.map(() => ['and', 'or', 'xor', 'nand'] as Rune[]))
      : alu(ops, [
          ['O1', 'O0'],
          ['O1', 'O0'],
          ['O1', 'O0'],
        ]);
  return {
    mode: 'build',
    machine,
    target: aluTarget(machine, ops),
    rule: aluRule(ops),
  };
}

/* ───────────── brána Hlubiny (IV-7) ───────────── */

export const genIV7Adder = (rng: Rng): MachineConfig => ({
  tasks: [chainTask(3, pick(rng, [0, 1]))],
});

export const genIV7Route = (rng: Rng): MachineConfig => ({
  tasks: [decoderTask(shuffled(rng, [0, 1, 2, 3])), muxTask(rng() < 0.5)],
});

export const genIV7Compare = (rng: Rng): MachineConfig => ({
  tasks: [compareTask(rng() < 0.5)],
});

/* ───────────── velká brána Hlubiny (IV-15) ───────────── */

export const genIV15Register = (rng: Rng): MachineConfig => ({
  tasks: [shiftTask(pick(rng, ['left', 'right'] as const))],
});

export const genIV15Subtract = (rng: Rng): MachineConfig => ({
  tasks: [subtractTask(pick(rng, ['invert', 'switch'] as const))],
});

export const genIV15Alu = (rng: Rng): MachineConfig => ({
  tasks: [aluTask(shuffled(rng, ['and', 'or', 'xor', 'nand'] as Rune[]), 'runes')],
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
  const options = [sum, ...wrongs(sum, [sum % 8, a | b, a ^ b], 15)].map((v) => bin(v, 4));
  return {
    question: `Řetěz tří sčítaček sčítá A = ${bin(a, 3)} a B = ${bin(b, 3)}. Co ukážou čtyři lampy součtu?`,
    options,
    correct: 0,
    hint: `Sečti ${a} + ${b} a zapiš výsledek čtyřmi krystaly s vahami 8, 4, 2, 1.`,
    explain: `${a} + ${b} = ${sum} = ${bin(sum, 4)}. Přenos z poslední sčítačky rozsvítí čtvrtou lampu.`,
  };
}

/** Počítadlo: kde bude po několika tepech. */
export function qCounter(rng: Rng): QuizQuestion {
  const start = int(rng, 4, 7);
  const beats = int(rng, 2, 4);
  const end = (start + beats) % 8;
  const options = [end, ...wrongs(end, [start + beats, start - beats, (end + 1) % 8], 15)].map(String);
  return {
    question: `Tříbitové počítadlo hvězd ukazuje ${start}. Co ukáže po ${beats} tepech?`,
    options,
    correct: 0,
    hint: 'Každý tep přičte jedna. Tři krystaly unesou nejvýš 7, pak počítadlo přeteče na 0.',
    explain: `Po sedmičce přijde 0. ${start} + ${beats} = ${start + beats}, tři krystaly ale unesou nejvýš 7, takže po přetečení zbude ${end}.`,
  };
}
