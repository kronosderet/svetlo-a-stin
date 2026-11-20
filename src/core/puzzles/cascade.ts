/**
 * Archetyp „Kaskáda“: počítání pod sebou, jako na papíře.
 * Chrám rozsvítí ve stěně řádky (sčítance, menšence a menšitele, nebo posunuté kopie při
 * násobení). Hráč rozsvěcí krystaly výsledku a krystaly přenosu nad sloupci a výsledek potvrdí.
 * Chyba ukáže první sloupec zprava, který nesedí: nejdřív přenos, který do něj vtéká, pak výsledek.
 * Čistě funkční: každá operace vrací nový stav a seznam událostí pro UI.
 */
import { flipBit, isBitSet } from '../bits';

export type CascadeTask =
  | { op: 'add'; operands: number[] }
  | { op: 'sub'; operands: [number, number] }
  | { op: 'mul'; operands: [number, number] };

export interface CascadeConfig {
  /** Počet krystalů výsledku (sloupců). */
  width: number;
  /** Šířka řádků ve stěně (u násobení šířka prvního činitele). Výchozí je width. */
  bits?: number;
  /** none = přenosy nejsou vidět ani se nekontrolují; manual = hráč je sám umisťuje. */
  carries: 'none' | 'manual';
  /** Pevná nádoba: přenos z nejvyššího sloupce vyteče do přepadu a hráč ho tam musí poslat. */
  overflow?: boolean;
  /**
   * Násobení: posunuté kopie prvního činitele nejsou ve stěně hotové. Stěna nabídne kopii pro
   * každé místo druhého činitele (×1, ×2, ×4…) a hráč rozsvítí ty, které patří k jeho jedničkám.
   */
  pickCopies?: boolean;
  /** Tři řady: kromě přenosu o jedno místo i přenos o dvě místa (čtyři světla ve sloupci = 100). */
  farCarries?: boolean;
  /**
   * Ukázková úloha (pořadí): přenosy nebo výpůjčky v ní jsou předem na místě a hráč jen dopočítá
   * výsledek. Echo je okomentuje (Výpůjčka: kam se výpůjčka zapisuje).
   */
  demo?: number;
  /**
   * Zachování světla: krystal jde rozsvítit, jen když do něj má odkud přitéct světlo (lightFlow).
   * Dvě světla ze sloupce vpravo přetečou jako jedno, výpůjčka dá sousedovi vpravo dvě, dolů do
   * výsledku se vejde jen jedno. Zhasnutý krystal vezme světlo i krystalům, které z něj svítily.
   * Brány ho nemají: v nich hráč ukazuje, že počítá sám.
   */
  conserve?: boolean;
  tasks: CascadeTask[];
}

/**
 * Buňka, kterou hráč přepíná: krystal výsledku, krystal přenosu nad sloupcem, krystal přenosu
 * o dvě místa (far), nebo vypínač kopie při násobení (copy, column = o kolik míst je posunutá).
 */
export type CascadeCell = { row: 'carry' | 'result' | 'far' | 'copy'; column: number };

export interface CascadeState {
  step: number;
  result: number;
  /** Krystaly přenosu: bit i = krystal nad sloupcem i (vtéká do něj zprava). Bit width = přepad. */
  carries: number;
  /** Přenosy o dvě místa: bit i = krystal, který do sloupce i přitekl ze sloupce i − 2. */
  far: number;
  /** Násobení: rozsvícené kopie (bit j = kopie posunutá o j míst). */
  copies: number;
  moves: number;
  mistakes: number;
  /** Buňka, kterou označilo poslední chybné potvrzení. Smaže ji další dotek. */
  wrong: CascadeCell | null;
  /** Buňky („řádek:sloupec“), u kterých potvrzení v této úloze už jednou neprošlo. */
  missed: string[];
  complete: boolean;
}

export type CascadeEvent =
  /** dropped = krystaly, které se zhasnutím přišly o světlo a zhasly s ním (zachování světla). */
  | { type: 'toggle'; cell: CascadeCell; on: boolean; dropped?: CascadeCell[] }
  /** Zachování světla: krystal se nerozsvítil, protože do něj nemá odkud přitéct světlo. */
  | { type: 'refuse'; cell: CascadeCell }
  /**
   * inflow = kolik světla se ve sloupci slévá (u přenosu: ve sloupci vpravo, odkud přenos teče).
   * again = tatáž buňka neprošla už podruhé: hláška pak řekne konkrétní krystal, poprvé se jen ptá.
   */
  | { type: 'wrong'; cell: CascadeCell; expected: boolean; inflow: number; again?: boolean }
  | { type: 'step'; index: number; task: CascadeTask; result: number }
  | { type: 'complete' };

