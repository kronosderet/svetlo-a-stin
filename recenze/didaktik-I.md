# Didaktik · patro I

Prošel jsem act1.ts komnatu po komnatě v pořadí hráče, k tomu altar.ts, inscription.ts, altarGame/inscriptionGame, altarEvents/inscriptionEvents, stepWords.ts, Level.svelte (nápovědy, automatická pomoc), Altar/Inscription/Dial.svelte, quizzes.ts (Akt I), kodex.ts (Akt I) a generators.ts. Hrál jsem skripty v `scratchpad/sim/didaktik-I/` (`patro1.test.ts`, `slepe.test.ts`, `nahoda.test.ts`, výstupy `out1.txt`, `out2.txt`).

## Komnaty
- **I-0 Probuzení:** Jeden dotek, krystal ve „Stěně“ ukazuje, co udělat, nápovědy stačí i nejslabšímu hráči. Funguje.
- **I-1 Ticho:** Dobrá pointa „I ticho je zpráva“: hráč zažije, že i 0 nese informaci. Nápověda 2 má zájmeno „ho“, které gramaticky ukazuje na krystal ve stěně (D-I-18).
- **I-2 Dvě světla:** Napodobení čtyř vzorů je dobré lešení pro I-3. Replika „Pravá svítí, levá mlčí“ nesedí rodem ke krystalu (D-I-19). Nečitelné slovo „podoba“ se už nikde nepoužije, hra dál říká „kombinace“.
- **I-3 Kolik kombinací?:** Rozdělená deska po dokončení je silný okamžik, zdvojení je vidět. Počet 8 ale deska ukazuje od začátku (D-I-07), nápovědy vedou k odklikání, ne ke zdvojení (D-I-08), a kvíz u nejčastější chyby radí špatný postup (D-I-03).
- **I-4 Váhy kamenů:** Odhalování váhy samotným krystalem i dopočtem a popisek pod „?“ dobře vedou k objevu. Replika k dopočtu („5 − 4 = 1…“) se ale na prvním cíli hned přepíše (D-I-04). Živý součet s rozdílem dovolí hrát „přihořívá“ (to už popsal playtest).
- **I-5 Čtyři váhy:** První cíl 9 zůstává pevný, objev osmičky tedy funguje i s losováním. Echo vyzve k odhadu, který nápověda 1 hned prozradí (D-I-24). Zmínka o glyfech na dveřích dobře navnadí na I-13.
- **I-6 Čtení nápisů:** Postupné mizení opor, které Echo ohlásí, a cílené hlášky (zrcadlo, počet světel, jediný krystal vedle) jsou nejlepší zpětná vazba patra. V polovině průchodů je ale jeden ze dvou holých nápisů souměrný, takže směr čtení se ověří jen jednou (D-I-11).
- **I-7 Brána Předsíně:** Brána střídá čtení a zápis a po ukázce kroku přidá zkoušku navíc, to dává smysl. Zápis ale nemá žádnou zpětnou vazbu a nespustí ani automatickou pomoc (D-I-02). Replika „Poslední zkouška“ neplatí, když přibude zkouška navíc (D-I-14).
- **I-8 Skryté váhy:** Dobrý most k šestnáctce, nápověda 1 („Kolik váží krystal úplně vpravo? A jeho soused?“) vede k zákonu. Živý součet s rozdílem ale prozradí každou váhu jedním dotekem a zvnitřnění tak není potřeba (D-I-09).
- **I-9 Sudé a liché:** Silný nápad (oltář žádá druh čísla) a dobré repliky Echa po přijetí. Kvízy qOdd a qTrailing zkoušejí pochopení, ne vylučování. Ukázka kroku ale zvýrazní osmičku, zatímco text mluví o pravém krystalu (D-I-01). Díky součtu jde komnata vyřešit desítkově (D-I-10) a ideál přeskočí skupinu „dělitelné osmi“ (D-I-25).
- **I-10 Nejvyšší světlo:** Řada 31 → 32 → 63 → 255 bez součtu vede k 2ⁿ − 1 přesně, repliky k ní sedí a distraktory kvízu mají vysvětlení. Chybné nastavení ale nevyvolá žádnou reakci (D-I-02).
- **I-11 Tichý krok:** Nejlepší hlavolam patra. Přerušení cesty funguje a po dvou přerušeních se rozzáří Nápověda. Ukázka kroku jde jinou cestou než nápověda Zrcadlo (D-I-05) a ze slepé uličky slibuje cestu, kterou ve skutečnosti přeruší (D-I-06). Kvíz používá jméno Grayův kód dřív, než ho hra řekne (D-I-16), a hráče oslovuje „abys prošel“ (D-I-17).
- **I-12 Velký nápis:** Procvičení oktávy bez nového nápadu, kvízu i Kodexu. Jako dril je to v pořádku a osmibitový zápis už náhodným klikáním nejde. Zadání a kolo říkají „brána“, i když komnata branou není (D-I-27).
- **I-13 Řeč glyfů:** Objev, že strany glyfu jsou krystaly, je opravdový a Zápisník v šestnáctkovém režimu propojí glyf, dvojkový i desítkový zápis. Ukázka kroku při čtení ale sčítá desítkově (D-I-12), oba kvízy zkoušejí totéž (D-I-21) a čtečka obrazovky glyf nepopíše (D-I-23).
- **I-14 Dvojznak:** Přirozeně navazuje na I-13, barva #FF8800 propojí glyfy se skutečností. Typickou chybu (zrcadlo v každé čtveřici) hra nepozná, nebo ji ohlásí jako prohozené glyfy (D-I-13). Druhá otázka kvízu chce převod s ×16, který komnata neprocvičí (D-I-20).
- **I-15 Velká brána Předsíně:** Tři dovednosti za sebou. Tichý krok přes tři krystaly je lehčí než v I-11 a jeho ukázka kroku má stejné chyby jako tam (D-I-05, D-I-06). Kodex „Hlubší zákony Předsíně“ popisuje Počítadlo, které je dnes v II-1 (D-I-15).

