<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Arrow from '../Arrow.svelte';
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import Rich from '../Rich.svelte';
  import Seal from '../Seal.svelte';
  import { autofocus } from '../actions';
  import { openKodex } from '../../game/nav.svelte.ts';
  import { fileLink, saveToFile } from '../../game/progressLink.svelte.ts';
  import { plural } from '../../game/text';
  import { settings } from '../../game/settings.svelte.ts';
  import type { KodexEntry, LevelDef } from '../../content/types';
  import type { LevelResult } from '../../game/baseGame.svelte.ts';

  interface Props {
    level: LevelDef;
    result: LevelResult;
    lines: string[];
    kodex: KodexEntry | null;
    hasNext: boolean;
    /** Otevřela se brána patra: schody vedou dál (nebo prototyp končí) a otevřely se Hlubší síně. */
    floorDone: { numeral: string; next: string | null } | null;
    /** Po bráně patra: rovnocenná cesta do první nehotové Hlubší síně (vedle Dalšího patra). */
    onDeep?: () => void;
    onNext: () => void;
    onMap: () => void;
    onReplay: () => void;
    /** Zpátky do otevřené komnaty: hráč si s ní může dál hrát. */
    onBack?: () => void;
  }

  let { level, result, lines, kodex, hasNext, floorDone, onDeep, onNext, onMap, onReplay, onBack }: Props = $props();

  /** Escape zavře výsledek a vrátí hráče do otevřené komnaty. */
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && onBack) {
      e.preventDefault();
      onBack();
    }
  }

  const m = $derived(settings.reducedMotion ? 0 : 1);
  /**
   * Pečeť přesnosti počítá kroky stejně ve všech komnatách: dotek krystalu, páky nebo kotouče,
   * potvrzení a Zkoušku. Vkládání run a natáčení kamenů se nepočítá.
   */
  const unit = $derived(plural(result.moves, 'krok', 'kroky', 'kroků'));
  const movesText = $derived(
    `${result.moves} ${unit} · ideál ${result.par}${result.quizMistakes ? ` · kvíz ${result.quizMistakes}× vedle` : ''}`,
  );
  /** Pečeť odvahy bere jen nápověda, která ukázala konkrétní krok; obecné náznaky ne. */
  const courageText = $derived(
    result.stepHints
      ? `ukázka kroku ${result.stepHints}×`
      : result.hintsUsed
        ? `jen ${plural(result.hintsUsed, 'náznak', 'náznaky', 'náznaků')}, bez ukázky`
        : 'bez nápovědy',
  );
</script>

<svelte:window onkeydown={onKey} />

