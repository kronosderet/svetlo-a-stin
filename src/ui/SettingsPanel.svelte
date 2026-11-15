<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import ProgressFile from './ProgressFile.svelte';
  import { autofocus } from './actions';
  import { go, ui } from '../game/nav.svelte.ts';
  import { progress, resetProgress, setName } from '../game/progress.svelte.ts';
  import { unlinkFile } from '../game/progressLink.svelte.ts';
  import { applyUpdate, install, pwa } from '../game/pwa.svelte.ts';
  import { saveSettings, settings, type Settings } from '../game/settings.svelte.ts';
  import { checkTeacherPin } from '../game/pin';
  import { AUTHOR, CONTACT, LICENSE_NAME, LICENSE_URL } from '../content/about';
  import { unlock } from '../audio/sound';

  let confirmReset = $state(false);
  let resetDone = $state(false);
  let pin = $state('');
  let pinWrong = $state(false);

  function teacherOn(e: SubmitEvent) {
    e.preventDefault();
    if (!checkTeacherPin(pin)) {
      pinWrong = true;
      return;
    }
    settings.teacher = true;
    saveSettings();
    pin = '';
    pinWrong = false;
  }

  function teacherOff() {
    settings.teacher = false;
    saveSettings();
  }

  function openOverview() {
    close();
    go({ name: 'teacher' });
  }

  const m = $derived(settings.reducedMotion ? 0 : 1);

  function close() {
    ui.settingsOpen = false;
    confirmReset = false;
    resetDone = false;
  }

  function flip(key: 'sound' | 'alwaysDigits' | 'alwaysWeights' | 'reducedMotion' | 'lite') {
    settings[key] = !settings[key];
    // Kdo úspornou grafiku přepne sám, tomu ji hra už sama nezapne.
    if (key === 'lite') {
      settings.liteAuto = false;
      settings.liteSet = true;
    }
    saveSettings();
    if (key === 'sound' && settings.sound) unlock();
  }

  function reset() {
    if (!confirmReset) {
      confirmReset = true;
      return;
    }
    // Nejdřív odpojit soubor, aby se do něj nezapsal prázdný postup dalšího hráče.
    unlinkFile();
    resetProgress();
    confirmReset = false;
    resetDone = true;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && ui.settingsOpen) close();
  }
</script>

<svelte:window onkeydown={onKey} />

