# API 文档（V0.1）
> 说明：所有新增/更新接口必须同步更新此文档，并记录到 `docs/CHANGELOG_API.md`。

## 响应格式（统一）
成功：
```json
{ "ok": true, "data": {} }
```
失败：
```json
{ "ok": false, "error": { "code": "SOME_ERROR", "message": "...", "details": {} } }
```

## Headers（约定）
- `X-Request-Id`：服务端返回；客户端可传入以串联日志
- `Authorization: Bearer <token>`：登录态
- `X-Company-Id: <companyId>`：当接口标记为“RequireCompany”时必传（ABAC）

---

## Health
### GET /api/health
- Auth：Public
- Response：
```json
{ "ok": true, "data": { "status": "ok" } }
```

---

## Auth
### POST /api/auth/register
- Auth：Public
- Body：
```json
{
  "email": "user@example.com",
  "password": "password_min_8",
  "role": "BUYER",
  "companyName": "My Company (optional)"
}
```
- Response：
```json
{
  "ok": true,
  "data": {
    "token": "jwt",
    "user": { "id": "1", "email": "user@example.com", "role": "BUYER" },
    "companyId": "1"
  }
}
```
- Errors：
  - `EMAIL_ALREADY_EXISTS`（409）
  - `VALIDATION_ERROR`（400）

### POST /api/auth/login
- Auth：Public
- Body：
```json
{ "email": "user@example.com", "password": "password_min_8" }
```
- Response：
```json
{
  "ok": true,
  "data": {
    "token": "jwt",
    "user": { "id": "1", "email": "user@example.com", "role": "BUYER" }
  }
}
```
- Errors：
  - `INVALID_CREDENTIALS`（401）
  - `VALIDATION_ERROR`（400）

### GET /api/auth/me
- Auth：Required
- Response：
```json
{
  "ok": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "role": "BUYER",
    "preferredLang": null,
    "memberships": [
      { "companyId": "1", "companyName": "My Company", "memberRole": "OWNER" }
    ]
  }
}
```

### GET /api/auth/company
- Auth：Required
- ABAC：RequireCompany（必须传 `X-Company-Id`，服务端验证 company_members）
- Response：
```json
{ "ok": true, "data": { "companyId": "1", "memberRole": "OWNER" } }
```
- Errors：
  - `COMPANY_CONTEXT_REQUIRED`（400）
  - `NOT_COMPANY_MEMBER`（403）
