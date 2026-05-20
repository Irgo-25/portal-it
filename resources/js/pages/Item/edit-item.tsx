import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';
import type { Category, Departement, Item, Uom } from '@/types';
import ItemForm from './form-item';

interface EditItemProps {
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
}: EditItemProps) {
    return (
        <div className="p-4">
            <Head title="Update Item" />
            <Card className="mx-auto w-full">
                <CardContent>
                    <ItemForm
                        mode="edit"
                        itemId={item.id_item}
                        initialData={{
                            code: item.code,
                            name: item.name,
                            category_id: String(item.category_id),
                            departement_id: String(item.departement_id),
                            uoms: (item.item_uoms ?? []).map((uom) => ({
                                uom_id: String(uom.uom_id),
                                is_base: uom.is_base,
                                conversion_factor: uom.conversion_factor,
                            })),
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
            href: route('items.edit', { id: 0 }),
        },
    ],
};
