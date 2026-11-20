# Kurikulista · patro III

Prošel jsem Strážce schodů, III-0 až III-15, záznamy Kodexu (kodex.ts:329–490), runy (runes.ts), generátory (generators3.ts), logiku (core/logic.ts, puzzles/gate.ts, table.ts, mask.ts), hlášky (gateEvents.ts, maskEvents.ts, stepWords.ts) a pracovní list (WorksheetScreen.svelte). Ověřovací skript: `sim/kurikulista-III/k3.test.ts` (600 losů na generátor). Všechny pravdivostní tabulky, vzorce v Kodexu a správné odpovědi kvízů jsem přepočítal a jsou věcně správně. Nálezy níže se týkají textů, toku, posloupnosti a pokrytí.

## Komnaty
- **Strážce schodů:** Tři losované otázky (qAdd, qShiftLeft, qRead, act3.ts:946) jsou správné, mají vysvětlení typických chyb a opakují to hlavní z pater I a II: sčítání s přenosem, posun a čtení čísla. Na logiku nepřipravují, ale to ani nemají (PLAN 10.2).
- **III-0 Cesta světla:** Jeden dotek bez runy, dobrý nultý krok. Úvodní věta „Nejjednodušší kámen v cestě jmenovali Obraceč“ má špatnou vazbu a jmenuje kámen, který na desce není (K-III-20).
- **III-1 Obraceč:** Tři obvody vedou od ¬A k ¬¬A = A a třetí má správně dvě řešení. Kvíz „Světlo projde dvěma Obraceči“ je dvojznačný, protože světlo je ve hře hodnota 1 (K-III-07). Zadání mluví o jednom kameni, třetí obvod má dva (K-III-20).
- **III-2 Pouto:** Objev, deska, kvíz a pojmenování (konjunkce, ∧) v učebnicovém pořadí. qTableRows zobecní počet řádků 2ⁿ a naváže na I-3. Desku lze opsat z lampy. Je to záměr (PLAYTEST 9.3.2), PLAN.md:363 ale pořád píše „zpaměti“ (K-III-10).
- **III-3 Rozcestí:** Nevylučovací „nebo“ (kino, divadlo) je vysvětlené přesně, jak ho učí matematika. Kvíz o řádcích, kde se Pouto a Rozcestí liší, je správný.
- **III-4 Jen jeden:** Vazba XOR na číslici součtu z patra II je nejsilnější mezipatrový most hry. Jako jediná ze čtyř základních run ale v Echu nedostane svůj znak ⊻ a Kodex mluví o „spodní“ číslici, kde patro II říká „nižší“ (K-III-15).
- **III-5 Které pravidlo?:** Poznávání ze tří run a Kodex Pravdivostní tabulka (2ⁿ řádků) jsou správně. Vyplňovací úlohy se dají opsat z lampy, takže „podle runy desku vyplnit“ se tu necvičí (K-III-10).
- **III-6 Řetězy:** NAND, NOR a Rovnost vznikají přesně podle pravidla „runa a za ní Obraceč“. Losované větvení ve 32 % chce oba vstupy obrácené. To je De Morgan dřív, než ho III-8 pojmenuje, a nápověda přitom radí obrátit „jeden vstup“ (K-III-04). Nápovědy při zkoumání větvení mluví o kamenech (K-III-05), Echo říká „postav sám“ (K-III-06).
- **III-7 Brána Zahrady:** Syntéza ve třech zkouškách. Výpočet tabulky složeného obvodu se tu chce poprvé (K-III-10). Nápověda „za ni dej Obraceč“ u větvení nesedí, protože za spojovací runou žádný kámen není (K-III-04).
- **III-8 Zrcadla:** Didakticky i odborně výborná komnata: dvě desky vyjdou stejně, pak hráč postaví NOR jako ¬A ∧ ¬B. Oba kvízy používají formální zápis správně. Pro třetinu hráčů ji ale předběhne III-6 (K-III-04).
- **III-9 Rovnost a důsledek:** Ekvivalence a implikace odpovídají matematice. Vysvětlení „slib nikdo neporušil“ a typická chyba „neprší a je mokro“ jsou přesné. Lumenitské jméno Důsledek může kolidovat se školním „důsledek = závěr“ (K-III-13).
- **III-10 Hlas většiny:** Osm kombinací a stavba pěti kamenů mají obě duální řešení (skript: přesně 2). Kodex zapisuje AB ∨ AC ∨ BC, tedy míchá zkrácený zápis konjunkce s ∨ bez vysvětlení (K-III-14).
- **III-11 Prapečeť:** NOT a AND mají jediné řešení, OR čtyři. Odborně správně. Zkouška s nenatočenými točitými kameny hlásí „prázdný kámen“ (K-III-02) a k úloze s OR chybí strategická nápověda (K-III-16).
- **III-12 Masky:** AND vybírá, OR nastavuje, XOR přepíná. Všech šest úloh, vzorec v Kodexu i oba kvízy jsou správně. Obecná maska 0000 1111 není nutná, úloha se často vyřeší dřív (K-III-18).
- **III-13 Tajná řeč:** Šifra XOR se rozšifruje na ECHO správně (skript) a E = 69 = 0100 0101 platí. Věta Kodexu o neprolomitelné šifře vynechává podmínku délky klíče (K-III-08).
- **III-14 Méně je víc:** Všech šest starých obvodů má správnou tabulku a jedinou náhradní runu. Echo po první úloze vždy řekne „Tři runy“, ale losují se obvody o 2 až 4 runách (K-III-01).
- **III-15 Velká brána:** Závoj ze sedmi run, Prapečeť a dvě masky. Zrcadla, Hlas většiny ani zjednodušení netestuje, i když Echo na konci říká „umíš je zrcadlit“ (u poloviny losů, kdy padne Pouto z NAND, nic zrcadlového nepřijde). V nápovědě je gramatická chyba (K-III-20).

