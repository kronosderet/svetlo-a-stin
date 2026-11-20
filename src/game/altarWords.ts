/**
 * Oltář slovy: ukázka kroku při hledání všech kombinací (Kolik kombinací?, Tichý krok).
 * Čisté funkce nad stavem oltáře, ať jdou vyzkoušet bez prohlížeče.
 */
import { flipBit } from '../core/bits';
import { strictDeadEnd, type AltarConfig, type AltarState } from '../core/puzzles/altar';

/**
 * Proč právě zvýrazněný krystal. Ze slepé uličky tichého kroku řekne, že cesta dál nevede,
 * místo aby slibovala pokračování. Bez přísného režimu přizná, když zvýrazněný krystal vede
 * přes kombinaci, kterou deska už zná.
 */
export function allStep(cfg: AltarConfig, st: AltarState, bit: number): string {
  if (cfg.strict) {
    return strictDeadEnd(cfg, st)
      ? 'Odtud už cesta bez opakování nevede. Zvýrazněný krystal ji přeruší. Pak začni znovu, třeba zrcadlem.'
      : 'Zvýrazněný krystal vede na kombinaci, kterou deska ještě nezná, a odtud jde cesta dál bez opakování.';
  }
  return st.found.includes(flipBit(st.mask, bit))
    ? 'Všichni sousedé už na desce jsou. Zvýrazněný krystal vede přes známou kombinaci k té, která chybí.'
    : 'Zvýrazněný krystal vede na kombinaci, kterou deska ještě nezná.';
}
