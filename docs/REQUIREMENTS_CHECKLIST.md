# 要求核查矩阵 — Stage 0–5 独立基线

审查版本：`59a2429fcf190a6b9d3cf48d487f166c518866a9`。整体结论 **CHANGES REQUIRED**；本矩阵保留原55条要求及18效果状态，不因文档发布关闭任何发现。

完整报告：[baseline-0-5-59a2429.md](reviews/baseline-0-5-59a2429.md)。来源为 `docs/REQUIREMENTS_SOURCE.md` A–H（D子编号亦对应SPEC）及明确批准修订。owner §5/§9指项目独立审查指令的相应章节。

维护规则：保留稳定ID、来源、性质与历史版本；未来复验须记录新SHA和证据，不能凭实施者声明把FAIL改为PASS。PASS限已独立验证范围；FAIL为已复现偏差；BLOCKED为具体验证条件缺失；NOT DUE为未来阶段；NOT APPLICABLE必须有明确条件说明。此处硬件/屏读器BLOCKED是覆盖限制，不是虚构产品缺陷。原始运行日志、截图、JSON和附件不公开，表内给出技术摘要与仓库内复跑入口。

|ID|来源/性质|要求|状态|独立证据摘要/限制|
|---|---|---|---|---|
|BASE-01|A; B1; D1; D12 / mandatory|中文视觉效果词典；描述→定位→交互→双语提示词；无账号/后端/分析|PASS|src/pages、content源码与七项浏览器套件；此版本边界；不是对未来已授权扩展的永久禁止|
|BASE-02|G2; D2 / mandatory|限定 React18/TS strict/Vite/Router/Fuse；无额外动画/UI库|PASS|package.json/package-lock.json、tsconfig及typecheck；安装 --ignore-scripts；无产品依赖变动|
|BASE-03|G2; D2 / mandatory|无远程字体/图片/第三方运行请求与危险HTML执行|PASS|源码检查；stage5_regression：无运行异常/外部运行请求；测试路径内；不是秘密扫描认证|
|BASE-04|原文A–H; owner instructions / mandatory|原始完整档案与获批阶段边界|PASS|REQUIREMENTS_SOURCE 1042行；SHA634d67c…; ROADMAP current authorization；原始文件服务端独立摘要不可得，核对仓库保留副本；无新豁免|
|NAV-01|D3; E2 / mandatory|Library、18详情、Guide、未知路由与正常导航|PASS|browser_smoke、discovery、stage4、stage5及生产构建独立导航检查；生产宿主HTTP404另属Stage6|
|NAV-02|D3.1; D6 / mandatory|URL过滤/查询刷新与Back恢复；输入replace非逐键历史|PASS|discovery_regression; stage5_regression IME/Back；|
|NAV-03|D3.1; D9 / mandatory|预览与详情导航分离，独立title/查看详情|PASS|EffectCard.tsx、discovery、stage3/4；逐项图库视觉检查；|
|UI-01|D4 / mandatory|八个视觉tokens；16px/1.7；h1 28/36；h2 20–24；小字>=13|PASS|styles.css；实际computed styles；18项视觉检查；接受的Stage1界面不重新作个人审美否决|
|UI-02|D4; D3.1 / mandatory|1200容器、响应间距、12/8圆角、1px边框；网格1/2/3/4|PASS|styles.css；实际320–1600断点布局检查；demo内部效果样式与chrome区分|
|UI-03|D4; D9 / mandatory|chrome无装饰动效；2px/2px focus；选中非仅颜色|PASS|styles.css; stage5 actual Tab; chip aria-pressed/inset line；未等同所有屏读器保证|
|SEARCH-01|B5; D6 / mandatory|NFKC、大小写/标点/空白规范化；英文token/prefix；同义词|PASS|normalize.ts/synonyms.ts; search.test; discovery；中文自然描述缺陷见SEARCH-04|
|SEARCH-02|B5; D6; D11.6 / mandatory|12组14输入16目标top3全部保留|PASS|search.test; stage4_regression；既定验收集通过不推导一般描述全部可用|
|SEARCH-03|B5; D6 / mandatory|字段权重5/4/3.5/2/1；精确名称别名前置；匹配来源|PASS|src/search/index.ts; search.test; discovery；一般分词与排序仍FAIL见下一行|
|SEARCH-04|B5 steps3–4; D1; D6; owner §5 / mandatory|中文子串+字符n-gram；正常等义描述可发现正确效果|FAIL|报告EL-IR-001的实际查询、分词、排序摘要；src/search/synonyms.ts:15；EL-IR-001；空结果与第6名偏差|
|SEARCH-05|D3.1; D6 / mandatory|组间AND、组内OR、单选type、搜索在过滤后排序|PASS|filters.ts; search.test; discovery；|
|SEARCH-06|D3.1; D6 / mandatory|计数、清除、active状态、无结果/近似结果清楚标注且不越过滤|PASS|Library.tsx; discovery; stage5 clear focus checks；|
|SEARCH-07|D6; E5 / mandatory|150ms debounce；中文IME组合不提前发布URL/aria-live|PASS|SearchBox/Library; stage5 CDP IME checks；OS Pinyin候选窗未测试|
|CONTENT-01|B4; B7; D5; D7; E4 / mandatory|MVP恰好18项、8类；完整schema/id/slugs/registry|PASS|content.test 58项；18项源码、stage4及逐项图库检查；后续内容波获授权后18不再上限|
|CONTENT-02|B6; D5; D7 / mandatory|中英名称别名、每语言3–6短语、summary/whatYouSee/behavior/useCases|PASS|逐项内容源码阅读、content.test、18详情视觉及交互回归；不是原生中文人工终审|
|CONTENT-03|B6; D7; F4 / mandatory|术语不冒称唯一标准；相似效果区别与related有效|PASS|all18 terminologyNote; content.test strict published related；Typewriter/Glass新增短语保留旧条目；内容准确性须后续人类终审|
|CONTENT-04|D7; E3/4 / mandatory|2–5有意义可编辑参数；默认/范围有效；真实作用|PASS|content.test; browser_smoke/stage3/stage4 param checks；第二参数为已有范围内有意义控制，不以日志作为降低规范豁免|
|PROMPT-01|B6; D8 / mandatory|两语言包含对象、触发、变化、建议数值、实现与可访问性兜底|PASS|18内容逐项源码检查；content.test；browser_smoke/stage3/stage4；静态Glass不虚构动画时间|
|PROMPT-02|D5; D8; D11.8 / mandatory|实时当前参数、单位去重、boolean条件与双语一致|PASS|renderPrompt.test 45; content.test; all-demo browser param/reset；|
|PROMPT-03|D8 / mandatory|当前文本真实复制、API与legacy回退、失败消息及选中文本|PASS|browser_smoke; clipboard_regression 8；受控拒绝/挂起Promise与真实系统Clipboard验证分开|
|PROMPT-04|D8; E5 / mandatory|异步复制版本/跨路由互斥、无陈旧反馈/焦点抢占|PASS|clipboard_regression; clipboard.ts/PromptPanel.tsx；浏览器原生pending不可取消；保持锁不是失败假成功|
|PROMPT-05|D3.2 / mandatory|语言切换、偏好保存、只读可手选提示词|PASS|PromptPanel.tsx; browser_smoke; stage3/4；|
|DEMO-01|D7; D11.3 / mandatory|全部18真实效果且名称与行为匹配|FAIL|下表18项效果核查、组件源码、浏览器套件和视觉检查；16项适用检查PASS；Shimmer对比度/Modal焦点见EL-IR-002/003|
|DEMO-02|D8; D9 / mandatory|Reset/Replay/Pause/Play/Auto按效果类型实现|PASS|DemoStage/EffectCard; browser_smoke; stage3/4；静态样式无Pause/Replay为NOT APPLICABLE|
|DEMO-03|D8; D9; adopted C12 / mandatory|pointer/hover Auto单次约4s路径并回正；可停止重试|PASS|useVirtualPointer; browser_smoke; stage3/4；|
|DEMO-04|D7; E4 / mandatory|三scroll效果内部容器、真实wheel/keyboard/touch/Replay|PASS|stage4 259; useScrollStage; ScrollReveal；触摸为CDP，边缘释放含正文命中|
|DEMO-05|D7.18; D9 / mandatory|Modal进入/陷获焦点、Esc关闭、回焦|FAIL|报告EL-IR-002混合输入实测；ModalScaleFade.tsx:36；EL-IR-002；单独Tab循环与关闭回焦通过，外部点击后失效|
|MOTION-01|D9; adopted C11/C12 / mandatory|减少动态默认无自动/循环；代表帧|PASS|stage5：20路由×4宽度；stage3/4；18项静态视觉检查；|
|MOTION-02|D9; adopted C12 / mandatory|主动Play/Replay/Auto一次有限且可重试|PASS|browser_smoke; stage3/4 finite-end assertions；不将主动一次动画误判违规|
|MOTION-03|D9 / mandatory|可见性暂停、图库最多6个continuous预览|PASS|previewBudget; discovery nine-instance fixture; stage3/4 offscreen；正式collection五个continuous；九实例夹具验证通用上限|
|MOTION-04|D9; G2 / mandatory|transform/opacity优先；允许例外有依据；layout缓存|PASS|all18 demo/hooks source; stage3/4 behavior；Sticky height明确规定；SVG shimmer等效实现保留扫光；不将数字建议硬化|
|MOTION-05|D9; G2 / mandatory|listeners/observers/timers/rAF卸载清理|PASS|source lifecycle review; stage5 18route unmount tracked0；不代表堆内存/GPU完整分析|
|A11Y-01|D9; E5 / mandatory|landmarks/one h1/lang；合理标题层级和名称|PASS|stage5、axe21状态、源码与18项视觉检查；previous P3 groups见备注，按钮名称状态存在|
|A11Y-02|D9 / mandatory|键盘可达/可见focus、chips pressed、搜索可见label、polite计数|PASS|stage5 real Tab; discovery; source；Modal混合操作另FAIL|
|A11Y-03|D9; E5 / mandatory|文本对比至少4.5:1|FAIL|报告EL-IR-003关键帧/像素/对比度摘要；GradientTextShimmer.tsx:10；EL-IR-003；不能由Lighthouse100推导PASS|
|A11Y-04|D9; E5 / mandatory|320/375/768/1280无水平页面滚动、44×44控件、长prompt包裹|PASS|stage5 518项；独立额外断点检查；|
|A11Y-05|D9; E3/4 / mandatory|pointer事件、touch pan-y、hover替代与Auto|PASS|browser_smoke; magnetic boundary107; stage3/4 CDP touch；物理设备未实测|
|A11Y-06|D11.12; E5 / mandatory|Lighthouse>=95 Library与详情；axe无critical/serious|PASS|Lighthouse12.8.2：100/100；axe4.10.3：21状态violations=[]；只accessibility类别，自动审计不是完整WCAG认证|
|A11Y-07|D9 WCAG目标; F3 / recommended|真实屏读器/多浏览器/硬件体验交叉验证|BLOCKED|本环境只有已用Chromium自动化；未运行NVDA/VoiceOver/物理设备；验证覆盖限制；不称已发现跨浏览器产品缺陷|
|GUIDE-01|D3.3; E5.1 / mandatory|中文六要素与糟糕→准确示例并链接真实demo|PASS|Guide.tsx、stage5、视觉检查；|
|MAINT-01|D10; D11.13 / mandatory|结构与README五步添加第19项无框架/schema改造|PASS|scripts/stage5_add_effect_dryrun.py隔离副本实跑；仅临时副本；四门、146临时tests、真实19项集成|
|TEST-01|D11.1; G2 / mandatory|四质量门/无skip-todo/构建可运行|PASS|四门exit0，140tests；开发服务和生产构建预览均实际运行；|
|TEST-02|H6; owner review / mandatory|独立源码+运行实测，非照抄实施结论|PASS|独立报告；1169浏览器检查及自然查询/Modal/对比度/布局补充检查；无产品修复，当前3项FAIL不得闭环|
|PERF-01|D9 / recommended|JS约250KB gzip以下|PASS|构建测量：JS294605/gzip99198 bytes；CSS26156/gzip6618 bytes；建议预算而非擅改硬阈值|
|PERF-02|D9 / recommended|中端手机流畅体验|BLOCKED|无实际中端设备/帧率测试；不能用bundle大小或桌面观察替代|
|FUTURE-01|F1 Stage6; H2 / conditional|prerender/JS-off/hydration/metadata/sitemap/404宿主/CI/headers/部署/回滚|NOT DUE|当前授权止Stage5；docs/ACCEPTANCE Stage6 checklist；未执行或配置Stage6；已有SSR风险是未来准备项|
|FUTURE-02|F3; H2 / conditional|站名域名/许可证/素材/人类18项终审/生产放行|NOT DUE|Stage6门禁；owner限定；本轮术语检查不代替人类最终审阅|
|FUTURE-03|F1 Stage7–12; H3/4 / conditional|内容波、analytics、prompt实机评测、个性化/向量搜索/账号|NOT DUE|未授权；本MVP无新增scope；|
|NA-01|D7 Glass; adopted C02 / conditional|Glass动画时长/Replay循环|NOT APPLICABLE|静态视觉样式；真实backdrop+3背景+参数；不得据此称静态样式为占位|
|NA-02|D9 / conditional|Library scroll/modal实时滚动/打开交互|NOT APPLICABLE|规范允许代表帧；详情真实交互另查；|
|GOV-01|owner §9; delegation / mandatory|standing review policy/矩阵/进度持久化|NOT APPLICABLE|原基线审查不负责治理实施；本次仅发布报告与矩阵，完整policy/进度治理仍由协调方安排；原审查任务范围的NOT APPLICABLE，不豁免项目治理义务；不将本次两文档发布冒称完整policy已实现|

