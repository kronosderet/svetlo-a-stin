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
  /** Učitelský režim (zapíná se PINem v Nastavení): všechny komnaty jsou otevřené. */
  teacher: boolean;
  /** Úsporná grafika: bez rozostření a částic, pro pomalé školní počítače. */
  lite: boolean;
  /** Úspornou grafiku zapnula hra sama, protože se trhala. */
  liteAuto: boolean;
  /** Hráč úspornou grafiku přepnul sám: hra ji pak už sama nezapíná. */
  liteSet: boolean;
}

/** PIN učitelského režimu. Není to zabezpečení, jen pojistka proti náhodnému zapnutí. */
export const TEACHER_PIN = '????';

function defaults(): Settings {
  let reduced = false;
  try {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    /* prostředí bez matchMedia */
  }
  return { sound: true, alwaysDigits: false, alwaysWeights: false, reducedMotion: reduced, teacher: false, lite: false, liteAuto: false, liteSet: false };
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
