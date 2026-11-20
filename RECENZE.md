# Recenze 0.4.2 alpha: didaktik, kurikulista a herní kritik

20. 11. 2026

Zpráva shrnuje, co tři recenzenti našli ve všech 64 komnatách Světla & Stínu, které chyby ověřovatel potvrdil v kódu a co opravit nejdřív. Podrobné recenze leží ve složce `recenze/` vedle tohoto souboru, v souborech `<recenzent>-<patro>.md` (např. `didaktik-II.md`, `kritik-IV.md`).

> **Stav oprav (verze 0.4.3 alpha):** ověřené nálezy z kapitol 2 a 2.1 jsou opravené. Vědomě zůstaly
> D-I-28 (mrtvé třetí nápovědy), část D-I-02 u oltáře I-10 a titulek IV-10 Registr (K-IV-19). Kapitoly 4 až 6
> jsou podklad pro další etapu oprav (PLAN.md, kap. 17).

## 0. Jak jsme hráli

**Tým.** Virtuální didaktik (D), kurikulista pro RVP G (K) a herní kritik (H). Každý prošel všechna čtyři patra komnatu po komnatě. Četl zadání, nápovědy, hlášky, repliky Echa, kvízy a Kodex. Úlohy hrál skriptem nad herní logikou (core/puzzles, content, *Words.ts) ve složce `sim/`. Chování obrazovek (.svelte) se dalo jen vyčíst z kódu.

**Čísla.**

| | Počet |
|---|---|
| Nálezy celkem | 310 (D 110, K 98, H 102) |
| Podle kategorie | chyba 59, text 81, didaktika 80, kurikulum 35, hratelnost 33, přístupnost 22 |
| Podle závažnosti (jak ji dali recenzenti) | vysoká 20, střední 107, nízká 183 |
| Ověřeno v kódu | 151 (všechny chyby, textové nálezy a vysoké závažnosti) |
| Potvrzeno | 87 |
| Částečně potvrzeno | 19 (část tvrzení neplatí nebo je přehnaná, často nižší závažnost) |
| Duplicity | 45 (tutéž věc našli dva nebo tři recenzenti; zpráva je slučuje) |
| Vyvráceno celé | žádný samostatný nález; všech 45 chybějících v seznamu ověřených se kryje s některým z 106 |
| Neověřené názorové nálezy | 159 (didaktika, kurikulum, hratelnost, přístupnost) |

Po ověření zůstalo 106 jedinečných nálezů: 9 vysokých, 19 středních a 78 nízkých. Skeptický ověřovatel u nich znovu otevřel kód, pustil vlastní skripty (`sim/overeni-*`) a u řady nálezů závažnost snížil.

**Co jsme nedělali.** Nehráli jsme v prohlížeči a nespouštěli dev server. Hru jsme nezkoušeli se žáky. Rozměry na telefonu jsou spočítané z CSS, ne změřené na přístroji. Znění výstupů RVP G jsme proti platnému textu neověřovali. Výkon jsme neměřili.

## 1. Celkový dojem

### Didaktik

Světlo & Stín je didakticky poctivá hra. Cyklus zažij, objev, pojmenuj drží ve všech patrech. Zachování světla v Kaskádě dělá z přenosu fyzikální zákon. Opory v I-6, II-2 a II-4 mizí uvnitř komnaty a Echo to ohlásí. Zrcadla v III-8 dají jméno De Morgan až po zážitku. Nejsilnější je zpětná vazba tam, kde existuje: pojmenuje mylnou představu nebo přesný řádek, ne jen „špatně“.

Slabiny nejsou v látce, ale v tom, co hra řekne žákovi, který si neví rady. Ukázka kroku na několika místech učí opak. Zpětná vazba je nesouměrná: čtení má vzornou diagnostiku, zápis v bráně I-7 nemá nic. Zkratka do brány přeskočí právě to, co brána zkouší. Repliky a vysvětlení jsou psané pro pevnou úlohu, zatímco úlohy se losují. Slovník zakládá mylné představy („odliv“, „přetečení“, doplněk se znaménkem i bez). Žádná z 39 pevných kvízových otázek nemá vysvětlení typické chyby. Skoro vše jde opravit v textu, podmínce generátoru nebo výběru tahu ukázky. Mechaniku je podle didaktika třeba měnit jen tam, kde není co rozhodnout (II-11, III-14).

### Kurikulista

Odborné jádro je pevné. Kurikulista přepočítal pravdivostní tabulky, vzorce Kodexu, klíče kvízů a řešitelnost staveb ve všech patrech. Chybnou tabulku ani chybný klíč nenašel. Základní cesty jdou v učebnicovém pořadí a mosty mezi patry jsou nejsilnější část hry.

Nejvíc chybí doklad o tom, co žák umí. Patro I se po I-3 už na nic nezeptá, pracovní list patra I má dvě otázky o 2ⁿ, list III nechce symbolický zápis ani tabulku a zkouška zasvěcení z PLAN 3.8 ve hře není. Druhá mezera je vztah PLAN 1.1 a základní cesty: šestnáctková soustava, bajt, odčítání, doplněk, De Morgan a paměť jsou jen v Hlubších síních a učitel to z plánu nevyčte. Třetí okruh je pravdivost toho, co hra říká, a Kodex, který se tiskne jako výklad a potřebuje odborná zpřesnění. Odhad času: základ pater I a III se vejde do hodiny, II těsně, IV spíš do dvou. Hlubší síně jsou další jedna až dvě hodiny na patro. Čtyři základní cesty tak zaberou čtyři až pět hodin, skoro celý odhad PLAN 1.3 (4–6 hodin), který počítá i s Aktem V a Finále.

### Herní kritik

Hra funguje jako soudržná logická hra. Každé patro má vlastní herní jazyk, ovládání je jednotné a smyčka komnaty drží tempo. Nejsilnější je tam, kde hráč stav zažije dřív, než ho Echo pojmenuje (I-3, I-4, Kaskáda, III-8, III-13, cíle s Echem v patře IV). Zpětná vazba po chybě je nadprůměrná a tón Echa sedí na 16–17 let.

Slabiny jsou systémové. Zkratka obchází komnaty 4–6, které zavádějí obsah brány. Ukázka kroku na okrajích radí špatně. Echo mluví o pevném světě, poslední repliky přepíše závěr komnaty a generátory obcházejí podmínky z PLAN. Hráč se čtečkou neslyší Echa a široké desky se na telefon nevejdou. Hlubší síně mají plnou cenu v patrech III a IV, v I a II ji ředí dril a komnaty bez rozhodnutí. Nejvíc chybí konec: hra po IV-7 ani po IV-15 nijak neskončí.

### Společný závěr

Všichni tři se shodují, že obsah a jeho pořadí na základních cestách jsou v pořádku. Problémy jsou v pomoci, kterou hra dává (ukázka kroku, hlášky, repliky), a v tom, jak se texty rozešly s generátory. Nejvyšší prioritu dávají všichni zkratce do brány a ukázce kroku. Dál se důrazy liší. Didaktik zdůrazňuje zpětnou vazbu, pořadí pojmů a slovník. Kurikulista doklad o zvládnutí, PLAN 1.1, RVP a Kodex. Kritik čtečku, telefon, generátory a konec hry. Většina oprav je v textu, v podmínce generátoru nebo ve výběru tahu ukázky. Změnu mechaniky navrhují jen pro několik komnat (I-3, II-11, II-13, III-14, IV-12).

## 2. Ověřené chyby

Seřazeno podle závažnosti po ověření. Patří sem všechny ověřené nálezy kromě textových (ty jsou v 2.1). Kde ověřovatel potvrdil jen část tvrzení, začíná popis slovem „Částečně“.

