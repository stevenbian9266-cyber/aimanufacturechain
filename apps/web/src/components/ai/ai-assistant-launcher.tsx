'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Drawer, FloatButton, Input, Segmented, Space, Tag, Typography } from 'antd';
import { useAiContext } from './ai-context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Mode = 'generate_bom' | 'match_bom';

function toBadges(ctx: ReturnType<typeof useAiContext>['ctx']) {
  const items: string[] = [];
  items.push(`type:${ctx.type}`);

  if (ctx.type === 'category') items.push(`c:${ctx.l1}/${ctx.l2}/${ctx.l3}`);
  if (ctx.type === 'product') items.push(`p:${ctx.idSlug}`);
  if (ctx.type === 'factory') items.push(`f:${ctx.idSlug}`);
  if (ctx.type === 'search') items.push(`q:${ctx.q || '-'}`);

  return items;
}

export default function AiAssistantLauncher() {
  const { ctx } = useAiContext();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('generate_bom');
  const [text, setText] = useState('');

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Open via query params (used by Home AI module CTA)
  useEffect(() => {
    const ai = searchParams.get('ai');
    const m = searchParams.get('mode');

    if (ai === '1') {
      if (m === 'generate_bom' || m === 'match_bom') setMode(m);
      setOpen(true);

      // Remove params to avoid reopening repeatedly
      const next = new URLSearchParams(searchParams.toString());
      next.delete('ai');
      next.delete('mode');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badges = useMemo(() => toBadges(ctx), [ctx]);

  return (
    <>
      <FloatButton tooltip="AI 采购助手" onClick={() => setOpen(true)} />

      <Drawer
        title="AI 采购助手（占位骨架）"
        open={open}
        onClose={() => setOpen(false)}
        width={440}
        destroyOnClose
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            上下文（仅公开字段）：
          </Typography.Paragraph>

          <Space wrap>
            {badges.map((b) => (
              <Tag key={b}>{b}</Tag>
            ))}
          </Space>

          <Divider style={{ margin: '8px 0' }} />

          <Segmented
            block
            value={mode}
            options={[
              { label: '生成 BOM', value: 'generate_bom' },
              { label: '已有 BOM 匹配', value: 'match_bom' },
            ]}
            onChange={(v) => setMode(v as Mode)}
          />

          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === 'generate_bom'
                ? '描述你想生产的产品（用途/材质/尺寸/目标成本/数量/认证/交期）'
                : '粘贴 BOM（或描述 BOM 关键项）'
            }
            autoSize={{ minRows: 4, maxRows: 10 }}
          />

          <Space>
            <Button type="primary" disabled={!text.trim()}>
              发送（占位）
            </Button>
            <Button onClick={() => setText('')}>清空</Button>
          </Space>

          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            下一步：接入后端 AI 工具函数（权限校验/字段过滤/审计），并把结果保存为 BOM/匹配结果。
          </Typography.Paragraph>
        </Space>
      </Drawer>
    </>
  );
}
