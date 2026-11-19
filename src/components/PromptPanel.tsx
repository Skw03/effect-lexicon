import { useEffect, useRef, useState } from 'react';
import type { Effect, Language, Values } from '../types';
import { renderPrompt } from '../lib/renderPrompt';
import { copyText } from '../lib/clipboard';
function initialLanguage(): Language {
  try { return localStorage.getItem('effect-lexicon-language') === 'zh' ? 'zh' : 'en'; } catch { return 'en'; }
}
export function PromptPanel({ effect, values }: { effect: Effect; values: Values }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [status, setStatus] = useState('');
  const timer = useRef<number>();
  const mounted = useRef(true);
  const area = useRef<HTMLTextAreaElement>(null);
  const text = renderPrompt(effect, values, language);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; window.clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    setStatus('');
    window.clearTimeout(timer.current);
    if (area.current) { area.current.style.height = 'auto'; area.current.style.height = `${area.current.scrollHeight + 4}px`; }
  }, [text]);
  return <section className="panel"><div className="section-heading"><h2>复制提示词</h2><div className="toolbar" aria-label="提示词语言">{(['zh', 'en'] as const).map(lang => <button key={lang} aria-pressed={language === lang} onClick={() => { setLanguage(lang); try { localStorage.setItem('effect-lexicon-language', lang); } catch { /* Preference storage is optional. */ } }}>{lang === 'zh' ? '中文' : 'English'}</button>)}</div></div>
    <label className="sr-only" htmlFor="prompt">当前提示词</label><textarea id="prompt" ref={area} readOnly lang={language === 'zh' ? 'zh-CN' : 'en'} value={text} spellCheck={false}/>
    <button className="primary" onClick={async () => {
      const node = area.current;
      if (!node) return;
      const success = await copyText(text, node);
      if (!mounted.current) return;
      setStatus(success ? '已复制到剪贴板' : '复制失败，请手动选择文本');
      window.clearTimeout(timer.current);
      if (success) timer.current = window.setTimeout(() => setStatus(''), 2000);
      else { node.focus(); node.select(); }
    }}>{status === '已复制到剪贴板' ? '已复制' : '复制提示词'}</button>
    <p role="status" aria-live="polite">{status}</p><p className="muted">数值为建议值，可按需调整。</p>
  </section>;
}
