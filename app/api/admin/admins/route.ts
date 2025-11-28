import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admins } from '@/db/schema';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const adminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    isActive: z.boolean().optional(),
});

export async function GET() {
    try {
        const allAdmins = await db.select().from(admins);
        return NextResponse.json(allAdmins);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = adminSchema.parse(body);

        // Hash password before storing
        const { hashPassword } = await import('@/lib/auth');
        const hashedPassword = await hashPassword(data.password);

        await db.insert(admins).values({
            ...data,
            password: hashedPassword,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}