## Nálezy

### D-I-01 · I-9 · chyba · vysoká · jistá
**Ukázka kroku zvýrazní jiný krystal, než o jakém mluví její text**
Popis: U skupin čísel vybírá nápověda 3. stupně krystal podle nejkratší cesty přes všechny skupiny a při shodě dá přednost nejtěžšímu krystalu. Zároveň vypíše pravidlo právě žádané skupiny. Na prvním úkolu „Liché číslo“ proto zvýrazní krystal s váhou 8, pak 4 a teprve potom 1. Text přitom pořád říká, že lichost nese pravý krystal. U „dělitelné čtyřmi“ s rozsvícenou jedničkou radí rozsvítit osmičku, ačkoli text žádá oba pravé krystaly ve stínu. Slabší žák, který ukázku kroku bere, si tak odnese, že o lichosti rozhoduje levý krystal. To je přesně opačná představa, než komnata učí.
Doklad: altar.ts:227–232 (`classCosts`, smyčka od `cfg.bits - 1`), altarGame.svelte.ts:56–59. Výstup `slepe.test.ts`:
`krystaly 0000 | žádá: Liché číslo | zvýrazněn krystal 1. zleva (váha 8) → rozsviť | text: „Liché číslo má rozsvícený pravý krystal, ten s váhou 1. Všechny ostatní váhy jsou sudé. Zvýrazněný krystal rozsviť.“`, potom krystal s váhou 4, teprve třetí ukázka zvýrazní váhu 1. U `0001 | žádá: Číslo dělitelné čtyřmi` zvýrazní váhu 8, „rozsviť“.
Návrh: Pro nápovědu brát jen tahy, které vedou nejkratší cestou k číslu právě žádané skupiny, a při shodě dát přednost krystalu, o kterém mluví pravidlo (pravý, pak druhý zprava). Ideál pro pečeť (`par`) může zůstat globální.

### D-I-02 · I-7 (i I-10, I-12, I-13, I-14, I-15) · didaktika · vysoká · jistá
**Zápis nemá zpětnou vazbu a nespustí ani automatickou pomoc**
Popis: Při zápisu v Nápisu chybí tlačítko Potvrdit a úloha se splní sama, když krystaly přesně odpovídají zadání. Špatné nastavení nevyvolá žádnou událost ani hlášku. Kdo zapisuje zrcadlově (11 jako 1101), jen vidí, že se nic neděje, a nedozví se proč. PLAN 3.4 („Chyba nikdy není jen špatně“) tu neplatí vůbec. Rozzáření Nápovědy počítá jen události `wrong`, `reset` a `pick`, takže se při zápisu nerozsvítí nikdy. Echo samo promluví až po 45 s nečinnosti a každý dotek ten čas vynuluje. Klikající hráč tedy automatickou pomoc nedostane. Čtyřbitový zápis navíc jde najít náhodou: medián je 14–15 doteků. Totéž platí pro oltář bez součtu (I-10).
Doklad: inscription.ts:72–80 (úloha postoupí jen při `mask === task.value`, jinak žádná událost), Inscription.svelte:85–95 (při zápisu jen kolo „Brána žádá“, Potvrdit je až na ř. 123 ve větvi čtení), Level.svelte:112–123 a 125–135. `nahoda.test.ts`: „zápis 11: náhodné klikání průměrně 20.7 doteků, medián 15, 90 % do 45“.
Návrh: Dát zápisu Potvrdit jako u čtení a po chybě ukázat porovnání a hlášku z `readSlip`: „Zapisuješ zrcadlově“, „Liší se krystal s váhou 2“, „Tvé světlo váží 13, brána žádá 11“. Chybné potvrzení počítat jako slip, aby se rozzářila Nápověda. Pokud zápis Potvrdit mít nemá, aspoň počítat slip, když hráč v úloze udělá víc než dvojnásobek ideálu.

