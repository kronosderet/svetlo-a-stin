# Playtest: tři modeloví žáci

> Simulovaný průchod Akty I–III (45 komnat) očima tří žáků sexty, model jejich paměti
> a návrhy úprav komnat, pořadí a přechodů. Verze 1 · 15. 11. 2026

---

## 0. Jak jsem hrál

- Přečetl jsem zadání, repliky, nápovědy, kvízy a Kodex všech 45 komnat. Klíčové komnaty jsem si
  zahrál v prohlížeči (I-1, I-4, I-6, II-3, II-6, III-2, III-11), abych viděl totéž co žák:
  co je na desce, co se schová, co hláska chyby opravdu řekne.
- Každý žák začíná bez znalosti dvojkové soustavy. Za každého jsem si vedl **model paměti**:
  co ví a jak pevně, jaké má mylné představy, jakou používá strategii a v jaké je náladě.
  Model se mění jen tím, co hra opravdu ukáže nebo nechá zažít. Co žák přeskočí (repliky Echa,
  Kodex, Zápisník), do modelu nepřidávám.
- Síla pojmu: ○○○ nezná · ●○○ viděl, neumí · ●●○ umí s oporou (váhy, živý součet, počty pod
  sloupci, nápověda) · ●●● umí sám a přenese ho do nové situace.
- Je to simulace, ne měření. Časy a předpovědi jsou hypotézy, které jde ověřit přehledem třídy
  (kap. 7).

---

## 1. Tři žáci

### Ema: nadaná na matiku a logiku
- Vzory vidí dřív, než je hra pojmenuje. Repliky čte zběžně, Zápisník a vzorce ráda.
- Motivuje ji pečeť přesnosti, ideální počet tahů a otázka „proč to funguje“.
- Výrokovou logiku zná z kvinty.
- Riziko: nuda v prvních komnatách a pocit „tohle je pro malé“. Nejzajímavější komnaty jsou až za bránou.

### Vojta: chytrý, ale matika ho nebaví
- Čte všechno: Echo, Kodex, lore. Baví ho příběh, jazyk a metafora překladu z lumenitštiny.
- Počítá zkoušením, ne postupem. Zápis s indexy mu připomíná písemku, tak ho přelétne.
- Riziko: dril ho unaví (dlouhé kaskády). Chybuje z nepozornosti, třeba čte nápis zrcadlově.

### Nikola: matika je úplně nepřístupná
- Má matematickou úzkost a malou pracovní paměť na čísla. Sečíst zpaměti víc než dvě čísla je práce.
- Text skoro nečte: Echo zavírá křížkem, Kodex neotevře. Kliká, dokud se něco nestane.
- O nápovědu si řekne rychle a použije ji naplno.
- Riziko: komnatou projde, ale nic nepochopí. Pečeť odvahy chybí, postup jde dál.

---

## 2. Průchod základní cestou (21 komnat)

### Akt I: Předsíň Prvního Světla

