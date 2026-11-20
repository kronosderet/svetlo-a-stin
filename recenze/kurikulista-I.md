# Kurikulista · patro I

Skripty: `sim/kurikulista-I/patroI.test.ts` (výstup `vystup.txt`) a `sim/kurikulista-I/gray.test.ts` (výstup `vystup-gray.txt`).

## Komnaty
- **I-0 Probuzení:** Nultá komnata podle PLAN 6, tedy bez kvízu a bez Kodexu: jeden klik a Echo se představí. Nemám výhrady.
- **I-1 Ticho:** Bit se zavádí třemi vzory 1-0-1. Kodex Krystal → Bit má školní definici (binary digit, nejmenší jednotka informace). Jediná drobnost je „proud, nebo žádný proud“ (K-I-27).
- **I-2 Dvě světla:** Čtyři kombinace dvou krystalů. Kodex „1 a 0“ výslovně říká „čti jedna-nula, ne deset“, což míří přesně na typickou chybu. Od I-3 jsou pod krystaly číslice, jak Kodex slibuje.
- **I-3 Kolik kombinací?:** 2ⁿ přichází objevem, deska se rozdělí podle levého krystalu a oba losované kvízy mají správné klíče i vysvětlení typických chyb. Je to ale jediný kvíz celé základní cesty patra (K-I-01, K-I-02). Nápověda 1 radí něco, co ovládání vynucuje samo (K-I-21).
- **I-4 Váhy kamenů:** Poziční hodnota přichází objevem (krystal sám, dopočet ze součtu, oltář vyryje váhy) a zápisník ukazuje 101₂ = 4 + 1 = 5. Kodex je věcně správně, jen „váha světla“ znamená v Kodexu něco jiného než ve hře (K-I-09). Komnata nemá kvíz.
- **I-5 Čtyři váhy:** Hladový postup. Losování drží pevnou devítku jako první cíl, takže se odhalí osmička a sedí to s Echem „Osm.“. Převod dělením dvěma je jen v poli „Dnes:“ (K-I-10). Komnata nemá kvíz.
- **I-6 Čtení nápisů:** Opory mizí uvnitř komnaty (2 nápisy s vahami, 1 s velikostmi, 2 holé) a Echo každý krok ohlásí ve správnou chvíli. Typické chyby (zrcadlo, počet světel, jediný krystal) mají vlastní hlášky. Hornerovo schéma v Kodexu je hezký bonus. V 5,5 % losování ale holá část zrcadlové čtení neodhalí (K-I-24).
- **I-7 Brána Předsíně:** Syntéza čtení a zápisu na čtyřech krystalech, na konci patnáctka. Shrnutí aktu v Kodexu je úplné a správné (45 = 101101₂). Echo „Poslední zkouška“ neplatí, když přibude zkouška navíc (K-I-23).
- **I-8 Skryté váhy:** Pátý krystal a řada mocnin. Kodex Mocniny dvojky je správně (pozice i váží 2ⁱ, KiB = 1024 B). Echo u čtvrtého cíle „Šestnáct a víc“ sedí s generátorem (generators.ts:39, vs[3] ≥ 16). Jednotky informace se tu objeví jen v jedné větě (K-I-22).
- **I-9 Sudé a liché:** Dobrý most k posunu a dělení. Výjimka „(ne nula)“ je matematicky poctivá a osmička správně splní dvě skupiny najednou (ověřeno skriptem). Název „Parita“ ale koliduje s paritním bitem (K-I-08), nápovědy skupin jsou nepřesné (K-I-20) a qTrailing má chybnou shodu (K-I-14). Kvízy pracují s oktávou (vysvětlení „56 : 8 = 7“) dřív, než ji zavede I-10.
- **I-10 Nejvyšší světlo:** 2ⁿ − 1 a bajt. Kvízy qMaxValue a qBitsFor mají správné klíče i vysvětlení. Kodex Bajt je správně (256 hodnot, 256³ přes 16,7 milionu barev).
- **I-11 Tichý krok:** Silný hlavolam a Kodex Grayův kód je přesný (zrcadlová stavba). Ukázka kroku a Echo „Teď přijde zrcadlo“ jdou proti nápovědě 2 (K-I-04). Kvíz oslovuje hráče v mužském rodě (K-I-15) a zadání opakuje pravidlo, které vynucuje ovládání (K-I-21).
- **I-12 Velký nápis:** Čistý dril oktávy (4 úlohy) bez kvízu i bez Kodexu. Hodila by se sem otázka na rozsah bajtu nebo na jednotky. V Echu je chybný tvar „do dvě stě padesáti pěti“ (K-I-16).
- **I-13 Řeč glyfů:** Šestnáctková číslice přes glyf. Pravidlo čtení (8, 4, 2, 1 po směru hodin od horní strany) sedí s Glyph.svelte a kvízy jsou správné. Ukázka kroku při zápisu říká „Žádáno 12“, ale brána ukazuje C (K-I-05). Echo píše o jednom kotouči, rozhraní o kotoučích (K-I-18).
- **I-14 Dvojznak:** Bajt dvěma znaky. Kvíz #FF8800 je správně (88₁₆ = 136). Ukázka kroku při zápisu počítá desítkově (K-I-05), „bez chyb“ je přehnané (K-I-19) a desítkový zápis na glyfových kotoučích nemá vlastní hlášku (K-I-25).
- **I-15 Velká brána Předsíně:** Dobrá syntéza: tichý krok přes tři krystaly, oktáva desítkově a oktáva glyfy. Kodex Hlubší zákony má zbytkovou větu o přenosu a vynechává I-8 a I-9 (K-I-03). Ukázka kroku v Tichém kroku jde proti nápovědě (K-I-04).

