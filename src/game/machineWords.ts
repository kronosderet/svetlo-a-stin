/**
 * Dílna slovy: odkud světlo teče a kde sedí točitý kámen. Používá je čtečka obrazovky,
 * hlášení po pootočení i ukázka kroku.
 */
import { LIGHT, PARTS, SHADOW, type Machine, type PartKind } from '../core/puzzles/machine';

export const inputName = (m: Machine, id: string): string => m.inputs.find((i) => i.id === id)?.label ?? id;
export const lampName = (m: Machine, id: string): string => m.lamps.find((l) => l.id === id)?.label ?? id;

/** Součástky ve 2. pádě: „z výstupu P úplné sčítačky 4“. */
const PART_OF: Record<PartKind, string> = {
  half: 'poloviční sčítačky',
  full: 'úplné sčítačky',
  mux: 'výhybky',
  dec: 'rozdělovače',
  latch: 'ozvěny',
  flip: 'ozvěny s tepem',
};

/** Váha krystalu nebo lampy, která patří k číslu (jinak null). */
export function weightIn(m: Machine, id: string): number | null {
  for (const g of m.numbers ?? []) {
    const i = g.bits.indexOf(id);
    if (i >= 0 && g.bits.length > 1) return 2 ** (g.bits.length - 1 - i);
  }
  return null;
}

/** Odkud světlo teče, i s předložkou: „ze vstupu A s váhou 2“, „z výstupu P úplné sčítačky 4“. */
export function fromWords(m: Machine, src: string): string {
  if (src === SHADOW) return 'ze stálého stínu';
  if (src === LIGHT) return 'ze stálého světla';
  if (m.inputs.some((i) => i.id === src)) {
    const w = weightIn(m, src);
    return `ze vstupu ${inputName(m, src)}${w ? ` s váhou ${w}` : ''}`;
  }
  const [id, out] = src.split('.');
  const k = m.nodes.findIndex((g) => g.id === id);
  const g = m.nodes[k];
  if (g?.part) return out ? `z výstupu ${out} ${PART_OF[g.part]} ${k + 1}` : `z ${PART_OF[g.part]} ${k + 1}`;
  return `z kamene ${k + 1}`;
}

/** Kde točitý kámen sedí: „u vstupu P úplné sčítačky 2“, „u kamene 3, horní vstup“, „u lampy Q“. */
export function seatWords(m: Machine, key: string): string {
  if (key.startsWith('lamp:')) return `u lampy ${lampName(m, key.slice(5))}`;
  const [id, at] = key.split(':');
  const k = Number(at);
  const n = m.nodes.findIndex((g) => g.id === id);
  const g = m.nodes[n];
  if (!g) return '';
  if (g.part) return `u vstupu ${PARTS[g.part].ins[k]} ${PART_OF[g.part]} ${n + 1}`;
  if (g.in.filter((p) => Array.isArray(p)).length < 2) return `u kamene ${n + 1}`;
  const side = g.turn === 'down' ? (k === 0 ? 'levý' : 'pravý') : k === 0 ? 'horní' : 'dolní';
  return `u kamene ${n + 1}, ${side} vstup`;
}

