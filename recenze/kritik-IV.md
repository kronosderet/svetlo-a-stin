# Herní kritik · patro IV

Prošel jsem schody, IV-0 až IV-15 a konec hry tak, jak je potká hráč. Úlohy, hlášky a kvízy jsem hrál skriptem: C:/Users/Kronos/AppData/Local/Temp/claude/afd7994ff7264e43/be930608-3934-4468-8fcd-4967f6c8bacc/scratchpad/sim/kritik-IV/a.test.ts a b.test.ts. Skript počítá ideál, řešení, popisky točitých kamenů, hlášky po typických chybách, losované kvízy a zkoušky navíc. Funkce `lampsWords`, `rowWords` a hlášku po chybě jsem z `machineEvents.ts` zkopíroval, protože soubor nejde kvůli zvuku importovat.

## Komnaty
- **Schody a Strážce schodů (před IV-0):** Karta patra je stručná, otázky jsou rychlé a dají se přeskočit. Strážce ale slíbí „tři zákony z minulého patra (Zahrada Bran)“ a třetí otázka je čtení nápisu z Předsíně (H-IV-22).
- **IV-0 Stroj, který počítá:** Dobrá nultá komnata: tři doteky, Echo se ptá a odečet nadepsaný „lampy“ odpověď neprozradí. Nečitelné slovo „abstrakce“ je hezký háček na IV-3. Čtečka obrazovky ale u nové kombinace neohlásí, co lampy ukazují (H-IV-01).
- **IV-1 Poloviční sčítačka:** Past s Rozcestím a kvíz, který se na ni ptá, je pořád nejlepší chyba patra. Ve druhé úloze jsou prázdné kameny dva, zadání ale mluví o jednom (H-IV-16). Poslední replika Echa se nikdy neukáže (H-IV-05).
- **IV-2 Úplná sčítačka:** Zkoumání osmi kombinací plyne, stavba tří run jde s nápovědou 2. Do kamene přenosu se ale hodí i Výluka a Echo pak tvrdí „…a Rozcestí“ (H-IV-11). Replika k osmé kombinaci zanikne (H-IV-05).
- **IV-3 Řetěz sčítaček:** Echo točitý kámen představí a kámen zapulzuje, to funguje. Druhá úloha nabízí přenos z kterékoli sčítačky (250 možností) a nutí přemýšlet. Vysvětlení třetí úlohy („Světlo v prvním přenosu přidá jedničku navíc.“) zanikne (H-IV-05).
- **IV-4 Porovnávač:** Úvodní zkoumání Rovnosti zacelilo díru z playtestu. Stavby jsou krátké (8 možností). Kvíz „dvě oktávy“ stojí na pojmu z Hlubší síně I-10, závorka „osmibitových čísel“ to ale zachrání. Poslední replika Echa zanikne (H-IV-05).
- **IV-5 Výhybka:** Cíle s Echem jsou vrchol základní cesty. Replika „A teď na lampu nemá vliv.“ se dá číst dvojznačně (H-IV-18). Na točitém kameni znamená „1“ Obraceč, ne stálé světlo (H-IV-06). Nápověda 2 řekne celé zapojení (H-IV-07). Čtečka obrazovky hlásí „lampa lampa“ (H-IV-20).
- **IV-6 Rozdělovač:** Dvě úlohy (4, pak 8 točitých kamenů) dobře stupňují. Druhá je ale osmkrát stejné rozhodnutí a v IV-7 přijde hned znovu, únava z playtestu trvá. Na telefonu leží dva točité kameny u Pouta 22 px od sebe (H-IV-21). Poslední replika Echa zanikne (H-IV-05).
- **IV-7 Brána Hlubiny:** Tři zkoušky pokrývají patro a losování ztěžuje opisování. Po ukázce kroku u výhybky ale v polovině případů přibude rozdělovač (H-IV-04). Zadání Cest říká „(a vlož runu)“ i u rozdělovače (H-IV-16). Kvíz o řetězu sčítaček přijde až po porovnávači. Fast gate sem pustí i hráče, který rozdělovač, výhybku ani porovnávač ještě neviděl (H-IV-08). Základní cesta tu končí bez příběhového momentu (H-IV-09).
- **IV-8 Ozvěna:** Nejsilnější aha patra: „S zhaslo, a lampa svítí dál.“ Stavba kruhu má jen 4 možnosti, ale smysl dává. Dolní kámen má číslo 1 a horní 2 (H-IV-06). Nápověda 2 řekne řešení (H-IV-07).
- **IV-9 Tep Srdce:** Pořadí dává smysl: brána tepu z krystalu T, pak ozvěna s tepem jako jeden kámen a tlačítko Tep. Echo po chybě ale popisuje chybu, která tu nastat nemůže (H-IV-03). Srdce Observatoře tu zazní poprvé v celé hře, bez přípravy (H-IV-09).
- **IV-10 Registr:** Cíle („ulož 5, vstup se mění, paměť drží“) jsou jasné a posun ×2 navazuje na Příliv. Čísla ozvěn na točitých kamenech se pletou s vahami lamp (H-IV-06). Nápověda 2 řekne celé zapojení (H-IV-07).
- **IV-11 Počítadlo hvězd:** Hotové počítadlo baví a přetočení na 0 je hezká vazba na přetečení. Losovaný kvíz má ve čtvrtině losů chybné vysvětlení (H-IV-02). Texty mluví o krystalech a vstupech, které počítadlo nemá (H-IV-17).
- **IV-12 Odčítačka:** Pointa „procesor odčítá sčítačkou“ je silná a dvě úlohy (Obraceče, pak Výluka s M) dobře stupňují. Komnata stojí na Doplňku z nepovinné II-13 (H-IV-10). U jedné sčítačky stojí dvě různé „1“ (H-IV-06). Vysvětlení Výluky s M po druhé úloze zanikne (H-IV-05).
- **IV-13 Volič operace:** Přehozené voliče daly první úloze opravdovou hádanku (256 možností). Zadání je pro obě úlohy stejné, přestože se v každé dělá něco jiného (H-IV-16). Nápověda mluví o vstupu A výhybky, na desce je ale i krystal A (H-IV-23).
- **IV-14 Násobička:** Pěkná návaznost na kopie z II-10 a poznámky A₂ × B₁ pod Pouty pomáhají. Úloha má 81 možností a dvě souměrná řešení. Pro hráče bez II-10 je odkaz „jako v Násobení po lumenitsku“ prázdný (H-IV-10).
- **IV-15 Velká brána Hlubiny:** Počítadlo s chodem je opravdová syntéza (paměť, sčítačka a runy) a nápověda 1 míří na princip. Nápověda 2 ale řešení prozradí (H-IV-07), los ho nezmění (H-IV-12) a druhá zkouška je skoro IV-13, úloha 1 (H-IV-24). Hra po ní nijak neskončí (H-IV-09).
- **Konec hry (po IV-15):** Vítězná deska je stejná jako u kterékoli komnaty a nabídne „Zpět na mapu“. Mapa ukáže schody „patro ale v prototypu ještě není“. Shrnutí patra funguje jako tisknutelný přehled přeložených zákonů (7 + 8), finále ani souhrn cesty ale chybí (H-IV-09).

