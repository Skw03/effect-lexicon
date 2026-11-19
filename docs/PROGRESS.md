# Effect Lexicon / 动效词典 — Progress

## Current stage

Stage 5：独立 H6 与阶段验收已通过，协调方已明确授权提交并正常推送 `stage-5-hardening`。验收基底 `d0f2a1f9b948d2ac1a0132a02a1a44dbdf15ad3d`，受审候选SHA-256 `8170aea9b25f5305e69e7bf02e4821421befe887fc2419de51961956c2d345d7`（79,584 bytes / 19 paths）。本轮仅补充本日志和ACCEPTANCE，代码/测试保持受审字节一致。指定 effect-lexicon-cloud `/workspace/effect-lexicon`；唯一origin `https://github.com/Skw03/effect-lexicon.git`。实际提交/推送结果以交付消息及远端核验为准。不创建PR、不合并、不部署、不进入Stage 6；Library上传仍停止。

Stage 4：独立 H6 与阶段验收已通过；已按协调方授权提交并正常推送 `stage-4-demos-b`。实现提交 `0a7dd887fe988010193d693e8d45ba165b7a494f`；本交付回执为单独文档提交，最终分支头以远端和交付消息为准。代码与测试保持通过候选一致。不创建 PR、不合并、不部署、不开始 Stage 5。
验收基底：`67bd5fcad2fa316a729d699b741e0da5a5230de3`；分支 `stage-4-demos-b`；指定 effect-lexicon-cloud `/workspace/effect-lexicon`；origin `https://github.com/Skw03/effect-lexicon.git`。历史 Stage 3 验收/交付记录保持如下。

### H1 summary (11 lines)

1. 产品：静态、内容驱动的中英双语 UI 效果词典，用真实演示帮助用户找到名称并复制准确提示词。
2. 顺序：Stage 0 治理 → 1 三效果纵向闭环 → 2 发现 → 3 共 10 效果 → 4 共 18 效果 → 5 加固 → 6 上线准备与人工发布。
3. 成长阶段：7 内容波次、8 反馈、9 提示词验证、10 个性化、11 搜索升级、12 社区账户，均按 ROADMAP 门槛和人工批准开放。
4. Stage 1 将交付类型、提示词渲染、详情页及 Tilt / Typewriter / Glassmorphism 三个真实效果；本轮不开始。
5. 规则一：以 SPEC、ROADMAP、AGENTS 和 PROGRESS 为依据；冲突记录后请人确认。
6. 规则二：一次一个阶段，只做授权范围，保留无关改动，下一阶段必须人工批准。
7. 规则三：依赖与后端等受限能力须按规则批准，不引入秘密、运行时外部请求或无授权素材。
8. 规则四：只在授权分支和指定云端执行，不改 main、不强推、不代替人合并或发布。
9. 规则五：适用检查必须真实运行，不弱化验收；无应用的 Stage 0 如实记不适用/未运行。
10. 规则六：效果必须真实、可键盘与触屏操作、尊重 reduced-motion、清理资源，双语提示词与演示一致。
11. 本轮交付后等待 Stage 0 审阅及下一阶段明确授权，不自动进入 Stage 1。

## Log (newest first)

### 2026-11-19 — Stage 5 — 独立 H6 通过及提交推送授权

1. **Summary**：未参与实现且未继承开发会话的原生审查员，在同一执行器的干净基底隔离目录应用受审补丁并独立实跑H6，结论 `ready to merge（Stage 5范围）`、无阻断缺陷。协调方随后明确授权本轮提交及正常推送，未授权PR/合并/部署。
2. **Files changed**：相对受审候选仅 `docs/PROGRESS.md`、`docs/ACCEPTANCE.md` 增补验收结果和限制；其余17个候选路径逐文件SHA保持一致。受审补丁79,584 bytes、19路径、SHA-256 `8170aea9b25f5305e69e7bf02e4821421befe887fc2419de51961956c2d345d7`；不修P3，不修改SPEC/REQUIREMENTS_SOURCE、依赖/schema或产品内容。
3. **Commands/results**：提交前核对完整工作树diff与受审SHA一致；origin正确、HEAD为精确基底、远端main未变且同名远端分支不存在；现有默认Git作者/提交者有效，未修改配置或输出邮箱。重读治理/验收/日志，精确核对19路径，不包含原始运行日志、审计附件、patch、构建产物、令牌或新增个人数据。本轮重新运行typecheck/lint/test/build均exit0，140 passed、0 skip/todo；JS gzip99.20kB，CSS gzip6.62kB；git diff --check通过。未重复未变更代码的浏览器套件，独立实跑证据见下项。
4. **Acceptance（独立审查实跑）**：四门通过，**140 Vitest / 0 skip/todo**；**1169/1169 Chromium**（67+8+68+142+107+259+518）；Lighthouse12.8.2首页/Tilt **100/100 accessibility**，与开发自检形成两轮均100；axe4.10.3 **21状态、0 critical/serious，全部violations空**。第19项隔离干跑四门、146临时单测及真实浏览器集成通过，正式内容18项不变。独立探针另复现旧基底两清除BODY和IME草稿泄露，验证候选实际Tab/Space清除回焦及下一Tab、550ms组合不更新、中文提交/清空/Back。原始审查与日志保留本执行器 `/tmp/h6-independent/`，未外传。
5. **Deviations / limits**：两项非阻断P3语义建议保留：PromptPanel.tsx:29、Glassmorphism.tsx:10普通div的aria-label分组语义不可靠；未立即修复。axe incomplete含该语义及复杂背景/textarea对比度人工项；不宣称完整WCAG认证。真机、其他浏览器、原生屏读器、OS Pinyin窗口未验证。SSR/server snapshot/hydration及JS-off风险仍属未执行Stage6清单。
6. **Open questions**：无本次代码交付阻塞；原Library上传拒绝不重试、不改出口。GitHub目标仓库的本轮推送依据既有用户阶段授权及协调方明确指令执行，与Library上传无关。
7. **Next step**：四门及内容一致性通过后，精确暂存19路径，提交并正常推送该阶段分支；核验远端SHA等于本地提交、main仍为基底、工作树干净。Stage5到此停止，不进入Stage6。


### 2026-11-19 — Stage 5 — 私有附件出口受阻，候选已保留

- 完整候选与审计自检已完成；补丁与无截图审计证据包保留在指定环境 `/tmp/effect-stage5-library/`，工作树仍未提交。
- 当前Library技能要求多文件使用同一官方prepared upload helper。正常沙箱运行在tools/list阶段报network，尚无上传会话或Library文件ID。
- 同一官方helper申请允许的环境网络执行时，被自动审批明确拒绝：上传非公开源代码与审计证据到Library，缺少可信用户原文授权及私人受控目标的验证。该次操作未执行，不是已上传或结果未知。
- 随后检查可见用户历史，找到Stage2–5项目实施/验收授权，但未找到明确私有附件上传授权。未重试被拒操作、未改用其他出口或变更网络设置。
- **仅附件保存阻塞**：需要协调方提供相关可信用户证据或获得两个具体文件的私有Library保存批准。独立H6可先在本指定环境检查候选；无Library ID/版本可报告，不冒称成功。补丁摘要以最终交付消息为准。

### 2026-11-19 — Stage 5 — 指南、加固与完整开发自检候选

1. **Summary**：实现中文 `/guide` 六要素、原“卡片动起来”与准确Tilt短提示词对比、真实详情跳转及header/footer入口。修复现场复现的清除焦点和Pinyin组合查询泄露；触摸目标、可读提示词与辅助名称加固；正式内容保持18项/8类。完成13项中文报告及未执行Stage 6清单。仅开发自检，不预报最终H6。
2. **Files changed**：`src/pages/Guide.tsx`、main/styles、Library/SearchBox；CardFlip/MagneticButton仅辅助名称改描述；Sticky/Skeleton仅44px目标；content.test新增源模板token严格门；新Stage 5功能/axe/第19项干跑三个Python脚本；smoke适配已实现Guide（未知路径门仍保留）；README、ACCEPTANCE、本日志。AGENTS/ROADMAP仅按授权澄清旧Stage 2 worker限定的历史性质，不改阶段顺序/放行边界。SPEC、REQUIREMENTS_SOURCE、Effect schema、依赖/锁文件、18份内容不变。
3. **Commands/results**：
   - 起始origin正确、工作树干净，本地旧work为67bd5fc；`git ls-remote origin refs/heads/main refs/heads/stage-5-hardening`精确返回main=d0f2a1f9b948d2ac1a0132a02a1a44dbdf15ad3d、无同名分支。fetch后从精确基底新建stage-5-hardening，未写main、未覆盖并发改动。
   - 重读治理/路线图/日志/SPEC及原文E Stage5、D §3.3/7/8/9/10/11、H6。产品 `npm ci --ignore-scripts --cache /tmp/effect-npm-cache`成功232包，无lifecycle/升级。固定审计官方npm包Lighthouse12.8.2、axe-core4.10.3在仓库外`/tmp/effect-stage5-audit`独立安装，`--ignore-scripts --save-exact`，不更改产品栈/网络。
   - 四质量门exit0；Vitest **140 passed，0 skip/todo，4文件**。JS294605 bytes / gzip默认level6 **99198 bytes（99.20kB）**，CSS26156 / gzip6618。构建产物不入patch。
   - 历史浏览器最终完整实跑：smoke **67/67**、clipboard **8/8**、discovery **68/68**、Stage3 **142/142**、magnetic boundary **107/107**、Stage4 **259/259**；新Stage5 **518/518**。合计**1169/1169**。Chromium156.0.8078.79，dev5173；无捕获到运行错误/外部运行请求。旧脚本除smoke的Guide用例无改动。Stage5逐页四宽度实际Tab遍历、44px、16px提示词换行、正常六交互散焦恢复、18详情卸载timer/rAF归零；旧脚本继续覆盖触屏模拟、有限手动播放、真实复制/参数、模态焦点、预算与离屏。
   - 真实审计访问构建preview4173：Lighthouse12.8.2 accessibility **首页100 / Tilt100**，默认mobile，仅跑accessibility；axe4.10.3全18详情+Library+Guide+打开modal共**21状态，0critical/0serious，全部violations为空**，额外开启label-content-name-mismatch实验规则。最终原始JSON禁用整页截图采集，私有证据附件保存，不上传截图或浏览器二进制。
   - 第19项只在隔离`/tmp/effect-stage5-nineteenth-*`按README五步干跑：四门成功、新项真实预览/详情/搜索首位/有限播放/参数/双语真实剪贴板/关联通过；正式src逐文件前后hash相同。正式分支没有第19项。可复跑脚本保留，临时样例不属于产品目录。
   - Stage6实证探针仅在/tmp：server render useReducedMotion报window is not defined；PromptPanel报Missing getServerSnapshot；构建Tilt详情JS-off h1=0/root空。记录待后续处理，不提前实现SSR。语言偏好与reduced-motion hydration一致性仍需后续设计/验证。
4. **Acceptance checklist**：SPEC §11十三项各自的证据/命令/限制见ACCEPTANCE。本轮自检均通过；自动审计不等于完整WCAG或屏读器验证。候选交付后等待协调方独立H6，不声明最终验收/可合并。
5. **Deviations / fixes**：修前两清除Enter后均落BODY；组合ka pian等待350ms会发布URL并18→3结果，修后草稿隔离且最终中文准确。Lighthouse初次虽100仍发现两处label-content-name-mismatch，实际修复并加axe规则；Sticky链接32px→44px、Skeleton checkbox13px→44px、提示词14→16px。一次discovery受开发重载影响失败，冻结产品文件后原样全跑68通过；初次干跑的“只返回一项”错误假设改为规范首位断言；审计脚本引号语法错误修正后全跑。未删/跳/弱化既有测试。唯一CSS布局动画例外仍为SPEC明确的Sticky height；真实文字更新和Replay内部scrollTop驱动已逐项说明。
6. **Open questions / limits**：无已知Stage5实现阻塞；未做物理手机、Safari/Firefox、原生屏读器、OS Pinyin UI、中端手机帧率或生产环境审计。Stage6所有人类选择、独立预览/预渲染/metadata/安全头/CI/部署/DNS/回滚/JS-off验证仅清单；生产必须用户单独明确放行，不能仅因合并无意发布。
7. **Next step / patch**：新增文件intent-to-add纳入完整`git diff --binary HEAD`，不实际暂存内容/提交；原树reverse --check、干净基底apply --check/apply、逐文件字节相等、reverse恢复基底验证后保存私有Library patch及原始审计文本附件。文件名/SHA/字节/路径数/Library ID版本在交付消息给出，避免补丁自引用。独立复跑按README四门、全部七功能脚本、axe/Lighthouse及第19项隔离脚本。收到协调方独立H6后的明确指令才提交推送；本轮到此停止。


