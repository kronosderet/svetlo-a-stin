import {
  genII10,
  genII11,
  genII12,
  genII13Add,
  genII13Negate,
  genII14,
  genII15Fate,
  genII15Mul,
  genII15Sub,
  genII2,
  genII3,
  genII4,
  genII5,
  genII7Cascade,
  genII7Tide,
  genII8,
  genII9,
} from './generators';
import {
  qCombosNext,
  qFlips,
  qNextCount,
  qComplementSum,
  qCopies,
  qDivisible,
  qFastMul,
  qHalve,
  qHorner,
  qNegative,
  qOverflow,
  qPairSum,
  qPairWeight,
  qPowerSteps,
  qRead,
  qRemainder,
  qShiftLeft,
  qShiftMul,
  qSubtract,
  qSumBits,
  qWrite,
} from './quizzes';
import type { ActDef, LevelDef } from './types';

const levels: LevelDef[] = [
  // Nultá komnata patra: hračka se sčítáním dvou krystalů (dřív komnata Soutok).
  // 1 + 0, 0 + 1 a 1 + 1; světla se při každém doteku sama přesunou.
  {
    id: 'II-0',
    title: 'Jedna a jedna',
    kind: 'cascade',
    config: {
      width: 2,
      bits: 1,
      carries: 'none',
      conserve: true,
      tasks: [
        { op: 'add', operands: [1, 0] },
        { op: 'add', operands: [0, 1] },
        { op: 'add', operands: [1, 1] },
      ],
    },
    presentation: {
      task: 'Sečti obě řady. Rozsviť dole krystaly, které unesou jejich světlo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showWeights: true,
      columnCounts: true,
      showValues: true,
    },
    hints: [
      'Kolik světel je ve sloupci? A kolik váží krystaly dole?',
      'Jedno světlo váží 1, dvě váží 2. Do krystalu s váhou 1 se dvě světla nevejdou, na to je krystal s váhou 2.',
    ],
    echo: {
      intro: [
        'Síň Počtářů. Tady Lumenité světla sčítali.',
        'Co se do krystalu nevejde, to podle jejich {{zákona sloupce|sloupec}} přeteče dál.',
        'Dvě řady, v každé jeden krystal. Sečti je.',
      ],
      step: {
        0: 'Jedna a nic je jedna.',
        1: 'Na pořadí nezáleží. A teď dvě světla v jednom sloupci.',
      },
      solved: [
        'Dvě světla se do jednoho krystalu nevejdou. Slila se do sousedního.',
        'Jedna a jedna je 10: jedna-nula, ne deset.',
        'Víc možností dva krystaly nemají: 0 + 0, 0 + 1, 1 + 0 a 1 + 1.',
      ],
      skill: 'Napoprvé.',
    },
  },
  {
    id: 'II-1',
    title: 'Počítadlo poutníků',
    kind: 'altar',
    config: {
      bits: 4,
      goal: { kind: 'value', targets: [1, 2, 3, 4, 5, 6, 7, 8] },
      reveal: 'never',
      hintOrder: 'low',
    },
    presentation: {
      task: 'Každý poutník přidá jednu čárku. Krystaly musí ukázat, kolik jich prošlo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      counter: true,
    },
    hints: [
      'Začni vpravo. Co se stane s krystalem, který už svítí, když do něj přidáš další světlo?',
      'Zprava zhasínej svítící krystaly, dokud nenarazíš na zhasnutý. Ten rozsviť.',
    ],
    echo: {
      intro: [
        'Brána Síně počítala poutníky. Za každého jeden krok světla.',
        'Jedna a jedna je 10. Co se stane, když přičítáš po jedné pořád dál? Přichází první poutník.',
      ],
      step: {
        1: 'Dva. Krystal vpravo zhasl a předal světlo sousedovi vlevo.',
        3: 'Čtyři. Tentokrát si světlo předaly dva krystaly za sebou.',
        6: 'Sedm: tři světla vedle sebe. Co udělá další poutník?',
      },
      complete: 'Osm. Tři krystaly zhasly a jediný se rozsvítil.',
      solved: ['Když krystal přeteče, zhasne a předá světlo sousedovi vlevo.', 'Lumenité tomu říkali předání. Moderní jméno je přenos.'],
      skill: 'Žádný zbytečný dotek. Předání ovládáš.',
    },
    quiz: [
      qNextCount,
      qFlips,
    ],
    kodex: 'preliti',
  },
  {
    // Objev: dvě světla jedné váhy jsou jedno světlo o sloupec vlevo, v každém sloupci (1 + 1 = 10, 10 + 10 = 100).
    // Vlevo od každé dvojice je volno, takže krystaly přenosu ještě nejsou potřeba; srážka přijde v II-3.
    id: 'II-2',
    title: 'Dvě dvojky',
    kind: 'cascade',
    config: {
      width: 5,
      bits: 4,
      carries: 'none',
      conserve: true,
      tasks: [
        { op: 'add', operands: [0b0101, 0b0001] },
        { op: 'add', operands: [0b0010, 0b0010] },
        { op: 'add', operands: [0b1000, 0b1000] },
        { op: 'add', operands: [0b0101, 0b0100] },
        { op: 'add', operands: [0b1101, 0b1001] },
      ],
    },
    generate: genII2,
    presentation: {
      task: 'Sečti obě řady. Rozsviť dole krystaly, které unesou jejich váhu.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      columnCounts: true,
      showValues: true,
      // Váhy pod krystaly výsledku svítí v prvních třech součtech, pak zhasnou.
      fade: { weights: 3 },
    },
    hints: [
      'Najdi sloupec se dvěma světly. Kolik váží dohromady a který krystal výsledku váží stejně?',
      'Dvě světla s váhou 2 váží 4, dvě světla s váhou 8 váží 16. Krystal pod dvojicí nech zhasnutý a rozsviť krystal o sloupec vlevo. Krystal pod samotným světlem rozsviť, světlo do něj sjede.',
    ],
    echo: {
      intro: [
        'Na počítadle zhasínala světla a jedno se rozsvítilo vlevo. Proč zrovna vlevo?',
        'Jedna a jedna je 10, to už víš. A co dvě světla v jiném sloupci?',
        'Váhy pod krystaly výsledku vydrží jen tři součty.',
      ],
      step: {
        0: 'Vpravo jedna a jedna, to znáš. Čtyřka jen sjela dolů.',
        1: 'Dvě a dvě jsou pořád čtyři, jen se to tu píše 10 + 10 = 100. Světel ubylo, váha zůstala.',
        2: 'Osm a osm je šestnáct. Světlo přeteklo do pátého krystalu, i když řady mají jen čtyři. Teď váhy zhasnou.',
        3: 'Jedno světlo ve sloupci zůstane dole, dvojice přeteče. Každý sloupec teče sám za sebe.',
      },
      complete: 'Dva sloupce přetekly naráz a nepřekážely si. Dvě světla s váhou 8 přetekla až do pátého krystalu.',
      solved: [
        'Dvě světla jedné váhy jsou jedno světlo o sloupec vlevo. Krystal vlevo totiž váží dvakrát víc, v každém sloupci stejně.',
        'Zatím měla každá dvojice vlevo volno. Co když tam už světlo bude?',
      ],
      skill: 'Všech pět součtů napoprvé.',
    },
    quiz: [qPairSum, qPairWeight],
    kodex: 'dvojice',
  },
  {
    id: 'II-3',
    title: 'Krystaly přenosu',
    kind: 'cascade',
    config: {
      width: 5,
      bits: 4,
      carries: 'manual',
      conserve: true,
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
    ],
    echo: {
      intro: [
        'Tady dvojice přetéká i do sloupce, kde už světlo je.',
        'Odteď zapiš každé přetečení krystalem přenosu nad sloupec vlevo, i do prázdného sloupce.',
        'Kaskáda chce vidět všechny přenosy.',
      ],
      step: {
        0: 'Přenos prošel dvěma sloupci, jeden za druhým. Jako voda, která se přelévá z misky do misky.',
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
      conserve: true,
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
      // Počty pod sloupci vydrží první součet, ať nemizí zároveň s delší řadou.
      fade: { counts: 1 },
    },
    hints: [
      'Postupuj zprava, sloupec po sloupci. Přenos z jednoho sloupce mění ten další.',
      'V každém sloupci spočítej světla i s krystalem přenosu: dvě dají dole stín a přenos, tři dají dole světlo a přenos.',
    ],
    echo: {
      intro: ['Velká kaskáda. Světlo tu padá přes šest stupňů.', 'Počty pod sloupci vydrží jen první součet.'],
      step: {
        0: 'Přenos proběhl pěti sloupci, jeden za druhým. Teď počty pod sloupci zmizí.',
        1: 'Zbývá poslední: všechna světla dvakrát.',
      },
      complete: 'Sto dvacet šest. Sedm krystalů, i když řady měly jen šest.',
      solved: [
        'Přenos se může řetězit přes celou řadu jako kaskáda vodopádů.',
        'Proto může mít součet o krystal víc než sčítance, nikdy ne o dva.',
      ],
      skill: 'Celá kaskáda bez jediného zaváhání.',
    },
    quiz: [
      qSumBits,
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
      conserve: true,
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
        question: 'Kolik krystalů by nádoba potřebovala, aby se do ní vešel součet 1100₂ + 0110₂ = 18?',
        options: ['4', '5', '6', '8'],
        correct: 1,
        hint: 'Čtyři krystaly unesou nejvýš 15, pět krystalů nejvýš 31.',
        explain: '18 = 10010₂ má pět číslic. Nádoba s pěti krystaly unese až 31.',
      },
      {
        question: 'V nádobě z osmi krystalů (bajt) svítí všechna světla: 255. Co v ní zůstane, když přičteš 1?',
        options: ['256', '0', '255', '1'],
        correct: 1,
        hint: '255 = 1111 1111. Přenos proběhne všemi osmi krystaly.',
        explain:
          '1111 1111 + 1 = 1 0000 0000. Deváté světlo se do osmi krystalů nevejde, vyteče a zůstane 0. Tomu se říká přetečení.',
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
      qHalve,
      qShiftMul,
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
          task: 'První zkouška: sečti řady. Přenosy zapiš nad sloupce. Brána krystaly nehlídá: co kam teče, spočítej v hlavě.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
        },
        hints: [
          'Postupuj zprava, sloupec po sloupci. Přenos z jednoho sloupce mění ten další.',
          'V každém sloupci spočítej světla i s krystalem přenosu: dvě dají dole stín a přenos, tři dají dole světlo a přenos.',
        ],
        echo: {
          intro: [
            'První zkouška: sčítání, pět krystalů v řadě.',
            'Krystaly se tu rozsvítí, i když do nich žádné světlo nepřiteče. Kudy světla tečou, ukáže brána až po přijatém součtu.',
          ],
          // Repliky bez počtu: po ukázce kroku přidá brána na konec zkoušku navíc.
          step: { 0: 'Sečteno. Brána se pohnula.', 1: 'I tenhle součet sedí.' },
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
        ],
        echo: {
          intro: ['Druhá zkouška: páky. Kolikrát zdvojit, kolikrát rozpůlit?'],
          spill: 'Světlo spadlo přes okraj. Co přeteče, je pryč.',
          step: { 0: 'Správně. Brána se pohnula.', 1: 'I tahle váha sedí.' },
          complete: 'Páky dosáhly všech vah. Brána se ptá naposledy.',
          solved: [],
        },
        quiz: [
          qOverflow,
          qShiftLeft,
        ],
      },
    ],
    kodex: 'pocetari',
  },
  {
    // Odčítání se jmenuje Výpůjčka: „odliv“ patří posunu vpravo v Přílivu a odlivu (II-6).
    id: 'II-8',
    title: 'Výpůjčka',
    kind: 'cascade',
    config: {
      width: 4,
      carries: 'manual',
      conserve: true,
      tasks: [
        { op: 'sub', operands: [0b0111, 0b0010] },
        { op: 'sub', operands: [0b0110, 0b0011] },
        { op: 'sub', operands: [0b1000, 0b0001] },
        { op: 'sub', operands: [0b1101, 0b0110] },
      ],
      // Druhá úloha je ukázková: výpůjčky jsou už zapsané a hráč dopočítá jen výsledek.
      demo: 1,
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
      'Půjčené světlo váží ve sloupci dvě: 10 − 1 = 1. Když nemá co půjčit ani soused, jdi vlevo k prvnímu volnému světlu a půjčuj od něj sloupec po sloupci doprava.',
    ],
    echo: {
      intro: [
        'Hlubší síně Počtářů. Tady se počítá i pozpátku.',
        'Výpůjčka. Světla tu ubývají. Kde nemáš z čeho brát, půjč si od souseda vlevo.',
      ],
      step: {
        0: 'Sedm bez dvou je pět, zatím bez půjčování. V další úloze jsem výpůjčky zapsal za tebe: prohlédni si je a dopočítej výsledek.',
        1: 'Půjčené světlo se ve sloupci rozpadlo na dvě. Jedno se odečetlo, jedno zůstalo. Teď výpůjčky zapisuješ ty.',
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
      'Jdi od cíle zpátky: od lichého čísla odečti jednu, sudé rozpul, dokud nedojdeš k jedničce. Páky pak použij v opačném pořadí.',
    ],
    echo: {
      intro: ['Zdvojení. Z jediného světla tu Lumenité vystavěli každé číslo.', 'Máš jen dvě páky: zdvoj a přidej jednu.'],
      incFromOne: 'Z jedničky dá +1 totéž co ×2. Lumenité ale vždy začínali zdvojením.',
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
      qHorner,
      qPowerSteps,
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
      conserve: true,
      pickCopies: true,
      tasks: [
        { op: 'mul', operands: [0b101, 0b11] },
        { op: 'mul', operands: [0b111, 0b101] },
        { op: 'mul', operands: [0b110, 0b110] },
      ],
    },
    generate: genII10,
    presentation: {
      task: 'Násob po lumenitsku: rozsviť kopie prvního činitele podle jedniček druhého a sečti je.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
      showValues: true,
    },
    hints: [
      'Podívej se na druhý činitel. Které jeho krystaly svítí? A co znamená kopie posunutá o jedno místo?',
      'Posun vlevo zdvojuje: kopie ×1 není posunutá, ×2 o jedno místo, ×4 o dvě. Rozsviť kopie, které patří k jedničkám druhého činitele, a sečti je jako obvykle.',
    ],
    echo: {
      intro: [
        'Násobení po lumenitsku. Násobilku tu nikdo neznal, a přesto násobili.',
        'Stěna nabízí kopie prvního činitele, každou posunutou jinak. Které z nich se sčítají, rozhodneš ty.',
      ],
      step: {
        0: 'Pětkrát tři: tři je 11, takže pětka a k ní zdvojená pětka. Patnáct.',
        1: 'Každá jednička druhého činitele přinesla jednu posunutou kopii.',
      },
      complete: 'Žádná násobilka. Jen posun a sčítání.',
      solved: [
        'Násobit dvojkově znamená posouvat a sčítat.',
        'Lumenité nepotřebovali násobilku. Stačily jim páky z Přílivu a Kaskáda.',
      ],
      skill: 'Tři součiny bez chyby.',
    },
    quiz: [
      qCopies,
    ],
    kodex: 'nasobeni',
  },
  {
    id: 'II-11',
    title: 'Dělení posunem',
    kind: 'tide',
    config: {
      bits: 6,
      ops: ['shr'],
      tasks: [
        { start: 45, target: 11, show: '÷ 4' },
        { start: 50, target: 6, show: '÷ 8' },
        { start: 38, target: 19, show: '÷ 2' },
        { start: 61, target: 3, show: '÷ 16' },
      ],
    },
    generate: genII11,
    presentation: {
      task: 'Vyděl světlo číslem na kole. Co spadne přes okraj, chytí miska zbytku.',
      showDigits: true,
      showSum: true,
      sizes: 'equal',
      ledger: true,
      levers: 'math',
      remainder: true,
    },
    hints: [
      'Kolikrát musíš rozpůlit, abys dělil čtyřmi? A kolikrát pro osm?',
      'Dělit 2ᵏ znamená posunout k-krát vpravo. Co spadne přes okraj, je zbytek: přesně těch k krystalů vpravo.',
    ],
    echo: {
      intro: ['Dělení posunem. Tady Lumenité dělili, a zbytek jim padal do misky.', 'Jediná páka: rozpůlit. Kolikrát za ni zatáhneš?'],
      spill: 'Světlo spadlo do misky. To je zbytek, který se do podílu nevešel.',
      step: { 0: 'Podíl je na krystalech, zbytek v misce.' },
      complete: 'Poslední podíl. Zbytek zůstal v misce.',
      solved: [
        'Dělit dvěma, čtyřmi nebo osmi znamená posouvat vpravo.',
        'Co spadne přes okraj, je zbytek: krystaly, které stály úplně vpravo.',
      ],
      skill: 'Ani jeden posun navíc.',
    },
    quiz: [
      qRemainder,
      qDivisible,
    ],
    kodex: 'deleni',
  },
  {
    id: 'II-12',
    title: 'Tři řady',
    kind: 'cascade',
    config: {
      width: 6,
      bits: 4,
      carries: 'manual',
      conserve: true,
      farCarries: true,
      tasks: [
        { op: 'add', operands: [0b0110, 0b0101, 0b0011] },
        { op: 'add', operands: [0b1011, 0b0110, 0b1101] },
        { op: 'add', operands: [0b1111, 0b1111, 0b1111] },
      ],
    },
    generate: genII12,
    presentation: {
      task: 'Sečti tři řady. Kde se slijí čtyři světla, putuje jedno o dvě místa.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: true,
    },
    hints: [
      'Spočítej ve sloupci všechna světla, i ta, která do něj přitekla shora.',
      'Dvě světla = 10, tři = 11, čtyři = 100, pět = 101. Číslice čti zprava: první zůstane dole, druhá jde do sousedního sloupce, třetí o dvě místa do horní řady.',
    ],
    echo: {
      intro: ['Tři řady. Sem Lumenité nosili velké sbírky světla.', 'Ve sloupci se teď může slít víc světel než kdy dřív.'],
      step: { 0: 'Sečteno. Tři řady jdou stejně jako dvě.', 1: 'Zbývá poslední: tři patnáctky.' },
      complete: 'Tři patnáctky: 45. V nejtěžším sloupci se slilo pět světel.',
      solved: ['Čtyři světla jsou 100: dole nic, vedle nic, o dvě místa dál jedno.', 'Proto má horní řada krystaly přenosu o dvě místa.'],
      skill: 'Všechny tři součty napoprvé.',
    },
    quiz: [
      {
        question: 'Ve sloupci se slilo pět světel. Co zůstane dole a kam poputuje zbytek?',
        options: ['dole 1, o dvě místa 1', 'dole 1, vedle 2', 'dole 5', 'dole 0, vedle 1, o dvě místa 1'],
        correct: 0,
        hint: 'Pět je 101₂.',
        explain: '5 = 101₂: pravá jednička zůstane dole, prostřední nula nepošle nic vedle a levá jednička putuje o dvě místa.',
      },
    ],
    kodex: 'tri-rady',
  },
  {
    id: 'II-13',
    title: 'Doplněk',
    kind: 'mixed',
    echo: {
      intro: [
        'Doplněk. Tady Lumenité odčítali, a přitom si nic nepůjčovali.',
        'Nejdřív zjistíš, jak v nádobě vypadá záporné číslo. Pak ho napíšeš zkratkou a budeš jím odčítat.',
      ],
      solved: [
        'Odečíst znamená přičíst doplněk a zahodit, co přeteče.',
        'Proto procesoru stačí jedna sčítačka na sčítání i odčítání.',
      ],
      skill: 'Doplněk bez jediného zbytečného kroku.',
    },
    parts: [
      {
        // Objev před výkladem: kolik jedniček vyprázdní nádobu se třemi světly? Třináct, tedy −3.
        id: 'II-13',
        title: 'Prázdná nádoba',
        kind: 'tide',
        config: { bits: 4, ops: ['inc'], tasks: [{ start: 3, target: 0 }] },
        presentation: {
          task: 'První zkouška: přidávej po jedné, dokud nádoba nepřeteče a nezůstane prázdná. Kolik jedniček to bude?',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
          levers: 'math',
        },
        hints: [
          'Nádoba unese nejvýš 15. Co se stane s další jedničkou?',
          'Ze 3 do 15 je to 12 jedniček, třináctá nádobu přeleje a zůstane nula.',
        ],
        echo: {
          intro: ['První zkouška: v nádobě jsou tři světla. Přidávej, dokud nezůstane prázdná.'],
          solved: [
            'Třináct jedniček. 3 + 13 = 16, a to se do nádoby nevejde: přeteče a zůstane nula.',
            'V nádobě se 13 chová jako −3. Zapiš si to: 1101.',
          ],
        },
      },
      {
        id: 'II-13',
        title: 'Záporná čísla',
        kind: 'tide',
        config: {
          bits: 4,
          ops: ['not', 'inc'],
          tasks: [
            { start: 3, target: 13, show: '−3' },
            { start: 5, target: 11, show: '−5' },
            { start: 1, target: 15, show: '−1' },
          ],
        },
        generate: genII13Negate,
        presentation: {
          task: 'Druhá zkouška: zapiš záporné číslo zkratkou. Převrať všechna světla a přidej jednu.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
          levers: 'math',
        },
        hints: [
          'Záporné číslo se v nádobě se čtyřmi krystaly píše jako doplněk. Zkus páku převrať.',
          'Doplněk: převrať všechna světla a přidej jednu. Třeba 3 = 0011, převrácené 1100, plus jedna 1101 = −3.',
        ],
        echo: {
          intro: [
            'Druhá zkouška: přidávat po jedné je zdlouhavé. Lumenité měli zkratku: převrať všechna světla a přidej jednu.',
            'Na krystalech je číslo, kolo žádá jeho zápornou podobu.',
          ],
          step: { 0: '1101, stejně jako po třinácti jedničkách. Přičti k němu to původní a nádoba přeteče na nulu.' },
          solved: ['Záporná čísla umíš napsat. Teď jimi odečítej.'],
        },
      },
      {
        id: 'II-13',
        title: 'Odčítání sčítáním',
        kind: 'cascade',
        config: {
          width: 4,
          carries: 'manual',
          conserve: true,
          overflow: true,
          // Horní řada kladná (do 7), spodní záporná: nejvyšší bit nese znaménko, jak říká Kodex.
          tasks: [
            { op: 'add', operands: [0b0111, 0b1101] },
            { op: 'add', operands: [0b0110, 0b1011] },
            { op: 'add', operands: [0b0101, 0b1110] },
          ],
        },
        generate: genII13Add,
        presentation: {
          task: 'Třetí zkouška: spodní řada je doplněk, tedy záporné číslo. Sečti a co přeteče, pošli do přepadu.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
        },
        hints: [
          'Sečti obě řady jako obvykle, zprava a s přenosy.',
          'Přenos z nejlevějšího sloupce patří do přepadu. To, co v nádobě zbude, je rozdíl.',
        ],
        echo: {
          intro: ['Třetí zkouška: horní řada je kladné číslo, spodní doplněk toho, co se odečítá.'],
          step: { 0: 'Přetečení spadlo do přepadu a v nádobě zbyl rozdíl.' },
          complete: 'Žádná výpůjčka, jen sčítání a přepad.',
          solved: [],
        },
        quiz: [
          qNegative,
          qComplementSum,
        ],
      },
    ],
    kodex: 'doplnek',
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
      'Zkus to od cíle: ze kterých vah se na něj dostaneš jedním tahem? Liché číslo nevznikne zdvojením.',
      'Zdvojení posune světla vlevo, půlení vpravo, páky ±1 doladí konec. Někdy je kratší přestřelit a pak ubrat.',
    ],
    echo: {
      intro: [
        'Váhy Osudu. Nejpřísnější zkouška Hlubších síní.',
        'Osud dovolí jen tolik tahů, kolik je nezbytně potřeba. Kdo je přečerpá, začíná znovu.',
      ],
      reset: 'Tahy došly a misky se vrátily. Promysli cestu dřív, než zatáhneš.',
      step: { 0: 'Vyrovnáno. Osud kývl.', 2: 'Osud vidí, že počítáš dopředu.' },
      complete: 'Poslední miska se vyrovnala.',
      solved: [
        'Váhy Osudu se vyrovnaly.',
        // Shrnutí celého patra patří až velké bráně (II-15).
        'Posun dělá velké kroky, ±1 malé. Nejkratší cesta potřebuje obojí.',
      ],
      skill: 'Misky se ani jednou nevrátily.',
    },
    quiz: [
      qSubtract,
      qFastMul,
    ],
  },
  {
    id: 'II-15',
    title: 'Velká brána Síně',
    kind: 'mixed',
    echo: {
      intro: ['Velká brána Síně Počtářů. Neprojde nikdo, kdo jen hádá.', 'Tři zkoušky: odčítání, násobení a Váhy Osudu.'],
      solved: [
        'Velká brána Síně se otevírá. Na dveřích svítí celý glyf.',
        'Sčítat, odčítat, násobit i dělit umíš jen se světlem a posunem.',
      ],
      skill: 'Celá velká brána bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'II-15',
        title: 'Odčítání',
        kind: 'cascade',
        config: {
          width: 5,
          carries: 'manual',
          tasks: [
            { op: 'sub', operands: [0b10010, 0b00111] },
            { op: 'sub', operands: [0b11000, 0b01011] },
          ],
        },
        generate: genII15Sub,
        presentation: {
          task: 'První zkouška: odečti spodní řadu od horní. Kde nemáš z čeho brát, půjč si. Brána krystaly nehlídá: co kam teče, spočítej v hlavě.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
        },
        hints: [
          'Začni vpravo. Jde v tomhle sloupci odečítat? Když ne, kdo ti může půjčit?',
          'Půjčené světlo má ve sloupci váhu dvou: 0 − 1 s výpůjčkou je 10 − 1 = 1. Výpůjčku zapiš krystalem pod spodní řadu ve sloupci vlevo.',
        ],
        echo: {
          intro: ['První zkouška: odčítání, pět krystalů v řadě.', 'Kudy světla tečou, ukáže brána až po přijatém rozdílu.'],
          solved: ['Rozdíly sedí. Teď násobení.'],
        },
      },
      {
        id: 'II-15',
        title: 'Násobení',
        kind: 'cascade',
        config: {
          width: 6,
          bits: 3,
          carries: 'manual',
          pickCopies: true,
          tasks: [
            { op: 'mul', operands: [0b111, 0b11] },
            { op: 'mul', operands: [0b101, 0b110] },
          ],
        },
        generate: genII15Mul,
        presentation: {
          task: 'Druhá zkouška: rozsviť kopie prvního činitele podle jedniček druhého a sečti je.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
        },
        hints: [
          'Které krystaly druhého činitele svítí?',
          'Za každou jedničku druhého činitele rozsviť kopii prvního posunutou na její místo, pak kopie sečti s přenosy.',
        ],
        echo: {
          intro: ['Druhá zkouška: násobení. Kopie si vybíráš ty.'],
          solved: ['Součiny sedí. Zbývají Váhy Osudu.'],
        },
      },
      {
        id: 'II-15',
        title: 'Váhy Osudu',
        kind: 'tide',
        config: {
          bits: 6,
          ops: ['shl', 'shr', 'inc', 'dec'],
          strict: true,
          tasks: [
            { start: 9, target: 37 },
            { start: 44, target: 21 },
          ],
        },
        generate: genII15Fate,
        presentation: {
          task: 'Třetí zkouška: vyrovnej misky. Osud dovolí jen tolik tahů, kolik je nezbytně potřeba.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: true,
          levers: 'math',
          scale: true,
        },
        hints: [
          'Zkus to od cíle: ze kterých vah se na něj dostaneš jedním tahem? Liché číslo nevznikne zdvojením.',
          'Zdvojení posune světla vlevo, půlení vpravo, páky ±1 doladí konec. Někdy je kratší přestřelit a pak ubrat.',
        ],
        echo: {
          intro: ['Třetí zkouška: Váhy Osudu. Kdo přečerpá tahy, začíná znovu.'],
          reset: 'Tahy došly a misky se vrátily. Promysli cestu dřív, než zatáhneš.',
          solved: [],
        },
      },
    ],
    kodex: 'pocetari-hloub',
  },
];

export const ACT_II: ActDef = {
  numeral: 'II',
  title: 'Síň Počtářů',
  theme: 'Sčítání a přenos',
  glyphBase: 16,
  levels,
  lore: 'Pod Předsíní hučí voda. Lumenité tu světla sčítali, přelévali a posouvali.',
  preview: 'Sčítání pod sebou, přenos, přetečení nádoby a páky, které násobí a dělí dvěma.',
  review: [qCombosNext, qRead, qWrite],
};
