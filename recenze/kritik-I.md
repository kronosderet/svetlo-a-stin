# Herní kritik · patro I

Prošel jsem titulní obrazovku, mapu a komnaty I-0 až I-15 v pořadí, jak je potká hráč (definice v src/content/act1.ts, komponenty oltáře a nápisu, Level.svelte, vítězná deska, dveře). Skriptem jsem zahrál ideály, cesty podle ukázky kroku, typické omyly čtení, losování generátorů a kvízy. Skripty: scratchpad/sim/kritik-I/act1.test.ts a extra.test.ts.

## Komnaty
- **I-0 Probuzení:** Výborný začátek: z titulky („Vstoupit do observatoře“) rovnou do komnaty, jeden dotek a hned světlo. Slova {{ticho}} a {{věky}} nemají klíč a nikdy se nepřeloží (H-I-22). Nápověda 2 říká „Klikni“, na telefonu je to dotek (H-I-23).
- **I-1 Ticho:** Tři doteky, svítí a mlčí, krátké a čisté. Nápověda 2 „rozsviť ho“ gramaticky míří na krystal ve stěně (H-I-12). Čtečka slyší „Oltář žádá 0“ místo vzoru (H-I-03).
- **I-2 Dvě světla:** Čtyři vzory, ideál 6, rychlé. Repliky sedí na kombinace (01 = „pravá svítí, levá mlčí“). Stejný problém s hlášením „Oltář žádá 2“ jako v I-1.
- **I-3 Kolik kombinací?:** První opravdová hádanka a první aha: rozdělená deska po levém krystalu ukáže zdvojení. Pečeť přesnosti chce tichý krok (7 doteků, počítání 0 až 7 popořadě stojí 11). Nápověda 1 „Zkus měnit vždy jen jeden krystal“ nic neříká, dotek jinak ani nejde (H-I-13). Po každé nové kombinaci se nápověda nuluje (H-I-05). Vysvětlení v kvízu qCombosOf počítá o krok víc (H-I-09).
- **I-4 Váhy kamenů:** Nejlepší objevovací komnata patra: osamělý krystal prozradí váhu a dopočet ze součtu („6 − 2 = 4“) odměňuje uvažování. Velikost krystalů a živý součet drží pečeť přesnosti férovou.
- **I-5 Čtyři váhy:** Hladový postup s losovanými cíli (ideál 7 až 10). Echo nejdřív vyzve „Odhadni to dřív, než se rozsvítí“, a nápověda 1 hned prozradí „krystal o váze 8“. Drobnost, ale odhad tím ztrácí smysl.
- **I-6 Čtení nápisů:** Opory mizí postupně (2 nápisy s vahami, 1 s velikostmi) a repliky to přesně ohlašují. Cílené hlášky omylů (zrcadlo, počet světel, jeden krystal) jsou výborné. 28 % losovaných nápisů je ale souměrných, zrcadlové čtení tam vyjde správně (H-I-25).
- **I-7 Brána Předsíně:** Pořádná zkouška bez opor: zápis i čtení, ideál 12. Když brána po ukázce kroku přidá zkoušku navíc, Echo dál hlásí „Pět zkoušek“ a „Poslední zkouška“ (H-I-08). Přes „Zkusit bránu hned“ se sem dá dojít bez I-4 až I-6 (H-I-01).
- **I-8 Skryté váhy:** Pátý krystal je dobrý nápad, ale živý součet s rozdílem („chybí 3“) prozradí každou váhu prvním dotekem. Nepovinná výzva je tak lehčí než brána I-7 (H-I-14).
- **I-9 Sudé a liché:** Nejsvěžejší komnata patra: oltář chce druh čísla a hráč hledá, co mají čísla společného. Ukázka kroku ale u „Liché číslo“ zvýrazní levý krystal s váhou 8 a v textu mluví o pravém krystalu (H-I-04). V kvízu qTrailing je „Vpravo jsou jen 1 stín“ (H-I-10).
- **I-10 Nejvyšší světlo:** Bez vah i bez součtu na osmi krystalech. Replika „Jedna navíc zhasla pět krystalů a rozsvítila šestý“ je pěkné aha. Na telefonu se oktáva zalomí do dvou řad (H-I-20).
- **I-11 Tichý krok:** Nejlepší hádanka patra, nápověda se zrcadlem vede k Grayovu kódu. Trestá ale tvrdě: návrat na známou kombinaci smaže celou cestu a Zpět nejde (H-I-06). Kdo chce ukázku kroku, mačká Nápovědu 45× (H-I-05). Echo po resetu chválí „patnáct kroků, ani jeden navíc“ (H-I-07). V kvízu stojí „abys prošel“ (H-I-11).
- **I-12 Velký nápis:** Čtení a zápis na oktávě se třemi kotouči. Je to jen dril bez nového nápadu, kvízu a Kodexu (H-I-28). Panel „Brána žádá“ visí v komnatě, která bránou není (H-I-18).
- **I-13 Řeč glyfů:** Nejsilnější aha patra: hráč konečně přečte glyfy na dveřích a mapa pak ukáže čísla komnat šestnáctkově. Na kotouči je glyf i písmeno a Zápisník ukazuje „1010₂ = A₁₆ = 10“, takže kvíz na písmena je připravený.
- **I-14 Dvojznak:** Dobré rozšíření se zachycenou chybou „prohozené glyfy“. Hláška „ten s váhou 64“ ale míchá váhy oktávy do čtení po čtveřicích 8-4-2-1 (H-I-16). Otázka na barvu #FF8800 je přesná a z dnešního světa.
- **I-15 Velká brána Předsíně:** Tři zkoušky po sobě a přehled zkoušek nahoře funguje. Každá zkouška je ale menší než komnata, ze které vychází, takže vrchol nic nestupňuje. Po vyřešení nabídne deska jen „Zpět na mapu“ (H-I-15). Čtečka při přechodu na Oktávu ohlásí čtení, i když první úloha je zápis (H-I-19).