### 2026-11-19 — Stage 4 — 正常推送交付回执

1. **Summary**：已验收 Stage 4 实现提交 `0a7dd887fe988010193d693e8d45ba165b7a494f` 已正常推送 origin/stage-4-demos-b；本回执作为单独文档提交保存，最终分支头见远端及交付消息。
2. **Files changed**：相对实现提交仅 docs/PROGRESS.md；其余代码/测试逐文件与已验收候选相同，SPEC/原需求不变。
3. **Commands/results**：39 路径精确暂存、`git diff --cached --check` 通过；`git commit -m "feat: complete accepted Stage 4 demos batch B"` 与 `git push -u origin HEAD:refs/heads/stage-4-demos-b` 成功，新建远端分支，无强推。ls-remote 核实任务分支为上述实现 SHA，main 保持 `67bd5fcad2fa316a729d699b741e0da5a5230de3`，实现推送后工作树干净。本轮四质量门再次通过（139 单测），仅本日志后续变化不重复功能测试。默认身份沿用，无配置改动或姓名邮箱记录。
4. **Acceptance**：独立 H6 通过及正式授权见前条；259 Stage 4 +391 历史 Chromium，另 35 组独立手势/下划线验证。提交内容仅在通过候选基础上补日志。触摸为 CDP 模拟；不声称 Stage 5 审计或真机验证。
5. **Deviations**：无。未执行远端输出的 PR 建议链接，未开 PR、合并、部署或开始 Stage 5。
6. **Open questions**：无交付阻塞；后续流程由协调方安排。
7. **Next step**：正常推送本回执后，验证最终本地/远端 SHA、原始 main、干净工作树和非日志候选字节一致，然后停止。


### 2026-11-19 — Stage 4 — 独立 H6 通过，提交推送授权

1. **Summary**：协调方确认 Stage 4 独立复验通过，明确授权原 effect-lexicon-cloud / Skw03/effect-lexicon 工作区以默认 Git 身份提交并正常推送 stage-4-demos-b。受审完整 patch v1 SHA-256 `fb597658d9c96ef415b1ff332e294c5ba1ade6849d1a1457acbf78e953755565`，133973 bytes / 39 paths，基底 `67bd5fcad2fa316a729d699b741e0da5a5230de3`。
2. **Files changed**：相对已验收候选仅本日志；原 39 路径全部精确保留。代码、测试、SPEC、原始 REQUIREMENTS_SOURCE、schema、依赖/锁文件不再改动。
3. **Commands/results**：重读治理/路线图/最近日志，核对 origin、分支、HEAD、远端 main、同名远端分支和工作树。修改日志前完整 diff 与受审 patch 逐字节相同，签名/字节/39 路径一致，无额外 untracked 或实际暂存内容；默认 author/committer 可用，未修改配置或公开姓名邮箱。远端 main 仍为验收基底、同名远端分支不存在。本轮重新运行 typecheck、lint、test、build 全部返回 0，139 passed / 0 skip / 0 todo；JS gzip 97.82 kB、CSS gzip 6.50 kB。未对未变更功能重复浏览器回归；使用已通过独立证据及原自检记录。
4. **Acceptance**：协调方提供的独立 H6 结果：`npm ci --ignore-scripts`、typecheck/lint/test/build 全通过；139 单测；Chromium Stage 4 259 项 + 历史 391 项，另 35 组独立手势/下划线检查；18 词条/8 类、12 组/14 搜索输入/16 目标，独立确认上下滚交接与 reduced-motion 下实际下划线状态。触摸是 Chromium CDP 模拟，不是物理手机。本阶段正式验收通过；不扩大为 Stage 5 审计或发布验收。
5. **Deviations**：无实现变化；默认 Git 身份沿用、不强推、不改 main，不开 PR/合并/部署/Stage 5。
6. **Open questions**：无本轮交付阻塞；后续由协调方安排，不自动开始下一阶段。
7. **Next step**：仅暂存原候选 39 路径，校验除日志外逐文件 SHA-256 与已验收候选一致、暂存 diff 无空白错误后提交并正常推送。成功后写入独立文档回执并再次推送，核对远端最终 SHA、main 不变、工作树干净及实现/测试等价；最终提交头见交付消息，避免日志自引用。


### 2026-11-19 — Stage 4 — 吸收独立 H6 两处修复，等待最终放行

1. **Summary**：按协调方明确续修指令，仅解决 Scroll Reveal 原生触屏边界释放与 Underline reduced-motion 状态反馈两处。协调方 H6 的分数高度对照证据指出卡片正文实际滚动高度 1101.375px、DOM scrollHeight 1101 的 Chromium 底部舍入问题；采用其已验证的局部 `line-height: 1.5` 方向。本工作者随后自行实跑原完整脚本与新增边界检查，原失败门通过。没有把 H6 提供的 231/231 实验结果直接当成本工作者结果。
2. **Files changed since blocked candidate**：恰好五个路径：`src/demos/ScrollReveal.css`、`ScrollReveal.tsx`、`UnderlineSlideLink.tsx`、`scripts/stage4_regression.py`、本日志。完整 Stage 4 patch 仍为原 39 路径。Scroll Reveal 仅给 `.scroll-reveal-card` 设置 `line-height: 1.5`，保持原生换行和内滚；撤掉此前无效试改引入的 settled state/onAnimationEnd 清理和卡片临时 pointer-events 规则，恢复仅由 seen 记录 once 的原模式；完整回归证明不需要这些试改。静态首页外层的禁止指针规则保留。Underline 取消 hover/focus 激活上的 `!reducedMotion` 条件，仍保留 reduced-motion 的 0ms 过渡、tap、Auto 与清理逻辑。
3. **Commands/results**：
   - 重读 AGENTS、ROADMAP、最近日志、SPEC §7/8/9 与原文 E Stage 4。原指定环境/checkout；HEAD=`67bd5fcad2fa316a729d699b741e0da5a5230de3`、分支 `stage-4-demos-b`、origin 均正确；远端 main 仍为该基底，无同名远端分支。修前 `git diff --binary HEAD` 与已上传 blocked-candidate 完全相同，SHA-256 `2892d582ef4b4bc83a07cee7f9d5132cc278c66bb91609d89f4fded3f3d73be6`，未混入/覆盖并发工作。
   - 沿用上一轮 `npm ci --ignore-scripts` 的未变更安装，本轮不增加依赖、不重跑安装脚本。`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 全部返回 0；Vitest **139 passed / 0 todo / 0 skip**，4 文件；构建 JS 290.91 kB / gzip **97.82 kB**，CSS 25.65 kB / gzip **6.50 kB**。
   - `python3 scripts/stage4_regression.py` **259/259 PASS**（`/tmp/stage4-h6-fixes.log`、`/tmp/effect-stage4-results.json`）：原 231 项全部实跑并保留；新增 28 项，其中 normal/reduce 两模式 hover 激活、leave 清除、真实 Tab/Shift+Tab 焦点激活/blur 清除共 8 项，均检查实际 scaleX 矩阵与清晰焦点而非只查 duration；320/375/390/768/1280 五宽度、上下边界各检查触点真实命中卡片 p 与原生 CDP touch 手势带动外层页面，共 20 项。原 375px 正文底部释放断言原样保留并通过。页面有滚动余量，预置边界后手势阶段没有程序化滚动、preventDefault 或滚动桥接。
   - 原 391 项历史回归完整重跑：`browser_smoke.py` **66/66**、`clipboard_regression.py` **8/8**、`discovery_regression.py` **68/68**、`stage3_regression.py` **142/142**、`magnetic_boundary_regression.py` **107/107**；日志 `/tmp/stage4-h6-{smoke,clipboard,discovery,stage3,magnetic}.log`。合计本轮 Chromium **650/650**。没有删除、弱化或跳过旧测试。全部观察上下文未捕获未处理异常或外部运行请求。
4. **Acceptance checklist（开发复验）**：PASS 原触屏阻塞与五宽上下释放；PASS 两模式 Underline hover/keyboard 实际反馈；PASS 18 首页/详情、全部 14 输入/16 目标、真实参数/双语复制、滚轮/键盘/触屏/Replay、Reduced Motion、暂停/离屏、模态焦点与 320 起布局；PASS 四质量门及 391 历史回归。**最终协调方 H6/阶段放行仍待确认**，本日志不自行宣告验收、可合并或提交许可。旧 blocked 记录作为历史完整保留，由本条更新当前状态。
5. **Deviations**：无新增规格偏离。没有写死滚动总高度、加小数补偿、手工转发滚动、屏蔽卡片正文触点或改公共滚动 hook；仅局部行高与激活条件及撤回无效试改。公共 schema、其他 demo、依赖、SPEC/ROADMAP/AGENTS/原需求均保留。Chromium touch 是模拟而非物理手机；本轮未做 Stage 5 axe/Lighthouse、跨浏览器、全量优化或发布审计，不声称这些通过。
6. **Open questions**：本次两项已知实现阻塞均已修复并由本工作者复验，无新增已知阻塞；等待协调方对更新后的确切候选独立核验及放行。不提交、推送、开 PR、合并、部署或进入 Stage 5。
7. **Next step / reproducibility**：重新导出基底至当前的完整 `git diff --binary HEAD`（新增路径保持 intent-to-add，无实际暂存/提交），验证原树 reverse --check、干净基底 apply --check/apply、108 个源文件逐字节一致及 reverse 恢复基底。私有 Library 原候选身份以版本更新保存，旧版本保留用于追溯；交付回报列准确文件名/版本/ID/字节/SHA-256。复跑：应用补丁，运行四质量门；`npm run dev -- --port 5173` 后运行上述六个 Python Chromium 脚本。本候选继续未提交等待协调方指令。


### 2026-11-19 — Stage 4 — 八项演示未提交候选（等待独立 H6）

1. **Summary**：已实现 Stage 4 的八项候选（尚未完成验收）：Aurora、Underline、Shrinking Sticky Header、Parallax Scroll、Scroll Reveal、Skeleton、Pulsing Dots、Modal Scale Fade；保留原十项顺序，共 18 项、8 类。新增独立中英内容/模板、3 条日常描述/语言、术语边界、真实参数、演示/CSS/registry。Typewriter、Glassmorphism 各仅在原两条英文短语末尾追加一条自然描述，原名称、参数、提示词和行为未变。移除 plannedRelatedSlugs 与首期短语数量例外，全部 related 严格指向 published 且 registry 已实现条目；五个剩余查询已激活，12 组/14 实际输入/16 目标均运行。本记录为开发自检，不是独立验收或放行。
2. **Files changed**：共 39 路径：八个 `src/content/effects` 新文件；八组 `src/demos/<Component>.tsx/.css`；新 `src/demos/useScrollStage.ts`；新 `scripts/stage4_regression.py`；修改内容 index、registry、content/search 测试、Typewriter/Glassmorphism 英文短语、DemoStage/EffectCard、四个历史浏览器脚本及本日志。详单可用 `git diff --name-only HEAD` 重现。公共 `Effect`/`DemoProps` schema、依赖/锁文件、原需求、SPEC、ROADMAP、AGENTS 不变。无 Guide、发布设置或第三方素材。
3. **Commands/results**：
   - 指定 effect-lexicon-cloud `/workspace/effect-lexicon`；唯一 origin `https://github.com/Skw03/effect-lexicon.git`。初始 `work` 分支只有 `dfcff86` 初始快照且干净、无本地 main。`git ls-remote origin refs/heads/main refs/heads/stage-4-demos-b` 核实 main 为 `67bd5fcad2fa316a729d699b741e0da5a5230de3`，无远端同名分支；`git fetch origin main` 后 `git switch -c stage-4-demos-b FETCH_HEAD`，HEAD 与 origin/main 同为确切验收基底。未改 main、未覆盖并发工作。
   - 完整读取治理、路线图、最近阶段日志、SPEC 与原文 E Stage 4（750–774）、H6。`npm ci --ignore-scripts --cache /tmp/effect-npm-cache` 成功，232 包；沿用既有版本，未跑安装脚本，现有 ESLint 支持期提示未通过升级处理。
   - `npm run typecheck` / `npm run lint` / `npm run test` / `npm run build`：最终结果见下方实测表。单元门包含 18 项内容、所有模板键/每参数两语言、数字/选择/布尔、严格关联/registry、全库 3–6 双语短语、减少动态/键盘（含 arrow-key/方向键）/触摸（含 tap）文案、旧 Stage 3 参数以及八项新默认/范围。
   - Chromium 使用环境已有 Python Playwright 与 `/usr/bin/chromium`，`npm run dev -- --port 5173`。实跑 `scripts/browser_smoke.py`、`clipboard_regression.py`、`discovery_regression.py`、`stage3_regression.py`、`magnetic_boundary_regression.py`、`stage4_regression.py`；最终计数见下表。原脚本只更新确切十八项计数/有序路径、Glass 的两个真实关联及发现结果栏的精准 status 定位，未删除旧行为断言；原 filter 的空交集断言保留在原十项数据上，并另外严格断言十八项数据新增 Aurora 命中。没有 todo/skip 搜索门或计划 slug 容错。
   - 新浏览器门实际验证：18 首页/详情与关联；14 条输入/16 目标 top-three；八项所有参数双语渲染/系统剪贴板/默认恢复；Underline pointer、键盘、tap、Auto/停止；三内部滚动区的 wheel、PageDown/Tab 释放、原生 touch、Replay/Pause/恢复/用户接管、边缘滚动页面；Sticky 阈值/高度/背景及锚定稳定；Parallax 两个速度实际矩阵；Reveal 容器 Observer、最后卡片及 once；Skeleton 伪元素真实平移、切换真实内容、读屏状态；Dots 尺寸/时长/错峰/读屏标签；三连续演示实际运动/暂停/离屏/首页预算；Reduced Motion 默认静态、显式有限播放/重播；Modal 真开关、缩放参数、双向 Tab 循环、Escape/按钮关闭及焦点返回；320/768/1280 首页和八详情无横向页面溢出。所有观察上下文捕获运行错误及外部运行请求。
   - 调试事实：旧 discovery 只用 `[role=status]` 的唯一定位与两个新增加载状态冲突，改为 `.result-line p[role=status]`，polite/atomic 和数量断言原样保留。新增键盘测试改为实际 Tab/Shift+Tab 路径，避免鼠标模态下 programmatic focus 不触发 focus-visible 的错误假设。Reveal 时长含 80ms 批内错峰，取样覆盖完整周期；Modal CSS duration 是浏览器返回的单值 `.6s`，不是重复列表。严格文案测试识别明确 arrow-key/方向键与 tap 同义表达，适用于所有条目，没有逐词条豁免。一次开发 HMR 造成测试 DOM detach，完整静态候选重跑，不计为通过。
   - 修复两个真实交互问题：Sticky 高度变化触发原生 scroll anchoring 回退，在阈值附近可能振荡；仅此演示设 `overflow-anchor: none`，追加 41px 阈值稳定断言。Modal 关闭 timer 内同步 focus 时 opener 仍 disabled；移至关闭后的 React effect，普通/减少动态实际验证回到 opener。滚动脚本用户输入后完成状态同步、Pause 冻结滚动与进行中的 Reveal，切回 Play 可继续；没有锁住页面或拦截原生 wheel/touch 默认行为。