## Nálezy

### K-I-01 · patro I (pracovní list) · chyba · vysoká · jistá
**Pracovní list patra I má jen 2 otázky, obě o počtu kombinací**
Popis: List losuje 8 otázek z kvízů základní cesty. V patře I má kvíz jen I-3 (qCombosNext, qCombosOf), takže list má 2 otázky místo 8 a obě se ptají jen na 2ⁿ. Čtení a zápis čísel, tedy jádro patra i jeho brány, v listu chybí. Komentář v kódu přitom slibuje, že list „rozliší, kdo bránou prošel autopilotem“. To v patře I nejde, protože brána zkouší převody. Ostatní patra mají v zásobníku 9 až 12 položek.
Doklad: WorksheetScreen.svelte:12-13, 17, 22-25; act1.ts:110-113 (jediný kvíz základu). Skript: „Patro I: 2 položek (list chce 8): qCombosNext, qCombosOf“, patro II 12, III 10, IV 9.
Návrh: Dát kvízy do I-4 až I-7 (viz K-I-02). Generátory qRead a qWrite už existují (quizzes.ts:618-652, používá je Strážce schodů). Pro patro I přidat do listu i otevřené úlohy bez možností („Převeď 13 do dvojkové soustavy“, „Kolik je 1011₂?“) z generátorů I-6 a I-7.

### K-I-02 · I-4 až I-7 · kurikulum · střední · jistá
**Základní cesta po I-3 se už na nic nezeptá**
Popis: Poziční hodnota (I-4), převod 10 → 2 (I-5), převod 2 → 10 (I-6) i brána I-7 nemají kvíz. Hra se tak v základu nezeptá „proč“ (PLAN 1.3: „hra se ptá i proč“) u žádného pojmu kromě 2ⁿ. Pečeť přesnosti v těchto komnatách kvíz nezahrnuje a přehled třídy u nich ve sloupci „Ø chyb v kvízu“ ukáže vždy „–“.
Doklad: act1.ts:116-276 (I-4 až I-7 bez `quiz`); skript „I-4 … kvíz 0“ až „I-7 … kvíz 0“; PLAN.md:55; TeacherScreen.svelte:18, 160.
Návrh: I-4 „Kolik by vážil pátý krystal?“ (váha dalšího řádu), I-5 qWrite a „Největší číslo ze 4 krystalů“, I-6 qRead a otázka „Proč stín neváží nic?“. Kvíz v I-6 zároveň doplní pracovní list.