### D-I-03 · I-3 · chyba · vysoká · jistá
**Vysvětlení u nejčastější chyby v kvízu radí špatný postup**
Popis: Otázka „Kolik kombinací má řada n krystalů?“ (n = 6–10). U odpovědi o krystal menší (2ⁿ⁻¹) hra napíše: „Zdvojuj n×, začni u jednoho krystalu se dvěma kombinacemi.“ To dá 2ⁿ⁺¹, tedy druhý distraktor. U něj pak hra píše „Zdvojuj jednou za každý krystal“ bez výchozího bodu. Žák s chybou o jedna dostane radu, která ho dovede k chybě o jedna na druhou stranu. Nápověda („Začni u jednoho krystalu (2 kombinace) a s každým dalším zdvojnásob“) ani vysvětlení („2 · 2 · … · 2 (n×)“) s tou radou nesouhlasí.
Doklad: quizzes.ts:80–81. Skript: „n=9: podle rady (2 a 9× zdvojit) = 1024, správně 2^n = 512“. Vzorek: `why 256 → To je o jeden krystal míň. Zdvojuj 9×, začni u jednoho krystalu se dvěma kombinacemi.`
Návrh: „To je o jeden krystal míň. Jeden krystal má 2 kombinace a každý další je zdvojí, tedy ještě (n − 1)×.“ U 2ⁿ⁺¹: „To je o jeden krystal víc. Začni u jednoho krystalu se dvěma kombinacemi, ne u jedné.“

### D-I-04 · I-4 · chyba · střední · jistá
**Odměnu za dopočet váhy přepíše na prvním cíli jiná replika**
Popis: Když hráč rozsvítí krystal 4 a pak 1 (nebo obráceně), přijde v jednom doteku událost `reveal(deduce)` a hned za ní `step#0`. `echo.say` repliky nahrazuje, ne řadí. Věta „5 − 4 = 1. Kámen váhu dopočítal ze součtu.“, kterou si vyžádal playtest (kap. 4.9), tak zmizí pod „Oltář přijal. V zápisníku vidíš totéž moderním zápisem.“ Stane se to u prvního cíle, tedy u prvního dopočtu vůbec. Později se replika ukáže, protože ostatní cíle repliku `step` nemají.
Doklad: altar.ts:116–129 a 155–158 (pořadí událostí), altarEvents.ts:22–27 a 63–64, echo.svelte.ts:20–27 (`say` přepíše `lines`). Skript: „dotek bit 0: toggle, reveal(deduce), step#0“, `echo.step[0] = Oltář přijal…`
Návrh: Repliku k dopočtu přidat (`echo.add`) před repliku kroku, nebo `step[0]` v I-4 sloučit: „5 − 4 = 1. Oltář přijal…“.

### D-I-05 · I-11, I-15/1 · didaktika · střední · jistá
**Ukázka kroku jde jinou cestou než nápověda Zrcadlo**
Popis: Nápověda 2 radí projít kombinace tří pravých krystalů a levý rozsvítit až v polovině. Ukázka kroku hledá cestu od nejtěžšího krystalu, takže levý krystal přepíná pořád: 0000 1000 1100 0100 0110 1110… Kdo začne podle zrcadla (0000 → 0001 → 0011 → 0010) a vezme si ukázku kroku, uvidí hned „rozsviť levý“. Dvě rady si odporují a žák neví, které strategii věřit. Replika „Polovina cesty. Teď přijde zrcadlo.“ při 8 kombinacích pak na cestě z ukázky kroku nedává smysl. Stejné je to v I-15 na třech krystalech.
Doklad: altar.ts:281–302 (`hamiltonStep`, smyčky `for (let i = bits - 1; …`), act1.ts:407, 416, 586. Skript: „I-11 ukázka kroku od začátku: 0000 1000 1100 0100 0110 1110 1010 0010 …“, „I-11 po Zrcadle 0000→0001→0011→0010, pak ukázka kroku: 0010 → 1010(bit3) → …“
Návrh: V `hamiltonStep` zkoušet krystaly od nejlehčího (i = 0 nahoru). Hledání do hloubky tak samo vydá zrcadlový Grayův kód 0000 0001 0011 0010 0110 0111 0101 0100 1100…, přesně podle nápovědy 2 a Kodexu.

