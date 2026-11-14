<script lang="ts">
  import { untrack } from 'svelte';
  import { fly } from 'svelte/transition';
  import CrystalRow, { type WeightState } from '../CrystalRow.svelte';
  import Disc from '../Disc.svelte';
  import Ledger from '../Ledger.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import Dial from './Dial.svelte';
  import { isBitSet, maxValue, patternWords, toBinaryString } from '../../core/bits';
  import { FX } from '../../game/fx.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';
  import type { InscriptionGame } from '../../game/inscriptionGame.svelte.ts';

  let { game, pulse, onNudge }: { game: InscriptionGame; pulse: number; onNudge: (wheel: number, delta: number) => void } =
    $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const bits = $derived(cfg.bits);
  const st = $derived(game.state);
  const task = $derived(game.task);
  /** Poslední úloha zůstává vidět i po dokončení (kvíz, výsledek). */
  const shownTask = $derived(task ?? cfg.tasks[cfg.tasks.length - 1]);
  const reading = $derived(shownTask.dir === 'read');
  const digits = $derived(level.presentation.showDigits || settings.alwaysDigits);
  const solvedValues = $derived(cfg.tasks.slice(0, st.step).map((t) => t.value));
  const taskText = $derived(reading ? level.presentation.task : (level.presentation.writeTask ?? level.presentation.task));
  const m = $derived(settings.reducedMotion ? 0 : 1);

  let readerEl: HTMLElement | undefined = $state();

  // Chybné čtení: kotouče se zaseknou a zarachotí, zámek nepovolil.
  $effect(() => {
    const n = st.mistakes;
    untrack(() => {
      if (!n || settings.reducedMotion || !readerEl) return;
      const s = FX.dialRattle;
      readerEl.animate(
        [
          [0, 0],
          [-10, -1],
          [9, 0.8],
          [-6, 0],
          [3, 0],
          [0, 0],
        ].map(([x, r]) => ({ transform: `translateX(${x * s}px) rotate(${r * s}deg)` })),
        { duration: 480, easing: 'ease-out' },
      );
    });
  });

  function weightState(i: number): WeightState {
    if (settings.alwaysWeights) return 'known';
    return game.hintWeights && isBitSet(game.mask, i) ? 'known' : 'hidden';
  }

  function words(mask: number): string {
    return digits ? toBinaryString(mask, bits) : patternWords(mask, bits);
  }

  function crystalLabel(i: number, k: number): string {
    const weight = weightState(i) === 'known' ? `, váha ${2 ** i}` : '';
    if (reading) return `Nápis, krystal ${k + 1} zleva: ${isBitSet(game.mask, i) ? 'světlo' : 'stín'}${weight}`;
    return `Krystal ${k + 1} zleva${weight}`;
  }
</script>

