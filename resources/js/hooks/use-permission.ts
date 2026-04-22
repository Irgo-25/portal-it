import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { props }: any = usePage();
    const permissions: string[] = props.auth?.permissions || [];
    const can = (permission?: string) => {
        if (!permission) {
            return true;
        }

        return permissions.includes(permission);
    };
    
    return { can };
}