## 18 项逐项覆盖

每项均阅读组件/CSS/内容，检查Library与详情画面，实跑对应浏览器脚本；全部另有Stage5键盘/响应式/清理检查。PASS不包含未实测真实硬件、屏读器或任意参数组合。效果整体状态不豁免搜索层EL-IR-001。

|效果|状态|具体行为核查|证据摘要/复跑入口|发现|
|---|---|---|---|---|
|card-tilt-3d|PASS|3D方向/高光/回正、方向键/drag/Auto|逐项Library/详情视觉与源码检查；scripts/browser_smoke.py；scripts/stage5_regression.py||
|typewriter|PASS|三短语逐字删除/停留/光标；一次留第三句|逐项Library/详情视觉与源码检查；scripts/browser_smoke.py；scripts/stage5_regression.py||
|glassmorphism|PASS|backdrop真实模糊、3背景、fallback静态|逐项Library/详情视觉与源码检查；scripts/browser_smoke.py；scripts/stage5_regression.py||
|card-flip|PASS|hover/click/键盘翻转、轴/时长、背面可见性|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|spotlight-card|PASS|径向亮斑与边框跟随、radius/intensity、键盘/Auto|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|magnetic-button|PASS|80px边缘感应、strength/14px上限/回弹、touch|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|ripple-button|PASS|点击起点/键盘中心、圆波扩散清理、参数|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|sliding-fill-button|PASS|左右fill原点/hover-focus/tap/Auto、宽度时长|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|gradient-text-shimmer|FAIL|固定完整字形+高光位移、时长带宽/暂停；对比度FAIL|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py|EL-IR-003|
|staggered-text-reveal|PASS|词语依次transform/opacity、时长/间隔/距离|逐项Library/详情视觉与源码检查；scripts/stage3_regression.py；scripts/stage5_regression.py||
|aurora-gradient|PASS|三色blur blobs错相transform、周期blur参数/暂停|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|underline-slide-link|PASS|左展开/右收拢、hover/focus/tap/Auto、reduce即时状态|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|shrinking-sticky-header|PASS|内部滚动阈值、72→48高度、返回展开/Replay|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|parallax-scroll|PASS|内滚三层速度0.5/0.8/1、真实位移与参数|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|scroll-reveal|PASS|内滚observer 20%触发、每卡一次/重播、80ms错峰|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|skeleton-shimmer|PASS|48头像+100/80/60条、位移扫光/loaded切换|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|pulsing-dots-loader|PASS|三点scale/opacity错峰、status标签、尺寸/周期|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py||
|modal-scale-fade|FAIL|内舞台dialog缩放淡入/反向关闭/回焦；焦点外逃FAIL|逐项Library/详情视觉与源码检查；scripts/stage4_regression.py；scripts/stage5_regression.py|EL-IR-002|