## Nálezy

### K-III-01 · III-14 · chyba · střední · jistá
**Echo řekne „Tři runy“, i když obvod má dvě nebo čtyři**
Popis: Replika po první úloze je pevná: „Tři runy, a přitom stačila jediná.“ Komnata ale úlohy losuje (genIII14 vybere 4 ze 6 obvodů a zamíchá je) a první obvod má 2, 3 nebo 4 runy. Hra tak hráči nahlas řekne nepravdivý počet run v obvodu, který má před očima, a deska vedle přitom ukazuje „Obvod Lumenitů · 4 runy“ (Gate.svelte:51).
Doklad: act3.ts:854 `step: { 0: 'Tři runy, a přitom stačila jediná.' }`; generators3.ts:169–228 (LONG_FORMS: or/and/xor po 4 runách, nand/nor po 3, xnor 2; `shuffled(...).slice(0, 4)`); levels.ts:78–92 (generate se použije vždy). Skript, 600 losů, počet run v prvním obvodu: `{ '2': 94, '3': 201, '4': 305 }`, správně tedy jen ve 33 %.
Návrh: Repliku napsat bez čísla („Celý obvod, a přitom stačila jediná runa.“), nebo ji skládat z `task.reference.nodes.length`.

### K-III-02 · III-11, III-15 · chyba · střední · jistá
**Prapečeť po Zkoušce s nenatočenými točitými kameny hlásí „prázdný kámen“**
Popis: V Prapečeti mají všechny kameny pevnou runu (Zlomené pouto), hráč jen natáčí točité kameny. Když Zkoušku spustí s některým nenatočeným, `test()` nastaví `empty: true` a Echo i čtečka řeknou „Některý kámen je prázdný. Bez runy jím světlo neprojde.“ Hráč ale žádný prázdný kámen nevidí a runu vložit nemůže. Hláška ho posílá špatným směrem, a to ve chvíli, kdy točité kameny potkává poprvé.
Doklad: gate.ts:206 (`empty = slotNodes(...).some(...) || sockets(task.circuit).some((s) => !st.wires[s.key])`); gateEvents.ts:51–52 (text hlášky); generators3.ts:139 (všechny uzly `rune: 'nand'`). Skript: Zkouška bez natočení i s jedním natočeným → `{"type":"wrong","failed":[0,1,2,3],"empty":true}`.
Návrh: Rozlišit oba případy: „Některý točitý kámen ještě není natočený. Klikni na kolečko u vstupu runy.“

### K-III-03 · III-5, III-7, III-9, III-15 · text · střední · jistá
**Hláška po špatně poznané runě má pevně ženský rod**
Popis: Po špatné volbě pod závojem hra řekne „{jméno runy} by v řádku … svítila / mlčela“. Ženský rod sedí jen u Výluky a Rovnosti. U Pouta, Rozcestí, Zlomeného pouta, Zavřeného rozcestí a Důsledku vznikají tvary jako „Pouto by … mlčela“ nebo „Důsledek by … svítila“. Hláška přijde při každém omylu ve čtyřech komnatách včetně obou bran.
Doklad: gateEvents.ts:107 `` `${RUNE_NAME[ev.rune]} by v řádku ${rowWords(names, r)} ${own[r] ? 'svítila' : 'mlčela'}. Na desce je to jinak.` ``; skript (kopie šablony) mimo jiné: „Pouto by v řádku A stín, B světlo mlčela.“, „Rozcestí by v řádku A světlo, B světlo svítila.“, „Důsledek by v řádku A stín, B stín svítila.“
Návrh: „Runa Pouto by v řádku … svítila.“ (rod pak určuje slovo runa), nebo k RUNE_NAME doplnit rod.

