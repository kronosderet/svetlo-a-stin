<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Crystal from '../Crystal.svelte';
  import Gem from '../Gem.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import CascadeLedger from './CascadeLedger.svelte';
  import Spark from './Spark.svelte';
  import { isBitSet, toBinaryString } from '../../core/bits';
  import { carryColumns, liveInflow, rows, rowShifts } from '../../core/puzzles/cascade';
  import { settings } from '../../game/settings.svelte.ts';
  import type { CascadeGame } from '../../game/cascadeGame.svelte.ts';

  let { game, pulse, wobble }: { game: CascadeGame; pulse: number; wobble: number } = $props();

  const SIGN = { add: '+', sub: '−', mul: '+' } as const;
  const SAY = { add: 'plus', sub: 'minus', mul: 'plus' } as const;

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const pres = $derived(level.presentation);
  const width = $derived(cfg.width);
  const bits = $derived(cfg.bits ?? cfg.width);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const lines = $derived(rows(task));
  const shifts = $derived(rowShifts(task));
  const sub = $derived(task.op === 'sub');
  const carryCols = $derived(carryColumns(cfg));
  const spout = $derived(!!cfg.overflow && cfg.carries === 'manual');
  const digits = $derived(pres.showDigits || settings.alwaysDigits);
  const weights = $derived(!!pres.showWeights || settings.alwaysWeights);
  const counts = $derived(!!pres.columnCounts && !sub);
  const values = $derived(!!pres.showValues);
  /** Sloupce zleva doprava jako indexy bitů (nejvyšší vlevo). */
  const columns = $derived(Array.from({ length: width }, (_, k) => width - 1 - k));
  const wrong = $derived(game.holding ? null : game.state.wrong);
  const hint = $derived(game.hintCell);
  const solvedTasks = $derived(cfg.tasks.slice(0, game.state.step));
  const m = $derived(settings.reducedMotion ? 0 : 1);

  // Mřížka: [znaménko] [přepad] sloupce… [hodnota].
  // Řádky: přenosy, řady ve stěně, (výpůjčky), počty, čára, výsledek. Přenos se při sčítání píše
  // nad sloupec, výpůjčka při odčítání pod spodní řadu: ve sloupci se pak odečítají dva krystaly od jednoho.
  const cellStart = $derived(spout ? 3 : 2);
  const valueCol = $derived(cellStart + width);
  const carryTop = $derived(carryCols.length > 0 && !sub);
  const carryBelow = $derived(carryCols.length > 0 && sub);
  /** Odčítání: nad horní řadou přistane půjčené světlo jako dva krystaly. */
  const rLoan = $derived(carryBelow ? 1 : 0);
  const firstLine = $derived(carryTop || carryBelow ? 2 : 1);
  const rCarry = $derived(carryTop ? 1 : carryBelow ? firstLine + lines.length : 0);
  const afterLines = $derived(firstLine + lines.length + (carryBelow ? 1 : 0));
  const rCounts = $derived(counts ? afterLines : 0);
  const rRule = $derived(afterLines + (counts ? 1 : 0));
  const rResult = $derived(rRule + 1);
  const template = $derived(
    `28px ${spout ? 'var(--cell) ' : ''}repeat(${width}, var(--cell))${values ? ' minmax(56px, auto)' : ''}`,
  );

  const colOf = (i: number): number => (i === width ? 2 : cellStart + (width - 1 - i));
  const lineRow = (j: number): number => firstLine + j;

  /** Kde má řádek ve stěně krystaly (posunuté kopie mají vpravo doplněné nuly). */
  function shown(j: number, i: number): boolean {
    return task.op === 'mul' ? i < shifts[j] + bits : i < bits;
  }

  function lineValue(j: number): string {
    if (task.op !== 'mul') return String(lines[j]);
    return `${task.operands[0]} × ${2 ** shifts[j]}`;
  }

  /** Sloupce, které dostaly půjčené světlo (jejich soused vlevo má krystal výpůjčky). */
  const loaned = $derived(carryBelow ? columns.filter((j) => isBitSet(view.carries, j + 1)) : []);

  function sparkLabel(i: number): string {
    if (i === width) return 'Přepad: světlo, které vyteklo z nádoby';
    return sub ? `Krystal výpůjčky ve sloupci ${i + 1} zprava` : `Krystal přenosu nad sloupcem ${i + 1} zprava`;
  }

  function resultLabel(i: number): string {
    return `Výsledek, krystal ${i + 1} zprava${weights ? `, váha ${2 ** i}` : ''}`;
  }

  const description = $derived.by(() => {
    const parts = lines.map((l, j) => (j === 0 ? '' : `${SAY[task.op]} `) + toBinaryString(l, task.op === 'mul' ? width : bits));
    const head = task.op === 'mul' ? `Násobení ${task.operands[0].toString(2)} krát ${task.operands[1].toString(2)}, kopie: ` : '';
    return `Ve stěně: ${head}${parts.join(' ')}.`;
  });
