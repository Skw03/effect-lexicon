# Effect Lexicon 独立基线审查 — CHANGES REQUIRED

审查日期：2026-11-19。审查者为独立委派的审查任务，未实现本候选。本文件将既有独立审查记录整理为获授权的公开版本，仅移除环境路径与未公开附件引用，保留原始结论、发现、复现和验收条件。此步骤仅发布两份审查文档，不修产品、不开始Stage6、不部署。

## 版本、范围和基线

- 仓库：https://github.com/Skw03/effect-lexicon.git
- 起止两次独立 `git ls-remote` 均确认 main 为 **59a2429fcf190a6b9d3cf48d487f166c518866a9**；merge commit确为PR #4，parents为 `d0f2a1f9b948d2ac1a0132a02a1a44dbdf15ad3d` 和 `1a9f4ce3390e53123d22b299fc0397a2fefb1776`。后者仍为远端stage-5-hardening头。candidate与merge的文件diff为空。
- 审查使用精确基线的隔离checkout，起止工作树干净；原有Stage3旧checkout保持不变，无未知未提交更改被覆盖。公开文档分支为 `review/baseline-0-5`，基于上述精确SHA。
- 实际产品为Stage5：18效果/8类、搜索过滤/URL、详情参数/双语提示词、Guide、可访问性/减少动态/维护流程已实现。仓库既有ACCEPTANCE记录此前H6通过，本轮并不照搬该结论。当前授权到Stage5为止；本次发现要求重开受影响Stage2/3/4及Stage5验收，不进入Stage6。
- 全文基线：`docs/REQUIREMENTS_SOURCE.md` 1042行，A–H均在，SHA-256 `634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`；同时审阅AGENTS、SPEC、ROADMAP、PROGRESS、ACCEPTANCE、README与测试。使用保留原始文档副本；没有原Library源文件的独立服务器摘要可进一步证明其历史传输真实性。
- 已明确授权的Stage1界面接受、Stage2–5顺序自动推进/审查后合并继续有效，不恢复已被取代的逐阶段人工批准。源档不改；Stage1静态样式无时间例外、related分阶段后严格有效、分离预览导航、有限手动减少动态等按现行明确修订核查。日志中“通过”不是新产品豁免。额外第二参数、等效SVG扫光等按实质功能与约束检查，不因实施记录存在就自动放行。

## 结论

**CHANGES REQUIRED。三项已确认 P2 / FAIL，当前不得继续把Stage5称为无未解决偏差。** 四门、1169项既有浏览器检查及自动可访问性门全部通过，仍不能覆盖下述三个真实缺陷。没有P0/P1发现；没有需要用户选择产品方向才能修复的当前冲突。SUN可按原授权派发普通范围内修复，提交候选后由本独立审查者按验收条件复验，不能凭实施者“已修复”关闭。

详细矩阵：[REQUIREMENTS_CHECKLIST.md](../REQUIREMENTS_CHECKLIST.md)；包含55条要求/条件/限制和18效果逐项覆盖。PASS仅限列出的证据；未测硬件/屏读器明确BLOCKED，不伪称产品违反；未来授权阶段NOT DUE。

## EL-IR-001 — P2 — 自然中文描述漏搜及排序偏差

**状态：FAIL / OPEN。责任：SUN派回Stage2 discovery实施任务，并回归Stage3/4内容与Stage5搜索验收。**

来源：原文B5 L132“Goal: an everyday description leads to the right entry”；B5 step3 L140“match by substring and character n-grams against the index, plus the synonym list”；D§1/D§6；本次owner §5明确要求normal equivalent phrasing。D§6中文runs as substrings不禁止B5要求的n-grams，二者可同时实现，不是选择较弱规则的理由。原14固定输入的top3硬要求本轮全部通过，但不能代替一般描述目标。

位置：`src/search/synonyms.ts:15–25`（只将整段汉字作为一个term，再提取已知同义词组，无字符n-gram）；`src/search/index.ts:22–46`（单整句或高权重泛指针词主导coverage与Fuse）。路线 `/`。

