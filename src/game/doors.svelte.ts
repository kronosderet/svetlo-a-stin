/**
 * Kamenné dveře mezi komnatami. Po vítězné desce s pečetěmi se dveře zavřou, za nimi se načte další
 * komnata (nebo schody) a dveře se do ní otevřou. Vrstva s dveřmi žije nad celou hrou (DoorTransition),
 * takže přežije výměnu obrazovky.
 */
import * as sound from '../audio/sound';
import { go, nav, type Screen } from './nav.svelte.ts';
import { settings } from './settings.svelte.ts';
import type { DoorPhase } from './doorKeys';

export { doorsPassKey, type DoorPhase } from './doorKeys';

/**
 * closing = dveře se zavírají a chvíli drží zavřené (obrazovka se za nimi vymění), opening = otevírají se
 * do nové obrazovky. run: pořadí průchodu; animace i časovače patří vždy jen poslednímu průchodu.
 */
export const doors: { phase: DoorPhase; run: number } = $state({ phase: 'idle', run: 0 });

/** Délky fází v ms (musí sedět s animacemi v DoorTransition.svelte). */
export const DOOR_CLOSE_MS = 480;
export const DOOR_HOLD_MS = 160;
export const DOOR_OPEN_MS = 1300;

/**
 * Projde dveřmi na jinou obrazovku: zavřít, za zavřenými dveřmi přepnout, otevřít.
 * Se zklidněným pohybem jen zazní dveře a obrazovka se přepne hned.
 * Během zavírání se další požadavek ignoruje (dvojklik, Enter na tlačítku). Během otevírání už je nová
 * obrazovka vidět a klikatelná, takže požadavek z ní platí: dveře se znovu zavřou do další obrazovky.
 */
export function enterThroughDoors(screen: Screen): void {
  if (doors.phase === 'closing') return;
  const run = ++doors.run;
  if (settings.reducedMotion) {
    doors.phase = 'idle';
    sound.playDoor();
    go(screen);
    return;
  }
  const from = nav.screen;
  doors.phase = 'closing';
  sound.playGrind(0.45);
  setTimeout(() => {
    if (doors.run !== run) return;
    // Obrazovku mezitím přepnulo něco jiného: dveře se otevřou do ní, nic se nepřepisuje.
    if (nav.screen === from) go(screen);
    setTimeout(() => {
      if (doors.run !== run) return;
      doors.phase = 'opening';
      sound.playDoor();
      setTimeout(() => {
        if (doors.run === run) doors.phase = 'idle';
      }, DOOR_OPEN_MS);
    }, DOOR_HOLD_MS);
  }, DOOR_CLOSE_MS);
}
