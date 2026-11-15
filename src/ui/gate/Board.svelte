<script lang="ts">
  import RuneIcon from './RuneIcon.svelte';
  import { ARITY, type Rune } from '../../core/logic';
  import { evaluate, socketKey, sourcesOf, type Circuit, type GateNode } from '../../core/puzzles/gate';
  import { RUNE_KODEX, RUNE_MODERN, RUNE_NAME } from '../../content/runes';
  import { progress } from '../../game/progress.svelte.ts';
  import { settings } from '../../game/settings.svelte.ts';

  interface Props {
    circuit: Circuit;
    /** Vstupy jako řádek tabulky (A nejvyšší bit). */
    inputs: number;
    runes: Record<string, Rune>;
    /** Natočení točitých kamenů (klíč „runa:vstup“ → zdroj). */
    wires?: Record<string, string>;
    /** Krystaly vstupů jde přepínat. */
    canToggle: boolean;
    /** Prázdné kameny jde osazovat runami. */
    canPlace: boolean;
    /** Pod runami i moderní značka (po překladu v Kodexu). */
    modern: boolean;
    /** Runy pod závojem (Deska zákona: hráč je pozná podle tabulky). */
    veiled?: boolean;
    /** Bez krystalů vstupů, jen jejich jména (obvod na Desce zákona). */
    staticInputs?: boolean;
    highlight?: { input: number } | { node: string } | { socket: string } | null;
    celebrate?: boolean;
    onInput?: (index: number) => void;
    onSlot?: (node: string) => void;
    onSocket?: (key: string) => void;
  }

  let {
    circuit,
    inputs,
    runes,
    wires = {},
    canToggle,
    canPlace,
    modern,
    veiled = false,
    staticInputs = false,
    highlight = null,
    celebrate = false,
    onInput,
    onSlot,
    onSocket,
  }: Props = $props();

  const CW = 150;
  const RH = 104;
  const PX = 56;
  const PY = 56;

  const n = $derived(circuit.inputs.length);
  const values = $derived(staticInputs ? null : evaluate(circuit, runes, inputs, wires));
  /** Obvod s točitými kameny: runy mají čísla, ať jde na kameni poznat, odkud světlo bere. */
  const numbered = $derived(circuit.nodes.some((g) => g.free));
  const nodeNo = (id: string) => circuit.nodes.findIndex((g) => g.id === id) + 1;
  const sourceName = (src: string) => (circuit.inputs.includes(src) ? src : String(nodeNo(src)));
  // Obvod bez run (Cesta světla): světlovod vede ze vstupu rovnou do lampy o dva sloupce dál.
  const lampCol = $derived(circuit.nodes.length ? Math.max(...circuit.nodes.map((g) => g.col)) + 1 : 2);
  const outNode = $derived(circuit.nodes.find((g) => g.id === circuit.output) ?? null);
  const maxRow = $derived(Math.max(n - 1, ...circuit.nodes.map((g) => g.row)));
  const W = $derived(PX * 2 + lampCol * CW);
  const H = $derived(PY * 2 + maxRow * RH);

  const inputPos = (i: number) => ({ x: PX, y: PY + i * RH });
  const nodePos = (g: GateNode) => ({ x: PX + g.col * CW, y: PY + g.row * RH });
  const lampPos = $derived({
    x: PX + lampCol * CW,
    y: outNode ? nodePos(outNode).y : inputPos(Math.max(0, circuit.inputs.indexOf(circuit.output))).y,
  });
  const arity = (g: GateNode): number => ARITY[g.rune ?? g.choices?.[0] ?? 'id'];
  const runeOf = (g: GateNode): Rune | null => g.rune ?? runes[g.id] ?? null;

  /** Kde světlo z daného zdroje vychází (pravý okraj krystalu nebo kamene). */
  function outAnchor(src: string): { x: number; y: number } {
    const i = circuit.inputs.indexOf(src);
    if (i >= 0) {
      const p = inputPos(i);
      return { x: p.x + 24, y: p.y };
    }
    const p = nodePos(circuit.nodes.find((g) => g.id === src)!);
    return { x: p.x + 34, y: p.y };
  }

  const paths = $derived.by(() => {
    const out: { d: string; on: boolean; dead: boolean }[] = [];
    const path = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const m = (a.x + b.x) / 2;
      return `M${a.x} ${a.y}C${m} ${a.y} ${m} ${b.y} ${b.x} ${b.y}`;
    };
    for (const g of circuit.nodes) {
      const p = nodePos(g);
      const k = arity(g);
      // U točitých kamenů vede vodič jen tam, kam je kámen natočený, a končí u kamene.
      const endX = g.free ? p.x - 62 : p.x - 34;
      sourcesOf(g, wires)
        .slice(0, k)
        .forEach((src, j) => {
          if (src === null) return;
          const v = values ? values[src] : null;
          out.push({ d: path(outAnchor(src), { x: endX, y: p.y + (k === 2 ? (j === 0 ? -16 : 16) : 0) }), on: v === 1, dead: !staticInputs && v === null });
        });
    }
    const v = values ? values[circuit.output] : null;
    out.push({ d: path(outAnchor(circuit.output), { x: lampPos.x - 26, y: lampPos.y }), on: v === 1, dead: !staticInputs && v === null });
    return out;
  });

  const pct = (x: number, total: number) => `${(x / total) * 100}%`;
  /** Na úzké obrazovce se deska zmenší; kameny a krystaly se zmenší s ní, ať se nepřekrývají. */
  let boxW = $state(0);
  const k = $derived(boxW ? Math.min(1, boxW / W) : 1);
  const inputOn = (i: number) => ((inputs >> (n - 1 - i)) & 1) === 1;
  const lampOn = $derived(values?.[circuit.output] === 1);

  function nodeLabel(g: GateNode): string {
    const r = runeOf(g);
    if (veiled) return 'Runa pod závojem';
    if (!g.rune) return r ? `Kámen s runou ${RUNE_NAME[r]}. Kliknutím vyber jinou.` : 'Prázdný kámen. Kliknutím vlož runu.';
    return `Runa ${RUNE_NAME[r!]}`;
  }

  /** Moderní značka runy se ukáže, až ji Kodex přeloží (nebo když hráč chce vždy moderní zápis). */
  const translated = (r: Rune) => !!RUNE_MODERN[r] && (settings.alwaysDigits || progress.kodex.includes(RUNE_KODEX[r] ?? ''));
