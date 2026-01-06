# mfg-b2b-platform (Monorepo)

This is a starter skeleton for a cross-border manufacturing B2B matching platform.

**Front-end**: Next.js App Router + Ant Design  
**API**: NestJS + Prisma (MySQL)  
**Infra**: MySQL + Redis + Meilisearch via Docker Compose  
**Docs**: `docs/TECH_SPEC.md` is the source of truth.

## Quick start (dev)

### 1) Prerequisites
- Node.js 18+ (recommend 20 LTS)
- npm
- Docker Desktop

### 2) Install
```bash
npm install
```

### 3) Start infra (mysql/redis/meili)
```bash
docker compose -f docker/dev/docker-compose.yml up -d
```

### 4) Configure env
Copy env examples:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 5) Prisma (first time)
When mysql is up, generate the first migration and commit it:
```bash
npm run prisma:generate -w @mfg/api
npm run prisma:migrate -w @mfg/api
```

### 6) Run dev servers
```bash
npm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/health

## Scripts
- `npm dev` - run all dev servers
- `npm lint` - lint all
- `npm typecheck` - typecheck all
- `npm test` - tests all

## Package manager
This repo uses **npm workspaces** (no pnpm).

## Docs
- `docs/TECH_PLAN.md` - Technical plan (source of truth)
- `docs/TECH_SPEC.md` - Engineering hard rules
- `docs/PLATFORM_OVERVIEW.md` - Platform blueprint (AI entry strategy)
- `docs/BUSINESS_RULES.md` - Business rules (frequently changing)

## Auth quick test (dev)
1) Register:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@example.com","password":"password123","role":"BUYER","companyName":"Buyer Co"}'
```

2) Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@example.com","password":"password123"}'
```

3) Me (replace TOKEN):
```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

将以下内容原封不动的存档记忆
# 制造业链路闭环跨境 B2B 平台 技术方案（TECH_PLAN V1.0）

**更新时间**：2026-01-06
**基于**：TECH_SPEC V1.4（工程硬规范） + PLATFORM_OVERVIEW V0.2（平台蓝图：AI 入口策略升级）
**目标**：把“平台方案蓝图（系统/角色/页面/流程）”与“工程硬规范（前后端技术/权限/文档/迁移）”合并成一份**可直接指导 GPT 写代码的技术方案总纲**。

> 说明：业务规则会频繁变动（状态机细则、解锁条件细节、匹配打分细节等）。它们应该沉淀在 `docs/BUSINESS_RULES.md`，TECH_PLAN/TECH_SPEC 保持稳定。

---

## 🚨 GPT 强制执行指令（每次写代码前必须先读并严格遵守）

> 本段是硬规则。GPT 生成的任何代码/页面/组件/样式/权限逻辑/接口变更，如违反任意一条，视为不合格输出，必须重写。

### 1) 前端 UI 与样式（最高优先级：Ant Design）

1. **页面 UI 组件与交互必须优先使用 Ant Design（antd）组件**（Layout、Menu、Grid、Flex、Space、Typography、Card、Form、Input、Select、Table、Pagination、Modal、Drawer、Tabs、Breadcrumb、Result、Empty、Skeleton、Spin、Alert、Message、Notification、FloatButton 等）。
2. **禁止引入或混用其它 UI/CSS 框架或组件库**（除非在本文档新增“允许清单”并说明原因与许可）。
3. **样式优先级**：antd 布局组件（Layout/Space/Flex/Grid） > antd theme token（ConfigProvider） > 少量 CSS Modules（仅页面级微调）。
4. **禁止自建基础组件样式**（Button/Input/Card 等必须用 antd），禁止大面积手写 CSS 取代 antd。
5. **全局主题必须由 `ConfigProvider` 统一管理**，禁止页面硬编码品牌色/字号/圆角造成不一致。

### 2) Next.js 路由与目录（强制：App Router + 多语）

1. **强制使用 Next.js App Router**：页面放在 `apps/web/app/`，使用 `layout.tsx/page.tsx` 等机制。
2. **禁止新增 `pages/`**（除非迁移兼容并在文档记录）。
3. **多语必须走路径前缀**：`/{lang}/...`，在 App Router 用 `[lang]` 实现。

### 3) ✅ AI 入口策略（来自 PLATFORM_OVERVIEW V0.2，强制执行）

