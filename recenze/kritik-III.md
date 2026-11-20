# Herní kritik · patro III

Prošel jsem schody, III-0 až III-15 v pořadí, jak je hráč potká: definice v `src/content/act3.ts`, generátory `src/content/generators3.ts`, jádro `src/core/puzzles/gate.ts`, `table.ts`, `mask.ts`, obaly `src/game/gateGame.svelte.ts`, `tableGame.svelte.ts`, `maskGame.svelte.ts`, hlášky `src/ui/screens/level/gateEvents.ts`, `maskEvents.ts`, `src/game/stepWords.ts` a plochu `src/ui/gate/Gate.svelte`, `Board.svelte`, `Desk.svelte`, `Mask.svelte`, `src/ui/screens/Level.svelte`. Úlohy jsem hrál skripty `sim/kritik-III/hra.test.ts` a `hra2.test.ts` (vypsané výstupy cituju u nálezů). Věci vyřešené podle PLAYTEST.md kap. 9 a 10 neopakuju.

## Komnaty
- **Strážce schodů (před III):** Tři rychlé otázky (sčítání čtveřic, posun vlevo, čtení nápisu) jsou dobré opakování a dají se přeskočit. Karta ale slibuje otázky „z minulého patra (Síň Počtářů)“, a čtení nápisu je z Předsíně (H-III-20).
- **III-0 Cesta světla:** Jeden dotek, lampa se rozsvítí a po 2,4 s přijde vítězná deska. Na naladění to stačí. Nečitelné „Obraceč“ v Echově úvodu je dobrý háček na příběh. Celá vítězná deska za jediný klik působí trochu naprázdno.
- **III-1 Obraceč:** Dobrá gradace: jeden kámen, pak dvojí obrácení (Echo „Dva Obraceče za sebou se navzájem zruší.“ přijde přesně ve chvíli, kdy to hráč vidí), pak dva prázdné kameny. Zadání mluví o jednom „prázdném kameni“, třetí úloha má ale dva.
- **III-2 Pouto:** Rytmus zkoumání, deska a kvíz funguje a „Desku znám“ pustí zkušené rovnou k desce. Kdo ale projde kombinace v pořadí z nápovědy 2, přijde o pečeť přesnosti (H-III-16).
- **III-3 Rozcestí:** Stejný formát podruhé. Kvíz „Ve kterých řádcích se liší Pouto a Rozcestí?“ pěkně spojí dvě runy.
- **III-4 Jen jeden:** Potřetí stejný formát, zato s nejlepším propojením patra: odkaz na 1 + 1 ze Síně Počtářů a na poloviční sčítačku. Opakování formátu řeší tlačítko „Desku znám“ (podle playtestu), dál ho neřeším.
- **III-5 Které pravidlo?:** Poznávání runy podle desky je čisté a rychlé. Zadání je oznamovací věta, ne pokyn („Deska zákona prozradí runu…“), co dělat, ukáže až tlačítko. Obě vyplňované desky jdou opsat z lampy (H-III-10).
- **III-6 Řetězy:** První opravdová hádanka patra. Zkoumání hotového větvení před jeho stavbou je dobrý mezikrok a Rovnost dostane jméno. Během zkoumání ale nápovědy mluví o osazování kamenů (H-III-05), Echo říká „postav sám“ (H-III-07) a nápověda 2 nepočítá s oběma Obraceči (H-III-13).
- **III-7 Brána Zahrady:** Dobrá syntéza: deska se zahalenou lampou, kameny a závoj, po ukázce kroku přibude zkouška navíc. Hráč, kterému mapa nabídne „Zkus bránu hned“, sem ale přijde bez Výluky, Zlomeného pouta, Zavřeného rozcestí a větvení (H-III-01).
- **III-8 Zrcadla:** Nejlepší aha patra. Dvě desky vyjdou stejně („Zrcadlo!“ se díky `readOn` dá dočíst) a pak hráč postaví Zavřené rozcestí bez Rozcestí. Deska je pod závojem, takže se vyplnit musí opravdu z run.
- **III-9 Rovnost a důsledek:** Kvíz s typickou chybou „neprší a je mokro“ je výborný. Ze čtyř úloh na desce jdou ale dvě vyplňované opsat z lampy (H-III-10). Název píše „důsledek“ malým písmenem, runa a Kodex velkým (H-III-24). „Desku znám“ se objeví jen u Důsledku (H-III-25).
- **III-10 Hlas většiny:** Osm kombinací za sedm doteků a pět kamenů, které jdou rozumem. Že funguje i duální zapojení, je skryté aha, jenže Echo ho podá větou „Postavíš ho…“ (H-III-08). Na telefonu je deska širší než displej (H-III-11).
- **III-11 Prapečeť:** Silný nápad a točité kameny už pulzují. Čtečka ale hlásí lampu pořád jako zhasnutou (H-III-03), Zkouška s nenastaveným točitým kamenem mluví o prázdném kameni bez runy (H-III-04) a ukázka kroku neřekne, kam kámen natočit (H-III-14).
- **III-12 Masky:** Praktické a pestré: dvakrát vybrat, rozsvítit a přepnout, ideál počítá i s maskou ze zadání. Úloha se posune sama, jakmile výsledek sedí (u „pravé čtveřice“ v 134 ze 400 losů dřív, než hráč rozsvítí celou čtveřici). Je to rychlé, jen to trochu překvapí. Převrácení celé oktávy je osm stejných doteků. Poslední replika Echa zapadne (H-III-17).
- **III-13 Tajná řeč:** Emoční vrchol patra. Slovo ECHO roste písmeno po písmenu a čtyři automatická rozšifrování po 1,1 s jsou dobré tempo, ne čekání. Na konci útok známým textem. Nápověda „Klíč je napsaný vpravo“ na telefonu neplatí (H-III-12).
- **III-14 Méně je víc:** Starý obvod, šipka a jediný kámen: zjednodušení je vidět. Echo po první úloze tvrdí „Tři runy“, a ve dvou třetinách losů to nesedí s nadpisem nad obvodem (H-III-02). Kámen se šesti runami jde proklikávat jen dopředu (H-III-22).
- **III-15 Velká brána Zahrady:** Závoj se sedmi runami, Prapečeť a maska jsou slušná syntéza. Prapečeť ale v polovině losů padne na nejlehčí úlohu z III-11 (H-III-15). Hlas většiny, šifra ani zjednodušení se v bráně nevrátí. V nápovědě je chyba ve shodě (H-III-09).

