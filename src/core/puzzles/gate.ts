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
  | { type: 'wrong'; failed: number[]; empty: boolean }
  | { type: 'step'; index: number }
  | { type: 'complete' };

type Result = { state: GateState; events: GateEvent[] };

/** Světlo v každém uzlu pro daný řádek. Prázdný kámen nepustí nic (null). */
export function evaluate(circuit: Circuit, runes: Record<string, Rune>, row: number): Record<string, number | null> {
  const n = circuit.inputs.length;
  const values: Record<string, number | null> = {};
  circuit.inputs.forEach((name, i) => (values[name] = inputBit(row, i, n)));
  for (const node of circuit.nodes) {
    const rune = node.rune ?? runes[node.id];
    const ins = node.from.map((f) => values[f] ?? null);
    values[node.id] = rune && ins.slice(0, ARITY[rune]).every((v) => v !== null) ? applyRune(rune, ins[0]!, ins[1] ?? 0) : null;
  }
  return values;
}

/** Tabulka lampy (null tam, kde kvůli prázdnému kameni nic nesvítí). */
export function lampTable(circuit: Circuit, runes: Record<string, Rune> = {}): (number | null)[] {
  return Array.from({ length: rowCount(circuit.inputs.length) }, (_, r) => evaluate(circuit, runes, r)[circuit.output]);
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
  return { step: 0, inputs: 0, runes: {}, tried: [0], moves: 0, mistakes: 0, failed: null, complete: false };
}

function advance(cfg: GateConfig, st: GateState, events: GateEvent[]): Result {
  events.push({ type: 'step', index: st.step });
  const step = st.step + 1;
  if (step >= cfg.tasks.length) {
    events.push({ type: 'complete' });
    return { state: { ...st, step, failed: null, complete: true }, events };
  }
  return { state: { ...st, step, inputs: 0, runes: {}, tried: [0], failed: null }, events };
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
  const lamp = evaluate(task.circuit, {}, inputs)[task.circuit.output] ?? 0;
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
  const lamps = lampTable(task.circuit, st.runes);
  const failed = lamps.flatMap((v, r) => (v !== task.target![r] ? [r] : []));
  const moves = st.moves + 1;
  if (failed.length) {
    const empty = slotNodes(task.circuit).some((s) => !st.runes[s.id]);
    return { state: { ...st, moves, mistakes: st.mistakes + 1, failed }, events: [{ type: 'wrong', failed, empty }] };
  }
  return advance(cfg, { ...st, moves }, []);
}

/** Ideál: zkoumání po jediné změně (Grayův kód), runy napoprvé. */
export function par(cfg: GateConfig): number {
  return cfg.tasks.reduce((sum, t) => sum + (t.mode === 'explore' ? rowCount(t.circuit.inputs.length) - 1 : 1), 0);
}

/** Všechna osazení prázdných kamenů, se kterými lampa splní desku. */
export function solutions(task: GateTask): Record<string, Rune>[] {
  const slots = slotNodes(task.circuit);
  const out: Record<string, Rune>[] = [];
  const walk = (k: number, acc: Record<string, Rune>) => {
    if (k === slots.length) {
      const lamps = lampTable(task.circuit, acc);
      if (task.target && lamps.every((v, r) => v === task.target![r])) out.push({ ...acc });
      return;
    }
    for (const r of slots[k].choices ?? []) walk(k + 1, { ...acc, [slots[k].id]: r });
  };
  walk(0, {});
  return out;
}

/**
 * Nápověda 3. stupně: při zkoumání vstup, který vede k nevyzkoušené kombinaci;
 * při vkládání run kámen, který se liší od nejbližšího řešení (a runa, která do něj patří).
 */
export function hint(cfg: GateConfig, st: GateState): { input: number } | { node: string; rune: Rune } | null {
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
  let best: Record<string, Rune> | null = null;
  let bestDiff = Infinity;
  for (const sol of solutions(task)) {
    const diff = slots.filter((s) => st.runes[s.id] !== sol[s.id]).length;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = sol;
    }
  }
  if (!best) return null;
  const off = slots.find((s) => st.runes[s.id] !== best![s.id]);
  return off ? { node: off.id, rune: best[off.id] } : null;
}
