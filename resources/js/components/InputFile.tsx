import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IComment } from '@/types/tasks-types';
import { ChangeEvent, Dispatch } from 'react';
import { Badge } from './ui/badge';

interface InputFileProps {
    setComments: Dispatch<React.SetStateAction<IComment[]>>;
    setFileNames: Dispatch<React.SetStateAction<TFileName[]>>;
    fileNames: TFileName[];
    index: number;
}
type TFileName = {
    name: string;
};
export function InputFile({ setFileNames, setComments, index, fileNames }: InputFileProps) {
    // handle file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target;

        if (files && files.length > 0) {
            setFileNames((prevFileNames) => {
                const updatedFileNames = [...prevFileNames];
                updatedFileNames[index] = {
                    ...updatedFileNames[index],
                    name: files ? files[0].name : '',
                };
                return updatedFileNames;
            });

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

    console.log('sdsd', index);
    return (
        <div className="flex max-w-xs items-center justify-end gap-1.5">
            <div className="flex gap-2">
                <span className="ml-20 w-36 truncate text-xs text-green-500">{fileNames[index].name}</span>
                <Label htmlFor="file">
                    <Badge variant="outline">File</Badge>
                </Label>
            </div>
            <Input onChange={(e) => handleFileChange(e, index)} id="file" type="file" className="hidden" />
        </div>
    );
}
