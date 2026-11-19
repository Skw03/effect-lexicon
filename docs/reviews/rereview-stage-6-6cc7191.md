# Stage 6 committed candidate — 最终独立复验报告

审查日期：2026-11-19。仓库：https://github.com/Skw03/effect-lexicon.git 。候选分支 `stage-6-launch`，精确受审提交 `6cc71919b6abb6212f2d1357278a6d1dd9380878`；远端 main 基底 `0dba59fb0a833d40f8e54da430f199c6ebe58dbc`。产品复验开始与结束检查远端均吻合。独立审查员未实现本候选，使用独立执行器及 detached checkout，未改原工作树、行为代码或测试。文档修复独立复验 SHA 为 `d3d09ccd53def8d4dabb8d05221c31c870bf9b68`，本次再次核对远端候选及 main 均吻合。此报告归档实际产品实测及后续文档复验；最终归档提交由 Git 和交付回执标识，避免自引用。

## 结论

- **当前供应商无关候选：PASS — 适用本地要求已独立验证。** 产品实测 `6cc71919b6abb6212f2d1357278a6d1dd9380878`，文档修复复验 `d3d09ccd53def8d4dabb8d05221c31c870bf9b68`；S6-IR-001/002/003/004 均 PASS / CLOSED。历史产品提交当时的总体结论为 CHANGES REQUIRED，仅余004；不把该历史结论改写为当时已通过。
- **完整 Stage 6 / H2：BLOCKED**。真实宿主、Actions、最终域名/素材/法律输入及人工验收尚未完成，本地模拟不等于这些门通过。
- 未发现新增必需运行时缺陷。Stage 7 **NOT DUE**。产品复验阶段未提交或推送；本次仅获准提交推送本报告与 PROGRESS 状态/链接。未建 PR、打 tag、部署、启用 Actions、外部托管操作或查询/更改账户；原始证据不外发。

## 基线、范围与版本

阅读 AGENTS、REVIEW_POLICY、ROADMAP、SPEC、原始 REQUIREMENTS_SOURCE 的 F1/F3/H2/H6、PROGRESS、RELEASE、现有本地候选报告及适用实现/测试。适用的是用户新授权的 Stage 6 开发与独立复验；旧 Stage 0–5 合并授权不扩展为 Stage 6 发布授权。F1 的生产烟测和亲读 18 项、F3 的人工作业、H2 的实际托管与 CI 门均保留，不因本地成功而豁免。

产品提交6cc7191与 main 相差 44 路径，897 行新增、48 行删除。没有产品依赖/锁文件、内容 schema 或 18 项内容变更。新代码为构建时静态输出、统一配置/路径、hydration、metadata、错误边界与本地静态宿主；CI 仅惰性文档模板。未独立取得上一位 reviewer 的完整补丁文件，因此不另作其补丁字节同一性声明；本报告直接绑定并执行上述 committed SHA，不依赖原摘要作通过证据。

## 四项发现复验（当前状态）

| ID | 严重性 | 当前状态 / 证据版本 | 原条件与独立证据 |
| --- | --- | --- | --- |
| S6-IR-001 | P2 | PASS / CLOSED；产品6cc7191 | `scripts/release-config.mjs:39`、`scripts/build.mjs:10`：有效配置只解析、校验、冻结一次，客户端与 SSR 使用同一 snapshot，后续禁用 Vite 重读 env。20 个既有完整构建用例及独立补充的真实 mode/env-file/process 覆盖用例通过；显式空进程 origin 也覆盖文件并恢复 noindex。 |
| S6-IR-002 | P2 | PASS / CLOSED；产品6cc7191 | `scripts/release-config.mjs:27`：显式 production 要求公网 DNS 类别 HTTPS origin、默认端口和全部 owner 输入/素材；无害负例 fail closed。独立检查 HTTP、保留名称、供应商预览后缀、普通子路径、缺少输入、非法素材开关、缺失素材；正常 HTTPS 语法正例被接受且对象冻结。语法验证不证明域名归属、DNS、批准或素材权利。 |
| S6-IR-003 | P2 | PASS / CLOSED；产品6cc7191 | `src/release/path-policy.mjs:3`、`scripts/serve.mjs:23`、App/SSR/Metadata：共享 canonical 政策，已知别名 308 保留 query，未知路径真实 404。1167 路径检查、441 release 检查、20 prepaint 检查及独立真实导航/返回/刷新探针通过。 |
| S6-IR-004 | P3 | PASS / CLOSED；文档d3d09cc | 独立确认与产品6cc7191仅差 README、REVIEW_POLICY、PROGRESS、初审摘要四文档；README:3/72、REVIEW_POLICY:63、PROGRESS 当前段落及初审摘要补记一致。准确注明已提交产品 SHA、001–003的独立结果和004待复验，没有提前签发004 PASS；原初审全文及原始要求保留。本文正式记录关闭。 |

