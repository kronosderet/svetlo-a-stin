/**
 * Nápis slovy: co se stalo při chybném čtení nebo zápisu. Typická chyba má vlastní větu, ne jen
 * „špatně“: zrcadlo, zrcadlo po čtveřicích, počet světel, jediný krystal vedle, prohozené glyfy.
 * Čisté funkce, ať jdou vyzkoušet bez prohlížeče.
 */
import { isGateRoom } from '../content/levels';
import { mirroredNibbles, type InscriptionConfig, type ReadSlip } from '../core/puzzles/inscription';

/** Dvojznak: oktáva po dvou glyfech. */
const isPair = (cfg: InscriptionConfig): boolean => cfg.radix === 16 && cfg.bits === 8;

/** Krystal dvojznaku: ve kterém glyfu leží a kolik váží uvnitř své čtveřice (64 → levý, 4). */
function inGlyph(weight: number): { glyph: string; weight: number } {
  return weight >= 16 ? { glyph: 'levém', weight: weight >>> 4 } : { glyph: 'pravém', weight };
}

/** Kdo při zápisu žádá číslo: v bráně patra brána, jinde nápis (Velký nápis, Řeč glyfů, Dvojznak). */
export function demandLabel(roomId: string): string {
  return isGateRoom(roomId) ? 'Brána žádá' : 'Nápis žádá';
}

/** Proč kotouče nezapadly: věta k typické chybě čtení (guess = číslo na kotoučích). */
export function readSlipLine(cfg: InscriptionConfig, slip: ReadSlip, guess: number, value: number): string {
  switch (slip.kind) {
    case 'swap':
      // 3C a C3: prohozené glyfy, nebo zrcadlo v každé čtveřici? Věta platí pro obojí.
      return guess === mirroredNibbles(value)
        ? 'Glyfy vyšly obráceně. Levá čtveřice patří na levý kotouč a v každé čtveřici stojí nejtěžší krystal vlevo.'
        : 'Glyfy jsou prohozené. Levá čtveřice patří na levý kotouč.';
    case 'nibbles':
      return 'Každou čtveřici čteš zrcadlově. I v ní stojí nejtěžší krystal vlevo.';
    case 'mirror':
      return 'Čteš zrcadlově. Nejtěžší krystal stojí vlevo.';
    case 'count':
      return `${guess === 1 ? 'Jedno světlo' : 'Tolik světel'} svítí, to sedí. Každé ale váží jinak.`;
    case 'one': {
      if (!isPair(cfg)) return `Skoro. Liší se jediný krystal: ten s váhou ${slip.weight}.`;
      // Dvojznak se čte po čtveřicích 8, 4, 2, 1: váhu krystalu říct uvnitř jeho glyfu.
      const at = inGlyph(slip.weight);
      return `Skoro. V ${at.glyph} glyfu se liší jediný krystal: ten s váhou ${at.weight}.`;
    }
  }
}

/**
 * Proč zápis ještě nesedí: věta k typické chybě (mask = rozsvícené krystaly). Jediný krystal
 * vedle hra nejmenuje, řekne jen, kolik světlo váží: kterým krystalem to spravit, dopočítá hráč.
 */
export function writeSlipLine(cfg: InscriptionConfig, slip: ReadSlip, mask: number, value: number): string {
  switch (slip.kind) {
    case 'swap':
      return mask === mirroredNibbles(value)
        ? 'Glyfy vyšly obráceně. Levý glyf patří do levé čtveřice a v každé čtveřici stojí nejtěžší krystal vlevo.'
        : 'Glyfy jsou prohozené. Levý glyf patří do levé čtveřice.';
    case 'nibbles':
      return 'Každou čtveřici zapisuješ zrcadlově. I v ní stojí nejtěžší krystal vlevo.';
    case 'mirror':
      return 'Zapisuješ zrcadlově. Nejtěžší krystal stojí vlevo.';
    case 'one':
      if (isPair(cfg)) return `Skoro. V ${inGlyph(slip.weight).glyph} glyfu se liší jediný krystal.`;
      if (cfg.radix === 16) return 'Skoro. Liší se jediný krystal. Projdi strany glyfu jednu po druhé.';
      return `Skoro. Světlo váží ${mask}, ne ${value}. Liší se jediný krystal.`;
    case 'count':
      // Při zápisu počet světel nic neznamená (writeSlip ho nevrací).
      return `Světlo váží ${mask}, ne ${value}.`;
  }
}
