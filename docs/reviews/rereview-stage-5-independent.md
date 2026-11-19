# Effect Lexicon — Stage 5 修复与治理最终独立复验

**最终结论：PASS — 当前 Stage 0–5 适用要求及本次修复/治理检查通过。EL-IR-001/002/003/004 全部 PASS / CLOSED。**

最终文档受审 SHA：`b0277596dc26a3598a669bb665ddbb055a074ae3`；产品独立实测 SHA：`6f596ae62462c1de3b38cb926009079cce1f5c6d`。两者的产品、测试、依赖完全相同；最终归档提交只增加本评审回执及必要的PROGRESS/CHECKLIST状态与链接。结论不是生产发布授权，Stage6仍NOT DUE；真实设备等未测限制保留。下文保留产品复验的原始过程和阶段性结论，最终四项状态见末节。

审查日期：2026-11-19；仓库 https://github.com/Skw03/effect-lexicon.git。
产品实测候选：`stage-5-independent-review` / **6f596ae62462c1de3b38cb926009079cce1f5c6d**。
main基线：`59a2429fcf190a6b9d3cf48d487f166c518866a9`。
审查者未实现这三项产品修复，使用精确候选隔离checkout。产品复验阶段未编辑代码或提交；本次获准仅归档评审回执与状态链接，正常提交推送。没有修改行为或测试，没有创建PR、合并、部署或开始Stage6。

## 范围与证据原则

按原报告 EL-IR-001/002/003 的验收条件复测原例、独立新边界及旧回归；审阅 AGENTS、REVIEW_POLICY、ROADMAP、PROGRESS、55条矩阵和18效果覆盖、原始基线报告及原文B5/D7/D9/E5适用段落。原始来源档案、SPEC、依赖/lock未变化；原始档案SHA-256仍为 `634d67c8765b7ec96aea1957d67a91048166ac1f127043a130b87665f20544c8`。旧七项Chromium脚本、原搜索/内容测试未被修改或削弱。产品6f596ae复验时，历史报告和矩阵与 `608dd5da1082ae546ca6dd7b866e1e4222eba495` 文件一致；后续矩阵只追加版本补记，原历史前缀保持不变。

独立证据不仅是实施方新脚本：审查者自行编写自然查询/混合输入探针和实际字形像素采样。短词歧义不强行要求某个未规定唯一结果；看语义合理性、名称别名优先和返回内容是否真实。未扩大至Stage6，未复审无变化全部历史内容；继承原精确基线的既有内容检查，并对共享搜索、Modal和Shimmer及受影响用户路径扩大回归。

## EL-IR-001 — 搜索复验

来源：REQUIREMENTS_SOURCE B5、D6；原报告验收。
修复：`7bd3386ee60856d949f98b5cde1bfce9495441b0`，整合候选为完整SHA见首部。`src/search/chinese.ts:4`产生去重2/3字n-grams，按文档频率降低泛词权重；`src/search/index.ts:27`与现有同义词覆盖结合，未加入逐句查询白名单。两个新增渐显短语是词义扩充，非替代通用字符匹配。精确/前缀名称、别名与phrase优先仍在。

独立原例：下列五个查询的目标均为第1名：
- 鼠标移到按钮上颜色从左往右填满 → sliding-fill-button
- 点按钮后圆圈向外扩散 → ripple-button
- 点击按钮时圆圈向外散开 → ripple-button
- 文字下面出现一条线 → underline-slide-link
- 卡片向上移动并慢慢显示 → scroll-reveal

独立新措辞：`按按钮时水圈往四周扩大` → Ripple第2；`按钮点下去有圆形波浪` → Ripple第1；`按钮的底色从左往右铺开`、`鼠标放上按钮底色慢慢填满` → Fill第1；`链接底下的线条从左向右伸出来` → Underline第1；`往下滑时卡片一个接一个浮出来` → Reveal第3；`滚动后卡片逐渐出现` → Reveal第1。这七句不在修复方测试用例中。

独立短词：按钮→Magnetic/Ripple/Fill；圆圈→Ripple；卡片→Tilt/Flip/Glass；文字→Typewriter/Shimmer/Stagger；光→Spotlight/Typewriter/Shimmer；翻→Flip；玻璃→Glass；水波→Ripple；淡入→Stagger/Reveal/Modal。它们的宽泛排序没有被误称成唯一精确命中。另逐个执行全部123个中英名称/别名查询，首名全部正确。原14输入/16目标在四门和Stage4回归中继续验证；实施方23项浏览器检查另验证真实构建UI、匹配来源、近似/空结果、筛选限制与运行错误。独立探针的模块诊断使用同一候选开发服务，实际构建UI由新脚本覆盖。

