import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const index = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { post, setData, data, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('users.store'));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <Label>Name</Label>
                        <Input onChange={handleChange} value={data.name} type="text" name="name" />
                        <InputError message={errors.name} />
                        <Label>Email</Label>
                        <Input name="email" onChange={handleChange} value={data.email} />
                        <InputError message={errors.email} />

                        <Label>Password</Label>
                        <Input type="password" name="password" onChange={handleChange} value={data.password} />
                        <InputError message={errors.password} />

                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default index;