| Nález | Komnata | Chyba | Závažnost | Doklad | Oprava |
|---|---|---|---|---|---|
| D-I-02 | I-7 (i I-10, I-12–I-15) | Zápis nemá Potvrdit ani hlášku. Špatné nastavení nevyvolá událost, Nápověda se nerozzáří a nečinnost 45 s nuluje každý dotek. Zápis v bráně jde najít naslepo (medián 15 doteků). | vysoká | inscription.ts:72-80; Inscription.svelte:85-95; Level.svelte:106-142 | Při zrcadlovém zápisu nebo jednom krystalu vedle vracet slip s hláškou podle readSlip (případně Potvrdit i pro zápis) a počítat ho v Level.svelte:119. |
| K-I-01 | pracovní list patra I | List bere kvízy jen ze základní cesty, v patře I má 2 otázky místo 8, obě o 2ⁿ. Čtení a zápis chybí. | vysoká | WorksheetScreen.svelte:10-26; act1.ts:110-113 | Dát qRead a qWrite (quizzes.ts:618, 637) do I-5 až I-7, nebo jimi doplnit zásobník listu. |
| H-I-01 | I-7 | Zkratka „Zkusit bránu hned“ bere v každém patře komnaty 1–3. V patře I vede k bráně čtení a zápisu bez I-4 až I-6, Kodexy vaha, prevod a cteni zůstanou zamčené. | vysoká | progress.svelte.ts:153-169, 185; MapScreen.svelte:62, 195 | FAST_ROOMS nahradit seznamem komnat v ActDef, nebo zkratku v patře I vypnout. |
| D-I-01 | I-9 | Ukázka kroku na startu 0000 zvýrazní krystal s váhou 8, text přitom mluví o pravém krystalu s váhou 1. | vysoká | altar.ts:226-232; altarGame.svelte.ts:56-59 | V altar.ts:230 procházet krystaly od bitu 0 a brát jen tahy k číslu žádané skupiny. |
| D-II-26 | II-13 | Replika „1101…“ je napsaná pro −3, generátor losuje 1–7. Nesedí v 86 % komnat. | vysoká | act2.ts:796, 815; generators.ts:365-368 | První úlohu genII13Negate fixovat na 3, nebo repliku zobecnit. |
| D-II-30 | II-14, II-15 | V 92 % komnat II-14 a 66 % komnat II-15 jde aspoň jedna úloha v limitu vyřešit jen shozením světla přes levý okraj pákou ×2. Nic to předtím neučí ani neohlásí. | vysoká | generators.ts:271-285; tide.ts:115-118; levels.test.ts:245-253 | V distanceNoWrap a hintPath vyloučit i spill 'left' a rozšířit test. Jinak doplnit echo.spill a nápovědu 2. |
| K-II-02 | II-12 | Ukázka kroku u sloupce se 4 nebo 5 světly radí „jedno světlo přeteče do sloupce vlevo“. Správně jde o dvě místa. | vysoká | cascadeWords.ts:78-80, 160-164 | Pro inflow ≥ 4 popsat přenos o dvě místa a přidat test s farCarries. |
| D-III-01 | III-7 | Zkratka obejde III-4 až III-6 (Výluka, deska zákona, NAND, NOR, Rovnost, větvení), které brána zkouší a patro IV potřebuje. | vysoká | progress.svelte.ts:154, 161-169; generators3.ts:100-117 | Zkratku podmínit komnatami III-4 až III-6, nebo ji tu vypnout. Upravit text MapScreen.svelte:195. |
| H-III-03 | III-11, III-15 | Čtečka v Prapečeti hlásí vždy „Lampa mlčí.“, protože evaluate nedostane wires. | vysoká | gateEvents.ts:26; Board.svelte:191 | Předat state.wires jako čtvrtý argument. Sjednotit popis točitého kamene s hlášením. |
| D-I-03 | I-3 | Vysvětlení u odpovědi 2ⁿ⁻¹ radí postup, který vede na 2ⁿ⁺¹. | střední | quizzes.ts:80-81 | Přepsat obě vysvětlení: jeden krystal má 2 kombinace, každý další je zdvojí. |
| K-I-06 | přehled třídy | „Teď v komnatě“ ukazuje první nehotovou komnatu základní cesty. Hráč po zkratce, který hraje II-2, se ukáže v I-4. | střední | classOverview.ts:41-44; TeacherScreen.svelte:110 | Ukládat poslední otevřenou komnatu, nebo sloupec přejmenovat na „Další na základní cestě“. |
| H-I-02, H-II-03 | celá hra | Repliky Echa nejsou v živé oblasti a aria-label „Další replika“ přebije jejich text. Čtečka neslyší úvody, komentáře kroků, dopočet ani diagnózu chyby. | střední | EchoBubble.svelte:36-43; Level.svelte:269, 692; cascadeEvents.ts:49-51 | Vizuálně skrytý aria-live s textem repliky, „dál“ jako samostatné tlačítko, repliky posílat i do announce. |
| D-I-06 | I-11, I-15, I-3 | Ze slepé uličky ukázka kroku slibuje pokračování, dotek ale cestu přeruší. Z rozehraných cest s volným sousedem je 53 % nedokončitelných. | střední | altar.ts:271-302; altarGame.svelte.ts:51-54 | hamiltonStep má hlásit, že cesta neexistuje, a text říct „Odtud už cesta bez opakování nevede…“. |
| D-I-15 | I-15 (Kodex) | Shrnutí Hlubších síní I popisuje Počítadlo, které je dnes II-1. Paritu ani mocniny dvojky nezmíní. Tiskne se. | střední | kodex.ts:153-162 | Přepsat ř. 157 a 159 podle I-8 a I-9. |
| D-II-05 | Kaskáda II-0 až II-15 | Ukázka kroku na správné nepotvrzené desce řekne „Zvýrazněný krystal je potřeba přepnout“, nic nezvýrazní a vezme pečeť odvahy. V bráně přidá zkoušku navíc. | střední | cascade.ts:346-351; Level.svelte:447-452; baseGame.svelte.ts:29, 155-160 | Když stepHint vyjde null, říct „Všechno sedí, stačí potvrdit.“ a ukázku nezapočítat. |
| K-II-03 | II-13 | „Spodní řada je doplněk, tedy záporné číslo“ neplatí pro b ≥ 9. Horní řada má nejvyšší bit 1 v 51 % úloh a qComplementSum čte 1001 jako 9. Kodex přitom říká, že nejvyšší bit nese znaménko. | střední | act2.ts:829-836; generators.ts:376-379; kodex.ts:312; quizzes.ts:500-517 | Držet čísla v rozsahu čtyřbitového doplňku (a 1–7), nebo v Kodexu vysvětlit dvojí čtení. |
| D-III-02 | III-6, III-7 | Losované větvení chce v 1/3 případů dva Obraceče, tedy De Morgana před III-8. Cíl 1000 je totožný s úlohou z III-8. Nápověda 2 v III-7 na větvení nesedí. | střední | generators3.ts:53-60; act3.ts:464; PLAN.md:367 | V randomBranch nechat jen ['not','id'] a ['id','not'] a doplnit nápovědu pro větvení. |
| K-III-02 | III-11, III-15 | Zkouška s nenatočenými točitými kameny hlásí „Některý kámen je prázdný“ a přeskočí cílenou repliku Echa. | střední | gate.ts test(); gateEvents.ts:51-54 | V test() rozlišit nenatočený točitý kámen a dát mu vlastní hlášku. |
| K-IV-10 | celá hra | Částečně. PLAN 1.1 neodlišuje, co pokrývá základní cesta. Šestnáctková soustava, odčítání, doplněk, De Morgan a paměť jsou jen v Hlubších síních. Paměť mimo základ je návrhové rozhodnutí, ne chyba. | střední | PLAN.md:22-33, 301-307, 385, 854 | V PLAN 1.1 sloupec základ / Hlubší síně / Akt V a totéž ukázat učiteli. |
| H-IV-01 | IV-0, IV-2, IV-4 | Při nové kombinaci čtečka slyší jen vstupy. Hlášku o lampách přepíše hláška tried. | střední | machine.ts:440-446; machineEvents.ts:29-36, 66; Level.svelte:356-358 | Do hlášky tried přidat stav lamp, totéž do aria-label výklenku (Workshop.svelte:180). |
| H-IV-05 | IV-1, IV-2, IV-3, IV-4, IV-6, IV-12, IV-13 | Sedm replik kroku se nikdy neukáže. sayComplete je hned přepíše přes echo.say. | střední | machine.ts:401-406; context.ts:43-46; echo.svelte.ts:20-34 | V context.ts:45 a Level.svelte:317 použít echo.add. |
| D-IV-01 | IV-12, IV-14 | Částečně. IV-12 staví nápovědy, Echo i kvíz na Doplňku z nepovinné II-13 a doplněk sama neodvodí. Hráč neuvízne (nápovědy postup řeknou), chybí odvození. U IV-14 je nález slabý. | střední | act4.ts:867-895; progress.svelte.ts:175-186 | Do úvodu nebo nápovědy 1 IV-12 dát vysvětlení bez odkazu na II-13 a přepsat nápovědu kvízu (ř. 895). |
| D-IV-02 | IV-11 | Vysvětlení kvízu qCounter tvrdí přetečení i u 4 + 2, 4 + 3 a 5 + 2 (25 % losů). | střední | generators4.ts:205-226 | Losovat jen start + beats ≥ 8, nebo vysvětlení větvit. |
| K-IV-02 | IV-9 | Hláška „Ozvěna poslouchá, i když nemá“ je opak skutečné chyby: všechna chybná natočení padnou na tom, že ozvěna nepřevzala. | střední | act4.ts:650; machines.ts:320-335 | „Při tepu ozvěna D nepřevzala. Projdi 2. krok zkoušky…“ |
| D-I-04 | I-4 | Repliku o dopočtu váhy na prvním cíli přepíše replika kroku. | nízká | altarEvents.ts:22-27, 63-64; echo.svelte.ts:20-27 | echo.add, nebo začít step[0] dopočtem (act1.ts:140). |
| D-I-14 | I-7 | „Poslední zkouška“ neplatí, když po ukázce kroku u úloh 1–4 přibude šestá. | nízká | act1.ts:267; baseGame.svelte.ts:169-181 | „Teď nejtěžší světlo čtyř krystalů.“ Zkontrolovat i act1.ts:456 a I-14. |
| D-I-28 | patro I | Třetí stupeň nápověd v obsahu se skoro nikdy neukáže, stepHint ho přebije (I-0 až I-3, I-7 až I-15). | nízká | Level.svelte:447-449 | Mrtvé hints[2] odstranit nebo je vypsat jako úvod. Hlídat v levels.test.ts. |
| D-I-13 | I-14 | Částečně. Zrcadlo po čtveřicích readSlip nepozná (B6 → D6 dá obecnou hlášku). U 3C nebo E7 je hláška „prohozené glyfy“ dvojznačná. | nízká | inscription.ts:137-145; inscriptionEvents.ts:10-21 | Přidat druh „zrcadlo po čtveřicích“ s hláškou o váze 8 v každé čtveřici. |
| H-I-07 | I-11 | Echo chválí „ani jeden krok navíc“ i po resetu (17 kroků proti ideálu 15). | nízká | act1.ts:417; context.ts:43-46 | Neutrální replika, nebo ji podmínit počtem kroků. |
| D-II-11 | II-5 | Kvíz o bajtu neříká, že nádoba je plná. Formálně jde číst i jako 0 + 1. | nízká | act2.ts:360-364 | „…svítí všechna světla: 255. Co v ní zůstane, když přičteš 1?“ |
| D-II-12 | II-5 (Kodex) | Řetěz „12 + 6 = 18 − 16 = 2“ tvrdí nepravdivou rovnost a jde do tisku. | nízká | kodex.ts:220 | Napsat bez řetězení rovnítek. |
| K-II-07 | II-4 | „Proto má součet o krystal víc než sčítance“ zní jako obecné pravidlo, 31 + 1 = 32 v téže komnatě ho vyvrací. | nízká | act2.ts:296 | „…může mít součet o krystal víc, nikdy ne o dva.“ |
| K-II-20 | II-7 | Po zkoušce navíc nesedí „Ještě jeden součet.“ a „Poslední váha.“ | nízká | act2.ts:458, 461, 491; baseGame.svelte.ts:169-182 | Repliky bez počtu, nebo je při extraAdded přeskočit. |
| D-II-16 | II-8 | „Výpůjčka prošla několika sloupci“ zazní i u 10 − 5 bez řetězu (asi 3 % komnat). | nízká | generators.ts:239-241; act2.ts:542 | Pro třetí úlohu chtít řetěz, nebo repliku zobecnit. |
| D-II-23 | II-11 | Částečně. „Zbytek zůstal v misce“ zazní i při zbytku 0 (6 % komnat). Miska ale prázdná není, ukazuje 0. | nízká | generators.ts:326-339; act2.ts:680 | Podmínka rems[3] !== 0, nebo „Zbytek ukazuje miska.“ |
| D-II-24 | II-12 | Nápověda 2 popisuje pořadí číslic (poslední, prostřední, první) chybně pro 10 a 11. | nízká | act2.ts:719 | „Číslice čti zprava: první zůstane dole, druhá jde do sousedního sloupce, třetí o dvě místa.“ |
| D-III-03 | III-6 | Zkoumání větvení dostává nápovědy pro osazování kamenů. | nízká | act3.ts:354-374; gateGame.svelte.ts:69-72 | stepHint pro explore a vlastní nápovědy úlohy. |
| D-III-11 | III-14 | „Tři runy“ sedí jen asi v třetině losů, obvody mají 2–4 runy. | nízká | act3.ts:854; generators3.ts:169-228 | Replika bez čísla. |
| H-III-17 | III-12 | Replika „Výluka přepíná.“ se nikdy neukáže, step a complete přijdou v jedné dávce. | nízká | act3.ts:771-772; maskEvents.ts:21-37 | Krok 5 smazat a text dát do complete. |
| K-IV-15 | IV-4 | Echo po první chybě posílá hledat řádek desky, která se při 16 řádcích neukazuje. | nízká | act4.ts:320; Workshop.svelte:57, 234-245 | Odkázat na okénko „Stroj se spletl“. |
| H-IV-04 | IV-7 | Zkouška navíc po ukázce u výhybky je ve 48 % rozdělovač, kindOf vrací u obou mode 'build'. | nízká | extraTask.ts:10-31; generators4.ts:136-138 | Pole kind v MachineTask, nebo dovolit zopakovat stejnou podobu. |
| H-IV-11 | IV-2 | V kameni přenosu projde i Výluka, Echo pak vždy mluví o Rozcestí. | nízká | act4.ts:61, 166 | Nabídnout jen and/or, nebo jev využít v otázce. |
| H-IV-13 | IV-7 | Nápověda „čísla lamp nejsou popořadě“, los ale dá 0123 v 1/24 případů. | nízká | act4.ts:500; generators4.ts:137 | Losovat přes until s vyloučením 0123. |
| D-IV-10 | IV-8 | Nápověda kvízu odkazuje na první cíl Kruhu, S zhasíná až ve druhém. | nízká | act4.ts:549-553, 611 | „…ve druhém cíli Kruhu…“ |
| K-IV-01 | IV-9 | Brána tepu (řízená úrovní) a ozvěna s tepem (řízená hranou) se vydávají za totéž. | nízká | machines.ts:312-326; machine.ts:326-342; act4.ts:687 | Jedna věta o rozdílu v act4.ts:687 a v Kodexu. |
| K-IV-14 | IV-8 | „Každý bit paměti v počítači drží podobný kruh“ platí jen pro registry a SRAM. | nízká | act4.ts:535 | „Každý bit v registrech procesoru drží podobný kruh.“ |
| H-IV-17 | IV-11 | Počítadlo nemá vstupy, nápověda 3 a hláška po chybě mluví o krystalech a vstupech. | nízká | machines.ts:426; act4.ts:822; machineEvents.ts:94 | U strojů bez vstupů psát jen „tep“. |

### 2.1 Textové nálezy

Pravidla pro herní texty (bez dvojsmyslů, zájmena s jasným předmětem, rodově neutrální oslovení, spisovně a jednotně) a jazykové chyby. Nálezy se stejnou příčinou jsou v jednom řádku.

