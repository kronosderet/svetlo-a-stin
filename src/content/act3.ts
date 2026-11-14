import { runeTable } from '../core/logic';
import { branch, chain, genIII5, genIII6, genIII7Fill, genIII7Gate, genIII7Identify, single } from './generators3';
import { qTableRows } from './quizzes';
import type { ActDef, LevelDef } from './types';

const SLOT_HINT = 'Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.';
const EXPLORE_HINTS: [string, string, string] = [
  'Každým dotekem přepni jeden vstup a sleduj lampu.',
  'Kombinace jsou čtyři: oba stín, jen A, jen B, oba světlo. Zkus je všechny.',
  'Zvýrazněný vstup vede k nové kombinaci.',
];

const levels: LevelDef[] = [
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
      task: 'Vlož do prázdného kamene runu tak, aby lampa svítila přesně podle brány. Pak spusť Zkoušku.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Klikni na prázdný kámen: runy se v něm střídají. Pak přepni vstup a sleduj lampu.',
      'Průchod pustí světlo, jak přišlo. Obraceč ho obrátí: ze světla udělá stín a ze stínu světlo.',
      SLOT_HINT,
    ],
    echo: {
      intro: [
        'Zahrada Bran. Lumenité tu světlu stavěli cesty a do cest vkládali runy.',
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
        question: 'Světlo projde dvěma Obraceči za sebou. Co dorazí k lampě?',
        options: ['totéž, co vyšlo', 'vždy stín', 'vždy světlo', 'opak toho, co vyšlo'],
        correct: 0,
        hint: 'Každý Obraceč světlo obrátí. Co se stane, když ho obrátíš dvakrát?',
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
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
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
          'Zvýrazněná buňka nesedí.',
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
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
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
          'Zvýrazněná buňka nesedí.',
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
      intro: ['Jen jeden. Tahle runa je vybíravá.', 'Vzpomínáš na Soutok? Jedna a jedna tam dala dole stín.'],
      solved: ['Výluka pustí světlo, když svítí právě jeden vstup.', 'Dvě světla se v ní vyruší jako v Soutoku: dole zůstane stín.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'III-4',
        title: 'Zkoumání',
        kind: 'gate',
        config: { tasks: [{ mode: 'explore', circuit: single('xor') }] },
        presentation: { task: 'Přepínej vstupy A a B a vyzkoušej všechny čtyři kombinace. Kdy lampa svítí?', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
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
          'Zvýrazněná buňka nesedí.',
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
            question: 'Vzpomeň na Soutok: 1 + 1 = 10. Kterou číslici součtu dává Výluka?',
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
        { mode: 'identify', circuit: single('or'), choices: ['and', 'or', 'xor'], answer: 'or' },
        { mode: 'fill', circuit: single('and') },
        { mode: 'identify', circuit: single('xor'), choices: ['and', 'or', 'xor'], answer: 'xor' },
        { mode: 'fill', circuit: single('xor') },
        { mode: 'identify', circuit: single('and'), choices: ['and', 'or', 'xor'], answer: 'and' },
      ],
    },
    generate: genIII5,
    presentation: {
      task: 'Deska zákona prozradí runu pod závojem. A podle runy jde desku zase vyplnit.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Projdi desku řádek po řádku. Kdy lampa svítí?',
      'Pouto svítí jen v řádku 1 1, Rozcestí ve všech kromě 0 0, Výluka v řádcích 0 1 a 1 0.',
      'Zvýrazněná je správná runa, nebo buňka, která nesedí.',
    ],
    echo: {
      intro: ['Které pravidlo? Lumenité si runy zakrývali závojem.', 'Deska zákona ale prozradí, co se pod ním skrývá.'],
      step: { 0: 'Ano. Deska runu prozradila.' },
      wrong: 'Deska nesedí. Jak tahle runa pouští světlo?',
      complete: 'Pět desek, tři runy.',
      solved: ['Každá runa má svou desku zákona.', 'Kdo zná desku, pozná runu i bez pohledu pod závoj.'],
      skill: 'Každá deska napoprvé.',
    },
    quiz: [qTableRows],
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
        { mode: 'slots', circuit: branch(), target: [0, 1, 0, 0] },
      ],
    },
    generate: genIII6,
    presentation: {
      task: 'Runy se tu řadí za sebe. Osaď kameny tak, aby lampa svítila podle brány.',
      showDigits: true,
      showSum: false,
      sizes: 'equal',
      ledger: false,
    },
    hints: [
      'Začni od lampy: má svítit, nebo mlčet, když svítí oba vstupy?',
      'Najdi runu, která dá desku přesně obráceně, a za ni postav Obraceč. Ve větvení můžeš Obracečem otočit jeden vstup.',
      SLOT_HINT,
    ],
    echo: {
      intro: ['Řetězy. Světlo projde jednou runou a hned další.', 'Ze známých run tu vznikají nové.'],
      step: {
        0: 'Pouto a za ním Obraceč. Lumenité tomu říkali Zlomené pouto.',
        1: 'A Rozcestí s Obracečem je Zavřené rozcestí.',
        2: 'Teď větvení: každý vstup má svou cestu.',
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
        presentation: { task: 'První zkouška: vyplň desku zákona pro obvod vlevo.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Pro každý řádek pusť v duchu světlo obvodem zleva doprava.',
          'Nejdřív urči, co vyjde z první runy, a teprve pak, co s tím udělá další.',
          'Zvýrazněná buňka nesedí.',
        ],
        echo: {
          intro: ['První zkouška: deska zákona obvodu.'],
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
            { mode: 'slots', circuit: branch(), target: [1, 1, 0, 1] },
            { mode: 'slots', circuit: chain(), target: runeTable('nand') },
          ],
        },
        generate: genIII7Gate,
        presentation: { task: 'Druhá zkouška: osaď kameny tak, aby lampa svítila podle brány.', showDigits: true, showSum: false, sizes: 'equal', ledger: false },
        hints: [
          'Začni od lampy: kdy má svítit?',
          'Najdi runu s touhle deskou, nebo s deskou obrácenou, a za ni dej Obraceč.',
          SLOT_HINT,
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
          'Zvýrazněná je správná runa.',
        ],
        echo: {
          intro: ['Třetí zkouška: závoj.'],
          solved: [],
        },
      },
    ],
    kodex: 'zahrada',
  },
];

export const ACT_III: ActDef = {
  numeral: 'III',
  title: 'Zahrada Bran',
  theme: 'Logika',
  glyphBase: 32,
  levels,
  nextAct: { numeral: 'IV', title: 'Hlubina Strojů', theme: 'Obvody a paměť' },
};
