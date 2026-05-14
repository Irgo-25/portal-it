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
import { Textarea } from '@/components/ui/textarea';

interface CategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    category?: {
        id_category: number;
        name: string;
        description: string;
    } | null;
    errors: Record<string, string | string[]>;
}
export default function CategoryFormDialog({
    open,
    onClose,
    category,
}: CategoryFormDialogProps) {
    const isEditing = !!category;

    const [form, setForm] = useState({
        name: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const { errors: serverErrors } = usePage().props as {
        errors: Record<string, string>;
    };
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description,
            });
        } else {
            setForm({
                name: '',
                description: '',
            });
        }
    };

    // fill form if edit
    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description,
            });
        } else {
            setForm({
                name: '',
                description: '',
            });
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isEditing) {
            router.put(
                route('categories.update', category!.id_category),
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
            router.post(route('categories.store'), form, {
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
                            {isEditing ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Edit your category'
                                : 'Create new category'}
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

                        <Textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description}
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
