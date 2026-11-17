/**
 * Archetyp „Dílna“ (Hlubina Strojů): stroj z run a součástek. Oproti Bráně má víc lamp,
 * součástky s několika výstupy (sčítačky, výhybka, rozdělovač, ozvěny) a paměť: světlo se smí
 * vracet zpátky (zpětná vazba) a ozvěna s tepem si zapamatuje, co k ní teklo ve chvíli tepu.
 *  - explore: stroj stojí hotový, hráč přepíná vstupy a zkouší všechny kombinace,
 *  - goals:   stroj stojí hotový a hráč ho vstupy a tepem dovede k cílům (paměť, čítač),
 *  - build:   hráč osazuje prázdné kameny runami a točí točitými kameny (odkud světlo teče),
 *             Zkouška pak projde všechny kombinace vstupů, nebo zkušební posloupnost s tepy.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { ARITY, applyRune, rowCount, type Rune } from '../logic';

/** Součástky: hotové obvody zabalené do jednoho kamene. */
export type PartKind = 'half' | 'full' | 'mux' | 'dec' | 'latch' | 'flip';

export interface PartSpec {
  ins: string[];
  outs: string[];
}

export const PARTS: Record<PartKind, PartSpec> = {
  /** Poloviční sčítačka: součet a přenos dvou světel. */
  half: { ins: ['A', 'B'], outs: ['S', 'P'] },
  /** Úplná sčítačka: dvě světla a přenos zprava. */
  full: { ins: ['A', 'B', 'P'], outs: ['S', 'P'] },
  /** Výhybka: volič V vybere, jestli dál teče A (stín), nebo B (světlo). */
  mux: { ins: ['A', 'B', 'V'], outs: ['Q'] },
  /** Rozdělovač: dvoubitové číslo rozsvítí právě jednu ze čtyř cest. */
  dec: { ins: ['2', '1'], outs: ['0', '1', '2', '3'] },
  /** Ozvěna: S ji rozsvítí, R zhasne, jinak drží, co měla. */
  latch: { ins: ['S', 'R'], outs: ['Q'] },
  /** Ozvěna s tepem: při tepu si zapamatuje světlo na vstupu D. */
  flip: { ins: ['D'], outs: ['Q'] },
};

/** Zdroj světla: vstup, stálý stín „0“ nebo světlo „1“, runa (id) nebo výstup součástky (id.výstup). */
export type Source = string;
/** Vstup kamene: pevný zdroj, nebo točitý kámen s nabídkou zdrojů. */
export type Pin = Source | Source[];

export const SHADOW = '0';
export const LIGHT = '1';

export interface MachineInput {
  id: string;
  /** Jméno na desce (výchozí je id). */
  label?: string;
  x: number;
  y: number;
  /** Kam ze vstupu teče světlo: doprava (výchozí), nebo dolů. */
  out?: 'right' | 'down';
}

export interface MachineNode {
  id: string;
  /** Pevná runa. */
  rune?: Rune;
  /** Prázdný kámen: runy, ze kterých hráč vybírá (všechny se stejným počtem vstupů). */
  choices?: Rune[];
  /** Součástka. */
  part?: PartKind;
  /** Odkud teče světlo do každého vstupu (u součástky v pořadí PARTS[part].ins). */
  in: Pin[];
  x: number;
  y: number;
  /**
   * Natočení: right = vstupy vlevo, výstupy vpravo (výchozí); down = vstupy shora, výstup dolů;
   * column = sčítačka jako sloupec Kaskády: A a B shora, přenos zprava, součet dolů a přenos doleva.
   */
  turn?: 'right' | 'down' | 'column';
}

export interface MachineLamp {
  id: string;
  label: string;
  in: Pin;
  x: number;
  y: number;
  /** Odkud světlo do lampy přitéká: zleva (výchozí), shora, nebo zdola. */
  from?: 'left' | 'top' | 'bottom';
}

/** Skupina krystalů nebo lamp, která tvoří číslo (bity od nejtěžšího). */
export interface NumberGroup {
  label: string;
  bits: string[];
}

export interface Machine {
  inputs: MachineInput[];
  nodes: MachineNode[];
  lamps: MachineLamp[];
  numbers?: NumberGroup[];
}

