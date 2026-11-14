<script lang="ts">
  import { tick, untrack } from 'svelte';
  import Altar from '../altar/Altar.svelte';
  import LevelComplete from '../altar/LevelComplete.svelte';
  import Inscription from '../inscription/Inscription.svelte';
  import Cascade from '../cascade/Cascade.svelte';
  import Tide from '../tide/Tide.svelte';
  import EchoBubble from '../EchoBubble.svelte';
  import FxLayer, { type Area, type Point } from '../FxLayer.svelte';
  import Icon from '../Icon.svelte';
  import { GATE, actOf, getLevel, instantiate, nextLevelId, partsOf, roomNumber } from '../../content/levels';
  import type { PuzzleLevel } from '../../content/types';
  import { kodexById } from '../../content/kodex';
  import { maxValue, patternWords, toBinaryString } from '../../core/bits';
  import type { AltarEvent, AltarState } from '../../core/puzzles/altar';
  import type { CascadeEvent, CascadeState } from '../../core/puzzles/cascade';
  import type { InscriptionEvent, InscriptionState } from '../../core/puzzles/inscription';
  import type { TideEvent, TideOp, TideState } from '../../core/puzzles/tide';
  import { AltarGame } from '../../game/altarGame.svelte.ts';
  import type { GameEvent, LevelResult } from '../../game/baseGame.svelte.ts';
  import { CascadeGame } from '../../game/cascadeGame.svelte.ts';
  import { InscriptionGame } from '../../game/inscriptionGame.svelte.ts';
  import { TideGame } from '../../game/tideGame.svelte.ts';
  import { Echo } from '../../game/echo.svelte.ts';
  import { FX, fxState } from '../../game/fx.svelte.ts';
  import { go, openKodex, ui } from '../../game/nav.svelte.ts';
  import { recordResult, unseenKodex } from '../../game/progress.svelte.ts';
  import { saveSettings, settings } from '../../game/settings.svelte.ts';
  import { plainText } from '../../game/text';
  import * as sound from '../../audio/sound';

  let { id }: { id: string } = $props();

  // Komponenta se v App.svelte vytváří znovu pro každé id ({#key}).
  // Komnaty na procvičování dostanou při každém vstupu nově vylosované úlohy.
  const room = instantiate(getLevel(untrack(() => id))!);
  /** Hádanky komnaty; smíšená brána jich má víc a hrají se po sobě. */
  const parts = partsOf(room);
  const next = nextLevelId(room.id);
  const kodex = room.kodex ? (kodexById(room.kodex) ?? null) : null;
  const act = actOf(room.id);
  const isGate = roomNumber(room.id) === GATE;

  const bitsOf = (l: PuzzleLevel) => (l.kind === 'cascade' ? l.config.width : l.config.bits);
  /** Aktuální část komnaty (u obyčejné komnaty celá komnata). */
  let partIndex = $state(0);
  let level: PuzzleLevel = parts[0];
  let bits = bitsOf(level);
  const partResults: LevelResult[] = [];
  /** Výsledek celé komnaty (u smíšené součet všech částí). */
  let result: LevelResult | null = $state(null);

  const echo = new Echo();
  let game = $state.raw(createGame());

  function createGame() {
    switch (level.kind) {
      case 'altar':
        return new AltarGame(level, handle);
      case 'inscription':
        return new InscriptionGame(level, handle);
      case 'cascade':
        return new CascadeGame(level, handle);
      case 'tide':
        return new TideGame(level, handle);
    }
  }

  /** Repliky po dalších chybných čteních (první říká level.echo.wrong). */
  const WRONG_AGAIN = ['Ještě ne. Který krystal nesedí?', 'Porovnej obě kombinace krystal po krystalu.'];
  /** Sloupce Kaskády: v … sloupci, nad … sloupcem, do … sloupce. */
  const LOC = ['prvním', 'druhém', 'třetím', 'čtvrtém', 'pátém', 'šestém', 'sedmém', 'osmém'];
  const INS = ['prvním', 'druhým', 'třetím', 'čtvrtým', 'pátým', 'šestým', 'sedmým', 'osmým'];
  const GEN = ['prvního', 'druhého', 'třetího', 'čtvrtého', 'pátého', 'šestého', 'sedmého', 'osmého'];
  const FLOW = ['žádné světlo', 'jedno světlo', 'dvě světla', 'tři světla'];
  const LEVER_NAME: Record<TideOp, string> = {
    shl: 'Posun vlevo',
    shr: 'Posun vpravo',
    inc: 'Přidána jedna',
    dec: 'Ubrána jedna',
  };

  let announcement = $state('');
  let pulse = $state(0);
  let showComplete = $state(false);
  let solvedLines: string[] = $state([]);
  let firstRevealSaid = false;
  let repeatSaid = false;
  let wrongCount = 0;
  let fx: FxLayer | undefined = $state();
  let stageEl: HTMLElement | undefined = $state();
  let spillSaid = false;
  /** Roste s každým chybným potvrzením Kaskády (otřese sloupcem). */
  let wobble = $state(0);
  let completeTimer: ReturnType<typeof setTimeout> | undefined;
  let partTimer: ReturnType<typeof setTimeout> | undefined;

  echo.say(room.kind === 'mixed' ? [...room.echo.intro, ...level.echo.intro] : level.echo.intro);

  $effect(() => () => {
    clearTimeout(completeTimer);
    clearTimeout(partTimer);
  });

  /** Smíšená brána: po splněné části přijde další hádanka. */
  function nextPart() {
    const done = level.echo.solved;
    if (done.length) echo.say(done);
    pulse += 1;
    sound.playGrind(0.8);
    stepFx('.row', '.board', '.register', '.wall');
    announce(`Část ${partIndex + 1} z ${parts.length} splněna. ${done.map(plainText).join(' ')}`);
    partTimer = setTimeout(
      () => {
        partIndex += 1;
        level = parts[partIndex];
        bits = bitsOf(level);
        firstRevealSaid = false;
        repeatSaid = false;
        wrongCount = 0;
        spillSaid = false;
        game = createGame();
        echo.say(level.echo.intro);
        announce(`Část ${partIndex + 1} z ${parts.length}: ${level.title}. ${level.presentation.task}`);
      },
      settings.reducedMotion ? 400 : 1600,
    );
  }

  /** Pečetě za celou komnatu: tahy a nápovědy všech částí dohromady. */
  function combine(results: LevelResult[]): LevelResult {
    const moves = results.reduce((sum, r) => sum + r.moves, 0);
    const par = results.reduce((sum, r) => sum + r.par, 0);
    const hintsUsed = results.reduce((sum, r) => sum + r.hintsUsed, 0);
    return { moves, par, hintsUsed, seals: { solved: true, skill: moves <= par, pure: hintsUsed === 0 } };
  }

  function announce(text: string) {
    announcement = announcement === text ? `${text} ` : text;
  }

  function words(mask: number): string {
    return level.presentation.showDigits || settings.alwaysDigits ? toBinaryString(mask, bits) : patternWords(mask, bits);
  }

  /** Střed prvního nalezeného prvku scény (odkud efekt vychází). */
  function centerOf(...selectors: string[]): Point {
    for (const sel of selectors) {
      const el = stageEl?.querySelector(sel);
      if (el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    }
    const r = stageEl?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
  }

  function stageArea(): Area {
    const r = stageEl?.getBoundingClientRect();
    return r ? { left: r.left, right: r.right, top: Math.max(0, r.top) } : { left: 0, right: innerWidth, top: 0 };
  }

  /** Otřes scény: při chybě prudký ráz, při otevření komnaty dlouhé dunění. */
  function shake(kind: 'fail' | 'win') {
    if (settings.reducedMotion || !stageEl) return;
    const s = kind === 'fail' ? FX.fail : FX.win;
    // [x px, y px, otočení °] pro ráz při chybě; dunění při otevření komnaty je drobné chvění.
    const hits = [
      [0, 0, 0],
      [-9, 2, -0.4],
      [8, -2, 0.35],
      [-5, 1, -0.2],
      [3, 0, 0.1],
      [0, 0, 0],
    ];
    const frames =
      kind === 'fail'
        ? hits.map(([x, y, r]) => ({ transform: `translate(${x * s}px, ${y * s}px) rotate(${r * s}deg)` }))
        : Array.from({ length: 14 }, (_, k) => ({
            transform: k === 13 ? 'none' : `translate(${(Math.random() * 2 - 1) * 3 * s}px, ${(Math.random() * 2 - 1) * 2 * s}px)`,
          }));
    stageEl.animate(frames, { duration: kind === 'fail' ? 520 : 1100, easing: 'ease-out' });
  }

  /** Chyba: mechanismus nepovolí (zvuk, otřes, prach ze stropu). */
  function failFx(...selectors: string[]) {
    sound.playFail();
    tick().then(() => {
      fx?.fail(centerOf(...selectors), stageArea());
      shake('fail');
    });
  }

  /** Splněný krok: vlna světla a jiskry z místa, kde se to stalo. */
  function stepFx(...selectors: string[]) {
    tick().then(() => fx?.step(centerOf(...selectors)));
  }

  function handle(e: GameEvent) {
    switch (e.kind) {
      case 'altar':
        onAltar(e.event, e.state);
        break;
      case 'inscription':
        onInscription(e.event, e.state);
        break;
      case 'cascade':
        onCascade(e.event, e.state);
        break;
      case 'tide':
        onTide(e.event, e.state);
        break;
      case 'hint': {
        const text = level.hints[e.level - 1];
        echo.say([text], 'hint');
        announce(`Nápověda ${e.level}: ${text}`);
        break;
      }
      case 'quiz': {
        const btn = document.activeElement instanceof HTMLElement ? document.activeElement.getBoundingClientRect() : null;
        const at = btn ? { x: btn.left + btn.width / 2, y: btn.top + btn.height / 2 } : centerOf('.quiz');
        if (e.correct) {
          sound.playChime();
          fx?.step(at);
        } else {
          sound.playFail();
          fx?.puff(at, 22 * FX.fail);
          shake('fail');
        }
        break;
      }
      case 'solved': {
        partResults.push(e.result);
        if (partIndex + 1 < parts.length) {
          nextPart();
          break;
        }
        const total = combine(partResults);
        result = total;
        const lines = room.echo;
        sound.playSolved(bits);
        recordResult(room.id, total, room.kodex);
        solvedLines = [...lines.solved, ...(total.seals.skill && lines.skill ? [lines.skill] : [])];
        pulse += 1;
        fxState.wins += 1;
        sound.playRumble();
        tick().then(() => {
          fx?.win(centerOf('.row', '.board', '.register', '.wall'), stageArea());
          shake('win');
        });
        announce(`Komnata otevřena. ${solvedLines.map(plainText).join(' ')}`);
        completeTimer = setTimeout(() => {
          showComplete = true;
          sound.playDoor();
        }, settings.reducedMotion ? 250 : 1300);
        break;
      }
    }
  }

  function onAltar(ev: AltarEvent, state: AltarState) {
    if (level.kind !== 'altar') return;
    const cfg = level.config;
    const counter = !!level.presentation.counter;
    if (ev.type === 'toggle') {
      sound.playBit(ev.bit, ev.on);
      let msg = `Krystal ${bits - ev.bit} zleva ${ev.on ? 'rozsvícen' : 'zhasnut'}.`;
      if (level.presentation.showSum) msg += ` Světlo váží ${state.mask}.`;
      announce(msg);
    } else if (ev.type === 'reveal') {
      sound.playReveal();
      if (ev.allRevealed && level.echo.allRevealed) echo.say([level.echo.allRevealed]);
      else if (!firstRevealSaid && level.echo.firstReveal) {
        echo.say([level.echo.firstReveal]);
        firstRevealSaid = true;
      }
    } else if (ev.type === 'found') {
      sound.playChord(ev.pattern, bits, 0.08);
      stepFx('.niche.current', '.row');
      const line = level.echo.found?.[ev.count];
      if (line) echo.say([line]);
      announce(`Nová kombinace. Nalezeno ${ev.count} z ${2 ** bits}.`);
    } else if (ev.type === 'repeat') {
      sound.playSoft();
      fx?.puff(centerOf('.niche.current', '.row'), 10);
      if (!repeatSaid && level.echo.repeat) {
        echo.say([level.echo.repeat]);
        repeatSaid = true;
      }
    } else if (ev.type === 'step') {
      sound.playChord(ev.target, bits, 0.1);
      if (counter) sound.playCarve();
      else if (cfg.goal.kind === 'value') sound.playGrind();
      pulse += 1;
      stepFx('.row');
      const line = level.echo.step?.[ev.index];
      if (line) echo.say([line]);
      const targets = cfg.goal.kind === 'all' ? [] : cfg.goal.targets;
      const upcoming = targets[state.step];
      if (upcoming === undefined) announce('Přijato.');
      else if (counter) announce(`Přijato. Poutníků: ${ev.target}. Přichází další.`);
      else announce(`Přijato. Oltář žádá ${upcoming}.`);
    } else if (ev.type === 'complete') {
      if (level.quiz?.length && level.echo.complete) echo.say([level.echo.complete]);
    }
  }

  function onInscription(ev: InscriptionEvent, state: InscriptionState) {
    if (level.kind !== 'inscription') return;
    const cfg = level.config;
    if (ev.type === 'toggle') {
      sound.playBit(ev.bit, ev.on);
      announce(`Krystal ${bits - ev.bit} zleva ${ev.on ? 'rozsvícen' : 'zhasnut'}.`);
    } else if (ev.type === 'wrong') {
      failFx('.dial', '.wall');
      wrongCount++;
      if (ev.guess > maxValue(bits)) echo.say([`Tolik se do ${bits} krystalů nevejde. Nejvíc je ${maxValue(bits)}.`]);
      else if (wrongCount === 1 && level.echo.wrong) echo.say([level.echo.wrong]);
      else echo.say([WRONG_AGAIN[wrongCount % WRONG_AGAIN.length]]);
      announce(`Kotouče ukazují ${ev.guess}. Nápis váží jinak.`);
    } else if (ev.type === 'step') {
      sound.playChord(ev.task.value, bits, 0.1);
      sound.playGrind(ev.task.dir === 'read' ? 0.6 : 0.9);
      pulse += 1;
      stepFx('.wall');
      const line = level.echo.step?.[ev.index];
      if (line) echo.say([line]);
      const upcoming = cfg.tasks[state.step];
      if (!upcoming) announce('Správně.');
      else if (upcoming.dir === 'read') announce(`Správně. Další nápis: ${words(upcoming.value)}.`);
      else announce(`Správně. Brána žádá ${upcoming.value}.`);
    } else if (ev.type === 'complete') {
      if (level.quiz?.length && level.echo.complete) echo.say([level.echo.complete]);
    }
  }

  /** Proč Kaskáda výsledek nepřijala: vysvětlí první sloupec zprava, který nesedí. */
  function cascadeWhy(ev: Extract<CascadeEvent, { type: 'wrong' }>, state: CascadeState): string {
    if (level.kind !== 'cascade') return '';
    const cfg = level.config;
    const task = cfg.tasks[state.step];
    const sub = task.op === 'sub';
    const c = ev.cell.column;
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

  function onCascade(ev: CascadeEvent, state: CascadeState) {
    if (level.kind !== 'cascade') return;
    const cfg = level.config;
    if (ev.type === 'toggle') {
      const { row, column } = ev.cell;
      if (row === 'result') sound.playBit(column, ev.on);
      else sound.playSpark(ev.on);
      const what =
        row === 'result'
          ? `Krystal výsledku ${column + 1} zprava`
          : column === cfg.width
            ? 'Přepad'
            : cfg.tasks[state.step]?.op === 'sub'
              ? `Krystal výpůjčky ve sloupci ${column + 1} zprava`
              : `Krystal přenosu nad sloupcem ${column + 1} zprava`;
      announce(`${what}: ${ev.on ? 'světlo' : 'stín'}.`);
    } else if (ev.type === 'wrong') {
      failFx('.strip.wrong', '.chute.wrong', '.board');
      wobble += 1;
      const why = cascadeWhy(ev, state);
      echo.say([why]);
      announce(`Výsledek nepřijat. ${why}`);
    } else if (ev.type === 'step') {
      sound.playCascade(cfg.width);
      sound.playGrind(0.7);
      pulse += 1;
      stepFx('.board');
      const line = level.echo.step?.[ev.index];
      if (line) echo.say([line]);
      announce(state.complete ? 'Správně.' : 'Správně. Ve stěně je další úloha.');
    } else if (ev.type === 'complete') {
      if (level.quiz?.length && level.echo.complete) echo.say([level.echo.complete]);
    }
  }

  function onTide(ev: TideEvent, state: TideState) {
    if (level.kind !== 'tide') return;
    const cfg = level.config;
    if (ev.type === 'pull') {
      sound.playShift();
      sound.playChord(ev.to, bits, 0.06);
      const lost = ev.spill === 'left' || ev.spill === 'right';
      if (ev.spill) sound.playSpill();
      // Kamenná řada se posune a na okraji se zvíří prach.
      const reg = stageEl?.querySelector('.register .crystals')?.getBoundingClientRect();
      if (reg && (ev.op === 'shl' || ev.op === 'shr' || lost)) {
        const leftEdge = ev.op === 'shl' || ev.spill === 'left';
        fx?.puff({ x: leftEdge ? reg.left + 10 : reg.right - 10, y: reg.bottom - 30 }, lost ? 18 : 8);
      }
      if (lost && !spillSaid && level.echo.spill) {
        echo.say([level.echo.spill]);
        spillSaid = true;
      }
      announce(`${LEVER_NAME[ev.op]}. Světlo váží ${ev.to}.${lost ? ' Jedno světlo spadlo přes okraj.' : ''}`);
    } else if (ev.type === 'reset') {
      failFx('.register');
      sound.playGrind(0.6);
      if (level.echo.reset) echo.say([level.echo.reset]);
      announce(`Tahy došly. Světlo se vrátilo na ${ev.to}.`);
    } else if (ev.type === 'step') {
      sound.playChord(ev.target, bits, 0.1);
      sound.playGrind(0.8);
      pulse += 1;
      stepFx('.register');
      const line = level.echo.step?.[ev.index];
      if (line) echo.say([line]);
      const upcoming = cfg.tasks[state.step];
      announce(upcoming && !state.complete ? `Správně. Teď z ${state.value} na ${upcoming.target}.` : 'Správně.');
    } else if (ev.type === 'complete') {
      if (level.quiz?.length && level.echo.complete) echo.say([level.echo.complete]);
    }
  }

  function nudge(wheel: number, delta: number) {
    if (game.kind !== 'inscription') return;
    game.nudge(wheel, delta);
    sound.playTick();
  }

  /** Znovu: komnata se vytvoří od začátku (a u procvičování vylosuje nové úlohy). */
  function restart() {
    clearTimeout(completeTimer);
    clearTimeout(partTimer);
    go({ name: 'level', id: room.id, run: Date.now() });
  }

  function toggleSound() {
    settings.sound = !settings.sound;
    saveSettings();
    if (settings.sound) sound.unlock();
  }

  function onKey(ev: KeyboardEvent) {
    if (ui.kodexOpen || ui.settingsOpen || showComplete) return;
    const plain = !ev.ctrlKey && !ev.metaKey && !ev.altKey;
    if (game.kind === 'inscription' && game.reading && plain) {
      // Kotouče jdou nastavit i z klávesnice: číslice se přidávají zprava.
      if (/^[0-9]$/.test(ev.key)) {
        ev.preventDefault();
        game.typeDigit(Number(ev.key));
        sound.playTick();
        return;
      }
      if (ev.key === 'Backspace') {
        ev.preventDefault();
        game.eraseDigit();
        sound.playTick();
        return;
      }
      // Enter potvrdí kotouče i po kliknutí na šipku; jiná tlačítka (Potvrdit, Nápověda…) stiskne normálně.
      const target = ev.target as HTMLElement | null;
      const otherButton = target instanceof HTMLButtonElement && !target.closest('.dial');
      if (ev.key === 'Enter' && !otherButton) {
        ev.preventDefault();
        game.confirm();
        return;
      }
    }
    if (game.kind === 'cascade' && game.playing && plain && ev.key === 'Enter') {
      // Buňku vybranou klávesnicí přepne Enter sám; po kliknutí myší Enter výsledek potvrdí.
      const keyboardFocus = ev.target instanceof HTMLButtonElement && ev.target.matches(':focus-visible');
      if (!keyboardFocus) {
        ev.preventDefault();
        game.confirm();
        return;
      }
    }
    if (game.kind === 'tide' && game.playing && plain) {
      const keys: Record<string, TideOp> = { ArrowLeft: 'shl', ArrowRight: 'shr', '+': 'inc', '-': 'dec', '−': 'dec' };
      const op = keys[ev.key];
      if (op && game.level.config.ops.includes(op)) {
        ev.preventDefault();
        game.pull(op);
        return;
      }
    }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') {
      ev.preventDefault();
      game.undo();
    } else if (plain && ev.key.toLowerCase() === 'h') {
      game.useHint();
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="level" class:mixed={parts.length > 1}>
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'map' })} aria-label="Zpět na mapu">
      <Icon name="back" />
    </button>
    <div class="where">
      <span class="act carved hide-narrow">{act.title}</span>
      <h1 class="inlaid"><span class="code">{room.id}</span> {room.title}</h1>
    </div>
    <div class="tools">
      <button
        type="button"
        class="icon-btn"
        onclick={toggleSound}
        aria-label={settings.sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}
        title={settings.sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}
      >
        <Icon name={settings.sound ? 'sound-on' : 'sound-off'} />
      </button>
      <button type="button" class="icon-btn" onclick={() => (ui.settingsOpen = true)} aria-label="Nastavení" title="Nastavení">
        <Icon name="settings" />
      </button>
      <button type="button" class="btn btn-ghost kodex-btn" onclick={() => openKodex()}>
        <Icon name="book" />
        <span class="hide-narrow">Kodex</span>
        {#if unseenKodex().length > 0}<span class="new-dot" aria-label="nové záznamy"></span>{/if}
      </button>
    </div>
  </header>

  {#if parts.length > 1}
    <!-- Smíšená brána: kolik zkoušek je za hráčem a kolik před ním -->
    <ol class="trials" aria-label="Zkoušky brány">
      {#each parts as p, k (k)}
        <li class:done={k < partIndex || (k === partIndex && game.phase === 'solved')} class:now={k === partIndex}>
          <span class="dot" aria-hidden="true"></span>
          <span>{k + 1}. {p.title}</span>
        </li>
      {/each}
    </ol>
  {/if}

  <div class="stage" bind:this={stageEl}>
    {#key partIndex}
      {#if game.kind === 'altar'}
        <Altar {game} {pulse} />
      {:else if game.kind === 'inscription'}
        <Inscription {game} {pulse} onNudge={nudge} />
      {:else if game.kind === 'cascade'}
        <Cascade {game} {pulse} {wobble} />
      {:else}
        <Tide {game} {pulse} />
      {/if}
    {/key}
  </div>

  <div class="echo-row">
    <EchoBubble {echo} />
  </div>

  <footer class="actionbar wood">
    <button type="button" class="btn btn-ghost" onclick={() => game.undo()} disabled={!game.canUndo} title="Zpět (Ctrl+Z)">
      <Icon name="undo" /> Zpět
    </button>
    <button type="button" class="btn btn-ghost" onclick={restart} title="Začít komnatu znovu">
      <Icon name="restart" /> Znovu
    </button>
    <span class="spacer"></span>
    <button
      type="button"
      class="btn btn-ghost hint-btn"
      onclick={() => game.useHint()}
      disabled={game.phase !== 'play' || game.hintLevel >= 3}
      title="Nápověda (H)"
    >
      <Icon name="hint" /> Nápověda <span class="count">{game.hintLevel}/3</span>
    </button>
  </footer>

  <div class="visually-hidden" aria-live="polite">{announcement}</div>
  <FxLayer bind:this={fx} />
</div>

{#if showComplete && result}
  <LevelComplete
    level={room}
    {result}
    lines={solvedLines}
    {kodex}
    hasNext={next !== null}
    floorDone={isGate ? { numeral: act.numeral, next: next ? actOf(next).title : (act.nextAct?.title ?? null) } : null}
    onNext={() => next && go({ name: 'level', id: next })}
    onMap={() => go({ name: 'map' })}
    onReplay={restart}
  />
{/if}

<style>
  .level {
    --bar-h: 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr auto auto;
    min-height: 100dvh;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .level.mixed {
    grid-template-rows: auto auto 1fr auto auto;
  }
  .where {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .act {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  h1 {
    margin: 0;
    font-size: clamp(var(--fs-base), 4.2vw, var(--fs-2xl));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .code {
    margin-right: 0.4em;
    font-family: var(--font-mono);
    font-size: 0.64em;
    font-weight: 700;
    color: var(--stone-200);
    vertical-align: 0.1em;
  }
  .kodex-btn {
    position: relative;
    padding: 0 14px;
  }
  .kodex-btn .new-dot {
    position: absolute;
    top: 7px;
    right: 7px;
  }
  .stage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(14px, 3.5vh, 36px) 0;
  }
  .trials {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .trials li {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .trials .dot {
    width: 9px;
    height: 9px;
    transform: rotate(45deg);
    border: 1.5px solid var(--stone-200);
  }
  .trials .now {
    color: var(--text);
  }
  .trials .done .dot {
    background: var(--lumen);
    border-color: var(--lumen);
    box-shadow: 0 0 6px rgba(255, 217, 138, 0.7);
  }
  .echo-row {
    display: flex;
    justify-content: center;
    min-height: 76px;
    padding-bottom: 12px;
  }
  /* Na širší obrazovce zůstává Echo vždy vidět nad trámem, i když se scéna celá nevejde. */
  @media (min-width: 561px) {
    .echo-row {
      position: sticky;
      bottom: var(--bar-h);
      z-index: 4;
      pointer-events: none;
    }
    .echo-row > :global(*) {
      pointer-events: auto;
    }
  }
  /* Nízká obrazovka (např. 1366 × 768 s lištami prohlížeče): úspornější okraje. */
  @media (max-height: 820px) {
    .level {
      --bar-h: 58px;
    }
    .stage {
      padding: 6px 0;
    }
    .echo-row {
      min-height: 0;
      padding-bottom: 6px;
    }
  }
  /* Dřevěný trám s ovládáním */
  .actionbar {
    position: sticky;
    bottom: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 -16px;
    padding: 12px 16px 14px;
    border-radius: 6px 6px 0 0;
  }
  .actionbar::before,
  .actionbar::after {
    /* mosazné nýty */
    content: '';
    position: absolute;
    top: 50%;
    width: 9px;
    height: 9px;
    margin-top: -4.5px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #f6e2a6, #a8822f 60%, #4d3810);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
  }
  .actionbar::before {
    left: 6px;
  }
  .actionbar::after {
    right: 6px;
  }
  .spacer {
    flex: 1;
  }
  .count {
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  @media (min-width: 1212px) {
    .actionbar {
      margin: 0;
    }
  }
  @media (max-height: 820px) {
    .actionbar {
      padding-top: 7px;
      padding-bottom: 7px;
    }
  }
  @media (max-width: 560px) {
    .actionbar {
      gap: 6px;
    }
    .actionbar .btn {
      gap: 6px;
      padding: 0 10px;
    }
    .actionbar::before,
    .actionbar::after {
      display: none;
    }
  }
</style>
