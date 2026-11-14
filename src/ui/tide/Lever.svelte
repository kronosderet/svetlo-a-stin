<script lang="ts">
  import Rich from '../Rich.svelte';

  interface Props {
    symbol: string;
    caption: string;
    keyHint?: string;
    highlight?: boolean;
    disabled?: boolean;
    label: string;
    onPull: () => void;
  }

  let { symbol, caption, keyHint, highlight = false, disabled = false, label, onPull }: Props = $props();

  let pulls = $state(0);

  function pull() {
    pulls++;
    onPull();
  }
</script>

<!-- Dřevěná páka s mosaznou rukojetí: při zatažení se rukojeť sklopí. -->
<button type="button" class="lever wood" class:highlight aria-label={label} {disabled} onclick={pull}>
  {#key pulls}
    <span class="handle" class:pulled={pulls > 0} aria-hidden="true">
      <span class="rod"></span>
      <span class="knob"></span>
    </span>
  {/key}
  <span class="symbol inlaid"><Rich text={symbol} /></span>
  <span class="caption">{caption}</span>
  {#if keyHint}<kbd class="hide-narrow" aria-hidden="true"><Rich text={keyHint} /></kbd>{/if}
</button>

<style>
  .lever {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 104px;
    min-height: 92px;
    padding: 30px 14px 10px;
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
    transition:
      transform var(--t-fast),
      filter var(--t-fast);
    -webkit-tap-highlight-color: transparent;
  }
  .lever:hover:not(:disabled) {
    filter: brightness(1.12);
  }
  .lever:active:not(:disabled) {
    transform: translateY(2px);
  }
  .lever:disabled {
    cursor: default;
    filter: saturate(0.5) brightness(0.75);
  }
  .handle {
    position: absolute;
    top: -16px;
    left: 50%;
    width: 0;
    height: 0;
  }
  .rod {
    position: absolute;
    left: -3px;
    bottom: -24px;
    width: 6px;
    height: 32px;
    border-radius: 3px;
    background: linear-gradient(90deg, #5e4416, #d4ad55 45%, #7d5c1e);
    transform-origin: 50% 100%;
    transform: rotate(-18deg);
  }
  .knob {
    position: absolute;
    left: -10px;
    top: -14px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f6e2a6, #c9a24a 55%, #6b4c14);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.6);
    transform-origin: 3px 38px;
    transform: rotate(-18deg);
  }
  .pulled .rod,
  .pulled .knob {
    animation: pull 520ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .symbol {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    font-weight: 700;
    line-height: 1.1;
  }
  .caption {
    font-size: var(--fs-sm);
    color: var(--text-muted);
    white-space: nowrap;
  }
  kbd {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 1.6em;
    padding: 0 4px;
    border: 1px solid rgba(255, 210, 150, 0.25);
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .highlight {
    box-shadow:
      0 0 0 2px var(--ok),
      0 0 18px rgba(127, 207, 180, 0.45);
    animation: glow 1.6s ease-in-out infinite;
  }
  @keyframes pull {
    0%,
    100% {
      transform: rotate(-18deg);
    }
    45% {
      transform: rotate(28deg);
    }
  }
  @keyframes glow {
    50% {
      box-shadow:
        0 0 0 2px rgba(127, 207, 180, 0.5),
        0 0 8px rgba(127, 207, 180, 0.25);
    }
  }
  @media (max-height: 820px) {
    .lever {
      min-height: 78px;
      padding-top: 26px;
    }
  }
  @media (max-width: 560px) {
    .lever {
      min-width: 0;
      width: 100%;
      min-height: 84px;
      padding: 28px 4px 8px;
    }
    .symbol {
      font-size: var(--fs-lg);
    }
    .caption {
      font-size: var(--fs-xs);
      line-height: 1.15;
      text-align: center;
      white-space: normal;
    }
  }
</style>
