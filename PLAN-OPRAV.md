# Plán oprav před patrem V (0.4.4 až 0.4.8 alpha)

Schváleno autorem 20. 11. 2026, rozhodnutí jsou v kap. 3.1.

**Stav:** balíky A a B jsou hotové (verze 0.4.4). Navíc proti plánu: jeden krok na stisk platí i v Oltáři, Nápisu, Kaskádě a Přílivu (R2 „ve všech archetypech“); nápověda 2 v IV-7 (Porovnávač, Cesty) zůstala návodem, protože A7 jmenuje jen sedm komnat. Další je balík C (0.4.5).

Podklady: `RECENZE.md` (kap. 3 až 6), `recenze/<recenzent>-<patro>.md`, `PLAN.md`, `PLAYTEST.md`, opravy verze 0.4.3 alpha (commit 31a05e4) a inventura nevyřešených nálezů po patrech. Odkazy soubor:řádek platí pro verzi 0.4.3 alpha.

Značky:
- **S / M / L** je náročnost položky.
- **(V)** znamená, že položku převezme patro V nebo na ní stojí.
- **R1 až R7** jsou rozhodnutí autora (kap. 3.1).
- **Převzato** znamená, že plán počítá s doporučenou možností z inventury, dokud autor neřekne jinak (kap. 3.2).

---

## 1. Cíl etapy

Verze 0.4.3 opravila ověřené chyby a texty. Tahle etapa řeší názorové nálezy z kap. 4 recenze: pomoc a odezvu na chybu, opory, které prozradí objev, kvízy a tištěný Kodex, slovník a značení, podklady pro učitele, konec prototypu, čtečku obrazovky a dotyk. Po etapě má základní cesta i Hlubší síně pater I až IV fungovat bez známých rozporů mezi textem, nápovědou, ukázkou kroku a ovládáním. Zároveň mají existovat pravidla, podle kterých se napíše patro V: slovníček pojmů a značek, společný test textů, test „hraj jen podle ukázky“, pravidlo pro třetí nápovědu a pro why u pevných otázek, rozměry desek pro podporované zařízení. Etapa končí playtestem se studenty (PLAN.md, kap. 17, bod 8). Teprve potom začne příprava patra V.

### Co do etapy nepatří

Přesouvá se do **přípravy patra V** (samostatná etapa po této):
- Finále v datech, na mapě a v odemykání. `roomNumber('✦')` vrátí NaN (src/content/levels.ts:22-24), mapa a přehled třídy počítají s číslem v id (src/ui/screens/MapScreen.svelte:182, src/game/classOverview.ts:62).
- Glyf patra V a glyfy na dveřích. Glyph.svelte rozlišuje patra maskami 48, 32 a 16 (src/ui/Glyph.svelte:30-37), dveře ukazují krystal (src/ui/DoorTransition.svelte:26-27). Patří sem i počet pater na titulní obrazovce (src/ui/screens/Title.svelte:94, README.md:6).
- Oltář s glyfem pro V-0. PLAN.md:481 tvrdí, že existuje, Oltář ale cíl kreslí jen jako řadu (src/ui/altar/Altar.svelte:72-78).
- Kodex pro pojmy ze síní i z Archivu (společný, nebo druhý záznam) a víc klíčů u nečitelných slov (src/game/text.ts:5, src/ui/EchoText.svelte:11). S tím souvisí slova {{ticho}} a {{věky}} v I-0 (src/content/act1.ts:41, H-I-22), která přeloží až V-7.
- Archetypy Archivu (Kniha znaků, Léčitel, Mozaika, Strom znaků, Zpěv) a jejich napojení (src/content/types.ts:114-165, src/content/levels.ts:75-94).
- Zkratka Glyfy znám ve V-1. Staví na příznaku z položky B6.
- Zvýšení LAYOUT na 6 (src/game/migrate.ts:14), až s vydáním patra V (pravidlo zapíše D3).
- Strážce schodů do Archivu. Použije generátory z C9.
- Úpravy PLAN pro patro V: kap. 6 „Co to znamená pro kód“ (PLAN.md:475-486), časový rozpočet hry (PLAN.md:53), paměť ve Finále (PLAN.md:36), čtečka pro mřížky, přehrání vlny ve V-6 bez zvuku.
- Zkouška zasvěcení (R3: až s patrem V).

**Později** (po patru V nebo podle playtestu):
- mapování na RVP, dokud autor nedodá ověřené znění (PLAN.md:873).

**Nemění se:** technologie (Svelte + TS + Vite). Měření výkonu se neplánuje.

---

## 2. Balíky práce

Doporučené pořadí: **A → B → C → D → E → F**.
- A a B jsou v RECENZE kap. 6 na místech 2 a 3 a mají nejvíc položek s vysokou hodnotou.
- C dává slovník a tištěné materiály, na kterých stojí texty patra V.
- D a E nejsou na A až C závislé, E7 ale potřebuje zkoušku na skutečném telefonu, kterou udělá autor.
- F je podle recenze „později“: mechaniky až po opravách textů, generátorů a ukázky kroku (RECENZE 4.16).

### Balík A: ukázka kroku a nápovědy

**Cíl:** třetí stupeň nápovědy ukáže jeden krok, který sedí s textem i s postupem nápovědy 2. Nápovědy 1 a 2 radí princip, neopakují ovládání a neprozradí celé řešení. RECENZE 4.2 a 4.14, kap. 6, bod 2.

**A0 Test „hraj jen podle ukázky“ (V)**: M. Celá hra. RECENZE 4.2, příprava V (testy).
- Pro každý archetyp (Oltář, Nápis, Kaskáda, Příliv, Brána, Deska, Maska, Dílna) odehrát komnatu jen podle ukázky kroku, od startu i z typického chybného stavu. Zvýrazněný prvek musí odpovídat textu a komnata musí skončit vyřešená.
- Hlídat i podmínky z textů: Tichý krok jde zrcadlovým Grayovým kódem, ukázka u glyfů nezmíní váhu nad 8, cesta ve Vahách Osudu se vejde do limitu.
- Soubory: src/content/levels.test.ts:458-505 (rozšířit, nebo nový test vedle). Jako vzor poslouží skripty recenzentů `sim/`, které leží mimo repozitář.
- Udělat jako první položku etapy, protože hlídá A1 až A8 i balík F.

**A1 Tichý krok a deska kombinací**: M. I-3, I-11, I-15. D-I-05, K-I-04, D-I-08, K-I-21, H-I-13, H-I-05, H-I-06.
- hamiltonStep a smyčka pro I-3 projdou krystaly od nejlehčího (src/core/puzzles/altar.ts:210, 308, 317). Ukázka pak vydá zrcadlový Grayův kód (0000, 0001, 0011, 0010 …). breakStep (altar.ts:294) zůstane.
- U osmé kombinace jen „Polovina cesty.“ (src/content/act1.ts:433). Větu „Teď přijde zrcadlo.“ přidat v src/ui/screens/level/altarEvents.ts:43-49, jen v přísném režimu a jen když žádná nalezená kombinace nemá rozsvícený levý krystal.
- Nápovědy a zadání podle skutečného pravidla „žádná kombinace dvakrát“: act1.ts:109-110 (I-3: nejdřív dva pravé krystaly, pak levý a pozpátku), 416, 423, 595, 602. Jediná změna zůstane v Kodexu jako vlastnost Grayova kódu.
- Po nalezené kombinaci u cíle „všechny“ se stupeň nápovědy vrátí nejvýš na 2, ne na 0 (src/game/altarGame.svelte.ts:84). Podle R2.
- Po přerušení cesty uložit do historie stav před dotekem, takže Zpět (altarGame.svelte.ts:82-83, 114-120) vrátí přerušenou cestu. Tah se počítá, pečeť přesnosti padne. Repliky reset (act1.ts:432, 608) doplnit větou „Zpět vrátí cestu před přerušením.“ Převzato.
- Soubory: src/core/puzzles/altar.ts, src/content/act1.ts, src/ui/screens/level/altarEvents.ts, src/game/altarGame.svelte.ts, src/core/puzzles/altar.test.ts, src/content/recenzeI.test.ts.

