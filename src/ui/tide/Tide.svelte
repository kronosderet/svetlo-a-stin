<script lang="ts">
  import { untrack } from 'svelte';
  import CrystalRow, { type WeightState } from '../CrystalRow.svelte';
  import Disc from '../Disc.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import Lever from './Lever.svelte';
  import Scale from './Scale.svelte';
  import TideLedger from './TideLedger.svelte';
  import { GATE, GREAT_GATE, roomNumber } from '../../content/levels';
  import { isBitSet, toBinaryString } from '../../core/bits';
  import MiniPattern from '../MiniPattern.svelte';
  import type { TideOp } from '../../core/puzzles/tide';
  import { settings } from '../../game/settings.svelte.ts';
  import type { TideGame } from '../../game/tideGame.svelte.ts';

  let { game, pulse }: { game: TideGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const pres = $derived(level.presentation);
  const levers = $derived(pres.levers ?? 'math');
  const digits = $derived(pres.showDigits || settings.alwaysDigits);
  const value = $derived(game.value);

  const LEVER: Record<TideOp, { math: string; shift: string; caption: string; key: string; name: string }> = {
    shl: { math: '×2', shift: '←', caption: 'posun vlevo', key: '←', name: 'Posun vlevo' },
    shr: { math: '÷2', shift: '→', caption: 'posun vpravo', key: '→', name: 'Posun vpravo' },
    inc: { math: '+1', shift: '+1', caption: 'přidej jednu', key: '+', name: 'Přidej jednu' },
    dec: { math: '−1', shift: '−1', caption: 'uber jednu', key: '−', name: 'Uber jednu' },
    not: { math: '¬', shift: '¬', caption: 'převrať', key: 'N', name: 'Převrať všechna světla' },
  };

  let registerEl: HTMLElement | undefined = $state();

  // Posun: nové rozsvícení se objeví o lůžko vedle a dojede na místo, jako by se posunul
  // celý kamenný pás s krystaly.
  $effect(() => {
    const p = game.lastPull;
    if (!p || settings.reducedMotion) return;
    untrack(() => {
      if ((p.op !== 'shl' && p.op !== 'shr') || !registerEl) return;
      const cells = registerEl.querySelectorAll('.crystal');
      if (cells.length < 2) return;
      const pitch = cells[1].getBoundingClientRect().left - cells[0].getBoundingClientRect().left;
      registerEl.querySelector('.crystals')?.animate(
        [
          { transform: `translateX(${p.op === 'shl' ? pitch : -pitch}px)` },
          { transform: `translateX(${p.op === 'shl' ? -6 : 6}px)`, offset: 0.75 },
          { transform: 'translateX(0)' },
        ],
        { duration: 460, easing: 'cubic-bezier(.25,.8,.35,1)' },
      );
    });
  });

  function weightState(): WeightState {
    return settings.alwaysWeights ? 'known' : 'hidden';
  }

  function crystalLabel(i: number, k: number): string {
    return `Krystal ${k + 1} zleva: ${isBitSet(value, i) ? 'světlo' : 'stín'}`;
  }

  function leverLabel(op: TideOp): string {
    const l = LEVER[op];
    return levers === 'math' && (op === 'shl' || op === 'shr') ? `${l.name}, ${l.math}` : l.name;
  }
</script>

<div class="tide" class:with-ledger={pres.ledger}>
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <section class="main">
    <header class="task">
      <p class="task-text carved">{pres.task}</p>
      <div class="side">
        {#if pres.scale}
          <Scale target={game.demand} {value} />
        {:else}
          <Disc value={game.demandShown} turn={game.state.step * 60} label={[GATE, GREAT_GATE].includes(roomNumber(game.level.id)) ? 'Brána žádá' : 'Oltář žádá'} />
        {/if}
      </div>
      <Pips total={cfg.tasks.length} done={game.state.step} />
    </header>

    <!-- Řada světel: páky ji posouvají celou najednou. -->
    <div class="register" bind:this={registerEl}>
      <CrystalRow
        bits={cfg.bits}
        mask={value}
        {weightState}
        {digits}
        disabled={true}
        celebrate={game.phase === 'solved'}
        label="Světla: {value}"
        {crystalLabel}
        onToggle={() => {}}
      />
      {#key game.lastPull?.n}
        {#if game.lastPull && !settings.reducedMotion}
          {@const p = game.lastPull}
          {#if p.op === 'shl' || p.op === 'shr'}
            <span class="wave {p.op}" aria-hidden="true"></span>
          {/if}
          {#if p.spill === 'left' || p.spill === 'right'}
            <span class="spill {p.spill}" aria-hidden="true"></span>
          {:else if p.spill === 'wrap'}
            <span class="wrap" aria-hidden="true"></span>
          {/if}
        {/if}
      {/key}
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if game.phase === 'play'}
      <div class="readouts">
      {#if pres.showSum}
        <div class="sum stone-inset">
          <span>Světlo váží</span>
          <strong class="sum-value">{value}</strong>
        </div>
      {/if}
      {#if pres.remainder}
        {@const rem = game.remainder}
        <!-- Co spadne přes pravý okraj, chytí miska: to je zbytek po dělení. -->
        <div class="remainder stone-inset" role="status" aria-label="Miska zbytku: {rem.bits ? `${toBinaryString(rem.value, rem.bits)}, tedy ${rem.value}` : 'prázdná'}">
          <span class="rem-label carved">Zbytek</span>
          {#if rem.bits}
            <MiniPattern mask={rem.value} bits={rem.bits} size="sm" {digits} />
            <strong class="rem-value">{rem.value}</strong>
          {:else}
            <span class="rem-empty">miska je zatím prázdná</span>
          {/if}
        </div>
      {/if}
      </div>

      <div class="levers" role="group" aria-label="Páky" style:--n={cfg.ops.length}>
        {#each cfg.ops as op (op)}
          <Lever
            symbol={levers === 'math' ? LEVER[op].math : LEVER[op].shift}
            caption={LEVER[op].caption}
            keyHint={LEVER[op].key}
            highlight={game.hintOp === op}
            disabled={!game.playing && !game.free}
            label={leverLabel(op)}
            swing={op === 'shl' ? 'left' : 'right'}
            onPull={() => game.pull(op)}
          />
        {/each}
      </div>

      {#if game.limit !== null && game.movesLeft !== null}
        <div class="fate" role="status">
          <span>Osud dovolí ještě</span>
          <span class="stones" aria-hidden="true">
            {#each Array.from({ length: game.limit }, (_, k) => k) as k (k)}
              <span class="stone-pip" class:spent={k >= game.movesLeft}></span>
            {/each}
          </span>
          <strong>{game.movesLeft}</strong>
          <span>{game.movesLeft === 1 ? 'tah' : game.movesLeft >= 2 && game.movesLeft <= 4 ? 'tahy' : 'tahů'}</span>
        </div>
      {/if}
    {/if}
  </section>

  {#if pres.ledger}
    <TideLedger {cfg} trails={game.trails} {levers} />
  {/if}
</div>

<style>
  .tide {
    position: relative;
    width: 100%;
    display: grid;
    gap: var(--gap);
    align-items: center;
  }
  .tide.with-ledger {
    grid-template-columns: minmax(0, 1fr) 270px;
  }
  .pulse {
    position: absolute;
    inset: -12%;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 58%, rgba(255, 200, 110, 0.24), transparent 62%);
    animation: pulse 1s ease-out forwards;
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 2vh, 22px);
    min-width: 0;
  }
  .task {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }

  /* Řada je užší než u oltáře, aby se pod ni vešly páky i na nižší obrazovku. */
  .register {
    position: relative;
    width: min(100%, 520px);
    padding: 4px 0;
  }
  /* Vlna světla, která proběhne řadou ve směru posunu */
  .wave {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30%;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255, 214, 140, 0.28), transparent);
    mix-blend-mode: screen;
  }
  .wave.shl {
    animation: sweep-left 520ms ease-out forwards;
  }
  .wave.shr {
    animation: sweep-right 520ms ease-out forwards;
  }
  /* Světlo, které přepadlo přes okraj */
  .spill {
    position: absolute;
    top: 38%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 40% 35%, #fff6d6, #ffd98a 45%, #e7a43a);
    box-shadow: 0 0 14px rgba(255, 210, 130, 0.9);
  }
  .spill.left {
    left: 4%;
    animation: fall-left 900ms ease-in forwards;
  }
  .spill.right {
    right: 4%;
    animation: fall-right 900ms ease-in forwards;
  }
  .wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse, rgba(255, 214, 140, 0.25), transparent 70%);
    animation: pulse 700ms ease-out forwards;
  }

  .sum {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 6px 18px;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .sum-value {
    min-width: 2ch;
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    color: var(--text);
  }
  .readouts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px 14px;
    margin-bottom: 8px;
  }
  .readouts:empty {
    display: none;
  }
  .remainder {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    padding: 6px 16px;
    color: var(--text-muted);
  }
  .rem-label {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
  }
  .rem-value {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--text);
  }
  .rem-empty {
    font-style: italic;
    font-size: var(--fs-sm);
  }
  .levers {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 26px 16px;
    padding-top: 14px;
  }
  .fate {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 10px;
    color: var(--text-muted);
  }
  .fate strong {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--text);
  }
  .stones {
    display: inline-flex;
    gap: 6px;
  }
  .stone-pip {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f6e2a6, #c9a24a 55%, #6b4c14);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    transition:
      opacity var(--t-med),
      transform var(--t-med);
  }
  .stone-pip.spent {
    opacity: 0.25;
    transform: scale(0.7);
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes sweep-left {
    from {
      left: 85%;
      opacity: 1;
    }
    to {
      left: -30%;
      opacity: 0.4;
    }
  }
  @keyframes sweep-right {
    from {
      left: -15%;
      opacity: 1;
    }
    to {
      left: 100%;
      opacity: 0.4;
    }
  }
  @keyframes fall-left {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-40px, 90px) scale(0.4);
    }
  }
  @keyframes fall-right {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }
    100% {
      opacity: 0;
      transform: translate(40px, 90px) scale(0.4);
    }
  }

  /* Nízká široká obrazovka (1366 × 768): zadání stojí vedle krystalů, ne nad nimi. */
  @media (min-width: 900px) and (max-height: 820px) {
    .main {
      display: grid;
      grid-template-columns: auto minmax(0, 560px);
      justify-content: center;
      align-items: center;
      justify-items: center;
      column-gap: 36px;
      row-gap: 10px;
    }
    .main > :global(*) {
      grid-column: 1 / -1;
    }
    .task {
      display: contents;
    }
    .task-text {
      grid-column: 1 / -1;
      grid-row: 1;
    }
    .task > :global(.pips) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
    .side {
      grid-column: 1;
      grid-row: 3;
    }
    .register {
      grid-column: 2;
      grid-row: 3;
    }
  }
  @media (max-height: 820px) {
    .levers {
      padding-top: 10px;
    }
    .sum {
      padding: 2px 16px;
    }
    .sum-value {
      font-size: var(--fs-xl);
    }
  }
  @media (max-width: 880px) {
    .tide.with-ledger {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 560px) {
    .levers {
      display: grid;
      grid-template-columns: repeat(var(--n), minmax(0, 1fr));
      gap: 8px;
      width: 100%;
      max-width: 420px;
    }
  }
</style>
