# 制造业链路闭环跨境 B2B 平台 技术文档（V1.4）
**更新时间**：2026-01-06  
**前端 UI 方案**：✅ Ant Design（开源免费）  
**路由方案**：✅ Next.js App Router（`app/` 目录）  
**后端/数据**：Node.js API + MySQL（Docker）+ Redis（Docker）+ Meilisearch（Docker）  

> 说明：本文档以技术/工程/权限规范为主；业务规则放到 `docs/BUSINESS_RULES.md` 持续更新。

---

## 🚨 GPT 强制执行指令（每次写代码前必须先读并严格遵守）

### A. 前端组件与样式（最高优先级：Ant Design）
1. 页面 UI 组件与交互优先使用 Ant Design（antd）提供的组件。
2. 禁止引入或混用其他 UI 组件库/样式框架（除非在文档新增允许清单并说明原因与许可）。
3. 样式优先用 antd 的布局/Spacing 组件实现，其次用 antd theme token，最后才允许少量 CSS Modules。
4. 自定义 CSS 只允许页面级微调，禁止自建基础组件样式。
5. 主题与全局风格统一由 `ConfigProvider` 管理，禁止硬编码品牌色/字号/圆角。

### B. Next.js 路由与目录（强制：App Router）
1. 强制使用 Next.js App Router（`apps/web/app/`）。
2. 禁止新增 `pages/` 目录（除非迁移兼容并记录）。
3. 多语路由必须用路径前缀：`/{lang}/...`（`[lang]` 动态段）。

### C. 权限与安全（强制）
1. 权限校验必须在服务端强制执行，默认 deny。
2. 所有资源必须按 `company_id` 租户隔离。
3. 敏感字段必须字段级权限控制（无权限不返回或脱敏）。
4. 关键操作必须写 `audit_logs`。
5. AI 只能调用后端工具函数，并同样执行权限与字段过滤。

### D. DB / 迁移（强制）
1. 任何 DB 结构变更必须 migrations 入库，并同步更新 `docs/DB_SCHEMA.md`。

### E. 每次写代码必须遵循的原则（强制）
1. 权限优先：按《权限管理体系与规范》实现角色、数据隔离、操作权限、字段过滤、审计。
2. DRY：避免重复代码，抽公共模块/方法。

### F. API 变更记录（强制）
1. 新增/更新 API 必须同步更新：`docs/API.md` + `docs/CHANGELOG_API.md`。
2. 破坏性变更必须标记 `BREAKING CHANGE` 并写迁移说明。

---

## 目录
- `docs/API.md`：接口定义
- `docs/CHANGELOG_API.md`：接口变更日志（每次变更必写）
- `docs/DB_SCHEMA.md`：数据库结构说明（随 migrations 更新）
- `docs/BUSINESS_RULES.md`：业务规则（可频繁更新）
- `docs/FRONTEND_GUIDE.md`：前端工程约定
- `docs/DEPLOY.md`：部署说明

> 本文档为工程约束的“唯一标准”。任何偏离必须先修文档或修实现。
