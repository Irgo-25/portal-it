'use client';

import { router } from '@inertiajs/react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import { route } from 'ziggy-js';

import CardConfirmation from '@/components/card-confirmation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
interface HasId {
    id: number;
}
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: {
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
    filters?: {
        search?: string;
        perPage?: string;
        sortBy?: string;
        sortDirection?: string;
    };
}

export const DataTable = memo(function DataTable<TData extends HasId, TValue>({
    columns,
    data,
    pagination,
    filters,
}: DataTableProps<TData, TValue>) {
    const [search, setSearch] = useState(filters?.search || '');
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('users.index'),
                {
                    ...filters,
                    search,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [filters, search]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
    });

    /*
    =========================
    Bulk Actions
    =========================
    */
    const [openBulkDelete, setOpenBulkDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleBulkDelete = () => {
        const selectedIds = table
            .getSelectedRowModel()
            .rows.map((row) => row.original.id);

        if (!selectedIds.length) {
            return;
        }

        setLoadingDelete(true);
        router.post(
            route('users.bulk-delete'),
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoadingDelete(false);
                    setOpenBulkDelete(false);
                    setRowSelection({});
                },
            },
        );
    };
    /*
    =========================
    PER PAGE
    =========================
    */
    const handlePerPage = (value: string) => {
        router.get(
            route('users.index'),
            {
                ...filters,
                perPage: value,
                page: 1,
            },
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    /*
    =========================
    SORT
    =========================
    */
    const handleSort = (column: string) => {
        const params = new URLSearchParams(window.location.search);

        const currentSortBy = params.get('sortBy');
        const currentDirection = params.get('sortDirection');

        const isSameColumn = currentSortBy === column;

        let direction = 'asc';

        if (isSameColumn) {
            direction = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        router.get(
            route('users.index'),
            {
                ...filters,
                sortBy: column,
                sortDirection: direction,
                page: 1,
            },
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const renderSortIcon = (column: string) => {
        const params = new URLSearchParams(window.location.search);

        const currentSortBy = params.get('sortBy');
        const currentDirection = params.get('sortDirection');

        const isActive = currentSortBy === column;

        if (!isActive) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />;
        }

        if (currentDirection === 'asc') {
            return <ArrowUp className="ml-2 h-4 w-4" />;
        }

        return <ArrowDown className="ml-2 h-4 w-4" />;
    };

    return (
        <>
            {/* CARD CONFIRMATION */}
            {openBulkDelete && (
                <div className="fixed inset-0 z-50 items-center justify-center bg-black/50 p-4">
                    <CardConfirmation
                        loading={loadingDelete}
                        onConfirm={handleBulkDelete}
                        onCancel={() => setOpenBulkDelete(false)}
                    />
                </div>
            )}
            {/* FILTER BAR */}
            <div>
                <div className="flex items-center justify-start gap-3 bg-card py-2">
                    {/* SEARCH */}
                    <div className="flex items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64 rounded-md border px-2 py-1"
                        />
                    </div>

                    {/* PER PAGE */}
                    <div className="flex items-center gap-4">
                        <Select
                            value={filters?.perPage}
                            onValueChange={(value) => handlePerPage(value)}
                            defaultValue={String(filters?.perPage || 10)}
                        >
                            <SelectTrigger className="w-24 rounded-md border px-2 py-1">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* BULK ACTIONS */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="destructive"
                            onClick={() => setOpenBulkDelete(true)}
                            disabled={!table.getSelectedRowModel().rows.length}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={table.getIsAllRowsSelected()}
                                    onCheckedChange={(value) =>
                                        table.toggleAllRowsSelected(!!value)
                                    }
                                />
                            </TableHead>
                            {columns.map((column: any) => (
                                <TableHead
                                    key={column.accessorKey || column.id}
                                >
                                    {column.accessorKey ? (
                                        <Button
                                            variant="ghost"
                                            className="p-0 font-semibold"
                                            onClick={() =>
                                                handleSort(column.accessorKey)
                                            }
                                        >
                                            {typeof column.header === 'string'
                                                ? column.header
                                                : column.accessorKey}

                                            {renderSortIcon(column.accessorKey)}
                                        </Button>
                                    ) : (
                                        flexRender(column.header, {} as any)
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {/* CHECKBOX CELL */}
                                    <TableCell>
                                        <Checkbox
                                            checked={row.getIsSelected()}
                                            onCheckedChange={(value) =>
                                                row.toggleSelected(!!value)
                                            }
                                        />
                                    </TableCell>

                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between py-2">
                <div>
                    <span className="text-sm text-muted-foreground">
                        Showing{' '}
                        <span className="font-medium">{data.length}</span> of{' '}
                        <span className="font-medium">
                            {pagination?.total ?? data.length}
                        </span>{' '}
                        results
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="default"
                        disabled={!pagination?.prev_page_url}
                        onClick={() =>
                            pagination?.prev_page_url &&
                            router.visit(pagination.prev_page_url)
                        }
                    >
                        Previous
                    </Button>

                    <Button
                        variant="default"
                        disabled={!pagination?.next_page_url}
                        onClick={() =>
                            pagination?.next_page_url &&
                            router.visit(pagination.next_page_url)
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
});
