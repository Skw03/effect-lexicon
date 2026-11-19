# 动效词典 Effect Lexicon

静态中英双语 UI 效果词典：18 个真实演示、8 类内容、中文/英文搜索与筛选、参数驱动的双语提示词，以及 `/guide` 描述指南。开发候选与逐项实测见 [验收报告](docs/ACCEPTANCE.md)。Stage 0–5 已独立验收；Stage 6 产品候选已提交并推送，独立实测快照为 `6cc71919b6abb6212f2d1357278a6d1dd9380878`；供应商无关候选四项发现已独立 PASS / CLOSED（见[最终报告](docs/reviews/rereview-stage-6-6cc7191.md)），新增 Pages 预览候选待独立复验，完整发布仍 BLOCKED。本仓库没有已激活的生产部署流水线。

## 安装、运行和验证

使用 Vite 6 支持的 Node.js；本候选实测 Node 24.22.1、npm 11.9.0。版本与 lockfile 固定，不运行依赖安装脚本。

```sh
npm ci --ignore-scripts --cache /tmp/effect-npm-cache
npm run dev -- --port 5173
# 另一个终端：
npm run typecheck
npm run lint
npm run test
npm run build
PORT=4173 npm run preview
```

开发访问 `http://127.0.0.1:5173`，生产构建本地预览访问 `http://127.0.0.1:4173`。Vite 使用 esbuild 的可选平台二进制；若缺失，先诊断安装环境，不能擅自开启 lifecycle 脚本。没有运行时外网请求、第三方字体、动画库或后端。`dist/` 不提交。

## 浏览器与审计复跑

已有 Python Playwright 和 `/usr/bin/chromium` 的环境，启动 5173 开发服务后逐个执行：

```sh
python3 scripts/browser_smoke.py
python3 scripts/clipboard_regression.py
python3 scripts/discovery_regression.py
python3 scripts/stage3_regression.py
python3 scripts/magnetic_boundary_regression.py
python3 scripts/stage4_regression.py
python3 scripts/stage5_regression.py
python3 scripts/stage5_add_effect_dryrun.py
```

脚本不下载工具。实际 Chromium 覆盖鼠标、真实 Tab/键盘、CDP 触摸模拟、组合输入、复制、参数、减少动态、离屏、预算与布局；不能替代物理手机、Safari/Firefox 或屏幕阅读器。结果写入 `/tmp`。旧脚本使用开发模块构造隔离夹具，所以保留 5173 开发服务；Stage 5 可通过 `STAGE5_BASE` 改为构建预览地址。

以下保留Stage 5 accessibility审计复跑命令；Stage 6完整四类别门须使用文末链接的发布手册和Lighthouse runner。真实审计工具独立于产品依赖，固定安装在仓库外，安装期间禁用脚本：

```sh
mkdir -p /tmp/effect-stage5-audit
npm install --prefix /tmp/effect-stage5-audit --ignore-scripts --save-exact --cache /tmp/effect-npm-cache lighthouse@12.8.2 axe-core@4.10.3
# 先 npm run build，再启动 PORT=4173 npm run preview
python3 scripts/stage5_audit.py
CHROME_PATH=/usr/bin/chromium node /tmp/effect-stage5-audit/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/ --only-categories=accessibility --disable-full-page-screenshot --chrome-flags='--headless --no-sandbox' --output=json --output-path=/tmp/effect-stage5-audit/reports/lighthouse-library.json
CHROME_PATH=/usr/bin/chromium node /tmp/effect-stage5-audit/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/effects/card-tilt-3d --only-categories=accessibility --disable-full-page-screenshot --chrome-flags='--headless --no-sandbox' --output=json --output-path=/tmp/effect-stage5-audit/reports/lighthouse-tilt.json
```

`--no-sandbox` 仅用于本指定容器的审计浏览器，不是站点配置。axe 跑首页、全部 18 详情、指南及打开的模态，包含额外开启的 label-content-name-mismatch 实验规则；原始 JSON 留在 `/tmp/effect-stage5-audit/reports`。工具失败时应报告失败，不能用自制分数代替。

## 静态宿主的一般流程和限制

构建生成 `dist/`，可由静态 HTTP 服务提供，无后端或运行时外部服务；“离线”指构建后在本地 HTTP 服务使用，不承诺首次断网打开或 `file://` 可用。没有 Service Worker。

当前 `npm run preview` 使用本地静态服务器提供20个预渲染路由、CSP/缓存头和真实404；已知路径别名308跳转到canonical路径，未知路径不使用Gallery回退。未来宿主必须实现并验证同一合同；本地模拟不证明实际托管配置、HTTPS或回滚已完成。

