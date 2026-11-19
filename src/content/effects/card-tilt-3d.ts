import type { Effect } from '../../types';

export const cardTilt3d: Effect = {
  id: 'card-tilt-3d', slug: 'card-tilt-3d', status: 'published',
  name: { en: '3D Tilt Card', zh: '3D 倾斜卡片' },
  aliases: { en: ['tilt effect', 'parallax tilt', 'perspective tilt', '3D hover card', 'mouse-tracking card', 'vanilla-tilt style'], zh: ['卡片倾斜', '鼠标跟随卡片', '3D 悬浮卡片', '视差倾斜'] },
  searchPhrases: { en: ['a card that follows my mouse', 'a card that leans toward the cursor', 'card rotates in 3D on hover'], zh: ['鼠标移上去卡片会跟着转', '卡片会朝鼠标的方向歪', '卡片有立体感', '卡片跟着鼠标动'] },
  category: 'cards', type: 'interaction', triggers: ['pointer-follow', 'hover'],
  tags: ['3d', 'perspective', 'glare', 'hover'],
  summary: '鼠标在卡片上移动时，卡片朝鼠标方向做 3D 倾斜，离开后回正。',
  whatYouSee: '卡片会像被按在鼠标所在的位置一样，靠近鼠标的一侧向后凹下去。鼠标离开后卡片平滑回到平整状态。可选的柔和高光会跟着鼠标移动。',
  behavior: ['鼠标进入卡片：卡片轻微放大。', '鼠标在卡片上移动：倾斜角度随位置实时变化，高光随之移动。', '鼠标离开：卡片平滑回正，高光淡出。'],
  useCases: ['产品卡片', '价格方案卡片', '作品集缩略图', '收藏卡展示'],
  terminologyNote: '最常见的叫法是 Tilt（倾斜）。当卡片内部的图层以不同速度移动时，常被称为 parallax tilt。它不同于 Card Flip（卡片翻转），后者是整张卡片翻转 180 度。',
  related: ['spotlight-card', 'card-flip'],
  demo: { component: 'CardTilt3d', hint: '把鼠标移到卡片上', hintTouch: '在卡片上拖动手指', replayable: false, autoDemo: true },
  params: [
    { key: 'maxTilt', label: '最大倾斜角度', kind: 'number', default: 12, min: 4, max: 25, step: 1, unit: 'deg' },
    { key: 'scale', label: '悬停放大', kind: 'number', default: 1.03, min: 1, max: 1.1, step: 0.01 },
    { key: 'perspective', label: '透视距离', kind: 'number', default: 1000, min: 500, max: 2000, step: 50, unit: 'px' },
    { key: 'glare', label: '高光', kind: 'boolean', default: true },
    { key: 'returnDuration', label: '回正时长', kind: 'number', default: 400, min: 150, max: 800, step: 50, unit: 'ms' }
  ],
  prompt: {
    en: 'Build a 3D tilt card (also called a parallax tilt or perspective tilt card).\nElement: one content card, about 320 by 200 px, 16 px rounded corners, soft shadow.\nTrigger: pointer movement over the card (mouse hover). On touch screens, dragging a finger across the card should do the same.\nBehavior: while the pointer is over the card, the card rotates in 3D so that the edge nearest the pointer dips away from the viewer, as if pressed at that point. The card scales up slightly while hovered.{{#glare}} A soft white radial glare (up to 25% opacity) follows the pointer across the card.{{/glare}}\nMotion (suggested values): perspective {{perspective}}; maximum tilt {{maxTilt}} on each axis; scale {{scale}}; while the pointer moves, update the transform every animation frame with light smoothing and no long CSS transition; when the pointer leaves, ease back to flat over {{returnDuration}} with ease-out{{#glare}} and fade the glare out{{/glare}}.\nImplementation notes: animate only transform and opacity; set will-change: transform on the card; the tilt must not change the card layout size.\nFallbacks: if prefers-reduced-motion is set, disable the tilt and use only a subtle shadow or border change on hover. Provide a focusable demo with visible focus and arrow-key tilt controls; touch dragging must preserve vertical page scrolling. Under reduced motion, Auto demo explicitly runs one finite path then returns to rest, and can be replayed.',
    zh: '请实现一个 3D 倾斜卡片（也叫 tilt 效果、视差倾斜卡片）。\n作用对象：一张内容卡片，约 320 x 200 px，圆角 16 px，带柔和阴影。\n触发方式：鼠标在卡片上移动（悬停）。触摸屏上，在卡片上拖动手指应有相同效果。\n行为：鼠标在卡片上时，卡片做 3D 旋转，靠近鼠标的一侧向远离观看者的方向凹下去，就像在该点被按下。悬停时卡片轻微放大。{{#glare}}一层柔和的白色径向高光（最高 25% 不透明度）跟随鼠标在卡片上移动。{{/glare}}\n动效参数（建议值）：透视 {{perspective}}；每个轴最大倾斜 {{maxTilt}}；放大 {{scale}} 倍；鼠标移动时在每个动画帧更新 transform，带轻微平滑，不使用较长的 CSS 过渡；鼠标离开时用 ease-out 在 {{returnDuration}} 内回到平整{{#glare}}，并让高光淡出{{/glare}}。\n实现要求：只对 transform 和 opacity 做动画；卡片设置 will-change: transform；倾斜不能改变卡片的布局尺寸。\n兜底：如果用户开启了 prefers-reduced-motion，则关闭倾斜，只保留轻微的阴影或边框变化。演示可键盘聚焦并有清晰焦点样式，用方向键控制倾斜；触屏拖动保留竖向页面滚动。减少动态时 Auto demo 可显式运行一次有限路径并回正，可手动重播。'
  }
};