复现（本地生产构建预览）：

1. 搜索 `鼠标移到按钮上颜色从左往右填满`。
2. 前三为3D Tilt/Spotlight/Magnetic；Sliding Fill在第6位。此句直接等义于已有“鼠标移入按钮背景从左边填满”，并非无关术语或故意错字。
3. `点按钮后圆圈向外扩散`、`点击按钮时圆圈向外散开` 均返回零真实搜索结果；`文字下面出现一条线`、`卡片向上移动并慢慢显示`也零真实结果。它们分别描述Ripple、Underline、Reveal的基本视觉。

证据摘要：独立探针记录分词与全部hits，并在生产构建实际UI确认上述顺序。另测15条中英文自然描述，多数成功，未把单一失败泛化为全部搜索失效。原固定query测试没有覆盖这些分词缺口。

修复/验收：实现有意义的中文子串/字符n-gram或等效可靠匹配，避免泛词“鼠标”淹没对象/动作；上述描述能给出相应效果（建议采用原验收相同top3标准），增加措辞变化的回归，保留14输入/16目标、exact alias/name优先、匹配提示真实来源、空结果近似标记及filter交集。不能只把这几句话逐条加入白名单，或降低原断言。

## EL-IR-002 — P2 — Modal外部点击后焦点逃逸，Esc不能关闭

**状态：FAIL / OPEN。责任：SUN派回Stage4 Modal实施任务，Stage5可访问性复验。**

来源：原文D§7 item18 L500：“focus moves into the dialog and is trapped, Esc and a close button close it, focus returns to the opener”；D§9 L612只允许Modal在打开期间陷获焦点；SPEC对应§7/§9。舞台内视觉遮罩并不豁免焦点要求。

位置：`src/demos/ModalScaleFade.tsx:36–45`；外层局部 `onKeyDown`只截获弹层内部事件；`.modal-layer`是舞台内绝对定位，外部参数仍可获得focus。路线 `/effects/modal-scale-fade`。

复现：打开对话框 → 初始焦点正确在“关闭对话框”，Tab四次也循环正确 → 点击舞台外“时长”range（`#param-duration`）→ activeElement变为该range，但`aria-modal=true`仍在 → Tab到`#param-startScale` → Esc → 对话框仍打开。正常用户混合鼠标/键盘操作，不需要devtools或programmatic focus。

证据摘要：独立探针记录初始/Tab后焦点在“关闭对话框”，外部点击后为 `param-duration`，下一Tab后为 `param-startScale`；Esc后仍存在 `aria-modal=true`，并核对源码事件边界。既有Stage4只验证焦点尚在弹层内的Tab/Esc/close，所以通过并未排除本问题。

修复/验收：打开期间focus真正保持在dialog（包括点击/触碰外部后，或选择符合modal语义的外部不可交互策略）；Esc始终可关闭，关闭/重置/卸载清理后恢复合理焦点，不能残留全局阻止或focus trap。保持演示局限舞台、两参数实时、normal/reduced、两向Tab、关闭按钮与opener恢复；为混合输入和卸载加回归。不要仅改成`aria-modal=false`来规避既定要求。

## EL-IR-003 — P2 — Gradient Text Shimmer活动高光阶段文字对比度不足

**状态：FAIL / OPEN。责任：SUN派回Stage3 Shimmer实施任务，Stage5视觉/可访问性复验。**

来源：原文D§9 L611 “Text contrast at least 4.5:1”；E Stage5 L784“color contrast of 4.5:1 or better”；D§7 item8 L490的亮带扫过要求仍需保留。规范未豁免demo文字，也没有将此阈值改成大字3:1。

位置：`src/demos/GradientTextShimmer.tsx:9–15`（white .85亮带覆字）；`src/styles.css:28`附近 `.demo-stage`背景 `#F5F5F4`。共享组件影响详情和Library。代码引用以该SHA为准。

