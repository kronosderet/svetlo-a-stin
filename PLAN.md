# SVĚTLO & STÍN — plán vývoje didaktické hry

> Název hry: **Světlo & Stín** (rozhodnuto 14. 11. 2026, dřívější pracovní název *Lumen & Umbra*).
> Dokument slouží jako herní design (GDD) i plán vývoje. Verze 0.1 · 14. 11. 2026

---

## 0. Hra v jednom odstavci

Hráč objeví opuštěnou **Observatoř Světla a Stínu**, poslední stavbu zapomenuté civilizace
**Lumenitů**. Ti chápali celý svět jako souhru dvou stavů: **světla** (1) a **stínu** (0).
Postupným oživováním mechanismů, krystalů, bran a strojů observatoře hráč odhaluje jejich vědu,
a aniž by si toho všiml, učí se dvojkovou soustavu, binární aritmetiku, logická hradla, stavbu
obvodů, paměť a kódování informací. Na konci znovu probudí **Srdce observatoře**, malý počítač
postavený z věcí, které sám pochopil. V epilogu zjistí, že tahle „zapomenutá věda“ pohání
každý telefon v jeho kapse.

---

## 1. Vize a cíle

### 1.1 Vzdělávací cíle (co hráč po dohrání umí)

| Oblast | Hráč dokáže… |
|---|---|
| Bit a stav | vysvětlit, co je bit, kolik stavů má *n* bitů (2ⁿ), co je bajt |
| Soustavy | převádět mezi dvojkovou, desítkovou a šestnáctkovou soustavou |
| Aritmetika | sčítat a odčítat ve dvojkové soustavě s přenosem a výpůjčkou, chápat přetečení, posun jako ×2 a ÷2 |
| Logika | používat NOT, AND, OR, XOR, NAND, NOR, číst a sestavit pravdivostní tabulku, chápat De Morganovy zákony |
| Obvody | postavit poloviční a úplnou sčítačku, porovnávač, multiplexor, dekodér |
| Paměť | pochopit zpětnou vazbu, klopný obvod a čítač |
| Kódování | dekódovat ASCII, chápat paritu a opravu chyb, obraz a zvuk jako řady čísel, záporná čísla ve dvojkovém doplňku |
| Abstrakce | skládat složitější součástky z jednodušších a chápat, že i program je jen posloupnost bitů |

### 1.2 Pocit ze hry

- **Úžas z objevování**: „rozluštil jsem jazyk dávné civilizace“, ne „splnil jsem úkol z matiky“.
- **Aha momenty**: pravidla hráč nejdřív sám objeví a až potom dostane jejich jméno.
- **Klid a soustředění**: žádné časové tlaky ani životy. Chyba je jen další pokus.
- **Řemeslná radost**: každý klik má krásnou, okamžitou a zvukovou odezvu.

### 1.3 Cílová skupina

- **Primárně:** studenti **sexty osmiletého gymnázia** (16–17 let, odpovídá 2. ročníku SŠ).
  Nepředpokládáme znalost dvojkové soustavy, ale počítáme s dobrým abstraktním myšlením.
- **Sekundárně:** dospělí zvědavci a učitelé informatiky jako doplněk výuky.
- **Délka:** 1 level = 2–5 minut, Akt I se vejde do jedné vyučovací hodiny (45 min),
  celá hra zhruba 4–6 hodin.

**Co z toho plyne pro design:**
- **Tón je dospělý.** Žádné infantilní maskoty ani přehnané chválení. Echo je záhadné, věcné,
  občas suše vtipné.
- **Svižnější tempo.** Jednoduché principy stačí jednou zažít, opakování je kratší a opory mizí dřív.
- **Formální zápis hned po objevu.** Hned po aha momentu se ukáže moderní notace (`101₂ = 5`)
  a hra se ptá i *proč* (např. „Kolik kombinací má 8 krystalů?“), ne jen *jak*.
- **Hloubka pro rychlejší.** Volitelné výzvy (pečeť přesnosti, skryté střepy, pokročilé levely jako
  Hamming nebo sekvenční logika) drží motivaci i u studentů, kteří látku zčásti znají.
- **Využitelnost ve výuce.** Shrnutí pater odpovídá tématům informatiky v RVP G (reprezentace dat,
  logika, principy počítače).

### 1.4 Pilíře designu

1. **Objev před výkladem.** Nový princip se nejdřív zažije v hádance, teprve pak se pojmenuje.
2. **Jeden nový nápad na level.** Kognitivní zátěž držíme nízko a koncepty přidáváme po jednom.
3. **Mystika v atmosféře, jasnost v hratelnosti.** Ozdobné je pozadí a příběh, herní plocha je vždy čitelná.
4. **Jen myš, nic víc.** Všechno jde udělat jednoduchým klikáním. Přetahování je jen pohodlná zkratka.
5. **Reaktivita.** Každá změna se okamžitě projeví: hodnoty, světlo v obvodech, zvuk.

---

## 2. Svět a příběh

### 2.1 Premisa

Lumenité nepočítali prsty, ale světlem. Jejich města osvětlovaly krystaly, které uměly jen
zářit, nebo mlčet. Z těchto dvou stavů postavili matematiku, právo, hudbu i paměť. Jednoho dne
se jejich **Srdce**, velký stroj v nitru observatoře, zastavilo a civilizace zmizela.
Hráč přichází jako poutník, který observatoř náhodou objeví.

### 2.2 Průvodce: Echo

- Světelný automat, poslední strážce observatoře. Mluví v útržcích.
- **Jeho řeč se postupně „opravuje“:** na začátku jsou v ní nesrozumitelné glyfy, s každým
  pochopeným principem je jí rozumět víc. V Aktu V hráč dekóduje i jeho první, dříve nečitelné věty.
- Echo nikdy nevykládá látku. Klade otázky, naznačuje a raduje se z objevů hráče.

### 2.3 Mechanika „překladu“: od glyfů k modernímu zápisu

Hlavní most mezi fantazií a skutečným světem:

1. Nový pojem se nejdřív objeví v **lumenitské podobě** (krystaly, runy, glyfy).
2. Když ho hráč pochopí (vyřeší klíčový level), **Kodex ho „přeloží“**: vedle glyfu se objeví
   moderní zápis (`1011`, `AND`, `0x2F`) a pojmenování.
3. Od té chvíle hra ukazuje oba zápisy a v pozdějších aktech převažuje ten moderní.

| Lumenitsky | Moderně |
|---|---|
| krystal | bit |
| světlo / stín | 1 / 0 |
| oktáva (osm krystalů) | bajt |
| kombinace krystalů | kombinace bitů |
| předání | přenos (carry) |
| deska zákona | pravdivostní tabulka |
| runa brány | logické hradlo |
| ozvěna | klopný obvod (paměť) |
| čtveřicový glyf | šestnáctková číslice |
| zpěv Srdce | program |

**Čtveřicové glyfy:** lumenitské číslice 0–F jsou čtverce, jejichž čtyři strany buď svítí,
nebo ne. Každá strana je jeden bit. Čtení glyfu je tedy přímo čtení binárního zápisu. Hráč si
toho může všimnout sám už v Aktu I (tajný střep), v Aktu V se to stane hlavním principem.

### 2.4 Struktura světa

Observatoř je vertikální stavba. Každý akt je jedno patro, které se po vyřešení rozsvítí na mapě.

| Akt | Místo | Téma |
|---|---|---|
| I | Předsíň Prvního Světla | bit, kombinace, poziční hodnota, převody |
| II | Síň Počtářů | sčítání, odčítání, přetečení, posuny, násobení |
| III | Zahrada Bran | logická hradla, pravdivostní tabulky, De Morgan, NAND, bitové masky |
| IV | Hlubina Strojů | sčítačky, porovnávač, multiplexor, dekodér, paměť, čítač |
| V | Archiv Hlasů | šestnáctková soustava, ASCII, parita a oprava chyb, obraz a zvuk v bitech |
| ✦ | Srdce Observatoře | finále: mini-ALU a první program |

### 2.5 Vyprávění skrze hru

- **Střepy:** volitelné sběratelské nápisy schované v levelech, zapsané binárně. Přečíst se dají
  až později, protože k tomu je potřeba látka z dalších aktů. Hráč se tak vrací ke starým
  levelům s novým porozuměním.
- **Dveře a mechanismy:** každý vyřešený level fyzicky něco oživí (dveře, výtah, vodní kanál).
  Pokrok je vidět ve světě, nejen v menu.
- **Epilog:** Srdce promluví a ukáže, že Lumenité nezmizeli úplně: jejich věda přežila
  v podobě, kterou dnes nosí každý v kapse. Poslední obrazovka staví vedle sebe glyf a fotku
  skutečného čipu.

### 2.6 Jazyk textů

- Hráče oslovujeme **„ty“** a texty píšeme tak, aby nebyly rodově zatížené (přítomný čas,
  neutrální vazby: *„Brána se otevírá“* místo *„Otevřel jsi bránu“*).
- Krátké věty, maximálně 2 řádky na repliku. Lore je volitelné a čte se v Kodexu, neblokuje hru.

---

## 3. Didaktický rámec

### 3.1 Cyklus každého konceptu

```
ZAŽIJ  →  OBJEV  →  POJMENUJ  →  PROCVIČ  →  POUŽIJ V NOVÉM KONTEXTU
(hra)     (aha)     (Kodex)      (2–3 levely)  (boss, pozdější akty)
```

Příklad, poziční hodnota:
1. *Zažij:* 3 krystaly různé velikosti, oltář chce „světlo o váze 5“.
2. *Objev:* hráč zkouší a zjistí, že velký krystal váží 4, prostřední 2 a malý 1.
3. *Pojmenuj:* Kodex se rozsvítí: „Každý krystal váží dvakrát víc než soused vpravo.“
   Pod tím je moderní zápis `101₂ = 4 + 1 = 5`.
4. *Procvič:* 4 krystaly, potom skryté váhy.
5. *Použij:* v Aktu II při sčítání, v Aktu V při ASCII.

### 3.2 Lešení a jeho odebírání (scaffolding → fading)

Každý level má sadu pomůcek, které se v dalších levelech postupně vypínají:

| Pomůcka | Zap. | Vyp. |
|---|---|---|
| váhy pod krystaly (8 4 2 1) | I-4 | uvnitř I-6: dva nápisy s vahami, třetí už jen s velikostmi krystalů, zbytek holý (v Nastavení jde zapnout „Vždy ukazovat váhy“) |
| živý součet „Tvé světlo váží: 5“ | I-4 | I-7 |
| číslice 0/1 pod krystaly | I-1 (přístupnostní volba) | nikdy nucené |
| počty světel pod sloupci (kolik se jich ve sloupci slévá) | II-0 | uvnitř II-4, po prvním součtu |
| váhy pod krystaly výsledku Kaskády | II-0 | uvnitř II-2, po třech součtech (po objevu dvojice) |
| desítkové hodnoty řádků při počítání pod sebou | II-0 | II-3 (vrací se u nových operací: přetečení, odčítání, násobení) |
| živé světlo ve vodičích | III-1 | nikdy (je to jádro reaktivity) |

Opora nemizí ve stejné chvíli, kdy přichází nový nápad. Odchází uvnitř komnaty po několika úlohách
(`presentation.fade`) a Echo to řekne: v I-6 přibývá čtení i kotouče, v II-4 delší řady, v II-2 váhy zhasnou až po objevu dvojice.

