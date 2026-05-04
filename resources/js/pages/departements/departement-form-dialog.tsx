'use-client';

import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface DepartementFormDialogProps {
    open: boolean;
    onClose: () => void;
    departement?: {
        id_departement: number;
        name: string;
        code: string;
    } | null;
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

    const resetForm = () => {
        setForm({
            name: '',
            code: '',
        });
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
    }, [departement]); // ✅ penting

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
            });
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(value) => {
                    if (!value) {
                        onClose();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit User' : 'Create User'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Code Departement"
                            value={form.code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    code: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? 'Saving...'
                                    : isEditing
                                      ? 'Update'
                                      : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