### D-I-06 · I-11 (I-15/1, I-3) · chyba · střední · jistá
**Ze slepé uličky ukázka kroku slibuje cestu, kterou přeruší**
Popis: V přísném režimu zní text ukázky kroku vždy „Zvýrazněný krystal vede na kombinaci, kterou deska ještě nezná, a odtud jde cesta dál bez opakování.“ Ze slepé uličky ale `hamiltonStep` vrátí levý krystal naslepo. Dotek pak buď cestu přeruší (deska se vymaže), nebo vede na novou kombinaci, ze které dokončit nejde. Rozpracovaných cest, které mají volného souseda, ale dokončit nejdou, je 23 %. Hráč tedy poslechne nápovědu a přijde o všechno, co měl. V I-3 (bez přísného režimu) slibuje text kombinaci, „kterou deska ještě nezná“, a zvýrazní krystal, který vede na známou.
Doklad: altar.ts:276–302 (komentář „Ze slepé uličky žádná cesta nevede: pak nápověda ukáže krystal, který cestu přeruší“), altarGame.svelte.ts:51–54. `slepe.test.ts`: „I-11: ze 4464 rozpracovaných cest s volným sousedem je 1044 bez možnosti dokončení (23.4 %)“. Příklad `… 0110 | ukázka kroku bit 3 → toggle,repeat,reset`. I-3: „krystaly 000, deska 000 001 011 010 110 100 101; ukázka kroku bit 2 → 100, deska ji zná: true“.
Návrh: Když cesta nejde dokončit, říct to: „Odtud už cesta bez opakování nevede. Začni znovu, třeba zrcadlem.“ A tlačítko nebo zvýraznění, které cestu přeruší vědomě. V I-3 napsat: „Všichni sousedé už na desce jsou. Zvýrazněný krystal vede přes známou kombinaci k té, která chybí.“

### D-I-07 · I-3 · didaktika · střední · jistá
**Otázku „Kolik kombinací?“ zodpoví rozhraní dřív, než hráč přemýšlí**
Popis: Název i úvod („Tři krystaly. Kolik různých kombinací dokážou utvořit?“) stavějí na objevu počtu. Deska ale od začátku ukazuje osm prázdných výklenků s „?“ a čtečka hlásí „nalezeno 1 z 8“. Hráč tedy počet nehledá, jen doplňuje. Zákon 2ⁿ se pak opírá o počet, který nikdo neodvodil. Rozdělená deska na konci jen ukáže dvě poloviny téhož počtu.
Doklad: Altar.svelte:94–117 (`slots = combinations(bits)`, „?“ pro nenalezené), Altar.svelte:100, altarEvents.ts:39, act1.ts:100–102.
Návrh: Než se deska ukáže, nechat hráče tipnout (Echo s volbou 6 / 8 / 9), nebo nechat desku růst bez prázdných míst a počet ukázat až po rozdělení. Nebo po dokončení chtít předpověď pro čtyři krystaly dřív, než přijde kvíz.

### D-I-08 · I-3 · didaktika · střední · jistá
**Nápovědy vedou k odklikání, ne ke zdvojení**
Popis: Nápověda 1 „Zkus měnit vždy jen jeden krystal.“ radí, co mechanika dělá sama (každý dotek mění právě jeden krystal), takže nic neříká. Nápověda 2 i ukázka kroku vedou k další neznámé kombinaci. Ani jedna nevede ke struktuře, kterou komnata pojmenuje: polovina se stínem, polovina se světlem. Pečeť přesnosti (ideál 7) navíc chce Grayův kód, který tu nikdo neučí. Totéž „jediná změna každým dotekem“ je v zadání I-11 i I-15 a v nápovědě 1 v I-11.
Doklad: act1.ts:95–97, 108, 399, 406, 578. altar.ts:179 (`par` pro `all` = 2ⁿ − 1).
Návrh: Nápověda 1: „Nech levý krystal zhasnutý a najdi všechny kombinace dvou pravých. Kolik jich bude?“ Nápověda 2: „Teď levý rozsviť a projdi tytéž kombinace znovu.“ Rozdělená deska pak potvrdí objev, který hráč sám udělal.

### D-I-09 · I-8 · didaktika · střední · jistá
**Živý součet s rozdílem prozradí skryté váhy**
Popis: Komnata má učit váhy nosit v hlavě (Echo: „Přijato. Váhy nosíš v hlavě.“, PLAN: „Pátý krystal (16) si hráč odvodí ze zákona“). Pod krystaly ale svítí „Tvé světlo váží 23“ a k tomu „o 3 víc“ / „chybí 5“. Jeden dotek každého krystalu tedy jeho váhu prozradí a cíl jde dohledat přihříváním bez zákona. Pátý krystal se neodvodí, uvidí se.
Doklad: act1.ts:286 (`showSum: true`), Altar.svelte:146–157 (rozdíl k cíli), act1.ts:299, 301.
Návrh: V I-8 nechat součet, ale bez rozdílu k cíli. Nebo součet nechat zmizet po dvou cílech (`fade` jako v I-6) a Echo to ohlásí: „Teď i součet zmizí. Zákon zůstal.“

### D-I-10 · I-9 · didaktika · střední · pravděpodobná
**Sudé a liché jde vyřešit desítkově, pravidlo krystalů nese jen Echo**
Popis: Komnata ukazuje živý součet. Hráč, který ví, že 3 je liché, nastaví 3 podle součtu a na pravý krystal se vůbec nemusí dívat. Objev „rozhoduje pravý krystal, pak stíny vpravo“ tak hádanka nevynucuje. Řekne ho Echo po přijetí a ověří kvíz (qOdd na oktávě, kde desítkový převod nepomůže). Kdo Echo zavírá (Nikola v playtestu), pravidlo si odnese až z kvízu.
Doklad: act1.ts:333 (`showSum: true`), act1.ts:344–352.
Návrh: V I-9 součet skrýt, váhy hráč zná z I-8, nebo ukázat číslo až po přijetí. Další možnost je skupina, u které desítková znalost nestačí bez pohledu na krystaly, třeba „rozsviť liché číslo, které má vlevo světlo“.

