import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    const { props } = usePage();
    const flash = props.flash as
        | {
              success?: string;
              error?: string;
          }
        | undefined;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [props]);
}
