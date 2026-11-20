# Didaktik · patro IV

Prošel jsem obsah (act4.ts, machines.ts, generators4.ts, kvízy, Kodex), logiku Dílny (core/puzzles/machine.ts), hlášky (machineEvents.ts, machineWords.ts) a plochu (Workshop.svelte, MachineBoard.svelte). Skriptem jsem ověřil (sim/didaktik-IV): počet řešení všech staveb, typické chyby a hlášky po nich, průchod ukázkou kroku, pořadí replik Echa v cílech a všech 12 kombinací kvízu qCounter a 25 kombinací qChainSum.

## Komnaty
- **Strážce schodů (před IV):** Tři otázky: runa podle zákona, řádky desky pro 3–5 vstupů, čtení nápisu z patra I. Typické chyby mají vlastní vysvětlení. Chybí ale opakování dvojkového sčítání, na kterém stojí IV-1 až IV-3 a kvíz brány (D-IV-19).
- **IV-0 Stroj, který počítá:** Dobrý objev před výkladem. Echo se ptá „Co asi dělá?“ a odpověď vyplyne ze čtyř kombinací. Odečet „lampy“ už nic neprozradí.
- **IV-1 Poloviční sčítačka:** Past s Rozcestím a kvíz, který se na ni ptá, fungují (Rozcestí padne jen v řádku 1 1). Hláška k té chybě má ale chybnou shodu „v 1 řádku… podle nich“ (D-IV-15). Kvízy jdou uhodnout podle délky odpovědi (D-IV-07).
- **IV-2 Úplná sčítačka:** Zkoumání osmi kombinací je dobře postavené. Stavba má dvě řešení (Rozcestí i Výluka v posledním kameni). Echo i Kodex přitom jmenují jen Rozcestí (D-IV-04).
- **IV-3 Řetěz sčítaček:** Lešení je dobré: jeden točitý kámen, pak čtyři s volbou z kterékoli sčítačky, nakonec +1. Nápověda 2 ale říká „do nejlehčího sloupce nic nepřitéká“, přitom stín se musí nastavit (D-IV-14).
- **IV-4 Porovnávač:** Úvodní zkoumání Rovnosti navazuje na III-6. Ve druhé úloze („různé“) vedou nápovědy 1 a 2 k řešení první úlohy (D-IV-03). Kvíz opakuje otázku z IV-3 (D-IV-21).
- **IV-5 Výhybka:** Nejsilnější formát patra: cíle a Echo, které hned pojmenuje, co hráč viděl. Jen replika po 3. cíli předem odpoví na otázku 4. cíle (D-IV-18). Kvíz má dva nesmyslné distraktory.
- **IV-6 Rozdělovač:** Dobré odebírání lešení: nejdřív 4 točité kameny (lampy 0 a 3), pak všech 8. Ukázka kroku tu ale provede celou stavbu bez jediného důvodu (D-IV-05).
- **IV-7 Brána Hlubiny:** Losování (pořadí lamp, obrácená výhybka, „stejné/různé“, +1) brání opisování. Kvíz qChainSum má dobré typické chyby. V zadání druhé zkoušky je „(a vlož runu)“ jen pro jednu ze dvou úloh (D-IV-25).
- **IV-8 Ozvěna:** Cíle odhalí paměť dřív, než ji hra pojmenuje, to je výborné. Tabulka „Zkouška paměti“ (pořadí v čase) se tu objeví poprvé a hra ji nevysvětlí (D-IV-11). Nápověda kvízu odkazuje na špatný cíl (D-IV-10).
- **IV-9 Tep Srdce:** Stavba brány tepu přichází před zkoumáním tepu. Rozdíl mezi krystalem T (úroveň) a tlačítkem Tep (okamžik) hra nepojmenuje (D-IV-24). Replika „Tep a ozvěna převzala…“ se čte jako chybná shoda (D-IV-17).
- **IV-10 Registr:** Z cílů („ulož 5, vstup se mění, paměť drží“) vyplyne pochopení. Posun připomene ×2 z Přílivu a kvíz má věrohodné distraktory (posun doprava, X svítí).
- **IV-11 Počítadlo hvězd:** Hotové počítadlo baví a přetečení navazuje na II-5. Vysvětlení losovaného kvízu je ve 3 z 12 kombinací věcně špatně („po přetečení zbude 6“, přitom k přetečení nedošlo; D-IV-02).
- **IV-12 Odčítačka:** Pěkná syntéza sčítačky a doplňku, jenže doplněk zavádí nepovinná II-13. Hlubší síně se otevírají po jedné, takže kdo II-13 nehrál, uvízne tady a nedostane se ani k IV-13 až IV-15 (D-IV-01). Nápověda 2 ve druhé úloze vede ke špatnému přenosu (D-IV-03).
- **IV-13 Volič operace:** Hned první úloha je ta nejtěžší (přehozené voliče, 4 × 4 runy), výhybka je poprvé zabalená do kamene a její kolíky A a B se pletou s krystaly A a B (D-IV-12, D-IV-13). Kvíz zkouší zapamatování libovolného přiřazení kódů. Pravidlo, na které nápověda kvízu odkazuje, přitom během kvízu není vidět (D-IV-08).
- **IV-14 Násobička:** Poznámky „A₂ × B₁“ pod Pouty pomáhají. Používají ale jiné indexy než Kodex (D-IV-09). Úvod a nápověda 1 odkazují na nepovinnou II-10. Kvíz (tříbitová čísla → 9 Pout) je dobrý přenos.
- **IV-15 Velká brána Hlubiny:** Počítadlo s chodem je skutečná syntéza (paměť, sčítačka, Pouta). V zadání je ale zájmeno „ho“ bez jasného předmětu (D-IV-16). Kvíz „Který stroj potřebuje tep?“ jde projít vylučováním.