{#snippet toggle(key: 'sound' | 'alwaysDigits' | 'alwaysWeights' | 'reducedMotion' | 'lite', label: string, desc: string)}
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
      {@render toggle(
        'lite',
        'Úsporná grafika',
        settings.liteAuto
          ? 'Zapnula se sama, protože se hra na tomto počítači trhala. Bez rozostření a částic.'
          : 'Bez rozostření a částic. Pomůže na pomalejších počítačích.',
      )}

      <div class="row name-row">
        <label class="row-text" for="player-name">
          <span class="label">Tvé jméno pro učitele</span>
          <span class="desc">Uloží se do souboru s postupem, aby ho učitel v přehledu třídy poznal. Nepovinné.</span>
        </label>
        <input
          id="player-name"
          class="text-input"
          type="text"
          maxlength="40"
          autocomplete="off"
          value={progress.name}
          onchange={(e) => setName(e.currentTarget.value)}
        />
      </div>

      <div class="file-row">
        <ProgressFile />
      </div>

      {#if pwa.supported}
        <section class="sub" aria-labelledby="app-title">
          <h3 id="app-title"><Icon name="install" size={18} /> Hra jako aplikace</h3>
          {#if pwa.installed}
            <p class="desc">Hra je nainstalovaná a spouští se jako aplikace.</p>
          {:else if pwa.canInstall}
            <p class="desc">Nainstaluj si hru: spustí se z plochy v celém okně, bez lišty prohlížeče.</p>
            <div class="sub-actions">
              <button type="button" class="btn btn-ghost" onclick={install}>Nainstalovat</button>
            </div>
          {:else if pwa.ios}
            <p class="desc">
              V Safari klepni na Sdílet a pak na Přidat na plochu. Hra se pak spouští jako aplikace a Safari postup
              nesmaže, ani když hru delší dobu nespustíš.
            </p>
          {:else}
            <p class="desc">Hru jde nainstalovat z nabídky prohlížeče (Nainstalovat aplikaci nebo Přidat na plochu).</p>
          {/if}
          {#if pwa.offline}<p class="desc">Hra je uložená v zařízení a poběží i bez internetu.</p>{/if}
          {#if pwa.update}
            <div class="sub-actions">
              <button type="button" class="btn btn-primary" onclick={applyUpdate}>Načíst novou verzi</button>
            </div>
          {/if}
        </section>
      {/if}

      <section class="teacher sub" aria-labelledby="teacher-title">
        <h3 id="teacher-title"><Icon name="teacher" size={18} /> Učitelský režim</h3>
        {#if settings.teacher}
          <p class="desc">Zapnuto: všechna patra i komnaty jsou otevřené, ať jde ukázat cokoli.</p>
          <div class="teacher-actions">
            <button type="button" class="btn btn-primary" onclick={openOverview}>Přehled třídy</button>
            <button type="button" class="btn btn-ghost" onclick={teacherOff}>Vypnout</button>
          </div>
        {:else}
          <form class="pin" onsubmit={teacherOn}>
            <label class="visually-hidden" for="teacher-pin">PIN učitelského režimu</label>
            <input
              id="teacher-pin"
              class="text-input"
              type="password"
              inputmode="numeric"
              autocomplete="off"
              placeholder="PIN"
              maxlength="16"
              bind:value={pin}
              oninput={() => (pinWrong = false)}
            />
            <button type="submit" class="btn btn-ghost">Zapnout</button>
          </form>
          {#if pinWrong}<p class="desc err" role="status">Nesprávný PIN.</p>{/if}
          <p class="desc">PIN učitelům posílá autor hry: <a href="mailto:{CONTACT}">{CONTACT}</a></p>
        {/if}
      </section>

      <section class="sub about" aria-labelledby="about-title">
        <h3 id="about-title"><Icon name="info" size={18} /> O hře</h3>
        <p class="desc">
          Hru vytvořil <strong>{AUTHOR}</strong> ve spolupráci s <strong>Claude</strong>, umělou inteligencí od
          Anthropic.
        </p>
        <p class="desc">
          Licence <a href={LICENSE_URL} target="_blank" rel="noopener">{LICENSE_NAME}</a>: ve veřejných školách, doma
          a k jiným nekomerčním účelům ji můžete volně používat, upravovat a sdílet, když uvedete autora. Soukromé
          školy, placené kurzy a jiné komerční užití: <a href="mailto:{CONTACT}">{CONTACT}</a>.
        </p>
        <p class="desc">Písma Cinzel, Cormorant Garamond, Atkinson Hyperlegible a JetBrains Mono: SIL Open Font License.</p>
      </section>

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
    max-height: calc(100dvh - 32px);
    overflow-y: auto;
    padding: 18px 22px 22px;
  }
  .name-row label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .text-input {
    width: 170px;
    min-height: 40px;
    padding: 6px 10px;
    border: 1px solid var(--stone-400);
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.35);
    font: inherit;
    font-size: var(--fs-md);
    color: var(--text);
  }
  .text-input:focus-visible {
    outline: 2px solid var(--lumen);
    outline-offset: 2px;
  }
  .sub {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 2px solid rgba(0, 0, 0, 0.35);
  }
  .sub h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    font-size: var(--fs-md);
    color: var(--text);
  }
  .sub .desc {
    margin: 0 0 10px;
  }
  .teacher .err {
    color: var(--warn);
  }
  .pin,
  .sub-actions,
  .teacher-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .pin .text-input {
    width: 120px;
    letter-spacing: 0.3em;
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
  .file-row {
    padding: 14px 0 4px;
    border-top: 1px solid var(--line);
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
  .sub a {
    color: var(--lumen);
    text-underline-offset: 2px;
  }
  .sub strong {
    color: var(--text);
  }
  .confirm {
    border-color: var(--warn);
    color: var(--warn);
  }
</style>