### 3.3 Nápovědy ve třech stupních

1. **Náznak** (Echo): „Který krystal je nejtěžší? Potřebuješ ho?“
2. **Strategie:** „Začni zleva. Rozsviť největší váhu, která se ještě vejde.“
3. **Ukázka kroku:** hra zvýrazní konkrétní krystal nebo spoj, který je potřeba změnit.

Nápověda je vždy dostupná a nic nestojí. Náznaky 1. a 2. stupně neberou nic; pečeť odvahy (viz 3.6)
bere jen ukázka kroku (3. stupeň). Studenti si tak nebojí pomoct obecnou radou.

- **Zkouška navíc v bráně:** když hráč v bráně patra (komnaty 7 a 15) použije ukázku kroku, přibude
  na konec části jedna podobná losovaná úloha (`src/game/extraTask.ts`), nejvýš jedna za část.
  Nápovědy na ní zůstávají, ukázka kroku tak přestane být autopilot, kterým jde bránou projít.
- **Echo se ozve samo:** po dvou chybách v jedné úloze se rozzáří tlačítko Nápověda, po 45 sekundách
  bez jediné akce řekne Echo náznak 1. stupně samo. Slabší hráč nemusí umět o pomoc požádat.

### 3.4 Zpětná vazba na chyby

Chyba nikdy není jen „špatně“. Hra vždy ukáže **proč**:

- Oltář: „Tvé světlo váží **6**, oltář žádá **5**.“ Váhy rozsvícených krystalů se krátce sečtou
  před očima.
- Obvod: test projde všechny kombinace vstupů a zastaví se na prvním řádku tabulky, kde se
  výstup liší. Ten řádek se zvýrazní.
- Sčítání: sloupec s chybou se jemně rozvlní a ukáže přenos, který chybí.
- Nápis: typická chyba čtení má vlastní repliku. Zrcadlové čtení, počet světel místo vah, jediný
  krystal vedle (s jeho váhou) a u dvojznaku prohozené glyfy.

Tón je vždy neutrální až povzbudivý, bez červených křížků a rušivých zvuků.

### 3.5 Opakování a prolínání

- Každý akt znovu používá látku z předchozích (Akt IV staví sčítačku, kterou hráč v Aktu II
  počítal ručně).
- **Losované úlohy:** komnaty na procvičování a zkoušky (I-5 až I-8, I-12 až I-15, II-2 až II-5
  a II-7 až II-15) vylosují příklady při každém vstupu i po „Znovu“, takže se nedají naučit
  nazpaměť ani napovědět sousedovi. Generátory drží stejné podmínky jako ručně vybrané úlohy
  (třeba aspoň jedna výpůjčka v Odlivu, ve Vahách Osudu nikdy cesta přes přetočení) a ukázková
  úloha na začátku nebo závěrečná zkouška, kterou Echo komentuje, zůstává pevná. Objevné komnaty
  mají pevnou posloupnost, protože je součástí výkladu.
- **Cvičná komnata:** procedurálně generované úlohy k jakémukoli odemčenému konceptu,
  s nastavitelnou obtížností. Nekonečné procvičování pro ty, kdo chtějí.
- **Denní věštba:** jedna generovaná hádanka denně z náhodného již probraného tématu.

### 3.6 Mistrovství: tři pečetě za level

1. **Pečeť brány:** level je vyřešen. Jen tato je nutná k postupu.
2. **Pečeť přesnosti:** vyřešeno v optimálním počtu tahů nebo hradel (spočítá validátor)
   a kvíz napoprvé, bez jediné špatné odpovědi.
3. **Pečeť odvahy:** vyřešeno bez ukázky kroku (nápovědy 3. stupně). Náznaky ji neberou.

„Zpět“ vrací krystaly, ne počet tahů: vrácený tah se do pečeti přesnosti počítá dál. Smíšená brána
sčítá tahy, pokusy i nápovědy všech svých částí. Možnosti v kvízech mají pro každého hráče jiné
pořadí a otázky s čísly si čísla losují (`src/content/quizzes.ts`), takže se nedá napovědět
„ta první“ ani „šestnáct“.

Pečetě jsou volitelné. Odemykají kosmetiku (barvy krystalů, motivy) a skryté střepy,
nikdy povinný obsah.

### 3.7 Kodex

Herní encyklopedie, která se plní objevy:

- Každá stránka má **lumenitskou část** (glyf, citát, lore) a **moderní část** (definice,
  zápis, interaktivní mini-příklad, „kde se to používá dnes“).
- Stránky jde kdykoli otevřít i během levelu (boční panel, hra se nezastaví).
- „Shrnutí patra“ (tlačítko na mapě) dá přeložené zákony patra na jednu stránku k tisku, rozdělené
  na základ a Hlubší síně. V učitelském režimu ukáže všechny zákony patra.

### 3.8 Měření učení

- **Zkouška zasvěcení:** volitelný krátký test na začátku (10 úloh) a stejný typ úloh na konci.
  Hráč vidí svůj posun, my vidíme, jestli hra učí.
- Lokální metriky levelů (viz kap. 14) pro ladění obtížnosti. Postup u každé komnaty ukládá, kolikrát
  ji hráč otevřel a dokončil, tahy nad ideál, nápovědy, ukázky kroku a chyby v kvízu.
- **Přehled třídy** (učitelský režim): učitel přetáhne soubory s postupem od studentů a vidí tabulku
  studentů (patra, pečetě, kde kdo je) a komnat (kolik prošlo, kolik se zaseklo, průměr ukázek kroku,
  tahů navíc a chyb v kvízu). Komnaty, kde se zasekla víc než třetina nebo kde v průměru potřebovali
  ukázat krok, jsou zvýrazněné. Nic se neodesílá, data zůstávají v okně prohlížeče.

---

## 4. Herní smyčky

| Smyčka | Délka | Obsah |
|---|---|---|
| **Mikro** | < 1 s | klik → krystal se rozsvítí, zazní tón, přepočítá se hodnota, proteče světlo |
| **Level** | 2–6 min | pochop zadání → experimentuj → objev pravidlo → vyřeš → mechanismus ožije |
| **Akt** | 30–60 min | nové patro → 8–12 levelů → boss (syntéza) → Kodex přeloží kapitolu → patro se rozsvítí |
| **Meta** | celá hra | mapa observatoře, Kodex, střepy, pečetě, Echo nabírá řeč, Srdce se probouzí |

---

## 5. Typy hádanek (archetypy)

Každý archetyp je samostatný modul se stejným rozhraním (konfigurace → stav → ověření).
Díky tomu je přidávání levelů rychlé a datově řízené.

| Archetyp | Interakce | Co učí | Od |
|---|---|---|---|
| **Oltář** | klikáním přepínáš krystaly, abys dosáhl cílové hodnoty; v přísném režimu (Tichý krok) projdeš všechny kombinace bez opakování, jinak se cesta přeruší | bit → číslo, poziční hodnota, Grayův kód | I |
| **Nápis** | chrám rozsvítí kombinaci, na kamenných kotoučích (desítky, jednotky) nastavíš její hodnotu; umí i opačný směr a kotouče s glyfy 0–F (jeden na každou čtveřici krystalů) | binární → desítkové, šestnáctková soustava | I |
| **Počítadlo** | poutníci přibývají jako čárky a ty nastavuješ „další“ číslo; zápisník červeně ukáže změněné krystaly (technicky Oltář s cíli n + 1) | inkrementace, přenos | I |
| **Kaskáda** | počítání pod sebou: ve stěně svítí řádky, hráč rozsvěcí krystaly výsledku a krystaly přenosu nad sloupci a výsledek potvrdí. Světla se přesouvají při každém doteku: do rozsvíceného krystalu výsledku sjede nejspodnější světlo sloupce, do krystalu přenosu odletí dvě světla shora (o dvě místa čtyři), u odčítání se menšitel vyruší a výpůjčka půjčí sousedovi; co odešlo, ve sloupci pohasne. Bez krystalů přenosu (II-0, II-2) přeteče dvojice rovnou do prázdného krystalu vlevo. Chyba otřese prvním špatným sloupcem zprava a Echo řekne proč (kolik světel se v něm slévá, který přenos chybí). Umí sčítání, pevnou nádobu s přepadem, odčítání s výpůjčkami, tři řady s přenosem o dvě místa i násobení, ve kterém hráč sám vybírá posunuté kopie | aritmetika | II |
| **Příliv** | páky posouvají celou řadu (vlevo = ×2, vpravo = ÷2, co přeteče přes okraj, je ztracené), další páky přidají nebo uberou jedničku. Cíl co nejméně tahy; ve Vahách Osudu dovolí každá zkouška jen ideální počet tahů a pak se vrátí na začátek. Páka „převrať“ (doplněk), miska zbytku (dělení) a kolo může místo čísla ukázat „÷ 8“ nebo „−3“ | posuny, ×2, ÷2, doplněk | II |
| **Smíšená komnata** | brána patra: několik hádanek různých archetypů za sebou (třeba Kaskáda a pak Příliv), nad scénou ukazatel zkoušek; tahy, pokusy i nápovědy se pro pečetě sčítají za celou komnatu | syntéza patra | II |
| **Brána** | kamenná deska s obvodem: vlevo krystaly vstupů, uprostřed kameny s runami, vpravo lampa, mezi nimi světlovody, které svítí, když nesou světlo. Zkoumání (runy pevné, hráč zkouší všechny kombinace vstupů) a vkládání run do prázdných kamenů (kliknutí runy střídá, Zkouška projde všechny řádky a nesedící rozsvítí okrově) | hradla, skládání | III |
| **Deska zákona** | pravdivostní tabulka: hráč rozsvítí, ve kterých řádcích lampa svítí, nebo podle hotové desky pozná runu pod závojem. Obvod vedle desky ukazuje kombinaci, kterou hráč vybere (kliknutím na řádek desky nebo krystaly vstupů, najetí myší ji jen ukáže), a lampa ukazuje, co k ní doteče; desku jde odvodit z toho, co hráč vidí, a prochází ji svým tempem | tabulky, identifikace | III |
| **Dílna** | stroj z run a součástek na kamenné desce: víc lamp (čísla s vahami a živou hodnotou pod deskou), součástky s několika výstupy (poloviční a úplná sčítačka, výhybka, ozvěna, ozvěna s tepem), zpětná vazba a tlačítko Tep. Zkoumání (všechny kombinace vstupů), cíle (dovést stroj vstupy a tepem k cílovému stavu) a stavba: hráč osazuje prázdné kameny runami a točitými kameny vybírá, odkud do kamene, součástky nebo lampy teče světlo. Zkouška projde všechny kombinace (u velkých strojů s pravidlem slovy a prvním příkladem, kde se stroj plete), nebo zkušební posloupnost s tepy od zhasnuté paměti | sčítačky, multiplexor, dekodér, paměť, čítač, ALU | IV |
| **Maska** | ve stěně svítí oktáva, hráč pod ní rozsvěcí masku a runa AND, OR nebo XOR z nich živě skládá výsledek; oltář žádá cílový výsledek, u šifry má maska odpovídat klíči a výsledkem je rozšifrované písmeno | bitové operace, šifra XOR | III |
| **Kniha znaků** | Nápis, u kterého oktáva ukazuje do tabulky: levý glyf je řádek, pravý sloupec. Čtení i zápis slov, druhé knihy pro česká písmena, police s čísly dalších polic | ASCII, UTF-8, adresa | V |
| **Léčitel** | deska krystalů se strážnými krystaly: hráč strážce doplní, pozná poškozenou desku, nebo podle strážců, kteří se ozvou, najde a opraví poškozený krystal (kříž, tři kruhy, strážci s vahami) | parita, oprava chyb, Hamming | V |
| **Mozaika** | mřížka krystalů, každý řádek je čtveřice nebo oktáva zapsaná glyfy; hráč podle glyfů kreslí, nebo obraz zapíše. Varianty: sloupce výšek (zvuk), krátký zápis (komprese), barvy | bitmapa, zvuk, komprese, RGB | V |
| **Strom znaků** | strom rozcestí: každý krystal zprávy vybere levou, nebo pravou cestu, na konci cesty je písmeno | kód s proměnnou délkou | V |
| **Zpěv** | z karet sestavíš krátký program pro Srdce | instrukce = bity | ✦ |

