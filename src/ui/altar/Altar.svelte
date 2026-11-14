<script lang="ts">
  import { fly } from 'svelte/transition';
  import CrystalRow, { type WeightState } from '../CrystalRow.svelte';
  import Disc from '../Disc.svelte';
  import Ledger from '../Ledger.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from './Quiz.svelte';
  import Tally from './Tally.svelte';
  import { combinations, isBitSet, patternWords, toBinaryString } from '../../core/bits';
  import { currentTarget } from '../../core/puzzles/altar';
  import { settings } from '../../game/settings.svelte.ts';
  import type { AltarGame } from '../../game/altarGame.svelte.ts';

  let { game, pulse }: { game: AltarGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const bits = $derived(cfg.bits);
  const st = $derived(game.state);
  const digits = $derived(level.presentation.showDigits || settings.alwaysDigits);
  const counter = $derived(!!level.presentation.counter);
  const target = $derived(currentTarget(cfg, st));
  const steps = $derived(cfg.goal.kind === 'all' ? [] : cfg.goal.targets);
  const solvedTargets = $derived(steps.slice(0, st.step));
  const shownPattern = $derived(target ?? steps[steps.length - 1] ?? 0);
  const slots = $derived(Array.from({ length: combinations(bits) }, (_, p) => p));
  /** Počítadlo: kolik poutníků už je vyrytých. */
  const counted = $derived(st.step > 0 ? steps[st.step - 1] : (cfg.initial ?? 0));
  const m = $derived(settings.reducedMotion ? 0 : 1);

  function weightState(i: number): WeightState {
    if (cfg.reveal === 'never') return settings.alwaysWeights && cfg.goal.kind === 'value' ? 'known' : 'hidden';
    return isBitSet(st.revealed, i) ? 'known' : 'unknown';
  }

  function crystalLabel(i: number, k: number): string {
    const known = weightState(i) === 'known';
    return `Krystal ${k + 1} zleva${known ? `, váha ${2 ** i}` : ''}`;
  }

  function patternLabel(mask: number): string {
    return digits ? `Kombinace ${toBinaryString(mask, bits)}` : `Kombinace: ${patternWords(mask, bits)}`;
  }
</script>

<div
  class="altar"
  class:with-ledger={level.presentation.ledger}
  class:solved={game.phase === 'solved'}
  style:--row-max="{Math.max(4, bits) * 100 + 40}px"
>
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <section class="main">
    <header class="task">
      <p class="task-text carved">{level.presentation.task}</p>

      <div class="side">
      {#if counter}
        <Tally count={counted} pending={!st.complete} />
      {:else if cfg.goal.kind === 'pattern'}
        <div class="tablet stone">
          <span class="tablet-label carved">Stěna</span>
          <span class="tablet-recess stone-inset">
            {#key shownPattern}
              <span class="tablet-pattern" in:fly={{ y: -18, duration: 420 * m }}>
                <MiniPattern mask={shownPattern} {bits} size="lg" {digits} label={patternLabel(shownPattern)} />
              </span>
            {/key}
          </span>
        </div>
      {:else if cfg.goal.kind === 'value'}
        <!-- Kamenné kolo oltáře se s každou přijatou váhou pootočí. -->
        <Disc value={target} turn={st.step * 60} label="Požadovaná váha" />
      {:else}
        <div class="registry stone" role="list" aria-label="Deska kombinací: nalezeno {st.found.length} z {slots.length}">
          {#each slots as p (p)}
            <div class="niche stone-inset" class:found={st.found.includes(p)} class:current={p === st.mask} role="listitem">
              {#if st.found.includes(p)}
                <span in:fly={{ y: -10, duration: 320 * m }}><MiniPattern mask={p} {bits} size="md" {digits} label={patternLabel(p)} /></span>
              {:else}
                <span class="niche-empty carved" aria-label="Nenalezeno">?</span>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      </div>

      {#if steps.length > 1}
        <Pips total={steps.length} done={st.step} />
      {/if}
    </header>

    <CrystalRow
      {bits}
      mask={st.mask}
      {weightState}
      sizes={level.presentation.sizes}
      {digits}
      highlight={game.hintTarget}
      disabled={game.phase !== 'play'}
      celebrate={game.phase === 'solved'}
      label="Krystaly"
      {crystalLabel}
      onToggle={(i) => game.toggle(i)}
    />

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if level.presentation.showSum}
      <div class="sum stone-inset">
        <span>Tvé světlo váží</span>
        <strong class="sum-value">{st.mask}</strong>
        {#if target !== null && st.mask !== target}
          {#if st.mask > target}
            <span class="delta over">o {st.mask - target} víc</span>
          {:else}
            <span class="delta under">chybí {target - st.mask}</span>
          {/if}
        {/if}
      </div>
    {/if}
  </section>

  {#if level.presentation.ledger}
    <Ledger
      values={solvedTargets}
      {bits}
      mode={counter ? 'flips' : 'sum'}
      start={cfg.initial ?? 0}
      empty={counter ? 'Zatím prázdný. Každého poutníka si sem zapíšeš.' : 'Zatím prázdný. Každou přijatou váhu si sem zapíšeš.'}
    />
  {/if}
</div>

<style>
  .altar {
    position: relative;
    width: 100%;
    display: grid;
    gap: var(--gap);
    align-items: center;
  }
  .altar.with-ledger {
    grid-template-columns: minmax(0, 1fr) 270px;
  }

  .pulse {
    position: absolute;
    inset: -12%;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 58%, rgba(255, 200, 110, 0.24), transparent 62%);
    animation: pulse 1s ease-out forwards;
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(16px, 3vh, 30px);
    min-width: 0;
  }
  .task {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }

  /* Kamenná deska s reliéfem ve stěně */
  .tablet {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 18px 16px;
  }
  .tablet-label {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--stone-200);
  }
  .tablet-recess {
    display: grid;
    place-items: center;
    min-width: 130px;
    min-height: 82px;
    padding: 12px 22px;
    overflow: hidden;
  }
  .tablet-pattern {
    grid-area: 1 / 1;
  }

  /* Výklenky pro kombinace (I-3) */
  .registry {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 12px;
  }
  .niche {
    display: grid;
    place-items: center;
    min-width: 70px;
    min-height: 64px;
    padding: 8px 6px;
    transition: box-shadow var(--t-med);
  }
  .niche.found {
    background-color: rgba(30, 20, 8, 0.55);
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.7),
      inset 0 0 18px rgba(242, 170, 70, 0.18),
      0 1px 0 rgba(255, 236, 200, 0.07);
  }
  .niche.found.current {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.7),
      inset 0 0 22px rgba(255, 200, 110, 0.4),
      0 0 0 1px rgba(255, 217, 138, 0.5);
  }
  .niche-empty {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--stone-400);
    font-size: var(--fs-base);
  }

  .sum {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 4px 12px;
    padding: 6px 18px;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .sum-value {
    min-width: 2ch;
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    color: var(--text);
  }
  .delta {
    padding: 1px 10px;
    border: 1px solid rgba(201, 185, 157, 0.35);
    border-radius: 4px;
    font-size: var(--fs-sm);
  }
  .delta.over {
    color: var(--warn);
    border-color: rgba(240, 149, 122, 0.5);
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* Nízká široká obrazovka (1366 × 768): zadání stojí vedle krystalů, ne nad nimi. */
  @media (min-width: 900px) and (max-height: 820px) {
    .main {
      display: grid;
      grid-template-columns: auto minmax(0, var(--row-max));
      justify-content: center;
      align-items: center;
      justify-items: center;
      column-gap: 36px;
      row-gap: 10px;
    }
    .main > :global(*) {
      grid-column: 1 / -1;
    }
    .task {
      display: contents;
    }
    .task-text {
      grid-column: 1 / -1;
      grid-row: 1;
    }
    .task > :global(.pips) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
    .side {
      grid-column: 1;
      grid-row: 3;
    }
    .main > :global(.row) {
      grid-column: 2;
      grid-row: 3 / span 2;
    }
    .sum {
      grid-column: 1;
      grid-row: 4;
    }
  }
  @media (max-width: 880px) {
    .altar.with-ledger {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 560px) {
    .registry {
      gap: 6px;
      padding: 8px;
    }
    .niche {
      min-width: 0;
      min-height: 56px;
    }
  }
</style>