## Nálezy

### H-III-01 · III-7 · chyba · vysoká · jistá
**Zkusit bránu hned přeskočí v Zahradě zavedení tří run a větvení**
Popis: Kdo má III-1 až III-3 s pečetí přesnosti i odvahy, tomu mapa otevře III-7 se slovy „zbytek můžeš dohrát později“. V jiných patrech jsou komnaty 4 až 6 hlavně procvičování. V Zahradě ale teprve zavádějí nové věci: Výluku (III-4), poznávání runy pod závojem (III-5), Zlomené pouto, Zavřené rozcestí a větvení (III-6). Brána přesně tyhle věci zkouší: kameny nabízejí Výluku a losují větvení, závoj losuje dvě runy z pěti včetně Výluky, Zlomeného pouta a Zavřeného rozcestí. Hráč je potká poprvé ve zkoušce a záznamy Kodexu Výluka, Deska zákona a Zlomené pouto mu chybí. Brána přitom v úvodu říká: „Projde jen ten, kdo runy zná a umí je skládat.“ Kdo bránou projde, má otevřenou Hlubinu, která na Výluce a Zlomeném poutu staví (poloviční sčítačka).
Doklad: `src/game/progress.svelte.ts:154` (FAST_ROOMS = 3), `:161–169`, `:185`; `src/ui/screens/MapScreen.svelte:174, 194`; `src/content/generators3.ts:12` (TWO = and, or, xor), `:100–117` (genIII7Gate, genIII7Identify: and, or, xor, nand, nor); `src/content/act3.ts:247–305` (Výluka až v III-4), `:345–405` (NAND, NOR a větvení až v III-6), `:411`.
Návrh: Rychlou bránu nastavit pro každé patro zvlášť (např. `ActDef.fastRooms`) a v Zahradě ji podmínit komnatami III-1 až III-6, případně ji tu vypnout. Jiná možnost: v Zahradě rychlou bránu nabízet, až má hráč záznamy Kodexu vyluka a retezy.

