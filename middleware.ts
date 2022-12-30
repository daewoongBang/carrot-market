import {
  NextRequest,
  NextResponse,
  NextFetchEvent,
  userAgent
} from 'next/server';

export function middleware(request: NextRequest, ev: NextFetchEvent) {
  const { isBot } = userAgent(request);

  if (isBot) {
  }

  if (!request.url.includes('/api')) {
    if (
      !request.url.includes('/enter') &&
      !request.cookies.get('carrotsession')
    ) {
      request.nextUrl.pathname = '/enter';

      return NextResponse.redirect(request.nextUrl);
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
