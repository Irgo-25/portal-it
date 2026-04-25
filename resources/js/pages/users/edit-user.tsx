import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import UserForm from './form-user';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function EditUser({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('users.update', user.id));
    };

    return (
        <>
            <Head title="Edit User" />

            <div className="max-w-2xl space-y-6 p-6">
                <h1 className="text-2xl font-bold">Edit User</h1>

                <form onSubmit={submit} className="space-y-6">
                    <UserForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        isEdit
                    />

                    <Button type="submit" disabled={processing}>
                        Update User
                    </Button>
                </form>
            </div>
        </>
    );
}

EditUser.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: route('users.index'),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
