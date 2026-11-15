<script lang="ts">
  // Sdílené přechody pro všechny krystaly (jedna definice v dokumentu).
</script>

<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="gem-off" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a3444" />
      <stop offset="0.55" stop-color="#221e2a" />
      <stop offset="1" stop-color="#121016" />
    </linearGradient>
    <linearGradient id="gem-on" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#fff3cc" />
      <stop offset="0.35" stop-color="#ffd98a" />
      <stop offset="0.68" stop-color="#f2c14e" />
      <stop offset="1" stop-color="#c3851a" />
    </linearGradient>
    <linearGradient id="plinth-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7a6a56" />
      <stop offset="1" stop-color="#4f4235" />
    </linearGradient>
    <linearGradient id="plinth-front" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a3e31" />
      <stop offset="1" stop-color="#231c15" />
    </linearGradient>
    <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f0d48a" />
      <stop offset="0.5" stop-color="#b08a3a" />
      <stop offset="1" stop-color="#5e4416" />
    </linearGradient>
    <radialGradient id="light-pool">
      <stop offset="0" stop-color="#ffe2a0" stop-opacity="0.95" />
      <stop offset="1" stop-color="#f2a64e" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="gem-core">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="1" stop-color="#ffe7a8" stop-opacity="0" />
    </radialGradient>
    <!-- Otvor v podstavci, do kterého svítí zapuštěný krystal: nejjasnější je zadní vnitřní stěna. -->
    <radialGradient id="hole-glow" cx="0.5" cy="0.32" r="0.62">
      <stop offset="0" stop-color="#fff0c4" />
      <stop offset="0.45" stop-color="#f2b356" stop-opacity="0.9" />
      <stop offset="1" stop-color="#7a3e10" stop-opacity="0.2" />
    </radialGradient>
    <!-- Světlo stoupající z otvoru podstavce pod rozsvíceným krystalem. -->
    <linearGradient id="hole-beam" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#ffe2a0" stop-opacity="0.8" />
      <stop offset="0.45" stop-color="#f2c14e" stop-opacity="0.35" />
      <stop offset="1" stop-color="#f2a64e" stop-opacity="0" />
    </linearGradient>
    <!--
      Krystal zapuštěný do podstavce (souřadnice krystalu 100 × 160): pod předním okrajem otvoru
      není vidět. Střed otvoru leží ve výšce 153,6, otvor má poloosy 25 a 6,25 (viz Crystal.svelte).
      V klidu špička jen nahlíží do otvoru, ořez se uplatní, když krystal po doteku dosedne.
    -->
    <clipPath id="crystal-seat" clipPathUnits="userSpaceOnUse">
      <path d="M-60 -60H160V153.6H75A25 6.25 0 0 1 25 153.6H-60Z" />
    </clipPath>
  </defs>
</svg>

<style>
  .defs {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }
</style>
