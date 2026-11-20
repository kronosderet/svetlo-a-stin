<script lang="ts">
  import { untrack } from 'svelte';
  import { fly } from 'svelte/transition';
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import Rich from '../Rich.svelte';
  import { autofocus } from '../actions';
  import { ACTS, basicRooms } from '../../content/levels';
  import { shuffleOptions } from '../../content/random';
  import type { QuizQuestion } from '../../content/types';
  import { enterThroughDoors } from '../../game/doors.svelte.ts';
  import { go } from '../../game/nav.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';
  import { plural } from '../../game/text';
  import * as sound from '../../audio/sound';

  /**
   * Schody mezi patry: karta patra (jméno, věta z příběhu, co čeká) a Strážce schodů,
   * tři rychlé otázky ze zákonů, které hráč už zná. Bez pečetí a dá se přeskočit: jde jen o to,
   * aby se staré zákony nevypařily (čtení čísel z Předsíně potřebuje celá Hlubina).
   */
  let { act: index }: { act: number } = $props();

  const act = untrack(() => ACTS[index] ?? ACTS[0]);
  const prev = untrack(() => ACTS[index - 1] ?? null);
  const first = `${act.numeral}-0`;
  const rooms = basicRooms(act).filter((l) => l.id !== first);
  const questions: QuizQuestion[] = (act.review ?? []).map((q) => shuffleOptions(typeof q === 'function' ? q(Math.random) : q));
  const m = $derived(settings.reducedMotion ? 0 : 1);

  /** idle = karta patra, ask = otázky, done = Strážce pouští dál. */
  let phase: 'idle' | 'ask' | 'done' = $state('idle');
  let at = $state(0);
  let wrong: number[] = $state([]);
  let answered = $state(false);
  /** Kolik otázek hráč trefil napoprvé. */
  let clean = $state(0);

  const q = $derived(questions[at]);

  function answer(k: number) {
    if (answered || wrong.includes(k)) return;
    if (k === q.correct) {
      answered = true;
      if (wrong.length === 0) clean += 1;
      sound.playChime();
    } else {
      wrong = [...wrong, k];
      sound.playFail();
    }
  }

  function next() {
    if (at + 1 < questions.length) {
      at += 1;
      wrong = [];
      answered = false;
    } else phase = 'done';
  }

  /** Do patra se vstupuje kamennými dveřmi, stejně jako z komnaty do komnaty. */
  function enter() {
    enterThroughDoors({ name: 'level', id: first });
  }
</script>

