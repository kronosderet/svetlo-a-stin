import type { AltarEvent, AltarState } from '../../../core/puzzles/altar';
import type { Echo } from '../../../game/echo.svelte.ts';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

/**
 * Echo, které právě ukázalo dopočet váhy. Události jednoho doteku jdou za sebou (toggle, reveal,
 * step): replika kroku se pak za dopočet přidá, ať ho nepřepíše (I-4, první cíl).
 */
let deducedBy: Echo | null = null;

/** Oltář a Počítadlo: zvuky, repliky a hlášení pro čtečku. */
export function onAltar(ctx: LevelCtx, ev: AltarEvent, state: AltarState): void {
  const level = ctx.level();
  if (level.kind !== 'altar') return;
  const cfg = level.config;
  const bits = ctx.bits();
  const counter = !!level.presentation.counter;
  switch (ev.type) {
    case 'toggle': {
      deducedBy = null;
      sound.playBit(ev.bit, ev.on);
      let msg = `Krystal ${bits - ev.bit} zleva ${ev.on ? 'rozsvícen' : 'zhasnut'}.`;
      if (level.presentation.showSum) msg += ` Světlo váží ${state.mask}.`;
      ctx.announce(msg);
      break;
    }
    case 'reveal':
      sound.playReveal();
      if (ev.source === 'deduce') {
        // Váha dopočtená ze součtu: Echo ukáže, jak se uvažuje (odměna za dedukci).
        const w = 2 ** ev.bit;
        const known = ev.known ?? 0;
        ctx.echo.say([`${known + w} − ${known} = ${w}. Kámen váhu dopočítal ze součtu.${ev.allRevealed && level.echo.allRevealed ? ` ${level.echo.allRevealed}` : ''}`]);
        ctx.said.firstReveal = true;
        deducedBy = ctx.echo;
      } else if (ev.allRevealed && level.echo.allRevealed) ctx.echo.say([level.echo.allRevealed]);
      else if (!ctx.said.firstReveal && level.echo.firstReveal) {
        ctx.echo.say([level.echo.firstReveal]);
        ctx.said.firstReveal = true;
      }
      break;
    case 'found': {
      sound.playChord(ev.pattern, bits, 0.08);
      ctx.stepFx('.niche.current', '.row');
      const line = level.echo.found?.[ev.count];
      if (line) ctx.echo.say([line]);
      ctx.announce(`Nová kombinace. Nalezeno ${ev.count} z ${2 ** bits}.`);
      break;
    }
    case 'repeat':
      if (cfg.strict) return;
      sound.playSoft();
      ctx.puff(ctx.centerOf('.niche.current', '.row'), 10);
      if (!ctx.said.repeat && level.echo.repeat) {
        ctx.echo.say([level.echo.repeat]);
        ctx.said.repeat = true;
      }
      break;
    case 'reset':
      // Tichý krok se přerušil: deska se vymaže a krystaly zhasnou.
      ctx.failFx('.registry', '.row');
      if (level.echo.reset) ctx.echo.say([level.echo.reset]);
      ctx.announce('Tahle kombinace už na desce byla. Tichý krok se přerušil, deska je prázdná a krystaly jsou zpátky na začátku.');
      break;
    case 'step': {
      sound.playChord(ev.target, bits, 0.1);
      if (counter) sound.playCarve();
      else if (cfg.goal.kind === 'value') sound.playGrind();
      ctx.pulse();
      ctx.stepFx('.row');
      const line = level.echo.step?.[ev.index];
      if (line && deducedBy === ctx.echo) ctx.echo.add([line]);
      else if (line) ctx.echo.say([line]);
      if (cfg.goal.kind === 'class') {
        const nextGroup = cfg.goal.targets[state.step];
        ctx.announce(nextGroup ? `Přijato: ${ev.target}. Oltář žádá ${nextGroup.say.toLowerCase()}` : `Přijato: ${ev.target}.`);
        break;
      }
      const targets = cfg.goal.kind === 'all' ? [] : cfg.goal.targets;
      const upcoming = targets[state.step];
      if (upcoming === undefined) ctx.announce('Přijato.');
      else if (counter) ctx.announce(`Přijato. Poutníků: ${ev.target}. Přichází další.`);
      else ctx.announce(`Přijato. Oltář žádá ${upcoming}.`);
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
