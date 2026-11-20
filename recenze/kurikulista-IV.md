# Kurikulista · patro IV

Skripty: `sim/kurikulista-IV/act4.test.ts` (řešení a ideál všech úloh, 60 losování bran, kvízy, klopné obvody na úrovni hradel) a `sim/kurikulista-IV/wrong.test.ts` (kde padají chybná osazení, které úlohy mají desku a které jen pravidlo).

## Komnaty
- **Strážce schodů (před IV):** Otázky jsou runa podle zákona, počet řádků desky a čtení čtveřice. Čtení čísel je pro Hlubinu dobrá volba, protože pod deskou stále běží odečty čísel. Úvodní věta ale slibuje tři zákony „z minulého patra“, přitom čtení je z Předsíně (K-IV-23).
- **IV-0 Stroj, který počítá:** Hotová poloviční sčítačka, čtyři kombinace a aha „1 + 1 = 10“. Odečet je nadepsaný „lampy“, takže Echo otázku neprozradí. Podle PLAN.md nemá kvíz ani Kodex, funguje.
- **IV-1 Poloviční sčítačka:** Nejdřív se vkládá jen Výluka, pak obě runy. Past s Rozcestím a kvíz, který se na ni ptá, jsou didakticky výborné. Kodex značí přenos C, zbytek patra P (K-IV-20). Titul komnaty už prozradí moderní jméno, které Echo pak slavnostně „oznámí“ (K-IV-19).
- **IV-2 Úplná sčítačka:** Zkoumání osmi kombinací a stavba tří run. Stavbu splní Rozcestí i Výluka v posledním kameni (dvě řešení), Echo ale vždy řekne „Rozcestí“ (K-IV-18). Kodex je odborně správný (S = A ⊻ B ⊻ P, přenos jako funkce většiny).
- **IV-3 Řetěz sčítaček:** Abstrakce a točitý kámen. Všechny tři řetězy mají jediné řešení, i ten, kde se přenos dá vzít z kterékoli sčítačky. Kvízy (8 sčítaček na oktávu, světlo v prvním přenosu = +1) jsou správné. Kodex uvádí jen anglický termín ripple-carry (K-IV-21).
- **IV-4 Porovnávač:** Zkoumání Rovnosti a dvoubitový porovnávač „stejné/různé“, obojí s jediným řešením. Při 16 řádcích se deska neukazuje, Echo po chybě přesto posílá hledat řádek (K-IV-15). Kodex indexuje bity pozicí (A₁, A₀), deska vahou (A₂, A₁) (K-IV-04). Porovnává se jen rovnost (K-IV-22).
- **IV-5 Výhybka:** Cíle s Echem jsou nejsilnější formát patra a stavba má jediné řešení. Echo po třetím cíli ale odpoví na otázku čtvrtého cíle dřív, než ji hráč vyzkouší (K-IV-17). Kodex multiplexoru je správný a zobecnění na 4 a 8 vstupů sedí.
- **IV-6 Rozdělovač:** Dekodér nejdřív s lampami 0 a 3, pak se všemi, vždy s jediným řešením. Kvíz se zobecněním 2ⁿ je správný. Příklad v Kodexu (sedmisegmentový displej) neodpovídá definici „svítí právě jeden výstup“ (K-IV-22).
- **IV-7 Brána Hlubiny:** Tři zkoušky. Generátory dávají v 60 losováních vždy právě jedno řešení. Kvíz qChainSum je správný a typické chyby (bez přenosu, Rozcestí po sloupcích, chybí nejtěžší lampa) mají vlastní vysvětlení. Zadání „(a vlož runu)“ platí jen pro výhybku (K-IV-24). Po bráně hra poctivě řekne, že prototyp dál nevede.
- **IV-8 Ozvěna:** Cíle odhalí paměť dřív, než ji hra pojmenuje, a stavba kruhu má jediné řešení. Chybí zakázaný stav S = R = 1, který učebnice u klopného obvodu RS uvádějí vždy (K-IV-07). Echo přehání tvrzením „každý bit paměti v počítači“ (K-IV-14).
- **IV-9 Tep Srdce:** Brána tepu (Pouta + ozvěna) je klopný obvod D řízený úrovní, ozvěna s tepem ale funguje jako obvod řízený hranou. Hra je vydává za totéž (K-IV-01). Hláška po chybné stavbě popisuje chybu, kterou tu nejde udělat (K-IV-02).
- **IV-10 Registr:** Cíle (ulož 5, vstup se mění, paměť drží) a posuvný registr s jediným řešením. Zkouška ukáže i ztrátu světla nahoře (5 → 2), tedy návaznost na Příliv. Kvíz i Kodex jsou správné.
- **IV-11 Počítadlo hvězd:** Hotový čítač (do 3, do 6, přetočit na 0) a stavba s jediným řešením. Kodex (Q ← Q + 1 mod 2ⁿ) je správný. Losovaný kvíz qCounter ve čtvrtině losování vysvětluje přetečení, které nenastalo (K-IV-03).
- **IV-12 Odčítačka:** A − B = A + ¬B + 1 a pak sčítačka-odčítačka s M, obě úlohy s jediným řešením. Odborně je komnata správná, ale stojí na nepovinné II-13 Doplněk (K-IV-09).
- **IV-13 Volič operace:** Přehozené voliče výhybek nutí číst cesty, to je dobré. Stroj vybírá jen ze čtyř logických operací, a přesto se mu říká ALU (K-IV-05). V nápovědě se slovo „vstup A“ výhybky plete s operandem A (K-IV-25).
- **IV-14 Násobička:** Násobička 2 × 2 ze čtyř Pout a dvou polovičních sčítaček je zapojená správně. Projdou dvě řešení, což je v pořádku (sčítance jde prohodit). Poznámky „A₂ × B₂“ indexují vahou, Kodex „Σ … 2ⁱ“ pozicí (K-IV-04). Komnata stojí na nepovinné II-10 (K-IV-09).
- **IV-15 Velká brána Hlubiny:** Počítadlo s chodem (synchronní nulování) a volič s losovanými kódy jsou opravdová syntéza, vždy s jediným řešením. Kvíz „který stroj potřebuje tep“ je přesně rozdíl kombinační/sekvenční, jen bez těch slov (K-IV-08). První hláška po chybě míří jinam, než kde chyba bývá (K-IV-16). Kodex přehání „všechny části procesoru“ (K-IV-06).

