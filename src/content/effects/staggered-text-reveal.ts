import type { Effect } from '../../types';
export const staggeredTextReveal: Effect = {
  "id": "staggered-text-reveal",
  "slug": "staggered-text-reveal",
  "status": "published",
  "name": {
    "en": "Staggered Text Reveal",
    "zh": "逐词错峰浮现"
  },
  "aliases": {
    "en": [
      "word stagger",
      "staggered word entrance"
    ],
    "zh": [
      "逐词入场",
      "文字错峰出现"
    ]
  },
  "searchPhrases": {
    "en": [
      "words fade up one after another",
      "a sentence appears word by word with a delay",
      "replay a staggered text entrance"
    ],
    "zh": [
      "一句话的词语依次向上浮现",
      "文字分组错开时间淡入",
      "标题逐词出现而不是逐字打字"
    ]
  },
  "category": "text",
  "type": "animation",
  "triggers": [
    "page-load"
  ],
  "tags": [
    "word stagger",
    "staggered word entrance",
    "逐词入场",
    "文字错峰出现"
  ],
  "summary": "词语依次向上浮现，组合成一句完整的话。",
  "whatYouSee": "一句话被分成若干词组，每组从下方轻轻上移并淡入。词组之间错开短暂时间，最后停留为完整句子。",
  "behavior": [
    "载入可见区域时运行一次，或按重播再次开始。",
    "每个词从指定下移距离和透明度零到原位及完全可见。",
    "相邻词依次延迟，结束后保持完整句子，离屏时暂停。"
  ],
  "useCases": [
    "内容入口标题",
    "短句叙事开场"
  ],
  "terminologyNote": "Stagger 指开始时间错开，Text reveal 是较宽泛的文字出现效果。这不是 Typewriter 的逐字追加；此处词组始终存在，只改变位置和透明度。",
  "related": [
    "typewriter",
    "gradient-text-shimmer"
  ],
  "demo": {
    "component": "StaggeredTextReveal",
    "hint": "载入时词语依次浮现；按重播重新体验。",
    "hintTouch": "轻触播放或重播，让词语依次浮现。",
    "replayable": true,
    "autoDemo": false
  },
  "params": [
    {
      "key": "stagger",
      "label": "词间延迟",
      "kind": "number",
      "default": 60,
      "min": 20,
      "max": 200,
      "step": 10,
      "unit": "ms"
    },
    {
      "key": "duration",
      "label": "单词入场时长",
      "kind": "number",
      "default": 500,
      "min": 200,
      "max": 1000,
      "step": 50,
      "unit": "ms"
    },
    {
      "key": "distance",
      "label": "上移距离",
      "kind": "number",
      "default": 16,
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px"
    }
  ],
  "prompt": {
    "en": "Build a staggered word reveal.\nElement: one sentence split into word spans.\nTrigger: play once when mounted and visible; Replay restarts all words.\nMotion (suggested values): each word moves from translateY({{distance}}) to 0 and opacity 0 to 1 over {{duration}} ease-out; delay each next word by {{stagger}}. Retain the complete sentence when finished.\nImplementation: animate transform and opacity only; hide decorative word spans from assistive reading and provide the full sentence as one accessible label. Pause when off-screen or when Pause is pressed.\nAccessibility: prefers-reduced-motion initially shows the complete sentence without autoplay. Explicit Play or Replay runs one finite entrance. Make the playback controls keyboard- and touch-accessible with visible focus and no navigation.",
    "zh": "请实现逐词错峰浮现。\n作用对象：拆为词语 span 的一句话。\n触发方式：挂载且可见时播放一次，按重播重新开始全部词语。\n运动细节（建议值）：每个词从 translateY({{distance}}) 上移到 0，同时 opacity 从 0 到 1，单词时长 {{duration}}、ease-out；后一词相对前一词延迟 {{stagger}}。完成后保留完整句子。\n实现要求：只动画 transform 与 opacity；词语 span 对辅助阅读隐藏，完整句子作为一个可访问名称提供。离屏或按暂停时冻结进度。\n兜底：prefers-reduced-motion 下初始完整显示、不自动播放，明确按下播放或重播才运行一次有限入场。播放控件支持键盘和触屏，显示清晰焦点且不导航。"
  }
};