## Nálezy

### H-IV-01 · IV-0, IV-2, IV-4 · přístupnost · vysoká · jistá
**Při nové kombinaci čtečka neuslyší, co lampy ukazují**
Popis: Při zkoumání vznikne po doteku nejdřív událost `input` s hláškou „Vstup A: světlo. lampy 1.“ a hned nato `tried` s hláškou „Nová kombinace: A světlo, B stín. Vyzkoušeno 2 z 4.“. Obě přijdou v jednom synchronním průchodu a `announce` jen přepisuje stav, takže do živé oblasti se dostane jen druhá věta, a ta o lampách nic neříká. Čtenář obrazovky tedy u každé nové kombinace (a právě o ty jde) neslyší výsledek. Deska objevů výsledek taky nepřečte: výklenek má v aria-label jen řádek vstupů a tečky lamp jsou aria-hidden. Brána v Aktu III lampu v té samé hlášce má.
Doklad: machineEvents.ts:55 a 66; machineGame.svelte.ts:303 (`for (const event of r.events) this.emit(…)`); Level.svelte:356-358; Workshop.svelte:180 a 183; pro srovnání gateEvents.ts:35 („Nová kombinace: …, lampa svítí“).
Návrh: Do hlášky `tried` přidat `lampsWords(m, lamps())` a do aria-label výklenku stav lamp.

