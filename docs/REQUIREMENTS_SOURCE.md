# 动效词典 Effect Lexicon: Product Spec and AI Build Prompts

Working name only. First proposal. Labels used throughout: [Confirmed] = from your brief; [Assumption] = my default, tell me if it is wrong; [Recommended] = my addition.

## How this document is organised

- A. Product definition
- B. MVP specification: scope decisions, pages, taxonomy, search, content fields, three complete sample entries
- C. Technical recommendation
- D. Master development prompt: one paste-ready prompt to build the whole site
- E. Staged development prompts: five prompts that build the same site step by step

Two kinds of prompts are kept strictly apart. Site-build prompts (sections D and E) are for you to give to your AI coding assistant. Effect prompts are the texts visitors will copy from the finished website; samples appear in B8 and, in full bilingual form, as content data inside the master prompt.

## Decisions at a glance

- Build a static, content-driven website. No backend, accounts or database in the MVP.
- Discovery works by looking and by describing. Besides text search, users can filter by what makes the effect move (hover, cursor-follow, click, scroll, page load, loops by itself). This is the key route for people who do not know any name.
- Every entry has a real working demo, names and aliases in English and Chinese, a plain explanation, and a Copy prompt button.
- 18 effects in the first collection, each with a working component. Adding an effect later means one data file plus one demo component.
- Search is client-side, with a curated synonym list and everyday-language phrases. No AI search in the MVP.
- Stack: Vite + React + TypeScript + Tailwind CSS, hosted as static files.

## A. Product definition

What it is. A visual dictionary of interface effects. Each entry shows a live demo next to its common names, a plain-language description of the behavior, and a ready-to-paste prompt for AI coding tools.

Who it is for. [Assumption] Chinese-speaking people who build websites with AI coding tools and are not necessarily front-end specialists. The interface is Chinese; English technical terms are always shown alongside, and search works in both languages.

The problem. Users can picture an effect but do not know its name. They describe it loosely, and the AI builds something different.

Central journey. Browse or search → recognise the effect by watching it → learn its common names → understand its behavior (trigger, what changes, how it moves) → copy an accurate description into the AI conversation.

What a successful first version lets a user do. Someone who has never heard of a “tilt effect” can open the site, either type 鼠标移上去卡片跟着动 or filter by 「鼠标跟随」 + 「卡片」, recognise the 3D tilt card, play it, adjust its intensity, read its English name and aliases, copy a prompt, and paste it into an AI tool to get a close result. This should take about two minutes, with no account.

[Recommended] Optional later: privacy-friendly counting of two events only (searches with zero results, Copy prompt clicks per effect). These tell you what to add next. This is not needed to launch.

## B. MVP specification

### B1. Confirmed requirements vs recommended additions

#### [Confirmed] from your brief

- A website that collects different effects in an organised way.
- Clear visual demonstrations, including animation where appropriate.
- Names and explanations that help users communicate effects precisely.

[Confirmed] features you asked me to evaluate (all included in the MVP in some form): gallery, categories, keyword and synonym search, the listed effect information fields, triggerable and replayable previews, Copy prompt.

[Assumption] Chinese interface with English terminology; bilingual search; primary audience Chinese-speaking.

#### [Recommended] additions, kept small

- Filter by trigger (“what makes it move?”), because it works without knowing a name.
- An Auto demo button on pointer-based effects, so touch users and keyboard users can see the behavior without a mouse.
- A few adjustable parameters per effect (for example tilt angle) that update the copied prompt.
- English / Chinese toggle for the copied prompt.
- “Don’t confuse with” terminology notes and related effects.
- A short “How to describe an effect” guide page.

### B2. Feature decisions

| Feature | MVP? | Reasoning |
| --- | --- | --- |
| Gallery with live mini previews | Yes | Core: recognition by sight |
| Filters: category, trigger, type | Yes | Lets users find things without a name |
| Keyword + synonym search, client-side | Yes | Meets the “card that follows my mouse” case with no backend |
| Detail page with full interactive demo | Yes | Core: understand actual behavior |
| Copy prompt (EN and 中文) | Yes | Core: closes the communication gap |
| Parameter controls that update the prompt | Yes, small | Shows that values are suggestions and makes prompts precise |
| Terminology notes, related effects | Yes | Terminology varies; this is the “dictionary” part |
| Guide page | Yes, short and static | Teaches how to describe effects generally |
| Accounts | No | Nothing in the MVP needs identity |
| Favorites | Later | Can be done with localStorage, still no account |
| Community submissions | Later | Needs backend and moderation; quality of curated entries is the product’s value |
| AI / semantic search | Later | Only if real queries show curated synonyms are not enough; then precompute embeddings at build time |
| Admin tools | No | Content lives as files in the repo; build an admin UI only if non-developers must edit |
| Dark mode | Later | Design tokens are set up so it is easy to add |
| GIF / video previews | No | Live demos are lighter, sharper, adjustable and keyboard-operable |
| Code snippets for each effect | Later | Your goal is accurate descriptions; code can come in a v2 |

#### Preview method per kind of effect

| Kind | Preview |
| --- | --- |
| Hover, cursor-follow, click | Live interactive demo with a clear hint (“move your cursor over the card”), a Reset button, and Auto demo |
| Continuous animation | Live looping animation with Pause / Play |
| One-shot (page load, entrance) | Live demo with a Replay button |
| Scroll effects | A scrollable mini-stage inside the page (own scroll container), plus Replay that scrolls it automatically |
| Static visual style | Static example, clearly labelled “Visual style · no motion”, with sliders for key values |

No GIFs or videos are needed in the initial collection; every effect can be reproduced in the browser.

### B3. Pages and views

#### 1. Library (/): discovery.

- Header: site name, link to Guide.
- Search strip: large search box with a one-line promise, 「不知道名字？描述一下，或者按“它怎么动”来找」.
- Filter bar: (1) 它什么时候动？ trigger chips; (2) 用在哪里？ category chips; (3) type segmented control: 全部 / 动画 / 交互 / 视觉样式. Selections combine with AND across groups and OR within a group.
- Result line: count, active filters, Clear all.
- Gallery grid (1 column on phones, 2 on tablets, 3 to 4 on desktop). Each card has a live mini preview, Chinese name, English name, one-line summary, trigger badge and type badge. Continuous effects loop in the card (paused when off-screen). Interactive effects start on hover, focus or tap, and show a small hint.
- Search and filters live-update the grid; the URL reflects state (?q=&trigger=&cat=&type=) so a result view can be shared.
- Empty state: “没找到完全匹配的”, the three closest effects, and trigger chips.

#### 2. Effect detail (/effects/:slug)

- Names: Chinese name large, English name beside it, alias chips.
- Demo stage: large, with the trigger hint (desktop text and touch text), Reset or Replay, Auto demo, and parameter controls.
- “怎么描述它” panel: what you see, behavior steps (trigger → change → return), typical uses.
- Terminology note and “Don’t confuse with” links.
- Prompt panel: EN / 中文 toggle, readable prompt text, Copy button with 「已复制」 feedback, and a line saying numbers are suggested settings.
- Related effects (3 cards).

#### 3. Guide (/guide): six ingredients of a good effect description (element, trigger, what changes, motion details, constraints, edge cases) with a vague-versus-precise example.

#### 4. Not found (/404): short message and link back to the library.

