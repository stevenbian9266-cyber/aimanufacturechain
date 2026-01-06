import React from 'react';
import Link from 'next/link';
import { Card, Space, Typography, Button, Input, Row, Col } from 'antd';
import { AiContextSetter } from '../../src/components/ai/ai-context-setter';

export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: 24 }}>
      <AiContextSetter ctx={{ type: 'home', lang }} />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Title level={2}>mfg-b2b-platform</Typography.Title>

        {/* ✅ Home AI Core Module (PLATFORM_OVERVIEW V0.2 强制) */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              AI 采购助手
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
              生成 BOM 或使用已有 BOM 匹配产品与工厂（占位骨架，后续接入后端 AI 工具函数）。
            </Typography.Paragraph>

            <Row gutter={[12, 12]}>
              <Col xs={24} md={16}>
                <Input
                  placeholder="快速输入：例如“我想做一款便携榨汁杯，目标成本$8，数量3000，需FDA”"
                  size="large"
                />
              </Col>
              <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Link href={`/${lang}?ai=1&mode=generate_bom`}>
                    <Button type="primary" block size="large">
                      我想做产品 → 生成 BOM
                    </Button>
                  </Link>
                  <Link href={`/${lang}?ai=1&mode=match_bom`}>
                    <Button block size="large">
                      我已有 BOM → 自动匹配
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>

            <Space wrap>
              <Link href={`/${lang}?ai=1&mode=generate_bom`}><Button>示例：充电宝</Button></Link>
              <Link href={`/${lang}?ai=1&mode=generate_bom`}><Button>示例：蓝牙音箱</Button></Link>
              <Link href={`/${lang}?ai=1&mode=generate_bom`}><Button>示例：宠物喂食器</Button></Link>
              <Link href={`/${lang}?ai=1&mode=generate_bom`}><Button>示例：旅行收纳盒</Button></Link>
            </Space>
          </Space>
        </Card>

        <Card>
          <Space direction="vertical">
            <Typography.Text strong>Navigation (placeholders)</Typography.Text>
            <Link href={`/${lang}/search?q=cnc&type=factory`}>Search (noindex page)</Link>
            <Link href={`/${lang}/c/l1/l2/l3`}>Category (placeholder)</Link>
            <Link href={`/${lang}/p/1-demo-product`}>Product (placeholder)</Link>
            <Link href={`/${lang}/f/1-demo-factory`}>Factory (placeholder)</Link>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
