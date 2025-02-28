import { IPermission } from '@/types/permission';

const usePermissions = (permissions: IPermission[]): Record<string, IPermission[]> => {
    return permissions.reduce<Record<string, IPermission[]>>((groups, permission) => {
        const category = permission.name.split('-')[0].toUpperCase();

        // Initialize the category if it doesn't exist
        if (!groups[category]) {
            groups[category] = [];
        }

        // Add the permission to the corresponding category
        groups[category].push(permission);
        return groups;
    }, {});
};

export default usePermissions;
