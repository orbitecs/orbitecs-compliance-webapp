import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Manejar solicitudes de Chrome DevTools
  if (request.nextUrl.pathname.startsWith('/.well-known/')) {
    return new NextResponse(null, { status: 204 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/.well-known/:path*',
  ],
} 