### H-IV-02 · IV-11 (kvíz qCounter) · chyba · střední · jistá
**Vysvětlení tvrdí přetečení, i když žádné nenastalo**
Popis: qCounter losuje start 4–7 a 2–4 tepy. U dvojic 4 + 2, 4 + 3 a 5 + 2 (3 z 12, tedy 25 % losů) počítadlo nepřeteče, vysvětlení ale vždy začíná „Po sedmičce přijde 0…“ a končí „takže po přetečení zbude 6“. Učí, že přetečení nastalo tam, kde nenastalo. Nápověda po chybě („pak počítadlo přeteče na 0“) v těch losech taky míří vedle.
Doklad: generators4.ts:205-227; skript: „Tříbitové počítadlo hvězd ukazuje 4. Co ukáže po 2 tepech?“ → „Po sedmičce přijde 0. 4 + 2 = 6, tři krystaly ale unesou nejvýš 7, takže po přetečení zbude 6.“ Stejně u 4 + 3 a 5 + 2.
Návrh: Losovat jen start + tepy ≥ 8 (otázka je o přetečení), nebo mít druhé vysvětlení bez přetečení.

### H-IV-03 · IV-9 Brána tepu · chyba · střední · jistá
**Echo po chybě popisuje chybu, která tu nastat nemůže**
Popis: První chybná Zkouška vyvolá větu „Ozvěna poslouchá, i když nemá.“ Obě Pouta mají pevně vstup T, takže bez tepu ozvěna nikdy nic nepřevezme. Všechna tři špatná zapojení padnou ve 2. kroku, kde měla ozvěna D převzít, a nepřevzala. Hráč dostane opačnou radu, než potřebuje.
Doklad: act4.ts:650; machines.ts:320-321; skript: D/D → „krok 2 lampy Q ukazuje {"Q":0} čeká {"Q":1}“, stejně nd/D a nd/nd.
Návrh: Třeba „Ozvěna si D nezapamatovala, ačkoli tep svítil. Co teče do S a co do R?“

### H-IV-04 · IV-7 Cesty · chyba · střední · jistá
**Zkouška navíc po ukázce kroku u výhybky je v polovině případů rozdělovač**
Popis: `kindOf` rozlišuje úlohy podle `mode` a u Dílny je to vždycky `build`. Výhybka má jen dvě podoby. Když nový los padne stejně jako ta v části, odmítne se a vezme se první vhodná úloha z losu, tedy rozdělovač. Kdo potřeboval ukázku kroku u výhybky, místo ní zkouší osm točitých kamenů rozdělovače. Smysl zkoušky navíc („zkus totéž bez ukázky“) se ztratí.
Doklad: extraTask.ts:10-13 a 20-33; generators4.ts:40-48 a 136-138; skript (400 losů): „po ukázce u výhybky přibude: výhybka 209 rozdělovač 191“.
Návrh: U strojů rozlišit druh úlohy (třeba pole `kind` nebo podle `rule`), nebo u výhybky dovolit stejnou podobu znovu.

### H-IV-05 · IV-1, IV-2, IV-3, IV-4, IV-6, IV-12, IV-13 · chyba · střední · jistá
**Sedm replik Echa se nikdy neukáže**
Popis: Po poslední úloze vrátí jádro hned za sebou `step` a `complete`. Echo řekne repliku z `step` a vzápětí ji přepíše `complete` (komnata má kvíz). Ve smíšené IV-2 přepíše repliku k osmé kombinaci závěr části. Zanikne mimo jiné jediné výslovné vysvětlení „Světlo v prvním přenosu přidá jedničku navíc“ a „Výluka s M je obraceč na povel“.
Doklad: machine.ts:402-405; machineEvents.ts:111-118; context.ts:43-46; Level.svelte:318-319; skript vypíše: IV-1 „Pouto dá přenos, Výluka spodní číslici.“, IV-2 „Všech osm. Tři světla dají 11, tedy tři.“, IV-3 „Světlo v prvním přenosu přidá jedničku navíc.“, IV-4 „Různá čísla: Výluka najde rozdíl a Rozcestí stačí jeden.“, IV-6 „Každé číslo má svou lampu.“, IV-12 „Výluka s M je obraceč na povel…“, IV-13 „Výhybky ve dvou patrech vyberou jednu ze čtyř cest.“ Stejný mechanismus je v gateEvents.ts:64 (jiná patra jsem neověřoval).
Návrh: V `sayComplete` repliku `complete` připojit (`echo.add`) za `step`, ne ji přepsat. Repliku k poslední kombinaci dát do závěru části.

