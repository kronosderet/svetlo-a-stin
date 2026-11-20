# Herní kritik · patro II

Skripty: `sim/kritik-II/hra.test.ts` (doteky, odmítnutí podle pořadí, omyly, Osud, kvízy), `echo13.test.ts`, `osud.test.ts`, `delky.test.ts`. Losy přes `instantiate(level, seeded(s))`, 200 až 700 semínek.

## Komnaty
- **Schody a Strážce schodů:** Karta patra je krátká a navnadí (voda, přelévání, páky). Tři otázky z Předsíně (kombinace, čtení, zápis) jsou dobře zvolené, protože Síň Počtářů čtení čísel potřebuje. Špatné odpovědi mají vlastní vysvětlení, přeskočit jde. Drobnost: seznam „Komnaty základní cesty“ vynechává II-0, přitom hráč vstoupí právě do ní (StairsScreen.svelte:26).
- **II-0 Jedna a jedna:** Tři doteky, hračka s jasnou pointou 1 + 1 = 10. Zachování světla tu nikdy nic neodmítne, pokud hráč nejde proti logice (sim: 0 odmítnutí u všech pořadí). Odmítnutí, když hráč u 1 + 1 rozsvítí nejdřív pravý krystal, má přesný důvod: „…tam už jedno světlo sjelo dolů do krystalu výsledku.“
- **II-1 Počítadlo poutníků:** Je konkrétní a rychlé (15 doteků) a kvíz (další kombinace, kolik krystalů se změní) přesně zobecňuje. Oltář bez Potvrdit mezi dvěma kaskádami s Potvrdit je drobná změna ovládání, tematicky ale komnata drží.
- **II-2 Dvě dvojky:** Opory jsou dobře vystavěné: váhy vydrží tři součty a Echo komentuje pevné úlohy přesně. Zachování světla tu nic neodmítne (sim 0). Znovuhratelnost je malá, losuje se jen ze 8 a 2 dvojic.
- **II-3 Krystaly přenosu:** Hlášky po chybném potvrzení jsou vzorové (sloupec a proč). Kdo spočítá správně, ale rozsvěcí nejdřív výsledek, dostane odmítnutí v každé úloze, a to s textem, který zní jako chyba (H-II-04). „Přenos přeskočil“ (H-II-18).
- **II-4 Velká kaskáda:** Komnata má asi 25 doteků a 3 potvrzení (min 22, max 28). Počty pod sloupci zmizí po první úloze, jak navrhl playtest. Je nejdelší v základu, tempo ale drží.
- **II-5 Přetékající nádoba:** Přepad je čitelný a popisek pod deskou („Nádoba unese nejvýš 15…“) pravidlo říká přímo na ploše. V kvízu je „Pětijiskrová nádoba“ (H-II-19) a míchání zápisů „1100 + 0110 = 18“ (H-II-21).
- **II-6 Příliv a odliv:** Nejlepší hračka patra, páka a živá váha. Úlohy jsou pevné (bez losu, par 10). „Odliv půlí“ se tluče s Odlivem v II-8 (H-II-07).
- **II-7 Brána Síně:** Je to rozumná syntéza (17 doteků v kaskádě, par 6,6 u pák) a úloha navíc po ukázce kroku funguje. Pravidlo „brána krystaly nehlídá“ je ale jen ve 4. replice Echa a let světel napovídá dál (H-II-10).
- **II-8 Odliv:** Ukázková úloha s předvyplněnými výpůjčkami je dobrý nápad. U řetězu výpůjček se ale krystaly dají rozsvítit jen zleva, proti nápovědě „Začni vpravo“ (H-II-11). Dál „Teď si půjčuj sám“ (H-II-06) a jméno komnaty (H-II-07).
- **II-9 Zdvojení:** Nejsilnější aha patra: zápisník s ×2 a +1 vedle krystalů. Slabší místa jsou první tah z 1 (H-II-14) a nápověda, která odkazuje na dvojkový zápis, který deska neukazuje (H-II-12).
- **II-10 Násobení po lumenitsku:** Výběr kopií je elegantní a chybná kopie se ohlásí první, s vysvětlením. Deska je nejširší v patře (H-II-16) a komnata střídá „číslo“ a „činitel“ (H-II-20).
- **II-11 Dělení posunem:** Miska zbytku je pěkný obraz, jenže jediná páka a automatické přijetí znamenají, že se nedá nic rozhodnout ani pokazit (H-II-05). Čtečka navíc prozradí podíl (H-II-08).
- **II-12 Tři řady:** Přenos o dvě místa je svěží novinka a hlášky i legenda k němu sedí. Závěrečné 15 + 15 + 15 s pěti světly ve sloupci je dobrý vrchol. Kdo rozsvěcí nejdřív výsledek, má odmítnutí ve 100 % úloh (H-II-04).
- **II-13 Doplněk:** Objev před výkladem (13 jedniček = −3) funguje. Pak ale přijde 13 stejných tahů a recept „převrať, +1“ bez rozhodnutí (H-II-09). Echo po první úloze druhé zkoušky v 87 % losů popisuje jiné číslo (H-II-01). Další slabiny: zápisník (H-II-13) a čtečka, která prozradí cíl (H-II-08).
- **II-14 Váhy Osudu:** Na papíře nejlepší výzva patra (přesný počet tahů, misky se vrátí). Generátor ale v 91 % komnat podstrčí úlohu, která jde v limitu jen přetečením přes levý okraj pákou s nápisem ×2 (H-II-02).
- **II-15 Velká brána Síně:** Poctivá syntéza tří Hlubších síní bez nového nápadu. Stejná past s přetečením je v 66 % losů (H-II-02) a závěrečná věta opakuje II-14 (H-II-22).