---

## 6. Osnova levelů

Každé patro má **16 míst pro komnaty**, přesně tolik, kolik rozliší čtyři strany čtveřicového glyfu
(0000 až 1111). **Nultá komnata** (glyf bez jediné rozsvícené strany) ukáže základní nápad patra
jednoduchou hrou: v Předsíni hráč rozsvítí krystal, v Síni Počtářů sečte jedna a jedna pod sebou,
v Zahradě pustí světlo k lampě. Nemá kvíz ani záznam Kodexu. **Základní cesta** jsou komnaty 0–7:
glyf jim svítí nejvýš na třech spodních stranách a komnata 7 je brána patra, která otevře schody dál. Základ stačí na celou hru a patro se v něm
vejde zhruba do jedné vyučovací hodiny. **Hlubší síně** 8–15 mají rozsvícenou i horní stranu glyfu,
jsou nepovinné a otevírají se po bráně patra, pak po jedné. Patří do nich látka, kterou sexta
nutně nepotřebuje, ale je škoda o ni přijít (odčítání, násobení, dělení, šestnáctková soustava).
Komnata 15 (glyf 1111) je velká brána patra. Akty I až IV jsou rozdělené takto a mají všech
16 komnat. Akt V má osnovu ve stejném rozdělení, ve hře zatím není. Sloupec *Nové* označuje jediný nový koncept levelu.

### Akt I — Předsíň Prvního Světla (bit a počítání)

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| I-0 | Probuzení | Oltář | (nultá komnata) | Jeden krystal. Rozsviť ho a dveře se otevřou. Naučí jediný klik. |
| I-1 | Ticho | Oltář | bit | Jeden krystal a stěna: světlo, stín, světlo. I zhasnutý krystal je zpráva. Kodex přeloží Krystal → Bit. |
| I-2 | Dvě světla | Oltář | kombinace | Dva krystaly. Napodob 4 vzory ukázané na stěně. |
| I-3 | Kolik kombinací? | Oltář | 2ⁿ | Tři krystaly. Najdi všech 8 různých vzorů (registr se plní). Plná deska se rozdělí na dvě poloviny podle levého krystalu: čtyři kombinace jednou se stínem, jednou se světlem. |
| I-4 | Váhy kamenů | Oltář | poziční hodnota | Krystaly 4-2-1 a živý součet. Váha se odhalí, když krystal svítí sám, nebo se dopočítá ze součtu (6 − 2 = 4). Cíle 1–7. |
| I-5 | Čtyři váhy | Oltář | 8-4-2-1 | Čtyři cíle do 15. Echo zmíní glyfy na dveřích (navnadí na I-13). |
| I-6 | Čtení nápisů | Nápis | binární → desítkové | Pět nápisů ze 4 krystalů, hodnota se nastaví na kotoučích (myší i klávesnicí). Chyba ukáže vedle sebe nápis a kombinaci zvoleného čísla. |
| I-7 | **Brána Předsíně** | Nápis (mix) | syntéza | Pět zkoušek ze 4 krystalů bez vah i součtu, střídavě zápis a čtení, poslední je 15. Otevře schody do Aktu II, Hlubší síně Předsíně a kapitolu Kodexu „Zákony Předsíně“ (shrnutí aktu). |
| | *Hlubší síně* | | | *Nepovinné, otevřou se po bráně patra.* |
| I-8 | Skryté váhy | Oltář | zvnitřnění | Váhy zmizí a krystaly jsou stejně velké. Pátý krystal (16) si hráč odvodí ze zákona. Cíle 11, 6, 13, 20, 27, součet ještě svítí. |
| I-9 | Sudé a liché | Oltář se skupinami čísel | parita, dělitelnost | Oltář nežádá číslo, ale druh čísla: liché, sudé větší než 8, dělitelné čtyřmi, osmi. Aha: rozhoduje pravý krystal, pak stíny vpravo. Připraví posun a dělení. |
| I-10 | Nejvyšší světlo | Oltář | 2ⁿ − 1, bajt | Oktáva krystalů, cíle 31, 32, 63, 255 bez vah i součtu. Kvíz: největší číslo z 6 krystalů, kolik krystalů na 1000. |
| I-11 | Tichý krok | Oltář (přísný) | Grayův kód | Všech 16 kombinací čtyř krystalů, každým dotekem jediná změna. Návrat na kombinaci, kterou deska už zná, cestu přeruší a začíná se znovu. Nápověda: zrcadlo (osm kombinací tří krystalů, levý krystal, pozpátku). |
| I-12 | Velký nápis | Nápis | oktáva | Čtyři losované oktávy střídavě ke čtení a k zápisu, tři kotouče (stovky, desítky, jednotky). |
| I-13 | Řeč glyfů | Nápis s glyfy | šestnáctková číslice | Kotouč nese glyfy 0–F (glyf a pod ním šestnáctkový znak). Čtveřice krystalů se čte jako glyf a brána naopak žádá glyf. Glyfy na dveřích komnat jsou šestnáctková soustava. |
| I-14 | Dvojznak | Nápis s glyfy | bajt šestnáctkově | Oktáva na dvou glyfových kotoučích, čtení i zápis. Kvíz: F0 a barva #FF8800. |
| I-15 | **Velká brána Předsíně** | smíšená | syntéza | Tichý krok přes tři krystaly, oktáva desítkově a oktáva dvěma glyfy. Odemyká „Hlubší zákony Předsíně“. |

### Akt II — Síň Počtářů (aritmetika)

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| II-0 | Jedna a jedna | Kaskáda | (nultá komnata) | Hračka se sčítáním dvou krystalů (dřív komnata Soutok): 1 + 0, 0 + 1 a 1 + 1 pod sebou, s počty světel a desítkovými hodnotami. U 1 + 1 hráč rozsvítí krystal s váhou 2 a obě světla do něj sama sjedou. |
| II-1 | Počítadlo poutníků | Počítadlo | přenos | Čísla 1 až 8, poutníci jako čárky na desce. Hráč objeví „předání“ (0011 → 0100, 0111 → 1000), kvíz ho zobecní. Předání = přenos, jedno slovo pro celou Síň. |
| II-2 | Dvě dvojky | Kaskáda | dvojice v každém sloupci (sčítání pod sebou) | Dvě čtyřkrystalové řady, pět krystalů výsledku, bez krystalů přenosu. 5 + 1 (známá dvojice vpravo), 2 + 2 (dvě světla s váhou 2 patří do krystalu s váhou 4, ne pod dvojici: počet světel není váha), 8 + 8 = 16 v pátém krystalu. Pak váhy zhasnou: losovaný součet s jednou dvojicí a dvě dvojice naráz. Vlevo od každé dvojice je volno, srážka přijde až v II-3. Kvíz: součet s dvojicí, kam přeteče dvojice s váhou w (i mimo desku). |
| II-3 | Krystaly přenosu | Kaskáda | přenos na světlo, krystal přenosu | Čtyřbitové součty s přenosy. Hráč sám umisťuje malé krystaly přenosu nad sloupce a brána chce vidět i je. Počty světel pod sloupci se s nimi živě mění. Kvíz: zákon sloupce (tři světla = dole 1, přenos 1). |
| II-4 | Velká kaskáda | Kaskáda | řetěz přenosů | Šestibitová čísla bez počtů pod sloupci, 011111 + 1, jeden losovaný součet a 111111 + 111111. Kvíz: součet n bitů má nejvýš n + 1 bitů. |
| II-5 | Přetékající nádoba | Kaskáda | přetečení | Pevné 4 krystaly s přepadem: přenos z nejvyššího sloupce musí hráč poslat do přepadu (12 + 6, 15 + 1). Zápisník ukáže (1)0010 a 18 → 2. Kvíz: širší nádoba, 255 + 1 v bajtu. |
| II-6 | Příliv a odliv | Příliv | posun = ×2 / ÷2 | Páky jen se šipkami, živá váha. Hráč objeví ×2 a ÷2 i ztrátu světla vpravo (13 → 6). Kvíz: 52 >> 1, posun o dvě místa = ×4. |
| II-7 | **Brána Síně** | smíšená (Kaskáda + Příliv) | syntéza | Tři pětibitové součty s přenosy (poslední přeteče do šestého krystalu), pak tři vyvážení jen posuny: zdvojit, rozpůlit a rozpůlit se ztrátou přes okraj. Kvíz: přetečení nádoby a posun o tři místa. Otevře Hlubší síně a „Zákony Síně“ (shrnutí aktu). |
| | *Hlubší síně* | | | *Nepovinné, otevřou se po bráně patra.* |
| II-8 | Odliv | Kaskáda | odčítání, výpůjčka | Odčítání s výpůjčkami: krystal výpůjčky se zapisuje pod spodní řadu, takže je vidět, že se ve sloupci odečítají dva krystaly od jednoho (8 − 1 projde třemi sloupci). Druhá úloha je ukázková: výpůjčky jsou předem na místě a Echo je okomentuje. |
| II-9 | Zdvojení | Příliv | stavba čísla | Z 1 dosáhni 6, 11, 21, 27 jen pákami ×2 a +1. Pointa: posloupnost tahů kopíruje dvojkový zápis cíle (Hornerovo schéma z I-6 jako stavební návod). |
| II-10 | Násobení po lumenitsku | Kaskáda (výběr kopií) | posun + sčítání | Stěna nabídne kopii prvního činitele pro každé místo druhého (×1, ×2, ×4). Hráč rozsvítí ty, které patří k jedničkám druhého činitele, a sečte je s přenosy. Špatně zvolenou kopii kontrola najde jako první. |
| II-11 | Dělení posunem | Příliv s miskou zbytku | ÷ 2ᵏ se zbytkem | Kolo ukáže „÷ 4“, „÷ 8“, „÷ 2“, „÷ 16“ a jediná páka půlí. Co spadne přes pravý okraj, chytí miska zbytku. Kvíz: zbytek 109 : 16, co jde dělit osmi beze zbytku. |
| II-12 | Tři řady | Kaskáda s přenosem o dvě místa | přenos o dvě místa | Tři sčítance. Nad přenosy je druhá řada krystalů pro přenos o dvě místa (čtyři světla ve sloupci = 100). Na konci 15 + 15 + 15, kde se ve sloupci slije pět světel. |
| II-13 | Doplněk | smíšená (Příliv + Kaskáda) | dvojkový doplněk | Objev před výkladem: kolik jedniček vyprázdní nádobu se třemi světly? Třináct, tedy 1101 = −3. Pak zkratka: páky „převrať“ a „+1“. Nakonec odčítání sčítáním doplňku, přetečení do přepadu. |
| II-14 | **Váhy Osudu** | Příliv (přísný) | syntéza | Dvě misky vah, páky ×2, ÷2, +1, −1 a jen ideální počet tahů na zkoušku (7 → 30, 12 → 47 přestřelením a ubráním…). Po vyčerpání tahů se misky vrátí. Kvíz míchá odčítání a posun. |
| II-15 | **Velká brána Síně** | smíšená | syntéza | Odliv na pěti krystalech, násobení s výběrem kopií a Váhy Osudu na tři a čtyři tahy. Odemyká „Hlubší zákony Síně“. |

