import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateUserSchema = z.object({
    username: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional(),
    isBanned: z.boolean().optional(),
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = parseInt(params.id);
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        if (user.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = parseInt(params.id);
        const body = await request.json();
        const data = updateUserSchema.parse(body);

        // Hash password if provided
        if (data.password) {
            const { hashPassword } = await import('@/lib/auth');
            data.password = await hashPassword(data.password);
        }

        await db.update(users)
            .set(data)
            .where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = parseInt(params.id);

        await db.delete(users).where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}