复现：默认参数，正常运动，打开 `/effects/gradient-text-shimmer`；光带经过字形时文字变近白并消隐。为了可重复测量，本轮仅在测试浏览器通过Web Animations API将原有CSS动画暂停于1250ms（周期2500ms），未改变颜色、样式、产品源码或运行逻辑。

证据摘要：独立浏览器关键帧采样并读取实际截图像素。图像实际背景RGB(245,245,244)；选取远离抗锯齿边界（四邻域差<=8）的字形内部像素RGB(239,223,247)，相对背景对比度约 **1.162:1**；检测区域有1203个字形内部样本低于4.5。高光横移矩阵为420px，截屏可见“发”等字显著发白。不是只拿CSS字符串推断。这个读得出的SVG文字即使以role=img提供名称，也不自动豁免视觉对比度。

修复/验收：在保留三色固定字形和明显左→右扫光、时长/带宽参数、暂停/重播与减少动态有限播放的同时，确保实际字形所有关键动画相位达到规范4.5:1（可在原视觉方向内调整色阶/高光/局部背景）。检查Library与detail、默认及带宽/时长边界、静态reduce状态；加真实颜色/关键帧验证，不以axe零违规替代。当前axe对SVG复杂背景无法完整判定，正是人工补充检查要覆盖的范围。

## 原始独立审查执行证据

所有安装禁用生命周期脚本。产品 `npm ci --ignore-scripts`，未改package/lock。Lighthouse 12.8.2、axe-core 4.10.3固定版本在仓库外独立安装；使用既有Python Playwright与Chromium 156.0.8078.79。以下是原始审查运行结果，并非本次文档发布重新运行浏览器的结果。原始日志、截图、附件与补丁不随本文公开。

|门禁/脚本|原始独立审查结果|复跑入口或证据摘要|
|---|---|---|
|typecheck/lint/test/build|exit0；140 tests，4文件，无skip/todo|`npm run typecheck` / `lint` / `test` / `build`|
|browser_smoke|67/67|`python3 scripts/browser_smoke.py`|
|clipboard_regression|8/8|`python3 scripts/clipboard_regression.py`|
|discovery_regression|68/68|`python3 scripts/discovery_regression.py`|
|stage3_regression|142/142|`python3 scripts/stage3_regression.py`|
|magnetic_boundary_regression|107/107|`python3 scripts/magnetic_boundary_regression.py`|
|stage4_regression|259/259|`python3 scripts/stage4_regression.py`|
|stage5_regression|518/518|`python3 scripts/stage5_regression.py`|
|真实Chromium功能合计|1169/1169；七脚本全部exit0|以上七个脚本|
|第19项隔离干跑|四门、146临时单测、19项集成通过；正式src前后hash一致|`python3 scripts/stage5_add_effect_dryrun.py`，只在临时副本添加|
|新axe-core全规则含name mismatch|21状态均violations=[]，0 critical/serious|`python3 scripts/stage5_audit.py`；工具配置见README|
|新Lighthouse Library/Tilt|accessibility各100，阈值95|12.8.2；只跑accessibility；README复跑命令|
|独立自然查询/Modal混合输入|确认EL-IR-001/002|本文逐步复现与观测|
|独立真实字形对比|确认EL-IR-003|本文1250ms关键帧、像素与对比度摘要|
|独立布局tokens/额外断点|320/375/640/768/1024/1280/1360/1600，无横溢；1/2/3/4列|实际computed style与页面scrollWidth检查|

功能脚本跑本地Vite开发服务；axe/Lighthouse、独立Modal/搜索UI/截屏/对比度/layout跑本地生产构建预览。分词诊断通过dev模块读取同一源码，实际搜索UI另在dist验证。查阅测试并保留所有断言，没有删除或弱化。补充测试第一次误用textbox查找type=search输入超时，改用实际`#effect-search`后完整重跑；该定位器错误不是产品缺陷，亦未被计入PASS。独立补充探针未进入产品或本次公开提交。

