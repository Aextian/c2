import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ITask } from '@/types/tasks-types';
import { formatDateTime } from '@/utils/dateUtils';
import { Link, usePage } from '@inertiajs/react';
import DeleteDialog from '../DeleteDialog';
import NoDataAvailable from '../NoDataAvailable';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export function TaskTable() {
    const { tasks } = usePage<{ tasks: ITask[] }>().props;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Coordinator</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">
                            <h1 className="first-letter:uppercase">{task.title}</h1>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                <span className="first-letter:uppercase">{task.status}</span>
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                <span className="first-letter:uppercase">{task.type}</span>
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Progress value={task.progress} className="w-[60%]" />
                                    </TooltipTrigger>
                                    <TooltipContent>{task.progress?.toFixed(2)}%</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                {/* {new Date(task.dead_line || '').toDateString()} */}
                                {/* {new Date(task.dead_line || '').toLocaleString()} */}
                                {formatDateTime(task.dead_line)}
                                {/* {task.dead_line} */}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <ul>
                                <li>
                                    <div className="relative flex items-center">
                                        {task.cordinator_tasks?.map((cordinator_task, index) => (
                                            <TooltipProvider key={index}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className="absolute flex h-5 w-5 items-center justify-center rounded-full bg-black/30 shadow-lg dark:bg-white/30"
                                                            style={{
                                                                left: `${index * 12}px`,
                                                                zIndex: Number(task?.cordinator_tasks?.length || 0) - index,
                                                            }} // Adjust overlap & stacking
                                                        >
                                                            {cordinator_task?.user?.name?.charAt(0)}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{cordinator_task?.user?.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </TableCell>
                        <TableCell className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('users-tasks.show', task.id)}>View</Link>
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                asChild
                                disabled={task.status === 'done'}
                                className={`${task.status === 'done' ? 'pointer-events-none text-gray-400' : ''}`}
                            >
                                <Link
                                    href={route('tasks.edit', task.id)}
                                    onClick={(e) => task.status === 'done' && e.preventDefault()} // Prevent click if disabled
                                    className={task.status === 'done' ? 'pointer-events-none text-gray-400' : ''}
                                >
                                    Edit
                                </Link>
                            </Button>
                            <DeleteDialog url="tasks.destroy" id={task.id} />
                        </TableCell>
                    </TableRow>
                ))}
                {tasks.length === 0 && <NoDataAvailable colSpan={8} title="No tasks found" />}
            </TableBody>
        </Table>
    );
}