| Komnata | Ema | Vojta | Nikola |
|---|---|---|---|
| **I-1 Probuzení** | Pět sekund. Zapamatuje si slovo *bit*. | Zaujmou ho nečitelné glyfy v řeči Echa a čeká, že je časem přečte. Ty se ale už nikde neobjeví. | Klik a světlo, příjemný začátek. |
| **I-2 Dvě světla** | Čtyři vzory napoprvé. | Z Kodexu si odnese, že rozsvícený a zhasnutý krystal se píše „10“. | Porovnávání obrázků zvládá. První úspěch. |
| **I-3 Kolik kombinací?** | Projde tichým krokem: 7 doteků, pečeť, a k tomu jméno Grayův kód. Kvíz: hned 2ⁿ. | Najde osm kombinací. V kvízu tipne 12 („přibývají čtyři“), po nápovědě 16. | Kliká náhodně a pořád slyší „Tuhle kombinaci už deska zná“. Kvíz vyřeší vylučováním, zdvojení si neodnese. |
| **I-4 Váhy kamenů** | Krystaly rozsvítí po jednom: 4, 2, 1. U dvou svítících ji zarazí „?“, přestože váhu jde dopočítat ze součtu. | Rozsvítí dva naráz a vidí „?“. Echo mu poradí zkoušet po jednom. | Hraje „přihořívá“ podle živého součtu a hlášky „o 1 víc“. Funguje to i bez znalosti vah. |
| **I-5 Čtyři váhy** | Osmičku odhadne předem. Pět cílů je na ni moc. | Hladový postup objeví zkoušením. | Zase přihořívá. 16 kombinací se dá proklikat. |
| **I-6 Čtení nápisů** | Čte okamžitě. | Krystaly jsou stejně velké a váhy zmizely. Pamatuje si řadu „1, 2, 4, 8“, jak ji píše nápověda, a přiloží ji **zleva**. 0101 vyjde náhodou (nápis je souměrný), u 1100 zadá 3. Srovnání ukáže zrcadlový obraz, ale Echo řekne jen „Porovnej obě kombinace“. | Zmizela jediná opora: „velký krystal = velké číslo“. U 0101 spočítá svítící krystaly a zadá 2. Ze srovnání dvou řad krystalů nic nevyčte. U každého z pěti nápisů třikrát Nápověda, krystaly ukážou váhy, Nikola je sečte. Komnata hotová, váhy v hlavě nezůstaly. |
| **I-7 Brána Předsíně** | Bez chyby. | Při zápisu bez živého součtu se jednou splete. | Bez součtu nejde hrát přihořívá. Ukázka kroku rozsvítí krystal, Nikola ho přepne, ukázka rozsvítí další… Bránou patra projde **autopilotem**. |

**Model paměti po Aktu I**

| Pojem | Ema | Vojta | Nikola |
|---|---|---|---|
| Bit, světlo = 1, stín = 0 | ●●● | ●●● | ●●○ |
| n krystalů má 2ⁿ kombinací | ●●● | ●●○ | ●○○ |
| Váhy 8-4-2-1, těžký krystal vlevo | ●●● | ●●○ (občas zrcadlí) | ●○○ (jen když je vidí) |
| Zápis čísla, hladově | ●●● | ●●○ | ●○○ (přihořívá, bez součtu nic) |
| Čtení čísla, součet vah | ●●● | ●●○ | ●●○ (s ukázkou kroku) |

- Mylné představy:
  - Vojta: řada vah 1, 2, 4, 8 jde zleva (zrcadlo).
  - Nikola: víc svítících krystalů znamená větší číslo (počítá světla). Opora „velký krystal je těžký“ v I-6 zmizí.
- Strategie:
  - Ema: dedukce.
  - Vojta: zkoušení a Echo.
  - Nikola: živý součet, potom ukázka kroku.
- Nálada: Ema 6/10 (rychlé, trochu dětské), Vojta 8/10 (příběh), Nikola 5/10 (v I-6 šok, ale prošlo to).
- Čas: Ema 10 min, Vojta 20 min, Nikola 40 min. Do vyučovací hodiny se vejde i Nikola, jen tak tak.

### Akt II: Síň Počtářů

