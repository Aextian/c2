import RolesTable from '@/components/RolesTable';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

const Index = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] w-6/12 flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href={route('permissions.create')}>Create</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        <Label>Name</Label>
                        <div className="overflow-x-auto">
                            <RolesTable />
                        </div>
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
