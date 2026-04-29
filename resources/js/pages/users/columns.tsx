'use client';

import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import users from '@/routes/users';

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

interface UserColumnsProps {
    openCardDelete: (user: User) => void;
}

export const userColumns = ({
    openCardDelete,
}: UserColumnsProps): ColumnDef<User>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },

    {
        accessorKey: 'email',
        header: 'Email',
    },

    {
        accessorKey: 'created_at',
        header: 'Created At',
    },

    {
        id: 'actions',
        header: 'Actions',

        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {/* EDIT */}
                        <DropdownMenuItem asChild>
                            <Link
                                href={users.edit(user.id)}
                                className="cursor-pointer text-yellow-500"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        {/* DELETE */}
                        <DropdownMenuItem
                            onClick={() =>
                                openCardDelete(user)
                            }
                            className="cursor-pointer text-red-500"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];