### K-I-03 · I-15 (Kodex predsin-hloub), README · chyba · střední · jistá
**Shrnutí Hlubších síní I popisuje staré uspořádání**
Popis: Shrnutí začíná větou „Přičtení jedničky je přenos zprava.“ a lumenitská věta slibuje, že hráč „umí krystaly počítat“. To je látka Počítadla poutníků, které se z I-9 přestěhovalo do II-1. Naopak chybí obsah I-8 (mocniny dvojky, rozvinutý zápis) a I-9 (sudost, dělitelnost čtyřmi a osmi). Totéž ve zkratce opakuje README („Hlubší síně (pátý krystal, přenos, bajt…)“).
Doklad: kodex.ts:157-159; README.md:10; PLAYTEST.md:776-778 (přesun I-9 do II-1).
Návrh: modern: „Váhy jsou mocniny dvojky 2⁰, 2¹, 2² … Lichost určuje nejnižší bit, každá nula vpravo je jedno dělení dvěma. Bajt nese 0 až 255, n bitů nejvýš 2ⁿ − 1. Grayův kód projde všechny kombinace po jediné změně. Šestnáctková číslice zapíše čtveřici bitů.“ Lumenitskou větu změnit na „…umí číst oktávu, chodit tichým krokem a psát glyfy.“ Opravit i README:10.

### K-I-04 · I-11, I-15 (Tichý krok) · didaktika · střední · jistá
**Ukázka kroku i Echo jdou proti nápovědě se zrcadlem**
Popis: Nápověda 2 radí projít osm kombinací tří pravých krystalů, pak rozsvítit levý a projít je pozpátku. Kodex popisuje totéž (první polovina vlevo 0). Ukázka kroku ale hledá cestu od nejtěžšího krystalu a hned první krok rozsvítí levý krystal: 0000 → 1000 → 1100 → 0100 … Zrcadlí tedy podle pravého krystalu. Kdo nápovědy kombinuje, dostane protichůdné rady. Echo „Polovina cesty. Teď přijde zrcadlo.“ navíc zazní u osmé kombinace vždy: jen 324 z 5712 cest z 0000 má prvních osm kombinací s levým krystalem ve stínu. Stejný rozpor je v první zkoušce I-15. V I-3 ukázka kroku dá 000 → 100 → 110 …, tedy jiné pořadí, než jaké učebnice uvádějí jako Grayův kód (000, 001, 011, 010 …).
Doklad: altar.ts:286, 295 (smyčka od `bits - 1`); act1.ts:407, 416, 586. Skript: „I-11 ukázka kroku: 0000 → 1000 → 1100 → 0100 → 0110 → 1110 → 1010 → 0010 → 0011 …“, „I-15/1: 000 → 100 → 110 …“, „Hamiltonových cest z 0000: 5712; prvních 8 má levý krystal ve stínu: 324“.
Návrh: V hamiltonStep (a v hintBit pro `all`) procházet bity od nejnižšího. Vznikne zrcadlový Grayův kód 0000, 0001, 0011, 0010, 0110 …, který odpovídá nápovědě 2 i Kodexu. Echo u osmé kombinace podmínit tím, že dosavadní cesta má levý krystal ve stínu, jinak říct jen „Polovina cesty.“

### K-I-05 · I-13, I-14, I-15 (zápis glyfy) · didaktika · střední · jistá
**Ukázka kroku při zápisu glyfů počítá desítkově**
Popis: Brána žádá dvojznak A5 a nápověda 2 radí číst každou čtveřici zvlášť po 8, 4, 2, 1. Ukázka kroku přitom řekne „Žádáno 165. Těžší krystaly dají 128, zbývá 37. Váha 32 se do toho vejde…“, tedy číslo, které hráč neviděl, a váhy oktávy místo čtveřic. Při čtení v téže komnatě ukázka kroku čtveřice dělí („Vlevo sečti 2 + 1, vpravo 8 + 4“). V I-13 říká „Žádáno 12“, ale kotouč brány ukazuje C.
Doklad: inscriptionGame.svelte.ts:83-85; stepWords.ts:14-20 a 23-31; act1.ts:537; Inscription.svelte:88-89 (brána ukazuje šestnáctkově). Skript: „I-14 zápis dvojznaku A5, bit 5: Žádáno 165. Těžší krystaly dají 128, zbývá 37. Váha 32…“.
Návrh: Pro radix 16 mít vlastní větu po čtveřicích: „Žádáno A5. Levý glyf A = 10 = 8 + 2: zvýrazněný krystal (váha 8 v levé čtveřici) rozsviť.“ V I-13 „Žádáno C (12)…“.