type Result = { state: CascadeState; events: CascadeEvent[] };

export interface CascadeAnswer {
  result: number;
  carries: number;
  /** Přenosy o dvě místa (jen farCarries). */
  far: number;
  /** Světla ve sloupci i s přenosem (u odčítání rozdíl, může být záporný). */
  inflow: number[];
  /** Největší přenos do jednoho sloupce (víc než 1 neumí jeden krystal zapsat). */
  maxCarry: number;
  /** Co by vyteklo z nejvyššího sloupce, kdyby nádoba neměla přepad. */
  spilled: number;
}

/** Řádky ve stěně: sčítance, menšenec a menšitel, nebo posunuté kopie prvního činitele. */
export function rows(task: CascadeTask): number[] {
  if (task.op !== 'mul') return [...task.operands];
  const [a, b] = task.operands;
  const out: number[] = [];
  for (let i = 0; i < 31; i++) if (isBitSet(b, i)) out.push(a << i);
  return out;
}

/** Kolik kopií nabídne stěna při výběru kopií: jednu pro každé místo druhého činitele. */
export const copySlots = (cfg: CascadeConfig): number => cfg.bits ?? cfg.width;

/** Řádky, které stěna ukazuje: při výběru kopií všechny nabízené kopie, jinak řádky úlohy. */
export function wallRows(cfg: CascadeConfig, task: CascadeTask): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rows(task);
  return Array.from({ length: copySlots(cfg) }, (_, j) => task.operands[0] << j);
}

/** O kolik míst jsou řádky na stěně posunuté. */
export function wallShifts(cfg: CascadeConfig, task: CascadeTask): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rowShifts(task);
  return Array.from({ length: copySlots(cfg) }, (_, j) => j);
}

/** U násobení: o kolik míst je každý řádek posunutý (podle jedniček druhého činitele). */
export function rowShifts(task: CascadeTask): number[] {
  if (task.op !== 'mul') return task.operands.map(() => 0);
  const out: number[] = [];
  for (let i = 0; i < 31; i++) if (isBitSet(task.operands[1], i)) out.push(i);
  return out;
}

const bit = (n: number, i: number): number => (isBitSet(n, i) ? 1 : 0);

/** Správný výsledek i se všemi přenosy, sloupec po sloupci zprava. */
export function answer(cfg: CascadeConfig, task: CascadeTask): CascadeAnswer {
  const lines = rows(task);
  const w = cfg.width;
  let result = 0;
  let carries = 0;
  let carry = 0;
  let maxCarry = 0;
  const inflow: number[] = [];

  if (cfg.farCarries) {
    // Ve sloupci se může slít až pět světel: 2 a 3 dají přenos o jedno místo, 4 a 5 o dvě.
    const near = new Array<number>(w + 2).fill(0);
    const farIn = new Array<number>(w + 2).fill(0);
    let far = 0;
    for (let i = 0; i < w; i++) {
      const flow = lines.reduce((s, r) => s + bit(r, i), 0) + near[i] + farIn[i];
      inflow.push(flow);
      if (flow & 1) result |= 1 << i;
      if ((flow >> 1) & 1) {
        near[i + 1] = 1;
        if (i + 1 < w) carries |= 1 << (i + 1);
      }
      if ((flow >> 2) & 1) {
        farIn[i + 2] = 1;
        if (i + 2 < w) far |= 1 << (i + 2);
      }
      maxCarry = Math.max(maxCarry, flow >> 2 ? 1 : flow >> 1);
    }
    return { result, carries, far, inflow, maxCarry, spilled: near[w] + farIn[w] + farIn[w + 1] };
  }

  if (task.op === 'sub') {
    const [a, b] = lines;
    for (let i = 0; i < w; i++) {
      let d = bit(a, i) - bit(b, i) - carry;
      inflow.push(d);
      carry = d < 0 ? 1 : 0;
      if (d < 0) d += 2;
      if (d) result |= 1 << i;
      if (carry && i + 1 < w) carries |= 1 << (i + 1);
      maxCarry = Math.max(maxCarry, carry);
    }
    return { result, carries, far: 0, inflow, maxCarry, spilled: carry };
  }

  for (let i = 0; i < w; i++) {
    const flow = lines.reduce((s, r) => s + bit(r, i), 0) + carry;
    inflow.push(flow);
    if (flow & 1) result |= 1 << i;
    carry = flow >> 1;
    if (carry && (i + 1 < w || cfg.overflow)) carries |= 1 << (i + 1);
    maxCarry = Math.max(maxCarry, carry);
  }
  return { result, carries, far: 0, inflow, maxCarry, spilled: carry };
}

