import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';

import type { Category, Uom } from '@/types';
import ItemForm from './form-item';

interface createItemProps {
    item_code: string;
    categories: Category[];
    uoms: Uom[];
}

export default function CreateItem({
    item_code,
    categories,
    uoms,
}: createItemProps) {
    return (
        <div className="p-4">
            <Head title="Create Item" />
            <Card className="mx-auto w-full">
                <CardContent>
                    <ItemForm
                        mode="create"
                        initialData={{
                            item_code,
                            name: '',
                            category_id: '',
                            uoms: [
                                {
                                    uom_id: '',
                                    is_base: true,
                                    conversion_factor: 1,
                                },
                            ],
                        }}
                        categories={categories}
                        uoms={uoms}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

CreateItem.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: route('items.index'),
        },
        {
            title: 'Create Item',
            href: route('items.create'),
        },
    ],
};
