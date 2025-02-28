import { IUser } from '@/types/users-types';
import { usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const UsersTable = () => {
    const { users } = usePage<{ users: IUser[] }>().props;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Roles</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-medium">
                            {user?.roles?.map((role, roleIndex) => (
                                <span key={roleIndex} className="badge badge-primary badge-xs mr-1">
                                    {role.name}
                                </span>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersTable;
