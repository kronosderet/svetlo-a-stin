<script lang="ts">
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import { fade } from 'svelte/transition';
  import { ACTS, LEVELS, actOf } from '../../content/levels';
  import { go, openKodex, ui } from '../../game/nav.svelte.ts';
  import { isUnlocked, progress, sealCount, unseenKodex } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';

  const SEALS = ['solved', 'skill', 'pure'] as const;

  /** Nejbližší komnata, která čeká na otevření (napříč patry). */
  const nextId = $derived(LEVELS.find((l) => !progress.levels[l.id] && isUnlocked(l.id))?.id ?? null);
  /** Zobrazené patro: na začátku to, kde hráč právě je. */
  let shown = $state(ACTS.indexOf(actOf(LEVELS.find((l) => !progress.levels[l.id])?.id ?? LEVELS[LEVELS.length - 1].id)));

  const act = $derived(ACTS[shown]);
  const below = $derived(ACTS[shown + 1] ?? null);
  const totalRooms = $derived(act.levels.length);
  const done = $derived(act.levels.filter((l) => progress.levels[l.id]).length);
  const actDone = $derived(done === totalRooms);
  const roomIds = $derived(act.levels.map((l) => l.id));
  /** Uzly na trase: komnaty a na konci schodiště do dalšího patra. */
  const stops = $derived(totalRooms + (below || act.nextAct ? 1 : 0));
  const actNext = $derived(act.levels.some((l) => l.id === nextId));
  /** Jak daleko vede červená trasa (podíl výšky cesty). */
  const routeShare = $derived(Math.min(1, (done + (actNext ? 0.5 : 0)) / Math.max(1, stops - 1)));
  const m = $derived(settings.reducedMotion ? 0 : 1);

  function floorOpen(k: number): boolean {
    return isUnlocked(ACTS[k].levels[0].id);
  }

  function nodeLabel(id: string, title: string): string {
    const rec = progress.levels[id];
    if (!isUnlocked(id)) return `${id} ${title}, zamčeno`;
    if (!rec) return `${id} ${title}, neprozkoumáno`;
    const n = SEALS.filter((s) => rec.seals[s]).length;
    return `${id} ${title}, otevřeno, pečetě ${n} ze 3`;
  }
</script>

