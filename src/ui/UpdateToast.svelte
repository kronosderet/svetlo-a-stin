<script lang="ts">
  import { fly } from 'svelte/transition';
  import { nav } from '../game/nav.svelte.ts';
  import { applyUpdate, pwa } from '../game/pwa.svelte.ts';
  import { fileLink } from '../game/progressLink.svelte.ts';
  import { settings } from '../game/settings.svelte.ts';

  const m = $derived(settings.reducedMotion ? 0 : 1);
  // Uprostřed komnaty hráče nevyrušuje: nabídka počká na mapu nebo titulní obrazovku.
  const show = $derived(pwa.update && !pwa.later && nav.screen.name !== 'level');
  // Na titulní obrazovce jsou dole tlačítka a patička, nabídka tam visí nahoře nad znakem.
  const top = $derived(nav.screen.name === 'title');
</script>

{#if show}
  <div class="dock" class:top>
    <div class="toast panel" role="status" transition:fly={{ y: top ? -24 : 24, duration: 260 * m }}>
      <p>
        <strong>Je tu nová verze hry.</strong>
        Postup zůstane uložený.{#if fileLink.name}
          Soubor s postupem pak bude potřeba znovu propojit.{/if}
      </p>
      <div class="actions">
        <button type="button" class="btn btn-primary" onclick={applyUpdate}>Načíst</button>
        <button type="button" class="btn btn-ghost" onclick={() => (pwa.later = true)}>Později</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dock {
    position: fixed;
    left: 0;
    right: 0;
    bottom: max(16px, env(safe-area-inset-bottom));
    z-index: 40;
    display: flex;
    justify-content: center;
    padding: 0 16px;
    pointer-events: none;
  }
  .dock.top {
    top: max(16px, env(safe-area-inset-top));
    bottom: auto;
  }
  .toast {
    pointer-events: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px 16px;
    width: min(560px, 100%);
    padding: 12px 16px;
  }
  p {
    flex: 1 1 240px;
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  strong {
    color: var(--text);
  }
  .actions {
    display: flex;
    gap: 8px;
  }
</style>
