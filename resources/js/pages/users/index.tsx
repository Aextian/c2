import UsersTable from '@/components/UsersTable';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const index = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Link href={route('users.create')} className="bg-primary self-end rounded-md px-4 py-2 text-black">
                    Create User
                </Link>
                <UsersTable />
            </div>
        </AppLayout>
    );
};

export default index;
