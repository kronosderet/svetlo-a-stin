# Didaktik · patro III

Prošel jsem patro tak, jak ho potká hráč: Strážce schodů, III-0 až III-7, pak III-8 až III-15. U každé komnaty jsem četl definici v `src/content/act3.ts`, generátory (`src/content/generators3.ts`), kvízy, Kodex, logiku hádanek (`src/core/puzzles/gate.ts`, `table.ts`, `mask.ts`), hlášky (`src/ui/screens/level/gateEvents.ts`, `maskEvents.ts`, `src/game/stepWords.ts`) a herní obaly (`gateGame`, `tableGame`, `maskGame`). Hrál jsem skriptem `sim/didaktik-III/play.test.ts`: řešení všech losovaných obvodů, rozložení losů, ukázky kroku, hlášky po špatné runě, vzorky kvízů. Věci vyřešené podle PLAYTEST.md kap. 10 (závoj lampy v III-7 a III-8, písmena v Tajné řeči, ideál Masek, jméno Rovnosti, zkoumání větvení v III-6) neopakuji. Opisování desky z lampy v III-2 až III-4 beru jako záměr (PLAYTEST 9.3.2).

## Komnaty
- **Strážce schodů (před III):** tři otázky (`qAdd`, `qShiftLeft`, `qRead`, act3.ts:946), přeskočitelné, bez pečetí. Špatné odpovědi mají vlastní vysvětlení. Distraktor „Sečteno bez přenosů“ v `qAdd` je vlastně Výluka a hezky připravuje III-4, jen to nikde nezazní. Funguje.
- **III-0 Cesta světla:** jeden dotek, lampa ukazuje, co k ní doteče. Jako hračka na naladění stačí. Echo tu jmenuje Obraceč „nejjednodušší kámen“, ale v komnatě žádný kámen není a v III-1 je jednodušší Průchod. Drobnost.
- **III-1 Obraceč:** objev před výkladem funguje, hráč runy zkouší a lampa hned reaguje, ¬¬A = A přijde ve správnou chvíli (echo.step 1). Runa Průchod se objeví bez představení (jméno je jen v nápovědě 2) a zadání mluví o jednom prázdném kameni, i když třetí obvod má dva.
- **III-2 Pouto:** rytmus zkoumání, deska, kvíz drží. `qTableRows` hezky navazuje na 2ⁿ z I-3, jen nápověda mluví o abstraktním „n“ (D-III-17).
- **III-3 Rozcestí:** totéž. Inkluzivní „nebo“ (kino i divadlo) je vysvětlené výslovně, to je proti běžné mylné představě důležité. Kvíz o řádcích, kde se Pouto a Rozcestí liší, je dobrý.
- **III-4 Jen jeden:** vazba na sčítání (1 + 1 = 10, dole stín) je nejsilnější přenos patra. První kvízová otázka má ale dvě nevěrohodné možnosti (D-III-14).
- **III-5 Které pravidlo?:** hláška po špatné runě jmenuje řádek, ve kterém by runa svítila jinak, to je vzorná zpětná vazba, jen se špatným rodem (D-III-04). Vyplňování desky je tu opisování z lampy (D-III-06) a zadání není pokyn (D-III-21).
- **III-6 Řetězy:** řetězy NAND, NOR a Rovnost s pojmenováním fungují. Komnata ale nese tři nové nápady (D-III-09), losované větvení může chtít dva Obraceče, tedy De Morgana (D-III-02), zkoumání větvení dostává nápovědy pro kameny (D-III-03) a Echo píše „postav sám“ (D-III-12).
- **III-7 Brána Zahrady:** deska se závojem nutí skládat výsledek z run, dobrá syntéza. Nápověda 2 u Kamenů neplatí pro větvení (D-III-02). Zkratka Zkusit bránu hned sem pustí hráče, který Výluku, NAND, NOR ani větvení nikdy neviděl (D-III-01).
- **III-8 Zrcadla:** nejlépe postavená komnata patra: dvě desky vyjdou stejně a Echo řekne „Zrcadlo!“, pak hráč postaví druhé zrcadlo sám. Kvízy (¬(A ∨ B), „neprší a nefouká“) mají věrohodné distraktory.
- **III-9 Rovnost a důsledek:** kvíz „Kdy neplatí ‚Když prší, je mokro‘?“ míří přesně na typickou chybu. Žebříček nápověd je ale obrácený (D-III-13), poznávání runy jde hned po vyplnění téže desky (D-III-06) a „Desku znám“ dovolí implikaci vůbec nezkoumat (D-III-16).
- **III-10 Hlas většiny:** tři vstupy, osm kombinací, obě duální řešení se přijímají (ověřeno skriptem). Echo píše „Postavíš ho“ (D-III-05) a nápověda 2 radí něco, co platí samo (D-III-22).
- **III-11 Prapečeť:** silná myšlenka (jediná runa stačí na všechno). Třetí obvod (Rozcestí, 6 točitých kamenů) nemá strategickou nápovědu a ukázka kroku točitého kamene neřekne kam ani proč (D-III-08). Pointu prozradil Kodex Řetězů už v III-6 (D-III-15).
- **III-12 Masky:** tři slovesa (vybírá, rozsvěcí, přepíná) jsou jasná a ukázka kroku vysvětlí každý krystal. Kvíz 1 má dobré distraktory, vysvětlení kvízu 2 odkazuje na nepovinnou II-13 (D-III-23).
- **III-13 Tajná řeč:** ECHO písmeno po písmenu a útok známým textem jsou nejsilnější chvíle Hlubších síní. Ponaučení „klíč se nepoužívá dvakrát“ ale hráč nezažije a Kodex tvrdí o neprolomitelné šifře víc, než platí (D-III-10).
- **III-14 Méně je víc:** obraz starý obvod, šipka, jeden kámen je pěkný, jenže deska starého obvodu je vpravo hotová, takže jde o poznávání runy, ne o zjednodušování (D-III-07). Echo počítá runy špatně (D-III-11).
- **III-15 Velká brána Zahrady:** dobrá syntéza (závoj ze sedmi run, Prapečeť, maska). Nápověda 2 Závoje pokrývá jen první runu, ukázka kroku točitých kamenů je bez důvodu (D-III-08) a je tu shoda „Rozcestí jsou“ (D-III-20).

