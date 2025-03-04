export type TPermission = {
    id?: number;
    name: string;
    permissions: string[];
};

export interface IRole {
    id?: number;
    name: string;
    permissions?: TPermission[];
}