## Nálezy

### D-IV-01 · IV-12, IV-14 · didaktika · vysoká · jistá
**Hlubší síně IV stojí na nepovinných Hlubších síních II**
Popis: IV-12 je celá postavená na doplňku z II-13 (Hlubší síň II). Odkazuje na něj nápověda 1, úvod Echa, pravidlo úlohy („jako v Doplňku (−1 je 7)“) i nápověda kvízu („Jak se v Doplňku zapsalo záporné číslo?“). Myšlenka „převrácené B + 1“ se v IV-12 nikde neodvodí. Hlubší síně IV se přitom otevírají po bráně IV-7 a pak po jedné, bez ohledu na II-13. Kdo Hlubší síně v I až III vynechal (podle PLAYTEST 8.3.4 většina třídy), uvízne v IV-12 a nedostane se ani k IV-13, IV-14 a IV-15. Slabší verze téhož je IV-14: úvod („V Síni Počtářů se násobilo kopiemi…“) a nápověda 1 („jako v Násobení po lumenitsku“) odkazují na nepovinnou II-10. Druhá úloha IV-12 navíc stojí na Výluce jako „obraceči na povel“, který zavádějí nepovinné Masky a Tajná řeč (III-12, III-13).
Doklad: act4.ts:867, 872, 874, 889, 895; generators4.ts:99 (pravidlo „jako v Doplňku“); act4.ts:951, 956; progress.svelte.ts:178–183 (Hlubší síně se otevírají jen po bráně patra a předchozí síni, jiné patro se nekontroluje); mapa.md: II-10 a II-13 jsou Hlubší síně.
Návrh: Dát do IV-12 krátkou úvodní úlohu, která doplněk objeví přímo na stroji: hotový stroj s převráceným B a jedničkou v přenosu a cíle „nastav 5 − 3, přečti výsledek“. Echo pak řekne „převrátit a přidat jedničku = odečíst“. Odkazy „jako v Doplňku“ psát jen jako připomínku pro ty, kdo II-13 hráli. V IV-14 stačí jedna věta v úvodu: „Každé Pouto je kopie: jeden krystal A krát jeden krystal B.“

### D-IV-02 · IV-11 · chyba · střední · jistá
**Vysvětlení kvízu Počítadla tvrdí přetečení, i když k němu nedošlo**
Popis: qCounter losuje start 4–7 a 2–4 tepy. Vysvětlení je napsané napevno pro přetečení: „Po sedmičce přijde 0. {start} + {tepy} = {součet}, tři krystaly ale unesou nejvýš 7, takže po přetečení zbude {konec}.“ Pro kombinace (4, 2), (4, 3) a (5, 2) je součet nejvýš 7 a k přetečení nedojde. Hráč, který správně odpověděl 6, si přečte, že 6 „zbude po přetečení“, a může si odnést, že počítadlo přetéká už před osmičkou. Týká se to 3 z 12 kombinací, tedy asi čtvrtiny hráčů. I nápověda kvízu v těch případech míří k přetečení.
Doklad: generators4.ts:205–226, hlavně 225. Výstup skriptu: „start 4 beats 2: … explain: Po sedmičce přijde 0. 4 + 2 = 6, tři krystaly ale unesou nejvýš 7, takže po přetečení zbude 6.“ Stejně pro 4 + 3 = 7 a 5 + 2 = 7.
Návrh: Losovat jen start + tepy ≥ 8 (start 5–7 a tepy, které přes 7 přejdou), nebo mít dvě podoby vysvětlení: „4 + 2 = 6, do sedmičky se to vejde.“

