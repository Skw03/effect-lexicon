import type { Effect } from '../../types';
export const parallaxScroll: Effect = {
  "id": "parallax-scroll",
  "slug": "parallax-scroll",
  "status": "published",
  "name": {
    "en": "Parallax Scroll",
    "zh": "滚动视差"
  },
  "aliases": {
    "en": [
      "parallax scrolling",
      "layered scroll"
    ],
    "zh": [
      "视差滚动",
      "多层滚动"
    ]
  },
  "searchPhrases": {
    "en": [
      "background moves slower than the text",
      "layers scroll at different speeds",
      "scrolling creates depth behind a card"
    ],
    "zh": [
      "滚动时背景比内容慢",
      "背景和文字速度不一样",
      "滚动产生远近层次"
    ]
  },
  "category": "scrolling",
  "type": "interaction",
  "triggers": [
    "scroll"
  ],
  "tags": [
    "parallax-scroll",
    "parallax scrolling",
    "layered scroll"
  ],
  "summary": "滚动时，背景、中景和文字以不同速度移动，形成远近层次。",
  "whatYouSee": "几何图形在文字卡片后缓慢移动。越远的图层移动越慢，文字按正常速度滚动。",
  "behavior": [
    "滚动内部演示区。",
    "背景、中景和前景分别按速度系数移动。",
    "Replay 自动滚动一遍，可用滚轮或触屏中断。"
  ],
  "useCases": [
    "故事页面",
    "产品介绍"
  ],
  "terminologyNote": "Parallax scrolling 强调层与层的速度差；scroll reveal 则是元素进入可见区域时显现，两者不同。",
  "related": [
    "scroll-reveal",
    "card-tilt-3d"
  ],
  "demo": {
    "component": "ParallaxScroll",
    "hint": "滚动演示区域，观察三层速度",
    "hintTouch": "上下滑动演示区域",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "backgroundSpeed",
      "label": "背景速度系数",
      "kind": "number",
      "default": 0.5,
      "min": 0.1,
      "max": 0.9,
      "step": 0.1
    },
    {
      "key": "midgroundSpeed",
      "label": "中景速度系数",
      "kind": "number",
      "default": 0.8,
      "min": 0.6,
      "max": 1,
      "step": 0.05
    }
  ],
  "prompt": {
    "en": "Build a Parallax Scroll effect.\nElement: a 420px-high scroll container with background shapes, midground shapes and a foreground text card.\nTrigger: scroll inside this container.\nBehavior: background moves at {{backgroundSpeed}} of scroll speed, midground at {{midgroundSpeed}}, foreground at 1.0; these are suggested values. Apply translate3d compensation to the naturally scrolling layers in requestAnimationFrame, using container scrollTop only. Replay travels down the stage over 3000ms.\nImplementation: cache dimensions outside scroll handlers, animate transform only, cancel frames on unmount or user input.\nFallbacks: prefers-reduced-motion keeps layers at normal speed; explicit Replay runs one finite parallax trip. Keyboard arrows and PageDown scroll the focusable region and Tab leaves; touch scrolling and edge chaining remain native.",
    "zh": "请实现滚动视差效果。\n作用对象：420px 高的独立滚动区，包含背景图形、中景图形和前景文字卡片。\n触发方式：滚动此容器。\n行为：背景速度为滚动速度的 {{backgroundSpeed}}，中景为 {{midgroundSpeed}}，前景为 1.0，均为建议值。在 requestAnimationFrame 中用容器 scrollTop 计算 translate3d 补偿，叠加到原生滚动上；Replay 在 3000ms 内向下滚动一遍。\n实现要求：尺寸在滚动处理外缓存，只动画 transform，卸载或用户接管时取消帧。\n兜底：prefers-reduced-motion 下各层随内容正常滚动；手动 Replay 可体验一次有限视差。聚焦区域可用方向键和 PageDown，Tab 可离开；保留触屏原生滚动及边缘页面滚动。"
  }
};
