import InputError from '@/components/input-error';
import RolesTable from '@/components/RolesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface IRole {
    id: number;
    name: string;
}
interface IProps extends Record<string, unknown> {
    roles: IRole[];
    success?: string;
    permissions: string[];
}

const Index = () => {
    const { roles } = usePage<IProps>().props;

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
            <Head title="permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link href={route('permissions.create')}>Create</Link>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <Label>Name</Label>
                        <Input onChange={handleChange} value={data.name} type="text" name="name" />
                        <InputError message={errors.name} />
                        <div className="overflow-x-auto">
                            <RolesTable />
                        </div>

                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