## Nálezy

### H-II-01 · II-13 · chyba · vysoká · jistá
**Echo po první úloze druhé zkoušky mluví o čísle, které na krystalech není**
Popis: Po první úloze zkoušky „Záporná čísla“ řekne Echo vždy „1101, stejně jako po třinácti jedničkách. Přičti k němu to původní a nádoba přeteče na nulu.“ Úlohy se ale losují (tři různá čísla 1–7), takže první úloha je −3 jen v 1/7 případů. Hráč má na krystalech třeba 1011 (−5) a Echo tvrdí 1101. Přesně v místě, kde se má spojit objev z první zkoušky se zkratkou, hra mate.
Doklad: act2.ts:815 (step 0), act2.ts:796 (`generate: genII13Negate`), generators.ts:365–368. Skript `echo13.test.ts`: „sedí 92/700; jinak např. −5: krystaly 1011, −6: krystaly 1010“.
Návrh: První úlohu generátoru nechat pevně −3, stejně jako to dělá II-2 nebo II-8 s ukázkou: `[{start: 3, target: 13, show: '−3'}, …dvě losované]`. Jinak repliku zobecnit: „Stejný zápis jako po přidávání po jedné. Přičti k němu původní číslo a nádoba přeteče na nulu.“

### H-II-02 · II-14, II-15 · hratelnost · vysoká · jistá
**Váhy Osudu losují úlohy řešitelné jen „shozením“ světla přes levý okraj pákou ×2**
Popis: Generátor vylučuje jen trik s přetočením (0 − 1 = 63), ne ztrátu nejvyššího světla při posunu vlevo. Ve 38 % úloh II-14 (91 % komnat má aspoň jednu) a 42 % úloh II-15 (66 % komnat) se do limitu tahů vejde jen cesta, kde páka s nápisem ×2 udělá z 38 číslo 12. Bez toho cesta trvá o 2 až 4 tahy déle, misky se vrátí a hráč neví proč. Nápověda o tom mlčí („Zdvojení posune světla vlevo… Někdy je kratší přestřelit a pak ubrat.“). II-14 nemá repliku `spill`, takže Echo přetečení nekomentuje. Ukázka kroku pak vypadá jako chyba hry. Pevné úlohy (7 → 30, 40 → 11…) ani PLAN (kap. 6, II-14) takový trik nechtějí. Komentář generátoru slibuje „bez triku s přetočením“ a test hlídá jen `wrap`.
Doklad: generators.ts:271–285 (`distanceNoWrap` přeskakuje jen `spill === 'wrap'`), generators.ts:302–323, generators.ts:414–429, levels.test.ts:245–253, act2.ts:889, act2.ts:892–899 (bez `spill`), Tide.svelte:27 (páka `math: '×2'`). Skript: „II-14: … jen se shozením světla přes levý okraj: 962/2500; komnat aspoň s jednou: 454/500. Např. 19→13 (3 tahy, bez shození 5)“. Ukázka kroku: „Nejkratší cesta k 13: 19 → 38 → 12 → 13. První krok je páka posun vlevo.“, „Nejkratší cesta k 51: 60 → 56 → 57 → 50 → 51.“
Návrh: V `distanceNoWrap` (a v testu „nejkratší cesty nevedou přes přetočení“) vyloučit i `spill === 'left'`. Pokud má trik zůstat jako záměrná výzva, ať ho ohlásí aspoň nápověda 2 a Echo `spill` a ať se objeví nejvýš v jedné úloze.

