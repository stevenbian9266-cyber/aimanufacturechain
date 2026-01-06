'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type AiContext =
  | { type: 'home'; lang: string }
  | { type: 'category'; lang: string; l1: string; l2: string; l3: string }
  | { type: 'product'; lang: string; idSlug: string }
  | { type: 'factory'; lang: string; idSlug: string }
  | { type: 'search'; lang: string; q: string; filters?: Record<string, string> }
  | { type: 'unknown'; lang: string };

type AiContextValue = {
  ctx: AiContext;
  setCtx: (ctx: AiContext) => void;
};

const Ctx = createContext<AiContextValue | null>(null);

export function AiContextProvider({ lang, children }: { lang: string; children: React.ReactNode }) {
  const [ctx, setCtx] = useState<AiContext>({ type: 'unknown', lang });
  const value = useMemo(() => ({ ctx, setCtx }), [ctx]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAiContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AiContextProvider is missing');
  return v;
}
