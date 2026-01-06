import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLang } from '@mfg/shared';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // redirect "/" to "/en"
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  // Optional: if first segment is not a supported lang, redirect to /en + path
  const seg = pathname.split('/')[1];
  if (seg && !isLang(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico).*)'],
};
