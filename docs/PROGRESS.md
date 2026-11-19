# Effect Lexicon / 动效词典 — Progress

## Current stage

Stage 1：三效果基础闭环已实现；独立 H6 发现的四类异步复制竞态已按本次授权修复并复测，等待再次独立核验，不开始 Stage 2。旧交付自检未覆盖这些竞态，以下新日志修正当时“无当前阻塞”的结论。
分支：`stage-1-foundation`；基底为已独立 H6 的 `e51155b01599a79e3573e47be45077339c018f13`。
环境：指定 effect-lexicon-cloud，checkout `/workspace/effect-lexicon`，origin `https://github.com/Skw03/effect-lexicon.git`。
沿用已有效解析的环境默认作者/提交者；不新增身份、不记录姓名邮箱。仅提交并正常推送 Stage 1 分支，不改 main/Stage 0、不 PR/合并/部署。
Stage 0 的 H1 总结与日志作为历史保留。

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

- **提交门禁已解除**：用户明确确认使用环境默认 Git 姓名/邮箱；已核验 author 与 committer 有效。阶段审批和产品决策仍待人工确认。
- **已批准**：C01、C02、C03、C04/C05、C11/C12，见 Stage 1 日志和 SPEC 修订。C18 本阶段按用户明确要求区分 kind 并测试单位，不伪造范围。
- **保留待决**：C08 后续单参数项、C09 最终全库英语短语数量、C10 其他 15 项提示词完整性；Stage 1 仅做已说明的最小可访问性补充，未一概批准全部台账。
- **Stage 2–5 实现前确认**：C06–C07 测试延期/计数、C14 属性例外、C15 组件 props、C17 token 与路由约定。可以一次审核全部建议；未经确认不把它们变成产品规范。
- **Stage 6 及成长前确认**：C13 部署承诺、C16 发布/增长门禁，以及 F3 人类输入、许可证、主机与域名、人工内容审阅；无提前生产发布。
- **阶段门**：Stage 0 H6 与 Stage 1 启动授权已收到；本轮 Stage 1 自检不冒称独立 H6。等待新会话独立复核与下一阶段批准。