4. **Acceptance checklist / 实测结果**：**FAIL：Stage 4 尚未完成**。新滚动渐显触屏底部释放门未通过；不能以单元测试和旧回归通过替代此门。以下 PASS 仅指明确实跑的子检查。

   | 检查 | 实测 |
   | --- | --- |
   | npm ci --ignore-scripts | PASS，232 packages |
   | typecheck / lint / test / build | PASS；4 单测文件，139 passed，0 todo / skip |
   | 生产包 | JS gzip 97.85 kB；CSS gzip 6.51 kB |
   | browser_smoke.py | PASS 66/66 |
   | clipboard_regression.py | PASS 8/8 |
   | discovery_regression.py | PASS 68/68 |
   | stage3_regression.py | PASS 142/142 |
   | magnetic_boundary_regression.py | PASS 107/107 |
   | 既有 Chromium 合计 | PASS 391/391，最新完整日志 `/tmp/stage4-final-*.log` |
   | stage4_regression.py | **FAIL / 未完整通过**，完整运行日志 `/tmp/stage4-final-new.log`；不得把前面的 PASS 行视为本脚本通过 |
   | 独立运行相同布局段 `/tmp/stage4-layout.py` | PASS 29/29（27 个 320/768/1280 首页/八新详情宽度检查，另 2 个该运行上下文错误/请求检查） |
   | 定位用 `/tmp/stage4-touch.py` | 5 项通过后失败于 Scroll Reveal 卡片表面底部触屏向页面释放；等待动画结束 1000ms 的定位运行同样失败 |
   | Modal 关闭焦点专项复测 | 普通与 reduce 两个上下文都通过 |

   独立 H6 与协调方阶段放行 **未执行/未放行**。不得将本候选称为已验收或可直接合并。浏览器截图只在 `/tmp` 查看，用于核实首页静态代表画面、布局、极光/骨架/弹窗真实呈现，不上传截图。
5. **Deviations / implementation choices**：
   - 按本次 C08 明确授权补两个有用第二参数：Parallax `midgroundSpeed` 默认 .8、范围 .6–1、步长 .05，来自规格原始中景 0.8 速度，保留默认 0.5/.8/1；Skeleton `bandWidth` 默认 40%、范围 20–60、步长 5，亮带宽度为实现选择，规格未规定数值，不声称行业标准。两个参数均真实作用于画面与中英文模板。其他明确默认/范围原样。
   - 逐项动画属性：Aurora 只 transform，静态 blur 与三相位/周期差；Underline scaleX；Parallax translate3d；Reveal transform/opacity；Skeleton 伪元素 transform 与已加载内容 opacity；Dots transform/opacity；Modal transform/opacity。Sticky 高度 200ms ease 是 SPEC §7 对该效果明确规定的唯一局部布局属性例外，背景/模糊/阴影为静态层，用 opacity 显隐，未扩展为其他动画属性许可。
   - 三滚动演示只监听/观察自己的容器，不监听 window；尺寸在 ResizeObserver 中缓存，scroll handler 只排 RAF，卸载断开监听/观察器/帧。详情默认由实际滚动触发，Replay 才开始自动滚动；首页不创建可滚动/可聚焦滚动区且无无效播放控件。Modal 首页是静态打开图，去掉 dialog/aria-modal/可交互控件，不抢焦点；详情开启时才设置语义与焦点循环，遮罩局限舞台，不修改页面 overflow。首页提示词明确 Skeleton 切换与 Modal 打开在详情体验。
   - 沿用既有可见性与全局最多六个连续预览预算，Reduced Motion 不自动循环，手动一遍结束可再播。新增滚动 helper 只共享三项所需生命周期；DemoStage 的新状态仅用于滚动播放，没有重大共享重构。现有 19 组 synonyms 已覆盖全部新查询，没有为测试加入生硬搜索算法特例。
   - 仅 Chromium 实测；touch 为 Chromium 模拟，**不是物理手机**。未执行 Stage 5 的 axe/Lighthouse/全库加固、跨浏览器或生产深链/发布审计；不声称这些通过。未提交、推送、开 PR、合并或部署。
6. **Open questions / blocking finding**：**未解决：Scroll Reveal 在容器底部、手势起点落于卡片正文时，原生 touch swipe 未继续滚动外层页面**（`src/demos/ScrollReveal.tsx`、`ScrollReveal.css`；`scripts/stage4_regression.py` 的 `touch at bottom releases page` 断言）。诊断观测：375×800 Chromium mobile context，容器 scrollTop=741、scrollHeight-clientHeight=741、外层 scrollY=99；卡片正文 x≈215/y≈710 的手势后外层仍 99，在留白 x≈80 手势可到 234。Sticky 和 Parallax 同样手势能够向外层释放。原因未确定，不能称为正常退出。
   - 已尝试在动画结束时清除 transform/animation 并保留 once 状态、动画期间由 slot 接收指针命中；这两处候选清理已保留，但**没有解决该失败**。等待 1000ms 后再滑也不能解决，不以延长等待隐藏问题。没有添加 preventDefault、页面 scroll lock 或程序化转发外层滚动。
   - 按 AGENTS 的明确停止条件 “A test still fails after two honest attempts and you do not understand why”，停止继续产品试改，交协调方诊断/授权后再处理；不假装通过或弱化断言。新脚本另将搜索采样等待从固定 250ms 改为真实已应用 query 的 active-summary，以避免并发构建负载下在 debounce 完成前读取旧结果；所有 14 输入/16 目标断言保留。
   - 本轮未改原始需求或产品方向。C08/C09 仅按本次明确授权处理；其他历史决策按原记录保留。候选仍等协调方独立 H6，未经其明确指令不得提交推送。
7. **Next step / reproducibility**：所有新增路径用 intent-to-add 纳入 `git diff --binary HEAD` 完整补丁（不 commit）；原树 `git apply --reverse --check`，从确切基底 `git archive` 的干净目录 `git apply --check`/apply、逐文件字节一致、reverse 后与基底字节一致。最终文件名、字节、SHA-256、Library ID 在交付消息中提供，避免补丁自引用。复跑：在基底应用 patch，`npm ci --ignore-scripts --cache /tmp/effect-npm-cache`，依次运行 typecheck/lint/test/build；启动 dev 5173，运行上述六个 Chromium 脚本。不得将多个浏览器重负载下尚未完成的动画取样当成最终状态；脚本关键静态终态采用严格 computed CSS 等待断言。补丁名使用 blocked-candidate 标记；保持未提交候选，先等待协调方处理上述阻塞，再进行独立 H6。


### 2026-11-19 — Stage 3 — 正常推送交付回执

1. **Summary**：已验收实现提交 `cb0ca9f8d5bf08467d4e012432c9d3037d295f49` 已正常推送 origin/stage-3-demos-a；本回执为单独文档提交，最终分支头以远端与交付消息为准。
2. **Files changed**：相对实现提交仅 docs/PROGRESS.md。全部代码/内容/测试与验收候选逐文件 SHA-256 一致；SPEC、REQUIREMENTS_SOURCE 保留。
3. **Commands/results**：本轮 typecheck、lint、test、build 全部返回 0；Vitest 93 passed / 5 个具名 Stage 4 todo；构建 JS gzip 87.20 kB、CSS gzip 5.00 kB。精确暂存原 34 路径，`git diff --cached --check` 通过；`git commit -m "feat: complete accepted Stage 3 demos batch A"` 与 `git push -u origin HEAD:refs/heads/stage-3-demos-a` 成功，无强推。ls-remote 确认新分支为实现 SHA、main 仍 `b263169e837b9f9138698f6d69f798da95e86a76`；推送后工作树干净。默认身份沿用，不记录姓名邮箱。
4. **Acceptance**：独立 H6 已通过，详情见前条：391/391 Chromium + 6 项独立磁吸边界；本轮未重复未变更的浏览器功能检查。候选代码/测试等价及质量门均通过；回执提交前后继续核对仅日志改变。
5. **Deviations**：无；未执行 Git 输出建议的 PR 链接，未创建 PR、合并、部署或开始 Stage 4。
6. **Open questions**：无本轮交付阻塞；PR/合并及后续阶段交由协调方。
7. **Next step**：正常推送本日志回执后核验最终本地/远端 SHA、唯一 origin、main 不变及工作树干净，然后停止。本地预览沿用 `npm run dev -- --port 5173`。

### 2026-11-19 — Stage 3 — 独立 H6 通过及提交授权

1. **Summary**：协调方明确确认独立 H6 通过，授权在原指定云端提交并正常推送 stage-3-demos-a。本轮只增加正式验收/交付记录，不修改已验收实现或测试。
2. **Files changed**：相对验收候选仅 docs/PROGRESS.md；实现范围仍 34 路径。SPEC、REQUIREMENTS_SOURCE、依赖与数据契约保留。
3. **Commands/results**：重读治理/ROADMAP/最近五条日志；origin、HEAD、branch、远端 main 与同名分支存在性核验通过。修改前 `git diff --binary HEAD` SHA-256、120412 字节、34 路径与指定候选完全相符；无无关未跟踪文件或暂存内容。默认 author/committer 有效，不输出或修改身份。逐文件记录非日志 SHA 用于提交后等价核验；运行四质量门及 diff 检查，最终结果见交付回执。
4. **Acceptance（协调方提供的独立结果）**：`npm ci --ignore-scripts`、typecheck/lint/build 通过；Vitest **93 passed、5 个具名 Stage 4 todo**。Chromium **391/391**（107+142+68+66+8），另 **6 项独立磁吸内外边界**通过。原中心下方 155px 仍吸附、198px 界外回零。阶段验收通过；不把独立验证冒称本工作者本轮新跑。
5. **Deviations / limits**：无候选代码变化。触屏/缩放为模拟，未声称物理设备或跨浏览器；其余后续阶段边界保留。
6. **Open questions**：本轮提交/推送已获明确授权；不处理 PR/合并/部署，不开始 Stage 4。
7. **Next step**：四质量门、精确暂存和非日志等价检查通过后，提交实现并正常推送；追加实际推送回执，再核验最终远端头/main/干净工作树。

