import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ROLE_PERMISSIONS, TASK_PERMISSIONS, USER_PERMISSIONS } from '@/constants/permissions';
import { type NavItem } from '@/types';
import { hasPermissions } from '@/utils/permissionUtils';
import { Link, usePage } from '@inertiajs/react';

type TPageProps = {
    url: string;
    permissions: string[];
};
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<TPageProps>();

    const permissionMap: Record<string, string[]> = {
        Users: USER_PERMISSIONS,
        'Roles and Permissions': ROLE_PERMISSIONS,
        Tasks: TASK_PERMISSIONS,
    };
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>

            <SidebarMenu>
                {items
                    .filter(
                        (item) =>
                            item.title === 'Dashboard' ||
                            item.title === 'Task Assign' || // Always show Dashboard
                            (permissionMap[item.title] && hasPermissions(page.props.permissions, permissionMap[item.title])),
                    )
                    .map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.activeUrl.includes(page.url)}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
