import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';
export default function CreateItemTransaction() {
    return (
        <div className="p-4">
            <Head title="Create Item Transaction" />
            <Card className="mx-auto w-full">
                <CardContent></CardContent>
            </Card>
        </div>
    );
}
CreateItemTransaction.layout = () => ({
    breadcrumbs: [
        {
            title: 'Item Transactions',
            href: route('item-transactions.index'),
        },
        {
            title: 'Create Item Transaction',
            href: route('item-transactions.create'),
        },
    ],
});