## Nálezy

### K-IV-01 · IV-9 · chyba · střední · jistá
**Brána tepu a ozvěna s tepem nejsou totéž (klopný obvod D řízený úrovní vs. hranou)**
Popis: V první části IV-9 hráč staví bránu tepu: Pouta s T před ozvěnou RS. Je to klopný obvod D řízený úrovní (závora), který D propouští po celou dobu, co T svítí. Druhá část říká „Brána tepu je teď v jednom kameni: ozvěna s tepem“. Ozvěna s tepem ale v jádru převezme D jen v okamžiku tepu, všechny naráz z ustáleného stavu před tepem. Chová se tedy jako klopný obvod D řízený hranou, a jen díky tomu fungují registr, posuvný registr a čítač v IV-10 a IV-11. Z bran tepu by se posuvný registr postavit nedal: se svítícím T by světlo proteklo několika patry naráz. Kodex „Tep Srdce“ oba pojmy slévá do věty „zapamatuje si vstup D jen při hodinovém pulzu“. České učebnice obvody řízené úrovní a hranou rozlišují.
Doklad: act4.ts:637–645 (gatedLatch), act4.ts:687, machines.ts:311–326, machine.ts:325–342 (beat), kodex.ts:582–587. Skript, brána tepu se svítícím T: `D=1 T=1 → Q=1; D=0 T=1 → Q=0; D=1 T=1 → Q=1`, takže Q sleduje D, dokud T svítí.
Návrh: Echo ve druhé části: „Ozvěna s tepem je přísnější než brána tepu: D převezme jen v okamžiku tepu, ne celou dobu, co tep svítí.“ Do Kodexu dvě věty: „Brána tepu je klopný obvod D řízený úrovní: dokud T svítí, výstup sleduje D. V registrech a čítačích jsou klopné obvody D řízené hranou, které převezmou D jen v okamžiku tepu. Jinak by světlo proteklo víc pater najednou.“

### K-IV-02 · IV-9 · chyba · střední · jistá
**Hláška „Ozvěna poslouchá, i když nemá“ nikdy neodpovídá chybě**
Popis: Pouta s T jsou v bráně tepu pevná, takže bez světla T se ozvěna změnit nemůže, ať jsou točité kameny natočené jakkoli. Všechna tři chybná zapojení padnou ve 2. kroku zkoušky (D = 1, T = 1, má svítit Q). Ozvěna tedy *nepřevzala* světlo, když měla, nebo převzala opak. První hláška po chybě ale tvrdí opak a navede hráče špatným směrem.
Doklad: act4.ts:650; machines.ts:320–321; skript wrong.test.ts: `IV-9 Brána tepu: kombinací=4, první chyba v kroku: {"1":3,"OK":1}`, u všech tří `shown: {"Q":0}`.
Návrh: „Při tepu ozvěna nepřevzala D. Projdi 2. krok zkoušky a sleduj, co teče do S a co do R.“

