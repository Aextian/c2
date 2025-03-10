import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { IUser } from '@/types/users-types';
import { Link, usePage } from '@inertiajs/react';
import { BellDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type TNotification = {
    id?: number;
    sub_task_id?: number;
    content: string;
    to_user_id?: number;
    is_read?: boolean;
    from_user_id?: number;
    from_user: IUser;
};
type TPage = { auth: { user: IUser }; notifications: TNotification[] };
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [showNotification, setShowNotification] = useState(false);
    const { auth, notifications } = usePage<TPage>().props;
    const [newNotifications, setNewNotifications] = useState<TNotification[]>(notifications);

    useEffect(() => {
        const channel = window.Echo.private(`notification.${auth.user?.id}`);
        channel.listen('.NotificationReceived', (e: { notification: TNotification }) => {
            setNewNotifications((prevNotifications) => [...prevNotifications, e.notification]);
            toast.dark('You have a new notification');
        });
        return () => {
            channel.stopListening('.NotificationReceived');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleShowNotification = () => {
        setShowNotification(!showNotification);
    };

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {showNotification && <div className="fixed top-0 right-0 z-10 h-screen w-screen" onClick={() => setShowNotification(false)} />}

                <button className="relative" onClick={handleShowNotification}>
                    <BellDot className="text-muted-foreground" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {newNotifications.filter((notification) => !notification.is_read).length}
                    </span>
                    {showNotification && (
                        <div className="absolute top-4 right-6 z-20 min-w-64 rounded-tl-3xl rounded-br-3xl bg-white p-5 shadow-2xl">
                            <ul className="flex flex-col items-start justify-start">
                                {newNotifications.map((notification) => (
                                    <Link
                                        className={`block cursor-pointer hover:text-gray-400 ${notification.is_read ? 'text-gray-400' : ''}`}
                                        key={notification.id}
                                        href={route('users-task.show', notification.sub_task_id)}
                                    >
                                        <li className="whitespace-nowrap">
                                            <span className="text-xs -tracking-wide">
                                                <span className="font-semibold text-gray-500">{notification.from_user.name}: </span>
                                                {notification.content}
                                            </span>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                            {newNotifications.length === 0 && <p className="text-center text-xs">No Notification</p>}
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
