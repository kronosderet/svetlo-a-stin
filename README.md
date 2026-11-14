# Světlo & Stín

Didaktická hra o binární matematice, logice a výpočtech v atmosféře zapomenuté civilizace.
Cílová skupina: sexta gymnázia. Herní design a plán vývoje jsou v [PLAN.md](PLAN.md).

**Stav:** prototyp, Akty I a II, 20 komnat. Akt I, Předsíň Prvního Světla (bit, kombinace 2ⁿ,
poziční hodnota, převody oběma směry, přenos, bajt). Akt II, Síň Počtářů (sčítání s přenosem,
přetečení, odčítání s výpůjčkou, posuny ×2 a ÷2, násobení). Archetypy Oltář, Nápis (kotouče),
Počítadlo, Kaskáda (počítání pod sebou) a Příliv (páky posunu).

## Spuštění

```bash
npm install
npm run dev        # vývojový server na http://localhost:5173
npm test           # testy logiky a obsahu levelů
npm run check      # typová kontrola (svelte-check)
npm run build      # produkční build do dist/
```

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
