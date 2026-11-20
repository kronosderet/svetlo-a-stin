# Kurikulista · patro II

Skripty: `sim/kurikulista-II/k2.test.ts` (kvízy, generátory, hlášky), `k3.test.ts` (ukázka kroku v II-12 hraním), `k4.test.ts` (počty úloh a doteků); výstup `sim/kurikulista-II/out.txt`.

## Komnaty
- **Strážce schodů (před II-0):** Ptá se na qCombosNext, qRead a qWrite (act2.ts:1033). Čtení a zápis čtveřice jsou přesně to, co Síň potřebuje, otázky jsou věcně správné (ověřeno skriptem). Otázka na 2ⁿ kombinací se ale Síně netýká. Užitečnější by byla otázka na váhy 16 a 32, protože II-4, II-6 a II-7 pracují s pěti a šesti krystaly a základní cesta Předsíně končí u čtyř.
- **II-0 Jedna a jedna:** 1 + 0, 0 + 1 a 1 + 1 s počty a vahami. „Jedna a jedna je 10: jedna-nula, ne deset.“ je přesně podle učebnic. Nečitelný „zákon sloupce“ (act2.ts:83) se přeloží v II-3, to je v pořádku.
- **II-1 Počítadlo poutníků:** Repliky k úlohám 2, 4, 7 a 8 sedí (ověřeno na indexech kroků). Kodex Předání správně zavádí přenos přes přičtení jedničky. Ve vysvětlení kvízu qFlips je chybný tvar čísla („2 jedniček“, K-II-09). Nápověda 1 „změnit co nejméně krystalů“ (act2.ts:117) jde trochu proti kvízu, který učí, že se nemusí měnit jen jeden krystal.
- **II-2 Dvě dvojky:** Pevné 5 + 1, 2 + 2 a 8 + 8, pak losované úlohy. Závěrečná replika „Dvě světla s váhou 8 přetekla až do pátého krystalu“ platí pro obě dvojice z PAIR_TWO (generators.ts:112). Kodex Zákon dvojice je odborně přesný (2w = jedno světlo o sloupec vlevo) a kvízy jsou správné.
- **II-3 Krystaly přenosu:** Zákon sloupce (0–3, nižší číslice dolů) je správně. Echo ale v úvodu nazývá přenos „přetečením“ (K-II-05) a v první úloze píše, že přenos dva sloupce „přeskočil“, přitom jimi prošel (K-II-12). Řetěz přenosů (3 + 1) přichází už tady, ne až v II-4.
- **II-4 Velká kaskáda:** Generátor drží pevnou ukázku 31 + 1 i závěr 63 + 63. Závěrečná replika „Proto má součet o krystal víc než sčítance“ neplatí obecně a v téže komnatě ji vyvrací 31 + 1 = 32 (K-II-07). Kvíz qSumBits správně říká „nejvýš n + 1“.
- **II-5 Přetékající nádoba:** Přetečení bez znaménka je vyložené správně a nápis „Nádoba unese nejvýš 15“ pomáhá. Kodex píše „12 + 6 = 18 − 16 = 2“ (K-II-08). V kvízu je reliktní „pětijiskrová“ nádoba a rovnost bez indexů „1100 + 0110 = 18“ (K-II-13).
- **II-6 Příliv a odliv:** Silná komnata: posun je ×2 a ÷2, 13 → 6 se ztrátou. Kodex Bitový posun je správně (<<, >>, 13 >> 1 = 6, zbytek 1). Slovo „odliv“ tu ale znamená posun vpravo, kdežto v II-8 odčítání (K-II-06).
- **II-7 Brána Síně:** Syntéza sčítání a posunu odpovídá výstupům patra a kvíz přidá přetečení. Po ukázce kroku přibude zkouška navíc, ale Echo dál říká „Ještě jeden součet.“ a „Poslední váha.“ (K-II-20).
- **II-8 Odliv:** Zápis výpůjčky pod menšitele v sousedním sloupci odpovídá české školní metodě („jedna dál“), to je velké plus. Hlášky „10 − 1 = 1“ a „10 − 1 − 1 = 0“ jsou správně. Komnata nemá kvíz (K-II-16). Echo říká „Teď si půjčuj sám.“ (K-II-11).
- **II-9 Zdvojení:** Hornerovo schéma jako stavební návod je odborně přesné a kvízy qHorner a qPowerSteps jsou správné. V Kodexu jsou drobné jazykové chyby (K-II-21).
- **II-10 Násobení po lumenitsku:** Násobení posunem a sčítáním je správně a druhý činitel má vždy dvě jedničky, takže se sčítají dvě řady. Názvy kolísají mezi „první číslo“ a „první činitel“ (K-II-22).
- **II-11 Dělení posunem:** Podíl, zbytek a „dělitelné 2ᵏ, právě když končí k nulami“ jsou přesné a generátor drží jeden úkol beze zbytku. Notace ÷ (kolo, páka) a : (Kodex) se střídá (K-II-14).
- **II-12 Tři řady:** Přenos o dvě místa je odborně správně a Kodex správně říká, že se sejde nejvýš pět jedniček. Ukázka kroku ale ve sloupci se čtyřmi nebo pěti světly radí poslat jedno světlo do sousedního sloupce, a to je chybně (K-II-02). Navíc je tu shoda „se slila pět světel“ (K-II-10) a nápověda 2 nesedí na dvoumístné počty (K-II-18).
- **II-13 Doplněk:** Objev přes třináct jedniček je didakticky výborný. Echo po první losované negaci ale v 86 % případů tvrdí „1101“ (K-II-01). Úlohy odčítání sčítáním míchají čísla bez znaménka s doplňkem, a to v rozporu s Kodexem („nejvyšší bit říká znaménko“, K-II-03). Rozsah ani přetečení se znaménkem se nikde neobjeví (K-II-04) a zápisník ukazuje doplněk jako kladné číslo (K-II-17).
- **II-14 Váhy Osudu:** Syntéza posunu a ±1 a generátor drží pět úloh na 3 a 4 tahy bez přetočení. Kvíz qSubtract (písemné odčítání) se ke komnatě nevztahuje, patří do II-8 (K-II-16). Kodex tu chybí záměrně.
- **II-15 Velká brána Síně:** Odčítání, násobení a Váhy dobře shrnují Hlubší síně. Komnata nemá kvíz (stejně jako I-15). Shrnutí „Hlubší zákony Síně“ je věcně správně.

