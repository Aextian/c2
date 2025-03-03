import { Button } from '@/components/ui/button';
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
                <Button className='self-end' variant="outline" asChild>
                <Link href={route('users.create')} >
                    Create User
                </Link>
                </Button>
                <UsersTable />
            </div>
        </AppLayout>
    );
};

export default index;
