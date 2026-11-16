<script lang="ts">
  import Icon from './Icon.svelte';
  import { browse } from '../game/browse.svelte.ts';

  let { total, done }: { total: number; done: number } = $props();

  const slots = $derived(Array.from({ length: total }, (_, k) => k));
  /** Vyřešená komnata s víc úlohami: kosočtverečky lemují šipky a dají se proklikat. */
  const browsing = $derived(browse.total > 1 && !!browse.show);
  const browseSlots = $derived(Array.from({ length: browse.total }, (_, k) => k));
</script>

{#if browsing}
  <div class="browse" role="group" aria-label="Úlohy komnaty, na desce je {browse.at + 1}. z {browse.total}">
    <button type="button" class="arrow" onclick={() => browse.show?.(browse.at - 1)} disabled={browse.at <= 0} aria-label="Předchozí úloha" title="Předchozí úloha">
      <Icon name="back" size={18} />
    </button>
    <div class="pips">
      {#each browseSlots as k (k)}
        <button
          type="button"
          class="pip stone-inset done"
          class:current={k === browse.at}
          aria-label="Úloha {k + 1}"
          aria-current={k === browse.at ? 'step' : undefined}
          onclick={() => browse.show?.(k)}
        ><i></i></button>
      {/each}
    </div>
    <button
      type="button"
      class="arrow next"
      onclick={() => browse.show?.(browse.at + 1)}
      disabled={browse.at >= browse.total - 1}
      aria-label="Další úloha"
      title="Další úloha"
    >
      <Icon name="back" size={18} />
    </button>
  </div>
{:else if total > 1}
  <!-- Lůžka pro malé drahokamy: každý splněný cíl jeden vsadí. -->
  <div class="pips" role="img" aria-label="Splněno {done} z {total}">
    {#each slots as k (k)}
      <span class="pip stone-inset" class:done={k < done} class:current={k === done}><i></i></span>
    {/each}
  </div>
{/if}

<style>
  .pips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .pip {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    border-radius: 50%;
  }
  .pip i {
    width: 9px;
    height: 9px;
    transform: rotate(45deg) scale(0);
    background: linear-gradient(135deg, #fff1c4, #f2c14e 55%, #b07a1a);
    box-shadow: 0 0 8px rgba(242, 193, 78, 0.8);
    transition: transform 380ms cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  .pip.done i {
    transform: rotate(45deg) scale(1);
  }
  .pip.current {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.75),
      0 0 0 1px rgba(255, 217, 138, 0.45);
  }

  /* Listování: šipky vlevo a vpravo, kosočtvereček na desce svítí víc a je větší. */
  .browse {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  button.pip {
    cursor: pointer;
  }
  button.pip.current {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.75),
      0 0 0 2px rgba(255, 217, 138, 0.85),
      0 0 12px rgba(242, 193, 78, 0.45);
  }
  button.pip.current i {
    transform: rotate(45deg) scale(1.25);
  }
  button.pip:not(.current):hover i {
    filter: brightness(1.25);
  }
  .arrow {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 50%;
    background: transparent;
    color: var(--lumen);
    cursor: pointer;
    transition:
      color var(--t-fast),
      background var(--t-fast),
      border-color var(--t-fast);
  }
  .arrow:hover:not(:disabled) {
    border-color: var(--line);
    background: rgba(0, 0, 0, 0.3);
  }
  .arrow:disabled {
    color: var(--umbra);
    opacity: 0.45;
    cursor: default;
  }
  .arrow.next :global(svg) {
    transform: scaleX(-1);
  }
</style>