<div class="wrap" transition:fade={{ duration: 200 * m }}>
  <div class="scrim" aria-hidden="true"></div>
  <div class="rays" aria-hidden="true"></div>

  <!-- Kamenné dveře komnaty se se skřípěním rozjedou. -->
  {#if m}
    <div class="doors" aria-hidden="true">
      <div class="door left"><span class="seam-glyph"></span></div>
      <div class="door right"><span class="seam-glyph"></span></div>
    </div>
  {/if}

  <div
    class="card panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lc-title"
    in:fly={{ y: 40, duration: 600 * m, delay: 700 * m }}
  >
    <p class="eyebrow carved">{level.id} · {level.title}</p>
    <h2 id="lc-title" class="inlaid">Komnata otevřena</h2>

    <blockquote class="quote">
      {#each lines as l, k (k)}<p>{l}</p>{/each}
      <cite>Echo</cite>
    </blockquote>

    <div class="seals">
      <Seal earned={result.seals.solved} title="Pečeť brány" caption="komnata otevřena" icon="diamond" />
      <Seal earned={result.seals.skill} title="Pečeť přesnosti" caption={movesText} icon="star" />
      <Seal
        earned={result.seals.pure}
        title="Pečeť odvahy"
        caption={courageText}
        icon="drop"
      />
    </div>

    {#if kodex}
      <div class="kodex parchment">
        <Glyph value={kodex.glyph} size={30} />
        <p>
          <span class="small">Kodex přeložil</span>
          <span class="names"><strong class="ancient"><Rich text={kodex.ancientName} /></strong> <Arrow label="se překládá jako" /> <strong><Rich text={kodex.modernName} /></strong></span>
        </p>
        <button type="button" class="btn btn-ghost" onclick={() => openKodex(kodex.id)}>Otevřít Kodex</button>
      </div>
    {/if}

    <div class="actions">
      {#if onBack}<button type="button" class="btn btn-ghost" onclick={onBack}>Zpět do komnaty</button>{/if}
      <button type="button" class="btn btn-ghost" onclick={onReplay}>Hrát znovu</button>
      {#if hasNext}
        <button type="button" class="btn btn-ghost" onclick={onMap}>Mapa</button>
        {#if onDeep}
          <!-- Po bráně patra dvě rovnocenné cesty: dolů do Hlubších síní, nebo nahoru do dalšího patra. -->
          <button type="button" class="btn btn-primary" onclick={onDeep}>Do Hlubších síní</button>
        {/if}
        <button type="button" class="btn btn-primary" onclick={onNext} use:autofocus>
          {floorDone ? 'Další patro' : 'Další komnata'}
        </button>
      {:else if onDeep}
        <button type="button" class="btn btn-ghost" onclick={onMap}>Mapa</button>
        <button type="button" class="btn btn-primary" onclick={onDeep} use:autofocus>Do Hlubších síní</button>
      {:else}
        <button type="button" class="btn btn-primary" onclick={onMap} use:autofocus>Zpět na mapu</button>
      {/if}
    </div>

    <!-- Připomínka: postup v prohlížeči školního počítače se po odhlášení ztratí. -->
    {#if fileLink.name}
      <p class="save-note saved"><Icon name="check" size={16} /> Postup se průběžně ukládá do souboru {fileLink.name}.</p>
    {:else}
      <p class="save-note">
        Postup je zatím jen v tomto prohlížeči.
        <button type="button" class="link-btn" onclick={() => saveToFile()}><Icon name="save" size={16} /> Ulož si ho do souboru</button>
      </p>
    {/if}
    {#if fileLink.message && !fileLink.name}<p class="save-note" class:err={fileLink.error} role="status">{fileLink.message}</p>{/if}

    {#if floorDone && hasNext}
      <p class="proto">
        Brána patra {floorDone.numeral} je otevřená. Schody vedou dál: {floorDone.next}. Otevřely se i Hlubší síně tohoto patra, nepovinné komnaty pro zvídavé.
      </p>
    {:else if floorDone}
      <p class="proto">
        Brána patra {floorDone.numeral} je otevřená a s ní i Hlubší síně tohoto patra. Dál prototyp zatím nevede{floorDone.next
          ? `, ${floorDone.next} ještě spí`
          : ''}.
      </p>
    {/if}
  </div>
</div>

<style>
  .wrap {
    position: fixed;
    inset: 0;
    z-index: 30;
    display: grid;
    place-items: center;
    padding: 16px;
    overflow: hidden auto;
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(5, 3, 1, 0.66);
    backdrop-filter: blur(3px);
  }
  /* Světlo, které se vyvalí ze dveří */
  .rays {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 160vmax;
    height: 160vmax;
    transform: translate(-50%, -50%);
    background:
      radial-gradient(circle, rgba(255, 200, 110, 0.3), rgba(255, 160, 60, 0.08) 30%, transparent 55%),
      repeating-conic-gradient(from 0deg, rgba(255, 210, 140, 0.07) 0deg 6deg, transparent 6deg 18deg);
    mask-image: radial-gradient(circle, #000 0%, transparent 55%);
    animation: rays-in 1.4s ease-out both 0.5s;
  }

  .doors {
    position: fixed;
    inset: 0;
    z-index: 2;
    display: flex;
    pointer-events: none;
    animation: rumble 0.45s linear both;
  }
  .door {
    position: relative;
    flex: 1;
    background-color: #4a3d30;
    background-image: var(--tex-grain), var(--tex-masonry), var(--tex-mottle), var(--tex-relief);
    background-size:
      240px 240px,
      520px 260px,
      700px 700px,
      512px 512px;
    background-blend-mode: normal, normal, normal, overlay;
    box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.6);
  }
  .door.left {
    border-right: 3px solid #120d08;
    animation: open-left 1.25s var(--heavy) both 0.4s;
  }
  .door.right {
    border-left: 2px solid rgba(255, 226, 180, 0.12);
    background-position: right top;
    animation: open-right 1.25s var(--heavy) both 0.4s;
  }
  /* Polovina vytesaného krystalu přes spáru dveří */
  .seam-glyph {
    position: absolute;
    top: 50%;
    width: 70px;
    height: 112px;
    margin-top: -56px;
    background: linear-gradient(135deg, #fff1c4, #f2c14e 50%, #b07a1a);
    clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%);
    filter: drop-shadow(0 0 18px rgba(242, 193, 78, 0.8));
  }
  .left .seam-glyph {
    right: -35px;
    clip-path: polygon(50% 0, 50% 100%, 0 74%, 0 26%);
  }
  .right .seam-glyph {
    left: -35px;
    clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%);
  }

  .card {
    position: relative;
    z-index: 1;
    width: min(640px, 100%);
    padding: 24px clamp(18px, 4vw, 34px) 24px;
    text-align: center;
  }
  h2 {
    margin: 4px 0 12px;
    font-size: clamp(1.8rem, 4.6vw, 2.4rem);
  }
  .quote {
    margin: 0 auto 20px;
    max-width: 46ch;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--fs-lg);
    line-height: 1.4;
    color: var(--text);
  }
  .quote p {
    margin: 0 0 6px;
  }
  cite {
    display: block;
    margin-top: 6px;
    font-family: var(--font-display);
    font-style: normal;
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--lumen);
  }
  .seals {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  .kodex {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    padding: 12px 16px;
    border-radius: 4px;
    text-align: left;
  }
  .kodex p {
    flex: 1;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .small {
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  .names .ancient {
    font-family: var(--font-display);
    color: var(--ink-red);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .save-note {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px 10px;
    margin: 14px 0 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .save-note.saved {
    color: var(--ok);
  }
  .save-note.err {
    color: var(--warn);
  }
  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid var(--lumen);
    border-radius: 4px;
    background: transparent;
    font: inherit;
    font-weight: 700;
    color: var(--lumen);
    cursor: pointer;
  }
  .link-btn:hover {
    background: rgba(255, 217, 138, 0.1);
  }
  .proto {
    margin: 16px 0 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  @keyframes open-left {
    to {
      transform: translateX(-102%);
    }
  }
  @keyframes open-right {
    to {
      transform: translateX(102%);
    }
  }
  @keyframes rumble {
    0%,
    100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-2px, 1px);
    }
    40% {
      transform: translate(2px, -1px);
    }
    60% {
      transform: translate(-1px, 1px);
    }
    80% {
      transform: translate(1px, 0);
    }
  }
  @keyframes rays-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (max-width: 520px) {
    .kodex {
      flex-wrap: wrap;
    }
    .seals {
      gap: 6px;
    }
  }
</style>
