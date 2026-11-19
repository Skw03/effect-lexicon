import type { Effect } from '../../types';

export const typewriter: Effect = {
  id: 'typewriter', slug: 'typewriter', status: 'published',
  name: { en: 'Typewriter Text', zh: '打字机效果' },
  aliases: { en: ['typing animation', 'typing effect', 'typed text', 'character-by-character reveal', 'Typed.js style'], zh: ['打字效果', '打字动画', '逐字显示', '文字逐个出现'] },
  searchPhrases: { en: ['text that types itself out', 'letters appear one by one with a blinking cursor', 'a headline types and deletes short phrases'], zh: ['文字一个字一个字蹦出来', '像有人在打字', '光标闪烁然后字出现'] },
  category: 'text', type: 'animation', triggers: ['page-load', 'continuous'],
  tags: ['typing', 'caret', 'loop', 'headline'],
  summary: '一行文字逐个字符出现，末尾有闪烁的光标，可循环切换多句话。',
  whatYouSee: '一行文字一个字符一个字符地被打出来，末尾有一根闪烁的竖线光标。一句话完成后停顿一会儿，再逐字删除，接着打出下一句。',
  behavior: ['光标先单独闪烁片刻。', '字符逐个出现。', '整句完成后停顿。', '逐字删除并进入下一句；三句遍历完成后，循环模式回到第一句，否则保留第三句。'],
  useCases: ['首页大标题', '标语与口号', '终端或聊天界面模拟', '轮换的角色或职位描述'],
  terminologyNote: 'Typewriter effect 与 typing animation 基本是同一个意思。它不同于 text scramble（字符先乱跳再定格），也不同于 text reveal（整词淡入或滑入）。',
  related: ['staggered-text-reveal', 'gradient-text-shimmer'],
  demo: { component: 'Typewriter', hint: '自动播放，可点击 Replay 重播', hintTouch: '自动播放，可点击 Replay 重播', replayable: true, autoDemo: false },
  params: [
    { key: 'typingSpeed', label: '打字速度（每字）', kind: 'number', default: 50, min: 20, max: 150, step: 5, unit: 'ms' },
    { key: 'deleteSpeed', label: '删除速度（每字）', kind: 'number', default: 30, min: 10, max: 100, step: 5, unit: 'ms' },
    { key: 'pauseAfter', label: '整句后的停顿', kind: 'number', default: 1500, min: 500, max: 4000, step: 100, unit: 'ms' },
    { key: 'loop', label: '循环', kind: 'boolean', default: true }
  ],
  prompt: {
    en: 'Build a typewriter text effect (typing animation).\nElement: a single headline line that cycles through three short phrases.\nTrigger: starts automatically when the element first appears on screen{{#loop}} and then loops continuously{{/loop}}.\nBehavior: the text is typed one character at a time, followed by a blinking vertical caret. When a phrase is complete, pause, then delete it character by character and type the next phrase until all three phrases have appeared.{{#loop}} After the last phrase, delete it and return to the first{{/loop}}{{^loop}} After the last phrase stop and keep it on screen{{/loop}}.\nMotion (suggested values): typing speed {{typingSpeed}} per character; deleting speed {{deleteSpeed}} per character; pause of {{pauseAfter}} after a phrase is complete; the caret toggles visibility every 530 ms and stays solid while characters are being typed or deleted.\nImplementation notes: reveal real text characters (not an animated width) so line wrapping works; reserve the line height so the layout does not jump; start only when visible; clear timers on unmount.\nAccessibility: give the element an accessible label with the full current phrase and keep the animated characters aria-hidden so screen readers do not announce every letter. If prefers-reduced-motion is set, show the first phrase fully with no typing and no blinking caret. Keyboard- and touch-accessible Play/Replay runs all three phrases once and keeps the third, without looping; allow manual replay.',
    zh: '请实现一个打字机文字效果（typing animation）。\n作用对象：一行标题文字，循环显示三句简短的话。\n触发方式：元素首次出现在屏幕上时自动开始{{#loop}}，之后持续循环{{/loop}}。\n行为：文字逐个字符被打出来，末尾跟一根闪烁的竖线光标。一句话完成后停顿，然后逐字删除并打出下一句，依次遍历三句。{{#loop}}最后一句之后删除并回到第一句{{/loop}}{{^loop}}最后一句完成后停止并保留在屏幕上{{/loop}}。\n动效参数（建议值）：打字速度每字 {{typingSpeed}}；删除速度每字 {{deleteSpeed}}；整句完成后停顿 {{pauseAfter}}；光标每 530 ms 切换一次显隐，打字或删除时保持常亮。\n实现要求：逐个显示真实的文字字符（不要用宽度动画），保证换行正常；预留行高避免布局跳动；仅在可见时开始；组件卸载时清理定时器。\n无障碍：给元素设置包含当前完整句子的可访问标签，动画中的字符设为 aria-hidden，避免读屏软件逐字朗读。如果开启了 prefers-reduced-motion，直接完整显示第一句，不打字、不闪烁光标。可用键盘或触屏操作 Play/Replay，手动逐句播放三句一次并保留第三句，不循环，可再次重播。'
  }
};
