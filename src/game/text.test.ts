import { describe, expect, it } from 'vitest';
import { inNum, plural, richParts, withNum } from './text';

describe('sazba textu', () => {
  it('indexy převede na sub/sup a šipky vyčlení', () => {
    expect(richParts('101₂ = 2⁰ + 2² → 5')).toEqual([
      { kind: 'text', value: '101' },
      { kind: 'sub', value: '2' },
      { kind: 'text', value: ' = 2' },
      { kind: 'sup', value: '0' },
      { kind: 'text', value: ' + 2' },
      { kind: 'sup', value: '2' },
      { kind: 'text', value: ' ' },
      { kind: 'arrow', dir: 'right' },
      { kind: 'text', value: ' 5' },
    ]);
    expect(richParts('2¹⁰ a 2ⁿ')).toEqual([
      { kind: 'text', value: '2' },
      { kind: 'sup', value: '10' },
      { kind: 'text', value: ' a 2' },
      { kind: 'sup', value: 'n' },
    ]);
  });

  it('obyčejný text nechá být', () => {
    expect(richParts('Světlo a stín')).toEqual([{ kind: 'text', value: 'Světlo a stín' }]);
  });

  it('předložka v, nebo ve podle toho, jak číslo zní', () => {
    expect([1, 2, 3, 4, 5, 7, 12, 14, 15, 21, 64, 128, 256].map(inNum)).toEqual([
      'v', 've', 've', 've', 'v', 'v', 've', 've', 'v', 've', 'v', 've', 've',
    ]);
  });

  it('předložka s, nebo se podle toho, jak číslo zní', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 12, 15, 16, 21, 50, 64, 128].map(withNum)).toEqual([
      's', 'se', 'se', 'se', 's', 'se', 'se', 's', 'se', 's', 'se', 'se', 's', 'se', 'se',
    ]);
  });

  it('skloňuje podle počtu', () => {
    expect([1, 2, 5].map((n) => plural(n, 'tah', 'tahy', 'tahů'))).toEqual(['tah', 'tahy', 'tahů']);
  });
});
