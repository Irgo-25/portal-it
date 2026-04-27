import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { userColumns } from './columns';
import { DataTable } from './data-table';

interface Props {
    users: {
        data: any[];
        total: number;
    };
}

export default function IndexUser({ users }: Props) {
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
                    columns={userColumns as ColumnDef<unknown, unknown>[]}
                    data={users.data}
                    pagination={users}
                />
            </div>
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