### H-II-03 · celá hra (doloženo na patře II) · přístupnost · vysoká · jistá
**Repliky Echa čtečka neslyší: úvod přebije „Další replika“, komentáře kroků nejdou do hlášení**
Popis: Bublina Echa je tlačítko s `aria-label="Další replika"`, dokud čeká další replika. Popisek přebije text, takže čtečka u vícedílného úvodu slyší jen „Další replika“. Úvod komnaty se do `announce` neposílá vůbec. U splněného kroku Kaskády i Přílivu jde do hlášení jen „Správně.“, Echova věta (třeba „Dvě a dvě jsou pořád čtyři, jen se to tu píše 10 + 10 = 100“) ne. Stejně dopadne `complete` před kvízem. V patře II žijí v Echu i pravidla: váhy vydrží tři součty (II-2), přenos i do prázdného sloupce (II-3), brána krystaly nehlídá (II-7, II-15), „V nádobě se 13 chová jako −3“ (II-13).
Doklad: EchoBubble.svelte:39, Level.svelte:269, cascadeEvents.ts:44–52, tideEvents.ts:44–53, context.ts:44–47.
Návrh: `aria-label` z bubliny odstranit („dál“ dát do visually-hidden), repliky Echa posílat i do `ctx.announce` (step, complete, úvod), nebo dát bublině `aria-live="polite"` s plným textem (ne s průběžně vypisovaným).

### H-II-04 · patro II (II-3, II-4, II-5, II-10, II-12, II-13) · hratelnost · střední · jistá
**Odmítnutý krystal výsledku „nemá z čeho svítit“, i když ho hráč spočítal správně**
Popis: Zachování světla dovolí rozsvítit krystal výsledku ve sloupci bez vlastních světel až po krystalu přenosu nad ním. Kdo spočítá součet v hlavě a rozsvítí nejdřív výsledek (jak se číslo píše), dostane odmítnutí s textem „V sedmém sloupci zprava žádné světlo není. Krystal výsledku nemá z čeho svítit.“ Zní to jako „tady nic být nemá“, přitom odpověď je správná, jen chybí přenos. Text neřekne, že světlo přinese přenos ze sloupce vpravo. U II-0 a II-2 se o přítoku zprava mluví, u ručních přenosů ne. Skript (hráč zná správné buňky):
- „výsledek, pak přenosy“: odmítnutí ve 100 % úloh II-3, II-4 a II-12, v 67 % II-10, 35 % II-5 a 15 % II-13;
- „sloupec zprava, přenos → výsledek“: 0 odmítnutí.
Doklad: cascadeWords.ts:101 a cascadeWords.ts:140. Skript: „II-4 … výsledek zleva, pak přenosy: odmítnutí/komnata 3.28, úloh s odmítnutím 100 %; [347×] V sedmém sloupci zprava žádné světlo není. Krystal výsledku nemá z čeho svítit.“
Návrh: Když sloupec nemá vlastní světla a přenos do něj patří (nebo sloupec vpravo má aspoň dvě světla), říct: „Do … sloupce zatím nic nepřiteklo. Světlo sem přinese přenos ze sloupce vpravo: nejdřív rozsviť krystal přenosu nad tímto sloupcem.“