### B4. Classification

Three independent facets, plus free tags.

- Category (what element it applies to; one per effect): buttons 按钮, cards 卡片, text 文字, backgrounds 背景, navigation 导航, scrolling 滚动, loading states 加载状态, transitions 转场与弹层.
- Trigger (what makes it happen; one or more): hover 悬停, pointer-follow 鼠标跟随, click 点击, scroll 滚动, page-load 页面载入, continuous 自动循环.
- Type: animation 动画, interaction 交互, visual style 视觉样式.
- Tags (search only): for example 3d, glow, blur, gradient, stagger, loop.

The trigger facet is deliberately prominent. “It moves when I scroll” and “it follows my cursor” are things users can say without any terminology.

### B5. Search behavior

Goal: an everyday description leads to the right entry. [Recommended] MVP approach: client-side, curated, no AI.

Indexed fields and weights: names (EN and ZH) 5; aliases 4; everyday search phrases 3.5 (sentences written the way users really talk); tags 2; summary, what-you-see and use cases 1.

#### Steps

1.  Normalise: lowercase, trim, Unicode NFKC, remove punctuation.
2.  Expand with a curated synonym list, for example {鼠标, 光标, 指针, cursor, mouse, pointer}, {跟随, 跟着, 追踪, follow, track}, {悬停, 移上去, 移过, hover}, {翻转, 翻面, flip}, {倾斜, 歪, tilt}, {毛玻璃, 磨砂, 玻璃, frosted, glass, blur}, {打字, 逐字, typing, typewriter}, {加载, 载入, loading}, {骨架屏, 灰色占位, skeleton}, {滚动, 滑动, scroll}, {视差, parallax}.
3.  Chinese has no spaces, so avoid a segmenter: match by substring and character n-grams against the index, plus the synonym list. English matches by token and prefix.
4.  Use Fuse.js (or an equivalent small scorer) with the weights above, then boost exact name and alias matches.
5.  Show a small 「匹配：别名 tilt effect」 hint on each result, so users learn the term while searching.
6.  If nothing matches, relax the threshold, show the nearest results labelled as approximate, and offer trigger chips.

#### Acceptance test queries (the top 3 results must include the expected effect)

| Query | Expected |
| --- | --- |
| 鼠标移上去卡片跟着动 | card-tilt-3d, spotlight-card |
| a card that follows my mouse | card-tilt-3d, spotlight-card |
| 点一下卡片翻过来 | card-flip |
| 文字像打字一样出现 | typewriter |
| frosted glass / blur background / 毛玻璃 | glassmorphism |
| 加载时灰色条闪光 | skeleton-shimmer |
| 滚动时背景比内容慢 | parallax-scroll |
| 按钮被鼠标吸过去 | magnetic-button |
| 点击按钮出现水波纹 | ripple-button |
| 向下滚动内容渐渐出现 | scroll-reveal |
| 彩色流动的背景 | aurora-gradient |
| 导航链接下面划线滑出来 | underline-slide-link |

When to upgrade. Consider embedding-based search only if real queries often return nothing useful or the library grows large (on the order of 100+ entries). It would need precomputed embeddings and one small serverless function; it is not needed for the MVP.

### B6. Content fields for each effect

| Field | Purpose |
| --- | --- |
| id, slug, status (published / draft) | Identity and visibility |
| name.en, name.zh | Primary names |
| aliases.en[], aliases.zh[] | Other commonly used names |
| searchPhrases.zh[], searchPhrases.en[] | Everyday descriptions, written as a user would say them |
| category, type, triggers[], tags[] | Classification |
| summary.zh | One line describing what the user sees |
| whatYouSee.zh | Two to three sentences on the visible result |
| behavior[] | Ordered steps: trigger, changes, return state |
| useCases[] | Typical places the effect is used |
| terminologyNote.zh (optional) | How names vary; what it is not |
| related[] | Slugs of related effects |
| demo: componentId, hint.zh, hintTouch.zh, replayable, autoDemo | How the preview behaves |
| params[]: key, label.zh, type, default, min, max, step, unit | Adjustable settings; they fill the prompt |
| prompt.en, prompt.zh | Templates with {{key}} placeholders |

#### Content rules

- Summaries describe what is visible, not how it is coded.
- Every prompt names the affected element, the trigger, the visual changes and the motion details (duration, easing, range), marks numbers as suggested, and ends with reduced-motion and touch fallbacks.
- Where naming varies, say which name is most common and how related effects differ. Do not claim a single official name.

### B7. Initial collection (18 effects)

| Slug | 中文 | English | Category | Type | Trigger | Preview |
| --- | --- | --- | --- | --- | --- | --- |
| card-flip | 卡片翻转 | Card Flip | cards | interaction | hover, click | Live; click or hover, Reset |
| card-tilt-3d | 3D 倾斜卡片 | 3D Tilt Card | cards | interaction | pointer-follow | Live; Auto demo |
| spotlight-card | 光斑跟随卡片 | Spotlight / Cursor Glow Card | cards | interaction | pointer-follow | Live; Auto demo |
| magnetic-button | 磁吸按钮 | Magnetic Button | buttons | interaction | pointer-follow | Live; Auto demo |
| ripple-button | 水波纹按钮 | Ripple Button | buttons | interaction | click | Live; click |
| sliding-fill-button | 滑动填充按钮 | Sliding Fill Button | buttons | interaction | hover | Live |
| typewriter | 打字机效果 | Typewriter Text | text | animation | page-load, continuous | Live; Replay |
| gradient-text-shimmer | 渐变流光文字 | Gradient Text Shimmer | text | animation | continuous | Live loop |
| staggered-text-reveal | 逐词错落出现 | Staggered Text Reveal | text | animation | page-load | Live; Replay |
| aurora-gradient | 极光渐变背景 | Aurora Gradient Background | backgrounds | animation | continuous | Live loop |
| glassmorphism | 玻璃拟态 | Glassmorphism (Frosted Glass) | backgrounds | visual style | none (static) | Static; sliders |
| underline-slide-link | 下划线滑出链接 | Sliding Underline Link | navigation | interaction | hover | Live |
| shrinking-sticky-header | 吸顶收缩导航 | Shrinking Sticky Header | navigation | interaction | scroll | Mini scroll stage; Replay |
| parallax-scroll | 视差滚动 | Parallax Scrolling | scrolling | interaction | scroll | Mini scroll stage; Replay |
| scroll-reveal | 滚动渐显 | Scroll Reveal (Fade-up) | scrolling | animation | scroll | Mini scroll stage; Replay |
| skeleton-shimmer | 骨架屏闪光 | Skeleton Shimmer | loading states | animation | continuous | Live loop |
| pulsing-dots-loader | 跳动圆点加载 | Pulsing Dots Loader | loading states | animation | continuous | Live loop |
| modal-scale-fade | 弹窗缩放淡入 | Modal Scale-and-Fade | transitions | animation | click | Live; open and close |

This list is a starting set. It covers all eight categories, all trigger types, and all three types (including one pure visual style), and each item is small enough to build as a real working component.

### B8. Three complete sample entries

These three were chosen to cover three different preview methods: pointer-driven interaction, timed animation with replay, and a static visual style. The Chinese prompt versions are in the content data inside section D.

#### Sample 1: 3D Tilt Card (card-tilt-3d)

