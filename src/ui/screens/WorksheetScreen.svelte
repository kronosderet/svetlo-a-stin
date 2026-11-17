<script lang="ts">
  import { untrack } from 'svelte';
  import Icon from '../Icon.svelte';
  import Rich from '../Rich.svelte';
  import { ACTS, basicRooms, partsOf } from '../../content/levels';
  import { shuffleOptions, shuffled } from '../../content/random';
  import type { QuizItem, QuizQuestion } from '../../content/types';
  import { go } from '../../game/nav.svelte.ts';

  /**
   * Pracovní list k tisku: otázky z kvízů základní cesty patra, každý tisk s jinými čísly.
   * Na konci je klíč odpovědí pro učitele (na samostatné stránce). Krátký test bez hry na konci
   * hodiny rozliší, kdo bránou prošel autopilotem a kdo to umí.
   */
  let { act: index }: { act: number } = $props();

  const COUNT = 8;
  const act = untrack(() => ACTS[index] ?? ACTS[0]);
  const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

  /** Otázky základní cesty; losované generátory dávají při každém tisku jiná čísla. */
  function draw(): QuizQuestion[] {
    const items: QuizItem[] = basicRooms(act).flatMap((l) => partsOf(l).flatMap((p) => p.quiz ?? []));
    const picked = shuffled(Math.random, items).slice(0, COUNT);
    return picked.map((q) => shuffleOptions(typeof q === 'function' ? q(Math.random) : q));
  }

  let questions = $state(draw());
  let variant = $state(1);

  function another() {
    questions = draw();
    variant += 1;
  }
</script>

<div class="worksheet-screen">
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'map' })} aria-label="Zpět na mapu">
      <Icon name="back" />
    </button>
    <span class="place carved">Pracovní list</span>
    <button type="button" class="btn btn-ghost" onclick={another}>Jiná čísla</button>
    <button type="button" class="btn btn-ghost" onclick={() => window.print()}>
      <Icon name="print" /> Tisknout
    </button>
  </header>

  <article class="sheet parchment">
    <p class="eyebrow">Světlo &amp; Stín · Akt {act.numeral} · {act.theme} · varianta {variant}</p>
    <h1>{act.title}: pracovní list</h1>
    <p class="who">Jméno: <span class="line"></span> Třída: <span class="line short"></span></p>
    <p class="note">Bez hry, jen s tužkou. U každé otázky zakroužkuj jednu odpověď.</p>

    <ol class="questions">
      {#each questions as q, k (k)}
        <li>
          <p class="q"><Rich text={q.question} /></p>
          <ol class="options" class:long={q.options.some((o) => o.length > 10)}>
            {#each q.options as opt, j (j)}
              <li><span class="letter">{LETTERS[j]})</span> <Rich text={opt} /></li>
            {/each}
          </ol>
        </li>
      {/each}
    </ol>

    <section class="key">
      <h2>Klíč pro učitele · varianta {variant}</h2>
      <ol>
        {#each questions as q, k (k)}
          <li><strong>{LETTERS[q.correct]})</strong> <Rich text={q.options[q.correct]} /> · <Rich text={q.explain} /></li>
        {/each}
      </ol>
    </section>
  </article>
</div>

<style>
  .worksheet-screen {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 16px 48px;
  }
  .place {
    flex: 1;
    text-align: center;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    color: var(--text-muted);
    text-transform: uppercase;
  }
  .sheet {
    margin-top: 22px;
    padding: clamp(18px, 4vw, 40px);
    border-radius: 4px;
    color: var(--ink);
  }
  .eyebrow {
    color: var(--ink-muted);
  }
  h1 {
    margin: 4px 0 10px;
    font-size: var(--fs-2xl);
    color: var(--ink);
  }
  h2 {
    margin: 0 0 8px;
    font-size: var(--fs-lg);
    color: var(--ink);
  }
  .who {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 10px;
  }
  .line {
    display: inline-block;
    width: 220px;
    border-bottom: 1px solid var(--ink-muted);
  }
  .line.short {
    width: 80px;
  }
  .note {
    color: var(--ink-muted);
    font-style: italic;
  }
  .questions {
    margin: 0;
    padding-left: 1.4em;
  }
  .questions > li {
    padding: 10px 0;
    border-bottom: 1px solid rgba(92, 74, 51, 0.18);
    break-inside: avoid;
  }
  .q {
    margin: 0 0 6px;
    font-size: var(--fs-md);
  }
  .options {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .options.long {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .letter {
    font-weight: 700;
  }
  .key {
    margin-top: 28px;
    padding-top: 12px;
    border-top: 2px dashed rgba(92, 74, 51, 0.4);
    font-size: var(--fs-sm);
  }
  .key ol {
    margin: 0;
    padding-left: 1.4em;
  }
  .key li {
    margin: 0 0 6px;
  }
  @media (max-width: 560px) {
    .options {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media print {
    .topbar {
      display: none;
    }
    .worksheet-screen {
      max-width: none;
      padding: 0;
    }
    .sheet {
      margin: 0;
      padding: 0;
      background: #fff;
      box-shadow: none;
      transform: none;
    }
    /* Klíč odpovědí na samostatné stránce, ať ho žáci nedostanou s listem. */
    .key {
      break-before: page;
      border-top: 0;
    }
  }
</style>
