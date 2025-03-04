import { Chart } from '@/components/Chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { TPermission } from '@/types/permission';
import { ITask } from '@/types/tasks-types';
import { hasPermissions } from '@/utils/permissionUtils';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ tasks }: { tasks: ITask[] }) {
    const { permissions } = usePage<TPermission>().props;

    const CHART_VIEW = ['chart-view'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="-min grid gap-4 md:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video rounded-xl border p-5">
                        <h1 className="text-lg font-bold">Todo</h1>
                        <ul className="mx-5 mt-5 flex list-disc flex-col gap-5 text-xs text-gray-500">
                            {tasks
                                .filter((task) => task.status === 'todo')
                                .map((task) => (
                                    <li className="flex items-center justify-between">
                                        <span className="truncate first-letter:uppercase">{task.title}</span>
                                        <Badge variant="outline" asChild>
                                            <Link href={route('users-tasks.show', task.id)}>View</Link>
                                        </Badge>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video rounded-xl border p-5">
                        <h1 className="text-lg font-bold">Doing</h1>
                        <ul className="mx-5 mt-5 flex list-disc flex-col gap-5 text-xs text-gray-500">
                            {tasks
                                .filter((task) => task.status === 'doing')
                                .map((task) => (
                                    <li className="flex items-center justify-between">
                                        <span className="truncate first-letter:uppercase">{task.title}</span>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video rounded-xl border p-5">
                        <h1 className="text-lg font-bold">Done</h1>
                        <ul className="mx-5 mt-5 flex list-disc flex-col gap-5 text-xs text-gray-500">
                            {tasks
                                .filter((task) => task.status === 'done')
                                .map((task) => (
                                    <li className="flex items-center justify-between">
                                        <span className="truncate first-letter:uppercase">{task.title}</span>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </li>
                                ))}
                        </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video rounded-xl border p-5">
                        <h1 className="text-lg font-bold">Cancelled</h1>
                        <ul className="mx-5 mt-5 flex list-disc flex-col gap-5 text-xs text-gray-500">
                            {tasks
                                .filter((task) => task.status === 'cancelled')
                                .map((task) => (
                                    <li className="flex items-center justify-between">
                                        <span className="truncate first-letter:uppercase">{task.title}</span>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </li>
                                ))}
                        </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                </div>
                {hasPermissions(permissions, CHART_VIEW) && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                        <Chart />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
