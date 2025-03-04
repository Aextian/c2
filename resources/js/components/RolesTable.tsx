import { IRole } from '@/types/permission';
import { Link, usePage } from '@inertiajs/react';
import DeleteDialog from './DeleteDialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const RolesTable = () => {
    const { roles } = usePage<{ roles: IRole[] }>().props;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {roles.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell className="flex gap-2">
                            <Button variant="outline" size={'sm'}>
                                <Link href={route('permissions.edit', role.id)}>Edit</Link>
                            </Button>
                            <DeleteDialog url="permissions.destroy" id={role.id} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RolesTable;