**A2 Glyfy: ukázka kroku po čtveřicích a hláška po desítkovém zápisu (V)**: M. I-13, I-14, I-15 (později V-1, V-2). D-I-12, K-I-05, K-I-25.
- Nová glyphStep pro radix 16 v src/game/stepWords.ts:15-31, volaná v src/game/inscriptionGame.svelte.ts:87-97.
  - Čtení: jmenovat svítící strany a odkázat na kotouč, součet nechat hráči (jako readStep).
  - Zápis: „Žádáno A5. Levý glyf A je 10 = 8 + 2 …“, u jedné čtveřice „Žádáno C (12) …“.
- Nový druh chyby decimal v src/core/puzzles/inscription.ts:142, 167-175, kdy číslice na kotoučích tvoří desítkový zápis. Hláška „Tohle je desítkový zápis. Každá čtveřice je jeden glyf.“ v src/game/inscriptionWords.ts:23.
- Test v src/core/puzzles/inscription.test.ts: ukázka u glyfů nikdy nezmíní váhu větší než 8.

**A3 Jeden krok na jeden stisk (Dílna a Brána)**: M. Stavby patra IV (hlavně IV-6, IV-7, IV-11, IV-12, IV-14), Brána patra III. D-IV-05, RECENZE kap. 6, bod 2. Podle R2.
- Po provedeném kroku vrátit stupeň na 2: v MachineGame (src/game/machineGame.svelte.ts:98-107, 270-272) i v Bráně (src/game/gateGame.svelte.ts:74, 178). Další ukázka je pak další stisk.
- Pečeť odvahy i zkouška navíc v bráně (src/game/baseGame.svelte.ts:175) zůstanou, jak jsou.
- V přehledu třídy vzroste průměr ukázek kroku, protože se počítá každý stisk. Zmínit to v README u přehledu třídy.

**A4 Ukázka kroku s důvodem**: M. II-1, II-14, II-15, III-11, III-15, Dílna. D-II-02, D-II-03, D-II-31, D-III-08, K-III-16, H-III-14, D-IV-05 (důvod).
- II-1:
  - nová counterStep(on) ve stepWords.ts, kterou altarGame.svelte.ts:60 vrací pro hintOrder 'low' místo null;
  - nápověda 1 (src/content/act2.ts:117): „Začni vpravo. Co se stane s krystalem, který už svítí, když do něj přidáš další světlo?“
- Váhy Osudu:
  - tideStep (stepWords.ts:107-120) v přísném režimu porovná distance se zbylým limitem;
  - když se cesta nevejde, řekne, že se misky vrátí, a ukáže cestu od taskStart;
  - hintOp (src/game/tideGame.svelte.ts:89) pak nezvýrazní žádnou páku.
- Prapečeť:
  - stepHint pro točitý kámen (gateGame.svelte.ts:80-81) jmenuje zdroj přes sourceWords (stepWords.ts:65) a krátce řekne důvod podle role runy (src/content/generators3.ts:170-198);
  - nápověda 2 v III-11 (src/content/act3.ts:709) dostane Rozcestí (text z act3.ts:907);
  - úvod Echa (act3.ts:713) dostane větu o točitých kamenech.
- Dílna: u točitého kamene přidat runu zdrojového kamene a její vstup (machineGame.svelte.ts:105, src/game/machineWords.ts).
- Testy: src/core/puzzles/tide.test.ts, src/content/recenzeII.test.ts, src/content/recenzeIII.test.ts (ukázka v Prapečeti nikdy nevrátí obecnou větu).

**A5 Nápovědy podle úlohy v Dílně**: S. IV-4, IV-12 (a IV-7). D-IV-03.
- Do MachineTask přidat volitelné hints (src/core/puzzles/machine.ts:112-127) a do MachineGame getter taskHints, stejně jako má GateGame (gateGame.svelte.ts:64-66). Level.svelte:467 ho už čte.
- Vlastní nápovědy dostanou compareTask (src/content/generators4.ts:66-75), napsané tak, aby seděly i v IV-7 (act4.ts:527-533), a subtractTask pro oba režimy (generators4.ts:105-122).
- Test v src/content/recenzeIV.test.ts: stavba přesně podle nápovědy 2 v obou druhých úlohách projde.

**A6 Nápovědy, které neradí, opakují ovládání nebo prozradí pointu**: M. III-2 až III-4, III-6, III-9, III-10, III-15, II-9, II-14, II-15. H-III-16, D-III-13, D-III-22, H-III-08 (zbytek), D-III-08 (Závoj v III-15), D-II-19, H-II-14, H-II-12.
- Patro III:
  - EXPLORE_HINTS[1] (generators3.ts:53) uvede pořadí, kterým stačí tři doteky;
  - v III-9 se prohodí nápovědy 1 a 2 (act3.ts:622-623);
  - III-10, nápověda 2: „Nevracej se ke kombinaci, kterou už máš.“ (act3.ts:664-665);
  - III-6, nápověda 1 rozliší Zlomené pouto od Zavřeného rozcestí (act3.ts:368);
  - Závoj v III-15, nápověda 2 (act3.ts:895);
  - závěr III-10 (act3.ts:653).
- Patro II:
  - II-9, nápověda 2 (act2.ts:576) a Váhy Osudu, nápověda 1 (act2.ts:891, 1014) bez odkazu na dvojkový zápis, který kolo ani miska neukazují;
  - replika po tahu +1 z jedničky v II-9 přes nové volitelné pole echo (src/content/types.ts:89-101, src/ui/screens/level/tideEvents.ts, case 'pull'). Převzato.

**A7 Nápověda 2 jako princip v patře IV**: M. IV-5, IV-8 až IV-12, IV-15. D-IV-20, H-IV-07. Podle R6.
- Přepsat nápovědu 2 na princip a otázku (act4.ts:421, 611, 659, 784, 864, 887, 1030). Celé zapojení dá až ukázka kroku.
- Ověřit, že se nápovědy 1 a 2 nepřekrývají s replikami Echa.
- Závisí na A3: k ukázce kroku dojde víc hráčů a ta pak dává zapojení po krocích.

**A8 Třetí nápovědy, které přebije ukázka kroku (V)**: M. Všechna patra. D-I-28 (ve verzi 0.4.3 přeskočeno). Převzato: „Smazat a hlídat testem“.
- V typu hints budou dvě položky povinné a třetí volitelná (types.ts:86). V komnatách, kde se vždy ukáže stepHint, se třetí text smaže (act1.ts až act4.ts).
- src/content/levels.test.ts:37 bude hlídat, že třetí text mají jen komnaty, kde stepHint může chybět (I-4 a I-5 s neznámými vahami, archetypy bez stepHint).
- Level.svelte:468 při chybějícím textu nic neukáže. Komnaty patra V pak mrtvý text nedostanou.

**Závislosti:** A0 první. A1, A3 a A7 podle R2 a R6. E2 (glyfy pro čtečku) staví na A2, E4 na textu ukázky z A3 a A4.

**Ověření:**
- `npm test` (A0 a nové testy), `npm run check`.
- Prohlížeč (náhled): I-3 a I-11 projít jen podle ukázky, ukázka glyfu v I-13 a I-14, Prapečeť v III-11, druhá úloha IV-12, počet stisků v IV-6. Konzole bez chyb.
- Playtest: hráč typu „Nikola“ (PLAYTEST.md, kap. 1). Sledovat ukázky kroku v I-6 a v branách (PLAYTEST.md, kap. 7).

### Balík B: odezva na chybu, opory a generátory

**Cíl:** každá chyba vyvolá odezvu, opory neprozradí objev a losované úlohy drží podmínky, na kterých stojí texty. RECENZE 4.3, 4.5 a 4.14, kap. 6, body 3 a 4.

**B1 Kaskáda: odmítnutí, které pošle k přenosu, a stupňované hlášky**: M. II-3, II-4, II-5, II-10, II-12, II-13, Kaskáda II-0 až II-15. H-II-04, D-II-07, D-II-06.
- cascadeRefusal (src/game/cascadeWords.ts:148) pro carries ≠ 'none': když sloupec čeká na přenos, řekne „… nejdřív rozsviť krystal přenosu nad tímto sloupcem“. Jinak zůstane stávající věta, takže test cascadeWords.test.ts:83 platí dál. Nový test pro 3 + 1 v II-3 s výsledkem rozsvíceným před přenosy.
- Chybná potvrzení se budou počítat na buňku (src/game/cascadeGame.svelte.ts:113). První chyba dá otázku (cascadeWords.ts:70 a 82 přepsat jako otázku), konkrétní krystal až druhá chyba ve stejné buňce. Ukázka kroku se nemění. Převzato.
- Soubory: src/game/cascadeWords.ts, src/game/cascadeGame.svelte.ts, src/core/puzzles/cascade.ts, src/ui/screens/level/cascadeEvents.ts, src/game/cascadeWords.test.ts.

