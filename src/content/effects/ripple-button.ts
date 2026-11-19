import type { Effect } from '../../types';
export const rippleButton: Effect = {
  "id": "ripple-button",
  "slug": "ripple-button",
  "status": "published",
  "name": {
    "en": "Ripple Button",
    "zh": "水波纹按钮"
  },
  "aliases": {
    "en": [
      "click ripple",
      "ripple effect"
    ],
    "zh": [
      "点击涟漪",
      "水波反馈"
    ]
  },
  "searchPhrases": {
    "en": [
      "a ripple spreads from the button click",
      "a circle grows under my finger on a button",
      "click a button to make a fading wave"
    ],
    "zh": [
      "点击按钮出现水波纹",
      "按钮从点击位置扩散圆圈",
      "手指点下按钮涟漪渐渐消失"
    ]
  },
  "category": "buttons",
  "type": "interaction",
  "triggers": [
    "click"
  ],
  "tags": [
    "click ripple",
    "ripple effect",
    "点击涟漪",
    "水波反馈"
  ],
  "summary": "从点击位置扩散出圆形水波，随后淡出。",
  "whatYouSee": "按下按钮，圆形高光从接触点向外扩散。圆圈覆盖按钮后消失，不改变按钮的位置。",
  "behavior": [
    "点击或轻触时记录起点，键盘 Enter 或空格从中心开始。",
    "圆圈从 scale 0 扩散至覆盖按钮，同时透明度降到零。",
    "动画完成移除圆圈，重复点击可产生独立的波纹。"
  ],
  "useCases": [
    "按钮操作确认",
    "局部点击反馈"
  ],
  "terminologyNote": "Ripple effect 常译作水波纹或涟漪反馈。这里是按钮内的圆形扩散，不是水面模拟。起始透明度来自规范的 35%，只是强度调试参数。",
  "related": [
    "magnetic-button",
    "sliding-fill-button"
  ],
  "demo": {
    "component": "RippleButton",
    "hint": "点击任意位置，或用 Enter / Space 从中心播放水波纹。",
    "hintTouch": "轻触按钮，从接触点播放一圈水波。",
    "replayable": false,
    "autoDemo": false
  },
  "params": [
    {
      "key": "duration",
      "label": "扩散时长",
      "kind": "number",
      "default": 600,
      "min": 200,
      "max": 1200,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "opacity",
      "label": "起始透明度",
      "kind": "number",
      "default": 0.35,
      "min": 0.1,
      "max": 0.6,
      "step": 0.05
    }
  ],
  "prompt": {
    "en": "Build a ripple button.\nElement: an overflow-hidden button containing temporary circular highlight layers.\nTrigger: click or tap starts a circle at the contact point; Enter or Space starts it at the center.\nMotion (suggested values): expand from scale 0 until the circle covers the button, fading from opacity {{opacity}} to 0 over {{duration}} with ease-out. Remove each circle after completion.\nImplementation: animate transform and opacity only, use cached bounds to calculate the click point and coverage, keep overlapping ripples independent, and clean up timers on unmount or off-screen suspension.\nAccessibility: prefers-reduced-motion disables spatial expansion and gives one finite opacity fade per explicit activation. Keep visible focus and native keyboard activation, and support tap without navigation while preserving vertical touch scrolling.",
    "zh": "请实现一个水波纹按钮。\n作用对象：overflow hidden 的按钮，内部包含短暂存在的圆形高光层。\n触发方式：点击或轻触从接触点生成圆圈，Enter 或空格从按钮中心开始。\n运动细节（建议值）：从 scale 0 扩展到覆盖整个按钮，不透明度从 {{opacity}} 降到 0，时长 {{duration}}，缓动 ease-out；完成后移除每个圆圈。\n实现要求：只动画 transform 与 opacity，通过缓存的边界计算起点与覆盖大小，重复点击的波纹各自独立，卸载或离屏暂停时清理计时器。\n兜底：prefers-reduced-motion 下不做空间扩散，每次明确激活仅运行一次有限的透明度淡出。保留清晰焦点和原生键盘操作，触屏轻触不导航且允许纵向滚动。"
  }
};