## Nálezy

### H-I-01 · patro I (I-7) · hratelnost · vysoká · jistá
**„Zkusit bránu hned“ v patře I přeskočí celé váhy**
Popis: Komu stačí pečeť přesnosti i odvahy v I-1 až I-3, tomu se otevře brána I-7. V patře I jsou ale I-1 až I-3 jen bit, světlo a stín a počet kombinací. Celý obsah, který brána zkouší, tedy poziční hodnotu, převod a čtení, učí až I-4 až I-6. Hráč tak přijde ke čtení a zápisu čísel bez jediné komnaty o vahách. Echo ho přivítá větou „Pět zkoušek, čtyři krystaly, žádné váhy ani součet“, ale on váhy nikdy neviděl. Záznamy Kodexu Váha světla, Hledání vah a Čtení nápisu zůstanou zamčené. Hned za bránou čeká Strážce schodů s otázkami qRead a qWrite (act2.ts:1033). V ostatních patrech dává pravidlo „1–3 v ideálu“ smysl, v patře I ne.
Doklad: progress.svelte.ts:161-169 (fastGate bere komnaty 1 až 3), :185; MapScreen.svelte:195 („Zkus bránu hned, zbytek můžeš dohrát později.“); act1.ts:265; act1.ts I-1 až I-3 bez vah (sizes 'equal', showSum false), váhy až od I-4 (act1.ts:116-148).
Návrh: V patře I zkratku vypnout. Nebo ji vázat na I-4 až I-6 (hráč, který zvládne I-4 a I-5 v ideálu, smí rovnou k bráně), případně FAST_ROOMS zadat pro každé patro zvlášť v ActDef.