## Nálezy

### D-III-01 · III-7 (patro III) · didaktika · vysoká · jistá
**Zkusit bránu hned přeskočí nové pojmy, ne procvičování**
Popis: Kdo má III-1 až III-3 s pečetí přesnosti i odvahy, tomu se otevře III-7 a po ní celé patro IV. V patře III ale komnaty 4 až 6 nejsou procvičování, zavádějí nové pojmy: Výluku (III-4), poznávání runy podle desky (III-5), NAND, NOR, Rovnost a větvení (III-6). Brána je přímo zkouší: Závoj losuje ze `['and','or','xor','nand','nor']`, Kameny losují řetěz s Výlukou a větvení, Deska losuje řetěz s Výlukou. Kodex Výluky, Desky a Řetězů zůstane nepřeložený. Patro IV pak na tyto komnaty výslovně navazuje („Rovnost z Řetězů“, poloviční sčítačka z Výluky). Hráč tak nové runy potká poprvé ve zkoušce, nebo vůbec ne.
Doklad: src/game/progress.svelte.ts:154–169 (FAST_ROOMS = 3), :185; src/ui/screens/MapScreen.svelte:174, :195 („Zkus bránu hned, zbytek můžeš dohrát později.“); src/content/generators3.ts:100–117; src/content/act4.ts:129–134, :291, :298 („V Řetězech to byla Výluka a za ní Obraceč“).
Návrh: v patře III zkratku vypnout, nebo ji podmínit i komnatami III-4 a III-6 (nové runy), případně ji otevřít až po III-4 až III-6 bez nároku na pečetě. Kdyby zůstala, aspoň na mapě říct, že komnaty 4 až 6 přinesou nové runy, které brána chce.

