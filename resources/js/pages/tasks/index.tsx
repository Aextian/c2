import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const Index = () => {
    const [isGenerating, setGenerating] = useState(false);

    const { post, setData, data, errors } = useForm({
        title: '',
        description: '',
        subtasks: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tasks.store'));
    };

    // const generateSubTasks = async () => {
    //     setGenerating(true);
    //     try {
    //         const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${apiKey}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 model: 'gpt-4-turbo',
    //                 messages: [
    //                     { role: 'system', content: 'You are a helpful assistant.' },
    //                     {
    //                         role: 'user',
    //                         content: `Break down the task "${data.title}" into exactly 4 short, actionable sub-tasks. Keep each sub-task under 10 words.`,
    //                     },
    //                 ],
    //                 max_tokens: 200,
    //             }),
    //         });

    //         const result = await response.json();
    //         setGenerating(false);
    //         console.log(result.choices[0].message.content);
    //         const subtasksArray = result.choices[0].message.content
    //             .split('\n') // Split by new lines
    //             .filter((line) => /^\d+\.\s*/.test(line)) // Keep only numbered lines
    //             .map((line) => line.replace(/^\d+\.\s*/, '').trim()); // Remove "1. ", "2. ", etc.

    //         setData((prevData) => ({ ...prevData, subtasks: subtasksArray }));
    //     } catch (error) {
    //         console.log(error);
    //         setGenerating(false);
    //     }
    // };

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
                .filter((line) => /^\d+\.\s*/.test(line)) // Keep only numbered lines
                .map((line) => line.replace(/^\d+\.\s*/, '').trim()); // Remove "1. ", "2. ", etc.

            setData((prevData) => ({ ...prevData, subtasks: subtasksArray }));
        } catch (error) {
            setGenerating(false);
            console.error('Error generating sub-tasks:', error);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-10 md:min-h-min">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <div className="flex gap-5">
                            <div className="grid grid-cols-1 gap-5">
                                <Label>Title</Label>
                                <Input onChange={handleChange} value={data.title} type="text" name="title" />
                                <InputError message={errors.title} />
                                <Label>Description</Label>
                                {/* <Input onChange={handleChange} value={data.description} type="text" title="name" /> */}
                                <textarea className="focus:ring-opacity-50 0 rounded-sm border border-slate-200 p-2 focus:ring-0 dark:border-gray-600" />

                                <InputError message={errors.description} />
                                <Button disabled={isGenerating} onClick={generateSubTasks}>
                                    {isGenerating ? 'Generating...' : 'Generate Subtasks'}
                                </Button>
                            </div>
                            <div className="grid w-full grid-cols-1 gap-5">
                                {data.subtasks.map((subtask: string, index: number) => (
                                    <Input key={index} value={subtask} type="text" title="name" />
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
