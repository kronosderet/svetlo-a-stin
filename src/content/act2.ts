import { genII10, genII14, genII2, genII3, genII4, genII5, genII7Cascade, genII7Tide, genII8, genII9 } from './generators';
import type { ActDef, LevelDef } from './types';

const CELL_HINT = 'Zvýrazněný krystal je potřeba přepnout.';

const levels: LevelDef[] = [
  {
    id: 'II-1',
    title: 'Soutok',
    kind: 'cascade',
    config: {
      width: 2,
      bits: 1,
      carries: 'none',
      tasks: [
        { op: 'add', operands: [1, 0] },
        { op: 'add', operands: [1, 1] },
        { op: 'add', operands: [1, 1, 1] },
      ],
    },
    presentation: {
      task: 'Světlo ze všech řad stéká do nádrže. Rozsviť dole tolik světla, kolik ho připlulo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showWeights: true,
      columnCounts: true,
      showValues: true,
    },
    hints: [
      'Kolik světla stéká do sloupce? A kolik váží krystaly dole?',
      'Jedno světlo váží 1, dvě váží 2. Dvojku ale nezapíšeš dvěma jedničkami, na to je tu krystal s váhou 2.',
      CELL_HINT,
    ],
    echo: {
      intro: ['Síň Počtářů. Tady Lumenité světla sčítali.', 'Světlo z řad krystalů stéká do nádrže. Kolik ho připlulo?'],
      step: {
        0: 'Jedna a nic je jedna. To bylo snadné.',
        1: 'Jedna a jedna se do jednoho krystalu nevejdou. Přetekly do sousedního: 10.',
      },
      complete: 'Tři světla ze tří řad: 11. Jedno zůstalo dole, jedno přeteklo.',
      solved: ['Jedna a jedna jsou dvě. Lumenité to psali jako 10.', 'Co se do krystalu nevejde, přeteče doleva.'],
      skill: 'Všechny soutoky napoprvé.',
    },
    quiz: [
      {
        question: 'Kolik je 1 + 1 ve dvojkové soustavě?',
        options: ['2', '10', '11', '1'],
        correct: 1,
        hint: 'Ve dvojkové soustavě máš jen číslice 0 a 1. Dvojka se musí zapsat jinak.',
        explain: '1 + 1 = 10₂. Jednička přeteče do sloupce s váhou 2 a ve sloupci jednotek zůstane 0.',
      },
      {
        question: 'A kolik je 1 + 1 + 1 + 1?',
        options: ['1111', '100', '11', '1000'],
        correct: 1,
        hint: 'Sečti po dvojicích: (1 + 1) + (1 + 1) = 10 + 10.',
        explain: 'Čtyři = 100₂. Dvě dvojky přetečou do sloupce s váhou 4.',
      },
    ],
    kodex: 'soutok',
  },
  {
    id: 'II-2',
    title: 'Dvě řady',
    kind: 'cascade',
    config: {
      width: 4,
      carries: 'none',
      tasks: [
        { op: 'add', operands: [0b0101, 0b0010] },
        { op: 'add', operands: [0b1000, 0b0011] },
        { op: 'add', operands: [0b0100, 0b1001] },
        { op: 'add', operands: [0b1010, 0b0101] },
      ],
    },
    generate: genII2,
    presentation: {
      task: 'Sečti dvě řady sloupec po sloupci.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      columnCounts: true,
      showValues: true,
    },
    hints: [
      'Dívej se na každý sloupec zvlášť. Kolik světla do něj stéká?',
      'Kde stéká jedno světlo, rozsviť dole krystal. Kde nestéká žádné, nech ho zhasnutý.',
      CELL_HINT,
    ],
    echo: {
      intro: ['Delší řady. Každý sloupec teče sám za sebe.', 'Sečti je sloupec po sloupci.'],
      step: {
        0: 'Přijato. A přitom stačilo opsat světla dolů.',
        2: 'Zatím žádný sloupec nepřetekl. To se brzy změní.',
      },
      solved: ['Sčítat se dá po sloupcích, jeden vedle druhého.', 'Dokud žádný sloupec nepřeteče, stačí světla opsat dolů.'],
      skill: 'Čtyři součty, čtyři potvrzení.',
    },
    kodex: 'proudy',
  },
  {
    id: 'II-3',
    title: 'Krystaly přenosu',
    kind: 'cascade',
    config: {
      width: 5,
      bits: 4,
      carries: 'manual',
      tasks: [
        { op: 'add', operands: [0b0011, 0b0001] },
        { op: 'add', operands: [0b0101, 0b0011] },
        { op: 'add', operands: [0b0110, 0b0111] },
        { op: 'add', operands: [0b1011, 0b0110] },
      ],
    },
    generate: genII3,
    presentation: {
      task: 'Sečti řady. Co přeteče, zapiš krystalem přenosu nad další sloupec.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      columnCounts: true,
    },
    hints: [
      'Začni vpravo. Když se ve sloupci slijí dvě světla, kam se jedno z nich podělo?',
      'Dvě světla: dole stín a krystal přenosu nad sousedním sloupcem vlevo. Tři světla: dole světlo a krystal přenosu.',
      CELL_HINT,
    ],
    echo: {
      intro: [
        'Tady sloupce přetékají.',
        'Co se do sloupce nevejde, zapiš krystalem přenosu nad sloupec vlevo. Brána chce vidět i přenosy.',
      ],
      step: {
        0: 'Přenos přeskočil dva sloupce. Jako voda, která se přelévá z misky do misky.',
        2: 'Tři světla v jednom sloupci: jedno zůstane, jedno přeteče.',
      },
      complete: 'Přenos doputoval až do pátého krystalu.',
      solved: [
        'Dvě světla ve sloupci: dole stín, jedno přeteče. Tři světla: dole světlo, jedno přeteče.',
        'Takhle sčítá každý počítač na světě.',
      ],
      skill: 'Každý přenos na svém místě napoprvé.',
    },
    quiz: [
      {
        question: 'Ve sloupci se slévají tři světla (1 + 1 a přenos 1). Co zapíšeš dolů a co přeteče?',
        options: ['dole 1, přenos 1', 'dole 0, přenos 1', 'dole 1, žádný přenos', 'dole 11'],
        correct: 0,
        hint: 'Tři je dvojkově 11.',
        explain: '1 + 1 + 1 = 11₂: dole zůstane 1 a jednička přeteče do dalšího sloupce.',
      },
    ],
    kodex: 'sloupec',
  },
  {
    id: 'II-4',
    title: 'Velká kaskáda',
    kind: 'cascade',
    config: {
      width: 7,
      bits: 6,
      carries: 'manual',
      tasks: [
        { op: 'add', operands: [0b011111, 0b000001] },
        { op: 'add', operands: [0b101101, 0b011011] },
        { op: 'add', operands: [0b111111, 0b111111] },
      ],
    },
    generate: genII4,
    presentation: {
      task: 'Šest krystalů v každé řadě. Přenosy se řetězí.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
    },
    hints: [
      'Postupuj zprava, sloupec po sloupci. Přenos z jednoho sloupce mění ten další.',
      'V každém sloupci spočítej světla i s krystalem přenosu: dvě dají dole stín a přenos, tři dají dole světlo a přenos.',
      CELL_HINT,
    ],
    echo: {
      intro: ['Velká kaskáda. Světlo tu padá přes šest stupňů.', 'Počty pod sloupci zmizely. Počítej sám.'],
      step: {
        0: 'Přenos proběhl pěti sloupci, jeden za druhým.',
        1: 'Zbývá poslední: všechna světla dvakrát.',
      },
      complete: 'Sto dvacet šest. Sedm krystalů, i když řady měly jen šest.',
      solved: [
        'Přenos se může řetězit přes celou řadu jako kaskáda vodopádů.',
        'Proto má součet o krystal víc než sčítance.',
      ],
      skill: 'Celá kaskáda bez jediného zaváhání.',
    },
    quiz: [
      {
        question: 'Kolik krystalů nejvýš potřebuje součet dvou šestimístných dvojkových čísel?',
        options: ['6', '7', '8', '12'],
        correct: 1,
        hint: 'Největší součet je 63 + 63. Kolik krystalů unese 126?',
        explain:
          'Součet dvou n-bitových čísel má nejvýš n + 1 bitů: 63 + 63 = 126 = 1111110₂ se vejde do sedmi krystalů.',
      },
    ],
    kodex: 'kaskada',
  },
  {
    id: 'II-5',
    title: 'Přetékající nádoba',
    kind: 'cascade',
    config: {
      width: 4,
      carries: 'manual',
      overflow: true,
      tasks: [
        { op: 'add', operands: [0b0101, 0b0110] },
        { op: 'add', operands: [0b1100, 0b0110] },
        { op: 'add', operands: [0b1001, 0b0100] },
        { op: 'add', operands: [0b1111, 0b0001] },
      ],
    },
    generate: genII5,
    presentation: {
      task: 'Nádoba má jen čtyři krystaly. Co se nevejde, pošli do přepadu.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showValues: true,
    },
    hints: [
      'Kolik nejvíc unesou čtyři krystaly? Vejde se součet?',
      'Sčítej jako obvykle. Přenos z nejlevějšího sloupce nemá kam jít: pošli ho do přepadu vlevo.',
      CELL_HINT,
    ],
    echo: {
      intro: [
        'Tahle nádoba je vytesaná z jednoho kamene. Víc krystalů do ní nevložíš.',
        'Co se nevejde, vyteče přepadem.',
      ],
      step: {
        0: 'Vešlo se. Tohle nádoba unese.',
        1: 'Tohle se nevešlo. Šestnáct vyteklo a v nádobě zbyl jen zbytek.',
      },
      complete: 'Patnáct a jedna, a nádoba je prázdná. Všechno vyteklo.',
      solved: [
        'Nádoba o čtyřech krystalech unese nejvýš patnáct. Co je víc, přeteče a ztratí se.',
        'Proto se nádoby staví dost velké.',
      ],
      skill: 'Přepad hlídáš bez jediné chyby.',
    },
    quiz: [
      {
        question: 'Kolik krystalů by nádoba potřebovala, aby se do ní vešlo 1100 + 0110 = 18?',
        options: ['4', '5', '6', '8'],
        correct: 1,
        hint: 'Čtyři krystaly unesou nejvýš 15, pět krystalů nejvýš 31.',
        explain: '18 = 10010₂ má pět číslic. Pětijiskrová nádoba unese až 31.',
      },
      {
        question: 'Oktáva (bajt) drží 255. Co v ní zůstane, když přičteš 1?',
        options: ['256', '0', '255', '1'],
        correct: 1,
        hint: '255 = 1111 1111. Přenos proběhne všemi osmi krystaly.',
        explain:
          '1111 1111 + 1 = 1 0000 0000. Deváté světlo se do oktávy nevejde, vyteče a zůstane 0. Tomu se říká přetečení.',
      },
    ],
    kodex: 'nadoba',
  },
  {
    id: 'II-6',
    title: 'Příliv a odliv',
    kind: 'tide',
    config: {
      bits: 6,
      ops: ['shl', 'shr'],
      tasks: [{ start: 3, target: 6 }, { target: 24 }, { target: 3 }, { start: 13, target: 6 }, { start: 5, target: 40 }],
    },
    presentation: {
      task: 'Páky posouvají všechna světla najednou. Dosáhni váhy, kterou žádá oltář.',
      showDigits: true,
      showSum: true,
      sizes: 'equal',
      ledger: true,
      levers: 'shift',
    },
    hints: [
      'Zatáhni za páku a sleduj, co se stane s váhou světla.',
      'Posun vlevo váhu zdvojí, posun vpravo ji rozpůlí. Kolikrát musíš zdvojit nebo rozpůlit?',
      'Zvýrazněná páka vede nejkratší cestou.',
    ],
    echo: {
      intro: [
        'Příliv a odliv. Lumenité tu světlo nepřidávali ani neubírali, jen ho posouvali.',
        'Zkus páky a sleduj, co se stane s váhou.',
      ],
      spill: 'Světlo spadlo přes okraj. Co přeteče, je pryč.',
      step: {
        0: 'Tři… šest. Posun vlevo světlo zdvojil.',
        1: 'Dvakrát zdvojit je čtyřikrát víc.',
        2: 'Odliv půlí. Tři je zpátky.',
        3: 'Třináct napůl je šest a půl. Ta půlka spadla přes okraj.',
      },
      solved: [
        'Posun vlevo zdvojí, posun vpravo rozpůlí.',
        'Každé světlo se posune na místo s dvojnásobnou, nebo poloviční váhou.',
      ],
      skill: 'Ani jeden zbytečný tah pákou.',
    },
    quiz: [
      {
        question: 'Světla 0011 0100 (52) posuneš o jedno místo vpravo. Kolik budou vážit?',
        options: ['26', '104', '25', '13'],
        correct: 0,
        hint: 'Posun vpravo rozpůlí.',
        explain: '0011 0100 → 0001 1010 = 26. Nejpravější krystal byl ve stínu, takže se nic neztratilo.',
      },
      {
        question: 'Co udělá posun o dvě místa vlevo?',
        options: ['přičte 2', 'vynásobí 4', 'vynásobí 2', 'přičte 4'],
        correct: 1,
        hint: 'Jeden posun zdvojí. A druhý?',
        explain: 'Každý posun vlevo násobí dvěma: 2 · 2 = 4. Obecně posun o k míst násobí 2ᵏ.',
      },
    ],
    kodex: 'priliv',
  },
  {
    id: 'II-7',
    title: 'Brána Síně',
    kind: 'mixed',
    echo: {
      intro: ['Brána Síně Počtářů. Projde jen ten, kdo umí světla sčítat i posouvat.', 'Dvě zkoušky: nejdřív kaskáda, potom páky.'],
      solved: [
        'Brána Síně Počtářů se otevírá. Umíš světla sčítat i posouvat, a na tom stojí každé počítání.',
        'Na dveřích se rozsvítila čtvrtá strana glyfu: Hlubší síně Počtářů jsou otevřené.',
      ],
      skill: 'Celá brána bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'II-7',
        title: 'Kaskáda',
        kind: 'cascade',
        config: {
          width: 6,
          bits: 5,
          carries: 'manual',
          tasks: [
            { op: 'add', operands: [0b01011, 0b00111] },
            { op: 'add', operands: [0b10110, 0b01101] },
            { op: 'add', operands: [0b11011, 0b10110] },
          ],
        },
        generate: genII7Cascade,
        presentation: {
          task: 'První zkouška: sečti řady. Přenosy zapiš nad sloupce.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
        },
        hints: [
          'Postupuj zprava, sloupec po sloupci. Přenos z jednoho sloupce mění ten další.',
          'V každém sloupci spočítej světla i s krystalem přenosu: dvě dají dole stín a přenos, tři dají dole světlo a přenos.',
          CELL_HINT,
        ],
        echo: {
          intro: ['První zkouška: tři součty, pět krystalů v řadě.'],
          step: { 0: 'Sečteno. Brána se pohnula.', 1: 'Ještě jeden součet.' },
          solved: ['Kaskáda proběhla. Teď páky.'],
        },
      },
      {
        id: 'II-7',
        title: 'Páky',
        kind: 'tide',
        config: {
          bits: 6,
          ops: ['shl', 'shr'],
          tasks: [{ start: 3, target: 24 }, { start: 40, target: 5 }, { start: 27, target: 6 }],
        },
        generate: genII7Tide,
        presentation: {
          task: 'Druhá zkouška: páky posouvají všechna světla najednou. Dosáhni váhy, kterou žádá brána.',
          showDigits: true,
          showSum: true,
          sizes: 'equal',
          ledger: true,
          levers: 'shift',
        },
        hints: [
          'Kolikrát musíš světlo zdvojit, nebo rozpůlit?',
          'Posun vlevo váhu zdvojí, posun vpravo ji rozpůlí. Co spadne přes pravý okraj, je pryč.',
          'Zvýrazněná páka vede nejkratší cestou.',
        ],
        echo: {
          intro: ['Druhá zkouška: páky. Kolikrát zdvojit, kolikrát rozpůlit?'],
          spill: 'Světlo spadlo přes okraj. Co přeteče, je pryč.',
          step: { 0: 'Správně. Brána se pohnula.', 1: 'Poslední váha.' },
          complete: 'Páky dosáhly všech vah. Brána se ptá naposledy.',
          solved: [],
        },
        quiz: [
          {
            question: 'Nádoba unese čtyři krystaly. Co v ní zůstane po 1100 + 0110 (12 + 6)?',
            options: ['0010', '10010', '1111', '0110'],
            correct: 0,
            hint: 'Sečti a podívej se, jestli se výsledek vejde do čtyř krystalů.',
            explain: '12 + 6 = 18 = 10010₂. Páté světlo (16) se do nádoby nevejde a vyteče, zůstane 0010 = 2.',
          },
          {
            question: 'Světla 0000 0110 (6) posuneš o tři místa vlevo. Kolik budou vážit?',
            options: ['48', '18', '9', '24'],
            correct: 0,
            hint: 'Každý posun vlevo zdvojí.',
            explain: '6 · 2 · 2 · 2 = 48 = 0011 0000₂. Posun o tři místa násobí 2³ = 8.',
          },
        ],
      },
    ],
    kodex: 'pocetari',
  },
  {
    id: 'II-8',
    title: 'Odliv',
    kind: 'cascade',
    config: {
      width: 4,
      carries: 'manual',
      tasks: [
        { op: 'sub', operands: [0b0111, 0b0010] },
        { op: 'sub', operands: [0b0110, 0b0011] },
        { op: 'sub', operands: [0b1000, 0b0001] },
        { op: 'sub', operands: [0b1101, 0b0110] },
      ],
    },
    generate: genII8,
    presentation: {
      task: 'Odečti spodní řadu od horní. Kde nemáš z čeho brát, půjč si od souseda vlevo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showValues: true,
    },
    hints: [
      'Začni vpravo. Jde v tomhle sloupci odečítat? Když ne, kdo ti může půjčit?',
      'Půjčené světlo má ve sloupci váhu dvou: 0 − 1 s výpůjčkou je 10 − 1 = 1. Výpůjčku zapiš krystalem pod spodní řadu ve sloupci vlevo, odečte se spolu s ní. Nad sloupcem vpravo se objeví dva krystaly.',
      CELL_HINT,
    ],
    echo: {
      intro: [
        'Hlubší síně Počtářů. Tady se počítá i pozpátku.',
        'Odliv: světla ubývají. Kde nemáš z čeho brát, půjč si od souseda vlevo.',
      ],
      step: {
        0: 'Sedm bez dvou je pět. Zatím bez půjčování.',
        1: 'Půjčené světlo se ve sloupci rozpadlo na dvě. Jedno se odečetlo, jedno zůstalo.',
        2: 'Výpůjčka prošla několika sloupci. Přenos pozpátku.',
      },
      solved: ['Odčítání je sčítání pozpátku: místo přenosu si půjčuješ.', 'Půjčené světlo váží ve sloupci vpravo dvě.'],
      skill: 'Každá výpůjčka napoprvé.',
    },
    kodex: 'odliv',
  },
  {
    id: 'II-9',
    title: 'Zdvojení',
    kind: 'tide',
    config: {
      bits: 5,
      ops: ['shl', 'inc'],
      tasks: [
        { start: 1, target: 6 },
        { start: 1, target: 11 },
        { start: 1, target: 21 },
        { start: 1, target: 27 },
      ],
    },
    generate: genII9,
    presentation: {
      task: 'Začni jediným světlem. Jen zdvojením a přidáním jedné dosáhni požadované váhy.',
      showDigits: true,
      showSum: true,
      sizes: 'equal',
      ledger: true,
      levers: 'math',
    },
    hints: [
      'Zkus to od konce: je cíl sudý, nebo lichý? Liché číslo vzniklo přidáním jedné, sudé zdvojením.',
      'Podívej se na dvojkový zápis cíle. Za každou další číslici zdvoj, a když je to jednička, přidej jednu.',
      'Zvýrazněná páka vede nejkratší cestou.',
    ],
    echo: {
      intro: ['Zdvojení. Z jediného světla tu Lumenité vystavěli každé číslo.', 'Máš jen dvě páky: zdvoj a přidej jednu.'],
      step: {
        0: 'Šest. Podívej se na krystaly: 110.',
        1: 'Podívej se na krystaly a do zápisníku. V jakém pořadí šly páky?',
      },
      complete: 'Zdvoj, přidej, zdvoj… Porovnej páky s krystaly. Zní ti to povědomě?',
      solved: [
        'Zdvojení připíše vpravo stín, přidání jedné ho rozsvítí.',
        'Dvojkový zápis je tedy přesný návod, jak číslo z jediného světla vystavět.',
      ],
      skill: 'Každé číslo nejkratší cestou.',
    },
    quiz: [
      {
        question: 'Jakými tahy dostaneš z 1 číslo 13 (1101)?',
        options: ['×2, +1, ×2, ×2, +1', '×2, ×2, +1, ×2, +1', '+1, ×2, +1, ×2, ×2', '×2, +1, ×2, +1, ×2'],
        correct: 0,
        hint: 'Čti 1101 zleva. První jednička je start, za každou další číslici zdvoj a u jedničky přidej jednu.',
        explain: '1 → 11 → 110 → 1101: ×2 +1, ×2, ×2 +1. Tahy kopírují číslice zápisu.',
      },
      {
        question: 'Kolik tahů nejméně potřebuješ z 1 na 16?',
        options: ['4', '5', '8', '15'],
        correct: 0,
        hint: '16 = 10000₂.',
        explain: 'Čtyřikrát zdvojit: 1 → 2 → 4 → 8 → 16. Za každou nulu jeden tah ×2.',
      },
    ],
    kodex: 'zdvojeni',
  },
  {
    id: 'II-10',
    title: 'Násobení po lumenitsku',
    kind: 'cascade',
    config: {
      width: 6,
      bits: 3,
      carries: 'manual',
      tasks: [
        { op: 'mul', operands: [0b101, 0b11] },
        { op: 'mul', operands: [0b111, 0b101] },
        { op: 'mul', operands: [0b110, 0b110] },
      ],
    },
    generate: genII10,
    presentation: {
      task: 'Násob po lumenitsku: posunuté kopie prvního čísla sečti.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showValues: true,
    },
    hints: [
      'Každá jednička druhého čísla přinesla jednu kopii prvního. Proč je kopie posunutá?',
      'Posun vlevo zdvojuje. Kopie pod jedničkou s váhou 2 je posunutá o jedno místo, pod váhou 4 o dvě. Teď kopie sečti jako obvykle.',
      CELL_HINT,
    ],
    echo: {
      intro: [
        'Násobení po lumenitsku. Násobilku tu nikdo neznal, a přesto násobili.',
        'Stačil jim posun a sčítání.',
      ],
      step: {
        0: 'Pětkrát tři: pětka a k ní zdvojená pětka. Patnáct.',
        1: 'Každá jednička druhého čísla přinesla jednu posunutou kopii.',
      },
      complete: 'Žádná násobilka. Jen posun a sčítání.',
      solved: [
        'Násobit dvojkově znamená posouvat a sčítat.',
        'Lumenité nepotřebovali násobilku. Stačily jim páky z Přílivu a Kaskáda.',
      ],
      skill: 'Tři součiny bez chyby.',
    },
    quiz: [
      {
        question: 'Kolik kopií prvního čísla sčítáš při násobení číslem 1011?',
        options: ['2', '3', '4', '11'],
        correct: 1,
        hint: 'Kopie přibude za každou jedničku.',
        explain: '1011 má tři jedničky: kopie posunuté o 0, 1 a 3 místa (×1, ×2, ×8). 1 + 2 + 8 = 11.',
      },
    ],
    kodex: 'nasobeni',
  },
  {
    id: 'II-14',
    title: 'Váhy Osudu',
    kind: 'tide',
    config: {
      bits: 6,
      ops: ['shl', 'shr', 'inc', 'dec'],
      strict: true,
      tasks: [
        { start: 7, target: 30 },
        { start: 40, target: 11 },
        { start: 12, target: 47 },
        { start: 50, target: 13 },
        { start: 5, target: 39 },
      ],
    },
    generate: genII14,
    presentation: {
      task: 'Vyrovnej misky. Osud dovolí jen tolik tahů, kolik je nezbytně potřeba.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      levers: 'math',
      scale: true,
    },
    hints: [
      'Porovnej obě váhy ve dvojkovém zápisu. Které krystaly se liší?',
      'Zdvojení posune světla vlevo, půlení vpravo, páky ±1 doladí konec. Někdy je kratší přestřelit a pak ubrat.',
      'Zvýrazněná páka vede nejkratší cestou.',
    ],
    echo: {
      intro: [
        'Váhy Osudu. Nejtěžší zkouška Hlubších síní.',
        'Osud dovolí jen tolik tahů, kolik je nezbytně potřeba. Kdo je přečerpá, začíná znovu.',
      ],
      reset: 'Tahy došly a misky se vrátily. Promysli cestu dřív, než zatáhneš.',
      step: { 0: 'Vyrovnáno. Osud kývl.', 2: 'Osud vidí, že počítáš dopředu.' },
      complete: 'Poslední miska se vyrovnala.',
      solved: [
        'Váhy Osudu se vyrovnaly.',
        'Umíš sčítat, odčítat, násobit i dělit. Stačí ti k tomu světlo a posun.',
      ],
      skill: 'Misky se ani jednou nevrátily.',
    },
    quiz: [
      {
        question: 'Kolik je 1010 − 0011?',
        options: ['0111', '1001', '0101', '1101'],
        correct: 0,
        hint: 'Vpravo je 0 − 1: půjč si od souseda.',
        explain: '1010 − 0011 = 0111, tedy 10 − 3 = 7.',
      },
      {
        question: 'Jak nejrychleji spočítáš 0101 × 4?',
        options: ['posunem o dvě místa vlevo', 'čtyřmi sčítáními', 'posunem o čtyři místa vlevo', 'přičtením 100'],
        correct: 0,
        hint: '4 = 100₂.',
        explain: 'Násobit čtyřmi znamená dvakrát zdvojit, tedy posunout o dvě místa: 0101 → 10100 = 20.',
      },
    ],
  },
];

export const ACT_II: ActDef = {
  numeral: 'II',
  title: 'Síň Počtářů',
  theme: 'Sčítání a přenos',
  glyphBase: 16,
  levels,
  nextAct: { numeral: 'III', title: 'Zahrada Bran', theme: 'Logika' },
};