- Names: 3D 倾斜卡片 / 3D Tilt Card. Aliases (EN): tilt effect, parallax tilt, perspective tilt, 3D hover card, mouse-tracking card, vanilla-tilt style. Aliases (ZH): 卡片倾斜, 鼠标跟随卡片, 3D 悬浮卡片, 视差倾斜.
- Everyday phrases: 鼠标移上去卡片会跟着转 · 卡片会朝鼠标的方向歪 · 卡片有立体感 · a card that follows my mouse · a card that leans toward the cursor.
- Category / type / trigger: cards / interaction / pointer-follow (hover on desktop, finger drag on touch).
- What you see: The card tilts in 3D so the edge nearest the cursor dips away, as if the card is being pressed at that point. When the cursor leaves, the card eases back to flat. An optional soft glare highlight follows the cursor.
- Behavior: (1) Cursor enters: card scales up slightly. (2) Cursor moves: tilt follows its position over the card, and the glare moves with it. (3) Cursor leaves: card returns to flat and the glare fades.
- Uses: product cards, pricing cards, portfolio thumbnails, collectible-card displays.
- Terminology note: “Tilt” is the most common name. “Parallax tilt” is often used when inner layers also shift at different rates. It is not a Card Flip, which turns a card over by 180°.
- Related: spotlight-card, card-flip.
- Preview behavior: Live card about 320 by 200 px. Hint: 把鼠标移到卡片上 (touch: 在卡片上拖动手指). Buttons: Reset, Auto demo (a scripted pointer path traces a slow circle and a figure eight over 4 seconds). Controls: max tilt, scale, perspective, glare on/off, return duration.
- Parameters (suggested): maxTilt 12° (4 to 25), scale 1.03 (1 to 1.1), perspective 1000 px (500 to 2000), glare on, returnDuration 400 ms (150 to 800).
- Copy prompt (EN):

```text
Build a 3D tilt card (also called a parallax tilt or perspective tilt card).
Element: one content card, about 320 by 200 px, 16 px rounded corners, soft shadow.
Trigger: pointer movement over the card (mouse hover). On touch screens, dragging a finger across the card should do the same.
Behavior: while the pointer is over the card, the card rotates in 3D so that the edge nearest the pointer dips away from the viewer, as if pressed at that point. The card scales up slightly while hovered. A soft white radial glare (up to 25% opacity) follows the pointer across the card.
Motion (suggested values): perspective 1000 px; maximum tilt 12 degrees on each axis; scale 1.03; while the pointer moves, update the transform every animation frame with light smoothing and no long CSS transition; when the pointer leaves, ease back to flat over 400 ms with ease-out, and fade the glare out.
Implementation notes: animate only transform and opacity; set will-change: transform on the card; do not let the tilt move the card out of its layout space.
Fallbacks: if prefers-reduced-motion is set, disable the tilt and use only a subtle shadow or border change on hover. Do not make the card a keyboard trap; if the card is a link, it must stay focusable and show a visible focus ring.
```

#### Sample 2: Typewriter Text (typewriter)

- Names: 打字机效果 / Typewriter Text. Aliases (EN): typing animation, typing effect, typed text, character-by-character reveal, Typed.js style. Aliases (ZH): 打字效果, 打字动画, 逐字显示, 文字逐个出现.
- Everyday phrases: 文字一个字一个字蹦出来 · 像有人在打字 · 光标闪烁然后字出现 · text that types itself out.
- Category / type / trigger: text / animation / page-load, continuous.
- What you see: A line of text appears one character at a time with a blinking caret at the end. Optionally, after a pause the text is deleted character by character and the next phrase is typed.
- Behavior: (1) Caret blinks alone for a moment. (2) Characters appear one by one. (3) Full text pauses. (4) If looping, characters are deleted faster than they were typed and the next phrase begins.
- Uses: hero headlines, taglines, terminal or chat mockups, rotating role descriptions.
- Terminology note: “Typewriter effect” and “typing animation” are used interchangeably. It differs from a text scramble or decode effect (characters shuffle before settling) and from a text reveal (words fade or slide in).
- Related: staggered-text-reveal, gradient-text-shimmer.
- Preview behavior: Live line of text cycling through three phrases. Buttons: Replay, Pause / Play. Controls: typing speed, delete speed, pause length, loop, caret. No pointer interaction needed.
- Parameters (suggested): typingSpeed 50 ms per character (20 to 150), deleteSpeed 30 ms (10 to 100), pauseAfter 1500 ms (500 to 4000), loop on, caret blink 530 ms.
- Copy prompt (EN):

```text
Build a typewriter text effect (typing animation).
Element: a single headline line that cycles through three short phrases.
Trigger: starts automatically when the element first appears on screen and then loops continuously.
Behavior: the text is typed one character at a time, followed by a blinking vertical caret. When a phrase is complete, pause, then delete it character by character and type the next phrase. After the last phrase, return to the first.
Motion (suggested values): typing speed 50 ms per character; deleting speed 30 ms per character; pause of 1500 ms after a phrase is complete; the caret toggles visibility every 530 ms; the caret stays solid while characters are being typed or deleted.
Implementation notes: reveal real text characters (not an animated width) so line wrapping works; reserve the line height so the layout does not jump; start only when visible; clear any timers on unmount.
Accessibility: give the element an accessible label containing the full current phrase, and keep the animated characters aria-hidden so screen readers do not announce every letter. If prefers-reduced-motion is set, show the first phrase fully with no typing and no blinking caret.
```

#### Sample 3: Glassmorphism (glassmorphism)

- Names: 玻璃拟态 / Glassmorphism (Frosted Glass). Aliases (EN): frosted glass, glass UI, backdrop blur, blurred translucent card. Aliases (ZH): 毛玻璃, 磨砂玻璃, 毛玻璃卡片, 半透明模糊背景.
- Everyday phrases: 半透明模糊的卡片 · 像磨砂玻璃 · 能隐约看到后面的背景 · blur the background behind a panel.
- Category / type / trigger: backgrounds / visual style / none (static).
- What you see: A translucent panel sits over a colorful background. The background behind the panel looks blurred, as if seen through frosted glass, and the panel has a thin light border and soft shadow.
- Behavior: None; this is a visual style, not an animation. Appearance depends on what is behind the panel.
- Uses: cards over gradients or photos, navigation bars, dashboards, music or weather widgets, modals.
- Terminology note: “Frosted glass” and “glassmorphism” usually mean the same thing. Apple’s “Liquid Glass” is a specific design language with more refraction and dynamic behavior; people sometimes use the terms loosely together, but they are not identical.
- Related: aurora-gradient, modal-scale-fade.
- Preview behavior: Static example: a card over slowly fixed colored blobs (no animation). A badge reads 「视觉样式 · 无动画」. Sliders for blur, fill opacity, border opacity and corner radius update the example and the prompt live. A toggle swaps the background between three presets, to show that the effect depends on what is behind.
- Parameters (suggested): blur 16 px (4 to 40), fillOpacity 0.15 (0.05 to 0.4), borderOpacity 0.3 (0.1 to 0.6), radius 16 px (0 to 32).
- Copy prompt (EN):

