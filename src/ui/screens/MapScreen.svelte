<script lang="ts">
  import { untrack } from 'svelte';
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import { fade } from 'svelte/transition';
  import { ACTS, BASIC_PATH, GATE, LEVELS, actOf, advancedRooms, basicRooms, gateOf, roomNumber } from '../../content/levels';
  import { go, openKodex, ui } from '../../game/nav.svelte.ts';
  import { isUnlocked, progress, sealCount, unseenKodex } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';
  import { fileLink } from '../../game/progressLink.svelte.ts';
  import { toHex } from '../../core/bits';

  const SEALS = ['solved', 'skill', 'pure'] as const;

  const open = (id: string) => !progress.levels[id] && isUnlocked(id);
  /** Nejbližší neotevřená komnata na základní cestě (napříč patry). */
  const basicNext = $derived(BASIC_PATH.find((l) => open(l.id))?.id ?? null);
  /**
   * Zobrazené patro: to s naposledy hranou komnatou (po bráně patra tak hráč hned vidí otevřené
   * Hlubší síně), po návratu odjinud naposledy prohlížené, jinak patro nejbližší komnaty.
   */
  let shown = $state(
    untrack(() => {
      const from = ui.lastRoom;
      ui.lastRoom = null;
      if (from && LEVELS.some((l) => l.id === from)) return ACTS.indexOf(actOf(from));
      if (ui.mapAct !== null) return ui.mapAct;
      return ACTS.indexOf(actOf(basicNext ?? LEVELS.find((l) => open(l.id))?.id ?? LEVELS[LEVELS.length - 1].id));
    }),
  );
  $effect(() => {
    ui.mapAct = shown;
  });
  /** Nejbližší komnata, která čeká na otevření: na základní cestě, a když je hotová, v Hlubších síních tohoto patra. */
  const nextId = $derived(
    basicNext ?? ACTS[shown].levels.find((l) => open(l.id))?.id ?? LEVELS.find((l) => open(l.id))?.id ?? null,
  );

  const act = $derived(ACTS[shown]);
  const below = $derived(ACTS[shown + 1] ?? null);
  const basic = $derived(basicRooms(act));
  const deep = $derived(advancedRooms(act));
  const done = $derived(basic.filter((l) => progress.levels[l.id]).length);
  const deepDone = $derived(deep.filter((l) => progress.levels[l.id]).length);
  /** Brána patra je otevřená: schody vedou dál a Hlubší síně se otevřely. */
  const actDone = $derived(!!progress.levels[gateOf(act)]);
  const roomIds = $derived(act.levels.map((l) => l.id));
  /** Místa pro Hlubší síně 8–15; komnaty, které prototyp ještě nemá, jsou zapečetěné. */
  const deepSlots = $derived(
    Array.from({ length: 8 }, (_, k) => {
      const n = GATE + 1 + k;
      return { n, level: deep.find((l) => roomNumber(l.id) === n) ?? null };
    }),
  );
  /** Uzly na trase: komnaty a na konci schodiště do dalšího patra. */
  const stops = $derived(basic.length + (below || act.nextAct ? 1 : 0));
  const actNext = $derived(basic.some((l) => l.id === nextId));
  /** Jak daleko vede červená trasa (podíl výšky cesty). */
  const routeShare = $derived(Math.min(1, (done + (actNext ? 0.5 : 0)) / Math.max(1, stops - 1)));
  const m = $derived(settings.reducedMotion ? 0 : 1);
  /** Po Řeči glyfů umí hráč číslo komnaty přečíst i šestnáctkově. */
  const hexKnown = $derived(progress.kodex.includes('glyf'));

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
    <span class="place carved hide-xs">Observatoř Světla a Stínu</span>
    <span class="spacer-xs" aria-hidden="true"></span>
    <div class="tools">
      {#if settings.teacher}
        <button type="button" class="icon-btn" onclick={() => go({ name: 'teacher' })} aria-label="Přehled třídy" title="Přehled třídy">
          <Icon name="teacher" />
        </button>
      {/if}
      <!-- Značka ukládání: zelená = postup se průběžně ukládá do souboru, okrová = jen v prohlížeči. -->
      <button
        type="button"
        class="icon-btn save-state"
        class:linked={!!fileLink.name}
        onclick={() => (ui.settingsOpen = true)}
        aria-label={fileLink.name ? `Postup se ukládá do souboru ${fileLink.name}` : 'Postup je jen v tomto prohlížeči. Ulož si ho do souboru.'}
        title={fileLink.name ? `Ukládá se do souboru ${fileLink.name}` : 'Postup je jen v tomto prohlížeči'}
      >
        <Icon name="save" />
        <span class="state-dot" aria-hidden="true"></span>
      </button>
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
              aria-label="Patro {a.numeral}{floorOpen(k) ? '' : ', zamčeno'}"
            >
              {#if !floorOpen(k)}<Icon name="lock" size={14} />{/if}
              <span class="word">Patro</span>&nbsp;{a.numeral}
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
          <span>{done} / {basic.length} komnat</span>
          {#if deep.length}
            <span class="sep" aria-hidden="true">·</span>
            <span>Hlubší síně {deepDone} / {deep.length}</span>
          {/if}
          <span class="sep" aria-hidden="true">·</span>
          <span>{sealCount(roomIds)} / {roomIds.length * 3} pečetí</span>
        </p>
        <button type="button" class="summary-btn" onclick={() => go({ name: 'summary', act: shown })}>
          <Icon name="print" size={16} /> Shrnutí patra
        </button>
      </section>

      <ol class="path" style:--route={routeShare}>
        {#each basic as l (l.id)}
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
                  <Glyph value={act.glyphBase + roomNumber(l.id)} size={32} />
                  {#if hexKnown}<span class="hex" aria-hidden="true">{toHex(roomNumber(l.id))}</span>{/if}
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
                <span class="soon">{actDone ? 'schody jsou volné' : 'otevře se po bráně patra'}</span>
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

      <!-- Hlubší síně: nepovinné komnaty 8–15, glyf má rozsvícenou i horní stranu. -->
      <section class="deep" aria-labelledby="deep-title">
        <h2 id="deep-title" class="deep-title">Hlubší síně</h2>
        <p class="deep-note">
          {actDone
            ? 'Nepovinné komnaty pro zvídavé. Na dveřích svítí i čtvrtá strana glyfu.'
            : `Nepovinné komnaty pro zvídavé. Otevřou se po bráně patra (komnata ${GATE}).`}
        </p>
        <ol class="deep-grid">
          {#each deepSlots as slot (slot.n)}
            {#if slot.level}
              {@const l = slot.level}
              {@const unlocked = isUnlocked(l.id)}
              {@const rec = progress.levels[l.id]}
              <li class="node small" class:done={!!rec} class:current={l.id === nextId} class:locked={!unlocked}>
                <button
                  type="button"
                  class="node-btn"
                  disabled={!unlocked}
                  onclick={() => go({ name: 'level', id: l.id })}
                  aria-label={nodeLabel(l.id, l.title)}
                >
                  <span class="medallion">
                    {#if unlocked}
                      <Glyph value={act.glyphBase + slot.n} size={26} />
                      {#if hexKnown}<span class="hex" aria-hidden="true">{toHex(slot.n)}</span>{/if}
                    {:else}
                      <Icon name="lock" size={17} />
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
            {:else}
              <li class="node small sealed">
                <div class="node-btn">
                  <span class="medallion" aria-hidden="true"><Glyph value={act.glyphBase + slot.n} size={26} /></span>
                  <span class="info">
                    <span class="code">{act.numeral}-{slot.n}</span>
                    <span class="name">Zapečetěná síň</span>
                    <span class="soon">v prototypu zatím spí</span>
                  </span>
                </div>
              </li>
            {/if}
          {/each}
        </ol>
      </section>
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
  .save-state {
    position: relative;
  }
  .state-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--warn);
    box-shadow: 0 0 6px rgba(240, 149, 122, 0.6);
  }
  .save-state.linked .state-dot {
    background: var(--ok);
    box-shadow: 0 0 6px rgba(127, 207, 180, 0.6);
  }
  .summary-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 4px 12px;
    border: 1.5px solid var(--ink-muted);
    border-radius: 4px;
    background: transparent;
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--ink-muted);
    cursor: pointer;
  }
  .summary-btn:hover {
    border-color: var(--ink-red);
    color: var(--ink-red);
  }
  /* Šestnáctkový znak komnaty (po Řeči glyfů) */
  .hex {
    position: absolute;
    right: -4px;
    bottom: -4px;
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: 10px;
    background: var(--parchment);
    border: 1.5px solid #5c4214;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: #2e1f06;
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
    flex-wrap: wrap;
    justify-content: center;
    gap: 2px 10px;
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
  .stats span {
    white-space: nowrap;
  }
  /* Hlubší síně: menší uzly ve dvou sloupcích pod hlavní cestou */
  .deep {
    max-width: 640px;
    margin: 30px auto 0;
    padding-top: 22px;
    border-top: 1.5px dashed rgba(92, 74, 51, 0.45);
  }
  .deep-title {
    margin: 0;
    text-align: center;
    font-size: var(--fs-xl);
    color: var(--ink);
  }
  .deep-note {
    margin: 4px 0 16px;
    text-align: center;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-md);
    color: var(--ink-muted);
  }
  .deep-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 14px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .small .node-btn {
    gap: 12px;
  }
  .small .medallion {
    width: 46px;
    height: 46px;
  }
  .small .name {
    font-size: var(--fs-base);
  }
  .small .go {
    padding: 3px 8px;
    font-size: var(--fs-xs);
  }
  .sealed {
    opacity: 0.55;
  }
  .sealed .medallion {
    border-style: dashed;
  }
  .sealed .name {
    font-weight: 400;
    font-style: italic;
  }
  .spacer-xs {
    display: none;
  }
  .floor {
    white-space: nowrap;
  }
  @media (max-width: 560px) {
    .deep-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    /* Statistika pod sebou: oddělovač by jinak mohl začínat řádek. */
    .stats {
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
    .stats .sep {
      display: none;
    }
    .floors {
      gap: 6px;
    }
    .floor {
      padding: 0 12px;
    }
    .compass {
      display: none;
    }
    .name {
      font-size: var(--fs-base);
    }
  }
  /* Malý telefon: na liště jen ikony, záložky pater jen římskou číslicí. */
  @media (max-width: 420px) {
    .spacer-xs {
      display: block;
      flex: 1;
    }
    .floor {
      min-width: 48px;
      justify-content: center;
      padding: 0 10px;
    }
    .floor .word {
      display: none;
    }
  }
</style>