## EL-IR-002 — Modal复验

来源：REQUIREMENTS_SOURCE D7 item18/D9；原报告验收。
修复：`0c2175280043089f075b240f3df3d163553ac111`；`ModalScaleFade.tsx:34–64`在打开期间注册捕获阶段focusin及Escape守卫，清理时解绑；新opener恢复只在原stage仍连接、focus落body时发生，避免跨路由抢焦点。舞台视觉范围及dialog/aria-modal语义保留。

审查者独立在normal/reduce两模式执行原步骤及新增程序聚焦：开窗→点击duration、触碰startScale、对header链接调用focus→每步focus保持dialog内；每步Shift+Tab仍留内部；Esc关闭并回opener。外部真实点击/触摸仍把duration从250变150、startScale从.95变.81，未以禁止所有输入伪装修复。另连续三次打开/关闭、Reset重置并回新opener、重置后外部range能获得焦点；600ms/.8在双语prompt中存在，normal实际transition .6s、reduce 0s；关闭尚在过渡时导航离开，250ms后搜索focus保留，Esc无残余拦截。28条独立观测全部符合预期。

实施方新88项脚本独立重跑，覆盖鼠标/触摸×normal/reduce、双向Tab、两个关闭按钮、两参数实际样式、双语、stage边界、Reset及route-unmount，并追踪全局守卫注册/移除回到初始数量。旧Stage4/Stage5继续验证原Modal效果、卸载timer/rAF与其他demo不倒退。

## EL-IR-003 — Shimmer复验

来源：REQUIREMENTS_SOURCE D9至少4.5:1及E5，D7保留三色字形与扫光；原报告验收。
修复：`6f596ae62462c1de3b38cb926009079cce1f5c6d`；`GradientTextShimmer.tsx:10–11`三色加深为indigo/violet/pink，白色高光峰值从.85降到.2；字形/位移动画/时长带宽参数及播放契约不变。

独立新像素检查：20个场景/132帧；detail1280下duration1/2.5/6 × band10/20/40九组合；detail375下四个参数角点；gallery375/768/1360的真实默认预览；normal八个相位0/.17/.29/.41/.53/.67/.79/.91，另detail/gallery移动/桌面reduce静态。测试先暂时捕获隐藏文字背景与黑色字形mask，腐蚀2像素排除边缘，随后恢复原fill与样式再取实际颜色，mask不作为前景颜色证据。所有核心样本最低 **5.069346:1**；活动场景最大通道变化至少40级，证实不是无扫光的静态替代。人工查看实际中间帧，三色和扫光可辨，文字保持清晰。

实施方更密集脚本另独立执行，DPR2、375/1280、Library/detail、normal/reduce、默认及四个参数角点；每活动场景25个均匀相位加6个字形中心光带交叉相位，mask按3×3侵蚀；所有核心像素检查4.5阈值，并要求可见颜色变化。其结果与独立较稀采样不同是DPR/侵蚀/相位密度差异，不混用或只取较好值。本次24场景、376实际渲染帧全部通过，最低 **4.911546657:1**，无runtime error。旧Stage3/Stage5验证暂停、重播、减少动态有限播放、参数双语及清理。

## 治理复验

规则内容：职责分离、独立执行、提交后复验关闭、全生命周期/增量回归、五状态/三verdict、精确版本证据与继任审查、旧结论不覆写均具备。保留Stage1认可、Stage2–5自动顺序推进及审查后协调合并；没有恢复被取代的逐阶段人工审批，也没有授权Stage6/生产。新增AGENTS三行与ROADMAP两行均为最小引用。原P3两组div语义建议继续OPTIONAL，未提升为硬缺陷。

### EL-IR-004 — 原发现 P3 / FAIL / OPEN（6f596ae历史）— 当前交接快照未同步已整合修复

