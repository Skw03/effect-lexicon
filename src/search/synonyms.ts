import { normalize } from './normalize';
export const synonyms = [
  ['鼠标', '光标', '指针', 'cursor', 'mouse', 'pointer'],
  ['跟随', '跟着', '追踪', 'follow', 'track'],
  ['悬停', '移上去', '移过', '划过', 'hover'],
  ['翻转', '翻面', '翻过来', 'flip'], ['倾斜', '歪', '偏', 'tilt'],
  ['毛玻璃', '磨砂', '玻璃', 'frosted', 'glass', 'blur'],
  ['打字', '逐字', 'typing', 'typewriter'], ['加载', '载入', 'loading'],
  ['骨架屏', '灰色占位', 'skeleton'], ['滚动', '滑动', '下滑', 'scroll'],
  ['视差', 'parallax'], ['渐显', '淡入', '慢慢显示', '逐渐显示', 'fade'], ['水波纹', '涟漪', 'ripple'],
  ['磁吸', '吸附', 'magnetic'], ['渐变', '流动', 'gradient', 'aurora'],
  ['弹窗', '对话框', '模态', 'modal', 'dialog'], ['下划线', 'underline'],
  ['吸顶', '固定', 'sticky'], ['光斑', '聚光', 'spotlight', 'glow'],
];
export function queryTerms(query: string): string[][] {
  const terms = normalize(query).match(/[\p{Script=Han}]+|[^\s\p{Script=Han}]+/gu) ?? [];
  const expanded = terms.map(term => {
    const group = synonyms.find(group => group.includes(term));
    return group ? [...new Set([term, ...group])] : [term];
  });
  // Chinese descriptions contain several concepts without word separators.
  for (const group of synonyms) {
    if (terms.some(term => group.some(word => /\p{Script=Han}/u.test(word) && term.includes(word)))) expanded.push(group);
  }
  return expanded;
}
