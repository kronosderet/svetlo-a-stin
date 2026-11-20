<script lang="ts">
  import { tick } from 'svelte';
  import EchoText from './EchoText.svelte';
  import type { Echo } from '../game/echo.svelte.ts';
  import { plainLength, plainText } from '../game/text';
  import { progress } from '../game/progress.svelte.ts';
  import { settings } from '../game/settings.svelte.ts';

  /**
   * Bublina Echa je pro oko a myš: klik dopíše repliku, nebo přejde na další. Čtečka obrazovky čte
   * celý text ze skrytého řádku (nové repliky jí ohlásí komnata), klávesnice má tlačítko dál.
   */
  let { echo }: { echo: Echo } = $props();

  let visible = $state(0);
  const line = $derived(echo.current);
  const total = $derived(line ? plainLength(line) : 0);
  const typing = $derived(visible < total);
  const who = $derived(echo.tone === 'hint' ? 'Nápověda' : 'Echo');
  /** Celá replika pro čtečku (ne postupně vypisovaná), přeložená slova čitelná. */
  const spoken = $derived(line ? plainText(line, (key) => progress.kodex.includes(key)) : '');
  let bubbleEl: HTMLElement | undefined = $state();
  let moreBtn: HTMLButtonElement | undefined = $state();

  // Poslední replika už tlačítko dál nemá: fokus z něj přejde na bublinu, ať Tab nezačíná od začátku stránky.
  $effect.pre(() => {
    if (!echo.hasMore && moreBtn && document.activeElement === moreBtn) tick().then(() => bubbleEl?.focus({ preventScroll: true }));
  });

  // Postupné vypisování repliky; při omezených animacích hned celá.
  $effect(() => {
    void echo.serial;
    const t = total;
    if (settings.reducedMotion) {
      visible = t;
      return;
    }
    visible = 0;
    const id = setInterval(() => {
      visible += 1;
      if (visible >= t) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  });

  /** Klik na bublinu: rozepsanou repliku dopíše, dopsanou posune na další. */
  function advance() {
    if (typing) visible = total;
    else echo.next();
  }

  /** Tlačítko dál: vždy další replika (čtečka i klávesnice mají celý text hned, vypisování neřeší). */
  function nextLine(e: MouseEvent) {
    e.stopPropagation();
    echo.next();
  }
</script>

{#if echo.open && line}
  <div class="echo" class:hint={echo.tone === 'hint'}>
    <span class="orb" aria-hidden="true"></span>
    <!-- Klávesnice a čtečka mají tlačítko dál; klik kamkoli do bubliny je jen pohodlí pro myš a prst. -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="bubble stone" bind:this={bubbleEl} tabindex="-1" onclick={advance}>
      <span class="who" aria-hidden="true">{who}</span>
      <span class="text" aria-hidden="true"><EchoText text={line} {visible} /></span>
      <span class="visually-hidden">{who}: {spoken}</span>
      {#if echo.hasMore}
        <button type="button" class="more" class:typing bind:this={moreBtn} onclick={nextLine} aria-label="Další replika">
          dál <svg class="more-tri" viewBox="0 0 8 10" aria-hidden="true"><path d="M1 1L7 5L1 9Z" /></svg>
        </button>
      {/if}
    </div>
    <button type="button" class="icon-btn hide" onclick={() => (echo.open = false)} aria-label="Skrýt Echo">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
  </div>
{:else if line}
  <button type="button" class="reopen" onclick={() => (echo.open = true)} aria-label="Zobrazit Echo">
    <span class="orb" aria-hidden="true"></span>
  </button>
{/if}

<style>
  .echo {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    width: 100%;
    max-width: 780px;
  }
  /* Světelný automat v bronzovém pouzdře */
  .orb {
    position: relative;
    flex: none;
    width: 46px;
    height: 46px;
    margin-bottom: 4px;
    border-radius: 50%;
    border: 3px solid #5c4214;
    background:
      radial-gradient(circle at 42% 38%, #fff6dc 0%, var(--lumen) 30%, rgba(242, 170, 70, 0.15) 62%, transparent 64%),
      radial-gradient(circle, #2a1d0c 60%, #120c05 100%);
    box-shadow:
      0 0 0 2px #c9a24a,
      0 0 0 4px #3d2c0c,
      0 0 22px rgba(242, 170, 70, 0.45);
  }
  .orb::after {
    content: '';
    position: absolute;
    inset: -9px;
    border-radius: 50%;
    border: 1px dashed rgba(201, 162, 74, 0.55);
    animation: spin 14s linear infinite;
  }
  .hint .orb {
    background:
      radial-gradient(circle at 42% 38%, #e6fffb 0%, var(--ok) 30%, rgba(127, 207, 180, 0.15) 62%, transparent 64%),
      radial-gradient(circle, #10201b 60%, #06100c 100%);
    box-shadow:
      0 0 0 2px #c9a24a,
      0 0 0 4px #3d2c0c,
      0 0 22px rgba(127, 207, 180, 0.4);
  }
  .bubble {
    flex: 1;
    min-width: 0;
    display: block;
    padding: 11px 16px 12px;
    border-left: 3px solid var(--brass);
    border-radius: 4px 8px 8px 4px;
    text-align: left;
    cursor: pointer;
  }
  .bubble:hover {
    filter: brightness(1.08);
  }
  .hint .bubble {
    border-left-color: var(--ok);
  }
  .who {
    display: block;
    margin-bottom: 2px;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--lumen);
  }
  .hint .who {
    color: var(--ok);
  }
  .text {
    font-size: var(--fs-base);
    color: var(--text);
  }
  .more {
    float: right;
    margin: 0 -6px -4px 12px;
    padding: 2px 6px;
    border: 0;
    border-radius: 4px;
    background: none;
    font-size: var(--fs-sm);
    color: var(--lumen);
    cursor: pointer;
  }
  /* Během vypisování je dál jen naznačené (klik do bubliny repliku nejdřív dopíše). */
  .more.typing {
    opacity: 0.45;
  }
  .more-tri {
    width: 0.55em;
    height: 0.7em;
    vertical-align: 0;
    fill: currentColor;
  }
  .hide {
    width: 36px;
    height: 36px;
    margin-bottom: 4px;
  }
  .reopen {
    padding: 6px;
    border: 0;
    border-radius: 50%;
    background: none;
    cursor: pointer;
  }
</style>
