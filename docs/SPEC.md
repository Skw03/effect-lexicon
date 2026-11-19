# Build Effect Lexicon (动效词典): a visual dictionary of UI effects with live demos and copyable AI prompts

You are an expert front-end engineer. Build the complete website described below. Everything is specified explicitly; do not substitute vague interpretation. Do not leave placeholders, TODO demos or lorem ipsum. Every demo must truly perform the effect it is labelled with. This message has two parts (Box 1 and Box 2); treat them as one specification.

## 1. Product goal and users

Purpose: help people who use AI coding tools find a visual effect they can picture but cannot name, learn its common names, understand its behavior, and copy an accurate description into an AI coding conversation.

Users (assumption): Chinese-speaking people who build websites with AI tools, often not professional front-end developers. The interface language is Simplified Chinese. English terminology is always shown next to Chinese names. Search works in Chinese and English.

Central journey: browse or search, recognize an effect by watching its preview, learn its names and aliases, understand the trigger and behavior, copy the prompt.

Note on two kinds of prompts: this document is the build prompt for you. The Copy prompt feature inside the site produces separate effect prompts for site visitors. Do not confuse them.

## 2. Technology stack and constraints

- Vite, React 18, TypeScript (strict mode), React Router, Tailwind CSS, Fuse.js, Vitest.
- Static site only. No backend, no database, no accounts, no analytics, no external APIs, no CDN fonts. Use system font stacks.
- No animation library. Build demos with CSS transitions and keyframes plus small custom hooks (requestAnimationFrame, IntersectionObserver).
- Content lives in typed TypeScript files. Demos are React components registered by id.
- The site must work offline after build and be deployable to any static host. Include a README with run, test, build and add-an-effect instructions.

## 3. Routes and page layout

Routes: / (Library), /effects/:slug (Effect detail), /guide (Guide), and a Not Found page for everything else. Use a shared layout with a header (site name 动效词典 Effect Lexicon, link to /guide) and a short footer.

### 3.1 Library page (/)

Top to bottom:
1. Search strip: a large search input (label: 搜索效果；placeholder: 试试：鼠标移上去卡片跟着动 / typing effect), with a clear button, and the line: 不知道名字？描述一下，或者按「它怎么动」来找.
2. Filter bar with three groups:
   - 它什么时候动？ (trigger chips): 鼠标悬停 hover, 鼠标跟随 pointer-follow, 点击 click, 滚动 scroll, 页面载入 page-load, 自动循环 continuous.
   - 用在哪里？ (category chips): 按钮 buttons, 卡片 cards, 文字 text, 背景 backgrounds, 导航 navigation, 滚动 scrolling, 加载状态 loading, 转场与弹层 transitions.
   - 类型 (segmented control): 全部, 动画 animation, 交互 interaction, 视觉样式 style.
   Chips are toggle buttons with aria-pressed. Selections combine with AND across groups and OR within a group.
3. Result line: 共 N 个效果, active filter summary, and a 清除筛选 button when filters or a query are active.
4. Gallery grid: 1 column below 640 px, 2 columns from 640 px, 3 columns from 1024 px, 4 columns from 1360 px.

Effect card (the whole card is one link to the detail page):
- A 16:10 live mini preview (see section 9 for activation rules).
- Chinese name (semibold), English name (muted, smaller), one-line summary (max 2 lines).
- Badges: trigger badges and a type badge (动画 / 交互 / 视觉样式).
- When search is active and matched on an alias or phrase, show a small hint 匹配：别名 tilt effect.

State in URL: ?q=, trigger=, cat=, type= (comma separated for multi-select). Loading a URL restores the state. Update the URL with replace (not push) while typing.

Empty state: 没有找到完全匹配的效果, then the three nearest effects (looser fuzzy threshold) labelled 相近的效果, and the trigger chips.

### 3.2 Effect detail page (/effects/:slug)

1. Breadcrumb: 全部效果 / name. Unknown slug shows the Not Found page.
2. Title row: Chinese name (h1), English name beside it, type badge, alias chips (EN and ZH).
3. Demo stage: a large bordered panel (min height 320 px) containing the live demo. Above it, a one-line trigger hint (desktop hint on devices with a fine pointer; touch hint on coarse pointers). Below it, a toolbar: Replay or Pause/Play (only when applicable), 重置 Reset, Auto demo 自动演示 (only for pointer-follow and hover demos), and a note when the effect is a static style: 视觉样式 · 无动画.
4. Parameter panel: controls generated from the effect params (range slider with number readout, checkbox for booleans, select for options). Changing a control updates the demo live and the prompt text live. Show a 恢复默认 button.
5. 怎么描述它 panel: 你会看到 (whatYouSee), 行为步骤 (ordered list), 常见用途 (list), and terminologyNote when present, titled 名称说明.
6. Prompt panel: segmented toggle 中文 / English (default English, remember the choice in localStorage inside try/catch), the prompt in a monospace block that wraps, a primary 复制提示词 button which changes to 已复制 for 2 seconds and announces 已复制到剪贴板 through an aria-live region, and the note 数值为建议值，可按需调整.
7. Related effects: up to 3 effect cards from related[].

