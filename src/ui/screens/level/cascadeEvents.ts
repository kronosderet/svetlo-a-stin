import { shownTask, type CascadeEvent, type CascadeState } from '../../../core/puzzles/cascade';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';
import { cascadeRefusal, cascadeWhy } from '../../../game/cascadeWords';

/** Kaskáda: počítání pod sebou. */
export function onCascade(ctx: LevelCtx, ev: CascadeEvent, state: CascadeState): void {
  const level = ctx.level();
  if (level.kind !== 'cascade') return;
  const cfg = level.config;
  switch (ev.type) {
    case 'toggle': {
      const { row, column } = ev.cell;
      if (row === 'result') sound.playBit(column, ev.on);
      else sound.playSpark(ev.on);
      let what: string;
      if (row === 'result') what = `Krystal výsledku ${column + 1} zprava`;
      else if (row === 'copy') what = `Kopie krát ${2 ** column}`;
      else if (row === 'far') what = `Krystal přenosu o dvě místa nad sloupcem ${column + 1} zprava`;
      else if (column === cfg.width) what = 'Přepad';
      else if (cfg.tasks[state.step]?.op === 'sub') what = `Krystal výpůjčky ve sloupci ${column + 1} zprava`;
      else what = `Krystal přenosu nad sloupcem ${column + 1} zprava`;
      const n = ev.dropped?.length ?? 0;
      // Zachování světla: se zhasnutým zdrojem zhasnou i krystaly, do kterých z něj teklo světlo.
      const lost = n === 0 ? '' : n === 1 ? ' Zhasl i krystal, do kterého odtud teklo světlo.' : ' Zhasly i krystaly, do kterých odtud teklo světlo.';
      ctx.announce(`${what}: ${ev.on ? 'světlo' : 'stín'}.${lost}`);
      break;
    }
    case 'refuse': {
      sound.playSoft();
      const why = cascadeRefusal(cfg, shownTask(cfg, state), state, ev.cell);
      ctx.echo.say([why]);
      ctx.announce(`Krystal se nerozsvítil. ${why}`);
      break;
    }
    case 'wrong': {
      ctx.failFx('.strip.wrong', '.chute.wrong', '.board');
      ctx.wobble();
      const why = cascadeWhy(cfg, state, ev);
      ctx.echo.say([why]);
      ctx.announce(`Výsledek nepřijat. ${why}`);
      break;
    }
    case 'step': {
      sound.playCascade(cfg.width);
      sound.playGrind(0.7);
      ctx.pulse();
      ctx.stepFx('.board');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      ctx.announce(state.complete ? 'Správně.' : 'Správně. Ve stěně je další úloha.');
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