</script>

<div class="circuit stone" class:celebrate style:width="min(100%, {W}px)" style:aspect-ratio="{W} / {H}" style:--k={k} bind:clientWidth={boxW}>
  <svg class="wires" viewBox="0 0 {W} {H}" aria-hidden="true">
    {#each paths as w, k (k)}
      <path class="groove" d={w.d} />
      <path class="flow" class:on={w.on} class:dead={w.dead} d={w.d} />
    {/each}
  </svg>

  {#each circuit.inputs as name, i (name)}
    {@const p = inputPos(i)}
    <div class="slot-pos" style:left={pct(p.x, W)} style:top={pct(p.y, H)}>
      {#if staticInputs}
        <span class="input-name static carved">{name}</span>
      {:else}
        <button
          type="button"
          class="input"
          class:on={inputOn(i)}
          class:hl={highlight && 'input' in highlight && highlight.input === i}
          disabled={!canToggle}
          aria-pressed={inputOn(i)}
          aria-label="Vstup {name}: {inputOn(i) ? 'světlo' : 'stín'}"
          onclick={() => onInput?.(i)}
        >
          <span class="input-name carved">{name}</span>
          <svg class="gem" viewBox="0 0 20 32" aria-hidden="true">
            <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
          </svg>
          {#if modern}<span class="bit">{inputOn(i) ? 1 : 0}</span>{/if}
        </button>
      {/if}
    </div>
  {/each}

  {#each circuit.nodes as g (g.id)}
    {@const p = nodePos(g)}
    {#if g.free}
      <!-- Točité kameny: každý vstup runy ukazuje, odkud bere světlo. -->
      {#each Array.from({ length: arity(g) }, (_, j) => j) as j (j)}
        {@const key = socketKey(g.id, j)}
        {@const src = wires[key]}
        <div class="slot-pos" style:left={pct(p.x - 48, W)} style:top={pct(p.y + (arity(g) === 2 ? (j === 0 ? -16 : 16) : 0), H)}>
          <button
            type="button"
            class="socket"
            class:set={!!src}
            class:hl={highlight && 'socket' in highlight && highlight.socket === key}
            disabled={!canPlace}
            aria-label="Točitý kámen {j + 1}. vstupu runy {nodeNo(g.id)}: {src ? `bere světlo z ${sourceName(src)}` : 'nenastavený'}. Kliknutím pootočíš."
            onclick={() => onSocket?.(key)}
          >{src ? sourceName(src) : '·'}</button>
        </div>
      {/each}
    {/if}
  {/each}

  {#each circuit.nodes as g (g.id)}
    {@const p = nodePos(g)}
    {@const r = runeOf(g)}
    <div class="slot-pos" style:left={pct(p.x, W)} style:top={pct(p.y, H)}>
      <button
        type="button"
        class="stone-rune"
        class:slot={!g.rune}
        class:empty={!r}
        class:lit={!veiled && values?.[g.id] === 1}
        class:veiled
        class:hl={highlight && 'node' in highlight && highlight.node === g.id}
        disabled={!!g.rune || !canPlace || veiled}
        aria-label={nodeLabel(g)}
        onclick={() => onSlot?.(g.id)}
      >
        {#if veiled}
          <span class="veil" aria-hidden="true">?</span>
        {:else}
          <RuneIcon rune={r} />
        {/if}
        {#if numbered}<span class="no" aria-hidden="true">{nodeNo(g.id)}</span>{/if}
      </button>
      {#if r && !veiled}
        <span class="rune-name">{RUNE_NAME[r]}{#if translated(r)}<span class="modern"> · {RUNE_MODERN[r]}</span>{/if}</span>
      {/if}
    </div>
  {/each}

  <div class="slot-pos" style:left={pct(lampPos.x, W)} style:top={pct(lampPos.y, H)}>
    <span class="lamp" class:on={lampOn} role="img" aria-label={staticInputs ? 'Lampa' : `Lampa ${lampOn ? 'svítí' : 'mlčí'}`}></span>
  </div>
</div>

<style>
  .circuit {
    position: relative;
    max-width: 100%;
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
    width: 50px;
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
  .input-name {
    position: absolute;
    top: -22px;
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--text-muted);
  }
  .input-name.static {
    position: static;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    color: var(--text);
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
  .bit {
    position: absolute;
    bottom: -20px;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  /* Kámen s runou */
  .stone-rune {
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
  .stone-rune.veiled {
    background: repeating-linear-gradient(135deg, #3b2a3e 0 6px, #2f2132 6px 12px);
  }
  .veil {
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    font-weight: 700;
    color: var(--text-muted);
  }
  .stone-rune {
    position: relative;
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
  /* Točitý kámen: malé kolečko, kliknutím se pootočí k dalšímu zdroji světla */
  .socket {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 2px dashed rgba(255, 217, 138, 0.5);
    border-radius: 50%;
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
    color: var(--lumen);
  }
  .socket:disabled {
    cursor: default;
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
  /* Lampa: kamenná lucerna, která se rozzáří */
  .lamp {
    display: block;
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