### D-III-02 · III-6, III-7 · chyba · střední · jistá
**Losované větvení může chtít dva Obraceče (De Morgana dřív než III-8), nápovědy tomu neodpovídají**
Popis: `randomBranch` losuje i dvojici `['not','not']`. Pak cílem je NAND (1110) nebo NOR (1000) a skript ukazuje, že jediné řešení je obrátit oba vstupy, tedy De Morgan, kterého učí až nepovinná III-8 (a tam ho podává jako překvapení „Zrcadlo!“). PLAN.md:367 přitom chce „větvení s Obracečem na jednom vstupu“ a nápověda III-6 říká „Ve větvení můžeš Obracečem otočit jeden vstup.“ Nápověda 2 v III-7 Kamenech („…a za ni dej Obraceč“) se na větvení nedá použít vůbec: za spojovací runou žádný kámen není. Hráč, který se drží nápovědy, se zasekne v každém třetím losu.
Doklad: src/content/generators3.ts:53–60, :81, :105; act3.ts:372, :464; PLAN.md:367. Skript (600 losů): III-6 větvení s cílem 1000 (104×) a 1110 (89×), řešení jen `{"na":"not","nb":"not",…}`; III-7 Kameny úloha 2 totéž (108× a 86×).
Návrh: na základní cestě losovat jen větvení s jedním Obracečem (čtyři varianty), dvojí obrácení nechat pro III-8 a dál. Nápovědu 2 v III-7 rozdělit pro řetěz a pro větvení („Ve větvení obrať vstup, který má mlčet, když lampa svítí.“).

### D-III-03 · III-6 · chyba · střední · jistá
**Zkoumání větvení dostává nápovědy pro osazování kamenů**
Popis: Čtvrtá úloha III-6 je zkoumání („Tohle je větvení… Vyzkoušej všechny čtyři kombinace“). Nápovědy jsou ale společné pro celou komnatu: 1 „Začni od lampy…“, 2 „Najdi runu, která dá desku přesně obráceně…“, 3 `SLOT_HINT` „Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.“ Při zkoumání ukázka kroku zvýrazní vstup, ne kámen (`hint` vrací `{input}`) a `stepHint` vrací null, takže Echo přečte právě tu větu o kameni. Text tedy ukazuje na něco jiného, než co svítí, a kameny se při zkoumání osazovat nedají.
Doklad: act3.ts:25, :354–358, :370–374; src/core/puzzles/gate.ts:253–259; src/game/gateGame.svelte.ts:72; src/ui/screens/Level.svelte:447–449.
Návrh: pro úlohy `explore` brát nápovědy zkoumání (`EXPLORE_HINTS`, act3.ts:26–30), nebo dovolit nápovědy po úlohách (pole `hints` v `GateTask`).

### D-III-04 · III-5, III-7, III-9, III-15 · text · střední · jistá
**Hláška po špatné runě neodpovídá rodu runy**
Popis: Po špatné volbě pod závojem hra skládá „<jméno runy> by v řádku … svítila/mlčela“. Tvar je vždy ženský, ale Pouto, Rozcestí, Zlomené pouto a Zavřené rozcestí jsou střední rod a Důsledek mužský. Chybný tvar tak vyjde u pěti ze sedmi run, a to v komnatě, kde hráč chybuje nejčastěji.
Doklad: src/ui/screens/level/gateEvents.ts:107. Skript: „Pouto by v řádku A stín, B stín mlčela.“, „Zlomené pouto by v řádku A světlo, B stín svítila.“, „Důsledek by v řádku A stín, B světlo svítila.“
Návrh: „Runa ${RUNE_NAME} by v řádku … svítila/mlčela.“ (shoda se slovem runa), nebo rod do `runes.ts`.