/** Krok zkušební posloupnosti: nastav vstupy (ostatní stín), případně tep, a co mají lampy ukázat. */
export interface ScriptStep {
  set: Record<string, number>;
  pulse?: boolean;
  expect: Record<string, number>;
}

/** Cíl: lampy (a případně vstupy) mají ukázat tohle. */
export interface Goal {
  say: string;
  lamps: Record<string, number>;
  inputs?: Record<string, number>;
}

export interface MachineTask {
  mode: 'explore' | 'goals' | 'build';
  machine: Machine;
  /** build: kdy má která lampa svítit, pro každý řádek vstupů (první vstup je nejvyšší bit). */
  target?: Record<string, number[]>;
  /** build se zkušební posloupností (paměť): kroky se projdou od zhasnuté paměti. */
  script?: ScriptStep[];
  /** goals: cíle, které stroj postupně splní. */
  goals?: Goal[];
  /** Pravidlo slovy (u velkých strojů místo desky). */
  rule?: string;
}

export interface MachineConfig {
  tasks: MachineTask[];
}

/** Co Zkouška našla: první řádek (nebo krok posloupnosti), kde lampy nesvítí správně. */
export interface Failure {
  /** Řádek vstupů (target), nebo pořadí kroku (script). */
  at: number;
  /** Kolik řádků (kroků) nesedí celkem. */
  count: number;
  /** Lampy, které v něm nesvítí správně. */
  lamps: string[];
  /** Některý kámen je prázdný nebo točitý kámen nenastavený. */
  empty: boolean;
  /** Lampy, jak opravdu svítily (null = nic nedoteklo). */
  shown: Record<string, number | null>;
}

export interface MachineState {
  step: number;
  /** Vstupy jako řádek tabulky (první vstup je nejvyšší bit). */
  inputs: number;
  runes: Record<string, Rune>;
  /** Natočení točitých kamenů: klíč (viz socketKey) → zdroj. */
  wires: Record<string, string>;
  /** Paměť stroje: ustálené světlo na výstupech kamenů a součástek. */
  memory: Record<string, number>;
  /** explore: vyzkoušené řádky (první je počáteční tma). */
  tried: number[];
  /** goals: pořadí cíle, na kterém se pracuje. */
  goal: number;
  moves: number;
  mistakes: number;
  failed: Failure | null;
  /** Stroj se neustálil (světlo v kruhu pořád přeskakuje). */
  restless: boolean;
  complete: boolean;
}

export type MachineEvent =
  | { type: 'input'; index: number; on: boolean }
  | { type: 'pulse' }
  | { type: 'tried'; row: number; count: number }
  | { type: 'goal'; index: number }
  | { type: 'rune'; node: string; rune: Rune }
  | { type: 'wire'; key: string; source: string }
  | { type: 'wrong'; failure: Failure }
  | { type: 'step'; index: number }
  | { type: 'complete' };

type Result = { state: MachineState; events: MachineEvent[] };

/* ───────────── stavba stroje ───────────── */

/** Kolik vstupů kámen má. */
export function arityOf(node: MachineNode): number {
  if (node.part) return PARTS[node.part].ins.length;
  return ARITY[node.rune ?? node.choices?.[0] ?? 'id'];
}

/** Výstupy kamene: klíče, pod kterými jeho světlo teče dál. */
export function outputsOf(node: MachineNode): string[] {
  if (!node.part) return [node.id];
  const outs = PARTS[node.part].outs;
  return outs.length === 1 ? [node.id] : outs.map((o) => `${node.id}.${o}`);
}

/** Klíč točitého kamene: k-tý vstup kamene, nebo vstup lampy. */
export const socketKey = (owner: string, k: number): string => `${owner}:${k}`;
export const lampKey = (lamp: string): string => `lamp:${lamp}`;

export interface Socket {
  key: string;
  /** Kámen (id) nebo lampa (lamp:id), kterému točitý kámen patří. */
  owner: string;
  index: number;
  choices: string[];
}

/** Všechny točité kameny stroje. */
export function sockets(m: Machine): Socket[] {
  const out: Socket[] = [];
  for (const g of m.nodes)
    g.in.forEach(
      (p, k) =>
        Array.isArray(p) &&
        out.push({
          key: socketKey(g.id, k),
          owner: g.id,
          index: k,
          choices: p,
        }),
    );
  for (const l of m.lamps)
    if (Array.isArray(l.in))
      out.push({
        key: lampKey(l.id),
        owner: lampKey(l.id),
        index: 0,
        choices: l.in,
      });
  return out;
}

