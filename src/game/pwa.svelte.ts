/**
 * Hra jako webová aplikace (PWA). Service worker uloží celou hru do zařízení, takže po první
 * návštěvě běží i bez internetu, a hra jde nainstalovat na plochu počítače i telefonu.
 * Nová verze se nenačte sama: hráč dostane nabídku a potvrdí ji, až se mu to hodí
 * (ne uprostřed komnaty).
 */
import { registerSW } from 'virtual:pwa-register';

/** Událost, kterou Chrome a Edge nabízejí instalaci (ve standardních typech DOM zatím není). */
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const pwa = $state({
  /** Service worker v tomhle prohlížeči jde (ne u souboru otevřeného z disku). */
  supported: false,
  /** Na webu je nová verze hry, stačí ji načíst. */
  update: false,
  /** Hráč nabídku nové verze zatím odložil. */
  later: false,
  /** Celá hra je uložená v zařízení a poběží i bez internetu. */
  offline: false,
  /** Prohlížeč umí hru nainstalovat jedním tlačítkem (Chrome, Edge, Android). */
  canInstall: false,
  /** Hra běží jako nainstalovaná aplikace. */
  installed: false,
  /** iPhone nebo iPad: instaluje se ručně přes Sdílet → Přidat na plochu. */
  ios: false,
});

let installEvent: InstallPromptEvent | null = null;
let reloadToUpdate: (() => Promise<void>) | null = null;
let started = false;

const HOUR = 60 * 60 * 1000;

export function startPwa() {
  if (started || typeof window === 'undefined') return;
  started = true;
  pwa.supported = 'serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:';

  const standalone = matchMedia('(display-mode: standalone)');
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  pwa.installed = standalone.matches || iosStandalone;
  standalone.addEventListener('change', (e) => (pwa.installed = e.matches || iosStandalone));
  pwa.ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Událost si jen schováme: prohlížeč dál ukazuje svou vlastní nabídku a hra má navíc tlačítko.
  addEventListener('beforeinstallprompt', (e) => {
    installEvent = e as InstallPromptEvent;
    pwa.canInstall = true;
  });
  addEventListener('appinstalled', () => {
    installEvent = null;
    pwa.canInstall = false;
    pwa.installed = true;
  });

  if (!pwa.supported) return;

  reloadToUpdate = registerSW({
    onNeedRefresh: () => (pwa.update = true),
    onOfflineReady: () => (pwa.offline = true),
    onRegisteredSW(_url, reg) {
      if (!reg) return;
      // Hra už byla uložená při některé z předchozích návštěv.
      if (reg.active) pwa.offline = true;
      // Kdo nechá nainstalovanou hru otevřenou celé dny, dozví se o nové verzi nejpozději do hodiny.
      setInterval(() => {
        if (navigator.onLine) reg.update().catch(() => {});
      }, HOUR);
    },
  });

  // Nainstalovaná hra si řekne o trvalé úložiště, aby prohlížeč postup nesmazal, když místo dochází.
  if (pwa.installed) navigator.storage?.persist?.().catch(() => {});
}

/** Otevře nabídku instalace prohlížeče. */
export async function install() {
  if (!installEvent) return;
  const event = installEvent;
  installEvent = null;
  pwa.canInstall = false;
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === 'accepted') pwa.installed = true;
}

/** Načte novou verzi hry (postup je uložený v prohlížeči, nic se neztratí). */
export function applyUpdate() {
  pwa.update = false;
  void reloadToUpdate?.();
}
