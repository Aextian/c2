import { IComment } from '@/types/tasks-types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type TProps = {
    comment: IComment;
    fetchCordinatorTasks: () => void;
};

const CommentDelete = ({ comment, fetchCordinatorTasks }: TProps) => {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('users-tasks-comment.destroy', comment.id), {
            preserveScroll: true,
            onSuccess: () => {
                fetchCordinatorTasks();
                setOpen(false); // Close modal after successful delete
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Badge variant="outline" onClick={() => setOpen(true)} className="mt-2 ml-10 text-[10px] text-red-500 hover:cursor-pointer">
                    Delete
                </Badge>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action <span className="font-semibold text-red-500">cannot be undone</span>. The comment will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button type="button" disabled={processing} variant="outline">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button className="w-full" disabled={processing} type="submit" variant="destructive">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} Delete
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CommentDelete;
