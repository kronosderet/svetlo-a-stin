<script lang="ts">
  import { fly } from 'svelte/transition';
  import Board from './Board.svelte';
  import RuneIcon from './RuneIcon.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import { isBitSet } from '../../core/bits';
  import { inputBit, type Rune } from '../../core/logic';
  import { rowsOf, tableOf } from '../../core/puzzles/table';
  import { RUNE_KODEX, RUNE_MODERN, RUNE_NAME } from '../../content/runes';
  import { progress } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';
  import type { TableGame } from '../../game/tableGame.svelte.ts';

  let { game, pulse }: { game: TableGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const circuit = $derived(task.circuit);
  const n = $derived(circuit.inputs.length);
  const rows = $derived(Array.from({ length: rowsOf(task) }, (_, r) => r));
  const answer = $derived(tableOf(task));
  const modern = $derived(level.presentation.showDigits || settings.alwaysDigits);
  const fill = $derived(task.mode === 'fill');
  const hint = $derived(game.hintTarget);
  const m = $derived(settings.reducedMotion ? 0 : 1);

  const lit = (r: number) => (fill ? isBitSet(view.cells, r) : answer[r] === 1);
  const rowLabel = (r: number) => circuit.inputs.map((name, i) => `${name} ${inputBit(r, i, n)}`).join(', ');

  /** Moderní značka runy se ukáže, až ji Kodex přeloží (nebo když hráč chce vždy moderní zápis). */
  const translated = (r: Rune) => !!RUNE_MODERN[r] && (settings.alwaysDigits || progress.kodex.includes(RUNE_KODEX[r] ?? ''));

  /**
   * Obvod ukazuje kombinaci vstupů, kterou si hráč vybere: kliknutím na řádek desky (i na jeho buňku),
   * krystaly vstupů v obvodu, nebo klávesnicí. Najetí myší na řádek jeho kombinaci jen ukáže, po odjetí
   * se obvod vrátí na vybraný řádek. Sám se nepřepíná: hráč desku prochází svým tempem.
   */
  let selected = $state(0);
  let preview: number | null = $state(null);
  const shownRow = $derived(preview ?? selected);

  $effect(() => {
    void task;
    selected = 0;
    preview = null;
  });

  function toggleInput(i: number) {
    selected ^= 1 << (n - 1 - i);
    preview = null;
  }

  function choose(r: number) {
    selected = r;
    preview = null;
  }

  /** Klávesnice: šipky nahoru a dolů posouvají výběr po řádcích desky (fokus jde s ním). */
  function rowKey(e: KeyboardEvent, r: number) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = Math.max(0, Math.min(rows.length - 1, r + (e.key === 'ArrowDown' ? 1 : -1)));
    choose(next);
    const row = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('.drow:not(.head)')[next];
    (row?.querySelector<HTMLElement>('button') ?? row)?.focus();
  }
</script>

