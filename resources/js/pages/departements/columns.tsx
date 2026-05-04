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

import departements from '@/routes/departements';

export type Departement = {
    id_departement: number;
    name: string;
    code: string;
};

interface DepartemntColumnsProps {
    openCardDelete: (departement: Departement) => void;
}

export const departementColumns = ({
    openCardDelete,
}: DepartemntColumnsProps): ColumnDef<Departement>[] => [
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
                        <DropdownMenuItem asChild>
                            <Link
                                href={departements.edit(
                                    departement.id_departement,
                                )}
                                className="cursor-pointer text-yellow-500"
                            >
                                Edit
                            </Link>
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
