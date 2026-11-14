/** Přesune fokus na prvek hned po jeho zobrazení. */
export function autofocus(node: HTMLElement, enabled: boolean = true): void {
  if (enabled) queueMicrotask(() => node.focus({ preventScroll: true }));
}
