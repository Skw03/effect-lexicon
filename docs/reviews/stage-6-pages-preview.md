# Cloudflare Pages preview-only 候选独立审查归档

日期：2026-11-19。仓库：Skw03/effect-lexicon。保存分支：`stage-6-pages-preview`。

## 版本与结论

受审基底：`edf14444c3ebfdf2bda284116897881c1552e60c`（stage-6-launch）；main为 `0dba59fb0a833d40f8e54da430f199c6ebe58dbc`。精确候选：16路径、47735字节，补丁SHA-256 `1652c6b3e9d80cadd313f855724df37cb0ac95f3f00f6590db20244df0762eea`。

独立原生审查员未参与实现、未继承开发会话，在隔离检出核对远端及补丁身份，阅读规范、原始F/H2/H6和官方Cloudflare文档后自行实跑。原始报告SHA-256为 `1b20f421db14ba2c058880965cee294d1e07c3b6a85362f58f22094c6feabd11`；本文件为安全归档摘要，不发布原始日志、机器路径、个人资料或凭证。

**独立结论：本地Cloudflare Pages preview-only准备候选 PASS；完整Stage 6 / H2仍 BLOCKED。未确认新的必需产品缺陷。** 这是本地适用范围结论，不是外部托管通过或发布许可。

本轮获准保存受审候选，仅另增本报告及PROGRESS保存记录。技术文件保持受审字节；精确提交SHA由Git和交付回执标识，后续独立提交核验绑定该SHA。受审文档中的“未提交/待独立审查”是候选冻结时的历史状态；本保存记录与PROGRESS当前段落取代这些状态描述，不改写旧证据。

## 独立实跑

工具：Node24.22.1、npm11.9.0、Python3.12.14、Chromium156.0.8078.79、Wrangler4.45.0、axe4.10.3、Lighthouse12.8.2。工具不成为产品新增依赖。

| 检查 | 结果 |
| --- | --- |
| typecheck / lint / test / build，另Pages构建 | PASS；160 Vitest＋69 Node，0 skip/todo |
| Pages专项 / release / 独立路径场景 | 778 / 440 / 23，通过 |
| 原配置完整构建 / preview配置完整构建 / 独立配置边界 | 20 / 4 / 11，通过 |
| 便携HTML / 路径 / release / prepaint | 20 / 1167 / 441 / 20，通过 |
| 旧Chromium七套 | smoke67、clipboard8、discovery68、Stage3 142、magnetic107、Stage4 259、Stage5 518；最终1169通过 |
| 搜索 / Modal / demo错误边界 | 23 / 88 / 3，通过 |
| axe | 21状态，全部零违规 |
| mobile Lighthouse 首页 | 91 / 100 / 100 / 100 |
| mobile Lighthouse Tilt | 93 / 100 / 100 / 100 |

Lighthouse顺序为performance/accessibility/best-practices/SEO，门槛85/95/95/95。审查员在功能套件结束后单独实跑，两页exit0。使用便携production-mode静态构建的loopback测试origin；未移除Pages预览noindex来追求SEO分数。

Pages本地验证包含20公开路由、18详情真实JS-off内容、EN/ZH与普通/减少动态的水合及刷新，bare/trailing slash/index.html/.html及查询参数，真实404、动态内联样式CSP、实际安全头及缓存。另独立验证尖锐路径和客户端未知详情路由；服务器404标记保留水合和Back状态。物理404页面本身可由Pages返回200，未知URL仍真实404；编码/重复斜线的原生行为须在实际CDN再验。

独立产物29文件摘要按RELEASE算法为 `69a1cdd09c8a339ced68bb5ac2aa539cf38eff7776867f0e13f04ca5760fb0f1`，与原候选一致。无新依赖、schema、内容、demo或样式变更，无构建产物入库。原始需求、历史报告及惰性CI边界保留。

## 异常、继承与限制

Discovery初次在静态服务运行时遇到开发模块夹具不适用，切换独立dev环境后首次仍有一次播放时序断言失败。根因未确定；相同断言完整复跑68/68通过。原失败保留，不能称已证明是环境原因，也没有确认持久产品回归。审查员另记录一次便携宿主启动目录/端口设置错误及一次开发依赖优化重载中断；纠正测试条件后原断言通过，未弱化测试。

Shimmer密集像素取样和第19项干跑未重跑：相关demo/内容/CSS/注册与添加流程不变，继承产品 `6cc71919b6abb6212f2d1357278a6d1dd9380878` 的[既有独立证据](rereview-stage-6-6cc7191.md)。这些不是本轮新测量。物理设备、其他浏览器及原生屏读器未覆盖。

## 手册核查与剩余门

独立核查[Pages路由](https://developers.cloudflare.com/pages/configuration/serving-pages/)、[headers](https://developers.cloudflare.com/pages/configuration/headers/)、[redirects](https://developers.cloudflare.com/pages/configuration/redirects/)、[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)、[分支控制](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)及[预览规则](https://developers.cloudflare.com/pages/configuration/preview-deployments/)。空项目创建与部署分离，预览分支必须不同于生产分支；默认首次dashboard上传可能发布生产。noindex不等于访问控制，移动branch alias不等于不可变部署URL。

账号已注册但尚无核实的Pages项目。实际hosted routing/query/404/HTTPS/headers/cache/CSP/hydration/noindex/Access、Preview环境及不可变URL/deployment ID、生产部署存在性、精确提交与上传产物绑定、Actions和生产烟测仍BLOCKED。最终名称/域名、分享图/favicon权利、代码许可/内容条款、中文/术语终审及owner亲读18项未完成；[人工清单](../HUMAN_REVIEW.md)保持未勾选。Stage7未授权。

## 保存与人工交接

仓库可见配置未发现可执行workflow或自动生产部署入口，CI仅惰性模板；未登录外部后台，不声称全面审计账户。保存仅正常提交推送新分支，不PR/tag/部署、上传到托管、启用集成或修改DNS/权限。

下一步先由独立审查将保存SHA绑定到受审字节。随后用户在明确接入授权下，于自己的设备认证并建立独立**空Direct Upload项目**，生产分支设main，不上传文件、不连接Git、不添加域名；回传项目名称、生产分支和空部署列表确认即可，不发送密码/令牌。实际预览分支与目标须单独确认，且不同于生产分支。手册中的stage-6-launch名称保留受审时上下文；本次保存源是stage-6-pages-preview的精确已审SHA，不得误用旧分支头的产物。取得目标核验与另行Preview授权后才能上传；届时以不可变URL、Preview环境/deployment ID、产物摘要与已审SHA验收，并核对生产部署未变化。