```text
Build a glassmorphism (frosted glass) card.
Element: one rounded card, about 360 px wide, placed over a colorful gradient background so the blur is visible.
Trigger: none; this is a static visual style with no animation.
Visual details (suggested values): card background white at 15% opacity; backdrop-filter: blur(16px) with a slight saturation boost (about 140%); 1 px border in white at 30% opacity; 16 px corner radius; soft shadow such as 0 8px 32px rgba(0, 0, 0, 0.15).
Implementation notes: include the -webkit-backdrop-filter prefix; there must be visible content or color behind the card for the blur to show; add a fallback for browsers without backdrop-filter, using a more opaque solid background (about 70% opacity).
Accessibility: check that text on the card keeps at least 4.5:1 contrast against the blurred background; if contrast is weak, darken the card fill slightly instead of making the text thinner.
```

### B9. Cross-cutting requirements

- Mobile and touch. Hover has no equivalent on touch screens, so every hover or pointer effect has a touch alternative: tap, press-and-hold, or finger drag inside the demo area, plus the Auto demo button. Demo areas allow vertical page scrolling (touch-action: pan-y) so a demo never traps the page. Touch targets are at least 44 by 44 px.
- Readable descriptions. Body text at least 16 px, line length of about 60 to 75 characters, Chinese line height about 1.7, prompts in a monospace block that wraps and never scrolls sideways on phones.
- Keyboard access. All controls are reachable and operable by keyboard with a visible focus ring; effects triggered by hover must also respond to focus; Esc closes the modal demo; search, filters and chips are real form controls.
- Reduced motion. [Recommended decision] A visitor with the OS reduced-motion setting must still be able to see the effects, since seeing them is the purpose of the site. Default: autoplay and looping are off and demos show a static state with a visible Play button. Pressing Play always works because it is user-initiated. The site’s own UI motion (page transitions) is minimal regardless. The copied prompts also tell the AI to respect reduced motion.
- Animation performance. Animate only transform and opacity (plus a few declared exceptions, such as background-position for shimmer). Pause loops that are off-screen with IntersectionObserver. In the gallery, run at most a few live previews at once (hover or focus activates the rest). Avoid large blur filters in many cards at the same time. Clean up listeners and frames on unmount.

## C. Technical recommendation

| Choice | Recommendation | Why |
| --- | --- | --- |
| Build tool and framework | Vite + React 18 + TypeScript | Very well supported by AI coding assistants; fast to run; builds to plain static files |
| Routing | React Router | Only three real pages, but each needs a shareable URL |
| Site styling | Tailwind CSS with design tokens as CSS variables | Quick, consistent responsive layout and focus styles |
| Demo styling | A plain CSS file per demo, next to its component | Keeps each effect’s code self-contained and inspectable, and close to what the prompt describes |
| Animation | Plain CSS transitions and keyframes plus small hooks (requestAnimationFrame, IntersectionObserver). No animation library in the MVP | The prompts describe real durations and easings, so demos should use the same primitives; fewer dependencies; easy to audit performance |
| Content | Typed TypeScript data files, one per effect, plus a validation test | For tens of entries this is simpler than a CMS or MDX, and bilingual structured fields stay type-checked |
| Search | Fuse.js + a hand-written synonyms file | Small, runs in the browser, supports weighted fields and fuzzy matching |
| Tests | Vitest for search acceptance queries and content validation; manual accessibility checklist; optionally axe | Protects the most important behavior (finding things) |
| Hosting | Any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages) | No server to run |

Backend: none for the MVP. A backend only becomes necessary for community submissions, accounts with synced favorites, AI or semantic search at query time, or a content admin interface. Favorites can use localStorage with no backend.

### Two trade-offs to know about

- A client-rendered single-page app is weaker for search-engine indexing. [Recommended] After the MVP, add build-time prerendering (for example vite-ssg), or move to Astro or Next.js static export, if search-engine traffic matters.
- [Assumption] If many users are in mainland China, some global static hosts can load slowly or unreliably there. Choose the host with that in mind before launch.

Adding an effect later: (1) create src/content/effects/<slug>.ts with the fields from B6; (2) create src/demos/<Component>.tsx and its CSS; (3) register the component id in src/demos/registry.ts; (4) add synonyms if needed; (5) run the validation test. No other file should need editing.

## D. Master development prompt

How to use it: the prompt is long, so it is split into two boxes. Paste Box 1 and Box 2 together as one message (Box 1 first) into your AI coding assistant. If you prefer smaller steps, save both boxes joined as docs/SPEC.md in your project and use the staged prompts in section E, which refer to this spec by section number.

### Master prompt, Box 1 of 2 (sections 1 to 6)

````markdown
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
````

### Master prompt, Box 2 of 2 (sections 7 to 13)

````markdown
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
````

## E. Ordered development prompts

How to use: save the two master-prompt boxes joined together as docs/SPEC.md in an empty project folder, then give your AI coding assistant the five prompts below one at a time, in order. Start the next stage only after the current stage’s completion criteria pass. Each prompt refers to docs/SPEC.md by section number, and later stages build on the existing code instead of rewriting it.

| Stage | Outcome |
| --- | --- |
| 1. Foundation and first vertical slice | Project, data model, prompt rendering, detail page, and 3 complete effects end to end |
| 2. Discovery | Library gallery, filters, search, synonyms, URL state, empty states |
| 3. Demos, batch A | Cards, buttons and text effects (7 effects) |
| 4. Demos, batch B | Backgrounds, navigation, scrolling, loading and transitions (8 effects) |
| 5. Guide and hardening | Guide page, accessibility, reduced motion, performance, tests, README, final audit |

### Stage 1 prompt: foundation and first vertical slice

```text
Goal: set up the project and deliver one complete end-to-end slice: three real effects that can be opened on a detail page, played, adjusted, and copied as prompts.

Context: the full product specification is in docs/SPEC.md. Read it fully before writing code. In this stage follow sections 2, 4, 5, 3.2, 7.1, 8 and the relevant parts of 9 and 10.

Scope (do):
1. Scaffold Vite + React 18 + TypeScript (strict) + React Router + Tailwind CSS + Fuse.js + Vitest. Create the folder structure from section 10.
2. Implement the design tokens, fonts, layout shell (header, footer, main) and focus styles from section 4.
3. Implement src/types.ts and the content index. Create the three sample entries from section 7.1 exactly as written (card-tilt-3d, typewriter, glassmorphism).
4. Implement renderPrompt (supporting {{key}}, {{#key}} blocks and {{^key}} blocks, with unit handling) with Vitest unit tests, plus the content validation test from section 5.
5. Implement the demo registry and the three working demos: CardTilt3d, Typewriter, Glassmorphism, following sections 7 and 7.1 and the hooks listed in section 10 (useRaf, useInView, useReducedMotion, useVirtualPointer).
6. Implement the Effect detail page at /effects/:slug as in section 3.2: names and aliases, trigger hint, demo stage with toolbar (Replay or Pause, Reset, Auto demo where applicable), parameter panel, description panel, terminology note, prompt panel with EN and Chinese toggle and a working Copy button, and a Not Found page.
7. Add a temporary Library page at / that simply lists the three effects as links to their detail pages.

Out of scope in this stage: search, filters, gallery card previews, the other 15 effects, the Guide page.

Expected result: running the dev server, a user can open each of the three detail pages, see the labelled behavior working, change parameters, see the prompt text update live in both languages, and copy it.

Completion criteria:
- Build, type-check and tests pass.
- Tilt follows the pointer with the specified values and Auto demo drives it with a scripted path; on touch it responds to finger drag without blocking vertical page scroll.
- Typewriter types, deletes and loops as specified; Replay restarts it; Pause stops it.
- Glassmorphism shows real backdrop blur over colored backgrounds with working sliders and the label 视觉样式 · 无动画.
- With prefers-reduced-motion enabled, nothing autoplays and the Play, Replay and Auto demo buttons still run the demos.
- The prompt text includes the current parameter values, and unchecking the glare or loop toggle changes the prompt text correctly.
- Everything is operable by keyboard with visible focus.

At the end, list the files you created and anything that deviates from docs/SPEC.md.
```

