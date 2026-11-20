/**
 * Ukázka kroku s důvodem: vedle zvýrazněného krystalu, páky nebo řádku jedna věta, proč právě
 * tenhle krok. Ze slepého klikání se tak stane ukázkový příklad („Žádáno 13. Váha 8 se vejde…“).
 * Čisté funkce nad stavem hádanky; texty bez zájmen bez předmětu („rozsviť ho“).
 */
import { isBitSet } from '../core/bits';
import { ARITY, inputBit, runeTable, type Rune } from '../core/logic';
import { evaluate, sourcesOf, type Circuit } from '../core/puzzles/gate';
import { applyOp, type TideConfig, type TideOp, type TideState, bestOp, currentTarget, pathFits, taskLimit, taskStart } from '../core/puzzles/tide';
import type { MaskTask } from '../core/puzzles/mask';
import { RUNE_NAME, RUNE_RULE } from '../content/runes';
import { inNum, plural } from './text';

/** Zápis čísla krystaly (Oltář, zápis Nápisu): kolik zbývá po těžších krystalech a vejde se váha? */
export function valueStep(target: number, bit: number, needed: boolean): string {
  const w = 2 ** bit;
  const above = Math.floor(target / (2 * w)) * (2 * w);
  const rest = target - above;
  const head = above ? `Žádáno ${target}. Těžší krystaly dají ${above}, zbývá ${rest}.` : `Žádáno ${target}.`;
  return needed ? `${head} Váha ${w} se do toho vejde: zvýrazněný krystal rozsviť.` : `${head} Váha ${w} je víc: zvýrazněný krystal zhasni.`;
}

/** Čtení nápisu na desítkových kotoučích: váhy svítících krystalů. Součet nechá na hráči (glyfy čte glyphStep). */
export function readStep(value: number, bits: number): string {
  const out: number[] = [];
  for (let i = bits - 1; i >= 0; i--) if (isBitSet(value, i)) out.push(2 ** i);
  return `Sečti váhy svítících krystalů: ${out.length ? out.join(' + ') : '0'}.`;
}

/** Strany glyfu podle krystalu ve čtveřici: horní 8, pravá 4, dolní 2, levá 1. */
const GLYPH_SIDE = ['levá', 'dolní', 'pravá', 'horní'];

