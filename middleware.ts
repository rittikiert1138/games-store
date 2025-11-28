import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the route is an admin route
    if (path.startsWith('/admin')) {
        // Exclude login page and static assets if any
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Verify session
        const cookie = request.cookies.get('session')?.value;
        const session = cookie ? await decrypt(cookie) : null;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