### K-IV-03 · IV-11 · chyba · střední · jistá
**Kvíz qCounter vysvětluje přetečení, které nenastalo**
Popis: Generátor losuje start 4–7 a 2–4 tepy. Ve třech z dvanácti kombinací (4 + 2, 4 + 3, 5 + 2) počítadlo nepřeteče, vysvětlení je ale napsané napevno pro přetečení. Hráč pak čte nesmysl.
Doklad: generators4.ts:205–226 (explain na ř. 225). Skript: „Tříbitové počítadlo hvězd ukazuje 4. Co ukáže po 2 tepech?“ → explain „Po sedmičce přijde 0. 4 + 2 = 6, tři krystaly ale unesou nejvýš 7, takže po přetečení zbude 6.“ Totéž pro 4 + 3 a 5 + 2.
Návrh: Vysvětlení rozdělit podle `start + beats > 7`. Bez přetečení stačí „4 + 2 = 6. Tři krystaly unesou 7, takže počítadlo nepřeteče.“ Případně losovat jen kombinace s přetečením, protože na ně se otázka ptá.

### K-IV-04 · IV-4, IV-14, Kodex · kurikulum · střední · jistá
**Dolní index znamená ve hře tři různé věci**
Popis: Deska Dílny píše u krystalů dolní index s *vahou* (A₂, A₁, u tří bitů A₄ A₂ A₁) a poznámky násobičky „A₂ × B₂“. Kodex na stejném patře indexuje *pozicí*: porovnávač „(A₁ ⇔ B₁) ∧ (A₀ ⇔ B₀)“, násobička „Σ (A ∧ Bᵢ) · 2ⁱ“. Od Aktu I navíc dolní index znamená *základ soustavy* (101₂ = 5). V IV-4 tak žák vidí na desce A₂ A₁ a v Kodexu A₁ A₀ pro tytéž krystaly. České učebnice indexují bity řádem (a₀ je nejnižší řád), takže kolidovat bude i zápis, který žák potká ve škole. Komentář v kódu (machine.ts:71, „třeba A₁ × B₀“) přitom počítá s indexy podle pozice.
Doklad: Workshop.svelte:62–69, 216 a 250 (weightOf v hlavičce desky), MachineBoard.svelte:292, machines.ts:687–691, machine.ts:71, kodex.ts:532, kodex.ts:641, kodex.ts:43.
Návrh: Rozhodnout se pro jeden zápis. Doporučuji indexy podle řádu (A₁ A₀) jako v učebnicích, váhu ukázat zvlášť pod krystalem (už tam je). Když váhový index zůstane, přepsat vzorce v Kodexu na stejné značení a v Kodexu jednou větou vysvětlit, že A₂ je krystal s vahou 2.

### K-IV-05 · IV-13 · kurikulum · střední · jistá
**„Aritmeticko-logická jednotka“ bez aritmetiky**
Popis: Volič operace vybírá jen z Pouta, Rozcestí, Výluky a Zlomeného pouta. Echo i Kodex přitom říkají „Tohle je jádro procesoru: aritmeticko-logická jednotka“. Žák si odnese, že ALU je výběr logické operace. Sčítačka a odčítačka, které stejné patro staví o komnaty dřív, se k voliči nikdy nepřipojí.
Doklad: act4.ts:80, act4.ts:906, act4.ts:921, kodex.ts:625–631 (vzorec „00 → AND · 01 → OR · 10 → XOR · 11 → NAND“).
Návrh: Nejmenší úprava je do Kodexu i Echa přidat větu „Skutečná ALU má mezi operacemi i sčítačku a odčítačku z předchozích komnat, volič operace tu ukazuje její logickou část.“ Lepší by bylo mít ve velké bráně kód „součet“ s úplnou sčítačkou a lampou přenosu, což navrhoval už PLAYTEST 8.3.6 (A − B).