1. **首页必须有重要且独立的 AI 核心模块**（高曝光转化）：

   * 双 CTA：**生成 BOM**（无 BOM）/ **已有 BOM 匹配**（有 BOM）
   * 快速输入 + 示例（提升转化）
2. **其它页面必须统一右下角悬浮 AI 入口**（FloatButton + Drawer/Modal），全站一致体验。
3. **悬浮 AI 必须支持上下文注入**：类目/产品/工厂/搜索页的**公开字段与筛选条件**可注入。
4. **上下文注入必须严格遵守字段级权限**：未解锁不得注入联系方式/私密报价/内部备注等敏感字段；并且写审计。

### 4) 权限与安全（强制：RBAC + ABAC + 字段级过滤 + 审计）

1. **服务端强制权限**：默认 deny（前端隐藏按钮不算权限）。
2. **RBAC**：`ADMIN/BUYER/SUPPLIER`；**ABAC**：`company_id/owner/invite/conversation participant/state`。
3. **租户隔离强制**：所有受保护资源查询/更新必须带 `company_id` 作用域。
4. **字段级敏感信息过滤强制**：无权限不得返回或脱敏（尤其联系方式、私密报价、未公开文件、内部备注）。
5. **关键操作必须写 `audit_logs`**（含 AI 调用关键事件/敏感字段解锁）。

### 5) DB / 文档一致性（强制）

1. **任何 DB 结构变更必须 migrations 入库**，并同步更新 `docs/DB_SCHEMA.md`。
2. **每次新增/更新 API 必须记录**：

   * 更新 `docs/API.md`
   * 更新 `docs/CHANGELOG_API.md`（破坏性变更标 `BREAKING CHANGE` + 迁移说明）
3. **通用编码原则**：权限优先 + DRY（避免重复，抽公共模块/方法）。

---

## 1. 文档体系与放置位置（推荐）

放在仓库 `docs/` 下：

* `docs/TECH_PLAN.md`：**技术方案总纲**（本文件，稳定）
* `docs/TECH_SPEC.md`：工程硬规范（可更严格、更细）
* `docs/PLATFORM_OVERVIEW.md`：平台蓝图（系统/角色/页面/流程，允许迭代）
* `docs/BUSINESS_RULES.md`：业务规则（频繁变化：状态机、解锁规则、匹配细则）
* `docs/API.md`：API 文档（每次接口变更必更）
* `docs/CHANGELOG_API.md`：API 变更日志（每次接口变更必更）
* `docs/DB_SCHEMA.md`：DB 结构说明（随 migrations 更新）
* `docs/FRONTEND_GUIDE.md`：前端约定（SEO、i18n、组件复用、AI 入口）
* `docs/DEPLOY.md`：部署/环境变量/迁移流程

---

## 2. 平台系统划分（用于模块拆分与工程边界）

### 2.1 Public Discovery（SEO/获客）

* 三级类目 → 产品列表 → 产品详情
* 工厂目录（代工/组装能力、认证、地区等）
* 关键词搜索（产品/工厂/组装厂）
* 内容系统（guides/FAQ/术语：GEO 友好）

### 2.2 Identity & Tenant（身份与组织）

* 用户系统（注册/登录/语言偏好）
* 公司系统（company）
* 成员系统（company_members：OWNER/MEMBER）
* 供应商资料（工厂资料完善：能力/认证/案例/条款）

### 2.3 Matching Core（撮合核心）

* BOM（版本化、可编辑、关键件）
* BOM 匹配产品/工厂（召回 + 过滤 + 评分解释）
* Lead/RFQ（创建、邀请、响应、对比）
* 会话系统（conversation/messages）

### 2.4 Governance（治理）

* 审计日志（audit_logs）
* 审核/举报/风控
* 字典配置（类目、能力标签、认证、地区等）

### 2.5 AI Assistant（能力系统 + 入口系统）

* 对话澄清 → 生成 BOM（4.1）
* 已有 BOM → 匹配产品/工厂（4.2）
* 首页独立模块 + 全站悬浮入口 + 上下文注入 + 权限与审计

---

## 3. 角色体系与权限模型（工程落地）

### 3.1 RBAC（角色）

