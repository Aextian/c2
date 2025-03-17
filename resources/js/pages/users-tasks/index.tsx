import AssignTask from '@/components/AssignedTask';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ICordinatorTask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Index = () => {
    const [isLoading, setLoading] = useState(true);
    const [cordinatorTasks, setCordinatorTasks] = useState<ICordinatorTask[]>([]);
    const [filterCoordinators, setfilterCoordinators] = useState<ICordinatorTask[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    const fetchCordinatorTasks = async () => {
        setLoading(true);
        const response = await axios.get(route('user-tasks'));
        const cordinatorTasks = response.data;
        setCordinatorTasks(cordinatorTasks);
        setfilterCoordinators(cordinatorTasks);
        setLoading(false);
    };

    useEffect(() => {
        fetchCordinatorTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = (value: string) => {
        if (value === 'all') {
            setfilterCoordinators(cordinatorTasks); // Show all when "all" is selected
        } else {
            const filterCoordinators = cordinatorTasks.filter((cordinatorTask) => cordinatorTask.status === value);
            setfilterCoordinators(filterCoordinators);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min md:p-10">
                    <div className="mb-10">
                        <Select onValueChange={(e) => handleFilter(e)} defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="todo">Todo</SelectItem>
                                <SelectItem value="doing">Doing</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {filterCoordinators.map((cordinator_task) => (
                            <AssignTask key={cordinator_task.id} cordinator_task={cordinator_task} fetchCordinatorTasks={fetchCordinatorTasks} />
                        ))}
                    </div>
                    {isLoading ? (
                        <div className="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2">
                            <Skeleton className="h-[600px] w-full rounded-xl" />
                            <Skeleton className="h-[600px] w-full rounded-xl" />
                        </div>
                    ) : (
                        cordinatorTasks.length === 0 && <p className="text-2xl font-semibold text-gray-900 dark:text-white">No tasks</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
