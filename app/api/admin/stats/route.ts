import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, games, orders, admins, walletTransactions } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Get counts
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [gameCount] = await db.select({ count: sql<number>`count(*)` }).from(games);
        const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
        const [adminCount] = await db.select({ count: sql<number>`count(*)` }).from(admins);

        // Get total revenue from completed orders
        const [revenueResult] = await db
            .select({ total: sql<string>`COALESCE(SUM(final_amount), 0)` })
            .from(orders)
            .where(sql`${orders.status} = 'COMPLETED'`);

        return NextResponse.json({
            users: userCount.count,
            games: gameCount.count,
            orders: orderCount.count,
            admins: adminCount.count,
            revenue: revenueResult.total || '0.00'
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}