import type { Effect } from '../../types';
export const spotlightCard: Effect = {
  "id": "spotlight-card",
  "slug": "spotlight-card",
  "status": "published",
  "name": {
    "en": "Spotlight Card",
    "zh": "聚光卡片"
  },
  "aliases": {
    "en": [
      "spotlight hover",
      "cursor glow card"
    ],
    "zh": [
      "光斑跟随卡片",
      "聚光灯卡片"
    ]
  },
  "searchPhrases": {
    "en": [
      "a card that follows my mouse",
      "a light follows the cursor across a dark card",
      "move a glow around a card"
    ],
    "zh": [
      "鼠标在卡片上移动时光斑跟着动",
      "卡片上的光斑跟随鼠标",
      "移动指针照亮卡片边缘"
    ]
  },
  "category": "cards",
  "type": "interaction",
  "triggers": [
    "pointer-follow"
  ],
  "tags": [
    "spotlight hover",
    "cursor glow card",
    "光斑跟随卡片",
    "聚光灯卡片"
  ],
  "summary": "柔和光斑跟随指针，在深色卡片和边缘上游走。",
  "whatYouSee": "卡片本身保持静止，白色光斑随指针移动。靠近边缘时，局部边框也会变亮。",
  "behavior": [
    "进入卡片后在 200ms 内显现光斑，离开时淡出。",
    "指针、方向键或手指拖动改变光斑中心，卡片不倾斜。",
    "调节半径与亮度改变光的覆盖范围和强弱。"
  ],
  "useCases": [
    "功能介绍卡片",
    "深色内容入口"
  ],
  "terminologyNote": "Spotlight hover、cursor glow 都可描述这类局部照明。它与 3D Tilt 的区别是移动光而非卡片，不存在唯一官方名称。",
  "related": [
    "card-tilt-3d",
    "card-flip"
  ],
  "demo": {
    "component": "SpotlightCard",
    "hint": "移动指针或聚焦后按方向键移动光斑，Escape 复位。",
    "hintTouch": "手指拖动光斑，或按自动演示。",
    "replayable": false,
    "autoDemo": true
  },
  "params": [
    {
      "key": "radius",
      "label": "光斑半径",
      "kind": "number",
      "default": 240,
      "min": 100,
      "max": 400,
      "step": 10,
      "unit": "px"
    },
    {
      "key": "intensity",
      "label": "光斑强度",
      "kind": "number",
      "default": 0.18,
      "min": 0.05,
      "max": 0.4,
      "step": 0.01
    }
  ],
  "prompt": {
    "en": "Build a pointer-follow spotlight card.\nElement: a 320 by 200 px dark #18181B card with readable white text.\nTrigger: pointer entry, keyboard focus or touch drag reveals a soft radial highlight; leaving fades it out.\nVisual and motion details (suggested values): a white highlight with radius {{radius}} and intensity {{intensity}}, centered at CSS variables --x and --y; fade in and out over 200ms. Brighten only the nearby border as the light moves.\nImplementation: cache the card bounds outside pointer handlers; translate a radial-gradient layer with transform and fade its opacity, with a clipped border layer. Keep the card itself stationary and the highlight behind the text.\nAccessibility: prefers-reduced-motion leaves the card static until explicit Auto demo runs one finite path. Provide visible focus, arrow keys to position the light and Escape to clear it; support touch dragging and an Auto demo button without navigation, and preserve vertical scrolling.",
    "zh": "请实现一张光斑跟随指针的聚光卡片。\n作用对象：320 × 200 px、背景 #18181B 的深色卡片，白色文字保持清晰。\n触发方式：指针进入、键盘聚焦或手指拖动显示柔和径向高光，离开时淡出。\n画面与运动细节（建议值）：白色光斑半径 {{radius}}、强度 {{intensity}}，中心使用 CSS 变量 --x 与 --y；显现和消失均为 200ms，靠近指针的局部边框也变亮。\n实现要求：在指针处理函数外缓存卡片边界，使用 transform 平移径向渐变层、opacity 淡入淡出，并用裁剪层照亮边框。卡片本身不移动，光斑放在文字后面。\n兜底：prefers-reduced-motion 下保持静止，明确按下自动演示才运行一次有限路径。键盘须有清晰焦点，方向键移动光斑、Escape 清除；触屏拖动或自动演示均可体验，不导航且允许纵向滚动。"
  }
};
