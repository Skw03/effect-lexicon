import { publishedEffects } from '../content';
import { canonicalPath } from './path-policy.mjs';
import { site } from './config';
export const routes = ['/', '/guide', ...publishedEffects.map(effect => `/effects/${effect.slug}`)];
export function metadata(path: string) {
  path = canonicalPath(path, routes);
  const effect = publishedEffects.find(effect => path === `/effects/${effect.slug}`);
  const known = routes.includes(path);
  return {
    title: effect ? `${effect.name.zh} · ${effect.name.en} · ${site.name}` : `${path === '/' ? '效果 Library' : path === '/guide' ? '描述指南 Guide' : '页面未找到'} · ${site.name}`,
    description: effect?.summary || (path === '/guide' ? '用作用对象、触发方式、画面变化、运动细节、约束和边界描述动效。' : '浏览十八种真实交互动效，认识中英文名称，调整参数并复制提示词。'),
    canonical: known && site.origin ? site.origin + path : '',
    index: known && !!site.origin,
  };
}
