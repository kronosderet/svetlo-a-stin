import type { KodexEntry } from './types';

export const KODEX: KodexEntry[] = [
  {
    id: 'jiskra',
    glyph: 0b0001,
    ancientName: 'Krystal',
    modernName: 'Bit',
    ancient: 'Nejmenší kus světla. Buď svítí, nebo mlčí. Nic mezi tím.',
    modern:
      'Bit (z angl. binary digit) je nejmenší jednotka informace. Nabývá jedné ze dvou hodnot. Ve stroji to může být proud, nebo žádný proud; zmagnetováno, nebo ne; světlo, nebo tma.',
    today: 'Moderní procesor má desítky miliard tranzistorů. Každý z nich je drobný vypínač: proud buď pustí, nebo ne.',
  },
  {
    id: 'svit-stin',
    glyph: 0b1010,
    ancientName: 'Světlo a stín',
    modernName: '1 a 0',
    ancient: 'Lumenité psali jen dvěma znaky: světlem a stínem.',
    modern:
      'Světlo zapisujeme jako 1, stín jako 0. Řadu krystalů pak čteme jako řetězec číslic: rozsvícený a zhasnutý krystal dají 10 (čti jedna-nula, ne deset). Odteď uvidíš pod krystaly i moderní zápis.',
    today: 'Celý obsah tvého telefonu (fotky, zprávy, hudba) je jen velmi dlouhá řada nul a jedniček.',
  },
  {
    id: 'podoby',
    glyph: 0b0111,
    ancientName: 'Zákon zdvojení',
    modernName: '2ⁿ kombinací',
    ancient: 'Každý nový krystal zdvojí svět.',
    modern:
      'n bitů má 2ⁿ různých kombinací: 1 bit → 2, 2 bity → 4, 3 bity → 8, 8 bitů → 256. Důvod: každý další bit může každou dosavadní kombinaci doplnit buď nulou, nebo jedničkou.',
    formula: 'počet kombinací = 2ⁿ',
    today: 'Osm bitů tvoří bajt. Jeden bajt rozliší 256 hodnot, tolik odstínů má jeden barevný kanál pixelu.',
  },
  {
    id: 'vaha',
    glyph: 0b1100,
    ancientName: 'Váha světla',
    modernName: 'Poziční hodnota',
    ancient: 'Každý krystal váží dvakrát víc než soused po pravici.',
    modern:
      'Ve dvojkové soustavě je váha každé pozice mocninou dvou: zprava 1, 2, 4, 8, 16… Hodnota čísla je součet vah těch pozic, na kterých stojí 1.',
    formula: '101₂ = 1·4 + 0·2 + 1·1 = 5',
    today: 'Desítková soustava funguje stejně, jen s vahami 1, 10, 100… Číslo 101₁₀ = 1·100 + 0·10 + 1·1.',
  },
  {
    id: 'prevod',
    glyph: 0b1101,
    ancientName: 'Hledání vah',
    modernName: 'Převod do dvojkové soustavy',
    ancient: 'Nejdřív nejtěžší kámen, který se vejde. Pak další.',
    modern:
      'Hladový postup: projdi váhy od největší. Když se váha vejde do zbytku, zapiš 1 a odečti ji, jinak zapiš 0. Největší číslo z n bitů je 2ⁿ − 1, tedy samé jedničky.',
    formula: '13 = 8 + 4 + 1 = 1101₂',
    today:
      'Druhý způsob: opakovaně děl dvěma a zbytky čti odzdola nahoru. 13 → 6 zb. 1 → 3 zb. 0 → 1 zb. 1 → 0 zb. 1, tedy 1101₂.',
  },
  {
    id: 'mocniny',
    glyph: 0b1000,
    ancientName: 'Řada vah',
    modernName: 'Mocniny dvojky',
    ancient: 'Kámen váhy zapomene. Kdo zná řadu, nepotřebuje je vidět.',
    modern:
      'Váhy pozic jsou mocniny dvojky. Pozice se číslují zprava od nuly a pozice i váží 2ⁱ. Každá váha je dvojnásobkem předchozí. Vyplatí se znát řadu zpaměti aspoň do 2¹⁰ = 1024.',
    formula: '2⁰ … 2¹⁰ = 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024',
    today:
      'Proto mají paměti „divné“ velikosti jako 512 nebo 4096 bajtů. A proto kibibajt (KiB) není 1000, ale 1024 bajtů.',
  },
  {
    id: 'cteni',
    glyph: 0b1011,
    ancientName: 'Čtení nápisu',
    modernName: 'Převod z dvojkové soustavy',
    ancient: 'Sečti váhy krystalů, které svítí. Stín neváží nic.',
    modern:
      'Dvojkové číslo převedeš do desítkové soustavy tak, že sečteš váhy pozic, na kterých stojí 1. Jde to i zleva bez znalosti vah: začni nulou a u každé číslice dosavadní hodnotu zdvojnásob a přičti tu číslici.',
    formula: '1101₂: 1 → 1·2 + 1 = 3 → 3·2 + 0 = 6 → 6·2 + 1 = 13',
    today:
      'Postup zleva se jmenuje Hornerovo schéma. Počítač ho používá, když čte číslo napsané v textu, jen místo dvojkou násobí desítkou.',
  },
  {
    id: 'preliti',
    glyph: 0b0100,
    ancientName: 'Předání',
    modernName: 'Přenos (carry)',
    ancient: 'Když krystal přeteče, zhasne a předá světlo sousedovi vlevo.',
    modern:
      'Přičtení jedničky: zprava měň jedničky na nuly, dokud nenarazíš na nulu, a tu změň na jedničku. Jednička, která se tak posouvá doleva, se jmenuje přenos. V desítkové soustavě je to totéž: 0999 + 1 = 1000.',
    formula: '0111₂ + 1 = 1000₂   (7 + 1 = 8)',
    today:
      'Počítadlo kilometrů v autě předává desítky stejně: 0999 → 1000. Procesor si přenos pamatuje ve zvláštním bitu, kterému se říká příznak přenosu (carry flag).',
  },
  {
    id: 'venec',
    glyph: 0b1111,
    ancientName: 'Oktáva',
    modernName: 'Bajt',
    ancient: 'Osm krystalů v řadě. Nejtěžší světlo oktávy váží dvě stě padesát pět.',
    modern:
      'Osm bitů tvoří bajt. Bajt má 2⁸ = 256 kombinací, tedy hodnoty 0 až 255. Obecně je největší číslo z n bitů tvořené samými jedničkami a platí pro něj 2ⁿ − 1. Přičteš-li k němu jedničku, přenos proběhne všemi bity a vznikne 2ⁿ.',
    formula: '11111111₂ = 2⁸ − 1 = 255',
    today:
      'Barva pixelu se obvykle ukládá do tří bajtů: červená, zelená a modrá. Každý kanál má tedy hodnoty 0–255 a dohromady vychází 256³, přes 16,7 milionu barev.',
  },
  {
    id: 'predsin',
    glyph: 0b1001,
    ancientName: 'Zákony Předsíně',
    modernName: 'Shrnutí Aktu I',
    ancient: 'Kdo prošel Předsíní, umí světlem číst i psát.',
    modern:
      'Bit má dvě hodnoty. n bitů má 2ⁿ kombinací a zapíše čísla 0 až 2ⁿ − 1. Pozice váží zprava 1, 2, 4, 8… Čtení: sečti váhy jedniček. Zápis: od největší váhy, která se vejde.',
    formula: '45 = 32 + 8 + 4 + 1 = 101101₂',
    today:
      'Tohle je celá abeceda počítačů. Stojí na ní sčítání, logika i paměť, které čekají v dalších patrech observatoře.',
  },

  {
    id: 'gray',
    glyph: 0b0011,
    ancientName: 'Tichý krok',
    modernName: 'Grayův kód',
    ancient: 'Každým krokem jediná změna a žádná kombinace dvakrát.',
    modern:
      'Grayův kód seřadí všech 2ⁿ kombinací tak, že se sousední liší v jediném bitu. Zrcadlová stavba: vezmi kód pro n − 1 bitů, připiš ho ještě jednou pozpátku, první polovině dej vlevo 0 a druhé 1.',
    formula: '00 → 01 → 11 → 10',
    today:
      'Otočné snímače polohy (třeba v kolečku myši nebo v robotech) používají Grayův kód: když se mění jediný bit, nemůže čidlo při přechodu omylem přečíst úplně jinou hodnotu.',
  },
  {
    id: 'glyf',
    glyph: 0b1110,
    ancientName: 'Čtveřicový glyf',
    modernName: 'Šestnáctková číslice',
    ancient: 'Čtyři strany, čtyři světla, šestnáct znaků.',
    modern:
      'Čtyři bity mají 16 kombinací, a to je přesně jedna číslice šestnáctkové soustavy: 0–9 a pro 10 až 15 písmena A–F. Každá čtveřice bitů se tak přepíše jediným znakem.',
    formula: '1101₂ = 8 + 4 + 1 = 13 = D₁₆',
    today: 'Programátoři píšou šestnáctkově adresy v paměti, kódy chyb i barvy na webu. Je to jen kratší zápis dvojkových čísel.',
  },
  {
    id: 'dvojznak',
    glyph: 0b0110,
    ancientName: 'Dvojznak',
    modernName: 'Bajt šestnáctkově',
    ancient: 'Oktáva se dá napsat dvěma glyfy.',
    modern:
      'Bajt má osm bitů, tedy dvě čtveřice. Každá čtveřice je jedna šestnáctková číslice, takže se bajt zapíše dvěma znaky od 00 do FF. Levý znak váží šestnáctkrát víc než pravý.',
    formula: '1011 0110₂ = B6₁₆ = 11 · 16 + 6 = 182',
    today: 'Barva #FF8800 jsou tři bajty: červená FF = 255, zelená 88 = 136, modrá 00 = 0. Dohromady oranžová.',
  },
  {
    id: 'predsin-hloub',
    glyph: 0b0101,
    ancientName: 'Hlubší zákony Předsíně',
    modernName: 'Shrnutí Hlubších síní I',
    ancient: 'Kdo prošel velkou bránou Předsíně, umí krystaly počítat, číst po oktávách i psát glyfy.',
    modern:
      'Přičtení jedničky je přenos zprava. Oktáva (bajt) nese čísla 0 až 255, n bitů nejvýš 2ⁿ − 1. Grayův kód projde všechny kombinace po jediné změně. Šestnáctková soustava zapíše každou čtveřici bitů jedním znakem.',
    formula: '255 = 1111 1111₂ = FF₁₆',
    today: 'Tím končí abeceda dat. Z bajtů a šestnáctkových zápisů se skládá všechno, co počítač uloží.',
  },

  // Akt II, Síň Počtářů: glyfy mají rozsvícený střed.
  {
    id: 'soutok',
    glyph: 0b10010,
    ancientName: 'Soutok',
    modernName: 'Sčítání bitů',
    ancient: 'Jedna a jedna se do jednoho krystalu nevejdou. Přetečou k sousedovi.',
    modern:
      'Sčítání ve dvojkové soustavě má jen čtyři případy: 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 a 1 + 1 + 1 = 11. Jakmile součet ve sloupci dosáhne dvou, jednička přeteče do sloupce vlevo, kde váží dvakrát víc.',
    formula: '1 + 1 = 10₂   ·   1 + 1 + 1 = 11₂',
    today: 'V desítkové soustavě se přetéká až při deseti (5 + 5 = 10). Ve dvojkové stačí dvě světla.',
  },
  {
    id: 'proudy',
    glyph: 0b10101,
    ancientName: 'Dvě řady',
    modernName: 'Sčítání pod sebou',
    ancient: 'Každý sloupec teče sám za sebe, zprava doleva.',
    modern:
      'Čísla se sčítají pod sebou po sloupcích, stejně jako v desítkové soustavě. Dokud v žádném sloupci nejsou dvě jedničky, výsledek je prostě sjednocení jedniček obou čísel.',
    formula: '0101₂ + 0010₂ = 0111₂   (5 + 2 = 7)',
    today: 'Když se dvě čísla v žádném bitu nepřekrývají, sčítání dá stejný výsledek jako bitové OR. To potkáš v Zahradě Bran.',
  },
  {
    id: 'sloupec',
    glyph: 0b10011,
    ancientName: 'Zákon sloupce',
    modernName: 'Sčítání s přenosem',
    ancient: 'Spočítej světla ve sloupci. Každá dvojice přeteče, co zbude, zůstane dole.',
    modern:
      'V každém sloupci sečti oba bity a přenos zprava. Výsledek 0 až 3 zapiš dvojkově: nižší číslici napiš dolů, vyšší pošli jako přenos do dalšího sloupce.',
    formula: '0 → 0   ·   1 → 1   ·   2 → 0, přenos 1   ·   3 → 1, přenos 1',
    today:
      'Obvod, který tohle pravidlo počítá pro jeden sloupec, se jmenuje úplná sčítačka (full adder). Postavíš si ji v Hlubině Strojů.',
  },
  {
    id: 'kaskada',
    glyph: 0b11111,
    ancientName: 'Kaskáda',
    modernName: 'Řetězení přenosu',
    ancient: 'Přenos padá ze stupně na stupeň jako voda.',
    modern:
      'Přenos z jednoho sloupce může způsobit přenos v dalším, a tak dál přes celé číslo. Součet dvou n-bitových čísel má proto nejvýš n + 1 bitů.',
    formula: '011111₂ + 1 = 100000₂   (31 + 1 = 32)',
    today:
      'Nejjednodušší sčítačka v procesoru řadí úplné sčítačky za sebe a přenos jimi probíhá postupně (ripple carry). Rychlé procesory přenos předvídají dopředu, aby nemusely čekat.',
  },
  {
    id: 'nadoba',
    glyph: 0b10000,
    ancientName: 'Přetékající nádoba',
    modernName: 'Přetečení (overflow)',
    ancient: 'Co se do nádoby nevejde, vyteče a je navždy ztracené.',
    modern:
      'Počítač ukládá čísla do pevného počtu bitů. Když součet potřebuje víc bitů, nejvyšší přenos se ztratí a zůstane jen zbytek. Ve 4 bitech je 12 + 6 = 18 − 16 = 2, v bajtu je 255 + 1 = 0.',
    formula: '1100₂ + 0110₂ = (1)0010₂   →   ve 4 bitech zbyde 2',
    today:
      'Přetečení způsobilo i skutečné havárie. Proto si procesor ztracený přenos poznamená do příznaku přenosu (carry flag) a programy si ho mohou zkontrolovat.',
  },
  {
    id: 'odliv',
    glyph: 0b10001,
    ancientName: 'Odliv',
    modernName: 'Odčítání s výpůjčkou',
    ancient: 'Kde nemáš z čeho brát, půjč si od souseda vlevo.',
    modern:
      'Odčítá se po sloupcích zprava. Když je ve sloupci 0 − 1, půjčíš si od sloupce vlevo: půjčená jednička má ve sloupci vpravo váhu 2, takže 10 − 1 = 1. Ve sloupci vlevo pak výpůjčku odečteš.',
    formula: '1000₂ − 0001₂ = 0111₂   (8 − 1 = 7)',
    today:
      'Procesory většinou odčítají jinak: přičtou takzvaný doplněk menšitele. Díky tomu jim stačí jedna sčítačka pro sčítání i odčítání.',
  },
  {
    id: 'priliv',
    glyph: 0b10110,
    ancientName: 'Příliv a odliv',
    modernName: 'Bitový posun',
    ancient: 'Posuň světla vlevo a jejich váha se zdvojí. Posuň je vpravo a polovina zmizí.',
    modern:
      'Posun vlevo (shift left, <<) přidá vpravo nulu a každý bit se ocitne na místě s dvojnásobnou váhou: číslo se vynásobí dvěma. Posun vpravo (>>) číslo vydělí dvěma a nejnižší bit se ztratí, takže 13 >> 1 = 6.',
    formula: '0101₂ << 1 = 1010₂ (5 · 2 = 10)   ·   1101₂ >> 1 = 0110₂ (13 : 2 = 6, zbytek 1)',
    today: 'V desítkové soustavě funguje totéž s desítkou: připsáním nuly násobíš deseti. Programátoři posunem násobí a dělí mocninami dvou.',
  },
  {
    id: 'zdvojeni',
    glyph: 0b11011,
    ancientName: 'Zdvojení',
    modernName: 'Zápis jako návod',
    ancient: 'Z jediného světla vystavíš každé číslo. Návod je v jeho zápisu.',
    modern:
      'Čti dvojkový zápis zleva. Začni první jedničkou a za každou další číslici zdvoj; je-li to jednička, přidej ještě jedna. Je to Hornerovo schéma z Čtení nápisu, tentokrát jako stavební návod.',
    formula: '1011₂: 1 → ×2 → 10 → ×2 +1 → 101 → ×2 +1 → 1011 = 11',
    today:
      'Stejně počítače rychle umocňují: x¹³ nespočítají dvanácti násobeními, ale pár umocněními na druhou a násobeními podle zápisu 1101₂.',
  },
  {
    id: 'nasobeni',
    glyph: 0b11110,
    ancientName: 'Lumenitské násobení',
    modernName: 'Násobení posunem a sčítáním',
    ancient: 'Kdo umí posouvat a sčítat, nepotřebuje násobilku.',
    modern:
      'Za každou jedničku druhého činitele napiš první činitel posunutý na její místo a kopie sečti. Násobilka je ve dvojkové soustavě jen 0 · 1 = 0 a 1 · 1 = 1.',
    formula: '101₂ · 11₂ = 101₂ + 1010₂ = 1111₂   (5 · 3 = 15)',
    today: 'Tak násobí jednoduché procesory a stejně se násobí i pod sebou na papíře, jen s desítkovými ciframi.',
  },
  {
    id: 'pocetari',
    glyph: 0b11001,
    ancientName: 'Zákony Síně',
    modernName: 'Shrnutí Aktu II',
    ancient: 'Kdo prošel bránou Síně Počtářů, umí světla sčítat, zdvojovat i půlit.',
    modern:
      'Sčítání po sloupcích s přenosem (2 → 0 a přenos, 3 → 1 a přenos). Součet dvou n-bitových čísel má nejvýš n + 1 bitů; při pevné šířce to, co se nevejde, přeteče. Posun vlevo = ×2, posun vpravo = ÷2 (co vypadne, se ztratí).',
    formula: '0110₂ + 0111₂ = 1101₂   ·   0101₂ << 2 = 10100₂',
    today:
      'Tyhle operace umí aritmetická jednotka každého procesoru (ALU). Odčítání a násobení najdeš v Hlubších síních, a jak ALU poskládat z hradel, v dalších patrech observatoře.',
  },
  {
    id: 'deleni',
    glyph: 0b10100,
    ancientName: 'Miska zbytku',
    modernName: 'Dělení posunem',
    ancient: 'Co spadne přes okraj, je zbytek.',
    modern:
      'Dělit číslem 2ᵏ znamená posunout o k míst vpravo. Na krystalech zůstane podíl a těch k bitů, které spadly přes okraj, je zbytek. Číslo jde vydělit 2ᵏ beze zbytku, právě když končí k nulami.',
    formula: '45 : 4 = 11 zb. 1   ·   101101₂ >> 2 = 1011₂, spadlo 01₂',
    today: 'Procesor dělí mocninami dvou posunem, protože je to mnohem rychlejší než obecné dělení. Překladače takové dělení samy nahrazují posunem.',
  },
  {
    id: 'tri-rady',
    glyph: 0b11100,
    ancientName: 'Přenos o dvě místa',
    modernName: 'Sčítání více čísel',
    ancient: 'Čtyři světla ve sloupci putují o dvě místa.',
    modern:
      'Při sčítání tří čísel se ve sloupci sejde až pět jedniček. Počet se zapíše dvojkově: poslední bit zůstane ve sloupci, další jde o jedno místo, a je-li jich čtyři a víc, jeden bit o dvě místa.',
    formula: '4 = 100₂ · 5 = 101₂   (1111 + 1111 + 1111 = 101101)',
    today: 'Rychlé násobičky v procesorech sčítají mnoho čísel naráz pomocí sčítaček, které berou tři bity a vracejí dva (carry-save).',
  },
  {
    id: 'doplnek',
    glyph: 0b11010,
    ancientName: 'Doplněk',
    modernName: 'Dvojkový doplněk',
    ancient: 'Odečíst znamená přičíst doplněk a zahodit, co přeteče.',
    modern:
      'Záporné číslo se v pevném počtu bitů zapisuje jako doplněk: převrať všechny bity a přičti 1. Pak a − b = a + doplněk(b) a přenos z nejvyššího bitu se zahodí. Nejvyšší bit zároveň říká znaménko.',
    formula: '7 − 3 = 0111 + 1101 = (1)0100 = 4',
    today: 'Takhle odčítá každý procesor. Stačí mu jedna sčítačka pro sčítání i odčítání a záporná čísla nepotřebují zvláštní znaménko.',
  },
  {
    id: 'pocetari-hloub',
    glyph: 0b10111,
    ancientName: 'Hlubší zákony Síně',
    modernName: 'Shrnutí Hlubších síní II',
    ancient: 'Kdo prošel velkou bránou Síně, umí světla ubírat, násobit i dělit.',
    modern:
      'Odčítání s výpůjčkou, nebo přičtením doplňku. Násobení je součet posunutých kopií podle jedniček druhého činitele. Dělení mocninou dvou je posun vpravo a zbytek je to, co vypadne.',
    formula: '101₂ · 110₂ = 1010₂ + 10100₂ = 11110₂   (5 · 6 = 30)',
    today: 'To je celá aritmetická jednotka procesoru. V dalších patrech observatoře se dozvíš, jak ji postavit z hradel.',
  },
  // Akt III, Zahrada Bran: glyfy mají uprostřed kosočtverec.
  {
    id: 'obracec',
    glyph: 0b100001,
    ancientName: 'Obraceč',
    modernName: 'NOT (negace)',
    ancient: 'Kde bylo světlo, je stín. Kde byl stín, je světlo.',
    modern:
      'Hradlo NOT má jeden vstup a výstup je vždy opačný: z 1 udělá 0 a z 0 udělá 1. Dvě hradla NOT za sebou se navzájem zruší.',
    formula: '¬0 = 1 · ¬1 = 0 · ¬¬A = A',
    today: 'V matematice je to negace výroku: „prší“ a „neprší“. V počítači stojí invertor skoro v každém obvodu.',
  },
  {
    id: 'pouto',
    glyph: 0b100010,
    ancientName: 'Pouto',
    modernName: 'AND (konjunkce)',
    ancient: 'Světlo projde, jen když přijde z obou stran.',
    modern: 'Hradlo AND dá na výstupu 1 jen tehdy, když jsou oba vstupy 1. Jinak dá 0.',
    formula: 'A ∧ B: 00 → 0 · 01 → 0 · 10 → 0 · 11 → 1',
    today: 'V matematice konjunkce: „prší a fouká“. Ve vyhledávači najdeš se slovem AND jen stránky, kde je obojí.',
  },
  {
    id: 'rozcesti',
    glyph: 0b100011,
    ancientName: 'Rozcestí',
    modernName: 'OR (disjunkce)',
    ancient: 'Stačí jedna cesta a světlo dorazí.',
    modern: 'Hradlo OR dá na výstupu 1, když je aspoň jeden vstup 1. Nulu dá jen tehdy, když jsou oba vstupy 0.',
    formula: 'A ∨ B: 00 → 0 · 01 → 1 · 10 → 1 · 11 → 1',
    today: 'V matematice disjunkce: „půjdu do kina, nebo do divadla“ platí i tehdy, když půjdeš na obojí.',
  },
  {
    id: 'vyluka',
    glyph: 0b100100,
    ancientName: 'Výluka',
    modernName: 'XOR (vylučovací disjunkce)',
    ancient: 'Jen jedno světlo projde. Dvě se vyruší.',
    modern:
      'Hradlo XOR dá 1, když se vstupy liší (právě jeden je 1). Je to spodní číslice součtu dvou bitů: 1 + 1 = 10, dole zůstane 0.',
    formula: 'A ⊻ B: 00 → 0 · 01 → 1 · 10 → 1 · 11 → 0',
    today: 'Česky „buď, anebo“. XOR se používá při sčítání, v šifrách a při kontrole chyb v přenesených datech.',
  },
  {
    id: 'deska',
    glyph: 0b100101,
    ancientName: 'Deska zákona',
    modernName: 'Pravdivostní tabulka',
    ancient: 'Kdo zná desku, pozná runu i pod závojem.',
    modern:
      'Pravdivostní tabulka vypíše výstup hradla nebo obvodu pro každou kombinaci vstupů. Pro n vstupů má 2ⁿ řádků. Dva obvody se stejnou tabulkou dělají totéž.',
    formula: 'n vstupů → 2ⁿ řádků',
    today: 'Stejné tabulky kreslíte v matematice u výrokové logiky. Inženýři podle nich navrhují čipy.',
  },
  {
    id: 'retezy',
    glyph: 0b100110,
    ancientName: 'Zlomené pouto a Zavřené rozcestí',
    modernName: 'NAND a NOR',
    ancient: 'Runa a za ní Obraceč dají runu novou.',
    modern:
      'NAND je AND s negací: dá 0 jen tehdy, když jsou oba vstupy 1. NOR je OR s negací: dá 1 jen tehdy, když jsou oba vstupy 0. Skládáním hradel vznikají nové funkce.',
    formula: 'NAND = ¬(A ∧ B) · NOR = ¬(A ∨ B)',
    today: 'Z hradel NAND se dá postavit úplně všechno, i celý procesor. Proto jsou čipy často vyrobené hlavně z nich.',
  },
  {
    id: 'zahrada',
    glyph: 0b100111,
    ancientName: 'Zákony Zahrady',
    modernName: 'Shrnutí Aktu III',
    ancient: 'Kdo prošel bránou Zahrady, zná runy a umí je skládat.',
    modern:
      'NOT obrací, AND chce oba vstupy, OR stačí jeden, XOR chce právě jeden. Každé hradlo popisuje pravdivostní tabulka a hradla se dají řadit za sebe (NAND, NOR) i větvit.',
    formula: '¬ · ∧ · ∨ · ⊻',
    today: 'Z těchto hradel jsou složené všechny počítače. V Hlubině Strojů z nich poskládáš sčítačku a paměť.',
  },
  {
    id: 'zrcadla',
    glyph: 0b101000,
    ancientName: 'Zrcadla',
    modernName: 'De Morganovy zákony',
    ancient: 'Obrácené Pouto je Rozcestí obrácených cest. A naopak.',
    modern:
      'Negace prohodí AND a OR, když obrátíš i oba vstupy: ¬(A ∧ B) = ¬A ∨ ¬B a ¬(A ∨ B) = ¬A ∧ ¬B. Dva obvody se stejnou pravdivostní tabulkou jsou zaměnitelné.',
    formula: '¬(A ∧ B) = ¬A ∨ ¬B · ¬(A ∨ B) = ¬A ∧ ¬B',
    today: '„Není pravda, že prší nebo fouká“ znamená „neprší a nefouká“. Stejná pravidla platí ve výrokové logice i v programech.',
  },
  {
    id: 'spojky',
    glyph: 0b101001,
    ancientName: 'Rovnost a Důsledek',
    modernName: 'Ekvivalence a implikace',
    ancient: 'Rovnost svítí, když se cesty shodnou. Důsledek zhasne, jen když slib neplatí.',
    modern:
      'Ekvivalence A ⇔ B (XNOR) platí, když mají oba vstupy stejnou hodnotu. Implikace A ⇒ B neplatí jen tehdy, když A platí a B ne; v ostatních případech platí.',
    formula: 'A ⇔ B = ¬(A ⊻ B) · A ⇒ B = ¬A ∨ B',
    today: '„Když prší, je mokro“ je implikace. Když neprší, nic neporušila, ať je mokro, nebo ne.',
  },
  {
    id: 'vetsina',
    glyph: 0b101010,
    ancientName: 'Hlas většiny',
    modernName: 'Funkce většiny',
    ancient: 'Tři strážci hlasují, brána poslechne většinu.',
    modern:
      'Funkce většiny dá 1, když jsou aspoň dva ze tří vstupů 1: (A ∧ B) ∨ (A ∧ C) ∨ (B ∧ C). Pravdivostní tabulka pro tři vstupy má osm řádků.',
    formula: 'M(A, B, C) = AB ∨ AC ∨ BC',
    today: 'Přenos z úplné sčítačky je právě hlas většiny ze tří bitů. Letadla a vesmírné lodě hlasováním tří počítačů opravují chyby.',
  },
  {
    id: 'prapecet',
    glyph: 0b101011,
    ancientName: 'Prapečeť',
    modernName: 'Univerzální hradlo NAND',
    ancient: 'Z jediné runy postavíš všechny ostatní.',
    modern:
      'Z hradel NAND jde postavit NOT (oba vstupy spojené), AND (NAND a za ním NOT) i OR (NAND obrácených vstupů). Proto je NAND univerzální: stačí na libovolný obvod.',
    formula: 'NOT A = NAND(A, A) · OR = NAND(¬A, ¬B)',
    today: 'Paměti flash ve flashkách a telefonech se jmenují NAND flash a čipy se často skládají hlavně z hradel NAND.',
  },
  {
    id: 'masky',
    glyph: 0b101100,
    ancientName: 'Masky',
    modernName: 'Bitové operace',
    ancient: 'Maska řekne runě, kde má zasáhnout.',
    modern:
      'AND, OR a XOR jde pustit na celý bajt naráz, bit po bitu. AND s maskou vybírá (kde je v masce 0, výsledek zhasne), OR nastavuje (kde je 1, rozsvítí), XOR přepíná.',
    formula: '1011 0110 AND 0000 1111 = 0000 0110',
    today: 'Programy tak čtou jednotlivé bity, nastavují práva k souborům nebo oddělují barevné kanály pixelu.',
  },
  {
    id: 'sifra',
    glyph: 0b101101,
    ancientName: 'Tajná řeč',
    modernName: 'Šifra XOR',
    ancient: 'Stejný klíč šifru zamkne i odemkne.',
    modern:
      'Zpráva XOR klíč dá šifru, šifra XOR stejný klíč dá zase zprávu, protože každý bit přepnutý dvakrát je zpátky. Písmena jsou v počítači jen čísla (ASCII: E = 69 = 0100 0101).',
    formula: '(Z ⊻ K) ⊻ K = Z',
    today: 'XOR je součástí skoro všech moderních šifer. Kdo použije náhodný klíč jen jednou, má šifru, kterou nejde prolomit.',
  },
  {
    id: 'zjednoduseni',
    glyph: 0b101110,
    ancientName: 'Méně je víc',
    modernName: 'Zjednodušení obvodu',
    ancient: 'Kde stačí jedna runa, nestav čtyři.',
    modern:
      'Dva obvody se stejnou pravdivostní tabulkou dělají totéž. Obvod jde zkrátit pomocí pravidel jako ¬¬A = A nebo De Morganových zákonů.',
    formula: '(A ∨ B) ∧ ¬(A ∧ B) = A ⊻ B',
    today: 'Návrhové programy čipů automaticky hledají kratší obvody: méně hradel znamená menší, rychlejší a úspornější čip.',
  },
  {
    id: 'zahrada-hloub',
    glyph: 0b101111,
    ancientName: 'Hlubší zákony Zahrady',
    modernName: 'Shrnutí Hlubších síní III',
    ancient: 'Kdo prošel velkou bránou Zahrady, umí runy zrcadlit, stavět z jediné a pouštět na celou oktávu.',
    modern:
      'De Morganovy zákony, ekvivalence a implikace, funkce většiny, univerzalita NAND, bitové masky, šifra XOR a zjednodušování obvodů podle pravdivostní tabulky.',
    formula: '¬(A ∧ B) = ¬A ∨ ¬B · NAND je univerzální · (Z ⊻ K) ⊻ K = Z',
    today: 'S tímhle už jde navrhnout skutečnou součástku počítače. V Hlubině Strojů z run postavíš sčítačku a paměť.',
  },
];

export function kodexById(id: string): KodexEntry | undefined {
  return KODEX.find((e) => e.id === id);
}