/** Sloupce, nad kterými může svítit krystal přenosu (nejpravější žádný přenos nedostává). */
export function carryColumns(cfg: CascadeConfig): number[] {
  if (cfg.carries === 'none') return [];
  const last = cfg.overflow ? cfg.width : cfg.width - 1;
  return Array.from({ length: last }, (_, k) => k + 1);
}

/** Sloupce, do kterých může přitéct přenos o dvě místa. */
export function farColumns(cfg: CascadeConfig): number[] {
  if (!cfg.farCarries || cfg.carries === 'none') return [];
  return Array.from({ length: Math.max(0, cfg.width - 2) }, (_, k) => k + 2);
}

export function initCascade(cfg?: CascadeConfig): CascadeState {
  return { step: 0, result: 0, ...preset(cfg, 0), far: 0, copies: 0, moves: 0, mistakes: 0, wrong: null, missed: [], complete: false };
}

/** Přenosy na začátku úlohy: u ukázkové úlohy hotové, jinak žádné. */
function preset(cfg: CascadeConfig | undefined, step: number): { carries: number } {
  const task = cfg?.tasks[step];
  return { carries: cfg && task && cfg.demo === step ? answer(cfg, task).carries : 0 };
}

export function currentTask(cfg: CascadeConfig, st: CascadeState): CascadeTask | null {
  return st.complete ? null : (cfg.tasks[st.step] ?? null);
}

/** Úloha, kterou je vidět: aktuální, po dokončení ta poslední. */
export function shownTask(cfg: CascadeConfig, st: CascadeState): CascadeTask {
  return cfg.tasks[Math.min(st.step, cfg.tasks.length - 1)];
}

/** Řádky, které se podle hráče právě sčítají (při výběru kopií jen rozsvícené kopie). */
function chosenRows(cfg: CascadeConfig, task: CascadeTask, copies: number): number[] {
  if (task.op !== 'mul' || !cfg.pickCopies) return rows(task);
  return wallRows(cfg, task).filter((_, j) => isBitSet(copies, j));
}

/** Kolik světla se ve sloupci slévá podle toho, co hráč právě rozsvítil (pro živé počty). */
export function liveInflow(
  task: CascadeTask,
  carries: number,
  column: number,
  extra: { cfg?: CascadeConfig; far?: number; copies?: number } = {},
): number {
  const lines = extra.cfg ? chosenRows(extra.cfg, task, extra.copies ?? 0) : rows(task);
  if (task.op === 'sub') return bit(lines[0], column) - bit(lines[1], column) - bit(carries, column);
  return lines.reduce((s, r) => s + bit(r, column), 0) + bit(carries, column) + bit(extra.far ?? 0, column);
}

/** Bitová maska, ve které buňka daného řádku leží. */
const rowMask = (st: Pick<CascadeState, 'result' | 'carries' | 'far' | 'copies'>, row: CascadeCell['row']): number =>
  row === 'result' ? st.result : row === 'carry' ? st.carries : row === 'far' ? st.far : st.copies;

const rowKey = { result: 'result', carry: 'carries', far: 'far', copy: 'copies' } as const;

function validCell(cfg: CascadeConfig, task: CascadeTask, cell: CascadeCell): boolean {
  switch (cell.row) {
    case 'result':
      return cell.column >= 0 && cell.column < cfg.width;
    case 'carry':
      return carryColumns(cfg).includes(cell.column);
    case 'far':
      return farColumns(cfg).includes(cell.column);
    case 'copy':
      return !!cfg.pickCopies && task.op === 'mul' && cell.column >= 0 && cell.column < copySlots(cfg);
  }
}

export function toggle(cfg: CascadeConfig, st: CascadeState, cell: CascadeCell): Result {
  const task = currentTask(cfg, st);
  if (!task || !validCell(cfg, task, cell)) return { state: st, events: [] };
  const r = flowToggle(cfg, task, st, cell);
  if (r.refused) return { state: st, events: [{ type: 'refuse', cell }] };
  const on = isBitSet(rowMask(r.marks, cell.row), cell.column);
  const event: CascadeEvent = r.dropped.length ? { type: 'toggle', cell, on, dropped: r.dropped } : { type: 'toggle', cell, on };
  return { state: { ...st, ...r.marks, wrong: null }, events: [event] };
}

