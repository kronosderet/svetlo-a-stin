/**
 * Kvízy s losovanými čísly: každý hráč dostane jiná čísla, takže soused nemůže napovědět
 * „šestnáct“. Pojmové otázky (1 + 1 = 10, barva #FF8800…) zůstávají v obsahu pevné.
 * Každý generátor vrací správnou odpověď a tři různé špatné; pořadí zamíchá hra.
 */
import { popcount } from '../core/bits';
import type { Rune } from '../core/logic';
import { inNum, plural, withNum } from '../game/text';
import { int, pick, shuffled, type Rng } from './random';
import { RUNE_NAME, RUNE_RULE } from './runes';
import type { QuizQuestion } from './types';

const bin = (v: number, bits: number): string => v.toString(2).padStart(bits, '0');
/** Oktáva po čtveřicích: 0111 1111. */
const oct = (v: number): string => {
  const b = bin(v, 8);
  return `${b.slice(0, 4)} ${b.slice(4)}`;
};
const hex = (v: number, digits = 1): string => v.toString(16).toUpperCase().padStart(digits, '0');
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number): string => [...String(n)].map((d) => SUPS[Number(d)]).join('');
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number): string => [...String(n)].map((d) => SUBS[Number(d)]).join('');
/** Rozklad na váhy od nejvyšší: 13 → „8 + 4 + 1“. */
const terms = (v: number): string =>
  Array.from({ length: 31 }, (_, i) => 30 - i)
    .filter((i) => (v >> i) & 1)
    .map((i) => 2 ** i)
    .join(' + ');
const krystaly = (n: number) => `${n} ${plural(n, 'krystal', 'krystaly', 'krystalů')}`;
const bitLength = (v: number): number => v.toString(2).length;

/** Špatná možnost, případně s vysvětlením, proč je to typická chyba: [hodnota, proč]. */
type Wrong = string | number | readonly [string | number, string];

/** Otázka se správnou odpovědí na prvním místě a třemi různými špatnými. */
function make(question: string, correct: string | number, wrong: Wrong[], hint: string, explain: string): QuizQuestion {
  const c = String(correct);
  const seen = new Set([c]);
  const options = [c];
  const why = [''];
  for (const w of wrong) {
    const [value, reason] = Array.isArray(w) ? [String(w[0]), w[1] as string] : [String(w), ''];
    if (seen.has(value)) continue;
    seen.add(value);
    options.push(value);
    why.push(reason);
    if (options.length === 4) break;
  }
  return { question, options, correct: 0, hint, explain, ...(why.some(Boolean) ? { why } : {}) };
}

// --- Akt I ---

/** I-3: o krystal víc, dvakrát víc kombinací. */
export function qCombosNext(rng: Rng): QuizQuestion {
  const n = int(rng, 3, 5);
  const c = 2 ** n;
  return make(
    `Řada ${n} krystalů má ${c} kombinací. Kolik kombinací má řada ${n + 1} krystalů?`,
    c * 2,
    [
      [c, `${c} má řada ${n} krystalů. Nový krystal přidá ke každé kombinaci dvě možnosti.`],
      [c + 4, 'Kombinací nepřibývá pořád stejně. Každý krystal jejich počet zdvojí.'],
      [c * 4, 'Čtyřikrát víc by bylo se dvěma krystaly navíc. Jeden krystal počet jen zdvojí.'],
      [(n + 1) ** 2, 'Počet kombinací není počet krystalů na druhou. Každý krystal ho zdvojí.'],
    ],
    `Přidej v duchu další krystal. Každá z ${c} kombinací ho teď může mít zhasnutý, nebo rozsvícený.`,
    `Každý nový krystal zdvojí počet kombinací: ${c} · 2 = ${c * 2}.`,
  );
}

/** I-3: n krystalů má 2ⁿ kombinací. */
export function qCombosOf(rng: Rng): QuizQuestion {
  const n = int(rng, 6, 10);
  return make(
    `Kolik kombinací má řada ${n} krystalů${n === 8 ? ', celá oktáva' : ''}?`,
    2 ** n,
    [
      [2 ** (n - 1), `To je o jeden krystal míň. Jeden krystal má 2 kombinace a každý z dalších ${n - 1} krystalů jejich počet zdvojí.`],
      [2 ** (n + 1), 'To je o jeden krystal víc. První krystal dá rovnou 2 kombinace, zdvojují až ty další.'],
      [2 * n, 'Kombinace se nesčítají po dvou, s každým krystalem se násobí dvěma.'],
    ],
    'Začni u jednoho krystalu (2 kombinace) a s každým dalším zdvojnásob.',
    `2 · 2 · … · 2 (${n}×) = 2${sup(n)} = ${2 ** n}. Obecně: n krystalů má 2ⁿ kombinací.`,
  );
}

