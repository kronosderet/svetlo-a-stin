/**
 * Verze 0.4.4, A0 (PLAN-OPRAV.md): hra jen podle ukázky kroku. Každá komnata (každá část smíšené
 * brány) se odehraje skutečnou hrou (src/game/*.svelte.ts): hráč stiskne Nápovědu, dokud neukáže
 * krok, a dotkne se jen zvýrazněného prvku. Text ukázky musí sedět se zvýrazněným prvkem, každý
 * stisk dá jen jeden krok (R2) a komnata musí skončit vyřešená. Hraje se od startu i z typického
 * chybného stavu (na začátku každé úlohy tah nebo dva mimo ukázku), losované komnaty přes víc
 * semínek. Hlídají se i podmínky z textů: Tichý krok jde zrcadlovým Grayovým kódem, ukázka u glyfů
 * nezmíní váhu nad 8, cesta ve Vahách Osudu se vejde do limitu. Kde ukázka kroku vlastní větu
 * nemá, zazní třetí nápověda, a jinde třetí nápověda není (A8).
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { flipBit, gray, isBitSet } from '../core/bits';
import { currentTarget as altarTarget, hintBit as altarHint, strictDeadEnd } from '../core/puzzles/altar';
import { answer, type CascadeCell } from '../core/puzzles/cascade';
import { slotNodes, sockets, solutions } from '../core/puzzles/gate';
import { mirrored, type InscriptionConfig } from '../core/puzzles/inscription';
import {
  hasPulse,
  hint as machineHint,
  nearestSolution as machineNearest,
  slotNodes as machineSlots,
  sockets as machineSockets,
  solutions as machineSolutions,
} from '../core/puzzles/machine';
import { hintBit as maskHint } from '../core/puzzles/mask';
import { tableOf } from '../core/puzzles/table';
import { applyOp, bestOp, distance, initTide, pathFits, taskStart, type TideOp } from '../core/puzzles/tide';
import { AltarGame } from '../game/altarGame.svelte.ts';
import type { GameEvent } from '../game/baseGame.svelte.ts';
import { CascadeGame } from '../game/cascadeGame.svelte.ts';
import { GateGame } from '../game/gateGame.svelte.ts';
import { InscriptionGame } from '../game/inscriptionGame.svelte.ts';
import { MachineGame } from '../game/machineGame.svelte.ts';
import { fromWhyWords, fromWords } from '../game/machineWords';
import { resetLine } from '../game/altarWords';
import levelSource from '../ui/screens/Level.svelte?raw';
import workshopSource from '../ui/machine/Workshop.svelte?raw';
import { MaskGame } from '../game/maskGame.svelte.ts';
import { rowWords, sourceWords, tideStep } from '../game/stepWords';
import { TableGame } from '../game/tableGame.svelte.ts';
import { TideGame } from '../game/tideGame.svelte.ts';
import { ACTS, instantiate, partsOf } from './levels';
import { seeded, type Rng } from './random';
import { RUNE_NAME } from './runes';
import type { LevelDef, PuzzleLevel } from './types';

/** Kolik vylosovaných variant odehraje každá komnata s losováním (navíc k ručně vybrané podobě). */
const SEEDS = 25;
/** Pauza po splněné úloze (BaseGame.hold) je nejvýš 1,1 s. */
const HOLD_MS = 1500;

type Game = AltarGame | InscriptionGame | CascadeGame | TideGame | GateGame | TableGame | MaskGame | MachineGame;

function createGame(level: PuzzleLevel, emit: (e: GameEvent) => void): Game {
  switch (level.kind) {
    case 'altar':
      return new AltarGame(level, emit);
    case 'inscription':
      return new InscriptionGame(level, emit);
    case 'cascade':
      return new CascadeGame(level, emit);
    case 'tide':
      return new TideGame(level, emit);
    case 'gate':
      return new GateGame(level, emit);
    case 'table':
      return new TableGame(level, emit);
    case 'mask':
      return new MaskGame(level, emit);
    case 'machine':
      return new MachineGame(level, emit);
  }
}

/** Rodově zatížené oslovení, „klikni“ a zájmeno bez předmětu v pokynu. */
const FORBIDDEN = /\b(prošel|zvládl|sám|udělal|Klikni|klikni|kliknout)\b|(rozsviť|zhasni) ho(?!\p{L})/u;
/** Páky slovy, jak je jmenuje tideStep. */
const LEVER: Record<TideOp, string> = { shl: 'posun vlevo', shr: 'posun vpravo', inc: 'přidej jednu', dec: 'uber jednu', not: 'převrať' };
/** Řadové číslovky sloupců Kaskády (zprava): „v prvním“, „nad druhým“, „do třetího“… */
const ORDINAL = /(?<!\p{L})(prvn|druh|třet|čtvrt|pát|šest|sedm|osm)/giu;
const ORDINAL_STEMS = ['prvn', 'druh', 'třet', 'čtvrt', 'pát', 'šest', 'sedm', 'osm'];

/** Nápovědy, které hra právě používá: vlastní nápovědy úlohy (Brána, Dílna), jinak nápovědy komnaty. */
const hintsInUse = (g: Game): readonly (string | undefined)[] => ('taskHints' in g && g.taskHints) || g.level.hints;

