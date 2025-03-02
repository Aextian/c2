import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IComment, ICordinatorTask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
interface IProps {
    cordinator_tasks: ICordinatorTask[];
}

const Index = ({ cordinator_tasks }: IProps) => {
    const [comments, setComments] = useState<IComment[]>([
        {
            sub_task_id: null,
            comment: '',
        },
    ]);

    useEffect(() => {
        setComments(cordinator_tasks.map((task) => ({ sub_task_id: Number(task.sub_task_id), comment: '' })));
    }, [cordinator_tasks]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, index: number) => {
        e.preventDefault();
        try {
            const data = {
                subTaskId: comments[index].sub_task_id,
                comment: comments[index].comment,
            };
            const response = await axios.post(route('users-tasks.comment'), data);
            console.log('response', response);
            if (response.status === 200) {
                // toast.success('Comment added successfully');
                setComments((prevComments) => {
                    const updatedComments = [...prevComments];
                    updatedComments[index] = { ...updatedComments[index], comment: '' };
                    return updatedComments;
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
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
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="grid grid-cols-2 gap-5">
                        {cordinator_tasks.map((cordinator_task, index) => (
                            <div key={index} className="shadow-sidebar-border p-5 shadow-lg">
                                <div className="mb-10 flex gap-5">
                                    <h2 className="font-bold">Title:</h2>
                                    <span className="font-semibold text-gray-900 first-letter:uppercase dark:text-white">
                                        {cordinator_task?.sub_task.task?.title}
                                    </span>
                                </div>
                                <div className="mb-10 flex gap-5">
                                    <h2 className="font-bold">Task:</h2>
                                    <span className="text-gray-900 dark:text-white">{cordinator_task.sub_task.content}</span>
                                </div>

                                {/* comment section */}
                                <div className="">
                                    <ul className="my-5 flex flex-col gap-2 text-xs">
                                        <li>
                                            {Array.isArray(cordinator_task?.sub_task?.comments) && cordinator_task.sub_task.comments.length > 0 ? (
                                                cordinator_task.sub_task.comments.map((comment: IComment) => (
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
                                        {comments[index] && comments[index].sub_task_id && (
                                            <Textarea
                                                value={comments[index].comment || ''}
                                                onChange={(e) => handleCommentChange(e, index)}
                                                placeholder="write your comment"
                                            />
                                        )}
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
