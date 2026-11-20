import { maxValue, toHex } from '../../../core/bits';
import { dialWheels, readSlip, type InscriptionEvent, type InscriptionState } from '../../../core/puzzles/inscription';
import { demandLabel, readSlipLine, writeSlipLine } from '../../../game/inscriptionWords';
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
      const slip = readSlip(cfg, ev.guess, ev.target);
      if (ev.guess > maxValue(bits)) ctx.echo.say([`Tolik se do ${bits} krystalů nevejde. Nejvíc je ${maxValue(bits)}.`]);
      else if (slip) ctx.echo.say([readSlipLine(cfg, slip, ev.guess, ev.target)]);
      else if (n === 1 && level.echo.wrong) ctx.echo.say([level.echo.wrong]);
      else ctx.echo.say([WRONG_AGAIN[n % WRONG_AGAIN.length]]);
      const one = dialWheels(cfg.bits, cfg.radix ?? 10) === 1;
      ctx.announce(`${one ? 'Kotouč ukazuje' : 'Kotouče ukazují'} ${dialText(ctx, ev.guess)}. Nápis váží jinak.`);
      break;
    }
    case 'slip': {
      // Zápis: zbytečné doteky jen rozzáří Nápovědu (počítá je obrazovka komnaty), typickou
      // chybu, na které se hráč zastavil, Echo pojmenuje.
      if (!ev.slip) break;
      const line = writeSlipLine(cfg, ev.slip, ev.mask, ev.target);
      sound.playSoft();
      ctx.echo.say([line]);
      ctx.announce(line);
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
      else ctx.announce(`Správně. ${demandLabel(level.id)} ${dialText(ctx, upcoming.value)}.`);
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
