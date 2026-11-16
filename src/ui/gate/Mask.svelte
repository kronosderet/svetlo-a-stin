<script lang="ts">
  import { fly } from 'svelte/transition';
  import CrystalRow from '../CrystalRow.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import RuneIcon from './RuneIcon.svelte';
  import { toBinaryString, toHex } from '../../core/bits';
  import { applyMask } from '../../core/puzzles/mask';
  import { RUNE_MODERN, RUNE_NAME } from '../../content/runes';
  import { settings } from '../../game/settings.svelte.ts';
  import type { MaskGame } from '../../game/maskGame.svelte.ts';

  let { game, pulse }: { game: MaskGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const bits = $derived(cfg.bits);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const result = $derived(applyMask(task.op, task.value, view.mask));
  const m = $derived(settings.reducedMotion ? 0 : 1);
  /** Rozšifrovaná zpráva: znak podle ASCII (když jde o písmeno). */
  const letter = $derived(view.done && task.key !== undefined && !task.encrypt && result >= 32 && result < 127 ? String.fromCharCode(result) : null);
  /** Popisky řádků: u šifry podle toho, jestli se šifruje, nebo rozšifrovává. */
  const topLabel = $derived(task.key === undefined ? 'Nápis' : task.encrypt ? 'Zpráva' : 'Šifra');
  const bottomLabel = $derived(task.key === undefined ? 'Výsledek' : task.encrypt ? 'Šifra' : 'Zpráva');
</script>

<div class="mask-room">
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <header class="task">
    <p class="task-text carved">{level.presentation.task}</p>
    <Pips total={cfg.tasks.length} done={game.state.step} />
    {#if task.say}
      {#key task}
        <p class="say" in:fly={{ y: -8, duration: 300 * m }}>{task.say}</p>
      {/key}
    {/if}
  </header>

  <div class="work">
    <div class="mask-rows stone">
      <div class="mrow">
        <span class="mlabel carved">{topLabel}</span>
        <MiniPattern mask={task.value} {bits} size="lg" digits={true} label="Nápis {toBinaryString(task.value, bits)}" />
      </div>
      <div class="mrow op">
        <span class="mlabel carved">Runa</span>
        <span class="op-rune"><RuneIcon rune={task.op} size={26} /> {RUNE_NAME[task.op]} · <span class="modern">{RUNE_MODERN[task.op]}</span></span>
      </div>
      <div class="mrow mask-line">
        <span class="mlabel carved">Maska</span>
        <div class="crystals">
          <CrystalRow
            {bits}
            mask={view.mask}
            weightState={() => 'hidden'}
            digits={true}
            highlight={game.hintTarget}
            disabled={!game.playing && !game.free}
            celebrate={game.phase === 'solved'}
            label="Maska"
            crystalLabel={(i, k) => `Krystal masky ${k + 1} zleva`}
            onToggle={(i) => game.toggle(i)}
          />
        </div>
      </div>
      <div class="rule" aria-hidden="true"></div>
      <div class="mrow">
        <span class="mlabel carved">{bottomLabel}</span>
        <MiniPattern mask={result} {bits} size="lg" digits={true} label="Výsledek {toBinaryString(result, bits)}" />
      </div>
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else}
      <div class="side">
        {#if task.key !== undefined}
          <p class="side-title carved">Klíč</p>
          <div class="goal stone-inset">
            <MiniPattern mask={task.key} {bits} size="md" digits={true} label="Klíč {toBinaryString(task.key, bits)}" />
            <span class="hex">{toHex(task.key, Math.ceil(bits / 4))}</span>
          </div>
          {#if letter}
            <p class="side-title carved">Rozšifrováno</p>
            <span class="letter" in:fly={{ y: 10, duration: 400 * m }}>{letter}</span>
          {/if}
        {:else if task.target !== undefined}
          <p class="side-title carved">Oltář žádá</p>
          <div class="goal stone-inset">
            <MiniPattern mask={task.target} {bits} size="md" digits={true} label="Cíl {toBinaryString(task.target, bits)}" />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .mask-room {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.6vh, 18px);
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
    gap: 8px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .say {
    margin: 0;
    font-weight: 700;
    color: var(--text);
  }
  .work {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px 40px;
    width: 100%;
  }
  .mask-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: min(100%, 640px);
    padding: 12px 18px;
    border-radius: 14px;
  }
  .mrow {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    align-items: center;
    justify-items: center;
  }
  .mlabel {
    justify-self: start;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .op-rune {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--lumen);
  }
  .modern {
    font-family: var(--font-mono);
  }
  .crystals {
    width: 100%;
  }
  .rule {
    height: 2px;
    margin: 2px 0;
    background: rgba(255, 236, 200, 0.18);
  }
  .side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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
  .goal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
  }
  .hex {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--lumen);
  }
  .letter {
    font-family: var(--font-display);
    font-size: var(--fs-3xl);
    font-weight: 700;
    color: var(--lumen);
    text-shadow: 0 0 12px rgba(255, 210, 130, 0.6);
  }
  @media (max-height: 820px) {
    .mask-rows {
      gap: 4px;
      padding: 8px 14px;
    }
  }
</style>