/** II-1 (Počítadlo poutníků): co následuje po čísle (přičtení jedničky). */
export function qNextCount(rng: Rng): QuizQuestion {
  const v = pick(rng, [3, 5, 7, 9, 11, 13]);
  const wrong = [v - 1, v + 2, v ^ 0b1000, v + 3, 15, 0].filter((w) => w >= 0 && w <= 15 && w !== v + 1).map((w) => bin(w, 4));
  return make(
    `Jaká kombinace následuje po ${bin(v, 4)}?`,
    bin(v + 1, 4),
    wrong,
    'Zprava: svítící krystaly zhasni, první zhasnutý rozsviť.',
    `${bin(v, 4)} + 1 = ${bin(v + 1, 4)}. Jedničky vpravo zhasly a přenos rozsvítil první zhasnutý krystal: ${v} + 1 = ${v + 1}.`,
  );
}

/** II-1 (Počítadlo poutníků): kolik krystalů se změní při předání přes k jedniček. */
export function qFlips(rng: Rng): QuizQuestion {
  const k = int(rng, 2, 7);
  const high = int(rng, 0, 2 ** (7 - k) - 1);
  const v = (high << (k + 1)) | (2 ** k - 1);
  // „2 jedničky zhasnou“, „5 jedniček zhasne“.
  const ones = `${k} ${plural(k, 'jednička', 'jedničky', 'jedniček')}`;
  const goOut = plural(k, 'zhasne', 'zhasnou', 'zhasne');
  return make(
    `Kolik krystalů se změní, když k ${oct(v)} přičteš jedničku?`,
    k + 1,
    [
      [1, 'Přičtení jedničky nemusí změnit jen jeden krystal. Předání běží přes všechny jedničky vpravo.'],
      [k, `${plural(k, 'Zhasne', 'Zhasnou', 'Zhasne')} ${ones}, ale rozsvítí se ještě nula za nimi.`],
      k + 2 > 8 ? k - 1 : k + 2,
    ],
    'Předání běží zprava přes všechny jedničky, dokud nenarazí na nulu.',
    `${ones} vpravo ${goOut} a nula za nimi se rozsvítí: ${oct(v)} + 1 = ${oct(v + 1)}. Změní se ${krystaly(k + 1)}.`,
  );
}

/** I-10: největší číslo z n krystalů. */
export function qMaxValue(rng: Rng): QuizQuestion {
  const n = pick(rng, [5, 6, 7, 9]);
  return make(
    `Jaké je největší číslo, které zapíšeš ${n} krystaly?`,
    2 ** n - 1,
    [
      [2 ** n, `${2 ** n} je počet kombinací. Jedna z nich je ale tma, nula, a tak největší číslo je o jedna menší.`],
      [2 ** (n - 1), `${2 ** (n - 1)} je váha nejtěžšího krystalu. K ní přidej i všechny lehčí.`],
      [n * n, 'Krystaly se nenásobí. Sečti váhy všech, když svítí.'],
    ],
    `Rozsviť v duchu všech ${n}: ${terms(2 ** n - 1)}.`,
    `${'1'.repeat(n)}${sub(2)} = 2${sup(n)} − 1 = ${2 ** n - 1}. Na číslo ${2 ** n} už je potřeba další krystal.`,
  );
}

/** I-10: kolik krystalů je potřeba na číslo. */
export function qBitsFor(rng: Rng): QuizQuestion {
  const x = pick(rng, [100, 200, 300, 500, 700, 1000, 2000, 3000]);
  const n = bitLength(x);
  return make(
    `Kolik krystalů je potřeba na zápis čísla ${x}?`,
    n,
    [
      [n - 1, `${krystaly(n - 1)} unese nejvýš ${2 ** (n - 1) - 1}, na ${x} to nestačí.`],
      [n + 1, `I ${krystaly(n)} unese až ${2 ** n - 1}, ${x} se vejde. Hledá se nejmenší počet.`],
      n + 2,
    ],
    `Hledej nejmenší počet krystalů, který unese aspoň ${x}. Pomůže řada 128, 256, 512, 1024, 2048, 4096.`,
    `${krystaly(n - 1)} unese nejvýš 2${sup(n - 1)} − 1 = ${2 ** (n - 1) - 1}, ${n} už ${2 ** n - 1}. Na ${x} je tedy potřeba ${krystaly(n)}.`,
  );
}

/** I-11: Grayův kód projde 2ⁿ kombinací za 2ⁿ − 1 doteků. */
export function qGrayMoves(rng: Rng): QuizQuestion {
  const n = int(rng, 3, 5);
  const all = 2 ** n;
  return make(
    `Kolik doteků nejméně stačí na všech ${all} kombinací řady ${n} krystalů?`,
    all - 1,
    [
      [all, 'První kombinaci, tmu, už máš bez doteku. Doteků je o jeden míň než kombinací.'],
      [n, 'Jedním dotekem přibude jen jedna nová kombinace. Na všechny je potřeba víc doteků.'],
      all * 2,
    ],
    'První kombinaci (tmu) už máš. Každý dotek přidá nejvýš jednu novou.',
    `Tma je první kombinace a každý dotek přidá jednu novou: ${all} − 1 = ${all - 1} doteků.`,
  );
}

