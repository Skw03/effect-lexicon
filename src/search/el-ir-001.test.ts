import { expect, test } from 'vitest';
import { publishedEffects } from '../content';
import { discover, searchEffects } from './index';
import { emptyState, filterEffects } from './filters';
const cases = [
  ['点按钮后圆圈向外扩散', 'ripple-button'],
  ['点击按钮时圆圈向外散开', 'ripple-button'],
  ['鼠标移到按钮上颜色从左往右填满', 'sliding-fill-button'],
  ['文字下面出现一条线', 'underline-slide-link'],
  ['卡片向上移动并慢慢显示', 'scroll-reveal'],
  ['按下按钮后出现扩散的圆圈', 'ripple-button'],
  ['在按钮上轻点，圆形向外扩散', 'ripple-button'],
  ['按钮里圆圈散开然后消失', 'ripple-button'],
  ['指针移入按钮，颜色从左边填满', 'sliding-fill-button'],
  ['悬停按钮时背景颜色向右填充', 'sliding-fill-button'],
  ['链接的文字下面长出细线', 'underline-slide-link'],
  ['文字下方的横线向右展开', 'underline-slide-link'],
  ['卡片慢慢显示并向上滑动', 'scroll-reveal'],
  ['滚动页面时卡片上移并淡入', 'scroll-reveal'],
  ['a circle expands inside a button', 'ripple-button'],
  ['button color fills from the left', 'sliding-fill-button'],
  ['a line appears below a link', 'underline-slide-link'],
  ['cards fade into view on scroll', 'scroll-reveal'],
];
test.each(cases)('EL-IR-001: %s → %s top three with actual evidence', (query, slug) => {
  const { hits, nearest } = discover(publishedEffects, query);
  expect(hits.slice(0, 3).map(hit => hit.effect.slug)).toContain(slug);
  expect(nearest).toEqual([]);
  const hit = hits.find(hit => hit.effect.slug === slug)!;
  const effect = hit.effect;
  const sources: Record<string, string[]> = { 'name.en': [effect.name.en], 'name.zh': [effect.name.zh], aliases: [...effect.aliases.en, ...effect.aliases.zh], searchPhrases: [...effect.searchPhrases.en, ...effect.searchPhrases.zh], tags: effect.tags, summary: [effect.summary], whatYouSee: [effect.whatYouSee], useCases: effect.useCases };
  expect(sources[hit.matchedField]).toContain(hit.matchedText);
});
test('EL-IR-001: exact names and aliases stay first in both languages', () => {
  for (const effect of publishedEffects) for (const query of [effect.name.en, effect.name.zh, ...effect.aliases.en, ...effect.aliases.zh]) {
    expect(searchEffects(publishedEffects, query)[0].effect.slug, query).toBe(effect.slug);
  }
});
test('EL-IR-001: description matching retains category/trigger intersection and honest empty state', () => {
  const selected = filterEffects(publishedEffects, { ...emptyState, categories: ['buttons'], triggers: ['click'] });
  expect(searchEffects(selected, cases[0][0])[0]?.effect.slug).toBe('ripple-button');
  const excluded = filterEffects(publishedEffects, { ...emptyState, categories: ['buttons'], triggers: ['hover'] });
  const result = discover(excluded, cases[0][0]);
  expect([...result.hits, ...result.nearest].every(hit => excluded.includes(hit.effect))).toBe(true);
  expect(discover(publishedEffects, '胡言乱语火星香蕉').hits).toEqual([]);
  expect(discover(publishedEffects, '胡言乱语火星香蕉').nearest).toHaveLength(3);
});
