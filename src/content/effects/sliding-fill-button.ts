import type { Effect } from '../../types';
export const slidingFillButton: Effect = {
  "id": "sliding-fill-button",
  "slug": "sliding-fill-button",
  "status": "published",
  "name": {
    "en": "Sliding Fill Button",
    "zh": "滑动填充按钮"
  },
  "aliases": {
    "en": [
      "slide fill hover",
      "button fill sweep"
    ],
    "zh": [
      "滑入填色按钮",
      "悬停填充"
    ]
  },
  "searchPhrases": {
    "en": [
      "a button fills from left to right on hover",
      "slide a color behind button text",
      "an outlined button fills when focused"
    ],
    "zh": [
      "鼠标移入按钮背景从左边填满",
      "按钮聚焦时滑入颜色",
      "移开按钮背景从右边退出"
    ]
  },
  "category": "buttons",
  "type": "interaction",
  "triggers": [
    "hover"
  ],
  "tags": [
    "slide fill hover",
    "button fill sweep",
    "滑入填色按钮",
    "悬停填充"
  ],
  "summary": "填色从左侧滑入，离开时从右侧退出。",
  "whatYouSee": "描边按钮在悬停或聚焦时被强调色填满，文字同时变白。移开后填色从右侧退走，恢复描边。",
  "behavior": [
    "悬停、聚焦或轻触激活填色。",
    "填充层从左边 scaleX 0 到 1，文字即时切换白色。",
    "离开时变换原点改到右侧，填充缩回；轻触或键盘激活可切换。"
  ],
  "useCases": [
    "主要行动入口",
    "表单操作按钮"
  ],
  "terminologyNote": "Sliding fill、slide fill hover 都是描述性名称，不是统一术语。它移动的是背景填充层，而不是按钮本身；宽度参数只用于调整演示对象尺寸。",
  "related": [
    "ripple-button",
    "magnetic-button"
  ],
  "demo": {
    "component": "SlidingFillButton",
    "hint": "悬停或聚焦填色，点击或 Enter / Space 切换。",
    "hintTouch": "轻触切换填色，或按自动演示。",
    "replayable": false,
    "autoDemo": true
  },
  "params": [
    {
      "key": "duration",
      "label": "填充时长",
      "kind": "number",
      "default": 300,
      "min": 100,
      "max": 800,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "width",
      "label": "按钮宽度",
      "kind": "number",
      "default": 160,
      "min": 120,
      "max": 240,
      "step": 10,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a sliding-fill outlined button.\nElement: a {{width}} wide, 52 px tall button with an indigo border and white resting background.\nTrigger: hover or focus fills it; tap, Enter or Space toggles the visible fill. Leaving hover/focus clears it unless pinned by activation.\nMotion (suggested values): scale the accent layer from scaleX(0) to scaleX(1) with a left transform origin over {{duration}} ease-out; on leave switch the origin to the right and scale back to 0. Switch the text to white immediately while filled.\nImplementation: animate transform only on an independent background layer, keep text fixed above it; color changes are instant, not color animations. Width is a sizing control with a suggested default of 160 px.\nAccessibility: prefers-reduced-motion does not animate on hover/focus; direct activation changes the state instantly, while explicit Auto demo runs one finite path. Use visible keyboard focus and tap controls without navigation, preserving vertical touch scrolling.",
    "zh": "请实现一个滑动填充的描边按钮。\n作用对象：宽 {{width}}、高 52 px 的按钮，靛蓝描边，静止背景为白色。\n触发方式：悬停或聚焦时填充；轻触、Enter 或空格切换可见填充。悬停或焦点离开时清除填充，主动激活固定的状态除外。\n运动细节（建议值）：强调色背景层以左侧为变换原点，从 scaleX(0) 到 scaleX(1)，时长 {{duration}}、ease-out；离开时原点改到右侧并缩回 0。填充时文字即时切为白色。\n实现要求：独立背景层只动画 transform，文字固定在其上；颜色即时切换，不做颜色动画。宽度仅调试对象尺寸，建议默认 160 px。\n兜底：prefers-reduced-motion 下悬停与聚焦不自动运动，直接激活即时切换状态，明确按下自动演示时运行一次有限路径。保留清晰焦点、键盘和轻触操作，不导航且允许纵向触屏滚动。"
  }
};
