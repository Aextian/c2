import { ICordinatorSubTask, ICordinatorTask } from '@/types/tasks-types';
import { formatDateTime } from '@/utils/dateUtils';
import NoDataAvailable from './NoDataAvailable';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type TProps = {
    cordinator_task: ICordinatorTask;
};
const ShowCoordinatorDone = ({ cordinator_task }: TProps) => {
    const coordinatorDoneInSubTask: ICordinatorSubTask[] =
        cordinator_task?.sub_task?.cordinator_sub_tasks?.filter((task) => task.status === 'done') ?? [];

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Badge className="hover:cursor-pointer" variant={coordinatorDoneInSubTask.length > 0 ? 'default' : 'outline'}>
                    <p className="text-[10px] text-wrap">
                        {coordinatorDoneInSubTask.length} coordinator
                        {coordinatorDoneInSubTask.length !== 1 ? 's have' : ' has'} completed this task.
                    </p>
                </Badge>
            </AlertDialogTrigger>
            <AlertDialogContent className="md:min-w-[600px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Coordinators Who Have Completed This Task</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Completion Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coordinatorDoneInSubTask.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">
                                            <h1 className="first-letter:uppercase">{task?.user?.name} </h1>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                <span className="first-letter:uppercase">{task.status}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                <span className="first-letter:uppercase">{formatDateTime(task.updated_at)}</span>
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {coordinatorDoneInSubTask.length === 0 && (
                                    <NoDataAvailable colSpan={3} title="No coordinators have completed this task yet." />
                                )}
                            </TableBody>
                        </Table>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button type="button" variant="outline">
                            ok
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ShowCoordinatorDone;
