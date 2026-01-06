# DB_SCHEMA（V0.1）
> 规则：任何 DB 结构变化必须通过 migrations，并同步更新本文件。

## Prisma schema
- Source: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/**`

---

## Tables

### `users`
用户表（平台账号）。
- `id` (BIGINT, PK)
- `email` (unique)
- `password_hash`：密码哈希（盐+派生值）
- `role`：`ADMIN | BUYER | SUPPLIER`
- `preferred_lang`：语言偏好（可选）
- `status`：默认 `ACTIVE`
- `created_at / updated_at`

索引/约束：
- unique: `email`

### `companies`
公司/租户表（ABAC 的 company_id 基础）。
- `id` (BIGINT, PK)
- `name`
- `status`
- `created_at / updated_at`

### `company_members`
公司成员关系表（用户属于哪个公司）。
- `company_id` + `user_id` 复合主键
- `member_role`：`OWNER | MEMBER`

索引/约束：
- PK: (`company_id`, `user_id`)
- FK: `company_id -> companies.id`
- FK: `user_id -> users.id`

### `audit_logs`
审计日志（关键操作必须写入）。
- `id` (BIGINT, PK)
- `actor_user_id`：执行者（可为空，用于匿名/系统任务）
- `action`：动作（如 `AUTH_LOGIN`、`CONTACT_UNLOCK`、`AI_CONTEXT_INJECTED`）
- `entity_type`：资源类型（如 `user/company/bom/lead/...`）
- `entity_id`：资源 ID（字符串，便于兼容多类型）
- `meta_json`：扩展信息（建议包含 `requestId`、输入摘要、上下文注入摘要等）
- `created_at`

索引/约束：
- index: `actor_user_id`
- FK: `actor_user_id -> users.id`（SET NULL）

---

## Notes
- `company_id` 是租户隔离与 ABAC 的核心字段：任何受保护资源表必须带上 `company_id`。
- 敏感字段（联系方式/私密报价等）应通过“字段级过滤”在服务端控制返回。