## Nálezy

### K-II-01 · II-13 · chyba · vysoká · jistá
**Echo po první negaci tvrdí „1101“, i když se úloha losuje**
Popis: Druhá zkouška Doplňku má generátor, který losuje tři různá čísla 1–7 a první úlohu nedrží na 3. Replika ke kroku 0 je ale napsaná pro pevnou úlohu −3: „1101, stejně jako po třinácti jedničkách. Přičti k němu to původní a nádoba přeteče na nulu.“ Kdo právě zapsal třeba −5 = 1011, slyší od Echa „1101“. Komnata tak spojuje špatný zápis se záporným číslem, které hráč právě vyrobil.
Doklad: act2.ts:815 (step 0), generators.ts:365-368 (genII13Negate bez pevné první úlohy), levels.ts:83 (generátor vždy nahradí config). Skript: „genII13Negate first task != 3 share 0.86“. Zásada v generators.ts:4: „Kde Echo komentuje konkrétní úlohu…, ta zůstává pevná.“
Návrh: V genII13Negate držet první úlohu pevně `{ start: 3, target: 13, show: '−3' }` a losovat jen další dvě. Jinak repliku zobecnit: „Stejně jako po jedničkách: přičti k tomu původní číslo a nádoba přeteče na nulu.“

### K-II-02 · II-12 · chyba · vysoká · jistá
**Ukázka kroku ve sloupci se čtyřmi a pěti světly radí přenos do sousedního sloupce**
Popis: Ukázka kroku (nápověda 3) u krystalu výsledku vždycky řekne „…a jedno světlo přeteče do sloupce vlevo“. Ve sloupci se čtyřmi světly (100) se ale do sousedního sloupce nepošle nic, jedno světlo jde o dvě místa. U pěti světel (101) je to stejné. Komnata, jejímž jediným novým nápadem je přenos o dvě místa, tak v ukázce kroku učí opak a hráč, který radu poslechne, dostane chybu u přenosu.
Doklad: cascadeWords.ts:78-80 (větev pro inflow ≥ 2 bez rozlišení farCarries). Skript k3.test.ts, hraní 15 + 15 + 15: „A) ukázka kroku: Ve druhém sloupci zprava se slévají čtyři světla, to je 100. Dole zůstane stín a jedno světlo přeteče do sloupce vlevo.“ „B) … Ve čtvrtém sloupci zprava se slévají pět světel, to je 101. Dole zůstane světlo a jedno světlo přeteče do sloupce vlevo.“
Návrh: Pro inflow ≥ 4 napsat zvláštní větu podle číslic: „…čtyři světla, to je 100. Dole zůstane stín, vedle nic a jedno světlo putuje o dvě místa.“ / „pět světel, to je 101: dole světlo, vedle nic, o dvě místa jedno.“ Do testu cascadeWords přidat případ s farCarries.

