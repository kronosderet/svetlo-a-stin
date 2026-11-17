# Sazba a písma

> Kontrola sazby, odsazení a rozložení na šesti rozlišeních a revize písem. Verze 1 · 17. 11. 2026
>
> Verze 2 · 17. 11. 2026: dořešené položky ze seznamu Zbývá.

## Jak se kontrolovalo

- Rozlišení: 320 × 568 (malý telefon), 375 × 812 (telefon), 812 × 375 (telefon na šířku),
  768 × 1024 (tablet), 1366 × 768 (školní notebook), 1920 × 1080.
- Obrazovky: úvod, mapa, Kodex, Nastavení, Shrnutí patra, výsledek komnaty a komnaty všech
  archetypů (Oltář, Nápis, Kaskáda, Příliv, Brána, Deska zákona, Maska, Dílna).
- Automatická kontrola v prohlížeči hledala:
  - prvky přetékající z obrazovky;
  - text menší než 10,5 px po zmenšení desky;
  - useknutý text a ovládací prvky menší než 30 px.

  Výsledky jsem ověřil snímky obrazovky.
- Pokrytí znaků se ověřilo skriptem nad tabulkami cmap všech písem (fontTools).

## Písma

| Role | Dřív | Teď | Proč |
|---|---|---|---|
| Nadpisy, popisky | Cinzel 700 | Cinzel 700 | Kapitálky vytesané do kamene, sedí k příběhu. Česká diakritika v pořádku. |
| Text, tlačítka | Atkinson Hyperlegible | **Atkinson Hyperlegible Next** | Udržovaný nástupce (2025) od Braille Institute: řezy 200 až 800, víc jazyků, stejné míry, takže se nic nepřelomí. |
| Číslice, vzorce | JetBrains Mono | **Atkinson Hyperlegible Mono** | Stejná rodina jako text a výrazně odlišené 0/O/o a 1/l/I, což je ve hře o bitech podstatné. Je asi o 5 % širší. |
| Citáty | Cormorant Garamond kurzíva | beze změny | Hlas Lumenitů a Echa. |
| Logické znaky | žádné (kreslil je systém) | **Svetlo Logika** (výřez z Noto Sans Math) | ∧ ∨ ⊻ ⇔ ⇒ → ← ↔ ≈ ≠ ≤ ≥ ⊕ Σ ● ○ ✓ za 4,2 KB. |

- Všechna písma jsou pod SIL Open Font License 1.1 bez vyhrazeného jména. Stahují se z npm jako
  balíčky `@fontsource/…` a Vite je přibalí do hry, takže žádný server písem není potřeba.
- Výřez Svetlo Logika je v `src/assets/fonts/` i s licencí. Vzniká skriptem
  `scripts/subset-logika.py` a jako upravená verze má vlastní jméno, jak OFL doporučuje.
- Dřív logické znaky (asi 80 výskytů v kvízech, Kodexu a Shrnutí) kreslilo náhodné písmo systému.
  Na Windows Cambria Math, na Androidu Noto, na některých Chromebookech ⊻ chybělo úplně.
- Indexy (10₂) a šipky ve vzorcích dál sází `Rich.svelte` stejným písmem jako okolní text.

## Co sazeč našel a co je opravené

### Rozložení

| Nález | Kde | Oprava |
|---|---|---|
| Tlačítko Nápověda přetéká z obrazovky | trám komnaty, 320 px | Zpět a Znovu jen jako ikony do 420 px (popisek zůstává pro čtečku). |
| Název komnaty useknutý na „V…“ | hlavička komnaty, telefon | Na úzkém displeji se zalomí do dvou řádků. Ikona zvuku je do 420 px jen v Nastavení. |
| Tlačítko Kodex mimo obrazovku, záložky pater useknuté | mapa, 320 px | Do 420 px bez názvu Observatoře, záložky pater jen římskou číslicí. |
| Statistika patra začíná řádek oddělovačem „·“ | mapa, telefon | Na úzkém displeji jsou údaje pod sebou bez oddělovačů. |
| Echo zakryje skoro celou desku | telefon na šířku | Na nízké obrazovce Echo neplave nad trámem. |
| Písmo součástek 4 až 9,5 px, krystaly 18 px | Dílna, všude | Deska se nezmenší pod 70 % (Brána pod 72 %) a na úzkém displeji jde posouvat do strany s výzvou pod deskou. Název součástky má 11,5 px, kolíky 13 px a součástky jsou širší, aby se názvy nedotkly kolíků. |
| Krystaly vstupů A a B v řetězu sčítaček se překrývají o 2 px | Dílna IV-3, IV-7 | Vstup má 46 px. Nový test hlídá, že se prvky žádného stroje nepřekrývají. |
| Políčka desky zákona 26 px | Deska zákona, telefon | Menší políčka jen pro myš, na dotyk zůstávají 30 px. |
| Názvy run na desce Brány 8,6 px | Brána, telefon | 13 px. |
| Vzorec přetéká o 11 px | Shrnutí patra, 320 px | Viz zalomení výrazů níže. |

