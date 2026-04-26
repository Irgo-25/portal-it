import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import UserForm from './form-user';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });


    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <>
            <Head title="Create User" />
            <div className="max-w-3xl space-y-4 p-4">
                <h1 className="mb-4 text-2xl font-bold">Create User</h1>
                <form onSubmit={submit} className="space-y-4">
                    <UserForm data={data} setData={setData} errors={errors} />
                    <Button type="submit" disabled={processing}>
                        Create User
                    </Button>
                </form>
            </div>
        </>
    );
}
CreateUser.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: route('users.index'),
        },
        {
            title: 'Create User',
            href: route('users.create'),
        },
    ],
};