* `ADMIN`：平台管理、字典、审核、封禁
* `BUYER`：BOM/Lead/会话等需求侧能力
* `SUPPLIER`：工厂资料、受邀 lead、响应报价、会话沟通

### 3.2 ABAC（关键属性：必须服务端落地）

> ABAC 关键属性 = 用于决定“**这条数据**能否访问/能看到哪些字段”的属性条件。

* `company_id`：租户隔离
* `owner_user_id`：资源所有权（例如 BOM）
* `invite`：Lead_invites 邀请关系（供应商可见性）
* `conversation participant`：会话参与方（buyer_company_id/supplier_company_id）
* `state/status`：状态机控制（例如联系方式解锁、可操作权限）

### 3.3 字段级权限（强制）

* Public：游客可读（去敏）
* Protected：登录 + 关系满足
* Sensitive：联系方式/私密报价/未公开文件等（严格条件解锁；无权限不返回/脱敏）

---

## 4. 页面架构与 URL 规范（SEO/GEO + 多语）

### 4.1 路由前缀含义

* `c` = category（类目）
* `p` = product（产品）
* `f` = factory（工厂）

### 4.2 URL 规范（强制）

* 类目页：`/{lang}/c/{l1Slug}/{l2Slug}/{l3Slug}`
* 产品详情：`/{lang}/p/{productId}-{slug}`
* 工厂详情：`/{lang}/f/{factoryId}-{slug}`
* 搜索页：`/{lang}/search?q=...&type=...`（noindex）
* 工作台：`/{lang}/bom/...`、`/{lang}/leads/...`、`/{lang}/conversations/...`（noindex）
* Admin：`/{lang}/admin/*`（noindex）

### 4.3 SEO 要求（强制）

* SEO 页面必须 SSR/SSG 输出：title/description/H1/结构化摘要
* 必须输出：canonical + hreflang
* sitemap：按语言拆分（index → 各语言 sitemap）
* 搜索页与工作台默认 `noindex,follow`

### 4.4 GEO 友好要求（强制）

* 产品/工厂详情页必须有“结构化摘要块”（要点列表 + 参数表/能力表）
* 指南/术语页使用清晰标题层级与列表

---

## 5. AI 采购助手（入口系统 + 能力系统，V0.2 落地要求）

### 5.1 首页 AI 核心模块（强制）

模块建议（MVP 也必须具备）：

* 双 CTA：

  * “我想做一个产品 → AI 帮我拆 BOM”
  * “我已有 BOM → AI 帮我匹配供应链”
* 快速输入（1 句话需求）
* 示例卡片（3-6 个）
* 引导保存/登录（未登录可试用少量轮次，但保存 BOM/创建 Lead 需登录）

### 5.2 全站悬浮 AI 入口（强制）

* 右下角 `FloatButton`，点击打开 Drawer/Modal（建议 Drawer）
* 全站一致体验（SEO页、搜索页、工作台页）
* 支持“上下文注入”：

  * 类目页：类目路径、代表关键词（公开）
  * 产品页：产品公开字段（名称、类目、参数摘要）
  * 工厂页：工厂公开字段（能力/认证摘要），**不得注入联系方式（未解锁）**
  * 搜索页：q 与 filters（公开）

### 5.3 AI 安全与审计（强制）

* AI 不得直连 DB：只能调用后端工具函数（工具函数做权限与字段过滤）
* 记录 AI 关键事件到审计（建议 action）：

  * `AI_CHAT` / `AI_BOM_DRAFT_GENERATED` / `AI_MATCH_PRODUCTS` / `AI_MATCH_FACTORIES` / `AI_CONTEXT_INJECTED`
* 上下文注入必须通过“可注入字段白名单”过滤

---

## 6. 后端技术架构（NestJS）

### 6.1 模块化建议（与系统划分对齐）

建议模块（按领域拆分，便于 DRY/权限复用）：

* `auth`：登录/令牌/会话
* `tenant`：company/members
* `catalog`：categories/products（Public）
* `factory`：factories/capabilities/certifications
* `search`：meilisearch 代理与过滤
* `bom`：boms/bom_items/bom_versions
* `leads`：leads/invites/responses
* `conversations`：conversations/messages
* `ai`：AI 对话/生成/匹配（仅工具函数调用）
* `governance`：audit/moderation/dictionaries

