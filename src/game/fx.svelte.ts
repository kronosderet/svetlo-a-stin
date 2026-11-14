/**
 * Síla efektů (1 = plná). Odezva má být zřetelná, ne divadelní: chyba a otevření komnaty
 * jsou ztlumené na třetinu, zarachocení kotoučů při chybném čtení ještě víc.
 */
export const FX = { fail: 0.3, win: 0.3, dialRattle: 0.15 } as const;

/** Sdílený stav efektů: pozadí chrámu reaguje na otevřenou komnatu. */
export const fxState = $state({
  /** Roste s každou otevřenou komnatou (kolo s glyfy se pootočí a rozzáří). */
  wins: 0,
});