责任：协调/治理文档维护任务，非三项产品实施者。
来源：用户独立审查指令§3（实际进展）、§9（当前状态与交接）；REVIEW_POLICY §证据与缺陷关闭，尤其L59“PROGRESS指向当前快照”。
位置：`docs/PROGRESS.md:5`（Current stage）明确称“当前任务仅…持久化…不整合产品修复”；`docs/REVIEW_POLICY.md:65`当前交接入口仍称修复待分支处理/未来整合。实际本候选已包含 `7bd3386` 搜索、`0c21752` Modal、`6f596ae` Shimmer三个修复提交。PROGRESS只新增治理条目，没有整合候选记录，接任者不能从当前入口确定待复验的精确产品状态。

这不要求在独立复验前提前关闭FAIL；保持OPEN直到本报告形成是正确的。偏差是把“已整合、待独立复验”记成“仅治理、未整合”，与实际Git不一致。原基线报告/矩阵绑定旧SHA应保留，不应直接改成PASS。

最小修正/验收：只更新当前PROGRESS与治理交接段，明确main仍是基线、待审整合候选完整SHA及三个修复提交、此次独立复验结果/链接、可关闭的三项和剩余文档项；保留所有历史失败报告与旧SHA，明确尚未合并/部署且Stage6 NOT DUE。将本文经授权纳入新复验报告/当前矩阵记录时绑定新SHA，不改产品/原始规范。该文档修正只需独立复核diff、链接、SHA与状态一致性；无产品变化无需重跑全部浏览器审计。

## 限制与后续

物理手机、中端GPU帧率、Safari/Firefox、原生NVDA/VoiceOver与OS Pinyin候选UI仍未验证。触摸和减少动态是Chromium模拟；色彩验证是该浏览器、字体/截图配置下实际核心字形像素，未把抗锯齿边缘当实体颜色，也不声称覆盖全部设备色彩管理。Lighthouse只accessibility，axe仍有自动工具无法判定项，不代表完整WCAG认证。

Stage6预渲染、JS-off/hydration、部署/CI/安全头/SEO/生产烟测/回滚等 **NOT DUE**；没有执行。未来发布/依赖环境变化仍须按治理触发新审查。

## 产品候选 6f596ae 的阶段结论 — CHANGES REQUIRED（历史记录）

**EL-IR-001、EL-IR-002、EL-IR-003：PASS，可在本候选上关闭。** 这三个结论仅绑定 `6f596ae62462c1de3b38cb926009079cce1f5c6d`，不覆写旧基线FAIL。产品修复与适用回归通过，没有发现需要退回产品实施者的残留问题。

**EL-IR-004：P3 / FAIL / OPEN。** 当前进展入口未反映实际已整合修复，需协调方完成最小文档同步；规则本身保持原授权与要求，PASS。整体候选因尚有这项明确文档偏差维持CHANGES REQUIRED，不是因设备未测而虚构产品失败。完成纯文档修正后仅复核差异、引用和状态，不重复全套未变产品测试。

### 产品候选 6f596ae 的实际执行结果

| 检查 | 结果 |
| --- | --- |
| npm ci --ignore-scripts | exit0，无新增产品依赖/生命周期脚本 |
| typecheck / lint / test / build | 全部exit0；5文件160 tests，0 skip/todo |
| browser_smoke | 67/67，exit0 |
| clipboard_regression | 8/8，exit0 |
| discovery_regression | 68/68，exit0 |
| stage3_regression | 142/142，exit0 |
| magnetic_boundary_regression | 107/107，exit0 |
| stage4_regression | 259/259，exit0 |
| stage5_regression | 518/518，exit0 |
| 旧七项Chromium合计 | **1169/1169** |
| el_ir_001_search_regression | 23/23，exit0 |
| el_ir_002_modal_regression | 88/88，exit0 |
| el_ir_003_shimmer_contrast | 24场景/376帧；最低4.911546657:1；exit0 |
| 审查者独立search/Modal探针 | 22查询（含短词歧义）、123名称/别名、28 Modal观测；未见验收偏差 |
| 审查者独立字形采样 | 20场景/132帧；最低5.069346114:1；所有normal场景可见色差 |
| axe-core 4.10.3 | Library+18详情+Guide+打开Modal，21状态，violations=[] |
| Lighthouse 12.8.2 | Library与Tilt accessibility各100；本次新跑，非引用旧分数 |
| 构建资源 | JS295.94 kB / gzip99.68 kB；CSS26.16 / gzip6.62 kB |
| Git与范围 | checkout干净，diff --check通过；起止远端main与候选SHA未变 |

