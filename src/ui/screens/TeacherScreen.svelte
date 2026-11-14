<script lang="ts">
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import { ACTS, BASIC_PATH, LEVELS, actOf, roomNumber } from '../../content/levels';
  import { KODEX } from '../../content/kodex';
  import { currentRoom, floorProgress, isTroublesome, roomSummaries, sealTotal, type Student } from '../../game/classOverview';
  import { go } from '../../game/nav.svelte.ts';
  import { parseProgress } from '../../game/progressFile';
  import { settings } from '../../game/settings.svelte.ts';
  import { plural } from '../../game/text';

  let students: Student[] = $state([]);
  let problems: string[] = $state([]);
  let dragging = $state(false);
  let picker: HTMLInputElement | undefined = $state();

  const rooms = $derived(roomSummaries(students, LEVELS));
  const fmt = (n: number) => (n ? n.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : '–');

  async function addFiles(files: FileList | File[]) {
    const fresh: Student[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      const r = parseProgress(
        await file.text(),
        LEVELS.map((l) => l.id),
        KODEX.map((k) => k.id),
      );
      if (!r.ok) {
        errors.push(`${file.name}: ${r.reason}`);
        continue;
      }
      const name = r.data.name || file.name.replace(/\.json$/i, '').replace(/^Svetlo-a-Stin-postup-?/, '') || file.name;
      fresh.push({ name, file: file.name, data: r.data });
    }
    // Stejný soubor nahraný podruhé nahradí ten předchozí.
    const files_ = new Set(fresh.map((s) => s.file));
    students = [...students.filter((s) => !files_.has(s.file)), ...fresh].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    problems = errors;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files.length) addFiles(e.dataTransfer.files);
  }
</script>

