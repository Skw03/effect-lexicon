import type { Effect } from '../../types';
export const magneticButton: Effect = {
  "id": "magnetic-button",
  "slug": "magnetic-button",
  "status": "published",
  "name": {
    "en": "Magnetic Button",
    "zh": "磁吸按钮"
  },
  "aliases": {
    "en": [
      "magnet button",
      "cursor attraction"
    ],
    "zh": [
      "磁性按钮",
      "按钮吸附"
    ]
  },
  "searchPhrases": {
    "en": [
      "a button is pulled toward the mouse",
      "move a button toward a nearby pointer",
      "a button springs back after hover"
    ],
    "zh": [
      "按钮被鼠标吸过去",
      "靠近按钮它就向指针移动",
      "鼠标离开按钮弹回原位"
    ]
  },
  "category": "buttons",
  "type": "interaction",
  "triggers": [
    "pointer-follow"
  ],
  "tags": [
    "magnet button",
    "cursor attraction",
    "磁性按钮",
    "按钮吸附"
  ],
  "summary": "指针靠近时按钮向它偏移，离开后轻轻弹回。",
  "whatYouSee": "按钮被附近的指针吸引，移动一小段距离。指针离开感应范围后，它带一点回弹回到原位。",
  "behavior": [
    "在按钮静止边缘附近进入感应半径。",
    "按指针相对按钮中心的偏移乘以吸附强度，最大位移 14px。",
    "离开感应范围后用 500ms 回弹；方向键、拖动和自动演示可体验相同吸附。"
  ],
  "useCases": [
    "主要操作按钮",
    "引导用户探索的入口"
  ],
  "terminologyNote": "Magnetic button 是常见的交互描述，强调朝指针移动，并非拖拽排序或真实物理模拟。吸附强度与半径是建议设置。",
  "related": [
    "ripple-button",
    "sliding-fill-button"
  ],
  "demo": {
    "component": "MagneticButton",
    "hint": "靠近按钮，或聚焦后用方向键移动目标；Escape 复位。",
    "hintTouch": "在按钮周围拖动，或按自动演示。",
    "replayable": false,
    "autoDemo": true
  },
  "params": [
    {
      "key": "strength",
      "label": "吸附强度",
      "kind": "number",
      "default": 0.35,
      "min": 0.1,
      "max": 0.6,
      "step": 0.05
    },
    {
      "key": "radius",
      "label": "感应半径",
      "kind": "number",
      "default": 80,
      "min": 40,
      "max": 160,
      "step": 10,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a magnetic button.\nElement: a 160 by 52 px button inside a pointer-sensitive area.\nTrigger: a pointer within {{radius}} of the resting button edge attracts it; keyboard focus and arrow keys or touch dragging provide the same target positions.\nMotion (suggested values): multiply the offset from the resting center by strength {{strength}}, cap the vector length at 14 px; follow with a short 100ms ease-out transition. Outside the radius or on leave, return over 500ms with cubic-bezier(0.34, 1.56, 0.64, 1).\nImplementation: animate transform only; cache resting bounds outside pointer handlers so the moving button cannot create feedback jitter.\nAccessibility: prefers-reduced-motion keeps the button still; explicit Auto demo runs one finite path and returns to rest. Preserve visible keyboard focus, arrow controls and Escape reset, touch dragging and vertical scrolling, with no navigation on demo activation.",
    "zh": "请实现一个磁吸按钮。\n作用对象：感应区域内一个 160 × 52 px 的按钮。\n触发方式：指针距离静止按钮边缘 {{radius}} 以内时产生吸附；聚焦后按方向键或手指拖动提供相同的目标位置。\n运动细节（建议值）：按钮中心到指针的偏移乘以吸附强度 {{strength}}，位移向量最大 14 px，跟随使用短暂的 100ms ease-out 过渡；超出半径或离开时，用 500ms 和 cubic-bezier(0.34, 1.56, 0.64, 1) 回弹。\n实现要求：只动画 transform，在指针处理函数外缓存静止边界，避免移动按钮自身导致反馈抖动。\n兜底：prefers-reduced-motion 下按钮保持静止，明确按下自动演示时运行一次有限路径并归位。保留清晰键盘焦点、方向键与 Escape 复位，支持触屏拖动和纵向滚动，演示激活不导航。"
  }
};