### H-III-02 · III-14 · chyba · střední · jistá
**Echo říká „Tři runy“, nadpis nad obvodem ukazuje jiný počet**
Popis: Po první úloze Echo řekne „Tři runy, a přitom stačila jediná.“ Generátor ale úlohy losuje ze šesti starých obvodů se 2, 3 nebo 4 runami. Nad obvodem přitom svítí správný počet („Obvod Lumenitů · 4 runy“), takže si hráč protimluvu všimne na jedné obrazovce.
Doklad: `src/content/act3.ts:854`; `src/content/generators3.ts:169–228` (genIII14 = shuffled(LONG_FORMS)); `src/ui/gate/Gate.svelte:51`. Skript, 600 losů, počet run v prvním obvodu: `{ '2': 95, '3': 201, '4': 304 }`. Echo tedy nemá pravdu v 399 z 600 vstupů.
Návrh: Replika bez čísla, třeba „Celý obvod, a přitom stačila jediná runa.“, nebo text skládat podle `reference.nodes.length`.

### H-III-03 · III-11, III-15 · přístupnost · vysoká · jistá
**Čtečka v Prapečeti hlásí lampu vždy jako zhasnutou**
Popis: Po přepnutí vstupu se lampa do hlášení počítá bez točitých kamenů. Runa se zdroji z točitých kamenů pak nedostane světlo a hlášení zní vždy „Lampa mlčí.“, i když na desce svítí. Hráč se čtečkou nemůže v III-11 ani ve druhé zkoušce III-15 ověřit, co obvod dělá. Do toho popis točitého kamene říká „bere světlo z 1“ místo „z runy 1“.
Doklad: `src/ui/screens/level/gateEvents.ts:26` (`evaluate(circuit, state.runes, state.inputs)` bez `state.wires`); `src/ui/gate/Board.svelte:191`. Skript (oba točité kameny na A, správný Obraceč): `III-11 řádek 0: lampa doopravdy=1, hlášení čtečky (bez wires)=mlčí`.
Návrh: Předat `state.wires` jako čtvrtý argument. V popisu točitého kamene psát „z runy 1“ (stejně jako hlášení `wire`, `gateEvents.ts:44`).

### H-III-04 · III-11, III-15 · chyba · střední · jistá
**Nenastavený točitý kámen hláška popíše jako prázdný kámen bez runy**
Popis: Zkouška s točitým kamenem, který ještě neukazuje zdroj, ohlásí „Některý kámen je prázdný. Bez runy jím světlo neprojde.“ V Prapečeti jsou ale všechny runy pevné a prázdný kámen tu není. Hráč hledá chybějící runu, a přitom má natočit kolečko.
Doklad: `src/core/puzzles/gate.ts:206` (empty zahrnuje i nenastavené sockets); `src/ui/screens/level/gateEvents.ts:51–53`. Skript: `III-11 Zkouška s jedním nenastaveným točitým kamenem -> [{"type":"wrong","failed":[0,1,2,3],"empty":true}]  prázdných kamenů na runy: 0`.
Návrh: Rozlišit příčinu: „Některý točitý kámen ještě neukazuje, odkud bere světlo. Klikni na něj.“

### H-III-05 · III-6 · chyba · střední · jistá
**Při zkoumání větvení mluví nápovědy o osazování kamenů**
Popis: Čtvrtá úloha III-6 je zkoumání hotového větvení. Nápovědy jsou ale společné pro celou komnatu a míří na stavbu. Nápověda 1 zní „Začni od lampy: má svítit, nebo mlčet, když svítí oba vstupy?“, nápověda 2 „Najdi runu… a za ni postav Obraceč.“ Ukázka kroku zvýrazní vstup, ale Echo řekne „Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.“: brána mimo osazování nemá vlastní text a Level vezme třetí nápovědu komnaty.
Doklad: `src/content/act3.ts:25, 354–358, 370–374`; `src/game/gateGame.svelte.ts:69–72` (stepHint je mimo slots null); `src/ui/screens/Level.svelte:449`. Skript: `III-6 krok 3 hint(): {"input":0} | text nápovědy 3: Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.`
Návrh: Dovolit úloze vlastní nápovědy (`GateTask.hints`), nebo v Level u úlohy `explore` brát EXPLORE_HINTS.