### K-II-03 · II-13 · chyba · vysoká · jistá
**„Spodní řada je doplněk, tedy záporné číslo“ neplatí pro losované úlohy a horní řada má znaménkový bit**
Popis: Třetí zkouška počítá modulo 16, ale vydává se za počítání se zápornými čísly. (1) Spodní řada je zadaná jako 16 − b pro b až 14. V 17,6 % úloh má tedy „záporné číslo“ nejvyšší bit 0, například 0111 jako doplněk devítky. Ve čtyřech bitech je to +7 a −9 se do čtyř bitů vůbec nevejde. (2) Horní řada je v 51 % úloh (i v pevných 1100 a 1001) číslo s nejvyšším bitem 1, které se čte jako kladné 12 nebo 9. Kodex Doplněk přitom hned potom tvrdí: „Nejvyšší bit zároveň říká znaménko.“ Podle něj je 1100 = −4. Hráč tak v jedné komnatě slyší dvě neslučitelná pravidla. Stejně je na tom kvíz qComplementSum: menšenec je v 77 % případů ≥ 8, například „0110 + 1011 … což je 6 − 5“ je v pořádku, ale „1001 + 1010 … což je 9 − 6“ už ne.
Doklad: act2.ts:829-831 a 836, generators.ts:377-379 (`a = int(3, 15)`, `b = int(1, a − 1)`), kodex.ts:312, quizzes.ts:502-503. Skript: „genII13Add top row MSB=1 share 0.513; bottom row MSB=0 share 0.176“, příklady „1110 (14) + 0111 (doplněk 9) = 0101 (5)“, „qComplementSum a>=8 share 0.773“.
Návrh: Držet se rozsahu čtyřbitového doplňku: a od 1 do 7, b od 1 do a (výsledek 0–6), případně b = 8 jako −8. Kvíz stejně. Jestli je záměrem počítání bez znaménka modulo 16, pak v zadání nepsat „záporné číslo“ a z Kodexu vypustit větu o znaménku, nebo ji vysvětlit („1100 je buď 12, nebo −4, podle toho, jak nádobu čteme“).

### K-II-04 · II-13 / patro · kurikulum · střední · jistá
**Rozsah doplňku a přetečení se znaménkem chybí, „přetečení“ se plete s přenosem**
Popis: Hra nikde neřekne, že čtyři bity v doplňku nesou −8 až 7, ani že přetečení se znaménkem je něco jiného než přenos z nejvyššího bitu (0111 + 0001 = 1000 = −8, kdežto 0111 + 1101 přetéká „neškodně“). V II-13 se přitom zahozený přenos opakovaně nazývá přetečením: „Přetečení spadlo do přepadu…“, „Přetečení zahodíme…“. Kodex Přetékající nádoba má modernName „Přetečení (overflow)“ a odkazuje na příznak přenosu (carry flag). Skutečné procesory mají pro přetečení se znaménkem zvláštní příznak (overflow flag). Žák si odnese „přetečení = přenos, který se zahodí“, a to je v doplňku chybná představa. PLAN 1.1 přitom žádá „chápat přetečení“ i „záporná čísla ve dvojkovém doplňku“. Drobnost na okraj: Kodex Předání tvrdí, že „procesor si přenos pamatuje ve zvláštním bitu“, ale příznak drží jen přenos z nejvyššího bitu.
Doklad: act2.ts:849, quizzes.ts:511 a 516, kodex.ts:217-223 a 312, kodex.ts:187. Hledání „znaménk|záporn|−8“ v src/content najde jedinou větu o znaménku (kodex.ts:312) a žádný rozsah. PLAN.md:28 a 32.
Návrh: Do Kodexu Doplněk přidat: „Čtyři bity v doplňku nesou −8 až 7. Přenos z nejvyššího bitu se zahazuje, přetečení je, když se výsledek do rozsahu nevejde (7 + 1 = 1000 = −8).“ Do kvízu II-13 dát otázku „0111 + 0001 v doplňku = ?“. V textech II-13 psát „přenos z nejvyššího sloupce“ místo „přetečení“.

