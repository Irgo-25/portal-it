import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CardConfirmation from '@/components/card-confirmation';
import { DataTable } from '@/components/DataTable/data-table-departement';
import { Button } from '@/components/ui/button';
import type { Departement } from '@/types';
import { departementColumns } from './columns';
import DepartementFormDialog from './departement-form-dialog';

interface Props {
    departements: {
        data: Departement[];
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
}
export default function IndexDepartement({ departements }: Props) {
    const [openForm, setOpenForm] = useState(false);
    const [selectedDepartement, setSelectedDepartement] =
        useState<Departement | null>(null);

    const [openDelete, setOpenDelete] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    // OPEN EDIT MODAL
    const openCardEdit = (departement: Departement) => {
        setSelectedDepartement(departement);
        setOpenForm(true);
    };

    /*
    =====================================
    OPEN DELETE MODAL
    =====================================
    */
    const openCardDelete = (departement: Departement) => {
        setSelectedDepartement(departement);
        setOpenDelete(true);
    };

    /*
    =====================================
    CONFIRM DELETE
    =====================================
    */
    const handleDelete = () => {
        if (!selectedDepartement) {
            return;
        }

        setLoadingDelete(true);

        router.delete(
            route('departements.destroy', selectedDepartement.id_departement),
            {
                preserveScroll: true,

                onFinish: () => {
                    setLoadingDelete(false);
                    setOpenDelete(false);
                    setSelectedDepartement(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Departements" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Departement Management
                    </h1>

                    <Button
                        onClick={() => {
                            setSelectedDepartement(null);
                            setOpenForm(true);
                        }}
                    >
                        New Departement
                    </Button>
                </div>

                <DataTable
                    columns={departementColumns({
                        openCardDelete,
                        openCardEdit,
                    })}
                    data={departements.data}
                    pagination={departements}
                />
                {/* DELETE CONFIRMATION MODAL */}
                {openDelete && selectedDepartement && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <CardConfirmation
                            title="Delete User"
                            description={`Are you sure you want to delete "${selectedDepartement.name}"? This action cannot be undone.`}
                            confirmationText="Delete"
                            cancelText="Cancel"
                            loading={loadingDelete}
                            onConfirm={handleDelete}
                            onCancel={() => {
                                setOpenDelete(false);
                                setSelectedDepartement(null);
                            }}
                        />
                    </div>
                )}
            </div>
            <DepartementFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                departement={selectedDepartement}
            />
        </>
    );
}