<div class="inscription" class:with-ledger={level.presentation.ledger}>
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <section class="main">
    <header class="task">
      <p class="task-text carved">{taskText}</p>
      {#if !reading}
        <div class="side">
          <Disc value={task?.value ?? null} turn={st.step * 60} label="Brána žádá" />
        </div>
      {/if}
      {#if cfg.tasks.length > 1}
        <Pips total={cfg.tasks.length} done={st.step} />
      {/if}
    </header>

    <!-- Při čtení krystaly rozsvítí chrám: jsou zasazené ve stěně a nejdou přepnout. -->
    <div class="wall" class:reading>
      {#if reading}<span class="wall-label carved">Nápis</span>{/if}
      <CrystalRow
        {bits}
        mask={game.mask}
        {weightState}
        sizes={level.presentation.sizes}
        {digits}
        highlight={game.hintTarget}
        disabled={!game.writing}
        celebrate={game.phase === 'solved'}
        label={reading ? `Nápis: ${words(game.mask)}` : 'Krystaly'}
        {crystalLabel}
        onToggle={(i) => game.toggle(i)}
      />
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if game.reading}
      <div class="reader side" bind:this={readerEl}>
        <Dial value={st.dial} wheels={game.wheels} {onNudge} />
        <button type="button" class="btn btn-primary btn-lg" onclick={() => game.confirm()}>Potvrdit</button>
      </div>
      <p class="keys hide-narrow">Číslo můžeš i napsat na klávesnici a potvrdit klávesou Enter.</p>

      {#if st.lastGuess !== null && task}
        {#key st.moves}
          <div class="compare stone-inset" in:fly={{ y: 12, duration: 300 * m }} role="status">
            {#if st.lastGuess > maxValue(bits)}
              <p>Číslo {st.lastGuess} se do {bits} krystalů nevejde. Nejvíc unesou {maxValue(bits)}.</p>
            {:else}
              <p class="cmp-title">Kotouče nezapadly. Porovnej obrazce:</p>
              <div class="cmp-grid">
                <span class="cmp-name">nápis</span>
                <MiniPattern mask={task.value} {bits} size="md" {digits} label="Nápis: {words(task.value)}" />
                <span class="cmp-name">{st.lastGuess}</span>
                <MiniPattern mask={st.lastGuess} {bits} size="md" {digits} label="{st.lastGuess} by svítilo: {words(st.lastGuess)}" />
              </div>
            {/if}
          </div>
        {/key}
      {/if}
    {/if}
  </section>

  {#if level.presentation.ledger}
    <Ledger
      values={solvedValues}
      {bits}
      empty={cfg.tasks.some((t) => t.dir === 'write')
        ? 'Zatím prázdný. Každou splněnou zkoušku si sem zapíšeš.'
        : 'Zatím prázdný. Každý přečtený nápis si sem zapíšeš.'}
    />
  {/if}
</div>

<style>
  .inscription {
    position: relative;
    width: 100%;
    display: grid;
    gap: var(--gap);
    align-items: center;
  }
  .inscription.with-ledger {
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
    gap: clamp(14px, 2.6vh, 26px);
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

  /* Výklenek ve zdi, do kterého chrám zasadil nápis */
  .wall {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 8px 8px;
    border-radius: 14px;
    transition:
      background-color var(--t-slow),
      box-shadow var(--t-slow);
  }
  .wall.reading {
    width: min(100%, 600px);
    padding: 10px 18px 12px;
    background-color: rgba(10, 7, 4, 0.35);
    box-shadow:
      inset 0 4px 14px rgba(0, 0, 0, 0.65),
      inset 0 -1px 0 rgba(255, 236, 200, 0.06),
      0 1px 0 rgba(255, 236, 200, 0.08);
  }
  .wall-label {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--stone-200);
  }

  .reader {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px 22px;
  }
  .keys {
    margin: -6px 0 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  .compare {
    width: min(440px, 100%);
    padding: 10px 16px 12px;
    text-align: center;
    color: var(--text-muted);
  }
  .compare p {
    margin: 0;
  }
  .cmp-title {
    margin-bottom: 8px !important;
  }
  .cmp-grid {
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: end;
    gap: 8px 16px;
  }
  .cmp-name {
    justify-self: end;
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--text);
    font-size: var(--fs-base);
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* Nízká široká obrazovka (1366 × 768): kotouče stojí vedle nápisu, ne pod ním. */
  @media (min-width: 900px) and (max-height: 820px) {
    .main {
      display: grid;
      grid-template-columns: minmax(0, 600px) auto;
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
    .wall {
      grid-column: 1;
      grid-row: 3 / span 2;
    }
    .side {
      grid-column: 2;
      grid-row: 3;
    }
    .compare {
      grid-column: 2;
      grid-row: 4;
      width: min(360px, 100%);
      padding: 8px 12px 10px;
    }
    .keys {
      margin: 0;
    }
  }
  @media (max-width: 880px) {
    .inscription.with-ledger {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