### D-III-05 · III-10 · text · střední · jistá
**„Postavíš ho“ v replice Echa**
Popis: Po vyřešení Hlasu většiny Echo řekne „Postavíš ho z Pout a Rozcestí, nebo z Rozcestí a Pout.“ Přesně tenhle obrat pravidla pro texty zakazují jako dvojsmysl.
Doklad: act3.ts:656.
Návrh: „Hlas většiny jde složit z Pout a Rozcestí, nebo z Rozcestí a Pout.“

### D-III-06 · III-5, III-9 · didaktika · střední · jistá
**Deska se vyplňuje opisem z lampy až do brány, pak opora zmizí naráz**
Popis: Zadání III-5 slibuje „podle runy jde desku zase vyplnit“, tedy použít zákon. Při vyplňování ale runa i lampa svítí (bez `veilLamp`), hráč vybere řádek a přepíše, co lampa ukazuje. Totéž ve dvou vyplňováních v III-9, kde navíc poznávání runy pod závojem přijde hned po vyplnění téže desky (Důsledek vyplnit, Důsledek poznat), takže se nic nevybavuje. Bez lampy hráč poprvé píše desku až ve zkoušce III-7, opora se tedy neodebírá postupně, ale skokem v bráně. V III-5 se navíc každá runa pod závojem losuje právě jednou, třetí jde uhodnout vylučováním (všiml si toho už playtest).
Doklad: act3.ts:320–327 (bez `veilLamp`), :616–623; src/ui/gate/Desk.svelte:78–89 (`lampVeiled={fill && !!level.presentation.veilLamp && game.playing}`); generators3.ts:63–69.
Návrh: v III-5 dát `veilLamp: true` (runa je vidět, lampa ne: deska se opravdu píše podle runy). V III-9 vyplňovat se závojem lampy, nebo poznávání přeházet (poznat Rovnost po vyplnění Důsledku). V `genIII5` losovat třetí desku nezávisle.

### D-III-07 · III-14 · didaktika · střední · jistá
**Méně je víc jde vyřešit bez zjednodušování**
Popis: Cílová deska „Brána žádá“ je deska starého obvodu a je vidět hotová. Starý obvod je jen obrázek (bez krystalů, bez světla). Hráč tak jen najde runu k hotové desce, což je stejná dovednost jako Závoj v III-5 a III-7. Pravidla, o kterých mluví Kodex (¬¬A = A, De Morgan) a nápověda 2 („Pomůžou zrcadla“), nejsou potřeba. Komnata zjednodušování ukazuje, ale nezkouší.
Doklad: src/ui/gate/Gate.svelte:49–53 (`staticInputs`, `canToggle={false}`) a :95–108 (deska cíle); generators3.ts:216–223 (`target: tableFrom(form.circuit)`); act3.ts:848–849; kodex.ts:476.
Návrh: desku cíle zahalit, dokud hráč nezkusí první Zkoušku (výsledek si odvodí z obvodu, nebo zrcadly), nebo dovolit přepínat vstupy starého obvodu a desku cíle neukazovat.