### D-I-11 · I-6, I-7 · didaktika · nízká · jistá
**Souměrné nápisy berou kontrolu směru čtení**
Popis: Generátory nevylučují souměrné kombinace (0110, 1001, 1111). U nich zrcadlové čtení, nejčastější omyl z playtestu (Vojta), vyjde správně. V I-6 je ve 49,8 % průchodů aspoň jeden ze dvou holých nápisů (4. a 5.) souměrný, v 5,5 % oba. V I-7 je aspoň jedno ze dvou čtení souměrné ve 41,3 % průchodů, obě ve 2,7 %. Opakovací otázka na schodech (qRead) souměrné výslovně vylučuje, autoři tedy riziko znají.
Doklad: generators.ts:45–51 a 54–57, quizzes.ts:620–621 (qRead: `while (mirror4(v) === v …)`). `patro1.test.ts`: „I-6: aspoň jeden holý nápis (4. nebo 5.) souměrný: 49.8 %“, „I-7: aspoň jedno čtení souměrné: 41.3 %“.
Návrh: V I-6 vyloučit souměrné hodnoty aspoň u úloh 3–5, v I-7 u obou čtení (`mirrored(v, 4) !== v`).

### D-I-12 · I-13 · didaktika · střední · jistá
**Ukázka kroku při čtení glyfu sčítá desítkově, kotouč ale nese glyfy**
Popis: Nápověda 2 učí glyf číst po stranách (horní 8, pravá 4, dolní 2, levá 1). Ukázka kroku pak napíše „Sečti váhy svítících krystalů: 8 + 2.“ Hráč dostane 10, ale na kotouči jsou glyfy s písmeny 0–F a že 10 = A, hra do té doby neřekla. Vidět je to až v Zápisníku po první vyřešené úloze a v Echu po vyřešení. Kdo 10 napíše na klávesnici („1“, „0“), dostane glyf 0 a obecnou hlášku.
Doklad: stepWords.ts:23–31 (pro čtveřici s glyfy větev `glyphs && bits === 8` neplatí, vrací desítkový součet). Skript: „I-13 čtení 1010: Sečti váhy svítících krystalů: 8 + 2.“ inscription.ts:111–113 (`pushDigit` u jednoho kotouče nechá jen poslední číslici), `readSlip(…, 0, 10)` vrací null.
Návrh: Pro glyfy: „Svítí krystaly s vahami 8 a 2: na glyfu horní a dolní strana. To je glyf A, desítkově 10.“

### D-I-13 · I-14 · chyba · nízká · jistá
**Typická chyba v dvojznaku se nepozná, nebo se pojmenuje špatně**
Popis: Nejpravděpodobnější omyl ve směru je přečíst každou čtveřici zrcadlově (8, 4, 2, 1 zprava). `readSlip` zkouší jen zrcadlo celé oktávy, které by znamenalo prohodit i glyfy, a takovou chybu nikdo neudělá. U čtveřic, které jsou si navzájem zrcadlem (3C, E7), ohlásí zrcadlo po čtveřicích jako „Glyfy jsou prohozené“, tedy jinou chybu, než jaká nastala. Hláška „Liší se jediný krystal: ten s váhou 64“ navíc mluví o vahách oktávy, ačkoli nápověda učí číst každou čtveřici 8, 4, 2, 1.
Doklad: inscription.ts:137–145, inscriptionEvents.ts:13, 19. Skript: „I-14 B6: každá čtveřice zrcadlově → D6: null | celá oktáva zrcadlově → 6D: mirror“, „3C: každá čtveřice zrcadlově → C3: swap“, „jediný krystal vlevo vedle → 7C: one, weight 64“.
Návrh: Pro radix 16 a 8 krystalů zkoušet zrcadlo po čtveřicích před prohozením. U „one“ říct glyf a váhu uvnitř čtveřice: „V levém glyfu se liší strana s váhou 4.“

### D-I-14 · I-7 · chyba · nízká · jistá
**„Poslední zkouška“ není poslední, když přibude zkouška navíc**
Popis: Po čtvrté úloze řekne Echo „Poslední zkouška: nejtěžší světlo čtyř krystalů.“ Když hráč dřív vzal ukázku kroku, brána přidala úlohu na konec, takže 15 poslední není. Ukazatel zkoušek i Echo pak tvrdí každý něco jiného.
Doklad: act1.ts:267, baseGame.svelte.ts:169–181 (úloha navíc na konci), Level.svelte:449.
Návrh: „Teď nejtěžší světlo čtyř krystalů.“

