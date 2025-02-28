import { IRole } from '@/types/permission';
import { usePage } from '@inertiajs/react';
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RolesTable;
