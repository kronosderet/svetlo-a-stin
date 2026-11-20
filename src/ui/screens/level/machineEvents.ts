import { rowCount } from '../../../core/logic';
import { PARTS, lampKey, settle, type MachineEvent, type MachineState, type MachineTask } from '../../../core/puzzles/machine';
import { RUNE_NAME } from '../../../content/runes';
import { failureWords, fromWords, inputName, lampsWords, seatWords, triedWords } from '../../../game/machineWords';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

function taskOf(ctx: LevelCtx, state: MachineState): MachineTask | null {
  const level = ctx.level();
  if (level.kind !== 'machine') return null;
  return level.config.tasks[Math.min(state.step, level.config.tasks.length - 1)];
}

/** Dílna: zkoumání strojů, cíle s tepem a stavba z run a součástek. */
export function onMachine(ctx: LevelCtx, ev: MachineEvent, state: MachineState): void {
  const level = ctx.level();
  const task = taskOf(ctx, state);
  if (level.kind !== 'machine' || !task) return;
  const m = task.machine;
  const n = m.inputs.length;
  const lamps = () => settle(m, state.runes, state.wires, state.inputs, state.memory).lamps;
  switch (ev.type) {
    case 'input':
      sound.playBit(n - 1 - ev.index, ev.on);
      ctx.announce(`Vstup ${inputName(m, m.inputs[ev.index].id)}: ${ev.on ? 'světlo' : 'stín'}. ${lampsWords(m, lamps())}.`);
      break;
    case 'pulse':
      sound.playBeat();
      ctx.announce(`Tep. ${lampsWords(m, lamps())}.`);
      break;
    case 'tried': {
      sound.playChord(ev.row, n, 0.08);
      ctx.stepFx('.niche.current', '.machine');
      const line = level.echo.found?.[ev.count];
      if (line) ctx.echo.say([line]);
      // Hlášení přepíše to po vstupu, proto musí samo říct, co lampy ukázaly.
      const shown = settle(m, state.runes, state.wires, ev.row, state.memory).lamps;
      ctx.announce(triedWords(m, ev.row, shown, ev.count));
      break;
    }
    case 'goal': {
      sound.playChime();
      ctx.stepFx('.goal.just', '.machine');
      const line = level.echo.found?.[ev.index + 1];
      if (line) ctx.echo.say([line]);
      const next = task.goals?.[ev.index + 1];
      ctx.announce(`Cíl splněn.${next ? ` Další cíl: ${next.say}` : ''}`);
      break;
    }
    case 'rune':
      sound.playSpark(true);
      ctx.announce(`Do kamene vložena runa ${RUNE_NAME[ev.rune]}.`);
      break;
    case 'wire': {
      sound.playTick();
      ctx.announce(`Točitý kámen ${seatWords(m, ev.key)}: světlo teče ${fromWords(m, ev.source)}.`);
      break;
    }
    case 'wrong': {
      ctx.failFx('.trow.failed', '.example', '.machine');
      const f = ev.failure;
      const why = failureWords(task, f);
      ctx.echo.say([ctx.said.wrongCount++ === 0 && level.echo.wrong && !f.empty ? level.echo.wrong : why]);
      ctx.announce(`Brána se nepohnula. ${why}`);
      break;
    }
    case 'step': {
      sound.playChord(rowCount(Math.min(n, 4)) - 1, Math.min(n, 4), 0.1);
      sound.playGrind(0.8);
      ctx.pulse();
      ctx.stepFx('.machine');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      // Další úloha může mít vlastní zadání (task je už ta nová): čtečka ho jinak neuslyší.
      ctx.announce(state.complete ? 'Brána se otevřela.' : `Brána se pohnula. V dílně je další stroj.${task.say ? ` ${task.say}` : ''}`);
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}

/** Popisek součástky pro čtečku. */
export function partWords(kind: keyof typeof PARTS): string {
  return {
    half: 'poloviční sčítačka',
    full: 'úplná sčítačka',
    mux: 'výhybka',
    dec: 'rozdělovač',
    latch: 'ozvěna',
    flip: 'ozvěna s tepem',
  }[kind];
}

export { lampKey };
