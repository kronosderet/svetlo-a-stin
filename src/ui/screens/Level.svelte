<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { fade } from 'svelte/transition';
  import Altar from '../altar/Altar.svelte';
  import LevelComplete from '../altar/LevelComplete.svelte';
  import Inscription from '../inscription/Inscription.svelte';
  import Cascade from '../cascade/Cascade.svelte';
  import Tide from '../tide/Tide.svelte';
  import Gate from '../gate/Gate.svelte';
  import Desk from '../gate/Desk.svelte';
  import Mask from '../gate/Mask.svelte';
  import Workshop from '../machine/Workshop.svelte';
  import EchoBubble from '../EchoBubble.svelte';
  import FxLayer, { type Area, type Point } from '../FxLayer.svelte';
  import Icon from '../Icon.svelte';
  import { ACTS, GATE, actOf, advancedRooms, getLevel, instantiate, nextLevelId, partsOf, roomNumber } from '../../content/levels';
  import type { PuzzleLevel } from '../../content/types';
  import { kodexById } from '../../content/kodex';
  import { patternWords, toBinaryString } from '../../core/bits';
  import { AltarGame } from '../../game/altarGame.svelte.ts';
  import { combineResults, type GameEvent, type LevelResult } from '../../game/baseGame.svelte.ts';
  import { CascadeGame } from '../../game/cascadeGame.svelte.ts';
  import { InscriptionGame } from '../../game/inscriptionGame.svelte.ts';
  import { TideGame } from '../../game/tideGame.svelte.ts';
  import { GateGame } from '../../game/gateGame.svelte.ts';
  import { TableGame } from '../../game/tableGame.svelte.ts';
  import { MaskGame } from '../../game/maskGame.svelte.ts';
  import { MachineGame } from '../../game/machineGame.svelte.ts';
  import { Echo } from '../../game/echo.svelte.ts';
  import { browse } from '../../game/browse.svelte.ts';
  import { FX, fxState } from '../../game/fx.svelte.ts';
  import { enterThroughDoors } from '../../game/doors.svelte.ts';
  import { go, openKodex, ui } from '../../game/nav.svelte.ts';
  import { isCompleted, isUnlocked, progress, recordEntry, recordHint, recordResult, unseenKodex } from '../../game/progress.svelte.ts';
  import { saveSettings, settings } from '../../game/settings.svelte.ts';
  import { plainText } from '../../game/text';
  import * as sound from '../../audio/sound';
  import { freshFlags, type LevelCtx } from './level/context';
  import { onAltar } from './level/altarEvents';
  import { onInscription } from './level/inscriptionEvents';
  import { onCascade } from './level/cascadeEvents';
  import { onTide } from './level/tideEvents';
  import { onGate, onTable } from './level/gateEvents';
  import { onMask } from './level/maskEvents';
  import { onMachine } from './level/machineEvents';
  import { puzzleKey } from './level/keys';

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

  const bitsOf = (l: PuzzleLevel): number => {
    if (l.kind === 'cascade') return l.config.width;
    if (l.kind === 'gate' || l.kind === 'table') return l.config.tasks[0].circuit.inputs.length;
    if (l.kind === 'mask') return l.config.bits;
    if (l.kind === 'machine') return l.config.tasks[0].machine.inputs.length;
    return l.config.bits;
  };
  /** Aktuální část komnaty (u obyčejné komnaty celá komnata). */
  let partIndex = $state(0);
  let level: PuzzleLevel = parts[0];
  let bits = bitsOf(level);
  const partResults: LevelResult[] = [];
  /** Výsledek celé komnaty (u smíšené součet všech částí). */
  let result: LevelResult | null = $state(null);
  /** Po bráně patra: první nehotová Hlubší síň, do které už jde vstoupit. */
  const deepId = $derived(isGate && result ? (advancedRooms(act).find((l) => !isCompleted(l.id) && isUnlocked(l.id))?.id ?? null) : null);

  let announcement = $state('');
  let pulse = $state(0);
  let showComplete = $state(false);
  /** Komnata je otevřená: výsledek je zapsaný a hráč si v ní může dál zkoušet (volná hra). */
  let ready = $state(false);
  /**
   * Hráč se z vítězné desky vrátil do otevřené komnaty. Jen pak je na trámu tlačítko Pokračovat,
   * kterým se k desce vrátí. Po vyřešení se deska ukáže sama.
   */
  let returned = $state(false);
  /** Po vyřešení se ještě chvíli dívá na hotovou hádanku (vlna světla, poslední úloha), pak přijde deska. */
  let resultTimer: ReturnType<typeof setTimeout> | undefined;
  const READY_LINE = 'Komnata je vyřešená. Experimentuj tu, jak dlouho chceš, a pak pokračuj.';
  let solvedLines: string[] = $state([]);
  let fx: FxLayer | undefined = $state();
  let stageEl: HTMLElement | undefined = $state();
  /** Roste s každým chybným potvrzením Kaskády (otřese sloupcem). */
  let wobble = $state(0);
  let partTimer: ReturnType<typeof setTimeout> | undefined;
  /** Po přechodu části: Echo samo přejde od závěru části k úvodu další, až se závěr dá přečíst. */
  let readTimer: ReturnType<typeof setTimeout> | undefined;

  const echo = new Echo();

  /**
   * Uvíznutí: kdo v úloze dvakrát chybuje, tomu se rozzáří tlačítko nápovědy (náznak nic nestojí).
   * Kdo dlouho nic neudělá, tomu Echo náznak řekne samo. Talentovaný hráč si toho nevšimne,
   * slabší nemusí umět o pomoc požádat.
   */
  const NUDGE_SLIPS = 2;
  const NUDGE_IDLE_MS = 45_000;
  let slips = 0;
  let lastActive = Date.now();
  let nudgeHint = $state(false);

  function watchSlips(e: GameEvent) {
    if (!('event' in e)) return;
    lastActive = Date.now();
    const ev = e.event as { type: string; correct?: boolean };
    if (ev.type === 'step' || ev.type === 'complete') {
      slips = 0;
      nudgeHint = false;
    } else if (ev.type === 'wrong' || ev.type === 'reset' || (ev.type === 'pick' && ev.correct === false)) {
      slips += 1;
      if (slips >= NUDGE_SLIPS) nudgeHint = true;
    }
  }

  $effect(() => {
    const poke = () => (lastActive = Date.now());
    const timer = setInterval(() => {
      const busy = ui.kodexOpen || ui.settingsOpen || document.hidden || showComplete;
      if (busy || game.phase !== 'play' || game.hintLevel > 0) return poke();
      if (Date.now() - lastActive >= NUDGE_IDLE_MS) {
        poke();
        game.useHint();
      }
    }, 5000);
    addEventListener('pointerdown', poke);
    addEventListener('keydown', poke);
    return () => {
      clearInterval(timer);
      removeEventListener('pointerdown', poke);
      removeEventListener('keydown', poke);
    };
  });

  /**
   * Telefon na šířku: hádanka se posune nahoru (hlavička odjede nad okraj), ať je nad trámem vidět
   * celá. Stejně po další části komnaty a po otočení telefonu.
   */
  const PHONE_LANDSCAPE = '(max-height: 500px) and (orientation: landscape)';
  /** Hádanky skládané pod sebe (krystaly, nápis, sloupce, páky): celé se vejdou na výšku. */
  const TALL = ['altar', 'inscription', 'cascade', 'tide'];
  /** Výzva otočit telefon na výšku: krátce nahoře, když se hádanka na šířku nevejde. */
  let rotateTip = $state(false);
  let tipTimer: ReturnType<typeof setTimeout> | undefined;
  function showStage() {
    rotateTip = false;
    clearTimeout(tipTimer);
    if (!matchMedia(PHONE_LANDSCAPE).matches) return;
    tick().then(() => {
      stageEl?.scrollIntoView({ block: 'start', behavior: 'instant' });
      const content = stageEl?.firstElementChild?.getBoundingClientRect();
      const bar = document.querySelector('.actionbar')?.getBoundingClientRect();
      if (TALL.includes(game.kind) && content && bar && content.bottom > bar.top + 4) {
        rotateTip = true;
        tipTimer = setTimeout(() => (rotateTip = false), 7000);
      }
    });
  }
  $effect(() => {
    void partIndex;
    showStage();
  });
  $effect(() => {
    const mq = matchMedia(PHONE_LANDSCAPE);
    mq.addEventListener('change', showStage);
    return () => mq.removeEventListener('change', showStage);
  });

  /** Co potřebuje obsluha událostí jednotlivých archetypů (src/ui/screens/level). */
  const ctx: LevelCtx = {
    // Hra drží i zkoušku navíc, kterou brána přidá po ukázce kroku.
    level: () => game.level,
    bits: () => bits,
    echo,
    announce,
    words,
    failFx,
    stepFx,
    puff: (at, amount) => fx?.puff(at, amount),
    centerOf,
    stage: () => stageEl,
    pulse: () => (pulse += 1),
    wobble: () => (wobble += 1),
    said: freshFlags(),
  };

  let game = $state.raw(createGame());

  /**
   * Ukázka kroku slovy (Dílna a Brána): mění se s každým tahem, takže ji Echo po tahu řekne znovu,
   * třeba „Do zvýrazněného kamene patří Výluka…“ a nakonec „Stroj je hotový. Spusť Zkoušku.“
   */
  const stepText = $derived('stepHint' in game ? game.stepHint : null);
  let saidStep: string | null = null;
  $effect(() => {
    const text = stepText;
    if (!text || text === saidStep) return;
    saidStep = text;
    untrack(() => {
      echo.say([text], 'hint');
      announce(text);
    });
  });

  /** Dohrané části komnaty (u smíšené brány všechny, jinak jediná): ve volné hře se jimi listuje. */
  const finished: ReturnType<typeof createGame>[] = [];

  /** Volná hra: všechny úlohy komnaty po řadě, u smíšené brány přes všechny její části. */
  const browseList = $derived(ready ? finished.flatMap((g, p) => Array.from({ length: g.freeCount }, (_, k) => ({ p, k }))) : []);
  const browseAt = $derived(browseList.findIndex((e) => e.p === partIndex && e.k === game.freeAt));

  /** Volná hra: přejde na úlohu s daným pořadím. Ukáže se vyřešená a dá se s ní dál experimentovat. */
  function showTask(at: number) {
    const target = browseList[at];
    if (!target) return;
    if (target.p !== partIndex) {
      partIndex = target.p;
      level = parts[target.p];
      bits = bitsOf(level);
      ctx.said = freshFlags();
      game = finished[target.p];
    }
    game.freeShow(target.k);
    sound.playTick();
    announce(`Úloha ${at + 1} z ${browseList.length}${parts.length > 1 ? `: ${level.title}` : ''}.`);
  }

  // Kosočtverečky úloh nad hádankou podle tohohle ukážou šipky listování.
  $effect(() => {
    browse.total = browseList.length;
    browse.at = browseAt;
    browse.show = showTask;
  });
  $effect(() => () => {
    browse.total = 0;
    browse.show = null;
  });

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
      case 'gate':
        return new GateGame(level, handle);
      case 'table':
        return new TableGame(level, handle);
      case 'mask':
        return new MaskGame(level, handle);
      case 'machine':
        return new MachineGame(level, handle);
    }
  }

  echo.say(room.kind === 'mixed' ? [...room.echo.intro, ...level.echo.intro] : level.echo.intro);
  recordEntry(room.id);

  $effect(() => () => {
    clearTimeout(partTimer);
    clearTimeout(readTimer);
    clearTimeout(tipTimer);
    clearTimeout(resultTimer);
  });

  /**
   * Echo samo přejde na další repliku, až jde ta současná přečíst (vypisování a čtení zhruba 75 ms
   * na znak, aspoň 3 s), a tak dál až k replice s pořadím until. Klik na dál nebo nová replika ho zastaví.
   */
  function readOn(serial: number, until: number, elapsed = 0) {
    clearTimeout(readTimer);
    if (echo.index >= until) return;
    const ms = Math.max(3000, plainText(echo.current ?? '').length * 75) - elapsed;
    readTimer = setTimeout(
      () => {
        if (echo.serial !== serial || !echo.hasMore) return;
        echo.next();
        readOn(echo.serial, until);
      },
      Math.max(0, ms),
    );
  }

  /**
   * „Desku znám“ (III-2 až III-4): kdo zákon runy zná, smí zkoumání přeskočit. Desku pak vyplní
   * zpaměti, s lampou pod závojem, takže ji nemůže opsat z obvodu.
   */
  let knownBoard = false;
  const canKnow = $derived(
    !ready &&
      game.phase === 'play' &&
      game.kind === 'gate' &&
      level.kind === 'gate' &&
      level.config.tasks.every((t) => t.mode === 'explore') &&
      parts[partIndex + 1]?.kind === 'table',
  );
  function knowBoard() {
    if (!canKnow) return;
    knownBoard = true;
    game.skip();
  }

  /** Smíšená brána: po splněné části přijde další hádanka. */
  function nextPart() {
    const done = knownBoard ? ['Dobře. Desku napiš zpaměti, lampu zahalím.'] : level.echo.solved;
    if (done.length) echo.say(done);
    const doneSerial = echo.serial;
    const said = Date.now();
    pulse += 1;
    sound.playGrind(0.8);
    stepFx('.row', '.board', '.register', '.wall');
    announce(`Část ${partIndex + 1} z ${parts.length} splněna. ${done.map((t) => plainText(t, known)).join(' ')}`);
    partTimer = setTimeout(
      () => {
        finished[partIndex] = game;
        partIndex += 1;
        level = parts[partIndex];
        if (knownBoard && level.kind === 'table') {
          const pres = level.presentation;
          level = { ...level, presentation: { ...pres, veilLamp: true, task: `${pres.task} Lampa je pod závojem: piš zpaměti.` } };
          knownBoard = false;
        }
        bits = bitsOf(level);
        ctx.said = freshFlags();
        slips = 0;
        nudgeHint = false;
        game = createGame();
        // Závěr části často nese hlavní myšlenku („Stejná deska… Zrcadlo!“): úvod další části se
        // za něj jen přidá a Echo na něj přejde samo, až jde závěr přečíst (vypisování a čtení).
        if (done.length && echo.serial === doneSerial) {
          echo.add(level.echo.intro);
          readOn(doneSerial, done.length, Date.now() - said);
        } else echo.say(level.echo.intro);
        announce(`Část ${partIndex + 1} z ${parts.length}: ${level.title}. ${level.presentation.task}`);
      },
      settings.reducedMotion ? 400 : 1600,
    );
  }

  /** Slova, která Kodex už přeložil, čtečka přečte. */
  const known = (key: string) => progress.kodex.includes(key);

  function announce(text: string) {
    announcement = announcement === text ? `${text} ` : text;
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
    watchSlips(e);
    switch (e.kind) {
      case 'altar':
        onAltar(ctx, e.event, e.state);
        break;
      case 'inscription':
        onInscription(ctx, e.event, e.state);
        break;
      case 'cascade':
        onCascade(ctx, e.event, e.state);
        break;
      case 'tide':
        onTide(ctx, e.event, e.state);
        break;
      case 'gate':
        onGate(ctx, e.event, e.state);
        break;
      case 'table':
        onTable(ctx, e.event, e.state);
        break;
      case 'mask':
        onMask(ctx, e.event, e.state);
        break;
      case 'machine':
        onMachine(ctx, e.event, e.state);
        break;
      case 'hint': {
        nudgeHint = false;
        const step = e.level >= 3 ? stepText : null;
        if (step) saidStep = step;
        const text = (step ?? level.hints[e.level - 1]) + (e.extra ? ' Na konec pak přibude ještě jedna podobná zkouška, tu zkus bez ukázky.' : '');
        recordHint(room.id, e.level >= 3);
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
        const total = combineResults(partResults);
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
        // Vítězná deska přijde sama, jen co se hotová hádanka ukáže. Komnata zůstává otevřená:
        // z desky se do ní hráč může vrátit a dál v ní zkoušet.
        finished[partIndex] = game;
        ready = true;
        announce(`Komnata otevřena. ${solvedLines.map((t) => plainText(t, known)).join(' ')}`);
        resultTimer = setTimeout(autoResult, settings.reducedMotion ? RESULT_DELAY_CALM_MS : RESULT_DELAY_MS);
        break;
      }
    }
  }

  function nudge(wheel: number, delta: number) {
    if (game.kind !== 'inscription') return;
    game.nudge(wheel, delta);
    sound.playTick();
  }

  /**
   * Za jak dlouho po vyřešení přijde vítězná deska: poslední úloha zůstane chvíli na očích a doběhne
   * vlna světla (otřes scény při otevření komnaty trvá 1,1 s). Se zklidněným pohybem dřív.
   */
  const RESULT_DELAY_MS = 1300;
  const RESULT_DELAY_CALM_MS = 450;

  /**
   * Vítězná deska (výsledek, pečetě, cesta dál): po vyřešení sama, po návratu do komnaty tlačítkem
   * Pokračovat. Kamenné dveře se otevřou až cestou do další komnaty (enterThroughDoors).
   */
  function openResult() {
    clearTimeout(resultTimer);
    if (!result || showComplete) return;
    showComplete = true;
    sound.playReveal();
  }

  /** Deska sama po vyřešení: s otevřeným Kodexem nebo nastavením počká, až je hráč zavře (jinak by byla pod nimi). */
  function autoResult() {
    if (ui.kodexOpen || ui.settingsOpen) resultTimer = setTimeout(autoResult, 400);
    else openResult();
  }

  /** Z výsledku zpátky do vyřešené komnaty, ať v ní hráč může dál experimentovat. */
  function backToRoom() {
    showComplete = false;
    if (returned) return;
    returned = true;
    echo.say([READY_LINE]);
    announce('Zpátky v otevřené komnatě. Prvky si můžeš dál zkoušet, výsledek a pečetě ukáže tlačítko Pokračovat.');
  }

  /** Znovu: komnata se vytvoří od začátku (a u procvičování vylosuje nové úlohy). */
  function restart() {
    clearTimeout(partTimer);
    go({ name: 'level', id: room.id, run: Date.now() });
  }

  function toggleSound() {
    settings.sound = !settings.sound;
    saveSettings();
    if (settings.sound) sound.unlock();
  }

  /** Nadpis komnaty: po příchodu (dveřmi, z mapy, ze schodů, Znovu) na něj skočí fokus. */
  let titleEl: HTMLElement | undefined = $state();
  // Zaměřené tlačítko staré obrazovky zmizelo s ní a fokus spadl na <body>: čtečka by o nové komnatě
  // nic neřekla a Tab by začal od začátku stránky. Hádanka, která si fokus vzala sama, ho nechá.
  onMount(() => {
    const active = document.activeElement;
    if (!active || active === document.body) titleEl?.focus({ preventScroll: true });
  });

  function onKey(ev: KeyboardEvent) {
    if (ui.kodexOpen || ui.settingsOpen || showComplete) return;
    // Podržený Enter by potvrzoval pořád dokola (a z vítězné desky by přeskočil do nové komnaty).
    if (ev.repeat && ev.key === 'Enter') return;
    if (puzzleKey(game, ev)) {
      ev.preventDefault();
      return;
    }
    const plain = !ev.ctrlKey && !ev.metaKey && !ev.altKey;
    // V otevřené komnatě Enter pokračuje k výsledku, i dřív, než se deska ukáže sama
    // (tlačítka na desce si Enter nechávají).
    if (ready && plain && ev.key === 'Enter' && !(ev.target instanceof HTMLButtonElement)) {
      ev.preventDefault();
      openResult();
      return;
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
      <h1 class="inlaid" tabindex="-1" bind:this={titleEl}><span class="code">{room.id}</span> {room.title}</h1>
    </div>
    <div class="tools">
      <button
        type="button"
        class="icon-btn hide-xs"
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
        <li class:done={ready || k < partIndex || (k === partIndex && game.phase === 'solved')} class:now={k === partIndex}>
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
      {:else if game.kind === 'tide'}
        <Tide {game} {pulse} />
      {:else if game.kind === 'gate'}
        <Gate {game} {pulse} />
      {:else if game.kind === 'table'}
        <Desk {game} {pulse} />
      {:else if game.kind === 'machine'}
        <Workshop {game} {pulse} />
      {:else}
        <Mask {game} {pulse} />
      {/if}
    {/key}
  </div>

  {#if rotateTip}
    <button type="button" class="rotate-tip" onclick={() => (rotateTip = false)} transition:fade={{ duration: settings.reducedMotion ? 0 : 200 }}>
      <span class="turn"><Icon name="rotate" size={20} /></span> Tahle hádanka se celá vejde na výšku. Otoč telefon.
    </button>
  {/if}

  <div class="echo-row">
    <EchoBubble {echo} />
  </div>

  <footer class="actionbar wood">
    <button type="button" class="btn btn-ghost" onclick={() => game.undo()} disabled={!game.canUndo} title="Zpět (Ctrl+Z)">
      <Icon name="undo" /> <span class="label-xs">Zpět</span>
    </button>
    <button type="button" class="btn btn-ghost" onclick={restart} title="Začít komnatu znovu">
      <Icon name="restart" /> <span class="label-xs">Znovu</span>
    </button>
    <span class="spacer"></span>
    {#if canKnow}
      <!-- Kdo zákon runy zná (třeba z matematiky), přeskočí zkoumání a desku vyplní zpaměti. -->
      <button type="button" class="btn btn-ghost" onclick={knowBoard} title="Přeskočit zkoumání a vyplnit desku zákona zpaměti">
        Desku znám
      </button>
    {/if}
    {#if ready && returned}
      <!-- Hráč se z desky vrátil do vyřešené komnaty: k výsledku a pečetím pokračuje, až dozkoumá, co chce. -->
      <button type="button" class="btn btn-primary continue" onclick={openResult} title="Výsledek, pečetě a cesta dál (Enter)">
        Pokračovat <Icon name="check" />
      </button>
    {:else}
      <button
        type="button"
        class="btn btn-ghost hint-btn"
        class:nudge={nudgeHint && game.hintLevel === 0 && game.phase === 'play'}
        onclick={() => game.useHint()}
        disabled={game.phase !== 'play' || game.hintLevel >= 3}
        title="Nápověda (H)"
      >
        <Icon name="hint" /> Nápověda <span class="count">{game.hintLevel}/3</span>
      </button>
    {/if}
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
    onDeep={deepId ? () => enterThroughDoors({ name: 'level', id: deepId! }) : undefined}
    onNext={() => next && enterThroughDoors(isGate ? { name: 'stairs', act: ACTS.indexOf(actOf(next)) } : { name: 'level', id: next })}
    onMap={() => go({ name: 'map' })}
    onReplay={restart}
    onBack={backToRoom}
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
  /* Fokus na nadpisu je jen pro čtečku a klávesnici, rámeček nepotřebuje. */
  h1:focus {
    outline: none;
  }
  .code {
    margin-right: 0.4em;
    font-family: var(--font-mono);
    font-size: max(0.64em, 12px);
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
  /* Na širší obrazovce zůstává Echo vždy vidět nad trámem, i když se scéna celá nevejde.
     Telefon na šířku (nízká obrazovka) to nedělá: Echo by zakrylo skoro celou desku. */
  @media (min-width: 561px) and (min-height: 501px) {
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
  /* Po dvou chybách se nápověda nabídne mosaznou září (s omezenými animacemi zůstane záře stát). */
  .hint-btn.nudge {
    border-color: var(--brass);
    box-shadow: 0 0 0 2px rgba(201, 162, 74, 0.55), 0 0 18px rgba(242, 193, 78, 0.45);
    animation: nudge 1.8s ease-in-out infinite;
  }
  @keyframes nudge {
    50% {
      box-shadow: 0 0 0 2px rgba(201, 162, 74, 0.25), 0 0 6px rgba(242, 193, 78, 0.15);
    }
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
  .rotate-tip {
    position: fixed;
    top: 8px;
    left: 50%;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: calc(100% - 32px);
    padding: 8px 14px;
    transform: translateX(-50%);
    border: 1.5px solid var(--brass);
    border-radius: 8px;
    background: rgba(29, 24, 19, 0.95);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    font-size: var(--fs-sm);
    color: var(--text);
    cursor: pointer;
  }
  /* Ikona ukazuje otočení na šířku, zrcadlově tedy na výšku. */
  .rotate-tip .turn {
    display: inline-flex;
    transform: scaleX(-1);
    color: var(--lumen);
  }
  /* Telefon na šířku: tenká hlavička i trám, ať zbude co nejvíc výšky pro hádanku. */
  @media (max-height: 500px) and (orientation: landscape) {
    .level {
      --bar-h: 46px;
    }
    .act {
      display: none;
    }
    h1 {
      font-size: var(--fs-lg);
    }
    .trials {
      margin-top: 0;
    }
    .stage {
      padding: 4px 0;
    }
    .actionbar {
      padding-top: 3px;
      padding-bottom: 3px;
    }
    .actionbar .btn {
      min-height: 38px;
    }
  }
  /* Úzký displej: název komnaty se zalomí do dvou řádků místo useknutí. */
  @media (max-width: 560px) {
    h1 {
      font-size: clamp(var(--fs-md), 4.6vw, var(--fs-xl));
      line-height: 1.15;
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
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
