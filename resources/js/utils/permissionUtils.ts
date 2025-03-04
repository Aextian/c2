// utils/permissionUtils.ts
export const hasPermissions = (userPermissions: string[], requiredPermissions: string[]) => {
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
};
