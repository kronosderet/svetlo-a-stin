<script lang="ts">
  import { fly } from 'svelte/transition';
  import Rich from '../Rich.svelte';
  import { autofocus } from '../actions';
  import { settings } from '../../game/settings.svelte.ts';
  import { kodexById } from '../../content/kodex';
  import type { BaseGame } from '../../game/baseGame.svelte.ts';

  let { game }: { game: BaseGame } = $props();

  const q = $derived(game.question!);
  const total = $derived(game.level.quiz?.length ?? 0);
  /** Dlouhé odpovědi (věty, posloupnosti tahů) se řadí po dvou a menším písmem. */
  const long = $derived(q.options.some((o) => o.length > 8));
  /** Kvíz nese jméno zákona, který komnata přeloží do Kodexu (ve smíšené komnatě jméno celé komnaty). */
  const topic = $derived(game.level.quizTitle || (game.level.kodex && kodexById(game.level.kodex)?.ancientName) || game.level.title);
</script>

<div class="quiz panel" in:fly={{ y: 24, duration: settings.reducedMotion ? 0 : 420 }}>
  <p class="eyebrow carved">{topic} · otázka {game.quizIndex + 1} z {total}</p>
  <p class="question"><Rich text={q.question} /></p>
  <div class="options" class:long>
    {#each q.options as opt, k (k)}
      <button
        type="button"
        class="opt"
        class:wrong={game.quizWrong.includes(k)}
        class:right={game.quizAnswered && k === q.correct}
        disabled={game.quizAnswered || game.quizWrong.includes(k)}
        onclick={() => game.answer(k)}
        use:autofocus={k === 0}
      >
        <span class="opt-face"><Rich text={opt} /></span>
        {#if game.quizWrong.includes(k)}<span class="visually-hidden">(nesprávně)</span>{/if}
        {#if game.quizAnswered && k === q.correct}<span class="visually-hidden">(správně)</span>{/if}
      </button>
    {/each}
  </div>
  <div class="feedback" role="status">
    {#if game.quizAnswered}
      <p class="ok"><Rich text={q.explain} /></p>
      <button type="button" class="btn btn-primary" onclick={() => game.continueQuiz()} use:autofocus>
        {game.quizIndex + 1 < total ? 'Další otázka' : 'Otevřít komnatu'}
      </button>
    {:else if game.quizWrong.length > 0}
      <!-- Typická chyba má vlastní vysvětlení, jinak společná nápověda. -->
      <p class="try"><Rich text={q.why?.[game.quizWrong[game.quizWrong.length - 1]] || q.hint} /></p>
    {/if}
  </div>
</div>

<style>
  .quiz {
    width: min(580px, 100%);
    padding: 18px 22px 20px;
    text-align: center;
  }
  .question {
    margin: 8px 0 16px;
    font-size: var(--fs-lg);
  }
  .options {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  /* Kamenné dlaždice, které se po stisku zasunou */
  .opt {
    min-height: 62px;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.75);
    border-radius: 6px;
    background-color: var(--stone-600);
    background-image: var(--tex-grain), linear-gradient(180deg, rgba(255, 236, 200, 0.14), rgba(0, 0, 0, 0.3));
    background-size:
      240px 240px,
      100% 100%;
    box-shadow:
      inset 0 1px 0 rgba(255, 236, 200, 0.2),
      inset 0 -4px 0 rgba(0, 0, 0, 0.4),
      0 4px 0 rgba(0, 0, 0, 0.55);
    cursor: pointer;
    transition:
      transform var(--t-fast),
      box-shadow var(--t-fast),
      filter var(--t-fast);
  }
  .opt-face {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    font-weight: 700;
    color: var(--text);
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.7);
  }
  .long {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .long .opt {
    min-height: 52px;
    padding: 6px 12px;
  }
  .long .opt-face {
    font-size: var(--fs-md);
  }
  .opt:hover:not(:disabled) {
    filter: brightness(1.15);
  }
  .opt:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow:
      inset 0 3px 6px rgba(0, 0, 0, 0.6),
      0 1px 0 rgba(0, 0, 0, 0.55);
  }
  .opt:disabled {
    cursor: default;
  }
  .opt.wrong {
    transform: translateY(4px);
    opacity: 0.45;
    box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.7);
  }
  .opt.wrong .opt-face {
    text-decoration: line-through;
  }
  .opt.right {
    transform: translateY(3px);
    border-color: var(--ok);
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.5),
      0 0 18px rgba(127, 207, 180, 0.45);
  }
  .opt.right .opt-face {
    color: var(--ok);
  }
  .feedback {
    min-height: 1.5em;
  }
  .feedback p {
    margin: 14px 0 12px;
  }
  .ok {
    color: var(--text);
  }
  .try {
    color: var(--text-muted);
  }
  @media (max-width: 460px) {
    .options {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