### Akt III — Zahrada Bran (logika)

Runy Lumenitů jsou logické spojky z výrokové logiky, kterou studenti znají z matematiky: Obraceč je
negace (¬), Pouto konjunkce (∧), Rozcestí disjunkce (∨), Výluka vylučovací disjunkce (⊻). Lumenité je
tesali těmi samými znaky. Moderní značka (NOT, AND…) se pod runou objeví, až ji Kodex přeloží.

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| III-0 | Cesta světla | Brána | (nultá komnata) | Vstup a lampa spojené světlovodem bez runy. Hráč vyzkouší světlo i stín: lampa ukazuje, co k ní doteče. |
| III-1 | Obraceč | Brána | NOT | Do prázdného kamene mezi vstupem a lampou se vkládá Průchod, nebo Obraceč, aby lampa svítila podle brány. Pak dva Obraceče za sebou (¬¬A = A). |
| III-2 | Pouto | smíšená (Brána + Deska) | AND | Hráč přepíná vstupy a zkouší všechny čtyři kombinace (deska objevů je zapisuje, ideál po jediné změně), pak vyplní desku zákona zpaměti. |
| III-3 | Rozcestí | smíšená (Brána + Deska) | OR | Stejný postup pro OR. Kvíz: ve kterých řádcích se liší Pouto a Rozcestí. |
| III-4 | Jen jeden | smíšená (Brána + Deska) | XOR | Výluka. Echo připomene Síň Počtářů: XOR je spodní číslice součtu 1 + 1. |
| III-5 | Které pravidlo? | Deska zákona | identifikace | Losované desky: tři poznat (runa pod závojem), dvě vyplnit. Špatná volba řekne, ve kterém řádku by zvolená runa svítila jinak. |
| III-6 | Řetězy | Brána | skládání | Dvě runy za sebou: hráč objeví Zlomené pouto (NAND), Zavřené rozcestí (NOR) a Rovnost (Výluka a Obraceč, Echo ji pojmenuje). Pak prozkoumá hotové větvení a postaví losované větvení s Obracečem na jednom vstupu. |
| III-7 | **Brána Zahrady** | smíšená | syntéza | Deska zákona dvou obvodů s lampou pod závojem (výsledek se skládá z run), osazení kamenů ke třem deskám a dvě runy pod závojem z pěti. |
| | *Hlubší síně* | | | *Nepovinné, otevřou se po bráně patra.* |
| III-8 | Zrcadla | smíšená (Deska + Brána) | De Morgan | Desky pro Zlomené pouto a pro Rozcestí obrácených vstupů vyjdou stejně. Pak hráč postaví Zavřené rozcestí jako Pouto obrácených vstupů. |
| III-9 | Rovnost a důsledek | smíšená (Brána + Deska) | ekvivalence, implikace | Nové runy Rovnost ⇔ (XNOR) a Důsledek ⇒ (implikace): zkoumání, desky a poznání pod závojem. Kvíz: „Když prší, je mokro.“ |
| III-10 | Hlas většiny | smíšená (Brána) | 3 vstupy | Tři vstupy, osm kombinací (tichým krokem), pak osazení pěti kamenů Pouty a Rozcestími. Platí obě řešení: Pouta a Rozcestí i Rozcestí a Pouta. |
| III-11 | Prapečeť | Brána s točitými kameny | univerzalita NAND | Jen Zlomená pouta. Točité kameny u jejich vstupů vybírají zdroj světla: z NAND vznikne NOT, AND i OR. |
| III-12 | Masky | Maska | bitové operace | Šest úloh na oktávě: dvakrát vybrat (AND), dvakrát rozsvítit (OR), dvakrát přepnout (XOR). Ideál počítá i s maskou, kterou zadání popisuje (pravá čtveřice = 0000 1111). |
| III-13 | Tajná řeč | Maska s klíčem | XOR šifra | Zašifrovat písmeno klíčem. Klíč zůstane v masce a sám rozšifruje zprávu písmeno po písmenu: E, EC, ECH, ECHO (u řad číslo a znak ASCII). Nakonec zpráva s neznámým klíčem: z prvního písmene E se klíč najde. Echo: „To jsem já.“ |
| III-14 | Méně je víc | Brána se vzorem | zjednodušení | Starý obvod Lumenitů o dvou až čtyřech runách se nahradí jedinou runou se stejnou deskou. |
| III-15 | **Velká brána Zahrady** | smíšená | syntéza | Dvě runy pod závojem ze sedmi, Pouto nebo Rozcestí jen ze Zlomených pout a dvě masky. |

V Zahradě místo vodičů slouží točité kameny u vstupů run, které vybírají, odkud světlo přitéká (runy
mají na desce čísla, kámen ukazuje A, B nebo číslo runy). Stejně staví stroje Dílna v Hlubině Strojů:
kreslení vodičů by na tabletu a z klávesnice bylo těžké a točitý kámen ukáže volbu jedním kliknutím.

### Akt IV — Hlubina Strojů (obvody a paměť)

Základní cesta stroje jen počítá a rozhoduje (kombinační obvody), paměť je celá v Hlubších síních.
Lampy, které tvoří číslo, mají váhy a pod deskou svítí živá hodnota čísel (A, B, součet), takže se
vrací čtení čísel z Aktu I. Stroje se staví z kamenů a točitých kamenů jako v Prapečeti.

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| IV-0 | Stroj, který počítá | Dílna | (nultá komnata) | Hotová poloviční sčítačka s lampami 2 a 1. Hráč zkouší čtyři kombinace a zjistí, že stroj sčítá: 1 + 1 = 10. |
| IV-1 | Poloviční sčítačka | Dílna | XOR + AND = sčítání | Hráč sám vloží Výluku na spodní číslici, pak obě runy. Kvíz: proč nestačí Rozcestí, proč ze dvou světel nevyjde 11. |
| IV-2 | Úplná sčítačka | smíšená (Dílna) | přenos zprava | Zkoumání osmi kombinací (lampy počítají světla, zákon sloupce z II-3), pak doplnění tří run. |
| IV-3 | Řetěz sčítaček | Dílna | **abstrakce** | Úplná sčítačka je jeden kámen, sčítačky stojí jako sloupce Kaskády. Hráč točí přenosy: dvě sčítačky s jediným točitým kamenem (Echo ho představí, na základní cestě je nový), čtyři sčítačky, kde točitý kámen nabízí přenos z kterékoli sčítačky, a nakonec A + B + 1 světlem v prvním přenosu. |
| IV-4 | Porovnávač | smíšená (Dílna) | rovnost | Zkoumání Rovnosti z III-6 jako jednoho kamene, pak dvoubitová čísla (Rovnost v každém sloupci a Pouto) a „různé“ (Výluka a Rozcestí). |
| IV-5 | Výhybka | smíšená (Dílna) | multiplexor | Cíle na hotové výhybce (lampa poslouchá A, pak B), pak stavba: točité kameny voliče a runa, která cesty spojí. |
| IV-6 | Rozdělovač | Dílna | dekodér | Dva krystaly rozsvítí právě jednu ze čtyř lamp. Nejdřív lampy 0 a 3, pak všechny. |
| IV-7 | **Brána Hlubiny** | smíšená (Dílna) | syntéza | Losovaný řetěz sčítaček (A + B, nebo A + B + 1), rozdělovač s lampami v jiném pořadí a výhybka (i obrácená), porovnávač „stejné“ nebo „různé“. Kvíz s losovaným součtem. |
| | *Hlubší síně* | | | *Nepovinné, otevřou se po bráně patra.* |
| IV-8 | Ozvěna | smíšená (Dílna) | zpětná vazba, klopný obvod RS | Cíle na hotové ozvěně ze dvou Zavřených rozcestí (lampa svítí dál i po zhasnutí S), pak hráč uzavře kruh točitými kameny a zkouška paměti projde šest kroků. |
| IV-9 | Tep Srdce | smíšená (Dílna) | hodiny, klopný obvod D | Ozvěna je jeden kámen: Pouta před ní pustí D jen se světlem T. Pak ozvěna s tepem a tlačítko Tep (klávesa T). |
| IV-10 | Registr | smíšená (Dílna) | registr, posun | Tři ozvěny s tepem drží číslo (ulož 5, vstup se mění, paměť drží), pak posuvný registr: každý tep posune světlo o patro výš (×2 jako v Přílivu). |
| IV-11 | Počítadlo hvězd | smíšená (Dílna) | čítač | Hotové počítadlo: napočítej do 3, do 6 a přetoč ho na 0. Pak stavba: součty sčítaček do ozvěn a stálé světlo jako jednička navíc. |
| IV-12 | Odčítačka | Dílna | odčítání doplňkem | A − B jako A + převrácené B + 1 (Doplněk z II-13), pak jeden stroj na sčítání i odčítání: Výluka s M a M v prvním přenosu. |
| IV-13 | Volič operace | Dílna | ALU | Čtyři runy a tři výhybky ve dvou patrech: kód operace O vybere Pouto, Rozcestí, Výluku, nebo Zlomené pouto. Nejdřív runy podle kódů s přehozenými voliči výhybek (pořadí se musí vyčíst z cest), pak voliče výhybek. |
| IV-14 | Násobička | Dílna | násobení | Čtyři Pouta jsou kopie z II-10 (pod každým stojí, které krystaly násobí), dvě poloviční sčítačky je sečtou: lampy 8, 4, 2, 1 ukazují A × B. |
| IV-15 | **Velká brána Hlubiny** | smíšená (Dílna) | syntéza | Žádná kopie komnat: počítadlo s chodem C (paměť, sčítačka a Pouta v jednom stroji, zhasnutý chod tepem vynuluje) a volič operace s losovanými kódy i zapojením voličů. |

### Akt V — Archiv Hlasů (kódy)

> Návrh osnovy · 17. 11. 2026, zatím bez kódu. Předpoklady o základní cestě ověří playtest
> kompletního průchodu.

Do Archivu Lumenité ukládali zprávy, obrazy i hlasy. Patro vede ke třem myšlenkám:
- **cokoli jde zapsat světlem a stínem:** písmeno, obraz, zvuk;
- **zápis se dá ochránit:** strážné krystaly prasklinu odhalí, nebo ji i opraví;
- **co oktáva znamená, určuje dohoda:** stejné světlo je číslo, písmeno, nebo řádek obrazu.

Na poslední myšlenku navazuje Finále: i rozkaz pro Srdce je jen oktáva.

**Co zná hráč základní cesty.** Základní cesta Archivu počítá jen se základními cestami Aktů I až IV:

| Zná | Nezná (je jen v Hlubších síních) |
|---|---|
| čísla ze čtyř krystalů (0–15), váhy 8-4-2-1, 2ⁿ kombinací | oktávu a čísla do 255 (I-10, I-12), glyfy jako číslice (I-13, I-14) |
| sčítání s přenosem, přetečení, posun ×2 a ÷2 | Sudé a liché (I-9), odčítání a doplněk (II-8, II-13) |
| runy a desky zákona, řetězy run | masky a Tajnou řeč s ASCII (III-12, III-13) |
| sčítačky, porovnávač, výhybku, rozdělovač | paměť (IV-8 až IV-11) a volič operace (IV-13) |

Co z toho plyne:
- **Oktáva jsou dva glyfy.** Oktávu, glyfy i písmena učí Archiv od začátku. Oktáva se čte jako dva glyfy,
  tedy dvakrát čtení čtyř krystalů, které hráč základní cesty umí. Váhy 128 až 16 nepotřebuje.
- **Kdo prošel Hlubšími síněmi, nedělá totéž podruhé:**
  - V-1 nabídne zkratku Glyfy znám (jako Desku znám), když má hráč přeloženou Řeč glyfů;
  - ve V-2 Echo naváže na Tajnou řeč: tohle je kniha, ze které byla písmena;
  - ve V-3 Echo odliší strážný krystal od Sudé a liché: tam rozhodoval pravý krystal čísla, tady
    počet světel.
- **Hlubší síně Archivu** se otevřou i hráči základní cesty. Staví proto jen na základních cestách
  a na základní cestě Archivu, ne na Hlubších síních předchozích pater.
- **Nečitelná slova:** hráč základní cesty nikdy nepřeloží „glyfy“ v I-5 (záznam Řeč glyfů) ani jméno
  Echa v I-0 (Tajná řeč). Obě slova dostanou druhý záznam, který je přeloží taky: glyfy V-1, jméno
  Echa V-2. První slova Echa v I-0 („… ticho… věky ticha“) přeloží brána V-7.

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| V-0 | Znak na dveřích | Oltář | (nultá komnata) | Na dveřích je glyf, kolem čtverce čtyři krystaly. Když svítí stejné strany jako na glyfu, dveře se otevřou: glyf je čtveřice krystalů. |
| V-1 | Čtveřice | Nápis s glyfy | šestnáctková číslice | Strany glyfu se čtou od horní po směru hodinových ručiček, horní váží 8. Dveře komnat, kterými hráč prošel, nesou jejich čísla (I-5 je 5). Pro 10 až 15 číslice nestačí, proto A až F. Čtení i zápis jednoho glyfu. Kdo má přeloženou Řeč glyfů (I-13), přeskočí rovnou na závěrečnou zkoušku. Kvíz: proč právě 16 znaků. |
| V-2 | Kniha znaků | Kniha znaků | ASCII (oktáva = dva glyfy) | Písmeno má v knize řádek podle levého glyfu a sloupec podle pravého, tak se tabulka ASCII tiskne dodnes: 4 a 5 je E. Hráč přečte krátké slovo písmeno po písmenu, pak sám zapíše slovo pro Echo. Osmý krystal zůstává zhasnutý. Kvíz: proč v knize chybí č a ř. |
| V-3 | Strážný krystal | Léčitel | paritní bit | Osmý krystal Lumenité nechávali na hlídání: rozsvítí se tak, aby v oktávě svítil sudý počet krystalů. Hráč nejdřív doplní strážný krystal k několika písmenům, pak mezi přijatými deskami pozná ty, které poškodila prasklina (lichý počet světel). Kvíz: dvě praskliny ve stejné oktávě strážný krystal neodhalí. |
| V-4 | Obrazy ze světla | Mozaika | bitmapa | Každý řádek mřížky je čtveřice, nebo oktáva. Nejdřív 4 × 4 s jedním glyfem na řádek, pak 8 × 8 se dvěma. Hráč podle glyfů nakreslí symbol Lumenitů, pak obraz přepíše do glyfů. Kvíz: stejná oktáva je písmeno i řádek obrazu, rozhoduje dohoda. |
| V-5 | Kříž strážců | Léčitel | oprava chyby | Deska 4 × 4 má strážce na konci každého řádku i pod každým sloupcem. Po jedné prasklině se ozve jeden řádek a jeden sloupec a poškozený krystal je v jejich průsečíku. Hráč ho najde a opraví, nejdřív na obrazu, pak na vzoru, ve kterém chybu okem poznat nejde. |
| V-6 | Hlas v číslech | Mozaika (sloupce) | zvuk jako čísla | Hlas je vlna. Lumenité ji v pravidelných chvílích změřili a každou výšku zapsali čtveřicí. Hráč nastaví výšky podle nakreslené vlny a Srdce zvuk přehraje. Pak podle řady glyfů vlnu nakreslí sám. Kvíz: víc měření a víc krystalů na měření zní věrněji, ale zabere víc místa. |
| V-7 | **Poslední zpráva** | smíšená | syntéza | Poškozená deska s křížem strážců: opravit, přečíst písmena z dvojic glyfů, nakreslit obraz. Zpráva řekne, proč se Srdce zastavilo, a Echo konečně vysloví svá první slova z I-0. Kvíz: co znamená oktáva 0100 1000 (podle dohody 72, H, nebo řádek obrazu). Otevře Finále, Hlubší síně a „Zákony Archivu“. |
| | *Hlubší síně* | | | *Nepovinné, otevřou se po bráně patra.* |
| V-8 | Tři kruhy | Léčitel | Hammingův kód (7,4) | Čtyři krystaly zprávy leží v průnicích tří kruhů. V každém kruhu je jeden strážce a v kruhu musí svítit sudý počet krystalů. Hráč nejdřív strážce doplní, pak podle kruhů, které se ozvou, najde poškozený krystal. Tři strážci uhlídají čtyři krystaly, kříž by na ně potřeboval čtyři. |
| V-9 | Strážci s vahami | Léčitel | poloha chyby | Krystaly stojí v řadě s čísly 1 až 7, strážci na místech 1, 2 a 4. Čísla strážců, kteří se ozvou, dají v součtu místo poškozeného krystalu (ozve se 1 a 4: krystal 5). Váhy kamenů z I-4 tu ukazují na chybu. Kvíz: kolik strážců potřebuje 15 krystalů. |
| V-10 | Krátký zápis | Mozaika | komprese (RLE) | Řádek obrazu jde zapsat i jako „tři stíny, dvě světla, tři stíny“. Hráč obrazy zkracuje a podle krátkého zápisu kreslí. Aha: velká plocha se zkrátí hodně, šachovnice se naopak prodlouží. |
| V-11 | Barvy světla | Mozaika s barvou | barva RGB | Barva jsou tři oktávy: červené, zelené a modré světlo, každé dvěma glyfy. Hráč míchá světlo (červená a zelená dají žlutou) a nastavuje barvy podle zápisu #FF8800. |
| V-12 | Háčky a čárky | Kniha znaků | UTF-8 | Česká písmena se do knihy nevejdou. Glyfy C3, C4 a C5 znamenají, že písmeno je v jiné knize a ukáže ho další oktáva (č = C4 8D). Hráč čte a píše slova s háčky. Kvíz: proč se v e-mailu místo č objeví „ÄŤ“. |
| V-13 | Krátké pro časté | Strom znaků | kód s proměnnou délkou | Kód je strom rozcestí jako rozdělovač z IV-6: stín vede vlevo, světlo vpravo, na konci cesty je písmeno. Častá písmena jsou blízko kořene a mají krátký kód. Hráč čte zprávu bez mezer (žádný kód není začátkem jiného), pak sám rozmístí písmena tak, aby zpráva byla co nejkratší. |
| V-14 | Police Archivu | Kniha znaků | adresa | Police Archivu jsou číslované dvojicemi glyfů. Na některých leží písmeno, na jiných číslo další police. Hráč jde z police na polici a skládá zprávu. Číslo tu znamená místo, další dohoda. Kvíz: co když police ukazuje sama na sebe. |
| V-15 | **Velká brána Archivu** | smíšená | syntéza | Zpráva chráněná strážci s vahami, slovo s háčky, obraz v barvách a cesta po policích. Odemyká „Hlubší zákony Archivu“ a poslední část příběhu: komu patřil hlas, ze kterého je Echo. |

**Z původní osnovy vypadlo:**
- šestnáctková soustava jako samostatný začátek: hráči Hlubších síní ji mají v I-13 a I-14, ve V-1 dostanou zkratku;
- Stínová čísla: doplněk je v II-13 a IV-12;
- Ozvěny minulosti: střepy ve hře nejsou a návrat ke starým patrům dělají nečitelná slova, která přeloží Kodex.

**Co to znamená pro kód:**
- Nové archetypy:
  - Kniha znaků: V-2, V-12, V-14;
  - Léčitel: V-3, V-5, V-8, V-9;
  - Mozaika: V-4, V-6, V-10, V-11;
  - Strom znaků: V-13.
  Oltář s glyfem (V-0) a Nápis s glyfy (V-1) už jsou.
- Glyf patra potřebuje třetí bit značky: základ 64 a maska 112 místo 48, uprostřed glyfu nový znak.
- Nečitelné slovo s víc záznamy: `{{Echo|sifra,kniha}}` přeloží kterýkoli z nich.
- Zkratka Glyfy znám ve V-1 jako Desku znám (`skip()`).
- Strážce schodů do Archivu se ptá na základní cestu Hlubiny: sčítačka, výhybka, rozdělovač.
- Přehrání vlny ve V-6 přes Web Audio, které hra už používá na zvuky.

### Finále — Srdce Observatoře

| # | Název | Archetyp | Nové | Popis |
|---|---|---|---|---|
| ✦ | Zpěv Srdce | Zpěv + Dílna | program = bity | Srdce čte rozkazy jako oktávy: levý glyf je operace (vlož, přičti, zdvoj, rozpul, Výluka), pravý glyf číslo. Hráč z karet sestaví 3–5 rozkazů, které v krystalech Srdce spočítají požadovanou hodnotu. Volič operace má Srdce vlastní a hotový, takže Finále nepotřebuje IV-13 ani paměť z Hlubších síní: stačí sčítačka, posun, runy a výhybka ze základní cesty. Pointa: „I program je jen světlo a stín.“ |

---

## 7. Rozhraní a ovládání

### 7.1 Principy

- **Jedna obrazovka = jedna hádanka.** Žádné scrollování během řešení.
- **Maximálně 4 ovládací prvky** mimo herní plochu (Zpět, Znovu, Nápověda, Kodex).
- **Žádné skryté akce.** Pravé tlačítko, dvojklik ani gesta nejsou nikdy nutná.
- **Přetahování je volitelné.** Každá akce přetažením má alternativu dvěma kliky
  (WCAG 2.5.7 *Dragging Movements*).
- **Okamžité ověření** u jednoduchých hádanek (vyřešeno = hned se otevře).
  U obvodů je tlačítko **„Spustit zkoušku“**, které animovaně projde všechny vstupy.