</script>

<div class="cascade" class:with-ledger={pres.ledger}>
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <section class="main" style:--board-max="{(width + (spout ? 1 : 0)) * 76 + 28 + (values ? 76 : 0) + 24}px">
    <header class="task">
      <p class="task-text carved">{pres.task}</p>
      {#if cfg.tasks.length > 1}
        <Pips total={cfg.tasks.length} done={game.state.step} />
      {/if}
    </header>

    {#if task.op === 'mul'}
      {@const [a, b] = task.operands}
      {#key task}
        <div class="factors stone-inset" in:fly={{ y: -10, duration: 320 * m }}>
          <MiniPattern mask={a} {bits} size="md" {digits} />
          <span class="times carved">×</span>
          <MiniPattern mask={b} bits={b.toString(2).length} size="md" {digits} />
          {#if values}<span class="factors-dec">{a} × {b}</span>{/if}
        </div>
      {/key}
    {/if}

    <div class="board stone">
      <p class="visually-hidden" aria-live="polite">{description}</p>
      <div
        class="grid"
        style:grid-template-columns={template}
        style:grid-template-rows="repeat({rResult}, auto)"
        style:--cols={width + (spout ? 1 : 0)}
        style:--value-w={values ? '64px' : '0px'}
      >
        <!-- Kamenné žlaby sloupců: při chybě se otřese ten pravý, při úspěchu jimi proteče světlo. -->
        {#key wobble}
          {#each columns as i (i)}
            <div
              class="strip"
              class:wrong={wrong?.column === i}
              class:flow={game.holding}
              style:grid-column={colOf(i)}
              style:grid-row="1 / {rResult + 1}"
              style:--d="{i * 110}ms"
            >
              {#if wrong?.column === i}
                <!-- Kámen žlabu praskne, mechanismus nepovolil. -->
                <svg class="crack" viewBox="0 0 20 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M11 0 L8 14 L13 26 L7 41 L12 55 L9 68 L14 80" />
                  <path d="M13 26 L18 32 M7 41 L2 47 M12 55 L17 60" />
                </svg>
              {/if}
            </div>
          {/each}
        {/key}

        {#if spout}
          <div class="vessel" style:grid-column="{cellStart} / span {width}" style:grid-row="{firstLine} / {rResult + 1}"></div>
          <div
            class="chute"
            class:on={isBitSet(view.carries, width)}
            class:wrong={wrong?.column === width}
            style:grid-column="2"
            style:grid-row="{firstLine} / {rResult + 1}"
          >
            <span class="chute-label carved">přepad</span>
          </div>
        {/if}

        {#if carryBelow}
          <!-- Půjčené světlo: sloupec vlevo půjčil jedno světlo a vpravo z něj jsou dvě. -->
          <div class="loan-slot" style:grid-column="{cellStart} / span {width}" style:grid-row={rLoan}></div>
          {#each loaned as j (j)}
            <div
              class="cell loan"
              style:grid-column={colOf(j)}
              style:grid-row={rLoan}
              title="půjčené světlo: tady váží dvě"
              out:fade={{ duration: 200 * m }}
            >
              {#each [0, 1] as k (k)}
                <span in:fly={{ x: -42, y: 6, duration: 460 * m, delay: k * 90 * m }}><Gem on={true} /></span>
              {/each}
            </div>
          {/each}
          <!-- Výpůjčky se odečítají spolu se spodní řadou. -->
          <span class="sign carved" style:grid-column="1" style:grid-row={rCarry}>−</span>
        {/if}
        {#each carryCols as i (i)}
          <div class="cell" style:grid-column={colOf(i)} style:grid-row={rCarry}>
            <Spark
              on={isBitSet(view.carries, i)}
              tone={i === width ? 'spout' : 'carry'}
              highlight={hint?.row === 'carry' && hint.column === i}
              wrong={wrong?.row === 'carry' && wrong.column === i}
              disabled={!game.playing}
              label={sparkLabel(i)}
              onToggle={() => game.toggle({ row: 'carry', column: i })}
            />
          </div>
        {/each}

        {#key task}
          {#each lines as line, j (j)}
            <span class="sign carved" style:grid-column="1" style:grid-row={lineRow(j)}>{j === 0 ? '' : SIGN[task.op]}</span>
            {#each columns as i (i)}
              {#if shown(j, i)}
                <div
                  class="cell"
                  class:pad={task.op === 'mul' && i < shifts[j]}
                  style:grid-column={colOf(i)}
                  style:grid-row={lineRow(j)}
                  in:fly={{ y: -14, duration: 360 * m, delay: (j * 60 + (width - i) * 25) * m }}
                >
                  <Gem on={isBitSet(line, i)} digit={digits} />
                </div>
              {/if}
            {/each}
            {#if values}
              <span class="value" style:grid-column={valueCol} style:grid-row={lineRow(j)}>{lineValue(j)}</span>
            {/if}
          {/each}
        {/key}

        {#if counts}
          {#each columns as i (i)}
            {#if cfg.carries !== 'none' || i < bits}
              {@const n = liveInflow(task, view.carries, i)}
              <span class="count" class:zero={n === 0} style:grid-column={colOf(i)} style:grid-row={rCounts} title="světel ve sloupci">
                {n}
              </span>
            {/if}
          {/each}
        {/if}

        <div class="rule" style:grid-column="{cellStart} / span {width}" style:grid-row={rRule}></div>

        <span class="sign carved" style:grid-column="1" style:grid-row={rResult}>=</span>
        {#each columns as i, k (i)}
          <div class="cell" style:grid-column={colOf(i)} style:grid-row={rResult}>
            <Crystal
              on={isBitSet(view.result, i)}
              weight={2 ** i}
              weightState={weights ? 'known' : 'hidden'}
              digit={digits}
              highlight={hint?.row === 'result' && hint.column === i}
              disabled={!game.playing}
              celebrate={game.phase === 'solved'}
              delay={k * 90}
              label={resultLabel(i)}
              onToggle={() => game.toggle({ row: 'result', column: i })}
            />
          </div>
        {/each}
        {#if values}
          <span class="value live" style:grid-column={valueCol} style:grid-row={rResult}>{view.result}</span>
        {/if}
      </div>
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if game.phase === 'play'}
      <div class="actions">
        <button type="button" class="btn btn-primary btn-lg" onclick={() => game.confirm()} disabled={!game.playing}>Potvrdit</button>
      </div>
      {#if cfg.carries === 'manual'}
        <p class="legend">
          <svg class="mini-gem" viewBox="0 0 20 32" aria-hidden="true" focusable="false">
            <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
          </svg>
          {#if sub}
            Krystal pod spodní řadou: výpůjčka. Tady se odečte a sousedovi vpravo přidá dva krystaly.
          {:else}
            Krystal nad sloupcem: světlo, které do něj přeteklo ze sloupce vpravo.
          {/if}
        </p>
      {/if}
    {/if}
  </section>

  {#if pres.ledger}
    <CascadeLedger {cfg} tasks={solvedTasks} />
  {/if}
</div>

<style>
  .cascade {
    position: relative;
    width: 100%;
    display: grid;
    gap: var(--gap);
    align-items: center;
  }
  .cascade.with-ledger {
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
    gap: 12px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }

  .factors {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px 16px;
    padding: 10px 20px;
  }
  .times {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    font-weight: 700;
    color: var(--stone-200);
  }
  .factors-dec {
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--text-muted);
    font-weight: 700;
  }

  /* Kamenná deska s počty pod sebou */
  .board {
    width: min(100%, var(--board-max));
    padding: 16px 10px 12px;
    container-type: inline-size;
  }
  .grid {
    --cell: clamp(46px, min(calc((100cqi - 40px - var(--value-w)) / var(--cols)), 9.5vh), 76px);
    --gem-w: calc(var(--cell) * 0.34);
    --crystal-w: calc(var(--cell) * 0.52);
    position: relative;
    display: grid;
    justify-content: center;
    align-items: center;
    row-gap: 8px;
  }
  .cell {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
  }
  /* Řádek pro půjčené světlo drží místo, i když je prázdný (deska neposkakuje). */
  .loan-slot {
    min-height: calc(var(--gem-w) * 1.1 + 4px);
  }
  .cell.loan {
    --gem-w: calc(var(--cell) * 0.24);
    display: flex;
    justify-content: center;
    gap: 3px;
    filter: drop-shadow(0 0 6px rgba(255, 210, 130, 0.55));
  }
  .cell.pad {
    opacity: 0.6;
  }
  .strip,
  .vessel,
  .chute {
    align-self: stretch;
  }
  .strip {
    z-index: 0;
    margin: -8px 4px -4px;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.4));
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.6),
      inset 0 -1px 0 rgba(255, 236, 200, 0.07),
      0 1px 0 rgba(255, 236, 200, 0.06);
  }
  .strip.wrong {
    box-shadow:
      inset 0 2px 6px rgba(0, 0, 0, 0.5),
      inset 0 0 0 2px rgba(240, 149, 122, 0.75),
      0 0 18px rgba(240, 149, 122, 0.3);
    animation: shake 0.5s ease-out;
  }
  .strip {
    position: relative;
  }
  .crack {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  .crack path {
    fill: none;
    stroke: rgba(10, 6, 3, 0.45);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation:
      crack 380ms ease-out forwards,
      crack-fade 2.4s ease-in 1s forwards;
    filter: drop-shadow(0 1px 0 rgba(255, 226, 180, 0.18));
  }
  @keyframes crack {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes crack-fade {
    to {
      opacity: 0;
    }
  }
  .strip.flow {
    animation: flow 1s ease-out var(--d) both;
  }
  .vessel {
    z-index: 0;
    margin: -12px 0 -8px;
    border: 3px solid rgba(12, 9, 6, 0.75);
    border-radius: 14px;
    box-shadow:
      inset 0 0 0 1px rgba(255, 236, 200, 0.1),
      0 0 0 1px rgba(255, 236, 200, 0.06);
    pointer-events: none;
  }
  /* Přepad: kamenný žlab vlevo od nádoby, kudy vytéká přenos */
  .chute {
    position: relative;
    z-index: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin: -14px 10px -4px;
    padding-bottom: 8px;
    border-radius: 6px 6px 18px 18px;
    background: repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0 10px, rgba(0, 0, 0, 0.22) 10px 20px);
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }
  .chute.on::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 8px;
    height: 30px;
    margin-left: -4px;
    border-radius: 4px;
    background: linear-gradient(180deg, transparent, #ffd98a);
    box-shadow: 0 0 12px rgba(255, 210, 130, 0.8);
    animation: drip 1.3s ease-in infinite;
  }
  .chute.wrong {
    box-shadow:
      inset 0 2px 8px rgba(0, 0, 0, 0.7),
      inset 0 0 0 2px rgba(240, 149, 122, 0.75);
  }
  .chute-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--stone-200);
  }
  .sign {
    position: relative;
    z-index: 1;
    justify-self: center;
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    font-weight: 700;
    color: var(--stone-200);
  }
  .value {
    position: relative;
    z-index: 1;
    justify-self: start;
    padding-left: 12px;
    font-family: var(--font-display);
    font-size: var(--fs-base);
    white-space: nowrap;
    color: var(--text-muted);
    font-weight: 700;
  }
  .value.live {
    font-size: var(--fs-xl);
    color: var(--text);
  }
  .count {
    position: relative;
    z-index: 1;
    justify-self: center;
    min-width: 28px;
    padding: 1px 7px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.45);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    font-weight: 700;
    text-align: center;
    color: var(--lumen-glow);
  }
  .count.zero {
    color: var(--stone-400);
  }
  .rule {
    position: relative;
    z-index: 1;
    height: 3px;
    margin: 2px 6px;
    background:
      linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)) top / 100% 2px no-repeat,
      linear-gradient(rgba(255, 236, 200, 0.14), rgba(255, 236, 200, 0.14)) bottom / 100% 1px no-repeat;
  }

  .actions {
    display: flex;
    justify-content: center;
  }
  .legend {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 52ch;
    margin: -6px 0 0;
    font-size: var(--fs-sm);
    text-align: left;
    color: var(--text-muted);
  }
  .mini-gem {
    flex: none;
    width: 10px;
    height: 16px;
    overflow: visible;
    filter: drop-shadow(0 0 4px rgba(255, 210, 130, 0.8));
  }
  .mini-gem polygon {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    stroke-width: 1.6;
    stroke-linejoin: round;
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(2px);
    }
  }
  @keyframes flow {
    0% {
      background-color: transparent;
    }
    35% {
      background-color: rgba(255, 200, 110, 0.22);
      box-shadow:
        inset 0 0 26px rgba(255, 210, 130, 0.55),
        0 0 16px rgba(242, 170, 70, 0.25);
    }
    100% {
      background-color: transparent;
    }
  }
  @keyframes drip {
    from {
      transform: translateY(-30px);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    to {
      transform: translateY(160px);
      opacity: 0;
    }
  }

  @media (max-width: 880px) {
    .cascade.with-ledger {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  /* Nízká široká obrazovka (1366 × 768): Potvrdit a legenda stojí vedle desky. */
  @media (min-width: 900px) and (max-height: 820px) {
    .main {
      display: grid;
      grid-template-columns: minmax(0, var(--board-max)) minmax(170px, 250px);
      justify-content: center;
      align-items: center;
      column-gap: 28px;
      row-gap: 10px;
    }
    .main > :global(*) {
      grid-column: 1 / -1;
    }
    .task {
      grid-row: 1;
    }
    .board {
      grid-column: 1;
      grid-row: 2 / span 3;
    }
    .factors {
      grid-column: 2;
      grid-row: 2;
    }
    .actions {
      grid-column: 2;
      grid-row: 3;
    }
    .legend {
      grid-column: 2;
      grid-row: 4;
      align-self: start;
      margin: 0;
    }
  }
  @media (max-height: 820px) {
    .grid {
      row-gap: 4px;
    }
    .board {
      padding-top: 12px;
      padding-bottom: 8px;
    }
    .factors {
      padding: 6px 16px;
    }
  }
  @media (max-width: 560px) {
    .board {
      padding: 12px 4px 8px;
    }
    .sign {
      font-size: var(--fs-lg);
    }
  }
</style>