/** Poslední pokyn „zvýrazněný krystal rozsviť / zhasni“ v textu ukázky. */
function verbOf(text: string): 'rozsviť' | 'zhasni' | null {
  const all = [...text.matchAll(/[Zz]výrazněný krystal(?: masky)? (rozsviť|zhasni)(?!\p{L})/gu)];
  return (all.at(-1)?.[1] as 'rozsviť' | 'zhasni' | undefined) ?? null;
}

/** Řetěz vah „3 → 6 → 12“ z ukázky v Přílivu; dlouhý zkrácený řetěz („3 → 4 → 5 → … → 0“) po úsecích. */
function chainOf(text: string): number[][] {
  const m = text.match(/(\d+(?: → (?:\d+|…))+)/);
  return m ? m[1].split(' → … → ').map((part) => part.split(' → ').map(Number)) : [];
}

/** Hodnota, kterou hráč z ukázky při čtení spočítá: sečte váhy, které text vyjmenuje. */
function readFromText(cfg: InscriptionConfig, text: string): number {
  const sum = (s: string) => (s.match(/\d+/g) ?? []).reduce((a, n) => a + Number(n), 0);
  if (cfg.radix !== 16) return sum(text.slice(text.indexOf(':') + 1));
  if (cfg.bits === 8) {
    const [left, right] = text.split(', vpravo ');
    return sum(left.slice(left.indexOf('Vlevo'))) * 16 + sum(right.split('. ')[0]);
  }
  const lit = text.split(', na glyfu')[0];
  return /všechny čtyři/.test(lit) ? 15 : sum(lit);
}

/** Ukázka u glyfů: váhy uvnitř čtveřice nejvýš 8, hodnota glyfu nejvýš 15, nikdy desítková hodnota dvojznaku. */
function checkGlyphText(text: string, value: number, read: boolean, where: string) {
  const numbers = (re: RegExp) => [...text.matchAll(re)].flatMap((m) => m.slice(1).join(' ').match(/\d+/g) ?? []).map(Number);
  if (read) {
    for (const n of text.match(/\d+/g) ?? []) expect(Number(n), `${where}: ${text}`).toBeLessThanOrEqual(8);
    return;
  }
  for (const n of numbers(/(?:[Vv]áha|váhou|vahami) (\d+)/g)) expect(n, `${where}: ${text}`).toBeLessThanOrEqual(8);
  for (const n of numbers(/((?:\d+ \+ )+\d+)/g)) expect(n, `${where}: ${text}`).toBeLessThanOrEqual(8);
  for (const n of numbers(/(?:je (\d+) =|\((\d+)\))/g)) expect(n, `${where}: ${text}`).toBeLessThanOrEqual(15);
  if (value > 15) expect(text, where).not.toMatch(new RegExp(`\\b${value}\\b`));
}

/** Co se při hře podle ukázky zaznamená (pro podmínky z textů a pro třetí nápovědy). */
interface Log {
  /** Nápovědy (JSON), které byly ve hře, když ukázka kroku ukazovala krok. */
  used: Set<string>;
  /** Z nich ty, u kterých ukázka kroku zůstala bez vlastní věty (stepHint null). */
  bare: Set<string>;
  /** Oltář: kombinace krystalů po každém doteku. */
  masks: number[];
  /** Texty ukázky kroku. */
  texts: string[];
  /** Váhy Osudu: kolikrát ukázka řekla, že se misky vrátí. */
  returns: number;
  /** Glyfy: kolik textů ukázky prošlo kontrolou vah. */
  glyphTexts: number;
}

const newLog = (): Log => ({ used: new Set(), bare: new Set(), masks: [], texts: [], returns: 0, glyphTexts: 0 });

/**
 * Ukázka kroku na stupni 3: zvýrazněný prvek musí odpovídat textu. Bez textu musí zaznít třetí
 * nápověda (a jen tam, kde ukázka kroku větu opravdu mít nemusí).
 */
