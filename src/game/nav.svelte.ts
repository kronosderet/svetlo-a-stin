/** run: nový pokus o stejnou komnatu (komnata se vytvoří znovu a vylosuje nové úlohy). */
export type Screen =
  | { name: 'title' }
  | { name: 'map' }
  | { name: 'level'; id: string; run?: number }
  /** Přehled třídy z přetažených souborů s postupem (učitelský režim). */
  | { name: 'teacher' }
  /** Shrnutí patra k tisku (act = index patra v ACTS). */
  | { name: 'summary'; act: number };

export const nav: { screen: Screen } = $state({ screen: { name: 'title' } });

export const ui = $state({
  kodexOpen: false,
  kodexFocus: null as string | null,
  settingsOpen: false,
});

export function go(screen: Screen): void {
  nav.screen = screen;
  ui.kodexOpen = false;
  try {
    window.scrollTo(0, 0);
  } catch {
    /* mimo prohlížeč */
  }
}

export function openKodex(focus: string | null = null): void {
  ui.kodexFocus = focus;
  ui.kodexOpen = true;
}