| Nález | Komnata | Co je špatně | Závažnost | Doklad | Oprava |
|---|---|---|---|---|---|
| D-III-04 | III-5, III-7, III-9, III-15 | Hláška po špatné runě má pevně „svítila/mlčela“. U 5 ze 7 run nesedí rod a hráč ji v patře III vidí nejčastěji. | střední | gateEvents.ts:107 | Podmětem udělat lampu: „S runou X by lampa v řádku … svítila.“ |
| D-III-05 | III-10 | „Postavíš ho z Pout a Rozcestí“ je výslovně zakázaný obrat. | střední | act3.ts:656 | „Hlas většiny jde složit z Pout a Rozcestí. Funguje to i naopak…“ |
| D-IV-09 | IV-4, IV-14 | Index u krystalu je na desce váha (A₂, A₁), v Kodexu pořadí od nuly (A₁, A₀, 2ⁱ). U násobičky vede čtení podle desky ke špatné váze. | střední | kodex.ts:532, 641; MachineBoard.svelte:153-165 | Indexovat jednotně, nejlépe vahou i v Kodexu. |
| D-I-18 | I-1, I-2 | „Když krystal ve stěně svítí, rozsviť ho“: „ho“ míří na krystal ve stěně. | nízká | act1.ts:39, 67 | „…rozsviť i svůj.“ |
| D-I-19 | I-2 | „Pravá svítí, levá mlčí.“ nesedí rodem ke krystalu. | nízká | act1.ts:72 | „Pravý svítí, levý mlčí.“ |
| K-I-17 | I-5 | „Osm, čtyři, dva, jedna“ míchá tvary. | nízká | act1.ts:179 | „…dvě, jedna.“ |
| H-I-21 | celá hra | Střídá se „Akt“ a „Patro“ (mapa, titulka, Kodex, schody, list). | nízká | MapScreen.svelte:139, 148; Title.svelte:94; kodex.ts:109 | Všude „patro“. |
| H-I-23 | I-0, patra III a IV | Částečně. „Klikni“ na dotykovém displeji, nejednotně v celé hře. | nízká | act1.ts:23; act3.ts:25, 47, 107; act4.ts:42-44, 122, 238, 245 | Sjednotit na „dotkni se“. |
| D-I-17 | I-11 (kvíz) | „abys prošel“ v qGrayMoves. | nízká | quizzes.ts:158 | „Kolik doteků nejméně stačí na projití…“ |
| D-I-26 | I-9 | Částečně. „Lichý je jen pravý krystal“ je nepřesné zkrácení. | nízká | act1.ts:323-324 | „Lichou váhu má jen pravý krystal.“ |
| D-I-27 | I-12, I-13, I-14 | „Brána žádá“ v komnatách, které branou nejsou. | nízká | Inscription.svelte:91; inscriptionEvents.ts:61; act1.ts:443-538 | Popisek podle čísla komnaty jako Tide.svelte:83, v textech „nápis“. |
| K-I-14 | I-9 (kvíz) | „Vpravo jsou jen 1 stín.“ | nízká | quizzes.ts:724 | Pro k = 1 „Vpravo je jen jeden stín“. |
| K-I-16 | I-12 | „do dvě stě padesáti pěti“ | nízká | act1.ts:458 | „do dvou set padesáti pěti“ |
| K-I-18 | I-13 | Jeden kotouč, rozhraní píše „Kotouče nezapadly“. | nízká | Inscription.svelte:137, 153; inscriptionEvents.ts:48 | Číslo podle počtu kotoučů. |
| K-I-19 | I-14 | Částečně. „krátce a bez chyb“ přehání. | nízká | act1.ts:544 | „…přehledněji než osm nul a jedniček.“ |
| D-II-04 | II-1, II-4, II-14 (kvízy) | Částečně. „Zhasne 2 jedniček“ (polovina losů qFlips), „se do 4 krystaly nevejde“. | nízká | quizzes.ts:112, 116, 292 | Tvary přes plural(), „do n krystalů“. |
| D-II-08 | II-3 | Částečně. „Přenos přeskočil dva sloupce“, ve skutečnosti jimi prošel. | nízká | act2.ts:233, 236 | „Přenos prošel dvěma sloupci…“ |
| D-II-10 | II-5 (kvíz) | „Pětijiskrová nádoba“ (slovo jiskra jinde není) a rovnost „1100 + 0110 = 18“ bez indexů. | nízká | act2.ts:353, 357 | „Nádoba s pěti krystaly“, indexy ₂. |
| D-II-20, K-II-21 | II-5, II-9 (Kodex) | „přidej ještě jedna“, „z Čtení nápisu“, „zbyde“. | nízká | kodex.ts:221, 255 | „přidej ještě jednu“, „ze Čtení nápisu“, „zbude“. |
| H-II-07 | II-6, II-8, II-15 | „Odliv“ znamená jednou posun vpravo, jindy odčítání. | nízká | act2.ts:372-401, 505-537, 916; kodex.ts:226-241 | Odčítání přejmenovat (např. Výpůjčka), nebo II-6 zkrátit na „Příliv“. |
| H-II-21 | kvízy patra II | Částečně. „kopie posunuté o 1, 2, 3 míst“. Dělení se píše „:“ i „÷“. | nízká | quizzes.ts:440; kodex.ts:278, 596 | Výčet spojit „a“ a tvar vzít z plural(). Dělení sjednotit na „:“. |
| D-II-14 | II-8 | „Teď si půjčuj sám.“ Regrese, PLAYTEST.md:382 vede „sám“ jako vyřešené. | nízká | act2.ts:541 | „Teď výpůjčky zapisuješ ty.“ |
| D-II-21 | II-10 | „Kopie posunutá o 0 míst“. | nízká | cascadeWords.ts:43-44 | „Neposunutá kopie (×1)“. |
| K-II-10 | II-12 | „se slila pět světel“, „se slévají pět světel“. | nízká | cascadeWords.ts:28, 48, 52, 80, 81 | Celé sloveso brát z tabulky podle počtu. |
| K-II-22 | II-10 | „první číslo“ proti „první činitel“, „o 0, 3 míst“. | nízká | act2.ts:614-633; quizzes.ts:431-440 | Všude „činitel“, výčet s „a“. |
| K-II-24 | II-8 | Částečně. „odečte se spolu s ní“ nemá podmět. | nízká | act2.ts:531 | „Tam se odečte spolu se spodní řadou.“ |
| H-II-22 | II-14, II-15 | Částečně. Dvakrát po sobě stejné shrnutí, „Nejtěžší zkouška“ před velkou bránou. | nízká | act2.ts:894, 902, 919 | Vlastní závěr pro II-14, „Nejpřísnější zkouška“. |
| D-III-12 | III-6 | „Teď větvení postav sám.“ Táž regrese jako v II-8. | nízká | act3.ts:381 | „Teď větvení postavíš ty.“ |
| D-III-17 | III-2, III-5 (kvízy) | Částečně. Nápověda s abstraktním „n“. „V polovině řádků svítí jeden vstup“ je dvojznačné. | nízká | quizzes.ts:576, 607 | Číslo v nápovědě, „Každý vstup svítí v polovině řádků.“ |
| D-III-18, D-IV-15 | Brána (III), Dílna (IV) | „v 1 řádku desky. Přepni vstupy podle nich“. V IV-1 u nejčastější chyby. | nízká | gateEvents.ts:53-54; machineEvents.ts:99-103 | Zájmeno a tvar podle počtu řádků. |
| D-III-20, H-III-09, H-III-24 | III-1, III-9, III-15 | „Rozcestí jsou Zlomené pouto…“, „Rovnost a důsledek“ malým písmenem, zadání III-1 mluví o jednom kameni u obvodu se dvěma. | nízká | act3.ts:100, 585, 588, 908 | „Rozcestí je…“, „Důsledek“, „Vlož do prázdných kamenů runy…“ |
| K-III-20, D-III-19 | III-0, III-13, Kodex III-9 | „Nejjednodušší kámen … jmenovali Obraceč“ plete kámen a runu. Ukázka v poslední úloze Tajné řeči mluví o „výsledku“ a „nápisu“ místo šifry a zprávy. „Když neprší, nic neporušila.“ | nízká | act3.ts:54; stepWords.ts:97; kodex.ts:423 | „Nejjednodušší runě…“, příznak šifry v maskStep, „Když neprší, implikace platí…“ |
| K-III-07 | III-1, runes.ts | Částečně. „Světlo“ je jednou vstup, jindy hodnota 1 („když obě světla mlčí“). | nízká | runes.ts:17-27; act3.ts:124-128 | Pravidla run přes „vstupy“, zpřesnit kvíz. |
| K-III-15 | III-4 | Částečně. Výluka jako jediná základní runa nedostane v Echu svůj znak ⊻. | nízká | act3.ts:253 | Doplnit větu o znaku ⊻. |
| K-III-19 | III-7, III-8 | Ukázka kroku v desce nerozliší dva Obraceče. | nízká | stepWords.ts:50 | „Obraceč u A dá světlo…“ |
| H-III-18 | III-7 | „Co z ní vyjde, slož z run.“: „ní“ se váže k desce, míněna je lampa. | nízká | act3.ts:444 | „Co k lampě doteče, slož z run.“ |
| H-III-20, K-IV-23 | Strážce schodů III a IV | „Tři zákony z minulého patra“, qRead je ale z Předsíně. | nízká | StairsScreen.svelte:89-91, 133 | „…na tři zákony, které už znáš.“ |
| D-IV-14 | IV-3 | Nápověda 2 „nic nepřitéká“, správně stín. Nenastavený kámen Zkouška bere jako prázdný. | nízká | act4.ts:239 | Text jako act4.ts:484. |
| D-IV-22, K-IV-20 | Kodex IV-1, IV-2 a další | Přenos jednou C, jinde P. Součin „AB“ základní cesta nezavádí. „·“ odděluje vzorce i značí násobení. | nízká | kodex.ts:497-510, 389-586 | Všude P, ∧ místo AB, vzorce oddělovat středníkem. |
| D-IV-25, H-IV-16 | IV-1, IV-7, IV-13 | Společné zadání nesedí na jednotlivé úlohy: „(a vlož runu)“ u rozdělovače, „do prázdného kamene“ při dvou kamenech, IV-13 chce obojí naráz. | nízká | act4.ts:117, 496-498, 906-907; generators4.ts:110-138 | Úlohám dát vlastní zadání (say). |
| K-IV-19 | IV-1, IV-2, IV-4, IV-10, IV-14 | Titulky nesou moderní jméno dřív, než ho Kodex přeloží. V IV-1 pak Echo „oznámí“ jméno z titulku. | nízká | act4.ts:112, 134, 162, 278, 710, 714, 937 | Lumenitské titulky podle Kodexu. |
| H-IV-18 | IV-5 | „A teď na lampu nemá vliv.“ se čte jako spojka. | nízká | act4.ts:395 | „Krystal A teď…“ |
| H-IV-24 | patro IV | „Moderní jméno je“ 5×, „Bez jediného zbytečného kroku“ 7×, meta věta „Žádná kopie komnat“ v úvodu IV-15. | nízká | act4.ts:134-1012 | Obměnit, úvod IV-15 přepsat do příběhu. |
| D-IV-16 | IV-15 | „Když C zhasne, má ho tep vynulovat.“ | nízká | act4.ts:992, 1002 | „…má tep počítadlo vynulovat.“ |
| D-IV-17 | IV-9, IV-10 | „Tep a ozvěna převzala světlo z D.“, „Tep a paměť drží dvojku.“ | nízká | act4.ts:689, 753 | „Tep. Ozvěna převzala…“, „Po tepu drží paměť dvojku.“ |
| D-IV-26 | IV-12 | Pravidlo „lampy ukazují A + B“ mlčí o přetečení (7 + 7 čeká 6). | nízká | generators4.ts:100 | Doplnit „(co přeteče přes 7, zmizí)“. |
| D-IV-27 | IV-14 | Částečně. „Lampa sčítá“ a „přenos z Pout“ jsou nepřesné zkratky. | nízká | act4.ts:952 | Přepsat podle machines.ts:688-699. |
| K-IV-16 | IV-15 | První hláška po chybě míří na zhasnutí C, chyby ale padají hlavně při svítícím C. | nízká | act4.ts:1004 | Obecnější hláška s oběma kontrolami. |
| K-IV-21 | IV-15, Kodex | Částečně. „Tak se nulují i hodiny“ koliduje s hodinami jako taktem. Kodex má jen „ripple-carry adder“. | nízká | act4.ts:1005; kodex.ts:520 | „stopky“, český název sčítačky. |
| K-IV-25 | IV-13 | Částečně. „horní vstup A … dolní B“ výhybky se plete s krystaly A a B. | nízká | act4.ts:910 | Popsat cesty bez písmen. |

### 2.2 Nejisté

Ověřovatel žádný nález neoznačil jako nejistý. Za kontrolu přesto stojí místa, která v kódu neprověřil nikdo:

