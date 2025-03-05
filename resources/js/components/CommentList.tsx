import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IComment } from '@/types/tasks-types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface CommentListProps {
    comment: IComment;
    sending: boolean;
    fetchCordinatorTasks: () => void;
}
export type TReply = {
    content: string;
    file_path?: string | null | File;
};

const CommentList = ({ comment, sending, fetchCordinatorTasks }: CommentListProps) => {
    const [showReply, setShowReply] = useState(false);
    const [viewReply, setViewReply] = useState(false);
    const { post, data, setData, clearErrors, reset } = useForm<TReply>({
        content: '',
        file_path: '',
    });

    console.log('data', data);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, commentId?: number) => {
        e.preventDefault();
        const url = route('reply-comment.store', commentId);
        post(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                fetchCordinatorTasks();
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                reset(), clearErrors();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const replies = viewReply ? comment.replies : comment.replies?.slice(0, 1);

    const handleDownload = async (filePath: string) => {
        const response = await axios.get(route('download'), {
            params: { file_path: filePath },
            responseType: 'blob', // Ensures the browser treats it as a file
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath.split('/').pop() || 'downloaded_file');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="mb-2">
                <p>
                    <span className="font-bold tracking-widest">{comment.user?.name}:</span> {comment.comment}
                </p>
                {comment.file_path && (
                    <Badge className="mt-2 hover:cursor-pointer" variant={'outline'} onClick={() => handleDownload(comment.file_path as string)}>
                        Download File
                    </Badge>
                )}
                <button className="mt-2 ml-10 text-blue-500 hover:underline" onClick={() => setShowReply(!showReply)}>
                    Reply
                </button>
                {replies?.map((reply) => (
                    <p key={reply.id} className="mx-10 mt-4">
                        <span className="font-bold tracking-widest">{reply.user?.name}</span>: {reply.content}
                    </p>
                ))}
                {comment.replies?.length !== undefined && comment.replies.length > 1 && !viewReply && (
                    <button className="ml-10 text-blue-500 hover:underline" onClick={() => setViewReply(true)}>
                        View or more replies
                    </button>
                )}
                {showReply && (
                    <form className="mx-10 mt-5" onSubmit={(e) => handleSubmit(e, comment.id)}>
                        <Textarea value={data.content} onChange={(e) => setData('content', e.target.value)} placeholder="Enter your reply..." />
                        <div className="mt-5 flex flex-col justify-end gap-2">
                            {/* <FileReply setData={setData} /> */}

                            <Button className="self-end px-10" disabled={sending}>
                                Send
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default CommentList;
