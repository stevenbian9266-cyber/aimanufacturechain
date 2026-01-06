# API 变更日志

> 规则：每次新增/更新 API（路径/入参/出参/权限/错误码/语义）都必须记录。
> 破坏性变更必须标记：**BREAKING CHANGE**，并写迁移说明。

## 2026-01-06
- feat: init `GET /api/health`
- feat: add auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- feat: add ABAC template endpoint: `GET /api/auth/company` (RequireCompany via `X-Company-Id`)