### H-III-06 · III-5, III-7, III-9, III-15 · text · střední · jistá
**Hláška po špatné runě má pevný ženský rod**
Popis: Po chybném výběru runy pod závojem hláška vždy píše „svítila/mlčela“, ať je runa jakéhokoli rodu. Správně to vyjde jen u Výluky a Rovnosti. Hráč to vidí v bublině Echa v každé komnatě se závojem.
Doklad: `src/ui/screens/level/gateEvents.ts:107`. Replikace skriptem: „Pouto by v řádku A stín, B světlo mlčela.“, „Rozcestí by v řádku A stín, B světlo svítila.“, „Zlomené pouto by … svítila.“, „Důsledek by v řádku A stín, B světlo svítila.“
Návrh: Věta s lampou jako podmětem, ta má vždy ženský rod: „S runou Pouto by lampa v řádku A stín, B světlo mlčela. Na desce je to jinak.“

### H-III-07 · III-6 · text · střední · jistá
**Echo říká hráči „postav sám“**
Popis: Replika po zkoumání větvení zní „Teď větvení postav sám.“ Porušuje pravidlo rodové neutrality, a přitom PLAYTEST kap. 6 uvádí „Echo už neříká ‚sám‘“. Tenhle výskyt zůstal.
Doklad: `src/content/act3.ts:381`.
Návrh: „Teď větvení postavíš ty.“

### H-III-08 · III-10 · text · střední · jistá
**„Postavíš ho…“ a nejasné „nebo z Rozcestí a Pout“**
Popis: Závěr komnaty říká „Postavíš ho z Pout a Rozcestí, nebo z Rozcestí a Pout.“ První část je přesně ta vazba, kterou pravidla zakazují („postav ho“). Druhá zní jako táž věc dvakrát, přitom nese skrytou pointu, že funguje i duální zapojení (Rozcestí u dvojic a Pouta za nimi). Teenager pointu nepozná a dvojsmysl si všimne.
Doklad: `src/content/act3.ts:656`; obě zapojení jsou řešením `majority(true)`, `src/content/generators3.ts:122–135`.
Návrh: „Hlas většiny jde složit z Pout a Rozcestí. Funguje to i naopak: Rozcestí u dvojic a za nimi Pouta.“

### H-III-09 · III-15 · text · nízká · jistá
**Chybná shoda v nápovědě Prapečeti**
Popis: „Rozcestí jsou Zlomené pouto obrácených vstupů.“ Rozcestí je tu jednotné číslo.
Doklad: `src/content/act3.ts:908`.
Návrh: „Rozcestí je Zlomené pouto obrácených vstupů.“

### H-III-10 · III-5, III-9 · hratelnost · střední · jistá
**Vyplňování desky v III-5 a III-9 je opisování z lampy**
Popis: V III-5 a v desce III-9 není lampa pod závojem: runa je vidět i se jménem, svítí a lampa ukazuje výsledek vybraného řádku. Desku jde vyplnit kliknutím na řádek a opsáním lampy, bez znalosti runy. Zadání III-5 přitom slibuje „A podle runy jde desku zase vyplnit“. V III-5 jsou takové dvě úlohy z pěti a ve 202 ze 600 losů jde dvakrát o tutéž runu. V III-9 jsou to dvě úlohy ze čtyř a obě runy hráč právě prozkoumal. Pro III-2 až III-4 je opisování v pořádku (zapisuje, co viděl), zahalená lampa v III-7 a III-8 už je. III-5 a III-9 zůstaly mezi tím.
Doklad: `src/content/act3.ts:321–327` a `:623` (bez `veilLamp`); `src/ui/gate/Desk.svelte:92`; `src/content/generators3.ts:65`; skript: `III-5 obě vyplňované desky stejná runa: 202 /600`.
Návrh: `veilLamp: true` pro III-5 a desku III-9 a u vyplňování v III-5 losovat dvě různé runy.

