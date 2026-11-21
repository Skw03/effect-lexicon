# Stage 5 验收报告

日期：2026-11-19。仅在指定 effect-lexicon-cloud 的 `/workspace/effect-lexicon` 执行。唯一 origin：`https://github.com/Skw03/effect-lexicon.git`。分支 `stage-5-hardening`，精确基底 `d0f2a1f9b948d2ac1a0132a02a1a44dbdf15ad3d`（已合并 Stage 4）。开始时工作树干净，本地 `work` 为旧 Stage 3；核验远端 main 精确基底、无同名分支后 fetch 并创建任务分支，未改 main。

**结论：以下是本工作者真实开发自检，候选保持未提交，等待协调方独立 H6。不是最终 H6、合并或生产放行。** 未新增正式词条、产品依赖、schema、发布流水线、域名或 SSR。SPEC 与 REQUIREMENTS_SOURCE 原样保留。

## 独立 H6 验收补记（2026-11-19）

上面的“待审”描述及后续自检记录保留为候选历史；当前独立H6已通过。未参与实现、未继承开发会话的原生审查员，在同一执行器从精确基底应用SHA-256 `8170aea9b25f5305e69e7bf02e4821421befe887fc2419de51961956c2d345d7`（19 paths / 79,584 bytes）并验证可逆、实际diff与全部13项，原始结论 **ready to merge（Stage 5范围），无阻断缺陷**。协调方已另行授权提交正常推送；不创建PR、不合并、不部署、不开始Stage6。

独立实跑四门与140 Vitest通过；Chromium **1169/1169**；Lighthouse12.8.2首页/Tilt **100/100 accessibility**（开发和独立两轮均100）；axe4.10.3 **21状态、零critical/serious、全部violations=[]**。隔离第19项干跑四门、146临时单测与真实浏览器集成通过。另写探针验证Tab/Space清除、焦点回归/下一Tab，以及已有查询替换期间每步550ms组合不发布URL/结果/aria-live、最终中文、清空和Back。完整独立证据保留在执行器 `/tmp/h6-independent/`。

保留两项**P3非阻断语义建议**：`src/components/PromptPanel.tsx:29` 的“提示词语言”和 `src/demos/Glassmorphism.tsx:10` 的“演示背景”使用无role div的aria-label，分组名称不可靠；可在后续授权维护时采用适当group语义，本次不改受审代码。axe将这些列为incomplete/aria-prohibited-attr；复杂背景、SVG/3D和长textarea仍有incomplete/color-contrast人工判定项。物理手机、Safari/Firefox、原生屏读器和OS Pinyin候选窗未验证，不宣称完整WCAG认证。Stage6清单继续未执行；Library上传不重试，无附件外发。

## 13 项逐项结果

