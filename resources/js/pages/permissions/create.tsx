import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import usePermissions from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IPermission } from '@/types/permission';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface IProps {
    permissions: IPermission[];
}

const Create = ({ permissions }: IProps) => {
    const { post, setData, data, processing, errors } = useForm<IPermission>({
        name: '',
        permissions: [],
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = route('permissions.store');
        post(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // toast.success('Role added successfully');
            },
            onError: (error) => {
                // toast.error(error.message);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setData((prevValues: IPermission) => ({
            ...prevValues,
            [name]:
                type === 'checkbox'
                    ? checked
                        ? [...prevValues.permissions, value]
                        : prevValues.permissions.filter((id: string) => id !== value)
                    : value,
        }));
    };

    const groupedPermissions = usePermissions(permissions);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="permissions" />
            <form onSubmit={handleSubmit} className="mx-auto mt-5 grid w-8/12 gap-5">
                <Label className="flex flex-col gap-2">
                    <span>Name:</span>
                    <Input type="text" name="name" onChange={handleChange} className="input input-sm md:input-sm w-full max-w-xs" />
                    <InputError message={errors.name} className="mt-2" />
                </Label>
                <div className="flex flex-col gap-2">
                    <span>Permissions:</span>
                    <InputError message={errors.permissions} className="mt-2" />
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        {Object.entries(groupedPermissions).map(([header, group]) => (
                            <div key={header}>
                                <h2 className="font-bold">{header}</h2>
                                <ul>
                                    {group.map((permission) => (
                                        <li key={permission.id} className="mt-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    checked={data.permissions.includes(permission.name)}
                                                    className="checkbox checkbox-sm"
                                                    value={permission.name}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-xs">{permission.name}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {' '}
                        {processing ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
};

export default Create;
