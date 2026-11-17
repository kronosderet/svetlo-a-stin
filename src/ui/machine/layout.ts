/**
 * Rozměry prvků na desce Dílny (v pixelech při měřítku 1). Používá je deska i test,
 * který hlídá, že se prvky žádného stroje nepřekrývají.
 */
import { PARTS, type Machine, type MachineNode } from '../../core/puzzles/machine';

/** Jednotka mřížky: souřadnice v obsahu jsou v násobcích G. */
export const G = 40;
/** Rozestup kolíků součástky. */
export const PIN = 26;

export function partSize(g: MachineNode): { w: number; h: number } {
  if (g.turn === 'column') return { w: 108, h: 78 };
  const spec = PARTS[g.part!];
  return { w: g.part === 'flip' ? 124 : 112, h: Math.max(64, Math.max(spec.ins.length, spec.outs.length) * PIN + 26) };
}

export function nodeSize(g: MachineNode): { w: number; h: number } {
  return g.part ? partSize(g) : { w: 68, h: 68 };
}

export type Box = { id: string; x0: number; y0: number; x1: number; y1: number };

/** Okraj desky kolem stroje. */
export const PAD = 30;

/** Rozměry desky (W × H při měřítku 1) a posun stroje od jejího okraje, i s popisky kolem prvků. */
export function frameOf(m: Machine): { dx: number; dy: number; W: number; H: number } {
  const b: { x0: number; y0: number; x1: number; y1: number }[] = [];
  for (const i of m.inputs) b.push({ x0: i.x * G - 30, y0: i.y * G - 52, x1: i.x * G + 30, y1: i.y * G + 50 });
  for (const g of m.nodes) {
    const s = nodeSize(g);
    b.push({ x0: g.x * G - s.w / 2 - 34, y0: g.y * G - s.h / 2 - 30, x1: g.x * G + s.w / 2 + 34, y1: g.y * G + s.h / 2 + 30 });
  }
  for (const l of m.lamps) b.push({ x0: l.x * G - 30, y0: l.y * G - 52, x1: l.x * G + 30, y1: l.y * G + 52 });
  const x0 = Math.min(...b.map((r) => r.x0));
  const y0 = Math.min(...b.map((r) => r.y0));
  const x1 = Math.max(...b.map((r) => r.x1));
  const y1 = Math.max(...b.map((r) => r.y1));
  return { dx: PAD - x0, dy: PAD - y0, W: x1 - x0 + PAD * 2, H: y1 - y0 + PAD * 2 };
}

/** Obdélníky krystalů vstupů, kamenů, součástek a lamp (bez popisků pod nimi). */
export function boxes(m: Machine): Box[] {
  const at = (x: number, y: number, w: number, h: number, id: string): Box => ({
    id,
    x0: x * G - w / 2,
    y0: y * G - h / 2,
    x1: x * G + w / 2,
    y1: y * G + h / 2,
  });
  return [
    ...m.inputs.map((i) => at(i.x, i.y, 46, 58, `vstup ${i.id}`)),
    ...m.nodes.map((g) => {
      const s = nodeSize(g);
      return at(g.x, g.y, s.w, s.h, `${g.part ?? 'kámen'} ${g.id}`);
    }),
    ...m.lamps.map((l) => at(l.x, l.y, 46, 46, `lampa ${l.id}`)),
  ];
}

/** Vstupy se stejným písmenem (A₂ a A₁) nesou váhu jako index u písmene, ne pod krystalem. */
export function sharedLetter(m: Machine, id: string): boolean {
  const inp = m.inputs.find((i) => i.id === id);
  const name = inp?.label ?? id;
  return m.inputs.filter((i) => (i.label ?? i.id) === name).length > 1;
}

/**
 * Popisky kolem prvků (přibližně): písmeno vstupu nad krystalem, váha nebo číslice pod ním
 * a jméno lampy. Test hlídá, že nezasahují do jiných prvků ani do sebe navzájem.
 */
export function labelBoxes(m: Machine): Box[] {
  const out: Box[] = [];
  const weighted = new Set((m.numbers ?? []).flatMap((g) => g.bits));
  for (const i of m.inputs) {
    const x = i.x * G;
    const y = i.y * G;
    const shared = sharedLetter(m, i.id) && weighted.has(i.id);
    out.push({ id: `písmeno ${i.id}`, x0: x - (shared ? 14 : 9), y0: y - 51, x1: x + (shared ? 14 : 9), y1: y - 29 });
    if (!shared) out.push({ id: `pod vstupem ${i.id}`, x0: x - 8, y0: y + 31, x1: x + 8, y1: y + 49 });
  }
  for (const l of m.lamps) {
    const x = l.x * G;
    const y = l.y * G;
    const half = Math.max(8, l.label.length * 4.5);
    const below = l.from === 'top';
    out.push({ id: `popisek lampy ${l.id}`, x0: x - half, y0: below ? y + 27 : y - 45, x1: x + half, y1: below ? y + 45 : y - 27 });
  }
  return out;
}

/** Zkratky součástek pro malou desku (telefon na výšku) a jejich význam v legendě pod deskou. */
export const PART_ABBR: Record<string, string> = {
  half: 'PS',
  full: 'ÚS',
  mux: 'VÝH',
  dec: 'ROZ',
  latch: 'OZV',
  flip: 'OZV',
};
export const PART_FULL: Record<string, string> = {
  half: 'poloviční sčítačka',
  full: 'úplná sčítačka',
  mux: 'výhybka',
  dec: 'rozdělovač',
  latch: 'ozvěna',
  flip: 'ozvěna s tepem',
};