### K-IV-06 · IV-15 (Kodex) · kurikulum · střední · jistá
**„To jsou všechny části jednoduchého procesoru“**
Popis: Shrnutí Hlubších síní IV tvrdí, že klopné obvody, hodiny, registry, čítač, odčítání, násobička a ALU jsou *všechny* části procesoru, a vzorec říká „paměť + hodiny + ALU = procesor“. Chybí řadič, tedy část, která čte instrukce a podle kódu operace řídí ostatní. Právě to je jádro tématu principy počítače (von Neumannovo schéma: procesor = ALU + řadič + registry, k tomu paměť a vstupy a výstupy). Vzorec navíc staví „paměť“ dovnitř procesoru.
Doklad: kodex.ts:651–653.
Návrh: „Registry, hodiny, čítač a ALU tvoří jádro procesoru. Chybí řadič: ten čte program a podle kódu operace říká ALU, co má spočítat.“ Vzorec: „registry + hodiny + ALU + řadič = procesor“. Řadič pak naváže na Finále.

### K-IV-07 · IV-8 · kurikulum · střední · jistá
**Zakázaný stav S = R = 1 klopného obvodu RS chybí**
Popis: Kodex Ozvěny popisuje S, R a držení stavu, ale ne kombinaci S = R = 1. Na úrovni hradel v ní obě Zavřená rozcestí dají 0, takže Q i „¬Q“ jsou stejné a vzorec ¬Q přestává platit. Po současném uvolnění obou vstupů je výsledek ve skutečném obvodu neurčitý. Ve školní látce o klopném obvodu RS je to standardní bod a častá otázka.
Doklad: kodex.ts:573–575. Skript: `both: S=1 R=1 → q=0 nq=0 stable=true`.
Návrh: Do Kodexu „S i R naráz je zakázaný stav: obě runy zhasnou a Q přestane být opakem ¬Q. Po uvolnění obou vstupů naráz nejde říct, co si obvod zapamatuje.“ V cílech IV-8 se dá přidat volitelná otázka „Rozsviť S i R. Co ukazuje lampa?“.

### K-IV-08 · patro IV · kurikulum · střední · jistá
**Pojem sekvenční obvod v patře nepadne**
Popis: Rozdělení na kombinační a sekvenční logiku je v učebnicích hlavní osa kapitoly o obvodech. Slovo „kombinační“ je jen v Kodexu Shrnutí Aktu IV, „sekvenční“ nikde ve hře. Kvíz velké brány („Který z těchto strojů potřebuje tep?“) se přitom ptá právě na tento rozdíl.
Doklad: kodex.ts:563 (jediný výskyt „kombinačních“), act4.ts:1023–1029. Hledání „sekvenční“ v src nenajde nic.
Návrh: Do Kodexu Ozvěny nebo Shrnutí Hlubších síní IV: „Obvody bez paměti se jmenují kombinační: výstup záleží jen na tom, co právě teče dovnitř. Obvody s pamětí jsou sekvenční: výstup záleží i na tom, co bylo dřív.“ Stejnou větu dát do vysvětlení kvízu IV-15.

### K-IV-09 · IV-12, IV-14 · kurikulum · střední · jistá
**Hlubší síně IV stojí na nepovinných Hlubších síních II**
Popis: Hlubší síně IV se otevřou hned po IV-7 bez ohledu na Hlubší síně II. IV-12 přitom staví na Doplňku (II-13): Echo říká „V Doplňku se odčítalo sčítáním“, nápověda „Vzpomeň na Doplněk“, nápověda kvízu „Jak se v Doplňku zapsalo záporné číslo?“. IV-14 staví na Násobení po lumenitsku (II-10): „V Síni Počtářů se násobilo kopiemi a sčítáním“. Pro hráče základní cesty (podle PLAYTEST většina třídy) to nejsou připomínky, ale odkazy na neznámé komnaty, a druhé tvrzení je pro něj nepravdivé. PLAN.md pro Archiv stanoví opačné pravidlo: Hlubší síně staví jen na základních cestách.
Doklad: progress.svelte.ts:178–184; act4.ts:867, 872, 895 (IV-12); act4.ts:951, 956 (IV-14); PLAN.md:438–439.
Návrh: Buď IV-12 začít krátkými cíli, ve kterých hráč doplněk zažije (−3 jako 101 na třech krystalech), a IV-14 jednou ukázkou kopií, nebo podmínit repliku Echa tím, jestli je II-13 (II-10) hotová. Minimum je poznámka na mapě „navazuje na II-13 Doplněk“. Totéž pravidlo jako pro Archiv zapsat do PLAN.md i pro IV.