<div class="map">
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'title' })} aria-label="Na úvodní obrazovku">
      <Icon name="back" />
    </button>
    <span class="place carved">Observatoř Světla a Stínu</span>
    <div class="tools">
      <button type="button" class="icon-btn" onclick={() => (ui.settingsOpen = true)} aria-label="Nastavení" title="Nastavení">
        <Icon name="settings" />
      </button>
      <button type="button" class="btn btn-ghost kodex-btn" onclick={() => openKodex()}>
        <Icon name="book" /> <span class="hide-narrow">Kodex</span>
        {#if unseenKodex().length > 0}<span class="new-dot" aria-label="nové záznamy"></span>{/if}
      </button>
    </div>
  </header>

  <!-- Mapa badatele na pergamenu, připíchnutá na dřevěné desce. -->
  <div class="board wood">
    <div class="sheet parchment">
      <span class="pin tl" aria-hidden="true"></span>
      <span class="pin tr" aria-hidden="true"></span>
      <svg class="compass" viewBox="-50 -50 100 100" aria-hidden="true">
        <circle r="44" />
        <circle r="36" />
        <path d="M0 -46 L7 0 L0 46 L-7 0Z M-46 0 L0 -7 L46 0 L0 7Z" />
        <text y="-31" text-anchor="middle">S</text>
      </svg>

      {#if ACTS.length > 1}
        <div class="floors" role="group" aria-label="Patra observatoře">
          {#each ACTS as a, k (a.numeral)}
            <button
              type="button"
              class="floor"
              class:active={k === shown}
              aria-pressed={k === shown}
              disabled={!floorOpen(k)}
              onclick={() => (shown = k)}
            >
              {#if !floorOpen(k)}<Icon name="lock" size={14} />{/if}
              Patro {a.numeral}
            </button>
          {/each}
        </div>
      {/if}

      {#key shown}
      <div class="floor-sheet" in:fade={{ duration: 260 * m }}>
      <section class="head">
        <p class="eyebrow">Akt {act.numeral} · {act.theme}</p>
        <h1>{act.title}</h1>
        <p class="stats">
          <span>{done} / {totalRooms} komnat</span>
          <span aria-hidden="true">·</span>
          <span>{sealCount(roomIds)} / {totalRooms * 3} pečetí</span>
        </p>
      </section>

      <ol class="path" style:--route={routeShare}>
        {#each act.levels as l, k (l.id)}
          {@const unlocked = isUnlocked(l.id)}
          {@const rec = progress.levels[l.id]}
          <li class="node" class:done={!!rec} class:current={l.id === nextId} class:locked={!unlocked}>
            <button
              type="button"
              class="node-btn"
              disabled={!unlocked}
              onclick={() => go({ name: 'level', id: l.id })}
              aria-label={nodeLabel(l.id, l.title)}
            >
              <span class="medallion">
                {#if unlocked}
                  <Glyph value={act.glyphBase + k + 1} size={32} />
                {:else}
                  <Icon name="lock" size={20} />
                {/if}
              </span>
              <span class="info">
                <span class="code">{l.id}</span>
                <span class="name">{l.title}</span>
                <span class="seals" aria-hidden="true">
                  {#each SEALS as s (s)}<span class="s" class:on={rec?.seals[s]}></span>{/each}
                </span>
              </span>
              {#if l.id === nextId}<span class="go">Vstoupit</span>{/if}
            </button>
          </li>
        {/each}
        {#if below}
          <!-- Schody do dalšího patra, které prototyp obsahuje -->
          <li class="node upcoming" class:locked={!actDone} class:done={actDone}>
            <button
              type="button"
              class="node-btn"
              disabled={!actDone}
              onclick={() => (shown += 1)}
              aria-label="Schody do patra {below.numeral}: {below.title}{actDone ? '' : ', zatím zavřeno'}"
            >
              <span class="medallion stairs" aria-hidden="true">
                <svg viewBox="0 0 32 32">
                  <path d="M4 27h7v-6h6v-6h6V9h5" />
                </svg>
              </span>
              <span class="info">
                <span class="code">Akt {below.numeral} · {below.theme}</span>
                <span class="name">{below.title}</span>
                <span class="soon">{actDone ? 'schody jsou volné' : 'otevře se po poslední komnatě'}</span>
              </span>
              {#if actDone}<span class="go">Jít dál</span>{/if}
            </button>
          </li>
        {:else if act.nextAct}
          <li class="node upcoming" class:locked={!actDone} class:done={actDone}>
            <div class="node-btn" aria-label="Akt {act.nextAct.numeral}: {act.nextAct.title}, mimo prototyp">
              <span class="medallion stairs" aria-hidden="true">
                <svg viewBox="0 0 32 32">
                  <path d="M4 27h7v-6h6v-6h6V9h5" />
                </svg>
              </span>
              <span class="info">
                <span class="code">Akt {act.nextAct.numeral} · {act.nextAct.theme}</span>
                <span class="name">{act.nextAct.title}</span>
                <span class="soon">{actDone ? 'schody jsou volné, patro ale v prototypu ještě není' : 'mimo prototyp'}</span>
              </span>
            </div>
          </li>
        {/if}
      </ol>
      </div>
      {/key}
    </div>
  </div>
</div>

<style>
  .map {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px 48px;
  }
  .place {
    flex: 1;
    text-align: center;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    color: var(--text-muted);
    text-transform: uppercase;
  }
  .kodex-btn {
    position: relative;
    padding: 0 14px;
  }
  .kodex-btn .new-dot {
    position: absolute;
    top: 7px;
    right: 7px;
  }

  .board {
    margin-top: 22px;
    padding: clamp(10px, 2.4vw, 22px);
    border-radius: 8px;
    box-shadow:
      inset 0 1px 0 rgba(255, 210, 150, 0.2),
      inset 0 -3px 0 rgba(0, 0, 0, 0.45),
      0 20px 50px rgba(0, 0, 0, 0.55);
  }
  .sheet {
    position: relative;
    padding: clamp(18px, 4vw, 34px) clamp(14px, 4vw, 40px) 36px;
    border-radius: 3px;
    transform: rotate(-0.4deg);
  }
  .pin {
    position: absolute;
    top: 12px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f6e2a6, #a8822f 55%, #4d3810);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  }
  .pin.tl {
    left: 12px;
  }
  .pin.tr {
    right: 12px;
  }
  .compass {
    position: absolute;
    top: 18px;
    right: 26px;
    width: 64px;
    height: 64px;
    opacity: 0.5;
  }
  .compass circle,
  .compass path {
    fill: none;
    stroke: var(--ink-muted);
    stroke-width: 1.5;
  }
  .compass text {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    fill: var(--ink-muted);
  }

  .head {
    margin-bottom: 26px;
    text-align: center;
  }
  /* Přepínač pater: záložky vlepené do mapy */
  .floors {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 0 0 18px;
  }
  .floor {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 0 16px;
    border: 1.5px solid var(--ink-muted);
    border-radius: 4px;
    background: transparent;
    font-family: var(--font-body);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--ink-muted);
    cursor: pointer;
  }
  .floor:hover:not(:disabled) {
    background: rgba(92, 74, 51, 0.1);
  }
  .floor.active {
    border-color: var(--ink-red);
    background: rgba(143, 47, 23, 0.08);
    color: var(--ink-red);
  }
  .floor:disabled {
    opacity: 0.55;
    cursor: default;
  }
  .head .eyebrow {
    color: var(--ink-muted);
  }
  h1 {
    margin: 6px 0 8px;
    font-size: clamp(var(--fs-2xl), 5vw, 2.5rem);
    color: var(--ink);
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 0;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-md);
    color: var(--ink-muted);
  }

  .path {
    position: relative;
    max-width: 540px;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  /* Trasa: prozkoumaná část červeným inkoustem, zbytek tužkou */
  .path::before {
    content: '';
    position: absolute;
    left: 35px;
    top: 34px;
    bottom: 34px;
    width: 3px;
    background: linear-gradient(
      var(--ink-red) 0,
      var(--ink-red) calc(var(--route) * 100%),
      rgba(92, 74, 51, 0.45) calc(var(--route) * 100%)
    );
    mask-image: repeating-linear-gradient(180deg, #000 0 9px, transparent 9px 16px);
  }
  .node-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 6px 12px 6px 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
    transition:
      background var(--t-fast),
      border-color var(--t-fast);
  }
  button.node-btn:hover:not(:disabled) {
    background: rgba(92, 74, 51, 0.1);
    border-color: rgba(92, 74, 51, 0.3);
  }
  .node-btn:disabled {
    cursor: default;
  }
  .medallion {
    position: relative;
    z-index: 1;
    flex: none;
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid var(--ink-muted);
    background: var(--parchment);
    color: var(--ink-muted);
  }
  .done .medallion {
    border-color: #5c4214;
    background: radial-gradient(circle at 35% 30%, #f6e2a6, #c9a24a 55%, #7d5c1e);
    box-shadow: 0 2px 3px rgba(60, 40, 10, 0.4);
    --umbra: rgba(61, 44, 12, 0.35);
    --lumen: #2e1f06;
  }
  .current .medallion {
    border: 2.5px solid var(--ink-red);
  }
  .current .medallion::after {
    /* „tady“ – červený inkoustový kroužek */
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px dashed var(--ink-red);
    border-radius: 50%;
    animation: spin 20s linear infinite;
  }
  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .code {
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--ink-red);
  }
  .name {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    font-weight: 700;
    line-height: 1.1;
    color: var(--ink);
  }
  .seals {
    display: flex;
    gap: 7px;
    margin-top: 5px;
  }
  .s {
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border: 1.5px solid var(--ink-muted);
  }
  .s.on {
    background: radial-gradient(circle at 35% 30%, #f6e2a6, #c9a24a 55%, #7d5c1e);
    border-color: #5c4214;
  }
  /* Razítko „Vstoupit“ */
  .go {
    padding: 4px 12px;
    border: 2px solid var(--ink-red);
    border-radius: 4px;
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-red);
    transform: rotate(-5deg);
  }
  .locked .info {
    opacity: 0.6;
  }
  .upcoming .code {
    color: var(--ink-muted);
  }
  .stairs svg {
    width: 30px;
    height: 30px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .done .stairs {
    color: #2e1f06;
  }
  .soon {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  @media (max-width: 560px) {
    .compass {
      display: none;
    }
    .name {
      font-size: var(--fs-base);
    }
  }
</style>