**B2 II-8 Výpůjčka: řetěz výpůjček v hláškách a nápovědě**: S. II-8. D-II-15, H-II-11, D-II-17, K-II-16 (Kodex).
- cascadeWords.ts:125: když sloupec vlevo patří k výpůjčkám, připojit „Sloupec si nejdřív musí půjčit od souseda vlevo.“ Bez slova „sám“, aby prošel společný test textů z C1; totéž upravit na ř. 123.
- Nápověda 2 (act2.ts:533) zkrátit a doplnit řetěz. Repliku act2.ts:542 zkrátit na dvě věty.
- Kodex (src/content/kodex.ts:233): výpůjčka přes nuly, 1000 − 0001 = 0111.

**B3 Zkouška paměti: vysvětlit tabulku, ukázat skutečné lampy, tlačítko Od tmy**: M. IV-8 až IV-11, IV-15. D-IV-06, D-IV-11. Převzato: „Tlačítko Od tmy“.
- Pod nadpis tabulky (src/ui/machine/Workshop.svelte:213) dát řádek „Kroky jdou po sobě, od zhasnuté paměti.“ a do úvodu stavby IV-8 (act4.ts:615) repliku o krocích v čase.
- V chybném řádku (Workshop.svelte:223-231) ukázat vedle očekávané lampy i skutečnou (view.failed.shown, machine.ts:144), s aria-label.
- failureWords (machineWords.ts:99-104): „Projdi kroky 1 až k od zhasnuté paměti“ a co lampa ukázala.
- Tlačítko Od tmy jen u úloh se script: nová funkce v machine.ts podle examine (machine.ts:528) a MachineGame.resetMemory(). Nepočítá se jako tah a nic nesmaže.

**B4 I-10: zbytečné doteky rozzáří Nápovědu**: S. I-10. D-I-02 (část I-10, ve verzi 0.4.3 přeskočeno). Převzato: „Ano, jen I-10“.
- Příznak v AltarConfig jen pro I-10. Toggle (altar.ts:104-175) počítá doteky, po kterých krystal nesedí s cílem, stejně jako zápis v Nápisu (inscription.ts:83-93), a od druhého pošle slip. Pole strays v AltarState se nuluje při kroku.
- Level.svelte:125 slip už počítá. I-4 a I-5 se nemění.

**B5 Opory, které prozradí objev**: M. I-8, I-9, III-5, III-9 (dopad na III-7). D-I-09, H-I-14, D-I-10, D-III-06, H-III-10, K-III-10 (část III-5), D-III-21. Převzato: „Součet mizí“.
- I-8 a I-9:
  - do FadingAid přidat 'sum' (types.ts:73), Altar.svelte:142 a hlášení v altarEvents.ts:24 pak ukážou součet jen přes aidOn;
  - v I-8 fade { sum: 2 } a replika step[1] „Teď i součet zmizí. Zákon zůstal.“ (act1.ts:318);
  - v I-9 showSum: false (act1.ts:350).
- III-5 a III-9:
  - v III-5 veilLamp: true a zadání jako pokyn (act3.ts:322-328);
  - v části Desky v III-9 veilLamp a pořadí vyplnit, vyplnit, poznat, poznat (act3.ts:613-620);
  - genIII5 dá dvě různé vyplňované runy a poznávané runy losuje nezávisle, aspoň dvě různé (generators3.ts:91-97);
  - opravit PLAN.md:369 a 372.
- Testy: recenzeI.test.ts (ve třetím cíli I-8 není součet na obrazovce ani v hlášení), recenzeIII.test.ts (III-5 a III-9 mají veilLamp, genIII5 dává dvě různé runy).

**B6 Brány, zkratka Desku znám a pořadí úloh (V)**: M. II-7, II-15, III-2 až III-4, III-9, IV-13. H-II-10, D-III-16, H-III-25, D-IV-13, D-IV-12. Převzato: „Až po Potvrdit“, „Jen III-2 až III-4“.
- Brány Kaskády:
  - let světel (src/ui/cascade/Cascade.svelte:108) jen při cfg.conserve, v bráně až po přijatém výsledku (game.holding);
  - do zadání bran (act2.ts:445, 942): „Brána krystaly nehlídá: co kam teče, spočítej v hlavě.“
- Desku znám:
  - výslovný příznak v Presentation (types.ts), nastavený jen u zkoumání v III-2 až III-4; canKnow (Level.svelte:309) ho vyžaduje;
  - příznak navrhnout tak, aby šel rozšířit o podmínku přeloženého záznamu Kodexu. Na to čeká Glyfy znám (PLAN.md:440, 484).
- IV-13:
  - nejdřív aluTask(OPS, 'selectors'), potom aluTask(OPS, 'runes', 'crossed') (act4.ts:929-940);
  - prohodit say a repliky step 0 a 1 (act4.ts:949-952), do úvodu (act4.ts:948) přidat větu o výhybce jako jednom kameni;
  - upravit test recenzeIV.test.ts:113.

**B7 Generátory proti textům**: M. I-6, I-7, I-9, II-13, III-15. D-I-11, K-I-24, H-I-25, D-I-25, D-II-28 (a), H-III-15. Převzato: „Vždy Rozcestí“.
- genI6 a genI7 (src/content/generators.ts:45-57) bez souměrných hodnot (mirrored(v, 4) === v, inscription.ts:145), v I-6 aspoň u úloh 3 až 5, v I-7 u všech. Pevné hodnoty v act1.ts:213 a 259 vyměnit za nesouměrné.
- I-9: čtvrtá skupina „dělitelné čtyřmi, ale ne osmi“ (act1.ts:341), aby ideál nepřeskočil skupinu „dělitelné osmi“.
- genII13Negate losuje další čísla z 1 až 6 (generators.ts:393), aby u −7 nešla obejít zkratka.
- genIII15Nand (generators3.ts:362-364) losuje vždy Rozcestí, takže závěr „umíš je zrcadlit“ (act3.ts:878) platí.
- Každý dotčený generátor projít smyčkou přes 200 semínek s podmínkami, na kterých stojí texty (příprava V, testy).

**Závislosti:** B1 před C2, protože obojí mění texty Kaskády ve stejném souboru. B5 změní, s čím hráč přijde do III-7, proto III-7 ověřit spolu s ní. Příznak z B6 je základ pro Glyfy znám.

**Ověření:**
- `npm test` (nové testy v cascadeWords, recenzeI až IV, smyčky přes semínka).
- Prohlížeč: v II-3 rozsvítit výsledek před přenosem, v IV-8 udělat chybu a použít Od tmy, ve třetím cíli I-8 zkontrolovat, že součet zmizel, v III-5 zkontrolovat zahalenou lampu.
- Playtest: „Ema“ (pečeť přesnosti v III-2 až III-4), „Nikola“ (III-5 bez opisu z lampy).

### Balík C: kvízy, Kodex a slovník

**Cíl:** tištěné Shrnutí patra a pracovní list jsou věcně přesné a zkoušejí to, co komnaty procvičily. Jedno slovo znamená jeden pojem. Slovníček je podklad pro texty patra V. RECENZE 4.10 až 4.13, kap. 6, body 10 a 11.

**C1 Slovníček pojmů a značek a společný test textů (V)**: M. Celá hra. RECENZE 4.11, K-II-14, K-II-13, H-II-21 (÷), D-IV-09, H-II-15 (dohoda o číslování), příprava V (slovníček). Podle R7.
- Do PLAN 2.3 (PLAN.md:93-112) slovníček se sloupci: lumenitské slovo, moderní pojem, kde se zavádí (základ, nebo síň), značka, zakázaná záměna. Obsah:
  - přetečení jen u nádoby, odliv jen u posunu, parita;
  - dolní index znamená váhu, vzorce se oddělují středníkem;
  - dělení a násobení podle R7;
  - šestnáctkový zápis v Kodexu D₁₆;
  - číslování krystalů pro čtečku: zprava, s váhou, když je známá (převzato, provede E1);
  - dvojková čísla v kvízech s indexem ₂.
