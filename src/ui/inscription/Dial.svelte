<script lang="ts">
  import { fly } from 'svelte/transition';
  import Icon from '../Icon.svelte';
  import { settings } from '../../game/settings.svelte.ts';

  interface Props {
    value: number;
    wheels: number;
    disabled?: boolean;
    onNudge: (wheel: number, delta: number) => void;
  }

  let { value, wheels, disabled = false, onNudge }: Props = $props();

  const PLACES = ['jednotky', 'desítky', 'stovky'];

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const order = $derived(Array.from({ length: wheels }, (_, w) => w));
  /** Směr posledního otočení každého kotouče (+1 nahoru, −1 dolů) pro animaci. */
  let dirs: number[] = $state([]);

  function digitAt(w: number): number {
    return Math.floor(value / 10 ** (wheels - 1 - w)) % 10;
  }

  function place(w: number): string {
    return PLACES[wheels - 1 - w] ?? `řád ${wheels - w}`;
  }

  function nudge(w: number, delta: number) {
    if (disabled) return;
    dirs[w] = delta;
    onNudge(w, delta);
  }

  function onKey(e: KeyboardEvent, w: number) {
    if (e.key === 'ArrowUp') nudge(w, 1);
    else if (e.key === 'ArrowDown') nudge(w, -1);
    else return;
    e.preventDefault();
  }
</script>

<!-- Kamenné kotouče s vykládanými číslicemi, jako zámek s heslem. -->
<div class="dial stone" role="group" aria-label="Kotouče, nastaveno {value}">
  {#each order as w (w)}
    {@const d = digitAt(w)}
    {@const dir = dirs[w] ?? 1}
    <div class="wheel">
      <button type="button" class="nudge" {disabled} aria-label="{place(w)} o jedna víc" onclick={() => nudge(w, 1)}>
        <Icon name="up" size={22} />
      </button>
      <div
        class="drum stone-inset"
        role="spinbutton"
        tabindex={disabled ? -1 : 0}
        aria-label="Kotouč: {place(w)}"
        aria-valuenow={d}
        aria-valuemin={0}
        aria-valuemax={9}
        onkeydown={(e) => onKey(e, w)}
      >
        <span class="ghost above" aria-hidden="true">{(d + 9) % 10}</span>
        {#key d}
          <span
            class="digit inlaid"
            in:fly={{ y: 30 * dir, duration: 260 * m }}
            out:fly={{ y: -30 * dir, duration: 260 * m }}
          >{d}</span>
        {/key}
        <span class="ghost below" aria-hidden="true">{(d + 1) % 10}</span>
      </div>
      <button type="button" class="nudge" {disabled} aria-label="{place(w)} o jedna méně" onclick={() => nudge(w, -1)}>
        <Icon name="down" size={22} />
      </button>
    </div>
  {/each}
</div>

<style>
  .dial {
    display: flex;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 14px;
  }
  .wheel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .nudge {
    display: grid;
    place-items: center;
    width: 60px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      color var(--t-fast),
      background var(--t-fast);
  }
  .nudge:hover:not(:disabled) {
    color: var(--lumen);
    background: rgba(255, 236, 200, 0.06);
  }
  .nudge:active:not(:disabled) {
    transform: translateY(1px);
  }
  .nudge:disabled {
    opacity: 0.4;
    cursor: default;
  }
  /* Válec: v okénku jedna číslice, nad a pod ní sousedé ve stínu. */
  .drum {
    position: relative;
    display: grid;
    place-items: center;
    width: 60px;
    height: 104px;
    overflow: hidden;
    border-radius: 8px;
    background-image:
      linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 32%, transparent 68%, rgba(0, 0, 0, 0.7)),
      var(--tex-grain);
  }
  .drum:focus-visible {
    outline: 2px solid var(--lumen);
    outline-offset: 3px;
  }
  .digit {
    grid-area: 1 / 1;
    font-family: var(--font-display);
    font-size: var(--fs-3xl);
    font-weight: 700;
    line-height: 1;
  }
  .ghost {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
    line-height: 1;
    color: var(--stone-400);
    opacity: 0.7;
    pointer-events: none;
  }
  .above {
    top: 6px;
  }
  .below {
    bottom: 6px;
  }
</style>