### K-III-04 · III-6, III-7 · kurikulum · střední · jistá
**Losované větvení s oběma Obraceči předbíhá De Morgana a nápovědy k němu nesedí**
Popis: `randomBranch` losuje i dvojici ['not', 'not'], takže zhruba třetina hráčů má v III-6 (a v III-7) postavit ¬A ∧ ¬B (= NOR), nebo ¬A ∨ ¬B (= NAND). To je přesně obsah nepovinné III-8 Zrcadla, a varianta ¬A ∧ ¬B je doslova úloha „Druhé zrcadlo“ (act3.ts:555). Pointa III-8 „Stejná deska… Zrcadlo!“ tak u části hráčů přijde až jako opakování a na základní cestě zůstane bez jména. K tomu se nedá spolehnout na nápovědy: III-6 radí „Ve větvení můžeš Obracečem otočit jeden vstup“ a III-7 „Najdi runu s touhle deskou, nebo s deskou obrácenou, a za ni dej Obraceč“. Ve větvení ale za spojovací runou žádný kámen není a obrátit je potřeba oba vstupy. PLAN.md:367 slibuje „větvení s Obracečem na jednom vstupu“.
Doklad: generators3.ts:53–60 (`['not', 'not']` mezi možnostmi), 81, 105; act3.ts:372, 464; skript, 600 losů v III-6: not,not,and 104× a not,not,or 89× (32 %), v III-7 Kameny 194× (32 %).
Návrh: V III-6 losovat jen větvení s jedním Obracečem (4 varianty, jak píše PLAN). Dvojí obrácení nechat bráně a III-8, kde ho Echo pojmenuje. V III-7 přidat nápovědu pro větvení („Ve větvení obrať jeden, nebo oba vstupy a vyber spojovací runu“).

### K-III-05 · III-6 · chyba · nízká · jistá
**Při zkoumání větvení mluví nápovědy o kamenech**
Popis: Čtvrtá úloha III-6 je zkoumání (přepínání vstupů). Nápovědy komnaty jsou ale napsané pro osazování: 1. „Začni od lampy…“, 2. „Najdi runu, která dá desku přesně obráceně…“, 3. „Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.“ Ukázka kroku přitom zvýrazní vstup, ne kámen (`hint()` vrací `{ input }`). `stepHint` mimo režim slots vrací null, takže se zobrazí obecný text 3. stupně, který s tím, co je vidět, nesouhlasí.
Doklad: act3.ts:353–358 (explore úloha), 370–374 (nápovědy), 25 (SLOT_HINT); gate.ts:253–254; gateGame.svelte.ts:69–77 (`if (task?.mode !== 'slots') return null;`); Level.svelte:449 (náhrada `level.hints[e.level - 1]`).
Návrh: V `stepHint` vracet pro zkoumání „Zvýrazněný vstup vede k nové kombinaci.“ (jako EXPLORE_HINTS), nebo umožnit nápovědy po úlohách.

### K-III-06 · III-6 · text · nízká · jistá
**„Teď větvení postav sám.“**
Popis: Replika Echa je k hráči rodově zatížená, a to porušuje pravidla textů i PLAN 2.6.
Doklad: act3.ts:381 `3: 'Lampa svítila jen v řádku 0 1: obrácené A a k tomu B. Teď větvení postav sám.'`
Návrh: „Teď větvení postavíš ty.“

