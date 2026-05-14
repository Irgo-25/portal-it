'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Category = {
    id_category: number;
    name: string;
    description: string;
};

interface CategoryColumnsProps {
    openCardDelete: (category: Category) => void;
    openCardEdit: (category: Category) => void;
}

export const categoryColumns = ({
    openCardDelete,
    openCardEdit,
}: CategoryColumnsProps): ColumnDef<Category>[] => [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },

    {
        accessorKey: 'description',
        header: 'Description',
    },

    {
        id: 'actions',
        header: 'Actions',

        cell: ({ row }) => {
            const category = row.original;

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
                        <DropdownMenuItem
                            onClick={() => openCardEdit(category)}
                            className="cursor-pointer text-amber-600"
                        >
                            Edit
                        </DropdownMenuItem>

                        {/* DELETE */}
                        <DropdownMenuItem
                            onClick={() => openCardDelete(category)}
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