const cellKey = (c: CascadeCell): string => `${c.row}:${c.column}`;
const marksOf = (m: FlowMarks): FlowMarks => ({ result: m.result, carries: m.carries, far: m.far, copies: m.copies });

/**
 * Rozsvícené krystaly, do kterých podle lightFlow žádné světlo nepřiteklo: výsledek, přenos (u odčítání
 * výpůjčka, která sousedovi vpravo nemá co půjčit) a přenos o dvě místa. Vypínače kopií světlo nepotřebují.
 */
export function unfedCells(cfg: CascadeConfig, task: CascadeTask, marks: FlowMarks): CascadeCell[] {
  const fed = new Set(lightFlow(cfg, task, marks).map((mv) => `${mv.to.kind}:${mv.to.column}`));
  const out: CascadeCell[] = [];
  for (let i = 0; i < cfg.width; i++) if (isBitSet(marks.result, i) && !fed.has(`result:${i}`)) out.push({ row: 'result', column: i });
  const carryKind = task.op === 'sub' ? 'lend' : 'carry';
  for (const i of carryColumns(cfg)) if (isBitSet(marks.carries, i) && !fed.has(`${carryKind}:${i}`)) out.push({ row: 'carry', column: i });
  if (task.op !== 'sub') for (const i of farColumns(cfg)) if (isBitSet(marks.far, i) && !fed.has(`far:${i}`)) out.push({ row: 'far', column: i });
  return out;
}

export interface FlowToggle {
  marks: FlowMarks;
  /** Rozsvícení se odmítlo: krystal (nebo jiný, kterému by vzal světlo) by zůstal bez světla. */
  refused: boolean;
  /** Krystaly, které se zhasnutím přišly o světlo a zhasly s ním. */
  dropped: CascadeCell[];
}

/**
 * Přepne buňku. Se zachováním světla (conserve) se rozsvícení, po kterém by některý krystal zůstal
 * bez světla, odmítne. Zhasnutí vrátí světla do sloupců, odkud přišla, a krystaly, které tím o světlo
 * přijdou, zhasnou taky (třeba výsledek, do kterého sjelo světlo ze zhasnutého přenosu).
 * Krystaly, které bez světla svítily už předtím, se nepočítají.
 */
export function flowToggle(cfg: CascadeConfig, task: CascadeTask, marks: FlowMarks, cell: CascadeCell): FlowToggle {
  const key = rowKey[cell.row];
  const flipped: FlowMarks = { ...marksOf(marks), [key]: flipBit(marks[key], cell.column) };
  if (!cfg.conserve) return { marks: flipped, refused: false, dropped: [] };
  const before = new Set(unfedCells(cfg, task, marks).map(cellKey));
  const fresh = (m: FlowMarks) => unfedCells(cfg, task, m).filter((c) => !before.has(cellKey(c)));
  if (isBitSet(flipped[key], cell.column)) {
    return fresh(flipped).length ? { marks: marksOf(marks), refused: true, dropped: [] } : { marks: flipped, refused: false, dropped: [] };
  }
  let cur = flipped;
  const dropped: CascadeCell[] = [];
  for (let lost = fresh(cur); lost.length; lost = fresh(cur)) {
    for (const c of lost) {
      const k = rowKey[c.row];
      cur = { ...cur, [k]: cur[k] & ~(1 << c.column) };
      dropped.push(c);
    }
  }
  return { marks: cur, refused: false, dropped };
}

/**
 * Všechny buňky, které nesedí, v pořadí kontroly: zprava, ve sloupci nejdřív přenosy, které do něj
 * vtékají. Při výběru kopií nejdřív kopie.
 */
