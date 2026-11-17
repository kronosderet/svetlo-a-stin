import type { Rune } from '../core/logic';
import { LIGHT, SHADOW } from '../core/puzzles/machine';
import {
  aluTask,
  compareTask,
  decoderTask,
  genIV15Alu,
  genIV15Register,
  genIV15Subtract,
  genIV7Adder,
  genIV7Compare,
  genIV7Route,
  muxTask,
  qChainSum,
  qCounter,
  shiftTask,
  subtractTask,
} from './generators4';
import {
  chainTask,
  compare1,
  compareTarget,
  countScript,
  counter,
  fullAdder,
  fullTarget,
  gatedLatch,
  gatedScript,
  halfAdder,
  halfTarget,
  latchScript,
  multiplier,
  multiplyTarget,
  mux,
  register,
  singleFlip,
  srLatch,
} from './machines';
import type { ActDef, LevelDef, Presentation } from './types';

const TWO: Rune[] = ['and', 'or', 'xor'];
const SLOT_HINT = 'Zvýrazněný kámen potřebuje jinou runu. Klikni na něj.';
const SOCKET_HINT = 'Zvýrazněný točitý kámen potřebuje jiný zdroj světla. Klikni na něj.';
const PIECE_HINT = 'Zvýrazněný kámen potřebuje jinou runu nebo jiný zdroj světla. Klikni na něj.';
const STEP_HINT = 'Zvýrazněný je další krok: krystal, nebo tep.';

/** Prezentace Dílny: číslice 0/1, váhy u čísel a živé hodnoty čísel pod deskou. */
const bench = (task: string, more: Partial<Presentation> = {}): Presentation => ({
  task,
  showDigits: true,
  showSum: false,
  sizes: 'equal',
  ledger: false,
  showWeights: true,
  showValues: true,
  ...more,
});

const half1 = halfAdder('and', TWO);
const half2 = halfAdder(TWO, TWO);
const fullBuild = fullAdder({ s: TWO, c2: TWO, c: TWO });
const cmp1 = compare1(['and', 'or', 'xor', 'xnor']);
const counterBuild = counter(
  [
    ['h2.S', 'h1.S', 'h0.S'],
    ['h2.S', 'h1.S', 'h0.S'],
    ['h2.S', 'h1.S', 'h0.S'],
  ],
  [SHADOW, LIGHT],
);
const mulBuild = multiplier(
  [
    ['p01', 'p10', 'p11'],
    ['p01', 'p10', 'p11'],
  ],
  [
    ['p11', 'p00', 'p10'],
    ['h1.P', 'h1.S', 'p01'],
  ],
);
const OPS: Rune[] = ['and', 'or', 'xor', 'nand'];

