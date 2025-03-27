import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SharedData } from '@/types';
import { IComment } from '@/types/tasks-types';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import CommentDelete from './CommentDelete';
import CommentEdit from './CommentEdit';
import DeleteReplyComment from './DeleteReplyComment';
import EditReplyComment from './EditReplyComment';
import { FileReply } from './FileReply';
import { Badge } from './ui/badge';

interface CommentListProps {
    comment: IComment;
    sending: boolean;
    fetchCordinatorTasks: () => void;
}
export type TReply = {
    content?: string;
    file_path?: string | null | File;
};

const CommentList = ({ comment, sending, fetchCordinatorTasks }: CommentListProps) => {
    const { auth } = usePage<SharedData>().props;
    const userId = auth.user.id;
    const [showReply, setShowReply] = useState(false);
    const [viewReply, setViewReply] = useState(false);
    const [fileName, setFileName] = useState('');

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { post, data, setData, clearErrors, reset, processing } = useForm<TReply>({
        content: '',
        file_path: '',
    });

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
                if (fileRef.current) {
                    fileRef.current.value = '';
                    setFileName('');
                }
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
                    <Badge
                        className="mt-2 text-[10px] hover:cursor-pointer"
                        variant={'outline'}
                        onClick={() => handleDownload(comment.file_path as string)}
                    >
                        Download File
                    </Badge>
                )}
                <Badge
                    variant="outline"
                    onClick={() => setShowReply(!showReply)}
                    className="mt-2 ml-10 text-[10px] text-blue-500 hover:cursor-pointer"
                >
                    Reply
                </Badge>
                {comment.user?.id === auth.user.id && (
                    <>
                        <CommentEdit comment={comment} fetchCordinatorTasks={fetchCordinatorTasks} />
                        <CommentDelete comment={comment} fetchCordinatorTasks={fetchCordinatorTasks} />
                    </>
                )}

                {replies?.map((reply) => (
                    <div className="mx-10 mt-5" key={reply.id}>
                        <p>
                            <span className="font-bold tracking-widest">{reply.user?.name}</span>: {reply.content}
                        </p>
                        {reply.user?.id === auth.user.id && (
                            <>
                                <EditReplyComment commentReply={reply} fetchCordinatorTasks={fetchCordinatorTasks} />

                                <DeleteReplyComment commentReply={reply} fetchCordinatorTasks={fetchCordinatorTasks} />
                            </>
                        )}
                        {reply.file_path && (
                            <Badge
                                className="mt-2 ml-5 text-[10px] hover:cursor-pointer"
                                variant={'outline'}
                                onClick={() => handleDownload(reply.file_path as string)}
                            >
                                Download File
                            </Badge>
                        )}
                    </div>
                ))}
                {comment.replies?.length !== undefined && comment.replies.length > 1 && !viewReply && (
                    <button className="mt-5 ml-10 text-blue-500 hover:underline" onClick={() => setViewReply(true)}>
                        View or more replies
                    </button>
                )}
                {showReply && (
                    <form className="mx-10 mt-5" onSubmit={(e) => handleSubmit(e, comment.id)}>
                        <Textarea
                            value={data.content}
                            onChange={(e) => setData((prevData) => ({ ...prevData, content: e.target.value }))}
                            placeholder="Enter your reply..."
                            required
                        />
                        <div className="mt-5 flex flex-col items-end justify-end gap-2">
                            <FileReply fileRef={fileRef} setData={setData} setFileName={setFileName} fileName={fileName} />
                            <Button className="self-end px-10" disabled={sending || processing}>
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
