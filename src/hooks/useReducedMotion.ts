import { useSyncExternalStore } from 'react';
function subscribe(update: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
}
// A conservative, deterministic server snapshot never starts animation before preferences resolve.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);
}