### K-IV-10 · celá hra · kurikulum · vysoká · jistá
**Základní cesta nepokrývá polovinu cílů z PLAN 1.1**
Popis: PLAN 1.1 popisuje, co hráč „po dohrání umí“, a kap. 6 říká, že „základ stačí na celou hru“. Pro hráče, který projde jen základní cesty I–IV (tak hru podle playtestu hraje většina třídy), je stav takový:
- Bit a stav: bit a 2ⁿ ano. Bajt jen větou v Kodexu (I-3), oktáva je až v I-10.
- Soustavy: dvojková a desítková ano, ale jen čtveřice a výsledky do 31. Šestnáctková je jen v I-13 a I-14.
- Aritmetika: sčítání, přenos, přetečení a posun ano. Odčítání s výpůjčkou je jen v II-8.
- Logika: šest hradel a tabulky ano. De Morgan je jen v III-8.
- Obvody: celé.
- Paměť (zpětná vazba, klopný obvod, čítač): nic, všechno je v IV-8 až IV-11.
- Kódování: nic. ASCII se objeví jen v nepovinné III-13, doplněk v II-13 a IV-12, parita, oprava chyb, obraz a zvuk nejsou nikde (Akt V chybí).
- Abstrakce: součástka ano (IV-3). „Program je posloupnost bitů“ nic (Finále chybí).

I hráč, který projde všech 64 komnat, nedostane z kódování nic kromě ASCII a doplňku. Učitel, který podle PLAN 1.1 počítá s tématem paměti, ho na základní cestě nenajde.
Doklad: PLAN.md:22–33 a 301–307; mapa.md (rozdělení komnat); PLAN.md:385 („paměť je celá v Hlubších síních“).
Návrh: V PLAN 1.1 přidat sloupec „základ / Hlubší síně / Akt V“, aby učitel viděl, co pokrývá základní cesta. Pro paměť zvážit, jestli na základní cestu nevzít aspoň cíle z IV-8 (tři minuty a nejsilnější aha patra): paměť je v principech počítače ústřední. Případně ji zapojit do Finále, které podle PLAN.md paměť nepotřebuje.

### K-IV-11 · celá hra · kurikulum · střední · jistá
**Konec hry: žádný závěr ani výstupní test**
Popis: Po IV-7 výsledek poctivě oznámí „Dál prototyp zatím nevede, Archiv Hlasů ještě spí“. Po IV-15, poslední komnatě hry, je jen tlačítko „Zpět na mapu“ bez věty o konci a bez shrnutí celé hry. Zkouška zasvěcení z PLAN 3.8 (stejné úlohy na začátku a na konci, „hráč vidí svůj posun, my vidíme, jestli hra učí“) není implementovaná. Učitel tak nemá na konci hry žádné měření posunu. Epilog (PLAN 2.5) chybí, což se u prototypu bez Aktu V dá čekat.
Doklad: LevelComplete.svelte:142 a 161–166; Level.svelte:58 a 703 (floorDone jen pro komnatu 7); PLAN.md:249; hledání „zasvěcení“ v src nenajde nic.
Návrh: Po IV-15 (a po IV-7 pro hráče základní cesty) ukázat závěrečnou kartu prototypu: co se hráč naučil, odkaz na Shrnutí všech pater a deset úloh z generátorů Strážců jako výstupní test. Výsledek uložit do souboru s postupem, ať ho vidí Přehled třídy.

### K-IV-12 · patro IV · kurikulum · střední · jistá
**Učitel nemá k patru kartu ani pracovní list, který by se lišil**
Popis: Pracovní list IV bere 8 z 9 kvízů základní cesty. Osm z nich je pevných, losuje jen qChainSum. Dvě varianty se proto liší jedinou otázkou a pořadím možností a slib „každý tisk s jinými čísly“ pro IV neplatí. Hlubší síně (paměť, ALU) list nemají vůbec. Chybí i to, co PLAN.md sám vede jako nehotové: mapování na RVP a materiály pro učitele (cíle patra, doba, rozdělení do hodin, očekávané výstupy).
Doklad: WorksheetScreen.svelte:17–26; kvízy act4.ts:137–156, 215–223, 258–273, 324–332, 417–425, 454–462, 522; PLAN.md:867 („- [ ] Materiály pro učitele: … mapování na RVP“).
Návrh: Přidat losované otázky k základní cestě: co ukážou lampy poloviční nebo úplné sčítačky pro dané vstupy, kterou lampu rozsvítí rozdělovač pro číslo, co pustí výhybka. Pracovní list nabídnout i pro Hlubší síně. Do Shrnutí patra v učitelském režimu doplnit kartu: cíle, odhad času (data má roomStats), návrh dvou hodin a výstupy RVP.

