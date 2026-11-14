<script lang="ts">
  import { fly } from 'svelte/transition';
  import Board from './Board.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import { inputBit, rowCount } from '../../core/logic';
  import { evaluate } from '../../core/puzzles/gate';
  import { settings } from '../../game/settings.svelte.ts';
  import type { GateGame } from '../../game/gateGame.svelte.ts';

  let { game, pulse }: { game: GateGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const circuit = $derived(task.circuit);
  const n = $derived(circuit.inputs.length);
  const rows = $derived(Array.from({ length: rowCount(n) }, (_, r) => r));
  const modern = $derived(level.presentation.showDigits || settings.alwaysDigits);
  const explore = $derived(task.mode === 'explore');
  const m = $derived(settings.reducedMotion ? 0 : 1);
  const hl = $derived.by(() => {
    const h = game.hintTarget;
    if (!h) return null;
    return 'input' in h ? { input: h.input } : { node: h.node };
  });
  const lampAt = (r: number) => evaluate(circuit, view.runes, r)[circuit.output] ?? 0;
  const label = (r: number) => circuit.inputs.map((name, i) => `${name} ${inputBit(r, i, n) ? 'světlo' : 'stín'}`).join(', ');
</script>

<div class="gate">
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <header class="task">
    <p class="task-text carved">{level.presentation.task}</p>
    {#if cfg.tasks.length > 1}
      <Pips total={cfg.tasks.length} done={game.state.step} />
    {/if}
  </header>

  <div class="work">
    {#key task}
      <div class="board-wrap" in:fly={{ y: -12, duration: 360 * m }}>
        <Board
          {circuit}
          inputs={view.inputs}
          runes={view.runes}
          canToggle={game.playing}
          canPlace={game.playing && !explore}
          {modern}
          highlight={hl}
          celebrate={game.phase === 'solved'}
          onInput={(i) => game.toggleInput(i)}
          onSlot={(id) => game.cycleRune(id)}
        />
      </div>
    {/key}

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if explore}
      <!-- Deska objevů: každá vyzkoušená kombinace vstupů a co udělala lampa -->
      <div class="side">
        <p class="side-title carved">Vyzkoušeno {view.tried.length} z {rows.length}</p>
        <div class="registry stone" role="list" aria-label="Vyzkoušené kombinace">
          {#each rows as r (r)}
            {@const seen = view.tried.includes(r)}
            <div class="niche stone-inset" class:found={seen} class:current={r === view.inputs} role="listitem" aria-label={seen ? `${label(r)}: lampa ${lampAt(r) ? 'svítí' : 'mlčí'}` : 'Zatím nevyzkoušeno'}>
              {#if seen}
                <MiniPattern mask={r} bits={n} size="sm" digits={modern} />
                <span class="dot" class:on={lampAt(r) === 1} aria-hidden="true"></span>
              {:else}
                <span class="unknown carved" aria-hidden="true">?</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Deska zákona: kdy má lampa svítit. Po Zkoušce se nesedící řádky rozsvítí okrově. -->
      <div class="side">
        <p class="side-title carved">Brána žádá</p>
        <div class="tests stone" role="table" aria-label="Kdy má lampa svítit">
          <div class="trow head" role="row">
            {#each circuit.inputs as name (name)}<span role="columnheader">{name}</span>{/each}
            <span role="columnheader">lampa</span>
          </div>
          {#each rows as r (r)}
            <div class="trow" class:failed={view.failed?.includes(r)} class:live={r === view.inputs} role="row">
              {#each circuit.inputs as name, i (name)}
                <span class="bit" class:one={inputBit(r, i, n) === 1} role="cell">{modern ? inputBit(r, i, n) : inputBit(r, i, n) ? '●' : '○'}</span>
              {/each}
              <span role="cell"><span class="dot" class:on={task.target?.[r] === 1} aria-label={task.target?.[r] ? 'svítí' : 'mlčí'}></span></span>
            </div>
          {/each}
        </div>
        <button type="button" class="btn btn-primary btn-lg" onclick={() => game.test()} disabled={!game.playing}>Zkouška</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .gate {
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
    flex: 0 1 600px;
    min-width: 0;
    display: flex;
    justify-content: center;
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
  .registry {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 10px;
  }
  .niche {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 92px;
    min-height: 52px;
    padding: 6px 10px;
  }
  .niche.found.current {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 217, 138, 0.5);
  }
  .unknown {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--stone-400);
  }
  .dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #5c4214;
    background: #15100b;
  }
  .dot.on {
    background: radial-gradient(circle at 40% 35%, #fff6d8, #ffd27a 50%, #c98a2a);
    box-shadow: 0 0 8px rgba(255, 210, 130, 0.8);
  }
  .tests {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
  }
  .trow {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 40px;
    align-items: center;
    justify-items: center;
    min-height: 30px;
    border-radius: 6px;
  }
  .trow.head {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .trow.live {
    background: rgba(255, 236, 200, 0.06);
  }
  .trow.failed {
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
  @media (max-height: 820px) {
    .board-wrap {
      padding: 6px 0 18px;
    }
    .trow {
      min-height: 26px;
    }
  }
</style>
