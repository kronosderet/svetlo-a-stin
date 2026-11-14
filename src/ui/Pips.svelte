<script lang="ts">
  let { total, done }: { total: number; done: number } = $props();

  const slots = $derived(Array.from({ length: total }, (_, k) => k));
</script>

<!-- Lůžka pro malé drahokamy: každý splněný cíl jeden vsadí. -->
<div class="pips" role="img" aria-label="Splněno {done} z {total}">
  {#each slots as k (k)}
    <span class="pip stone-inset" class:done={k < done} class:current={k === done}><i></i></span>
  {/each}
</div>

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
</style>
