import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IRole } from '@/types/permission';
import { IUser } from '@/types/users-types';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeClosed } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface IProps {
    roles: IRole[];
    user: IUser;
}

const Edit = ({ roles, user }: IProps) => {
    const { put, setData, data, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles?.map((role) => role.name) || [],
    });

    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmShowPassword, setconfirmShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;
        // Handle multi-select case
        const newValue = multiple ? Array.from(selectedOptions, (option) => option.value) : value;
        setData((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:w-6/12">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <Label>Name</Label>
                        <Input onChange={handleChange} value={data.name} type="text" name="name" />
                        <InputError message={errors.name} />

                        <Label>Email</Label>
                        <Input name="email" onChange={handleChange} value={data.email} />
                        <InputError message={errors.email} />

                        <Label>Password</Label>
                        <div className="relative">
                            {passwordShow ? (
                                <Eye
                                    onClick={() => setPasswordShow(!passwordShow)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    size={20}
                                />
                            ) : (
                                <EyeClosed
                                    onClick={() => setPasswordShow(!passwordShow)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    size={20}
                                />
                            )}
                            <Input type={passwordShow ? 'text' : 'password'} name="password" onChange={handleChange} value={data.password} />
                        </div>
                        <InputError message={errors.password} />

                        <Label>Confirm Password</Label>
                        <div className="relative">
                            {confirmShowPassword ? (
                                <Eye
                                    onClick={() => setconfirmShowPassword(!confirmShowPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    size={20}
                                />
                            ) : (
                                <EyeClosed
                                    onClick={() => setconfirmShowPassword(!confirmShowPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    size={20}
                                />
                            )}
                            <Input
                                type={confirmShowPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                onChange={handleChange}
                                value={data.password_confirmation}
                            />
                        </div>

                        <InputError message={errors.password_confirmation} />

                        <Label className="flex flex-col gap-2">
                            <span>Role:</span>
                            <select
                                name="roles"
                                onChange={handleChange}
                                value={data.roles}
                                multiple
                                className="select select-bordered select-xs w-full"
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.roles} className="mt-2" />
                        </Label>

                        <Button disabled={processing} type="submit">
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Edit;
