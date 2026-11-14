import type { CascadeEvent, CascadeState } from '../../../core/puzzles/cascade';
import * as sound from '../../../audio/sound';
import { sayComplete, type LevelCtx } from './context';

/** Sloupce Kaskády: v … sloupci, nad … sloupcem, do … sloupce. */
const LOC = ['prvním', 'druhém', 'třetím', 'čtvrtém', 'pátém', 'šestém', 'sedmém', 'osmém'];
const INS = ['prvním', 'druhým', 'třetím', 'čtvrtým', 'pátým', 'šestým', 'sedmým', 'osmým'];
const GEN = ['prvního', 'druhého', 'třetího', 'čtvrtého', 'pátého', 'šestého', 'sedmého', 'osmého'];
const FLOW = ['žádné světlo', 'jedno světlo', 'dvě světla', 'tři světla', 'čtyři světla', 'pět světel'];
const places = (n: number) => (n === 1 ? 'místo' : n >= 2 && n <= 4 ? 'místa' : 'míst');

type Wrong = Extract<CascadeEvent, { type: 'wrong' }>;

/** Proč Kaskáda výsledek nepřijala: vysvětlí první buňku zprava, která nesedí. */
export function cascadeWhy(ctx: LevelCtx, ev: Wrong, state: CascadeState): string {
  const level = ctx.level();
  if (level.kind !== 'cascade') return '';
  const cfg = level.config;
  const task = cfg.tasks[state.step];
  const sub = task.op === 'sub';
  const c = ev.cell.column;
  if (ev.cell.row === 'copy') {
    return ev.expected
      ? `Druhý činitel má na místě s váhou ${2 ** c} jedničku. Kopie posunutá o ${c} ${places(c)} do součtu patří.`
      : `Druhý činitel má na místě s váhou ${2 ** c} nulu. Kopie posunutá o ${c} ${places(c)} se nesčítá.`;
  }
  if (ev.cell.row === 'far') {
    return ev.expected
      ? `O dvě místa vpravo se slila ${FLOW[ev.inflow]}, to je ${ev.inflow.toString(2)}. Jedno světlo putuje o dvě místa: rozsviť horní krystal nad ${INS[c]} sloupcem zprava.`
      : `Do ${GEN[c]} sloupce zprava nic o dvě místa nepřiteklo. Sloupec o dvě místa vpravo neměl čtyři světla.`;
  }
  if (ev.cell.row === 'carry' && !ev.expected && ev.inflow >= 4) {
    return `Ve sloupci vpravo se slila ${FLOW[ev.inflow]}, to je ${ev.inflow.toString(2)}. Do sousedního sloupce nepřetéká nic, světlo jde o dvě místa dál.`;
  }
  if (ev.cell.row === 'carry') {
    if (c === cfg.width) {
      return ev.expected ? 'Nejlevější sloupec přetekl. To světlo patří do přepadu.' : 'Nic nepřeteklo. Přepad má zůstat suchý.';
    }
    if (sub) {
      return ev.expected
        ? `Ve sloupci vpravo nebylo z čeho brát. Výpůjčku zapiš krystalem pod spodní řadu v ${LOC[c]} sloupci zprava.`
        : `Sloupec vpravo si nepůjčoval. V ${LOC[c]} sloupci zprava výpůjčka být nemá.`;
    }
    return ev.expected
      ? `Ve sloupci vpravo se slila ${FLOW[ev.inflow]} a jedno přeteklo. Nad ${INS[c]} sloupcem zprava chybí krystal přenosu.`
      : `Nad ${INS[c]} sloupcem zprava svítí krystal přenosu, ale sloupec vpravo nepřetekl.`;
  }
  if (sub) {
    if (ev.inflow < 0) {
      return `V ${LOC[c]} sloupci zprava nemáš z čeho brát. Půjčené světlo tu váží dvě: ${ev.inflow === -1 ? '10 − 1 = 1' : '10 − 1 − 1 = 0'}.`;
    }
    return `V ${LOC[c]} sloupci zprava ${ev.inflow === 1 ? 'zbude jedno světlo' : 'nezbude nic'}.`;
  }
  const bitsInWall = cfg.bits ?? cfg.width;
  if (cfg.carries === 'none' && c >= bitsInWall) {
    return `Do ${GEN[c]} sloupce zprava přeteklo světlo ze sousedního sloupce. Rozsviť ho tam.`;
  }
  if (ev.inflow >= 2) {
    return `V ${LOC[c]} sloupci zprava se slévají ${FLOW[ev.inflow]}. Do jednoho krystalu se nevejdou: co zůstane dole a co přeteče?`;
  }
  return ev.inflow === 1
    ? `V ${LOC[c]} sloupci zprava je jedno světlo. Nikam nepřetéká, zůstane dole.`
    : `V ${LOC[c]} sloupci zprava není žádné světlo. Krystal dole má zůstat zhasnutý.`;
}

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
      ctx.announce(`${what}: ${ev.on ? 'světlo' : 'stín'}.`);
      break;
    }
    case 'wrong': {
      ctx.failFx('.strip.wrong', '.chute.wrong', '.board');
      ctx.wobble();
      const why = cascadeWhy(ctx, ev, state);
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
