import React from 'react';
import { AiContextSetter } from '../../../../src/components/ai/ai-context-setter';
import { Card, Descriptions, Typography } from 'antd';

export const dynamic = 'force-static';

export default function CategoryPage({ params }: { params: { lang: string; l1: string; l2: string; l3: string } }) {
  return (
    <>
      <AiContextSetter ctx={{ type: 'category', lang: params.lang, l1: params.l1, l2: params.l2, l3: params.l3 }} />

    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Typography.Title level={3}>Category (SEO placeholder)</Typography.Title>
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="lang">{params.lang}</Descriptions.Item>
          <Descriptions.Item label="l1Slug">{params.l1}</Descriptions.Item>
          <Descriptions.Item label="l2Slug">{params.l2}</Descriptions.Item>
          <Descriptions.Item label="l3Slug">{params.l3}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
    </>
  );
}
