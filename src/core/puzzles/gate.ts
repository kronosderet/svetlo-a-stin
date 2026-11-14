/**
 * Archetyp „Brána“: obvod vytesaný do kamenné desky. Vlevo krystaly vstupů, uprostřed kameny
 * s runami, vpravo lampa. Světlovody vedou světlo od vstupů přes runy k lampě.
 *  - explore: runy stojí pevně, hráč přepíná vstupy a zkouší všechny kombinace,
 *  - slots:   hráč vkládá runy do prázdných kamenů, aby lampa svítila přesně podle desky
 *             (požadované pravdivostní tabulky), a ověří to Zkouškou.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { ARITY, applyRune, inputBit, rowCount, type Rune } from '../logic';

export interface GateNode {
  id: string;
  /** Pevná runa. */
  rune?: Rune;
  /** Prázdný kámen: runy, ze kterých hráč vybírá (všechny se stejným počtem vstupů). */
  choices?: Rune[];
  /** Odkud do runy teče světlo: název vstupu (A, B…), nebo id jiné runy dřív v seznamu. */
  from: string[];
  /**
   * Točité kameny: každý vstup runy si hráč nastaví na jeden z těchto zdrojů (from se pak
   * nepoužije). Tak jde z Prapečetí postavit NOT, AND i OR bez kreslení vodičů.
   */
  free?: string[];
  /** Poloha na desce (sloupec 1… a řádek, smí být i půlka). */
  col: number;
  row: number;
}

export interface Circuit {
  inputs: string[];
  /** Runy v pořadí, ve kterém teče světlo (každá bere jen z dřívějších). */
  nodes: GateNode[];
  /** Runa, jejíž světlo svítí v lampě. */
  output: string;
}

export interface GateTask {
  circuit: Circuit;
  mode: 'explore' | 'slots';
  /** slots: požadovaný stav lampy pro každý řádek tabulky. */
  target?: number[];
  /** Starý obvod, který má hráč nahradit kratším (deska brány je jeho deska). */
  reference?: Circuit;
}

export interface GateConfig {
  tasks: GateTask[];
}

export interface GateState {
  step: number;
  /** Vstupy jako řádek tabulky (A je nejvyšší bit). */
  inputs: number;
  /** Runy vložené do prázdných kamenů aktuální úlohy. */
  runes: Record<string, Rune>;
  /** Nastavení točitých kamenů: klíč „runa:vstup“ → zdroj světla. */
  wires: Record<string, string>;
  /** explore: řádky, které hráč už vyzkoušel (první je počáteční tma). */
  tried: number[];
  moves: number;
  mistakes: number;
  /** slots: řádky, ve kterých lampa při poslední Zkoušce nesvítila správně. */
  failed: number[] | null;
  complete: boolean;
}

export type GateEvent =
  | { type: 'input'; index: number; on: boolean }
  | { type: 'tried'; row: number; count: number; lamp: number }
  | { type: 'rune'; node: string; rune: Rune }
  | { type: 'wire'; key: string; source: string }
  | { type: 'wrong'; failed: number[]; empty: boolean }
  | { type: 'step'; index: number }
  | { type: 'complete' };

type Result = { state: GateState; events: GateEvent[] };

/** Klíč točitého kamene: k-tý vstup runy. */
export const socketKey = (node: string, k: number): string => node + ':' + k;

/** Kolik vstupů runa v uzlu má. */
const arityOf = (node: GateNode): number => ARITY[node.rune ?? node.choices?.[0] ?? 'id'];

/** Odkud runa bere světlo: pevné vodiče, nebo nastavení točitých kamenů (null = nenastaveno). */
export function sourcesOf(node: GateNode, wires: Record<string, string>): (string | null)[] {
  if (!node.free) return node.from;
  return Array.from({ length: arityOf(node) }, (_, j) => wires[socketKey(node.id, j)] ?? null);
}

/** Světlo v každém uzlu pro daný řádek. Prázdný kámen nebo nenastavený vstup nepustí nic (null). */
export function evaluate(
  circuit: Circuit,
  runes: Record<string, Rune>,
  row: number,
  wires: Record<string, string> = {},
): Record<string, number | null> {
  const n = circuit.inputs.length;
  const values: Record<string, number | null> = {};
  circuit.inputs.forEach((name, i) => (values[name] = inputBit(row, i, n)));
  for (const node of circuit.nodes) {
    const rune = node.rune ?? runes[node.id];
    const ins = sourcesOf(node, wires).map((f) => (f === null ? null : (values[f] ?? null)));
    values[node.id] = rune && ins.slice(0, ARITY[rune]).every((v) => v !== null) ? applyRune(rune, ins[0]!, ins[1] ?? 0) : null;
  }
  return values;
}

