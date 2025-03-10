import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IComment } from '@/types/tasks-types';
import { ChangeEvent, Dispatch } from 'react';
import { Badge } from './ui/badge';

interface InputFileProps {
    setData: Dispatch<React.SetStateAction<{ comment: string; file_path: string | FileList | null | File }>>;
    setFileName: Dispatch<React.SetStateAction<string>>;
    fileName: string;
    fileRef: React.RefObject<HTMLInputElement | null>;
}

export function InputFile({ setData, setFileName, fileName, fileRef }: InputFileProps) {
    // handle file

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setFileName(files ? files[0].name : '');
            setData((prevValues: IComment) => ({
                ...prevValues,
                file_path: files[0],
            }));
        }
    };

    return (
        <div className="flex max-w-xs items-center justify-end gap-1.5">
            <div className="flex gap-2">
                <span className="ml-20 w-36 truncate text-xs text-green-500">{fileName}</span>
                <Label>
                    <Badge onClick={() => fileRef.current?.click()} variant="outline">
                        File
                    </Badge>
                </Label>
            </div>
            <Input ref={fileRef} onChange={(e) => handleFileChange(e)} type="file" className="hidden" />
        </div>
    );
}