### D-IV-03 · IV-4, IV-12 · didaktika · střední · jistá
**Ve druhé úloze vedou nápovědy k řešení první úlohy**
Popis: Nápovědy jsou společné pro celou komnatu (část) a po každé úloze se nulují. Ve druhé úloze je hráč dostane znovu od stupně 1, jenže popisují první úlohu. IV-4, úloha „různé“: nápověda 1 se ptá, jestli jsou krystaly „stejné“, nápověda 2 radí Rovnost a Pouto. Kdo ji poslechne, postaví xnor + and a Zkouška padne. IV-12, úloha s M: nápověda 2 říká „Do každé sčítačky má téct převrácené B. Jednička navíc přiteče přenosem do nejlehčího sloupce.“ Kdo nastaví přenos na stálé světlo, padne při sčítání. Správné vysvětlení (Výluka s M, M v přenosu) řekne Echo až po vyřešení (act4.ts:875).
Doklad: act4.ts:307–313, 864–870. Výstup skriptu: „IV-4b dle nápovědy 2 (xnor+and): Stroj se splete u A = 0, B = 0“; „IV-12b dle nápovědy 2 (xor, přenos 1): Stroj se splete u A = 0, B = 0, M stín“.
Návrh: Dovolit nápovědy po úlohách (`hints` u MachineTask, tak jako `say`), nebo psát nápovědy 2 pro obě úlohy: „Stejná čísla: Rovnost v každém sloupci a Pouto. Různá: stačí jeden sloupec, kde se liší.“ V IV-12 třeba: „S M to platí jen při odčítání: co dá Výluka s M, když M svítí, a co, když mlčí?“

### D-IV-04 · IV-2 · didaktika · střední · jistá
**Úplná sčítačka má dvě řešení, hra uzná jen jedno**
Popis: V posledním kameni (přenos) projde Rozcestí i Výluka, protože oba dílčí přenosy (A ∧ B a P ∧ (A ⊻ B)) nikdy nesvítí naráz. Hráč, který tam dá Výluku, projde Zkouškou, a hned nato slyší „Dvě Výluky, dvě Pouta a Rozcestí: úplná sčítačka“. Kodex pak píše jen „AB ∨ P(A ⊻ B)“. Buď ho to zmate (postavil jsem něco jiného, a prošlo to), nebo si myslí, že Výluka a Rozcestí jsou totéž. Přitom je to dobrá příležitost k přemýšlení.
Doklad: act4.ts:61 (s, c2 i c nabízejí [and, or, xor]), act4.ts:166; kodex.ts:510. Výstup řešitele: „task0: … reseni 2: {c: or} a {c: xor}“; skript „IV-2 c=xor: PROJDE“.
Návrh: Buď v kameni c nabízet jen Pouto a Rozcestí, nebo nechat obě a dát Echu repliku pro Výluku: „Výluka tu projde taky. Oba přenosy nikdy nesvítí naráz, a tak se Výluka a Rozcestí neliší.“

### D-IV-05 · patro IV (stavba v Dílně) · didaktika · střední · jistá
**Ukázka kroku provede celou stavbu, u točitých kamenů bez důvodu**
Popis: Po jedné nápovědě 3. stupně zůstává stupeň 3 aktivní až do konce úlohy. Zvýraznění a věta se po každém tahu přesunou na další kámen, dokud není stroj hotový a nezazní „Spusť Zkoušku“. U run věta řekne obecný zákon runy, ne proč patří právě sem. U točitých kamenů řekne jen kam: „aby světlo teklo z kamene 1“. Ve stavbách s mnoha točitými kameny (IV-6 jich má 8, IV-11, IV-12, IV-14) tak jediná žádost postaví celý stroj bez jediného důvodu. PLAYTEST 10.1 slibuje „ukázku kroku s důvodem ve všech archetypech“, Dílna ale důvod pro točité kameny nemá.
Doklad: machineGame.svelte.ts:90–107 (hintTarget a stepHint se počítají znovu po každém tahu), 270–272 (nápověda se nuluje jen po cíli nebo úloze); Level.svelte:202–213 (Echo řekne každou novou větu). Skript, IV-6: „…aby světlo teklo z kamene 1. / …z kamene 2. / …ze vstupu A s váhou 2. / …ze vstupu A s váhou 1. / Stroj je hotový. Spusť Zkoušku.“
Návrh: Ukázka kroku ať ukáže jeden kámen a pak se vrátí na stupeň 2 (další ukázka = další žádost). K točitému kameni přidat důvod z desky: „Lampa 0 chce A₂ ve stínu. Obraceč (kámen 1) z toho stínu udělá světlo.“ Nebo aspoň: „…z kamene 1 (Obraceč na A₂).“