- Podle slovníčku upravit:
  - vzorce Kodexu II a III středníkem (kodex.ts:173, 197, 246, 280, 292, 303, 434, 445, 489);
  - operandy qPairSum a qSubtract s indexem ₂ (src/content/quizzes.ts:259, 536);
  - značky podle R7 (src/ui/tide/Tide.svelte:28, src/ui/tide/TideLedger.svelte:21, src/ui/cascade/CascadeLedger.svelte:11, Cascade.svelte:100, quizzes.ts:485, 557).
- Jeden společný test textů pro všechna patra místo testů po patrech (recenzeI.test.ts:36, recenzeIII.test.ts:237):
  - zakázané obraty (sám, prošel, klik, akt, „postavíš ho“…), i v aria-label komponent, jakmile je opraví E4;
  - záměny ze slovníčku;
  - odkazy jen na komnaty a záznamy Kodexu, které leží na cestě ke komnatě (RECENZE 4.9).
- Slova Archivu, která se srazí s dnešními (strážce, rozcestí, kruh, dvojznak), zapsat do slovníčku jako otevřená. Rozhodnou se v přípravě patra V.

**C2 Přenos a přetečení: slova a Kodex doplňku**: M. II-1, II-3, II-5, II-13, Strážce schodů do III (qAdd). D-II-09, K-II-05, K-II-19, K-II-04, K-II-08. Převzato: „Kodex a kvíz“.
- Podstatné jméno „přetečení“ vyhradit nádobě (II-5, II-7). Dvojice, která přeteče, je jedno světlo vlevo. Texty: act2.ts:225, 232, 237, 241, 852, quizzes.ts:517, 522, 673, cascadeWords.ts:70, 87.
- Kodex:
  - rozsah −8 až 7 a přetečení se znaménkem (kodex.ts:313);
  - vzorec bez řetězu nerovností (kodex.ts:314);
  - carry a overflow flag (kodex.ts:187, 223).
- Nová otázka qSignedOverflow (0111 + 0001 ve čtyřech krystalech) do kvízu II-13 (act2.ts:856-859).
- Test v recenzeII.test.ts: „přetečení“ se v patře II objevuje jen u II-5, II-7 a v Kodexu nádoby.

**C3 Doplněk: kolo, zápisník a ukázka mluví o −3**: M. II-11, II-13. K-II-17, H-II-13, D-II-27, D-II-28 (b), H-II-08.
- Hlášení po splněné zkoušce (tideEvents.ts:52) neprozradí cíl, který kolo skrývá: „Na krystalech je 50, kolo žádá ÷ 8.“
- Ukázka kroku s task.show (stepWords.ts:107-120): „Nejkratší cesta k −3 (1101₂ = 13) …“.
- Zápisník Přílivu píše „3 → −3“ (src/ui/tide/TideLedger.svelte:33-43).
- Třetí zkouška II-13: příznak signed v CascadeConfig a v genII13Add (act2.ts:825-836, generators.ts:403-417). CascadeLedger (CascadeLedger.svelte:15-33) pak píše „1101₂ −3“ a „4, tedy 7 − 3 (přenos zahozen)“.
- Test v recenzeII.test.ts: hlášení po kroku v II-11 a II-13 neprozradí cílovou váhu.

**C4 Jména a pojmy: moderní jména v patře IV, IV-10, parita, téma patra II (V)**: M. Patro IV, IV-10, I-9, karta patra II. K-IV-13, K-IV-19, K-I-08 (také příprava V), K-II-23 (téma). Převzato: „Oba názvy v textech“, „Řada ozvěn“.
- Od patra IV psát v nápovědách, vysvětleních kvízů a závěrech Echa oba názvy („Výluka (XOR)“, „výhybka (multiplexor)“). Napevno, nebo pomocnou funkcí se stejnou podmínkou překladu jako deska (MachineBoard.svelte:262). Do kvízů základní cesty IV přidat jednu otázku na moderní jména. Pravidlo zapsat i pro patro V.
- IV-10 „Řada ozvěn“: titulek (act4.ts:728), úvod (act4.ts:767), ancientName (kodex.ts:593). „Registr“ zazní v závěru (act4.ts:732).
- Parita:
  - modernName „Sudost a lichost, dělitelnost mocninami dvou“ (kodex.ts:83-91) a věta, že v kódování znamená parita počet jedniček;
  - interní id 'parita' ponechat kvůli uloženým postupům, záznam z V-3 dostane jiné id;
  - společný test textů (C1) pohlídá, že slovo parita se jinde neobjeví.
- Téma patra II „Počítání ve dvojkové soustavě“ (act2.ts:1032).

**C5 Značky na desce Dílny**: M. IV-5, IV-6, IV-7, IV-8, IV-10, IV-12, IV-13, IV-15. H-IV-06, D-IV-12. Převzato: „Značky místo číslic“.
- sourceLabel (src/ui/machine/MachineBoard.svelte:160-168): stálé světlo a stín jako plný a prázdný krystal, výstup kamene jako „k1“.
- Kameny číslovat podle polohy shora dolů a zleva doprava, ne podle pořadí v poli. Pořadí výpočtu v srLatch (src/content/machines.ts:292) zůstane. Stejné číslo použít ve fromWords a seatWords (machineWords.ts:52-53, 63-67).
- Kolíky výhybky přejmenovat na ○ a ● (machine.ts:27, src/ui/machine/layout.ts). Výpočet jde podle indexu, jména slouží jen k zobrazení.

**C6 Kodex k tisku a texty, které předbíhají (V)**: L. Kodex pater I, III a IV, kvízy I-3 a I-11, README. K-I-09, K-I-10, K-I-22, K-I-27, D-I-16, D-I-22, H-I-26, D-I-24, K-I-03, K-III-08, D-III-10 (Kodex), D-III-15, K-III-17, K-III-12, K-III-14, K-III-13, D-III-23, K-III-15, K-IV-06, K-IV-07, K-IV-08, D-IV-23, K-IV-22, K-IV-05. Převzato: „Jen věta v Echu a Kodexu“ (ALU).
- Pravidlo pro všechna patra včetně V: co se má tisknout, patří do modern nebo formula, protože jen ta tiskne Shrnutí patra (SummaryScreen.svelte:35-36). Pole today je jen „kde se to používá dnes“.
- Patro I:
  - napětí místo proudu (kodex.ts:11);
  - řád, základ soustavy a binární (kodex.ts:36-44);
  - dělení dvěma přesunout do modern a zapsat pod sebe (kodex.ts:52-56);
  - b, B, kB a KiB (kodex.ts:68);
  - hexadecimální soustava, základ 16 (kodex.ts:137).
- Texty, které předbíhají:
  - quizzes.ts:179 (Grayův kód), quizzes.ts:77 (oktáva);
  - kodex.ts:91 (AND), 100 (přenos), 113 (příklad 13 místo 45);
  - nápověda 1 v I-5 (act1.ts:182);
  - README.md:10.
- Patro III:
  - šifra s klíčem stejně dlouhým jako zpráva (kodex.ts:468);
  - čipy bez univerzality NAND (kodex.ts:391, 446);
  - Rovnost = XNOR už na základní cestě (runes.ts:67, RUNE_KODEX.xnor na 'retezy');
  - zápis většiny se ∧ a ∨ (kodex.ts:434);
  - „nižší řád“ místo „spodní číslice“ (kodex.ts:367, 497, act3.ts:300-301);
  - vysvětlení bez odkazu na nepovinnou II-13 (act3.ts:787);
  - věty „Jinde uvidíš i …“ (Ā, A′, logický součin a součet, ⊕).
- Patro IV:
  - porovnávač (kodex.ts:534) a dekodér (kodex.ts:555);
  - kombinační a sekvenční obvod (kodex.ts:564, vysvětlení kvízu IV-15, act4.ts:1062-1063);
  - zakázaný stav S = R = 1 (kodex.ts:574-576);
  - ALU jako logická část (kodex.ts:629-630, act4.ts:955);
  - jádro procesoru s řadičem místo „všech částí“ (kodex.ts:651-653).

**C7 Pevné otázky: why, věrohodné distraktory, vyrovnané délky (V)**: L. II-12, III-4, III-6, III-9, III-11, III-13, III-14, IV-1, IV-3, IV-4, IV-5, IV-8, IV-9, IV-12, IV-13, IV-15. D-III-14, H-III-19, D-IV-07, D-IV-21, D-IV-08, H-IV-23, D-II-25.
- Patro III: výplně nahradit typickými omyly, každý s vlastním why (act3.ts:291, 388, 628-634, 730, 824). Otázku v III-14 přestavět na to, co komnata cvičí (act3.ts:862, kodex.ts:477).
- Patro IV:
  - vyrovnat délky odpovědí a výplně nahradit omyly (act4.ts:152-163, 279, 433, 623, 716, 1059);
  - IV-4 se ptá na princip (act4.ts:338);
  - IV-13 má přiřazení kódů přímo v otázce a „Čí výsledek pustí výhybky k lampě?“ (act4.ts:960-963).
