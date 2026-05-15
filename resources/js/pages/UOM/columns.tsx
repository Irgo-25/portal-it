'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Uom = {
    id_uom: number;
    name: string;
    symbol: string;
};

interface UomColumnsProps {
    openCardDelete: (uom: Uom) => void;
    openCardEdit: (uom: Uom) => void;
}

export const uomColumns = ({
    openCardDelete,
    openCardEdit,
}: UomColumnsProps): ColumnDef<Uom>[] => [
    {
        accessorKey: 'name',
        header: 'Uom Name',
    },

    {
        accessorKey: 'symbol',
        header: 'Symbol',
    },

    {
        id: 'actions',
        header: 'Actions',

        cell: ({ row }) => {
            const uom = row.original;

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
                            onClick={() => openCardEdit(uom)}
                            className="cursor-pointer text-amber-600"
                        >
                            Edit
                        </DropdownMenuItem>

                        {/* DELETE */}
                        <DropdownMenuItem
                            onClick={() => openCardDelete(uom)}
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