/** I-11: sousedé v Grayově kódu se liší v jediném krystalu. */
export function qGrayPair(rng: Rng): QuizQuestion {
  const v = int(rng, 0, 15);
  const near = v ^ (1 << int(rng, 0, 3));
  const masks = shuffled(rng, [0b0011, 0b0101, 0b0110, 0b1001, 0b1010, 0b1100, 0b0111, 0b1111]).slice(0, 3);
  return make(
    'Které dvě kombinace můžou v Grayově kódu stát hned za sebou?',
    `${bin(v, 4)} a ${bin(near, 4)}`,
    masks.map((m) => `${bin(v, 4)} a ${bin(v ^ m, 4)}`),
    'Sousedé se smí lišit jen v jednom krystalu.',
    `${bin(v, 4)} a ${bin(near, 4)} se liší jen v jednom krystalu. Ostatní dvojice se liší ve dvou krystalech nebo víc.`,
  );
}

/** I-13: glyf (šestnáctková číslice) k čtveřici. */
export function qGlyphOf(rng: Rng): QuizQuestion {
  const v = int(rng, 10, 15);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'].filter((l) => l !== hex(v));
  return make(
    `Jaký glyf patří čtveřici ${bin(v, 4)}?`,
    hex(v),
    shuffled(rng, letters),
    `Sečti váhy: ${terms(v)}.`,
    `${bin(v, 4)}${sub(2)} = ${terms(v)} = ${v} = ${hex(v)}${sub(16)}. Pro 10 až 15 má šestnáctková soustava písmena A až F.`,
  );
}

/** I-13: kolik váží glyf s písmenem. */
export function qGlyphWeight(rng: Rng): QuizQuestion {
  const v = int(rng, 10, 15);
  return make(
    `Kolik váží glyf ${hex(v)}?`,
    v,
    [
      [v + 1, 'O jedna vedle. A je 10, B 11, C 12, D 13, E 14 a F 15.'],
      [v - 1, 'O jedna vedle. A je 10, B 11, C 12, D 13, E 14 a F 15.'],
      16 - v,
    ],
    'A je 10, B 11 a tak dál až po F.',
    `${hex(v)}${sub(16)} = ${bin(v, 4)}${sub(2)} = ${terms(v)} = ${v}.`,
  );
}

/** I-14: oktáva dvěma glyfy. */
export function qByteHex(rng: Rng): QuizQuestion {
  let a = 0;
  let b = 0;
  do {
    a = int(rng, 1, 15);
    b = int(rng, 0, 15);
  } while (a === b || (a < 10 && b < 10));
  const v = (a << 4) | b;
  return make(
    `Jak se oktáva ${oct(v)} zapíše dvěma glyfy?`,
    hex(v, 2),
    [
      [hex(b) + hex(a), 'Glyfy jsou prohozené. Levá čtveřice dá levý glyf.'],
      [String(v), 'Tohle je desítkový zápis. Glyfy jsou dva, jeden na každou čtveřici.'],
      hex(a) + hex(b ^ 1),
    ],
    `Levá čtveřice je ${bin(a, 4)}, pravá ${bin(b, 4)}. Každá je jeden glyf.`,
    `${bin(a, 4)} = ${hex(a)} a ${bin(b, 4)} = ${hex(b)}, tedy ${hex(v, 2)}${sub(16)}. Desítkově ${a} · 16 + ${b} = ${v}.`,
  );
}

// --- Akt II ---

const MISTNYCH: Record<number, string> = { 4: 'čtyřmístných', 5: 'pětimístných', 6: 'šestimístných', 8: 'osmimístných' };

/** Jediná dvojice ve sloupci s váhou 2 nebo 4, vlevo od ní volno, aspoň jedno samotné světlo, součet do 15. */
const onePair = (a: number, b: number): boolean => {
  const p = a & b;
  return popcount(p) === 1 && (p & 0b0110) !== 0 && ((p << 1) & (a | b)) === 0 && (a ^ b) !== 0 && a + b < 16;
};

/** II-2 (Dvě dvojky): součet s jednou dvojicí, která přeteče do prázdného sloupce. */
export function qPairSum(rng: Rng): QuizQuestion {
  let a = 0;
  let b = 0;
  do {
    a = int(rng, 1, 15);
    b = int(rng, 1, 15);
  } while (!onePair(a, b));
  const w = a & b;
  const s = a + b;
  return make(
    `Kolik je ${bin(a, 4)} + ${bin(b, 4)}?`,
    bin(s, 4),
    [
      [bin(a | b, 4), `Ve sloupci s váhou ${w} svítí obě světla. Nezůstane z nich jedno: dvojice přeteče o sloupec vlevo.`],
      [bin(a ^ b, 4), `Dvojice nezmizela. Pod ní zůstal stín, ale světlo s váhou ${2 * w} se rozsvítí o sloupec vlevo.`],
      [bin(a | b | (w << 1), 4), 'Pod dvojicí nezůstane světlo. Obě světla odtečou do jednoho krystalu vlevo.'],
    ],
    'Sčítej po sloupcích. Kde se slijí dvě světla, dole zůstane stín a o sloupec vlevo se rozsvítí krystal.',
    `${bin(a, 4)} + ${bin(b, 4)} = ${bin(s, 4)}, tedy ${a} + ${b} = ${s}. Dvě světla s váhou ${w} váží ${2 * w}, a to je krystal o sloupec vlevo.`,
  );
}

