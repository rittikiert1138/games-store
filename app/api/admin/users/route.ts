import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const userSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(6),
    isActive: z.boolean().optional(),
    isBanned: z.boolean().optional(),
});

export async function GET() {
    try {
        const allUsers = await db.select().from(users);
        return NextResponse.json(allUsers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = userSchema.parse(body);

        // Hash password before storing
        const { hashPassword } = await import('@/lib/auth');
        const hashedPassword = await hashPassword(data.password);

        await db.insert(users).values({
            ...data,
            password: hashedPassword,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}