### K-IV-13 · patro IV · kurikulum · střední · jistá
**Moderní zápis v posledním patře nepřevažuje**
Popis: PLAN 2.3 bod 3: po překladu hra ukazuje oba zápisy „a v pozdějších aktech převažuje ten moderní“. V Aktu IV ale Echo, nápovědy ani kvízy nepoužijí AND, OR, XOR, NAND ani NOR ani jednou. Moderní značka je jen drobně u runy na desce a v Kodexu. Po přeložení Výhybky, Rozdělovače a Ozvěny hra dál říká výhybka, rozdělovač, ozvěna („Sčítačka, výhybka, rozdělovač a porovnávač“). Pracovní list tak testuje lumenitské pojmy, ne školní. Přenos do výuky a k maturitě je tím slabší.
Doklad: PLAN.md:93–94; act4.ts (hledání AND|XOR|OR v textech: jen titulky komnat a „Moderní jméno je …“); act4.ts:471.
Návrh: Od Aktu IV psát v nápovědách a vysvětleních kvízů po překladu oba názvy („Výluka (XOR)“, „výhybka (multiplexor)“). Do kvízů základní cesty přidat jednu otázku na moderní jméno součástky.

### K-IV-14 · IV-8 · chyba · nízká · jistá
**„Každý bit paměti v počítači drží podobný kruh“**
Popis: To platí pro registry a vyrovnávací paměť (SRAM). Operační paměť (DRAM) drží bit nábojem kondenzátoru, flash a disky také jinak. Kodex to říká přesně, Echo přehání.
Doklad: act4.ts:535 vs. kodex.ts:576.
Návrh: „Každý bit v registrech procesoru drží podobný kruh.“

### K-IV-15 · IV-4 · chyba · nízká · jistá
**Echo posílá hledat řádek desky, která se neukazuje**
Popis: Porovnávač má čtyři vstupy a 16 řádků, takže Dílna místo desky ukazuje jen pravidlo a okénko „Stroj se spletl“. První hláška po chybě přesto říká „Najdi řádek, kde svítí jinak.“
Doklad: act4.ts:320; Workshop.svelte:57 (bigTable pro víc než 8 řádků) a 233–245; skript wrong.test.ts: „IV-4 Porovnávač: vstupů=4, řádků=16, JEN PRAVIDLO (bez desky)“.
Návrh: „Lampa se plete. Nastav čísla z okénka Stroj se spletl a porovnej sloupec po sloupci.“

### K-IV-16 · IV-15 · text · nízká · jistá
**První hláška po chybě počítadla s chodem míří na zhasnutí C**
Popis: Echo poprvé říká „sleduj, co teče do sčítaček, když C zhasne“. Ze 80 chybných osazení ale 77 padne už v 1. kroku, kdy C svítí (počítadlo vůbec nezačne počítat). Hráče to pošle ke kroku, který není na řadě.
Doklad: act4.ts:1004; skript wrong.test.ts: „IV-15 Počítadlo s chodem: kombinací=81, první chyba v kroku: {"0":77,"1":2,"4":1,"OK":1}“.
Návrh: Obecnější první hláška („Projdi kroky zkoušky tepem: počítá stroj, dokud C svítí? Vynuluje se, když C zhasne?“), nebo věta podle toho, jestli padl krok se svítícím, nebo zhasnutým C.

### K-IV-17 · IV-5 · didaktika · nízká · jistá
**Echo prozradí odpověď na čtvrtý cíl**
Popis: Po třetím cíli („Rozsviť lampu znovu. Volič ať svítí dál.“) Echo řekne „A teď na lampu nemá vliv.“ Hned potom čtvrtý cíl teprve ptá „Zhasni A. Svítí lampa pořád?“. Objev, na který se cíl ptá, je tak řečený předem.
Doklad: act4.ts:371–380 a 392–396; machineEvents.ts:72 (found[index + 1] po splnění cíle).
Návrh: Repliku 3 změnit na „Volič svítí, lampa poslouchá B.“ a věta o A přijde až po čtvrtém cíli (do solved části).

### K-IV-18 · IV-2 · didaktika · nízká · jistá
**Dvě správná řešení úplné sčítačky, Echo zná jen jedno**
Popis: Poslední kámen projde Zkouškou s Rozcestím i s Výlukou, protože obě Pouta nikdy nesvítí naráz. Echo vždy řekne „Dvě Výluky, dvě Pouta a Rozcestí“, i když hráč vložil Výluku. Dobrá otázka „proč tu stačí i Výluka“ zůstane nevyužitá.
Doklad: act4.ts:166; skript: „IV-2 Stavba solutions=2 … c: or / c: xor“.
Návrh: Do Kodexu Úplné sčítačky: „Pouta A ∧ B a P ∧ (A ⊻ B) nikdy nesvítí naráz, proto je spojí Rozcestí i Výluka.“ Echo pak nemusí runu jmenovat.

