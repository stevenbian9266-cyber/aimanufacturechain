# FRONTEND_GUIDE（V0）

## 目标
- Next.js App Router + Ant Design
- 多语路由：`/{lang}/...`
- SEO 页面与工作台分组

## 目录约定（建议）
- `app/[lang]/(seo)/...`：可索引
- `app/[lang]/(app)/...`：登录后（noindex）

## antd 主题
- 统一在 `ConfigProvider` 设置 token
- 禁止页面内硬编码品牌色/字号

## i18n
- 统一使用 `src/lib/i18n.ts`
