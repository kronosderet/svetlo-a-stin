<script lang="ts">
  import Glyph from './Glyph.svelte';
  import { segments } from '../game/text';
  import { progress } from '../game/progress.svelte.ts';

  let { text, visible = Infinity }: { text: string; visible?: number } = $props();

  const parts = $derived(segments(text));
</script>

{#each parts as seg, k (k)}{#if seg.kind === 'text'}{seg.value.slice(0, Math.max(0, visible - seg.start))}{:else if seg.key && progress.kodex.includes(seg.key)}<span class="deciphered" title="Přeloženo v Kodexu">{seg.value.slice(0, Math.max(0, visible - seg.start))}</span>{:else if visible > seg.start}<span class="garbled" role="img" aria-label="nečitelné slovo" title={seg.key ? 'Zatím nečitelné. Přeloží ho Kodex.' : 'Zatím nečitelné'}>{#each [...seg.value] as ch, j (j)}<Glyph value={ch.charCodeAt(0) & 15} size={17} />{/each}</span>{/if}{/each}

<style>
  /* Slovo, které Kodex přeložil: v Echově řeči se rozsvítí. */
  .deciphered {
    color: var(--lumen);
    text-shadow: 0 0 8px rgba(255, 210, 130, 0.35);
  }
  .garbled {
    display: inline-flex;
    gap: 1px;
    vertical-align: -3px;
    padding: 0 2px;
  }
</style>
