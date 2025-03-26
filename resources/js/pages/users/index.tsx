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
            <div className="h-ful flex max-w-screen flex-1 flex-col gap-4 rounded-xl p-4 md:w-8/12">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <div className="m-5 flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href={route('users.create')}>Create User</Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto md:w-full">
                        <UsersTable />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default index;
