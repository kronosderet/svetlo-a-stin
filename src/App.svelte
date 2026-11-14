<script lang="ts">
  import { nav } from './game/nav.svelte.ts';
  import { settings } from './game/settings.svelte.ts';
  import Background from './ui/Background.svelte';
  import GemDefs from './ui/GemDefs.svelte';
  import KodexPanel from './ui/KodexPanel.svelte';
  import SettingsPanel from './ui/SettingsPanel.svelte';
  import Title from './ui/screens/Title.svelte';
  import MapScreen from './ui/screens/MapScreen.svelte';
  import Level from './ui/screens/Level.svelte';

  $effect(() => {
    document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
  });
</script>

<GemDefs />
<Background />

<main class="app">
  {#if nav.screen.name === 'title'}
    <Title />
  {:else if nav.screen.name === 'map'}
    <MapScreen />
  {:else if nav.screen.name === 'level'}
    {#key nav.screen.id}
      <Level id={nav.screen.id} />
    {/key}
  {/if}
</main>

<KodexPanel />
<SettingsPanel />

<style>
  .app {
    position: relative;
    z-index: 1;
    min-height: 100dvh;
    /* Záře krystalů a pulzy oltáře smí přesahovat, ale nesmí roztáhnout stránku do strany. */
    overflow-x: clip;
  }
</style>