### K-I-06 · patro I (přehled třídy) · chyba · střední · jistá
**„Teď v komnatě“ ukazuje komnatu, ve které student není**
Popis: currentRoom vrací první nehotovou komnatu základní cesty napříč patry. Student, který má základ patra I hotový a hraje Hlubší síně, se v přehledu ukáže v patře II.
Doklad: classOverview.ts:41-44; TeacherScreen.svelte:116, 124. Skript: student s hotovými I-0 až I-8, rozehraná I-9 → „Teď v komnatě: II-0 Jedna a jedna“.
Návrh: Ukládat do postupu naposledy otevřenou komnatu (recordEntry, progress.svelte.ts:107) a ukazovat tu. Případně psát „základ I hotov, Hlubší síně: I-9“.

### K-I-07 · patro I (přehled třídy) · didaktika · střední · jistá
**„Zaseklo se“ počítá i ty, kdo komnatu právě hrají**
Popis: Kdo do komnaty vstoupil a nedokončil ji, počítá se jako zaseknutý. Když hodina skončí a třída je zrovna v I-6, přehled ji zvýrazní jako problémovou (10 z 10 „zaseklo se“). Totéž platí pro komnatu, kterou si někdo jen otevřel. Učitel tak dostane falešný signál právě o komnatě, kde se třída zastavila.
Doklad: classOverview.ts:52-53, 83, 92-94; TeacherScreen.svelte:134, 143. Skript: 10 studentů s rozehranou I-6 → `{reached:10, solved:0, stuck:10}`, zvýrazněno: true.
Návrh: Sloupec přejmenovat na „Nedokončili“. Za zaseknuté brát až opakované vstupy bez dokončení, nebo nápovědy a chyby bez dokončení. Zvýraznění podle ukázek kroku a tahů nad ideál nechat.

### K-I-08 · I-9 (Kodex parita) · kurikulum · střední · jistá
**„Parita“ pro sudost čísla se srazí s paritním bitem**
Popis: Záznam Sudá a lichá se překládá jako „Parita a dělitelnost“. V informatice znamená parita hlavně paritní bit, tedy sudý nebo lichý počet jedniček. Ten PLAN slibuje v cílech 1.1 a v Aktu V („parita a oprava chyb“). Žák si tak může paritní bit spojit s nejnižším bitem.
Doklad: kodex.ts:86-89; PLAN.md:32, 123, 289.
Návrh: modernName „Sudost a lichost, dělitelnost mocninami dvou“. Do textu přidat větu: „Pozor: v kódování se paritou myslí počet jedniček v zápisu. To je jiná věc.“

### K-I-09 · patro I (názvosloví Kodexu) · kurikulum · střední · jistá
**„Váha“ znamená ve hře dvojí a chybí školní termíny**
Popis: Ve hře je „váha“ jednou váha krystalu, tedy váha řádu, a jindy hodnota celého čísla: „světlo o přesné váze“, „nastav jeho váhu na kotoučích“, „váhy od nuly do patnácti“. Kodex to nerozliší a lumenitský název „Váha světla“, který ve hře znamená hodnotu čísla, překládá jako „Poziční hodnota“. V celém Kodexu chybí termíny z českých učebnic: řád, váha řádu, základ soustavy, rozvinutý zápis s mocninami v základu (1·2² + 0·2¹ + 1·2⁰) a synonyma binární a hexadecimální, se kterými se žák setká v učebnicích i v programech.
Doklad: act1.ts:122, 181, 204; kodex.ts:36-44 (ancientName „Váha světla“ → „Poziční hodnota“, vzorec 1·4 + 0·2 + 1·1); grep `řád|základ soustavy|binár|hexadec` v kodex.ts nic nenajde.
Návrh: Do záznamu vaha doplnit: „Celková váha světla je hodnota čísla. Váha jednoho krystalu je váha řádu. Dvojková (binární) soustava má základ 2.“ Vzorec psát 101₂ = 1·2² + 0·2¹ + 1·2⁰ = 5 (stačí v záznamu mocniny). Do záznamu glyf: „šestnáctková (hexadecimální) soustava, základ 16“.