当前构建含JS关闭时可读的正文，客户端hydrate恢复交互；metadata、sitemap/robots、偏好初始化和demo边界已实现。无origin时刻意noindex/无canonical；明确配置后生成对应URL。CI模板未激活，provider配置、外部预览、Actions、DNS/HTTPS/回滚实证及owner输入仍BLOCKED。历史Stage5清单保留在验收报告，不能当作当前实现状态或生产放行。

## 经授权增加效果的五步维护流程

Stage 5 正式内容固定为 18 项。第 19 项仅在仓库外临时副本干跑；实际新增内容须获后续阶段授权。

1. **内容**：建立 `src/content/effects/<slug>.ts` 完整 `Effect`，在 `src/content/index.ts` 导入并加入数组。唯一 kebab-case slug/id、双语名称/别名、每语言 3–6 条自然搜索句、全部说明/用途/术语、2–5 个有意义的参数、真实已发布 related。不能通过填充空文字或指向计划条目过校验。
2. **演示**：在 `src/demos/` 建真实 React 组件和相邻 CSS，遵守 `DemoProps`、compact/paused/running、键盘与触屏、触屏竖向滚动、默认 reduced-motion 静止与有限手动播放。缓存几何，清理监听、observer、timer、rAF；动画只 transform/opacity，必要例外须先按规范确认并记录。
3. **注册**：在 `src/demos/registry.ts` 导入和注册 component，使内容与实际实现一致；路由、参数、提示词与图库由注册内容自动生成，无需新增路由或页面条件分支。
4. **检索及门槛**：为新内容加准确检索断言，必要时扩充 `src/search/synonyms.ts`；在获准的内容阶段把 content 精确清单及浏览器脚本的精确数量/有序集合/分类结果更新到新目录，同时保留全部原目标、双目标和行为断言。不得删测或放宽 top-three、预算、可访问性规则。添加新演示交互/参数/reduced-motion 浏览器断言。
5. **验证及人工审阅**：跑上述四质量门、全部浏览器脚本、axe/Lighthouse；确认新项详情/预览/参数两语言/剪贴板/关联、320/375/768/1280 布局与键盘/触屏。读完全部新内容和提示词，更新 PROGRESS，并完成独立审阅后按授权交付；未经许可不发布。

提示词使用 `{{key}}`、`{{#booleanKey}}…{{/booleanKey}}`、`{{^booleanKey}}…{{/booleanKey}}`；数值单位只出现一次。写明作用对象、触发、可见变化、建议数值/真实运动信息、实现约束，结尾含 reduced-motion、键盘、触屏兜底。静态样式明确无触发/无动画，不编造时长。名称可能不唯一时说清边界，不冒称官方术语或未经验证的性能/兼容性。参数默认值按 number/boolean/select 分别校验，全部模板引用（含条件内）必须为已声明键。

先读 `AGENTS.md`、`docs/SPEC.md`、`docs/ROADMAP.md`、`docs/PROGRESS.md`；`docs/REQUIREMENTS_SOURCE.md` 原文保留。当前仅获准 Cloudflare Pages 预览产物的本地准备与候选验证；本轮保持未提交，不推送或部署，新增候选待独立复验。后续动作仍按协调方明确指令，生产另由owner放行；Stage 7未授权。

## Stage 6 release candidate (not deployed)

Cloudflare Pages preview-only preparation is now authorized; account registered, project/preview target pending. `npm run build:pages-preview` emits flat HTML plus `_headers`/`_redirects`, noindex and the approved GitHub Issues feedback link. It does not deploy. Use the [Pages runbook](docs/RELEASE.md) and [uncompleted human review checklist](docs/HUMAN_REVIEW.md). The new provider candidate remains uncommitted and awaits independent review; the prior provider-independent report remains historical evidence.

`npm run build` now prerenders Gallery, Guide and all 18 published details; `npm run preview` serves `dist` locally with CSP/cache headers and true 404. No runtime backend or new product dependency. Default builds deliberately omit a production canonical origin and are noindex. Use only explicit approved site configuration for a public target; never publish a loopback-test build.

See [release runbook](docs/RELEASE.md) for build variables, owner inputs, local verification, inert CI template, security rationale and release/rollback gates. [Stage 6 browser checks](scripts/stage6_regression.py) test the built site; [Lighthouse runner](scripts/lighthouse.mjs) enforces all four H2 thresholds on two pages using a pinned external test-tool installation. Historical dev-only discovery fixtures still require `npm run dev`.

Stage 6 development is authorized, but external preview/host integration, Actions activation, production and tags remain held. No Stage 7 work is included.
