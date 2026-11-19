import type { Effect } from '../../types';
export const cardFlip: Effect = {
  "id": "card-flip",
  "slug": "card-flip",
  "status": "published",
  "name": {
    "en": "Card Flip",
    "zh": "卡片翻转"
  },
  "aliases": {
    "en": [
      "flip card",
      "3D card flip"
    ],
    "zh": [
      "翻面卡片",
      "卡片翻牌"
    ]
  },
  "searchPhrases": {
    "en": [
      "click a card to turn it over",
      "show the back of a card on hover",
      "flip a card to read more"
    ],
    "zh": [
      "点一下卡片翻过来",
      "鼠标移入卡片显示背面",
      "点击卡片翻面查看说明"
    ]
  },
  "category": "cards",
  "type": "interaction",
  "triggers": [
    "hover",
    "click"
  ],
  "tags": [
    "flip card",
    "3D card flip",
    "翻面卡片",
    "卡片翻牌"
  ],
  "summary": "卡片翻过半圈，露出背面的补充说明。",
  "whatYouSee": "卡片像翻牌一样转过半圈，正面标题换成背面说明。再次点击可回到正面。",
  "behavior": [
    "鼠标悬停或键盘聚焦时展示背面；点击、Enter 或空格切换当前面。",
    "沿所选轴旋转 180 度；移开悬停或焦点时恢复，点击固定的背面仍保留。",
    "减少动态时不因悬停或焦点自动翻转，点击即时换面；自动演示可播放一次。"
  ],
  "useCases": [
    "信息卡片的补充说明",
    "学习卡片的问答"
  ],
  "terminologyNote": "Card flip 通常指正反两面的翻转；Tilt 只改变倾角，不显示另一面。名称并非唯一标准，轴选项 vertical 表示绕竖轴左右翻，horizontal 表示绕横轴上下翻。",
  "related": [
    "card-tilt-3d",
    "spotlight-card"
  ],
  "demo": {
    "component": "CardFlip",
    "hint": "悬停或聚焦翻面；点击、Enter / Space 切换。",
    "hintTouch": "轻触卡片切换正反面，或按自动演示。",
    "replayable": false,
    "autoDemo": true
  },
  "params": [
    {
      "key": "duration",
      "label": "翻转时长",
      "kind": "number",
      "default": 600,
      "min": 200,
      "max": 1200,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "axis",
      "label": "旋转轴",
      "kind": "select",
      "default": "vertical",
      "options": [
        {
          "value": "vertical",
          "label": "竖轴（左右翻）"
        },
        {
          "value": "horizontal",
          "label": "横轴（上下翻）"
        }
      ]
    }
  ],
  "prompt": {
    "en": "Build a two-sided card flip.\nElement: a 280 by 180 px button with a title on the front and a short description on the back.\nTrigger: fine-pointer hover or keyboard focus reveals the back; click, tap, Enter or Space toggles the currently visible face. Leaving hover/focus restores the front unless the back was pinned by a click.\nMotion (suggested values): rotate 180 degrees on the {{axis}} axis (vertical means rotateY; horizontal means rotateX), with 1000 px perspective, duration {{duration}}, cubic-bezier(0.4, 0.2, 0.2, 1).\nImplementation: preserve 3D, hide backfaces, animate transform only; reflect the visible face in aria-pressed and hide the other face from assistive reading.\nAccessibility: under prefers-reduced-motion, do not auto-flip on hover or focus; direct activation switches faces instantly, while explicit Auto demo runs one finite path. Keep visible keyboard focus, Enter/Space controls and a tap alternative without navigation; allow vertical touch scrolling.",
    "zh": "请实现一张有正反两面的翻转卡片。\n作用对象：280 × 180 px 的按钮卡片，正面显示标题，背面显示简短说明。\n触发方式：精细指针悬停或键盘聚焦展示背面；点击、轻触、Enter 或空格切换当前可见面。悬停或焦点离开时回到正面，点击固定的背面除外。\n运动细节（建议值）：绕 {{axis}} 轴翻转 180 度（vertical 为 rotateY 左右翻，horizontal 为 rotateX 上下翻），透视 1000 px，时长 {{duration}}，缓动 cubic-bezier(0.4, 0.2, 0.2, 1)。\n实现要求：保留 3D 空间并隐藏背面，只动画 transform；aria-pressed 反映可见面，非可见面不参与辅助阅读。\n兜底：prefers-reduced-motion 下悬停和聚焦不自动翻转，直接激活即时换面，明确按下自动演示时仍运行一次有限路径。保留可见焦点和 Enter/空格操作，触屏轻触可切换且不跳转，允许纵向滑动页面。"
  }
};