- **Žádné prohry.** Zpět/Znovu je vždy po ruce a neomezené.
- **Otevřená komnata.** Po vyřešení výsledek nevyskočí sám. Prvky zůstanou ovladatelné a nic se už
  nepočítá (krystaly, páky, vstupy, maska; v Nápisu jsou kotouče s krystaly propojené), hráč může ve
  vyřešené komnatě experimentovat. Výsledek, pečetě a cestu dál ukáže tlačítko Pokračovat (nebo Enter) a z výsledku
  se jde zpátky do komnaty. Komnatu s víc úlohami jde prolistovat (u smíšené brány i přes všechny
  zkoušky): šipky lemují zlaté kosočtverečky úloh nad hádankou a kosočtverečky jdou i proklikat.
  Každá úloha se ukáže vyřešená a dá se s ní dál experimentovat.

### 7.2 Rozvržení obrazovky

```
┌────────────────────────────────────────────────────────────────┐
│ ◈ Předsíň Prvního Světla · 5 / 10                ⚙   ▤ Kodex   │  ← tenká lišta
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                     Oltář žádá:   ⟨ 5 ⟩                         │
│                                                                │
│              ◇          ◆          ◇          ◆                │  ← herní plocha
│              8          4          2          1                │    (≥ 70 % výšky)
│                                                                │
│                  Tvé světlo váží:  5   ✓                        │
│                                                                │
│   Echo: „Velký krystal je těžký. Potřebuješ ho?“                │  ← průvodce (zavíratelný)
├────────────────────────────────────────────────────────────────┤
│    ↶ Zpět      ⟲ Znovu                       ✧ Nápověda  1/3    │  ← akční lišta
└────────────────────────────────────────────────────────────────┘
```

Kodex se vysouvá zprava jako panel a hra zůstává vidět i ovladatelná.

### 7.3 Ovládání

| Akce | Myš | Dotyk | Klávesnice (alternativa) |
|---|---|---|---|
| přepnout krystal | klik | ťuk | Tab + mezerník; na desce Kaskády šipky mezi krystaly |
| zvolit číslo | klik na šipky kotouče / kolečko myši | ťuk na šipky | ↑ ↓ / číslice |
| vložit runu do slotu | klik na slot → kruhová nabídka run / přetažení z palety | ťuk → nabídka | Enter → šipky |
| propojit vodič | klik na výstup → klik na vstup | ťuk, ťuk | Enter, Enter |
| odstranit prvek | klik na prvek → ikona koše v jeho bublině | stejné | Delete |
| zpět / znovu | tlačítka | tlačítka | Ctrl+Z / Ctrl+Y |
| nápověda | tlačítko | tlačítko | H |

### 7.4 Reaktivita a odezva

| Situace | Odezva | Čas |
|---|---|---|
| najetí myší (hover) | jemná záře, ukázání váhy, kurzor ruky | < 50 ms |
| klik | okamžitá změna stavu, záblesk, tón | < 100 ms |
| změna hodnoty | živý přepočet čísel, světlo proteče vodiči | 150–300 ms |
| přenos v kaskádě | světlo přeteče do dalšího sloupce | 250 ms / sloupec (nastavitelné) |
| vyřešení | runa se vyryje, mechanismus ožije | ≤ 1,5 s, kliknutím přeskočitelné |
| chyba | jemné zvlnění, vysvětlení příčiny | 300 ms, bez blokace |

Pravidla: animace **nikdy neblokují vstup** (vstupy se během animace řadí do fronty),
vše je přeskočitelné a respektuje `prefers-reduced-motion`.

### 7.5 Stavy herních prvků (pro konzistenci)

Každý interaktivní prvek má jasně odlišené stavy **tvarem i jasem, nejen barvou**:

| Stav | Vzhled |
|---|---|
| stín (0) | prázdný obrys krystalu, tlumený |
| světlo (1) | plný krystal se září a jemným vnitřním pohybem |
| hover | obrys zesílí, objeví se tooltip s váhou |
| zamčený (pevně daný levelem) | malý symbol zámku, neinteraktivní kurzor |
| zvýrazněný nápovědou | pomalu pulzující prstenec (< 1 Hz) |
| chybný (při zkoušce) | vlnovka pod prvkem + ikona |

---

## 8. Vizuální styl

### 8.1 Nálada: ztracený chrám

Dobrodružná archeologie: tesaný kámen, dřevěné trámy, bronz a mosaz, světlo pochodní,
prach ve vzduchu. Observatoř je chrám vytesaný ve skále. Všechno je těžké, staré a mechanické.
Jediné, co opravdu září, jsou **krystaly**: světlo zůstává vypravěčem a to, co svítí, je důležité.

**Materiálová metafora překladu:**
- **Kámen a krystal** = věda Lumenitů (hádanky, oltáře, glyfy).
- **Papír a inkoust** = moderní zápis badatele (Zápisník, Kodex, mapa).
Když Kodex „přeloží“ pojem, objeví se na papíře. Hráč tak vizuálně vidí, co je starověké
a co je dnešní notace.

### 8.2 Paleta

| Token | Barva | Použití | Kontrast |
|---|---|---|---|
| `--stone-700` / `--stone-800` | `#3A3027` / `#29221B` | kamenné desky, panely | — |
| `--wood-700` | `#4A2D17` | dřevěné trámy (lišta ovládání, deska mapy) | — |
| `--brass` | `#C9A24A` | mosazné štítky vah, nýty, hlavní tlačítko | text `#1F1405` na mosazi ≈ 7,6 : 1 |
| `--text` | `#F0E7D4` | hlavní text na kameni | > 10 : 1 |
| `--text-muted` | `#C9B99D` | vedlejší text na kameni | ≈ 8 : 1 |
| `--lumen` | `#F2C14E` | světlo, zlatem vykládané nápisy | > 9 : 1 |
| `--umbra` | `#948AA8` | zhasnutý krystal (kouřový křemen) | ≈ 4,7 : 1 (UI ≥ 3 : 1 ✓) |
| `--ok` | `#7FCFB4` | měděnka: úspěch, nápověda (vždy s tvarem/ikonou) | vysoký |
| `--warn` | `#F0957A` | terakota: „o kolik víc“ (vždy s textem) | vysoký |
| `--parchment` / `--ink` | `#E9DCBF` / `#2B1F12` | papír badatele a inkoust | ≈ 11,8 : 1 |
| `--ink-red` | `#8F2F17` | červený inkoust: trasa na mapě, binární zápis | ≈ 6 : 1 |

### 8.3 Typografie

| Role | Písmo | Pravidla |
|---|---|---|
| nadpisy, popisky, velká čísla | **Cinzel** 700 | názvy komnat a panelů, popisky velkými písmeny (12 px, proklad 0,18 em), čísla na kolech, pákách a v součtech |
| veškerý text a tlačítka | **Atkinson Hyperlegible** 400/700 | běžný text 18 px, tlačítka 16 px (hlavní tučně), poznámky 14 px, poznámky na pergamenu kurzívou |
| nuly, jedničky, vzorce | **JetBrains Mono** 500/700 | číslice pod krystaly, zápisník, vzorce v Kodexu, kódy komnat |
| citáty | **Cormorant Garamond** kurzíva | jen citáty Lumenitů v Kodexu, Echo na závěrečné kartě a „&“ v názvu |

Velikosti jsou jen ze škály v `app.css` (`--fs-xs` až `--fs-3xl`): 12, 14, 16, 18, 20, 24, 28 a 36 px.
Větší jsou jen hrdinské prvky (logo, číslo na kole, nadpis mapy), a ty se řídí šířkou a výškou okna.
Indexy (10₂, 2ⁿ) se sázejí jako `<sub>`/`<sup>` a šipky se kreslí, protože je fonty nemají.

Všechna písma mají latin-ext (česká diakritika) a jsou uložená lokálně. Text nikdy nestojí přímo
na rušné textuře: buď na klidném kameni, v prohlubni, nebo na papíře.

### 8.4 Motivy a prvky

- **Pozadí:** kamenné zdivo s procedurální texturou (zrno, skvrny, reliéf), za scénou vytesané kolo
  s čtveřicovými glyfy, teplé světlo pochodní z boků, vinětace a prach ve vzduchu. Nahoře na kole je
  vždy glyf rozehrané komnaty: při postupu dopředu se kolo pootočí doleva a glyfy hotových komnat
  patra svítí zlatem.
- **Krystal (bit):** stojí v kamenném podstavci s bronzovými drápky. Rozsvícený vrhá světlo
  na podstavec i okolní kámen. Váha je **mosazný štítek**, stav bitu vytesaná číslice.
- **Oltář:** kamenné kolo s bronzovými hřeby, které se s každou přijatou váhou těžce pootočí.
- **Reliéf ve stěně, výklenky, lůžka pro drahokamy:** vytesané prohlubně do kamene.
- **Zápisník:** papírový list s moderním zápisem vedle hádanky.
- **Kodex:** kožená vazba s prošitím a pergamenovými listy.
- **Mapa:** pergamen připíchnutý na dřevěné desce, inkoustová trasa, kompas, razítko „Vstoupit“.
- **Ovládání:** dřevěný trám s mosaznými nýty, tlačítka jako kamenné bloky, hlavní tlačítko mosazné.
- **Pečetě:** bronzové medailony. Nezískaná pečeť je jen vytesaný otisk.

### 8.5 Animace a jejich omezení

- **Mechanické a těžké:** krystal se při dotyku zasune do lůžka a zvíří prach, kolo oltáře se
  otáčí s pomalým rozjezdem i dojezdem, drahokam zapadne do lůžka, deska ve stěně sjede.
- **Vyřešení komnaty:** kamenné dveře s vytesaným krystalem ve spáře se zachvějí a rozjedou,
  vyvalí se světlo a za nimi je výsledek.
- **Pochodně** jemně a pomalu kolísají (žádné blikání, WCAG 2.3.1).
- Při `prefers-reduced-motion` nebo volbě „Omezit animace“: žádné dveře, prach, kolísání ani pohyb.
- Cílem zůstává 60 fps na slabém Chromebooku. Textury se vykreslují jednou (SVG filtry jako
  obrázky na pozadí), nic těžkého se nepřepočítává každý snímek.

---

## 9. Zvuk a hudba

- **Bity jako hudba:** každá pozice krystalu má vlastní tón **pentatonické stupnice**.
  Libovolná kombinace proto zní konsonantně a číslo se „slyší“ jako akord. Hráč začne vnímat
  vzory i sluchem.
- **Přenos:** krátké vzestupné glissando, které putuje po pozicích.
- **Hradla:** každé hradlo má jemný charakteristický zvuk při průchodu světla.
- **Materiál:** krystal dosedá do kamene s cvaknutím a tupým úderem, kolo oltáře skřípe,
  dveře komnaty dlouze duní (filtrovaný hnědý šum, generovaný procedurálně).
- **Úspěch:** rezonující zvon a rozšíření akordu. **Chyba:** tichý nízký tón, nikdy rušivý.
- **Ambient:** dlouhé drony a vzdálené ozvěny, každé patro má vlastní tóninu a barvu.
- Zvuk generujeme **procedurálně** (Web Audio API), takže je malý, reaktivní a laditelný.
- Vše má vizuální ekvivalent. Hra je plně hratelná bez zvuku. Hlasitost se nastavuje zvlášť
  pro hudbu, efekty a Echo.

---

## 10. Přístupnost (cíl: WCAG 2.2 AA)