### D-III-08 · III-11, III-15 · didaktika · střední · jistá
**Prapečeť: Rozcestí bez nápovědy, ukázka kroku bez důvodu, nový ovládací prvek jen v nápovědě**
Popis: (1) Nápověda 2 v III-11 vysvětlí Obraceč a Pouto z NAND, ale ke třetímu obvodu (Rozcestí, šest točitých kamenů, čtyři řešení) nic. (2) Ukázka kroku u točitého kamene nemá text: `stepHint` umí jen kámen s runou, takže zazní obecná věta „Zvýrazněný točitý kámen je potřeba pootočit.“ Neřekne, na který zdroj ani proč, hráč točí, dokud zvýraznění nepřeskočí, a to je odklikání. (3) Co jsou točité kameny, vysvětluje až nápověda 1, Echo v úvodu ne (playtest: Ema je najde až po nápovědě 1).
Doklad: act3.ts:710–716, :906–909; src/game/gateGame.svelte.ts:73–76; src/core/puzzles/gate.ts:276–277; skript: III-11 Rozcestí má 4 řešení, nápověda z prázdného stavu `{"socket":"n1:0","source":"A"}`.
Návrh: do nápovědy 2 přidat „Rozcestí je Zlomené pouto obrácených vstupů (vzpomeň na Zrcadla).“ Do ukázky kroku točitého kamene větu se zdrojem a důvodem („Natoč na A: obě světla z A udělají ze Zlomeného pouta Obraceč.“). Do úvodu Echa jednu větu o točitých kamenech.

### D-III-09 · III-6 · didaktika · střední · pravděpodobná
**Řetězy nesou tři nové nápady najednou**
Popis: Jinde na základní cestě je jedna nová věc na komnatu. III-6 v pěti úlohách zavádí řetězení (runa a za ní Obraceč, jména Zlomené pouto a Zavřené rozcestí), Rovnost a větvení se dvěma cestami. Ve spojení s D-III-02 do toho občas spadne i De Morgan. Playtest tu měl dříve vrchol frustrace. Zkoumání větvení ho zmírnilo, ale stavba větvení zůstává poslední, nejtěžší úlohou komnaty.
Doklad: act3.ts:348–360, :376–386; PLAYTEST.md (tabulka Nikoly, III-6).
Návrh: v III-6 nechat větvení jen jako zkoumání a jednu stavbu s jedním Obracečem (viz D-III-02). Stavbu dalších větví nechat bráně, nebo ji přesunout do III-8.

### D-III-10 · III-13 · didaktika · střední · pravděpodobná
**Tajná řeč: neúplné tvrzení o neprolomitelné šifře a nezažitá pointa**
Popis: Kodex píše „Kdo použije náhodný klíč jen jednou, má šifru, kterou nejde prolomit.“ Chybí podmínka, že každé písmeno (bajt) musí mít vlastní náhodný klíč. V komnatě přitom měla druhá zpráva náhodný klíč použitý pro jedinou zprávu a hráč ho z jednoho písmene prolomil. Žák si snadno odnese „nový bajtový klíč na zprávu = bezpečné“. Echo na konci řekne „Proto se dobrý klíč nepoužívá dvakrát“, ale poslední úloha má jen písmeno E, takže hráč nevidí, že nalezený klíč odemkne zbytek zprávy. Ponaučení je jen řečené.
Doklad: kodex.ts:467; act3.ts:819; generators3.ts:307–312.
Návrh: Kodex: „Kdo pro každé písmeno použije nový náhodný klíč a žádný nepoužije znovu, má šifru, kterou nejde prolomit.“ Po nalezení klíče nechat zbytek druhé zprávy rozšifrovat stejným mechanismem jako ECHO (`carry`).

### D-III-11 · III-14 · chyba · nízká · jistá
**Echo říká „Tři runy“, i když jich starý obvod má jiný počet**
Popis: Po první úloze Echo řekne „Tři runy, a přitom stačila jediná.“ `genIII14` ale pořadí starých obvodů losuje. Popisek nad obvodem přitom ukazuje skutečný počet („Obvod Lumenitů · 4 runy“).
Doklad: act3.ts:854; generators3.ts:226–228; Gate.svelte:51. Skript (1000 losů): první obvod má 4 runy v 506 případech, 3 runy v 342, 2 runy v 152, „Tři“ tedy nesedí ve dvou třetinách průchodů.
Návrh: „Několik run, a přitom stačila jediná.“, nebo počet doplnit z úlohy.