- II-12: why u otázky Tří řad (act2.ts:732-738).
- Test pro všechna patra: každý distraktor pevné otázky má why. Pravidlo platí i pro kvízy patra V (RECENZE 4.13).

**C8 Kvízy, které chybí nebo zkoušejí jinou látku**: L. I-13, I-14, II-8, II-14, II-15, III-4, III-6. D-I-20, D-I-21, D-II-18, K-II-16 (kvíz), D-II-32, K-III-09. Převzato: „Kvíz s dělením a doplňkem“, „Dvě otázky se zápisem“.
- I-13: qGlyphWeight nahradit čtením glyfu po stranách (quizzes.ts:188-215). I-14: why u otázky #FF8800 (act1.ts:566-572) a echo.complete o váze levého glyfu před kvízem.
- II-8: quiz [qSubtract] a otázka „1000 − 0001: kolik výpůjček proběhne?“ (act2.ts:549).
- II-14: nový qFateSteps přes distance z tide.ts místo qSubtract.
- II-15: quiz [qRemainder, qComplementSum] (act2.ts:1018-1022). Závěrečná věta (act2.ts:923) pak platí.
- III-6: „Rozcestí a za ním Obraceč. Který zápis to je?“; III-4: otázka se zápisem A ⊻ B. Obě s why, samy se dostanou do pracovního listu.
- Testy v src/content/quizzes.test.ts.

**C9 Losované otázky Hlubiny a Strážci schodů (V)**: M. IV-2, IV-5, IV-6, schody do II a do IV, pracovní list IV. K-IV-12, D-II-01, D-IV-19, D-II-04 (c), H-II-21 (qOverflow), příprava V (generátory Hlubiny). Převzato: „Otázka na váhu souseda“.
- Do generators4.ts přidat qHalfAdder, qFullAdder, qMux a qDecoder, každý s why pro typickou chybu (Rozcestí místo Výluky, chybějící přenos, přehozený volič, prohozené váhy). Zařadit je do IV-2 (act4.ts:228-233), IV-5 (act4.ts:432-437) a IV-6 (act4.ts:469-474). Později je použije Strážce schodů do Archivu.
- Strážce do II: qNeighborWeight místo qCombosNext (act2.ts:1037). Strážce do IV: qAdd místo qTableRows (act4.ts:1080, import na ř. 39).
- qFastMul (quizzes.ts:565) a qOverflow (quizzes.ts:351).
- Testy přes mnoho semínek (src/content/generators.test.ts, quizzes.test.ts).

**Závislosti:** C1 (podle R7) před C2 až C5 a před E1. C9 před D5, protože list IV se jinak mezi variantami liší jedinou otázkou, a před přípravou patra V.

**Ověření:**
- `npm test` (společný test textů, test why, smyčky přes semínka).
- Prohlížeč: náhled tisku Shrnutí patra I až IV a pracovního listu, kontrola vzorců a indexů.
- Playtest: vytištěné Shrnutí patra jako tahák na lavici (PLAYTEST.md, kap. 7).

### Balík D: učitel, tok hry a konec

**Cíl:** učitel z přehledu a listů vyčte, co třída umí, hráč ví, kam jít dál, a prototyp má konec. RECENZE 4.7 a 4.17, kap. 6, body 7 a 12.

**D1 Mapa a deska po velké bráně (V)**: M. Mapa pater I až IV, komnaty 15. H-I-24, H-I-15 (deska).
- MapScreen.svelte:17, 35-37, 254-277: razítko „Vstoupit“ dostane i první otevřená Hlubší síň zobrazeného patra.
- Level.svelte:55: u komnaty 15 se jako další bere první neotevřená komnata základní cesty. Deska nabídne „Další patro“ (LevelComplete.svelte:135-136, 142) s větou, že Hlubší síně patra jsou celé.

**D2 Závěrečná karta a Srdce na základní cestě (V)**: M. IV-0, IV-7, IV-15. K-IV-11, H-IV-09, příprava V (závěrečná karta). Převzato: karta hned, po IV-7 a IV-15.
- Jedna komponenta karty: replika Echa, souhrn pečetí a přeložených zákonů, odkaz na Shrnutí patra a věta, že Archiv Hlasů spí (src/ui/altar/LevelComplete.svelte:126-167, src/ui/screens/Level.svelte:55-58, 728-731).
- Kartu vázat na poslední patro v ACTS, ne natvrdo na IV, aby se s patrem V přesunula sama. Nechat v ní místo pro nabídku výstupního testu (podle R3 teď, nebo až s patrem V).
- Srdce zmínit na kartě patra IV (act4.ts:1072-1082), v úvodu IV-0 (act4.ts:90-110) a v závěru IV-7 (act4.ts:484).

**D3 Formát postupu: volitelná pole a pravidlo pro novou verzi (V)**: M. Soubor s postupem. K-I-26, příprava V (formát postupu).
- Výsledek Strážce schodů (proměnná clean, src/ui/screens/StairsScreen.svelte:37, 45) uložit jako volitelné pole po patrech do ProgressData (src/game/progress.svelte.ts:22-35). Načíst ho v parseProgress (src/game/progressFile.ts:41-80) a slučovat v src/game/migrate.ts. Pole pro test jen podle R3.
- Do PLAN zapsat pravidlo: s vydáním patra V zvýšit LAYOUT na 6 (migrate.ts:14). Starší verze pak soubor odmítne (progressFile.ts:50-53) a nepřepíše ho průběžným ukládáním (src/game/progressLink.svelte.ts:56-60).
- Testy src/game/progressFile.test.ts a migrate.test.ts: zápis a zpětné čtení, starý soubor bez nových polí.

**D4 Přehled třídy: rozehrané komnaty a výsledky Strážce**: M. Přehled třídy. K-I-07, K-I-26.
- Sloupec „Zaseklo se“ přejmenovat na „Nedokončili“ (src/ui/screens/TeacherScreen.svelte:143). isTroublesome bere nedokončení jen u studentů, kteří komnatu otevřeli aspoň dvakrát (src/game/classOverview.ts:87, 96-98, stats.entered v src/game/roomStats.ts:5). Kritérium ukázek kroku zůstane.
- Nový sloupec s výsledky Strážce po patrech (data z D3). Test v src/game/classOverview.test.ts.

**D5 Pracovní list s přepínačem (V)**: M. Listy pater I až IV. K-II-15, K-IV-12 (A). Převzato: „Přepínač na listu“.
- src/ui/screens/WorksheetScreen.svelte:17-26: přepínač Základní cesta / Hlubší síně / Vše (basicRooms, advancedRooms, src/content/levels.ts:52). Záhlaví listu říká, co pokrývá. Poslouží i patru V.

**D6 Karta patra pro učitele (V)**: L. Shrnutí patra I až IV, README. K-I-12, K-I-11, K-II-23, K-III-21, K-IV-12 (B). Podle R4.
- U komnat nová data v LevelDef (types.ts): nový pojem, formální zápis a kvíz. Z nich blok ve Shrnutí patra v učitelském režimu (src/ui/screens/SummaryScreen.svelte): které cíle PLAN 1.1 jsou jen v Hlubších síních, a čas jako odhad patra (PLAYTEST.md, kap. 9.1, odhad kurikulisty: základ II 40 až 50 minut, Hlubší síně II hodina až hodina a půl).
- Stejnou tabulku dát do README (README.md:81-97).
- Výstupy RVP až s ověřeným zněním od autora (PLAN.md:873).

**Závislosti:** D3 před D4. D1 před D2 (deska po velké bráně). D5 po C8 (kvíz II-8 v listu Hlubších síní) a C9. D6 podle R4 a po C8, protože kvízy jsou součástí bloku.

**Ověření:**
- `npm test` (progressFile, migrate, classOverview).
- Prohlížeč v učitelském režimu: projít IV-7 a IV-15, mapu po I-7 a po I-15, přehled třídy se dvěma vzorovými soubory, náhled tisku listu a Shrnutí patra.
- Playtest: přehled třídy po skutečné hodině (zvýrazní rozehranou komnatu?).

