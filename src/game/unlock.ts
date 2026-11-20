import { BASIC_PATH, actOf, advancedRooms, gateOf, isAdvanced } from '../content/levels';

/**
 * Základní cesta se otevírá po jedné komnatě napříč patry (brána otevře další patro).
 * Hlubší síně patra se otevřou po jeho bráně a pak zase po jedné. Hotová komnata je vždy otevřená,
 * takže postup ze starší verze zůstane celý: brána prošlá dřívější zkratkou dál otevírá další patro
 * i Hlubší síně a komnata, kterou převod rozvržení přidal neodehranou, nezamkne ty za sebou.
 */
export function unlockedIn(id: string, done: (id: string) => boolean): boolean {
  if (done(id)) return true;
  if (isAdvanced(id)) {
    const act = actOf(id);
    if (!done(gateOf(act))) return false;
    const rooms = advancedRooms(act);
    const i = rooms.findIndex((l) => l.id === id);
    return i === 0 || (i > 0 && done(rooms[i - 1].id));
  }
  const i = BASIC_PATH.findIndex((l) => l.id === id);
  return i === 0 || (i > 0 && done(BASIC_PATH[i - 1].id));
}
