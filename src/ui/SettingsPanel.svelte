<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import { autofocus } from './actions';
  import { ui } from '../game/nav.svelte.ts';
  import { resetProgress } from '../game/progress.svelte.ts';
  import { saveSettings, settings, type Settings } from '../game/settings.svelte.ts';
  import { unlock } from '../audio/sound';

  let confirmReset = $state(false);
  let resetDone = $state(false);

  const m = $derived(settings.reducedMotion ? 0 : 1);

  function close() {
    ui.settingsOpen = false;
    confirmReset = false;
    resetDone = false;
  }

  function flip(key: keyof Settings) {
    settings[key] = !settings[key];
    saveSettings();
    if (key === 'sound' && settings.sound) unlock();
  }

  function reset() {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }
    resetProgress();
    confirmReset = false;
    resetDone = true;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && ui.settingsOpen) close();
  }
</script>

<svelte:window onkeydown={onKey} />

{#snippet toggle(key: keyof Settings, label: string, desc: string)}
  <div class="row">
    <div class="row-text">
      <p class="label" id="lbl-{key}">{label}</p>
      <p class="desc">{desc}</p>
    </div>
    <button
      type="button"
      class="switch"
      class:on={settings[key]}
      role="switch"
      aria-checked={settings[key]}
      aria-labelledby="lbl-{key}"
      onclick={() => flip(key)}
    >
      <span class="knob"></span>
    </button>
  </div>
{/snippet}

{#if ui.settingsOpen}
  <div class="layer" transition:fade={{ duration: 160 * m }}>
    <button type="button" class="backdrop" tabindex="-1" aria-label="Zavřít nastavení" onclick={close}></button>
    <div class="modal panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" in:fly={{ y: 20, duration: 240 * m }}>
      <header>
        <h2 id="settings-title">Nastavení</h2>
        <button type="button" class="icon-btn" onclick={close} aria-label="Zavřít nastavení" use:autofocus>
          <Icon name="close" />
        </button>
      </header>

      {@render toggle('sound', 'Zvuk', 'Tóny krystalů a ozvěny observatoře.')}
      {@render toggle('alwaysDigits', 'Vždy ukazovat 0 a 1', 'Číslice pod krystaly i v komnatách, kde je Kodex ještě nepřeložil.')}
      {@render toggle('alwaysWeights', 'Vždy ukazovat váhy', 'Váhy krystalů i v komnatách, kde už zmizely. Opora pro ty, kdo si řadu 1, 2, 4, 8… ještě nepamatují.')}
      {@render toggle('reducedMotion', 'Omezit animace', 'Vypne pohyb pozadí, částice a přechody.')}

      <div class="danger">
        <button type="button" class="btn btn-ghost" class:confirm={confirmReset} onclick={reset}>
          {confirmReset ? 'Opravdu smazat celý postup?' : 'Smazat postup'}
        </button>
        {#if resetDone}<p role="status">Postup smazán.</p>{/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .layer {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 16px;
  }
  .modal {
    position: relative;
    width: min(480px, 100%);
    padding: 18px 22px 22px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  h2 {
    margin: 0;
    font-size: var(--fs-xl);
    color: var(--lumen);
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.6);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0.35);
    box-shadow: 0 1px 0 rgba(255, 226, 180, 0.06);
  }
  .row-text {
    flex: 1;
  }
  .row p {
    margin: 0;
  }
  .label {
    font-weight: 700;
  }
  .desc {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  /* Páka: vytesaná drážka a mosazný jezdec */
  .switch {
    position: relative;
    flex: none;
    width: 58px;
    height: 32px;
    border: 0;
    border-radius: 999px;
    background-color: rgba(8, 6, 4, 0.55);
    box-shadow:
      inset 0 3px 7px rgba(0, 0, 0, 0.8),
      0 1px 0 rgba(255, 236, 200, 0.1);
    cursor: pointer;
  }
  .knob {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #8d806e, #4d4134 70%);
    box-shadow:
      0 2px 3px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 236, 200, 0.25);
    transition: transform var(--t-med) var(--heavy);
  }
  .switch.on {
    box-shadow:
      inset 0 3px 7px rgba(0, 0, 0, 0.8),
      inset 0 0 12px rgba(242, 170, 70, 0.35),
      0 1px 0 rgba(255, 236, 200, 0.1);
  }
  .switch.on .knob {
    transform: translateX(26px);
    background: radial-gradient(circle at 35% 30%, #fbe7ad, #c9a24a 55%, #6e5019);
    box-shadow:
      0 2px 3px rgba(0, 0, 0, 0.6),
      0 0 10px rgba(242, 193, 78, 0.55);
  }
  .danger {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .danger p {
    margin: 0;
    color: var(--text-muted);
  }
  .confirm {
    border-color: var(--warn);
    color: var(--warn);
  }
</style>