### H-I-02 · celá hra (Echo) · přístupnost · vysoká · jistá
**Čtečka obrazovky Echa skoro neuslyší**
Popis: Repliky Echa nejsou v živé oblasti. Jediná oblast aria-live v komnatě je announcement v Level.svelte, a tam jdou jen nápovědy, ukázka kroku, přechod části a závěr. Úvody komnat a repliky po kroku čtečka sama nepřečte. Neuslyší ani hlavní didaktickou zpětnou vazbu: „Čteš zrcadlově. Nejtěžší krystal stojí vlevo.“, „Tolik světel svítí, to sedí. Každé ale váží jinak.“, „9 − 1 = 8. Kámen váhu dopočítal ze součtu.“ ani vysvětlení rozdělené desky v I-3. Při chybném čtení se ohlásí jen „Kotouče ukazují 3. Nápis váží jinak.“ Navíc bublina, za kterou čeká další replika, má aria-label „Další replika“. Ten přebije text bubliny, takže všechny repliky kromě poslední jsou pro čtečku němé i při procházení stránky.
Doklad: EchoBubble.svelte:39 (`aria-label={echo.hasMore ? 'Další replika' : undefined}`); Level.svelte:692 (jediná oblast aria-live); inscriptionEvents.ts:45 (slipLine jen přes echo.say), :48 (announce bez důvodu); altarEvents.ts:26 (dopočet jen v Echu).
Návrh: Text repliky dávat do announce (nebo do vlastní oblasti aria-live="polite" u bubliny). Na tlačítko dát aria-label „{text}, další replika“, nebo „dál“ udělat jako samostatné tlačítko.

### H-I-03 · I-1, I-2 · přístupnost · střední · jistá
**Při napodobování vzoru čtečka hlásí „Oltář žádá 2“**
Popis: U cílů typu pattern (stěna se vzorem) hlásí po splnění kroku čtečka desítkové číslo dalšího vzoru: v I-1 „Přijato. Oltář žádá 0.“, v I-2 „Přijato. Oltář žádá 2.“ Vidící hráč vidí reliéf ve stěně, ne oltář s číslem. Čísla navíc hra zavádí až v I-4, takže hláška předbíhá výuku i fikci.
Doklad: altarEvents.ts:70-74 (pattern spadne do větve `Oltář žádá ${upcoming}`); act1.ts:35, 57 (goal pattern); Altar.svelte:72-82 (vzor má popisek „Kombinace: světlo, stín“).
Návrh: U pattern hlásit „Přijato. Stěna ukazuje: {words(upcoming)}.“

### H-I-04 · I-9 · chyba · střední · jistá
**Ukázka kroku v Sudé a liché protiřečí vlastnímu vysvětlení**
Popis: Ukázka kroku u skupin čísel vybírá krystal podle nejmenšího zbytku do konce komnaty. Při shodě vyhraje nejtěžší krystal. Na začátku (0000, oltář žádá „Liché číslo“) proto zvýrazní levý krystal s váhou 8. Echo k tomu řekne „Liché číslo má rozsvícený pravý krystal, ten s váhou 1. … Zvýrazněný krystal rozsviť.“ Ukázka pak pokračuje krystalem 4 a teprve třetí krok je pravý krystal. Podobně u „Liché číslo menší než 6“ (z 1100) radí zhasnout i krystal 4, přestože text říká „zbytek musí vážit nejvýš 4“. Slabší hráč, který jde po ukázce, dostane opak toho, co komnata učí.
Doklad: altar.ts:228-231 (shoda vyhraje nejtěžší krystal); altarGame.svelte.ts:56-58 (text skupiny + „Zvýrazněný krystal rozsviť“). Skript extra.test.ts: `mask 0000 | oltář žádá: Liché číslo | zvýrazněný krystal 1. zleva (váha 8) rozsviť`, dál váha 4 a teprve pak váha 1; z 1100 „zhasni 8“, „zhasni 4“, „rozsviť 1“.
Návrh: U skupin brát jen krystaly, které vedou k nejbližšímu číslu aktuální skupiny, a při shodě dát přednost nejlehčímu krystalu (u lichosti pravému). Ideál par se tím nemění.

### H-I-05 · I-3, I-11, I-15 · hratelnost · střední · jistá
**V „najdi všechny kombinace“ se nápověda nuluje po každém kroku**
Popis: Oltář bere každou nově nalezenou kombinaci jako splněný cíl a vynuluje stupeň nápovědy. Kdo v Tichém kroku potřebuje ukázku kroku, mačká Nápovědu třikrát na každou z 15 kombinací, tedy 45×. Pokaždé si v Echu znovu přečte 1. a 2. stupeň („Vzpomeň si na Kolik kombinací…“, „Zrcadlo…“). Právě hráč, který se zasekl, má nejvíc zbytečných kliků.
Doklad: altarGame.svelte.ts:84-86 (`found` patří mezi `advanced` a pak `hintLevel = 0`); skript act1.test.ts: „I-11 by hint: moves 15 … clicks on Nápověda 45“.
Návrh: U goal 'all' držet stupeň nápovědy až do konce nebo do resetu. Pečeť odvahy se počítá jednou na komnatu stejně.

