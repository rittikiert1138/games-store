import { NextResponse } from 'next/server';
import { db } from '@/db';
import { systemLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const logs = await db
            .select()
            .from(systemLogs)
            .orderBy(desc(systemLogs.createdAt))
            .limit(1000); // Limit to last 1000 logs for performance

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch system logs' }, { status: 500 });
    }
}