### K-II-05 · II-3 / patro · kurikulum · střední · jistá
**„Přetečení“ znamená jednou přenos mezi sloupci, jindy overflow**
Popis: II-3 zavádí krystal přenosu větou „Odteď zapiš každé přetečení krystalem přenosu nad sloupec vlevo“. O dvě komnaty dál Kodex přeloží „Přetékající nádoba → Přetečení (overflow)“ jako ztrátu nejvyššího přenosu. Česká učebnicová terminologie oba pojmy odlišuje. PLAYTEST 4.5 na to upozornil („přenos… a přetečení“) a jednotný slovník se zavedl jen pro předání a přenos. V II-3 a II-13 (K-II-04) podstatné jméno „přetečení“ pro přenos zůstalo.
Doklad: act2.ts:232; kodex.ts:214-221; PLAYTEST.md:233.
Návrh: II-3: „Odteď zapiš každý přenos krystalem přenosu nad sloupec vlevo…“. Sloveso „přetéct“ jako obraz vody může zůstat, podstatné jméno „přetečení“ vyhradit nádobě.

### K-II-06 · II-6, II-8, II-15 · kurikulum · střední · jistá
**Lumenitské „odliv“ se překládá na dva různé moderní pojmy**
Popis: V II-6 je „Příliv a odliv“ bitový posun a Echo říká „Odliv půlí.“ Komnata II-8 „Odliv“ (Kodex Odliv) je ale odčítání s výpůjčkou a II-15 o odčítání mluví jako o „odlivu“. PLAN 2.3 staví most mezi světy na tom, že jedno lumenitské slovo odpovídá jednomu modernímu pojmu. Tady se hráč v Kodexu dočte, že odliv je posun i odčítání.
Doklad: act2.ts:372 a 401, kodex.ts:240 („Příliv a odliv“ → Bitový posun), act2.ts:505, kodex.ts:228 („Odliv“ → Odčítání s výpůjčkou), act2.ts:916 a 926.
Návrh: Přejmenovat II-8 (třeba „Úbytek“ nebo „Půjčka“) a v II-15 psát „odčítání“. Druhá možnost je přejmenovat páky v II-6 („Příliv a ústup“).

### K-II-07 · II-4 · chyba · střední · jistá
**„Proto má součet o krystal víc než sčítance“**
Popis: Závěrečná replika tvrdí jako obecné pravidlo, že součet má o krystal víc. Ve stejné komnatě přitom první úloha 31 + 1 = 32 = 100000₂ zůstane v šesti krystalech, a kvíz i Kodex správně říkají „nejvýš n + 1“.
Doklad: act2.ts:296; act2.ts:267 (011111 + 000001); kodex.ts:208; quizzes.ts:297.
Návrh: „Proto může mít součet o krystal víc než sčítance, nikdy ne o dva.“

### K-II-08 · II-5, II-13 (Kodex) · chyba · střední · jistá
**Řetězy rovností, které neplatí: „12 + 6 = 18 − 16 = 2“**
Popis: Kodex Přetékající nádoba píše „Ve 4 bitech je 12 + 6 = 18 − 16 = 2“. Jako řetěz rovností je to nepravda (18 ≠ 2) a takový zápis se v matematice opravuje. Totéž platí pro „v bajtu je 255 + 1 = 0“ a pro Kodex Doplněk „7 − 3 = 0111 + 1101 = (1)0100 = 4“. Učitel to dostane vytištěné ve Shrnutí patra.
Doklad: kodex.ts:220 a 313; SummaryScreen.svelte (tiskne `e.modern` a `e.formula`).
Návrh: „12 + 6 = 18; ve 4 bitech zbude 18 − 16 = 2. V bajtu zbude po 255 + 1 nula.“ Doplněk: „7 − 3: 0111 + 1101 = (1)0100, ve 4 bitech zbude 0100 = 4.“

