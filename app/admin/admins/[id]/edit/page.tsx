'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface Admin {
    id: string;
    email: string;
    isActive: boolean;
}

export default function EditAdmin() {
    const router = useRouter();
    const params = useParams();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<Admin | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch(`/api/admin/admins/${params.id}`);
                if (res.ok) {
                    const adminData = await res.json();
                    setAdmin(adminData);
                    setValue('email', adminData.email);
                    setValue('isActive', adminData.isActive);
                } else {
                    setError('Failed to fetch admin');
                }
            } catch (error) {
                setError('An error occurred while fetching the admin');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAdmin();
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

            const res = await fetch(`/api/admin/admins/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });

            if (res.ok) {
                router.push('/admin/admins');
            } else {
                const json = await res.json();
                setError(json.error || 'Failed to update admin');
            }
        } catch (error) {
            setError('An error occurred while updating the admin');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!admin) {
        return <div className="text-center py-8">Admin not found</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Admin: {admin.email}</h2>
                <Link
                    href="/admin/admins"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Admins
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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

                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/admin/admins"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}