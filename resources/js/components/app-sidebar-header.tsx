import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { BellDot } from 'lucide-react';
import { useState } from 'react';

type TNotification = {
    id?: number;
    sub_task_id?: number;
    content: string;
    to_user_id?: number;
    from_user_id?: number;
};
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [showNotification, setShowNotification] = useState(false);
    const { notifications } = usePage<TNotification[]>().props;

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
                        2
                    </span>
                    {showNotification && (
                        <div className="absolute top-4 right-6 z-10 w-64 rounded-tl-3xl rounded-br-3xl bg-white p-5 shadow-2xl">
                            <ul>
                                {notifications.map((notification: TNotification) => (
                                    <li>{notification.content}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
