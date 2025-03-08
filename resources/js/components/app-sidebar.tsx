import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookmarkCheck, LayoutGrid, LucideThermometerSnowflake, ShieldAlert, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: route('dashboard'),
        activeUrl: ['/dashboard'],
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        url: route('users.index'),
        activeUrl: ['/users', '/users/create'],
        icon: Users,
    },
    {
        title: 'Roles and Permissions',
        url: route('permissions.index'),
        activeUrl: ['/permissions', '/permissions/create'],
        icon: ShieldAlert,
    },
    {
        title: 'Tasks',
        url: route('tasks.index'),
        activeUrl: ['/tasks', '/tasks/create', '/tasks/edit'],
        icon: BookmarkCheck,
    },
    {
        title: 'Task Assign',
        url: route('users-tasks.index'),
        activeUrl: ['/users-tasks'],
        icon: LucideThermometerSnowflake,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
