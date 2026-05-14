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

interface DepartementFormDialogProps {
    open: boolean;
    onClose: () => void;
    departement?: {
        id_departement: number;
        name: string;
        code: string;
    } | null;
    errors: Record<string, string | string[]>;
}
export default function DepartementFormDialog({
    open,
    onClose,
    departement,
}: DepartementFormDialogProps) {
    const isEditing = !!departement;

    const [form, setForm] = useState({
        name: '',
        code: '',
    });

    const [loading, setLoading] = useState(false);
    const { errors: serverErrors } = usePage().props as {
        errors: Record<string, string>;
    };
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        if (departement) {
            setForm({
                name: departement.name,
                code: departement.code,
            });
        } else {
            setForm({
                name: '',
                code: '',
            });
        }
    };

    // fill form if edit
    useEffect(() => {
        if (departement) {
            setForm({
                name: departement.name,
                code: departement.code,
            });
        } else {
            setForm({
                name: '',
                code: '',
            });
        }
    }, [departement]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isEditing) {
            router.put(
                route('departements.update', departement!.id_departement),
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
            router.post(route('departements.store'), form, {
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
                                ? 'Edit Departement'
                                : 'Create Departement'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Edit your departement'
                                : 'Create new departement'}
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
                            placeholder="Code Departement"
                            value={form.code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    code: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.code}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-500">
                                {errors.code}
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
