import React from 'react';
import { AiContextSetter } from '../../../src/components/ai/ai-context-setter';
import { Card, Descriptions, Typography } from 'antd';

export default function FactoryPage({ params }: { params: { lang: string; idSlug: string } }) {
  return (
    <>
      <AiContextSetter ctx={{ type: 'factory', lang: params.lang, idSlug: params.idSlug }} />

    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Typography.Title level={3}>Factory (SEO placeholder)</Typography.Title>
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="lang">{params.lang}</Descriptions.Item>
          <Descriptions.Item label="id-slug">{params.idSlug}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
    </>
  );
}