<a id="rereview-6f596ae"></a>

## 版本补记 — 2026-11-19 — 6f596ae 提交后独立复验

上文完整保留 `59a2429fcf190a6b9d3cf48d487f166c518866a9` 的55条要求、18效果和原 FAIL；这些历史状态不直接描述当前候选。当前产品受审提交 **`6f596ae62462c1de3b38cb926009079cce1f5c6d`**，已整合三源修复：

| 缺陷 / 原实施责任 | 原始修复提交 | 当前独立结论 / 缺陷状态 |
| --- | --- | --- |
| EL-IR-001 / Stage 2 discovery | `04d46ee9664b579f086e7a686ee3cba5ce01655e` | PASS / CLOSED |
| EL-IR-002 / Stage 4 Modal | `56b864575f40009b7c686edff1a85e776e900ed8` | PASS / CLOSED |
| EL-IR-003 / Stage 3 Shimmer | `3b04323e55b028c7293db628205b71db74dc6b5c` | PASS / CLOSED |

证据来源：协调方本次交接转交的独立审查员对上述精确提交的提交后复验结果，明确三项产品问题 PASS、可关闭。此处是证据摘要与状态同步，不冒充本工作者独立实测；正式[独立复验报告](reviews/rereview-stage-5-independent.md)已归档，产品结论绑定6f596ae，文档最终复验绑定 `b0277596dc26a3598a669bb665ddbb055a074ae3`。本轮文档自检和后续独立验收分别记录于[最新进度](PROGRESS.md)。