| Komnata | Ema | Vojta | Nikola |
|---|---|---|---|
| **II-1 Soutok** | Okamžitě. | Metafora vody sedí. „Lumenité to psali jako 10“ přečte jako *deset* a chvíli se v tom motá, než v Kodexu uvidí 10₂. | Pod sloupcem svítí „2“, pod krystaly výsledku váhy 2 a 1. Spáruje dvojku s dvojkou a funguje to. Jenže „1 + 1 = 10“ slyší jako *deset*: „tady matika neplatí“. |
| **II-2 Dvě řady** | Čtyři opisy světel dolů. Nuda. | V pohodě. | Úspěch, sebevědomí roste. |
| **II-3 Krystaly přenosu** | Hladce. | Zapomene na přenos. Sloupec se otřese a Echo řekne proč. Tahle zpětná vazba funguje výborně. | Pravidlo z nápovědy („dvě světla: dole stín a přenos“) aplikuje, dokud vidí živé počty pod sloupci. Jednou dvakrát ukázka kroku. |
| **II-4 Velká kaskáda** | Hladce. | Tři úlohy po šesti sloupcích, chyby z nepozornosti, otrava. | Počty pod sloupci zmizí ve stejné chvíli, kdy se řady prodlouží ze čtyř krystalů na šest. Světla ve sloupci počítá bez pomoci a ztrácí přehled. Zbytek dovede ukázka kroku (první špatná buňka). |
| **II-5 Přetékající nádoba** | Přetečení ji baví, pozná v něm přetečení proměnné. | Kvíz: „Oktáva (bajt) drží 255.“ Oktávu na základní cestě nepotkal (je až v I-10) a číslo přes 15 taky ne. | Hra najednou „tvrdí“, že 12 + 6 = 2. Vysvětlení je v Echu, které Nikola zavírá. |
| **II-6 Příliv a odliv** | Okamžitě ×2 a ÷2. | Páky ho baví. | Nejlepší komnata Aktu II: páka a živá váha. Odnese si „vlevo víc, vpravo míň“. |
| **II-7 Brána Síně** | Hladce. | Dlouhé, ale zvládne. | Únava. Kaskády autopilotem, páky zkoušením. |

**Model paměti po Aktu II**

| Pojem | Ema | Vojta | Nikola |
|---|---|---|---|
| 1 + 1 = 10, zákon sloupce | ●●● | ●●○ | ●●○ (pravidlo, dokud vidí počty) |
| Řetěz přenosů | ●●● | ●●○ | ●○○ |
| Přetečení nádoby | ●●● | ●●○ | ●○○ („divné pravidlo“) |
| Posun = ×2 / ÷2 | ●●● | ●●● | ●●○ |
| *Váhy a čtení z Aktu I* | ●●● | ●●○ | ●○○ a slábne: v Aktu II je nikdo nechce |

- Mylné představy:
  - Nikola: „10“ je deset; přepad nádoby je chyba hráče.
- Nálada:
  - Ema 7/10.
  - Vojta 6/10 (kaskády jsou dril).
  - Nikola 4/10 při kaskádách, 6/10 u pák.
- Čas: Ema 15 min, Vojta 30 min, Nikola 55 min.

### Akt III: Zahrada Bran

| Komnata | Ema | Vojta | Nikola |
|---|---|---|---|
| **III-1 Obraceč** | Hladce. | Všimne si, že *brána* teď znamená tři věci: komnatu (Brána Předsíně), runu (logické hradlo) a cílový panel („Brána žádá“, „Brána vpravo říká“). | Zmatek: „Která brána?“ |
| **III-2 Pouto** | Zná ∧ z matematiky, triviální. | „Prší a fouká“, sedí to. | Zkoumání je klikání a deska objevů se plní. „Lampa svítila jen jednou“ si udrží a desku vyplní. Dobrá komnata. |
| **III-3 Rozcestí** | Stejný formát podruhé. | „Do kina, nebo do divadla“ (nevylučovací nebo) ho potěší. | Opakování pomáhá. |
| **III-4 Jen jeden** | Potřetí stejný formát, nudí se. | Odkaz na Soutok je pro něj aha. | Postup už zná. |
| **III-5 Které pravidlo?** | Triviální. | V pohodě. | Runu pozná vylučováním ze tří, desku vyplní zpaměti. |
| **III-6 Řetězy** | Baví ji. | Po nápovědě 2 („runa s obrácenou deskou a za ni Obraceč“) to jde. | Dva kameny, několik run, střídá je naslepo. Ukázka kroku řekne jen *který* kámen, ne jakou runu. Větvení (¬A ∧ B) je první obvod se dvěma cestami a zkoumat ho předtím nebylo kde. **Vrchol frustrace.** |
| **III-7 Brána Zahrady** | Hladce. | Zvládne. | Desku složeného obvodu má vyplnit v duchu, runu po runě. Ukázka kroku označuje špatné buňky a Nikola je přepíná. |

**Model paměti po Aktu III**