export const slotNodes = (m: Machine): MachineNode[] => m.nodes.filter((g) => !g.rune && !g.part);

/** Odkud teče světlo do k-tého vstupu kamene (null = točitý kámen nenastavený). */
export function sourceOf(pin: Pin, key: string, wires: Record<string, string>): string | null {
  return Array.isArray(pin) ? (wires[key] ?? null) : pin;
}

export const hasPulse = (m: Machine): boolean => m.nodes.some((g) => g.part === 'flip');

/* ───────────── vyhodnocení ───────────── */

export interface Settled {
  /** Světlo na každém vstupu, výstupu kamene a v každé lampě (null = nic nedoteklo). */
  values: Record<string, number | null>;
  lamps: Record<string, number | null>;
  stable: boolean;
}

const bit = (v: number | null): number => (v ? 1 : 0);

function partOut(kind: PartKind, ins: number[], own: (k: number) => number): number[] {
  const [a, b, c] = ins;
  switch (kind) {
    case 'half':
      return [a ^ b, a & b];
    case 'full':
      return [a ^ b ^ c, (a & b) | (c & (a ^ b))];
    case 'mux':
      return [c ? b : a];
    case 'dec':
      return [0, 1, 2, 3].map((k) => (2 * a + b === k ? 1 : 0));
    case 'latch':
      return [a && !b ? 1 : b ? 0 : own(0)];
    case 'flip':
      return [own(0)];
  }
}

/**
 * Ustálí světlo ve stroji. Kameny se počítají v pořadí, v jakém stojí v seznamu; když světlo teče
 * zpátky (zpětná vazba), opakuje se to, dokud se nic nemění. Paměť dodá světlo, které ve stroji
 * bylo naposledy (ozvěny, smyčky). Prázdný kámen nebo nenastavený točitý kámen nepustí nic.
 */
export function settle(
  m: Machine,
  runes: Record<string, Rune>,
  wires: Record<string, string>,
  row: number,
  memory: Record<string, number> = {},
): Settled {
  const n = m.inputs.length;
  const values: Record<string, number | null> = { [SHADOW]: 0, [LIGHT]: 1 };
  m.inputs.forEach((inp, i) => (values[inp.id] = (row >> (n - 1 - i)) & 1));
  for (const g of m.nodes) for (const k of outputsOf(g)) values[k] = memory[k] ?? 0;

  let stable = false;
  for (let pass = 0; pass < m.nodes.length * 2 + 4 && !stable; pass++) {
    stable = true;
    for (const g of m.nodes) {
      const keys = outputsOf(g);
      const ins = g.in.map((p, k) => {
        const src = sourceOf(p, socketKey(g.id, k), wires);
        return src === null ? null : (values[src] ?? null);
      });
      let outs: (number | null)[];
      if (g.part) {
        outs = ins.some((v) => v === null) ? keys.map(() => null) : partOut(g.part, ins as number[], (k) => bit(values[keys[k]]));
      } else {
        const rune = g.rune ?? runes[g.id];
        outs = [rune && ins.slice(0, ARITY[rune]).every((v) => v !== null) ? applyRune(rune, ins[0]!, ins[1] ?? 0) : null];
      }
      keys.forEach((k, j) => {
        if (values[k] !== outs[j]) {
          values[k] = outs[j];
          stable = false;
        }
      });
    }
  }
  const lamps: Record<string, number | null> = {};
  for (const l of m.lamps) {
    const src = sourceOf(l.in, lampKey(l.id), wires);
    lamps[l.id] = src === null ? null : (values[src] ?? null);
  }
  return { values, lamps, stable };
}

/** Paměť po ustálení: světlo na výstupech všech kamenů. */
function memoryOf(m: Machine, s: Settled): Record<string, number> {
  const mem: Record<string, number> = {};
  for (const g of m.nodes) for (const k of outputsOf(g)) mem[k] = bit(s.values[k]);
  return mem;
}

