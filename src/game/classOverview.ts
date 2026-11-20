/**
 * Přehled třídy: učitel přetáhne soubory s postupem od studentů a uvidí, kdo je kde
 * a ve kterých komnatách se třída nejvíc trápí. Všechno se počítá jen v paměti stránky,
 * nic se neukládá ani neodesílá.
 */
import type { ActDef, LevelDef } from '../content/types';
import type { ProgressData } from './progress.svelte.ts';
import { emptyStats, type RoomStats } from './roomStats';

export interface Student {
  /** Jméno ze souboru, nebo název souboru, když jméno chybí. */
  name: string;
  file: string;
  data: ProgressData;
}

export interface FloorProgress {
  basic: number;
  basicTotal: number;
  deep: number;
  deepTotal: number;
}

const isDeep = (id: string): boolean => Number(id.slice(id.indexOf('-') + 1)) > 7;

/** Kolik komnat základu a Hlubších síní má student v patře hotových. */
export function floorProgress(student: Student, act: ActDef): FloorProgress {
  const basic = act.levels.filter((l) => !isDeep(l.id));
  const deep = act.levels.filter((l) => isDeep(l.id));
  const done = (ls: LevelDef[]) => ls.filter((l) => student.data.levels[l.id]).length;
  return { basic: done(basic), basicTotal: basic.length, deep: done(deep), deepTotal: deep.length };
}

export function sealTotal(student: Student): number {
  return Object.values(student.data.levels).reduce(
    (sum, r) => sum + Number(r.seals.solved) + Number(r.seals.skill) + Number(r.seals.pure),
    0,
  );
}

/**
 * Další komnata na základní cestě: první nehotová (cesta se otevírá po jedné, takže právě ta je na řadě).
 * Kde student opravdu hraje, soubor neříká: kdo má základ patra hotový, může být v jeho Hlubších síních.
 * Po hotovém základu vrací null.
 */
export function nextBasicRoom(student: Student, basicPath: LevelDef[]): LevelDef | null {
  return basicPath.find((l) => !student.data.levels[l.id]) ?? null;
}

export interface RoomSummary {
  level: LevelDef;
  /** Kolik studentů komnatu otevřelo. */
  reached: number;
  /** Kolik ji dokončilo. */
  solved: number;
  /** Otevřeli, ale nedokončili (tady se zasekli). */
  stuck: number;
  /** Ukázky kroku: průměr na studenta, který do komnaty vstoupil (i když ji nedokončil). */
  stepHints: number;
  /** Tahy navíc a chyby v kvízu: průměr na jedno dokončení. */
  extra: number;
  quizMistakes: number;
}

/** Souhrn komnat přes celou třídu. */
export function roomSummaries(students: Student[], levels: LevelDef[]): RoomSummary[] {
  return levels.map((level) => {
    let reached = 0;
    let solved = 0;
    const total: RoomStats = emptyStats();
    for (const s of students) {
      const st = s.data.stats[level.id];
      const done = !!s.data.levels[level.id];
      if (done || (st && st.entered > 0)) reached++;
      if (done) solved++;
      if (!st) continue;
      total.solved += st.solved;
      total.stepHints += st.stepHints;
      total.extra += st.extra;
      total.quizMistakes += st.quizMistakes;
    }
    const per = (n: number) => (total.solved ? n / total.solved : 0);
    return {
      level,
      reached,
      solved,
      stuck: reached - solved,
      stepHints: reached ? total.stepHints / reached : 0,
      extra: per(total.extra),
      quizMistakes: per(total.quizMistakes),
    };
  });
}

/** Komnata, která třídě dělá potíže: víc než třetina se v ní zasekla, nebo v průměru chtěla ukázku kroku. */
export function isTroublesome(r: RoomSummary): boolean {
  return (r.reached >= 3 && r.stuck / r.reached > 1 / 3) || r.stepHints >= 1;
}