function look(g: Game, log: Log, where: string) {
  const text = g.stepHint;
  const hints = hintsInUse(g);
  const key = JSON.stringify(hints);
  log.used.add(key);
  if (!text) {
    log.bare.add(key);
    expect(hints[2], `${where}: ukázka kroku bez věty a bez třetí nápovědy`).toBeTruthy();
  } else {
    log.texts.push(text);
    expect(text, where).not.toMatch(FORBIDDEN);
  }
  const at = `${where}: ${text}`;
  switch (g.kind) {
    case 'altar': {
      const cfg = g.level.config;
      const bit = g.hintTarget;
      expect(bit, where).not.toBeNull();
      const on = isBitSet(g.state.mask, bit!);
      if (!text) {
        // Jen u vah, které hráč teprve objevuje: ukázka by váhu prozradila.
        expect(cfg.reveal === 'solo' && !isBitSet(g.state.revealed, bit!), where).toBe(true);
        return;
      }
      if (cfg.goal.kind === 'all') {
        const flip = flipBit(g.state.mask, bit!);
        if (cfg.strict) {
          const dead = strictDeadEnd(cfg, g.state);
          expect(/nevede/.test(text), at).toBe(dead);
          if (!dead) expect(g.state.found, at).not.toContain(flip);
        } else {
          const known = Array.from({ length: cfg.bits }, (_, i) => flipBit(g.state.mask, i)).every((m) => g.state.found.includes(m));
          expect(/Všichni sousedé/.test(text), at).toBe(known);
          if (!known) expect(g.state.found, at).not.toContain(flip);
        }
        return;
      }
      expect(verbOf(text), at).toBe(on ? 'zhasni' : 'rozsviť');
      if (cfg.goal.kind === 'value' && cfg.hintOrder !== 'low') {
        expect(text, at).toContain(`Žádáno ${altarTarget(cfg, g.state)}.`);
        expect(text, at).toContain(`Váha ${2 ** bit!} `);
      }
      return;
    }
    case 'inscription': {
      const cfg = g.level.config;
      const task = g.task!;
      expect(text, `${where}: Nápis má ukázku kroku vždy se slovy`).toBeTruthy();
      if (cfg.radix === 16) {
        checkGlyphText(text!, task.value, task.dir === 'read', where);
        log.glyphTexts++;
      }
      if (task.dir === 'read') {
        expect(g.hintWeights, where).toBe(true);
        expect(readFromText(cfg, text!), at).toBe(task.value);
        return;
      }
      const bit = g.hintTarget!;
      expect(bit, where).not.toBeNull();
      expect(verbOf(text!), at).toBe(isBitSet(g.state.mask, bit) ? 'zhasni' : 'rozsviť');
      if (cfg.radix === 16) {
        expect(text, at).toContain(`Váha ${2 ** (bit % 4)} do glyfu`);
        if (cfg.bits === 8) expect(text, at).toContain(`${bit >= 4 ? 'Levý' : 'Pravý'} glyf`);
      } else {
        expect(text, at).toContain(`Váha ${2 ** bit} `);
      }
      return;
    }
    case 'cascade': {
      const cell = g.hintCell!;
      expect(cell, where).not.toBeNull();
      expect(text, `${where}: Kaskáda má ukázku kroku vždy se slovy`).toBeTruthy();
      const cfg = g.level.config;
      const c = cell.column;
      if (cell.row === 'copy') {
        expect(text, at).toContain(`váhou ${2 ** c}`);
        return;
      }
      if (cell.row === 'carry' && c === cfg.width) {
        expect(text, at).toMatch(/přepad/i);
        return;
      }
      const named = [...text!.matchAll(ORDINAL)].map((m) => ORDINAL_STEMS.indexOf(m[1].toLowerCase()));
      named.forEach((n) => expect(n, `${at} (zvýrazněný sloupec ${c + 1})`).toBe(c));
      if (cell.row !== 'carry') expect(named.length, at).toBeGreaterThan(0);
      const below = text!.match(/Dole zůstane (světlo|stín)/);
      if (cell.row === 'result' && below) expect(below[1] === 'světlo', at).toBe(isBitSet(answer(cfg, g.task).result, c));
      return;
    }
    case 'tide': {
      const cfg = g.level.config;
      expect(text, `${where}: Příliv má ukázku kroku vždy se slovy`).toBeTruthy();
      const op = g.hintOp;
      if (!op && /Zpět\.$/.test(text!)) {
        // Světlo spadlo přes okraj a k cíli žádná cesta nevede: ukázka pošle ke Zpět, páku nezvýrazní.
        expect(cfg.strict, at).toBeFalsy();
        expect(bestOp(cfg, g.state), at).toBeNull();
        expect(g.canUndo, at).toBe(true);
        return;
      }
      const target = g.target!;
      const parts = chainOf(text!);
      const path = parts.flat();
      expect(path.length, at).toBeGreaterThan(1);
      expect(path.at(-1), at).toBe(target);
      for (const part of parts) {
        for (let k = 1; k < part.length; k++) {
          expect(
            cfg.ops.some((o) => applyOp(o, part[k - 1], cfg.bits).value === part[k]),
            `${at} (${part[k - 1]} → ${part[k]} jednou pákou)`,
          ).toBe(true);
        }
      }
      if (op) {
        // Zkrácená dlouhá cesta řekne počet tahů.
        const moves = parts.length > 1 ? Number(text!.match(/ má (\d+) tah/)?.[1]) : path.length - 1;
        expect(moves, at).toBe(distance(cfg, g.state.value, target));
        expect(path[0], at).toBe(g.state.value);
        expect(text, at).toMatch(new RegExp(`První krok je páka ${LEVER[op]}\\.$`));
        expect(applyOp(op, path[0], cfg.bits).value, at).toBe(path[1]);
        // Váhy Osudu: ukázaná cesta se vejde do tahů, které Osud ještě dovolí.
        if (g.movesLeft !== null) expect(moves, at).toBeLessThanOrEqual(g.movesLeft);
      } else {
        // Cesta se nevejde: ukázka řekne, že se misky vrátí, a ukáže cestu od začátku zkoušky.
        expect(pathFits(cfg, g.state), at).toBe(false);
        const start = taskStart(cfg, g.step);
        expect(text, at).toContain(`misky se vrátí na ${start}.`);
        expect(text, at).toContain(`Osud dovolí už jen ${g.movesLeft}.`);
        expect(path[0], at).toBe(start);
        expect(path.length - 1, at).toBeLessThanOrEqual(g.limit!);
        log.returns++;
      }
      return;
    }
    case 'gate': {
      const h = g.hintTarget;
      const task = g.view.task;
      if (!h) {
        expect(g.hintTest, where).toBe(true);
        return;
      }
      if ('input' in h) {
        expect(task.mode, where).toBe('explore');
        expect(text, `${where}: zkoumání má jen třetí nápovědu`).toBeNull();
        expect(hints[2], where).toMatch(/vstup/);
        return;
      }
      expect(text, `${where}: kámen má ukázku kroku vždy se slovy`).toBeTruthy();
      if ('node' in h) expect(text, at).toContain(`Do zvýrazněného kamene patří ${RUNE_NAME[h.rune]}:`);
      else expect(text, at).toContain(`Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${sourceWords(task.circuit, h.source)}.`);
      return;
    }
    case 'table': {
      const h = g.hintTarget;
      const task = g.view.task;
      if (!h) throw new Error(`${where}: Deska na stupni 3 nic nezvýraznila`);
      expect(text, `${where}: Deska má ukázku kroku vždy se slovy`).toBeTruthy();
      if ('rune' in h) {
        expect(task.mode, where).toBe('identify');
        if (task.mode === 'identify') expect(h.rune, where).toBe(task.answer);
        expect(text, at).toContain(`Pod závojem je ${RUNE_NAME[h.rune]}:`);
        return;
      }
      const lamp = tableOf(task)[h.row];
      expect(text, at).toContain(`Řádek ${rowWords(task.circuit.inputs, h.row)}:`);
      expect(text, at).toMatch(lamp ? /[Ll]ampa svítí\.$/ : /[Ll]ampa mlčí\.$/);
      expect(((g.state.cells >> h.row) & 1) === lamp, `${where}: zvýrazněný řádek už sedí`).toBe(false);
      return;
    }
    case 'mask': {
      const bit = g.hintTarget;
      const task = g.view.task;
      expect(bit, where).not.toBeNull();
      expect(text, `${where}: Maska má ukázku kroku vždy se slovy`).toBeTruthy();
      expect(verbOf(text!), at).toBe(isBitSet(g.state.mask, bit!) ? 'zhasni' : 'rozsviť');
      if (task.key !== undefined) expect(text, at).toContain(`klíč tu ${isBitSet(task.key, bit!) ? 'svítí' : 'mlčí'}`);
      return;
    }
    case 'machine': {
      const h = g.hintTarget;
      const task = g.view.task;
      if (!h) {
        if (task.mode === 'build') expect(g.hintTest, where).toBe(true);
        return;
      }
      if ('input' in h || 'pulse' in h) {
        expect(task.mode, where).not.toBe('build');
        expect(text, `${where}: zkoumání a cíle mají jen třetí nápovědu`).toBeNull();
        return;
      }
      expect(text, `${where}: stavba má ukázku kroku vždy se slovy`).toBeTruthy();
      if ('node' in h) expect(text, at).toContain(`Do zvýrazněného kamene patří ${RUNE_NAME[h.rune]}:`);
      else expect(text, at).toContain(`Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${fromWords(task.machine, h.source)}`);
      return;
    }
  }
}