### H-II-05 · II-11 · hratelnost · střední · jistá
**Dělení posunem nejde pokazit ani v něm nic rozhodnout**
Popis: Jediná páka (÷2) a Příliv přijme úlohu sám, jakmile váha sedí. Hráč tedy klepe na jediné tlačítko, dokud se kolo neotočí. Nemůže přestřelit, par splní vždy a pečeť přesnosti má zadarmo. Echo se ptá „Kolikrát za ni zatáhneš?“, odpověď ale nikdo nechce. Myšlení zbude jen na kvíz.
Doklad: act2.ts:653 (`ops: ['shr']`), act2.ts:677, tide.ts `pull` (při `value === target` rovnou `step`), skript: par vždy 10.
Návrh: Zkoušku nepřijímat sama. Buď tlačítko „Hotovo“ (pak jde přestřelit a pečeť přesnosti něco znamená), nebo nejdřív tip zbytku do misky (kotouč) a teprve potom páky. Jiná možnost je přidat ×2, ať se dá vrátit a chybovat.

### H-II-06 · II-8 · text · střední · jistá
**„Teď si půjčuj sám.“**
Popis: Echo oslovuje hráče v mužském rodě. Pravidla i PLAYTEST (kap. 10: „Echo už neříká ‚sám‘“) to vylučují.
Doklad: act2.ts:541.
Návrh: „Teď výpůjčky zapisuješ ty.“ nebo „Teď už bez ukázky.“

### H-II-07 · II-6, II-8, II-15 · text · střední · jistá
**„Odliv“ jednou půlí, podruhé odčítá**
Popis: V II-6 je odliv posun vpravo (komnata Příliv a odliv, Echo „Odliv půlí. Tři je zpátky.“, Kodex „Příliv a odliv“ = bitový posun). V II-8 se jmenuje Odliv odčítání s výpůjčkou a stejně i první zkouška Velké brány („Tři zkoušky: odliv, násobení a Váhy Osudu.“). Hráč, který si z II-6 odnesl „odliv = rozpůlit“, čte zkoušku „Odliv“ v II-15 jako páky. V Kodexu stojí dva zákony se stejným slovem a jiným významem.
Doklad: act2.ts:372, act2.ts:401, act2.ts:505, act2.ts:537, act2.ts:916, act2.ts:926, kodex.ts:228, kodex.ts:240.
Návrh: Přejmenovat II-8 (například „Výpůjčka“ nebo „Úbytek“) i zkoušku v II-15, nebo v II-6 říkat jen „posun vpravo půlí“ a název zkrátit na „Příliv“.

### H-II-08 · II-11, II-13 · přístupnost · střední · jistá
**Hlášení po splněné zkoušce prozradí číslo, které kolo záměrně skrývá**
Popis: Kolo ukazuje „÷ 8“ nebo „−5“, čtečka ale po předchozí zkoušce řekne „Správně. Teď z 50 na 6.“ nebo „Správně. Teď z 5 na 11.“ Nevidomý hráč tak dostane podíl nebo doplněk hotový. Vidící ho musí spočítat.
Doklad: tideEvents.ts:52 (`upcoming.target` místo `upcoming.show`), act2.ts:655–658, act2.ts:791–793.
Návrh: `Teď ${upcoming.show ? `${state.value} ${upcoming.show}` : `z ${state.value} na ${upcoming.target}`}`, například „Teď 50 ÷ 8“ nebo „Teď z 5 na −5“.