### D-IV-06 · IV-8 až IV-11, IV-15 · didaktika · střední · jistá
**Po chybě ve zkoušce paměti nejde zjistit, co stroj udělal**
Popis: U strojů s pamětí hláška radí „Projdi ten krok vstupy a tepem“. Výsledek k-tého kroku ale závisí na všech předchozích krocích od zhasnuté paměti, takže samotný krok chybu nezopakuje. Paměť na desce přitom nejde vynulovat jinak než tlačítkem Znovu, které smaže celou komnatu, i hotové části. Jádro si navíc pamatuje, co lampy při chybě opravdu ukázaly (Failure.shown), deska to ale nezobrazí. Tabulka ukazuje jen, co se čeká. Chyba tak dostane místo, ne jméno ani obraz. Pro slabšího hráče je to v IV-11 a IV-15 (8 a 5–11 kroků) hádání.
Doklad: machine.ts:142 (shown), 527 (Zkouška začíná od tmy); machineEvents.ts:92–95; Workshop.svelte:220–231 (v řádku jen očekávané lampy). Skript: „IV-15 jedna stále: Zkouška se zastavila ve 4. kroku: lampa 1 nesvítí správně. Projdi ten krok…“ (shown: Q0 = 1).
Návrh: V označeném řádku ukázat vedle očekávaných lamp i skutečné (prázdné a plné tečky). Do Dílny se zkouškou paměti dát tlačítko „Od tmy“, které vynuluje paměť aktuální úlohy. Hlášku přepsat: „Projdi kroky 1 až 4 od zhasnuté paměti.“

### D-IV-07 · patro IV (kvízy) · didaktika · střední · jistá
**Pevné kvízy jdou projít podle délky odpovědi a vylučováním**
Popis: Všechny pevné otázky patra, které mají odpovědi slovy, mají správnou odpověď nejdelší (7 ze 7): IV-1 obě, IV-3 druhá, IV-8, IV-9, IV-12, IV-15. Navíc se opakují výplňové distraktory, které nikdo nezvolí: „bliká“ (IV-5, IV-8, IV-9), „svítí napůl“ (IV-5), „Rozcestí nepustí žádné světlo“ a „Rozcestí bere jen jedno světlo“ (IV-1). V IV-1 Q2 je správná odpověď jediná celá věta mezi třemi číslovkami. Žádná pevná otázka patra nemá `why`, takže chyba dostane jen obecnou nápovědu. Slabšímu čtenáři neprospívá ani nerozlišené „nejvýš 10“ a „Na 11“ (dvojkově) v IV-1 Q2.
Doklad: act4.ts:139–148, 151–155, 267–271, 419–423, 608–612, 697–701, 887–896, 1023–1028. Výstup skriptu: „correct=0 longest=0“ u všech těchto otázek, „why=false“ u všech pevných.
Návrh: Vyrovnat délky odpovědí (zkrátit správnou, prodloužit distraktory). Výplně nahradit typickými omyly: v IV-5 „svítí, protože svítí A“, v IV-9 „svítí, protože svítí D“, v IV-8 „zhasne, protože S zhaslo“. Ke každému typickému omylu dopsat `why`. Dvojková čísla psát s výkladem: „nejvýš 10, tedy dvě“.

### D-IV-08 · IV-13 · didaktika · střední · jistá
**Kvíz Voliče operace zkouší libovolné přiřazení a jeho nápověda ukazuje na skrytý text**
Popis: „Volič má kód O = 2 (10). Která runa teď počítá výsledek?“ Odpověď je libovolné přiřazení kódů této komnaty (Kód 0 = Pouto…), ne pochopení. Nápověda radí „Přečti pravidlo brány“, ale během kvízu Workshop místo panelu s pravidlem ukazuje kvíz a vstupy nejdou přepínat. Formulace „která runa teď počítá“ navíc odporuje Kodexu: ALU „spočítá všechny své operace naráz“ a výhybky jen vyberou výsledek. Kvíz tak podporuje představu, že pracuje jen vybraná runa.
Doklad: act4.ts:926–930; Workshop.svelte:167–170 (kvíz místo panelu s pravidlem, 207–265); kodex.ts:629.
Návrh: Napsat přiřazení přímo do otázky, nebo se ptát na princip: „Krystal O s váhou 2 svítí, s váhou 1 mlčí. Kterou výhybku poslední výhybka pustí?“ Formulovat „Čí výsledek pustí výhybky k lampě?“