### H-IV-06 · IV-5, IV-6, IV-7, IV-8, IV-10, IV-12 · hratelnost · střední · jistá
**Číslice na točitém kameni znamená dvě různé věci**
Popis: Točitý kámen ukazuje stálé světlo a stín jako „1“ a „0“, výstup kamene jako jeho číslo, tedy taky „1“, „2“, „3“, stejným písmem. Čísla kamenů jsou přitom jen 11px šedé číslice v rohu.
- IV-12, úloha 1: u téže sčítačky nabízí kámen na vstupu B „B₁ / 1“ (1 = Obraceč) a vedlejší kámen přenosu „0 / 1“ (1 = stálé světlo).
- IV-5 a IV-7: správná volba horního Pouta je „1“, tedy obrácený volič. Kdo zná „1“ z IV-3 jako stálé světlo, čte opak.
- IV-10: ozvěny se číslují shora (lampa 4 má ozvěnu 1, lampa 1 má ozvěnu 3). Na dolní ozvěně znamená volba „1“ nejtěžší ozvěnu.
- IV-8: horní kámen má číslo 2 a dolní 1, protože se dolní runa počítá první.
Doklad: MachineBoard.svelte:160-168 (`sourceLabel`), 347 a 363 (čísla kamenů), 541-549 (11 px); machines.ts:224 a 286-298, 376-395, 557-584; skript: „IV-12 … u vstupu B úplné sčítačky 4 | volby: B, 1“ a „u vstupu P úplné sčítačky 4 | volby: 0, 1“, „IV-10 … u vstupu D ozvěny s tepem 3 | volby: X, 1, 2“.
Návrh: Stálé světlo a stín kreslit značkou (plný a prázdný krystal) místo číslic a výstup kamene označit jinak, třeba „k1“ nebo zkratkou runy („¬V“). Číslovat shora dolů a zleva doprava.

### H-IV-07 · patro IV (nápověda 2) · hratelnost · střední · jistá
**Nápověda 2 často řekne celé řešení, pečeť odvahy pak nic nestojí**
Popis: Pečeť odvahy bere jen ukázka kroku a zkoušku navíc v bráně přidá taky jen ukázka kroku. V řadě staveb ale už druhá nápověda řekne kompletní zapojení:
- IV-5 „Horní Pouto potřebuje obrácený volič…, dolní volič přímo. Obě cesty pak spojí Rozcestí.“
- IV-8 „Každé Zavřené rozcestí má brát druhé světlo z výstupu té druhé runy.“
- IV-9 „Do S má téct D, do R obrácené D.“
- IV-10 a IV-11: celé zapojení.
- IV-12, úloha 1: celé zapojení.
- IV-15 Počítadlo: „Pouto pustí světlo z paměti…, jednička… jen s chodem“, tedy tři Pouta a C.

Ve velké bráně tak jde řešení získat bez zkoušky navíc i bez ztráty pečeti.
Doklad: act4.ts:408, 597, 645, 766, 846, 868, 996; baseGame.svelte.ts:155-160 a 169.
Návrh: Druhý stupeň ať ukáže princip nebo jedno místo (třeba jen horní Pouto, jen jednu ozvěnu), celé zapojení až ukázka kroku.

### H-IV-08 · IV-7 (Zkusit bránu hned) · hratelnost · střední · pravděpodobná
**Fast gate pustí do brány před komnatami, které zavádějí tři ze čtyř jejích strojů**
Popis: Komu vyjdou IV-1 až IV-3 v ideálu a bez ukázky, tomu mapa otevře IV-7. Brána ale zkouší rozdělovač, výhybku a porovnávač, které zavádějí až IV-4 až IV-6, a Echo je v ní nepředstaví („Druhá zkouška: rozdělovač a výhybka.“). Silný hráč to vyzkouší z tabulky, ale přeskočí většinu obsahu patra i tři záznamy Kodexu. V jiných patrech jsou komnaty 4–6 spíš procvičování. Tady přinášejí nové součástky.
Doklad: progress.svelte.ts:154 a 161-169, 185; MapScreen.svelte:195; act4.ts:504-505 a 521.
Návrh: V Aktu IV fast gate vypnout, nebo ho podmínit i komnatami 4–6. Případně ať Echo v bráně každý stroj jednou větou uvede.