### Balík E: čtečka, dotyk a telefon

**Cíl:** hráč se čtečkou obrazovky slyší totéž, co vidící hráč vidí, nic navíc a nic méně. Desky jdou ovládat na podporovaném zařízení. RECENZE 4.6 a 4.15, kap. 6, bod 6.

**E1 Jedno číslování krystalů pro čtečku (V)**: M. II-1, II-6, II-7, II-9, II-11, II-13 až II-15, Oltář, Nápis, Maska. H-II-15. Převzato: „Zprava, s váhou, když je známá“.
- Jedna funkce pro popis krystalu v src/game/text.ts. Použít v Tide.svelte:61-62, Cascade.svelte:256-268, cascadeEvents.ts:17-22, Altar.svelte:47, altarEvents.ts:23, src/ui/screens/level/inscriptionEvents.ts:25 a src/ui/screens/level/maskEvents.ts:14.
- Váhu říkat jen tam, kde ji hra už ukázala. Oltář to dnes řeší přes known.

**E2 Čtečka v patře I: vzory, glyfy, přechod části (V)**: S. I-1, I-2, I-13 až I-15. H-I-03, D-I-23, H-I-19.
- U vzorů hlásit „Přijato. Stěna ukazuje: …“ slovy, bez čísla (altarEvents.ts:80-84).
- Kotouč a kolo s glyfy hlásí i svítící strany v pořadí horní 8, pravá 4, dolní 2, levá 1 (src/ui/inscription/Dial.svelte:65, src/ui/Disc.svelte:65).
- Při přechodu části hlásit zadání podle první úlohy (Level.svelte:360), stejně jako taskText v Inscription.svelte:33.

**E3 Čtečka v Zahradě**: M. Brána a Deska v patře III, III-13. H-III-21, H-III-26.
- gateWrongWords vyjmenuje nejvýš dva nesedící řádky (stepWords.ts:77-83). Nesedící řádky dostanou popisek „nesedí“ (src/ui/gate/Gate.svelte:105).
- Deska ohlásí výběr řádku i stav lampy a řádky v režimu poznávání budou v pořadí tabulátoru (src/ui/gate/Desk.svelte:51-59, 114-119, 139).
- Popisky řad v Tajné řeči skládat z topLabel a bottomLabel (src/ui/gate/Mask.svelte:58, 84).

**E4 Čtečka v Dílně a „Kliknutím“**: M. IV-5, IV-6, IV-7, IV-13, IV-14 a popisky kamenů v patře III. H-IV-14, H-IV-20, zbytek H-I-23.
- Ukázka kroku jmenuje místo, ne jen „zvýrazněný“ (machineGame.svelte.ts:104-105, seatWords v machineWords.ts:57-68). U cílů a zkoumání nahradí STEP_HINT věta podle hintTarget (act4.ts:46, 99). Zvýrazněný prvek dostane v aria-label „, ukázka kroku“ (MachineBoard.svelte:286-289, 315-317, 357-359).
- Lampa výhybky se přejmenuje na „Q“ (machines.ts:230), aby čtečka nehlásila „lampa lampa“. Přidat test.
- „Kliknutím“ nahradit „Dotykem“ (src/ui/gate/Board.svelte:135, 192, MachineBoard.svelte:254, 259). Pak je pohlídá společný test textů z C1.

**E5 Kámen se šesti runami jde i zpět**: M. III-14 a každý kámen s nabídkou run. H-III-22.
- Nová prevRune vedle nextRune (src/core/puzzles/gate.ts:193-199) pro klávesnici. Pro dotyk nabídka run jako při výběru na Desce (Desk.svelte:154-171).
- Udělat bez ohledu na R1 (III-14 v balíku F).

**E6 Zadání bez „vpravo“ a „vlevo“**: S. III-1, III-6, III-7, III-11, III-13, III-14. H-III-12.
- Místo směru jmenovat panel: „podle panelu Brána žádá“, „Klíč je v panelu Klíč“ (act3.ts:97, 111, 361, 428, 458, 701, 806, 846, Desk.svelte:101). Test v recenzeIII.test.ts.

**E7 Telefon: zkouška na přístroji a úpravy (V)**: L. I-10, I-12, I-15, II-4, II-10, II-12, Zahrada, Dílna. H-I-20, H-II-16, H-II-24, H-III-11, H-IV-21, příprava V (telefon). Podle R5. Převzato: „Ověřit, pak opravit“ (oktáva), „Užší sloupce“ (Zahrada), „Rozestavit kameny“ (Dílna).
- Hned, bez rozhodnutí: dotyková plocha krystalu přenosu a vypínače kopie zvětšená na 44 × 44 px (src/ui/cascade/Spark.svelte:44-45, pseudoelement ::before).
- Autor projde hru na skutečném telefonu podle seznamu z RECENZE 4.15 (rozměry v recenzi jsou spočítané z CSS). Náhled v prohlížeči slouží jen předběžně. Potom podle R5:
  - Kaskáda: pod 400 px schovat sloupec hodnot, buňky nezmenšovat pod 44 px (Cascade.svelte:87, 641);
  - Zahrada: užší rozteč sloupců místo zmenšení celé desky (src/ui/gate/Board.svelte:54, 69, 120, 144);
  - Dílna: točité kameny u dvouvstupových kamenů rozestavit do cik-caku (MachineBoard.svelte:72, 117-120, 189, 656-688);
  - oktáva: jen když se omyl potvrdí (src/ui/CrystalRow.svelte:85-95).
- Rozměrová pravidla zapsat do PLAN (dotykový cíl aspoň 44 px, šířka podle R5; PLAN.md:673, 989-993). Podle nich vzniknou desky patra V.

**Závislosti:** E1 podle dohody v C1. E2 po A2. E4 po A3 a A4. E7 podle R5 a po zkoušce na přístroji, nejlépe při playtestu po 0.4.6.

**Ověření:**
- `npm test` (hlášení v recenzeI až IV, nový test lampy výhybky).
- Prohlížeč: náhled na šířku 360 a 375 px (II-10, III-6, IV-7 Cesty, IV-13), na výšku i na šířku.
- Autor: projít I-13, III-7 a IV-6 se čtečkou obrazovky (NVDA nebo Předčítání ve Windows) a hru na skutečném telefonu.

### Balík F: mechaniky komnat (R1: všechny mechaniky)

**Cíl:** komnaty, ve kterých hráč nic nerozhoduje, dostanou rozhodnutí a aha se zažije, ne jen řekne. RECENZE 4.16, kap. 6, bod 12. Autor zvolil všechny mechaniky, balík tedy obsahuje F1 až F5.

**F1 I-3: deska roste**: M. I-3. D-I-07.
- Nová vlastnost presentation v types.ts: deska kreslí jen nalezené kombinace, bez prázdných výklenků (Altar.svelte:94-117).
- aria-label desky a hlášení (altarEvents.ts:48) budou bez „z 8“, repliky found (act1.ts:118) bez počtu.
- Osm ukáže až rozdělená deska a replika complete (act1.ts:120).

**F2 II-11: Potvrdit místo samopřijetí**: M. II-11. D-II-22, H-II-05.
- Volitelné confirm v TideConfig (src/core/puzzles/tide.ts:19-25): pull() úlohu při shodě neuzavře a Tide.svelte ukáže tlačítko Potvrdit.
- Přestřelení jde vrátit tlačítkem Zpět, tahy se dál počítají.
- Hláška po chybném potvrzení řekne, kolik posunů dělitel chce. Soubory: tideEvents.ts, act2.ts, tide.test.ts.

**F3 III-14: deska cíle až po první Zkoušce**: M. III-14. D-III-07. Recenzenti se tu rozcházejí (RECENZE 4.16): kritik oceňuje, že je zjednodušení vidět.
- Příznak veilTarget v GateTask pro úlohy ze shorter() (generators3.ts:246-255). Panel Brána žádá ukazuje „?“ až do první Zkoušky (Gate.svelte:95-111).
- Nápověda 1 bude mluvit o starém obvodu (act3.ts:846).