| SPEC §11 | 自检结果与证据 | 可复跑方法 |
| --- | --- | --- |
| 1. 运行/测试/构建/类型/lint | PASS。安装禁用脚本；typecheck、lint、test、build 均返回 0。Vitest 4 文件、140 passed、0 skipped/todo。dev 和构建 preview 均实际启动。 | README 安装及四质量门。 |
| 2. 18 项/8 类/真实图库预览 | PASS。精确有序清单、类别计数单测；实际十八卡预览、交互/导航分离、连续离屏暂停、滚动静态代表帧。九个真实 Typewriter 隔离夹具验证通用预算最多六个及释放/排队提升。 | content/search tests；discovery、Stage 3/4 浏览器脚本。 |
| 3. 18 详情/提示/工具栏/参数真实 | PASS。旧 smoke+Stage 3+Stage 4 覆盖全部演示的实际矩阵、CSS、文本、滚动位置、播放状态、参数及重置；不是图片或占位。 | 六个历史脚本。 |
| 4. hover/pointer 触屏替代及 Auto | PASS（Chromium CDP 触摸模拟）。Tilt/Flip/Spotlight/Magnetic/Fill/Underline 的 tap/drag/Auto、有限结束；真实原生触屏滚动与内部滚动区上下边缘释放。**未用物理手机**。 | smoke、Stage 3/4、magnetic boundary；Stage 4 含 320/375/390/768/1280 上下释放。 |
| 5. 筛选 AND/OR、URL、清除 | PASS。全部原筛选/URL/replace/近似交集断言保留；新增两种清除的真实 Enter、回焦搜索框、下一 Tab 到首 chip；Pinyin 组合期间保持 URL/结果/aria-live，最终中文提交、取消、清空及 Back。 | search tests、discovery、stage5_regression。 |
| 6. 12 查询组/14 输入/16 目标 | PASS。全部目标进入前三（两个双目标句各查两项），无 todo；无意义查询显示零真实匹配与三个标注相近推荐，筛选仍生效。 | search tests；Stage 4 浏览器原始全部十四输入。 |
| 7. 双语名称及匹配提示 | PASS。十八条名称及英文显示、匹配别名/描述文本来源；无“唯一官方名称”承诺。指南使用中文六要素及“卡片动起来”对比准确 Tilt 描述，可进入真实详情。 | content/search tests、discovery、stage5_regression。 |
| 8. 双语复制/最新参数/模板 | PASS。真实 Clipboard 中英文逐字相等、全部参数变化与重置、条件分支/单位；旧复制竞态、legacy、失败选中及过期请求保护均实跑。 | renderPrompt 45 tests；smoke、clipboard、Stage 3/4。 |
| 9. 严格内容校验 | PASS。18 项公开实现/related、2–5 参数、每语言3–6短语、默认值按 kind、每参数两语言及兜底。新增源模板逐 token 检查：未知键（包括未激活条件）、非法 token、残留括号均失败，避免只看渲染文本遗漏。 | content 58 tests；全部原断言保留。 |
| 10. 减少动态 | PASS（浏览器模拟媒体偏好）。首页及全部详情无自动/无限播放；手动 Play/Replay/Auto 有限运行，可再次播放。Typewriter 三句一次保留第三句、Auto 约4秒回正等有旧脚本真实终态断言。四宽度 Tab/滚动遍历后再检查无运行中动画。 | smoke、discovery、Stage 3/4、stage5_regression。 |
| 11. 键盘/焦点/响应式 | PASS（Chromium）。320/375/768/1280 全20路由无页面横溢，每个可用控件均实际 Tab 到达且可见2px outline、目标至少44×44；提示词16px并内部换行。正常模式六个 hover/pointer 演示散焦恢复；模态双向 Tab、Esc/关闭及回焦由旧 Stage 4 验证。 | stage5_regression，旧 Stage 4；人工查看指南和375px提示词截图（仅本地，不交付截图）。 |
| 12. 真实 Lighthouse/axe | PASS。Lighthouse 12.8.2 accessibility 首页100、Tilt详情100（门槛95）。axe-core 4.10.3：Library、全部18详情、Guide、打开modal共21状态，critical=0、serious=0，其他违规也为0。 | README 完整命令；stage5_audit；原始报告本地证据包（Library保存阻塞见末尾）。自动审计不是完整 WCAG/屏读器认证。 |
| 13. README 五步增加第19项 | PASS（仅隔离副本）。脚本按内容→演示→registry→搜索/精确清单→验证，在 `/tmp/effect-stage5-nineteenth-*` 添加真实一次缩放演示，四质量门全部通过，十九卡、新项首位检索、路由、有限手动动作、参数、双语真实复制、related 均通过。正式源文件前后哈希相同，仍18项。 | `python3 scripts/stage5_add_effect_dryrun.py`；临时日志与路径打印到 stdout。原18项浏览器精确门在正式候选全跑，没有拿新增夹具替代原回归。 |

## 最终实跑计数

| 命令/脚本 | 最终结果 |
| --- | --- |
| `npm run typecheck` / `lint` / `test` / `build` | 全部exit 0；140 Vitest passed（4文件），0 skip/todo |
| `browser_smoke.py` | 67/67（原66加Guide检查） |
| `clipboard_regression.py` | 8/8 |
| `discovery_regression.py` | 68/68 |
| `stage3_regression.py` | 142/142 |
| `magnetic_boundary_regression.py` | 107/107 |
| `stage4_regression.py` | 259/259 |
| `stage5_regression.py` | 518/518 |
| 浏览器功能合计 | **1169/1169**，六个旧脚本651 + Stage 5脚本518 |
| `stage5_audit.py` | 21状态；每状态0 critical / serious，全部violations空数组 |
| Lighthouse 首页 / Tilt | **100 / 100 accessibility**，工具原始JSON，不是自行计算分数 |
| `stage5_add_effect_dryrun.py` | 隔离副本四门 + 十九项集成浏览器验证通过；正式src前后逐文件hash一致 |