### 2026-11-19 — Stage 3 — H6 Magnetic Button 纵向感应区修复

1. **Summary / reproduction**：协调方独立 H6 报告 radius=160 时中心向下 140px 可吸附，向下 155px（距静止按钮边缘 129px，仍小于 160）却在 600ms 后归零。原候选固定监听区高 300px，中心下方超过 150px 即触发 leave，视觉舞台内仍有可达区域。新增同一 Chromium 回归在修改前实际复现：+140 通过、+155 失败（`/tmp/magnetic-before.log`），不是仅凭报告推断。
2. **Files changed since previous candidate**：仅 `src/demos/MagneticButton.css`、新增 `scripts/magnetic_boundary_regression.py`、本日志。监听区详情尺寸改为 `min(512px,100%) × 420px`：容纳静止按钮 160×52、两侧最大感应半径 160，以及横向 16px/纵向 24px 的界外余量。仍用未变换父区域的缓存矩形和按钮静止半宽 80/半高 26 计算；没有读取移动按钮边界，没有改 TS 算法、内容、默认值、范围、共享组件或其余已确认实现。compact 的 height:100% 与宽度限制原样保留，不将监听区扩散到预览之外。
3. **Commands/results**：
   - 重读治理、ROADMAP、最近日志、SPEC §7 与原文 E Stage 3。origin/分支/基底均正确，工作树完整 patch SHA 与上一交付 `6da0c1239edce2a94be24cc04712918df63230682b6c12f98e94e1b457abe6e2` 一致，未混入并发改动；`git ls-remote --heads origin main stage-3-demos-a` 仍只返回 main `b263169e837b9f9138698f6d69f798da95e86a76`。
   - 最终 `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 全部通过；Vitest **93 passed / 5 个具名 Stage 4 todo**。JS 256.10 kB / gzip 87.20 kB，CSS 18.59 kB / gzip 5.00 kB。沿用原 `npm ci --ignore-scripts` 安装，无依赖/锁文件变动。
   - 最终 `python3 scripts/magnetic_boundary_regression.py` **107/107**：原 +140/+155 复现点；320/768/1280 宽度、半径 40/80/160、上下两侧内界点与仍在真实监听区内的外界点，实际吸附、固定指针稳定及 500ms 回弹后归零；无水平溢出；DPR=2；Chromium visual viewport 125% 缩放下实际内点吸附/外点恢复；减少动态静止与有限 Auto；实际 touchStart/touchEnd 模拟；compact 监听框在预览内、16:10 与触屏 Auto 不导航。
   - 原严格脚本完整重跑：`python3 scripts/stage3_regression.py` **142/142**、`python3 scripts/browser_smoke.py` **66/66**、`python3 scripts/clipboard_regression.py` **8/8**、`python3 scripts/discovery_regression.py` **68/68**。没有修改或放宽这些脚本及单测。
   - 修复调试记录：最初尝试宽 528px、高 420px，原严格键盘回归检测到 focus 后 ArrowRight 的既定目标刚好超出默认 80px 半径；将宽度调整为 512px，既覆盖最大半径并保留界外空间，也保留原键盘目标。已用最终尺寸完整重跑本批与边界测试。缩放脚本使用浏览器事件的 CSS 坐标，不再次乘 visualViewport.scale；最初探测中的重复倍率会把事件发到舞台外，不是产品缺陷。
4. **Acceptance**：PASS 独立 H6 原问题已由同一脚本先红后绿验证；PASS 上下两侧所有参数半径的真实可达内/外界；PASS 静止目标测量与无反馈抖动；PASS compact、键盘、touch、Auto、响应式、DPR/视口缩放、Reduced Motion；PASS 四质量门和所有原严格 Chromium 回归。待独立复核，不把自检称为 H6 最终验收。
5. **Deviations / boundaries**：无需求偏离，详情舞台根据真实最大感应范围自然增高；窄屏/compact 仍按可见视口限制横向可达范围，不捕获界面外或其他控件的指针。动画仍只 transform；不增加全局监听或定时器。仅 Chromium/模拟触屏与模拟视口缩放验证，未声称物理设备/跨浏览器测试。原其他阶段边界不变。
6. **Open questions**：本阻断无已知未解决问题；等待协调方独立 H6 复核及明确提交/推送指令。未修改 SPEC、原文、治理、schema 或 Stage 4 内容。
7. **Next step / patch**：以原基底生成新的完整 `git diff --binary HEAD`（非增量补丁），新增脚本 intent-to-add；原树 reverse check、干净基底 apply/字节比对/reverse 恢复及与上一候选差异范围校验后，按当前 Library 技能保存私有附件 `effect-lexicon-stage-3-demos-a-b263169-h6-fix-candidate.patch`。最终 SHA/字节数/Library ID 在交付消息给出，避免补丁自引用。独立复跑沿用原四质量门/四 Chromium 脚本，并新增 `python3 scripts/magnetic_boundary_regression.py`；dev 端口 5173。仍保留原未提交工作树，不推送、不开始 Stage 4。

### 2026-11-19 — Stage 3 — Batch A 未提交候选与自检

1. **Summary**：新增且仅新增 card-flip、spotlight-card、magnetic-button、ripple-button、sliding-fill-button、gradient-text-shimmer、staggered-text-reveal；首页与详情现为 10 项。每项独立 Effect 内容、组件与 CSS、registry，双语自然描述/别名/各 3 条实际搜索短语、术语说明、全部可编辑参数的双语模板与真实相关链接。保留 Stage 1 两个样例英语各两条的边界，以及 Tilt 原三条；没有修改样例内容或扩展数据契约。
2. **Files changed**：七个 `src/content/effects/<slug>.ts`、七组 `src/demos/<Component>.tsx/.css`；新增局部 `src/demos/useDemoPointer.ts` 缓存几何与清理 observer/listeners/rAF；更新 content index、registry、content/search 验收测试；新增 `scripts/stage3_regression.py`，按十项实际目录精确适配旧三个 Chromium 脚本；`docs/PROGRESS.md`。
   - 共享组件仅两个真实集成修复：`DemoStage.tsx` 传递 `paused={!visible}`，使点击层离屏清理、指针效果离屏归位；保留 Tilt 原方向键提示，其余使用真实 effect hint 与通用 Auto 说明。`EffectCard.tsx` 对非连续但 replayable 的逐词动画也遵守 playing，避免 Reduced Motion 初始错误播放；预览提示按效果/精细指针与触屏展示，避免对 Flip/Fill 错称方向键拖动。没有重构页面或改 schema。
3. **Commands/results**：
   - `git remote -v`、status/branch/log、`git ls-remote --heads origin main stage-3-demos-a`、`git fetch origin main` 验证唯一来源、干净 work 分支、main 指定 SHA 和无同名远端；`git switch -c stage-3-demos-a b263169e837b9f9138698f6d69f798da95e86a76` 成功，无覆盖并发工作。
   - 阅读 AGENTS、ROADMAP、PROGRESS 与 SPEC §7/8/9、原始 E Stage 3/H6；按本轮 C08 授权执行常规参数选择。`npm ci --ignore-scripts --cache /tmp/effect-npm-cache` 成功，232 包，无新依赖/升级/lifecycle；保留既有 ESLint 支持期提示，不升级。
   - 最终 `npm run typecheck`、`npm run lint`（max-warnings 0）、`npm run test`、`npm run build` 全部返回 0。Vitest **4 文件，93 passed / 5 个具名 Stage 4 todo**；总登记 98 不称 98 passed。Stage 3 五目标（Flip、Spotlight 中英双目标、Magnetic、Ripple）均实际执行；旧 Tilt 中文首位断言与原词条短语数量断言保留。增加所有模板必须实际使用每个参数、七项默认/范围精确值、Stage 3 related 必须真实存在检查。空搜索断言从 top-three helper 改为全目录顺序，保持原门的实际语义。
   - 最终 build：JS 256.10 kB / gzip **87.20 kB**，CSS 18.59 kB / gzip **5.00 kB**；无构建产物入候选。
   - `npm run dev -- --port 5173`；使用环境已有 Python Playwright 与 `/usr/bin/chromium`，没有下载浏览器或 npm 浏览器依赖。`python3 scripts/browser_smoke.py` **66/66**；`python3 scripts/clipboard_regression.py` **8/8**；`python3 scripts/discovery_regression.py` **68/68**；`python3 scripts/stage3_regression.py` **142/142**。后三个旧脚本对目录数量、筛选精确集合、真实 related 路径和卸载后的十项 status 作阶段适配，未删旧功能断言；近似推荐仍严格最多三个，预算仍九个真实组件夹具最多六个。
   - 新浏览器覆盖：七项 compact/详情、每个编辑参数双语内容及实际 clipboard 一致、落地 related；Flip 两轴和 Enter/Space；Spotlight 光层/边框与方向键；Magnetic 默认 .35、小偏移参数变化、边缘半径与 14px 向量上限/回弹；Ripple 点击起点、键盘中心、扩散/淡出、重叠、DOM 清理；Fill 左入右退、焦点/键盘和宽度；Shimmer 真实扫光、暂停/离屏、带宽/周期；Reveal 延迟/距离/时长、辅助名称、暂停。七项 Reduced Motion 静态初始与显式有限播放，四个 Auto 约四秒后停止归位，移动端模拟实际 tap/contact 不导航，320/768/1280 无横向页面溢出。正常/减少动态/触屏 context 均监听运行错误与外部请求，均无捕获。
   - 人工查看 Chromium 生成的首页与 Spotlight 截图，确认真实字形渐变、暗卡光层/近指针边框、compact 布局；截图仅在 /tmp，不上传、不入 patch。
   - 调试事实：首次 typecheck 发现自定义 CSS 变量缺少 CSSProperties 标注，已修正；第一次搜索测试 Spotlight 完全复用旧中文查询造成 Tilt 首位回归，改为准确描述“光斑跟着动”，未放宽旧首位门；全部五个新 top-three 断言仍通过。测试脚本的 related 顺序依实际 index（Flip 在 Spotlight 前），误用 `ss ` 检测重复秒单位会匹配英文 unless，改为数值后重复单位正则；CSS pause 采样需等浏览器提交一帧再验证冻结。以上是明确原因的实现/测试修正，不删测或掩盖失败。
   - `git diff --check` 通过。AGENTS、ROADMAP、SPEC、REQUIREMENTS_SOURCE、src/types.ts、package.json/package-lock.json、三个 Stage 1 内容文件均对 HEAD 无差异。来源 SHA-256 仍 `634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`。最终 origin main 仍基底、无 Stage 3 远端分支。
4. **Acceptance checklist（开发自检，非独立 H6）**：PASS 仅七项与总十项路由；PASS 完整双语字段/每参数两语言/单位一次；PASS 原有与本批实际搜索目标；PASS 真实交互与 compact、键盘/触屏模拟/明显焦点；PASS 正常与减少动态的有限手动播放、离屏与预算；PASS 旧 Stage 1/2 回归；PASS 四质量门。独立验收仍待协调方执行。
5. **Deviations / implementation choices**：
   - 按本次明确 C08 常规选择授权补第二参数，不改 SPEC 或原文总则：Ripple `opacity` 默认 .35、范围 .1–.6、步长 .05，来源 §7 明定 35% 起始透明度，调节反馈强度；Sliding Fill `width` 默认 160px、范围 120–240、步长 10，来源本批实际按钮的固定布局尺寸（规范未指定宽度，160 是实现选择，不冒称标准），只调节尺寸，不改默认填充时序/方向；Shimmer `bandWidth` 默认 20%、范围 10–40、步长 5，来源 §7 的约 20% 高光带，调节亮区。Flip duration 未给范围，选 200–1200ms、步长 50，默认 600ms/两轴严格保留。其余指定默认/范围原样。
   - **逐项动画证据**：Flip transform/perspective；Spotlight 使用 --x/--y 平移径向层、opacity 200ms 与局部边框裁剪层，不动画背景位置或边框色；Magnetic transform；Ripple transform/opacity；Fill scaleX 左入右退，文字颜色即时改变，无颜色动画；Shimmer 用静态 SVG 三色渐变/字形裁剪与移动高光 rect 的 transform，等效呈现 background-clip text + 扫光，未采用规范描述中的 background-size 200%/背景位置动画，因为 §9 要求 shimmer 使用 transform；Reveal transform/opacity。**没有申请或使用新增动画属性例外**。静态 radius/intensity/bandWidth/width 参数即时调试不属于逐帧属性动画。
   - Ripple 减少动态下每次直接激活只淡出一次、不空间扩散；Flip/Fill 直接激活即时换状态；四项 Auto 显式运行一次。Magnetic 感应半径解释为到静止按钮边缘的距离，跟随使用 100ms ease-out 小过渡，离开严格 500ms 指定回弹。无产品方向/技术栈/数据契约改变。
   - Chromium 为唯一实测浏览器；触屏为 Chromium 模拟，不是物理手机。未执行跨浏览器、Stage 5 axe/Lighthouse 全量验收、生产主机深链/发布测试。Stage 4 八项、Guide 均未开始；既有五个 Stage 4 查询 todo 和严格真实 related 最终门保留。现有 synonyms 已覆盖这批所需概念，新增别名/自然句进入既有索引，无需改搜索算法或同义组。
6. **Open questions / proposed spec changes**：本阶段无已知产品阻塞，无 SPEC 修订提案。C08 仅对本批三项按授权解决；Stage 4 单参数项届时按范围处理，C09 原样样例英语数量与其他阶段待决项不变。C14 未泛化批准属性例外。独立 H6、阶段验收和提交/推送授权尚未发生。
7. **Next step / reproducibility**：新增路径以 `git add -N` 纳入；使用完整 `git diff --binary HEAD`，在原树检查可逆，在从该基底导出的干净临时目录检查/apply、逐路径字节一致、reverse 后基底字节一致；补丁 SHA-256/字节数/Library ID 在交付消息给出，避免补丁自引用。候选原始文件名 `effect-lexicon-stage-3-demos-a-b263169-candidate.patch`。独立复跑：在指定基底 `git apply --check <patch>` / `git apply <patch>`，`npm ci --ignore-scripts --cache /tmp/effect-npm-cache`，四质量门，启动 dev 5173 后逐个运行上述四个 Chromium 脚本。保留本工作树未提交，等待协调方独立 H6 与后续明确指令；不先推送。若 Library 出口失败仅报告阻塞并保留本地候选。

### 2026-11-19 — Stage 2 — 正常推送回执

1. **Summary**：已验收实现提交 `3226efee357f5f338682e9fa6d81df1cbe0cc11d` 已正常推送 origin/stage-2-discovery。本回执单独小提交，不改产品代码。
2. **Files changed**：相对上条提交仅 docs/PROGRESS.md；Stage 2 相对 a847ed7 的实际改动仍是原 21 路径。REQUIREMENTS_SOURCE、SPEC、依赖与锁文件保持不变。
3. **Commands/results**：`git diff --check`、暂存后 diff 检查及非日志 patch 等价核验通过；`git commit -m "feat: complete accepted Stage 2 discovery"` 成功；`git push -u origin HEAD:refs/heads/stage-2-discovery` 返回 0、新建远端分支，无强推。`git ls-remote` 核实 Stage 2 为上述实现 SHA、main 仍 dfcff865aa74af520ab52a84b1a5f766156b4570、Stage 1 仍 a847ed7a3520ec86ac9d8c60c9a835b87b571767；推送后工作树干净。默认身份沿用，未输出姓名邮箱。
4. **Acceptance**：本轮四项质量门通过；独立 H6 结果见前条，Stage 2 验收通过。仅新增日志回执无需重复功能测试。最终回执推送后再核验分支/main/工作树。
5. **Deviations**：无；未创建 PR、未合并、未部署、未开始 Stage 3。Git 返回的 PR 建议链接未执行。
6. **Open questions**：无本轮提交/推送阻塞；PR 检查及合并留给协调方。
7. **Next step / preview**：本工作者停止。协调方处理后续流程。本地预览：`npm ci --ignore-scripts` 后 `npm run dev -- --port 5173`，访问 http://localhost:5173；构建预览可用 `npm run build` 后 `npm run preview -- --port 4173`，访问 http://localhost:4173。若默认 npm cache 不可写，使用 `--cache /tmp/effect-npm-cache`。

### 2026-11-19 — Stage 2 — 独立 H6 通过，提交授权与一致性核验

1. **Summary**：协调方明确报告独立 H6 与 Stage 2 验收通过，并批准在原云端提交/正常推送 stage-2-discovery；本轮仅补充本日志，不修改已验收产品代码。
2. **Files changed**：相对已验收候选只改 docs/PROGRESS.md；本次提交包括原候选的全部 21 个路径（具体清单见前条候选记录和 Git）。REQUIREMENTS_SOURCE 逐字保留。
3. **Commands/results**：
   - 重读 AGENTS、ROADMAP、最近五条日志；确认当前分支 stage-2-discovery、HEAD 为 a847ed7a3520ec86ac9d8c60c9a835b87b571767、唯一 origin 正确。`git ls-remote --heads origin main stage-1-foundation stage-2-discovery` 确认 main 仍 dfcff865aa74af520ab52a84b1a5f766156b4570、Stage 1 仍 a847ed7、Stage 2 不存在，无同名并发工作覆盖。
   - 修改日志前 `git diff --binary HEAD` 与仓库外原 patch 逐字节相等，SHA-256 为 1be9c0a45fb69824eefe2f14ca83b410d34ac839db84c8a488ee7cd67226390a；原文 hash 仍 634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8。默认 author/committer 可用，未改配置、未输出身份。
   - 本轮重新运行 typecheck、lint、test、build 全部通过；Vitest 52 passed / 10 个具名 Stage 3/4 todo，4 文件。JS 223.19 kB / gzip 76.69 kB，CSS 14.55 kB / gzip 4.13 kB。未重复安装或跑未变更的浏览器功能；独立测试报告与原自检见下项。
   - 提交前 `git diff --check`，并按每文件 patch 核验除本日志外与已验收候选一致，精确暂存原 21 路径；提交/正常推送及最终远端头见后续回执。
4. **Acceptance**：协调方提供的独立 H6：`npm ci --ignore-scripts`、typecheck/lint/build 通过；Vitest **52 passed、10 具名 todo**；真实 Chromium discovery **68/68**、旧详情 **66/66**、复制 **8/8**、额外独立抽查 **13/13**。9 个实际预览组件夹具验证最多 6 个活动，产品实际词条仍 3。阶段验收通过，不把本工作者自检冒称独立执行。
5. **Deviations / limits**：无代码偏离已验收候选；触屏为模拟，未做 Stage 5 全量审计，不声称真机或跨浏览器。未来 todo 仍待对应阶段激活。
6. **Open questions**：本轮提交/推送没有新增产品待决项；后续 PR 检查/合并由协调方依据最新用户授权处理。
7. **Next step**：提交、正常推送并验证远端/main；本工作者完成 Stage 2 后停止，不开始 Stage 3，不部署。

### 2026-11-19 — Stage 2 — Discovery 待审候选

1. **Summary**：按原文 E Stage 2 与 SPEC §3.1/6/9 替换临时首页：搜索、触发/类别多选 chips、单选类型、结果数与 polite aria-live、可见状态与清除、150ms 防抖、replace URL/刷新恢复。筛选组间 AND、组内 OR，搜索仅在筛选后集合排名。NFKC/标点规范化、英文 token/前缀、中文子串和 19 组同义词、Fuse 既定权重与精确/前缀/描述优先、返回实际字段/文字提示。零命中单独显示相近推荐，looser Fuse 后无候选项用规范化编辑距离排序，绝不标成命中，也不越过筛选。
2. **Files changed**：AGENTS.md、docs/ROADMAP.md、本日志；新增 src/search/{normalize,synonyms,filters,index,search.test}.ts、src/components/{SearchBox,FilterBar,EffectCard}.tsx、src/hooks/previewBudget.ts、scripts/discovery_regression.py；集成修改 src/pages/Library.tsx、src/styles.css、src/types.ts（仅 DemoProps 新增可选 compact/paused，Effect 公共 schema 不变）、三个 src/demos 组件；scripts/browser_smoke.py 与 clipboard_regression.py 更新首页定位。
   - 三个 16:10 实时预览复用原组件，独立标题/查看详情导航；Tilt 悬停、键盘、触屏及 Auto；Typewriter 播放/暂停/重播、离屏暂停、减少动态默认完整首句，手动有限单遍；Glass 真正 backdrop-filter，紧凑模式隐藏背景控件。
   - 共享 FIFO 预算限制连续预览最多 6 个；卸载/离屏释放名额；等待中的初次预览显示静态代表帧。CSS 仍沿用 Stage 1 tokens；只对 demo transform/opacity 做动画。
   - AGENTS/ROADMAP 明确替代旧的人工逐阶段确认及人工专属合并门：授权只至 Stage 5、一次一阶段，dots 负责开发/独立审查/修复/验收，在权限及检查允许时协调 PR/合并；本工作者先留未提交候选，验收后另行提交指令；Stage 6+ 无自动授权，不部署，不改写 Stage 0 历史，不改变验收/环境/权限限制。
3. **Commands run and results**：
   - `git status --short --branch` 初始 work 分支干净，`git remote -v` 指定唯一仓库；`git fetch origin`、`git ls-remote --heads origin main stage-1-foundation stage-2-discovery` 查明 main/Stage 1 与交接一致、无同名远端分支。默认 fetch refspec 只取 main，所以显式 fetch Stage 1 ref 后 `git switch -c stage-2-discovery a847ed7a3520ec86ac9d8c60c9a835b87b571767`。没有覆盖并发改动或假定 main 合并。
   - 完整读取五份治理/产品原文（长文分段阅读），保留 REQUIREMENTS_SOURCE 原样。`npm ci --ignore-scripts --cache /tmp/effect-npm-cache` 成功、232 包，无新增/升级依赖或 lifecycle。既有 ESLint 支持期提示仍保留现版本，本轮不升级。
   - `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 全部返回 0。Vitest **4 文件，52 passed、10 todo、0 个既有测试跳过**；原 28 个全部通过，新 24 个实际执行，另 10 个明确标注 Stage 3/4 的未实现目标。总登记 62 项不能称 62 passed。12 查询组 / 14 实际字符串 / 16 目标断言：6 个当前目标执行，双目标两查询的 Tilt 当前执行、Spotlight Stage 3 激活，三个毛玻璃输入逐个执行。
   - 最终生产 JS 223.19 kB / gzip 76.69 kB，CSS 14.55 kB / gzip 4.13 kB。
   - `npm run dev -- --port 5173`，使用现有 Python Playwright 与 `/usr/bin/chromium`；`python3 scripts/browser_smoke.py` **66/66**、`python3 scripts/clipboard_regression.py` **8/8**。旧 smoke 第一条从“main 恰好三个文本链接”更新为严格三条 canonical 标题链接及路径顺序；复制竞态两处旧中英合并链接定位改为 canonical 标题，卸载后断言更新为新的唯一 gallery status 文本“共 3 个效果”，仍断言无旧复制反馈/legacy 副作用/焦点抢占，没有删测或放宽已有功能断言。
   - `python3 scripts/discovery_regression.py`：**68/68**；包含六个当前查询、中文首位/描述提示、URL 搜索/多选恢复、replace 历史、防抖、清除、AND/OR/type、近似与筛选隔离、键盘/触屏、实时预览、离屏暂停、减少动态单次播放、320/375/768/1280/1440 布局与 16:10。额外九个既有 Typewriter 测试实例验证通用预算，不增产品内容。
   - 调试记录：新脚本最初在 React 更新前即时断言类型切换，改为等待对应 aria-pressed；手动 Typewriter 在 1500ms 已完成首句，原“文字不等于静态首句”时点不可靠，改为断言真实 typing 阶段和最终单遍第三句。原 clipboard 脚本暴露旧链接及旧首页无 status 假设，按新首页定位更新后 8/8。快速“清除后立即输入”复测发现真实竞态：旧 replace 完成后 state.q effect 覆盖新输入。修复为本地输入只由用户编辑/清除及 POP 历史恢复更新，自己的 replace 不回写 draft；保留连续清除/输入断言。预算浏览器夹具补全 MemoryRouter 并复用 Vite 实际 React 模块 URL，避免测试夹具重复 React/缺少路由上下文；该夹具与应用代码隔离。未将这些脚本适配描述为产品旧功能缺陷。
   - `git diff --check` 通过；21 个候选路径，新文件用 `git add -N` 纳入完整补丁，`git diff --cached --name-only` 为空，无暂存内容/提交。Effect schema 逐字比较不变，package.json/package-lock.json、SPEC、原始需求、content、PromptPanel/clipboard 无差异；原文 SHA-256 仍 `634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`。补丁名 `effect-lexicon-stage-2-discovery-a847ed7-candidate.patch`，最终 SHA-256 与 Library ID 记在交付消息（避免补丁自引用）。不纳入缓存/node_modules/dist/截图。
