'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import { AiContextProvider } from '../../src/components/ai/ai-context';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

type Props = {
  lang: string;
  children: React.ReactNode;
};

export default function Providers({ lang, children }: Props) {
  const locale = lang === 'zh' ? zhCN : enUS;

  return (
    <AiContextProvider lang={lang}>
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          // Put your global tokens here (keep consistent).
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
    </AiContextProvider>
  );
}
