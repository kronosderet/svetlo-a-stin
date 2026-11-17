import { mount } from 'svelte';
import '@fontsource/cinzel/700.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/atkinson-hyperlegible-next/400.css';
import '@fontsource/atkinson-hyperlegible-next/700.css';
import '@fontsource/atkinson-hyperlegible-next/400-italic.css';
import '@fontsource/atkinson-hyperlegible-mono/500.css';
import '@fontsource/atkinson-hyperlegible-mono/700.css';
import './app.css';
import App from './App.svelte';
import { typoCz } from './game/text';

const app = mount(App, { target: document.getElementById('app')! });

/**
 * Česká sazba v celé hře (typoCz): texty obsahu, repliky Echa i losované otázky se upraví, jakmile
 * se objeví nebo změní. Mění se jen mezery za nezlomitelné, Svelte si text dál přepisuje po svém.
 */
function typeset(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node as Text;
    if (text.parentElement?.closest('script, style, textarea')) return;
    const fixed = typoCz(text.data);
    if (fixed !== text.data) text.data = fixed;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) typeset(t);
}
new MutationObserver((records) => {
  for (const r of records) {
    if (r.type === 'characterData') typeset(r.target);
    else r.addedNodes.forEach(typeset);
  }
}).observe(document.body, { subtree: true, childList: true, characterData: true });
typeset(document.body);

export default app;
