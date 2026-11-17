<script lang="ts">
  import { fly } from 'svelte/transition';
  import MachineBoard from './MachineBoard.svelte';
  import MiniPattern from '../MiniPattern.svelte';
  import Icon from '../Icon.svelte';
  import Pips from '../Pips.svelte';
  import Quiz from '../altar/Quiz.svelte';
  import { rowCount } from '../../core/logic';
  import { inputOn, numberValue, rowOf, settle, type MachineLamp } from '../../core/puzzles/machine';
  import { settings } from '../../game/settings.svelte.ts';
  import type { MachineGame } from '../../game/machineGame.svelte.ts';
  import { rowWords } from '../screens/level/machineEvents';

  let { game, pulse }: { game: MachineGame; pulse: number } = $props();

  const level = $derived(game.level);
  const cfg = $derived(level.config);
  const view = $derived(game.view);
  const task = $derived(view.task);
  const machine = $derived(task.machine);
  const n = $derived(machine.inputs.length);
  const rows = $derived(Array.from({ length: rowCount(n) }, (_, r) => r));
  const modern = $derived(level.presentation.showDigits || settings.alwaysDigits);
  const weights = $derived(level.presentation.showWeights !== false || settings.alwaysWeights);
  const values = $derived(level.presentation.showValues !== false);
  const m = $derived(settings.reducedMotion ? 0 : 1);
  const touch = $derived(game.playing || game.free);
  const hl = $derived.by(() => {
    const h = game.hintTarget;
    if (!h) return null;
    if ('input' in h) return { input: h.input };
    if ('pulse' in h) return null;
    return 'node' in h ? { node: h.node } : { socket: h.socket };
  });
  const hlPulse = $derived(!!game.hintTarget && 'pulse' in game.hintTarget);

  const settled = $derived(settle(machine, view.runes, view.wires, view.inputs, view.memory));
  /** Stroj bez paměti: lampy pro každý řádek (deska objevů a deska brány). */
  const lampsAt = (r: number) => settle(machine, view.runes, view.wires, r, {}).lamps;
  const lampDot = (lamps: Record<string, number | null>, l: MachineLamp) => lamps[l.id] === 1;

  /** Čísla na desce (krystaly i lampy) s živou hodnotou. */
  const readouts = $derived(
    (machine.numbers ?? []).map((g) => ({
      label: g.label,
      value: numberValue(g, (id) => (machine.inputs.some((i) => i.id === id) ? inputOn(machine, view.inputs, id) : settled.lamps[id])),
    })),
  );
  const bigTable = $derived(!task.script && rows.length > 8);
  /** Váha krystalu, který patří k číslu (v hlavičce desky odliší krystaly se stejným jménem). */
  const weightOf = $derived.by(() => {
    const out: Record<string, number> = {};
    for (const g of machine.numbers ?? []) {
      if (g.bits.length > 1) g.bits.forEach((id, i) => (out[id] = 2 ** (g.bits.length - 1 - i)));
    }
    return out;
  });
</script>