/**
 * Hráč se dotkne zvýrazněného prvku (jednou). done = ukázaný krok je hotový: u krystalu, buňky,
 * páky a vstupu hned, u kamene s runami a točitého kamene, až ukazuje to, co ukázka chtěla.
 */
function act(g: Game, log: Log): { done: boolean } {
  switch (g.kind) {
    case 'altar': {
      g.toggle(g.hintTarget!);
      log.masks.push(g.state.mask);
      return { done: true };
    }
    case 'inscription': {
      if (g.reading) {
        setDial(g, readFromText(g.level.config, g.stepHint!));
        g.confirm();
      } else {
        g.toggle(g.hintTarget!);
      }
      return { done: true };
    }
    case 'cascade': {
      const before = JSON.stringify(g.state);
      g.toggle(g.hintCell!);
      expect(JSON.stringify(g.state), 'zvýrazněný krystal Kaskády se nesmí odmítnout').not.toBe(before);
      return { done: true };
    }
    case 'tide': {
      const op = g.hintOp;
      if (op) {
        g.pull(op);
        return { done: true };
      }
      // Cesta nevede (světlo spadlo přes okraj): ukázka poslala ke Zpět.
      if (/Zpět\.$/.test(g.stepHint ?? '')) {
        g.undo();
        return { done: true };
      }
      // Ve Vahách Osudu, kde se cesta nevejde, hráč dočerpá tahy (misky se pak vrátí).
      g.pull(g.level.config.ops[0]);
      return { done: false };
    }
    case 'gate': {
      const h = g.hintTarget;
      if (!h) {
        g.test();
        return { done: false };
      }
      if ('input' in h) {
        g.toggleInput(h.input);
        return { done: true };
      }
      if ('node' in h) {
        g.cycleRune(h.node);
        return { done: g.state.runes[h.node] === h.rune };
      }
      g.cycleWire(h.socket);
      return { done: g.state.wires[h.socket] === h.source };
    }
    case 'table': {
      const h = g.hintTarget!;
      if ('rune' in h) g.pick(h.rune);
      else g.toggleCell(h.row);
      return { done: true };
    }
    case 'mask': {
      g.toggle(g.hintTarget!);
      return { done: true };
    }
    case 'machine': {
      const h = g.hintTarget;
      if (!h) {
        g.test();
        return { done: false };
      }
      if ('input' in h) {
        g.toggleInput(h.input);
        return { done: true };
      }
      if ('pulse' in h) {
        g.pulse();
        return { done: true };
      }
      if ('node' in h) {
        g.cycleRune(h.node);
        return { done: g.state.runes[h.node] === h.rune };
      }
      g.cycleWire(h.socket);
      return { done: g.state.wires[h.socket] === h.source };
    }
  }
}

