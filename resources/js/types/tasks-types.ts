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
}
export interface ISubTask {
    id?: number;
    task_id?: number;
    content: string;
    percentage?: number;
    task?: ITask;
    comments?: IComment;
}

export interface ICordinatorTask {
    id?: number;
    user_id?: number;
    sub_task_id?: number;
    status: string;
    sub_task: ISubTask;
}

export interface IComment {
    id?: number;
    user_id?: number;
    sub_task_id?: number | null;
    comment: string;
    file_path?: string;
    user?: IUser;
}
