/**
 * Kaskáda slovy: proč buňka nesedí (po chybném potvrzení) a proč má vypadat právě tak
 * (ukázka kroku s důvodem).
 */
import {
  answer,
  carryColumns,
  farColumns,
  firstWrong,
  liveInflow,
  rows,
  wallRows,
  type CascadeCell,
  type CascadeConfig,
  type CascadeEvent,
  type CascadeState,
  type CascadeTask,
  type FlowMarks,
} from '../core/puzzles/cascade';
import { isBitSet } from '../core/bits';

/** Sloupce Kaskády: v … sloupci, nad … sloupcem, do … sloupce. */
/** „v prvním“, „ve druhém“… (sloupce zprava). */
const LOC = ['v prvním', 've druhém', 've třetím', 've čtvrtém', 'v pátém', 'v šestém', 'v sedmém', 'v osmém'];
const LOC_UP = LOC.map((w) => w[0].toUpperCase() + w.slice(1));
const INS = ['prvním', 'druhým', 'třetím', 'čtvrtým', 'pátým', 'šestým', 'sedmým', 'osmým'];
const GEN = ['prvního', 'druhého', 'třetího', 'čtvrtého', 'pátého', 'šestého', 'sedmého', 'osmého'];
const FLOW = ['žádné světlo', 'jedno světlo', 'dvě světla', 'tři světla', 'čtyři světla', 'pět světel'];
const places = (n: number) => (n === 1 ? 'místo' : n >= 2 && n <= 4 ? 'místa' : 'míst');

type Wrong = Extract<CascadeEvent, { type: 'wrong' }>;

/**
 * Proč Kaskáda výsledek nepřijala: vysvětlí první buňku zprava, která nesedí.
 * explicit: ukázka kroku řekne i výsledek sloupce, ne jen otázku („co zůstane dole?“).
 */
export function cascadeWhy(cfg: CascadeConfig, state: CascadeState, ev: Wrong, explicit = false): string {
  const task = cfg.tasks[Math.min(state.step, cfg.tasks.length - 1)];
  const sub = task.op === 'sub';
  const c = ev.cell.column;
  if (ev.cell.row === 'copy') {
    return ev.expected
      ? `Druhý činitel má na místě s váhou ${2 ** c} jedničku. Kopie posunutá o ${c} ${places(c)} do součtu patří.`
      : `Druhý činitel má na místě s váhou ${2 ** c} nulu. Kopie posunutá o ${c} ${places(c)} se nesčítá.`;
  }
  if (ev.cell.row === 'far') {
    return ev.expected
      ? `O dvě místa vpravo se slila ${FLOW[ev.inflow]}, to je ${ev.inflow.toString(2)}. Jedno světlo putuje o dvě místa: rozsviť horní krystal nad ${INS[c]} sloupcem zprava.`
      : `Do ${GEN[c]} sloupce zprava nic o dvě místa nepřiteklo. Sloupec o dvě místa vpravo neměl čtyři světla.`;
  }
  if (ev.cell.row === 'carry' && !ev.expected && ev.inflow >= 4) {
    return `Ve sloupci vpravo se slila ${FLOW[ev.inflow]}, to je ${ev.inflow.toString(2)}. Do sousedního sloupce nepřetéká nic, světlo jde o dvě místa dál.`;
  }
  if (ev.cell.row === 'carry') {
    if (c === cfg.width) {
      return ev.expected ? 'Nejlevější sloupec přetekl. To světlo patří do přepadu.' : 'Nic nepřeteklo. Přepad má zůstat suchý.';
    }
    if (sub) {
      return ev.expected
        ? `Ve sloupci vpravo nebylo z čeho brát. Výpůjčku zapiš krystalem pod spodní řadu ${LOC[c]} sloupci zprava.`
        : `Sloupec vpravo si nepůjčoval. ${LOC_UP[c]} sloupci zprava výpůjčka být nemá.`;
    }
    return ev.expected
      ? `Ve sloupci vpravo se slila ${FLOW[ev.inflow]} a jedno přeteklo. Nad ${INS[c]} sloupcem zprava chybí krystal přenosu.`
      : `Nad ${INS[c]} sloupcem zprava svítí krystal přenosu, ale sloupec vpravo nepřetekl.`;
  }
  if (sub) {
    if (ev.inflow < 0) {
      return `${LOC_UP[c]} sloupci zprava nemáš z čeho brát. Půjčené světlo tu váží dvě: ${ev.inflow === -1 ? '10 − 1 = 1' : '10 − 1 − 1 = 0'}.`;
    }
    return `${LOC_UP[c]} sloupci zprava ${ev.inflow === 1 ? 'zbude jedno světlo' : 'nezbude nic'}.`;
  }
  // Bez krystalů přenosu: světlo, které do sloupce přiteklo zprava, ve stěně nesvítí (own = vlastní světla sloupce).
  const own = rows(task).filter((r) => isBitSet(r, c)).length;
  if (cfg.carries === 'none' && ev.expected && ev.inflow > own) {
    return `Ve sloupci vpravo se slila dvě světla. Dohromady váží ${2 ** c}, tolik jako krystal ${LOC[c]} sloupci zprava. Rozsviť tento krystal.`;
  }
  if (ev.inflow >= 2) {
    if (explicit)
      return `${LOC_UP[c]} sloupci zprava se slévají ${FLOW[ev.inflow]}, to je ${ev.inflow.toString(2)}. Dole zůstane ${ev.inflow & 1 ? 'světlo' : 'stín'} a jedno světlo přeteče do sloupce vlevo.`;
    return `${LOC_UP[c]} sloupci zprava se slévají ${FLOW[ev.inflow]}. Do jednoho krystalu se nevejdou: co zůstane dole a co přeteče?`;
  }
  return ev.inflow === 1
    ? `${LOC_UP[c]} sloupci zprava je jedno světlo. Nikam nepřetéká, zůstane dole.`
    : `${LOC_UP[c]} sloupci zprava není žádné světlo. Krystal dole má zůstat zhasnutý.`;
}


