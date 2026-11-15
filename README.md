# Světlo & Stín

Didaktická hra o binární matematice, logice a výpočtech v atmosféře zapomenuté civilizace.
Cílová skupina: sexta gymnázia. Herní design a plán vývoje jsou v [PLAN.md](PLAN.md).

**Stav:** prototyp, Akty I až III, 45 komnat. Každé patro má základní cestu 1–7 (komnata 7 je
brána) a nepovinné Hlubší síně 8–15 (komnata 15 je velká brána).
Akt I, Předsíň Prvního Světla: základ (bit, kombinace 2ⁿ, poziční hodnota, převody oběma
směry), Hlubší síně (pátý krystal, přenos, bajt, Grayův kód, šestnáctková soustava a glyfy).
Akt II, Síň Počtářů: základ (sčítání s přenosem, přetečení, posuny ×2 a ÷2, smíšená brána),
Hlubší síně (odčítání s výpůjčkou, stavba čísla, násobení s výběrem kopií, dělení posunem se
zbytkem, tři řady, dvojkový doplněk, Váhy Osudu).
Akt III, Zahrada Bran: základ (runy NOT, AND, OR, XOR jako spojky výrokové logiky, pravdivostní
tabulky, skládání run do NAND a NOR, smíšená brána), Hlubší síně (De Morgan, ekvivalence
a implikace, funkce většiny, univerzalita NAND, bitové masky, šifra XOR, zjednodušení obvodu).

Archetypy Oltář, Nápis (kotouče, i s glyfy), Počítadlo, Kaskáda (počítání pod sebou), Příliv
(páky posunu), Brána (obvod s runami a točitými kameny), Deska zákona (pravdivostní tabulka)
a Maska (bitové operace s oktávou); brány pater jsou
smíšené komnaty. Komnaty na procvičování a zkoušky losují úlohy při každém vstupu
(`src/content/generators.ts`, `generators3.ts`).

## Spuštění

```bash
npm install
npm run dev        # vývojový server na http://localhost:5173
npm test           # testy logiky a obsahu levelů
npm run check      # typová kontrola (svelte-check)
npm run build      # webová aplikace (PWA) do dist/
npm run preview    # vyzkoušet build na http://localhost:4173 (i s offline režimem)
npm run build:single  # jeden samostatný HTML soubor do release/
```

## Webová aplikace (doporučená cesta k hráčům)

Hra je progresivní webová aplikace (PWA). Stačí ji nahrát na statický hosting a hráčům dát
adresu, třeba jako QR kód na tabuli.

- Běží v prohlížeči na počítači, tabletu i telefonu.
- Jde nainstalovat jako aplikace s vlastní ikonou, která se spouští v celém okně: v Chrome a Edge
  tlačítkem Nainstalovat hru (na úvodní obrazovce nebo v Nastavení), na Androidu i z nabídky
  prohlížeče, na iPhonu a iPadu v Safari přes Sdílet → Přidat na plochu.
- Po první návštěvě běží i bez internetu: service worker uloží celou hru (asi 700 kB).
- Novou verzi nabídne sama. Načte se, až ji hráč potvrdí, a nikdy ne uprostřed komnaty.
- Postup zůstává jen v zařízení. Hra nemá server ani účty a nic neodesílá.
- Safari na iPhonu a iPadu maže data webů, které nikdo delší dobu neotevřel. Hry přidané
  na plochu se to netýká, proto tam doporučte instalaci a zálohu postupu do souboru.

### Nasazení

`npm run build` vytvoří složku `dist/` s relativními cestami, takže hra funguje v kořeni domény
i v podsložce.

- **GitHub Pages:** workflow `.github/workflows/deploy.yml` po každém pushi do `main` spustí
  typovou kontrolu, testy a build a hru nasadí na `https://<uživatel>.github.io/svetlo-a-stin/`.
  GitHub Pages jsou zdarma jen pro veřejné repozitáře; u soukromého se nasazení přeskočí.
  Jednorázově v repozitáři: Settings → Pages → Source: GitHub Actions.
- **Cloudflare Pages nebo Netlify** (zdarma i pro soukromý repozitář): propojit repozitář,
  příkaz pro build `npm run build`, výstupní složka `dist`.

