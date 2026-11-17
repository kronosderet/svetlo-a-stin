<script lang="ts">
  type Name =
    | 'back'
    | 'undo'
    | 'restart'
    | 'hint'
    | 'book'
    | 'settings'
    | 'sound-on'
    | 'sound-off'
    | 'close'
    | 'lock'
    | 'check'
    | 'up'
    | 'down'
    | 'save'
    | 'teacher'
    | 'print'
    | 'install'
    | 'info'
    | 'heart'
    | 'rotate';

  let { name, size = 20 }: { name: Name; size?: number } = $props();

  const paths: Record<Name, string[]> = {
    back: ['M15 18l-6-6 6-6'],
    undo: ['M9 14L4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
    restart: ['M3.5 12a8.5 8.5 0 1 0 2.6-6.1', 'M3 4v5h5'],
    hint: ['M12 3l2 6.5 6.5 2.5-6.5 2-2 7-2-7-6.5-2 6.5-2.5z'],
    book: ['M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z', 'M12 6.5V19.5'],
    settings: ['M4 7h10', 'M18 7h2', 'M4 17h4', 'M12 17h8', 'M16 5v4', 'M10 15v4'],
    'sound-on': ['M4 9.5h3.5L12 6v12l-4.5-3.5H4z', 'M15.5 9.5a3.5 3.5 0 0 1 0 5', 'M18 7a7 7 0 0 1 0 10'],
    'sound-off': ['M4 9.5h3.5L12 6v12l-4.5-3.5H4z', 'M16 10l4 4', 'M20 10l-4 4'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
    lock: ['M7.5 11V8a4.5 4.5 0 0 1 9 0v3', 'M5.5 11h13v9h-13z'],
    check: ['M5 12.5l4.5 4.5L19 7.5'],
    up: ['M6 15l6-6 6 6'],
    down: ['M6 9l6 6 6-6'],
    save: ['M5 4h11l3 3v13H5z', 'M8 4v5h7V4', 'M8 20v-6h8v6'],
    install: ['M12 4v11', 'M7.5 10.5L12 15l4.5-4.5', 'M5 19h14'],
    info: ['M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17z', 'M12 11v5.5', 'M12 7.6v.4'],
    heart: ['M12 19.5s-7-4.4-7-9.6a3.9 3.9 0 0 1 7-2.4 3.9 3.9 0 0 1 7 2.4c0 5.2-7 9.6-7 9.6z'],
    // Telefon na výšku, šipka a telefon na šířku.
    rotate: ['M4 3h6v11H4z', 'M6.5 12h1', 'M11 20h9v-6h-9z', 'M13.5 5.5a5 5 0 0 1 5 5', 'M16.5 9.5l2 1 1-2'],
    teacher: ['M3 9l9-4 9 4-9 4z', 'M7 11v4.5c1.5 1.5 3 2 5 2s3.5-.5 5-2V11', 'M21 9v5'],
    print: ['M7 9V4h10v5', 'M6 17H4v-6h16v6h-2', 'M7 14h10v6H7z'],
  };
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  {#each paths[name] as d (d)}
    <path {d} />
  {/each}
</svg>

<style>
  .icon {
    flex: none;
    display: block;
  }
</style>
