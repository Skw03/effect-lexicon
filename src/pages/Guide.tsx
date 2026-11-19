import { Link } from 'react-router-dom';
export function Guide() {
  return <article className="guide">
    <h1>如何向 AI 描述一个动效</h1>
    <p className="muted">先说看见了什么，再说它如何发生。名称能帮助定位，具体行为才让实现更接近你的想法。</p>
    <section className="panel" aria-labelledby="guide-parts"><h2 id="guide-parts">好描述的六个要素</h2>
      <ol className="guide-parts">
        <li><h3>作用对象</h3><p>指出哪个元素会变化，例如一张产品卡片、一行标题或按钮。补充尺寸和所在位置，避免整个页面一起动。</p></li>
        <li><h3>触发方式</h3><p>说明何时开始：鼠标移入、指针移动、点击、滚动到可见区域，还是页面载入。离开或再次点击时发生什么，也要说清楚。</p></li>
        <li><h3>画面变化</h3><p>描述从什么状态变成什么状态，例如卡片靠近指针的一侧向后倾斜，高光跟随指针。倾斜和翻转 180 度是不同的效果。</p></li>
        <li><h3>运动细节</h3><p>给出建议的时长、缓动、角度或距离，以及是否循环。例如离开后用 ease-out 在 400ms 内回正；这些是可调整的建议值，不是标准。</p></li>
        <li><h3>约束条件</h3><p>说明技术和性能边界：用 CSS 与少量 JavaScript，只动画 transform 和 opacity，不改变布局尺寸；离屏暂停，卸载时清理监听和计时器。</p></li>
        <li><h3>边界情况</h3><p>补上触屏、键盘和减少动态的体验：拖动时仍能竖向滚动，有清晰键盘焦点；开启 prefers-reduced-motion 后默认静止，手动演示只播放一次。</p></li>
      </ol>
    </section>
    <section className="panel" aria-labelledby="guide-example"><h2 id="guide-example">从模糊要求到明确描述</h2>
      <h3>修改前</h3><blockquote>卡片动起来</blockquote>
      <p>这句话没有说触发方式、运动方向或停止条件，可能得到完全不同的动画。</p>
      <h3>修改后：3D 倾斜卡片</h3>
      <blockquote className="guide-example">请实现一张约 320 × 200px 的 3D 倾斜卡片（3D Tilt Card）。鼠标在卡片上移动时，靠近指针的一侧向后凹下去，卡片轻微放大，柔和高光跟随指针。建议透视距离 1000px、每轴最大倾斜 12deg、放大 1.03 倍；移动时逐帧平滑更新，离开后用 ease-out 在 400ms 内回正并让高光淡出。只动画 transform 与 opacity，不改变布局尺寸。键盘聚焦后可用方向键控制，散焦后回正；触屏可拖动且保留竖向页面滚动。开启 prefers-reduced-motion 时默认不倾斜，点击自动演示才运行一次有限路径，然后回正，并允许重播。</blockquote>
      <Link to="/effects/card-tilt-3d">体验 3D 倾斜卡片，调整参数并复制完整提示词 →</Link>
    </section>
  </article>;
}