- **Zkratka v patrech II a IV.** Ověřeno je jen patro I a III. Že komnaty II-5, II-6 a IV-4 až IV-6 zavádějí obsah brány, uvádí poznámka ověřovatele k D-III-01 a názorový nález H-IV-08.
- **Rozměry na telefonu** (H-I-20, H-II-16, H-II-24, H-III-11, H-IV-21). Spočítané z CSS, ne změřené. Ověřit na telefonu na výšku.
- **„Nejčastější chyba“** u D-I-03 a D-I-13. Že jde o nejčastější omyl, kód nedokládá.
- **Časové odhady a mapování na RVP G** (K). Jsou to odhady kurikulisty. Znění výstupů je potřeba ověřit v platném RVP G.

## 3. Poznámky po patrech

Buňky shrnují poznámky recenzentů ke komnatám. Čísla nálezů jsou sjednocená: kde tutéž věc hlásilo víc recenzentů, uvádíme ověřené id.

### Patro I: Předsíň Prvního Světla (bit a počítání)

Didaktik chválí lešení základní cesty a vidí dvě slabiny: zápis bez zpětné vazby a ukázku kroku, jejíž důvod nesedí. Kurikulista potvrzuje posloupnost bit → 2ⁿ → poziční hodnota → převody a správnost Kodexu, chybí mu kvízy po I-3 a školní názvosloví. Základ odhaduje na hodinu, síně na další. Kritik oceňuje svižný začátek. Síně podle něj táhnou I-9, I-11 a I-13, ředí je I-8, I-12 a I-15. U I-15 se rozcházejí: pro kurikulistu dobrá syntéza, pro kritika vrchol, který nic nestupňuje.

| Komnata | Didaktik | Kurikulista | Kritik |
|---|---|---|---|
| I-0 Probuzení | Jeden dotek, nápovědy stačí i nejslabšímu. Funguje. | Nultá komnata podle PLAN 6, bez výhrad. | Hraje se do deseti sekund. {{ticho}} a {{věky}} se nikdy nepřeloží (H-I-22). |
| I-1 Ticho | Pointa „I ticho je zpráva“ funguje. „Rozsviť ho“ míří na krystal ve stěně (D-I-18). | Bit třemi vzory, Kodex má školní definici. Drobnost „proud, nebo žádný proud“ (K-I-27). | Krátké a čisté. Čtečka hlásí „Oltář žádá 0“ místo vzoru (H-I-03). |
| I-2 Dvě světla | Dobré lešení pro I-3. „Pravá svítí“ nesedí rodem (D-I-19). | „Čti jedna-nula, ne deset“ míří přesně na typickou chybu. | Čtyři vzory, rychlé. Čtečka hlásí čísla, která hra ještě nezavedla (H-I-03). |
| I-3 Kolik kombinací? | Rozdělená deska je silný okamžik. Počet 8 je vidět předem (D-I-07) a vysvětlení v kvízu radí špatně (D-I-03). | 2ⁿ přichází objevem, kvízy mají správné klíče. Je to jediný kvíz základní cesty patra (K-I-01, K-I-02). | První aha patra. Nápověda se nuluje po každé kombinaci (H-I-05), nápověda 1 nic neříká (H-I-13). |
| I-4 Váhy kamenů | Dopočet váhy vede k objevu. Replika k dopočtu se na prvním cíli přepíše (D-I-04). | Poziční hodnota objevem, zápisník 101₂ = 5. „Váha“ má v Kodexu jiný význam (K-I-09). | Nejlepší objevovací komnata patra, dopočet odměňuje uvažování. |
| I-5 Čtyři váhy | Pevná devítka drží objev osmičky. Nápověda 1 prozradí odhad (D-I-24). | Hladový postup sedí s Echem. Převod dělením dvěma je jen pod „Dnes:“ (K-I-10). | Výzva k odhadu ztrácí smysl, nápověda ho hned prozradí. |
| I-6 Čtení nápisů | Mizení opor a cílené hlášky jsou nejlepší zpětná vazba patra. Souměrné nápisy berou kontrolu směru čtení (D-I-11). | Opory mizí uvnitř komnaty. V 5,5 % losů holá část zrcadlo neodhalí (K-I-24). | Hlášky omylů výborné. 28 % losovaných nápisů je souměrných (H-I-25). |
| I-7 Brána Předsíně | Zápis nemá zpětnou vazbu ani automatickou pomoc (D-I-02). „Poslední zkouška“ neplatí po zkoušce navíc (D-I-14). | Shrnutí aktu správně (45 = 101101₂). Totéž s „Poslední zkouškou“. | Pořádná zkouška bez opor. Zkratka sem pustí bez I-4 až I-6 (H-I-01). |
| I-8 Skryté váhy | Dobrý most k šestnáctce. Živý součet prozradí každou váhu (D-I-09). | Kodex mocnin správně. Jednotky informace jen jednou větou (K-I-22). | Součet prozradí váhy, síň je lehčí než brána (H-I-14). |
| I-9 Sudé a liché | Silný nápad, kvízy zkoušejí pochopení. Ukázka zvýrazní osmičku (D-I-01) a jde řešit desítkově (D-I-10). | Poctivé vyloučení nuly. „Parita“ koliduje s paritním bitem (K-I-08). | Nejsvěžejší komnata patra. Ukázka kroku protiřečí textu (D-I-01). |
| I-10 Nejvyšší světlo | Řada 31, 32, 63, 255 vede k 2ⁿ − 1. Chybné nastavení nevyvolá reakci (D-I-02). | Kvízy i Kodex Bajt správně. | Pěkné aha „zhasla pět krystalů“. Na telefonu se oktáva zalomí (H-I-20). |
| I-11 Tichý krok | Nejlepší hlavolam patra. Ukázka jde proti Zrcadlu (D-I-05) a ze slepé uličky slibuje cestu (D-I-06). | Kodex Grayův kód přesný. Ukázka i Echo jdou proti nápovědě 2 (K-I-04). | Nejlepší hádanka. Překlep smaže cestu a Zpět nejde (H-I-06), ukázka stojí 45 stisků (H-I-05). |
| I-12 Velký nápis | Jako dril v pořádku. „Brána“ v komnatě, která branou není (D-I-27). | Dril bez kvízu a Kodexu. „do dvě stě…“ (K-I-16). | Jen dril bez nového nápadu (H-I-27). |
| I-13 Řeč glyfů | Objev glyfu na kotouči je opravdový. Ukázka při čtení sčítá desítkově (D-I-12), oba kvízy zkoušejí totéž (D-I-21). | Pravidlo čtení sedí. Ukázka zápisu říká „Žádáno 12“ místo C (K-I-05). | Nejsilnější aha patra, mapa pak ukazuje čísla šestnáctkově. |
| I-14 Dvojznak | #FF8800 propojí glyfy se skutečností. Zrcadlo po čtveřicích hra nepozná (D-I-13). | Kvíz správně. Ukázka počítá desítkově (K-I-05), „bez chyb“ přehání (K-I-19). | Dobré rozšíření. „Ten s váhou 64“ míchá váhy oktávy do čtení po čtveřicích (H-I-16). |
| I-15 Velká brána Předsíně | Ukázka má stejné chyby jako v I-11. Kodex popisuje Počítadlo z II-1 (D-I-15). | Dobrá syntéza. Kodex vynechává I-8 a I-9 (D-I-15). | Každá zkouška je menší než komnata, ze které vychází (H-I-15). |

### Patro II: Síň Počtářů (sčítání a přenos)

Didaktik i kritik mají patro za nejpromyšlenější: zachování světla dělá z přenosu viditelnou fyziku. Didaktik vidí tři slabiny: losování předběhlo texty, slovník a komnaty bez rozhodnutí. Kurikulista hodnotí patro jako odborně pevné, slabá místa jsou doplněk a slovník. Základ odhaduje na 40–50 minut, síně na 1–1,5 hodiny. Kritik vidí tření tam, kde Kaskáda odmítá správný výsledek zapsaný „v nesprávném“ pořadí. U Strážce schodů se rozcházejí: kritik otázky chválí, didaktik a kurikulista by místo otázky na kombinace chtěli zdvojování vah (D-II-01).

| Komnata | Didaktik | Kurikulista | Kritik |
|---|---|---|---|
| II-0 Jedna a jedna | Výborná nultá komnata, 1 + 1 = 10 doslova. Po prázdném potvrzení hláška řekne, co rozsvítit (D-II-06). | „Jedna-nula, ne deset“ přesně podle učebnic. | Hračka s jasnou pointou, odmítnutí u 1 + 1 má přesný důvod. |
| II-1 Počítadlo poutníků | Čárky a nápověda zprava vedou k algoritmu přenosu. Ukázka bez důvodu (D-II-03), tvary v kvízu (D-II-04). | Repliky sedí, Kodex správně. Nápověda 1 jde trochu proti kvízu (D-II-02). | Konkrétní a rychlé. Oltář bez Potvrdit mezi kaskádami je drobná změna ovládání. |
| II-2 Dvě dvojky | Nejlépe postavená komnata patra, kvíz vysvětlí chybu OR i XOR. | Kodex Zákon dvojice přesný. | Opory dobře postavené. Malá znovuhratelnost (los z 8 a 2 dvojic). |
| II-3 Krystaly přenosu | Zachování světla vynutí postup zprava. Texty pletou přetečení s přenosem (D-II-09). | Zákon sloupce správně. Echo nazývá přenos „přetečením“ (K-II-05). | Vzorové hlášky. Správný výsledek před přenosem dostane odmítnutí, které zní jako chyba (H-II-04). |
| II-4 Velká kaskáda | Počty pod sloupci mizí až po prvním součtu. | Závěr „o krystal víc“ neplatí obecně (K-II-07). | Nejdelší komnata základu (asi 25 doteků), tempo drží. |
| II-5 Přetékající nádoba | Přetečení je vidět. „Pětijiskrová“ (D-II-10), dvojznačný kvíz (D-II-11), řetěz rovností v Kodexu (D-II-12). | Přetečení bez znaménka správně. Kodex „12 + 6 = 18 − 16 = 2“ (D-II-12). | Pravidlo stojí přímo na desce. V kvízu se míchají zápisy (D-II-10). |
| II-6 Příliv a odliv | Objev v čisté podobě. „Odliv“ je tu posun, v II-8 odčítání (D-II-13). | Kodex posunu správně. Táž kolize (K-II-06). | Nejlepší hračka patra. „Odliv půlí“ se tluče s II-8 (H-II-07). |
| II-7 Brána Síně | Brána sama ohlásí, že nehlídá světlo. Kvíz pokrývá patro. | Syntéza odpovídá výstupům. Po zkoušce navíc nesedí počty (K-II-20). | Rozumná syntéza. Pravidlo „brána nehlídá“ je jen ve 4. replice (H-II-10). |
| II-8 Odliv | Ukázková úloha je dobré lešení. V řetězu výpůjček odmítnutí neporadí (D-II-15), chybí kvíz (D-II-18). | Česká školní metoda odčítání, velké plus. Kvíz chybí (K-II-16). | Řetěz jde rozsvítit jen zleva, nápověda říká „Začni vpravo“ (H-II-11). |
| II-9 Zdvojení | Nejsilnější aha patra, Horner platí pro všechny cíle 2–31. Nápověda 2 prozradí pointu (D-II-19). | Horner jako stavební návod odborně přesný. | Zápisník ×2 a +1 je nejsilnější aha. Nápověda chce zápis, který deska neukazuje (H-II-12). |
| II-10 Násobení po lumenitsku | Výběr kopií nutí rozhodnout. „Posunutá o 0 míst“ (D-II-21). | Násobení správně. „Číslo“ a „činitel“ se střídají (K-II-22). | Elegantní. Deska je na telefonu širší než obrazovka (H-II-16). |
| II-11 Dělení posunem | Jediná páka, splní se sama, není co rozhodnout (D-II-22). | Podíl a zbytek přesně. Notace ÷ a : se střídá (K-II-14). | Nic nejde rozhodnout ani pokazit (H-II-05). Čtečka prozradí podíl (H-II-08). |
| II-12 Tři řady | Přenos o dvě místa dobře vřazený. Nápověda 2 popisuje pořadí číslic chybně (D-II-24). | Ukázka radí přenos do sousedního sloupce (K-II-02), „se slila pět světel“ (K-II-10). | Svěží novinka, 15 + 15 + 15 je dobrý vrchol. Odmítnutí při výsledku napřed ve všech úlohách (H-II-04). |
| II-13 Doplněk | Objev přes 13 jedniček funguje. Replika sedí jen na −3 (D-II-26), čtení se znaménkem a bez něj se míchá (D-II-27). | Model záporných čísel odporuje Kodexu (K-II-03), chybí rozsah (K-II-04). | Pak 13 stejných tahů bez rozhodnutí (H-II-09). Čtečka prozradí cíl (H-II-08). |
| II-14 Váhy Osudu | Dobrá výzva. Většina losů chce shodit světlo vlevo (D-II-30), ukázka nepočítá se zbylými tahy (D-II-31). | Syntéza posunu a ±1. Kvíz o odčítání patří do II-8 (K-II-16). | Na papíře nejlepší výzva patra, kazí ji generátor (D-II-30). |
| II-15 Velká brána Síně | Zkouší jen tři síně ze sedmi a nemá kvíz (D-II-32). | Dobře shrnuje síně, Kodex správně. Kvíz chybí. | Poctivá syntéza bez nového nápadu. Závěr opakuje II-14 (H-II-22). |