/** II-2 (Dvě dvojky): kam přeteče dvojice světel s váhou w (i mimo desku). */
export function qPairWeight(rng: Rng): QuizQuestion {
  const w = pick(rng, [4, 8, 16]);
  return make(
    `Ve sloupci s váhou ${w} se slila dvě světla a sloupec vlevo je prázdný. Který krystal výsledku se rozsvítí?`,
    `krystal s váhou ${2 * w}`,
    [
      ['krystal s váhou 2', `Dvě světla nejsou dvojka. Každé z nich váží ${w}, dohromady ${2 * w}.`],
      [`krystal s váhou ${w}`, 'Dvě světla se do jednoho krystalu nevejdou. Pod dvojicí zůstane stín.'],
      [`krystal s váhou ${w + 1}`, `Krystal s váhou ${w + 1} neexistuje. Váhy jdou 1, 2, 4, 8, 16, 32 a každá je dvojnásobkem předchozí.`],
    ],
    `Kolik váží dvě světla s váhou ${w}? Který krystal váží právě tolik?`,
    `${w} + ${w} = ${2 * w} a tolik váží krystal o sloupec vlevo. Každý krystal váží dvakrát víc než soused vpravo, proto dvojice v kterémkoli sloupci přeteče právě o jeden sloupec: ${w.toString(2)}${sub(2)} + ${w.toString(2)}${sub(2)} = ${(2 * w).toString(2)}${sub(2)}.`,
  );
}

/** II-4: součet n-bitových čísel má nejvýš n + 1 bitů. */
export function qSumBits(rng: Rng): QuizQuestion {
  const n = pick(rng, [4, 5, 6, 8]);
  const max = 2 ** n - 1;
  return make(
    `Kolik krystalů nejvýš potřebuje součet dvou ${MISTNYCH[n]} dvojkových čísel?`,
    n + 1,
    [
      [n, `Největší součet ${max} + ${max} = ${2 * max} se do ${n} krystalů nevejde.`],
      n + 2,
      [2 * n, 'Krystaly se nesčítají. Součet přidá nejvýš jedno místo vlevo, kam přeteče přenos.'],
    ],
    `Největší součet je ${max} + ${max}. Kolik krystalů unese ${2 * max}?`,
    `Součet dvou n-bitových čísel má nejvýš n + 1 bitů: ${max} + ${max} = ${2 * max} = ${bin(2 * max, n + 1)}${sub(2)} se vejde do ${n + 1} krystalů.`,
  );
}

/** II-6: posun vpravo rozpůlí. */
export function qHalve(rng: Rng): QuizQuestion {
  const v = 2 * int(rng, 10, 63);
  const h = v / 2;
  return make(
    `Světla ${oct(v)} (${v}) posuneš o jedno místo vpravo. Kolik budou vážit?`,
    h,
    [
      h + 1,
      h - 1,
      [
        v * 2 > 255 ? Math.floor(v / 4) : v * 2,
        v * 2 > 255 ? 'To by byly dva posuny vpravo. Jeden posun rozpůlí.' : 'Posun vpravo nezdvojí, rozpůlí. Zdvojí posun vlevo.',
      ],
    ],
    'Posun vpravo rozpůlí.',
    `${oct(v)} → ${oct(h)} = ${h}. Nejpravější krystal byl ve stínu, takže se nic neztratilo.`,
  );
}

/** II-6: posun o k míst vlevo násobí 2ᵏ. */
export function qShiftMul(rng: Rng): QuizQuestion {
  const k = int(rng, 2, 3);
  const words = k === 2 ? 'dvě místa' : 'tři místa';
  return make(
    `Co udělá posun o ${words} vlevo?`,
    `vynásobí ${2 ** k}`,
    [
      [`přičte ${k}`, 'Posun nepřičítá. Každé místo vlevo číslo zdvojí.'],
      [`vynásobí ${k}`, `Každé místo zdvojí zvlášť: ${Array(k).fill('2').join(' · ')} = ${2 ** k}, ne ${k}.`],
      [`přičte ${2 ** k}`, 'Posun nepřičítá, násobí. Zkus to s jedničkou a s trojkou.'],
    ],
    'Jeden posun zdvojí. A další?',
    `Každý posun vlevo násobí dvěma: ${Array(k).fill('2').join(' · ')} = ${2 ** k}. Obecně posun o k míst násobí 2ᵏ.`,
  );
}

/** II-7: co zůstane v nádobě se čtyřmi krystaly po přetečení. */
export function qOverflow(rng: Rng): QuizQuestion {
  let a = 0;
  let b = 0;
  do {
    a = int(rng, 5, 15);
    b = int(rng, 5, 15);
  } while (a + b < 17);
  const r = (a + b) & 15;
  return make(
    `Nádoba unese čtyři krystaly. Co v ní zůstane po ${bin(a, 4)} + ${bin(b, 4)} (${a} + ${b})?`,
    bin(r, 4),
    [
      [bin(a + b, 5), 'Tohle je pět krystalů. Nádoba unese jen čtyři, páté světlo vyteče.'],
      ['1111', 'Nádoba nezůstane plná. Co se nevejde, vyteče, a zbude jen to, co je ve čtyřech krystalech.'],
      [bin(a, 4), 'To je jen první sčítanec. Sečti oba.'],
      [bin(b, 4), 'To je jen druhý sčítanec. Sečti oba.'],
      bin(r ^ 1, 4),
      bin(r ^ 2, 4),
    ],
    'Sečti a podívej se, jestli se výsledek vejde do čtyř krystalů.',
    `${a} + ${b} = ${a + b} = ${bin(a + b, 5)}${sub(2)}. Páté světlo (16) se do nádoby nevejde a vyteče, zůstane ${bin(r, 4)} = ${r}.`,
  );
}

