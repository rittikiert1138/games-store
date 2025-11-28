import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const allOrders = await db.select().from(orders);
        return NextResponse.json(allOrders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}