### Patro III: Zahrada Bran (logika)

Didaktik má patro za didakticky nejčistší, slabiny vidí ve stavbě opor (zkratka, přetížená III-6, desky opisované z lampy). Kurikulista nenašel jedinou chybnou tabulku ani odpověď. Chybí mu symbolický zápis a De Morgan na základní cestě. Základ se vejde do hodiny, síně jsou další jedna až dvě. Kritik chválí nejčistší herní jazyk, křivka je ale nerovná: III-0 až III-5 jsou skoro bez odporu. U III-14 se rozcházejí: pro didaktika poznávání runy v převleku, pro kritika komnata, kde je zjednodušení vidět.

| Komnata | Didaktik | Kurikulista | Kritik |
|---|---|---|---|
| III-0 Cesta světla | Na naladění stačí. Echo jmenuje kámen, který tu není. | Dobrý nultý krok, úvodní věta plete kámen a runu (K-III-20). | Jeden dotek a celá vítězná deska působí naprázdno. Nečitelné „Obraceč“ je dobrý háček. |
| III-1 Obraceč | ¬¬A = A přijde ve správnou chvíli. Průchod bez představení, zadání mluví o jednom kameni (D-III-20). | Kvíz „dvěma Obraceči“ je dvojznačný (K-III-07). | Dobrá gradace. Zadání nesedí na třetí úlohu (D-III-20). |
| III-2 Pouto | Rytmus zkoumání, deska, kvíz drží. Nápověda kvízu s abstraktním n (D-III-17). | Učebnicové pořadí. Desku jde opsat z lampy, PLAN.md:363 píše „zpaměti“ (K-III-10). | Pořadí kombinací z nápovědy 2 stojí pečeť přesnosti (H-III-16). |
| III-3 Rozcestí | Inkluzivní „nebo“ vysvětlené výslovně. | Nevylučovací „nebo“ přesně jako v matematice. | Stejný formát podruhé, kvíz pěkně spojí dvě runy. |
| III-4 Jen jeden | Vazba na 1 + 1 je nejsilnější přenos patra. Kvíz má nevěrohodné možnosti (D-III-14). | Nejsilnější mezipatrový most. Chybí znak ⊻ (K-III-15). | Potřetí stejný formát, zato nejlepší propojení patra. |
| III-5 Které pravidlo? | Hláška jmenuje řádek, jen se špatným rodem (D-III-04). Deska se opisuje z lampy (D-III-06). | Kodex Pravdivostní tabulka správně. Vyplňování je opisování (K-III-10). | Zadání není pokyn (D-III-21). Desky jdou opsat (H-III-10). |
| III-6 Řetězy | Tři nové nápady naráz (D-III-09) a větvení se dvěma Obraceči (D-III-02). „Postav sám“ (D-III-12). | NAND, NOR a Rovnost podle pravidla. Větvení předbíhá De Morgana (K-III-04). | První opravdová hádanka. Při zkoumání patří nápovědy ke špatné úloze (D-III-03). |
| III-7 Brána Zahrady | Závoj nutí skládat výsledek z run. Zkratka sem pustí bez Výluky a větvení (D-III-01). | Tabulku složeného obvodu chce hra poprvé až tady (K-III-10). | Dobrá syntéza se zkouškou navíc. Zkratka obejde tři runy (D-III-01). |
| III-8 Zrcadla | Nejlépe postavená komnata patra, jméno De Morgan až po zážitku. | Výborná. Třetinu hráčů ale předběhne III-6 (D-III-02). | Nejlepší aha patra, deska se musí vyplnit z run. |
| III-9 Rovnost a důsledek | Kvíz míří na typickou chybu. Obrácené nápovědy (D-III-13), „Desku znám“ přeskočí Důsledek (D-III-16). | Odpovídá matematice. „Důsledek“ může kolidovat se školním „závěrem“. | Kvíz výborný. Dvě desky jdou opsat (H-III-10), „důsledek“ malým písmenem (H-III-24). |
| III-10 Hlas většiny | Obě duální řešení přijata. „Postavíš ho“ (D-III-05), nápověda 2 neradí (D-III-22). | Přesně dvě řešení. Kodex míchá zápis AB s ∨ (K-III-14). | Dualitu podá Echo zakázaným obratem (D-III-05). Na telefonu široká (H-III-11). |
| III-11 Prapečeť | Silná myšlenka. Rozcestí bez strategické nápovědy (D-III-08), pointu prozradil Kodex v III-6 (D-III-15). | Správně. Hláška „prázdný kámen“ (K-III-02), chybí strategická nápověda (K-III-16). | Čtečka hlásí lampu vždy zhasnutou (H-III-03). Ukázka neřekne, kam natočit (H-III-14). |
| III-12 Masky | Ukázka vysvětlí každý krystal. Kvíz odkazuje na nepovinnou II-13 (D-III-23). | Vše správně. Obecnou masku není nutné sestavit (K-III-18). | Praktické a pestré. Poslední replika zapadne (H-III-17). |
| III-13 Tajná řeč | ECHO a útok známým textem jsou vrchol síní. Pointa o klíči se nezažije (D-III-10). | Šifra správně. Neprolomitelnost bez podmínky délky klíče (K-III-08). | Emoční vrchol patra. „Klíč vpravo“ na telefonu neplatí (H-III-12). |
| III-14 Méně je víc | Hotová deska vpravo, takže poznávání runy, ne zjednodušování (D-III-07). | Tabulky správně. „Tři runy“ při 2–4 runách (D-III-11). | Zjednodušení je vidět, nesedí „Tři runy“ (D-III-11). Kámen se šesti runami jde proklikat jen dopředu (H-III-22). |
| III-15 Velká brána Zahrady | Dobrá syntéza. Nápověda 2 Závoje jen na první runu, ukázka bez důvodu (D-III-08). | Zrcadla ani Hlas většiny nezkouší, Echo přesto říká „umíš je zrcadlit“. | V polovině losů nejlehčí Prapečeť (H-III-15). |

### Patro IV: Hlubina Strojů (obvody a paměť)

Didaktik chválí stavbu zkoumání, stavba, zabalení do kamene. Slabiny jsou závislosti na síních II, slabá pomoc po chybě u strojů s pamětí a kvízy uhodnutelné podle délky. Kurikulista potvrzuje, že základ pokryje řádek „Obvody“ z PLAN 1.1, vadí mu názvosloví. Základ odhaduje na 25–60 minut a doporučuje dvě hodiny. Kritik má patro za herně nejbohatší, slabiny vidí v toku replik, přístupnosti a obtížnosti a nejvíc mu chybí konec. Strážce schodů podle didaktika neopakuje sčítání (D-IV-19).

| Komnata | Didaktik | Kurikulista | Kritik |
|---|---|---|---|
| IV-0 Stroj, který počítá | Objev před výkladem, „lampy“ nic neprozradí. | Funguje. | Dobrá nultá komnata. Čtečka u nové kombinace neohlásí lampy (H-IV-01). |
| IV-1 Poloviční sčítačka | Past s Rozcestím a kvíz fungují. Kvízy jdou uhodnout podle délky (D-IV-07). | Kodex značí přenos C (D-IV-22), titul prozradí jméno (K-IV-19). | Nejlepší chyba patra. Poslední replika zanikne (H-IV-05). |
| IV-2 Úplná sčítačka | Zkoumání dobře postavené. Dvě řešení, Echo jmenuje jen Rozcestí (D-IV-04). | Kodex správně. Echo vždy řekne „Rozcestí“ (K-IV-18). | Výluka v kameni přenosu projde (H-IV-11), replika k osmé kombinaci zanikne (H-IV-05). |
| IV-3 Řetěz sčítaček | Dobré lešení. Nápověda 2 „nic nepřitéká“ místo stínu (D-IV-14). | Jediné řešení, kvízy správně. Kodex jen „ripple-carry“ (K-IV-21). | Úvod točitého kamene funguje. Vysvětlení třetí úlohy zanikne (H-IV-05). |
| IV-4 Porovnávač | Navazuje na Rovnost z III-6. Nápovědy vedou k řešení první úlohy (D-IV-03), kvíz opakuje IV-3 (D-IV-21). | Echo posílá hledat řádek, který není vidět (K-IV-15). Indexy (D-IV-09). | Zkoumání zacelilo díru z playtestu. Poslední replika zanikne (H-IV-05). |
| IV-5 Výhybka | Nejsilnější formát patra. Echo předem odpoví na 4. cíl (D-IV-18). | Kodex správně. Totéž se 4. cílem (K-IV-17). | Vrchol základní cesty. Nápověda 2 řekne celé zapojení (H-IV-07). |
| IV-6 Rozdělovač | Dobré odebírání lešení. Ukázka postaví celý stroj bez důvodu (D-IV-05). | Kvíz správně. Sedmisegmentový displej v Kodexu nesedí (K-IV-22). | Druhá úloha je osmkrát stejné rozhodnutí a v IV-7 přijde znovu. Na telefonu 22 px mezi kameny (H-IV-21). |
| IV-7 Brána Hlubiny | Losování brání opisování. „(a vlož runu)“ nesedí (D-IV-25). | Vždy jediné řešení, po bráně poctivé oznámení konce prototypu. | Zkouška navíc ve 48 % jiný stroj (H-IV-04), zkratka obejde tři stroje (H-IV-08). |
| IV-8 Ozvěna | Cíle odhalí paměť před jménem. Tabulka zkoušky paměti nevysvětlená (D-IV-11). | Chybí zakázaný stav S = R = 1 (K-IV-07), Echo přehání (K-IV-14). | Nejsilnější aha patra. Nápověda 2 řekne řešení (H-IV-07). |
| IV-9 Tep Srdce | Krystal T a tlačítko Tep jako totéž (D-IV-24). „Tep a ozvěna převzala“ (D-IV-17). | Úroveň proti hraně (K-IV-01), hláška o chybě, která nenastane (K-IV-02). | Pořadí dává smysl. Srdce Observatoře zazní poprvé, bez přípravy (H-IV-09). |
| IV-10 Registr | Pochopení vyplyne z cílů, ×2 z Přílivu. | Kvíz i Kodex správně. | Cíle jasné. Čísla ozvěn se pletou s vahami lamp (H-IV-06). |
| IV-11 Počítadlo hvězd | Baví, přetečení navazuje na II-5. Vysvětlení kvízu ve 3 z 12 losů špatně (D-IV-02). | Kodex správně, kvíz viz D-IV-02. | Texty mluví o krystalech, které počítadlo nemá (H-IV-17). |
| IV-12 Odčítačka | Stojí na nepovinné II-13 (D-IV-01). Nápověda 2 ve druhé úloze vede ke špatnému přenosu (D-IV-03). | Odborně správně, stojí na II-13 (K-IV-09). | Silná pointa. Dvě různé „1“ u jedné sčítačky (H-IV-06). |
| IV-13 Volič operace | Začíná nejtěžší podobou (D-IV-13). Kvíz zkouší libovolné přiřazení kódů (D-IV-08). | ALU bez aritmetiky (K-IV-05). „Vstup A“ výhybky (K-IV-25). | Opravdová hádanka (256 možností). Zadání stejné pro obě úlohy (H-IV-16). |
| IV-14 Násobička | Poznámky A₂ × B₁ pomáhají, indexy ale nesedí s Kodexem (D-IV-09). | Zapojení správně, dvě řešení v pořádku. Stojí na II-10 (K-IV-09). | Pro hráče bez II-10 je odkaz „jako v Násobení po lumenitsku“ prázdný (H-IV-10). |
| IV-15 Velká brána Hlubiny | Skutečná syntéza. Zájmeno „ho“ v zadání (D-IV-16). | Kvíz je rozdíl kombinační/sekvenční bez těch slov (K-IV-08). Kodex přehání (K-IV-06). | Nápověda 2 prozradí řešení, los ho nemění (H-IV-12). Hra po ní neskončí (H-IV-09). |

