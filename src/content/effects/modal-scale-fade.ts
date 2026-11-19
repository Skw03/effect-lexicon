import type { Effect } from '../../types';
export const modalScaleFade: Effect = {
  "id": "modal-scale-fade",
  "slug": "modal-scale-fade",
  "status": "published",
  "name": {
    "en": "Modal Scale Fade",
    "zh": "弹窗缩放淡入"
  },
  "aliases": {
    "en": [
      "dialog entrance",
      "scale fade modal"
    ],
    "zh": [
      "模态弹窗",
      "对话框淡入"
    ]
  },
  "searchPhrases": {
    "en": [
      "a dialog gently grows and fades in",
      "a popup opens over a dim backdrop",
      "a modal shrinks away when closed"
    ],
    "zh": [
      "弹窗放大并淡入",
      "对话框出现时背景变暗",
      "点击按钮打开浮层"
    ]
  },
  "category": "transitions",
  "type": "animation",
  "triggers": [
    "click"
  ],
  "tags": [
    "modal-scale-fade",
    "dialog entrance",
    "scale fade modal"
  ],
  "summary": "点击按钮后，演示区内的弹窗轻微放大淡入，关闭时缩小淡出。",
  "whatYouSee": "背景在演示舞台内变暗，白色对话框浮现在中间。关闭后焦点回到打开按钮，不影响页面其他区域的滚动。",
  "behavior": [
    "点击按钮打开，焦点进入对话框。",
    "Tab 在弹窗控件间循环。",
    "按 Escape 或关闭按钮退出，焦点返回发起者。"
  ],
  "useCases": [
    "操作确认",
    "简短信息弹层"
  ],
  "terminologyNote": "Modal 指打开时要求先处理的对话框；scale-fade 描述过渡方式，不是某个唯一官方动画名称。本例背景只覆盖演示区域。",
  "related": [
    "glassmorphism",
    "card-flip"
  ],
  "demo": {
    "component": "ModalScaleFade",
    "hint": "点击按钮打开，Escape 关闭",
    "hintTouch": "轻触打开或关闭按钮",
    "replayable": false,
    "autoDemo": false
  },
  "params": [
    {
      "key": "duration",
      "label": "打开时长",
      "kind": "number",
      "default": 250,
      "min": 100,
      "max": 600,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "startScale",
      "label": "起始缩放",
      "kind": "number",
      "default": 0.95,
      "min": 0.8,
      "max": 1,
      "step": 0.01
    }
  ],
  "prompt": {
    "en": "Build a Modal Scale Fade effect.\nElement: a labelled dialog contained within the demo stage, with role=dialog and aria-modal=true.\nTrigger: an open button click, keyboard activation or tap.\nBehavior: the stage backdrop fades to rgba(0,0,0,0.4) over 200ms; the dialog fades and scales from {{startScale}} to 1.\nMotion (suggested values): open in {{duration}} with cubic-bezier(0.16,1,0.3,1); close reverses over 150ms. Animate only transform and opacity. Move focus inside, cycle Tab/Shift+Tab while open, close on Escape or the close button, then return focus to the opener. Do not lock page scroll; gallery shows a noninteractive static open preview without taking focus.\nFallbacks: prefers-reduced-motion opens and closes instantly with the same focus behavior; keyboard and touch controls remain available with visible focus.",
    "zh": "请实现弹窗缩放淡入效果。\n作用对象：仅覆盖演示舞台的具名对话框，使用 role=dialog 和 aria-modal=true。\n触发方式：点击打开按钮、键盘激活或轻触。\n行为：舞台背景在 200ms 内淡入到 rgba(0,0,0,0.4)，弹窗从 {{startScale}} 放大到 1 并淡入。\n动效参数（建议值）：打开用 {{duration}} 与 cubic-bezier(0.16,1,0.3,1)，关闭用 150ms 反向过渡；只动画 transform 和 opacity。打开后焦点进入，Tab/Shift+Tab 循环，Escape 或关闭按钮退出，焦点返回打开按钮。不锁页面滚动；首页仅显示静态打开画面，不获取焦点。\n兜底：prefers-reduced-motion 下即时开关并保留焦点管理；键盘与触屏均可操作，焦点清晰可见。"
  }
};
