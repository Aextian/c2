import { TPermission } from '@/types/permission';

const usePermissions = (permissions: TPermission[]): Record<string, TPermission[]> => {
    return permissions.reduce<Record<string, TPermission[]>>((groups, permission) => {
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
