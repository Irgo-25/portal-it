'use client';

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

import CardConfirmation from '@/components/card-confirmation';
import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import { userColumns } from './columns';

interface Props {
    users: {
        data: User[];
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
}

export default function IndexUser({ users }: Props) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [openDelete, setOpenDelete] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);

    /*
    =====================================
    OPEN DELETE MODAL
    =====================================
    */
    const openCardDelete = (user: User) => {
        setSelectedUser(user);
        setOpenDelete(true);
    };

    /*
    =====================================
    CONFIRM DELETE
    =====================================
    */
    const handleDelete = () => {
        if (!selectedUser) {
            return;
        }

        setLoadingDelete(true);

        router.delete(route('users.destroy', selectedUser.id), {
            preserveScroll: true,

            onFinish: () => {
                setLoadingDelete(false);
                setOpenDelete(false);
                setSelectedUser(null);
            },
        });
    };

    return (
        <>
            <Head title="Users" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users Management</h1>

                    <Button asChild>
                        <a href={route('users.create')}>Create User</a>
                    </Button>
                </div>

                <DataTable
                    columns={userColumns({
                        openCardDelete,
                    })}
                    data={users.data}
                    pagination={users}
                />
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {openDelete && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <CardConfirmation
                        title="Delete User"
                        description={`Are you sure you want to delete "${selectedUser.name}"? This action cannot be undone.`}
                        confirmationText="Delete"
                        cancelText="Cancel"
                        loading={loadingDelete}
                        onConfirm={handleDelete}
                        onCancel={() => {
                            setOpenDelete(false);
                            setSelectedUser(null);
                        }}
                    />
                </div>
            )}
        </>
    );
}

IndexUser.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: route('users.index'),
        },
    ],
};
