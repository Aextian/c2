import { IUser } from '@/types/users-types';
import { usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

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
                                <Badge variant="outline" key={roleIndex} >
                                    {role.name}
                                </Badge>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersTable;
