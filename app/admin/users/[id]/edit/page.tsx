'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    isActive: z.boolean().optional(),
    isBanned: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface User {
    id: number;
    username: string;
    isActive: boolean;
    isBanned: boolean;
}

export default function EditUser() {
    const router = useRouter();
    const params = useParams();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${params.id}`);
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    setValue('username', userData.username);
                    setValue('isActive', userData.isActive);
                    setValue('isBanned', userData.isBanned);
                } else {
                    setError('Failed to fetch user');
                }
            } catch (error) {
                setError('An error occurred while fetching the user');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id, setValue]);

    const onSubmit = async (data: FormData) => {
        setError('');
        setIsSubmitting(true);

        try {
            // Remove empty password
            const submitData = { ...data };
            if (!submitData.password || submitData.password === '') {
                delete submitData.password;
            }

            const res = await fetch(`/api/admin/users/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });

            if (res.ok) {
                router.push('/admin/users');
            } else {
                const json = await res.json();
                setError(json.error || 'Failed to update user');
            }
        } catch (error) {
            setError('An error occurred while updating the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center py-8">User not found</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit User: {user.username}</h2>
                <Link
                    href="/admin/users"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Users
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password (leave empty to keep current)</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Enter new password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            {...register('isActive')}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            {...register('isBanned')}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Banned
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/admin/users"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}