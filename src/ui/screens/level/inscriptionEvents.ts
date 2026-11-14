import { maxValue, toHex } from '../../../core/bits';
import type { InscriptionEvent, InscriptionState } from '../../../core/puzzles/inscription';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

/** Repliky po dalších chybných čteních (první říká level.echo.wrong). */
const WRONG_AGAIN = ['Ještě ne. Který krystal nesedí?', 'Porovnej obě kombinace krystal po krystalu.'];

/** Hodnota tak, jak ji ukazují kotouče: číslo, nebo u Řeči glyfů šestnáctkově. */
export function dialText(ctx: LevelCtx, v: number): string {
  const level = ctx.level();
  return level.kind === 'inscription' && level.config.radix === 16 ? `${toHex(v, Math.ceil(ctx.bits() / 4))} šestnáctkově` : String(v);
}

/** Nápis: čtení na kotoučích a zápis krystaly. */
export function onInscription(ctx: LevelCtx, ev: InscriptionEvent, state: InscriptionState): void {
  const level = ctx.level();
  if (level.kind !== 'inscription') return;
  const cfg = level.config;
  const bits = ctx.bits();
  switch (ev.type) {
    case 'toggle':
      sound.playBit(ev.bit, ev.on);
      ctx.announce(`Krystal ${bits - ev.bit} zleva ${ev.on ? 'rozsvícen' : 'zhasnut'}.`);
      break;
    case 'wrong': {
      ctx.failFx('.dial', '.wall');
      const n = ++ctx.said.wrongCount;
      if (ev.guess > maxValue(bits)) ctx.echo.say([`Tolik se do ${bits} krystalů nevejde. Nejvíc je ${maxValue(bits)}.`]);
      else if (n === 1 && level.echo.wrong) ctx.echo.say([level.echo.wrong]);
      else ctx.echo.say([WRONG_AGAIN[n % WRONG_AGAIN.length]]);
      ctx.announce(`Kotouče ukazují ${dialText(ctx, ev.guess)}. Nápis váží jinak.`);
      break;
    }
    case 'step': {
      sound.playChord(ev.task.value, bits, 0.1);
      sound.playGrind(ev.task.dir === 'read' ? 0.6 : 0.9);
      ctx.pulse();
      ctx.stepFx('.wall');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      const upcoming = cfg.tasks[state.step];
      if (!upcoming) ctx.announce('Správně.');
      else if (upcoming.dir === 'read') ctx.announce(`Správně. Další nápis: ${ctx.words(upcoming.value)}.`);
      else ctx.announce(`Správně. Brána žádá ${dialText(ctx, upcoming.value)}.`);
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
