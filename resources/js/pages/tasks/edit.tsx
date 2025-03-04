import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectGroup, SelectItem, SelectLabel, Select as SelectPrimitive, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ITask } from '@/types/tasks-types';
import { IUser } from '@/types/users-types';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, useRef, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

export type TOption = {
    id?: number;
    subTask: string;
    userIds?: number[];
};
interface IProps {
    users: IUser[];
    task: ITask;
}
type TTaskForm = {
    title: string;
    content: string;
    options: TOption[];
    deadLine: string;
    type: 'minor' | 'important' | 'urgent';
};

const Create = ({ users, task }: IProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: '/tasks',
        },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectRef = useRef<any>(null);
    const [isGenerating, setGenerating] = useState(false);
    const { appearance } = useAppearance(); // Get current theme from ShadCN UI

    const isDark = appearance === 'dark'; // Check if dark mode is enabled

    const { put, setData, data, errors, processing, clearErrors, reset } = useForm<TTaskForm>({
        title: task.title,
        content: task.content,
        deadLine: task.dead_line ?? '',
        type: task.type,
        options:
            task.sub_tasks?.map((subTask) => ({
                id: subTask.id,
                subTask: subTask.content,
                userIds: subTask.cordinator_sub_tasks?.map((user) => user.user_id).filter((id) => id !== undefined) ?? [],
            })) ?? [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubTaskChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = e.target;
        setData((prevData) => {
            const updatedOptions = [...prevData.options];
            updatedOptions[index] = { ...updatedOptions[index], [name]: value };
            return { ...prevData, options: updatedOptions };
        });
    };

    const handleSubtTaskRemove = (index: number) => {
        setData((prevData) => ({
            ...prevData,
            options: prevData.options.filter((_, i) => i !== index), // 🔹 Removes the item at `index`
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = route('tasks.update', task.id);
        put(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                reset(), clearErrors();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const generateSubTasks = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/openai/generate-subtasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                }),
            });
            const result = await response.json();
            setGenerating(false);
            const subtasksArray = result.choices[0].message.content
                .split('\n') // Split by new lines
                .filter((line: string) => /^\d+\.\s*/.test(line)) // Keep only numbered lines
                .map((line: string) =>
                    line
                        .replace(/^\d+\.\s*/, '') // Remove "1. ", "2. ", etc.
                        .replace(/\*\*/g, '') // Remove all occurrences of "**"
                        .trim(),
                );
            setData((prevData) => ({
                ...prevData,
                options: subtasksArray.map((subtask: string, i: number) => ({
                    ...prevData.options[i],
                    subTask: subtask,
                })),
            }));
            toast.success('Sub-tasks generated successfully');
        } catch (error) {
            setGenerating(false);
            console.error('Error generating sub-tasks:', error);
        }
    };

    // Create options for the Select component
    const usersOptions = users.map((user) => ({
        value: user.id as number,
        label: user.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-5 border-r p-5">
                                <div className="flex max-h-fit flex-1 flex-col gap-5 self-end">
                                    <Label>Dead line</Label>
                                    <Input onChange={handleChange} value={data.deadLine} type="date" name="deadLine" />
                                    <InputError message={errors.deadLine} />
                                </div>
                                <Label>Title</Label>
                                <Input onChange={handleChange} value={data.title} type="text" name="title" />
                                <InputError message={errors.title} />
                                <Label>Type</Label>
                                <SelectPrimitive
                                    value={data.type}
                                    onValueChange={(value) => setData({ ...data, type: value as Pick<TTaskForm, 'type'>['type'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Type</SelectLabel>
                                            <SelectItem value="minor">Minor</SelectItem>
                                            <SelectItem value="important">Important</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </SelectPrimitive>
                                <InputError message={errors.type} />
                                <Label>Content</Label>
                                <Textarea
                                    onChange={handleChange}
                                    value={data.content}
                                    name="content"
                                    rows={4}
                                    placeholder="Type your message here."
                                />
                                <InputError message={errors.content} />
                                <Button type="button" disabled={isGenerating || !data.title} onClick={generateSubTasks}>
                                    {isGenerating ? 'Regenerating...' : 'Regenerate Subtasks'}
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {data.options.map((option, index: number) => (
                                    <div key={index} className="flex flex-col gap-5 border p-2">
                                        <div className="flex justify-between">
                                            <h1 className="font-bold">Subtask {index + 1}</h1>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => handleSubtTaskRemove(index)}>
                                                Delete
                                            </Button>
                                        </div>
                                        <Input value={option.subTask} onChange={(e) => handleSubTaskChange(e, index)} type="text" name="subTask" />
                                        <Select
                                            ref={selectRef}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isLoading={false}
                                            isClearable={true}
                                            isSearchable={true}
                                            isMulti
                                            required
                                            value={
                                                data.options[index]?.userIds &&
                                                data.options[index]?.userIds.map((id) => usersOptions.find((user) => user.value === id))
                                            }
                                            onChange={(data) =>
                                                setData((prevValues: TTaskForm) => ({
                                                    ...prevValues,
                                                    options: prevValues.options.map((option: TOption, i: number) =>
                                                        i === index
                                                            ? {
                                                                  ...option,
                                                                  userIds: data.map((item) => item && item.value).filter((id) => id !== undefined),
                                                              }
                                                            : option,
                                                    ),
                                                }))
                                            }
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: isDark ? '#1E293B' : 'white', // Tailwind dark:bg-gray-800
                                                    borderColor: state.isFocused ? (isDark ? '#475569' : '#CBD5E1') : isDark ? '#334155' : '#E2E8F0',
                                                    color: isDark ? 'white' : 'black',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: isDark ? '#1E293B' : 'white', // Dark: bg-slate-800
                                                    color: isDark ? 'white' : 'black',
                                                }),
                                                option: (base, { isFocused, isSelected }) => ({
                                                    ...base,
                                                    backgroundColor: isSelected
                                                        ? isDark
                                                            ? '#334155'
                                                            : '#E2E8F0'
                                                        : isFocused
                                                          ? isDark
                                                              ? '#475569'
                                                              : '#CBD5E1'
                                                          : 'transparent',
                                                    color: isDark ? 'white' : 'black',
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: isDark ? 'white' : 'black',
                                                }),
                                            }}
                                            options={usersOptions}
                                            placeholder="Select Employee"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {data.options && data.options.length > 0 && (
                            <div className="flex justify-end">
                                <Button disabled={isGenerating || processing} type="submit">
                                    {processing ? 'Updating...' : 'Update'}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