浏览器为Chromium 156.0.8078.79。默认端口被已有服务占用，未停止其他工作；开发服务与生产构建预览使用独立本地端口。旧脚本副本只替换loopback base地址，并逐文件核对与源码相比除此之外逐字一致，原断言全部保留。生产构建执行新修复脚本、独立Modal/像素检查、axe和Lighthouse；旧七套执行候选开发服务。原始报告和附件均只在本地证据区保留。

上述为产品复验结束时的历史交接要求，现由下述文档候选复验闭环；不覆写历史失败和当时结论。

## b027759 文档候选最终独立复验 — PASS

2026-11-19独立读取远端：main仍为 `59a2429fcf190a6b9d3cf48d487f166c518866a9`，`stage-5-independent-review`为 `b0277596dc26a3598a669bb665ddbb055a074ae3`。隔离checkout起点干净。相对已实测产品候选 `6f596ae62462c1de3b38cb926009079cce1f5c6d`，精确diff仅有PROGRESS、REVIEW_POLICY、REQUIREMENTS_CHECKLIST三份文档（42增、3删）；行为、测试、原始要求、SPEC、依赖均无变化。

### 来源与整合版本独立核验

已从指定origin取得原始修复对象，逐文件对比原始修复与整合提交，全部九路径内容一致，未只采信合成者声明：

| 缺陷 | 原始修复完整SHA | 整合提交完整SHA | 等价范围 |
| --- | --- | --- | --- |
| EL-IR-001 | `04d46ee9664b579f086e7a686ee3cba5ce01655e` | `7bd3386ee60856d949f98b5cde1bfce9495441b0` | 搜索实现、同义词、单测及浏览器回归，5文件 |
| EL-IR-002 | `56b864575f40009b7c686edff1a85e776e900ed8` | `0c2175280043089f075b240f3df3d163553ac111` | Modal组件及回归，2文件 |
| EL-IR-003 | `3b04323e55b028c7293db628205b71db74dc6b5c` | `6f596ae62462c1de3b38cb926009079cce1f5c6d` | Shimmer组件及对比度回归，2文件 |

PROGRESS当前入口已准确记录“已整合、产品经独立复验可关闭、文档项待验”，没有提前宣告整体通过；来源SHA、筛选/搜索结果、计数与本审查者保留的实际独立证据一致。CHECKLIST追加版本映射而非覆盖55条历史要求与18效果；原基线报告逐字保留。REVIEW_POLICY仅同步交接段，职责分离、授权优先级、Stage1批准、Stage2–5自动推进/审查后协调合并及Stage6停止边界不变。

因此EL-IR-004最小验收条件满足；本报告签发最终结论并链接当前记录，是评审回执，不是审查者修复产品后自审。按本次明确授权不重复运行未变产品；引用上文绑定6f596ae的完整独立执行结果。文档复核执行精确diff、历史保真、SHA/证据映射、相对链接检查、公开内容检查及 `git diff --check`。

| 项目 | 最终状态 | 关闭依据 |
| --- | --- | --- |
| EL-IR-001 / SEARCH-04 | PASS / CLOSED | 6f596ae实际独立搜索复验及回归；b027759产品等价 |
| EL-IR-002 / DEMO-05 | PASS / CLOSED | 6f596ae混合输入、参数、恢复与清理复验；b027759产品等价 |
| EL-IR-003 / A11Y-03（所测范围） | PASS / CLOSED | 两套实际字形采样最低4.912/5.069:1及交互回归；b027759产品等价 |
| EL-IR-004 / GOV-01 | PASS / CLOSED | b027759当前快照、源提交、独立证据和历史保留核验通过；本回执完成状态归档 |

未测真机、中端GPU、其他浏览器、原生屏读器等覆盖限制仍为BLOCKED（验证覆盖，不是虚构产品缺陷）；Stage6及以后仍NOT DUE。原两项P3分组语义建议保持OPTIONAL。当前适用范围无未关闭强制发现；若后续行为、依赖、环境或需求改变，须按REVIEW_POLICY重新确定受影响复验范围。

归档仅修改本报告、PROGRESS的当前状态/评审回执、CHECKLIST的收尾状态/报告链接；不修改REVIEW_POLICY或任何历史记录。没有创建PR、合并或部署，main未改变。最终归档提交SHA由Git提交及交付消息确定，不在自身内容写自引用SHA。