4. **Acceptance checklist（自检，非独立 H6）**：PASS 当前六查询目标与中文描述首位；PASS 筛选逻辑/URL/清除/状态/aria-live；PASS 无结果与明确近似推荐/当前筛选；PASS 三实时预览及交互/导航分离、离屏暂停、有限手动 reduced-motion；PASS 响应式/键盘/触屏模拟；PASS 三旧详情及复制竞态；PASS 四质量门。独立 H6 与阶段最终验收仍待执行，提交/推送待协调方指令。
5. **Deviations / boundaries**：无新增效果、指南、依赖、外部运行资源、后端、分析、公共 Effect schema 变更或产品 SPEC 修订。两种 demo 展示 props 为组件集成，不是内容 schema 变更。预览预算单测与浏览器夹具用现有组件复制实例，实际产品仍三个效果。浏览器只实测 Chromium；触屏为模拟，不冒称真机/跨浏览器或 Stage 5 axe/Lighthouse/全库验收。Stage 3/4 各 5 个 todo 只代表未来目标，必须在对应阶段激活。
6. **Open questions**：当前候选无已知未解决功能阻塞；需协调方独立 H6。后续 C08 单参数冲突、C09/C10 其他内容规则、C14 后续属性例外等按实际后续阶段处理，未用本轮授权批准所有旧建议。Stage 6 人类输入与发布事项仍未授权。
7. **Next step**：仅整理含所有新文件的 `git diff --binary HEAD` 单个私有 Library patch，交接基底、SHA-256、范围和复跑命令。保留本工作树未提交；独立 H6 后由协调方续修或明确指令提交，不进入 Stage 3。