### D-IV-09 · IV-4, IV-14 (Kodex, deska) · text · střední · jistá
**Indexy u krystalů jednou znamenají váhu, jindy pořadí**
Popis: Deska i točité kameny píšou váhu jako index: A₂ je krystal s váhou 2, A₁ s váhou 1. Poznámky násobičky z toho staví „A₁ × B₁“ pro nejlehčí kopii. Kodex ale v porovnávači píše „(A₁ ⇔ B₁) ∧ (A₀ ⇔ B₀)“ (A₁ je tu krystal s váhou 2 a A₀, který na desce neexistuje, je krystal s váhou 1). V násobičce píše „Σ (A ∧ Bᵢ) · 2ⁱ“ (B₀ má váhu 1). Hráč, který si zvykl na A₁ = jednička, čte vzorec v Kodexu špatně. V informatice navíc převládá index jako pořadí od nuly.
Doklad: MachineBoard.svelte:160–167, 280; machines.ts:688–691; kodex.ts:532, 641.
Návrh: Sjednotit. Buď všude pořadí od nuly (A₁ A₀ na desce, „A₁ × B₀“), nebo v Kodexu psát váhy: „(A₂ ⇔ B₂) ∧ (A₁ ⇔ B₁)“, „A × B = Σ (A ∧ Bₖ) · k pro váhy k = 1, 2, 4“. Pro sextu je jednodušší pořadí od nuly, ale musí to tak být všude.

### D-IV-10 · IV-8 · chyba · nízká · jistá
**Nápověda kvízu Ozvěny odkazuje na špatný cíl**
Popis: Nápověda „Co se stalo s lampou v prvním cíli, když S zhaslo?“ neodpovídá cílům: první cíl je „Rozsviť lampu Q.“, S se zhasíná až ve druhém („Zhasni S. Svítí lampa dál?“).
Doklad: act4.ts:611 a cíle act4.ts:549–553.
Návrh: „…ve druhém cíli, když S zhaslo?“ nebo „…v Kruhu, když S zhaslo?“

### D-IV-11 · IV-8 · didaktika · nízká · pravděpodobná
**Tabulka zkoušky paměti se čte jinak než deska zákona, a nikdo to neřekne**
Popis: Do IV-8 hráč zná jen desky zákona, kde na pořadí řádků nezáleží. V IV-8 se poprvé objeví „Zkouška paměti“: řádky jsou kroky v čase, začínají od zhasnuté paměti a stejný řádek vstupů (třeba „nic nesvítí“) čeká jednou světlo, jindy stín. Vidět je jen nadpis a sloupec #. Echo ani nápovědy to nevysvětlí.
Doklad: Workshop.svelte:210–233 (vysvětlení je jen v komentáři kódu, ř. 211); act4.ts:594–604.
Návrh: Pod nadpis dát řádek „Kroky jdou po sobě, od zhasnuté paměti“. Do úvodu stavby IV-8 dát repliku: „Zkouška teď jde krok za krokem. Stejné vstupy mohou chtít různou lampu, podle toho, co bylo předtím.“

### D-IV-12 · IV-13, IV-15 · didaktika · nízká · jistá
**Kolíky výhybky A a B se pletou s krystaly A a B**
Popis: Ve Voliči operace mají krystaly operandů jména A a B a každá ze tří zabalených výhybek má kolíky také A, B a V. Nápověda 2 v IV-13 říká „Výhybka pustí horní vstup A, když její volič mlčí, a dolní B…“, což jde číst jako krystaly A a B. Výhybka se tu navíc poprvé objeví jako jeden kámen bez ohlášení. U sčítačky (IV-3) a ozvěny (IV-9) Echo zabalení vždy ohlásí.
Doklad: machine.ts:27 (mux ins A, B, V); machines.ts:632–648; act4.ts:910, 914; MachineBoard.svelte (pinLabels).
Návrh: Kolíky výhybky přejmenovat (třeba „stín“ a „světlo“, nebo ↑ a ↓). Nápověda v IV-15 už píše jen „horní vstup“, tak i v IV-13. Do úvodu přidat: „Výhybka z IV-5 je teď jeden kámen.“

### D-IV-13 · IV-13 · didaktika · nízká · pravděpodobná
**Volič operace začíná nejtěžší podobou**
Popis: První úloha chce osadit 4 kameny po 4 runách s přehozenými voliči (256 možností, cesty se musí číst pozpátku). Druhá, snadnější úloha (runy pevně, jen tři voliče) přijde až po ní. Lešení jde opačně, než by mělo: snadnější úloha by hráče naučila, jak O vede výhybky, a teprve pak by měl přijít přehozený stroj. Pro Emu zůstane výzva i v pořadí snadná → těžká.
Doklad: act4.ts:906 (`aluTask(OPS, 'runes', 'crossed'), aluTask(OPS, 'selectors')`).
Návrh: Prohodit pořadí: nejdřív voliče, pak runy s přehozeným zapojením.

