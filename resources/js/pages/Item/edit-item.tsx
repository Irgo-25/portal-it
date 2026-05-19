import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';

import type { Category, Departement, Item, Uom } from '@/types';
import ItemForm from './form-item';

interface editItemProps {
    item: Item;
    categories: Category[];
    departements: Departement[];
    uoms: Uom[];
}

export default function EditItem({
    item,
    categories,
    departements,
    uoms,
}: editItemProps) {
    return (
        <div className="p-4">
            <Head title="Update Item" />
            <Card className="mx-auto w-full">
                <CardContent>
                    <ItemForm
                        mode="edit"
                        initialData={{
                            item: item.id_item,
                            name: item.name,
                            category_id: item.category_id,
                            departement_id: item.departement_id,
                            uoms: [
                                {
                                    uom_id: '',
                                    is_base: true,
                                    conversion_factor: 1,
                                },
                            ],
                        }}
                        categories={categories}
                        departements={departements}
                        uoms={uoms}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

EditItem.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: route('items.index'),
        },
        {
            title: 'Edit Item',
            href: route('items.edit', { item: item.id }),
        },
    ],
};