/** Tabulka lampy (null tam, kde kvůli prázdnému kameni nic nesvítí). */
export function lampTable(circuit: Circuit, runes: Record<string, Rune> = {}, wires: Record<string, string> = {}): (number | null)[] {
  return Array.from({ length: rowCount(circuit.inputs.length) }, (_, r) => evaluate(circuit, runes, r, wires)[circuit.output]);
}

/** Všechny točité kameny obvodu (klíč a zdroje, mezi kterými se točí). */
export function sockets(circuit: Circuit): { key: string; node: string; choices: string[] }[] {
  return circuit.nodes.flatMap((g) =>
    g.free ? Array.from({ length: arityOf(g) }, (_, j) => ({ key: socketKey(g.id, j), node: g.id, choices: g.free! })) : [],
  );
}

export const slotNodes = (circuit: Circuit): GateNode[] => circuit.nodes.filter((n) => !n.rune);

export function currentTask(cfg: GateConfig, st: GateState): GateTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Úloha, kterou je vidět: aktuální, po dokončení ta poslední. */
export function shownTask(cfg: GateConfig, st: GateState): GateTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

export function initGate(): GateState {
  return { step: 0, inputs: 0, runes: {}, wires: {}, tried: [0], moves: 0, mistakes: 0, failed: null, complete: false };
}

function advance(cfg: GateConfig, st: GateState, events: GateEvent[]): Result {
  events.push({ type: 'step', index: st.step });
  const step = st.step + 1;
  if (step >= cfg.tasks.length) {
    events.push({ type: 'complete' });
    return { state: { ...st, step, failed: null, complete: true }, events };
  }
  return { state: { ...st, step, inputs: 0, runes: {}, wires: {}, tried: [0], failed: null }, events };
}

/** Přepne krystal vstupu. Při zkoumání je to tah a nová kombinace se zapíše; jinak jen zkouška naživo. */
export function toggleInput(cfg: GateConfig, st: GateState, index: number): Result {
  const task = currentTask(cfg, st);
  const n = task?.circuit.inputs.length ?? 0;
  if (!task || index < 0 || index >= n) return { state: st, events: [] };
  const inputs = st.inputs ^ (1 << (n - 1 - index));
  const events: GateEvent[] = [{ type: 'input', index, on: inputBit(inputs, index, n) === 1 }];
  if (task.mode !== 'explore') return { state: { ...st, inputs }, events };
  const next = { ...st, inputs, moves: st.moves + 1 };
  if (st.tried.includes(inputs)) return { state: next, events };
  const tried = [...st.tried, inputs];
  const lamp = evaluate(task.circuit, {}, inputs, st.wires)[task.circuit.output] ?? 0;
  events.push({ type: 'tried', row: inputs, count: tried.length, lamp });
  if (tried.length >= rowCount(n)) return advance(cfg, { ...next, tried }, events);
  return { state: { ...next, tried }, events };
}

/** Vloží runu do prázdného kamene (není to tah: tahem je až Zkouška). */
export function setRune(cfg: GateConfig, st: GateState, node: string, rune: Rune): Result {
  const task = currentTask(cfg, st);
  const slot = task?.mode === 'slots' ? slotNodes(task.circuit).find((s) => s.id === node) : undefined;
  if (!slot || !slot.choices?.includes(rune) || st.runes[node] === rune) return { state: st, events: [] };
  return { state: { ...st, runes: { ...st.runes, [node]: rune }, failed: null }, events: [{ type: 'rune', node, rune }] };
}

/** Nastaví točitý kámen na zdroj světla (není to tah). */
export function setWire(cfg: GateConfig, st: GateState, key: string, source: string): Result {
  const task = currentTask(cfg, st);
  const socket = task?.mode === 'slots' ? sockets(task.circuit).find((s) => s.key === key) : undefined;
  if (!socket || !socket.choices.includes(source) || st.wires[key] === source) return { state: st, events: [] };
  return { state: { ...st, wires: { ...st.wires, [key]: source }, failed: null }, events: [{ type: 'wire', key, source }] };
}

/** Další zdroj na točitém kameni (kliknutí kámen pootočí). */
export function nextSource(cfg: GateConfig, st: GateState, key: string): string | null {
  const task = currentTask(cfg, st);
  const socket = task ? sockets(task.circuit).find((s) => s.key === key) : undefined;
  if (!socket) return null;
  const k = st.wires[key] ? socket.choices.indexOf(st.wires[key]) : -1;
  return socket.choices[(k + 1) % socket.choices.length];
}