/** Čtení: nastaví kotouče číslicemi z klávesnice (jako hráč, který číslo napíše). */
function setDial(g: InscriptionGame, value: number) {
  for (const d of value.toString(g.radix).padStart(g.wheels, '0')) g.typeDigit(parseInt(d, g.radix));
  expect(g.state.dial).toBe(value);
}

/** Deska sedí a ukázka kroku řekla, co zbývá: hráč potvrdí, nebo spustí Zkoušku. */
function finish(g: Game, where: string) {
  switch (g.kind) {
    case 'cascade':
    case 'table':
    case 'inscription':
      g.confirm();
      return;
    case 'gate':
    case 'machine':
      g.test();
      return;
    default:
      throw new Error(`${where}: ${g.kind} nemá co potvrdit`);
  }
}

/** Úloha, ve které hra je (u cílů Dílny i s pořadím cíle): typická chyba se udělá jednou na úlohu. */
const taskKey = (g: Game): string => `${g.step}:${g.kind === 'machine' ? g.state.goal : 0}`;

/**
 * Typický chybný stav na začátku úlohy: tah nebo dva mimo ukázku kroku. Oltář dotkne krystal,
 * který s cílem sedí, Tichý krok dojde do slepé uličky, Nápis zrcadlí, Kaskáda rozsvítí výsledek
 * před přenosem a potvrdí, Příliv táhne jinou pákou (Váhy Osudu dvakrát), Brána a Dílna dají
 * do kamene jinou runu nebo jiný zdroj, Deska přepne sedící řádek nebo zvolí jinou runu.
 */
function spoil(g: Game, rng: Rng) {
  const step = g.step;
  const same = () => g.phase === 'play' && !g.holding && g.step === step;
  switch (g.kind) {
    case 'altar': {
      const cfg = g.level.config;
      if (cfg.goal.kind === 'all') {
        if (!cfg.strict) return g.toggle(cfg.bits - 1);
        // Tichý krok: náhodná cesta bez opakování, dokud nedojde do slepé uličky.
        for (let k = 0; k < 2 ** cfg.bits && same() && !strictDeadEnd(cfg, g.state); k++) {
          const free = Array.from({ length: cfg.bits }, (_, i) => i).filter((i) => !g.state.found.includes(flipBit(g.state.mask, i)));
          if (!free.length) break;
          g.toggle(free[Math.floor(rng() * free.length)]);
        }
        return;
      }
      const hb = altarHint(cfg, g.state);
      const target = altarTarget(cfg, g.state);
      for (let b = 0; b < cfg.bits; b++) {
        if (b === hb) continue;
        if (target !== null && isBitSet(g.state.mask, b) !== isBitSet(target, b)) continue;
        return g.toggle(b);
      }
      return;
    }
    case 'inscription': {
      const task = g.task;
      if (!task) return;
      const bits = g.level.config.bits;
      const mirror = mirrored(task.value, bits);
      if (task.dir === 'read') {
        setDial(g, mirror !== task.value ? mirror : task.value ^ 1);
        return g.confirm();
      }
      const extra = mirror & ~task.value;
      const wrong = extra || (~task.value & -~task.value);
      for (let b = 0; b < bits && same(); b++) if (isBitSet(wrong, b)) g.toggle(b);
      return;
    }
    case 'cascade': {
      const cfg = g.level.config;
      const ans = answer(cfg, g.task);
      for (let c = 0; c < cfg.width; c++) {
        if (isBitSet(g.state.result, c) !== isBitSet(ans.result, c)) continue;
        const before = g.state.result;
        g.toggle({ row: 'result', column: c } satisfies CascadeCell);
        if (g.state.result !== before) break;
      }
      return g.confirm();
    }
    case 'tide': {
      const cfg = g.level.config;
      for (let k = 0; k < (cfg.strict ? 2 : 1) && same(); k++) {
        const best = bestOp(cfg, g.state);
        const op = cfg.ops.find((o) => o !== best);
        if (op) g.pull(op);
      }
      return;
    }
    case 'gate': {
      const task = g.view.task;
      if (task.mode === 'explore') {
        g.toggleInput(0);
        if (same()) g.toggleInput(0);
        return;
      }
      const sol = solutions(task)[0];
      const slot = slotNodes(task.circuit)[0];
      if (slot) for (let k = 0; k < 8 && same() && (!g.state.runes[slot.id] || g.state.runes[slot.id] === sol.runes[slot.id]); k++) g.cycleRune(slot.id);
      const sock = sockets(task.circuit)[0];
      if (sock) for (let k = 0; k < 8 && same() && (!g.state.wires[sock.key] || g.state.wires[sock.key] === sol.wires[sock.key]); k++) g.cycleWire(sock.key);
      return;
    }
    case 'table': {
      const task = g.view.task;
      if (task.mode === 'identify') return g.pick(task.choices.find((r) => r !== task.answer)!);
      const want = tableOf(task);
      const row = want.findIndex((v, r) => ((g.state.cells >> r) & 1) === v);
      if (row >= 0) g.toggleCell(row);
      return;
    }
    case 'mask': {
      const hb = maskHint(g.level.config, g.state);
      const b = hb === 0 ? 1 : 0;
      if (b < g.level.config.bits) g.toggle(b);
      return;
    }
    case 'machine': {
      const task = g.view.task;
      const m = task.machine;
      if (task.mode === 'explore') {
        g.toggleInput(0);
        if (same()) g.toggleInput(0);
        return;
      }
      if (task.mode === 'goals') {
        const h = machineHint(g.level.config, g.state);
        const input = m.inputs.findIndex((_, i) => !(h && 'input' in h && h.input === i));
        if (input >= 0) g.toggleInput(input);
        else if (hasPulse(m) && !(h && 'pulse' in h)) g.pulse();
        return;
      }
      const sol = machineSolutions(task, 1)[0];
      const slot = machineSlots(m)[0];
      if (slot) for (let k = 0; k < 8 && same() && (!g.state.runes[slot.id] || g.state.runes[slot.id] === sol.runes[slot.id]); k++) g.cycleRune(slot.id);
      const sock = machineSockets(m)[0];
      if (sock) for (let k = 0; k < 8 && same() && (!g.state.wires[sock.key] || g.state.wires[sock.key] === sol.wires[sock.key]); k++) g.cycleWire(sock.key);
      return;
    }
  }
}