## 4. Témata napříč hrou

Témata spojují celkové pohledy recenzentů a jejich názorové nálezy. Priorita je u každého recenzenta zvlášť (D / K / H), pomlčka znamená, že téma neotevřel.

| # | Téma | D | K | H |
|---|---|---|---|---|
| 4.1 | Zkratka do brány přeskakuje nové pojmy | hned | hned | hned |
| 4.2 | Ukázka kroku radí proti pojmu komnaty | hned | hned | hned |
| 4.3 | Chyba bez odezvy a nerovná cena nápovědy | hned | hned | hned |
| 4.4 | Repliky a hlášky, které neplatí | hned | brzy | hned |
| 4.5 | Generátory obcházejí podmínky z PLAN 3.5 | hned | brzy | hned |
| 4.6 | Čtečka obrazovky | hned | – | hned |
| 4.7 | Doklad o zvládnutí a výstupy pro učitele | hned | hned / brzy | – |
| 4.8 | Pravidla pro herní texty | hned | brzy | brzy |
| 4.9 | Pořadí pojmů a předpoklady | hned | brzy | později |
| 4.10 | Doplněk, přetečení a záporná čísla | brzy | brzy | – |
| 4.11 | Slovník a značení | brzy | brzy | brzy |
| 4.12 | Kodex jako tištěné shrnutí | – | brzy | – |
| 4.13 | Kvízy | brzy | hned | – |
| 4.14 | Opory a nápovědy prozradí objev | brzy | – | hned |
| 4.15 | Telefon a dotyk | – | – | brzy |
| 4.16 | Komnaty bez rozhodnutí a křivka obtížnosti | později | – | později |
| 4.17 | Konec hry, příběh a měření posunu | – | později | brzy |

### 4.1 Zkratka do brány přeskakuje nové pojmy

fastGate pouští k bráně po komnatách 1–3 v každém patře. V patře I to jsou napodobení vzorů a kombinace, takže brána čtení a zápisu přijde bez vah a převodů. Kodexy vaha, prevod a cteni zůstanou zamčené a Strážce schodů se pak ptá na qRead a qWrite. V patře III zkratka obejde Výluku, desku zákona, NAND, NOR a větvení, na kterých stojí brána i patro IV. V patře IV podle kritika přeskočí porovnávač, výhybku a rozdělovač, tři ze čtyř strojů brány.

Všichni tři chtějí zkratku pro silné hráče zachovat (playtest 4.7), návrhy se liší. D: podmínit ji komnatami se záznamem Kodexu, které brána zkouší, nebo ji v patrech I a III vypnout. K: krátká zkouška na pojmy komnat 4–6 (v patře I qRead a qWrite), nebo po bráně přeložit i přeskočené Kodexy a připomenout je Echem. H: výběr komnat zadat v ActDef pro každé patro zvlášť.

Komnaty: I-7, III-7, IV-7, nejspíš II-7. Nálezy: H-I-01, D-III-01, K-I-13, H-IV-08.

### 4.2 Ukázka kroku radí proti pojmu komnaty

Třetí stupeň nápovědy bere nejčastěji slabší žák a jako jediný stojí pečeť odvahy. Text nesedí se zvýrazněním v I-9 (D-I-01), II-12 (K-II-02) a při zkoumání v III-6 (D-III-03). Jinde jde ukázka proti nápovědě 2 a Kodexu: Tichý krok zrcadlí podle pravého krystalu (D-I-05, K-I-04), glyfy počítá desítkově (D-I-12, K-I-05). Ze slepé uličky slibuje cestu (D-I-06), v II-14 radí cestu delší než zbylý limit (D-II-31), na hotové desce Kaskády vezme pečeť za nic (D-II-05). Bez důvodu je v Počítadle (D-II-03) a u točitých kamenů (D-III-08, H-III-14, D-IV-05), v Dílně jedna žádost postaví celý stroj. Dva Obraceče nerozliší (K-III-19) a čtečce neřekne, kde je zvýraznění (H-IV-14).

Společný návrh: tah vybírat pro cíl, o kterém text mluví, a text skládat z vybraného tahu. Ze slepé uličky říct pravdu, na hotové desce poslat k Potvrdit bez ztráty pečetě. Pro každou komnatu test, který hraje jen podle ukázky od startu i z typických chybných stavů a porovná zvýrazněný prvek s textem.

Komnaty: I-3, I-9, I-11, I-13 až I-15, II-1, II-12, II-14, Kaskáda II-0 až II-15, III-6 až III-8, III-11, III-15, Dílna IV.

### 4.3 Chyba bez odezvy a nerovná cena nápovědy

PLAN 3.4 slibuje, že chyba nikdy není jen „špatně“. Na několika místech ale nevyvolá nic. Zápis v Nápisu nemá Potvrdit ani hlášku a jde najít naslepo (D-I-02). II-11 se splní sama jedinou pákou (D-II-22). U strojů s pamětí hláška řekne krok, ale ne co stroj udělal, a paměť jde vynulovat jen smazáním celé komnaty (D-IV-06).

Jinde pomoc stojí víc, než má. V „najdi všechny kombinace“ se stupeň nápovědy nuluje po každé kombinaci, ukázka v Tichém kroku stojí 45 stisků (H-I-05). Překlep v Tichém kroku smaže cestu bez Zpět (H-I-06). Kaskáda odmítá správný výsledek textem, který zní jako chyba, ve všech úlohách II-3, II-4 a II-12, když hráč zapisuje výsledek před přenosem (H-II-04). Řetěz výpůjček jde jen zleva proti „Začni vpravo“ (H-II-11, D-II-15). Pořadí z nápovědy v III-2 až III-4 stojí pečeť přesnosti (H-III-16). Naopak opakované potvrzení v Kaskádě řekne, co rozsvítit, a funguje jako ukázka zdarma (D-II-06, D-II-07).

Návrhy: zápisu dát Potvrdit, hlášku z readSlip a událost, která rozzáří Nápovědu. Automatickou pomoc spouštět i po tazích nad dvojnásobek ideálu (D). U paměti ukázat skutečné lampy vedle očekávaných a přidat tlačítko „Od tmy“. U cíle „najdi všechny“ držet stupeň nápovědy. Odmítnutí v Kaskádě formulovat jako „nejdřív přenos“.

Komnaty: I-3, I-7, I-10 až I-15, II-3, II-4, II-8, II-11, II-12, III-2 až III-4, IV-8 až IV-11, IV-15.

### 4.4 Repliky a hlášky, které neplatí

Zásadu z generators.ts:4 a PLAN 3.5, že komentovaná úloha zůstává pevná, hra porušuje v II-13 (D-II-26, K-II-03), III-14 (D-III-11), II-8 (D-II-16), II-11 (D-II-23), IV-11 (D-IV-02), II-4 (K-II-07) a IV-7 (H-IV-13). Po zkoušce navíc nesedí počty úloh (D-I-14, K-II-20). IV-2 má dvě řešení a Echo zná jedno (H-IV-11, D-IV-04, K-IV-18). I-11 chválí „ani jeden krok navíc“ i po resetu (H-I-07).

echo.say frontu replik nahrazuje, takže replika kroku zmizí, když step a complete přijdou spolu: sedm v patře IV (H-IV-05), III-12 (H-III-17), I-4 (D-I-04). Hlášky po chybě míří jinam, než chyba je: IV-9 (K-IV-02), IV-4 (K-IV-15), IV-15 (K-IV-16), Prapečeť (K-III-02), IV-11 (H-IV-17), IV-3 (D-IV-14). Nápovědy a zadání jsou jedny pro celou část, druhá úloha tak dostane rady k první (D-IV-03, D-III-03, D-IV-25, H-IV-16).

Návrh: v sayComplete a nextPart echo.add. Repliky k losům skládat z dat úlohy nebo psát bez čísel. Nápovědy a zadání dovolit po úlohách. Hlášky po chybě vybírat podle kroku, kde zkouška padla. Test přes mnoho semínek, který hlídá podmínky replik (simulace recenzentů to umějí).

Komnaty: I-4, I-7, I-11, II-4, II-7, II-8, II-11, II-13, III-6, III-11, III-12, III-14, IV-1 až IV-4, IV-6, IV-7, IV-9, IV-11 až IV-13, IV-15.

### 4.5 Generátory obcházejí podmínky z PLAN 3.5

PLAN 3.5 slibuje, že generátory drží podmínky pevných úloh. Váhy Osudu ale skoro vždy podstrčí úlohu se shozením světla přes levý okraj (D-II-30). Větvení se dvěma Obraceči v III-6 a III-7 vyzradí objev III-8, proti PLAN.md:367 (D-III-02, K-III-04). Souměrné nápisy schovají zrcadlové čtení (D-I-11, H-I-25, K-I-24). Recenzenti to měří různě: D uvádí aspoň jeden souměrný holý nápis ve 49,8 % průchodů I-6, H 28 % souměrných nápisů, K 5,5 % losů, kde zrcadlo neodhalí ani jeden. Velká brána III-15 dá v polovině losů nejlehčí Prapečeť (H-III-15). IV-15 má při každém losu stejné řešení (H-IV-12). IV-7 umí vylosovat pořadí 0123 (H-IV-13) a po výhybce přidat rozdělovač (H-IV-04). III-5 a III-9 dávají vyplňovat desku s odkrytou lampou (H-III-10).

Návrh: v distanceNoWrap vyloučit i spill 'left'. Větvení losovat s Obracečem na jednom vstupu. U holých nápisů vylučovat souměrné hodnoty. U každého generátoru testovat i podmínky, na kterých stojí text a nápovědy, ne jen řešitelnost.

Komnaty: I-6, I-7, II-14, II-15, III-5, III-6, III-7, III-9, III-15, IV-7, IV-15.

### 4.6 Čtečka obrazovky

Repliky Echa nejsou v živé oblasti a u vícedílné repliky přebije text aria-label „Další replika“ (H-I-02, H-II-03, H-IV-15). Hráč se čtečkou tak přijde o úvody, objevy a diagnózy chyb, v patře II i o část pravidel. V Prapečeti dostává nepravdivý stav lampy (H-III-03). V Dílně neslyší lampy u nové kombinace (H-IV-01). Naopak II-11 a II-13 mu prozradí podíl nebo doplněk, který kolo skrývá (H-II-08). U vzorů v I-1 a I-2 slyší desítková čísla dřív, než je hra zavede (H-I-03). Nesedící řádky brány jsou poznat jen barvou (H-III-21). Příliv čísluje krystaly zleva, Kaskáda zprava (H-II-15). Glyf čtečka nepopíše (D-I-23) a v Dílně hlásí „lampa lampa“ (H-IV-20). V I-15 ohlásí čtení, i když první úloha Oktávy je zápis (H-I-19). Drobnosti má i u Desky a šifry (H-III-26).

Návrh: repliky posílat i do announce, „dál“ udělat jako samostatné tlačítko, hlášení jedné akce skládat za sebe místo přepisování.

Komnaty: celá hra, hlavně I-1, I-2, I-13, II-7, II-11, II-13, II-15, III-11, III-15, IV-0, IV-2, IV-4, IV-5.

### 4.7 Doklad o zvládnutí a výstupy pro učitele

Učitel hru vidí přes pracovní list, přehled třídy a Shrnutí patra a právě tam ho chyby mýlí. List patra I má 2 otázky o 2ⁿ (K-I-01), protože základ po I-3 nemá kvíz (K-I-02). List III nemá symbolický zápis ani tabulku (K-III-09), list IV se mezi variantami liší jedinou otázkou a Hlubší síně list nemají (K-IV-12, K-II-15). II-8 nemá kvíz (K-II-16, D-II-18). „Teď v komnatě“ ukazuje komnatu, kde student není (K-I-06), a rozehrané komnaty se počítají jako zaseknuté (K-I-07). Shrnutí Hlubších síní I popisuje Počítadlo (D-I-15), shrnutí základu má příklad s vahami, které základ neukazuje (D-I-22), a Strážce slibuje „zákony z minulého patra“ (H-III-20, K-IV-23).

