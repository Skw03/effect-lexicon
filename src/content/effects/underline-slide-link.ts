import type { Effect } from '../../types';
export const underlineSlideLink: Effect = {
  "id": "underline-slide-link",
  "slug": "underline-slide-link",
  "status": "published",
  "name": {
    "en": "Underline Slide Link",
    "zh": "滑入下划线"
  },
  "aliases": {
    "en": [
      "animated underline",
      "sliding link underline"
    ],
    "zh": [
      "链接下划线",
      "导航下划线动画"
    ]
  },
  "searchPhrases": {
    "en": [
      "an underline slides in below a link",
      "navigation links draw a line on hover",
      "a line exits to the right under text"
    ],
    "zh": [
      "导航链接下面划线滑出来",
      "鼠标移到链接上出现横线",
      "下划线从左边长出来"
    ]
  },
  "category": "navigation",
  "type": "interaction",
  "triggers": [
    "hover"
  ],
  "tags": [
    "underline-slide-link",
    "animated underline",
    "sliding link underline"
  ],
  "summary": "悬停或聚焦链接时，下划线从左侧展开，离开时向右收起。",
  "whatYouSee": "四个导航标签下各有一条细线。线条从左侧展开，离开时向右侧收起，文字始终不动。",
  "behavior": [
    "悬停或键盘聚焦一个标签。",
    "下划线向右展开，离开后向右收起。",
    "点击或轻触切换，演示不会跳转页面。"
  ],
  "useCases": [
    "导航菜单",
    "文字链接反馈"
  ],
  "terminologyNote": "这类效果常叫 animated underline 或 underline reveal；它不同于在多个标签间移动的选中指示条。",
  "related": [
    "sliding-fill-button",
    "shrinking-sticky-header"
  ],
  "demo": {
    "component": "UnderlineSlideLink",
    "hint": "悬停或聚焦标签体验",
    "hintTouch": "轻触标签切换下划线",
    "replayable": false,
    "autoDemo": true
  },
  "params": [
    {
      "key": "duration",
      "label": "展开时长",
      "kind": "number",
      "default": 250,
      "min": 100,
      "max": 600,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "thickness",
      "label": "线条粗细",
      "kind": "number",
      "default": 2,
      "min": 1,
      "max": 6,
      "step": 1,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a Underline Slide Link effect.\nElement: four navigation links in a row.\nTrigger: hover or keyboard focus, with tap toggling the same state; this demo prevents navigation.\nBehavior: a line expands from the left with scaleX(0) to scaleX(1), and exits toward the right on leave.\nMotion (suggested values): {{duration}} ease-out; thickness {{thickness}}. Animate only transform; text stays still.\nFallbacks: prefers-reduced-motion changes the line instantly; keyboard focus has a visible outline and Enter activates the link; touch toggles it. Auto demo runs a finite pointer path and returns to rest.",
    "zh": "请实现滑入下划线效果。\n作用对象：一排四个导航链接。\n触发方式：鼠标悬停或键盘聚焦，轻触切换相同状态；演示不实际导航。\n行为：下划线从左侧以 scaleX(0) 到 scaleX(1) 展开，离开时向右侧收起。\n动效参数（建议值）：{{duration}} ease-out，粗细 {{thickness}}。只对 transform 做动画，文字不动。\n兜底：prefers-reduced-motion 下即时切换线条；键盘焦点有明显轮廓，Enter 可激活链接，触屏轻触可切换。Auto demo 只运行一次有限指针路径并回到静止。"
  }
};
