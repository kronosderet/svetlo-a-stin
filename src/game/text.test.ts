import { describe, expect, it } from 'vitest';
import { inNum, plainLength, plainText, plural, richParts, segments, typoCz, withNum } from './text';

describe('sazba textu', () => {
  it('indexy převede na sub/sup a šipky vyčlení', () => {
    expect(richParts('101₂ = 2⁰ + 2² → 5')).toEqual([
      { kind: 'text', value: '101' },
      { kind: 'sub', value: '2' },
      { kind: 'text', value: ' = 2' },
      { kind: 'sup', value: '0' },
      { kind: 'text', value: ' + 2' },
      { kind: 'sup', value: '2' },
      { kind: 'text', value: ' ' },
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

  it('česká sazba: předložky, čísla a znaménka u levého operandu', () => {
    const nb = (s: string) => s.replace(/~/g, '\u00A0');
    expect(typoCz('Přepni krystaly A a B a sleduj lampu v Kaskádě.')).toBe(nb('Přepni krystaly A~a~B a~sleduj lampu v~Kaskádě.'));
    expect(typoCz('Zkouška se zastavila ve 2. kroku a v 8 řádcích.')).toBe(nb('Zkouška se zastavila ve 2.~kroku a~v~8~řádcích.'));
    expect(typoCz('Stroj sčítá: 1 + 1 = 10, hotovo 8 / 8.')).toBe(nb('Stroj sčítá: 1~+ 1~= 10, hotovo 8~/ 8.'));
    expect(typoCz('0 → 0 · 1 → 1')).toBe(nb('0~→ 0 · 1~→ 1'));
    expect(typoCz('„A teď“ (s nápovědou)')).toBe(nb('„A~teď“ (s~nápovědou)'));
    expect(typoCz('Bez mezer')).toBe('Bez mezer');
    const once = typoCz('a v z 3 krystaly');
    expect(typoCz(once)).toBe(once);
    expect(once.length).toBe('a v z 3 krystaly'.length);
  });

  it('skloňuje podle počtu', () => {
    expect([1, 2, 5].map((n) => plural(n, 'tah', 'tahy', 'tahů'))).toEqual(['tah', 'tahy', 'tahů']);
  });
});

describe('nečitelná slova se záznamem Kodexu', () => {
  it('slovo se záznamem nese klíč a délka počítá jen slovo', () => {
    const segs = segments('Jsem {{Echo|sifra}}.');
    expect(segs[1]).toEqual({ kind: 'glyph', value: 'Echo', start: 5, key: 'sifra' });
    expect(plainLength('Jsem {{Echo|sifra}}.')).toBe('Jsem Echo.'.length);
  });

  it('čtečka přečte jen přeložené slovo', () => {
    expect(plainText('Jsem {{Echo|sifra}}.')).toBe('Jsem (nečitelné).');
    expect(plainText('Jsem {{Echo|sifra}}.', (k) => k === 'sifra')).toBe('Jsem Echo.');
    expect(plainText('…{{ticho}}…', () => true)).toBe('…(nečitelné)…');
  });
});