### H-III-11 · patro III (Board) · přístupnost · střední · pravděpodobná
**Na telefonu je lampa většiny obvodů mimo obrazovku**
Popis: Deska se nezmenší pod 72 % šířky a užší místo ji posune do strany (`overflow-x: auto`, zarovnání vlevo). Každý obvod s víc než jedním sloupcem run je tak na telefonu 360–390 px širší než místo. Krystaly vstupů zůstanou vlevo a lampa vpravo za okrajem, takže hráč přepíná vstupy a nevidí, co lampa udělá, dokud desku neposune. Týká se řetězů a větvení (III-6, III-7, III-8), III-1 úlohy 3, III-10, III-11 a starých obvodů v III-14. V prohlížeči jsem to neověřoval, je to výpočet z CSS.
Doklad: `src/ui/gate/Board.svelte:53–55, 119, 143`; `src/ui/gate/Gate.svelte:163–170`; `src/ui/gate/Desk.svelte:225–232`. Skript (šířka W, nejmenší šířka 0,72 W, místo při 16px okrajích): jedna runa `{"W":412,"min":297}` se vejde; řetěz a větvení `{"W":562,"min":405}`; III-1 úloha 3, III-10 a čtyřrunové obvody v III-14 `{"W":712,"min":513}`, nevejdou se ani na 390 px.
Návrh: Na úzkém displeji zmenšit rozteč sloupců (CW) místo celé desky, nebo povolit menší měřítko se schovanými jmény run. Případně v panelu „Brána žádá“ u živého řádku ukazovat i stav lampy, ať je výsledek vidět bez posouvání.

### H-III-12 · patro III · přístupnost · nízká · pravděpodobná
**„Brána vpravo“ a „obvod vlevo“ neplatí, když se panel zalomí**
Popis: Zadání a nápovědy ukazují směrem: „jak žádá brána vpravo“ (III-1, III-6, III-11), „Deska brány vpravo“ (III-14), „Klíč je napsaný vpravo“ (III-13), „obvod vlevo“ (III-7, poznámka na Desce). Panel s cílem je ale v řádku s deskou, který se zalamuje (deska 600 px + mezera + panel). Na telefonu a na tabletu na výšku je panel pod deskou. Oprava z playtestu („zadání v Zahradě ukazují na bránu vpravo“) počítá jen s počítačem.
Doklad: `src/content/act3.ts:100, 364, 431, 704, 808, 848`; `src/ui/gate/Desk.svelte:101`; `src/ui/gate/Gate.svelte:155–170`; `src/ui/gate/Mask.svelte:162–169`.
Návrh: Místo směru jmenovat panel: „podle panelu Brána žádá“, „Klíč je v panelu Klíč“.

### H-III-13 · III-6, III-7 · hratelnost · nízká · jistá
**Nápověda 2 nepočítá s losovaným větvením**
Popis: V III-6 nápověda 2 říká „Ve větvení můžeš Obracečem otočit jeden vstup.“, generátor ale v 193 ze 600 losů obrátí oba. Nápověda 2 v kamenech III-7 („…a za ni dej Obraceč“) o větvení mlčí, přitom jedna ze tří úloh je vždy větvení.
Doklad: `src/content/act3.ts:372, 464`; `src/content/generators3.ts:53–60, 105`; skript: `III-6 větvení s oběma Obraceči: 193 /600`.
Návrh: „Ve větvení můžeš Obracečem otočit jeden vstup, nebo oba.“ Totéž doplnit do III-7.

### H-III-14 · III-11 · hratelnost · nízká · jistá
**Ukázka kroku u točitých kamenů neřekne, kam natočit ani proč**
Popis: U run v kamenech ukázka kroku jmenuje runu a její zákon. U točitého kamene `stepHint` vrací null, takže Echo řekne jen „Zvýrazněný točitý kámen je potřeba pootočit.“, bez cílového zdroje i bez důvodu. Princip „ukázka kroku s důvodem“ (PLAYTEST 10.1) tu chybí. Nápověda 2 navíc pokrývá Obraceč a Pouto, ale ne třetí, nejtěžší úlohu (Rozcestí ze Zlomených pout). Ta je jen v nápovědě III-15.
Doklad: `src/game/gateGame.svelte.ts:73–76`; `src/content/act3.ts:711–713` a pro srovnání `:908`. Skript (Rozcestí, hráč pootočí zvýrazněný kámen jednou): zvýraznění přeskakuje mezi `n1:0 → n1:1 → n2:0 → n2:0 → …`, a kam se má kámen natočit, hra neřekne.
Návrh: Ukázka kroku pro točitý kámen, třeba „Zvýrazněný točitý kámen natoč na A: Zlomené pouto se dvěma A je Obraceč A.“ Nápovědu 2 doplnit o Rozcestí.

