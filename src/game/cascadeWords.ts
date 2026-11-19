/**
 * Kaskáda slovy: proč buňka nesedí (po chybném potvrzení) a proč má vypadat právě tak
 * (ukázka kroku s důvodem).
 */
import { answer, firstWrong, rows, type CascadeCell, type CascadeConfig, type CascadeEvent, type CascadeState } from '../core/puzzles/cascade';
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