### H-II-09 · II-13 · hratelnost · nízká · jistá
**Dvě ze tří zkoušek Doplňku jsou bez rozhodnutí**
Popis: V první zkoušce je 13× tatáž páka (+1) a otázka ze zadání „Kolik jedniček to bude?“ nemá kam odpovědět. Odpoví až Echo. Ve druhé zkoušce je vždy přesně „převrať, +1“ (par 2 na úlohu) podle receptu, který napíše zadání. Na celou komnatu tak připadá 19 tahů pákou, při kterých se nic nerozhoduje, než přijde odčítání.
Doklad: act2.ts:761–763, act2.ts:798, skript: par 13 a 6.
Návrh: V první zkoušce nechat tipnout počet na kotouči a ověřit ho jedním tahem „přidej N“, který jedničky přidá s animací. Ve druhé dát úlohu i obráceně (z 1011 zpět na číslo), ať jde o víc než recept.

### H-II-10 · II-7, II-15 · hratelnost · nízká · pravděpodobná
**Brána „nehlídá“, ale let světel napovídá dál a pravidlo je jen v Echu**
Popis: V branách je zachování světla vypnuté záměrně. Animace toku (`lightFlow`) ale běží bez ohledu na to: ke správnému přenosu přiletí dvě světla, ke špatnému nic. Hra tak v bráně pořád ukazuje, co sedí. Pravidlo „rozsvítí se, i když do nich žádné světlo nepřiteče“ je jen ve čtvrté replice Echa. Legenda pod deskou dál tvrdí „Krystal nad sloupcem: světlo, které do něj přeteklo ze sloupce vpravo.“
Doklad: Cascade.svelte:108 (`flow` bez podmínky `conserve`), Cascade.svelte:516, act2.ts:459, act2.ts:950.
Návrh: V bráně nechat světla letět až po Potvrdit (nebo vůbec ne). Pravidlo dát do zadání nebo legendy: „Brána krystaly nehlídá: co kam teče, spočítej sám…“ v neutrální podobě, třeba „…spočítej v hlavě“.

### H-II-11 · II-8 · hratelnost · nízká · jistá
**Řetěz výpůjček jde zapsat jen zleva, nápověda ale říká „Začni vpravo“**
Popis: Zachování světla dovolí krystal výpůjčky jen sloupci, který má co půjčit, takže v řetězu (8 − 1) se musí jít od věřitele doprava. Hráč, který postupuje podle nápovědy a papíru (sloupec zprava: výpůjčka pro něj, pak výsledek), dostane odmítnutí v 38 % úloh, v průměru 4,8 za komnatu. Hláška to vysvětlí dobře („Sloupec si nejdřív musí sám půjčit od souseda vlevo.“), nápovědy 1 a 2 řetěz ale nezmíní.
Doklad: act2.ts:530–531, cascadeWords.ts:115, skript: „papír: výpůjčka/přenos do sloupce, pak výsledek: odmítnutí/komnata 4.83, úloh s odmítnutím 38 %“.
Návrh: Do nápovědy 2 přidat: „Když soused nemá co půjčit, jdi vlevo k prvnímu světlu a půjčuj od něj krok za krokem doprava.“

### H-II-12 · II-14, II-9 · hratelnost · nízká · jistá
**Nápověda chce porovnat dvojkový zápis cíle, který deska neukazuje**
Popis: V II-14 radí nápověda 1 „Porovnej obě váhy ve dvojkovém zápisu. Které krystaly se liší?“, miska Osudu ale ukazuje cíl jen desítkově a krystaly ukazují jen hráčovo světlo. V II-9 radí nápověda 2 „Podívej se na dvojkový zápis cíle“ a kolo přitom ukazuje 21. Převod je dobré cvičení, nápověda ale mluví, jako by zápis byl vidět.
Doklad: act2.ts:574, act2.ts:888, Scale.svelte:57–63, Tide.svelte:80–83.
Návrh: Pod misku Osudu (a pod kolo v II-9) přidat po nápovědě 1 malý MiniPattern cíle, nebo nápovědu přepsat na „Převeď cíl do dvojkové soustavy a porovnej…“.

