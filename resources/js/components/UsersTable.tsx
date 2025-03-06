import { IUser } from '@/types/users-types';
import { Link, usePage } from '@inertiajs/react';
import DeleteDialog from './DeleteDialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const UsersTable = () => {
    const { users } = usePage<{ users: IUser[] }>().props;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-medium">
                            {user?.roles?.map((role, roleIndex) => (
                                <Badge variant="outline" key={roleIndex}>
                                    {role.name}
                                </Badge>
                            ))}
                        </TableCell>
                        {user.email !== 'admin@example.com' && (
                            <TableCell className="flex gap-2">
                                <Button variant="default" size="sm" asChild>
                                    <Link href={route('users.edit', user.id)}>Edit</Link>
                                </Button>
                                <DeleteDialog url="users.destroy" id={user.id} />
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersTable;
