import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFile } from '@/hooks/useFile';
import { IComment } from '@/types/tasks-types';
import { ChangeEvent, Dispatch } from 'react';
import { Badge } from './ui/badge';

interface InputFileProps {
    setComments: Dispatch<React.SetStateAction<IComment[]>>;
    index: number;
}
export function InputFile({ setComments, index }: InputFileProps) {
    const { fileName, onImageChange } = useFile();

    // handle file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target;

        if (files && files.length > 0) {
            onImageChange(e); // Call only if you need to process image preview
            setComments((prevComments) => {
                const updatedComments = [...prevComments];
                updatedComments[index] = {
                    ...updatedComments[index],
                    file_path: files[0], // Store file name instead of value
                };
                return updatedComments;
            });
        }
    };

    return (
        <div className="flex max-w-xs items-center justify-end gap-1.5">
            <div className="flex gap-2">
                <span className="ml-20 w-36 truncate text-xs text-green-500">{fileName}</span>
                <Label htmlFor="file">
                    <Badge variant="outline">File</Badge>
                </Label>
            </div>
            <Input onChange={(e) => handleFileChange(e, index)} id="file" type="file" className="hidden" />
        </div>
    );
}