<div class="desk-room">
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <header class="task">
    <p class="task-text carved">{level.presentation.task}</p>
    <Pips total={cfg.tasks.length} done={game.state.step} />
  </header>

  <div class="work">
    {#key task}
      <div class="board-wrap" in:fly={{ y: -12, duration: 360 * m }}>
        <Board
          {circuit}
          inputs={shownRow}
          runes={{}}
          canPlace={false}
          {modern}
          veiled={!fill && !view.revealed}
          lampVeiled={fill && !!level.presentation.veilLamp && game.playing}
          canToggle
          onInput={toggleInput}
        />
      </div>
    {/key}

    <div class="side">
      <p class="side-title carved">Deska zákona</p>
      <p class="desk-note">Vyber řádek a obvod vlevo ukáže jeho kombinaci.</p>
      <div class="desk stone" role="table" aria-label="Deska zákona">
        <div class="drow head" role="row">
          <span role="columnheader" class="rowno" title="Řádek desky je dvojkové číslo: 10 = 2">#</span>
          {#each circuit.inputs as name (name)}<span role="columnheader">{name}</span>{/each}
          <span role="columnheader">lampa</span>
        </div>
        {#each rows as r (r)}
          <div
            class="drow"
            class:wrong={view.wrongRow === r}
            class:now={shownRow === r}
            role="row"
            tabindex="-1"
            onclick={() => choose(r)}
            onkeydown={(e) => rowKey(e, r)}
            onpointerenter={(e) => e.pointerType === 'mouse' && (preview = r)}
            onpointerleave={() => (preview = null)}
            onfocusin={() => choose(r)}
          >
            <!-- Řádek je dvojkové číslo ze vstupů (řádek 10 = 2): čtení z Předsíně se vrací. -->
            <span class="rowno" role="cell" aria-label="řádek {r}">{r}</span>
            {#each circuit.inputs as name, i (name)}
              <span class="bit" class:one={inputBit(r, i, n) === 1} role="cell">{modern ? inputBit(r, i, n) : inputBit(r, i, n) ? '●' : '○'}</span>
            {/each}
            <span role="cell">
              {#if fill}
                <button
                  type="button"
                  class="cell"
                  class:on={lit(r)}
                  class:hl={hint && 'row' in hint && hint.row === r}
                  disabled={!game.playing && !(game.free && fill)}
                  aria-pressed={lit(r)}
                  aria-label="{rowLabel(r)}: lampa {lit(r) ? 'svítí' : 'mlčí'}"
                  onclick={() => game.toggleCell(r)}
                ></button>
              {:else}
                <span class="cell static" class:on={lit(r)} role="img" aria-label="lampa {lit(r) ? 'svítí' : 'mlčí'}"></span>
              {/if}
            </span>
          </div>
        {/each}
      </div>

      {#if game.phase === 'play' && fill}
        <button type="button" class="btn btn-primary btn-lg" onclick={() => game.confirm()} disabled={!game.playing}>Potvrdit</button>
      {/if}
    </div>
  </div>

  {#if game.phase === 'play' && task.mode === 'identify'}
    <!-- Runy k výběru pod celou deskou: celá Zahrada jich má sedm. -->
    <div class="pick">
          <p class="side-title carved">Která runa je pod závojem?</p>
          <div class="choices" class:many={task.choices.length > 5} role="group" aria-label="Runy">
            {#each task.choices as rune (rune)}
              <button
                type="button"
                class="choice"
                class:wrong={view.wrongPicks.includes(rune)}
                class:hl={hint && 'rune' in hint && hint.rune === rune}
                disabled={!game.playing || view.wrongPicks.includes(rune)}
                onclick={() => game.pick(rune)}
              >
                <RuneIcon {rune} size={28} />
                <span>{RUNE_NAME[rune]}{#if translated(rune)}<span class="modern"> · {RUNE_MODERN[rune]}</span>{/if}</span>
              </button>
            {/each}
          </div>
    </div>
  {/if}

  {#if game.phase === 'quiz' && game.question}
    {#key game.quizIndex}
      <Quiz {game} />
    {/key}
  {/if}
</div>

<style>
  .desk-room {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 2vh, 20px);
  }
  .pulse {
    position: absolute;
    inset: -10%;
    pointer-events: none;
    background: radial-gradient(ellipse, rgba(255, 214, 140, 0.22), transparent 65%);
    animation: pulse 700ms ease-out forwards;
  }
  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .task {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .work {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px 40px;
    width: 100%;
  }
  .board-wrap {
    flex: 0 1 520px;
    min-width: 0;
    display: flex;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 14px 0 24px;
  }
  .side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .side-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .desk {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
  }
  .drow {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 44px;
    align-items: center;
    justify-items: center;
    min-height: 40px;
    border-radius: 6px;
  }
  /* Číslo řádku: malé a tlumené, ať neruší čtení vstupů. */
  .rowno {
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .drow.head .rowno {
    font-family: var(--font-mono);
  }
  .drow.head {
    min-height: 26px;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .desk-note {
    margin: -4px 0 2px;
    max-width: 26ch;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    text-align: center;
  }
  .drow[role='row']:not(.head) {
    cursor: pointer;
  }
  .drow {
    outline: none;
    transition: background var(--t-fast);
  }
  /* Řádek, jehož kombinaci právě ukazuje obvod vlevo. */
  .drow.now {
    background: rgba(255, 217, 138, 0.12);
    box-shadow: inset 0 0 0 1px rgba(255, 217, 138, 0.35);
  }
  .drow.wrong {
    background: rgba(240, 149, 122, 0.22);
    box-shadow: inset 0 0 0 1px var(--warn);
  }
  .bit {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--stone-400);
  }
  .bit.one {
    color: var(--lumen);
  }
  .cell {
    display: block;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid #5c4214;
    background: radial-gradient(circle at 40% 35%, #3a3026, #15100b 70%);
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .cell:disabled,
  .cell.static {
    cursor: default;
  }
  .cell.on {
    background: radial-gradient(circle at 40% 35%, #fff6d8, #ffd27a 45%, #c98a2a 80%);
    box-shadow: 0 0 10px rgba(255, 210, 130, 0.8);
  }
  .pick {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .choices {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    max-width: 480px;
  }
  .choice {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 4px 12px 4px 8px;
    border: 1px solid rgba(255, 236, 200, 0.18);
    border-radius: 8px;
    background: linear-gradient(160deg, #5a4f42, #3c342b);
    font: inherit;
    font-weight: 700;
    color: var(--text);
    cursor: pointer;
  }
  /* Celá Zahrada (sedm run): menší kameny, ať se vejdou do dvou řad. */
  .choices.many {
    max-width: 620px;
    gap: 6px;
  }
  .many .choice {
    min-height: 36px;
    padding: 2px 10px 2px 6px;
    font-size: var(--fs-sm);
  }
  .choice:hover:not(:disabled) {
    border-color: var(--lumen);
  }
  .choice.wrong {
    opacity: 0.45;
    text-decoration: line-through;
  }
  .modern {
    font-family: var(--font-mono);
    color: var(--lumen);
  }
  .hl {
    outline: 3px solid var(--ok);
    outline-offset: 3px;
  }
  /* Nízká obrazovka (1366 × 768 s lištami prohlížeče): hustší deska. */
  @media (max-height: 820px) {
    .board-wrap {
      padding: 6px 0 18px;
    }
    .drow {
      min-height: 32px;
    }
    .pick {
      gap: 4px;
    }
    .many .choice {
      min-height: 34px;
    }
    .side {
      gap: 8px;
    }
  }
  /* Menší políčka jen pro myš: na dotykové obrazovce zůstávají velká pro prst. */
  @media (max-height: 820px) and (pointer: fine) {
    .cell {
      width: 26px;
      height: 26px;
    }
  }
  /* Telefon na šířku: panel vedle desky (roluje uvnitř), deska se zmenší do zbylé šířky. */
  @media (max-height: 500px) and (orientation: landscape) {
    .task-text {
      font-size: var(--fs-sm);
    }
    .work {
      flex-wrap: nowrap;
      align-items: flex-start;
      gap: 14px;
    }
    .board-wrap {
      flex: 1 1 auto;
      padding: 0;
    }
    .side {
      flex: 0 1 260px;
      max-width: min(260px, 34vw);
      max-height: calc(100dvh - 52px);
      overflow-y: auto;
    }
  }
</style>
