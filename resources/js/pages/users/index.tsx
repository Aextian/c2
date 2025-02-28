import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IUser } from '@/types/users-types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];
interface IProps {
    users: IUser[];
}
const index = ({ users }: IProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Link href={route('users.create')} className="bg-primary self-end rounded-md px-4 py-2 text-black">
                    Create User
                </Link>
                <div className="overflow-x-auto">
                    <table className="table-zebra table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Roles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>
                                        {user?.roles?.map((role, roleIndex) => (
                                            <span key={roleIndex} className="badge badge-primary badge-xs mr-1">
                                                {role.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link href={route('users.edit', user.id)} className="btn btn-success btn-xs">
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default index;
