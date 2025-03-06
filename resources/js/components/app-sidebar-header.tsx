import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { IUser } from '@/types/users-types';
import { Link, usePage } from '@inertiajs/react';
import { BellDot } from 'lucide-react';
import { useState } from 'react';

type TNotification = {
    id?: number;
    sub_task_id?: number;
    content: string;
    to_user_id?: number;
    is_read?: boolean;
    from_user_id?: number;
    from_user: IUser;
};
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [showNotification, setShowNotification] = useState(false);
    const { notifications } = usePage<{ notifications: TNotification[] }>().props;

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <button className="relative" onClick={() => setShowNotification(!showNotification)}>
                    <BellDot className="text-muted-foreground" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {notifications.filter((notification) => !notification.is_read).length}
                    </span>
                    {showNotification && (
                        <div className="absolute top-4 right-6 z-10 min-w-64 rounded-tl-3xl rounded-br-3xl bg-white p-5 shadow-2xl">
                            <ul className="flex flex-col items-start justify-start">
                                {notifications.map((notification) => (
                                    <Link
                                        className={`block cursor-pointer hover:text-gray-400 ${notification.is_read ? 'text-gray-400' : ''}`}
                                        key={notification.id}
                                        href={route('users-tasks.show', notification.sub_task_id)}
                                    >
                                        <li className="whitespace-nowrap">
                                            <span className="text-xs -tracking-wide">
                                                <span className="font-semibold text-gray-500">{notification.from_user.name}: </span>
                                                {notification.content}
                                            </span>
                                        </li>
                                    </Link>
                                ))}
                                {notifications.length === 0 && <li>No Notification</li>}
                            </ul>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