| Pojem | Ema | Vojta | Nikola |
|---|---|---|---|
| Obraceč, Pouto, Rozcestí, Výluka | ●●● | ●●● | ●●○ |
| Deska zákona (číst, vyplnit) | ●●● | ●●● | ●●○ |
| Skládání run, NAND, NOR | ●●● | ●●○ | ●○○ |
| *Váhy a čtení z Aktu I* | ●●● | ●○○ | ○○○ |

- Nálada:
  - Ema 7/10.
  - Vojta 9/10: logika je pro něj jazyk.
  - Nikola 7/10 v III-1 až III-5, 4/10 v III-6.
- Čas: Ema 12 min, Vojta 25 min, Nikola 45 min.
- **Překvapení simulace:** Zahrada je pro Nikolu nejpřístupnější patro. Nejsou v ní čísla, jen lampa,
  která svítí, nebo ne. Naopak čtení čísel z Aktu I od Aktu II nic nevyžaduje a do konce základní
  cesty ho Vojta i Nikola zapomenou. Hlubina Strojů a Archiv Hlasů (sčítačky, ASCII) ho přitom
  budou potřebovat.

---

## 3. Hlubší síně (Ema celé, Vojta zčásti)

| Komnata | Postřeh |
|---|---|
| I-8 Skryté váhy | Ema: snadné, dobrý most k 16. |
| I-9 Počítadlo poutníků | Nejkonkrétnější komnata hry: čárky poutníků a +1. Ema si všimne, že *předání* tady je *přenos* v II-3, tedy dvě jména pro jednu věc. Na základní cestě ale komnata chybí, a přitom je to přesně most k Síni Počtářů. |
| I-10 Nejvyšší světlo | Ema: aha 2ⁿ − 1. |
| I-11 Tichý krok | Ema: nejlepší hlavolam Předsíně. Vojta: tři restarty, zachrání ho nápověda se zrcadlem. |
| I-12 Velký nápis | Ema: 201 = 128 + 64 + 8 + 1, pětkrát dokola. Je to početní dril, nic nového nepřináší. Vojta tady končí. |
| I-13 Řeč glyfů | Vrchol pro Vojtu: glyfy na dveřích konečně čte. Jenže je to 13. komnata patra a nepovinná, většina „Vojtů“ se k ní nedostane. Pravidlo „po směru hodin od horní strany 8, 4, 2, 1“ je jen konvence, kterou si musí zapamatovat. |
| I-14 Dvojznak | Ema: barva #FF8800 je spojení se skutečností, které ji baví. |
| II-8 Odliv | Nejsložitější ovládání ve hře: výpůjčka se zapisuje pod spodní řadu ve sloupci vlevo a nad sloupcem vpravo se objeví dva krystaly. Nápověda 2 má tři věty. I Ema potřebuje dva pokusy, než pochopí, kam klikat. |
| II-9 Zdvojení | Nejsilnější aha celé hry: posloupnost pák je dvojkový zápis cíle. |
| II-10 Násobení, II-11 Dělení, II-12 Tři řady | Dobré, každá s jasnou pointou. |
| II-13 Doplněk | Zadání dá recept dřív, než je co objevit: „Převrať všechna světla a přidej jednu.“ Ema se ptá proč. Odpověď přijde až v Echu po prvním kroku. |
| II-14 Váhy Osudu | Ema: radost z přesnosti. |
| III-8 Zrcadla | Dobrý aha moment (De Morgan). |
| III-10 Hlas většiny | Nápověda odkazuje na Tichý krok z Předsíně. Kdo šel jen základní cestou, ten ho nezná. |
| III-11 Prapečeť | Točité kamínky jsou malé a nenápadné, Ema je najde až po nápovědě 1. |
| III-13 Tajná řeč | „E, C, H, O. To jsem já.“ Emočně nejsilnější chvíle hry, schovaná v nepovinné 13. komnatě třetího patra. |

Ema projde všechno zhruba za 37 minut základu a dvě a půl hodiny Hlubších síní. Nejvíc ji
zabaví II-9, I-11, II-14 a III-13. Všechny jsou za branou.

---

## 4. Co z toho plyne

Seřazeno podle dopadu na učení.

