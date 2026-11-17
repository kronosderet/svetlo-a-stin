import { toBinaryString } from '../../../core/bits';
import type { MaskEvent, MaskState } from '../../../core/puzzles/mask';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

/** Maska: bitové operace s oktávou a šifra. */
export function onMask(ctx: LevelCtx, ev: MaskEvent, state: MaskState): void {
  const level = ctx.level();
  if (level.kind !== 'mask') return;
  const cfg = level.config;
  switch (ev.type) {
    case 'toggle':
      sound.playBit(ev.bit, ev.on);
      ctx.announce(`Krystal masky ${cfg.bits - ev.bit} zleva: ${ev.on ? 'světlo' : 'stín'}. Výsledek ${toBinaryString(ev.result, cfg.bits)}.`);
      break;
    case 'step': {
      sound.playChord(ev.result, cfg.bits, 0.1);
      sound.playGrind(0.8);
      ctx.pulse();
      ctx.stepFx('.mask-rows');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      const solvedTask = cfg.tasks[ev.index];
      const letter = solvedTask.key !== undefined && !solvedTask.encrypt && ev.result >= 32 && ev.result < 127 ? String.fromCharCode(ev.result) : null;
      ctx.announce(
        letter
          ? `Klíč sedí. Rozšifrované písmeno: ${letter}.`
          : solvedTask.encrypt
            ? 'Písmeno je zašifrované. Klíč zůstává v masce.'
            : state.complete
              ? 'Výsledek sedí.'
              : 'Výsledek sedí. Ve stěně je další nápis.',
      );
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