### K-IV-19 · patro IV · text · nízká · jistá
**Nejednotné lumenitské a moderní názvy komnat**
Popis: V Zahradě nesou komnaty lumenitská jména (Pouto, Rozcestí) a Kodex je přeloží. V Hlubině jsou IV-1, IV-2, IV-4, IV-10 a IV-14 pojmenované moderně dřív, než Kodex „přeloží“ Malého počtáře na Poloviční sčítačku. Echo pak v komnatě s titulem „Poloviční sčítačka“ oznamuje „Moderní jméno je poloviční sčítačka“. U Registru má Kodex lumenitské i moderní jméno stejné.
Doklad: act4.ts:112 a 134; kodex.ts:494–495, 592–593.
Návrh: Komnaty pojmenovat lumenitsky podle Kodexu (Malý počtář, Velký počtář, Strážce shody, Řada ozvěn, Násobicí stroj), nebo naopak z Echa vypustit „Moderní jméno je…“ tam, kde ho už říká titul.

### K-IV-20 · Kodex IV · text · nízká · jistá
**Značení v Kodexu: přenos C/P a tečka jako oddělovač**
Popis: (1) Kodex poloviční sčítačky značí přenos C, Kodex úplné sčítačky, deska i součástky P (výstupy S a P). (2) Vzorce oddělují dva vztahy znakem „·“: „S = A ⊻ B · C = A ∧ B“. Ve školní Booleově algebře je „·“ logický součin, který váže silněji než ⊻, takže žák přečte S = A ⊻ (B ∧ C). Kodex jinde používá „·“ i pro násobení (1·4 + 0·2).
Doklad: kodex.ts:498–499, 509–510; machine.ts:23–25; kodex.ts:43, 389, 575, 641.
Návrh: Přenos všude P. Vzorce oddělovat středníkem nebo novým řádkem.

### K-IV-21 · IV-9, IV-11, IV-15, Kodex · text · nízká · jistá
**„Hodiny“ ve dvou významech a chybějící české termíny**
Popis: „Hodiny“ jsou v IV-9 a v Kodexu hodinový signál („Říká se mu hodiny“). V IV-11 a IV-15 jsou to hodinky („sekundy v hodinkách“, „Tak se nulují i hodiny“). Druhá věta pak zní, jako by se nuloval hodinový signál. Učebnice mluví o hodinovém (taktovacím) signálu. U řetězu sčítaček uvádí Kodex jen anglické „ripple-carry adder“, bez českého názvu (sčítačka s postupným, sériovým přenosem).
Doklad: act4.ts:625, 796, 1005; kodex.ts:582–587, 520.
Návrh: V Kodexu „hodinový signál (hodiny, takt)“. V IV-15 „Tak se nulují i stopky.“ V Kodexu součástky „sčítačka s postupným přenosem (ripple-carry)“.

### K-IV-22 · IV-4, IV-6 (Kodex) · kurikulum · nízká · pravděpodobná
**Dva příklady z dneška v Kodexu nesedí**
Popis: (1) Dekodér: definice říká, že ze 2ⁿ výstupů svítí právě jeden, a hned potom „displej kalkulačky podle něj rozsvítí segmenty číslice“. Sedmisegmentový dekodér rozsvítí několik segmentů naráz, je to převodník kódu. (2) Porovnávač: „podmínka ‚když se rovná‘ je v procesoru právě takový obvod.“ Procesory obvykle porovnávají odečtením v ALU a příznakem nuly. Učebnice navíc u komparátoru uvádějí i výstupy A > B a A < B, hra porovnává jen rovnost a v Kodexu to neřekne.
Doklad: kodex.ts:552–554, 531–533.
Návrh: U dekodéru nechat jen paměť a adresu, případně výběr řádku klávesnice. U porovnávače: „Skutečné komparátory poznají i větší a menší. Procesor často porovnává tak, že čísla odečte a hlídá nulu.“

### K-IV-23 · Strážce schodů IV · text · nízká · jistá
**„Tři zákony z minulého patra“, ale jedna otázka je z Předsíně**
Popis: Karta schodů slibuje tři zákony z minulého patra (Zahrada Bran). Třetí otázka (qRead, čtení čtveřice) je z Aktu I. Volba je správná, popis ne. Totéž platí na schodech do III.
Doklad: StairsScreen.svelte:89; act4.ts:1045; quizzes.ts:617–634.
Návrh: „Zeptá se na tři zákony: dva z minulého patra a jeden starší, který se v Hlubině hodí.“