Z PLAN 1.1 učitel nevyčte, co pokrývá základní cesta (K-IV-10, K-I-11, K-III-11). Mapování na hodiny a RVP chybí (K-I-12, K-II-23, K-III-21). Kurikulista orientačně řadí patra I a II k datům, informacím a modelování, patro III k digitálním technologiím a výrokové logice v matematice, patro IV k digitálním technologiím. Znění výstupů je potřeba ověřit.

Priorita se liší: D řadí výstupy pro učitele „hned“, K dává „hned“ dokladu o zvládnutí a „brzy“ kartě patra a PLAN 1.1. Návrhy: qRead a qWrite do I-5 až I-7 a do listu I, otázka na zápis výrazu do III-4 až III-6 a tabulka do listu III, list s přepínačem základ / vše, „Teď v komnatě“ z poslední otevřené komnaty a v Shrnutí patra blok komnata → pojem → zápis → otázka → čas → výstup RVP.

Komnaty: I-3 až I-7, I-15, II-8, III-1 až III-7, IV-1 až IV-7, přehled třídy, Shrnutí patra, Strážce schodů III a IV, PLAN.

### 4.8 Pravidla pro herní texty

„Postavíš ho“ v III-10 je výslovně zakázaný obrat (D-III-05). „Sám“ v II-8 a III-6 je regrese proti PLAYTEST.md:382 (D-II-14, D-III-12), k tomu „abys prošel“ v I-11 (D-I-17). Hláška po špatné runě má pevně ženský rod (D-III-04). Zájmena bez jasného předmětu: I-1, III-7, IV-15, IV-5 (D-I-18, H-III-18, D-IV-16, H-IV-18). Šablony bez shody s číslovkou: „v 1 řádku … podle nich“ (D-III-18, D-IV-15), „jsou jen 1 stín“ (K-I-14), „Zhasne 2 jedniček“ (D-II-04), „o 1, 2, 3 míst“ (H-II-21), „se slila pět světel“ (K-II-10).

Kritik řadí jednořádkové opravy do první várky, didaktik je dává „hned“. Návrh: plural() z quizzes.ts ve všech šablonách, věty o runách s lampou jako podmětem a test, který šablony vyrenderuje pro k = 1 až 5 a projde obsah seznamem zakázaných obratů.

Komnaty: I-1, I-9, I-11, II-1, II-4, II-8, II-12, II-14, III-5 až III-7, III-9, III-10, III-15, IV-1, IV-5, IV-15.

### 4.9 Pořadí pojmů a předpoklady

Pilíř „jeden nápad na komnatu“ porušuje III-6, která přináší řetězení, Rovnost a větvení naráz (D-III-09). Losované větvení chce De Morgana dřív než III-8 (D-III-02, K-III-04). IV-12 stojí na nepovinné II-13 a IV-14 na II-10 (D-IV-01, K-IV-09, H-IV-10). Ověřovatel upřesnil, že hráč v IV-12 neuvízne, chybí jen odvození. Váhy Osudu chtějí shodit světlo přes okraj, což předtím nic neučí (D-II-30). Pojmy přicházejí dřív, než se zavedou: Grayův kód v kvízu I-11 (D-I-16), oktáva v kvízu I-3 (H-I-26), oktáva, AND a přenos v Kodexu I (D-I-22). Kodex Řetězů prozradí pointu Prapečeti o pět komnat dřív (D-III-15). Tabulku složeného obvodu žák poprvé počítá až v bráně III-7 (K-III-10, D-III-06). Rovnost má na základní cestě jen lumenitské jméno (K-III-12) a De Morgan je jen v nepovinné III-8 (K-III-11). Několik textů odkazuje na nepovinné komnaty (D-III-23).

Návrh: pravidlo „Hlubší síně staví jen na základních cestách“ zapsat i pro patro IV. V III-6 losovat jen jeden Obraceč. Test, který pro každou komnatu ověří, že runy v nabídce a odkazy na jiné komnaty leží na cestě, která k ní vede.

Komnaty: I-3, I-11, II-14, III-6 až III-8, III-11, III-12, IV-12, IV-14.

### 4.10 Doplněk, přetečení a záporná čísla

II-13 počítá modulo 16, ale vydává se za počítání se zápornými čísly. Kodex říká, že nejvyšší bit nese znaménko, horní řada a kvíz qComplementSum ale čtou 1001 jako 9 (K-II-03, D-II-27). Rozsah −8 až 7 ani přetečení se znaménkem nikde nezazní (K-II-04). „Přetečení“ je v II-3 přenos, v II-5 ztráta a v II-13 zahozený přenos, díky kterému vyjde správný rozdíl. To je přesně záměna carry a overflow (D-II-09, K-II-05). Zápisník ukazuje doplněk jako 13, ne jako −3, a odčítání jako „7 + 13 = 20 → 4“ (K-II-17, H-II-13). Kodex píše řetěz „12 + 6 = 18 − 16 = 2“ (D-II-12).

Návrh: v II-13 i v qComplementSum držet rozsah čtyřbitového doplňku (a 1–7), nebo jednou větou odlišit čtení se znaménkem a bez něj. Do Kodexu doplnit rozsah a přetečení se znaménkem. V II-3 a II-13 psát „přenos“, slovo „přetečení“ nechat jen nádobě. V IV-12 krátce připomenout doplněk.

Komnaty: II-3, II-5, II-13, IV-12, Kodex Přetékající nádoba a Doplněk.

### 4.11 Slovník a značení

Podle PLAN 2.3 má jedno lumenitské slovo odpovídat jednomu modernímu pojmu. Ve hře ale „odliv“ znamená posun i odčítání (H-II-07, D-II-13, K-II-06), „váha“ váhu řádu i hodnotu čísla (K-I-09), „parita“ sudost i paritní bit (K-I-08), „světlo“ vstup i hodnotu 1 (K-III-07) a „hodiny“ takt i stopky (K-IV-21). Dolní index je váha, pořadí od nuly i základ soustavy (D-IV-09, K-IV-04). „·“ je násobení i oddělovač vzorců, přenos je jednou C, jindy P, a dělení se píše „÷“ i „:“ (K-IV-20, K-II-14, K-III-14, D-IV-22). Dál akt a patro (H-I-21), „brána“ v komnatách, které branou nejsou (D-I-27, D-II-08), kolíky výhybky A a B proti krystalům A a B (D-IV-12, K-IV-25, H-IV-23) a číslice na točitém kameni ve dvou významech (H-IV-06). V patře IV moderní jména nepřevažují, ačkoli to PLAN 2.3 slibuje, a titulky je prozradí dřív než Kodex (K-IV-13, K-IV-19).

Návrh: do PLAN krátký slovníček pojmů a značek (jedno slovo, jeden pojem) a podle něj projít obsah. Vzorce oddělovat středníkem, indexovat podle váhy. Od patra IV psát po překladu oba názvy, např. „Výluka (XOR)“.

Komnaty: celá hra, hlavně I-9, II-3, II-6, II-8, II-15, III-1, IV-1, IV-2, IV-4, IV-13 až IV-15 a Kodex.

### 4.12 Kodex jako tištěné shrnutí

Shrnutí patra tiskne moderní část Kodexu, takže ji učitel rozdá jako výklad. Kurikulista navrhuje zpřesnit: úroveň a hranu u tepu (K-IV-01), procesor bez řadiče a s pamětí uvnitř (K-IV-06), ALU bez aritmetiky (K-IV-05), chybějící zakázaný stav S = R = 1 (K-IV-07) a slova kombinační a sekvenční (K-IV-08). Neprolomitelná šifra je slíbená bez podmínky délky klíče (K-III-08, D-III-10), dekodér je ukázaný na sedmisegmentovém displeji (K-IV-22, D-IV-23) a věta o čipech „hlavně z NAND“ zjednodušuje praxi (K-III-17). Shrnutí Hlubších síní I nesedí s patrem (D-I-15). Chybí školní termíny řád, základ soustavy, binární, hexadecimální a kB proti KiB (K-I-09, K-I-22), převod dělením dvěma je jen v netištěné části (K-I-10). U Rovnosti chybí XNOR (K-III-12), chybí i značky Ā, ⊕ a název logický součin (K-III-13). „Proud, nebo žádný proud“ zjednodušuje (K-I-27).

Komnaty: Kodex k I-1, I-5, I-8, I-15, III-6, III-11, III-13, IV-4, IV-6, IV-8, IV-9, IV-13, IV-15, Shrnutí patra.

### 4.13 Kvízy

Losované kvízy jsou vzorné: čísla se losují a typická chyba má vlastní vysvětlení. Žádná z 39 pevných otázek v act1.ts až act4.ts ale pole why nemá. V patrech III a IV jdou pevné otázky projít vylučováním a podle délky, správná odpověď bývá nejdelší (D-III-14, D-IV-07, H-III-19). Dvě vysvětlení jsou věcně špatně (D-I-03, D-IV-02). Část otázek zkouší něco jiného, než komnata procvičila: převod ×16 v I-14 (D-I-20), jen písmena A až F v I-13 (D-I-21), libovolné přiřazení kódů v IV-13, jehož pravidlo během kvízu není vidět (D-IV-08), dvakrát totéž v IV-3 a IV-4 (D-IV-21). II-8 ani II-15 kvíz nemají (D-II-18, D-II-32, K-II-16). Otázka o bajtu v II-5 je dvojznačná (D-II-11) a jeden distraktor v II-12 je hodnotově pravdivý (D-II-25).

Návrh: ke každé pevné otázce why pro nejčastější omyl, distraktory brát z mylných představ, vyrovnat délky odpovědí. Do II-8 dát qSubtract, do II-15 qRemainder a qComplementSum.

Komnaty: I-3, I-11, I-13, I-14, II-5, II-8, II-12, II-14, II-15, III-4, III-6, III-11, III-13, III-14, IV-1, IV-3 až IV-5, IV-8, IV-9, IV-11, IV-13, IV-15.

### 4.14 Opory a nápovědy prozradí objev

V I-8 a I-9 se vrací živý součet s rozdílem k cíli, takže skryté váhy prozradí jeden dotek a sudost jde řešit desítkově (D-I-09, D-I-10, H-I-14). Desku zákona hráč opisuje z lampy až do III-5 i v III-9 a bez lampy ji poprvé píše ve zkoušce III-7 (D-III-06, H-III-10, K-III-10). Nápověda 1 v I-5 prozradí odhad (D-I-24), nápověda 2 v II-9 pointu (D-II-19) a v patře IV často celé zapojení (D-IV-20, H-IV-07). V III-9 jsou stupně nápověd obráceně (D-III-13). Jiné nápovědy opakují, co vynucuje ovládání (D-I-08, D-III-22, K-I-21, H-I-13). „Desku znám“ přeskočí zkoumání Důsledku (D-III-16, H-III-25), Echo v IV-5 odpoví na 4. cíl předem (D-IV-18, K-IV-17) a v I-3 ukáže počet osm výklenků (D-I-07).

Návrh: v I-8 a I-9 součet bez rozdílu, v III-5 zahalená lampa, nápověda 2 jako princip, zapojení až ve 3. stupni, „Desku znám“ jen pro známé runy.

Komnaty: I-3, I-5, I-8, I-9, II-9, III-2 až III-5, III-9, III-10, IV-5, IV-8 až IV-12, IV-15.

### 4.15 Telefon a dotyk

Široké desky se podle kritika na telefonu nevejdou. II-10 přesáhne 360 px (H-II-16). V Zahradě je lampa řetězů a větvení za okrajem (H-III-11). V Dílně se 30 z 34 desek posouvá a točité kameny u jednoho Pouta mají středy 22 px od sebe (H-IV-21). Oktáva se zalomí do dvou řad a čtení zprava ztratí oporu (H-I-20). Zadání ukazují „brána vpravo“ i tam, kde je panel pod deskou (H-III-12). Krystaly přenosu mají 40 px místo 44 px (H-II-24). V Tichém kroku smaže dvojité ťuknutí celou cestu (H-I-06). Texty říkají „Klikni“ (H-I-23). Rozměry jsou spočítané z CSS, je potřeba je ověřit na skutečném telefonu.