### H-III-15 · III-15 · hratelnost · nízká · jistá
**Velká brána losuje 50 : 50 nejlehčí, nebo nejtěžší Prapečeť**
Popis: Druhá zkouška velké brány je buď Pouto (pevné Zlomené pouto a dva točité kameny, přesně úloha 2 z III-11), nebo Rozcestí (tři runy a šest točitých kamenů). Polovina hráčů dostane ve velké bráně nejlehčí krok patra.
Doklad: `src/content/generators3.ts:138–166, 330–332`; skript: `{"3 run, točitých kamenů 6":198,"2 run, točitých kamenů 2":202}`.
Návrh: Ve velké bráně vždy Rozcestí, nebo Pouto ze dvou volných Zlomených pout (bez pevného prvního).

### H-III-16 · III-2, III-3, III-4, III-9 · hratelnost · nízká · jistá
**Pořadí kombinací v nápovědě stojí pečeť přesnosti**
Popis: Nápověda 2 při zkoumání vyjmenuje „oba stín, jen A, jen B, oba světlo“. Z „jen A“ do „jen B“ ale jedním dotekem přejít nejde. Kdo se pořadím řídí, udělá čtyři doteky místo tří a přijde o pečeť přesnosti („Bez jediného zbytečného kroku.“).
Doklad: `src/content/act3.ts:26–30`; `src/core/puzzles/gate.ts:213–215`; skript: `III-2 oba stín -> jen A -> (zpět) -> jen B -> oba: tahy 4 par 3`.
Návrh: Pořadí po jediné změně: „oba stín, jen A, oba světlo, jen B“, nebo připsat „Měň pokaždé jediný vstup.“

### H-III-17 · III-12 · chyba · nízká · jistá
**Replika „Výluka přepíná.“ se nikdy neukáže**
Popis: Echo má repliku pro krok 5, ten je ale poslední. Ve stejném okamžiku přijde `complete` a `sayComplete` ji přepíše větou „Šest masek, tři runy.“
Doklad: `src/content/act3.ts:771–772`; `src/ui/screens/level/maskEvents.ts:21–22, 36–37`; `src/ui/screens/level/context.ts:42–45`.
Návrh: Spojit do závěru: „Výluka přepíná. Šest masek, tři runy.“, nebo krok 5 smazat.

### H-III-18 · III-7 · text · nízká · pravděpodobná
**Zájmeno bez jasného předmětu v úvodu desky brány**
Popis: „Lampu jsem zahalil, dokud desku nepotvrdíš. Co z ní vyjde, slož z run.“ „Z ní“ se gramaticky váže k nejbližší desce, míněna je ale lampa nebo obvod.
Doklad: `src/content/act3.ts:444`.
Návrh: „Lampu jsem zahalil, dokud desku nepotvrdíš. Co k lampě doteče, slož z run.“

### H-III-19 · kvízy patra III · hratelnost · nízká · jistá
**Několik kvízů jde projít vyloučením nesmyslů**
Popis: Část špatných možností je zjevně absurdní a správná odpověď je jediná rozumná: „svítí jasněji“ (III-4), „svítí jen napůl“ a „nedá se to poznat“ (III-6), „svítí vždycky“ a „má tři vstupy“ (III-11), „dvakrát silnější šifru“ (III-13), „svítí jasněji“, „mají delší desku“ a „jinak nefungují“ (III-14). U losovaných kvízů hra typické omyly už nabízí, u pevných ne.
Doklad: `src/content/act3.ts:290, 391, 733, 826, 863`.
Návrh: Možnosti z typických omylů, např. III-14 „dají jinou desku, ale svítí stejně“ nebo „obvod se pak nedá zjednodušit dál“; III-11 „dá se z něj postavit jen Obraceč“ nebo „dá se z něj postavit každá runa, ale jen se dvěma vstupy“.

