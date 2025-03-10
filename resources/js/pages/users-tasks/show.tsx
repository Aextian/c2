import SubTask from '@/components/SubTask';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ICordinatorTask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Show = ({ id }: { id: number }) => {
    const [cordinatorTasks, setCordinatorTasks] = useState<ICordinatorTask[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Task',
            href: '/tasks',
        },
    ];

    const title = cordinatorTasks[0]?.sub_task.task?.type;
    const content = cordinatorTasks[0]?.sub_task.task?.content;
    const due = cordinatorTasks[0]?.sub_task.task?.dead_line;

    const fetchCordinatorTasks = async () => {
        const response = await axios.get(route('users-tasks.cordinator-tasks', { id: id }));
        const cordinatorTasks = response.data;
        setCordinatorTasks(cordinatorTasks);
    };

    useEffect(() => {
        fetchCordinatorTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl md:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="mx-auto my-5 flex min-h-64 flex-col gap-5 p-5 shadow-lg md:min-w-96">
                        <div className="flex justify-end">
                            <h1 className="text-xs md:text-xs">
                                <span className="font-bold">Due: </span>
                                {new Date(due || '').toDateString()}
                            </h1>
                        </div>
                        <h1>
                            <span className="font-bold">Title: </span>
                            {cordinatorTasks[0]?.sub_task.task?.title}
                        </h1>
                        <ul className="space-y-5">
                            <li>
                                <span>Type: </span>
                                <Badge variant={title === 'important' ? 'warning' : title === 'urgent' ? 'destructive' : 'default'}>
                                    <span className="first-letter:uppercase">{cordinatorTasks[0]?.sub_task.task?.type}</span>
                                </Badge>
                            </li>
                            <li>
                                <span className="font-bold">Content: </span>
                                <p className="text-xs">{content}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {cordinatorTasks.map((cordinator_task) => (
                            <SubTask key={cordinator_task.id} fetchCordinatorTasks={fetchCordinatorTasks} cordinator_task={cordinator_task} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;
