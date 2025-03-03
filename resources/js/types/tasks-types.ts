import { IUser } from './users-types';

export interface ITask {
    id?: number;
    user_id?: number;
    title: string;
    content: string;
    dead_line?: string;
    type: string;
    status: string;
    percentage?: number;
    sub_tasks?: ISubTask[];
    cordinator_tasks?: ICordinatorTask[];
}
export interface ISubTask {
    id?: number;
    task_id?: number;
    content: string;
    percentage?: number;
    task?: ITask;
    comments?: IComment;
    cordinator_task?: ICordinatorTask;
}

export interface ICordinatorTask {
    id?: number;
    user_id?: number;
    sub_task_id?: number;
    status: string;
    sub_task: ISubTask;
    user?: IUser;
}

export interface IComment {
    id?: number;
    user_id?: number;
    sub_task_id?: number | null;
    comment: string;
    file_path?: string;
    user?: IUser;
}