const levels: LevelDef[] = [
  // Nultá komnata patra: hotový stroj, který sčítá. Hráč jen zkouší krystaly a čte lampy.
  {
    id: 'IV-0',
    title: 'Stroj, který počítá',
    kind: 'machine',
    config: { tasks: [{ mode: 'explore', machine: halfAdder() }] },
    presentation: bench('Přepínej krystaly A a B a sleduj obě lampy. Vyzkoušej všechny čtyři kombinace.'),
    hints: [
      'Každým dotekem přepni jeden krystal a podívej se na obě lampy.',
      'Kombinace jsou čtyři: nic, jen A, jen B, obojí. Lampy mají váhy 2 a 1.',
      'Zvýrazněný krystal vede k nové kombinaci.',
    ],
    echo: {
      intro: ['Hlubina Strojů. Lumenité tu z run skládali stroje.', 'Tenhle má dvě lampy s vahami 2 a 1. Co asi dělá?'],
      found: {
        2: 'Lampy ukazují číslo. Jaké, to řeknou váhy pod nimi.',
        4: 'Lampy pokaždé ukážou, kolik krystalů svítí.',
      },
      solved: ['Stroj sčítá. 1 + 1 = 10, jako v Síni Počtářů.', 'Runy umí počítat. Tady dole z nich poskládáš celé stroje.'],
      skill: 'Bez jediného zbytečného doteku.',
    },
  },
  {
    id: 'IV-1',
    title: 'Poloviční sčítačka',
    kind: 'machine',
    config: {
      tasks: [
        { mode: 'build', machine: half1, target: halfTarget(half1) },
        { mode: 'build', machine: half2, target: halfTarget(half2) },
      ],
    },
    presentation: bench('Vlož do prázdného kamene runu tak, aby lampy ukázaly součet A + B. Pak spusť Zkoušku.'),
    hints: [
      'Klikni na prázdný kámen: runy se v něm střídají. Přepínej A a B a sleduj lampy.',
      'Lampa 1 je spodní číslice součtu: svítí, když svítí právě jeden krystal. Lampa 2 je přenos: svítí jen u 1 + 1.',
      SLOT_HINT,
    ],
    echo: {
      intro: ['Teď stroj sestavíš z run.', 'Která runa dá spodní číslici součtu? Vzpomeň na Zahradu.'],
      step: {
        0: 'Výluka. Spodní číslice je 1, jen když svítí právě jedno světlo.',
        1: 'Pouto dá přenos, Výluka spodní číslici.',
      },
      wrong: 'Lampy neukazují součet. Přepni krystaly podle desky a porovnej.',
      complete: 'Dvě runy a stroj umí sčítat.',
      solved: ['Výluka a Pouto spolu sečtou dvě světla.', 'Moderní jméno je poloviční sčítačka.'],
      skill: 'Oba stroje napoprvé.',
    },
    quiz: [
      {
        question: 'Proč na spodní číslici součtu nestačí Rozcestí?',
        options: [
          'U 1 + 1 by svítilo, a dole má být 0',
          'Rozcestí nepustí žádné světlo',
          'Rozcestí bere jen jedno světlo',
          'Stačí, je to totéž co Výluka',
        ],
        correct: 0,
        hint: 'Zkus v duchu 1 + 1. Co by udělalo Rozcestí a co má ukázat lampa 1?',
        explain: '1 + 1 = 10: dole 0 a přenos 1. Rozcestí by u dvou světel svítilo, Výluka zhasne.',
      },
      {
        question: 'Na poloviční sčítačce svítí obě lampy, 2 i 1. Kolik světel do ní vteklo?',
        options: ['To nejde: ze dvou světel je nejvýš 10', 'tři', 'dvě', 'jedno'],
        correct: 0,
        hint: 'Kolik je nejvíc, co dva krystaly dají dohromady?',
        explain: 'Dvě světla dají nejvýš 1 + 1 = 10. Na 11 je potřeba třetí vstup, a to umí až úplná sčítačka.',
      },
    ],
    kodex: 'polovicni',
  },
  {
    id: 'IV-2',
    title: 'Úplná sčítačka',
    kind: 'mixed',
    echo: {
      intro: ['Ve sloupci Kaskády se ale slévají až tři světla: A, B a přenos zprava.'],
      solved: ['Dvě Výluky, dvě Pouta a Rozcestí: úplná sčítačka.', 'Sečte jeden sloupec Kaskády i s přenosem.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-2',
        title: 'Zkoumání',
        kind: 'machine',
        config: { tasks: [{ mode: 'explore', machine: fullAdder() }] },
        presentation: bench('Přepínej krystaly A, B a přenos P. Sleduj, co ukážou lampy.'),
        hints: [
          'Přepínej jeden krystal po druhém a sleduj obě lampy.',
          'Kombinací je osm. Měň vždy jen jeden krystal, ať žádnou nevynecháš.',
          'Zvýrazněný krystal vede k nové kombinaci.',
        ],
        echo: {
          intro: ['Tři vstupy, osm kombinací.'],
          found: {
            4: 'Lampy zase počítají světla, která svítí.',
            8: 'Všech osm. Tři světla dají 11, tedy tři.',
          },
          solved: ['Tři světla dají nejvýš 11, přesně podle zákona sloupce.'],
        },
      },
      {
        id: 'IV-2',
        title: 'Stavba',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'build',
              machine: fullBuild,
              target: fullTarget(fullBuild),
            },
          ],
        },
        presentation: bench('Doplň runy do prázdných kamenů, aby lampy ukázaly A + B + P. Pak spusť Zkoušku.'),
        hints: [
          'Začni lampou 1: spodní číslicí tří světel.',
          'Spodní číslice je Výluka ze všech tří světel. Přenos svítí, když svítí aspoň dvě: buď A a B, nebo jedno z nich a P.',
          SLOT_HINT,
        ],
        echo: {
          intro: ['Teď úplnou sčítačku sestav z run.'],
          wrong: 'Lampy neukazují součet tří světel. Najdi řádek desky, kde se liší.',
          complete: 'Úplná sčítačka je hotová.',
          solved: [],
        },
        quiz: [
          {
            question: 'Do úplné sčítačky vtečou tři světla. Co ukážou lampy 2 a 1?',
            options: ['svítí obě', 'jen lampa 2', 'jen lampa 1', 'žádná'],
            correct: 0,
            hint: 'Tři světla jsou 1 + 1 + 1. Kolik je to dvojkově?',
            explain: '1 + 1 + 1 = 3 = 11: dole 1 a přenos 1, přesně jako ve sloupci Kaskády se třemi světly.',
          },
        ],
      },
    ],
    kodex: 'uplna',
  },
  {
    id: 'IV-3',
    title: 'Řetěz sčítaček',
    kind: 'machine',
    config: { tasks: [chainTask(2), chainTask(4), chainTask(3, 1)] },
    presentation: bench(
      'Úplná sčítačka je teď jediný kámen. Natoč točité kameny přenosu tak, aby lampy ukázaly, co žádá brána. Pak spusť Zkoušku.',
    ),
    hints: [
      'Klikni na točitý kámen u vstupu P: střídá stín, světlo a přenos ze sousední sčítačky.',
      'Přenos teče jako v Kaskádě, z každého sloupce do sousedního vlevo. Do nejlehčího sloupce nic nepřitéká, pokud brána nežádá o jednu víc.',
      SOCKET_HINT,
    ],
    echo: {
      intro: [
        'Úplnou sčítačku z minulé komnaty Lumenité zabalili do jednoho kamene.',
        'Sčítačky vedle sebe jsou sloupce Kaskády. Kudy teče přenos?',
      ],
      step: {
        0: 'Dva sloupce, dvě sčítačky. Přenos teče doleva.',
        1: 'Čtyři sčítačky sečtou čísla až do 15. Kaskáda z run.',
        2: 'Světlo v prvním přenosu přidá jedničku navíc.',
      },
      wrong: 'Lampy neukazují, co žádá brána. Nastav čísla, kde se stroj plete, a sleduj přenosy.',
      complete: 'Řetěz sčítaček sečte, co dostane.',
      solved: ['Z hotové sčítačky se stal jeden kámen. Tomu se říká abstrakce.', 'Kdo zná součástku, nemusí myslet na runy uvnitř.'],
      skill: 'Všechny tři řetězy napoprvé.',
    },
    quiz: [
      {
        question: 'Kolik úplných sčítaček potřebuje sčítání dvou oktáv (osmibitových čísel)?',
        options: ['8', '16', '9', '4'],
        correct: 0,
        hint: 'Každý sloupec sčítá jedna sčítačka. Kolik sloupců má oktáva?',
        explain: 'Osm sloupců, osm sčítaček. Přenos z té poslední rozsvítí devátý krystal součtu.',
      },
      {
        question: 'Co udělá světlo místo stínu v přenosu do nejlehčí sčítačky?',
        options: ['přidá k součtu jedničku', 'zdvojnásobí součet', 'nic', 'odečte jedničku'],
        correct: 0,
        hint: 'Jakou váhu má nejlehčí sloupec?',
        explain: 'Přenos do nejlehčího sloupce má váhu 1. Přesně tak počítač přičítá jedničku, a jak uvidíš v Hlubších síních, i odčítá.',
      },
    ],
    kodex: 'soucastka',
  },
  {
    id: 'IV-4',
    title: 'Porovnávač',
    kind: 'machine',
    config: {
      tasks: [
        {
          mode: 'build',
          machine: cmp1,
          target: compareTarget(cmp1, 1),
          rule: 'Lampa svítí, když A = B.',
        },
        compareTask(true),
        compareTask(false),
      ],
    },
    presentation: bench('Vlož runy tak, aby lampa svítila přesně podle svého jména. Pak spusť Zkoušku.'),
    hints: [
      'Porovnávej po sloupcích: jsou krystaly A a B v jednom sloupci stejné?',
      'Rovnost svítí, když jsou oba krystaly stejné. Čísla jsou stejná, když se shodne každý sloupec, a to pohlídá Pouto.',
      SLOT_HINT,
    ],
    echo: {
      intro: ['Porovnávač. Stroj, který pozná dvě stejná čísla.'],
      step: {
        0: 'Rovnost: stejná světla, lampa svítí.',
        1: 'Shodne se každý sloupec? Pouto se zeptá obou naráz.',
        2: 'Různá čísla: Výluka najde rozdíl a Rozcestí stačí jeden.',
      },
      wrong: 'Lampa se plete. Najdi na desce řádek, kde svítí jinak.',
      complete: 'Porovnávač pozná stejná i různá čísla.',
      solved: ['Porovnávač hlídá každý sloupec zvlášť.', 'Počítač takhle pozná třeba správné heslo.'],
      skill: 'Všechny tři porovnávače napoprvé.',
    },
    quiz: [
      {
        question: 'Porovnávač dvou oktáv (osmibitových čísel) má v každém sloupci jednu Rovnost. Kolik jich je?',
        options: ['8', '1', '16', '2'],
        correct: 0,
        hint: 'Kolik sloupců mají dvě oktávy pod sebou?',
        explain: 'Jedna Rovnost na sloupec, tedy osm. Pouto pak chce světlo ze všech osmi naráz.',
      },
    ],
    kodex: 'porovnavac',
  },
  {
    id: 'IV-5',
    title: 'Výhybka',
    kind: 'mixed',
    echo: {
      intro: ['Výhybka. Volič V určuje, kterou cestou světlo poteče.'],
      solved: [
        'Volič rozhoduje, kterou cestou teče světlo.',
        'Moderní jméno je multiplexor. Takhle si procesor vybírá, s čím bude počítat.',
      ],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-5',
        title: 'Volič',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'goals',
              machine: mux(),
              goals: [
                {
                  say: 'Rozsviť lampu krystalem A.',
                  lamps: { q: 1 },
                  inputs: { A: 1, B: 0, V: 0 },
                },
                {
                  say: 'Rozsviť volič V. Co udělá lampa?',
                  lamps: { q: 0 },
                  inputs: { A: 1, B: 0, V: 1 },
                },
                {
                  say: 'Rozsviť lampu znovu. Volič ať svítí dál.',
                  lamps: { q: 1 },
                  inputs: { V: 1 },
                },
                {
                  say: 'Zhasni A. Svítí lampa pořád?',
                  lamps: { q: 1 },
                  inputs: { A: 0, V: 1 },
                },
              ],
            },
          ],
        },
        presentation: bench('Splň cíle stroje. Sleduj, kterou cestou teče světlo.'),
        hints: [
          'Přepínej krystaly a sleduj, které Pouto propouští světlo.',
          'Volič ve stínu otevře horní cestu (A), volič ve světle dolní (B).',
          'Zvýrazněný krystal je další krok.',
        ],
        echo: {
          intro: ['Zkus, co volič dělá.'],
          found: {
            1: 'Volič mlčí, lampa ukazuje A.',
            2: 'Volič svítí a lampa teď poslouchá B.',
            3: 'A teď na lampu nemá vliv.',
          },
          solved: ['Volič vybírá jednu ze dvou cest.'],
        },
      },
      {
        id: 'IV-5',
        title: 'Stavba',
        kind: 'machine',
        config: { tasks: [muxTask(false)] },
        presentation: bench('Natoč točité kameny a vlož runu, aby volič ve stínu pustil k lampě A a ve světle B. Pak spusť Zkoušku.'),
        hints: [
          'Horní Pouto má pustit A, když volič mlčí. Co z voliče k němu má téct?',
          'Horní Pouto potřebuje obrácený volič (z Obraceče), dolní volič přímo. Obě cesty pak spojí Rozcestí.',
          PIECE_HINT,
        ],
        echo: {
          intro: ['Teď výhybku sestav z run.'],
          wrong: 'Lampa neposlouchá volič. Přepni V a sleduj obě Pouta.',
          complete: 'Výhybka funguje.',
          solved: [],
        },
        quiz: [
          {
            question: 'Volič výhybky svítí. Krystal A svítí, B mlčí. Co lampa?',
            options: ['mlčí', 'svítí', 'svítí napůl', 'bliká'],
            correct: 0,
            hint: 'Kterou cestu volič ve světle otevře?',
            explain: 'Volič ve světle pouští B. B mlčí, takže mlčí i lampa, ať dělá A cokoli.',
          },
        ],
      },
    ],
    kodex: 'vyhybka',
  },
  {
    id: 'IV-6',
    title: 'Rozdělovač',
    kind: 'machine',
    config: {
      tasks: [decoderTask([0, 1, 2, 3], [0, 3]), decoderTask([0, 1, 2, 3])],
    },
    presentation: bench('Natoč točité kameny tak, aby číslo A rozsvítilo právě lampu se svým číslem. Pak spusť Zkoušku.'),
    hints: [
      'Každé Pouto rozsvítí jednu lampu. Kdy má svítit lampa 0 a kdy lampa 3?',
      'Lampa 3 chce oba krystaly ve světle, lampa 0 oba ve stínu. Stín obrátí Obraceč: Pouto pak bere světlo z něj.',
      SOCKET_HINT,
    ],
    echo: {
      intro: ['Rozdělovač. Dva krystaly, čtyři lampy.', 'Každé číslo od 0 do 3 má rozsvítit jinou lampu.'],
      step: {
        0: 'Lampa 0 chce dvakrát stín, lampa 3 dvakrát světlo.',
        1: 'Každé číslo má svou lampu.',
      },
      wrong: 'Některé číslo rozsvítí cizí lampu. Nastav to číslo krystaly a sleduj Pouta.',
      complete: 'Rozdělovač pošle každé číslo na jeho místo.',
      solved: ['Rozdělovač pošle světlo právě na jedno místo.', 'Paměť počítače takhle najde buňku podle čísla, které se jmenuje adresa.'],
      skill: 'Oba rozdělovače napoprvé.',
    },
    quiz: [
      {
        question: 'Rozdělovač se třemi krystaly. Kolik lamp potřebuje?',
        options: ['8', '3', '6', '4'],
        correct: 0,
        hint: 'Kolik různých čísel zapíšou tři krystaly?',
        explain: 'Tři krystaly zapíšou čísla 0 až 7, to je osm lamp. S n krystaly je to 2ⁿ lamp.',
      },
    ],
    kodex: 'rozdelovac',
  },
  {
    id: 'IV-7',
    title: 'Brána Hlubiny',
    kind: 'mixed',
    echo: {
      intro: ['Brána Hlubiny. Tři zkoušky, každá s jiným strojem.'],
      solved: ['Brána Hlubiny je otevřená.', 'Sčítačka, výhybka, rozdělovač a porovnávač. Z takových součástek je složený každý počítač.'],
      skill: 'Celá brána bez zbytečné zkoušky.',
    },
    parts: [
      {
        id: 'IV-7',
        title: 'Sčítačka',
        kind: 'machine',
        config: { tasks: [chainTask(3)] },
        generate: genIV7Adder,
        presentation: bench('První zkouška: natoč točité kameny přenosu tak, aby lampy ukázaly, co žádá brána.'),
        hints: [
          'Přenos teče z každého sloupce do sousedního vlevo.',
          'Do nejlehčího sloupce přitéká stín, nebo světlo, když brána žádá o jedničku víc.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['První zkouška: řetěz sčítaček.'],
          solved: ['Sčítačka počítá.'],
        },
      },
      {
        id: 'IV-7',
        title: 'Cesty',
        kind: 'machine',
        config: { tasks: [decoderTask([2, 0, 3, 1]), muxTask(false)] },
        generate: genIV7Route,
        presentation: bench('Druhá zkouška: natoč točité kameny (a vlož runu), aby stroj posílal světlo, kam žádá brána.'),
        hints: [
          'U rozdělovače si přečti čísla lamp: nejsou popořadě. U výhybky sleduj, co pouští volič.',
          'Lampa s číslem 3 chce dvakrát světlo, s číslem 0 dvakrát stín. Pouto výhybky, které má pustit cestu při stínu voliče, bere volič z Obraceče.',
          PIECE_HINT,
        ],
        echo: {
          intro: ['Druhá zkouška: rozdělovač a výhybka.'],
          solved: ['Světlo teče, kam má.'],
        },
      },
      {
        id: 'IV-7',
        title: 'Porovnávač',
        kind: 'machine',
        config: { tasks: [compareTask(false)] },
        generate: genIV7Compare,
        presentation: bench('Třetí zkouška: vlož runy tak, aby lampa svítila podle svého jména.'),
        hints: [
          'Přečti jméno lampy: stejné, nebo různé?',
          'Stejná čísla hlídá Rovnost v každém sloupci a Pouto. Různá čísla najde Výluka a Rozcestí.',
          SLOT_HINT,
        ],
        echo: { intro: ['Třetí zkouška: porovnávač.'], solved: [] },
        quiz: [qChainSum],
      },
    ],
    kodex: 'hlubina',
  },

  // ───────────── Hlubší síně: paměť a stroje, které z ní žijí ─────────────
  {
    id: 'IV-8',
    title: 'Ozvěna',
    kind: 'mixed',
    echo: {
      intro: ['Hlubší síně. Tady stroje začínají pamatovat.'],
      solved: ['Ozvěna je paměť z run. Moderní jméno je klopný obvod.', 'Každý bit paměti v počítači drží podobný kruh.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-8',
        title: 'Kruh',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'goals',
              machine: srLatch(),
              goals: [
                { say: 'Rozsviť lampu Q.', lamps: { Q: 1 } },
                {
                  say: 'Zhasni S. Svítí lampa dál?',
                  lamps: { Q: 1 },
                  inputs: { S: 0, R: 0 },
                },
                { say: 'Zhasni lampu Q.', lamps: { Q: 0 } },
                {
                  say: 'Zhasni R. Zůstane lampa zhasnutá?',
                  lamps: { Q: 0 },
                  inputs: { S: 0, R: 0 },
                },
              ],
            },
          ],
        },
        presentation: bench('Splň cíle. Sleduj, co lampa udělá, když krystal zhasne.'),
        hints: [
          'Rozsviť S, pak R, a vždy je zase zhasni. Sleduj lampu.',
          'Obě Zavřená rozcestí si vracejí světlo do kruhu. Když vstupy mlčí, kruh drží, co v něm bylo.',
          'Zvýrazněný krystal je další krok.',
        ],
        echo: {
          intro: ['Ozvěna. Dvě runy, které si navzájem vracejí světlo.'],
          found: {
            1: 'Lampa svítí.',
            2: 'S zhaslo, a lampa svítí dál. Stroj si pamatuje.',
            3: 'R lampu zhasne.',
          },
          solved: ['Světlo v kruhu drží samo sebe.'],
        },
      },
      {
        id: 'IV-8',
        title: 'Stavba',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'build',
              machine: srLatch(['R', 'nq'], ['S', 'q']),
              script: latchScript,
            },
          ],
        },
        presentation: bench('Natoč točité kameny tak, aby ozvěna prošla zkouškou paměti. Pak spusť Zkoušku.'),
        hints: [
          'Zkouška chce, aby lampa svítila dál i po zhasnutí S. Kudy se může světlo vracet?',
          'Každé Zavřené rozcestí má brát druhé světlo z výstupu té druhé runy. Tak vznikne kruh.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['Teď kruh uzavři.'],
          wrong: 'Ozvěna zapomíná. Projdi kroky zkoušky vstupy a sleduj kruh.',
          complete: 'Kruh je uzavřený.',
          solved: [],
        },
        quiz: [
          {
            question: 'S i R mlčí. Co ukazuje lampa ozvěny?',
            options: ['to, co ukazovala naposledy', 'vždy stín', 'vždy světlo', 'nedá se říct, bliká'],
            correct: 0,
            hint: 'Co se stalo s lampou v prvním cíli, když S zhaslo?',
            explain: 'Když vstupy mlčí, kruh drží poslední stav. Právě proto je to paměť.',
          },
        ],
      },
    ],
    kodex: 'ozvena',
  },
  {
    id: 'IV-9',
    title: 'Tep Srdce',
    kind: 'mixed',
    echo: {
      intro: ['Srdce Observatoře tluče. Paměť se tu mění jen v rytmu tepu.'],
      solved: ['Ozvěna s tepem se mění jen v rytmu Srdce.', 'V počítači tluče takové srdce miliardkrát za sekundu. Říká se mu hodiny.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-9',
        title: 'Brána tepu',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'build',
              machine: gatedLatch(['D', 'nd'], ['D', 'nd']),
              script: gatedScript,
            },
          ],
        },
        presentation: bench('Natoč točité kameny tak, aby si ozvěna zapamatovala D jen ve chvíli, kdy svítí T. Pak spusť Zkoušku.'),
        hints: [
          'Horní Pouto vede do S (rozsvítit), dolní do R (zhasnout). Obě pustí světlo jen se světlem T.',
          'Do S má téct D, do R obrácené D. Když T mlčí, Pouta zavřou a ozvěna drží.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['Ozvěna z minulé komnaty je teď jeden kámen.', 'Krystal T je tep. Ozvěna má poslouchat D, jen když tep svítí.'],
          wrong: 'Ozvěna poslouchá, i když nemá. Projdi kroky zkoušky a sleduj obě Pouta.',
          solved: ['Ozvěna poslouchá D jen při tepu.'],
        },
      },
      {
        id: 'IV-9',
        title: 'Tep',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'goals',
              machine: singleFlip(),
              goals: [
                { say: 'Rozsviť D a pak udeř tepem.', lamps: { Q: 1 } },
                {
                  say: 'Zhasni D. Co udělá lampa?',
                  lamps: { Q: 1 },
                  inputs: { D: 0 },
                },
                { say: 'Zhasni lampu Q.', lamps: { Q: 0 } },
                {
                  say: 'Rozsviť D, lampa ať zůstane zhasnutá.',
                  lamps: { Q: 0 },
                  inputs: { D: 1 },
                },
              ],
            },
          ],
        },
        presentation: bench('Splň cíle. Tlačítko Tep (nebo klávesa T) je úder Srdce.'),
        hints: [
          'Ozvěna s tepem se změní jen při tepu. Přepni D a pak udeř tepem.',
          'Lampa ukazuje, co bylo na D při posledním tepu.',
          STEP_HINT,
        ],
        echo: {
          intro: ['Brána tepu je teď v jednom kameni: ozvěna s tepem.'],
          found: {
            1: 'Tep a ozvěna převzala světlo z D.',
            2: 'D zhaslo, lampa svítí dál. Mění se jen při tepu.',
            3: 'Další tep převzal stín.',
          },
          solved: [],
        },
        quiz: [
          {
            question: 'D svítí, ale tep zatím neudeřil. Co ukazuje lampa ozvěny s tepem?',
            options: ['co bylo na D při posledním tepu', 'svítí spolu s D', 'vždy mlčí', 'bliká'],
            correct: 0,
            hint: 'Kdy se ozvěna s tepem mění?',
            explain: 'Jen při tepu. Mezi tepy drží, co převzala naposledy, ať se D mění, jak chce.',
          },
        ],
      },
    ],
    kodex: 'tep',
  },
  {
    id: 'IV-10',
    title: 'Registr',
    kind: 'mixed',
    echo: {
      intro: ['Tři ozvěny s tepem nad sebou drží celé číslo.'],
      solved: ['Posun o patro výš je ×2, jako páka v Přílivu.', 'Moderní jméno je posuvný registr.'],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-10',
        title: 'Paměť čísla',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'goals',
              machine: register(),
              goals: [
                {
                  say: 'Ulož do paměti číslo 5.',
                  lamps: { Q2: 1, Q1: 0, Q0: 1 },
                },
                {
                  say: 'Nastav na vstupu 2. Paměť ať drží 5.',
                  lamps: { Q2: 1, Q1: 0, Q0: 1 },
                  inputs: { D2: 0, D1: 1, D0: 0 },
                },
                { say: 'Ulož 2.', lamps: { Q2: 0, Q1: 1, Q0: 0 } },
                {
                  say: 'Vymaž paměť: všechny lampy ať jsou zhasnuté.',
                  lamps: { Q2: 0, Q1: 0, Q0: 0 },
                },
              ],
            },
          ],
        },
        presentation: bench('Splň cíle. Číslo nastavíš krystaly D a tep je uloží do paměti.'),
        hints: ['Nastav číslo krystaly D a pak udeř tepem.', 'Krystaly mají váhy 4, 2 a 1. Paměť se změní jen při tepu.', STEP_HINT],
        echo: {
          intro: ['Registr. Paměť na celé číslo.'],
          found: {
            1: 'Pětka je v paměti.',
            2: 'Vstup se změnil, paměť drží.',
            3: 'Tep a paměť drží dvojku.',
          },
          solved: ['Registr drží číslo, dokud nepřijde tep.'],
        },
      },
      {
        id: 'IV-10',
        title: 'Posun',
        kind: 'machine',
        config: { tasks: [shiftTask('left')] },
        presentation: bench('Natoč točité kameny tak, aby každý tep posunul světlo o patro výš. Pak spusť Zkoušku.'),
        hints: [
          'Při každém tepu má každá ozvěna převzít světlo od sousední ozvěny pod sebou.',
          'Nejlehčí ozvěna bere ze vstupu X, prostřední z nejlehčí, nejtěžší z prostřední.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['Teď ať se číslo při tepu posouvá.'],
          wrong: 'Světlo neputuje, jak má. Projdi kroky zkoušky tepem.',
          complete: 'Světlo stoupá o patro s každým tepem.',
          solved: [],
        },
        quiz: [
          {
            question: 'V posuvném registru je 3 (011). Co v něm bude po jednom tepu, když X mlčí?',
            options: ['6 (110)', '1 (001)', '3 (011)', '7 (111)'],
            correct: 0,
            hint: 'Každé světlo stoupne o patro výš. Co přiteče zespoda?',
            explain: 'Každé světlo stoupne o patro, tedy ×2. Zespoda přiteče stín z X: 011 → 110.',
          },
        ],
      },
    ],
    kodex: 'registr',
  },
  {
    id: 'IV-11',
    title: 'Počítadlo hvězd',
    kind: 'mixed',
    echo: {
      intro: ['Počítadlo hvězd. Lumenité jím počítali noci na obloze.'],
      solved: [
        'Ozvěny drží číslo, sčítačky k němu přičtou jedna a tep uloží nový součet.',
        'Moderní jméno je čítač. Počítá kroky programu i sekundy v hodinkách.',
      ],
      skill: 'Bez jediného zbytečného kroku.',
    },
    parts: [
      {
        id: 'IV-11',
        title: 'Počítání',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'goals',
              machine: counter(),
              goals: [
                { say: 'Napočítej do 3.', lamps: { Q2: 0, Q1: 1, Q0: 1 } },
                { say: 'Napočítej do 6.', lamps: { Q2: 1, Q1: 1, Q0: 0 } },
                {
                  say: 'Počítej dál, až se počítadlo vrátí na 0.',
                  lamps: { Q2: 0, Q1: 0, Q0: 0 },
                },
              ],
            },
          ],
        },
        presentation: bench('Splň cíle. Každý tep přidá jednu hvězdu.'),
        hints: ['Udeř tepem a sleduj lampy.', 'Každý tep přičte jedničku. Po sedmičce počítadlo přeteče.', STEP_HINT],
        echo: {
          intro: ['Tohle počítadlo je hotové. Vyzkoušej, jak počítá.'],
          found: { 1: 'Tři tepy, tři hvězdy.', 2: 'Šest.' },
          solved: ['Po sedmi se počítadlo přetočí na nulu. Přetečení, jako v Síni Počtářů.'],
        },
      },
      {
        id: 'IV-11',
        title: 'Stavba',
        kind: 'machine',
        config: {
          tasks: [
            {
              mode: 'build',
              machine: counterBuild,
              script: countScript,
              rule: 'Každý tep přičte jedničku.',
            },
          ],
        },
        presentation: bench('Natoč točité kameny tak, aby každý tep přičetl jedničku. Pak spusť Zkoušku.'),
        hints: [
          'Každá ozvěna má dostat součet ze sčítačky pod sebou.',
          'Do nejlehčí sčítačky má přitékat stálé světlo: to je ta jednička, kterou tep přičte.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['Teď počítadlo sestav.'],
          wrong: 'Počítadlo nepočítá po jedné. Udeř tepem a sleduj, kam teče součet.',
          complete: 'Počítadlo počítá.',
          solved: [],
        },
        quiz: [qCounter],
      },
    ],
    kodex: 'citac',
  },
  {
    id: 'IV-12',
    title: 'Odčítačka',
    kind: 'machine',
    config: { tasks: [subtractTask('invert'), subtractTask('switch')] },
    presentation: bench('Natoč točité kameny (a vlož runy) tak, aby stroj počítal podle brány. Pak spusť Zkoušku.'),
    hints: [
      'Vzpomeň na Doplněk: odečíst B je totéž jako přičíst převrácené B a jedničku.',
      'Do každé sčítačky má téct převrácené B. Jednička navíc přiteče přenosem do nejlehčího sloupce.',
      PIECE_HINT,
    ],
    echo: {
      intro: ['Odčítačka. V Doplňku se odčítalo sčítáním. Tady to umí stroj.'],
      step: {
        0: 'Převrácené B a jednička v přenosu. Doplněk z run.',
        1: 'Výluka s M je obraceč na povel: M rozhodne, jestli se B převrátí.',
      },
      wrong: 'Výsledek nesedí. Nastav příklad, kde se stroj plete, a sleduj přenosy.',
      complete: 'Jeden stroj sčítá i odčítá.',
      solved: [
        'Výluka s M převrátí B jen při odčítání a M dodá i jedničku navíc.',
        'Procesor nemá zvláštní odčítačku. Odčítá sčítačkou a doplňkem.',
      ],
      skill: 'Obě odčítačky napoprvé.',
    },
    quiz: [
      {
        question: 'Proč při odčítání přitéká do nejlehčí sčítačky světlo?',
        options: [
          'doplněk je převrácené číslo a jednička navíc',
          'aby se výsledek zdvojnásobil',
          'bez světla by sčítačka nefungovala',
          'odčítá tím jedničku',
        ],
        correct: 0,
        hint: 'Jak se v Doplňku zapsalo záporné číslo?',
        explain: '−B = převrácené B + 1. Převrácení udělají runy a jedničku přidá přenos do nejlehčího sloupce.',
      },
    ],
    kodex: 'odcitacka',
  },
  {
    id: 'IV-13',
    title: 'Volič operace',
    kind: 'machine',
    config: { tasks: [aluTask(OPS, 'runes'), aluTask(OPS, 'selectors')] },
    presentation: bench('Stroj má počítat s A a B podle kódu operace O. Osaď kameny a natoč voliče výhybek. Pak spusť Zkoušku.'),
    hints: [
      'Kód operace je číslo O s vahami 2 a 1. Nastav kód a sleduj, kterou cestou světlo teče.',
      'Horní výhybky vybírají podle lehčího krystalu O, poslední podle těžšího. Kódy 0 a 1 vedou horní výhybkou, 2 a 3 dolní.',
      PIECE_HINT,
    ],
    echo: {
      intro: ['Volič operace. Čtyři runy, tři výhybky a kód, který vybere, co se spočítá.'],
      step: {
        0: 'Každý kód má svou runu.',
        1: 'Výhybky ve dvou patrech vyberou jednu ze čtyř cest.',
      },
      wrong: 'Některý kód vybere jinou operaci. Nastav ten kód krystaly O a sleduj výhybky.',
      complete: 'Stroj umí čtyři operace.',
      solved: ['Kód operace vybírá, co stroj spočítá.', 'Tohle je jádro procesoru: aritmeticko-logická jednotka, zkráceně ALU.'],
      skill: 'Oba voliče napoprvé.',
    },
    quiz: [
      {
        question: 'Volič má kód O = 2 (10). Která runa teď počítá výsledek?',
        options: ['Výluka', 'Rozcestí', 'Pouto', 'Zlomené pouto'],
        correct: 0,
        hint: 'Přečti pravidlo brány: který kód patří které runě?',
        explain: 'Kód 0 je Pouto, 1 Rozcestí, 2 Výluka, 3 Zlomené pouto. Kód 10 je dvojka, tedy Výluka.',
      },
    ],
    kodex: 'alu',
  },
  {
    id: 'IV-14',
    title: 'Násobička',
    kind: 'machine',
    config: {
      tasks: [
        {
          mode: 'build',
          machine: mulBuild,
          target: multiplyTarget(mulBuild),
          rule: 'Lampy mají ukázat součin A × B.',
        },
      ],
    },
    presentation: bench('Natoč točité kameny sčítaček tak, aby lampy ukázaly součin A × B. Pak spusť Zkoušku.'),
    hints: [
      'Pouta jsou kopie jako v Násobení po lumenitsku: každé je jeden krystal A krát jeden krystal B.',
      'Lampa s váhou 2 sčítá dvě prostřední Pouta. Přenos z nich a horní Pouto dají váhy 4 a 8.',
      SOCKET_HINT,
    ],
    echo: {
      intro: ['Násobička. V Síni Počtářů se násobilo kopiemi a sčítáním. Tady taky.'],
      wrong: 'Součin nesedí. Nastav příklad, kde se stroj plete, a sleduj, které kopie se sčítají.',
      solved: ['Pouta udělají kopie, sčítačky je sečtou.', 'Stejně násobí procesor, jen s mnohem víc sloupci.'],
      skill: 'Napoprvé.',
    },
    quiz: [
      {
        question: 'Kolik Pout potřebuje násobička dvou tříbitových čísel?',
        options: ['9', '6', '3', '8'],
        correct: 0,
        hint: 'Každý krystal A se násobí s každým krystalem B.',
        explain: 'Každý krystal A s každým krystalem B: 3 × 3 = 9 kopií.',
      },
    ],
    kodex: 'nasobicka',
  },
  {
    id: 'IV-15',
    title: 'Velká brána Hlubiny',
    kind: 'mixed',
    echo: {
      intro: ['Velká brána Hlubiny. Paměť, odčítání a volič operace.'],
      solved: [
        'Velká brána Hlubiny je otevřená.',
        'Paměť, tep, sčítačka a volič operace. Ze stejných součástek je složené Srdce Observatoře.',
      ],
      skill: 'Celá brána bez zbytečné zkoušky.',
    },
    parts: [
      {
        id: 'IV-15',
        title: 'Registr',
        kind: 'machine',
        config: { tasks: [shiftTask('right')] },
        generate: genIV15Register,
        presentation: bench('První zkouška: natoč točité kameny tak, aby registr prošel zkouškou paměti.'),
        hints: [
          'Přečti pravidlo: má světlo při tepu stoupat, nebo klesat?',
          'Každá ozvěna bere světlo od sousedky, ze které světlo přichází. Ta první bere ze vstupu X.',
          SOCKET_HINT,
        ],
        echo: {
          intro: ['První zkouška: posuvný registr.'],
          solved: ['Registr posouvá.'],
        },
      },
      {
        id: 'IV-15',
        title: 'Odčítačka',
        kind: 'machine',
        config: { tasks: [subtractTask('switch')] },
        generate: genIV15Subtract,
        presentation: bench('Druhá zkouška: natoč točité kameny (a vlož runy) tak, aby stroj počítal podle brány.'),
        hints: [
          'Odčítání je přičtení doplňku: převrácené B a jednička navíc.',
          'B převrátí Obraceč, nebo Výluka s M. Jednička přiteče přenosem do nejlehčího sloupce.',
          PIECE_HINT,
        ],
        echo: {
          intro: ['Druhá zkouška: odčítačka.'],
          solved: ['Odčítačka počítá.'],
        },
      },
      {
        id: 'IV-15',
        title: 'Volič',
        kind: 'machine',
        config: { tasks: [aluTask(['xor', 'and', 'nand', 'or'], 'runes')] },
        generate: genIV15Alu,
        presentation: bench('Třetí zkouška: osaď kameny voliče operace podle kódů brány.'),
        hints: [
          'Přečti pravidlo: který kód patří které runě?',
          'Kódy 0 a 1 vedou horní výhybkou, 2 a 3 dolní. V každé výhybce je nahoře sudý kód.',
          SLOT_HINT,
        ],
        echo: { intro: ['Třetí zkouška: volič operace.'], solved: [] },
        quiz: [
          {
            question: 'Který z těchto strojů potřebuje tep?',
            options: ['počítadlo hvězd', 'sčítačka', 'porovnávač', 'rozdělovač'],
            correct: 0,
            hint: 'Který z nich si musí pamatovat, kolik už napočítal?',
            explain:
              'Počítadlo drží číslo v ozvěnách s tepem. Sčítačka, porovnávač i rozdělovač jen počítají z toho, co do nich právě teče.',
          },
        ],
      },
    ],
    kodex: 'hlubina-hloub',
  },
];

export const ACT_IV: ActDef = {
  numeral: 'IV',
  title: 'Hlubina Strojů',
  theme: 'Obvody a paměť',
  glyphBase: 48,
  levels,
  nextAct: { numeral: 'V', title: 'Archiv Hlasů', theme: 'Kódy' },
};