### 2026-11-19 — Stage 1 — H6 异步复制竞态修复

1. **Summary / 原始 H6 发现**：协调方独立 Chromium H6 报告四类问题：英文复制待完成时切中文，旧成功错误恢复当前“已复制”；blur=16 复制待完成时改 32，旧拒绝后的 legacy 选到当前 32；切语言后旧 API/legacy 皆失败，旧错误与 textarea 焦点抢占；两次未串行复制可能由旧请求最后覆盖新写入。本轮先在原 `a78f90419cae0b2d020ae602879d922904ace918` 实现上用挂起 writeText Promise 重现，再修复，不把旧 smoke 通过当成上述竞态已覆盖。
2. **Files changed**：仅 `src/components/PromptPanel.tsx`、`src/lib/clipboard.ts`、`scripts/browser_smoke.py`、新增 `scripts/clipboard_regression.py` 与本日志。无依赖/锁文件/lifecycle 变化，无 SPEC、原始需求、数据 schema 或其他交互重构。
   - PromptPanel 在点击时捕获不可变文本快照和请求版本；语言、参数、effect 变化或卸载时作废版本并清理反馈 timer。只有当前有效请求可以显示成功/失败、启动反馈 timer 或手动选中当前提示词；切回原语言也不会使旧请求重新有效。
   - clipboard 模块提供应用级 pending 互斥锁及订阅，跨路由卸载保留锁直到原写入结束。pending 时显示“复制中…”和 aria-disabled/aria-busy，仍保留按钮焦点；鼠标及 Enter/Space 重复激活均不启动后续写入，完成后可再次复制。
   - 原生 API 拒绝后先验证请求是否仍有效，过期请求不做 legacy 写入/选择/焦点副作用。有效 legacy 用独立临时 textarea 承载点击快照，finally 移除并恢复先前焦点/文本选区；全部失败且请求仍有效时，才选中界面当前提示词供手动复制。
