import { TaskTable } from '@/components/tasks/TaskTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Button className="self-end" variant="outline" asChild>
                    <Link href={route('tasks.create')}>Create Task</Link>
                </Button>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <div className="max-w-86 overflow-auto md:w-full">
                        <TaskTable />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
