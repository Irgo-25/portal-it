import { route } from 'ziggy-js';
export default function IndexItemTransactions() {
    return <div>IndexItemTransactions</div>;
}
IndexItemTransactions.layout = {
    breadcrumbs: [
        {
            title: 'Item Transactions',
            href: route('item-transactions.index'),
        },
    ],
};