/**
 * Odehraje část komnaty jen podle ukázky kroku. wrong: na začátku každé úlohy nejdřív typická chyba.
 * Vrátí hru po vyřešení (i s kvízem, odpovězeným správně).
 */
function play(level: PuzzleLevel, seed: number, wrong: boolean, log: Log): Game {
  const where = `${level.id} ${level.title} (semínko ${seed}${wrong ? ', z chybného stavu' : ''})`;
  // Zkouška navíc v bráně i pořadí možností v kvízu se losují přes Math.random: s pevným semínkem.
  const random = vi.spyOn(Math, 'random').mockImplementation(seeded(9000 + seed));
  try {
    const events: GameEvent[] = [];
    const g = createGame(level, (e) => events.push(e));
    const rng = seeded(7000 + seed);
    let spoiled = '';
    /** Ukázané kroky, které hráč dokončil. */
    let done = 0;
    for (let guard = 0; g.phase === 'play'; guard++) {
      if (guard > 4000) throw new Error(`${where}: hra jen podle ukázky nedošla do konce`);
      if (g.holding) {
        vi.advanceTimersByTime(HOLD_MS);
        continue;
      }
      if (wrong && taskKey(g) !== spoiled) {
        spoiled = taskKey(g);
        spoil(g, rng);
        continue;
      }
      if (g.hintLevel < 3) {
        // Stisky Nápovědy, dokud neukáže krok. Na hotové desce hra jen řekne, co zbývá.
        const before = g.hintLevel;
        g.useHint();
        if (g.hintLevel === before) {
          expect(events.at(-1)?.kind, `${where}: stisk Nápovědy nic neudělal`).toBe('settled');
          const task = taskKey(g);
          finish(g, where);
          expect(g.phase !== 'play' || g.holding || taskKey(g) !== task, `${where}: potvrzení hotové desky neprošlo`).toBe(true);
        }
        continue;
      }
      look(g, log, where);
      if (g.kind === 'altar' && log.masks.length === 0) log.masks.push(g.state.mask);
      if (act(g, log).done) {
        done++;
        // R2: po provedeném kroku ukáže další krok až další stisk Nápovědy.
        if (g.phase === 'play' && !g.holding) {
          expect(g.hintLevel, `${where}: po kroku podle ukázky hra ukazuje další krok bez stisku (R2)`).toBeLessThan(3);
          expect(g.stepHint, where).toBeNull();
        }
      }
    }
    while (g.phase === 'quiz') {
      g.answer(g.question!.correct);
      g.continueQuiz();
    }
    expect(g.phase, where).toBe('solved');
    expect(g.result?.seals.solved, where).toBe(true);
    // Každý stisk na ukázku kroku dal právě jeden krok.
    expect(g.stepHints, `${where}: ukázek kroku má být tolik, kolik je ukázaných kroků`).toBe(done);
    return g;
  } finally {
    random.mockRestore();
  }
}

/** Podoby k-té části komnaty: ručně vybraná (semínko 0) a u losování SEEDS vylosovaných. */
function variants(level: LevelDef, k: number): { seed: number; part: PuzzleLevel }[] {
  const out = [{ seed: 0, part: partsOf(level)[k] }];
  if (partsOf(level)[k].generate) for (let seed = 1; seed <= SEEDS; seed++) out.push({ seed, part: partsOf(instantiate(level, seeded(seed)))[k] });
  return out;
}

/** Odehraje všechny podoby části od startu i z chybného stavu. */
function playAll(level: LevelDef, k: number, log: Log) {
  for (const v of variants(level, k)) {
    play(v.part, v.seed, false, log);
    play(v.part, v.seed, true, log);
  }
}

const thirdOf = (key: string): boolean => !!(JSON.parse(key) as (string | null)[])[2];

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

