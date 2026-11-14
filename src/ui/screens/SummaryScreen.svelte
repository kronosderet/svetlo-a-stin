<script lang="ts">
  import Arrow from '../Arrow.svelte';
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import Rich from '../Rich.svelte';
  import { ACTS, advancedRooms, basicRooms } from '../../content/levels';
  import { kodexById } from '../../content/kodex';
  import type { KodexEntry, LevelDef } from '../../content/types';
  import { go } from '../../game/nav.svelte.ts';
  import { progress } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';

  let { act: index }: { act: number } = $props();

  const act = $derived(ACTS[index] ?? ACTS[0]);
  /** Učitel vidí celé shrnutí, hráč jen zákony, které Kodex už přeložil. */
  const shown = (e: KodexEntry) => settings.teacher || progress.kodex.includes(e.id);
  const entries = (levels: LevelDef[]) =>
    levels.flatMap((l) => (l.kodex ? [kodexById(l.kodex)] : [])).filter((e): e is KodexEntry => !!e && shown(e));
  const basic = $derived(entries(basicRooms(act)));
  const deep = $derived(entries(advancedRooms(act)));
</script>

{#snippet laws(list: KodexEntry[])}
  <ol class="laws">
    {#each list as e (e.id)}
      <li>
        <span class="glyph"><Glyph value={e.glyph} size={26} /></span>
        <div>
          <p class="names">
            <strong class="ancient"><Rich text={e.ancientName} /></strong>
            <Arrow label="se překládá jako" />
            <strong><Rich text={e.modernName} /></strong>
          </p>
          <p><Rich text={e.modern} /></p>
          {#if e.formula}<p class="formula"><Rich text={e.formula} /></p>{/if}
        </div>
      </li>
    {/each}
  </ol>
{/snippet}

<div class="summary-screen">
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'map' })} aria-label="Zpět na mapu">
      <Icon name="back" />
    </button>
    <span class="place carved">Shrnutí patra</span>
    <button type="button" class="btn btn-ghost" onclick={() => window.print()}>
      <Icon name="print" /> Tisknout
    </button>
  </header>

  <article class="sheet parchment">
    <p class="eyebrow">Světlo &amp; Stín · Akt {act.numeral} · {act.theme}</p>
    <h1>{act.title}</h1>

    {#if basic.length === 0 && deep.length === 0}
      <p class="empty">Kodex zatím z tohoto patra nic nepřeložil. Zákony se tu objeví, jak budeš otevírat komnaty.</p>
    {/if}
    {#if basic.length}
      <h2>Základ</h2>
      {@render laws(basic)}
    {/if}
    {#if deep.length}
      <h2>Hlubší síně</h2>
      {@render laws(deep)}
    {/if}
  </article>
</div>

<style>
  .summary-screen {
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
    margin: 22px 0 6px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid rgba(92, 74, 51, 0.4);
    font-size: var(--fs-lg);
    color: var(--ink);
  }
  .empty {
    color: var(--ink-muted);
    font-style: italic;
  }
  .laws {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .laws li {
    display: flex;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(92, 74, 51, 0.18);
    break-inside: avoid;
  }
  .laws p {
    margin: 0 0 4px;
    font-size: var(--fs-md);
    line-height: 1.45;
  }
  .glyph {
    flex: none;
    padding-top: 2px;
    --umbra: rgba(61, 44, 12, 0.3);
    --lumen: #2e1f06;
  }
  .names {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
  }
  .ancient {
    font-family: var(--font-display);
    color: var(--ink-red);
  }
  .formula {
    font-family: var(--font-mono);
    font-size: var(--fs-sm) !important;
    color: var(--ink-muted);
  }
  @media print {
    .topbar {
      display: none;
    }
    .summary-screen {
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
  }
</style>
