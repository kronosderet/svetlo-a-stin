/**
 * Převod uloženého postupu na nové číslování komnat. Komnaty mají čísla podle glyfu:
 * nultá komnata 0, základní cesta 1–7 (7 = brána), Hlubší síně 8–15.
 */

/**
 * Verze rozvržení komnat, kterou postup používá:
 *  1 (nebo chybí) = původní číslování 1–10,
 *  2 = rozdělení pater na základní cestu 1–7 a Hlubší síně 8–15,
 *  3 = nultá komnata v každém patře, Probuzení se přestěhovalo z I-1 na I-0,
 *  4 = Počítadlo poutníků z I-9 do II-1, Soutok a Dvě řady sloučené do II-2, v I-9 nové Sudé a liché,
 *  5 = Soutok se sloučil s nultou komnatou II-0 (hračka se sčítáním dvou krystalů), v II-2 je nová komnata.
 */
export const LAYOUT = 5;

/** Kroky převodu: z rozvržení k na k + 1 (komnaty, které číslo nezměnily, tu nejsou). */
const STEPS: Record<number, Record<string, string>> = {
  1: {
    'I-6': 'I-8',
    'I-7': 'I-6',
    'I-8': 'I-9',
    'I-9': 'I-10',
    'I-10': 'I-7',
    'II-6': 'II-8',
    'II-7': 'II-6',
    'II-8': 'II-9',
    'II-9': 'II-10',
    'II-10': 'II-14',
  },
  2: { 'I-1': 'I-0' },
  // Soutok (II-1) i Dvě řady (II-2) jsou teď jedna komnata II-2: záznamy se sloučí (viz merge).
  3: { 'I-9': 'II-1', 'II-1': 'II-2' },
  // Soutok (II-2) je teď součástí hračky II-0: záznamy se sloučí, nová II-2 začíná neodehraná.
  4: { 'II-2': 'II-0' },
};

/**
 * Sloučení, ve kterých vyhraje vlastní záznam cílové komnaty (pečetě i statistiky). Přesunutý záznam
 * komnatu otevře, jen když vlastní záznam nemá. Soutok měl kromě sčítání dvou krystalů i Dvě řady a kvíz,
 * které v hračce II-0 nejsou: jeho pečetě ani chyby v kvízu o hračce nic neříkají.
 */
const OWN_WINS: Record<number, ReadonlySet<string>> = { 4: new Set(['II-0']) };

/** Záznamy Kodexu, které zanikly sloučením komnat: přeložený záznam přejde na nový. */
export const KODEX_RENAMED: Record<string, string> = { proudy: 'soutok' };

/**
 * Záznamy Kodexu, které zanikly bez náhrady. Soutok se stal hračkou II-0 (nultá komnata nemá záznam):
 * sčítání bitů ve sloupci nese Zákon sloupce z II-3, sčítání pod sebou nový Zákon dvojice z II-2.
 * Na Zákon dvojice se Soutok nepřejmenuje, aby hráč nedostal přeložený záznam komnaty, kterou nehrál.
 */
export const KODEX_REMOVED: ReadonlySet<string> = new Set(['soutok']);

/** Přejmenuje přeložené záznamy Kodexu po sloučení komnat a vypustí zaniklé (bez duplicit). */
export function migrateKodexIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => KODEX_RENAMED[id] ?? id))].filter((id) => !KODEX_REMOVED.has(id));
}

/**
 * Přejmenuje komnaty uložené v rozvržení `from` na současné číslování.
 * Když se dvě komnaty sloučí do jedné, záznamy spojí merge (bez něj vyhraje ten pozdější),
 * kromě sloučení z OWN_WINS, kde zůstane vlastní záznam cílové komnaty.
 * Postup z novějšího rozvržení, než hra zná, se nemění. Vrací nový objekt, původní nemění.
 */
export function migrateLevelIds<T>(levels: Record<string, T>, from: unknown, merge?: (a: T, b: T) => T): Record<string, T> {
  let out = levels;
  const start = typeof from === 'number' && from >= 1 ? Math.floor(from) : 1;
  for (let layout = start; layout < LAYOUT; layout++) {
    const renamed = STEPS[layout] ?? {};
    const ownWins = OWN_WINS[layout];
    const next: Record<string, T> = {};
    for (const [id, rec] of Object.entries(out)) {
      const to = renamed[id] ?? id;
      // Přesunutý záznam ustoupí vlastnímu záznamu cílové komnaty (na pořadí klíčů nezáleží).
      if (ownWins?.has(to) && to !== id && to in out && !(to in renamed)) continue;
      next[to] = to in next && merge ? merge(next[to], rec) : rec;
    }
    out = next;
  }
  return out === levels ? { ...levels } : out;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Sloučená komnata (záznam pečetí): otevřená, když byla otevřená aspoň jedna část; pečetě jen za obě. */
export function mergeSeals<T>(a: T, b: T): T {
  const sa = isObj(a) && isObj(a.seals) ? a.seals : null;
  const sb = isObj(b) && isObj(b.seals) ? b.seals : null;
  if (!sa || !sb) return b ?? a;
  return { ...a, seals: { solved: true, skill: sa.skill === true && sb.skill === true, pure: sa.pure === true && sb.pure === true } };
}

/** Sloučená komnata (statistiky): počty se sečtou. */
export function mergeCounts<T>(a: T, b: T): T {
  if (!isObj(a) || !isObj(b)) return b ?? a;
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) if (typeof v === 'number' && typeof out[k] === 'number') out[k] = (out[k] as number) + v;
  return out as T;
}
