import type { Effect } from '../../types';
export const shrinkingStickyHeader: Effect = {
  "id": "shrinking-sticky-header",
  "slug": "shrinking-sticky-header",
  "status": "published",
  "name": {
    "en": "Shrinking Sticky Header",
    "zh": "滚动收缩导航栏"
  },
  "aliases": {
    "en": [
      "shrinking navbar",
      "compact sticky header"
    ],
    "zh": [
      "收缩吸顶栏",
      "滚动变小的导航"
    ]
  },
  "searchPhrases": {
    "en": [
      "header gets smaller as I scroll",
      "navigation shrinks after scrolling down",
      "sticky bar becomes compact"
    ],
    "zh": [
      "滚动后导航栏变矮",
      "向下滑动顶部栏收缩",
      "吸顶栏缩小并出现阴影"
    ]
  },
  "category": "navigation",
  "type": "interaction",
  "triggers": [
    "scroll"
  ],
  "tags": [
    "shrinking-sticky-header",
    "shrinking navbar",
    "compact sticky header"
  ],
  "summary": "在独立滚动区内，顶部导航越过阈值后收缩并出现柔和阴影。",
  "whatYouSee": "导航栏最初高 72px，向下滚动后变成更紧凑的白色半透明栏。它仍贴着演示滚动区的顶部，回到起点时恢复。",
  "behavior": [
    "滚动演示区域，越过阈值后导航收缩。",
    "收缩状态显示阴影和轻微背景模糊。",
    "向上滚回阈值内恢复，Replay 自动向下再返回。"
  ],
  "useCases": [
    "长页面导航",
    "内容目录"
  ],
  "terminologyNote": "Sticky 受所在滚动容器约束，fixed 则通常相对视口定位；这里演示的是容器内吸顶，不影响页面导航。",
  "related": [
    "underline-slide-link",
    "parallax-scroll"
  ],
  "demo": {
    "component": "ShrinkingStickyHeader",
    "hint": "滚动演示区域，Tab 可离开",
    "hintTouch": "在演示区上下滑动，边缘可继续滚动页面",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "threshold",
      "label": "收缩阈值",
      "kind": "number",
      "default": 40,
      "min": 10,
      "max": 120,
      "step": 5,
      "unit": "px"
    },
    {
      "key": "collapsedHeight",
      "label": "收缩高度",
      "kind": "number",
      "default": 48,
      "min": 36,
      "max": 64,
      "step": 2,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a Shrinking Sticky Header effect.\nElement: a 360px-high scroll container with a sticky 72px header, logo and links.\nTrigger: container scrollTop exceeds {{threshold}}.\nBehavior: shrink to {{collapsedHeight}}, add a soft shadow and translucent white background with slight blur; restore above the threshold.\nMotion (suggested values): 200ms ease for header height, an explicitly scoped layout-animation exception; fade a static shadow/background layer with opacity. Replay scrolls down 200px and back over 3000ms. Read only this container, never window scroll.\nFallbacks: prefers-reduced-motion switches header states instantly; explicit Replay runs one finite trip. Keyboard arrows/PageDown scroll the focused region, Tab leaves it; touch scroll and edge chaining remain native. Links do not navigate in this demo.",
    "zh": "请实现滚动收缩导航栏效果。\n作用对象：360px 高的独立滚动容器，含 72px 高的吸顶导航、标识和链接。\n触发方式：容器 scrollTop 超过 {{threshold}}。\n行为：导航收缩至 {{collapsedHeight}}，出现柔和阴影及轻微模糊的半透明白背景；滚回阈值内恢复。\n动效参数（建议值）：高度采用 200ms ease，这是仅限本项导航高度的布局动画例外；静态阴影与背景层用 opacity 淡入。Replay 在 3000ms 内向下滚动 200px 再返回。只读取本容器，不监听 window 滚动。\n兜底：prefers-reduced-motion 下即时切换状态；手动 Replay 只演示一次。聚焦滚动区后用方向键或 PageDown 滚动，Tab 离开；触屏采用原生滚动，边缘继续滚动页面。演示链接不跳转。"
  }
};
