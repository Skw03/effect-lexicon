// The browser write cannot be cancelled. Keep one app-wide lock across route
// unmounts so an older write can never finish after a newer write has started.
let pending = false;
const listeners = new Set<() => void>();
export const isCopyPending = () => pending;
export function subscribeCopyPending(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function setPending(value: boolean) {
  pending = value;
  listeners.forEach(listener => listener());
}

function legacyCopy(snapshot: string): boolean {
  const previous = document.activeElement;
  const selection = previous instanceof HTMLTextAreaElement || previous instanceof HTMLInputElement
    ? { start: previous.selectionStart, end: previous.selectionEnd, direction: previous.selectionDirection }
    : undefined;
  const textarea = document.createElement('textarea');
  textarea.value = snapshot;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.cssText = 'position:fixed;left:-10000px;top:0;opacity:0;pointer-events:none';
  document.body.append(textarea);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (previous instanceof HTMLElement && previous.isConnected) {
      previous.focus({ preventScroll: true });
      if (selection && selection.start !== null && selection.end !== null &&
        (previous instanceof HTMLTextAreaElement || previous instanceof HTMLInputElement)) {
        previous.setSelectionRange(selection.start, selection.end, selection.direction ?? undefined);
      }
    }
  }
}

export async function copyText(snapshot: string, isCurrent: () => boolean): Promise<boolean | undefined> {
  if (pending) return undefined;
  setPending(true);
  try {
    try { await navigator.clipboard.writeText(snapshot); return true; } catch {
      // An obsolete request must not perform another write or move focus.
      return isCurrent() ? legacyCopy(snapshot) : false;
    }
  } finally {
    setPending(false);
  }
}
