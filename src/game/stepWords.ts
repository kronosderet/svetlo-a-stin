/**
 * Ukázka kroku s důvodem: vedle zvýrazněného krystalu, páky nebo řádku jedna věta, proč právě
 * tenhle krok. Ze slepého klikání se tak stane ukázkový příklad („Žádáno 13. Váha 8 se vejde…“).
 * Čisté funkce nad stavem hádanky; texty bez zájmen bez předmětu („rozsviť ho“).
 */
import { isBitSet } from '../core/bits';
import { ARITY, inputBit, runeTable, type Rune } from '../core/logic';
import { evaluate, type Circuit } from '../core/puzzles/gate';
import { applyOp, type TideConfig, type TideOp, type TideState, bestOp, currentTarget } from '../core/puzzles/tide';
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

/** Čtení nápisu: váhy svítících krystalů (u dvojznaku zvlášť pro každý glyf). Součet nechá na hráči. */
export function readStep(value: number, bits: number, glyphs: boolean): string {
  const lit = (from: number, to: number, shift = 0) => {
    const out: number[] = [];
    for (let i = to - 1; i >= from; i--) if (isBitSet(value, i)) out.push(2 ** (i - shift));
    return out.length ? out.join(' + ') : '0';
  };
  if (glyphs && bits === 8) return `Každá čtveřice je jeden glyf. Vlevo sečti ${lit(4, 8, 4)}, vpravo ${lit(0, 4)}.`;
  return `Sečti váhy svítících krystalů: ${lit(0, bits)}.`;
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

/** Příliv: nejkratší cesta k cíli a její první páka. */
export function tideStep(cfg: TideConfig, st: TideState): string | null {
  const target = currentTarget(cfg, st);
  const first = bestOp(cfg, st);
  if (target === null || !first) return null;
  const path = [st.value];
  let cur = { ...st };
  for (let k = 0; k < 10 && cur.value !== target; k++) {
    const op = bestOp(cfg, cur);
    if (!op) break;
    cur = { ...cur, value: applyOp(op, cur.value, cfg.bits).value };
    path.push(cur.value);
  }
  return `Nejkratší cesta k ${target}: ${path.join(' → ')}. První krok je páka ${LEVER[first]}.`;
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