**F4 III-12 a III-13: maska a klíč platí obecně (V)**: M. III-12, III-13. K-III-18, D-III-10 (pointa).
- III-12: za první úlohu druhý nápis se stejnou maskou (carry: true, ideal 0x0f), v genIII12 (generators3.ts:281-311) i v pevné podobě (act3.ts:744-751). Posunout indexy replik kroku (act3.ts:769).
- III-13: úlohy s klíčem other a carry rozšifrují zbytek druhé zprávy (generators3.ts:333-347). Druhou zprávu ukázat zvlášť (Mask.svelte:27-33).
- Druhá zpráva je **EXIL** (rozhodl autor): klíč nalezený z písmene E rozšifruje i X, I a L. Na Tajnou řeč naváže V-2 (PLAN.md:441) a slovo může patro V rozvést.

**F5 Velké mechaniky (R1):**
- II-13: tip počtu jedniček před první zkouškou (D-II-29, H-II-09), M. Nový krok předpovědi v Přílivu: TideConfig, Tide.svelte, tideGame.svelte.ts.
- I-15 těžší velká brána a I-12 se zvratem (H-I-15, H-I-27), L.
- IV-15 losuje i stavbu počítadla (H-IV-12), M až L.
- Volič v IV-15 s kódem součet (K-IV-05, větší varianta), L.

**Závislosti:** po balících A a B. Test A0 musí pokrýt nové toky. F2 navazuje na úpravu ukázky v Přílivu z A4.

**Ověření:**
- `npm test` (tide.test.ts, recenzeI.test.ts, recenzeIII.test.ts).
- Prohlížeč: I-3, II-11, III-14, III-12 a III-13.
- Playtest: přijde aha v III-13 a III-14 (Ema, Vojta)? Neprodloužily se komnaty?

---

## 3. Rozhodnutí

### 3.1 Rozhodnutí autora (20. 11. 2026)

| | Rozhodnutí |
|---|---|
| R1 mechaniky | Všechny mechaniky (F1 až F5) |
| R2 ukázka kroku | Jeden krok na stisk ve všech archetypech |
| R3 zkouška zasvěcení | Až s patrem V |
| R4 učitel | Karta patra bez RVP |
| R5 zařízení | Telefon na šířku a tablet: desky do šířky 640 px, na výšku hra vyzve k otočení |
| R6 nápověda 2 v patře IV | Princip a otázka |
| R7 značky | Školní · a : v Kodexu, kvízech a zápisníku, páky a kolo zůstanou ×2 a ÷2 |
| Druhá zpráva v III-13 | EXIL |

Možnosti, ze kterých autor vybíral, a zdůvodnění:

**R1 Mají se v této etapě měnit i mechaniky komnat, nebo jen nápovědy, texty a odezva?** Ovlivní balík F a test A0.
- *Levné mechaniky teď* (doporučeno): F1 až F4. Všechny stojí na hotových prvcích (vlastnost presentation, carry, závoj).
- *Jen texty a odezva*: balík F odpadne a mechaniky přijdou až po patru V (RECENZE kap. 6, bod 12). Aha v II-11, III-13 a III-14 zůstane jen sdělením.
- *Všechny mechaniky*: navíc F5 (tip v II-13, těžší velké brány, součet ve voliči). Etapa se prodlouží o několik položek L.
- Proč: recenze chce mechaniky měnit až po opravách textů, generátorů a ukázky kroku, a ty přinesou balíky A až C. F4 připraví navázání V-2 na Tajnou řeč. Předpovědi potřebují nový prvek rozhraní a velké brány jsou nepovinné.

**R2 Má ukázka kroku dát po každém stisku jen jeden krok, stejně ve všech archetypech?** Ovlivní A1, A3, A7 a D4.
- *Jeden krok na stisk* (doporučeno): po provedeném kroku se stupeň vrátí na 2, v Dílně, v Bráně i v Tichém kroku po nalezené kombinaci. Průměr ukázek v přehledu třídy vzroste.
- *Průběžně do konce*: Dílna vede dál až do konce stavby, jen přibude důvod u točitých kamenů. V Tichém kroku stupeň vydrží do konce.
- *Jeden krok jen v branách*: v komnatách průběžně, v IV-7 a IV-15 jeden krok, aby zkouška navíc měla smysl.
- Proč: dnes jedna žádost v Dílně postaví celý stroj, zatímco Tichý krok stojí 45 stisků. RECENZE kap. 6, bod 2 chce archetypy sjednotit a stejné pravidlo pak převezmou archetypy patra V.

**R3 Má zkouška zasvěcení (test na začátku a na konci hry) vzniknout už v této etapě?** Ovlivní D2, D3, D4 a přípravu patra V.
- *Až s patrem V* (doporučeno): etapa připraví generátory Hlubiny (C9) a místo na závěrečné kartě (D2). Test se sekcemi I až V přijde s Archivem.
- *Teď, sekce I až IV*: volitelný test před I-0 a po IV-7 z generátorů, výsledek po sekcích v souboru s postupem a v přehledu třídy. Sekce V přibude později. Etapa se prodlouží asi o M.
- *Jen papírový test*: tištěný list s klíčem sestavený z pracovních listů, nic se neukládá.
- Proč: PLAN plánuje pilot s celou třídou a testem před a po až ve fázi 5, kdy bude hra celá (PLAN.md:870-871). Pokud ale třída začne hrát dřív než s patrem V, je potřeba zvolit „Teď“: vstupní test se dodatečně udělat nedá.

**R4 Kolik učitelských podkladů má etapa přidat nad opravu přehledu třídy a pracovního listu?** Ovlivní D6 a README.
- *Karta patra bez RVP* (doporučeno): data u komnat (pojem, zápis, kvíz), blok ve Shrnutí patra v učitelském režimu a tabulka v README. Čas jako odhad za patro. Šablona poslouží patru V.
- *Jen list a přehled*: D4 a D5. Karta přijde až po patru V, pro všech pět pater najednou.
- *Karta i s RVP*: navíc očekávané výstupy RVP. Potřebuje ověřené znění od autora.
- Proč: když data u komnat vzniknou teď, komnaty patra V je dostanou od začátku. Didaktik řadí výstupy pro učitele „hned“ (RECENZE 4.7). RVP repozitář necituje a vazby kurikulisty jsou jen návrh k ověření.

**R5 Jaké nejmenší zařízení má hra podporovat?** Ovlivní E7 a desky patra V.
- *Telefon na šířku a tablet* (doporučeno): desky se navrhují pro šířku 640 px a na výšku hra vyzve k otočení.
- *Telefon na výšku*: všechny desky se vejdou do 360 px. Nejvíc práce, hlavně v Dílně.
- *Počítač a tablet*: telefon se oficiálně nepodporuje a E7 se zúží na dotykové cíle.
- Proč: podle výpočtu z CSS se na šířce 375 px posouvá 30 z 34 desek patra IV a do 360 px by šly jen s velkým přepracováním. Šířka 640 px pokryje telefon na šířku i tablet. Rozhodnutí zároveň určí rozměry mozaiky 8 × 8 a knihy znaků v Archivu.

**R6 Jak konkrétní má být nápověda 2 ve stavbách patra IV?** Ovlivní A7.
- *Princip a otázka* (doporučeno): nápověda 2 se přepíše v sedmi komnatách. Celé zapojení dá až ukázka kroku.
- *Návod, brány přísněji*: texty zůstanou, v IV-7 a IV-15 přidá zkoušku navíc už nápověda 2.
- *Nechat návod*: nápověda 2 jako slovní návod je záměr pro slabší žáky.
- Proč: dnes nápověda 2 řekne celé zapojení a ukázka kroku už nic nepřidá. Ve velké bráně IV-15 tak jde řešení získat bez ztráty pečeti i bez zkoušky navíc. S jedním krokem na stisk (R2) dostane slabší hráč zapojení po krocích.

**R7 Jaké značky má hra používat pro dělení a násobení?** Ovlivní C1 a texty patra V.
- *Školní zápis, páky beze změny* (doporučeno): v Kodexu, kvízech a zápisníku Kaskády · a :, páky a kolo zůstanou ×2 a ÷2.
- *Všude · a :*: i páky a kolo (:2, ·2). Nejvíc po česku, na pákách hůř čitelné.
- *Všude × a ÷*: jednotné s pákami, ale proti českým školním zvyklostem.
- Proč: Kodex, kvízy a zápisník jdou do tisku a mají odpovídat škole. Páky jsou lumenitské ovládání a ×2 a ÷2 se na nich čtou nejlépe. Slovníček pak převezmou texty patra V.

### 3.2 Převzatá doporučení (platí, dokud autor neřekne jinak)

