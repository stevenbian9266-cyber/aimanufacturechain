import React from 'react';
import { Card, Input, Space, Typography } from 'antd';
import { ApiClient, getApiBaseUrl } from '../../../src/lib/api-client';
import { AiContextSetter } from '../../../src/components/ai/ai-context-setter';

type SearchParams = { q?: string };

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParams;
}) {
  const q = searchParams.q || '';
  const api = new ApiClient(getApiBaseUrl());

  let status: string | null = null;
  try {
    const data = await api.get<{ status: string }>('/api/health');
    status = data.status;
  } catch {
    status = null;
  }

  return (
    <>
      <AiContextSetter ctx={{ type: 'search', lang: params.lang, q }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3}>Search (noindex)</Typography.Title>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input.Search defaultValue={q} placeholder="Search products/factories..." />
              <Typography.Paragraph type="secondary">
                API health: {status ?? 'unreachable'}
              </Typography.Paragraph>
            </Space>
          </Card>
        </Space>
      </div>
    </>
  );
}
