<script lang="ts">
  import RuneIcon from '../gate/RuneIcon.svelte';
  import Icon from '../Icon.svelte';
  import { ARITY, type Rune } from '../../core/logic';
  import {
    LIGHT,
    PARTS,
    SHADOW,
    lampKey,
    outputsOf,
    settle,
    socketKey,
    sourceOf,
    sockets,
    type Machine,
    type MachineInput,
    type MachineLamp,
    type MachineNode,
    type Pin,
  } from '../../core/puzzles/machine';
  import { RUNE_KODEX, RUNE_MODERN, RUNE_NAME } from '../../content/runes';
  import { progress } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';
  import { partWords } from '../screens/level/machineEvents';
  import { G, PIN, frameOf, partSize } from './layout';
  import { fromWords, seatWords } from '../../game/machineWords';

  interface Props {
    machine: Machine;
    /** Vstupy jako řádek tabulky (první vstup je nejvyšší bit). */
    inputs: number;
    runes: Record<string, Rune>;
    wires: Record<string, string>;
    memory: Record<string, number>;
    canToggle: boolean;
    canPlace: boolean;
    /** Číslice 0/1 u krystalů a lamp a moderní značky run (po překladu v Kodexu). */
    modern: boolean;
    /** Váhy pod krystaly a lampami, které tvoří číslo. */
    weights: boolean;
    highlight?: { input: number } | { node: string } | { socket: string } | null;
    celebrate?: boolean;
    onInput?: (index: number) => void;
    onSlot?: (node: string) => void;
    onSocket?: (key: string) => void;
  }

  let {
    machine,
    inputs,
    runes,
    wires,
    memory,
    canToggle,
    canPlace,
    modern,
    weights,
    highlight = null,
    celebrate = false,
    onInput,
    onSlot,
    onSocket,
  }: Props = $props();

  /**
   * Deska se nezmenší pod tenhle zlomek: písmo by bylo nečitelné. Užší místo desku posouvá do strany.
   * Telefon na šířku smí jít níž (--k-min z Dílny), aby byla vidět celá deska najednou.
   */
  const K_MIN = 0.7;

  type P = { x: number; y: number };
  type PinPos = P & { nx: number; ny: number };

  const settled = $derived(settle(machine, runes, wires, inputs, memory));
  const values = $derived(settled.values);
  const n = $derived(machine.inputs.length);
  const numbered = $derived(sockets(machine).length > 0);
  const nodeNo = (id: string) => machine.nodes.findIndex((g) => g.id === id) + 1;

  /** Váha krystalu nebo lampy, která je součástí čísla. */
  const weightOf = $derived.by(() => {
    const out: Record<string, number> = {};
    for (const g of machine.numbers ?? []) g.bits.forEach((id, i) => (out[id] = 2 ** (g.bits.length - 1 - i)));
    return out;
  });



  /** Posun, aby celý stroj začínal na okraji desky. */
  const frame = $derived(frameOf(machine));
  const W = $derived(frame.W);
  const H = $derived(frame.H);
  const at = (x: number, y: number): P => ({ x: x * G + frame.dx, y: y * G + frame.dy });

  /* ── kolíky ── */
  function inputPin(i: MachineInput): PinPos {
    const p = at(i.x, i.y);
    return i.out === 'down' ? { x: p.x, y: p.y + 30, nx: 0, ny: 1 } : { x: p.x + 26, y: p.y, nx: 1, ny: 0 };
  }
  function nodeIn(g: MachineNode, k: number): PinPos {
    const p = at(g.x, g.y);
    if (g.part) {
      const { w, h } = partSize(g);
      if (g.turn === 'column') {
        if (k === 0) return { x: p.x - 24, y: p.y - h / 2, nx: 0, ny: -1 };
        if (k === 1) return { x: p.x + 24, y: p.y - h / 2, nx: 0, ny: -1 };
        return { x: p.x + w / 2, y: p.y, nx: 1, ny: 0 };
      }
      const m = PARTS[g.part].ins.length;
      return { x: p.x - w / 2, y: p.y + (k - (m - 1) / 2) * PIN, nx: -1, ny: 0 };
    }
    const two = ARITY[g.rune ?? g.choices?.[0] ?? 'id'] === 2;
    const off = two ? (k === 0 ? -16 : 16) : 0;
    if (g.turn === 'down') return { x: p.x + off, y: p.y - 34, nx: 0, ny: -1 };
    return { x: p.x - 34, y: p.y + off, nx: -1, ny: 0 };
  }
  function nodeOut(g: MachineNode, j: number): PinPos {
    const p = at(g.x, g.y);
    if (g.part) {
      const { w, h } = partSize(g);
      if (g.turn === 'column') return j === 0 ? { x: p.x, y: p.y + h / 2, nx: 0, ny: 1 } : { x: p.x - w / 2, y: p.y, nx: -1, ny: 0 };
      const m = PARTS[g.part].outs.length;
      // U sčítačky je přenos vyšší řád: kolík P je nahoře, součet S pod ním.
      const row = g.part === 'half' || g.part === 'full' ? m - 1 - j : j;
      return { x: p.x + w / 2, y: p.y + (row - (m - 1) / 2) * PIN, nx: 1, ny: 0 };
    }
    if (g.turn === 'down') return { x: p.x, y: p.y + 34, nx: 0, ny: 1 };
    return { x: p.x + 34, y: p.y, nx: 1, ny: 0 };
  }
  function lampPin(l: MachineLamp): PinPos {
    const p = at(l.x, l.y);
    if (l.from === 'top') return { x: p.x, y: p.y - 24, nx: 0, ny: -1 };
    if (l.from === 'bottom') return { x: p.x, y: p.y + 24, nx: 0, ny: 1 };
    return { x: p.x - 24, y: p.y, nx: -1, ny: 0 };
  }

  /** Kde světlo ze zdroje vychází (null u stálého světla a stínu: ty vodič nemají). */
  function sourcePin(src: string): PinPos | null {
    if (src === SHADOW || src === LIGHT) return null;
    const inp = machine.inputs.find((i) => i.id === src);
    if (inp) return inputPin(inp);
    const [id] = src.split('.');
    const g = machine.nodes.find((x) => x.id === id);
    if (!g) return null;
    return nodeOut(g, Math.max(0, outputsOf(g).indexOf(src)));
  }

  /**
   * Krátký název zdroje na točitém kameni. Vstupy se stejným písmenem (A₂ a A₁, O₂ a O₁) dostanou
   * váhu jako index, jinak by kámen ukazoval u obou voleb totéž.
   */
  function sourceLabel(src: string): { text: string; sub: string } {
    if (src === SHADOW || src === LIGHT) return { text: src, sub: '' };
    const inp = machine.inputs.find((i) => i.id === src);
    if (inp) {
      const name = inp.label ?? inp.id;
      const shared = machine.inputs.filter((i) => (i.label ?? i.id) === name).length > 1;
      return { text: name, sub: shared && weightOf[inp.id] ? String(weightOf[inp.id]) : '' };
    }
    const [id, out] = src.split('.');
    return { text: `${nodeNo(id)}${out ?? ''}`, sub: '' };
  }

  type Wire = { d: string; on: boolean; dead: boolean };
  type Seat = { key: string; at: P; owner: string; src: string | null; choices: string[] };
  type Mark = { at: P; on: boolean };

  function curve(a: PinPos, b: PinPos): string {
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const k = Math.max(18, Math.min(110, dist * 0.42));
    return `M${a.x} ${a.y}C${a.x + a.nx * k} ${a.y + a.ny * k} ${b.x + b.nx * k} ${b.y + b.ny * k} ${b.x} ${b.y}`;
  }

  /** Vodiče, točité kameny a značky stálého světla či stínu u kolíků. */
  const layout = $derived.by(() => {
    const wiresOut: Wire[] = [];
    const seats: Seat[] = [];
    const marks: Mark[] = [];
    const connect = (pin: Pin, key: string, target: PinPos, owner: string) => {
      const src = sourceOf(pin, key, wires);
      let end = target;
      if (Array.isArray(pin)) {
        const c = { x: target.x + target.nx * 17, y: target.y + target.ny * 17 };
        seats.push({ key, at: c, owner, src, choices: pin });
        end = { x: c.x + target.nx * 13, y: c.y + target.ny * 13, nx: target.nx, ny: target.ny };
        // Krátký kousek vodiče od točitého kamene ke kolíku.
        const v = src === null ? null : (values[src] ?? null);
        wiresOut.push({ d: `M${c.x} ${c.y}L${target.x} ${target.y}`, on: v === 1, dead: v === null });
      }
      if (src === null) return;
      const from = sourcePin(src);
      const v = values[src] ?? null;
      if (!from) {
        if (!Array.isArray(pin)) marks.push({ at: { x: target.x + target.nx * 9, y: target.y + target.ny * 9 }, on: src === LIGHT });
        return;
      }
      wiresOut.push({ d: curve(from, end), on: v === 1, dead: v === null });
    };
    for (const g of machine.nodes) g.in.forEach((pin, k) => connect(pin, socketKey(g.id, k), nodeIn(g, k), g.id));
    for (const l of machine.lamps) connect(l.in, lampKey(l.id), lampPin(l), lampKey(l.id));
    return { wires: wiresOut, seats, marks };
  });

  const pct = (x: number, total: number) => `${(x / total) * 100}%`;
  let boxW = $state(0);
  const k = $derived(boxW ? Math.min(1, boxW / W) : 1);
  const inputOn = (i: number) => ((inputs >> (n - 1 - i)) & 1) === 1;
  const lampOn = (l: MachineLamp) => settled.lamps[l.id] === 1;
  const runeOf = (g: MachineNode): Rune | null => g.rune ?? runes[g.id] ?? null;
  const outOn = (g: MachineNode, j: number) => values[outputsOf(g)[j]] === 1;

  const PART_NAME: Record<string, string> = {
    half: 'Poloviční sčítačka',
    full: 'Úplná sčítačka',
    mux: 'Výhybka',
    dec: 'Rozdělovač',
    latch: 'Ozvěna',
    flip: 'Ozvěna s tepem',
  };

  /** Popisky kolíků součástky (uvnitř kamene u jeho okraje). */
  function pinLabels(g: MachineNode): { text: string; at: P; on: boolean }[] {
    const c = at(g.x, g.y);
    const spec = PARTS[g.part!];
    const inset = (p: PinPos) => ({ x: p.x - p.nx * 11 - c.x, y: p.y - p.ny * 10 - c.y });
    return [
      ...spec.ins.map((t, j) => ({ text: t, at: inset(nodeIn(g, j)), on: false })),
      ...spec.outs.map((t, j) => ({ text: t, at: inset(nodeOut(g, j)), on: outOn(g, j) })),
    ];
  }

  function nodeLabel(g: MachineNode): string {
    if (g.part) {
      const outs = outputsOf(g)
        .map((key, j) => `${PARTS[g.part!].outs[j]} ${values[key] === 1 ? 'světlo' : 'stín'}`)
        .join(', ');
      return `Součástka ${nodeNo(g.id)}: ${partWords(g.part)}. ${outs}.`;
    }
    const r = runeOf(g);
    if (!g.rune) return r ? `Kámen ${nodeNo(g.id)} s runou ${RUNE_NAME[r]}. Kliknutím vyber jinou.` : `Prázdný kámen ${nodeNo(g.id)}. Kliknutím vlož runu.`;
    return `Runa ${RUNE_NAME[r!]}`;
  }

  function seatLabel(s: Seat): string {
    return `Točitý kámen ${seatWords(machine, s.key)}: ${s.src ? `světlo teče ${fromWords(machine, s.src)}` : 'nenastavený'}. Kliknutím pootočíš.`;
  }

  const translated = (r: Rune) => !!RUNE_MODERN[r] && (settings.alwaysDigits || progress.kodex.includes(RUNE_KODEX[r] ?? ''));