### H-IV-09 · konec hry (IV-7, IV-15, mapa) · hratelnost · střední · jistá
**Hra po poslední komnatě nijak neskončí a příběh nedostane vyvrcholení**
Popis: Po IV-15 přijde obyčejná vítězná deska s tlačítkem „Zpět na mapu“. Poznámka „Dál prototyp zatím nevede“ se ukáže jen po bráně 7, protože IV-15 se za bránu patra nepočítá. Žádné shrnutí cesty (64 komnat, pečetě, Kodex), žádná závěrečná replika. Srdce Observatoře, ke kterému podle PLAN.md příběh směřuje, se ve hře poprvé objeví až v nepovinné IV-9. Základní cesta, se kterou skončí většina třídy, končí v IV-7 větou „Z takových součástek je složený každý počítač“, bez Lumenitů i bez Srdce. Titulní obrazovka slibuje záhadu („Pak záhadně zmizeli“) a prototyp ji nikde neposune.
Doklad: Level.svelte:58, 75 a 700-705; LevelComplete.svelte:126-167; act4.ts:471, 624, 980; „Srdce“ je v obsahu jen act4.ts:624, 680, 980 a kodex.ts:583, 653; Title.svelte:78; PLAN.md:14, 77, 124.
Návrh: Po IV-7 i po IV-15 závěrečná karta: Echo, Srdce se poprvé pohne, souhrn pečetí a odkaz na Shrnutí patra, „Archiv Hlasů spí“. Srdce zmínit už v IV-0 nebo v lore patra.

### H-IV-10 · IV-12, IV-14 · hratelnost · střední · jistá
**Hlubší síně IV stojí na Hlubších síních II a nedají se přeskočit**
Popis: IV-12 začíná „V Doplňku se odčítalo sčítáním“ a nápověda 1 zní „Vzpomeň na Doplněk“. Doplněk je nepovinná II-13. IV-14 odkazuje na „Násobení po lumenitsku“ (nepovinná II-10). Hlubší síně se otevírají po jedné, takže kdo chce k IV-13 až IV-15, musí projít IV-12. Bez II-13 dostane hráč odkaz na komnatu, kterou nezná, a nepřeložený záznam Kodexu.
Doklad: act4.ts:867, 873, 951, 956; mapa.md (II-10 a II-13 jsou Hlubší síně); progress.svelte.ts:178-184.
Návrh: Echo ať doplněk řekne přímo („−B je převrácené B a jednička“), ne jen odkazem. U násobičky stačí věta „kopie prvního čísla podle jedniček druhého“.

### H-IV-11 · IV-2 Stavba · chyba · nízká · jistá
**Výluka v kameni přenosu projde a Echo pak mluví o Rozcestí**
Popis: Obě Pouta nikdy nesvítí naráz, takže do kamene přenosu projde Rozcestí i Výluka. Kdo dá Výluku, uslyší „Dvě Výluky, dvě Pouta a Rozcestí: úplná sčítačka.“, ačkoli na desce žádné Rozcestí nemá. Zároveň je to nevyužitý aha moment.
Doklad: skript: „IV-2 řešení {"c2":"and","s":"xor","c":"or"}“ a „{…"c":"xor"}“; act4.ts:61 a 166.
Návrh: Do kamene c nabízet jen Pouto a Rozcestí, nebo z toho udělat repliku či kvízovou otázku („proč tu projde i Výluka?“).

### H-IV-12 · IV-15, IV-7 · hratelnost · nízká · jistá
**Los v branách mění zadání málo, řešení jde opsat**
Popis: Počítadlo s chodem losuje jen počty tepů ve zkoušce, řešení je při každém losu stejné (tři Pouta a C). Zkouška navíc po ukázce kroku je proto stejné zapojení znovu. Sčítačka i Porovnávač v IV-7 mají po dvou podobách. Komentář generátoru („ať se nedají opsat od souseda“) tu neplatí.
Doklad: generators4.ts:1-4, 132-142 a 147-158; skript: „IV-15 počítadlo: různých řešení přes 50 losů 1“.
Návrh: Losovat i stavbu: pořadí kamenů, kam vede C, nebo variantu „při zhasnutém C drží“ místo „nuluje“.

