import { describe, expect, test } from 'vitest';
import { publishedEffects } from '../content';
import { discover, searchEffects } from './index';
import { normalize } from './normalize';
import { queryTerms, synonyms } from './synonyms';
import { emptyState, filterEffects, readState, writeState } from './filters';
import { createPreviewBudget } from '../hooks/previewBudget';
const ids = (query: string) => searchEffects(publishedEffects, query).slice(0, 3).map(hit => hit.effect.slug);
// SPEC §6: 12 query groups, 14 actual strings, 16 target assertions.
const current = [
  ['点一下卡片翻过来', 'card-flip'], ['按钮被鼠标吸过去', 'magnetic-button'], ['点击按钮出现水波纹', 'ripple-button'],
  ['鼠标移上去卡片跟着动', 'spotlight-card'], ['a card that follows my mouse', 'spotlight-card'],
  ['鼠标移上去卡片跟着动', 'card-tilt-3d'],
  ['a card that follows my mouse', 'card-tilt-3d'],
  ['文字像打字一样出现', 'typewriter'],
  ['frosted glass', 'glassmorphism'], ['blur background', 'glassmorphism'], ['毛玻璃', 'glassmorphism'],
];
test.each(current)('%s includes %s in top three', (query, slug) => expect(ids(query)).toContain(slug));
const future = [
  [4, '加载时灰色条闪光', 'skeleton-shimmer'], [4, '滚动时背景比内容慢', 'parallax-scroll'],
  [4, '向下滚动内容渐渐出现', 'scroll-reveal'], [4, '彩色流动的背景', 'aurora-gradient'], [4, '导航链接下面划线滑出来', 'underline-slide-link'],
];
for (const [stage, query, slug] of future) test.todo(`Stage ${stage}: ${query} must include ${slug} in top three`);
test('Chinese description ranks Tilt first with a real alias/phrase hint', () => {
  const hit = searchEffects(publishedEffects, '鼠标移上去卡片跟着动')[0];
  expect(hit.effect.slug).toBe('card-tilt-3d');
  expect(['aliases', 'searchPhrases']).toContain(hit.matchedField);
  expect([...hit.effect.aliases.en, ...hit.effect.aliases.zh, ...hit.effect.searchPhrases.en, ...hit.effect.searchPhrases.zh]).toContain(hit.matchedText);
});
test('normalization handles NFKC, punctuation, spacing and case', () => expect(normalize('  ＴＩＬＴ，Effect!!  ')).toBe('tilt effect'));
test.each(['TILT EFFECT', 'tilt eff', 'ｆｒｏｓｔｅｄ　ｇｌａｓｓ', 'typing', '指针跟随', '磨砂'])('names, prefixes and synonyms: %s', query => expect(ids(query).length).toBeGreaterThan(0));
test('exact aliases outrank generic fields', () => expect(ids('frosted glass')[0]).toBe('glassmorphism'));
test('Chinese substrings expand each embedded concept', () => {
  const terms = queryTerms('指针移上去跟着');
  for (const term of ['mouse', 'hover', 'follow']) expect(terms.flat()).toContain(term);
  expect(synonyms).toHaveLength(19);
});
test('English uses tokens/prefixes, not internal substrings', () => expect(searchEffects(publishedEffects, 'xyztypingxyz')).toEqual([]));
test('empty search retains catalogue order', () => expect(searchEffects(publishedEffects, '').map(hit => hit.effect.slug)).toEqual(publishedEffects.map(effect => effect.slug)));
test('nonsense is empty, recommendations are separate', () => {
  const result = discover(publishedEffects, '胡言乱语火星香蕉');
  expect(result.hits).toEqual([]); expect(result.nearest).toHaveLength(3);
});
describe('filters and URL', () => {
  test('OR inside trigger and category groups; AND across all groups', () => {
    const state = { ...emptyState, triggers: ['pointer-follow', 'continuous'] as const, categories: ['cards', 'text'] as const };
    const selected = { ...state, triggers: [...state.triggers], categories: [...state.categories] };
    expect(filterEffects(publishedEffects, selected).map(effect => effect.slug)).toEqual(['card-tilt-3d', 'typewriter', 'spotlight-card', 'gradient-text-shimmer']);
    expect(filterEffects(publishedEffects, { ...selected, type: 'animation' }).map(effect => effect.slug)).toEqual(['typewriter', 'gradient-text-shimmer']);
    expect(filterEffects(publishedEffects, { ...selected, categories: ['backgrounds'] })).toEqual([]);
  });
  test('search and approximate results stay inside filters', () => {
    const filtered = filterEffects(publishedEffects, { ...emptyState, type: 'style' });
    expect(discover(filtered, '胡言乱语火星香蕉').nearest.map(hit => hit.effect.slug)).toEqual(['glassmorphism']);
    expect(discover([], '胡言乱语').nearest).toEqual([]);
  });
  test('URL round trips unicode, multi select and single type', () => {
    const state = readState(new URLSearchParams('q=鼠标&trigger=hover,continuous&cat=cards,text&type=interaction'));
    expect(readState(writeState(state))).toEqual(state);
    expect(writeState(emptyState).toString()).toBe('');
  });
  test('invalid and duplicate URL filters are discarded', () => {
    expect(readState(new URLSearchParams('trigger=none,hover,hover,wrong&cat=cards,wrong&type=invalid'))).toEqual({ ...emptyState, triggers: ['hover'], categories: ['cards'] });
  });
});
test('generic preview budget caps at six, promotes waiting cards, cleans up', () => {
  const budget = createPreviewBudget(); const states = Array<boolean>(9).fill(false);
  const removers = states.map((_, index) => budget.subscribe(value => { states[index] = value; }));
  expect(states).toEqual([true, true, true, true, true, true, false, false, false]);
  removers[0](); states[0] = false;
  expect(states.filter(Boolean)).toHaveLength(6); expect(states[6]).toBe(true);
  removers.forEach(remove => remove());
  let granted = false; const remove = budget.subscribe(value => { granted = value; });
  expect(granted).toBe(true); remove();
});
