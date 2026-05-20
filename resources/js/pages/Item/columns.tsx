'use client';

import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { route } from 'ziggy-js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Item } from '@/types';

interface ItemColumnsProps {
    openCardDelete: (item: Item) => void;
}

export const itemColumns = ({
    openCardDelete,
}: ItemColumnsProps): ColumnDef<Item>[] => [
    {
        accessorKey: 'name',
        header: 'Item Name',
    },

    {
        accessorKey: 'code',
        header: 'Code Item',
    },

    {
        accessorKey: 'category.name',
        header: 'Category',
    },

    {
        accessorKey: 'departement.name',
        header: 'Departement',
    },

    {
        accessorKey: 'stock',
        header: 'Stock',
    },

    {
        id: 'actions',
        header: 'Actions',

        cell: ({ row }) => {
            const item = row.original;

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
                            onClick={() =>
                                router.visit(route('items.edit', item.id_item))
                            }
                            className="cursor-pointer text-amber-500"
                        >
                            Edit
                        </DropdownMenuItem>

                        {/* DELETE */}
                        <DropdownMenuItem
                            onClick={() => openCardDelete(item)}
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