/** II-7: posun o k míst vlevo. */
export function qShiftLeft(rng: Rng): QuizQuestion {
  const v = pick(rng, [3, 5, 6, 7]);
  const k = int(rng, 2, 3);
  const r = v << k;
  return make(
    `Světla ${oct(v)} (${v}) posuneš o ${k} místa vlevo. Kolik budou vážit?`,
    r,
    [
      [v * k, `Posun nenásobí počtem míst. Každé místo zdvojí: ${v} · ${2 ** k}.`],
      [v << (k - 1), 'O jeden posun méně. Zdvojuj za každé místo.'],
      [v + 2 ** k, 'Posun nepřičítá, násobí.'],
      v << (k + 1),
    ],
    'Každý posun vlevo zdvojí.',
    `${v} · ${Array(k).fill('2').join(' · ')} = ${r} = ${oct(r)}${sub(2)}. Posun o ${k} místa násobí 2${sup(k)} = ${2 ** k}.`,
  );
}

/** Páky ×2 a +1 podle číslic zápisu (Hornerovo schéma). */
function hornerOps(t: number): string {
  const ops: string[] = [];
  for (const d of t.toString(2).slice(1)) ops.push(d === '1' ? '×2, +1' : '×2');
  return ops.join(', ');
}

/** II-9: jakými tahy z 1 postavit číslo. */
export function qHorner(rng: Rng): QuizQuestion {
  const t = int(rng, 9, 15);
  const others = shuffled(
    rng,
    [8, 9, 10, 11, 12, 13, 14, 15].filter((o) => o !== t),
  ).slice(0, 3);
  const chain = [1];
  for (const d of t.toString(2).slice(1)) chain.push(chain[chain.length - 1] * 2 + Number(d));
  return make(
    `Jakými tahy dostaneš z 1 číslo ${t} (${bin(t, 4)})?`,
    hornerOps(t),
    others.map(hornerOps),
    'Čti zápis zleva. První jednička je start, za každou další číslici zdvoj, a když je to jednička, přidej jednu.',
    `${chain.map((c) => c.toString(2)).join(' → ')}: ${hornerOps(t)}. Tahy kopírují číslice zápisu.`,
  );
}

/** II-9: z 1 na 2ᵏ stačí k zdvojení. */
export function qPowerSteps(rng: Rng): QuizQuestion {
  const k = int(rng, 3, 6);
  return make(
    `Kolik tahů nejméně potřebuješ z 1 na ${2 ** k}?`,
    k,
    [
      [k + 1, 'Start na 1 už je hotový, první tah ho zdvojí na 2. Počítej jen zdvojení.'],
      [2 ** (k - 1), 'Přičítat po jedné je pomalé. Páka ×2 zdvojí celé číslo naráz.'],
      [2 ** k - 1, 'Tolik tahů by stálo přičítání po jedné. Zdvojování je mnohem rychlejší.'],
      k - 1,
    ],
    `${2 ** k} = 1${'0'.repeat(k)}${sub(2)}.`,
    `${Array.from({ length: k + 1 }, (_, i) => 2 ** i).join(' → ')}: za každou nulu jeden tah ×2, tedy ${k} ${plural(k, 'tah', 'tahy', 'tahů')}.`,
  );
}

/** II-10: kolik kopií se sčítá (jedniček druhého činitele). */
export function qCopies(rng: Rng): QuizQuestion {
  const m = pick(rng, [0b1011, 0b1101, 0b0111, 0b1110, 0b1001, 0b10101, 0b11010]);
  const len = Math.max(4, bitLength(m));
  const shifts = Array.from({ length: len }, (_, i) => i).filter((i) => (m >> i) & 1);
  const p = shifts.length;
  // Výčet „1, 2 a 3“; tvar slova se řídí posledním číslem („o 0 a 3 místa“, „o 1, 3 a 4 místa“).
  const list = (xs: string[]) => `${xs.slice(0, -1).join(', ')} a ${xs[xs.length - 1]}`;
  const last = shifts[p - 1];
  return make(
    `Kolik kopií prvního činitele sčítáš, když je druhý činitel ${bin(m, len)}?`,
    p,
    [
      p + 1,
      p - 1,
      [len, 'Kopie nepatří ke každému místu, jen k místu s jedničkou.'],
      [m, 'Kopií není tolik, kolik je druhý činitel. Stačí jedna za každou jedničku jeho zápisu.'],
    ],
    'Kopie přibude za každou jedničku.',
    `${bin(m, len)} má ${p} ${plural(p, 'jedničku', 'jedničky', 'jedniček')}: kopie posunuté o ${list(shifts.map(String))} ${plural(last, 'místo', 'místa', 'míst')} (${list(shifts.map((s) => `×${2 ** s}`))}). ${shifts.map((s) => 2 ** s).join(' + ')} = ${m}.`,
  );
}

