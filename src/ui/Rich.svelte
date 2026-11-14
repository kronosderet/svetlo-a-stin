<script lang="ts">
  /** Text z dat hry s indexy a šipkami vysázenými písmem hry (viz richParts). */
  import Arrow from './Arrow.svelte';
  import { richParts } from '../game/text';

  let { text }: { text: string } = $props();

  const parts = $derived(richParts(text));
</script>

{#each parts as p, k (k)}{#if p.kind === 'text'}{p.value}{:else if p.kind === 'sub'}<sub>{p.value}</sub>{:else if p.kind === 'sup'}<sup>{p.value}</sup>{:else if p.kind === 'arrow'}<Arrow dir={p.dir} label={p.dir === 'right' ? '→' : '←'} />{/if}{/each}
