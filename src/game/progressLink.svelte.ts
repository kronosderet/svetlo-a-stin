/**
 * Spojení se souborem s postupem. V Edge a Chrome si hráč soubor vybere sám (třeba ve školním
 * OneDrive) a hra do něj po každé komnatě postup doplní. Jinde se soubor stáhne a načte ručně.
 * Spojení platí jen do zavření stránky: na sdíleném počítači se další hráč nezapíše do cizího souboru.
 */
import { KODEX } from '../content/kodex';
import { LEVELS } from '../content/levels';
import { FILE_NAME, covers, parseProgress, roomCount, serializeProgress } from './progressFile';
import { onProgressSaved, progressSnapshot, replaceProgress, type ProgressData } from './progress.svelte.ts';
import { plural } from './text';

interface Writable {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

interface FileHandle {
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<Writable>;
  requestPermission?(options: { mode: 'readwrite' }): Promise<PermissionState>;
}

type PickerWindow = Window & {
  showSaveFilePicker?: (options: object) => Promise<FileHandle>;
  showOpenFilePicker?: (options: object) => Promise<FileHandle[]>;
};

const TYPES = [{ description: 'Postup Světla & Stínu', accept: { 'application/json': ['.json'] } }];

export const fileLink = $state({
  /** Soubor, do kterého se postup průběžně ukládá. */
  name: null as string | null,
  /** Načtený soubor, do kterého zatím nejde zapisovat: stačí jeden klik na povolení. */
  offer: null as string | null,
  message: '',
  error: false,
});

let handle: FileHandle | null = null;
let pending: FileHandle | null = null;
let queue: Promise<void> = Promise.resolve();

const pickers = (): PickerWindow => window as PickerWindow;

function say(message: string, error = false): void {
  fileLink.message = message;
  fileLink.error = error;
}

const rooms = (p: ProgressData): string => {
  const n = roomCount(p);
  return `${n} ${plural(n, 'komnata', 'komnaty', 'komnat')}`;
};

async function writeTo(h: FileHandle): Promise<void> {
  const w = await h.createWritable();
  await w.write(serializeProgress(progressSnapshot()));
  await w.close();
}

function link(h: FileHandle): void {
  handle = h;
  pending = null;
  fileLink.name = h.name;
  fileLink.offer = null;
}

// Po každém uložení postupu v prohlížeči se doplní i spojený soubor.
onProgressSaved(() => {
  const h = handle;
  if (!h) return;
  queue = queue
    .then(() => writeTo(h))
    .catch(() => {
      if (handle === h) unlinkFile();
      say('Do souboru se už nedaří ukládat. Ulož postup znovu.', true);
    });
});

/** Uloží postup: v Edge a Chrome do zvoleného souboru (a dál průběžně), jinde stažením. */
export async function saveToFile(): Promise<void> {
  const showSave = pickers().showSaveFilePicker;
  if (typeof showSave === 'function') {
    try {
      const h = await showSave.call(window, { suggestedName: FILE_NAME, types: TYPES });
      await writeTo(h);
      link(h);
      say(`Uloženo do souboru ${h.name}. Po každé komnatě se postup do souboru doplní sám.`);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') say('Soubor se nepodařilo uložit.', true);
    }
    return;
  }
  const url = URL.createObjectURL(new Blob([serializeProgress(progressSnapshot())], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = FILE_NAME;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  say(`Soubor ${FILE_NAME} se stáhl. Ulož si ho do svého OneDrive nebo na Disk Google.`);
}

/** Otevře okno pro výběr souboru. Vrací false, když to prohlížeč neumí (pak poslouží <input type="file">). */
export async function pickAndLoad(): Promise<boolean> {
  const showOpen = pickers().showOpenFilePicker;
  if (typeof showOpen !== 'function') return false;
  try {
    const [h] = await showOpen.call(window, { types: TYPES, multiple: false });
    if (await loadText(await (await h.getFile()).text())) {
      pending = h;
      fileLink.offer = h.name;
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError') say('Soubor se nepodařilo otevřít.', true);
  }
  return true;
}

export async function loadFile(file: File): Promise<void> {
  await loadText(await file.text());
}

async function loadText(text: string): Promise<boolean> {
  const r = parseProgress(
    text,
    LEVELS.map((l) => l.id),
    KODEX.map((k) => k.id),
  );
  if (!r.ok) {
    say(r.reason, true);
    return false;
  }
  const local = progressSnapshot();
  if (roomCount(local) > 0 && !covers(r.data, local)) {
    const ok = window.confirm(
      `V tomto prohlížeči je uložený jiný postup (${rooms(local)}). Nahradit ho postupem ze souboru (${rooms(r.data)})?`,
    );
    if (!ok) {
      say('Načtení zrušeno, postup v prohlížeči zůstal beze změny.');
      return false;
    }
  }
  unlinkFile();
  replaceProgress(r.data);
  say(`Postup načten: ${rooms(r.data)}.`);
  return true;
}

/** Po načtení: povolí zápis do stejného souboru, aby se do něj postup dál ukládal. */
export async function keepSavingToLoaded(): Promise<void> {
  const h = pending;
  if (!h) return;
  try {
    const state = await h.requestPermission?.({ mode: 'readwrite' });
    if (state && state !== 'granted') {
      say('Bez povolení zápisu do souboru ukládat nejde.', true);
      return;
    }
    await writeTo(h);
    link(h);
    say(`Postup se teď průběžně ukládá do souboru ${h.name}.`);
  } catch {
    say('Do souboru se nepodařilo zapisovat.', true);
  }
}

/** Odpojí soubor (třeba při smazání postupu, aby se další hráč nezapsal do cizího souboru). */
export function unlinkFile(): void {
  handle = null;
  pending = null;
  fileLink.name = null;
  fileLink.offer = null;
  say('');
}