### K-II-09 · II-1 · text · střední · jistá
**qFlips: „2 jedniček vpravo zhasne“, „Zhasne 3 jedniček“**
Popis: Pro k = 2 až 4, tedy v polovině losování, je ve vysvětlení i v důvodu špatné odpovědi chybný tvar čísla a slovesa. Hráč to vidí po každé odpovědi a otázka je i v pracovním listu.
Doklad: quizzes.ts:112 a 116. Skript: „explain: 2 jedniček vpravo zhasne… why: Zhasne 2 jedniček, ale rozsvítí se ještě nula za nimi.“
Návrh: Použít `plural` (z game/text) a shodu: „2 jedničky vpravo zhasnou“, „5 jedniček vpravo zhasne“.

### K-II-10 · II-12 · text · nízká · jistá
**„Se slila pět světel“, „se slévají pět světel“**
Popis: U pěti světel nesedí shoda: má být „slilo/slévá se pět světel“. Pět světel se ve sloupci slije v každém 15 + 15 + 15, tedy v pevné závěrečné úloze.
Doklad: cascadeWords.ts:28 (FLOW[5] = 'pět světel') v šablonách na řádcích 48, 51, 80 a 81. Skript: „Ve sloupci vpravo se slila pět světel, to je 101…“, „Ve čtvrtém sloupci zprava se slévají pět světel…“.
Návrh: Sloveso brát z tabulky podle počtu (slila / slilo, slévají / slévá).

### K-II-11 · II-8 · text · nízká · jistá
**„Teď si půjčuj sám.“**
Popis: Oslovení hráče v mužském rodě, proti pravidlu pro texty.
Doklad: act2.ts:541.
Návrh: „Teď si půjčuj bez pomoci.“ nebo „Další výpůjčky zapíšeš ty.“

### K-II-12 · II-3 · text · nízká · jistá
**„Přenos přeskočil dva sloupce.“**
Popis: V 0011 + 0001 přenos prošel druhým i třetím sloupcem (přenosy nad sloupci 2 a 3), nic nepřeskočil. „Přeskočil dva sloupce“ zní, jako by dopadl až do čtvrtého.
Doklad: act2.ts:236. Skript: „II-3 task0 3+1 carries 00110“.
Návrh: „Přenos prošel dvěma sloupci, jako voda, která se přelévá z misky do misky.“

### K-II-13 · II-5 · text · nízká · jistá
**„Pětijiskrová nádoba“ a rovnost bez indexů „1100 + 0110 = 18“**
Popis: „Jiskra“ je pozůstatek starého názvu krystalu (id záznamu 'jiskra'), hra jinak všude říká krystal. Otázka míchá v jedné rovnosti dvojkový a desítkový zápis bez indexu, takže doslova čte 1100 + 110 = 18. V pracovním listu bez hry je to matoucí. Podobně qPairSum „Kolik je 0111 + 0100?“ nemá index ani desítkovou nápovědu.
Doklad: act2.ts:353 a 357; quizzes.ts:256.
Návrh: „Pětikrystalová nádoba…“, „…aby se do ní vešlo 1100₂ + 0110₂ = 18?“. U otázek, které jdou do pracovního listu, psát index ₂.

### K-II-14 · patro · kurikulum · nízká · jistá
**Notace dělení a násobení proti českým zvyklostem, „·“ zároveň jako oddělovač**
Popis: Kolo, páky a zápisník dělí znakem „÷“ (÷ 4, ÷2), Kodex a kvízy dvojtečkou (13 : 2, 45 : 4, c : 8). Násobení je jednou „×“ (zápisník, II-15, qFastMul), jindy „·“ (Kodex). V Kodexu slouží „·“ i jako oddělovač dvou vzorců: „4 = 100₂ · 5 = 101₂“ se čte jako 4 = 100₂ krát 5. V Příliv a odliv stojí „5 · 2 = 10“ a vzápětí „·“ jako oddělovač.
Doklad: Tide.svelte:28, TideLedger.svelte:21, act2.ts:655-658, kodex.ts:245, 291 a 302, quizzes.ts:479.
Návrh: Sjednotit na české „:“ a „·“ (případně „×“ všude). Vzorce v Kodexu oddělovat středníkem nebo novým řádkem, ne středovou tečkou.

