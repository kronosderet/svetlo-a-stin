/**
 * Hlídání plynulosti: pár vteřin po spuštění se změří snímková frekvence. Když se hra
 * na školním počítači trhá, zavolá onSlow (hra pak sama zapne úspornou grafiku).
 * Měří se jen na viditelné stránce; ve skryté kartě prohlížeč snímky brzdí.
 */
export function watchFrameRate(onSlow: () => void, ms = 4000, minFps = 24): () => void {
  let start = 0;
  let frames = 0;
  let raf = 0;
  const tick = (t: number) => {
    if (document.visibilityState !== 'visible') {
      start = 0;
      frames = 0;
    } else {
      if (!start) start = t;
      frames++;
      if (t - start >= ms) {
        const fps = ((frames - 1) * 1000) / (t - start);
        if (frames > 20 && fps < minFps) onSlow();
        return;
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