/** Tep: všechny ozvěny s tepem naráz převezmou světlo ze svého vstupu D, pak se stroj znovu ustálí. */
export function beat(
  m: Machine,
  runes: Record<string, Rune>,
  wires: Record<string, string>,
  row: number,
  memory: Record<string, number>,
): { memory: Record<string, number>; settled: Settled } {
  const before = settle(m, runes, wires, row, memory);
  const mem = memoryOf(m, before);
  for (const g of m.nodes) {
    if (g.part !== 'flip') continue;
    const src = sourceOf(g.in[0], socketKey(g.id, 0), wires);
    mem[g.id] = src === null ? 0 : bit(before.values[src]);
  }
  const settled = settle(m, runes, wires, row, mem);
  return { memory: memoryOf(m, settled), settled };
}

/** Řádek vstupů z hodnot jednotlivých vstupů (chybějící jsou stín). */
export function rowOf(m: Machine, set: Record<string, number>): number {
  const n = m.inputs.length;
  return m.inputs.reduce((row, inp, i) => (set[inp.id] ? row | (1 << (n - 1 - i)) : row), 0);
}

export const inputOn = (m: Machine, row: number, id: string): number => {
  const i = m.inputs.findIndex((inp) => inp.id === id);
  return i < 0 ? 0 : (row >> (m.inputs.length - 1 - i)) & 1;
};

/** Hodnota čísla (skupiny krystalů nebo lamp) při daném stavu. */
export function numberValue(group: NumberGroup, valueOf: (id: string) => number | null): number {
  return group.bits.reduce((sum, id) => sum * 2 + bit(valueOf(id)), 0);
}

/* ───────────── průběh úlohy ───────────── */

export function currentTask(cfg: MachineConfig, st: MachineState): MachineTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Úloha, kterou je vidět: aktuální, po dokončení ta poslední. */
export function shownTask(cfg: MachineConfig, st: MachineState): MachineTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

const fresh = {
  inputs: 0,
  runes: {},
  wires: {},
  memory: {},
  tried: [0],
  goal: 0,
  failed: null,
  restless: false,
};

export function initMachine(cfg?: MachineConfig): MachineState {
  const st: MachineState = {
    step: 0,
    ...fresh,
    moves: 0,
    mistakes: 0,
    complete: false,
  };
  return cfg ? withMemory(cfg, st) : st;
}

/** Paměť nové úlohy: stroj se ustálí z úplné tmy. */
function withMemory(cfg: MachineConfig, st: MachineState): MachineState {
  const task = cfg.tasks[st.step];
  if (!task) return st;
  const s = settle(task.machine, st.runes, st.wires, st.inputs, {});
  return { ...st, memory: memoryOf(task.machine, s), restless: !s.stable };
}

function advance(cfg: MachineConfig, st: MachineState, events: MachineEvent[]): Result {
  events.push({ type: 'step', index: st.step });
  const step = st.step + 1;
  if (step >= cfg.tasks.length) {
    events.push({ type: 'complete' });
    return { state: { ...st, step, failed: null, complete: true }, events };
  }
  return { state: withMemory(cfg, { ...st, step, ...fresh }), events };
}

/** Splňuje stav cíl? */
export function meets(task: MachineTask, goal: Goal, st: Pick<MachineState, 'inputs' | 'runes' | 'wires' | 'memory'>): boolean {
  const m = task.machine;
  const s = settle(m, st.runes, st.wires, st.inputs, st.memory);
  const lampsOk = Object.entries(goal.lamps).every(([id, v]) => bit(s.lamps[id]) === v);
  const inputsOk = Object.entries(goal.inputs ?? {}).every(([id, v]) => inputOn(m, st.inputs, id) === v);
  return lampsOk && inputsOk;
}

/** Po tahu v cílech: splněný cíl posune hráče dál, poslední cíl úlohu dokončí. */
function checkGoal(cfg: MachineConfig, task: MachineTask, st: MachineState, events: MachineEvent[]): Result {
  const goals = task.goals ?? [];
  const goal = goals[st.goal];
  if (!goal || !meets(task, goal, st)) return { state: st, events };
  events.push({ type: 'goal', index: st.goal });
  const next = { ...st, goal: st.goal + 1 };
  if (next.goal >= goals.length) return advance(cfg, next, events);
  return { state: next, events };
}

