import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';
import type { Category, Item, Uom } from '@/types';
import ItemForm from './form-item';

interface EditItemProps {
    item: Item;
    categories: Category[];
    uoms: Uom[];
}

export default function EditItem({ item, categories, uoms }: EditItemProps) {
    return (
        <div className="p-4">
            <Head title="Update Item" />
            <Card className="mx-auto w-full">
                <CardContent>
                    <ItemForm
                        mode="edit"
                        itemId={item.id_item}
                        initialData={{
                            item_code: item.item_code,
                            name: item.name,
                            category_id: String(item.category_id),
                            uoms: (item.item_uoms ?? []).map((uom) => ({
                                uom_id: String(uom.uom_id),
                                is_base: uom.is_base,
                                conversion_factor: uom.conversion_factor,
                            })),
                        }}
                        categories={categories}
                        uoms={uoms}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

EditItem.layout = () => ({
    breadcrumbs: [
        { title: 'Items', href: route('items.index') },
        {
            title: 'Edit Item',
        },
    ],
});