### Stage 2 prompt: discovery (gallery, filters, search)

```text
Goal: build the real Library page so a person who does not know an effect’s name can find it by looking, filtering or describing it.

Context: docs/SPEC.md. The Stage 1 code exists (project, data model, 3 effects, detail page). Follow sections 3.1, 6 and 9 (preview activation rules). Do not rewrite Stage 1 code except where needed to integrate.

Scope (do):
1. Replace the temporary Library page with the page in section 3.1: search strip, filter bar with the three groups (trigger chips, category chips, type segmented control), result line with Clear filters, responsive gallery grid, and the empty state with nearest results.
2. Build the EffectCard component with a live mini preview. Add a small, reusable preview mechanism: each demo component accepts a compact mode (smaller, no controls) and a paused flag. Apply the activation rules in section 9: continuous demos run only while visible and not under reduced motion, with at most 6 running at once; interactive demos activate on hover, focus or tap; scroll demos show a static representative frame. Add the hint labels and a 查看详情 link.
3. Implement src/search/ exactly as section 6 describes (normalize, synonyms.ts with at least the listed groups, weighted Fuse.js index, synonym expansion, exact and prefix boost, matched-field hint, relaxed nearest-results fallback).
4. Implement URL state (?q=, trigger=, cat=, type=) with replace-style updates and restoration on load.
5. Add Vitest tests for filter logic (AND across groups, OR within a group) and for search. Because only 3 effects exist so far, test the queries whose expected effects exist now (for example a card that follows my mouse, 文字像打字一样出现, 毛玻璃, frosted glass, blur background) and put the remaining acceptance queries from section 6 in the test file as test.todo entries that Stage 3 and Stage 4 will activate.
6. Add a polite aria-live result count announcement and visible labels for search and filters.

Out of scope: new effects, the Guide page.

Expected result: the Library shows the 3 existing effects with live previews; typing, filtering and URL sharing all work.

Completion criteria:
- Typing 鼠标移上去卡片跟着动 returns the 3D Tilt Card first and shows the hint 匹配 with the matched alias or phrase.
- Selecting trigger 鼠标跟随 and category 卡片 narrows the list correctly; selecting two triggers shows the union within that group; the URL updates and reloading the URL restores the same view.
- A nonsense query shows the empty state with nearest results and trigger chips.
- Gallery previews follow the activation rules and pause when off-screen; no more than 6 previews run at once.
- Filters and search are keyboard operable; chips expose aria-pressed.
- Build, type-check and all tests pass.

At the end, list changes and any deviations from docs/SPEC.md.
```

### Stage 3 prompt: demos, batch A (cards, buttons, text)

```text
Goal: add seven more complete effects: card-flip, spotlight-card, magnetic-button, ripple-button, sliding-fill-button, gradient-text-shimmer, staggered-text-reveal.

Context: docs/SPEC.md section 7 (items 1, 3, 4, 5, 6, 8, 9), section 8 (prompt rules) and the existing code. Use the three entries in section 7.1 as the quality bar for content. Follow the established pattern: one content file in src/content/effects, one demo component plus CSS in src/demos, one registry entry. Do not change the shared components except to fix real bugs, and mention any such change.

Scope (do), for each of the seven effects:
1. Write the complete content file: all fields in the Effect type, Chinese text, English and Chinese aliases, 3 to 6 everyday search phrases per language, behavior steps, use cases, terminology note where names vary (for example how a card flip differs from a card tilt, and how a text shimmer differs from a typewriter), related effects, and 2 to 5 params with the defaults and ranges given in the spec.
2. Write both prompts (English and Chinese) following the prompt rules in section 8 and the structure of the sample prompts: element, trigger, visual changes, motion details marked as suggested values, implementation notes, and reduced-motion, keyboard and touch fallbacks. Use {{key}} placeholders for every editable param.
3. Build the working demo exactly as specified, with the compact preview mode used by gallery cards. Pointer-follow and hover demos must support virtualPointer so Auto demo works. Hover effects must also respond to keyboard focus and have a tap equivalent.
4. Add new synonyms needed so these effects are findable, and activate the matching test.todo acceptance queries in the search tests (点一下卡片翻过来, 鼠标移上去卡片跟着动 returning spotlight-card within the top 3, 按钮被鼠标吸过去, 点击按钮出现水波纹).

Out of scope: the remaining eight effects, the Guide page.

Completion criteria:
- The Library shows 10 effects; each has a working card preview and detail page.
- Each demo performs the behavior in its label with the specified values; no placeholders.
- Content validation tests pass for all 10 entries, and the newly activated search tests pass.
- Reduced-motion behavior matches section 9 for every new demo.
- Keyboard: card flip toggles with Enter and Space; buttons are operable; focus is visible.
- Build, type-check and tests pass.

At the end, list the files added and any deviations from docs/SPEC.md.
```

### Stage 4 prompt: demos, batch B (backgrounds, navigation, scrolling, loading, transitions)

```text
Goal: add the remaining eight effects: aurora-gradient, underline-slide-link, shrinking-sticky-header, parallax-scroll, scroll-reveal, skeleton-shimmer, pulsing-dots-loader, modal-scale-fade. After this stage the Library holds all 18 effects.

Context: docs/SPEC.md section 7 (items 10, 12 to 18), section 8 and section 9, and the existing code. Follow the same pattern and quality bar as Stage 3 (content file, bilingual prompts, demo component plus CSS, registry entry, synonyms, activated search tests).

Scope (do):
1. For each effect, write the complete content file and both prompts as in Stage 3. Include terminology notes where useful: for example, parallax scrolling versus scroll reveal; skeleton screen versus spinner; sticky header versus fixed header; aurora gradient versus a plain animated gradient.
2. Build the demos as specified. For scroll effects (shrinking-sticky-header, parallax-scroll, scroll-reveal) build a contained scrollable mini stage with its own scroll container, an IntersectionObserver or scroll handler rooted on that container (never the window), a working Replay that auto-scrolls the stage, and a touch-friendly scroll area that does not trap page scrolling.
3. The modal demo must be contained inside the demo stage, with proper focus management: focus moves in, is trapped while open, Esc closes it, and focus returns to the opener.
4. Gallery previews: continuous effects play while visible within the 6-at-once limit; scroll effects show a static representative frame with the hint 在详情页体验滚动; the modal preview shows a static open state.
5. Activate all remaining acceptance queries in the search tests (滚动时背景比内容慢, 向下滚动内容渐渐出现, 彩色流动的背景, 导航链接下面划线滑出来, 加载时灰色条闪光) and add the required synonyms. All 12 queries from section 6 must now pass.

Completion criteria:
- The Library shows exactly 18 effects across all 8 categories; every card preview and every detail page works.
- Each scroll demo works by mouse wheel, by touch scroll and through Replay.
- Skeleton shimmer and pulsing dots use transform and opacity only, are labelled for screen readers as specified, and pause when off-screen.
- Content validation tests pass for all 18 entries; all 12 acceptance search queries pass.
- Reduced-motion behavior matches section 9 for every new demo.
- Build, type-check and tests pass.

At the end, list the files added and any deviations from docs/SPEC.md.
```

