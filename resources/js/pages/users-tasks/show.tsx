import CommentList from '@/components/CommentList';
import { InputFile } from '@/components/InputFile';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IComment, ICordinatorTask } from '@/types/tasks-types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IStatus {
    status: string;
}

type TFileName = {
    sub_task_id?: number | null;
    name: string;
};

const Show = ({ id }: { id: number }) => {
    const [status, setStatus] = useState<IStatus[]>([
        {
            status: '',
        },
    ]);
    const [updating, setUpdating] = useState(false);
    const [sending, setSending] = useState(false);
    const [cordinatorTasks, setCordinatorTasks] = useState<ICordinatorTask[]>([]);

    const [comments, setComments] = useState<IComment[]>([
        {
            sub_task_id: null,
            comment: '',
            file_path: '',
        },
    ]);

    const [fileNames, setFileNames] = useState<TFileName[]>([
        {
            sub_task_id: null,
            name: '',
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];

    const fetchCordinatorTasks = async () => {
        const response = await axios.get(route('users-tasks.cordinator-tasks', { id: id }));
        const cordinatorTasks = response.data;
        setCordinatorTasks(response.data);
        setStatus(cordinatorTasks.map((task: ICordinatorTask) => ({ status: task.status }))); //get parent task status
        setComments(cordinatorTasks.map((task: ICordinatorTask) => ({ sub_task_id: Number(task.sub_task_id), comment: '' })));
        setFileNames(cordinatorTasks.map((task: ICordinatorTask) => ({ sub_task_id: Number(task.sub_task_id), name: '' })));
    };

    useEffect(() => {
        fetchCordinatorTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, index: number) => {
        e.preventDefault();
        setSending(true);

        try {
            const data = {
                subTaskId: comments[index].sub_task_id,
                comment: comments[index].comment,
                filePath: comments[index].file_path,
            };

            const response = await axios.post(route('users-tasks.comment'), data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchCordinatorTasks(); // fetch cordinator tasks again

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

    // handle comment
    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const { value } = e.target;
        setComments((prevComments) => {
            const updatedComments = [...prevComments];
            updatedComments[index] = { ...updatedComments[index], comment: value };
            return updatedComments;
        });
    };

    const handleUpdateStatus = async (e: FormEvent<HTMLFormElement>, index: number, cordinatorTaskId: number) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const updatedStatus = status[index].status;
            const url = route('users-tasks.update-status', { id: cordinatorTaskId });
            const response = await axios.post(url, { status: updatedStatus });
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchCordinatorTasks();
                setUpdating(false);
            }
        } catch (error) {
            console.log(error);
            setUpdating(false);
            toast.error('Something went wrong');
        }
    };

    console.log('cordinatorsTask', cordinatorTasks);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <div className="mx-auto my-5 flex h-64 w-96 flex-col gap-5 p-5 shadow-lg">
                        <div className="flex w-full justify-between">
                            <h1>Title: {cordinatorTasks[0]?.sub_task.task?.title}</h1>
                            <h1>Due: {new Date(cordinatorTasks[0]?.sub_task.task?.dead_line || '').toDateString()}</h1>
                        </div>
                        <ul className="space-y-5">
                            <li>Type: {cordinatorTasks[0]?.sub_task.task?.type}</li>
                            <li>Content: {cordinatorTasks[0]?.sub_task.task?.content}</li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {cordinatorTasks.map((cordinator_task, index) => (
                            <div key={index} className="shadow-sidebar-border p-5 shadow-lg">
                                <div className="col-span-2 flex justify-end">
                                    <form onSubmit={(e) => handleUpdateStatus(e, index, Number(cordinator_task.id))} className="flex flex-col gap-5">
                                        <Label>Status</Label>
                                        <Select
                                            value={status[index].status}
                                            onValueChange={(value) => setStatus(status.map((item, i) => (i === index ? { status: value } : item)))}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a fruit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="todo">Todo</SelectItem>
                                                    <SelectItem value="doing">Doing</SelectItem>
                                                    <SelectItem value="done">Done</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Button disabled={updating} type="submit" className="w-[180px]">
                                            {updating ? 'Updating...' : 'Update'}
                                        </Button>
                                    </form>
                                </div>
                                {/* <div className="mb-10 flex gap-5">
                                    <h2 className="font-bold">Title:</h2>
                                    <span className="font-semibold text-gray-900 first-letter:uppercase dark:text-white">
                                        {cordinator_task?.sub_task.task?.title}
                                    </span>
                                </div> */}
                                <div className="mt-5 mb-10 flex gap-5">
                                    <h2 className="font-bold">Task:</h2>
                                    <span className="text-gray-900 dark:text-white">{cordinator_task.sub_task.content}</span>
                                </div>

                                {/* comment section */}
                                <div className="">
                                    <ul className="my-5 flex flex-col gap-2 text-xs">
                                        <li>
                                            {Array.isArray(cordinator_task?.sub_task?.comments) && cordinator_task.sub_task.comments.length > 0 ? (
                                                cordinator_task.sub_task.comments.map((comment: IComment) => (
                                                    <CommentList
                                                        key={comment.id}
                                                        comment={comment}
                                                        sending={sending}
                                                        fetchCordinatorTasks={fetchCordinatorTasks}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No comments .</p>
                                            )}
                                        </li>
                                    </ul>

                                    <form onSubmit={(e) => handleSubmit(e, index)}>
                                        {comments[index] && comments[index].sub_task_id && (
                                            <Textarea
                                                required
                                                value={comments[index].comment || ''}
                                                onChange={(e) => handleCommentChange(e, index)}
                                                placeholder="write your comment"
                                            />
                                        )}
                                        <div className="mt-5 flex justify-end">
                                            <div className="flex flex-col gap-2">
                                                <InputFile
                                                    setComments={setComments}
                                                    setFileNames={setFileNames}
                                                    fileNames={fileNames}
                                                    index={index}
                                                />
                                                <Button className="px-10" disabled={sending}>
                                                    Send
                                                </Button>
                                            </div>
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