### H-I-06 · I-11 (i I-15, 1. zkouška) · hratelnost · střední · jistá
**Jeden překlep v Tichém kroku smaže celou cestu a Zpět nejde**
Popis: Ve striktním režimu každý návrat na známou kombinaci vymaže desku a vrátí krystaly na začátek. Zpět tu nikdy nefunguje, protože každý tah je nová kombinace a historie se maže. Na telefonu stačí omylem ťuknout dvakrát na tentýž krystal (návrat na předchozí kombinaci), a hráč přijde až o 14 kroků. Pravidlo „žádná dvakrát“ je jádro hádanky, ale trest za nechtěný dvojklik je nepřiměřený a na dotyku častý.
Doklad: altar.ts:121-125 (reset na `initial`, found = [to]); altarGame.svelte.ts:84-85 (historie se maže po `found`); act1.ts:413, 415.
Návrh: Návrat přesně na předchozí kombinaci brát jako krok zpět (počítá se do tahů, pečeť přesnosti padne), reset nechat jen pro starší kombinace. Nebo nabídnout Zpět o jeden krok po resetu.

### H-I-07 · I-11 · chyba · nízká · jistá
**Echo chválí „ani jeden krok navíc“ i po resetu**
Popis: Replika complete zazní při každém dokončení, i když hráč předtím cestu přerušil. Echo řekne „Šestnáct kombinací, patnáct kroků. Ani jeden navíc.“ a hned nato deska ukáže „17 kroků · ideál 15“ bez pečeti přesnosti.
Doklad: act1.ts:417; context.ts:43-46 (sayComplete bez podmínky); skript extra.test.ts: „complete after one reset: moves 17 par 15“.
Návrh: Repliku dát do `skill`, nebo ji ve hře podmínit `moves <= par`. Jinak napsat neutrálně: „Šestnáct kombinací, každá jednou.“

### H-I-08 · I-7 · chyba · nízká · jistá
**„Pět zkoušek“ a „Poslední zkouška“ neplatí, když brána přidá zkoušku navíc**
Popis: Po ukázce kroku přidá brána na konec další úlohu a Echo to slíbí („Na konec pak přibude ještě jedna podobná zkouška“). Pevné repliky ale dál tvrdí „Pět zkoušek…“ a po čtvrté úloze „Poslední zkouška: nejtěžší světlo čtyř krystalů.“, za kterou ještě jedna úloha přijde. Kosočtverečky ukazují šest úloh.
Doklad: baseGame.svelte.ts:169-182; Level.svelte:449; act1.ts:265, 267.
Návrh: Repliku step[3] vynechat, když `extraAdded`, nebo ji napsat bez „poslední“ („Teď nejtěžší světlo čtyř krystalů.“).

### H-I-09 · I-3 (kvíz qCombosOf) · chyba · střední · jistá
**Vysvětlení omylu vede k jiné špatné odpovědi**
Popis: U odpovědi 2ⁿ⁻¹ hra radí: „To je o jeden krystal míň. Zdvojuj n×, začni u jednoho krystalu se dvěma kombinacemi.“ Kdo začne u dvou kombinací a zdvojí n×, dostane 2ⁿ⁺¹, tedy další špatnou možnost v téže otázce. Pro 9 krystalů: 2 · 2⁹ = 1024, správně je 512.
Doklad: quizzes.ts:80; skript act1.test.ts: možnosti „512 / 256 / 1024 / 18“ s textem „Zdvojuj 9×, začni u jednoho krystalu se dvěma kombinacemi.“
Návrh: „To je o jeden krystal míň. Začni u jednoho krystalu se dvěma kombinacemi a zdvojuj za každý další, celkem (n − 1)×.“ Nebo „Začni u jedné kombinace (tma bez krystalů) a zdvojuj n×.“