### H-IV-13 · IV-7 Cesty · chyba · nízká · jistá
**Nápověda říká „čísla lamp nejsou popořadě“, los ale může dát 0, 1, 2, 3**
Popis: `shuffled` vrátí původní pořadí s pravděpodobností 1/24. Pak nápověda 1 neplatí a úloha je stejná jako IV-6, úloha 2.
Doklad: act4.ts:500; generators4.ts:137; random.ts:28-35.
Návrh: Losovat, dokud pořadí není 0, 1, 2, 3.

### H-IV-14 · patro IV · přístupnost · střední · jistá
**Ukázka kroku neřekne, který kámen je zvýrazněný**
Popis: Ve stavbě ukázka kroku zní „Do zvýrazněného kamene patří Výluka…“ nebo „Zvýrazněný točitý kámen natoč tak, aby světlo teklo z kamene 1“, v cílech a zkoumání jen „Zvýrazněný krystal je další krok.“ Zvýraznění je jen třída `hl` a aria-label kamene se nezmění. Čtenář obrazovky neví, kam jít, nejvíc v IV-6, IV-7, IV-13 a IV-14, kde je kamenů víc. `seatWords` přitom umí místo pojmenovat.
Doklad: machineGame.svelte.ts:98-105; MachineBoard.svelte:286, 315 a 357 (`class:hl`) vs. 289, 317 a 359 (aria-label beze změny); act4.ts:45, 94, 179, 388, 569; Level.svelte:447-452.
Návrh: Do věty přidat místo („Točitý kámen u vstupu P úplné sčítačky 2 natoč…“, „Do kamene 3 patří…“). U cílů jmenovat krok („Přepni krystal B.“, „Udeř tepem.“).

### H-IV-15 · celá hra (ověřeno v Dílně) · přístupnost · střední · jistá
**Repliky Echa se čtečce neohlašují**
Popis: Bublina Echa nemá živou oblast a `onMachine` repliky z `found` a `step` jen zobrazí. Úvod komnaty se při vstupu neohlásí, nadpis dostane fokus a při přechodu části se ohlásí jen zadání. Neslyšitelný je tak třeba úvod IV-3, kde Echo točitý kámen teprve představí, nebo „Volič svítí a lampa teď poslouchá B“ (IV-5) či „S zhaslo, a lampa svítí dál“ (IV-8), tedy objevy, o které v komnatách jde.
Doklad: machineEvents.ts:64-66, 72-75, 111-113; EchoBubble.svelte:37-48 (bez aria-live); Level.svelte:269 a 347, 553-556.
Návrh: U `found`, `step` a úvodu volat i `announce(plainText(line, known))`, nebo bublině dát `aria-live="polite"`.

### H-IV-16 · IV-1, IV-7 Cesty, IV-13 · text · nízká · jistá
**Zadání nesedí na jednotlivé úlohy**
Popis:
- IV-1: „Vlož do prázdného kamene runu“ platí i pro druhou úlohu, kde jsou prázdné kameny dva.
- IV-7 Cesty: „natoč točité kameny (a vlož runu)“ platí i pro rozdělovač, kde žádná runa není.
- IV-13: „Osaď kameny a natoč voliče výhybek“ platí pro obě úlohy, první má jen kameny a druhá jen voliče.

Je to stejný nález, jaký playtest měl u IV-12. Tam se opravil vlastním zadáním úlohy (`say`).
Doklad: act4.ts:60 a 116-120; 496-498; 906-907; generators4.ts:93-96 (vzor `say`).
Návrh: Dát úlohám vlastní `say`.

### H-IV-17 · IV-11 · text · nízká · jistá
**Počítadlo nemá krystaly, texty o nich mluví**
Popis: Počítadlo hvězd nemá žádný vstup. Nápověda 3 v cílech přesto zní „Zvýrazněný je další krok: krystal, nebo tep.“ a hláška po chybné stavbě „Projdi ten krok vstupy a tepem“.
Doklad: machines.ts:426 (`inputs: []`); act4.ts:45 a 822; machineEvents.ts:94; skript: „IV-11 stín místo jedničky → … Projdi ten krok vstupy a tepem…“.
Návrh: Když stroj nemá vstupy, psát „Udeř tepem“ a „Projdi ten krok tepem“.

