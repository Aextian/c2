import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

type TProps = {
    url: string;
    id?: number;
};
const DeleteDialog = ({ url, id }: TProps) => {
    const { delete: destroy, processing, reset, clearErrors } = useForm();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        try {
            destroy(route(url, id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={processing} size={'sm'}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button type="button" disabled={processing} variant="outline">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button className="w-full" disabled={processing} type="submit" variant="destructive" asChild>
                            <AlertDialogAction>Delete</AlertDialogAction>
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
