/**
 * Oltář slovy: ukázka kroku při hledání všech kombinací (Kolik kombinací?, Tichý krok), repliky
 * k nalezeným kombinacím a součet pod krystaly.
 * Čisté funkce nad stavem oltáře, ať jdou vyzkoušet bez prohlížeče.
 */
import { combinations, flipBit } from '../core/bits';
import { strictDeadEnd, type AltarConfig, type AltarState } from '../core/puzzles/altar';
import { aidOn, type Presentation } from '../content/types';

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

/**
 * Replika po přerušeném tichém kroku (line = replika komnaty). Že Zpět vrátí cestu před
 * přerušením, dodá jen tehdy, když ta cesta nebyla slepá ulička: odtud ji ukázka kroku sama
 * radí přerušit a Zpět ji tam nevrací.
 */
export function resetLine(line: string | undefined, deadEnd: boolean): string | null {
  if (!line) return null;
  return deadEnd ? line : `${line} Zpět vrátí cestu před přerušením.`;
}

/**
 * Replika k nalezené kombinaci (line = replika komnaty pro tento počet). V polovině tichého kroku
 * přidá „Teď přijde zrcadlo.“, jen když celá první polovina měla levý krystal ve stínu, tedy cesta
 * jde opravdu podle nápovědy Zrcadlo. Jinak by věta na cestě hráče nedávala smysl.
 */
export function foundLine(cfg: AltarConfig, found: number[], line?: string): string | null {
  const left = 1 << (cfg.bits - 1);
  const mirror = !!cfg.strict && found.length === combinations(cfg.bits) / 2 && found.every((p) => (p & left) === 0);
  if (!mirror) return line ?? null;
  return line ? `${line} Teď přijde zrcadlo.` : 'Teď přijde zrcadlo.';
}

/** Svítí pod krystaly součet? Natrvalo (showSum), nebo jen v prvních cílech komnaty (fade.sum, Skryté váhy). */
export function sumShown(pres: Presentation, step: number): boolean {
  return pres.showSum || aidOn(pres, 'sum', step);
}
