import type { Effect } from '../../types';
export const pulsingDotsLoader: Effect = {
  "id": "pulsing-dots-loader",
  "slug": "pulsing-dots-loader",
  "status": "published",
  "name": {
    "en": "Pulsing Dots Loader",
    "zh": "脉动圆点加载"
  },
  "aliases": {
    "en": [
      "three dot loader",
      "pulsing loading indicator"
    ],
    "zh": [
      "三点加载",
      "呼吸圆点"
    ]
  },
  "searchPhrases": {
    "en": [
      "three dots pulse while waiting",
      "loading dots grow and fade in turn",
      "a row of dots breathes slowly"
    ],
    "zh": [
      "三个点轮流变大变亮",
      "等待时圆点呼吸闪动",
      "加载中的三个圆点"
    ]
  },
  "category": "loading",
  "type": "animation",
  "triggers": [
    "continuous"
  ],
  "tags": [
    "pulsing-dots-loader",
    "three dot loader",
    "pulsing loading indicator"
  ],
  "summary": "三个圆点错开节奏放大、变亮，再缩小、变暗。",
  "whatYouSee": "圆点保持水平排列，各自在原位呼吸般缩放。它们以相同节奏错峰运动，不会把周围内容挤动。",
  "behavior": [
    "可见时按错开的延迟启动。",
    "圆点从 0.6 倍到 1 倍、透明度 0.4 到 1 往返。",
    "暂停或离屏时冻结，减少动态时保持静止。"
  ],
  "useCases": [
    "等待响应",
    "按钮加载提示"
  ],
  "terminologyNote": "Pulsing dots 描述原位缩放与亮度变化；它不同于上下弹跳的 bouncing dots。加载提示不代表实际进度。",
  "related": [
    "skeleton-shimmer",
    "typewriter"
  ],
  "demo": {
    "component": "PulsingDotsLoader",
    "hint": "观察圆点呼吸，可暂停",
    "hintTouch": "点击播放或暂停",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "size",
      "label": "圆点大小",
      "kind": "number",
      "default": 10,
      "min": 6,
      "max": 24,
      "step": 1,
      "unit": "px"
    },
    {
      "key": "duration",
      "label": "呼吸周期",
      "kind": "number",
      "default": 1.2,
      "min": 0.6,
      "max": 2.4,
      "step": 0.1,
      "unit": "s"
    }
  ],
  "prompt": {
    "en": "Build a Pulsing Dots Loader effect.\nElement: three {{size}} dots in a row, inside role=status with a visually hidden loading label.\nTrigger: continuous while visible.\nBehavior: each dot pulses in place between scale 0.6 and 1, opacity 0.4 and 1, with delays 0, 150ms and 300ms.\nMotion (suggested values): {{duration}} ease-in-out infinite, transform and opacity only; reserve layout size and pause off-screen. Hide decorative dots from screen readers.\nFallbacks: prefers-reduced-motion keeps static dots; keyboard- and touch-accessible Play runs each dot once and stops after the last, with visible focus on controls.",
    "zh": "请实现脉动圆点加载效果。\n作用对象：一排三个 {{size}} 圆点，容器使用 role=status，含视觉隐藏的“加载中”标签。\n触发方式：可见时持续播放。\n行为：每点在原位由 0.6 倍到 1 倍、透明度 0.4 到 1 往返，分别延迟 0、150ms、300ms。\n动效参数（建议值）：{{duration}} ease-in-out 循环，仅 transform 和 opacity；预留布局尺寸，离屏暂停，装饰圆点对读屏隐藏。\n兜底：prefers-reduced-motion 保持静态圆点；键盘或触屏 Play 可让各点播放一次，最后一个结束后停止，控件保留清晰焦点。"
  }
};
