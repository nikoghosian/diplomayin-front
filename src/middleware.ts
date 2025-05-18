// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest) {
	const { url, cookies } = request
	const accessToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value
	const pathname = request.nextUrl.pathname

	// Пропускаем служебные маршруты (Next.js и API)
	if (
		pathname.includes('_next') ||
		pathname.includes('api') ||
		pathname.includes('_rsc')
	) {
		return NextResponse.next()
	}

	const isAuthPage = pathname.startsWith('/auth')
	const isDashboardPage = pathname.startsWith('/i')

	if (isAuthPage && accessToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))
	}

	if (isDashboardPage && !accessToken) {
		return NextResponse.redirect(new URL('/auth', url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*']
}
