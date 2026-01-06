# PLATFORM_OVERVIEW（平台方案蓝图 V0.2）
更新时间：2026-01-06

变更摘要（相对 V0.1）：
- 首页新增 AI 采购助手独立核心模块（强曝光/强转化）
- 其它页面统一右下角悬浮 AI 入口（全站一致体验）
- 支持上下文注入（仅公开字段），并严格字段级权限与审计

---

## 1. 系统模块拆分
### Public Discovery（SEO/获客）
- 三级类目、产品目录、工厂目录（代工/组装能力）
- 关键词搜索（产品/工厂/组装厂）+ 关键筛选
- 内容系统（guides/FAQ/术语：GEO 友好）

### Identity & Tenant（身份与组织）
- 用户、公司、成员、供应商资料完善

### Matching Core（撮合核心）
- BOM（版本化、可编辑、关键件）
- 匹配（BOM item → 候选产品/候选工厂）
- Lead/RFQ（邀请、响应、对比、跟进）
- Conversation/Messages（沟通与附件）

### Governance（治理）
- 审计（audit_logs）、审核/举报、风控、字典

### AI Assistant（能力系统 + 入口系统）
- 对话澄清 → 生成 BOM（痛点 4.1）
- 已有 BOM → 匹配产品/工厂（痛点 4.2）
- 解释/置信度/风险标记
- 安全：只走后端工具函数，严格权限与字段过滤

---

## 2. 角色与权限
- RBAC：ADMIN / BUYER / SUPPLIER
- 公司内角色：OWNER / MEMBER
- ABAC：company_id / owner / invite / conversation participant / state

---

## 3. 页面架构（SEO vs 工作台）
### SEO 页（可索引）
- `/{lang}/` 首页（含 AI 独立核心模块）
- `/{lang}/c/...` 类目页
- `/{lang}/p/...` 产品详情
- `/{lang}/f/...` 工厂详情
- `/guides/...` 指南/术语/FAQ

### 搜索页（noindex）
- `/{lang}/search?q=...&type=...`

### 工作台（noindex）
- Buyer：bom / leads / conversations
- Supplier：inbox / responses / factory profile
- Admin：admin/*

---

## 4. ✅ AI 入口策略（强制）
### 4.1 首页 AI 核心模块（独立、重要）
- 双 CTA：生成 BOM / 已有 BOM 匹配
- 快速输入 + 示例
- 目标：把访客快速导入可转化流程（保存 BOM → 匹配 → Lead）

### 4.2 其它页面统一悬浮入口
- 右下角悬浮（FloatButton）
- Drawer/Modal 打开对话
- 支持上下文注入（类目/产品/工厂/搜索公开字段与筛选条件）
- 严格字段级权限：未解锁不得注入联系方式等敏感字段，并写审计

---

## 5. 核心流程
发现 → AI 导流 → 保存 BOM → 匹配 → 创建 Lead → 邀请 → 响应 → 会话 → 关闭  
联系方式敏感字段按状态解锁并写审计。