### H-IV-18 · IV-5 Volič · text · nízká · jistá
**„A teď na lampu nemá vliv.“ se čte jako spojka**
Popis: Na začátku věty splývá krystal A se spojkou „A“. Věta se dá přečíst jako „A teď (to) na lampu nemá vliv“ a hlavní objev (krystal A je odpojený) se ztratí.
Doklad: act4.ts:395.
Návrh: „Krystal A teď na lampu nemá vliv.“

### H-IV-19 · IV-15 Počítadlo s chodem · text · nízká · pravděpodobná
**Zájmeno bez jasného předmětu v zadání**
Popis: „Když C zhasne, má ho tep vynulovat.“ Nejbližší podstatné jméno je chod C (mužský rod), takže „ho“ jde číst jako C. Echo má podobné „Když zhasne, tep ho vrátí na nulu.“. Pravidlo pod tabulkou je přitom jasné.
Doklad: act4.ts:992 a 1002; generators4.ts:152.
Návrh: „Když C zhasne, má tep počítadlo vynulovat.“

### H-IV-20 · IV-5, IV-7 · přístupnost · nízká · jistá
**Čtečka hlásí „lampa lampa mlčí“**
Popis: Lampa výhybky se jmenuje „lampa“, takže hlášení zní „lampa lampa svítí“ a aria-label „Lampa lampa: svítí“.
Doklad: machines.ts:229; machineEvents.ts:24; MachineBoard.svelte:378; skript: „lampsWords IV-5 Volič → "lampa lampa mlčí"“.
Návrh: Pojmenovat lampu „výstup“ nebo „Q“, případně u jména „lampa“ slovo nezdvojovat.

### H-IV-21 · patro IV (telefon) · přístupnost · nízká · jistá
**Na telefonu se skoro každá deska posouvá a točité kameny jsou malé a těsně u sebe**
Popis: Na šířce 375 px se 30 z 34 desek patra nevejde ani při nejmenším měřítku 0,7 a posouvá se do strany. Točitý kámen pak má plochu pro prst asi 28 px (doporučuje se kolem 44). Dva točité kameny u jednoho Pouta (IV-6, IV-7 Cesty) mají středy 22 px od sebe a jejich plochy se překrývají. Playtest dotyk zlepšil, na hustých deskách to ale nestačí.
Doklad: MachineBoard.svelte:72 a 117-120 (posun ±16 px), 656-688; layout.ts (`frameOf`); skript b.test.ts (tabulka šířek: např. IV-13 W 792, IV-14 W 816).
Návrh: U dvou točitých kamenů na jednom kameni je rozestavit dál od sebe. Na dotykovém displeji zvážit volbu zdroje z nabídky po ťuknutí místo protáčení.

### H-IV-22 · schody IV · text · nízká · jistá
**Strážce slibuje otázky z minulého patra, třetí je z Předsíně**
Popis: Karta říká „zeptá se na tři zákony z minulého patra (Zahrada Bran)“, otázka qRead („Kolik váží nápis 1010?“) je ale čtení z Aktu I. Záměr (čtení čísel potřebuje Hlubina) je dobrý, slib v textu nesedí.
Doklad: StairsScreen.svelte:89-91; act4.ts:1045; quizzes.ts:617-634; skript: „strážce Kolik váží nápis 1010?“.
Návrh: „Zeptá se na zákony, které budeš v tomhle patře potřebovat.“

### H-IV-23 · IV-13 · hratelnost · nízká · jistá
**„Vstup A“ výhybky se plete s krystalem A a kvízová nápověda odkazuje na skryté pravidlo**
Popis:
- Nápověda 2 říká „Výhybka pustí horní vstup A…, dolní B“. Kolíky výhybky se jmenují A, B, V, na desce jsou ale i krystaly A a B (operandy), a ty do výhybky přímo nevedou. Ve velké bráně už nápověda píše jen „horní vstup“.
- Kvízová nápověda „Přečti pravidlo brány“ odkazuje na panel s pravidlem, který kvíz zakryje.
Doklad: act4.ts:910, 929 a 1017; machine.ts:27; Workshop.svelte:167-171.
Návrh: V IV-13 psát „horní vstup“. V kvízu dát pravidlo přímo do otázky, nebo nápovědu přepsat („Vzpomeň si: kód 0 je Pouto…“).