### K-I-10 · I-5 (Kodex prevod), Shrnutí patra · kurikulum · střední · jistá
**Převod dělením dvěma je schovaný pod „Dnes:“ a netiskne se**
Popis: Postupné dělení dvěma, v českých učebnicích hlavní metoda převodu 10 → 2, je jen v poli `today`. Kodex ho uvádí nadpisem „Dnes:“, jako by šlo o použití v praxi. Shrnutí patra k tisku pole `today` vůbec netiskne, takže na papíře metoda chybí. Příklad je navíc vodorovný („13 → 6 zb. 1 → 3 zb. 0 …“), ale radí „zbytky čti odzdola nahoru“.
Doklad: kodex.ts:55-56; KodexPanel.svelte:96; SummaryScreen.svelte:35-36 (jen `modern` a `formula`).
Návrh: Metodu přesunout do `modern` (nebo do nového pole „Druhý postup“, které Shrnutí vytiskne). Zapsat ji školně pod sebe: 13 : 2 = 6 zb. 1, 6 : 2 = 3 zb. 0, … a „zbytky čti od posledního k prvnímu: 1101₂“.

### K-I-11 · patro I (cíle PLAN 1.1) · kurikulum · střední · jistá
**Šestnáctková soustava a bajt jsou jen v nepovinných síních**
Popis: Cíle 1.1 chtějí „převádět mezi dvojkovou, desítkovou a šestnáctkovou soustavou“ a vysvětlit, „co je bajt“. Šestnáctková soustava je ale jen v I-13 až I-15 a bajt v I-10, tedy v nepovinných Hlubších síních. PLAN 6 hex výslovně řadí mezi látku, kterou „sexta nutně nepotřebuje“. Hráč základní cesty potká bajt jen ve větě „Dnes:“ u Zákona zdvojení a hex vůbec. Akt V, kde má být hex hlavním principem, ve hře není. Plán si tak odporuje a učitel se z hry nedozví, že část cílů je volitelná.
Doklad: PLAN.md:26-27, 305; kodex.ts:33; act1.ts:359-558.
Návrh: Rozdělit cíle 1.1 na základ a rozšíření a říct to v materiálech pro učitele. Případně dát do základu jednu glyfovou zkoušku (třeba jako poslední úlohu I-7, nebo Kodex Čtveřicový glyf otevřít už po I-7) a otázku na bajt do kvízu I-5.

### K-I-12 · patro I (materiály pro učitele) · kurikulum · střední · jistá
**Chybí mapování na vyučovací hodiny a na RVP**
Popis: PLAN má „mapování na RVP (informatika)“ jako nesplněný úkol. Hra, README ani přehled třídy učiteli neřeknou, kolik hodin patro zabere ani které výstupy pokrývá. Navrhuji tento rozpis:
- **Hodina 1:** I-0 až I-7, podle PLAYTEST 10 až 40 minut. Kdo skončí dřív, pokračuje I-8 a I-9.
- **Na konci hodiny 1:** Shrnutí patra a pracovní list (po opravě K-I-01).
- **Hodina 2 nebo domácí práce:** I-8 až I-15. Odhaduji 40–70 minut: 115 tahů v ideálu, 12 otázek kvízu, převody oktáv (domněnka).
- **Začátek patra II:** Strážce schodů jako opakování.
- **RVP G, Informatika:** obsahově jde nejspíš o tematický celek Data, informace a modelování (číslo jako posloupnost bitů, jednotky, převody 2 ↔ 10 ↔ 16). Patra III a IV patří k Digitálním technologiím (jak počítač počítá). Znění a kódy výstupů v repozitáři nejsou, mapování je potřeba ověřit proti platnému RVP (domněnka).
Doklad: PLAN.md:867 (`[ ]`); README.md:81-97; PLAYTEST.md:84 (časy Akt I).
Návrh: Do Shrnutí patra (učitelský režim) přidat řádek „Pro učitele“: komnaty, odhad času, pojmy a výstupy. Stejnou tabulku dát do README.