Ikony aplikace jsou v `public/`: 192 a 512 px, maskovatelná 512 px pro Android a 180 px pro
iPhone. Vycházejí ze znaku hry ve `favicon.svg`.

## Samostatný soubor (bez serveru a bez internetu)

```bash
npm run build:single
```

Vznikne jediný soubor `release/Svetlo-a-Stin.html` (asi 740 kB), ve kterém je vložené všechno:
skript, styly, písma i ikona. Stačí ho zkopírovat na flashku, sdílený disk nebo poslat e-mailem
a otevřít dvojklikem v prohlížeči (Edge, Chrome). Nepotřebuje server ani připojení k internetu.
Hodí se pro počítače bez internetu. Instalaci ani automatické aktualizace nemá a na telefonu
se otevírá špatně, tam patří webová verze. Po každé úpravě hry soubor vytvořte znovu.

## Postup, učitel a nastavení

- Postup se ukládá v prohlížeči daného počítače. Mezi dvěma hráči u jednoho počítače ho smažte
  v Nastavení → Smazat postup.
- **Postup na jiném počítači:** v Nastavení → Uložit do souboru si ho hráč uloží třeba do svého
  školního OneDrive. V Edge a Chrome si vybere místo sám a hra pak po každé komnatě soubor sama
  doplňuje. Jinde se soubor stáhne. Na jiném počítači ho načte tlačítkem Načíst postup ze souboru
  na úvodní obrazovce (nebo v Nastavení) a v Edge a Chrome může zapnout průběžné ukládání do téhož
  souboru. Spojení se souborem platí do zavření stránky a smazání postupu ho zruší.
- **Jméno pro učitele:** v Nastavení si hráč může vyplnit jméno. Uloží se do souboru s postupem
  a soubor se podle něj i jmenuje, takže se soubory od celé třídy nepletou.
- **Učitelský režim:** v Nastavení po zadání PINu, který učitelům posílá autor
  (kotyza.jakub@centrum.cz). Otevře všechna patra a komnaty
  (ukázky na projektoru) a zpřístupní **Přehled třídy**: přetáhněte do něj soubory s postupem od
  studentů a uvidíte, kdo je kde a ve kterých komnatách se třída zasekává. Nic se neodesílá.
- **Shrnutí patra** (tlačítko na mapě) vytiskne přeložené zákony patra na jednu stránku.
- **Úsporná grafika** (Nastavení) vypne rozostření a částice. Když se hra trhá, zapne se sama.

## Autoři a licence

Hru vytvořil **Jakub Kotyza** ve spolupráci s **Claude**, umělou inteligencí od Anthropic.

Celé dílo (kód, texty, úlohy, grafika) je pod licencí
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.cs), podrobnosti jsou
v souboru [LICENSE](LICENSE).

- **Veřejné školy, doma, samostudium:** hru můžete volně používat, upravovat a sdílet, když
  uvedete autora („Světlo & Stín, Jakub Kotyza, CC BY-NC-SA 4.0“) a upravené verze sdílíte pod
  stejnou licencí.
- **Soukromé školy, placené kurzy a doučování, prodej, placené aplikace a platformy:** potřebujete
  komerční licenci. Napište na kotyza.jakub@centrum.cz.
- **PIN učitelského režimu** posílá učitelům autor na stejné adrese.

Písma (SIL Open Font License) a přibalené knihovny (MIT) mají vlastní licence. Webová verze je
uvádí v souboru `licence-knihoven.md`.

Příspěvky (pull requesty) jsou vítané. Posláním příspěvku souhlasíte, že ho autor smí šířit pod
licencí projektu i pod komerční licencí.

## Struktura

```
src/
  core/        čistá logika bez UI (bity, logika run, všechny archetypy) + testy
  content/     data levelů po patrech (act1.ts až act3.ts) a Kodexu; přidání levelu = úprava dat
  game/        reaktivní stav: hra, postup, nastavení, Echo, navigace, PWA (pwa.svelte.ts)
  audio/       procedurální zvuk (Web Audio, pentatonika)
  ui/          komponenty a obrazovky (Svelte 5, SVG)
```

Postup hráče a nastavení se ukládají do `localStorage` prohlížeče.
