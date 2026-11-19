# Stage 6 供应商无关本地候选 — 独立审查归档摘要

日期：2026-11-19。仓库：Skw03/effect-lexicon；分支：stage-6-launch。

## 提交后独立复验补记（2026-11-19）

以下初审与候选复验记录保留为当时状态。协调方转交独立审查专家对产品提交 `6cc71919b6abb6212f2d1357278a6d1dd9380878` 的精确复验：S6-IR-001/002/003 PASS / CLOSED；004因README与REVIEW_POLICY仍称“未提交”而保持OPEN。本轮仅修正文档，新的文档提交SHA须由后续独立结果绑定；本补记不提前关闭004。

该产品提交独立实跑：160 Vitest＋62 Node、既有Chromium1169、路径1167、release441；axe21状态无违规。mobile Lighthouse首页91/100/100/100、Tilt93/100/100/100（performance/accessibility/best-practices/SEO）。这些结果不替代真实托管、Actions或生产验证。完整Stage 6 / H2仍BLOCKED；托管/域名、素材/条款、人工18词条终审、真实外部预览/Actions与生产验证均待完成。

## 受审版本与独立性

基底：`0dba59fb0a833d40f8e54da430f199c6ebe58dbc`。

初审候选：35路径、74446字节，完整补丁SHA-256 `a8d5fe13efcbdc1e61a06e84013cfab544285d7b7d70479f3a6890aa0a352fa1`。初审结论为 CHANGES REQUIRED，发现三项P2、一项P3。

修正版受审候选：43路径、109154字节，完整补丁SHA-256 `f238b8fb9820304023316582c1d2b60416cabcc6dfe544162d045f111c7e540c`。

同一原生独立审查员未参与实现或修复，未继承实现会话，在干净隔离副本核验精确基底、补丁及逐文件字节，阅读规范与前次报告，并自行运行代码、浏览器和审计工具。下文整理其两次原始结论，不由实施者重新签发独立PASS；原失败记录仍保留。

## 结论与四项状态

**修正版供应商无关本地候选的适用技术范围 PASS；完整 Stage 6 / H2 发布仍 BLOCKED。** 未发现新增必需产品缺陷。候选通过不授权部署、集成激活或合并。

| 发现 | 严重性 | 修复与独立核查摘要 | 生命周期状态 |
| --- | --- | --- | --- |
| S6-IR-001 | P2 | 有效配置统一解析、校验与冻结；环境文件、mode、进程优先级及实际客户端/服务端输出一致性通过 | OPEN：候选复验PASS，待精确提交复验 |
| S6-IR-002 | P2 | production origin类别校验与正常配置行为通过；本地审计模式保留，域名归属与owner批准不由校验代替 | OPEN：候选复验PASS，待精确提交复验 |
| S6-IR-003 | P2 | 宿主、SSR、客户端与metadata共享路径政策；canonical跳转、真实404、query/history/direct/refresh及hydration一致性通过 | OPEN：候选复验PASS，待精确提交复验 |
| S6-IR-004 | P3 | README当前状态与本地静态工作流已同步，历史验收与完整发布阻塞保留 | OPEN：候选复验PASS，待精确提交复验 |

按 [REVIEW_POLICY](../REVIEW_POLICY.md)，关闭发现必须有提交后的独立复验。因此本摘要不写CLOSED，不用补丁身份冒充提交SHA。后续Independent Review Expert须核对精确提交与受审候选等价，复验四项原因、边界及受影响回归，再决定关闭资格。

## 修正版独立实跑结果

| 验证 | 结果 |
| --- | --- |
| 锁文件安装、typecheck、lint、test、build | 全部通过；160 Vitest＋62 Node，0 skip/todo |
| 完整构建配置验证 | 20个提供用例＋10个独立设计用例通过；使用无害负例与本地测试数据 |
| 路径、路由与偏好 | 路径1167、Stage6检查441、prepaint20、boundary3通过；另有独立真实链接、query/history/back、direct/refresh验证 |
| 七套继承浏览器回归 | smoke67、clipboard8、discovery68、Stage3 142、magnetic107、Stage4 259、Stage5 518，合计1169/1169 |
| 已有搜索与Modal修复回归 | 23/23、88/88 |
| axe-core 4.10.3 | 21状态，全部violations为空，含打开Modal |
| Lighthouse 12.8.2，mobile | Library 91/100/100/100；Tilt 92/100/100/100；顺序为performance/accessibility/best-practices/SEO，均满足85/95/95/95 |
| 可维护性与确定性 | 第19项仅隔离干跑通过，正式仍18项；重复构建27文件逐字节一致 |

运行工具为Node24.22.1、npm11.9.0、Python3.12.14、Playwright1.62.0、Chromium156.0.8078.79、Vite6.3.5、Vitest3.2.4。浏览器功能与实际响应头在本地production-mode静态输出上验证；开发专用夹具另用开发服务。Lighthouse在重负载功能套件结束后单独运行，没有降低类别或分数门槛。以上不是GitHub Actions、hosted preview或真实生产结果。

修正版复验明确未重跑两项：密集Shimmer像素采样，以及前次额外6项真实demo故障注入。审查员核对相关源码字节不变，Shimmer生成CSS亦相同；本轮已重跑常规运动/布局、axe、3项错误边界和全路由交互。前次独立证据为Shimmer24场景/376帧、最低4.911546657:1，以及6项故障隔离通过；这些是继承证据，不是修正版轮次的新测量。

原始检查日志与报告由审查流程保留；本公开摘要不包含本地路径、原始日志、凭证、个人资料或可利用的操作细节。

## 完整发布仍未满足的门

- owner尚未确定并验证宿主、账号/project/access和非生产预览目标；provider配置、真实hosted preview、Actions、DNS/HTTPS、回滚与生产烟测未完成。
- 最终站名/域名与权利检查、批准的分享图/favicon、代码许可、内容条款及反馈输入仍待owner。
- 中文和术语人工审阅、owner亲读全部18项及提示词、Search Console、精确提交独立复验和单独生产放行仍待完成。
- 实际设备、其他浏览器、原生屏读器和中端设备性能等覆盖限制保留，自动检查不是完整认证。

惰性CI模板仍只在文档目录，未激活workflow或生产集成；宿主preview若要求noindex须保留。生产indexability属于真实发布烟测。没有RC/正式tag或生产发布；Stage7未授权。

## 本次保存边界

协调方明确授权将已审候选和本安全摘要提交并正常推送至同仓stage-6-launch，供长期Independent Review Expert核验精确SHA。仅本摘要和必要进度链接为受审候选之外的追加；代码、测试与候选配置保持受审字节。

仓库可见检查未见可执行workflow、托管发布配置、活动Git hook或该分支的明显生产触发；文档目录仅含无部署任务的惰性检查模板。额外远端集成只读查询未能获得结果，不据此保证外部后台已全面审计。本次不创建PR、打tag、部署、激活Actions或集成，不改变账号/DNS/权限，也不进入Stage7。