### K-I-13 · patro I (Zkusit bránu hned) · didaktika · střední · pravděpodobná
**Rychlá brána přeskočí právě převody**
Popis: Bránu I-7 otevře I-1 až I-3 s pečetí přesnosti i odvahy. Tyhle komnaty ale nezkoušejí poziční hodnotu ani převody (napodobit vzor, projít krychli, kvíz o 2ⁿ) a pečlivý začátečník je zvládne v ideálu. Bránu tak dostane i hráč, který váhy krystalů nikdy neviděl. Když jí projde (třeba s nápovědou „váží zprava 1, 2, 4, 8“), zůstanou mu nepřeložené záznamy Váha světla, Hledání vah a Čtení nápisu a ve Shrnutí patra chybějí.
Doklad: progress.svelte.ts:153-169, 185; recordResult překládá Kodex jen za dokončenou komnatu (progress.svelte.ts:145); SummaryScreen.svelte:17.
Návrh: V patře I podmínit rychlou bránu i třemi otázkami na čtení a zápis (qRead, qWrite jako u Strážce). Nebo po bráně přeložit i záznamy přeskočených komnat 4–6.

### K-I-14 · I-9 (kvíz qTrailing) · text · nízká · jistá
**„Vpravo jsou jen 1 stín.“**
Popis: Když správná odpověď je 1, vysvětlení špatné možnosti „2“ má chybnou shodu.
Doklad: quizzes.ts:724; skript s7: „proč „2“: Vpravo jsou jen 1 stín.“
Návrh: `k === 1 ? 'Vpravo je jen jeden stín.' : `Vpravo jsou jen ${zeros(k)}.``

### K-I-15 · I-11 (kvíz qGrayMoves) · text · nízká · jistá
**Otázka oslovuje hráče v mužském rodě**
Popis: Otázka zní „Kolik doteků nejméně potřebuješ, abys prošel všech 16 kombinací…“ a porušuje rodově neutrální oslovení. Stejný problém mimo moje patro: „Teď větvení postav sám.“ (act3.ts:381).
Doklad: quizzes.ts:158.
Návrh: „Kolik doteků nejméně stačí na průchod všemi 16 kombinacemi řady 4 krystalů?“

### K-I-16 · I-12 · text · nízká · jistá
**„od nuly do dvě stě padesáti pěti“**
Popis: Chybný pád číslovky, správně je „do dvou set padesáti pěti“.
Doklad: act1.ts:458.
Návrh: „Oktáva unese čísla od nuly do dvou set padesáti pěti.“

### K-I-17 · I-4, I-5, I-8 · text · nízká · jistá
**Nejednotné „dvě“ a „dva“ v řadě vah**
Popis: Echo jednou říká „Čtyři, dvě, jedna.“ a „Jedna, dvě, čtyři, osm, šestnáct.“, jindy „Osm, čtyři, dva, jedna.“
Doklad: act1.ts:139, 179, 304.
Návrh: Sjednotit. Při počítání vah stačí všude „dvě“ (shoda s „váha“), nebo všude „dva“.

### K-I-18 · I-13 · text · nízká · jistá
**Jeden kotouč, ale rozhraní píše „Kotouče“**
Popis: Řeč glyfů má jediný kotouč. Echo správně říká „Kotouč nezapadl.“, ale srovnávací panel píše „Kotouče nezapadly. Porovnej kombinace:“ a hlášení pro čtečku „Kotouče ukazují … šestnáctkově“.
Doklad: act1.ts:498; Inscription.svelte:137; inscriptionEvents.ts:48.
Návrh: Podle `game.wheels` psát „Kotouč nezapadl“ a „Kotouč ukazuje“.

### K-I-19 · I-14 · chyba · nízká · jistá
**„Tak se dodnes zapisují bajty: krátce a bez chyb.“**
Popis: Šestnáctkový zápis chyby nevylučuje, jen se v něm člověk splete méně snadno než v osmi nulách a jedničkách.
Doklad: act1.ts:544.
Návrh: „Tak se dodnes zapisují bajty: krátce a přehledněji než osm nul a jedniček.“