<div class="stairs-screen">
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'map' })} aria-label="Zpět na mapu">
      <Icon name="back" />
    </button>
    <span class="place carved">Schody do patra {act.numeral}</span>
    <span class="spacer" aria-hidden="true"></span>
  </header>

  <article class="card panel" in:fly={{ y: 24, duration: 420 * m }}>
    <span class="seal" aria-hidden="true"><Glyph value={act.glyphBase} size={44} /></span>
    <p class="eyebrow carved">Patro {act.numeral} · {act.theme}</p>
    <h1 class="inlaid">{act.title}</h1>
    {#if act.lore}<p class="lore">{act.lore}</p>{/if}
    {#if act.preview}<p class="preview"><strong>Co tě čeká:</strong> {act.preview}</p>{/if}
    <ol class="rooms" aria-label="Komnaty základní cesty">
      {#each rooms as l (l.id)}<li><span class="code">{l.id}</span> {l.title}</li>{/each}
    </ol>

    {#if questions.length && prev}
      <section class="guard stone-inset" aria-labelledby="guard-title">
        <h2 id="guard-title" class="guard-title carved">Strážce schodů</h2>
        {#if phase === 'idle'}
          <!-- Otázky nejsou jen z minulého patra: čtení čísel z Předsíně se vrací i na schodech do III a IV. -->
          <p class="note">
            Než pustí dál, zeptá se na {questions.length}
            {plural(questions.length, 'zákon, který', 'zákony, které', 'zákonů, které')} už znáš. Bez pečetí, jen aby se
            staré zákony nevypařily.
          </p>
          <div class="actions">
            <button type="button" class="btn btn-ghost" onclick={enter}>Přeskočit</button>
            <button type="button" class="btn btn-primary" onclick={() => (phase = 'ask')} use:autofocus>Odpovídat</button>
          </div>
        {:else if phase === 'ask'}
          {#key at}
            <div class="quiz" in:fly={{ y: 12, duration: 300 * m }}>
              <p class="count carved">Otázka {at + 1} z {questions.length}</p>
              <p class="question"><Rich text={q.question} /></p>
              <div class="options" class:long={q.options.some((o) => o.length > 8)}>
                {#each q.options as opt, k (k)}
                  <button
                    type="button"
                    class="opt"
                    class:wrong={wrong.includes(k)}
                    class:right={answered && k === q.correct}
                    disabled={answered || wrong.includes(k)}
                    onclick={() => answer(k)}
                    use:autofocus={k === 0}
                  >
                    <Rich text={opt} />
                    {#if wrong.includes(k)}<span class="visually-hidden">(nesprávně)</span>{/if}
                  </button>
                {/each}
              </div>
              <div class="feedback" role="status">
                {#if answered}
                  <p class="ok"><Rich text={q.explain} /></p>
                  <button type="button" class="btn btn-primary" onclick={next} use:autofocus>
                    {at + 1 < questions.length ? 'Další otázka' : 'Hotovo'}
                  </button>
                {:else if wrong.length}
                  <p class="try"><Rich text={q.why?.[wrong[wrong.length - 1]] || q.hint} /></p>
                {/if}
              </div>
            </div>
          {/key}
        {:else}
          <p class="note" role="status">
            {clean === questions.length
              ? 'Strážce ustoupí. Všechno napoprvé: staré zákony držíš pevně.'
              : `Strážce ustoupí. Napoprvé ${clean} z ${questions.length}. Kdyby něco vypadlo, Kodex a Shrnutí patra to připomenou.`}
          </p>
          <div class="actions">
            <button type="button" class="btn btn-primary" onclick={enter} use:autofocus>Vstoupit do patra</button>
          </div>
        {/if}
      </section>
    {:else}
      <div class="actions">
        <button type="button" class="btn btn-primary" onclick={enter} use:autofocus>Vstoupit do patra</button>
      </div>
    {/if}
  </article>
</div>

<style>
  .stairs-screen {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 16px 48px;
  }
  .spacer {
    width: 44px;
  }
  .place {
    flex: 1;
    text-align: center;
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .card {
    position: relative;
    margin-top: 12px;
    padding: 28px clamp(16px, 4vw, 36px) 28px;
    text-align: center;
  }
  .seal {
    display: inline-grid;
    margin-bottom: 6px;
  }
  h1 {
    margin: 4px 0 10px;
    font-size: clamp(1.8rem, 5vw, 2.6rem);
  }
  .lore {
    max-width: 46ch;
    margin: 0 auto 12px;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--fs-lg);
    line-height: 1.4;
  }
  .preview {
    max-width: 56ch;
    margin: 0 auto 12px;
    color: var(--text-muted);
  }
  .preview strong {
    color: var(--text);
  }
  .rooms {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 14px;
    margin: 0 0 20px;
    padding: 0;
    list-style: none;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .rooms .code {
    font-family: var(--font-mono);
    color: var(--stone-200);
  }
  .guard {
    padding: 16px clamp(12px, 3vw, 22px) 18px;
    border-radius: 10px;
  }
  .guard-title {
    margin: 0 0 8px;
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--lumen);
  }
  .note {
    max-width: 52ch;
    margin: 0 auto 14px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .count {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .question {
    margin: 6px 0 14px;
    font-size: var(--fs-lg);
  }
  .options {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .options.long {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .opt {
    min-height: 52px;
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.75);
    border-radius: 6px;
    background-color: var(--stone-600);
    background-image: var(--tex-grain), linear-gradient(180deg, rgba(255, 236, 200, 0.14), rgba(0, 0, 0, 0.3));
    box-shadow:
      inset 0 1px 0 rgba(255, 236, 200, 0.2),
      inset 0 -4px 0 rgba(0, 0, 0, 0.4),
      0 4px 0 rgba(0, 0, 0, 0.55);
    font: inherit;
    font-weight: 700;
    color: var(--text);
    cursor: pointer;
  }
  .opt:disabled {
    cursor: default;
  }
  .opt.wrong {
    opacity: 0.45;
    text-decoration: line-through;
  }
  .opt.right {
    border-color: var(--ok);
    color: var(--ok);
  }
  .feedback p {
    margin: 12px 0 10px;
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