### K-III-07 · III-1 (a runes.ts) · chyba · nízká · pravděpodobná
**„Světlo“ znamená jednou vstup, jindy hodnotu 1, a kvíz je kvůli tomu dvojznačný**
Popis: Kvíz se ptá „Světlo projde dvěma Obraceči za sebou. Co dorazí k lampě?“ Správně je „totéž, co vyšlo“, mezi možnostmi je ale i „vždy světlo“. Ve hře „světlo“ znamená 1, takže když vyšlo světlo, k lampě opravdu dorazí světlo, a pečlivý žák může „vždy světlo“ obhájit. Stejný posun je v zákonech run: „svítí, jen když obě světla mlčí“, „svítí, když jsou obě světla stejná“ (světlo tu znamená vstup, který může být i stín). Jinde přitom hra říká „oba vstupy“ (act3.ts:139, 193, 371).
Doklad: act3.ts:124–125; runes.ts:69–75 (RUNE_RULE and/or/xor/nand/nor/xnor); stepWords.ts:48 a 56 zákony runy čtou nahlas.
Návrh: Kvíz: „Vstup A projde dvěma Obraceči za sebou. Co ukáže lampa?“ (možnosti „totéž co vstup A“, „vždy stín“, „vždy světlo“, „opak vstupu A“). V RUNE_RULE psát „oba vstupy“ / „aspoň jeden vstup“.

### K-III-08 · III-13 · kurikulum · střední · jistá
**Kodex slibuje neprolomitelnou šifru bez podmínky délky klíče**
Popis: „Kdo použije náhodný klíč jen jednou, má šifru, kterou nejde prolomit.“ Neprolomitelná je jen jednorázová tabulka (Vernamova šifra): náhodný tajný klíč stejně dlouhý jako zpráva, každý jeho bit použitý jednou. Komnata přitom šifruje celou zprávu jedním bajtem klíče a v poslední úloze ukáže, že jediné známé písmeno klíč prozradí. Žák si z Kodexu může odnést, že bajt klíče použitý pro jednu zprávu stačí, a to komnata právě vyvrátila. Echo („Proto se dobrý klíč nepoužívá dvakrát.“) je v pořádku, nepřesná je jen věta v Kodexu.
Doklad: kodex.ts:467; generators3.ts:301–314 (jeden `key` pro E, C, H, O; poslední úloha s jiným klíčem a známým E); act3.ts:819.
Návrh: „Kdo má náhodný klíč stejně dlouhý jako zpráva a každou jeho část použije jen jednou (Vernamova šifra), má šifru, kterou nejde prolomit.“

### K-III-09 · patro III (základní cesta) · kurikulum · střední · jistá
**Základní cesta nikdy nechce symbolický zápis výrazu, ani pracovní list**
Popis: Most k výrokové logice z matematiky (PLAN 1.3 „formální zápis hned po objevu“, PLAN 1.1 Logika) stojí na základní cestě jen v Echu („tesali jako stříšku: ∧“) a v Kodexu. Žádná otázka III-1 až III-7 nechce přečíst nebo napsat výraz (¬(A ∨ B), ¬A ∧ B) a žádná obrazovka ho k obvodu neukáže. Na základní cestě se symboly objeví jen ve vysvětlení po odpovědi (act3.ts:128 ¬¬A = A, 179 A ∧ B, 233 A ∨ B). Otázka se symbolem je až v nepovinné III-8 (act3.ts:565). Pracovní list bere otázky jen ze základní cesty (8 z 10 a jen 2 z nich jsou losované). Učitel tak tiskne test v lumenitských slovech („Kdy zůstane lampa za Rozcestím tmavá?“) bez jediného formálního zápisu a bez pravdivostní tabulky k doplnění. Pro očekávaný výstup „čte a zapisuje tvrzení v symbolickém tvaru“ (matematika) a pro mezipředmětovou vazbu je to hlavní mezera patra.
Doklad: otázky základní cesty act3.ts:124, 175, 229, 236, 289, 296, 390, 397 a qTableRows/qTableLit (quizzes.ts:567–616), ani jedna se symbolem; `grep "¬|∧|∨" src/ui` najde jen páku převrať v Přílivu; WorksheetScreen.svelte:22–27 (`basicRooms(act)…slice(0, COUNT)`, COUNT = 8).
Návrh: Do III-6 přidat otázku „Rozcestí a za ním Obraceč. Který zápis to je?“ (¬(A ∨ B) / ¬A ∨ B / ¬A ∨ ¬B / ¬(A ∧ B)) a do III-4 nebo III-5 jednu s A ⊻ B. Po přeložení Kodexem ukázat pod složeným obvodem jeho výraz (tak, jak se pod runou objeví NOT, AND). Do pracovního listu přidat losovanou úlohu „Doplň pravdivostní tabulku výrazu …“.

