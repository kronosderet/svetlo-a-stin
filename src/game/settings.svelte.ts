const KEY = 'svetlo-stin.settings.v1';
/** Klíč z doby, kdy se hra jmenovala Lumen & Umbra; nastavení se z něj převezme. */
const LEGACY_KEY = 'lumen-umbra.settings.v1';

export interface Settings {
  sound: boolean;
  /** Ukazovat číslice 0/1 pod krystaly vždy, i před „překladem“. */
  alwaysDigits: boolean;
  /** Ukazovat váhy i v komnatách, kde už zmizely (od I-6). */
  alwaysWeights: boolean;
  reducedMotion: boolean;
}

function defaults(): Settings {
  let reduced = false;
  try {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    /* prostředí bez matchMedia */
  }
  return { sound: true, alwaysDigits: false, alwaysWeights: false, reducedMotion: reduced };
}

function load(): Settings {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (raw) return { ...base, ...JSON.parse(raw) };
  } catch {
    /* úložiště nedostupné */
  }
  return base;
}

export const settings: Settings = $state(load());

export function saveSettings(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* úložiště nedostupné */
  }
}
