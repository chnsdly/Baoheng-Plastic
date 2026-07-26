# SCSS 目录说明

网站只从 `main.scss` 构建一份全站样式。`public/scss/` 是 Hugo 生成目录，不要直接修改其中的 CSS。

## 去哪里改样式

- `abstracts/`：设计变量和 mixin，不直接对应页面。
- `base/`：重置、全局基础规则和排版。
- `layout/`：全站页头、页脚等框架。
- `components/`：可跨页面复用的按钮、面包屑和表单。
- `pages/home/`：首页各区块；文件名与 `layouts/partials/home/` 基本对应，跨区块共用的标题结构统一放在 `_shared.scss`。
- `pages/products/`：产品列表页和产品详情页。
- `pages/industries/`：行业列表页和行业详情页。
- `pages/resources/`：资源列表页和文章详情页。
- `pages/` 根层：About、Contact、Manufacturing、Selection Support 等独立页面。
- `abstracts/_theme.scss`、`base/_theme.scss`、`components/*-theme.scss`、`layout/*-theme.scss`：已经归位的现行视觉主题层；按职责查找，不再使用独立的 `overrides/` 补丁目录。

## 修改规则

1. 新样式应放到负责该组件或页面的文件中，不要重新建立集中式 `overrides/` 补丁目录。
2. 响应式规则与对应组件放在同一个文件中。
3. 只有确实需要跨越全局样式层叠的首页组件才保留 `*-base` 与 `*-visual` 两个输出段；能保持结果一致时应合并为单一组件 mixin。`_hero.scss` 已合并为 `home-hero`。
4. `main.scss` 只负责导入与输出；顺序决定层叠结果，调整前必须做视觉验证。
5. 模板中的动态 CSS 变量可以保留为内联 `style`，固定样式应放入本目录。
6. 删除选择器前，需要同时检查 Hugo 模板、内容回退分支和 JavaScript 动态类名。

## 当前状态

目录整理、旧补丁清理、主题规则压平和未引用选择器清理均已完成。About、Contact、Manufacturing、Selection Support、Industries、首页、Products 与 Resources 的专用规则位于各自的 `pages/` 目录；产品和资源均按“列表 / 详情”拆分。全局主题规则已归入 `abstracts/`、`base/`、`components/` 与 `layout/`，原 `overrides/direction-one/` 已移除。首页原集中在 `pages/home/_theme.scss` 的规则也已归并到各组件文件，首页不再保留独立主题补丁层。

主题文件中同一选择器、同一响应式条件下已经失效的旧声明已删除，相邻的同内容规则也已合并。为兼容旧浏览器而保留的 `display`、背景回退及厂商前缀声明不属于重复垃圾，不要仅凭属性名相同就删除。

当前 SCSS 类名都应能在模板、内容、脚本动态状态、Sass 内部继承或生成页面中找到引用证据。新增通用工具类时，应同时补充实际使用位置，避免重新积累“定义了但从未使用”的样式。
