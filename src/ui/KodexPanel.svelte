<script lang="ts">
  import { tick, untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Glyph from './Glyph.svelte';
  import Arrow from './Arrow.svelte';
  import Icon from './Icon.svelte';
  import Rich from './Rich.svelte';
  import { KODEX, kodexById } from '../content/kodex';
  import { ACTS } from '../content/levels';
  import type { KodexEntry } from '../content/types';
  import { ui } from '../game/nav.svelte.ts';
  import { markKodexSeen, progress, unseenKodex } from '../game/progress.svelte.ts';
  import { settings } from '../game/settings.svelte.ts';

  let drawer: HTMLElement | undefined = $state();
  let fresh: string[] = $state([]);

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const translated = $derived(progress.kodex.length);
  /** Kodex po kapitolách: jedna kapitola za každé patro observatoře. */
  const chapters = ACTS.map((a) => ({
    numeral: a.numeral,
    title: a.title,
    entries: a.levels.flatMap((l) => (l.kodex ? [kodexById(l.kodex)] : [])).filter((e): e is KodexEntry => !!e),
  }));

  $effect(() => {
    if (!ui.kodexOpen) return;
    const focus = ui.kodexFocus;
    untrack(() => {
      fresh = unseenKodex();
      markKodexSeen();
    });
    tick().then(() => {
      drawer?.querySelector<HTMLElement>('.close')?.focus({ preventScroll: true });
      if (focus) {
        drawer?.querySelector<HTMLElement>(`[data-entry="${focus}"]`)?.scrollIntoView({ block: 'start' });
      }
    });
  });

  function close() {
    ui.kodexOpen = false;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && ui.kodexOpen) close();
  }
</script>

<svelte:window onkeydown={onKey} />

{#if ui.kodexOpen}
  <div class="layer">
    <button type="button" class="backdrop" tabindex="-1" aria-label="Zavřít Kodex" onclick={close} transition:fade={{ duration: 180 * m }}></button>
    <div
      class="drawer"
      bind:this={drawer}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kodex-title"
      transition:fly={{ x: 48, duration: 260 * m }}
    >
      <div class="pages parchment">
      <header>
        <div>
          <h2 id="kodex-title">Kodex</h2>
          <p class="sub">Překlad vědy Lumenitů · {translated} z {KODEX.length}</p>
        </div>
        <button type="button" class="icon-btn close" onclick={close} aria-label="Zavřít Kodex">
          <Icon name="close" />
        </button>
      </header>

      <div class="entries">
        {#each chapters as ch (ch.numeral)}
          <h3 class="chapter">Kapitola {ch.numeral} · {ch.title}</h3>
          {#if !ch.entries.some((e) => progress.kodex.includes(e.id))}
            <p class="chapter-locked">{ch.entries.length} nepřeložených stránek. Otevřou se v komnatách tohoto patra.</p>
          {:else}
        {#each ch.entries as entry (entry.id)}
          {#if progress.kodex.includes(entry.id)}
            <article class="entry" data-entry={entry.id}>
              <div class="entry-head">
                <span class="glyph-box"><Glyph value={entry.glyph} size={30} /></span>
                <h3>
                  <span class="ancient"><Rich text={entry.ancientName} /></span>
                  <span class="arrow"><Arrow label="se překládá jako" /></span>
                  <span class="modern"><Rich text={entry.modernName} /></span>
                </h3>
                {#if fresh.includes(entry.id)}<span class="badge">nové</span>{/if}
              </div>
              <p class="quote">„<Rich text={entry.ancient} />“</p>
              <p><Rich text={entry.modern} /></p>
              {#if entry.formula}<p class="formula"><Rich text={entry.formula} /></p>{/if}
              <p class="today"><strong>Dnes:</strong> <Rich text={entry.today} /></p>
            </article>
          {:else}
            <article class="entry locked">
              <div class="entry-head">
                <span class="glyph-box"><Glyph value={entry.glyph} size={30} /></span>
                <h3 class="unknown">Nepřeloženo</h3>
              </div>
            </article>
          {/if}
        {/each}
          {/if}
        {/each}
      </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .chapter {
    margin: 18px 0 4px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid var(--line-strong);
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--ink-muted);
    font-weight: 700;
  }
  .chapter:first-child {
    margin-top: 0;
  }
  .chapter-locked {
    margin: 6px 0 0;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-md);
    color: var(--ink-muted);
  }
  .layer {
    position: fixed;
    inset: 0;
    z-index: 40;
  }
  /* Kožená vazba badatelova Kodexu s pergamenovými listy */
  .drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(480px, 100vw);
    display: flex;
    padding: 14px 14px 14px 22px;
    background:
      var(--tex-grain),
      linear-gradient(90deg, #2a170b, #4a2a14 8%, #3b2110 60%, #2a170b);
    background-size:
      240px 240px,
      100% 100%;
    border-left: 2px solid #120a04;
    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
  }
  .drawer::before {
    /* prošití vazby */
    content: '';
    position: absolute;
    inset: 6px 6px 6px 10px;
    border: 1px dashed rgba(214, 170, 110, 0.45);
    border-radius: 6px;
    pointer-events: none;
  }
  .pages {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
  }
  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 14px 12px 22px;
    border-bottom: 2px solid rgba(92, 74, 51, 0.35);
  }
  h2 {
    margin: 0;
    font-size: var(--fs-xl);
    color: var(--ink);
  }
  .sub {
    margin: 2px 0 0;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  .close {
    color: var(--ink-muted);
  }
  .close:hover {
    color: var(--ink);
    background: rgba(92, 74, 51, 0.12);
    border-color: rgba(92, 74, 51, 0.35);
  }
  .entries {
    flex: 1;
    overflow-y: auto;
    padding: 6px 22px 32px;
    scroll-behavior: smooth;
  }
  .entry {
    padding: 18px 0;
    border-bottom: 1px dashed rgba(92, 74, 51, 0.4);
    scroll-margin-top: 8px;
  }
  .entry p {
    margin: 10px 0 0;
    max-width: 62ch;
    line-height: 1.55;
  }
  .entry-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .glyph-box {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1.5px solid rgba(92, 74, 51, 0.55);
    border-radius: 4px;
    background: rgba(255, 250, 235, 0.35);
  }
  h3 {
    flex: 1;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    font-size: var(--fs-lg);
  }
  .ancient {
    color: var(--ink-red);
  }
  .arrow {

    font-size: var(--fs-md);
    color: var(--ink-muted);
  }
  .modern {
    font-family: var(--font-body);
    font-size: var(--fs-md);
    font-weight: 700;
    letter-spacing: 0;
    color: var(--ink);
  }
  .badge {
    padding: 1px 8px;
    border: 1.5px solid var(--ink-red);
    border-radius: 3px;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-red);
    transform: rotate(-4deg);
  }
  .quote {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--fs-lg);
    color: var(--ink);
  }
  .formula {
    padding: 8px 12px;
    border: 1.5px solid rgba(92, 74, 51, 0.45);
    border-radius: 3px;
    background: rgba(255, 250, 235, 0.35);
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--ink-red);
  }
  .today {
    color: var(--ink-muted);
  }
  .today strong {
    color: var(--ink);
  }
  .locked .unknown {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-md);
    letter-spacing: 0;
    color: var(--ink-muted);
  }
  @media (max-width: 520px) {
    .drawer {
      padding: 8px;
    }
    .drawer::before {
      display: none;
    }
  }
</style>