### D-III-12 · III-6 · text · nízká · jistá
**„Teď větvení postav sám.“**
Popis: Oslovení hráče v mužském rodě, pravidla chtějí neutrální tvar.
Doklad: act3.ts:381.
Návrh: „Teď větvení postavíš ty.“

### D-III-13 · III-9 · didaktika · nízká · jistá
**Obrácený žebříček nápověd v části Desky**
Popis: Nápověda 1 (náznak) dá rovnou oba zákony („Rovnost svítí, když se vstupy shodují. Důsledek mlčí jen v řádku 1 0.“), nápověda 2 (strategie) jen příklad o dešti. První stupeň tedy prozradí víc než druhý.
Doklad: act3.ts:624–628.
Návrh: prohodit: 1 „Když prší, je mokro: kdy by tenhle slib neplatil?“, 2 zákony obou run.

### D-III-14 · III-4, III-6, III-11, III-13, III-14 · didaktika · nízká · jistá
**Pojmové kvízy s nevěrohodnými distraktory, bez vysvětlení typické chyby**
Popis: Část pevných otázek se dá projít vylučováním, protože zbylé možnosti jsou mimo hru: III-4 („svítí jasněji“, „jednou svítí, jednou mlčí“), III-6 („svítí jen napůl“, „nedá se to poznat“), III-11 („svítí vždycky“, „má tři vstupy“, „nedá se obrátit“), III-13 („dvakrát silnější šifru“), III-14 („svítí jasněji“, „mají delší desku“, „jinak nefungují“). Otázka v III-14 navíc zkouší rychlost a cenu čipu, které hra nikde neukazuje (informace přijde až v nápovědě). Žádná pevná otázka patra nemá `why`, ani III-9 u typické chyby „neprší a je mokro“.
Doklad: act3.ts:290, :391, :733, :826, :863–865, :633.
Návrh: distraktory z mylných představ (III-6: „svítí, Zlomené pouto chce dvě světla“; III-11: „dá se z něj postavit jen Obraceč a Pouto“). U III-9 přidat `why` k „neprší a je mokro“: „Když neprší, slib nic neříká. Porušit ho jde, jen když prší a mokro není.“

### D-III-15 · III-6 → III-11 · didaktika · nízká · jistá
**Kodex Řetězů prozradí pointu Prapečeti**
Popis: Záznam Řetězů se odemkne v III-6 a píše „Z hradel NAND se dá postavit úplně všechno, i celý procesor.“ Objev, na kterém stojí III-11 („Lumenité tvrdili, že z jediné runy postaví všechny ostatní. … Zkus to.“), tak hráč čte o pět komnat dřív. Totéž tvrzení opakuje i Kodex Prapečeti.
Doklad: kodex.ts:390, :445; act3.ts:716.
Návrh: v Řetězech napsat jen „Skládáním hradel vznikají nové funkce. Kolik jich jde postavit z jediného druhu? To ukáže Prapečeť.“

### D-III-16 · III-9 · didaktika · nízká · pravděpodobná
**„Desku znám“ dovolí přeskočit zkoumání Důsledku**
Popis: Tlačítko se ukáže u každé části se zkoumáním, za kterou je deska, tedy i u Důsledku v III-9. Komentář i PLAYTEST ho myslí pro III-2 až III-4 (známé runy). Implikace je nová a protiintuitivní (typická chyba „neprší a je mokro“). Kdo ji přeskočí, píše desku zpaměti bez zkušenosti a nová runa se mu nezakotví v zážitku.
Doklad: src/ui/screens/Level.svelte:297–309; act3.ts:602–610; PLAYTEST.md:771.
Návrh: omezit `canKnow` na runy, které hráč už zná (III-2 až III-4), nebo na komnaty se záznamem Kodexu přeloženým dřív.