/** „žádné světlo není“, „je jen jedno světlo“, „jsou jen tři světla“ (kolik světel ve sloupci je). */
const HOW_MANY = ['žádné světlo není', 'je jen jedno světlo', 'jsou jen dvě světla', 'jsou jen tři světla'];

/**
 * Zachování světla: proč se krystal nerozsvítil (marks = co na desce svítí teď, před dotekem).
 * Do výsledku sjede jedno světlo z jeho sloupce, do přenosu přeteče dvojice ze sloupce vpravo
 * (o dvě místa čtveřice) a u odčítání půjčí sloupec sousedovi vpravo jedno světlo, které tam jsou dvě.
 */
export function cascadeRefusal(cfg: CascadeConfig, task: CascadeTask, marks: FlowMarks, cell: CascadeCell): string {
  const c = cell.column;
  const where = (i: number) => `${LOC_UP[i]} sloupci zprava`;
  const lit = (mask: number, i: number) => isBitSet(mask, i);
  const empty = `${where(c)} žádné světlo není. Krystal výsledku nemá z čeho svítit.`;

  if (task.op === 'sub') {
    const [a, b] = wallRows(cfg, task);
    const loan = carryColumns(cfg).includes(c + 1) && lit(marks.carries, c + 1);
    const pool = (lit(a, c) ? 1 : 0) + (loan ? 2 : 0);
    // Menšitel vyruší jedno světlo sloupce, pokud tam nějaké je.
    const left = pool - (lit(b, c) && pool > 0 ? 1 : 0);
    if (cell.row === 'result') {
      if (pool === 0) return lit(b, c) ? `${where(c)} není od čeho odečítat. Bez výpůjčky ze sloupce vlevo tu žádné světlo nebude.` : empty;
      if (left === 0) return `${where(c)} spodní řada odečte jediné světlo. Na výsledek nezbylo nic.`;
      return `Jediné volné světlo ${GEN[c]} sloupce zprava už je půjčené sousedovi vpravo.`;
    }
    if (pool === 0) {
      return `${where(c)} není co půjčit.${carryColumns(cfg).includes(c + 1) ? ' Sloupec si nejdřív musí sám půjčit od souseda vlevo.' : ''}`;
    }
    if (left === 0) return `${where(c)} spodní řada odečte jediné světlo. Půjčit už není co.`;
    return `Jediné volné světlo ${GEN[c]} sloupce zprava už sjelo do krystalu výsledku. Půjčit už není co.`;
  }

  // Sčítání a násobení: kolik světel ve sloupci je (řádky ve stěně i přenosy, které do něj přitekly).
  const pool = (i: number) => (i < 0 ? 0 : liveInflow(task, marks.carries, i, { cfg, far: marks.far, copies: marks.copies }));
  if (cell.row === 'carry') {
    const s = c - 1;
    const n = pool(s);
    const head = c === cfg.width ? 'Do přepadu přetéká jen dvojice světel z nejlevějšího sloupce.' : 'Do krystalu přenosu přetéká dvojice světel ze sloupce vpravo.';
    if (n < 2) return `${head} ${where(s)} ${HOW_MANY[n]}.`;
    // Přenos o dvě místa si ze sloupce bere čtyři světla dřív než přenos a výsledek (lightFlow).
    const toFar = farColumns(cfg).includes(s + 2) && lit(marks.far, s + 2) ? 4 : 0;
    if (n - toFar < 2) return `${head} ${where(s)} už ale čtyři světla odtekla o dvě místa dál a na dvojici nezbývá.`;
    if (lit(marks.result, s)) return `${head} ${where(s)} už ale jedno světlo sjelo dolů do krystalu výsledku a na dvojici nezbývá.`;
    return `${head} ${where(s)} už dvě volná světla nezbyla.`;
  }
  if (cell.row === 'far') {
    const s = c - 2;
    const n = pool(s);
    const head = 'Přenos o dvě místa dostane čtyři světla ze sloupce o dvě místa vpravo.';
    return n < 4 ? `${head} ${where(s)} ${HOW_MANY[n]}.` : `${head} ${where(s)} už čtyři volná světla nezbyla.`;
  }
  if (cfg.carries !== 'none') return pool(c) === 0 ? empty : `${where(c)} už všechna světla odtekla nahoru do přenosu. Dolů nezbylo nic.`;
  // Bez krystalů přenosu: do prázdného sloupce přiteče dvojice ze sloupce vpravo rovnou do výsledku.
  if (pool(c) > 0) return `Obě světla ${GEN[c]} sloupce zprava už přetekla do sloupce vlevo. Dolů nezbylo nic.`;
  if (c === 0) return empty;
  if (pool(c - 1) < 2) return `${where(c)} žádné světlo není. Přitéct sem může jen dvojice světel ze sloupce vpravo, a ta tam není.`;
  return `${where(c)} žádné světlo není. Přitéct sem může jen celá dvojice ze sloupce vpravo, a tam už jedno světlo sjelo dolů do krystalu výsledku.`;
}

/** Buňka a co v ní má být: stejné údaje, jaké nese chybné potvrzení (u přenosu světlo sloupce, odkud teče). */
export function cellFacts(cfg: CascadeConfig, st: CascadeState, cell: CascadeCell): Wrong | null {
  const task = cfg.tasks[st.step];
  if (!task) return null;
  const ans = answer(cfg, task);
  const mask = { result: ans.result, carry: ans.carries, far: ans.far, copy: task.operands[1] }[cell.row];
  const source = { result: 0, carry: 1, far: 2, copy: 0 }[cell.row];
  const inflow = cell.row === 'copy' ? 0 : ans.inflow[cell.column - source];
  return { type: 'wrong', cell, expected: isBitSet(mask, cell.column), inflow };
}

/** Ukázka kroku s důvodem: proč má první nesedící buňka zprava vypadat jinak. */
export function cascadeStep(cfg: CascadeConfig, st: CascadeState): string | null {
  const cell = firstWrong(cfg, st);
  const facts = cell && cellFacts(cfg, st, cell);
  return facts ? cascadeWhy(cfg, st, facts, true) : null;
}
