/**
 * Dílna slovy: odkud světlo teče, kde sedí točitý kámen, co ukazují lampy a co Zkouška našla.
 * Používá je čtečka obrazovky, hlášení po pootočení, hláška po chybě i ukázka kroku.
 */
import { ARITY, rowCount, type Rune } from '../core/logic';
import {
  LIGHT,
  PARTS,
  SHADOW,
  inputOn,
  numberValue,
  socketKey,
  sourceOf,
  type Failure,
  type Machine,
  type MachineHint,
  type MachineTask,
  type PartKind,
} from '../core/puzzles/machine';
import { RUNE_NAME, RUNE_RULE } from '../content/runes';
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

/**
 * Odkud světlo teče, u kamene s runou i s důvodem: co runa v tom kameni počítá.
 * „z kamene 1, kde Obraceč obrací světlo ze vstupu A s váhou 2“, „z kamene 3, kde Pouto počítá A₁ × B₂“.
 */
export function fromWhyWords(m: Machine, src: string, runes: Record<string, Rune>, wires: Record<string, string>): string {
  const from = fromWords(m, src);
  const g = m.nodes.find((n) => n.id === src);
  const rune = g && !g.part ? (g.rune ?? runes[g.id]) : undefined;
  if (!g || !rune) return from;
  if (g.note) return `${from}, kde ${RUNE_NAME[rune]} počítá ${g.note}`;
  const ins = g.in.slice(0, ARITY[rune]).map((p, k) => {
    const s = sourceOf(p, socketKey(g.id, k), wires);
    return s === null ? 'z točitého kamene' : fromWords(m, s);
  });
  return rune === 'not' ? `${from}, kde Obraceč obrací světlo ${ins[0]}` : `${from}, kde ${RUNE_NAME[rune]} bere světlo ${ins.join(' a ')}`;
}

/**
 * Ukázka kroku při stavbě slovy: jaká runa patří do zvýrazněného kamene a proč, kam natočit
 * točitý kámen a co z toho místa teče, nebo že je stroj hotový a zbývá Zkouška.
 */
export function buildStepWords(m: Machine, h: MachineHint | null, runes: Record<string, Rune>, wires: Record<string, string>): string | null {
  if (!h) return 'Stroj je hotový. Spusť Zkoušku.';
  if ('node' in h) return `Do zvýrazněného kamene patří ${RUNE_NAME[h.rune]}: ${RUNE_RULE[h.rune]}.`;
  if ('socket' in h) return `Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${fromWhyWords(m, h.source, runes, wires)}.`;
  return null;
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

/**
 * Co lampy v kroku zkoušky opravdu ukázaly proti tomu, co zkouška čeká (jen to, co nesedí):
 * „lampa Q mlčí, má svítit“, u čísla „lampy ukazují 3, mají ukázat 4“.
 */
export function shownWords(m: Machine, expect: Record<string, number>, shown: Record<string, number | null>): string {
  const on = (id: string) => (shown[id] ? 1 : 0);
  const groups = (m.numbers ?? []).filter((g) => g.bits.length > 1 && g.bits.every((b) => b in expect));
  const inGroups = new Set(groups.flatMap((g) => g.bits));
  const parts = groups
    .filter((g) => g.bits.some((b) => on(b) !== expect[b]))
    .map((g) => {
      const what = `lampy ukazují ${numberValue(g, on)}, mají ukázat ${numberValue(g, (id) => expect[id])}`;
      return groups.length > 1 ? `${g.label}: ${what}` : what;
    });
  for (const id of Object.keys(expect))
    if (!inGroups.has(id) && on(id) !== expect[id]) parts.push(`lampa ${lampName(m, id)} ${on(id) ? 'svítí' : 'mlčí'}, má ${expect[id] ? 'svítit' : 'mlčet'}`);
  return parts.join('; ');
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
    // Výsledek kroku k závisí na všech krocích před ním: projít se musí od zhasnuté paměti.
    const k = f.at + 1;
    const steps = k === 1 ? '1. krok' : `kroky 1 až ${k}`;
    // Počítadlo hvězd nemá žádný vstup: kroky se dají projít jen tepem.
    const by = !m.nodes.some((g) => g.part === 'flip') ? 'vstupy' : n ? 'vstupy i tepem' : 'tepem';
    const shown = shownWords(m, task.script[f.at].expect, f.shown) || 'lampy nesvítí správně';
    return `Zkouška se zastavila ${inNum(k)} ${k}. kroku: ${shown}. Od zhasnuté paměti projdi ${steps} ${by} a sleduj, kudy světlo teče. Paměť zhasne tlačítko Od tmy.`;
  }
  if (rowCount(n) > 8) return `Stroj se splete u ${rowWords(m, f.at)}. Nastav ty vstupy a sleduj, kudy světlo teče.`;
  // Deska označí jen první chybný řádek. Hláška ho jmenuje, ať je jasné, podle čeho vstupy nastavit.
  const k = f.count;
  const rows = `${inNum(k)} ${k} ${plural(k, 'řádku', 'řádcích', 'řádcích')} desky`;
  const where = k === 1 ? `${rows}: ${rowWords(m, f.at)}` : `${rows}. První je označený: ${rowWords(m, f.at)}`;
  return `${m.lamps.length > 1 ? 'Lampy nesvítí' : 'Lampa nesvítí'} správně ${where}. Nastav ty vstupy a sleduj, kudy světlo teče.`;
}