| Nález | Převzatá možnost | Položka |
|---|---|---|
| H-I-06 překlep v Tichém kroku | Zpět po přerušení | A1 |
| D-I-09 živý součet v I-8 a I-9 | Součet mizí | B5 |
| D-I-02 (část I-10) | Ano, jen I-10 | B4 |
| D-I-28 třetí nápovědy | Smazat a hlídat testem | A8 |
| H-I-20 oktáva na telefonu | Ověřit, pak opravit | E7 |
| H-I-27, H-I-15 Hlubší síně I | Těžší velká brána a zvrat v I-12 (R1) | F5 |
| K-II-04 přetečení se znaménkem | Kodex a kvíz | C2 |
| D-II-32 kvíz II-15 | Kvíz s dělením a doplňkem | C8 |
| D-II-06 opakované potvrzení v Kaskádě | Nejdřív otázka, pak pokyn | B1 |
| H-II-12 tah +1 z jedničky v II-9 | Replika Echa | A6 |
| H-II-10 let světel v branách | Až po Potvrdit | B6 |
| H-II-15 číslování krystalů | Zprava, s váhou, když je známá | C1, E1 |
| D-II-01 Strážce do II | Otázka na váhu souseda | C9 |
| K-II-15 pracovní list | Přepínač na listu | D5 |
| K-III-09 symbolický zápis | Dvě otázky se zápisem | C8 |
| H-III-15 Prapečeť v III-15 | Vždy Rozcestí | B7 |
| H-III-11 Zahrada na úzkém displeji | Užší sloupce | E7 |
| D-III-09 III-6 | Nechat po 0.4.3, ověřit v playtestu | kap. 5 |
| D-III-16 Desku znám | Jen III-2 až III-4 | B6 |
| D-IV-06 zkouška paměti | Tlačítko Od tmy | B3 |
| K-IV-11, H-IV-09 konec prototypu | Závěrečná karta hned | D2 |
| H-IV-06 značky v Dílně | Značky místo číslic | C5 |
| K-IV-13 moderní jména | Oba názvy v textech | C4 |
| K-IV-05 ALU | Jen věta v Echu a Kodexu | C6 |
| H-IV-21 Dílna na telefonu | Rozestavit kameny | E7 |
| H-IV-12 los v IV-15 | Losovat i stavbu počítadla (R1) | F5 |
| K-IV-19 titulek IV-10 | Řada ozvěn | C4 |
| D-I-07, D-II-22, D-III-07, K-III-18 | Deska roste, Potvrdit, Deska cíle až po Zkoušce, Obě komnaty | F1 až F4 |

### 3.3 Rozhodnutí, která počkají na přípravu patra V

Tyhle otázky tuhle etapu neblokují, ale před stavbou prvních komnat Archivu je potřeba je rozhodnout:
- **Finále v datech:** doporučeno vlastní patro F-0.
- **Kodex pro pojmy ze síní i z Archivu:** doporučen jeden společný záznam.
- **Jméno paritních krystalů:** doporučeno vlastní slovo pro Archiv, aby nevznikla srážka se Strážcem shody a Strážcem schodů.
- **Číslování míst ve V-9:** doporučeno zprava, jako váhy.
- **Paměť pro hráče základní cesty:** doporučeno na začátku Finále.
- **Archetypy Archivu:** doporučeny varianty Nápisu tam, kde to jde.
- **Zkratka Glyfy znám:** doporučeno ano, po přeložené Řeči glyfů.
- **Délka hry:** doporučeno přiznat 5 až 7 hodin.

---

## 4. Odhad rozsahu a verze

| Balík | Položky | S | M | L | Verze |
|---|---|---|---|---|---|
| A ukázka kroku a nápovědy | A0 až A8 | 1 | 8 | 0 | 0.4.4 |
| B odezva, opory, generátory | B1 až B7 | 2 | 5 | 0 | 0.4.4 |
| C kvízy, Kodex, slovník | C1 až C9 | 0 | 6 | 3 | 0.4.5 |
| D učitel, tok hry, konec | D1 až D6 | 0 | 5 | 1 | 0.4.6 |
| E čtečka, dotyk, telefon | E1 až E7 | 2 | 4 | 1 | 0.4.6 (E7 po playtestu v 0.4.7) |
| F mechaniky (R1: všechny) | F1 až F5 | 0 | 5 | 3 | 0.4.7 (F1 až F4), 0.4.8 (F5) |
| **Celkem** | 46 | 5 | 33 | 8 | |

Etapa je větší než 0.4.3. Ta opravovala hlavně jednořádkové chyby (S), tady převažují M. Nejvíc práce je v C6 až C8 (obsah kvízů a Kodexu), D6 a E7. Rozsah zvětšuje volba všech mechanik (F5 přidá tři položky L), zmenšuje ho zkouška zasvěcení až s patrem V a telefon jen na šířku.

**Návrh verzí:**
- **0.4.4 alpha:** balíky A a B. Pomoc a odezva, nejvíc položek s vysokou hodnotou.
- **0.4.5 alpha:** balík C. Slovníček, společný test textů, Kodex a kvízy.
- **0.4.6 alpha:** balík D a E1 až E6. Formát postupu dostane jen volitelná pole a LAYOUT zůstane 5. **Po vydání playtest se studenty** (PLAN kap. 17, bod 8, sledovat podle PLAYTEST.md, kap. 7) a zkouška na telefonu.
- **0.4.7 alpha:** F1 až F4, E7 a opravy z playtestu.
- **0.4.8 alpha:** F5, velké mechaniky: tip v II-13, těžší velká brána I-15 a zvrat v I-12, los stavby v IV-15, součet ve voliči IV-15.
- Potom příprava patra V (kap. 1, „Co do etapy nepatří“, a kap. 3.3) a **0.5.0** jako vydání s Archivem Hlasů a LAYOUT 6. Nové patro tak dostane novou vedlejší verzi.

**Jádro etapy pro případ zkrácení:** pokud bude potřeba etapu zkrátit, bez těchto položek nezačínat přípravu patra V, protože na nich patro V přímo staví (označené V): A0, A2, A8, B6 (příznak), C1, C4 (parita), C6, C7 (pravidlo why), C9, D2, D3, E1.

**Na konci etapy** označit bod 19 v PLAN kap. 17 jako hotový. Slovníček v kap. 2.3 přibude už v C1.

---

## 5. Co z recenze vědomě necháváme

- **Tip zbytku a páka ×2 v II-11** (varianty D-II-22): Potvrdit (F2) dává rozhodnutí levněji. Tip by potřeboval kotouč v Přílivu.
- **Rozdělení III-6** (D-III-09): po 0.4.3 je to podle PLAYTEST.md (kap. 9.1) zvládnutelná komnata a tabulky bez lampy procvičí závoj v III-5 (B5). Sledovat v playtestu čas a ukázky kroku.
- **Křivka obtížnosti Zahrady III-0 až III-5 a osm stejných rozhodnutí rozdělovače v IV-6 a IV-7** (RECENZE 4.16): názor kritika bez konkrétního návrhu v podkladech. Ověřit v playtestu.
- **Oktáva na telefonu** (H-I-20): oprava jen při potvrzeném omylu (E7). Zalomení je ověřené, omyl hráče je domněnka.
- **Mapování na RVP** (K-I-12, K-II-23, K-III-21): kódy výstupů nejsou ověřené a repozitář RVP necituje. Doplní se, až autor dodá platné znění (PLAN.md:873).
- **Pole last (naposledy otevřená komnata)** v souboru s postupem: K-I-06 vyřešila verze 0.4.3 sloupcem „Další na základní cestě“, takže pole není potřeba.
- **Nečitelná slova v I-0** (H-I-22): přeloží je až V-7. Popisek „Zatím nečitelné“ do té doby platí a patří to do přípravy patra V.
- **Zkratka do brány** (RECENZE 4.1, kap. 5, poslední bod): autor ji zrušil. Glyfy znám ve V-1 je jiný případ (přeskočí jen přeložený pojem) a řeší ho příprava patra V.
- **Zkouška zasvěcení:** až s patrem V (R3).
- **Duplicitní nálezy, které opravila verze 0.4.3** (seznamy „dropped“ v inventuře, např. K-II-01, H-III-13, D-IV-04): neplánují se.
- **Střepy, Cvičná komnata, Denní věštba** (PLAN 2.5): nejsou opravou ani předpokladem patra V. Střepy osnova V vypustila (PLAN.md:473).
