import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateAdminSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional(),
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const admin = await db.select().from(admins).where(eq(admins.id, params.id)).limit(1);

        if (admin.length === 0) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json(admin[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admin' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const data = updateAdminSchema.parse(body);

        // Hash password if provided
        if (data.password) {
            const { hashPassword } = await import('@/lib/auth');
            data.password = await hashPassword(data.password);
        }

        await db.update(admins)
            .set(data)
            .where(eq(admins.id, params.id));

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
        await db.delete(admins).where(eq(admins.id, params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}