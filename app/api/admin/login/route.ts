import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, login } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (!admin || !admin.isActive) {
            return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, admin.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        await login({ id: admin.id, email: admin.email });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
