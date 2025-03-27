import { IComment } from '@/types/tasks-types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface IProps {
    fetchCordinatorTasks: () => void;
    comment: IComment;
}
const CommentEdit = ({ comment, fetchCordinatorTasks }: IProps) => {
    const [open, setOpen] = useState(false);
    const { data, put, setData, processing, reset, clearErrors } = useForm({
        id: comment.id,
        comment: comment.comment,
    });

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false); // Close modal
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData('comment', e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users-tasks-comment.update', data.id), {
            // preserveScroll: true,
            onSuccess: () => {
                fetchCordinatorTasks();
                closeModal();
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Badge variant="outline" onClick={() => setOpen(true)} className="mt-2 ml-2 text-[10px] text-blue-500 hover:cursor-pointer">
                    Edit
                </Badge>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <form onSubmit={handleSubmit} className="mx-10 mt-5">
                        <Textarea value={data.comment} name="comment" onChange={handleCommentChange} required />
                        <div className="mt-5 flex justify-end gap-2">
                            <AlertDialogCancel asChild>
                                <Button type="button" disabled={processing} variant="outline" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </AlertDialogCancel>
                            <Button type="submit" className="px-10" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Update
                            </Button>
                        </div>
                    </form>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CommentEdit;