### D-I-15 · I-15 (Kodex predsin-hloub) · chyba · střední · jistá
**Shrnutí Hlubších síní I popisuje komnatu, která už v patře není**
Popis: Záznam „Hlubší zákony Předsíně“ začíná větou „Přičtení jedničky je přenos zprava.“ a v lumenitské části píše „umí krystaly počítat“. Obojí patří k Počítadlu poutníků, které je teď II-1. Chybí naopak parita a dělitelnost (I-9) a mocniny dvojky (I-8). Shrnutí se tiskne jako tahák a učitel ho dostane v přehledu patra, takže nesedí s tím, co žák hrál.
Doklad: kodex.ts:153–162 (ř. 157 a 159), mapa.md (II-1 Počítadlo poutníků, I-9 Sudé a liché).
Návrh: „Váhy jsou mocniny dvojky. Lichost nese pravý bit, každá nula vpravo je jedno dělení dvěma. Bajt nese 0 až 255. Grayův kód… Šestnáctková soustava…“, lumenitsky „umí váhy nosit v hlavě, číst po oktávách i psát glyfy“.

### D-I-16 · I-11 · didaktika · nízká · jistá
**Kvíz používá jméno Grayův kód dřív, než ho hra řekne**
Popis: Kvíz přichází před vyřešením. Otázka „Které dvě kombinace můžou v Grayově kódu stát hned za sebou?“ tak padne dřív, než Echo řekne „Tichý krok má i moderní jméno: Grayův kód.“ a než se odemkne Kodex. Jméno slyšeli jen ti, kdo v I-3 dostali repliku za pečeť přesnosti. Ostatní dostanou neznámý pojem uprostřed otázky.
Doklad: quizzes.ts:176, baseGame.svelte.ts:240–242 (nejdřív kvíz, pak vyřešeno), act1.ts:418, 108.
Návrh: „Které dvě kombinace můžou při tichém kroku stát hned za sebou?“ Moderní jméno nechat až na vysvětlení.

### D-I-17 · I-11 · text · nízká · jistá
**Rodově zatížené oslovení v kvízu**
Popis: „Kolik doteků nejméně potřebuješ, abys prošel všech 16 kombinací…“ oslovuje hráče v mužském rodě.
Doklad: quizzes.ts:158.
Návrh: „Kolik doteků nejméně stačí na všech 16 kombinací řady 4 krystalů?“

### D-I-18 · I-1 · text · nízká · jistá
**Zájmeno v nápovědě ukazuje na jiný krystal**
Popis: „Když krystal ve stěně svítí, rozsviť ho. Když mlčí, zhasni ho.“ Gramaticky „ho“ odkazuje na krystal ve stěně, který jde jen pozorovat. Pravidla zakazují zájmena bez jasného předmětu. Podobně nepřesná je nápověda I-2 „Rozsviť krystaly, které ve stěně září“, protože hráčovy krystaly ve stěně nejsou.
Doklad: act1.ts:39, 67.
Návrh: „Když krystal ve stěně svítí, rozsviť i svůj. Když mlčí, svůj zhasni.“ / „Rozsviť krystaly na místech, kde ve stěně září.“

### D-I-19 · I-2 · text · nízká · pravděpodobná
**Rod v replice nesedí ke krystalu**
Popis: „Ano. Pravá svítí, levá mlčí.“ Krystal je mužského rodu a o „stranách“ ani „světlech“ v replice řeč není.
Doklad: act1.ts:72.
Návrh: „Ano. Pravý svítí, levý mlčí.“

### D-I-20 · I-14 · didaktika · nízká · jistá
**Druhá otázka kvízu zkouší převod, který komnata neprocvičí**
Popis: „Barva #FF8800 … Kolik váží zelený?“ (správně 136) chce dvojznak převést do desítkové soustavy (levý glyf × 16). Komnata převádí jen čtveřice na glyfy. Pravidlo ×16 zazní poprvé ve vysvětlení předchozí otázky (qByteHex) a v Kodexu, který se otevře až po kvízu. Hádá se tak 88 nebo 136 bez opory v hraní.
Doklad: act1.ts:549–555, quizzes.ts:231 (vysvětlení qByteHex), kodex.ts:148.
Návrh: Přidat do komnaty jednu úlohu „Kolik váží dvojznak?“ s desítkovými kotouči. Nebo pravidlo ×16 dát do repliky Echa před kvízem, třeba do `complete`.

### D-I-21 · I-13 · didaktika · nízká · jistá
**Oba kvízy zkoušejí totéž a jádro komnaty vynechávají**
Popis: qGlyphOf („Jaký glyf patří čtveřici 1101?“, možnosti jen A–F) i qGlyphWeight („Kolik váží glyf D?“) zkoušejí jen přiřazení písmen 10–15. qGlyphWeight po první chybě vypíše celou tabulku „A je 10, B 11, C 12, D 13, E 14 a F 15“. Čtení glyfu po stranách, které komnata učí, nezkouší ani jedna otázka.
Doklad: quizzes.ts:185–211, výstup `patro1.test.ts`.
Návrh: Jednu otázku nahradit obrázkem glyfu („Kterou čtveřici nese tento glyf?“, možnosti zrcadlo a otočení), nebo přenosem („Kolik glyfů zapíše 12 krystalů?“).

