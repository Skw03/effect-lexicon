// A shared FIFO budget, independent of catalogue size. Removing an offscreen
// subscriber immediately grants its slot to the next visible preview.
export function createPreviewBudget(limit = 6) {
  const waiting = new Map<symbol, (granted: boolean) => void>();
  const notify = () => { let index = 0; waiting.forEach(listener => listener(index++ < limit)); };
  return {
    subscribe(listener: (granted: boolean) => void) {
      const id = Symbol(); waiting.set(id, listener); notify();
      return () => { waiting.delete(id); notify(); };
    },
  };
}
export const previewBudget = createPreviewBudget();