### Stage 5 prompt: Guide page and hardening

```text
Goal: complete the product: add the Guide page, then audit and fix accessibility, reduced motion, mobile behavior, performance, tests and documentation so every acceptance criterion in docs/SPEC.md section 11 is met.

Context: docs/SPEC.md and the existing implementation of all 18 effects. Do not add new features beyond the Guide page. Fix problems at their source rather than hiding them.

Scope (do):
1. Implement the Guide page at /guide as in section 3.3, in Chinese, with the six parts of a good description and the before-and-after example, linking to the 3D Tilt Card page. Link it from the header and footer.
2. Accessibility audit and fixes for the Library, three representative detail pages (one pointer, one scroll, one static style) and the Guide: landmarks, heading order, labels, aria-pressed on chips, aria-live result announcements, visible focus, color contrast of 4.5:1 or better, keyboard-only operation of every control and demo, modal focus handling. Run axe (add it as a dev dependency or use the browser extension) and fix all critical and serious violations.
3. Reduced motion: verify under the OS setting that nothing autoplays on the Library or any detail page and that Play, Replay and Auto demo still work. Fix any demo that violates this.
4. Mobile and touch: test at 320, 375, 768 and 1280 px. No horizontal page scroll; touch targets of at least 44 px; demo areas allow vertical page scroll; hover-only effects have tap, drag or Auto demo alternatives; prompts wrap in their block.
5. Performance: confirm only transform and opacity are animated (documented exceptions only); loops pause off-screen; at most 6 gallery previews run at once; listeners, timers and animation frames are cleaned up on unmount; no layout reads in scroll or pointer handlers without caching. Report the production bundle size and keep JavaScript under about 250 KB gzipped, or explain.
6. Tests: ensure Vitest covers renderPrompt, content validation for all 18 entries, filter logic and all 12 search acceptance queries. Add a test that fails if any prompt template references a param key that does not exist.
7. README: install, run, test, build, deploy to a static host, the five-step process for adding a new effect, and the content rules from docs/SPEC.md.
8. Walk through every item of docs/SPEC.md section 11 and verify each one.

Completion criteria: all 13 acceptance criteria in section 11 are verified and reported one by one; Lighthouse accessibility is at least 95 on the Library and one detail page; build, type-check and tests pass.

At the end, give a checklist of the 13 criteria with how each was verified, and list known limitations.
```

## Questions that would materially change the plan

- Audience and language. I assumed a Chinese interface with English terminology. If your main audience is English-speaking, the interface, synonyms and sample content would change, but the structure stays the same.
- Public launch or personal reference? I assumed a public site. If it is only for yourself, you can skip the SEO and hosting considerations and could even drop the Guide page.

Everything else above is a reasonable default you can change after seeing a working first version.

## F. Long-term plan (the full stage map)

Save this section as docs/ROADMAP.md in the repo. Stages 1 to 5 are the prompts in section E. The final stage of the MVP is Stage 6: Launch v1.0. Everything after it is a growth stage, each with an entry gate so you never build ahead of evidence.

### F1. Stage map

| Stage | Name | Outcome | Gate to move on |
| --- | --- | --- | --- |
| 0 | Governance setup | Rules, roadmap and progress log in the repo; dot confirms it understands them | You approve dot’s summary |
| 1 | Foundation and first vertical slice | 3 working effects end to end | Stage 1 completion criteria pass |
| 2 | Discovery | Gallery, filters, search | Same |
| 3 | Demos, batch A | 10 effects total | Same |
| 4 | Demos, batch B | 18 effects total | Same |
| 5 | Guide and hardening | Accessibility, reduced motion, performance, tests, README | All 13 acceptance criteria verified |
| 6 | Launch v1.0 (publish) | Public site on your domain, prerendered pages, CI and deploy pipeline, release runbook | Production smoke test passes; you have personally read all 18 entries |
| 7 | Content waves (ongoing) | Grow from 18 to about 40, then about 60 effects, in waves of 6 to 8 | Per wave: validation and search tests pass, no regression, you read every new prompt |
| 8 | Feedback loop | Privacy-friendly analytics (zero-result searches, Copy prompt per effect) and a “can’t find your effect?” link | You lift the no-analytics rule in AGENTS.md first |
| 9 | Prompt quality and code tab | Each prompt tested in real AI tools; optional code-snippet tab | Prompt test pass rate you define (suggest at least 80 percent judged close to the demo) |
| 10 | Personalization | Dark mode, favorites (localStorage), English interface | Demand from real users or your own priority |
| 11 | Search upgrade (only if needed) | Embedding-based search, built on precomputed data | Many zero-result or low-click searches remain after synonym work |
| 12 | Community and accounts (only if needed) | Submissions with moderation, synced favorites | You decide to run a service; needs a backend and a new security review |

Suggested trigger for Stage 11: after two rounds of synonym improvements, if more than roughly one in ten searches still returns nothing useful. Treat this as a starting point, not a rule.

### F2. How content grows (Stage 7 and later)

- Add effects in waves of 6 to 8, grouped by theme, so each wave is reviewable in one sitting.
- Every effect passes the same definition of done: working demo, bilingual prompts following section 8 of the spec, synonyms and everyday phrases, terminology note where names vary, related links, validation test, search acceptance query, reduced-motion and keyboard behavior.
- You read every prompt and terminology note before a wave ships. Naming is the product’s credibility; dot should not be the only reviewer.
- Candidate effects (edit freely): text scramble, marquee ticker, number count-up, image zoom on hover, accordion expand, tab underline indicator slide, toast slide-in, scroll progress bar, sticky scroll sections, horizontal scroll section, animated gradient border, custom cursor follower, toggle switch, confetti burst, button-to-spinner morph, mesh gradient (style), noise grain texture (style), dotted grid background (style), neumorphism (style), bento grid hover.

### F3. Tasks only you can do

- Final site name; check domain availability and any trademark conflicts.
- Buy the domain; create the hosting account and DNS records; create the Git repository and turn on branch protection for main.
- Choose a license for the code and a license or terms for the written content.
- Supply a 1200 by 630 px share image (og-image.png) and a favicon source.
- Have a native Chinese reader check wording, and someone who knows front-end terminology check names and aliases.
- Choose the analytics tool at Stage 8 and update AGENTS.md before dot touches it.
- Decide where feedback goes (an email address or an issue tracker).

### F4. Main risks to keep in view

- Terminology errors damage trust more than missing features. Keep human review in every wave.
- Demos that look right but do not match their prompts. Stage 9 exists to catch this.
- Scope creep by the agent. The rules in section G are written to prevent it.
- A long-running agent losing context. docs/PROGRESS.md and the resume prompt in section H5 make every session restartable.
- Search-engine visibility. A pure single-page app indexes poorly, so Stage 6 includes prerendering.

## G. Operating rules for dot (Codex)

### G1. Files to place in the repo yourself, before anything else