### K-II-15 · patro · kurikulum · střední · pravděpodobná
**Základní cesta nenaplní cíle PLAN 1.1 pro odčítání a doplněk, učitel je nemá jak ověřit**
Popis: PLAN 1.1 slibuje, že hráč umí „odčítat ve dvojkové soustavě s… výpůjčkou“ a chápe „záporná čísla ve dvojkovém doplňku“. Obojí je ale jen v nepovinných Hlubších síních (II-8, II-13, II-15) a PLAN 6 výslovně říká, že odčítání „sexta nutně nepotřebuje“. Učebnice informatiky pro SŠ obvykle probírají dvojkové sčítání a odčítání spolu (tady jen pravděpodobné, kurikulum v repozitáři citované není). Pracovní list bere otázky jen ze základní cesty, takže učitel, který s třídou hraje Hlubší síně, nemá k odčítání, násobení ani doplňku nic na papír.
Doklad: PLAN.md:28, 32 a 304-305; WorksheetScreen.svelte:22-24 (`basicRooms(act)`); act2.ts:503-548 a 741-860.
Návrh: Buď přesunout Odliv (odčítání s výpůjčkou) do základní cesty a PLAN 1.1 rozdělit na základ a rozšíření, nebo cíle v 1.1 označit jako „Hlubší síně“. Pracovní list dát i pro Hlubší síně (`advancedRooms`), případně přepínač základ / vše.

### K-II-16 · II-8, II-14 · didaktika · nízká · jistá
**Odliv nemá kvíz, otázka na odčítání je až ve Vahách Osudu**
Popis: II-8 je jediná komnata Hlubších síní s novým pojmem bez kvízu. Cyklus „pojmenuj, procvič, zeptej se proč“ se tu přeruší a pečeť přesnosti nemá kvízovou složku. qSubtract (písemné odčítání s výpůjčkou) je přidaný k II-14, kde se odčítání pod sebou nehraje. Kodex Odliv navíc popisuje jen případ 0 − 1, ne výpůjčku přes nuly (1000 − 0001), kterou komnata hned procvičuje.
Doklad: act2.ts:503-548 (bez quiz), act2.ts:906-909, kodex.ts:232.
Návrh: Přesunout qSubtract do II-8 a přidat otázku „1000 − 0001: kolik výpůjček?“. Do II-14 dát otázku na posun a ±1 (třeba „nejkratší cesta z 12 na 47“). Do Kodexu doplnit větu: „Když ani soused vlevo nemá z čeho půjčit, půjčí si on od svého souseda.“

### K-II-17 · II-13 · didaktika · střední · jistá
**Moderní zápis ukazuje doplněk jako kladné číslo**
Popis: Zadání třetí zkoušky říká, že spodní řada je záporné číslo, ale zápisník Kaskády píše „0111 7 + 1101 13 = (1)0100 20 → 4“. „−3“ se nikde neobjeví. Ve druhé zkoušce zápisník Přílivu píše „3 → 13“ a ukázka kroku „Nejkratší cesta k 13“, zatímco kolo ukazuje „−3“. Most mezi lumenitským a moderním zápisem (PLAN 2.3) tu míjí právě tu myšlenku, kterou komnata učí: 1101 znamená −3.
Doklad: CascadeLedger.svelte:15-33 (dec = String(o)), TideLedger.svelte:36-41, stepWords.ts:80, act2.ts:791 a 836.
Návrh: Pro úlohy s doplňkem (příznak v úloze nebo v configu) psát v zápisníku „1101 −3“ a výsledek „7 − 3 = 4 (přenos zahozen)“, v Přílivu „3 → −3 (1101)“.

### K-II-18 · II-12 · didaktika · nízká · jistá
**Pravidlo v nápovědě 2 nesedí na dvoumístné počty**
Popis: „Dvě světla = 10, tři = 11, čtyři = 100, pět = 101. Poslední číslice zůstane dole, prostřední jde do sousedního sloupce, první o dvě místa do horní řady.“ U 10 a 11 je „první“ číslice ta, která jde do sousedního sloupce, ne o dvě místa. Kdo pravidlo čte doslova, pošle u dvou světel jedničku o dvě místa.
Doklad: act2.ts:719.
Návrh: Psát počty vždy třemi číslicemi: „010, 011, 100, 101: poslední zůstane dole, prostřední jde vedle, první o dvě místa.“