export function wrongCells(cfg: CascadeConfig, st: CascadeState): CascadeCell[] {
  const task = currentTask(cfg, st);
  if (!task) return [];
  const out: CascadeCell[] = [];
  if (cfg.pickCopies && task.op === 'mul') {
    for (let j = 0; j < copySlots(cfg); j++) {
      if (bit(st.copies, j) !== bit(task.operands[1], j)) out.push({ row: 'copy', column: j });
    }
  }
  const ans = answer(cfg, task);
  const carryCols = carryColumns(cfg);
  const farCols = farColumns(cfg);
  const last = cfg.overflow && cfg.carries === 'manual' ? cfg.width : cfg.width - 1;
  for (let i = 0; i <= last; i++) {
    if (farCols.includes(i) && bit(st.far, i) !== bit(ans.far, i)) out.push({ row: 'far', column: i });
    if (carryCols.includes(i) && bit(st.carries, i) !== bit(ans.carries, i)) out.push({ row: 'carry', column: i });
    if (i < cfg.width && bit(st.result, i) !== bit(ans.result, i)) out.push({ row: 'result', column: i });
  }
  return out;
}

/**
 * První buňka zprava, která nesedí (ve sloupci nejdřív přenosy, které do něj vtékají).
 * Při výběru kopií se nejdřív kontroluje, jestli svítí správné kopie.
 * Se zachováním světla první buňka, kterou jde opravdu přepnout: krystal bez světla se rozsvítit nedá,
 * takže třeba u řetězu výpůjček ukáže nejdřív sloupec, který má z čeho půjčit.
 */
export function firstWrong(cfg: CascadeConfig, st: CascadeState): CascadeCell | null {
  const cells = wrongCells(cfg, st);
  const task = currentTask(cfg, st);
  if (!cfg.conserve || !task || cells.length < 2) return cells[0] ?? null;
  return cells.find((c) => !flowToggle(cfg, task, st, c).refused) ?? cells[0];
}

/** Potvrdí výsledek. Každé potvrzení je jeden tah. */
export function confirm(cfg: CascadeConfig, st: CascadeState): Result {
  const task = currentTask(cfg, st);
  if (!task) return { state: st, events: [] };
  const wrong = firstWrong(cfg, st);
  const moves = st.moves + 1;

  if (wrong) {
    const ans = answer(cfg, task);
    const mask = { result: ans.result, carry: ans.carries, far: ans.far, copy: task.operands[1] }[wrong.row];
    const expected = isBitSet(mask, wrong.column);
    // U přenosu se počítá světlo ve sloupci, odkud přenos teče.
    const source = { result: 0, carry: 1, far: 2, copy: 0 }[wrong.row];
    const inflow = wrong.row === 'copy' ? 0 : ans.inflow[wrong.column - source];
    // Chyby se počítají na buňku: poprvé hláška jen ptá, podruhé ve stejné buňce řekne krystal.
    const key = cellKey(wrong);
    const again = st.missed.includes(key);
    return {
      state: { ...st, moves, mistakes: st.mistakes + 1, wrong, missed: again ? st.missed : [...st.missed, key] },
      events: [again ? { type: 'wrong', cell: wrong, expected, inflow, again } : { type: 'wrong', cell: wrong, expected, inflow }],
    };
  }

  const events: CascadeEvent[] = [{ type: 'step', index: st.step, task, result: st.result }];
  const step = st.step + 1;
  const complete = step >= cfg.tasks.length;
  if (complete) {
    events.push({ type: 'complete' });
    // Poslední výsledek zůstává rozsvícený (kvíz, závěrečná obrazovka).
    return { state: { ...st, step, moves, wrong: null, missed: [], complete }, events };
  }
  return { state: { ...st, step, moves, result: 0, ...preset(cfg, step), far: 0, copies: 0, wrong: null, missed: [], complete }, events };
}

/** Ideál: každý výsledek napoprvé. */
export const par = (cfg: CascadeConfig): number => cfg.tasks.length;

/** Odkud světlo vychází: krystal řádku ve stěně, krystal přenosu (o jedno nebo dvě místa), půjčené světlo. */
export type FlowSource =
  | { kind: 'line'; row: number; column: number }
  | { kind: 'carry' | 'far'; column: number }
  | { kind: 'loan'; column: number; k: number };

/**
 * Kam světlo odejde: dolů do krystalu výsledku, nahoru do krystalu přenosu (o jedno nebo dvě místa),
 * do půjčky sousedovi vpravo (lend), nebo se vyruší s menšitelem (cancel).
 */
export type FlowSink = { kind: 'result' | 'carry' | 'far' | 'lend' | 'cancel'; column: number };

export interface FlowMove {
  from: FlowSource;
  to: FlowSink;
}

/** Co hráč na desce rozsvítil (stav Kaskády nebo přijatý výsledek během pauzy). */
export interface FlowMarks {
  result: number;
  carries: number;
  far: number;
  copies: number;
}