<div class="teacher-screen">
  <header class="topbar">
    <button type="button" class="icon-btn" onclick={() => go({ name: 'map' })} aria-label="Zpět na mapu">
      <Icon name="back" />
    </button>
    <span class="place carved">Přehled třídy</span>
    <button type="button" class="icon-btn" onclick={() => window.print()} aria-label="Tisknout přehled" title="Tisknout">
      <Icon name="print" />
    </button>
  </header>

  <div class="sheet parchment">
    {#if !settings.teacher}
      <p class="note">Přehled třídy je součástí učitelského režimu. Zapni ho v Nastavení.</p>
    {:else}
      <h1>Přehled třídy</h1>
      <p class="lead">
        Přetáhni sem soubory s postupem od studentů (třeba celou složku ze sdíleného OneDrive), nebo je vyber tlačítkem.
        Soubory zůstanou jen v tomto okně: nic se neukládá ani neodesílá.
      </p>

      <div
        class="drop"
        class:dragging
        role="region"
        aria-label="Místo pro soubory s postupem"
        ondragover={(e) => {
          e.preventDefault();
          dragging = true;
        }}
        ondragleave={() => (dragging = false)}
        ondrop={onDrop}
      >
        <button type="button" class="btn btn-primary" onclick={() => picker?.click()}>Vybrat soubory</button>
        <span>nebo je sem přetáhni</span>
        <input
          bind:this={picker}
          class="visually-hidden"
          type="file"
          accept=".json,application/json"
          multiple
          tabindex="-1"
          onchange={(e) => e.currentTarget.files && addFiles(e.currentTarget.files)}
        />
        {#if students.length}
          <button type="button" class="btn btn-ghost" onclick={() => (students = [])}>Vymazat seznam</button>
        {/if}
      </div>
      {#each problems as p (p)}<p class="problem" role="status">{p}</p>{/each}

      {#if students.length}
        <h2>Studenti <span class="count">({students.length})</span></h2>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Jméno</th>
                {#each ACTS as a (a.numeral)}
                  <th scope="col">Patro {a.numeral}<span class="sub">základ · hlubší</span></th>
                {/each}
                <th scope="col">Pečetě</th>
                <th scope="col">Teď v komnatě</th>
                <th scope="col">Ukázky kroku</th>
              </tr>
            </thead>
            <tbody>
              {#each students as s (s.file)}
                {@const here = currentRoom(s, BASIC_PATH, LEVELS)}
                <tr>
                  <th scope="row" title={s.file}>{s.name}</th>
                  {#each ACTS as a (a.numeral)}
                    {@const f = floorProgress(s, a)}
                    <td class:full={f.basic === f.basicTotal}>{f.basic}/{f.basicTotal} · {f.deep}/{f.deepTotal}</td>
                  {/each}
                  <td>{sealTotal(s)}</td>
                  <td>{here ? `${here.id} ${here.title}` : 'vše hotovo'}</td>
                  <td>{Object.values(s.data.stats).reduce((n, st) => n + st.stepHints, 0) || '–'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <h2>Komnaty</h2>
        <p class="lead">
          Zvýrazněné komnaty dělají třídě potíže: víc než třetina se v nich zasekla, nebo v průměru potřebovali ukázat krok.
          Ukázky kroku jsou průměr na studenta, který do komnaty vstoupil; tahy navíc a chyby v kvízu na jedno dokončení.
        </p>
        <div class="scroll">
          <table class="rooms">
            <thead>
              <tr>
                <th scope="col">Komnata</th>
                <th scope="col">Prošlo</th>
                <th scope="col">Zaseklo se</th>
                <th scope="col">Ø ukázek kroku</th>
                <th scope="col">Ø tahů navíc</th>
                <th scope="col">Ø chyb v kvízu</th>
              </tr>
            </thead>
            <tbody>
              {#each rooms as r (r.level.id)}
                {#if r.reached > 0}
                  <tr class:trouble={isTroublesome(r)}>
                    <th scope="row">
                      <span class="room"><Glyph value={actOf(r.level.id).glyphBase + roomNumber(r.level.id)} size={18} /> {r.level.id} {r.level.title}</span>
                    </th>
                    <td>{r.solved} / {students.length}</td>
                    <td>{r.stuck || '–'}</td>
                    <td>{fmt(r.stepHints)}</td>
                    <td>{fmt(r.extra)}</td>
                    <td>{fmt(r.quizMistakes)}</td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
        <p class="lead small">
          Do komnat, které tu chybí, zatím nikdo nevstoupil. Statistiky se sbírají od verze s přehledem třídy; starší soubory
          ukážou jen hotové komnaty ({plural(students.length, 'soubor', 'soubory', 'souborů')}: {students.length}).
        </p>
      {/if}
    {/if}
  </div>
</div>

<style>
  .teacher-screen {
    max-width: 1080px;
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
  .sheet {
    margin-top: 22px;
    padding: clamp(16px, 3vw, 32px);
    border-radius: 4px;
    color: var(--ink);
  }
  h1 {
    margin: 0 0 6px;
    font-size: var(--fs-2xl);
    color: var(--ink);
  }
  h2 {
    margin: 26px 0 8px;
    font-size: var(--fs-xl);
    color: var(--ink);
  }
  .count {
    font-family: var(--font-body);
    font-size: var(--fs-md);
    color: var(--ink-muted);
  }
  .lead,
  .note {
    margin: 0 0 12px;
    font-size: var(--fs-md);
    color: var(--ink-muted);
  }
  .small {
    margin-top: 10px;
    font-size: var(--fs-sm);
  }
  .drop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 18px;
    border: 2px dashed rgba(92, 74, 51, 0.5);
    border-radius: 8px;
    color: var(--ink-muted);
  }
  .drop.dragging {
    border-color: var(--ink-red);
    background: rgba(143, 47, 23, 0.06);
  }
  .problem {
    margin: 8px 0 0;
    color: var(--ink-red);
    font-size: var(--fs-sm);
  }
  .scroll {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-sm);
  }
  th,
  td {
    padding: 7px 10px;
    border-bottom: 1px solid rgba(92, 74, 51, 0.25);
    text-align: left;
    white-space: nowrap;
  }
  thead th {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-muted);
    vertical-align: bottom;
  }
  .sub {
    display: block;
    font-family: var(--font-body);
    font-size: 0.85em;
    text-transform: none;
    letter-spacing: 0;
  }
  tbody th {
    font-weight: 700;
  }
  td.full {
    color: #2f6b3a;
    font-weight: 700;
  }
  .room {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    --umbra: rgba(61, 44, 12, 0.35);
    --lumen: #2e1f06;
  }
  tr.trouble {
    background: rgba(143, 47, 23, 0.1);
  }
  tr.trouble th {
    color: var(--ink-red);
  }
  @media print {
    .topbar,
    .drop {
      display: none;
    }
    .sheet {
      margin: 0;
      box-shadow: none;
      background: #fff;
    }
  }
</style>
