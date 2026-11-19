import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { DemoProps } from '../types';
import './ModalScaleFade.css';
export function ModalScaleFade({ values, compact, reducedMotion }: DemoProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (compact) return;
    if (!open) {
      if (wasOpen.current) opener.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    if (closing) return;
    closeButton.current?.focus({ preventScroll: true });
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [open, compact, closing]);
  const close = useCallback(() => {
    if (closing) return;
    setShown(false); setClosing(true);
    timer.current = setTimeout(() => { setOpen(false); setClosing(false); }, reducedMotion ? 0 : 150);
  }, [closing, reducedMotion]);
  useEffect(() => {
    if (!open || compact) return;
    const node = dialog.current;
    if (!node) return;
    const stage = node.closest('.demo-stage');
    let lastFocus: HTMLElement | null = closeButton.current;
    // The visual overlay is stage-local, but modal focus must survive outside
    // mouse/touch focus changes too. Leave parameter click/input events intact.
    const containFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && node.contains(target)) lastFocus = target;
      else (lastFocus?.isConnected ? lastFocus : closeButton.current)?.focus({ preventScroll: true });
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation(); close();
    };
    document.addEventListener('focusin', containFocus, true);
    document.addEventListener('keydown', escape, true);
    return () => {
      document.removeEventListener('focusin', containFocus, true);
      document.removeEventListener('keydown', escape, true);
      // Reset replaces this demo. Restore to its new opener after the DOM commit;
      // navigation removes the stage, so never steal focus from the next page.
      queueMicrotask(() => {
        if (stage?.isConnected && document.activeElement === document.body) {
          stage.querySelector<HTMLButtonElement>('.modal-opener:not(:disabled)')?.focus({ preventScroll: true });
        }
      });
    };
  }, [open, compact, close]);
  const visible = compact || shown;
  return <div className="modal-demo">
    {!compact && <button ref={opener} className="modal-opener" disabled={open} onClick={() => { setOpen(true); setClosing(false); }}>打开对话框</button>}
    {(compact || open) && <div className="modal-layer" onKeyDown={event => {
      if (event.key === 'Tab') {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        event.preventDefault(); buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    }}>
      <div className="modal-backdrop" style={{ opacity: visible ? 1 : 0, transitionDuration: compact || reducedMotion ? '0ms' : closing ? '150ms' : '200ms' }}/>
      <div ref={dialog} className="modal-dialog" role={compact ? undefined : 'dialog'} aria-modal={compact ? undefined : true} aria-labelledby={id} style={{ opacity: visible ? 1 : 0, transform: `scale(${visible ? 1 : values.startScale})`, transitionDuration: compact || reducedMotion ? '0ms' : closing ? '150ms' : `${values.duration}ms` }}>
        <h3 id={id}>留住这个想法</h3><p>给灵感一点空间，稍后再继续。</p>
        {compact ? <span className="modal-static-action" aria-hidden="true">关闭</span> : <div className="modal-actions"><button ref={closeButton} onClick={close}>关闭对话框</button><button onClick={close}>知道了</button></div>}
      </div>
    </div>}
  </div>;
}