### D-IV-14 · IV-3 · text · nízká · jistá
**„Nic nepřitéká“ místo stínu**
Popis: Nápověda 2 v IV-3: „Do nejlehčího sloupce nic nepřitéká, pokud brána nežádá o jednu víc.“ Ve druhé a třetí úloze je ale u nejlehčí sčítačky točitý kámen, který se musí nastavit na stín. Nenastavený kámen („nic“) Zkouškou neprojde. IV-7 to říká správně: „přitéká stín“.
Doklad: act4.ts:239 vs. 484. Skript: „IV-3b fa0 nenastaven: Některý kámen je prázdný nebo točitý kámen nenastavený.“
Návrh: „Do nejlehčího sloupce přitéká stín, pokud brána nežádá o jedničku víc.“

### D-IV-15 · patro IV (stavba v Dílně) · text · nízká · jistá
**„V 1 řádku desky. Přepni vstupy podle nich“**
Popis: Hláška po Zkoušce u desek do osmi řádků má sloveso napevno v množném čísle. Při jediném chybném řádku vznikne nesoulad, a to právě u nejčastější chyby patra (Rozcestí v IV-1). Čtečka obrazovky to říká vždy, Echo od druhé chyby.
Doklad: machineEvents.ts:100. Skript: „IV-1 Rozcestí: Lampy nesvítí správně v 1 řádku desky. Přepni vstupy podle nich…“
Návrh: Pro k = 1: „…v 1 řádku desky. Nastav vstupy podle něj…“

### D-IV-16 · IV-15 · text · nízká · jistá
**Zájmeno „ho“ bez jasného předmětu**
Popis: Zadání „…aby počítadlo počítalo, dokud svítí chod C. Když C zhasne, má ho tep vynulovat.“ Nejbližší mužský rod je „chod C“, takže „ho“ jde číst jako chod. Stejně v Echu: „Dokud C svítí, počítá. Když zhasne, tep ho vrátí na nulu.“ Porušuje to pravidlo o zájmenech v pokynech.
Doklad: act4.ts:992, 1002.
Návrh: „Když C zhasne, má tep počítadlo vynulovat.“ a „Když C zhasne, tep vrátí počítadlo na nulu.“

### D-IV-17 · IV-9, IV-10 · text · nízká · jistá
**„Tep a ozvěna převzala“**
Popis: Repliky Echa „Tep a ozvěna převzala světlo z D.“ a „Tep a paměť drží dvojku.“ se čtou jako několikanásobný podmět (tep i ozvěna převzaly, tep i paměť drží). V první je pak chybná shoda. Myšleno je „po tepu“.
Doklad: act4.ts:689, 753.
Návrh: „Tep: ozvěna převzala světlo z D.“ a „Po tepu drží paměť dvojku.“

### D-IV-18 · IV-5 · didaktika · nízká · jistá
**Echo odpoví na otázku dřív, než ji hráč vyzkouší**
Popis: Po splnění 3. cíle řekne Echo „A teď na lampu nemá vliv.“ Hned potom přijde 4. cíl „Zhasni A. Svítí lampa pořád?“, tedy otázka, na kterou už zazněla odpověď. Vlastní pozorování ze 4. cíle pak nikdo nekomentuje (pro poslední cíl replika není).
Doklad: act4.ts:376, 395; skript: „cíl 3 splněn → Echo: A teď na lampu nemá vliv.; další cíl: Zhasni A. Svítí lampa pořád?“, „cíl 4 splněn → Echo: (nic)“.
Návrh: Po 3. cíli: „Volič svítí, lampa poslouchá B. A co A?“ Větu „A teď na lampu nemá vliv“ dát do solved části.

### D-IV-19 · Strážce schodů před IV · didaktika · nízká · jistá
**Strážce neopakuje sčítání a slibuje „zákony z minulého patra“**
Popis: Karta říká, že se Strážce zeptá na tři zákony z minulého patra (Zahrada Bran). Třetí otázka (qRead) je ale z patra I. To je záměr podle PLAYTEST 10.2, text to ale neříká. Důležitější je, co chybí: IV-1 až IV-3 a kvíz brány IV-7 stojí na dvojkovém sčítání s přenosem, které se naposledy opakovalo na schodech do III. Otázka o řádcích desky pro runu se 3–5 vstupy přitom v patře IV nic nepřipraví.
Doklad: StairsScreen.svelte:90; act4.ts:1045; quizzes.ts:596–616.
Návrh: qTableRows nahradit qAdd, nebo otázkou „Která runa dá spodní číslici 1 + 1?“. Text karty: „…na tři zákony z minulých pater“.

