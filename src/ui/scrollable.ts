/**
 * Svelte akce: hlásí, jestli se obsah prvku vejde do šířky, nebo jde posouvat do strany
 * (deska Dílny nebo Brány na úzkém telefonu). Podle toho se pod deskou ukáže výzva k posunu.
 */
export function scrollable(node: HTMLElement, onChange: (wide: boolean) => void) {
  let last: boolean | null = null;
  const check = () => {
    const wide = node.scrollWidth > node.clientWidth + 2;
    if (wide !== last) {
      last = wide;
      onChange(wide);
    }
  };
  const ro = new ResizeObserver(check);
  ro.observe(node);
  for (const child of node.children) ro.observe(child);
  check();
  return { destroy: () => ro.disconnect() };
}
