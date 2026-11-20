/**
 * Zkouška navíc v bráně patra: když hráč v bráně použije ukázku kroku, brána na konec části
 * přidá jednu podobnou úlohu vylosovanou generátorem komnaty. Ukázka kroku pak není jen
 * autopilot: hned je příležitost zkusit totéž bez ní.
 */

type AnyTask = object;

/**
 * Druh úlohy: směr Nápisu, operace Kaskády nebo Masky, druh stroje v Dílně (všechny mají režim
 * build), režim Brány a Desky. Příliv druh nemá.
 */
function kindOf(task: AnyTask): string {
  const t = task as { dir?: string; op?: string; kind?: string; mode?: string };
  return t.dir ?? t.op ?? t.kind ?? t.mode ?? '';
}

/**
 * Vybere z vylosovaných úloh tu, která se hodí jako zkouška navíc: stejného druhu jako úloha,
 * u které hráč potřeboval ukázku, a (pokud repeat nedovolí opak) jiná než všechny v části.
 * Úloha Přílivu musí mít vlastní začátek, protože na konci části nenavazuje na nic známého.
 */
export function pickExtraTask<T extends AnyTask>(existing: T[], fresh: T[], step: number, repeat = false): T | null {
  const current = existing[step];
  if (!current) return null;
  const seen = new Set(existing.map((t) => JSON.stringify(t)));
  const fits = (t: T | undefined): t is T =>
    !!t &&
    kindOf(t) === kindOf(current) &&
    (repeat || !seen.has(JSON.stringify(t))) &&
    // Příliv (úloha bez druhu) bez vlastního začátku by navazoval na předchozí váhu.
    !(kindOf(t) === '' && !('start' in t));
  // Přednost má úloha na stejném místě: generátory drží pořadí druhů úloh.
  return [fresh[step], ...fresh].find(fits) ?? null;
}

/**
 * Zkouška navíc z generátoru komnaty. Losuje opakovaně, protože brány mají často jen jednu
 * nebo dvě úlohy. Když nic nového nepadne (třeba Prapečeť s jedinou možnou úlohou),
 * zopakuje úlohu stejného druhu, v nejhorším tu, u které hráč ukázku potřeboval.
 */
export function extraTaskFor<T extends AnyTask>(existing: T[], generate: () => T[], step: number, tries = 24): T | null {
  const batches: T[][] = [];
  for (let k = 0; k < tries; k++) {
    const fresh = generate();
    const task = pickExtraTask(existing, fresh, step);
    if (task) return task;
    batches.push(fresh);
  }
  for (const fresh of [...batches, [existing[step]]]) {
    const task = pickExtraTask(existing, fresh, step, true);
    if (task) return task;
  }
  return null;
}