### 4.1 Ukázka kroku je autopilot
- Zvýraznění 3. stupně se po každém tahu přepočítá a ukáže další krok. Vypne se až s další úlohou.
  Nikola tak projde I-7, II-7 i III-7 bez vlastního přemýšlení. Brána patra má být syntéza,
  pro Nikolu ale není.
- Hra to zaznamená (pečeť odvahy, přehled třídy) a učitel to uvidí. Žák se tím ale nic nenaučí.
- **Ukázka kroku s důvodem:** vedle zvýraznění jedna věta, proč právě tenhle krok. Třeba:
  - „Žádáno 13. Osmička se vejde, zbývá 5.“
  - „Ve sloupci jsou tři světla: dole 1, jedno přeteče.“
  - „V řádku 1 1 má lampa mlčet, Pouto by svítilo.“

  Ze slepého klikání se tak stane ukázkový příklad.
- **Úloha navíc v branách:** když hráč v bráně (7 a 15) použije ukázku kroku, přibude na konec
  jedna podobná losovaná úloha. Bez trestu, jen jeden důkaz, že to jde i samo. Generátory
  pro to už existují.

### 4.2 I-6: tři změny najednou
- V jediné komnatě se mění směr (čtení místo zápisu) i ovládání (kotouče). K tomu zmizí obě opory:
  velikost krystalů i váhy. Pilíř „jeden nový nápad na level“ tu neplatí.
- Nikola přijde o jedinou kotvu, kterou má. Vojta začne zrcadlit, protože velikost už neukazuje,
  kde je těžký krystal.
- **Mizení uvnitř komnaty:**
  - úlohy 1–2: váhy pod krystaly a různé velikosti;
  - úloha 3: jen velikosti;
  - úlohy 4–5: holé krystaly.

  Stačí volitelný přepis prezentace u jednotlivé úlohy.
- Totéž v II-4: počty pod sloupci ať zmizí až po první úloze, ne současně s delší řadou.

### 4.3 Obecná hláska tam, kde má chyba jméno
- Nápis odpoví na každou chybu „Porovnej obě kombinace“. Typické chyby přitom jde poznat
  z čísla, které hráč zadal:
  - **zrcadlo:** zadané číslo je nápis čtený pozpátku → „Čteš zrcadlově. Nejtěžší krystal stojí vlevo.“
  - **počet světel:** zadané číslo je počet svítících krystalů → „Tohle je počet světel. Každé ale váží jinak.“
  - **jedna váha vedle:** rozdíl je mocnina dvou → „Liší se jediný krystal: ten s váhou 4.“
- Kaskáda už to dělá dobře (první špatný sloupec a proč). Stejnou kvalitu si zaslouží Nápis i Oltář.

### 4.4 Pravidla, která žijí jen v Echu
- Některá pravidla hra řekne jen v Echu:
  - váha se odhalí jen u jediného rozsvíceného krystalu (I-4);
  - kam patří krystaly přenosu (II-3);
  - proč 12 + 6 dá 2 (II-5);
  - že 10 se nečte jako deset.

  Nikola Echo zavírá.
- **Echo se ozve samo:** po dvou chybných potvrzeních v jedné úloze nebo po zhruba 40 sekundách bez
  pokroku nabídne náznak 1. stupně (nic nestojí). Talentovaný hráč si toho nevšimne, slabší
  nemusí umět o pomoc požádat.
- **Pravidla patří na desku:** pod „?“ krátký popisek „rozsviť ho samotný“, u přepadu „víc než 15
  se nevejde“.
- **Deset, nebo jedna-nula:** v II-1 věta „Čti jedna-nula, ne deset.“ a v Zápisníku vždy 10₂.

### 4.5 Základní cesta vynechává předání a slovník se rozjíždí
- Počítadlo poutníků (I-9) je nejnázornější +1 a přenos ve hře, a je nepovinné. Síň Počtářů
  pak přenos zavádí znovu a jinak.
