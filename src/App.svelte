<script lang="ts">
  import { nav } from './game/nav.svelte.ts';
  import { onMount } from 'svelte';
  import { watchFrameRate } from './game/perf';
  import { startPwa } from './game/pwa.svelte.ts';
  import { saveSettings, settings } from './game/settings.svelte.ts';
  import Background from './ui/Background.svelte';
  import GemDefs from './ui/GemDefs.svelte';
  import KodexPanel from './ui/KodexPanel.svelte';
  import SettingsPanel from './ui/SettingsPanel.svelte';
  import UpdateToast from './ui/UpdateToast.svelte';
  import Title from './ui/screens/Title.svelte';
  import MapScreen from './ui/screens/MapScreen.svelte';
  import Level from './ui/screens/Level.svelte';
  import TeacherScreen from './ui/screens/TeacherScreen.svelte';
  import SummaryScreen from './ui/screens/SummaryScreen.svelte';

  $effect(() => {
    document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
    document.documentElement.dataset.lite = settings.lite ? 'on' : 'off';
  });

  // Uložení hry do zařízení (offline), instalace na plochu a nabídka nových verzí.
  onMount(startPwa);

  // Trhá-li se hra (pomalý školní počítač), zapne si úspornou grafiku sama. Ruční volba má přednost.
  onMount(() => {
    if (settings.lite || settings.liteSet) return;
    return watchFrameRate(() => {
      settings.lite = true;
      settings.liteAuto = true;
      saveSettings();
    });
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
    {#key `${nav.screen.id}:${nav.screen.run ?? 0}`}
      <Level id={nav.screen.id} />
    {/key}
  {:else if nav.screen.name === 'teacher'}
    <TeacherScreen />
  {:else if nav.screen.name === 'summary'}
    <SummaryScreen act={nav.screen.act} />
  {/if}
</main>

<KodexPanel />
<SettingsPanel />
<UpdateToast />

<style>
  .app {
    position: relative;
    z-index: 1;
    min-height: 100dvh;
    /* Záře krystalů a pulzy oltáře smí přesahovat, ale nesmí roztáhnout stránku do strany. */
    overflow-x: clip;
  }
</style>