全部18个demo的组件/CSS/内容和图库/详情均查过；图库18张截图与详情18张截图逐项检查，动态行为由真实脚本检查矩阵/文本/时间终态/scrollTop，不以截图代替交互。参数/双语当前copy、legacy/失败与竞态、搜索/filter/history/清除/IME、Guide、unknown route均覆盖。详细效果列表和每项行为在矩阵，不以小样本宣称全库。

## 限制、可选项和未来工作

- **BLOCKED（证据覆盖）**：没有物理手机/中端GPU帧率、Safari/Firefox、NVDA/VoiceOver、原生OS Pinyin候选窗。触屏为Chromium CDP，reduced-motion为浏览器模拟。没做堆内存压力分析、所有颜色组合/所有极端参数全排列。不能声称完整WCAG认证。默认与脚本参数场景之外的未测行为不获PASS。
- 自动axe在稳定reduce状态跑；Lighthouse默认运动只跑accessibility，不代表performance/SEO/best practices。新跑的100/零违规是门禁证据，不推翻三个独立复现。
- 既有P3“提示词语言”与“演示背景”div aria-label无group语义重新检查：按钮各有清楚名称、pressed状态；原规范没有要求这两组一定具有可访问组名。**保持OPTIONAL建议，不列强制FAIL**。若后续改group，需独立复验而非追溯扩大本轮验收。
- C14 SVG裁剪扫光保留完整字形/移动高光且只transform，属等效实现；没有仅因不是background-position判缺陷。静态Glass、Library滚动/Modal代表帧为明确允许，NOT APPLICABLE于实时播放要求。
- **NOT DUE**：Stage6预渲染/JS-off/SSR/hydration/SEO/host真实404、安全头、CI/发布管线、域名/许可证/生产烟测/回滚与人类最终审阅；Stage7+内容扩展及analytics等。既有文档列SSR风险不是当前Stage5失败，也未执行相关修复/部署。
- 原文H2“merge触发部署”与“agent不生产部署”的未来流程冲突，精确原句为H2 L984 “On merge to main, deploy to production using the host’s official integration.” 与L986 “Do not tag v1.0.0 and do not deploy to production yourself.”，另有AGENTS生产禁令；目前owner明确不许Stage6，直接阻断该未来入口，无需为本轮做新选择。未来最小决定：明确preview与production触发/谁批准生产。不能由本次review默认授权。
- 仓库PROGRESS/ACCEPTANCE保留阶段提交前的历史交接语句，实际main已合并由本轮Git独立确认；不是未合并产品。完整standing policy及后续纠正记录仍由协调方安排；本次仅获准发布本报告和要求矩阵。

## 交接与关闭条件

SUN分派EL-IR-001/002/003给原受影响实施任务（或明确继任者），保留原功能，提交精确修复SHA和自检证据。审查者在隔离checkout独立复验上述接受条件与受影响回归，按相应门禁再评定。三项未修复、未关闭；本轮没有产品corrections。ordinary修复已在授权范围，不需要重新逐项问用户；若修复拟改变规范/重大视觉/栈，再提出精确冲突和最小决定。

本公开记录与 [要求矩阵](../REQUIREMENTS_CHECKLIST.md) 是同一历史基线审查的持久化记录；不附原始日志、截图、JSON、压缩包或补丁。不能把这份CHANGES REQUIRED记录引用为PASS。后续候选变化必须绑定新SHA复验，保留本报告的历史结论。

## 审查文档公开保存检查

本次只新增本报告与 `docs/REQUIREMENTS_CHECKLIST.md`。已核对55条要求、18效果覆盖及三项原始验收段落不变；公开内容限定为项目要求、复现、技术证据摘要与测试结果。原始日志、图片、环境绝对路径及非项目数据不随提交发布。文档发布前重新执行 typecheck、lint、test、build 均通过（140单测），并执行 `git diff --check`。此检查不重判产品PASS，也不关闭三个FAIL；没有重跑未变更产品的浏览器套件。