### 3.3 Guide page (/guide)

Static Chinese content titled 如何向 AI 描述一个动效. Explain six parts of a good description: 作用对象 (element), 触发方式 (trigger), 画面变化 (what changes), 运动细节 (duration, easing, distance), 约束条件 (performance, tech limits), 边界情况 (touch, keyboard, reduced motion). Include a before-and-after example: vague: 卡片动起来 / precise: the 3D Tilt Card prompt shortened. Link to the 3D Tilt Card detail page.

## 4. Visual design of the website itself

Goal: a quiet, neutral interface so the demos are what stand out. The site UI itself uses no decorative motion; the only motion in the chrome is 150 ms color transitions on hover and focus.

- Light theme only. Define tokens as CSS variables and Tailwind theme values: bg #FAFAF9, surface #FFFFFF, border #E7E5E4, text #1C1917, text-muted #57534E, accent #4F46E5, accent-soft #EEF2FF, danger #B91C1C. Body text on bg and surface must meet 4.5:1 contrast.
- Fonts (system only): sans: Inter, system-ui, -apple-system, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, sans-serif. Mono: ui-monospace, SF Mono, Menlo, Consolas, monospace.
- Type scale: body 16 px with line height 1.7; h1 28 px mobile and 36 px desktop; h2 20 to 24 px; small text never below 13 px.
- Layout: max content width 1200 px, horizontal page padding 16 px mobile and 32 px desktop, 4 px spacing scale, card radius 12 px, control radius 8 px, 1 px borders, no heavy shadows (use at most 0 1px 2px rgba(0,0,0,0.05)).
- Chips and buttons: minimum 44 px tall touch target on touch devices (36 px visual height is fine on desktop). Selected chips use accent-soft background, accent text and accent border.
- Focus: every interactive element shows a 2 px accent outline with 2 px offset on :focus-visible. Never remove outlines without a replacement.
- Demo stages use their own backgrounds (default #F5F5F4) so they are clearly separated from site chrome.

## 5. Data model

Create src/types.ts and one file per effect in src/content/effects/, exported through an index. Types:

```ts
export type Category = 'buttons' | 'cards' | 'text' | 'backgrounds' | 'navigation' | 'scrolling' | 'loading' | 'transitions';
export type Trigger = 'hover' | 'pointer-follow' | 'click' | 'scroll' | 'page-load' | 'continuous' | 'none';
export type EffectType = 'animation' | 'interaction' | 'style';

export interface Param {
  key: string;
  label: string; // Chinese label
  kind: 'number' | 'boolean' | 'select';
  default: number | boolean | string;
  min?: number; max?: number; step?: number; unit?: string;
  options?: { value: string; label: string }[];
}

export interface Effect {
  id: string;
  slug: string;
  status: 'published' | 'draft';
  name: { en: string; zh: string };
  aliases: { en: string[]; zh: string[] };
  searchPhrases: { en: string[]; zh: string[] };
  category: Category;
  type: EffectType;
  triggers: Trigger[];
  tags: string[];
  summary: string; // Chinese, one line
  whatYouSee: string; // Chinese, 2 to 3 sentences
  behavior: string[]; // Chinese, ordered steps
  useCases: string[]; // Chinese
  terminologyNote?: string; // Chinese
  related: string[]; // slugs
  demo: { component: string; hint: string; hintTouch: string; replayable: boolean; autoDemo: boolean; staticStyle?: boolean };
  params: Param[];
  prompt: { en: string; zh: string };
}
```

Prompt templates: {{key}} is replaced by the current value of the param with that key (append its unit where the template does not already include it). A block written as {{#key}}text{{/key}} is included only when the boolean param with that key is true; the inverse block {{^key}}text{{/key}} is included only when it is false. Write a small, unit-tested function renderPrompt(effect, values, lang) in src/lib/renderPrompt.ts. Numeric values are rendered with their unit, and the unit must not be duplicated if the template already adds one.

Validation test (Vitest): for every published effect check that slug is unique and kebab-case, related slugs exist, demo.component exists in the registry, every {{key}} in both prompts matches a param, every param default lies within min and max, and both prompts are non-empty and mention the trigger and a duration or timing value.

## 6. Search and filtering

Implement in src/search/ with these parts:
- normalize(text): lowercase, trim, Unicode NFKC, remove punctuation and extra spaces.
- synonyms.ts: groups of equivalent terms. Include at least: [鼠标, 光标, 指针, cursor, mouse, pointer], [跟随, 跟着, 追踪, follow, track], [悬停, 移上去, 移过, 划过, hover], [翻转, 翻面, 翻过来, flip], [倾斜, 歪, 偏, tilt], [毛玻璃, 磨砂, 玻璃, frosted, glass, blur], [打字, 逐字, typing, typewriter], [加载, 载入, loading], [骨架屏, 灰色占位, skeleton], [滚动, 滑动, 下滑, scroll], [视差, parallax], [渐显, 淡入, fade], [水波纹, 涟漪, ripple], [磁吸, 吸附, magnetic], [渐变, 流动, gradient, aurora], [弹窗, 对话框, 模态, modal, dialog], [下划线, underline], [吸顶, 固定, sticky], [光斑, 聚光, spotlight, glow].
- Index each effect into fields with weights: name.en and name.zh 5; aliases 4; searchPhrases 3.5; tags 2; summary, whatYouSee and useCases 1.
- Query handling: normalize, split English by whitespace, treat Chinese runs as substrings, expand every query term with its synonym group, then search with Fuse.js (ignoreLocation true, threshold about 0.35, minMatchCharLength 1, includeMatches true). Add a boost for exact and prefix matches of names and aliases. Rank: exact name or alias, then phrase matches, then fuzzy.
- Return for each hit the effect, a score, and the matched field and text (used for the 匹配 hint).
- Search and filters combine: filters narrow the set, search ranks within it. With an empty query, show all effects in the default order of the content index.
- Debounce input by 150 ms.

Vitest acceptance tests: each query must return the expected effect inside the top 3 results.
- 鼠标移上去卡片跟着动: card-tilt-3d, spotlight-card
- a card that follows my mouse: card-tilt-3d, spotlight-card
- 点一下卡片翻过来: card-flip
- 文字像打字一样出现: typewriter
- frosted glass; blur background; 毛玻璃: glassmorphism
- 加载时灰色条闪光: skeleton-shimmer
- 滚动时背景比内容慢: parallax-scroll
- 按钮被鼠标吸过去: magnetic-button
- 点击按钮出现水波纹: ripple-button
- 向下滚动内容渐渐出现: scroll-reveal
- 彩色流动的背景: aurora-gradient
- 导航链接下面划线滑出来: underline-slide-link

(Continued in Box 2: sections 7 to 13.)

(Continuation of the specification in Box 1. Same project, same rules.)

## 7. Initial content: 18 effects and required demos

Implement all 18. Each needs a complete content file (all fields, Chinese text, aliases, 3 to 6 everyday search phrases per language, terminology note where names vary, related effects, 2 to 5 params) and a working demo as specified. Write every prompt following the prompt rules in section 8. Numeric values are suggested defaults and must be editable params where listed.

1. card-flip (cards, interaction, hover and click): a 280 by 180 px card with a front face (title) and a back face (short description). On hover (fine pointer) or click or tap, it rotates 180 degrees about the vertical axis. Perspective 1000 px, backface-visibility hidden, duration 600 ms, ease cubic-bezier(0.4, 0.2, 0.2, 1). The card is a button with aria-pressed; Enter and Space toggle it. Params: duration 600 ms, axis (vertical or horizontal).
2. card-tilt-3d: exactly as in the sample entry in section 7.1 below.
3. spotlight-card (cards, interaction, pointer-follow): a dark card (#18181B, 320 by 200 px) with a soft radial highlight centered on the pointer (white at 18 percent opacity, radius 240 px) driven by CSS variables --x and --y; the highlight fades in over 200 ms on enter and out on leave; the card border also brightens near the pointer. Params: radius 240 px (100 to 400), intensity 0.18 (0.05 to 0.4).
4. magnetic-button (buttons, interaction, pointer-follow): a 160 by 52 px button; while the pointer is within 80 px of the button, it moves toward the pointer by strength 0.35 of the offset, capped at 14 px; on leave it returns with a springy ease cubic-bezier(0.34, 1.56, 0.64, 1) over 500 ms. Params: strength 0.35 (0.1 to 0.6), radius 80 px (40 to 160).
5. ripple-button (buttons, interaction, click): on click or tap a circular ripple starts at the click point, grows from scale 0 until it covers the button, fades from 35 percent to 0 opacity over 600 ms ease-out, then is removed from the DOM. Keyboard activation starts the ripple at the center. Button clips the ripple (overflow hidden). Param: duration 600 ms (200 to 1200).
6. sliding-fill-button (buttons, interaction, hover): an outlined button; on hover or focus a solid accent fill slides in from the left (scaleX 0 to 1, transform-origin left) over 300 ms ease-out while text color flips to white; on leave the fill exits to the right (transform-origin right). Param: duration 300 ms (100 to 800).
7. typewriter: exactly as in the sample entry in section 7.1.
8. gradient-text-shimmer (text, animation, continuous): a large heading filled with a three-color gradient (indigo, violet, pink) with a bright highlight band about 20 percent wide that sweeps left to right, using background-size 200 percent and background-clip text; 2.5 s linear infinite. Reduced motion: static gradient. Param: duration 2.5 s (1 to 6).
9. staggered-text-reveal (text, animation, page-load): a sentence split into words; each word moves from translateY 16 px to 0 while fading from 0 to 1 in 500 ms ease-out, with a 60 ms delay between words. Plays on mount and on Replay. Words are aria-hidden spans and the full sentence is provided in an accessible label. Params: stagger 60 ms (20 to 200), duration 500 ms (200 to 1000), distance 16 px (0 to 40).
10. aurora-gradient (backgrounds, animation, continuous): a 100 percent wide stage with three or four large blurred blobs (violet #7C3AED, cyan #06B6D4, pink #F472B6, optional blue #3B82F6), each blurred about 60 px, slowly drifting and scaling with transform only, 14 to 22 s ease-in-out alternate infinite with different offsets; a centered heading sits on top with sufficient contrast (add a subtle dark overlay if needed). Params: duration 16 s (8 to 30), blur 60 px (20 to 120).
11. glassmorphism: exactly as in the sample entry in section 7.1.
12. underline-slide-link (navigation, interaction, hover): a row of four nav links; on hover or focus a 2 px underline slides in from the left (scaleX 0 to 1) over 250 ms ease-out; on leave it exits to the right. Params: duration 250 ms (100 to 600), thickness 2 px (1 to 6).
13. shrinking-sticky-header (navigation, interaction, scroll): inside a 360 px high scrollable mini stage, a sticky header of 72 px height with logo and links; after scrolling 40 px it shrinks to 48 px, gains a soft shadow and a translucent white background with slight blur, with a 200 ms ease transition. Replay auto-scrolls the stage down 200 px and back over 3 s. Params: threshold 40 px (10 to 120), collapsed height 48 px (36 to 64).
14. parallax-scroll (scrolling, interaction, scroll): inside a 420 px high scrollable mini stage, three layers (background shapes, midground shapes, foreground text card) move at different speeds: background 0.5 times the scroll speed, midground 0.8, foreground 1.0, applied with translate3d from scrollTop inside requestAnimationFrame. Replay auto-scrolls the stage. Param: background speed factor 0.5 (0.1 to 0.9).
15. scroll-reveal (scrolling, animation, scroll): inside a mini scroll stage, six cards start at opacity 0 and translateY 24 px; when 20 percent of a card is visible (IntersectionObserver with the stage as root) it animates to opacity 1 and translateY 0 over 600 ms ease-out, once only, with an 80 ms stagger for cards entering together. Replay resets and auto-scrolls. Params: distance 24 px (0 to 60), duration 600 ms (200 to 1200).
16. skeleton-shimmer (loading, animation, continuous): a placeholder layout (48 px avatar circle and three text bars at 100, 80 and 60 percent width) in #E7E5E4 with a light highlight band sweeping left to right over 1.6 s linear infinite, implemented with transform: translateX on a pseudo-element. A toggle 显示加载完成后的内容 swaps in the real content with a 200 ms fade. Param: duration 1.6 s (0.8 to 3).
17. pulsing-dots-loader (loading, animation, continuous): three 10 px dots; each cycles scale 0.6 to 1 and opacity 0.4 to 1 over 1.2 s ease-in-out infinite, with delays of 0, 0.15 and 0.3 s; container has role=status and a visually hidden 加载中 label. Params: size 10 px (6 to 24), duration 1.2 s (0.6 to 2.4).
18. modal-scale-fade (transitions, animation, click): a button opens a dialog contained inside the demo stage; the backdrop fades to rgba(0, 0, 0, 0.4) in 200 ms; the dialog scales from 0.95 to 1 and fades in over 250 ms with cubic-bezier(0.16, 1, 0.3, 1); closing reverses in 150 ms. role=dialog, aria-modal true, labelled by its title, focus moves into the dialog and is trapped, Esc and a close button close it, focus returns to the opener. Params: duration 250 ms (100 to 600), startScale 0.95 (0.8 to 1).

Related effects: choose by similarity, for example card-tilt-3d with spotlight-card and card-flip.

### 7.1 Three complete sample entries (use exactly as written; the other 15 must match this quality)

```ts
export const cardTilt3d: Effect = {
  id: 'card-tilt-3d', slug: 'card-tilt-3d', status: 'published',
  name: { en: '3D Tilt Card', zh: '3D 倾斜卡片' },
  aliases: { en: ['tilt effect', 'parallax tilt', 'perspective tilt', '3D hover card', 'mouse-tracking card', 'vanilla-tilt style'], zh: ['卡片倾斜', '鼠标跟随卡片', '3D 悬浮卡片', '视差倾斜'] },
  searchPhrases: { en: ['a card that follows my mouse', 'a card that leans toward the cursor', 'card rotates in 3D on hover'], zh: ['鼠标移上去卡片会跟着转', '卡片会朝鼠标的方向歪', '卡片有立体感', '卡片跟着鼠标动'] },
  category: 'cards', type: 'interaction', triggers: ['pointer-follow', 'hover'],
  tags: ['3d', 'perspective', 'glare', 'hover'],
  summary: '鼠标在卡片上移动时，卡片朝鼠标方向做 3D 倾斜，离开后回正。',
  whatYouSee: '卡片会像被按在鼠标所在的位置一样，靠近鼠标的一侧向后凹下去。鼠标离开后卡片平滑回到平整状态。可选的柔和高光会跟着鼠标移动。',
  behavior: ['鼠标进入卡片：卡片轻微放大。', '鼠标在卡片上移动：倾斜角度随位置实时变化，高光随之移动。', '鼠标离开：卡片平滑回正，高光淡出。'],
  useCases: ['产品卡片', '价格方案卡片', '作品集缩略图', '收藏卡展示'],
  terminologyNote: '最常见的叫法是 Tilt（倾斜）。当卡片内部的图层以不同速度移动时，常被称为 parallax tilt。它不同于 Card Flip（卡片翻转），后者是整张卡片翻转 180 度。',
  related: ['spotlight-card', 'card-flip'],
  demo: { component: 'CardTilt3d', hint: '把鼠标移到卡片上', hintTouch: '在卡片上拖动手指', replayable: false, autoDemo: true },
  params: [
    { key: 'maxTilt', label: '最大倾斜角度', kind: 'number', default: 12, min: 4, max: 25, step: 1, unit: 'deg' },
    { key: 'scale', label: '悬停放大', kind: 'number', default: 1.03, min: 1, max: 1.1, step: 0.01 },
    { key: 'perspective', label: '透视距离', kind: 'number', default: 1000, min: 500, max: 2000, step: 50, unit: 'px' },
    { key: 'glare', label: '高光', kind: 'boolean', default: true },
    { key: 'returnDuration', label: '回正时长', kind: 'number', default: 400, min: 150, max: 800, step: 50, unit: 'ms' }
  ],
  prompt: {
    en: 'Build a 3D tilt card (also called a parallax tilt or perspective tilt card).\nElement: one content card, about 320 by 200 px, 16 px rounded corners, soft shadow.\nTrigger: pointer movement over the card (mouse hover). On touch screens, dragging a finger across the card should do the same.\nBehavior: while the pointer is over the card, the card rotates in 3D so that the edge nearest the pointer dips away from the viewer, as if pressed at that point. The card scales up slightly while hovered.{{#glare}} A soft white radial glare (up to 25% opacity) follows the pointer across the card.{{/glare}}\nMotion (suggested values): perspective {{perspective}}; maximum tilt {{maxTilt}} on each axis; scale {{scale}}; while the pointer moves, update the transform every animation frame with light smoothing and no long CSS transition; when the pointer leaves, ease back to flat over {{returnDuration}} with ease-out{{#glare}} and fade the glare out{{/glare}}.\nImplementation notes: animate only transform and opacity; set will-change: transform on the card; the tilt must not change the card layout size.\nFallbacks: if prefers-reduced-motion is set, disable the tilt and use only a subtle shadow or border change on hover. If the card is a link it must stay keyboard focusable with a visible focus ring.',
    zh: '请实现一个 3D 倾斜卡片（也叫 tilt 效果、视差倾斜卡片）。\n作用对象：一张内容卡片，约 320 x 200 px，圆角 16 px，带柔和阴影。\n触发方式：鼠标在卡片上移动（悬停）。触摸屏上，在卡片上拖动手指应有相同效果。\n行为：鼠标在卡片上时，卡片做 3D 旋转，靠近鼠标的一侧向远离观看者的方向凹下去，就像在该点被按下。悬停时卡片轻微放大。{{#glare}}一层柔和的白色径向高光（最高 25% 不透明度）跟随鼠标在卡片上移动。{{/glare}}\n动效参数（建议值）：透视 {{perspective}}；每个轴最大倾斜 {{maxTilt}}；放大 {{scale}} 倍；鼠标移动时在每个动画帧更新 transform，带轻微平滑，不使用较长的 CSS 过渡；鼠标离开时用 ease-out 在 {{returnDuration}} 内回到平整{{#glare}}，并让高光淡出{{/glare}}。\n实现要求：只对 transform 和 opacity 做动画；卡片设置 will-change: transform；倾斜不能改变卡片的布局尺寸。\n兜底：如果用户开启了 prefers-reduced-motion，则关闭倾斜，只保留轻微的阴影或边框变化。如果卡片是链接，必须可通过键盘聚焦并有清晰的焦点样式。'
  }
};

export const typewriter: Effect = {
  id: 'typewriter', slug: 'typewriter', status: 'published',
  name: { en: 'Typewriter Text', zh: '打字机效果' },
  aliases: { en: ['typing animation', 'typing effect', 'typed text', 'character-by-character reveal', 'Typed.js style'], zh: ['打字效果', '打字动画', '逐字显示', '文字逐个出现'] },
  searchPhrases: { en: ['text that types itself out', 'letters appear one by one with a blinking cursor'], zh: ['文字一个字一个字蹦出来', '像有人在打字', '光标闪烁然后字出现'] },
  category: 'text', type: 'animation', triggers: ['page-load', 'continuous'],
  tags: ['typing', 'caret', 'loop', 'headline'],
  summary: '一行文字逐个字符出现，末尾有闪烁的光标，可循环切换多句话。',
  whatYouSee: '一行文字一个字符一个字符地被打出来，末尾有一根闪烁的竖线光标。一句话完成后停顿一会儿，再逐字删除，接着打出下一句。',
  behavior: ['光标先单独闪烁片刻。', '字符逐个出现。', '整句完成后停顿。', '如果循环，则以更快的速度逐字删除，然后开始下一句。'],
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
    en: 'Build a typewriter text effect (typing animation).\nElement: a single headline line that cycles through three short phrases.\nTrigger: starts automatically when the element first appears on screen{{#loop}} and then loops continuously{{/loop}}.\nBehavior: the text is typed one character at a time, followed by a blinking vertical caret. When a phrase is complete, pause{{#loop}}, then delete it character by character and type the next phrase. After the last phrase, return to the first{{/loop}}{{^loop}}; after the last phrase stop and keep it on screen{{/loop}}.\nMotion (suggested values): typing speed {{typingSpeed}} per character; deleting speed {{deleteSpeed}} per character; pause of {{pauseAfter}} after a phrase is complete; the caret toggles visibility every 530 ms and stays solid while characters are being typed or deleted.\nImplementation notes: reveal real text characters (not an animated width) so line wrapping works; reserve the line height so the layout does not jump; start only when visible; clear timers on unmount.\nAccessibility: give the element an accessible label with the full current phrase and keep the animated characters aria-hidden so screen readers do not announce every letter. If prefers-reduced-motion is set, show the first phrase fully with no typing and no blinking caret.',
    zh: '请实现一个打字机文字效果（typing animation）。\n作用对象：一行标题文字，循环显示三句简短的话。\n触发方式：元素首次出现在屏幕上时自动开始{{#loop}}，之后持续循环{{/loop}}。\n行为：文字逐个字符被打出来，末尾跟一根闪烁的竖线光标。一句话完成后停顿{{#loop}}，然后逐字删除并打出下一句，最后一句之后回到第一句{{/loop}}{{^loop}}；最后一句完成后停止并保留在屏幕上{{/loop}}。\n动效参数（建议值）：打字速度每字 {{typingSpeed}}；删除速度每字 {{deleteSpeed}}；整句完成后停顿 {{pauseAfter}}；光标每 530 ms 切换一次显隐，打字或删除时保持常亮。\n实现要求：逐个显示真实的文字字符（不要用宽度动画），保证换行正常；预留行高避免布局跳动；仅在可见时开始；组件卸载时清理定时器。\n无障碍：给元素设置包含当前完整句子的可访问标签，动画中的字符设为 aria-hidden，避免读屏软件逐字朗读。如果开启了 prefers-reduced-motion，直接完整显示第一句，不打字、不闪烁光标。'
  }
};

export const glassmorphism: Effect = {
  id: 'glassmorphism', slug: 'glassmorphism', status: 'published',
  name: { en: 'Glassmorphism (Frosted Glass)', zh: '玻璃拟态' },
  aliases: { en: ['frosted glass', 'glass UI', 'backdrop blur', 'blurred translucent card'], zh: ['毛玻璃', '磨砂玻璃', '毛玻璃卡片', '半透明模糊背景'] },
  searchPhrases: { en: ['blur the background behind a panel', 'translucent card that blurs what is behind it'], zh: ['半透明模糊的卡片', '像磨砂玻璃', '能隐约看到后面的背景'] },
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
    en: 'Build a glassmorphism (frosted glass) card.\nElement: one rounded card, about 360 px wide, placed over a colorful gradient background so the blur is visible.\nTrigger: none; this is a static visual style with no animation.\nVisual details (suggested values): card background white at {{fillOpacity}} opacity; backdrop-filter: blur({{blur}}) with a slight saturation boost (about 140%); 1 px border in white at {{borderOpacity}} opacity; corner radius {{radius}}; soft shadow such as 0 8px 32px rgba(0, 0, 0, 0.15).\nImplementation notes: include the -webkit-backdrop-filter prefix; there must be visible content or color behind the card for the blur to show; add a fallback for browsers without backdrop-filter using a more opaque solid background (about 70% opacity).\nAccessibility: check that text on the card keeps at least 4.5:1 contrast against the blurred background; if contrast is weak, darken the card fill slightly instead of making the text thinner.',
    zh: '请实现一个玻璃拟态（毛玻璃）卡片。\n作用对象：一张圆角卡片，宽约 360 px，放在彩色渐变背景之上，以便看到模糊效果。\n触发方式：无；这是静态的视觉样式，没有动画。\n视觉细节（建议值）：卡片背景为白色，不透明度 {{fillOpacity}}；backdrop-filter: blur({{blur}})，并略微提高饱和度（约 140%）；1 px 的白色边框，不透明度 {{borderOpacity}}；圆角 {{radius}}；柔和阴影，例如 0 8px 32px rgba(0, 0, 0, 0.15)。\n实现要求：加上 -webkit-backdrop-filter 前缀；卡片后面必须有可见的内容或颜色，模糊才会显示；为不支持 backdrop-filter 的浏览器提供兜底，使用不透明度约 70% 的纯色背景。\n无障碍：确认卡片上的文字对模糊后的背景至少有 4.5:1 的对比度；如果对比度不足，稍微加深卡片填充，而不是把文字变细。'
  }
};
```

## 8. Detail page behaviors and prompt rules

- Demo components receive props: values (current param values), running (for pause or play), replayKey (increment to restart), and virtualPointer (optional, used by Auto demo).
- Auto demo: for pointer-follow and hover demos, the page drives a scripted virtual pointer along a smooth path (a circle then a figure eight over about 4 seconds, then returns to rest) by passing virtualPointer coordinates relative to the demo area. The demo must respond exactly as to a real pointer. A Stop button replaces Auto demo while it runs.
- Reset restores default param values and the initial demo state.
- Copy uses navigator.clipboard.writeText with a textarea and execCommand fallback. Failure shows 复制失败，请手动选择文本 and selects the prompt text.
- Prompt rules for all 18 effects: each prompt names the affected element, the trigger, the visual changes and the motion details; marks numbers as suggested values; mentions implementation notes limited to transform and opacity where relevant; and ends with prefers-reduced-motion, keyboard and touch fallbacks. A prompt must never be only the effect name.

## 9. Responsive, touch, accessibility, reduced motion, performance

Preview activation rules in the gallery:
- Continuous animations (gradient-text-shimmer, aurora-gradient, skeleton-shimmer, pulsing-dots-loader, typewriter) play only while the card is visible in the viewport and the user has not enabled reduced motion. Limit simultaneously running previews to 6; others show a static first frame until they enter the viewport.
- Interactive previews (hover, pointer-follow, click) activate on pointer hover, keyboard focus, or tap, and show a small hint such as 悬停试试 or 点击试试. Pointer events inside a card preview must not navigate; navigation happens on the card title area and on a clear 查看详情 link in each card for touch and keyboard users.
- Scroll-based effects show a static, representative frame in gallery cards, with the hint 在详情页体验滚动.

Responsive and touch:
- The layout works from 320 px wide upward with no horizontal page scroll. Wide content (prompts, tables) wraps or scrolls inside its own container.
- Demo areas use touch-action: pan-y so a vertical swipe still scrolls the page. Use pointer events (not mouse events) so one code path serves mouse, pen and touch. Hover-only behaviors have a tap, press or drag equivalent, plus Auto demo.
- Touch targets are at least 44 by 44 px.

Accessibility (target WCAG 2.2 AA):
- Semantic landmarks (header, main, footer), one h1 per page, logical heading order, lang=zh-CN on the html element and lang=en on English-only text spans where practical.
- All interactive elements are keyboard reachable with visible focus. Chips use aria-pressed. The search input has a visible label. Result count changes are announced with an aria-live polite region.
- Hover-triggered effects must also respond to keyboard focus.
- Color is never the only indicator. Text contrast at least 4.5:1.
- Demos do not trap keyboard focus, except the modal demo, which traps focus only while open.

Reduced motion:
- Respect prefers-reduced-motion. When set: no autoplay or looping in the gallery or on detail pages; demos render a static representative state and show a visible Play or Replay button. Pressing Play, Replay or Auto demo always runs the demo, because the user asked for it. The site chrome has no motion beyond instant state changes.

Performance:
- Animate only transform and opacity, with documented exceptions (shimmer uses transform on a pseudo-element). Use will-change sparingly and only while animating. Pause loops when off-screen using IntersectionObserver. Never read layout inside a scroll or pointer handler without caching. Clean up all listeners, timers and animation frames on unmount. Avoid large blur filters in many gallery cards at once. Target a smooth experience on a mid-range phone and a JavaScript payload reasonable for a content site (under about 250 KB gzipped).

## 10. Project structure and adding an effect

src/types.ts, src/content/effects/<slug>.ts, src/content/index.ts, src/demos/<Component>.tsx plus <Component>.css, src/demos/registry.ts, src/search/ (normalize, synonyms, index, tests), src/components/ (EffectCard, FilterBar, SearchBox, DemoStage, ParamPanel, PromptPanel, Chip, Badge), src/pages/ (Library, EffectDetail, Guide, NotFound), src/hooks/ (useInView, useReducedMotion, useVirtualPointer, useRaf), src/lib/renderPrompt.ts. The README documents how to add an effect in five steps, how to run tests, and how to build and deploy.

## 11. Acceptance criteria

The work is complete only when all of the following are true.
1. Run, test and build commands succeed with no TypeScript errors and no lint errors.
2. The Library lists exactly 18 effects across all 8 categories, with a live preview on each card following the activation rules in section 9.
3. Each of the 18 detail pages shows a working demo that performs the labelled behavior, with the hint text, the correct toolbar buttons and working params. No demo is a placeholder or a static image of a motion effect.
4. Hover and pointer effects can be experienced on a touch device by tap or drag, and every pointer-follow or hover demo has a working Auto demo.
5. Filters work as specified (AND across groups, OR within a group); URL state round-trips; Clear filters works.
6. All 12 acceptance queries in section 6 pass in Vitest, and the nearest-results empty state works for a nonsense query.
7. Each page shows English and Chinese names; the 匹配 hint shows the matched alias or phrase.
8. Copy prompt works in both languages; params change the prompt text live; copied text contains the current values; renderPrompt has unit tests including the conditional blocks.
9. Content validation tests pass for all 18 entries.
10. With prefers-reduced-motion on, nothing autoplays, and Play, Replay and Auto demo still work.
11. The whole site is usable by keyboard only, with visible focus, at 320, 768 and 1280 px widths with no horizontal page scroll.
12. The Lighthouse accessibility score is at least 95 on the Library and one detail page, and no axe critical or serious violations are reported.
13. Adding a nineteenth effect requires only the steps listed in the README.

## 12. Out of scope for this version

Accounts, favorites, community submissions, AI or server-side search, admin tools, dark mode, analytics, downloadable code snippets, GIF or video previews, and any backend.

## 13. Working method

Work in this order: project setup and types; content and renderPrompt with tests; search with tests; layout and Library page; detail page shell with params and prompt panel; demos (cards, buttons, text, backgrounds, navigation, scrolling, loading, transitions); accessibility, reduced motion and performance pass; README. After finishing, summarize what you built, list any deviations from this spec with reasons, and explain how each acceptance criterion was verified.