/**
 * Kudy světla na desce tečou podle toho, co hráč rozsvítil. Světlo se přesune, jen když může:
 * krystal výsledku si vezme nejspodnější světlo svého sloupce, krystal přenosu dvě světla
 * (přenos o dvě místa čtyři) ze sloupce vpravo, a to shora, nejblíž ke svému místu. Díky tomu
 * se nic nepřehazuje, ať hráč rozsvěcí v jakémkoli pořadí. Sloupce se procházejí zprava.
 *
 * Bez krystalů přenosu (Jedna a jedna, Dvě dvojky) si výsledek, který ve svém sloupci nic nemá, vezme
 * dvě světla ze sloupce vpravo: tak je vidět, že 1 + 1 = 10 a 10 + 10 = 100. Funguje to, jen když dvojice
 * přetéká do sloupce, kde ve stěně nic nesvítí (hlídá levels.test.ts).
 *
 * Odčítání: menšitel vyruší nejspodnější světlo sloupce (ukáže se, až hráč sloupec zpracuje),
 * výsledek si vezme další zespodu a krystal výpůjčky půjčí sousedovi vpravo světlo shora.
 */
export function lightFlow(cfg: CascadeConfig, task: CascadeTask, marks: FlowMarks): FlowMove[] {
  const w = cfg.width;
  const lines = wallRows(cfg, task);
  const carryCols = carryColumns(cfg);
  const moves: FlowMove[] = [];
  const lit = (mask: number, i: number) => isBitSet(mask, i);

  if (task.op === 'sub') {
    const [a, b] = lines;
    for (let i = 0; i < w; i++) {
      // Kladná světla zdola nahoru: menšenec, pak dvě půjčená světla nad ním.
      const pool: FlowSource[] = [];
      if (lit(a, i)) pool.push({ kind: 'line', row: 0, column: i });
      if (carryCols.includes(i + 1) && lit(marks.carries, i + 1)) pool.push({ kind: 'loan', column: i, k: 1 }, { kind: 'loan', column: i, k: 0 });
      const cancel: FlowMove[] = [];
      if (lit(b, i) && pool.length) {
        cancel.push({ from: pool.shift()!, to: { kind: 'cancel', column: i } }, { from: { kind: 'line', row: 1, column: i }, to: { kind: 'cancel', column: i } });
      }
      const own: FlowMove[] = [];
      if (lit(marks.result, i) && pool.length) own.push({ from: pool.shift()!, to: { kind: 'result', column: i } });
      if (carryCols.includes(i) && lit(marks.carries, i) && pool.length) own.push({ from: pool.pop()!, to: { kind: 'lend', column: i } });
      if (own.length) moves.push(...cancel, ...own);
    }
    return moves;
  }

  const farCols = farColumns(cfg);
  const picked = (j: number) => !(task.op === 'mul' && cfg.pickCopies) || lit(marks.copies, j);
  // Volná světla každého sloupce zdola nahoru: řádky ve stěně, přenos, přenos o dvě místa.
  const pools: FlowSource[][] = Array.from({ length: w }, (_, i) => {
    const pool: FlowSource[] = [];
    for (let j = lines.length - 1; j >= 0; j--) if (picked(j) && lit(lines[j], i)) pool.push({ kind: 'line', row: j, column: i });
    if (carryCols.includes(i) && lit(marks.carries, i)) pool.push({ kind: 'carry', column: i });
    if (farCols.includes(i) && lit(marks.far, i)) pool.push({ kind: 'far', column: i });
    return pool;
  });
  const take = (i: number, n: number, to: FlowSink, from: 'top' | 'bottom'): boolean => {
    const pool = pools[i];
    if (!pool || pool.length < n) return false;
    const taken = from === 'bottom' ? pool.splice(0, n) : pool.splice(pool.length - n, n);
    for (const src of taken) moves.push({ from: src, to });
    return true;
  };
  for (let i = 0; i < w; i++) {
    if (farCols.includes(i + 2) && lit(marks.far, i + 2)) take(i, 4, { kind: 'far', column: i + 2 }, 'top');
    if (carryCols.includes(i + 1) && lit(marks.carries, i + 1)) take(i, 2, { kind: 'carry', column: i + 1 }, 'top');
    if (lit(marks.result, i)) {
      const to: FlowSink = { kind: 'result', column: i };
      if (!take(i, 1, to, 'bottom') && cfg.carries === 'none') take(i - 1, 2, to, 'top') || take(i - 2, 4, to, 'top');
    }
  }
  return moves;
}
