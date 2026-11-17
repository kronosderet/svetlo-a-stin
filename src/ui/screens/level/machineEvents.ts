import { rowCount } from '../../../core/logic';
import {
  PARTS,
  inputOn,
  lampKey,
  numberValue,
  settle,
  type Machine,
  type MachineEvent,
  type MachineState,
  type MachineTask,
} from '../../../core/puzzles/machine';
import { RUNE_NAME } from '../../../content/runes';
import { plural } from '../../../game/text';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

const inputName = (m: Machine, id: string): string => m.inputs.find((i) => i.id === id)?.label ?? id;
const lampName = (m: Machine, id: string): string => m.lamps.find((l) => l.id === id)?.label ?? id;

/** Zdroj světla slovy (pro čtečku obrazovky). */
export function sourceWords(m: Machine, src: string): string {
  if (src === '0') return 'stálého stínu';
  if (src === '1') return 'stálého světla';
  if (m.inputs.some((i) => i.id === src)) return `vstupu ${inputName(m, src)}`;
  const [id, out] = src.split('.');
  const k = m.nodes.findIndex((g) => g.id === id);
  const g = m.nodes[k];
  if (g?.part && out) return `výstupu ${out} součástky ${k + 1}`;
  return `kamene ${k + 1}`;
}

/** Co ukazují lampy: u čísel jejich hodnota, jinak lampa po lampě. */
export function lampsWords(m: Machine, lamps: Record<string, number | null>): string {
  const groups = (m.numbers ?? []).filter((g) => g.bits.every((b) => b in lamps));
  const inGroups = new Set(groups.flatMap((g) => g.bits));
  const parts = groups.map((g) => `${g.label} ${numberValue(g, (id) => lamps[id])}`);
  for (const l of m.lamps) if (!inGroups.has(l.id)) parts.push(`lampa ${l.label} ${lamps[l.id] ? 'svítí' : 'mlčí'}`);
  return parts.join(', ');
}

/** Řádek vstupů slovy: čísla hodnotou, ostatní vstupy světlo nebo stín. */
export function rowWords(m: Machine, row: number): string {
  const groups = (m.numbers ?? []).filter((g) => g.bits.every((b) => m.inputs.some((i) => i.id === b)));
  const inGroups = new Set(groups.flatMap((g) => g.bits));
  const parts = groups.map((g) => `${g.label} = ${numberValue(g, (id) => inputOn(m, row, id))}`);
  for (const inp of m.inputs)
    if (!inGroups.has(inp.id)) parts.push(`${inputName(m, inp.id)} ${inputOn(m, row, inp.id) ? 'světlo' : 'stín'}`);
  return parts.join(', ');
}

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
      ctx.announce(`Nová kombinace: ${rowWords(m, ev.row)}. Vyzkoušeno ${ev.count} z ${rowCount(n)}.`);
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
      const owner = ev.key.startsWith('lamp:') ? `Lampa ${lampName(m, ev.key.slice(5))}` : 'Točitý kámen';
      ctx.announce(`${owner}: světlo teče ze ${sourceWords(m, ev.source)}.`);
      break;
    }
    case 'wrong': {
      ctx.failFx('.trow.failed', '.example', '.machine');
      const f = ev.failure;
      let why: string;
      if (f.empty) why = 'Některý kámen je prázdný nebo točitý kámen nenastavený. Tudy světlo neproteče.';
      else if (task.script) {
        const which = f.lamps.map((id) => `lampa ${lampName(m, id)}`).join(' a ');
        const by = m.nodes.some((g) => g.part === 'flip') ? 'vstupy a tepem' : 'vstupy';
        why = `Zkouška se zastavila v ${f.at + 1}. kroku: ${which} nesvítí správně. Projdi ten krok ${by} a sleduj, kudy světlo teče.`;
      } else if (rowCount(n) > 8) {
        why = `Stroj se splete u ${rowWords(m, f.at)}. Nastav ty vstupy a sleduj, kudy světlo teče.`;
      } else {
        const k = f.count;
        why = `Lampy nesvítí správně v ${k} ${plural(k, 'řádku', 'řádcích', 'řádcích')} desky. Přepni vstupy podle nich a sleduj, kudy světlo teče.`;
      }
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
      ctx.announce(state.complete ? 'Brána se otevřela.' : 'Brána se pohnula. V dílně je další stroj.');
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