- [ ] Informace nikdy nenese jen barva: stav bitu = tvar + jas + volitelně číslice 0/1.
- [ ] Velikost klikacích cílů ≥ 44 × 44 px (norma vyžaduje 24 px, my chceme víc).
- [ ] Kontrast textu ≥ 4,5 : 1, UI prvků ≥ 3 : 1 (paleta ověřena výpočtem, viz 8.2).
- [ ] Žádné časové limity v hlavní hře. Hra jde kdykoli pozastavit.
- [ ] Každé přetažení má alternativu kliknutím (WCAG 2.5.7).
- [ ] Ovladatelnost klávesnicí jako alternativa, viditelný fokus.
- [ ] Čtečky obrazovky: ARIA popisky a `aria-live` hlášení
      („Krystal 3 rozsvícen. Celková váha 5.“).
- [ ] `prefers-reduced-motion`, vypínání částic, regulace rychlosti animací.
- [ ] Škálování textu, písmo pro dyslexii, světlý motiv.
- [ ] Titulky pro všechny repliky a vizuální náhrada zvukových signálů.
- [ ] Žádné blikání > 3 Hz.
- [ ] Automatický audit (axe-core) v CI + ruční test s NVDA.

---

## 11. Technické řešení

### 11.1 Doporučený stack

| Vrstva | Volba | Proč |
|---|---|---|
| platforma | **web (PWA)** | žádná instalace, funguje na školních Chromeboocích, tabletech i PC, offline |
| jazyk | **TypeScript** | typová bezpečnost pro logiku obvodů a data levelů |
| build | **Vite** | rychlý vývoj |
| UI | **Svelte 5** (alternativa React) | jemná reaktivita, málo kódu, výborné přechody a animace |
| vykreslení | **SVG + CSS** | ostré při jakémkoli rozlišení, čitelný text, nativní přístupnost a hit-testing |
| pozadí/efekty | Canvas 2D (lehký vlastní částicový systém) | oddělené od herní plochy, vypínatelné |
| zvuk | **Web Audio API** (případně Tone.js) | procedurální tóny, nulová velikost assetů |
| ukládání | localStorage + export/import „pečetního kódu“ | bez serveru a bez osobních údajů |
| testy | **Vitest** (logika), **Playwright** (e2e), **axe-core** (přístupnost) | |
| desktop (volitelně) | Tauri | pozdější vydání na Steam / itch.io |

**Proč ne herní engine (Unity/Godot):** hra je převážně UI a hádanky. Webové technologie dávají
lepší čitelnost textu, přístupnost a dostupnost ve školách. Godot by dával smysl jen při
posunu k bohatší 2D/3D prezentaci.

### 11.2 Architektura

Logika je **přísně oddělená od UI**. Celé jádro jde testovat bez prohlížeče.

```
src/
  core/                    # čistá logika, žádné UI
    bits.ts                # převody, sčítání, posuny, doplňkový kód, hex, ASCII
    circuit/
      graph.ts             # uzly (vstup, výstup, hradlo, součástka) a vodiče
      evaluate.ts          # kombinační vyhodnocení (topologické řazení)
      sequential.ts        # zpětné vazby, takt, detekce oscilace
      components.ts        # skládání součástek (abstrakce)
    puzzles/               # jeden modul na archetyp: config → state → check
      altar.ts  inscription.ts  counter.ts  cascade.ts  tide.ts
      gate.ts   tablet.ts       workshop.ts mask.ts     cipher.ts ...
    generator/             # procedurální úlohy pro Cvičnou komnatu
    scoring.ts             # pečetě, par
    hints.ts
  content/
    levels/act1..act6/*.ts # data levelů
    kodex/*.md             # stránky Kodexu
    i18n/cs.json en.json
  game/
    store.ts               # stav hry a progres
    save.ts                # ukládání, verze schématu, migrace
    router.ts              # Titul ↔ Mapa ↔ Level ↔ Kodex ↔ Nastavení
  ui/
    components/            # Crystal, BitRow, Dial, Rune, Wire, TruthTable,
                           # ActionBar, HintPanel, EchoBubble, KodexPanel
    screens/               # Title, Map, Level, Kodex, Settings, Practice
    theme/tokens.css       # barvy, písma, rozestupy, motivy
  audio/                   # syntéza tónů, ambient
  fx/                      # částice, přechody
tools/
  validate-levels.ts       # CI: řešitelnost, par, návaznost konceptů
  level-editor/            # interní editor levelů (fáze 3)
tests/
```

### 11.3 Datový model levelu

Levely jsou data, ne kód. Přidání levelu = jeden soubor.

```ts
type Notation = 'glyph' | 'dual' | 'modern';
type ConceptId = 'bit' | 'combinations' | 'place-value' | 'carry' | 'xor' | /* … */ string;

interface LevelDef {
  id: string;                    // "I-04"
  act: 1 | 2 | 3 | 4 | 5 | 6;
  kind: PuzzleKind;              // 'altar' | 'inscription' | 'cascade' | 'workshop' | …
  title: Localized;
  teaches: ConceptId[];          // co level zavádí
  requires: ConceptId[];         // co musí hráč už znát (kontroluje validátor)
  config: PuzzleConfig;          // specifické pro archetyp
  scaffolding: {
    showWeights: boolean;
    showSum: boolean;
    showDigits: boolean;
    notation: Notation;
  };
  hints: [Localized, Localized, HintAction];   // náznak, strategie, ukázka
  par?: { moves?: number; gates?: number };    // dopočítá validátor
  echo?: { intro?: Localized[]; solved?: Localized[] };
  unlocks?: { kodex?: string[]; shard?: string };
}

// Příklad: I-4 Váhy kamenů
export default {
  id: 'I-04', act: 1, kind: 'altar',
  title: { cs: 'Váhy kamenů', en: 'Weight of Stones' },
  teaches: ['place-value'], requires: ['bit', 'combinations'],
  config: { bits: 3, targets: [5, 3, 6, 7] },
  scaffolding: { showWeights: true, showSum: true, showDigits: false, notation: 'glyph' },
  hints: [
    { cs: 'Který krystal je nejtěžší?' },
    { cs: 'Začni největší váhou, která se ještě vejde.' },
    { type: 'highlight', target: 'next-correct-bit' },
  ],
  unlocks: { kodex: ['place-value'] },
} satisfies LevelDef;
```

### 11.4 Simulátor obvodů

- Obvod je orientovaný graf. **Kombinační** část se vyhodnocuje topologickým řazením.
- Při cyklu (zpětné vazbě) se přepne do **sekvenčního režimu**: iteruje se do ustálení,
  maximálně *N* kroků. Pokud se stav neustálí, hlásí se **oscilace**. Zobrazí se klidnou ikonou
  „neklidu“, ne blikáním.
- **Zkouška** projde všech 2ⁿ kombinací vstupů (u sekvenčních obvodů posloupnost taktů),
  porovná výstupy s tabulkou a vrátí první neshodu pro vizuální zpětnou vazbu.
- **Součástky:** vyřešený obvod jde zabalit do nové runy s vlastními vstupy a výstupy
  (IV-3 a dál). Simulátor je vyhodnocuje rekurzivně.
- Vyhodnocení musí být rychlé (< 1 ms pro typický level), aby šlo překreslovat při každém kliku.

### 11.5 Validátor a generátor

- `validate-levels` běží v CI a pro každý level ověří:
  - **řešitelnost** (vlastní řešitel: BFS/brute-force u malých stavových prostorů,
    u Dílny referenční řešení),
  - **par** (minimum tahů nebo hradel) pro pečeť přesnosti,
  - **návaznost osnovy**: žádný level nepožaduje koncept, který ještě nebyl zaveden (`requires` ⊆ dříve `teaches`).
- **Generátor** Cvičné komnaty vytváří úlohy s řízenou obtížností (počet bitů, počet přenosů,
  počet hradel) a každou ověří řešitelem.

### 11.6 Ukládání a lokalizace

- Uložení: verzované schéma v localStorage s migracemi. Ve webové aplikaci (PWA) je hra
  i s postupem uložená v zařízení; nainstalovaná hra žádá o trvalé úložiště.
- **Pečetní kód:** progres exportovaný jako krátký hex řetězec. Je tematický a umožní přenos mezi
  zařízeními bez serveru.
- Lokalizace: čeština primárně, angličtina sekundárně. Žádný text není vložený do obrázků.

### 11.7 Testování

- Jádro (`core/`) ≥ 90 % pokrytí: převody, aritmetika, simulátor, archetypy.
- E2E: Playwright automaticky „dohraje“ Akt I pomocí řešitele (regresní test celé hry).
- Přístupnost: axe-core v CI, ruční průchod klávesnicí a s NVDA.
- Výkon: měření fps na referenčním slabém zařízení.

---

## 12. Plán vývoje

Předpoklad: 1–2 vývojáři (s asistencí AI) + externí výpomoc s ilustracemi a zvukem.
Odhady jsou v týdnech čisté práce.

### Fáze 0 — Předprodukce (2 týdny)
- [ ] Dokončit osnovu a mapu konceptů (co na čem stojí).
- [ ] Moodboard, paleta, typografie, první skici krystalu, runy a čtveřicových glyfů.
- [ ] **Papírové prototypy** 4 archetypů (Oltář, Nápis, Kaskáda, Brána) a test se 3–5 lidmi z cílovky.
- [ ] Technický spike: SVG krystaly + Web Audio tóny + živý přepočet hodnoty.
- **Výstup:** schválený GDD, style guide v1, ověřená technologie.

### Fáze 1 — Vertikální řez (4 týdny)
- [ ] Kostra projektu (Vite + Svelte + TS), design tokeny, router obrazovek.
- [ ] `core/bits`, archetypy Oltář, Nápis a Počítadlo + testy.
- [ ] **Celý Akt I** (10 levelů), nápovědy, zpětná vazba na chyby, ukládání.
- [ ] Jedna obrazovka ve finální vizuální a zvukové kvalitě (laťka pro zbytek).
- [ ] Playtest s 5–8 hráči a první metriky.
- **Milník M1:** Akt I je hratelný od začátku do konce a ukazuje cílový pocit ze hry.

### Fáze 2 — Jádro systémů (5 týdnů)
- [ ] Simulátor obvodů, archetypy Brána, Deska zákona, Dílna, Maska, Šifra.
- [ ] Mapa observatoře, Kodex s mechanikou překladu, pečetě, nastavení přístupnosti, i18n.
- [ ] **Akt II a Akt III.**
- **Milník M2 (MVP / alfa):** Akty I–III (32 levelů) hratelné v prohlížeči.

### Fáze 3 — Obsah (6 týdnů)
- [ ] Součástky (abstrakce), sekvenční logika, **Akt IV**.
- [ ] Archetypy Léčitel, Mozaika, Zpěv. **Akt V a Finále.**
- [ ] Cvičná komnata (generátor), Denní věštba, střepy, epilog.
- [ ] Interní editor levelů a validátor v CI.
- **Milník M3 (beta):** celá hra je hratelná od začátku do konce.

### Fáze 4 — Vyladění (3 týdny)
- [ ] Animace, „šťáva“ (juice), hudba a ambient všech pater, Echo a jeho postupně čistší řeč.
- [ ] Onboarding, ladění obtížnosti podle metrik, výkon (60 fps na Chromebooku).
- [ ] Audit přístupnosti a opravy.

### Fáze 5 — Testování a vydání (2–3 týdny)
- [ ] Pilot ve škole: celá třída, pre/post test, rozhovory.
- [ ] Opravy, PWA, nasazení (vlastní web / itch.io), volitelně build přes Tauri.
- [ ] Materiály pro učitele: tisknutelná shrnutí pater, mapování na RVP (informatika).
- **Milník M4:** vydání 1.0.