## 本阶段发现、修复与审计边界

- **清除焦点（修前实证）**：在 `?q=tilt` 分别聚焦“清除搜索”“清除筛选”，Enter后300ms，`document.activeElement.tagName` 均为 `BODY`。修后均为搜索 `INPUT`，下一 Tab 是“鼠标悬停”。使用共享 input ref 在移除按钮前回焦，无额外全局监听。
- **IME（修前实证）**：Chrome CDP `Input.imeSetComposition` 输入 `ka pian` 等待350ms（大于150ms），URL 变 `?q=ka+pian`，结果从18变3。现有防抖未区分组合态。修后 compositionStart 暂停防抖，compositionEnd 读取最终值并恢复150ms发布；滤组选项不会带出未提交草稿。最终回归分别用 `ka`、`ka pian`、`卡片` 组合等待350ms，URL/结果/MutationObserver记录的结果aria-live均不变；`Input.insertText` 提交中文后准确，取消/清除/Back亦通过。这是 Chromium 原生组合事件的合理 Pinyin 流程模拟，未声称安装或操作操作系统 Pinyin 候选窗。
- **尺寸**：实测 sticky 演示两个链接只有32.015625×44px，改为最小44px宽。Skeleton 标签本来可点，但原checkbox自身13×13，现统一44×44。提示词由14px提高至16px，窄屏仍换行。
- **辅助名称**：首次 Lighthouse 首页虽为100，但实验规则 `label-content-name-mismatch` 报 Flip/Magnetic 的 aria-label 覆盖了可见文字。移除覆盖名称，改为 aria-description 保留操作说明、由可见文字生成名称；最终 Lighthouse 无失败审计，同时显式开启该 axe 实验规则，21状态仍零违规。没有关闭检测规则或隐藏元素来过审。
- **旧脚本适配**：仅 smoke 原 `/guide` Not Found 用例改为真正未知 `/guide/no-such-page`，保持未知路由断言，并新增已实现 Guide 断言，总数66→67。其他旧脚本未改、未削弱。一次 discovery 运行在编辑/开发重载期间于 rapid clear 步观察到页面导航回 `/` 并失败；停止写产品文件后原脚本原样重跑通过68项。未以失败过程中的部分 PASS 作为完成结果。
- **干跑脚本调试**：初次错误假设新查询只返回一项，实际 Fuse 正确同时给出其他较弱匹配；改成规范要求的精确别名首位断言，不改搜索算法或原测试。随后完整四门和浏览器干跑通过。审计脚本一次因新增规则引号语法错误未启动，修正 Python 字符串后完整重跑；没有以该次运行冒充审计。
- AGENTS/ROADMAP 中旧“本 worker 只做 Stage 2”仅澄清为历史限定；当前具体 handoff 决定阶段，保留顺序、独立 H6、提交推送另行指令、Stage 5后停止和生产限制。原始档案与 SPEC 未修改。

## 实跑环境、报告与测量

Node 24.22.1 / npm 11.9.0；Chromium 156.0.8078.79（Debian环境已有）；Python Playwright 为环境已有工具。产品 `npm ci --ignore-scripts` 安装232包，package.json/lockfile未变。审计固定 Lighthouse 12.8.2、axe-core 4.10.3，在 `/tmp/effect-stage5-audit` 通过官方 npm 包及 `--ignore-scripts --save-exact` 独立安装，无产品运行时依赖或生命周期脚本、网络策略更改。

访问地址类型：本机 HTTP loopback。功能旧脚本为 `http://127.0.0.1:5173` Vite开发服务；axe/Lighthouse为 `http://127.0.0.1:4173` 的 `dist` 构建预览。Lighthouse 默认 mobile form factor，只跑 accessibility，不能把100推断为性能/SEO/最佳实践分数。最后审计禁用整页截图采集，仅保存原始文本JSON；不上传浏览器截图。

axe 自动审计在 reduced-motion 下统一稳定采样；完整规则加 `label-content-name-mismatch`，没有 exclude。Lighthouse在默认运动设置运行。原始 JSON 保留 `testEngine`、`testEnvironment`、`timestamp`、`url`、passes、violations、incomplete；incomplete 是自动工具无法判定的部分，需人工审阅，零违规不表示人工项全部满足。仅本机默认配置/页面状态，不声称穷尽每个颜色参数组合。

