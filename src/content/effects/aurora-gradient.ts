import type { Effect } from '../../types';
export const auroraGradient: Effect = {
  "id": "aurora-gradient",
  "slug": "aurora-gradient",
  "status": "published",
  "name": {
    "en": "Aurora Gradient",
    "zh": "流动极光背景"
  },
  "aliases": {
    "en": [
      "aurora background",
      "moving gradient blobs"
    ],
    "zh": [
      "极光渐变",
      "流动色团"
    ]
  },
  "searchPhrases": {
    "en": [
      "colorful blobs slowly drift behind a heading",
      "a soft glowing background that moves",
      "a flowing aurora behind text"
    ],
    "zh": [
      "彩色流动的背景",
      "模糊的色团缓缓漂浮",
      "像极光一样的背景"
    ]
  },
  "category": "backgrounds",
  "type": "animation",
  "triggers": [
    "continuous"
  ],
  "tags": [
    "aurora-gradient",
    "aurora background",
    "moving gradient blobs"
  ],
  "summary": "几团柔和的彩色光晕缓慢漂移、缩放，形成流动的背景。",
  "whatYouSee": "紫色、青色和粉色光团交叠，边缘柔和模糊。标题留在前景，不跟着光团移动。",
  "behavior": [
    "可见时光团缓慢漂移并缩放。",
    "不同相位交错往返，离屏或暂停时停止。"
  ],
  "useCases": [
    "首页主视觉",
    "活动标题背景"
  ],
  "terminologyNote": "Aurora gradient 常用来描述柔和流动的彩色光团，并非统一标准；普通渐变不一定有独立光团的漂移。",
  "related": [
    "glassmorphism",
    "gradient-text-shimmer"
  ],
  "demo": {
    "component": "AuroraGradient",
    "hint": "观察色团漂移，可暂停或重播",
    "hintTouch": "点击播放或暂停",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "duration",
      "label": "漂移周期",
      "kind": "number",
      "default": 16,
      "min": 8,
      "max": 30,
      "step": 1,
      "unit": "s"
    },
    {
      "key": "blur",
      "label": "模糊半径",
      "kind": "number",
      "default": 60,
      "min": 20,
      "max": 120,
      "step": 5,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a Aurora Gradient effect.\nElement: a full-width dark stage with three large violet #7C3AED, cyan #06B6D4 and pink #F472B6 blobs behind a centered white heading.\nTrigger: continuous while visible.\nBehavior: independently drift and scale the blurred blobs with offset phases, ease-in-out alternate; keep the heading still above a dark overlay.\nMotion (suggested values): base duration {{duration}}, with 0.9 and 1.1 duration multipliers; static blur {{blur}}. Animate transform only, never the blur; pause off-screen.\nFallbacks: prefers-reduced-motion shows a static composition; keyboard- and touch-accessible Play runs one finite base-duration demonstration, then stops. Keep visible focus on controls.",
    "zh": "请实现流动极光背景效果。\n作用对象：全宽深色舞台中，紫色 #7C3AED、青色 #06B6D4、粉色 #F472B6 三个大光团位于居中白色标题后。\n触发方式：可见时持续播放。\n行为：各光团错开相位，以 ease-in-out 往返漂移并缩放；深色遮罩上的标题保持静止。\n动效参数（建议值）：基础周期 {{duration}}，另两团采用 0.9 与 1.1 倍周期；静态模糊 {{blur}}。只动画 transform，不动画模糊；离屏暂停。\n兜底：prefers-reduced-motion 显示静态构图；键盘或触屏点击 Play 只播放一个基础周期后停止，控件保留清晰焦点。"
  }
};
