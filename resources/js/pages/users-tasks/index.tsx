import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ICordinatorTask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
interface IProps {
    cordinator_tasks: ICordinatorTask[];
}
interface IComment {
    subTaskId: number | null;
    comment: string;
}
const Index = ({ cordinator_tasks }: IProps) => {
    const [comments, setComments] = useState<IComment[]>([
        {
            subTaskId: null,
            comment: '',
        },
    ]);

    useEffect(() => {
        setComments(cordinator_tasks.map((task) => ({ subTaskId: Number(task.sub_task_id), comment: '' })));
    }, [cordinator_tasks]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, index: number) => {
        e.preventDefault();
        const data = {
            subTaskId: comments[index].subTaskId,
            comments: comments[index].comment,
        };
        await axios.post(route('tasks.store'), data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="grid grid-cols-2 gap-5">
                        {cordinator_tasks.map((task, index) => (
                            <div className="shadow-sidebar-border p-5 shadow-lg">
                                <div className="mb-10 flex gap-5">
                                    <h2 className="font-semibold">Task:</h2>
                                    <span className="text-slate-600">{task.sub_task.content}</span>
                                </div>

                                {/* comment section */}
                                <div className="">
                                    <ul className="flex flex-col gap-2">
                                        <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat, ipsam.</li>
                                        <li>Lorem ipsum dolor sit amet.</li>
                                        <li>Lorem ipsum dolor sit amet.</li>
                                        <li>Lorem ipsum dolor sit amet.</li>
                                    </ul>
                                    <form onSubmit={(e) => handleSubmit(e, index)}>
                                        <Textarea
                                            value={comments[index].comment}
                                            onChange={(e) => (comments[index].comment = e.target.value)}
                                            placeholder="write your comment"
                                        />
                                        <div className="mt-5 flex justify-end">
                                            <Button className="px-10">Send</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