### H-I-10 · I-9 (kvíz qTrailing) · text · nízká · jistá
**„Vpravo jsou jen 1 stín“**
Popis: Pro k = 1 vznikne nespisovná shoda „Vpravo jsou jen 1 stín.“
Doklad: quizzes.ts:724; skript act1.test.ts: otázka „0000 0010“ s textem „Vpravo jsou jen 1 stín.“
Návrh: Sloveso vybírat podle počtu („Vpravo je jen jeden stín.“), nebo psát „Stínů vpravo: k.“

### H-I-11 · I-11 (kvíz qGrayMoves) · text · nízká · jistá
**Oslovení v mužském rodě**
Popis: „Kolik doteků nejméně potřebuješ, abys prošel všech 8 kombinací…“ porušuje pravidlo rodově neutrálního oslovení.
Doklad: quizzes.ts:158.
Návrh: „Kolik doteků nejméně stačí na projití všech 8 kombinací řady 3 krystalů?“

### H-I-12 · I-1 · text · nízká · jistá
**Zájmeno „ho“ míří na krystal ve stěně**
Popis: V nápovědě 2 „Když krystal ve stěně svítí, rozsviť ho. Když mlčí, zhasni ho.“ je jediné podstatné jméno „krystal ve stěně“, který hráč přepnout nemůže.
Doklad: act1.ts:39.
Návrh: „Když krystal ve stěně svítí, rozsviť krystal na oltáři. Když mlčí, zhasni ho.“

### H-I-13 · I-3, I-11, I-15 · hratelnost · nízká · jistá
**„Jediná změna každým dotekem“ je pravidlo, které nejde porušit**
Popis: Dotek vždy přepne právě jeden krystal. Rada „Zkus měnit vždy jen jeden krystal“ (I-3, 1. stupeň) tak nic neříká a stupeň nápovědy přijde nazmar. Zadání I-11 a I-15 („Každým dotekem jediná změna a žádná dvakrát“) i nápověda I-11 („…pokaždé se změnil jediný“) mluví o podmínce, kterou ovládání splní samo. Skutečná výzva je neopakovat kombinaci. Hráč může hledat pravidlo, které neexistuje.
Doklad: act1.ts:95, 108, 399, 406, 578, 585.
Návrh: I-3, 1. stupeň: „Hledej, kterým dotekem vznikne kombinace, kterou deska ještě nezná.“ V zadání I-11 zdůraznit „žádná kombinace dvakrát“ a jedinou změnu nechat Kodexu jako vlastnost Grayova kódu.

### H-I-14 · I-8 · hratelnost · střední · pravděpodobná
**Skryté váhy prozradí živý součet**
Popis: Komnata stojí na tom, že váhy zmizely („Kolik asi váží? Zákon už znáš.“). Pod krystaly ale svítí „Tvé světlo váží X“ i s rozdílem „chybí N / o N víc“. Rozsvícený pátý krystal hned ukáže 16 a zbytek jde hrát na přihořívá. Nepovinná výzva je tak lehčí než brána I-7, která součet nemá.
Doklad: act1.ts:286 (showSum: true), 296-299; Altar.svelte:146-157; act1.ts:253 (I-7 showSum false).
Návrh: V I-8 vypnout showSum (nebo nechat jen kontrolu po přijetí). Pak „Váhy nosíš v hlavě“ (act1.ts:301) opravdu platí.

### H-I-15 · I-15 · hratelnost · nízká · jistá
**Velká brána je menší než komnaty před ní**
Popis: 1. zkouška je tichý krok na 3 krystalech (I-11 měl 4). Oktáva má 3 úlohy (I-12 měl 4), glyfy 3 dvojznaky (I-14 měl 5). Sudé a liché ani Nejvyšší světlo v bráně nejsou. Vrchol nepovinné cesty je opakování v menším. Po vyřešení nabídne deska jen „Zpět na mapu“, bez cesty dál a bez zmínky, že Hlubší síně patra jsou celé.
Doklad: act1.ts:576, 601-605, 634-638; levels.ts nextLevelId (pro I-15 vrací null); Level.svelte:75 (deepId jen pro bránu 7); LevelComplete.svelte:141-143.
Návrh: 1. zkouška na 4 krystalech, nebo navazující tichý krok od zadané kombinace. Přidat zkoušku „druh čísla“ z I-9 bez součtu. Na desce velké brány nabídnout „Další patro“, nebo aspoň větu o celém patře.