for (const floor of ACTS) {
  // Prapečeť v bráně hledá nejbližší řešení po každém doteku: delší limit, ať test nepadá na pomalém stroji.
  describe(`A0: patro ${floor.numeral} jen podle ukázky kroku`, { timeout: 30_000 }, () => {
    for (const level of floor.levels) {
      partsOf(level).forEach((part, k) => {
        it(`${level.id} ${part.title}: od startu i z chybného stavu skončí vyřešená`, () => {
          const log = newLog();
          playAll(level, k, log);
          // A8: třetí nápověda je tam, kde ukázka kroku zůstala bez věty, a jen tam.
          for (const key of log.used) expect(thirdOf(key), `${level.id} ${part.title}: třetí nápověda ${key}`).toBe(log.bare.has(key));
        });
      });
    }
  });
}

/** Komnata a pořadí její části (u smíšené brány podle jména části). */
function locate(id: string, title?: string): { level: LevelDef; k: number; part: PuzzleLevel } {
  const level = ACTS.flatMap((a) => a.levels).find((l) => l.id === id)!;
  const k = partsOf(level).findIndex((p) => !title || p.title === title);
  return { level, k, part: partsOf(level)[k] };
}
const findPart = (id: string, title?: string): PuzzleLevel => locate(id, title).part;

describe('A0: podmínky z textů', { timeout: 30_000 }, () => {
  it('Tichý krok a Kolik kombinací? jdou od startu zrcadlovým Grayovým kódem, každý stisk dá jeden krok', () => {
    for (const [id, title] of [['I-3'], ['I-11'], ['I-15', 'Tichý krok']] as [string, string?][]) {
      const part = findPart(id, title);
      if (part.kind !== 'altar') throw new Error(id);
      const n = 2 ** part.config.bits;
      const log = newLog();
      const g = play(part, 0, false, log);
      expect(log.masks, id).toEqual(Array.from({ length: n }, (_, i) => gray(i)));
      // H-I-05: ukázka v Tichém kroku dřív stála 3 stisky na kombinaci (45 v I-11), teď jeden.
      expect(g.stepHints, id).toBe(n - 1);
      expect(g.hintsUsed, id).toBe(n + 1);
    }
  });

  it('Tichý krok ze slepé uličky: ukázka cestu přeruší a pak dovede do konce', () => {
    for (const [id, title] of [['I-11'], ['I-15', 'Tichý krok']] as [string, string?][]) {
      const part = findPart(id, title);
      const log = newLog();
      for (let seed = 1; seed <= 20; seed++) play(part, seed, true, log);
      expect(log.texts.some((t) => /nevede/.test(t)), id).toBe(true);
    }
  });

  it('ukázka u glyfů nezmíní váhu nad 8 (Řeč glyfů, Dvojznak, velká brána)', () => {
    let checked = 0;
    for (const [id, title] of [['I-13'], ['I-14'], ['I-15', 'Glyfy']] as [string, string?][]) {
      const { level, k, part } = locate(id, title);
      expect(part.kind === 'inscription' && part.config.radix, id).toBe(16);
      const log = newLog();
      playAll(level, k, log);
      checked += log.glyphTexts;
    }
    expect(checked).toBeGreaterThan(300);
  });

  it('Váhy Osudu: ukázaná cesta se vejde do zbylých tahů, jinak ukázka řekne, že se misky vrátí', () => {
    let returns = 0;
    for (const [id, title] of [['II-14'], ['II-15', 'Váhy Osudu']] as [string, string?][]) {
      const { level, k, part } = locate(id, title);
      expect(part.kind === 'tide' && !!part.config.strict, id).toBe(true);
      const log = newLog();
      playAll(level, k, log);
      returns += log.returns;
    }
    expect(returns).toBeGreaterThan(0);
  });
});

describe('A0: chyby, které hra jen podle ukázky našla', () => {
  it('II-13 Prázdná nádoba: dlouhá cesta dojde až k cíli (dřív končila po deseti tazích u 13)', () => {
    const part = findPart('II-13', 'Prázdná nádoba');
    if (part.kind !== 'tide') throw new Error('II-13');
    expect(tideStep(part.config, initTide(part.config))).toBe('Nejkratší cesta k 0 má 13 tahů: 3 → 4 → 5 → … → 14 → 15 → 0. První krok je páka přidej jednu.');
  });

  it('II-6: kde světlo spadlo přes okraj a cesta nevede, ukázka pošle ke Zpět (dřív mlčela)', () => {
    const part = findPart('II-6');
    if (part.kind !== 'tide') throw new Error('II-6');
    // Ze 3 posun vpravo: jednička spadne přes okraj a z 1 se k 6 samými posuny dojít nedá.
    const g = new TideGame(part, () => {});
    g.pull('shr');
    expect(g.state.value).toBe(1);
    g.useHint();
    g.useHint();
    g.useHint();
    expect(g.hintOp).toBeNull();
    expect(g.stepHint).toBe('Odsud k 6 cesta nevede: část světla spadla přes okraj. Vrať tah tlačítkem Zpět.');
    // Zpět je ukázaný krok: další krok ukáže až další stisk (R2).
    g.undo();
    expect(g.state.value).toBe(3);
    expect(g.hintLevel).toBe(2);
    g.useHint();
    expect(g.hintOp).toBe('shl');
  });
});

