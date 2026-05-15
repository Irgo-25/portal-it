import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CardConfirmation from '@/components/card-confirmation';
import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import type { Uom } from '@/types';
import { uomColumns } from './columns';
import UomFormDialog from './uom-form-dialog';

interface Props {
    uoms: {
        data: Uom[];
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
}
export default function IndexUom({ uoms }: Props) {
    const [openForm, setOpenForm] = useState(false);
    const [selectedUom, setSelectedUom] = useState<Uom | null>(null);

    const [openDelete, setOpenDelete] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    // OPEN EDIT MODAL
    const openCardEdit = (uom: Uom) => {
        setSelectedUom(uom);
        setOpenForm(true);
    };

    /*
    =====================================
    OPEN DELETE MODAL
    =====================================
    */
    const openCardDelete = (uom: Uom) => {
        setSelectedUom(uom);
        setOpenDelete(true);
    };

    /*
    =====================================
    CONFIRM DELETE
    =====================================
    */
    const handleDelete = () => {
        if (!selectedUom) {
            return;
        }

        setLoadingDelete(true);

        router.delete(route('uoms.destroy', selectedUom.id_uom), {
            preserveScroll: true,

            onFinish: () => {
                setLoadingDelete(false);
                setOpenDelete(false);
                setSelectedUom(null);
            },
        });
    };

    return (
        <>
            <Head title="Uoms" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Manage Unit of Measure
                    </h1>

                    <Button
                        onClick={() => {
                            setSelectedUom(null);
                            setOpenForm(true);
                        }}
                    >
                        New Uom
                    </Button>
                </div>

                <DataTable
                    columns={uomColumns({
                        openCardDelete,
                        openCardEdit,
                    })}
                    data={uoms.data}
                    idKey="id_uom"
                    pagination={uoms}
                    routeName="uoms.index"
                    bulkDeleteRoute="uoms.bulk-delete"
                />
                {/* DELETE CONFIRMATION MODAL */}
                {openDelete && selectedUom && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <CardConfirmation
                            title="Delete Uom"
                            description={`Are you sure you want to delete "${selectedUom.name}"? This action cannot be undone.`}
                            confirmationText="Delete"
                            cancelText="Cancel"
                            loading={loadingDelete}
                            onConfirm={handleDelete}
                            onCancel={() => {
                                setOpenDelete(false);
                                setSelectedUom(null);
                            }}
                        />
                    </div>
                )}
            </div>
            <UomFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                uom={selectedUom}
            />
        </>
    );
}
IndexUom.layout = {
    breadcrumbs: [
        {
            title: 'Uoms',
            href: route('uoms.index'),
        },
    ],
};
