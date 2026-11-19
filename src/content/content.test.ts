import { describe, expect, it } from 'vitest';
import { effects } from './index';
import { demoRegistry } from '../demos/registry';
import { renderPrompt } from '../lib/renderPrompt';
import { defaults } from '../types';
describe('Stage 4 content contract', () => {
  it('publishes exactly eighteen effects across eight categories', () => {
    expect(effects.map(effect => effect.slug)).toEqual(['card-tilt-3d', 'typewriter', 'glassmorphism', 'card-flip', 'spotlight-card', 'magnetic-button', 'ripple-button', 'sliding-fill-button', 'gradient-text-shimmer', 'staggered-text-reveal', 'aurora-gradient', 'underline-slide-link', 'shrinking-sticky-header', 'parallax-scroll', 'scroll-reveal', 'skeleton-shimmer', 'pulsing-dots-loader', 'modal-scale-fade']);
    expect(new Set(effects.map(effect => effect.slug)).size).toBe(effects.length);
    expect(new Set(effects.map(effect => effect.id)).size).toBe(effects.length);
    expect(new Set(effects.map(effect => effect.category)).size).toBe(8);
  });
  for (const effect of effects) {
    it(`${effect.slug} validates complete content, registry and implemented published references`, () => {
      expect(effect.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(effect.status).toBe('published');
      expect(demoRegistry[effect.demo.component]).toBeTypeOf('function');
      expect(effect.params.length).toBeGreaterThanOrEqual(2);
      expect(effect.params.length).toBeLessThanOrEqual(5);
      for (const field of [effect.name.en, effect.name.zh, effect.summary, effect.whatYouSee, effect.terminologyNote, effect.demo.hint, effect.demo.hintTouch]) expect(field?.trim().length).toBeGreaterThan(0);
      for (const list of [effect.aliases.en, effect.aliases.zh, effect.behavior, effect.useCases, effect.tags]) expect(list.length).toBeGreaterThan(0);
      expect(effect.searchPhrases.zh.length).toBeGreaterThanOrEqual(3);
      expect(effect.searchPhrases.en.length).toBeGreaterThanOrEqual(3);
      expect(effect.searchPhrases.en.length).toBeLessThanOrEqual(6);
      expect(effect.searchPhrases.zh.length).toBeLessThanOrEqual(6);
      for (const slug of effect.related) {
        const target = effects.find(item => item.slug === slug);
        expect(target?.status).toBe('published');
        expect(demoRegistry[target!.demo.component]).toBeTypeOf('function');
      }
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
      for (const param of effect.params) expect(template).toMatch(new RegExp('\\{\\{[#^]?' + param.key + '\\}\\}'));
      const rendered = renderPrompt(effect, defaults(effect), lang);
      expect(rendered).not.toContain('{{');
      expect(rendered).toContain('prefers-reduced-motion');
      expect(rendered).toMatch(lang === 'en' ? /keyboard|arrow-key/i : /键盘|方向键/);
      expect(rendered).toMatch(lang === 'en' ? /touch|tap/i : /触屏|触摸/);
      expect(rendered).toMatch(lang === 'en' ? /Trigger:/ : /触发方式：/);
      expect(rendered).toMatch(lang === 'en' ? /suggested values/ : /建议值/);
      if (effect.type === 'style') {
        expect(effect.triggers).toEqual(['none']);
        expect(effect.demo.staticStyle).toBe(true);
        expect(rendered).toMatch(lang === 'en' ? /none;.*no animation/ : /无；.*没有动画/);
        expect(rendered).toContain('blur(16px)');
      } else {
        if (['gradient-text-shimmer', 'aurora-gradient', 'skeleton-shimmer'].includes(effect.slug)) expect(rendered).toMatch(/\d+(?:\.\d+)?s/);
        else expect(rendered).toMatch(/\d+ms/);
        expect(rendered).toContain('prefers-reduced-motion');
      }
    });
  }
});

it('Stage 3 preserves specified defaults/ranges and only adds scoped tuning parameters', () => {
  const numeric: Record<string, Record<string, [number, number, number]>> = {
    'card-flip': { duration: [600, 200, 1200] },
    'spotlight-card': { radius: [240, 100, 400], intensity: [.18, .05, .4] },
    'magnetic-button': { strength: [.35, .1, .6], radius: [80, 40, 160] },
    'ripple-button': { duration: [600, 200, 1200], opacity: [.35, .1, .6] },
    'sliding-fill-button': { duration: [300, 100, 800], width: [160, 120, 240] },
    'gradient-text-shimmer': { duration: [2.5, 1, 6], bandWidth: [20, 10, 40] },
    'staggered-text-reveal': { stagger: [60, 20, 200], duration: [500, 200, 1000], distance: [16, 0, 40] },
  };
  for (const [slug, expected] of Object.entries(numeric)) {
    const effect = effects.find(item => item.slug === slug)!;
    expect(Object.fromEntries(effect.params.filter(param => param.kind === 'number').map(param => [param.key, [param.default, param.min, param.max]]))).toEqual(expected);
    for (const related of effect.related) expect(effects.map(item => item.slug)).toContain(related);
  }
  const axis = effects.find(item => item.slug === 'card-flip')!.params.find(param => param.key === 'axis')!;
  expect(axis.default).toBe('vertical');
  expect(axis.options?.map(option => option.value)).toEqual(['vertical', 'horizontal']);
});

 it('Stage 4 numeric defaults and ranges remain faithful, with two meaningful additions', () => {
  const expected: Record<string, Record<string, [number, number, number]>> = {
    'aurora-gradient': { duration: [16,8,30], blur: [60,20,120] },
    'underline-slide-link': { duration: [250,100,600], thickness: [2,1,6] },
    'shrinking-sticky-header': { threshold: [40,10,120], collapsedHeight: [48,36,64] },
    'parallax-scroll': { backgroundSpeed: [.5,.1,.9], midgroundSpeed: [.8,.6,1] },
    'scroll-reveal': { distance: [24,0,60], duration: [600,200,1200] },
    'skeleton-shimmer': { duration: [1.6,.8,3], bandWidth: [40,20,60] },
    'pulsing-dots-loader': { size: [10,6,24], duration: [1.2,.6,2.4] },
    'modal-scale-fade': { duration: [250,100,600], startScale: [.95,.8,1] },
  };
  for (const [slug, params] of Object.entries(expected)) {
    const effect = effects.find(item => item.slug === slug)!;
    expect(Object.fromEntries(effect.params.map(param => [param.key, [param.default, param.min, param.max]]))).toEqual(params);
  }
});

it('every template token, including inactive conditions, names a declared parameter', () => {
  for (const effect of effects) for (const lang of ['en', 'zh'] as const) {
    const template = effect.prompt[lang];
    const keys = effect.params.map(param => param.key);
    // Inspect the source, not just rendered text: a false condition can hide a typo.
    for (const token of template.matchAll(/{{([^{}]*)}}/g)) {
      expect(token[1]).toMatch(/^[#^/]?\w+$/);
      expect(keys, `${effect.slug}/${lang}: ${token[0]}`).toContain(token[1].replace(/^[#^/]/, ''));
    }
    expect(template.replace(/{{[^{}]*}}/g, '')).not.toMatch(/{{|}}/);
  }
});