- Stejnou věc hra jmenuje třemi slovy: *předání* (I-9), *přenos* (II-3) a *přetečení* (II-1, II-5).
- *Brána* v Zahradě označuje i cílový panel („Brána žádá“, „podle brány“). Při bližším pohledu je to
  pořád tentýž mechanismus dveří, který něco žádá, jen první zadání neříkalo, kde ho hledat.
- Základní cesta místy staví na Hlubších síních:
  - kvíz II-5 počítá s oktávou a číslem 255 (I-10);
  - nápověda III-10 počítá s Tichým krokem (I-11).
- Řešení: přesun Počítadla do Aktu II (kap. 5) a jednotný slovník. Jedno lumenitské slovo
  pro přenos, cílový panel v Zahradě pojmenovat „Lampa má svítit“ nebo „Zákon brány“.

### 4.6 Bez opakování mezi patry se Akt I vypaří
- Po I-7 základní cesta už nechce číst ani psát čísla: Síň Počtářů ukazuje hodnoty sama
  a v Zahradě čísla nejsou. Na konci Aktu III to Vojta umí napůl a Nikola vůbec.
- **Schody mezi patry:** při vstupu do nového patra karta patra (jméno, věta lore, co čeká)
  a „Strážce schodů“, tedy tři rychlé otázky ze zákonů minulého patra. Bez pečetí, jde přeskočit
  a stačí na ně generátory kvízů, které už existují.
- Staré pojmy vplést do nových komnat: třeba řádky desky zákona popsat i jako dvojková
  čísla 0–3 („řádek 10 = 2“).

### 4.7 Nadaná žákyně se v základu nudí a k hloubce se dostane pozdě
- Ema stráví 37 minut základní cesty s výzvou zhruba na třetině. Nejlepší komnaty jsou za branou.
- **Zkusit bránu hned:** kdo vyřeší komnaty 1–3 patra v ideálu a bez nápověd, tomu mapa nabídne
  rovnou bránu. Když ji projde, patro je otevřené a komnaty 4–6 může dohrát později
  kvůli pečetím. Je to i první krok ke Zkoušce zasvěcení z PLAN 3.8.
- **„Desku znám“** v III-2 až III-4: zkoumání jde přeskočit, když hráč desku zákona vyplní
  napoprvé. Ema zná logiku z matematiky a slabším hráčům to neublíží.
- Po bráně dvě rovnocenná tlačítka: *Další patro* a *Do Hlubších síní*. Teď vede ke Hlubším
  síním jen věta s odkazem na mapu.

### 4.8 Příběhová nit se zatáhne a nepokračuje
- Nečitelná slova v řeči Echa jsou jen v I-1, přestože PLAN 2.2 slibuje, že se jeho řeč postupně
  opravuje. Tajemství glyfů na dveřích se vyřeší až v nepovinné I-13 a Echovo jméno v nepovinné
  III-13. Mezi patry chybí přechod.
- Návrhy:
  - nečitelná slova v dalších replikách, která se rozsvítí s překladem v Kodexu (`{{slovo|kodex}}`);
  - v základní cestě jedna zmínka o glyfech na dveřích, která navnadí na I-13;
  - karta patra na schodech.

  Kvůli příběhu hraje hlavně Vojta.

### 4.9 Místy výklad dřív než objev
- **II-13 Doplněk:** obrátit pořadí. Napřed nádoba s přepadem a otázka: „Které číslo přičtené
  ke 3 nádobu vyprázdní?“ Hráč najde 1101. Teprve pak páky převrať a +1 jako zkratka.
- **I-3:** zdvojení hra jen řekne. Po dokončení by se deska měla rozdělit na dvě čtveřice podle
  levého krystalu: „čtyři kombinace dvou krystalů, jednou se stínem, jednou se světlem“.
- **III-6:** před osazováním větvení jedna úloha, ve které hráč hotové větvení jen zkoumá.
  Ukázka kroku má ukázat i runu, ne jen kámen.
- **I-4:** váhu odhalit i dopočtem („6 − 2 = 4, kámen to dopočítal“). Emu to odmění
  za dedukci a Nikolu naučí, jak se uvažuje.

