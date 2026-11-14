<script lang="ts">
  import Glyph from './Glyph.svelte';
  import { segments } from '../game/text';

  let { text, visible = Infinity }: { text: string; visible?: number } = $props();

  const parts = $derived(segments(text));
</script>

{#each parts as seg, k (k)}{#if seg.kind === 'text'}{seg.value.slice(0, Math.max(0, visible - seg.start))}{:else if visible > seg.start}<span class="garbled" role="img" aria-label="nečitelné slovo" title="Zatím nečitelné">{#each [...seg.value] as ch, j (j)}<Glyph value={ch.charCodeAt(0) & 15} size={17} />{/each}</span>{/if}{/each}

<style>
  .garbled {
    display: inline-flex;
    gap: 1px;
    vertical-align: -3px;
    padding: 0 2px;
  }
</style>
