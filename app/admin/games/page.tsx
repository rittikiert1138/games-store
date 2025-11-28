'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GamesList() {
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/admin/games')
            .then((res) => res.json())
            .then((data) => setGames(data));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Games</h2>
                <Link
                    href="/admin/games/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Add New Game
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {games.map((game) => (
                        <li key={game.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
                                    <p className="text-sm text-gray-500">{game.slug}</p>
                                </div>
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${game.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {game.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </li>
                    ))}
                    {games.length === 0 && (
                        <li className="px-6 py-4 text-center text-gray-500">No games found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