### 4.10 Kvíz jde projít vylučováním
- Špatná možnost zešedne a nápověda je pro všechny špatné odpovědi společná. Nikola kliká,
  dokud netrefí.
- Lehká úprava: u losovaných otázek vysvětlit každou typickou chybnou odpověď zvlášť,
  třeba „12 by platilo, kdyby kombinací přibývalo stejně, ale každý krystal je zdvojí“.
  Má nižší prioritu.

---

## 5. Návrh uspořádání

### Akt I

| # | Teď | Návrh |
|---|---|---|
| 1 | Probuzení | beze změny, nečitelná slova pokračují v dalších replikách |
| 2 | Dvě světla | beze změny |
| 3 | Kolik kombinací? | deska se po dokončení rozdělí na dvě poloviny podle levého krystalu |
| 4 | Váhy kamenů | váhu jde odhalit i dopočtem, pod „?“ popisek |
| 5 | Čtyři váhy | 4 cíle místo 5, Echo zmíní glyfy na dveřích |
| 6 | Čtení nápisů | váhy mizí uvnitř komnaty, cílené hlášky chyb |
| 7 | Brána Předsíně | po ukázce kroku úloha navíc, tlačítko Do Hlubších síní |
| 8 | Skryté váhy | beze změny |
| 9 | Počítadlo poutníků | **přesun do II-1.** Místo něj nová komnata **Sudé a liché**: rozděl nápisy na sudé a liché, pak na dělitelné čtyřmi. Aha: rozhoduje pravý krystal, pak nuly vpravo. Připraví posun a dělení. |
| 10–11 | Nejvyšší světlo, Tichý krok | beze změny |
| 12 | Velký nápis | 4 úlohy místo 5 |
| 13–15 | Řeč glyfů, Dvojznak, Velká brána | beze změny |

### Akt II

| # | Teď | Návrh |
|---|---|---|
| 1 | Soutok | **Počítadlo poutníků** (z I-9). Předání a přenos sloučit pod jedno slovo. |
| 2 | Dvě řady | **Soutok sloučený s Dvěma řadami**: 1 + 0, 1 + 1, 1 + 1 + 1, pak dva součty dvou řad bez přenosu |
| 3 | Krystaly přenosu | beze změny |
| 4 | Velká kaskáda | počty pod sloupci zmizí až po první úloze |
| 5 | Přetékající nádoba | kvíz o bajtu bez oktávy, nebo s vysvětlením |
| 6 | Příliv a odliv | beze změny |
| 7 | Brána Síně | úloha navíc po ukázce kroku |
| 8 | Odliv | první úloha ukázková: výpůjčka je předem na místě a Echo ji okomentuje |
| 13 | Doplněk | obrátit pořadí: objev v nádobě, potom páka |
| 9–12, 14–15 | | beze změny |

### Akt III

| # | Teď | Návrh |
|---|---|---|
| 1 | Obraceč | cílový panel přejmenovat: „Lampa má svítit“ |
| 2–4 | Pouto, Rozcestí, Jen jeden | „Desku znám“: zkoumání jde přeskočit, když hráč desku vyplní napoprvé |
| 5 | Které pravidlo? | beze změny |
| 6 | Řetězy | zkoumání hotového větvení před osazováním, ukázka kroku ukáže i runu |
| 7 | Brána Zahrady | úloha navíc po ukázce kroku |
| 10 | Hlas většiny | nápověda bez odkazu na Tichý krok |
| 11 | Prapečeť | větší točité kamínky, při prvním vstupu krátce zapulzují |
| 8–9, 12–15 | | beze změny |

### Přechody

1. **Schody mezi patry:** karta patra a Strážce schodů (tři otázky z minulého patra, bez pečetí, přeskočitelné).
2. **Po bráně dvě cesty:** *Další patro* i *Do Hlubších síní* jako rovnocenná tlačítka.
3. **Zkusit bránu hned** pro hráče, kteří první tři komnaty patra vyřeší v ideálu bez nápověd.
4. **Echo se ozve samo,** když hráč uvízne. Je to přechod uvnitř komnaty, ne mezi nimi,
   ale pro slabší hráče je nejdůležitější.