/** II-11: zbytek po dělení 8 nebo 16 = krystaly, které spadnou. */
export function qRemainder(rng: Rng): QuizQuestion {
  const d = pick(rng, [8, 16]);
  const k = d === 16 ? 4 : 3;
  let v = 0;
  do v = int(rng, 40, 250);
  while ((v & (d - 1)) < 2);
  const rem = v & (d - 1);
  const quo = v >> k;
  return make(
    `Jaký zbytek zůstane po dělení ${oct(v)} (${v}) ${d === 16 ? 'šestnácti' : 'osmi'}?`,
    `${bin(rem, k)} (${rem})`,
    [
      [`${bin(quo, 8 - k)} (${quo})`, 'Tohle je podíl, co zůstane na krystalech. Zbytek jsou krystaly, které spadnou vpravo.'],
      ...[rem ^ 1, 0, d - 1, rem ^ 2].map((x) => `${bin(x, k)} (${x})`),
    ],
    `${d} = 2${sup(k)}, tedy ${k} posuny vpravo. Které krystaly spadnou?`,
    `${k} posuny shodí ${k} krystaly vpravo: ${bin(rem, k)} = ${rem}. Na krystalech zbude ${bin(quo, 8 - k)} = ${quo}. Opravdu: ${quo} · ${d} + ${rem} = ${v}.`,
  );
}

/** II-11: dělitelné osmi beze zbytku = končí třemi nulami. */
export function qDivisible(rng: Rng): QuizQuestion {
  const h = int(rng, 1, 15);
  const good = pick(rng, [0b0000, 0b1000]);
  const bad = shuffled(
    rng,
    Array.from({ length: 16 }, (_, i) => i).filter((i) => (i & 7) !== 0),
  ).slice(0, 3);
  const c = (h << 4) | good;
  return make(
    'Které číslo jde vydělit osmi beze zbytku?',
    oct(c),
    bad.map((l) => oct((h << 4) | l)),
    'Osm jsou tři posuny. Co musí platit pro tři krystaly vpravo?',
    `${oct(c)} končí třemi stíny, takže při třech posunech nic nespadne: ${c} : 8 = ${c / 8}.`,
  );
}

/** II-13: záporné číslo jako doplněk. */
export function qNegative(rng: Rng): QuizQuestion {
  const b = int(rng, 2, 7);
  const comp = (16 - b) & 15;
  return make(
    `Jak se ve čtyřech krystalech zapíše −${b}?`,
    bin(comp, 4),
    [
      [bin(b, 4), `Tohle je kladné ${b}. Záporné číslo je doplněk: převrátit a přidat jednu.`],
      [bin(b ^ 15, 4), 'Jen převrácené. Ještě přidej jednu.'],
      [bin((comp + 1) & 15, 4), 'Jednička je navíc dvakrát. Převrať a přidej jednu jen jednou.'],
    ],
    `${b} = ${bin(b, 4)}. Převrať a přidej jednu.`,
    `${bin(b, 4)} převrácené je ${bin(b ^ 15, 4)}, plus jedna ${bin(comp, 4)}. Kontrola: ${bin(b, 4)} + ${bin(comp, 4)} = 1 0000, v nádobě zbude 0000.`,
  );
}

/** II-13: odčítání přičtením doplňku. Menšenec do 7, aby nejvyšší bit nesl znaménko jako v Kodexu. */
export function qComplementSum(rng: Rng): QuizQuestion {
  const a = int(rng, 2, 7);
  const b = int(rng, 1, a - 1);
  const c = (16 - b) & 15;
  const r = a - b;
  const full = bin(a + c, 5);
  return make(
    `Kolik je ${bin(a, 4)} + ${bin(c, 4)} v nádobě se čtyřmi krystaly?`,
    bin(r, 4),
    [
      [full, 'Tohle je pět krystalů. Přetečení se do nádoby nevejde a vyteče.'],
      [bin((a + b) & 15, 4), `To je ${a} + ${b}. Doplněk ale znamená −${b}, takže se odčítá.`],
      bin((r + 1) & 15, 4),
    ],
    `${bin(c, 4)} je doplněk čísla ${b}, tedy −${b}.`,
    `${bin(a, 4)} + ${bin(c, 4)} = ${full[0]} ${full.slice(1)}. Přetečení zahodíme a zbude ${bin(r, 4)} = ${r}, což je ${a} − ${b}.`,
  );
}

/** II-14: odčítání s výpůjčkou. */
export function qSubtract(rng: Rng): QuizQuestion {
  let a = 0;
  let b = 0;
  do {
    a = int(rng, 6, 15);
    b = int(rng, 1, Math.min(7, a - 1));
  } while ((a & b) === b);
  const r = a - b;
  return make(
    `Kolik je ${bin(a, 4)} − ${bin(b, 4)}?`,
    bin(r, 4),
    [
      [bin((a + b) & 15, 4), 'Tohle je součet, ne rozdíl.'],
      [bin((a ^ b) & 15, 4), 'Odečteno sloupec po sloupci bez výpůjčky. Kde nebylo z čeho brát, je potřeba si půjčit od souseda.'],
      bin((r > 0 ? r - 1 : r + 1) & 15, 4),
      bin((r + 1) & 15, 4),
      bin((r ^ 8) & 15, 4),
    ],
    'Kde nemáš z čeho brát, půjč si od souseda.',
    `${bin(a, 4)} − ${bin(b, 4)} = ${bin(r, 4)}, tedy ${a} − ${b} = ${r}.`,
  );
}