### S6-IR-004 历史复现与最终验收

来源：H2 第 9 项更新 README；REVIEW_POLICY 的当前交接及提交后版本绑定规则；owner 持续审查要求第 9–10 节准确区分本地、提交、推送和已验版本。负责：Stage 6 实施任务，SUN 协调。

复现（无需浏览器）：读取产品提交6cc7191的 `README.md:3` 的“当前为 Stage 6 未提交修复候选”和 `docs/REVIEW_POLICY.md:63` 的“当前 stage-6-launch 未提交候选”；对照远端 branch SHA 与提交本身。前者在入口当前段落，后者在“Stage 6 当前交接”，均非明确的历史记录。

期望：当前入口标注已提交候选及精确版本/当前独立复验状态，完整 H2 仍 BLOCKED，未发布、未激活 Actions；原补丁初审、历史失败及未提交时的历史记录原样保留。

最小验收：仅同步上述当前状态段落，引用受审 SHA 和新的独立结论/报告；不得将历史报告改成最终 PASS、不得宣告 Stage 6 全部完成。提交后独立核对 diff 仅为文档状态和评审记录；若行为代码未变，无须重复整个产品审计。此项不是新增产品范围，也不要求修产品或部署。

文档最终复验：以上最小条件在 d3d09cc 全部通过。与6cc7191的精确diff仅四文档；无产品、测试、构建/托管配置、依赖或原始需求差异。当前状态补记与本审查员实际证据一致，历史初审主体逐字保留。本次归档另仅增加本报告与PROGRESS状态/链接，未重新运行未变产品的四门或浏览器；下表为产品SHA上本审查员实际执行的证据，不是文档轮的新测量。

## 产品6cc7191独立运行证据

使用锁文件 `npm ci --ignore-scripts`；安装与全部命令均真实运行，无产品依赖变更。工具：Node 24.22.1、npm 11.9.0、Python 3.12.14、Playwright 1.62.0、Chromium 156.0.8078.79、Vite 6.3.5、Vitest 3.2.4、axe-core 4.10.3、Lighthouse 12.8.2。测试工具已预置在产品外；未运行依赖 lifecycle scripts。

