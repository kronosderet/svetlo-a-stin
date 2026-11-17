/** Autorství a licence hry: na jednom místě pro titulní obrazovku, Nastavení i dokumentaci. */
export const AUTHOR = 'Jakub Kotyza';
export const CONTACT = 'kotyza.jakub@centrum.cz';
export const YEAR = 2026;
export const LICENSE_NAME = 'CC BY-NC-SA 4.0';
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.cs';

/** Verze hry pro lidi: 0.4.0-alpha → „0.4 alpha“ (verze se mění jen v package.json). */
export function versionLabel(v: string): string {
  const [num, tag] = v.split('-');
  const short = num.replace(/\.0$/, '');
  return tag ? `${short} ${tag}` : short;
}

export const VERSION = versionLabel(typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0');
