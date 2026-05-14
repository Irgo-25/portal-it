import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CardConfirmation from '@/components/card-confirmation';
import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';
import CategoryFormDialog from './category-form-dialog';
import { categoryColumns } from './columns';

interface Props {
    categories: {
        data: Category[];
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
}
export default function IndexCategory({ categories }: Props) {
    const [openForm, setOpenForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );

    const [openDelete, setOpenDelete] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    // OPEN EDIT MODAL
    const openCardEdit = (category: Category) => {
        setSelectedCategory(category);
        setOpenForm(true);
    };

    /*
    =====================================
    OPEN DELETE MODAL
    =====================================
    */
    const openCardDelete = (category: Category) => {
        setSelectedCategory(category);
        setOpenDelete(true);
    };

    /*
    =====================================
    CONFIRM DELETE
    =====================================
    */
    const handleDelete = () => {
        if (!selectedCategory) {
            return;
        }

        setLoadingDelete(true);

        router.delete(
            route('categories.destroy', selectedCategory.id_category),
            {
                preserveScroll: true,

                onFinish: () => {
                    setLoadingDelete(false);
                    setOpenDelete(false);
                    setSelectedCategory(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Categorys" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Category</h1>

                    <Button
                        onClick={() => {
                            setSelectedCategory(null);
                            setOpenForm(true);
                        }}
                    >
                        New Category
                    </Button>
                </div>

                <DataTable
                    columns={categoryColumns({
                        openCardDelete,
                        openCardEdit,
                    })}
                    data={categories.data}
                    pagination={categories}
                    routeName="categories.index"
                    bulkDeleteRoute="categories.bulk-delete"
                    idKey="id_category"
                />
                {/* DELETE CONFIRMATION MODAL */}
                {openDelete && selectedCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <CardConfirmation
                            title="Delete Category"
                            description={`Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`}
                            confirmationText="Delete"
                            cancelText="Cancel"
                            loading={loadingDelete}
                            onConfirm={handleDelete}
                            onCancel={() => {
                                setOpenDelete(false);
                                setSelectedCategory(null);
                            }}
                        />
                    </div>
                )}
            </div>
            <CategoryFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                category={selectedCategory}
            />
        </>
    );
}
IndexCategory.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: route('categories.index'),
        },
    ],
};