<div class="workshop">
  {#key pulse}
    {#if pulse > 0}<div class="pulse" aria-hidden="true"></div>{/if}
  {/key}

  <header class="task">
    <p class="task-text carved">{level.presentation.task}</p>
    <Pips total={cfg.tasks.length} done={game.state.step} />
  </header>

  <div class="work">
    <!-- Deska se zmenší podle výšky okna; řada s čísly a tlačítkem Tep pod ní potřebuje místo navíc. -->
    <div class="bench" style:--bench-reserve="{330 + ((readouts.length && values) || game.canBeat ? 58 : 0)}px">
      {#key task}
        <div class="board-wrap" in:fly={{ y: -12, duration: 360 * m }}>
          <MachineBoard
            {machine}
            inputs={view.inputs}
            runes={view.runes}
            wires={view.wires}
            memory={view.memory}
            canToggle={touch}
            canPlace={touch && task.mode === 'build'}
            {modern}
            {weights}
            highlight={hl}
            celebrate={game.phase === 'solved'}
            onInput={(i) => game.toggleInput(i)}
            onSlot={(id) => game.cycleRune(id)}
            onSocket={(key) => game.cycleWire(key)}
          />
        </div>
      {/key}

      {#if (readouts.length && values) || game.canBeat}
      <div class="under">
      {#if readouts.length && values}
        <div class="readouts" aria-live="off">
          {#each readouts as r (r.label)}
            <span class="readout stone-inset"><span class="r-label">{r.label}</span><span class="r-value">{r.value}</span></span>
          {/each}
        </div>
      {/if}

      {#if game.canBeat}
        {#key game.beats}
          <button
            type="button"
            class="beat"
            class:hl={hlPulse}
            class:thump={game.beats > 0}
            disabled={!touch}
            onclick={() => game.pulse()}
            aria-label="Tep Srdce (klávesa T)"
            title="Tep Srdce (T)"
          >
            <Icon name="heart" size={26} />
            <span>Tep</span>
          </button>
        {/key}
      {/if}
      </div>
      {/if}

      {#if view.restless}
        <p class="restless carved">Stroj se neustálí: světlo v kruhu pořád přeskakuje.</p>
      {/if}
    </div>

    {#if game.phase === 'quiz' && game.question}
      {#key game.quizIndex}
        <Quiz {game} />
      {/key}
    {:else if task.mode === 'explore'}
      <!-- Deska objevů: vyzkoušené kombinace vstupů a co udělaly lampy -->
      <div class="side">
        <p class="side-title carved">Vyzkoušeno {view.tried.length} z {rows.length}</p>
        <div class="registry stone" role="list" aria-label="Vyzkoušené kombinace">
          {#each rows as r (r)}
            {@const seen = view.tried.includes(r)}
            {@const lamps = lampsAt(r)}
            <div class="niche stone-inset" class:found={seen} class:current={r === view.inputs} role="listitem" aria-label={seen ? rowWords(machine, r) : 'Zatím nevyzkoušeno'}>
              {#if seen}
                <MiniPattern mask={r} bits={n} size="sm" digits={modern} />
                <span class="dots" aria-hidden="true">
                  {#each machine.lamps as l (l.id)}<span class="dot" class:on={lampDot(lamps, l)}></span>{/each}
                </span>
              {:else}
                <span class="unknown carved" aria-hidden="true">?</span>
              {/if}
            </div>
          {/each}
        </div>
        <p class="legend carved">lampy: {machine.lamps.map((l) => l.label).join(' · ')}</p>
      </div>
    {:else if task.mode === 'goals'}
      <div class="side">
        <p class="side-title carved">Cíle stroje</p>
        <ol class="goals stone">
          {#each task.goals ?? [] as goal, k (k)}
            <li class="goal" class:done={k < view.goal} class:now={k === view.goal} class:just={k === view.goal - 1}>
              <span class="mark" aria-hidden="true">{#if k < view.goal}<Icon name="check" size={16} />{:else}{k + 1}{/if}</span>
              <span>{goal.say}</span>
            </li>
          {/each}
        </ol>
      </div>
    {:else}
      <div class="side">
        {#if task.script}
          <!-- Zkušební posloupnost: kroky, které Zkouška projde od zhasnuté paměti -->
          <p class="side-title carved">Zkouška paměti</p>
          <div class="tests stone" role="table" aria-label="Zkušební posloupnost">
            <div class="trow head" role="row">
              <span role="columnheader">#</span>
              {#each machine.inputs as inp (inp.id)}<span role="columnheader">{inp.label ?? inp.id}{#if weightOf[inp.id]}<sub>{weightOf[inp.id]}</sub>{/if}</span>{/each}
              {#if game.canBeat}<span role="columnheader" aria-label="tep"><Icon name="heart" size={14} /></span>{/if}
              {#each machine.lamps as l (l.id)}<span role="columnheader">{l.label}</span>{/each}
            </div>
            {#each task.script as stepItem, k (k)}
              {@const row = rowOf(machine, stepItem.set)}
              <div class="trow" class:failed={view.failed?.at === k} role="row">
                <span class="idx" role="cell">{k + 1}</span>
                {#each machine.inputs as inp (inp.id)}
                  <span class="bit" class:one={inputOn(machine, row, inp.id) === 1} role="cell">{modern ? inputOn(machine, row, inp.id) : inputOn(machine, row, inp.id) ? '●' : '○'}</span>
                {/each}
                {#if game.canBeat}<span role="cell" class="beat-cell">{#if stepItem.pulse}<Icon name="heart" size={14} />{/if}</span>{/if}
                {#each machine.lamps as l (l.id)}
                  <span role="cell"><span class="dot" class:on={stepItem.expect[l.id] === 1} aria-label={stepItem.expect[l.id] ? 'svítí' : 'mlčí'}></span></span>
                {/each}
              </div>
            {/each}
          </div>
        {:else if bigTable}
          <p class="side-title carved">Brána žádá</p>
          <div class="rule stone">
            <p>{task.rule}</p>
            <p class="small carved">Zkouška projde všech {rows.length} kombinací vstupů.</p>
          </div>
          {#if view.failed && !view.failed.empty}
            <div class="example stone-inset" role="status">
              <p class="small carved">Stroj se spletl:</p>
              <p>{rowWords(machine, view.failed.at)}</p>
            </div>
          {/if}
        {:else}
          <p class="side-title carved">Brána žádá</p>
          <div class="tests stone" role="table" aria-label="Kdy mají lampy svítit">
            <div class="trow head" role="row">
              {#each machine.inputs as inp (inp.id)}<span role="columnheader">{inp.label ?? inp.id}{#if weightOf[inp.id]}<sub>{weightOf[inp.id]}</sub>{/if}</span>{/each}
              {#each machine.lamps as l (l.id)}<span role="columnheader">{l.label}</span>{/each}
            </div>
            {#each rows as r (r)}
              <div class="trow" class:failed={view.failed?.at === r} class:live={r === view.inputs} role="row">
                {#each machine.inputs as inp (inp.id)}
                  <span class="bit" class:one={inputOn(machine, r, inp.id) === 1} role="cell">{modern ? inputOn(machine, r, inp.id) : inputOn(machine, r, inp.id) ? '●' : '○'}</span>
                {/each}
                {#each machine.lamps as l (l.id)}
                  <span role="cell"><span class="dot" class:on={task.target?.[l.id]?.[r] === 1} aria-label={task.target?.[l.id]?.[r] ? 'svítí' : 'mlčí'}></span></span>
                {/each}
              </div>
            {/each}
          </div>
        {/if}
        {#if task.rule && !bigTable}<p class="rule-line carved">{task.rule}</p>{/if}
        {#if game.phase === 'play'}
          <button type="button" class="btn btn-primary btn-lg" onclick={() => game.test()} disabled={!game.playing}>Zkouška</button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .workshop {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 2vh, 20px);
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
    gap: 10px;
    text-align: center;
  }
  .task-text {
    margin: 0;
    max-width: 760px;
    font-size: var(--fs-base);
    color: var(--text-muted);
  }
  .work {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px 36px;
    width: 100%;
  }
  .bench {
    flex: 0 1 760px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .board-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 6px 0 10px;
  }
  .under {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px 18px;
  }
  .readouts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  .readout {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 12px;
    font-family: var(--font-display);
  }
  .r-label {
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .r-value {
    min-width: 1.5ch;
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--lumen);
    text-align: right;
  }
  /* Tep Srdce */
  .beat {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 6px 20px 6px 14px;
    border: 2px solid #7a2e2a;
    border-radius: 24px;
    background: radial-gradient(circle at 35% 35%, #8f3a33, #4a1916 80%);
    box-shadow:
      inset 0 2px 0 rgba(255, 200, 190, 0.2),
      0 4px 10px rgba(0, 0, 0, 0.45);
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
    color: #ffd9cf;
    cursor: pointer;
  }
  .beat:disabled {
    opacity: 0.55;
    cursor: default;
  }
  .beat.thump :global(svg) {
    animation: thump 520ms ease-out;
  }
  @keyframes thump {
    20% {
      transform: scale(1.35);
    }
    40% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.2);
    }
  }
  .restless {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--warn);
  }
  .side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    max-width: 340px;
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
  .registry {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 10px;
  }
  .niche {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 100px;
    min-height: 52px;
    padding: 6px 10px;
  }
  .niche.found.current {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 217, 138, 0.5);
  }
  .unknown {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--stone-400);
  }
  .dots {
    display: inline-flex;
    gap: 4px;
  }
  .dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #5c4214;
    background: #15100b;
  }
  .dot.on {
    background: radial-gradient(circle at 40% 35%, #fff6d8, #ffd27a 50%, #c98a2a);
    box-shadow: 0 0 8px rgba(255, 210, 130, 0.8);
  }
  .legend {
    margin: 0;
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .goals {
    margin: 0;
    padding: 10px 14px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .goal {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    opacity: 0.55;
  }
  .goal.now {
    opacity: 1;
    color: var(--text);
  }
  .goal.done {
    opacity: 0.85;
  }
  .mark {
    flex: none;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
  }
  .goal.done .mark {
    border-color: var(--ok);
    color: var(--ok);
  }
  .goal.now .mark {
    border-color: var(--lumen);
    color: var(--lumen);
  }
  .tests {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
  }
  .trow {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 34px;
    align-items: center;
    justify-items: center;
    min-height: 28px;
    border-radius: 6px;
  }
  .trow.head {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }
  .trow.head sub {
    font-size: 0.75em;
    vertical-align: -0.25em;
  }
  .trow.live {
    background: rgba(255, 236, 200, 0.06);
  }
  .trow.failed {
    background: rgba(240, 149, 122, 0.22);
    box-shadow: inset 0 0 0 1px var(--warn);
  }
  .idx {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .beat-cell {
    color: #e08a7a;
  }
  .bit {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--stone-400);
  }
  .bit.one {
    color: var(--lumen);
  }
  .rule {
    padding: 12px 16px;
    text-align: center;
  }
  .rule p {
    margin: 0;
  }
  .rule p + p {
    margin-top: 6px;
  }
  .small {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .rule-line {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    text-align: center;
  }
  .example {
    padding: 8px 14px;
    text-align: center;
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.7),
      0 0 0 1px var(--warn);
  }
  .example p {
    margin: 0;
  }
  .hl {
    outline: 3px solid var(--ok);
    outline-offset: 3px;
  }
  @media (max-height: 820px) {
    .board-wrap {
      padding: 2px 0 6px;
    }
    .trow {
      min-height: 24px;
    }
  }
</style>