### D-III-17 · III-2, III-5 · text · nízká · jistá
**Nápověda s abstraktním n a nepřesný důvod u distraktoru**
Popis: `qTableRows` se ptá na konkrétní počet vstupů (3 až 5), ale nápověda říká „Kolik kombinací má n krystalů?“. Pro žáka s matematickou úzkostí je písmeno místo čísla zbytečná překážka. V `qTableLit` vysvětlení u Pouta zní „V polovině řádků svítí jeden vstup.“ Míněno je „každý vstup svítí v polovině řádků“. Doslova to neplatí (právě jeden vstup svítí pro 3 vstupy ve 3 řádcích, ne ve 4).
Doklad: src/content/quizzes.ts:607, :576.
Návrh: nápovědu skládat s číslem („Kolik kombinací mají 3 krystaly?“), důvod přepsat na „Každý vstup svítí v polovině řádků. Pouto chce všechny naráz.“

### D-III-18 · celé patro (Brána) · text · nízká · jistá
**„v 1 řádku desky. Přepni vstupy podle nich“**
Popis: Hláška po neúspěšné Zkoušce má zájmeno vždy v množném čísle. Při jednom chybném řádku vyjde „Lampa nesvítí správně v 1 řádku desky. Přepni vstupy podle nich…“.
Doklad: src/ui/screens/level/gateEvents.ts:53.
Návrh: „podle něj“ / „podle nich“ podle k, nebo „Přepni vstupy na ten řádek“.

### D-III-19 · III-9 (Kodex) · text · nízká · jistá
**„Když neprší, nic neporušila“**
Popis: Věta v Kodexu nemá jasný podmět („implikace nic neporušila“) a nedává smysl. Kvíz téže komnaty to říká správně („slib nikdo neporušil“).
Doklad: kodex.ts:423; act3.ts:636.
Návrh: „Když neprší, implikace platí, ať je mokro, nebo ne.“

### D-III-20 · III-1, III-9, III-15 · text · nízká · jistá
**Drobné nejednotnosti v textu**
Popis: (1) III-15 nápověda 2: „Pouto je Zlomené pouto a Obraceč, Rozcestí jsou Zlomené pouto obrácených vstupů“, správně „Rozcestí je“. (2) Název III-9 „Rovnost a důsledek“ má malé d, i když runa je všude „Důsledek“ a Kodex píše „Rovnost a Důsledek“. (3) Zadání III-1 „Vlož do prázdného kamene runu“ platí i pro třetí obvod se dvěma prázdnými kameny.
Doklad: act3.ts:908; act3.ts:585, kodex.ts:417, runes.ts:13; act3.ts:89–91, :100.
Návrh: „Rozcestí je“; „Rovnost a Důsledek“; „Vlož do prázdných kamenů runy…“.

### D-III-21 · III-5 · přístupnost · nízká · jistá
**Zadání III-5 není pokyn**
Popis: „Deska zákona prozradí runu pod závojem. A podle runy jde desku zase vyplnit.“ jsou dvě oznamovací věty. Slabší čtenář z nich nepozná, co má dělat, zvlášť když se poznávání a vyplňování střídají.
Doklad: act3.ts:322.
Návrh: „Poznej podle desky runu pod závojem. Kde runu vidíš, vyplň podle ní desku.“

### D-III-22 · III-6, III-10 · didaktika · nízká · jistá
**Nápovědy, které neradí**
Popis: III-10 nápověda 2 „Měň pokaždé jediný vstup“: každý dotek mění právě jeden vstup, takže rada platí sama. Ideálu brání návrat ke kombinaci, kterou už hráč má, o tom nápověda mlčí. III-6 nápověda 1 „má svítit, nebo mlčet, když svítí oba vstupy?“ nerozliší Zlomené pouto od Zavřeného rozcestí (obě v řádku 1 1 mlčí).
Doklad: act3.ts:668; act3.ts:371.
Návrh: III-10: „Nevracej se ke kombinaci, kterou už máš.“ III-6: „Ve kterých řádcích má lampa mlčet? Která runa mlčí přesně v opačných řádcích?“

