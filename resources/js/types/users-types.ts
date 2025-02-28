import { IRole } from './permission';

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    current_password?: string;
    roles?: IRole[];
}
