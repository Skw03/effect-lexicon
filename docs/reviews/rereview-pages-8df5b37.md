# Cloudflare Pages preview-only 精确提交独立复验

日期：2026-11-19。仓库：Skw03/effect-lexicon。Git源分支 `stage-6-pages-preview`，受审 SHA `8df5b37ebfd562c47444f6eba22e10f65bf4aaf5`；基底 `stage-6-launch` 为 `edf14444c3ebfdf2bda284116897881c1552e60c`；main 为 `0dba59fb0a833d40f8e54da430f199c6ebe58dbc`。远端已核对；隔离 detached checkout，原工作树保留。独立审查员未实现本候选；产品复验阶段未修改跟踪文件或提交推送；后续仅获准归档本报告及PROGRESS状态/链接。不登录、不创建项目、不上传Cloudflare或部署。

## Verdict

**PASS — 此精确提交的本地 Pages preview-only 准备范围通过。** 没有确认新的必需产品缺陷，不要求先作产品修复。**真实 Preview、CI 和完整 Stage 6 / H2 仍 BLOCKED**；该结论不授予账号、上传、生产或 Stage7 操作权限。

读取 AGENTS、REVIEW_POLICY、ROADMAP、当前及历史 PROGRESS、RELEASE、HUMAN_REVIEW、Pages 初审摘要与原始 H2。Cloudflare/Issues 选择和账户注册按用户输入；没有自行探测账户或替用户补定域名、品牌素材、法律条款。原始 H2 人工及发布门保留。

## 版本与初审交叉验证

与 edf1444 相差17路径：Pages构建适配、404水合标记、测试和文档；没有锁文件/依赖、schema、内容、demo或CSS变化。初审记录称16路径补丁，保存时另增审查摘要及PROGRESS记录。未取得原始完整补丁，故不声明亲自核对其47735字节/SHA-256；本轮直接审查并执行已推送的8df提交。

本轮从该提交独立构建 Pages 输出29文件，按RELEASE算法所得 SHA-256 为 `69a1cdd09c8a339ced68bb5ac2aa539cf38eff7776867f0e13f04ca5760fb0f1`，与初审产物完全一致。它证明本轮输出与所记产物摘要一致，不替代真实托管部署ID/不可变URL和上传绑定。

## 本轮实际检查

| 项目 | 状态 / 实际证据 |
| --- | --- |
| 四质量门 | PASS：typecheck、lint、test、普通build均exit0；160 Vitest＋69 Node，0 skip/todo。安装使用锁文件及ignore-scripts |
| Pages build | PASS，flat guide.html及18个effect HTML、根index/404，20内容路由；没有目录effect/index.html混用 |
| 配置专项完整构建 | PASS，`pages_config_build_check.py` 4用例，env拒绝与显式空origin覆盖；Node专项另含preview配置与规则防御断言 |
| Pages真实本地HTTP/浏览器 | PASS，`pages_preview_check.py` 778项；全部20路由，18详情真实JS-off提示词；URL尾斜线/index.html/.html/query、404与Back/刷新、水合、反馈链接、缓存/robots/sitemap |
| Release浏览器 | PASS，`stage6_regression.py` 440项；EN/ZH × normal/reduced，全路由及详情，动态参数、CSP和头；Pages物理404页状态与便携宿主的差别按实际规则处理 |
| 独立补充真实浏览器 | PASS，4种偏好组合；index.html上query＋style筛选、详情真实改参数/语言/刷新/Back、GitHub Issues链接、三个无害未知/大小写路径的HTTP404→首页→Back→刷新、Modal开启/Esc；无pageerror、无运行时外部请求 |
| axe-core | PASS，21状态含打开Modal，全部violations为空 |
| 便携构建路径回归 | PASS，1167项HTTP/JS-on/off路径检查，20规范路由及别名；独立显式loopback origin构建与本地静态服务 |
| 静态配置与输出 | PASS，39条已知路径跳转，无SPA wildcard、Functions或Worker；安全头/noindex、cache覆盖；空sitemap、robots disallow；20页面均有批准Issues目标，无伪造canonical/素材 |
| 授权与泄漏检查 | PASS于仓库可见范围：无活动.github/workflows、部署脚本或自动生产入口；输出未见env、source map、工作区路径或凭证变量泄漏；不声称审计了外部后台 |
| HUMAN_REVIEW | PASS于清单真实性：18项均未勾选，保留owner/中文/术语/提示词的人工终审；不是人工审阅已完成 |

工具：Node24.22.1、npm11.9.0、Python3.12.14、Playwright1.62.0、Chromium156.0.8078.79、Wrangler4.45.0、axe4.10.3。Wrangler仅在仓库外固定安装，ignore-scripts，关闭metrics；运行pages dev及project create --help，未执行login/create/deploy。所有浏览器行为是本地真实Chromium＋Wrangler模拟资产服务，不是真实Cloudflare CDN。

异常透明记录：Wrangler获取通用Request.cf模拟元数据失败两次后使用默认值，服务正常启动；不把该降级隐瞒为真实edge环境。独立补充探针首次误用按钮文案“打开弹窗”而实际为“打开对话框”，定位超时；仅修正仓库外探针后四组合完整通过，原日志保留。未改产品、断言要求或隐藏产品错误。