### D-IV-20 · patro IV (nápovědy) · didaktika · nízká · jistá
**Nápověda 2 často prozradí celé řešení**
Popis: V řadě komnat je nápověda 2 úplný slovní návod, takže stupeň 3 nic nepřidá a stupňování se zúží na „orientace → řešení“. Nápověda 2 navíc pečeť odvahy nebere. Příklady: IV-5 „Horní Pouto potřebuje obrácený volič…, dolní volič přímo. Obě cesty pak spojí Rozcestí.“; IV-8 „Každé Zavřené rozcestí má brát druhé světlo z výstupu té druhé runy.“; IV-9 „Do S má téct D, do R obrácené D.“; IV-10 „Nejlehčí ozvěna bere ze vstupu X, prostřední z nejlehčí, nejtěžší z prostřední.“; podobně IV-11, IV-12, IV-15.
Doklad: act4.ts:408, 597, 645, 766, 846, 868, 996.
Návrh: Nápověda 2 ať dá princip a otázku („Co musí téct do R, aby ozvěna zhasla, když D mlčí?“), konkrétní zapojení až stupeň 3.

### D-IV-21 · IV-3, IV-4 · didaktika · nízká · jistá
**Dvakrát stejná otázka, podruhé s odpovědí v zadání**
Popis: IV-3 se ptá „Kolik úplných sčítaček potřebuje sčítání dvou oktáv?“ (8), IV-4 „Porovnávač dvou oktáv… má v každém sloupci jednu Rovnost. Kolik jich je?“ (8). Druhá otázka má postup v zadání a ověřuje znovu totéž.
Doklad: act4.ts:260–264, 326–330.
Návrh: V IV-4 se ptát na princip: „Dvě oktávy se liší jen v nejlehčím sloupci. Kolik Rovností svítí a co ukáže Pouto?“ (7, mlčí).

### D-IV-22 · IV-1, IV-2 (Kodex) · text · nízká · jistá
**Kodex píše přenos jednou C, jinde P a „přenos“**
Popis: Hra všude značí přenos P (kolík sčítačky, vstup P). Kodex poloviční sčítačky píše „přenos C“ a „CS“, Kodex úplné sčítačky „S = A ⊻ B ⊻ P · přenos = AB ∨ P(A ⊻ B)“ (P je tu vstupní přenos, výstupní je slovo). Zápis součinu „AB“ pro A ∧ B základní cesta nikde nezavádí.
Doklad: kodex.ts:498–499, 509–510; machine.ts:23–25.
Návrh: Psát všude P, vstupní a výstupní přenos odlišit slovy („P zprava“, „P doleva“), konjunkci psát ∧: „(A ∧ B) ∨ (P ∧ (A ⊻ B))“.

### D-IV-23 · IV-6 (Kodex) · didaktika · nízká · pravděpodobná
**Sedmisegmentový displej odporuje definici dekodéru**
Popis: Kodex definuje dekodér jako obvod, ze kterého „svítí právě jeden“ výstup. V odstavci Dnes ale píše, že podle něj „displej kalkulačky… rozsvítí segmenty číslice“, a tam svítí několik segmentů naráz. Žák, který pravidlo „právě jeden“ právě objevil, dostane protipříklad bez vysvětlení.
Doklad: kodex.ts:551, 554.
Návrh: Příklad s displejem vypustit, nebo dopsat: „Dekodér pro displej je složitější: jedno číslo rozsvítí několik segmentů.“

### D-IV-24 · IV-9 · didaktika · nízká · domněnka
**Krystal T a tlačítko Tep se vydávají za totéž**
Popis: Brána tepu (IV-9, část 1) poslouchá D, dokud krystal T svítí (úroveň). Ozvěna s tepem (část 2) převezme D v jediném okamžiku tepu. Echo říká „Brána tepu je teď v jednom kameni: ozvěna s tepem“ a Kodex oba jmenuje „klopný obvod D“. Zkušební posloupnost netestuje změnu D při rozsvíceném T, takže rozdíl ve hře nevyvstane. Ve volné hře ho ale objevit jde (T svítí, D se mění a lampa jde s ním). Pro sextu je to přijatelné zjednodušení, mělo by ale zaznít.
Doklad: act4.ts:637–651, 687; machines.ts:328–335; kodex.ts:582–585.
Návrh: Do solved části IV-9 jednu větu: „Brána tepu poslouchá, dokud T svítí. Ozvěna s tepem jen v okamžiku tepu, a tak je spolehlivější.“

### D-IV-25 · IV-7 · text · nízká · jistá
**„(a vlož runu)“ ve společném zadání**
Popis: Druhá zkouška brány má dvě úlohy (rozdělovač jen s točitými kameny a výhybka s runou) a jedno zadání se závorkou „(a vlož runu)“. V IV-12 se stejný problém vyřešil zadáním pro každou úlohu (PLAYTEST 8.3.7), tady zůstal.
Doklad: act4.ts:496–498; generators4.ts:87–101 (`say` u odčítačky).
Návrh: Dát úlohám `say`, jako má subtractTask: „…natoč točité kameny rozdělovače…“ a „…natoč točité kameny a vlož runu…“.

