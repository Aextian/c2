export interface ISubTask {
    id?: number;
    task_id?: number;
    content: string;
    percentage?: number;
}

export interface ICordinatorTask {
    id?: number;
    user_id?: number;
    sub_task_id?: number;
    status: string;
    sub_task: ISubTask;
}