### K-III-10 · III-2 až III-7 · didaktika · střední · jistá
**Tabulka složeného obvodu se poprvé počítá až v bráně, vyplňování v III-5 je opisování**
Popis: Na základní cestě hráč vyplňuje desku v III-2 až III-5, pokaždé u jediné runy a s viditelnou lampou (lampa pod závojem je jen v III-7 a III-8). Desku tedy opíše z lampy, i v III-5, kde zadání slibuje „podle runy jde desku zase vyplnit“. III-6 cvičí jen opačný směr (k cílové desce vybrat runy, se živou lampou a zkoušením). Přímý výpočet tabulky složeného obvodu runu po runě, tedy dovednost „sestavit pravdivostní tabulku“ z PLAN 1.1, se poprvé chce v první zkoušce brány. Brána tak zkouší něco, co patro necvičilo. PLAN.md:363 navíc u III-2 píše „vyplní desku zákona zpaměti“, ale bez volby Desku znám to neplatí.
Doklad: veilLamp jen act3.ts:436, 522, 542; prezentace III-2 až III-6 (act3.ts:161, 215, 275, 321–327, 363–369) bez veilLamp; Desk.svelte:92 (`lampVeiled={fill && !!level.presentation.veilLamp && game.playing}`).
Návrh: V III-6 za zkoumání větvení přidat jednu desku s lampou pod závojem (třeba řetěz Rozcestí a Obraceč), nebo dát závoj aspoň na vyplňování v III-5 (runa je vidět, lampa ne). PLAN.md:363 opravit.

### K-III-11 · celá hra (patro III) · kurikulum · střední · jistá
**De Morganovy zákony jsou cílem hry, ale jen v nepovinné komnatě**
Popis: PLAN 1.1 uvádí mezi tím, co hráč „po dohrání umí“, i „chápat De Morganovy zákony“, a PLAN 6 říká „Základ stačí na celou hru“. De Morgan je ale jen v Hlubší síni III-8. Shrnutí Aktu III (Kodex „zahrada“) ho nezmíní a hráč, který jde jen základem, ho nepotká pojmenovaný (bez jména ho potká třetina hráčů v III-6/III-7, viz K-III-04). Je to rozpor mezi deklarovaným cílem a obsahem povinné části. Totéž platí pro implikaci a ekvivalenci, které jsou v gymnaziální matematice běžné, PLAN 1.1 je ale nevyžaduje.
Doklad: PLAN.md:29, 302; act3.ts:498–582; kodex.ts:393–402.
Návrh: Buď v III-7 (nebo v III-6 u větvení se dvěma Obraceči) přidat jednu repliku a otázku „¬A ∧ ¬B je totéž co Zavřené rozcestí: zrcadlo, kterému moderní lidé říkají De Morganův zákon“, nebo v PLAN 1.1 De Morgana označit jako rozšiřující cíl Hlubších síní.

### K-III-12 · III-6, III-9 · kurikulum · nízká · jistá
**Rovnost má na základní cestě jen lumenitské jméno**
Popis: III-6 Rovnost postaví a Echo ji pojmenuje (oprava podle PLAYTEST 9.3.3). Moderní značku pod runou ale „přeloží“ až Kodex „spojky“ v nepovinné III-9 a Kodex „retezy“ ze základní cesty o Rovnosti mlčí. Hráč základní cesty tak k Rovnosti nikdy nedostane XNOR ani ekvivalenci (⇔), přestože na ni IV-4 staví (Porovnávač).
Doklad: runes.ts:113 (`xnor: 'spojky'`); kodex.ts:382–391 (retezy jen NAND a NOR); act3.ts:380.
Návrh: Do Kodexu „retezy“ doplnit větu a vzorec „Rovnost = XNOR = ¬(A ⊻ B), v matematice ekvivalence A ⇔ B“ a RUNE_KODEX.xnor přesměrovat na „retezy“.

### K-III-13 · patro III (Kodex) · kurikulum · nízká · pravděpodobná
**Kodex neukazuje názvy a zápisy, se kterými se žák potká ve škole**
Popis: Kodex používá jen ¬ ∧ ∨ ⊻ ⇒ ⇔ a názvy negace, konjunkce, disjunkce, vylučovací disjunkce. V českých učebnicích a materiálech se žák potká i s dalším:
- informatika a elektronika: logický součin / logický součet, XOR jako ⊕, negace pruhem nad písmenem (Ā; runy NAND a NOR mají pruh nahoře, runes.ts:98–99, ale Kodex ho nevysvětlí);
- matematika: negace jako A′, vylučovací disjunkce jako nonekvivalence, pravdivostní tabulka obvykle začíná řádkem 1 1, ne 0 0 jako deska zákona;
- u implikace: v A ⇒ B je A předpoklad a B závěr (důsledek). Lumenitské jméno celé spojky „Důsledek“ se s tím může plést.