### K-IV-24 · IV-7 · text · nízká · jistá
**Zadání „(a vlož runu)“ u rozdělovače**
Popis: Druhá zkouška brány má společné zadání pro rozdělovač i výhybku, runa se ale vkládá jen do výhybky. V IV-12 se stejná věc vyřešila zadáním podle úlohy (`say`).
Doklad: act4.ts:496–498; generators4.ts:93–96 (vzor řešení v IV-12).
Návrh: `say` u každé úlohy: „Natoč točité kameny rozdělovače…“ a „Natoč točité kameny a vlož runu výhybky…“.

### K-IV-25 · IV-13, IV-15 · text · nízká · pravděpodobná
**„Horní vstup A“ výhybky vs. krystal A**
Popis: Nápověda voliče operace říká „Výhybka pustí horní vstup A, když její volič mlčí“. Na desce jsou ale krystaly A a B jako operandy runy a do výhybek teče výstup run, ne krystal A. Slovo „A“ tu znamená dvě různé věci.
Doklad: act4.ts:910 a 1017; machine.ts:27 (vstupy součástky mux A, B, V).
Návrh: „Výhybka pustí horní cestu, když její volič mlčí, a dolní, když svítí.“

## Patro jako celek
Základní cesta IV pokryje řádek „Obvody“ z PLAN 1.1 celý a v učebnicovém pořadí: poloviční sčítačka → úplná → řetěz (abstrakce) → porovnávač → multiplexor → dekodér → brána. Jádro je odborně správné. Všech 25 stavebních úloh (i 60 losování obou bran) má jedno, u IV-2 a IV-14 dvě řešení a zapojení odpovídají učebnicovým schématům. Kvízy mají správné odpovědi, chyba je jen ve vysvětlení qCounter. Slabší je názvosloví: indexy, C/P, „hodiny“, ALU bez aritmetiky, chybí sekvenční obvod a zakázaný stav RS. Hlavně se v textech skoro neobjeví moderní jména, ke kterým má hra žáka dovést.

Čas: playtest naměřil 20–55 minut základní cesty, po rozšíření IV-3 a IV-4 počítám spíš s 25–60. Do jedné hodiny se tedy vejdou jen rychlejší. Pro běžnou třídu doporučuji dvě hodiny: (1) Strážce, IV-0 až IV-3 a společný rozbor sčítačky, (2) IV-4 až IV-7 a pracovní list. Hlubší síně jsou další jedna až dvě hodiny (IV-8 až IV-11 paměť, IV-12 až IV-15 stroje), vhodné pro seminář.

Vůči RVP G (Informatika, digitální technologie a principy fungování počítače; logika navazuje na výrokovou logiku z matematiky, přesné znění výstupů jsem proti textu RVP neověřoval) je patro silné v tom, jak počítač počítá. Jak si pamatuje, je jen nepovinné, a jak vykonává program (řadič, instrukce), chybí, protože chybí Akt V a Finále. Jako konec hry patro funguje napůl: po IV-7 poctivě oznámí konec prototypu, po IV-15 hráče vrátí na mapu bez závěru a bez výstupního testu. Učitel potřebuje kartu patra (cíle, čas, výstupy RVP) a pracovní list, který se mezi variantami opravdu liší a existuje i pro Hlubší síně.

## Co funguje
- Posloupnost základní cesty přesně odpovídá učebnici a každá součástka přichází s jedním novým nápadem.
- Abstrakce je postavená poctivě: sčítačka z run se v IV-3 stane jedním kamenem a dál se s ní pracuje jako se součástkou (IV-11, IV-12, IV-14).
- Cíle s Echem (IV-5, IV-8 až IV-11) dávají zažít paměť a multiplexor dřív, než je hra pojmenuje.
- Past s Rozcestím v IV-1 a kvíz, který se na ni ptá.
- Odečty čísel pod deskou udrží čtení dvojkových čísel z Aktu I až do posledního patra.
- Zkouška paměti krok za krokem (skript s tepy) je dobrý model, jak se ověřuje sekvenční obvod.
- Losované brány (IV-7, IV-15) mají vždy právě jedno řešení a nedají se opsat.
- Kodex Aktu IV je až na uvedené výjimky odborně přesný a jeho vzorce (S = A ⊻ B ⊻ P, A − B = A + ¬B + 1, Q ← Q + 1 mod 2ⁿ) jsou učebnicové.
- IV-15 je skutečná syntéza (paměť, sčítačka a Pouta v jednom stroji, synchronní nulování), ne kopie komnat.