### D-I-22 · patro I · didaktika · nízká · jistá
**Pojmy a váhy, které hráč ještě nepotkal**
Popis: Kvíz I-3 při n = 8 píše „celá oktáva“, ale oktávu zavádí až I-10 (Hlubší síň). Kodex I-10 vysvětluje 2ⁿ − 1 přenosem („přenos proběhne všemi bity“), který přijde až v Aktu II. Kodex I-9 uvádí „n AND 1“, AND přijde až v Aktu III. Shrnutí základní cesty („Zákony Předsíně“), určené k tisku i pro slabé žáky, má vzorový příklad 45 = 32 + 8 + 4 + 1, a váhy 16 a 32 přitom základní cesta neukazuje.
Doklad: quizzes.ts:77, kodex.ts:100, 91, 113.
Návrh: V I-3 vynechat „celá oktáva“. V I-10 napsat „zhasnou všechny krystaly a rozsvítí se další“. V I-9 napsat „pohledem na nejnižší bit“. Ve shrnutí základní cesty dát příklad do 15 (13 = 8 + 4 + 1 = 1101₂).

### D-I-23 · I-13 · přístupnost · nízká · jistá
**Čtečka obrazovky glyf nepopíše**
Popis: Kotouč s glyfy hlásí jen písmeno (aria-valuetext „A“), ne které strany svítí. Objev, kolem kterého je komnata postavená (strany glyfu = krystaly), je pro nevidomého hráče nedostupný a nápověda 2 mu nepomůže.
Doklad: Dial.svelte:62–68 (`aria-valuetext={face(d)}`).
Návrh: Pro radix 16: aria-valuetext „A: svítí horní a dolní strana“.

### D-I-24 · I-5 · didaktika · nízká · jistá
**Nápověda 1 prozradí, co má hráč odhadnout**
Popis: Echo vyzve „Kolik asi váží? Odhadni to dřív, než se rozsvítí.“ a nápověda 1 hned říká „potřebuješ krystal o váze 8?“. Kdo si o nápovědu řekne na začátku, o objev přijde.
Doklad: act1.ts:168, 175.
Návrh: „Začni zleva: kolik asi váží největší krystal? Rozsviť ho samotný.“

### D-I-25 · I-9 · didaktika · nízká · jistá
**Ideál přeskočí poslední skupinu**
Popis: Oltář přijme číslo rovnou pro další skupinu, pokud do ní patří. Ideál (9 doteků) proto vede přes 8 pro „dělitelné čtyřmi“, a tím rovnou splní i „dělitelné osmi“. Kdo jde za pečetí přesnosti, poslední skupinu sám nehledá. Tři stíny vpravo pak jen slyší v replice „Osmička: tři stíny vpravo.“
Doklad: altar.ts:145–153, skript: „přijato 8 (1000) pro skupiny #3,#4“, „par I-9 = 9“.
Návrh: Pořadí skupin otočit (nejdřív „dělitelné osmi“, potom „dělitelné čtyřmi, ale ne osmi“), nebo u poslední skupiny řetězení vypnout.

### D-I-26 · I-9 · text · nízká · jistá
**Nepřesné formulace v pravidlech skupin**
Popis: „Lichý je jen pravý krystal.“ Lichý ale není krystal, lichou váhu má. „Dělitelné čtyřmi má oba pravé krystaly ve stínu, jinak by zbyla jednička nebo dvojka.“ Zbýt může i trojka. Texty se ukazují v ukázce kroku (altarGame.svelte.ts:56–59).
Doklad: act1.ts:323, 324.
Návrh: „Lichou váhu má jen pravý krystal.“ / „…jinak by zbyla jednička, dvojka nebo trojka.“

### D-I-27 · I-12, I-13, I-14 · text · nízká · jistá
**„Brána“ v komnatách, které branou nejsou**
Popis: Zápis v Nápisu má na kole napevno „Brána žádá“ a zadání „kolik žádá brána“ / „podle glyfu, který žádá brána“, i ve Velkém nápisu, Řeči glyfů a Dvojznaku. Oltář pro totéž používá „Oltář žádá“ / „Požadovaná váha“. V Zahradě už playtest „bránu“ ve třech významech hlásil, tady vzniká stejný zmatek už v prvním patře.
Doklad: Inscription.svelte:91, inscriptionEvents.ts:61, act1.ts:443, 481, 529.
Návrh: Popisek kola brát z komnaty („Nápis žádá“ / „Kotouč žádá“), „Brána žádá“ nechat jen v I-7 a I-15.