/** II-14: násobení mocninou dvou posunem. */
export function qFastMul(rng: Rng): QuizQuestion {
  const v = int(rng, 3, 7);
  const k = int(rng, 1, 3);
  const m = 2 ** k;
  const places = (n: number) => ({ 1: 'jedno místo', 2: 'dvě místa', 3: 'tři místa', 4: 'čtyři místa', 8: 'osm míst' })[n] ?? `${n} míst`;
  return make(
    `Jak nejrychleji spočítáš ${bin(v, 4)} × ${m}?`,
    `posunem o ${places(k)} vlevo`,
    [
      [`sečtením ${m} kopií`, 'Jde to, ale pomalu. Násobení mocninou dvou je jen posun.'],
      [`posunem o ${places(m === 2 ? 2 : m)} vlevo`, `Posun o jedno místo zdvojí. Na ×${m} stačí ${places(k)}.`],
      [`přičtením ${bin(m, k + 1)}`, 'Přičítání nenásobí.'],
    ],
    `${m} = ${bin(m, k + 1)}${sub(2)}.`,
    `Násobit ${m} znamená ${k}× zdvojit, tedy posunout o ${places(k)}: ${bin(v, 4)} → ${(v << k).toString(2)} = ${v * m}.`,
  );
}

// --- Akt III ---

/** III: deska zákona pro n vstupů má 2ⁿ řádků. */
/** III-5: v kolika řádcích desky svítí Pouto, nebo Rozcestí s víc vstupy. */
export function qTableLit(rng: Rng): QuizQuestion {
  const n = int(rng, 3, 4);
  const rows = 2 ** n;
  if (pick(rng, [true, false])) {
    return make(
      `Pouto ${withNum(n)} ${n} vstupy pustí světlo, jen když svítí všechny. V kolika řádcích desky zákona svítí lampa?`,
      1,
      [
        [n, 'Lampa nesvítí jednou za každý vstup. Všechny vstupy svítí naráz jen v jednom řádku.'],
        [rows / 2, 'Každý vstup svítí v polovině řádků. Pouto chce všechny naráz.'],
        [rows - 1, 'Tak často svítí Rozcestí. Pouto svítí, jen když svítí všechno.'],
      ],
      'Kolik řádků desky má světlo na všech vstupech?',
      `Všechny vstupy svítí jen v jediném řádku, ${'1'.repeat(n)}. V ostatních ${rows - 1} řádcích lampa mlčí.`,
    );
  }
  return make(
    `Rozcestí ${withNum(n)} ${n} vstupy pustí světlo, když svítí aspoň jeden. V kolika řádcích desky zákona svítí lampa?`,
    rows - 1,
    [
      [rows, `V řádku ${'0'.repeat(n)} nesvítí žádný vstup, a tak lampa mlčí.`],
      [n, 'Rozcestí nechce právě jeden vstup, stačí mu aspoň jeden.'],
      [rows / 2, 'V polovině řádků svítí první vstup. Rozcestí ale stačí kterýkoli.'],
    ],
    'Ve kterém řádku desky mlčí všechny vstupy?',
    `Lampa mlčí jen v řádku ${'0'.repeat(n)}. Svítí tedy ${inNum(rows - 1)} ${rows - 1} řádcích z ${rows}.`,
  );
}

export function qTableRows(rng: Rng): QuizQuestion {
  const n = int(rng, 3, 5);
  return make(
    `Kolik řádků má deska zákona pro runu ${withNum(n)} ${n} vstupy?`,
    2 ** n,
    [
      [2 * n, 'Řádků nepřibývá po dvou. Každý vstup jejich počet zdvojí, jako krystal kombinace.'],
      [2 ** (n - 1), 'To je o jeden vstup méně.'],
      [2 ** (n + 1), 'To je o jeden vstup víc.'],
      n + 1,
    ],
    `Každý řádek je jedna kombinace vstupů. Kolik kombinací ${plural(n, 'má', 'mají', 'má')} ${krystaly(n)}?`,
    `Každý vstup je světlo, nebo stín, takže řádků je 2${sup(n)} = ${2 ** n}. Stejně jako kombinací ${n} krystalů v Předsíni.`,
  );
}

// --- Strážce schodů: opakování na schodech mezi patry ---

/** Zrcadlový obraz čtveřice (nejlehčí krystal vlevo). */
const mirror4 = (v: number): number => parseInt([...bin(v, 4)].reverse().join(''), 2);

/** Schody: přečti nápis. Čtení čísel z Předsíně se jinak do konce základní cesty vypaří. */
export function qRead(rng: Rng): QuizQuestion {
  let v = 0;
  do v = int(rng, 5, 14);
  while (mirror4(v) === v || popcount(v) < 2);
  return make(
    `Kolik váží nápis ${bin(v, 4)}?`,
    v,
    [
      [mirror4(v), 'Čteš zrcadlově. Nejtěžší krystal, osmička, stojí vlevo.'],
      [popcount(v), 'To je počet světel. Každé ale váží jinak: zprava 1, 2, 4, 8.'],
      v ^ 1,
      v + 2,
    ],
    'Zprava váží 1, 2, 4, 8. Sečti váhy svítících krystalů.',
    `${bin(v, 4)} = ${terms(v)} = ${v}.`,
  );
}

