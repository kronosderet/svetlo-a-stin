import { rowCount } from '../../../core/logic';
import type { GateEvent, GateState } from '../../../core/puzzles/gate';
import type { TableEvent, TableState } from '../../../core/puzzles/table';
import { tableOf } from '../../../core/puzzles/table';
import { RUNE_NAME } from '../../../content/runes';
import { gateWrongWords, inputWords, rowWords, sourceWords, wrongRuneWords } from '../../../game/stepWords';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

/** Brána: zkoumání run a vkládání run do kamenů. */
export function onGate(ctx: LevelCtx, ev: GateEvent, state: GateState): void {
  const level = ctx.level();
  if (level.kind !== 'gate') return;
  const task = level.config.tasks[Math.min(state.step, level.config.tasks.length - 1)];
  const circuit = task.circuit;
  const n = circuit.inputs.length;
  switch (ev.type) {
    case 'input': {
      sound.playBit(n - 1 - ev.index, ev.on);
      // I s točitými kameny: bez nich by čtečka v Prapečeti hlásila lampu vždy zhasnutou.
      ctx.announce(inputWords(circuit, state.runes, state.wires, state.inputs, ev.index));
      break;
    }
    case 'tried': {
      sound.playChord(ev.row, n, 0.08);
      ctx.stepFx('.niche.current', '.circuit');
      const line = level.echo.found?.[ev.count];
      if (line) ctx.echo.say([line]);
      ctx.announce(`Nová kombinace: ${rowWords(circuit.inputs, ev.row)}, lampa ${ev.lamp ? 'svítí' : 'mlčí'}. Vyzkoušeno ${ev.count} z ${rowCount(n)}.`);
      break;
    }
    case 'rune':
      sound.playSpark(true);
      ctx.announce(`Do kamene vložena runa ${RUNE_NAME[ev.rune]}.`);
      break;
    case 'wire': {
      sound.playTick();
      ctx.announce(`Točitý kámen natočen: světlo teče ${sourceWords(circuit, ev.source)}.`);
      break;
    }
    case 'wrong': {
      ctx.failFx('.trow.failed', '.circuit');
      const why = gateWrongWords(ev.failed.length, ev.empty, ev.unwired);
      ctx.echo.say([ctx.said.wrongCount++ === 0 && level.echo.wrong && !ev.empty && !ev.unwired ? level.echo.wrong : why]);
      ctx.announce(`Brána se nepohnula. ${why}`);
      break;
    }
    case 'step': {
      sound.playChord(rowCount(n) - 1, n, 0.1);
      sound.playGrind(0.8);
      ctx.pulse();
      ctx.stepFx('.circuit');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      ctx.announce(state.complete ? 'Brána se otevřela.' : 'Brána se pohnula. Na desce je další obvod.');
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}

/** Deska zákona: vyplnění tabulky a poznání runy pod závojem. */
export function onTable(ctx: LevelCtx, ev: TableEvent, state: TableState): void {
  const level = ctx.level();
  if (level.kind !== 'table') return;
  const task = level.config.tasks[Math.min(state.step, level.config.tasks.length - 1)];
  const names = task.circuit.inputs;
  switch (ev.type) {
    case 'cell':
      sound.playBit(ev.row % 4, ev.on);
      ctx.announce(`${rowWords(names, ev.row)}: lampa ${ev.on ? 'svítí' : 'mlčí'}.`);
      break;
    case 'wrong': {
      ctx.failFx('.drow.wrong', '.desk');
      const why = `Řádek ${rowWords(names, ev.row)} nesedí. Pusť v duchu světlo obvodem krok za krokem: co dorazí k lampě?`;
      ctx.echo.say([ctx.said.wrongCount++ === 0 && level.echo.wrong ? level.echo.wrong : why]);
      ctx.announce(`Deska nepřijata. ${why}`);
      break;
    }
    case 'pick': {
      if (ev.correct) {
        sound.playChime();
        ctx.announce(`Ano, pod závojem je ${RUNE_NAME[ev.rune]}.`);
        break;
      }
      ctx.failFx('.choice.wrong', '.desk');
      // Proč ne: první řádek, ve kterém by lampa se zvolenou runou svítila jinak než na desce.
      const why = wrongRuneWords(ev.rune, names, tableOf(task));
      ctx.echo.say([why]);
      ctx.announce(why);
      break;
    }
    case 'step': {
      sound.playGrind(0.7);
      ctx.pulse();
      ctx.stepFx('.desk');
      const line = level.echo.step?.[ev.index];
      if (line) ctx.echo.say([line]);
      ctx.announce(state.complete ? 'Deska přijata.' : 'Deska přijata. Je tu další.');
      break;
    }
    case 'complete':
      sayComplete(ctx);
      break;
  }
}