### D-III-23 · III-10, III-12 · didaktika · nízká · jistá
**Odkazy na nepovinné nebo nezavedené věci**
Popis: Vysvětlení kvízu III-12 „stejně jako páka převrať u doplňku“ míří na II-13, nepovinnou Hlubší síň patra II. Kodex Hlasu většiny píše vzorec „AB ∨ AC ∨ BC“ se zápisem součinu bez ∧, který hra nikde nezavedla (o řádek výš stojí správně „(A ∧ B) ∨ …“).
Doklad: act3.ts:789; kodex.ts:432–433.
Návrh: „stejně jako Obraceč, jen na celou oktávu“; vzorec „(A ∧ B) ∨ (A ∧ C) ∨ (B ∧ C)“.

## Patro jako celek
Zahrada Bran je didakticky nejčistší patro, které jsem viděl: světelná metafora drží (runa jen pouští, nebo nepouští světlo), postup zkoumání, deska, poznání, skládání je logický a zpětná vazba jmenuje konkrétní řádek, ve kterém by zvolená runa svítila jinak, ne jen „špatně“. Pro žáka s matematickou úzkostí je patro přívětivé: skoro žádná aritmetika, krátké repliky, vazby na češtinu (kino, nebo divadlo; neprší a nefouká). Přenos funguje oběma směry: Výluka jako spodní číslice součtu, Hlas většiny jako přenos sčítačky, masky jako práce s bajtem.
Slabiny jsou ve stavbě opor, ne v obsahu. Nejvážnější je zkratka do brány, která v tomto patře přeskočí tři komnaty s novými runami. Druhá je III-6: tři nápady v jedné komnatě a k tomu losované větvení, které chce De Morgana dřív, než ho III-8 objeví, s nápovědou, která radí obrátit jen jeden vstup. Třetí je odebírání opory: desku hráč opisuje z lampy i v III-5 a poprvé bez ní píše až ve zkoušce. Hlubší síně jsou silné (Zrcadla, Důsledek, Tajná řeč), ale III-14 je poznávání runy v převleku a III-11 nechává nejtěžší obvod bez strategické nápovědy a ukázku kroku bez důvodu, takže svádí k odklikání. Opravit je potřeba i tři textové chyby: „Postavíš ho“, „postav sám“ a špatný rod v hlášce po špatné runě, kterou hráč vidí nejčastěji.

## Co funguje
- Objev před výkladem v III-1 až III-4: hráč runu zkouší dřív, než ji hra pojmenuje, a deska zapisuje, co viděl.
- Hláška po špatné runě i po špatné desce jmenuje přesný řádek, ve kterém se hráč mýlí.
- Ukázka kroku u desky a masky vysvětluje důvod runu po runě („Obraceč dá světlo, Pouto dá stín. Lampa mlčí.“, „Pouto zhasne, kde maska mlčí.“).
- Závoj lampy v III-7 a III-8: výsledek se skládá z run, ne opisuje.
- III-8 Zrcadla: dvě desky vyjdou stejně a teprve pak padne jméno De Morgan.
- Kvíz s Důsledkem a typickou chybou „neprší a je mokro“; inkluzivní „nebo“ vysvětlené výslovně.
- III-4 a kvíz o spodní číslici: nejlepší most mezi Síní Počtářů a Zahradou.
- III-10 přijímá obě duální řešení (Pouta a Rozcestí i Rozcestí a Pouta), skript to potvrdil.
- III-13: ECHO roste písmeno po písmenu, útok známým textem je opravdový objev.
- Generátory: všechny losované obvody v III-6, III-7, III-11 a III-14 mají řešení a v řetězech je řešení jediné (ověřeno skriptem na 600 losech).
- Strážce schodů: krátký, přeskočitelný, s vysvětlením typické chyby u každé losované otázky.