/** Přepne krystal vstupu. Při zkoumání a v cílech je to tah; při stavbě jen zkouška naživo. */
export function toggleInput(cfg: MachineConfig, st: MachineState, index: number): Result {
  const task = currentTask(cfg, st);
  const m = task?.machine;
  const n = m?.inputs.length ?? 0;
  if (!task || !m || index < 0 || index >= n) return { state: st, events: [] };
  const inputs = st.inputs ^ (1 << (n - 1 - index));
  const s = settle(m, st.runes, st.wires, inputs, st.memory);
  const moved = { ...st, inputs, memory: memoryOf(m, s), restless: !s.stable };
  const events: MachineEvent[] = [{ type: 'input', index, on: ((inputs >> (n - 1 - index)) & 1) === 1 }];
  if (task.mode === 'build') return { state: moved, events };
  const next = { ...moved, moves: st.moves + 1 };
  if (task.mode === 'goals') return checkGoal(cfg, task, next, events);
  if (st.tried.includes(inputs)) return { state: next, events };
  const tried = [...st.tried, inputs];
  events.push({ type: 'tried', row: inputs, count: tried.length });
  if (tried.length >= rowCount(n)) return advance(cfg, { ...next, tried }, events);
  return { state: { ...next, tried }, events };
}

/** Tep Srdce: ozvěny s tepem si zapamatují, co k nim teče. V cílech je to tah. */
export function pulse(cfg: MachineConfig, st: MachineState): Result {
  const task = currentTask(cfg, st);
  if (!task || !hasPulse(task.machine)) return { state: st, events: [] };
  const b = beat(task.machine, st.runes, st.wires, st.inputs, st.memory);
  const moved = { ...st, memory: b.memory, restless: !b.settled.stable };
  const events: MachineEvent[] = [{ type: 'pulse' }];
  if (task.mode !== 'goals') return { state: moved, events };
  return checkGoal(cfg, task, { ...moved, moves: st.moves + 1 }, events);
}

/** Po změně kamene se stroj ustálí znovu (paměť zůstává). */
function resettle(task: MachineTask, st: MachineState): MachineState {
  const s = settle(task.machine, st.runes, st.wires, st.inputs, st.memory);
  return {
    ...st,
    memory: memoryOf(task.machine, s),
    restless: !s.stable,
    failed: null,
  };
}

/** Vloží runu do prázdného kamene (není to tah: tahem je až Zkouška). */
export function setRune(cfg: MachineConfig, st: MachineState, node: string, rune: Rune): Result {
  const task = currentTask(cfg, st);
  const slot = task?.mode === 'build' ? slotNodes(task.machine).find((s) => s.id === node) : undefined;
  if (!task || !slot || !slot.choices?.includes(rune) || st.runes[node] === rune) return { state: st, events: [] };
  return {
    state: resettle(task, { ...st, runes: { ...st.runes, [node]: rune } }),
    events: [{ type: 'rune', node, rune }],
  };
}

/** Nastaví točitý kámen na zdroj světla (není to tah). */
export function setWire(cfg: MachineConfig, st: MachineState, key: string, source: string): Result {
  const task = currentTask(cfg, st);
  const socket = task?.mode === 'build' ? sockets(task.machine).find((s) => s.key === key) : undefined;
  if (!task || !socket || !socket.choices.includes(source) || st.wires[key] === source) return { state: st, events: [] };
  return {
    state: resettle(task, { ...st, wires: { ...st.wires, [key]: source } }),
    events: [{ type: 'wire', key, source }],
  };
}

/** Další zdroj na točitém kameni (kliknutí kámen pootočí). */
export function nextSource(task: MachineTask, st: Pick<MachineState, 'wires'>, key: string): string | null {
  const socket = sockets(task.machine).find((s) => s.key === key);
  if (!socket) return null;
  const k = st.wires[key] ? socket.choices.indexOf(st.wires[key]) : -1;
  return socket.choices[(k + 1) % socket.choices.length];
}

/** Další runa v nabídce kamene. */
export function nextRune(task: MachineTask, st: Pick<MachineState, 'runes'>, node: string): Rune | null {
  const slot = slotNodes(task.machine).find((s) => s.id === node);
  if (!slot?.choices?.length) return null;
  const k = st.runes[node] ? slot.choices.indexOf(st.runes[node]) : -1;
  return slot.choices[(k + 1) % slot.choices.length];
}

/**
 * Zkouška stroje: první řádek (krok), kde lampy nesvítí podle brány, a kolik takových je.
 * quick: stačí vědět, jestli stroj projde (řešitel), počítání se zastaví u první chyby.
 */
