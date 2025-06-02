import { type NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (
		pathname.includes('_next') ||
		pathname.includes('api') ||
		pathname.includes('_rsc')
	) {
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*']
}
