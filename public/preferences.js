try { globalThis.document.documentElement.dataset.promptLanguage = globalThis.localStorage.getItem('effect-lexicon-language') === 'zh' ? 'zh' : 'en'; } catch { /* Optional local preference. */ }