export function examine(task: MachineTask, runes: Record<string, Rune>, wires: Record<string, string>, quick = false): Failure | null {
  const m = task.machine;
  const empty = slotNodes(m).some((s) => !runes[s.id]) || sockets(m).some((s) => !wires[s.key]);
  let first: Failure | null = null;
  let count = 0;
  const check = (at: number, expect: Record<string, number>, shown: Record<string, number | null>) => {
    const lamps = Object.keys(expect).filter((id) => shown[id] !== expect[id]);
    if (!lamps.length) return;
    count++;
    first ??= { at, count: 0, lamps, empty, shown };
  };
  if (task.script) {
    let memory: Record<string, number> = memoryOf(m, settle(m, runes, wires, 0, {}));
    task.script.forEach((step, k) => {
      if (quick && first) return;
      const row = rowOf(m, step.set);
      let s = settle(m, runes, wires, row, memory);
      memory = memoryOf(m, s);
      if (step.pulse) {
        const b = beat(m, runes, wires, row, memory);
        memory = b.memory;
        s = b.settled;
      }
      check(k, step.expect, s.lamps);
    });
  } else if (task.target) {
    const target = task.target;
    for (let r = 0; r < rowCount(m.inputs.length) && !(quick && first); r++) {
      const expect = Object.fromEntries(Object.entries(target).map(([id, t]) => [id, t[r]]));
      check(r, expect, settle(m, runes, wires, r, {}).lamps);
    }
  }
  return first ? { ...(first as Failure), count } : null;
}

/** Zkouška: stroj projde všechny kombinace (nebo zkušební posloupnost). Každá Zkouška je jeden tah. */
export function test(cfg: MachineConfig, st: MachineState): Result {
  const task = currentTask(cfg, st);
  if (!task || task.mode !== 'build') return { state: st, events: [] };
  const failure = examine(task, st.runes, st.wires);
  const moves = st.moves + 1;
  if (failure)
    return {
      state: { ...st, moves, mistakes: st.mistakes + 1, failed: failure },
      events: [{ type: 'wrong', failure }],
    };
  return advance(cfg, { ...st, moves }, []);
}

/* ───────────── řešitel ───────────── */

export interface MachineSolution {
  runes: Record<string, Rune>;
  wires: Record<string, string>;
}

/** Řešení úloh se počítají jednou: nápověda se ptá po každém kliknutí. */
const solved = new WeakMap<MachineTask, MachineSolution[]>();

/** Všechna osazení prázdných kamenů a natočení točitých kamenů, se kterými stroj projde Zkouškou. */
export function solutions(task: MachineTask, limit = Infinity): MachineSolution[] {
  const known = solved.get(task);
  if (known) return known.slice(0, limit);
  const all = search(task, limit);
  if (limit === Infinity) solved.set(task, all);
  return all;
}