**Celkem zhruba 22–23 týdnů (asi 5–6 měsíců).** MVP (M2) je hotové po 11 týdnech.

```
Týden:      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
Fáze 0     ██ ██
Fáze 1           ██ ██ ██ ██                                    ▲M1 (t. 6)
Fáze 2                       ██ ██ ██ ██ ██                     ▲M2 (t. 11)
Fáze 3                                      ██ ██ ██ ██ ██ ██   ▲M3 (t. 17)
Fáze 4                                                        ██ ██ ██
Fáze 5                                                                 ██ ██ ██ ▲M4
```

---

## 13. MVP a hranice rozsahu

**MVP (M2) obsahuje:** Akty I–III, 7 archetypů, Kodex, nápovědy, pečetě, ukládání, čeština,
základní přístupnost (barvy, velikost cílů, klikání místo přetahování, reduced motion), web.

**MVP neobsahuje:** Akty IV–V a Finále, Cvičnou komnatu, Denní věštbu, angličtinu, editor
levelů, desktopový build.

**Pravidlo proti nafukování rozsahu:** nový archetyp se přidá jen tehdy, když nějaký koncept
osnovy nejde naučit těmi stávajícími.

---

## 14. Testování s hráči a metriky

### Co měříme (lokálně, anonymně, jen v testovacím buildu s exportem do JSON)

| Metrika | Účel | Cíl |
|---|---|---|
| dokončení levelu | odhalit bariéry | ≥ 90 % v Aktu I |
| čas na level | ladění délky | 2–6 min |
| počet pokusů a chyb | najít skoky obtížnosti | bez náhlých skoků mezi sousedními levely |
| využití nápovědy 3. stupně | level je moc těžký nebo nejasný | ≤ 15 % hráčů |
| místo odchodu ze hry | kde hra ztrácí pozornost | žádný level s výrazným odpadem |
| pre/post test | učí hra? | zlepšení ≥ 30 % |

### Jak testujeme

- **Hlasité přemýšlení:** hráč komentuje, co dělá, my mlčíme a zapisujeme.
- Po levelu jedna otázka: *„Co ses teď dozvěděl/a?“* Ověřujeme, že aha moment opravdu nastal.
- Testy po každé fázi, vždy alespoň 5 nových hráčů z cílové skupiny.

---

## 15. Rizika

| Riziko | Dopad | Zmírnění |
|---|---|---|
| hra působí „školsky“ | ztráta motivace | objev před výkladem, příběh, zvuk a vizuální odměny, žádné známkování |
| skok obtížnosti u logiky a stavby obvodů | odpad hráčů v Aktu III–IV | Brána (vkládání do hotového obvodu) před Dílnou (volná stavba), vodiče dvěma kliky, metriky |
| mystický styl zhorší čitelnost | frustrace | ozdobné jen pozadí, přísná pravidla kontrastu a písem, test čitelnosti v každé fázi |
| chybné nebo neřešitelné levely | nedůvěra ve hru | validátor a řešitel v CI, e2e průchod |
| nafukování rozsahu | nedokončení | jasné MVP, pravidlo pro nové archetypy, milníky |
| pokročilá témata (Hamming, sekvenční logika) jsou moc těžká | odpad | označit jako volitelná, víc opor, Cvičná komnata |
| výkon na slabých zařízeních | trhání | SVG/CSS místo těžkého WebGL, vypínatelné efekty, měření fps |

---

## 16. Rozšíření do budoucna

- **Akt VI: Zpěvy Srdce** — jednoduchý asemblerový jazyk, smyčky, podmínky, mini-programování.
- **Editor levelů pro učitele a komunitu**, sdílení levelů kódem.
- **Učitelský režim:** ✓ zapíná se PINem v Nastavení (posílá ho autor), odemkne všechna patra, přehled třídy
  ze souborů s postupem (bez serveru) a tisknutelný pracovní list patra s klíčem odpovědí. Zbývá:
  sdílený přehled bez ručního sbírání souborů (vyžaduje backend).
- Další témata: desetinná čísla, komprese, základy kryptografie.
- Mobilní vydání (Capacitor/Tauri mobile), Steam (Tauri).

---

## 17. Nejbližší kroky

1. *Rozhodnuto:* název Světlo & Stín, cílová skupina sexta gymnázia, stack Vite + Svelte 5 +
   TypeScript.
2. ~~Založit projekt~~ ✓ (Vite + Svelte 5 + TypeScript, design tokeny).
3. ~~`core/bits.ts` a archetyp Oltář s testy~~ ✓
4. ~~Komponenta Krystal, Oltář s živým součtem a tóny, Echo, Kodex, pečetě~~ ✓
5. ~~Prototyp levelů I-1 až I-5~~ ✓
6. ~~Doplnit I-6 až I-10 (archetypy Nápis a Počítadlo) a dokončit tak Akt I~~ ✓
7. ~~Akt II, Síň Počtářů: archetypy Kaskáda (počítání pod sebou) a Příliv (posuny)~~ ✓
   Mapa má přepínač pater, Kodex kapitoly, glyfy druhého patra rozsvícený střed.
8. **Další krok: playtest Aktů I a II s 3–5 studenty sexty.** Sledovat hlavně kotouče v I-6,
   bránu I-7 bez vah, jestli hráči v II-3 pochopí krystaly přenosu bez výkladu a jestli
   rychlejší hráči v Hlubších síních sami objeví, že tahy v II-9 kopírují dvojkový zápis.
9. ~~Rozložení pro nízké obrazovky (1366 × 768 s lištami prohlížeče, okno asi 657 px)~~ ✓
   Zadání stojí vedle krystalů, Echo se na širších obrazovkách drží nad trámem. Fonty nemají
   znaky ₂, ⁿ ani šipky, proto se indexy sázejí jako horní a dolní index a šipky se kreslí.
10. **Rozdělení pater na základ (1–7) a Hlubší síně (8–15).**
    Fáze 1 ✓: mapa se dvěma řadami a zapečetěnými místy, nové číslování s převodem uloženého
    postupu i souborů s postupem, smíšená komnata (brána Síně: Kaskáda a Příliv), brána
    Předsíně na čtyřech krystalech, „Zpět“ nevrací tahy, kvízy se míchají.
    Fáze 2 ✓: devět nových pokročilých komnat (I-11 až I-15, II-11 až II-13, II-15), v násobení
    II-10 vybírá posunuté kopie hráč sám. Nové mechaniky: přísný Oltář (Grayův kód), kotouče
    s glyfy, přenos o dvě místa, páka převrácení, miska zbytku. Obě patra mají všech 15 komnat.
11. **Příprava na playtest a Akt III ✓:**
    - učitelský režim na PIN (všechny komnaty otevřené) a přehled třídy ze souborů s postupem,
    - statistiky komnat a jméno hráče v souboru s postupem (název souboru nese jméno),
    - připomínka uložení po komnatě a značka na mapě (zelená = ukládá se do souboru),
    - kvízy s losovanými čísly, správná odpověď napoprvé do pečeti přesnosti,
    - pečeť odvahy bere jen ukázka kroku,
    - šipky na desce Kaskády, šestnáctkový znak komnaty na mapě po Řeči glyfů,
    - shrnutí patra k tisku,
    - obsluha komnaty rozdělená podle archetypů (`src/ui/screens/level/`),
    - úsporná grafika, kterou hra zapne sama, když se trhá (méně než 24 snímků za vteřinu).
    Zbývá vyzkoušet na skutečném školním počítači.
12. **Akt III, Zahrada Bran, fáze A ✓:** základ III-1 až III-7, archetypy Brána a Deska zákona,
    runy NOT, AND, OR, XOR (NAND a NOR skládáním), glyfy patra s kosočtvercem uprostřed, sedm
    záznamů Kodexu. Fáze B ✓: Hlubší síně III-8 až III-15, točité kameny vstupů run, runy Rovnost a Důsledek,
    tři vstupy, starý obvod jako vzor, archetyp Maska se šifrou XOR, osm záznamů Kodexu.
13. **Distribuce jako webová aplikace (PWA) ✓:** service worker uloží celou hru do zařízení
    (běží offline), manifest a ikony pro instalaci na počítači, Androidu i iPhonu, nabídka nové
    verze mimo komnaty, workflow pro GitHub Pages, relativní cesty pro libovolný hosting.
    Samostatné HTML zůstává pro počítače bez internetu. Zbývá: projít všechny komnaty na telefonu
    na výšku i na šířku a doladit rozložení a dotykové cíle.
14. **Playtest tří modelových žáků a úpravy ✓:** zpráva v `PLAYTEST.md`, cílené hlášky chyb u Nápisu,
    opory mizící uvnitř komnaty, zkouška navíc v branách po ukázce kroku, Echo nabídne náznak, když
    hráč uvízne. Kolo na pozadí ukazuje glyf rozehrané komnaty. Nultá komnata v každém patře
    (I-0 Probuzení, nová I-1 Ticho, II-0 Jedna a jedna, III-0 Cesta světla, postup se převede)
    a světla v Kaskádě se při každém doteku přesouvají do výsledku a přenosů.
15. **Akt IV, Hlubina Strojů ✓:** archetyp Dílna (`src/core/puzzles/machine.ts`, `src/ui/machine/`):
    stroje s víc lampami a čísly, součástky (sčítačky, výhybka, ozvěny), zpětná vazba s ustálením
    a hlášením neklidu, tep a zkušební posloupnosti, cíle s nejkratší cestou pro nápovědu a ideál.
    Základ IV-0 až IV-7 (sčítačky, abstrakce, porovnávač, výhybka, rozdělovač), Hlubší síně IV-8 až
    IV-15 (ozvěna, tep, registr, čítač, odčítačka, volič operace, násobička), glyfy patra se
    čtverečkem uprostřed, 15 záznamů Kodexu, losované brány.
16. **Backlog z playtestů a sazby ✓ (17. 11. 2026):** ukázka kroku s důvodem ve všech archetypech,
    vysvětlení typických chyb v kvízu, schody mezi patry se Strážcem schodů, Zkusit bránu hned,
    Do Hlubších síní po bráně, Desku znám, nečitelná slova, která přeloží Kodex, Sudé a liché v I-9,
    Počítadlo v II-1 a Soutok s Dvěma řadami v II-2 (převod postupu, rozvržení 4), pracovní list.
    Podrobně v `PLAYTEST.md` (kap. 10) a `TYPOGRAFIE.md`.
17. **Úpravy Síně Počtářů (19. 11. 2026):** nová hra začíná nultou komnatou I-0 (titulní obrazovka
    vedla natvrdo do I-1). Soutok je teď hračka v II-0 (1 + 0, 0 + 1, 1 + 1) a v II-2 je nová komnata
    Dvě dvojky se Zákonem dvojice; Dvě řady zanikly. Postup se převede na rozvržení 5: stará II-2 se
    sloučí do II-0, nová II-2 začíná neodehraná a přeložený Soutok z Kodexu zmizí.
18. **Akt V, Archiv Hlasů:** nová osnova v rozdělení 0–15 (kap. 6, 17. 11. 2026). Po stavbě
    playtest kompletního průchodu jen základní cestou Aktů I až V a Finále: ověří, že základní cesta
    Archivu nic z Hlubších síní nepotřebuje.