### K-I-20 · I-9 · text · nízká · jistá
**Nepřesné nápovědy skupin**
Popis: Nápověda „Lichý je jen pravý krystal.“ tvrdí, že krystal je lichý, přitom lichou váhu má. U dělitelnosti čtyřmi stojí „jinak by zbyla jednička nebo dvojka“, ale zbytek může být i 3. Obě věty se ukazují i v ukázce kroku.
Doklad: act1.ts:323-324; altarGame.svelte.ts:56-58.
Návrh: „Lichou váhu má jen pravý krystal. Zbytek musí vážit nejvýš 4.“ a „…jinak by zbyl zbytek 1, 2 nebo 3.“

### K-I-21 · I-3, I-11, I-15 · didaktika · nízká · jistá
**Pravidlo „jediná změna“ vynucuje ovládání samo**
Popis: Dotek vždy přepne právě jeden krystal, takže „Každým dotekem jediná změna“ (zadání I-11 a I-15) ani nápověda I-3 „Zkus měnit vždy jen jeden krystal“ nic neříkají. Skutečné pravidlo Tichého kroku je „žádná kombinace dvakrát“. Hráč může hledat, jak změnit dva krystaly naráz.
Doklad: altar.ts:111 (flipBit jednoho bitu); act1.ts:95, 399, 578.
Návrh: Zadání I-11: „Projdi všech šestnáct kombinací tak, aby se žádná neopakovala.“ Nápověda 1 v I-3: „Hledej kombinaci, kterou deska ještě nezná, jen jedním dotekem od té, kde stojíš.“

### K-I-22 · I-8 (Kodex mocniny) · kurikulum · nízká · jistá
**Jednotky informace jen jednou větou**
Popis: Jediná zmínka zní „kibibajt (KiB) není 1000, ale 1024 bajtů“, bez srovnání s kilobajtem (kB = 1000 B). Značky b a B ani řada kB, MB, GB proti KiB, MiB, GiB nejsou nikde. Jednotky informace přitom patří ke standardní školní látce a k typickým otázkám v testech.
Doklad: kodex.ts:67-68.
Návrh: „Kilobajt (kB) je podle předpon SI 1000 B, kibibajt (KiB) 1024 B. Bit se značí b, bajt B.“ Jednu otázku dát do kvízu I-10 nebo I-12, které kvíz nemá.

### K-I-23 · I-7 · chyba · nízká · jistá
**„Poslední zkouška“ nemusí být poslední**
Popis: Po ukázce kroku přidá brána na konec zkoušku navíc. Echo přesto před patnáctkou řekne „Poslední zkouška: nejtěžší světlo čtyř krystalů.“ a v úvodu „Pět zkoušek“.
Doklad: act1.ts:265, 267; baseGame.svelte.ts:160, 171-180. Skript: po ukázce kroku u úlohy 4 (15) přibude `write 6`.
Návrh: Větu podmínit tím, že zkouška navíc nebyla přidaná. Nebo psát „Zkouška s nejtěžším světlem čtyř krystalů.“

### K-I-24 · I-6 · didaktika · nízká · jistá
**Holá část někdy nepozná zrcadlové čtení**
Popis: Generátor může dát oba holé nápisy (úlohy 4 a 5) souměrné: 0110, 1001 nebo 1111. Zrcadlové čtení, typická chyba z PLAYTEST 2, pak v jediné části bez opor nevyjde najevo.
Doklad: generators.ts:45-51. Skript: „I-6: obě holé úlohy souměrné v 1099/20000 losováních (5,5 %)“.
Návrh: V úlohách s indexem 3 a 4 souměrné nápisy vyloučit.

### K-I-25 · I-14, I-15 · didaktika · nízká · jistá
**Desítková hodnota na glyfových kotoučích nemá vlastní hlášku**
Popis: Typická chyba je nastavit na kotouče desítkovou hodnotu (3C = 60 → zadá „60“). readSlip ji nepozná a hráč dostane obecnou hlášku. Kvíz qByteHex tu samou chybu přitom vysvětluje.
Doklad: inscription.ts:137-145; quizzes.ts:227. Skript: „dvojznak 3C, zadáno 60: null“.
Návrh: Přidat slip „decimal“ (číslice na kotoučích tvoří desítkový zápis hodnoty) s hláškou „Tohle je desítkový zápis. Každá čtveřice je jeden glyf.“