### K-II-19 · II-3 / Kaskáda · didaktika · nízká · pravděpodobná
**„Dvě světla … a jedno přeteklo“ proti „dvojice přeteče“**
Popis: Kodex Zákon sloupce i II-2 říkají, že dvojice přeteče jako jedno světlo vlevo, a animace pošle do krystalu přenosu dvě světla. Hlášky a repliky II-3 ale opakují „dvě světla… a jedno přeteklo“ a „tři světla: jedno zůstane, jedno přeteče“. U dvou světel to svádí k typické chybě „1 + 1 = dole 1, přenos 1“: jedno přeteklo, druhé tedy zůstalo?
Doklad: cascadeWords.ts:64 a 80, act2.ts:237 a 241, kodex.ts:194.
Návrh: „Dvě světla: dole stín, dvojice přeteče jako jedno světlo vlevo.“ / „Tři světla: jedno zůstane, dvojice přeteče.“

### K-II-20 · II-7 · chyba · nízká · jistá
**Po zkoušce navíc Echo špatně počítá, kolik úloh zbývá**
Popis: Když hráč v bráně použije ukázku kroku, přibude na konec části losovaná úloha. Repliky „Ještě jeden součet.“ (po druhém součtu), „Poslední váha.“ (po druhé váze) a úvod „tři součty“ ale zůstanou, takže po nich přijdou ještě dvě úlohy.
Doklad: baseGame.svelte.ts:170-183 (#addExtraTask), act2.ts:458, 461 a 491.
Návrh: Repliky bez počtu („Další součet.“, „Další váha.“), nebo je přeskočit, když je přidaná úloha (`extraAdded`).

### K-II-21 · II-5, II-9 (Kodex) · text · nízká · jistá
**„z Čtení nápisu“, „přidej ještě jedna“, „zbyde“**
Popis: Spisovně je „ze Čtení nápisu“ (z/ze před skupinou čt-) a „přidej ještě jedničku“ (jinde hra píše „přidej jednu“). „Zbyde“ je hovorové, jinde hra píše „zbude“.
Doklad: kodex.ts:255 a 221.
Návrh: Opravit, jak je uvedeno.

### K-II-22 · II-10 · text · nízká · jistá
**„První číslo“ proti „první činitel“ a „posunutá o 0 míst“**
Popis: Zadání a nápovědy II-10 i qCopies mluví o „prvním a druhém čísle“. Legenda desky, hlášky, II-15 a Kodex používají „činitel“, tedy učebnicový termín. Vysvětlení qCopies má „kopie posunuté o 0, 3 míst“ a hláška u nultého posunu „Kopie posunutá o 0 míst“.
Doklad: act2.ts:614 a 622-623, quizzes.ts:431 a 440, Cascade.svelte:514, cascadeWords.ts:43-44, act2.ts:970. Skript: „kopie posunuté o 0, 3 míst (×1, ×8)“.
Návrh: Všude „první / druhý činitel“. U posunu 0 psát „neposunutá kopie“, výčet „o 0 a 3 místa“.

### K-II-23 · patro · kurikulum · nízká · jistá
**Učitel nemá mapování na RVP a téma patra je užší než obsah**
Popis: Shrnutí patra tiskne jen Kodex a mapování na RVP je v plánu neodškrtnuté. Téma „Sčítání a přenos“ na kartě patra, v pracovním listu a ve Shrnutí nepokrývá posun, který je v základní cestě, ani odčítání, násobení, dělení a doplněk v Hlubších síních (PLAN 2.4 má „sčítání, odčítání, přetečení, posuny, násobení“).
Doklad: PLAN.md:867 („[ ] … mapování na RVP“), act2.ts:1028, PLAN.md:120.
Návrh: Téma „Počítání ve dvojkové soustavě“. Ke Shrnutí patra přidat učitelský blok: komnata, pojem, očekávaný výstup a odhad času (viz Patro jako celek).

### K-II-24 · II-8 · text · nízká · pravděpodobná
**„odečte se spolu s ní“: zájmeno bez jasného předmětu**
Popis: V nápovědě 2 „Výpůjčku zapiš krystalem pod spodní řadu ve sloupci vlevo, odečte se spolu s ní.“ může „ní“ být výpůjčka i spodní řada a podmět „odečte se“ chybí.
Doklad: act2.ts:531.
Návrh: „…ve sloupci vlevo. Tam se odečte spolu se spodní řadou.“

### K-II-25 · II-8 · chyba · nízká · jistá
**„Výpůjčka prošla několika sloupci“ i u dvou oddělených výpůjček**
Popis: Replika po třetí úloze předpokládá řetěz výpůjček. Generátor ale chce jen aspoň dvě výpůjčky, takže výjimečně padne 1010 − 0101, kde jsou dvě nezávislé.
Doklad: act2.ts:542, generators.ts:241. Skript: řetěz chybí ve 2,6 % losování („1010 − 0101 carries=1010“).
Návrh: V genII8 pro k = 1 požadovat sousední výpůjčky (`carries & (carries << 1)`), nebo repliku zobecnit.

## Patro jako celek
Odborně stojí patro pevně: zákon dvojice, zákon sloupce, řetěz přenosů, posun jako ×2 a ÷2 se ztrátou, podíl a zbytek při dělení 2ᵏ, Hornerovo schéma i přenos o dvě místa jsou vyložené správně a kvízy mají správné odpovědi. Výpůjčka pod menšitelem sousedního sloupce odpovídá české školní metodě. Slabá místa jsou tři. Doplněk míchá čísla bez znaménka s doplňkem a vynechá rozsah i přetečení se znaménkem. Slovník se rozjíždí (přetečení je přenos i overflow, odliv posun i odčítání). U losovaných úloh a v ukázce kroku u tří řad tvrdí některé hlášky neplatné věci (K-II-01, K-II-02).
Pokrytí PLAN 1.1: sčítání s přenosem, přetečení bez znaménka a posun jsou v základní cestě celé. Odčítání s výpůjčkou a doplněk jsou jen v Hlubších síních (K-II-15). V revidovaném RVP G se patro mapuje na reprezentaci dat a princip počítače: binární aritmetika a pevná šířka slova. Přesné znění výstupů repozitář necituje.
Čas: základní cesta má 38 úloh a 12 otázek (k4.test.ts), s Kodexem a Strážcem asi 40–50 minut, tedy jedna hodina. Pomalejší žák bránu nestihne. Hlubší síně (36 úloh, 10 otázek, Váhy s návraty) zaberou 1–1,5 hodiny. Návrh: hodina 1 II-0 až II-7, hodina 2 II-8 až II-12, hodina 3 nebo doma II-13 až II-15. Učitel potřebuje list i k Hlubším síním, indexy ₂ v listu a stručný přehled komnat s pojmy a výstupy.

## Co funguje
- Posloupnost základní cesty: jedna a jedna, přenos přes přičtení jedničky, dvojice bez srážek, krystal přenosu, řetěz, pevná nádoba, posun. Na každou komnatu jeden nový nápad.
- Kodex přesně odlišuje lumenitské a moderní jméno a skoro všechny vzorce jsou číselně správně (ověřeno ručně: 13 + 9 = 22, 45 : 4 = 11 zb. 1, 5 · 6 = 11110₂, 15 + 15 + 15 = 101101₂ = 45).
- Česká školní metoda odčítání: výpůjčka pod menšitelem sousedního sloupce, hlášky „10 − 1 = 1“ a „10 − 1 − 1 = 0“.
- II-9 Zdvojení dává Hornerovo schéma z I-6 jako stavební návod a navazuje přímo na Kodex Čtení nápisu.
- II-13 začíná objevem (13 jedniček vyprázdní nádobu) a teprve pak přijde zkratka převrať a +1.
- Kvízy s losovanými čísly vysvětlují typické chyby (zrcadlo, počet světel, podíl místo zbytku, XOR místo rozdílu).
- Generátory drží podmínky komnat (aspoň jedna výpůjčka, Váhy bez přetočení, pevné úlohy, ke kterým se Echo vyjadřuje). Výjimky jsou K-II-01 a K-II-25.
- Opory mizí postupně (váhy po třech součtech v II-2, počty po prvním součtu v II-4) a nápis „Nádoba unese nejvýš 15“ je přímo na desce.
