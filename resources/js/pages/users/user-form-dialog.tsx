'use-client';

import { router } from '@inertiajs/react';
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

interface userFormDialogProps {
    open: boolean;
    onClose: () => void;
    user?: {
        id: number;
        name: string;
        email: string;
        password: string;
    } | null;
}
export default function UserFormDialog({
    open,
    onClose,
    user,
}: userFormDialogProps) {
    const isEditing = !!user;

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: '',
            });
        } else {
            setForm({
                name: '',
                email: '',
                password: '',
            });
        }
    };

    // fill form if edit
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: '',
            });
        } else {
            setForm({
                name: '',
                email: '',
                password: '',
            });
        }
    }, [user?.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isEditing) {
            router.put(route('users.update', user!.id), form, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    resetForm();
                    onClose();
                },
            });
        } else {
            router.post(route('users.store'), form, {
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
                            {isEditing ? 'Edit user' : 'Create user'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Edit your user' : 'Create new user'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Name"
                            autoFocus
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value,
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
                                {loading ? (
                                    <Spinner className="h-5 w-5" />
                                ) : isEditing ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