### K-I-26 · patro I (Strážce schodů, učitel) · didaktika · nízká · jistá
**Výsledky Strážce schodů se nikam neukládají**
Popis: Strážce před patrem II se ptá na čtení, zápis a 2ⁿ. Je to jediné opakování patra I po přestávce, ale výsledek zůstane jen na obrazovce. Učitel nevidí, jestli převody přetrvaly do další hodiny.
Doklad: StairsScreen.svelte:36-44, 132-134 (proměnná `clean` se nikam neukládá).
Návrh: Zapsat do `stats` (např. pod klíč `II-stairs`) počet správných odpovědí napoprvé a ukázat ho v přehledu třídy.

### K-I-27 · I-1 (Kodex jiskra) · kurikulum · nízká · pravděpodobná
**„proud, nebo žádný proud“**
Popis: V číslicových obvodech se bit obvykle drží jako dvě úrovně napětí, ne jako přítomnost proudu. Jako zjednodušení to projde, ale žáci se s „logickou úrovní napětí“ potkají ve fyzice i v informatice.
Doklad: kodex.ts:11.
Návrh: „Ve stroji to může být vyšší, nebo nižší napětí; zmagnetováno, nebo ne; světlo, nebo tma.“

## Patro jako celek
Posloupnost pojmů sedí: bit → kombinace → 2ⁿ → poziční hodnota → převod 10 → 2 → převod 2 → 10 → syntéza. Hlubší síně pokračují pátým krystalem, sudostí, bajtem, Grayovým kódem a šestnáctkovou soustavou. Cyklus „zažij, objev, pojmenuj“ funguje. Kodex je věcně správný (všechny vzorce i čísla jsem přepočítal) a zápis s indexy 101₂, D₁₆ odpovídá učebnicím. Základ se podle PLAYTEST vejde do jedné hodiny. Hlubší síně odhaduji na další hodinu (domněnka).
Kurikulárně má patro tři mezery. Základ po I-3 nemá kvíz, takže ani pracovní list nezkouší převody (K-I-01, K-I-02). Šestnáctková soustava a bajt jsou z cílů 1.1, ale jen v nepovinných síních (K-I-11). Názvosloví se odchyluje od učebnic: chybí řád, základ a synonyma binární a hexadecimální, „váha“ znamená dvojí, „parita“ koliduje s paritním bitem a převod dělením je schovaný pod „Dnes:“ (K-I-08 až K-I-10).
Funkčně je nejvýraznější rozpor nápověd v Tichém kroku (K-I-04) a desítková ukázka kroku u glyfů (K-I-05). Učitel má dobré Shrnutí patra, ale přehled třídy ukazuje špatnou komnatu a rozehrané komnaty bere jako zaseknuté (K-I-06, K-I-07). Mapování na RVP a hodiny zatím chybí (K-I-12).

## Co funguje
- Kodex Krystal → Bit a „čti jedna-nula, ne deset“ hned v I-2. Typické chybě se předejde dřív, než vznikne.
- Losované kvízy patra I mají správné klíče (qTrailing: 0 chyb ve 2000 losováních) a u špatných možností vlastní vysvětlení typické chyby (zrcadlo, počet světel, 2ⁿ vs. 2n).
- Opory v I-6 mizí uvnitř komnaty a Echo to ohlásí ve správné chvíli. Hlášky po chybě čtení mají jméno: zrcadlo, počet světel, jediný krystal, prohozené glyfy.
- Kodex nabízí oba směry převodu i Hornerovo schéma, rozsah 0 až 2ⁿ − 1, bajt, KiB a mocniny dvojky s indexem pozice od nuly.
- I-9 poctivě vylučuje nulu u dělitelnosti a pěkně připravuje posun a dělení v patře II.
- Shrnutí patra k tisku dělí zákony na základ a Hlubší síně a učitel v něm vidí všechno. Strážce schodů před patrem II opakuje přesně čtení, zápis a 2ⁿ.