describe('Kontrola 0.4.4: nálezy kontrolorů', () => {
  it('Dílna: důvod u točitého kamene popisuje řešení, ke kterému ukázka míří, ne chybné zapojení desky', () => {
    const part = findPart('IV-8', 'Stavba');
    if (part.kind !== 'machine') throw new Error('IV-8');
    const task = part.config.tasks[0];
    const m = task.machine;
    const socks = machineSockets(m);
    // Všechna natočení točitých kamenů (bez nenastavených): ukázka kroku jde podle nejbližšího řešení.
    const wirings: Record<string, string>[] = socks.reduce<Record<string, string>[]>(
      (acc, s) => acc.flatMap((w) => s.choices.map((src) => ({ ...w, [s.key]: src }))),
      [{}],
    );
    let differs = 0;
    for (const wires of wirings) {
      const g = new MachineGame(part, () => {});
      g.state = { ...g.state, wires };
      for (let k = 0; k < 3; k++) g.useHint();
      const h = g.hintTarget;
      if (!h || !('socket' in h)) continue;
      const sol = machineNearest(task, g.state)!;
      expect(g.stepHint).toBe(`Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${fromWhyWords(m, h.source, sol.runes, sol.wires)}.`);
      if (g.stepHint !== `Zvýrazněný točitý kámen natoč tak, aby světlo teklo ${fromWhyWords(m, h.source, sol.runes, wires)}.`) differs++;
    }
    expect(differs).toBeGreaterThan(0);
    // Scénář z kontroly: každý točitý kámen jednou pootočený (S do kamene 1, R do kamene 2).
    const g = new MachineGame(part, () => {});
    for (const s of socks) g.cycleWire(s.key);
    for (let k = 0; k < 3; k++) g.useHint();
    expect(g.stepHint).toContain('z kamene 2, kde Zavřené rozcestí bere světlo ze vstupu R a z kamene 1');
    expect(g.stepHint).not.toContain('ze vstupu R a ze vstupu R');
  });

  it('Tichý krok: po přerušení ze slepé uličky Zpět slepou uličku nevrací a Echo ho nenabízí', () => {
    for (const [id, title] of [['I-11'], ['I-15', 'Tichý krok']] as [string, string?][]) {
      const part = findPart(id, title);
      if (part.kind !== 'altar') throw new Error(id);
      const cfg = part.config;
      // Slepá ulička: náhodná cesta bez opakování, dokud dál nevede.
      let dead: AltarGame | null = null;
      for (let seed = 1; seed <= 50 && !dead; seed++) {
        const rng = seeded(seed);
        const g = new AltarGame(part, () => {});
        while (!g.state.complete && !strictDeadEnd(cfg, g.state)) {
          const free = Array.from({ length: cfg.bits }, (_, i) => i).filter((i) => !g.state.found.includes(flipBit(g.state.mask, i)));
          g.toggle(free[Math.floor(rng() * free.length)]);
        }
        if (!g.state.complete) dead = g;
      }
      if (!dead) throw new Error(`${id}: slepá ulička se nenašla`);
      const events: GameEvent[] = [];
      const g = new AltarGame(part, (e) => events.push(e));
      g.state = { ...dead.state };
      for (let k = 0; k < 3; k++) g.useHint();
      expect(g.stepHint, id).toMatch(/nevede/);
      g.toggle(g.hintTarget!);
      const reset = events.flatMap((e) => (e.kind === 'altar' && e.event.type === 'reset' ? [e.event] : []));
      expect(reset, id).toEqual([{ type: 'reset', to: cfg.initial ?? 0, deadEnd: true }]);
      expect(g.canUndo, `${id}: Zpět by vrátilo slepou uličku`).toBe(false);
      expect(resetLine(part.echo.reset, true), id).not.toMatch(/Zpět/);
      // Přerušení uprostřed cesty (překlep): Zpět cestu vrátí a Echo to řekne.
      const h: GameEvent[] = [];
      const typo = new AltarGame(part, (e) => h.push(e));
      typo.toggle(0);
      typo.toggle(0);
      expect(h.some((e) => e.kind === 'altar' && e.event.type === 'reset' && !e.event.deadEnd), id).toBe(true);
      expect(typo.canUndo, id).toBe(true);
      expect(resetLine(part.echo.reset, false), id).toMatch(/Zpět vrátí cestu před přerušením\.$/);
    }
  });

  it('Zkouška paměti: řádek „stroj:“ má aria-colspan, ať čtečka najde hodnoty lamp pod jejich sloupci', () => {
    const label = workshopSource.split('\n').find((l) => l.includes('class="shown-label"'))!;
    expect(label).toContain('style:grid-column="span {shownSpan}"');
    expect(label).toContain('aria-colspan={shownSpan}');
  });

  it('Nápověda na 3/3 zůstane fokusovatelná: aria-disabled místo disabled', () => {
    const button = levelSource.slice(levelSource.indexOf('class="btn btn-ghost hint-btn"'), levelSource.indexOf('title="Nápověda (H)"'));
    expect(button).toContain("disabled={game.phase !== 'play'}");
    expect(button).not.toMatch(/(?<!aria-)disabled=\{[^}]*hintLevel/);
    expect(button).toContain("aria-disabled={game.hintLevel >= 3 ? 'true' : undefined}");
  });
});