### H-I-16 · I-14 · didaktika · nízká · jistá
**Hláška o jednom krystalu míchá váhy oktávy do čtení po glyfech**
Popis: V Dvojznaku se čtveřice čte zvlášť („Každou čti zvlášť: 8, 4, 2, 1“). Když se hráč splete v jednom krystalu levé čtveřice, Echo řekne „Skoro. Liší se jediný krystal: ten s váhou 64.“ (nebo 128, 32, 16). V téhle komnatě taková váha nic neříká.
Doklad: inscription.ts:142-143; inscriptionEvents.ts:18-19; act1.ts:537; skript extra.test.ts: guess F6, nápis B6 → `{"kind":"one","weight":64}`.
Návrh: Při radix 16 hlásit „Liší se jediný krystal levého glyfu, ten s váhou 4.“

### H-I-17 · I-15 (Kodex Hlubší zákony Předsíně) · chyba · nízká · jistá
**Shrnutí Hlubších síní I učí, co je teď v patře II, a vynechává paritu**
Popis: Záznam tvrdí „Přičtení jedničky je přenos zprava“ a „umí krystaly počítat“. Počítadlo poutníků se ale přestěhovalo do II-1 (záznam Předání → Přenos, kodex.ts:184). Sudé a liché (I-9) a řada vah (I-8) ve shrnutí chybí.
Doklad: kodex.ts:157, 159; mapa.md (II-1 Počítadlo poutníků, Kodex Předání → Přenos).
Návrh: Nahradit větou o paritě („Lichost nese pravý bit, každá nula vpravo je jedno půlení.“) a o mocninách dvojky; „umí krystaly počítat“ změnit třeba na „umí krystaly třídit“.

### H-I-18 · I-12, I-13, I-14 · text · nízká · jistá
**„Brána žádá“ v komnatách, které nejsou brány**
Popis: Kolo u zápisu v Nápisu má napevno popisek „Brána žádá“. Zadání zápisu v I-12 až I-14 i hlášení čtečky říkají „kolik žádá brána“, „Brána žádá 172“. Oltářní komnaty stejného patra říkají „Oltář žádá“ a „Požadovaná váha“. Slovo brána už v patře znamená komnatu 7 a 15 a v patře III i runu (PLAYTEST 4.5 to řešil jen pro Zahradu).
Doklad: Inscription.svelte:91; inscriptionEvents.ts:61; act1.ts:443, 481, 529.
Návrh: Popisek brát z presentation (u I-7 a I-15 „Brána žádá“, jinde „Nápis žádá“ nebo „Požadovaná váha“).

### H-I-19 · I-15 · přístupnost · nízká · jistá
**Při přechodu na Oktávu čtečka ohlásí čtení, první úloha je ale zápis**
Popis: Přechod části hlásí vždy `presentation.task`. Oktáva začíná zápisem (vylosované pořadí zápis, čtení, zápis), a tak čtečka řekne „Druhá zkouška: přečti nápis a nastav jeho váhu na kotoučích.“, zatímco na obrazovce je writeTask „rozsviť oktávu tak, aby vážila…“.
Doklad: Level.svelte:347; act1.ts:601-610; generators.ts:89-91.
Návrh: Hlásit text podle první úlohy části (stejná volba jako taskText v Inscription.svelte:33).

### H-I-20 · I-10, I-12, I-15 · přístupnost · střední · domněnka
**Oktáva se na telefonu zalomí do dvou řad a čtení zprava ztrácí oporu**
Popis: Je-li místo užší než 480 px (každý telefon na výšku), osm krystalů se skládá po čtveřicích pod sebe. U glyfů to pomáhá. V desítkových komnatách (I-10, I-12, I-15/2) ale pravidlo „zprava 1, 2, 4… 128“ platí přes zalomení: vpravo nahoře je 16, ne 1. Hráč, který čte řady jako dvě čtveřice, snadno sečte obě po 8-4-2-1. Je to domněnka, ověřené je jen zalomení.
Doklad: CrystalRow.svelte:85-91; act1.ts:450, 617 (nápověda „zprava 1, 2, 4, 8, 16, 32, 64, 128“).
Návrh: V desítkových komnatách zalomit jen při nouzi a mezi řadami ukázat šipku pokračování, nebo pod krystaly nechat drobné váhy (aspoň 128 a 1) jako orientaci.