### 6.2 统一接口规范（强制）

* 成功：`{ ok: true, data: ... }`
* 失败：`{ ok: false, error: { code, message, details? } }`
* 统一错误码与 HTTP 映射（401/403/404/409/429/500）

### 6.3 权限落点（强制）

* Controller/Guard：登录与 RBAC 粗校验
* Service：ABAC 细校验（company/owner/invite/participant/state）
* Repo：必须提供 company scope 查询封装，避免漏过滤

### 6.4 审计（强制）

* 关键动作必须写 `audit_logs`（actor、action、entity、meta、requestId）

---

## 7. 数据与搜索（MySQL + Meilisearch）

### 7.1 DB（MySQL）

* migrations 必须入库（Prisma migrations 推荐）
* DB 说明必须更新 `docs/DB_SCHEMA.md`

### 7.2 搜索（Meilisearch）

* 索引：`products`、`factories`（用 `isAssembly` 区分组装能力）
* 同步机制：

  * DB 写入后同步 Meili
  * 失败写 Redis 重试队列（避免丢索引）

---

## 8. 前端技术架构（Next.js App Router + antd）

### 8.1 目录建议

* `app/[lang]/(seo)/...`：SEO 页
* `app/[lang]/(app)/...`：工作台页（noindex）
* 在 `[lang]/layout.tsx` 里放：

  * `ConfigProvider`（主题/locale）
  * 全站 `AiAssistantLauncher`（悬浮入口）

### 8.2 复用与 DRY（强制）

* 公共组件：筛选条、分页、摘要块、空状态、权限提示
* 公共 hooks：`useApi`、`useAuth`、`useCompanyContext`、`useQueryState`
* API Client 统一封装（headers、错误处理、requestId）

---

## 9. DevOps 与工程流程（Docker + GitHub）

### 9.1 Docker（开发）

* `mysql + redis + meilisearch` 必须容器化
* web/api 本地或容器皆可（建议先本地 dev，后续再容器化）

### 9.2 GitHub 流程

* `main`（可部署）+ `dev`（集成）+ feature 分支 PR
* CI 必须跑：lint/typecheck/test/build

---

## 10. 变更规则（强制执行）

* **改 DB**：migrations 入库 + 更新 DB_SCHEMA
* **改 API**：更新 API.md + CHANGELOG_API（必要时 BREAKING + 迁移）
* **改业务**：优先更新 BUSINESS_RULES（避免污染工程规范）
* **改页面/SEO/AI入口策略**：更新 FRONTEND_GUIDE / PLATFORM_OVERVIEW

---

## 11. 里程碑（技术视角）

### M1：工程底座 + SEO 壳 + 搜索跑通

* 多语路由 + antd 主题
* 三级类目/详情占位页（SEO）
* 搜索（Meili）链路跑通（noindex 搜索页）

### M2：AI 入口系统落地（首页模块 + 悬浮入口）

* 首页 AI 双 CTA + 快速输入 + 示例
* 全站悬浮入口 + 上下文注入白名单 + 审计

### M3：撮合闭环（BOM → 匹配 → Lead → 会话）

* BOM 版本化 + 匹配结果解释
* Lead/RFQ 邀请/响应/对比 + 联系方式按状态解锁 + 审计

---

## 12. GPT 每次执行任务的输出模板（强制）

1. 引用本方案的相关约束（UI/路由/AI入口/权限/文档/迁移）
2. 列出变更面：API/DB/搜索索引/前端路由
3. 先更新 docs（若涉及 API/DB/规则）再写代码
4. 代码必须包含：权限校验 + 字段过滤 + 审计 + 测试（含越权用例）
5. 给出验证清单：docker、迁移、curl（401/403/200）、CI 预期

---

如果你希望我把它“真正落到你的仓库里”，我可以按这份 TECH_PLAN 做一次结构化更新：

* 在 `docs/` 增加 `TECH_PLAN.md`、更新 `PLATFORM_OVERVIEW.md` 为 V0.2
* 前端加入全站 `AiAssistantLauncher`（FloatButton + Drawer 空壳 + context 注入接口）
* 后端加入 `ai` 模块的占位接口（仅校验/审计/占位响应），并同步更新 `API.md + CHANGELOG_API.md`（严格遵守你的硬指令）