### H-II-13 · II-13 · didaktika · nízká · jistá
**Zápisník odčítání doplňkem píše „7 + 13 = 20 → 4“, ne 7 − 3**
Popis: Zápisník bere sčítance desítkově, takže doplněk zapíše jako 13 a výsledek jako „20 → 4“. Pointa komnaty (odečíst znamená přičíst doplněk) se na jediném trvalém záznamu nepotvrdí, zápisník spíš ukazuje „sčítání, které nesedí“.
Doklad: CascadeLedger.svelte:15–33, act2.ts:828–836.
Návrh: U úloh s doplňkem (příznak v configu) psát „1101₂ 13 (−3)“ a „= 0100₂ 4, tedy 7 − 3“.

### H-II-14 · II-9 · hratelnost · nízká · jistá
**Z jedničky dá ×2 i +1 totéž, zápisník pak nemusí kopírovat zápis**
Popis: Ze startu 1 vedou ×2 i +1 na 2, obojí je nejkratší cesta. Kdo začne +1, má v zápisníku „+1, +1, ×2“ místo „×2, +1, ×2“ a závěrečné „Porovnej páky s krystaly. Zní ti to povědomě?“ nesedí, přestože pečeť přesnosti dostane. Pointa celé komnaty se tím u části hráčů rozmaže.
Doklad: act2.ts:557–560, act2.ts:583, skript: `distance(2 → 6)` po ×2 i po +1 je 2.
Návrh: Echo po prvním +1 z jedničky: „Z jedné je +1 totéž co ×2. Lumenité začínali zdvojením.“ Nebo v zápisníku psát první krok z 1 vždy jako ×2.

### H-II-15 · II-7, II-13, II-15 · přístupnost · nízká · jistá
**Čtečka čísluje krystaly v Přílivu zleva, v Kaskádě zprava**
Popis: Příliv hlásí „Krystal 1 zleva“, Kaskáda „Výsledek, krystal 1 zprava“. Ve smíšených komnatách se číslování mezi zkouškami otočí, u Oltáře (II-1) je zase zleva.
Doklad: Tide.svelte:61–62, Cascade.svelte:267, cascadeEvents.ts:17.
Návrh: Jednotně zprava podle váhy, nebo místo pořadí říkat váhu („krystal s váhou 4“).

### H-II-16 · II-10 · přístupnost · nízká · pravděpodobná
**Deska násobení je na úzkém telefonu širší než obrazovka**
Popis: II-10 má 48 px vypínačů kopií, 6 sloupců po 44 px (`.grid.tall`) a sloupec hodnot 56 px, dohromady 368 px. Na telefonu 360 px zbude po okrajích stránky (16 px) a desky (4 px) 320 px. Mřížka přesáhne o 24 px na každou stranu, z toho asi 8 px za okraj obrazovky, a `body` má `overflow-x: hidden`, takže se kraje uříznou. II-4 (7 sloupců po 46 px) vyjde na 350 px, těsně v okraji.
Doklad: Cascade.svelte:86–88 (šablona), Cascade.svelte:630, Cascade.svelte:641, Level.svelte (`.level` padding 0 16px), app.css:131.
Návrh: Pod 400 px snížit minimum buňky na 40 px, nebo schovat sloupec hodnot (desítková hodnota je i v zápisníku).

### H-II-17 · II-11, II-8 · chyba · nízká · jistá
**Repliky Echa občas neodpovídají losu**
Popis: Závěr II-11 „Poslední podíl. Zbytek zůstal v misce.“ zazní i tehdy, když je poslední dělení (÷ 16) beze zbytku a miska je prázdná (7 % losů). Echo II-8 po třetí úloze „Výpůjčka prošla několika sloupci“ zazní i u dvou oddělených výpůjček bez řetězu (2,6 %).
Doklad: act2.ts:680, generators.ts:326–339; act2.ts:542, generators.ts:232–244. Skript: „II-11 poslední dělení beze zbytku: 35/500“, „II-8 třetí úloha: … bez řetězu 13/500“.
Návrh: II-11: úlohu beze zbytku losovat jen na 2. nebo 3. místo. II-8: pro třetí úlohu vyžadovat řetěz (`c & (c << 1)`).

