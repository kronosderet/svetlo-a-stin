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
npm run build      # produkční build do dist/
npm run build:single  # jeden samostatný HTML soubor do release/
```

## Samostatný soubor (bez serveru a bez internetu)

```bash
npm run build:single
```

Vznikne jediný soubor `release/Svetlo-a-Stin.html` (asi 550 kB), ve kterém je vložené všechno:
skript, styly, písma i ikona. Stačí ho zkopírovat na flashku, sdílený disk nebo poslat e-mailem
a otevřít dvojklikem v prohlížeči (Edge, Chrome). Nepotřebuje server ani připojení k internetu.

- Postup se ukládá v prohlížeči daného počítače. Mezi dvěma hráči u jednoho počítače ho smažte
  v Nastavení → Smazat postup.
- **Postup na jiném počítači:** v Nastavení → Uložit do souboru si ho hráč uloží třeba do svého
  školního OneDrive. V Edge a Chrome si vybere místo sám a hra pak po každé komnatě soubor sama
  doplňuje. Jinde se soubor stáhne. Na jiném počítači ho načte tlačítkem Načíst postup ze souboru
  na úvodní obrazovce (nebo v Nastavení) a v Edge a Chrome může zapnout průběžné ukládání do téhož
  souboru. Spojení se souborem platí do zavření stránky a smazání postupu ho zruší.
- **Jméno pro učitele:** v Nastavení si hráč může vyplnit jméno. Uloží se do souboru s postupem
  a soubor se podle něj i jmenuje, takže se soubory od celé třídy nepletou.
- **Učitelský režim:** v Nastavení po zadání PINu. Otevře všechna patra a komnaty
  (ukázky na projektoru) a zpřístupní **Přehled třídy**: přetáhněte do něj soubory s postupem od
  studentů a uvidíte, kdo je kde a ve kterých komnatách se třída zasekává. Nic se neodesílá.
- **Shrnutí patra** (tlačítko na mapě) vytiskne přeložené zákony patra na jednu stránku.
- **Úsporná grafika** (Nastavení) vypne rozostření a částice. Když se hra trhá, zapne se sama.
- Po každé úpravě hry soubor vytvořte znovu stejným příkazem.

## Struktura

```
src/
  core/        čistá logika bez UI (bity, archetypy Oltář, Nápis, Kaskáda, Příliv) + testy
  content/     data levelů po patrech (act1.ts, act2.ts) a Kodexu; přidání levelu = úprava dat
  game/        reaktivní stav: hra, postup, nastavení, Echo, navigace
  audio/       procedurální zvuk (Web Audio, pentatonika)
  ui/          komponenty a obrazovky (Svelte 5, SVG)
```

Postup hráče a nastavení se ukládají do `localStorage` prohlížeče.