function search(task: MachineTask, limit: number): MachineSolution[] {
  const slots = slotNodes(task.machine);
  const socks = sockets(task.machine);
  const out: MachineSolution[] = [];
  const walkWires = (k: number, runes: Record<string, Rune>, wires: Record<string, string>): void => {
    if (out.length >= limit) return;
    if (k === socks.length) {
      if (!examine(task, runes, wires, true)) out.push({ runes: { ...runes }, wires: { ...wires } });
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

type Action = { input: number } | { pulse: true };

/** Nejkratší cesta k cíli (přepínání vstupů a tepy), nebo null, když cíl nejde splnit. */
export function pathToGoal(
  task: MachineTask,
  goal: Goal,
  st: Pick<MachineState, 'inputs' | 'runes' | 'wires' | 'memory'>,
  maxDepth = 12,
): Action[] | null {
  const m = task.machine;
  const n = m.inputs.length;
  const actions: Action[] = [...Array.from({ length: n }, (_, i) => ({ input: i })), ...(hasPulse(m) ? [{ pulse: true as const }] : [])];
  type Node = {
    inputs: number;
    memory: Record<string, number>;
    path: Action[];
  };
  const keyOf = (x: Node) => x.inputs + '|' + JSON.stringify(x.memory);
  let frontier: Node[] = [{ inputs: st.inputs, memory: st.memory, path: [] }];
  const seen = new Set(frontier.map(keyOf));
  for (let depth = 0; depth <= maxDepth; depth++) {
    const nextFrontier: Node[] = [];
    for (const x of frontier) {
      if (meets(task, goal, { ...st, inputs: x.inputs, memory: x.memory })) return x.path;
      for (const a of actions) {
        let y: Node;
        if ('input' in a) {
          const inputs = x.inputs ^ (1 << (n - 1 - a.input));
          y = {
            inputs,
            memory: memoryOf(m, settle(m, st.runes, st.wires, inputs, x.memory)),
            path: [...x.path, a],
          };
        } else {
          y = {
            inputs: x.inputs,
            memory: beat(m, st.runes, st.wires, x.inputs, x.memory).memory,
            path: [...x.path, a],
          };
        }
        const k = keyOf(y);
        if (seen.has(k)) continue;
        seen.add(k);
        nextFrontier.push(y);
      }
    }
    frontier = nextFrontier;
  }
  return null;
}

/** Ideál: zkoumání po jediné změně, cíle nejkratší cestou, stavba napoprvé. */
export function par(cfg: MachineConfig): number {
  let total = 0;
  for (const task of cfg.tasks) {
    if (task.mode === 'explore') total += rowCount(task.machine.inputs.length) - 1;
    else if (task.mode === 'build') total += 1;
    else {
      let st = withMemory({ tasks: [task] }, initMachine());
      for (const goal of task.goals ?? []) {
        const path = pathToGoal(task, goal, st) ?? [];
        total += path.length;
        for (const a of path) {
          if ('input' in a) {
            const inputs = st.inputs ^ (1 << (task.machine.inputs.length - 1 - a.input));
            st = {
              ...st,
              inputs,
              memory: memoryOf(task.machine, settle(task.machine, st.runes, st.wires, inputs, st.memory)),
            };
          } else
            st = {
              ...st,
              memory: beat(task.machine, st.runes, st.wires, st.inputs, st.memory).memory,
            };
        }
      }
    }
  }
  return total;
}

/**
 * Nápověda 3. stupně: při zkoumání vstup k nevyzkoušené kombinaci, v cílech další krok nejkratší
 * cesty (vstup, nebo tep), při stavbě kámen nebo točitý kámen, který se liší od nejbližšího řešení.
 */
export type MachineHint = { input: number } | { pulse: true } | { node: string; rune: Rune } | { socket: string; source: string };

export function hint(cfg: MachineConfig, st: MachineState): MachineHint | null {
  const task = currentTask(cfg, st);
  if (!task) return null;
  const n = task.machine.inputs.length;
  if (task.mode === 'explore') {
    for (let i = 0; i < n; i++) if (!st.tried.includes(st.inputs ^ (1 << (n - 1 - i)))) return { input: i };
    const goal = Array.from({ length: rowCount(n) }, (_, r) => r).find((r) => !st.tried.includes(r));
    if (goal === undefined) return null;
    for (let i = 0; i < n; i++) if (((goal ^ st.inputs) >> (n - 1 - i)) & 1) return { input: i };
    return null;
  }
  if (task.mode === 'goals') {
    const goal = task.goals?.[st.goal];
    const path = goal ? pathToGoal(task, goal, st) : null;
    return path?.[0] ?? null;
  }
  const slots = slotNodes(task.machine);
  const socks = sockets(task.machine);
  let best: MachineSolution | null = null;
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

/* ───────────── pomůcky pro obsah ───────────── */

/** Deska lamp z pravidla: pro každý řádek vstupů spočítá, co má která lampa ukázat. */
export function targetFrom(m: Machine, rule: (input: (id: string) => number) => Record<string, number>): Record<string, number[]> {
  const out: Record<string, number[]> = Object.fromEntries(m.lamps.map((l) => [l.id, [] as number[]]));
  for (let r = 0; r < rowCount(m.inputs.length); r++) {
    const want = rule((id) => inputOn(m, r, id));
    for (const l of m.lamps) out[l.id].push(want[l.id] ?? 0);
  }
  return out;
}

/** Hodnota čísla ze vstupů (bity od nejtěžšího). */
export const numberOf = (input: (id: string) => number, bits: string[]): number => bits.reduce((s, id) => s * 2 + input(id), 0);

/** Lampy čísla: bity hodnoty v pořadí od nejtěžšího. */
export function bitsOf(value: number, ids: string[]): Record<string, number> {
  return Object.fromEntries(ids.map((id, i) => [id, (value >> (ids.length - 1 - i)) & 1]));
}
