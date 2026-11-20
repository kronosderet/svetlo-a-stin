import { runeTable } from '../core/logic';
import {
  EXPLORE_HINTS,
  branch,
  branchTask,
  chain,
  exploreBranch,
  genIII12,
  genIII13,
  genIII14,
  genIII15Identify,
  genIII15Mask,
  genIII15Nand,
  genIII5,
  genIII6,
  genIII7Fill,
  genIII7Gate,
  genIII7Identify,
  lessIsMore,
  majority,
  nandOnly,
  secretSpeech,
  single,
} from './generators3';
import { qAdd, qRead, qShiftLeft, qTableLit, qTableRows } from './quizzes';
import type { ActDef, LevelDef } from './types';

const levels: LevelDef[] = [
  // Nultá komnata patra: světlovod bez runy, lampa ukazuje, co k ní doteče.
  {
    id: 'III-0',
    title: 'Cesta světla',
    kind: 'gate',
    config: { tasks: [{ mode: 'explore', circuit: { inputs: ['A'], nodes: [], output: 'A' } }] },
    presentation: {
      task: 'Rozsviť krystal vstupu a sleduj lampu. Vyzkoušej světlo i stín.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Dotkni se krystalu vstupu A a sleduj lampu vpravo.',
      'Kombinace jsou dvě: vstup svítí, nebo mlčí. Zkus obě.',
      'Zvýrazněný vstup vede k nové kombinaci.',
    ],
    echo: {
      intro: [
        'Zahrada Bran. Lumenité tu světlu stavěli cesty.',
        'První runě Zahrady říkali {{Obraceč|obracec}}.',
        'Světlovod vede od krystalu k lampě. Co lampa udělá?',
      ],
      solved: ['Lampa ukazuje, co k ní doteče: světlo, nebo stín.', 'Do cest se tu vkládají runy. Každá se světlem něco udělá.'],
      skill: 'Jediný dotek.',
    },
  },
  {
    id: 'III-1',
    title: 'Obraceč',
    kind: 'gate',
    config: {
      tasks: [
        {
          mode: 'slots',
          circuit: { inputs: ['A'], nodes: [{ id: 's', choices: ['id', 'not'], from: ['A'], col: 1, row: 0 }], output: 's' },
          target: [1, 0],
        },
        {
          mode: 'slots',
          circuit: {
            inputs: ['A'],
            nodes: [
              { id: 's1', rune: 'not', from: ['A'], col: 1, row: 0 },
              { id: 's2', choices: ['id', 'not'], from: ['s1'], col: 2, row: 0 },
            ],
            output: 's2',
          },
          target: [0, 1],
        },
        {
          mode: 'slots',
          circuit: {
            inputs: ['A'],
            nodes: [
              { id: 's1', choices: ['id', 'not'], from: ['A'], col: 1, row: 0 },
              { id: 's2', rune: 'not', from: ['s1'], col: 2, row: 0 },
              { id: 's3', choices: ['id', 'not'], from: ['s2'], col: 3, row: 0 },
            ],
            output: 's3',
          },
          target: [1, 0],
        },
      ],
    },
    presentation: {
      task: 'Vlož runy do prázdných kamenů tak, aby lampa svítila přesně tak, jak žádá brána vpravo. Pak spusť Zkoušku.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Dotkni se prázdného kamene: runy se v něm střídají. Pak přepni vstup a sleduj lampu.',
      'Průchod pustí světlo, jak přišlo. Obraceč ho obrátí: ze světla udělá stín a ze stínu světlo.',
    ],
    echo: {
      intro: [
        'Obraceč. První runa Zahrady.',
        'Brána vpravo říká, kdy má lampa svítit. Zkus, co runa se světlem udělá.',
      ],
      step: { 0: 'Obraceč: kde bylo světlo, je stín. A naopak.', 1: 'Dva Obraceče za sebou se navzájem zruší.' },
      wrong: 'Brána se nepohnula. Přepni vstup a porovnej lampu s bránou.',
      complete: 'Tři obvody, jedna runa.',
      solved: ['Obraceč mění světlo ve stín a stín ve světlo.', 'Lumenité ho tesali jako háček: ¬.'],
      skill: 'Každý obvod napoprvé.',
    },
    quiz: [
      {
        question: 'Vstup A projde dvěma Obraceči za sebou. Co ukáže lampa?',
        options: ['totéž co vstup A', 'vždy stín', 'vždy světlo', 'opak vstupu A'],
        correct: 0,
        hint: 'Každý Obraceč obrátí světlo ve stín a stín ve světlo. Co udělají dva za sebou?',
        explain: 'Dvojí obrácení vrátí původní stav: ¬¬A = A. Česky: „není pravda, že neprší“ znamená „prší“.',
      },
    ],
    kodex: 'obracec',
  },
  {
    id: 'III-2',
    title: 'Pouto',
    kind: 'mixed',
    echo: {
      intro: ['Pouto. Dvě cesty světla se tu spojují v jednu.'],
      solved: ['Pouto pustí světlo, jen když svítí oba vstupy.', 'Lumenité ho tesali jako stříšku: ∧.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-2',
        title: 'Zkoumání',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('and') }] },
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false, knownBoard: true },
        hints: EXPLORE_HINTS,
        echo: {
          intro: ['Přepínej A a B a sleduj, kdy světlo dorazí k lampě.'],
          found: { 3: 'Ještě jedna kombinace chybí.' },
          solved: ['Lampa svítila jen jednou. Teď to zapiš na desku zákona.'],
        },
      },
      {
        id: 'III-2',
        title: 'Deska zákona',
        kind: 'table',
        config: { tasks: [{ mode: 'fill', circuit: single('and') }] },
        presentation: { task: 'Rozsviť na desce zákona řádky, ve kterých lampa svítí, a potvrď.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Každý řádek desky je jedna kombinace vstupů. Ve kterém svítila lampa?',
          'Pouto pustilo světlo jen jednou: když svítily oba vstupy, tedy v řádku 1 1.',
        ],
        echo: {
          intro: ['Deska zákona: pro každou kombinaci vstupů jeden řádek.'],
          wrong: 'Deska nesedí. Vzpomeň si, kdy lampa svítila.',
          complete: 'Deska zákona Pouta je hotová.',
          solved: [],
        },
        quiz: [
          {
            question: 'Kdy svítí lampa za Poutem?',
            options: ['jen když svítí oba vstupy', 'když svítí aspoň jeden vstup', 'když svítí právě jeden vstup', 'když oba vstupy mlčí'],
            correct: 0,
            hint: 'Vzpomeň si, ve kterém řádku desky lampa svítila.',
            explain: 'Pouto (AND) pustí světlo, jen když svítí A i B. V matematice je to konjunkce A ∧ B: „prší a fouká“ platí, jen když platí obojí.',
          },
          qTableRows,
        ],
      },
    ],
    kodex: 'pouto',
  },
  {
    id: 'III-3',
    title: 'Rozcestí',
    kind: 'mixed',
    echo: {
      intro: ['Rozcestí. Tady se cesty světla rozbíhají i sbíhají.'],
      solved: ['Rozcestí pustí světlo, když svítí aspoň jeden vstup.', 'Lumenité ho tesali jako písmeno V: ∨.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-3',
        title: 'Zkoumání',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('or') }] },
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false, knownBoard: true },
        hints: EXPLORE_HINTS,
        echo: {
          intro: ['Zkus všechny kombinace. Kdy zůstane lampa tmavá?'],
          found: { 3: 'Ještě jedna kombinace chybí.' },
          solved: ['Lampa mlčela jen jednou. Zapiš to na desku.'],
        },
      },
      {
        id: 'III-3',
        title: 'Deska zákona',
        kind: 'table',
        config: { tasks: [{ mode: 'fill', circuit: single('or') }] },
        presentation: { task: 'Rozsviť na desce zákona řádky, ve kterých lampa svítí, a potvrď.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Ve kterých řádcích lampa svítila?',
          'Rozcestí mlčelo jen tehdy, když mlčely oba vstupy, tedy v řádku 0 0.',
        ],
        echo: {
          intro: ['A teď deska zákona Rozcestí.'],
          wrong: 'Deska nesedí. Kdy lampa mlčela?',
          complete: 'Deska zákona Rozcestí je hotová.',
          solved: [],
        },
        quiz: [
          {
            question: 'Kdy zůstane lampa za Rozcestím tmavá?',
            options: ['jen když oba vstupy mlčí', 'když mlčí aspoň jeden vstup', 'když svítí oba vstupy', 'nikdy'],
            correct: 0,
            hint: 'Ve kterém řádku desky lampa mlčela?',
            explain: 'Rozcestí (OR) pustí světlo, když svítí aspoň jeden vstup. V matematice disjunkce A ∨ B: „půjdu do kina, nebo do divadla“ platí i tehdy, když půjdeš na obojí.',
          },
          {
            question: 'Ve kterých řádcích desky se liší Pouto a Rozcestí?',
            options: ['0 1 a 1 0', 'jen 1 1', 'jen 0 0', 've všech'],
            correct: 0,
            hint: 'Polož obě desky vedle sebe.',
            explain: 'V řádcích 0 0 a 1 1 dávají obě runy totéž. Liší se, když svítí právě jeden vstup: Pouto mlčí, Rozcestí svítí.',
          },
        ],
      },
    ],
    kodex: 'rozcesti',
  },
  {
    id: 'III-4',
    title: 'Jen jeden',
    kind: 'mixed',
    echo: {
      intro: ['Jen jeden. Tahle runa je vybíravá.', 'Vzpomínáš na Síň Počtářů? Jedna a jedna tam dala dole stín.'],
      solved: [
        'Výluka pustí světlo, když svítí právě jeden vstup.',
        'Dvě světla se v ní vyruší jako při sčítání jedna a jedna: dole zůstane stín.',
        'Výluku Lumenité tesali jako V s čárou: ⊻.',
      ],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-4',
        title: 'Zkoumání',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('xor') }] },
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false, knownBoard: true },
        hints: EXPLORE_HINTS,
        echo: {
          intro: ['Zkus všechny kombinace. Co udělá runa se dvěma světly?'],
          found: { 3: 'Ještě jedna kombinace chybí.' },
          solved: ['Dvě světla runa nepustila. Zapiš to na desku.'],
        },
      },
      {
        id: 'III-4',
        title: 'Deska zákona',
        kind: 'table',
        config: { tasks: [{ mode: 'fill', circuit: single('xor') }] },
        presentation: { task: 'Rozsviť na desce zákona řádky, ve kterých lampa svítí, a potvrď.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Ve kterých řádcích lampa svítila?',
          'Výluka svítí, když svítí právě jeden vstup: v řádcích 0 1 a 1 0.',
        ],
        echo: {
          intro: ['Deska zákona Výluky.'],
          wrong: 'Deska nesedí. Co udělala runa, když dostala dvě světla?',
          complete: 'Deska zákona Výluky je hotová.',
          solved: [],
        },
        quiz: [
          {
            question: 'Výluka dostane dvě světla. Co lampa?',
            options: ['mlčí', 'svítí', 'svítí jasněji', 'jednou svítí, jednou mlčí'],
            correct: 0,
            hint: 'Výluka chce právě jedno světlo.',
            explain: 'Výluka (XOR) svítí, jen když svítí právě jeden vstup. Dvě světla se vyruší. Česky „buď, anebo“: vylučovací disjunkce.',
          },
          {
            question: 'Vzpomeň na Síň Počtářů: 1 + 1 = 10. Kterou číslici součtu dává Výluka?',
            options: ['tu, která zůstane dole', 'přenos', 'celý součet 10', 'žádnou'],
            correct: 0,
            hint: 'Porovnej desku Výluky se spodní číslicí součtů 0 + 0, 0 + 1, 1 + 0 a 1 + 1.',
            explain: 'Výluka dává spodní číslici: 0, 1, 1, 0. Přenos dává Pouto, svítí jen u 1 + 1. Spolu tvoří poloviční sčítačku, potkáš ji v Hlubině Strojů.',
          },
        ],
      },
    ],
    kodex: 'vyluka',
  },
  {
    id: 'III-5',
    title: 'Které pravidlo?',
    kind: 'table',
    config: {
      tasks: [
        // Poznávané runy se losují nezávisle (poslední se neuhodne vylučováním), vyplňují se dvě různé.
        { mode: 'identify', circuit: single('or'), choices: ['and', 'or', 'xor'], answer: 'or' },
        { mode: 'fill', circuit: single('and') },
        { mode: 'identify', circuit: single('xor'), choices: ['and', 'or', 'xor'], answer: 'xor' },
        { mode: 'fill', circuit: single('or') },
        { mode: 'identify', circuit: single('xor'), choices: ['and', 'or', 'xor'], answer: 'xor' },
      ],
    },
    generate: genIII5,
    presentation: {
      // Lampa pod závojem: desku jde napsat jen podle zákona runy, ne opsat z lampy (D-III-06).
      task: 'Poznej podle desky runu pod závojem. Kde runu vidíš, vyplň desku podle runy. Lampa je tam pod závojem.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
      veilLamp: true,
    },
    hints: [
      'Projdi desku řádek po řádku. Kdy runa pustí světlo k lampě?',
      'Pouto svítí jen v řádku 1 1, Rozcestí ve všech kromě 0 0, Výluka v řádcích 0 1 a 1 0.',
    ],
    echo: {
      intro: ['Které pravidlo? Lumenité si runy zakrývali závojem.', 'Deska zákona ale prozradí, co se pod ním skrývá.'],
      step: { 0: 'Ano. Deska runu prozradila.' },
      wrong: 'Deska nesedí. Jak tahle runa pouští světlo?',
      complete: 'Pět desek, tři runy.',
      solved: ['Každá runa má svou desku zákona.', 'Kdo zná desku, pozná runu i bez pohledu pod závoj.'],
      skill: 'Každá deska napoprvé.',
    },
    quiz: [qTableLit],
    kodex: 'deska',
  },
  {
    id: 'III-6',
    title: 'Řetězy',
    kind: 'gate',
    config: {
      tasks: [
        { mode: 'slots', circuit: chain(), target: runeTable('nand') },
        { mode: 'slots', circuit: chain(), target: runeTable('nor') },
        { mode: 'slots', circuit: chain(), target: [1, 0, 0, 1] },
        // Než hráč větvení osadí, jednou hotové větvení prozkoumá: první obvod se dvěma cestami.
        exploreBranch,
        branchTask({ a: 'id', b: 'not', join: 'or' }),
      ],
    },
    generate: genIII6,
    presentation: {
      task: 'Runy se tu řadí za sebe. Osaď kameny tak, aby lampa svítila podle brány vpravo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Začni od brány: ve kterých řádcích má lampa mlčet? Která známá runa mlčí přesně ve zbylých řádcích?',
      'Najdi runu, která dá desku přesně obráceně, a za ni postav Obraceč.',
    ],
    echo: {
      intro: ['Řetězy. Světlo projde jednou runou a hned další.', 'Ze známých run tu vznikají nové.'],
      step: {
        0: 'Runa a za ní Obraceč: deska runy se obrátí.',
        1: 'Pouto s Obracečem je Zlomené pouto, Rozcestí s Obracečem Zavřené rozcestí.',
        2: 'Výluka a za ní Obraceč: lampa svítí, když jsou vstupy stejné. Lumenité tomu říkali Rovnost. Teď větvení.',
        3: 'Lampa svítila jen v řádku 0 1: obrácené A a k tomu B. Teď větvení postavíš ty.',
      },
      wrong: 'Brána se nepohnula. Ve kterých řádcích lampa nesedí? Přepni na ně vstupy.',
      complete: 'Řetězy drží.',
      solved: ['Runy postavené za sebou dají nové runy.', 'Zlomené pouto a Zavřené rozcestí jsou v moderním jazyce NAND a NOR.'],
      skill: 'Každý řetěz napoprvé.',
    },
    quiz: [
      {
        question: 'Zlomené pouto (NAND) dostane dvě světla. Co lampa?',
        options: ['mlčí', 'svítí', 'svítí jen napůl', 'nedá se to poznat'],
        correct: 0,
        hint: 'Zlomené pouto je Pouto a za ním Obraceč.',
        explain: 'Pouto by se dvěma světly svítilo, Obraceč to obrátí na stín. Ve všech ostatních řádcích lampa svítí.',
      },
      {
        question: 'Jakou runu dostaneš, když za Rozcestí postavíš Obraceč?',
        options: ['Zavřené rozcestí (NOR)', 'Zlomené pouto (NAND)', 'Výluku (XOR)', 'Pouto (AND)'],
        correct: 0,
        hint: 'Obraceč obrátí každý řádek desky Rozcestí.',
        explain: 'Rozcestí svítí všude kromě 0 0, Obraceč to obrátí: lampa svítí jen v řádku 0 0. To je NOR, „ani A, ani B“.',
      },
    ],
    kodex: 'retezy',
  },
  {
    id: 'III-7',
    title: 'Brána Zahrady',
    kind: 'mixed',
    echo: {
      intro: ['Brána Zahrady. Projde jen ten, kdo runy zná a umí je skládat.', 'Tři zkoušky: deska, kameny a závoj.'],
      solved: [
        'Brána Zahrady se otevírá. Runy už mluví tvou řečí.',
        'Na dveřích se rozsvítila čtvrtá strana glyfu. Hlubší síně Zahrady se probouzejí.',
      ],
      skill: 'Celá brána bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-7',
        title: 'Deska',
        kind: 'table',
        config: {
          tasks: [
            { mode: 'fill', circuit: chain('or', 'not') },
            { mode: 'fill', circuit: branch({ a: 'not', b: 'id', join: 'and' }) },
          ],
        },
        generate: genIII7Fill,
        presentation: {
          task: 'První zkouška: vyplň desku zákona pro obvod vlevo. Lampa je pod závojem, výsledek slož z run.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: false,
          veilLamp: true,
        },
        hints: [
          'Pro každý řádek pusť v duchu světlo obvodem zleva doprava.',
          'Nejdřív urči, co vyjde z první runy, a teprve pak, co s tím udělá další.',
        ],
        echo: {
          intro: ['První zkouška: deska zákona obvodu. Lampu jsem zahalil, dokud desku nepotvrdíš. Co k lampě doteče, slož z run.'],
          wrong: 'Deska nesedí. Projdi ten řádek runou po runě.',
          solved: ['Deska sedí. Teď kameny.'],
        },
      },
      {
        id: 'III-7',
        title: 'Kameny',
        kind: 'gate',
        config: {
          tasks: [
            { mode: 'slots', circuit: chain(), target: [0, 1, 1, 0] },
            branchTask({ a: 'not', b: 'id', join: 'or' }),
            { mode: 'slots', circuit: chain(), target: runeTable('nand') },
          ],
        },
        generate: genIII7Gate,
        presentation: { task: 'Druhá zkouška: osaď kameny tak, aby lampa svítila podle brány vpravo.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Začni od lampy: kdy má svítit?',
          'Najdi runu s touhle deskou, nebo s deskou obrácenou, a za ni dej Obraceč.',
        ],
        echo: {
          intro: ['Druhá zkouška: prázdné kameny.'],
          wrong: 'Brána se nepohnula. Porovnej lampu s bránou řádek po řádku.',
          solved: ['Kameny drží. Zbývá závoj.'],
        },
      },
      {
        id: 'III-7',
        title: 'Závoj',
        kind: 'table',
        config: {
          tasks: [
            { mode: 'identify', circuit: single('nor'), choices: ['and', 'or', 'xor', 'nand', 'nor'], answer: 'nor' },
            { mode: 'identify', circuit: single('xor'), choices: ['and', 'or', 'xor', 'nand', 'nor'], answer: 'xor' },
          ],
        },
        generate: genIII7Identify,
        presentation: { task: 'Třetí zkouška: poznej runu pod závojem.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Kdy lampa svítí? Najdi runu se stejnou deskou.',
          'Zlomené pouto a Zavřené rozcestí jsou obrácené Pouto a Rozcestí.',
        ],
        echo: {
          intro: ['Třetí zkouška: závoj.'],
          solved: [],
        },
      },
    ],
    kodex: 'zahrada',
  },
  {
    id: 'III-8',
    title: 'Zrcadla',
    kind: 'mixed',
    echo: {
      intro: ['Hlubší síně Zahrady. Tady se runy zrcadlí.', 'Dva různé obvody, a přece možná totéž.'],
      solved: [
        'Obrácené Pouto je totéž co Rozcestí obrácených vstupů. A naopak.',
        'Moderní lidé tomu říkají De Morganovy zákony.',
      ],
      skill: 'Zrcadla bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-8',
        title: 'První obvod',
        kind: 'table',
        config: { tasks: [{ mode: 'fill', circuit: chain('and', 'not') }] },
        presentation: {
          task: 'Vyplň desku zákona pro Pouto s Obracečem. Lampa je pod závojem, výsledek slož z run.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: false,
          veilLamp: true,
        },
        hints: [
          'Pro každý řádek: co vyjde z Pouta a co z toho udělá Obraceč?',
          'Pouto svítí jen v řádku 1 1. Obraceč to obrátí.',
        ],
        echo: { intro: ['První obvod: Zlomené pouto.'], wrong: 'Deska nesedí. Pusť světlo nejdřív Poutem, pak Obracečem.', solved: ['Tuhle desku si zapamatuj.'] },
      },
      {
        id: 'III-8',
        title: 'Druhý obvod',
        kind: 'table',
        config: { tasks: [{ mode: 'fill', circuit: branch({ a: 'not', b: 'not', join: 'or' }) }] },
        presentation: {
          task: 'A teď deska obvodu, kde se obrací každý vstup zvlášť. Lampa je zase pod závojem.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: false,
          veilLamp: true,
        },
        hints: [
          'Nejdřív obrať A i B, pak je pusť Rozcestím.',
          'Rozcestí svítí, když svítí aspoň jeden z obrácených vstupů, tedy když aspoň jeden původní mlčí.',
        ],
        echo: { intro: ['Druhý obvod vypadá úplně jinak.'], wrong: 'Deska nesedí. Obrať každý vstup a pak Rozcestí.', solved: ['Stejná deska jako u prvního obvodu. Zrcadlo!'] },
      },
      {
        id: 'III-8',
        title: 'Druhé zrcadlo',
        kind: 'gate',
        config: { tasks: [{ mode: 'slots', circuit: branch(), target: runeTable('nor') }] },
        presentation: { task: 'Zavřené rozcestí bez Rozcestí: osaď kameny tak, aby lampa svítila jen v řádku 0 0.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Zrcadlo platí i obráceně. Co když obrátíš oba vstupy?',
          'Lampa má svítit, jen když oba vstupy mlčí, tedy když oba obrácené vstupy svítí. Která runa chce oba?',
        ],
        echo: { intro: ['Druhé zrcadlo postavíš ty.'], wrong: 'Brána se nepohnula. Kdy mají svítit oba obrácené vstupy?', solved: [] },
        quiz: [
          {
            question: 'Jak jinak zapíšeš ¬(A ∨ B)?',
            options: ['¬A ∧ ¬B', '¬A ∨ ¬B', 'A ∧ B', '¬A ∨ B'],
            correct: 0,
            hint: 'Lampa svítí, jen když oba vstupy mlčí.',
            explain: '¬(A ∨ B) = ¬A ∧ ¬B a ¬(A ∧ B) = ¬A ∨ ¬B. Negace prohodí Pouto s Rozcestím.',
          },
          {
            question: '„Není pravda, že prší nebo fouká.“ Co to znamená?',
            options: ['neprší a nefouká', 'neprší, nebo nefouká', 'prší a fouká', 'prší, ale nefouká'],
            correct: 0,
            hint: 'Kdyby pršelo, nebo foukalo, věta by neplatila.',
            explain: 'Podle De Morgana: ¬(prší ∨ fouká) = neprší ∧ nefouká.',
          },
        ],
      },
    ],
    kodex: 'zrcadla',
  },
  {
    id: 'III-9',
    title: 'Rovnost a Důsledek',
    kind: 'mixed',
    echo: {
      intro: ['Rovnost a Důsledek. Dvě runy, které znáš z matematiky, jen v kamenném šatu.'],
      solved: ['Rovnost svítí, když se vstupy shodují. Důsledek mlčí, jen když A platí a B ne.', 'Lumenité je tesali jako ⇔ a ⇒.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-9',
        title: 'Rovnost',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('xnor') }] },
        presentation: { task: 'Vyzkoušej všechny čtyři kombinace. Kdy Rovnost pustí světlo?', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: EXPLORE_HINTS,
        echo: { intro: ['Rovnost. Kdy asi svítí?'], found: { 3: 'Ještě jedna kombinace chybí.' }, solved: ['Rovnost svítí, když jsou oba vstupy stejné. Teď Důsledek.'] },
      },
      {
        id: 'III-9',
        title: 'Důsledek',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('imp') }] },
        presentation: { task: 'Vyzkoušej všechny čtyři kombinace. Kdy Důsledek zůstane tmavý?', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: EXPLORE_HINTS,
        echo: { intro: ['Důsledek: když A, pak B.'], found: { 3: 'Ještě jedna kombinace chybí.' }, solved: ['Důsledek mlčel jen jednou. Teď desky.'] },
      },
      {
        id: 'III-9',
        title: 'Desky',
        kind: 'table',
        config: {
          tasks: [
            // Desky se píšou zpaměti (lampa pod závojem) a runa se pozná až po desce té druhé (D-III-06).
            { mode: 'fill', circuit: single('xnor') },
            { mode: 'fill', circuit: single('imp') },
            { mode: 'identify', circuit: single('xnor'), choices: ['xnor', 'imp', 'xor', 'and'], answer: 'xnor' },
            { mode: 'identify', circuit: single('imp'), choices: ['xnor', 'imp', 'or', 'nand'], answer: 'imp' },
          ],
        },
        presentation: {
          task: 'Vyplň zpaměti desky obou run, lampa je pod závojem. Pak runy poznej podle desky.',
          showDigits: true,
          showSum: false,
          sizes: 'equal',
          ledger: false,
          veilLamp: true,
        },
        hints: [
          'Kdy by neplatil slib „Když prší, je mokro“? A kdy svítila Rovnost?',
          'Rovnost svítí, když se vstupy shodují. Důsledek mlčí jen v řádku 1 0: prší a mokro není.',
        ],
        echo: { intro: ['Desky zákona Rovnosti a Důsledku. Lampa je pod závojem: piš, co víš ze zkoumání.'], wrong: 'Deska nesedí. Kdy runa svítí?', solved: [] },
        quiz: [
          {
            question: 'Kdy neplatí důsledek „Když prší, je mokro“?',
            options: ['prší a není mokro', 'neprší a je mokro', 'neprší a není mokro', 'prší a je mokro'],
            correct: 0,
            hint: 'Důsledek mlčí jen v jediném řádku desky.',
            explain: 'A ⇒ B neplatí jen tehdy, když A platí a B ne. Když neprší, slib nikdo neporušil, ať je mokro, nebo ne.',
          },
          {
            question: 'Rovnost dává přesně obrácenou desku než…',
            options: ['Výluka', 'Pouto', 'Rozcestí', 'Obraceč'],
            correct: 0,
            hint: 'Kdy svítí runa, která chce právě jedno světlo?',
            explain: 'Výluka svítí, když se vstupy liší, Rovnost, když se shodují. A ⇔ B = ¬(A ⊻ B).',
          },
        ],
      },
    ],
    kodex: 'spojky',
  },
  {
    id: 'III-10',
    title: 'Hlas většiny',
    kind: 'mixed',
    echo: {
      intro: ['Hlas většiny. Tři strážci hlasují a brána poslechne většinu.'],
      solved: [
        'Hlas většiny svítí, když svítí aspoň dva ze tří vstupů.',
        'Hlas většiny jde složit z Pout u dvojic vstupů a Rozcestí za nimi. Funguje to i obráceně: Rozcestí u dvojic a za nimi Pouta.',
      ],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-10',
        title: 'Zkoumání',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: majority() }] },
        presentation: { task: 'Tři vstupy, osm kombinací. Vyzkoušej je všechny.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Kombinací je osm. Zkus všechny a sleduj, kdy lampa svítí.',
          'Nevracej se ke kombinaci, kterou už máš. Projdi čtyři kombinace A a B, přepni C a projdi je pozpátku.',
          'Zvýrazněný vstup vede k nové kombinaci.',
        ],
        echo: { intro: ['Tři strážci: A, B a C.'], found: { 4: 'Polovina kombinací.', 7: 'Ještě jedna.' }, solved: ['Lampa svítila, kdykoli svítily aspoň dva. Teď ten obvod sestavíš z run.'] },
      },
      {
        id: 'III-10',
        title: 'Stavba',
        kind: 'gate',
        config: { tasks: [{ mode: 'slots', circuit: majority(true), target: [0, 0, 0, 1, 0, 1, 1, 1] }] },
        presentation: { task: 'Osaď pět kamenů Pouty a Rozcestími tak, aby lampa poslouchala většinu.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Většina znamená: svítí A a B, nebo A a C, nebo B a C.',
          'Levé kameny hlídají dvojice vstupů, pravé je slévají dohromady.',
        ],
        echo: { intro: ['Pět kamenů, dvě runy. Hlas většiny je na tobě.'], wrong: 'Brána se nepohnula. Které dvojice musí svítit obě?', solved: [] },
        quiz: [
          {
            question: 'V kolika řádcích desky svítí Hlas většiny se třemi vstupy?',
            options: ['4', '3', '2', '6'],
            correct: 0,
            hint: 'Spočítej řádky, kde svítí aspoň dva vstupy.',
            explain: 'Aspoň dva svítí v řádcích 011, 101, 110 a 111, tedy ve čtyřech z osmi.',
          },
        ],
      },
    ],
    kodex: 'vetsina',
  },
  {
    id: 'III-11',
    title: 'Prapečeť',
    kind: 'gate',
    config: { tasks: [nandOnly('not'), nandOnly('and'), nandOnly('or')] },
    presentation: {
      task: 'Máš jen Zlomená pouta. Natoč točité kameny u jejich vstupů tak, aby lampa svítila podle brány vpravo.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Točité kameny vybírají, odkud do runy teče světlo. Co udělá Zlomené pouto, když dostane na oba vstupy totéž světlo?',
      'Zlomené pouto se stejným světlem na obou vstupech je Obraceč. Obraceč za Zlomeným poutem dá Pouto. Rozcestí je Zlomené pouto obrácených vstupů.',
    ],
    echo: {
      intro: [
        'Prapečeť. Lumenité tvrdili, že z jediné runy postaví všechny ostatní.',
        'Tady máš jen Zlomená pouta. Kolečka u jejich vstupů jsou točité kameny: vybírají, odkud do runy teče světlo, a dotek kámen pootočí.',
      ],
      step: { 0: 'Zlomené pouto se dvěma stejnými světly je Obraceč.', 1: 'Obraceč za Zlomeným poutem: zase Pouto.' },
      wrong: 'Brána se nepohnula. Odkud teče světlo do každé runy?',
      complete: 'Obraceč, Pouto i Rozcestí z jediné runy.',
      solved: ['Ze Zlomeného pouta jde postavit každá runa.', 'Proto mu Lumenité říkali Prapečeť.'],
      skill: 'Každý obvod napoprvé.',
    },
    quiz: [
      {
        question: 'Kolik Zlomených pout potřebuješ na Obraceč?',
        options: ['jedno', 'dvě', 'tři', 'čtyři'],
        correct: 0,
        hint: 'Co udělá NAND, když do obou vstupů pustíš totéž světlo?',
        explain: 'NAND(A, A) = ¬(A ∧ A) = ¬A. Stačí jedno.',
      },
      {
        question: 'Proč je Zlomené pouto (NAND) zvláštní?',
        options: ['dá se z něj postavit každá jiná runa', 'svítí vždycky', 'má tři vstupy', 'nedá se obrátit'],
        correct: 0,
        hint: 'Co všechno z něj teď umíš sestavit?',
        explain: 'NAND je univerzální: z NOT, AND a OR, které z něj jdou sestavit, se dá složit jakýkoli obvod.',
      },
    ],
    kodex: 'prapecet',
  },
  {
    id: 'III-12',
    title: 'Masky',
    kind: 'mask',
    config: {
      bits: 8,
      tasks: [
        { value: 0b10110110, op: 'and', target: 0b00000110, ideal: 0b00001111, say: 'Nech svítit jen pravou čtveřici.' },
        { value: 0b11011010, op: 'and', target: 0b01001000, say: 'Nech svítit jen ta světla, která žádá oltář.' },
        { value: 0b00000101, op: 'or', target: 0b11110101, ideal: 0b11110000, say: 'Rozsviť celou levou čtveřici.' },
        { value: 0b00100100, op: 'or', target: 0b10100110, say: 'Přidej světla, která žádá oltář. Svítící zůstanou.' },
        { value: 0b01101001, op: 'xor', target: 0b10010110, ideal: 0b11111111, say: 'Převrať všechny krystaly.' },
        { value: 0b11001010, op: 'xor', target: 0b11100011, say: 'Přepni jen ty krystaly, které se mají změnit.' },
      ],
    },
    generate: genIII12,
    presentation: {
      task: 'Runa skládá nápis s maskou krystal po krystalu. Rozsviť masku tak, aby výsledek vypadal, jak žádá oltář.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Porovnej výsledek s cílem krystal po krystalu. Co udělá runa, když maska svítí, a co, když mlčí?',
      'Pouto: kde maska mlčí, výsledek zhasne. Rozcestí: kde maska svítí, výsledek se rozsvítí. Výluka: kde maska svítí, krystal se přepne.',
    ],
    echo: {
      intro: ['Masky. Lumenité nepřepínali krystaly po jednom, ale celou oktávu naráz.', 'Maska řekne runě, kde má zasáhnout.'],
      // Po poslední masce přijde step i complete naráz a complete repliku kroku přebije: patří do závěru.
      step: { 1: 'Pouto vybírá: kde maska mlčí, světlo zhasne.', 3: 'Rozcestí rozsvěcí: kde maska svítí, je světlo.' },
      complete: 'Výluka přepíná. Šest masek, tři runy.',
      solved: ['Pouto s maskou vybírá, Rozcestí rozsvěcí, Výluka přepíná.', 'Moderní stroje tak pracují s bajty: AND, OR a XOR s maskou.'],
      skill: 'Ani jeden zbytečný krystal masky.',
    },
    quiz: [
      {
        question: 'Jakou maskou zhasneš levou čtveřici a pravou necháš, jak je?',
        options: ['AND s 0000 1111', 'OR s 0000 1111', 'XOR s 1111 0000', 'AND s 1111 0000'],
        correct: 0,
        hint: 'Kde má světlo zůstat, musí maska svítit. Kde má zhasnout, musí mlčet.',
        explain: 'AND s 0000 1111 nechá pravou čtveřici beze změny a levou zhasne.',
      },
      {
        question: 'Co udělá XOR s maskou 1111 1111?',
        options: ['převrátí všechny krystaly', 'rozsvítí všechny', 'zhasne všechny', 'nic'],
        correct: 0,
        hint: 'Výluka přepne každý krystal, kde maska svítí.',
        explain: 'XOR s jedničkou krystal přepne. S maskou samých jedniček se převrátí celá oktáva, stejně jako páka převrať u doplňku.',
      },
    ],
    kodex: 'masky',
  },
  {
    id: 'III-13',
    title: 'Tajná řeč',
    kind: 'mask',
    config: secretSpeech(0b10110001, 0b01011010),
    generate: genIII13,
    presentation: {
      task: 'Lumenité psali tajně: každé písmeno přepnuli klíčem. Nastav masku na klíč.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Klíč je napsaný vpravo. Rozsviť masku přesně podle něj. U neznámého klíče porovnej šifru s písmenem E krystal po krystalu.',
      'Výluka s klíčem písmeno zašifruje a stejný klíč ho vrátí. Neznámý klíč svítí právě tam, kde se šifra a písmeno E liší.',
    ],
    echo: {
      intro: ['Tajná řeč. Tady si Lumenité posílali zprávy, které nikdo jiný nepřečetl.', 'Nejdřív jedno písmeno zašifruj.'],
      step: {
        0: 'Písmeno je k nepoznání. Klíč nechám v masce. Sleduj, co udělá se zprávou.',
        1: 'E. Stejný klíč, který písmeno zamkl, ho zase odemkl.',
        4: 'E, C, H, O. To jsem já. Tak mě Lumenité pojmenovali.',
      },
      complete: 'Stačilo jedno známé písmeno a klíč byl venku. Proto se dobrý klíč nepoužívá dvakrát.',
      solved: ['Výluka s klíčem šifruje a stejný klíč šifru zase odemkne.', 'Písmena jsou jen čísla: E je 69, tedy 0100 0101.'],
      skill: 'Oba klíče napoprvé.',
    },
    quiz: [
      {
        question: 'Zprávu přepneš klíčem (XOR) a pak ji přepneš stejným klíčem znovu. Co dostaneš?',
        options: ['původní zprávu', 'samé stíny', 'klíč', 'dvakrát silnější šifru'],
        correct: 0,
        hint: 'Co udělá dvakrát přepnutý krystal?',
        explain: 'Každý krystal přepnutý dvakrát je zpátky: (Z ⊻ K) ⊻ K = Z. Proto se XOR hodí na šifry.',
      },
    ],
    kodex: 'sifra',
  },
  {
    id: 'III-14',
    title: 'Méně je víc',
    kind: 'gate',
    config: lessIsMore(['nor', 'xnor', 'or', 'xor']),
    generate: genIII14,
    presentation: {
      task: 'Lumenité postavili obvod z několika run. Nahraď ho jedinou runou se stejnou deskou.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Deska brány vpravo je deska starého obvodu. Kdy lampa svítí?',
      'Najdi runu se stejnou deskou. Pomůžou zrcadla: obrácené vstupy a obrácený výstup prohodí Pouto s Rozcestím.',
    ],
    echo: {
      intro: ['Méně je víc. Staré obvody Lumenitů byly zbytečně dlouhé.', 'Kde stačí jedna runa, nestav čtyři.'],
      // Starý obvod se losuje (dvě až čtyři runy), replika proto počet neříká.
      step: { 0: 'Celý obvod, a přitom stačila jediná runa.' },
      wrong: 'Brána se nepohnula. Porovnej desku runy s deskou brány.',
      complete: 'Všechny obvody zkrácené.',
      solved: ['Dva obvody se stejnou deskou dělají totéž. Ten kratší je lepší.', 'Tak inženýři zjednodušují čipy.'],
      skill: 'Každá runa napoprvé.',
    },
    quiz: [
      {
        question: 'Proč stavět obvody z co nejméně run?',
        options: ['jsou rychlejší a levnější', 'svítí jasněji', 'mají delší desku', 'jinak nefungují'],
        correct: 0,
        hint: 'Každá runa světlo trochu zdrží a něco stojí.',
        explain: 'Méně hradel znamená menší, levnější a rychlejší čip, který navíc méně hřeje.',
      },
    ],
    kodex: 'zjednoduseni',
  },
  {
    id: 'III-15',
    title: 'Velká brána Zahrady',
    kind: 'mixed',
    echo: {
      intro: ['Velká brána Zahrady. Tudy prošli jen ti nejzvídavější z Lumenitů.', 'Tři zkoušky: závoj, Prapečeť a maska.'],
      solved: [
        'Velká brána Zahrady se otevírá. Na dveřích svítí celý glyf.',
        'Znáš všechny runy, umíš je zrcadlit, stavět z jediné a pouštět na celou oktávu.',
      ],
      skill: 'Celá velká brána bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-15',
        title: 'Závoj',
        kind: 'table',
        config: {
          tasks: [
            { mode: 'identify', circuit: single('imp'), choices: ['and', 'or', 'xor', 'nand', 'nor', 'xnor', 'imp'], answer: 'imp' },
            { mode: 'identify', circuit: single('nor'), choices: ['and', 'or', 'xor', 'nand', 'nor', 'xnor', 'imp'], answer: 'nor' },
          ],
        },
        generate: genIII15Identify,
        presentation: { task: 'První zkouška: poznej runu pod závojem.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Kdy lampa svítí? Najdi runu se stejnou deskou.',
          // Druhá runa se losuje i z Výluky a obrácených run: nápověda pokryje všechny (D-III-08).
          'Důsledek mlčí jen v řádku 1 0. Zlomené pouto, Zavřené rozcestí a Rovnost mají obrácené desky Pouta, Rozcestí a Výluky.',
        ],
        echo: { intro: ['První zkouška: závoj.'], solved: ['Runy poznáváš. Teď Prapečeť.'] },
      },
      {
        id: 'III-15',
        title: 'Prapečeť',
        kind: 'gate',
        config: { tasks: [nandOnly('or')] },
        generate: genIII15Nand,
        presentation: { task: 'Druhá zkouška: postav runu jen ze Zlomených pout.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Točité kameny vybírají, odkud do runy teče světlo.',
          'Zlomené pouto se dvěma stejnými světly je Obraceč. Pouto je Zlomené pouto a Obraceč, Rozcestí je Zlomené pouto obrácených vstupů.',
        ],
        echo: { intro: ['Druhá zkouška: jen Zlomená pouta.'], wrong: 'Brána se nepohnula. Odkud teče světlo do každé runy?', solved: ['Prapečeť poslechla. Zbývá maska.'] },
      },
      {
        id: 'III-15',
        title: 'Maska',
        kind: 'mask',
        config: {
          bits: 8,
          tasks: [
            { value: 0b11011010, op: 'and', target: 0b01001000, say: 'Nech svítit jen ta světla, která žádá oltář.' },
            { value: 0b11001010, op: 'xor', target: 0b11100011, say: 'Přepni jen ty krystaly, které se mají změnit.' },
          ],
        },
        generate: genIII15Mask,
        presentation: { task: 'Třetí zkouška: rozsviť masku tak, aby výsledek vypadal, jak žádá oltář.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Porovnej výsledek s cílem krystal po krystalu.',
          'Pouto vybírá, Rozcestí rozsvěcí, Výluka přepíná.',
        ],
        echo: { intro: ['Třetí zkouška: maska.'], solved: [] },
      },
    ],
    kodex: 'zahrada-hloub',
  },
];

export const ACT_III: ActDef = {
  numeral: 'III',
  title: 'Zahrada Bran',
  theme: 'Logika',
  glyphBase: 32,
  levels,
  lore: 'Schody vyvedou do zahrady kamenných bran. Runa v každé z nich rozhoduje, kudy světlo projde.',
  preview: 'Runy Obraceč, Pouto, Rozcestí a Výluka, deska zákona a první obvody z run.',
  review: [qAdd, qShiftLeft, qRead],
};