### D-IV-26 · IV-12 · text · nízká · jistá
**Pravidlo sčítačky-odčítačky mlčí o přetečení**
Popis: Druhá úloha IV-12 má pravidlo „Když M mlčí, lampy ukazují A + B.“ Deska brány ale počítá (A + B) mod 8, takže 7 + 7 má ukázat 6. U odčítání pravidlo přetočení zmiňuje („−1 je 7“), u sčítání ne. Kdo pravidlo čte doslova, nechápe, proč deska u 7 + 7 čeká 6.
Doklad: generators4.ts:100; machines.ts:614.
Návrh: „Když M mlčí, lampy ukazují A + B (co přeteče přes 7, zmizí). Když svítí, A − B.“

### D-IV-27 · IV-14 · text · nízká · jistá
**„Lampa sčítá“ a „přenos z Pout“**
Popis: Nápověda 2: „Lampa s váhou 2 sčítá dvě prostřední Pouta. Přenos z nich a horní Pouto dají váhy 4 a 8.“ Lampa ale nesčítá a přenos nevychází z Pout, nýbrž z poloviční sčítačky. U stroje, kde jde právě o to, kdo co dělá, je to matoucí.
Doklad: act4.ts:952; machines.ts:692–699.
Návrh: „Do lampy s váhou 2 teče součet dvou prostředních Pout ze sčítačky 5. Její přenos sečti s horním Poutem: dá váhy 4 a 8.“

## Patro jako celek
Didakticky je patro postavené velmi dobře. Každá součástka jde cestou zkoumání nebo cílů, pak stavba, pak zabalení do kamene, takže abstrakce vznikne z vlastní zkušenosti. Cíle s Echem (IV-5, IV-8 až IV-11) dávají to, co má objev před výkladem dávat: hráč stav zažije a slovo dostane hned potom. Patro navazuje na dřívější (Kaskáda, ×2 z Přílivu, přetečení, Rovnost z Řetězů) a odečty pod deskou vracejí čtení čísel z patra I.

Slabiny jsou tři. Zaprvé závislosti: Hlubší síně IV se otevírají po jedné a IV-12 (slaběji IV-14) stojí na nepovinných síních II. Pro většinu třídy je IV-12 zeď, za kterou zůstanou IV-13 až IV-15. Zadruhé pomoc po chybě: hlášky Dílny řeknou místo, ne příčinu. U strojů s pamětí ani místo nestačí, protože chybu nejde zopakovat ani vidět, co stroj udělal. Ukázka kroku jedinou žádostí postaví celý stroj, u točitých kamenů bez důvodu. Společné nápovědy vedou ve druhé úloze IV-4 a IV-12 k chybě. Zatřetí kvízy: pevné otázky jdou projít podle délky odpovědi a výplní („bliká“). IV-11 má ve čtvrtině losů nepravdivé vysvětlení, IV-13 zkouší libovolné přiřazení místo principu. Textové drobnosti jsou rychlé opravy. Indexy (váha vs. pořadí) je ale potřeba sjednotit dřív, než na ně naváže další patro.

## Co funguje
- Cíle s Echem jako forma objevu: IV-5 („Volič svítí a lampa teď poslouchá B“), IV-8 („S zhaslo, a lampa svítí dál. Stroj si pamatuje“), IV-10 („Vstup se změnil, paměť drží“).
- Past s Rozcestím v IV-1: chyba padne jen v řádku 1 1 a kvíz se na ni přesně ptá.
- Odebírání lešení: IV-3 (1 → 4 točité kameny, volba z kterékoli sčítačky) a IV-6 (lampy 0 a 3, pak všechny).
- Zabalení do kamene jako téma patra: úplná sčítačka (IV-3) a ozvěna (IV-9) jsou ohlášené a abstrakce dostane jméno z vlastní zkušenosti.
- Losované kvízy qChainSum a qCounter mají typické chyby s vlastním vysvětlením (bez přenosu, Rozcestí po sloupcích, chybějící nejtěžší lampa, přetečení).
- Brány losují podobu zkoušek a po ukázce kroku přidají podobnou úlohu na samostatné zkoušení.
- Každá stavba má jediné řešení (kromě IV-2 a souměrné IV-14), takže deska brány je jednoznačná.
- Vazby na dřívější patra: ×2 z Přílivu (IV-10), přetečení ze Síně (IV-11), Rovnost z Řetězů (IV-4), sloupec Kaskády (IV-2, IV-3).
