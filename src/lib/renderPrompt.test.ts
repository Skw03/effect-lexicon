import { describe, expect, it } from 'vitest';
import { effects } from '../content';
import { defaults } from '../types';
import type { Effect } from '../types';
import { renderPrompt } from './renderPrompt';
describe('renderPrompt', () => {
  for (const effect of effects) for (const lang of ['en', 'zh'] as const) {
    it(`${effect.slug} ${lang}: all defaults and bounds render without tokens`, () => {
      const values = defaults(effect);
      const result = renderPrompt(effect, values, lang);
      expect(result).not.toContain('{{');
      for (const param of effect.params) {
        if (param.kind === 'number') {
          for (const value of [param.min!, param.max!]) {
            expect(renderPrompt(effect, { ...values, [param.key]: value }, lang)).toContain(`${value}${param.unit ?? ''}`);
          }
        }
      }
    });
  }
  it.each(['en', 'zh'] as const)('glare positive conditional %s', lang => {
    const effect = effects[0];
    const word = lang === 'en' ? '25%' : '25%';
    expect(renderPrompt(effect, { ...defaults(effect), glare: true }, lang)).toContain(word);
    expect(renderPrompt(effect, { ...defaults(effect), glare: false }, lang)).not.toContain(word);
  });
  it.each(['en', 'zh'] as const)('loop inverse retains three-phrase traversal %s', lang => {
    const effect = effects[1];
    const off = renderPrompt(effect, { ...defaults(effect), loop: false }, lang);
    expect(off).toContain(lang === 'en' ? 'until all three phrases have appeared' : '依次遍历三句');
    expect(off).toContain(lang === 'en' ? 'After the last phrase stop' : '最后一句完成后停止');
    const on = renderPrompt(effect, { ...defaults(effect), loop: true }, lang);
    expect(on).toContain(lang === 'en' ? 'delete it and return to the first' : '删除并回到第一句');
    expect(on).not.toContain(lang === 'en' ? 'After the last phrase stop' : '最后一句完成后停止');
  });
  it.each(['{{time}}', '{{time}}ms', '{{time}} ms'])('unit appears exactly once: %s', template => {
    const effect: Effect = { ...effects[0], params: [{ key: 'time', label: '时间', kind: 'number', default: 200, min: 100, max: 300, unit: 'ms' }], prompt: { en: template, zh: template } };
    expect(renderPrompt(effect, {}, 'en').replace(/\s/g, '')).toBe('200ms');
  });
  it('unitless number, boolean and select are not given artificial units/ranges', () => {
    const effect: Effect = { ...effects[0], params: [
      { key: 'amount', label: '比例', kind: 'number', default: 1.03, min: 1, max: 2 },
      { key: 'enabled', label: '开关', kind: 'boolean', default: false },
      { key: 'axis', label: '方向', kind: 'select', default: 'vertical', options: [{ value: 'vertical', label: '垂直' }] },
    ], prompt: { en: '{{amount}} {{enabled}} {{axis}} {{#enabled}}on{{/enabled}}{{^enabled}}off{{/enabled}}', zh: '' } };
    expect(renderPrompt(effect, {}, 'en')).toBe('1.03 false vertical off');
  });
  it('rejects unknown replacement keys', () => {
    expect(() => renderPrompt({ ...effects[0], prompt: { en: '{{missing}}', zh: '' } }, {}, 'en')).toThrow('Unknown prompt parameter');
  });
});
