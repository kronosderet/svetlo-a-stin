<script lang="ts">
  interface Props {
    on: boolean;
    /** carry = přenos nebo výpůjčka, spout = přepad nádoby. Krystal má vždy jen dva stavy. */
    tone: 'carry' | 'spout';
    highlight?: boolean;
    wrong?: boolean;
    /** Světlo z tohoto přenosu odteklo dál (do dalšího přenosu): krystal pohasne, ale zůstává rozsvícený. */
    spent?: boolean;
    disabled?: boolean;
    label: string;
    onToggle: () => void;
  }

  let { on, tone, highlight = false, wrong = false, spent = false, disabled = false, label, onToggle }: Props = $props();
</script>

<!-- Krystal přenosu: světlo, které přeteklo ze sloupce vpravo, dosedne do kamenné misky nad sloupcem. -->
<button
  type="button"
  class="spark {tone}"
  class:on
  class:wrong
  class:spent
  aria-pressed={on}
  aria-label={label}
  {disabled}
  onclick={onToggle}
>
  <span class="cup" aria-hidden="true">
    <svg class="gem" viewBox="0 0 20 32" focusable="false">
      <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
      <path d="M10 1.5V8M18.5 9L14 11M18.5 23L14 21M10 30.5V24M1.5 23L6 21M1.5 9L6 11" />
    </svg>
  </span>
  {#if highlight}<span class="ring" aria-hidden="true"></span>{/if}
</button>

<style>
  .spark {
    position: relative;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .spark:disabled {
    cursor: default;
  }
  .cup {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 35%, #0d0a07, #2a221a 70%);
    box-shadow:
      inset 0 3px 6px rgba(0, 0, 0, 0.8),
      0 1px 0 rgba(255, 236, 200, 0.12),
      0 0 0 2px rgba(0, 0, 0, 0.35);
    transition: box-shadow var(--t-med);
  }
  .spark:not(:disabled):hover .cup {
    box-shadow:
      inset 0 3px 6px rgba(0, 0, 0, 0.8),
      0 1px 0 rgba(255, 236, 200, 0.12),
      0 0 0 2px rgba(180, 170, 200, 0.45);
  }
  /* Malý krystal: v prázdné misce není, po doteku dosedne a rozzáří se. */
  .gem {
    width: 15px;
    height: 24px;
    overflow: visible;
    transform: translateY(-6px) scale(0.4);
    opacity: 0;
    transition:
      transform var(--t-med) cubic-bezier(0.3, 1.6, 0.5, 1),
      opacity var(--t-fast);
  }
  .gem polygon {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    stroke-width: 1.4;
    stroke-linejoin: round;
  }
  .gem path {
    fill: none;
    stroke: #fff6dc;
    stroke-opacity: 0.55;
    stroke-width: 1;
  }
  .on .gem {
    transform: none;
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(255, 210, 130, 0.85)) drop-shadow(0 0 12px rgba(242, 170, 70, 0.45));
  }
  .on.spent .gem {
    opacity: 0.32;
    filter: none;
    transition: opacity 420ms ease;
  }
  .spout .cup {
    border-radius: 40% 40% 50% 50%;
  }
  .wrong .cup {
    box-shadow:
      inset 0 3px 6px rgba(0, 0, 0, 0.8),
      0 0 0 2px var(--warn),
      0 0 14px rgba(240, 149, 122, 0.5);
  }
  .ring {
    position: absolute;
    inset: -3px;
    border: 2px solid var(--ok);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(127, 207, 180, 0.4);
    pointer-events: none;
    animation: ring 1.6s ease-in-out infinite;
  }
  @keyframes ring {
    50% {
      transform: scale(1.1);
      opacity: 0.5;
    }
  }
</style>
