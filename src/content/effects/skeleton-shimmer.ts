import type { Effect } from '../../types';
export const skeletonShimmer: Effect = {
  "id": "skeleton-shimmer",
  "slug": "skeleton-shimmer",
  "status": "published",
  "name": {
    "en": "Skeleton Shimmer",
    "zh": "骨架屏扫光"
  },
  "aliases": {
    "en": [
      "skeleton screen",
      "loading placeholder"
    ],
    "zh": [
      "骨架加载",
      "占位扫光"
    ]
  },
  "searchPhrases": {
    "en": [
      "grey placeholder bars with moving light",
      "a loading layout with a sweeping highlight",
      "content placeholders shimmer while loading"
    ],
    "zh": [
      "加载时灰色条闪光",
      "灰色占位条上有亮光扫过",
      "内容出来前显示骨架屏"
    ]
  },
  "category": "loading",
  "type": "animation",
  "triggers": [
    "continuous"
  ],
  "tags": [
    "skeleton-shimmer",
    "skeleton screen",
    "loading placeholder"
  ],
  "summary": "头像与文字的灰色占位块上，亮带循环扫过，提示内容仍在加载。",
  "whatYouSee": "圆形头像和三行灰条模拟即将出现的内容结构。亮带从左向右经过，切换加载完成后显示真实文字。",
  "behavior": [
    "可见时亮带沿占位块从左向右移动。",
    "切换加载完成，真实内容淡入。",
    "恢复加载可再次查看扫光，离屏暂停。"
  ],
  "useCases": [
    "列表加载",
    "个人资料占位"
  ],
  "terminologyNote": "Skeleton screen 描绘内容的大致结构；spinner 或 dots 只表示等待，不预示具体布局。这里的开关是演示，不发起请求。",
  "related": [
    "pulsing-dots-loader",
    "gradient-text-shimmer"
  ],
  "demo": {
    "component": "SkeletonShimmer",
    "hint": "切换加载状态，观察亮带",
    "hintTouch": "轻触开关查看加载完成内容",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "duration",
      "label": "扫光周期",
      "kind": "number",
      "default": 1.6,
      "min": 0.8,
      "max": 3,
      "step": 0.1,
      "unit": "s"
    },
    {
      "key": "bandWidth",
      "label": "亮带宽度",
      "kind": "number",
      "default": 40,
      "min": 20,
      "max": 60,
      "step": 5,
      "unit": "%"
    }
  ],
  "prompt": {
    "en": "Build a Skeleton Shimmer effect.\nElement: a #E7E5E4 skeleton with a 48px circular avatar and three bars at 100, 80 and 60 percent width.\nTrigger: continuous while visible and loading.\nBehavior: a light band sweeps left to right; a labelled toggle replaces placeholders with real content using a 200ms opacity fade.\nMotion (suggested values): {{duration}} linear infinite; band width {{bandWidth}}. Translate a pseudo-element with transform only, never animate background-position. Provide one screen-reader loading status and hide decorative blocks. Pause off-screen.\nFallbacks: prefers-reduced-motion displays static placeholders and switches content instantly; keyboard- and touch-accessible Play runs one sweep and stops, and the toggle always works with visible focus.",
    "zh": "请实现骨架屏扫光效果。\n作用对象：#E7E5E4 骨架屏，含 48px 圆形头像及宽度为 100%、80%、60% 的三行占位条。\n触发方式：可见且加载中时持续循环。\n行为：亮带从左向右扫过；带标签的开关用 200ms opacity 淡入替换为真实内容。\n动效参数（建议值）：{{duration}} linear 循环，亮带宽度 {{bandWidth}}。用伪元素 transform 平移，不动画 background-position。仅提供一个读屏加载状态，装饰占位块隐藏；离屏暂停。\n兜底：prefers-reduced-motion 显示静态占位并即时切换内容；键盘或触屏 Play 可运行一次扫光后停止，开关始终可用且有明显焦点。"
  }
};