Návrh: na úzkém displeji zmenšit rozteč sloupců místo celé desky, panel s cílem jmenovat místo ukazovat směrem, návrat na předchozí kombinaci brát jako krok zpět.

Komnaty: I-10 až I-12, I-15, II-4, II-10, II-12, III-6 až III-8, III-10, III-11, III-13, III-14, patro IV.

### 4.16 Komnaty bez rozhodnutí a křivka obtížnosti

Několik komnat hráči nedá nic rozhodnout ani předpovědět, takže aha přijde jako sdělení. II-11 má jedinou páku (D-II-22, H-II-05). Otázku „Kolik jedniček to bude?“ v II-13 hra nikdy nepoloží a dvě ze tří zkoušek jsou bez rozhodnutí (D-II-29, H-II-09). III-14 ukazuje hotovou desku (D-III-07). Ponaučení „klíč se nepoužívá dvakrát“ v III-13 hráč nezažije (D-III-10). IV-12 doplněk na stroji neodvodí (D-IV-01).

Kritik přidává křivku. Zahrada jde od III-0 do III-5 skoro bez odporu. IV-6 a hned IV-7 opakují osm stejných rozhodnutí rozdělovače. Síně I a II ředí I-8 (H-I-14) a dril I-12 (H-I-27). Velké brány nestupňují: I-15 je menší než komnaty před ní (H-I-15), III-15 bývá náhodou lehká (H-III-15), řešení IV-15 prozradí nápověda 2 a los ho nemění (H-IV-07, H-IV-12). IV-13 začíná nejtěžší podobou (D-IV-13), II-15 zkouší jen tři ze sedmi síní (D-II-32) a po bráně mapa další síň neoznačí (H-I-24).

U III-14 se recenzenti rozcházejí. Didaktik ji má za poznávání runy v převleku. Kritik oceňuje, že je zjednodušení vidět. Didaktik chce mechaniky měnit až po opravách textů, generátorů a ukázky kroku, kritik téma také řadí na později. Návrhy: předpověď před akcí (tip počtu v I-3 a II-13, odhad podílu a zbytku v II-11), zakrytá cílová deska v III-14, velké brány o krok těžší než komnaty před nimi, na mapě označit první otevřenou síň.

Komnaty: I-3, I-8, I-12, I-15, II-11, II-13, II-15, III-0 až III-6, III-13, III-14, III-15, IV-6, IV-7, IV-12, IV-13, IV-15, mapa.

### 4.17 Konec hry, příběh a měření posunu

Po IV-7, kam dojde většina třídy, i po IV-15 přijde obyčejná vítězná deska se „Zpět na mapu“ (H-IV-09). Srdce Observatoře se poprvé objeví až v nepovinné IV-9. Slib z I-5 se splní jen v nepovinné I-13 a slova {{ticho}} a {{věky}} se nepřeloží nikdy (H-I-22). Echo v patře IV opakuje formule a spíš vykládá, než se ptá (H-IV-24). Kurikulista k tomu dodává, že zkouška zasvěcení z PLAN 3.8 ve hře není a výsledky Strážce schodů se nikam neukládají, takže učitel nemá jak změřit posun (K-IV-11, K-I-26).

Priorita se liší: kritik chce závěrečnou kartu brzy, kurikulista řadí výstupní test „později“. Návrhy: závěrečná karta po IV-7 i po IV-15 (Srdce se poprvé pohne, souhrn pečetí, odkaz na Shrnutí patra). Srdce zmínit už v IV-0. Po IV-7 a IV-15 výstupní test z deseti losovaných otázek a výsledky ukládat do postupu a ukazovat v přehledu třídy. Generátory otázek Strážců (qRead, qWrite, qAdd, qShiftLeft, qRuneByRule, qTableRows) už existují.

Komnaty: I-0, I-5, I-13, IV-0, IV-7, IV-9, IV-15, mapa, přehled třídy.

## 5. Co funguje a má zůstat

- **Objev před pojmenováním** (všichni tři): nulté komnaty, rozdělená deska v I-3, dopočet váhy v I-4 a I-5, II-0, II-2, II-6, II-9, III-1 až III-4 a cíle s Echem v IV-5 a IV-8 až IV-11. Kodex přeloží pojem až po klíčové komnatě.
- **Zachování světla v Kaskádě** (D, H). Krystal, do kterého nemá odkud přitéct světlo, se nerozsvítí, a hláška řekne proč. Pravidlo sloupce se naučí bez výkladu.
- **Opory mizí uvnitř komnaty a Echo to ohlásí** (všichni tři): I-6, II-2, II-4, v patře IV odebírání lešení v IV-3 a IV-6.
- **Hlášky, které pojmenují mylnou představu** (všichni tři): zrcadlové čtení, počet světel místo vah, jediný krystal vedle, prohozené glyfy, „není od čeho odečítat“ v II-8, čtyři světla v II-12, řádek, ve kterém by runa svítila jinak, okénko „Stroj se spletl“ s označeným řádkem.
- **III-8 Zrcadla a závoj lampy** (všichni tři). Dvě desky vyjdou stejně, Echo řekne „Zrcadlo!“ a teprve potom padne jméno De Morgan. V III-7 a III-8 se výsledek skládá z run.
- **Mosty mezi patry** (všichni tři): Výluka jako spodní číslice součtu, Horner z I-6 jako návod v II-9, Hlas většiny jako přenos, ×2 z Přílivu v registru, Rovnost v porovnávači, past s Rozcestím v IV-1, odečty čísel pod deskou až do patra IV.
- **Česká školní metoda odčítání** (K): výpůjčka pod menšitelem sousedního sloupce, „10 − 1 = 1“ a „10 − 1 − 1 = 0“.
- **Výroková logika blízko matematice a češtině** (všichni tři): nevylučovací „nebo“ (kino i divadlo), implikace jako slib, typická chyba „neprší a je mokro“, útok známým textem v III-13.
- **Ukázka kroku s důvodem tam, kde funguje** (D, H): váhy („Žádáno 11. Těžší krystaly dají 8, zbývá 3…“), Kaskáda a Příliv, deska a maska runu po runě, kámen se jménem runy a jejím zákonem.
- **Cena pomoci** (všichni tři): nápovědy 1 a 2 zdarma, pečeť odvahy bere jen ukázka kroku a zkouška navíc v bráně brání autopilotu. Férový ideál v Bráně a Dílně, kde je zkoušení vstupů zdarma.
- **Losované kvízy** (všichni tři) s vysvětlením typických chyb a míchaným pořadím možností. Otázka na barvu #FF8800 spojuje bajt s dnešním webem.
- **Věcná správnost a generátory** (K, D): tabulky, vzorce a klíče sedí. Řetězy v III-6 mají jediné řešení, III-10 právě dvě duální, brány IV-7 a IV-15 vždy jediné. Pevné komentované úlohy v II-2 až II-12 sedí na všechny losy.
- **Abstrakce jako mechanika** (všichni tři): úplná sčítačka v IV-3 a ozvěna v IV-9 se zabalí do jednoho kamene a nečitelné slovo „abstrakce“ z IV-0 se rozsvítí.
- **Hlubší síně s vlastní pointou**: I-9, I-11 (přísný Tichý krok), I-13 (glyfy na dveřích a šestnáctkové štítky na mapě), II-9, II-12, III-8, III-13 (slovo ECHO písmeno po písmenu), IV-15 jako skutečná syntéza.
- **Strážce schodů** (všichni tři): krátký, přeskočitelný, bez pečetí, s vysvětlením typické chyby u každé otázky.
- **Tón a ovládání** (všichni tři): Echo krátké, věcné, bez infantility a bez trestu. Ovládání je jednotné napříč patry (dotek, Potvrdit/Zkouška, Enter, H, T, Ctrl+Z, šipky).
- **Materiály pro učitele** (K, H): Shrnutí patra k tisku rozdělené na základ a Hlubší síně, přehled třídy, který nic neodesílá.
- **Myšlenka zkratky pro silné hráče** (všichni tři): opravit, ne zrušit.

## 6. Priority

1. **Zkratka do brány nesmí přeskočit komnatu, jejíž pojem brána zkouší.** Výběr komnat zadat pro každé patro zvlášť, nebo zkratku podmínit záznamy Kodexu. H-I-01, D-III-01, K-I-13, H-IV-08.
2. **Ukázka kroku musí zvýraznit to, o čem mluví, a jít postupem nápovědy 2.** Opravit I-9 a II-12, slepou uličku Tichého kroku, hotovou desku Kaskády a glyfy. Přidat test „hraj jen podle ukázky“. D-I-01, K-II-02, D-II-05, D-I-06, D-I-05, K-I-04, K-I-05, D-I-12, D-III-03, D-II-31, D-III-08, D-IV-05.
3. **Každá chyba musí vyvolat odezvu.** Zápis v Nápisu s Potvrdit, hláškou a automatickou pomocí. U strojů s pamětí ukázat, co stroj udělal, a dát „Od tmy“. D-I-02, D-IV-06, D-II-22, H-I-05, H-II-04.
4. **Generátory srovnat s texty a PLAN 3.5.** Váhy Osudu bez shození vlevo, větvení s jedním Obracečem, pevná −3 v II-13, holé nápisy bez souměrných hodnot. Test podmínek přes mnoho semínek. D-II-30, D-III-02, D-II-26, K-II-03, D-I-11, H-III-15, H-IV-13, H-IV-04.
5. **Repliky a hlášky, které neplatí.** echo.add místo say, repliky k losům bez čísel nebo z dat úlohy, hlášky po chybě podle skutečné chyby, nápovědy po úlohách. H-IV-05, H-III-17, D-I-04, D-III-11, D-II-16, D-II-23, D-IV-02, K-IV-02, K-IV-15, K-III-02, D-I-14, K-II-20, H-IV-11, D-IV-03.
6. **Čtečka obrazovky.** Repliky Echa do živé oblasti, wires do evaluate v Prapečeti, lampy v hlášce Dílny. H-III-03, H-I-02, H-II-03, H-IV-01, H-IV-15, H-II-08.
7. **Výstupy pro učitele.** Pracovní list patra I s qRead a qWrite, list s přepínačem základ / vše, „Teď v komnatě“ z poslední otevřené komnaty, PLAN 1.1 rozdělený na základ a Hlubší síně, karta patra s časem a RVP. K-I-01, K-I-02, K-I-06, K-I-07, K-III-09, K-IV-12, K-IV-10, D-I-15.
8. **Dávka textových oprav s testem.** Zakázané obraty, rod a zájmena, šablony s číslovkami přes plural(). D-III-05, D-II-14, D-III-12, D-I-17, D-III-04, D-III-18, D-IV-15, K-I-14, D-II-04, K-II-10, D-I-18, H-III-18, D-IV-16, H-IV-18.
9. **Pořadí pojmů.** III-6 rozdělit nebo odlehčit, IV-12 vysvětlit doplněk bez II-13, odstranit odkazy na nezavedené pojmy. D-III-09, D-IV-01, K-IV-09, D-I-16, D-I-22, D-III-15, K-III-10.
10. **Slovník a model záporných čísel.** Glosář „jedno slovo, jeden pojem“ (odliv, přetečení, indexy, C/P, „·“, akt/patro). Doplněk v rozsahu čtyřbitového doplňku. H-II-07, D-II-09, K-II-05, K-II-04, D-II-27, D-IV-09, D-IV-22, K-IV-20, H-I-21, K-IV-13, K-IV-19.
11. **Kvízy a Kodex.** Vysvětlení why u pevných otázek, distraktory z mylných představ, kvíz do II-8 a II-15. Odborná zpřesnění tištěného Kodexu. D-III-14, D-IV-07, D-I-03, D-II-18, D-II-32, D-IV-08, K-IV-01, K-IV-05, K-IV-06, K-IV-07, K-IV-08, K-III-08, D-II-12.
12. **Později: mechaniky a konec.** Komnaty bez rozhodnutí (II-11, II-13, III-14), velké brány těžší než komnaty před nimi, nápověda 2 v patře IV jako princip, závěrečná karta hry a výstupní test, desky na telefonu ověřit na přístroji. D-II-22, D-III-07, H-I-15, H-IV-07, D-IV-20, H-IV-09, K-IV-11, H-III-11, H-IV-21.