| 检查 | 实际结果 |
| --- | --- |
| 四门 typecheck / lint / test / build | PASS，均 exit 0；160 Vitest + 62 Node，0 skip/todo |
| 默认构建 + 配置本地 origin 的构建 | PASS；20 实文路由 + 404；默认不伪造 canonical/assets、noindex，sitemap 空；审计 origin 有 20 sitemap 条目及 robots 引用 |
| `stage6_config_build_check.py` | PASS，20 个完整构建情形 |
| 独立配置探针 | PASS，4 个实际构建的 env/mode/process 正例 + 7 个无害拒绝用例 + 1 个纯配置冻结/HTTPS 正例；不访问正例域名、不代表真实发布 |
| `stage6_paths_check.py` | PASS，1167 项 HTTP、JS-on/off、全部规范路由及别名检查 |
| `stage6_regression.py` | PASS，441 项；全路由静态与水合、18 详情 EN/ZH × normal/reduced、刷新、动态参数 CSP、metadata、真实 404、缓存/响应头 |
| `stage6_prepaint_check.py` | PASS，20 项，四偏好组合，故意阻断 bundle 检查首屏提示与语言偏好 |
| 七套旧浏览器回归 | PASS：smoke 67、clipboard 8、discovery 68、Stage3 142、magnetic 107、Stage4 259、Stage5 518；共 1169 |
| 已有搜索、Modal 修复回归 | PASS：23/23、88/88 |
| `stage6_boundary_check.py` | PASS，3 断言；中文 fallback，周围提示词仍可操作 |
| 独立真实导航探针 | PASS：四种语言/运动组合下 index.html 别名保留中文 query + style 筛选，点击详情、刷新、Back、Guide 与返回；额外大小写/终端 index.html 别名；无 hydration/runtime console error |
| 独立可选存储失败 | PASS，无法访问 localStorage 时仍水合、展示并切换提示词 |
| 独立真实 demo 故障隔离 | PASS，Glassmorphism 和 Typewriter 各在图库与详情用内存替换组件触发受控异常，18 卡保留、中文 fallback、真实复制仍工作；恢复组件后 Reset 恢复演示。未改源码、不构造攻击载荷 |
| 可维护性干跑 | PASS，第 19 项仅在临时副本，验证/search/详情/参数/双语复制/相关链接通过；正式仍 18 项、原树不变 |
| axe | PASS，21 状态（Library + 18 详情 + Guide + 打开的 Modal），全部 violations 空，不仅 critical/serious 为零 |
| Lighthouse 四类门 | PASS，Library **91/100/100/100**；Tilt 详情 **93/100/100/100**。顺序 performance/accessibility/best-practices/SEO；mobile 阈值 85/95/95/95，脚本 exit 0；功能套件结束后单独运行，一次通过 |
| 重复构建确定性 | PASS，相同配置两次生成 27 文件逐字节一致；临时 SSR bundle 已清理 |

既有脚本只在仓库外副本把默认端口替换为本轮独占本地端口，断言未改；dev 夹具使用开发服务，其余 release/axe/Lighthouse 使用真实构建输出及本地静态宿主。独立导航探针首次使用 cards 筛选却期望 Glassmorphism（其类别为 backgrounds）以及唯一匹配假设，导致探针断言失败；纠正为 style 后复验通过。这是测试预期错误，保留原失败日志，不作为产品缺陷或隐匿重试。没有产品错误被多次重试“跑绿”。

另人工查看了本轮实际渲染的 1280px Tilt 详情与 375px Guide，包括新增隐私 footer、reduced 提示及提示词布局；广泛尺寸、键盘/touch/运行行为由上述回归覆盖。屏幕截图仅本地保留，不附公开报告。

## H2 要求矩阵（当前适用性）