/** Schody: zapiš číslo krystaly. */
export function qWrite(rng: Rng): QuizQuestion {
  let v = 0;
  do v = int(rng, 5, 14);
  while (mirror4(v) === v);
  return make(
    `Jak se čtyřmi krystaly zapíše ${v}?`,
    bin(v, 4),
    [
      [bin(mirror4(v), 4), 'Zrcadlově. Nejtěžší krystal stojí vlevo.'],
      [bin(v - 1, 4), `To je ${v - 1}.`],
      [bin(v + 1, 4), `To je ${v + 1}.`],
    ],
    'Začni vlevo: vejde se osmička? Pak čtyřka, dvojka a jednička.',
    `${v} = ${terms(v)}, tedy ${bin(v, 4)}.`,
  );
}

/** Schody: sečti dvě čtveřice s přenosem. */
export function qAdd(rng: Rng): QuizQuestion {
  let a = 0;
  let b = 0;
  do {
    a = int(rng, 3, 9);
    b = int(rng, 3, 15 - a);
  } while ((a & b) === 0);
  const s = a + b;
  return make(
    `Kolik je ${bin(a, 4)} + ${bin(b, 4)}?`,
    bin(s, 4),
    [
      [bin(a ^ b, 4), 'Sečteno bez přenosů. Dvě světla ve sloupci dají 10: dole stín a jedno přeteče doleva.'],
      [bin(a | b, 4), 'Kde svítí obě světla, nezůstane jedno. Přeteče do sousedního sloupce.'],
      bin((s + 1) & 15, 4),
      bin(s - 1, 4),
    ],
    'Sčítej zprava po sloupcích. Dvě světla ve sloupci: dole stín a přenos doleva.',
    `${a} + ${b} = ${s} = ${bin(s, 4)}.`,
  );
}

/** Schody: pozná runu podle zákona. */
export function qRuneByRule(rng: Rng): QuizQuestion {
  const runes: Rune[] = ['and', 'or', 'xor', 'nand', 'nor'];
  const rune = pick(rng, runes);
  const others = shuffled(
    rng,
    runes.filter((r) => r !== rune),
  ).slice(0, 3);
  return make(
    `Která runa ${RUNE_RULE[rune]}?`,
    RUNE_NAME[rune],
    others.map((r) => [RUNE_NAME[r], `${RUNE_NAME[r]} ${RUNE_RULE[r]}.`] as const),
    'Vzpomeň si na desky zákona ze Zahrady.',
    `${RUNE_NAME[rune]} ${RUNE_RULE[rune]}.`,
  );
}

// --- Sudé a liché (I-9) ---

/** I-9: které číslo je liché (pozná se podle pravého krystalu). */
export function qOdd(rng: Rng): QuizQuestion {
  const odd = int(rng, 0, 127) * 2 + 1;
  const evens = shuffled(
    rng,
    Array.from({ length: 40 }, () => int(rng, 1, 127) * 2),
  ).filter((v, k, all) => all.indexOf(v) === k);
  // Typická chyba: sudé číslo s mnoha světly vypadá „liše“.
  const busy = evens.sort((x, y) => popcount(y) - popcount(x));
  return make(
    'Které z těchto čísel je liché?',
    oct(odd),
    busy.slice(0, 3).map((v) => [oct(v), `${oct(v)} končí stínem, takže je sudé. O lichosti rozhoduje jen pravý krystal.`] as const),
    'Lichost pozná jediný krystal. Který?',
    `${oct(odd)} má rozsvícený pravý krystal s váhou 1, všechny ostatní váhy jsou sudé.`,
  );
}

/** I-9: kolikrát jde číslo vydělit dvěma beze zbytku (počet nul vpravo). */
export function qTrailing(rng: Rng): QuizQuestion {
  const k = int(rng, 1, 4);
  const v = ((int(rng, 0, 7) << 1) | 1) << k;
  const zeros = (n: number) => `${n} ${plural(n, 'stín', 'stíny', 'stínů')}`;
  return make(
    `Kolikrát za sebou jde ${oct(v & 0xff)} vydělit dvěma beze zbytku?`,
    k,
    [
      [popcount(v & 0xff), 'To je počet světel. Dělení dvěma ale hlídá stíny vpravo.'],
      [k + 1, `${k === 1 ? 'Vpravo je jen jeden stín.' : `Vpravo jsou jen ${zeros(k)}.`} Potom přijde světlo a půlit beze zbytku už nejde.`],
      [k - 1 || k + 2, 'Počítej stíny vpravo, dokud nepřijde první světlo.'],
      k + 2,
      k + 3,
    ],
    'Každý stín vpravo je jedno půlení beze zbytku.',
    `${oct(v & 0xff)} končí ${k === 1 ? 'jedním stínem' : `${k} stíny`}, takže jde ${k}× vydělit dvěma: ${v} : ${2 ** k} = ${v >> k}.`,
  );
}