### H-III-20 · Strážce schodů před III · text · nízká · jistá
**„Z minulého patra“, a jedna otázka je z Předsíně**
Popis: Karta schodů slibuje „tři zákony z minulého patra (Síň Počtářů)“. Třetí otázka (`qRead`, „Kolik váží nápis 1011?“) je ale čtení z Předsíně. Záměr je dobrý (čtení se jinak vytrácí), jen ho text neodpovídá.
Doklad: `src/ui/screens/StairsScreen.svelte:90`; `src/content/act3.ts:946`; `src/content/quizzes.ts:618–635`.
Návrh: „…zeptá se na tři zákony, které už znáš.“

### H-III-21 · patro III (Gate) · přístupnost · nízká · jistá
**Nesedící řádky po Zkoušce jsou poznat jen barvou**
Popis: Po neúspěšné Zkoušce se nesedící řádky panelu „Brána žádá“ podbarví. Hlášení ale řekne jen počet („Lampa nesvítí správně ve 2 řádcích desky. Přepni vstupy podle nich…“) a řádky v tabulce nemají žádný popisek. Hráč se čtečkou neví, podle kterých řádků přepínat.
Doklad: `src/ui/gate/Gate.svelte:105`; `src/ui/screens/level/gateEvents.ts:53`.
Návrh: Do hlášení vypsat řádky (rowWords, jako u Desky) a nesedícím řádkům dát popisek „nesedí“.

### H-III-22 · III-14 · hratelnost · nízká · jistá
**Šest run v kameni jde proklikávat jen dopředu**
Popis: Kliknutí na kámen posune runu na další v pořadí Pouto, Rozcestí, Výluka, Zlomené pouto, Zavřené rozcestí, Rovnost. Kdo cílovou runu přeskočí, kliká pětkrát navíc. S klávesnicí a čtečkou to je až šest Enterů a šest hlášení. Tahy se nepočítají, jde jen o tření.
Doklad: `src/core/puzzles/gate.ts:190–196`; `src/content/generators3.ts:214, 219`.
Návrh: Krok zpět (Shift+klik, šipky), nebo u kamene se šesti runami nabídka jako výběr run na Desce.

### H-III-23 · III-2 (kvíz) · text · nízká · jistá
**Nápověda kvízu pracuje s písmenem n**
Popis: Otázka má konkrétní počet („pro runu se 4 vstupy“), nápověda ale zní „Kolik kombinací má n krystalů?“
Doklad: `src/content/quizzes.ts:607`.
Návrh: Dosadit číslo: „Kolik kombinací mají 4 krystaly?“

### H-III-24 · III-9 · text · nízká · jistá
**„Rovnost a důsledek“ a „Rovnost a Důsledek“**
Popis: Název komnaty a Echo píšou „důsledek“ malým písmenem, jméno runy a Kodex „Důsledek“ velkým. Ostatní komnaty jména run v názvu píšou velkým písmenem (Pouto, Rozcestí, Prapečeť).
Doklad: `src/content/act3.ts:585, 588`; `src/content/runes.ts:13`; `src/content/kodex.ts:417`.
Návrh: Sjednotit na „Rovnost a Důsledek“.

### H-III-25 · III-9 · hratelnost · nízká · jistá
**„Desku znám“ se v III-9 nabídne jen napůl**
Popis: Tlačítko se objeví u zkoumání, po kterém přímo následuje deska. V III-9 je to jen Důsledek, Rovnost ne. Když ho hráč použije, zahalí se lampa i pro desku Rovnosti. Funkčně to nevadí, jen to působí nahodile, a komentář v kódu mluví o III-2 až III-4.
Doklad: `src/ui/screens/Level.svelte:297–309, 331–335`.
Návrh: Buď tlačítko v III-9 nabízet už u Rovnosti (přeskočí obě zkoumání), nebo ho omezit na III-2 až III-4.

### H-III-26 · patro III · přístupnost · nízká · jistá
**Drobnosti pro čtečku: Deska a šifra**
Popis: (1) Na Desce se výběr řádku (klik na řádek nebo na krystaly vstupů obvodu) neohlásí, takže čtečka neřekne, co lampa obvodu v řádku dělá. Při poznávání runy nejsou řádky dosažitelné tabulátorem (tabindex −1, uvnitř není tlačítko). (2) V Tajné řeči horní řada vizuálně nese nápis „Šifra“ nebo „Zpráva“, popisek pro čtečku ale vždy zní „Nápis 1100 0110“.
Doklad: `src/ui/gate/Desk.svelte:51–59, 109–120, 138–140`; `src/ui/gate/Mask.svelte:57–58`.
Návrh: Při výběru řádku hlásit „Řádek A světlo, B stín: lampa svítí“ (nebo „pod závojem“). Popisek řady skládat z `topLabel`.

