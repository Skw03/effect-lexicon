import type { Effect } from '../../types';
export const gradientTextShimmer: Effect = {
  "id": "gradient-text-shimmer",
  "slug": "gradient-text-shimmer",
  "status": "published",
  "name": {
    "en": "Gradient Text Shimmer",
    "zh": "渐变文字扫光"
  },
  "aliases": {
    "en": [
      "text shine",
      "gradient text sweep"
    ],
    "zh": [
      "文字流光",
      "文字高光扫过"
    ]
  },
  "searchPhrases": {
    "en": [
      "a bright band sweeps across colorful text",
      "gradient heading with moving shine",
      "colored letters shimmer from left to right"
    ],
    "zh": [
      "彩色文字上有一道光扫过",
      "渐变标题从左到右闪过高光",
      "文字不动但亮光循环移动"
    ]
  },
  "category": "text",
  "type": "animation",
  "triggers": [
    "continuous"
  ],
  "tags": [
    "text shine",
    "gradient text sweep",
    "文字流光",
    "文字高光扫过"
  ],
  "summary": "一束高光掠过渐变标题，文字本身保持不动。",
  "whatYouSee": "标题始终完整显示靛蓝、紫色和粉色的渐变。明亮的光带从左到右扫过字形，形成流光感。",
  "behavior": [
    "可见时自动循环扫光，可暂停或重播。",
    "高光穿过固定字形，带宽调节亮区大小，时长调节扫描速度。",
    "减少动态时保留静态渐变，手动播放只扫过一次。"
  ],
  "useCases": [
    "展示型标题",
    "短句强调"
  ],
  "terminologyNote": "Text shimmer 或 text shine 指字形上的光泽变化，不等于逐字输出的 Typewriter。此处用固定字形裁剪移动高光，等效呈现渐变扫光，无需移动文字或动画背景位置。",
  "related": [
    "typewriter",
    "staggered-text-reveal"
  ],
  "demo": {
    "component": "GradientTextShimmer",
    "hint": "观察光带扫过文字；可暂停、播放或重播。",
    "hintTouch": "轻触播放或重播，体验一次扫光。",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "duration",
      "label": "扫光周期",
      "kind": "number",
      "default": 2.5,
      "min": 1,
      "max": 6,
      "step": 0.5,
      "unit": "s"
    },
    {
      "key": "bandWidth",
      "label": "高光带宽",
      "kind": "number",
      "default": 20,
      "min": 10,
      "max": 40,
      "step": 5,
      "unit": "%"
    }
  ],
  "prompt": {
    "en": "Build gradient text shimmer.\nElement: a large fixed heading filled with indigo, violet and pink.\nTrigger: continuous playback while visible; Pause freezes it and Replay restarts it.\nMotion (suggested values): a bright band {{bandWidth}} of the heading viewport width sweeps left to right every {{duration}}, linear and repeating. The text stays complete and stationary.\nImplementation: use a static gradient and a translated highlight clipped to the text outlines; SVG text clipping is an equivalent to background-clip text and avoids animating background-position. Animate transform only; pause off-screen and participate in the six-preview budget.\nAccessibility: under prefers-reduced-motion show the static gradient; explicit Play or Replay runs one sweep and stops. Expose the full heading once to assistive reading, keep visible focus on keyboard controls, and provide tap-accessible playback without navigation.",
    "zh": "请实现渐变文字扫光。\n作用对象：固定的大标题，字形填充靛蓝、紫色和粉色渐变。\n触发方式：可见时自动循环，暂停可冻结，重播从头开始。\n运动细节（建议值）：宽度为标题视口 {{bandWidth}} 的明亮光带每 {{duration}} 从左到右扫过一次，linear 匀速重复；文字始终完整且不移动。\n实现要求：静态渐变配合平移高光，用字形裁剪；SVG 文字裁剪等效呈现 background-clip text，避免动画 background-position。只动画 transform，离屏暂停，并遵守最多六个动态预览的预算。\n兜底：prefers-reduced-motion 下显示静态渐变，明确按下播放或重播时仅扫光一次后停止。完整标题只向辅助阅读提供一次，键盘播放控件有清晰焦点，触屏可轻触播放且不导航。"
  }
};