3. **Commands run / evidence**：
   - 初始 `git status --short --branch` 干净；origin 是指定仓库；本地/远端 Stage 1 均为 a78f904 完整 SHA。完整重读 AGENTS/ROADMAP 与最近五条日志，并核对 SPEC §8、原始需求 E Stage 1/H6；本轮授权继续原 Stage 1 分支、默认 Git 身份。
   - `python3 scripts/clipboard_regression.py` 修复前 **1/8 通过、7/8 失败**，四个指定竞态全部复现；额外发现 legacy 成功抢焦点、跨路由并发写入、切回原语言后旧反馈复活。修复前结果留于 `/tmp/effect-clipboard-before.json`。
   - 同一脚本修复后 **8/8 通过**；覆盖指定四例、有效请求 legacy 快照与焦点恢复/临时节点清理、跨详情路由 pending 互斥/迟到 reject、卸载后迟到成功、语言切回版本失效。随后补充同一 serialize 场景的 Enter/Space 激活断言再运行，仍 8/8 通过。结果 `/tmp/effect-clipboard-regression.json`。这些是实际 Chromium 内的受控异步 Promise 测试，不冒称每个受控写入都访问了系统剪贴板。
   - `python3 scripts/browser_smoke.py` **66/66 通过**。原 66 个检查和断言原样保留，只在首次 nav 后增加 `expect(page.locator('main a')).to_have_count(3)` 等待 React 首次渲染，然后仍严格检查恰好三链接；未放宽数量。正常真实 Clipboard 双语逐字复制、立即拒绝后的 legacy、全部失败选中原文等原行为继续通过。
   - `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 全部返回 0。Vitest 仍 **3 文件、28 测试通过，0 skip/todo**；构建 JS 193.20 kB / gzip 65.63 kB，CSS 11.97 kB / gzip 3.61 kB。使用已有环境 Python Playwright 与 Chromium，没有安装依赖或运行 package lifecycle。
   - `git diff --check` 通过；package.json/package-lock.json、AGENTS、SPEC、ROADMAP、REQUIREMENTS_SOURCE 对 HEAD 无差异。推送前 ls-remote 再次确认 Stage 1 仍 a78f904、main 仍 dfcff865aa74af520ab52a84b1a5f766156b4570、Stage 0 仍 e51155b01599a79e3573e47be45077339c018f13。
4. **Acceptance checklist**：PASS 四种 H6 竞态修复、点击快照、过期反馈/回退/焦点抑制、pending 互斥与完成后重试、跨语言/参数/路由/卸载；PASS 原 66 smoke 与四项质量门；PASS 不增加依赖、不改变原功能验收。待另一独立会话复核，不把本轮自检称独立 H6 通过。
5. **Deviations / limitations**：无范围偏差。已调用的浏览器 Clipboard Promise 不可取消，改变内容后它仍可能完成原点击快照写入，但不会假称当前内容已复制；若浏览器一直不结算该 Promise，复制保持“复制中…”并阻止新写入，直到结算或整页重载，避免通过超时放锁重新引入旧写覆盖新写。期间可选中提示词手动复制。测试浏览器为 Chromium，其他浏览器/物理设备和既有后续阶段边界未新增验证。
6. **Open questions**：本轮未遇到未解决的验收修复阻塞；其余阶段待决项不变。
7. **Next step**：默认身份小提交、正常推送原 stage-1-foundation，核验最终远端头和干净工作树；main/Stage 0 保持原 SHA。不 PR、不合并、不部署、不开始 Stage 2，等待独立再次核验。最终提交 SHA 以交付消息及远端为准。

### 2026-11-19 — Stage 1 — 正常推送回执

1. **Summary**：实现提交 `34ddfa628f2e2401f2d468a1c765d4fff2f49a24` 已正常推送到 origin/stage-1-foundation；先行规则提交 `879d8fd` 包含在历史中。本回执单独小提交，最终分支头以远端和交付消息为准。
2. **Files changed**：本回执只改 docs/PROGRESS.md，补正 CSS 构建大小；实现文件清单见前条与 Git。
3. **Commands/results**：`git push -u origin HEAD:refs/heads/stage-1-foundation` 返回 0，新建远端分支；`git ls-remote` 已确认远端任务头等于实现 SHA，main 仍 `dfcff865aa74af520ab52a84b1a5f766156b4570`，Stage 0 仍 `e51155b01599a79e3573e47be45077339c018f13`。推送后 `git status --short --branch` 无改动。默认鉴权成功，无绕过。远端显示的 PR 建议链接未打开、未创建 PR。
4. **Acceptance**：typecheck/lint/test/build 全部通过，28 个 Vitest、66 个真实 Chromium 检查通过；原文 SHA 不变。回执仅文档更新，不把重复运行应用测试当作必要步骤。
5. **Deviations**：无新增偏差。触屏为浏览器模拟，物理手机、Lighthouse/axe 未执行，不冒称完成。
6. **Open questions**：无当前交付阻塞；其余阶段待决项、独立 H6 和后续批准保留。
7. **Next**：推送本回执并再次核验最终远端头与干净工作树；Stage 1 到此停止，不 PR、合并、部署或开始 Stage 2。

### 2026-11-19 — Stage 1 — 三效果实现与最终验证

1. **Summary**：完成 strict TypeScript + React 18/Vite 基础、主题与 shell、三条文本 Library、未知路由/slug Not Found、三份双语内容、registry、renderPrompt、详情控件/描述/提示词/复制。Tilt 使用缓存矩形和 rAF 平滑、键盘方向键/Escape、触屏 pan-y、单路径 Auto/Stop；Typewriter 支持逐字/删除/停顿、暂停/重播、非循环遍历三句并保留第三句、离屏暂停；Glass 使用真实 backdrop-filter、四参数与三个静态背景。Stage 1 适用验收通过，尚不是独立 H6 结论。
2. **Files changed**：README；package.json/package-lock.json、index.html、tsconfig、Vite/Tailwind/ESLint 配置；src/types.ts、content/index 与三份 effects、content.test；demos 三组件与 CSS/registry/typewriterMachine 和测试；hooks/useRaf/useInView/useReducedMotion/useVirtualPointer；components/DemoStage/ParamPanel/PromptPanel；pages/Library/EffectDetail/NotFound；lib/renderPrompt/clipboard 及测试；main.tsx/styles.css；scripts/browser_smoke.py；SPEC 的相关样例末尾无障碍文案与本日志。未修改 AGENTS、ROADMAP、源档，未提交 dist/node_modules。
3. **Commands run and results**：
   - Node `v24.22.1`，npm `11.9.0`。默认 npm cache 路径不可写导致初次安装 ENOENT；改用允许写入的 `/tmp/effect-npm-cache`，不改网络策略、不更换身份/鉴权。安装均带 `--save-exact --ignore-scripts`；随后真实 `npm ci --ignore-scripts --cache /tmp/effect-npm-cache` 成功，232 包。锁中 esbuild/fsevents 安装脚本未运行；构建使用可选平台二进制。npm 提示 ESLint 9.28.0 已不受维护，保留已验证固定版本并记录后续维护事项，无临时升级。
   - 精确生产依赖：react/react-dom 18.3.1，react-router-dom 6.30.1，fuse.js 7.1.0（仅按栈安装，未提前实现搜索）。开发依赖：typescript 5.8.3、@types/react 18.3.20、@types/react-dom 18.3.6、vite 6.3.5、tailwindcss 3.4.17、vitest 3.2.4、eslint/@eslint/js 9.28.0、typescript-eslint 8.34.0。React DOM/类型与 ESLint TS 配套是获准栈所需，不使用动画/UI 库。无额外浏览器依赖安装。
   - 最终 `npm run typecheck`、`npm run lint`（max-warnings 0）、`npm run test`、`npm run build` 均返回 0；Vitest **3 文件、28 测试通过，0 skip/todo**：15 提示词、10 内容、3 状态机/路径测试。数值逐 kind 检查边界，boolean/select 不伪造 min/max，覆盖显式/隐式/无单位、正向/反向条件。
   - 首次 Vitest 27/28：浮点路径出现 0.09999999999999998，已在实现钳制 0.1–0.9，原边界测试保留后通过；没有删除或放宽断言。此前 commentary 中预计 29 项不准确，以真实 28 项为准。
   - `npm run dev -- --port 5173` 后云端共享 Chromium 实际打开 Library/Tilt；浏览器 tab API 报 “could not read requirements”，用已提供的共享 Chromium 原生窗口成功查看。随后用环境已有 Python Playwright + `/usr/bin/chromium` 运行 `python3 scripts/browser_smoke.py`：最终 **66 项真实浏览器检查全部通过**，输出 `/tmp/effect-stage1-browser.json`。最初脚本 status 定位匹配到了 output 隐式 status，改为明确复制反馈 p[role=status] 后通过，未改产品验收。
   - 构建输出 JS 约 192.11 kB、gzip 65.16 kB；CSS 11.97 kB（gzip 3.61 kB），最终精确值见命令输出。`git diff --check` 通过；源档 SHA-256 仍 `634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`；AGENTS/ROADMAP/源档对基底无差异。
4. **Acceptance checklist / evidence**：
   - PASS：三详情真实渲染；当前参数进入中英文提示词，真实剪贴板内容逐字相等，语言偏好 reload 保留；legacy execCommand 回退与全部复制失败选中原文均实测。
   - PASS：Tilt 鼠标/键盘焦点与 Escape、Auto/Stop/Reset；关闭 glare 同时移除高光与提示词分支；浏览器真实 touchStart/touchMove 模拟拖动倾斜，纵向 swipe 实际改变页面 scrollY，触屏提示与 44px 目标通过。
   - PASS：Typewriter 正常循环、暂停冻结、Replay 归零、非循环保留第三句、离屏暂停；reduced-motion 初始完整首句无闪烁，手动 Play 即使 loop=true 也只遍历一次三句并静止，Replay 可再运行。
   - PASS：Glass 四参数改变 computed backdropFilter/fill/border/radius，三背景切换和“视觉样式 · 无动画”标签。静态无虚构时间。
   - PASS：reduced-motion 的 Tilt hover 静止，显式 Auto 有运动且约 4 秒后回正；三路由 320/768/1280 无横向页面滚动；键盘可达参数/语言/复制控件且可见焦点；未知路径、未知 slug 和尚未实现 /guide 均 Not Found。未发布 related 不生成死链。无捕获到的浏览器运行错误或外部运行请求。
   - PASS：代码清理 timeout/rAF/IntersectionObserver/ResizeObserver/matchMedia/scroll/resize listeners；布局读取由测量缓存及 rAF 更新，指针 handler 不读布局；动态 CSS 仅 transform/opacity，打字直接更新文字。
5. **Deviations / boundaries**：C01 控制清单只含六个真实计划 related slug，Stage 4 必须切换实际实现严格引用校验；/guide 链接隐藏，图库/搜索/筛选/URL 状态/其余效果未做。C09 保留 Typewriter/Glass 英语两短语原样边界，最终全库数量仍待决。C10 为避免演示与复制提示词无障碍描述不符，最小补充 Tilt 方向键/触屏滚动/单次 Auto、Typewriter 键盘触屏单遍、Glass 静态 reduced-motion 与控件可达性；未添加参数或虚构静态动画。背景切换是演示按钮，不是提示词参数。单位无空格为 CSS 可用值，单位不重复。此处浏览器为真实 Chromium + 触屏模拟，未声称物理手机测试、Lighthouse/axe 或 Stage 5 全量验收。
6. **Open questions**：没有阻止 Stage 1 适用验收的剩余问题；保留台账中未获批准的后续项与最终全库短语规则。默认鉴权读远端成功，推送结果另记。独立 H6、物理设备覆盖、Stage 5 全量可访问性审计、Stage 6 主机/深链接部署仍待对应阶段。
7. **Next step**：提交实现并仅正常推送 stage-1-foundation，核验远端 SHA/main/Stage 0/干净工作树；停止并等待独立 H6 与下一阶段批准。文档规则先行提交为 `879d8fd`。

### 2026-11-19 — Stage 1 — 获批规则落地

1. Summary：只采纳 C01、C02、C03、C04/C05、C11/C12 五组批准规则。SPEC 定义阶段关联白名单、静态无时间例外、独立预览与导航、分阶段顺序及有限手动 reduced-motion 演示。
2. Files changed：docs/SPEC.md、docs/PROGRESS.md；原始需求不改，最终功能/验收不删。
3. Commands/results：完整读五份治理文档及 E/H0/H6；核验 origin、干净 checkout；ls-remote main 为 dfcff865aa74af520ab52a84b1a5f766156b4570，Stage 0 为指定基底，Stage 1 尚不存在；从该 SHA 建分支。checkout 无 .agents/skills。
4. Acceptance：规则记录完成；应用四项检查将在实现后实跑，本条不称通过。
5. Deviations：Stage 0 专属分支/身份限制由本次明确用户授权取代，不改历史 AGENTS。/guide 暂隐藏；根页仅三条文本链接。参数按 kind 验证，不给 boolean/select 伪造范围。
6. Open questions：其余建议并未整体批准。C09 本阶段保留两个样例英语短语数量；最终全库数量待澄清。C10 仅为准确性补充适用的键盘/触屏和有限播放说明。阶段无关 C06–C08、C13–C17 继续待决。
7. Next：实现三效果闭环并实跑质量门。依赖授权范围内使用 React 18/React DOM、Router、Fuse；开发使用 TypeScript/React 类型、Vite、Tailwind、Vitest、ESLint 及其 TS 配套。精确版本和锁文件，安装 --ignore-scripts，不运行 package lifecycle，不引入其他产品依赖。

### 2026-11-19 — Stage 0 — 提交推送交付回执

1. **Summary**：治理提交 `aaa15c299a1cae7aed0873c3c789d8cd6ef7138f` 已正常推送到 origin/stage-0-governance。此日志回执作为后续小提交保存，分支最终头以交付报告和远端为准，不改写历史。
2. **Files changed**：治理提交恰好八个授权文件；回执仅更新 docs/PROGRESS.md。README、原文和 SPEC 未再修改。
3. **Commands run and results**：显式 `git add --` 八路径；`git diff --cached --check` 无输出；`git diff --cached --stat` 显示八文件；`git commit -m "docs: establish Stage 0 governance and requirements archive"` 成功。`git show -s --format=fuller HEAD`、`git show --format=raw --no-patch HEAD` 已核验为环境默认 Git 作者与提交者，父提交为原 main。`git push -u origin HEAD:refs/heads/stage-0-governance` 返回 0、新建远端分支成功。随后 `git ls-remote --heads origin main stage-0-governance` 确认任务分支等于该完整 SHA，main 仍为 `dfcff865aa74af520ab52a84b1a5f766156b4570`；`git status --short --branch` 无改动；基底至 HEAD 的 `git diff --check` 无输出。
4. **Acceptance checklist**：治理内容复核通过，默认身份符合用户新授权，提交/推送成功且已核验。typecheck/lint/test/build 仍为不适用、未运行；没有应用、效果代码或构建产物。未开 PR、未合并、未部署、未进入 Stage 1。
5. **Deviations**：无新增偏差；来源归档限制保留于前次日志。
6. **Open questions**：C01–C18 仍须人工决策；本交付不代表独立 H6 审阅通过。
7. **Next step**：正常推送本回执后复核最终分支头、原始作者、main 和干净工作树；等待人工审阅与阶段批准。

### 2026-11-19 — Stage 0 — 默认身份获准，提交前复核

1. **Summary**：用户在知晓公开提交姓名/邮箱后明确回复“提交使用的Git姓名和邮箱就使用默认的”。按此新授权使用目标 checkout 已有默认身份。
2. **Files changed**：仍是原八个治理路径；本次补充 PROGRESS 授权与复核记录，不改原文/SPEC/产品决策。
3. **Commands run and results**：`git var GIT_AUTHOR_IDENT` 与 `git var GIT_COMMITTER_IDENT` 已核验为环境默认 Git 作者与提交者；未设置任何身份值。`git status --short --branch` 与 `git remote -v` 确认目标分支/origin，只有原八文件未跟踪。`python3 /tmp/effect-stage0-library/verify_stage0.py` 全部治理检查再次通过；`git diff --check` 无输出；`git ls-remote --heads origin main stage-0-governance` 仅返回原 main 基底；`date -u +%Y-%m-%dT%H:%M:%SZ` 返回 2026-11-19T08:11:58Z。
4. **Acceptance checklist**：八路径、全文归档、两框保真、G2/F、编辑器/忽略规则、无应用和构建产物均通过；typecheck/lint/test/build 不适用、未运行。提交及推送结果在交付后记录。
5. **Deviations**：无新的产品偏差；原附件下载与重建来源限制仍如前记录。
6. **Open questions**：C01–C18 仍待人工决定，不将建议自动视为确认。
7. **Next step**：仅提交并正常推送 stage-0-governance，核验原始作者、远端分支与 main；不进入 Stage 1。

### 2026-11-19 — Stage 0 — 文档准备与 H1 审阅

1. **Summary**：完整读取附件，归档 A–H；顺序合并 D 两框，保留所有内部类型、代码、样例及未解决冲突；保留 F 全阶段门槛与 G2 规则，增加本轮获授权的云端执行、dots 协调及无应用检查说明。
2. **Files changed**：恰好八个新增路径：`docs/REQUIREMENTS_SOURCE.md`、`AGENTS.md`、`docs/SPEC.md`、`docs/ROADMAP.md`、`docs/PROGRESS.md`、`.gitignore`、`.editorconfig`、`.github/pull_request_template.md`。README 未修改。
3. **Commands run and results**：
   - 初次 `pwd && ls -la && git remote -v && git status --short --branch` 在 /workspace：确认目录布局；Git 返回 128，因为父目录不是仓库。之后所有仓库命令明确在 /workspace/effect-lexicon 执行。
   - `git remote -v`：fetch/push 均为唯一指定 origin；`git status --short --branch`、`git status --porcelain=v1`：初始 work 分支，工作树干净。
   - `git log -3 --oneline`、`git branch -avv`：唯一基底 Initial commit，完整 SHA 见 Current stage。
   - `git ls-remote --heads origin main stage-0-governance`：开始时仅返回 main；远端无 stage-0-governance。
   - `rg --files --hidden -g '!.git' -g '!node_modules'` 与 `cat README.md`：先读已有文件，仅 README；`ls -la .agents/skills` 返回 2，checkout 无该目录。没有本地附加技能可读。
   - 当前 Library 技能准备材料化，工具给出签名转移；从当前技能取得配套 helper，在仓库外的任务临时目录运行 `python3 /tmp/effect-stage0-library/library_file_transfer.py materialize /tmp/effect-stage0-library/source.md`：返回 1，`download failed`，没有源文件产生。未猜 URL、未切换环境。
   - 使用 Library read 后备路线连续读取 1–220、221–440、441–660、661–880、881–1042，全部版本 0；最后窗口 has_more=false，核对最后一行为 H7 第 4 项。依据每窗原始文本及文件最后 LF 重建临时源；首次无末尾 LF 的 `wc -lc` 为 1041 / 105346，补 LF 后为 1042 / 105347。dots 另独立确认同样行数、字节数及末尾 LF。
   - `git fetch origin main` 成功；`git rev-parse HEAD FETCH_HEAD` 均为记录基底；`git switch -c stage-0-governance FETCH_HEAD` 成功。
   - `date -u +%Y-%m-%dT%H:%M:%SZ` 实际返回 2026-11-19T08:03:56Z；日志仅使用实测日期，不虚构版本或测试时间。
   - 在 checkout 中运行 Python 标准库提取写入：源文件复制、D 两框提取合并、F 提取、G2 原规则提取与获授权补充，其余为治理文档。
   - Python 空白检查：原文、SPEC、ROADMAP、AGENTS 均无行尾空白；后续最终验证结果见下节。
   - typecheck、lint、test、build：**本阶段不适用 / 未运行**。无 package.json、应用、依赖或脚本；未安装依赖、未创建空脚本，未声称应用检查通过。
4. **Acceptance checklist**：文件范围、归档、两框、规则、忽略项、无应用及 whitespace 结果见 Final verification。H1 提交/推送仍待作者身份确认，阶段尚未完整关闭。
5. **Deviations**：直接字节下载失败，改走全文线窗；归档与线窗重建源逐字节一致，但没有上游原附件 SHA-256 可比，不能把等字节数称为独立的原附件字节证明。Stage 0 应用命令 N/A 是本轮明确授权的治理说明。未修改 SPEC 解决产品冲突。未提交是本轮明确作者门禁。
6. **Open questions and proposed spec changes**：见下面集中清单；仅提出建议，未采纳为新产品规范。
7. **Next step**：dots 确认公开 Git 作者姓名/邮箱后，复核工作树、提交并只推送该分支，验证作者、完整提交 SHA、远端分支及 main 未变。随后等待人工 Stage 0 审阅与批准。

### Final verification

- 实跑 `python3 /tmp/effect-stage0-library/verify_stage0.py`：通过。验证脚本保存在仓库外，仅用 Python 标准库与 Git，未增加第九个仓库文件。
- 通过：八个授权新增路径，README 与基底无修改；origin、HEAD、分支正确；完整 A–H、1042 行、105347 字节、最后一行、归档与重建源字节一致、SHA-256 一致。
- 通过：SPEC 与 D 两框内容逐字一致且顺序正确，只移除外层四反引号；ROADMAP 完整 F 内容，仅去除节间末尾空行；AGENTS 完整保留 G2 原规则并追加已授权说明。
- 通过：全部八文件 UTF-8、LF、末尾换行，无行尾空白；EditorConfig 五项规则；13 个 `git check-ignore --stdin` 样例（node_modules、dist、coverage、.env、.env.local、两类编辑器目录、交换/备份文件及三个 OS 文件）。
- 通过：逐文件 `git diff --no-index --check /dev/null <path>` 无空白诊断；`git diff --check` 无输出。因新增文件尚未暂存，特意检查每个 untracked 文件；不以空的 tracked diff 冒充全量检查。
- 检查脚本首次将 no-index 的“存在差异”返回码 1 误判为失败；检查其 stdout/stderr 为空后修正为接受 0/1 且无空白诊断，再完整运行通过。没有删除或弱化产品测试。
- 通过：H1 摘要 11 行与规定段落齐全；目录文件清点只有原 README 加八文件，无 src、package.json、锁文件、node_modules、dist 或 coverage。
- `wc -lc docs/REQUIREMENTS_SOURCE.md`：1042 / 105347；`sha256sum docs/REQUIREMENTS_SOURCE.md /tmp/effect-stage0-library/source.md`：均为 Observations 中完整 SHA。
- 最终 `git ls-remote --heads origin main stage-0-governance`：仍仅返回 main，SHA 为记录基底。远端写分支尚未创建；本任务未改 main。
- typecheck / lint / test / build：不适用、未运行；提交/推送及提交作者核验：等待身份确认，未运行。全部治理检查通过不代表 H1 提交要求已完成，也不代表 Stage 1 获准。

## Observations

- 附件为用户提供的需求材料，包括 [Assumption]、[Recommended]、样例与后续提示词。完整保留不等于批准其中所有建议或执行后续任务。
- 来源文件名：effect-lexicon-product-spec-and-prompts(1).md，Library 版本 0，1042 行，105347 UTF-8 字节。身份由 Library 解析和连续 read 响应核实。
- 归档及重建源 SHA-256：`634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`。这是重建源/归档的实算摘要，不是服务端给出的原附件摘要。
- 原仓库只有 README，无无关改动需要搬移。最初未使用默认身份；后续在用户明确确认使用默认身份后，以 git var 的有效结果执行，不修改姓名或邮箱。
- 域名、主机、名称、代码/内容许可、素材、术语与中文人工审阅、反馈渠道在 F3（原文 835–843）仍为人类任务；当前公开仓库归档完整需求是用户明确要求，不附加任何其他私人信息。
- 源文引用行号一律指 docs/REQUIREMENTS_SOURCE.md，便于逐条复核。风险分为硬冲突与实现约定/范围歧义，不把所有差异都当成缺陷。

## Proposed spec changes

以下为 Stage 0 原建议台账；已批准项以本轮日志为准，其余继续待决。SPEC 仅改获批条款；原文保持未修订，最终验收不削弱。

| ID / 类型 | 原文位置与证据 | 影响 | 拟议最小修订（待确认） |
| --- | --- | --- | --- |
| C01 硬冲突 | D §5 L444 要求 related slugs 存在；§7.1 L519、546、572 的三个 published 样例关联六个后续效果；E Stage 1 L672–679 只允许三个样例且不含另 15 项 | 原样 Stage 1 不能同时通过全量引用校验，或会产生死链/越界造效果 | 保留样例原 slug；用受控的计划 slug 清单校验阶段引用，详情仅展示已发布关联，不造占位/死链；Stage 4 启用全部 18 项实际存在且已实现的严格检查，最终不得仅靠计划清单过关 |
| C02 硬冲突 | D §5 L444 每条双语提示词须有 duration/timing；§7.1 L565–582 Glassmorphism 明确 none/static 且没有时间 | 静态正确样例无法通过统一时间要求 | 静态样式必须明确无触发/无动画并验证视觉参数；仅动效强制时间/运动信息，不编造静态时长 |
| C03 硬冲突 | D §3.1 L365 整卡一个链接；§9 L599 禁预览点击导航、标题和详情链接导航；§7 L483 卡片翻转是 button | 嵌套控件、焦点、触摸预览与链接导航互相冲突 | 使用非链接卡片容器，将可操作预览与标题/详情链接分离，保留所有预览、键盘、触屏和导航能力 |
| C04 硬冲突；Stage 0 已获例外授权 | G2 L899–902、H0 L942、H5 L1028、H6 L1034 要跑应用命令；H1 L953 禁脚手架和功能代码 | 空仓库无法运行真实应用检查 | 本轮已按明确授权在 AGENTS 标记 Stage 0 N/A/未运行，用文档检查代替；以后有应用时仍严格运行全部适用检查，不改原文 |
| C05 顺序冲突 | D §13 L645–647 先 search/library 再 detail/demos；E L662–719 与 F L812–815 先三效果详情纵切再 discovery | 后续执行顺序可分叉 | 确认分阶段任务按 F/E 顺序，D §13 作为完整实现的总体参考；不改变最终功能验收 |
| C06 硬冲突/阶段政策 | E Stage 2 L706 明确 test.todo，Stage 3/4 L735、762 激活；G2 L901 禁跳过测试 | 可能把有意延期误报全测通过，或越界提前实现 | 明确已实现查询必须严格运行，未实现查询为具名、具阶段截止的待实现清单；最终 Stage 4 无此类 todo，所有原验收保留 |
| C07 计数约定 | D §6 L457–469 有 12 条查询组，L462 包含三个独立查询；§11 L632、E L762/788 称 12 queries；L458–459 各要求两效果 | 只写 12 个字符串测试会漏查同义句或第二个目标 | 确认 12 组、14 个实际查询字符串，每个预期目标都在 top 3；Stage 2 只查已有目标，后续补齐双目标断言 |
| C08 硬冲突 | D §7 L481 每项 2–5 params；L487/488/490/496/498 指定仅一个参数；E Stage 3 L732 也强制 2–5 | 严格按具体列表实现会违反总则 | 用户确认是补充有意义的第二参数，还是把下限明确为具体单参数例外；不擅改参数或删除验收 |
| C09 硬冲突 | D §7 L481 每语言 3–6 searchPhrases，§7.1 L504 样例原样使用；L538、564 英语各只有两条 | 原样样例与内容数量要求冲突 | 经批准给 Typewriter、Glassmorphism 各增加一条真实英语检索短语；Stage 0 不修改样例 |
| C10 硬冲突/语义不完整 | D §8 L593 要所有提示词末尾含 reduced-motion、键盘、触屏兜底；§7.1 L555–556 Typewriter 末尾没有明确触屏/键盘，L581–582 静态样例只有对比度兜底；同时 L504 要原样使用 | 提示词质量规范与原样样例不能同时完全满足 | 获批后补齐按效果适用的三类兜底；静态明确无运动及操作可达性，不添加虚构动画 |
| C11 语义歧义 | D §7.1 L543、555–556：loop=false 时删除及下一句分支被移除，但文案仍说三句及最后一句停留 | 可能只显示第一句，却声称最后一句 | 确认非循环模式是否依次播放三句一次并保留第三句；若是，仅把回到第一句放进 loop 条件，句间推进始终执行，并同步中英文行为文案 |
| C12 语义歧义 | D §9 L615 禁 autoplay/looping，但显式 Play/Replay/Auto demo always runs；样例 L539、552、555–556 默认 loop；G2 L907 同类措辞 | 用户点击后是否无限循环不明确，可能违反 reduced-motion | 建议 reduced-motion 下明确按钮只启动一次有限演示、随后静态停止，仍允许再次手动播放；请用户确认，不擅自取消手动体验 |
| C13 部署约定 | D §2 L347 承诺 offline after build / any static host，§3 L351 深链接；H2 L977–978 到 Stage 6 才加 host rewrite 和预渲染 | file://、无网络加载和首次深链接访问可能被误认为 Stage 1 就保证 | 明确离线为本地静态 HTTP 服务无需运行时外网；生产任意主机须满足路由配置条件，直接刷新深链接及预渲染在 Stage 6 验收；若要断网首次打开另立明确需求 |
| C14 硬冲突/样例实现例外 | D §9 L618 限 transform/opacity；§7 L485 改径向光斑位置、L488 改文字颜色、L490 渐变扫描、L495 改高度/背景/阴影；§4 L391 允许 150ms 颜色过渡 | 完全只做两属性会偏离指定效果，泛化例外又不可审计 | 按具体属性逐项记录必要例外或等效实现，经确认后验证性能；reduced-motion 下站点 chrome 即时变化，不把例外扩展为无限许可 |
| C15 实现契约约定 | D §8 L589 props 为 values/running/replayKey/virtualPointer；E Stage 2 L703 引入 compact/paused；G2 L914–915 Stage 1 后 Effect schema 人工批准 | paused/running 可形成双状态；把 demo props 当 Effect 变更会造成不必要重构 | 明确 compact 是组件展示参数、paused 与 running 单一来源适配，不默改 Effect 公共数据契约；任何真实 schema 改动仍须批准 |
| C16 范围与人工交接 | F L818–824 Stage 7+ 增长及 8 追踪；D §11 L628 exactly 18、§12 L643 analytics 等禁令；H2 L984–986 CI 合并部署但 agent 不生产部署；H7 L1041 人工发布 | MVP 计数、后续增长与禁止项可能永久互锁，发布可能越权 | 确认 exactly 18 是 MVP 基线，增长按批准波次验收；进入 Stage 8 前明确解除分析禁令；Stage 6 只准备发布候选/流水线，生产、合并、正式 tag 留给人 |
| C17 分类/路由实现约定 | B4 L123–125 与 B7 L191–208 用 visual style / loading states；D §5 L406–408 用 style/loading/none；B3 L117 /404，D §3 L351 任意未知路由 | 展示名称与机器 token、未知路由行为易混淆 | 确认 D 类型为代码 token，B 名称为展示文案；未知路径显示 Not Found，Stage 6 主机支持时返回 404；不改已有类型、不擅自添加 none 筛选 |
| C18 参数和校验约定 | D §5 L410–417 Param 包含 number/boolean/select，L442 自动单位但模板不得重复，L444 每个 default 在 min/max 内 | boolean/select 没 min/max，条件 key 与数值单位若仅做正则会误报 | 按 kind 验证数值范围、布尔类型、选项成员；校验普通/条件模板所有 key，测试有无显式单位两种情况；最终所有字段仍严格验证 |

## Decisions awaiting human

- **Stage 3 最新授权**：协调方确认独立 H6/阶段验收通过并明确授权提交及正常推送；以下旧候选等待条目保留为历史记录。无 PR、合并、部署或 Stage 4 执行授权。
- **Stage 3 当前候选**：按本轮 handoff 准备七项候选与完整私有 patch；开发自检通过不等于独立验收。只对本批三项 C08 第二参数按明确授权作常规选择，其余阶段待决项保留。未提交/推送；独立 H6 后仍需协调方明确指令。以下 Stage 2 条目为历史授权，不授权本候选直接发布。
- **Stage 2 提交已获授权**：独立 H6/阶段验收通过，协调方已明确指令正常提交/推送；沿用环境默认 Git 身份。未批准的产品目标/栈变更仍须用户决定。
- **已批准**：C01、C02、C03、C04/C05、C11/C12，见 Stage 1 日志和 SPEC 修订。C18 本阶段按用户明确要求区分 kind 并测试单位，不伪造范围。
- **保留待决**：C08 后续单参数项、C09 最终全库英语短语数量、C10 其他 15 项提示词完整性；Stage 1 仅做已说明的最小可访问性补充，未一概批准全部台账。
- **Stage 2 当前授权**：C06–C07 按原 Stage 2 要求具名延期/12组14字符串；C15 仅新增组件 compact/paused，不改 Effect schema；筛选使用既有 token，不新增 none 筛选。C14 后续效果例外及其他未采纳建议仍按后续阶段范围处理。
- **Stage 6 及成长前确认**：C13 部署承诺、C16 发布/增长门禁，以及 F3 人类输入、许可证、主机与域名、人工内容审阅；无提前生产发布。
- **当前阶段门**：协调方确认 Stage 1 a847ed7 已独立 H6 通过且用户确认。Stage 2 独立 H6 与验收已通过，获准提交/推送；本工作者不处理 PR/合并。Stage 2–5 按新授权顺序协调，不再逐阶段请求用户重复确认；Stage 5 后停止。