### H-IV-24 · patro IV · text · nízká · jistá
**Opakované formule a meta poznámka v hlasu Echa**
Popis:
- „Moderní jméno je …“ zazní pětkrát (IV-1, IV-5, IV-8, IV-10, IV-11).
- Replika za pečeť přesnosti „Bez jediného zbytečného kroku.“ zazní sedmkrát.
- Úvod IV-15 „Žádná kopie komnat: stroje, které spojí, co umíš.“ zní jako poznámka vývojáře k playtestu. Druhá zkouška je přitom skoro IV-13, úloha 1, s jinými kódy.
Doklad: act4.ts:134, 345, 535, 714, 796; 167, 283, 347, 537, 626, 715, 798; 977 a 1012.
Návrh: Obměnit formulace. V IV-15 nechat Echo mluvit o Srdci („Takhle počítá Srdce…“).

## Patro jako celek
Hlubina Strojů je herně nejbohatší patro. Dílna spojuje zkoumání, cíle s Echem a stavbu s průběžnou zkouškou. Cíle (IV-5, IV-8 až IV-11) jsou nejlepší formát hry: hráč stav zažije dřív, než ho Echo pojmenuje. Ideál je spravedlivý (stavba = Zkouška napoprvé, vstupy jde zkoušet zdarma) a ovládání je jednotné s Bránou (klik, Enter, H, T).

Slabiny jsou tři. Tok replik: sedm replik Echa zanikne, v IV-9 Echo hlásí nemožnou chybu, kvíz v IV-11 vysvětluje přetečení, které nenastalo. Čitelnost a přístupnost: číslice na točitých kamenech mají dva významy, čtečka u zkoumání neslyší lampy a ukázka kroku neřekne kde. Obtížnost a odměna: nápověda 2 často prozradí zapojení, fast gate přeskočí tři nové stroje, los ve velké bráně nemění řešení a osm stejných rozhodnutí rozdělovače přijde dvakrát po sobě (IV-6, IV-7).

Hlubší síně cenu mají: paměť, počítadlo a ALU jsou nejsilnější aha momenty hry a stupňují se rozumně (4 → 27 → 54 → 256 možností). Opírají se ale o nepovinné síně II a kromě Kodexu nic neodmění. Největší dluh je konec: základní cesta končí v IV-7 bez příběhu, celá hra v IV-15 obyčejnou deskou a Srdce Observatoře padne jen ve dvou replikách nepovinných komnat. Tón je pro šestnáctileté dospělý a věcný, chybí mu ale gradace, kterou závěr 64 komnat potřebuje.

## Co funguje
- Cíle s Echem (IV-5, IV-8 až IV-11): krok za krokem, objev dřív než pojem. Věta „Světlo v kruhu drží samo sebe“ je nejsilnější v patře.
- Past s Rozcestím v IV-1 a kvíz přesně na ni.
- Abstrakce jako mechanika: hotový stroj se v další komnatě zabalí do jednoho kamene (úplná sčítačka, ozvěna, brána tepu) a nečitelné slovo „abstrakce“ z IV-0 se po IV-3 rozsvítí.
- Ukázka kroku jmenuje runu a její zákon, u hotového stroje pošle ke Zkoušce a rozzáří tlačítko. Zkouška navíc v bráně dává ukázce smysl (až na H-IV-04).
- Okénko „Stroj se spletl: A = 3, B = 1“ a označený řádek desky: chyba má jméno a místo.
- Živé odečty pod deskou (A, B, součet, paměť, hvězdy) vracejí do hry čtení čísel z Aktu I.
- Úvod točitého kamene v IV-3 (jeden kámen, Echo, pulzování) a zkoumání Rovnosti v IV-4 zacelily díry základní cesty z playtestu.
- Počítadlo s chodem v IV-15 je opravdová syntéza, ne kopie komnat.
- Shrnutí patra jako tisknutelný přehled zákonů a Strážce schodů, který jde přeskočit a nebere pečetě.