### D-I-28 · patro I · chyba · nízká · jistá
**Nápovědy 3. stupně z obsahu se hráči skoro nikdy neukážou**
Popis: Při ukázce kroku hra vypíše `stepHint`, a jen když ten chybí, text z `hints[2]`. `stepHint` existuje u vzorů, desky kombinací, Tichého kroku, skupin, všech nápisů i u oltáře se známými vahami. Texty jako „Zvýrazněný krystal vede cestou, která neskončí ve slepé uličce.“ (I-11) nebo „Brána ukazuje krok: při psaní zvýrazní krystal, při čtení odhalí váhy.“ (I-7, I-12–I-15) tak hráč neuvidí. Ukáže se jen „Zvýrazněný krystal je potřeba přepnout.“ v I-4 a I-5, dokud váha není známá. Autor, který ladí `hints[2]`, ladí mrtvý text.
Doklad: Level.svelte:447–449 (`const text = (step ?? level.hints[e.level - 1])`), altarGame.svelte.ts:46–64, inscriptionGame.svelte.ts (`stepHint`).
Návrh: `hints[2]` buď vypsat před `stepHint` jako úvod, nebo ho v komnatách se `stepHint` odstranit a test hlídat, aby se nepsal zbytečně.

## Patro jako celek
Základní cesta drží pilíř „jeden nápad na komnatu“ (bit, kombinace, 2ⁿ, poziční hodnota, převod, čtení, syntéza) a lešení je promyšlené: velikosti a váhy v I-4/I-5, mizení opor v I-6, brána bez opor. Největší slabina je nesouměrná zpětná vazba. Čtení má vzorovou diagnostiku (zrcadlo, počet světel, jediný krystal). Zápis nemá žádnou: nepotvrzuje se, chyba nemá jméno a automatická pomoc se nespustí (D-I-02), takže brána I-7 zrcadlový zápis ani odklikání neodhalí. Druhá slabina je ukázka kroku s „důvodem“: u skupin čísel a u Tichého kroku důvod nesedí se zvýrazněným krystalem nebo se strategií z nápovědy 2 (D-I-01, D-I-05, D-I-06). Slabší žák, který ukázku kroku bere nejčastěji, tak dostává protichůdné signály a u lichosti přímo mylnou představu. Objev před výkladem oslabuje rozhraní, které výsledek prozradí: osm výklenků v I-3, živý součet s rozdílem v I-8 a I-9 (D-I-07, D-I-09, D-I-10). Kvízy jsou většinou dobré a vysvětlení typických chyb pojmenují mylnou představu. Jedno vysvětlení je ale věcně chybné (D-I-03) a v I-13 a I-14 otázky odbíhají od toho, co komnata procvičila. Přenos drží Strážce schodů a odkazy I-11 na I-3 a I-13 na I-5. Shrnutí Hlubších síní ale popisuje komnatu, která je dnes v Aktu II (D-I-15). Pro žáka s matematickou úzkostí je patro vlídné: krátké věty, chyba bez trestu, nápověda zdarma. Vadí mlčení při zápisu.

## Co funguje
- Mizení opor v I-6 (váhy → velikosti → nic) a Echo, které každý krok ohlásí, je učebnicové lešení.
- Cílené hlášky čtení ve čtyřech krystalech („Čteš zrcadlově. Nejtěžší krystal stojí vlevo.“, „Tolik světel svítí, to sedí. Každé ale váží jinak.“) pojmenují mylnou představu, ne jen chybu. Porovnání nápisu a zadaného čísla je vidět vedle sebe.
- Ukázka kroku u vah (`valueStep`) je ve všech případech správná: když je krystal rozsvícený a nemá být, jeho váha je opravdu větší než zbytek. Ze slepého klikání dělá ukázkový příklad.
- Rozdělená deska v I-3 („Levý krystal ve stínu: 4 kombinace ostatních“) dělá ze zdvojení obraz.
- Dopočet váhy v I-4 a popisek „? = váha zatím neznámá…“ odměňují dedukci.
- Posloupnost cílů v I-10 (31, 32, 63, 255) a repliky k ní vedou k 2ⁿ − 1 bez výkladu.
- Přísný Tichý krok s přerušením, rozzáření Nápovědy po dvou přerušeních a nápověda Zrcadlo dělají z I-11 opravdový hlavolam.
- Řeč glyfů: objev na tvaru kotouče a Zápisník „1010₂ = A₁₆ = 10“ propojí tři zápisy.
- Kvízy s losovanými čísly a vysvětlením u každé typické chyby (qMaxValue, qBitsFor, qTrailing, qByteHex, qOdd s „hustými“ sudými distraktory). Vylučováním se projít nedají snadno.
- Kodex je věcně přesný, „dnes“ dává skutečné souvislosti (KiB = 1024, RGB, rotační snímače) a druhou metodu (dělení dvěma, Hornerovo schéma).
- Volná hra po vyřešení („Kotouče a krystaly jsou teď propojené“) zve ke zkoumání bez tlaku.
