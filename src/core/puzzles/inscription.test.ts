import { describe, expect, it } from 'vitest';
import {
  confirm,
  currentTask,
  dialWheels,
  hintBit,
  mirrored,
  readSlip,
  initInscription,
  nudgeDial,
  par,
  pushDigit,
  setDial,
  shownMask,
  toggle,
  type InscriptionConfig,
} from './inscription';

const read: InscriptionConfig = {
  bits: 4,
  tasks: [
    { dir: 'read', value: 13 },
    { dir: 'read', value: 6 },
  ],
};

const mixed: InscriptionConfig = {
  bits: 6,
  tasks: [
    { dir: 'write', value: 5 },
    { dir: 'read', value: 54 },
  ],
};

describe('nápis: čtení', () => {
  it('krystaly ukazují nápis, ne hráčovo světlo', () => {
    expect(shownMask(read, initInscription())).toBe(13);
  });

  it('správné číslo posune na další nápis a vynuluje kotouče', () => {
    const st = setDial(read, initInscription(), 13);
    const r = confirm(read, st);
    expect(r.events.map((e) => e.type)).toEqual(['step']);
    expect(r.state.step).toBe(1);
    expect(r.state.dial).toBe(0);
    expect(r.state.moves).toBe(1);
    expect(shownMask(read, r.state)).toBe(6);
  });

  it('chybné číslo se zapíše jako omyl a zůstane k porovnání', () => {
    const st = setDial(read, initInscription(), 11);
    const r = confirm(read, st);
    expect(r.events).toEqual([{ type: 'wrong', guess: 11, target: 13 }]);
    expect(r.state.mistakes).toBe(1);
    expect(r.state.lastGuess).toBe(11);
    expect(r.state.step).toBe(0);
  });

  it('dokončí level po posledním nápisu', () => {
    let st = confirm(read, setDial(read, initInscription(), 13)).state;
    const r = confirm(read, setDial(read, st, 6));
    st = r.state;
    expect(r.events.map((e) => e.type)).toEqual(['step', 'complete']);
    expect(st.complete).toBe(true);
    expect(currentTask(read, st)).toBeNull();
    expect(shownMask(read, st)).toBe(6);
  });

  it('kotouče nejdou přes svůj rozsah ani pod nulu', () => {
    expect(setDial(read, initInscription(), 150).dial).toBe(99);
    expect(setDial(read, initInscription(), -3).dial).toBe(0);
  });

  it('při čtení nejde přepínat krystaly', () => {
    expect(toggle(read, initInscription(), 0).events).toEqual([]);
  });
});

describe('nápis: zápis', () => {
  it('úloha se splní, jakmile světlo váží požadovanou hodnotu', () => {
    let st = initInscription();
    st = toggle(mixed, st, 2).state;
    expect(shownMask(mixed, st)).toBe(4);
    const r = toggle(mixed, st, 0);
    expect(r.events.map((e) => e.type)).toEqual(['toggle', 'step']);
    expect(r.state.step).toBe(1);
    expect(r.state.moves).toBe(2);
    // Další úloha je čtení: krystaly teď ukazují nápis.
    expect(shownMask(mixed, r.state)).toBe(54);
  });

  it('při zápisu nejde potvrdit kotouče', () => {
    expect(confirm(mixed, initInscription()).events).toEqual([]);
    expect(setDial(mixed, initInscription(), 5).dial).toBe(0);
  });

  it('nápověda vede od nejtěžšího chybějícího krystalu, při čtení mlčí', () => {
    expect(hintBit(mixed, initInscription())).toBe(2);
    expect(hintBit(read, initInscription())).toBeNull();
  });
});

describe('nápis: kotouče', () => {
  it('počet kotoučů odpovídá největší hodnotě', () => {
    expect(dialWheels(4)).toBe(2);
    expect(dialWheels(6)).toBe(2);
    expect(dialWheels(8)).toBe(3);
  });

  it('kotouč se přetočí z 9 na 0 a nesahá na sousedy', () => {
    expect(nudgeDial(19, 1, 1, 2)).toBe(10);
    expect(nudgeDial(10, 1, -1, 2)).toBe(19);
    expect(nudgeDial(5, 0, 1, 2)).toBe(15);
    expect(nudgeDial(5, 0, -1, 2)).toBe(95);
  });

  it('napsaná číslice se přidá zprava', () => {
    expect(pushDigit(0, 1, 2)).toBe(1);
    expect(pushDigit(1, 3, 2)).toBe(13);
    expect(pushDigit(13, 7, 2)).toBe(37);
  });
});

