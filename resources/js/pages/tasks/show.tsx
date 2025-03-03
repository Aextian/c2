import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IComment, ICordinatorTask, ISubTask, ITask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Show = ({id}:{id: number}) => {
    const [sending, setSending] = useState(false);
    const [subTasks, setSubTasks] = useState<ISubTask[]>([]);
    const [comments, setComments] = useState<IComment[]>([
        {
            sub_task_id: null,
            comment: '',
        },
    ]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    const fetchCordinatorTasks = async (id: number) => {
        const response = await axios.get(route('get-task', {id: id}));
        const task:ITask = response.data;
        setSubTasks(task?.sub_tasks || []);
        setComments(task.sub_tasks?.map((subTask:ISubTask) => ({ sub_task_id: subTask.id, comment: '' })) || []);
    }

    useEffect(() => {
        fetchCordinatorTasks(id);
    }, [id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, index: number) => {
        e.preventDefault();
        setSending(true);
        try {
            const data = {
                subTaskId: comments[index].sub_task_id,
                comment: comments[index].comment,
            };
            const response = await axios.post(route('users-tasks.comment'), data);
            fetchCordinatorTasks(id); // fetch cordinator tasks again
            // clear input comment
            if (response.status === 200) {
                setComments((prevComments) => {
                    const updatedComments = [...prevComments];
                    updatedComments[index] = { ...updatedComments[index], comment: '' };
                    return updatedComments;
                });
            }
            setSending(false);

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setSending(false);
        }
    };

    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const { value } = e.target;
        setComments((prevComments) => {
            const updatedComments = [...prevComments];
            updatedComments[index] = { ...updatedComments[index], comment: value };
            return updatedComments;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="task" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="grid grid-cols-2 gap-5">
                        {subTasks.map((subTask, index) => (
                            <div key={index} className="shadow-sidebar-border p-5 shadow-lg">
                                <div className="mb-10 flex gap-5">
                                    <h2 className="font-bold">Title:</h2>
                                    <span className="font-semibold text-gray-900 first-letter:uppercase dark:text-white">
                                        {subTask.task?.title}
                                    </span>
                                </div>
                                <div className="mb-10 flex gap-5">
                                    <h2 className="font-bold">Task:</h2>
                                    <span className="text-gray-900 dark:text-white">{subTask.content}</span>
                                </div>

                                {/* comment section */}
                                <div className="">
                                    <ul className="my-5 flex flex-col gap-2 text-xs">
                                        <li>
                                            {Array.isArray(subTask?.comments) && subTask.comments.length > 0 ? (
                                                subTask.comments.map((comment: IComment) => (
                                                    <div key={comment.id} className="mb-2">
                                                        <span className="font-bold tracking-widest">{comment.user?.name || 'Unknown User'}:</span>{' '}
                                                        {comment.comment}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No comments .</p>
                                            )}
                                        </li>
                                    </ul>
                                    <form onSubmit={(e) => handleSubmit(e, index)}>
                                        { comments[index] && comments[index].sub_task_id && (
                                            <Textarea
                                                value={comments[index].comment || ''}
                                                onChange={(e) => handleCommentChange(e, index)}
                                                placeholder="write your comment"
                                            />
                                        )}
                                        <div className="mt-5 flex justify-end">
                                            <Button className="px-10" disabled={sending} >Send</Button>
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

export default Show;
