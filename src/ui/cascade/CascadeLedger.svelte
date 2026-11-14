<script lang="ts">
  import { fade } from 'svelte/transition';
  import Rich from '../Rich.svelte';
  import { toBinaryString } from '../../core/bits';
  import { answer, type CascadeConfig, type CascadeTask } from '../../core/puzzles/cascade';
  import { settings } from '../../game/settings.svelte.ts';

  let { cfg, tasks }: { cfg: CascadeConfig; tasks: CascadeTask[] } = $props();

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const SIGN = { add: '+', sub: '−', mul: '×' } as const;

  type Line = { sign: string; bin: string; dec: string; spilled?: string };

  function entry(task: CascadeTask): Line[] {
    const bits = cfg.bits ?? cfg.width;
    const ans = answer(cfg, task);
    const binOf = (n: number, w = bits) => toBinaryString(n, w);
    const lines: Line[] =
      task.op === 'mul'
        ? [
            { sign: '', bin: binOf(task.operands[0]), dec: String(task.operands[0]) },
            { sign: '×', bin: task.operands[1].toString(2), dec: String(task.operands[1]) },
          ]
        : task.operands.map((o, k) => ({ sign: k === 0 ? '' : SIGN[task.op], bin: binOf(o), dec: String(o) }));
    const total = task.op === 'sub' ? ans.result : ans.result + (ans.spilled << cfg.width);
    lines.push({
      sign: '=',
      bin: binOf(ans.result, cfg.width),
      dec: ans.spilled ? `${total} → ${ans.result}` : String(ans.result),
      spilled: ans.spilled ? '1' : undefined,
    });
    return lines;
  }
</script>

<!-- Zápisník: každá vyřešená úloha pod sebou, dvojkově i desítkově. -->
<aside class="ledger parchment" aria-label="Zápisník">
  <h2>Zápisník</h2>
  <p class="sub">moderní zápis</p>
  {#if tasks.length === 0}
    <p class="empty">Zatím prázdný. Každý přijatý výsledek si sem zapíšeš.</p>
  {/if}
  <ol>
    {#each tasks as task, k (k)}
      <li in:fade={{ duration: 500 * m }}>
        {#each entry(task) as line, j (j)}
          <span class="sign" class:result={line.sign === '='}>{line.sign}</span>
          <span class="bin" class:result={line.sign === '='}>
            {#if line.spilled}<span class="spilled" title="vyteklo z nádoby">({line.spilled})</span>{/if}{line.bin}<sub>2</sub>
          </span>
          <span class="dec" class:result={line.sign === '='}><Rich text={line.dec} /></span>
        {/each}
      </li>
    {/each}
  </ol>
</aside>

<style>
  .ledger {
    align-self: center;
    min-height: 210px;
    padding: 18px 20px 20px;
    border-radius: 4px;
    transform: rotate(0.6deg);
  }
  h2 {
    margin: 0;
    font-size: var(--fs-lg);
    color: var(--ink);
  }
  .sub {
    margin: 0 0 10px;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  .empty {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  ol {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: var(--fs-md);
  }
  li {
    display: grid;
    grid-template-columns: 1.2em auto 1fr;
    column-gap: 8px;
    row-gap: 1px;
    padding-bottom: 8px;
    border-bottom: 1px dashed rgba(92, 74, 51, 0.35);
  }
  .sign {
    color: var(--ink-muted);
    text-align: center;
  }
  .bin {
    justify-self: end;
    letter-spacing: 0.04em;
    color: var(--ink-muted);
  }
  .dec {
    justify-self: end;
    color: var(--ink-muted);
  }
  .bin.result {
    font-weight: 700;
    color: var(--ink-red);
  }
  .dec.result {
    font-weight: 700;
    color: var(--ink);
  }
  /* Čára jako při počítání pod sebou */
  .result {
    padding-top: 2px;
    border-top: 1.5px solid rgba(43, 31, 18, 0.55);
  }
  .spilled {
    margin-right: 1px;
    color: var(--ink-muted);
    text-decoration: line-through;
  }
  sub {
    font-size: 0.7em;
    color: var(--ink-muted);
  }
  @media (max-width: 880px) {
    .ledger {
      min-height: 0;
      transform: none;
    }
  }
</style>