### Telefon na šířku a doporučení otočit telefon

Měřeno na 844 × 390 a 667 × 375. Desky Dílny jsou všechny na šířku (456 až 816 ×
184 až 566 px). Na výšku se při šířce 375 px bez posouvání vejdou jen dvě z 35, na šířku skoro
všechny. Hádanky Aktů I a II (Oltář, Nápis, Kaskáda, Příliv) jsou naopak skládané pod sebe:
na výšku se vejdou celé, na šířku zaberou dvě obrazovky.

- **Na šířku (nízká obrazovka):**
  - hlavička i trám jsou tenčí;
  - Echo neplave nad deskou;
  - při vstupu do komnaty a po otočení telefonu se stránka sama posune tak, aby hádanka začínala
    nahoře;
  - Dílna, Brána a Deska zákona mají panel s cíli, deskou zákona a Zkouškou vedle desky. Když je
    panel delší, roluje uvnitř;
  - v Dílně se zadání, čísla pod deskou a tlačítko Tep přesunou do bočního panelu a deska se smí
    zmenšit až na 60 %, aby byla vidět celá;
  - Maska má i na šířku osm stejných sloupců.
- **Doporučení otočit telefon:**
  - Dílna na výšku: když se deska nevejde, je pod ní ikona a rada „Otoč telefon na šířku, nebo desku
    posouvej do strany“;
  - Oltář, Nápis, Kaskáda a Příliv na šířku: když se hádanka nevejde, ukáže se nahoře na 7 s rada
    „Tahle hádanka se celá vejde na výšku. Otoč telefon.“ (ťuknutím zmizí).
- **Výsledek na 844 × 390:** u všech komnat Dílny je celá deska nad trámem vidět najednou, stejně
  jako u Brány, Desky zákona a Masky.
- **Malé telefony (667 × 375):** největší desky Dílny potřebují krátké posunutí a v III-14 stojí
  starý a nový obvod pod sebou.

### Česká sazba

- **Jednopísmenné předložky a spojky** (v, s, z, k, o, u, a, i) nezůstanou na konci řádku.
- **Číslo se neodtrhne od slova** (8 krystalů, 2. krok).
- **Znaménko a šipka zůstanou u levého operandu**, takže výraz se smí zlomit jen za nimi, jako
  v matematické sazbě (1 + 1 = 10, 0 → 1).

Všechno řeší funkce `typoCz` v `src/game/text.ts`. Pozorovatel v `main.ts` ji použije na každý text,
který se ve hře objeví, i na repliky Echa vypisované po písmenech. Mezery se jen vymění za
nezlomitelné, délka textu zůstává.

Další úpravy:
- Nadpisy se lámou vyváženě (`text-wrap: balance`).
- Odstavce nekončí osamoceným slovem (`text-wrap: pretty`), kde to prohlížeč umí.
- Indexy mají nejméně 10 px, dřív 9 px ve Shrnutí patra.
- Kód komnaty v nadpisu má nejméně 12 px.

## Dořešeno ve verzi 2

- **Deska Dílny na telefonu na výšku:** pod 80 % měřítka ukazují součástky zkratky (PS, ÚS, VÝH,
  ROZ, OZV) písmem 18 px, po zmenšení kolem 12,5 px. Pod deskou je legenda jen těch součástek, které
  na desce jsou. Celé jméno zůstává pro čtečku.
- **Kodex na desktopu:** panel má 600 px, řádek textu kolem 58 znaků.
- **Pečeť přesnosti** počítá všude „kroky“, i v přehledu třídy („Ø kroků nad ideál“).
- **Popisky vstupů v Dílně:** váha je index u písmene (A₂). Test v `layout.test.ts` hlídá i popisky
  vstupů a lamp, nejen krystaly a kameny.
- **Deska zákona:** číslo řádku v tlumené barvě textu, ne v barvě kamene (bylo skoro nečitelné).
- **Zmenšená deska Dílny a Brány:** pod runou jen její jméno, moderní značka (· XOR) se schová.

## Zbývá

- **Dělení slov** (`hyphens: auto`) jsem záměrně nezapnul. Atkinson Hyperlegible je písmo pro čtenáře
  se zrakovými a čtenářskými potížemi a dělení jim čtení zhoršuje.
