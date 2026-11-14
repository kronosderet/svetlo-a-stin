<script lang="ts">
  import { fileLink, keepSavingToLoaded, loadFile, pickAndLoad, saveToFile } from '../game/progressLink.svelte.ts';

  /** compact = jen načtení (úvodní obrazovka), jinak uložení i načtení (Nastavení). */
  let { compact = false }: { compact?: boolean } = $props();

  let input: HTMLInputElement | undefined = $state();

  async function load() {
    // Edge a Chrome mají vlastní okno pro výběr; jinde poslouží obyčejný výběr souboru.
    if (!(await pickAndLoad())) input?.click();
  }

  async function picked(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    const file = el.files?.[0];
    if (file) await loadFile(file);
    el.value = '';
  }
</script>

<div class="progress-file" class:compact>
  {#if !compact}
    <p class="label">Soubor s postupem</p>
    <p class="desc">
      Postup se ukládá jen v tomto prohlížeči. Chceš-li pokračovat na jiném počítači, ulož ho do souboru, třeba do svého
      školního OneDrive, a tam ho zase načti.
    </p>
  {/if}
  <div class="buttons">
    {#if !compact}
      <button type="button" class="btn btn-ghost" onclick={saveToFile}>Uložit do souboru</button>
    {/if}
    <button type="button" class="btn btn-ghost" onclick={load}>{compact ? 'Načíst postup ze souboru' : 'Načíst ze souboru'}</button>
    {#if fileLink.offer}
      <button type="button" class="btn btn-ghost" onclick={keepSavingToLoaded}>Průběžně ukládat do tohoto souboru</button>
    {/if}
  </div>
  <input bind:this={input} type="file" accept=".json,application/json" hidden onchange={picked} />
  {#if fileLink.message}
    <p class="status" class:error={fileLink.error} role="status">{fileLink.message}</p>
  {:else if fileLink.name}
    <p class="status" role="status">Postup se průběžně ukládá do souboru {fileLink.name}.</p>
  {/if}
</div>

<style>
  .progress-file {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .compact {
    align-items: center;
    text-align: center;
  }
  .label {
    margin: 0;
    font-weight: 700;
  }
  .desc {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }
  .compact .buttons {
    justify-content: center;
    margin-top: 0;
  }
  .status {
    margin: 2px 0 0;
    font-size: var(--fs-sm);
    color: var(--ok);
  }
  .status.error {
    color: var(--warn);
  }
</style>