### H-II-18 · II-3 · text · nízká · jistá
**„Přenos přeskočil dva sloupce“**
Popis: U 3 + 1 přenos nic nepřeskakuje, prošel dvěma sloupci za sebou (přenosy nad 2. a 3. sloupcem). „Přeskočil“ navádí k představě, že přenos skáče o víc míst, a to v komnatě, kde se přenos teprve učí. II-4 to říká správně: „Přenos proběhl pěti sloupci, jeden za druhým.“
Doklad: act2.ts:236, skript: přenosy úlohy 0 = 110₂.
Návrh: „Přenos proběhl dvěma sloupci za sebou. Jako voda, která se přelévá z misky do misky.“

### H-II-19 · II-5 · text · nízká · jistá
**„Pětijiskrová nádoba“**
Popis: Je to pozůstatek starého názvosloví (jiskra místo krystal), jinde v textech hry „jiskra“ není.
Doklad: act2.ts:357.
Návrh: „18 = 10010₂ má pět číslic. Nádoba s pěti krystaly unese až 31.“

### H-II-20 · II-10, II-15 · text · nízká · jistá
**Jednou „první a druhé číslo“, jindy „činitel“**
Popis: Zadání, nápovědy a Echo v II-10 mluví o „prvním a druhém čísle“, legenda pod deskou, hlášky po chybě a zadání II-15 o „činiteli“.
Doklad: act2.ts:614, act2.ts:622–623, act2.ts:633, act2.ts:970, Cascade.svelte:514 (legenda „Rozsviť kopie podle jedniček druhého činitele.“), cascadeWords.ts:43–44.
Návrh: Sjednotit, třeba v zadání II-10 „první činitel (číslo nahoře)…“ a dál už jen „činitel“.

### H-II-21 · kvízy patra II · text · nízká · jistá
**Drobnosti v losovaných kvízech**
Popis:
- qCopies: „kopie posunuté o 1, 2, 3 míst“ (správně „o 1, 2 a 3 místa“).
- II-5: „aby se do ní vešlo 1100 + 0110 = 18“ míchá dvojkový a desítkový zápis v jedné rovnosti.
- qDivisible a Kodex píšou dělení „:“, páky a kolo „÷“.
- qOverflow: „Nádoba unese čtyři krystaly“, jinde „nádoba má čtyři krystaly, unese nejvýš 15“.
Doklad: quizzes.ts:440, act2.ts:353, quizzes.ts:479, kodex.ts:245, quizzes.ts:348.
Návrh: „o 1, 2 a 3 místa“, „1100 + 0110 (12 + 6 = 18)“, jeden znak dělení v celé hře, „Nádoba má čtyři krystaly.“

### H-II-22 · II-14, II-15 · text · nízká · jistá
**Dvakrát za sebou stejné shrnutí a „nejtěžší zkouška“ před velkou bránou**
Popis: Závěr II-14 „Umíš sčítat, odčítat, násobit i dělit. Stačí ti k tomu světlo a posun.“ a o komnatu dál závěr II-15 „Sčítat, odčítat, násobit i dělit umíš jen se světlem a posunem.“ Úvod II-14 tvrdí „Nejtěžší zkouška Hlubších síní“, přitom hned po ní přijde velká brána, která Váhy Osudu obsahuje.
Doklad: act2.ts:894, act2.ts:902, act2.ts:919.
Návrh: II-14 zakončit o přesnosti („Osud uznal, že počítáš dopředu.“), shrnutí nechat bráně. Úvod: „Nejpřísnější zkouška Hlubších síní.“

### H-II-23 · Kodex (II-9) · text · nízká · jistá
**„z Čtení nápisu“**
Popis: Před „čt-“ se předložka vokalizuje: správně „ze Čtení nápisu“.
Doklad: kodex.ts:255.
Návrh: „Je to Hornerovo schéma ze Čtení nápisu…“