### H-III-27 · III-7, III-8 · didaktika · nízká · jistá
**Ukázka kroku u větvení nerozliší dva Obraceče**
Popis: Ukázka kroku na desce popisuje obvod runu po runě, u větvení se dvěma Obraceči ale zní „Obraceč dá stín, Obraceč dá stín, Rozcestí dá stín.“ Nejde poznat, který Obraceč patří ke kterému vstupu, a právě to je na zrcadlech podstatné.
Doklad: `src/game/stepWords.ts:50`; skript: `Řádek A světlo, B světlo: Obraceč dá stín, Obraceč dá stín, Rozcestí dá stín. Lampa mlčí.`
Návrh: U runy s jediným vstupem připsat zdroj: „Obraceč u A dá stín, Obraceč u B dá stín…“

## Patro jako celek
Zahrada má nejčistší herní jazyk ze všech pater: vstupy vlevo, kameny uprostřed, lampa vpravo a cíl v panelu. Pořadí zkoumání, deska a kvíz staví pojmy na tom, co hráč viděl. Křivka je ale nerovná. III-0 až III-5 jsou skoro bez odporu (jeden klik, tři komnaty stejného formátu, poznávání ze tří run, dvě opisované desky) a teprve III-6 přinese první opravdovou hádanku. III-7 je pak dobrá syntéza. Z rovinky do skoku vede jediné zkoumání větvení, které funguje, jen mu nápovědy patří ke špatné úloze (H-III-05).

Hlubší síně za to stojí: De Morgan v Zrcadlech, implikace s typickou chybou, duální Hlas většiny, univerzalita Prapečeti, masky, Echovo jméno v Tajné řeči a viditelné zjednodušení. Každá komnata má vlastní pointu a druhy hádanek se střídají. Velká brána je slušná, jen náhoda v Prapečeti mění obtížnost (H-III-15) a polovina pointy síní se v ní nevrátí.

Ovládání se liší cenou pokusu: v Bráně a na Desce je zkoušení zdarma a platí se až Zkouška, v Masce stojí krok každý dotek.

Echo mluví krátce, věcně a bez dětinskosti, pro 16–17 let správně. Pokazí ho jen „postav sám“, „Postavíš ho“ a „Tři runy“. Největší rizika: rychlá brána vynechá zavedení tří run (H-III-01), na telefonu je lampa za okrajem (H-III-11) a čtečka v Prapečeti hlásí lampu vždy zhasnutou (H-III-03).

## Co funguje
- Smyčka zkoumání, deska a kvíz v III-2 až III-4: hráč zapisuje, co viděl, a hláška na desce jmenuje řádek.
- Zahalená lampa v III-7 a III-8: deska se skládá z run, ne opisuje.
- Zkoumání hotového větvení v III-6 před stavbou a pojmenovaná Rovnost.
- Ukázka kroku u kamenů jmenuje runu i její zákon („Do zvýrazněného kamene patří Pouto: svítí, jen když svítí obě světla.“).
- Zkouška navíc v bráně po ukázce kroku (III-7, III-15) bere ukázce roli autopilota.
- III-8 Zrcadla: „Stejná deska jako u prvního obvodu. Zrcadlo!“ se dá dočíst a druhé zrcadlo hráč postaví sám.
- III-13: slovo ECHO roste písmeno po písmenu, klíč zůstane v masce a odemyká sám. Nejsilnější chvíle patra.
- III-14: starý obvod, šipka a jediný kámen. Zjednodušení je vidět.
- Kvíz o implikaci „Když prší, je mokro“ s typickou chybou a kvíz o Výluce jako spodní číslici součtu.
- Nečitelné slovo „Obraceč“ v III-0, které se po III-1 rozsvítí: drobný, ale funkční příběhový háček.
- Losované úlohy v III-5 až III-7 a III-12 až III-15 se při „Znovu“ mění a jsou řešitelné. Masky nikdy nejsou splněné prázdnou maskou (skript: 0 ze 400 losů).
