import type { PuzzleLevel } from '../content/types';
import { currentTask as cascadeTask, firstWrong, type CascadeState } from '../core/puzzles/cascade';
import { currentTask as tableTask, firstWrongRow, type TableState } from '../core/puzzles/table';
import { currentTask as inscriptionTask, type InscriptionState } from '../core/puzzles/inscription';
import { currentTask as gateTask, hint as gateHint, type GateState } from '../core/puzzles/gate';
import { currentTask as machineTask, hint as machineHint, type MachineState } from '../core/puzzles/machine';

/**
 * Ukázka kroku, která nemá co ukázat: deska sedí a chybí jen potvrzení (u obvodu Zkouška).
 * Vrátí, co má hra říct místo ní (ukázka se pak nezapočítá), jinak null. Oltář, zápis nápisu,
 * Příliv a Maska se posunou samy, jakmile výsledek sedí, takže tam to nenastane.
 */
export function settledHint(level: PuzzleLevel, state: unknown): string | null {
  switch (level.kind) {
    case 'cascade': {
      const st = state as CascadeState;
      return cascadeTask(level.config, st) && !firstWrong(level.config, st) ? 'Všechno sedí. Stačí potvrdit.' : null;
    }
    case 'table': {
      const st = state as TableState;
      return tableTask(level.config, st)?.mode === 'fill' && firstWrongRow(level.config, st) === null
        ? 'Deska zákona sedí. Stačí ji potvrdit.'
        : null;
    }
    case 'inscription': {
      const st = state as InscriptionState;
      const task = inscriptionTask(level.config, st);
      return task?.dir === 'read' && st.dial === task.value ? 'Kotouče ukazují správné číslo. Stačí potvrdit.' : null;
    }
    case 'gate': {
      const st = state as GateState;
      return gateTask(level.config, st)?.mode === 'slots' && !gateHint(level.config, st) ? 'Obvod je hotový. Spusť Zkoušku.' : null;
    }
    case 'machine': {
      const st = state as MachineState;
      return machineTask(level.config, st)?.mode === 'build' && !machineHint(level.config, st) ? 'Stroj je hotový. Spusť Zkoušku.' : null;
    }
    default:
      return null;
  }
}
