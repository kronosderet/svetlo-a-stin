# Světlo & Stín

Didaktická hra o binární matematice, logice a výpočtech v atmosféře zapomenuté civilizace.
Cílová skupina: sexta gymnázia. Herní design a plán vývoje jsou v [PLAN.md](PLAN.md).

**Stav:** prototyp, Akty I a II, 20 komnat. Akt I, Předsíň Prvního Světla (bit, kombinace 2ⁿ,
poziční hodnota, převody oběma směry, přenos, bajt). Akt II, Síň Počtářů (sčítání s přenosem,
přetečení, odčítání s výpůjčkou, posuny ×2 a ÷2, násobení). Archetypy Oltář, Nápis (kotouče),
Počítadlo, Kaskáda (počítání pod sebou) a Příliv (páky posunu). Komnaty na procvičování
a zkoušky losují úlohy při každém vstupu (`src/content/generators.ts`).

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
