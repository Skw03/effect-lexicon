import type { Effect } from '../../types';

export const glassmorphism: Effect = {
  id: 'glassmorphism', slug: 'glassmorphism', status: 'published',
  name: { en: 'Glassmorphism (Frosted Glass)', zh: '玻璃拟态' },
  aliases: { en: ['frosted glass', 'glass UI', 'backdrop blur', 'blurred translucent card'], zh: ['毛玻璃', '磨砂玻璃', '毛玻璃卡片', '半透明模糊背景'] },
  searchPhrases: { en: ['blur the background behind a panel', 'translucent card that blurs what is behind it', 'a frosted panel softens the colors behind it'], zh: ['半透明模糊的卡片', '像磨砂玻璃', '能隐约看到后面的背景'] },
  category: 'backgrounds', type: 'style', triggers: ['none'],
  tags: ['blur', 'translucent', 'backdrop-filter', 'card'],
  summary: '半透明面板让背后的内容变模糊，像隔着磨砂玻璃看东西。',
  whatYouSee: '一块半透明的面板盖在彩色背景上，面板后面的背景被模糊，像隔着磨砂玻璃。面板带有一圈很细的浅色边框和柔和的阴影。',
  behavior: ['这是一种视觉样式，没有动画。', '效果取决于面板后面有什么内容或颜色。'],
  useCases: ['渐变或图片背景上的卡片', '导航栏', '数据仪表盘', '音乐或天气小组件', '弹窗'],
  terminologyNote: 'Frosted glass 与 glassmorphism 通常指同一种效果。Apple 的 Liquid Glass 是一种具体的设计语言，带有更多折射和动态表现，常被口头上混用，但并不完全相同。',
  related: ['aurora-gradient', 'modal-scale-fade'],
  demo: { component: 'Glassmorphism', hint: '拖动滑块调整模糊和透明度，切换背景看看效果如何依赖背景', hintTouch: '拖动滑块调整模糊和透明度', replayable: false, autoDemo: false, staticStyle: true },
  params: [
    { key: 'blur', label: '模糊半径', kind: 'number', default: 16, min: 4, max: 40, step: 1, unit: 'px' },
    { key: 'fillOpacity', label: '填充不透明度', kind: 'number', default: 0.15, min: 0.05, max: 0.4, step: 0.01 },
    { key: 'borderOpacity', label: '边框不透明度', kind: 'number', default: 0.3, min: 0.1, max: 0.6, step: 0.05 },
    { key: 'radius', label: '圆角', kind: 'number', default: 16, min: 0, max: 32, step: 1, unit: 'px' }
  ],
  prompt: {
    en: 'Build a glassmorphism (frosted glass) card.\nElement: one rounded card, about 360 px wide, placed over a colorful gradient background so the blur is visible.\nTrigger: none; this is a static visual style with no animation.\nVisual details (suggested values): card background white at {{fillOpacity}} opacity; backdrop-filter: blur({{blur}}) with a slight saturation boost (about 140%); 1 px border in white at {{borderOpacity}} opacity; corner radius {{radius}}; soft shadow such as 0 8px 32px rgba(0, 0, 0, 0.15).\nImplementation notes: include the -webkit-backdrop-filter prefix; there must be visible content or color behind the card for the blur to show; add a fallback for browsers without backdrop-filter using a more opaque solid background (about 70% opacity).\nAccessibility: check that text on the card keeps at least 4.5:1 contrast against the blurred background; if contrast is weak, darken the card fill slightly instead of making the text thinner. No motion is needed under prefers-reduced-motion; make any adjustment controls keyboard- and touch-accessible with visible focus.',
    zh: '请实现一个玻璃拟态（毛玻璃）卡片。\n作用对象：一张圆角卡片，宽约 360 px，放在彩色渐变背景之上，以便看到模糊效果。\n触发方式：无；这是静态的视觉样式，没有动画。\n视觉细节（建议值）：卡片背景为白色，不透明度 {{fillOpacity}}；backdrop-filter: blur({{blur}})，并略微提高饱和度（约 140%）；1 px 的白色边框，不透明度 {{borderOpacity}}；圆角 {{radius}}；柔和阴影，例如 0 8px 32px rgba(0, 0, 0, 0.15)。\n实现要求：加上 -webkit-backdrop-filter 前缀；卡片后面必须有可见的内容或颜色，模糊才会显示；为不支持 backdrop-filter 的浏览器提供兜底，使用不透明度约 70% 的纯色背景。\n无障碍：确认卡片上的文字对模糊后的背景至少有 4.5:1 的对比度；如果对比度不足，稍微加深卡片填充，而不是把文字变细。prefers-reduced-motion 下同样保持静态；调整控件须支持键盘和触屏，并显示清晰焦点。'
  }
};
