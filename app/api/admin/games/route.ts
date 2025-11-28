import { NextResponse } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const gameSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    isActive: z.boolean().optional(),
});

export async function GET() {
    const allGames = await db.select().from(games);
    return NextResponse.json(allGames);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = gameSchema.parse(body);

        await db.insert(games).values(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
