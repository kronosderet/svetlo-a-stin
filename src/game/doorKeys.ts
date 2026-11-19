/** Fáze kamenných dveří mezi komnatami (stav drží doors.svelte.ts). */
export type DoorPhase = 'idle' | 'closing' | 'opening';

/**
 * Má klávesa projít do hry? Zavírající se a zavřené dveře nepustí žádnou: pod nimi je ještě stará deska
 * (Escape, Mapa) a za nimi už nová komnata, kterou hráč nevidí. Při otevírání neprojde jen podržená
 * klávesa (autorepeat Enteru z vítězné desky by jinak potvrdil hádanku nové komnaty).
 */
export function doorsPassKey(phase: DoorPhase, repeat: boolean): boolean {
  if (phase === 'closing') return false;
  if (phase === 'opening') return !repeat;
  return true;
}
