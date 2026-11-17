<script lang="ts">
  import { fly } from 'svelte/transition';
  import CrystalRow from '../CrystalRow.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import RuneIcon from './RuneIcon.svelte';
  import { toBinaryString, toHex } from '../../core/bits';
  import { applyMask } from '../../core/puzzles/mask';
  import { RUNE_MODERN, RUNE_NAME } from '../../content/runes';
  import { settings } from '../../game/settings.svelte.ts';
  import type { MaskGame } from '../../game/maskGame.svelte.ts';

  let { game, pulse }: { game: MaskGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const bits = $derived(cfg.bits);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const result = $derived(applyMask(task.op, task.value, view.mask));
  const m = $derived(settings.reducedMotion ? 0 : 1);
  /** Šifra (Tajná řeč): u řad je i číslo a znak podle ASCII, nahoře přibývá rozluštěné slovo. */
  const cipher = $derived(cfg.tasks.some((t) => t.key !== undefined));
  const ascii = (v: number) => `${v} · ${v >= 33 && v < 127 ? String.fromCharCode(v) : '–'}`;
  /** Rozšifrovaná písmena: hotové úlohy, které zprávu odemykaly, a prázdná místa pro ty, co čekají. */
  const word = $derived.by(() => {
    if (!cipher) return [];
    const done = game.state.step;
    return cfg.tasks.flatMap((t, k) =>
      t.key !== undefined && !t.encrypt ? [k < done ? String.fromCharCode(t.value ^ t.key) : null] : [],
    );
  });
  /** Popisky řádků: u šifry podle toho, jestli se šifruje, nebo rozšifrovává. */
  const topLabel = $derived(task.encrypt ? 'Zpráva' : task.key !== undefined || cipher ? 'Šifra' : 'Nápis');
  const bottomLabel = $derived(task.encrypt ? 'Šifra' : task.key !== undefined || cipher ? 'Zpráva' : 'Výsledek');
</script>

<div class="mask-room">
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <header class="task">
    <p class="task-text carved">{level.presentation.task}</p>
    <Pips total={cfg.tasks.length} done={game.state.step} />
    {#if task.say}
      {#key task}
        <p class="say" in:fly={{ y: -8, duration: 300 * m }}>{task.say}</p>
      {/key}
    {/if}
  </header>

  <div class="work">
    <div class="mask-rows stone" style:--bits={bits}>
      <div class="mrow">
        <span class="mlabel carved">{topLabel}{#if cipher}<span class="ascii">{ascii(task.value)}</span>{/if}</span>
        <MiniPattern mask={task.value} {bits} size="lg" digits={true} label="Nápis {toBinaryString(task.value, bits)}" />
      </div>
      <div class="mrow op">
        <span class="mlabel carved">Runa</span>
        <span class="op-rune"><RuneIcon rune={task.op} size={26} /> {RUNE_NAME[task.op]} · <span class="modern">{RUNE_MODERN[task.op]}</span></span>
      </div>
      <div class="mrow mask-line">
        <span class="mlabel carved">Maska</span>
        <div class="crystals">
          <CrystalRow
            {bits}
            mask={view.mask}
            weightState={() => 'hidden'}
            digits={true}
            highlight={game.hintTarget}
            disabled={!game.playing && !game.free}
            celebrate={game.phase === 'solved'}
            label="Maska"
            crystalLabel={(i, k) => `Krystal masky ${k + 1} zleva`}
            onToggle={(i) => game.toggle(i)}
          />
        </div>
      </div>
      <div class="rule" aria-hidden="true"></div>
      <div class="mrow">
        <span class="mlabel carved">{bottomLabel}{#if cipher}<span class="ascii" class:hit={view.done}>{ascii(result)}</span>{/if}</span>
        <MiniPattern mask={result} {bits} size="lg" digits={true} label="Výsledek {toBinaryString(result, bits)}" />
      </div>
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else}
      <div class="side">
        {#if task.key !== undefined}
          <p class="side-title carved">Klíč</p>
          <div class="goal stone-inset">
            <MiniPattern mask={task.key} {bits} size="md" digits={true} label="Klíč {toBinaryString(task.key, bits)}" />
            <span class="hex">{toHex(task.key, Math.ceil(bits / 4))}</span>
          </div>
        {:else if task.target !== undefined}
          <p class="side-title carved">{cipher ? 'Má vyjít' : 'Oltář žádá'}</p>
          <div class="goal stone-inset">
            <MiniPattern mask={task.target} {bits} size="md" digits={true} label="Cíl {toBinaryString(task.target, bits)}" />
            {#if cipher}<span class="hex">{ascii(task.target)}</span>{/if}
          </div>
        {/if}
        {#if word.length}
          <!-- Rozluštěné slovo roste s každým písmenem: E, EC, ECH… -->
          <p class="side-title carved">Rozšifrováno</p>
          <p class="word" aria-label="Rozšifrováno: {word.filter(Boolean).join('') || 'zatím nic'}">
            {#each word as ch, k (k)}
              {#if ch}<span class="letter" in:fly={{ y: 10, duration: 400 * m }}>{ch}</span>{:else}<span class="letter blank">·</span>{/if}
            {/each}
          </p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .mask-room {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.6vh, 18px);
  }
  .pulse {
    position: absolute;
    inset: -10%;
    pointer-events: none;
    background: radial-gradient(ellipse, rgba(255, 214, 140, 0.22), transparent 65%);
    animation: pulse 700ms ease-out forwards;
  }
  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .task {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .say {
    margin: 0;
    font-weight: 700;
    color: var(--text);
  }
  .work {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px 40px;
    width: 100%;
  }
  .mask-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: min(100%, 640px);
    padding: 12px 18px;
    border-radius: 14px;
  }
  .mrow {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    align-items: center;
    justify-items: center;
  }
  .mlabel {
    justify-self: start;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .op-rune {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--lumen);
  }
  .modern {
    font-family: var(--font-mono);
  }
  .crystals {
    width: 100%;
  }
  .rule {
    height: 2px;
    margin: 2px 0;
    background: rgba(255, 236, 200, 0.18);
  }
  .side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .side-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .goal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
  }
  .hex {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--lumen);
  }
  .ascii {
    display: block;
    margin-top: 2px;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    letter-spacing: 0;
    text-transform: none;
    color: var(--stone-200);
  }
  .ascii.hit {
    color: var(--lumen);
  }
  .word {
    display: flex;
    gap: 6px;
    margin: 0;
  }
  .letter.blank {
    color: var(--stone-400);
    text-shadow: none;
  }
  .letter {
    font-family: var(--font-display);
    font-size: var(--fs-3xl);
    font-weight: 700;
    color: var(--lumen);
    text-shadow: 0 0 12px rgba(255, 210, 130, 0.6);
  }
  @media (max-height: 820px) {
    .mask-rows {
      gap: 4px;
      padding: 8px 14px;
    }
  }
  /* Telefon na šířku: cíl (oltář, klíč) vedle řad, hustší řady. */
  @media (max-height: 500px) and (orientation: landscape) {
    .mask-room {
      gap: 4px;
    }
    .task {
      gap: 2px;
    }
    .task-text {
      font-size: var(--fs-sm);
    }
    .work {
      flex-wrap: nowrap;
      align-items: center;
      gap: 16px;
    }
    .mask-rows {
      gap: 2px;
      padding: 6px 14px;
    }
    .mask-rows :global(.mini.lg svg) {
      width: 22px !important;
    }
    .mask-rows .mask-line :global(.byte .crystals) {
      --crystal-w: 26px !important;
    }
  }
  /*
   * Telefon: popisky nad řadami a v každé řadě stejně široké sloupce, ať krystal masky stojí přesně
   * pod svým krystalem nápisu i výsledku. Maska se nezalamuje do dvou čtveřic.
   */
  @media (max-width: 560px) {
    .mask-rows {
      padding: 10px;
    }
    .mrow {
      grid-template-columns: minmax(0, 1fr);
      justify-items: stretch;
      gap: 2px;
    }
    .mrow.op {
      justify-items: center;
    }
  }
  /* Osm stejně širokých sloupců na telefonu na výšku i na šířku (tam zůstávají popisky vlevo). */
  @media (max-width: 560px), (max-height: 500px) and (orientation: landscape) {
    .mrow:not(.op) {
      justify-items: stretch;
    }
    .mask-rows :global(.mini.lg) {
      display: grid;
      grid-template-columns: repeat(var(--bits), minmax(0, 1fr));
      justify-items: center;
      gap: 0;
      width: 100%;
    }
    .mask-rows :global(.mini.lg svg) {
      width: min(26px, 6.4vw);
    }
    .mask-rows .mask-line :global(.byte .crystals) {
      --per-row: var(--bits);
      --crystal-w: min(30px, 7vw);
      grid-template-columns: repeat(var(--bits), minmax(0, 1fr));
      justify-items: center;
      column-gap: 0;
    }
    .mask-rows .mask-line :global(.byte .crystals > :nth-child(5)) {
      margin-left: 0;
    }
  }
</style>
