# Stage 6 live Preview 独立审查归档

日期：2026-11-19。仓库：Skw03/effect-lexicon。产品源提交：`8df5b37ebfd562c47444f6eba22e10f65bf4aaf5`；归档前分支头：`03f7db4908190706f145776ac33448fe280b54e0`。

来源：协调方转交的只读独立审查终结事实，任务 `6aff3300-d13c-8191-b760-5874d3d480d9`，turn `01a1f4df-437b-7620-af60-f22657aec172`。归档者当前没有该任务终端报告读取接口，依据明确交接事实整理；不冒称本轮重新执行线上审计。此前[精确提交本地复验](rereview-pages-8df5b37.md)及其他历史记录保留。

## 结论与目标

**PASS，仅针对本次独立实测的 Preview 范围；完整 Stage 6 / H2 仍 BLOCKED。** 未报告新增必修产品缺陷，不构成生产发布或CI激活许可。

- 不可变预览：[d7f5ddba.effect-lexicon-preview.pages.dev](https://d7f5ddba.effect-lexicon-preview.pages.dev)。
- 可变分支别名：[stage-6-pages-preview.effect-lexicon-preview.pages.dev](https://stage-6-pages-preview.effect-lexicon-preview.pages.dev)。后续别名可移动，不能替代不可变目标证据。
- 生产主机：[effect-lexicon-preview.pages.dev](https://effect-lexicon-preview.pages.dev)，实测HTTP404、Deployment Not Found。此观察不是dashboard部署清单证明，不据此断言账户中完全没有生产部署。

owner发布三个精确主机allowlist条目后，先前Envoy CONNECT 403未再复现。两预览地址均返回200；27/27可获取文件与该源提交自然构建逐字节一致。完整输出29文件，另两份为Cloudflare配置文件，不冒称它们可通过公开HTTP下载。确定性产物摘要：`69a1cdd09c8a339ced68bb5ac2aa539cf38eff7776867f0e13f04ca5760fb0f1`。

## 独立实跑覆盖

| 项目 | 结果与范围 |
| --- | --- |
| 本地质量门 | typecheck、lint、普通及Pages构建通过；160 Vitest＋69 Node通过 |
| 全站路由与渲染 | 20路由直接访问/刷新、JS-off实文与hydration通过；未知路径真实404 |
| 路由变体 | 58/58，通过并保留query |
| 实际响应头/noindex | 135/135，通过 |
| Stage 6 hosted Chromium子集 | 434/434通过 |
| 代表性smoke | 67/67通过 |
| Discovery hosted子集 | 原断言复跑65/65通过；3个dev-only预算夹具排除，不冒称线上完成68项 |
| 交互覆盖 | 桌面与移动模拟、减少动态、键盘/touch、复制、搜索/筛选、播放、Modal焦点 |
| 反馈链接 | GitHub Issues返回200；未创建issue |

## 异常与实测限制

- Discovery首次完成54项后在打字采样处超时；未改变断言，完整重跑65/65通过。保留首次失败，不将其隐去或外推为已确定根因。
- 自制探针首次223/224，使用过早的同步焦点断言；异步后续检查确认Modal关闭并恢复焦点，1280/375宽度分别16/19 ms。该后续验证解决探针时序问题，不是修改产品后重新判绿。
- Chromium QA上下文为环境代理使用证书例外；curl启用信任验证成功。不能把此组合称为真实设备浏览器TLS认证。
- urllib收到上游403、error code 1010；旧urllib脚本不计为通过。此结果与未复现的Envoy CONNECT 403分开记录。
- Cloudflare注入NEL/Report-To响应头。审计期间未观察到相关外发流量，**不代表这些头或报告机制被禁用**；不将项目CSP等同于服务商关闭网络错误报告。
- 未检查dashboard、真实设备TLS、Safari/Firefox、原生屏读器；未跑live Lighthouse或live axe。历史本地Lighthouse/axe成绩仍只属于[旧本地证据](stage-6-pages-preview.md)，不转记为线上测量。

## 剩余门与归档边界

owner逐条阅读18项及提示词、中文/术语审阅、生产就绪、真实Actions检查、最终品牌/域名/图形/许可与条款、必要明确批准仍未完成。原始F/H2/H6保持不变；不通过完整发布门，不开始Stage7。

本次仅新增本记录、同步PROGRESS及RELEASE的事实状态，不修改运行时、源码、测试、需求或CI配置。仅按授权正常提交推送stage-6-pages-preview；无PR/合并/tag/生产上传或发布。归档提交SHA以Git及交付回执绑定，不作自引用。