describe('nápis: ideální počet tahů', () => {
  it('jedno potvrzení na nápis, jeden dotek na krystal zápisu', () => {
    expect(par(read)).toBe(2);
    expect(par(mixed)).toBe(2 + 1);
  });
});

describe('nápis: glyfy (šestnáctkové kotouče)', () => {
  const hex: InscriptionConfig = { bits: 8, radix: 16, tasks: [{ dir: 'read', value: 0xb6 }] };

  it('na každou čtveřici krystalů je jeden kotouč', () => {
    expect(dialWheels(4, 16)).toBe(1);
    expect(dialWheels(8, 16)).toBe(2);
  });

  it('kotouč se točí od 0 do F a zase na 0', () => {
    expect(nudgeDial(0xf0, 0, 1, 2, 16)).toBe(0x00);
    expect(nudgeDial(0x0a, 1, -1, 2, 16)).toBe(0x09);
    expect(pushDigit(0x0b, 6, 2, 16)).toBe(0xb6);
  });

  it('přečtený dvojznak se přijme', () => {
    const st = setDial(hex, initInscription(), 0xb6);
    expect(confirm(hex, st).state.complete).toBe(true);
    expect(setDial(hex, initInscription(), 999).dial).toBe(255);
  });
});

describe('nápis: typické chyby čtení', () => {
  const four: InscriptionConfig = { bits: 4, tasks: [] };
  const glyphs: InscriptionConfig = { bits: 8, radix: 16, tasks: [] };

  it('zrcadlový obraz přesune krystaly na opačnou stranu', () => {
    expect(mirrored(0b1100, 4)).toBe(0b0011);
    expect(mirrored(0b0001, 4)).toBe(0b1000);
    expect(mirrored(0b10110000, 8)).toBe(0b00001101);
  });

  it('pozná zrcadlové čtení', () => {
    expect(readSlip(four, 3, 0b1100)).toEqual({ kind: 'mirror' });
    expect(readSlip(four, 1, 0b1000)).toEqual({ kind: 'mirror' });
  });

  it('pozná počet světel místo vah', () => {
    expect(readSlip(four, 2, 0b0101)).toEqual({ kind: 'count' });
    expect(readSlip(four, 3, 0b1011)).toEqual({ kind: 'count' });
  });

  it('pozná jediný krystal vedle a řekne jeho váhu', () => {
    expect(readSlip(four, 9, 0b1101)).toEqual({ kind: 'one', weight: 4 });
    expect(readSlip(four, 14, 0b1100)).toEqual({ kind: 'one', weight: 2 });
  });

  it('zrcadlo má přednost před jediným krystalem a počet světel před ním taky', () => {
    // 0010 zrcadlově je 0100: liší se dva krystaly, ale hlavně je to zrcadlo.
    expect(readSlip(four, 4, 0b0010)).toEqual({ kind: 'mirror' });
    // 0011 má dvě světla a 2 se od 3 liší jediným krystalem: počet světel je výstižnější.
    expect(readSlip(four, 2, 0b0011)).toEqual({ kind: 'count' });
  });

  it('u dvojznaku pozná prohozené glyfy', () => {
    expect(readSlip(glyphs, 0xc3, 0x3c)).toEqual({ kind: 'swap' });
    expect(readSlip({ bits: 8, tasks: [] }, 0xc3, 0x3c)).toBeNull();
  });

  it('chybu bez jména, správné číslo a číslo mimo rozsah nechá být', () => {
    expect(readSlip(four, 7, 0b1101)).toBeNull();
    expect(readSlip(four, 13, 0b1101)).toBeNull();
    expect(readSlip(four, 99, 0b1101)).toBeNull();
  });
});
