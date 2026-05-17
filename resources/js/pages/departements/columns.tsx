'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Departement } from '@/types';

interface DepartementColumnsProps {
    openCardDelete: (departement: Departement) => void;
    openCardEdit: (departement: Departement) => void;
}

export const departementColumns = ({
    openCardDelete,
    openCardEdit,
}: DepartementColumnsProps): ColumnDef<Departement>[] => [
    {
        accessorKey: 'name',
        header: 'Departement Name',
    },

    {
        accessorKey: 'code',
        header: 'Code',
    },

    {
        id: 'actions',
        header: 'Actions',

        cell: ({ row }) => {
            const departement = row.original;

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
                            onClick={() => openCardEdit(departement)}
                            className="cursor-pointer text-amber-600"
                        >
                            Edit
                        </DropdownMenuItem>

                        {/* DELETE */}
                        <DropdownMenuItem
                            onClick={() => openCardDelete(departement)}
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
