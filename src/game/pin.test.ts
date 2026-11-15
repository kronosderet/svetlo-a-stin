import { describe, expect, it } from 'vitest';
import { checkTeacherPin, sha256 } from './pin';

describe('sha256', () => {
  it('dává známé otisky', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    );
  });

  // Otisky spočítané přes node:crypto: hrany bloků (55, 56, 63, 64 bajtů) a UTF-8 s diakritikou.
  it.each([
    ['x'.repeat(55), 'd5e285683cd4efc02d021a5c62014694958901005d6f71e89e0989fac77e4072'],
    ['x'.repeat(56), '04c26261370ee7541549d16dee320c723e3fd14671e66a099afe0a377c16888e'],
    ['x'.repeat(63), '75220b47218278e656f2013bb8f0c455a25eaf01e86c64924e9d48d89776d6f2'],
    ['x'.repeat(64), '7ce100971f64e7001e8fe5a51973ecdfe1ced42befe7ee8d5fd6219506b5393c'],
    ['x'.repeat(119), '000b48d4edf0fa7bee3c6236ecd2785baa5db4eeb8bb54341b029e0d9fa5fb0c'],
    ['Světlo & Stín', '3637ba2756c3f6376dbb8aff59e992ae08191357e166f6c8a889b8cc4e04a85b'],
    ['Příliš žluťoučký kůň úpěl ďábelské ódy', '6f33ad2f13da6ec45a14dd2854c3bf486310af3832123272feb4d78461b8c96c'],
    ['🔆 krystal', 'e61dd92b9c9b87c779b617f8946162c5991fc7ac292c734f71a05ce382b71ae8'],
  ])('souhlasí s referencí: %s', (text, hash) => {
    expect(sha256(text)).toBe(hash);
  });
});

describe('PIN učitelského režimu', () => {
  it('odmítne prázdný a běžné PINy', () => {
    for (const pin of ['', '   ', '0000', '1234', '9999', 'ucitel']) expect(checkTeacherPin(pin)).toBe(false);
  });
});
