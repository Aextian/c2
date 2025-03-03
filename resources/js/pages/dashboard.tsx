import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid -min gap-4 md:grid-cols-4">
                    <div className="border-sidebar-border/70  p-5 dark:border-sidebar-border relative aspect-video rounded-xl border">
                    <h1>Todo</h1>
                    <ul className='list-disc text-xs text-gray-500 flex flex-col mt-5 gap-5 mx-5'>

                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button>
                             </li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span >
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                    </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                     <div className="border-sidebar-border/70  p-5 dark:border-sidebar-border relative aspect-video rounded-xl border">
                    <h1>Doing</h1>
                    <ul className='list-disc text-xs text-gray-500 flex flex-col mt-5 gap-5 mx-5'>

                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button>
                             </li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span >
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                    </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                     <div className="border-sidebar-border/70  p-5 dark:border-sidebar-border relative aspect-video rounded-xl border">
                    <h1>Done</h1>
                    <ul className='list-disc text-xs text-gray-500 flex flex-col mt-5 gap-5 mx-5'>

                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button>
                             </li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span >
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                    </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                     <div className="border-sidebar-border/70  p-5 dark:border-sidebar-border relative aspect-video rounded-xl border">
                    <h1>Cancelled</h1>
                    <ul className='list-disc text-xs text-gray-500 flex flex-col mt-5 gap-5 mx-5'>

                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button>
                             </li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span >
                             <Button variant="outline" size="sm">View</Button></li>
                        <li className='flex justify-between items-center'>
                            <span className='truncate' >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, fugiat.
                            </span>
                             <Button variant="outline" size="sm">View</Button></li>
                    </ul>
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
            </div>
        </AppLayout>
    );
}
