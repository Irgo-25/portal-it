import { router } from '@inertiajs/react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

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
import CardConfirmation from '../card-confirmation';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DataTablePagination {
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
}

export interface DataTableFilters {
    search?: string;
    perPage?: string;
    sortBy?: string;
    sortDirection?: string;
    [key: string]: string | undefined;
}

export interface DataTableProps<
    TData,
    TValue,
    TKey extends keyof TData = 'id' extends keyof TData ? 'id' : keyof TData,
> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: DataTablePagination;
    filters?: DataTableFilters;
    /** Inertia route name untuk navigasi (e.g. "users.index") */
    routeName: string;
    /** Inertia route name untuk bulk-delete POST (e.g. "users.bulk-delete") */
    bulkDeleteRoute?: string;
    perPageOptions?: number[];
    searchDebounce?: number;
    /**
     * Nama field primary key pada TData.
     * Default: "id". Ganti jika tabel memakai nama lain, misal "id_item".
     */
    idKey?: TKey;
    onBulkDeleteSuccess?: (deletedIds: number[]) => void;
}

// ─── Inner component ─────────────────────────────────────────────────────────
// Dipisah dari memo agar generic TData, TValue, TKey tidak hilang.
// Export lewat: export const DataTable = memo(DataTableInner) as typeof DataTableInner

function DataTableInner<
    TData extends Record<string, any>,
    TValue,
    TKey extends keyof TData = keyof TData,
>({
    columns,
    data,
    pagination,
    filters,
    routeName,
    bulkDeleteRoute,
    perPageOptions = [10, 25, 50, 100],
    searchDebounce = 500,
    idKey = 'id' as TKey,
    onBulkDeleteSuccess,
}: DataTableProps<TData, TValue, TKey>) {
    // ── Search ────────────────────────────────────────────────────────────────
    const [search, setSearch] = useState(filters?.search ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route(routeName),
                { ...filters, search, page: 1 },
                { preserveState: true, replace: true },
            );
        }, searchDebounce);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // ── Row selection ─────────────────────────────────────────────────────────
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        state: { rowSelection },
        onRowSelectionChange: setRowSelection,
    });

    const selectedIds: number[] = table
        .getSelectedRowModel()
        .rows.map((row) => row.original[idKey] as number);

    // ── Bulk delete ───────────────────────────────────────────────────────────
    const [openBulkDelete, setOpenBulkDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleBulkDelete = useCallback(() => {
        if (!selectedIds.length || !bulkDeleteRoute) {
            return;
        }

        setLoadingDelete(true);
        router.post(
            route(bulkDeleteRoute),
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => onBulkDeleteSuccess?.(selectedIds),
                onFinish: () => {
                    setLoadingDelete(false);
                    setOpenBulkDelete(false);
                    setRowSelection({});
                },
            },
        );
    }, [selectedIds, bulkDeleteRoute, onBulkDeleteSuccess]);

    // ── Per page ──────────────────────────────────────────────────────────────
    const handlePerPage = useCallback(
        (value: string) => {
            router.get(
                route(routeName),
                { ...filters, perPage: value, page: 1 },
                { preserveScroll: true, replace: true },
            );
        },
        [filters, routeName],
    );

    // ── Sort ──────────────────────────────────────────────────────────────────
    const handleSort = useCallback(
        (column: string) => {
            const params = new URLSearchParams(window.location.search);
            const isSame = params.get('sortBy') === column;
            const direction =
                isSame && params.get('sortDirection') === 'asc'
                    ? 'desc'
                    : 'asc';

            router.get(
                route(routeName),
                {
                    ...filters,
                    sortBy: column,
                    sortDirection: direction,
                    page: 1,
                },
                { preserveScroll: true, replace: true },
            );
        },
        [filters, routeName],
    );

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

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Bulk-delete confirmation */}
            {openBulkDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <CardConfirmation
                        loading={loadingDelete}
                        onConfirm={handleBulkDelete}
                        onCancel={() => setOpenBulkDelete(false)}
                    />
                </div>
            )}

            {/* Filter bar */}
            <div className="flex items-center justify-start gap-3 bg-card py-2">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-md border px-2 py-1"
                />

                <Select
                    value={filters?.perPage}
                    defaultValue={String(filters?.perPage ?? 10)}
                    onValueChange={handlePerPage}
                >
                    <SelectTrigger className="w-24 rounded-md border px-2 py-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {perPageOptions.map((option) => (
                            <SelectItem key={option} value={String(option)}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {bulkDeleteRoute && (
                    <Button
                        variant="destructive"
                        onClick={() => setOpenBulkDelete(true)}
                        disabled={!selectedIds.length}
                    >
                        Delete
                    </Button>
                )}
            </div>

            {/* Table */}
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

                            {columns.map((column: any) => {
                                /**
                                 * Kolom biasa  → accessorKey (e.g. "name")
                                 * Kolom relasi → id          (e.g. "category.name")
                                 * Kolom action → tambahkan disableSorting: true
                                 */
                                const sortKey: string | undefined =
                                    column.accessorKey ?? column.id;
                                const isSortable =
                                    !!sortKey && !column.disableSorting;

                                return (
                                    <TableHead key={sortKey}>
                                        {isSortable ? (
                                            <Button
                                                variant="ghost"
                                                className="p-0 font-semibold"
                                                onClick={() =>
                                                    handleSort(sortKey)
                                                }
                                            >
                                                {typeof column.header ===
                                                'string'
                                                    ? column.header
                                                    : sortKey}
                                                {renderSortIcon(sortKey)}
                                            </Button>
                                        ) : (
                                            flexRender(column.header, {} as any)
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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

            {/* Pagination */}
            <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{data.length}</span>{' '}
                    of{' '}
                    <span className="font-medium">
                        {pagination?.total ?? data.length}
                    </span>{' '}
                    results
                </span>

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
}
export const DataTable = memo(DataTableInner) as typeof DataTableInner;
