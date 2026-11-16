/**
 * Listování úlohami vyřešené komnaty. Obrazovka komnaty ho nastaví (kolik úloh, která je na desce
 * a jak na jinou přejít), kosočtverečky úloh nad hádankou podle něj ukážou šipky.
 */
export const browse: {
  /** Kolik úloh jde prolistovat (0 = listování neběží). */
  total: number;
  /** Která úloha je na desce. */
  at: number;
  /** Přejde na úlohu s daným pořadím. */
  show: ((index: number) => void) | null;
} = $state({ total: 0, at: 0, show: null });