Přesuny komnat mění jejich čísla. Uložený postup pak potřebuje převod, stejně jako při dělení
pater (`LAYOUT` v `src/game/migrate.ts`).

---

## 6. Priority

| Úprava | Komu pomůže | Práce | Dopad | Kde v kódu |
|---|---|---|---|---|
| Ukázka kroku s důvodem | Nikola, Vojta | střední (každý archetyp zvlášť) | vysoký | vedle `hintBit` / `firstWrong` / `bestOp` čistá funkce `hintReason` v `src/core/puzzles/*` |
| Cílené hlášky chyb u Nápisu a Oltáře | Vojta, Nikola | malá | vysoký | `confirm` v `inscription.ts`, repliky v `inscriptionEvents.ts` |
| Mizení opor uvnitř I-6 a II-4 | Nikola | malá | vysoký | volitelná prezentace u úlohy (`InscriptionTask`, `CascadeTask`) |
| Úloha navíc v branách po ukázce kroku | Nikola, učitel | malá | vysoký | `baseGame` + generátory bran |
| Echo se ozve samo | Nikola | malá | střední | časovač v `Level.svelte` |
| Slovník: jedna-nula, přenos, brána | všichni | malá | střední | `act1.ts` až `act3.ts`, `kodex.ts` |
| Schody mezi patry s opakováním | Nikola, Vojta | střední | vysoký dlouhodobě | nová obrazovka, kvízové generátory |
| Počítadlo do II-1, Sudé a liché do I-9 | Nikola | větší (převod postupu) | střední | `act1.ts`, `act2.ts`, `migrate.ts` |
| Zkusit bránu hned, Desku znám | Ema | střední | střední | `progress.svelte.ts`, `MapScreen.svelte`, `gate.ts` |
| Příběhová nit | Vojta | malá | střední | `text.ts` (`{{slovo|kodex}}`), repliky |
| Objev před výkladem (II-13, I-3, III-6, I-4) | všichni | střední | střední | obsah komnat a `altar.ts` |
| Vysvětlení špatných odpovědí v kvízu | Nikola | střední | nižší | `quizzes.ts` |

Rychlé výhry na jedno odpoledne: cílené hlášky chyb, slovník, mizení opor v I-6,
úloha navíc v branách a Echo, které se ozve samo.

**Hotovo 15. 11. 2026 (rychlé výhry):**

- Nápis pozná zrcadlové čtení, počet světel, jediný krystal vedle a prohozené glyfy (`readSlip`).
- Opory mizí uvnitř komnaty: I-6 (váhy po dvou nápisech, velikosti po třech), II-4 (počty po prvním součtu).
- Brána po ukázce kroku přidá na konec části jednu podobnou losovanou zkoušku.
- Po dvou chybách v úloze se rozzáří Nápověda, po 45 s bez akce řekne Echo náznak samo.
- Slovník:
  - 10 se čte jedna-nula (II-1, Kodex);
  - předání = přenos (I-9);
  - kvíz II-5 bez oktávy, nápověda III-10 bez Tichého kroku;
  - zadání v Zahradě ukazují na bránu vpravo;
  - Echo už neříká „sám“.

---

## 7. Jak to ověřit se třídou

- **Předpověď simulace:** třída se nejvíc zasekne v I-6, I-7, II-4, II-7, III-6 a III-7.
  Přehled třídy by je měl zvýraznit (průměr ukázek kroku aspoň 1).
- **Po úpravách sledovat:**
  - ukázky kroku v I-6 a v branách;
  - chyby v kvízu II-1 a II-5;
  - podíl zaseknutých v III-6.
- **Krátký test bez hry na konci hodiny:** přečíst tři nápisy a jeden zapsat, na papír.
  Jako jediný rozliší, kdo bránou prošel autopilotem a kdo to umí. Je to zároveň zárodek
  Zkoušky zasvěcení (PLAN 3.8).
- **Pro „Nikoly“ hned teď:** vytištěné Shrnutí patra jako tahák na lavici nahradí Kodex,
  který neotevřou.
