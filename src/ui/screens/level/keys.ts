import type { TideOp } from '../../../core/puzzles/tide';
import type { AltarGame } from '../../../game/altarGame.svelte.ts';
import type { CascadeGame } from '../../../game/cascadeGame.svelte.ts';
import type { InscriptionGame } from '../../../game/inscriptionGame.svelte.ts';
import type { TideGame } from '../../../game/tideGame.svelte.ts';
import * as sound from '../../../audio/sound';

export type AnyGame = AltarGame | InscriptionGame | CascadeGame | TideGame;

const TIDE_KEYS: Record<string, TideOp> = {
  ArrowLeft: 'shl',
  ArrowRight: 'shr',
  '+': 'inc',
  '-': 'dec',
  '−': 'dec',
  n: 'not',
  N: 'not',
};

/** Klávesy hádanky (kotouče, potvrzení, páky). Vrací true, když klávesu zpracovala. */
export function puzzleKey(game: AnyGame, ev: KeyboardEvent): boolean {
  const plain = !ev.ctrlKey && !ev.metaKey && !ev.altKey;
  if (!plain) return false;
  if (game.kind === 'inscription' && game.reading) {
    // Kotouče jdou nastavit i z klávesnice: číslice se přidávají zprava (u glyfů i A–F).
    if (/^[0-9]$/.test(ev.key) || (game.radix === 16 && /^[a-fA-F]$/.test(ev.key))) {
      game.typeDigit(parseInt(ev.key, 16));
      sound.playTick();
      return true;
    }
    if (ev.key === 'Backspace') {
      game.eraseDigit();
      sound.playTick();
      return true;
    }
    // Enter potvrdí kotouče i po kliknutí na šipku; jiná tlačítka (Potvrdit, Nápověda…) stiskne normálně.
    const target = ev.target as HTMLElement | null;
    const otherButton = target instanceof HTMLButtonElement && !target.closest('.dial');
    if (ev.key === 'Enter' && !otherButton) {
      game.confirm();
      return true;
    }
  }
  if (game.kind === 'cascade' && game.playing && ev.key === 'Enter') {
    // Buňku vybranou klávesnicí přepne Enter sám; po kliknutí myší Enter výsledek potvrdí.
    const keyboardFocus = ev.target instanceof HTMLButtonElement && ev.target.matches(':focus-visible');
    if (!keyboardFocus) {
      game.confirm();
      return true;
    }
  }
  if (game.kind === 'tide' && game.playing) {
    const op = TIDE_KEYS[ev.key];
    if (op && game.level.config.ops.includes(op)) {
      game.pull(op);
      return true;
    }
  }
  return false;
}
