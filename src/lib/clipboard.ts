export async function copyText(text: string, textarea: HTMLTextAreaElement): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* Continue to the offline legacy fallback. */ }
  textarea.focus();
  textarea.select();
  try { return document.execCommand('copy'); } catch { return false; }
}
