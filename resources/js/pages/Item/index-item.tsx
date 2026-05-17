import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CardConfirmation from '@/components/card-confirmation';
import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import type { Item } from '@/types';
import { itemColumns } from './columns';

interface Props {
    items: {
        data: Item[];
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
}
export default function IndexItem({ items }: Props) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const [openDelete, setOpenDelete] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);

    /*
    =====================================
    OPEN DELETE MODAL
    =====================================
    */
    const openCardDelete = (item: Item) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    /*
    =====================================
    CONFIRM DELETE
    =====================================
    */
    const handleDelete = () => {
        if (!selectedItem) {
            return;
        }

        setLoadingDelete(true);

        router.delete(route('items.destroy', selectedItem.id_item), {
            preserveScroll: true,

            onFinish: () => {
                setLoadingDelete(false);
                setOpenDelete(false);
                setSelectedItem(null);
            },
        });
    };

    return (
        <>
            <Head title="Items" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Item</h1>

                    <Button onClick={() => router.visit(route('items.create'))}>
                        New Item
                    </Button>
                </div>

                <DataTable
                    columns={itemColumns({
                        openCardDelete,
                    })}
                    data={items.data}
                    idKey="id_item"
                    pagination={items}
                    routeName="items.index"
                    bulkDeleteRoute="items.bulk-delete"
                />
                {/* DELETE CONFIRMATION MODAL */}
                {openDelete && selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <CardConfirmation
                            title="Delete Item"
                            description={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
                            confirmationText="Delete"
                            cancelText="Cancel"
                            loading={loadingDelete}
                            onConfirm={handleDelete}
                            onCancel={() => {
                                setOpenDelete(false);
                                setSelectedItem(null);
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
IndexItem.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: route('items.index'),
        },
    ],
};