</script>

<div class="machine stone" class:celebrate style:width="max(min(100%, {W}px, max(340px, calc((100dvh - var(--bench-reserve, 330px)) * {W / H}))), calc({W}px * var(--k-min, {K_MIN})))" style:aspect-ratio="{W} / {H}" style:--k={k} bind:clientWidth={boxW}>
  <svg class="wires" viewBox="0 0 {W} {H}" aria-hidden="true">
    {#each layout.wires as w, i (i)}
      <path class="groove" d={w.d} />
      <path class="flow" class:on={w.on} class:dead={w.dead} d={w.d} />
    {/each}
    {#each layout.marks as mk, i (i)}
      <circle class="const" class:on={mk.on} cx={mk.at.x} cy={mk.at.y} r="5" />
    {/each}
  </svg>

  {#each machine.inputs as inp, i (inp.id)}
    {@const p = at(inp.x, inp.y)}
    <div class="slot-pos" style:left={pct(p.x, W)} style:top={pct(p.y, H)}>
      <button
        type="button"
        class="input"
        class:on={inputOn(i)}
        class:hl={highlight && 'input' in highlight && highlight.input === i}
        disabled={!canToggle}
        aria-pressed={inputOn(i)}
        aria-label="Vstup {inp.label ?? inp.id}{weightOf[inp.id] ? ` s váhou ${weightOf[inp.id]}` : ''}: {inputOn(i) ? 'světlo' : 'stín'}"
        onclick={() => onInput?.(i)}
      >
        <span class="name carved">{inp.label ?? inp.id}</span>
        <svg class="gem" viewBox="0 0 20 32" aria-hidden="true">
          <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
        </svg>
        {#if weights && weightOf[inp.id]}
          <span class="under weight">{weightOf[inp.id]}</span>
        {:else if modern}
          <span class="under">{inputOn(i) ? 1 : 0}</span>
        {/if}
      </button>
    </div>
  {/each}

  {#each layout.seats as s (s.key)}
    <div class="slot-pos" style:left={pct(s.at.x, W)} style:top={pct(s.at.y, H)}>
      <button
        type="button"
        class="socket"
        class:set={!!s.src}
        class:lit={!!s.src && values[s.src] === 1}
        class:letter={!!s.src && machine.inputs.some((i) => i.id === s.src)}
        class:hl={highlight && 'socket' in highlight && highlight.socket === s.key}
        disabled={!canPlace}
        aria-label={seatLabel(s)}
        onclick={() => onSocket?.(s.key)}
      >
        {#if s.src}{@const lab = sourceLabel(s.src)}{lab.text}{#if lab.sub}<sub>{lab.sub}</sub>{/if}{:else}·{/if}
      </button>
    </div>
  {/each}

  {#each machine.nodes as g (g.id)}
    {@const p = at(g.x, g.y)}
    <div class="slot-pos" style:left={pct(p.x, W)} style:top={pct(p.y, H)}>
      {#if g.part}
        {@const s = partSize(g)}
        <div
          class="part"
          class:column={g.turn === 'column'}
          class:memory={g.part === 'latch' || g.part === 'flip'}
          class:lit={(g.part === 'latch' || g.part === 'flip') && outOn(g, 0)}
          style:width="{s.w}px"
          style:height="{s.h}px"
          role="img"
          aria-label={nodeLabel(g)}
        >
          <span class="part-name">
            {#if g.part === 'flip'}<Icon name="heart" size={14} />{/if}
            {PART_NAME[g.part]}
          </span>
          {#each pinLabels(g) as pl (pl.text + pl.at.x + pl.at.y)}
            <span class="pin" class:on={pl.on} style:left="calc(50% + {pl.at.x}px)" style:top="calc(50% + {pl.at.y}px)">{pl.text}</span>
          {/each}
          {#if numbered}<span class="no" aria-hidden="true">{nodeNo(g.id)}</span>{/if}
        </div>
      {:else}
        {@const r = runeOf(g)}
        <button
          type="button"
          class="stone-rune"
          class:slot={!g.rune}
          class:empty={!r}
          class:lit={values[g.id] === 1}
          class:hl={highlight && 'node' in highlight && highlight.node === g.id}
          disabled={!!g.rune || !canPlace}
          aria-label={nodeLabel(g)}
          onclick={() => onSlot?.(g.id)}
        >
          <RuneIcon rune={r} />
          {#if numbered}<span class="no" aria-hidden="true">{nodeNo(g.id)}</span>{/if}
        </button>
        {#if r}
          <span class="rune-name">{RUNE_NAME[r]}{#if translated(r)}<span class="modern"> · {RUNE_MODERN[r]}</span>{/if}</span>
        {/if}
      {/if}
    </div>
  {/each}

  {#each machine.lamps as l (l.id)}
    {@const p = at(l.x, l.y)}
    <div class="slot-pos" style:left={pct(p.x, W)} style:top={pct(p.y, H)}>
      <span class="lamp-label carved" class:below={l.from === 'top'}>{l.label}</span>
      <span class="lamp" class:on={lampOn(l)} role="img" aria-label="Lampa {l.label}: {lampOn(l) ? 'svítí' : 'mlčí'}">
        {#if modern}<span class="lamp-bit" aria-hidden="true">{lampOn(l) ? 1 : 0}</span>{/if}
      </span>
    </div>
  {/each}
</div>

<style>
  .machine {
    position: relative;
    flex: none;
    margin-inline: auto;
    border-radius: 14px;
  }
  .wires {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .groove {
    fill: none;
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 9;
    stroke-linecap: round;
  }
  .flow {
    fill: none;
    stroke: rgba(150, 130, 105, 0.35);
    stroke-width: 3.5;
    stroke-linecap: round;
    transition:
      stroke var(--t-med),
      filter var(--t-med);
  }
  .flow.on {
    stroke: var(--lumen);
    filter: drop-shadow(0 0 4px rgba(255, 210, 130, 0.9));
  }
  .flow.dead {
    stroke-dasharray: 2 9;
  }
  .const {
    fill: #15100b;
    stroke: #5c4214;
    stroke-width: 2;
  }
  .const.on {
    fill: var(--lumen);
    filter: drop-shadow(0 0 3px rgba(255, 210, 130, 0.9));
  }
  .slot-pos {
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--k, 1));
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  /* Krystal vstupu v kamenné misce */
  .input {
    position: relative;
    display: grid;
    place-items: center;
    width: 46px;
    height: 58px;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: radial-gradient(circle at 50% 40%, #0d0a07, #2a221a 75%);
    box-shadow:
      inset 0 3px 7px rgba(0, 0, 0, 0.8),
      0 1px 0 rgba(255, 236, 200, 0.12);
    cursor: pointer;
  }
  .input:disabled {
    cursor: default;
  }
  .name {
    position: absolute;
    top: -22px;
    white-space: nowrap;
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--text-muted);
  }
  .gem {
    width: 22px;
    height: 34px;
  }
  .gem polygon {
    fill: url(#gem-off);
    stroke: var(--umbra);
    stroke-width: 1.6;
    stroke-linejoin: round;
  }
  .input.on .gem polygon {
    fill: url(#gem-on);
    stroke: #ffe9b0;
  }
  .input.on .gem {
    filter: drop-shadow(0 0 6px rgba(255, 210, 130, 0.85));
  }
  .under {
    position: absolute;
    bottom: -20px;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .under.weight {
    color: var(--lumen);
    opacity: 0.8;
  }
  /* Kámen s runou */
  .stone-rune {
    position: relative;
    display: grid;
    place-items: center;
    width: 68px;
    height: 68px;
    padding: 0;
    border: 2px solid rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    background: linear-gradient(160deg, #6e6252, #4a4136 60%, #3a3229);
    box-shadow:
      inset 0 2px 0 rgba(255, 236, 200, 0.18),
      inset 0 -3px 0 rgba(0, 0, 0, 0.35),
      0 4px 8px rgba(0, 0, 0, 0.45);
    color: var(--stone-200);
    cursor: default;
    transition:
      color var(--t-med),
      box-shadow var(--t-med);
  }
  .stone-rune.slot {
    cursor: pointer;
    border-style: dashed;
    border-color: rgba(255, 217, 138, 0.45);
  }
  .stone-rune.slot:disabled {
    cursor: default;
  }
  .stone-rune.slot:not(:disabled):hover {
    box-shadow:
      inset 0 2px 0 rgba(255, 236, 200, 0.18),
      0 0 0 2px rgba(255, 217, 138, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.45);
  }
  .stone-rune.empty {
    background: radial-gradient(circle at 50% 40%, #1a140e, #2e261d 75%);
  }
  .stone-rune.lit {
    color: var(--lumen);
    filter: drop-shadow(0 0 6px rgba(255, 210, 130, 0.55));
  }
  .no {
    position: absolute;
    top: 3px;
    left: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
  }
  .rune-name {
    position: absolute;
    top: calc(100% + 4px);
    white-space: nowrap;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }
  .modern {
    font-family: var(--font-mono);
    color: var(--lumen);
  }
  /* Součástka: větší kámen s popsanými kolíky */
  .part {
    position: relative;
    display: grid;
    place-items: center;
    border: 2px solid rgba(0, 0, 0, 0.55);
    border-radius: 14px;
    background:
      linear-gradient(160deg, rgba(255, 236, 200, 0.06), transparent 40%),
      linear-gradient(160deg, #5d5244, #3f372e 60%, #30291f);
    box-shadow:
      inset 0 2px 0 rgba(255, 236, 200, 0.16),
      inset 0 -3px 0 rgba(0, 0, 0, 0.35),
      0 5px 10px rgba(0, 0, 0, 0.5);
    transition:
      box-shadow var(--t-med),
      border-color var(--t-med);
  }
  .part::before {
    content: '';
    position: absolute;
    inset: 7px;
    border: 1px solid rgba(255, 217, 138, 0.16);
    border-radius: 9px;
    pointer-events: none;
  }
  .part.memory.lit {
    border-color: rgba(255, 217, 138, 0.7);
    box-shadow:
      inset 0 0 18px rgba(255, 210, 130, 0.35),
      0 0 16px rgba(255, 210, 130, 0.45),
      0 5px 10px rgba(0, 0, 0, 0.5);
  }
  .part-name {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    max-width: 76px;
    font-family: var(--font-display);
    font-size: 11.5px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0.02em;
    text-align: center;
    text-transform: uppercase;
    color: var(--stone-200);
  }
  /* Číslo součástky: kolíky jsou vlevo a vpravo, nahoře uprostřed je volno. U sloupce je volný roh. */
  .part .no {
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
  }
  .part.column .no {
    top: auto;
    bottom: 3px;
    left: 6px;
    transform: none;
  }
  .part.column .part-name {
    max-width: 84px;
  }
  .part.memory.lit .part-name {
    color: var(--lumen);
  }
  .pin {
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
  }
  .pin.on {
    color: var(--lumen);
    text-shadow: 0 0 6px rgba(255, 210, 130, 0.8);
  }
  /* Točitý kámen: malé kolečko, kliknutím se pootočí k dalšímu zdroji světla */
  .socket {
    display: grid;
    place-items: center;
    min-width: 26px;
    height: 26px;
    padding: 0 4px;
    border: 2px dashed rgba(255, 217, 138, 0.5);
    border-radius: 13px;
    background: radial-gradient(circle at 50% 40%, #2a221a, #15100b);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
  }
  .socket.set {
    border-style: solid;
    border-color: #8a6a2a;
    color: var(--stone-200);
  }
  .socket.lit {
    color: var(--lumen);
  }
  /* Vstup (A, O…) písmem popisků, ať se písmeno O neplete s nulou stálého stínu. */
  .socket.letter {
    font-family: var(--font-display);
    font-size: 13px;
  }
  .socket sub {
    font-size: 0.8em;
    line-height: 0;
    vertical-align: -0.3em;
  }
  /* Nenastavený točitý kámen se na začátku úlohy třikrát připomene: je malý a snadno se přehlédne. */
  .socket:not(.set):not(:disabled):not(.hl) {
    animation: invite 1.4s ease-in-out 3;
  }
  @keyframes invite {
    50% {
      transform: scale(1.35);
      border-color: var(--lumen);
      box-shadow: 0 0 10px rgba(255, 217, 138, 0.6);
    }
  }
  .socket:disabled {
    cursor: default;
  }
  .hl {
    outline: 3px solid var(--ok);
    outline-offset: 3px;
    animation: hl 1.6s ease-in-out infinite;
  }
  @keyframes hl {
    50% {
      outline-offset: 6px;
    }
  }
  /* Lampa */
  .lamp {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 3px solid #5c4214;
    background: radial-gradient(circle at 40% 35%, #3a3026, #15100b 70%);
    box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.8);
    transition:
      background var(--t-med),
      box-shadow var(--t-med);
  }
  .lamp.on {
    background: radial-gradient(circle at 40% 35%, #fff6d8, #ffd27a 45%, #c98a2a 80%);
    box-shadow:
      0 0 18px rgba(255, 210, 130, 0.85),
      0 0 46px rgba(242, 170, 70, 0.45);
  }
  .lamp-label {
    position: absolute;
    bottom: calc(100% + 4px);
    white-space: nowrap;
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--text-muted);
  }
  .lamp-label.below {
    bottom: auto;
    top: calc(100% + 4px);
  }
  .lamp-bit {
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--stone-400);
  }
  .lamp.on .lamp-bit {
    color: #6b4410;
  }
  .celebrate .lamp.on {
    animation: lamp-pulse 1.2s ease-in-out 2;
  }
  @keyframes lamp-pulse {
    50% {
      box-shadow:
        0 0 28px rgba(255, 220, 150, 1),
        0 0 70px rgba(242, 170, 70, 0.7);
    }
  }
</style>
