import Link from 'next/link';
import { logout } from '@/lib/auth'; // We can't use server actions directly in client components easily without 'use server', but for layout we can keep it simple or use a client component for the logout button.

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-indigo-600">GameStore Admin</h1>
                </div>
                <nav className="mt-6">
                    <Link href="/admin" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        Dashboard
                    </Link>

                    <div className="px-6 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h3>
                    </div>

                    <Link href="/admin/users" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        Users
                    </Link>
                    <Link href="/admin/games" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        Games
                    </Link>
                    <Link href="/admin/orders" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        Orders
                    </Link>
                    <Link href="/admin/admins" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        Admins
                    </Link>
                    <Link href="/admin/system-logs" className="block px-6 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        System Logs
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