| File | Content |
| --- | --- |
| AGENTS.md | The box in G2 (Codex reads this file automatically; if your setup uses a different instruction file name, use that name) |
| docs/SPEC.md | The two master-prompt boxes from section D, joined |
| docs/ROADMAP.md | Section F of this document |
| docs/PROGRESS.md | Created by dot in Stage 0 |

### G2. AGENTS.md

```markdown
# AGENTS.md: rules for AI coding agents working on Effect Lexicon

## Source of truth
- docs/SPEC.md is the product specification. docs/ROADMAP.md defines the stage order. docs/PROGRESS.md is the running log. This file holds the rules.
- At the start of every session, read this file, docs/ROADMAP.md, and the last five entries of docs/PROGRESS.md.
- If a task conflicts with SPEC.md or this file, stop and ask. Do not choose silently.
- Never edit SPEC.md, ROADMAP.md or AGENTS.md unless the task explicitly says so. Put suggested changes under Proposed spec changes in PROGRESS.md.

## Scope discipline
- Do one stage or one task at a time, and only what it lists. No bonus features, no unrequested refactors, renames, formatting sweeps or dependency upgrades.
- If you notice an unrelated problem, record it under Observations in PROGRESS.md. Do not fix it.
- Stages run in the order in ROADMAP.md. Do not start the next stage until the human confirms the current one.

## Stack and dependencies
- Allowed: Vite, React 18, TypeScript (strict), React Router, Tailwind CSS, Fuse.js, Vitest, Testing Library, ESLint, Prettier, and axe tooling as a dev dependency.
- Everything else needs approval. In particular: no animation libraries (Framer Motion, GSAP, anime.js and similar), no UI kits, no CSS-in-JS, no state-management libraries, no icon packs (use inline SVG).
- To add a dependency, write a short justification in PROGRESS.md and stop for approval, unless the task explicitly authorizes it.
- Commit the lockfile, use exact installs in CI, prefer package versions that are at least two weeks old, and do not add packages that run install scripts without asking.

## Prohibited until a roadmap stage explicitly allows it
- Backend, serverless functions, databases, authentication, analytics, cookies, tracking, third-party scripts, remote fonts, remote images, and any runtime network request.
- Secrets in the repository. Never commit .env files.
- dangerouslySetInnerHTML, eval, new Function, and inserting content data with innerHTML. Render prompts and descriptions as plain text.
- Copying code, text or assets from other sites, galleries, tutorials or libraries. Write original implementations and original wording. Do not use logos or brand assets. Naming a technique or product in text (for example Liquid Glass or Typed.js) is fine.
- GIF or video previews.

## Git rules
- Work on a branch named stage-N-short-name, content-wave-N, or fix-short-name. Never commit to main directly.
- Make small commits with clear messages. No force pushes, no history rewriting, no deleting branches, no committing build output.
- Do not run destructive commands (git reset --hard, git clean -fd, rm -rf outside build and node_modules folders) without asking.
- Change the lockfile only through the package manager.

## Quality gates
- Before saying a task is done, run typecheck, lint, test and build, and report the results. All must pass.
- Never skip, delete, weaken or comment out a test or an acceptance criterion to get a green result. If a test seems wrong, explain and ask.
- No any types. No eslint-disable or ts-ignore without a comment explaining why.

## Effect quality rules (apply to every effect)
- The demo performs the real behavior it is labelled with. No placeholders, no static images of motion.
- Animate only transform and opacity, except documented exceptions.
- Follow SPEC.md section 9 for reduced motion: nothing autoplays, but a user-pressed Play, Replay or Auto demo always runs.
- Hover and pointer effects have a keyboard equivalent and a touch alternative; Auto demo exists where specified.
- Clean up listeners, timers and animation frames on unmount.
- Content is bilingual, prompts follow SPEC.md section 8, and the validation test passes.
- Terminology honesty: never claim a single official name. If naming varies or you are unsure, say so in terminologyNote. Present numeric values as suggested settings, not standards. Do not make browser-support or performance claims you have not verified.
- Chinese text is natural Simplified Chinese. Use the commonly used Chinese name where one exists instead of a literal translation. Summaries describe visible behavior, not code.

## Schema stability
- The Effect type is a public contract. After Stage 1, change it only with human approval, additively, and update the validation test and every entry in the same change.

## Reporting format (end of every task, also appended to docs/PROGRESS.md)
1. Summary. 2. Files changed. 3. Commands run and their results. 4. Acceptance checklist with pass or fail and the evidence. 5. Deviations from the spec. 6. Open questions and proposed spec changes. 7. Next step.

## Stop and ask when
- The spec is ambiguous or contradicts itself.
- You need a new dependency, a schema change, or anything that looks like it needs a backend.
- A test still fails after two honest attempts and you do not understand why.
- A command would be destructive or irreversible.
- You would otherwise exceed the task scope.
```

### G3. How to run the stages with dot

- Prepend the standard wrapper (H0) to every stage prompt from section E and to the prompts below.
- One stage per dot session or branch. When a session ends, the next one starts with the resume prompt (H5).
- After each stage, run the independent review (H6) in a fresh session, because an agent checking its own work tends to confirm it.
- You merge. Dot never merges its own branch.

## H. Prompts for dot

These are site-build instructions for dot. They are separate from the effect prompts that visitors copy from the finished website.

### H0. Standard wrapper (paste above every stage prompt)

```text
Follow AGENTS.md strictly. Read AGENTS.md, docs/ROADMAP.md and the last five entries of docs/PROGRESS.md first. Work on a new branch named as AGENTS.md requires. Do only the task below and nothing else. When finished, run typecheck, lint, test and build, then give the report in the format defined in AGENTS.md and append it to docs/PROGRESS.md. Do not merge. Stop and ask if anything in the task conflicts with AGENTS.md or docs/SPEC.md.

Task:
[paste the stage prompt here]
```

### H1. Kickoff prompt (Stage 0): start here

Before sending it, place AGENTS.md, docs/SPEC.md and docs/ROADMAP.md in the repository (G1).

```text
This is the start of a long-running project, so this task is setup and understanding only. Do not scaffold the application and do not write any feature code.

1. Read AGENTS.md, docs/SPEC.md and docs/ROADMAP.md completely.
2. Reply with a summary of at most 20 lines: what the product is, the stage order, what the first stage will deliver, and the six rules in AGENTS.md you consider most important. Then list every ambiguity, contradiction or risk you found between the three files. Do not resolve them yourself; list them.
3. Create docs/PROGRESS.md with these sections: Current stage, Log (newest first; each entry has date, stage, summary, files changed, commands run and results, deviations, next step), Observations, Proposed spec changes, Decisions awaiting human. Add a first log entry for this setup task.
4. Add .gitignore (node_modules, dist, coverage, .env, editor folders, OS files) and .editorconfig (UTF-8, LF line endings, 2-space indent, final newline).
5. Add .github/pull_request_template.md containing the reporting format from AGENTS.md and a checklist of the acceptance criteria of the stage being delivered.
6. Commit these files on a branch named stage-0-governance. Do not merge.

Completion criteria: the files above exist, no application code exists, your summary and list of ambiguities are in your reply and in PROGRESS.md. Then stop and wait for my approval before Stage 1.
```

### H2. Stage 6 prompt: Launch v1.0 (the final MVP stage)

