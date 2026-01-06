'use client';

import React, { useEffect } from 'react';
import { useAiContext, type AiContext } from './ai-context';

/**
 * Set AI context for the global floating launcher.
 * Only pass PUBLIC fields here. Never pass contact/private data.
 */
export function AiContextSetter({ ctx }: { ctx: AiContext }) {
  const { setCtx } = useAiContext();

  useEffect(() => {
    setCtx(ctx);
  }, [ctx, setCtx]);

  return null;
}
