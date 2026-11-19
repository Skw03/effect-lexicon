import { describe, expect, it } from 'vitest';
import { effects, plannedRelatedSlugs } from './index';
import { demoRegistry } from '../demos/registry';
import { renderPrompt } from '../lib/renderPrompt';
import { defaults } from '../types';
describe('Stage 1 content contract', () => {
  it('publishes exactly the three approved samples', () => {
    expect(effects.map(effect => effect.slug)).toEqual(['card-tilt-3d', 'typewriter', 'glassmorphism']);
    expect(new Set(effects.map(effect => effect.slug)).size).toBe(effects.length);
    expect(new Set(effects.map(effect => effect.id)).size).toBe(effects.length);
    expect(plannedRelatedSlugs).toEqual(['spotlight-card', 'card-flip', 'staggered-text-reveal', 'gradient-text-shimmer', 'aurora-gradient', 'modal-scale-fade']);
  });
  for (const effect of effects) {
    it(`${effect.slug} validates complete content, registry and planned references`, () => {
      expect(effect.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(effect.status).toBe('published');
      expect(demoRegistry[effect.demo.component]).toBeTypeOf('function');
      expect(effect.params.length).toBeGreaterThanOrEqual(2);
      expect(effect.params.length).toBeLessThanOrEqual(5);
      for (const field of [effect.name.en, effect.name.zh, effect.summary, effect.whatYouSee, effect.terminologyNote, effect.demo.hint, effect.demo.hintTouch]) expect(field?.trim().length).toBeGreaterThan(0);
      for (const list of [effect.aliases.en, effect.aliases.zh, effect.behavior, effect.useCases, effect.tags]) expect(list.length).toBeGreaterThan(0);
      expect(effect.searchPhrases.zh.length).toBeGreaterThanOrEqual(3);
      // Explicit Stage 1 exact-sample boundary; global 3–6 EN rule remains a future decision.
      expect(effect.searchPhrases.en.length).toBe(effect.slug === 'card-tilt-3d' ? 3 : 2);
      for (const slug of effect.related) expect([...effects.map(item => item.slug), ...plannedRelatedSlugs]).toContain(slug);
      expect(new Set(effect.params.map(param => param.key)).size).toBe(effect.params.length);
      for (const param of effect.params) {
        if (param.kind === 'number') {
          expect(param.default).toBeTypeOf('number');
          expect(param.default).toBeGreaterThanOrEqual(param.min!);
          expect(param.default).toBeLessThanOrEqual(param.max!);
          expect(param.step).toBeGreaterThan(0);
        } else if (param.kind === 'boolean') expect(param.default).toBeTypeOf('boolean');
        else expect(param.options?.map(option => option.value)).toContain(param.default);
      }
    });
    it.each(['en', 'zh'] as const)(`${effect.slug}: %s prompt keys, conditions and truthful timing`, lang => {
      const template = effect.prompt[lang];
      const stack: string[] = [];
      for (const match of template.matchAll(/{{([#^/]?)(\w+)}}/g)) {
        const param = effect.params.find(item => item.key === match[2]);
        expect(param).toBeDefined();
        if (match[1] === '#' || match[1] === '^') { expect(param?.kind).toBe('boolean'); stack.push(match[2]); }
        if (match[1] === '/') expect(stack.pop()).toBe(match[2]);
      }
      expect(stack).toEqual([]);
      const rendered = renderPrompt(effect, defaults(effect), lang);
      expect(rendered).not.toContain('{{');
      expect(rendered).toMatch(lang === 'en' ? /Trigger:/ : /触发方式：/);
      expect(rendered).toMatch(lang === 'en' ? /suggested values/ : /建议值/);
      if (effect.type === 'style') {
        expect(effect.triggers).toEqual(['none']);
        expect(effect.demo.staticStyle).toBe(true);
        expect(rendered).toMatch(lang === 'en' ? /none;.*no animation/ : /无；.*没有动画/);
        expect(rendered).toContain('blur(16px)');
      } else {
        expect(rendered).toMatch(/\d+ms/);
        expect(rendered).toContain('prefers-reduced-motion');
      }
    });
  }
});