### H-I-21 · celá hra · text · nízká · jistá
**Akt, nebo patro?**
Popis: Hra střídá dvě jména pro totéž. Mapa má záložky „Patro I“ a nad nadpisem „Akt I · Bit a počítání“, titulka „Akty I až IV“, Kodex „Shrnutí Aktu I“ a deska „Brána patra I“.
Doklad: MapScreen.svelte:139, 148, 221; Title.svelte:94; kodex.ts:109; LevelComplete.svelte:159.
Návrh: Sjednotit na „patro“ (sedí k observatoři a schodům), akt nechat jen v PLAN.md.

### H-I-22 · I-0 · hratelnost · nízká · jistá
**Nečitelná slova bez klíče slibují překlad, který nepřijde**
Popis: První replika hry „…{{ticho}}… {{věky}} ticha…“ má slova bez záznamu Kodexu. Zůstanou glyfy napořád, přitom popisek nad nimi říká „Zatím nečitelné“. Kdo I-0 hraje znovu, vidí, že slib neplatí. Ostatní šifrovaná slova se přeloží (podoba, glyf, Echo).
Doklad: act1.ts:27; EchoText.svelte:11 (title „Zatím nečitelné“ i bez klíče); text.ts:5.
Návrh: Dát slovům klíč (třeba „ticho“ → jiskra, „věky“ → predsin), nebo u slov bez klíče psát „Nečitelné“.

### H-I-23 · I-0, I-1 · text · nízká · jistá
**„Klikni“ na dotykovém displeji**
Popis: Nápověda 2 v I-0 „Klikni na krystal.“ mluví o myši. Zbytek hry jednotně říká „dotek“ a „dotkni se“ (act1.ts:27). Třetí stupeň „Stačí na něj kliknout.“ v I-0 a I-1 se nezobrazí, protože ho nahradí ukázka kroku (Level.svelte:447-449), v obsahu ale zůstává.
Doklad: act1.ts:23, 24, 40.
Návrh: „Dotkni se krystalu.“

### H-I-24 · mapa (patro I) · hratelnost · nízká · jistá
**Po bráně mapa nikdy neoznačí další Hlubší síň**
Popis: Kroužek „tady“ a razítko „Vstoupit“ dostane nejbližší neotevřená komnata základní cesty napříč patry. Po I-7 je to II-0 v jiném patře, a tak v Hlubších síních I neukazuje cestu nic, dokud hráč nedohraje základní cestu všech čtyř pater. Kdo z desky odejde na mapu, musí si další síň najít sám.
Doklad: MapScreen.svelte:17, 35-37, 260, 283.
Návrh: Na zobrazeném patře označit i první otevřenou Hlubší síň (vedle schodů „Jít dál“).

### H-I-25 · I-6, I-7 · didaktika · nízká · jistá
**Souměrné nápisy schovají zrcadlové čtení**
Popis: Generátory pouštějí nápisy 0110, 1001 a 1111. Ze 1500 losovaných nápisů I-6 bylo 421 souměrných (28 %), z 600 čtení I-7 jich bylo 128 (21 %). Hráč, který čte zrcadlově (známá mylná představa z PLAYTEST, Vojta), tam odpoví správně a cílená hláška „Čteš zrcadlově“ nepadne. V I-6 má hráč pět nápisů, takže v průměru 1,4 z nich nic neprověří.
Doklad: generators.ts:45-52, 54-58; skript act1.test.ts: „I-6 palindromes 421 / 1500“, „I-7 read palindromes 128 / 600“.
Návrh: V I-6 a ve čtení I-7 souměrné hodnoty vyloučit (nebo nejvýš jednu na komnatu, ne první bez opor).

### H-I-26 · I-3 (kvíz qCombosOf) · kurikulum · nízká · jistá
**Slovo „oktáva“ na základní cestě dřív, než ho hra zavede**
Popis: Pro n = 8 dostane otázka v I-3 dovětek „, celá oktáva“. Oktávu zavádí až nepovinná I-10, takže hráč základní cesty slovo nezná. Je to stejný typ problému, jaký PLAYTEST 4.5 řešil u II-5.
Doklad: quizzes.ts:77; act1.ts:110-113, 377.
Návrh: Dovětek vynechat, nebo psát „(bajt)“, který zná Kodex Zákon zdvojení (kodex.ts:33).

