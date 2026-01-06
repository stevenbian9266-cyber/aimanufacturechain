# 制造业链路闭环跨境 B2B 平台 技术方案（TECH_PLAN V1.0）
更新时间：2026-01-06  
基于：TECH_SPEC V1.4 + PLATFORM_OVERVIEW V0.2

> 说明：本文件是“技术方案总纲”。工程硬规范见 `docs/TECH_SPEC.md`；平台蓝图见 `docs/PLATFORM_OVERVIEW.md`；
> 业务规则（频繁变化）见 `docs/BUSINESS_RULES.md`。

---

## 🚨 GPT 强制执行指令（每次写代码前必须先读并严格遵守）

### 1) 前端 UI 与样式（最高优先级：Ant Design）
1. UI/交互必须优先使用 Ant Design（antd）组件。
2. 禁止混用其它 UI/CSS 框架（除非在文档登记允许清单）。
3. 样式优先级：antd 布局组件 > antd token（ConfigProvider）> 少量 CSS Modules（仅微调）。
4. 禁止自建基础组件样式（Button/Input/Card 等必须用 antd）。
5. 全局主题必须由 `ConfigProvider` 统一管理。

### 2) Next.js 路由（强制：App Router + 多语）
1. 强制使用 Next.js App Router（`apps/web/app/`），禁止新增 `pages/`。
2. 多语必须走路径前缀：`/{lang}/...`（`[lang]` 动态段）。

### 3) AI 入口策略（强制，来自 PLATFORM_OVERVIEW V0.2）
1. 首页必须有重要且独立的 AI 核心模块（双 CTA：生成 BOM / 已有 BOM 匹配；快速输入 + 示例）。
2. 其它页面必须统一右下角悬浮入口（FloatButton + Drawer/Modal）。
3. 必须支持上下文注入（类目/产品/工厂/搜索的公开字段与筛选条件）。
4. 严格字段级权限：未解锁不得注入联系方式等敏感字段；并写审计。

### 4) 权限与安全（强制）
- 服务端强制 RBAC(ADMIN/BUYER/SUPPLIER) + ABAC(company_id/owner/invite/conversation participant/state)，默认 deny。
- 字段级敏感信息过滤强制；关键操作写 audit_logs。
- AI 只能调用后端工具函数，并同样执行权限过滤。

### 5) 一致性（强制）
- DB 变更必须 migrations 入库并更新 `docs/DB_SCHEMA.md`。
- API 新增/更新必须更新 `docs/API.md` + `docs/CHANGELOG_API.md`（BREAKING CHANGE + 迁移说明）。

---

## 1. 系统模块划分（与工程模块对齐）
- Public Discovery：类目/产品/工厂/搜索/内容（SEO/GEO）
- Identity & Tenant：用户/公司/成员/供应商资料
- Matching Core：BOM/匹配/Lead-RFQ/会话消息
- Governance：审计/审核/风控/字典
- AI Assistant：对话生成 BOM、BOM 匹配产品/工厂、解释/置信度/风险标记（含入口策略）

## 2. 页面架构
- SEO 页（可索引）：`/`、`/c`、`/p`、`/f`、`/guides`
- 搜索页：`/search`（noindex）
- 工作台：Buyer（bom/leads/conversations）、Supplier（inbox/responses/factory profile）、Admin（admin/*）——均 noindex

## 3. URL/SEO/GEO 关键要求
- 可索引：`/{lang}/c`、`/{lang}/p`、`/{lang}/f`
- noindex：`/{lang}/search` 与工作台
- 必须：canonical + hreflang + sitemap
- 详情页必须有结构化摘要块（GEO）

## 4. 搜索
- Meilisearch：索引 products/factories
- DB 写后同步；失败入 Redis 重试队列

## 5. 后端（NestJS）模块建议
- auth / tenant / catalog / factory / search / bom / leads / conversations / ai / governance
- Controller 做 RBAC；Service 做 ABAC；Repo 强制 company scope

## 6. 工程规则
- 变更 DB：migrations + DB_SCHEMA
- 变更 API：API.md + CHANGELOG_API.md（含 BREAKING/迁移）
- 编码原则：权限优先 + DRY（抽公共模块/方法）