| 原矩阵 ID / 效果 | 此版本状态 | 补充独立证据 / 可复跑入口 |
| --- | --- | --- |
| SEARCH-04；关联 SEARCH-02/03/06/07 | PASS | 原失败查询及7个新措辞通过，123名称/别名首位，14输入/16目标保留；新增浏览器23/23。见[搜索回归](../scripts/el_ir_001_search_regression.py)、[搜索单测](../src/search/el-ir-001.test.ts)及旧 discovery/Stage5 回归；新增探针结果见最终独立报告。 |
| DEMO-05；关联 A11Y-02；modal-scale-fade | PASS | 鼠标、模拟触控、程序聚焦、双向Tab、Esc、参数实时变化、Reset/卸载通过；新增88/88。见[Modal回归](../scripts/el_ir_002_modal_regression.py)。 |
| A11Y-03；gradient-text-shimmer | PASS（所测范围） | 独立20场景132帧最低5.069:1；密集24场景376帧最低4.912:1，均超过4.5:1；不是以axe分数代替像素证据。见[密集对比度脚本](../scripts/el_ir_003_shimmer_contrast.py)，独立采样见最终报告。 |
| DEMO-01 | PASS（原覆盖及本次修复复验） | 旧18效果覆盖保留，原Modal/流光偏差已在上述受审SHA复验通过；旧Chromium合计1169/1169。 |
| TEST-01/02；A11Y-06 | PASS | 独立四门、160单测；旧Chromium1169/1169；Library及Tilt两页Lighthouse accessibility各100；axe含打开弹窗21状态零违规。复跑入口见[README](../README.md)、[审计脚本](../scripts/stage5_audit.py)。不得将自动审计外推到未测环境。 |
| GOV-01（现在适用） / EL-IR-004 | PASS；P3 / CLOSED | 基线NOT APPLICABLE仅指原审查任务范围；文档修正提交 `b0277596dc26a3598a669bb665ddbb055a074ae3` 已独立确认当前快照、源SHA、证据映射与历史保留一致；正式报告归档本次关闭结论。 |
| A11Y-07、PERF-02 | BLOCKED（覆盖限制保留） | 仍无真机/中端设备、跨浏览器、原生屏读器验证；不虚构产品缺陷或已测通过。 |
| FUTURE-01/02/03 | NOT DUE | Stage 6及以后未授权；预渲染/JS-off/hydration和生产发布仍属未来门禁。 |

未受三项修复影响的其他条目沿用上文绑定旧基线的独立证据及本次旧回归结果，不把本补记当作所有硬件、所有参数组合的新全量认证。**最终总体 PASS；EL-IR-001/002/003/004 均 PASS / CLOSED。** 产品依据6f596ae独立实测，文档依据b027759独立复核；[正式报告](reviews/rereview-stage-5-independent.md)说明范围和限制。 main 尚未合并本候选，本轮不 PR、合并或部署。
