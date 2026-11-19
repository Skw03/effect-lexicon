import type { Category, Effect, EffectType, Trigger } from '../types';
export const triggers: [Trigger, string][] = [['hover', '鼠标悬停'], ['pointer-follow', '鼠标跟随'], ['click', '点击'], ['scroll', '滚动'], ['page-load', '页面载入'], ['continuous', '自动循环']];
export const categories: [Category, string][] = [['buttons', '按钮'], ['cards', '卡片'], ['text', '文字'], ['backgrounds', '背景'], ['navigation', '导航'], ['scrolling', '滚动'], ['loading', '加载状态'], ['transitions', '转场与弹层']];
export const types: [EffectType, string][] = [['animation', '动画'], ['interaction', '交互'], ['style', '视觉样式']];
export interface DiscoveryState { q: string; triggers: Trigger[]; categories: Category[]; type: EffectType | '' }
export const emptyState: DiscoveryState = { q: '', triggers: [], categories: [], type: '' };
export function filterEffects(effects: Effect[], state: DiscoveryState): Effect[] {
  return effects.filter(effect => (!state.type || effect.type === state.type)
    && (!state.categories.length || state.categories.includes(effect.category))
    && (!state.triggers.length || effect.triggers.some(trigger => state.triggers.includes(trigger))));
}
export function readState(params: URLSearchParams): DiscoveryState {
  const selection = <T extends string>(key: string, options: [T, string][]) => options.map(([value]) => value).filter(value => (params.get(key) ?? '').split(',').includes(value));
  return { q: params.get('q') ?? '', triggers: selection('trigger', triggers), categories: selection('cat', categories), type: types.find(([value]) => value === params.get('type'))?.[0] ?? '' };
}
export function writeState(state: DiscoveryState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.triggers.length) params.set('trigger', triggers.filter(([key]) => state.triggers.includes(key)).map(([key]) => key).join(','));
  if (state.categories.length) params.set('cat', categories.filter(([key]) => state.categories.includes(key)).map(([key]) => key).join(','));
  if (state.type) params.set('type', state.type);
  return params;
}