### H-II-24 · patro II (kaskády) · přístupnost · nízká · jistá
**Krystaly přenosu mají dotykový cíl 40 × 40 px**
Popis: Krystal přenosu, výpůjčky, přepadu a vypínač kopie (Spark) je tlačítko 40 × 40 px. PLAN kap. 10 chce aspoň 44 × 44 px. V patře II jsou to nejčastěji ťukané prvky (II-4 až 6 přenosů v úloze) a na telefonu sedí těsně nad řádkem řad.
Doklad: Spark.svelte (`.spark { width: 40px; height: 40px }`), PLAN.md:667.
Návrh: Tlačítko zvětšit na 44 px (miska může zůstat 30 px), nebo rozšířit klikací plochu pseudoelementem.

## Patro jako celek
Síň Počtářů má nejlepší metaforu hry. Voda, přelévání, nádoba s přepadem, příliv a odliv drží pohromadě a zachování světla z ní dělá fyziku, kterou je vidět: dvojice opravdu odletí do přenosu a výpůjčka opravdu přistane jako dva krystaly. Základní cesta má dobrou křivku. II-0 je hračka, II-1 dá přenosu konkrétní tvář, II-2 až II-4 přidávají po jednom nápadu a opory mizí uvnitř komnat. II-6 je osvěžení a brána spojuje obojí. Tempo je rozumné (asi 160 akcí za základ) a hlášky po chybném potvrzení jsou nejlepší zpětná vazba ve hře.

Slabší je tření kolem zachování světla. Kdo spočítá správně, ale klepe v „nesprávném“ pořadí, dostane odmítnutí s textem, který zní jako chyba (H-II-04, H-II-11). Hlubší síně mají dvě vynikající komnaty (II-9, II-12) a jednu, která by mohla být vrcholem (II-14). Tu kazí generátor, který hráče nutí do neohlášeného triku s přetečením (H-II-02). Proti tomu II-11 a dvě třetiny II-13 jsou klikání bez rozhodnutí. Jako nepovinná výzva mají Hlubší síně cenu hlavně pro silné hráče. Po opravě Osudu by byla II-14 poctivá „boss“ komnata a II-15 by ji uzavřela.

Příběhová nit je v patře tenká: Lumenité jsou kulisa a Echo spíš vykládá, než se ptá (PLAN 2.2). Pro šestnáctileté je tón v pořádku, bez dvojsmyslů. Nejvíc ztrácí hráč se čtečkou obrazovky: pravidla a pointy patra jsou v Echu, které se mu nedostane (H-II-03), a dvě hlášení mu naopak prozradí výsledek (H-II-08). Znovuhratelnost je dobrá u kaskád a Osudu, malá u II-2, II-6 a II-13.

## Co funguje
- Hlášky po chybném potvrzení Kaskády: první špatný sloupec, kolik světel se v něm slilo a co z toho plyne. Ukázka kroku dodá i výsledek („…to je 10. Dole zůstane stín a jedno světlo přeteče…“).
- Zachování světla jako viditelná fyzika. V II-0 a II-2 nic neodmítne, pokud hráč nejde proti logice, a odmítnutí u 1 + 1 („tam už jedno světlo sjelo dolů“) přesně ukáže, proč 1 + 1 není 11.
- Mizení opor uvnitř komnat (váhy v II-2 po třech součtech, počty v II-4 po prvním) a Echo, které to předem ohlásí.
- II-8: ukázková úloha s předvyplněnými výpůjčkami a výpůjčka zapsaná pod spodní řadu, takže je vidět „dva krystaly od jednoho“.
- II-9: zápisník s ×2 a +1 vedle krystalů dává nejsilnější aha patra. II-12: přenos o dvě místa jako nový nápad bez nového ovládání.
- Váhy Osudu jako koncept: přesný limit, kamínky tahů, vrácení misek a vyrovnané váhy jako vizuální cíl.
- Úloha navíc v branách po ukázce kroku a Strážce schodů s vysvětlením každé typické chyby.
- Ovládání klávesnicí: šipky po desce Kaskády podle polohy, šipky, +, − a N pro páky, Enter potvrdí jen tehdy, když fokus není na krystalu.