Kdo to nezná, nemusí poznat, že jde o tutéž látku.
Doklad: kodex.ts:329–424 (obracec, pouto, rozcesti, vyluka, deska, spojky); runes.ts:42 a 79–89. Tvrzení o učebnicích je obecná znalost oboru, ne kód.
Návrh: Do části „today“ dát jednu větu „Jinde uvidíš i …“: u NOT „A′, Ā“, u AND/OR „logický součin / součet“, u XOR „⊕, nonekvivalence“, u Desky „v matematice se řádky píšou často od 1 1“, u implikace „A předpoklad, B závěr“.

### K-III-14 · III-10 (Kodex obecně) · kurikulum · nízká · jistá
**Zápis AB pro konjunkci a tečka „·“ jako oddělovač vzorců**
Popis: Kodex „vetsina“ píše `M(A, B, C) = AB ∨ AC ∨ BC`. Zkrácený zápis konjunkce bez znaménka hra nikde nezavedla a smíchaný s ∨ není ani v matematice, ani v Booleově algebře obvyklý (tam AB + AC + BC). Všechny vzorce Kodexu zároveň oddělují položky tečkou „·“, která v Booleově algebře a elektronice značí konjunkci (A · B). V patře III to mate u `'¬ · ∧ · ∨ · ⊻'`. V patře IV se `'S = A ⊻ B · C = A ∧ B'` čte jako A ⊻ (B · C).
Doklad: kodex.ts:433, 400, 488, 336; kodex.ts:499 a 510 (patro IV, stejný styl: `přenos = AB ∨ P(A ⊻ B)`).
Návrh: V III-10 psát `(A ∧ B) ∨ (A ∧ C) ∨ (B ∧ C)` (už je v textu „modern“). Oddělovač ve „formula“ změnit na středník nebo nový řádek.

### K-III-15 · III-4 · text · nízká · jistá
**„Spodní číslice“ v moderním Kodexu a chybějící znak Výluky**
Popis: Moderní část Kodexu „vyluka“ říká „Je to spodní číslice součtu dvou bitů“. Kodex patra II (zákon sloupce) ale pro totéž píše „nižší číslici napiš dolů“ a „spodní“ je v patře II spodní řada, tedy druhý sčítanec (act2.ts:522, 836). U III-1 až III-3 navíc Echo na konci ukáže znak runy (¬, ∧, ∨), u Výluky ne, ačkoli ⊻ je ve vzorci Kodexu i na runě.
Doklad: kodex.ts:366 a 196; act3.ts:119, 139, 193 vs. 253.
Návrh: V Kodexu „číslice nižšího řádu (ta, která zůstane dole)“. Do act3.ts:253 přidat „Lumenité ji tesali jako V s čárou: ⊻.“

### K-III-16 · III-11 · didaktika · nízká · jistá
**K nejtěžší úloze Prapečeti chybí strategická nápověda**
Popis: Nápověda 2 radí NOT (stejné světlo na obou vstupech) a AND (Obraceč za Zlomeným poutem). Pro třetí úlohu, OR jako Zlomené pouto obrácených vstupů, strategie chybí. Ukázka kroku u točitého kamene ho jen zvýrazní a neřekne, kam ho natočit (u kamene s runou ji jmenuje i se zákonem). III-15 má tutéž nápovědu doplněnou (act3.ts:908), III-11 ne.
Doklad: act3.ts:710–714; gateGame.svelte.ts:73–76 (`if ('node' in h) …; return null;` pro socket); gate.ts:276–277 (hint zná `source`).
Návrh: Do nápovědy 2 III-11 doplnit „Rozcestí: obrať oba vstupy a pusť je do Zlomeného pouta.“ V `stepHint` pro socket: „Natoč zvýrazněný točitý kámen na {vstup A / runu 1}.“

### K-III-17 · III-6, III-11 (Kodex) · kurikulum · nízká · pravděpodobná
**„Čipy jsou často vyrobené hlavně z NAND“**
Popis: Univerzalita NAND je správně. Věta, že čipy jsou „často vyrobené hlavně z nich“, ale dnešní praxi zjednodušuje: syntéza mapuje obvody do knihovny mnoha buněk (NAND, NOR, AOI, OAI, klopné obvody). Věta v Prapečeti klade vedle sebe „NAND flash“ a „čipy z hradel NAND“, jako by flash byla z hradel NAND. Jméno ale pochází od zapojení paměťových buněk do série.
Doklad: kodex.ts:390, 445.
Návrh: „V technologii CMOS patří NAND k nejjednodušším a nejrychlejším hradlům, proto ho návrháři rádi používají.“ U flash: „NAND flash se jmenuje podle zapojení buněk, které připomíná hradlo NAND.“

