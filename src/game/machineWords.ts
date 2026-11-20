/**
 * Dílna slovy: odkud světlo teče, kde sedí točitý kámen, co ukazují lampy a co Zkouška našla.
 * Používá je čtečka obrazovky, hlášení po pootočení, hláška po chybě i ukázka kroku.
 */
import { rowCount } from '../core/logic';
import {
  LIGHT,
  PARTS,
  SHADOW,
  inputOn,
  numberValue,
  type Failure,
  type Machine,
  type MachineTask,
  type PartKind,
} from '../core/puzzles/machine';
import { inNum, plural } from './text';

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

/** Co ukazují lampy: u čísel jejich hodnota, jinak lampa po lampě. */
export function lampsWords(m: Machine, lamps: Record<string, number | null>): string {
  const groups = (m.numbers ?? []).filter((g) => g.bits.every((b) => b in lamps));
  const inGroups = new Set(groups.flatMap((g) => g.bits));
  const parts = groups.map((g) => `${g.label} ${numberValue(g, (id) => lamps[id])}`);
  for (const l of m.lamps) if (!inGroups.has(l.id)) parts.push(`lampa ${l.label} ${lamps[l.id] ? 'svítí' : 'mlčí'}`);
  return parts.join(', ');
}

/** Řádek vstupů slovy: čísla hodnotou, ostatní vstupy světlo nebo stín. */
export function rowWords(m: Machine, row: number): string {
  const groups = (m.numbers ?? []).filter((g) => g.bits.every((b) => m.inputs.some((i) => i.id === b)));
  const inGroups = new Set(groups.flatMap((g) => g.bits));
  const parts = groups.map((g) => `${g.label} = ${numberValue(g, (id) => inputOn(m, row, id))}`);
  for (const inp of m.inputs)
    if (!inGroups.has(inp.id)) parts.push(`${inputName(m, inp.id)} ${inputOn(m, row, inp.id) ? 'světlo' : 'stín'}`);
  return parts.join(', ');
}

/** Nová kombinace při zkoumání: vstupy i lampy (čtečka jinak výsledek neuslyší), a kolik je vyzkoušeno. */
export function triedWords(m: Machine, row: number, lamps: Record<string, number | null>, count: number): string {
  return `Nová kombinace: ${rowWords(m, row)}, ${lampsWords(m, lamps)}. Vyzkoušeno ${count} z ${rowCount(m.inputs.length)}.`;
}

/** Hláška po Zkoušce, která neprošla: kde se stroj spletl a jak to místo najít. */
export function failureWords(task: MachineTask, f: Failure): string {
  const m = task.machine;
  const n = m.inputs.length;
  if (f.empty) return 'Některý kámen je prázdný nebo točitý kámen nenastavený. Tudy světlo neproteče.';
  if (task.script) {
    const which = f.lamps.map((id) => `lampa ${lampName(m, id)}`).join(' a ');
    // Počítadlo hvězd nemá žádný vstup: krok se dá projít jen tepem.
    const by = !m.nodes.some((g) => g.part === 'flip') ? 'vstupy' : n ? 'vstupy a tepem' : 'tepem';
    return `Zkouška se zastavila ${inNum(f.at + 1)} ${f.at + 1}. kroku: ${which} nesvítí správně. Projdi ten krok ${by} a sleduj, kudy světlo teče.`;
  }
  if (rowCount(n) > 8) return `Stroj se splete u ${rowWords(m, f.at)}. Nastav ty vstupy a sleduj, kudy světlo teče.`;
  // Deska označí jen první chybný řádek. Hláška ho jmenuje, ať je jasné, podle čeho vstupy nastavit.
  const k = f.count;
  const rows = `${inNum(k)} ${k} ${plural(k, 'řádku', 'řádcích', 'řádcích')} desky`;
  const where = k === 1 ? `${rows}: ${rowWords(m, f.at)}` : `${rows}. První je označený: ${rowWords(m, f.at)}`;
  return `${m.lamps.length > 1 ? 'Lampy nesvítí' : 'Lampa nesvítí'} správně ${where}. Nastav ty vstupy a sleduj, kudy světlo teče.`;
}