/** Výčet „8, 4 a 1“. */
const listWords = (items: (string | number)[]): string =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} a ${items[items.length - 1]}`;

/** Čtveřice jako glyf: svítící strany a jejich váhy, od horní strany. */
function glyphParts(n: number): { sides: string; weights: number[] } {
  const on = [3, 2, 1, 0].filter((i) => isBitSet(n, i));
  const sides = on.length === 0 ? 'žádná strana' : on.length === 4 ? 'všechny čtyři strany' : `${listWords(on.map((i) => GLYPH_SIDE[i]))} strana`;
  return { sides, weights: on.map((i) => 2 ** i) };
}

/** Glyf šestnáctkově (0–9, A–F), u dvojznaku dva znaky. */
const hexOf = (v: number, digits = 1): string => v.toString(16).toUpperCase().padStart(digits, '0');

/**
 * Glyfy (Řeč glyfů, Dvojznak): ukázka kroku po čtveřicích, s vahami 8, 4, 2, 1 uvnitř glyfu.
 * Čtení: které strany glyfu svítí, glyf na kotouči najde hráč. Zápis (write = zvýrazněný krystal):
 * „Žádáno A5. Levý glyf A je 10 = 8 + 2. Váha 8 do glyfu patří…“, bez desítkové hodnoty dvojznaku.
 */
export function glyphStep(value: number, bits: number, write?: { bit: number; needed: boolean }): string {
  const pair = bits === 8;
  if (!write) {
    if (pair) {
      const half = (n: number, at: string) => {
        const g = glyphParts(n);
        return g.weights.length ? `${at} svítí ${g.sides} (${listWords(g.weights)})` : `${at} nesvítí nic`;
      };
      return `Každá čtveřice je jeden glyf. ${half(value >>> 4, 'Vlevo')}, ${half(value & 15, 'vpravo')}. Takové glyfy nastav na kotoučích.`;
    }
    const g = glyphParts(value);
    const n = g.weights.length;
    const lit =
      n === 0 ? 'Nesvítí žádný krystal'
      : n === 1 ? `Svítí krystal s váhou ${g.weights[0]}`
      : n === 4 ? 'Svítí všechny čtyři krystaly'
      : `Svítí krystaly s vahami ${listWords(g.weights)}`;
    return `${lit}, na glyfu tedy ${g.sides}. Takový glyf nastav na kotouči.`;
  }
  const glyph = pair && write.bit < 4 ? value & 15 : pair ? value >>> 4 : value;
  const hex = hexOf(glyph);
  const weights = glyphParts(glyph).weights;
  const parts = weights.length === 0 ? 'prázdný' : weights.length === 1 ? `jen váha ${glyph}` : `${glyph >= 10 && pair ? `${glyph} = ` : ''}${weights.join(' + ')}`;
  const head = pair
    ? `Žádáno ${hexOf(value, 2)}. ${write.bit < 4 ? 'Pravý' : 'Levý'} glyf ${hex} je ${parts}.`
    : `Žádáno ${hex}${glyph >= 10 ? ` (${glyph})` : ''}. Glyf ${hex} je ${parts}.`;
  const w = 2 ** (write.bit % 4);
  return write.needed ? `${head} Váha ${w} do glyfu patří: zvýrazněný krystal rozsviť.` : `${head} Váha ${w} do glyfu nepatří: zvýrazněný krystal zhasni.`;
}

/**
 * Počítadlo (přičtení jedničky zprava, II-1): proč zvýrazněný krystal. Svítící krystaly vpravo
 * od nejnižšího světla počtu předávají světlo doleva, zhasnutý krystal na jeho místě světlo přijme.
 * Předání se řekne, jen když krystaly od zvýrazněného po nejnižší světlo počtu ukazují předchozí
 * počet (svítí, nejnižší světlo ještě ne). Krystal, který k počtu nepatří (hráč odbočil), se řekne
 * bez předání: soused vlevo může už svítit, nebo má zůstat zhasnutý.
 */
export function counterStep(target: number, bit: number, mask: number): string {
  const lowest = target & -target;
  const w = 2 ** bit;
  const on = (mask & w) !== 0;
  // Krystaly od w po nejnižší světlo počtu; v předchozím počtu svítí všechny kromě nejnižšího světla.
  const chain = lowest * 2 - w;
  if (on && w < lowest && (mask & chain) === lowest - w) {
    return 'Zvýrazněný krystal už svítí a další světlo se do něj nevejde. Zvýrazněný krystal zhasni, světlo jde k sousedovi vlevo.';
  }
  if (!on && w === lowest) {
    return w === 1
      ? 'Zvýrazněný krystal je zhasnutý, nové světlo se do něj vejde: zvýrazněný krystal rozsviť.'
      : 'Krystaly vpravo světlo předaly dál. Zvýrazněný krystal je zhasnutý a světlo přijme: zvýrazněný krystal rozsviť.';
  }
  return on ? `Počet ${target} tenhle krystal nepotřebuje: zvýrazněný krystal zhasni.` : `Počet ${target} potřebuje i tenhle krystal: zvýrazněný krystal rozsviť.`;
}

/** Kombinace vstupů slovy: „A světlo, B stín“. */
export function rowWords(names: string[], row: number): string {
  return names.map((name, i) => `${name} ${inputBit(row, i, names.length) ? 'světlo' : 'stín'}`).join(', ');
}

const light = (v: number | null) => (v === 1 ? 'světlo' : 'stín');

/** Deska zákona: proč lampa v řádku svítí, nebo mlčí, runa po runě. */
export function tableStep(circuit: Circuit, row: number): string {
  const values = evaluate(circuit, {}, row);
  const lamp = values[circuit.output] === 1;
  const head = `Řádek ${rowWords(circuit.inputs, row)}:`;
  const real = circuit.nodes.filter((g) => g.rune && g.rune !== 'id');
  if (real.length === 1) {
    const r = real[0].rune as Rune;
    return `${head} ${RUNE_NAME[r]} ${RUNE_RULE[r]}, takže lampa ${lamp ? 'svítí' : 'mlčí'}.`;
  }
  // Runa s jedním vstupem přímo u krystalu řekne, ke kterému patří: dva Obraceče se jinak nerozliší.
  const steps = real.map((g) => {
    const at = ARITY[g.rune as Rune] === 1 && circuit.inputs.includes(g.from[0]) ? ` u ${g.from[0]}` : '';
    return `${RUNE_NAME[g.rune as Rune]}${at} dá ${light(values[g.id])}`;
  });
  return `${head} ${steps.join(', ')}. Lampa ${lamp ? 'svítí' : 'mlčí'}.`;
}

/** Runa pod závojem: jméno a zákon. */
export function identifyStep(rune: Rune): string {
  return `Pod závojem je ${RUNE_NAME[rune]}: ${RUNE_RULE[rune]}.`;
}

/** Odkud bere světlo točitý kámen: „ze vstupu A“, nebo „z runy 1“ (runy čísluje deska Prapečeti). */
export function sourceWords(circuit: Circuit, source: string): string {
  return circuit.inputs.includes(source) ? `ze vstupu ${source}` : `z runy ${circuit.nodes.findIndex((g) => g.id === source) + 1}`;
}

/**
 * Prapečeť (všechny runy jsou Zlomená pouta): kam zvýrazněný točitý kámen natočit a proč, podle role
 * runy v řešení, ke kterému míří ukázka kroku (wires = natočení celého řešení). Runa se stejným
 * světlem na obou vstupech je Obraceč, za Zlomeným poutem dá Pouto, dva Obraceče slévá Rozcestí.
 */
export function wireStep(circuit: Circuit, wires: Record<string, string>, socket: string): string {
  const head = `Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${sourceWords(circuit, wires[socket])}.`;
  const no = (id: string) => circuit.nodes.findIndex((g) => g.id === id) + 1;
  const from = (id: string): (string | null)[] => {
    const g = circuit.nodes.find((x) => x.id === id);
    return g ? sourcesOf(g, wires) : [];
  };
  /** Co runa obrací, když má na obou vstupech totéž světlo; jinak null (vstup, nebo dvě různá světla). */
  const flips = (id: string | null | undefined): string | null => {
    if (!id) return null;
    const [a, b] = from(id);
    return a && a === b ? a : null;
  };
  const what = (src: string) => (circuit.inputs.includes(src) ? src : `světlo z runy ${no(src)}`);
  const id = socket.slice(0, socket.lastIndexOf(':'));
  const [a, b] = from(id);
  const flipped = flips(id);
  if (flipped) {
    const feeds = circuit.nodes.some((g) => {
      const [x, y] = from(g.id);
      return x !== y && (x === id || y === id) && !!flips(x) && !!flips(y);
    });
    if (feeds) return `${head} Runa ${no(id)} se stejným světlem na obou vstupech obrátí ${what(flipped)}. Rozcestí je Zlomené pouto obrácených vstupů.`;
    if (circuit.inputs.includes(flipped)) return `${head} Zlomené pouto se stejným světlem na obou vstupech je Obraceč.`;
    if (flips(flipped)) return `${head} Runa ${no(id)} obrátí ${what(flipped)} a dva Obraceče za sebou se zruší.`;
    return `${head} Zlomené pouto se stejným světlem na obou vstupech je Obraceč. Obraceč za Zlomeným poutem dá Pouto.`;
  }
  const fa = flips(a);
  const fb = flips(b);
  if (a && b && fa && fb) {
    return `${head} Runa ${no(a)} obrací ${what(fa)} a runa ${no(b)} obrací ${what(fb)}. Zlomené pouto obrácených vstupů je Rozcestí.`;
  }
  return `${head} Zlomené pouto ${RUNE_RULE.nand}.`;
}

/** Hlášení po přepnutí vstupu: lampa i se světlem z točitých kamenů (Prapečeť). */
export function inputWords(circuit: Circuit, runes: Record<string, Rune>, wires: Record<string, string>, inputs: number, index: number): string {
  const on = inputBit(inputs, index, circuit.inputs.length) === 1;
  const lamp = evaluate(circuit, runes, inputs, wires)[circuit.output];
  return `Vstup ${circuit.inputs[index]}: ${on ? 'světlo' : 'stín'}. Lampa ${lamp === 1 ? 'svítí' : 'mlčí'}.`;
}

/** Brána po neúspěšné Zkoušce: prázdný kámen, nenatočený točitý kámen, nebo kolik řádků nesedí. */
export function gateWrongWords(failed: number, empty: boolean, unwired: boolean): string {
  if (empty) return 'Některý kámen je prázdný. Bez runy jím světlo neprojde.';
  if (unwired) return 'Některý točitý kámen ještě není natočený. Dokud neukazuje vstup nebo runu, světlo jím neprojde.';
  if (failed === 1) return 'Lampa nesvítí správně v jednom řádku desky. Přepni vstupy na ten řádek a sleduj, kudy světlo teče.';
  return `Lampa nesvítí správně ${inNum(failed)} ${failed} řádcích desky. Přepínej vstupy na ty řádky jeden po druhém a sleduj, kudy světlo teče.`;
}

/**
 * Špatně poznaná runa pod závojem: první řádek, ve kterém by lampa se zvolenou runou svítila jinak.
 * Podmětem je lampa, protože jména run mají různý rod (Pouto, Důsledek, Výluka).
 */
export function wrongRuneWords(rune: Rune, names: string[], want: number[]): string {
  const n = names.length;
  if (ARITY[rune] !== n) {
    return `${RUNE_NAME[rune]} bere ${ARITY[rune] === 1 ? 'jediné světlo' : 'dvě světla'}, deska má ale ${n === 1 ? 'jeden vstup' : `${n} ${plural(n, 'vstup', 'vstupy', 'vstupů')}`}.`;
  }
  const own = runeTable(rune);
  const r = own.findIndex((v, k) => v !== want[k]);
  return `S runou ${RUNE_NAME[rune]} by lampa v řádku ${rowWords(names, r)} ${own[r] ? 'svítila' : 'mlčela'}. Na desce je to jinak.`;
}

const LEVER: Record<TideOp, string> = {
  shl: 'posun vlevo',
  shr: 'posun vpravo',
  inc: 'přidej jednu',
  dec: 'uber jednu',
  not: 'převrať',
};

/** Cesta vahami: dlouhá (Prázdná nádoba, 3 → 0 přes 15) jen se začátkem a koncem, „3 → 4 → 5 → … → 14 → 15 → 0“. */
const pathWords = (path: number[]): string => (path.length > 9 ? [...path.slice(0, 3), '…', ...path.slice(-3)] : path).join(' → ');

/**
 * Příliv: nejkratší cesta k cíli a její první páka. Ve Vahách Osudu, když se cesta do zbylých tahů
 * nevejde, řekne, že se misky vrátí, a ukáže cestu od začátku zkoušky (páka se pak nezvýrazní).
 * Když k cíli žádná cesta nevede (světlo spadlo přes okraj), pošle ke Zpět.
 */
export function tideStep(cfg: TideConfig, st: TideState): string | null {
  const target = currentTarget(cfg, st);
  if (target === null) return null;
  const first = bestOp(cfg, st);
  // Jen tam, kde jsou samé posuny: ztracené světlo už žádná páka nevrátí. Váhy Osudu mají ±1, tam to nenastane.
  if (!first) return cfg.strict ? null : `Odsud k ${target} cesta nevede: část světla spadla přes okraj. Vrať tah tlačítkem Zpět.`;
  const route = (from: number): number[] => {
    const path = [from];
    let cur = { ...st, value: from };
    for (let k = 0; k < 2 ** cfg.bits && cur.value !== target; k++) {
      const op = bestOp(cfg, cur);
      if (!op) break;
      cur = { ...cur, value: applyOp(op, cur.value, cfg.bits).value };
      path.push(cur.value);
    }
    return path;
  };
  const path = route(st.value);
  if (!pathFits(cfg, st)) {
    const need = path.length - 1;
    const left = (taskLimit(cfg, st) ?? 0) - st.taskMoves;
    const start = taskStart(cfg, st.step);
    return `Nejkratší cesta odsud má ${need} ${plural(need, 'tah', 'tahy', 'tahů')}, Osud dovolí už jen ${left}. Až tahy dojdou, misky se vrátí na ${start}. Odtud vede cesta ${pathWords(route(start))}.`;
  }
  const long = path.length > 9 ? ` má ${path.length - 1} ${plural(path.length - 1, 'tah', 'tahy', 'tahů')}` : '';
  return `Nejkratší cesta k ${target}${long}: ${pathWords(path)}. První krok je páka ${LEVER[first]}.`;
}

/**
 * Maska: co má runa na zvýrazněném krystalu udělat a jak k tomu musí svítit maska.
 * cipher: Tajná řeč, kde řady na desce nesou popisky Šifra a Zpráva místo Nápis a Výsledek.
 */
export function maskStep(task: MaskTask, bit: number, goalOn: boolean, cipher = false): string {
  const act = goalOn ? 'Zvýrazněný krystal masky rozsviť.' : 'Zvýrazněný krystal masky zhasni.';
  if (task.key !== undefined) return `Maska má být přesně klíč a klíč tu ${goalOn ? 'svítí' : 'mlčí'}. ${act}`;
  const v = isBitSet(task.value, bit);
  const t = isBitSet(task.target ?? 0, bit);
  let why: string;
  if (task.op === 'and') {
    if (!v) why = 'Nápis tu mlčí, maska ze zadání tu ale svítí.';
    else why = t ? 'Tady má výsledek svítit. Pouto pustí světlo nápisu jen tam, kde svítí maska.' : 'Tady má výsledek zhasnout. Pouto zhasne, kde maska mlčí.';
  } else if (task.op === 'or') {
    if (v) why = 'Nápis tu svítí sám, maska ze zadání tu ale svítí taky.';
    else why = t ? 'Tady má výsledek svítit a nápis mlčí. Rozcestí rozsvítí, kde svítí maska.' : 'Tady má výsledek mlčet, a tak musí mlčet i maska.';
  } else if (cipher) {
    why = v !== t ? 'Tady se zpráva liší od šifry. Výluka krystal přepne, kde svítí maska.' : 'Tady má zpráva zůstat jako šifra, a tak maska musí mlčet.';
  } else {
    why = v !== t ? 'Tady se výsledek liší od nápisu. Výluka krystal přepne, kde svítí maska.' : 'Tady má výsledek zůstat jako nápis, a tak maska musí mlčet.';
  }
  return `${why} ${act}`;
}