### K-III-18 · III-12 · didaktika · nízká · jistá
**Obecnou masku 0000 1111 není nutné sestavit**
Popis: Úloha „Nech svítit jen pravou čtveřici“ se vyřeší sama, jakmile výsledek sedí. Kdo rozsvěcí masku zprava, má ji vyřešenou dřív, než maska je 0000 1111, a to ve 30 % losů. Kodex (`1011 0110 AND 0000 1111`) i kvíz („AND s 0000 1111“) přitom učí obecnou masku pro jakýkoli nápis. Navazuje to na PLAYTEST 9.3.5: oprava ideálu vyřešila pečeť přesnosti, druhá varianta z playtestu (stejná maska na dvou nápisech) ve hře není.
Doklad: mask.ts:197–199, 229–230; act3.ts:748; skript: „úloha 1 se vyřeší dřív než maska 0000 1111 (zprava): 122 / 400“.
Návrh: Za první úlohu přidat druhý nápis se stejnou maskou (`carry`, jako v Tajné řeči), aby hráč viděl, že maska platí obecně.

### K-III-19 · III-7, III-8 · text · nízká · jistá
**Ukázka kroku v desce nerozliší dva Obraceče**
Popis: U větvení s oběma Obraceči řekne ukázka kroku „Řádek A stín, B světlo: Obraceč dá světlo, Obraceč dá stín, Rozcestí dá světlo. Lampa svítí.“ Není jasné, který Obraceč patří ke kterému vstupu, a právě o to v De Morganovi jde.
Doklad: stepWords.ts:50 (`${RUNE_NAME[g.rune]} dá ${light(values[g.id])}` bez vstupu); skript: věta výše pro branch(not, not, or), řádek 1.
Návrh: U runy s jedním vstupem doplnit zdroj: „Obraceč u A dá světlo, Obraceč u B dá stín…“.

### K-III-20 · patro III · text · nízká · jistá
**Drobné jazykové chyby**
Popis a doklad:
- act3.ts:54 „Nejjednodušší kámen v cestě jmenovali Obraceč.“ Vazba „jmenovat co jak“ tu nesedí a v III-0 žádný kámen není. Návrh: „Nejjednodušší runě v cestě říkali Obraceč.“
- act3.ts:100 „Vlož do prázdného kamene runu…“: třetí obvod má dva prázdné kameny (act3.ts:89–91). Návrh: „Vlož do prázdných kamenů runy…“.
- act3.ts:908 „…Rozcestí jsou Zlomené pouto obrácených vstupů.“ Rozcestí je tu jedna runa. Návrh: „Rozcestí je Zlomené pouto…“.
- stepWords.ts:97 „Tady se výsledek liší od nápisu.“ V Tajné řeči jsou řady popsané „Šifra“ a „Zpráva“ (Mask.svelte:35–36), takže ukázka kroku v poslední úloze mluví o řádcích, které na obrazovce nejsou.
- kodex.ts:423 „Když neprší, nic neporušila, ať je mokro, nebo ne.“ Implikace nic neporušuje, nanejvýš je porušena. Návrh: „Když neprší, implikace platí, ať je mokro, nebo ne.“

