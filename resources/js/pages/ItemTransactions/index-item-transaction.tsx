import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
export default function IndexItemTransactions() {
    return (
        <>
            <Head title="Item Transactions" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Item Transactions</h1>

                    <Button onClick={() => router.visit(route('item-transactions.create'))}>
                        New Transactions
                    </Button>
                </div>
            </div>
        </>
    );
}
IndexItemTransactions.layout = {
    breadcrumbs: [
        {
            title: 'Item Transactions',
            href: route('item-transactions.index'),
        },
    ],
};
