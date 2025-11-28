'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
    users: number;
    games: number;
    orders: number;
    admins: number;
    revenue: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        users: 0,
        games: 0,
        orders: 0,
        admins: 0,
        revenue: '0.00'
    });

    useEffect(() => {
        // Fetch stats from API
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Games</h3>
                    <p className="text-3xl font-bold">{stats.games}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                    <p className="text-3xl font-bold">฿{stats.revenue}</p>
                </div>
            </div>

            {/* Data Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Users Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Users Management</h3>
                    <p className="text-gray-600 mb-4">Manage user accounts, wallets, and transactions</p>
                    <div className="space-y-2">
                        <Link href="/admin/users" className="block text-indigo-600 hover:text-indigo-800">Manage Users</Link>
                        <Link href="/admin/wallets" className="block text-indigo-600 hover:text-indigo-800">Manage Wallets</Link>
                        <Link href="/admin/topup-requests" className="block text-indigo-600 hover:text-indigo-800">Topup Requests</Link>
                    </div>
                </div>

                {/* Games Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Games Management</h3>
                    <p className="text-gray-600 mb-4">Manage games and game products</p>
                    <div className="space-y-2">
                        <Link href="/admin/games" className="block text-indigo-600 hover:text-indigo-800">Manage Games</Link>
                        <Link href="/admin/game-products" className="block text-indigo-600 hover:text-indigo-800">Game Products</Link>
                    </div>
                </div>

                {/* Orders Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Orders Management</h3>
                    <p className="text-gray-600 mb-4">Manage orders and transactions</p>
                    <div className="space-y-2">
                        <Link href="/admin/orders" className="block text-indigo-600 hover:text-indigo-800">Manage Orders</Link>
                        <Link href="/admin/order-items" className="block text-indigo-600 hover:text-indigo-800">Order Items</Link>
                    </div>
                </div>

                {/* Admin Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Admin Management</h3>
                    <p className="text-gray-600 mb-4">Manage admin accounts and permissions</p>
                    <div className="space-y-2">
                        <Link href="/admin/admins" className="block text-indigo-600 hover:text-indigo-800">Manage Admins</Link>
                        <Link href="/admin/roles" className="block text-indigo-600 hover:text-indigo-800">Manage Roles</Link>
                        <Link href="/admin/permissions" className="block text-indigo-600 hover:text-indigo-800">Manage Permissions</Link>
                    </div>
                </div>

                {/* System Management */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">System Management</h3>
                    <p className="text-gray-600 mb-4">View system logs and settings</p>
                    <div className="space-y-2">
                        <Link href="/admin/system-logs" className="block text-indigo-600 hover:text-indigo-800">System Logs</Link>
                        <Link href="/admin/settings" className="block text-indigo-600 hover:text-indigo-800">System Settings</Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <p className="text-gray-600 mb-4">Common administrative tasks</p>
                    <div className="space-y-2">
                        <Link href="/admin/games/new" className="block text-indigo-600 hover:text-indigo-800">Add New Game</Link>
                        <Link href="/admin/admins/new" className="block text-indigo-600 hover:text-indigo-800">Add New Admin</Link>
                        <Link href="/admin/reports" className="block text-indigo-600 hover:text-indigo-800">Generate Reports</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
