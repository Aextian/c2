import { IComment, ICordinatorTask } from '@/types/tasks-types';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { FormEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CommentList from './CommentList';
import { InputFile } from './InputFile';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface ISubtask {
    cordinator_task: ICordinatorTask;
    fetchCordinatorTasks: () => void;
}
interface ICommentData {
    comment: string;
    file_path: string | FileList | null | File;
}

const AssignTask = ({ cordinator_task, fetchCordinatorTasks }: ISubtask) => {
    const [showComments, setShowComments] = useState(false);
    const [fileName, setFileName] = useState('');
    const [status, setStatus] = useState(cordinator_task.status);
    const [isSending, setSending] = useState(false);
    const [isUpdating, setUpdating] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [data, setData] = useState<ICommentData>({
        comment: '',
        file_path: '',
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);

        try {
            const payload = {
                subTaskId: cordinator_task.sub_task_id,
                comment: data.comment,
                filePath: data.file_path,
            };

            const response = await axios.post(route('users-tasks.comment'), payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchCordinatorTasks(); // fetch cordinator tasks again

            // clear input comment
            if (response.status === 200) {
                setData({ comment: '', file_path: '' });
                setFileName('');
                if (fileRef.current) {
                    fileRef.current.value = '';
                }
            }
            setSending(false);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setSending(false);
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setData({ ...data, comment: value });
    };

    const handleUpdateStatus = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const url = route('users-tasks.update-status', { id: cordinator_task.id });
            const response = await axios.post(url, { status: status });
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

    return (
        <div className="shadow-sidebar-border p-5 shadow-lg">
            <span className="text-xs">Created: {new Date(cordinator_task.created_at || '').toDateString()}</span>
            <div className="mt-10">
                <span className="font-bold">Title: </span>
                <span>{cordinator_task.sub_task.task?.title}</span>
            </div>
            <div className="col-span-2 flex justify-end">
                <form onSubmit={(e) => handleUpdateStatus(e)} className="flex flex-col items-end justify-end gap-5">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value)}>
                        <SelectTrigger className="] w-[100px]">
                            <SelectValue placeholder="Please Select Status" />
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
                    <Button disabled={isUpdating} type="submit" className="] w-[100px]">
                        {isUpdating ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </div>

            <div className="mt-5 mb-10 flex gap-5">
                <h2 className="font-bold">Task:</h2>
                <span className="text-gray-900 dark:text-white">{cordinator_task.sub_task.content}</span>
            </div>

            {/* comment section */}
            <div className="">
                <div className="my-5 flex items-center gap-2 font-bold hover:cursor-pointer" onClick={() => setShowComments(!showComments)}>
                    <p>Comments</p>
                    <span>{showComments ? <ChevronDown /> : <ChevronUp />}</span>
                </div>
                {showComments && (
                    <ul className="my-5 flex flex-col gap-2 text-xs">
                        <li>
                            {Array.isArray(cordinator_task?.sub_task?.comments) && cordinator_task.sub_task.comments.length > 0 ? (
                                cordinator_task.sub_task.comments.map((comment: IComment) => (
                                    <CommentList key={comment.id} comment={comment} sending={isSending} fetchCordinatorTasks={fetchCordinatorTasks} />
                                ))
                            ) : (
                                <p className="text-gray-500">No comments .</p>
                            )}
                        </li>
                    </ul>
                )}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Textarea required value={data.comment || ''} onChange={(e) => handleCommentChange(e)} placeholder="write your comment" />
                    <div className="mt-5 flex justify-center md:justify-end">
                        <div className="flex flex-col gap-2">
                            <InputFile setData={setData} setFileName={setFileName} fileRef={fileRef} fileName={fileName} />
                            <Button className="px-10" disabled={isSending}>
                                Send
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTask;
