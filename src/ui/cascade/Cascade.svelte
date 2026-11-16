<script lang="ts">
  import { tick, untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Crystal from '../Crystal.svelte';
  import Gem from '../Gem.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import CascadeLedger from './CascadeLedger.svelte';
  import Spark from './Spark.svelte';
  import { isBitSet, toBinaryString } from '../../core/bits';
  import {
    carryColumns,
    farColumns,
    lightFlow,
    liveInflow,
    wallRows,
    wallShifts,
    type FlowMove,
    type FlowSink,
    type FlowSource,
  } from '../../core/puzzles/cascade';
  import { settings } from '../../game/settings.svelte.ts';
  import type { CascadeGame } from '../../game/cascadeGame.svelte.ts';
  import { aidOn } from '../../content/types';

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
  const lines = $derived(wallRows(cfg, task));
  const shifts = $derived(wallShifts(cfg, task));
  const sub = $derived(task.op === 'sub');
  /** Násobení s výběrem kopií: u každé nabízené kopie je vypínač. */
  const pick = $derived(!!cfg.pickCopies && task.op === 'mul');
  const carryCols = $derived(carryColumns(cfg));
  /** Tři řady: nad přenosy ještě řada přenosů o dvě místa. */
  const farCols = $derived(sub ? [] : farColumns(cfg));
  const spout = $derived(!!cfg.overflow && cfg.carries === 'manual');
  const digits = $derived(pres.showDigits || settings.alwaysDigits);
  const weights = $derived(!!pres.showWeights || settings.alwaysWeights);
  /** Pořadí úlohy na stěně (během pauzy po splnění ještě ta přijatá). */
  const shownStep = $derived(game.state.step - (game.holding && game.held ? 1 : 0));
  const counts = $derived((!!pres.columnCounts || aidOn(pres, 'counts', shownStep)) && !sub);
  const values = $derived(!!pres.showValues);
  /** Sloupce zleva doprava jako indexy bitů (nejvyšší vlevo). */
  const columns = $derived(Array.from({ length: width }, (_, k) => width - 1 - k));
  const wrong = $derived(game.holding ? null : game.state.wrong);
  const hint = $derived(game.hintCell);
  const solvedTasks = $derived(cfg.tasks.slice(0, game.state.step));
  const m = $derived(settings.reducedMotion ? 0 : 1);
  /** Krystaly jdou přepínat při řešení i ve volné hře po vyřešení. */
  const touch = $derived(game.playing || game.free);

  // Mřížka: [znaménko] [přepad] sloupce… [hodnota].
  // Řádky: přenosy, řady ve stěně, (výpůjčky), počty, čára, výsledek. Přenos se při sčítání píše
  // nad sloupec, výpůjčka při odčítání pod spodní řadu: ve sloupci se pak odečítají dva krystaly od jednoho.
  const cellStart = $derived(spout ? 3 : 2);
  const valueCol = $derived(cellStart + width);
  const carryTop = $derived(carryCols.length > 0 && !sub);
  const carryBelow = $derived(carryCols.length > 0 && sub);
  const farTop = $derived(farCols.length > 0);
  const rFar = $derived(farTop ? 1 : 0);
  /** Odčítání: nad horní řadou přistane půjčené světlo jako dva krystaly. */
  const rLoan = $derived(carryBelow ? 1 : 0);
  const firstLine = $derived((carryTop || carryBelow ? 2 : 1) + (farTop ? 1 : 0));
  const rCarry = $derived(carryTop ? 1 + rFar : carryBelow ? firstLine + lines.length : 0);
  const afterLines = $derived(firstLine + lines.length + (carryBelow ? 1 : 0));
  const rCounts = $derived(counts ? afterLines : 0);
  const rRule = $derived(afterLines + (counts ? 1 : 0));
  const rResult = $derived(rRule + 1);
  const template = $derived(
    `${pick ? '48px' : '28px'} ${spout ? 'var(--cell) ' : ''}repeat(${width}, var(--cell))${values ? ' minmax(56px, auto)' : ''}`,
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

  /**
   * Světla se přesouvají podle toho, co hráč rozsvítil (lightFlow): do krystalu výsledku sjede
   * nejspodnější světlo sloupce, do krystalu přenosu odletí dvě světla shora, u odčítání se menšitel
   * vyruší a soused půjčuje. Světlo, které odešlo, ve sloupci pohasne a jeho kopie dolétne do cíle.
   */
  const flow = $derived(lightFlow(cfg, task, view));
  const srcKey = (f: FlowSource): string =>
    f.kind === 'line' ? `line:${f.row}:${f.column}` : f.kind === 'loan' ? `loan:${f.column}:${f.k}` : `${f.kind}:${f.column}`;
  const sinkKey = (t: FlowSink): string => `${t.kind}:${t.column}`;
  const spentKeys = $derived(new Set(flow.map((mv) => srcKey(mv.from))));
  const isSpent = (key: string): boolean => spentKeys.has(key);

  /** Kopie světla, které právě letí na nové místo (nad deskou, jen pro oko). */
  interface Flight {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    delay: number;
  }
  let flights: Flight[] = $state([]);
  let flightId = 0;
  /** Přesuny, které už deska ukázala (nové se ukážou letem, zrušené jen znovu rozsvítí zdroj). */
  let shownMoves = new Set<string>();
  let shownTaskKey = '';
  const FLYING = new Set<FlowSink['kind']>(['result', 'carry', 'far']);
  const moveKey = (mv: FlowMove): string => `${srcKey(mv.from)}>${sinkKey(mv.to)}`;

  $effect(() => {
    const moves = flow;
    const key = `${shownStep}:${JSON.stringify(task)}`;
    untrack(() => {
      const fresh = key === shownTaskKey ? moves.filter((mv) => FLYING.has(mv.to.kind) && !shownMoves.has(moveKey(mv))) : [];
      shownTaskKey = key;
      shownMoves = new Set(moves.map(moveKey));
      if (!fresh.length || !m) return;
      tick().then(() => launch(fresh));
    });
  });

  /** Pošle kopie světel z jejich buněk do cílových krystalů (souřadnice v rámci mřížky). */
  function launch(moves: FlowMove[]) {
    const grid = gridEl;
    if (!grid) return;
    const box = grid.getBoundingClientRect();
    const centre = (key: string) => {
      const r = grid.querySelector(`[data-flow="${key}"]`)?.getBoundingClientRect();
      return r ? { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top } : null;
    };
    const perSink = new Map<string, number>();
    const next: Flight[] = [];
    for (const mv of moves) {
      const a = centre(srcKey(mv.from));
      const b = centre(sinkKey(mv.to));
      if (!a || !b) continue;
      const order = perSink.get(sinkKey(mv.to)) ?? 0;
      perSink.set(sinkKey(mv.to), order + 1);
      next.push({ id: ++flightId, x: a.x, y: a.y, dx: b.x - a.x, dy: b.y - a.y, delay: order * 90 });
    }
    flights = [...flights, ...next];
  }

  /** Let kopie světla: vyrazí ze zdroje, doletí do cíle a tam se rozplyne v krystalu. */
  function flightPath(node: HTMLElement, f: Flight) {
    const end = `translate(calc(-50% + ${f.dx}px), calc(-50% + ${f.dy}px))`;
    const anim = node.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `${end} scale(0.9)`, opacity: 1, offset: 0.82 },
        { transform: `${end} scale(0.6)`, opacity: 0 },
      ],
      { duration: 620, delay: f.delay, easing: 'cubic-bezier(0.45, 0, 0.3, 1)', fill: 'both' },
    );
    anim.onfinish = () => (flights = flights.filter((x) => x.id !== f.id));
    return { destroy: () => anim.cancel() };
  }

  let gridEl: HTMLElement | undefined = $state();
  const ARROWS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

  /**
   * Šipky na desce: fokus skočí na nejbližší krystal v daném směru (podle polohy na desce,
   * takže funguje i pro řadu přenosů o dvě místa a vypínače kopií).
   */
  function onGridKey(e: KeyboardEvent) {
    const dir = ARROWS[e.key];
    const from = e.target;
    if (!dir || !(from instanceof HTMLButtonElement) || !gridEl) return;
    const centre = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const here = centre(from);
    let best: HTMLButtonElement | null = null;
    let bestScore = Infinity;
    for (const b of gridEl.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')) {
      if (b === from) continue;
      const c = centre(b);
      const dx = c.x - here.x;
      const dy = c.y - here.y;
      const along = dx * dir[0] + dy * dir[1];
      if (along <= 4) continue;
      const score = along + 3 * Math.abs(dir[0] ? dy : dx);
      if (score < bestScore) {
        bestScore = score;
        best = b;
      }
    }
    if (best) {
      e.preventDefault();
      best.focus();
    }
  }

  $effect(() => {
    const el = gridEl;
    if (!el) return;
    el.addEventListener('keydown', onGridKey);
    return () => el.removeEventListener('keydown', onGridKey);
  });

  /** Sloupce, které dostaly půjčené světlo (jejich soused vlevo má krystal výpůjčky). */
  const loaned = $derived(carryBelow ? columns.filter((j) => isBitSet(view.carries, j + 1)) : []);

  function sparkLabel(i: number): string {
    if (i === width) return 'Přepad: světlo, které vyteklo z nádoby';
    return sub ? `Krystal výpůjčky ve sloupci ${i + 1} zprava` : `Krystal přenosu nad sloupcem ${i + 1} zprava`;
  }

  function farLabel(i: number): string {
    return `Krystal přenosu o dvě místa nad sloupcem ${i + 1} zprava`;
  }

  function copyLabel(j: number): string {
    return `Kopie prvního činitele posunutá o ${j} ${j === 1 ? 'místo' : j >= 2 && j <= 4 ? 'místa' : 'míst'}, tedy krát ${2 ** j}`;
  }

  function resultLabel(i: number): string {
    return `Výsledek, krystal ${i + 1} zprava${weights ? `, váha ${2 ** i}` : ''}`;
  }

  const description = $derived.by(() => {
    const parts = lines.map((l, j) => (j === 0 ? '' : `${SAY[task.op]} `) + toBinaryString(l, task.op === 'mul' ? width : bits));
    const head =
      task.op === 'mul'
        ? `Násobení ${task.operands[0].toString(2)} krát ${task.operands[1].toString(2)}, ${pick ? 'nabízené kopie, rozsviť ty, které patří k jedničkám' : 'kopie'}: `
        : '';
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
      <Pips total={cfg.tasks.length} done={game.state.step} />
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
        bind:this={gridEl}
        class:tall={farTop || lines.length > 2}
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
              class:wrong={wrong?.column === i && wrong.row !== 'copy'}
              class:flow={game.holding}
              style:grid-column={colOf(i)}
              style:grid-row="1 / {rResult + 1}"
              style:--d="{i * 110}ms"
            >
              {#if wrong?.column === i && wrong.row !== 'copy'}
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
                <span
                  class="loan-gem"
                  class:spent={isSpent(`loan:${j}:${k}`)}
                  data-flow="loan:{j}:{k}"
                  in:fly={{ x: -42, y: 6, duration: 460 * m, delay: k * 90 * m }}><Gem on={true} /></span
                >
              {/each}
            </div>
          {/each}
          <!-- Výpůjčky se odečítají spolu se spodní řadou. -->
          <span class="sign carved" style:grid-column="1" style:grid-row={rCarry}>−</span>
        {/if}
        {#each farCols as i (i)}
          <div class="cell" style:grid-column={colOf(i)} style:grid-row={rFar} data-flow="far:{i}">
            <Spark
              on={isBitSet(view.far, i)}
              spent={isSpent(`far:${i}`)}
              tone="carry"
              highlight={hint?.row === 'far' && hint.column === i}
              wrong={wrong?.row === 'far' && wrong.column === i}
              disabled={!touch}
              label={farLabel(i)}
              onToggle={() => game.toggle({ row: 'far', column: i })}
            />
          </div>
        {/each}
        {#if farTop}
          <span class="sign carved far-mark" style:grid-column="1" style:grid-row={rFar} title="přenos o dvě místa">2</span>
        {/if}

        {#each carryCols as i (i)}
          <div class="cell" style:grid-column={colOf(i)} style:grid-row={rCarry} data-flow="carry:{i}">
            <Spark
              on={isBitSet(view.carries, i)}
              spent={isSpent(`carry:${i}`)}
              tone={i === width ? 'spout' : 'carry'}
              highlight={hint?.row === 'carry' && hint.column === i}
              wrong={wrong?.row === 'carry' && wrong.column === i}
              disabled={!touch}
              label={sparkLabel(i)}
              onToggle={() => game.toggle({ row: 'carry', column: i })}
            />
          </div>
        {/each}

        {#key task}
          {#each lines as line, j (j)}
            {#if pick}
              <!-- Vypínač kopie: rozsvítí ji, když k ní druhý činitel má jedničku. -->
              <div class="cell switch" style:grid-column="1" style:grid-row={lineRow(j)}>
                <Spark
                  on={isBitSet(view.copies, j)}
                  tone="carry"
                  highlight={hint?.row === 'copy' && hint.column === j}
                  wrong={wrong?.row === 'copy' && wrong.column === j}
                  disabled={!touch}
                  label={copyLabel(j)}
                  onToggle={() => game.toggle({ row: 'copy', column: j })}
                />
              </div>
            {:else}
              <span class="sign carved" style:grid-column="1" style:grid-row={lineRow(j)}>{j === 0 ? '' : SIGN[task.op]}</span>
            {/if}
            {#each columns as i (i)}
              {#if shown(j, i)}
                <div
                  class="cell"
                  class:spent={isSpent(`line:${j}:${i}`)}
                  data-flow="line:{j}:{i}"
                  class:off={pick && !isBitSet(view.copies, j)}
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
              {@const n = liveInflow(task, view.carries, i, { cfg, far: view.far, copies: view.copies })}
              <span class="count" class:zero={n === 0} style:grid-column={colOf(i)} style:grid-row={rCounts} title="světel ve sloupci">
                {n}
              </span>
            {/if}
          {/each}
        {/if}

        <div class="rule" style:grid-column="{cellStart} / span {width}" style:grid-row={rRule}></div>

        <span class="sign carved" style:grid-column="1" style:grid-row={rResult}>=</span>
        {#each columns as i, k (i)}
          <div class="cell" style:grid-column={colOf(i)} style:grid-row={rResult} data-flow="result:{i}">
            <Crystal
              on={isBitSet(view.result, i)}
              weight={2 ** i}
              weightState={weights ? 'known' : 'hidden'}
              digit={digits}
              highlight={hint?.row === 'result' && hint.column === i}
              disabled={!touch}
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

        <!-- Kopie světel na cestě do nového místa: dolů do výsledku, nahoru do přenosu. -->
        {#each flights as f (f.id)}
          <span class="flight" style:left="{f.x}px" style:top="{f.y}px" use:flightPath={f} aria-hidden="true"><Gem on={true} /></span>
        {/each}
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
      <p class="visually-hidden">Na desce se mezi krystaly pohybuješ šipkami a přepínáš je mezerníkem nebo klávesou Enter.</p>
      {#if cfg.carries === 'manual'}
        <p class="legend">
          <svg class="mini-gem" viewBox="0 0 20 32" aria-hidden="true" focusable="false">
            <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
          </svg>
          {#if sub}
            Krystal pod spodní řadou: výpůjčka. Tady se odečte a sousedovi vpravo přidá dva krystaly.
          {:else if farTop}
            Krystal nad sloupcem: světlo ze sloupce vpravo. Horní řada (2): přenos o dvě místa, když se ve sloupci slijí čtyři světla a víc.
          {:else if pick}
            Krystal u řady: tahle kopie se sčítá. Rozsviť kopie podle jedniček druhého činitele.
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

  /* Světlo, které odteklo do přenosu: krystal pohasne, číslice řádku zůstává. */
  .cell.spent > :global(.gem svg) {
    opacity: 0.22;
    filter: grayscale(0.4);
    transition:
      opacity 420ms ease,
      filter 420ms ease;
  }
  /* Kopie světla, která letí na nové místo. Nad buňkami, klikání neblokuje. */
  .flight {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 6px rgba(255, 210, 130, 0.85));
  }
  /* Půjčené světlo, které se vyrušilo nebo sjelo do výsledku. */
  .loan-gem.spent > :global(.gem svg) {
    opacity: 0.22;
    filter: grayscale(0.4);
    transition:
      opacity 420ms ease,
      filter 420ms ease;
  }
  .cell.off {
    opacity: 0.28;
    filter: grayscale(0.6);
    transition:
      opacity var(--t-med),
      filter var(--t-med);
  }
  .far-mark {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    opacity: 0.8;
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
  /* Víc řádků (tři řady, nabízené kopie): o něco menší buňky, ať se deska vejde na výšku. */
  .grid.tall {
    --cell: clamp(44px, min(calc((100cqi - 40px - var(--value-w)) / var(--cols)), 8.2vh), 70px);
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