/** Další runa v nabídce kamene (kliknutí na kámen runy střídá). */
export function nextRune(cfg: GateConfig, st: GateState, node: string): Rune | null {
  const task = currentTask(cfg, st);
  const slot = task ? slotNodes(task.circuit).find((s) => s.id === node) : undefined;
  if (!slot?.choices?.length) return null;
  const k = st.runes[node] ? slot.choices.indexOf(st.runes[node]) : -1;
  return slot.choices[(k + 1) % slot.choices.length];
}

/** Zkouška: lampa projde všechny kombinace vstupů. Každá Zkouška je jeden tah. */
export function test(cfg: GateConfig, st: GateState): Result {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'slots' || !task.target) return { state: st, events: [] };
  const lamps = lampTable(task.circuit, st.runes, st.wires);
  const failed = lamps.flatMap((v, r) => (v !== task.target![r] ? [r] : []));
  const moves = st.moves + 1;
  if (failed.length) {
    const empty = slotNodes(task.circuit).some((s) => !st.runes[s.id]) || sockets(task.circuit).some((s) => !st.wires[s.key]);
    return { state: { ...st, moves, mistakes: st.mistakes + 1, failed }, events: [{ type: 'wrong', failed, empty }] };
  }
  return advance(cfg, { ...st, moves }, []);
}

/** Ideál: zkoumání po jediné změně (Grayův kód), runy napoprvé. */
export function par(cfg: GateConfig): number {
  return cfg.tasks.reduce((sum, t) => sum + (t.mode === 'explore' ? rowCount(t.circuit.inputs.length) - 1 : 1), 0);
}

export interface GateSolution {
  runes: Record<string, Rune>;
  wires: Record<string, string>;
}

/** Všechna osazení prázdných kamenů a natočení točitých kamenů, se kterými lampa splní desku. */
export function solutions(task: GateTask): GateSolution[] {
  const slots = slotNodes(task.circuit);
  const socks = sockets(task.circuit);
  const out: GateSolution[] = [];
  const walkWires = (k: number, runes: Record<string, Rune>, wires: Record<string, string>): void => {
    if (k === socks.length) {
      const lamps = lampTable(task.circuit, runes, wires);
      if (task.target && lamps.every((v, r) => v === task.target![r])) out.push({ runes: { ...runes }, wires: { ...wires } });
      return;
    }
    for (const src of socks[k].choices) walkWires(k + 1, runes, { ...wires, [socks[k].key]: src });
  };
  const walkRunes = (k: number, acc: Record<string, Rune>): void => {
    if (k === slots.length) return walkWires(0, acc, {});
    for (const r of slots[k].choices ?? []) walkRunes(k + 1, { ...acc, [slots[k].id]: r });
  };
  walkRunes(0, {});
  return out;
}

/**
 * Nápověda 3. stupně: při zkoumání vstup, který vede k nevyzkoušené kombinaci;
 * při vkládání run kámen, který se liší od nejbližšího řešení (a runa, která do něj patří).
 */
export type GateHint = { input: number } | { node: string; rune: Rune } | { socket: string; source: string };

export function hint(cfg: GateConfig, st: GateState): GateHint | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  const n = task.circuit.inputs.length;
  if (task.mode === 'explore') {
    for (let i = 0; i < n; i++) if (!st.tried.includes(st.inputs ^ (1 << (n - 1 - i)))) return { input: i };
    // Žádný soused není nový: krok k nejbližší nevyzkoušené kombinaci.
    const goal = Array.from({ length: rowCount(n) }, (_, r) => r).find((r) => !st.tried.includes(r));
    if (goal === undefined) return null;
    for (let i = 0; i < n; i++) if (inputBit(goal ^ st.inputs, i, n)) return { input: i };
    return null;
  }
  const slots = slotNodes(task.circuit);
  const socks = sockets(task.circuit);
  let best: GateSolution | null = null;
  let bestDiff = Infinity;
  for (const sol of solutions(task)) {
    const diff =
      slots.filter((s) => st.runes[s.id] !== sol.runes[s.id]).length + socks.filter((s) => st.wires[s.key] !== sol.wires[s.key]).length;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = sol;
    }
  }
  if (!best) return null;
  const off = slots.find((s) => st.runes[s.id] !== best!.runes[s.id]);
  if (off) return { node: off.id, rune: best.runes[off.id] };
  const sock = socks.find((s) => st.wires[s.key] !== best!.wires[s.key]);
  return sock ? { socket: sock.key, source: best.wires[sock.key] } : null;
}
