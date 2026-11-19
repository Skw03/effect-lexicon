# 动效词典 Effect Lexicon

静态中英双语 UI 效果词典：18 个真实演示、8 类内容、中文/英文搜索与筛选、参数驱动的双语提示词，以及 `/guide` 描述指南。开发候选与逐项实测见 [验收报告](docs/ACCEPTANCE.md)。Stage 5 等待独立 H6；本仓库当前没有生产部署流水线。

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
npm run preview -- --port 4173
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

真实审计工具独立于产品依赖，固定安装在仓库外，安装期间禁用脚本：

```sh
mkdir -p /tmp/effect-stage5-audit
npm install --prefix /tmp/effect-stage5-audit --ignore-scripts --save-exact --cache /tmp/effect-npm-cache lighthouse@12.8.2 axe-core@4.10.3
# 先 npm run build，再启动 npm run preview -- --port 4173
python3 scripts/stage5_audit.py
CHROME_PATH=/usr/bin/chromium node /tmp/effect-stage5-audit/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/ --only-categories=accessibility --disable-full-page-screenshot --chrome-flags='--headless --no-sandbox' --output=json --output-path=/tmp/effect-stage5-audit/reports/lighthouse-library.json
CHROME_PATH=/usr/bin/chromium node /tmp/effect-stage5-audit/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/effects/card-tilt-3d --only-categories=accessibility --disable-full-page-screenshot --chrome-flags='--headless --no-sandbox' --output=json --output-path=/tmp/effect-stage5-audit/reports/lighthouse-tilt.json
```

`--no-sandbox` 仅用于本指定容器的审计浏览器，不是站点配置。axe 跑首页、全部 18 详情、指南及打开的模态，包含额外开启的 label-content-name-mismatch 实验规则；原始 JSON 留在 `/tmp/effect-stage5-audit/reports`。工具失败时应报告失败，不能用自制分数代替。

## 静态宿主的一般流程和限制

构建生成 `dist/`，可由静态 HTTP 服务提供，无后端或运行时外部服务；“离线”指构建后在本地 HTTP 服务使用，不承诺首次断网打开或 `file://` 可用。没有 Service Worker。

未来获准发布时：选择宿主及基础路径，运行完整检查并构建；将 `dist/` 作为静态文件根目录，设置资源 MIME/缓存策略；为 `/effects/:slug`、`/guide` 配置相应预渲染文件或 SPA 回退；在独立预览地址验证直接打开、刷新、未知路由、资源路径与回滚，再经人类单独明确生产放行后发布。当前 Vite preview 的回退不能证明任意生产宿主都配置正确。SPA 回退的未知 URL 可能返回 HTTP 200；Stage 6 要处理真正的 404。

当前仍为客户端 SPA，关闭 JavaScript 时详情没有真实正文。Stage 6 的预渲染、metadata、sitemap/robots、主机重写、CI/部署/DNS/回滚均未实现。尤其要处理 render 期间读 `window.matchMedia`、外部 store 的 server snapshot 与语言/减少动态 hydration 一致性；详见验收报告的待执行清单。不能把合并直接绑定为无意的生产发布。

## 经授权增加效果的五步维护流程

Stage 5 正式内容固定为 18 项。第 19 项仅在仓库外临时副本干跑；实际新增内容须获后续阶段授权。

1. **内容**：建立 `src/content/effects/<slug>.ts` 完整 `Effect`，在 `src/content/index.ts` 导入并加入数组。唯一 kebab-case slug/id、双语名称/别名、每语言 3–6 条自然搜索句、全部说明/用途/术语、2–5 个有意义的参数、真实已发布 related。不能通过填充空文字或指向计划条目过校验。
2. **演示**：在 `src/demos/` 建真实 React 组件和相邻 CSS，遵守 `DemoProps`、compact/paused/running、键盘与触屏、触屏竖向滚动、默认 reduced-motion 静止与有限手动播放。缓存几何，清理监听、observer、timer、rAF；动画只 transform/opacity，必要例外须先按规范确认并记录。
3. **注册**：在 `src/demos/registry.ts` 导入和注册 component，使内容与实际实现一致；路由、参数、提示词与图库由注册内容自动生成，无需新增路由或页面条件分支。
4. **检索及门槛**：为新内容加准确检索断言，必要时扩充 `src/search/synonyms.ts`；在获准的内容阶段把 content 精确清单及浏览器脚本的精确数量/有序集合/分类结果更新到新目录，同时保留全部原目标、双目标和行为断言。不得删测或放宽 top-three、预算、可访问性规则。添加新演示交互/参数/reduced-motion 浏览器断言。
5. **验证及人工审阅**：跑上述四质量门、全部浏览器脚本、axe/Lighthouse；确认新项详情/预览/参数两语言/剪贴板/关联、320/375/768/1280 布局与键盘/触屏。读完全部新内容和提示词，更新 PROGRESS，并完成独立审阅后按授权交付；未经许可不发布。

提示词使用 `{{key}}`、`{{#booleanKey}}…{{/booleanKey}}`、`{{^booleanKey}}…{{/booleanKey}}`；数值单位只出现一次。写明作用对象、触发、可见变化、建议数值/真实运动信息、实现约束，结尾含 reduced-motion、键盘、触屏兜底。静态样式明确无触发/无动画，不编造时长。名称可能不唯一时说清边界，不冒称官方术语或未经验证的性能/兼容性。参数默认值按 number/boolean/select 分别校验，全部模板引用（含条件内）必须为已声明键。

先读 `AGENTS.md`、`docs/SPEC.md`、`docs/ROADMAP.md`、`docs/PROGRESS.md`；`docs/REQUIREMENTS_SOURCE.md` 原文保留。当前工作停在 Stage 5 未提交待审候选，提交推送需协调方独立 H6 后明确指令；Stage 6 需新的授权及单独生产放行。