本轮未重跑七套全部旧交互回归、Lighthouse、密集Shimmer像素采样和第19项维护干跑。产品已有独立基线与本候选初审包含那些记录，但不冒称为本轮实测。初审中Discovery时序失败后复跑通过、根因未明的记录仍保留；本轮不宣称已经解释或消除了该历史不确定性。针对本次共享路由/metadata/水合变更实际执行了上述受影响全路由回归。实体触屏、Safari/Firefox、原生屏读器未测。

## 首次接入与默认分支核验

RELEASE:29明确使用 `wrangler pages project create <owner-chosen-preview-project> --production-branch=main`，只创建空项目、不传资产，独立于部署。手册同时禁止首次dashboard Create/Save and Deploy、GitHub安装和域名绑定，要求目标核验后再另行批准预览上传。满足本轮最小安全交接要求。

已阅读[官方Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)及[Pages CLI命令](https://developers.cloudflare.com/workers/wrangler/commands/pages/#pages-project-create)：空项目创建与资产部署分离，创建参数可明确production branch。另直接查看实际固定Wrangler4.45.0的CLI实现及help：未传production-branch时交互提示可能用当前Git分支作为默认；明确传main会跳过此推断。因此照本手册命令执行没有该默认值隐患；不要删去该参数。没有通过实际账号API验证创建。

**最短用户步骤（由SUN明确授权空项目创建后，在用户自己的设备执行）：**

1. 在已安装Node及Wrangler的本地终端运行 `wrangler login`，在官方浏览器流程自行认证，不把密码、token或登录输出中的秘密发给助手。
2. 自选独立预览项目名，运行 `wrangler pages project create <项目名> --production-branch=main`。尖括号占位符须替换，命令不包含dist、不上传任何资产。
3. 在 Workers & Pages 中打开该项目，确认Direct Upload、生产分支main、Deployments为空、无Git集成/自定义域名；只回传项目名和这些确认。若界面要求首次上传，停在上传前。此时不执行任何deploy命令。

这些是后续用户操作说明，本审查没有执行。若本地没有Wrangler，先按官方安装指引完成工具准备，不通过GitHub集成向导来替代空项目创建。

之后仍须另行确认预览目标并批准上传。必须显式指定project与非生产branch，并将8df完整SHA/干净checkout/准确产物摘要绑定到Preview环境、deployment ID和不可变hash URL；验证没有新增生产部署。分支alias是可移动标识，不足以作精确验收。Direct Upload项目不提供原生Git自动部署，若未来需要该能力另建Git集成项目且需授权。依据[官方preview文档](https://developers.cloudflare.com/pages/configuration/preview-deployments/)，默认公开且noindex不等于访问控制；若需要Access须另行配置验证。

## 文档交接澄清（非阻断缺陷）

- **OBS-PAGES-001**：RELEASE:39仍含“For this candidate (still uncommitted)”。本提交PROGRESS:5明确逐名列出README/RELEASE/REVIEW_POLICY的冻结措辞并取代它们；初审摘要:13同样明确历史属性。故此处已被清楚supersede，与上次004没有状态替代说明的情况不同，不重复登记必需FAIL。建议下一次文档维护把这句话就地改为历史候选条件，减少用户单独阅读手册时的误会；当前交接必须使用本报告8df完整SHA，而非patch或基底SHA。
- **OBS-PAGES-002**：手册中的 `stage-6-launch` 是拟用Cloudflare deployment branch label，**不是**本次Git源分支。源始终为 `stage-6-pages-preview` 的8df精确提交；不能checkout旧stage-6-launch后构建。未来可选更明确的Cloudflare标签如 `review-8df5b37`，但这只是建议，未更改实际设置。该标签必须与后续实际核实为 `main` 的production branch不同；显式`--branch`不替代产物SHA核验。

## 未完成门及下一步

真实Pages项目/生产分支/空部署清单与无Git集成尚未核实；Preview上传、不可变URL、实际HTTPS/CDN路由/headers/cache/CSP/404/query/水合/noindex/Access、production部署未变化、Actions执行均BLOCKED。最终站名/域名、分享图/favicon权利、代码许可/内容条款、中文/术语审阅及owner18项终审、生产烟测/回滚与发布仍BLOCKED。Stage7 NOT DUE。

本地候选可由SUN按以上最短路径交接空项目创建；本PASS不是上传授权或完整H2验收。无必需修复单。两条措辞澄清为非阻断观察，不擅自升格新需求。本报告由原独立审查草稿安全归档；只发布证据摘要，不附原始日志、机器路径、凭证或可利用细节。用户正在准备空项目，不声明创建或目标核验已完成。

产品复验结束及归档开始时复核：远端main、stage-6-launch及stage-6-pages-preview仍为上列三个完整SHA；原工作树干净，git diff --check通过。归档提交的完整SHA以Git及交付回执标识，不自引用。

## 归档范围与未来产物绑定

本次只新增此报告并更新PROGRESS状态/链接；没有技术文件、资产、发布配置或测试变化，不重复运行未变产品的四门/浏览器。本地PASS仍绑定产品提交 `8df5b37ebfd562c47444f6eba22e10f65bf4aaf5`。后续获准的实际upload必须使用该SHA的相同技术产物，记录并比对上列29文件摘要；不要把文档归档SHA、Cloudflare branch label或旧stage-6-launch头误当成不同产品构建依据。若构建输入或技术产物发生变化，需重新评估、复验后再上传。
