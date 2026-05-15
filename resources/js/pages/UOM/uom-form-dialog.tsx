'use-client';

import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface UomFormDialogProps {
    open: boolean;
    onClose: () => void;
    uom?: {
        id_uom: number;
        name: string;
        symbol: string;
    } | null;
    errors: Record<string, string | string[]>;
}
export default function UomFormDialog({
    open,
    onClose,
    uom,
}: UomFormDialogProps) {
    const isEditing = !!uom;

    const [form, setForm] = useState({
        name: '',
        symbol: '',
    });

    const [loading, setLoading] = useState(false);
    const { errors: serverErrors } = usePage().props as {
        errors: Record<string, string>;
    };
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        if (uom) {
            setForm({
                name: uom.name,
                symbol: uom.symbol,
            });
        } else {
            setForm({
                name: '',
                symbol: '',
            });
        }
    };

    // fill form if edit
    useEffect(() => {
        if (uom) {
            setForm({
                name: uom.name,
                symbol: uom.symbol,
            });
        } else {
            setForm({
                name: '',
                symbol: '',
            });
        }
    }, [uom]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isEditing) {
            router.put(
                route('uoms.update', uom!.id_uom),
                form,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setLoading(false);
                        resetForm();
                        onClose();
                    },
                    onError: () => {
                        setLoading(false);
                    },
                },
            );
        } else {
            router.post(route('uoms.store'), form, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    resetForm();
                    onClose();
                },
                onError: () => {
                    setLoading(false);
                },
            });
        }
    };

    useEffect(() => {
        setErrors(serverErrors);
    }, [serverErrors]);

    const handleCancel = () => {
        resetForm();
        setErrors({});
        onClose();
        setLoading(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(value) => {
                    if (!value) {
                        handleCancel();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Edit Uom'
                                : 'Create Uom'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Edit your uom'
                                : 'Create new uom'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Name"
                            autoFocus
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}

                        <Input
                            placeholder="Code Uom"
                            value={form.symbol}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    symbol: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.symbol}
                        />
                        {errors.symbol && (
                            <p className="text-sm text-red-500">
                                {errors.symbol}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <Spinner className="h-5 w-5" />
                                ) : isEditing ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