Before sending it, replace the bracketed placeholders and complete the human tasks in F3 that apply (domain, hosting account, share image).

```text
Goal: make the finished site production-ready and publish version 1.0 with an automated, repeatable deployment.

Context: docs/SPEC.md, docs/ROADMAP.md (Stage 6), and the completed Stages 1 to 5. Do not add features or effects.

Inputs from me (already decided): hosting provider: [Cloudflare Pages | Vercel | Netlify | GitHub Pages]; production domain: [example.com]; site name: [final name]; share image: public/og-image.png (provided); feedback contact: [email or issue tracker URL]; code license: [license]; content terms: [short statement].

Scope (do):
1. Single-page-app routing on the chosen host: add the host’s rewrite or redirect configuration so direct visits to /effects/:slug and /guide work, and unknown routes show the Not Found page with a proper 404 status where the host supports it.
2. Prerendering: generate static HTML at build time for /, /guide and every published /effects/:slug, so crawlers and link previews receive real content, then hydrate on the client. Prefer a small custom build script or a well-maintained Vite prerender plugin; if you need a new dependency, stop and ask. Demos must still work after hydration, and no content may differ between the prerendered and hydrated views.
3. Per-page metadata: title in the form Chinese name, English name, site name; meta description from the effect summary; canonical URL; lang attribute; Open Graph and Twitter card tags using og-image.png; favicon and web app manifest.
4. Generate sitemap.xml and robots.txt at build time from the content index (published effects only).
5. Security and caching headers in the host’s configuration format: Content-Security-Policy restricted to the site’s own origin (allow inline styles only if the demos require them, and document why), X-Content-Type-Options, Referrer-Policy, Permissions-Policy that disables unused features, long immutable caching for hashed assets and no-cache for HTML. Test the whole site under this policy and fix any violation.
6. Resilience: a React error boundary around each demo so one failing demo does not break the page, and a friendly fallback message in Chinese.
7. Footer and small static pages or sections: a plain-language privacy statement (the site collects no personal data; the language choice is stored locally in the browser), the code license, the content terms, a feedback link, and a note that product and design-language names are used only as names.
8. CI with GitHub Actions: on every pull request run install with a clean lockfile, typecheck, lint, test, build, and a Lighthouse CI check on the Library and one detail page with minimum scores of accessibility 95, best practices 95, SEO 95 and mobile performance 85. On merge to main, deploy to production using the host’s official integration. Use pull request preview deployments if the host supports them. Do not put secrets in the repository; document which secrets or settings I must add in the hosting and GitHub dashboards.
9. Documentation: docs/RELEASE.md with the exact steps for deploy, rollback, domain and HTTPS setup, how to verify a release, and a post-release smoke-test checklist; CHANGELOG.md with a 1.0.0 entry; update the README.
10. Tag the release candidate as v1.0.0-rc.1 on the release branch. Do not tag v1.0.0 and do not deploy to production yourself.

Out of scope: analytics, backend, new effects, redesign, dependency upgrades unrelated to this task.

Completion criteria:
- Build, type-check, lint and tests pass; the CI workflow file is valid and passes on the branch.
- Opening a built effect page directly, with JavaScript disabled, shows the effect name, aliases, descriptions and the prompt text; with JavaScript enabled the demo works.
- sitemap.xml lists every published effect, and robots.txt references it.
- Direct visits and page refreshes work for every route on the preview deployment, and an unknown URL shows the Not Found page.
- The site works with the CSP applied; there are no console errors on the Library and three representative detail pages.
- Lighthouse thresholds above are met and reported.
- docs/RELEASE.md lets someone else deploy and roll back without asking questions.
- A list titled Human tasks remaining (domain, DNS, secrets, search console verification, final read-through of all 18 entries) is included in your report.
```

### H3. Content wave template (Stage 7, reusable)

Fill the bracketed parts for each wave.

```text
Goal: add content wave [N]: these [6 to 8] effects: [slug: Chinese name, English name, category, type, trigger, one-sentence description of the exact behavior, suggested default values] (repeat for each).

Context: docs/SPEC.md sections 5 to 9, AGENTS.md effect quality rules, and the existing effects as the quality bar. Do not modify shared components, the schema, or existing effects, except to fix a real bug, which you must report separately.

For each effect: create the content file, the bilingual prompts (SPEC section 8), the working demo with compact preview mode, the registry entry and the params; add everyday search phrases and aliases in both languages and any new synonym groups; add one acceptance query per effect to the search tests; add terminology notes where names vary, saying plainly that naming varies where it does. Where you are unsure about a commonly used name, do not guess: write the best-supported names, mark the doubt in PROGRESS.md under Decisions awaiting human, and keep the terminology note cautious.

Completion criteria: validation, search and regression tests pass, including all earlier acceptance queries; every new demo performs its labelled behavior and meets the reduced-motion, keyboard and touch rules; gallery and detail pages render all new effects; no new dependencies. Report the list of terminology doubts for my review.
```

### H4. Prompt quality self-test (Stage 9 starter)

```text
Goal: test whether each effect’s English copy prompt actually reproduces its demo, and report gaps. Do not change any content file in this task.

For each of the [list of slugs]: in a scratch folder outside the repository, take the English prompt exactly as it appears at default parameter values and implement it in a minimal HTML, CSS and JavaScript page, using only that text. Then compare your result with the site’s demo against this checklist: correct element, correct trigger, visual changes match, timing and easing close to the demo, touch and keyboard behavior, reduced-motion behavior. Write one file per effect in docs/prompt-evals/<slug>.md with the result (match, partial or miss), what the prompt failed to say, and a proposed replacement sentence. Then write docs/prompt-evals/SUMMARY.md with a table of all results.

Note: this is a first-pass check with one agent. I will also test the prompts in other AI tools myself.
```

### H5. Session resume prompt

```text
Resume work on this project. Read AGENTS.md, docs/ROADMAP.md and the last five entries of docs/PROGRESS.md. Run git status, git branch and the test command. Do not change any file. Reply with: the current stage, what is done, what is half-finished, the exact next step, and anything blocked on me. Then wait for instructions.
```

### H6. Independent stage review (run in a fresh session after each stage)

```text
Review mode. Do not modify any file. Review the branch [branch name] against docs/SPEC.md and AGENTS.md for Stage [N]. Check each completion criterion of the stage independently by running the code and tests, not by reading the previous report. Look especially for: scope creep, new dependencies, weakened or skipped tests, placeholder demos, animation of properties other than transform and opacity, missing reduced-motion or keyboard behavior, prompts that omit the trigger or timing values, terminology claims that are too confident, and anything in the prohibited list. Report findings ordered by severity with file and line references, and finish with a clear verdict: ready to merge, ready after fixes, or not ready.
```

### H7. Order of use

1.  Place AGENTS.md, docs/SPEC.md and docs/ROADMAP.md in the repo; send H1 (kickoff).
2.  For each of Stages 1 to 5: wrapper H0 plus the stage prompt from section E, then review H6, then you merge.
3.  Complete the human tasks (F3), then Stage 6 with H0 plus H2, review H6, then you deploy and tag v1.0.0 yourself following docs/RELEASE.md.
4.  Run content waves with H0 plus H3, and start Stage 8 or Stage 9 prompts only when their gates in F1 are met. Ask me and I will write those prompts then, using the real state of the project.