### K-III-21 · patro III · kurikulum · střední · pravděpodobná
**Učitel nemá přehled: komnata, pojem, zápis, hodina, výstup RVP**
Popis: Ve hře ani v PLAN není nic, co by učiteli řeklo, kolik hodin patro zabere, co přesně komnaty učí formálně a ke kterým výstupům se to vztahuje (`grep RVP src` nic nenajde). Shrnutí patra (Kodex) a pracovní list existují, ale pracovní list je v herních slovech (K-III-09). Návrh mapování (orientační, znění výstupů je potřeba ověřit v platném RVP G):
- **1. hodina (45 min):** Strážce (3 min), III-0 až III-5, nejlépe i III-6 a III-7. Podle PLAYTEST 9.1 trvá základ 12, 25 a 40 min (Ema, Vojta, Nikola) bez Strážce. Slabší žák se do hodiny i s kvízy vejde jen těsně, bránu případně dodělá na začátku další hodiny.
- **2. hodina:** III-8 až III-11 (De Morgan, implikace a ekvivalence, tři vstupy, univerzalita NAND), asi 20–25 min hry, zbytek na formální zápis a tabulky na papíře.
- **3. hodina nebo projekt:** III-12 až III-15 (bitové masky, šifra XOR a ASCII, zjednodušení).
- **Vazby:** Informatika, Digitální technologie (jak počítač zpracovává data logickými obvody): III-1 až III-7, III-10, III-11, III-14. Informatika, Data, informace a modelování (reprezentace a kódování dat, šifrování): III-12, III-13, deska zákona jako model (III-5). Matematika, Argumentace a ověřování, výroková logika (negace, konjunkce, disjunkce, implikace, ekvivalence, negace složeného výroku): III-1 až III-4, III-8, III-9.
Doklad: PLAN.md:22–33, 296–305; PLAYTEST.md (kap. 9.1, časy); WorksheetScreen.svelte:22–27; SummaryScreen.svelte:17–21.
Návrh: Do Učitelského režimu nebo do PLAN přidat jednostránkový přehled patra: komnata → pojem → formální zápis → kontrolní otázka → orientační čas → vazba na RVP. Učitel podle něj naplánuje hodiny a vybere, které Hlubší síně zadá.

## Patro jako celek
Patro III je odborně velmi solidní. Všechny pravdivostní tabulky, vzorce v Kodexu a správné odpovědi kvízů jsem přepočítal a nenašel jsem jedinou věcně chybnou tabulku ani odpověď. Posloupnost NOT → AND → OR → XOR → pravdivostní tabulka → skládání (NAND, NOR, Rovnost, větvení) → brána odpovídá učebnicovému pořadí. Patro dobře navazuje na patro II (XOR jako číslice součtu) i na IV (poloviční sčítačka, NOR pro paměť, Rovnost pro porovnávač). Cíl „Logika“ z PLAN 1.1 pokrývá základní cesta celý, kromě De Morganových zákonů. Ty jsou jen v nepovinné III-8, a třetina hráčů je náhodou potká už v III-6, bez jména a s nápovědou, která nesedí. Hlavní kurikulární mezera je přechod od obvodu k symbolickému zápisu: základní cesta ani pracovní list nikdy nechtějí přečíst nebo napsat výraz jako ¬(A ∨ B), takže most k výrokové logice z matematiky stojí jen v Kodexu. Druhá mezera: tabulku složeného obvodu hráč poprvé počítá až v bráně, předtím ji jen opisuje z lampy. Funkční chyby jsou drobné, ale viditelné (Echo v III-14, hláška o prázdném kameni v Prapečeti, ženský rod v hlášce závoje). Časově se základ vejde do jedné vyučovací hodiny, slabší žák bude na hraně. Hlubší síně jsou další jedna až dvě hodiny. Učiteli chybí přehled komnata → pojem → zápis → výstup a pracovní list s formálním zápisem a tabulkou k doplnění.

## Co funguje
- Věcná správnost: tabulky všech devíti run (core/logic.ts) i všech šesti starých obvodů v III-14, vzorce v Kodexu (De Morgan, A ⇒ B = ¬A ∨ B, A ⇔ B = ¬(A ⊻ B), maska 1011 0110 AND 0000 1111, E = 69, (Z ⊻ K) ⊻ K = Z) a správné odpovědi všech kvízů.
- Řešitelnost a jednoznačnost: řetězy v III-6 mají jediné řešení, III-10 přesně dvě duální řešení, jak slibuje PLAN, Prapečeť 1/1/4 (skript).
- Učebnicová posloupnost s objevem před výkladem (Kodex Pravdivostní tabulka až v III-5, po třech deskách) a s mezipatrovými mosty (XOR = číslice součtu, Hlas většiny = přenos úplné sčítačky, převrať z II-13 = XOR s 1111 1111).
- Vysvětlení blízká matematice: „prší a fouká“, nevylučovací „kino, nebo divadlo“, „Není pravda, že prší nebo fouká“, implikace jako slib, typická chyba „neprší a je mokro“.
- Lampa pod závojem v bráně a v Zrcadlech: mezivýsledky jsou vidět, poslední runu musí hráč složit sám (Board.svelte:122–124).
- Znaky run jsou samy logickými značkami (¬ ∧ ∨ ⊻ ⇒ ⇔, NAND a NOR s pruhem), takže symbol je od začátku na herní ploše.
- Generátory drží rozumné podmínky (různé runy v závoji, aspoň jedna z nových ve velké bráně, různé klíče v Tajné řeči) a úlohy jsou při každém vstupu jiné.