| 要求与源 | 当前本地检查 | 完整交付状态 |
| --- | --- | --- |
| H2.1 所选宿主 routing / real 404 | PASS，本地 20 路由、别名 308、未知 404、刷新与历史恢复 | BLOCKED，宿主与外部 preview 未选择/授权 |
| H2.2 prerender / real no-JS / hydrate | PASS，20 路由正文，18 详情名称/别名/说明/提示词及水合演示，两语言两运动设置 | 本地 PASS；真实 hosted 仍 BLOCKED |
| H2.3 metadata | PASS，可用输入下 title、description、lang、canonical、OG/Twitter 文本与客户端导航同步；unknown noindex | 正式域名、批准 OG/favicons/manifest 资产链 BLOCKED；不以缺少 owner 输入判本地产品缺陷 |
| H2.4 sitemap / robots | PASS，内容索引驱动，默认关闭索引/审计 origin 正确输出 | 正式 origin/indexability BLOCKED |
| H2.5 CSP / cache / security headers | PASS，本地实际 HTTP 响应及 browser 全站，必要 inline styles 已解释，hashed assets immutable / HTML no-cache | provider 配置、HTTPS/HSTS 与实际部署 BLOCKED |
| H2.6 demo error boundaries | PASS，实际受控失败与恢复，不影响页面和提示词 | 本地 PASS |
| H2.7 privacy / naming / legal / feedback | PASS，静态隐私与名称说明、可配置结构 | owner 许可、内容条款与反馈目标 BLOCKED |
| H2.8 PR CI / Lighthouse / deploy integration | PASS，本地四门、axe 和两路 Lighthouse；仓库中 CI 仅 docs/ci 惰性模板，无部署 job | Actions 真实执行、host preview 和未来正式集成 BLOCKED；当前不允许激活 |
| H2.9 RELEASE / CHANGELOG / README | CHANGELOG 明确 unreleased，供应商无关 runbook 与本地命令 PASS | README 当前状态在d3d09cc复验 PASS（004 CLOSED）；provider 可执行发布/回滚步骤 BLOCKED |
| H2.10 RC tag | 当前操作不获授权，未打 tag | BLOCKED，待单独指令；不以擅自打 tag 通过 |
| F1/F3/H2 人工门 | 不可由自动测量代替 | BLOCKED：最终名称/域名与权利、宿主/DNS/证书、assets/legal/feedback、母语中文和术语审阅、owner 亲读 18 项及 prompts、Search Console、发布/回滚/生产烟测 |
| H6 独立精确提交复验 | PASS，独立执行本 SHA；不是实现方摘要代替证据 | 本地 PASS，四项 CLOSED；完整H2仍BLOCKED |
| Stage7+ | 本轮无内容扩张/分析/账户/后端 | NOT DUE |
| 条件允许的 hosted preview noindex | 无真实 preview，保留政策，不为 SEO 关闭保护 | NOT APPLICABLE 于本轮 loopback 审计；以后真实预览必须另验 |

18 项全部包含在本轮 no-JS、水合及适用旧回归中：card-tilt-3d、spotlight-card、card-flip、glassmorphism、magnetic-button、ripple-button、sliding-fill-button、typewriter、gradient-text-shimmer、staggered-text-reveal、aurora-gradient、underline-slide-link、shrinking-sticky-header、parallax-scroll、scroll-reveal、skeleton-shimmer、pulsing-dots-loader、modal-scale-fade。不是用少量详情抽样冒称全覆盖。

## 材料限制与下一步

未运行真实 GitHub Actions、hosted preview、生产域名、DNS/HTTPS/回滚、RC/正式 tag、Search Console。仓库检查未见 `.github/workflows` 或所选供应商发布配置；惰性 CI 模板不部署、不上传、不持有写 token。没有访问账户或外部集成后台，所以不能宣称这些后台已全面关闭或审计。

未使用物理触屏设备、Safari/Firefox、原生屏幕阅读器或中端实体手机；Chromium/CDP 触摸与 Lighthouse 模拟不能代替这些覆盖。没有重新做 Shimmer 密集像素取样；该 demo、内容与既有样式未改，已重跑常规动画/参数/运动/axe 回归，原 Stage 5 像素证据仍属历史而非本轮新测量。不把 axe 自动零违规当作全面无障碍认证。

S6-IR-004 已完成提交后独立文档复验；当前无未关闭的本地候选发现。保留产品SHA绑定的技术证据，未经新行为变化不重复全套。等待 owner 选择目标宿主及剩余输入，再在另行授权范围继续真实 H2 门。本报告只含可公开的防御性技术摘要；原始日志、截图、探针文件和私人资料不随报告发布。

## 未来宿主条件性检查（非已观测缺陷）

若选择 Cloudflare Pages，[官方 route matching 文档](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching)说明目录形式的 `/about/index.html` 会重定向到 `/about/`。当前构建使用目录 index.html，而 sitemap 与本地服务器规范路径采用无尾斜线。由此推断必须在获准的真实预览上核对重定向、canonical、sitemap和刷新是否一致，必要时评估宿主专用 flat HTML 或重写。此项只是条件性检查，不是已观测到的 Cloudflare 缺陷；没有连接、配置或部署该宿主。