生产构建：JS **294605 bytes**，gzip **99198 bytes（99.20 kB，约96.87 KiB）**；CSS 26156 bytes，gzip6618 bytes。测量为 Node `zlib.gzipSync` 默认level6（与Vite输出一致），对全部 `dist/assets/*.js` 求和；低于约250kB目标。Python gzip默认level9会得到98082 bytes，不与level6混用。测量不是手机帧率或实网性能分数。

```sh
node --input-type=module - <<'JS'
import fs from 'node:fs'; import zlib from 'node:zlib';
let total=0;
for (const file of fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js'))) {
  const bytes=fs.readFileSync('dist/assets/'+file); const gzip=zlib.gzipSync(bytes).length;
  console.log(file,bytes.length,gzip); total+=gzip;
}
console.log('total JS gzip bytes',total);
JS
```

## 动画属性、布局缓存及资源复核

| 效果 | 实际变化与约束 |
| --- | --- |
| Tilt / Flip / Magnetic | 3D或二维 transform；Tilt高光平移与opacity。will-change仅Tilt活动期间使用，结束移除。 |
| Spotlight | 缓存几何，CSS变量驱动光层translate、opacity；局部边框光是裁剪层，不动画背景位置或border-color。 |
| Ripple / Sliding Fill / Underline | transform/opacity；Fill文字颜色即时切换，不做颜色动画。Ripple DOM与timer结束/离屏/卸载清理。 |
| Typewriter | 必须的真实文本逐字插入/删除（不是动画width）；caret仅opacity。计时器暂停/卸载清理，辅助完整句子避免逐字朗读。 |
| Gradient Text Shimmer | 静态SVG渐变字形裁剪与亮带transform；等效满足扫光效果，避开background-position动画。 |
| Staggered Text / Scroll Reveal | transform/opacity；后者Observer以内部滚动容器为root，离屏暂停。 |
| Aurora / Skeleton / Dots / Modal | transform和/或opacity；Aurora blur为静态参数；Skeleton伪元素平移，内容切换opacity；模态timer/rAF清理、关闭回焦。 |
| Glassmorphism | 无动画；模糊、透明度、圆角仅参数调试即时生效。 |
| Sticky Header | **唯一CSS布局动画例外：height 200ms ease**，原SPEC §7明确要求。背景/阴影/blur使用静态层opacity显隐，reduced-motion为0ms。未推广例外。 |
| Parallax /三滚动Replay | 可见图层translate3d；Replay必需地写内部 `scrollTop` 来演示真实滚动，属于明确按钮启动的演示驱动，不是站点布局动画。默认不自动滚，用户输入即接管。 |

`useInView`/ScrollReveal断开IntersectionObserver；Tilt/useDemoPointer断开ResizeObserver及scroll/resize监听并取消测量rAF；useScrollStage断开内部wheel/touchstart/keydown/scroll和observer并取消rAF。输入回调用已缓存rect/maxScroll，scroll事件只排下一帧读scrollTop；没有在每次pointer handler读布局。PromptPanel仅内容更新时测textarea高度，无指针/滚动热路径读取。

全库五个continuous预览仅可见时申请共享FIFO预算，通用夹具验证最多六个。正常模式旧回归实际检查暂停/重新进入；Stage 5对全部18详情启动后SPA导航到Guide，追踪的pending rAF/timeout归零。监听/observer同时做逐源码生命周期核对；该检查不是堆内存泄漏分析或真实手机GPU性能测量。

## 未执行的 Stage 6 发布准备清单

以下全部是交接清单，**本阶段没有实现、配置、部署或打tag**。原文 H2 的“合并部署”与“不由agent生产部署”必须在未来明确解决；生产触发不得仅因合并而无意发生，须用户单独明确生产放行。

