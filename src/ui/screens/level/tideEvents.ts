import type { TideEvent, TideOp, TideState } from '../../../core/puzzles/tide';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx, type SaidFlags } from './context';

/** Části, ve kterých Echo už řeklo repliku o +1 z jedničky (ctx.said se s každou částí založí znovu). */
const toldIncFromOne = new WeakSet<SaidFlags>();

const LEVER_NAME: Record<TideOp, string> = {
  shl: 'Posun vlevo',
  shr: 'Posun vpravo',
  inc: 'Přidána jedna',
  dec: 'Ubrána jedna',
  not: 'Všechna světla převrácena',
};

/** Příliv: páky posunu, ±1 a převrácení. */
export function onTide(ctx: LevelCtx, ev: TideEvent, state: TideState): void {
  const level = ctx.level();
  if (level.kind !== 'tide') return;
  const cfg = level.config;
  const bits = ctx.bits();
  switch (ev.type) {
    case 'pull': {
      sound.playShift();
      sound.playChord(ev.to, bits, 0.06);
      const lost = ev.spill === 'left' || ev.spill === 'right';
      if (ev.spill) sound.playSpill();
      // Kamenná řada se posune a na okraji se zvíří prach.
      const reg = ctx.stage()?.querySelector('.register .crystals')?.getBoundingClientRect();
      if (reg && (ev.op === 'shl' || ev.op === 'shr' || lost)) {
        const leftEdge = ev.op === 'shl' || ev.spill === 'left';
        ctx.puff({ x: leftEdge ? reg.left + 10 : reg.right - 10, y: reg.bottom - 30 }, lost ? 18 : 8);
      }
      if (lost && !ctx.said.spill && level.echo.spill) {
        ctx.echo.say([level.echo.spill]);
        ctx.said.spill = true;
      }
      // Zdvojení: z jedničky dá +1 totéž co ×2 a zápisník by pak nekopíroval zápis cíle.
      if (ev.op === 'inc' && ev.from === 1 && !state.complete && level.echo.incFromOne && !toldIncFromOne.has(ctx.said)) {
        ctx.echo.say([level.echo.incFromOne]);
        toldIncFromOne.add(ctx.said);
      }
      ctx.announce(`${LEVER_NAME[ev.op]}. Světlo váží ${ev.to}.${lost ? ' Jedno světlo spadlo přes okraj.' : ''}`);
      break;
    }
    case 'reset':
      ctx.failFx('.register');
      sound.playGrind(0.6);
      if (level.echo.reset) ctx.echo.say([level.echo.reset]);
      ctx.announce(`Tahy došly. Světlo se vrátilo na ${ev.to}.`);
      break;
    case 'step': {
      sound.playChord(ev.target, bits, 0.1);
      sound.playGrind(0.8);
      ctx.pulse();
      ctx.stepFx('.register');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      const upcoming = cfg.tasks[state.step];
      ctx.announce(upcoming && !state.complete ? `Správně. Teď z ${state.value} na ${upcoming.target}.` : 'Správně.');
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
