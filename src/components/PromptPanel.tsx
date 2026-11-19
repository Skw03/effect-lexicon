import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Effect, Language, Values } from '../types';
import { renderPrompt } from '../lib/renderPrompt';
import { copyText, isCopyPending, subscribeCopyPending } from '../lib/clipboard';
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
function initialLanguage(): Language {
  try { return localStorage.getItem('effect-lexicon-language') === 'zh' ? 'zh' : 'en'; } catch { return 'en'; }
}
export function PromptPanel({ effect, values }: { effect: Effect; values: Values }) {
  const [language, setLanguage] = useState<Language>('en');
  const [status, setStatus] = useState('');
  const timer = useRef<number>();
  const mounted = useRef(false);
  const revision = useRef(0);
  const pending = useSyncExternalStore(subscribeCopyPending, isCopyPending, () => false);
  const area = useRef<HTMLTextAreaElement>(null);
  const text = renderPrompt(effect, values, language);
  useClientLayoutEffect(() => { setLanguage(initialLanguage()); }, []);
  useClientLayoutEffect(() => {
    mounted.current = true;
    revision.current += 1;
    setStatus('');
    window.clearTimeout(timer.current);
    if (area.current) { area.current.style.height = 'auto'; area.current.style.height = `${area.current.scrollHeight + 4}px`; }
    return () => {
      mounted.current = false;
      revision.current += 1;
      window.clearTimeout(timer.current);
    };
  }, [text, language, values, effect]);
  return <section className="panel prompt-panel" data-language={language}><div className="section-heading"><h2>复制提示词</h2><div className="toolbar" aria-label="提示词语言">{(['zh', 'en'] as const).map(lang => <button key={lang} aria-pressed={language === lang} onClick={() => { setLanguage(lang); document.documentElement.dataset.promptLanguage = lang; try { localStorage.setItem('effect-lexicon-language', lang); } catch { /* Preference storage is optional. */ } }}>{lang === 'zh' ? '中文' : 'English'}</button>)}</div></div>
    <label className="sr-only" htmlFor="prompt">当前提示词</label><textarea id="prompt" ref={area} readOnly lang={language === 'zh' ? 'zh-CN' : 'en'} value={text} spellCheck={false}/>
    <button className="primary" aria-disabled={pending} aria-busy={pending} onClick={async () => {
      if (isCopyPending()) return;
      const node = area.current;
      if (!node) return;
      const requestRevision = revision.current;
      const isCurrent = () => mounted.current && revision.current === requestRevision;
      const snapshot = text;
      setStatus('');
      window.clearTimeout(timer.current);
      const success = await copyText(snapshot, isCurrent);
      if (!isCurrent() || success === undefined) return;
      setStatus(success ? '已复制到剪贴板' : '复制失败，请手动选择文本');
      window.clearTimeout(timer.current);
      if (success) timer.current = window.setTimeout(() => { if (isCurrent()) setStatus(''); }, 2000);
      else { node.focus(); node.select(); }
    }}>{pending ? '复制中…' : status === '已复制到剪贴板' ? '已复制' : '复制提示词'}</button>
    <p role="status" aria-live="polite">{status}</p><p className="muted">数值为建议值，可按需调整。</p>
  </section>;
}