- [ ] 人类确定域名、宿主/账号、最终站名；提供1200×630分享图和图标来源；选择代码许可证与内容条款；明确反馈邮箱/issue位置。
- [ ] 人类逐条读完18项中英内容/术语/提示词；原生中文和前端术语复核；域名/商标、DNS与HTTPS由授权方处理。
- [ ] 新授权后再选择预渲染方案（新增依赖须批准），生成 `/`、`/guide`、所有公开详情真实HTML并hydrate；不能仅返回空root/脚本。
- [ ] **已实证的SSR风险**：仓库外Vite `ssrLoadModule` + React `renderToString` 探针，`useReducedMotion` 报 `window is not defined`（render初始化直接读matchMedia）；独立 `PromptPanel` 报 `Missing getServerSnapshot, which is required for server-rendered content`（useSyncExternalStore缺server snapshot）。不在本阶段修SSR。
- [ ] 语言偏好从localStorage读取、reduced-motion客户端值可能与服务器默认值不同，需明确确定性初始快照和hydrate后更新，验证两语言/两运动设置；不能以抑制hydration警告掩盖不一致。
- [ ] **JS-off实证**：当前构建直接访问Tilt详情，禁用JavaScript时h1数量0、root文本空。Stage 6必须让名字、别名、描述、提示词在JS-off direct detail中真实存在，并验证JS开启后所有演示/参数无hydration错误。
- [ ] 主机路由重写、直接访问/刷新、未知URL真实404（主机支持时）、基础路径及静态资源；独立预览验证所有路由，不能拿本地Vite回退代替生产证据。
- [ ] 每页双语title/description/canonical、OG/Twitter、favicon/manifest、published sitemap/robots；CSP/安全头/缓存策略与实际演示兼容测试。
- [ ] 演示级error boundary、中文失败兜底；隐私声明（不收集个人数据、语言只存本地）、许可证/内容条款/反馈及名称使用说明。
- [ ] PR质量门和预览流程：锁文件安装、typecheck/lint/test/build、真实Lighthouse目标 accessibility95 / best practices95 / SEO95 / mobile performance85。此轮仅证实accessibility，不预报其余通过。明确部署集成生产开关，默认候选/预览，生产单独人工放行；不把secret写入仓库。
- [ ] RELEASE步骤包含部署、版本回滚、域名/DNS/HTTPS、headers/CSP、生产烟测；CHANGELOG与候选tag按未来授权执行。最终生产与v1.0.0由人类按放行流程执行。
- [ ] 人类任务剩余：账户/域名/DNS、宿主/GitHub secret或设置、Search Console验证、18项最终审阅及明确生产放行。

## 明确限制与下一步

没有物理手机、Safari、Firefox、原生屏读器、操作系统Pinyin候选UI或中端手机帧率实测；触摸和reduced-motion为Chromium模拟。自动工具无法判定的内容/对比度人工项需独立复核，不宣称WCAG完整认证。当前SPA、SEO/生产深链/CSP/JS-off/SSR缺口属于Stage 6清单，不假称已完成。

下一步：协调方按README在干净基底应用完整patch并独立运行H6。只有独立验收后明确指令才提交推送；本工作者不建PR、不合并、不部署、不开始Stage 6。补丁包含新增文件，交付消息给出基底、SHA-256、字节数、路径数、Library身份/版本与审计附件；不在补丁自身写自引用摘要。

## 交付出口状态

完整补丁和无截图原始审计证据包已在指定环境生成并校验；Library保存尚未成功，暂无ID/版本。官方多文件上传helper首先在tools/list阶段网络失败，随后同一操作的环境权限申请被自动审批拒绝（缺少可信用户原文对非公开代码/证据上传及私人受控目标的授权）。检查可见用户历史后没有更明确的附件授权，已停止该操作，无绕过或其他外发。协调方需补充相应可信证据或请用户批准这两个文件的私有Library保存。实现及审计不受影响，仍等待独立H6。

## Stage 6 授权补记（2026-11-19）

上文 Stage 5 历史报告、13项结果与当时未执行清单原样保留。新明确指令开放 Stage 6 开发和候选验证，基底 main `0dba59fb0a833d40f8e54da430f199c6ebe58dbc`。本候选新增 prerender/hydrate、可配置metadata、局部错误边界、本地headers/404、CI检查模板与发布交接；实际自检记录见 PROGRESS 和 RELEASE。生产仍必须独立 PASS 后由 owner 另行明确放行和发布，不能因合并自动触发。外部预览须先核实宿主/账号/访问并经 SUN 确认；当前无生产连接或自动workflow激活，无tag。所有 Stage 0–5 已批准范围保留，不自动扩展到 Stage 7。

H2/F1/F3 当前仍缺：宿主和账号/preview目标、正式域名/名称、批准的OG/favicon素材、反馈地址、代码许可/内容条款、真实托管预览和Actions通过、独立候选审查、owner个人读完18项、生产烟测。不得将本地模拟、空配置下noindex或这份补记称为 Stage 6 完成。
