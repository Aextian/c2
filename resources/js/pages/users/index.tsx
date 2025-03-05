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
            <div className="flex h-full w-6/12 flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href={route('users.create')}>Create User</Link>
                        </Button>
                    </div>
                    <UsersTable />
                </div>
            </div>
        </AppLayout>
    );
};

export default index;
