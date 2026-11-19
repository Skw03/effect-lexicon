import type { Effect, Language, Values } from '../types';

export function renderPrompt(effect: Effect, values: Values, lang: Language): string {
  const current = Object.fromEntries(effect.params.map(p => [p.key, values[p.key] ?? p.default]));
  const conditional = effect.prompt[lang].replace(
    /{{([#^])(\w+)}}([\s\S]*?){{\/\2}}/g,
    (_match: string, operator: string, key: string, content: string) =>
      (operator === '#' ? current[key] === true : current[key] === false) ? content : '',
  );
  return conditional.replace(/{{(\w+)}}/g, (match: string, key: string, offset: number) => {
    const param = effect.params.find(p => p.key === key);
    if (!param) throw new Error(`Unknown prompt parameter: ${key}`);
    const value = current[key];
    const suffix = conditional.slice(offset + match.length).trimStart();
    const unit = param.kind === 'number' ? param.unit : undefined;
    return `${String(value)}${unit && !suffix.startsWith(unit) ? unit : ''}`;
  });
}