### H-I-27 · I-12 · hratelnost · nízká · domněnka
**Velký nápis je v Hlubších síních jen dril**
Popis: Jediná komnata patra bez nového nápadu, kvízu i záznamu Kodexu. Čtyři úlohy čtení a zápisu na oktávě opakují I-6, I-7 a I-10. Mezi Tichým krokem a Řečí glyfů zpomalí tempo nejzvídavějším hráčům, pro které síně jsou.
Doklad: act1.ts:427-461 (bez quiz a kodex).
Návrh: Přidat zvrat: čtení zleva Hornerem (Kodex Čtení nápisu ho popisuje, kodex.ts:77), nebo jednu úlohu „bez kotoučů“ s odhadem. Případně Velký nápis sloučit do I-15.

## Patro jako celek
Začátek je svižný: z titulky rovnou do I-0, jeden dotek, světlo a krátké Echo. Křivka základní cesty je hladká. Bit, pak vzor, pak zdvojení s rozdělenou deskou (první aha), objevování vah s dopočtem ze součtu, hladový zápis, čtení s mizejícími oporami a brána bez opor. Smyčka odměny drží: vlna světla, deska s pečetěmi a citátem Echa, „Kodex přeložil“, dveře a medailony na mapě. Nejlepší odměnou je, když hráč v I-13 přečte glyfy na dveřích a mapa začne ukazovat čísla šestnáctkově.

Hlubší síně mají cenu hlavně díky I-9, I-11 a I-13: nový nápad, opravdová hádanka a aha s glyfy. I-8 (součet prozradí váhy), I-12 (dril) a velká brána (opakování v menším) výzvu spíš ředí. Tření dělá hlavně nápověda v „najdi všechny kombinace“ (45 stisků) a tvrdý reset Tichého kroku bez Zpět na dotyku. Echo mluví úsporně, tajemně a bez infantility, pro 16–17 let tón sedí. Příběhová nit je ale tenká: slib „Možná je jednou přečteš“ (I-5) se splní jen v nepovinné I-13 a slova {{ticho}} a {{věky}} se nepřeloží nikdy. Ovládání je jednotné (dotek, kotouč, Potvrdit, Enter, H, Ctrl+Z). Největší dluh je ve čtečce obrazovky: repliky Echa jí skoro nedojdou a u vzorů hlásí čísla. Zásadní je také zkratka ke bráně, která v patře I obejde celé učivo o vahách.

## Co funguje
- I-0 bez mapy a bez textu navíc: hráč hraje do deseti sekund.
- Rozdělená deska v I-3 („Levý krystal ve stínu: 4 kombinace ostatních“) ukáže zdvojení, místo aby ho vysvětlovala.
- Dopočet váhy ze součtu v I-4 a I-5 („9 − 1 = 8. Kámen váhu dopočítal ze součtu.“) odměňuje uvažování, ne klikání.
- Mizející opory v I-6 přesně ohlášené Echem („Teď váhy zmizí…“, „A teď jsou krystaly stejné…“).
- Cílené hlášky omylů čtení (zrcadlo, počet světel, jeden krystal, prohozené glyfy) a srovnání obou kombinací pod kotouči.
- Ukázka kroku s důvodem („Žádáno 11. Těžší krystaly dají 8, zbývá 3. Váha 4 je víc…“) dělá z nápovědy ukázkový příklad.
- I-9 Sudé a liché: oltář chce druh čísla a hráč hledá vzor, příprava na posun a dělení v patře II.
- Tichý krok s nápovědou „zrcadlo“ a replikou „Polovina cesty. Teď přijde zrcadlo.“ k Grayovu kódu opravdu dovede.
- Glyfy na mapě a jejich rozluštění v I-13, šestnáctkové štítky komnat jako trvalá odměna.
- Kvízy losují čísla a u typických omylů vysvětlují proč. Otázka na #FF8800 spojuje bajt s webem.
- Vítězná deska přijde sama, Enter podržený z poslední úlohy ji nepřeskočí a ze zavírajících se dveří je už vidět další komnata.
