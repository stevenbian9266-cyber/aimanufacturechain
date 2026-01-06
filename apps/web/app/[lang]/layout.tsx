import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from './providers';
import AiAssistantLauncher from '../../src/components/ai/ai-assistant-launcher';
import { normalizeLang } from '../../src/lib/i18n';

export const metadata = {
  title: 'mfg-b2b-platform',
  description: 'Manufacturing B2B matching platform',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = normalizeLang(params.lang);

  return (
    <html lang={lang}>
      <body>
        <AntdRegistry>
          <Providers lang={lang}>
            {children}
            <AiAssistantLauncher />
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
