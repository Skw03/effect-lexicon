import type { Effect } from '../../types';
export const scrollReveal: Effect = {
  "id": "scroll-reveal",
  "slug": "scroll-reveal",
  "status": "published",
  "name": {
    "en": "Scroll Reveal",
    "zh": "滚动渐显"
  },
  "aliases": {
    "en": [
      "scroll entrance animation",
      "reveal on scroll"
    ],
    "zh": [
      "滚动出现",
      "滚动淡入"
    ]
  },
  "searchPhrases": {
    "en": [
      "cards fade in as they enter the view",
      "content rises into view when scrolling",
      "items appear gradually down the page"
    ],
    "zh": [
      "向下滚动内容渐渐出现",
      "滑到卡片时卡片淡入",
      "内容边上移边出现"
    ]
  },
  "category": "scrolling",
  "type": "animation",
  "triggers": [
    "scroll"
  ],
  "tags": [
    "scroll-reveal",
    "scroll entrance animation",
    "reveal on scroll"
  ],
  "summary": "卡片进入滚动区时轻轻上移并淡入，每张只播放一次。",
  "whatYouSee": "六张卡片沿竖向排列，进入可见区域后从下方淡入。一起进入的卡片稍微错开，已出现的卡片不会反复闪现。",
  "behavior": [
    "卡片有 20% 进入容器时触发。",
    "从下方移动到原位，同时变得不透明。",
    "每张只触发一次，Replay 重置并自动滚动。"
  ],
  "useCases": [
    "内容列表",
    "分步介绍"
  ],
  "terminologyNote": "Scroll reveal 指进入可见区的显现动画，不等于随滚动进度持续移动的视差；触发阈值是示例设置。",
  "related": [
    "staggered-text-reveal",
    "parallax-scroll"
  ],
  "demo": {
    "component": "ScrollReveal",
    "hint": "向下滚动演示区，Replay 重置",
    "hintTouch": "在演示区向上滑动查看卡片",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "distance",
      "label": "上移距离",
      "kind": "number",
      "default": 24,
      "min": 0,
      "max": 60,
      "step": 2,
      "unit": "px"
    },
    {
      "key": "duration",
      "label": "显现时长",
      "kind": "number",
      "default": 600,
      "min": 200,
      "max": 1200,
      "step": 50,
      "unit": "ms"
    }
  ],
  "prompt": {
    "en": "Build a Scroll Reveal effect.\nElement: six content cards in a contained scroll stage.\nTrigger: an IntersectionObserver rooted in that stage sees 20 percent of a card.\nBehavior: reveal each card only once from opacity 0 and translateY({{distance}}) to opacity 1 and its original position; stagger cards entering together by 80ms.\nMotion (suggested values): {{duration}} ease-out; transform and opacity only. Replay resets cards and scrolls through the stage over 3000ms. Disconnect observers and cancel frames on unmount.\nFallbacks: prefers-reduced-motion shows all content immediately; explicit Replay runs one finite reveal pass. Keyboard arrows and PageDown scroll the region, Tab exits; touch scroll remains native and can continue into the page at the edge.",
    "zh": "请实现滚动渐显效果。\n作用对象：独立滚动舞台中的六张内容卡片。\n触发方式：以该容器为 root 的 IntersectionObserver 检测卡片有 20% 可见。\n行为：每张只显现一次，从 opacity 0、translateY({{distance}}) 到 opacity 1 和原位；同时进入的卡片错开 80ms。\n动效参数（建议值）：{{duration}} ease-out，只动画 transform 和 opacity。Replay 重置卡片并在 3000ms 内滚动一遍；卸载时断开观察器并取消帧。\n兜底：prefers-reduced-motion 下直接显示全部内容；手动 Replay 可播放一次显现。聚焦区域后方向键和 PageDown 可滚动，Tab 可退出；触屏采用原生滚动，边缘可继续滚动页面。"
  }
};
